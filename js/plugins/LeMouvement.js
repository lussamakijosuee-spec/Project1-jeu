//=============================================================================
// LeMouvement.js — v1.0
// Le Mouvement, l'art du Corps (mana négatif) : la posture, le flux, le geste juste.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le Mouvement (mana négatif) : chaque technique met le héros
 * dans la POSTURE de sa Voie ; enchaîner une autre Voie fait monter le FLUX ;
 * à 3, le GESTE JUSTE ; un gros coup brise le flux. Dans le flux, on frappe en premier.
 * @author pour JOKO
 *
 * @param === LES POSTURES ===
 * @default
 *
 * @param etatsPosture
 * @text États des postures (Voie:état)
 * @default forge:248, onde:249, source:250, miroir:251, vide:252, eclair:253, domaine:254, flash:255, sang:256
 * @desc Un état par Voie. Son icône est la posture ; son chiffre, le flux.
 *
 * @param elementsCorps
 * @text Éléments du corps
 * @default 4, 5
 * @desc Mana négatif (4) — et 5, « Mana Sombre », qui est la même chose (JOKO). Une technique de ces éléments est un mouvement.
 *
 * @param typesExclus
 * @text Types de compétence qui ne sont pas ses mouvements
 * @default 21
 * @desc 21 avatar : c'est seiryu qui bouge, pas Korrah — elle garde sa posture, sans faire monter le flux.
 *
 * @param neutres
 * @text Compétences qui gardent la posture
 * @default 2
 * @desc 2 = la Garde : on reste en posture, sans faire monter le flux.
 *
 * @param acteursExclus
 * @text Ceux qui n'ont pas de posture
 * @default 6
 * @desc seiryu (6).
 *
 * @param === LE FLUX ===
 * @default
 *
 * @param fluxGeste
 * @text Flux du geste juste
 * @type number
 * @min 2
 * @default 3
 *
 * @param bonusEnchaine
 * @text Enchaîner une autre Voie : dégâts ×
 * @default 1.15
 *
 * @param bonusGeste
 * @text Le geste juste : dégâts ×
 * @default 1.5
 *
 * @param malusRepete
 * @text Répéter la même technique : dégâts ×
 * @default 0.85
 * @desc Et le flux retombe à 0.
 *
 * @param === LE GESTE FAUX ===
 * @default
 *
 * @param seuilBrise
 * @text Un coup de (% des PV max) brise le flux
 * @type number
 * @default 15
 *
 * @param === EN PREMIER ===
 * @default
 *
 * @param premierDesFlux
 * @text Dans le flux dès (0 = jamais en premier)
 * @type number
 * @default 1
 * @desc Un héros dont le flux atteint ce chiffre et qui lance un mouvement agit avant tout le monde.
 *
 * @param === VESPER : LE CONTRE-TEMPS ===
 * @default
 *
 * @param contreTemps
 * @text Ceux dont la riposte fait monter le flux
 * @default 1
 * @desc Vesper (1) — « spécialiste de la CONTRE-ATTAQUE ». Un Reflux ou un Renvoi qui part pendant le tour ennemi : flux +1 ; au 3, la riposte est un geste juste.
 *
 * @param riposte
 * @text <Riposte> : rend (× les dégâts reçus)
 * @default 1
 * @desc Une compétence <Riposte> arme une riposte : le prochain qui frappe reçoit ce qu'il a donné.
 *
 * @param apresRiposte
 * @text <ApresRiposte> : dégâts ×
 * @default 1.5
 * @desc Si elle a riposté depuis sa dernière action.
 *
 * @param === KORRAH : PENSER JUSTE ===
 * @default
 *
 * @param penserJuste
 * @text Ceux pour qui une Parole est une étape du flux
 * @default 2
 * @desc Korrah (2) — « frapper juste ET penser juste ». Dans une posture, sa Parole ne rompt rien : flux +1 (×1,15), le geste juste peut tomber sur elle.
 *
 * @param luDavance
 * @text <Lecture> : son prochain mouvement sur l'ennemi lu ×
 * @default 1.5
 *
 * @param === KORRAH : LA TÊTE EN L'AIR ===
 * @default
 *
 * @param teteEnLair
 * @text Ceux qui ont la tête en l'air
 * @default 2
 * @desc Korrah (2) — « des attaques visées ratées […] Elle doit apprendre à se concentrer » (la Bible).
 *
 * @param rateTeteEnLair
 * @text Attaque visée ratée (%)
 * @default 15
 * @desc Ses attaques sur une seule cible ratent cette part du temps, sauf concentrée (une <Sur> ne rate jamais).
 *
 * @param etatConcentree
 * @text État — Concentrée
 * @type state
 * @default 258
 *
 * @param bonusConcentree
 * @text Concentrée : dégâts ×
 * @default 1.25
 * @desc Sa prochaine attaque visée ne rate pas (ni esquive) et frappe plus fort ; la concentration part avec elle.
 *
 * @param seConcentrent
 * @text Ce qui la concentre (compétences)
 * @default 451
 * @desc En plus de « penser juste » (une Parole dans sa posture) : Focalisation (451).
 *
 * @param === LES VERBES DU CORPS ===
 * @default
 *
 * @param finitParFlux
 * @text <Finit> : + par point de flux (le flux est vidé)
 * @default 0.3
 *
 * @param reprise
 * @text <Reprise> : la même technique une 2ᵉ fois ×
 * @default 1.2
 * @desc La 3ᵉ fois de suite : le geste juste (×1,5). Au lieu de s'user (×0,85).
 *
 * @param entreDeux
 * @text <Entre> : sur un ennemi qui a déjà agi ce tour ×
 * @default 1.5
 *
 * @param coupDeGrace
 * @text <Grace> : sur un ennemi à bout ×
 * @default 1.5
 *
 * @param seuilGrace
 * @text <Grace> : « à bout » = sous (% des PV max)
 * @type number
 * @default 25
 *
 * @param immobile
 * @text <Immobile> : pas touché depuis sa dernière action ×
 * @default 1.5
 *
 * @param accumuleParRiposte
 * @text <Accumule> : + par riposte depuis la dernière fois
 * @default 0.15
 *
 * @param neufVoiesParVoie
 * @text <NeufVoies> : + par Voie déjà prise dans le combat
 * @default 0.1
 *
 * @param lache
 * @text <Lache> : ses dégâts ×, et ceux qu'elle reçoit ×
 * @default 1.5
 * @desc Jusqu'à sa prochaine action.
 *
 * @param tout
 * @text <ToutOuRien> : pile ×
 * @default 2
 *
 * @param rien
 * @text <ToutOuRien> : face ×
 * @default 0.25
 *
 * @param leurre
 * @text <Leurre> : esquive en plus (%) jusqu'à sa prochaine action
 * @type number
 * @default 30
 * @desc ludwing esquive déjà 35 % des coups : +30 % le porte à 65 % pour un tour.
 *
 * @param chanceux
 * @text <ToutOuRien> : ceux qui tirent deux fois
 * @default 3
 * @desc ludwing (3), « le plus CHANCEUX du groupe, littéralement ».
 *
 * @help
 * ============================================================================
 *  LE MOUVEMENT — le corps qui enchaîne                          pour JOKO
 * ============================================================================
 *  JOKO, le 2026-10-20 : « Mana sombre, c'est plus corporel, mouvement,
 *  fluidité, et maîtrise. » ; « D'abord, fais les mouvements. »
 *
 *  EST UN MOUVEMENT : une compétence de héros qui prend une Voie
 *  (MaitriseVoies, <Voie:> écrite ou Voie par défaut — jamais une Parole ni
 *  une technique de l'âme) et qui est physique, ou porte <Voie:>, ou est au
 *  mana négatif. L'Attaque en est un, dans la Voie du héros.
 *
 *  LA POSTURE — après un mouvement, le héros est dans la posture de sa Voie :
 *  une icône sur lui, avec le flux en chiffre. Celle d'Onde et celle de Miroir
 *  répondent pendant le tour ennemi (Reflux, Renvoi — MaitriseVoies).
 *
 *  LE FLUX — enchaîner un mouvement d'une AUTRE Voie : flux +1, dégâts ×1,15.
 *  Même Voie, autre technique : rien ne bouge. La même technique deux fois
 *  de suite : ×0,85, et le flux retombe. Au flux 3 : LE GESTE JUSTE, ×1,5,
 *  puis le flux repart de 0.
 *
 *  LE GESTE FAUX — un coup de 15 % des PV max, ou un état qui immobilise,
 *  brise le flux et la posture. Une Parole, une technique de l'âme ou un
 *  objet aussi : le corps s'arrête. La Garde garde la posture.
 *
 *  EN PREMIER — dans le flux (dès 1), un mouvement part avant tout le monde.
 *  C'est l'inverse des longues Paroles, qui partent en dernier.
 *
 *  Tout s'annonce au-dessus du héros (le journal de combat est muet ici).
 *  Les ennemis ne changent pas.
 *
 *  LES SIGNATURES (2026-10-22, JOKO : « rendre les vraiment intéressant et
 *  original »), tirées de leurs profils :
 *  VESPER, LE CONTRE-TEMPS — « spécialiste de la CONTRE-ATTAQUE ». Quand une
 *  riposte part pendant le tour ennemi (le Reflux de l'Onde, le Renvoi du
 *  Miroir, une <Riposte>), son flux monte de 1 ; au 3, la riposte est un
 *  GESTE JUSTE (×1,5). Elle enchaîne pendant qu'on la frappe — tant que le
 *  coup reçu ne brise pas sa posture. <Riposte> (ses gardes) arme une riposte
 *  qui rend ce qu'elle reçoit ; <ApresRiposte> frappe ×1,5 si elle a riposté
 *  depuis sa dernière action. Une action FORCÉE annoncée par
 *  LeMouvement.riposteForcee(héros, compétence) — la contre-attaque de son
 *  État de Flow (JOKO, 2026-10-26 : « L4 ») — est une riposte : son flux
 *  monte, au 3 elle est un geste juste, et elle ne compte pas comme un geste
 *  de plus.
 *  KORRAH, PENSER JUSTE — « frapper juste ET penser juste ». Dans une posture,
 *  sa Parole ne rompt pas le flux : c'est un pas de plus (+1, ×1,15), et le
 *  geste juste peut tomber sur la Parole ; le mouvement d'après compte comme
 *  une autre Voie. <Lecture> (Lecture du Corps, Œil du Stratège, Analyse
 *  Tactique) : l'ennemi est lu, son prochain mouvement sur lui frappe ×1,5.
 *  KORRAH, LA TÊTE EN L'AIR (le rework, K1, 2026-10-25 ; la Bible : « des
 *  attaques visées ratées […] Elle doit apprendre à se concentrer ») — ses
 *  attaques sur une seule cible ratent 15 % du temps (pas une <Sur>). Penser
 *  juste ou Focalisation la CONCENTRE (état 258, 🎯) : sa prochaine attaque
 *  visée ne rate pas, ne s'esquive pas, et frappe ×1,25 — puis la
 *  concentration part. Ce qui la concentre n'en profite pas soi-même.
 *
 *  LES VERBES DU CORPS (2026-10-22, « Oui rework tout ») — une balise sur une
 *  capacité, une ligne dans sa description ; chacun vient du nom que JOKO lui
 *  a donné, et reste dans la règle du corps (un mouvement, payé en PT) :
 *   <Ouvre>     — entrer en posture avec de l'élan : flux 1 tout de suite ;
 *   <Finit>     — tout le flux dans un coup : ×(1 + 0,3 par point), flux 0 ;
 *   <Reprise>   — la même technique ne s'use pas : 2ᵉ fois ×1,2, 3ᵉ ×1,5 ;
 *   <Sur>       — ne rate jamais, ne s'use pas en la répétant ;
 *   <Entre>     — ×1,5 sur un ennemi qui a déjà agi ce tour (« entre son geste
 *                 et le suivant ») ;
 *   <Grace>     — ×1,5 sur un ennemi sous 25 % de ses PV ;
 *   <Immobile>  — ×1,5 si on ne l'a pas touchée depuis sa dernière action ;
 *   <Accumule>  — ×(1 + 0,15 par riposte de Vesper depuis la dernière fois) ;
 *   <EclatNoir> — (MaitriseVoies) l'Éclat Noir est sûr quand le flux est à 2 ;
 *   <Riposte>   — arme une riposte (sur soi ou en frappant) : le prochain qui
 *                 frappe reçoit ce qu'il a donné ;
 *   <Lache>     — ×1,5, mais elle encaisse ×1,5 jusqu'à sa prochaine action ;
 *   <Premier>   — part toujours avant tout le monde ;
 *   <NeufVoies> — +10 % par Voie déjà prise dans ce combat ;
 *   <ToutOuRien> — pile ×2, face ×0,25 ; ludwing tire deux fois ;
 *   <Leurre>    — esquive +30 % jusqu'à sa prochaine action (« il n'y a plus
 *                 moyen de savoir lequel est lui ») ;
 *   <Rythme>    — un allié (ou soi) dans sa posture prend un point de flux,
 *                 jusqu'à 2 : le geste juste reste à faire (« les armes coupent
 *                 mieux quand on s'en occupe »).
 * ============================================================================
 */

