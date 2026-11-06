//=============================================================================
// UltimesSources.js — v1.0  ·  Les Ultimes des Trois Sources
// RPG Maker MV   ·   by JOKO   ·   d'après le Codex des Trois Sources
//   À charger APRÈS CorruptionAme, Errance, JadeEntitePlunging et ManaAffinity.
//   (Le Royaume de ludwing vit dans RoyaumeImperial.js — celui-ci porte les 3 autres.)
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les ultimes d'Aël (la Convergence), Korrah (la Mue
 * Souveraine) et Vesper (la Parole Originelle) — chacune avec son prix.
 * @author JOKO
 *
 * @param etatConvergence
 * @text État — la Convergence (Aël)
 * @type state
 * @default 201
 *
 * @param etatMue
 * @text État — la Mue Souveraine (Korrah)
 * @type state
 * @default 202
 *
 * @param etatParole
 * @text État — la Parole Originelle (Vesper)
 * @type state
 * @default 203
 *
 * @param mueVol
 * @text Mue — % des dégâts physiques rendus en PV
 * @type number
 * @default 15
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES ULTIMES DES TROIS SOURCES                                        by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Le Royaume Impérial (ludwing) a ouvert la voie : chaque héros a SA carte
 *  finale — et, Loi du Prix oblige, chacune coûte ce qu'elle donne.
 *
 *  ▶ ✶ LA CONVERGENCE — Aël, l'Équilibre  ·  <Ultime: convergence> (skill 813)
 *      Fondre les TROIS sources en une. État 201 : ATK/MAT ×1.35, DEF/MDF
 *      ×1.25, +15 % crit — et ses coups IGNORENT les résistances (jamais
 *      sous 100 %). PRIX/tour : +2 Corruption, +2 Errance, −1 lucidité —
 *      les trois gouffres s'ouvrent EN MÊME TEMPS.
 *
 *  ▶ ⚔ LA MUE SOUVERAINE — Korrah, le Corps  ·  <Ultime: mue> (skill 815)
 *      Lâcher la Bête en gardant la laisse. État 202 : ATK ×1.7, DEF/AGI
 *      ×1.4, +20 % crit — mais MAT ×0.5 (le corps dévore l'esprit). Chaque
 *      coup physique la NOURRIT (mueVol % des dégâts en PV).
 *      PRIX/tour : +4 Corruption — elle court vers la Bête.
 *
 *  ▶ ✴ LA PAROLE ORIGINELLE — Vesper, l'Esprit  ·  <Ultime: parole> (818)
 *      Prononcer le premier mot du monde. État 203 : MAT ×1.7, MDF ×1.4,
 *      +10 % crit — et sa magie NE RATE JAMAIS.
 *      PRIX/tour : −1 lucidité — elle court vers le Dément.
 *
 *  Les trois tombent en fin de combat (comme le Domaine). Le prix s'ESCALADE :
 *  +1 par tour tenu au-delà du premier (tenir longtemps coûte de plus en plus).
 *
 *  Commandes :  ULTIME convergence|mue|parole <idActeur>   ·   ULTIME fin <id>
 *  Script    :  window.Ultimes.actif(id)  → 'convergence'|'mue'|'parole'|''
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('UltimesSources');
    var VOL = parseInt(P['mueVol'] || 15);

    var ULTIMES = {
        convergence: { etat: parseInt(P['etatConvergence'] || 201), nom: 'la CONVERGENCE',
                       aura: [216, 192, 96],  prix: { corr: 2, err: 2, ment: 1 } },
        mue:         { etat: parseInt(P['etatMue'] || 202), nom: 'la MUE SOUVERAINE',
                       aura: [200, 40, 70],   prix: { corr: 4, err: 0, ment: 0 } },
        parole:      { etat: parseInt(P['etatParole'] || 203), nom: 'la PAROLE ORIGINELLE',
                       aura: [74, 144, 216],  prix: { corr: 0, err: 0, ment: 1 } }
    };

    function log(t) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', t); w.push('wait'); }
        else if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(t);
    }

    var Ultimes = {
        actif: function (id) {
            var a = $gameActors && $gameActors.actor(id);
            if (!a) return '';
            for (var k in ULTIMES) if (a.isStateAffected(ULTIMES[k].etat)) return k;
            return '';
        },
        ouvrir: function (actor, cle) {
            var U = ULTIMES[cle];
            if (!actor || !actor.isActor() || !U) return;
            if (this.actif(actor.actorId())) return;   // déjà déployé
            actor.addState(U.etat);
            actor._ultimeTours = 0;
            if ($gameScreen) $gameScreen.startFlash([U.aura[0], U.aura[1], U.aura[2], 210], 32);
            log('\\C[18]★ ' + actor.name() + ' déploie ' + U.nom + '.\\C[0]');
        },
        fermer: function (actor) {
            if (!actor) return;
            var k = this.actif(actor.actorId());
            if (k) {
                actor.removeState(ULTIMES[k].etat);
                log('\\C[6]' + ULTIMES[k].nom + ' reflue.\\C[0]');
            }
        }
    };
    window.Ultimes = Ultimes;

    //=========================================================================
    // Déclenchement par note  <Ultime: convergence|mue|parole>
    //=========================================================================
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        var it = this.item();
        if (!it || !it.meta || !it.meta.Ultime) return;
        var k = String(it.meta.Ultime).toLowerCase().trim();
        var s = this.subject();
        if (ULTIMES[k] && s && s.isActor && s.isActor() && !this._ultimeFaite) {
            this._ultimeFaite = true;
            Ultimes.ouvrir(s, k);
        }
    };

    //=========================================================================
    // Le prix, chaque tour (escalade : +1 par tour tenu au-delà du premier)
    //=========================================================================
    var _startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        $gameParty.battleMembers().forEach(function (a) {
            var k = Ultimes.actif(a.actorId());
            if (!k) return;
            var U = ULTIMES[k];
            a._ultimeTours = (a._ultimeTours || 0) + 1;
            var bonus = a._ultimeTours - 1;
            var corr = U.prix.corr > 0 ? U.prix.corr + bonus : 0;
            var err = U.prix.err > 0 ? U.prix.err + bonus : 0;
            var ment = U.prix.ment;   // la lucidité ne s'escalade pas (jauge trop courte)
            var id = a.actorId();
            try { if (corr && window.Corruption) window.Corruption.add(id, corr); } catch (e) {}
            try { if (err && window.Errance) window.Errance.add(id, err); } catch (e) {}
            try { if (ment && window.Ame) window.Ame.mauvais(id, ment); } catch (e) {}
            if (a._ultimeTours >= 2) {
                var parts = [];
                if (corr) parts.push('+' + corr + ' Bête');
                if (err) parts.push('+' + err + ' Errant');
                if (ment) parts.push('-' + ment + ' lucidité');
                log('\\C[8]' + U.nom + ' — prix : (' + parts.join(', ') + ')\\C[0]');
            }
        });
        _startTurn.call(this);
    };

    //=========================================================================
    // CONVERGENCE — les coups d'Aël ignorent les résistances (jamais < 100 %)
    //=========================================================================
    var _calcElem = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function (target) {
        var rate = _calcElem.call(this, target);
        var s = this.subject();
        if (s && s.isActor && s.isActor() && s.isStateAffected(ULTIMES.convergence.etat)) {
            return Math.max(rate, 1);
        }
        return rate;
    };

    //=========================================================================
    // MUE SOUVERAINE — chaque coup physique nourrit la Bête (vol de vie)
    //=========================================================================
    var _execDmg = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        _execDmg.call(this, target, value);
        var s = this.subject();
        if (value > 0 && this.isPhysical() && s && s.isActor && s.isActor() &&
            s.isStateAffected(ULTIMES.mue.etat) && s !== target) {
            var vol = Math.floor(value * VOL / 100);
            if (vol > 0) { s.gainHp(vol); s.startDamagePopup(); }
        }
    };

    //=========================================================================
    // PAROLE ORIGINELLE — la magie de Vesper ne rate jamais
    //=========================================================================
    var _itemHit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function (target) {
        var s = this.subject();
        if (this.isMagical() && s && s.isActor && s.isActor() &&
            s.isStateAffected(ULTIMES.parole.etat)) {
            return 1;
        }
        return _itemHit.call(this, target);
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'ULTIME') return;
        var sub = (args[0] || '').toLowerCase();
        var a = $gameActors && $gameActors.actor(parseInt(args[1]) || 0);
        if (sub === 'fin') Ultimes.fermer(a);
        else if (ULTIMES[sub]) Ultimes.ouvrir(a, sub);
    };
})();
