//=============================================================================
// ElementsVivants.js — v1.0  ·  L'esprit du sort (chaque élément AGIT)
// RPG Maker MV   ·   by JOKO   ·   d'après la table des éléments du Codex
//=============================================================================
/*:
 * @plugindesc v1.0 ■ « Un élément n'a pas de valeur morale — c'est un outil » :
 * chaque élément porte son ESPRIT en combat (brûlure, gel, choc, souffle,
 * masse, flux…). Pas de roue, pas de cycle : des identités. Additif.
 * @author JOKO
 *
 * @param tauxEffet
 * @text Chance de l'effet (%)
 * @type number
 * @min 0
 * @max 100
 * @default 25
 * @desc Chance de base qu'un sort élémentaire applique son esprit (les dérivés de Fusion : +10).
 *
 * @param etatBrulure
 * @text État — Brûlure (Feu, Vapeur, Lave)
 * @type state
 * @default 91
 *
 * @param etatGelure
 * @text État — Gelure (Glace, Givre)
 * @type state
 * @default 94
 *
 * @param etatEtourdi
 * @text État — Étourdi (Foudre)
 * @type state
 * @default 134
 *
 * @param etatParalysie
 * @text État — Paralysie (Métal)
 * @type state
 * @default 136
 *
 * @param etatAveugle
 * @text État — Aveuglé (Ombre, Vapeur, Crépuscule)
 * @type state
 * @default 5
 *
 * @param showLog
 * @text Annoncer les effets ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'ESPRIT DU SORT                                                    by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  La table du Codex, rendue jouable. Quand un sort élémentaire FAIT des
 *  dégâts, son esprit a une chance (25 %) d'agir :
 *
 *   FEU (8)      brûlure, destruction  → état Brûlure sur la cible
 *   EAU (9)      flux, apaisement      → soigne le lanceur (10 % des dégâts)
 *   VENT (10)    poussée, vitesse      → le souffle te porte : +AGI (2 tours)
 *   TERRE (11)   défense, masse        → la masse te couvre : +DEF (2 tours)
 *   FOUDRE (12)  choc, jugement        → état Étourdi sur la cible
 *   GLACE (13)   gel, contrôle         → état Gelure sur la cible
 *   LUMIÈRE (14) révélation, soin      → soigne l'allié le plus blessé (15 %)
 *   OMBRE (15)   secret, corruption    → état Aveuglé sur la cible
 *
 *  LES DÉRIVÉS DE FUSION héritent d'esprits PLUS FORTS (+10 % de chance) :
 *   VAPEUR (17)     Brûlure + Aveuglé          LAVE (19)   Brûlure (chance ×2)
 *   PLANTE (20)     drain : vole 15 % des dégâts en PV
 *   GIVRE (22)      Gelure (chance ×2)         MÉTAL (23)  Paralysie
 *   CRÉPUSCULE (29) Aveuglé + soigne le lanceur (10 %)
 *
 *  → Choisir son élément devient TACTIQUE (contrôle, soutien, dégâts sur la
 *    durée) sans aucune roue d'avantages — fidèle au Codex. Et la Fusion
 *    devient doublement précieuse.
 *
 *  Les ennemis profitent des mêmes esprits (leurs sorts de Feu brûlent).
 *  Réglable : chance de base + IDs d'états. Aucune donnée modifiée.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('ElementsVivants');
    var TAUX = parseInt(P['tauxEffet'] || 25);
    var ST_BRUL = parseInt(P['etatBrulure'] || 91);
    var ST_GEL = parseInt(P['etatGelure'] || 94);
    var ST_ETOU = parseInt(P['etatEtourdi'] || 134);
    var ST_PARA = parseInt(P['etatParalysie'] || 136);
    var ST_AVEU = parseInt(P['etatAveugle'] || 5);
    var SHOW = String(P['showLog'] || 'true') === 'true';

    function log(t) {
        if (!SHOW) return;
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) w.addText(t);
    }
    function nom(b) { return b && b.name ? b.name() : ''; }
    function etat(cible, id, txt) {
        if (id > 0 && cible.isAlive() && !cible.isStateAffected(id)) {
            cible.addState(id);
            log(txt);
        }
    }
    function buff(qui, paramId, txt) {
        if (qui.isAlive()) { qui.addBuff(paramId, 2); log(txt); }
    }
    function soin(qui, pv, txt) {
        pv = Math.max(1, Math.floor(pv));
        if (qui.isAlive()) { qui.gainHp(pv); qui.startDamagePopup(); log(txt + ' (+' + pv + ' PV).'); }
    }

    var _executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        _executeDamage.call(this, target, value);
        if (value <= 0) return;
        var it = this.item();
        var el = (it && it.damage) ? it.damage.elementId : 0;
        if (el < 8) return;
        var qui = this.subject();
        if (!qui) return;
        // élément de fusion en cours ? (FusionElements remplace l'élément)
        if (this._fusionEl > 0) el = this._fusionEl;

        var derive = el >= 16;
        var chance = TAUX + (derive ? 10 : 0);
        var roll = function (mult) { return Math.randomInt(100) < chance * (mult || 1); };

        switch (el) {
            case 8:  if (roll()) etat(target, ST_BRUL, nom(target) + ' prend feu — Brûlure.'); break;
            case 9:  if (roll()) soin(qui, value * 0.10, 'Le flux de l\'Eau apaise ' + nom(qui)); break;
            case 10: if (roll()) buff(qui, 6, 'Le souffle porte ' + nom(qui) + ' — vitesse accrue.'); break;
            case 11: if (roll()) buff(qui, 3, 'La masse de la Terre couvre ' + nom(qui) + ' — défense accrue.'); break;
            case 12: if (roll()) etat(target, ST_ETOU, 'Le choc de la Foudre étourdit ' + nom(target) + '.'); break;
            case 13: if (roll()) etat(target, ST_GEL, 'Le gel prend ' + nom(target) + ' — Gelure.'); break;
            case 14: if (roll()) {
                var allies = qui.friendsUnit().aliveMembers();
                var blesse = allies.sort(function (a, b) { return (a.hp / a.mhp) - (b.hp / b.mhp); })[0];
                if (blesse) soin(blesse, value * 0.15, 'La Lumière révèle et répare ' + nom(blesse));
            } break;
            case 15: if (roll()) etat(target, ST_AVEU, 'L\'Ombre voile les yeux de ' + nom(target) + ' — Aveuglé.'); break;
            // ── dérivés de Fusion : esprits renforcés ──
            case 17: if (roll()) { etat(target, ST_BRUL, 'La Vapeur ébouillante ' + nom(target) + ' — Brûlure.');
                                   etat(target, ST_AVEU, 'La Vapeur l\'aveugle.'); } break;
            case 19: if (roll(2)) etat(target, ST_BRUL, 'La Lave dévore ' + nom(target) + ' — Brûlure.'); break;
            case 20: if (roll()) soin(qui, value * 0.15, 'Les racines de la Plante nourrissent ' + nom(qui)); break;
            case 22: if (roll(2)) etat(target, ST_GEL, 'Le Givre saisit ' + nom(target) + ' — Gelure.'); break;
            case 23: if (roll()) etat(target, ST_PARA, 'Le Métal conduit le choc — ' + nom(target) + ' est paralysé.'); break;
            case 29: if (roll()) { etat(target, ST_AVEU, 'Le Crépuscule voile ' + nom(target) + '.');
                                   soin(qui, value * 0.10, 'Le Crépuscule veille sur ' + nom(qui)); } break;
        }
    };
})();
