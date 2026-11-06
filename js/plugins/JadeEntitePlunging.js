//=============================================================================
// JadeEntitePlunging.js — v1.0
// Système de Santé Mentale de l'Âme — « La Jauge de Maîtrise »
// RPG Maker MV   ·   by JOKO
//=============================================================================

/*:
 * @plugindesc v1.0 ■ Santé Mentale de l'Âme — Jauge de Maîtrise (5 phases)
 * Les choix ont des conséquences : la jauge influence le combat, bloque ou
 * débloque des phrases, force des actions et oriente vers plusieurs fins.
 * @author JOKO
 *
 * @param === IDENTITÉ DES ÂMES ===
 * @default
 *
 * @param thylaneActorId
 * @text ID Acteur — Aël
 * @type actor
 * @default 1
 *
 * @param neyssaActorId
 * @text ID Acteur — Korrah
 * @type actor
 * @default 2
 *
 * @param louActorId
 * @text ID Acteur — Lou
 * @type actor
 * @default 3
 *
 * @param tiannaActorId
 * @text ID Acteur — Vesper
 * @type actor
 * @default 4
 *
 * @param === JAUGES (VARIABLES) ===
 * @default
 *
 * @param thylaneVar
 * @text Variable — Maîtrise (Aël)
 * @type variable
 * @default 11
 *
 * @param neyssaVar
 * @text Variable — Concentration (Korrah)
 * @type variable
 * @default 12
 *
 * @param louVar
 * @text Variable — Sérénité (Lou)
 * @type variable
 * @default 13
 *
 * @param tiannaVar
 * @text Variable — Confiance (Vesper)
 * @type variable
 * @default 14
 *
 * @param soulVar
 * @text Variable — Âmes Damnées (Lou)
 * @type variable
 * @default 15
 * @desc Compteur d'âmes absorbées par Lou. Monte sa puissance, baisse sa santé mentale.
 *
 * @param === RÉGLAGES DE JAUGE ===
 * @default
 *
 * @param gaugeMin
 * @text Valeur Minimale
 * @type number
 * @min 0
 * @default 1
 *
 * @param gaugeMax
 * @text Valeur Maximale
 * @type number
 * @min 2
 * @default 10
 *
 * @param defaultGauge
 * @text Valeur de Départ (Normale)
 * @type number
 * @default 7
 * @desc Au lancement d'une nouvelle partie, chaque jauge encore à 0 est mise à cette valeur (« tout le monde normal »).
 *
 * @param === RAGE & CIBLAGE ===
 * @default
 *
 * @param rageStateId
 * @text État « Enragé »
 * @type state
 * @default 7
 * @desc État de confusion (restriction « attaque n'importe qui ») appliqué à Aël quand elle s'effondre.
 *
 * @param coupsThreshold
 * @text Coups avant Rage
 * @type number
 * @min 1
 * @default 5
 * @desc Rappel : géré par le notetag de Aël. Sert ici à remettre le compteur à zéro à chaque combat.
 *
 * @param thylaneTargetsLou
 * @text Aël vise Lou (%)
 * @type number
 * @min 0
 * @max 100
 * @default 75
 * @desc Quand Aël enragée frappe un allié, probabilité que ce soit Lou (celui qui la taquine).
 *
 * @param === FINS ===
 * @default
 *
 * @param endingVar
 * @text Variable de Fin
 * @type variable
 * @default 0
 * @desc Variable où stocker l'ID de fin calculé (0 = désactivé).
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  SANTÉ MENTALE DE L'ÂME — LA JAUGE DE MAÎTRISE                       by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Dans ce monde numérique, chaque membre du groupe doit surmonter une part
 *  de lui-même poussée à l'extrême. Une jauge (1 à 10) mesure sa maîtrise.
 *  Elle monte avec les bons choix, descend avec les mauvais — et JAMAIS un
 *  choix n'est sans conséquence : il sculpte le combat, le dialogue et la fin.
 *
 *  • Aël (Var 11)  — Maîtrise de soi vs Colère.
 *      Bons choix → garde son calme (perce-armure, sérénité).
 *      Mauvais choix → gagne en FORCE mais perd en maîtrise : agressive,
 *      elle finit par frapper ses propres alliés, surtout LOU qui la taquine.
 *  • Korrah (Var 12)   — Concentration vs Tête en l'air.
 *  • Lou (Var 13)      — Sérénité vs Trauma. Absorber des âmes le rend
 *      plus puissant (Var 15) mais ronge sa santé mentale.
 *  • Vesper (Var 14)   — Confiance en soi vs Hésitation.
 *
 *  ──────────────────────────────────────────────────────────────────────────
 *  LES 5 PHASES PSYCHOLOGIQUES (mêmes paliers pour les 4 personnages)
 *  ──────────────────────────────────────────────────────────────────────────
 *   Phase 5 · MAÎTRISE        jauge 9–10   (sommet : le « moi » est dompté)
 *   Phase 4 · STABLE          jauge 6–8    (état normal de départ)
 *   Phase 3 · TENSION         jauge 4–5    (la fêlure apparaît)
 *   Phase 2 · INSTABLE        jauge 2–3    (le défaut prend le dessus)
 *   Phase 1 · EFFONDREMENT    jauge 1      (rupture : rage / trauma / blocage)
 *
 *  Les états RPG Maker des 5 phases s'activent tout seuls via les
 *  « Custom Passive Condition » de YEP_AutoPassiveStates. Ce plugin ne
 *  réécrit PAS ces états : il PILOTE la jauge qui les déclenche et ajoute la
 *  couche « choix → conséquences ».
 *
 *  ──────────────────────────────────────────────────────────────────────────
 *  1) FAIRE BOUGER LA JAUGE DEPUIS LES ÉVÉNEMENTS  (les choix comptent)
 *  ──────────────────────────────────────────────────────────────────────────
 *  Commandes de plugin (Event ▸ Plugin Command) — la clé est le prénom
 *  (thylane / neyssa / lou / tianna) OU l'ID d'acteur.
 *
 *    AME bon  <clé> [n]    Bon choix / calme      → +n  (défaut 1)
 *    AME mauvais <clé> [n] Mauvais choix / excès  → -n  (défaut 1)
 *    AME gain <clé> <d>    Ajoute d (peut être négatif)
 *    AME set  <clé> <v>    Fixe la jauge à v
 *    AME absorber [n]      Lou dévore n âme(s) : Var15 +n, Sérénité -n
 *    AME reset_coups       Remet à zéro les compteurs « coups subis »
 *    AME fin [variableId]  Calcule la fin et la stocke (sinon « Variable de Fin »)
 *
 *  Exemples :
 *    AME mauvais thylane 2     ← elle cède à la rage bait de Lou (-2 maîtrise)
 *    AME bon tianna            ← elle s'affirme (+1 confiance)
 *    AME absorber 3            ← Lou gobe 3 âmes, plus fort mais plus fragile
 *
 *  ──────────────────────────────────────────────────────────────────────────
 *  2) BLOQUER / DÉBLOQUER DES PHRASES  (à la Minecraft Story Mode)
 *  ──────────────────────────────────────────────────────────────────────────
 *  YEP_MessageCore (déjà actif) lit des conditions au début d'un choix :
 *      show(eval)    affiche le choix seulement si eval est vrai
 *      hide(eval)    le cache
 *      disable(eval) le montre grisé/verrouillé (on le voit, on ne peut pas)
 *
 *  Ce plugin fournit des helpers courts à mettre dans ces conditions ou dans
 *  les « Conditional Branch ▸ Script » :
 *
 *      Ame.jauge('thylane')        valeur 1–10
 *      Ame.phase('lou')            numéro de phase 1–5
 *      Ame.est('thylane','rage')   true si phase 1
 *      Ame.calme('thylane')        true si phase >= 4
 *
 *  Exemples de texte de choix (Show Choices) :
 *      show(Ame.calme('thylane'))           Lui répondre avec sang-froid
 *      disable(Ame.est('thylane','rage'))   Tenter de raisonner Lou
 *      show(Ame.phase('tianna') >= 5)       « C'est MON idée, et on la suit. »
 *
 *  ──────────────────────────────────────────────────────────────────────────
 *  3) FORCER DES ACTIONS EN COMBAT  (la rage prend le contrôle)
 *  ──────────────────────────────────────────────────────────────────────────
 *  • Le notetag de Aël la fait passer « Enragée » après N coups subis.
 *    Ce plugin remet ce compteur à zéro à chaque nouveau combat.
 *  • Quand Aël est enragée (ou en Phase 1) et qu'elle frappe au hasard,
 *    elle vise LOU en priorité (paramètre « Aël vise Lou »).
 *  • Si la jauge de Aël tombe à son minimum PENDANT un combat, l'état
 *    Enragé est appliqué immédiatement : la rupture force la perte de contrôle.
 *
 *  ──────────────────────────────────────────────────────────────────────────
 *  4) PLUSIEURS FINS
 *  ──────────────────────────────────────────────────────────────────────────
 *    AME fin            range un ID 1–5 dans la « Variable de Fin »
 *      1 · HARMONIE      — les 4 âmes domptées (toutes Phase >= 4)
 *      2 · CARNAGE       — Aël s'effondre dans la rage (Phase 1)
 *      3 · DÉVORÉ        — Lou consumé par les âmes (Sérénité <= 2)
 *      4 · FRACTURE      — au moins une âme brisée (une Phase <= 2)
 *      5 · ÉQUILIBRE FRAGILE — tout le reste
 *    Branchez ensuite un « Conditional Branch » sur cette variable.
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    //=========================================================================
    // PARAMÈTRES
    //=========================================================================

    var P = PluginManager.parameters('JadeEntitePlunging');

    var ACTOR = {
        thylane: parseInt(P['thylaneActorId'] || 1),
        neyssa:  parseInt(P['neyssaActorId']  || 2),
        lou:     parseInt(P['louActorId']     || 3),
        tianna:  parseInt(P['tiannaActorId']  || 4)
    };

    // Jauge (variable) associée à chaque ID d'acteur
    var VAR_BY_ACTOR = {};
    VAR_BY_ACTOR[ACTOR.thylane] = parseInt(P['thylaneVar'] || 11);
    VAR_BY_ACTOR[ACTOR.neyssa]  = parseInt(P['neyssaVar']  || 12);
    VAR_BY_ACTOR[ACTOR.lou]     = parseInt(P['louVar']     || 13);
    VAR_BY_ACTOR[ACTOR.tianna]  = parseInt(P['tiannaVar']  || 14);

    var SOUL_VAR    = parseInt(P['soulVar']     || 15);
    var GAUGE_MIN   = parseInt(P['gaugeMin']    || 1);
    var GAUGE_MAX   = parseInt(P['gaugeMax']    || 10);
    var GAUGE_DEF   = parseInt(P['defaultGauge']|| 7);
    var RAGE_STATE  = parseInt(P['rageStateId'] || 7);
    var THY_LOU_PCT = parseInt(P['thylaneTargetsLou'] || 75) / 100;
    var ENDING_VAR  = parseInt(P['endingVar']   || 0);

    //=========================================================================
    // OUTILS INTERNES
    //=========================================================================

    /** Convertit une clé (prénom OU id numérique) en ID d'acteur valide. */
    function resolveActorId(key) {
        if (typeof key === 'number') return key;
        var k = String(key).toLowerCase().trim();
        if (ACTOR.hasOwnProperty(k)) return ACTOR[k];
        var n = parseInt(k);
        return isNaN(n) ? 0 : n;
    }

    /** Variable de jauge pour un ID d'acteur (0 si inconnu). */
    function gaugeVarOf(actorId) {
        return VAR_BY_ACTOR[actorId] || 0;
    }

    /** Les variables de jeu sont-elles disponibles ? (évite les crashs au titre/chargement) */
    function varsReady() {
        return typeof $gameVariables !== 'undefined' && !!$gameVariables;
    }

    function clampGauge(v) {
        return Math.max(GAUGE_MIN, Math.min(GAUGE_MAX, Math.round(v)));
    }

    /** Numéro de phase (1 à 5) à partir d'une valeur de jauge. */
    function phaseFromValue(v) {
        if (v <= 1) return 1; // Effondrement
        if (v <= 3) return 2; // Instable
        if (v <= 5) return 3; // Tension
        if (v <= 8) return 4; // Stable
        return 5;             // Maîtrise
    }

    var PHASE_NAMES = {
        1: 'Effondrement',
        2: 'Instable',
        3: 'Tension',
        4: 'Stable',
        5: 'Maîtrise'
    };

    function battleLog(text) {
        var scene = SceneManager._scene;
        if (scene && scene._logWindow) scene._logWindow.addText(text);
    }

    function findPartyActor(actorId) {
        return $gameParty.members().find(function (m) {
            return m.actorId && m.actorId() === actorId;
        });
    }

    //=========================================================================
    // API PUBLIQUE — window.Ame  (utilisable dans les choix et les scripts)
    //=========================================================================

    var Ame = {
        ACTOR: ACTOR,

        /** Lit la jauge d'un personnage (clé = prénom ou id). */
        jauge: function (key) {
            if (!varsReady()) return 0;
            var v = gaugeVarOf(resolveActorId(key));
            // Un héros sans variable de jauge (le héros du joueur, un invité…) n'est
            // pas suivi par la Santé Mentale : il vaut GAUGE_MAX, jamais 0 — sinon il
            // serait lu en phase 1 (Effondrement) et toutes les Chutes se
            // déclencheraient sur lui dès le début de la partie.
            return v ? $gameVariables.value(v) : GAUGE_MAX;
        },

        /** Écrit la jauge (clampée). Applique les conséquences immédiates. */
        setJauge: function (key, value) {
            if (!varsReady()) return;
            var id = resolveActorId(key);
            var v = gaugeVarOf(id);
            if (!v) return;
            var before = $gameVariables.value(v);
            var after = clampGauge(value);
            $gameVariables.setValue(v, after);
            this._onGaugeChanged(id, before, after);
            return after;
        },

        /** Ajoute un delta (positif ou négatif) à la jauge. */
        gain: function (key, delta) {
            return this.setJauge(key, this.jauge(key) + (Number(delta) || 0));
        },

        /** Bon choix / sang-froid → +n. */
        bon: function (key, n) {
            return this.gain(key, Math.abs(Number(n) || 1));
        },

        /** Mauvais choix / excès → -n (gagne en force, perd en maîtrise). */
        mauvais: function (key, n) {
            return this.gain(key, -Math.abs(Number(n) || 1));
        },

        /** Numéro de phase 1–5. */
        phase: function (key) {
            return phaseFromValue(this.jauge(key));
        },

        /** Nom lisible de la phase courante. */
        nomPhase: function (key) {
            return PHASE_NAMES[this.phase(key)];
        },

        /** Raccourci : phase >= 4 (l'âme garde le contrôle). */
        calme: function (key) {
            return this.phase(key) >= 4;
        },

        /**
         * Test sémantique d'état d'âme.
         *   'rage' / 'effondre'   → phase 1
         *   'instable'            → phase <= 2
         *   'tension'             → phase 3
         *   'stable'              → phase 4
         *   'maitrise' / 'serein' → phase 5
         */
        est: function (key, etat) {
            var p = this.phase(key);
            switch (String(etat).toLowerCase()) {
                case 'rage':
                case 'effondre':     return p === 1;
                case 'instable':     return p <= 2;
                case 'tension':      return p === 3;
                case 'stable':       return p === 4;
                case 'maitrise':
                case 'serein':       return p === 5;
                default:             return false;
            }
        },

        /** Lou dévore n âme(s) : plus puissant (Var 15) mais santé mentale -n. */
        absorber: function (n) {
            if (!varsReady()) return 0;
            n = Math.abs(Number(n) || 1);
            if (SOUL_VAR) {
                $gameVariables.setValue(SOUL_VAR, $gameVariables.value(SOUL_VAR) + n);
            }
            this.mauvais('lou', n);
            battleLog('Lou absorbe ' + n + ' âme(s)… sa puissance grandit, son esprit se fissure.');
            return this.jauge('lou');
        },

        /**
         * Calcule la fin (1 à 5) selon les 4 jauges et la stocke dans la
         * variable fournie (ou « Variable de Fin »). Retourne l'ID.
         */
        fin: function (variableId) {
            var phT = this.phase('thylane');
            var phN = this.phase('neyssa');
            var phL = this.phase('lou');
            var phI = this.phase('tianna');
            var id;

            if (this.jauge('lou') <= 2) {
                id = 3; // Dévoré par les âmes
            } else if (phT === 1) {
                id = 2; // Carnage
            } else if (phT >= 4 && phN >= 4 && phL >= 4 && phI >= 4) {
                id = 1; // Harmonie
            } else if (Math.min(phT, phN, phL, phI) <= 2) {
                id = 4; // Fracture
            } else {
                id = 5; // Équilibre fragile
            }

            var target = parseInt(variableId) || ENDING_VAR;
            if (target) $gameVariables.setValue(target, id);
            return id;
        },

        /**
         * Conséquences automatiques d'un changement de jauge.
         * Le franchissement vers le bas est commenté ; en plein combat,
         * l'effondrement de Aël force immédiatement la rage.
         */
        _onGaugeChanged: function (actorId, before, after) {
            if (after === before) return;
            var pBefore = phaseFromValue(before);
            var pAfter = phaseFromValue(after);

            if (pAfter < pBefore) {
                // Descente : un choix qui coûte.
                if (actorId === ACTOR.thylane && pAfter === 1 && $gameParty.inBattle()) {
                    var thy = findPartyActor(actorId);
                    if (thy && thy.isAlive() && !thy.isStateAffected(RAGE_STATE)) {
                        thy.addState(RAGE_STATE);
                        battleLog('Aël craque : la fureur prend le contrôle !');
                    }
                }
            }
        }
    };

    // Exposition globale + alias
    window.Ame = Ame;
    window.AmeSysteme = Ame;

    //=========================================================================
    // INITIALISATION — « tout le monde normal » au lancement
    //=========================================================================

    /**
     * YEP_AutoPassiveStates met les états passifs EN CACHE (_passiveStatesRaw),
     * calculé une fois et vidé uniquement par refresh(). Les acteurs sont créés
     * AVANT que les jauges soient posées ci-dessous : sans ce rafraîchissement,
     * ils gardent les états calculés quand les jauges valaient encore 0, donc en
     * phase 1 (EFFONDREMENT). Korrah héritait ainsi de « Méditation Profonde »
     * (restriction 4) et NE POUVAIT AGIR DANS AUCUN COMBAT, alors même que sa
     * variable valait bien 7. Deux lignes, et tout le système mental repart.
     */
    function rafraichirAmes() {
        try {
            if ($gameActors && $gameActors._data) {
                $gameActors._data.forEach(function (a) { if (a && a.refresh) a.refresh(); });
            }
        } catch (e) { }
    }

    function poserJaugesParDefaut() {
        Object.keys(VAR_BY_ACTOR).forEach(function (actorId) {
            var v = VAR_BY_ACTOR[actorId];
            // 0 = jamais initialisée (l'échelle va de GAUGE_MIN à GAUGE_MAX)
            if (v && $gameVariables.value(v) === 0) {
                $gameVariables.setValue(v, GAUGE_DEF);
            }
        });
        rafraichirAmes();
    }

    var _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function () {
        _DataManager_setupNewGame.call(this);
        poserJaugesParDefaut();
    };

    // Une sauvegarde faite avant cette correction porte des états passifs figés
    // sur une jauge à 0 : on les recalcule au chargement.
    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _DataManager_extractSaveContents.call(this, contents);
        try { poserJaugesParDefaut(); } catch (e) { }
    };

    //=========================================================================
    // RESET DU COMPTEUR « COUPS SUBIS » À CHAQUE COMBAT
    // (le notetag de Aël incrémente target._coupsSubis ; on le purge ici
    //  pour que la rage soit déclenchée par combat et non cumulée à vie)
    //=========================================================================

    var _BattleManager_startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        $gameParty.members().forEach(function (m) { m._coupsSubis = 0; });
        _BattleManager_startBattle.call(this);
    };

    //=========================================================================
    // CIBLAGE AGRESSIF — Aël enragée vise Lou en priorité
    //=========================================================================

    var _Game_Action_confusionTarget = Game_Action.prototype.confusionTarget;
    Game_Action.prototype.confusionTarget = function () {
        var subject = this.subject();

        if (subject && subject.isActor && subject.isActor() &&
            subject.actorId() === ACTOR.thylane &&
            subject.confusionLevel() >= 2) {

            var lou = findPartyActor(ACTOR.lou);
            if (lou && lou.isAlive() && lou !== subject && Math.random() < THY_LOU_PCT) {
                battleLog('La rage de Aël se fixe sur Lou !');
                return lou;
            }
        }

        return _Game_Action_confusionTarget.call(this);
    };

    //=========================================================================
    // COMMANDES DE PLUGIN
    //=========================================================================

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        if (String(command).toUpperCase() !== 'AME') return;

        var sub = (args[0] || '').toLowerCase();

        switch (sub) {
            case 'bon':
                Ame.bon(args[1], args[2]);
                break;
            case 'mauvais':
                Ame.mauvais(args[1], args[2]);
                break;
            case 'gain':
                Ame.gain(args[1], args[2]);
                break;
            case 'set':
                Ame.setJauge(args[1], args[2]);
                break;
            case 'absorber':
            case 'absorb':
                Ame.absorber(args[1]);
                break;
            case 'reset_coups':
                $gameParty.members().forEach(function (m) { m._coupsSubis = 0; });
                break;
            case 'fin':
            case 'ending':
                Ame.fin(args[1]);
                break;
        }
    };

})();
