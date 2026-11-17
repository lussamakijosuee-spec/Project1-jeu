//=============================================================================
// CombatPlus.js — v1.0  ·  Jauges ennemies, ennemis qui vacillent, transitions
// RPG Maker MV   ·   pour JOKO
//   Inspiré, sans rien en copier, de Visual HP Gauge et Weak Enemy Poses
//   (Yanfly) ; les transitions d'entrée en combat sont maison.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Jauge de PV ennemie, ennemis qui vacillent, transitions
 * d'entrée en combat, musique et fonds de combat, option de vitesse des animations.
 * @author JOKO
 *
 * @param jauge
 * @text Jauge de PV ennemie : quand
 * @type select
 * @option visé ou touché
 * @value visee
 * @option toujours
 * @value toujours
 * @option jamais
 * @value jamais
 * @default visee
 * @desc « visé ou touché » : elle apparaît quand on vise l'ennemi ou qu'il perd/gagne des PV, puis s'efface.
 *
 * @param jaugeDuree
 * @text Jauge : durée après un coup
 * @type number
 * @min 30
 * @default 150
 * @desc En images (60 = 1 seconde). Combien de temps la jauge reste après un coup.
 *
 * @param jaugeLargeur
 * @text Jauge : largeur
 * @type number
 * @min 40
 * @default 110
 *
 * @param jaugeChiffres
 * @text Jauge : chiffres
 * @type select
 * @option aucun
 * @value aucun
 * @option pourcentage
 * @value pourcent
 * @option PV restants
 * @value pv
 * @default aucun
 *
 * @param vaciller
 * @text Vacille sous (% de PV)
 * @type number
 * @min 0
 * @max 100
 * @default 25
 * @desc Un ennemi sous ce pourcentage de PV vacille sur ses appuis. 0 = jamais.
 *
 * @param transition
 * @text Transition d'entrée en combat
 * @type select
 * @option tourbillon
 * @value tourbillon
 * @option éclats
 * @value eclats
 * @option celle de MV (zoom)
 * @value mv
 * @default tourbillon
 *
 * @param transitionBoss
 * @text Transition des combats de boss
 * @type select
 * @option tourbillon
 * @value tourbillon
 * @option éclats
 * @value eclats
 * @option celle de MV (zoom)
 * @value mv
 * @default eclats
 * @desc Quand la troupe contient un boss (<Boss>, <Mahoraga>, <DonoBoss>, <Radahn>).
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  JAUGES ENNEMIES, ENNEMIS QUI VACILLENT, TRANSITIONS
 * ═══════════════════════════════════════════════════════════════════════════
 *  ── LA JAUGE DE PV ────────────────────────────────────────────────────
 *  Une petite barre sous les pieds de l'ennemi qu'on vise, ou qui vient de
 *  prendre un coup ; la trace dorée montre ce que le coup a retiré, puis
 *  s'efface. Le boss qui a déjà sa grande barre en haut (ScenesDeBoss) n'en
 *  a pas une deuxième.
 *  Note d'ennemi :  <Sans jauge>      jamais de jauge pour lui.
 *
 *  ── LES ENNEMIS QUI VACILLENT ─────────────────────────────────────────
 *  Sous 25 % de PV (réglable), l'ennemi tangue sur ses appuis : on voit
 *  d'un coup d'œil qui est presque à terre. Les grands sprites tanguent
 *  moins, pour ne pas balayer l'écran.
 *  Note d'ennemi :  <Ne vacille pas>
 *
 *  ── LA TRANSITION D'ENTRÉE EN COMBAT ──────────────────────────────────
 *  tourbillon : l'écran s'enroule autour du joueur et l'avale.
 *  éclats     : l'écran se brise en morceaux qui tombent.
 *  mv         : le zoom d'origine de RPG Maker.
 *  Les combats de boss ont la leur (éclats par défaut).
 *  Pour UN combat précis, juste avant « Combat » dans l'événement :
 *      TRANSITION eclats            le prochain combat seulement
 *      TRANSITION tourbillon
 *      TRANSITION mv
 *  Pour changer la règle jusqu'à nouvel ordre :
 *      TRANSITION eclats toujours   tous les combats, boss compris
 *      TRANSITION défaut            revenir aux paramètres du plugin
 *  La musique de combat, la photo du fond et le fondu au noir restent ceux
 *  de MV, aux mêmes images.
 *
 *  ── LA MUSIQUE D'UN COMBAT SCÉNARISÉ ──────────────────────────────────
 *  Juste avant « Combat » dans l'événement :
 *      COMBAT musique garder        la musique de la carte continue
 *      COMBAT musique Battle-05     ce combat-là joue Battle-05 (audio/bgm)
 *      COMBAT musique garder toujours    … pour tous, jusqu'à nouvel ordre
 *      COMBAT musique défaut        la musique de combat habituelle
 *
 *  ── UN FOND DE COMBAT SELON LA RÉGION ─────────────────────────────────
 *  Note de la CARTE :   <Fond région 5: Grassland, Forest>
 *  → un combat qui commence sur la région 5 prend ces deux fonds
 *  (img/battlebacks1, puis img/battlebacks2 ; le second peut manquer).
 *  Plusieurs régions :  <Fond région 5, 6: Castle1, Castle2>
 *  ⚠ Le nom doit être celui d'une image qui existe, sinon le combat plante.
 *
 *  ── L'IMAGE DE L'ARME PENDANT L'ATTAQUE ───────────────────────────────
 *  Note de l'ARME :   <Image d'arme: Sword Blue>
 *  → en combat, le héros brandit img/weapons/Sword Blue.png (les 512 armes
 *  du pack de Yanfly : Sword, Axe, Whip… en 16 couleurs) au lieu de l'image
 *  de son type d'arme. La balise de Yanfly <Weapon Image: …> marche aussi.
 *
 *  ── L'OPTION « ANIMATIONS (COMBAT) » ──────────────────────────────────
 *  Dans le menu Options : Normal, Rapide ou Éclair. Les animations des
 *  compétences jouent plus vite en combat (pour qui les a déjà vues cent
 *  fois). Sur la carte, rien ne change.
 */
