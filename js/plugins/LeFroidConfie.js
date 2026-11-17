//=============================================================================
// LeFroidConfie.js
//=============================================================================
/*:
 * @plugindesc v1.2 ■ Korrah joue deux corps : l'Hiver qu'elle lance, elle le
 * CONFIE à seiryu, qui le dépense pour soigner, couvrir et engourdir plus
 * fort. Tombé chargé, le froid revient sur elle. Et « Change » prend la place.
 * v1.1-1.2 : ses capacités de base parlent à seiryu.
 * @author pour JOKO
 *
 * @param acteurPorteuse
 * @text La porteuse
 * @type actor
 * @default 2
 *
 * @param acteurFamilier
 * @text Le familier
 * @type actor
 * @default 6
 *
 * @param typeHiver
 * @text Type de compétence de l'Hiver
 * @type number
 * @default 6
 *
 * @param === LA JAUGE ===
 * @default
 *
 * @param froidParPM
 * @text Froid confié par PM payé
 * @desc 1 = Glace — Givre (10 PM) confie 10, Glace — Hiver (62 PM) confie 62.
 * @default 1
 *
 * @param plafond
 * @text Plafond de la jauge
 * @type number
 * @default 100
 *
 * @param charge
 * @text Froid pris par chaque action de seiryu
 * @desc Il ne charge une action que s'il a au moins ça.
 * @type number
 * @default 25
 *
 * @param === CE QU'IL EN FAIT ===
 * @default
 *
 * @param bonusSoin
 * @text Soins chargés (multiplicateur)
 * @desc JOKO, 2026-10-19 : ×1,25 (au lieu de ×1,5).
 * @default 1.25
 *
 * @param bonusCoup
 * @text Coups chargés (multiplicateur)
 * @desc Ils deviennent aussi de glace et engourdissent à coup sûr.
 * @default 1.5
 *
 * @param gardes
 * @text Ses gardes
 * @desc Les compétences de garde de seiryu, séparées par des virgules.
 * Chargées : +toursGarde tours, et le froid mord qui frappe le protégé.
 * @default 1261, 1262, 1252, 471
 *
 * @param toursGarde
 * @text Tours de garde en plus
 * @type number
 * @default 1
 *
 * @param rendsLe
 * @text « Ce Que Le Froid Garde » (ce que seiryu rend)
 * @type skill
 * @default 1254
 *
 * @param ordreRendsLe
 * @text L'ordre « Avatar — Rends-le »
 * @desc Sur cet ordre, seiryu vide TOUTE la jauge.
 * @type skill
 * @default 1258
 *
 * @param diviseurRendsLe
 * @text Rends-le : dégâts × (1 + froid ÷ ce nombre)
 * @desc 50 = jusqu'à ×3 avec la jauge pleine.
 * @default 50
 *
 * @param seuilGelure
 * @text Rends-le : Gelure à coup sûr dès ce froid
 * @type number
 * @default 50
 *
 * @param === LE FROID QUI REVIENT ===
 * @default
 *
 * @param seuilSaisie
 * @text Froid perdu à partir duquel elle perd un tour
 * @desc En dessous, elle s'engourdit seulement.
 * @type number
 * @default 60
 *
 * @param === CHANGE ===
 * @default
 *
 * @param competenceChange
 * @text La compétence « Change »
 * @type skill
 * @default 438
 *
 * @param toursPlace
 * @text Tours où elle prend les coups à sa place
 * @type number
 * @default 3
 *
 * @param === SES CAPACITÉS (v1.1) ===
 * @default
 *
 * @param bonusEngourdi
 * @text <SurEngourdi> : dégâts en plus sur un engourdi (%)
 * @type number
 * @default 50
 *
 * @param toursAPlace
 * @text <APlace> : tours où elle prend sa place
 * @desc 2 = jusqu'à la fin du tour suivant (Change en donne toursPlace).
 * @type number
 * @default 2
 *
 * @param === LES ÉTATS ===
 * @default
 *
 * @param etatJauge
 * @text ❄ Froid confié (sur seiryu)
 * @type state
 * @default 243
 *
 * @param etatSaisie
 * @text ❄ Saisie par le froid
 * @type state
 * @default 244
 *
 * @param etatPlace
 * @text 🔄 À sa place
 * @type state
 * @default 245
 *
 * @param etatMord
 * @text ❄ Le froid mord
 * @type state
 * @default 246
 *
 * @param etatEngourdi
 * @text ❄ Engourdissement
 * @type state
 * @default 211
 *
 * @param etatGelure
 * @text Gelure
 * @type state
 * @default 94
 *
 * @param elementGlace
 * @text Élément de glace
 * @type number
 * @default 13
 *
 * @help
 * ───────────────────────────────────────────────────────────────────────────
 * DEUX CORPS, UN SEUL FROID
 * ───────────────────────────────────────────────────────────────────────────
 *
 * JOKO, le 2026-10-19 : « Piste 1, le froid confié : Korrah joue deux corps
 * avec seiryu, ses sorts d'Hiver chargent seiryu, et « change » devient
 * l'échange de place. » Puis : « Oui, écris tout comme listé ».
 *
 * Et ce qu'il avait dit de seiryu (SeiryuLeFamilier) : « l'esprit qui fait pas
 * beaucoup de dégâts, mais qui est utile pour la protection et pour les
 * soins ». Le froid le rend meilleur à ça — pas plus meurtrier.
 *
 * LA JAUGE — sur seiryu, de 0 à `plafond`, affichée par l'état ❄ Froid confié
 * et son compteur. Chaque compétence d'Hiver de Korrah (type `typeHiver`) lui
 * confie autant de froid que de PM payés. Chaque combat repart de zéro.
 *
 * CE QU'IL EN FAIT — il décide toujours seul (SeiryuLeFamilier). Chacune de
 * ses actions, ordres compris, prend `charge` de froid s'il en a assez :
 *   · un soin          → × bonusSoin ;
 *   · une garde        → +toursGarde tours, et ❄ Le froid mord : qui frappe
 *                        le protégé s'engourdit ;
 *   · un coup          → de glace, × bonusCoup, et ❄ Engourdissement à coup sûr ;
 *   · sur l'ordre « Rends-le », « Ce Que Le Froid Garde » vide TOUTE la jauge :
 *     dégâts × (1 + froid ÷ diviseurRendsLe), Gelure à coup sûr dès
 *     seuilGelure, Engourdissement sur tous avec la jauge pleine.
 *
 * LE FROID QUI REVIENT — seiryu tombe sous un coup avec du froid : il revient
 * sur Korrah. ❄ Engourdissement ; et dès `seuilSaisie`, ❄ Saisie par le
 * froid : elle perd UN tour (le tour en cours si elle n'a pas encore joué,
 * sinon le suivant). Éteint AVEC elle, le froid se perd, rien ne revient.
 *
 * LE FROID RENDU — une compétence avec <FroidConfie: N> demande N de froid
 * (Le Froid Rendu, 800 : la jauge pleine) et le prend en la lançant.
 *
 * CHANGE — visée sur un allié (seiryu compris), Korrah :
 *   1. prend sa place dans le groupe — à l'écran, elles échangent leur
 *      position (avec seiryu, rien ne bouge : il flotte derrière elle). L'ordre
 *      du groupe est rendu à la fin du combat ;
 *   2. lui reprend ce que les ENNEMIS lui ont posé (états et baisses) —
 *      « et ce qui allait avec » ; pas ce que ses alliés ou lui-même ont posé ;
 *   3. pendant `toursPlace` tours, tout coup ennemi qui le vise la frappe, elle.
 *
 * SES CAPACITÉS (v1.1) — JOKO, le 2026-10-20 : « Oui, écris les 10 capacités de
 * Korrah comme listé : seiryu suit le coup, +50 % sur l'engourdi, seiryu en
 * profite aussi, Ralentir confie son froid, Elle Prend Ta Place prend sa place. »
 * Cinq balises, sur les capacités de Korrah :
 *   <SeiryuSuit>   quand son action est finie, si seiryu est là avec au moins
 *                  `charge` de froid, il frappe la même cible : son coup chargé
 *                  (glace, × bonusCoup, engourdit), qui prend `charge` de froid.
 *                  Ça ne lui coûte pas son tour.
 *   <SurEngourdi>  + bonusEngourdi % de dégâts sur un ennemi ❄ engourdi.
 *   <ADeux>        ce qu'elle se donne à elle-même, seiryu l'a aussi.
 *   <ConfieFroid>  confie son coût en PM en froid à seiryu, comme l'Hiver.
 *   <APlace>       sur un allié : elle prend sa place `toursAPlace` tours — les
 *                  coups ennemis ciblés sur lui la frappent (🔄 À sa place),
 *                  sans échanger de rang ni reprendre ses états (ça, c'est Change).
 *   <ReprendFroid> (v1.2, JOKO 2026-10-20 : « elle reprend du froid pour
 *                  engourdir ») si seiryu a au moins `charge` de froid, elle le
 *                  lui reprend (une fois par action) : ce que le coup touche
 *                  s'engourdit à coup sûr. Pas de dégâts en plus.
 *
 * Pour un banc : window.FroidConfie.jauge() / .poser(n) / .reglages().
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('LeFroidConfie');
    var nb = function (k, d) { var v = P[k]; return (v === undefined || v === '' || isNaN(Number(v))) ? d : Number(v); };
    var PORTEUSE = nb('acteurPorteuse', 2), FAMILIER = nb('acteurFamilier', 6), TYPE_HIVER = nb('typeHiver', 6);
    var PAR_PM = nb('froidParPM', 1), PLAFOND = nb('plafond', 100), CHARGE = nb('charge', 25);
    var BONUS_SOIN = nb('bonusSoin', 1.25), BONUS_COUP = nb('bonusCoup', 1.5), TOURS_GARDE = nb('toursGarde', 1);
    var GARDES = String(P['gardes'] === undefined || P['gardes'] === '' ? '1261, 1262, 1252, 471' : P['gardes'])
        .split(',').map(function (x) { return parseInt(x, 10); }).filter(function (x) { return x > 0; });
    var RENDS_LE = nb('rendsLe', 1254), ORDRE_RENDS_LE = nb('ordreRendsLe', 1258);
    var DIVISEUR = Math.max(1, nb('diviseurRendsLe', 50)), SEUIL_GELURE = nb('seuilGelure', 50);
    var SEUIL_SAISIE = nb('seuilSaisie', 60);
    var CHANGE = nb('competenceChange', 438), TOURS_PLACE = nb('toursPlace', 3);
    var ETAT_JAUGE = nb('etatJauge', 243), ETAT_SAISIE = nb('etatSaisie', 244), ETAT_PLACE = nb('etatPlace', 245);
    var ETAT_MORD = nb('etatMord', 246), ETAT_ENGOURDI = nb('etatEngourdi', 211), ETAT_GELURE = nb('etatGelure', 94);
    var GLACE = nb('elementGlace', 13);
    var BONUS_ENGOURDI = nb('bonusEngourdi', 50), TOURS_A_PLACE = nb('toursAPlace', 2);

    //=========================================================================
    // OUTILS
    //=========================================================================
    function lui() { return $gameActors ? $gameActors.actor(FAMILIER) : null; }
    function elle() {
        if (!$gameParty) { return null; }
        return $gameParty.members().filter(function (a) { return a.actorId() === PORTEUSE; })[0] || null;
    }
    function estActeur(b, id) { return !!(b && b.isActor && b.isActor() && b.actorId() === id); }
    function enCombat() { return !!($gameParty && $gameParty.inBattle()); }
    function tour() { return $gameTroop ? $gameTroop.turnCount() : 0; }
    /** seiryu est là pour recevoir le froid : entré au combat, et debout. */
    function laPourElle() {
        var s = lui();
        return !!(s && enCombat() && s.isAlive() && window.Seiryu && window.Seiryu.present());
    }
    function journal(txt) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', txt); w.push('wait'); }
    }
    // Le journal est muet en vue de côté (SimpleMsgSideView ne garde aucune ligne) : ce qui doit se voir
    // flotte aussi au-dessus de qui le fait (2026-10-23 ; le journal reste, pour les bancs).
    function annonce(b, texte, couleur) {
        if (b && window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, texte, couleur || '#9ad0ff'); }
    }
    function coutFroid(skill) {
        var m = skill && skill.meta && skill.meta.FroidConfie;
        if (m === undefined || m === true) { return 0; }
        return Math.max(0, parseInt(String(m).trim(), 10) || 0);
    }
    function estSoin(it) { return !!(it && it.damage && (it.damage.type === 3) && it.scope >= 7 && it.scope <= 11); }
    function estCoup(it) { return !!(it && it.damage && it.damage.type === 1 && it.scope >= 1 && it.scope <= 6); }
    function estGarde(it) { return !!(it && GARDES.indexOf(it.id) >= 0); }

    //=========================================================================
    // LA JAUGE
    //=========================================================================
    function jauge() { var s = lui(); return s ? (s._froidConfie || 0) : 0; }
    /** Pose la jauge, et ce que le joueur en voit : l'état et son compteur. */
    function poser(n) {
        var s = lui(); if (!s) { return 0; }
        n = Math.max(0, Math.min(PLAFOND, Math.floor(n || 0)));
        s._froidConfie = n;
        if (n > 0 && s.isAlive()) {
            // un état d'affichage : posé sans passer par le résultat du coup
            if (!s.isStateAffected(ETAT_JAUGE)) { s.addNewState(ETAT_JAUGE); s.resetStateCounts(ETAT_JAUGE); }
            if (s.setStateCounter) { s.setStateCounter(ETAT_JAUGE, n); }
        } else if (s.isStateAffected(ETAT_JAUGE)) {
            s.eraseState(ETAT_JAUGE);
            if (s.removeStateCounter) { s.removeStateCounter(ETAT_JAUGE); }
        }
        if (enCombat() && BattleManager.refreshStatus) { BattleManager.refreshStatus(); }
        return n;
    }

    window.FroidConfie = {
        jauge: jauge,
        poser: poser,
        reglages: function () {
            return { froidParPM: PAR_PM, plafond: PLAFOND, charge: CHARGE, bonusSoin: BONUS_SOIN, bonusCoup: BONUS_COUP,
                     gardes: GARDES.slice(), toursGarde: TOURS_GARDE, diviseurRendsLe: DIVISEUR, seuilGelure: SEUIL_GELURE,
                     seuilSaisie: SEUIL_SAISIE, toursPlace: TOURS_PLACE, bonusEngourdi: BONUS_ENGOURDI, toursAPlace: TOURS_A_PLACE };
        }
    };

    // Chaque combat repart de zéro.
    var _setup = BattleManager.setup;
    BattleManager.setup = function (troopId, canEscape, canLose) {
        _setup.call(this, troopId, canEscape, canLose);
        var s = lui();
        if (s) { s._froidConfie = 0; s._froidToutRendre = null; if (s.isStateAffected(ETAT_JAUGE)) { s.eraseState(ETAT_JAUGE); } }
        $gameParty._froidOrdre = null;
    };

    //=========================================================================
    // KORRAH CONFIE — et Le Froid Rendu demande la jauge
    //=========================================================================
    var _paie = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function (skill) {
        var sienne = estActeur(this, PORTEUSE) && enCombat() && skill && (skill.stypeId === TYPE_HIVER || balise(skill, 'ConfieFroid'));
        var pm = sienne ? this.skillMpCost(skill) : 0;
        _paie.call(this, skill);
        if (!sienne) { return; }
        var exige = coutFroid(skill);
        if (exige > 0) {
            poser(jauge() - exige);
            journal('\\C[23]❄ ' + (lui() ? lui().name() : 'seiryu') + ' lui rend tout le froid confié.\\C[0]');
            annonce(this, '❄ Tout le froid rendu · ' + exige);
        }
        var gain = Math.floor(pm * PAR_PM);
        if (gain > 0 && laPourElle()) {
            var avant = jauge(), apres = poser(avant + gain);
            if (apres > avant) {
                journal('\\C[23]❄ ' + this.name() + ' confie ' + (apres - avant) + ' de froid à ' + lui().name()
                    + ' (' + apres + '/' + PLAFOND + ').\\C[0]');
                annonce(lui(), '❄ Confié +' + (apres - avant) + ' · ' + apres + '/' + PLAFOND);
            }
        }
    };

    var _conditions = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
        if (!_conditions.call(this, skill)) { return false; }
        var exige = coutFroid(skill);
        if (exige > 0 && estActeur(this, PORTEUSE)) { return laPourElle() && jauge() >= exige; }
        return true;
    };

    //=========================================================================
    // SEIRYU DÉPENSE — décidé au premier coup de chaque action
    //=========================================================================
    function decider(action) {
        action._froidCharge = 0;
        var s = lui(), it = action.item(), n = jauge();
        if (!s || !it || n <= 0) { return; }
        // « Rends-le » : sur l'ordre de Korrah, tout part
        if (it.id === RENDS_LE && s._froidToutRendre === tour()) {
            s._froidToutRendre = null;
            action._froidCharge = n; action._froidTout = true;
            poser(0);
            journal('\\C[23]❄ ' + s.name() + ' rend tout le froid confié (' + n + ').\\C[0]');
            annonce(s, '❄ Rends-le · tout le froid (' + n + ')');
            return;
        }
        if (n < CHARGE || !(estSoin(it) || estGarde(it) || estCoup(it))) { return; }
        action._froidCharge = CHARGE;
        poser(n - CHARGE);
        journal('\\C[23]❄ ' + s.name() + ' dépense ' + CHARGE + ' de froid (' + jauge() + '/' + PLAFOND + ').\\C[0]');
        annonce(s, '❄ Chargé · ' + jauge() + '/' + PLAFOND);
    }

    // Les coups chargés sont de glace — pour les dégâts (YEP_ElementCore)
    // comme pour la brisure des boucliers (AstfglSCB lit getItemElements).
    var _elements = Game_Action.prototype.getItemElements;
    if (_elements) {
        Game_Action.prototype.getItemElements = function () {
            if (this._froidCharge && estCoup(this.item())) { return [GLACE]; }
            return _elements.call(this);
        };
    }
    var _taux = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function (target) {
        if (this._froidCharge && estCoup(this.item()) && !_elements) { return target.elementRate(GLACE); }
        return _taux.call(this, target);
    };

    var _valeur = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _valeur.call(this, target, critical);
        var c = this._froidCharge, it = this.item();
        if (!c || !it) { return v; }
        if (this._froidTout) { return Math.round(v * (1 + c / DIVISEUR)); }
        if (estSoin(it)) { return Math.round(v * BONUS_SOIN); }
        if (estCoup(it)) { return Math.round(v * BONUS_COUP); }
        return v;
    };

    /** Une garde chargée dure plus, et le froid mord qui frappe là. */
    function allonger(target, it) {
        var duree = 0;
        it.effects.forEach(function (e) {
            if (e.code !== Game_Action.EFFECT_ADD_STATE || !target.isStateAffected(e.dataId)) { return; }
            target._stateTurns[e.dataId] = (target._stateTurns[e.dataId] || 0) + TOURS_GARDE;
            duree = Math.max(duree, target._stateTurns[e.dataId]);
        });
        if (!duree) { duree = TOURS_GARDE; }        // « Torse Gardien » : il se tient, rien d'autre
        target.addState(ETAT_MORD);
        if (target.isStateAffected(ETAT_MORD)) { target._stateTurns[ETAT_MORD] = duree; }
    }

    //=========================================================================
    // LE FROID REVIENT — seiryu tombe sous un coup, chargé
    //=========================================================================
    function rendreAElle(froid) {
        var k = elle();
        if (!k || !k.isAlive()) { return; }
        k.addState(ETAT_ENGOURDI);
        var saisie = froid >= SEUIL_SAISIE;
        if (saisie) {
            // un seul tour perdu : celui-ci si elle n'a pas encore joué, sinon le suivant
            var joue = !!(BattleManager._performedBattlers && BattleManager._performedBattlers.indexOf(k) >= 0);
            k.addState(ETAT_SAISIE);
            if (k.isStateAffected(ETAT_SAISIE)) { k._stateTurns[ETAT_SAISIE] = joue ? 2 : 1; }
        }
        journal('\\C[8]❄ Le froid confié revient sur ' + k.name() + ' (' + froid + ')'
            + (saisie ? ' — elle ne bouge plus.' : '.') + '\\C[0]');
        annonce(k, saisie ? '❄ Le froid revient · Saisie !' : '❄ Le froid revient · ' + froid, saisie ? '#ff8080' : '#9ad0ff');
    }

    var _ajoute = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        var sien = estActeur(this, FAMILIER), vivant = sien && this.isAlive();
        var eteint = sien && !!this._seiryuSEteint;
        _ajoute.call(this, stateId);
        if (!vivant || !this.isDead() || !enCombat()) { return; }
        var froid = this._froidConfie || 0;
        this._froidConfie = 0;
        this._froidToutRendre = null;
        if (!eteint && froid > 0) { rendreAElle(froid); }
    };

    //=========================================================================
    // CHANGE — elle prend sa place, et ce qui allait avec
    //=========================================================================
    // Ce que les ENNEMIS ont posé sur chacun : c'est ça, « ce qui allait avec ».
    function noterLesCoups(action, target) {
        var u = action.subject();
        if (!u || !u.isEnemy || !u.isEnemy() || !target || !target.isActor || !target.isActor()) { return; }
        var r = target.result();
        target._froidSubis = target._froidSubis || { etats: {}, baisses: {} };
        (r.addedStates || []).forEach(function (id) { target._froidSubis.etats[id] = true; });
        (r.addedDebuffs || []).forEach(function (p) { target._froidSubis.baisses[p] = true; });
    }

    function reprendreLeFardeau(k, x) {
        var subis = x._froidSubis || { etats: {}, baisses: {} }, n = 0;
        x._states.slice().forEach(function (id) {
            if (!subis.etats[id] || id === x.deathStateId()) { return; }
            var tours = x._stateTurns[id];
            k.addState(id);
            if (k.isStateAffected(id)) {
                k._stateTurns[id] = tours;
                k._froidSubis = k._froidSubis || { etats: {}, baisses: {} };
                k._froidSubis.etats[id] = true;
            }
            x.removeState(id);
            n++;
        });
        for (var p = 0; p < 8; p++) {
            if (!subis.baisses[p] || !(x._buffs[p] < 0)) { continue; }
            var niveaux = -x._buffs[p], duree = x._buffTurns[p];
            for (var i = 0; i < niveaux; i++) { k.addDebuff(p, duree); }
            k._froidSubis = k._froidSubis || { etats: {}, baisses: {} };
            k._froidSubis.baisses[p] = true;
            x.eraseBuff(p);
            n++;
        }
        x._froidSubis = { etats: {}, baisses: {} };
        k.refresh(); x.refresh();
        return n;
    }

    function changer(k, x) {
        if (!x || x === k || !x.isAlive()) { return; }
        if (!estActeur(x, FAMILIER)) {
            var acs = $gameParty._actors, i = acs.indexOf(k.actorId()), j = acs.indexOf(x.actorId());
            if (i >= 0 && j >= 0) {
                if (!$gameParty._froidOrdre) {
                    $gameParty._froidOrdre = acs.filter(function (id) { return id !== FAMILIER; });
                }
                acs[i] = x.actorId(); acs[j] = k.actorId();
            }
        }
        var repris = reprendreLeFardeau(k, x);
        // elle ne tient qu'une place à la fois
        $gameParty.members().forEach(function (m) { if (m !== x && m.isStateAffected(ETAT_PLACE)) { m.eraseState(ETAT_PLACE); } });
        x.addState(ETAT_PLACE);
        if (x.isStateAffected(ETAT_PLACE)) { x._stateTurns[ETAT_PLACE] = TOURS_PLACE; }
        journal('\\C[23]🔄 Change — ' + k.name() + ' prend la place de ' + x.name()
            + (repris ? ', et ce qui allait avec.' : '.') + '\\C[0]');
        annonce(k, '🔄 À la place de ' + x.name(), '#b8e0ff');
        if (repris) { annonce(x, '🔄 Délivré', '#b8e0ff'); }
        if (BattleManager.refreshStatus) { BattleManager.refreshStatus(); }
    }

    // Tout coup ennemi CIBLÉ sur l'allié dont elle a pris la place la frappe, elle.
    var _substitut = BattleManager.applySubstitute;
    BattleManager.applySubstitute = function (target) {
        var k = elle(), act = this._action;
        if (target && target.isActor && target.isActor() && target.isStateAffected(ETAT_PLACE)
            && k && k !== target && k.isAlive() && k.canMove()
            && act && act.subject() && act.subject().isEnemy && act.subject().isEnemy() && act.isForOne()) {
            if (this._logWindow) { this._logWindow.displaySubstitute(k, target); }
            return k;
        }
        return _substitut.call(this, target);
    };

    // L'ordre du groupe est rendu à la fin du combat : la carte ne change pas de chef.
    var _fin = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        _fin.call(this, result);
        var avant = $gameParty._froidOrdre;
        if (!avant) { return; }
        var cur = $gameParty._actors;
        $gameParty._actors = avant.filter(function (id) { return cur.indexOf(id) >= 0; })
            .concat(cur.filter(function (id) { return avant.indexOf(id) < 0; }));
        $gameParty._froidOrdre = null;
        if ($gamePlayer) { $gamePlayer.refresh(); }
    };

    var _debut = Game_Actor.prototype.onBattleStart;
    Game_Actor.prototype.onBattleStart = function () {
        _debut.call(this);
        this._froidSubis = { etats: {}, baisses: {} };
    };

    //=========================================================================
    // LE COUP — tout passe par ici
    //=========================================================================
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        var u = this.subject(), it = this.item();
        // « Rends-le » : Korrah donne l'ordre, la prochaine « Ce Que Le Froid Garde » vide tout
        if (estActeur(u, PORTEUSE) && this.isSkill() && it && it.id === ORDRE_RENDS_LE && lui()) {
            lui()._froidToutRendre = tour();
        }
        if (estActeur(u, FAMILIER) && enCombat() && this._froidCharge === undefined) { decider(this); }
        _apply.call(this, target);
        if (!enCombat() || !target) { return; }
        noterLesCoups(this, target);
        var r = target.result();
        // CHANGE
        if (estActeur(u, PORTEUSE) && this.isSkill() && it && it.id === CHANGE && !this._changeFait
            && target.isActor && target.isActor() && target !== u) {
            this._changeFait = true;
            changer(u, target);
        }
        // seiryu chargé
        if (this._froidCharge) {
            if (this._froidTout) {
                if (r.isHit()) {
                    if (this._froidCharge >= SEUIL_GELURE) { target.addState(ETAT_GELURE); }
                    if (this._froidCharge >= PLAFOND) { target.addState(ETAT_ENGOURDI); }
                }
            } else if (estCoup(it)) {
                if (r.isHit() && r.hpDamage > 0) { target.addState(ETAT_ENGOURDI); }
            } else if (estGarde(it)) {
                allonger(target, it);
            }
        }
        // le froid mord : qui frappe un protégé chargé s'engourdit
        if (u && u.isEnemy && u.isEnemy() && target.isActor && target.isActor() && target.isStateAffected(ETAT_MORD)
            && r.isHit() && r.hpDamage > 0 && !this._froidMordu && u.isAlive()) {
            this._froidMordu = true;
            u.addState(ETAT_ENGOURDI);
            journal('\\C[23]❄ Le froid mord ' + u.name() + '.\\C[0]');
            annonce(u, '❄ Le froid mord');
        }
    };

    //=========================================================================
    // SES CAPACITÉS (v1.1) — chacune parle à seiryu
    //=========================================================================
    function balise(it, nom) { return !!(it && it.meta && it.meta[nom] !== undefined); }

    // <SurEngourdi> : plus fort sur un ennemi ❄ engourdi (par le froid de seiryu, Ralentir…)
    var _valeurCapacite = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _valeurCapacite.call(this, target, critical);
        if (v > 0 && estActeur(this.subject(), PORTEUSE) && balise(this.item(), 'SurEngourdi')
            && target && target.isStateAffected(ETAT_ENGOURDI)) {
            annonce(target, '❄ Sur l\'engourdi ×' + String(1 + BONUS_ENGOURDI / 100).replace('.', ','));
            return Math.round(v * (1 + BONUS_ENGOURDI / 100));
        }
        return v;
    };

    var _applyCapacite = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _applyCapacite.call(this, target);
        var u = this.subject(), it = this.item();
        if (!estActeur(u, PORTEUSE) || !enCombat() || !target || !this.isSkill()) { return; }
        // <ADeux> : ce qu'elle se donne, seiryu l'a aussi (une fois par action)
        if (balise(it, 'ADeux') && target === u && !this._aDeuxFait && laPourElle()) {
            this._aDeuxFait = true;
            var s = lui();
            s.clearResult();
            _applyCapacite.call(this, s);          // la chaîne d'avant : pas de récursion ici
            journal('\\C[23]❄ ' + s.name() + ' en profite aussi.\\C[0]');
            annonce(s, '❄ À deux');
        }
        // <APlace> : elle prend sa place — les coups ciblés sur lui la frappent
        if (balise(it, 'APlace') && target.isActor && target.isActor() && target !== u && target.isAlive()) {
            $gameParty.members().forEach(function (m) { if (m !== target && m.isStateAffected(ETAT_PLACE)) { m.eraseState(ETAT_PLACE); } });
            target.addState(ETAT_PLACE);
            if (target.isStateAffected(ETAT_PLACE)) {
                target._stateTurns[ETAT_PLACE] = TOURS_A_PLACE;
                journal('\\C[23]🔄 ' + u.name() + ' prend la place de ' + target.name() + '.\\C[0]');
                annonce(target, '🔄 ' + u.name() + ' prend sa place', '#b8e0ff');
            }
        }
        // <SeiryuSuit> : on retient la cible ; il frappe quand son action à elle est finie
        if (balise(it, 'SeiryuSuit') && target.isEnemy && target.isEnemy()) { u._seiryuSuit = target; }
        // <ReprendFroid> : elle reprend du froid à seiryu (une fois par action), et le coup engourdit
        if (balise(it, 'ReprendFroid') && target.isEnemy && target.isEnemy()) {
            if (this._reprisFroid === undefined) {
                this._reprisFroid = laPourElle() && jauge() >= CHARGE;
                if (this._reprisFroid) {
                    poser(jauge() - CHARGE);
                    journal('\\C[23]❄ ' + u.name() + ' reprend ' + CHARGE + ' de froid à ' + lui().name()
                        + ' (' + jauge() + '/' + PLAFOND + ').\\C[0]');
                    annonce(u, '❄ Reprend ' + CHARGE + ' de froid');
                }
            }
            var rr = target.result();
            if (this._reprisFroid && rr.isHit() && rr.hpDamage > 0 && target.isAlive()) { target.addState(ETAT_ENGOURDI); }
        }
    };

    /** seiryu suit le coup : son coup chargé, sur la même cible, sans prendre son tour. */
    function suivre(k) {
        var e = k._seiryuSuit, s = lui();
        k._seiryuSuit = null;
        if (!e || !e.isAlive() || $gameTroop.members().indexOf(e) < 0) { return; }   // un ennemi d'un autre combat : rien
        if (!laPourElle() || !s.canMove() || jauge() < CHARGE) { return; }
        var act = new Game_Action(s);
        act.setAttack();
        e.clearResult();
        act.apply(e);                              // decider : CHARGE de froid, glace × bonusCoup, engourdit
        var r = e.result();
        e.startDamagePopup();
        if (e.isDead()) { e.performCollapse(); }
        journal('\\C[23]❄ ' + s.name() + ' suit le coup' + (r.isHit() ? ' : ' + r.hpDamage + ' dégâts.' : ', et manque.') + '\\C[0]');
        annonce(s, '❄ Suit le coup');
        if (BattleManager.refreshStatus) { BattleManager.refreshStatus(); }
    }
    var _finAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        var k = this._subject;
        if (estActeur(k, PORTEUSE) && k._seiryuSuit) { suivre(k); }
        _finAction.call(this);
    };

    window.FroidConfie.suivre = suivre;            // pour un banc

    //=========================================================================
    // À L'ÉCRAN — seiryu est le cinquième : sa rangée de statut est hors de la
    // fenêtre (4 rangées). Sa vie et son froid s'écrivent donc sur la ligne du
    // Pacte et du livre, à droite ; s'il se reforme, combien de tours encore.
    //=========================================================================
    function ligneSeiryu() {
        var s = lui();
        if (!s || !enCombat() || $gameParty.battleMembers().indexOf(s) < 0) { return ''; }
        if (s.isDead()) {
            var a = $gameParty._seiryuAbsence, n = a && !a.fini ? Math.max(1, a.retour - tour()) : 0;
            return n ? s.name() + ' se reforme · ' + n + ' t.' : s.name() + ' · à terre';
        }
        return s.name() + ' · ' + s.hp + ' PV · ❄ ' + jauge();
    }
    function Window_Seiryu() { this.initialize.apply(this, arguments); }
    Window_Seiryu.prototype = Object.create(Window_Base.prototype);
    Window_Seiryu.prototype.constructor = Window_Seiryu;
    Window_Seiryu.prototype.initialize = function (x, y, largeur) {
        Window_Base.prototype.initialize.call(this, x, y, largeur, this.fittingHeight(1));
        this.opacity = 0; this._cle = null;
    };
    Window_Seiryu.prototype.visibleDansLeStatut = function () {
        var sw = SceneManager._scene && SceneManager._scene._statusWindow, s = lui();
        if (!sw || !s || !sw.topRow) { return false; }
        var i = $gameParty.battleMembers().indexOf(s);
        return i >= sw.topRow() && i < sw.topRow() + sw.maxPageRows();
    };
    Window_Seiryu.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        var t = this.visibleDansLeStatut() ? '' : ligneSeiryu(), s = lui();
        var cle = t + '/' + (s && s.hp < s.mhp / 4 ? 1 : 0);
        if (cle === this._cle) { return; }
        this._cle = cle;
        this.contents.clear();
        if (!t) { return; }
        this.contents.fontSize = 17;
        this.contents.outlineColor = 'rgba(0,0,0,0.9)';
        this.changeTextColor(s.isDead() ? '#b0b0b0' : (s.hp < s.mhp / 4 ? '#ff8080' : (jauge() >= CHARGE ? '#9ad0ff' : '#ffffff')));
        this.drawText(t, 4, 2, this.contentsWidth() - 8, 'right');
        this.resetTextColor();
    };
    var _fenetres = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function () {
        _fenetres.call(this);
        // à droite du livre d'Aël (sa fenêtre : 300-630), sur la ligne du Pacte
        var sw = this._statusWindow, y = sw ? sw.y - 56 : Graphics.boxHeight - 240, x = 612;
        this._fenetreSeiryu = new Window_Seiryu(x, y, Graphics.boxWidth - x);
        this.addChild(this._fenetreSeiryu);
    };
    window.FroidConfie.ligneSeiryu = ligneSeiryu;  // pour un banc
})();
