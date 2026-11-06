//=============================================================================
// DonoKamui.js — v1.0  ·  Le Kamui des Deux Yeux (Dono, façon Obito)
// RPG Maker MV   ·   by JOKO   ·   complément de DonoBoss (additif)
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Dono devient intangible (Kamui) : les attaques le traversent.
 * Il se matérialise par rythme pour être touché ; abuser du Kamui surcharge ses
 * Deux Yeux (vulnérable). L'Esprit Vengeur EST son 2e œil.
 * @author JOKO
 *
 * @param kamuiState
 * @text État Kamui (intangible)
 * @type state
 * @default 184
 *
 * @param overloadState
 * @text État Surcharge (vulnérable)
 * @type state
 * @default 185
 *
 * @help
 * ──────────────────────────────────────────────────────────────────────────
 *  Détection : ennemi avec <DonoBoss> dans la Note. Son Esprit = <DonoEsprit>.
 *  • Par défaut Dono est INTANGIBLE → dégâts subis = 0 (l'attaque le traverse).
 *  • Il se MATÉRIALISE par rythme (toutes les 3 actions si ses 2 yeux vivent,
 *    toutes les 2 si l'Esprit est mort) → fenêtre pour le frapper (télégraphié).
 *  • Contrainte : chaque attaque esquivée use ses Deux Yeux. À court de charge,
 *    SURCHARGE : il reste exposé 3 tours et subit +50% de dégâts.
 *  • Tuer l'Esprit Vengeur (son 2e œil) affaiblit durablement son Kamui.
 * ──────────────────────────────────────────────────────────────────────────
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('DonoKamui');
    var KAMUI = parseInt(P['kamuiState'] || 184);
    var OVER = parseInt(P['overloadState'] || 185);

    function isDono(b) { return b && b.isEnemy && b.isEnemy() && b.enemy() && b.enemy().meta && b.enemy().meta.DonoBoss; }
    function espritAlive() {
        return $gameTroop && $gameTroop.aliveMembers().some(function (e) {
            return e.enemy && e.enemy() && e.enemy().meta && e.enemy().meta.DonoEsprit;
        });
    }
    function getDono() { return $gameTroop ? $gameTroop.members().filter(isDono)[0] : null; }
    function log(t) {
        var w = BattleManager._logWindow; if (w) { w.push('addText', t); w.push('wait'); }
        if (typeof MecaBoss !== 'undefined' && MecaBoss.bandeauDuJournal) { MecaBoss.bandeauDuJournal(t); }   // muet en vue de côté : aussi en bandeau (JOKO, 2026-10-23)
    }

    function initKamui(d) { if (d._kamuiCharge == null) { d._kamuiCharge = 8; d._kamuiOverload = 0; d._kamuiTurn = 0; d._kamuiMat = false; } }

    // Mise à jour du Kamui à chaque tour
    var _startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        var d = getDono();
        if (d && d.isAlive()) {
            initKamui(d);
            d._kamuiTurn++;
            if (d._kamuiOverload > 0) {
                d._kamuiMat = true; d.removeState(KAMUI); d.addState(OVER);
                d._kamuiOverload--;
                if (d._kamuiOverload <= 0) { d._kamuiCharge = (espritAlive() && !d._oeilEteint) ? 8 : 4; log(d.name() + ' rouvre les yeux. Le Kamui revient.'); }
            } else {
                d.removeState(OVER);
                // « Tuer l'Esprit Vengeur affaiblit DURABLEMENT son Kamui » :
                // l'Esprit renaît, mais l'œil éteint le reste.
                var twoEyes = espritAlive() && !d._oeilEteint;
                var period = twoEyes ? 3 : 2;
                var cap = twoEyes ? 8 : 4;
                if (d._kamuiCharge > cap) d._kamuiCharge = cap;
                if (d._kamuiTurn % period === 0) {
                    d._kamuiMat = true; d.removeState(KAMUI);
                    log('\\C[14]★ ' + d.name() + ' se matérialise pour frapper — c\'est LE moment !\\C[0]');
                } else {
                    d._kamuiMat = false; d.addState(KAMUI);
                }
            }
        }
        _startTurn.call(this);
    };

    // Application : intangibilité / surcharge
    var _exec = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        if (isDono(target) && value > 0) {
            initKamui(target);
            if (target._kamuiOverload > 0) {
                value = Math.round(value * 1.5);                       // exposé : +50%
            } else if (target._kamuiMat === false) {                   // intangible
                log('L\'attaque traverse ' + target.name() + ' comme un fantôme… (Kamui)');
                target._kamuiCharge -= 1;
                if (target._kamuiCharge <= 0) {
                    target._kamuiOverload = 3; target._kamuiMat = true;
                    target.removeState(KAMUI); target.addState(OVER);
                    log('\\C[18]★ SURCHARGE DES DEUX YEUX ! ' + target.name() + ' ne peut plus disparaître !\\C[0]');
                }
                value = 0;
            }
        }
        _exec.call(this, target, value);
    };

    // Quand l'Esprit (2e œil) meurt : Kamui affaibli + message
    var _die = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function () {
        var wasEsprit = this.enemy() && this.enemy().meta && this.enemy().meta.DonoEsprit;
        _die.call(this);
        if (wasEsprit) {
            var d = getDono();
            if (d && d.isAlive()) { d._oeilEteint = true; d._kamuiCharge = Math.min(d._kamuiCharge || 4, 4); log('\\C[2]Un œil de ' + d.name() + ' s\'éteint. Son Kamui faiblit — il se découvrira plus souvent.\\C[0]'); }
        }
    };
})();
