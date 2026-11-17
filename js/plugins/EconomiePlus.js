//=============================================================================
// EconomiePlus.js — v1.0  ·  Artisanat, boutiques à d'autres monnaies
// RPG Maker MV   ·   pour JOKO
//   Inspiré, sans rien en copier, de Item Synthesis et More Currencies
//   (Yanfly).
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Fabriquer des objets à partir d'ingrédients (recettes
 * en balises) ; des boutiques qui demandent autre chose que de l'or.
 * @author JOKO
 *
 * @param menu
 * @text Artisanat : entrée du menu (vide = aucune)
 * @type string
 * @default Artisanat
 * @desc L'entrée n'apparaît que s'il existe au moins une recette connue.
 *
 * @param connues
 * @text Artisanat : recettes visibles
 * @type select
 * @option toutes, dès le début
 * @value toutes
 * @option seulement celles apprises (ARTISANAT apprendre)
 * @value apprises
 * @default toutes
 *
 * @param venteMonnaie
 * @text Boutique à monnaie : on peut y vendre ?
 * @type boolean
 * @on Oui (payé dans cette monnaie)
 * @off Non
 * @default false
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'ARTISANAT
 * ═══════════════════════════════════════════════════════════════════════════
 *  Dans la NOTE de l'objet, de l'arme ou de l'armure qu'on FABRIQUE :
 *      <Recette: o3 x2, o7, w12>     2 objets n°3, 1 objet n°7, 1 arme n°12
 *      <Recette or: 50>              coûte aussi 50 pièces (facultatif)
 *      <Recette quantité: 3>         en fabrique 3 d'un coup (facultatif)
 *      <Recette atelier: forge>      seulement à la forge (facultatif)
 *  o = objet, w = arme, a = armure.
 *
 *  Ouvrir l'écran :
 *      ARTISANAT ouvrir            toutes les recettes
 *      ARTISANAT ouvrir forge      celles de l'atelier « forge »
 *  Et une entrée « Artisanat » dans le menu (réglable), qui n'apparaît
 *  qu'une fois qu'une recette existe et est connue.
 *  Recettes apprises (si le paramètre le veut) :
 *      ARTISANAT apprendre o12
 *      ARTISANAT oublier o12
 *  Une recette dont on n'a pas tout est grisée ; on voit ce qui manque.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES AUTRES MONNAIES
 * ═══════════════════════════════════════════════════════════════════════════
 *  Juste avant « Boutique » dans l'événement :
 *      MONNAIE objet 45                la boutique se paie en objets n°45
 *      MONNAIE variable 12 Jetons      … avec la variable 12, appelée « Jetons »
 *  Les prix sont ceux de la boutique, comptés dans cette monnaie. Elle ne
 *  vaut que pour la boutique qui suit ; la suivante revient à l'or.
 *  Vendre y est fermé, sauf si le paramètre l'ouvre.
 */
