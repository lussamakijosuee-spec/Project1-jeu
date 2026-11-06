//=============================================================================
// CorruptionAme.js — v1.0  ·  La Corruption de l'Âme
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Abuser du Mana Sombre/Négatif corrompt l'âme : jauge de
 * corruption (0-100) par héros, malus croissants, état Corrompu au maximum.
 * @author JOKO
 *
 * @param elNegatif
 * @text Élément Négatif
 * @type number
 * @default 4
 *
 * @param elSombre
 * @text Élément Sombre
 * @type number
 * @default 5
 *
 * @param menuCommand
 * @text Entrée Menu (vide = aucune)
 * @type string
 * @default Corruption
 *
 * @help
 *  Chaque usage offensif de Mana Négatif/Sombre augmente la corruption du
 *  lanceur — c'est le SANG DE BÊTE qui s'éveille (la Chute du Corps).
 *  Paliers : 0 = Calme · 40 = Frémissement · 70 = Fièvre · 100 = la Mue
 *  (la Bête : malus sévères + vulnérabilité au Sombre). Ces états s'appliquent
 *  en début de combat selon le niveau de corruption.
 *
 *  RÉDUIRE : commande  CORRUPTION purge <héros> <n>   (ex. au Feu d'Âme)
 *  La relique « Amulette Purifiante » (<Relic: antirot>) réduit le gain.
 *  Écran : CORRUPTION ecran   ·   Script : Corruption.niveau('lou')
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('CorruptionAme');
    var EL_NEG = parseInt(P['elNegatif'] || 4);
    var EL_SOM = parseInt(P['elSombre'] || 5);
    var MENU = (P['menuCommand'] === undefined ? 'Corruption' : String(P['menuCommand']));
    // ⚠ Corrigé : « String(P[x] || defaut) » retombe sur le défaut quand le
    // réglage est VIDE — le bouton de menu ne pouvait donc pas s'éteindre.
    // On distingue maintenant « absent » (→ défaut) de « vidé » (→ pas de commande).
    var KEY = {
        // Les noms d'aujourd'hui…
        vesper: 1, korrah: 2, ludwing: 3, ael: 4, aël: 4,
        // …et ceux d'avant, gardés pour que les 26 commandes déjà posées
        // dans les événements continuent de marcher (règle 3 : on n'enlève rien).
        thylane: 1, neyssa: 2, lou: 3, tianna: 4
    };
    var TIERS = [[100, 183], [70, 182], [40, 181]];   // seuil -> stateId

    function resolve(k) { if (typeof k === 'number') return k; var s = String(k).toLowerCase().trim(); return KEY[s] || parseInt(s) || 0; }
    function store() { if (!$gameSystem) return {}; if (!$gameSystem._corruption) $gameSystem._corruption = {}; return $gameSystem._corruption; }
    function hasAntirot(actor) {
        return actor.armors && actor.armors().some(function (a) { return a && a.meta && a.meta.Relic && String(a.meta.Relic).trim() === 'antirot'; });
    }

    var Corruption = {
        niveau: function (k) { return store()[resolve(k)] || 0; },
        add: function (actorId, n) {
            var s = store(); var before = s[actorId] || 0;
            s[actorId] = Math.max(0, Math.min(100, before + n));
            if (before < 100 && s[actorId] >= 100) {
                var a = $gameActors.actor(actorId);
                var log = SceneManager._scene && SceneManager._scene._logWindow;
                if (log) log.push('addText', '\\C[18]' + (a ? a.name() : '') + ' entre dans la MUE — la Bête prend tout…\\C[0]');
            }
        },
        purge: function (k, n) { var id = resolve(k); var s = store(); s[id] = Math.max(0, (s[id] || 0) - Math.abs(n || 30)); },
        applyStates: function (actor) {
            var lv = this.niveau(actor.actorId());
            [181, 182, 183].forEach(function (st) { if (actor.isStateAffected(st)) actor.removeState(st); });
            for (var i = 0; i < TIERS.length; i++) { if (lv >= TIERS[i][0]) { actor.addState(TIERS[i][1]); break; } }
        }
    };
    window.Corruption = Corruption;

    // Gain de corruption en combat (Mana Négatif/Sombre offensif)
    var _exec = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        _exec.call(this, target, value);
        var s = this.subject();
        if (value > 0 && s && s.isActor && s.isActor()) {
            var item = this.item(); var el = item && item.damage ? item.damage.elementId : 0;
            var gain = (el === EL_SOM) ? 3 : (el === EL_NEG ? 2 : 0);
            if (gain > 0) { if (hasAntirot(s)) gain = Math.ceil(gain / 2); Corruption.add(s.actorId(), gain); }
        }
    };

    // Application des états de corruption au début du combat
    var _startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _startBattle.call(this);
        $gameParty.battleMembers().forEach(function (a) { Corruption.applyStates(a); });
    };

    // Décroissance lente hors-combat (l'âme se régénère un peu en marchant)
    var _incSteps = Game_Party.prototype.increaseSteps;
    Game_Party.prototype.increaseSteps = function () {
        _incSteps.call(this);
        if (this.steps() % 60 === 0) { var s = store(); Object.keys(s).forEach(function (id) { if (s[id] > 0) s[id] -= 1; }); }
    };

    //--- Écran de corruption ---
    function Window_Corruption() { this.initialize.apply(this, arguments); }
    Window_Corruption.prototype = Object.create(Window_Base.prototype);
    Window_Corruption.prototype.constructor = Window_Corruption;
    Window_Corruption.prototype.initialize = function () { Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight); this.refresh(); };
    Window_Corruption.prototype.refresh = function () {
        this.contents.clear();
        this.changeTextColor(this.systemColor()); this.drawText('— CORRUPTION DE L\'ÂME —', 0, 0, this.contentsWidth(), 'center'); this.resetTextColor();
        var top = this.lineHeight() * 2, rowH = Math.floor((this.contentsHeight() - top) / 4);
        for (var i = 1; i <= 4; i++) {
            var a = $gameActors.actor(i); if (!a) continue;
            var y = top + (i - 1) * rowH, lv = Corruption.niveau(i);
            var info = window.LoreCanon ? LoreCanon.corruption(lv) : null;
            var col = info ? info.couleur : (lv >= 100 ? '#8e44ad' : lv >= 70 ? '#c0392b' : lv >= 40 ? '#e67e22' : '#2ecc71');
            var stage = info ? info.nom : (lv >= 100 ? 'la Mue' : lv >= 70 ? 'Fièvre' : lv >= 40 ? 'Frémissement' : 'Calme');
            this.changeTextColor(this.normalColor()); this.drawText(a.name(), 0, y, 220);
            this.changeTextColor(col); this.drawText(stage + ' · ' + lv + ' / 100', 0, y, this.contentsWidth(), 'right');
            var bw = this.contentsWidth() - 20, gy = y + this.lineHeight() + 6;
            if (window.LoreCanon) { LoreCanon.bar(this.contents, 0, gy, bw, 16, lv / 100, col); }
            else { this.contents.fillRect(0, gy, bw, 16, 'rgba(0,0,0,0.5)'); this.contents.fillRect(1, gy + 1, Math.floor((bw - 2) * lv / 100), 14, col); }
            this.resetTextColor();
        }
    };
    function Scene_Corruption() { this.initialize.apply(this, arguments); }
    window.Scene_Corruption = Scene_Corruption;
    Scene_Corruption.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Corruption.prototype.constructor = Scene_Corruption;
    Scene_Corruption.prototype.create = function () { Scene_MenuBase.prototype.create.call(this); this._w = new Window_Corruption(); this.addWindow(this._w); };
    Scene_Corruption.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isCancelled()) { SoundManager.playCancel(); this.popScene(); }
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'CORRUPTION') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'purge') Corruption.purge(args[1], parseInt(args[2]) || 30);
        else if (sub === 'add') Corruption.add(resolve(args[1]), parseInt(args[2]) || 10);
        else if (sub === 'ecran') SceneManager.push(Scene_Corruption);
    };
    if (MENU.length > 0) {
        var _add = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () { _add.call(this); this.addCommand(MENU, 'corruptionAme', true); };
        var _cw = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () { _cw.call(this); this._commandWindow.setHandler('corruptionAme', function () { SceneManager.push(Scene_Corruption); }); };
    }
})();
