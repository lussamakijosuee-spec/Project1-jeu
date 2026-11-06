//=============================================================================
// LeSpirituel.js — v1.0
// Le Spirituel, l'art de l'Âme (mana spirituel) : la marque, la volonté.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le Spirituel (mana spirituel) : une technique de l'âme ÉCRIT
 * UNE MARQUE sur l'ennemi — elle éclate quand il agit, et s'il tombe marqué, l'âme
 * revient à qui l'a écrite. Sa force vient de la VOLONTÉ : PV bas, alliés tombés.
 * @author pour JOKO
 *
 * @param === QUI EST DU SPIRITUEL ===
 * @default
 *
 * @param elementsAme
 * @text Éléments de l'âme
 * @default 2, 7
 * @desc 2 mana spirituelle, 7 AME (pour JOKO, c'est le même mana).
 *
 * @param typesAme
 * @text Types de compétence de l'âme
 * @default 8, 9
 * @desc 8 invocation, 9 ame.
 *
 * @param acteursExclus
 * @text Ceux qui n'écrivent pas
 * @default 6
 * @desc seiryu (6).
 *
 * @param === LA MARQUE ===
 * @default
 *
 * @param etatMarque
 * @text État de la marque
 * @type state
 * @default 257
 * @desc Son icône est la marque ; son chiffre, le nombre de marques ; ses tours, combien de temps elle tient.
 *
 * @param forceMarque
 * @text Une marque garde (% des dégâts du coup)
 * @type number
 * @default 40
 *
 * @param baseSansDegats
 * @text Sans dégâts, une marque garde (× MAG)
 * @default 2
 * @desc Pour une technique de l'âme qui ne blesse pas (un état, une malédiction).
 *
 * @param marquesMax
 * @text Marques au plus sur une cible
 * @type number
 * @min 1
 * @default 3
 *
 * @param retourAme
 * @text Tombé marqué : l'âme rend (% des PV max, par marque)
 * @type number
 * @default 8
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
 *  LE SPIRITUEL — l'âme qui marque                               pour JOKO
 * ============================================================================
 *  JOKO, le 2026-10-20 : « mana spirituel, c'est plus de soi, émotion de soi,
 *  volonté » ; « ceux qui sont un peu plus dans les runes, les marquages,
 *  tout ce qui est nécromancie » ; « finis le rework spirituel ».
 *
 *  EST DU SPIRITUEL : une compétence de héros au mana spirituel (éléments 2
 *  et 7) ou du type invocation / ame. Elle ne prend jamais la Voie du héros.
 *
 *  LA MARQUE — quand une technique de l'âme touche un ennemi, elle écrit une
 *  marque sur lui (ᛟ, avec leur nombre, jusqu'à 3). Chaque marque garde 40 %
 *  des dégâts du coup. Quand l'ennemi AGIT, toutes ses marques éclatent et
 *  le frappent d'un coup. S'il TOMBE marqué, l'âme revient : qui a écrit la
 *  marque reprend 8 % de ses PV max par marque. Une marque tient 3 tours.
 *
 *  LA VOLONTÉ — une technique de l'âme frappe (et soigne) plus fort quand ça
 *  va mal : +50 % à 0 PV (au prorata), +25 % par allié tombé, ×1,75 au plus.
 *  Le prix de l'âme, ce sont les PV : la payer rapproche de sa volonté.
 *
 *  Tout s'annonce au-dessus des combattants (le journal de combat est muet
 *  ici). Les ennemis n'écrivent pas de marque. Aucune fiche n'est modifiée.
 * ============================================================================
 */

var LeSpirituel = LeSpirituel || {};

(function () {
    'use strict';

    var P = PluginManager.parameters('LeSpirituel');
    var nombre = function (k, d) { var v = parseFloat(P[k]); return isNaN(v) ? d : v; };
    var liste = function (k, d) {
        return String(P[k] === undefined ? d : P[k]).split(',')
            .map(function (x) { return parseInt(x, 10); }).filter(function (x) { return !isNaN(x); });
    };
    var ELEMENTS = liste('elementsAme', '2, 7');
    var TYPES    = liste('typesAme', '8, 9');
    var EXCLUS   = liste('acteursExclus', '6');
    var ETAT     = nombre('etatMarque', 257);
    var FORCE    = nombre('forceMarque', 40) / 100;
    var SANS     = nombre('baseSansDegats', 2);
    var MAX      = nombre('marquesMax', 3);
    var RETOUR   = nombre('retourAme', 8) / 100;
    var PAR_PV   = nombre('parPVManquant', 0.5);
    var PAR_KO   = nombre('parAllieTombe', 0.25);
    var VOL_MAX  = nombre('volonteMax', 1.75);

    function enCombat() { return $gameParty && $gameParty.inBattle(); }
    function heros(b) { return !!(b && b.isActor && b.isActor() && EXCLUS.indexOf(b.actorId()) < 0); }
    function annonce(b, texte, couleur) {
        if (window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, texte, couleur); }
    }
    function chiffre(x) { return String(Math.round(x * 100) / 100).replace('.', ','); }

    /** Une technique de l'âme, lancée par un héros. */
    function estSpirituel(action) {
        var it = action && action.item();
        if (!it || !DataManager.isSkill(it) || !heros(action.subject())) { return false; }
        return TYPES.indexOf(it.stypeId) >= 0 || (!!it.damage && ELEMENTS.indexOf(it.damage.elementId) >= 0);
    }

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
        if (v !== 0 && estSpirituel(this)) {
            if (this._volonte === undefined) {
                this._volonte = volonte(this.subject());
                if (this._volonte >= 1.05) { annonce(this.subject(), 'ᛟ Volonté ×' + chiffre(this._volonte), '#ff9ad8'); }
            }
            if (this._volonte !== 1) { v = Math.round(v * this._volonte); }
        }
        return v;
    };

    //=========================================================================
    // La marque : écrite par le coup, gardée sur la cible
    //=========================================================================
    function marques(e) {
        if (!e || !e.isStateAffected(ETAT)) { if (e) { e._marquesAme = []; } return []; }
        return e._marquesAme || (e._marquesAme = []);
    }
    function montrer(e) {
        var n = marques(e).length;
        if (n > 0) {
            if (!e.isStateAffected(ETAT)) { e.addNewState(ETAT); }
            e.resetStateCounts(ETAT);
            e.setStateCounter(ETAT, n);
        } else if (e.isStateAffected(ETAT)) {
            e.eraseState(ETAT); e.removeStateCounter(ETAT); e.refresh();
        }
    }
    function ecrire(action, e) {
        var b = action.subject(), r = e.result();
        var base = r.hpDamage > 0 ? r.hpDamage : b.mat * SANS;
        var valeur = Math.max(1, Math.floor(base * FORCE));
        var liste = marques(e);
        if (!e.isStateAffected(ETAT)) { e.addNewState(ETAT); e._marquesAme = liste = []; }
        liste.push({ acteur: b.actorId(), valeur: valeur, competence: action.item().id });
        while (liste.length > MAX) { liste.shift(); }
        montrer(e);
        annonce(e, 'ᛟ Marque ×' + liste.length, '#e080ff');
    }

    var _appliquer = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _appliquer.call(this, target);
        if (!enCombat() || !target || !target.isEnemy || !target.isEnemy() || !estSpirituel(this)) { return; }
        var r = target.result();
        if (r && r.isHit() && target.isAlive()) { ecrire(this, target); }
    };

    //=========================================================================
    // Quand l'ennemi agit, ses marques éclatent
    //=========================================================================
    var _debut = BattleManager.startAction;
    BattleManager.startAction = function () {
        var s = this._subject;
        if (s && s.isEnemy && s.isEnemy() && marques(s).length) { s._marqueAgit = true; }
        _debut.call(this);
    };
    function eclater(e) {
        var liste = marques(e).slice();
        if (!liste.length) { return; }
        var total = liste.reduce(function (t, m) { return t + m.valeur; }, 0);
        e._marquesEclatees = liste;
        e._marquesAme = [];
        montrer(e);
        annonce(e, 'ᛟ Éclat −' + total, '#e080ff');   // court : les ennemis sont au bord gauche
        // Le coup part de qui a écrit la dernière marque, par le chemin d'un vrai coup : une mise à mort
        // compte (l'âme de PorteurDAmes, le Marqué de LeRegistre, l'OVERKILL). Mais c'est l'âme qui frappe
        // du dedans : pas de drain, et ni le Renvoi ni le Reflux de l'ennemi ne la renvoient.
        var m = liste[liste.length - 1], auteur = $gameActors.actor(m.acteur);
        var a = new Game_Action(auteur); a.setSkill(m.competence);
        a.isHpEffect = function () { return true; };
        a.isMpEffect = function () { return false; };
        a.isDrain = function () { return false; };
        var renvoi = e._voieRenvoi, reflux = e._voieReflux;
        e._voieRenvoi = null; e._voieReflux = null;
        e.clearResult();
        a.executeDamage(e, total);
        e.startDamagePopup();
        e.clearResult();
        e._voieRenvoi = renvoi; e._voieReflux = reflux;
        if (e.isDead()) { e.performCollapse(); }
        e._marquesEclatees = null;
    }
    var _fin = BattleManager.endAction;
    BattleManager.endAction = function () {
        var s = this._subject;
        if (s && s._marqueAgit) { s._marqueAgit = false; if (s.isAlive()) { eclater(s); } }
        _fin.call(this);
    };

    //=========================================================================
    // Tombé marqué : l'âme revient à qui l'a écrite
    //=========================================================================
    // Sur Game_Enemy : LouCopySystem, DonoBoss, DonoKamui et EvenementsUtiles y posent déjà leur mort.
    var _mourir = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function () {
        if (enCombat()) {
            var liste = (this._marquesEclatees && this._marquesEclatees.length) ? this._marquesEclatees : marques(this);
            if (liste.length && RETOUR > 0) {
                var parActeur = {};
                liste.forEach(function (m) { parActeur[m.acteur] = (parActeur[m.acteur] || 0) + 1; });
                Object.keys(parActeur).forEach(function (id) {
                    var a = $gameActors.actor(Number(id));
                    if (!a || !a.isAlive() || $gameParty.battleMembers().indexOf(a) < 0) { return; }
                    var pv = Math.max(1, Math.floor(a.mhp * RETOUR * parActeur[id]));
                    a.gainHp(pv); a.startDamagePopup(); a.clearResult();
                    annonce(a, 'ᛟ Âme +' + pv + ' PV', '#ffb0e8');
                });
            }
            this._marquesAme = [];
        }
        _mourir.call(this);
    };

    var _debutCombat = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function () {
        _debutCombat.call(this);
        this._marquesAme = []; this._marqueAgit = false;
    };

    LeSpirituel.estSpirituel = estSpirituel;
    LeSpirituel.volonte = volonte;
    LeSpirituel.marques = function (e) { return marques(e).slice(); };
})();
