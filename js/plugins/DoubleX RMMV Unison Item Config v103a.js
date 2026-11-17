/*============================================================================
 *    ## Plugin Info                                                          
 *----------------------------------------------------------------------------
 *    # Plugin Name                                                           
 *      DoubleX RMMV Unison Item Config                                       
 *----------------------------------------------------------------------------
 *    # Introduction                                                          
 *      In the default RMMV battle system, no skill/item needs more than 1    
 *      battlers to use                                                       
 *      With this plugin, you can set some skills/items to be unison ones     
 *      needing more than 1 battlers to use them                              
 *      Unison battlers are those needed to use the unison skill/item         
 *      Unison invoker is the battler actually selecting and invoking the     
 *      unison skill/item                                                     
 *      Unison invokees are all unison battlers besides the unison invoker    
 *      There can only be 1 unison invoker for each selected unison skill/item
 *      - (v1.02a+)A synchronous unison skill/item is one without any         
 *               <async unison item> notetag                                  
 *      - (v1.02a+)An asynchronous unison skill/item is one with at least 1   
 *               <async unison item> notetags                                 
 *----------------------------------------------------------------------------
 *    # Terms Of Use                                                          
 *      You shall keep this plugin's Plugin Info part's contents intact       
 *      You shalln't claim that this plugin's written by anyone other than    
 *      DoubleX or his aliases                                                
 *      None of the above applies to DoubleX or his aliases                   
 *----------------------------------------------------------------------------
 *    # Prerequisites                                                         
 *      Abilities:                                                            
 *      1. Some Javascript coding proficiency to fully utilize this plugin    
 *----------------------------------------------------------------------------
 *    # Links                                                                 
 *      This plugin:                                                          
 *      1. http://pastebin.com/igFhrKja                                       
 *----------------------------------------------------------------------------
 *    # Instructions                                                          
 *      1. To use this plugin with the default battle system, place           
 *         DoubleX RMMV Unison Item Default below this plugin                 
 *      2. To use this plugin with YEP_X_BattleSysCTB, place                  
 *         DoubleX RMMV Unison Item YEP_X_BattleSysCTB below                  
 *         DoubleX RMMV Unison Item Default, which should be placed below this
 *         plugin                                                             
 *      3. To use this plugin with YEP_X_BattleSysATB, place                  
 *         DoubleX RMMV Unison Item YEP_X_BattleSysATB below                  
 *         DoubleX RMMV Unison Item Default, which should be placed below this
 *         plugin                                                             
 *----------------------------------------------------------------------------
 *    # Author                                                                
 *      DoubleX                                                               
 *----------------------------------------------------------------------------
 *    # Changelog                                                             
 *      DoubleX RMMV Unison Item YEP_X_BattleSysATB:                          
 *      v1.00a(GMT 0600 21-5-2016):                                           
 *      1. 1st version of this plugin finished                                
 *      DoubleX RMMV Unison Item YEP_X_BattleSysCTB:                          
 *      v1.00b(GMT 1300 14-5-2016):                                           
 *      1. In sync with the latest version of DoubleX RMMV Unison Item Config 
 *      v1.00a(GMT 1500 28-2-2016):                                           
 *      1. 1st version of this plugin finished                                
 *      2. Unison skills/items needing charging might be executed immediately 
 *         and/or cause the action order queue to be incorrect and/or outdated
 *      DoubleX RMMV Unison Item Default:                                     
 *      v1.00f(GMT 1300 14-5-2016):                                           
 *      1. Fixed a bug where unison items can have unison invokees with no    
 *         empty action slots                                                 
 *      2. In sync with the latest version of this plugin                     
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
 *      This plugin:                                                          
 *      v1.03a(GMT 0500 23-7-2016):                                           
 *      1. Added <unison item actor function drain: weights>                  
 *      v1.02a(GMT 1300 14-5-2016):                                           
 *      1. Added <unison item actor learn: flags> and <async unison item>     
 *      v1.01b(GMT 1300 17-3-2016):                                           
 *      1. Fixed undefined uIFAs[RegExp.$1] in DM.loadItemNotes bug           
 *      2. Fixed incorrect unison battler stat when using unison rules bug    
 *      v1.01a(GMT 1400 15-3-2016):                                           
 *      1. Added <unison item actor mp cost: ids> and                         
 *               <unison item actor tp cost: ids>                             
 *      v1.00f(GMT 1000 28-2-2016):                                           
 *      1. Fixed unison invokees not stepping forward when executing actions  
 *      v1.00e(GMT 1500 30-1-2016):                                           
 *      1. Fixed not returning value in makeDamageValue bug                   
 *      2. Fixed not showing unison item names in the battle log window bug   
 *      3. Fixed enemy using actor unison item showing unison actor names bug 
 *      v1.00d(GMT 0200 3-1-2016):                                            
 *      1. FUNCTIONS now store all battler functions instead of merely getters
 *      v1.00c(GMT 1300 31-12-2015):                                          
 *      1. Fixed writing getter contents directly instead of using String bug 
 *      v1.00b(GMT 0900 30-12-2015):                                          
 *      1. Fixed failed to extend battler property name descriptors bug       
 *      2. Fixed using new Function and class instead of eval and prototype   
 *      3. Fixed unintentionally declaring global variable in strict mode bug 
 *      4. Fixed calling push for an Object instead of its Array values bug   
 *      5. Fixed using 1 single variable to store all old getter functions bug
 *      v1.00a(GMT 1400 25-12-2015):                                          
 *      1. 1st version of this plugin finished                                
 *============================================================================*/
