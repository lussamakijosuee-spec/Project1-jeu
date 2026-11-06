//=============================================================================
// LaParole.js — v1.0
// La Parole, l'art de l'Esprit : la phrase commune, les cinq degrés, les longues.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ La Parole (mana positif seulement) : la phrase commune
 * (l'élément en suspens), les cinq degrés qui font ce que dit leur nom, les
 * longues qui partent en fin de tour, et les 6 fusions par les Paroles de Fusion.
 * @author pour JOKO
 *
 * @param === LES DEGRÉS ===
 * @default
 *
 * @param premiereEchelle
 * @text Première Parole des échelles
 * @type skill
 * @default 1186
 * @desc Feu — Braise. Puis cinq degrés par élément, à la suite : simple, double, amplifiée, fusion, dernier degré.
 *
 * @param elementsEchelles
 * @text Nombre d'échelles
 * @type number
 * @default 8
 *
 * @param typesExclus
 * @text Types de compétence hors des échelles
 * @default
 * @desc Séparés par des virgules. Vide : les 40 Paroles suivent les degrés (l'échelle de Glace de Korrah est du type 6, l'Hiver).
 *
 * @param acteursExclus
 * @text Ceux qui ne récitent pas
 * @default 6
 * @desc seiryu (6), l'Avatar de Korrah : il ne dit pas de Parole, il ne touche pas à la phrase.
 *
 * @param === LA PHRASE COMMUNE ===
 * @default
 *
 * @param toursPhrase
 * @text Tours où l'élément reste en suspens
 * @type number
 * @min 1
 * @default 2
 * @desc 2 = le tour où il est dit, et le suivant.
 *
 * @param fusions
 * @text Les fusions (élément + élément = fusion)
 * @default 8+9=17, 8+11=19, 9+11=20, 9+13=22, 11+12=23, 14+15=29
 * @desc Les 6 de JOKO : Vapeur, Lave, Plante, Givre, Métal, Crépuscule. Aucune autre paire ne fusionne.
 *
 * @param bonusFusion
 * @text Fusion : dégâts ×
 * @default 1.5
 *
 * @param bonusDouble
 * @text Double élément : dégâts ×
 * @default 1
 * @desc Les deux éléments jouent déjà ensemble (règle « Multiplier »).
 *
 * @param === AËL : POUR ELLE ===
 * @default
 *
 * @param pourElle
 * @text Ceux pour qui leur propre phrase reste ouverte
 * @default 4
 * @desc Aël (4) — son gouffre : « oser dire et faire des choses pour ELLE ». Quand elle complète une phrase qu'elle a commencée, la phrase reste (elle peut la compléter encore) et frappe × bonusPourElle.
 *
 * @param bonusPourElle
 * @text Pour elle : dégâts ×
 * @default 1.2
 *
 * @param === LES VERBES DE LA PAROLE ===
 * @default
 *
 * @param assez
 * @text <Assez> : fermer la phrase d'un coup ×
 * @default 1.5
 *
 * @param nomme
 * @text <Nomme> : la prochaine Parole sur l'ennemi nommé ×
 * @default 1.3
 *
 * @param encourage
 * @text <Encourage> : la prochaine action qui blesse de l'allié ×
 * @default 1.2
 *
 * @param === LES LONGUES ===
 * @default
 *
 * @param seuilCoup
 * @text Brisée par un coup de (% des PV max)
 * @type number
 * @default 15
 *
 * @param seuilCumul
 * @text Brisée par un cumul de (% des PV max)
 * @type number
 * @default 30
 *
 * @param brisee
 * @text Une longue brisée part à ×
 * @default 0.5
 *
 * @param etatLongue
 * @text État posé pendant qu'on la tient (0 = aucun)
 * @type state
 * @default 0
 * @desc 0 : rien que l'affichage. L'état 227 (🌀 Incantation d'Aël) FRAGILISE (DÉF et DÉF.M ×0,6, esquive −50 %) : ne le mettre que si JOKO le veut.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA PAROLE — l'art de l'Esprit                                         JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  JOKO, le 2026-10-20 : « Pour les paroles, tu peux utiliser que le mana
 *  positif » ; puis « Commence par la Parole : la phrase commune, les degrés,
 *  les longues en fin de tour, mes 6 fusions par les Paroles de Fusion. »
 *  Son canon : « mot de passe + élément + sort » ; « Plus la phrase est longue,
 *  plus elle frappe fort, mais plus elle exige de temps et de concentration ;
 *  sous la pression, la formule trop longue se brise. »
 *
 *  QUI EST UNE PAROLE — une compétence de héros au mana positif : les 40
 *  Paroles des échelles, et « Parole n°X » si X n'est ni 2, 4, 5, 6 ni 7
 *  (spirituel, négatif, sombre, originel, âme : d'autres arts). Sans numéro :
 *  une magie (ParolesSysteme) sans <Voie:> et d'un élément qui n'est pas d'un
 *  autre mana.
 *
 *  LA PHRASE COMMUNE — une Parole d'élément fondamental (Feu 8 … Ombre 15)
 *  laisse son élément EN SUSPENS, à l'écran, jusqu'à la fin du tour suivant.
 *  Un allié — ou soi-même — la complète :
 *    · DOUBLE (2ᵉ degré) : si l'élément en suspens est autre, la Double frappe
 *      avec ses DEUX éléments (« les deux codes se concatènent »).
 *    · FUSION (4ᵉ degré) : si l'élément en suspens forme une des 6 fusions
 *      avec le sien, elle devient l'élément fusionné, × bonusFusion.
 *  Compléter la phrase la referme. Toute autre Parole d'élément la remplace.
 *
 *  LES DEGRÉS — simple, double, amplifiée : tout de suite. FUSION et DERNIER
 *  DEGRÉ sont LONGUES : le lanceur l'annonce au début du tour, et elle part
 *  en DERNIER, après tout le monde. Un coup de seuilCoup % de ses PV, un
 *  cumul de seuilCumul %, ou un état qui l'empêche d'agir la BRISE : elle
 *  part à × brisee. Le dernier degré ne se redit pas au tour suivant
 *  (« On ne la prononce pas deux fois de suite »).
 *
 *  AËL, POUR ELLE (2026-10-22 ; JOKO : « rendre les vraiment intéressant et
 *  original » ; son profil : « oser dire et faire des choses pour ELLE, pas
 *  seulement pour ses amis ») — quand elle complète une phrase qu'ELLE a
 *  commencée, la phrase ne se referme pas : son élément reste en suspens, et
 *  elle peut enchaîner (une Double, puis une Fusion sur le même élément).
 *  ×1,2. Compléter la phrase d'un ami la referme, comme pour tout le monde.
 *
 *  Double, Fusion et « pour elle » s'annoncent au-dessus de qui parle.
 *
 *  LES VERBES DE LA PAROLE (2026-10-22, « Oui rework tout ») — le mot fait ce
 *  qu'il dit, dans la phrase commune ; une balise, une ligne de description :
 *   <Reste>     — la phrase en suspens tient un tour de plus ;
 *   <Assez>     — ferme la phrase d'un coup : frappe avec son élément, ×1,5 ;
 *   <MotJuste>  — frappe avec l'élément fondamental qui marche le mieux sur la
 *                 cible, et le laisse en suspens ;
 *   <Suspend: n> — laisse l'élément n en suspens (le ciel d'Aël le prête) ;
 *   <Viens>     — sa prochaine Parole à une cible les prend tous ;
 *   <Pars>      — l'ennemi touché passe en dernier (ce tour, ou le suivant) ;
 *   <Nomme>     — l'ennemi touché est nommé : la prochaine Parole sur lui ×1,3 ;
 *   <Avec>      — frappe aussi avec l'élément en suspens, et la phrase reste
 *                 ouverte (« une flèche, un mot : les deux partent ensemble ») ;
 *   <Encourage> — sur un allié : sa prochaine action qui blesse ×1,2 (« un mot
 *                 au bon moment vaut une potion ») ;
 *   <Devant>    — sur un allié (n'importe quel art : un soin, une réanimation,
 *                 une purge) : il agit en premier au tour suivant (« le Verbe
 *                 refuse leur chute », « on gagne un temps sur eux »).
 *
 *  Les ennemis ne changent pas. Le ratage caché de ParolesSysteme est coupé
 *  pour les héros (son réglage HerosSansRatage).
 *
 *  Pour un banc : window.LaParole.phrase() / .degre(skill) / .estParole(skill)
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('LaParole');
    function nb(k, d) { var v = P[k]; return (v === undefined || v === '' || isNaN(Number(v))) ? d : Number(v); }
    var PREMIERE = nb('premiereEchelle', 1186), NB_EL = nb('elementsEchelles', 8);
    var TYPES_EXCLUS = String(P['typesExclus'] || '').split(',').map(function (x) { return parseInt(x, 10); }).filter(function (x) { return x > 0; });
    var TOURS = Math.max(1, nb('toursPhrase', 2));
    var EXCLUS = String(P['acteursExclus'] === undefined ? '6' : P['acteursExclus']).split(',').map(function (x) { return parseInt(x, 10); }).filter(function (x) { return x > 0; });
    var BONUS_FUSION = nb('bonusFusion', 1.5), BONUS_DOUBLE = nb('bonusDouble', 1);
    var SEUIL_COUP = nb('seuilCoup', 15) / 100, SEUIL_CUMUL = nb('seuilCumul', 30) / 100, BRISEE = nb('brisee', 0.5);
    var ETAT = nb('etatLongue', 227);
    var POUR_ELLE = String(P['pourElle'] === undefined ? '4' : P['pourElle']).split(',').map(function (x) { return parseInt(x, 10); }).filter(function (x) { return x > 0; });
    var BONUS_ELLE = nb('bonusPourElle', 1.2);
    var ASSEZ = nb('assez', 1.5), NOMME = nb('nomme', 1.3), ENCOURAGE = nb('encourage', 1.2);
    var FUSIONS = {};
    String(P['fusions'] || '8+9=17, 8+11=19, 9+11=20, 9+13=22, 11+12=23, 14+15=29').split(',').forEach(function (x) {
        var m = /^\s*(\d+)\s*\+\s*(\d+)\s*=\s*(\d+)\s*$/.exec(x);
        if (m) { FUSIONS[Math.min(+m[1], +m[2]) + '+' + Math.max(+m[1], +m[2])] = +m[3]; }
    });
    var DEGRES = ['simple', 'double', 'amplifiee', 'fusion', 'dernier'];
    var AUTRES_MANAS = [2, 4, 5, 6, 7];

    //=========================================================================
    // OUTILS
    //=========================================================================
    function enCombat() { return !!($gameParty && $gameParty.inBattle()); }
    function tour() { return $gameTroop ? $gameTroop.turnCount() : 0; }
    function journal(t) { var w = SceneManager._scene && SceneManager._scene._logWindow; if (w) { w.push('addText', t); } }
    function heros(b) { return !!(b && b.isActor && b.isActor() && EXCLUS.indexOf(b.actorId()) < 0); }
    function annonce(b, texte, couleur) {
        if (b && window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, texte, couleur); }
    }
    /** Aël complète sa propre phrase : elle reste ouverte, et la Parole frappe plus fort. */
    function pourElle(act, u, p) {
        if (POUR_ELLE.indexOf(u.actorId()) < 0 || p.par !== u.name()) { phrase = null; return; }
        act._paroleMult *= BONUS_ELLE;
        phrase = { el: p.el, tour: tour(), par: p.par };
        annonce(u, '✦ Pour elle — la phrase reste', '#ffe08a');
    }
    function nomEl(id) {
        var s = String(($dataSystem && $dataSystem.elements[id]) || '').trim();
        return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '?';
    }
    function fondamental(el) { return el >= 8 && el <= 15; }
    function fusionDe(a, b) { return FUSIONS[Math.min(a, b) + '+' + Math.max(a, b)] || 0; }

    function degre(item) {
        if (!item || !DataManager.isSkill(item)) { return ''; }
        var i = item.id - PREMIERE;
        if (i < 0 || i >= NB_EL * 5 || TYPES_EXCLUS.indexOf(item.stypeId) >= 0) { return ''; }
        return DEGRES[i % 5];
    }
    function estLongue(item) { var d = degre(item); return d === 'fusion' || d === 'dernier'; }

    /** Une Parole de l'Esprit : au mana positif, et seulement lui. */
    function estParole(item) {
        if (!item || !DataManager.isSkill(item)) { return false; }
        // [JOKO 2026-10-22] Une seule règle pour les trois arts : LesTroisArts la porte.
        if (window.LesTroisArts && LesTroisArts.art) { return LesTroisArts.art(item) === 'parole'; }
        if (degre(item)) { return true; }
        var m = /^Parole n°\s*(\d+)/.exec(item.name || '');
        if (m) { return AUTRES_MANAS.indexOf(+m[1]) < 0; }
        if (item.meta && item.meta.Voie !== undefined) { return false; }
        var info = window.Paroles && Paroles.info ? Paroles.info(item) : null;
        if (!info) { return false; }
        return AUTRES_MANAS.indexOf(item.damage ? item.damage.elementId : 0) < 0;
    }

    //=========================================================================
    // LA PHRASE COMMUNE
    //=========================================================================
    var phrase = null;                                    // { el, tour, par }
    function phraseActive() {
        if (phrase && (!enCombat() || tour() > phrase.tour + TOURS - 1)) { phrase = null; }
        return phrase;
    }
    function dire(el, b) { phrase = { el: el, tour: tour(), par: b.name() }; }

    var _setup = BattleManager.setup;
    BattleManager.setup = function () {
        phrase = null;
        $gameParty.members().forEach(function (a) { a._paroleLongue = null; a._dernierDit = null; });
        return _setup.apply(this, arguments);
    };
    var _finCombat = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        phrase = null;
        $gameParty.members().forEach(function (a) {
            if (a._paroleLongue && ETAT > 0) { a.removeState(ETAT); }
            a._paroleLongue = null; a._dernierDit = null;
        });
        return _finCombat.call(this, result);
    };

    //=========================================================================
    // CE QUE LA PAROLE FAIT — décidé au premier coup de l'action
    //=========================================================================
    function decider(act) {
        act._paroleElements = null; act._paroleMult = 1;
        var u = act.subject(), it = act.item();
        if (!heros(u) || !act.isSkill() || !estParole(it)) { return; }
        var L = u._paroleLongue;
        if (L && L.skillId === it.id && L.brisee) { act._paroleMult *= BRISEE; }
        var d = degre(it);
        if (d === 'dernier') { u._dernierDit = { id: it.id, tour: tour() }; }
        var el = it.damage ? it.damage.elementId : 0;
        if (!fondamental(el)) { return; }
        var p = phraseActive();
        if (d === 'double' && p && p.el !== el) {
            act._paroleElements = [el, p.el];
            act._paroleMult *= BONUS_DOUBLE;
            journal('\\C[17]✦ Double — ' + nomEl(el) + ' et ' + nomEl(p.el) + '.\\C[0]');
            annonce(u, '✦ Double · ' + nomEl(el) + ' + ' + nomEl(p.el), '#9ad0ff');
            pourElle(act, u, p);
            return;
        }
        if (d === 'fusion' && p) {
            var f = fusionDe(el, p.el);
            if (f) {
                act._paroleElements = [f];
                act._paroleMult *= BONUS_FUSION;
                journal('\\C[17]✦ FUSION — ' + nomEl(p.el) + ' + ' + nomEl(el) + ' = ' + nomEl(f) + ' !\\C[0]');
                annonce(u, '✦ FUSION · ' + nomEl(f), '#9ad0ff');
                if ($gameScreen) { $gameScreen.startFlash([200, 220, 255, 130], 24); }
                pourElle(act, u, p);
                return;
            }
        }
        dire(el, u);
        journal('\\C[16]' + nomEl(el) + ' reste en suspens.\\C[0]');
    }

    //=========================================================================
    // LES VERBES DE LA PAROLE (2026-10-22, « Oui rework tout ») — les mots
    // d'Aël font ce qu'ils disent, toujours dans la phrase commune.
    //=========================================================================
    function balise(it, nom) { return !!(it && it.meta && it.meta[nom] !== undefined); }
    function meilleurElement(cible) {
        var best = 8, taux = -1;
        for (var e = 8; e <= 15; e++) { var r = cible.elementRate(e); if (r > taux + 1e-9) { taux = r; best = e; } }
        return best;
    }
    /** Décidé au premier coup, après la phrase : ce que le mot fait de la phrase. */
    function verbes(act, cible, avant) {
        var u = act.subject(), it = act.item();
        if (!heros(u) || !act.isSkill() || !estParole(it)) { return; }
        // <Avec> (Trait Clair, « une flèche, un mot : les deux partent ensemble ») : la Parole frappe aussi avec
        // l'élément en suspens, et la phrase reste ouverte (son propre élément ne la remplace pas).
        var elA = it.damage ? it.damage.elementId : 0;
        if (balise(it, 'Avec') && avant && avant.el !== elA) {
            act._paroleElements = fondamental(elA) ? [elA, avant.el] : [avant.el];
            phrase = { el: avant.el, tour: avant.tour, par: avant.par };
            annonce(u, 'Avec · ' + nomEl(avant.el), '#ffe08a');
        }
        var p = phraseActive();
        if (balise(it, 'Assez') && p) {                          // « Assez. » : on ferme la phrase, d'un coup
            act._paroleElements = [p.el];
            act._paroleMult *= ASSEZ;
            phrase = null;
            annonce(u, '« Assez. » — ' + nomEl(p.el) + ' ×' + String(ASSEZ).replace('.', ','), '#ffe08a');
        }
        if (balise(it, 'MotJuste') && cible && cible.isEnemy()) { // Le Mot Juste : l'élément qui marche
            var el = meilleurElement(cible);
            act._paroleElements = [el];
            dire(el, u);
            annonce(u, '✦ Le mot juste : ' + nomEl(el), '#ffe08a');
        }
        if (balise(it, 'Suspend')) {                             // le ciel prête son élément à la phrase
            var s = parseInt(it.meta.Suspend, 10);
            if (fondamental(s)) { dire(s, u); annonce(u, nomEl(s) + ' en suspens', '#9ad0ff'); }
        }
        if (balise(it, 'Reste') && phraseActive()) {              // « Reste. » : la phrase tient un tour de plus
            phrase.tour = tour() + 1;
            annonce(u, '« Reste. » — la phrase tient', '#ffe08a');
        }
        if (balise(it, 'Viens')) {                               // « Viens. » : sa prochaine Parole les prend tous
            u._viens = tour();
            annonce(u, '« Viens. » — tous au même point', '#ffe08a');
        }
    }
    /** Après le coup : ce que le mot laisse sur la cible. */
    function apres(act, cible) {
        var u = act.subject(), it = act.item();
        if (!heros(u) || !act.isSkill() || !cible) { return; }
        // Sur un allié : <Encourage> (sa prochaine action qui blesse ×1,2), <Devant> (il agit en premier au tour suivant)
        if (cible.isActor() && cible.isAlive() && cible.result().isHit()) {
            if (balise(it, 'Encourage')) { cible._encourage = true; annonce(cible, '✦ Encouragé', '#ffe08a'); }
            if (balise(it, 'Devant')) { cible._devant = true; annonce(cible, '⚡ En premier', '#ffe08a'); }
            return;
        }
        if (!cible.isEnemy() || !cible.result().isHit()) { return; }
        if (balise(it, 'Nomme') && cible.isAlive()) {             // la flèche nommée : la prochaine Parole sur lui ×1,3
            cible._nomme = true;
            annonce(cible, '✦ Nommé', '#ffe08a');
        }
        if (balise(it, 'Pars') && cible.isAlive()) {              // « Pars. » : il passe en dernier
            var l = BattleManager._actionBattlers || [], i = l.indexOf(cible);
            if (i >= 0) { l.splice(i, 1); l.push(cible); } else { cible._pars = tour() + 1; }
            annonce(cible, '« Pars. » — en dernier', '#ffe08a');
        }
    }

    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        if (this._paroleDecidee === undefined && enCombat()) {
            this._paroleDecidee = true;
            var pa = phraseActive(), avant = pa ? { el: pa.el, tour: pa.tour, par: pa.par } : null;
            decider(this);
            verbes(this, target, avant);
        }
        _apply.call(this, target);
        if (enCombat()) { apres(this, target); }
    };

    // « Viens. » : la prochaine Parole à une cible les prend tous (jusqu'à la fin du tour suivant).
    var _cibles = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function () {
        var u = this.subject();
        if (enCombat() && heros(u) && u._viens !== undefined && u._viens !== null && this.isSkill() && estParole(this.item()) &&
            this.isForOpponent() && this.isForOne() && !balise(this.item(), 'Viens')) {
            var vivant = tour() <= u._viens + 1;
            u._viens = null;
            var tous = this.opponentsUnit().aliveMembers();
            if (vivant && tous.length > 1) { annonce(u, '« Viens. » — sur tous', '#ffe08a'); return tous; }
        }
        return _cibles.call(this);
    };

    // Les éléments d'une Double ou d'une Fusion — pour les dégâts (YEP_ElementCore)
    // comme pour la brisure des boucliers (AstfglSCB lit getItemElements).
    var _elements = Game_Action.prototype.getItemElements;
    if (_elements) {
        Game_Action.prototype.getItemElements = function () {
            if (this._paroleElements) { return this._paroleElements.slice(); }
            return _elements.call(this);
        };
    } else {
        var _taux = Game_Action.prototype.calcElementRate;
        Game_Action.prototype.calcElementRate = function (target) {
            if (this._paroleElements) {
                return this._paroleElements.reduce(function (r, e) { return r * target.elementRate(e); }, 1);
            }
            return _taux.call(this, target);
        };
    }

    var _valeur = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _valeur.call(this, target, critical);
        if (this._paroleMult && this._paroleMult !== 1) { v = Math.round(v * this._paroleMult); }
        // Encouragé : sa prochaine action qui blesse ×1,2 (une fois, au premier coup).
        var su = this.subject();
        if (v > 0 && su && su._encourage && heros(su) && enCombat() && target && target.isEnemy && target.isEnemy()) {
            su._encourage = false;
            v = Math.round(v * ENCOURAGE);
            annonce(su, '✦ Encouragé ×' + String(ENCOURAGE).replace('.', ','), '#ffe08a');
        }
        // Un ennemi nommé : la prochaine Parole d'un héros sur lui ×1,3, une fois.
        var it = this.item();
        if (v > 0 && target && target._nomme && heros(this.subject()) && estParole(it) && !balise(it, 'Nomme')) {
            target._nomme = false;
            v = Math.round(v * NOMME);
            annonce(target, '✦ Nommé ×' + String(NOMME).replace('.', ','), '#ffe08a');
        }
        return v;
    };

    //=========================================================================
    // LES LONGUES — annoncées au début du tour, elles partent en dernier
    //=========================================================================
    function tientUneLongue(b) {
        var a = b && b.currentAction && b.currentAction();
        return !!(heros(b) && a && a.isSkill() && estLongue(a.item()));
    }

    var _ordres = BattleManager.makeActionOrders;
    BattleManager.makeActionOrders = function () {
        _ordres.call(this);
        var tete = [], avant = [], fin = [];
        // une Longue part en dernier ; un ennemi à qui on a dit « Pars. » après qu'il a agi, au tour suivant aussi ;
        // un allié <Devant> (relevé, délivré, pressé) part en premier, une fois
        (this._actionBattlers || []).forEach(function (b) {
            var pars = b && b._pars && b._pars === tour();
            if (pars) { b._pars = 0; }
            var devant = b && b._devant && !tientUneLongue(b);
            if (devant) { b._devant = false; }
            (devant ? tete : (tientUneLongue(b) || pars ? fin : avant)).push(b);
        });
        this._actionBattlers = tete.concat(avant, fin);
    };

    var _debutTour = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        _debutTour.call(this);
        $gameParty.battleMembers().forEach(function (a) {
            if (a.isAlive() && tientUneLongue(a)) {
                var it = a.currentAction().item();
                a._paroleLongue = { skillId: it.id, encaisse: 0, brisee: false };
                if (ETAT > 0) { a.clearResult(); a.addState(ETAT); }
                journal('\\C[14]🌀 ' + a.name() + ' commence « ' + it.name + ' »… elle partira en fin de tour.\\C[0]');
            }
        });
    };

    function briser(b, pourquoi) {
        var L = b._paroleLongue;
        L.brisee = true;
        var it = $dataSkills[L.skillId];
        journal('\\C[18]' + b.name() + ' perd le fil (' + pourquoi + ') : « ' + (it ? it.name : '?') + ' » partira à moitié.\\C[0]');
    }
    var _degats = Game_Battler.prototype.onDamage;
    Game_Battler.prototype.onDamage = function (value) {
        _degats.call(this, value);
        var L = this._paroleLongue;
        if (!L || L.brisee || value <= 0 || !enCombat()) { return; }
        L.encaisse += value;
        var max = this.mhp || 1;
        if (value >= max * SEUIL_COUP) { briser(this, 'le coup a porté'); }
        else if (L.encaisse >= max * SEUIL_CUMUL) { briser(this, 'trop encaissé'); }
    };
    var _etat = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        _etat.call(this, stateId);
        var L = this._paroleLongue, st = $dataStates[stateId];
        if (L && !L.brisee && (ETAT <= 0 || stateId !== ETAT) && st && st.restriction >= 1 && this.isStateAffected(stateId)) {
            briser(this, st.name.trim());
        }
    };

    function lacher(b) { if (b && b._paroleLongue) { b._paroleLongue = null; if (ETAT > 0) { b.removeState(ETAT); } } }
    var _finAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        lacher(this._subject);
        _finAction.call(this);
    };
    // Qui n'a pas pu parler (tombé, immobilisé) la lâche en fin de tour.
    var _finTour = BattleManager.endTurn;
    BattleManager.endTurn = function () {
        $gameParty.members().forEach(lacher);
        _finTour.call(this);
    };

    // Le dernier degré ne se redit pas au tour suivant.
    var _conditions = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
        if (!_conditions.call(this, skill)) { return false; }
        var d = this._dernierDit;
        return !(d && enCombat() && skill && skill.id === d.id && tour() === d.tour);
    };

    //=========================================================================
    // À L'ÉCRAN — la phrase, et ce que la Parole ferait avec elle
    //=========================================================================
    function ligneAide(actor, s) {
        if (!estParole(s)) { return ''; }
        var d = degre(s), el = s.damage ? s.damage.elementId : 0, p = phraseActive();
        var longue = estLongue(s) ? ' Longue : part en fin de tour.' : '';
        if (d === 'dernier' && actor && actor._dernierDit && actor._dernierDit.id === s.id && tour() === actor._dernierDit.tour) {
            return '\\C[18]✦ Dite au tour d\'avant : pas deux fois de suite.\\C[0]';
        }
        if (!fondamental(el)) { return longue ? '\\C[6]✦' + longue + '\\C[0]' : ''; }
        if (d === 'double' && p && p.el !== el) { return '\\C[17]✦ Double : ' + nomEl(el) + ' et ' + nomEl(p.el) + ' en suspens.\\C[0]'; }
        if (d === 'fusion' && p && fusionDe(el, p.el)) {
            return '\\C[17]✦ Fusion : avec ' + nomEl(p.el) + ' en suspens → ' + nomEl(fusionDe(el, p.el)) + ' ×' + BONUS_FUSION + '.' + longue + '\\C[0]';
        }
        return '\\C[6]✦ Laisse ' + nomEl(el) + ' en suspens.' + longue + '\\C[0]';
    }
    if (typeof Window_SkillList !== 'undefined') {
        var _aide = Window_SkillList.prototype.updateHelp;
        Window_SkillList.prototype.updateHelp = function () {
            if (_aide) { _aide.call(this); }
            var s = this.item();
            if (!s || !this._helpWindow || !enCombat()) { return; }
            var l = ligneAide(this._actor, s);
            if (!l) { return; }
            var cur = this._helpWindow._text || '';
            this._helpWindow.setText(cur + (cur ? '\n' : '') + l);
        };
    }

    function Window_Phrase() { this.initialize.apply(this, arguments); }
    Window_Phrase.prototype = Object.create(Window_Base.prototype);
    Window_Phrase.prototype.constructor = Window_Phrase;
    Window_Phrase.prototype.initialize = function (x, y, largeur) {
        Window_Base.prototype.initialize.call(this, x, y, largeur || 300, this.fittingHeight(1));   // la ligne se resserre seule (drawText)
        this.opacity = 0; this._cle = null; this.refresh();
    };
    Window_Phrase.prototype.texte = function () {
        var p = phraseActive(), t = p ? '✦ En suspens : ' + nomEl(p.el) + ' (' + p.par + ')' : '';
        var qui = enCombat() ? $gameParty.battleMembers().filter(function (a) { return a._paroleLongue; })
            .map(function (a) { return '🌀 ' + a.name(); }).join(' ') : '';
        return t && qui ? t + ' · ' + qui : (t || qui);
    };
    Window_Phrase.prototype.refresh = function () {
        this.contents.clear();
        var t = this.texte();
        if (!t) { return; }
        this.contents.fontSize = 17;
        this.contents.outlineColor = 'rgba(0,0,0,0.9)';
        this.changeTextColor('#c8d8ff');
        this.drawText(t, 4, 2, this.contentsWidth() - 8, 'left');
        this.resetTextColor();
    };
    Window_Phrase.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        var t = this.texte();
        if (t !== this._cle) { this._cle = t; this.refresh(); }
    };
    var _fenetres = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function () {
        _fenetres.call(this);
        // Sous elle, le Pacte (0) et le livre d'Aël (300) ; à gauche sur sa ligne, la Colère de Vesper (420 px) :
        // la phrase prend la place libre à droite de la Colère, au lieu de s'écrire sur le Pacte.
        var sw = this._statusWindow, co = this._fenetreColere;
        var x = co ? co.x + co.width : 0, y = co ? co.y : (sw ? sw.y - 90 : Graphics.boxHeight - 274);
        this._fenetrePhrase = new Window_Phrase(x, y, Math.max(300, Graphics.boxWidth - x));
        this.addChild(this._fenetrePhrase);
    };

    window.LaParole = {
        phrase: function () { var p = phraseActive(); return p ? { el: p.el, tour: p.tour, par: p.par } : null; },
        poser: function (el, nom) { phrase = el ? { el: el, tour: tour(), par: nom || '?' } : null; },
        degre: degre,
        estParole: estParole,
        estLongue: estLongue,
        fusionDe: fusionDe,
        ligneAide: ligneAide
    };
})();
