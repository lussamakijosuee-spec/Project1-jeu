//=============================================================================
// JournalDeCombatLisible.js — v1.0
// Le journal de combat ne coupe plus ses phrases
// RPG Maker MV
//=============================================================================

/*:
 * @plugindesc v1.0 ■ Le journal de combat fait tenir ses lignes : une phrase
 * trop longue rétrécit au lieu d'être coupée au bord de la fenêtre.
 *
 * @param taille minimale
 * @text Taille minimale
 * @type number
 * @min 10
 * @max 28
 * @desc En dessous de cette taille de police, on ne rétrécit plus (ça ne se lirait plus).
 * @default 16
 *
 * @help
 * ============================================================================
 *  Pourquoi ce plugin existe
 * ============================================================================
 *
 * Le journal de combat dessine ses lignes avec drawTextEx, qui ne borne rien :
 * une phrase plus large que la fenêtre déborde, et la fenêtre la coupe — sans
 * une erreur, sans un signe. Mesuré en jouant, sur 816 px de large :
 *
 *   « Korrah renvoie l'attaque : Gargal, le Premier Croc frapp »   (coupé)
 *   « L'air se tend. Quelque chose de trop grand vient de sortir. » 826 px
 *   « Gargal, le Premier Croc est violemment projeté ... »          966 px
 *
 * Les deux dernières sont des messages de compétence, écrits par JOKO, où le
 * nom d'un ennemi vient s'insérer. On ne raccourcit donc pas la phrase — on
 * ne renomme rien de ce qui s'affiche : c'est la TAILLE de la police qui cède,
 * ligne par ligne, jusqu'à ce que la phrase entre.
 *
 * Une ligne qui tenait déjà n'est pas touchée : elle garde sa taille normale.
 *
 * ============================================================================
 *  Où il se branche
 * ============================================================================
 *
 * Il enveloppe drawLineText SANS le remplacer : le centrage de
 * YEP_BattleEngineCore (<CENTER>, <SIMPLE>) continue de faire son travail. La
 * taille réduite passe par standardFontSize, que resetFontSettings et
 * drawTextEx consultent tous les deux — donc les trois chemins de dessin
 * (ordinaire, centré, simplifié) la respectent.
 *
 * À placer APRÈS YEP_BattleEngineCore dans la liste des plugins.
 */

(function () {
    'use strict';

    var params = PluginManager.parameters('JournalDeCombatLisible');
    var MINI = Number(params['taille minimale'] || 16);

    // La taille normale, relue à chaque appel : si un autre plugin change
    // celle de Window_Base, on suit.
    function tailleNormale(fenetre) {
        return Window_Base.prototype.standardFontSize.call(fenetre);
    }

    Window_BattleLog.prototype.standardFontSize = function () {
        if (this._tailleForcee) { return this._tailleForcee; }
        return tailleNormale(this);
    };

    var _drawLineText = Window_BattleLog.prototype.drawLineText;
    Window_BattleLog.prototype.drawLineText = function (index) {
        var rect = this.itemRectForText(index);
        var texte = String(this._lines[index] || '');
        // Ce qui occupe vraiment de la largeur : ni les repères <CENTER> et
        // <SIMPLE>, ni les codes \C[n] / \I[n], qui ne sont pas des lettres.
        var visible = this.convertEscapeCharacters(texte)
            .replace(/<[^>]+>/g, '')
            .replace(/\x1b\w+(\[\d+\])?/g, '');
        var normale = tailleNormale(this);
        var taille = normale;
        var garde = this.contents.fontSize;
        this.contents.fontSize = taille;
        while (taille > MINI && this.textWidth(visible) > rect.width) {
            taille -= 1;
            this.contents.fontSize = taille;
        }
        var largeFinale = this.textWidth(visible);
        this.contents.fontSize = garde;
        // Ce que la ligne mesure VRAIMENT une fois dessinée : un contrôle peut
        // le relire au lieu de refaire le calcul de son côté.
        this._derniereLigne = { texte: visible, taille: taille, large: largeFinale, place: rect.width };
        this._tailleForcee = (taille < normale) ? taille : 0;
        _drawLineText.call(this, index);
        this._tailleForcee = 0;
    };
})();
