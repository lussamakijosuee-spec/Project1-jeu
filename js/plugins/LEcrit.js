//=============================================================================
// LEcrit.js — v2.2
// L'Écrit, l'art de l'Âme (mana spirituel) : le stylo d'âme trace un cercle,
// on y inscrit des runes, on le ferme.
//=============================================================================
/*:
 * @plugindesc v2.2 ■ L'Écrit (mana spirituel) : le stylo d'âme trace un cercle —
 * dans l'air sur une cible, ou au sol. On y inscrit des RUNES (3 au plus), on le
 * FERME : elles partent ensemble ; deux du même signe s'accordent.
 * @author pour JOKO
 *
 * @param === L'ÉCRIT ===
 * @default
 *
 * @param etatEcrit
 * @text État du cercle dans l'air
 * @type state
 * @default 257
 * @desc Sur la cible ; son chiffre : combien de runes attendent dans ce cercle.
 *
 * @param etatSol
 * @text État du cercle au sol
 * @type state
 * @default 260
 * @desc Sur tout le côté où il est tracé ; son chiffre : combien de runes y attendent.
 *
 * @param ecritsMax
 * @text Runes en attente au plus, par héros
 * @type number
 * @min 1
 * @default 3
 * @desc Dans l'air et au sol ensemble. Au-delà, ses runes sont grisées : il faut d'abord fermer le cercle.
 *
 * @param bonusEcrit
 * @text Une rune qui part : dégâts et soins ×
 * @default 1.25
 * @desc Ce qu'on a préparé frappe plus fort que ce qu'on lance.
 *
 * @param bonusAccord
 * @text L'accord : deux runes du même signe qui partent ensemble ×
 * @default 1.25
 * @desc Chacune, en plus de la résonance. Le signe est la balise <Rune: frappe | prise | sceau | lien | rempart>.
 *
 * @param transmutation
 * @text Transmutation entière : la vie payée revient (%)
 * @type number
 * @default 100
 * @desc Trois runes du même signe qui partent ensemble : l'échange est complet, le prix revient. 0 = rien.
 *
 * @param solAuChoix
 * @text Une rune de zone : Garder ou Piège, au choix
 * @type boolean
 * @default true
 * @desc JOKO, 2026-10-27 : « Deux runes au choix ». En la lançant, on choisit : Garder (elle attend Activer) ou Piège (elle part quand l'ennemi agit).
 *
 * @param solParDefaut
 * @text Sans choix (combat auto, IA) : garder ou piege
 * @default piege
 *
 * @param nomGarder
 * @text Le choix « Garder »
 * @default ᛟ Garder — c'est toi qui l'actives
 *
 * @param nomPiege
 * @text Le choix « Piège »
 * @default ✒ Piège — elle part quand l'ennemi agit
 *
 * @param nomEffacer
 * @text L'ordre « Effacer »
 * @default ᛟ Effacer…
 * @desc JOKO, 2026-11-13 : « la possibilité d'annuler ». Sous « ᛟ Activer » : on choisit une rune en attente, elle disparaît. Vide = pas d'ordre.
 *
 * @param rembourseEfface
 * @text Effacer une rune : la vie payée revient (%)
 * @type number
 * @default 50
 * @desc Effacer ne coûte pas le tour. 0 = rien ne revient, 100 = tout.
 *
 * @param aideGarder
 * @text Garder : la ligne d'aide
 * @default Elle attend au sol. Elle part, plus forte, quand tu fermes le cercle (ᛟ Activer).
 *
 * @param aidePiege
 * @text Piège : la ligne d'aide
 * @default Elle part toute seule dès qu'un ennemi agit. Rien à activer.
 *
 * @param dejaEcrits
 * @text Types déjà écrits (partent tout de suite)
 * @default 8, 9, 26
 * @desc Les dons : 8 invocation, 9 âme, 26 copies — les runes du collier de ludwing sont déjà tracées.
 *
 * @param competenceActiver
 * @text La compétence « Activer »
 * @type skill
 * @default 1309
 *
 * @param acteursExclus
 * @text Ceux qui n'écrivent pas
 * @default 6
 * @desc seiryu (6).
 *
 * @param resonance
 * @text Résonance : + par autre écrit qui part avec lui
 * @default 0.15
 * @desc Trois écrits activés ensemble : chacun ×1,3 en plus. Préparer plus, c'est frapper plus fort.
 *
 * @param === LUDWING : LE PIÈGE ET LA CHANCE ===
 * @default
 *
 * @param acteursPiege
 * @text Ceux dont les écrits sont des pièges
 * @default 3
 * @desc ludwing (3) — « maître du rage-bait », le stratège qui pense de l'arrière : ses écrits sur un ennemi partent tout seuls quand cet ennemi le frappe.
 *
 * @param acteursChance
 * @text Ceux qui ont de la chance
 * @default 3
 * @desc ludwing (3) — « le plus CHANCEUX du groupe, littéralement ».
 *
 * @param chanceGarde
 * @text Chance qu'un écrit parti reste écrit (%)
 * @type number
 * @default 25
 *
 * @param rempart
 * @text <Rempart> : le prochain coup reçu par l'allié ×
 * @default 0.5
 *
 * @param === LA VOLONTÉ ===
 * @default
 *
 * @param parPVManquant
 * @text Volonté : + par PV manquant (1 = +100 % à 0 PV)
 * @default 0.5
 *
 * @param parAllieTombe
 * @text Volonté : + par allié tombé
 * @default 0.25
 *
 * @param volonteMax
 * @text Volonté au plus ×
 * @default 1.75
 *
 * @help
 * ============================================================================
 *  L'ÉCRIT — l'âme qui prépare                                   pour JOKO
 * ============================================================================
 *  JOKO, le 2026-10-22 : « Spirituelle c'est plus comme les symboles le fait
 *  de écrire ou préparer des écrits le système de Full Metal Alchemist » ;
 *  « B pour l'écrit » (c'est toi qui l'actives) ; « Oui la volonté, l'âme,
 *  la détermination ». La Genèse : « l'écriture des âmes […] créer des
 *  parchemins magiques avec son énergie spirituelle, ou ses PV ».
 *
 *  JOKO, le 2026-10-26 (le chantier des compétences) : le mana spirituel, ce
 *  sont des runes écrites, « avec une technique simple le stylo d'âme qui
 *  permet de […] désigner un cercle dans l'air ou le sol », Fullmetal
 *  Alchemist et The Owl House ensemble ; il a choisi « Cercle, runes, fermer
 *  le cercle » : tracer, inscrire (3 au plus), fermer, l'accord, l'échange
 *  équivalent.
 *
 *  EST UNE RUNE : une compétence de héros dont l'art est l'écrit
 *  (LesTroisArts). Échange équivalent : elle se paie en PV, tout de suite.
 *  Son SIGNE (<Rune: …>) dit ce qu'elle fait : Frappe, Prise (elle prend),
 *  Sceau, Lien, Rempart.
 *
 *  LE STYLO D'ÂME TRACE UN CERCLE — la rune ne part pas, elle s'inscrit :
 *   · DANS L'AIR, sur sa cible (ennemi, allié, soi) quand elle en vise une :
 *     le cercle la suit ; une cible tombée l'emporte. Il attend qu'on le ferme.
 *   · AU SOL quand elle en vise plusieurs (tous, au hasard) : une zone sur ce
 *     côté. Elle part TOUTE SEULE quand l'ennemi y agit — côté ennemi, après
 *     l'action d'un ennemi ; côté héros, après une action ennemie qui vise un
 *     héros — ou quand on ferme le cercle.
 *     DEUX RUNES AU CHOIX (JOKO, 2026-10-27 : « tu mets un truc, et c'est toi
 *     qui l'actives au bon moment […] supra méta », puis « Deux runes au
 *     choix ») — en lançant une rune de zone, on choisit : ᛟ GARDER, elle
 *     attend au sol qu'on ferme le cercle, comme l'Écrit d'avant ; ou
 *     ✒ PIÈGE, elle part toute seule quand l'ennemi agit. Sans choix (combat
 *     automatique), c'est le réglage « solParDefaut ».
 *  3 runes en attente au plus par héros, dans l'air et au sol ensemble.
 *
 *  FERMER LE CERCLE — la compétence « ᛟ Activer » (instantanée : on joue
 *  encore son tour) fait partir TOUTES ses runes d'un coup, dans l'ordre où
 *  elles ont été inscrites, ×1,25. Un soin inscrit sur un allié attend le bon
 *  moment ; une réanimation inscrite attend qu'il tombe.
 *
 *  L'ACCORD — deux runes du même signe qui partent ensemble s'accordent :
 *  chacune ×1,25. Trois du même signe : TRANSMUTATION ENTIÈRE, l'échange est
 *  complet — la vie payée pour les trois revient.
 *
 *  DÉJÀ ÉCRITS — les dons (invocations, âme, copies) partent tout de suite :
 *  les runes du collier de ludwing sont déjà tracées. Une fiche qui porte
 *  <DejaEcrit> aussi (Aspiration des Âmes Damnées, son collier). La Parole lue
 *  d'Aël aussi (son livre). Les attaques à plusieurs (<Combo>, unisson) aussi.
 *
 *  LA VOLONTÉ — tout ce qui est de l'âme frappe et soigne plus fort quand ça
 *  va mal : +50 % à 0 PV (au prorata), +25 % par allié tombé, ×1,75 au plus.
 *  Écrire coûte des PV : payer rapproche de sa volonté.
 *
 *  LA RÉSONANCE — des écrits qui partent ensemble se répondent : chacun
 *  +15 % par autre écrit parti avec lui (trois ensemble : ×1,3 chacun).
 *
 *  LUDWING, LE PIÈGE ET LA CHANCE (JOKO, « rendre les vraiment intéressant
 *  et original » ; son profil : « maître du rage-bait », « le plus CHANCEUX du
 *  groupe, littéralement ») — ses écrits sur un ennemi partent TOUT SEULS
 *  quand cet ennemi le frappe (ᛟ Piège !) : il écrit, il provoque (Vannes),
 *  il attend. Et chaque écrit qui part a 1 chance sur 4 de rester écrit (🍀).
 *
 *  LES VERBES DE L'ÉCRIT (2026-10-22, « Oui rework tout ») — une balise, une
 *  ligne de description ; chacun vient du nom que JOKO a donné à la capacité :
 *   <Cercle>   — tant que cet écrit attend sur une cible, ses autres écrits sur
 *                elle ne coûtent pas de PV (« À partir d'ici, c'est chez toi ») ;
 *   <Referme>  — quand il part, tous ses autres écrits partent avec lui
 *                (« Rien n'échappe ») ;
 *   <Sceau: n> — quand il part, n % de chances que l'ennemi perde sa prochaine
 *                action (pas un boss : rang S, <Phases>, <Meca…>) ;
 *   <Pret>     — écrit sur un allié : jusqu'à la fin du tour suivant, qui frappe
 *                cet allié referme les pièges de ludwing comme s'il le frappait ;
 *   <Symbole>  — compte pour deux dans la résonance ;
 *   <Appat>    — (n'importe quel art) les ennemis touchés frappent celui qui les
 *                a provoqués, jusqu'à la fin du tour suivant (Vannes) ;
 *   <Rempart>  — écrit sur un allié : quand il part, le prochain coup que cet
 *                allié reçoit est divisé par deux (« un mur qu'on ne voit pas,
 *                et qui tient ») — on l'active juste avant le gros coup.
 *
 *  Les ennemis n'écrivent pas. Tous les chiffres sont des réglages.
 * ============================================================================
 */

