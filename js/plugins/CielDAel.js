//=============================================================================
// CielDAel.js — v1.0
// L'Incantation et le Ciel — le temps qu'Aël achète, et le temps qu'il fait
// RPG Maker MV
//=============================================================================

/*:
 * @plugindesc v1.0 ■ Les Paroles longues d'Aël : elle annonce, l'équipe tient,
 * le coup part. Et le ciel décide si elle doit attendre.
 * @author JOKO
 *
 * @param acteur
 * @text L'incantatrice
 * @type actor
 * @default 4
 * @desc Le héros qui incante. Les autres lancent leurs compétences normalement.
 *
 * @param etatIncantation
 * @text État « 🌀 Incantation »
 * @type state
 * @default 227
 * @desc Posé pendant qu'elle incante : il la fragilise et il se voit. Ce n'est PAS lui qui l'empêche de jouer (voir l'aide).
 *
 * @param etatSurcharge
 * @text État « ✷ Surcharge »
 * @type state
 * @default 218
 * @desc Posé APRÈS une Parole marquée <Apres: surcharge>. Le même que celui des boss.
 *
 * @param seuilCoup
 * @text Rupture — un seul coup (%)
 * @type number
 * @min 0
 * @max 100
 * @default 15
 * @desc Un coup encaissé valant au moins tant de % de ses PV max rompt l'incantation. 0 = jamais.
 *
 * @param seuilCumul
 * @text Rupture — cumul (%)
 * @type number
 * @min 0
 * @max 100
 * @default 30
 * @desc Le total encaissé DEPUIS le début de l'incantation. 0 = jamais.
 *
 * @param repartAMoitie
 * @text La Parole rompue repart à mi-charge
 * @type boolean
 * @on Elle repart (recommandé)
 * @off Elle est perdue
 * @default true
 * @desc Rompue, la Parole n'est pas perdue : elle reprend au tour suivant avec la moitié de la charge restante.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  CE QUE CE PLUGIN FAIT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Aël ne frappe pas vite. Elle achète du temps pour frapper une fois très
 * fort — et pendant qu'elle paie, elle est en verre. Trois pièces :
 *
 *  ① L'INCANTATION.  <Incantation: 2>
 *     La Parole ne part pas tout de suite. Aël l'annonce, paie ses PM et ses
 *     PT SUR-LE-CHAMP, prend 🌀 Incantation, et ne joue plus pendant 2 tours.
 *     Au bout du compte, la Parole part toute seule.
 *
 *  ② LE CIEL.  <Ciel: rain>
 *     Si le temps qu'il fait est DÉJÀ celui que la Parole demande, la charge
 *     tombe à ZÉRO : elle part immédiatement. C'est là tout le jeu — un tour
 *     dépensé à appeler le bon ciel en fait gagner deux ensuite.
 *     Valeurs : none · rain · storm · snow
 *
 *     <Appel: rain, 5>   pose ce ciel pour 5 tours. Court, peu cher.
 *
 *  ③ LA SURCHARGE.  <Apres: surcharge>
 *     Après la très grosse Parole, elle vacille : un tour où tout lui fait
 *     ×1.6. Le combat ne s'arrête pas à son coup — il y a l'après.
 *     (C'est l'état des boss, repris tel quel.)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA RUPTURE — MESURÉE, PAS BINAIRE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Trois façons de lui couper la parole :
 *
 *   • un seul coup valant ≥ 15 % de ses PV max ;
 *   • le cumul encaissé depuis l'annonce ≥ 30 % de ses PV max ;
 *   • n'importe quel état qui l'empêche d'agir (restriction ≥ 1) —
 *     Étourdi, Sommeil, Paralysie, Terreur, Figé… On ne tient pas une liste
 *     de numéros : on demande au moteur qui empêche d'agir.
 *
 * Le seuil au coup vient de la règle de concentration de D&D 5e, qui fait
 * dépendre la difficulté du MONTANT du coup et non du fait d'être touché :
 * les égratignures passent, les gros coups menacent. Le cumul est là pour
 * que trois coups moyens finissent quand même par la faire taire.
 *
 * ⚠ ROMPUE N'EST PAS PERDUE. Les PM sont déjà dépensés — les reprendre EN
 * PLUS des tours perdus, c'est la punition qui fait qu'on ne retente jamais.
 * La Parole repart donc au tour suivant avec la moitié de la charge qui
 * restait. Ce qu'on perd, c'est du temps ; et le temps est déjà sa monnaie.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  POUR LES FORMULES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   $gameSystem.ciel()            'none' | 'rain' | 'storm' | 'snow'
 *   $gameSystem.cielEst('rain')   vrai/faux
 *   a.enIncantation()             elle est en train d'incanter
 *
 * Exemple, une Parole qui frappe plus fort sous son ciel :
 *   Math.floor(a.mat * 8 * 200 / (200 + b.mdf) * ($gameSystem.cielEst('storm') ? 1.5 : 1))
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'ÉTAT 🌀 INCANTATION N'EMPÊCHE PAS D'AGIR — ET C'EST VOULU
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Il serait tentant de lui donner restriction « ne peut pas agir » : c'est le
 * réflexe MV. Ça ne marche pas. Un état à restriction ≥ 1 fait que
 * makeActions VIDE les actions du combattant ; sans action, MV n'appelle
 * jamais startAction pour lui. Le compte à rebours ne tournerait pas, et la
 * Parole ne partirait JAMAIS.
 *
 * Le plugin fait donc l'inverse : il coupe la SAISIE (canInput) et REMET
 * l'action à chaque tour, pour que le moteur continue de lui donner son tour
 * et que le compte avance. L'état 227 ne sert qu'à deux choses : la
 * fragiliser, et se voir.
 *
 * ⚠ LE CIEL SE LIT EN COMBAT, MAIS IL NE S'Y VOYAIT PAS. Mesuré : la valeur
 * de $gameScreen.weatherType() traverse bien l'entrée en combat, mais MV ne
 * pose sa pluie que sur la carte — MOG_Weather_EX dessine SA météo à lui,
 * pas celle de changeWeather. Une mécanique du ciel qu'on ne voit pas est
 * injouable, donc ce plugin ajoute le rendu au champ de bataille.
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('CielDAel');
    var ACTEUR       = Number(P['acteur'] || 4);
    var INCANTATION  = Number(P['etatIncantation'] || 227);
    var SURCHARGE    = Number(P['etatSurcharge'] || 218);
    var SEUIL_COUP   = Number(P['seuilCoup'] || 15) / 100;
    var SEUIL_CUMUL  = Number(P['seuilCumul'] || 30) / 100;
    var REPART       = String(P['repartAMoitie'] || 'true') !== 'false';

    var CIELS = ['none', 'rain', 'storm', 'snow'];

    //=========================================================================
    // Lire les notes
    //=========================================================================
    function nb(item, balise) {
        if (!item) { return 0; }
        var m = new RegExp('<\\s*' + balise + '\\s*:\\s*(\\d+)\\s*>', 'i').exec(item.note || '');
        return m ? Number(m[1]) : 0;
    }
    function mot(item, balise) {
        if (!item) { return null; }
        // ⚠ MV garde l'espace après le « : » — <Ciel: rain> donne " rain".
        var m = new RegExp('<\\s*' + balise + '\\s*:\\s*([^>]*)>', 'i').exec(item.note || '');
        return m ? m[1].trim().toLowerCase() : null;
    }
    function appel(item) {
        if (!item) { return null; }
        var m = /<\s*Appel\s*:\s*([^,>]+)(?:,\s*(\d+))?\s*>/i.exec(item.note || '');
        if (!m) { return null; }
        var t = m[1].trim().toLowerCase();
        if (CIELS.indexOf(t) < 0) { return null; }
        return { type: t, tours: m[2] ? Number(m[2]) : 5 };
    }
    function faitSurcharge(item) {
        return !!item && /<\s*Apres\s*:\s*surcharge\s*>/i.test(item.note || '');
    }

    //=========================================================================
    // Le ciel, lisible partout
    //=========================================================================
    Game_System.prototype.ciel = function () {
        return $gameScreen ? $gameScreen.weatherType() : 'none';
    };
    Game_System.prototype.cielEst = function (t) {
        return this.ciel() === String(t).trim().toLowerCase();
    };

    /** La charge que cette Parole demande VRAIMENT, ciel compris. */
    function chargeReelle(item) {
        var n = nb(item, 'Incantation');
        if (n <= 0) { return 0; }
        var exige = mot(item, 'Ciel');
        if (exige && $gameSystem.cielEst(exige)) { return 0; }   // le ciel paie le temps
        return n;
    }

    //=========================================================================
    // L'état d'incantation
    //=========================================================================
    Game_Battler.prototype.enIncantation = function () {
        return !!this._incantation;
    };

    function journal(texte) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w && w.push) { w.push('addText', texte); }
    }
    // Le journal est muet en vue de côté (SimpleMsgSideView) : ce qui doit se voir flotte aussi au-dessus d'elle
    // (2026-10-23 ; le journal reste, pour les bancs).
    function flotter(b, texte, couleur) {
        if (b && window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, texte, couleur || '#ffd54a'); }
    }

    function nomCiel(t) {
        return { none: 'ciel clair', rain: 'la pluie', storm: 'l\'orage', snow: 'la neige' }[t] || t;
    }

    /** Elle annonce : elle paie, elle prend l'état, elle ne joue plus. */
    function annoncer(sujet, action) {
        var item = action.item();
        var reste = chargeReelle(item);
        sujet._incantation = {
            skillId: item.id,
            cible: action._targetIndex,
            reste: reste,
            encaisse: 0,
            total: sujet.mhp
        };
        sujet.useItem(item);                       // les PM et les PT partent MAINTENANT
        sujet.addState(INCANTATION);
        journal('\\C[14]' + sujet.name() + ' commence « ' + item.name + ' »…\\C[0]');
        journal('Encore ' + reste + ' tour' + (reste > 1 ? 's' : '') + '. Tenez-la.');
        flotter(sujet, '🌀 « ' + item.name + ' » · ' + reste + ' t.');
    }

    /** On lui coupe la parole. */
    function rompre(sujet, pourquoi) {
        var inc = sujet._incantation;
        if (!inc) { return; }
        var nom = $dataSkills[inc.skillId] ? $dataSkills[inc.skillId].name : '?';
        sujet.removeState(INCANTATION);
        if (REPART && inc.reste > 0) {
            inc.reste = Math.ceil(inc.reste / 2);
            inc.encaisse = 0;
            sujet._incantationRompue = inc;        // elle reprendra à son tour
            journal('\\C[18]' + sujet.name() + ' perd le fil de « ' + nom + ' » — ' + pourquoi + '.\\C[0]');
            journal('Elle reprendra : encore ' + inc.reste + ' tour' + (inc.reste > 1 ? 's' : '') + '.');
            flotter(sujet, '✗ Le fil se perd · reprendra ' + inc.reste + ' t.', '#ff8080');
        } else {
            journal('\\C[18]« ' + nom +' » se brise — ' + pourquoi + '.\\C[0]');
            flotter(sujet, '✗ « ' + nom + ' » se brise', '#ff8080');
        }
        sujet._incantation = null;
    }

    //=========================================================================
    // Pendant l'incantation, elle ne prend pas d'ordres
    //=========================================================================
    // ⚠ ON N'EMPLOIE PAS LA « RESTRICTION » DE L'ÉTAT POUR ÇA. Un état à
    // restriction ≥ 1 fait que makeActions VIDE ses actions — et sans action,
    // MV n'appelle jamais startAction pour elle : le compte à rebours ne
    // tournerait pas et la Parole ne partirait jamais. On lui coupe donc la
    // saisie d'un côté, et on lui REMET son action de l'autre, pour que le
    // moteur continue de lui donner son tour.
    var _canInput = Game_BattlerBase.prototype.canInput;
    Game_BattlerBase.prototype.canInput = function () {
        if (this._incantation || this._incantationRompue) { return false; }
        return _canInput.call(this);
    };

    var _makeActions = Game_Actor.prototype.makeActions;
    Game_Actor.prototype.makeActions = function () {
        _makeActions.call(this);
        var inc = this._incantation || this._incantationRompue;
        if (!inc) { return; }
        var act = new Game_Action(this);
        act.setSkill(inc.skillId);
        if (inc.cible !== undefined && inc.cible >= 0) { act.setTarget(inc.cible); }
        this.setAction(0, act);
    };

    //=========================================================================
    // Le compte à rebours, et le coup qui part
    //=========================================================================
    var _startAction = BattleManager.startAction;
    BattleManager.startAction = function () {
        var sujet = this._subject;
        if (sujet && sujet.isActor() && sujet.actorId() === ACTEUR) {

            // ① Elle reprend une Parole rompue
            if (!sujet._incantation && sujet._incantationRompue) {
                sujet._incantation = sujet._incantationRompue;
                sujet._incantationRompue = null;
                sujet.addState(INCANTATION);
            }

            // ② Elle est en train d'incanter
            if (sujet._incantation) {
                var inc = sujet._incantation;
                if (inc.reste > 0) {
                    inc.reste--;
                    // ⚠ ON NE REND PAS LA MAIN QUAND LE COMPTE TOMBE À ZÉRO.
                    // Mesuré dans le moteur : attendre un tour de PLUS pour
                    // tirer faisait trois tours d'attente sur <Incantation: 2>.
                    // Le tour où le compte s'achève EST le tour où la Parole part.
                    if (inc.reste > 0) {
                        journal(sujet.name() + ' tient la Parole… encore ' +
                                inc.reste + ' tour' + (inc.reste > 1 ? 's' : '') + '.');
                        flotter(sujet, '🌀 Encore ' + inc.reste + ' t.');
                        sujet.removeCurrentAction();
                        this._phase = 'turn';
                        return;
                    }
                }
                // ③ Le compte est bon : la Parole part
                sujet.removeState(INCANTATION);
                var act = new Game_Action(sujet);
                act.setSkill(inc.skillId);
                if (inc.cible !== undefined && inc.cible >= 0) { act.setTarget(inc.cible); }
                sujet._actions[0] = act;
                sujet._incantation = null;
                sujet._payeeDejaPour = inc.skillId;   // les coûts sont déjà partis
                journal('\\C[14]' + sujet.name() + ' achève sa Parole.\\C[0]');
                flotter(sujet, '✦ La Parole part');
                _startAction.call(this);
                return;
            }

            // ④ Elle lance une Parole longue : on annonce au lieu de frapper.
            //   [raccord LaBibliothequeDAel v2] une Parole LUE dans son livre
            //   a une charge de 0, comme sous le bon ciel : elle part tout de suite.
            var action = sujet.currentAction();
            var lue = action && sujet.paroleLue && sujet.paroleLue(action.item());
            if (action && action.isSkill() && !lue && chargeReelle(action.item()) > 0) {
                annoncer(sujet, action);
                sujet.removeCurrentAction();
                this._phase = 'turn';
                return;
            }
        }
        _startAction.call(this);
    };

    // Les coûts ne se paient pas deux fois : ils sont partis à l'annonce.
    var _useItem = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function (item) {
        if (item && this._payeeDejaPour === item.id) {
            this._payeeDejaPour = null;
            return;                                 // déjà payé au moment de l'annonce
        }
        _useItem.call(this, item);
    };

    //=========================================================================
    // La rupture
    //=========================================================================
    var _onDamage = Game_Battler.prototype.onDamage;
    Game_Battler.prototype.onDamage = function (value) {
        _onDamage.call(this, value);
        var inc = this._incantation;
        if (!inc || value <= 0) { return; }
        inc.encaisse += value;
        var max = this.mhp || inc.total || 1;
        if (SEUIL_COUP > 0 && value >= max * SEUIL_COUP) {
            rompre(this, 'le coup a porté');
        } else if (SEUIL_CUMUL > 0 && inc.encaisse >= max * SEUIL_CUMUL) {
            rompre(this, 'elle a trop encaissé');
        }
    };

    // Tout ce qui l'empêche d'agir lui coupe la parole. On ne tient pas une
    // liste de numéros : on demande au moteur qui restreint.
    var _addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        _addState.call(this, stateId);
        if (stateId === INCANTATION || !this._incantation) { return; }
        var st = $dataStates[stateId];
        if (st && st.restriction >= 1) { rompre(this, st.name.trim()); }
    };

    // Morte ou sortie du combat, l'incantation s'éteint proprement.
    var _onBattleEnd = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function () {
        this._incantation = null;
        this._incantationRompue = null;
        this._payeeDejaPour = null;
        _onBattleEnd.call(this);
    };

    //=========================================================================
    // L'Appel : elle pose le ciel · et la Surcharge : elle le paie
    //=========================================================================
    var _applyGlobal = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function () {
        _applyGlobal.call(this);
        var item = this.item();
        var a = appel(item);
        if (a && $gameScreen) {
            $gameScreen.changeWeather(a.type, a.type === 'none' ? 0 : 7, 30);
            journal('\\C[14]Le ciel change : ' + nomCiel(a.type) + '.\\C[0]');
            flotter(this.subject(), '☁ Le ciel : ' + nomCiel(a.type));
        }
        if (faitSurcharge(item) && this.subject()) {
            this.subject().addState(SURCHARGE);
        }
    };

    //=========================================================================
    // Voir le ciel en combat
    //=========================================================================
    // Mesuré : $gameScreen.weatherType() traverse l'entrée en combat, mais MV
    // ne crée son Weather que dans Spriteset_Map. Sans ça, la joueuse joue une
    // mécanique du ciel sans voir le ciel.
    var _createLower = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function () {
        _createLower.call(this);
        if (!this._cielMV) {
            this._cielMV = new Weather();
            this.addChild(this._cielMV);
        }
    };

    var _updateSpriteset = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function () {
        _updateSpriteset.call(this);
        if (this._cielMV) {
            this._cielMV.type = $gameScreen.weatherType();
            this._cielMV.power = $gameScreen.weatherPower();
            this._cielMV.origin.x = 0;
            this._cielMV.origin.y = 0;
        }
    };
})();
