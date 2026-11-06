//=============================================================================
// Habitants.js — v1.4  ·  Les gens vivent leur vie
// RPG Maker MV   ·   pour JOKO
//   À charger APRÈS MOG_TimeSystem (il lui demande l'heure et la saison).
//=============================================================================
/*:
 * @plugindesc v1.4 ■ Les habitants se souviennent de toi, ont des horaires,
 * des amitiés, des cadeaux et un anniversaire, arrivent et repartent à pied
 * par la porte, et changent de propos avec la
 * saison et l'heure.
 * @author JOKO
 *
 * @param varVisites
 * @text Variable : visites à ce PNJ
 * @type variable
 * @default 880
 *
 * @param varJours
 * @text Variable : jours depuis la dernière visite
 * @type variable
 * @default 881
 *
 * @param varTirage
 * @text Variable : tirage au hasard
 * @type variable
 * @default 882
 *
 * @param varMoment
 * @text Variable : moment du jour (1 matin · 2 après-midi · 3 soir · 4 nuit)
 * @type variable
 * @default 883
 *
 * @param varSaison
 * @text Variable : saison (1 printemps · 2 été · 3 automne · 4 hiver)
 * @type variable
 * @default 884
 *
 * @param varAffinite
 * @text Variable : affinité avec ce PNJ
 * @type variable
 * @default 885
 *
 * @param affiniteParJour
 * @text Affinité gagnée par jour où l'on se parle
 * @type number
 * @min 0
 * @default 1
 * @desc La première conversation de chaque jour de jeu rapproche (v1.3). Ce
 * sont les jours passés à se parler qui ouvrent les confidences.
 *
 * @param joursSouvenir
 * @text Pendant combien de jours on parle de tes exploits
 * @type number
 * @min 1
 * @default 14
 *
 * @param chanceSouvenir
 * @text Chance qu'un habitant en parle (%)
 * @type number
 * @min 0
 * @max 100
 * @default 60
 * @desc Chaque habitant tire une fois par exploit : il en parle, ou il n'en dit
 * rien. Personne ne le répète deux fois.
 *
 * @param joursAdmission
 * @text Durée de l'Admission (jours, au début de chaque saison)
 * @type number
 * @min 0
 * @default 7
 * @desc La Bible : « Quatre fois par an, au début de chaque saison, la
 * Chancellerie ouvre une Admission » ; « la semaine d'Admission ».
 *
 * @param veillee
 * @text La Veillée du Retour (mois/jour)
 * @type string
 * @default 9/30
 * @desc La Bible ne donne pas la date (« la nuit où l'on dit que le Premier a
 * disparu »). Défaut : la dernière nuit de l'automne. À JOKO de la fixer.
 *
 * @param phrasesQuete
 * @text Ce qu'on dit d'une quête finie (%1 = son titre)
 * @type string[]
 * @default ["On parle de toi en ville. « %1 », c'est fini, à ce qu'il paraît.","Alors c'est toi, pour « %1 » ? Ça se raconte, tu sais.","« %1 »… J'ai entendu. Bien joué."]
 *
 * @param phrasesBoss
 * @text Ce qu'on dit d'un boss battu (%1 = son nom)
 * @type string[]
 * @default ["Il paraît que tu as battu %1. Les gens ne parlent que de ça.","%1, vaincu ? Par toi ? … Bon. Je te crois.","Tu as affronté %1 et tu es là à me parler. Chapeau."]
 *
 * @param phrasesAdmission
 * @text Ce qu'on dit pendant l'Admission
 * @type string[]
 * @default ["C'est la semaine d'Admission. La ville est pleine de recrues qui se croient déjà licenciées.","L'Admission, cette semaine : examen au Hall de l'Égide, puis le Champ d'Épreuve. Les guildes tiennent leurs salons.","Tu as vu toutes ces recrues ? C'est l'Admission. Réussir donne le droit de travailler, pas un rang."]
 *
 * @param phrasesVeillee
 * @text Ce qu'on dit le jour de la Veillée du Retour
 * @type string[]
 * @default ["Ce soir, c'est la Veillée du Retour. La nuit où l'on dit que le Premier a disparu.","La Veillée, ce soir. À Haute-Taville, la Basse-Brume tient un marché de nuit. Ici, on veille sur la place.","Tu veilles ce soir ? Tout le monde reste dehors, pour la Veillée du Retour."]
 *
 * @param varCadeau
 * @text Variable : l'objet qu'on offre
 * @type variable
 * @default 888
 * @desc v1.4 : « Offrir… » range ici le numéro de l'objet choisi.
 *
 * @param cadeauAdore
 * @text Affinité : un objet qu'il adore
 * @type number
 * @default 2
 *
 * @param cadeauAime
 * @text Affinité : un objet qu'il aime
 * @type number
 * @default 1
 *
 * @param cadeauNeutre
 * @text Affinité : un autre objet
 * @type number
 * @default 0
 * @desc Un objet qu'il déteste, il te le rend : rien n'est perdu.
 *
 * @param affiniteScene
 * @text Affinité : une scène d'amitié vue
 * @type number
 * @default 1
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES GENS VIVENT LEUR VIE
 * ═══════════════════════════════════════════════════════════════════════════
 *  1. LA MÉMOIRE — en tête d'un dialogue, une ligne de Script :
 *         Habitants.prep(this);
 *     remplit, pour CE PNJ (carte + numéro d'événement) :
 *       · Visites          : 1 la première fois, puis 2, 3…
 *       · Jours depuis     : jours de jeu depuis la visite précédente
 *       · Moment           : 1 matin (5-11 h) · 2 après-midi (12-17 h)
 *                            3 soir (18-21 h) · 4 nuit (22-4 h)
 *       · Saison           : 1 printemps · 2 été · 3 automne · 4 hiver
 *       · Affinité         : ce que tu as construit avec lui
 *     Les conditions de l'événement lisent ces variables : tout se règle
 *     dans l'éditeur, sans script.
 *         Habitants.affinite(this, 2);   ajoute 2 d'affinité à ce PNJ
 *
 *  2. LES HORAIRES — dans la Note de l'événement :
 *         <Horaire: 17-2>        présent de 17 h à 2 h (passe minuit)
 *         <Saisons: 1,2,3>       absent l'hiver
 *     Hors de ses heures, le PNJ n'a plus de page : il n'est pas là. Il
 *     revient tout seul quand l'heure tourne, même si l'on reste sur la carte.
 *
 *  3. LE PASSAGE — un PNJ qui a <Horaire:> ou <Saisons:> (ou <Passage> dans
 *     sa Note, pour ceux dont la page dépend d'un interrupteur de moment
 *     « TS · … ») ne clignote pas :
 *       · quand son heure finit, il MARCHE jusqu'à la sortie la plus proche
 *         (l'événement qui transfère le joueur), puis il n'est plus là ;
 *       · quand son heure vient, il ENTRE par cette sortie et marche jusqu'à
 *         sa place, puis reprend son orientation.
 *     Bloqué plus de huit secondes, il passe quand même (il « se
 *     téléporte »). On ne part pas au milieu d'une phrase : le PNJ à qui l'on
 *     parle attend la fin du dialogue.
 *         <Sortie: 20,39>        une autre sortie que la plus proche
 *
 *  4. CE QU'ILS RETIENNENT (v1.3)
 *     · Une quête finie, un boss battu : pendant « joursSouvenir » jours, chaque
 *       habitant peut en parler, une fois, avant son menu. Ses mots sont
 *       génériques (les réglages « phrasesQuete », « phrasesBoss ») : JOKO les
 *       change dans le gestionnaire de plugins.
 *     · L'AFFINITÉ monte d'elle-même : +1 le premier jour où l'on se parle,
 *       puis chaque jour suivant. C'est elle qui ouvre les confidences (le
 *       sujet personnel des fiches), plus seulement le nombre de visites.
 *
 *  5. LE CALENDRIER DE LA BIBLE (v1.3)
 *     · L'ADMISSION — les « joursAdmission » premiers jours de chaque saison.
 *       <Admission> dans la Note : présent seulement pendant l'Admission.
 *     · LA VEILLÉE DU RETOUR — le jour réglé (« veillee »). VieDuVillage garde
 *       les gens dehors jusqu'à 2 h. <Veillee> dans la Note (v1.4) : présent
 *       seulement cette nuit-là (le marchand de la Veillée).
 *     Le jour même, un habitant le dit (« phrasesAdmission », « phrasesVeillee »).
 *         Habitants.admission()   Habitants.veillee()
 *
 *  6. LES PERSONNAGES (v1.4) — ce que les pages lisent :
 *         Habitants.ici(this, 'bar')      il est au bar (aussi : 'place', 'repos',
 *                                          'ailleurs' — en visite —, 'travail', 'nuit')
 *         Habitants.aCote(this, 'Roul')   Roul est là, à 5 cases au plus
 *         Habitants.prochaine(this, [3, 6, 10])   la scène d'amitié à proposer
 *         Habitants.scene(this, n)        0 pas encore · 1 promise · 2 vue
 *         Habitants.promettre(this, n) / Habitants.vue(this, n)
 *         Habitants.rdv(33, 21, 24)       on est au Village de Pêche, de 21 h à minuit
 *         Habitants.offert(this)          il a déjà reçu un cadeau aujourd'hui
 *         Habitants.offrir(this, 'adore') l'objet choisi est donné (rendu s'il le
 *                                          déteste) ; l'affinité suit les réglages,
 *                                          double le jour de son anniversaire
 *         Habitants.anniversaire('4/12')  c'est aujourd'hui (mois/jour)
 *
 *  Commandes de plugin : aucune.
 */