/*:
 * @plugindesc Lets you set some skills/items needing mutiple battlers to use
 * @author DoubleX
 *
 * @param showAllUnisonBattlers
 * @desc Sets if the battlelog will show all unison battlers instead of only
 *       the unison invoker
 * @default true
 *
 * @param unisonFunctionRule
 * @desc Sets the string of the rule used for setting the user's functions in
 *       the damage formula of the unison skill/item by using those of all
 *       unison battlers
 *       It'll only be used for those functions not having their unison rules
 *       It must be implemented by function RULES, which must be edited by
 *       opening this plugin js file directly
 * @default avg
 *
 * @help
 * The default plugin file name is DoubleX RMMV Unison Item Config v103a
 * If you want to change that, you must edit the value of
 * DoubleX_RMMV.Unison_Item_File, which must be done via opening this plugin
 * js file directly
 *============================================================================
 *    ## Notetag Info                                                         
 *----------------------------------------------------------------------------
 *    # Skill/Item Notetags:                                                  
 *      1. <unison item actors: ids>                                          
 *         - Sets the list of id of actors needed for the skill/item as ids   
 *           , is used to separate the actor id in ids                        
 *           E.g.:                                                            
 *           <unison item actors: 1> means actor with id 1 is needed to use it
 *           <unison item actors: 4, 2> means actors with id 4 and 2 are      
 *           needed to use it                                                 
 *         - All actors included in ids needs to be inputable, able to use the
 *           skills/item and pay its cost                                     
 *         - All unison actors will pay the unison skill costs after using it 
 *         - Only actors included in ids can select the skill/item            
 *         - If ids only contains 1 actor id, this notetag will become only   
 *           letting the actor with that actor id to use the skill/item       
 *      2. <unison item function rule: rule>                                  
 *         - Sets the rule of setting user's function in the skill/item's     
 *           damage formula as rule which is implemented by function          
 *           RULES, which must be edited by opening this plugin js file       
 *           directly                                                         
 *         - function must be a battler function name included in             
 *           FUNCTIONS, which must be edited by opening this plugin js file   
 *           directly                                                         
 *      3. <unison item function actors: ids>                                 
 *         - Sets user's function in the skill/item's damage formula to use   
 *           its unison item rule to combine those of actors with id included 
 *           in ids                                                           
 *           E.g.:                                                            
 *           <unison item atk actors: 1> means the user's atk in its damage   
 *           formula uses that of actor with id 1 under the skill/item's      
 *           unison rule applied to atk                                       
 *           <unison item mat actors: 4, 2> means the user's mat in its damage
 *           formula uses those of actors with id 4 and 2 under the           
 *           skill/item's unison rule applied to mat                          
 *         - function must be a battler function name included in             
 *           FUNCTIONS, which must be edited by opening this plugin js file   
 *           directly                                                         
 *      4. (v1.01a+)<unison item actor mp cost: costs>                        
 *         - Sets the list of mp costs needed for each of the corresponding id
 *           of the unison actor in <unison item actors: ids>                 
 *           , is used to separate the mp costs in ids                        
 *           E.g.:                                                            
 *           If <unison item actors: 1> is used, then                         
 *           <unison item actor mp cost: 5> means actor with id 1 needs to pay
 *           the 5 mp cost for using the unison skill/item                    
 *           If <unison item actors: 4, 2> is used, then                      
 *           <unison item actor mp cost: 5, 10> means actor with id 4 and 2   
 *           need to pay the 5 and 10 mp cost respectively for using the      
 *           unison skill/item                                                
 *           If <unison item actors: 4, 2> is used, then                      
 *           <unison item actor mp cost: 5> means actor with id 4 needs to pay
 *           the 5 mp cost while that with id 2 needs to pay the default      
 *           skill/item mp cost for using the unison skill/item               
 *         - MCR will be applied to the mp costs for all unison actors        
 *      5. (v1.01a+)<unison item actor tp cost: costs>                        
 *         - Sets the list of tp costs needed for each of the corresponding id
 *           of the unison actor in <unison item actors: ids>                 
 *           , is used to separate the tp costs in ids                        
 *           E.g.:                                                            
 *           If <unison item actors: 1> is used, then                         
 *           <unison item actor tp cost: 5> means actor with id 1 needs to pay
 *           the 5 tp cost for using the unison skill/item                    
 *           If <unison item actors: 4, 2> is used, then                      
 *           <unison item actor tp cost: 5, 10> means actor with id 4 and 2   
 *           need to pay the 5 and 10 tp cost respectively for using the      
 *           unison skill/item                                                
 *           If <unison item actors: 4, 2> is used, then                      
 *           <unison item actor tp cost: 5> means actor with id 4 needs to pay
 *           the 5 tp cost while that with id 2 needs to pay the default      
 *           skill/item tp cost for using the unison skill/item               
 *      6. (v1.02a+)<unison item actor learn: flags>                          
 *         - Sets the list of skill learn requirement flags for each of the   
 *           corresponding id of the unison actor in <unison item actors: ids>
 *           , is used to separate the skill learn requirement flags          
 *           Flag can be either t or f, meaning true or false respectively    
 *           The default unison skill learn requirement is true               
 *           This notetag only works on skills and has no effects on items    
 *           E.g.:                                                            
 *           If <unison item actors: 1> is used, then                         
 *           <unison item actor skill learn: t> means actor with id 1 needs to
 *           learn the skill in order to use it                               
 *           If <unison item actors: 4, 2> is used, then                      
 *           <unison item actor skill learn: t, f> means actor with id 4 needs
 *           to learn the skill in order to use it while actor with id 2      
 *           doesn't need to                                                  
 *           If <unison item actors: 4, 2> is used, then                      
 *           <unison item actor skill learn: f> means actor with id 4 doesn't 
 *           need to learn the skill in order to use it while actor with id 2 
 *           needs to due to the default unison skill learn requirement       
 *      7. (v1.02a+)<async unison item>                                       
 *         - Sets the unison skill/item to be inputable when any battler      
 *           needed for that skill/item is inputable                          
 *         - That skill/item and all battlers inputted it will wait for all   
 *           battlers needed for that skill/item to input it in order for them
 *           to execute it altogether                                         
 *         - This notetag will be ignored in the default RMMV battle system   
 *           and all unison skills/items will be synchronous ones             
 *         - This notetag will be ignored in ATB systems that will always wait
 *           when there are inputable actors and all unison skills/items will 
 *           be asynchronous ones                                             
 *      8. (v1.03a+)<unison item actor function drain: weights>               
 *         - Sets user's drained hp/mp/etc for skills/items draining hp/mp/etc
 *           to use redistribute the drained hp/mp/etc to all those of actors 
 *           with id included in ids in <unison item actors: ids>             
 *         - function must be a battler getter name                           
 *         - The redistribution amount to each actor is the minimum value of  
 *           the corresponding weight / sum of weights and the difference     
 *           between the hp and the mhp                                       
 *         - If the sum of weights is 0, then no actor will receive any amount
 *           of the drained hp/mp/etc                                         
 *         - All the undistributed drained hp/mp/etc will be taken by the     
 *           unison invoker, and any amount left by the unison invoker will be
 *           lost                                                             
 *           E.g.:                                                            
 *           If <unison item actors: 1> is used, then                         
 *           <unison item actor hp drain: 0> means actor with id 1 won't      
 *           receive any drained hp from skills/items draining hp             
 *           If <unison item actors: 4, 2> is used, then                      
 *           <unison item actor mp drain: 1, 2> means actor with id 4 and 2   
 *           will receive 1/3 and 2/3 of the drained mp from skills/items     
 *           draining mp respectively                                         
 *           If <unison item actors: 4, 2> is used, then                      
 *           <unison item actor mp cost: 1> means actor with id 4 and 2 will  
 *           receive 100% and 0% of the drained mp from skills/items draining 
 *           mp respectively                                                  
 *============================================================================
 *    ## Plugin Call Info                                                     
 *----------------------------------------------------------------------------
 *    # Configuration manipulations                                           
 *      1. DoubleX_RMMV.Unison_Item.prop                                      
 *         - Returns the property prop under DoubleX_RMMV.Unison_Item         
 *      2. DoubleX_RMMV.Unison_Item.prop = val                                
 *         - Sets the property prop under DoubleX_RMMV.Unison_Item as val     
 *         - No DoubleX_RMMV.Unison_Item.prop change will be saved            
 *      3. $gameSystem.unisonItem.param                                       
 *         - Returns the value of param listed in the plugin manager          
 *      4. $gameSystem.unisonItem.param = val                                 
 *         - Sets the value of param listed in the plugin manager as val      
 *         - All $gameSystem.unisonItem.param changes will be saved           
 *    # Skill/Item manipulations                                              
 *      1. meta.unisonItemActors                                              
 *         - Returns the Array of ids of actors needed to use this skill/item 
 *      2. meta.unisonItemActors = [id, id, ...]                              
 *         - Sets the Array of ids of actors needed to use this skill/item    
 *         - All meta.unisonItemActors changes can be saved if                
 *           DoubleX RMMV Dynamic Data is used                                
 *      3. meta.unisonItemRules[functionName]                                 
 *         - Returns the unison item rule as String for function with name    
 *           functionName as a String                                         
 *      4. meta.unisonItemRules[functionName] = rule                          
 *         - Sets the unison item rule for function with name functionName as 
 *           String as String rule, which must be implemented by              
 *           RULES, which must be edited by opening this plugin js file       
 *           directly                                                         
 *         - function with name functionName must be included in              
 *           FUNCTIONS, which must be edited by opening this plugin js file   
 *           directly                                                         
 *         - All meta.unisonItemRules changes can be saved if                 
 *           DoubleX RMMV Dynamic Data is used                                
 *      5. meta.unisonItemFunctionActors[functionName]                        
 *         - Returns the Array of ids of actors included for combining their  
 *           function functionName as String using its unison item rule       
 *      6. meta.unisonItemFunctionActors[functionName] = [id, id, ...]        
 *         - Sets the Array of ids of actors included for combining their     
 *           function functionName as String using its unison item rule       
 *         - function with name functionName must be included in              
 *           FUNCTIONS, which must be edited by opening this plugin js file   
 *           directly                                                         
 *         - All meta.unisonItemFunctionActors changes can be saved if        
 *           DoubleX RMMV Dynamic Data is used                                
 *      7. (v1.01a+)meta.unisonItemActorMpCosts                               
 *         - Returns the Array of mp costs each needed by its corresponding   
 *           actor with id in meta.unisonItemActors to use this skill/item    
 *      8. (v1.01a+)meta.unisonItemActorMpCosts = [cost, cost, ...]           
 *         - Sets the Array of of mp costs each needed by its corresponding   
 *           actor with id in meta.unisonItemActors to use this skill/item    
 *         - All meta.unisonItemActorMpCosts changes can be saved if          
 *           DoubleX RMMV Dynamic Data is used                                
 *      9. (v1.01a+)meta.unisonItemActorTpCosts                               
 *         - Returns the Array of tp costs each needed by its corresponding   
 *           actor with id in meta.unisonItemActors to use this skill/item    
 *      10. (v1.01a+)meta.unisonItemActorTpCosts = [cost, cost, ...]          
 *          - Sets the Array of of tp costs each needed by its corresponding  
 *            actor with id in meta.unisonItemActors to use this skill/item   
 *          - All meta.unisonItemActorTpCosts changes can be saved if         
 *            DoubleX RMMV Dynamic Data is used                               
 *      11. (v1.02a+)meta.unisonItemActorLearn                                
 *          - Returns the Array of skill learn requirement flags for each     
 *            corresponding actor with id in meta.unisonItemActors to use this
 *            skill/item                                                      
 *      12. (v1.02a+)meta.unisonItemActorLearn = [cost, cost, ...]            
 *          - Sets the Array of skill requirement flags for each corresponding
 *            actor with id in meta.unisonItemActors to use this skill/item   
 *          - All meta.unisonItemActorTpCosts changes can be saved if         
 *            DoubleX RMMV Dynamic Data is used                               
 *      13. (v1.02a+)meta.asyncUnisonItem                                     
 *          - Returns whether the unison skill/item is an asynchronous one    
 *      14. (v1.02a+)meta.asyncUnisonItem = boolean                           
 *          - Sets the unison skill/item to be an asynchronous one if boolean 
 *            is true and a synchronous one if otherwise                      
 *      15. (v1.03a+)meta.unisonItemActorFunctionDrain[functionName]          
 *          - Returns the Array of weights for actors included in the         
 *            corresponding meta.unisonItemActors for redistributing the      
 *            drained function functionName  as String from skills/items      
 *            draining functionName to all those actors                       
 *      16. (v1.03a+)meta.unisonItemActorFunctionDrain[functionName] = [w, ..]
 *          - Sets the Array of weights for actors included in the            
 *            corresponding meta.unisonItemActors for redistributing the      
 *            drained function functionName  as String from skills/items      
 *            draining functionName to all those actors                       
 *          - function with name functionName must be a battler getter name   
 *          - All meta.unisonItemActorFunctionDrain changes can be saved if   
 *            DoubleX RMMV Dynamic Data is used                               
 *============================================================================
 */

