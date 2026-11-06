//=============================================================================
// VisualOverhaul.js
//=============================================================================
/*:
 * @plugindesc [v1.0] Refonte visuelle : rendu plus net, fondus soyeux,
 * fenêtres animées, jauges arrondies, vignette d'ambiance. Le tout fluide.
 * @author Claude
 *
 * @param ---Rendu---
 * @default
 *
 * @param SmoothUpscale
 * @parent ---Rendu---
 * @text Lissage à l'agrandissement
 * @type boolean
 * @on Lisse
 * @off Pixel dur
 * @desc Lisse l'image quand le jeu est étiré sur grand écran.
 * @default true
 *
 * @param CrispText
 * @parent ---Rendu---
 * @text Texte plus net
 * @type boolean
 * @on Oui
 * @off Non
 * @desc Épaissit légèrement le contour du texte pour la lisibilité.
 * @default true
 *
 * @param ---Fluidité---
 * @default
 *
 * @param SceneFadeSpeed
 * @parent ---Fluidité---
 * @text Douceur des fondus
 * @type number
 * @min 12
 * @max 60
 * @desc Durée des fondus entre les scènes (plus grand = plus doux). Défaut moteur : 24.
 * @default 32
 *
 * @param SmoothWindows
 * @parent ---Fluidité---
 * @text Ouverture animée des fenêtres
 * @type boolean
 * @on Oui
 * @off Non
 * @desc Les fenêtres s'ouvrent/ferment avec une accélération douce.
 * @default true
 *
 * @param SmoothGauges
 * @parent ---Fluidité---
 * @text Jauges animées
 * @type boolean
 * @on Oui
 * @off Non
 * @desc Les jauges (PV/PM) glissent en douceur au lieu de sauter.
 * @default true
 *
 * @param ---Style---
 * @default
 *
 * @param PrettyGauges
 * @parent ---Style---
 * @text Jauges arrondies
 * @type boolean
 * @on Oui
 * @off Non
 * @desc Jauges aux bouts arrondis, avec reflet et bordure.
 * @default true
 *
 * @param ---Ambiance---
 * @default
 *
 * @param Vignette
 * @parent ---Ambiance---
 * @text Vignette d'écran
 * @type boolean
 * @on Oui
 * @off Non
 * @desc Assombrit doucement les bords de l'écran pour l'immersion.
 * @default true
 *
 * @param VignetteStrength
 * @parent ---Ambiance---
 * @text Force de la vignette
 * @type number
 * @min 0
 * @max 255
 * @desc Opacité maximale de la vignette aux coins (0-255).
 * @default 120
 *
 * @param VignetteOnMenus
 * @parent ---Ambiance---
 * @text Vignette dans les menus
 * @type boolean
 * @on Oui
 * @off Non
 * @desc Applique aussi la vignette dans les menus (pas seulement la carte/combat).
 * @default true
 *
 * @help
 * ============================================================================
 *  VisualOverhaul — Refonte visuelle
 * ============================================================================
 *
 * Un seul plugin, aucune image à ajouter, aucune dépendance.
 * Il enrobe le moteur RPG Maker MV pour rendre le jeu plus beau et plus fluide :
 *
 *   • Rendu    : lissage propre à l'agrandissement + texte plus net.
 *   • Fluidité : fondus de scène soyeux, fenêtres qui s'ouvrent en douceur,
 *                jauges qui glissent au lieu de sauter d'un coup.
 *   • Style    : jauges arrondies avec reflet et bordure.
 *   • Ambiance : vignette d'écran discrète qui renforce l'immersion.
 *
 * Chaque effet est indépendant et peut être désactivé dans les paramètres.
 * Le plugin est défensif : si une classe attendue est absente, l'effet
 * concerné s'annule silencieusement sans casser le jeu.
 *
 * Placez-le de préférence assez bas dans la liste des plugins pour qu'il
 * enrobe les fenêtres/jauges des autres plugins.
 * ============================================================================
 */

