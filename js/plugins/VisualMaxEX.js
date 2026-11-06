//=============================================================================
// VisualMaxEX.js — v1.0  ·  Popups de dégâts colorés par élément + écran
//                           « Éléments & Cycle de Mana » consultable
// RPG Maker MV   ·   by JOKO   ·   additif (à charger après YEP_BattleEngineCore)
//=============================================================================
/*:
 * @target MV
 * @plugindesc v1.0 ■ Popups de degats TEINTES par element (feu=rouge...) + ecran
 * de reference « Elements & Cycle » (couleurs, forces/faiblesses). Lisible & anime.
 * @author JOKO
 *
 * @param TintPopups
 * @text Colorer les popups de dégâts
 * @type boolean
 * @default true
 *
 * @help
 * ============================================================================
 *  VisualMaxEX                                                          JOKO
 * ============================================================================
 *  • Les NOMBRES DE DÉGÂTS prennent la couleur de l'élément de l'attaque
 *    (Feu = rouge, Glace = cyan, Sombre = violet…). Lecture instantanée du type
 *    de dégâts reçu. N'affecte pas les soins.
 *
 *  • ÉCRAN DE RÉFÉRENCE « Éléments & Cycle » : la liste des éléments avec leur
 *    pastille de couleur et leur relation dans le cycle de Mana
 *    (fort vs … · faible vs …).
 *        Ouvrir :  Plugin Command →  ELEMENTS
 *                  Script        →  SceneManager.push(Scene_MvxElements)
 *
 *  Additif, sans dépendance dure. Compatible YEP (n'écrase pas setup, se
 *  greffe sur createChildSprite).
 * ============================================================================
 */
var Scene_MvxElements = Scene_MvxElements || null;