/*============================================================================
 *    [JOKO 2026-10-18] Copie corrigée pour le jeu de JOKO. L'original est gardé
 *    tel quel dans Documents\RPG Maker\3 Systèmes et plugins\Plugins du forum.
 *    Chaque correction est marquée [JOKO]. Règle : une action NORMALE (sans
 *    <unison item actors: …> à plusieurs héros) se joue exactement comme avant.
 *     1. performActionStart / performAction étaient réécrits pour TOUTES les
 *        actions : sans héros d'unison, plus personne ne s'avançait ni ne
 *        frappait. Ils ne servent plus qu'aux attaques combinées.
 *     2. Une compétence ou un objet créés pendant la partie n'avaient pas leurs
 *        listes d'unison : plantage. extractMetadata les lit aussi.
 *     3. endAction sans action, coûts sans liste : gardés.
 *     4. Le drain d'une attaque combinée plantait (uuIAFDs, statDiff) et
 *        réordonnait pour toujours la liste des héros de la compétence.
 *     5. useItem d'une attaque combinée ne passait plus par le reste du moteur
 *        (recharges, usages limités…) : le lanceur l'utilise normalement, les
 *        partenaires paient leur coût.
 *     6. « Vesper and Korrah » → « Vesper et Korrah ».
 *     7. Le combat automatique ne choisit jamais une attaque combinée (en CTB, un
 *        héros automatique la lancerait seul).
 *     8. La doc annonce <unison item atk actors: 1, 2> (UNE statistique) mais
 *        depuis la v1.00b seul <unison item param actors> marchait, et il
 *        mélangeait les huit. mhp mmp atk def mat mdf agi luk choisissent
 *        maintenant une statistique (règle : <unison item atk rule: max>).
 *     9. <unison item actor learn: t, t> (l'exemple de la doc, avec l'espace)
 *        lisait « t » puis « f » : le partenaire n'avait pas à la connaître.
 *============================================================================*/
