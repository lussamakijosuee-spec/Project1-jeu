//=============================================================================
// OutilsDeScene.js — v1.0  ·  Des scènes qui ne se figent pas
// RPG Maker MV   ·   pour JOKO
//   Inspiré, sans rien en copier, de ce que font Stop Map Movement et Move
//   Route Core (Yanfly) : figer le décor pendant une scène, et ne pas rester
//   coincé derrière un personnage.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Scènes : les PNJ s'arrêtent, un personnage bloqué
 * traverse au lieu de tout figer, caméra, bandes de cinéma, scène à passer.
 * @author JOKO
 *
 * @param interrupteur
 * @text Interrupteur « Mode cinématique »
 * @type switch
 * @default 912
 * @desc Tant qu'il est allumé, la scène est en cours. 912 = celui des recettes « Début / Fin de cinématique ».
 *
 * @param figer
 * @text Figer les PNJ pendant une scène
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Les événements qui bougent seuls s'arrêtent. Ceux que la scène déplace (« Définir un déplacement ») bougent normalement.
 *
 * @param gardeFou
 * @text Garde-fou des déplacements bloqués
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Pendant une scène, un personnage bloqué trop longtemps sur son trajet passe au travers au lieu de figer la scène.
 *
 * @param delai
 * @text Délai avant de traverser (images)
 * @type number
 * @min 30
 * @default 120
 * @desc 60 images = 1 seconde.
 *
 * @param barres
 * @text Hauteur des bandes de cinéma
 * @type number
 * @min 8
 * @default 64
 *
 * @param maintien
 * @text Maintenir Échap pour passer (images)
 * @type number
 * @min 15
 * @default 45
 * @desc Il faut MAINTENIR la touche : un simple appui (qui fait aussi défiler les messages) ne saute jamais une scène.
 *
 * @param textePasser
 * @text Texte « passer la scène »
 * @default Maintenir Échap : passer
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  DES SCÈNES QUI NE SE FIGENT PAS
 * ═══════════════════════════════════════════════════════════════════════════
 *  JOKO : « une scène qui fonctionne sans erreur, avec une animation qui
 *  fonctionne, c'est extrêmement long ». La panne la plus courante d'une
 *  scène ne lève aucune erreur : un PNJ qui se promène se met en travers
 *  d'un « Définir un déplacement » coché « Attendre la fin », et la scène
 *  attend pour toujours. Ce plugin s'en occupe.
 *
 *  ── LE MODE CINÉMATIQUE ───────────────────────────────────────────────
 *  Il est actif tant que l'interrupteur 912 « Mode cinématique » est allumé
 *  — c'est déjà ce que font les recettes « Début de cinématique » (événement
 *  commun 1354) et « Fin de cinématique » (1355). Ou avec les commandes :
 *
 *      SCENE debut          le mode cinématique commence
 *      SCENE fin            il s'arrête : bandes, caméra et « passer » aussi
 *
 *  Pendant une scène :
 *    · les PNJ qui bougent seuls (aléatoire, approche, personnalisé, les
 *      habitants) s'arrêtent sur place. Ceux que TA scène déplace bougent.
 *      Un événement qui doit continuer à vivre : <Scène: libre> dans sa note ;
 *    · un personnage (ou le joueur) bloqué plus de 2 secondes sur son trajet
 *      passe au travers de l'obstacle, puis redevient normal.
 *
 *  ── LA CAMÉRA ─────────────────────────────────────────────────────────
 *      SCENE camera 5            glisse vers l'événement 5 et le suit
 *      SCENE camera 5 90         … en 90 images (45 par défaut)
 *      SCENE camera 5 90 attendre    … et la scène attend l'arrivée
 *      SCENE camera ici          l'événement qui exécute la commande
 *      SCENE camera case 12 8    une case de la carte
 *      SCENE camera joueur       revient sur le joueur, puis le suit comme avant
 *
 *  ── LES BANDES DE CINÉMA ──────────────────────────────────────────────
 *      SCENE barres              deux bandes noires glissent (64 px)
 *      SCENE barres 90           … plus hautes
 *      SCENE barres off          elles repartent
 *
 *  ── PASSER LA SCÈNE ───────────────────────────────────────────────────
 *      SCENE passer FIN          dès maintenant, MAINTENIR Échap saute à
 *                                l'étiquette « FIN » de cet événement
 *      SCENE passer off          on ne peut plus passer
 *
 *  Pose l'étiquette (commande « Étiquette ») là où la scène doit reprendre,
 *  avec derrière ce qu'il faut pour que tout soit à sa place (« Définir la
 *  position d'un événement », interrupteurs…). Le message en cours se ferme,
 *  l'écran se rallume en fondu. Un simple appui ne passe jamais rien.
 *
 *  ── ATTENDRE TOUT LE MONDE ────────────────────────────────────────────
 *      SCENE attendre            attend que plus personne n'ait de
 *                                déplacement en cours (pratique après
 *                                plusieurs « Définir un déplacement » sans
 *                                « Attendre la fin »)
 *
 *  ── UNE ICÔNE AU-DESSUS DE QUELQU'UN ──────────────────────────────────
 *      SCENE icone 5 87          l'icône 87 (IconSet) au-dessus de l'événement 5
 *      SCENE icone joueur 87 120     … du joueur, pendant 120 images (90 par défaut)
 *      SCENE icone ici 87 attendre   … de l'événement lui-même, et la scène attend
 *      SCENE icone 5 off         l'enlève tout de suite
 *  Comme les bulles « ! » de MV, mais avec n'importe quelle icône : une
 *  épée qui pense au combat, une pièce d'or, un cœur, une note de musique.
 *
 *  ── EN TEST (lancé depuis l'éditeur) ──────────────────────────────────
 *  Quand un déplacement est bloqué depuis 2 secondes, un bandeau le dit en
 *  haut de l'écran : quel événement, sur quelle case, et ce qui se passe.
 *  Les joueurs ne le voient jamais.
 */
var OutilsDeScene = window.OutilsDeScene || {};
window.OutilsDeScene = OutilsDeScene;
(function () {
    'use strict';
    var P = PluginManager.parameters('OutilsDeScene');
    var INTER = Number(P.interrupteur || 912);
    var FIGER = String(P.figer || 'true') === 'true';
    var GARDE = String(P.gardeFou || 'true') === 'true';
    var DELAI = Math.max(30, Number(P.delai || 120));
    var HAUT = Math.max(8, Number(P.barres || 64));
    var MAINTIEN = Math.max(15, Number(P.maintien || 45));
    var TEXTE_PASSER = String(P.textePasser || 'Maintenir Échap : passer');

    function etat() {
        if (!$gameSystem) return {};
        if (!$gameSystem._ods) $gameSystem._ods = { actif: false, barres: 0, cam: null };
        return $gameSystem._ods;
    }
    function enTest() { return Utils.isOptionValid('test') || ($gameTemp && $gameTemp.isPlaytest && $gameTemp.isPlaytest()); }

    OutilsDeScene.actif = function () {
        if (!$gameSwitches || !$gameSystem) return false;
        return (INTER > 0 && $gameSwitches.value(INTER)) || !!etat().actif;
    };

    //=========================================================================
    // Le bandeau des signalements (en test seulement)
    //=========================================================================
    var signalements = [];
    OutilsDeScene.signaler = function (texte) {
        if (typeof console !== 'undefined') console.warn('[OutilsDeScene] ' + texte);
        signalements.push(texte);
        if (signalements.length > 50) signalements.shift();
        if (enTest()) OutilsDeScene._aAfficher = { texte: texte, t: 300 };
    };
    OutilsDeScene.signalements = function () { return signalements.slice(); };

    function nomDe(c) {
        if (c === $gamePlayer) return 'le joueur';
        if (c instanceof Game_Event) return '« ' + c.event().name + ' » (év. ' + c.eventId() + ')';
        if (c instanceof Game_Follower) return 'un suiveur';
        return 'un personnage';
    }

    //=========================================================================
    // 1. Les PNJ s'arrêtent pendant une scène
    //=========================================================================
    function libre(ev) {
        if (ev._odsLibre === undefined) ev._odsLibre = /<Sc[eè]ne\s*:\s*libre>/i.test((ev.event() && ev.event().note) || '');
        return ev._odsLibre;
    }
    OutilsDeScene.figeAussi = function (ev) { return FIGER && OutilsDeScene.actif() && !libre(ev); };
    var _usm = Game_Event.prototype.updateSelfMovement;
    Game_Event.prototype.updateSelfMovement = function () {
        if (OutilsDeScene.figeAussi(this)) return;
        _usm.call(this);
    };

    //=========================================================================
    // 2. Le garde-fou : bloqué trop longtemps, on traverse
    //=========================================================================
    // MV retente un pas bloqué à chaque image, sans fin, tant que le
    // déplacement n'est pas coché « Passer si impossible ». C'est là qu'on
    // compte. Pendant une scène, au bout du délai, le personnage traverse
    // l'obstacle le temps d'un pas ; hors scène on ne change rien, on le dit
    // seulement (en test).
    var _amri = Game_Character.prototype.advanceMoveRouteIndex;
    Game_Character.prototype.advanceMoveRouteIndex = function () {
        var r = this._moveRoute;
        if (r && this._moveRouteForcing && !this.isMovementSucceeded() && !r.skippable) {
            this._odsBloque = (this._odsBloque || 0) + 1;
            var scene = GARDE && OutilsDeScene.actif();
            if (this._odsBloque === DELAI) {
                OutilsDeScene.signaler(nomDe(this) + ' est bloqué en ' + this.x + ',' + this.y + ' depuis ' +
                    Math.round(DELAI / 60) + ' s — ' + (scene ? 'il passe au travers' :
                    'la scène attend toujours (hors mode cinématique, le garde-fou ne s\'applique pas)'));
            }
            if (scene && this._odsBloque >= DELAI && !this._odsTraverse) {
                this._odsTraverse = true;
                this._odsAvant = this._through;
                this.setThrough(true);
            }
        } else {
            this._odsBloque = 0;
            if (this._odsTraverse && this.isMovementSucceeded()) {
                this._odsTraverse = false;
                this.setThrough(!!this._odsAvant);
            }
        }
        _amri.call(this);
    };
    // fin du trajet forcé : rien ne doit rester traversant
    var _pmr = Game_Character.prototype.processRouteEnd;
    Game_Character.prototype.processRouteEnd = function () {
        if (this._odsTraverse) { this._odsTraverse = false; this.setThrough(!!this._odsAvant); }
        this._odsBloque = 0;
        _pmr.call(this);
    };

    //=========================================================================
    // 3. La caméra
    //=========================================================================
    function cible(c) {
        if (c.mode === 'joueur') return { x: $gamePlayer._realX, y: $gamePlayer._realY };
        if (c.mode === 'case') return { x: c.x, y: c.y };
        var ev = $gameMap.event(c.id);
        return ev ? { x: ev._realX, y: ev._realY } : { x: $gamePlayer._realX, y: $gamePlayer._realY };
    }
    function adoucir(k) { return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; }
    OutilsDeScene.camera = function (mode, id, x, y, duree) {
        var e = etat();
        e.cam = { mode: mode, id: id || 0, x: x || 0, y: y || 0, duree: Math.max(1, duree || 45), t: 0,
            sx: $gameMap.displayX(), sy: $gameMap.displayY() };
    };
    OutilsDeScene.cameraEnCours = function () { var c = etat().cam; return !!(c && c.t < c.duree); };
    function majCamera() {
        var c = etat().cam;
        if (!c) return;
        var p = cible(c);
        var tx = p.x - $gamePlayer.centerX(), ty = p.y - $gamePlayer.centerY();
        var dx = tx, dy = ty;
        if (c.t < c.duree) {
            c.t++;
            var k = adoucir(c.t / c.duree);
            dx = c.sx + (tx - c.sx) * k;
            dy = c.sy + (ty - c.sy) * k;
        }
        $gameMap.setDisplayPos(dx, dy);
        if (c.mode === 'joueur' && c.t >= c.duree) etat().cam = null;   // le joueur reprend la main
    }
    var _gpScroll = Game_Player.prototype.updateScroll;
    Game_Player.prototype.updateScroll = function (x1, y1) {
        if ($gameSystem && $gameSystem._ods && $gameSystem._ods.cam) return;
        _gpScroll.call(this, x1, y1);
    };
    var _gmUpd = Game_Map.prototype.update;
    Game_Map.prototype.update = function (sceneActive) {
        _gmUpd.call(this, sceneActive);
        majCamera();
    };
    // une nouvelle carte : la caméra revient au joueur, sans glisser
    var _perf = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function () {
        if (this.isTransferring() && $gameSystem && $gameSystem._ods) $gameSystem._ods.cam = null;
        _perf.call(this);
    };

    //=========================================================================
    // 4. Les bandes de cinéma
    //=========================================================================
    function Sprite_BandesScene() { this.initialize.apply(this, arguments); }
    Sprite_BandesScene.prototype = Object.create(Sprite.prototype);
    Sprite_BandesScene.prototype.constructor = Sprite_BandesScene;
    Sprite_BandesScene.prototype.initialize = function () {
        Sprite.prototype.initialize.call(this);
        var noir = new Bitmap(8, 8); noir.fillAll('#000000');
        this._haut = new Sprite(noir); this._bas = new Sprite(noir);
        this._haut.scale.x = this._bas.scale.x = Graphics.width / 8;
        this.addChild(this._haut); this.addChild(this._bas);
        this._h = etat().barres || 0;
        this.placer();
    };
    Sprite_BandesScene.prototype.placer = function () {
        var h = Math.round(this._h);
        this.visible = h > 0;
        this._haut.scale.y = this._bas.scale.y = h / 8;
        this._bas.y = Graphics.height - h;
    };
    Sprite_BandesScene.prototype.update = function () {
        Sprite.prototype.update.call(this);
        var but = etat().barres || 0;
        if (Math.abs(but - this._h) < 0.5) this._h = but;
        else this._h += (but - this._h) * 0.12;
        this.placer();
    };

    //=========================================================================
    // 5. Passer la scène — en MAINTENANT Échap
    //=========================================================================
    // Échap fait aussi défiler les messages dans MV : un appui ne doit donc
    // jamais sauter une scène. Il faut tenir la touche (45 images).
    OutilsDeScene._maintenu = 0;
    function passerPossible() {
        return !$gameMessage.isChoice() && !$gameMessage.isNumberInput() && !$gameMessage.isItemChoice();
    }
    Game_Interpreter.prototype.odsSauter = function () {
        var label = this._odsPasser;
        this._odsPasser = null;
        for (var i = 0; i < this._list.length; i++) {
            var c = this._list[i];
            if (c.code === 118 && c.parameters[0] === label) {
                this._childInterpreter = null;
                this._waitCount = 0; this._waitMode = '';
                this._index = i;
                var w = SceneManager._scene && SceneManager._scene._messageWindow;
                if (w) { w._textState = null; w.pause = false; w.terminateMessage(); }
                $gameMessage.clear();
                $gameScreen._brightness = 0;
                $gameScreen.startFadeIn(30);
                return true;
            }
        }
        OutilsDeScene.signaler('SCENE passer : aucune étiquette « ' + label + ' » dans cet événement');
        return false;
    };
    var _giUpdate = Game_Interpreter.prototype.update;
    Game_Interpreter.prototype.update = function () {
        if (this._odsPasser && this.isRunning()) {
            if (Input.isPressed('cancel') && passerPossible()) {
                OutilsDeScene._maintenu++;
                if (OutilsDeScene._maintenu >= MAINTIEN) { OutilsDeScene._maintenu = 0; this.odsSauter(); }
            } else {
                OutilsDeScene._maintenu = 0;
            }
        }
        _giUpdate.call(this);
    };
    OutilsDeScene.passerArme = function () {
        function arme(it) { return it && (it._odsPasser ? true : arme(it._childInterpreter)); }
        return !!($gameMap && arme($gameMap._interpreter));
    };

    function Sprite_IndicePasser() { this.initialize.apply(this, arguments); }
    Sprite_IndicePasser.prototype = Object.create(Sprite.prototype);
    Sprite_IndicePasser.prototype.constructor = Sprite_IndicePasser;
    Sprite_IndicePasser.prototype.initialize = function () {
        Sprite.prototype.initialize.call(this, new Bitmap(260, 34));
        this.x = Graphics.width - 270; this.y = Graphics.height - 44;
        this.opacity = 0; this._vu = -1;
    };
    Sprite_IndicePasser.prototype.update = function () {
        Sprite.prototype.update.call(this);
        var arme = OutilsDeScene.passerArme() && !$gameMessage.isBusy();
        this.opacity += arme ? 12 : -24;
        var k = Math.min(1, OutilsDeScene._maintenu / MAINTIEN);
        if (this.opacity > 0 && this._vu !== k) {
            this._vu = k;
            var b = this.bitmap; b.clear();
            b.fillRect(0, 0, 260, 34, 'rgba(0,0,0,0.55)');
            b.fillRect(0, 30, Math.round(260 * k), 4, '#ffffff');
            b.fontSize = 18; b.textColor = '#ffffff';
            b.drawText(TEXTE_PASSER, 0, 2, 260, 28, 'center');
        }
    };

    //=========================================================================
    // 6. Le bandeau des signalements (en test)
    //=========================================================================
    function Sprite_SignalScene() { this.initialize.apply(this, arguments); }
    Sprite_SignalScene.prototype = Object.create(Sprite.prototype);
    Sprite_SignalScene.prototype.constructor = Sprite_SignalScene;
    Sprite_SignalScene.prototype.initialize = function () {
        Sprite.prototype.initialize.call(this, new Bitmap(Graphics.width, 30));
        this.visible = false;
    };
    Sprite_SignalScene.prototype.update = function () {
        Sprite.prototype.update.call(this);
        var a = OutilsDeScene._aAfficher;
        if (!a) { this.visible = false; return; }
        if (a !== this._montre) {
            this._montre = a;
            var b = this.bitmap; b.clear();
            b.fillRect(0, 0, Graphics.width, 30, 'rgba(120,0,0,0.78)');
            b.fontSize = 17; b.textColor = '#ffffff';
            b.drawText('⚠ ' + a.texte, 8, 1, Graphics.width - 16, 28, 'left');
        }
        this.visible = true;
        if (--a.t <= 0) OutilsDeScene._aAfficher = null;
    };

    var _cdo = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function () {
        _cdo.call(this);
        var ou = this.children.indexOf(this._windowLayer);
        this._odsBandes = new Sprite_BandesScene();
        this.addChildAt(this._odsBandes, ou < 0 ? this.children.length : ou);
        this._odsIndice = new Sprite_IndicePasser();
        this.addChild(this._odsIndice);
        if (enTest()) { this._odsSignal = new Sprite_SignalScene(); this.addChild(this._odsSignal); }
    };

    //=========================================================================
    // 6 bis. L'icône au-dessus de quelqu'un (comme une bulle, en icône)
    //=========================================================================
    function personnage(it, qui) {
        var q = String(qui || '').toLowerCase();
        if (q === 'joueur' || q === '-1') return $gamePlayer;
        if (q === 'ici' || q === '0' || q === '') return $gameMap.event(it._eventId);
        return $gameMap.event(Number(q)) || null;
    }
    OutilsDeScene.icone = function (car, icone, duree) {
        if (!car) return;
        car._odsIcone = icone > 0 ? { icone: icone, duree: Math.max(10, duree || 90), t: 0 } : null;
    };
    OutilsDeScene.iconeEnCours = function () {
        if ($gamePlayer._odsIcone) return true;
        return $gameMap.events().some(function (e) { return !!e._odsIcone; });
    };
    var _gcbUpdate = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function () {
        _gcbUpdate.call(this);
        var ic = this._odsIcone;
        if (ic && ++ic.t >= ic.duree) this._odsIcone = null;
    };
    function Sprite_IconeScene() { this.initialize.apply(this, arguments); }
    Sprite_IconeScene.prototype = Object.create(Sprite.prototype);
    Sprite_IconeScene.prototype.constructor = Sprite_IconeScene;
    Sprite_IconeScene.prototype.initialize = function () {
        Sprite.prototype.initialize.call(this);
        this.z = 7;
        this._icone = -1;
        // la bulle vide du pack de Yanfly (img/system/EmptyBalloon.png, 8 cases
        // de 48 × 48) : elle s'ouvre derrière l'icône, comme une bulle « ! »
        this._bulle = new Sprite(ImageManager.loadSystem('EmptyBalloon'));
        this._bulle.anchor.x = 0.5; this._bulle.anchor.y = 1;
        this._bulle.y = 8;
        this.addChildAt(this._bulle, 0);
        this._iconeSp = new Sprite(ImageManager.loadSystem('IconSet'));   // devant la bulle
        this._iconeSp.anchor.x = 0.5; this._iconeSp.anchor.y = 1;
        this.addChild(this._iconeSp);
    };
    Sprite_IconeScene.prototype.montrer = function (ic) {
        var pw = Window_Base._iconWidth, ph = Window_Base._iconHeight;
        if (ic.icone !== this._icone) { this._icone = ic.icone; this._iconeSp.setFrame(ic.icone % 16 * pw, Math.floor(ic.icone / 16) * ph, pw, ph); }
        var b = this._bulle.bitmap;
        if (b && b.isReady() && b.width >= 384) this._bulle.setFrame(Math.min(7, Math.floor(ic.t / 2)) * 48, 0, 48, 48);
        else this._bulle.visible = false;
        // elle surgit (petit rebond), flotte, puis s'efface sur la fin
        var k = Math.min(1, ic.t / 8), reste = ic.duree - ic.t;
        var echelle = k < 1 ? 0.4 + 0.8 * k : 1 + 0.08 * Math.max(0, 1 - (ic.t - 8) / 8);
        this.scale.x = this.scale.y = echelle;
        this.opacity = reste < 12 ? 255 * reste / 12 : 255;
        return Math.sin(ic.t / 10) * 2;
    };
    var _scUpdate = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function () {
        _scUpdate.call(this);
        var ic = this._character && this._character._odsIcone;
        if (ic && this.parent) {
            if (!this._odsIcone) { this._odsIcone = new Sprite_IconeScene(); this.parent.addChild(this._odsIcone); }
            var flotte = this._odsIcone.montrer(ic);
            this._odsIcone.x = this.x;
            this._odsIcone.y = this.y - this.patternHeight() - 4 + flotte;
        } else if (this._odsIcone) {
            if (this._odsIcone.parent) this._odsIcone.parent.removeChild(this._odsIcone);
            this._odsIcone = null;
        }
    };

    //=========================================================================
    // 7. Attendre tout le monde
    //=========================================================================
    OutilsDeScene.quelquUnBouge = function () {
        if ($gamePlayer.isMoveRouteForcing()) return true;
        return $gameMap.events().some(function (e) { return e.isMoveRouteForcing(); });
    };
    var _uwm = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode === 'odsCamera') { if (OutilsDeScene.cameraEnCours()) return true; this._waitMode = ''; return false; }
        if (this._waitMode === 'odsTous') { if (OutilsDeScene.quelquUnBouge()) return true; this._waitMode = ''; return false; }
        if (this._waitMode === 'odsIcone') { if (OutilsDeScene.iconeEnCours()) return true; this._waitMode = ''; return false; }
        return _uwm.call(this);
    };

    //=========================================================================
    // Les commandes
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pc.call(this, command, args);
        var nom = String(command || '').toUpperCase();
        if (nom !== 'SCENE' && nom !== 'SCÈNE') return;
        var sous = String(args[0] || '').toLowerCase().replace('é', 'e').replace('è', 'e');
        var e = etat();
        switch (sous) {
            case 'debut':
                e.actif = true;
                if (INTER > 0) $gameSwitches.setValue(INTER, true);
                break;
            case 'fin':
                e.actif = false;
                if (INTER > 0) $gameSwitches.setValue(INTER, false);
                e.barres = 0;
                if (e.cam) OutilsDeScene.camera('joueur', 0, 0, 0, 30);
                this._odsPasser = null;
                if ($gameMap._interpreter) $gameMap._interpreter._odsPasser = null;
                break;
            case 'barres':
                var a1 = String(args[1] || '').toLowerCase();
                e.barres = (a1 === 'off' || a1 === 'non' || a1 === '0') ? 0 : (Number(a1) || HAUT);
                break;
            case 'camera': case 'caméra':
                var c = String(args[1] || '').toLowerCase(), i = 2, mode = 'ev', id = 0, x = 0, y = 0;
                if (c === 'joueur') mode = 'joueur';
                else if (c === 'ici') id = this._eventId;
                else if (c === 'case') { mode = 'case'; x = Number(args[2]) || 0; y = Number(args[3]) || 0; i = 4; }
                else id = Number(c) || this._eventId;
                var duree = Number(args[i]) || 45;
                OutilsDeScene.camera(mode, id, x, y, duree);
                if (args.some(function (a) { return /^attend/i.test(a); })) this.setWaitMode('odsCamera');
                break;
            case 'passer':
                var l = String(args.slice(1).join(' ') || '');
                this._odsPasser = (!l || /^(off|non)$/i.test(l)) ? null : l;
                break;
            case 'attendre':
                this.setWaitMode('odsTous');
                break;
            case 'icone': case 'icône':
                var car = personnage(this, args[1]);
                var n = /^off$/i.test(args[2] || '') ? 0 : Number(args[2]) || 0;
                var d = Number(args[3]) || 90;
                if (!car) { OutilsDeScene.signaler('SCENE icone : aucun personnage « ' + args[1] + ' » sur cette carte'); break; }
                OutilsDeScene.icone(car, n, d);
                if (n > 0 && args.some(function (a) { return /^attend/i.test(a); })) this.setWaitMode('odsIcone');
                break;
        }
    };
})();
