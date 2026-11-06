//=============================================================================
// AlleesEtVenues.js — v1.0  ·  On va vraiment quelque part
// RPG Maker MV   ·   pour JOKO
//   À charger APRÈS Habitants, VieDuVillage et EvenementsPlus.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Un PNJ qui quitte sa carte arrive sur l'autre : au bar,
 * au quai, à l'étage de l'auberge. On le croise en chemin, sur les cartes
 * qu'il traverse.
 * @author pour JOKO
 *
 * @param actif
 * @text Les PNJ voyagent ?
 * @type boolean
 * @default true
 *
 * @param cartes
 * @text Cartes du voyage
 * @type string
 * @default 29,30,31,33,37,38,39,40,41,42,43,44,45,46
 * @desc Les cartes lues au démarrage : on y cherche les voyageurs et les
 * passages (les transferts) qui relient les cartes entre elles.
 *
 * @param minutesParCarte
 * @text Minutes de jeu pour traverser une carte
 * @type number
 * @min 1
 * @default 10
 * @desc Une heure de jeu dure deux minutes réelles : dix minutes de jeu, c'est
 * vingt secondes pour traverser la ville.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  ON VA VRAIMENT QUELQUE PART
 * ═══════════════════════════════════════════════════════════════════════════
 *  Avant, un PNJ qui « partait au bar » entrait dans la porte et disparaissait.
 *  Il n'arrivait nulle part. Maintenant :
 *    · il sort de sa carte par le bon passage ;
 *    · sur chaque carte qu'il traverse, on le voit entrer d'un côté et
 *      ressortir de l'autre ;
 *    · il arrive à destination, s'y installe, et il y PARLE : c'est le même
 *      personnage, avec ses répliques, sa mémoire, ses interrupteurs locaux ;
 *    · à son heure, il repart, et le même chemin le ramène chez lui.
 *
 *  Aucun événement n'est ajouté sur les cartes : sa copie de passage est faite
 *  en jeu, depuis son événement à lui. Si JOKO change ses répliques, la copie
 *  les dit aussi.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  OÙ VA-T-IL ? — un COMMENTAIRE sur sa page
 *  ─────────────────────────────────────────────────────────────────────────
 *    <Va: 18-21 46>              de 18 h à 21 h, il est au bar (carte 46),
 *                                à une place libre choisie une fois pour toutes
 *    <Va: 6-13 33 6,37 bas>      de 6 h à 13 h, au quai du Village de Pêche,
 *                                tourné vers l'eau (haut, bas, gauche, droite)
 *    <Va: 6-13 33 6,37 bas peche>   … et il y pêche (VieDuVillage le montre)
 *    <Va: 18-21 33 33,31 1/3>    un soir sur trois seulement
 *    <Va: 6-18 49 1/3 2j>        un jour sur trois, il part à 6 h et ne revient
 *                                que le lendemain à 18 h (deux jours)
 *    <Va: 22-7 45 5,5>           la nuit, à l'étage
 *    <Va: 22-7 45 3,10>          … si la case est une PORTE (une chambre), il
 *                                y entre et disparaît ; le matin il en ressort
 *  Plusieurs à la suite, séparées par « ; » : la première qui tombe gagne.
 *
 *  Un agenda de VieDuVillage vers une PORTE qui mène ailleurs compte aussi :
 *      <Soiree: 14,32>  (la porte du bar)  →  il est au bar de 18 h à 21 h.
 *
 *  <Est: 29:28>  sur la page d'un événement de la carte d'arrivée : cette page,
 *      c'est déjà lui (l'épicerie, le matin, c'est Hilde) — pas de copie.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  SA MAISON (JOKO, 2026-10-30 : « aller dans la porte, sortir dehors, aller
 *  vers leur maison quand c'est l'heure », « comme dans Stardew Valley »)
 *  ─────────────────────────────────────────────────────────────────────────
 *    <Logis: 29 15,14>         sa maison est la porte 15,14 de la Ville
 *                              Forestière : hors de ses heures (<Horaire:>),
 *                              il sort par la porte, traverse dehors, et y entre
 *    <Logis: 29 15,14 21-6>    … de 21 h à 6 h, dit en clair
 *    <Logis: 45>               il dort à l'étage de l'auberge (une place libre)
 *    <Logis: 39 2-15>          à la caserne (la Maison de Village du Marché)
 *  Une porte sans intérieur (« une maison fermée à clé ») est une maison : on y
 *  entre, on disparaît derrière, on en ressort à l'heure.
 *
 *  SCRIPT :  AlleesEtVenues.etat()       → chaque voyageur, où il est
 *            AlleesEtVenues.ou('29:38')  → où est Colette, là, maintenant
 *            AlleesEtVenues.pret()       → les cartes sont lues
 * ═══════════════════════════════════════════════════════════════════════════
 */