var EconomiePlus = window.EconomiePlus || {};
window.EconomiePlus = EconomiePlus;
(function () {
    'use strict';
    var P = PluginManager.parameters('EconomiePlus');
    var MENU = P.menu === undefined ? 'Artisanat' : String(P.menu);
    var CONNUES = String(P.connues || 'toutes');
    var VENTE = String(P.venteMonnaie) === 'true';

    function table(k) { k = String(k).toLowerCase(); return k === 'o' ? $dataItems : k === 'w' ? $dataWeapons : k === 'a' ? $dataArmors : null; }
    function cle(obj) { return (DataManager.isWeapon(obj) ? 'w' : DataManager.isArmor(obj) ? 'a' : 'o') + obj.id; }
    function parCle(c) { var m = /^\s*([owa])\s*(\d+)\s*$/i.exec(c || ''); var t = m && table(m[1]); return t ? t[Number(m[2])] : null; }
    EconomiePlus.parCle = parCle;

    //=========================================================================
    // Les recettes
    //=========================================================================
    var _recettes = null;
    function lireRecette(obj) {
        var n = obj && obj.note || '';
        var m = /<\s*Recette\s*:\s*([^>]+)>/i.exec(n);
        if (!m) return null;
        var ing = [];
        m[1].split(',').forEach(function (p) {
            var x = /^\s*([owa])\s*(\d+)\s*(?:[x×*]\s*(\d+))?\s*$/i.exec(p);
            var t = x && table(x[1]);
            if (t && t[Number(x[2])]) ing.push({ objet: t[Number(x[2])], n: x[3] ? Number(x[3]) : 1 });
        });
        if (!ing.length) return null;
        var or = /<\s*Recette or\s*:\s*(\d+)\s*>/i.exec(n);
        var q = /<\s*Recette quantit[ée]\s*:\s*(\d+)\s*>/i.exec(n);
        var at = /<\s*Recette atelier\s*:\s*([^>]+?)\s*>/i.exec(n);
        return { resultat: obj, ingredients: ing, or: or ? Number(or[1]) : 0, quantite: q ? Math.max(1, Number(q[1])) : 1, atelier: at ? at[1].toLowerCase() : '' };
    }
    EconomiePlus.recettes = function () {
        if (!_recettes) {
            _recettes = [];
            [$dataItems, $dataWeapons, $dataArmors].forEach(function (t) { t.forEach(function (o) { var r = o && o.name && lireRecette(o); if (r) _recettes.push(r); }); });
        }
        return _recettes;
    };
    EconomiePlus.oublierCache = function () { _recettes = null; };
    EconomiePlus.connue = function (r) { return CONNUES === 'toutes' || !!($gameSystem._epRecettes && $gameSystem._epRecettes[cle(r.resultat)]); };
    EconomiePlus.visibles = function (atelier) {
        atelier = String(atelier || '').toLowerCase();
        return EconomiePlus.recettes().filter(function (r) { return EconomiePlus.connue(r) && (!atelier || r.atelier === atelier); });
    };
    // compter et retirer, même les armes « indépendantes » de YEP_ItemCore
    function exemplaires(obj) {
        var liste = DataManager.isItem(obj) ? $gameParty.items() : DataManager.isWeapon(obj) ? $gameParty.weapons() : $gameParty.armors();
        return liste.filter(function (x) { return x === obj || x.id === obj.id || x.baseItemId === obj.id; });
    }
    function possedes(obj) { return exemplaires(obj).reduce(function (s, x) { return s + $gameParty.numItems(x); }, 0); }
    function retirer(obj, n) {
        exemplaires(obj).forEach(function (x) {
            if (n <= 0) return;
            var k = Math.min(n, $gameParty.numItems(x));
            $gameParty.loseItem(x, k, false);
            n -= k;
        });
    }
    EconomiePlus.possedes = possedes;
    EconomiePlus.peutFabriquer = function (r) {
        return $gameParty.gold() >= r.or && r.ingredients.every(function (i) { return possedes(i.objet) >= i.n; });
    };
    EconomiePlus.fabriquer = function (r) {
        if (!EconomiePlus.peutFabriquer(r)) return false;
        r.ingredients.forEach(function (i) { retirer(i.objet, i.n); });
        if (r.or) $gameParty.loseGold(r.or);
        $gameParty.gainItem(r.resultat, r.quantite);
        return true;
    };

    //=========================================================================
    // L'écran d'artisanat
    //=========================================================================
    function Window_Recettes() { this.initialize.apply(this, arguments); }
    Window_Recettes.prototype = Object.create(Window_Selectable.prototype);
    Window_Recettes.prototype.constructor = Window_Recettes;
    Window_Recettes.prototype.initialize = function (x, y, w, h, atelier) {
        this._liste = EconomiePlus.visibles(atelier);
        Window_Selectable.prototype.initialize.call(this, x, y, w, h);
        this.refresh();
        this.select(0);
    };
    Window_Recettes.prototype.maxItems = function () { return this._liste ? this._liste.length : 0; };
    Window_Recettes.prototype.recette = function () { return this._liste[this.index()]; };
    Window_Recettes.prototype.isCurrentItemEnabled = function () { var r = this.recette(); return !!r && EconomiePlus.peutFabriquer(r); };
    Window_Recettes.prototype.drawItem = function (i) {
        var r = this._liste[i], rect = this.itemRectForText(i);
        this.changePaintOpacity(EconomiePlus.peutFabriquer(r));
        this.drawItemName(r.resultat, rect.x, rect.y, rect.width - 60);
        if (r.quantite > 1) this.drawText('×' + r.quantite, rect.x, rect.y, rect.width, 'right');
        this.changePaintOpacity(true);
    };
    Window_Recettes.prototype.updateHelp = function () { var r = this.recette(); this.setHelpWindowItem(r ? r.resultat : null); if (this._detail) this._detail.setRecette(r); };

    function Window_Ingredients() { this.initialize.apply(this, arguments); }
    Window_Ingredients.prototype = Object.create(Window_Base.prototype);
    Window_Ingredients.prototype.constructor = Window_Ingredients;
    Window_Ingredients.prototype.setRecette = function (r) { this._r = r; this.refresh(); };
    Window_Ingredients.prototype.refresh = function () {
        this.contents.clear();
        var r = this._r, w = this.contentsWidth(), lh = this.lineHeight(), y = 0, self = this;
        if (!r) { this.drawText('Aucune recette connue.', 0, 0, w, 'center'); return; }
        this.changeTextColor(this.systemColor());
        this.drawText('Il faut :', 0, y, w); y += lh;
        r.ingredients.forEach(function (i) {
            var a = possedes(i.objet);
            self.changePaintOpacity(a >= i.n);
            self.drawItemName(i.objet, 0, y, w - 90);
            self.changeTextColor(a >= i.n ? self.normalColor() : self.textColor(18));
            self.drawText(a + ' / ' + i.n, 0, y, w, 'right');
            self.changePaintOpacity(true);
            y += lh;
        });
        if (r.or) {
            this.changeTextColor($gameParty.gold() >= r.or ? this.normalColor() : this.textColor(18));
            this.drawText(r.or + ' ' + TextManager.currencyUnit, 0, y, w, 'right');
            y += lh;
        }
        this.resetTextColor();
        var nb = possedes(r.resultat);
        this.changeTextColor(this.systemColor());
        this.drawText('Possédés : ' + nb, 0, this.contentsHeight() - lh, w, 'right');
        this.resetTextColor();
    };

    function Scene_Artisanat() { this.initialize.apply(this, arguments); }
    Scene_Artisanat.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Artisanat.prototype.constructor = Scene_Artisanat;
    Scene_Artisanat.prototype.prepare = function (atelier) { this._atelier = atelier || ''; };
    Scene_Artisanat.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        var y = this._helpWindow.height, h = Graphics.boxHeight - y, w = Math.floor(Graphics.boxWidth / 2);
        this._detail = new Window_Ingredients(w, y, Graphics.boxWidth - w, h);
        this._liste = new Window_Recettes(0, y, w, h, this._atelier);
        this._liste._detail = this._detail;
        this._liste.setHelpWindow(this._helpWindow);
        this._liste.setHandler('ok', this.surOk.bind(this));
        this._liste.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._liste);
        this.addWindow(this._detail);
        this._liste.activate();
        this._liste.updateHelp();
    };
    Scene_Artisanat.prototype.surOk = function () {
        var r = this._liste.recette();
        if (EconomiePlus.fabriquer(r)) AudioManager.playSe({ name: 'Item3', volume: 90, pitch: 100, pan: 0 });
        this._liste.refresh();
        this._detail.refresh();
        this._liste.activate();
    };
    window.Scene_Artisanat = Scene_Artisanat;
    EconomiePlus.ouvrir = function (atelier) { SceneManager.push(Scene_Artisanat); SceneManager.prepareNextScene(atelier || ''); };

    if (MENU) {
        var _aoc = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () {
            _aoc.call(this);
            if (EconomiePlus.visibles('').length) this.addCommand(MENU, 'artisanat', true);
        };
        var _ccw = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            _ccw.call(this);
            this._commandWindow.setHandler('artisanat', function () { EconomiePlus.ouvrir(''); });
        };
    }

    //=========================================================================
    // Les autres monnaies
    //=========================================================================
    function monnaieActive() { var s = SceneManager._scene; return s instanceof Scene_Shop ? s._epMonnaie : null; }
    EconomiePlus.monnaieActive = monnaieActive;
    function solde(m) { return m.type === 'objet' ? $gameParty.numItems($dataItems[m.id]) : $gameVariables.value(m.id); }
    function payer(m, n) {
        if (m.type === 'objet') $gameParty.gainItem($dataItems[m.id], n);
        else $gameVariables.setValue(m.id, $gameVariables.value(m.id) + n);
    }
    var _shopPrep = Scene_Shop.prototype.prepare;
    Scene_Shop.prototype.prepare = function () {
        _shopPrep.apply(this, arguments);
        this._epMonnaie = $gameTemp._epMonnaie || null;
        $gameTemp._epMonnaie = null;
        if (this._epMonnaie && !VENTE) this._purchaseOnly = true;
    };
    var _gv = Window_Gold.prototype.value;
    Window_Gold.prototype.value = function () { var m = monnaieActive(); return m ? solde(m) : _gv.call(this); };
    var _gu = Window_Gold.prototype.currencyUnit;
    Window_Gold.prototype.currencyUnit = function () { var m = monnaieActive(); return m ? m.nom : _gu.call(this); };
    function avecMonnaie(scene, f) {
        var m = scene._epMonnaie;
        if (!m) return f();
        var perd = $gameParty.loseGold, gagne = $gameParty.gainGold;
        $gameParty.loseGold = function (n) { payer(m, -n); };
        $gameParty.gainGold = function (n) { payer(m, n); };
        try { return f(); } finally { $gameParty.loseGold = perd; $gameParty.gainGold = gagne; delete $gameParty.loseGold; delete $gameParty.gainGold; }
    }
    var _buy = Scene_Shop.prototype.doBuy;
    Scene_Shop.prototype.doBuy = function (n) { var self = this, a = arguments; avecMonnaie(this, function () { _buy.apply(self, a); }); };
    var _sell = Scene_Shop.prototype.doSell;
    Scene_Shop.prototype.doSell = function (n) { var self = this, a = arguments; avecMonnaie(this, function () { _sell.apply(self, a); }); };

    //=========================================================================
    // Les commandes
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pc.call(this, command, args);
        var c = String(command || '').toUpperCase();
        var a = String(args[0] || '').toLowerCase();
        if (c === 'ARTISANAT') {
            if (a === 'ouvrir') EconomiePlus.ouvrir(args[1] || '');
            else if (a === 'apprendre' || a === 'oublier') {
                var o = parCle(args[1]);
                if (!o) return;
                $gameSystem._epRecettes = $gameSystem._epRecettes || {};
                if (a === 'apprendre') $gameSystem._epRecettes[cle(o)] = true; else delete $gameSystem._epRecettes[cle(o)];
            }
        } else if (c === 'MONNAIE') {
            var id = Number(args[1]);
            if (a === 'objet' && $dataItems[id]) $gameTemp._epMonnaie = { type: 'objet', id: id, nom: $dataItems[id].name };
            else if (a === 'variable' && id > 0) $gameTemp._epMonnaie = { type: 'variable', id: id, nom: args.slice(2).join(' ') || $dataSystem.variables[id] || 'Jetons' };
            else if (a === 'or' || a === 'défaut' || a === 'defaut') $gameTemp._epMonnaie = null;
        }
    };
})();
