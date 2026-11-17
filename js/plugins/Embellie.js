//=============================================================================
// Embellie.js — v1.0  ·  Des nuits qu'on voit, des lampes qui éclairent
// RPG Maker MV   ·   pour JOKO
//   À charger APRÈS MOG_TimeSystem et Interieurs, AVANT Allegement.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Beauté : nuits bleutées lisibles, halos autour des
 * lampes et des feux, vignette douce, lucioles. Léger, tout se règle.
 * @author JOKO
 *
 * @param teintes
 * @text Teintes du jour
 * @type select
 * @option embellie
 * @option mog
 * @default embellie
 * @desc embellie : soir orangé, nuit bleu lune (on y voit). mog : les teintes réglées dans MOG_TimeSystem.
 *
 * @param halos
 * @text Halos des lumières
 * @type boolean
 * @on oui
 * @off non
 * @default true
 * @desc Un halo autour de chaque lampe, torche, feu, braséro, réverbère allumé.
 *
 * @param forceHalos
 * @text Force des halos (%)
 * @type number
 * @min 0
 * @max 200
 * @default 100
 *
 * @param vignette
 * @text Vignette (%)
 * @type number
 * @min 0
 * @max 100
 * @default 35
 * @desc Assombrit doucement les bords de l'écran. 0 = aucune. Plus marquée la nuit.
 *
 * @param lucioles
 * @text Lucioles la nuit
 * @type boolean
 * @on oui
 * @off non
 * @default true
 * @desc Quelques lucioles les nuits d'extérieur, sauf l'hiver.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  EMBELLIE
 * ═══════════════════════════════════════════════════════════════════════════
 *  JOKO, 2026-10-02 : « fais une énorme amélioration visuelle, la beauté du
 *  jeu, surtout sans que ça lag ». Mesuré avant : la nuit (teinte MOG
 *  -128,-128,-128) rendait la ville presque noire, et aucune lampe
 *  n'éclairait.
 *
 *  1. TEINTES — après-midi doré, crépuscule violet, nuit bleu lune, aube. On y
 *     voit la nuit. MOG_TimeSystem garde ses réglages : « mog » les remet.
 *
 *  2. HALOS — le plugin LIT les sprites des événements « ! » (objets) : là
 *     où le dessin est lumineux (flamme, lanterne allumée, cristal), il pose
 *     un halo de la même couleur, au même endroit. Un réverbère éteint
 *     n'éclaire pas ; allumé d'un seul côté, il éclaire de ce côté. Les
 *     flammes vacillent. Le halo grandit avec la nuit ; à l'intérieur, les
 *     feux gardent une lueur douce.
 *     Dans un commentaire de la page de l'événement :
 *         <Lumière: #ffcc88 120>   couleur et rayon (pixels) imposés
 *         <Lumière: aucune>        jamais de halo sur cet événement
 *     Fonctionne pour tes futures lampes, sans rien régler.
 *
 *  3. VIGNETTE — bords d'écran un peu plus sombres, comme un objectif.
 *
 *  4. LUCIOLES — une douzaine, la nuit, dehors, sauf l'hiver.
 *
 *  COÛT : une texture de halo dessinée une fois, des sprites simples en
 *  fusion additive ; l'analyse d'un sprite se fait une fois et se garde.
 *  Sur un PC sans carte graphique reconnue (MV passe en mode Canvas), la
 *  vignette et les lucioles se coupent d'elles-mêmes : elles y coûtaient
 *  7 et 5 images par seconde ; les halos restent (2 images/s).
 *
 *  OPTION : « Effets visuels » dans le menu Options coupe tout (halos,
 *  lucioles, vignette, pluie et neige à l'écran). Les teintes restent.
 *
 *  SCRIPT : Embellie.halos()  → combien de halos sur la carte, là
 */
var Embellie = window.Embellie || {};
window.Embellie = Embellie;
(function () {
    'use strict';
    var P = PluginManager.parameters('Embellie');
    var TEINTES = String(P.teintes || 'embellie');
    var HALOS = String(P.halos || 'true') === 'true';
    var FORCE = Number(P.forceHalos || 100) / 100;
    var VIGNETTE = Math.max(0, Math.min(100, Number(P.vignette === undefined ? 35 : P.vignette))) / 100;
    var LUCIOLES = String(P.lucioles || 'true') === 'true';

    /* ═══ 1. les teintes ═══════════════════════════════════════════════════
     * Phases de MOG_TimeSystem (set_day_phase) : 0 après-midi 15-18 h ·
     * 1 jour 9-15 h · 2 crépuscule 18-21 h · 3 nuit 21-3 h · 4 aube 3-6 h ·
     * 5 lever 6-9 h. */
    var PALETTE = {
        0: [22, 6, -16, 0],      // fin d'après-midi : à peine doré
        1: [0, 0, 0, 0],         // jour
        2: [-34, -44, -10, 24],  // crépuscule : orangé qui vire au violet
        3: [-78, -64, -8, 40],   // nuit : bleu lune, on y voit
        4: [-46, -48, -24, 28],  // aube : gris bleu
        5: [26, 14, -8, 0]       // lever : doré
    };
    if (TEINTES === 'embellie' && Game_System.prototype.set_tint_phase) {
        var _tint = Game_System.prototype.set_tint_phase;
        Game_System.prototype.set_tint_phase = function () {
            var p = this.day_phase ? this.day_phase() : -1;
            if (!PALETTE[p]) return _tint.call(this);
            var t = PALETTE[p].slice();
            // le « gris » (désaturation) est gratuit en WebGL ; en mode Canvas,
            // MV le fait par une opération plein écran à chaque image
            if (!Graphics.isWebGL()) t[3] = 0;
            return t;
        };
    }
    // obscurité 0 (jour) → 1 (nuit), lue sur la teinte réelle de l'écran
    function nuit() {
        if (!$gameScreen) return 0;
        var t = $gameScreen.tone();
        var d = -(t[0] + t[1] + t[2]) / 3;
        return Math.max(0, Math.min(1, d / 50));
    }
    function dehors() { return !(window.Interieurs && Interieurs.est && Interieurs.est()); }

    /* ═══ la texture partagée ═══ */
    var _tex = null;
    function texture() {
        if (_tex) return _tex;
        var c = document.createElement('canvas'); c.width = c.height = 128;
        var g = c.getContext('2d');
        var r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        r.addColorStop(0, 'rgba(255,255,255,1)');
        r.addColorStop(0.25, 'rgba(255,255,255,0.55)');
        r.addColorStop(0.6, 'rgba(255,255,255,0.14)');
        r.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = r; g.fillRect(0, 0, 128, 128);
        _tex = PIXI.Texture.fromCanvas(c);
        return _tex;
    }

    /* ═══ 2. lire un sprite : où est la lumière, de quelle couleur ═══ */
    var lectures = {};
    function lire(nom, index, dir) {
        var cle = nom + '|' + index + '|' + dir;
        if (lectures[cle] !== undefined) return lectures[cle];
        var bm = ImageManager.loadCharacter(nom);
        if (!bm.isReady()) return undefined;           // on relira plus tard
        var grand = ImageManager.isBigCharacter(nom);
        var pw = bm.width / (grand ? 3 : 12), ph = bm.height / (grand ? 4 : 8);
        var bx = grand ? 0 : (index % 4) * 3 * pw, by = grand ? 0 : Math.floor(index / 4) * 4 * ph;
        var fx = bx + pw, fy = by + ((dir - 2) / 2) * ph;   // image du milieu, ligne de la direction
        var res = null;
        try {
            var d = bm._context.getImageData(fx, fy, pw, ph).data;
            // Réglé sur les vrais sprites (2026-10-02) : réverbère allumé 27 %
            // de pixels « chauds lumineux », éteint 6 % (le sable du pied),
            // statue dorée 3 %, torche 77 %. L'eau d'une fontaine est d'un
            // bleu pâle SEMI-TRANSPARENT : la flamme bleue, elle, est opaque.
            var lum = function (R, G, B, a) {
                var mx = Math.max(R, G, B), mn = Math.min(R, G, B);
                return (mx > 205 && R - B > 40 && a > 100) || (mx > 205 && mx - mn > 95 && a > 200);
            };
            var bas = ph * 0.85, n = 0, opaques = 0, sx = 0, sy = 0, sr = 0, sg = 0, sb = 0;
            var gauche = 0, droite = 0, gx = 0, gy = 0, dx = 0, dy = 0;
            for (var y = 0; y < ph; y += 2) for (var x = 0; x < pw; x += 2) {
                var i = (y * pw + x) * 4, a = d[i + 3];
                if (a < 40) continue;
                opaques++;
                if (y > bas || !lum(d[i], d[i + 1], d[i + 2], a)) continue;
                n++; sx += x; sy += y; sr += d[i]; sg += d[i + 1]; sb += d[i + 2];
                if (x < pw / 2) { gauche++; gx += x; gy += y; } else { droite++; dx += x; dy += y; }
            }
            // seuil 6 % : réverbère allumé d'un côté 9 %, éteint 1,4 % ; torche
            // bleue 11 % ; fontaine 1,3 %, eau 0 %
            if (opaques > 0 && n >= 6 && n / opaques > 0.06) {
                var hex = function (v) { v = Math.round(Math.min(255, v)); return (v < 16 ? '0' : '') + v.toString(16); };
                var r = sr / n, g = sg / n, b = sb / n, m = Math.max(r, g, b);
                // on sature un peu : un halo pâle ne se voit pas
                r = r / m * 255; g = g / m * 255; b = b / m * 255;
                if (r > b) { g = g * 0.9; b = b * 0.7; }
                res = { x: sx / n - pw / 2, y: sy / n - ph, couleur: parseInt(hex(r) + hex(g) + hex(b), 16),
                        rayon: Math.max(70, Math.min(160, Math.sqrt(n) * 12)), flamme: !grand, lanternes: [] };
                // un réverbère : une tache lumineuse par lanterne allumée
                if (grand) {
                    if (gauche >= 12) res.lanternes.push({ x: gx / gauche - pw / 2, y: gy / gauche - ph });
                    if (droite >= 12) res.lanternes.push({ x: dx / droite - pw / 2, y: dy / droite - ph });
                }
            }
        } catch (e) { res = null; }
        return (lectures[cle] = res);
    }

    function lumiereImposee(ev) {
        var page = ev.page(); if (!page) return undefined;
        for (var i = 0; i < page.list.length; i++) {
            var c = page.list[i]; if (c.code !== 108 && c.code !== 408) continue;
            var m = String(c.parameters[0]).match(/<Lumi[eè]re:\s*([^>]+)>/i);
            if (!m) continue;
            var v = m[1].trim();
            if (/^aucune$/i.test(v)) return null;
            var a = v.split(/\s+/), col = parseInt((a[0] || '#ffcc88').replace('#', ''), 16);
            return { x: 0, y: -24, couleur: isNaN(col) ? 0xffcc88 : col, rayon: Number(a[1]) || 110, flamme: true, lanternes: [] };
        }
        return undefined;
    }

    // gardé par événement : on ne relit sa page et son sprite que quand sa
    // page, son image ou sa direction changent (la vitrine a 808 événements)
    function lumiereDe(ev) {
        if (ev._erased || ev._pageIndex < 0 || ev.isTransparent() || ev.opacity() < 60) return null;
        var nom = ev.characterName();
        var cle = ev._pageIndex + '|' + nom + '|' + ev.characterIndex() + '|' + ev.direction();
        if (ev._embCle === cle) return ev._embLum;
        var imp = lumiereImposee(ev), res;
        if (imp !== undefined) res = imp;
        else if (!nom || nom.charAt(0) !== '!') res = null;      // seulement les objets
        else res = lire(nom, ev.characterIndex(), ev.direction());
        if (res === undefined) return null;                       // image pas prête : on relira
        ev._embCle = cle; ev._embLum = res;
        return res;
    }

    /* ═══ les halos sur la carte ═══ */
    function Calque() { PIXI.Container.call(this); this._halos = []; this._t = 0; this._vus = 0; }
    Calque.prototype = Object.create(PIXI.Container.prototype);
    Calque.prototype.constructor = Calque;
    Calque.prototype.halo = function (k) {
        var s = this._halos[k];
        if (!s) {
            s = new PIXI.Sprite(texture());
            s.anchor.x = s.anchor.y = 0.5;
            s.blendMode = PIXI.BLEND_MODES.ADD;
            this._halos[k] = s; this.addChild(s);
        }
        s.visible = true;
        return s;
    };
    Calque.prototype.update = function () {
        this._t++;
        var nu = nuit(), dedans = !dehors(), k = 0;
        // le jour, dehors, les halos se taisent ; dedans, les feux gardent une lueur
        var base = dedans ? 0.55 : nu * 0.95;
        if (base > 0.02 && $gameMap) {
            var w = Graphics.width, h = Graphics.height, t = this._t;
            // la liste des sources de lumière, refaite une fois par seconde
            // (la vitrine a 808 événements ; une ville, une dizaine de lampes)
            if (!this._sources || t % 60 === 1 || this._carte !== $gameMap.mapId()) {
                this._carte = $gameMap.mapId();
                this._sources = $gameMap.events().filter(function (e) { return !!lumiereDe(e); });
            }
            var evs = this._sources;
            for (var i = 0; i < evs.length; i++) {
                var ev = evs[i], L = lumiereDe(ev);
                if (!L) continue;
                var sx = ev.screenX(), sy = ev.screenY();
                if (sx < -200 || sx > w + 200 || sy < -200 || sy > h + 260) continue;
                var points = L.lanternes.length ? L.lanternes : [L];
                for (var p = 0; p < points.length; p++) {
                    var s = this.halo(k++);
                    var vac = L.flamme ? 0.88 + 0.12 * Math.sin(t * 0.21 + i * 1.7) * Math.sin(t * 0.07 + i) : 1;
                    var rayon = (L.lanternes.length ? 95 : L.rayon) * (dedans ? 0.8 : 1);
                    s.x = sx + points[p].x; s.y = sy + points[p].y;
                    s.scale.x = s.scale.y = rayon * 2 / 128 * (0.96 + 0.04 * vac);
                    s.tint = L.couleur;
                    s.alpha = Math.min(1, base * FORCE * vac * 0.75);
                }
            }
        }
        for (var j = k; j < this._halos.length; j++) this._halos[j].visible = false;
        this._vus = k;
    };

    /* ═══ 3. la vignette ═══ */
    function vignette() {
        var w = Graphics.width, h = Graphics.height;
        var c = document.createElement('canvas'); c.width = w; c.height = h;
        var g = c.getContext('2d');
        var r = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.38, w / 2, h / 2, Math.hypot(w, h) * 0.56);
        r.addColorStop(0, 'rgba(0,0,0,0)');
        r.addColorStop(1, 'rgba(0,0,0,1)');
        g.fillStyle = r; g.fillRect(0, 0, w, h);
        var s = new PIXI.Sprite(PIXI.Texture.fromCanvas(c));
        s.update = function () { this.alpha = VIGNETTE * (0.75 + 0.6 * nuit()); };
        s.update();
        return s;
    }

    /* ═══ 4. les lucioles ═══ */
    function Lucioles() { PIXI.Container.call(this); this._l = []; this._t = 0; }
    Lucioles.prototype = Object.create(PIXI.Container.prototype);
    Lucioles.prototype.constructor = Lucioles;
    Lucioles.prototype.update = function () {
        this._t++;
        var saison = $gameSystem && $gameSystem.season ? $gameSystem.season() : 0;
        var meteoOk = !window.Meteo || Meteo.lucioles();      // pas sous la pluie, le brouillard, la neige
        var actif = dehors() && nuit() > 0.55 && saison !== 4 && meteoOk;   // saisons MOG : 1 printemps … 4 hiver
        if (!actif && !this._l.length) return;
        var w = Graphics.width, h = Graphics.height;
        while (actif && this._l.length < 12) {
            var s = new PIXI.Sprite(texture());
            s.anchor.x = s.anchor.y = 0.5; s.blendMode = PIXI.BLEND_MODES.ADD; s.tint = 0xd8ff7a;
            s.scale.x = s.scale.y = 0.13 + Math.random() * 0.06;
            s._x = Math.random() * w; s._y = h * 0.25 + Math.random() * h * 0.7;
            s._ph = Math.random() * 6.3; s._v = 0.25 + Math.random() * 0.35; s.alpha = 0;
            this._l.push(s); this.addChild(s);
        }
        var t = this._t, dxm = $gameMap ? $gameMap.displayX() * $gameMap.tileWidth() : 0, dym = $gameMap ? $gameMap.displayY() * $gameMap.tileHeight() : 0;
        this._l.forEach(function (s) {
            s._x += Math.cos(t * 0.01 + s._ph) * s._v; s._y += Math.sin(t * 0.013 + s._ph * 2) * s._v * 0.7;
            // elles flottent dans le décor, pas collées à l'écran
            s.x = ((s._x - dxm * 0.3) % w + w) % w; s.y = ((s._y - dym * 0.3) % h + h) % h;
            var cible = actif ? (0.35 + 0.45 * Math.max(0, Math.sin(t * 0.03 + s._ph * 3))) : 0;
            s.alpha += (cible - s.alpha) * 0.05;
        });
        if (!actif && this._l.every(function (s) { return s.alpha < 0.02; })) { this._l.forEach(function (s) { this.removeChild(s); }, this); this._l = []; }
    };

    /* ═══ l'option « Effets visuels » (menu Options) ═══
     * Pour un ami au vieux PC, ou qui n'aime pas : il coupe halos, lucioles,
     * vignette (et la pluie/neige à l'écran de MeteoVivante) sans toucher au
     * projet. Gardé avec les autres options, pas dans la sauvegarde. */
    ConfigManager.embellie = true;
    var _mk = ConfigManager.makeData;
    ConfigManager.makeData = function () { var c = _mk.call(this); c.embellie = this.embellie; return c; };
    var _ap = ConfigManager.applyData;
    ConfigManager.applyData = function (c) { _ap.call(this, c); this.embellie = c.embellie === undefined ? true : !!c.embellie; };
    var _go = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function () { _go.call(this); this.addCommand('Effets visuels', 'embellie'); };
    Embellie.actif = function () { return ConfigManager.embellie !== false; };

    /* ═══ la pose : au-dessus de la carte teintée, sous la météo et les images ═══ */
    var _lower = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function () {
        _lower.call(this);
        var i = this.children.indexOf(this._baseSprite) + 1;
        // ⚠ Mesuré en mode Canvas (PC dont la carte graphique n'est pas
        //   reconnue, où MV dessine sans WebGL) : 60 images/s sans rien,
        //   58 avec les halos, 55 avec les lucioles, 53 avec la vignette
        //   (un plein écran redessiné à chaque image). Dans ce mode, on garde
        //   les halos et on coupe le reste. En WebGL, tout est gratuit.
        var webgl = Graphics.isWebGL();
        if (HALOS) { this._embHalos = new Calque(); this.addChildAt(this._embHalos, i++); }
        if (LUCIOLES && webgl) { this._embLucioles = new Lucioles(); this.addChildAt(this._embLucioles, i++); }
        if (VIGNETTE > 0 && webgl) { this._embVignette = vignette(); this.addChildAt(this._embVignette, i++); }
    };
    var _upd = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        _upd.call(this);
        var on = Embellie.actif();
        [this._embHalos, this._embLucioles, this._embVignette].forEach(function (c) { if (c) { c.visible = on; if (on) c.update(); } });
    };

    Embellie.halos = function () { var s = SceneManager._scene && SceneManager._scene._spriteset; return s && s._embHalos ? s._embHalos._vus : 0; };
    Embellie.lire = lire;
    Embellie.palette = PALETTE;
})();