var DoubleX_RMMV = DoubleX_RMMV || {};
DoubleX_RMMV["Unison Item Config"] = 'v1.03a';

// The plugin file name must be the same as DoubleX_RMMV.Unison_Item_Config_File
DoubleX_RMMV.Unison_Item_Config_File = 'DoubleX RMMV Unison Item Config v103a';

/*============================================================================
 *    ## Plugin Configurations                                                
 *       You only need to edit this part as it's about what this plugin does  
 *----------------------------------------------------------------------------*/

DoubleX_RMMV.Unison_Item = {

    /* Implements the unison item function rules
     * The unison item function rule can be referenced by rule
     * The Array of unison item function value of all unison battlers can be
     * referneced by vals
     * RULES will be bound to the unison invoker upon use
     * It must return a Number
     */
    RULES: function(rule, vals) {
        if (rule === 'min') {
            return vals.sort(function(a, b) { return a - b; })[0];
        } else if (rule === 'avg') {
            return vals.reduce(function(a, b) { return a + b; }) / vals.length;
        } else if (rule === 'max') {
            return vals.sort(function(a, b) { return b - a; })[0];
        }
        console.log('The unison item rule ' + rule + " isn't implemented");
        return 0;
    },

    /* Sets the battler functions using the unison item rules
     * Its function names must be the class of the battler functions
     * Its values must be those battler functions as Strings
     * All the included battler functions will be extended
     */
    FUNCTIONS: {

      /* General form:
       * class: [
       *     'battler function name',
       *     'battler function name',
       *     'battler function name',
       *     ...,
       *     'battler function name'
       * ]
       */

        Game_BattlerBase: [
            'param',
            'xparam',
            'sparam'
            // Adds new battler function names here
            
        ]

        // Adds new classes here
        

    }

}; // DoubleX_RMMV.Unison_Item

