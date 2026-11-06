/*============================================================================
 *    ## Plugin Info                                                          
 *----------------------------------------------------------------------------
 *    # Plugin Name                                                           
 *      DoubleX RMMV Unison Item YEP_X_BattleSysCTB                           
 *----------------------------------------------------------------------------
 *    # Terms Of Use                                                          
 *      You shall keep this plugin's Plugin Info part's contents intact       
 *      You shalln't claim that this plugin's written by anyone other than    
 *      DoubleX or his aliases                                                
 *      None of the above applies to DoubleX or his aliases                   
 *----------------------------------------------------------------------------
 *    # Prerequisites                                                         
 *      Plugins:                                                              
 *      1. Yanfly Engine Plugins - Battle System - Charge Turn Battle         
 *      2. DoubleX RMMV Unison Item Config                                    
 *      3. DoubleX RMMV Unison Item Default                                   
 *----------------------------------------------------------------------------
 *    # Links                                                                 
 *      This plugin:                                                          
 *      1. http://pastebin.com/frvi7pid                                       
 *      Video:                                                                
 *      1. https://www.youtube.com/watch?v=spAq2xP8sbM                        
 *----------------------------------------------------------------------------
 *    # Instructions                                                          
 *      1. Place DoubleX RMMV Unison Item Config below YEP_BattleEngineCore   
 *      2. Place this plugin below DoubleX RMMV Unison Item Default           
 *----------------------------------------------------------------------------
 *    # Author                                                                
 *      DoubleX                                                               
 *----------------------------------------------------------------------------
 *    # Changelog                                                             
 *      v1.00c(GMT 0600 21-5-2016):                                           
 *      1. Fixed BattleManager.asyncUnisonItems not using unique key          
 *      2. Fixed not clearing actors in BattleManager.asyncUnisonItems        
 *      v1.00b(GMT 1300 14-5-2016):                                           
 *      1. In sync with the latest version of DoubleX RMMV Unison Item Config 
 *      v1.00a(GMT 1500 28-2-2016):                                           
 *      1. 1st version of this plugin finished                                
 *      2. Unison skills/items needing charging might be executed immediately 
 *         and/or cause the action order queue to be incorrect and/or outdated
 *============================================================================*/
/*:
 * @plugindesc Lets you use unison skills/items with YEP_X_BattleSysCTB
 * @author DoubleX
 * @help
 * Charge Rate -
 * All actors needed for an unison skill/item will always have the same charge
 * value when charging that skill/item
 * unisonFunctionRule is used to set the unison charge rate for those actors
 * 
 * Action Order Queue -
 * Suppose an unison skill/item needs actors a1 and a2.
 * The below definition will be used for synchronous unison skills/items:
 * All battlers are next to each other - No other battlers are in between any
 * of those battlers in the battler turn order queue.
 * For example:
 * 1. If the battler turn order queue is a1, a2, b1 or a2, a1, b1, then a1 and
 *    a2 are next to each other. This still applies if a1 or a2 is charging an
 *    action, although it'll be replaced by the unison one instead
 * 2. If the battler turn order queue is a1, b1, a2 or a2, b1, a1, then a1 and
 *    a2 aren't next to each other.
 * That skill/item will be usable only if a1 and a2 are next to each other.
 * 
 * Right after using that skill/item:
 * 1. If the battler turn order queue was a1, a2, b1 or a2, a1, b1, then it'll
 *    become b1
 * 
 * Asynchronous unison skills/items:
 * Right now asynchoronous unison skills/items won't work without charging    
 * An asynchoronous unison skill/item is inputable by any battler needed by
 * that skill/item as long as all the needed battlers are alive and pass the
 * skill learn requirements for skills if any, and that battler passes the
 * ordinary skill/item usability checks
 * Battlers having inputted asynchronous unison skills/items will wait for all
 * needed battlers to input those unison skills/items to execute them together
 * They'll stop waiting if any needed battler's not alive
 *============================================================================
 */

