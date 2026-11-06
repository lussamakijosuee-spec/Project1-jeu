//=============================================================================
// EvenementsPlus.js — v1.0  ·  Des événements qui se réutilisent
// RPG Maker MV   ·   pour JOKO
//   Inspiré, sans rien en copier, de Event Copier, Event Morpher, Event
//   Spawner, Call Event, Self Switches & Variables, Event Mini Label, Event
//   Hitbox Resize, Slippery Tiles et Footstep Sounds (Yanfly).
//   Rien ne change tant qu'on n'emploie pas une balise ou une commande.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Modèles d'événements, appeler un autre événement,
 * variables locales, étiquettes au-dessus des PNJ, gros événements, sols glissants, bruits de pas.
 * @author JOKO
 *
 * @param cartesModeles
 * @text Cartes de modèles
 * @default 70
 * @desc Numéros des cartes où piocher les modèles, séparés par des virgules. 70 = la vitrine des recettes.
 *
 * @param distanceEtiquette
 * @text Distance d'affichage des étiquettes (cases)
 * @type number
 * @min 1
 * @default 4
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  DES ÉVÉNEMENTS QUI SE RÉUTILISENT
 * ═══════════════════════════════════════════════════════════════════════════
 *  ── MODÈLES (une fois écrit, partout) ─────────────────────────────────
 *  Dans la NOTE d'un événement :   <Modèle: 70, 123>
 *  → il prend les pages (image, commandes, conditions) de l'événement 123 de
 *  la carte 70. La vitrine (carte 70) est pleine de recettes prêtes : un
 *  coffre, une porte, un marchand… Corrige le modèle : tous ses exemplaires
 *  changent. Pour avoir ta propre carte de modèles, ajoute son numéro au
 *  paramètre « Cartes de modèles ».
 *
 *      MODELE changer 5 70 123     l'événement 5 devient le modèle 123 (gardé
 *                                  dans la sauvegarde) · MODELE changer 5 off
 *      MODELE poser 70 123 12 8    pose une copie du modèle en 12,8 (jusqu'au
 *                                  prochain changement de carte)
 *
 *  ── APPELER UN AUTRE ÉVÉNEMENT ─────────────────────────────────────────
 *      APPEL 7          joue la page active de l'événement 7, puis revient
 *      APPEL 7 2        joue sa page 2
 *      APPEL 7 2 70     la page 2 de l'événement 7 de la carte 70 (modèle)
 *  Comme un événement commun, mais écrit sur la carte, à côté du reste.
 *
 *  ── VARIABLES LOCALES (propres à un événement) ────────────────────────
 *      LOCALE visites + 1          LOCALE humeur = 3        LOCALE x - 2
 *  Condition (Script) :  this.locale('visites') >= 3
 *  Texte : \lv[visites]. Chaque événement a les siennes, comme les
 *  interrupteurs locaux, mais avec des nombres et autant qu'on veut.
 *
 *  ── UNE PAGE QUI NE COMPTE QUE SI… ────────────────────────────────────
 *  Un commentaire dans la page :   <si: v[3] >= 5>
 *  → la page ne compte que si c'est vrai, EN PLUS des cases de l'éditeur,
 *  et sans la limite de deux interrupteurs. s[n] interrupteur, v[n]
 *  variable, ss[A] interrupteur local, lv[nom] variable locale de
 *  l'événement, ou du JavaScript. Plusieurs <si:> : toutes doivent être vraies.
 *      <si: lv[visites] >= 3>       le PNJ change de page à la 3e visite
 *      <si: s[12] && !s[13]>        après la lettre, avant le duel
 *  La page se réévalue quand un interrupteur, une variable, une variable
 *  locale ou l'inventaire change. Une condition illisible ferme la page
 *  (et le dit dans la console, F8).
 *
 *  ── ÉTIQUETTES AU-DESSUS DES PNJ ──────────────────────────────────────
 *  Note de l'événement, ou commentaire dans la page active :
 *      <Étiquette: Forgeron>        <Étiquette: \c[6]Auberge>
 *  Le nom apparaît quand le joueur s'approche (4 cases) et s'efface quand il
 *  s'éloigne. Un commentaire suit la page : il peut changer avec elle.
 *
 *  ── GROS ÉVÉNEMENTS ───────────────────────────────────────────────────
 *  Note :  <Taille: 3x2>  → l'événement occupe 3 cases de large et 2 de haut
 *  (centré en bas, comme son image) : on le touche et il bloque partout.
 *  Pour un dragon, un chariot, un portail.
 *
 *  ── SOLS GLISSANTS ────────────────────────────────────────────────────
 *  Note de la CARTE :  <Glissant: 5>  (ou <Glissant: 5, 6>) → sur les cases
 *  de région 5, le joueur glisse jusqu'à heurter quelque chose. Pour la glace.
 *
 *  ── CLIQUER SUR UN ÉVÉNEMENT ──────────────────────────────────────────
 *  Note de l'événement, ou commentaire de la page :   <Clic>
 *  → un clic (ou un toucher) dessus le lance tout de suite, sans que le
 *  joueur ait à marcher jusqu'à lui. Pour un panneau, un objet du décor,
 *  un PNJ de l'autre côté d'un comptoir.
 *
 *  ── DÉCALER L'IMAGE D'UN ÉVÉNEMENT ────────────────────────────────────
 *  Note ou commentaire :   <Décalage: 0, -12>
 *  → l'image se dessine 0 px plus à droite et 12 px plus haut (négatif =
 *  gauche / haut). Pour un tableau accroché, un objet posé sur une table.
 *  La case de l'événement, elle, ne bouge pas.
 *
 *  ── SE DÉCLENCHER QUAND LE JOUEUR ENTRE DANS UNE RÉGION ───────────────
 *  Note ou commentaire :   <Région: 5>     (ou <Région: 5, 6>)
 *  → l'événement se lance chaque fois que le joueur pose le pied sur une
 *  case de la région 5, où qu'elle soit sur la carte. Pour une alarme, un
 *  piège, un dialogue au seuil d'une zone. (Un interrupteur local pour
 *  qu'il ne se joue qu'une fois.)
 *
 *  ── LE CHRONOMÈTRE ────────────────────────────────────────────────────
 *      CHRONO pause            le chronomètre s'arrête, sans se remettre à 0
 *      CHRONO reprendre        il repart d'où il en était
 *      CHRONO ajouter 30       30 secondes de plus
 *      CHRONO retirer 10       10 secondes de moins
 *  (On le lance toujours avec « Contrôle du chronomètre » de l'éditeur.)
 *
 *  ── BRUITS DE PAS ─────────────────────────────────────────────────────
 *  Note de la CARTE :  <Pas: Footstep-middle>  → un son à chaque pas du joueur.
 *  Par région :  <Pas région 3: Footstep-low>  (un pas plus sourd sur la région 3).
 *  Volume réglé sur les « Sons » du menu Options.
 */
var EvenementsPlus = window.EvenementsPlus || {};
window.EvenementsPlus = EvenementsPlus;
(function () {
    'use strict';
    var P = PluginManager.parameters('EvenementsPlus');
    var CARTES = String(P.cartesModeles || '70').split(/[,\s]+/).map(Number).filter(function (n) { return n > 0; });
    var DIST = Math.max(1, Number(P.distanceEtiquette || 4));

    //=========================================================================
    // Les cartes de modèles, chargées au démarrage
    //=========================================================================
    var MODELES = {};
    EvenementsPlus.modeles = MODELES;
    CARTES.forEach(function (id) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/Map' + String(id).padStart(3, '0') + '.json');
        xhr.overrideMimeType('application/json');
        xhr.onload = function () {
            if (xhr.status >= 400) return;
            try {
                var m = JSON.parse(xhr.responseText);
                // comme MV au chargement d'une carte : la « meta » des notes
                // (GALV_ActionIndicators et d'autres la lisent dès la création)
                DataManager.extractMetadata(m);
                (m.events || []).forEach(function (e) { if (e) DataManager.extractMetadata(e); });
                MODELES[id] = m;
            } catch (e) { }
        };
        xhr.send();
    });
    EvenementsPlus.pret = function () { return CARTES.every(function (id) { return !!MODELES[id]; }); };
    var _isReady = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function () { return _isReady.call(this) && (EvenementsPlus.pret() || Date.now() - (this._epT0 || (this._epT0 = Date.now())) > 8000); };

    function modele(carte, id) {
        var m = carte === $gameMap.mapId() ? $dataMap : MODELES[carte];
        return m && m.events && m.events[id] ? m.events[id] : null;
    }
    function lireModele(note) {
        var m = /<Mod[eè]le\s*:\s*(\d+)\s*,\s*(\d+)\s*>/i.exec(note || '');
        return m ? { carte: Number(m[1]), id: Number(m[2]) } : null;
    }
    function morphes() { return ($gameSystem._epMorphes = $gameSystem._epMorphes || {}); }

    // l'événement tel que le jeu le voit : ses pages, ou celles de son modèle
    var _event = Game_Event.prototype.event;
    Game_Event.prototype.event = function () {
        var e = _event.call(this);
        if (!e) return e;
        // appelé des dizaines de fois par image : la note n'est lue qu'une fois
        if (this._epNoteLue !== e) { this._epNoteLue = e; this._epRef = lireModele(e.note); this._epCleMorphe = this._mapId + ':' + this._eventId; }
        var f = $gameSystem && $gameSystem._epMorphes && $gameSystem._epMorphes[this._epCleMorphe];
        var ref = f || this._epRef;
        if (!ref) return e;
        var cle = ref.carte + ':' + ref.id;
        if (this._epCle !== cle) {
            var t = modele(ref.carte, ref.id);
            if (!t) return e;
            this._epCle = cle;
            this._epCopie = { id: e.id, name: e.name, note: e.note + '\n' + (t.note || ''), x: e.x, y: e.y, meta: e.meta || {}, pages: t.pages };
        }
        return this._epCopie;
    };

    //=========================================================================
    // Les variables locales
    //=========================================================================
    function locales() { return ($gameSystem._epLocales = $gameSystem._epLocales || {}); }
    Game_Interpreter.prototype.locale = function (nom, carte, ev) {
        var v = locales()[(carte || this._mapId) + ':' + (ev || this._eventId) + ':' + nom];
        return v === undefined ? 0 : v;
    };
    var _convLV = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function (text) {
        text = String(text).replace(/\\lv\[([^\]]+)\]/gi, function (a, n) {
            var it = $gameMap._interpreter;
            return it ? it.locale(n.trim()) : 0;
        });
        return _convLV.call(this, text);
    };

    //=========================================================================
    // Les conditions de page : <si: …> dans un commentaire de la page
    //=========================================================================
    EvenementsPlus.locale = function (ev, nom) {
        var v = locales()[ev._mapId + ':' + ev._eventId + ':' + nom];
        return v === undefined ? 0 : v;
    };
    function compiler(expr) {
        var js = String(expr)
            .replace(/\bss\[\s*([A-D])\s*\]/gi, function (a, l) { return '$gameSelfSwitches.value([ev._mapId, ev._eventId, "' + l.toUpperCase() + '"])'; })
            .replace(/\blv\[\s*([^\]]+?)\s*\]/g, function (a, n) { return 'EvenementsPlus.locale(ev, ' + JSON.stringify(n) + ')'; })
            .replace(/\bs\[\s*(\d+)\s*\]/g, '$gameSwitches.value($1)')
            .replace(/\bv\[\s*(\d+)\s*\]/g, '$gameVariables.value($1)');
        var f;
        try { f = new Function('ev', 'return (' + js + ');'); }
        catch (e) { console.warn('[EvenementsPlus] condition de page illisible : <si: ' + expr + '>'); return function () { return false; }; }
        return function (ev) {
            try { return !!f.call(ev, ev); }
            catch (e) { console.warn('[EvenementsPlus] condition de page en erreur : <si: ' + expr + '> — ' + e.message); return false; }
        };
    }
    // Les balises <nom: expression> d'un texte. L'expression peut contenir « > »
    // (v[3] >= 2) : elle va jusqu'au DERNIER « > » avant la balise suivante,
    // ou avant la fin du texte. ([^>]+ s'arrêtait au « > » de « >= » : la
    // condition devenait « v[3] », vraie dès que la variable n'était pas nulle.)
    function balises(texte, noms) {
        var re = new RegExp('<\\s*(' + noms + ')\\s*:', 'gi'), m, debuts = [], out = [];
        while ((m = re.exec(texte))) debuts.push({ i: m.index, apres: re.lastIndex, nom: m[1].toLowerCase() });
        debuts.forEach(function (d, k) {
            var bout = k + 1 < debuts.length ? debuts[k + 1].i : texte.length;
            var f = texte.lastIndexOf('>', bout - 1);
            if (f >= d.apres) out.push({ nom: d.nom, expr: texte.slice(d.apres, f).trim(), debut: d.i, fin: f + 1 });
        });
        return out;
    }
    function conditionsDe(page) {
        if (page._epSi) return page._epSi;
        var l = [];
        (page.list || []).forEach(function (c) {
            if (c.code !== 108 && c.code !== 408) return;
            balises(String(c.parameters[0] || ''), 'si').forEach(function (b) { l.push(compiler(b.expr)); });
        });
        // non énumérable : une copie JSON de la page (MODELE poser) ne l'emporte pas
        Object.defineProperty(page, '_epSi', { value: l, configurable: true, writable: true });
        return l;
    }
    EvenementsPlus.conditionsDe = conditionsDe;
    var _meets = Game_Event.prototype.meetsConditions;
    Game_Event.prototype.meetsConditions = function (page) {
        if (!_meets.call(this, page)) return false;
        var l = conditionsDe(page);
        for (var i = 0; i < l.length; i++) if (!l[i](this)) return false;
        return true;
    };

    //=========================================================================
    // <Clic>, <Décalage: x, y>, <Région: n> : dans la note, ou en commentaire
    // de la page active (alors ils suivent la page)
    //=========================================================================
    function balisePage(ev, re) {
        var e = ev.event(), p = ev.page(), m;
        if (p && p.list) {
            for (var i = 0; i < p.list.length; i++) {
                var c = p.list[i];
                if ((c.code === 108 || c.code === 408) && (m = re.exec(String(c.parameters[0] || '')))) return m;
            }
        }
        return e && e.note ? re.exec(e.note) : null;
    }
    // relu seulement quand la page change : ces fonctions tournent à chaque image
    function balisesEv(ev) {
        if (ev._epBal && ev._epBalIdx === ev._pageIndex) return ev._epBal;
        var p = ev.page();
        var d = balisePage(ev, /<\s*D[ée]calage\s*:\s*(-?\d+)\s*,\s*(-?\d+)\s*>/i);
        var r = balisePage(ev, /<\s*R[ée]gion\s*:\s*([\d\s,]+)>/i);
        ev._epBalIdx = ev._pageIndex;
        ev._epBal = { clic: !!balisePage(ev, /<\s*Clic\s*>/i), dx: d ? Number(d[1]) : 0, dy: d ? Number(d[2]) : 0,
            regions: r ? r[1].split(/[\s,]+/).filter(Boolean).map(Number) : [] };
        return ev._epBal;
    }
    EvenementsPlus.balises = balisesEv;
    var _sx = Game_Event.prototype.screenX;
    Game_Event.prototype.screenX = function () { return _sx.call(this) + (this._pageIndex >= 0 ? balisesEv(this).dx : 0); };
    var _sy = Game_Event.prototype.screenY;
    Game_Event.prototype.screenY = function () { return _sy.call(this) + (this._pageIndex >= 0 ? balisesEv(this).dy : 0); };

    var _pmt = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function () {
        if (TouchInput.isTriggered() && !$gameMap.isEventRunning() && $gamePlayer.canMove()) {
            var x = $gameMap.canvasToMapX(TouchInput.x), y = $gameMap.canvasToMapY(TouchInput.y);
            var ev = $gameMap.eventsXy(x, y).filter(function (e) { return e.page() && e.list().length > 1 && balisesEv(e).clic; })[0];
            if (ev) { $gameTemp.clearDestination(); ev.start(); return; }
        }
        _pmt.call(this);
    };

    var _ceth = Game_Player.prototype.checkEventTriggerHere;
    Game_Player.prototype.checkEventTriggerHere = function (triggers) {
        _ceth.call(this, triggers);
        // seulement en arrivant sur une case (MV passe [1, 2]), pas sur la touche OK ([0])
        if ($gameMap.isEventRunning() || !triggers || triggers.indexOf(1) < 0) return;
        var r = this.regionId();
        if (!r) return;
        var ev = $gameMap.events().filter(function (e) { return e.page() && e.list().length > 1 && balisesEv(e).regions.indexOf(r) >= 0; })[0];
        if (ev) ev.start();
    };

    //=========================================================================
    // Les commandes
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pc.call(this, command, args);
        var c = String(command || '').toUpperCase();
        if (c === 'APPEL') {
            var ev = Number(args[0]) || this._eventId, page = Number(args[1]) || 0, carte = Number(args[2]) || 0;
            var liste = null;
            if (carte && carte !== $gameMap.mapId()) {
                var t = modele(carte, ev);
                if (t) liste = (t.pages[(page || 1) - 1] || t.pages[0]).list;
            } else {
                var e = $gameMap.event(ev);
                if (e) liste = page ? (e.event().pages[page - 1] || {}).list : (e.page() ? e.page().list : null);
            }
            if (liste) this.setupChild(liste, this._eventId);
            else console.warn('[EvenementsPlus] APPEL : rien à jouer pour ' + args.join(' '));
        } else if (c === 'LOCALE') {
            var nom = String(args[0] || ''), op = String(args[1] || '='), val = Number(args[2]) || 0;
            var k = this._mapId + ':' + this._eventId + ':' + nom, L = locales(), v = L[k] || 0;
            L[k] = op === '+' ? v + val : op === '-' ? v - val : op === '*' ? v * val : val;
            $gameMap.requestRefresh();   // une page <si: lv[…]> peut changer
        } else if (c === 'CHRONO') {
            var t = $gameTimer, sous2 = String(args[0] || '').toLowerCase(), sec = Number(args[1]) || 0;
            if (sous2 === 'pause') t._working = false;
            else if (sous2 === 'reprendre') t._working = t._frames > 0;
            else if (sous2 === 'ajouter') t._frames = Math.max(0, t._frames + sec * 60);
            else if (sous2 === 'retirer') t._frames = Math.max(0, t._frames - sec * 60);
        } else if (c === 'MODELE' || c === 'MODÈLE') {
            var sous = String(args[0] || '').toLowerCase();
            if (sous === 'changer') {
                var id = Number(args[1]), cle = $gameMap.mapId() + ':' + id;
                if (/^off$/i.test(args[2])) delete morphes()[cle];
                else morphes()[cle] = { carte: Number(args[2]), id: Number(args[3]) };
                var cible = $gameMap.event(id);
                // MV ne refait la page que si son numéro change : on l'y oblige
                if (cible) { cible._epCle = null; cible._epBal = null; cible._pageIndex = -2; cible.refresh(); }
            } else if (sous === 'poser') {
                EvenementsPlus.poser(Number(args[1]), Number(args[2]), Number(args[3]), Number(args[4]));
            }
        }
    };

    // une copie posée sur la carte (Event Spawner)
    EvenementsPlus.poser = function (carte, idModele, x, y) {
        var t = modele(carte, idModele);
        if (!t) return null;
        var id = Math.max($dataMap.events.length, $gameMap._events.length);
        var data = JSON.parse(JSON.stringify(t));
        data.id = id; data.x = x; data.y = y;
        $dataMap.events[id] = data;
        var ev = new Game_Event($gameMap.mapId(), id);
        $gameMap._events[id] = ev;
        var s = SceneManager._scene;
        if (s instanceof Scene_Map && s._spriteset) {
            var sp = new Sprite_Character(ev);
            s._spriteset._characterSprites.push(sp);
            s._spriteset._tilemap.addChild(sp);
        }
        return ev;
    };

    //=========================================================================
    // Les étiquettes
    //=========================================================================
    function etiquetteDe(ev) {
        var p = ev.page && ev.page();
        if (p) {
            for (var i = 0; i < p.list.length; i++) {
                var c = p.list[i];
                if (c.code !== 108 && c.code !== 408) { if (i > 0) break; else continue; }
                var m = /<[ÉE]tiquette\s*:\s*([^>]+)>/i.exec(c.parameters[0]);
                if (m) return m[1].trim();
            }
        }
        var n = /<[ÉE]tiquette\s*:\s*([^>]+)>/i.exec((ev.event() && ev.event().note) || '');
        return n ? n[1].trim() : '';
    }
    var _scu = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function () {
        _scu.call(this);
        var c = this._character;
        if (!(c instanceof Game_Event)) return;
        if (c._epEtiq === undefined || c._epEtiqPage !== c._pageIndex) { c._epEtiqPage = c._pageIndex; c._epEtiq = etiquetteDe(c); }
        if (!c._epEtiq) { if (this._epEtiq) this._epEtiq.visible = false; return; }
        if (!this._epEtiq) {
            this._epEtiq = new Sprite(new Bitmap(240, 28));
            this._epEtiq.anchor.x = 0.5; this._epEtiq.anchor.y = 1; this._epEtiq.opacity = 0;
            this.addChild(this._epEtiq);
        }
        var e = this._epEtiq;
        if (e._texte !== c._epEtiq) {
            e._texte = c._epEtiq;
            var w = new Window_Base(0, 0, 1, 1);   // pour les codes (\c, \i)
            e.bitmap.clear();
            var b = e.bitmap; b.fontSize = 18; b.outlineWidth = 4;
            var brut = w.convertEscapeCharacters(c._epEtiq), couleur = '#ffffff', m = /\x1bC\[(\d+)\]/i.exec(brut);
            if (m) couleur = w.textColor(Number(m[1]));
            b.textColor = couleur;
            b.drawText(brut.replace(/\x1b[A-Z]+\[\d+\]/gi, ''), 0, 0, 240, 28, 'center');
        }
        var d = Math.abs($gamePlayer.x - c.x) + Math.abs($gamePlayer.y - c.y);
        var but = (d <= DIST && !c.isTransparent() && !c._erased) ? 255 : 0;
        e.opacity += but > e.opacity ? 24 : (but < e.opacity ? -24 : 0);
        e.visible = e.opacity > 0;
        e.y = -(this.patternHeight ? this.patternHeight() : 48);
    };

    //=========================================================================
    // Les gros événements
    //=========================================================================
    function taille(ev) {
        if (ev._epTaille === undefined) {
            var m = /<Taille\s*:\s*(\d+)\s*x\s*(\d+)\s*>/i.exec((ev.event() && ev.event().note) || '');
            ev._epTaille = m ? { l: Number(m[1]), h: Number(m[2]) } : null;
        }
        return ev._epTaille;
    }
    var _pos = Game_Event.prototype.pos;
    Game_Event.prototype.pos = function (x, y) {
        var t = taille(this);
        if (!t) return _pos.call(this, x, y);
        var g = this.x - Math.floor((t.l - 1) / 2);
        return x >= g && x < g + t.l && y <= this.y && y > this.y - t.h;
    };

    //=========================================================================
    // Les sols glissants et les bruits de pas (notes de la carte)
    //=========================================================================
    function noteCarte() { return ($dataMap && $dataMap.note) || ''; }
    function regionsGlissantes() {
        if ($gameMap._epGlisseCarte !== $gameMap.mapId()) {
            $gameMap._epGlisseCarte = $gameMap.mapId();
            var m = /<Glissant\s*:\s*([\d,\s]+)>/i.exec(noteCarte());
            $gameMap._epGlisse = m ? m[1].split(',').map(Number) : [];
        }
        return $gameMap._epGlisse;
    }
    EvenementsPlus.glissant = function (x, y) {
        var r = regionsGlissantes();
        return r.length > 0 && r.indexOf($gameMap.regionId(x, y)) >= 0;
    };
    var _unm = Game_Player.prototype.updateNonmoving;
    Game_Player.prototype.updateNonmoving = function (wasMoving) {
        if (wasMoving && EvenementsPlus.glissant(this.x, this.y) && !$gameMap.isEventRunning() && !this.isMoveRouteForcing()) {
            this.moveStraight(this.direction());
            if (this.isMovementSucceeded()) { this._epGlisse = true; return; }
        }
        this._epGlisse = false;
        _unm.call(this, wasMoving);
    };
    var _anime = Game_Player.prototype.updateAnimation;
    Game_Player.prototype.updateAnimation = function () {
        if (this._epGlisse) { this._pattern = 1; this._animationCount = 0; return; }   // on glisse, on ne marche pas
        _anime.call(this);
    };

    function sonDesPas(x, y) {
        var n = noteCarte(), r = $gameMap.regionId(x, y);
        var m = new RegExp('<Pas r[ée]gion ' + r + '\\s*:\\s*([^>]+)>', 'i').exec(n) || /<Pas\s*:\s*([^>]+)>/i.exec(n);
        return m ? m[1].trim() : '';
    }
    var _inc = Game_Player.prototype.increaseSteps;
    Game_Player.prototype.increaseSteps = function () {
        _inc.call(this);
        if (this._epGlisse) return;
        var s = sonDesPas(this.x, this.y);
        if (s) AudioManager.playSe({ name: s, volume: 35, pitch: 90 + Math.randomInt(21), pan: 0 });
    };
})();
