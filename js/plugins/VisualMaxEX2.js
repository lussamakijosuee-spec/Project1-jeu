//=============================================================================
// VisualMaxEX2.js — v1.0  ·  Jauges animées (combat+menu), picto d'élément sur
//   les popups, légende Éléments au menu, aperçu animé d'équipement (vert/rouge)
// RPG Maker MV   ·   by JOKO   ·   additif — charger APRÈS VisualMaxEX & TSR_EquipSlots
//=============================================================================
/*:
 * @target MV
 * @plugindesc v1.0 ■ Jauges PV/PM/PT qui GLISSENT (combat + menu), picto d'element
 * colore sur les popups, commande menu « Elements », apercu equipement anime vert/rouge.
 * @author JOKO
 *
 * @param SlideSpeed
 * @text Vitesse de glissement des jauges
 * @type number
 * @decimals 2
 * @desc Fraction rattrapee par frame (0.20 ≈ doux). 1 = instantane.
 * @default 0.2
 *
 * @param ShowPicto
 * @text Picto d'element sur les popups
 * @type boolean
 * @default true
 *
 * @param MenuLabel
 * @text Libellé menu « Éléments » (vide = aucun)
 * @type string
 * @default Éléments
 *
 * @param EquipPreview
 * @text Aperçu animé à l'équipement
 * @type boolean
 * @default true
 *
 * @help
 * ============================================================================
 *  VisualMaxEX2 — finitions animées                                     JOKO
 * ============================================================================
 *  1) JAUGES QUI GLISSENT : PV/PM/PT rejoignent leur valeur en douceur (combat
 *     ET menus) au lieu de sauter d'un coup. Le nombre suit le glissement.
 *  2) PICTO D'ÉLÉMENT : une pastille de la couleur de l'élément apparaît
 *     au-dessus des nombres de dégâts (rouge = Feu, cyan = Glace, …).
 *  3) MENU « ÉLÉMENTS » : ouvre l'écran de référence (couleurs + cycle) depuis
 *     le menu principal (réutilise Scene_MvxElements de VisualMaxEX).
 *  4) ÉQUIPEMENT : à la sélection d'un objet, la nouvelle valeur de stat MONTE
 *     ou DESCEND en s'animant, en VERT (gain) ou ROUGE (perte).
 *
 *  Additif. À charger après VisualMaxEX (popups) et TSR_EquipSlots (équip).
 * ============================================================================
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('VisualMaxEX2');
    var SLIDE   = parseFloat(P['SlideSpeed'] || 0.2) || 0.2;
    var PICTO   = String(P['ShowPicto'] || 'true') === 'true';
    var MENU_LB = String(P['MenuLabel'] || 'Éléments');
    var EQ_PREV = String(P['EquipPreview'] || 'true') === 'true';

    //========================================================================
    // 1) JAUGES QUI GLISSENT (PV / PM / PT)
    //========================================================================
    function ensureDisp(a) {
        if (a._mvxHpD == null) a._mvxHpD = a.hp;
        if (a._mvxMpD == null) a._mvxMpD = a.mp;
        if (a._mvxTpD == null) a._mvxTpD = a.tp;
    }
    function stepOne(a, prop, real) {
        var cur = a[prop];
        if (cur === real) return false;
        var diff = real - cur;
        var s = diff * SLIDE;
        if (Math.abs(s) < 1) s = (diff > 0 ? 1 : -1);
        var nv = cur + s;
        if ((diff > 0 && nv > real) || (diff < 0 && nv < real)) nv = real;
        a[prop] = nv;
        return true;
    }
    function stepDisp(a) {
        if (!a || a.hp == null) return false;
        ensureDisp(a);
        var ch = false;
        if (stepOne(a, '_mvxHpD', a.hp)) ch = true;
        if (stepOne(a, '_mvxMpD', a.mp)) ch = true;
        if (stepOne(a, '_mvxTpD', a.tp)) ch = true;
        return ch;
    }

    // Dessine la jauge/le nombre avec la valeur AFFICHÉE (glissante)
    function wrapDraw(method, prop, realKey) {
        var orig = Window_Base.prototype[method];
        if (!orig) return;
        Window_Base.prototype[method] = function (actor) {
            if (actor && actor[prop] != null && Math.round(actor[prop]) !== actor[realKey]) {
                var real = actor[realKey];
                actor[realKey] = Math.round(actor[prop]);
                orig.apply(this, arguments);
                actor[realKey] = real;
            } else {
                orig.apply(this, arguments);
            }
        };
    }
    wrapDraw('drawActorHp', '_mvxHpD', '_hp');
    wrapDraw('drawActorMp', '_mvxMpD', '_mp');
    wrapDraw('drawActorTp', '_mvxTpD', '_tp');

    // Pilotes : on fait avancer le glissement et on rafraîchit tant que ça bouge
    function driveWindow(klass, membersFn) {
        if (typeof klass === 'undefined') return;
        var _u = klass.prototype.update;
        klass.prototype.update = function () {
            if (_u) _u.call(this); else Window_Base.prototype.update.call(this);
            var any = false, list = membersFn();
            for (var i = 0; i < list.length; i++) { if (stepDisp(list[i])) any = true; }
            if (any) this.refresh();
        };
    }
    driveWindow(window.Window_BattleStatus, function () { return $gameParty ? $gameParty.battleMembers() : []; });
    driveWindow(window.Window_MenuStatus,   function () { return $gameParty ? $gameParty.members() : []; });

    //========================================================================
    // 2) PICTO D'ÉLÉMENT SUR LES POPUPS DE DÉGÂTS
    //    (réutilise target._mvxDmgColor posé par VisualMaxEX)
    //========================================================================
    if (PICTO && typeof Sprite_Damage !== 'undefined') {
        var _SD_setup = Sprite_Damage.prototype.setup;
        Sprite_Damage.prototype.setup = function (target) {
            var color = (target && target._mvxDmgColor) ? target._mvxDmgColor : null;
            _SD_setup.call(this, target);
            if (color) this._mvxAddPicto(color);
        };
        Sprite_Damage.prototype._mvxAddPicto = function (color) {
            var s = new Sprite();
            var b = new Bitmap(22, 22);
            b.drawCircle(11, 11, 10, 'rgba(0,0,0,0.55)');
            b.drawCircle(11, 11, 7, color);
            s.bitmap = b; s.anchor.x = 0.5; s.anchor.y = 0.5;
            s.x = 0; s.y = -34; s._mvxPicto = true;
            this.addChild(s);
        };
        var _SD_updateChild = Sprite_Damage.prototype.updateChild;
        Sprite_Damage.prototype.updateChild = function (sprite) {
            if (sprite && sprite._mvxPicto) {
                if (this._flashColor) sprite.setBlendColor(this._flashColor);
                return;
            }
            _SD_updateChild.call(this, sprite);
        };
    }

    //========================================================================
    // 3) COMMANDE MENU « ÉLÉMENTS » (réutilise Scene_MvxElements de VisualMaxEX)
    //========================================================================
    if (MENU_LB) {
        var _addOrig = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () {
            _addOrig.call(this);
            if (window.Scene_MvxElements) this.addCommand(MENU_LB, 'mvxElements', true);
        };
        var _createCmd = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            _createCmd.call(this);
            this._commandWindow.setHandler('mvxElements', this._mvxOpenElements.bind(this));
        };
        Scene_Menu.prototype._mvxOpenElements = function () {
            if (window.Scene_MvxElements) SceneManager.push(window.Scene_MvxElements);
            else this._commandWindow.activate();
        };
    }

    //========================================================================
    // 4) APERÇU ANIMÉ À L'ÉQUIPEMENT (vert/rouge, compteur qui monte/descend)
    //    Se greffe sur la Window_EquipStatus de TSR_EquipSlots (ou core).
    //========================================================================
    if (EQ_PREV && typeof Window_EquipStatus !== 'undefined' &&
        Window_EquipStatus.prototype.drawNewParam) {

        var _setTemp = Window_EquipStatus.prototype.setTempActor;
        Window_EquipStatus.prototype.setTempActor = function (tempActor) {
            if (this._tempActor !== tempActor) this._mvxEq = 0; // relance l'animation
            _setTemp.call(this, tempActor);
        };

        var _eqUpdate = Window_EquipStatus.prototype.update;
        Window_EquipStatus.prototype.update = function () {
            if (_eqUpdate) _eqUpdate.call(this); else Window_Base.prototype.update.call(this);
            if (this._tempActor && this._mvxEq != null && this._mvxEq < 1) {
                this._mvxEq = Math.min(1, this._mvxEq + 0.12);
                this.refresh();
            }
        };

        Window_EquipStatus.prototype.drawNewParam = function (x, y, paramId) {
            var cur  = this._actor.param(paramId);
            var nw   = this._tempActor.param(paramId);
            var diff = nw - cur;
            var r    = (this._mvxEq == null) ? 1 : this._mvxEq;
            var shown = Math.round(cur + (nw - cur) * r);
            this.changeTextColor(this.paramchangeTextColor(diff));
            var tw = this.textWidth('0000');
            this.drawText(shown, x, y, tw, 'right');
            // delta signé, dans la couleur gain/perte
            if (diff !== 0) {
                this.contents.fontSize = 18;
                this.drawText('(' + (diff > 0 ? '+' : '') + diff + ')', x + tw + 4, y + 2, 64);
                this.contents.fontSize = 24;
            }
            this.resetTextColor();
        };
    }

})();