var Habitants = window.Habitants || {};
window.Habitants = Habitants;
(function () {
    'use strict';
    var P = PluginManager.parameters('Habitants');
    var V = {
        visites: Number(P.varVisites || 880), jours: Number(P.varJours || 881), tirage: Number(P.varTirage || 882),
        moment: Number(P.varMoment || 883), saison: Number(P.varSaison || 884), affinite: Number(P.varAffinite || 885)
    };
    Habitants.V = V;
    var PAR_JOUR = Number(P.affiniteParJour !== undefined ? P.affiniteParJour : 1);
    var JOURS_SOUVENIR = Math.max(1, Number(P.joursSouvenir || 14));
    var CHANCE_SOUVENIR = Math.max(0, Math.min(100, Number(P.chanceSouvenir !== undefined ? P.chanceSouvenir : 60))) / 100;
    var JOURS_ADMISSION = Math.max(0, Number(P.joursAdmission !== undefined ? P.joursAdmission : 7));
    var VEILLEE = String(P.veillee || '9/30').split('/').map(Number);
    function liste(x, defaut) { try { var l = JSON.parse(x); return Array.isArray(l) && l.length ? l : defaut; } catch (e) { return defaut; } }
    var PHRASES = {
        quete: liste(P.phrasesQuete, ['On parle de toi en ville. « %1 », c\'est fini, à ce qu\'il paraît.']),
        boss: liste(P.phrasesBoss, ['Il paraît que tu as battu %1. Les gens ne parlent que de ça.']),
        admission: liste(P.phrasesAdmission, ['C\'est la semaine d\'Admission.']),
        veillee: liste(P.phrasesVeillee, ['Ce soir, c\'est la Veillée du Retour.'])
    };

    function heure() { return $gameSystem.hour ? $gameSystem.hour() : 12; }
    // ⚠ v1.3 : day() de MOG est le jour DU MOIS (1 à 30). « Jours depuis » passait
    //   en négatif d'un mois à l'autre, et le retour après sept jours ne venait
    //   jamais. On compte les jours depuis le début de la partie.
    function jour() {
        if ($gameSystem.total_days) { try { return $gameSystem.total_days(); } catch (e) {} }
        return $gameSystem.day ? $gameSystem.day() : 1;
    }
    Habitants.jour = jour;
    function saison() { var s = $gameSystem.season ? $gameSystem.season() : 1; return s >= 1 && s <= 4 ? s : 1; }
    function moment(h) { return h >= 5 && h < 12 ? 1 : h >= 12 && h < 18 ? 2 : h >= 18 && h < 22 ? 3 : 4; }
    function memoire() { return ($gameSystem._habitants = $gameSystem._habitants || {}); }
    // la copie de passage d'un voyageur (AlleesEtVenues) est le même personnage : même mémoire
    // v1.4 : une page <Est: 29:28> (Hilde à l'épicerie) est la même personne que 29:28 : même amitié
    function cle(i) {
        var v = window.AlleesEtVenues && AlleesEtVenues.cleInterpreteur ? AlleesEtVenues.cleInterpreteur(i) : null;
        if (v) return v;
        var e = i._eventId > 0 && $gameMap && (i._mapId || $gameMap.mapId()) === $gameMap.mapId() ? $gameMap.event(i._eventId) : null;
        return (e && estDe(e)) || ((i._mapId || $gameMap.mapId()) + ':' + i._eventId);
    }
    function estDe(e) {
        if (e._habEstPage === e._pageIndex) return e._habEst;
        var p = e._pageIndex >= 0 ? e.page() : null, r = null;
        if (p) for (var k = 0; k < p.list.length; k++) {
            var c = p.list[k]; if (c.code !== 108 && c.code !== 408) break;
            var m = /<Est:\s*(\d+)\s*:\s*(\d+)\s*>/i.exec(String(c.parameters[0]));
            if (m) { r = m[1] + ':' + m[2]; break; }
        }
        e._habEstPage = e._pageIndex; e._habEst = r;
        return r;
    }

    Habitants.prep = function (interp) {
        var m = memoire(), k = cle(interp), f = m[k] = m[k] || { visites: 0, jour: null, affinite: 0 };
        var j = jour();
        // v1.3 : une partie d'avant — ses visites comptent comme des jours passés à se parler
        if (!f.v13) { f.v13 = true; f.affinite = Math.max(f.affinite || 0, Math.min(f.visites || 0, 6)); if (f.jour !== null && f.jour > j) f.jour = j; }
        $gameVariables.setValue(V.jours, f.jour === null ? 0 : Math.max(0, j - f.jour));
        if (f.jour !== j) f.affinite += PAR_JOUR;            // le premier mot du jour
        f.visites++; f.jour = j;
        $gameVariables.setValue(V.visites, f.visites);
        $gameVariables.setValue(V.moment, moment(heure()));
        $gameVariables.setValue(V.saison, saison());
        $gameVariables.setValue(V.affinite, f.affinite);
        preparerSouvenir(interp, f);
    };
    Habitants.affinite = function (interp, n) {
        var m = memoire(), k = cle(interp), f = m[k] = m[k] || { visites: 0, jour: null, affinite: 0 };
        f.affinite += n;
        $gameVariables.setValue(V.affinite, f.affinite);
    };

    /* ── les personnages (v1.4) : le lieu, les autres, l'amitié, les cadeaux ── */
    var V_CADEAU = Number(P.varCadeau || 888);
    var POINTS = { adore: Number(P.cadeauAdore !== undefined ? P.cadeauAdore : 2), aime: Number(P.cadeauAime !== undefined ? P.cadeauAime : 1),
        neutre: Number(P.cadeauNeutre !== undefined ? P.cadeauNeutre : 0), deteste: 0 };
    var PAR_SCENE = Number(P.affiniteScene !== undefined ? P.affiniteScene : 1);
    function fiche(interp) { var m = memoire(), k = cle(interp); return (m[k] = m[k] || { visites: 0, jour: null, affinite: 0 }); }
    function evDe(interp) { return interp && interp.character ? interp.character(0) : null; }
    // le nom d'un habitant : sa ligne « ◆ FICHE · Nom — … » (écrite par l'outil), sinon « ◆ HABITANT · Nom — … »
    // (que JOKO a pu réécrire : « Hugo », « Yvon », « Emma Fieldensong est une… »)
    function nomDe(e) {
        if (!e || !e.page || !e.page()) return '';
        if (e._habNomPage === e._pageIndex) return e._habNom;
        var l = e.page().list, n = '', h = '';
        for (var i = 0; i < l.length && (l[i].code === 108 || l[i].code === 408 || l[i].code === 356 || l[i].code === 355); i++) {
            var t = String(l[i].parameters[0]), m = /^◆ FICHE · ([^—]+)/.exec(t), m2 = /^◆ HABITANT · ([^—]+)/.exec(t);
            if (m) { n = m[1].trim(); break; }
            if (m2 && !h) h = m2[1].trim();
        }
        n = n || h;
        e._habNomPage = e._pageIndex; e._habNom = n;
        return n;
    }
    Habitants.nomDe = nomDe;
    Habitants.ici = function (interp, lieu) {
        var e = evDe(interp), h = heure();
        var bar = $gameMap.mapId() === 46, place = !!(e && e._vie && e._vie.but === 'place');
        var repos = !!(window.VieDuVillage && VieDuVillage.repos && VieDuVillage.repos());
        var ailleurs = !!(e && e._visite) && !bar;
        if (lieu === 'bar') return bar;
        if (lieu === 'place') return place;
        if (lieu === 'repos') return repos && !bar;
        if (lieu === 'ailleurs') return ailleurs;
        if (lieu === 'nuit') return !bar && (h >= 22 || h < 5);
        if (lieu === 'travail') return !bar && !place && !repos && !ailleurs && h >= 5 && h < 22;
        return false;
    };
    Habitants.aCote = function (interp, nom, r) {
        var e = evDe(interp); if (!e) return false;
        r = r || 5; nom = String(nom).toLowerCase();
        return $gameMap.events().some(function (o) {
            return o !== e && !o._erased && o._pageIndex >= 0 && o.opacity() > 0 && nomDe(o).toLowerCase() === nom &&
                Math.abs(o.x - e.x) + Math.abs(o.y - e.y) <= r;
        });
    };
    Habitants.scene = function (interp, n) { var s = fiche(interp).scenes || []; return s[n] || 0; };
    Habitants.promettre = function (interp, n) { var f = fiche(interp); (f.scenes = f.scenes || [])[n] = 1; };
    Habitants.vue = function (interp, n) {
        var f = fiche(interp); (f.scenes = f.scenes || [])[n] = 2;
        f.affinite += PAR_SCENE; $gameVariables.setValue(V.affinite, f.affinite);
    };
    // la prochaine scène à proposer : la première pas encore promise, les précédentes vues, l'amitié assez haute
    Habitants.prochaine = function (interp, paliers) {
        var f = fiche(interp), s = f.scenes || [];
        for (var i = 0; i < paliers.length; i++) {
            if (s[i] === 2) continue;
            return !s[i] && f.affinite >= paliers[i] ? i : -1;
        }
        return -1;
    };
    Habitants.rdv = function (carte, de, a) {
        var h = heure();
        return $gameMap.mapId() === carte && (de <= a ? h >= de && h < a : h >= de || h < a);
    };
    Habitants.anniversaire = function (md) {
        if (!$gameSystem || !$gameSystem.month) return false;
        var x = String(md).split('/').map(Number);
        return $gameSystem.month() === x[0] && $gameSystem.day() === x[1];
    };
    Habitants.offert = function (interp) { return fiche(interp).cadeau === jour(); };
    Habitants.offrir = function (interp, genre, anniv) {
        var f = fiche(interp), id = $gameVariables.value(V_CADEAU), objet = $dataItems[id];
        if (!objet || genre === 'deteste') return;                 // il te le rend
        $gameParty.loseItem(objet, 1);
        f.cadeau = jour();
        f.affinite += (POINTS[genre] || 0) * (anniv ? 2 : 1);
        $gameVariables.setValue(V.affinite, f.affinite);
    };

    /* ── les horaires ───────────────────────────────────────────────────── */
    function lire(ev) {
        if (ev._habHoraire !== undefined) return;
        var n = (ev.event() && ev.event().note) || '';
        var h = n.match(/<Horaire:\s*(\d+)\s*-\s*(\d+)\s*>/i), s = n.match(/<Saisons:\s*([\d,\s]+)>/i);
        var so = n.match(/<Sortie:\s*(\d+)\s*,\s*(\d+)\s*>/i);
        ev._habHoraire = h ? [Number(h[1]), Number(h[2])] : null;
        ev._habSaisons = s ? s[1].split(',').map(Number) : null;
        ev._habAdmission = /<Admission>/i.test(n);
        ev._habVeillee = /<Veill[ée]e>/i.test(n);                 // v1.4 : là seulement la nuit de la Veillée du Retour
        ev._habPassage = !!(h || s || ev._habAdmission || ev._habVeillee || /<Passage>/i.test(n) ||
            (window.AlleesEtVenues && AlleesEtVenues.passeParLaPorte && AlleesEtVenues.passeParLaPorte(ev)));
        ev._habSortieDite = so ? { x: Number(so[1]), y: Number(so[2]) } : null;
    }
    Habitants.present = function (ev) {
        lire(ev);
        // AlleesEtVenues : la copie d'un voyageur n'est là qu'à son heure ; un voyageur parti n'est plus chez lui
        if (window.AlleesEtVenues && AlleesEtVenues.presence) {
            var av = AlleesEtVenues.presence(ev);
            if (av === false) return false;
            if (av === true) return true;
        }
        if (ev._habAdmission && !Habitants.admission()) return false;
        if (ev._habVeillee && !Habitants.veillee()) return false;
        if (ev._habSaisons && ev._habSaisons.indexOf(saison()) < 0) return false;
        if (!ev._habHoraire) return true;
        var a = ev._habHoraire[0], b = ev._habHoraire[1], h = heure();
        return a <= b ? h >= a && h < b : h >= a || h < b;
    };
    var _page = Game_Event.prototype.findProperPageIndex;
    Game_Event.prototype.findProperPageIndex = function () {
        if (!Habitants.present(this)) return -1;
        return _page.call(this);
    };
    var _upd = Game_Map.prototype.update;
    Game_Map.prototype.update = function (sceneActive) {
        this._habBudget = BUDGET;
        _upd.call(this, sceneActive);
        this._habPret = true;
        var h = heure() + ':' + saison();
        if (this._habHeure !== h) { var avant = this._habHeure; this._habHeure = h; if (avant !== undefined) this.requestRefresh(); }
    };
    var _setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function (mapId) {
        this._habPret = false; this._habSorties = null; this._habDistances = null;
        _setup.call(this, mapId);
    };

    /* ── le passage : on arrive par la porte, on repart par la porte ─────── */
    // Les sorties de la carte : chaque événement qui transfère le joueur.
    function sorties() {
        if ($gameMap._habSorties) return $gameMap._habSorties;
        var l = [];
        $gameMap.events().forEach(function (e) {
            var transfere = e.event().pages.some(function (p) { return p.list.some(function (c) { return c.code === 201; }); });
            if (transfere) l.push(e);
        });
        return ($gameMap._habSorties = l);
    }
    function passable(x, y) {
        return $gameMap.isValid(x, y) && [2, 4, 6, 8].some(function (d) { return $gameMap.isPassable(x, y, d); });
    }
    // La case de sortie la plus proche de la place du PNJ : la case de la porte
    // si on peut s'y tenir, sinon la case devant.
    function sortieDe(ev) {
        lire(ev);
        if (window.AlleesEtVenues && AlleesEtVenues.sortie) { var av = AlleesEtVenues.sortie(ev); if (av) return av; }
        if (ev._habSortieDite) return ev._habSortieDite;
        var maison = { x: ev.event().x, y: ev.event().y }, best = null, d = Infinity;
        sorties().forEach(function (s) {
            var dd = Math.abs(s.x - maison.x) + Math.abs(s.y - maison.y);
            if (dd < d) { d = dd; best = s; }
        });
        if (!best) return null;
        if (!best.isNormalPriority() || best._pageIndex < 0) return { x: best.x, y: best.y };
        var c = null, dc = Infinity;
        [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function (o) {
            var x = best.x + o[0], y = best.y + o[1];
            if (!passable(x, y)) return;
            var dd = Math.abs(x - maison.x) + Math.abs(y - maison.y);
            if (dd < dc) { dc = dd; c = { x: x, y: y }; }
        });
        return c || { x: best.x, y: best.y };
    }
    // ⚠ La recherche de chemin de MV est lente (listes parcourues en entier).
    //   Mesuré le 2026-09-30 : au bar, à 10 h, huit habitués entraient ensemble,
    //   se bloquaient à la porte, et relançaient chacun une recherche toutes les
    //   deux images — 3 433 recherches en 12 s, des images de 50 ms : le jeu
    //   « ramait parfois ». Désormais : trois recherches par image au plus pour
    //   toute la carte, une attente quand on est bloqué, puis un pas de côté,
    //   et les arrivées sont étalées sur quelques secondes.
    var BUDGET = 3;           // des cartes des distances neuves par image (les pas eux-mêmes ne comptent plus)

    /* Le chemin : une carte des distances (parcours en largeur) calculée UNE
     * fois par destination et par carte, sur les cases praticables. Chacun
     * descend ensuite la pente case par case : une lecture de tableau au lieu
     * d'une recherche A* de MV (jusqu'à 40 ms quand la cible est bloquée).
     * Le décor-événement (réverbère, tonneau, étal : un événement fixe, qui
     * bloque) est dans la carte : on le contourne. Les personnages, eux, n'y
     * sont pas — ils bougent : on prend une case libre qui rapproche, sinon on
     * attend puis on fait un pas de côté. */
    var DX = { 2: 0, 4: -1, 6: 1, 8: 0 }, DY = { 2: 1, 4: 0, 6: 0, 8: -1 };
    // les événements fixes qui bloquent, comme une liste de cases « i,j,… »
    function decor() {
        var w = $gameMap.width(), pilotes = $gameMap._viePNJ || [], l = [];
        $gameMap.events().forEach(function (e) {
            if (!e.isNormalPriority() || e.isThrough() || e._moveType !== 0) return;
            if (e._habDepart || e._habArrivee || e._habDelai !== undefined || pilotes.indexOf(e) >= 0) return;
            if (e._visite || e._habPassage) return;
            var m = e.event().meta || {};
            if (m.Horaire || m.Passage || m.Saisons || m.Admission) return;
            l.push(e.y * w + e.x);
        });
        return l.sort(function (a, b) { return a - b; }).join(',');
    }
    var _mapRefresh = Game_Map.prototype.refresh;
    Game_Map.prototype.refresh = function () {
        _mapRefresh.call(this);
        this._habDecorAJour = false;           // une page a pu changer : on relira le décor
    };
    function distances(x, y) {
        if (!$gameMap._habDecorAJour) {
            var s = decor();
            if (s !== $gameMap._habDecor) {
                $gameMap._habDecor = s; $gameMap._habDistances = null;
                var b = $gameMap._habBloque = {};
                if (s) s.split(',').forEach(function (i) { b[i] = true; });
            }
            $gameMap._habDecorAJour = true;
        }
        var bloque = $gameMap._habBloque || {};
        var cache = $gameMap._habDistances || ($gameMap._habDistances = {});
        var k = x + ',' + y;
        if (cache[k]) return cache[k];
        var w = $gameMap.width(), h = $gameMap.height(), n = w * h;
        var dist = new Int32Array(n); for (var i = 0; i < n; i++) dist[i] = -1;
        var file = new Int32Array(n), tete = 0, queue = 0;
        var cible = y * w + x;
        dist[cible] = 0; file[queue++] = cible;
        while (tete < queue) {
            var c = file[tete++], cx = c % w, cy = (c - cx) / w;
            [2, 4, 6, 8].forEach(function (d) {
                // un voisin qui peut marcher VERS c
                var nx = cx - DX[d], ny = cy - DY[d];
                if (nx < 0 || ny < 0 || nx >= w || ny >= h) return;
                var v = ny * w + nx;
                if (dist[v] >= 0 || bloque[v]) return;
                // la destination peut être une porte dans un mur : on s'arrête devant
                if (!$gameMap.isPassable(nx, ny, d) || (c !== cible && !$gameMap.isPassable(cx, cy, 10 - d))) return;
                dist[v] = dist[c] + 1; file[queue++] = v;
            });
        }
        return (cache[k] = dist);
    }
    function directionVers(ev, x, y) {
        var dist = distances(x, y), w = $gameMap.width(), ici = dist[ev.y * w + ev.x];
        if (ici < 0) ici = 1e9;
        var libre = 0, bl = ici, occupe = 0, bo = ici;
        [2, 4, 6, 8].forEach(function (d) {
            var nx = ev.x + DX[d], ny = ev.y + DY[d];
            if (!$gameMap.isValid(nx, ny)) return;
            var v = dist[ny * w + nx];
            if (v < 0 || v >= ici) return;
            // une case qui rapproche et où personne ne se tient, d'abord
            if (ev.canPass(ev.x, ev.y, d)) { if (v < bl) { bl = v; libre = d; } }
            else if (v < bo) { bo = v; occupe = d; }
        });
        return libre || occupe;
    }
    Habitants.directionVers = directionVers;

    /* Un pas, comme quelqu'un qui marche (2026-10-30, JOKO : « le plus gros
     * problème c'est la marche, ils font n'importe quoi ») : jamais au hasard.
     *   · la case qui rapproche, libre — et tout droit si c'est aussi court
     *     (sinon il zigzague d'une case sur l'autre) ;
     *   · quelqu'un devant : il attend un peu ; s'il est encore là, il le
     *     contourne par le côté (une case qui n'éloigne pas), jamais en revenant
     *     sur ses pas ;
     *   · la recherche coûteuse (une carte des distances) se fait au plus
     *     BUDGET fois par image ; les pas eux-mêmes ne coûtent rien.
     * m : sa mémoire de marche { bloque, avant, attente }. Rend vrai s'il avance. */
    function pas(ev, x, y, m) {
        if (m.fantome) { m.fantome = false; ev.setThrough(false); }
        var cache = $gameMap._habDistances;
        if (!(cache && cache[x + ',' + y]) || !$gameMap._habDecorAJour) {
            if ($gameMap._habBudget <= 0) return false;
            $gameMap._habBudget--;
        }
        var dist = distances(x, y), w = $gameMap.width(), ici = dist[ev.y * w + ev.x];
        var loin = ici < 0;
        if (loin) ici = 1e9;
        var vers = [], cote = [], detour = [], recents = m.recents || (m.recents = []);
        [2, 4, 6, 8].forEach(function (d) {
            var nx = ev.x + DX[d], ny = ev.y + DY[d];
            if (!$gameMap.isValid(nx, ny)) return;
            var v = dist[ny * w + nx];
            if (v < 0) return;
            var k = nx + ',' + ny, libre = ev.canPass(ev.x, ev.y, d), recent = recents.indexOf(k) >= 0;
            if (v < ici) vers.push({ d: d, v: v, libre: libre && !recent, k: k });
            else if (v === ici && libre && !recent) cote.push({ d: d, v: v, k: k });
            else if (v === ici + 1 && libre && !recent) detour.push({ d: d, v: v, k: k });
        });
        function faire(c) {
            recents.push(ev.x + ',' + ev.y); if (recents.length > 5) recents.shift();
            m.avant = ev.x + ',' + ev.y;
            ev.moveStraight(c.d);
            return ev.isMovementSucceeded();
        }
        var bons = vers.filter(function (c) { return c.libre; });
        if (bons.length) {
            var min = Math.min.apply(null, bons.map(function (c) { return c.v; }));
            var choix = bons.filter(function (c) { return c.v === min; });
            var tout = choix.filter(function (c) { return c.d === ev.direction(); })[0] || choix[0];
            if (faire(tout)) { if (m.bloque > 0) m.bloque--; if (!m.bloque) recents.length = 0; return true; }
        }
        // ⚠ posé dans un mur (une guérite, le pilier d'une porte : JOKO y met ses gardes) — il n'est pas sur
        //   la carte des distances et ne peut sortir d'aucun côté : il en sort d'un pas, comme on passe une
        //   porte, vers la case praticable la plus proche du but
        if (loin) {
            var sorties = [2, 4, 6, 8].map(function (d) { var nx = ev.x + DX[d], ny = ev.y + DY[d]; return { d: d, v: $gameMap.isValid(nx, ny) ? dist[ny * w + nx] : -1, nx: nx, ny: ny }; })
                .filter(function (c) { return c.v >= 0 && !$gameMap.eventsXyNt(c.nx, c.ny).some(function (e) { return e.isNormalPriority() && e !== ev; }) && !($gamePlayer.x === c.nx && $gamePlayer.y === c.ny); })
                .sort(function (a, b) { return a.v - b.v; });
            if (sorties.length) { ev.setThrough(true); ev.moveStraight(sorties[0].d); m.fantome = true; return true; }
        }
        m.bloque = (m.bloque || 0) + 1;
        // le joueur se tient dans le passage (souvent la porte) : un instant, puis il se faufile à côté de lui
        if (m.bloque >= 2) {
            var joueur = vers.filter(function (c) { return !c.libre && c.k === $gamePlayer.x + ',' + $gamePlayer.y; })[0];
            if (joueur) { ev.setThrough(true); ev.moveStraight(joueur.d); m.fantome = true; m.avant = ev.x + ',' + ev.y; return true; }
        }
        // quelqu'un devant : d'abord un pas de côté qui n'éloigne pas ; s'il attend depuis longtemps, un
        // vrai détour (une case de plus), sans revenir sur les cases qu'il vient de quitter
        if (m.bloque >= 3 && cote.length && faire(cote[0])) return true;
        if (m.bloque >= 6 && detour.length && faire(detour[0])) return true;
        m.attente = 18 + Math.randomInt(18);          // il attend que ça passe, comme on attend
        return false;
    }
    Habitants.pas = pas;
    // peut-il marcher d'ici jusque-là ? (sa case est-elle sur la carte des distances du but)
    Habitants.atteint = function (ev, x, y) { return distances(x, y)[ev.y * $gameMap.width() + ev.x] >= 0; };
    // le joueur le voit-il ? (une téléportation ne se fait jamais sous ses yeux)
    function aLEcran(ev) {
        var x = $gameMap.adjustX(ev._realX), y = $gameMap.adjustY(ev._realY);
        return x > -1 && y > -1 && x < $gameMap.screenTileX() + 1 && y < $gameMap.screenTileY() + 1;
    }
    Habitants.aLEcran = aLEcran;

    function pasVers(ev, b) {
        // sous l'averse, on court se mettre à l'abri (v1.3) : un cran de plus que la vitesse de l'éditeur
        // (v1.4 : avant, on forçait 4, le pas du joueur, quelle que soit la vitesse que JOKO avait mise)
        var pluie = $gameScreen && ($gameScreen.weatherType() === 'rain' || $gameScreen.weatherType() === 'storm');
        var p = ev.page && ev.page(), base = p && p.moveSpeed > 0 ? p.moveSpeed : 3;
        ev.setMoveSpeed(Math.min(6, base + (pluie ? 1 : 0)));
        pas(ev, b.x, b.y, b);
    }
    function onLuiParle(ev) {
        return $gameMap._interpreter && $gameMap._interpreter.isRunning() && $gameMap._interpreter.eventId() === ev.eventId();
    }
    var LIMITE = 60 * 8;        // huit secondes de marche au plus, puis il « passe » quand même

    var _refresh = Game_Event.prototype.refresh;
    Game_Event.prototype.refresh = function () {
        lire(this);
        if (!this._habPassage || !$gameMap._habPret || this._erased) return _refresh.call(this);
        if (this._habDepart) return;                       // il est en route vers la sortie : on le laisse finir
        var ancien = this._pageIndex, nouveau = this.findProperPageIndex();
        if (ancien >= 0 && nouveau < 0) {
            var s = sortieDe(this);
            if (s) { this._habDepart = { x: s.x, y: s.y, t: 0 }; this._habArrivee = null; this._habMove = this._moveType; this._moveType = 0; return; }
        }
        if (ancien < 0 && nouveau >= 0 && !this._habEntre) {
            // il n'entre pas tout de suite : chacun à son tour, sur ~3 s
            if (this._habDelai === undefined) this._habDelai = Math.randomInt(180);
            return;
        }
        this._habEntre = false;
        _refresh.call(this);
        if (ancien < 0 && this._pageIndex >= 0) {
            var e = sortieDe(this);
            if (e && (e.x !== this.x || e.y !== this.y)) {
                this.locate(e.x, e.y);
                this._habArrivee = { x: this.event().x, y: this.event().y, t: 0, dir: this.page().image.direction || 2 };
                this._habMove = this._moveType; this._moveType = 0;
            }
        }
    };
    var _updEv = Game_Event.prototype.update;
    Game_Event.prototype.update = function () {
        _updEv.call(this);
        if (this._habDelai !== undefined) {
            if (this._habDelai-- <= 0) { this._habDelai = undefined; this._habEntre = true; this.refresh(); }
            return;
        }
        var b = this._habDepart || this._habArrivee;
        if (!b || onLuiParle(this) || $gameMessage.isBusy()) return;
        // pendant une scène (OutilsDeScene, mode cinématique), il s'arrête sur place
        if (window.OutilsDeScene && OutilsDeScene.figeAussi(this)) return;
        b.t += 1;                                  // en temps réel, même pendant les pas
        // un voyageur qui traverse la ville a plus loin à aller qu'un habitué qui entre au bar
        var limite = this._visite ? LIMITE * 4 : LIMITE;
        // ⚠ 2026-10-30 : sous les yeux du joueur, on ne « passe » pas d'un coup : il continue de marcher
        //   (au plus quatre fois plus longtemps) ; hors de l'écran, personne ne voit le raccourci
        if (b.t > limite && b.t <= limite * 4 && aLEcran(this)) limite = b.t + 1;
        if (this.isMoving() && b.t <= limite) return;
        // partir : être à côté de la sortie suffit (le joueur se tient souvent devant la porte)
        var arrive = this._habDepart ? Math.abs(this.x - b.x) + Math.abs(this.y - b.y) <= 1 : (this.x === b.x && this.y === b.y);
        // arriver : à une case de sa place, si quelqu'un s'y tient, c'est arrivé
        if (!arrive && this._habArrivee && Math.abs(this.x - b.x) + Math.abs(this.y - b.y) === 1 && (b.bloque || 0) >= 3) arrive = true;
        if (arrive || b.t > limite) {
            this._moveType = this._habMove;
            if (b.fantome) { b.fantome = false; this.setThrough(false); }      // il s'était faufilé : il redevient solide
            if (this._habDepart) { this._habDepart = null; _refresh.call(this); }
            else { if (!arrive) this.locate(b.x, b.y); this.setDirection(b.dir); this._habArrivee = null; }
            return;
        }
        if (b.attente > 0) { b.attente--; return; }
        pasVers(this, b);
    };
    /* ── le calendrier de la Bible (v1.3) ───────────────────────────────── */
    // L'Admission : les premiers jours du premier mois de chaque saison.
    Habitants.admission = function () {
        if (!$gameSystem || !$gameSystem.day || JOURS_ADMISSION <= 0) return false;
        var premierMois = $gameSystem._season_interval ? $gameSystem._season_interval[0] === 0 : (($gameSystem.month() - 1) % 3 === 0);
        return premierMois && $gameSystem.day() <= JOURS_ADMISSION;
    };
    // La Veillée du Retour : le jour réglé, de 18 h à 2 h du matin (la nuit d'après compte encore).
    Habitants.veillee = function (largeNuit) {
        if (!$gameSystem || !$gameSystem.month) return false;
        var m = $gameSystem.month(), d = $gameSystem.day(), h = heure();
        var jourMeme = m === VEILLEE[0] && d === VEILLEE[1];
        if (largeNuit === false) return jourMeme;
        if (jourMeme) return true;
        // de minuit à 2 h, le lendemain : la veillée n'est pas finie
        var maxJour = $gameSystem._day_max ? $gameSystem._day_max - 1 : 30;
        var veille = d === 1 ? (m === (VEILLEE[0] % 12) + 1 && VEILLEE[1] === maxJour) : (m === VEILLEE[0] && d - 1 === VEILLEE[1]);
        return veille && h < 2;
    };

    /* ── ce qu'ils retiennent (v1.3) ────────────────────────────────────── */
    function hautsFaits() { return ($gameSystem._hautsFaits = $gameSystem._hautsFaits || []); }
    Habitants.hautsFaits = function () { return hautsFaits().slice(); };
    Habitants.retenir = function (cleFait, genre, nom, ancien) {
        var l = hautsFaits();
        if (l.some(function (f) { return f.cle === cleFait; })) return false;
        l.push({ cle: cleFait, genre: genre, nom: nom, jour: ancien ? -9999 : jour() });
        return true;
    };
    // les quêtes finies (QuetesDuMonde) — regardées une fois par seconde, pas à chaque image
    function regarderLesQuetes() {
        if (!$gameSystem || !$gameSystem.questList) return;
        var premiere = !$gameSystem._hautsFaitsVus;
        $gameSystem._hautsFaitsVus = true;
        $gameSystem.questList().forEach(function (q) {
            // une quête finie avant la v1.3 ne se raconte pas comme une nouvelle
            if (q && q.status === 'done' && q.type !== 'tuto') Habitants.retenir('quete:' + q.id, 'quete', q.title || q.id, premiere);
        });
    }
    var _end = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        if (result === 0 && $gameTroop) {
            $gameTroop.members().forEach(function (e) {
                var boss = window.MecaBoss && MecaBoss.estBoss ? MecaBoss.estBoss(e) : !!(e.enemy().meta && e.enemy().meta.Boss);
                if (boss) Habitants.retenir('boss:' + e.enemyId(), 'boss', e.name());
            });
        }
        return _end.call(this, result);
    };
    function nomQuiParle(liste) {
        for (var i = 0; i < (liste || []).length; i++) {
            var c = liste[i];
            if (c.code === 401) { var m = String(c.parameters[0]).match(/\\n<([^>]+)>/); if (m) return m[1]; }
        }
        return '';
    }
    function hasard(l) { return l[Math.floor(Math.random() * l.length)]; }
    // ce qu'il dira avant son menu : un exploit récent qu'il n'a pas encore commenté, ou le jour qu'il est
    function preparerSouvenir(interp, f) {
        interp._habSouvenir = null;
        f.dits = f.dits || {};
        var j = jour(), texte = null;
        var recents = hautsFaits().filter(function (h) { return j - h.jour <= JOURS_SOUVENIR && !f.dits[h.cle]; });
        if (recents.length) {
            var h = recents[recents.length - 1];
            f.dits[h.cle] = true;                         // il en parle ou non : une seule fois
            if (Math.random() < CHANCE_SOUVENIR) texte = hasard(PHRASES[h.genre] || PHRASES.quete).replace(/%1/g, h.nom);
        }
        if (!texte) {
            var occ = Habitants.veillee(false) ? 'veillee:' + j : Habitants.admission() ? 'admission:' + ($gameSystem.year ? $gameSystem.year() : 0) + ':' + saison() : null;
            if (occ && !f.dits[occ]) { f.dits[occ] = true; texte = hasard(PHRASES[occ.split(':')[0]]); }
        }
        if (!texte) return;
        var nom = nomQuiParle(interp._list);
        var cmds = [{ code: 101, indent: 0, parameters: ['', 0, 0, 2] }];
        require46(texte).forEach(function (l, i) { cmds.push({ code: 401, indent: 0, parameters: [(i === 0 && nom ? '\\n<' + nom + '>' : '') + l] }); });
        cmds.push({ code: 0, indent: 0, parameters: [] });
        interp._habSouvenir = cmds;
    }
    function require46(t) {                         // des lignes de 46 signes au plus, 4 au plus
        var l = [], cur = '';
        String(t).split(' ').forEach(function (m) { if (cur && (cur + ' ' + m).length > 46) { l.push(cur); cur = m; } else cur = cur ? cur + ' ' + m : m; });
        if (cur) l.push(cur);
        return l.slice(0, 4);
    }
    // juste avant le menu (« Discuter · Quoi de neuf ? · … ») : après le bonjour, avant les sujets
    var _c102 = Game_Interpreter.prototype.command102;
    Game_Interpreter.prototype.command102 = function () {
        if (this._habSouvenir) {
            var l = this._habSouvenir; this._habSouvenir = null;
            this.setupChild(l, this._eventId);
            return false;
        }
        return _c102.call(this);
    };
    var _updQ = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _updQ.call(this);
        if ((this._habQ = (this._habQ || 0) + 1) >= 60) { this._habQ = 0; regarderLesQuetes(); }
    };

    // ce que fait chacun, pour les bancs
    Habitants.etat = function () {
        return $gameMap.events().filter(function (e) { lire(e); return e._habPassage; }).map(function (e) {
            return { id: e.eventId(), nom: e.event().name, page: e._pageIndex, x: e.x, y: e.y, depart: !!e._habDepart, arrivee: !!e._habArrivee };
        });
    };
})();
