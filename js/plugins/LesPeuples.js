//=============================================================================
// LesPeuples.js — le royaume des monstres : chaque peuple du Chapitre 1 se bat comme il vit
//=============================================================================
/*:
 * @plugindesc v1.1 Les peuples du Chapitre 1 : un trait par peuple (la Bible), les états d'âme, un nom propre à chacun
 * @author Claude, pour JOKO
 *
 * @param nomsPropres
 * @text Un nom propre à chacun
 * @desc « Deux vivants ne portent jamais le même nom » : chaque créature d'un peuple reçoit un nom à elle (« Nacre (Gelée) »).
 * @type boolean
 * @default true
 *
 * @param tempsDuNom
 * @text Temps du Nom (combats)
 * @desc Un nom porté par une créature tuée redevient libre après ce nombre de combats.
 * @type number
 * @default 20
 *
 * @param braiseObjet
 * @text Objet « Braise d'âme »
 * @desc Ce que laisse un habitant du Chapitre 1 tué pour de bon (0 : rien).
 * @type item
 * @default 113
 *
 * @param chanceBraise
 * @text Chance de la braise (%)
 * @type number
 * @default 100
 *
 * @param etatEffroi
 * @text État Effroi
 * @type state
 * @default 279
 *
 * @param etatJalousie
 * @text État Jalousie
 * @type state
 * @default 280
 *
 * @param etatSuperbe
 * @text État Superbe
 * @type state
 * @default 281
 *
 * @param etatDoute
 * @text État Doute
 * @type state
 * @default 282
 *
 * @param etatEuphorie
 * @text État Euphorie
 * @type state
 * @default 167
 *
 * @param etatAccablement
 * @text État Accablement
 * @type state
 * @default 168
 *
 * @param etatEmporte
 * @text État Emporté
 * @type state
 * @default 169
 *
 * @param etatSommeil
 * @text État Sommeil (Rêveurs)
 * @type state
 * @default 19
 *
 * @help
 * ============================================================================
 * Les peuples (2026-11-08)
 * ============================================================================
 * JOKO : « Fais tous les ennemis […] plus développé et original, vu que c'est
 * extrêmement important ». Chaque trait vient de la page Notion « Le royaume
 * des monstres » : ce qu'est le peuple, comment il vit, comment on lui parle.
 *
 * Le peuple d'un ennemi : <Peuple: clé> sur sa fiche (sinon Parler le
 * reconnaît à son nom). Clés : gelees, gobelins, orques, farfadets, trolls,
 * pleureuses, loups, murmures, petitsrefus, envies, reveurs, rancoeurs,
 * mirages, statues, arbres, vouivres, orgueils, ostetus, revenants, affames,
 * errants, braises, humains. Un boss garde sa mécanique : le trait de son
 * peuple ne s'applique qu'aux ennemis sans <Meca…:> / <Phases:> / <Boss>.
 *
 *  Gelées       L'humeur : sa couleur dit son humeur, et l'élément du dernier
 *               coup la change (Feu rouge, Eau/Glace bleu, Foudre jaune,
 *               Ombre vert, Terre doré, Lumière rose). Rouge frappe ×1,3 ;
 *               bleu encaisse ×0,6 ; jaune esquive ; vert prend un renfort à
 *               qui il touche ; doré refuse les soins et frappe ×1,15 ; rose
 *               soigne les siens. Deux gelées de même humeur fusionnent.
 *  Gobelins     La couronne tourne : le chef (👑) frappe ×1,25, les autres
 *               ×1,1 ; au bout de deux tours, un autre le renverse. Un piège
 *               attend le premier héros qui agit.
 *  Orques       La colère dite : touché trois fois, il l'annonce ; si
 *               personne ne le frappe avant qu'il la crie, il se calme
 *               (×0,8) ; sinon, gardée, elle l'emporte (Emporté).
 *  Farfadets    La blague : tous les trois tours, un héros rit (Euphorie) ;
 *               tant que quelqu'un rit, les farfadets se refont.
 *  Trolls       La rancune : il se relève tant qu'il en veut (D 1, C 2…),
 *               et ses blessures se referment.
 *  Pleureuses   Le cri accable tout le groupe ; quand un des siens tombe, elle
 *               chante la Veille (perd son action) et recueille ce qu'il
 *               portait.
 *  Loups        Ils goûtent la peur : plus forts sur qui a peur (Effroi, se
 *               garde, sous 30 %), moins sur qui rit ; leur hurlement effraie.
 *  Murmures     Leurs coups sèment le doute (Doute) ; en tombant, ils
 *               chuchotent le point faible d'un autre.
 *  Petits Refus « Non ! » : un renfort qu'un héros reçoit peut devenir son
 *               contraire ; ils protègent un allié du prochain état.
 *  Envies       Leurs coups rendent jaloux (Jalousie) ; prendre un objet
 *               « sans payer » devant elles les met en colère.
 *  Rêveurs      Leurs spores endorment ; qui dort se refait en rêvant.
 *  Rancœurs     Plus le combat dure, plus l'injustice pèse (+12 % par tour).
 *  Mirages      L'instinct « mirage » (le premier coup ne les touche pas).
 *  Statues      Le serment : presque intouchables tant qu'un autre se bat à
 *               côté d'elles ; seules, ×1,5.
 *  Arbres       Lents (un tour sur deux), ils rejouent la technique qu'on leur
 *               a portée.
 *  Vouivres,    « Quiconque monte plus haut » : elles visent le plus haut
 *  Orgueils     niveau ; un petit coup ne les touche qu'à moitié, un grand
 *               ×1,2 ; leur rugissement donne la Superbe.
 *  Os-Têtus     Têtus : ils se relèvent, sauf au Feu ou à la Lumière.
 *  Revenants    L'instinct « revient ».
 *  Affamés      Leur morsure mange un souvenir : la dernière technique du
 *               héros est scellée deux tours.
 *  Errants      Sans corps : un mouvement les touche à moitié, une rune ×1,5.
 *  Braises      Elles vacillent : un tour sur trois, presque rien ne les
 *               touche.
 *
 * Les braises : un habitant du Chapitre 1 (<Monde: chapitre1>) tué pour de bon laisse une « Braise d'âme »
 * (braiseObjet) ; une pleureuse la recueille avec le reste.
 *
 * Les boss de la Bible (balises de leur fiche ; la parole est dans Parler) :
 *  <Volonte: 3>      Corvina : elle se relève tant que sa volonté tient ; chaque chute et chaque Brisure en ôtent un ;
 *                    brisée, elle s'en va (« impossible de la tuer pour de bon »).
 *  <Tenue>           Aymeric : tant qu'il tient sa position, les siens encaissent ×0,7 ; un coup de 15 % la rompt.
 *  <Duel>            Brennus : le premier héros qui le frappe est son duelliste ; un autre frappe à moitié et le
 *                    met en colère (+20 % par affront).
 *  <Chants>          Hurle-Doux : tous les 3 tours, sa joie soigne les siens, sa colère soulève la pierre, son chagrin
 *                    accable ; <Loyal> : tombé après avoir dit sa colère, il s'incline (vaincu loyalement).
 *  <CentFois>        Vaëlle : elle n'esquive jamais ; tombée, elle reviendra au combat suivant, un peu plus forte.
 *  <Pardon>          Ruedan : chaque bonne réponse (Écouter) lui ôte une rancune.
 *  <GardeLesBraises> Dame Sanglot : +10 % par braise que l'équipe porte (×2 au plus).
 *
 * Les états d'âme (la Bible) : Effroi (défense ×1,5, ne peut pas attaquer),
 * Jalousie (prend les renforts d'un allié), Superbe (refuse les soins des
 * autres), Doute (précision −30 %) ; Emporté, Euphorie, Accablement sont des
 * états du jeu (169, 167, 168).
 *
 * Tous les chiffres sont en tête du code (REGLAGES). Pour un banc :
 * window.LesPeuples (peuple, nom, humeur, REGLAGES, _eteint).
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('LesPeuples');
    var num = function (k, d) { var v = Number(P[k]); return isNaN(v) || P[k] === '' || P[k] === undefined ? d : v; };
    var NOMS_PROPRES = String(P.nomsPropres || 'true') === 'true';
    var TEMPS_DU_NOM = num('tempsDuNom', 20);
    var BRAISE = num('braiseObjet', 113), CHANCE_BRAISE = num('chanceBraise', 100) / 100;
    var ET = {
        effroi: num('etatEffroi', 279), jalousie: num('etatJalousie', 280), superbe: num('etatSuperbe', 281), doute: num('etatDoute', 282),
        euphorie: num('etatEuphorie', 167), accablement: num('etatAccablement', 168), emporte: num('etatEmporte', 169), sommeil: num('etatSommeil', 19)
    };

    var R = {
        gelee: { rouge: 1.3, bleu: 0.6, jaune: 0.35, dore: 1.15, rose: 0.08 },
        couronne: 1.25, couronneAutres: 1.1, couronneTours: 2, piege: 0.1,
        colereCoups: 3, colereCalme: 0.8,
        blagueTous: 3, farfadetSoin: 0.15,
        rancune: { D: 1, C: 2, B: 3, A: 3, S: 4, AUCUN: 1 }, rancuneRelève: 0.4, rancuneSoin: 0.05,
        criTous: 3,
        peurParHeros: 0.15, rireLoup: 0.8, hurlementTous: 3,
        refus: 0.3,
        envieColere: 1.3,
        sommeil: 0.5, reveSoin: 0.08,
        rancoeurParTour: 0.12, rancoeurMax: 2,
        statueProtegee: 0.25, statueSeule: 1.5,
        petitCoup: 0.04, grandCoup: 0.15, petit: 0.5, grand: 1.2, rugissementTous: 3,
        ostetusReleves: 2, ostetusPV: 0.5,
        souvenirTours: 2,
        errantMouvement: 0.5, errantEcrit: 1.5,
        braiseVacille: 0.2,
        // les boss de la Bible
        volonteReleve: 0.6, centFoisParRetour: 0.05, chantsTous: 3, chantJoie: 0.1, chantColere: 0.08,
        tenue: 0.7, tenueRompue: 0.15, duelAutre: 0.5, duelColere: 0.2, parBraise: 0.1, braisesMax: 2
    };

    var HUMEURS = {
        rouge: { teinte: 0, nom: 'colère', icone: '🔴' },
        bleu: { teinte: 200, nom: 'chagrin', icone: '🔵' },
        jaune: { teinte: 50, nom: 'peur', icone: '🟡' },
        vert: { teinte: 110, nom: 'envie', icone: '🟢' },
        dore: { teinte: 35, nom: 'orgueil', icone: '🟠' },
        rose: { teinte: 320, nom: 'joie', icone: '🩷' }
    };
    var ELEMENT_HUMEUR = { 8: 'rouge', 9: 'bleu', 13: 'bleu', 12: 'jaune', 15: 'vert', 11: 'dore', 14: 'rose' };

    // Les noms : inventés pour chaque peuple, dans sa manière (la Bible : les noms ont du pouvoir, aucun n'est porté deux fois)
    var NOMS = {
        gelees: ['Nacre', 'Ambrette', 'Perle-de-Pluie', 'Moirée', 'Gouttelin', 'Iris', 'Lagune', 'Rosée', 'Bulle', 'Glacis', 'Gélise', 'Flaque', 'Opale-Basse', 'Tremblotte'],
        gobelins: ['Croque-Clou', 'Rire-Sec', 'Tord-Nez', 'Pétarade', 'Grigou', 'Mèche-Courte', 'Chipe-Tout', 'Ricanel', 'Dent-Folle', 'Gratte-Pied', 'Bisbille', 'Rogne-Lune'],
        orques: ['Gronde-Lent', 'Cendre-Poing', 'Voix-de-Roc', 'Hurle-Bas', 'Tonne-Cœur', 'Rude-Chant', 'Brise-Silence', 'Mâchoire-Douce', 'Crie-Juste', 'Poing-Rimé'],
        farfadets: ['Pouffe', 'Clin-d\'Œil', 'Mirliton', 'Fripon', 'Pépite', 'Chatouille', 'Tintouin', 'Frimousse', 'Zigzag', 'Rigolin'],
        trolls: ['Vieux-Gué', 'Grief', 'Pierre-Tenace', 'Rumine', 'Mâchefer', 'Garde-Tort', 'Long-Souvenir'],
        pleureuses: ['Plainte', 'Soupir', 'Lamente', 'Voile-Gris', 'Dernière-Note', 'Complainte', 'Brume-de-Veille', 'Requiem'],
        loups: ['Frisson-Gris', 'Croc-Pâle', 'Nuit-Longue', 'Flaire-Peur', 'Givre-Œil', 'Hurle-Lune', 'Ombre-Fauve', 'Poil-Dressé'],
        murmures: ['Chuchote', 'Rumeur', 'Oui-Dire', 'Écho-Bas', 'Ragot', 'Messe-Basse', 'Entre-Deux-Portes'],
        petitsrefus: ['Pas-Question', 'Jamais', 'Point-du-Tout', 'Nan', 'Rebours', 'Niet', 'Même-Pas'],
        envies: ['Convoite', 'Miroitier', 'Écrin', 'Brille-Trop', 'Désirée', 'Clinquant', 'Pacotille', 'Encore-Un'],
        reveurs: ['Somnole', 'Morillon', 'Duvet', 'Rêverie', 'Lente-Spore', 'Berceuse', 'Songe-Creux'],
        rancoeurs: ['Grief-Ancien', 'Mauvais-Partage', 'Promesse-Rompue', 'Injuste', 'Dette-Impayée', 'Porte-Close'],
        mirages: ['Tremble-Air', 'Lointain', 'Presque', 'Si-Près', 'Fata', 'Là-Bas'],
        statues: ['Fidèle', 'Tenue', 'Parole-de-Pierre', 'Juré', 'Garde-Serment', 'Constance'],
        arbres: ['Vieille-Écorce', 'Mémoire-Verte', 'Racine-Lente', 'Témoin', 'Souvenance'],
        vouivres: ['Altière', 'Cime-Fière', 'Vante-Ciel', 'Plus-Haut', 'Fanfaronne', 'Bec-d\'Or'],
        orgueils: ['Grand-Dédain', 'Couronne-Ardente', 'Sans-Égal'],
        ostetus: ['Sans-Chair', 'Os-de-Meunier', 'Bras-Sec', 'Laboure-Encore', 'Os-Fidèle', 'Vieux-Sillon'],
        revenants: ['Presque-Lui', 'Oublié', 'Égaré', 'Sans-Visage', 'Pas-Tout-à-Fait'],
        affames: ['Mange-Souvenir', 'Creux', 'Ronge-Nom', 'Faim-de-Toi', 'Grignote'],
        errants: ['Dérive', 'Vague-Âme', 'Passant', 'Fil-de-Brume', 'Nulle-Part'],
        braises: ['Lueur', 'Tison', 'Hésite', 'Escarbille', 'Veilleuse', 'Petite-Flamme']
    };
    var NOM_PEUPLE = {
        gelees: 'Gelée', gobelins: 'Gobelin', orques: 'Orque', farfadets: 'Farfadet', trolls: 'Troll', pleureuses: 'Pleureuse',
        loups: 'Loup-Frisson', murmures: 'Murmure', petitsrefus: 'Petit Refus', envies: 'Envie', reveurs: 'Rêveur', rancoeurs: 'Rancœur',
        mirages: 'Mirage', statues: 'Statue', arbres: 'Arbre-Mémoire', vouivres: 'Vouivre', orgueils: 'Orgueil', ostetus: 'Os-Têtu',
        revenants: 'Revenant', affames: 'Affamé', errants: 'Errant', braises: 'Braise'
    };

    // --- outils -------------------------------------------------------------
    function enCombat() { return !!($gameParty && $gameParty.inBattle()) && !LesPeuples._eteint; }
    function tour() { return $gameTroop ? $gameTroop.turnCount() : 0; }
    function ennemi(b) { return !!(b && b.isEnemy && b.isEnemy()); }
    function heros(b) { return !!(b && b.isActor && b.isActor()); }
    function note(e) { return (e && e.enemy && e.enemy() && e.enemy().note) || ''; }
    function estBoss(e) { return /<\s*(Meca\w*|Phases)\s*:/i.test(note(e)) || /<\s*Boss\s*>/i.test(note(e)); }
    function peuple(e) {
        if (!ennemi(e) || !e.enemy()) { return ''; }
        var m = e.enemy().meta || {};
        if (m.Peuple) { return String(m.Peuple).trim().toLowerCase(); }
        // une fiche rangée (<Monde:>) sans <Peuple:> n'en a pas : son nom ne suffit plus (« Grand Loup Noir » n'est pas un Loup-Frisson)
        if (m.Monde) { return ''; }
        var p = window.Parler && Parler.peuple ? Parler.peuple(e) : null;
        return p ? p.cle : '';
    }
    function de(e, cle) { return enCombat() && ennemi(e) && !estBoss(e) && peuple(e) === cle; }
    function vivants(cle) { return $gameTroop.aliveMembers().filter(function (e) { return de(e, cle); }); }
    function annonce(b, t, c) { if (window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, t, c || '#ffd9a0'); } }
    function etat(id) { return !!($dataStates[id] && $dataStates[id].name); }
    function poser(b, id) { if (etat(id) && b.isAlive()) { b.addState(id); return b.isStateAffected(id); } return false; }
    function hasard(n) { return Math.random() < n; }
    function auHasard(l) { return l.length ? l[Math.floor(Math.random() * l.length)] : null; }
    function rang(e) {
        var r = window.EquilibreDesCombats ? EquilibreDesCombats.rangDe(e) : null;
        if (!r) { var m = /<\s*Rang\s*:\s*([^>]*)>/i.exec(note(e)); r = m ? m[1].trim().toUpperCase() : null; }
        return r || 'AUCUN';
    }
    function elementsDe(action) {
        var l = [];
        try { l = action.getItemElements ? action.getItemElements() : [action.item().damage.elementId]; } catch (x) { l = []; }
        return (l || []).filter(function (x) { return x >= 8 && x <= 15; });
    }
    function artDe(item) { return window.LesTroisArts && LesTroisArts.art && item ? LesTroisArts.art(item) : ''; }
    function blesser(b, n) { n = Math.max(1, Math.floor(n)); if (n >= b.hp) { n = b.hp - 1; } if (n > 0) { b.gainHp(-n); } return n; }
    function soigner(b, n) { n = Math.max(1, Math.floor(n)); b.gainHp(n); return n; }

    // --- les noms propres ---------------------------------------------------
    function registre() { return ($gameSystem._nomsDuChapitre = $gameSystem._nomsDuChapitre || { pris: {}, liberes: {} }); }
    function donnerNom(e) {
        if (!NOMS_PROPRES || e._nomPropre !== undefined) { return; }
        var cle = peuple(e), pool = NOMS[cle];
        e._nomPropre = null;
        if (!pool || estBoss(e)) { return; }
        // un personnage a déjà son nom (Dame Sanglot, Orgueil-sans-Nom…) ; une créature au nom à elle aussi (« Grelot », « Cendreux ») :
        // seul celui dont la fiche porte le nom de son peuple (« Gelée », « Gobelin Rieur ») en reçoit un
        if ((e.enemy().meta || {}).Personnage) { return; }
        if (String(e.enemy().name || '').toLowerCase().indexOf(String(NOM_PEUPLE[cle] || '~').toLowerCase()) < 0) { return; }
        var r = registre();
        var libres = pool.filter(function (n) { return !r.pris[n]; });
        if (!libres.length) { return; }
        var n = auHasard(libres);
        r.pris[n] = true;
        e._nomPropre = n;
    }
    function compterLeTempsDuNom() {
        var r = registre();
        Object.keys(r.liberes).forEach(function (n) {
            r.liberes[n]--;
            if (r.liberes[n] <= 0) { delete r.liberes[n]; delete r.pris[n]; }
        });
    }
    var _nom = Game_Enemy.prototype.name;
    Game_Enemy.prototype.name = function () {
        if (this._nomPropre && NOM_PEUPLE[peuple(this)]) { return this._nomPropre + ' (' + NOM_PEUPLE[peuple(this)] + ')'; }
        return _nom.call(this);
    };

    // --- les Gelées : l'humeur ----------------------------------------------
    function humeur(e, h, dire) {
        if (!HUMEURS[h] || e._humeur === h) { return; }
        e._humeur = h;
        if (dire) { annonce(e, HUMEURS[h].icone + ' ' + HUMEURS[h].nom, '#c8e6ff'); }
    }
    var _teinte = Game_Enemy.prototype.battlerHue;
    Game_Enemy.prototype.battlerHue = function () {
        if (this._humeur && HUMEURS[this._humeur] && enCombat()) { return HUMEURS[this._humeur].teinte; }
        return _teinte.call(this);
    };
    function fusions() {
        var g = vivants('gelees');
        var faits = [];
        g.forEach(function (a) {
            if (faits.indexOf(a) >= 0) { return; }
            var b = g.filter(function (x) { return x !== a && faits.indexOf(x) < 0 && x._humeur === a._humeur; })[0];
            if (!b) { return; }
            var fort = a.hp >= b.hp ? a : b, faible = fort === a ? b : a;
            var pv = faible.hp;
            fort.addParam(0, faible.mhp);
            fort.gainHp(pv);
            fort._expFusion = (fort._expFusion || 0) + faible.exp() + (faible._expFusion || 0);
            faible._fondue = true;
            faible.hide();
            faites(fort, faible);
            faits.push(fort, faible);
        });
        function faites(f, x) { annonce(f, '💞 ' + x.name().split(' (')[0] + ' fusionne avec elle', '#ffc0e0'); }
    }

    // --- l'état des choses au début et à la fin des tours -----------------------
    var _debut = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _debut.call(this);
        if (!LesPeuples._eteint) { debutDeCombat(); }
    };
    function debutDeCombat() {
        compterLeTempsDuNom();
        bossAuDebut();
        $gameTroop.members().forEach(function (e) {
            donnerNom(e);
            if (de(e, 'gelees')) { humeur(e, auHasard(Object.keys(HUMEURS)), false); }
            if (de(e, 'trolls')) { e._rancune = R.rancune[rang(e)] || 1; }
            if (de(e, 'ostetus')) { e._releves = R.ostetusReleves; }
        });
        var gob = vivants('gobelins');
        if (gob.length) {
            couronner(gob.slice().sort(function (a, b) { return b.hp - a.hp; })[0]);
            var cible = auHasard($gameParty.aliveMembers());
            if (cible) { cible._piegeGobelin = true; annonce(gob[0], '🪤 Un piège attend quelqu\'un…'); }
        }
    }
    function couronner(e) {
        $gameTroop.members().forEach(function (x) { x._couronne = false; });
        e._couronne = true; e._couronneDepuis = tour();
        annonce(e, '👑 Le chef, pour l\'instant', '#ffe08a');
    }

    var _tour = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        if (!LesPeuples._eteint && enCombat()) { debutDeTour(); }
        _tour.call(this);
    };
    function debutDeTour() {
        var t = tour();
        chants();
        // les gelées : l'humeur venue du dernier coup, puis les fusions
        vivants('gelees').forEach(function (e) {
            if (e._humeurVenue) { humeur(e, e._humeurVenue, true); e._humeurVenue = null; }
        });
        fusions();
        // la couronne tourne
        var gob = vivants('gobelins'), chef = gob.filter(function (e) { return e._couronne; })[0];
        if (gob.length > 1 && (!chef || t - chef._couronneDepuis >= R.couronneTours)) {
            var autre = auHasard(gob.filter(function (e) { return e !== chef; }));
            if (autre) { if (chef) { annonce(chef, '🙃 Renversé !'); } couronner(autre); }
        } else if (gob.length && !chef) { couronner(gob[0]); }
        // les cris, les blagues, les hurlements, les rugissements (tous les trois tours)
        if (t > 0 && t % R.criTous === 0 && vivants('pleureuses').length) {
            annonce(vivants('pleureuses')[0], '😢 Un cri qui accable', '#a0b8ff');
            $gameParty.aliveMembers().forEach(function (h) { poser(h, ET.accablement); });
        }
        if (t % R.blagueTous === 1 && vivants('farfadets').length) {
            var rieur = auHasard($gameParty.aliveMembers());
            if (rieur && poser(rieur, ET.euphorie)) { annonce(vivants('farfadets')[0], '😂 Une blague : ' + rieur.name() + ' rit', '#fff0a0'); }
        }
        if (t > 0 && t % R.hurlementTous === 0 && vivants('loups').length) {
            var proie = $gameParty.aliveMembers().slice().sort(function (a, b) { return a.hpRate() - b.hpRate(); })[0];
            if (proie && poser(proie, ET.effroi)) { annonce(vivants('loups')[0], '🐺 Un hurlement : ' + proie.name() + ' a peur', '#c0c8ff'); }
        }
        var fiers = vivants('vouivres').concat(vivants('orgueils'));
        if (t > 0 && t % R.rugissementTous === 0 && fiers.length) {
            var fort = $gameParty.aliveMembers().slice().sort(function (a, b) { return b.atk - a.atk; })[0];
            if (fort && poser(fort, ET.superbe)) { annonce(fiers[0], '🐲 Un rugissement : ' + fort.name() + ' se croit au-dessus', '#ffd080'); }
        }
        // les Petits Refus protègent un allié du prochain état
        vivants('petitsrefus').forEach(function (e) {
            var allie = auHasard($gameTroop.aliveMembers().filter(function (x) { return x !== e; }));
            if (allie) { allie._refus = true; }
        });
        // les braises vacillent
        vivants('braises').forEach(function (e) {
            e._vacille = hasard(1 / 3);
            if (e._vacille) { annonce(e, '🕯 Elle vacille', '#ffb070'); }
        });
    }

    var _finTour = BattleManager.endTurn;
    BattleManager.endTurn = function () {
        if (!LesPeuples._eteint && enCombat()) { finDeTour(); }
        _finTour.call(this);
    };
    function finDeTour() {
        vivants('gelees').forEach(function (e) {
            if (e._humeur === 'rose') {
                $gameTroop.aliveMembers().forEach(function (x) { if (x.hp < x.mhp) { soigner(x, x.mhp * R.gelee.rose); } });
                annonce(e, '🩷 Sa joie les refait', '#ffc0e0');
            }
        });
        if ($gameParty.aliveMembers().some(function (h) { return h.isStateAffected(ET.euphorie); })) {
            vivants('farfadets').forEach(function (e) { if (e.hp < e.mhp) { soigner(e, e.mhp * R.farfadetSoin); annonce(e, '😂 On rit encore : il se refait'); } });
        }
        vivants('trolls').forEach(function (e) { if (e._rancune > 0 && e.hp < e.mhp) { soigner(e, e.mhp * R.rancuneSoin); } });
        $gameParty.aliveMembers().forEach(function (h) {
            if (h.isStateAffected(ET.sommeil) && h.hp < h.mhp && $gameTroop.aliveMembers().some(function (e) { return de(e, 'reveurs'); })) {
                soigner(h, h.mhp * R.reveSoin); annonce(h, '💤 Il rêve, et se refait', '#c0b0ff');
            }
        });
        // les Os-Têtus se relèvent
        $gameTroop.members().forEach(function (e) {
            if (de(e, 'ostetus') && e.isDead() && e._seRelever) {
                e._seRelever = false; e.revive(); e.setHp(Math.max(1, Math.floor(e.mhp * R.ostetusPV)));
                annonce(e, '🦴 Têtu, il se relève', '#e0e0c0');
            }
        });
    }

    // --- les dégâts ----------------------------------------------------------
    var _valeur = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (cible, critique) {
        var v = _valeur.call(this, cible, critique);
        if (!enCombat() || !v) { return v; }
        var s = this.subject(), k = 1, item = this.item();
        // ce que fait celui qui frappe
        if (ennemi(s) && !estBoss(s) && v > 0) {
            var p = peuple(s);
            if (p === 'gelees' && s._humeur === 'rouge') { k *= R.gelee.rouge; }
            if (p === 'gelees' && s._humeur === 'dore') { k *= R.gelee.dore; }
            if (p === 'gobelins') { k *= s._couronne ? R.couronne : R.couronneAutres; }
            if (p === 'orques' && s._colereDite) { k *= R.colereCalme; }
            if (p === 'loups' && heros(cible)) {
                var peur = $gameParty.aliveMembers().filter(function (h) { return h.isStateAffected(ET.effroi) || h.isGuard() || h.hpRate() < 0.3; }).length;
                k *= 1 + R.peurParHeros * peur;
                if (cible.isStateAffected(ET.euphorie)) { k *= R.rireLoup; }
            }
            if (p === 'envies' && s._pasPaye) { k *= R.envieColere; }
            if (p === 'rancoeurs') { k *= Math.min(R.rancoeurMax, 1 + R.rancoeurParTour * tour()); }
        }
        // ce qui arrive à qui est frappé
        if (ennemi(cible) && !estBoss(cible) && v > 0) {
            var q = peuple(cible);
            if (q === 'gelees' && cible._humeur === 'bleu') { k *= R.gelee.bleu; }
            if (q === 'statues') {
                var autres = $gameTroop.aliveMembers().some(function (x) { return x !== cible && peuple(x) !== 'statues'; });
                k *= autres ? R.statueProtegee : R.statueSeule;
            }
            if (q === 'vouivres' || q === 'orgueils') {
                var part = v / Math.max(1, cible.mhp);
                if (part < R.petitCoup) { k *= R.petit; } else if (part >= R.grandCoup) { k *= R.grand; }
            }
            if (q === 'errants') {
                var art = artDe(item);
                if (art === 'mouvement') { k *= R.errantMouvement; } else if (art === 'ecrit') { k *= R.errantEcrit; }
            }
            if (q === 'braises' && cible._vacille) { k *= R.braiseVacille; }
        }
        return k === 1 ? v : Math.round(v * k);
    };

    // l'esquive des gelées qui ont peur
    var _xparam = Game_Enemy.prototype.xparam;
    Game_Enemy.prototype.xparam = function (id) {
        var v = _xparam.call(this, id);
        if (id === 1 && de(this, 'gelees') && this._humeur === 'jaune') { v += R.gelee.jaune; }
        return v;
    };

    // --- après un coup -------------------------------------------------------
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (cible) {
        var s = this.subject();
        // le piège des gobelins : le premier héros qui agit
        _apply.call(this, cible);
        if (!enCombat()) { return; }
        var r = cible.result(), touche = r.isHit() && (r.hpDamage > 0 || r.mpDamage > 0);
        if (heros(s) && ennemi(cible) && !estBoss(cible)) {
            var q = peuple(cible);
            if (q === 'gelees' && touche) {
                var el = elementsDe(this).map(function (x) { return ELEMENT_HUMEUR[x]; }).filter(Boolean)[0];
                if (el) { cible._humeurVenue = el; }
            }
            if (q === 'orques' && touche) {
                if (cible._colereAnnoncee && !cible._colereDite) { cible._colereInterrompue = true; }
                cible._coupsRecus = (cible._coupsRecus || 0) + 1;
                if (cible._coupsRecus >= R.colereCoups && !cible._colereAnnoncee) {
                    cible._colereAnnoncee = tour(); annonce(cible, '😤 Sa colère monte : laissez-la dire', '#ff9a7a');
                }
            }
            if (q === 'arbres' && touche && this.isSkill() && this.item().id !== s.attackSkillId()) { cible._souvenir = this.item().id; }
            if (q === 'ostetus' && r.hpDamage > 0) {
                var feu = elementsDe(this).some(function (x) { return x === 8 || x === 14; });
                cible._dernierFeu = feu;
            }
        }
        if (ennemi(s) && !estBoss(s) && heros(cible) && touche) {
            var p = peuple(s);
            if (p === 'gelees' && s._humeur === 'vert') {
                var b = [0, 1, 2, 3, 4, 5, 6, 7].filter(function (i) { return cible.isBuffAffected(i); })[0];
                if (b !== undefined) { cible.removeBuff(b); annonce(cible, '🟢 Elle lui prend un renfort', '#a0ffb0'); }
            }
            if (p === 'murmures' && poser(cible, ET.doute)) { annonce(cible, '💭 Le doute s\'installe', '#c0c0ff'); }
            if (p === 'envies' && poser(cible, ET.jalousie)) { annonce(cible, '💚 Jaloux', '#80ff90'); }
            if (p === 'reveurs' && hasard(R.sommeil) && poser(cible, ET.sommeil)) { annonce(cible, '💤 Les spores l\'endorment', '#c0b0ff'); }
            if (p === 'affames' && cible._derniereTechnique) {
                cible._souvenirMange = { id: cible._derniereTechnique, jusqua: tour() + R.souvenirTours };
                annonce(cible, '🧠 Il a mangé ce souvenir : ' + $dataSkills[cible._derniereTechnique].name, '#d0a0ff');
            }
        }
    };

    // les Petits Refus : un allié protégé du prochain état ; un renfort de héros peut devenir son contraire
    var _ajoutEtat = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (id) {
        if (enCombat() && ennemi(this) && this._refus && this.isAlive() && id !== this.deathStateId() && $dataStates[id] &&
            !this.isStateAffected(id) && id !== 1005) {
            this._refus = false;
            annonce(this, '🙅 Non !', '#ffb0b0');
            return;
        }
        _ajoutEtat.call(this, id);
    };
    var _renfort = Game_Battler.prototype.addBuff;
    Game_Battler.prototype.addBuff = function (p, t) {
        if (enCombat() && heros(this) && vivants('petitsrefus').length && hasard(R.refus)) {
            annonce(this, '🙅 « Non ! » : le contraire', '#ffb0b0');
            return this.addDebuff(p, t);
        }
        _renfort.call(this, p, t);
    };

    // --- ce que chacun fait de son tour ---------------------------------------
    var _actions = Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions = function () {
        _actions.call(this);
        if (!enCombat() || estBoss(this)) { return; }
        var p = peuple(this);
        if (p === 'pleureuses' && this._veille) {
            this._veille = false; this.clearActions();
            annonce(this, '🎶 Elle chante la Veille', '#a0b8ff');
            return;
        }
        if (p === 'arbres') {
            if (tour() % 2 === 1) { this.clearActions(); annonce(this, '🌳 Lent…', '#b0d0a0'); return; }
            if (this._souvenir && this._actions.length && hasard(0.5)) {
                this._actions[0].setSkill(this._souvenir);
                annonce(this, '🌳 Il se souvient de ' + $dataSkills[this._souvenir].name, '#b0d0a0');
            }
        }
        if (p === 'orques' && this._colereAnnoncee && !this._colereDite && tour() > this._colereAnnoncee) {
            if (this._colereInterrompue) {
                poser(this, ET.emporte); annonce(this, '💢 Gardée, elle l\'emporte', '#ff6a5a');
            } else {
                annonce(this, '🗣 Il l\'a dite. Il se calme', '#a0e0a0');
            }
            this._colereDite = true;
        }
    };

    // les Vouivres et les Orgueils visent qui « monte plus haut »
    var _cibles = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function () {
        var t = _cibles.call(this);
        var s = this.subject();
        if (enCombat() && ennemi(s) && !estBoss(s) && (peuple(s) === 'vouivres' || peuple(s) === 'orgueils') &&
            this.isForOpponent() && this.isForOne() && t.length) {
            var haut = $gameParty.aliveMembers().slice().sort(function (a, b) { return b.level - a.level || b.atk - a.atk; })[0];
            if (haut) { return t.map(function () { return haut; }); }
        }
        return t;
    };

    // --- les états d'âme sur les héros ---------------------------------------------
    // Effroi : il ne peut pas attaquer (ni coup, ni drain)
    var _peutUtiliser = Game_BattlerBase.prototype.canUse;
    Game_BattlerBase.prototype.canUse = function (item) {
        if (enCombat() && item && this.isStateAffected && this.isStateAffected(ET.effroi) && DataManager.isSkill(item) &&
            (item.id === this.attackSkillId() || [1, 5].indexOf(item.damage.type) >= 0)) { return false; }
        if (enCombat() && item && DataManager.isSkill(item) && this._souvenirMange && this._souvenirMange.id === item.id && tour() <= this._souvenirMange.jusqua) { return false; }
        return _peutUtiliser.call(this, item);
    };
    if (Game_Actor.prototype.hasOwnProperty('canUse')) {
        var _peutUtiliserH = Game_Actor.prototype.canUse;
        Game_Actor.prototype.canUse = function (item) {
            if (!Game_BattlerBase.prototype.canUse.call(this, item)) { return false; }
            return _peutUtiliserH.call(this, item);
        };
    }
    // Superbe : il refuse les soins des autres
    var _pv = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function (cible, valeur) {
        if (enCombat() && valeur < 0 && cible !== this.subject() && cible.isStateAffected && cible.isStateAffected(ET.superbe)) {
            annonce(cible, '👑 Il refuse : il n\'a besoin de personne', '#ffd080');
            valeur = 0;
        }
        if (enCombat() && valeur < 0 && ennemi(cible) && de(cible, 'gelees') && cible._humeur === 'dore' && cible !== this.subject()) { valeur = 0; }
        _pv.call(this, cible, valeur);
    };
    // Jalousie : au début de son action, il prend les renforts d'un allié ; les techniques sont retenues (les Affamés)
    var _debutAction = BattleManager.startAction;
    BattleManager.startAction = function () {
        var s = this._subject;
        if (enCombat() && s) {
            var act = s.currentAction();
            if (heros(s) && act && act.isSkill() && act.item().id !== s.attackSkillId()) { s._derniereTechnique = act.item().id; }
            if (heros(s) && act && act.isItem()) {
                vivants('envies').forEach(function (e) { e._pasPaye = true; annonce(e, '😾 Pris sans payer !', '#ff9090'); });
            }
            if (heros(s) && s.isStateAffected(ET.jalousie)) {
                var allie = auHasard($gameParty.aliveMembers().filter(function (x) { return x !== s && [0, 1, 2, 3, 4, 5, 6, 7].some(function (i) { return x.isBuffAffected(i); }); }));
                if (allie) {
                    [0, 1, 2, 3, 4, 5, 6, 7].forEach(function (i) { if (allie.isBuffAffected(i)) { allie.removeBuff(i); _renfort.call(s, i, 3); } });
                    annonce(s, '💚 Il prend les renforts de ' + allie.name(), '#80ff90');
                }
                s.removeState(ET.jalousie);
            }
            if (heros(s) && s._piegeGobelin) {
                s._piegeGobelin = false;
                var n = blesser(s, s.mhp * R.piege);
                poser(s, ET.effroi);
                annonce(s, '🪤 Le piège ! −' + n, '#ffb070');
                vivants('gobelins').forEach(function (g) { annonce(g, '😆 Ha !'); });
            }
        }
        _debutAction.call(this);
    };

    // --- la fin d'une action : les morts (YEP rend les cibles immortelles pendant l'action) -----------
    var _finAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        _finAction.call(this);
        if (!enCombat()) { return; }
        $gameTroop.members().forEach(function (e) {
            if (!e.isDead() || e._mortVue) { return; }
            e._mortVue = true;
            var p = estBoss(e) ? '' : peuple(e);
            // la rancune du troll le relève
            if (p === 'trolls' && e._rancune > 0) {
                e._rancune--; e._mortVue = false; e.revive(); e.setHp(Math.max(1, Math.floor(e.mhp * R.rancuneRelève)));
                annonce(e, '😠 Il se relève — rancune ' + e._rancune, '#ff9a7a');
                return;
            }
            if (p === 'ostetus' && e._releves > 0 && !e._dernierFeu) { e._releves--; e._seRelever = true; e._mortVue = false; annonce(e, '🦴 Un tas d\'os… qui bouge encore', '#e0e0c0'); return; }
            // les boss de la Bible : Corvina revient tant que sa volonté tient, Hurle-Doux s'incline, Vaëlle reviendra
            if (bossQuiTombe(e)) { return; }
            // « Un habitant du Chapitre 1 qui meurt pour de bon retombe en cendre d'âme, et ne laisse que sa braise »
            if (monde(e) === 'chapitre1' && !e._parlerParti && BRAISE && $dataItems[BRAISE] && hasard(CHANCE_BRAISE)) {
                e._braise = true;
                annonce(e, '🕯 Il ne reste que sa braise', '#ffb070');
            }
            if (p === 'murmures') {
                var autre = auHasard($gameTroop.aliveMembers().filter(function (x) { return x !== e; }));
                if (autre) {
                    var pire = 0, el = 0;
                    for (var i = 8; i <= 15; i++) { var r = autre.elementRate(i); if (r > pire) { pire = r; el = i; } }
                    if (el && pire > 1) { annonce(e, '🤫 « ' + autre.name() + ' craint : ' + $dataSystem.elements[el].trim().toLowerCase() + ' »', '#c0c0ff'); }
                }
            }
            // une pleureuse chante la Veille et recueille ce qu'il portait
            var pl = vivants('pleureuses').filter(function (x) { return x !== e; })[0];
            if (pl && !estBoss(e)) {
                pl._veille = true;
                pl._recueil = (pl._recueil || []).concat(e.makeDropItems ? e.makeDropItems() : []);
                e._recueilli = true;
            }
            // le nom d'un mort redevient libre après le Temps du Nom
            if (e._nomPropre) { registre().liberes[e._nomPropre] = TEMPS_DU_NOM; }
        });
    };
    // ce qu'une pleureuse a recueilli tombe avec elle ; ce qu'elle a recueilli ne tombe pas deux fois
    var _butinEnnemi = Game_Enemy.prototype.makeDropItems;
    Game_Enemy.prototype.makeDropItems = function () {
        if (this._recueilli) { return []; }
        var l = _butinEnnemi.call(this);
        if (this._braise && BRAISE && $dataItems[BRAISE]) { l = l.concat([$dataItems[BRAISE]]); }
        return this._recueil ? l.concat(this._recueil) : l;
    };

    // =========================================================================
    // Les boss de la Bible (« Le Chapitre 1 dans le jeu », « comment l'arrêter sans le tuer »)
    // Parler s'occupe de la parole (<Parler approches / besoin / objet / texte / fin / interrupteur>) ;
    // ici, ce qui se passe au combat.
    // =========================================================================
    function meta(e, k) { var m = e && e.enemy && e.enemy() && e.enemy().meta; var v = m ? m[k] : undefined; return typeof v === 'string' ? v.trim() : v; }
    function monde(e) { var v = meta(e, 'Monde'); return typeof v === 'string' ? v.toLowerCase() : ''; }
    function alluméSiDit(e) { var sw = Number(meta(e, 'Parler interrupteur')) || 0; if (sw > 0) { $gameSwitches.setValue(sw, true); } }
    function partCalme(e, texte) {
        e._parlerParti = 'calme';
        alluméSiDit(e);
        annonce(e, texte, '#a8e6ff');
        e.escape();
    }

    // Au début du combat : la volonté de Corvina, la Tenue d'Aymeric, les retours de Vaëlle
    function bossAuDebut() {
        $gameTroop.members().forEach(function (e) {
            var v = Number(meta(e, 'Volonte'));
            if (v > 0) { e._volonte = v; annonce(e, '🪶 Elle reviendra : volonté ' + v, '#c0b0ff'); }
            if (meta(e, 'Tenue')) { annonce(e, '🛡 La Tenue : le terrain reste calme autour de lui', '#c8e6ff'); }
            if (meta(e, 'CentFois')) {
                var c = ($gameSystem._centFois = $gameSystem._centFois || {}), n = c[e.enemyId()] || 0;
                if (n > 0) {
                    var k = R.centFoisParRetour * n;
                    e.addParam(0, Math.round(e.mhp * k)); e.addParam(2, Math.round(e.atk * k)); e.recoverAll();
                    annonce(e, '😊 Elle revient. Encore. (' + n + (n > 1 ? ' fois' : ' fois') + ')', '#ffd9a0');
                }
            }
        });
    }
    // Quand l'un d'eux tombe
    function bossQuiTombe(e) {
        // Corvina : « Impossible de la tuer pour de bon : il faut briser sa volonté »
        if (e._volonte !== undefined) {
            if (e._volonte > 0) {
                e._volonte--; e._mortVue = false; e.revive(); e.setHp(Math.max(1, Math.floor(e.mhp * R.volonteReleve)));
                annonce(e, '🪶 Elle revient — volonté ' + e._volonte, '#c0b0ff');
            } else {
                e.revive(); e.setHp(1);
                partCalme(e, '🪶 Sa volonté est brisée. Elle s\'en va.');
            }
            return true;
        }
        // Hurle-Doux : « le laisser dire sa colère jusqu'au bout, puis le vaincre loyalement »
        if (meta(e, 'Loyal') && e._colereDite && !e._colereInterrompue) {
            e.revive(); e.setHp(1);
            if (window.Parler && Parler.reputation) { Parler.reputation(peuple(e) || 'orques', 1); }
            partCalme(e, '🙇 Vaincu loyalement, il s\'incline');
            return true;
        }
        // Vaëlle la Cent-Fois : elle revient après chaque défaite
        if (meta(e, 'CentFois')) {
            var c = ($gameSystem._centFois = $gameSystem._centFois || {});
            c[e.enemyId()] = (c[e.enemyId()] || 0) + 1;
            annonce(e, '😊 « À la prochaine. »', '#ffd9a0');
            return true;
        }
        return false;
    }

    // Les chants de Hurle-Doux : « sa colère soulève la pierre, son chagrin noie un champ de bataille, sa joie fait pousser l'herbe »
    function chants() {
        var t = tour();
        if (t <= 0 || t % R.chantsTous !== 0) { return; }
        $gameTroop.aliveMembers().forEach(function (e) {
            if (!meta(e, 'Chants')) { return; }
            var r = e.hpRate();
            if (r > 2 / 3) {
                $gameTroop.aliveMembers().forEach(function (x) { if (x.hp < x.mhp) { soigner(x, x.mhp * R.chantJoie); } });
                annonce(e, '🎶 Sa joie fait pousser l\'herbe : les siens se refont', '#b0ffb0');
            } else if (r > 1 / 3) {
                $gameParty.aliveMembers().forEach(function (h) { var n = blesser(h, h.mhp * R.chantColere); if (n > 0) { annonce(h, '🪨 −' + n, '#ffb070'); } });
                annonce(e, '🎶 Sa colère soulève la pierre', '#ff9a7a');
            } else {
                $gameParty.aliveMembers().forEach(function (h) { poser(h, ET.accablement); });
                annonce(e, '🎶 Son chagrin noie le champ de bataille', '#a0b8ff');
            }
        });
    }

    // La Tenue, le duel, les braises de Dame Sanglot : sur les dégâts
    var _valeurBoss = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (cible, critique) {
        var v = _valeurBoss.call(this, cible, critique);
        if (!enCombat() || !v || v < 0) { return v; }
        var s = this.subject(), k = 1;
        // Aymeric tient sa position : les autres sont à l'abri
        if (ennemi(cible) && !meta(cible, 'Tenue') && $gameTroop.aliveMembers().some(function (x) { return meta(x, 'Tenue') && !(x._tenueRompue >= tour()); })) { k *= R.tenue; }
        // Brennus : un duel. Un autre qui s'en mêle frappe à moitié, et le met en colère
        if (ennemi(cible) && meta(cible, 'Duel') && heros(s) && cible._dueliste && cible._dueliste !== s) { k *= R.duelAutre; }
        if (ennemi(s) && meta(s, 'Duel') && s._deshonneur) { k *= 1 + R.duelColere * s._deshonneur; }
        // Dame Sanglot déteste qui porte les braises de ses morts
        if (ennemi(s) && meta(s, 'GardeLesBraises') && BRAISE && $dataItems[BRAISE]) { k *= Math.min(R.braisesMax, 1 + R.parBraise * $gameParty.numItems($dataItems[BRAISE])); }
        return k === 1 ? v : Math.round(v * k);
    };
    var _applyBoss = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (cible) {
        _applyBoss.call(this, cible);
        if (!enCombat() || !ennemi(cible)) { return; }
        var s = this.subject(), r = cible.result();
        if (!heros(s) || !r.isHit() || !(r.hpDamage > 0)) { return; }
        if (meta(cible, 'Tenue') && r.hpDamage >= cible.mhp * R.tenueRompue && !(cible._tenueRompue >= tour())) {
            cible._tenueRompue = tour() + 1;
            annonce(cible, '🛡 La Tenue cède', '#ffb070');
        }
        if (meta(cible, 'Duel')) {
            if (!cible._dueliste) { cible._dueliste = s; annonce(cible, '⚔ Un duel : ' + s.name(), '#ffd080'); }
            else if (cible._dueliste !== s) { cible._deshonneur = (cible._deshonneur || 0) + 1; annonce(cible, '😤 Ce n\'est pas un duel !', '#ff7a7a'); }
        }
    };
    // la Brisure fissure la volonté de Corvina
    var _etatBoss = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (id) {
        var avant = this.isStateAffected(id);
        _etatBoss.call(this, id);
        if (enCombat() && ennemi(this) && this._volonte > 0 && id === 1005 && !avant && this.isStateAffected(id)) {
            this._volonte--;
            annonce(this, '🪶 Sa volonté se fissure (' + this._volonte + ')', '#c0b0ff');
        }
    };
    // Vaëlle n'esquive jamais
    var _xparamBoss = Game_Enemy.prototype.xparam;
    Game_Enemy.prototype.xparam = function (id) {
        if (id === 1 && meta(this, 'CentFois')) { return 0; }
        return _xparamBoss.call(this, id);
    };
    // Ruedan : chaque bonne réponse (Écouter) lui ôte un peu de rancune — « un troll qui pardonne meurt en paix »
    if (window.Parler && Parler.quandEcoute) {
        Parler.quandEcoute.push(function (e, bon, n) {
            if (meta(e, 'Pardon') && e._rancune > 0) {
                e._rancune--;
                annonce(e, '😮‍💨 Sa rancune baisse (' + e._rancune + ')', '#c0e0ff');
            }
        });
    }
    // la fusion : l'expérience de celle qui s'est fondue revient à qui tombe
    var _exp = Game_Troop.prototype.expTotal;
    Game_Troop.prototype.expTotal = function () {
        var v = _exp.call(this);
        this.deadMembers().forEach(function (e) { if (e._expFusion) { v += e._expFusion; } });
        return v;
    };
    // une créature apaisée ou partie garde son nom (elle vit) ; une tuée le libère (plus haut)

    window.LesPeuples = {
        REGLAGES: R, HUMEURS: HUMEURS, NOMS: NOMS, ETATS: ET, peuple: peuple, humeur: humeur,
        debutDeCombat: debutDeCombat, debutDeTour: debutDeTour, finDeTour: finDeTour, _eteint: false
    };
})();
