//=============================================================================
// CombatFluide.js
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Des combats plus fluides : plus de temps morts, les
 * images chargées d'avance, des animations un peu plus vives, l'avance rapide.
 * @author Projet Trois Sources
 *
 * @param attenteMuette
 * @text Ligne de journal invisible : attente (images)
 * @desc En vue de côté, le journal n'affiche pas ses lignes, mais chacune faisait attendre 16 images. 0 = plus d'attente. 16 = comme avant.
 * @type number
 * @min 0
 * @default 0
 *
 * @param attenteJournal
 * @text Pause du journal (images)
 * @desc La pause que MV met après le nom d'une technique et entre deux étapes. 16 = comme avant.
 * @type number
 * @min 1
 * @default 8
 *
 * @param attenteGeste
 * @text Pause du geste du héros (images)
 * @desc La pause pendant que le héros lève son arme. 20 = comme avant.
 * @type number
 * @min 0
 * @default 12
 *
 * @param cadence
 * @text Animations en combat : images par dessin
 * @desc Combien d'images dure chaque dessin d'une animation, en combat. 4 = comme avant (YEP_CoreEngine). 3 = un quart plus vif.
 * @type number
 * @min 1
 * @max 8
 * @default 3
 *
 * @param precharger
 * @text Charger d'avance les animations du tour
 * @desc Les images des animations se chargent quand la technique est choisie, pas quand elle part (plus d'arrêt à la première fois).
 * @type boolean
 * @default true
 *
 * @param vitesse
 * @text Vitesse des combats (défaut de l'option)
 * @desc 0 = Normale (×1), 1 = Vive (×1,25), 2 = Rapide (×1,5), 3 = Très rapide (×2). Le joueur la change dans les Options.
 * @type number
 * @min 0
 * @max 3
 * @default 0
 *
 * @param avanceRapide
 * @text Avance rapide : multiplicateur
 * @desc Tant que la touche est tenue (ou un doigt posé), les actions défilent à cette vitesse. 1 = pas d'avance rapide.
 * @type number
 * @min 1
 * @max 6
 * @default 3
 *
 * @param touches
 * @text Avance rapide : touches
 * @desc Les touches de MV qui la déclenchent, séparées par des virgules (shift, tab, pageup, pagedown, control…). Pas « ok » : tenue, elle validerait le menu suivant.
 * @default shift
 *
 * @param doigt
 * @text Avance rapide : appui long (souris, doigt)
 * @type boolean
 * @default true
 *
 * @help
 * ============================================================================
 *  JOKO, 2026-11-10 : « Améliore le jeu la fluidité des combats »
 * ============================================================================
 *  Mesuré avant (bancs/navigateur/le_combat_fluide.js, l'équipe contre
 *  Kevératus, trois tours) : une action dure 221 images (3,7 s) en moyenne.
 *  45 % : l'animation. 31 % : des pauses où rien ne bouge. 9 % : les pas.
 *
 *  ① LES TEMPS MORTS. En vue de côté, le journal de combat n'affiche pas ses
 *    lignes (SimpleMsgSideView) — mais chaque ligne faisait quand même
 *    attendre 16 images. Les systèmes des héros en écrivent beaucoup : Korrah
 *    attendait 107 images par action sans rien à l'écran. Une ligne invisible
 *    n'attend plus ; la pause après le nom d'une technique passe de 16 à 8
 *    images, celle du geste de 20 à 12. Les « wait: n » écrits dans une
 *    séquence d'action ne sont pas touchés.
 *
 *  ② LES IMAGES CHARGÉES D'AVANCE. MV charge l'image d'une animation au moment
 *    où elle part : la première fois, le combat s'arrête le temps du
 *    chargement (bien plus long en ligne). Elles se chargent maintenant quand
 *    la technique est choisie, et au début du tour pour celles des ennemis.
 *
 *  ③ LES ANIMATIONS. En combat, chaque dessin dure 3 images au lieu de 4.
 *    Sur la carte, rien ne change.
 *
 *  ④ L'AVANCE RAPIDE. Tant que Maj est tenue (ou un doigt, ou la souris,
 *    posé sur l'écran), les actions défilent ×3. Jamais pendant qu'on
 *    choisit, qu'un message s'affiche, pendant un chant, les effets de
 *    l'avatar d'Ardélia, ou l'écran de victoire.
 *
 *  ⑤ L'OPTION « Vitesse des combats » (Normale, Vive ×1,25, Rapide ×1,5,
 *    Très rapide ×2), dans les Options. Normale par défaut.
 *
 *  Pour un banc : CombatFluide._eteint = true rend tout comme avant.
 *                 CombatFluide._force = n   force la vitesse (avance rapide).
 */
var CombatFluide = window.CombatFluide || {};
window.CombatFluide = CombatFluide;
(function () {
    'use strict';
    var P = PluginManager.parameters('CombatFluide');
    function nb(k, d) { var v = Number(P[k]); return (P[k] === undefined || P[k] === '' || isNaN(v)) ? d : v; }
    var MUETTE = Math.max(0, nb('attenteMuette', 0));
    var JOURNAL = Math.max(1, nb('attenteJournal', 8));
    var GESTE = Math.max(0, nb('attenteGeste', 12));
    var CADENCE = Math.max(1, nb('cadence', 3));
    var PRECHARGER = String(P.precharger || 'true') === 'true';
    var DEFAUT = Math.max(0, Math.min(3, nb('vitesse', 0)));
    var RAPIDE = Math.max(1, nb('avanceRapide', 3));
    var TOUCHES = String(P.touches || 'shift').split(',').map(function (t) { return t.trim(); }).filter(function (t) { return t && t !== 'ok'; });
    var DOIGT = String(P.doigt || 'true') === 'true';
    var NOMS = ['Normale', 'Vive', 'Rapide', 'Très rapide'];
    var FACTEURS = [1, 1.25, 1.5, 2];

    CombatFluide._eteint = false;
    CombatFluide._force = 0;
    CombatFluide.facteurs = FACTEURS;
    function actif() { return !CombatFluide._eteint; }

    //=========================================================================
    // ① Les temps morts
    //=========================================================================
    var _addText = Window_BattleLog.prototype.addText;
    Window_BattleLog.prototype.addText = function (text) {
        var muet = actif() && $gameSystem.isSideView();
        var avant = this._waitCount;
        _addText.call(this, text);
        // la ligne n'est pas affichée : elle n'a rien à faire attendre
        if (muet) this._waitCount = Math.max(avant, MUETTE);
    };
    var _speed = Window_BattleLog.prototype.messageSpeed;
    Window_BattleLog.prototype.messageSpeed = function () {
        return actif() ? JOURNAL : _speed.call(this);
    };
    var _perform = BattleManager.actionPerformAction;
    BattleManager.actionPerformAction = function () {
        var L = this._logWindow, avant = L ? L._waitCount : 0;
        var r = _perform.call(this);
        if (actif() && L && L._waitCount === avant + 20) L._waitCount = avant + GESTE;
        return r;
    };

    //=========================================================================
    // ③ Les animations : un quart plus vives, en combat seulement
    //=========================================================================
    var _rate = Sprite_Animation.prototype.setupRate;
    Sprite_Animation.prototype.setupRate = function () {
        _rate.call(this);
        if (actif() && $gameParty && $gameParty.inBattle() && SceneManager._scene instanceof Scene_Battle) {
            this._rate = Math.min(this._rate, CADENCE);
        }
    };

    //=========================================================================
    // ② Les images chargées d'avance
    //=========================================================================
    function chargerAnimation(id) {
        var a = $dataAnimations[id];
        if (!a) return;
        if (a.animation1Name) ImageManager.loadAnimation(a.animation1Name, a.animation1Hue);
        if (a.animation2Name) ImageManager.loadAnimation(a.animation2Name, a.animation2Hue);
    }
    // les animations qu'une technique peut jouer : la sienne, celles de l'arme
    // pour « attaque normale », et celles que sa séquence d'action nomme
    CombatFluide.animationsDe = function (item, sujet) {
        var ids = [];
        if (!item) return ids;
        if (item.animationId > 0) ids.push(item.animationId);
        else if (item.animationId < 0 && sujet) {
            if (sujet.isActor && sujet.isActor()) { ids.push(sujet.attackAnimationId1()); ids.push(sujet.attackAnimationId2()); }
            else if (window.Yanfly && Yanfly.Param && Yanfly.Param.BECEnemyAtkAni) ids.push(Number(Yanfly.Param.BECEnemyAtkAni));
            else if (sujet.attackAnimationId) ids.push(sujet.attackAnimationId());
        }
        var re = /animation\s+(\d+)/gi, m, note = String(item.note || '');
        while ((m = re.exec(note))) ids.push(Number(m[1]));
        return ids.filter(function (id, i) { return id > 0 && ids.indexOf(id) === i; });
    };
    CombatFluide.precharger = function (item, sujet) {
        if (!PRECHARGER || !actif()) return;
        CombatFluide.animationsDe(item, sujet).forEach(chargerAnimation);
    };
    // quand le joueur choisit sa technique
    var _setSkill = Game_Action.prototype.setSkill;
    Game_Action.prototype.setSkill = function (id) {
        _setSkill.call(this, id);
        if ($gameParty.inBattle()) CombatFluide.precharger($dataSkills[id], this.subject());
    };
    var _setItem = Game_Action.prototype.setItem;
    Game_Action.prototype.setItem = function (id) {
        _setItem.call(this, id);
        if ($gameParty.inBattle()) CombatFluide.precharger($dataItems[id], this.subject());
    };
    // au début du tour : tout ce qui est prévu, des deux côtés
    var _startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        _startTurn.call(this);
        if (!PRECHARGER || !actif()) return;
        $gameParty.battleMembers().concat($gameTroop.members()).forEach(function (b) {
            (b._actions || []).forEach(function (a) { if (a && a.item()) CombatFluide.precharger(a.item(), b); });
        });
    };
    // au début du combat : ce que les ennemis savent faire
    var _startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _startBattle.call(this);
        if (!PRECHARGER || !actif()) return;
        $gameTroop.members().forEach(function (e) {
            var d = e.enemy();
            (d && d.actions || []).forEach(function (ac) { CombatFluide.precharger($dataSkills[ac.skillId], e); });
        });
    };

    //=========================================================================
    // ⑤ L'option « Vitesse des combats »
    //=========================================================================
    ConfigManager.vitesseCombat = DEFAUT;
    var _mk = ConfigManager.makeData;
    ConfigManager.makeData = function () { var c = _mk.call(this); c.vitesseCombat = this.vitesseCombat; return c; };
    var _ap = ConfigManager.applyData;
    ConfigManager.applyData = function (c) {
        _ap.call(this, c);
        var v = Number(c.vitesseCombat);
        this.vitesseCombat = (c.vitesseCombat === undefined || isNaN(v)) ? DEFAUT : Math.max(0, Math.min(3, Math.round(v)));
    };
    var _go = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function () { _go.call(this); this.addCommand('Vitesse des combats', 'vitesseCombat'); };
    var _st = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function (index) {
        if (this.commandSymbol(index) === 'vitesseCombat') return NOMS[this.getConfigValue('vitesseCombat')] || NOMS[0];
        return _st.call(this, index);
    };
    function bouger(fen, sens, boucle) {
        var v = Number(fen.getConfigValue('vitesseCombat')) + sens;
        if (boucle) v = (v + 4) % 4; else v = Math.max(0, Math.min(3, v));
        fen.changeValue('vitesseCombat', v);
    }
    var _ok = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function () {
        if (this.commandSymbol(this.index()) === 'vitesseCombat') return bouger(this, 1, true);
        _ok.call(this);
    };
    var _droite = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function (wrap) {
        if (this.commandSymbol(this.index()) === 'vitesseCombat') return bouger(this, 1, false);
        _droite.call(this, wrap);
    };
    var _gauche = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function (wrap) {
        if (this.commandSymbol(this.index()) === 'vitesseCombat') return bouger(this, -1, false);
        _gauche.call(this, wrap);
    };

    //=========================================================================
    // ④ L'avance rapide, et la vitesse : des mises à jour en plus par image
    //=========================================================================
    var PHASES = { turn: 1, action: 1, phaseChange: 1, actionList: 1, actionTargetList: 1, turnEnd: 1 };
    // peut-on accélérer maintenant ? Seulement pendant que les actions se jouent.
    CombatFluide.peutAccelerer = function (scene) {
        if (!actif()) return false;
        if (!scene || !scene.isActive() || scene._fadeDuration > 0) return false;
        if (!PHASES[BattleManager._phase]) return false;
        if (BattleManager.isInputting() || BattleManager._victoryPhase) return false;
        if ($gameMessage.isBusy()) return false;
        if (window.LAvatar && LAvatar.bloque && LAvatar.bloque()) return false;
        return true;
    };
    CombatFluide.toucheTenue = function () {
        for (var i = 0; i < TOUCHES.length; i++) if (Input.isPressed(TOUCHES[i])) return true;
        return DOIGT && TouchInput.isLongPressed();
    };
    CombatFluide.facteur = function (scene) {
        if (!CombatFluide.peutAccelerer(scene)) return 1;
        if (CombatFluide._force > 0) return CombatFluide._force;
        var f = FACTEURS[ConfigManager.vitesseCombat] || 1;
        if (RAPIDE > 1 && CombatFluide.toucheTenue()) { CombatFluide._tenue = true; f = Math.max(f, RAPIDE); }
        return f;
    };
    var _reste = 0;
    var _update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        _update.call(this);
        var f = CombatFluide.facteur(this);
        if (f <= 1) {
            _reste = 0;
            // le doigt encore posé quand on rend la main : il ne doit rien valider
            if (CombatFluide._tenue) { CombatFluide._tenue = false; if (DOIGT && TouchInput.isPressed()) TouchInput.clear(); }
            return;
        }
        _reste += f - 1;
        while (_reste >= 1) {
            _reste -= 1;
            if (SceneManager._scene !== this || SceneManager.isSceneChanging()) break;
            if (!CombatFluide.peutAccelerer(this)) break;
            _update.call(this);
            CombatFluide._enPlus = (CombatFluide._enPlus || 0) + 1;
        }
    };
})();