var AlleesEtVenues = window.AlleesEtVenues || {};
window.AlleesEtVenues = AlleesEtVenues;
(function () {
    'use strict';
    var P = PluginManager.parameters('AlleesEtVenues');
    var ACTIF = String(P['actif'] || 'true') === 'true';
    var CARTES = String(P['cartes'] || '').split(',').map(function (x) { return parseInt(x, 10); }).filter(function (x) { return x > 0; });
    var T = Math.max(1, parseInt(P['minutesParCarte'] || 10, 10));
    var DIRS = { bas: 2, gauche: 4, droite: 6, haut: 8 };

    /* ── le temps : des minutes absolues, jour après jour ─────────────────── */
    function jourAbs() {
        if ($gameSystem && $gameSystem.total_days) { try { return $gameSystem.total_days(); } catch (e) {} }
        return $gameSystem && $gameSystem.day ? $gameSystem.day() : 1;
    }
    function maintenant() {
        var h = $gameSystem && $gameSystem.hour ? $gameSystem.hour() : 12;
        var m = $gameSystem && $gameSystem.minute ? $gameSystem.minute() : 0;
        return jourAbs() * 1440 + h * 60 + (m || 0);
    }
    AlleesEtVenues.maintenant = maintenant;
    // un nombre stable par personne, pour que « un soir sur trois » ne tombe pas
    // le même soir pour tout le monde
    function graine(cle) { var s = 0; for (var i = 0; i < cle.length; i++) s = (s * 31 + cle.charCodeAt(i)) % 9973; return s; }

    /* ── lire les cartes au démarrage ─────────────────────────────────────── */
    var cartes = {};          // id → { transferts: [], est: { cle: [pages] } }
    var voyageurs = [];       // { cle, carte, id, data, sejours }
    var parCle = {};
    var candidats = [];       // lus carte par carte, résolus quand tout est lu
    var aLire = 0, pret = false;
    // une maison sans intérieur : une « carte » qui n'est que l'autre côté de sa porte
    function maison(carte, x, y) { return 100000 + carte * 10000 + y * 100 + x; }
    AlleesEtVenues.maison = maison;
    function estMaison(id) { return id >= 100000; }

    function commentaires(page) {
        return (page.list || []).filter(function (c) { return c.code === 108 || c.code === 408; })
            .map(function (c) { return String(c.parameters[0] || ''); }).join('\n');
    }
    function lireSejours(texte) {
        var out = [];
        var re = /<Va:\s*([^>]+)>/gi, m;
        while ((m = re.exec(texte)) !== null) {
            m[1].split(';').forEach(function (bout) {
                var r = bout.trim().match(/^(\d+)\s*-\s*(\d+)\s+(\d+)(?:\s+(\d+)\s*,\s*(\d+))?(.*)$/);
                if (!r) return;
                var reste = (r[6] || '').toLowerCase(), s = { de: +r[1], a: +r[2], carte: +r[3], x: r[4] !== undefined ? +r[4] : null, y: r[5] !== undefined ? +r[5] : null, dir: 0, activite: null, cycle: null, jours: 1 };
                Object.keys(DIRS).forEach(function (k) { if (new RegExp('\\b' + k + '\\b').test(reste)) s.dir = DIRS[k]; });
                var cy = reste.match(/(\d+)\s*\/\s*(\d+)/); if (cy) s.cycle = { n: +cy[1], sur: Math.max(1, +cy[2]) };
                var j = reste.match(/(\d+)\s*j\b/); if (j) s.jours = Math.max(1, +j[1]);
                var act = reste.match(/\b(peche|forge|lecture|repos)\b/); if (act) s.activite = act[1];
                out.push(s);
            });
        }
        return out;
    }
    // les agendas de VieDuVillage : « <Agenda: 12-14 20,15 ; …> », « <Soiree: 14,32> »
    function lireAgendas(texte) {
        var out = [];
        var g = texte.match(/<Agenda:\s*([^>]+)>/i);
        if (g) g[1].split(';').forEach(function (b) { var r = b.match(/(\d+)\s*-\s*(\d+)\s+(\d+)\s*,\s*(\d+)/); if (r) out.push({ de: +r[1], a: +r[2], x: +r[3], y: +r[4] }); });
        var so = texte.match(/<Soir[ée]e:\s*(\d+)\s*,\s*(\d+)\s*>/i);
        if (so) out.push({ de: 18, a: 21, x: +so[1], y: +so[2] });
        return out;
    }
    function lireCarte(id, m) {
        var c = { id: id, largeur: m.width, hauteur: m.height, transferts: [], est: {}, portes: [] };
        (m.events || []).forEach(function (e) {
            if (!e) return;
            var tr = null;
            var image = e.pages[0] && e.pages[0].image ? String(e.pages[0].image.characterName || '') : '';
            e.pages.forEach(function (p, k) {
                p.list.forEach(function (cmd) {
                    if (cmd.code === 201 && cmd.parameters[0] === 0 && !tr) tr = { x: e.x, y: e.y, vers: cmd.parameters[1], vx: cmd.parameters[2], vy: cmd.parameters[3], ev: e.id };
                });
                var t = commentaires(p), r = /<Est:\s*(\d+)\s*:\s*(\d+)\s*>/gi, mm;
                while ((mm = r.exec(t)) !== null) { var k2 = mm[1] + ':' + mm[2]; (c.est[k2] = c.est[k2] || []).push({ ev: e.id, page: k }); }
            });
            if (tr) c.transferts.push(tr);
            else if (/door/i.test(image)) c.portes.push({ x: e.x, y: e.y, ev: e.id });
            if (/^✎/.test(e.name || '')) return;
            var tout = e.pages.map(commentaires).join('\n');
            var s = lireSejours(tout), ag = lireAgendas(tout);
            var lg = tout.match(/<Logis:\s*(\d+)(?:\s+(\d+)\s*,\s*(\d+))?(?:\s+(\d+)\s*-\s*(\d+))?\s*>/i);
            if (s.length || ag.length || lg) candidats.push({ carte: id, e: e, sejours: s, agendas: ag, logis: lg, note: e.note || '' });
        });
        cartes[id] = c;
    }
    // les portes sans intérieur deviennent des maisons : un passage aller, un passage retour
    function poserLesMaisons() {
        Object.keys(cartes).forEach(function (k) {
            var c = cartes[k], id = +k;
            c.portes.forEach(function (p) {
                var mid = maison(id, p.x, p.y);
                var devant = { x: p.x, y: p.y + 1 };            // on sort d'une porte vers le bas, comme le joueur
                c.transferts.push({ x: p.x, y: p.y, vers: mid, vx: 0, vy: 0, ev: p.ev, porte: true });
                cartes[mid] = { id: mid, maison: true, transferts: [{ x: 0, y: 0, vers: id, vx: devant.x, vy: devant.y }], est: {}, portes: [] };
            });
        });
    }
    function sejour(de, a, carte, extra) {
        var s = { de: de, a: a, carte: carte, x: null, y: null, dir: 0, activite: null, cycle: null, jours: 1 };
        Object.keys(extra || {}).forEach(function (k) { s[k] = extra[k]; });
        return s;
    }
    // les heures de sa maison : dites, sinon hors de son <Horaire:>, sinon celles de VieDuVillage
    function heuresDuLogis(x, carte) {
        var lg = x.logis;
        if (lg[4] !== undefined) return [+lg[4], +lg[5]];
        var h = x.note.match(/<Horaire:\s*(\d+)\s*-\s*(\d+)\s*>/i);
        if (h) return [+h[2] % 24, +h[1] % 24];
        if (window.VieDuVillage && VieDuVillage.heuresDuLogis) return VieDuVillage.heuresDuLogis(x.e, carte);
        return [21, 6];
    }
    function resoudre() {
        candidats.forEach(function (x) {
            var c = cartes[x.carte], id = x.carte, sej = x.sejours.slice();
            // un agenda vers une porte qui mène ailleurs : il y va vraiment
            x.agendas.forEach(function (a) {
                var t = c.transferts.filter(function (q) { return q.x === a.x && q.y === a.y && q.vers !== id && !q.porte; })[0];
                if (t) sej.push(sejour(a.de, a.a, t.vers, { agenda: true }));
            });
            if (x.logis) {
                var lc = +x.logis[1], lx = x.logis[2], ly = x.logis[3], dest = lc;
                if (lx !== undefined) {
                    // une porte : celle d'un intérieur (une vraie carte), ou une maison fermée
                    var porte = (cartes[lc] ? cartes[lc].transferts : []).filter(function (q) { return q.x === +lx && q.y === +ly; })[0];
                    // une porte qui ramène sur la même carte (une chambre) : c'est une maison
                    dest = porte && porte.vers !== lc ? porte.vers : maison(lc, +lx, +ly);
                }
                // la même carte, une porte sans intérieur : c'est VieDuVillage qui l'y fait entrer
                if (!(dest === maison(id, +lx, +ly) && lc === id)) {
                    var hh = heuresDuLogis(x, id);
                    if (hh[0] !== hh[1]) sej.push(sejour(hh[0], hh[1], dest, { logis: true }));
                }
            }
            if (!sej.length) return;
            var v = { cle: id + ':' + x.e.id, carte: id, id: x.e.id, nom: x.e.name, data: x.e, sejours: sej, admission: /<Admission>/i.test(x.note) };
            voyageurs.push(v); parCle[v.cle] = v;
        });
        candidats = [];
    }
    function charger() {
        if (!ACTIF || !CARTES.length) { pret = true; return; }
        aLire = CARTES.length;
        CARTES.forEach(function (id) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'data/Map' + String(id).padStart(3, '0') + '.json');
            xhr.overrideMimeType('application/json');
            xhr.onload = function () {
                if (xhr.status < 400) { try { lireCarte(id, JSON.parse(xhr.responseText)); } catch (e) { console.warn('AlleesEtVenues : carte ' + id + ' illisible', e); } }
                if (--aLire === 0) fin();
            };
            xhr.onerror = function () { if (--aLire === 0) fin(); };
            xhr.send();
        });
    }
    function fin() {
        poserLesMaisons();
        resoudre();
        voyageurs.forEach(function (v) { v.sejours.forEach(function (s) {
            var c = cartes[s.carte];
            if (c && s.x !== null && (c.portes.concat(c.transferts)).some(function (q) { return q.x === s.x && q.y === s.y; })) s.porte = true;
        }); });
        // une copie n'a de sens que si sa carte est lue ; et une page <Est:> remplace la copie
        voyageurs.forEach(function (v) {
            v.sejours = v.sejours.filter(function (s) { return !!chemin(v.carte, s.carte); });
        });
        pret = true;
        if ($gameMap && $gameMap.mapId && $gameMap.mapId() > 0) $gameMap._avAPoser = true;
    }
    AlleesEtVenues.pret = function () { return pret; };

    /* ── le chemin d'une carte à l'autre (parcours en largeur) ────────────── */
    var chemins = {};
    function chemin(de, a) {
        var k = de + '>' + a;
        if (chemins[k] !== undefined) return chemins[k];
        var vu = {}, file = [[de]]; vu[de] = true;
        while (file.length) {
            var ch = file.shift(), ici = ch[ch.length - 1];
            if (ici === a) return (chemins[k] = ch);
            var c = cartes[ici];
            if (!c) continue;
            c.transferts.forEach(function (t) { if (!vu[t.vers]) { vu[t.vers] = true; file.push(ch.concat([t.vers])); } });
        }
        return (chemins[k] = null);
    }
    AlleesEtVenues.chemin = chemin;
    function passage(de, vers) {          // le transfert de « de » qui mène à « vers »
        var c = cartes[de]; if (!c) return null;
        return c.transferts.filter(function (t) { return t.vers === vers; })[0] || null;
    }
    // la case où l'on arrive sur « carte » en venant de « depuis »
    function arrivee(depuis, carte) {
        var t = passage(depuis, carte);
        return t ? { x: t.vx, y: t.vy } : null;
    }

    /* ── où est-il ? ──────────────────────────────────────────────────────── */
    // La fenêtre d'un séjour qui couvre l'instant « t » : {debut, fin} en minutes absolues.
    function fenetre(v, s, t) {
        var jour = Math.floor(t / 1440);
        var decalage = (s.jours - 1) + (s.a <= s.de ? 1 : 0);
        for (var d0 = jour; d0 >= jour - decalage - 1; d0--) {
            if (s.cycle && ((d0 + graine(v.cle)) % s.cycle.sur) !== (s.cycle.n - 1) % s.cycle.sur) continue;
            var debut = d0 * 1440 + s.de * 60, fin = d0 * 1440 + decalage * 1440 + s.a * 60;
            if (fin <= debut) fin += 1440;
            var trajet = Math.max(0, (chemin(s.carte, v.carte) || [0, 0]).length - 2) * T + (s.porte ? T : 0);
            if (t >= debut && t < fin + trajet) return { debut: debut, fin: fin, trajet: trajet };
        }
        return null;
    }
    /** Où est ce voyageur à l'instant t ?
     *  Deux séjours qui se suivent (le bar jusqu'à 21 h, puis la caserne) : il va
     *  de l'un à l'autre sans repasser par chez lui. */
    function fenetres(v, t) {
        return v.sejours.map(function (s, i) { var f = fenetre(v, s, t); return f ? { s: s, i: i, f: f } : null; }).filter(Boolean);
    }
    function origine(v, s, f, t) {
        // un autre séjour finit quand celui-ci commence : on part de là-bas
        var avant = fenetres(v, f.debut - 1).filter(function (w) { return w.s !== s && w.f.fin === f.debut; })[0];
        return avant ? avant.s.carte : v.carte;
    }
    function suite(v, s, f) {
        return v.sejours.some(function (s2) { if (s2 === s) return false; var f2 = fenetre(v, s2, f.fin + (s.porte ? T : 0)); return f2 && f2.debut === f.fin + (s.porte ? T : 0); });
    }
    function ou(v, t) {
        t = t === undefined ? maintenant() : t;
        var l = fenetres(v, t);
        // 1. il y est
        for (var a = 0; a < l.length; a++) {
            var w = l[a], s = w.s, f = w.f;
            if (t >= f.debut && t < f.fin) {
                var depart = origine(v, s, f, t), ch0 = chemin(depart, s.carte) || [depart, s.carte], k0 = ch0.length - 2;
                if (t < f.debut + k0 * T) {
                    var n = Math.floor((t - f.debut) / T) + 1;
                    return { etat: 'aller', carte: ch0[n], depuis: ch0[n - 1], vers: ch0[n + 1], sejour: s, fenetre: f, id: w.i + ':' + f.debut + ':a' + n };
                }
                return { etat: 'la', carte: s.carte, depuis: ch0[ch0.length - 2], sejour: s, fenetre: f, id: w.i + ':' + f.debut };
            }
        }
        // 2. il en ressort, ou il rentre chez lui (sauf si un autre séjour prend le relais)
        for (var b = 0; b < l.length; b++) {
            var w2 = l[b], s2 = w2.s, f2 = w2.f;
            if (t < f2.fin) continue;
            var dep2 = origine(v, s2, f2, t), ch = chemin(dep2, s2.carte) || [dep2, s2.carte];
            if (s2.porte && t < f2.fin + T) return { etat: 'sort', carte: s2.carte, depuis: ch[ch.length - 2], sejour: s2, fenetre: f2, id: w2.i + ':' + f2.debut + ':s' };
            if (suite(v, s2, f2)) continue;
            var fin = f2.fin + (s2.porte ? T : 0), inv = (chemin(s2.carte, v.carte) || [s2.carte, v.carte]);
            if (t >= fin + (inv.length - 2) * T) continue;
            var r = Math.floor((t - fin) / T) + 1;
            return { etat: 'retour', carte: inv[r], depuis: inv[r - 1], vers: inv[r + 1], sejour: s2, fenetre: f2, id: w2.i + ':' + f2.debut + ':r' + r };
        }
        return { etat: 'chez lui', carte: v.carte };
    }
    AlleesEtVenues.ou = function (cle) { var v = parCle[cle]; return v ? ou(v) : null; };

    /* ── les copies de passage ────────────────────────────────────────────── */
    // Sur la carte où l'on entre, une copie de chaque voyageur qui peut y passer.
    // Elle n'a de page que quand il est là (Habitants.present).
    var dataVue = null;
    function concerne(v, carte) {
        if (v.carte === carte) return false;
        return v.sejours.some(function (s) {
            if (s.carte === carte) return !estDeja(v, carte);
            var ch = chemin(v.carte, s.carte);
            return !!(ch && ch.indexOf(carte) > 0 && ch.indexOf(carte) < ch.length - 1);
        });
    }
    function estDeja(v, carte) { var c = cartes[carte]; return !!(c && c.est[v.cle]); }
    // une place libre, toujours la même pour la même personne
    function placeLibre(v, carte, depuis) {
        var a = arrivee(depuis, carte) || { x: $gameMap.width() >> 1, y: $gameMap.height() >> 1 };
        var w = $gameMap.width(), h = $gameMap.height(), vu = {}, file = [[a.x, a.y, 0]], bonnes = [];
        vu[a.y * w + a.x] = true;
        while (file.length && bonnes.length < 60) {
            var c = file.shift();
            if (c[2] >= 5 && $gameMap.eventsXy(c[0], c[1]).length === 0 && !deplace(c[0], c[1])) bonnes.push(c);
            [2, 4, 6, 8].forEach(function (d) {
                var nx = $gameMap.roundXWithDirection(c[0], d), ny = $gameMap.roundYWithDirection(c[1], d);
                if (!$gameMap.isValid(nx, ny) || vu[ny * w + nx]) return;
                if (!$gameMap.isPassable(c[0], c[1], d) || !$gameMap.isPassable(nx, ny, 10 - d)) return;
                vu[ny * w + nx] = true; file.push([nx, ny, c[2] + 1]);
            });
        }
        if (!bonnes.length) return a;
        var b = bonnes[(graine(v.cle) * 7) % bonnes.length];
        return { x: b[0], y: b[1] };
    }
    var prises = [];
    function porteDevant(s) { return caseDe({ x: s.x, y: s.y }) || { x: s.x, y: s.y }; }
    function deplace(x, y) { return prises.some(function (p) { return p.x === x && p.y === y; }); }
    // la case d'où l'on part : à côté du passage si on ne peut pas s'y tenir
    function caseDe(t, carte, vers) {
        if (!t) return null;
        var occupe = $gameMap.eventsXy(t.x, t.y).some(function (e) { return e.isNormalPriority(); });
        if (!occupe) return { x: t.x, y: t.y };
        var best = null, d = Infinity;
        [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function (o) {
            var x = t.x + o[0], y = t.y + o[1];
            if (!$gameMap.isValid(x, y) || $gameMap.eventsXy(x, y).length) return;
            if (![2, 4, 6, 8].some(function (dd) { return $gameMap.isPassable(x, y, dd); })) return;
            var dist = Math.abs(x - ($gameMap.width() >> 1)) + Math.abs(y - ($gameMap.height() >> 1));
            if (dist < d) { d = dist; best = { x: x, y: y }; }
        });
        return best || { x: t.x, y: t.y };
    }

    function poserLesCopies(map) {
        dataVue = $dataMap;
        if (!ACTIF || !pret) return;
        var carte = map.mapId();
        prises = [];
        var n = $dataMap.events.length;
        // ⚠ Une copie qu'on pose n'arrive pas à pied : elle est là ou elle n'est pas. Habitants
        //   croyait la carte prête (après un chargement, ou quand les cartes finissent d'être lues),
        //   et la faisait d'abord sortir par la porte : trente copies traversaient la ville.
        var pretAvant = map._habPret;
        map._habPret = false;
        voyageurs.filter(function (v) { return concerne(v, carte); }).forEach(function (v) {
            var id = n++;
            var data = JSON.parse(JSON.stringify(v.data));
            data.id = id;
            data.note = '<Visiteur>';
            DataManager.extractMetadata(data);
            data.x = 0; data.y = 0;
            $dataMap.events[id] = data;
            var ev = new Game_Event(carte, id);
            ev._visite = { cle: v.cle, carte: v.carte, id: v.id, v: v, places: {} };
            // ⚠ Habitants a déjà lu la Note pendant la construction, avant qu'on sache
            //   que c'est une copie : sans relecture, il la croyait immobile, et elle
            //   apparaissait d'un coup au coin de la carte au lieu d'entrer par la porte
            ev._habHoraire = undefined;
            map._events[id] = ev;
            aJour(ev, true);
            ev.refresh();
        });
        map._habPret = pretAvant;
    }
    // la fenêtre a changé : nouvelle place ; et si on ne la voit pas, elle attend là-bas
    function aJour(ev, force) {
        var vis = ev._visite, o = ou(vis.v), id = o.id || 'chez';
        if (!force && vis.fenetre === id) return false;
        vis.fenetre = id;
        if (ev._pageIndex >= 0 && !force) return true;      // elle marche déjà : elle finit son chemin
        placer(ev);
        var d = ev.event();
        if (!ev._habArrivee && !ev._habDepart) ev.locate(d.x, d.y);
        return true;
    }
    // la place de la copie pour la fenêtre en cours : séjour → sa place ; passage → la sortie
    function placer(ev) {
        var vis = ev._visite, v = vis.v, o = ou(v), data = ev.event(), carte = $gameMap.mapId();
        vis.o = o;
        if (o.carte !== carte || o.etat === 'chez lui') return;
        if (o.etat === 'la') {
            var s = o.sejour, k = s.carte + ':' + v.sejours.indexOf(s);
            var p = vis.places[k];
            if (!p) {
                p = s.porte ? porteDevant(s) : s.x !== null ? { x: s.x, y: s.y } : placeLibre(v, carte, o.depuis);
                vis.places[k] = p; prises.push(p);
            }
            data.x = p.x; data.y = p.y;
            vis.entree = arrivee(o.depuis, carte) || p;
            vis.sortieVue = null;
            if (s.dir) data.pages.forEach(function (pg) { pg.image.direction = s.dir; });
        } else if (o.etat === 'sort') {
            // il ressort de sa chambre : il part de devant la porte et marche jusqu'à l'escalier
            var pp = vis.places[o.sejour.carte + ':' + v.sejours.indexOf(o.sejour)] || porteDevant(o.sejour);
            var e2 = arrivee(o.depuis, carte) || pp;
            data.x = e2.x; data.y = e2.y;
            vis.entree = pp;
        } else {
            vis.entree = arrivee(o.depuis, carte);
            var sortie = caseDe(passage(carte, o.vers), carte, o.vers) || vis.entree;
            data.x = sortie.x; data.y = sortie.y;
        }
    }

    var _setupEvents = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function () {
        _setupEvents.call(this);
        poserLesCopies(this);
    };
    // une partie chargée : $dataMap est relu sans les copies, on les repose
    var _creer = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function () {
        if (dataVue !== $dataMap) {
            ($gameMap._events || []).forEach(function (e, i) { if (e && e._visite) $gameMap._events[i] = undefined; });
            poserLesCopies($gameMap);
        }
        _creer.call(this);
    };
    // on ne sauvegarde jamais une copie : au chargement, son événement n'existe plus.
    // ⚠ Pas dans makeSaveContents : MV transforme le contenu en texte APRÈS, dans
    //   saveGameWithoutRescue — les copies remises en place y étaient encore.
    var _save = DataManager.saveGameWithoutRescue;
    DataManager.saveGameWithoutRescue = function (savefileId) {
        var gardes = [], pnj = $gameMap ? $gameMap._viePNJ : null;
        if ($gameMap && $gameMap._events) $gameMap._events.forEach(function (e, i) { if (e && e._visite) { gardes.push([i, e]); $gameMap._events[i] = undefined; } });
        // la liste de VieDuVillage aussi : elle tient les mêmes PNJ (il la refait au chargement)
        if ($gameMap) $gameMap._viePNJ = [];
        try { return _save.call(this, savefileId); }
        finally { gardes.forEach(function (g) { $gameMap._events[g[0]] = g[1]; }); if ($gameMap) $gameMap._viePNJ = pnj; }
    };

    /* ── ce que Habitants demande ─────────────────────────────────────────── */
    /** true / false : la copie est-elle là ? ; false : le voyageur est-il parti ?
     *  null : rien à dire, Habitants décide comme avant. */
    AlleesEtVenues.presence = function (ev) {
        if (!ACTIF || !pret) return ev._visite ? false : null;
        var vis = ev._visite, carte = $gameMap.mapId();
        if (vis) {
            aJour(ev);
            // une recrue de l'Admission n'existe que pendant l'Admission (Habitants)
            if (vis.v.admission && !(window.Habitants && Habitants.admission && Habitants.admission())) return false;
            var o = ou(vis.v);
            if (o.carte !== carte || o.etat === 'chez lui') return false;
            if (o.etat === 'la' && !o.sejour.porte) return true;
            if (o.etat === 'la' && o.sejour.porte && !$gameMap._habPret && vis.vu !== o.id) { vis.vu = o.id; vis.fini = o.id; return false; }   // on arrive : il dort déjà
            // en passage : seulement si on l'a vu entrer, et jusqu'à ce qu'il soit sorti
            if (vis.fini === o.id) return false;
            if (vis.vu !== o.id) return !!$gameMap._habPret && (vis.vu = o.id, true);
            return true;
        }
        var v = parCle[carte + ':' + ev.eventId()];
        if (!v) return null;
        // dehors, VieDuVillage le fait entrer dans la porte lui-même (il reste sur la carte, caché)
        if (window.VieDuVillage && VieDuVillage.cacheLui && VieDuVillage.cacheLui(ev)) return null;
        var oo = ou(v);
        return oo.etat === 'chez lui' ? null : false;
    };
    /** La sortie qu'il prend (ou la porte par où il revient). */
    AlleesEtVenues.sortie = function (ev) {
        if (!pret) return null;
        var vis = ev._visite, carte = $gameMap.mapId();
        if (vis) {
            // il arrive : il apparaît à l'entrée ; il repart : une copie de passage va au bout de son
            // chemin (la sortie, ou là où elle est), une copie installée retourne à la porte d'où elle vient
            if (AlleesEtVenues.presence(ev)) return vis.entree;
            var c = vis.o, passe = c && (c.etat === 'aller' || c.etat === 'retour' || c.etat === 'sort' || (c.etat === 'la' && c.sejour.porte));
            if (passe) { var d = ev.event(); return { x: d.x, y: d.y }; }
            return vis.entree;
        }
        var v = parCle[carte + ':' + ev.eventId()];
        if (!v) return null;
        var oo = ou(v), s = (oo.sejour || dernier(v));
        if (!s) return null;
        var ch = chemin(v.carte, s.carte);
        return ch ? caseDe(passage(carte, ch[1]), carte, ch[1]) : null;
    };
    // le séjour dont il revient (pour rentrer par la bonne porte)
    function dernier(v) {
        var t = maintenant(), best = null, d = Infinity;
        v.sejours.forEach(function (s) { var f = fenetre(v, s, t - 60); if (f && t - f.fin < d) { d = t - f.fin; best = s; } });
        return best || v.sejours[0];
    }
    /** Pour VieDuVillage : s'il doit être parti, la case de sa sortie. */
    AlleesEtVenues.ailleurs = function (ev) {
        if (!pret || ev._visite) return null;
        var carte = $gameMap.mapId(), v = parCle[carte + ':' + ev.eventId()];
        if (!v) return null;
        var o = ou(v);
        if (o.etat === 'chez lui') return null;
        // il part (ou il est parti) vers où il va ; s'il revient, il est encore dehors
        var ch = chemin(v.carte, o.sejour.carte);
        if (o.etat === 'retour') { var inv = chemin(o.sejour.carte, v.carte); ch = inv ? [v.carte, inv[inv.length - 2]] : ch; }
        var t = ch ? passage(carte, ch[1]) : null;
        return t ? { x: t.x, y: t.y } : null;
    };
    AlleesEtVenues.estVoyageur = function (ev) { return !!(ev._visite || ($gameMap && parCle[$gameMap.mapId() + ':' + ev.eventId()])); };
    /** Habitants le fait-il passer par la porte (entrer, sortir) ? Les copies, et les voyageurs que VieDuVillage ne cache pas. */
    AlleesEtVenues.passeParLaPorte = function (ev) {
        if (ev._visite) return true;
        if (!AlleesEtVenues.estVoyageur(ev)) return false;
        return !(window.VieDuVillage && VieDuVillage.cacheLui && VieDuVillage.cacheLui(ev));
    };
    AlleesEtVenues.activite = function (ev) {
        var vis = ev._visite; if (!vis) return null;
        var o = ou(vis.v);
        return o.etat === 'la' && o.carte === $gameMap.mapId() ? o.sejour.activite : null;
    };
    AlleesEtVenues.enPassage = function (ev) {
        var vis = ev._visite; if (!vis || !vis.o) return false;
        return vis.o.etat === 'aller' || vis.o.etat === 'retour' || vis.o.etat === 'sort' || (vis.o.etat === 'la' && vis.o.sejour.porte);
    };

    /* ── chaque image : la fenêtre change ? on replace, on rafraîchit ─────── */
    var _upd = Game_Map.prototype.update;
    Game_Map.prototype.update = function (sceneActive) {
        _upd.call(this, sceneActive);
        if (!ACTIF || !pret) return;
        if (this._avAPoser) {
            this._avAPoser = false;
            // les cartes ont fini d'arriver après l'entrée sur la carte : on pose maintenant
            var sc = SceneManager._scene;
            if (dataVue !== $dataMap || !this._events.some(function (e) { return e && e._visite; })) {
                var avant = this._events.length;
                poserLesCopies(this);
                if (sc && sc._spriteset) for (var i = avant; i < this._events.length; i++) { var e = this._events[i]; if (e && e._visite) { var spr = new Sprite_Character(e); sc._spriteset._characterSprites.push(spr); sc._spriteset._tilemap.addChild(spr); } }
            }
        }
        this._avT = (this._avT || 0) + 1;
        if (this._avT < 20) return;
        this._avT = 0;
        var change = false, carte = this.mapId(), self = this;
        this._events.forEach(function (e) {
            if (!e) return;
            var vis = e._visite;
            if (vis) {
                var o = ou(vis.v), id = o.id || 'chez';
                // arrivé au bout de son passage : il sort
                var bout = o.etat === 'aller' || o.etat === 'retour' || o.etat === 'sort' || (o.etat === 'la' && o.sejour.porte);
                if (bout && vis.vu === o.id && e._pageIndex >= 0 && !e._habArrivee && e._habDelai === undefined && vis.arrive !== o.id) {
                    var dataPos = e.event();
                    if (Math.abs(e.x - dataPos.x) + Math.abs(e.y - dataPos.y) <= 1) { vis.arrive = o.id; vis.fini = o.id; change = true; }
                }
                if (aJour(e)) change = true;
                return;
            }
            var v = parCle[carte + ':' + e.eventId()];
            if (v) {
                var k = ou(v).etat;
                if (e._avEtat !== k) { e._avEtat = k; change = true; }
            }
        });
        if (change) self.requestRefresh();
    };

    /* ── la copie est le même personnage : ses interrupteurs, sa mémoire ──── */
    function visiteur(interp) {
        if (!interp || interp._eventId <= 0 || !$gameMap || interp._mapId !== $gameMap.mapId()) return null;
        var e = $gameMap.event(interp._eventId);
        return e && e._visite ? e._visite : null;
    }
    AlleesEtVenues.cleInterpreteur = function (interp) { var v = visiteur(interp); return v ? v.cle : null; };
    var _c123 = Game_Interpreter.prototype.command123;
    Game_Interpreter.prototype.command123 = function () {
        var v = visiteur(this);
        if (v) { $gameSelfSwitches.setValue([v.carte, v.id, this._params[0]], this._params[1] === 0); return true; }
        return _c123.call(this);
    };
    var _c111 = Game_Interpreter.prototype.command111;
    Game_Interpreter.prototype.command111 = function () {
        var v = visiteur(this);
        if (v && this._params[0] === 2) {
            var r = $gameSelfSwitches.value([v.carte, v.id, this._params[1]]) === (this._params[2] === 0);
            this._branch[this._indent] = r;
            if (r === false) this.skipBranch();
            return true;
        }
        return _c111.call(this);
    };
    var _meets = Game_Event.prototype.meetsConditions;
    Game_Event.prototype.meetsConditions = function (page) {
        var vis = this._visite;
        if (!vis) return _meets.call(this, page);
        var m = this._mapId, i = this._eventId;
        this._mapId = vis.carte; this._eventId = vis.id;
        try { return _meets.call(this, page); } finally { this._mapId = m; this._eventId = i; }
    };

    /* ── de quoi regarder ─────────────────────────────────────────────────── */
    AlleesEtVenues.voyageurs = function () { return voyageurs.map(function (v) { return { cle: v.cle, nom: v.nom, sejours: v.sejours }; }); };
    AlleesEtVenues.etat = function () {
        return voyageurs.map(function (v) { var o = ou(v); return { cle: v.cle, nom: v.nom, etat: o.etat, carte: o.carte }; });
    };
    AlleesEtVenues.copies = function () {
        return ($gameMap ? $gameMap.events() : []).filter(function (e) { return e._visite; }).map(function (e) {
            return { id: e.eventId(), cle: e._visite.cle, nom: e.event().name, page: e._pageIndex, x: e.x, y: e.y, place: { x: e.event().x, y: e.event().y }, etat: e._visite.o && e._visite.o.etat, arrivee: !!e._habArrivee, depart: !!e._habDepart };
        });
    };
    AlleesEtVenues._cartes = cartes;

    charger();
})();
