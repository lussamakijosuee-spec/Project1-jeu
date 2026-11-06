//=============================================================================
// LesInstincts.js — v1.0
// L'instinct des ennemis : une mécanique lisible par ennemi, annoncée au-dessus de lui.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Chaque ennemi a un INSTINCT (<Instinct: meute>…) : la meute,
 * l'élan, le vol, le retour, l'apprentissage, la rancœur… annoncé au-dessus de lui.
 * @author pour JOKO
 *
 * @param === LES ÉTATS ===
 * @default
 *
 * @param etatElan
 * @text État : l'élan (charge)
 * @type state
 * @default 261
 *
 * @param etatRancoeur
 * @text État : la rancœur (le chiffre : combien de coups)
 * @type state
 * @default 262
 *
 * @param etatMirage
 * @text État : le mirage (esquive)
 * @type state
 * @default 263
 *
 * @param etatFrenesie
 * @text État : la frénésie (deux actions)
 * @type state
 * @default 264
 *
 * @param etatRepere
 * @text État : repéré (le héros prend plus)
 * @type state
 * @default 265
 *
 * @param etatVenin
 * @text État : le venin
 * @type state
 * @default 17
 *
 * @param === LES CHIFFRES ===
 * @default
 *
 * @param etatBrulure
 * @text État : la brûlure (ce qui s'aggrave)
 * @type state
 * @default 18
 *
 * @param meute
 * @text Meute : + pour chaque membre de la meute tombé
 * @default 0.2
 *
 * @param essaim
 * @text Essaim : + par autre membre de l'essaim vivant
 * @default 0.1
 *
 * @param repare
 * @text Réparation : il regagne … % de ses PV max à chaque fin de tour
 * @type number
 * @default 6
 *
 * @param arrache
 * @text Arrache : tours de la force prise
 * @type number
 * @default 3
 *
 * @param chargeTours
 * @text Élan : un élan tous les … tours
 * @type number
 * @default 3
 *
 * @param chargeForce
 * @text Élan : le coup qui suit ×
 * @default 2
 *
 * @param chargeCasse
 * @text Élan : brisé par un coup de … % de ses PV max
 * @type number
 * @default 15
 *
 * @param voleFuite
 * @text Vol : il fuit sous … % de ses PV
 * @type number
 * @default 30
 *
 * @param revient
 * @text Retour : il se relève avec … % de ses PV max
 * @type number
 * @default 30
 *
 * @param apprend
 * @text Apprend : une technique déjà reçue ×
 * @default 0.7
 *
 * @param apprendMin
 * @text Apprend : jamais moins que ×
 * @default 0.4
 *
 * @param rancoeur
 * @text Rancœur : + par coup reçu
 * @default 0.1
 *
 * @param rancoeurMax
 * @text Rancœur : coups comptés au plus
 * @type number
 * @default 5
 *
 * @param mirageRetour
 * @text Mirage : il revient … tours après s'être dissipé
 * @type number
 * @default 2
 *
 * @param devore
 * @text Dévore : il reprend … des dégâts qu'il fait
 * @default 0.3
 *
 * @param epines
 * @text Chair vive : qui le frappe au corps reprend … des dégâts
 * @default 0.2
 *
 * @param choeurSoin
 * @text Chœur : soigne ses alliés de … % de leurs PV max par tour
 * @type number
 * @default 5
 *
 * @param choeurForce
 * @text Chœur : ses alliés frappent ×
 * @default 1.1
 *
 * @param reflet
 * @text Reflet : renvoie … d'une Parole (magie) au lanceur
 * @default 0.5
 *
 * @param carapace
 * @text Carapace : dégâts reçus × (tant qu'il a plus de la moitié de ses PV)
 * @default 0.5
 *
 * @param explose
 * @text Explose : à sa mort, chaque héros perd … % de ses PV max
 * @type number
 * @default 10
 *
 * @param embuscade
 * @text Embuscade : son premier coup ×
 * @default 1.5
 *
 * @param frenesie
 * @text Frénésie : sous … % de ses PV
 * @type number
 * @default 50
 *
 * @param venin
 * @text Venin : chance de saigner (%)
 * @type number
 * @default 50
 *
 * @param garde
 * @text Garde : il protège un allié sous … % de ses PV
 * @type number
 * @default 50
 *
 * @help
 * ============================================================================
 *  L'INSTINCT DES ENNEMIS                                          pour JOKO
 * ============================================================================
 *  JOKO, le 2026-10-26 : « Ok on passe au ennemis maintenant refait un
 *  rework » ; il a choisi « Tous les 549 », « La cohérence », « Une mécanique
 *  par ennemi » et « L'équilibrage ».
 *
 *  La Bible donne leur comportement aux créatures : les Sentinelles de givre
 *  « apprennent chaque attaque qu'on leur porte et ne tombent jamais deux fois
 *  dans le même piège » ; les Loups d'étoiles « chassent en meute, avec des
 *  plans » ; les Revenants « défendent un lieu » et les Revenus reviennent ;
 *  les Rancœurs sont « une colère si forte qu'elle a pris corps » ; les
 *  Mirages attirent ; les Dévoreurs « ne cessent jamais de chasser » ; la
 *  chair vive « se nourrit de ce qui la touche ». Chaque instinct en vient,
 *  ou du nom que JOKO a donné à l'ennemi.
 *
 *  Une balise sur la fiche de l'ennemi : <Instinct: nom>
 *   meute     — « quand l'une tombe, les autres ne fuient pas — elles
 *               s'énervent » : +20 % pour chaque membre de la meute tombé
 *   essaim    — « individuellement, rien » : +10 % par autre membre vivant
 *   repare    — « se répare pendant que tu réfléchis » : 6 % de PV par tour
 *   brule     — « il allume. Ce qu'il allume, ça s'aggrave » : ses coups
 *               brûlent (Saignement Brûlant)
 *   reprend   — « il te reprend » : il te renvoie la dernière technique que
 *               tu lui as portée
 *   corrige   — « ce qu'il corrige, tu ne l'as jamais fait » : son coup efface
 *               la dernière rune du héros dans le cercle, sinon un renfort
 *   arrache   — « ce qu'il t'arrache, il se le recoud dessus » : son coup
 *               prend de l'attaque au héros et la lui ajoute ; tombé, il rend
 *   charge    — tous les 3 tours il prend son élan (il ne fait rien, « ⚠ ») ;
 *               son coup suivant ×2 ; un coup de 15 % de ses PV ou la brisure
 *               de son bouclier brise l'élan
 *   vole      — ses coups volent de l'or ; sous 30 % de PV il fuit avec ;
 *               tombé, il rend tout
 *   revient   — la première fois qu'il devrait tomber, il se relève à 30 %
 *   apprend   — une technique qu'il a déjà reçue lui fait ×0,7 par fois
 *               (×0,4 au plus bas) : il faut varier
 *   rancoeur  — chaque coup reçu : +10 % (5 au plus), et il vise celui qui
 *               l'a frappé en dernier
 *   mirage    — +40 % d'esquive tant qu'il n'a pas été touché ; il revient
 *               2 tours après
 *   devore    — il reprend 30 % des dégâts qu'il fait
 *   epines    — la chair vive : qui le frappe au corps reprend 20 % du coup
 *   choeur    — tant qu'il chante, ses alliés frappent ×1,1 et regagnent 5 %
 *               de leurs PV à chaque fin de tour
 *   reflet    — « le frapper, c'est se frapper. Il faut trouver l'angle où il
 *               ne renvoie rien » : 50 % du coup revient à qui frappe, sauf
 *               sur sa faiblesse (un élément qui lui fait plus de 100 %)
 *   carapace  — « il n'a pas de faiblesse apparente. C'est qu'il faut la
 *               faire » : ÷2 jusqu'à ce qu'on brise son bouclier (sans
 *               bouclier : tant qu'il a plus de la moitié de ses PV)
 *   explose   — à sa mort, chaque héros perd 10 % de ses PV max
 *   embuscade — au premier tour il part avant tout le monde, sur le héros le
 *               plus faible, ×1,5
 *   frenesie  — sous 50 % de ses PV, il agit deux fois par tour
 *   venin     — ses coups font saigner (1 chance sur 2)
 *   garde     — il prend le coup visé sur un allié sous 50 % de ses PV
 *   marque    — ses coups « repèrent » le héros : tous les ennemis le
 *               frappent plus fort pendant 2 tours
 *
 *  Tout s'annonce au-dessus de qui le fait (CombatTactique). Un retour, une
 *  épine, un reflet ne font jamais tomber un héros (1 PV au moins). Les boss à
 *  mécanique (MecaniquesDeBoss) gardent la leur. Tous les chiffres sont des
 *  réglages. LesInstincts._eteint = true coupe tout (pour un banc).
 * ============================================================================
 */

var LesInstincts = LesInstincts || {};

(function () {
    'use strict';

    var P = PluginManager.parameters('LesInstincts');
    var nb = function (k, d) { var v = parseFloat(String(P[k] === undefined ? '' : P[k]).replace(',', '.')); return isNaN(v) ? d : v; };
    var ELAN = nb('etatElan', 261), RANCOEUR = nb('etatRancoeur', 262), MIRAGE = nb('etatMirage', 263);
    var FRENESIE = nb('etatFrenesie', 264), REPERE = nb('etatRepere', 265), VENIN = nb('etatVenin', 17);
    var BRULURE = nb('etatBrulure', 18), ESSAIM = nb('essaim', 0.1), REPARE = nb('repare', 6) / 100, ARRACHE = nb('arrache', 3);
    var MEUTE = nb('meute', 0.2), CHARGE_TOURS = nb('chargeTours', 3), CHARGE_FORCE = nb('chargeForce', 2);
    var CHARGE_CASSE = nb('chargeCasse', 15) / 100, VOLE_FUITE = nb('voleFuite', 30) / 100, REVIENT = nb('revient', 30) / 100;
    var APPREND = nb('apprend', 0.7), APPREND_MIN = nb('apprendMin', 0.4), RANC = nb('rancoeur', 0.1), RANC_MAX = nb('rancoeurMax', 5);
    var MIRAGE_RETOUR = nb('mirageRetour', 2), DEVORE = nb('devore', 0.3), EPINES = nb('epines', 0.2);
    var CHOEUR_SOIN = nb('choeurSoin', 5) / 100, CHOEUR_FORCE = nb('choeurForce', 1.1), REFLET = nb('reflet', 0.5);
    var CARAPACE = nb('carapace', 0.5), EXPLOSE = nb('explose', 10) / 100, EMBUSCADE = nb('embuscade', 1.5);
    var FRENESIE_SEUIL = nb('frenesie', 50) / 100, VENIN_CHANCE = nb('venin', 50) / 100, GARDE = nb('garde', 50) / 100;
    var BRISE = 1005;                                   // l'état « 💥 Brisé » d'AstfglSCB
    var C = '#ffb070';                                  // la couleur des instincts

    function enCombat() { return !!($gameParty && $gameParty.inBattle()) && !LesInstincts._eteint; }
    function tour() { return $gameTroop ? $gameTroop.turnCount() : 0; }
    function ennemi(b) { return !!(b && b.isEnemy && b.isEnemy()); }
    function heros(b) { return !!(b && b.isActor && b.isActor()); }
    /** L'instinct d'un ennemi (<Instinct: …> sur sa fiche), ou ''. */
    function instinct(b) {
        if (!ennemi(b) || !b.enemy()) { return ''; }
        var v = b.enemy().meta && b.enemy().meta.Instinct;
        return typeof v === 'string' ? v.trim().toLowerCase() : '';
    }
    function a(b, nom) { return instinct(b) === nom; }
    function annonce(b, t) { if (window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, t, C); } }
    function chiffre(x) { return String(Math.round(x * 100) / 100).replace('.', ','); }
    /** « Parole du Feu : Braise » → « Braise » */
    function nomCourt(s) { var n = (s && s.name) || '?', i = n.indexOf(' : '); return i >= 0 ? n.slice(i + 3) : n; }
    function etat(id) { return !!($dataStates[id] && $dataStates[id].name); }
    function poser(b, id) { if (etat(id) && !b.isStateAffected(id)) { b.addState(id); } }
    function ote(b, id) { if (b.isStateAffected(id)) { b.removeState(id); } }
    /** Blesse sans jamais faire tomber un héros. */
    function blesse(b, n) {
        n = Math.min(Math.max(1, Math.round(n)), b.hp - 1);
        if (n > 0) { b.gainHp(-n); }
        return n;
    }

    /** La carapace tient jusqu'à ce qu'on brise son bouclier (AstfglSCB) ; sans bouclier, jusqu'à la moitié de ses PV. */
    function carapaceTient(e) {
        if (e.isStateAffected(BRISE)) { return false; }
        return e._mSh > 0 ? e._sh > 0 : e.hpRate() > 0.5;
    }

    //=========================================================================
    // Les dégâts : la meute, l'essaim, l'élan, l'apprentissage, la rancœur, le chœur, la carapace, l'embuscade
    //=========================================================================
    var _valeur = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _valeur.call(this, target, critical);
        if (!enCombat() || v <= 0 || this.isRecover()) { return v; }
        var s = this.subject(), k = 1, it = this.item();
        if (ennemi(s)) {
            if (a(s, 'meute')) {
                var tombes = $gameTroop.members().filter(function (x) { return x !== s && a(x, 'meute') && x.isDead(); }).length;
                if (tombes > 0) { k *= 1 + MEUTE * tombes; if (!this._annonceMeute) { this._annonceMeute = true; annonce(s, '🐺 La meute s\'énerve ×' + chiffre(1 + MEUTE * tombes)); } }
            }
            if (a(s, 'essaim')) {
                var n = $gameTroop.aliveMembers().filter(function (x) { return x !== s && a(x, 'essaim'); }).length;
                if (n > 0) { k *= 1 + ESSAIM * n; if (!this._annonceEssaim) { this._annonceEssaim = true; annonce(s, '🐜 Essaim ×' + chiffre(1 + ESSAIM * n)); } }
            }
            if (a(s, 'charge') && s.isStateAffected(ELAN)) { k *= CHARGE_FORCE; s._elanConsomme = true; }
            if (a(s, 'rancoeur') && s._rancoeur) { k *= 1 + RANC * s._rancoeur; }
            if (a(s, 'embuscade') && s._embuscade) { k *= EMBUSCADE; s._embuscadeConsommee = true; }
            if (!a(s, 'choeur') && $gameTroop.aliveMembers().some(function (x) { return a(x, 'choeur'); })) { k *= CHOEUR_FORCE; }
        }
        if (ennemi(target)) {
            if (a(target, 'apprend') && it && DataManager.isSkill(it)) {
                var vu = (target._appris || {})[it.id] || 0;
                if (vu > 0) {
                    var f = Math.max(APPREND_MIN, Math.pow(APPREND, vu));
                    k *= f;
                    if (!this._annonceAppris) { this._annonceAppris = true; annonce(target, '👁 Il a appris ×' + chiffre(f)); }
                }
            }
            if (a(target, 'carapace') && carapaceTient(target)) {
                k *= CARAPACE;
                if (!this._annonceCarapace) { this._annonceCarapace = true; annonce(target, '🐢 La carapace tient'); }
            }
        }
        return k === 1 ? v : Math.round(v * k);
    };

    //=========================================================================
    // Après chaque coup : retour, élan brisé, rancœur, mirage, vol, dévore, chair vive, reflet, venin, marque
    //=========================================================================
    var _degats = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        if (enCombat() && ennemi(target) && a(target, 'revient') && !target._revenu && value > 0 && value >= target.hp) {
            value = Math.max(0, target.hp - 1);         // il refuse de tomber ; il se relève à la fin de l'action
            target._revientAFaire = true;
        }
        _degats.call(this, target, value);
        if (!enCombat() || value <= 0) { return; }
        var s = this.subject();
        if (ennemi(target)) {
            if (a(target, 'charge') && target.isStateAffected(ELAN) && (value >= target.mhp * CHARGE_CASSE || target.isStateAffected(BRISE))) {
                ote(target, ELAN); annonce(target, '⚠ Élan brisé !');
            }
            if (a(target, 'rancoeur') && heros(s)) {
                target._rancoeur = Math.min(RANC_MAX, (target._rancoeur || 0) + 1);
                target._cibleRancoeur = s;
                poser(target, RANCOEUR);
                if (target.setStateCounter) { target.setStateCounter(RANCOEUR, target._rancoeur); }
                annonce(target, '😡 Rancœur ×' + chiffre(1 + RANC * target._rancoeur));
            }
            if (a(target, 'mirage') && target._mirage && !target.isStateAffected(MIRAGE)) {
                target._mirage = false; target._mirageRetour = tour() + MIRAGE_RETOUR;
                annonce(target, '🌫 Le mirage se dissipe');
            }
        }
        // les coups de l'ennemi, sur un héros
        if (ennemi(s) && heros(target)) {
            if (a(s, 'vole') && !this._vol && $gameParty.gold() > 0) {
                this._vol = true;
                var or = Math.min($gameParty.gold(), Math.max(1, s.gold() || 10));
                $gameParty.loseGold(or); s._vole = (s._vole || 0) + or;
                annonce(s, '💰 Volé : ' + or + ' or');
            }
            if (a(s, 'devore') && s.isAlive()) {
                var pris = Math.max(1, Math.round(value * DEVORE));
                s.gainHp(pris); annonce(s, '🩸 Il dévore +' + pris);
            }
            if (a(s, 'venin') && target.isAlive() && Math.random() < VENIN_CHANCE) { poser(target, VENIN); annonce(target, '🐍 Venin'); }
            if (a(s, 'brule') && target.isAlive() && etat(BRULURE)) { target.addState(BRULURE); annonce(target, '🔥 Ça brûle'); }
            if (a(s, 'corrige') && target.isAlive() && !this._corrige) {
                this._corrige = true;
                var runes = target._ecrits || [];
                if (runes.length) {
                    var m = runes[runes.length - 1];
                    target._ecrits = runes.slice(0, -1);
                    if (m.cible && window.LEcrit && LEcrit.surCible) { montrerCercle(m.cible); }
                    annonce(target, '✒ Corrigé : une rune effacée');
                } else {
                    var renfort = [0, 1, 2, 3, 4, 5, 6, 7].filter(function (p) { return target.isBuffAffected(p); })[0];
                    if (renfort !== undefined) { target.removeBuff(renfort); annonce(target, '✒ Corrigé : un renfort effacé'); }
                }
            }
            if (a(s, 'arrache') && target.isAlive() && s.isAlive() && !this._arrache) {
                this._arrache = true;
                target.addDebuff(2, ARRACHE); s.addBuff(2, ARRACHE);
                s._arracheA = s._arracheA || [];
                if (s._arracheA.indexOf(target) < 0) { s._arracheA.push(target); }
                annonce(s, '🧵 Il se le recoud dessus');
            }
            if (a(s, 'marque') && target.isAlive() && etat(REPERE)) {
                target.addState(REPERE); annonce(target, '🎯 Repéré');
            }
        }
        // les coups d'un héros, sur l'ennemi
        if (heros(s) && ennemi(target)) {
            if (a(target, 'epines') && this.isPhysical() && s.isAlive()) {
                var e = blesse(s, value * EPINES);
                if (e > 0) { annonce(s, '🌵 La chair vive −' + e); }
            }
            // « il faut trouver l'angle où il ne renvoie rien » : sa faiblesse
            if (a(target, 'reflet') && s.isAlive() && this.calcElementRate(target) <= 1) {
                var r = blesse(s, value * REFLET);
                if (r > 0) { annonce(target, '🪞 Reflet −' + r); }
            }
            // « il te reprend » : la dernière technique qu'on lui a portée, il la renvoie à qui l'a lancée
            var it = this.item();
            if (a(target, 'reprend') && it && DataManager.isSkill(it) && it.id > 2) {
                target._reprend = { competence: it.id, cible: s };
            }
        }
    };
    function montrerCercle(c) {
        // LEcrit montre le nombre de runes sur la cible : on le lui redemande
        var n = window.LEcrit && LEcrit.surCible ? LEcrit.surCible(c) : 0, id = 257;
        if (n > 0) { if (c.setStateCounter) { c.setStateCounter(id, n); } }
        else if (c.isStateAffected(id)) { c.eraseState(id); if (c.removeStateCounter) { c.removeStateCounter(id); } c.refresh(); }
    }
    // L'apprentissage compte une fois par action, quand le coup a porté.
    var _appliquer = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _appliquer.call(this, target);
        var it = this.item();
        if (enCombat() && ennemi(target) && a(target, 'apprend') && it && DataManager.isSkill(it) && target.result().isHit()) {
            this._apprisPar = this._apprisPar || [];
            if (this._apprisPar.indexOf(target) < 0) {
                this._apprisPar.push(target);
                target._appris = target._appris || {};
                target._appris[it.id] = (target._appris[it.id] || 0) + 1;
            }
        }
    };

    //=========================================================================
    // Qui il vise : la rancœur (celui qui l'a frappé), l'embuscade (le plus faible) ; la garde (côté héros)
    //=========================================================================
    var _cibles = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function () {
        var s = this.subject(), t = _cibles.call(this);
        if (!enCombat() || !this.isForOpponent() || !this.isForOne()) { return t; }
        if (ennemi(s) && !(s._appat && tour() <= s._appat.jusque)) {
            var vise = null;
            if (a(s, 'rancoeur') && s._cibleRancoeur && s._cibleRancoeur.isAlive() && $gameParty.battleMembers().indexOf(s._cibleRancoeur) >= 0) { vise = s._cibleRancoeur; }
            if (a(s, 'embuscade') && s._embuscade) {
                vise = $gameParty.aliveMembers().slice().sort(function (x, y) { return x.hpRate() - y.hpRate(); })[0] || vise;
            }
            if (vise) { return t.map(function () { return vise; }); }
        }
        if (heros(s)) {
            var gardien = null;
            t = t.map(function (c) {
                if (!ennemi(c) || a(c, 'garde') || c.hpRate() >= GARDE) { return c; }
                gardien = gardien || $gameTroop.aliveMembers().filter(function (x) { return x !== c && a(x, 'garde'); })[0] || null;
                if (gardien && !this._annonceGarde) { this._annonceGarde = true; annonce(gardien, '🛡 Il protège ' + c.name()); }
                return gardien || c;
            }, this);
        }
        return t;
    };

    //=========================================================================
    // L'élan : il ne fait rien ce tour-ci, et frappe ×2 au suivant
    //=========================================================================
    var _actions = Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions = function () {
        _actions.call(this);
        if (!enCombat()) { return; }
        // « il te reprend » : son action devient la dernière technique qu'on lui a portée, sur qui l'a lancée
        var rp = this._reprend;
        if (a(this, 'reprend') && rp && $dataSkills[rp.competence] && rp.cible && rp.cible.isAlive() && this.numActions() > 0) {
            this._reprend = null;
            var act = this.action(0);
            act.setSkill(rp.competence);
            act._forcing = true;                           // il n'a pas les PM du héros : il reprend le geste, pas le prix
            var i = $gameParty.members().indexOf(rp.cible);
            if (act.isForOpponent() && act.isForOne() && i >= 0) { act.setTarget(i); } else { act.setTarget(-1); }
            annonce(this, '🎭 Il te reprend : ' + nomCourt($dataSkills[rp.competence]));
        }
        if (!a(this, 'charge') || !etat(ELAN) || this.isStateAffected(ELAN)) { return; }
        this._compteElan = (this._compteElan || 0) + 1;
        if (this._compteElan % CHARGE_TOURS === 0) {
            this.clearActions();
            this.addState(ELAN);
            annonce(this, '⚠ Il prend son élan');
        }
    };

    //=========================================================================
    // L'ordre : l'embuscade part avant tout le monde au premier tour
    //=========================================================================
    var _ordres = BattleManager.makeActionOrders;
    BattleManager.makeActionOrders = function () {
        _ordres.call(this);
        if (!enCombat() || tour() !== 1) { return; }
        var l = this._actionBattlers || [];
        var devant = l.filter(function (b) { return a(b, 'embuscade'); });
        if (devant.length) {
            this._actionBattlers = devant.concat(l.filter(function (b) { return devant.indexOf(b) < 0; }));
            devant.forEach(function (b) { b._embuscade = true; annonce(b, '🗡 Embuscade !'); });
        }
    };

    //=========================================================================
    // La fin d'une action : le retour, la fuite du voleur, l'élan consommé, l'explosion, la frénésie
    //=========================================================================
    function apresAction() {
        $gameTroop.members().forEach(function (e) {
            if (e._revientAFaire) {
                e._revientAFaire = false; e._revenu = true;
                if (e.isAlive()) {
                    e.setHp(Math.max(1, Math.ceil(e.mhp * REVIENT)));
                    annonce(e, '☠ Il revient !');
                }
            }
            if (e._elanConsomme) { e._elanConsomme = false; ote(e, ELAN); annonce(e, '⚠ De tout son élan !'); }
            if (e._embuscadeConsommee) { e._embuscadeConsommee = false; e._embuscade = false; }
            if (a(e, 'meute') && e.isDead() && !e._meuteTombee) {
                e._meuteTombee = true;
                var reste = $gameTroop.aliveMembers().filter(function (x) { return a(x, 'meute'); });
                if (reste.length) { annonce(reste[0], '🐺 La meute s\'énerve'); }
            }
            if (a(e, 'explose') && e.isDead() && !e._explose) {
                e._explose = true;
                annonce(e, '💥 Il explose !');
                $gameParty.aliveMembers().forEach(function (h) { var x = blesse(h, h.mhp * EXPLOSE); if (x > 0) { annonce(h, '💥 −' + x); } });
            }
            if (a(e, 'vole') && e.isAlive() && e._vole && e.hpRate() < VOLE_FUITE) {
                annonce(e, '💨 Il s\'enfuit avec ' + e._vole + ' or');
                e._vole = 0;
                e.escape();
            }
            if (a(e, 'frenesie') && e.isAlive() && e.hpRate() < FRENESIE_SEUIL && etat(FRENESIE) && !e.isStateAffected(FRENESIE)) {
                e.addState(FRENESIE); annonce(e, '🔥 Frénésie !');
            }
        });
    }
    var _finAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        _finAction.call(this);
        if (enCombat()) { apresAction(); }
    };
    // Le voleur tombé rend ce qu'il a pris.
    var _mourir = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function () {
        if (enCombat() && this._vole) { $gameParty.gainGold(this._vole); annonce(this, '💰 Rendu : ' + this._vole + ' or'); this._vole = 0; }
        // « le tuer, c'est défaire ce qu'il a pris »
        if (enCombat() && this._arracheA && this._arracheA.length) {
            this._arracheA.forEach(function (h) { if (h.isDebuffAffected(2)) { h.removeBuff(2); } });
            this._arracheA = [];
            annonce(this, '🧵 Ce qu\'il a pris se défait');
        }
        _mourir.call(this);
    };

    //=========================================================================
    // Le début et la fin des tours : le mirage, le chœur
    //=========================================================================
    var _debut = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _debut.call(this);
        if (!enCombat()) { return; }
        $gameTroop.members().forEach(function (e) {
            if (a(e, 'mirage') && etat(MIRAGE)) { e.addState(MIRAGE); e._mirage = true; }
        });
    };
    var _finTour = BattleManager.endTurn;
    BattleManager.endTurn = function () {
        _finTour.call(this);
        if (!enCombat()) { return; }
        apresAction();
        var t = tour(), vivants = $gameTroop.aliveMembers();
        vivants.forEach(function (e) {
            if (a(e, 'mirage') && !e._mirage && e._mirageRetour && t >= e._mirageRetour && etat(MIRAGE)) {
                e.addState(MIRAGE); e._mirage = true; e._mirageRetour = 0; annonce(e, '🌫 Le mirage revient');
            }
        });
        vivants.forEach(function (e) {
            if (a(e, 'repare') && e.hp < e.mhp) {
                var r = Math.max(1, Math.round(e.mhp * REPARE));
                e.gainHp(r); annonce(e, '⚙ Il se répare +' + r);
            }
        });
        var chantent = vivants.filter(function (e) { return a(e, 'choeur'); });
        if (chantent.length) {
            annonce(chantent[0], '🎵 Le chœur chante');
            vivants.forEach(function (e) { if (e.hp < e.mhp) { e.gainHp(Math.max(1, Math.round(e.mhp * CHOEUR_SOIN * chantent.length))); } });
        }
    };

    LesInstincts.instinct = instinct;
    LesInstincts.LISTE = ['meute', 'essaim', 'charge', 'vole', 'revient', 'apprend', 'rancoeur', 'mirage', 'devore', 'epines', 'choeur', 'repare', 'brule', 'reprend', 'corrige', 'arrache',
        'reflet', 'carapace', 'explose', 'embuscade', 'frenesie', 'venin', 'garde', 'marque'];
})();