/*============================================================================
 *    ## Plugin Implementations                                               
 *       You need not edit this part as it's about how this plugin works      
 *----------------------------------------------------------------------------
 *    # Plugin Support Info:                                                  
 *      1. Prerequisites                                                      
 *         - Solid understanding to the implementation parts independent from 
 *           any action input nor execution flows in battles                  
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

(function(UI) {

    'use strict';

    UI.DataManager = {};
    var DM = UI.DataManager;

    DM.isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        // Rewritten
        return DM.isDatabaseLoaded.apply(this, arguments) && DM.loadAllNotes();
        //
    }; // DataManager.isDatabaseLoaded

    DM.loadAllNotes = function() {
        [$dataSkills, $dataItems].forEach(function(type) {
            type.forEach(function(data) {
                if (data) { DM.loadItemNotes(data); }
            });
        });
        return true;
    }; // DM.loadAllNotes

    // data: The data to have its notetags read
    DM.loadItemNotes = function(data) {
        var uIAs = data.meta.unisonItemActors = [];
        var uIRs = data.meta.unisonItemRules = {};
        var uIFAs = data.meta.unisonItemFunctionActors = {};
        var uIAMCs = data.meta.unisonItemActorMpCosts = [];
        var uIATCs = data.meta.unisonItemActorTpCosts= [];
        var uIASLs = data.meta.unisonItemActorLearn = [];
        var uIAFDs = data.meta.unisonItemActorFunctionDrain = {};
        var actors = /< *unison +item +actors *: *(\d+(?: *, *\d+)*) *>/i;
        var rule = /< *unison +item +(\w+) +rule*: *(\w+) *>/i;
        var fAs = /< *unison +item +(\w+) +actors *: *(\d+(?: *, *\d+)*) *>/i;
        var MCs = /< *unison +item +actor +mp +cost *: *(\d+(?: *, *\d+)*) *>/i;
        var TCs = /< *unison +item +actor +tp +cost *: *(\d+(?: *, *\d+)*) *>/i;
        var SLs = /< *unison +item +actor +learn *: *(\w+(?: *, *\w+)*) *>/i;
        var async = /< *async +unison +item *>/i, func;
        var aFDs = /<unison +item +actor +(\w+) +drain:(\d+(?: *, *\d+)*)>/i;
        data.note.split(/[\r\n]+/).forEach(function(line) {
            if (line.match(rule)) { return uIRs[RegExp.$1] = RegExp.$2; }
            if (line.match(async)) { return data.meta.asyncUnisonItem = true; }
            if (line.match(actors)) { return DM.storeItemNotes(uIAs); }
            if (line.match(MCs)) { return DM.storeItemNotes(uIAMCs); }
            if (line.match(TCs)) { return DM.storeItemNotes(uIATCs); }
            if (line.match(SLs)) {
                if (uIASLs.length > 0) { return; }
                RegExp.$1.trim().split(/,/).forEach(function(id) {
                    uIASLs.push(id.trim() === 't');   // [JOKO] 9. « t, t » : l'espace faisait lire « f »
                });
            } else if (line.match(fAs)) {
                func = RegExp.$1;
                uIFAs[func] = uIFAs[func] || [];
                if (uIFAs[func].length > 0) { return; }
                RegExp.$2.trim().split(/,/).forEach(function(id) {
                    uIFAs[func].push(+id);
                });
            } else if (line.match(aFDs)) {
                func = RegExp.$1;
                uIAFDs[func] = uIAFDs[func] || [];   // [JOKO] « uuIAFDs » : plantait
                if (uIAFDs[func].length > 0) { return; }
                RegExp.$2.trim().split(/,/).forEach(function(id) {
                    uIAFDs[func].push(+id);
                });
            }
        });
    }; // DM.loadItemNotes

    // [JOKO] une compétence/un objet créés pendant la partie passent par extractMetadata
    // sans repasser par loadAllNotes : leurs listes d'unison manquaient (plantage)
    DM.extractMetadata = DataManager.extractMetadata;
    DataManager.extractMetadata = function(data) {
        DM.extractMetadata.apply(this, arguments);
        if (data && data.meta && data.damage && data.note !== undefined) { DM.loadItemNotes(data); }
    };

    // [JOKO] les héros d'une compétence/d'un objet, sans jamais planter
    UI.acteurs = function(item) {
        return (item && item.meta && item.meta.unisonItemActors) || [];
    };

    // list: A list storing all the effective values of a notetag
    DM.storeItemNotes = function(list) { // v1.02a+
        if (list.length > 0) { return; }
        RegExp.$1.trim().split(/,/).forEach(function(id) { list.push(+id); });
    }; // DM.storeItemNotes

    UI.BattleManager = {};
    var BM = UI.BattleManager;

    BM.endAction = BattleManager.endAction;
    BattleManager.endAction = function() { // v1.00f+
        // [JOKO] sans action (ou action sans objet) : rien à faire
        var item = this._action && this._action.item();
        if (UI.acteurs(item).length > 1 && this._subject && this._subject.isActor()) UI.acteurs(item).forEach(function(actorId) {
            if (actorId === this._subject.actorId()) { return; }
            $gameActors.actor(actorId).performActionEnd();
        }, this);
        BM.endAction.apply(this, arguments);
    }; // BattleManager.endAction

    UI.Game_System = {};
    var GS = UI.Game_System;

    /*------------------------------------------------------------------------
     *    New public instance variable                                        
     *------------------------------------------------------------------------*/
    // The storage of all configuration values
    Object.defineProperty(Game_System.prototype, 'unisonItem', {
        get: function() { return this._unisonItem; },
        configurable: true
    });

    GS.initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        GS.initialize.apply(this, arguments);
        GS.initUnisonItemParams.call(this); // Added
    }; // Game_System.prototype.initialize

    GS.initUnisonItemParams = function() {
        var params;
        this._unisonItem = {};
        params = PluginManager.parameters(DoubleX_RMMV.Unison_Item_Config_File);
        Object.keys(params).forEach(function(param) {
            this._unisonItem[param] = params[param] === 'true';
        }, this);
        this._unisonItem.unisonFunctionRule = params.unisonFunctionRule;
    }; // GS.initUnisonItemParams

    UI.Game_Action = {};
    var GA = UI.Game_Action;

    GA.makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        // Added to set all user functions to use their unison item rules
        var item = this.item(), subject = this.subject();
        if (subject.isActor() && UI.acteurs(item).length > 1) {   // [JOKO]
            subject.unisonItem = item;
        }
        //
        var value = GA.makeDamageValue.apply(this, arguments);
        subject.unisonItem = null; // Added to set all user functions to normal
        return value;
    }; // Game_Action.prototype.makeDamageValue

    GA.gainDrainedHp = Game_Action.prototype.gainDrainedHp;
    Game_Action.prototype.gainDrainedHp = function(v) { // v1.03a+
        // Rewritten
        if (!this.isDrain()) { return; }
        GA.gainUnisonDrainedFunc.call(this, 'hp', 0, 'mhp', 'gainDrainedHp', v);
        //
    }; // Game_Action.prototype.gainDrainedHp

    GA.gainDrainedMp = Game_Action.prototype.gainDrainedMp;
    Game_Action.prototype.gainDrainedMp = function(v) { // v1.03a+
        // Rewritten
        if (!this.isDrain()) { return; }
        GA.gainUnisonDrainedFunc.call(this, 'mp', 0, 'mmp', 'gainDrainedMp', v);
        //
    }; // Game_Action.prototype.gainDrainedMp

    GA.gainUnisonDrainedFunc = function(func, min, max, drainFunc, value) {
    // v1.03a+
        var subject = this.subject();
        if (!subject.isActor()) { return GA[drainFunc].call(this, value); }
        // [JOKO] une COPIE de la liste (l'original réordonnait celle de la compétence pour
        // toujours) ; sans poids écrits, le lanceur draine comme d'habitude
        var item = this.item(), mems = UI.acteurs(item).slice();
        if (mems.length <= 1) { return GA[drainFunc].call(this, value); }
        var weights = item.meta.unisonItemActorFunctionDrain && item.meta.unisonItemActorFunctionDrain[func];
        if (!weights || !weights.length) { return GA[drainFunc].call(this, value); }
        var actorId = subject.actorId(), index = mems.indexOf(actorId);
        if (index >= 0) { mems.splice(index, 1); }
        mems.push(actorId);
        var weightSum = weights.reduce(function(a, b) { return a + b; }, 0);
        if (weightSum === 0) { return; }
        var statChange, newStat, maxStat, mem, weight;
        for (var index = 0, length = mems.length; index < length; index++) {
            weight = weights[index];
            if (!weight) { continue; }
            statChange = Math.trunc(value * weight / weightSum);
            mem = $gameActors.actor(mems[index]);
            maxStat = mem[max], newStat = mem[func] + statChange;
            if (newStat < min) {
                statChange = min - mem[func];
            } else if (newStat > maxStat) {
                statChange = maxStat - mem[func];
            }
            GA[drainFunc].call(this, statChange);
            weightSum -= weight;   // [JOKO] « statDiff » n'existait pas : plantait
        }
    }; // GA.gainUnisonDrainedFunc

    UI.Game_BattlerBase = {}; // v1.01a+
    var GBB = UI.Game_BattlerBase;

    GBB.skillMpCost = Game_BattlerBase.prototype.skillMpCost;
    Game_BattlerBase.prototype.skillMpCost = function(skill) {
        // Rewritten to return mp cost in <unison item actor mp cost: costs>
        var cost = 'unisonItemActorMpCosts', func = 'skillMpCost';
        return GBB.unisonSkillCost.call(this, skill, cost, func);
        //
    }; // Game_BattlerBase.prototype.skillMpCost

    GBB.skillTpCost = Game_BattlerBase.prototype.skillTpCost;
    Game_BattlerBase.prototype.skillTpCost = function(skill) {
        // Rewritten to return tp cost in <unison item actor tp cost: costs>
        var cost = 'unisonItemActorTpCosts', func = 'skillTpCost';
        return GBB.unisonSkillCost.call(this, skill, cost, func);
        //
    }; // Game_BattlerBase.prototype.skillTpCost

    GBB.unisonSkillCost = function(skill, cost, func) { // v1.02a+
        if (this.isActor()) {
            var index = UI.acteurs(skill).indexOf(this.actorId());   // [JOKO]
            if (index >= 0) {
                var unisonCost = (skill.meta[cost] || [])[index];
                if (!isNaN(unisonCost)) { return unisonCost; }
            }
        }
        //
        return GBB[func].apply(this, arguments);
    }; // GBB.unisonSkillCost

    UI.Game_Battler = {};
    var GB = UI.Game_Battler;

    /*------------------------------------------------------------------------
     *    New public instance variables                                       
     *------------------------------------------------------------------------*/
    Object.defineProperties(Game_Battler.prototype, {
        // Read by Game_BattlerBase to get the other battlers' action slot list
        'actions': {
            get: function() { return this._actions; },
            configurable: true
        },
        // The cached unison skill/item when executing its damage formula
        'unisonItem': {
            set: function(item) { this._unisonItem = item; },
            configurable: true
        }
    });

    GB.useItem = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function(item) {
        // Rewritten to ask all unison invokees to pay the skill/item cost only
        if (!DataManager.isSkill(item)) {
            return GB.useItem.apply(this, arguments);
        } else if (UI.acteurs(item).length <= 1) {   // [JOKO]
            return GB.useItem.apply(this, arguments);
        }
        // [JOKO] le lanceur l'utilise comme n'importe quelle compétence (recharges, usages
        // limités… : tout le moteur y passe) ; chaque partenaire paie son propre coût
        GB.useItem.apply(this, arguments);
        UI.acteurs(item).forEach(function(actorId) {
            if (this.isActor() && actorId === this.actorId()) { return; }
            $gameActors.actor(actorId).paySkillCost(item);
        }, this);
        //
    }; // Game_Battler.prototype.useItem

    // [JOKO] le combat automatique (et la confusion) ne choisissent jamais une attaque
    // combinée : dans YEP_X_BattleSysCTB, un héros automatique ne passe pas par
    // selectNextCommand, il la lancerait seul (et ferait payer son partenaire pour rien)
    UI.Game_Actor = UI.Game_Actor || {};
    UI.Game_Actor.makeActionList = Game_Actor.prototype.makeActionList;
    Game_Actor.prototype.makeActionList = function() {
        return UI.Game_Actor.makeActionList.apply(this, arguments).filter(function(act) {
            return UI.acteurs(act.item()).length <= 1;
        });
    };

    UI.Window_ItemList = {};
    var WIL = UI.Window_ItemList;

    WIL.isEnabled = Window_ItemList.prototype.isEnabled;
    Window_ItemList.prototype.isEnabled = function(item) {
        // Rewritten to disable unison items when unison conditions aren't met
        if (!DataManager.isItem(item)) {
            return WIL.isEnabled.apply(this, arguments);
        } else if (UI.acteurs(item).length <= 1) {   // [JOKO]
            return WIL.isEnabled.apply(this, arguments);
        } else if (!$gameParty.inBattle()) {
            return WIL.isEnabled.apply(this, arguments);
        }
        var actor = BattleManager.actor();
        return actor && actor.canUse(item);
        //
    }; // Window_ItemList.prototype.isEnabled

    UI.Window_BattleLog = {};
    var WBL = UI.Window_BattleLog;

    WBL.performActionStart = Window_BattleLog.prototype.performActionStart;
    Window_BattleLog.prototype.performActionStart = function(subject, action) {
    // v1.00f+
        // [JOKO] seulement pour une attaque combinée : avant, AUCUNE action normale ne
        // faisait plus avancer son lanceur (la liste d'unison était vide)
        var ids = UI.acteurs(action && action.item());
        if (ids.length <= 1 || !subject || !subject.isActor()) { return WBL.performActionStart.apply(this, arguments); }
        // Rewritten to ask all unison actor sprites to perform act start
        ids.forEach(function(actorId) {
            $gameActors.actor(actorId).performActionStart(action);
        });
        //
    }; // Window_BattleLog.prototype.performActionStart

    WBL.performAction = Window_BattleLog.prototype.performAction;
    Window_BattleLog.prototype.performAction = function(subject, action) {
    // v1.00f+
        // [JOKO] seulement pour une attaque combinée (même raison)
        var ids = UI.acteurs(action && action.item());
        if (ids.length <= 1 || !subject || !subject.isActor()) { return WBL.performAction.apply(this, arguments); }
        // Rewritten to ask all unison actor sprites to perform act
        ids.forEach(function(actorId) {
            $gameActors.actor(actorId).performAction(action);
        });
        //
    }; // Window_BattleLog.prototype.performActionStart

    WBL.displayAction = Window_BattleLog.prototype.displayAction;
    Window_BattleLog.prototype.displayAction = function(subject, item) {
        // Rewritten to display all unison actor names if users set so
        if (!subject.isActor()) {
            return WBL.displayAction.apply(this, arguments);
        } else if (!$gameSystem.unisonItem.showAllUnisonBattlers) {
            return WBL.displayAction.apply(this, arguments);
        } else if (UI.acteurs(item).length <= 1) {   // [JOKO]
            return WBL.displayAction.apply(this, arguments);
        }
        WBL.displayUnisonAct.call(this, item);
        //
    }; // Window_BattleLog.prototype.displayAction

    WBL.displayUnisonAct = function(item) {
        var names = WBL.unisonActorNames(item.meta.unisonItemActors);
        var numMethods = this._methods.length;
        if (DataManager.isSkill(item)) {
            if (item.message1) {
                this.push('addText', names + item.message1.format(item.name));
            }
            if (item.message2) {
                this.push('addText', item.message2.format(item.name));
            }
        } else {
            var text = TextManager.useItem.format(names, item.name);
            this.push('addText', text);
        }
        if (this._methods.length === numMethods) { this.push('wait'); }
    }; // WBL.displayUnisonAct

    WBL.unisonActorNames = function(actorIds) {
        var names = '';
        for (var index = 0, length = actorIds.length; index < length; index++) {
            if (index > 0 && index < length - 1) {
                names += ', ';
            } else if (index === length - 1) {
                names += ' et ';   // [JOKO] « and »
            }
            names += $gameActors.actor(actorIds[index]).name();
        }
        return names;
    }; // WBL.unisonActorNames

    var Proto;
    for (var Klass in UI.FUNCTIONS) {
        if (!UI.FUNCTIONS.hasOwnProperty(Klass)) { continue; }
        // Ensures container GBB and GB won't be rewritten
        UI[Klass] = UI[Klass] || {};
        //
        Proto = eval(Klass + '.prototype'); // Actual class prototype
        UI.FUNCTIONS[Klass].forEach(function(f) {

            /*------------------------------------------------------------
             *    Extends all battler functions using unison item rules   
             *------------------------------------------------------------*/
            UI[Klass][f] = Proto[f];
            Proto[f] = new Function([
            	'var UI = DoubleX_RMMV.Unison_Item, item = this._unisonItem;',
                'if (!item) {',
                '    return UI.' + Klass + '.' + f + '.apply(this, arguments);',
                '}',
                'var actorIds = item.meta.unisonItemFunctionActors.' + f + ';',
                'if (!actorIds) {',
                '    return UI.' + Klass + '.' + f + '.apply(this, arguments);',
                '}',
                'var args = arguments;',
                'var vals = actorIds.map(function(actorId) {',
                '    var actor = $gameActors.actor(actorId);',
                '    return UI.' + Klass + '.' + f + '.apply(actor, args);',
                '});',
                'var rule = item.meta.unisonItemRules.' + f + ';',
                'rule = rule || $gameSystem.unisonItem.unisonFunctionRule;',
                'return UI.RULES.call(this, rule, vals);',
            ].join('\n'));

        });
    }

    // [JOKO] 8. Une statistique à la fois : <unison item atk actors: 1, 2> prend l'ATQ
    // de Vesper et de Korrah (règle avg/min/max), <unison item mat actors: 4> fait
    // compter la MAG d'Aël quel que soit le lanceur. <unison item param actors>
    // garde son sens d'origine (les huit à la fois).
    UI.NOMS_PARAM = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];
    UI.Game_BattlerBase.paramAvecUnison = Game_BattlerBase.prototype.param;
    Game_BattlerBase.prototype.param = function(paramId) {
        var item = this._unisonItem, fa = item && item.meta.unisonItemFunctionActors;
        var nom = UI.NOMS_PARAM[paramId], ids = fa && !fa.param && fa[nom];
        if (!ids || ids.length <= 0) {
            return UI.Game_BattlerBase.paramAvecUnison.apply(this, arguments);
        }
        var vals = ids.map(function(actorId) {
            return UI.Game_BattlerBase.param.call($gameActors.actor(actorId), paramId);
        });
        var rule = item.meta.unisonItemRules[nom] || $gameSystem.unisonItem.unisonFunctionRule;
        return Math.round(UI.RULES.call(this, rule, vals));   // entière, comme MV
    };

})(DoubleX_RMMV.Unison_Item);

/*============================================================================*/