//=============================================================================
// TexteQuiTient.js — v1.0  ·  Le texte tient dans sa fenêtre
// RPG Maker MV   ·   pour JOKO
//   À placer APRÈS YEP_MessageCore.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Une ligne de dialogue trop longue passe à la ligne au
 * lieu d'être coupée ; une description trop longue se replie pour tenir.
 * @author JOKO
 *
 * @param dialogues
 * @text Dialogues : passer à la ligne
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Une ligne qui dépasse la fenêtre continue sur la ligne suivante (et sur une nouvelle page s'il le faut).
 *
 * @param descriptions
 * @text Descriptions : se replier
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Une description trop longue pour la fenêtre d'aide se replie, puis rapetisse jusqu'à tenir.
 *
 * @param tailleMin
 * @text Plus petite taille d'une description
 * @type number
 * @min 12
 * @max 28
 * @default 16
 * @desc À 16, une description a droit à 3 lignes au lieu de 2.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE TEXTE QUI TIENT
 * ═══════════════════════════════════════════════════════════════════════════
 *  Mesuré le 2026-10-02 (bancs/navigateur/les_textes_qui_debordent.js), avec
 *  la police du jeu : 155 lignes de dialogue sur 8 870 dépassaient la
 *  fenêtre, et MV coupe ce qui dépasse sans rien dire. Exemple, l'événement
 *  commun 11, avec un visage :
 *
 *     « Alors, toujours aussi lente aujourd'hui ? Tu »   ← le reste disparaît
 *
 *  Et 388 descriptions sur 1 387 étaient coupées dans la fenêtre d'aide
 *  (compétences, objets, armes, armures).
 *
 *  ── LES DIALOGUES ─────────────────────────────────────────────────────
 *  Tes retours à la ligne sont gardés tels quels. Seulement quand un mot
 *  sortirait de la fenêtre, il passe à la ligne suivante ; si le message
 *  dépasse alors 4 lignes, MV continue sur une page suivante après un appui,
 *  comme d'habitude. Rien n'est changé dans tes textes : c'est l'affichage
 *  qui s'adapte. Le visage est pris en compte.
 *
 *  Pour ne pas laisser un mot tout seul sur sa ligne, une ligne qui déborde
 *  se raccroche à la suivante quand la phrase continue (pas de point final,
 *  ou la suite commence par une minuscule). Une phrase finie garde son
 *  retour à la ligne.
 *
 *  La balise <WordWrap> de YEP continue de marcher comme avant (repli
 *  complet, tes retours à la ligne ignorés, <br> pour forcer).
 *
 *  ── LES DESCRIPTIONS ──────────────────────────────────────────────────
 *  Si une description ne tient pas sur ses 2 lignes, elle est repliée aux
 *  espaces, puis écrite un peu plus petit, jusqu'à tenir. À la taille 16,
 *  une troisième ligne devient possible. Une description qui tenait déjà
 *  est dessinée exactement comme avant.
 *
 *  ── AILLEURS ──────────────────────────────────────────────────────────
 *  Le même repli sert au texte d'accueil du journal des quêtes (il était
 *  coupé à droite), et le compteur du livre des musiques ne rogne plus sa
 *  parenthèse. Trouvés par bancs/navigateur/tous_les_menus.js, qui ouvre
 *  chaque écran et repère tout texte tracé hors de son cadre.
 *
 *  Aucune commande, aucune balise : il suffit qu'il soit allumé.
 */
