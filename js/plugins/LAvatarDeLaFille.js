//=============================================================================
// LAvatarDeLaFille.js — Ardélia, la Souveraine Écarlate, et l'avatar de la Fille
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le boss de fin : Ardélia tombe, parle, revient en avatar de la Fille, et brise les concepts — l'écran, les domaines, le jeu lui-même.
 * @author JOKO (Claude)
 *
 * @param domaines
 * @text Les domaines qu'elle tranche (états)
 * @desc Monde Gelé 13 · Domaine Déployé 16 · Royaume Impérial 39, 198, 231. Séparés par des virgules.
 * @default 13, 16, 39, 198, 231
 *
 * @param fondForet
 * @text La Forêt Perdue, derrière l'écran
 * @desc Les deux fonds de combat qui apparaissent derrière l'écran brisé (battlebacks1, battlebacks2). Ceux de la carte 73 « Forêt Perdue ».
 * @default Meadow, Forest
 *
 * @param erreurNom
 * @text Le faux plantage : le titre
 * @desc En jaune, comme un vrai plantage de RPG Maker.
 * @default TypeError
 *
 * @param erreurMessage
 * @text Le faux plantage : le message
 * @desc En blanc, sous le titre.
 * @default Cannot read property 'concept' of undefined
 *
 * @param secondesPlantage
 * @text Le faux plantage : combien de secondes
 * @desc Le temps où le jeu a l'air planté, avant qu'elle brise l'écran.
 * @default 3
 *
 * @param fenetreBouge
 * @text La fenêtre du jeu bouge
 * @desc « La Main sur le Jeu » secoue aussi la vraie fenêtre du jeu (sur PC, hors plein écran). false : seulement l'image.
 * @type boolean
 * @default true
 *
 * @param couleurAigle
 * @text La couleur de l'aigle de feu
 * @default #ff6a1a
 *
 * @help
 * ============================================================================
 *  L'AVATAR DE LA FILLE — le boss de fin
 * ============================================================================
 *  JOKO, 2026-11-06 : « une phase une avec la reine écarlate du lore avec ses
 *  compétences et son combat et quand elle tombe a zéro elle parle un discours
 *  profond et philosophique sur eux puis une animation très stylé et le combat
 *  de l'avatar, elle représente la détermination mais surtout le dépassement
 *  des concepts, ex: le chant, brisé les domaines comme royaume impérial ou
 *  monde gelé elle brisé l'écran et affiche un fond en arrière de forêt perdu
 *  l'image ou même brisé des concepts du jeu ou de l'écran elle manipule
 *  presque le jeu fait bouger ou faussement crach ton jeu puis brisé l'écran
 *  même coup l'écran en deux dans son attaques de tranchant concepts pour
 *  brisé les domaines », puis « Elle parle légèrement puis meurt et oui fait
 *  tout ai max c'est la boss de fin ».
 *
 *  La Bible : Ardélia, « la Souveraine Écarlate » — « comme tous les Revenus,
 *  elle revient quand elle meurt, tant que sa volonté tient ». L'Âme, la Fille
 *  de la Rébellion : « un brasier gigantesque en forme d'aigle », « Elle veut la
 *  liberté totale, la rébellion contre l'ordre. » Le Gardien du Chapitre 1 :
 *  « un aigle de feu […] peut-être n'est-ce que la Fille elle-même ».
 *
 * ── LES COMMANDES (dans les pages de la troupe) ──────────────────────────────
 *   AVATAR chute       elle tombe : tout s'assombrit, des braises montent,
 *                      l'aigle de feu se forme au-dessus d'elle et plonge en
 *                      elle, éclair blanc ; l'image reste figée à l'écran
 *   AVATAR revele      l'image figée se fissure et vole en éclats : derrière,
 *                      l'avatar (poser « Transformer l'ennemi » entre les deux)
 *   AVATAR fin         sa vraie fin : elle brûle en braises, puis on la fait
 *                      tomber (elle s'effondre comme un boss)
 *   AVATAR foret       la Forêt Perdue devient le fond, tout de suite
 *   Un numéro à la fin vise un autre ennemi de la troupe : AVATAR chute 2
 *   La page attend la fin de l'effet.
 *
 * ── LES BALISES (sur les compétences de l'ennemi) ────────────────────────────
 *   <TrancheConcept>   une ligne de lumière coupe l'écran en deux, les deux
 *                      moitiés s'écartent : derrière, la Forêt Perdue. Les
 *                      domaines ouverts (réglage « domaines ») sont tranchés.
 *   <BriseEcran>       l'écran se fissure depuis elle et vole en éclats :
 *                      derrière, la Forêt Perdue
 *   <FauxPlantage>     le jeu se fige, la musique se coupe, l'écran d'erreur de
 *                      RPG Maker apparaît (flou, texte jaune et blanc, comme un
 *                      vrai) ; puis elle le brise. Rien ne plante pour de vrai,
 *                      aucune sauvegarde n'est touchée.
 *   <MainSurLeJeu>     l'image du jeu penche, tangue, se décale, et la fenêtre
 *                      du jeu tremble (réglage « fenetreBouge »)
 *   Pendant l'effet, l'action attend ; les dégâts tombent après.
 *
 * ── LA BALISE DE L'ENNEMI ────────────────────────────────────────────────────
 *   <BriseDomaines: 1328>  un domaine s'ouvre (Royaume Impérial, Monde Gelé posé
 *                      sur elle, qui l'immobiliserait…) : à la fin de l'action
 *                      qui l'a ouvert, elle le tranche avec cette compétence,
 *                      sans perdre son tour.
 *
 * ── POUR SON IA (YEP, <AI Priority>) ─────────────────────────────────────────
 *   EVAL LAvatar.domaineOuvert(): Skill n, Random     un domaine est ouvert
 *   EVAL LAvatar.unique(user, n): …                   pas encore lancée ce combat
 *   EVAL LAvatar.depuis(user) % 4 === 1: …            tours depuis qu'elle est l'avatar
 *
 *  Pour un banc sans affichage : LAvatar._sansEffets = true (les effets se
 *  terminent tout de suite ; ce qu'ils font — domaines, fond — se fait quand même).
 * ============================================================================
 */

var LAvatar = window.LAvatar = window.LAvatar || {};

(function () {
    'use strict';
    var P = PluginManager.parameters('LAvatarDeLaFille');
    function nombres(s) { return String(s || '').split(',').map(function (x) { return Number(x.trim()); }).filter(function (x) { return x > 0; }); }
    var DOMAINES = nombres(P.domaines || '13, 16, 39, 198, 231');
    var FORET = String(P.fondForet || 'Meadow, Forest').split(',').map(function (x) { return x.trim(); });
    var ERREUR_NOM = String(P.erreurNom || 'TypeError');
    var ERREUR_MSG = String(P.erreurMessage || "Cannot read property 'concept' of undefined");
    var SEC_PLANTAGE = Math.max(1, Number(P.secondesPlantage || 3));
    var FENETRE = String(P.fenetreBouge || 'true') === 'true';
    var COULEUR = String(P.couleurAigle || '#ff6a1a');

    LAvatar._effets = [];
    LAvatar._sansEffets = false;
    LAvatar.domaines = DOMAINES;

    function se(nom, vol, pitch) { if (nom) AudioManager.playSe({ name: nom, volume: vol || 90, pitch: pitch || 100, pan: 0 }); }
    function scene() { var s = SceneManager._scene; return s instanceof Scene_Battle ? s : null; }
    function spriteset() { var s = scene(); return s && s._spriteset; }
    function W() { return Graphics.boxWidth; }
    function H() { return Graphics.boxHeight; }
    function annoncer(b, t, c) { if (window.CombatTactique && CombatTactique.annoncer) CombatTactique.annoncer(b, t, c); }

    // ── où elle est, à l'écran ───────────────────────────────────────────────
    function spriteDe(b) {
        var sp = spriteset();
        if (!sp || !b) return null;
        return (sp._enemySprites || []).concat(sp._actorSprites || []).filter(function (s) { return s._battler === b; })[0] || null;
    }
    LAvatar.ou = function (b) {
        var s = spriteDe(b);
        if (s && s.parent) {
            var h = s.bitmap && s.bitmap.height ? s.bitmap.height : 120;
            if (s._effectTarget && s._effectTarget.bitmap) h = s._effectTarget.bitmap.height || h;
            var p = s.toGlobal(new PIXI.Point(0, -h / 2));
            if (isFinite(p.x) && isFinite(p.y)) return { x: Math.max(40, Math.min(W() - 40, p.x)), y: Math.max(40, Math.min(H() - 40, p.y)) };
        }
        return { x: W() * 0.3, y: H() * 0.45 };
    };

    // ── les domaines ─────────────────────────────────────────────────────────
    function tousLesCombattants() { return $gameParty.battleMembers().concat($gameTroop.members()); }
    LAvatar.domaineOuvert = function () {
        if (window.Royaume && Royaume.actif && Royaume.actif()) return true;
        return tousLesCombattants().some(function (b) {
            return b.isAlive() && DOMAINES.some(function (id) { return b.isStateAffected(id); });
        });
    };
    LAvatar.trancherDomaines = function () {
        var n = 0;
        if (window.Royaume && Royaume.actif && Royaume.actif()) { var porteur = Royaume.porteur(); Royaume.fermer(false); n++; if (porteur) annoncer(porteur, '✂ Royaume Impérial · tranché', '#ff5a5a'); }
        tousLesCombattants().forEach(function (b) {
            DOMAINES.forEach(function (id) {
                if (!b.isStateAffected(id)) return;
                b.removeState(id);
                n++;
                annoncer(b, '✂ ' + String($dataStates[id].name).replace(/^[^\wÀ-ÿ]+/, '').trim() + ' · tranché', '#ff5a5a');
            });
        });
        if (n && BattleManager._logWindow) BattleManager._logWindow.push('addText', '\\C[18]✂ Le domaine est tranché.\\C[0]');
        if (n) $gameParty.battleMembers().forEach(function (a) { a.refresh(); });
        return n;
    };

    // ── la Forêt Perdue, derrière l'écran ────────────────────────────────────
    LAvatar.fondForet = function () {
        if (!$gameTroop) return;
        $gameTroop._avatarFond = FORET.slice();
        var sp = spriteset();
        if (!sp || !sp._back1Sprite) return;
        var b1 = ImageManager.loadBattleback1(FORET[0] || ''), b2 = ImageManager.loadBattleback2(FORET[1] || '');
        sp._back1Sprite.bitmap = b1; sp._back2Sprite.bitmap = b2;
        var placer = function () { if (b1.isReady() && b2.isReady()) sp._battlebackLocated = false; };
        b1.addLoadListener(placer); b2.addLoadListener(placer);
    };
    var _bb1 = Spriteset_Battle.prototype.battleback1Name;
    Spriteset_Battle.prototype.battleback1Name = function () {
        var f = $gameTroop && $gameTroop._avatarFond;
        return f ? (f[0] || '') : _bb1.call(this);
    };
    var _bb2 = Spriteset_Battle.prototype.battleback2Name;
    Spriteset_Battle.prototype.battleback2Name = function () {
        var f = $gameTroop && $gameTroop._avatarFond;
        return f ? (f[1] || '') : _bb2.call(this);
    };
    var _troopSetup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function (troopId) {
        delete this._avatarFond;
        _troopSetup.apply(this, arguments);
    };

    // ── l'IA ─────────────────────────────────────────────────────────────────
    LAvatar.unique = function (user, skillId) { return !(user && user._avatarFait && user._avatarFait[skillId]); };
    LAvatar.depuis = function (user) {
        var t0 = user && user._avatarDepuis !== undefined ? user._avatarDepuis : 0;
        return Math.max(0, $gameTroop.turnCount() - t0);
    };

    // =========================================================================
    //  Les images : photo, braises, aigle, éclats
    // =========================================================================
    function photo() { return SceneManager.snap(); }
    function plein(couleur) { var s = new Sprite(new Bitmap(W(), H())); s.bitmap.fillAll(couleur); return s; }
    function copie(b) { var c = new Bitmap(b.width, b.height); c.blt(b, 0, 0, b.width, b.height, 0, 0); return c; }

    var _braise = null;
    function bitmapBraise() {
        if (_braise) return _braise;
        _braise = new Bitmap(16, 16);
        var c = _braise._context, g = c.createRadialGradient(8, 8, 0, 8, 8, 8);
        g.addColorStop(0, 'rgba(255,250,210,1)'); g.addColorStop(0.35, 'rgba(255,170,60,0.95)'); g.addColorStop(1, 'rgba(255,60,0,0)');
        c.fillStyle = g; c.fillRect(0, 0, 16, 16); _braise._setDirty();
        return _braise;
    }
    function Braises(parent) { this.parent = parent; this.liste = []; }
    Braises.prototype.lancer = function (x, y, n, eparpille, force) {
        for (var i = 0; i < n; i++) {
            var s = new Sprite(bitmapBraise());
            s.anchor.x = s.anchor.y = 0.5;
            s.x = x + (Math.random() - 0.5) * eparpille; s.y = y + (Math.random() - 0.5) * eparpille * 0.6;
            s.blendMode = PIXI.BLEND_MODES.ADD;
            var k = 0.5 + Math.random() * 1.1; s.scale.x = s.scale.y = k;
            s._vx = (Math.random() - 0.5) * (force || 1.5); s._vy = -1 - Math.random() * 2.5 * (force || 1);
            s._vie = s._vieMax = 40 + Math.floor(Math.random() * 50);
            this.parent.addChild(s); this.liste.push(s);
        }
    };
    Braises.prototype.update = function () {
        this.liste = this.liste.filter(function (s) {
            s.x += s._vx + Math.sin((s._vie + s.y) * 0.08) * 0.4; s.y += s._vy; s._vy *= 0.995; s._vie--;
            s.opacity = 255 * Math.min(1, s._vie / (s._vieMax * 0.5));
            if (s._vie <= 0) { if (s.parent) s.parent.removeChild(s); return false; }
            return true;
        });
    };
    Braises.prototype.vider = function () { this.liste.forEach(function (s) { if (s.parent) s.parent.removeChild(s); }); this.liste = []; };

    // l'aigle de feu : « un brasier gigantesque en forme d'aigle » (la Bible)
    function bitmapAigle() {
        var w = 500, h = 340, b = new Bitmap(w, h), c = b._context;
        c.save(); c.translate(w / 2, h / 2 - 10);
        c.shadowColor = COULEUR; c.shadowBlur = 28;
        var g = c.createRadialGradient(0, 0, 8, 0, 0, 240);
        g.addColorStop(0, 'rgba(255,250,215,1)'); g.addColorStop(0.22, 'rgba(255,200,90,0.98)');
        g.addColorStop(0.55, COULEUR); g.addColorStop(1, 'rgba(170,20,0,0.15)');
        c.fillStyle = g;
        var aile = function (sx) {
            c.beginPath(); c.moveTo(sx * 18, -16);
            c.quadraticCurveTo(sx * 95, -112, sx * 232, -100);
            [[220, -74], [206, -64], [192, -40], [172, -38], [156, -14], [134, -16], [116, 8], [92, 2], [70, 24], [44, 16], [22, 24]]
                .forEach(function (p) { c.lineTo(sx * p[0], p[1]); });
            c.closePath(); c.fill();
        };
        aile(-1); aile(1);
        c.beginPath(); c.ellipse(0, 10, 26, 60, 0, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.moveTo(-16, 56); c.lineTo(-38, 124); c.lineTo(-13, 110); c.lineTo(0, 132); c.lineTo(13, 110); c.lineTo(38, 124); c.lineTo(16, 56); c.closePath(); c.fill();
        c.beginPath(); c.arc(0, -52, 17, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.moveTo(-7, -44); c.lineTo(0, -22); c.lineTo(7, -44); c.closePath(); c.fill();
        c.restore(); b._setDirty();
        return b;
    }

    // des fissures qui partent d'un point, dessinées sur une copie de la photo
    function fissurer(ph, ix, iy, couleur) {
        var b = copie(ph), c = b._context, n = 13, rayons = [];
        for (var k = 0; k < n; k++) rayons.push((k + Math.random() * 0.7) / n * Math.PI * 2);
        c.save(); c.strokeStyle = couleur || 'rgba(255,255,255,0.92)'; c.lineWidth = 2; c.shadowColor = 'rgba(255,90,60,0.9)'; c.shadowBlur = 8;
        rayons.forEach(function (a) {
            var r = 0, x = ix, y = iy; c.beginPath(); c.moveTo(x, y);
            while (r < 1100) { r += 40 + Math.random() * 70; var d = a + (Math.random() - 0.5) * 0.35; x = ix + Math.cos(d) * r; y = iy + Math.sin(d) * r; c.lineTo(x, y); }
            c.stroke();
        });
        [70, 170, 300].forEach(function (rr) {
            c.beginPath();
            for (var k = 0; k <= 24; k++) { var a = k / 24 * Math.PI * 2, r2 = rr * (0.85 + Math.random() * 0.3); if (k === 0) c.moveTo(ix + Math.cos(a) * r2, iy + Math.sin(a) * r2); else c.lineTo(ix + Math.cos(a) * r2, iy + Math.sin(a) * r2); }
            c.globalAlpha = 0.55; c.stroke(); c.globalAlpha = 1;
        });
        c.restore(); b._setDirty();
        return { bitmap: b, rayons: rayons.sort(function (a, b) { return a - b; }) };
    }

    // la photo découpée en éclats autour d'un point ; rien derrière : on voit le combat
    function Eclats(parent, ph, ix, iy, rayons) {
        this.liste = []; this.parent = parent;
        var w = W(), h = H(), anneaux = [80, 190, 330, 520, 1100], self = this;
        var V = anneaux.map(function (r) { return rayons.map(function (a) { var rr = r * (0.85 + Math.random() * 0.3); return [ix + Math.cos(a) * rr, iy + Math.sin(a) * rr]; }); });
        var tris = [], n = rayons.length;
        for (var k = 0; k < n; k++) {
            var k2 = (k + 1) % n;
            tris.push([[ix, iy], V[0][k], V[0][k2]]);
            for (var i = 1; i < V.length; i++) { tris.push([V[i - 1][k], V[i][k], V[i][k2]]); tris.push([V[i - 1][k], V[i][k2], V[i - 1][k2]]); }
        }
        tris.forEach(function (t) {
            var xs = t.map(function (p) { return p[0]; }), ys = t.map(function (p) { return p[1]; });
            var bx = Math.floor(Math.max(0, Math.min.apply(null, xs))), by = Math.floor(Math.max(0, Math.min.apply(null, ys)));
            var bx2 = Math.ceil(Math.min(w, Math.max.apply(null, xs))), by2 = Math.ceil(Math.min(h, Math.max.apply(null, ys)));
            if (bx2 - bx < 2 || by2 - by < 2) return;
            var bm = new Bitmap(bx2 - bx, by2 - by), c = bm._context;
            c.save(); c.beginPath(); c.moveTo(t[0][0] - bx, t[0][1] - by); c.lineTo(t[1][0] - bx, t[1][1] - by); c.lineTo(t[2][0] - bx, t[2][1] - by); c.closePath();
            c.clip(); c.drawImage(ph._canvas, -bx, -by);
            c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 2; c.stroke(); c.restore(); bm._setDirty();
            var cx = (t[0][0] + t[1][0] + t[2][0]) / 3, cy = (t[0][1] + t[1][1] + t[2][1]) / 3;
            var s = new Sprite(bm);
            s.anchor.x = (cx - bx) / (bx2 - bx); s.anchor.y = (cy - by) / (by2 - by); s.x = cx; s.y = cy;
            var dx = cx - ix, dy = cy - iy, d = Math.max(1, Math.sqrt(dx * dx + dy * dy)), f = 5 + Math.random() * 7;
            s._vx = dx / d * f; s._vy = dy / d * f - 3 - Math.random() * 3; s._vr = (Math.random() - 0.5) * 0.14; s._retard = Math.floor(d / 70);
            self.liste.push(s); parent.addChild(s);
        });
    }
    Eclats.prototype.update = function () {
        this.liste.forEach(function (s) {
            if (s._retard > 0) { s._retard--; return; }
            s.x += s._vx; s.y += s._vy; s._vy += 0.55; s.rotation += s._vr;
            s.scale.x = s.scale.y = Math.max(0.2, s.scale.x * 0.992); s.opacity -= 3;
        });
    };
    Eclats.prototype.vider = function () { this.liste.forEach(function (s) { if (s.parent) s.parent.removeChild(s); }); this.liste = []; };

    // =========================================================================
    //  Les effets : un pas par image, dans Scene_Battle.update
    // =========================================================================
    function Effet(b) { this.b = b; this.t = 0; this.fini = false; this.sprites = []; }
    Effet.prototype.ajouter = function (parent, s) { if (parent) { parent.addChild(s); this.sprites.push(s); } return s; };
    Effet.prototype.retirer = function (s) { if (s && s.parent) s.parent.removeChild(s); };
    Effet.prototype.nettoyer = function () {
        this.sprites.forEach(function (s) { if (s.parent) s.parent.removeChild(s); });
        if (this.braises) this.braises.vider();
        if (this.eclats) this.eclats.vider();
    };
    Effet.prototype.terminer = function () { if (this.fini) return; this.fini = true; if (this.toutDeSuite) this.toutDeSuite(); this.nettoyer(); };

    function lancer(e) {
        LAvatar._effets.push(e);
        if (LAvatar._sansEffets || !scene()) { e.terminer(); }
        return e;
    }
    LAvatar.bloque = function () { return LAvatar._effets.some(function (e) { return !e.fini; }); };
    LAvatar.maj = function () {
        LAvatar._effets.forEach(function (e) { if (!e.fini) { e.t++; e.pas(); } });
        LAvatar._effets = LAvatar._effets.filter(function (e) { return !e.fini; });
    };
    LAvatar.terminerTout = function () { LAvatar._effets.forEach(function (e) { e.terminer(); }); LAvatar._effets = []; };

    // l'image figée reste à l'écran entre « chute » et « revele »
    LAvatar._fige = null;
    function figer(bm) {
        defiger();
        var s = scene(); if (!s) return null;
        LAvatar._fige = new Sprite(bm); LAvatar._fige._avatarDepuis = Graphics.frameCount;
        s.addChild(LAvatar._fige);
        return LAvatar._fige;
    }
    function defiger() { if (LAvatar._fige && LAvatar._fige.parent) LAvatar._fige.parent.removeChild(LAvatar._fige); LAvatar._fige = null; }

    // ── LA CHUTE ─────────────────────────────────────────────────────────────
    function Chute(b) { Effet.call(this, b); }
    Chute.prototype = Object.create(Effet.prototype);
    Chute.prototype.pas = function () {
        var sp = spriteset(), sc = scene(), t = this.t, o = LAvatar.ou(this.b);
        if (!sp || !sc) return this.terminer();
        if (t === 1) {
            var bf = sp._battleField, i = bf.children.indexOf(sp._back2Sprite) + 1;
            this.noir = plein('#000000'); this.noir.x = -32; this.noir.y = -32; this.noir.scale.x = (W() + 64) / W(); this.noir.scale.y = (H() + 64) / H(); this.noir.opacity = 0;
            bf.addChildAt(this.noir, Math.max(0, i)); LAvatar._noir = this.noir;
            AudioManager.fadeOutBgm(3);
            se('Darkness3', 80, 70);
            this.braises = new Braises(sp);
        }
        if (t <= 50) this.noir.opacity = Math.round(t / 50 * 205);
        if (t >= 20 && t <= 230) this.braises.lancer(o.x, o.y + 30, t < 150 ? 2 : 4, 90, 1.2);
        if (t === 60) {
            this.aigle = this.ajouter(sp, new Sprite(bitmapAigle()));
            this.aigle.anchor.x = this.aigle.anchor.y = 0.5; this.aigle.blendMode = PIXI.BLEND_MODES.ADD; this.aigle.opacity = 0;
            se('Fire3', 90, 70); se('Wind7', 70, 60);
        }
        if (this.aigle && t > 60 && t <= 214) {
            var k = Math.min(1, (t - 60) / 90), e = 1 - Math.pow(1 - k, 3);
            this.aigle.x = o.x + Math.sin(t * 0.05) * 6; this.aigle.y = o.y - 120 - e * 40 + Math.sin(t * 0.09) * 5;
            this.aigle.scale.x = 0.25 + e * 0.95; this.aigle.scale.y = this.aigle.scale.x * (1 + Math.sin(t * 0.22) * 0.09);
            this.aigle.opacity = Math.min(240, 40 + e * 200 + Math.sin(t * 0.5) * 15);
            if (t > 120) this.braises.lancer(this.aigle.x + (Math.random() - 0.5) * 380 * this.aigle.scale.x, this.aigle.y - 20, 2, 30, 1);
            if (t === 150) se('Fire2', 80, 60);
        }
        if (this.aigle && t > 214 && t <= 234) {
            var d = (t - 214) / 20;
            this.aigle.y += (o.y - this.aigle.y) * 0.35; this.aigle.scale.x = this.aigle.scale.y = Math.max(0.2, 1.2 - d);
            this.aigle.opacity = 255;
            if (t === 216) se('Fire3', 100, 120);
        }
        if (this.braises) this.braises.update();
        if (t === 232) this.image = photo();
        if (t === 235) {
            figer(this.image);
            if (this.aigle) this.retirer(this.aigle);
            if (this.braises) this.braises.vider();
            this.flash = this.ajouter(sc, plein('#ffffff')); this.flash.opacity = 255;
            se('Flash2', 100, 80); se('Explosion2', 80, 60);
        }
        if (this.flash && t > 235) this.flash.opacity = Math.max(0, 255 - (t - 235) * 9);
        if (t >= 265) this.terminer();
    };
    // sans affichage : l'image figée n'existe pas, le noir non plus
    Chute.prototype.toutDeSuite = function () { };

    // ── LA RÉVÉLATION ────────────────────────────────────────────────────────
    function Revele(b) { Effet.call(this, b); }
    Revele.prototype = Object.create(Effet.prototype);
    Revele.prototype.pas = function () {
        var sc = scene(), t = this.t, o = LAvatar.ou(this.b);
        if (!sc) return this.terminer();
        if (t === 1) {
            this.ph = LAvatar._fige ? LAvatar._fige.bitmap : photo();
            var f = fissurer(this.ph, o.x, o.y, 'rgba(255,235,220,0.95)');
            this.rayons = f.rayons;
            this.fissures = this.ajouter(sc, new Sprite(f.bitmap));
            se('Break', 90, 70);
        }
        if (t === 22) {
            this.eclats = new Eclats(sc, this.ph, o.x, o.y, this.rayons);
            this.retirer(this.fissures); defiger();
            if (LAvatar._noir) { this.retirer(LAvatar._noir); LAvatar._noir = null; }
            this.flash = this.ajouter(sc, plein('#ff3030')); this.flash.opacity = 150;
            se('Break', 100, 100); se('Explosion2', 90, 80);
            if (this.b) { this.b._avatarDepuis = $gameTroop.turnCount(); }
            var MB = window.MecaBoss, d = this.b && this.b.isEnemy() ? this.b.enemy() : null;
            if (MB && MB.banniere && d) MB.banniere(String(d.name).trim(), d.meta && d.meta.Desc ? String(d.meta.Desc).trim() : '', '#ff4040');
        }
        if (this.flash) this.flash.opacity = Math.max(0, this.flash.opacity - 6);
        if (this.eclats) this.eclats.update();
        if (t >= 120) this.terminer();
    };
    Revele.prototype.toutDeSuite = function () {
        defiger();
        if (LAvatar._noir) { this.retirer(LAvatar._noir); LAvatar._noir = null; }
        if (this.b && this.b._avatarDepuis === undefined) this.b._avatarDepuis = $gameTroop.turnCount();
    };

    // ── LA FIN ───────────────────────────────────────────────────────────────
    function Fin(b) { Effet.call(this, b); if (b) b._avatarFin = true; }
    Fin.prototype = Object.create(Effet.prototype);
    Fin.prototype.pas = function () {
        var sp = spriteset(), t = this.t, o = LAvatar.ou(this.b), s = spriteDe(this.b);
        if (!sp) return this.terminer();
        if (t === 1) { this.braises = new Braises(sp); AudioManager.fadeOutBgm(4); se('Fire1', 80, 60); }
        this.braises.lancer(o.x, o.y + 40, 3, 110, 1.4);
        this.braises.update();
        if (s && s.setBlendColor) { var a = Math.round(120 + Math.sin(t * 0.3) * 80); s.setBlendColor([255, 60, 20, a]); }
        if (t >= 110) { if (s && s.setBlendColor) s.setBlendColor([0, 0, 0, 0]); this.terminer(); }
    };
    var _collapseType = Game_Enemy.prototype.collapseType;
    Game_Enemy.prototype.collapseType = function () { return this._avatarFin ? 1 : _collapseType.call(this); };

    // ── TRANCHE-CONCEPT : l'écran coupé en deux ──────────────────────────────
    function Tranche(b) { Effet.call(this, b); }
    Tranche.prototype = Object.create(Effet.prototype);
    Tranche.prototype.pas = function () {
        var sc = scene(), t = this.t, w = W(), h = H();
        if (!sc) return this.terminer();
        var L = 2000;
        if (t === 18) {
            this.ph = photo();
            this.fige = this.ajouter(sc, new Sprite(this.ph));
            var a = (Math.random() < 0.5 ? -1 : 1) * (0.33 + Math.random() * 0.28);
            this.dx = Math.cos(a); this.dy = Math.sin(a); this.nx = -this.dy; this.ny = this.dx;
            this.px = w / 2 + (Math.random() - 0.5) * 120; this.py = h / 2 + (Math.random() - 0.5) * 80;
            this.ligne = this.ajouter(sc, new Sprite(new Bitmap(w, h)));
            se('Slash5', 100, 70); se('Sword4', 80, 60);
        }
        if (t >= 18 && t <= 28 && this.ligne) {
            var k = (t - 18) / 10, c = this.ligne.bitmap._context;
            this.ligne.bitmap.clear();
            var x0 = this.px - this.dx * L, y0 = this.py - this.dy * L;
            c.save(); c.lineCap = 'round';
            c.strokeStyle = 'rgba(255,40,40,0.8)'; c.lineWidth = 10; c.shadowColor = '#ff2020'; c.shadowBlur = 24;
            c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + this.dx * 2 * L * k, y0 + this.dy * 2 * L * k); c.stroke();
            c.strokeStyle = '#ffffff'; c.lineWidth = 3; c.shadowBlur = 8; c.stroke();
            c.restore(); this.ligne.bitmap._setDirty();
        }
        if (t === 29) {
            var self = this, moitie = function (signe) {
                var b = new Bitmap(w, h), c = b._context;
                c.save(); c.beginPath();
                c.moveTo(self.px - self.dx * L, self.py - self.dy * L); c.lineTo(self.px + self.dx * L, self.py + self.dy * L);
                c.lineTo(self.px + self.dx * L + self.nx * L * signe, self.py + self.dy * L + self.ny * L * signe);
                c.lineTo(self.px - self.dx * L + self.nx * L * signe, self.py - self.dy * L + self.ny * L * signe);
                c.closePath(); c.clip(); c.drawImage(self.ph._canvas, 0, 0); c.restore(); b._setDirty();
                var s = self.ajouter(sc, new Sprite(b)); s._signe = signe;
                return s;
            };
            this.retirer(this.fige);
            this.moities = [moitie(1), moitie(-1)];
            sc.removeChild(this.ligne); sc.addChild(this.ligne);
            LAvatar.trancherDomaines();
            LAvatar.fondForet();
            this.flash = this.ajouter(sc, plein('#ffffff')); this.flash.opacity = 120;
            se('Sword5', 100, 50); se('Break', 80, 140);
            $gameScreen.startShake(6, 9, 12);
        }
        if (this.moities && t > 29) {
            var u = t - 29, dist = u < 18 ? u * 1.2 : 21.6 + Math.pow(u - 18, 1.6) * 1.1, self2 = this;
            this.moities.forEach(function (s) {
                s.x = self2.nx * dist * s._signe; s.y = self2.ny * dist * s._signe;
                s.rotation = 0.012 * s._signe * Math.min(u, 30) / 30;
                if (u > 26) s.opacity = Math.max(0, 255 - (u - 26) * 9);
            });
            if (this.ligne) this.ligne.opacity = Math.max(0, 255 - u * 12);
            if (this.flash) this.flash.opacity = Math.max(0, this.flash.opacity - 10);
        }
        if (t >= 90) this.terminer();
    };
    Tranche.prototype.toutDeSuite = function () { if (!this.moities) { LAvatar.trancherDomaines(); LAvatar.fondForet(); } };

    // ── L'ÉCRAN BRISÉ ────────────────────────────────────────────────────────
    function Brise(b) { Effet.call(this, b); }
    Brise.prototype = Object.create(Effet.prototype);
    Brise.prototype.pas = function () {
        var sc = scene(), t = this.t, o = LAvatar.ou(this.b);
        if (!sc) return this.terminer();
        if (t === 18) {
            this.ph = photo();
            var f = fissurer(this.ph, o.x, o.y);
            this.rayons = f.rayons;
            this.fige = this.ajouter(sc, new Sprite(f.bitmap));
            se('Break', 90, 120); $gameScreen.startShake(3, 9, 20);
        }
        if (t === 44) {
            LAvatar.fondForet();
            this.eclats = new Eclats(sc, this.ph, o.x, o.y, this.rayons);
            this.retirer(this.fige);
            this.flash = this.ajouter(sc, plein('#ffffff')); this.flash.opacity = 200;
            se('Break', 100, 90); se('Crash', 90, 70);
            this.casse = true;
        }
        if (this.flash) this.flash.opacity = Math.max(0, this.flash.opacity - 8);
        if (this.eclats) this.eclats.update();
        if (t >= 140) this.terminer();
    };
    Brise.prototype.toutDeSuite = function () { if (!this.casse) LAvatar.fondForet(); };

    // ── LE FAUX PLANTAGE ─────────────────────────────────────────────────────
    // L'écran d'erreur est celui de RPG Maker (Graphics._errorPrinter, le flou de
    // _applyCanvasFilter) ; on ne touche ni à SceneManager ni à _errorShowed : le
    // jeu continue dessous. Un vrai plantage pendant ce temps reste affiché.
    function Plantage(b) { Effet.call(this, b); }
    Plantage.prototype = Object.create(Effet.prototype);
    var DEBUT_ERREUR = 50;
    Plantage.prototype.finErreur = function () { return DEBUT_ERREUR + Math.round(SEC_PLANTAGE * 60); };
    Plantage.prototype.pas = function () {
        var sc = scene(), t = this.t, o = LAvatar.ou(this.b), fe = this.finErreur();
        if (!sc) return this.terminer();
        if (t === 1) {
            this.ph = photo();
            this.fige = this.ajouter(sc, new Sprite(this.ph));
            this.musique = AudioManager.saveBgm(); this.bruit = AudioManager.saveBgs();
            AudioManager.stopBgm(); AudioManager.stopBgs();
        }
        if (t === DEBUT_ERREUR) this.montrerErreur();
        if (t === fe) {
            this.cacherErreur();
            this.retirer(this.fige);
            this.ecran = erreurDessinee(this.ph);
            var f = fissurer(this.ecran, o.x, o.y, 'rgba(255,255,255,0.95)');
            this.rayons = f.rayons;
            this.fige = this.ajouter(sc, new Sprite(f.bitmap));
            se('Break', 90, 60);
        }
        if (t === fe + 26) {
            LAvatar.fondForet();
            this.eclats = new Eclats(sc, this.ecran, o.x, o.y, this.rayons);
            this.retirer(this.fige);
            this.flash = this.ajouter(sc, plein('#ffffff')); this.flash.opacity = 230;
            se('Break', 100, 100); se('Crash', 100, 60); se('Explosion2', 80, 70);
            this.rendreLaMusique();
            $gameScreen.startShake(7, 9, 24);
        }
        if (this.flash) this.flash.opacity = Math.max(0, this.flash.opacity - 7);
        if (this.eclats) this.eclats.update();
        if (t >= fe + 130) this.terminer();
    };
    Plantage.prototype.montrerErreur = function () {
        if (Graphics._errorShowed || !Graphics._errorPrinter) return;
        var cv = Graphics._canvas;
        this.style = cv ? { o: cv.style.opacity, f: cv.style.filter, w: cv.style.webkitFilter } : null;
        Graphics._errorPrinter.innerHTML = Graphics._makeErrorHtml(ERREUR_NOM, ERREUR_MSG);
        Graphics._applyCanvasFilter();
        this.erreurMontree = true;
    };
    Plantage.prototype.cacherErreur = function () {
        if (!this.erreurMontree) return;
        this.erreurMontree = false;
        if (Graphics._errorShowed) return;                     // un vrai plantage : on le laisse
        if (Graphics._errorPrinter) Graphics._errorPrinter.innerHTML = '';
        var cv = Graphics._canvas;
        if (cv && this.style) { cv.style.opacity = this.style.o || ''; cv.style.filter = this.style.f || ''; cv.style.webkitFilter = this.style.w || ''; }
    };
    Plantage.prototype.rendreLaMusique = function () {
        if (this.musiqueRendue) return;
        this.musiqueRendue = true;
        if (this.musique && this.musique.name) AudioManager.replayBgm(this.musique);
        if (this.bruit && this.bruit.name) AudioManager.replayBgs(this.bruit);
    };
    Plantage.prototype.toutDeSuite = function () { this.cacherErreur(); this.rendreLaMusique(); if (!this.eclats) LAvatar.fondForet(); };
    // l'écran d'erreur, dessiné dans une image (pour pouvoir le briser) : même flou, même texte
    function erreurDessinee(ph) {
        var w = W(), h = H(), b = new Bitmap(w, h), c = b._context;
        c.fillStyle = '#000000'; c.fillRect(0, 0, w, h);
        c.save(); c.globalAlpha = 0.5;
        try { c.filter = 'blur(8px)'; } catch (e) { }
        c.drawImage(ph._canvas, 0, 0); c.restore();
        var police = 'serif';
        try { if (Graphics._errorPrinter) police = window.getComputedStyle(Graphics._errorPrinter).fontFamily || police; } catch (e) { }
        // le vrai écran d'erreur est écrit en 20 px d'écran, par-dessus l'image agrandie : même taille ici
        var px = Math.max(10, Math.round(20 / (Graphics._realScale || 1)));
        c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.shadowColor = '#000'; c.shadowBlur = 3; c.shadowOffsetX = 1; c.shadowOffsetY = 1;
        c.font = 'bold ' + px + 'px ' + police; c.fillStyle = 'yellow'; c.fillText(ERREUR_NOM, w / 2, h / 2 - px * 0.6);
        c.font = px + 'px ' + police; c.fillStyle = 'white'; c.fillText(ERREUR_MSG, w / 2, h / 2 + px * 0.6);
        c.restore(); b._setDirty();
        return b;
    }

    // ── LA MAIN SUR LE JEU ───────────────────────────────────────────────────
    function Main(b) { Effet.call(this, b); }
    Main.prototype = Object.create(Effet.prototype);
    var DUREE_MAIN = 160;
    Main.prototype.pas = function () {
        var sc = scene(), t = this.t - 16, cv = Graphics._canvas;
        if (!sc) return this.terminer();
        if (t < 0) return;
        if (t === 0) { se('Darkness4', 90, 60); se('Wind6', 70, 50); this.fenetreDebut(); }
        var env = Math.min(1, t / 20) * Math.min(1, (DUREE_MAIN - t) / 25);
        if (cv) {
            var ang = 4.5 * Math.sin(t * 0.16) * env, tx = 16 * Math.sin(t * 0.29) * env, ty = 9 * Math.sin(t * 0.21) * env, k = 1 + 0.05 * Math.sin(t * 0.11) * env;
            cv.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) rotate(' + ang.toFixed(2) + 'deg) scale(' + k.toFixed(3) + ')';
        }
        // l'image se déchire par bandes
        if (t >= 30 && t <= DUREE_MAIN - 30 && t % 10 === 0) this.dechirer(sc);
        if (this.bandes && t % 10 === 4) { this.bandes.forEach(function (s) { if (s.parent) s.parent.removeChild(s); }); this.bandes = null; }
        if (t <= 70 && t % 2 === 0) this.fenetreTremble(t);
        if (t === 72) this.fenetreFin();
        if (t >= DUREE_MAIN) this.terminer();
    };
    Main.prototype.dechirer = function (sc) {
        var ph = photo(), w = W(), h = H(), self = this;
        this.bandes = [];
        for (var i = 0; i < 3; i++) {
            var y = Math.floor(Math.random() * (h - 40)), hh = 12 + Math.floor(Math.random() * 40);
            var s = new Sprite(ph); s.setFrame(0, y, w, hh); s.y = y; s.x = (Math.random() - 0.5) * 50;
            s.setBlendColor(i % 2 ? [0, 255, 255, 90] : [255, 0, 60, 90]);
            sc.addChild(s); this.bandes.push(s); this.sprites.push(s);
        }
    };
    Main.prototype.fenetreDebut = function () {
        if (!FENETRE || !Utils.isNwjs() || Graphics._isFullScreen()) return;
        try { this.fenetre = require('nw.gui').Window.get(); this.fx = this.fenetre.x; this.fy = this.fenetre.y; } catch (e) { this.fenetre = null; }
    };
    Main.prototype.fenetreTremble = function (t) {
        if (!this.fenetre) return;
        var a = Math.max(0, 1 - t / 70);
        try { this.fenetre.moveTo(Math.round(this.fx + (Math.random() - 0.5) * 28 * a), Math.round(this.fy + (Math.random() - 0.5) * 20 * a)); } catch (e) { }
    };
    Main.prototype.fenetreFin = function () { if (this.fenetre) { try { this.fenetre.moveTo(this.fx, this.fy); } catch (e) { } this.fenetre = null; } };
    Main.prototype.toutDeSuite = function () {
        this.fenetreFin();
        if (Graphics._canvas) Graphics._canvas.style.transform = '';
    };

    // =========================================================================
    //  Les branchements
    // =========================================================================
    var BALISES = [['TrancheConcept', Tranche], ['BriseEcran', Brise], ['FauxPlantage', Plantage], ['MainSurLeJeu', Main]];
    var _useItem = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function (item) {
        _useItem.apply(this, arguments);
        if (!item || !DataManager.isSkill(item) || !$gameParty.inBattle() || !this.isEnemy()) return;
        var self = this;
        (this._avatarFait = this._avatarFait || {})[item.id] = true;
        if (item.meta && item.meta.TrancheConcept) this._avatarRiposte = false;
        BALISES.forEach(function (b) { if (item.meta && item.meta[b[0]]) lancer(new b[1](self)); });
    };

    // ── elle ne laisse pas un domaine ouvert (<BriseDomaines: compétence>) ──
    // Dès qu'un domaine s'ouvre — le Royaume de ludwing, le Monde Gelé de Korrah posé sur elle, qui
    // l'immobilise —, à la fin de l'action qui l'a ouvert elle le tranche, sans perdre son tour
    // (Interactions.forcer garde ce qu'elle avait prévu). Une action forcée part même immobilisée.
    function trancheuse() {
        return $gameTroop.aliveMembers().filter(function (e) { return e.isAppeared() && e.enemy().meta && e.enemy().meta.BriseDomaines; })[0] || null;
    }
    LAvatar.trancheuse = trancheuse;
    var _tousFinis = Game_Battler.prototype.onAllActionsEnd;
    Game_Battler.prototype.onAllActionsEnd = function () {
        _tousFinis.call(this);
        if (!$gameParty.inBattle() || !LAvatar.domaineOuvert()) return;
        var e = trancheuse();
        if (!e || e === this || e._avatarRiposte) return;
        var id = Number(String(e.enemy().meta.BriseDomaines).trim()) || 0;
        if (!$dataSkills[id]) return;
        e._avatarRiposte = true;
        if (window.Interactions && Interactions.forcer) Interactions.forcer(e, id, -1);
        else if (BattleManager.queueForceAction) BattleManager.queueForceAction(e, id, -1);
    };

    // l'action attend la fin de l'effet (YEP : « wait for animation »)
    var _anim = Spriteset_Battle.prototype.isAnimationPlaying;
    Spriteset_Battle.prototype.isAnimationPlaying = function () { return LAvatar.bloque() || _anim.call(this); };

    var _majScene = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        _majScene.call(this);
        LAvatar.maj();
        // une image figée oubliée (la page de JOKO n'a pas « AVATAR revele ») ne reste pas : 15 s
        if (LAvatar._fige && !LAvatar.bloque() && Graphics.frameCount - LAvatar._fige._avatarDepuis > 900) lancer(new Revele($gameTroop.members()[0]));
    };
    LAvatar.nettoyer = function () {
        LAvatar.terminerTout();
        defiger();
        LAvatar._noir = null;
        if (Graphics._canvas) Graphics._canvas.style.transform = '';
    };
    var _terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function () { LAvatar.nettoyer(); _terminate.call(this); };

    // ── les commandes : AVATAR chute | revele | fin | foret [n° de l'ennemi] ──
    var EFFETS = { chute: Chute, revele: Revele, fin: Fin };
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pc.call(this, command, args);
        if (String(command || '').toUpperCase() !== 'AVATAR') return;
        var quoi = String(args[0] || '').toLowerCase().replace(/[éè]/g, 'e');
        var n = Math.max(1, Number(args[1] || 1)), b = $gameTroop.members()[n - 1] || $gameTroop.members()[0];
        if (quoi === 'foret') { LAvatar.fondForet(); return; }
        var E = EFFETS[quoi];
        if (!E || !$gameParty.inBattle()) return;
        lancer(new E(b));
        this._avatarImage = Graphics.frameCount; this._avatarAppels = 0;
        this.setWaitMode('avatar');
    };
    var _wait = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode !== 'avatar') return _wait.call(this);
        if (LAvatar.bloque()) {
            // personne ne dessine (un banc qui fait tourner la page à la main) : on ne reste pas là
            if (Graphics.frameCount === this._avatarImage) { if (++this._avatarAppels > 60) { LAvatar.terminerTout(); this._waitMode = ''; return false; } }
            else { this._avatarImage = Graphics.frameCount; this._avatarAppels = 0; }
            return true;
        }
        this._waitMode = '';
        return false;
    };
})();
