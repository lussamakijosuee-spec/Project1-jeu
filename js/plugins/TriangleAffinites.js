//=============================================================================
// TriangleAffinites.js — v1.0
// Le Triangle des Trois Sources — évolution & voie suivie (RPG Maker MV)
// by JOKO
//=============================================================================

/*:
 * @plugindesc v1.0 ■ Écran-triangle Esprit/Corps/Âme : montre où chaque héros
 * se situe entre les trois sources, sa voie suivie et la Chute qui l'attire.
 * @author JOKO
 *
 * @param menuCommand
 * @text Entrée Menu (vide = aucune)
 * @type string
 * @default Le Triangle
 * @desc Libellé ajouté au menu principal. Vide = ne pas ajouter (ouvrable par la commande TRIANGLE).
 *
 * @param seuilCalme
 * @text Seuil « équilibre » (%)
 * @type number
 * @min 1
 * @max 100
 * @default 15
 * @desc En dessous de ce niveau sur les trois jauges, le héros est en équilibre calme (centre du triangle).
 *
 * @param hudDefaut
 * @text Mini-triangle sur la carte ?
 * @type boolean
 * @on Affiché
 * @off Caché
 * @default false
 * @desc Affiche un petit triangle en surimpression sur la carte (le meneur du groupe). Basculable par TRIANGLE hud.
 *
 * @param hudCoin
 * @text Coin du mini-triangle
 * @type select
 * @option Haut-droite
 * @value HD
 * @option Haut-gauche
 * @value HG
 * @option Bas-droite
 * @value BD
 * @option Bas-gauche
 * @value BG
 * @default HD
 *
 * @param hudSwitch
 * @text Interrupteur d'affichage (0 = ignorer)
 * @type switch
 * @default 0
 * @desc Si > 0, le mini-triangle ne s'affiche que quand cet interrupteur est ON (en plus du réglage TRIANGLE hud).
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE TRIANGLE DES TROIS SOURCES                                       by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Un écran visuel qui place chaque héros DANS le triangle Esprit–Corps–Âme,
 *  selon ses trois jauges de Chute. Le centre = l'équilibre (Mana Semi-Parfait) ;
 *  chaque sommet = une Chute. Plus une jauge monte, plus le point glisse vers
 *  son sommet — on lit d'un regard « quelle voie tu suis » et vers quel gouffre.
 *
 *      ▲ ESPRIT (le Dément)   — jauge : santé mentale / lucidité (window.Ame)
 *     CORPS (la Bête)  ◣───◢  ÂME (l'Errant)
 *        window.Corruption      window.Errance
 *
 *  • Point au CENTRE + jauges basses  → Équilibre calme (vert).
 *  • Point au CENTRE + jauges hautes  → Mana Semi-Parfait : la tension tenue
 *    (or, pulsant) — tout faire sans basculer.
 *  • Point près d'un SOMMET           → cette voie domine ; la Chute approche.
 *
 *  OUVRIR : commande de plugin  TRIANGLE     (ou l'entrée de menu)
 *  MINI-TRIANGLE (HUD carte) :  TRIANGLE hud on | off | toggle
 *    (montre le meneur du groupe dans un coin ; réglable par paramètre + interrupteur)
 *  Aucune donnée modifiée. Lecture seule des jauges ; tout est optionnel :
 *  une jauge absente compte pour 0.
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('TriangleAffinites');
    var MENU = String(P['menuCommand'] || 'Le Triangle');
    var CALME = (parseInt(P['seuilCalme'] || 15) || 15) / 100;
    var HUD_DEFAULT = String(P['hudDefaut'] || 'false') === 'true';
    var HUD_CORNER = String(P['hudCoin'] || 'HD');
    var HUD_SWITCH = parseInt(P['hudSwitch'] || 0) || 0;

    var COL = {
        esprit: '#5E92E6', esprit2: '#9CC0F5',
        corps:  '#9166E6', corps2:  '#B79CF5',
        ame:    '#E0726E', ame2:    '#F0928E',
        or:     '#D8B254', or2:     '#EBC974',
        calme:  '#5CC98A', line: 'rgba(216,178,84,0.35)', faint: '#7E7688'
    };

    //=========================================================================
    // Lecture des trois jauges de Chute (0..1), défensive.
    //=========================================================================

    function fallCorps(id) {
        try { return window.Corruption ? Math.max(0, Math.min(1, window.Corruption.niveau(id) / 100)) : 0; }
        catch (e) { return 0; }
    }
    function fallAme(id) {
        try { return window.Errance ? Math.max(0, Math.min(1, window.Errance.niveau(id) / 100)) : 0; }
        catch (e) { return 0; }
    }
    function fallEsprit(id) {
        // window.Ame = santé mentale, phase 5 (Maîtrise) → 1 (Effondrement).
        // Plus la phase est basse, plus on glisse vers le Dément.
        try {
            if (!window.Ame) return 0;
            var ph = window.Ame.phase(id);
            if (!ph) return 0;
            return Math.max(0, Math.min(1, (5 - ph) / 4));
        } catch (e) { return 0; }
    }

    /** Décrit la voie suivie d'après les trois intensités. */
    function tendance(e, c, a) {
        var max = Math.max(e, c, a);
        if (max < CALME) return { txt: 'Équilibre — l\'âme est calme', col: COL.calme };
        var spread = max - Math.min(e, c, a);
        if (spread < CALME) return { txt: 'Mana Semi-Parfait — la tension tenue', col: COL.or2 };
        if (max === c) return { txt: 'la Voie du Corps → la Bête', col: COL.corps2 };
        if (max === a) return { txt: 'la Voie de l\'Âme → l\'Errant', col: COL.ame2 };
        return { txt: 'la Voie de l\'Esprit → le Dément', col: COL.esprit2 };
    }

    //=========================================================================
    // Fenêtre-triangle
    //=========================================================================

    function Window_Triangle() { this.initialize.apply(this, arguments); }
    Window_Triangle.prototype = Object.create(Window_Base.prototype);
    Window_Triangle.prototype.constructor = Window_Triangle;

    Window_Triangle.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this._t = 0;
        this.refresh();
    };

    Window_Triangle.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        this._t++;
        if (this._t % 6 === 0) this.refresh(); // pulsation douce
    };

    Window_Triangle.prototype.standardFontSize = function () { return 20; };
    Window_Triangle.prototype.ROW_H = 26;

    Window_Triangle.prototype.geom = function () {
        var w = this.contentsWidth(), h = this.contentsHeight();
        var n = $gameParty.members().length;
        var panelH = n * this.ROW_H + 14;                         // panneau bas réservé
        var pad = 46, top = 44;                                    // sous le titre
        var baseY = h - panelH - 30;                              // base du triangle
        var cx = w * 0.5;
        var T = { x: cx,            y: top + 6 };                 // Esprit (haut)
        var L = { x: pad + 24,      y: baseY };                   // Corps (bas-gauche)
        var R = { x: w - pad - 24,  y: baseY };                  // Âme (bas-droite)
        var G = { x: (T.x + L.x + R.x) / 3, y: (T.y + L.y + R.y) / 3 }; // centre
        return { T: T, L: L, R: R, G: G, panelH: panelH };
    };

    Window_Triangle.prototype.pointFor = function (g, e, c, a) {
        // Le point part du centre et se laisse tirer vers chaque sommet.
        var px = g.G.x + e * (g.T.x - g.G.x) + c * (g.L.x - g.G.x) + a * (g.R.x - g.G.x);
        var py = g.G.y + e * (g.T.y - g.G.y) + c * (g.L.y - g.G.y) + a * (g.R.y - g.G.y);
        return { x: px, y: py };
    };

    Window_Triangle.prototype.line = function (x1, y1, x2, y2, color, width) {
        var ctx = this.contents._context;
        ctx.save();
        ctx.strokeStyle = color; ctx.lineWidth = width || 1.5;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.restore();
        if (this.contents._setDirty) this.contents._setDirty();
    };

    Window_Triangle.prototype.tf = function (size, color) {
        this.contents.fontSize = size;
        if (color) this.changeTextColor(color);
    };

    Window_Triangle.prototype.refresh = function () {
        this.contents.clear();
        var g = this.geom();
        var W = this.contentsWidth();

        // Titre + filet
        this.tf(21, COL.or2);
        this.drawText('LE TRIANGLE DES TROIS SOURCES', 0, 2, W, 'center');
        this.line(W * 0.5 - 150, 34, W * 0.5 + 150, 34, 'rgba(216,178,84,0.25)', 1);

        // Arêtes + médianes
        this.line(g.T.x, g.T.y, g.L.x, g.L.y, COL.line, 1.5);
        this.line(g.L.x, g.L.y, g.R.x, g.R.y, COL.line, 1.5);
        this.line(g.R.x, g.R.y, g.T.x, g.T.y, COL.line, 1.5);
        this.line(g.T.x, g.T.y, g.G.x, g.G.y, 'rgba(216,178,84,0.10)', 1);
        this.line(g.L.x, g.L.y, g.G.x, g.G.y, 'rgba(216,178,84,0.10)', 1);
        this.line(g.R.x, g.R.y, g.G.x, g.G.y, 'rgba(216,178,84,0.10)', 1);

        // Sommets (pastilles + libellés)
        this.contents.drawCircle(g.T.x, g.T.y, 6, COL.esprit);
        this.contents.drawCircle(g.L.x, g.L.y, 6, COL.corps);
        this.contents.drawCircle(g.R.x, g.R.y, 6, COL.ame);
        this.tf(19, COL.esprit2); this.drawText('ESPRIT', g.T.x - 80, g.T.y - 44, 160, 'center');
        this.tf(13, COL.faint);   this.drawText('le Dément', g.T.x - 80, g.T.y - 24, 160, 'center');
        this.tf(19, COL.corps2);  this.drawText('CORPS', g.L.x - 14, g.L.y + 6, 120, 'left');
        this.tf(13, COL.faint);   this.drawText('la Bête', g.L.x - 14, g.L.y + 26, 120, 'left');
        this.tf(19, COL.ame2);    this.drawText('ÂME', g.R.x - 106, g.R.y + 6, 120, 'right');
        this.tf(13, COL.faint);   this.drawText('l\'Errant', g.R.x - 106, g.R.y + 26, 120, 'right');

        // Centre — équilibre
        this.contents.drawCircle(g.G.x, g.G.y, 3, 'rgba(216,178,84,0.7)');
        this.tf(12, COL.faint); this.drawText('équilibre', g.G.x - 50, g.G.y + 6, 100, 'center');

        // Points des héros
        var members = $gameParty.members();
        var pulse = (Math.sin(this._t * 0.1) * 0.5 + 0.5);
        for (var i = 0; i < members.length; i++) {
            var actor = members[i], id = actor.actorId();
            var e = fallEsprit(id), c = fallCorps(id), a = fallAme(id);
            var pt = this.pointFor(g, e, c, a);
            var t = tendance(e, c, a);
            var max = Math.max(e, c, a), spread = max - Math.min(e, c, a);
            if (max >= CALME && spread < CALME) {
                this.contents.drawCircle(pt.x, pt.y, 10 + Math.floor(6 * pulse), 'rgba(235,201,116,' + (0.10 + 0.18 * pulse).toFixed(2) + ')');
            }
            this.contents.drawCircle(pt.x, pt.y, 6, t.col);
            this.contents.drawCircle(pt.x, pt.y, 3, '#ffffff');
            this.tf(15, '#ECE6D8');
            this.drawText(actor.name(), pt.x + 9, pt.y - 20, 150, 'left');
        }

        // Panneau bas : détail par héros (compact, séparé)
        var rowH = this.ROW_H, y0 = this.contentsHeight() - g.panelH + 8;
        this.line(0, y0 - 8, W, y0 - 8, 'rgba(216,178,84,0.18)', 1);
        for (var j = 0; j < members.length; j++) {
            var m = members[j], mid = m.actorId();
            var fe = fallEsprit(mid), fc = fallCorps(mid), fa = fallAme(mid);
            var td = tendance(fe, fc, fa);
            var y = y0 + j * rowH + (rowH - 22) / 2;
            var rang = '';
            try { if (window.Rangs) rang = ' · ' + window.Rangs.rang(mid); } catch (e) {}
            this.tf(17, '#ECE6D8'); this.drawText(m.name() + rang, 6, y, 132, 'left');
            this.tf(16, td.col);    this.drawText(td.txt, 142, y, W - 340, 'left');
            this.tf(14, COL.faint);
            this.drawText('E ' + Math.round(fe * 100) + '  C ' + Math.round(fc * 100) + '  A ' + Math.round(fa * 100),
                W - 196, y, 190, 'right');
        }
        this.resetFontSettings();
    };

    //=========================================================================
    // Scène
    //=========================================================================

    function Scene_Triangle() { this.initialize.apply(this, arguments); }
    window.Scene_Triangle = Scene_Triangle;
    Scene_Triangle.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Triangle.prototype.constructor = Scene_Triangle;
    Scene_Triangle.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._win = new Window_Triangle();
        this.addWindow(this._win);
    };
    Scene_Triangle.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isCancelled()) {
            SoundManager.playCancel();
            this.popScene();
        }
    };

    //=========================================================================
    // MINI-TRIANGLE (HUD carte) — le meneur du groupe, en surimpression
    //=========================================================================

    function hudEnabled() {
        if (!$gameSystem) return HUD_DEFAULT;
        if ($gameSystem._triHud === undefined) $gameSystem._triHud = HUD_DEFAULT;
        if (!$gameSystem._triHud) return false;
        if (HUD_SWITCH > 0 && $gameSwitches && !$gameSwitches.value(HUD_SWITCH)) return false;
        return true;
    }

    function Sprite_TriangleHUD() { this.initialize.apply(this, arguments); }
    Sprite_TriangleHUD.prototype = Object.create(Sprite.prototype);
    Sprite_TriangleHUD.prototype.constructor = Sprite_TriangleHUD;
    Sprite_TriangleHUD.prototype.initialize = function () {
        Sprite.prototype.initialize.call(this);
        this._W = 132; this._H = 122; this._t = 0; this._sig = '';
        this.bitmap = new Bitmap(this._W, this._H);
        this.opacity = 0;
        this.place();
    };
    Sprite_TriangleHUD.prototype.place = function () {
        var m = 8, x = Graphics.boxWidth - this._W - m, y = m;
        if (HUD_CORNER === 'HG') { x = m; y = m; }
        else if (HUD_CORNER === 'BD') { y = Graphics.boxHeight - this._H - m; }
        else if (HUD_CORNER === 'BG') { x = m; y = Graphics.boxHeight - this._H - m; }
        this.x = x; this.y = y;
    };
    Sprite_TriangleHUD.prototype.leader = function () {
        return $gameParty && $gameParty.leader ? $gameParty.leader() : null;
    };
    Sprite_TriangleHUD.prototype.update = function () {
        Sprite.prototype.update.call(this);
        var on = hudEnabled() && this.leader();
        this.opacity += ((on ? 255 : 0) - this.opacity) * 0.15;
        if (!on) return;
        this._t++;
        var a = this.leader(), id = a.actorId();
        var sig = id + ':' + fallEsprit(id).toFixed(2) + ':' + fallCorps(id).toFixed(2) + ':' + fallAme(id).toFixed(2);
        if (sig !== this._sig || this._t % 30 === 0) { this._sig = sig; this.redraw(); }
    };
    Sprite_TriangleHUD.prototype.redraw = function () {
        var b = this.bitmap; b.clear();
        var pad = 20, topY = 30, w = this._W, h = this._H;
        var T = { x: w / 2, y: topY }, L = { x: pad, y: h - pad }, R = { x: w - pad, y: h - pad };
        var G = { x: (T.x + L.x + R.x) / 3, y: (T.y + L.y + R.y) / 3 };
        var ctx = b._context;
        ctx.save();
        ctx.strokeStyle = 'rgba(216,178,84,0.4)'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(T.x, T.y); ctx.lineTo(L.x, L.y); ctx.lineTo(R.x, R.y); ctx.closePath(); ctx.stroke();
        ctx.restore();
        if (b._setDirty) b._setDirty();
        b.drawCircle(T.x, T.y, 3, COL.esprit);
        b.drawCircle(L.x, L.y, 3, COL.corps);
        b.drawCircle(R.x, R.y, 3, COL.ame);
        b.fontSize = 12; b.textColor = COL.faint;
        b.drawText('E', T.x - 20, T.y - 16, 40, 14, 'center');
        b.drawText('C', L.x - 22, L.y + 2, 20, 14, 'center');
        b.drawText('A', R.x + 2, R.y + 2, 20, 14, 'center');

        var a = this.leader(), id = a.actorId();
        var e = fallEsprit(id), c = fallCorps(id), am = fallAme(id);
        var px = G.x + e * (T.x - G.x) + c * (L.x - G.x) + am * (R.x - G.x);
        var py = G.y + e * (T.y - G.y) + c * (L.y - G.y) + am * (R.y - G.y);
        var td = tendance(e, c, am);
        b.drawCircle(px, py, 5, td.col);
        b.drawCircle(px, py, 2, '#ffffff');
        b.fontSize = 12; b.textColor = COL.or2;
        b.drawText(a.name(), 0, h - 16, w, 14, 'center');
    };

    var _createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function () {
        _createDisplayObjects.call(this);
        this._triHud = new Sprite_TriangleHUD();
        this.addChild(this._triHud);
    };

    //=========================================================================
    // Commande de plugin + entrée menu
    //=========================================================================

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'TRIANGLE') return;
        var sub = (args[0] || '').toLowerCase();
        if (sub === 'hud') {
            var v = (args[1] || 'toggle').toLowerCase();
            if ($gameSystem._triHud === undefined) $gameSystem._triHud = HUD_DEFAULT;
            $gameSystem._triHud = (v === 'on') ? true : (v === 'off') ? false : !$gameSystem._triHud;
        } else {
            SceneManager.push(Scene_Triangle);
        }
    };

    if (MENU.length > 0) {
        var _add = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () {
            _add.call(this);
            this.addCommand(MENU, 'triangleAffinites', true);
        };
        var _cw = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            _cw.call(this);
            this._commandWindow.setHandler('triangleAffinites', function () {
                SceneManager.push(Scene_Triangle);
            });
        };
    }

})();
