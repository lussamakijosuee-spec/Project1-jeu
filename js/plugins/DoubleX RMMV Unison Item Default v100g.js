/*============================================================================
 *    ## Plugin Info                                                          
 *----------------------------------------------------------------------------
 *    # Plugin Name                                                           
 *      DoubleX RMMV Unison Item Default                                      
 *----------------------------------------------------------------------------
 *    # Terms Of Use                                                          
 *      You shall keep this plugin's Plugin Info part's contents intact       
 *      You shalln't claim that this plugin's written by anyone other than    
 *      DoubleX or his aliases                                                
 *      None of the above applies to DoubleX or his aliases                   
 *----------------------------------------------------------------------------
 *    # Prerequisites                                                         
 *      Plugins:                                                              
 *      1. DoubleX RMMV Unison Item Config                                    
 *----------------------------------------------------------------------------
 *    # Links                                                                 
 *      This plugin:                                                          
 *      1. http://pastebin.com/kV33uWeU                                       
 *      Video:                                                                
 *      1. https://www.youtube.com/watch?v=iBeSIPQnRb0                        
 *----------------------------------------------------------------------------
 *    # Instructions                                                          
 *      1. Place this plugin below DoubleX RMMV Unison Item Config            
 *----------------------------------------------------------------------------
 *    # Author                                                                
 *      DoubleX                                                               
 *----------------------------------------------------------------------------
 *    # Changelog                                                             
 *      v1.00g(GMT 0300 5-6-2016):                                            
 *      1. Fixed a bug where game crashes when accessing equips in item menu  
 *      v1.00f(GMT 1300 14-5-2016):                                           
 *      1. Fixed a bug where unison items can have unison invokees with no    
 *         empty action slots                                                 
 *      2. In sync with the latest version of DoubleX RMMV Unison Item Config 
 *      v1.00e(GMT 1500 30-1-2016):                                           
 *      1. Fixed not passing this to canUseUnisonSkill and canUseUnisonItem   
 *      2. Fixed not checking if item exist first in canUse bug               
 *      3. Fixed unison invoker might not have the smallest party member index
 *      v1.00d(GMT 1100 4-1-2016):                                            
 *      1. Fixed all unison item being unusable due to typo bug               
 *      2. Added plugin description and author name in the plugin manager     
 *      v1.00c(GMT 0100 1-1-2016):                                            
 *      1. Fixed undefined SceneManager.scene by using $gameParty.inBattle()  
 *      v1.00b(GMT 0300 26-12-2015):                                          
 *      1. Fixed unison skills/items not usable outside battles bug           
 *      2. Simplified the unison skill usability checks                       
 *      v1.00a(GMT 1400 25-12-2015):                                          
 *      1. 1st version of this plugin finished                                
 *============================================================================*/
/*:
 * @plugindesc Lets you use unison skills/items with the default battle system
 * @author DoubleX
 *============================================================================
 */

var DoubleX_RMMV = DoubleX_RMMV || {};
DoubleX_RMMV["Unison Item Default"] = 'v1.00g';

/*============================================================================
 *    ## Plugin Implementations                                               
 *       You need not edit this part as it's about how this plugin works      
 *----------------------------------------------------------------------------
 *    # Plugin Support Info:                                                  
 *      1. Prerequisites                                                      
 *         - Solid understanding to the default RMMV actor action input flows 
 *         - Decent battled related RMMV plugin developement proficiency to   
 *           fully comprehend this plugin                                     
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

/*============================================================================
 *    [JOKO 2026-10-18] Copie corrigée pour le jeu de JOKO (original gardé dans
 *    Documents\RPG Maker). Corrections marquées [JOKO] : « revenir en arrière »
 *    sans héros en cours ne plante plus ; une compétence sans listes d'unison
 *    (créée pendant la partie) est une compétence normale ; l'action réservée
 *    du partenaire est enfin respectée chez les héros (SeiryuLeFamilier pose son
 *    propre Game_Actor.canInput, qui masquait celui de ce plugin : le partenaire
 *    recevait quand même une commande et jouait en plus de l'attaque combinée) ;
 *    selectNextCommand laisse d'abord passer la version d'avant : CombatTactique
 *    y ajoute l'action en plus d'une compétence <Instantané>, que ce plugin
 *    coupait (le héros ne rejouait plus). Le module CTB, s'il est chargé, remplace
 *    cette fonction par la sienne, corrigée de la même façon.
 *============================================================================*/
