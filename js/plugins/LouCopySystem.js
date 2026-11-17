//=============================================================================
// LouCopySystem.js — v1.0
// Système « Copie » & « Aspiration des Âmes » de Lou (RPG Maker MV)
// by JOKO
//=============================================================================

/*:
 * @plugindesc v1.0 ■ Lou : copie les techniques ennemies (2x de suite), 4 slots
 * aléatoires à usage unique (spam en Domaine) + aspiration des âmes damnées.
 * @author JOKO
 *
 * @param louActorId
 * @text ID Acteur — Lou
 * @type actor
 * @default 3
 *
 * @param copySkillId
 * @text Skill « Copy_Paste »
 * @type skill
 * @default 86
 * @desc Compétence que Lou lance pour exécuter une technique copiée au hasard.
 *
 * @param maxSlots
 * @text Nombre d'emplacements
 * @type number
 * @min 1
 * @default 4
 *
 * @param weakenRate
 * @text Puissance des copies (%)
 * @type number
 * @min 1
 * @max 100
 * @default 60
 * @desc Les techniques copiées font ce % de leurs dégâts d'origine (« moins fort »).
 *
 * @param domainStateId
 * @text État Domaine (spam)
 * @type state
 * @default 39
 * @desc Tant que Lou a cet état (Royaume Impérial), ses copies ne sont PAS consommées.
 *
 * @param copyChance
 * @text Probabilité de copie (%)
 * @type number
 * @min 1
 * @max 100
 * @default 100
 * @desc Chance de copier quand un ennemi répète une technique 2 fois de suite.
 *
 * @param --- ASPIRATION DES ÂMES ---
 * @default
 *
 * @param soulVar
 * @text Variable — Âmes Damnées
 * @type variable
 * @default 15
 *
 * @param mentalVar
 * @text Variable — Santé mentale Lou
 * @type variable
 * @default 13
 *
 * @param aspirationSkillId
 * @text Skill d'Aspiration (optionnel)
 * @type skill
 * @default 0
 * @desc Skill qui déclenche l'aspiration. 0 = utiliser uniquement le notetag <Aspiration Ames>.
 *
 * @param soulsPerCast
 * @text Âmes consommées / aspiration
 * @type number
 * @min 0
 * @default 0
 * @desc 0 = consomme toutes les âmes disponibles d'un coup.
 *
 * @param hpPerSoul
 * @text PV régénérés / âme
 * @type number
 * @min 0
 * @default 80
 *
 * @param mpPerSoul
 * @text PM régénérés / âme
 * @type number
 * @min 0
 * @default 15
 *
 * @param mentalGain
 * @text Santé mentale gagnée / aspiration
 * @type number
 * @min 0
 * @default 1
 *
 * @param traumaStateId
 * @text État Trauma
 * @type state
 * @default 32
 *
 * @param traumaChance
 * @text Probabilité de Trauma (%)
 * @type number
 * @min 0
 * @max 100
 * @default 40
 *
 * @param traumaDestab
 * @text Santé mentale perdue si Trauma
 * @type number
 * @min 0
 * @default 2
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LOU — COPIE & ASPIRATION DES ÂMES                                  by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  ▶ COPIE
 *    Quand un ennemi/boss lance DEUX FOIS DE SUITE la même technique, Lou la
 *    copie et la range dans un de ses emplacements (4 max). Au-delà de 4, la
 *    plus ancienne copie est jetée.
 *    Lou lance le skill « Copy_Paste » (param copySkillId) : il exécute alors
 *    UNE de ses techniques copiées AU HASARD, à puissance réduite (weakenRate).
 *    La copie est CONSOMMÉE après usage — SAUF s'il a l'état Domaine
 *    (domainStateId : Royaume Impérial), où il peut spammer sans consommer.
 *    Les copies sont conservées d'un combat à l'autre (banque de techniques).
 *
 *  ▶ ASPIRATION DES ÂMES
 *    Chaque ennemi TUÉ par Lou ajoute +1 à la variable des âmes (soulVar).
 *    Une compétence marquée du notetag suivant déclenche l'aspiration :
 *
 *        <Aspiration Ames>
 *
 *    (ou bien renseigne aspirationSkillId pour lier un skill précis.)
 *    Effet : Lou consomme des âmes pour régénérer PV/PM et un peu de santé
 *    mentale — MAIS il revoit ses traumas : risque (traumaChance) d'état
 *    Trauma + perte de santé mentale (déstabilisation).
 *
 *  ▶ COMMANDES PLUGIN
 *    LOU copies          Affiche les techniques actuellement copiées
 *    LOU clear_copies    Vide le presse-papier de Lou
 *    LOU add_copy <id>   Ajoute manuellement la copie du skill <id>
 *
 *  Dépendances : optionnellement JadeEntitePlunging.js (pour synchroniser la
 *  santé mentale via window.Ame). Fonctionne aussi sans, en pilotant mentalVar.
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('LouCopySystem');

    var LOU_ID      = parseInt(P['louActorId']      || 3);
    var COPY_SKILL  = parseInt(P['copySkillId']     || 86);
    var MAX_SLOTS   = parseInt(P['maxSlots']        || 4);
    var WEAKEN      = parseInt(P['weakenRate']      || 60) / 100;
    var DOMAIN_ST   = parseInt(P['domainStateId']   || 39);
    var COPY_CHANCE = parseInt(P['copyChance']      || 100) / 100;

    var SOUL_VAR    = parseInt(P['soulVar']         || 15);
    var MENTAL_VAR  = parseInt(P['mentalVar']       || 13);
    var ASP_SKILL   = parseInt(P['aspirationSkillId'] || 0);
    var SOULS_CAST  = parseInt(P['soulsPerCast']    || 0);
    var HP_PER_SOUL = parseInt(P['hpPerSoul']       || 80);
    var MP_PER_SOUL = parseInt(P['mpPerSoul']       || 15);
    var MENTAL_GAIN = parseInt(P['mentalGain']      || 1);
    var TRAUMA_ST   = parseInt(P['traumaStateId']   || 32);
    var TRAUMA_PCT  = parseInt(P['traumaChance']    || 40) / 100;
    var TRAUMA_DEST = parseInt(P['traumaDestab']    || 2);

    // Mémoire de la dernière technique ennemie (pour le « 2 fois de suite »)
    var _lastEnemySkill = null;

    //=========================================================================
    // OUTILS
    //=========================================================================

    function isLou(battler) {
        return !!(battler && battler.isActor && battler.isActor() &&
                  battler.actorId && battler.actorId() === LOU_ID);
    }

    function getLou() {
        return $gameActors.actor(LOU_ID);
    }

    function copySlots(actor) {
        if (!actor._louCopiedSkills) actor._louCopiedSkills = [];
        return actor._louCopiedSkills;
    }

    function battleLog(text) {
        var scene = SceneManager._scene;
        if (scene && scene._logWindow) scene._logWindow.addText(text);
        if (typeof MecaBoss !== 'undefined' && MecaBoss.bandeauDuJournal) { MecaBoss.bandeauDuJournal(String(text).replace(/\bLou\b/g, $gameActors.actor(LOU_ID) ? $gameActors.actor(LOU_ID).name() : 'Lou')); }   // muet en vue de côté : aussi en bandeau (JOKO, 2026-10-23)
    }

    /** Modifie la santé mentale de Lou via Ame si dispo, sinon la variable. */
    function changeMental(delta) {
        if (typeof window.Ame !== 'undefined' && window.Ame) {
            window.Ame.gain(LOU_ID, delta);
        } else if (MENTAL_VAR) {
            var v = $gameVariables.value(MENTAL_VAR) + delta;
            $gameVariables.setValue(MENTAL_VAR, Math.max(1, Math.min(10, v)));
        }
    }

    function skillName(id) {
        var s = $dataSkills[id];
        return s ? s.name : ('Skill ' + id);
    }

    //=========================================================================
    // ACQUISITION D'UNE COPIE (ennemi qui répète une technique)
    //=========================================================================

    function onEnemySkill(skillId) {
        if (_lastEnemySkill === skillId) {
            // 2 fois de suite → tentative de copie
            if (Math.random() < COPY_CHANCE) addCopy(skillId, true);
        }
        _lastEnemySkill = skillId;
    }

    function addCopy(skillId, fromCombat) {
        var lou = getLou();
        if (!lou || !$dataSkills[skillId]) return;
        var slots = copySlots(lou);

        if (slots.indexOf(skillId) !== -1) return; // déjà en mémoire

        slots.push(skillId);
        if (slots.length > MAX_SLOTS) slots.shift(); // FIFO : la plus ancienne saute

        if (fromCombat) {
            battleLog('Lou copie « ' + skillName(skillId) + ' » ! (' +
                      slots.length + '/' + MAX_SLOTS + ')');
        }
    }

    //=========================================================================
    // EXÉCUTION D'UNE COPIE AU HASARD (Lou lance Copy_Paste)
    //=========================================================================

    function transformCopyAction(subject, action) {
        var slots = copySlots(subject);

        if (slots.length === 0) {
            battleLog('Le presse-papier de Lou est vide… rien à coller !');
            action.setSkill(subject.guardSkillId()); // repli : il se défend
            return;
        }

        var idx = Math.floor(Math.random() * slots.length);
        var skillId = slots[idx];

        action.setSkill(skillId);
        subject._louCopyWeaken = true;

        // Consommation, sauf en Domaine (spam autorisé)
        if (!subject.isStateAffected(DOMAIN_ST)) {
            slots.splice(idx, 1);
        }

        battleLog('Lou colle « ' + skillName(skillId) + ' »' +
                  (subject.isStateAffected(DOMAIN_ST) ? ' (Domaine : illimité) !' : ' (copie consommée).'));
    }

    //=========================================================================
    // HOOK — BattleManager.startAction
    // Point d'entrée : détecte les skills ennemis et transforme le Copy_Paste.
    //=========================================================================

    var _BM_startAction = BattleManager.startAction;
    BattleManager.startAction = function () {
        var subject = this._subject;
        var action = subject ? subject.currentAction() : null;

        if (action && action.isSkill() && action.item()) {
            if (subject.isEnemy && subject.isEnemy()) {
                onEnemySkill(action.item().id);
            } else if (isLou(subject) && action.item().id === COPY_SKILL) {
                transformCopyAction(subject, action);
            }
        }

        _BM_startAction.call(this);
    };

    //=========================================================================
    // HOOK — Dégâts réduits pour les copies (« moins fort »)
    //=========================================================================

    var _GA_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var value = _GA_makeDamageValue.call(this, target, critical);
        var subject = this.subject();
        if (subject && subject._louCopyWeaken) {
            value = Math.floor(value * WEAKEN);
        }
        return value;
    };

    var _BM_endAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        if (this._subject) this._subject._louCopyWeaken = false;
        _BM_endAction.call(this);
    };

    //=========================================================================
    // HOOK — Aspiration & banque d'âmes
    //=========================================================================

    /** Marque qui a frappé l'ennemi en dernier (pour attribuer le kill à Lou). */
    var _GA_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _GA_apply.call(this, target);
        if (target && target.isEnemy && target.isEnemy()) {
            target._louLastHit = isLou(this.subject());
        }
    };

    /** Effets sur l'utilisateur : déclenche l'aspiration si le skill la porte. */
    var _GA_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function (target) {
        _GA_applyItemUserEffect.call(this, target);
        if (this.isSkill() && isLou(this.subject()) && isAspiration(this.item())) {
            aspirate(this.subject());
        }
    };

    function isAspiration(item) {
        if (!item) return false;
        if (ASP_SKILL > 0 && item.id === ASP_SKILL) return true;
        return !!(item.meta && item.meta['Aspiration Ames']);
    }

    function aspirate(lou) {
        var souls = $gameVariables.value(SOUL_VAR);
        if (souls <= 0) {
            battleLog('Aucune âme damnée à aspirer.');
            return;
        }

        var used = (SOULS_CAST > 0) ? Math.min(souls, SOULS_CAST) : souls;
        $gameVariables.setValue(SOUL_VAR, souls - used);

        var hp = used * HP_PER_SOUL;
        var mp = used * MP_PER_SOUL;
        lou.gainHp(hp);
        lou.gainMp(mp);
        lou.startDamagePopup();
        changeMental(MENTAL_GAIN);

        battleLog('Lou aspire ' + used + ' âme(s) : +' + hp + ' PV, +' + mp +
                  ' PM, l\'esprit s\'apaise un instant…');

        // Le prix : revoir les traumas
        if (Math.random() < TRAUMA_PCT) {
            if (TRAUMA_ST > 0) lou.addState(TRAUMA_ST);
            changeMental(-TRAUMA_DEST);
            battleLog('…mais les traumas resurgissent ! Lou est déstabilisé.');
        }
    }

    /** Banque une âme quand un ennemi meurt sous les coups de Lou. */
    // ⚠ Sur Game_Enemy : MecaniquesDeBoss (chargé avant) a son propre
    // Game_Enemy.prototype.die, qui appelait la mort de base sans passer par
    // Game_BattlerBase — l'âme n'était jamais capturée.
    var _GBB_die = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function () {
        if (this.isEnemy && this.isEnemy() && this._louLastHit && $gameParty.inBattle()) {
            $gameVariables.setValue(SOUL_VAR, $gameVariables.value(SOUL_VAR) + 1);
            battleLog('Lou capture l\'âme damnée de sa victime. (Âmes : ' +
                      $gameVariables.value(SOUL_VAR) + ')');
        }
        _GBB_die.call(this);
    };

    //=========================================================================
    // RESET PAR COMBAT (la mémoire « 2 fois de suite » ; pas les copies)
    //=========================================================================

    var _BM_startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _lastEnemySkill = null;
        _BM_startBattle.call(this);
    };

    //=========================================================================
    // COMMANDES PLUGIN
    //=========================================================================

    var _GI_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _GI_pluginCommand.call(this, command, args);
        if (String(command).toUpperCase() !== 'LOU') return;

        var lou = getLou();
        switch ((args[0] || '').toLowerCase()) {
            case 'copies':
                var slots = lou ? copySlots(lou) : [];
                var txt = slots.length
                    ? slots.map(function (id) { return skillName(id); }).join(', ')
                    : '(vide)';
                $gameMessage.add('Techniques copiées par Lou : ' + txt);
                break;
            case 'clear_copies':
                if (lou) lou._louCopiedSkills = [];
                break;
            case 'add_copy':
                addCopy(parseInt(args[1]), false);
                break;
        }
    };

})();