var CombatPlus = window.CombatPlus || {};
window.CombatPlus = CombatPlus;
(function () {
    'use strict';
    var P = PluginManager.parameters('CombatPlus');
    var QUAND = String(P.jauge || 'visee');
    var DUREE = Math.max(30, Number(P.jaugeDuree) || 150);
    var LARG = Math.max(40, Number(P.jaugeLargeur) || 110);
    var CHIFFRES = String(P.jaugeChiffres || 'aucun');
    var SEUIL = (P.vaciller === undefined || P.vaciller === '' ? 25 : Number(P.vaciller)) / 100;
    function style(s, d) {
        s = String(s || '').toLowerCase().replace(/é/g, 'e').trim();
        if (s === 'normale' || s === 'zoom') s = 'mv';
        return s === 'tourbillon' || s === 'eclats' || s === 'mv' ? s : d;
    }
    var TRANSITION = style(P.transition, 'tourbillon');
    var TRANSITION_BOSS = style(P.transitionBoss, 'eclats');
    var HAUT = 7;

    function noteEnnemi(b, cle) { var e = b && b.enemy && b.enemy(); return !!(e && e.meta && e.meta[cle]); }
    function estBoss(b) {
        if (window.MecaBoss && MecaBoss.estBoss) return MecaBoss.estBoss(b);
        var e = b && b.enemy && b.enemy();
        return !!(e && e.meta && (e.meta.Boss || e.meta.Mahoraga || e.meta.DonoBoss || e.meta.Radahn));
    }

    //=========================================================================
    // La jauge de PV
    //=========================================================================
    function Sprite_JaugeEnnemie() { this.initialize.apply(this, arguments); }
    Sprite_JaugeEnnemie.prototype = Object.create(Sprite.prototype);
    Sprite_JaugeEnnemie.prototype.constructor = Sprite_JaugeEnnemie;
    Sprite_JaugeEnnemie.prototype.initialize = function (cible) {
        Sprite.prototype.initialize.call(this);
        this._cible = cible;                  // le Sprite_Enemy suivi
        this._texte = CHIFFRES === 'aucun' ? 0 : 50;
        this.bitmap = new Bitmap(LARG + 4 + this._texte, HAUT + 4);
        this.anchor.x = 0;
        this.opacity = 0;
        this._minuterie = 0;
        this._pv = null;
        this._affiche = 1;
        this._attente = 0;
        this._cle = '';
    };
    Sprite_JaugeEnnemie.prototype.ennemi = function () { return this._cible && this._cible._enemy; };
    // Ce qui décide si elle se montre : le texte de l'aide, ligne pour ligne
    Sprite_JaugeEnnemie.prototype.doitSeMontrer = function (b) {
        if (QUAND === 'jamais' || !b || !b.isAppeared() || noteEnnemi(b, 'Sans jauge')) return false;
        var c = this._cible;
        if (!c.visible || c.opacity <= 0) return false;
        var barre = SceneManager._scene && SceneManager._scene._barreBoss;
        if (barre && barre._boss === b) return false;           // il a déjà la grande barre
        if (QUAND === 'toujours') return b.isAlive() || this._minuterie > 0;
        return b.isSelected() || this._minuterie > 0;
    };
    Sprite_JaugeEnnemie.prototype.update = function () {
        Sprite.prototype.update.call(this);
        var b = this.ennemi();
        if (!b) { this.opacity = 0; return; }
        if (this._pv === null) { this._pv = b.hp; this._affiche = b.hpRate(); }
        if (b.hp !== this._pv) {
            if (b.hp < this._pv) this._attente = 24; else this._affiche = b.hpRate();
            this._pv = b.hp;
            this._minuterie = DUREE;
        } else if (this._minuterie > 0) this._minuterie--;
        // la trace dorée : elle attend un instant, puis rejoint la vraie valeur
        var vrai = b.hpRate();
        if (this._affiche < vrai) this._affiche = vrai;
        if (this._attente > 0) this._attente--;
        else if (this._affiche > vrai) this._affiche = Math.max(vrai, this._affiche - 0.008);
        var cible = this.doitSeMontrer(b) ? 255 : 0;
        this.opacity += (cible - this.opacity) * 0.25;
        if (Math.abs(cible - this.opacity) < 3) this.opacity = cible;
        if (this.opacity <= 0) return;
        this.placer(b);
        var faible = SEUIL > 0 && b.isAlive() && vrai <= SEUIL;
        var cle = [b.hp, b.mhp, Math.round(this._affiche * 400), faible ? Math.floor(Graphics.frameCount / 15) % 2 : 0].join('|');
        if (cle !== this._cle) { this._cle = cle; this.dessiner(b, faible); }
    };
    Sprite_JaugeEnnemie.prototype.placer = function (b) {
        var c = this._cible, champ = c.parent;
        var x = c.x + (champ ? champ.x : 0) - (LARG + 4) / 2;
        var y = c.y + (champ ? champ.y : 0) + 4;
        var scene = SceneManager._scene, statut = scene && scene._statusWindow;
        var bas = Graphics.boxHeight - this.bitmap.height - 2;
        if (statut && statut.visible && statut.isOpen && statut.isOpen()) bas = Math.min(bas, statut.y - this.bitmap.height - 2);
        this.x = Math.round(Math.max(2, Math.min(Graphics.boxWidth - this.bitmap.width - 2, x)));
        this.y = Math.round(Math.min(bas, y));
    };
    Sprite_JaugeEnnemie.prototype.dessiner = function (b, faible) {
        var bm = this.bitmap;
        bm.clear();
        bm.fillRect(0, 0, LARG + 4, HAUT + 4, 'rgba(0,0,0,0.75)');
        bm.fillRect(2, 2, LARG, HAUT, faible && /\|1$/.test(this._cle) ? '#4a1a1a' : '#2a1414');
        bm.fillRect(2, 2, Math.floor(LARG * this._affiche), HAUT, '#e8c070');
        bm.gradientFillRect(2, 2, Math.floor(LARG * b.hpRate()), HAUT, '#8a1010', faible ? '#ff5a3a' : '#d23a2a');
        bm.fillRect(2, 2, Math.floor(LARG * b.hpRate()), 1, 'rgba(255,255,255,0.28)');
        if (this._texte) {
            bm.fontSize = 13; bm.outlineWidth = 3; bm.textColor = '#ffffff';
            var t = CHIFFRES === 'pv' ? String(b.hp) : Math.ceil(b.hpRate() * 100) + ' %';
            bm.drawText(t, LARG + 6, -3, this._texte - 2, HAUT + 8, 'left');
        }
    };
    CombatPlus.Sprite_JaugeEnnemie = Sprite_JaugeEnnemie;

    // Une couche au-dessus des combattants, sous les fenêtres, qui suit la
    // caméra (YEP_X_ActSeqPack3 déplace tout le Spriteset).
    var _createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function () {
        _createLowerLayer.call(this);
        this._cpJauges = new Sprite();
        this._baseSprite.addChild(this._cpJauges);
        this.cpSynchroniserJauges();
    };
    Spriteset_Battle.prototype.cpSynchroniserJauges = function () {
        var couche = this._cpJauges, liste = this._enemySprites || [];
        if (!couche) return;
        // un ennemi ajouté en cours de combat reçoit la sienne
        var suivies = couche.children.map(function (j) { return j._cible; });
        liste.forEach(function (s) { if (suivies.indexOf(s) < 0) couche.addChild(new Sprite_JaugeEnnemie(s)); });
        for (var i = couche.children.length - 1; i >= 0; i--) {
            if (liste.indexOf(couche.children[i]._cible) < 0) couche.removeChildAt(i);
        }
    };
    var _sbUpdate = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function () {
        _sbUpdate.call(this);
        if (this._cpJauges && this._cpJauges.children.length !== (this._enemySprites || []).length) this.cpSynchroniserJauges();
    };
    CombatPlus.jauges = function () {
        var s = SceneManager._scene && SceneManager._scene._spriteset;
        return s && s._cpJauges ? s._cpJauges.children : [];
    };

    //=========================================================================
    // Les ennemis qui vacillent
    //=========================================================================
    var _seUpdate = Sprite_Enemy.prototype.update;
    Sprite_Enemy.prototype.update = function () {
        _seUpdate.call(this);
        var b = this._enemy;
        var vacille = SEUIL > 0 && b && b.isAlive() && b.isAppeared() && b.hpRate() <= SEUIL && !noteEnnemi(b, 'Ne vacille pas');
        if (vacille) {
            if (this._cpPhase === undefined) this._cpPhase = Math.floor(Math.random() * 1000);
            // 2,5° au plus, et jamais plus de 12 px de balayage en haut du sprite
            var h = this.bitmap && this.bitmap.height ? this.bitmap.height * Math.abs(this.scale.y) : 100;
            var amp = Math.min(2.5 * Math.PI / 180, 12 / Math.max(1, h));
            var t = Graphics.frameCount + this._cpPhase;
            this.rotation = amp * Math.sin(t / 7) * (0.55 + 0.45 * Math.sin(t / 19));
            this._cpVacille = true;
        } else if (this._cpVacille) {
            this.rotation = 0;
            this._cpVacille = false;
        }
    };

    //=========================================================================
    // La transition d'entrée en combat
    //=========================================================================
    function etat() { return $gameSystem; }
    CombatPlus.styleDuProchainCombat = function () {
        var s = etat();
        if (s._cpTransitionSuivante) return s._cpTransitionSuivante;
        if (s._cpTransition) return s._cpTransition;
        var boss = $gameTroop.members().some(function (m) { return estBoss(m); });
        return boss ? TRANSITION_BOSS : TRANSITION;
    };

    var TORSION = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'uniform sampler2D uSampler;',
        'uniform vec4 filterArea;',
        'uniform vec4 filterClamp;',
        'uniform vec2 centre;',
        'uniform float rayon;',
        'uniform float angle;',
        'void main(void) {',
        '    vec2 c = vTextureCoord * filterArea.xy + filterArea.zw - centre;',
        '    float d = length(c);',
        '    if (d < rayon) {',
        '        float k = (rayon - d) / rayon;',
        '        float a = k * k * angle;',
        '        float s = sin(a); float co = cos(a);',
        '        c = vec2(c.x * co - c.y * s, c.x * s + c.y * co);',
        '    }',
        '    vec2 coord = (c + centre - filterArea.zw) / filterArea.xy;',
        '    gl_FragColor = texture2D(uSampler, clamp(coord, filterClamp.xy, filterClamp.zw));',
        '}'
    ].join('\n');
    function filtreTorsion() {
        if (!Graphics.isWebGL || !Graphics.isWebGL() || !PIXI.Filter) return null;
        try {
            var f = new PIXI.Filter(null, TORSION);
            if (!f.uniforms || !('angle' in f.uniforms)) return null;
            return f;
        } catch (e) { return null; }
    }

    // MV photographie la carte pour le fond du combat, puis floute la photo.
    // On en garde une copie NETTE au passage, avant le flou : aucune photo de
    // plus (c'est la relecture de l'écran qui coûte, pas la copie).
    function photographierAvecMV(scene) {
        var net = null, _snap = Bitmap.snap;
        Bitmap.snap = function (stage) {
            var b = _snap.apply(this, arguments);
            if (stage === scene && !net) { net = new Bitmap(b.width, b.height); net.blt(b, 0, 0, b.width, b.height, 0, 0); }
            return b;
        };
        try { scene.snapForBattleBackground(); } finally { Bitmap.snap = _snap; }
        if (!net) {   // un plugin a court-circuité la photo de MV : on la prend nous-mêmes
            var calque = scene._windowLayer, vu = calque.visible;
            calque.visible = false;
            try { net = Bitmap.snap(scene); } finally { calque.visible = vu; }
        }
        net.checkDirty();   // ces morceaux sont des PIXI.Sprite : MV ne le ferait pas pour eux
        return new PIXI.Texture(net.baseTexture);
    }
    function morceau(tex, x, y, w, h) {
        if (x === undefined) return new PIXI.Sprite(tex);
        return new PIXI.Sprite(new PIXI.Texture(tex.baseTexture, new PIXI.Rectangle(x, y, w, h)));
    }

    function Sprite_Transition() { this.initialize.apply(this, arguments); }
    Sprite_Transition.prototype = Object.create(Sprite.prototype);
    Sprite_Transition.prototype.constructor = Sprite_Transition;
    Sprite_Transition.prototype.initialize = function (genre, photo, cx, cy) {
        Sprite.prototype.initialize.call(this);
        this._genre = genre;
        this._cx = cx; this._cy = cy;
        this._texture = photo;
        var w = Graphics.width, h = Graphics.height;
        this._fond = new Sprite(new Bitmap(w, h));
        this._fond.bitmap.fillAll('#000000');
        this.addChild(this._fond);
        if (genre === 'eclats') this.creerEclats(photo, w, h);
        else this.creerTourbillon(photo);
        this._ombre = new Sprite(this._fond.bitmap);
        this._ombre.opacity = 0;
        this.addChild(this._ombre);
        this._eclair = new Sprite(new Bitmap(w, h));
        this._eclair.bitmap.fillAll('#ffffff');
        this._eclair.opacity = 0;
        this.addChild(this._eclair);
    };
    Sprite_Transition.prototype.creerTourbillon = function (photo) {
        var s = morceau(photo);
        s.pivot.x = this._cx; s.pivot.y = this._cy;
        s.x = this._cx; s.y = this._cy;
        this._photo = s;
        this._torsion = filtreTorsion();
        if (this._torsion) {
            this._torsion.uniforms.centre[0] = this._cx;
            this._torsion.uniforms.centre[1] = this._cy;
            s.filters = [this._torsion];
        }
        this.addChild(s);
    };
    Sprite_Transition.prototype.creerEclats = function (photo, w, h) {
        var COL = 12, LIG = 9, pw = Math.ceil(w / COL), ph = Math.ceil(h / LIG);
        var diag = Math.sqrt(w * w + h * h);
        this._eclats = [];
        for (var j = 0; j < LIG; j++) for (var i = 0; i < COL; i++) {
            var fx = i * pw, fy = j * ph, fw = Math.min(pw, w - fx), fh = Math.min(ph, h - fy);
            var s = morceau(photo, fx, fy, fw, fh);
            s.anchor.x = 0.5; s.anchor.y = 0.5;
            s.x = s._x0 = fx + fw / 2; s.y = s._y0 = fy + fh / 2;
            var dx = s.x - this._cx, dy = s.y - this._cy, d = Math.sqrt(dx * dx + dy * dy) || 1;
            var force = 2.5 + 5 * (1 - d / diag) + Math.random() * 2;
            s._vx = dx / d * force + (Math.random() - 0.5) * 1.5;
            s._vy = dy / d * force - 2.5 - Math.random() * 2;
            s._vr = (Math.random() - 0.5) * 0.22;
            s._delai = Math.floor(d / diag * 10);   // ça part du point d'impact
            this._eclats.push(s);
            this.addChild(s);
        }
    };
    // n : l'image de la transition (2 → durée), comme dans MV
    Sprite_Transition.prototype.avancer = function (n, duree) {
        var k = Math.max(0, Math.min(1, (n - 2) / (duree * 0.85)));
        this._k = k;
        // l'éclair de l'impact, puis (tourbillon) un second plus faible, comme MV
        var e = n < 12 ? 230 * (1 - (n - 2) / 10) : 0;
        var n0 = Math.max(12, Math.floor(duree / 6) + 2);
        if (this._genre !== 'eclats' && n >= n0 && n < n0 + 8) e = Math.max(e, 110 * (1 - (n - n0) / 8));
        this._eclair.opacity = e;
        if (this._genre === 'eclats') {
            var t = n - 8;
            this._eclats.forEach(function (s) {
                if (t <= 0) { s.x = s._x0 + (Math.random() - 0.5) * 2; s.y = s._y0 + (Math.random() - 0.5) * 2; return; }
                var u = t - s._delai;
                if (u <= 0) { s.x = s._x0; s.y = s._y0; return; }
                s.x = s._x0 + s._vx * u;
                s.y = s._y0 + s._vy * u + 0.32 * u * u;
                s.rotation = s._vr * u;
                s.scale.x = s.scale.y = Math.max(0.3, 1 - u * 0.012);
            });
            this._ombre.opacity = 0;
        } else {
            var p = this._photo;
            if (this._torsion) {
                var diag = Math.sqrt(Graphics.width * Graphics.width + Graphics.height * Graphics.height);
                this._torsion.uniforms.angle = Math.pow(k, 1.5) * 9;
                this._torsion.uniforms.rayon = (0.2 + 1.1 * k) * diag;
                p.scale.x = p.scale.y = 1 + 0.6 * k * k;
            } else {
                p.rotation = Math.pow(k, 1.5) * 1.4;
                p.scale.x = p.scale.y = 1 + 1.4 * k * k;
            }
            this._ombre.opacity = 150 * k * k;
        }
    };
    CombatPlus.Sprite_Transition = Sprite_Transition;

    var _startEncounterEffect = Scene_Map.prototype.startEncounterEffect;
    Scene_Map.prototype.startEncounterEffect = function () {
        this._cpStyle = CombatPlus.styleDuProchainCombat();
        $gameSystem._cpTransitionSuivante = null;     // une seule fois
        _startEncounterEffect.call(this);
    };
    var _updateEncounterEffect = Scene_Map.prototype.updateEncounterEffect;
    Scene_Map.prototype.updateEncounterEffect = function () {
        if (!this._cpStyle || this._cpStyle === 'mv') return _updateEncounterEffect.call(this);
        if (this._encounterEffectDuration > 0) {
            this._encounterEffectDuration--;
            var duree = this.encounterEffectSpeed();
            var n = duree - this._encounterEffectDuration;
            if (n === 2) {
                // une photo nette pour l'effet, puis celle de MV (floutée) pour le fond du combat
                var photo = photographierAvecMV(this);
                var cx = $gamePlayer.screenX(), cy = $gamePlayer.screenY() - 24;
                this._cpTransition = new Sprite_Transition(this._cpStyle, photo, cx, cy);
                this.addChildAt(this._cpTransition, this.children.indexOf(this._windowLayer));
            }
            if (this._cpTransition) this._cpTransition.avancer(n, duree);
            if (n === Math.floor(duree / 2)) {
                BattleManager.playBattleBgm();
                this.startFadeOut(this.fadeSpeed());
            }
        }
    };
    var _terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function () {
        _terminate.call(this);
        var tr = this._cpTransition;
        if (tr) {
            if (tr._photo) tr._photo.filters = null;
            this.removeChild(tr);
            if (tr._texture) tr._texture.destroy(true);   // la copie nette : le fond flouté de MV n'est pas touché
            this._cpTransition = null;
        }
    };

    //=========================================================================
    // La musique d'un combat scénarisé
    //=========================================================================
    var _pbb = BattleManager.playBattleBgm;
    BattleManager.playBattleBgm = function () {
        var s = $gameSystem, m = s && (s._cpMusiqueSuivante || s._cpMusique);
        if (!m) return _pbb.call(this);
        if (m === 'garder') {
            // MV coupe la musique de la carte au lancement du combat
            // (stopAudioOnBattleStart) après l'avoir notée, position comprise :
            // on la relance d'où elle en était. Après le combat, MV voit qu'elle
            // joue déjà et la laisse continuer.
            var b = this._mapBgm;
            if (b && b.name) AudioManager.playBgm(b, b.pos);
        } else {
            AudioManager.playBgm({ name: m, volume: 90, pitch: 100, pan: 0 });
            AudioManager.stopBgs();
        }
    };
    // une seule fois : effacée à la fin du combat (victoire, fuite, défaite, abandon)
    var _endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function (resultat) {
        _endBattle.call(this, resultat);
        if ($gameSystem) $gameSystem._cpMusiqueSuivante = null;
    };

    //=========================================================================
    // Un fond de combat selon la région
    //=========================================================================
    CombatPlus.fondsDeRegion = function () {
        if (!$dataMap || !$gamePlayer || BattleManager.isBattleTest()) return null;
        var r = $gamePlayer.regionId();
        if (!r) return null;
        var re = /<\s*Fond\s+r[ée]gion\s+([\d\s,]+?)\s*:\s*([^,>]*?)\s*(?:,\s*([^>]*?)\s*)?>/gi, m;
        while ((m = re.exec($dataMap.note || ''))) {
            if (m[1].split(/[\s,]+/).map(Number).indexOf(r) >= 0) return [m[2] || '', m[3] || ''];
        }
        return null;
    };
    var _bb1 = Spriteset_Battle.prototype.battleback1Name;
    Spriteset_Battle.prototype.battleback1Name = function () {
        var f = CombatPlus.fondsDeRegion();
        return f ? f[0] : _bb1.call(this);
    };
    var _bb2 = Spriteset_Battle.prototype.battleback2Name;
    Spriteset_Battle.prototype.battleback2Name = function () {
        var f = CombatPlus.fondsDeRegion();
        return f ? f[1] : _bb2.call(this);
    };

    //=========================================================================
    // L'option « Animations (combat) »
    //=========================================================================
    var NOMS_ANIM = ['Normal', 'Rapide', 'Éclair'];
    ConfigManager.animCombat = 0;
    var _mk = ConfigManager.makeData;
    ConfigManager.makeData = function () { var c = _mk.call(this); c.animCombat = this.animCombat; return c; };
    var _ap = ConfigManager.applyData;
    ConfigManager.applyData = function (c) {
        _ap.call(this, c);
        var v = Number(c.animCombat);
        this.animCombat = isNaN(v) ? 0 : Math.max(0, Math.min(2, v));
    };
    var _go = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function () { _go.call(this); this.addCommand('Animations (combat)', 'animCombat'); };
    var _st = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function (index) {
        if (this.commandSymbol(index) === 'animCombat') return NOMS_ANIM[this.getConfigValue('animCombat')] || NOMS_ANIM[0];
        return _st.call(this, index);
    };
    function bougerAnim(fen, sens, boucle) {
        var v = Number(fen.getConfigValue('animCombat')) + sens;
        v = boucle ? (v + 3) % 3 : Math.max(0, Math.min(2, v));
        fen.changeValue('animCombat', v);
    }
    var _ok = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function () {
        if (this.commandSymbol(this.index()) === 'animCombat') return bougerAnim(this, 1, true);
        _ok.call(this);
    };
    var _droite = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function (wrap) {
        if (this.commandSymbol(this.index()) === 'animCombat') return bougerAnim(this, 1, false);
        _droite.call(this, wrap);
    };
    var _gauche = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function (wrap) {
        if (this.commandSymbol(this.index()) === 'animCombat') return bougerAnim(this, -1, false);
        _gauche.call(this, wrap);
    };
    var _setupRate = Sprite_Animation.prototype.setupRate;
    Sprite_Animation.prototype.setupRate = function () {
        _setupRate.call(this);
        var v = ConfigManager.animCombat || 0;
        if (v > 0 && $gameParty.inBattle()) this._rate = v === 1 ? Math.max(1, this._rate - 1) : Math.max(1, Math.round(this._rate / 2));
    };

    //=========================================================================
    // L'image de l'arme pendant l'attaque (img/weapons, 3 cases de 96 × 64)
    //=========================================================================
    function imageDArme(acteur) {
        var w = acteur && acteur.weapons ? acteur.weapons()[0] : null;
        // YEP_ItemCore : l'arme possédée est un exemplaire « indépendant » dont la
        // note est VIDÉE — la balise est sur l'arme d'origine (baseItemId)
        var base = w && w.baseItemId && $dataWeapons[w.baseItemId];
        var re = /<\s*(?:Image d'arme|Weapon Image)\s*:\s*([^>]+?)\s*>/i;
        var m = w && (re.exec(w.note || '') || (base && re.exec(base.note || '')));
        return m ? m[1] : '';
    }
    CombatPlus.imageDArme = imageDArme;
    var _swa = Game_Actor.prototype.startWeaponAnimation;
    Game_Actor.prototype.startWeaponAnimation = function (id) {
        // une arme qui a son image s'affiche même si son type n'en prévoit pas
        _swa.call(this, id || (imageDArme(this) ? 1 : 0));
    };
    var _setupWA = Sprite_Actor.prototype.setupWeaponAnimation;
    Sprite_Actor.prototype.setupWeaponAnimation = function () {
        if (this._actor && this._actor.isWeaponAnimationRequested() && this._weaponSprite) this._weaponSprite._cpNom = imageDArme(this._actor);
        _setupWA.call(this);
    };
    var _wLoad = Sprite_Weapon.prototype.loadBitmap;
    Sprite_Weapon.prototype.loadBitmap = function () {
        if (this._cpNom && this._weaponImageId > 0) this.bitmap = ImageManager.loadBitmap('img/weapons/', this._cpNom);
        else _wLoad.call(this);
    };
    var _wFrame = Sprite_Weapon.prototype.updateFrame;
    Sprite_Weapon.prototype.updateFrame = function () {
        if (this._cpNom && this._weaponImageId > 0) this.setFrame(this._pattern * 96, 0, 96, 64);
        else _wFrame.call(this);
    };

    //=========================================================================
    // La commande
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pc.call(this, command, args);
        if (String(command || '').toUpperCase() === 'COMBAT' && /^musique$/i.test(args[0] || '')) {
            var nom = String(args[1] || '');
            if (!nom || /^d[ée]faut$/i.test(nom)) { $gameSystem._cpMusique = null; $gameSystem._cpMusiqueSuivante = null; return; }
            if (/^garder$/i.test(nom)) nom = 'garder';
            if (/^toujours$/i.test(args[2] || '')) $gameSystem._cpMusique = nom;
            else $gameSystem._cpMusiqueSuivante = nom;
            return;
        }
        if (String(command || '').toUpperCase() !== 'TRANSITION') return;
        var a = String(args[0] || '').toLowerCase().replace(/é/g, 'e');
        if (a === 'defaut') { $gameSystem._cpTransition = null; $gameSystem._cpTransitionSuivante = null; return; }
        var s = style(a, null);
        if (!s) return;
        if (/^toujours$/i.test(args[1] || '')) $gameSystem._cpTransition = s;
        else $gameSystem._cpTransitionSuivante = s;
    };
})();
