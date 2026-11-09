//=============================================================================
// VieDuVillage.js — v2.4  ·  Les PNJ ont une journée
// RPG Maker MV   ·   by JOKO
//   À charger APRÈS MOG_TimeSystem (il lui demande l'heure).
//   AlleesEtVenues (le voyage d'une carte à l'autre) se charge après lui.
//=============================================================================
/*:
 * @plugindesc v2.0 ■ Les PNJ ont un poste, un logis, et des heures. Dedans
 * aussi : les habitués vont au comptoir, les marchands bougent derrière le
 * leur. Ils se tournent vers toi, s'écartent, courent sous la pluie.
 * @author JOKO
 *
 * @param actif
 * @text Faire vivre les PNJ ?
 * @type boolean
 * @default true
 *
 * @param cartes
 * @text Cartes du dehors
 * @type string
 * @default 29,30,31,33
 * @desc Les numéros de carte, séparés par des virgules. Vide = toutes les cartes.
 *
 * @param interieurs
 * @text Cartes du dedans (bar, auberge, boutiques)
 * @type string
 * @default 41,42,43,44,45,46
 * @desc Dedans, on ne rentre pas chez soi : on reste à sa place, on va au
 * comptoir, aux étagères, on prend l'air, et on revient.
 *
 * @param lieux
 * @text Les coins des intérieurs
 * @type string
 * @default 46: comptoir 28,12 29,13 · air 20,30 · 44: comptoir 10,12 12,12 · table 14,5 15,6 · 43: etagere 2,7 2,11 10,11 · 42: etagere 3,9 15,8 · 41: etagere 14,8 15,10
 * @desc « carte: sorte x,y x,y · sorte x,y · carte: … ». Un client y va
 * parfois, y reste un peu, et revient à sa place.
 *
 * @param pasParImage
 * @text Un PNJ examiné toutes les N images
 * @type number
 * @min 1
 * @default 6
 *
 * @param portee
 * @text Portée de recherche de chemin
 * @type number
 * @min 8
 * @max 60
 * @default 30
 *
 * @param flanerie
 * @text Promenade du soir sur la place (cases)
 * @type number
 * @min 0
 * @default 2
 * @desc v2.1 : arrivés, ils ne piétinent plus. Le soir seulement, sur la place,
 * il leur arrive de changer de place, à quelques cases. 0 = jamais.
 *
 * @param rentrerSousLaPluie
 * @text Rentrer quand il pleut ?
 * @type boolean
 * @default true
 *
 * @param jourDeRepos
 * @text Jour de repos (0 = dimanche, 6 = samedi, -1 = aucun)
 * @type number
 * @min -1
 * @max 6
 * @default 0
 *
 * @param seTourner
 * @text Ils se tournent vers toi ?
 * @type boolean
 * @default true
 *
 * @param sEcarter
 * @text Ils s'écartent quand tu leur fonces dessus ?
 * @type boolean
 * @default true
 *
 * @param signeQuete
 * @text Un « ! » au-dessus de qui a une quête pour toi ?
 * @type boolean
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES PNJ ONT UNE JOURNÉE                                            by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Un PNJ n'est pas un meuble qui parle. Celui-ci a trois endroits et des
 *  heures :
 *
 *    SON POSTE  — la case où JOKO l'a posé dans l'éditeur.
 *    SON LOGIS  — sa porte (<Logis: x,y>), sinon la plus proche. Le soir il y
 *                 entre : il disparaît jusqu'au matin.
 *    LA PLACE   — le centre du village, là où l'on se retrouve.
 *
 *  Qui vit ? Tout événement qui porte <NPC:> ou <Vie:>, et (v2.0) tout
 *  habitant de l'outil (« ◆ HABITANT »). Les événements « ✎ » de l'atelier, les
 *  portes, ceux à qui JOKO a tracé un déplacement (« Personnalisé ») et les
 *  objets (une image « ! » : un tableau, une affiche — v2.4) ne sont jamais
 *  pilotés.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  LES FAÇONS DE VIVRE
 *  ─────────────────────────────────────────────────────────────────────────
 *   ▶ VILLAGEOIS (par défaut)
 *       6 h il sort · 8 h-12 h au poste · 12 h la place · 13 h-18 h au poste
 *       18 h-21 h il flâne · 21 h il rentre
 *   ▶ GARDE      il ne rentre jamais de lui-même : le jour son poste, la nuit
 *                la ronde. Ses heures au bar et à la caserne, c'est son <Va:>
 *                (AlleesEtVenues).
 *   ▶ SÉDENTAIRE 7 h-20 h derrière son comptoir, puis il rentre.
 *   ▶ NOCTAMBULE la place le soir et la nuit, son logis le matin.
 *   ▶ RONDE      <Ronde: x,y ; x,y ; …> : il marche d'un point à l'autre, s'y
 *                arrête un peu, et recommence ; le soir il rentre (un garde
 *                qui fait sa ronde, lui, ne rentre pas).
 *   ▶ FIXE       <Vie: fixe> : il ne bouge plus du tout.
 *  Le métier se lit dans <Vie:>, sinon dans <NPC:>, sinon dans son rôle
 *  (« garde », « marchand », « forgeron »…).
 *
 *  SON AGENDA — un COMMENTAIRE sur sa page :
 *      <Agenda: 12-14 20,15 ; 18-21 14,32>  à ces heures-là, il va là ; une
 *                    porte : il entre.
 *      <Soiree: 14,32>   de 18 h à 21 h, il va à cette porte.
 *      <Logis: 7,24>     sa porte à lui.
 *
 *  DEDANS (v2.0) — sur les « cartes du dedans » :
 *   · le MARCHAND (une boutique sur sa page, ou un métier de comptoir) bouge
 *     derrière son comptoir, regarde ses étagères, et revient à sa place dès
 *     que tu t'approches ;
 *   · les CLIENTS restent à leur place, et de temps en temps vont au
 *     comptoir, aux étagères, prennent l'air (réglage « lieux »), puis
 *     reviennent.
 *
 *  ILS MARCHENT (v2.1 — JOKO : « le plus gros problème c'est la marche, ils
 *  font n'importe quoi ») :
 *   · arrivés, ils ne bougent plus : chacun à sa case, tourné du bon côté (son
 *     poste comme JOKO l'a posé, ou vers le milieu de la place) ; de temps en
 *     temps, il regarde ailleurs, sans faire un pas ;
 *   · sur la place, CHACUN SA CASE (ils ne visent plus tous la même) ;
 *   · le pas suit le pas, sans s'arrêter entre deux cases ;
 *   · bloqués, ils attendent, puis contournent : jamais un pas au hasard.
 *
 *  ILS TE VOIENT (v2.0)
 *   · à deux cases, un PNJ qui ne fait rien se tourne vers toi ;
 *   · si tu lui fonces dessus, il s'écarte ;
 *   · « ! » au-dessus de qui a une quête à te donner ou à faire avancer ;
 *   · sous l'averse, ils courent.
 *
 *  LES INTERACTIONS SONT DES ÉVÉNEMENTS (JOKO, 2026-10-30 : « je préfère
 *  largement que ce soit un événement »). Ce plugin les aide seulement :
 *      VIE arreter 38 15         ces PNJ ne bougent plus (le temps d'une scène)
 *      VIE reprendre 38 15       ils reprennent leur journée
 *      VIE tourner 38 15         38 se tourne vers 15
 *      VIE bulle 29:38 4         une bulle sur Colette, même en visite
 *      VIE dire 29:38 150 texte  une phrase au-dessus d'elle (GALV)
 *   et dans une condition « Script » :
 *      VieDuVillage.ensemble(38, 15, 3)     tous deux là, libres, à 3 cases
 *      VieDuVillage.libre(38)               là, visible, ne fait rien
 *      VieDuVillage.pret('cle', 30)         pas joué depuis 30 min de jeu
 *   Un numéro « carte:événement » désigne quelqu'un où qu'il soit (sa copie de
 *   passage, AlleesEtVenues).
 *   v2.3 (2026-11-09) : un événement SANS IMAGE n'est jamais « là » pour une
 *   scène. JOKO réutilise des numéros pour ses marques (« kaze », « place »,
 *   page vide) : la scène de Fanchon (Marché, év. 26) faisait parler la marque
 *   « kaze », une phrase au-dessus d'une case vide.
 *   v2.4 (2026-11-09) : un OBJET ne vit pas. Une image « ! » (la convention de
 *   MV : un tableau, une affiche, un coffre) ne marche pas, ne rentre pas le
 *   soir, ne tourne pas la tête, et ne se tourne pas vers toi quand tu lui
 *   parles : il garde la direction de l'éditeur (la rangée de son image). Le
 *   tableau d'affichage devant la ville (29:10) marchait jusqu'à la place.
 *
 *  SCRIPT :  VieDuVillage.etat()      → ce que chacun fait, là, maintenant
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('VieDuVillage');
    // ⚠ Les booléens de PluginManager arrivent en TEXTE.
    var ACTIF = String(P['actif'] || 'true') === 'true';
    var PLUIE = String(P['rentrerSousLaPluie'] || 'true') === 'true';
    function nombres(t) { return String(t || '').split(',').map(function (x) { return parseInt(x, 10); }).filter(function (x) { return x > 0; }); }
    var CARTES = nombres(P['cartes']);
    var INTERIEURS = nombres(P['interieurs'] !== undefined ? P['interieurs'] : '41,42,43,44,45,46');
    var PAS = Math.max(1, parseInt(P['pasParImage'] || 6));
    var PORTEE = Math.max(8, parseInt(P['portee'] || 30));
    var FLANERIE = Math.max(0, parseInt(P['flanerie'] || 2));
    var REPOS = parseInt(P['jourDeRepos'] !== undefined ? P['jourDeRepos'] : 0);
    var TOURNER = String(P['seTourner'] || 'true') === 'true';
    var ECARTER = String(P['sEcarter'] || 'true') === 'true';
    var QUETE = String(P['signeQuete'] || 'true') === 'true';
    // « 46: comptoir 28,12 29,13 · air 20,30 · 44: … »
    var LIEUX = {};
    (function () {
        var carte = null;
        String(P['lieux'] || '').split('·').forEach(function (bout) {
            var m = bout.match(/^\s*(\d+)\s*:\s*(.*)$/);
            if (m) { carte = +m[1]; bout = m[2]; }
            if (!carte) return;
            var r = bout.trim().match(/^(\S+)\s+(.*)$/);
            if (!r) return;
            var l = LIEUX[carte] = LIEUX[carte] || [];
            r[2].split(/\s+/).forEach(function (xy) { var c = xy.match(/(\d+)\s*,\s*(\d+)/); if (c) l.push({ sorte: r[1], x: +c[1], y: +c[2] }); });
        });
    })();

    /* ── les façons de vivre ───────────────────────────────────────────── */
    var METIERS = {
        garde: ['garde_ville', 'garde', 'recrue', 'chevalier', 'veteran', 'capitaine', 'sentinelle'],
        sedentaire: ['marchand', 'muta', 'forgeron', 'guerisseur', 'aubergiste', 'banquier',
                     'maitre_arme', 'roi', 'reine', 'chambellan', 'selena', 'dame_elara',
                     'regis', 'quentin', 'tenancier', 'pretre'],
        noctambule: ['ivrogne', 'mendiant', 'fossoyeur', 'voleur', 'rodeur']
    };
    function metierDe(cle) {
        var c = String(cle || '').toLowerCase();
        var out = null;
        Object.keys(METIERS).forEach(function (m) { if (METIERS[m].indexOf(c) >= 0) { out = m; } });
        return out;
    }
    // le rôle écrit sur la fiche : « ◆ HABITANT · Rolf — garde de la porte sud »
    function metierDuRole(role) {
        // le métier, c'est le début du rôle : « fille du forgeron » n'est pas forgeronne
        var r = String(role || '').toLowerCase().split(/[,;(]/)[0].split(/\s+/).filter(Boolean).slice(0, 3).join(' ');
        if (/^(fille|fils|femme|mari|sœur|soeur|frère|frere|mère|mere|père|pere|enfant|petite|petit)\b/.test(r)) return null;
        if (/\b(garde|guetteur|sentinelle|soldat)\b/.test(r)) return 'garde';
        if (/mendiant|ivrogne|pickpocket/.test(r)) return 'noctambule';
        if (/marchand|marcand|vend|épicière|forgeron|armurière|aubergiste|bouch|fromager|fleuriste|cartographe|mage|enchant|diseuse|colporteur|graveur|crieur|recruteuse|charpentier|ravaudeur/.test(r)) return 'sedentaire';
        return null;
    }

    function heure() {
        return ($gameSystem && typeof $gameSystem.hour === 'function') ? $gameSystem.hour() : 12;
    }
    // ⚠ v2.0 : day_week() de MOG va de 1 à 7 (le dimanche vaut 1). La v1 le
    //   comparait à 0 : le jour de repos n'arrivait jamais.
    function jourDeRepos() {
        if (REPOS < 0) { return false; }
        return !!($gameSystem && typeof $gameSystem.day_week === 'function'
            && $gameSystem.day_week() - 1 === REPOS);
    }
    function ilPleut() {
        if (!$gameScreen) { return false; }
        var t = $gameScreen.weatherType();
        return t === 'rain' || t === 'storm';
    }
    function veillee() { return !!(window.Habitants && Habitants.veillee && Habitants.veillee()); }

    /** Où ce PNJ doit-il être à cette heure ? Rend un lieu et une humeur. */
    function ouAller(vie, h, repos, pluie) {
        if (vie.metier === 'fixe') { return { lieu: 'poste', dedans: false }; }
        if (vie.metier === 'visiteur' || vie.metier === 'client' || vie.metier === 'comptoir') { return { lieu: 'poste', dedans: false }; }

        if (vie.metier === 'garde') {
            // il ne rentre jamais, et la pluie ne l'excuse pas
            if (vie.ronde) { return { lieu: 'ronde', dedans: false }; }
            if (h >= 22 || h < 5) { return { lieu: 'place', dedans: false }; }   // la ronde
            return { lieu: 'poste', dedans: false };
        }

        if (pluie && PLUIE) { return { lieu: 'logis', dedans: true }; }

        // la Veillée du Retour : on reste dehors, sur la place, jusqu'à 2 h
        if (veillee() && (h >= 18 || h < 2)) { return { lieu: 'place', dedans: false }; }

        if (vie.metier === 'noctambule') {
            if (h >= 18 || h < 3) { return { lieu: 'place', dedans: false }; }
            if (h < 11) { return { lieu: 'logis', dedans: true }; }
            return { lieu: 'place', dedans: false };
        }

        if (h < 6 || h >= 21) { return { lieu: 'logis', dedans: true }; }
        if (vie.metier === 'ronde') { return { lieu: h >= 7 ? 'ronde' : 'poste', dedans: false }; }
        if (h < 8) { return { lieu: 'poste', dedans: false }; }       // il sort, il marche

        if (repos) {
            return { lieu: h >= 10 ? 'place' : 'poste', dedans: false };
        }

        if (vie.metier === 'sedentaire') {
            return { lieu: (h >= 7 && h < 20) ? 'poste' : 'logis', dedans: !(h >= 7 && h < 20) };
        }

        if (h === 12) { return { lieu: 'place', dedans: false }; }     // le repas
        if (h < 18) { return { lieu: 'poste', dedans: false };  }
        return { lieu: 'place', dedans: false };                       // la soirée
    }

    /* ── lire la carte : qui est un PNJ, où sont les portes ─────────────── */
    function commentairesDe(evenement, toutesPages) {
        var pages = toutesPages ? (evenement.event().pages || []) : [evenement.page && evenement.page()].filter(Boolean);
        var out = [];
        pages.forEach(function (page) { (page.list || []).forEach(function (c) { if (c && (c.code === 108 || c.code === 408)) out.push(String(c.parameters[0] || '')); }); });
        return out;
    }
    function marques(evenement) {
        var out = { cle: null, vie: null, agenda: [], logis: null, habitant: false, role: '', ronde: null, boutique: false };
        var page = evenement.page && evenement.page();
        if (!page || !page.list) { return out; }
        out.boutique = page.list.some(function (c) { return c.code === 302; });
        commentairesDe(evenement).forEach(function (t, i, l) {
            var a = t.match(/<NPC:\s*([^>]+)>/i);
            if (a) { out.cle = a[1].trim(); }
            var b = t.match(/<Vie:\s*([^>]+)>/i);
            if (b) { out.vie = b[1].trim().toLowerCase(); }
            var hab = t.match(/^◆ HABITANT · ([^—]*)(?:—\s*(.*))?$/);
            if (hab) { out.habitant = true; out.role = (hab[2] || '') + ' ' + (l[i + 1] && !/^Sa voix|^Généré/.test(l[i + 1]) ? l[i + 1] : ''); }
            var g = t.match(/<Agenda:\s*([^>]+)>/i);
            if (g) {
                g[1].split(';').forEach(function (morceau) {
                    var r = morceau.match(/(\d+)\s*-\s*(\d+)\s+(\d+)\s*,\s*(\d+)/);
                    if (r) { out.agenda.push({ de: +r[1], a: +r[2], x: +r[3], y: +r[4] }); }
                });
            }
            var so = t.match(/<Soir[ée]e:\s*(\d+)\s*,\s*(\d+)\s*>/i);
            if (so) { out.agenda.push({ de: 18, a: 21, x: +so[1], y: +so[2] }); }
            // <Logis: 7,24> — sa porte sur cette carte. (<Logis: 29 15,14>, une autre carte, c'est AlleesEtVenues.)
            var lg = t.match(/<Logis:\s*(\d+)\s*,\s*(\d+)\s*>/i);
            if (lg) { out.logis = { x: +lg[1], y: +lg[2] }; }
            var rd = t.match(/<Ronde:\s*([^>]+)>/i);
            if (rd) {
                out.ronde = [];
                rd[1].split(';').forEach(function (m) { var r = m.match(/(\d+)\s*,\s*(\d+)/); if (r) out.ronde.push({ x: +r[1], y: +r[2] }); });
                if (!out.ronde.length) out.ronde = null;
            }
        });
        return out;
    }
    function estPorte(evenement) {
        var page = evenement.page && evenement.page();
        var nom = page && page.image ? String(page.image.characterName || '') : '';
        return /door/i.test(nom);
    }
    function interieur(id) { return INTERIEURS.indexOf(id === undefined ? $gameMap.mapId() : id) >= 0; }
    function exterieur(id) { id = id === undefined ? $gameMap.mapId() : id; return CARTES.length === 0 ? !interieur(id) : CARTES.indexOf(id) >= 0; }
    function carteConcernee() { return !!$gameMap && (exterieur() || interieur()); }
    // un événement que JOKO fait bouger lui-même (« Personnalisé »), ou un exemple de l'atelier
    function aLui(e) {
        var nom = String(e.event().name || '');
        if (/^✎/.test(nom)) return true;
        var pg = e.page && e.page();
        return !!(pg && pg.moveType === 3);
    }
    // v2.4 : une image « ! » (la convention de MV pour les objets : un tableau, une affiche, un coffre)
    //   n'est pas une personne. JOKO a sorti le tableau d'affichage du bar (« ◆ HABITANT », sans image)
    //   devant la ville avec l'image d'un panneau (29:10) : il marchait jusqu'à la place, rentrait le soir,
    //   tournait la tête — vers le haut, une rangée vide de l'image : il disparaissait.
    function estObjet(e) {
        var pg = e && e.page && e.page();
        return !!(pg && pg.image && /^!/.test(String(pg.image.characterName || '')));
    }

    function casePraticable(c) {
        function bonne(x, y) {
            return $gameMap.isValid(x, y) && $gameMap.eventsXy(x, y).length === 0 &&
                [2, 4, 6, 8].filter(function (d) { return $gameMap.isPassable(x, y, d); }).length >= 3;
        }
        for (var r = 0; r < 12; r++) {
            for (var dx = -r; dx <= r; dx++) {
                var dy = r - Math.abs(dx);
                if (bonne(c.x + dx, c.y + dy)) return { x: c.x + dx, y: c.y + dy };
                if (dy && bonne(c.x + dx, c.y - dy)) return { x: c.x + dx, y: c.y - dy };
            }
        }
        return c;
    }
    // des cases libres autour d'un point, du plus près au plus loin, sans deux voisines
    function casesAutour(c, n) {
        var w = $gameMap.width(), vu = {}, file = [[c.x, c.y, 0]], prises = [], serrees = [];
        vu[c.y * w + c.x] = true;
        while (file.length && prises.length < n) {
            var t = file.shift(), x = t[0], y = t[1];
            var libre = t[2] >= 1 && $gameMap.eventsXy(x, y).length === 0 &&
                [2, 4, 6, 8].filter(function (d) { return $gameMap.isPassable(x, y, d); }).length >= 3;
            if (libre) {
                var voisine = prises.some(function (p) { return Math.abs(p.x - x) + Math.abs(p.y - y) <= 1; });
                (voisine ? serrees : prises).push({ x: x, y: y });
            }
            if (t[2] > 9) continue;
            [2, 4, 6, 8].forEach(function (d) {
                var nx = $gameMap.roundXWithDirection(x, d), ny = $gameMap.roundYWithDirection(y, d);
                if (!$gameMap.isValid(nx, ny) || vu[ny * w + nx]) return;
                if (!$gameMap.isPassable(x, y, d) || !$gameMap.isPassable(nx, ny, 10 - d)) return;
                vu[ny * w + nx] = true; file.push([nx, ny, t[2] + 1]);
            });
        }
        return prises.concat(serrees).slice(0, n);
    }
    function recenser() {
        var pnj = [], portes = [];
        $gameMap.events().forEach(function (e) {
            if (!e || e._erased) { return; }
            if (estPorte(e)) { portes.push({ x: e.x, y: e.y }); return; }
            if (aLui(e)) { return; }
            // un tableau, une affiche : un habitant sans visage ne marche pas — ni un objet (une image « ! », v2.4)
            var pg = e.page && e.page();
            if (pg && (!pg.image.characterName || estObjet(e)) && !e._visite) { return; }
            var m = marques(e);
            if (!e._visite && !m.cle && !m.vie && !m.habitant) { return; }   // seuls les PNJ marqués vivent
            if (e._visite && !m.cle && !m.vie && !m.habitant) { m.habitant = true; }
            pnj.push({ ev: e, m: m });
        });
        if (!pnj.length) { return null; }

        // la place : le centre de gravité des postes (dehors seulement)
        var sx = 0, sy = 0, n = 0;
        pnj.forEach(function (p) { if (!p.ev._visite) { sx += p.ev.x; sy += p.ev.y; n++; } });
        var place = n ? { x: Math.round(sx / n), y: Math.round(sy / n) } : { x: $gameMap.width() >> 1, y: $gameMap.height() >> 1 };
        // ⚠ v2.0 : le centre des postes peut tomber dans la rivière (Village de Pêche) : personne
        //   ne l'atteignait, tout le monde piétinait autour. On prend la case praticable la plus proche.
        place = casePraticable(place);
        var dedans = interieur();
        // chacun sa case sur la place, en couronne autour du milieu, espacées
        var cases = dedans ? [] : casesAutour(place, pnj.length + 4);
        var rang = 0;

        pnj.forEach(function (p) {
            var e = p.ev, m = p.m;
            var poste = { x: e.event().x, y: e.event().y };
            var logis = poste, d = Infinity;
            portes.forEach(function (q) {
                var dd = Math.abs(q.x - poste.x) + Math.abs(q.y - poste.y);
                if (dd < d) { d = dd; logis = q; }
            });
            if (m.logis) { logis = m.logis; }
            var metier = m.vie || metierDe(m.cle) || metierDuRole(m.role) || 'villageois';
            if (m.ronde && metier !== 'garde' && metier !== 'fixe') { metier = 'ronde'; }
            if (dedans && metier !== 'fixe') { metier = (m.boutique || metier === 'sedentaire') ? 'comptoir' : 'client'; }
            // une copie de passage qui fait sa ronde dehors (un garde du bar en service) : il patrouille
            if (e._visite) { metier = m.ronde && !dedans ? 'garde' : 'visiteur'; }
            var sa = metier === 'garde' || e._visite || !cases.length ? place : cases[rang++ % cases.length];
            e._vie = {
                cle: m.cle, metier: metier, poste: poste, logis: logis, place: sa, milieu: place, cases: cases,
                agenda: m.agenda || [], portes: portes, ronde: m.ronde, iRonde: 0,
                dedans: false, but: null, dirPoste: e.event().pages[0] ? (e.page() || e.event().pages[0]).image.direction || e.direction() : e.direction(),
                marche: {}, vers: null, premier: true
            };
        });
        return { pnj: pnj, portes: portes, place: place };
    }

    /* ── le pilote ─────────────────────────────────────────────────────── */
    // Un pas vers (x,y). La carte des distances de Habitants : une lecture de
    // tableau ; sinon la recherche de MV, élargie le temps du calcul.
    // ⚠ 2026-09-30 : un PNJ bloqué relançait une recherche toutes les six
    //   images, sans fin : on attend un peu, et pas plus de quatre recherches
    //   par image pour tout le village.
    // v2.1 : on ne fait plus le pas ici, on dit où il va ; il marche à chaque image
    //   (avancer()), sans la pause de six images qui le faisait avancer par à-coups
    function unPasVers(ev, x, y) {
        if (ev.x === x && ev.y === y) { ev._vie.vers = null; return; }
        ev._vie.vers = { x: x, y: y };
    }
    // un pas, s'il a où aller : à chaque image, dès que le pas d'avant est fini
    function avancer(ev) {
        var v = ev._vie, c = v && v.vers;
        // « fixe » : il ne bouge plus, même s'il était en route (v2.2)
        if (v && v.metier === 'fixe') { v.vers = null; return; }
        if (!c || ev.isMoving() || v.dedans || ev._vieScene > 0 || ev._pauseConversation > 0 || ev.isMoveRouteForcing() || enPassage(ev)) return;
        if (ev.x === c.x && ev.y === c.y) { v.vers = null; return; }
        var m = v.marche || (v.marche = {});
        if (m.attente > 0) { m.attente--; return; }
        // à une case du but, et quelqu'un s'y tient : il est arrivé, il ne le bouscule pas
        if (dist(ev, c) === 1 && (m.bloque || 0) >= 3) { v.vers = null; v.presque = { x: c.x, y: c.y }; m.bloque = 0; return; }
        // sa case de la place est prise depuis longtemps : il en prend une autre, libre, près de lui
        if (v.but === 'place' && (m.bloque || 0) >= 8 && v.cases && c.x === v.place.x && c.y === v.place.y) {
            var autres = v.cases.filter(function (k) { return libreA(k.x, k.y, ev); }).sort(function (a, b) { return dist(a, ev) - dist(b, ev); });
            if (autres.length) { v.place = autres[0]; v.vers = { x: autres[0].x, y: autres[0].y }; m.bloque = 0; return; }
        }
        if (window.Habitants && Habitants.pas) { Habitants.pas(ev, c.x, c.y, m); return; }
        var d = ev.findDirectionTo(c.x, c.y);
        if (d > 0) ev.moveStraight(d);
        if (!ev.isMovementSucceeded()) m.attente = 20;
    }
    // il est arrivé : à sa case comme JOKO l'a posé, ou vers ce qu'il regarde ; et de temps en
    // temps il tourne la tête, puis revient. Il ne fait pas un pas.
    function seTenir(ev, v, dir) {
        if (ev._vieRegarde) return;
        if (v.regardeAilleurs > 0) { if (--v.regardeAilleurs === 0) ev.setDirection(dir); return; }
        if (ev.direction() !== dir && !v.tourne) ev.setDirection(dir);
        v.tourne = false;
        if ((v.repos = (v.repos === undefined ? 40 + Math.randomInt(120) : v.repos) - 1) > 0) return;
        v.repos = 80 + Math.randomInt(160);
        var cotes = (dir === 2 || dir === 8) ? [4, 6] : [2, 8];
        ev.setDirection(cotes[Math.randomInt(2)]);
        v.regardeAilleurs = 15 + Math.randomInt(20);
        v.tourne = true;
    }
    function versLe(de, a) {
        var dx = a.x - de.x, dy = a.y - de.y;
        if (!dx && !dy) return 0;
        return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 6 : 4) : (dy > 0 ? 2 : 8);
    }
    function libreA(x, y, ev) {
        return $gameMap.isValid(x, y) && !($gamePlayer.x === x && $gamePlayer.y === y) &&
            !$gameMap.eventsXyNt(x, y).some(function (e) { return e !== ev && e.isNormalPriority(); }) &&
            [2, 4, 6, 8].some(function (d) { return $gameMap.isPassable(x, y, d); });
    }
    function estArrive(ev, v, c) { return dist(ev, c) === 0 || (v.presque && v.presque.x === c.x && v.presque.y === c.y && dist(ev, c) <= 1); }

    function agendaDe(v, h) {
        var r = null;
        (v.agenda || []).forEach(function (a) {
            var dedans = a.de <= a.a ? (h >= a.de && h < a.a) : (h >= a.de || h < a.a);
            if (dedans) { r = a; }
        });
        return r;
    }
    function dist(a, b) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); }
    function cacher(ev, v, ou) { if (!v.dedans) { v.dedans = true; v.dedansA = { x: ou.x, y: ou.y }; ev.setOpacity(0); ev.setThrough(true); } }
    function montrer(ev, v) { if (v.dedans) { v.dedans = false; v.dedansA = null; ev.setOpacity(255); ev.setThrough(false); } }
    // Habitants le fait entrer ou sortir par la porte : on le laisse faire
    function enPassage(ev) { return !!(ev._habDepart || ev._habArrivee || ev._habDelai !== undefined || ev._pageIndex < 0); }

    // la vitesse de l'éditeur (la page active ; 3 si elle n'en dit rien)
    function vitesseDe(ev) { var p = ev.page && ev.page(); return p && p.moveSpeed > 0 ? p.moveSpeed : 3; }
    function piloter(ev) {
        var v = ev._vie;
        if (!v || v.metier === 'fixe') { return; }
        // ⚠ Un PNJ à qui l'on parle, ou qu'une scène retient, ne s'en va pas.
        if (ev._pauseConversation > 0 || ev._vieScene > 0 || ev.isMoveRouteForcing()) { return; }
        if (enPassage(ev)) { return; }
        v.vers = null;
        var pluie = ilPleut();
        // v2.2 : la vitesse est celle que JOKO a mise dans l'éditeur (3, par défaut : deux fois plus lent que le
        //   joueur ; 2 pour ses vieux) — avant, on forçait 4, le pas du joueur, et ils filaient ; sous l'averse, un
        //   cran de plus. Un marchand derrière son comptoir revient à sa place à 3 au moins (à 1, deux secondes par case).
        var vit = vitesseDe(ev) + (pluie && v.metier !== 'garde' && v.metier !== 'comptoir' && v.metier !== 'client' ? 1 : 0);
        ev.setMoveSpeed(Math.min(6, v.metier === 'comptoir' ? Math.max(3, vit) : vit));

        if (v.metier === 'comptoir') { return derriereLeComptoir(ev, v); }
        if (v.metier === 'client' || v.metier === 'visiteur') { return aSaPlace(ev, v); }

        var but = ouAller(v, heure(), jourDeRepos(), pluie);
        var cible = v[but.lieu] || v.poste;
        v.but = but.lieu;
        if (but.lieu === 'ronde' && v.ronde) {
            cible = v.ronde[v.iRonde % v.ronde.length];
            // arrivé, ou juste à côté parce que quelqu'un s'y tient : il ne l'attend pas, il continue sa ronde
            if (estArrive(ev, v, cible)) {
                // arrivé : il regarde un peu autour, puis repart vers le point suivant
                if (!v.attenteRonde) v.attenteRonde = 30 + Math.randomInt(40);
                if (--v.attenteRonde <= 0) { v.attenteRonde = 0; v.iRonde++; v.presque = null; }
                else if (Math.random() < 0.03 && !ev._vieRegarde) ev.setDirection([2, 4, 6, 8][Math.randomInt(4)]);
                return;
            }
        }
        // AlleesEtVenues : il doit être ailleurs (le bar, la caserne, sa maison
        // d'une autre carte) — il prend la sortie qui y mène, et y entre
        var ailleurs = window.AlleesEtVenues && AlleesEtVenues.ailleurs ? AlleesEtVenues.ailleurs(ev) : null;
        if (ailleurs) {
            cible = ailleurs;
            but = { lieu: 'ailleurs', dedans: true };
            v.but = 'part ' + ailleurs.x + ',' + ailleurs.y;
        } else {
            var ag = agendaDe(v, heure());
            if (ag && !(pluie && PLUIE && v.metier !== 'garde')) {
                var porte = v.portes.some(function (q) { return q.x === ag.x && q.y === ag.y; }) ||
                    $gameMap.eventsXy(ag.x, ag.y).some(function (e) { return e !== ev && e.event().pages.some(function (pg) { return pg.list.some(function (c) { return c.code === 201; }); }); });
                cible = { x: ag.x, y: ag.y };
                but = { lieu: 'agenda', dedans: porte };
                v.but = porte ? 'entre ' + ag.x + ',' + ag.y : 'agenda ' + ag.x + ',' + ag.y;
            }
        }

        // ── on arrive sur la carte : chacun est déjà où sa journée le met (comme dans Stardew Valley).
        //    Avant, tout le monde repartait de la case de l'éditeur et traversait la ville sous nos yeux.
        if (v.premier) {
            v.premier = false;
            if (but.dedans) { cacher(ev, v, cible); return; }
            if (dist(ev, cible) > 1 && but.lieu !== 'ronde' && libreA(cible.x, cible.y, ev)) { ev.locate(cible.x, cible.y); }
            // posé par JOKO dans un recoin du décor d'où l'on ne sort pas (Tobias, au bord de la Ville) : s'il doit
            // aller ailleurs, il commence sur la case praticable la plus proche (personne ne le voit, on arrive)
            else if (dist(ev, cible) > 1 && window.Habitants && Habitants.atteint && !Habitants.atteint(ev, cible.x, cible.y)) {
                var sortie = casePraticable({ x: ev.x, y: ev.y });
                if (sortie.x !== ev.x || sortie.y !== ev.y) ev.locate(sortie.x, sortie.y);
            }
        }
        // ── entrer et sortir ──
        // ⚠ On ne se tient JAMAIS sur la case d'une porte : être devant, c'est être rentré.
        var surLePas = dist(ev, cible) <= 1;
        if (but.dedans && surLePas) { cacher(ev, v, cible); return; }
        // caché ailleurs qu'à la porte qu'il vise maintenant (du bar, il part à la caserne) :
        // il ressort de là où il était, et marche jusqu'à l'autre
        if (v.dedans && (!but.dedans || (v.dedansA && dist(v.dedansA, cible) > 1))) {
            if (v.dedansA) { ev.locate(v.dedansA.x, v.dedansA.y); }
            montrer(ev, v);
        }
        if (v.dedans) { return; }      // il dort, on ne le dérange pas

        // ── arrivé : il se tient là, tourné du bon côté (v2.1 : il ne piétine plus) ──
        if (estArrive(ev, v, cible)) {
            var dir = but.lieu === 'place' ? (versLe(ev, v.milieu || cible) || v.dirPoste) : v.dirPoste;
            if (but.lieu === 'place' && v.metier === 'garde') dir = ev.direction();       // la ronde de nuit : il regarde où il va
            seTenir(ev, v, dir);
            // le soir, sur la place, il change parfois de place (quelques cases, jamais au hasard)
            if (but.lieu === 'place' && FLANERIE > 0 && v.metier !== 'garde' && heure() >= 18 && v.cases && v.cases.length > 1) {
                if ((v.promenade = (v.promenade === undefined ? 300 + Math.randomInt(600) : v.promenade) - 1) <= 0) {
                    v.promenade = 500 + Math.randomInt(700);
                    var proches = v.cases.filter(function (c) { return dist(c, v.place) <= FLANERIE + 2 && !$gameMap.eventsXy(c.x, c.y).length; });
                    if (proches.length) { v.place = proches[Math.randomInt(proches.length)]; v.presque = null; }
                }
            }
            return;
        }
        v.presque = null;
        unPasVers(ev, cible.x, cible.y);
    }

    /* ── dedans : derrière le comptoir, à sa place ──────────────────────── */
    // Le coin du marchand : les cases qu'il atteint sans passer devant son
    // comptoir (pas plus bas que sa place), à trois cases au plus.
    function coinDuMarchand(v) {
        if (v.coin) return v.coin;
        var p = v.poste, vu = {}, file = [p], coin = [];
        vu[p.x + ',' + p.y] = true;
        while (file.length) {
            var c = file.shift();
            coin.push(c);
            [2, 4, 6, 8].forEach(function (d) {
                var nx = $gameMap.roundXWithDirection(c.x, d), ny = $gameMap.roundYWithDirection(c.y, d), k = nx + ',' + ny;
                if (vu[k] || ny > p.y || Math.abs(nx - p.x) > 3 || p.y - ny > 2) return;
                if (!$gameMap.isPassable(c.x, c.y, d) || !$gameMap.isPassable(nx, ny, 10 - d)) return;
                if ($gameMap.eventsXyNt(nx, ny).some(function (e) { return e.isNormalPriority() && !e._vie; })) return;
                vu[k] = true; file.push({ x: nx, y: ny });
            });
        }
        return (v.coin = coin);
    }
    function derriereLeComptoir(ev, v) {
        var proche = $gameMap.mapId() && dist($gameplayerPos(), v.poste) <= 4;
        if (proche || !v.course) {
            if (!estArrive(ev, v, v.poste)) { v.course = null; unPasVers(ev, v.poste.x, v.poste.y); return; }
            // à sa place : face au comptoir, prêt à servir
            if (proche) { if (!ev._vieRegarde && ev.direction() !== v.dirPoste) ev.setDirection(v.dirPoste); v.course = null; v.attente = 150; return; }
            seTenir(ev, v, v.dirPoste);
            // v2.1 : il va voir ses étagères de temps en temps (toutes les 15 à 40 s), pas sans arrêt
            if ((v.attente = (v.attente === undefined ? 100 + Math.randomInt(200) : v.attente) - 1) > 0) return;
            var coin = coinDuMarchand(v);
            v.attente = 150 + Math.randomInt(250);
            if (coin.length > 1 && Math.random() < 0.4) { v.course = coin[1 + Math.randomInt(coin.length - 1)]; v.resteLa = 40 + Math.randomInt(50); }
            return;
        }
        var c = v.course;
        if (!estArrive(ev, v, c)) { unPasVers(ev, c.x, c.y); return; }
        if (v.resteLa === 40) ev.setDirection(8);                                       // ses étagères
        if (--v.resteLa <= 0) { v.course = null; v.presque = null; }
    }
    function $gameplayerPos() { return { x: $gamePlayer.x, y: $gamePlayer.y }; }
    // un coin du comptoir n'accueille qu'un client à la fois
    function lieuPris(l) { var p = $gameMap._vieLieux; return !!(p && p[l.x + ',' + l.y]); }
    function lacher(v) { var c = v.course; if (c && $gameMap._vieLieux) delete $gameMap._vieLieux[c.x + ',' + c.y]; v.course = null; v.resteLa = null; v.presque = null; }
    function aSaPlace(ev, v) {
        // une course en cours : y aller, y rester, revenir
        if (v.course) {
            var c = v.course;
            if (v.resteLa === undefined || v.resteLa === null) {
                if (dist(ev, c) <= (c.sorte === 'air' ? 1 : 0) || estArrive(ev, v, c)) { v.resteLa = 40 + Math.randomInt(60); if (c.sorte === 'air') ev.setOpacity(0); else ev.setDirection(8); return; }
                if ((v.tCourse = (v.tCourse || 0) + 1) > 150) { lacher(v); return; }   // trop loin, trop bloqué : il renonce
                unPasVers(ev, c.x, c.y); return;
            }
            if (--v.resteLa > 0) return;
            if (c.sorte === 'air') ev.setOpacity(255);
            lacher(v); v.retour = true;
            return;
        }
        if (!estArrive(ev, v, v.poste)) { unPasVers(ev, v.poste.x, v.poste.y); return; }
        if (v.retour) { v.retour = false; v.presque = null; }
        seTenir(ev, v, v.dirPoste || 2);
        // de temps en temps (une à quatre minutes), une course : le comptoir, les étagères, l'air
        if ((v.attente = (v.attente === undefined ? 600 + Math.randomInt(1200) : v.attente) - 1) > 0) return;
        v.attente = 900 + Math.randomInt(1500);
        var lieux = (LIEUX[$gameMap.mapId()] || []).filter(function (l) { return !lieuPris(l); });
        if (!lieux.length || v.metier === 'visiteur' || Math.random() < 0.5) return;
        v.course = lieux[Math.randomInt(lieux.length)]; v.tCourse = 0; v.resteLa = null;
        ($gameMap._vieLieux = $gameMap._vieLieux || {})[v.course.x + ',' + v.course.y] = ev.eventId();
    }

    /* ── un objet qui parle ne se tourne pas vers toi ───────────────────── */
    // MV tourne vers le joueur l'événement qu'on lance (lock), sauf « Direction fixe ». Pour un objet
    // de l'outil (une image « ! » qui porte « ◆ HABITANT », <NPC:> ou <Vie:>), sa direction est la rangée
    // de son image que JOKO a choisie : le tableau 29:10 montrait sa face vide pendant qu'on lisait.
    function objetQuiParle(e) {
        if (!estObjet(e)) return false;
        var m = marques(e);
        return !!(m.habitant || m.cle || m.vie);
    }
    var _lock = Game_Event.prototype.lock;
    Game_Event.prototype.lock = function () {
        if (!this._locked && objetQuiParle(this)) { this._prelockDirection = this.direction(); this._locked = true; return; }
        _lock.call(this);
    };

    /* ── ils te voient ─────────────────────────────────────────────────── */
    function sOccupe(ev) {
        var v = ev._vie;
        return ev.isMoving() || ev.isMoveRouteForcing() || ev._vieScene > 0 || ev._pageIndex < 0 || ev.opacity() === 0 ||
            (v && (v.dedans || v.course || v.metier === 'fixe'));
    }
    function regarder(liste) {
        if (!TOURNER) return;
        liste.forEach(function (ev) {
            if (!ev._vie || ev.isDirectionFixed()) return;
            var d = dist(ev, $gamePlayer);
            if (d <= 2 && !sOccupe(ev) && !ev._vieRegarde) { ev._vieRegarde = 1; ev.turnTowardPlayer(); }
            else if (ev._vieRegarde && d > 3) { if (++ev._vieRegarde > 4) { ev._vieRegarde = 0; } }
            else if (ev._vieRegarde && d <= 2 && !ev.isMoving() && !ev.isMoveRouteForcing()) { ev.turnTowardPlayer(); }
        });
    }
    // tu lui fonces dessus : il s'écarte (de côté d'abord, sinon devant toi)
    function ecarter() {
        if (!ECARTER || $gamePlayer.isMoving() || !Input.dir4 || Input.dir4 !== $gamePlayer.direction()) { $gameMap._viePousse = 0; return; }
        var d = $gamePlayer.direction(), x = $gameMap.roundXWithDirection($gamePlayer.x, d), y = $gameMap.roundYWithDirection($gamePlayer.y, d);
        var ev = $gameMap.eventsXyNt(x, y).filter(function (e) { return e._vie && e._vie.metier !== 'fixe' && e._vie.metier !== 'comptoir' && !e.isMoving() && !(e._vieScene > 0); })[0];
        if (!ev) { $gameMap._viePousse = 0; return; }
        if (($gameMap._viePousse = ($gameMap._viePousse || 0) + 1) < 14) return;
        $gameMap._viePousse = 0;
        var cotes = (d === 2 || d === 8) ? [4, 6] : [2, 8];
        if (Math.random() < 0.5) cotes.reverse();
        var essais = cotes.concat([d]);
        for (var i = 0; i < essais.length; i++) {
            if (ev.canPass(ev.x, ev.y, essais[i])) { ev.moveStraight(essais[i]); ev._vieAttente = 40; ev._vieScene = 45; return; }
        }
    }
    // « ! » : sa page donne une quête qu'on n'a pas, ou en fait avancer une en cours
    function quetesDe(ev) {
        var pg = ev.page && ev.page();
        if (!pg) return null;
        if (ev._vieQuetesPage === pg) return ev._vieQuetes;
        var l = [];
        pg.list.forEach(function (c) {
            if (c.code !== 356) return;
            var m = String(c.parameters[0]).match(/^QUEST\s+(add|step|done)\s+(?:(?:main|side|perso|tuto)\s+)?(\S+)/i);
            if (m) l.push({ verbe: m[1].toLowerCase(), id: m[2] });
        });
        ev._vieQuetesPage = pg; ev._vieQuetes = l;
        return l;
    }
    function aUneQuete(ev) {
        if (!$gameSystem.questStatus) return false;
        return (quetesDe(ev) || []).some(function (q) {
            var s = $gameSystem.questStatus(q.id);
            return q.verbe === 'add' ? s === 'none' : s === 'active';
        });
    }
    function signes() {
        if (!QUETE) return;
        $gameMap.events().forEach(function (ev) {
            if (!ev || ev._pageIndex < 0 || ev.opacity() === 0 || ev._balloonId > 0 || ev.isBalloonPlaying && ev.isBalloonPlaying()) return;
            if (dist(ev, $gamePlayer) > 7 || !aUneQuete(ev)) return;
            ev.requestBalloon(1);
        });
    }

    /* ── l'accroche à la carte ──────────────────────────────────────────── */
    var _setup = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function () {
        _setup.call(this);
        // ⚠ Vider la LISTE, pas seulement le drapeau (sinon les PNJ du village
        // précédent restaient pilotés sur une carte qui n'en a aucun).
        this._vieRecensee = false;
        this._viePNJ = [];
        this._vieIndex = 0;
        this._vieAvecCopies = false;
    };

    // ⚠ v2.0 : une partie chargée gardait « déjà recensé » et une liste de PNJ
    //   relue depuis la sauvegarde — des copies, pas les vrais événements de la
    //   carte : plus personne ne bougeait après un chargement. On recense à
    //   chaque carte chargée.
    var _charge = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        if ($gameMap) { $gameMap._vieRecensee = false; $gameMap._vieAvecCopies = false; $gameMap._vieLieux = {}; }
        _charge.call(this);
        // une scène en cours au moment de la sauvegarde : son arrêt n'a plus de sens
        if ($gameMap) { $gameMap.events().forEach(function (e) { if (e) e._vieScene = 0; }); }
    };

    var _maj = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _maj.call(this);
        if (!ACTIF || !$gameMap || !$gamePlayer) { return; }
        if (!carteConcernee()) { return; }
        if ($gameMessage.isBusy() || $gameMap.isEventRunning()) { return; }
        // AlleesEtVenues pose ses copies quand les cartes sont lues : on recompte
        if (window.AlleesEtVenues && AlleesEtVenues.pret && AlleesEtVenues.pret() && !$gameMap._vieAvecCopies) {
            $gameMap._vieAvecCopies = true; $gameMap._vieRecensee = false;
        }

        if (!$gameMap._vieRecensee) {
            $gameMap._vieRecensee = true;
            var r = recenser();
            $gameMap._viePNJ = r ? r.pnj.map(function (p) { return p.ev; }) : [];
            // on coupe le déplacement automatique de MV : deux pilotes sur le
            // même PNJ se battraient pour le volant.
            ($gameMap._viePNJ || []).forEach(function (e) {
                if (e._vie && e._vie.metier !== 'fixe') { e._moveType = 0; }
            });
        }

        var liste = $gameMap._viePNJ || [];
        $gameMap._vieBudget = 4;
        this._vieT = (this._vieT || 0) + 1;
        ecarter();
        if (this._vieT % 20 === 0) { regarder(liste); }
        if (this._vieT % 150 === 0) { signes(); }
        // le pas suit le pas : à chaque image, ceux qui ont fini le leur repartent
        liste.forEach(function (ev) { if (ev && !ev._erased) avancer(ev); });
        if (this._vieT % PAS !== 0 || !liste.length) { return; }
        // On passe sur TOUS les PNJ, mais on ne calcule un chemin que pour ceux
        // qui ont fini leur pas (v1 : un seul par tour de rôle, et personne
        // n'arrivait jamais nulle part).
        liste.forEach(function (ev) {
            if (!ev || ev._erased) { return; }
            if (ev._vieScene > 0) { ev._vieScene -= PAS; }
            if (ev.isMoving()) { return; }
            piloter(ev);
        });
    };

    /* ── pour les interactions (des événements, JOKO) ──────────────────── */
    // « 38 », « 29:38 » (où qu'il soit : sa copie de passage), « Colette »
    function qui(x) {
        if (x === undefined || x === null || !$gameMap) return null;
        if (typeof x === 'object') return x;
        var s = String(x).trim();
        var m = s.match(/^(\d+)\s*:\s*(\d+)$/);
        if (m) {
            if (+m[1] === $gameMap.mapId()) return $gameMap.event(+m[2]) || null;
            return $gameMap.events().filter(function (e) { return e._visite && e._visite.cle === +m[1] + ':' + +m[2]; })[0] || null;
        }
        if (/^\d+$/.test(s)) return $gameMap.event(+s) || null;
        var nom = s.toLowerCase();
        return $gameMap.events().filter(function (e) { return String(e.event().name || '').trim().toLowerCase() === nom; })[0] || null;
    }
    // v2.3 : sans image (une marque de JOKO, une page vide), personne n'est là pour une scène
    function visible(e) { return !!(e.characterName() || e.tileId() > 0); }
    function la(e) { return !!(e && !e._erased && e._pageIndex >= 0 && visible(e) && e.opacity() > 0 && !(e._vie && e._vie.dedans) && !enPassage(e)); }
    function libre(e) { return la(e) && !e.isMoveRouteForcing() && !(e._vieScene > 0) && !(e._vie && e._vie.course) && !(e._pauseConversation > 0); }
    function scene(e, n) { if (e) { e._vieScene = n; } }
    var dernieres = {};
    window.VieDuVillage = {
        heure: heure,
        repos: jourDeRepos,
        pluie: ilPleut,
        qui: qui,
        la: function (x) { return la(qui(x)); },
        libre: function (x) { return libre(qui(x)); },
        /** tous là, libres, et à n cases au plus les uns des autres : VieDuVillage.ensemble(38, 15, 3) */
        ensemble: function () {
            var a = Array.prototype.slice.call(arguments), n = typeof a[a.length - 1] === 'number' && a.length > 2 ? a.pop() : 3;
            var l = a.map(qui);
            if (!l.every(libre)) return false;
            for (var i = 1; i < l.length; i++) if (dist(l[0], l[i]) > n) return false;
            return true;
        },
        /** pas joué depuis « minutes » minutes de jeu (et on le note) */
        pret: function (cle, minutes) {
            var t = window.AlleesEtVenues && AlleesEtVenues.maintenant ? AlleesEtVenues.maintenant() : Graphics.frameCount / 120;
            if (dernieres[cle] !== undefined && t - dernieres[cle] < (minutes || 30) && t >= dernieres[cle]) return false;
            dernieres[cle] = t;
            return true;
        },
        prochePourVoir: function (x, n) { var e = qui(x); return !!(e && dist(e, $gamePlayer) <= (n || 12)); },
        // ⚠ jamais sans fin : une scène coupée par une sauvegarde, ou qui casse, ne fige personne pour toujours
        arreter: function (l, n) { l.map(qui).forEach(function (e) { scene(e, n || 900); }); },
        reprendre: function (l) { l.map(qui).forEach(function (e) { scene(e, 0); }); },
        /** pour AlleesEtVenues : dehors, VieDuVillage fait entrer ce voyageur dans la porte (il reste caché sur la carte) */
        cacheLui: function (ev) {
            if (!ACTIF || !exterieur() || ev._visite) return false;
            if (aLui(ev)) return false;
            return (ev.event().pages || []).some(function (pg) { return pg.list.some(function (c) {
                if (c.code !== 108 && c.code !== 408) return false;
                var t = String(c.parameters[0] || '');
                return /<NPC:|<Vie:|^◆ HABITANT/i.test(t) && !/<Vie:\s*fixe/i.test(t);
            }); });
        },
        /** les heures où il est chez lui, selon sa façon de vivre */
        heuresDuLogis: function (data) {
            var t = (data.pages || []).map(function (pg) { return pg.list.filter(function (c) { return c.code === 108 || c.code === 408; }).map(function (c) { return c.parameters[0]; }).join('\n'); }).join('\n');
            var v = (t.match(/<Vie:\s*([^>]+)>/i) || [])[1], k = (t.match(/<NPC:\s*([^>]+)>/i) || [])[1], role = (t.match(/◆ HABITANT · [^—]*—\s*(.*)/) || [])[1];
            var m = (v && v.trim().toLowerCase()) || metierDe(k && k.trim()) || metierDuRole(role) || 'villageois';
            if (m === 'sedentaire') return [20, 7];
            if (m === 'noctambule') return [3, 11];
            if (m === 'garde' || m === 'fixe') return [0, 0];
            return [21, 6];
        },
        etat: function () {
            if (!carteConcernee()) { return []; }
            return ($gameMap && $gameMap._viePNJ || []).map(function (e) {
                var v = e._vie || {};
                return {
                    id: e.eventId(), nom: e.event().name, cle: v.cle, metier: v.metier, visite: e._visite ? e._visite.cle : null,
                    x: e.x, y: e.y, but: v.but, dedans: !!v.dedans, agenda: v.agenda, course: v.course ? v.course.sorte : null,
                    poste: v.poste, logis: v.logis, place: v.place, page: e._pageIndex, scene: e._vieScene > 0
                };
            });
        }
    };

    /* ── les commandes « VIE … » ───────────────────────────────────────── */
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pc.call(this, command, args);
        if (String(command).toUpperCase() !== 'VIE') return;
        var verbe = String(args[0] || '').toLowerCase(), reste = args.slice(1);
        if (verbe === 'arreter' || verbe === 'arrêter') { VieDuVillage.arreter(reste); }
        else if (verbe === 'reprendre') { VieDuVillage.reprendre(reste); }
        else if (verbe === 'tourner') {
            var a = qui(reste[0]), b = reste[1] === 'joueur' ? $gamePlayer : qui(reste[1]);
            if (a && b) { a.turnTowardCharacter(b); }
        } else if (verbe === 'bulle') {
            var e = qui(reste[0]); if (e && la(e)) { e.requestBalloon(Number(reste[1]) || 1); }
        } else if (verbe === 'dire') {
            var e2 = qui(reste[0]), duree = Number(reste[1]) || 150, texte = reste.slice(2).join(' ');
            if (e2 && la(e2) && SceneManager._scene && SceneManager._scene.createCaptionWindow) {
                SceneManager._scene.createCaptionWindow(e2.eventId(), duree, texte.split('|'), ['', 0, 0, 2], 0, undefined, false, false);
            }
        }
    };
})();