(function () {
    "use strict";

    var params = PluginManager.parameters("VisualOverhaul");
    var CFG = {
        smoothUpscale:   String(params["SmoothUpscale"]   || "true") === "true",
        crispText:       String(params["CrispText"]       || "true") === "true",
        fadeSpeed:       Number(params["SceneFadeSpeed"]   || 32),
        smoothWindows:   String(params["SmoothWindows"]   || "true") === "true",
        smoothGauges:    String(params["SmoothGauges"]    || "true") === "true",
        prettyGauges:    String(params["PrettyGauges"]    || "true") === "true",
        vignette:        String(params["Vignette"]        || "true") === "true",
        vignetteStr:     Number(params["VignetteStrength"] || 120),
        vignetteMenus:   String(params["VignetteOnMenus"] || "true") === "true"
    };

    //-------------------------------------------------------------------------
    // Rendu : lissage propre à l'agrandissement sur l'écran
    //-------------------------------------------------------------------------
    if (CFG.smoothUpscale && typeof Graphics !== "undefined") {
        var _Graphics_centerElement = Graphics._centerElement;
        Graphics._centerElement = function (element) {
            _Graphics_centerElement.call(this, element);
            if (element && element.style) {
                // Laisse le navigateur lisser l'agrandissement plutôt que
                // de garder des pixels durs et crénelés.
                element.style.imageRendering = "auto";
                element.style.webkitFontSmoothing = "antialiased";
            }
        };
    }

    //-------------------------------------------------------------------------
    // Rendu : texte un peu plus net (contour légèrement épaissi)
    //-------------------------------------------------------------------------
    if (CFG.crispText && typeof Window_Base !== "undefined") {
        var _WB_resetFontSettings = Window_Base.prototype.resetFontSettings;
        Window_Base.prototype.resetFontSettings = function () {
            _WB_resetFontSettings.call(this);
            if (this.contents) {
                this.contents.outlineColor = "rgba(0, 0, 0, 0.65)";
                this.contents.outlineWidth = 5;
            }
        };
    }

    //-------------------------------------------------------------------------
    // Fluidité : fondus de scène plus doux
    //-------------------------------------------------------------------------
    if (typeof Scene_Base !== "undefined" && CFG.fadeSpeed > 0) {
        Scene_Base.prototype.fadeSpeed = function () {
            return CFG.fadeSpeed;
        };
    }

    //-------------------------------------------------------------------------
    // Fluidité : ouverture/fermeture des fenêtres avec accélération douce
    //-------------------------------------------------------------------------
    if (CFG.smoothWindows && typeof Window_Base !== "undefined") {
        Window_Base.prototype.updateOpen = function () {
            if (this._opening) {
                // Ease-out : rapide au début, ralentit près de la fin.
                var step = Math.max(10, (255 - this.openness) * 0.22);
                this.openness += step;
                if (this.isOpen()) {
                    this._opening = false;
                }
            }
        };
        Window_Base.prototype.updateClose = function () {
            if (this._closing) {
                var step = Math.max(10, this.openness * 0.22);
                this.openness -= step;
                if (this.isClosed()) {
                    this._closing = false;
                }
            }
        };
    }

    //-------------------------------------------------------------------------
    // Style + Fluidité : jauges arrondies, avec reflet, et remplissage animé
    //-------------------------------------------------------------------------
    if ((CFG.prettyGauges || CFG.smoothGauges) && typeof Window_Base !== "undefined") {

        // Dessine un rectangle aux coins arrondis dans le contexte 2D du bitmap.
        function roundRectPath(ctx, x, y, w, h, r) {
            r = Math.min(r, h / 2, w / 2);
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
        }

        var _WB_drawGauge = Window_Base.prototype.drawGauge;

        Window_Base.prototype.drawGauge = function (x, y, width, rate, color1, color2) {
            // Remplissage animé : chaque jauge glisse vers sa valeur cible.
            if (CFG.smoothGauges) {
                if (!this._voGaugeRates) this._voGaugeRates = {};
                var key = x + "," + y + "," + width;
                var shown = this._voGaugeRates[key];
                if (shown === undefined) shown = rate;
                if (Math.abs(shown - rate) < 0.004) {
                    shown = rate;
                } else {
                    shown += (rate - shown) * 0.20; // interpolation douce
                    this._voNeedGaugeRefresh = true;
                }
                this._voGaugeRates[key] = shown;
                rate = shown;
            }

            if (!CFG.prettyGauges || !this.contents || !this.contents.context) {
                return _WB_drawGauge.call(this, x, y, width, rate, color1, color2);
            }

            var ctx = this.contents.context;
            var h = 8;
            var gy = y + this.lineHeight() - h - 2;
            var r = h / 2;
            var fillW = Math.max(rate > 0 ? h : 0, Math.floor(width * rate));

            ctx.save();

            // Fond de la jauge
            roundRectPath(ctx, x, gy, width, h, r);
            ctx.fillStyle = this.gaugeBackColor();
            ctx.fill();

            // Remplissage dégradé, clippé aux coins arrondis
            if (fillW > 0) {
                ctx.save();
                roundRectPath(ctx, x, gy, width, h, r);
                ctx.clip();
                var grad = ctx.createLinearGradient(x, gy, x + width, gy);
                grad.addColorStop(0, color1);
                grad.addColorStop(1, color2);
                ctx.fillStyle = grad;
                ctx.fillRect(x, gy, fillW, h);

                // Reflet en haut du remplissage
                ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
                ctx.fillRect(x, gy + 1, fillW, Math.max(1, Math.floor(h / 3)));
                ctx.restore();
            }

            // Bordure fine
            roundRectPath(ctx, x + 0.5, gy + 0.5, width - 1, h - 1, r);
            ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.restore();

            if (this.contents._setDirty) this.contents._setDirty();
        };

        // Redessine les fenêtres tant que des jauges sont en cours d'animation.
        if (CFG.smoothGauges) {
            var _WB_update = Window_Base.prototype.update;
            Window_Base.prototype.update = function () {
                _WB_update.call(this);
                if (this._voNeedGaugeRefresh && this.contents) {
                    this._voNeedGaugeRefresh = false;
                    if (typeof this.refresh === "function") {
                        this.refresh();
                    }
                }
            };
        }
    }

    //-------------------------------------------------------------------------
    // Ambiance : vignette d'écran
    //-------------------------------------------------------------------------
    if (CFG.vignette && CFG.vignetteStr > 0 && typeof Scene_Base !== "undefined") {

        var _vignetteBitmap = null;

        function getVignetteBitmap() {
            if (_vignetteBitmap) return _vignetteBitmap;
            var w = Graphics.width;
            var h = Graphics.height;
            var bmp = new Bitmap(w, h);
            var ctx = bmp.context;
            // Dégradé radial : centre transparent, bords sombres.
            var cx = w / 2, cy = h / 2;
            var inner = Math.min(w, h) * 0.35;
            var outer = Math.sqrt(cx * cx + cy * cy);
            var g = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
            var a = (CFG.vignetteStr / 255).toFixed(3);
            g.addColorStop(0, "rgba(0,0,0,0)");
            g.addColorStop(0.65, "rgba(0,0,0," + (a * 0.35).toFixed(3) + ")");
            g.addColorStop(1, "rgba(0,0,0," + a + ")");
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);
            if (bmp._setDirty) bmp._setDirty();
            _vignetteBitmap = bmp;
            return bmp;
        }

        // Cette scène doit-elle recevoir la vignette ?
        function sceneWantsVignette(scene) {
            if (!scene) return false;
            var isMap    = (typeof Scene_Map !== "undefined")    && scene instanceof Scene_Map;
            var isBattle = (typeof Scene_Battle !== "undefined") && scene instanceof Scene_Battle;
            if (isMap || isBattle) return true;
            if (!CFG.vignetteMenus) return false;
            // Autres scènes de jeu (menus) ; on évite l'amorçage et le titre.
            var isBoot  = (typeof Scene_Boot  !== "undefined") && scene instanceof Scene_Boot;
            var isTitle = (typeof Scene_Title !== "undefined") && scene instanceof Scene_Title;
            var isGame  = (typeof Scene_MenuBase !== "undefined") && scene instanceof Scene_MenuBase;
            return isGame && !isBoot && !isTitle;
        }

        var _SB_createWindowLayer = Scene_Base.prototype.createWindowLayer;
        Scene_Base.prototype.createWindowLayer = function () {
            // Insérée juste avant la couche de fenêtres : elle teinte le monde
            // mais laisse le texte des fenêtres parfaitement lisible.
            if (sceneWantsVignette(this) && !this._voVignette) {
                try {
                    var sp = new Sprite(getVignetteBitmap());
                    sp.z = 0;
                    this._voVignette = sp;
                    this.addChild(sp);
                } catch (e) {
                    this._voVignette = null;
                }
            }
            _SB_createWindowLayer.call(this);
        };
    }

})();
