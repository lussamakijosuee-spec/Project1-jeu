//=============================================================================
// FusionMana.js — v2.0  ·  La Fusion des Mana (deux sources fondues en une)
// RPG Maker MV   ·   by JOKO   ·   d'après le Codex des Trois Sources
//   À charger APRÈS CorruptionAme, Errance et JadeEntitePlunging.
//=============================================================================
/*:
 * @plugindesc v2.0 ■ La FUSION : fondre deux sources en une. 3 fusions —
 * Chair d'Âme, Fil du Rasoir, Songe Incarné — chacune tire vers ses DEUX Chutes.
 * @author JOKO
 *
 * @param soulVar
 * @text Variable du stock d'âmes
 * @type variable
 * @default 15
 *
 * @param coutAme
 * @text Chair d'Âme — coût d'entrée (âmes)
 * @type number
 * @min 0
 * @default 4
 *
 * @param erranceSansAme
 * @text Chair d'Âme — Errance si pas d'âmes
 * @type number
 * @min 0
 * @default 18
 *
 * @param coutMental
 * @text Rasoir/Songe — coût d'entrée (santé mentale)
 * @type number
 * @min 0
 * @default 2
 * @desc Ouvrir l'esprit pour fusionner coûte de la lucidité (jauge 1-10, via window.Ame).
 *
 * @param escalade
 * @text Le prix grandit chaque tour ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @param acteurRequis
 * @text Réservé à l'acteur (0 = tous)
 * @type number
 * @default 0
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA FUSION DES MANA                                                  by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Le Mana Semi-Parfait ÉQUILIBRE les trois sources (la voie sûre, au centre).
 *  La FUSION en fond DEUX l'une dans l'autre — plus fort qu'une source seule,
 *  mais, faute d'équilibre, elle tire vers les DEUX Chutes concernées.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  LES TROIS FUSIONS
 *  ─────────────────────────────────────────────────────────────────────────
 *  ▶ CHAIR D'ÂME  (Âme → Corps) · état 195 · « se tailler un corps dans l'âme »
 *      Gain  : ATK ×1.45, DEF ×1.30, +12 % crit, robuste.
 *      Entrée: coutAme âmes (sinon elle s'arrache l'âme : +18 Errance).
 *      Prix/tour : +Corruption (Bête) ET +Errance (Errant).
 *
 *  ▶ FIL DU RASOIR  (Corps → Esprit) · état 196 · « la lame de la pensée »
 *      Gain  : AGI ×1.6, ATK ×1.2, +15 % crit, +précision, +esquive.
 *      Entrée: aiguiser l'esprit coûte de la lucidité (−santé mentale).
 *      Prix/tour : +Corruption (Bête) ET −santé mentale (Dément).
 *
 *  ▶ SONGE INCARNÉ  (Esprit → Âme) · état 197 · « matérialiser ses visions »
 *      Gain  : MAT ×1.5, MDF ×1.30, +12 % crit.
 *      Entrée: plonger dans le Lac coûte de la lucidité (−santé mentale).
 *      Prix/tour : −santé mentale (Dément) ET +Errance (Errant).
 *
 *  → Rester fusionné = courir vers DEUX gouffres à la fois. Avec
 *    ChutesDefinitives, une double chute est une perte définitive rapide.
 *
 *  DÉCLENCHER : une compétence avec la note  <Fusion: chair|rasoir|songe>
 *  (skills 807/808/809). Ou : commande  FUSION <chair|rasoir|songe> <id>.
 *  (L'ancienne note <FusionChair> marche toujours.)
 *  ARRÊTER : fin de combat ; ou  FUSION fin <id>.
 *  SCRIPT :  window.Fusion.actif(id)  → clé de la fusion active ('' sinon).
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('FusionMana');
    var SOUL_VAR = parseInt(P['soulVar'] || 15);
    var COUT_AME = parseInt(P['coutAme'] || 4);
    var ERR_SANS = parseInt(P['erranceSansAme'] || 18);
    var COUT_MENT = parseInt(P['coutMental'] || 2);
    var ESCALADE = String(P['escalade'] || 'true') === 'true';
    var ACTEUR = parseInt(P['acteurRequis'] || 0);

    // La table des trois fusions (data-driven).
    var FUSIONS = {
        chair:  { etat: 195, nom: 'la Chair d\'Âme',   anim: 401,
                  entree: 'ame',    aura: [120, 0, 150],
                  prix: { corr: 4, err: 3, ment: 0 } },
        rasoir: { etat: 196, nom: 'le Fil du Rasoir',  anim: 381,
                  entree: 'mental', aura: [80, 80, 220],
                  prix: { corr: 3, err: 0, ment: 1 } },
        songe:  { etat: 197, nom: 'le Songe Incarné',  anim: 413,
                  entree: 'mental', aura: [140, 70, 205],
                  prix: { corr: 0, err: 3, ment: 1 } }
    };
    var ETATS = [195, 196, 197];

    function log(t) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', t); w.push('wait'); }
        else if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(t);
    }

    var Fusion = {
        // clé de la fusion active de l'acteur, '' sinon
        actif: function (id) {
            var a = $gameActors && $gameActors.actor(id);
            if (!a) return '';
            for (var k in FUSIONS) if (a.isStateAffected(FUSIONS[k].etat)) return k;
            return '';
        },
        entrer: function (actor, cle) {
            var F = FUSIONS[cle];
            if (!actor || !actor.isActor() || !F) return;
            if (ACTEUR > 0 && actor.actorId() !== ACTEUR) {
                log('\\C[8]' + actor.name() + ' ne connaît pas cette Fusion.\\C[0]');
                return;
            }
            if (this.actif(actor.actorId())) return;   // déjà fusionné
            var id = actor.actorId();
            // prix d'entrée
            if (F.entree === 'ame') {
                var souls = $gameVariables ? $gameVariables.value(SOUL_VAR) : 0;
                if (souls >= COUT_AME) {
                    if (COUT_AME > 0 && $gameVariables) $gameVariables.setValue(SOUL_VAR, souls - COUT_AME);
                } else if (window.Errance) {
                    try { window.Errance.add(id, ERR_SANS); } catch (e) {}
                    log('\\C[2]Pas d\'âmes à brûler — ' + actor.name() + ' s\'arrache la sienne.\\C[0]');
                }
            } else if (F.entree === 'mental' && window.Ame) {
                try { window.Ame.mauvais(id, COUT_MENT); } catch (e) {}
            }
            actor.addState(F.etat);
            actor._fusionTours = 0;
            if (F.anim > 0 && $gameParty.inBattle()) actor.startAnimation(F.anim);
            if ($gameScreen) $gameScreen.startFlash([F.aura[0] + 60, F.aura[1] + 40, F.aura[2] + 40, 200], 24);
            log('\\C[18]★ ' + actor.name() + ' — FUSION : ' + F.nom + '\\C[0]');
        },
        finir: function (actor) {
            if (!actor) return;
            var k = this.actif(actor.actorId());
            if (k) {
                actor.removeState(FUSIONS[k].etat);
                log('\\C[6]La Fusion reflue.\\C[0]');
            }
        }
    };
    window.Fusion = Fusion;

    // Déclenchement par note : <Fusion: X> ou l'ancienne <FusionChair>
    function fusionDuSkill(item) {
        if (!item || !item.meta) return '';
        if (item.meta.FusionChair !== undefined) return 'chair';
        if (item.meta.Fusion) {
            var k = String(item.meta.Fusion).toLowerCase().trim();
            if (FUSIONS[k]) return k;
        }
        return '';
    }
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        var cle = fusionDuSkill(this.item());
        if (cle) {
            var s = this.subject();
            if (s && s.isActor && s.isActor() && !this._fusionFaite) {
                this._fusionFaite = true;
                Fusion.entrer(s, cle);
            }
        }
    };

    // Le prix, chaque tour (les DEUX Chutes de la paire)
    var _startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        $gameParty.battleMembers().forEach(function (a) {
            var k = Fusion.actif(a.actorId());
            if (!k) return;
            var F = FUSIONS[k];
            a._fusionTours = (a._fusionTours || 0) + 1;
            var bonus = ESCALADE ? (a._fusionTours - 1) : 0;
            var corr = F.prix.corr > 0 ? F.prix.corr + bonus : 0;
            var err = F.prix.err > 0 ? F.prix.err + bonus : 0;
            var ment = F.prix.ment;   // la lucidité ne s'escalade pas (jauge trop courte)
            var id = a.actorId();
            try { if (corr && window.Corruption) window.Corruption.add(id, corr); } catch (e) {}
            try { if (err && window.Errance) window.Errance.add(id, err); } catch (e) {}
            try { if (ment && window.Ame) window.Ame.mauvais(id, ment); } catch (e) {}
            if (a._fusionTours >= 2) {
                var parts = [];
                if (corr) parts.push('+' + corr + ' Bête');
                if (err) parts.push('+' + err + ' Errant');
                if (ment) parts.push('-' + ment + ' lucidité');
                log('\\C[8]Fusion — prix : (' + parts.join(', ') + ')\\C[0]');
            }
        });
        _startTurn.call(this);
    };

    // Aura fondue (couleur propre à chaque fusion) tant qu'elle tient
    if (typeof Sprite_Actor !== 'undefined') {
        var _upd = Sprite_Actor.prototype.update;
        Sprite_Actor.prototype.update = function () {
            _upd.call(this);
            try {
                var a = this._actor;
                var k = a ? Fusion.actif(a.actorId()) : '';
                if (k) {
                    var au = FUSIONS[k].aura;
                    this._fusT = (this._fusT || 0) + 0.12;
                    var p = Math.sin(this._fusT) * 0.5 + 0.5;
                    this.setBlendColor([Math.floor(au[0] * p), Math.floor(au[1] * p), Math.floor(au[2] * p), Math.floor(120 * p)]);
                } else if (this._fusT) {
                    this.setBlendColor([0, 0, 0, 0]); this._fusT = 0;
                }
            } catch (e) {}
        };
    }

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'FUSION') return;
        var sub = (args[0] || '').toLowerCase();
        var id = parseInt(args[1]) || 0;
        var a = $gameActors && $gameActors.actor(id);
        if (sub === 'fin') Fusion.finir(a);
        else if (FUSIONS[sub]) Fusion.entrer(a, sub);
    };
})();