(function () {
    'use strict';

    var P = PluginManager.parameters('VisualMaxEX');
    var TINT = String(P['TintPopups'] || 'true') === 'true';

    //========================================================================
    // REGISTRE DES ÉLÉMENTS (couleurs cohérentes avec ManaVisuals/EX)
    //========================================================================
    var ELEM = {
        1:'#bdbdbd',2:'#cdb8ff',3:'#ffd95a',4:'#6fa8ff',5:'#b061e0',6:'#f2f2f2',
        7:'#5fd6c0',8:'#ff6b4a',9:'#4ec3ff',10:'#7be07b',11:'#c79a5b',12:'#ffe14a',
        13:'#aef0ff',14:'#fff3a0',15:'#8a7fb0',16:'#e0a0ff'
    };
    function elemName(id) {
        return ($dataSystem && $dataSystem.elements[id] ? $dataSystem.elements[id].trim() : '');
    }
    /**
     * Ce que le joueur paie, et non plus un cycle d'avantages.
     *
     * ManaAffinity v2.0 a SUPPRIMÉ le pierre-feuille-ciseaux entre branches
     * (« l'avantage de combat vient désormais des ARTS et des CHUTES ») ainsi
     * que la roue élémentaire. Cet écran annonçait encore « fort vs … ·
     * faible vs … » : il enseignait au joueur une règle qui n'existe plus.
     * Il dit maintenant le seul vrai coût de chaque source — le prix.
     */
    function cycleHint(el) {
        switch (el) {
            case 2: return 'le prix se paie sur la vie';
            case 3: return "coûte des PM · faiblit si l'esprit va mal";
            case 4: return 'recul PV — la forme projetée';
            case 5: return 'recul PV plus lourd — on puise la source';
            case 7: return 'Mana Pur : transperce les résistances';
            case 16: return 'semi-parfait : transperce les résistances';
            case 14: return 'seule opposition qui subsiste : ⇄ ' + elemName(15);
            case 15: return 'seule opposition qui subsiste : ⇄ ' + elemName(14);
            default: return '—';
        }
    }
    // hex -> tone qui transforme un pixel BLANC en cette couleur (setColorTone additif)
    function hexToTone(hex) {
        if (!hex) return null;
        var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
        if (!m) return null;
        var r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
        return [r - 255, g - 255, b - 255, 0];
    }

    //========================================================================
    // 1) POPUPS DE DÉGÂTS TEINTÉS PAR ÉLÉMENT
    //========================================================================
    if (TINT) {
        // Mémorise la couleur d'élément sur la cible au moment des dégâts
        var _GA_apply = Game_Action.prototype.apply;
        Game_Action.prototype.apply = function (target) {
            _GA_apply.call(this, target);
            var color = null;
            var item = this.item();
            if (item && item.damage) {
                var el = item.damage.elementId;
                if (el === -1) {                                  // attaque normale
                    var subj = this.subject();
                    var atkEls = subj && subj.attackElements ? subj.attackElements() : [];
                    el = atkEls.length ? atkEls[0] : 0;
                }
                var res = target ? target.result() : null;
                if (el > 0 && ELEM[el] && res && res.hpDamage > 0) color = ELEM[el];
            }
            if (target) target._mvxDmgColor = color;
        };

        // Au moment de créer le popup, on capte la couleur stockée
        var _SD_setup = Sprite_Damage.prototype.setup;
        Sprite_Damage.prototype.setup = function (target) {
            this._mvxTone = (target && target._mvxDmgColor) ? hexToTone(target._mvxDmgColor) : null;
            _SD_setup.call(this, target);
        };

        // Chaque chiffre du popup est teinté (createChildSprite n'est pas surchargé par YEP)
        var _SD_createChildSprite = Sprite_Damage.prototype.createChildSprite;
        Sprite_Damage.prototype.createChildSprite = function () {
            var sprite = _SD_createChildSprite.call(this);
            if (this._mvxTone && sprite && sprite.setColorTone) sprite.setColorTone(this._mvxTone);
            return sprite;
        };
    }

    //========================================================================
    // 2) ÉCRAN « ÉLÉMENTS & CYCLE »
    //========================================================================
    function Window_MvxElements() { this.initialize.apply(this, arguments); }
    Window_MvxElements.prototype = Object.create(Window_Selectable.prototype);
    Window_MvxElements.prototype.constructor = Window_MvxElements;

    Window_MvxElements.prototype.initialize = function (x, y, w, h) {
        this._list = [];
        for (var i = 1; i <= 16; i++) { if (elemName(i)) this._list.push(i); }
        Window_Selectable.prototype.initialize.call(this, x, y, w, h);
        this.refresh();
        this.activate();
        this.select(0);
    };
    Window_MvxElements.prototype.maxItems = function () { return this._list.length; };
    Window_MvxElements.prototype.itemHeight = function () { return Math.floor(this.lineHeight() * 1.35); };
    Window_MvxElements.prototype.drawItem = function (index) {
        var id = this._list[index];
        var rect = this.itemRect(index);
        var col = ELEM[id] || '#ffffff';
        // pastille de couleur
        this.contents.fillRect(rect.x + 4, rect.y + 6, 30, rect.height - 12, 'rgba(0,0,0,0.55)');
        this.contents.fillRect(rect.x + 6, rect.y + 8, 26, rect.height - 16, col);
        // nom de l'élément
        var ty = rect.y + Math.floor((rect.height - this.lineHeight()) / 2);
        this.changeTextColor(col);
        this.drawText(elemName(id).toUpperCase(), rect.x + 46, ty, 240);
        // relation de cycle
        this.changeTextColor(this.textColor(6));
        this.drawText(cycleHint(id), rect.x + 290, ty, rect.width - 296);
        this.resetTextColor();
    };

    // Le bandeau du haut. Window_Help écrit avec drawTextEx, qui ne borne
    // rien : la phrase demandait 812 px pour 768 px de place et la fenêtre la
    // coupait en silence — on lisait « chaque source a son pr ». On ne
    // raccourcit pas la phrase : c'est la taille de la police qui cède,
    // jusqu'à ce que tout entre.
    function Window_MvxBandeau() { this.initialize.apply(this, arguments); }
    Window_MvxBandeau.prototype = Object.create(Window_Help.prototype);
    Window_MvxBandeau.prototype.constructor = Window_MvxBandeau;
    Window_MvxBandeau.prototype.refresh = function () {
        this.contents.clear();
        var dispo = this.contents.width - this.textPadding() * 2;
        var texte = String(this._text || '');
        this.contents.fontSize = this.standardFontSize();
        while (this.contents.fontSize > 14 && this.textWidth(texte) > dispo) {
            this.contents.fontSize -= 1;
        }
        // la taille réellement employée au dessin, pour qu'un contrôle puisse
        // mesurer ce que le joueur voit et non ce qu'on croit avoir écrit
        this._tailleEmployee = this.contents.fontSize;
        this._largeurEmployee = this.textWidth(texte);
        this.drawText(texte, this.textPadding(), 0, dispo, 'left');
        this.contents.fontSize = this.standardFontSize();
    };

    function Scene_MvxElementsClass() { this.initialize.apply(this, arguments); }
    Scene_MvxElementsClass.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_MvxElementsClass.prototype.constructor = Scene_MvxElementsClass;
    Scene_MvxElementsClass.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        var hh = this.calcHelpHeight ? this.calcHelpHeight() : 72;
        this._help = new Window_MvxBandeau(1);
        this._help.setText('LES SOURCES ET LES ÉLÉMENTS   —   chaque source a son prix');
        this.addWindow(this._help);
        var y = this._help.height;
        this._win = new Window_MvxElements(0, y, Graphics.boxWidth, Graphics.boxHeight - y);
        this._win.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._win);
    };

    // Exposition globale
    Scene_MvxElements = Scene_MvxElementsClass;
    window.Scene_MvxElements = Scene_MvxElementsClass;

    //========================================================================
    // COMMANDE DE PLUGIN
    //========================================================================
    var _pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pluginCommand.call(this, command, args);
        if (String(command).toUpperCase() === 'ELEMENTS') {
            SceneManager.push(Scene_MvxElementsClass);
        }
    };

})();
