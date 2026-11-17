//=============================================================================
// BossTelegraphe.js — v1.0
// RPG Maker MV
//=============================================================================
/*:
 * @plugindesc v1.0 ■ La mise en garde et la riposte : <Telegraphe> charge le
 * boss, <Apres: surcharge> le laisse à découvert — sur LUI, pas sur le groupe.
 * @author JOKO
 *
 * @param etatCharge
 * @text État « ⚡ Charge »
 * @type state
 * @default 207
 * @desc Posé sur le boss quand il prend son élan. Il frappera fort au tour suivant, mais il est à découvert.
 *
 * @param etatSurcharge
 * @text État « ✷ Surcharge »
 * @type state
 * @default 218
 * @desc Posé sur le boss APRÈS sa grosse frappe : c'est la fenêtre où le groupe doit cogner.
 *
 * @param corrigerCible
 * @text Corriger la cible de la Surcharge
 * @type boolean
 * @on Sur le boss (correct)
 * @off Laisser tel quel
 * @default true
 * @desc Les 41 frappes posent la Surcharge sur le GROUPE, ce qui inverse la mécanique. Activé, elle va sur le boss.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA MISE EN GARDE ET LA RIPOSTE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  CE QUI EXISTAIT DÉJÀ, ET NE TOURNAIT PAS
 *
 *  La base contient tout le système, écrit à la main :
 *
 *   • 41 compétences <Telegraphe>, une par boss, de portée « soi-même », qui
 *     posent ⚡ Charge : « Il prend son élan. Le coup qui vient sera terrible
 *     — mais il est à découvert. » (DÉF ×0.7, MDÉF ×0.7, esquive −50 %)
 *
 *   • 41 compétences <Apres: surcharge>, une par boss, qui devaient poser
 *     ✷ Surcharge : « Il a trop donné. C'est MAINTENANT qu'il faut frapper. »
 *     (DÉF ×0.4, MDÉF ×0.4, dégâts subis ×1.6)
 *
 *  Deux choses manquaient, et rien ne les signalait.
 *
 *  1 · LA SURCHARGE TOMBAIT SUR LE GROUPE. Les 41 frappes ont pour portée
 *      « tous les ennemis » — c'est-à-dire, vue du boss, LE GROUPE. MV pose
 *      les effets d'une compétence sur ses cibles : c'étaient donc les héros
 *      qui se retrouvaient à DÉF ×0.4 et à ×1.6 dégâts subis, juste après
 *      avoir encaissé la plus grosse attaque du boss. La mécanique tournait
 *      exactement à l'envers : au lieu d'ouvrir une fenêtre de riposte, elle
 *      punissait deux fois.
 *
 *      Ce plugin remet la Surcharge sur le boss et l'empêche de tomber sur le
 *      groupe. Aucune donnée n'est touchée : l'effet reste écrit dans la
 *      compétence, il est simplement redirigé au moment où il s'applique.
 *
 *  2 · L'IA N'ENCHAÎNAIT PAS. Les doctrines déclenchaient la mise en garde sur
 *      « TURN % 3 === 1 » et la frappe sur « TURN % 3 === 2 » — une parité,
 *      pas un enchaînement. Un boss étourdi, un ordre de tour bousculé par le
 *      CTB, ou simplement une ligne de PV bas qui passe avant, et la frappe
 *      partait SANS mise en garde. Les doctrines lisent désormais l'état
 *      lui-même (EVAL user.isStateAffected), ce qui rend la boucle
 *      incassable — voir data/Enemies.json.
 *
 *  LE RÉSULTAT, POUR LE JOUEUR
 *
 *      tour N     : « Gargal renifle l'air… »   → il est à découvert
 *      tour N+1   : « Curée du Premier Croc ! » → gros dégâts
 *      tour N+2   : « Gargal vacille ! »        → ×1.6 dégâts subis : on cogne
 *
 *  Un rythme lisible, qui se voit sans lire un tutoriel, et qui récompense
 *  celui qui garde ses grosses compétences pour la bonne fenêtre.
 *
 *  NOTETAGS (sur une compétence)
 *
 *    <Telegraphe>          la compétence est une mise en garde
 *    <Apres: surcharge>    après elle, son lanceur passe en ✷ Surcharge
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('BossTelegraphe');
    var CHARGE = Number(P['etatCharge'] || 207);
    var SURCHARGE = Number(P['etatSurcharge'] || 218);
    var CORRIGER = String(P['corrigerCible'] || 'true') !== 'false';

    // « <Apres: surcharge> » — MV garde l'espace après les deux-points, d'où le trim()
    function apresSurcharge(item) {
        if (!item || !item.note) return false;
        if (item._apresSurcharge === undefined) {
            var m = /<\s*Apres\s*:\s*([^>]+)>/i.exec(item.note);
            item._apresSurcharge = !!m && m[1].trim().toLowerCase() === 'surcharge';
        }
        return item._apresSurcharge;
    }

    //-----------------------------------------------------------------------
    // 1 · La Surcharge ne tombe plus sur le groupe
    //-----------------------------------------------------------------------
    var _applyItemEffect = Game_Action.prototype.applyItemEffect;
    Game_Action.prototype.applyItemEffect = function (target, effect) {
        if (CORRIGER &&
            effect && effect.code === Game_Action.EFFECT_ADD_STATE &&
            effect.dataId === SURCHARGE &&
            apresSurcharge(this.item()) &&
            target !== this.subject()) {
            return;   // c'est le lanceur qui se met à découvert, pas sa cible
        }
        _applyItemEffect.call(this, target, effect);
    };

    //-----------------------------------------------------------------------
    // 2 · … et elle tombe sur le lanceur
    //-----------------------------------------------------------------------
    // applyGlobal() est appelé une fois par action, dans BattleManager.startAction :
    // un seul passage, quel que soit le nombre de cibles.
    var _applyGlobal = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function () {
        _applyGlobal.call(this);
        if (!CORRIGER) return;
        if (!apresSurcharge(this.item())) return;
        var lanceur = this.subject();
        if (lanceur && lanceur.isAlive()) lanceur.addState(SURCHARGE);
    };

    //-----------------------------------------------------------------------
    // 3 · Une lecture que les doctrines peuvent employer
    //-----------------------------------------------------------------------
    // Les doctrines écrivent « EVAL user.enCharge() » plutôt que le numéro de
    // l'état : si JOKO renumérote ses états, seul le réglage du plugin bouge.
    Game_Battler.prototype.enCharge = function () {
        return this.isStateAffected(CHARGE);
    };
    Game_Battler.prototype.enSurcharge = function () {
        return this.isStateAffected(SURCHARGE);
    };
})();