var TexteQuiTient = window.TexteQuiTient || {};
window.TexteQuiTient = TexteQuiTient;
(function () {
    'use strict';
    var P = PluginManager.parameters('TexteQuiTient');
    var DIALOGUES = String(P.dialogues || 'true') === 'true';
    var DESCRIPTIONS = String(P.descriptions || 'true') === 'true';
    var MIN = Math.max(12, Number(P.tailleMin || 16));

    //=========================================================================
    // LES DIALOGUES — le repli de YEP, mais seulement là où ça dépasse
    //=========================================================================
    // YEP_MessageCore sait déjà replier (checkWordWrap : au moment d'écrire
    // une espace, il mesure le mot qui suit et passe à la ligne s'il sort de
    // la fenêtre). Il ne le fait que sous <WordWrap>, et alors il APLATIT les
    // retours à la ligne. Ici on allume seulement la vérification, sans rien
    // aplatir : les lignes de JOKO restent, celles qui débordent se replient.
    function replierSiCaDepasse(Fenetre) {
        if (!Fenetre || !Window_Base.prototype.setWordWrap || !Window_Base.prototype.checkWordWrap) return;
        var _setWordWrap = Window_Base.prototype.setWordWrap;
        Fenetre.prototype.setWordWrap = function (text) {
            text = _setWordWrap.call(this, text);
            // ⚠ pas pendant une mesure : textWidthExCheck repasse par ici pour
            //   mesurer un mot, et rallumer le repli le ferait se mesurer sans fin
            if (!this._wordWrap && !this._checkWordWrapMode) this._wordWrap = true;
            return text;
        };
    }
    // Une ligne qui déborde, dans une phrase qui continue à la ligne
    // suivante, laisserait un mot orphelin : « …promis / ou / murmuré… ».
    // Avant d'écrire, on raccroche donc la ligne suivante à celle qui
    // déborde — seulement si la phrase continue : la ligne ne finit pas par
    // une ponctuation de fin (. ! ? … » : ;), ou la suivante commence par
    // une minuscule. Une ligne qui tient, ou une phrase finie, garde son
    // retour à la ligne : c'est la mise en page de JOKO.
    var CODES = /\x1b[A-Z]+\[[^\]]*\]|\x1b[A-Z]+<[^>]*>|\x1b./gi;
    function propre(t) { return String(t).replace(CODES, '').trim(); }
    function continue_(a, b) {
        var fa = propre(a), db = propre(b);
        if (!fa || !db) return false;
        if (/^\p{Ll}/u.test(db)) return true;
        return !/[.!?…»:;]$/.test(fa);
    }
    TexteQuiTient.raccrocher = function (fenetre, texte, depart) {
        var dispo = (fenetre.wordwrapWidth ? fenetre.wordwrapWidth() : fenetre.contentsWidth()) - depart;
        var lignes = String(texte).split('\n');
        for (var i = 0; i < lignes.length - 1; i++) {
            var largeur = fenetre.textWidthExCheck ? fenetre.textWidthExCheck(lignes[i]) : fenetre.textWidthEx(lignes[i]);
            if (largeur > dispo && continue_(lignes[i], lignes[i + 1])) {
                lignes.splice(i, 2, lignes[i].replace(/\s+$/, '') + ' ' + lignes[i + 1].replace(/^\s+/, ''));
                i--;   // la ligne jointe peut encore déborder et continuer
            }
        }
        return lignes.join('\n');
    };

    if (DIALOGUES) {
        replierSiCaDepasse(Window_Message);
        var _start = Window_Message.prototype.startMessage;
        Window_Message.prototype.startMessage = function () {
            _start.call(this);
            var ts = this._textState;
            if (ts && ts.index === 0 && ts.text && ts.text.indexOf('\n') >= 0) {
                var t = TexteQuiTient.raccrocher(this, ts.text, ts.left || 0);
                if (t !== ts.text) { ts.text = t; ts.height = this.calcTextHeight(ts, false); }
            }
        };
        // le texte d'accueil du journal des quêtes était coupé à droite
        // (tous_les_menus.js) : même repli, là où ça dépasse seulement
        if (typeof Window_QuestData !== 'undefined') replierSiCaDepasse(Window_QuestData);
    }

    // Le compteur du livre des musiques (MOG) s'alignait sur une largeur de
    // 4 pixels plus grande que son cadre : la parenthèse finale était rognée.
    if (typeof Window_MusicComp !== 'undefined') {
        Window_MusicComp.prototype.refresh = function () {
            this.contents.clear();
            var n = this._data.length, vus = this._data_comp.length;
            var comp = n ? Math.floor((vus / n) * 100) : 0;
            this.drawText(Moghunter.musicbook_completion_word + ' ' + comp + ' % ', 0, 0, 200, 'left');
            this.drawText('(' + vus + '/' + n + ')', 0, 0, this.contentsWidth(), 'right');
        };
    }

    //=========================================================================
    // LES DESCRIPTIONS — replier, puis rapetisser jusqu'à tenir
    //=========================================================================
    if (DESCRIPTIONS) {
        var _std = Window_Help.prototype.standardFontSize;
        Window_Help.prototype.standardFontSize = function () {
            return this._tqtTaille || _std.call(this);
        };

        // largeur d'un morceau de texte à la taille courante (codes compris)
        Window_Help.prototype._tqtLargeur = function (s) {
            if (s.indexOf('\\') < 0) return this.textWidth(s);
            var t = this.contents.fontSize, w = this.textWidthEx(s);
            this.contents.fontSize = t;
            return w;
        };

        // les lignes d'un texte replié à la largeur donnée, à la taille courante
        Window_Help.prototype._tqtReplier = function (texte, largeur) {
            var self = this, lignes = [];
            texte.split('\n').forEach(function (para) {
                var mots = para.split(' '), ligne = '';
                mots.forEach(function (mot) {
                    var essai = ligne ? ligne + ' ' + mot : mot;
                    if (!ligne || self._tqtLargeur(essai) <= largeur) ligne = essai;
                    else { lignes.push(ligne); ligne = mot; }
                });
                lignes.push(ligne);
            });
            return lignes;
        };

        // la taille et les lignes qui tiennent (gardées par texte : un
        // curseur qui bouge ne refait pas la mesure)
        Window_Help.prototype._tqtMiseEnPage = function (texte) {
            this._tqtCache = this._tqtCache || {};
            if (this._tqtCache[texte]) return this._tqtCache[texte];
            var largeur = this.contentsWidth() - this.textPadding() * 2, hauteur = this.contentsHeight();
            var base = _std.call(this), choix = null;
            for (var t = base; t >= MIN; t -= 2) {
                this._tqtTaille = t; this.resetFontSettings();
                var lignes = this._tqtReplier(texte, largeur);
                var pareil = lignes.join('\n') === texte;
                choix = { taille: t, lignes: lignes, pareil: pareil && t === base };
                if (lignes.length * (t + 8) <= hauteur) break;   // MV : une ligne = taille + 8
            }
            this._tqtTaille = 0; this.resetFontSettings();
            return (this._tqtCache[texte] = choix);
        };

        var _refresh = Window_Help.prototype.refresh;
        Window_Help.prototype.refresh = function () {
            var texte = this._text;
            // rien à faire, ou repli demandé à YEP : dessin d'origine
            if (!texte || /<WordWrap>/i.test(texte) || !this.contents) return _refresh.call(this);
            var m = this._tqtMiseEnPage(String(texte));
            if (m.pareil) return _refresh.call(this);   // tenait déjà : exactement comme avant
            this.contents.clear();
            this._tqtTaille = m.taille;
            this.contents.fontSize = m.taille;   // la 1re ligne est mesurée avant la remise à zéro
            this.drawTextEx(m.lignes.join('\n'), this.textPadding(), 0);
            this._tqtTaille = 0;
            this.resetFontSettings();
        };
    }

    TexteQuiTient.miseEnPage = function (fenetre, texte) { return fenetre._tqtMiseEnPage(texte); };
})();