/*============================================================================
 *    [JOKO 2026-10-18] Copie corrigée pour le jeu de JOKO (original gardé dans
 *    Documents\RPG Maker). Ce module remplace selectNextCommand et endCTBAction
 *    de YEP_X_BattleSysCTB : comparées à la v1.17 du jeu, ses copies sont les
 *    mêmes à la ligne près (celle de l'unison). Corrections marquées [JOKO] :
 *     1. Une action NORMALE prend exactement le chemin de Yanfly (setupCTBCharge,
 *        endTurnAllCTB) — avant, elle passait par un setupCTBCharge sans les
 *        gardes de Yanfly (pas d'action → plantage : un tour sauté, un ennemi
 *        brisé…) ;
 *     2. une sauvegarde sans les listes d'unison ne plante plus le décompte ;
 *     3. canUseUnisonItem lisait « skill » au lieu de « item » (ReferenceError) ;
 *     4. actionCastAnimation recopiait celle de YEP_BattleEngineCore : une action
 *        normale passe maintenant par la version d'avant (rien ne se perd si un
 *        autre plugin la modifie un jour) ;
 *     5. Game_Actor.selectNextCommand (qui remplace celle du module Default)
 *        laisse d'abord passer la version d'avant : CombatTactique y ajoute
 *        l'action en plus d'une compétence <Instantané>, que ce module coupait.
 *============================================================================*/
var DoubleX_RMMV = DoubleX_RMMV || {};
DoubleX_RMMV["Unison Item YEP_X_BattleSysCTB"] = 'v1.00c';

/*============================================================================
 *    ## Plugin Implementations                                               
 *       You need not edit this part as it's about how this plugin works      
 *----------------------------------------------------------------------------
 *    # Plugin Support Info:                                                  
 *      1. Prerequisites                                                      
 *         - Solid understanding to the default RMMV actor action input flows 
 *         - Decent Javascript coding proficiency to fully comprehend this    
 *           plugin                                                           
 *      2. Function documentation                                             
 *         - The 1st part describes why this function's rewritten/extended for
 *           rewritten/extended functions or what the function does for new   
 *           functions                                                        
 *         - The 2nd part describes what the arguments of the function are    
 *         - The 3rd part informs which version rewritten, extended or created
 *           this function                                                    
 *         - The 4th part informs whether the function's rewritten or new     
 *         - The 5th part informs whether the function's a real or potential  
 *           hotspot                                                          
 *         - The 6th part describes how this function works for new functions 
 *           only, and describes the parts added, removed or rewritten for    
 *           rewritten or extended functions only                             
 *         Example:                                                           
 * /*----------------------------------------------------------------------
 *  *    Why rewrite/extended/What this function does                      
 *  *----------------------------------------------------------------------*/ 
/* // arguments: What these arguments are                                     
 * functionName = function(arguments) { // Version X+; Hotspot                
 *     // Added/Removed/Rewritten to do something/How this function works     
 *     functionContents                                                       
 *     //                                                                     
 * } // functionName                                                          
 *----------------------------------------------------------------------------*/