var LeMouvement = LeMouvement || {};

(function () {
    'use strict';

    var P = PluginManager.parameters('LeMouvement');
    var nombre = function (k, d) { var v = parseFloat(P[k]); return isNaN(v) ? d : v; };
    var liste = function (k, d) {
        return String(P[k] === undefined ? d : P[k]).split(',')
            .map(function (x) { return parseInt(x, 10); }).filter(function (x) { return !isNaN(x); });
    };

    var POSTURES = {};
    String(P['etatsPosture'] || 'forge:248, onde:249, source:250, miroir:251, vide:252, eclair:253, domaine:254, flash:255, sang:256')
        .split(',').forEach(function (x) {
            var m = /^\s*([a-zéè]+)\s*:\s*(\d+)\s*$/i.exec(x);
            if (m) { POSTURES[m[1].toLowerCase()] = Number(m[2]); }
        });
    var ETATS = Object.keys(POSTURES).map(function (v) { return POSTURES[v]; });
    var CORPS      = liste('elementsCorps', '4, 5');
    var TYPES_EXCL = liste('typesExclus', '21');
    var NEUTRES    = liste('neutres', '2');
    var EXCLUS     = liste('acteursExclus', '6');
    var GESTE      = nombre('fluxGeste', 3);
    var BONUS      = nombre('bonusEnchaine', 1.15);
    var BONUS_GESTE = nombre('bonusGeste', 1.5);
    var MALUS      = nombre('malusRepete', 0.85);
    var SEUIL      = nombre('seuilBrise', 15) / 100;
    var PREMIER    = nombre('premierDesFlux', 1);
    var CONTRE     = liste('contreTemps', '1');
    var RIPOSTE    = nombre('riposte', 1);
    var APRES      = nombre('apresRiposte', 1.5);
    var PENSER     = liste('penserJuste', '2');
    var LU         = nombre('luDavance', 1.5);
    var TETE       = liste('teteEnLair', '2');
    var RATE_TETE  = nombre('rateTeteEnLair', 15) / 100;
    var ETAT_CONC  = nombre('etatConcentree', 258);
    var BONUS_CONC = nombre('bonusConcentree', 1.25);
    var FOCALISE   = liste('seConcentrent', '451');
    var FINIT      = nombre('finitParFlux', 0.3);
    var REPRISE    = nombre('reprise', 1.2);
    var ENTRE      = nombre('entreDeux', 1.5);
    var GRACE      = nombre('coupDeGrace', 1.5);
    var SEUIL_GRACE = nombre('seuilGrace', 25) / 100;
    var IMMOBILE   = nombre('immobile', 1.5);
    var ACCUMULE   = nombre('accumuleParRiposte', 0.15);
    var NEUF       = nombre('neufVoiesParVoie', 0.1);
    var LACHE      = nombre('lache', 1.5);
    var TOUT       = nombre('tout', 2);
    var RIEN       = nombre('rien', 0.25);
    var CHANCEUX_TOR = liste('chanceux', '3');
    var LEURRE     = nombre('leurre', 30) / 100;

    var NOMS = { forge: 'Forge', onde: 'Onde', source: 'Source', miroir: 'Miroir', vide: 'Vide',
                 eclair: 'Éclair', domaine: 'Domaine', flash: 'Flash', sang: 'Sang' };
    var COULEURS = { forge: '#ffb070', onde: '#7ec8ff', source: '#8affa0', miroir: '#c8f0ff', vide: '#b8b8d0',
                     eclair: '#ffe066', domaine: '#d0a0ff', flash: '#c9a0ff', sang: '#ff6a6a' };

    function enCombat() { return $gameParty && $gameParty.inBattle(); }
    function heros(b) { return !!(b && b.isActor && b.isActor() && EXCLUS.indexOf(b.actorId()) < 0); }
    function annonce(b, texte, couleur) {
        if (window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, texte, couleur); }
    }
    function chiffre(x) { return String(Math.round(x * 100) / 100).replace('.', ','); }

    /** La Voie de ce mouvement, ou « » si l'action n'en est pas un. */
    function voieDuMouvement(action) {
        if (!action || !window.Voies || !Voies.voieDe) { return ''; }
        var b = action.subject(), it = action.item();
        if (!heros(b) || !it || !DataManager.isSkill(it)) { return ''; }
        if (TYPES_EXCL.indexOf(it.stypeId) >= 0) { return ''; }
        var v = Voies.voieDe(action);
        if (!v || !POSTURES[v]) { return ''; }
        // [JOKO 2026-10-22] Une seule règle pour les trois arts : LesTroisArts la porte.
        if (window.LesTroisArts && LesTroisArts.art) { return LesTroisArts.art(it) === 'mouvement' ? v : ''; }
        var ecrite = it.meta && it.meta.Voie !== undefined;
        var corps = !!it.damage && CORPS.indexOf(it.damage.elementId) >= 0;
        return (ecrite || it.hitType === 1 || corps) ? v : '';
    }
    // La Garde garde la posture ; un ordre à seiryu aussi (type 21 : c'est lui qui bouge, elle ne s'arrête pas).
    function neutre(action) {
        var it = action && action.item();
        return !!(it && DataManager.isSkill(it) && (NEUTRES.indexOf(it.id) >= 0 || TYPES_EXCL.indexOf(it.stypeId) >= 0));
    }

    //=========================================================================
    // La posture à l'écran : une icône, le flux en chiffre
    //=========================================================================
    function afficher(b) {
        ETATS.forEach(function (id) {
            if (id !== POSTURES[b._mvtVoie] && b.isStateAffected(id)) { b.eraseState(id); b.removeStateCounter(id); }
        });
        var id = POSTURES[b._mvtVoie];
        if (id) {
            if (!b.isStateAffected(id)) { b.addNewState(id); b.resetStateCounts(id); }
            if (b._mvtFlux > 0) { b.setStateCounter(id, b._mvtFlux); } else { b.removeStateCounter(id); b.refresh(); }
        } else {
            b.refresh();
        }
        if (enCombat() && BattleManager.refreshStatus) { BattleManager.refreshStatus(); }
    }
    function lacher(b, texte) {
        if (!b || !b._mvtVoie) { return; }
        var avait = b._mvtFlux > 0;
        b._mvtVoie = ''; b._mvtFlux = 0; b._mvtDernier = 0; b._mvtPense = false;
        afficher(b);
        if (texte && avait) { annonce(b, texte, '#ff8080'); }
    }
    function remettre(b) {
        b._mvtVoie = ''; b._mvtFlux = 0; b._mvtDernier = 0; b._mvtPense = false; b._riposte = false; b._luPar = 0;
        b._riposteForcee = 0; b._riposteEnCours = false;
        b._reprise = 0; b._touche = false; b._ripostesCompte = 0; b._lache = false; b._leurre = false; b._voiesVues = {};
    }

    //=========================================================================
    // Au départ de l'action : le flux bouge, la puissance est fixée
    //=========================================================================
    function estParole(it) { return !!(window.LesTroisArts && LesTroisArts.art(it) === 'parole'); }
    function balise(it, nom) { return !!(it && it.meta && it.meta[nom] !== undefined); }
    function penseJuste(b) { return heros(b) && PENSER.indexOf(b.actorId()) >= 0; }
    function cibleUnique(action) {
        if (!action.isForOpponent() || !action.isForOne() || !(action._targetIndex >= 0)) { return null; }
        return $gameTroop.members()[action._targetIndex] || null;
    }
    // Korrah : une Parole dans sa posture est un pas du flux, pas une rupture.
    function penser(b, action) {
        b._mvtFlux++; b._mvtPense = true; b._mvtDernier = action.item().id;
        var mult = BONUS, texte = '✎ Penser juste · flux ' + b._mvtFlux, couleur = '#9ad0ff';
        if (b._mvtFlux >= GESTE) {
            mult = BONUS_GESTE; b._mvtFlux = 0;
            texte = '✦ PENSER JUSTE ×' + chiffre(BONUS_GESTE); couleur = '#ffd84a';
            if ($gameScreen) { $gameScreen.startFlash([200, 230, 255, 140], 18); }
        }
        action._mvtMult = mult;
        annonce(b, texte, couleur);
        concentrer(b, action);                              // penser juste la concentre (la tête en l'air)
    }

    function decider(b, action) {
        b._lache = false;                                   // <Lache> : sa garde se referme quand elle agit à nouveau
        b._leurre = false;                                  // <Leurre> : les ombres se dissipent quand il agit à nouveau
        var v = voieDuMouvement(action);
        if (!v) {
            if (penseJuste(b) && b._mvtVoie && estParole(action.item())) { penser(b, action); return; }
            if (!neutre(action)) { lacher(b, '✗ Flux rompu'); }
            return;
        }
        var it = action.item(), id = it.id, avant = b._mvtVoie, mult = 1, texte, couleur = COULEURS[v];
        var change = v !== avant || !!b._mvtPense;          // après une Parole, Korrah change de Voie
        var repete = !!avant && b._mvtDernier === id;
        b._mvtPense = false;
        action._fluxAvant = b._mvtFlux || 0;
        if (!repete) { b._reprise = 0; }
        if (!avant) {
            b._mvtFlux = balise(it, 'Ouvre') ? 1 : 0;      // <Ouvre> : on entre en posture avec de l'élan
            texte = '◆ Posture : ' + NOMS[v] + (b._mvtFlux ? ' · élan' : '');
        } else if (balise(it, 'Finit') && b._mvtFlux > 0) {
            mult = 1 + FINIT * b._mvtFlux; b._mvtFlux = 0;  // <Finit> : tout le flux dans un coup
            texte = '⚑ Final ×' + chiffre(mult); couleur = '#ffd84a';
        } else if (repete && balise(it, 'Reprise')) {
            b._reprise = (b._reprise || 0) + 1;              // <Reprise> : le deuxième ×1,2, le troisième ×1,5
            mult = b._reprise >= 2 ? BONUS_GESTE : REPRISE;
            if (b._reprise >= 2) { b._reprise = 0; }
            texte = '🔨 Reprise ×' + chiffre(mult);
        } else if (repete && balise(it, 'Sur')) {
            texte = '◆ ' + NOMS[v] + (b._mvtFlux > 0 ? ' · flux ' + b._mvtFlux : '');   // <Sur> : rien ne s'use
        } else if (repete) {
            mult = MALUS; b._mvtFlux = 0;
            texte = '↺ Répété ×' + chiffre(MALUS); couleur = '#b0b0b0';
        } else if (change) {
            b._mvtFlux++;
            if (b._mvtFlux >= GESTE) {
                mult = BONUS_GESTE; b._mvtFlux = 0;
                texte = '✦ GESTE JUSTE ×' + chiffre(BONUS_GESTE); couleur = '#ffd84a';
                if ($gameScreen) { $gameScreen.startFlash([255, 230, 140, 140], 18); }
            } else {
                mult = BONUS;
                // court : les héros sont au bord droit de l'écran, une annonce longue y est coupée
                texte = '◆ ' + NOMS[v] + ' · flux ' + b._mvtFlux;
            }
        } else {
            texte = '◆ ' + NOMS[v] + (b._mvtFlux > 0 ? ' · flux ' + b._mvtFlux : '');
        }
        b._mvtVoie = v; b._mvtDernier = id;
        // Korrah a lu cet ennemi : ce mouvement-ci tombe juste.
        var c = cibleUnique(action);
        if (c && c._luPar === b.actorId()) {
            c._luPar = 0; mult *= LU;
            annonce(c, '◎ Lu d\'avance ×' + chiffre(LU), '#9ad0ff');
        }
        // Les verbes qui lisent la cible ou le corps
        if (c && balise(it, 'Entre') && (BattleManager._performedBattlers || []).indexOf(c) >= 0) {
            mult *= ENTRE; annonce(c, '◐ Entre deux ×' + chiffre(ENTRE), '#b8b8d0');
        }
        if (c && balise(it, 'Grace') && c.hp <= c.mhp * SEUIL_GRACE) {
            mult *= GRACE; annonce(c, '⚡ Coup de grâce ×' + chiffre(GRACE), '#ffe066');
        }
        if (balise(it, 'Immobile') && !b._touche) {
            mult *= IMMOBILE; annonce(b, '◯ Immobile ×' + chiffre(IMMOBILE), '#b8b8d0');
        }
        if (balise(it, 'Accumule') && b._ripostesCompte > 0) {
            var k = 1 + ACCUMULE * b._ripostesCompte; b._ripostesCompte = 0;
            mult *= k; annonce(b, '🌊 Toute la force ×' + chiffre(k), '#7ec8ff');
        }
        // <NeufVoies> : chaque Voie déjà prise dans ce combat compte (celle-ci comprise une fois prise)
        var vues = b._voiesVues || (b._voiesVues = {});
        if (balise(it, 'NeufVoies')) {
            var nv = Object.keys(vues).length;
            if (nv > 0) { var kv = 1 + NEUF * nv; mult *= kv; annonce(b, '◆ ' + nv + ' Voie' + (nv > 1 ? 's' : '') + ' ×' + chiffre(kv), couleur); }
        }
        vues[v] = 1;
        // <Lache> : tout dans le bras, la garde ouverte jusqu'à sa prochaine action
        if (balise(it, 'Lache')) {
            mult *= LACHE; b._lache = true;
            annonce(b, '✋ Garde lâchée ×' + chiffre(LACHE), '#ff8a6a');
        }
        // <Leurre> : jusqu'à sa prochaine action, on ne sait plus lequel est lui
        if (balise(it, 'Leurre')) {
            b._leurre = true;
            annonce(b, '👥 Leurre : esquive +' + Math.round(LEURRE * 100) + ' %', '#b8b8d0');
        }
        // <ToutOuRien> : pile ou face — le chanceux tire deux fois et garde le meilleur
        if (balise(it, 'ToutOuRien')) {
            var tirage = Math.random();
            if (CHANCEUX_TOR.indexOf(b.actorId()) >= 0) { tirage = Math.min(tirage, Math.random()); }
            var gagne = tirage < 0.5;
            mult *= gagne ? TOUT : RIEN;
            annonce(b, gagne ? '🎲 Tout ×' + chiffre(TOUT) : '🎲 Rien ×' + chiffre(RIEN), gagne ? '#a0ffa0' : '#b0b0b0');
        }
        action._mvtMult = mult;
        annonce(b, texte, couleur);
    }

    //=========================================================================
    // Les signatures : la riposte de Vesper, la lecture de Korrah
    //=========================================================================
    /** Appelée par MaitriseVoies quand un Reflux ou un Renvoi part : le multiplicateur de la riposte. */
    LeMouvement.riposte = function (b) {
        if (!heros(b) || CONTRE.indexOf(b.actorId()) < 0) { return 1; }
        b._riposte = true;
        b._ripostesCompte = (b._ripostesCompte || 0) + 1;   // <Accumule> : la force gardée
        if (!b._mvtVoie) { return 1; }                      // hors posture : la riposte part, sans flux
        b._mvtFlux++;
        var k = 1;
        if (b._mvtFlux >= GESTE) {
            b._mvtFlux = 0; k = BONUS_GESTE;
            annonce(b, '✦ GESTE JUSTE · contre-temps', '#ffd84a');
            if ($gameScreen) { $gameScreen.startFlash([255, 230, 140, 140], 18); }
        } else {
            annonce(b, '⚔ Contre-temps · flux ' + b._mvtFlux, '#ffb070');
        }
        afficher(b);
        return k;
    };

    //=========================================================================
    // Korrah, la tête en l'air : ses attaques visées ratent parfois — sauf
    // concentrée : alors elle ne rate pas, et frappe plus fort
    //=========================================================================
    function teteEnLair(b) { return heros(b) && TETE.indexOf(b.actorId()) >= 0; }
    function visee(action) {
        var it = action.item();
        return !!(it && enCombat() && teteEnLair(action.subject()) && action.isForOpponent() && it.scope === 1 &&
            it.damage && (it.damage.type === 1 || it.damage.type === 5));
    }
    function concentrer(b, action) {
        if (!teteEnLair(b) || !$dataStates[ETAT_CONC]) { return; }
        if (action) { action._concentreeNee = true; }       // ce qui la concentre n'en profite pas soi-même
        if (b.isStateAffected(ETAT_CONC)) { return; }
        b.addState(ETAT_CONC);
        if (b.isStateAffected(ETAT_CONC)) { annonce(b, '🎯 Concentrée', '#ffd84a'); }
    }
    /** Décidé une fois par action, au premier coup : '' | 'concentree' | 'ailleurs'. */
    function teteDe(action) {
        if (action._tete !== undefined) { return action._tete; }
        var b = action.subject();
        action._tete = '';
        if (!visee(action) || action._concentreeNee) { return ''; }
        if (b.isStateAffected(ETAT_CONC)) {
            action._tete = 'concentree';
            b.removeState(ETAT_CONC);
            annonce(b, '🎯 Concentrée ×' + chiffre(BONUS_CONC), '#ffd84a');
        } else if (!balise(action.item(), 'Sur') && Math.random() < RATE_TETE) {
            action._tete = 'ailleurs';
        }
        return action._tete;
    }

    // <Sur> : « rien qui rate, jamais »
    var _touche = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function (target) {
        var tete = teteDe(this);
        if (tete === 'concentree') { return 1; }
        if (tete === 'ailleurs') { return 0; }
        return balise(this.item(), 'Sur') && heros(this.subject()) ? 1 : _touche.call(this, target);
    };
    var _esquive = Game_Action.prototype.itemEva;
    Game_Action.prototype.itemEva = function (target) {
        if (this._tete === 'concentree') { return 0; }
        if (balise(this.item(), 'Sur') && heros(this.subject())) { return 0; }
        var e = _esquive.call(this, target);
        return target && target._leurre && heros(target) && enCombat() ? Math.min(0.95, e + LEURRE) : e;
    };

    var _appliquer = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _appliquer.call(this, target);
        var it = this.item(), u = this.subject();
        if (!enCombat() || !it || !heros(u) || !it.meta) { return; }
        if (this._tete === 'ailleurs' && !this._teteVue && target && target.result().missed) {
            this._teteVue = true;
            annonce(u, '💭 La tête ailleurs…', '#c0c0c0');
        }
        if (it.meta.Riposte !== undefined && !this._riposteArmee) {   // sur soi ou en frappant : une fois par action
            this._riposteArmee = true;
            u._voieReflux = RIPOSTE;
            annonce(u, '⚔ Riposte prête', '#ffb070');
        }
        // <Rythme> : un allié dans sa posture prend un point de flux (le geste juste reste à faire)
        if (it.meta.Rythme !== undefined && target && heros(target) && target.isAlive() && target._mvtVoie) {
            target._mvtFlux = Math.min(GESTE - 1, (target._mvtFlux || 0) + 1);
            afficher(target);
            annonce(target, '◆ Rythme · flux ' + target._mvtFlux, COULEURS[target._mvtVoie]);
        }
        if (it.meta.Lecture !== undefined && target && target.isEnemy() && target.result().isHit()) {
            target._luPar = u.actorId();
            annonce(target, '◎ Lu', '#9ad0ff');
        }
    };

    /** La prochaine action forcée de ce héros avec cette compétence est une riposte du contre-temps
     *  (la contre-attaque du Flow de Vesper, LesStylesDeVesper) : son flux monte, au 3 elle est un geste
     *  juste — et elle ne compte pas comme un geste de plus (ni « même technique », ni autre Voie). */
    LeMouvement.riposteForcee = function (b, skillId) { if (b) { b._riposteForcee = skillId; } };

    var _debut = BattleManager.startAction;
    BattleManager.startAction = function () {
        var b = this._subject, a = b && b.currentAction && b.currentAction();
        if (heros(b) && a && a.item() && a._forcing && b._riposteForcee && a.isSkill() && a.item().id === b._riposteForcee) {
            b._riposteForcee = 0; b._riposteEnCours = true;
            a._mvtMult = LeMouvement.riposte(b);
            _debut.call(this);
            return;
        }
        if (heros(b) && a && a.item()) {
            decider(b, a);
            if (a.isSkill() && FOCALISE.indexOf(a.item().id) >= 0) { concentrer(b, a); }
        }
        _debut.call(this);
    };

    // La posture se pose quand le geste est fini (l'icône apparaît à ce moment-là).
    var _fin = BattleManager.endAction;
    BattleManager.endAction = function () {
        var b = this._subject;
        if (heros(b) && b._mvtVoie && b.isAlive()) { afficher(b); }
        // « après la riposte », « immobile » : jusqu'à l'action suivante — une riposte forcée n'en est pas une
        if (heros(b)) { if (b._riposteEnCours) { b._riposteEnCours = false; } else { b._riposte = false; b._touche = false; } }
        _fin.call(this);
    };

    var _valeur = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _valeur.call(this, target, critical);
        if (this._mvtMult && this._mvtMult !== 1 && v !== 0) { v = Math.round(v * this._mvtMult); }
        if (this._tete === 'concentree' && v !== 0) { v = Math.round(v * BONUS_CONC); }
        var it = this.item(), u = this.subject();
        if (v > 0 && target && target._lache && heros(target) && enCombat()) {
            v = Math.round(v * LACHE);                       // la garde lâchée : elle encaisse plus fort
        }
        if (v !== 0 && it && it.meta && it.meta.ApresRiposte !== undefined && u && u._riposte) {
            v = Math.round(v * APRES);
            if (!this._apresVu) { this._apresVu = true; annonce(u, '⚔ Après la riposte ×' + chiffre(APRES), '#ffb070'); }
        }
        return v;
    };

    //=========================================================================
    // Le geste faux : un gros coup, un état qui immobilise
    //=========================================================================
    var _degats = Game_Battler.prototype.onDamage;
    Game_Battler.prototype.onDamage = function (value) {
        _degats.call(this, value);
        if (heros(this) && enCombat() && value > 0) { this._touche = true; }      // <Immobile> : touché depuis sa dernière action
        if (heros(this) && this._mvtVoie && enCombat() && value >= (this.mhp || 1) * SEUIL) {
            var avait = this._mvtFlux > 0;
            lacher(this, '✗ Geste faux : flux brisé');
            if (!avait) { annonce(this, '✗ Posture perdue', '#ff8080'); }
        }
    };
    var _etat = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        _etat.call(this, stateId);
        var st = $dataStates[stateId];
        if (heros(this) && this._mvtVoie && enCombat() && st && st.restriction >= 4 && this.isStateAffected(stateId)) {
            lacher(this, '✗ Flux brisé');
        }
    };

    //=========================================================================
    // En premier : dans le flux, le mouvement part avant tout le monde
    //=========================================================================
    function dansLeFlux(b) {
        if (!heros(b)) { return false; }
        var a = b.currentAction && b.currentAction();
        if (a && balise(a.item(), 'Premier') && voieDuMouvement(a)) { return true; }   // <Premier> : toujours
        if (PREMIER <= 0 || !(b._mvtFlux >= PREMIER)) { return false; }
        return !!voieDuMouvement(a);
    }
    var _ordres = BattleManager.makeActionOrders;
    BattleManager.makeActionOrders = function () {
        _ordres.call(this);
        var avant = [], reste = [];
        (this._actionBattlers || []).forEach(function (b) { (dansLeFlux(b) ? avant : reste).push(b); });
        this._actionBattlers = avant.concat(reste);
    };

    //=========================================================================
    // Un combat neuf, un corps au repos
    //=========================================================================
    // Sur Game_Actor : LeFroidConfie y pose déjà son début de combat (qui ne passerait pas par Game_Battler).
    var _debutCombat = Game_Actor.prototype.onBattleStart;
    Game_Actor.prototype.onBattleStart = function () {
        _debutCombat.call(this);
        remettre(this);
    };
    var _finCombat = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function () {
        _finCombat.call(this);
        remettre(this);
    };

    LeMouvement.voie = voieDuMouvement;
    LeMouvement.postures = POSTURES;
    LeMouvement.flux = function (b) { return b ? (b._mvtFlux || 0) : 0; };
    LeMouvement.posture = function (b) { return b ? (b._mvtVoie || '') : ''; };
})();
