//=============================================================================
// RangsPuissance.js — v1.0  ·  Les Rangs de puissance (D → S · l'Astre)
// RPG Maker MV   ·   by JOKO   ·   d'après le Codex des Trois Sources
//=============================================================================
/*:
 * @plugindesc v1.0 ■ L'échelle de l'Ordre d'Or : rang D→S calculé sur les
 * réserves, la maîtrise d'un art et les paliers d'aura. Le Semi-Parfait vaut
 * un cran de plus. Ennemis : <Rang: X> annoncé au combat. Additif.
 * @author JOKO
 *
 * @param menuCommand
 * @text Entrée Menu (vide = aucune)
 * @type string
 * @default Rangs
 *
 * @param annonceEnnemis
 * @text Annoncer le rang des ennemis ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc « Voir l'aura d'un adversaire, c'est jauger d'un regard à quel palier il se bat. »
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES RANGS DE PUISSANCE                                              by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  « L'Ordre d'Or forgea une échelle ; le monde entier l'a reprise. Elle pèse
 *   trois choses : les RÉSERVES de source, la MAÎTRISE d'un art, et le nombre
 *   de PALIERS D'AURA qu'on peut tenir. »
 *
 *  ▶ CALCUL (héros) — trois poids, comme au Codex :
 *      Réserves  : le niveau (0–40 pts)
 *      Maîtrise  : la meilleure Voie entraînée (window.Voies) (0–30 pts)
 *      Aura      : le palier tenu, 1–4 (0–30 pts)
 *    Total 0–100 → D <25 · C <45 · B <65 · A <85 · S ≥85.
 *
 *  ▶ « L'affinité brise l'échelle » : un héros en MANA SEMI-PARFAIT
 *    (window.Equilibre) vaut toujours UN CRAN DE PLUS que son score.
 *
 *  ▶ L'ASTRE — on ne classe pas un dieu. Jamais attribué par le calcul :
 *    seulement par la note  <Rang: astre>  (« quand un rapport dit Astre,
 *    il dit : fuyez »).
 *
 *  ▶ ENNEMIS :  <Rang: D|C|B|A|S|astre>  dans la note. Annoncé au début du
 *    combat (annonceEnnemis).
 *
 *  API :   window.Rangs.rang(actorId)      → 'D'…'S' | 'Astre'
 *          window.Rangs.details(actorId)   → {reserves, maitrise, aura, score, rang}
 *  Écran : commande de plugin  RANGS ecran   (ou l'entrée de menu)
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('RangsPuissance');
    var MENU = (P['menuCommand'] === undefined ? 'Rangs' : String(P['menuCommand']));
    // ⚠ Corrigé : « String(P[x] || defaut) » retombe sur le défaut quand le
    // réglage est VIDE — le bouton de menu ne pouvait donc pas s'éteindre.
    // On distingue maintenant « absent » (→ défaut) de « vidé » (→ pas de commande).
    var ANNONCE = String(P['annonceEnnemis'] || 'true') === 'true';

    var LETTRES = ['D', 'C', 'B', 'A', 'S'];
    var NOMS = { D: 'l\'Étincelle', C: 'l\'Adepte', B: 'le Maître', A: 'le Champion', S: 'la Légende', Astre: 'l\'Astre' };
    var COULEURS = { D: '#8a8578', C: '#5dcaa5', B: '#5E92E6', A: '#B79CF5', S: '#EBC974', Astre: '#F0928E' };

    function noteRang(note) {
        var m = /<Rang:\s*(astre|[DCBAS])\s*>/i.exec(note || '');
        if (!m) return '';
        var v = m[1].toUpperCase();
        return v === 'ASTRE' ? 'Astre' : v;
    }

    function palierAura(actor) {
        var lv = actor.level || 1;
        return lv < 20 ? 1 : lv < 40 ? 2 : lv < 60 ? 3 : 4;   // même échelle qu'AuraPaliers
    }

    function bestMaitrise(actorId) {
        if (!window.Voies) return 0;
        var voies = ['forge', 'onde', 'source', 'miroir', 'vide', 'eclair', 'domaine', 'flash', 'sang'];
        var best = 0;
        for (var i = 0; i < voies.length; i++) {
            var m = 0;
            try { m = window.Voies.mastery(actorId, voies[i]) || 0; } catch (e) {}
            if (m > best) best = m;
        }
        return best;
    }

    var Rangs = {
        details: function (actorId) {
            var a = $gameActors && $gameActors.actor(actorId);
            if (!a) return null;
            var forced = noteRang(a.actor() ? a.actor().note : '');
            var reserves = Math.min(40, Math.round((a.level / 99) * 40));
            var maitrise = Math.min(30, Math.round((bestMaitrise(actorId) / 40) * 30));
            var aura = palierAura(a) * 7.5;
            var score = Math.round(reserves + maitrise + aura);
            var idx = score < 25 ? 0 : score < 45 ? 1 : score < 65 ? 2 : score < 85 ? 3 : 4;
            var semi = false;
            try { semi = !!(window.Equilibre && window.Equilibre.etat(actorId) === 'semiparfait'); } catch (e) {}
            if (semi && idx < 4) idx++;   // le Semi-Parfait vaut un cran de plus
            var rang = forced || LETTRES[idx];
            return { reserves: reserves, maitrise: maitrise, aura: Math.round(aura), score: score, semi: semi, rang: rang };
        },
        rang: function (actorId) {
            var d = this.details(actorId);
            return d ? d.rang : 'D';
        },
        rangEnnemi: function (enemy) {
            if (!enemy) return '';
            var data = enemy.enemy ? enemy.enemy() : enemy;
            return noteRang(data && data.note);
        }
    };
    window.Rangs = Rangs;

    // « Jauger d'un regard » : annonce des rangs ennemis au début du combat.
    if (ANNONCE) {
        var _startBattle = BattleManager.startBattle;
        BattleManager.startBattle = function () {
            _startBattle.call(this);
            try {
                var seen = {};
                $gameTroop.members().forEach(function (e) {
                    var r = Rangs.rangEnnemi(e);
                    if (!r || seen[e.enemyId()]) return;
                    seen[e.enemyId()] = true;
                    var w = SceneManager._scene && SceneManager._scene._logWindow;
                    if (!w) return;
                    if (r === 'Astre') w.push('addText', '\\C[18]⚠ ' + e.name() + ' — rang ASTRE. On ne classe pas un dieu : fuyez.\\C[0]');
                    else w.push('addText', '\\C[16]' + e.name() + ' — rang ' + r + ' (' + NOMS[r] + ').\\C[0]');
                });
            } catch (e) {}
        };
    }

    //--- Écran des rangs ---
    function Window_Rangs() { this.initialize.apply(this, arguments); }
    Window_Rangs.prototype = Object.create(Window_Base.prototype);
    Window_Rangs.prototype.constructor = Window_Rangs;
    Window_Rangs.prototype.standardFontSize = function () { return 20; };
    Window_Rangs.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.refresh();
    };
    Window_Rangs.prototype.refresh = function () {
        this.contents.clear();
        var W = this.contentsWidth();
        this.contents.fontSize = 21; this.changeTextColor('#EBC974');
        this.drawText('LES RANGS DE PUISSANCE', 0, 2, W, 'center');
        this.contents.fontSize = 13; this.changeTextColor('#7E7688');
        this.drawText('réserves · maîtrise · aura — l\'échelle de l\'Ordre d\'Or', 0, 30, W, 'center');

        var members = $gameParty.members();
        var top = 64, rowH = Math.min(96, Math.floor((this.contentsHeight() - top) / Math.max(1, members.length)));
        for (var i = 0; i < members.length; i++) {
            var a = members[i], d = Rangs.details(a.actorId());
            if (!d) continue;
            var y = top + i * rowH;
            // Lettre de rang
            this.contents.fontSize = 40; this.changeTextColor(COULEURS[d.rang] || '#ECE6D8');
            this.drawText(d.rang, 8, y, 84, 'center');
            // Nom + titre
            this.contents.fontSize = 19; this.changeTextColor('#ECE6D8');
            this.drawText(a.name(), 104, y, 220, 'left');
            this.contents.fontSize = 14; this.changeTextColor(COULEURS[d.rang] || '#B6AE9C');
            this.drawText(NOMS[d.rang] + (d.semi ? '  ★ Semi-Parfait (+1 cran)' : ''), 104, y + 24, W - 300, 'left');
            // Décomposition
            this.contents.fontSize = 13; this.changeTextColor('#7E7688');
            this.drawText('réserves ' + d.reserves + ' · maîtrise ' + d.maitrise + ' · aura ' + d.aura + '  =  ' + d.score, 104, y + 44, W - 300, 'left');
            // Jauge de score
            var bw = 150, bx = W - bw - 10, by = y + 18;
            if (window.LoreCanon) { LoreCanon.bar(this.contents, bx, by, bw, 12, Math.min(100, d.score) / 100, COULEURS[d.rang] || '#ECE6D8'); }
            else {
                this.contents.fillRect(bx, by, bw, 12, 'rgba(0,0,0,0.5)');
                this.contents.fillRect(bx + 1, by + 1, Math.floor((bw - 2) * Math.min(100, d.score) / 100), 10, COULEURS[d.rang] || '#ECE6D8');
            }
        }
        this.resetFontSettings();
    };
    function Scene_Rangs() { this.initialize.apply(this, arguments); }
    window.Scene_Rangs = Scene_Rangs;
    Scene_Rangs.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Rangs.prototype.constructor = Scene_Rangs;
    Scene_Rangs.prototype.create = function () { Scene_MenuBase.prototype.create.call(this); this._w = new Window_Rangs(); this.addWindow(this._w); };
    Scene_Rangs.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isCancelled()) { SoundManager.playCancel(); this.popScene(); }
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() === 'RANGS') SceneManager.push(Scene_Rangs);
    };
    if (MENU.length > 0) {
        var _add = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () { _add.call(this); this.addCommand(MENU, 'rangsPuissance', true); };
        var _cw = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () { _cw.call(this); this._commandWindow.setHandler('rangsPuissance', function () { SceneManager.push(Scene_Rangs); }); };
    }
})();
