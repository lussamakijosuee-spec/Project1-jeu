//=============================================================================
// InvocationAmes.js — v1.0  ·  Invocation d'Âmes (dépense les âmes en combat)
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Compétences d'invocation : <Invocation: n> dépense n âmes
 * (variable 15) à l'usage et reste grisée si tu n'as pas assez d'âmes.
 * @author JOKO
 *
 * @param soulVar
 * @text Variable — Âmes
 * @type variable
 * @default 15
 *
 * @help
 *  Sur une compétence (Note) :  <Invocation: 5>
 *  → coûte 5 âmes (var 15) ; grisée si âmes insuffisantes ; les âmes sont
 *    retirées quand la compétence est lancée. Idéal pour Lou.
 *  Astuce formule : $gameVariables.value(15) * 14 - b.mdf  (dégâts ∝ âmes)
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('InvocationAmes');
    var SOUL = parseInt(P['soulVar'] || 15);

    function cost(skill) {
        if (skill && skill.meta && skill.meta.Invocation) return parseInt(skill.meta.Invocation) || 0;
        return 0;
    }
    function souls() { return (typeof $gameVariables !== 'undefined' && $gameVariables) ? $gameVariables.value(SOUL) : 0; }

    var _meets = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
        if (!_meets.call(this, skill)) return false;
        var c = cost(skill);
        if (c > 0 && souls() < c) return false;
        return true;
    };

    var _pay = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function (skill) {
        _pay.call(this, skill);
        var c = cost(skill);
        if (c > 0 && $gameVariables) {
            $gameVariables.setValue(SOUL, Math.max(0, souls() - c));
        }
    };
})();
