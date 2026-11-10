//=============================================================================
// LaPlage.js — v1.0  ·  La plage du Village de Pêche
// RPG Maker MV   ·   by JOKO
//   À charger APRÈS GALV_Fishing, VieDuVillage, QuetesDuMonde et Habitants.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ La plage : la pêche en mer selon l'heure, la saison et le
 * temps ; Annick qui achète ; le concours ; ce que la mer ramène ; les
 * bouteilles d'Élise et de Sora ; le masqué du ponton, le soir.
 * @author JOKO
 *
 * @param carte
 * @text Carte de la plage
 * @type number
 * @default 33
 *
 * @param etang
 * @text Qui mord, et quand
 * @type note
 * @default "4 | 5-17 | tout | tout | 3-6     sardine\n5 | 6-17 | 1,2 | tout | 2-4     maquereau\n6 | 5-11 | 3,4 | tout | 2-4     hareng\n7 | 8-17 | 2,3 | tout | 1-3     rouget\n8 | 7-20 | 1,2 | tout | 1-2     dorade\n9 | 17-7 | tout | tout | 1-2    bar (le soir, l'aube)\n10 | 0-23 | tout | tout | 0-2   sole\n11 | 21-5 | tout | tout | 1-2   congre (la nuit)\n12 | 4-7 | 3,4 | pluie | 1     le Patriarche (l'aube, l'automne et l'hiver, sous la pluie)\n3 | 0-23 | tout | tout | 1     la pierre (celle de JOKO)"
 * @desc Une ligne par poisson du gestionnaire de GALV_Fishing (son n° « Fish n ») :
 * n° | heures (de-à, la nuit passe minuit) | saisons (1-4 ou « tout ») | temps (pluie, sec, tout) | combien
 *
 * @param caisse
 * @text La caisse du fond : chance, %
 * @type number
 * @default 10
 * @desc La caisse (le Fil du Fond, matériau rare de boss) n'est pas toujours
 * au fond : une partie de pêche sur 10, par défaut.
 *
 * @param numeroCaisse
 * @text La caisse : son n° dans GALV_Fishing
 * @type number
 * @default 13
 *
 * @param prixAnnick
 * @text Annick achète ta pêche à… (% du prix)
 * @type number
 * @default 100
 * @desc 100 = le prix de l'objet. Une boutique ordinaire rachète à 50 %.
 *
 * @param concours
 * @text Le concours de pêche : mois de la saison / jour
 * @type string
 * @default 2/15
 * @desc 2/15 = le 15 du 2e mois de chaque saison. Vide = jamais.
 *
 * @param concoursHeures
 * @text Le concours : de quelle heure à quelle heure
 * @type string
 * @default 8-17
 *
 * @param concoursPrix
 * @text Le concours : ce qu'on gagne (1er, 2e, 3e), en or
 * @type string
 * @default 300, 120, 40
 *
 * @param rivaux
 * @text Le concours : Roul et Tobin (kg, du moins au plus)
 * @type string
 * @default 1.5-5.5, 1.2-5.8
 *
 * @param trouvailles
 * @text Ce que la mer ramène (objet et poids)
 * @type note
 * @default "126 40   coquillage\n127 6    coquillage violet\n128 20   verre poli\n129 25   bois flotté"
 *
 * @param trouvaillesParJour
 * @text Combien chaque matin (de-à)
 * @type string
 * @default 1-3
 *
 * @param lettres
 * @text Les bouteilles d'Élise : combien de lettres
 * @type number
 * @default 5
 *
 * @param ecartLettres
 * @text Jours entre une réponse d'Élise et sa bouteille
 * @type number
 * @default 1
 *
 * @param varNombre
 * @type variable
 * @default 890
 * @param varOr
 * @type variable
 * @default 891
 * @param varPoids
 * @type variable
 * @default 892
 * @param varRang
 * @type variable
 * @default 893
 * @param varRoul
 * @type variable
 * @default 894
 * @param varTobin
 * @type variable
 * @default 895
 * @param varObjet
 * @type variable
 * @default 896
 * @param varDono
 * @type variable
 * @default 897
 * @param varLettre
 * @type variable
 * @default 898
 * @param varSora
 * @text Les coquillages donnés à Sora
 * @type variable
 * @default 899
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA PLAGE — JOKO, 2026-11-09 : « maintenant à la plage », puis, sur
 *  l'analyse (docs/LA_PLAGE.md) : « Mer plutôt, oui », le ponton « c'est juste
 *  un teaser de Dono et de lore, il connaît des choses qu'il ne devrait pas
 *  connaître, tu le vois que le soir », « tout et développe au maximum ».
 * ═══════════════════════════════════════════════════════════════════════════
 *  Les interactions restent des ÉVÉNEMENTS (les répliques sont dans les pages,
 *  JOKO les change dans l'éditeur). Ce plugin ne fait que compter.
 *
 *  LA PÊCHE (GALV_Fishing, la page d'Erwan, le pêcheur)
 *    Plage.etang()       remplit l'étang selon l'heure, la saison, le temps
 *                        (réglage « etang ») ; la caisse du fond une fois sur
 *                        10 ; le jour du concours, un poisson de plus de chaque.
 *    Plage.vendre()      Annick achète tout objet <Poisson> (pas un <Poisson:
 *                        trophée>) : le nombre dans varNombre, l'or dans varOr.
 *    Plage.prise()       le plus lourd d'aujourd'hui, en grammes (0 : rien).
 *
 *  LE CONCOURS (le tableau d'affichage l'annonce : « Roul et Tobin sont
 *  inscrits »)
 *    Plage.concours()    c'est le jour, et l'heure.
 *    Plage.pesee()       pèse ton plus lourd du jour contre Roul et Tobin :
 *                        varPoids, varRoul, varTobin (grammes), varRang (1-3),
 *                        une fois par concours (0 : déjà pesé, ou rien pris).
 *
 *  CE QUE LA MER RAMÈNE
 *    Une page qui commence par le commentaire <Trouvaille> est un endroit du
 *    sable : chaque matin (dès 5 h), 1 à 3 d'entre eux reçoivent une chose
 *    (auto-interrupteur A). Plage.ramasser(this) la donne (son n° d'objet
 *    dans varObjet) et éteint A. Une bouteille d'Élise passe avant tout.
 *
 *  LES BOUTEILLES (Élise, la Ville, 9 ans ; Sora, la plage, 8 ans)
 *    Plage.lettre()      le n° de la lettre en cours (0…), aussi dans varLettre
 *    Plage.lettreLue()   Sora a lu la bouteille : 130 → 131 (sa réponse)
 *    Plage.lettreRendue() Élise a lu la réponse : la suivante part à la mer
 *
 *  LA COLLECTION DE SORA
 *    Plage.aDesCoquillages()  tu en as un (126) ou un violet (127)
 *    Plage.donnerCoquillage() elle prend le violet d'abord : 2 (violet), 1, 0 ;
 *                        combien elle en a reçu de toi : varSora
 *
 *  LE PONTON (le masqué, le soir)
 *    Plage.donoNeuf()    il a quelque chose de neuf à dire ce soir
 *    Plage.donoSuivant() le n° de ce qu'il dit (aussi dans varDono)
 *
 *  SCRIPT :  Plage.etat()  → ce que la plage sait, là, maintenant
 * ═══════════════════════════════════════════════════════════════════════════
 */
var Plage = Plage || {};
(function () {
    'use strict';
    var P = PluginManager.parameters('LaPlage');
    function nombre(x, d) { var n = Number(x); return isNaN(n) || x === '' || x == null ? d : n; }
    function note(x) { var s = String(x || ''); if (/^"/.test(s)) { try { s = JSON.parse(s); } catch (e) {} } return s; }
    var CARTE = nombre(P.carte, 33);
    var CAISSE = nombre(P.caisse, 10), N_CAISSE = nombre(P.numeroCaisse, 13), PRIX = nombre(P.prixAnnick, 100);
    var V = { nombre: nombre(P.varNombre, 890), or: nombre(P.varOr, 891), poids: nombre(P.varPoids, 892), rang: nombre(P.varRang, 893),
        roul: nombre(P.varRoul, 894), tobin: nombre(P.varTobin, 895), objet: nombre(P.varObjet, 896), dono: nombre(P.varDono, 897), lettre: nombre(P.varLettre, 898), sora: nombre(P.varSora, 899) };
    var LETTRES = nombre(P.lettres, 5), ECART = nombre(P.ecartLettres, 1);
    function deA(t, d) { var m = /(-?[\d.]+)\s*-\s*(-?[\d.]+)/.exec(String(t || '')); return m ? [Number(m[1]), Number(m[2])] : d; }
    var CONCOURS = /(\d+)\s*\/\s*(\d+)/.exec(String(P.concours === undefined ? '2/15' : P.concours));
    var H_CONCOURS = deA(P.concoursHeures || '8-17', [8, 17]);
    var PRIX_CONCOURS = String(P.concoursPrix || '300, 120, 40').split(',').map(function (x) { return nombre(x.trim(), 0); });
    var RIVAUX = String(P.rivaux || '1.5-5.5, 1.2-5.8').split(',').map(function (x) { return deA(x, [1.5, 5.5]); });
    var PAR_JOUR = deA(P.trouvaillesParJour || '1-3', [1, 3]);

    // l'étang : « 4 | 5-17 | tout | tout | 3-6 »
    var ETANG = note(P.etang || '').split('\n').map(function (l) {
        var c = l.split('|').map(function (x) { return x.trim(); });
        if (c.length < 5 || !/^\d+$/.test(c[0])) return null;
        var saisons = /tout/i.test(c[2]) ? null : c[2].split(',').map(Number);
        return { id: Number(c[0]), heures: deA(c[1], [0, 23]), saisons: saisons, temps: c[3].toLowerCase().split(/\s/)[0], combien: deA(c[4].split(/\s/)[0], [Number(c[4]) || 1, Number(c[4]) || 1]) };
    }).filter(Boolean);
    var TROUV = note(P.trouvailles || '').split('\n').map(function (l) { var m = /^\s*(\d+)\s+(\d+)/.exec(l); return m ? { objet: Number(m[1]), poids: Number(m[2]) } : null; }).filter(Boolean);
    var BOUTEILLE = 130, REPONSE = 131;

    /* ── la mémoire (dans la sauvegarde) ─────────────────────────────────── */
    function mem() {
        var s = $gameSystem._plage = $gameSystem._plage || {};
        s.prise = s.prise || { jour: -1, poids: 0, fish: 0, n: 0 };
        s.pris = s.pris || {};
        s.pesees = s.pesees || {};
        s.tJour = s.tJour === undefined ? -1 : s.tJour; s.tPoses = s.tPoses || {}; s.tPris = s.tPris || {};
        s.lettres = s.lettres || { n: 0, ou: 'mer', jour: 0 };
        s.dono = s.dono || { n: 0, jour: -1 };
        return s;
    }
    function heure() { return $gameSystem.hour ? $gameSystem.hour() : 12; }
    function jour() { return window.Habitants && Habitants.jour ? Habitants.jour() : ($gameSystem.day ? $gameSystem.day() : 1); }
    // le jour « de la plage » commence à 5 h : avant, c'est encore la veille (la nuit)
    function jourDeMer() { return jour() - (heure() < 5 ? 1 : 0); }
    // le soir du masqué : de 18 h à minuit (la page de l'événement le dit aussi)
    function saison() { var s = $gameSystem.season ? $gameSystem.season() : 1; return s >= 1 && s <= 4 ? s : 1; }
    function pluie() {
        if (window.Meteo && Meteo.est && (Meteo.est('pluie') || Meteo.est('orage') || Meteo.est('tempete'))) return true;
        var t = $gameScreen && $gameScreen.weatherType(); return t === 'rain' || t === 'storm';
    }
    function dansHeures(h, a) { return a[0] <= a[1] ? h >= a[0] && h <= a[1] : h >= a[0] || h <= a[1]; }
    // un hasard qui ne change pas de toute la journée (le même que Habitants)
    function graine(t) {
        var h = 2166136261; for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); }
        h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
        return (h >>> 0) / 4294967296;
    }
    function entre(a, b, r) { return a + Math.floor(r * (b - a + 1)); }

    /* ── la pêche ───────────────────────────────────────────────────────── */
    Plage.concours = function (sansHeure) {
        if (!CONCOURS || !$gameSystem.month || !$gameSystem.day) return false;
        // le mois DANS la saison : MOG le compte à part (_season_interval[0], 0 = le premier), comme l'Admission de Habitants
        var moisDeSaison = $gameSystem._season_interval ? $gameSystem._season_interval[0] + 1 : (($gameSystem.month() - 1) % 3) + 1;
        if (moisDeSaison !== Number(CONCOURS[1]) || $gameSystem.day() !== Number(CONCOURS[2])) return false;
        return sansHeure ? true : dansHeures(heure(), H_CONCOURS);
    };
    Plage.qui = function () {                 // qui mord, maintenant (pour les bancs, et l'aide)
        var h = heure(), s = saison(), p = pluie();
        return ETANG.filter(function (f) {
            if (!dansHeures(h, f.heures)) return false;
            if (f.saisons && f.saisons.indexOf(s) < 0) return false;
            if (f.temps === 'pluie' && !p) return false;
            if (f.temps === 'sec' && p) return false;
            return !!(window.Galv && Galv.FISH && Galv.FISH.fish[f.id]);
        });
    };
    Plage.etang = function () {
        if (!window.Galv || !Galv.FISH) return;
        Galv.FISH.clearPond();
        var plus = Plage.concours() ? 1 : 0;
        Plage.qui().forEach(function (f) {
            var a = f.combien[0] + plus, b = f.combien[1] + plus;
            if (b > 0) Galv.FISH.randFish(f.id, Math.max(0, a), b);
        });
        if (Galv.FISH.fish[N_CAISSE] && Math.random() * 100 < CAISSE) Galv.FISH.addFish(N_CAISSE);
    };
    // chaque prise : le plus lourd du jour (le concours), et le compte
    if (window.Galv && Galv.FISH && Galv.FISH.addRecords) {
        var _rec = Galv.FISH.addRecords;
        Galv.FISH.addRecords = function (fishId, length, weight) {
            _rec.apply(this, arguments);
            var m = mem(), j = jour(), f = Galv.FISH.fish[fishId];
            if (m.prise.jour !== j) m.prise = { jour: j, poids: 0, fish: 0, n: 0 };
            m.prise.n++;
            m.pris[fishId] = (m.pris[fishId] || 0) + 1;
            if (f && f.stats && Number(weight) > m.prise.poids) { m.prise.poids = Number(weight); m.prise.fish = fishId; }
        };
    }
    Plage.prise = function () { var m = mem(); return m.prise.jour === jour() ? Math.round(m.prise.poids * 1000) : 0; };
    Plage.prisNombre = function (fishId) { return mem().pris[fishId] || 0; };
    function estPoisson(it) { return it && it.meta && it.meta.Poisson !== undefined; }
    function trophee(it) { return estPoisson(it) && /troph/i.test(String(it.meta.Poisson)); }
    Plage.vendre = function () {
        var n = 0, or = 0;
        $gameParty.items().forEach(function (it) {
            if (!estPoisson(it) || trophee(it)) return;
            var k = $gameParty.numItems(it);
            n += k; or += Math.floor(it.price * PRIX / 100) * k;
            $gameParty.loseItem(it, k);
        });
        if (or > 0) $gameParty.gainGold(or);
        $gameVariables.setValue(V.nombre, n); $gameVariables.setValue(V.or, or);
        return n;
    };
    Plage.aDuPoisson = function () { return $gameParty.items().some(function (it) { return estPoisson(it) && !trophee(it); }); };
    Plage.pesee = function () {
        var m = mem(), k = 'c' + jour();
        if (m.pesees[k]) { $gameVariables.setValue(V.rang, 0); return 0; }
        var moi = Plage.prise();
        var r = RIVAUX.map(function (x, i) { var g = graine('concours#' + k + '#' + i); return Math.round((x[0] + g * (x[1] - x[0])) * 1000); });
        $gameVariables.setValue(V.poids, moi); $gameVariables.setValue(V.roul, r[0]); $gameVariables.setValue(V.tobin, r[1] || 0);
        if (moi <= 0) { $gameVariables.setValue(V.rang, 0); return 0; }
        var rang = 1 + r.filter(function (x) { return x > moi; }).length;
        m.pesees[k] = rang;
        $gameVariables.setValue(V.rang, rang);
        var gain = PRIX_CONCOURS[rang - 1] || 0;
        if (gain > 0) $gameParty.gainGold(gain);
        return rang;
    };
    Plage.dejaPese = function () { return !!mem().pesees['c' + jour()]; };

    /* ── ce que la mer ramène ───────────────────────────────────────────── */
    function endroits() {
        if (!$gameMap || $gameMap.mapId() !== CARTE) return [];
        return $gameMap.events().filter(function (e) {
            var p = e.event().pages[0]; if (!p) return false;
            return p.list.some(function (c) { return (c.code === 108 || c.code === 408) && /<Trouvaille>/i.test(String(c.parameters[0])); });
        }).map(function (e) { return e.eventId(); }).sort(function (a, b) { return a - b; });
    }
    function tirer(j, ids) {
        var poses = {}, libres = ids.slice(), r = function (t) { return graine('mer#' + j + '#' + t); };
        var n = Math.min(libres.length, entre(PAR_JOUR[0], PAR_JOUR[1], r('n')));
        var m = mem(), L = m.lettres;
        // la bouteille d'Élise passe avant tout ; pas ramassée hier, elle est encore là, au même endroit
        if (L.ou === 'mer' && L.n < LETTRES && j >= L.jour && libres.length) {
            var hier = Object.keys(m.tPoses || {}).filter(function (k) { return m.tPoses[k] === BOUTEILLE && !(m.tPris || {})[k] && libres.indexOf(Number(k)) >= 0; })[0];
            var b = hier !== undefined ? Number(hier) : libres[Math.floor(r('b') * libres.length)];
            libres.splice(libres.indexOf(b), 1);
            poses[b] = BOUTEILLE; n = Math.max(0, n - 1);
        }
        var total = TROUV.reduce(function (s, t) { return s + t.poids; }, 0);
        for (var i = 0; i < n && libres.length && total > 0; i++) {
            var ev = libres.splice(Math.floor(r('e' + i) * libres.length), 1)[0];
            var x = r('o' + i) * total, o = TROUV[0].objet;
            for (var k = 0; k < TROUV.length; k++) { x -= TROUV[k].poids; if (x < 0) { o = TROUV[k].objet; break; } }
            poses[ev] = o;
        }
        return poses;
    }
    Plage.preparer = function () {
        var ids = endroits(); if (!ids.length) return;
        var m = mem(), j = jourDeMer();
        if (m.tJour !== j) { m.tJour = j; m.tPoses = tirer(j, ids); m.tPris = {}; }
        // une bouteille qui attend depuis un autre jour reste là où elle est
        ids.forEach(function (id) {
            var la = !!m.tPoses[id] && !m.tPris[id];
            var cle = [CARTE, id, 'A'];
            if (!!$gameSelfSwitches.value(cle) !== la) $gameSelfSwitches.setValue(cle, la);
        });
    };
    Plage.ramasser = function (interp) {
        var m = mem(), id = interp && interp._eventId, o = m.tPoses[id];
        if (!o || m.tPris[id]) { $gameVariables.setValue(V.objet, 0); return 0; }
        m.tPris[id] = true;
        $gameParty.gainItem($dataItems[o], 1);
        if (o === BOUTEILLE) m.lettres.ou = 'joueur';
        $gameSelfSwitches.setValue([CARTE, id, 'A'], false);
        $gameVariables.setValue(V.objet, o);
        return o;
    };
    /* ── les bouteilles d'Élise et de Sora ──────────────────────────────── */
    Plage.lettre = function () { var n = mem().lettres.n; $gameVariables.setValue(V.lettre, n); return n; };
    Plage.lettresFinies = function () { return mem().lettres.n >= LETTRES; };
    Plage.lettreLue = function () {               // chez Sora : la bouteille devient sa réponse
        var L = mem().lettres;
        $gameParty.loseItem($dataItems[BOUTEILLE], 1);
        $gameParty.gainItem($dataItems[REPONSE], 1);
        L.ou = 'elise';
    };
    Plage.lettreRendue = function () {            // chez Élise : elle lit, et la suivante part à la mer
        var L = mem().lettres;
        $gameParty.loseItem($dataItems[REPONSE], 1);
        L.n++;
        if (L.n >= LETTRES) { L.ou = 'fini'; return; }
        L.ou = 'mer'; L.jour = jour() + ECART;
        if ($gameMap && $gameMap.mapId() === CARTE) Plage.preparer();
    };

    /* ── la collection de Sora ───────────────────────────────────────────── */
    var COQ = 126, VIOLET = 127;
    Plage.aDesCoquillages = function () { return $gameParty.hasItem($dataItems[COQ]) || $gameParty.hasItem($dataItems[VIOLET]); };
    Plage.coquillages = function () { var n = mem().sora || 0; $gameVariables.setValue(V.sora, n); return n; };
    Plage.donnerCoquillage = function () {
        var m = mem(), r = 0;
        if ($gameParty.hasItem($dataItems[VIOLET])) { $gameParty.loseItem($dataItems[VIOLET], 1); m.soraViolets = (m.soraViolets || 0) + 1; r = 2; }
        else if ($gameParty.hasItem($dataItems[COQ])) { $gameParty.loseItem($dataItems[COQ], 1); r = 1; }
        if (r) m.sora = (m.sora || 0) + 1;
        $gameVariables.setValue(V.objet, r === 2 ? VIOLET : r === 1 ? COQ : 0);      // lequel : la page de Sora le dit
        Plage.coquillages();
        return r;
    };

    /* ── le ponton : le masqué, le soir ─────────────────────────────────── */
    // un soir commence à 18 h ; ce qui est dit après minuit compte pour le soir d'avant
    function soir() { return jour() - (heure() < 12 ? 1 : 0); }
    Plage.donoNeuf = function (max) { var d = mem().dono; return d.jour !== soir() && d.n < (max || 99); };
    Plage.donoSuivant = function () {
        var d = mem().dono;
        if (d.jour !== soir()) { d.n++; d.jour = soir(); }
        $gameVariables.setValue(V.dono, d.n);
        return d.n;
    };
    Plage.dono = function () { return mem().dono.n; };

    /* ── la carte : chaque matin, et en arrivant ────────────────────────── */
    var _setupEv = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function () {
        _setupEv.apply(this, arguments);
        if (this.mapId() === CARTE && $gameSystem) Plage.preparer();
    };
    var _upd = Scene_Map.prototype.update, compte = 0;
    Scene_Map.prototype.update = function () {
        _upd.apply(this, arguments);
        if (++compte % 300 === 0 && $gameMap.mapId() === CARTE && mem().tJour !== jourDeMer()) Plage.preparer();
    };

    Plage.etat = function () {
        var m = mem();
        return { qui: Plage.qui().map(function (f) { return f.id; }), concours: Plage.concours(), prise: Plage.prise(), trouvailles: m.tPoses, ramassees: m.tPris,
            lettres: m.lettres, dono: m.dono, pluie: pluie(), saison: saison(), heure: heure() };
    };
    Plage._mem = mem;
    window.Plage = Plage;
})();
