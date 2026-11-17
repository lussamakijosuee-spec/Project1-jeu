//=============================================================================
// ComboLiens.js — v1.0  ·  Compétences combo (Duo/Trio/Escouade) liées aux Liens
// RPG Maker MV   ·   by JOKO   (nécessite LiensSocial.js)
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Combos d'équipe : des compétences spéciales (duo/trio/
 * escouade) ne sont utilisables que si les héros requis sont présents ET que
 * leurs Liens sont assez élevés.
 * @author JOKO
 *
 * @param showHint
 * @text Message si combo verrouillé
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  COMBOS LIÉS AUX LIENS                                              by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Sur une compétence (Note) :
 *      <Combo: 1,3>        Héros requis (IDs d'acteurs) présents & vivants.
 *      <ComboLien: 3>      Niveau de Lien minimum requis pour CHAQUE héros.
 *
 *  La compétence reste grisée tant que :
 *    • tous les héros listés ne sont pas dans l'équipe ET vivants,
 *    • le Lien de chacun n'atteint pas le seuil.
 *
 *  Plus l'équipe est soudée (Liens élevés), plus elle débloque d'attaques
 *  combinées dévastatrices. Augmente les liens avec :  LIEN up <héros>
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('ComboLiens');
    var HINT = String(P['showHint'] || 'true') === 'true';

    function comboData(skill) {
        if (!skill || !skill.meta || !skill.meta.Combo) return null;
        return {
            members: String(skill.meta.Combo).split(',').map(function (s) { return parseInt(s.trim()); }),
            minLien: parseInt(skill.meta.ComboLien || 0)
        };
    }

    function lienOf(id) {
        return (typeof window.Lien !== 'undefined' && window.Lien) ? window.Lien.niveau(id) : 99;
    }

    function comboReady(skill) {
        var d = comboData(skill);
        if (!d) return true;
        var party = $gameParty.battleMembers();
        for (var i = 0; i < d.members.length; i++) {
            var id = d.members[i];
            var actor = $gameActors.actor(id);
            if (!actor || party.indexOf(actor) < 0 || !actor.isAlive()) return false;
            if (lienOf(id) < d.minLien) return false;
        }
        return true;
    }

    // Grise la compétence combo si les conditions ne sont pas remplies
    var _meets = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
        if (!_meets.call(this, skill)) return false;
        if (comboData(skill) && !comboReady(skill)) return false;
        return true;
    };

    // Succès « Cœurs Unis » : débloqué quand un combo d'équipe est déclenché.
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        if (!this._comboSuccesDone && comboData(this.item())) {
            this._comboSuccesDone = true;
            if (window.Succes) window.Succes.unlock(5);
        }
    };
})();
