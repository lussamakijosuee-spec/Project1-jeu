//=============================================================================
// DecorsLibres.js — v1.0  ·  Des décors posés au pixel, hors de la grille
// RPG Maker MV   ·   pour JOKO
//   Inspiré, sans rien en copier, de Grid-Free Doodads (Yanfly) : il lit les
//   1 432 images de img/doodads (le pack de Yanfly) et en ajoute d'autres si
//   on en met dans ce dossier.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Des décors posés au pixel près, hors de la grille, avec
 * un éditeur à la souris en test (Ctrl+D).
 * @author JOKO
 *
 * @param grille
 * @text Aimantation (px)
 * @type number
 * @min 1
 * @default 24
 * @desc Pas de l'aimantation quand la case « Aimanter » est cochée (48 = une case, 24 = une demi-case).
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  DES DÉCORS POSÉS AU PIXEL
 * ═══════════════════════════════════════════════════════════════════════════
 *  Les décors (lits, tonneaux, arbres, torches, clôtures…) se posent où l'on
 *  veut sur une carte, sans suivre les cases. Ils sont rangés, carte par
 *  carte, dans data/Decors.json — rien n'est écrit dans tes cartes.
 *
 *  ── L'ÉDITEUR (seulement en test, lancé depuis RPG Maker) ─────────────
 *  Sur une carte, Ctrl+D ouvre le panneau à droite :
 *    · choisis un dossier, ou tape un mot (« torch », « bed »…) ;
 *    · clique une image : elle suit la souris sur la carte ;
 *    · CLIC GAUCHE la pose — CLIC DROIT sur un décor l'enlève ;
 *    · couche : « sol » (sous les personnages), « personnages » (on passe
 *      devant ou derrière selon la hauteur), « dessus » (au-dessus de tout) ;
 *    · taille, miroir, opacité ; « Aimanter » pose sur une grille de 24 px ;
 *    · « Annuler » retire le dernier posé ;
 *    · « Enregistrer » écrit data/Decors.json (dans un navigateur, il donne
 *      le texte à copier à la place).
 *  On peut marcher au clavier pendant l'édition pour aller plus loin.
 *  Ctrl+D referme le panneau.
 *
 *  ── LES DÉCORS ANIMÉS ─────────────────────────────────────────────────
 *  Un nom qui finit par [3x1] (Campfire A [3x1]) est découpé en 3 images
 *  côte à côte qui défilent : feux, torches, fontaines.
 *
 *  Pour d'autres images : dépose-les dans img/doodads (un sous-dossier par
 *  famille), puis relance bancs/outils/index_des_decors.js pour le jeu
 *  dans un navigateur ; dans RPG Maker, le panneau les voit tout seul.
 */