if (DoubleX_RMMV["Unison Item Config"]) {

if (DoubleX_RMMV["Unison Item Default"]) {

if (Imported.YEP_X_BattleSysCTB) {

(function(UI, CTB) {

    'use strict';

    CTB.BattleManager = {};
    var BMCTB = CTB.BattleManager;

    /*------------------------------------------------------------------------
     *    New public instance variable                                        
     *------------------------------------------------------------------------*/
    // The cached mapping from async unison skills/items to all inputted actors
    Object.defineProperty(BattleManager, 'asyncUnisonItems', {
        get: function() { return this._asyncUnisonItems; },
        configurable: true
    });

    BMCTB.actionCastAnimation = BattleManager.actionCastAnimation;   // [JOKO]
    BattleManager.actionCastAnimation = function() {
      // [JOKO] une action normale : la version d'avant (YEP_BattleEngineCore)
      if (UI.acteurs(this._action && this._action.item()).length <= 1) {
          return BMCTB.actionCastAnimation.apply(this, arguments);
      }
      if (!$gameSystem.isSideView() && this._subject.isActor()) return true;
      if (!this._action.isAttack() && !this._action.isGuard() &&
      this._action.isSkill()) {
        // Rewritten
        var ani = this._action.item().castAnimation;
        if (ani > 0) {
          var actorIds = UI.acteurs(this._action.item());   // [JOKO]
          if (actorIds.length > 1) {
              var actors = actorIds.map(function(actorId) {
                  return $gameActors.actor(actorId);
              });
              this._logWindow.showAnimation(this._subject, actors, ani);
          } else {
              this._logWindow.showAnimation(this._subject, [this._subject], ani);
          }
        }
        //
      }
      return true;
    }; //BattleManager.actionCastAnimation

    BattleManager.endCTBAction = function() {
        if (Imported.YEP_BattleEngineCore) {
          if (this._processingForcedAction) this._phase = this._preForcePhase;
          this._processingForcedAction = false;
        }
        if (this._subject) this._subject.onAllActionsEnd();
        if (this.updateEventMain()) return;
        BMCTB.endCTBAct.call(this); // Rewritten
        if (this.loadPreForceActionSettings()) return;
        var chargedBattler = this.getChargedCTBBattler();
        if (chargedBattler) {
          this.startCTBAction(chargedBattler);
        } else {
          this.setCTBPhase();
        }
    }; // BattleManager.endCTBAction

    BMCTB.setup = BattleManager.setup;
    BattleManager.setup = function(troopId, canEscape, canLose) { // v1.00b+
        BMCTB.setup.apply(this, arguments);
        this._asyncUnisonItems = {}; // Added
    }; // BattleManager.setup

    BMCTB.selectNextCommand = BattleManager.selectNextCommand;
    BattleManager.selectNextCommand = function() {
        if (this.isCTB()) {
          if (!this.actor()) return this.setCTBPhase();
          this.resetNonPartyActorCTB();
          this._subject = this.actor();
          BMCTB.setupCTBCharge.call(this); // Rewritten
          if (this.actor().isCTBCharging()) {
            this.actor().spriteStepBack();
            this.actor().requestMotionRefresh();
            this._actorIndex = undefined;
            this.setCTBPhase();
          } else if (this.isValidCTBActorAction()) {
            this.startCTBAction(this.actor());
          } else {
            if (this.actor()) this.ctbSkipTurn();
            $gameParty.requestMotionRefresh();
            this.setCTBPhase();
          }
        } else {
          BMCTB.selectNextCommand.apply(this, arguments);
        }
    }; // BattleManager.selectNextCommand

    /*------------------------------------------------------------------------
     *    Removes battlers that are no longer waiting for async unison item   
     *------------------------------------------------------------------------*/
    // battler: The battler needed for a marked async unison skill/item
    BMCTB.removeAsyncUnisonBattler = function(battler) { // v1.00b+
        if (!this._asyncUnisonItems) return;
        var index;
        // The 1st actor in the async unison skill/item actor list's the invoker
        Object.keys(this._asyncUnisonItems).forEach(function(itemId) {
            index = this._asyncUnisonItems[itemId].indexOf(battler);
            if (index > 0) { this._asyncUnisonItems[itemId].splice(index, 1); }
        }, this);
        //
    }; // BMCTB.removeAsyncUnisonActor

    /*------------------------------------------------------------------------
     *    Ends the CTB Turn for all unison actors if unison skill/item's used 
     *------------------------------------------------------------------------*/
    BMCTB.endCTBAct = function() {
        var act = this._action, func = 'endTurnAllCTB';
        // [JOKO] action normale (ou pas d'action) : exactement Yanfly
        var item = act && act.item();
        if (UI.acteurs(item).length <= 1) { return this._subject.endTurnAllCTB(); }
        this._asyncUnisonItems = this._asyncUnisonItems || {};
        this._asyncUnisonItems[item.id] = [];
        BMCTB.callUnisonActors.call(this, this._subject, act, func);
    }; // BMCTB.endCTBAct

    /*------------------------------------------------------------------------
     *    Ends the CTB Turn for all unison actors if unison skill/item's used 
     *------------------------------------------------------------------------*/
    BMCTB.setupCTBCharge = function() {
        // [JOKO] action normale : exactement le setupCTBCharge de Yanfly (avec ses gardes)
        var act = this._subject.inputtingAction() || this._subject.currentAction();
        var item = act && act.item();
        if (UI.acteurs(item).length <= 1) {
            this._subject._unisonItemActors = [];
            return this._subject.setupCTBCharge();
        }
    	GBBCTB.markUnisonActors.call(this._subject); // Marks the unison invoker
    	var fun = 'setupUnisonCTBCharge';
    	if (item.meta.asyncUnisonItem) { return this._subject[fun](); }
    	BMCTB.callUnisonActors.call(this, this._subject, act, fun);
    }; // BMCTB.setupCTBCharge

    /*------------------------------------------------------------------------
     *    Asks each unison actor of act to call its battler function func     
     *------------------------------------------------------------------------*/
    /* invoker: The unison invoker
     * act: The unison action
     * func: The battler function to be called by all unison actors
     */
    BMCTB.callUnisonActors = function(invoker, act, func) {
    	invoker[func]();
        var item = act.item();
        if (!item) { return; }
        var actorIds = UI.acteurs(item);   // [JOKO]
        if (actorIds.length <= 1) { return; }
        // Sets the current action of all unison invokees as the unison action
        var actor;
        actorIds.forEach(function(actorId) {
            if (actorId === invoker.actorId()) { return; }
            actor = $gameActors.actor(actorId);
            if (!actor) { return; }
            GACTB.setUnisonAct.call(actor, item);
            actor[func]();
        });
        //
    }; // BMCTB.callUnisonActors

    /*------------------------------------------------------------------------
     *    Checks if the actors can be regarded as unison actors               
     *------------------------------------------------------------------------*/
    /* invoker: The unison invoker
     * actorIds: The list of id of unison actors
     */
    BMCTB.isUnisonTurnOrder = function(invoker, actorIds) {
        // Checks if all unison actors are next to each other
        var battlers = this.ctbTurnOrder(), battler, actors = [];
        for (var index = 0, length = battlers.length; index < length; index++) {
            battler = battlers[index];
            if (battler === invoker) { continue; }
            if (!battler.isActor()) { return false; }
            if (actorIds.indexOf(battler.actorId()) < 0) { return false; }
            if (actors.indexOf(battler) < 0) { actors.push(battler); }
            if (actors.length >= actorIds.length - 1) { return true; }
        }
        //
    }; // BMCTB.isUnisonTurnOrder

    var GBB = UI.Game_BattlerBase;
    CTB.Game_BattlerBase = {};
    var GBBCTB = CTB.Game_BattlerBase;

    Game_BattlerBase.prototype.canInput = function() {
        if (!GBB.canInput.apply(this, arguments)) { return false; }
        if (BattleManager.isCTB()) { return true; } // Added
        if (!this.isActor() || !$gameParty.inBattle()) { return true; }
        return this._unisonItemNumInputs < this._actions.length;
    }; // Game_BattlerBase.prototype.canInput

    GBBCTB.canUseUnisonSkill = GBB.canUseUnisonSkill;
    GBB.canUseUnisonSkill = function(skill) {
        // Rewritten to check if all unison actors are next to each other
        if (!BattleManager.isCTB()) {
            return GBBCTB.canUseUnisonSkill.apply(this, arguments);
        }
        var mems = $gameParty.aliveMembers();
        var actor, actorIds = skill.meta.unisonItemActors;
        var async = skill.meta.asyncUnisonItem;
        var learnFlags = skill.meta.unisonItemActorLearn || [];   // [JOKO]
        for (var index = 0, length = actorIds.length; index < length; index++) {
            actor = mems.filter(function(mem) {
                return mem.actorId() === actorIds[index];
            })[0];
            if (!actor) { return false; }
            if (!async && !actor.meetsSkillConditions(skill)) { return false; }
            if (learnFlags[index] && actor.skills().every(function(s) {
                return s !== skill;
            })) { return false; }
        }
        if (async || !$gameParty.inBattle()) { return true; }
        return BMCTB.isUnisonTurnOrder.call(BattleManager, this, actorIds);
        //
    }; // GBB.canUseUnisonSkill

    GBBCTB.canUseUnisonItem = GBB.canUseUnisonItem;
    GBB.canUseUnisonItem = function(item) {
        // Rewritten to check if all unison actors are next to each other
        if (!BattleManager.isCTB()) {
            return GBBCTB.canUseUnisonItem.apply(this, arguments);
        }
        if (!this.meetsItemConditions(item)) { return false; }
        var mems = $gameParty.aliveMembers();
        var actor, actorIds = item.meta.unisonItemActors;
        for (var index = 0, length = actorIds.length; index < length; index++) {
            if (actorIds[index] === this.actorId()) { continue; }
            if (!mems.filter(function(mem) {
                return mem.actorId() === actorIds[index];
            })[0]) { return false; }
        }
        if (!$gameParty.inBattle()) { return true; }
        if (item.meta.asyncUnisonItem) { return true; }   // [JOKO] « skill » n'existait pas ici
        return BMCTB.isUnisonTurnOrder.call(BattleManager, this, actorIds);
        //
    }; // GBB.canUseUnisonItem
    
    GBBCTB.markUnisonActors = function() {
        var act = this.currentAction(), item = act && act.item();   // [JOKO] sans action : rien
        if (!item) { return; }
        this._unisonItemActors = UI.acteurs(item);
        if (!item.meta.asyncUnisonItem) { return; }
        return GBBCTB.markAsyncUnisonItemActors.call(this, item);
    }; // GBBCTB.markUnisonActors

    /*------------------------------------------------------------------------
     *    Executes the async unison item when all unison actors inputted it   
     *------------------------------------------------------------------------*/
    // item: The current async unison skill/item
    GBBCTB.markAsyncUnisonItemActors = function(item) { // v1.00b+
        if (!BattleManager.asyncUnisonItems[item.id]) {
            BattleManager.asyncUnisonItems[item.id] = [];
        }
        var actors = BattleManager.asyncUnisonItems[item.id];
        // The 1st actor in the async unison skill/item actor list's the invoker
        actors.push(this);
        if (actors.length !== this._unisonItemActors.length) { return; }
        var act = this.currentAction(), func = 'setupUnisonCTBCharge';
        BMCTB.callUnisonActors.call(BattleManager, actors[0], act, func);
        //
    }; // GBBCTB.markAsyncUnisonItemActors

    CTB.Game_Battler = {};
    var GBCTB = CTB.Game_Battler;

    /*------------------------------------------------------------------------
     *    New public instance variables                                       
     *------------------------------------------------------------------------*/
    Object.defineProperties(Game_Battler.prototype, {
        // The cached list of ids of all unison actors
        'unisonItemActors': {
            get: function() { return this._unisonItemActors; },
            set: function(actorIds) { this._unisonItemActors = actorIds; },
            configurable: true
        },
        // The flag showing whether the unison skill/item can be executed
        'isUnisonItemReady': {
            get: function() { return this._isUnisonItemReady; },
            configurable: true
        }
    });

    GBCTB.initMembers = Game_Battler.prototype.initMembers;
    Game_Battler.prototype.initMembers = function() {
        GBCTB.initMembers.apply(this, arguments);
        GBCTB.resetUnisonItem.call(this); // Added
    }; // Game_Battler.prototype.initMembers

    GBCTB.onAllActionsEnd = Game_Battler.prototype.onAllActionsEnd;
    Game_Battler.prototype.onAllActionsEnd = function() {
        GBCTB.onAllActionsEnd.apply(this, arguments);
        GBCTB.resetUnisonItem.call(this); // Added
    }; // Game_Battler.prototype.onAllActionsEnd

    GBCTB.resetAllCTB = Game_Battler.prototype.resetAllCTB;
    Game_Battler.prototype.resetAllCTB = function() {
        GBCTB.resetAllCTB.apply(this, arguments);
        GBCTB.resetUnisonItem.call(this); // Added
    }; // Game_Battler.prototype.resetAllCTB

    Game_Battler.prototype.setupUnisonCTBCharge = function() { // New
        if (BattleManager._bypassCtbEndTurn) { return; }
        if (!this.currentAction()) { this.makeActions(); }   // [JOKO] la garde de Yanfly
        var item = this.currentAction() && this.currentAction().item();
        if (item && item.speed < 0) {
            this.setCTBCharging(true);
            this._ctbChargeMod = item.speed;
            this.setCTBCharge(0);
        } else {
            this._ctbChargeMod = 0;
        }
        this.setActionState('waiting');
        this._isUnisonItemReady = UI.acteurs(item).length > 1;   // [JOKO]
    }; // Game_Battler.prototype.setupUnisonCTBCharge

    GBCTB.resetUnisonItem = function() { // v1.00b+
        this._unisonItemActors = [];
        this._isUnisonItemReady = false;
        BMCTB.removeAsyncUnisonBattler.call(BattleManager, this);
    }; // GBCTB.resetUnisonItem

    /*------------------------------------------------------------------------
     *    Ensures the charging value is the same for all unison actors        
     *------------------------------------------------------------------------*/
    GBCTB.updateUnisonTick = function() {
        var actors = this._unisonItemActors.map(function(actorId) {
            return $gameActors.actor(actorId);
        });
        if (!actors.every(function(actor) { return actor.isAlive(); })) {
            this.resetAllCTB();
            return;
        } else if (!actors.every(function(actor) {
            return actor.isUnisonItemReady && actor.isCTBCharging();
        })) {
            this.setCTBCharge(0);
            return;
        }
        var minDiff = Number.EPSILON * this.ctbChargeDestination();
        var rule = $gameSystem.unisonItem.unisonFunctionRule;
        var val = UI.RULES.call(this, rule, actors.map(function(actor) {
            return actor.ctbCharge();
        }));
        actors.forEach(function(actor) {
            // Ensures the unison invoker will always be the fastest
            if (actor === this) { val += minDiff; }
            //
            actor.setCTBCharge(val);
        }, this);
    };

    var GA = UI.Game_Actor;
    CTB.Game_Actor = {};
    var GACTB = CTB.Game_Actor;

    Game_Actor.prototype.selectNextCommand = function() {
        // [JOKO] la version d'avant d'abord (CombatTactique y ajoute l'action en plus
        // d'une compétence instantanée) ; puis, hors CTB et comme l'original, une case
        // réservée à une attaque combinée reste fermée (index + réservées >= max)
        var reserve = BattleManager.isCTB() ? 0 : Math.max(0, this._unisonItemNumInputs || 0);
        var suivant = GA.selectNextCommand.apply(this, arguments);
        if (suivant && reserve > 0 && this._actionInputIndex + reserve > this._actions.length - 1) {
            this._actionInputIndex--;
            return false;
        }
        return suivant;
    }; // Game_Actor.prototype.selectNextCommand

    /*------------------------------------------------------------------------
     *    Pretends that all unison invokees have indeed executed a real action
     *------------------------------------------------------------------------*/
    // item: The unison skill/item to be set
    GACTB.setUnisonAct = function(item) {
        this.makeActions();
        if (DataManager.isSkill(item)) {
            return this.currentAction().setSkill(item.id);
        } else if (DataManager.isItem(item)) {
            return this.currentAction().setItem(item.id);
        }
        this.clearActions(); // It's just to play safe
    }; // GACTB.setUnisonAct

    /*------------------------------------------------------------------------
     *    Ensures the charging value is the same for all unison actors        
     *------------------------------------------------------------------------*/
    Game_Party.prototype.updateTick = function() { // New
        Game_Unit.prototype.updateTick.call(this);
        this.aliveMembers().filter(function(mem) {
            return (mem.unisonItemActors || []).length > 1;   // [JOKO] vieille sauvegarde : pas de liste
        }).forEach(function(mem) { GBCTB.updateUnisonTick.call(mem); });
    }; // Game_Party.prototype.updateTick

    var WBL = UI.Window_BattleLog;

    Window_BattleLog.prototype.displayAction = function(subject, item) {
        WBL.displayAction.apply(this, arguments); // Rewritten
    }; // Window_BattleLog.prototype.displayAction

})(DoubleX_RMMV.Unison_Item, DoubleX_RMMV.Unison_Item_YEP_X_BattleSysCTB = {});

} else {
    alert('Place Unison Item YEP_X_BattleSysCTB below YEP_X_BattleSysCTB.');
}

} else {
    alert('Place Unison Item YEP_X_BattleSysCTB below Unison Item Default.');
}

} else {
    alert('Place Unison Item YEP_X_BattleSysCTB below Unison Item Config.');
}

/*============================================================================*/