if (DoubleX_RMMV["Unison Item Config"]) {

(function(UI) {

    'use strict';

    UI.BattleManager = UI.BattleManager || {};
    var BM = UI.BattleManager;

    /*------------------------------------------------------------------------
     *    New public instance variable                                        
     *------------------------------------------------------------------------*/
    // BM.unisonActors: The mapping between unison actions and unison invokees

    BM.initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function() {
        BM.unisonActors = {}; // Added
        BM.initMembers.apply(this, arguments);
    }; // BattleManager.initMembers

    BM.selectNextCommand = BattleManager.selectNextCommand;
    BattleManager.selectNextCommand = function() {
        BM.addUnisonActors.call(this); // Added to set the action-invokee pair
        BM.selectNextCommand.apply(this, arguments);
    }; // BattleManager.selectNextCommand

    BM.selectPreviousCommand = BattleManager.selectPreviousCommand;
    BattleManager.selectPreviousCommand = function() {
        // Added to ensure this cancelled action can be reserved for unison ones
        var act = this.actor() && this.actor().inputtingAction();   // [JOKO] sans héros : plantait
        if (act) { act.clear(); }
        //
        BM.selectPreviousCommand.apply(this, arguments);
        // Added to clear the action-invokee pair
        if (this.actor()) { BM.eraseUnisonActors(this.actor()); }
        //
    }; // BattleManager.selectPreviousCommand

    BM.startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function() {
        // Added to clears all action-invokee mappings and reserved action slots
        BM.clearUnisonActors.call(this);
        //
        BM.startTurn.apply(this, arguments);
    }; // BattleManager.startTurn

    BM.addUnisonActors = function() {
        var actor = this.actor(), act, item;
        if (actor) { act = actor.inputtingAction(); }
        if (act) { item = act.item(); }
        if (!item || UI.acteurs(item).length <= 1) { return; }   // [JOKO]
        var actorIds = UI.acteurs(item).filter(function(actorId) {
            return actorId !== actor.actorId();
        });
        // Stores the action-invokee pair and reserves 1 action for each of them
        BM.unisonActors[[actor.index(), actor.actionInputIndex]] = actorIds;
        actorIds.forEach(function(actorId) {
            $gameActors.actor(actorId).unisonItemNumInputs += 1;
        });
        //
    }; // BM.addUnisonActors

    // actor: The currently selected actor
    BM.eraseUnisonActors = function(actor) {
        var actorIds = BM.unisonActors[[actor.index(), actor.actionInputIndex]];
        if (!actorIds) { return; }
        // Voids the action-invokee pair and frees 1 action for each of them
        BM.unisonActors[[actor.index(), actor.actionInputIndex]] = null;
        actorIds.forEach(function(actorId) {
            $gameActors.actor(actorId).unisonItemNumInputs -= 1;
        });
        //
    }; // BM.eraseUnisonActors

    BM.clearUnisonActors = function() {
        BM.unisonActors = {};
        // Ensures the unison action usability check will pass upon using it
        $gameParty.movableMembers().forEach(function(mem) {
            mem.unisonItemNumInputs = -1;
        });
        //
    }; // BM.clearUnisonActors

    UI.Game_BattlerBase = UI.Game_BattlerBase || {};
    var GBB = UI.Game_BattlerBase;

    GBB.canInput = Game_BattlerBase.prototype.canInput;
    Game_BattlerBase.prototype.canInput = function() {
        // Rewritten to check if at least 1 action slot isn't reserved
        if (!GBB.canInput.apply(this, arguments)) { return false; }
        if (!this.isActor() || !$gameParty.inBattle()) { return true; }
        return this._unisonItemNumInputs < this._actions.length;
        //
    }; // Game_BattlerBase.prototype.canInput

    // [JOKO] SeiryuLeFamilier (chargé avant) pose Game_Actor.prototype.canInput, qui
    // rappelle le canInput de Game_BattlerBase d'AVANT ce plugin : chez les héros, la
    // version ci-dessus n'était jamais lue. La même règle, posée sur Game_Actor.
    // En CTB, c'est l'ordre des tours qui décide (module CTB) : pas de réservation.
    UI.Game_Actor = UI.Game_Actor || {};
    UI.Game_Actor.canInput = Game_Actor.prototype.canInput;
    Game_Actor.prototype.canInput = function() {
        if (!UI.Game_Actor.canInput.apply(this, arguments)) { return false; }
        if (!$gameParty.inBattle() || (BattleManager.isCTB && BattleManager.isCTB())) { return true; }
        return (this._unisonItemNumInputs || 0) < this._actions.length;
    };

    GBB.canUse = Game_BattlerBase.prototype.canUse;
    Game_BattlerBase.prototype.canUse = function(item) {
        // Rewritten to check if all unison actors can use the unison skill/item
        if (!this.isActor() || !item) {
            return GBB.canUse.apply(this, arguments);
        }
        var actorIds = item.meta.unisonItemActors;
        if (!actorIds || actorIds.length <= 0) {
            return GBB.canUse.apply(this, arguments);
        }
        if (actorIds.indexOf(this.actorId()) < 0) { return false; }
        if (!GBB.canUse.apply(this, arguments)) { return false; }
        if (DataManager.isSkill(item)) {
            return GBB.canUseUnisonSkill.call(this, item);
        }
        return DataManager.isItem(item) && GBB.canUseUnisonItem.call(this, item);
        //
    }; // Game_BattlerBase.prototype.canUse

    GBB.canUseUnisonSkill = function(skill) {
        var actor, actorIds = skill.meta.unisonItemActors;
        var inBattle = $gameParty.inBattle(), mems = $gameParty.aliveMembers();
        var learnFlags = skill.meta.unisonItemActorLearn || [];   // [JOKO]
        // Checks if all needed actors can use the skill and have empty actions
        for (var i = 0, length = actorIds.length; i < length; i++) {
            if (this.actorId() === actorIds[i]) { continue; }
            actor = mems.filter(function(m) {
                return m.index() > this.index() && m.actorId() === actorIds[i];
            }, this)[0];
            if (!actor || inBattle && !actor.canInput()) { return false; }
            if (!actor.meetsSkillConditions(skill)) { return false; }
            if (learnFlags[i] && actor.skills().every(function(s) {
                return s !== skill;
            })) { return false; }
        }
        //
        return true;
    }; // GBB.canUseUnisonSkill

    GBB.canUseUnisonItem = function(item) {
        if (!this.meetsItemConditions(item)) { return false; }
        var actor, actorIds = item.meta.unisonItemActors;
        var inBattle = $gameParty.inBattle(), mems = $gameParty.aliveMembers();
        // The unison invoker's index's smaller than those of all unison invokees
        for (var i = 0, length = actorIds.length; i < length; i++) {
            if (this.actorId() === actorIds[i]) { continue; }
            actor = mems.filter(function(m) {
                return m.index() > this.index() && m.actorId() === actorIds[i];
            }, this)[0];
            if (!actor || inBattle && !actor.canInput()) { return false; }
        }
        //
        return true;
    }; // GBB.canUseUnisonItem

    UI.Game_Actor = UI.Game_Actor || {};
    var GA = UI.Game_Actor;

    /*------------------------------------------------------------------------
     *    New public instance variables                                       
     *------------------------------------------------------------------------*/
    Object.defineProperties(Game_Actor.prototype, {
        // Read by BattleManager to store the unison action-invokees pairs
        'actionInputIndex': {
            get: function() { return this._actionInputIndex; },
            configurable: true
        },
        // The number of empty actions reserved for using unison skills/items
        'unisonItemNumInputs': {
        	get: function() { return this._unisonItemNumInputs; },
            set: function(num) { this._unisonItemNumInputs = num; },
            configurable: true
        }
    });

    GA.initMembers = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function() {
        GA.initMembers.apply(this, arguments);
        this._unisonItemNumInputs = 0; // Added
    }; // Game_Actor.prototype.initMembers

    GA.clearActions = Game_Actor.prototype.clearActions;
    Game_Actor.prototype.clearActions = function() {
        GA.clearActions.apply(this, arguments);
        this._unisonItemNumInputs = 0; // Added
    }; // Game_Actor.prototype.clearActions

    GA.selectNextCommand = Game_Actor.prototype.selectNextCommand;
    Game_Actor.prototype.selectNextCommand = function() {
        // [JOKO] la version d'avant d'abord (CombatTactique y ajoute l'action en plus
        // d'une compétence instantanée) ; puis, comme l'original : une case réservée
        // à une attaque combinée reste fermée (même règle : index + réservées >= max)
        var reserve = Math.max(0, this._unisonItemNumInputs || 0);
        var suivant = GA.selectNextCommand.apply(this, arguments);
        if (suivant && reserve > 0 && this._actionInputIndex + reserve > this._actions.length - 1) {
            this._actionInputIndex--;
            return false;
        }
        return suivant;
    }; // Game_Actor.prototype.selectNextCommand

})(DoubleX_RMMV.Unison_Item);

} else {
    alert('To use Unison Item Default, place it below Unison Item Config.');
}

/*============================================================================*/