var DecorsLibres = window.DecorsLibres || {};
window.DecorsLibres = DecorsLibres;
(function () {
    'use strict';
    var P = PluginManager.parameters('DecorsLibres');
    var GRILLE = Math.max(1, Number(P.grille || 24));
    var COUCHES = { sol: 1, personnages: 3, dessus: 6 };

    //=========================================================================
    // Les données : data/Decors.json et data/DecorsIndex.json
    //=========================================================================
    DecorsLibres.donnees = {};
    DecorsLibres.index = [];
    var charges = 0;
    function charger(fichier, cle) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/' + fichier);
        xhr.overrideMimeType('application/json');
        xhr.onload = function () { if (xhr.status < 400) { try { DecorsLibres[cle] = JSON.parse(xhr.responseText); } catch (e) { } } charges++; };
        xhr.onerror = function () { charges++; };
        xhr.send();
    }
    charger('Decors.json', 'donnees');
    charger('DecorsIndex.json', 'index');
    var _isReady = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function () { return _isReady.call(this) && charges >= 2; };
    DecorsLibres.deLaCarte = function (id) { return DecorsLibres.donnees[String(id)] || []; };

    //=========================================================================
    // L'affichage
    //=========================================================================
    function Sprite_Decor() { this.initialize.apply(this, arguments); }
    Sprite_Decor.prototype = Object.create(Sprite.prototype);
    Sprite_Decor.prototype.constructor = Sprite_Decor;
    Sprite_Decor.prototype.initialize = function (d) {
        Sprite.prototype.initialize.call(this, ImageManager.loadBitmap('img/doodads/', d.image));
        this._decor = d;
        this.anchor.x = 0.5; this.anchor.y = 1;
        var m = /\[(\d+)x(\d+)\]\s*$/.exec(d.image);
        this._cases = m ? { c: Number(m[1]), r: Number(m[2]) } : null;
        this._t = Math.floor(Math.random() * 30);
        this.appliquer();
    };
    Sprite_Decor.prototype.appliquer = function () {
        var d = this._decor;
        this.z = COUCHES[d.couche] || 1;
        var e = (d.echelle || 100) / 100;
        this.scale.x = e * (d.miroir ? -1 : 1); this.scale.y = e;
        this.opacity = d.opacite === undefined ? 255 : d.opacite;
    };
    Sprite_Decor.prototype.update = function () {
        Sprite.prototype.update.call(this);
        var d = this._decor, tw = $gameMap.tileWidth(), th = $gameMap.tileHeight();
        this.x = Math.round(d.x - $gameMap.displayX() * tw);
        this.y = Math.round(d.y - $gameMap.displayY() * th);
        if (this._cases && this.bitmap.isReady()) {
            var c = this._cases, w = this.bitmap.width / c.c, h = this.bitmap.height / c.r;
            var n = Math.floor(this._t++ / 10) % (c.c * c.r);
            this.setFrame(n % c.c * w, Math.floor(n / c.c) * h, w, h);
        }
    };
    DecorsLibres.Sprite_Decor = Sprite_Decor;

    var _cll = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function () {
        _cll.call(this);
        this._decors = [];
        DecorsLibres.deLaCarte($gameMap.mapId()).forEach(function (d) { this.ajouterDecor(d); }, this);
    };
    Spriteset_Map.prototype.ajouterDecor = function (d) {
        var s = new Sprite_Decor(d);
        this._decors.push(s);
        this._tilemap.addChild(s);
        return s;
    };
    Spriteset_Map.prototype.retirerDecor = function (d) {
        for (var i = this._decors.length - 1; i >= 0; i--) {
            if (this._decors[i]._decor === d) { this._tilemap.removeChild(this._decors[i]); this._decors.splice(i, 1); }
        }
    };

    //=========================================================================
    // L'éditeur (en test seulement)
    //=========================================================================
    function enTest() { return Utils.isOptionValid('test') || (typeof $gameTemp !== 'undefined' && $gameTemp && $gameTemp.isPlaytest && $gameTemp.isPlaytest()); }
    DecorsLibres.ouvert = false;
    var E = { choix: '', couche: 'sol', echelle: 100, miroir: false, opacite: 255, aimanter: false, poses: [] };
    DecorsLibres.etat = E;

    function lireDisque() {
        // dans RPG Maker (NW.js), on relit img/doodads ; sinon l'index
        try {
            var fs = require('fs'), path = require('path'), base = path.join(path.dirname(process.mainModule.filename), 'img', 'doodads'), l = [];
            (function lire(d, rel) {
                fs.readdirSync(d).sort().forEach(function (f) {
                    var p = path.join(d, f), r = rel ? rel + '/' + f : f;
                    if (fs.statSync(p).isDirectory()) lire(p, r); else if (/\.png$/i.test(f)) l.push(r.replace(/\.png$/i, ''));
                });
            })(base, '');
            if (l.length) DecorsLibres.index = l;
        } catch (e) { }
    }
    function panneau() {
        if (DecorsLibres._panneau) return DecorsLibres._panneau;
        lireDisque();
        var p = document.createElement('div');
        p.id = 'decors-libres';
        p.style.cssText = 'position:fixed;top:0;right:0;width:300px;height:100%;z-index:99;background:rgba(20,18,28,0.94);color:#eee;font:13px sans-serif;display:flex;flex-direction:column;box-sizing:border-box;padding:8px;gap:6px';
        var dossiers = {};
        DecorsLibres.index.forEach(function (n) { dossiers[n.split('/')[0]] = 1; });
        p.innerHTML = '<b>Décors libres — carte <span id="dl-carte"></span></b>' +
            '<select id="dl-dossier"><option value="">(tous les dossiers)</option>' + Object.keys(dossiers).map(function (d) { return '<option>' + d + '</option>'; }).join('') + '</select>' +
            '<input id="dl-filtre" placeholder="chercher : torch, bed, tree…">' +
            '<div id="dl-grille" style="flex:1;overflow:auto;display:flex;flex-wrap:wrap;gap:4px;align-content:flex-start"></div>' +
            '<div>Couche <select id="dl-couche"><option value="sol">sol</option><option value="personnages">personnages</option><option value="dessus">dessus</option></select>' +
            ' Taille <input id="dl-echelle" type="number" value="100" style="width:52px">%</div>' +
            '<div><label><input id="dl-miroir" type="checkbox"> miroir</label> <label><input id="dl-aimanter" type="checkbox"> aimanter</label>' +
            ' opacité <input id="dl-opacite" type="number" value="255" style="width:50px"></div>' +
            '<div style="display:flex;gap:6px"><button id="dl-annuler">Annuler</button><button id="dl-enregistrer">Enregistrer</button></div>' +
            '<div id="dl-info" style="color:#bbb;min-height:2.4em">Clic gauche : poser · clic droit : enlever · Ctrl+D : fermer</div>' +
            '<textarea id="dl-texte" style="display:none;height:90px"></textarea>';
        document.body.appendChild(p);
        function $(id) { return p.querySelector('#' + id); }
        function remplir() {
            var d = $('dl-dossier').value, f = $('dl-filtre').value.toLowerCase(), g = $('dl-grille');
            g.innerHTML = '';
            DecorsLibres.index.filter(function (n) { return (!d || n.indexOf(d + '/') === 0) && (!f || n.toLowerCase().indexOf(f) >= 0); }).slice(0, 300).forEach(function (n) {
                var im = document.createElement('img');
                im.src = 'img/doodads/' + n.split('/').map(encodeURIComponent).join('/') + '.png';
                im.title = n; im.dataset.nom = n;
                im.style.cssText = 'max-width:64px;max-height:64px;background:#333;cursor:pointer;border:2px solid ' + (n === E.choix ? '#ffd166' : 'transparent');
                im.onclick = function () { DecorsLibres.choisir(n); remplir(); };
                g.appendChild(im);
            });
        }
        DecorsLibres._remplir = remplir;
        $('dl-dossier').onchange = remplir; $('dl-filtre').oninput = remplir;
        $('dl-couche').onchange = function () { E.couche = this.value; };
        $('dl-echelle').oninput = function () { E.echelle = Math.max(10, Number(this.value) || 100); };
        $('dl-miroir').onchange = function () { E.miroir = this.checked; };
        $('dl-aimanter').onchange = function () { E.aimanter = this.checked; };
        $('dl-opacite').oninput = function () { E.opacite = Math.max(0, Math.min(255, Number(this.value) || 255)); };
        $('dl-annuler').onclick = function () { DecorsLibres.annuler(); };
        $('dl-enregistrer').onclick = function () { DecorsLibres.enregistrer(); };
        // le panneau garde la souris pour lui
        ['mousedown', 'mouseup', 'contextmenu', 'wheel', 'touchstart'].forEach(function (t) { p.addEventListener(t, function (e) { e.stopPropagation(); }); });
        remplir();
        DecorsLibres._panneau = p;
        return p;
    }
    DecorsLibres.ouvrirEditeur = function () {
        if (!enTest() || !(SceneManager._scene instanceof Scene_Map)) return false;
        DecorsLibres.ouvert = true;
        var p = panneau();
        p.style.display = 'flex';
        p.querySelector('#dl-carte').textContent = $gameMap.mapId();
        return true;
    };
    DecorsLibres.fermerEditeur = function () {
        DecorsLibres.ouvert = false;
        if (DecorsLibres._panneau) DecorsLibres._panneau.style.display = 'none';
        DecorsLibres.choisir('');
    };
    DecorsLibres.choisir = function (nom) {
        E.choix = nom || '';
        var s = SceneManager._scene, ss = s && s._spriteset;
        if (ss && ss._dlApercu) { ss._tilemap.removeChild(ss._dlApercu); ss._dlApercu = null; }
        if (E.choix && ss) {
            ss._dlApercu = new Sprite_Decor({ image: E.choix, x: 0, y: 0, couche: 'dessus' });
            ss._dlApercu.opacity = 160;
            ss._tilemap.addChild(ss._dlApercu);
        }
    };
    function versCarte(x, y) {
        var tw = $gameMap.tileWidth(), th = $gameMap.tileHeight();
        var mx = x + $gameMap.displayX() * tw, my = y + $gameMap.displayY() * th;
        if (E.aimanter) { mx = Math.round(mx / GRILLE) * GRILLE; my = Math.round(my / GRILLE) * GRILLE; }
        return { x: Math.round(mx), y: Math.round(my) };
    }
    DecorsLibres.poser = function (ecranX, ecranY) {
        if (!E.choix) return null;
        var c = versCarte(ecranX, ecranY), id = String($gameMap.mapId());
        var d = { image: E.choix, x: c.x, y: c.y, couche: E.couche };
        if (E.echelle !== 100) d.echelle = E.echelle;
        if (E.miroir) d.miroir = true;
        if (E.opacite !== 255) d.opacite = E.opacite;
        (DecorsLibres.donnees[id] = DecorsLibres.donnees[id] || []).push(d);
        E.poses.push(d);
        SceneManager._scene._spriteset.ajouterDecor(d);
        return d;
    };
    DecorsLibres.enlever = function (ecranX, ecranY) {
        var ss = SceneManager._scene._spriteset, l = DecorsLibres.deLaCarte($gameMap.mapId());
        // le décor le plus haut à l'écran sous la souris
        var vise = ss._decors.slice().reverse().filter(function (s) {
            if (s === ss._dlApercu || !s.bitmap.isReady()) return false;
            var b = s.getBounds(); return ecranX >= b.x && ecranX <= b.x + b.width && ecranY >= b.y && ecranY <= b.y + b.height;
        })[0];
        if (!vise) return null;
        var i = l.indexOf(vise._decor);
        if (i >= 0) l.splice(i, 1);
        ss.retirerDecor(vise._decor);
        return vise._decor;
    };
    DecorsLibres.annuler = function () {
        var d = E.poses.pop();
        if (!d) return;
        var l = DecorsLibres.deLaCarte($gameMap.mapId()), i = l.indexOf(d);
        if (i >= 0) l.splice(i, 1);
        SceneManager._scene._spriteset.retirerDecor(d);
    };
    DecorsLibres.texte = function () {
        var o = {};
        Object.keys(DecorsLibres.donnees).forEach(function (k) { if (DecorsLibres.donnees[k].length) o[k] = DecorsLibres.donnees[k]; });
        return JSON.stringify(o, null, 1);
    };
    DecorsLibres.enregistrer = function () {
        var info = DecorsLibres._panneau && DecorsLibres._panneau.querySelector('#dl-info'), t = DecorsLibres.texte();
        try {
            var fs = require('fs'), path = require('path');
            fs.writeFileSync(path.join(path.dirname(process.mainModule.filename), 'data', 'Decors.json'), t);
            if (info) info.textContent = '✔ data/Decors.json enregistré.';
            return 'disque';
        } catch (e) {
            var ta = DecorsLibres._panneau && DecorsLibres._panneau.querySelector('#dl-texte');
            if (ta) { ta.style.display = 'block'; ta.value = t; ta.select(); }
            if (info) info.textContent = 'Pas d\'accès au disque ici : copie ce texte dans data/Decors.json.';
            return 'texte';
        }
    };

    // Ctrl+D, la souris sur la carte, l'aperçu qui suit
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && (e.key === 'd' || e.key === 'D')) {
            if (!enTest()) return;
            e.preventDefault();
            if (DecorsLibres.ouvert) DecorsLibres.fermerEditeur(); else DecorsLibres.ouvrirEditeur();
        }
    });
    // jugé à la POSITION : MV pose sur le canevas un paragraphe vide
    // (ErrorPrinter) qui reçoit les clics à sa place
    function surLeJeu(e) {
        if (e.target && e.target.closest && e.target.closest('#decors-libres')) return false;
        var x = Graphics.pageToCanvasX(e.pageX), y = Graphics.pageToCanvasY(e.pageY);
        return Graphics.isInsideCanvas(x, y);
    }
    function position(e) { return { x: Graphics.pageToCanvasX(e.pageX), y: Graphics.pageToCanvasY(e.pageY) }; }
    document.addEventListener('mousedown', function (e) {
        if (!DecorsLibres.ouvert || !surLeJeu(e) || !(SceneManager._scene instanceof Scene_Map)) return;
        var p = position(e);
        if (e.button === 0) DecorsLibres.poser(p.x, p.y);
        else if (e.button === 2) DecorsLibres.enlever(p.x, p.y);
    }, true);
    document.addEventListener('mousemove', function (e) { DecorsLibres._souris = position(e); });
    document.addEventListener('contextmenu', function (e) { if (DecorsLibres.ouvert) e.preventDefault(); });
    var _smu = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        _smu.call(this);
        var a = this._dlApercu, s = DecorsLibres._souris;
        if (a && s) {
            var c = versCarte(s.x, s.y);
            a._decor.x = c.x; a._decor.y = c.y; a._decor.echelle = E.echelle; a._decor.miroir = E.miroir;
            a.appliquer(); a.opacity = 160;
        }
    };
    // pendant l'édition, un clic pose un décor : le joueur ne part pas marcher
    var _pmt = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function () { if (!DecorsLibres.ouvert) _pmt.call(this); };
    // … et le clic droit (qui enlève un décor) n'ouvre pas le menu
    var _imc = Scene_Map.prototype.isMenuCalled;
    Scene_Map.prototype.isMenuCalled = function () { return !DecorsLibres.ouvert && _imc.call(this); };
    var _term = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function () {
        _term.call(this);
        if (DecorsLibres.ouvert && !SceneManager.isNextScene(Scene_Map)) DecorsLibres.fermerEditeur();
        else if (DecorsLibres.ouvert) DecorsLibres.choisir('');
    };
    var _start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _start.call(this);
        if (DecorsLibres.ouvert && DecorsLibres._panneau) DecorsLibres._panneau.querySelector('#dl-carte').textContent = $gameMap.mapId();
    };
})();
