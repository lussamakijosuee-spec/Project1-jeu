//=============================================================================
// Allegement.js — v1.2  ·  Ce qu'on ne voit pas ne coûte rien
// RPG Maker MV   ·   pour JOKO
//   À charger EN DERNIER (après les MOG et les YEP qui touchent aux sprites).
//=============================================================================
/*:
 * @plugindesc v1.2 ■ Les événements loin de l'écran ne sont plus recalculés
 * ni dessinés à chaque image ; relire des pixels ne bloque plus le jeu.
 * @author JOKO
 *
 * @param marge
 * @text Marge autour de l'écran (pixels)
 * @type number
 * @min 48
 * @default 144
 * @desc Un événement plus loin que ça hors de l'écran est mis en veille.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  CE QU'ON NE VOIT PAS NE COÛTE RIEN
 * ═══════════════════════════════════════════════════════════════════════════
 *  JOKO : « corrige les lag ». Mesuré (bancs/navigateur/ca_rame_en_ville.js) :
 *  le coût d'une image grandit avec le NOMBRE d'événements, parce que chaque
 *  sprite d'événement — et son ombre (MOG_CharacterShadow), sa poussière
 *  (MOG_CharDustTrail), son mouvement (MOG_CharacterMotion) — est recalculé
 *  et redessiné à chaque image, même quand il est à l'autre bout de la carte.
 *
 *  Ce plugin met en veille le SPRITE (l'image affichée) d'un événement qui est
 *  loin de l'écran. L'événement lui-même continue de vivre : il marche, ses
 *  processus parallèles tournent, ses pages changent, VieDuVillage et
 *  Habitants le pilotent. Dès qu'il revient près de l'écran, son sprite se
 *  réveille. Un événement qui joue une animation ou une bulle n'est jamais
 *  mis en veille.
 *
 *  v1.1 (2026-10-02) — « les cinémas rament » : mesuré par une sonde qui
 *  joue chaque effet dans le moteur.
 *   · La 1re animation recolorée d'un combat bloquait le jeu jusqu'à 1 s,
 *     l'ouverture d'une fenêtre de message 0,6 s : MV relit les pixels d'un
 *     canevas que le navigateur garde sur la carte graphique. Les canevas
 *     sont maintenant déclarés « relus souvent » : 6,5 s de blocage → 0,2 s
 *     sur le même parcours.
 *   · D'une carte à l'autre, MV ne photographie plus l'écran (la photo ne
 *     sert qu'au fond des menus) : un changement de carte bloque 185 ms au
 *     lieu de 318.
 *
 *  v1.2 (2026-10-03) — « des carrés noirs au-dessus des ennemis » :
 *   IconSet.png fait 8 384 px de haut. Une carte graphique qui plafonne ses
 *   textures à 8 192 px (rendu logiciel, beaucoup de portables) refuse
 *   l'image entière : chaque icône dessinée par un SPRITE (états sur les
 *   ennemis, popups) sort en carré noir. Une image plus haute que ce que
 *   la carte accepte est maintenant découpée en pages, en mémoire, et
 *   chaque sprite lit la page où tombe son icône. L'image du projet n'est
 *   pas touchée ; sur une carte qui accepte 16 384 px, rien ne change.
 *
 *  SCRIPT :  Allegement.enVeille()   → combien de sprites dorment, là
 *            Allegement.plafondTextures()  → ce que la carte accepte
 */