var LEcrit = LEcrit || {};

(function () {
    'use strict';

    var P = PluginManager.parameters('LEcrit');
    var nombre = function (k, d) { var v = parseFloat(P[k]); return isNaN(v) ? d : v; };
    var liste = function (k, d) {
        return String(P[k] === undefined ? d : P[k]).split(',')
            .map(function (x) { return parseInt(x, 10); }).filter(function (x) { return !isNaN(x); });
    };
    var ETAT    = nombre('etatEcrit', 257);
    var MAX     = nombre('ecritsMax', 3);
    var BONUS   = nombre('bonusEcrit', 1.25);
    var DEJA    = liste('dejaEcrits', '8, 9, 26');
    var ACTIVER = nombre('competenceActiver', 1309);
    var EXCLUS  = liste('acteursExclus', '6');
    var PAR_PV  = nombre('parPVManquant', 0.5);
    var PAR_KO  = nombre('parAllieTombe', 0.25);
    var VOL_MAX = nombre('volonteMax', 1.75);
    var RESO    = nombre('resonance', 0.15);
    var PIEGE   = liste('acteursPiege', '3');
    var CHANCEUX = liste('acteursChance', '3');
    var CHANCE  = nombre('chanceGarde', 25) / 100;
    var REMPART = nombre('rempart', 0.5);
    var ETAT_SOL = nombre('etatSol', 260);
    var ACCORD  = nombre('bonusAccord', 1.25);
    var TRANSMUTATION = nombre('transmutation', 100) / 100;
    var AU_CHOIX = String(P.solAuChoix || 'true') !== 'false';
    var PAR_DEFAUT = String(P.solParDefaut || 'piege').trim().toLowerCase() === 'garder' ? 'garder' : 'piege';
    var NOM_GARDER = String(P.nomGarder || "ᛟ Garder — c'est toi qui l'actives");
    var NOM_PIEGE = String(P.nomPiege || "✒ Piège — elle part quand l'ennemi agit");
    var NOM_EFFACER = String(P.nomEffacer === undefined ? 'ᛟ Effacer…' : P.nomEffacer).trim();
    var REMBOURSE = nombre('rembourseEfface', 50) / 100;
    var AIDE_GARDER = String(P.aideGarder || 'Elle attend au sol. Elle part, plus forte, quand tu fermes le cercle (ᛟ Activer).');
    var AIDE_PIEGE = String(P.aidePiege || 'Elle part toute seule dès qu\'un ennemi agit. Rien à activer.');
    var dernierMode = null;                  // le dernier choix Garder / Piège : le curseur y revient
    var SIGNES = { frappe: 'Frappe', prise: 'Prise', sceau: 'Sceau', lien: 'Lien', rempart: 'Rempart' };

    function enCombat() { return !!($gameParty && $gameParty.inBattle()); }
    function heros(b) { return !!(b && b.isActor && b.isActor() && EXCLUS.indexOf(b.actorId()) < 0); }
    function annonce(b, texte, couleur) {
        if (window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, texte, couleur); }
    }
    function chiffre(x) { return String(Math.round(x * 100) / 100).replace('.', ','); }

    /** Une technique de l'âme, lancée par un héros. */
    function estEcrit(action) {
        var it = action && action.item();
        if (!it || !DataManager.isSkill(it) || !heros(action.subject())) { return false; }
        return !!(window.LesTroisArts && LesTroisArts.art(it) === 'ecrit');
    }
    function aPlusieurs(it) {
        return !!(it.meta && (it.meta.Combo !== undefined || it.meta['unison item actors'] !== undefined));
    }
    /** Cette action s'écrit au lieu de partir. */
    function doitEcrire(action) {
        if (!enCombat() || action._ecritActive || !estEcrit(action)) { return false; }
        var it = action.item(), b = action.subject();
        if (DEJA.indexOf(it.stypeId) >= 0 || aPlusieurs(it) || (it.meta && it.meta.DejaEcrit !== undefined)) { return false; }
        return !(b.paroleLue && b.paroleLue(it));
    }

    /** Le signe d'une rune : ce qu'elle fait (<Rune: …> sur la fiche). */
    function signe(sk) {
        if (!sk) { return ''; }
        if (sk.meta && typeof sk.meta.Rune === 'string') {           // <Rune> sans valeur (824-826) : pas un signe
            var s = String(sk.meta.Rune).trim().toLowerCase();
            return SIGNES[s] ? s : '';
        }
        // sans balise : ce qu'elle fait (la même règle que celle qui a écrit les balises)
        if (balise(sk, 'Sceau')) { return 'sceau'; }
        if (balise(sk, 'Rempart')) { return 'rempart'; }
        if (balise(sk, 'Appat') || balise(sk, 'Pret')) { return 'lien'; }
        var t = sk.damage ? sk.damage.type : 0;
        return t === 5 || t === 6 ? 'prise' : (t === 1 || t === 2 ? 'frappe' : (t === 3 || t === 4 ? 'rempart' : ''));
    }
    /** Le nom court, pour les annonces et l'aide : « Rune de Sceau : Faire Douter » → « Faire Douter ». */
    function nomCourt(sk) { var n = (sk && sk.name) || '?', i = n.indexOf(' : '); return i >= 0 ? n.slice(i + 3) : n; }

    //=========================================================================
    // Les runes : gardées par qui les a inscrites. Dans l'air, montrées sur la
    // cible ; au sol (cible: null, sol: 'ennemis' | 'allies'), sur tout ce côté.
    //=========================================================================
    function ecritsDe(b) { return (b && b._ecrits) || []; }
    function surCible(c) {
        var n = 0;
        $gameParty.members().forEach(function (a) { ecritsDe(a).forEach(function (m) { if (m.cible === c) { n++; } }); });
        return n;
    }
    function compteur(c, etat, n) {
        if (n > 0) {
            if (!c.isStateAffected(etat)) { c.addNewState(etat); }
            c.resetStateCounts(etat);
            if (c.setStateCounter) { c.setStateCounter(etat, n); }
        } else if (c.isStateAffected(etat)) {
            c.eraseState(etat);
            if (c.removeStateCounter) { c.removeStateCounter(etat); }
            c.refresh();
        }
    }
    function montrer(c) { if (c) { compteur(c, ETAT, surCible(c)); } }
    function auSol(cote) {
        var n = 0;
        $gameParty.members().forEach(function (a) { ecritsDe(a).forEach(function (m) { if (m.sol === cote) { n++; } }); });
        return n;
    }
    function montrerSol(cote) {
        if (!$dataStates[ETAT_SOL] || !$dataStates[ETAT_SOL].name) { return; }     // l'état n'existe pas encore : rien à montrer
        var n = auSol(cote), cotes = cote === 'ennemis' ? $gameTroop.members() : $gameParty.battleMembers();
        cotes.forEach(function (c) { compteur(c, ETAT_SOL, c.isAlive() ? n : 0); });
    }
    /** Une rune qui vise plusieurs cibles (tous, au hasard) se trace au sol. */
    function zone(action) { return !action.isForOne(); }

    function ecrire(action, cible) {
        var b = action.subject(), sk = action.item(), g = signe(sk);
        b._ecrits = ecritsDe(b).slice();
        b._ecrits.push({ cible: cible, competence: sk.id, pv: b._pvPaye || 0 });
        neutre(cible);
        montrer(cible);
        annonce(cible, 'ᛟ ' + (g ? SIGNES[g] : 'Rune') + ' · ' + nomCourt(sk), '#e080ff');
    }
    function tracerSol(action) {
        var b = action.subject(), sk = action.item(), g = signe(sk), cote = action.isForOpponent() ? 'ennemis' : 'allies';
        b._ecrits = ecritsDe(b).slice();
        var garde = (action._modeRune || PAR_DEFAUT) === 'garder';
        b._ecrits.push({ cible: null, sol: cote, competence: sk.id, pv: b._pvPaye || 0, garde: garde });
        montrerSol(cote);
        annonce(b, (garde ? 'ᛟ Gardée au sol · ' : '✒ Piège au sol · ') + (g ? SIGNES[g] : 'Rune'), '#e080ff');
    }
    function neutre(c) {
        c.clearResult();
        c.result().used = true;              // touché, sans rien : pas de « raté » à l'écran
    }

    var _appliquer = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        if (target && doitEcrire(this)) {
            if (!zone(this)) { ecrire(this, target); return; }
            // au sol : une seule rune pour toute la zone, tracée au premier de ses coups
            if (!this._traceSol) { this._traceSol = true; tracerSol(this); }
            neutre(target);
            return;
        }
        _appliquer.call(this, target);
        var it = this.item(), u = this.subject();
        if (enCombat() && it && it.id === ACTIVER && target === u) { activer(u); }
        if (enCombat() && balise(it, 'Appat') && heros(u) && target && target.isEnemy() && target.isAlive() && target.result().isHit()) {
            target._appat = { acteur: u.actorId(), jusque: tour() + 1 };
            annonce(target, '◉ Appâté', '#e080ff');
        }
    };
    // Les événements communs d'un écrit attendent son activation.
    var _global = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function () {
        if (doitEcrire(this)) { return; }
        _global.call(this);
    };

    //=========================================================================
    // Activer : tous ses écrits partent, dans l'ordre
    //=========================================================================
    /** Ceux qu'une rune touchera en partant : sa cible dans l'air ; au sol, toute la zone. */
    function ciblesDe(b, m, a) {
        if (!m.sol) { return m.cible ? [m.cible] : []; }
        var vus = [];
        a.makeTargets().forEach(function (c) { if (c && vus.indexOf(c) < 0) { vus.push(c); } });
        return vus;
    }
    function valide(b, m) {
        if (!$dataSkills[m.competence]) { return false; }
        var a = new Game_Action(b); a.setSkill(m.competence);
        return ciblesDe(b, m, a).some(function (c) { return a.testApply(c); });
    }
    function declencher(b, m, reso, accord) {
        var sk = $dataSkills[m.competence];
        if (!sk) { return false; }
        var a = new Game_Action(b);
        a.setSkill(sk.id);
        a._ecritActive = true;
        a._resonance = (reso || 1) * (accord || 1);
        a._volonte = volonte(b);              // annoncée une fois pour toute l'activation (activer)
        var cibles = ciblesDe(b, m, a).filter(function (c) { return a.testApply(c); });
        if (!cibles.length) { return false; }
        var anim = sk.animationId < 0 ? b.attackAnimationId1() : sk.animationId;
        cibles.forEach(function (c) {
            if (anim > 0) { c.startAnimation(anim, false, 0); }
            c.clearResult();
            a.apply(c);
            var touche = c.result().isHit();
            c.startDamagePopup();
            if (c.isDead()) { c.performCollapse(); }
            apres(b, sk, c, touche, accord > 1);
        });
        a.applyGlobal();
        return true;
    }
    /** Ce que le signe fait en plus, sur chaque cible touchée. */
    function apres(b, sk, c, touche, accorde) {
        // <Sceau: n> : n % de chances qu'il perde sa prochaine action (pas un boss) ; accordé, c'est sûr
        if (balise(sk, 'Sceau') && touche && c.isEnemy() && c.isAlive() && !estBoss(c) &&
            (accorde || Math.random() * 100 < (parseInt(sk.meta.Sceau, 10) || 100))) { sceller(c); }
        // <Rempart> : écrit sur un allié, il tient le prochain coup (÷2)
        if (balise(sk, 'Rempart') && c.isActor() && c.isAlive()) {
            c._rempart = true;
            annonce(c, 'ᛟ Rempart', '#e080ff');
        }
        // <Pret> : l'allié porte un morceau de son ombre — qui le frappe referme ses pièges
        if (balise(sk, 'Pret') && c.isActor() && c.isAlive()) {
            c._ombreDe = { acteur: b.actorId(), jusque: tour() + 1 };
            annonce(c, 'ᛟ Ombre prêtée', '#e080ff');
        }
    }
    function balise(it, nom) { return !!(it && it.meta && it.meta[nom] !== undefined); }
    function tour() { return $gameTroop ? $gameTroop.turnCount() : 0; }
    function estBoss(e) {
        var n = (e.enemy() && e.enemy().note) || '';
        return /<\s*Rang\s*:\s*S\s*>/i.test(n) || /<\s*(Meca\w*|Phases)\s*:/i.test(n);
    }
    function sceller(c) {
        var l = BattleManager._actionBattlers || [], i = l.indexOf(c);
        if (i >= 0) { l.splice(i, 1); c.clearActions(); } else { c._scelle = tour() + 1; }
        annonce(c, 'ᛟ Scellé : il perd son tour', '#e080ff');
    }
    var _ordres = BattleManager.makeActionOrders;
    BattleManager.makeActionOrders = function () {
        _ordres.call(this);
        var t = tour();
        this._actionBattlers = (this._actionBattlers || []).filter(function (b) {
            if (b && b._scelle && b._scelle === t) { b._scelle = 0; b.clearActions(); return false; }
            return true;
        });
    };

    // <Cercle> : tant qu'il attend sur une cible, ses autres écrits sur elle ne coûtent pas de PV.
    function cibleDe(a) {
        if (!a.isForOpponent() || !a.isForOne() || !(a._targetIndex >= 0)) { return null; }
        return $gameTroop.members()[a._targetIndex] || null;
    }
    function dansLeCercle(b, c) {
        return ecritsDe(b).some(function (m) { return m.cible === c && balise($dataSkills[m.competence], 'Cercle'); });
    }
    var _payer = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function (skill) {
        var a = enCombat() && heros(this) && this.currentAction ? this.currentAction() : null;
        var c = a && a.item() === skill && doitEcrire(a) ? cibleDe(a) : null;
        this._cercleGratuit = !!(c && dansLeCercle(this, c));
        if (this._cercleGratuit) { annonce(this, 'ᛟ Dans le cercle : gratuit', '#e080ff'); }
        var avant = this.hp;
        _payer.call(this, skill);
        this._pvPaye = Math.max(0, avant - this.hp);      // l'échange équivalent : ce que la rune a coûté
        this._cercleGratuit = false;
    };
    var _coutPV = Game_BattlerBase.prototype.skillHpCost;
    if (_coutPV) {
        Game_BattlerBase.prototype.skillHpCost = function (skill) { return this._cercleGratuit ? 0 : _coutPV.call(this, skill); };
    }

    // <Appat> (Vannes) : les ennemis touchés frappent celui qui les a provoqués, jusqu'à la fin du tour suivant.
    var _cibles = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function () {
        var s = this.subject(), ap = s && s._appat;
        if (enCombat() && ap && s.isEnemy() && tour() <= ap.jusque && this.isForOpponent() && this.isForOne()) {
            var h = $gameActors.actor(ap.acteur);
            if (h && h.isAlive() && $gameParty.battleMembers().indexOf(h) >= 0) { return [h]; }
        }
        return _cibles.call(this);
    };
    /** Fait partir ces runes de b, ensemble : la résonance, l'accord ; la chance de ludwing en garde. */
    function partir(b, liste) {
        var valides = liste.filter(function (m) { return valide(b, m); });
        // <Symbole> compte double dans la résonance
        var n = valides.reduce(function (t, m) { return t + (balise($dataSkills[m.competence], 'Symbole') ? 2 : 1); }, 0);
        // l'accord : combien de runes de chaque signe partent ensemble
        var parSigne = {};
        valides.forEach(function (m) { var g = signe($dataSkills[m.competence]); if (g) { parSigne[g] = (parSigne[g] || 0) + 1; } });
        var reso = 1 + RESO * Math.max(0, n - 1), partis = 0, restent = [], referme = false, rendu = 0;
        liste.forEach(function (m) {
            var g = signe($dataSkills[m.competence]), accord = g && parSigne[g] >= 2 ? ACCORD : 1;
            if (declencher(b, m, reso, accord)) {
                partis++;
                if (g && parSigne[g] >= 3) { rendu += m.pv || 0; }
                if (balise($dataSkills[m.competence], 'Referme')) { referme = true; }
                if (CHANCEUX.indexOf(b.actorId()) >= 0 && (m.sol || m.cible.isAlive()) && Math.random() < CHANCE) { restent.push(m); }
            }
        });
        Object.keys(parSigne).forEach(function (g) {
            if (parSigne[g] >= 3) { annonce(b, 'ᛟ Transmutation entière · ' + SIGNES[g], '#ffd0f0'); }
            else if (parSigne[g] === 2) { annonce(b, 'ᛟ Accord · ' + SIGNES[g] + ' ×' + chiffre(ACCORD), '#ff9ad8'); }
        });
        // la transmutation entière : l'échange est complet, la vie payée revient
        rendu = Math.round(rendu * TRANSMUTATION);
        if (rendu > 0 && b.isAlive()) { b.clearResult(); b.gainHp(rendu); b.startDamagePopup(); }
        // <Referme> : quand il part, tous ses autres écrits partent avec lui
        if (referme && !b._refermant && ecritsDe(b).length) {
            b._refermant = true;
            var reste = ecritsDe(b).slice(); b._ecrits = [];
            annonce(b, 'ᛟ Tout se referme', '#e080ff');
            partis += partir(b, reste);
            b._refermant = false;
        }
        restent.forEach(function (m) { b._ecrits.push(m); annonce(m.cible || b, '🍀 Toujours écrit', '#a0ffa0'); });
        liste.forEach(function (m) { if (m.sol) { montrerSol(m.sol); } else { montrer(m.cible); } });
        if (partis > 1) { annonce(b, 'ᛟ Résonance ×' + chiffre(reso), '#ff9ad8'); }
        return partis;
    }
    function activer(b) {
        var tous = ecritsDe(b).slice();
        b._ecrits = [];
        var partis = partir(b, tous);
        if (partis) {
            var v = volonte(b);
            annonce(b, 'ᛟ Le cercle se ferme ×' + partis, '#ff9ad8');
            if (v >= 1.05) { annonce(b, 'ᛟ Volonté ×' + chiffre(v), '#ff9ad8'); }
            if ($gameScreen) { $gameScreen.startFlash([255, 150, 230, 110], 18); }
        }
    }

    // ludwing : l'ennemi qui le frappe referme le piège qu'il a écrit sur lui.
    var _debutAction = BattleManager.startAction;
    BattleManager.startAction = function () {
        _debutAction.call(this);
        var s = this._subject;
        if (s && s.isEnemy && s.isEnemy() && enCombat()) {
            var vises = this._allTargets || this._targets || [];
            var t = tour();
            s._piegeVise = $gameParty.battleMembers().filter(function (a) {
                if (PIEGE.indexOf(a.actorId()) < 0) { return false; }
                if (vises.indexOf(a) >= 0) { return true; }
                // <Pret> : frapper l'allié qui porte son ombre, c'est le frapper lui
                return vises.some(function (v) { return v && v._ombreDe && v._ombreDe.acteur === a.actorId() && t <= v._ombreDe.jusque; });
            });
            s._agit = { heros: vises.some(function (v) { return v && v.isActor && v.isActor(); }) };
        }
    };
    /** Le cercle au sol part quand l'ennemi y agit : côté ennemi, après toute action ennemie ;
     *  côté héros, après une action ennemie qui vise un héros. */
    function solRepond(s) {
        var agit = s._agit; s._agit = null;
        if (!agit) { return; }
        $gameParty.battleMembers().forEach(function (a) {
            if (!a.isAlive()) { return; }
            // une rune gardée attend qu'on ferme le cercle : seul le piège répond
            var siens = ecritsDe(a).filter(function (m) { return !m.garde && (m.sol === 'ennemis' || (m.sol === 'allies' && agit.heros)); });
            if (!siens.length) { return; }
            a._ecrits = ecritsDe(a).filter(function (m) { return siens.indexOf(m) < 0; });
            annonce(s.isAlive() ? s : a, '✒ Le sol répond', '#e080ff');
            partir(a, siens);
        });
    }
    var _finAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        var s = this._subject;
        if (s && s.isEnemy && s.isEnemy() && enCombat()) { solRepond(s); }
        if (s && s._piegeVise && s._piegeVise.length) {
            var porteurs = s._piegeVise;
            s._piegeVise = null;
            porteurs.forEach(function (a) {
                if (!a.isAlive() || !s.isAlive()) { return; }
                var siens = ecritsDe(a).filter(function (m) { return m.cible === s; });
                if (!siens.length) { return; }
                a._ecrits = ecritsDe(a).filter(function (m) { return m.cible !== s; });
                annonce(s, 'ᛟ Piège !', '#e080ff');
                partir(a, siens);
            });
        }
        _finAction.call(this);
    };

    // Activer n'existe qu'avec des écrits ; au-delà de 3 en attente, on n'écrit plus.
    var _conditions = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
        if (!_conditions.call(this, skill)) { return false; }
        if (!enCombat() || !heros(this)) { return true; }
        if (skill.id === ACTIVER) { return ecritsDe(this).length > 0; }
        if (ecritsDe(this).length >= MAX) {
            var a = new Game_Action(this); a.setSkill(skill.id);
            if (doitEcrire(a)) { return false; }
        }
        return true;
    };

    // L'aide dit ce qui attend : sur Activer, ce qui va partir et sur qui ; sur un écrit grisé, pourquoi.
    // La première ligne de la description reste ; la seconde est remplacée, le temps du combat.
    var _aide = Window_SkillList.prototype.updateHelp;
    Window_SkillList.prototype.updateHelp = function () {
        _aide.call(this);
        var s = this.item(), a = this._actor, h = this._helpWindow;
        if (!s || !h || !enCombat() || !heros(a)) { return; }
        var liste = ecritsDe(a), ligne = '';
        if (s.id === ACTIVER && liste.length) {
            // les mêmes écrits se comptent (« Trait Spectral ×2 ») ; on dit sur qui tant que la ligne tient
            var groupes = [];
            liste.forEach(function (m) {
                var nom = nomCourt($dataSkills[m.competence]), qui = m.sol ? (m.garde ? 'au sol' : 'piège') : (m.cible && m.cible.name ? m.cible.name() : '?');
                var g = groupes.filter(function (x) { return x.nom === nom; })[0];
                if (!g) { g = { nom: nom, n: 0, qui: [] }; groupes.push(g); }
                g.n++; if (g.qui.indexOf(qui) < 0) { g.qui.push(qui); }
            });
            var noms = groupes.map(function (g) { return g.nom + (g.n > 1 ? ' ×' + g.n : ''); });
            var avecCibles = groupes.map(function (g, i) { return noms[i] + ' → ' + g.qui.join(', '); });
            // sans les cibles, une rune au sol le dit encore
            var courts = groupes.map(function (g, i) { return noms[i] + (g.qui.length === 1 && g.qui[0] === 'au sol' ? ' (sol)' : (g.qui.length === 1 && g.qui[0] === 'piège' ? ' (piège)' : '')); });
            var auSolCourt = groupes.map(function (g, i) { return noms[i] + (g.qui.length === 1 && (g.qui[0] === 'au sol' || g.qui[0] === 'piège') ? ' (sol)' : ''); });
            // « ᛟ Cercle : » quand la ligne longue ne tient pas : mieux vaut dire où est la rune que garder trois mots
            var essais = ['ᛟ Dans le cercle : ' + avecCibles.join(' · '), 'ᛟ Cercle : ' + avecCibles.join(' · '), 'ᛟ Dans le cercle : ' + courts.join(' · '), 'ᛟ Cercle : ' + courts.join(' · '), 'ᛟ Dans le cercle : ' + auSolCourt.join(' · '), 'ᛟ Cercle : ' + auSolCourt.join(' · '), 'ᛟ Dans le cercle : ' + noms.join(' · ')];
            ligne = essais.filter(function (t) { return h.textWidth(t) <= h.contentsWidth() - 8; })[0] || '';
            if (!ligne) {
                ligne = 'ᛟ ' + liste.length + ' dans le cercle : ';
                for (var i = 0; i < noms.length; i++) {
                    var t = ligne + (i ? ', ' : '') + noms[i];
                    if (h.textWidth(t + '…') > h.contentsWidth() - 8) { ligne += '…'; break; }
                    ligne = t;
                }
            }
        } else if (liste.length >= MAX && !this.isEnabled(s)) {
            var act = new Game_Action(a); act.setSkill(s.id);
            if (doitEcrire(act)) { ligne = 'ᛟ ' + liste.length + ' runes attendent déjà : ferme le cercle d\'abord.'; }
        }
        if (ligne) { h.setText(String(h._text || '').split('\n')[0] + '\n' + ligne); }
    };

    // Dès qu'un héros a des écrits en attente, « ᛟ Activer · n » se met juste sous l'Attaque : on touche le
    // cercle sans aller le chercher dans les capacités (il y reste aussi). Même chemin qu'une capacité choisie.
    var _cmdAttaque = Window_ActorCommand.prototype.addAttackCommand;
    Window_ActorCommand.prototype.addAttackCommand = function () {
        _cmdAttaque.call(this);
        var a = this._actor, sk = $dataSkills[ACTIVER];
        if (sk && enCombat() && heros(a) && ecritsDe(a).length && a.isLearnedSkill(ACTIVER)) {
            this.addCommand(sk.name + ' · ' + ecritsDe(a).length, 'ecritActiver', a.canUse(sk));
        }
        if (NOM_EFFACER && enCombat() && heros(a) && ecritsDe(a).length) { this.addCommand(NOM_EFFACER, 'ecritEffacer', true); }
    };
    var _fenetreOrdres = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function () {
        _fenetreOrdres.call(this);
        this._actorCommandWindow.setHandler('ecritActiver', this.commandeActiver.bind(this));
        this._actorCommandWindow.setHandler('ecritEffacer', this.commandeEffacer.bind(this));
    };
    Scene_Battle.prototype.commandeActiver = function () {
        var a = BattleManager.actor(), act = BattleManager.inputtingAction();
        if (!a || !act) { this._actorCommandWindow.activate(); return; }
        act.setSkill(ACTIVER);
        a.setLastBattleSkill($dataSkills[ACTIVER]);
        // d'une seule touche : Activer vise toujours qui l'a écrit, pas de cible à confirmer
        // (YEP, « Select Help Window », ferait choisir le héros lui-même)
        this.selectNextCommand();
    };

    // Deux runes au choix : une rune de zone demande, en la lançant, si on la garde ou si c'est un piège.
    function Window_ModeRune() { this.initialize.apply(this, arguments); }
    Window_ModeRune.prototype = Object.create(Window_Command.prototype);
    Window_ModeRune.prototype.constructor = Window_ModeRune;
    Window_ModeRune.prototype.windowWidth = function () { return 480; };
    Window_ModeRune.prototype.makeCommandList = function () {
        this.addCommand(NOM_GARDER, 'garder');
        this.addCommand(NOM_PIEGE, 'piege');
    };
    Window_ModeRune.prototype.updateHelp = function () {
        if (this._helpWindow) { this._helpWindow.setText(this.currentSymbol() === 'garder' ? AIDE_GARDER : AIDE_PIEGE); }
    };
    LEcrit.Window_ModeRune = Window_ModeRune;

    // Effacer une rune (JOKO, 2026-11-13 : « la possibilité d'annuler ») : la liste de ses runes en attente.
    function ouEst(m) { return m.sol ? (m.garde ? 'au sol' : 'piège') : (m.cible && m.cible.name ? m.cible.name() : '?'); }
    function rendu(m) { return Math.floor((m.pv || 0) * REMBOURSE); }
    function Window_EffacerRune() { this.initialize.apply(this, arguments); }
    Window_EffacerRune.prototype = Object.create(Window_Command.prototype);
    Window_EffacerRune.prototype.constructor = Window_EffacerRune;
    Window_EffacerRune.prototype.windowWidth = function () { return 560; };
    Window_EffacerRune.prototype.numVisibleRows = function () { return Math.max(1, Math.min(MAX, this.maxItems())); };
    Window_EffacerRune.prototype.makeCommandList = function () {
        var moi = this;
        ecritsDe(this._acteur).forEach(function (m) {
            var r = rendu(m);
            moi.addCommand(nomCourt($dataSkills[m.competence]) + ' → ' + ouEst(m) + (r > 0 ? '  +' + r + ' ' + TextManager.hpA : ''), 'effacer');
        });
    };
    Window_EffacerRune.prototype.ouvrirPour = function (a) {
        this._acteur = a;
        this.refresh();
        this.height = this.fittingHeight(this.numVisibleRows());
        this.createContents(); this.refresh();
        this.x = (Graphics.boxWidth - this.width) / 2; this.y = (Graphics.boxHeight - this.height) / 2;
        this.select(0); this.show(); this.open(); this.activate();
    };
    Window_EffacerRune.prototype.updateHelp = function () {
        if (this._helpWindow) { this._helpWindow.setText('Efface cette rune : elle ne partira pas' + (REMBOURSE > 0 ? ', une part de la vie payée revient' : '') + '.\nEffacer ne coûte pas ton tour.'); }
    };
    Window_EffacerRune.prototype.standardBackOpacity = function () { return 255; };     // posée sur la liste : fond plein
    Window_ModeRune.prototype.standardBackOpacity = function () { return 255; };
    LEcrit.Window_EffacerRune = Window_EffacerRune;
    /** Retire la rune n° i de ce héros, sans la faire partir. Rend ce qui revient. */
    function effacer(a, i) {
        var l = ecritsDe(a), m = l[i];
        if (!m) { return -1; }
        a._ecrits = l.filter(function (x) { return x !== m; });
        if (m.sol) { montrerSol(m.sol); } else { montrer(m.cible); }
        var r = a.isAlive() ? Math.min(rendu(m), a.mhp - a.hp) : 0;
        if (r > 0) { a.setHp(a.hp + r); }
        annonce(a, 'ᛟ Effacée · ' + nomCourt($dataSkills[m.competence]) + (r > 0 ? ' · +' + r + ' ' + TextManager.hpA : ''), '#b0a0c8');
        return r;
    }
    LEcrit.effacer = effacer;
    Scene_Battle.prototype.commandeEffacer = function () {
        var a = BattleManager.actor(), w = this._fenetreEffacer;
        if (!a || !w || !ecritsDe(a).length) { this._actorCommandWindow.activate(); return; }
        this._actorCommandWindow.deactivate();
        w.ouvrirPour(a);
        this._helpWindow.show(); w.updateHelp();
    };
    Scene_Battle.prototype.effacerRuneOk = function () {
        var a = BattleManager.actor(), w = this._fenetreEffacer;
        effacer(a, w.index());
        this._statusWindow.refresh();
        if (ecritsDe(a).length) { var i = Math.min(w.index(), ecritsDe(a).length - 1); w.ouvrirPour(a); w.select(i); return; }
        this.effacerRuneFin();
    };
    Scene_Battle.prototype.effacerRuneFin = function () {
        var a = BattleManager.actor(), w = this._fenetreEffacer, c = this._actorCommandWindow, i = c.index();
        w.deactivate(); w.hide(); this._helpWindow.hide();
        // la ligne « Activer · n » a changé (ou disparu) : la liste des ordres se refait, le curseur reste où il peut
        c.refresh(); c.select(Math.max(0, Math.min(i, c.maxItems() - 1))); c.activate();
        if (!a) { c.deactivate(); }
    };
    /** Une rune que ce héros tracerait au sol (une zone) : celle qui se choisit. */
    function auChoix(a, s) {
        if (!AU_CHOIX || !s || !heros(a)) { return false; }
        var act = new Game_Action(a); act.setSkill(s.id);
        return doitEcrire(act) && zone(act);
    }
    LEcrit.auChoix = auChoix;
    var _fenetres = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function () {
        _fenetres.call(this);
        var w = this._fenetreRune = new Window_ModeRune(0, 0);
        w.x = (Graphics.boxWidth - w.width) / 2;
        w.y = (Graphics.boxHeight - w.height) / 2;
        w.setHandler('garder', this.choisirRune.bind(this, 'garder'));
        w.setHandler('piege', this.choisirRune.bind(this, 'piege'));
        w.setHandler('cancel', this.annulerRune.bind(this));
        w.setHelpWindow(this._helpWindow);
        w.deactivate(); w.hide();
        this.addWindow(w);
        var f = this._fenetreEffacer = new Window_EffacerRune(0, 0);
        f.setHandler('effacer', this.effacerRuneOk.bind(this));
        f.setHandler('cancel', this.effacerRuneFin.bind(this));
        f.setHelpWindow(this._helpWindow);
        f.deactivate(); f.hide();
        this.addWindow(f);
    };
    // Tant qu'on choisit Garder / Piège, c'est elle la fenêtre de saisie : sans ça, MV ne voyait plus aucune
    // fenêtre active (la liste vient d'être désactivée) et rouvrait les ordres derrière elle (changeInputWindow) —
    // OK validait les deux à la fois, la rune ne partait jamais (JOKO, 2026-11-13).
    var _saisieRune = Scene_Battle.prototype.isAnyInputWindowActive;
    Scene_Battle.prototype.isAnyInputWindowActive = function () {
        return !!(this._fenetreRune && this._fenetreRune.active) || !!(this._fenetreEffacer && this._fenetreEffacer.active) || _saisieRune.call(this);
    };
    var _okCapacite = Scene_Battle.prototype.onSkillOk;
    Scene_Battle.prototype.onSkillOk = function () {
        var w = this._fenetreRune, act = BattleManager.inputtingAction();
        if (act) { act._modeRune = null; }
        this._runeChoisie = false;
        if (w && auChoix(BattleManager.actor(), this._skillWindow.item())) {
            this.ouvrirChoixRune();
            return;
        }
        _okCapacite.call(this);
    };
    Scene_Battle.prototype.ouvrirChoixRune = function () {
        var w = this._fenetreRune;
        this._skillWindow.deactivate();
        w.select((dernierMode || PAR_DEFAUT) === 'garder' ? 0 : 1);      // le curseur sur ton dernier choix
        w.show(); w.open(); w.activate();
        if (this._helpWindow) { this._helpWindow.show(); w.updateHelp(); }
    };
    Scene_Battle.prototype.choisirRune = function (mode) {
        var w = this._fenetreRune, act = BattleManager.inputtingAction();
        w.deactivate(); w.hide();
        dernierMode = mode; this._runeChoisie = true;
        if (act) { act._modeRune = mode; }
        // la liste reste inactive, comme après un OK. Activée ici (avant le 2026-11-03), elle répondait encore
        // aux touches, cachée derrière la fenêtre des cibles : un clic droit l'annulait et vidait l'action, et
        // la fenêtre des alliés relisait l'action vide (« Cannot read property 'scope' of null », JOKO)
        _okCapacite.call(this);
        if (act) { act._modeRune = mode; }       // setSkill ne l'efface pas, mais on le repose après le chemin de YEP
    };
    Scene_Battle.prototype.annulerRune = function () {
        this._fenetreRune.deactivate(); this._fenetreRune.hide();
        this._runeChoisie = false;
        this._skillWindow.activate();
        if (this._skillWindow.updateHelp) { this._skillWindow.updateHelp(); }     // l'aide redit la rune, plus le choix
    };
    // Annuler depuis la cible revient au choix Garder / Piège, pas à la liste : un pas en arrière, pas deux.
    function retourAuChoix(scene) {
        if (!scene._runeChoisie || !scene._fenetreRune || !scene._skillWindow.active) { return; }
        var act = BattleManager.inputtingAction();
        if (!auChoix(BattleManager.actor(), scene._skillWindow.item())) { scene._runeChoisie = false; return; }
        if (act) { act._modeRune = null; }
        scene._runeChoisie = false;
        scene.ouvrirChoixRune();
    }
    var _annulerEnnemi = Scene_Battle.prototype.onEnemyCancel;
    Scene_Battle.prototype.onEnemyCancel = function () { _annulerEnnemi.call(this); retourAuChoix(this); };
    var _annulerAllie = Scene_Battle.prototype.onActorCancel;
    Scene_Battle.prototype.onActorCancel = function () { _annulerAllie.call(this); retourAuChoix(this); };
    var _effacer = Game_Action.prototype.clear;
    Game_Action.prototype.clear = function () { _effacer.call(this); this._modeRune = null; };

    // Un ennemi tombé emporte ce qui était écrit sur lui.
    // Sur Game_Enemy : LouCopySystem, DonoBoss, DonoKamui et EvenementsUtiles y posent déjà leur mort.
    var _mourir = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function () {
        var e = this;
        if (enCombat()) {
            $gameParty.members().forEach(function (a) {
                if (a._ecrits) { a._ecrits = a._ecrits.filter(function (m) { return m.cible !== e; }); }
            });
        }
        _mourir.call(this);
    };

    //=========================================================================
    // La volonté
    //=========================================================================
    function volonte(b) {
        if (!b || !b.mhp) { return 1; }
        var tombes = $gameParty.battleMembers().filter(function (a) { return a !== b && a.isDead(); }).length;
        var v = 1 + PAR_PV * (1 - b.hp / b.mhp) + PAR_KO * tombes;
        return Math.min(VOL_MAX, Math.max(1, v));
    }

    var _valeur = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _valeur.call(this, target, critical);
        if (v !== 0 && estEcrit(this)) {
            if (this._volonte === undefined) {
                this._volonte = volonte(this.subject());
                if (this._volonte >= 1.05) { annonce(this.subject(), 'ᛟ Volonté ×' + chiffre(this._volonte), '#ff9ad8'); }
            }
            var k = this._volonte * (this._ecritActive ? BONUS * (this._resonance || 1) : 1);
            if (k !== 1) { v = Math.round(v * k); }
        }
        // Le rempart d'un allié tient le prochain coup qu'on lui porte
        if (v > 0 && target && target._rempart && target.isActor && target.isActor() && enCombat() && !this.isRecover()) {
            target._rempart = false;
            v = Math.round(v * REMPART);
            annonce(target, 'ᛟ Le rempart tient', '#e080ff');
        }
        return v;
    };

    // Rien ne reste d'un combat à l'autre.
    // Sur Game_Actor : LeFroidConfie y pose déjà son début de combat.
    var _debut = Game_Actor.prototype.onBattleStart;
    Game_Actor.prototype.onBattleStart = function () {
        _debut.call(this);
        this._ecrits = [];
        this._pvPaye = 0;
        // Activer s'apprend au niveau 1 : un héros d'une partie commencée avant l'a quand même.
        if (heros(this) && $dataSkills[ACTIVER] && !this.isLearnedSkill(ACTIVER)) { this.learnSkill(ACTIVER); }
    };
    var _fin = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        $gameParty.members().forEach(function (a) { a._ecrits = []; });
        return _fin.call(this, result);
    };

    LEcrit.estEcrit = estEcrit;
    LEcrit.doitEcrire = doitEcrire;
    LEcrit.ecrits = function (b) { return ecritsDe(b).slice(); };
    LEcrit.surCible = surCible;
    LEcrit.activer = activer;
    LEcrit.volonte = volonte;
    LEcrit.ACTIVER = ACTIVER;
})();
