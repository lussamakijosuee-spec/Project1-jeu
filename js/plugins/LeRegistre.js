//=============================================================================
// LeRegistre.js
//=============================================================================
/*:
 * @plugindesc v1.0 ■ ludwing, le stratège : les âmes sont sa monnaie. Il les
 * gagne en prenant (un Marqué qui tombe, ses drains), les dépense en outils
 * (invocations, copies choisies, mises). Le Domaine (198) rend tout gratuit.
 * @author pour JOKO
 *
 * @param porteur
 * @text Le porteur
 * @type actor
 * @default 3
 *
 * @param varAmes
 * @text Variable des âmes
 * @type variable
 * @default 15
 *
 * @param === GAGNER ===
 * @default
 *
 * @param etatMarque
 * @text 👁 Marqué
 * @type state
 * @default 213
 *
 * @param bonusMortMarque
 * @text Âmes en plus quand un Marqué tombe
 * @type number
 * @default 2
 *
 * @param gainDrain
 * @text Âmes par drain qui touche (le sien)
 * @type number
 * @default 1
 *
 * @param bonusDrainMarque
 * @text Âmes en plus si le drainé est Marqué
 * @type number
 * @default 1
 *
 * @param === DÉPENSER ===
 * @default
 *
 * @param typeCopies
 * @text Type de compétence « Copies »
 * @type number
 * @default 26
 *
 * @param coutCopie
 * @text Âmes par copie choisie
 * @type number
 * @default 2
 *
 * @param puissanceCopie
 * @text Puissance d'une copie choisie (%)
 * @desc « À sa mesure » (JOKO, 2026-10-19) : ce % de sa compétence de référence, avec
 * l'élément et les effets de la technique volée.
 * @type number
 * @default 50
 *
 * @param referenceCopie
 * @text Compétence de référence des copies
 * @desc Ombre — Nuit (1224, 46 PM).
 * @type skill
 * @default 1224
 *
 * @param roulette
 * @text La Roulette du Destin
 * @type skill
 * @default 14
 *
 * @param miseRoulette
 * @text Mise maximale à la Roulette
 * @desc Chaque âme misée ajoute 1 au seuil de la variable seuilRoulette (1 chance sur 30).
 * @type number
 * @default 5
 *
 * @param evRoulette
 * @text Événement commun de la Roulette
 * @type common_event
 * @default 1
 *
 * @param seuilRoulette
 * @text Variable du seuil de la Roulette
 * @type variable
 * @default 5
 *
 * @param armeOmbre
 * @text L'Arme d'Ombre
 * @type skill
 * @default 111
 *
 * @param miseArme
 * @text Mise maximale à l'Arme d'Ombre
 * @desc Chaque âme misée = un tirage de plus ; il garde le meilleur.
 * @type number
 * @default 3
 *
 * @param evArme
 * @text Événement commun de l'Arme d'Ombre
 * @type common_event
 * @default 22
 *
 * @param tirageArme
 * @text Variable du tirage de l'Arme d'Ombre
 * @type variable
 * @default 41
 *
 * @param === LE DOMAINE ET LE COMPTEUR ===
 * @default
 *
 * @param etatDomaine
 * @text L'état du Domaine
 * @desc Ténèbres Impériales (810). Dedans : copies gratuites et gardées, mises au maximum offertes.
 * @type state
 * @default 198
 *
 * @param etatCompteur
 * @text ✦ Âmes (le compteur)
 * @type state
 * @default 247
 *
 * @param === LE POIDS DES ÂMES ===
 * @default
 *
 * @param bonusParAme
 * @text Dégâts par âme gardée (%)
 * @default 2
 * @desc « absorber d'autres âmes le rend plus puissant, mais leurs traumas viennent avec » (la Bible).
 *
 * @param bonusAmesMax
 * @text Âmes comptées au plus pour les dégâts
 * @default 10
 * @desc 10 : +20 % au plus. Mesuré : à 25 (+50 %), ses âmes montent par centaines et les combats raccourcissaient de 16 %.
 *
 * @param seuilPoids
 * @text Âmes gardées sans poids
 * @default 5
 *
 * @param defenseParAme
 * @text DÉF perdue par âme au-delà (%)
 * @default 3
 *
 * @param poidsMax
 * @text DÉF perdue au plus (%)
 * @default 60
 *
 * @param etatPoids
 * @text 😵 Le poids des âmes
 * @type state
 * @default 259
 *
 * @help
 * ───────────────────────────────────────────────────────────────────────────
 * LE STRATÈGE
 * ───────────────────────────────────────────────────────────────────────────
 *
 * JOKO, le 2026-10-19 : « Piste 1, le Registre : les âmes deviennent sa
 * monnaie, il les gagne en prenant (morts, drains) et les dépense pour tout
 * (invocations, copies choisies, mises, Royaume), un seul Domaine où tout est
 * gratuit. » Et sur le personnage : « comme Megumi ou Shikamaru […] Orochimaru
 * […] beaucoup plus de ruse que les autres. Ou beaucoup plus de stratégie. »
 * Puis : « Oui, écris tout comme listé ».
 *
 * LE POIDS DES ÂMES (le rework, L1, 2026-10-25 ; la Bible : « absorber d'autres
 * âmes le rend plus puissant, mais leurs traumas viennent avec ») — en combat,
 * chaque âme gardée : +2 % à ses dégâts (10 âmes comptées au plus) ; au-delà de
 * 5, chaque âme de plus lui coûte 3 % de DÉF (60 % au plus) — l'état 259, la
 * perte en chiffre — jusqu'à ce qu'il les dépense. Amasser ou dépenser.
 *
 * GAGNER — en plus de ce qui existait (PorteurDAmes : +1 par mort ; LouCopySystem :
 * +1 quand c'est lui qui tue) :
 *   · un ennemi 👁 Marqué qui tombe : +bonusMortMarque — « il paie sa dette » ;
 *   · chacun de SES drains (dégâts « drain PV » d'une compétence qu'il connaît)
 *     qui touche : +gainDrain, et +bonusDrainMarque si la cible est Marquée ;
 *   · un ennemi Marqué qui lance une technique : ludwing la copie aussitôt
 *     (la règle de LouCopySystem — deux fois de suite — reste pour les autres).
 *
 * DÉPENSER :
 *   · invocations (type 8, ouvert sur sa classe) : <Invocation: n>, InvocationAmes ;
 *   · COPIES CHOISIES : la branche `typeCopies` liste ses techniques copiées.
 *     Chacune coûte coutCopie âmes (aucun PM, aucun PT) et se consomme. Elle frappe
 *     « à sa mesure » (JOKO : « Réglage A, à sa mesure : chaque copie frappe 50 %
 *     de son Ombre — Nuit, avec l'élément et les effets de la technique volée ») :
 *     puissanceCopie % de la compétence referenceCopie sur la même cible, comptée
 *     sans élément, puis multipliée par le taux de l'élément de la copie. Ses effets
 *     (états, baisses) sont ceux de la technique. « copie d'Âme » (65) reste au
 *     hasard, gratuite, à la puissance réduite de LouCopySystem ;
 *   · MISES : la Roulette du Destin mise jusqu'à miseRoulette âmes (+1 chance
 *     sur 30 chacune, au premier tirage) ; l'Arme d'Ombre jusqu'à miseArme (un
 *     tirage de plus chacune, le meilleur gardé). Il mise ce qu'il a, jusqu'au
 *     maximum. Les événements ne sont pas touchés : la mise s'ajoute à leur tirage ;
 *   · le Royaume Impérial (71) : une âme par retour (RoyaumeImperial, inchangé).
 *
 * LE DOMAINE — Ténèbres Impériales (810, état etatDomaine) : invocations
 * gratuites (RoyaumeImperial), copies gratuites et gardées, mises au maximum
 * offertes. LouCopySystem est réglé sur le même état.
 *
 * LE COMPTEUR — l'état ✦ Âmes sur ludwing en combat, avec le nombre.
 *
 * Pour un banc : window.Registre.ames() / .copies() / .copier(id) / .reglages().
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('LeRegistre');
    var nb = function (k, d) { var v = P[k]; return (v === undefined || v === '' || isNaN(Number(v))) ? d : Number(v); };
    var PORTEUR = nb('porteur', 3), VAR = nb('varAmes', 15);
    var MARQUE = nb('etatMarque', 213), BONUS_MORT = nb('bonusMortMarque', 2);
    var GAIN_DRAIN = nb('gainDrain', 1), BONUS_DRAIN = nb('bonusDrainMarque', 1);
    var TYPE_COPIES = nb('typeCopies', 26), COUT_COPIE = nb('coutCopie', 2);
    var PUISSANCE_COPIE = nb('puissanceCopie', 50), REFERENCE = nb('referenceCopie', 1224);
    var ROULETTE = nb('roulette', 14), MISE_ROULETTE = nb('miseRoulette', 5), EV_ROULETTE = nb('evRoulette', 1), SEUIL = nb('seuilRoulette', 5);
    var ARME = nb('armeOmbre', 111), MISE_ARME = nb('miseArme', 3), EV_ARME = nb('evArme', 22), TIRAGE = nb('tirageArme', 41);
    var DOMAINE = nb('etatDomaine', 198), COMPTEUR = nb('etatCompteur', 247);
    var PAR_AME = nb('bonusParAme', 2) / 100, AMES_MAX = nb('bonusAmesMax', 10), SEUIL_POIDS = nb('seuilPoids', 5);
    var DEF_PAR_AME = nb('defenseParAme', 3) / 100, POIDS_MAX = nb('poidsMax', 60) / 100, ETAT_POIDS = nb('etatPoids', 259);
    var LOU = PluginManager.parameters('LouCopySystem') || {};
    var MAX_COPIES = parseInt(LOU['maxSlots'] || 4, 10) || 4;

    //=========================================================================
    // OUTILS
    //=========================================================================
    function lui() { return $gameActors ? $gameActors.actor(PORTEUR) : null; }
    function estLui(b) { return !!(b && b.isActor && b.isActor() && b.actorId() === PORTEUR); }
    function enCombat() { return !!($gameParty && $gameParty.inBattle()); }
    function ames() { return $gameVariables ? $gameVariables.value(VAR) : 0; }
    function enDomaine() { var l = lui(); return !!(l && l.isStateAffected(DOMAINE)); }
    function journal(txt) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', txt); w.push('wait'); }
    }
    // Le journal est muet en vue de côté (SimpleMsgSideView) : ce qui doit se voir flotte aussi au-dessus de qui
    // le fait (2026-10-23 ; le journal reste, pour les bancs).
    function annonce(b, texte, couleur) {
        if (b && window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, texte, couleur || '#ffffff'); }
    }
    function ajouter(n, pourquoi) {
        if (!n || !$gameVariables) { return; }
        $gameVariables.setValue(VAR, Math.max(0, ames() + n));
        var l = lui();
        journal('\\C[27]✦ ' + (l ? l.name() : 'ludwing') + (n > 0 ? ' prend ' + n : ' dépense ' + (-n)) + ' âme' + (Math.abs(n) > 1 ? 's' : '')
            + (pourquoi ? ' — ' + pourquoi : '') + ' (' + ames() + ').\\C[0]');
        annonce(l, (n > 0 ? '✦ +' + n : '✦ −' + (-n)) + ' âme' + (Math.abs(n) > 1 ? 's' : '') + ' · ' + ames(), '#c8a0ff');
    }
    function copies() { var l = lui(); return (l && l._louCopiedSkills) || []; }
    /** Une copie, pour lui : une technique de son presse-papier qu'il ne connaît pas par ailleurs. */
    function estCopie(b, s) { return !!(estLui(b) && s && copies().indexOf(s.id) >= 0 && b._skills.indexOf(s.id) < 0); }
    function listeEv(id) { var c = $dataCommonEvents && $dataCommonEvents[id]; return c ? c.list : null; }

    window.Registre = {
        ames: ames,
        bonusAmes: function () { return bonusAmes(); },
        poids: function () { return poids(); },
        copies: function () { return copies().slice(); },
        copier: function (id) { return copier(id, null); },
        domaine: enDomaine,
        reglages: function () {
            return { bonusMortMarque: BONUS_MORT, gainDrain: GAIN_DRAIN, bonusDrainMarque: BONUS_DRAIN, coutCopie: COUT_COPIE,
                     miseRoulette: MISE_ROULETTE, miseArme: MISE_ARME, typeCopies: TYPE_COPIES, etatDomaine: DOMAINE, maxCopies: MAX_COPIES,
                     puissanceCopie: PUISSANCE_COPIE, referenceCopie: REFERENCE };
        }
    };

    //=========================================================================
    // LE COMPTEUR
    //=========================================================================
    function afficher() {
        var l = lui();
        if (!l || !enCombat() || $gameParty.battleMembers().indexOf(l) < 0) { return; }
        if (!l.isAlive()) { return; }
        if (!l.isStateAffected(COMPTEUR)) { l.addNewState(COMPTEUR); l.resetStateCounts(COMPTEUR); }
        if (l.setStateCounter) { l.setStateCounter(COMPTEUR, ames()); }
        peser(l);
        if (BattleManager._statusWindow && BattleManager.refreshStatus) { BattleManager.refreshStatus(); }
    }

    //=========================================================================
    // LE POIDS DES ÂMES — plus fort de ce qu'il garde, plus lourd au-delà
    //=========================================================================
    function bonusAmes() { return window.Registre && Registre._sansPoids ? 1 : 1 + PAR_AME * Math.min(Math.max(0, ames()), AMES_MAX); }
    function poids() { return window.Registre && Registre._sansPoids ? 0 : Math.min(POIDS_MAX, DEF_PAR_AME * Math.max(0, ames() - SEUIL_POIDS)); }
    function peser(l) {
        if (!$dataStates[ETAT_POIDS]) { return; }
        var p = Math.round(poids() * 100), avant = l._poidsAmes || 0;
        if (p > 0) {
            if (!l.isStateAffected(ETAT_POIDS)) { l.addNewState(ETAT_POIDS); l.resetStateCounts(ETAT_POIDS); }
            if (l.setStateCounter) { l.setStateCounter(ETAT_POIDS, '-' + p + '%'); }
        } else if (l.isStateAffected(ETAT_POIDS)) { l.eraseState(ETAT_POIDS); }
        if (p !== avant) {
            if (p > avant) { annonce(l, '😵 Le poids des âmes · DÉF −' + p + ' %', '#b8a0e0'); }
            else if (avant > 0) { annonce(l, p > 0 ? '✦ Plus léger · DÉF −' + p + ' %' : '✦ Plus léger', '#c8a0ff'); }
        }
        l._poidsAmes = p;
    }
    var _taux = Game_BattlerBase.prototype.paramRate;
    Game_BattlerBase.prototype.paramRate = function (paramId) {
        var r = _taux.call(this, paramId);
        if (paramId === 3 && estLui(this) && enCombat()) { r *= 1 - poids(); }
        return r;
    };
    var _valeur = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function (variableId, value) {
        _valeur.call(this, variableId, value);
        if (variableId === VAR) { try { afficher(); } catch (e) { } }
    };
    var _debut = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _debut.call(this);
        if ($gameTemp) { $gameTemp._registreMise = null; }
        afficher();
    };
    var _finAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        if (this._subject) { this._subject._registreCopie = 0; }       // la copie collée ne vaut que pour son action
        _finAction.call(this);
        try { afficher(); } catch (e) { }
    };

    //=========================================================================
    // GAGNER
    //=========================================================================
    // Un Marqué qui tombe paie sa dette. (Les morts clairent les états : on regarde AVANT.)
    var _degats = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        // ⚠ [2026-10-22] YEP rend la cible immortelle pendant l'action : à 0 PV, elle est tombée (PorteurDAmes).
        var marque = !!(target && target.isEnemy && target.isEnemy() && target.isAlive() && target.hp > 0 && target.isStateAffected(MARQUE));
        _degats.call(this, target, value);
        var u = this.subject();
        var tombe = target.isDead() || (target.hp <= 0 && !!target.isImmortal && target.isImmortal());
        if (marque && tombe && enCombat() && u && u.isActor && u.isActor()) {
            ajouter(BONUS_MORT, target.name() + ' était Marqué, il paie sa dette');
        }
    };

    // Ses drains rapportent ; un Marqué drainé rapporte plus.
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        var u = this.subject(), it = this.item();
        var drain = !!(estLui(u) && this.isSkill() && it && it.damage && it.damage.type === 5 && u._skills.indexOf(it.id) >= 0
            && target && target.isEnemy && target.isEnemy());
        var marque = drain && target.isStateAffected(MARQUE);
        _apply.call(this, target);
        if (!drain || this._registreDrain || !enCombat()) { return; }
        var r = target.result();
        if (r.isHit() && r.hpDamage > 0) {
            this._registreDrain = true;
            ajouter(GAIN_DRAIN + (marque ? BONUS_DRAIN : 0), marque ? 'il draine un Marqué' : 'il draine');
        }
    };

    // Un Marqué se laisse copier dès sa première technique.
    function copier(id, qui) {
        var l = lui(), s = $dataSkills[id];
        if (!l || !s) { return false; }
        var slots = l._louCopiedSkills || (l._louCopiedSkills = []);
        if (slots.indexOf(id) >= 0) { return false; }
        slots.push(id);
        if (slots.length > MAX_COPIES) { slots.shift(); }
        journal('\\C[27]✦ ' + l.name() + ' copie « ' + s.name + ' »' + (qui ? ' — ' + qui + ' était Marqué' : '')
            + ' (' + slots.length + '/' + MAX_COPIES + ').\\C[0]');
        annonce(l, '✦ Copié : ' + s.name, '#c8a0ff');
        return true;
    }
    var _commence = BattleManager.startAction;
    BattleManager.startAction = function () {
        var su = this._subject, act = su && su.currentAction ? su.currentAction() : null;
        try {
            if (su && su.isEnemy && su.isEnemy() && su.isStateAffected(MARQUE) && act && act.isSkill() && act.item()
                && act.item().id !== su.attackSkillId() && act.item().id !== su.guardSkillId()
                && lui() && $gameParty.battleMembers().indexOf(lui()) >= 0) {
                copier(act.item().id, su.name());
            }
        } catch (e) { }
        _commence.call(this);
    };

    //=========================================================================
    // DÉPENSER — les copies choisies
    //=========================================================================
    var _types = Game_Actor.prototype.addedSkillTypes;
    Game_Actor.prototype.addedSkillTypes = function () {
        var t = _types.call(this);
        if (estLui(this) && enCombat() && copies().length && t.indexOf(TYPE_COPIES) < 0) { t = t.concat([TYPE_COPIES]); }
        return t;
    };
    var _competences = Game_Actor.prototype.skills;
    Game_Actor.prototype.skills = function () {
        var liste = _competences.call(this);
        if (estLui(this) && enCombat()) {
            copies().forEach(function (id) { var s = $dataSkills[id]; if (s && liste.indexOf(s) < 0) { liste.push(s); } });
        }
        return liste;
    };
    // Dans la branche Copies, et nulle part ailleurs.
    var _inclut = Window_SkillList.prototype.includes;
    Window_SkillList.prototype.includes = function (item) {
        if (this._actor && estCopie(this._actor, item)) { return this._stypeId === TYPE_COPIES; }
        return _inclut.call(this, item);
    };
    // Une copie se paie en âmes, pas en PM ni en PT.
    ['skillMpCost', 'skillTpCost', 'skillHpCost'].forEach(function (f) {
        var avant = Game_BattlerBase.prototype[f];
        if (!avant) { return; }
        Game_BattlerBase.prototype[f] = function (skill) {
            if (estCopie(this, skill)) { return 0; }
            return avant.apply(this, arguments);
        };
    });
    var _conditions = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
        // Dans le Domaine, une invocation ne se grise plus faute d'âmes : RoyaumeImperial
        // l'annonçait (« jamais grisées ») mais InvocationAmes vérifie le stock avant lui.
        // Le temps de la vérification, le stock vaut au moins le prix — écrit sans les
        // crochets de setValue, et rendu aussitôt.
        var prix = skill && skill.meta && skill.meta.Invocation ? (parseInt(skill.meta.Invocation, 10) || 0) : 0;
        var libre = prix > 0 && this.isActor && this.isActor() && this.isStateAffected(DOMAINE) && $gameVariables && $gameVariables._data;
        var stock = libre ? $gameVariables._data[VAR] : 0;
        if (libre && (stock || 0) < prix) { $gameVariables._data[VAR] = prix; }
        var ok;
        try { ok = _conditions.call(this, skill); } finally { if (libre) { $gameVariables._data[VAR] = stock; } }
        if (!ok) { return false; }
        if (estCopie(this, skill)) { return enCombat() && (enDomaine() || ames() >= COUT_COPIE); }
        return true;
    };
    // Une copie collée par le menu : il paie, elle frappe moins fort, elle se consomme.
    var _paie = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function (skill) {
        var copie = estCopie(this, skill);
        _paie.call(this, skill);
        if (copie) {
            var dom = enDomaine();
            this._registreCopie = skill.id;            // « à sa mesure » : voir makeDamageValue plus bas
            if (!dom) {
                var slots = this._louCopiedSkills, i = slots.indexOf(skill.id);
                if (i >= 0) { slots.splice(i, 1); }
                ajouter(-COUT_COPIE, 'il colle « ' + skill.name + ' » (copie consommée)');
            } else {
                journal('\\C[27]✦ ' + this.name() + ' colle « ' + skill.name + ' » — Domaine : gratuite, gardée.\\C[0]');
                annonce(this, '✦ Domaine : copie offerte', '#c8a0ff');
            }
            return;
        }
        if (!estLui(this) || !skill) { return; }
        if (skill.id === ROULETTE) { miser(MISE_ROULETTE, 'roulette', 'chacune ajoute une chance'); }
        else if (skill.id === ARME) { miser(MISE_ARME, 'arme', 'un tirage de plus chacune'); }
    };

    //=========================================================================
    // LA COPIE COLLÉE — « à sa mesure »
    //=========================================================================
    // La technique volée garde son élément, ses effets, sa portée ; sa force, c'est
    // puissanceCopie % de SA compétence de référence sur la même cible, comptée
    // sans élément (une cible insensible à l'ombre ne rend pas la copie nulle).
    var _valeurDegats = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var u = this.subject(), it = this.item();
        var mesure = !!(u && u._registreCopie && it && this.isSkill() && u._registreCopie === it.id
            && it.damage && (it.damage.type === 1 || it.damage.type === 5) && $dataSkills[REFERENCE]);
        if (!mesure) { return _valeurDegats.call(this, target, critical); }
        var ref = new Game_Action(u); ref.setSkill(REFERENCE);
        ref.calcElementRate = function () { return 1; };
        var base = _valeurDegats.call(ref, target, critical);
        return Math.round(base * PUISSANCE_COPIE / 100 * this.calcElementRate(target));
    };

    //=========================================================================
    // DÉPENSER — les mises
    //=========================================================================
    function miser(max, quoi, sens) {
        if (!$gameTemp) { return; }
        var dom = enDomaine(), n = dom ? max : Math.min(max, ames());
        $gameTemp._registreMise = null;
        if (n <= 0) { return; }
        $gameTemp._registreMise = { quoi: quoi, n: n };
        if (dom) { journal('\\C[27]✦ Domaine : ' + n + ' âmes misées, offertes (' + sens + ').\\C[0]'); }
        else { ajouter(-n, 'mise : ' + sens); }
        if (dom) { annonce(lui(), '✦ Domaine : ' + n + ' âmes offertes', '#c8a0ff'); }
    }
    // Ses dégâts, de tout ce qu'il garde (le poids des âmes)
    var _degatsAmes = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _degatsAmes.call(this, target, critical), u = this.subject();
        if (v > 0 && estLui(u) && enCombat() && !this.isRecover()) {
            var k = bonusAmes();
            if (k > 1) {
                v = Math.round(v * k);
                if (!this._amesVues && k >= 1.04) { this._amesVues = true; annonce(u, '✦ Âmes ×' + String(Math.round(k * 100) / 100).replace('.', ','), '#c8a0ff'); }
            }
        }
        return v;
    };

    // La mise s'ajoute au tirage de l'événement, au moment où il le fait.
    var _variables = Game_Interpreter.prototype.command122;
    Game_Interpreter.prototype.command122 = function () {
        var r = _variables.call(this);
        var m = $gameTemp && $gameTemp._registreMise, p = this._params;
        if (!m || !p) { return r; }
        if (m.quoi === 'roulette' && this._list === listeEv(EV_ROULETTE) && p[0] === SEUIL && p[1] === SEUIL && p[2] === 0) {
            $gameTemp._registreMise = null;
            $gameVariables.setValue(SEUIL, $gameVariables.value(SEUIL) + m.n);
        } else if (m.quoi === 'arme' && this._list === listeEv(EV_ARME) && p[0] === TIRAGE && p[1] === TIRAGE && p[2] === 0 && p[3] === 2) {
            $gameTemp._registreMise = null;
            var v = $gameVariables.value(TIRAGE), mini = p[4], ecart = p[5] - p[4] + 1;
            for (var i = 0; i < m.n; i++) { v = Math.max(v, mini + Math.randomInt(ecart)); }
            $gameVariables.setValue(TIRAGE, v);
        }
        return r;
    };
})();