var Allegement = window.Allegement || {};
window.Allegement = Allegement;
(function () {
    'use strict';
    var P = PluginManager.parameters('Allegement');
    var MARGE = Math.max(48, Number(P.marge || 144));

    function horsEcran(sprite) {
        var c = sprite._character;
        if (!c || !(c instanceof Game_Event)) return false;
        if (c.isAnimationPlaying() || c.isBalloonPlaying()) return false;
        if ((sprite._animationSprites && sprite._animationSprites.length) || sprite._balloonSprite) return false;
        var m = MARGE + (sprite.width || 0), x = c.screenX(), y = c.screenY();
        return x < -m || x > Graphics.width + m || y < -m || y > Graphics.height + m + (sprite.height || 0);
    }

    var _maj = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function () {
        if (horsEcran(this)) {
            this._enVeille = true;
            this.visible = false;
            return;
        }
        this._enVeille = false;
        _maj.call(this);
    };

    // l'ombre et la poussière suivent leur personnage
    function suivre(Classe) {
        if (typeof Classe === 'undefined') return;
        var _u = Classe.prototype.update;
        Classe.prototype.update = function () {
            if (this._spriteCharacter && this._spriteCharacter._enVeille) { this.visible = false; return; }
            _u.call(this);
        };
    }
    if (typeof CharShadowSprite !== 'undefined') suivre(CharShadowSprite);
    if (typeof CharDustTrailSprites !== 'undefined') suivre(CharDustTrailSprites);

    // ── Relire des pixels sans bloquer le jeu ─────────────────────────────
    // ⚠ 2026-10-02, mesuré (cinéma.js) : la 1re animation recolorée d'un
    //   combat (Bitmap.rotateHue) bloquait le jeu jusqu'à 1 s, l'ouverture de
    //   la fenêtre de message (Bitmap.adjustTone) 0,6 s. MV y relit les pixels
    //   d'un canevas 2D (getImageData) ; le navigateur garde ces canevas sur la
    //   carte graphique, et les relire impose un aller-retour très lent. Un
    //   canevas déclaré « relu souvent » reste en mémoire : la relecture devient
    //   une simple copie, et l'envoi vers WebGL est aussi direct.
    if (typeof HTMLCanvasElement !== 'undefined') {
        var _ctx = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, opts) {
            if (type === '2d' && !opts) return _ctx.call(this, type, { willReadFrequently: true });
            return _ctx.apply(this, arguments);
        };
    }

    // ── Changer de carte sans photographier l'écran ──────────────────────
    // MV photographie l'écran (et le floute) en quittant une carte : c'est le
    // fond des menus. D'une carte à l'autre, personne ne s'en sert, et la
    // photo relit tout l'écran depuis la carte graphique (readPixels).
    var _snap = SceneManager.snapForBackground;
    SceneManager.snapForBackground = function () {
        if (this._scene instanceof Scene_Map && this.isNextScene(Scene_Map)) return;
        _snap.call(this);
    };

    // ── MOG_VisualTimer au « Test de combat » de l'éditeur ───────────────
    // Le test de combat n'a pas de carte ($dataMap reste vide). La jauge du
    // minuteur demande où est le joueur à l'écran pour s'estomper sous lui ;
    // ça lit la carte, et le test plantait avant même de s'ouvrir.
    if (typeof TimerGauge !== 'undefined' && TimerGauge.prototype.isHudVisible) {
        var _hudVisible = TimerGauge.prototype.isHudVisible;
        TimerGauge.prototype.isHudVisible = function () { return $dataMap ? _hudVisible.call(this) : true; };
    }

    // ── Irina_AntiAudioDelay : ne pas précharger un son sans nom ──────────
    // Irina précharge les sons des commandes à venir, sans regarder si la
    // commande « Jouer un son » est restée sur « (Aucun) » : elle demandait
    // alors audio/se/.ogg (trouvé en combat, troupe 24). On saute ces vides.
    if (Game_Interpreter.prototype.loadAheadAudioCommands) {
        var _avance = Game_Interpreter.prototype.loadAheadAudioCommands;
        Game_Interpreter.prototype.loadAheadAudioCommands = function () {
            var cb = AudioManager.createBuffer;
            AudioManager.createBuffer = function (dossier, nom) { return nom ? cb.apply(this, arguments) : null; };
            try { return _avance.apply(this, arguments); } finally { AudioManager.createBuffer = cb; }
        };
    }

    // ── Les images plus hautes que ce que la carte graphique accepte ───────
    var plafond = null;
    Allegement.plafondTextures = function () {
        if (plafond !== null) return plafond;
        var r = Graphics._renderer, gl = r && r.gl;
        plafond = gl ? Number(gl.getParameter(gl.MAX_TEXTURE_SIZE)) || 0 : 0;   // 0 : Canvas, pas de plafond
        return plafond;
    };
    Allegement.decoupage = true;
    function pagesDe(bm) {
        if (bm.__pages !== undefined) return bm.__pages;
        var max = Allegement.plafondTextures();
        if (!max || !bm.isReady() || bm.height <= max || bm.width > max) return (bm.__pages = null);
        var haut = Math.floor(max / 32) * 32, pages = [];       // des pages qui ne coupent pas une icône
        for (var y = 0; y < bm.height; y += haut) {
            var h = Math.min(haut, bm.height - y), p = new Bitmap(bm.width, h);
            p.blt(bm, 0, y, bm.width, h, 0, 0);
            p.__y = y;
            pages.push(p);
        }
        return (bm.__pages = pages);
    }
    Allegement.pagesDe = pagesDe;
    var _refresh = Sprite.prototype._refresh;
    Sprite.prototype._refresh = function () {
        var bm = this._bitmap;
        var pages = Allegement.decoupage && bm && bm.height > 4096 ? pagesDe(bm) : null;
        if (!pages) return _refresh.apply(this, arguments);
        var f = this._frame, p = pages[Math.max(0, Math.min(pages.length - 1, Math.floor(f.y / pages[0].height)))];
        if (f.y + f.height > p.__y + p.height) return _refresh.apply(this, arguments);   // à cheval : tel quel
        var y0 = f.y;
        this._bitmap = p; f.y = y0 - p.__y;
        try { return _refresh.apply(this, arguments); } finally { this._bitmap = bm; f.y = y0; }
    };

    Allegement.enVeille = function () {
        var s = SceneManager._scene && SceneManager._scene._spriteset;
        if (!s || !s._characterSprites) return 0;
        return s._characterSprites.filter(function (x) { return x._enVeille; }).length;
    };
})();
