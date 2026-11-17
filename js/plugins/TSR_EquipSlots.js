//========================================================================================
//=== TSR_EquipSlots === A Plugin by The Northern Frog ===================================
//========================================================================================

var TSR = TSR || {};
TSR.equipSlots = TSR.equipSlots || {};
TSR.equipSlots.version = 1.00;

var Imported = Imported || {};
Imported.TSR_EquiSlots = true;

//========================================================================================

/*:
 * @plugindesc v1.0.0 This Plugin revamp the Equip Scene and provides a few options
 *        to customize some aspects of the scene.
 * 
 * @author TSR, The Northern Frog, 2020      
 * @help 
 * =======================================================================================
 * == About this Plugin ==================================================================
 * =======================================================================================
 * This is a 'scene' Plugin. It does not alter the game equipement behavior, but
 * is made to work with Yanfly Equip Core and Item Core, along with their extensions 
 * Plugins. It can also be used as a stand-alone Plugin.
 * 
 * 
 * The Plugin rearrange the Equip scene windows as such:
 * 
 *       -----------------------------------------------------------------------
 *      |                                                                       |
 *      |                         SLOTS WINDOW                                  |
 *      |-----------------------------------------------------------------------|
 *      |                             |                                         | 
 *      |                             |                                         |
 *      |                             |                                         |
 *      |      STATUS WINDOW          |            HELP WINDOW                  |
 *      |                             |                                         |
 *      |                             |                                         |
 *      |                             |                                         |
 *      |                             |                                         |
 *      |-----------------------------|-----------------------------------------|
 *      |                             |                                         |
 *      |                             |                                         |
 *      |                             |                                         |
 *      |                             |                                         |
 *      |      DISPLAY WINDOW         |            ITEM WINDOW                  |
 *      |                             |                                         |
 *      |                             |                                         |
 *      |                             |                                         |
 *      |                             |                                         |
 *      |                             |                                         |
 *       ----------------------------------------------------------------------- 
 * 
 * The main features of each windows are described bellow.
 * 
 *      -SLOTS WINDOW
 *            This is an horizontal menu that shows the current actor 
 *            equipment slots. You can toggle between slots by scrolling
 *            left and right, or switch between party members using the
 *            up and down arrow keys.
 * 
 *      -STATUS WINDOW
 *            This window shows the current actor status. The parameters
 *            changes when hovering over equipment pieces are indicated
 *            by color changes: green = param increase, orange = param
 *            decrease, white = no changes. 
 * 
 *      -HELP WINDOW
 *            The new Help window display the info about the equipment 
 *            pieces. When switching between an actor equip slots, the
 *            Help window will show the currently equipped gear (if any)
 *            for the corresponding slot. When selecting items in the
 *            Item window, the Help window show the infos of the selected
 *            item.
 * 
 *            By default, the Help window display the following infos:
 * 
 *                  1) Item name and icon
 *                  2) Item 2 lines description from database
 *                  3) Item 8 params
 * 
 *            Using Plugin parameters, you can add additional infos in
 *            the order you wish:
 * 
 *                  * Item Attack Elements and Elements rates traits
 *                  * Item Attack States and State rates/resist traits
 *                  * Item durability (require YEP_X_ItemDurability)
 *                  * Item Attach Augments (require YEP_X_AttachAugments)
 * 
 *            Infos slidding:
 *                 Whenever the item infos are too large to fit in one
 *                 line of the Help window, the line will automatically
 *                 glide from right to left to show the info that is cut
 *                 off by the window borders. The line will keep moving
 *                 back and forth so all the infos can be seen.
 * 
 * 
 *       -DISPLAY WINDOW
 *             The display window show the current actor battler image,
 *             surrounded by its equipment slots. You can use a custom
 *             image instead of the battler image, by using the following
 *             actor notetag:
 * 
 *                 <Display Image: filename>
 * 
 *                   *filename is your image file name wihout the extension.
 * 
 * 
 *       -ITEM WINDOW
 *             The item window show the available equipments for the currently
 *             selected slot of the current actor. It also display the item
 *             that is currently equipped by the current actor, as well as the
 *             items that the current actor can equip, but are actually equipped
 *             by another party member.
 * 
 *             The Item Window is compatible with the independant items from
 *             Yanfly ItemCore.        
 * 
 * 
 * 
 * PARAMETERS
 * =======================================================================================
 * 
 * General
 * =======
 * 
 *   Windows Layout
 *     This parameter allow to reverse the left/right position of the windows
 *     in the Equip Scene.
 * 
 *   Background Rectangle Color1
 *     This set the first gradient color of the background rectangles in the
 *     Status, Help, Item and Display windows.
 * 
 *   Background Rectangle Color2
 *     This set the second gradient color of the background rectangles in the
 *     Equip Scene.
 * 
 * 
 * Category Window
 * ===============
 *
 *   Category Max Columns
 *     This set the maximal number of visible columns in the category window.
 * 
 * 
 * Status Window
 * =============
 * 
 *   Enable Status Back Rect
 *     Enable the backround rectangle in the status window. 
 * 
 * 
 * Help Window
 * ===========
 *
 *   Item Info
 *     This notebox can be use to display additional informations in the
 *     Help window. Each lines in the notebox has to be filled specifically, 
 *     according to the explanation bellow. Each properties (lines) must be
 *     separated by a semicolon and have the following structure:
 * 
 *             label : keyword, specific infos, ;(end semicolon)
 * 
 *              Label = This is the label that will appear before the datas.
 *                      It must be followed by a colon.
 * 
 *            keyword = Each information types have its own predefine keyword
 *                      that the Plugin can recognize.
 * 
 *     Specific infos = Some information type require additional data (this
 *                      is specified bellow)
 * 
 *   ;(end semicolon) = This should close each lines in the Item Info notebox.
 *     
 * 
 *     Item Info (ELEMENTAL ATTACKS and RATES)
 *         This shows the elemental rates and elements attack traits of the
 *         equipment piece.
 * 
 *         Keyword: 'elements'
 * 
 *         Specific infos: elementID(iconIndex), elementID(iconIndex), ...
 * 
 *         HOW TO USE: 
 *            Write the label that will appear on screen, followed by a colon.
 *            Add the keyword 'elements' followed by a comma. Then add the 
 *            element Id of each elements you wish to be shown, followed by
 *            the element icon index between brackets. Separate each by commas
 *            and don't forget the semicolon at the end of the line.
 * 
 *            Example:
 *                Elements: elements, 1(100), 2(101), 3(102), 4(103);
 * 
 *                This will show the elemental rates of elements Id 1 to 4
 *                with their associated icons, preceded by the label 'Elements'  
 * 
 * 
 *      Item Info (STATES ATTACKS and RATES)
 *         This shows the states rates and states attack traits of the
 *         equipment piece.
 * 
 *         Keyword: 'states'
 * 
 *         Specific infos: none
 * 
 *         HOW TO USE: 
 *            Write the label that will appear on screen, followed by a colon.
 *            Add the keyword 'states' followed by the end semicolon.
 * 
 *            Example:
 *                Afflictions: states;
 * 
 *                This will show all the states rates of the equipment piece,
 *                preceded by the label 'Affliction'
 *           
 * 
 *       Item Info (Yanfly item DURABILITY)
 *          You can display the equipment durability assuming you have Yanfly
 *          ItemCore and X_ItemDurability.
 *  
 *          Keyword: durability
 * 
 *          Specific infos: none
 * 
 *          HOW TO USE: 
 *            Write a label, followed by a colon. How you name the label doesn't
 *            matter as it is only used for reference. The label that will appear
 *            on screen is the name you gave to durability in Yanfly Plugin. Add
 *            Add the keyword 'durability' followed by the end semicolon.
 *            
 *            Example:
 *               1: durability;
 * 
 * 
 *       Item Info (Yanfly item ATTACH AUGMENTS)
 *          You can display the equipment Augments assuming you have Yanfly
 *          ItemCore and X_AttachAugments.
 *  
 *          Keyword: augments
 * 
 *          Specific infos: none
 * 
 *          HOW TO USE: 
 *            Write the label that will appear on screen, followed by a colon.
 *            Add the keyword 'augments' followed by the end semicolon.
 *            
 *            Example:
 *               Crystals: augments;
 * 
 * 
 *   Params Name Acronyms
 *     This notebox serves to define the acronyms for the 8 main parameters,
 *     as they will appears in the Status window. Define a 3 letters acronym 
 *     for each params and associate it with its param Id. The params Id are 
 *     as follow:
 * 
 *     0: Max HP         1: MMP             2: Attack     3: Defense
 *     4: Magic Atttack  5: Magic defense   6: Agility    7: Luck
 * 
 *     The notebox is already filled with the acronyms of the default param
 *     names. Change it to your liking. Separate each with a SEMICOLON.
 *
 * 
 *   Enable Help Back Rect
 *     Enable the backround rectangle in the help window. 
 * 
 * 
 * 
 * Item Window
 * ===========
 * 
 *   Items Sorting Method
 *     This notebox let you define different sorting method for each equip
 *     slots categories. Associate each equip slots to one of the following
 *     sorting method:
 * 
 *            -1 : no sort, the items will appears in their database entries
 *                 order. Not inluding an equip slot in the notebox will
 *                 give the same result.
 * 
 *         'name': Items will be sorted alphabetically according to their
 *                 name define in the database.
 * 
 *          0 - 7: Items will be sorted numerically according to the param
 *                 id (0 to 7) specified in the notebox.
 * 
 *         'best': Items will be sorted according to the highest params 
 *                 combinattion (similar to optimize command).
 * 
 * 
 *                 Example: 
 *                   1: 2; 2: 'name'; 3: 3; 4: 'best'
 * 
 *         Filling the notebox as above will sort the weapons (slotId 1)
 *         according to the attack parameter (paramId 2). SlotId 2 will
 *         be sorted according to their names, slotId 3 will be sorted
 *         by their defense parameter (paramId 3), and slotId 4 will be
 *         sorted according to 'best' param optimization. Note that each
 *         properties are separated by a SEMICOLON.
 * 
 * 
 *   Actors Equipment Sort
 *     With this parameter, you can decide wether or not the currently equipped
 *     items will be included in the sorting method. If not, the currently
 *     equipped items will appears at the top of the item list.     
 * 
 *   Enable Item Back Rect
 *     Enable the backround rectangle in the item window. 
 * 
 * 
 * 
 * Display Window
 * ==============
 * 
 *   Display Icons Positions
 *     This notebox allow you to define specific screen positions for the icons
 *     in the display window. Enter X and Y coordinates for each slotId. Separate
 *     X and Y values by a COMMA, and each properties by a SEMICOLON.
 * 
 *     Example:
 *        1: 50, 50; 2: 50, 100; 3: 200, 50; 4: 200, 100
 * 
 *     In the example above, slotId 1 will appears at x50, y50 in the Display
 *     window. If you omit to include some slotId, they will stack up in the
 *     top left corner of the window. If you leave the whole parameter blank,
 *     the Plugin will automatically dispose the icons arround the battler
 *     image (default setting).
 *   
 * 
 *   Display Icons Size
 *     This set the iconSize of the icons in the display window. If this parameter
 *     is left empty, the Plugin will refer to default icon width.
 * 
 *
 * 
 * 
 * =======================================================================================
 * == Terms of usage =====================================================================
 * =======================================================================================
 * Use in any independant RPG Maker MV projects, including commercials.
 *
 * Credit is required for using this Plugin. 
 * For crediting, use 'TSR' along with one of
 * the following terms: 
 *      'The Northern Frog' or 'A frog from the north'
 * 
 * Do not change the Header or the Terms of usage.
 * 
 * Do not change the main object name.
 *
 * Editing of the script is allowed, but it won't relieve from crediting
 * obligations. Remember that changing the name of functions and variables,
 * or even manually retyping the entire script, doesn't make you the author
 * of the Plugin.
 *
 * DO NOT REDISTRIBUTE!
 * If you want to share it, share the link to my itchi.io account: 
 * https://the-northern-frog.itch.io/
 *
 *
 *
 * =======================================================================================
 * == Version and compatibility ==========================================================
 * =======================================================================================
 * 2020/11/27 Completed Plugins, v1.0.0
 *
 *
 * =======================================================================================
 * == END ================================================================================                                             
 * =======================================================================================
 *
 *                              "Have fun!"
 *                                                  TSR, The Northern Frog
 *
 * =======================================================================================
 *
 * 
 * @param ---General---
 *
 * @param Windows Layout
 * @parent ---General---
 * @type combo
 * @option normal
 * @option reverse
 * @desc Set the windows layout.
 * normal: status and dislay windows on the left
 * @default normal
 * 
 * @param Background Rectangle Color1
 * @parent ---General---
 * @desc Set the first gradient color of the background rectangles.
 * Enter rgba values separated by commas 
 * @default 1, 0, 50
 * 
 * @param Background Rectangle Color2
 * @parent ---General---
 * @desc Set the second gradient color of the background rectangles.
 * Enter rgba values separated by commas 
 * @default 40, 0, 200
 * 
 * 
 * @param ---Category Window---
 * 
 * @param Category Max Columns
 * @parent ---Category Window---
 * @type number
 * @min 1
 * @desc Max number of visible in the Category window.
 * Default: 4
 * @default 4
 * 
 * 
 * @param ---Status Window---
 * 
 * @param Enable Status Back Rect
 * @parent ---Status Window---
 * @type boolean
 * @on ON
 * @off OFF
 * @desc Show background rectangle in the status window.
 * OFF - false  ON - true
 * @default true
 *
 * 
 * @param ---Help Window---
 *
 * @param Item Info
 * @parent ---Help Window---
 * @text Item Info
 * @type note
 * @desc Set your item info here.
 * Refer to Plugin instructions.
 * @default ""
 * 
 * @param Params Name Acronyms
 * @parent ---Help Window---
 * @text Params Name Acronyms
 * @type note
 * @desc Set the 3 letters acronyms for your actors params.
 * Refer to Plugin instructions.
 * @default "0: MHP; \n1: MMP; \n2: ATK; \n3: DEF; \n4:MAT; \n5: MDF; \n6: AGI; \n7: LUK"
 * 
 * @param Enable Help Back Rect
 * @parent ---Help Window---
 * @type boolean
 * @on ON
 * @off OFF
 * @desc Show background rectangle in the Help Window.
 * OFF - false  ON - true
 * @default true
 * 
 * 
 * @param ---Item Window---
 *
 * @param Items Sorting Method
 * @parent ---Item Window---
 * @text Items Sorting Method
 * @type note
 * @desc Associate equipment slot Id to sorting methods.
 * Refer to Plugin instructions.
 * @default ""
 * 
 * @param Actors Equipment Sort
 * @parent ---Item Window---
 * @type boolean
 * @on ON
 * @off OFF
 * @desc Includes actord current equipments in the sorting method?
 * OFF - false  ON - true
 * @default true
 * 
 * @param Enable Item Back Rect
 * @parent ---Item Window---
 * @type boolean
 * @on ON
 * @off OFF
 * @desc Show background rectangle in the Item Window.
 * OFF - false  ON - true
 * @default true
 * 
 * 
 * @param ---Display Window---
 * 
 * @param Display Icons Positions
 * @parent ---Display Window---
 * @text Display Icons Positions.
 * @type note
 * @desc Set specific position for each slots in the window.
 * Refer to Plugin instructions.
 * @default ""
 * 
 * @param Display Icons Size
 * @parent ---Display Window---
 * @type number
 * @min 1
 * @desc Set the icon size in the Display Window.
 * Default: 36
 * @default 36
 * 
 * 
 */

//== PARAMETERS ============================================================================

TSR.Parameters = PluginManager.parameters('TSR_EquipSlots');

//General
TSR.equipSlots.window_layout   = String(TSR.Parameters['Windows Layout']);
TSR.equipSlots._BG_color1      = String(TSR.Parameters['Background Rectangle Color1']);
TSR.equipSlots._BG_color2      = String(TSR.Parameters['Background Rectangle Color2']);
TSR.equipSlots.makeColorArray  = function(color) {
    color = color.split(',');
    if (!color || color.length < 3) return [0, 0, 0, 0];
    let r = parseInt(/\d+/.exec(color[0]));
    let g = parseInt(/\d+/.exec(color[1]));
    let b = parseInt(/\d+/.exec(color[2]));
    let a = (color.length > 3)? parseFloat(/\d+.*\d*/.exec(color[3])) : 0.4;
    return [r, g, b, a];
 };
 TSR.equipSlots._BG_color1 = TSR.equipSlots.makeColorArray(TSR.equipSlots._BG_color1);
 TSR.equipSlots._BG_color2 = TSR.equipSlots.makeColorArray(TSR.equipSlots._BG_color2);

//Category window
TSR.equipSlots._category_maxCols = Number(TSR.Parameters['Category Max Columns']);

//Status window
TSR.equipSlots._BG_rect_status = String(TSR.Parameters['Enable Status Back Rect']);
TSR.equipSlots._BG_rect_status = eval(TSR.equipSlots._BG_rect_status);

//Help window
TSR.equipSlots._BG_rect_help  = String(TSR.Parameters['Enable Help Back Rect']);
TSR.equipSlots._BG_rect_help  = eval(TSR.equipSlots._BG_rect_help);
TSR.equipSlots.getStringObj = function (StringObj) {
    if (!StringObj) return 0;
    let obj = {};
    StringObj = StringObj.split(';');
    let prop, val, s, ss;
    for (let i in StringObj) {
      if (StringObj[i].includes('\n')) {
        s = StringObj[i].slice(0, StringObj[i].indexOf('\n'));
        ss = StringObj[i].slice(StringObj[i].indexOf('\n') + 1);
        StringObj[i] = s.concat(ss);
      }
      prop = StringObj[i].slice(0, StringObj[i].indexOf(':'));
      prop = prop.trim();
      val = StringObj[i].slice(StringObj[i].indexOf(':') + 1);
      val = val.trim()
      obj[prop] = val;
    }
    return obj;
};
TSR.equipSlots._paramsName = JSON.parse(TSR.Parameters['Params Name Acronyms']);
TSR.equipSlots._paramsName = TSR.equipSlots.getStringObj(TSR.equipSlots._paramsName);
TSR.equipSlots._itemEval = JSON.parse(TSR.Parameters['Item Info']);
TSR.equipSlots._itemEval = TSR.equipSlots.getStringObj(TSR.equipSlots._itemEval);

//Item window
//sort type = -1 (none), 'name' (alphabetical), paramId (numerical), 'best' (optimize) 
TSR.equipSlots.sort_item  = JSON.parse(TSR.Parameters['Items Sorting Method']);
TSR.equipSlots.sort_item  = TSR.equipSlots.getStringObj(TSR.equipSlots.sort_item);
TSR.equipSlots.sort_actor = String(TSR.Parameters['Actors Equipment Sort']);
TSR.equipSlots.sort_actor = eval(TSR.equipSlots.sort_actor);
TSR.equipSlots._BG_rect_item  = String(TSR.Parameters['Enable Item Back Rect']);
TSR.equipSlots._BG_rect_item  = eval(TSR.equipSlots._BG_rect_item);

//Display window
TSR.equipSlots.slot_position = JSON.parse(TSR.Parameters['Display Icons Positions']);
TSR.equipSlots.slot_position = TSR.equipSlots.getStringObj(TSR.equipSlots.slot_position);
TSR.equipSlots._displayIconWidth = Number(TSR.Parameters['Display Icons Size']) || Window_Base._iconWidth;



//=== MANAGER ===============================================================================

TSR.equipSlots.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!TSR.equipSlots.DataManager_isDatabaseLoaded.call(this)) return false;
  if (!TSR.equipSlots._loaded) {
    this.readActorsDisplayImageTag($dataActors);
    TSR.equipSlots._loaded = true;
  }
  return true;
};


//=== Notetags ============================================

DataManager.readActorsDisplayImageTag = function(group) {
    for (let n = 1; n < group.length; n++) {
      let tag = /<(?:ACTOR DISPLAY IMAGE|DISPLAY IMAGE):[ ](.*)>/i,
           obj = group[n],
      notedata = obj.note.split(/[\r\n]+/);
      obj._displayImage = null;
      for (let i = 0; i < notedata.length; i++) {
        let line = notedata[i];
        if (line.match(tag)) {
          let d = line.slice(line.indexOf(':') + 1, line.indexOf('>'));
          obj._displayImage = d.trim();
        } 
      }
    }
  };
  


//=== SCENE ===================================================================


//=== Scene_Equip ==================================

function Scene_Equip() {
    this.initialize.apply(this, arguments);
}

Scene_Equip.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Equip.prototype.constructor = Scene_Equip;

Scene_Equip.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Equip.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.checkLayoutDisposition();
    this.createStatusWindow();  
    this.createCategoryWindow();
    this.createDisplayWindow();
    this.createHelpWindow();
    this.createItemWindow();
    this.createWindowLayer();
    this.refreshActor();    
};

Scene_Equip.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    this._displayWindow.refresh();
};

Scene_Equip.prototype.checkLayoutDisposition = function() {
    this._reverse = (TSR.equipSlots.window_layout === 'reverse');
};

Scene_Equip.prototype.createHelpWindow = function() {
    let x = (this._reverse)? 0 : this._statusWindow.width;
    let y = this._categoryWindow.height;
    let w = Graphics.boxWidth - this._statusWindow.width;
    let h = Graphics.boxHeight - this._categoryWindow.height - (48 * 4 + 12);
    this._helpWindow = new Window_EquipHelp(x, y, w, h);
    this.addWindow(this._helpWindow);
};

Scene_Equip.prototype.createStatusWindow = function() {
    let x = (this._reverse)? Graphics.boxWidth - Math.floor(Graphics.boxWidth / 2.5) : 0;
    this._statusWindow = new Window_EquipStatus(x, 0);
    this.addWindow(this._statusWindow);
};

Scene_Equip.prototype.createDisplayWindow = function() {
    let wx = (this._reverse)? this._statusWindow.x : 0;
    let wy = this._statusWindow.height + this._categoryWindow.height;
    let ww = this._statusWindow.width;
    let wh = Graphics.boxHeight - wy;
    this._displayWindow = new Window_EquipDisplay(wx, wy, ww, wh);
    this._displayWindow.setActor(this.actor());
    this._displayWindow.reserveBattlerImages();
    this._categoryWindow.setDisplayWindow(this._displayWindow);
    this.addWindow(this._displayWindow);
};

Scene_Equip.prototype.createCategoryWindow = function() {
    let wx = 0;
    let wy = 0;
    let ww = Graphics.boxWidth;
    this._categoryWindow = new Window_EquipCategory(wx, wy, ww);
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.setStatusWindow(this._statusWindow);
    this._categoryWindow._statusWindow._isActive = true;
    this._statusWindow.y = this._categoryWindow.height;
    this._categoryWindow.setHandler('ok',       this.onSlotOk.bind(this));
    this._categoryWindow.setHandler('cancel',   this.popScene.bind(this));
    this.addWindow(this._categoryWindow);
    this._categoryWindow.activate();
    this._categoryWindow.select(0);
};

Scene_Equip.prototype.createItemWindow = function() {
    let wx = this._helpWindow.x;
    let wy = this._helpWindow.y + this._helpWindow.height;
    let ww = this._helpWindow.width;
    let wh = Graphics.boxHeight - wy;
    this._itemWindow = new Window_EquipItem(wx, wy, ww, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setStatusWindow(this._statusWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this._categoryWindow.setItemWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
};

Scene_Equip.prototype.createEquipWindow = function() {   
    let wx = this._helpWindow.x;
    let wy = this._categoryWindow.height + 
             this._helpWindow.lineHeight() * 2 + this._helpWindow.textPadding();
    let ww = this._helpWindow.width;
    this._equipWindow = new Window_Equips(wx, wy, ww);
    this._equipWindow.setHandler('equip',  this.onEquipOk.bind(this)); 
    this._equipWindow.setHandler('remove', this.onRemoveOk.bind(this));  
    this._equipWindow.setHandler('optimize', this.onOptimize.bind(this));  
    this._equipWindow.setHandler('cancel', this.onEquipCancel.bind(this));
    this.addWindow(this._equipWindow);
};

Scene_Equip.prototype.refreshActor = function() {
    let actor = this.actor();
    this._categoryWindow.setActor(actor);
    this._itemWindow.setActor(actor);
    this._statusWindow.setActor(actor);
    this._displayWindow.setActor(actor); 
    this._helpWindow.open();
};

Scene_Equip.prototype.windowIndex = function() {
    return this._categoryWindow.index();
};

Scene_Equip.prototype.slotId = function() {
    return this.actor().equipSlots()[this.windowIndex()]
};

Scene_Equip.prototype.onSlotOk = function() {
    if (this._itemWindow._data.length > 0) {
      this._itemWindow.activate();
      let actor = this.actor();
      let slot  = this._categoryWindow.index();
      let index = 0;
      if (actor.equips()[slot]) {
          index = this._itemWindow._data.indexOf(actor._equipments[slot]);
      }
      this._itemWindow.select(index);
      this._categoryWindow._statusWindow._isActive = false;
    } else {
      this.activateCategoryWindow();
    }
};

Scene_Equip.prototype.onItemOk = function() {
    let item = this._itemWindow.item();
    if (item) { 
        SoundManager.playOk();
        TSR.equipSlots._windowCommands = this.createCommandList();
        this._itemActive = true;
        this.createEquipWindow();       
        this._equipWindow.activate();
        this._equipWindow.open();
        this._equipWindow.refresh();
        this._itemWindow.setPulseIconWidth(this._itemWindow._maxIconWidth);
        this._itemWindow.updateStatus();
        this._itemWindow.refresh();
        this._helpWindow.setText(item.name, '', item.iconIndex, item);
    } else {
        this.onItemCancel();
    }
};

Scene_Equip.prototype.createCommandList = function() {
    let slotId      = this._categoryWindow.index();
    let actor       = this.actor();
    let item        = this._itemWindow.item();
    let removable   = (actor._equipments)? actor._equipments[slotId] === item : false;
    let cmdList     = [];
    if (actor.equips()[slotId] && !removable) {
        cmdList.push(['change', 'equip'])
    } else if (!actor.equips()[slotId] && !removable) {
        cmdList.push(['equip', 'equip']) 
    }
    if (removable) cmdList.push(['remove', 'remove'])
    cmdList.push(['optimize', 'optimize'])
    cmdList.push(['cancel', 'cancel'])
    return cmdList;
};

Scene_Equip.prototype.onOptimize = function() {
    SoundManager.playEquip();
    this.actor().optimizeEquipments(this._categoryWindow.index());
    this.activateCategoryWindow();
    this._equipWindow.close(); 
    this.resetAll();
};

Scene_Equip.prototype.onItemCancel = function() {
    this.activateCategoryWindow();
    this.resetAll();
};

Scene_Equip.prototype.onEquipOk = function() {
    SoundManager.playEquip();
    let slotId = this._categoryWindow.index();
    this.actor().changeEquip(slotId, this._itemWindow.item());
    this._helpWindow.opacity = 255;
    this.activateCategoryWindow();
    this._equipWindow.close(); 
    this.resetAll();
};

Scene_Equip.prototype.onRemoveOk = function() {
    SoundManager.playEquip();
    let slotId = this._categoryWindow.index();
    this.actor().changeEquip(slotId, false);
    this.activateCategoryWindow();
    this._equipWindow.close();
    this.resetAll();
};

Scene_Equip.prototype.activateCategoryWindow = function() {
    this._categoryWindow.activate();
    this._categoryWindow._statusWindow._isActive = true;
    this._categoryWindow.refresh();
};

Scene_Equip.prototype.resetAll = function() {
    for (let i in this._helpWindow._xPos) {
        this._helpWindow._xPos[i] = 0;
        this._helpWindow._goRight[i] = 0;
        this._helpWindow._animCount[i] = 0;
    }
    TSR.equipSlots._windowCommands = null;
    this._itemActive = false;
    this.resetItemWindow();
    this._helpWindow._done = {};
    this._helpWindow.contents.clear();
    this._statusWindow.setTempActor('');
    this._displayWindow.refresh();
};

Scene_Equip.prototype.resetItemWindow = function() {
    this._itemWindow.setPulseIconWidth(this._itemWindow._baseIconWidth);
    this._itemWindow.refresh();
    this._itemWindow.deselect();
};

Scene_Equip.prototype.onEquipCancel = function() {
    this._equipWindow.close();
    this.removeChild(this._equipWindow);
    this._itemWindow.activate();
    TSR.equipSlots._windowCommands = null;
    this._displayWindow.refresh();
};

Scene_Equip.prototype.onActorChange = function() {
    this.resetItemWindow();
    this._categoryWindow.select(0);
    this.refreshActor();
};

Scene_Equip.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    if ($gameParty.menuActor() !== this._actor) {
        this._actor = $gameParty.menuActor();
        this.onActorChange();
    }
    if (!this._itemWindow.isOpenAndActive()) {
        if (this._equipWindow && this._equipWindow.isOpenAndActive()) {
            let item = this._itemWindow.item();
            if (item) {
                this._helpWindow.setText(item.name, '', item.iconIndex, item);
            } else {
                this._helpWindow.setText('');
            }
        } else if (!this._itemActive) {
            let item = this._actor.equips()[this._categoryWindow.index()]
            if (item) {
                this._helpWindow.setText(item.name, item.description, item.iconIndex, item);
            } else {
                this._helpWindow.setText('');
            }
        }        
    } 
};



//=== WINDOW =======================================================================


//=== Window_Base ==============================================

Window_Base.prototype.drawRect = function(x, y, width, height, opacity) {
    let rect = new Rectangle();
    rect.width = width;
    rect.height = height;
    rect.x = x;
    rect.y = y;
    this.drawRectFill(rect.x, rect.y, rect.width, rect.height, opacity)
    return rect
};

Window_Base.prototype.drawRectFill = function(x, y, width, height, opacity) {
    let w = Math.ceil(width / 2);
    let color1 = this.makeBG_color(TSR.equipSlots._BG_color1, opacity);
    let color2 = this.makeBG_color(TSR.equipSlots._BG_color2, opacity);
    this.contents.gradientFillRect(x, y, w, height, color1, color2);
    this.contents.gradientFillRect(x + w, y, w, height, color2, color1);
};

Window_Base.prototype.makeBG_color = function(rgb, opacity) {
    let op = opacity || rgb[3];
    return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + op + ')';
};

Window_Base.prototype.drawEquipIcon = function(iconIndex, x, y, w) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    let dw = w;
    let dh = dw;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y, dw, dh);
};

Window_Base.prototype.pulseIcon = function(iconWidth) {
    let min = this._baseIconWidth;
    let max = this._maxIconWidth;
    if (!this._decreasing) {
        if (iconWidth < max) {
            iconWidth++
        } else {
            this._decreasing = true;
        }
    } else {
        if (iconWidth > min) {
            iconWidth--
        } else {
            this._decreasing = false;
        }
    }
    return iconWidth;
};

Window_Base.prototype.halfValueDiff = function(value1, value2) {
    return (value1 - value2) / 2;
};

Window_Base.prototype.independentEquip = function(item) {
    if (!item) return;
    if (item.etypeId === 1 && Imported.YEP_ItemCore) return Yanfly.Param.ItemMaxWeapons > 0;
    if (item.etypeId > 1 && Imported.YEP_ItemCore) return Yanfly.Param.ItemMaxArmors > 0;
    return false;
};

TSR.equipSlots._createAllParts = Window.prototype._createAllParts;
Window.prototype._createAllParts = function() {
   TSR.equipSlots._createAllParts.call(this);
   if (SceneManager._scene instanceof Scene_Equip) {     
     this._leftArrowSprite = new Sprite();
     this.addChild(this._leftArrowSprite);
     this._rightArrowSprite = new Sprite();
     this.addChild(this._rightArrowSprite);
   }
};

   TSR.equipSlots._refreshArrows = Window.prototype._refreshArrows;
Window.prototype._refreshArrows = function() {
   TSR.equipSlots._refreshArrows.call(this); 
   if (SceneManager._scene instanceof Scene_Equip) {    
     let w = this._width;
     let h = this._height;
     this._leftArrowSprite.bitmap = this._windowskin;
     this._leftArrowSprite.anchor.x = 0.5;
     this._leftArrowSprite.anchor.y = 0.5;
     this._leftArrowSprite.setFrame(108, 40, 26, 16);
     this._leftArrowSprite.move(8, h/2);
     this._rightArrowSprite.bitmap = this._windowskin;
     this._rightArrowSprite.anchor.x = 0.5;
     this._rightArrowSprite.anchor.y = 0.5;
     this._rightArrowSprite.setFrame(156, 40, 26, 16);
     this._rightArrowSprite.move(w-8, h/2);
   }
};


//=== Window_EquipStatus =====================================

function Window_EquipStatus() {
    this.initialize.apply(this, arguments);
}

Window_EquipStatus.prototype = Object.create(Window_Base.prototype);
Window_EquipStatus.prototype.constructor = Window_EquipStatus;

Window_EquipStatus.prototype.initialize = function(x, y) {
    let width = this.windowWidth();
    let height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this._tempActor = null;
    this.refresh();
};

Window_EquipStatus.prototype.windowWidth = function() {
    return Math.floor(Graphics.boxWidth / 2.5);
};

Window_EquipStatus.prototype.windowHeight = function() {
    this._windowHeight
    return this.fittingHeight(this.numVisibleRows());
};

Window_EquipStatus.prototype.numVisibleRows = function() {
    return 8;
};

Window_EquipStatus.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_EquipStatus.prototype.lineHeight = function() {
    return 30
};

Window_EquipStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        let x = Math.floor(this.windowWidth() / 2);
        let w = x - this.standardPadding();
        this.drawActorFace(this._actor, 0, this.lineHeight(), w, w);
        this.contents.fontSize = 28;
        this.drawActorName(this._actor, this.textPadding(), 0, w);
        this.contents.fontSize = 24
        if (TSR.equipSlots._BG_rect_status) this.drawRect(x, 0, x, this.lineHeight() * 6);
        for (let i = 0; i < 6; i++) {
            this.drawItem(x + this.textPadding() / 2, this.lineHeight() * i, 2 + i, w);
        }
        if (this._actor && this._tempActor) {
            let newValue = this._tempActor.param(0);
            let diffvalue = newValue - this._actor.param(0);
            if (diffvalue) {
                this.drawActorHp(this._tempActor, 0, this.lineHeight() * 6,
                this.width - this.standardPadding() * 2, this.paramchangeTextColor(diffvalue));
            } else {
                this.drawActorHp(this._actor, 0, this.lineHeight() * 6, 
                this.width - this.standardPadding() * 2);    
            }
            newValue = this._tempActor.param(1);
            diffvalue = newValue - this._actor.param(1);
            if (diffvalue) {
                this.drawActorMp(this._tempActor, 0, this.lineHeight() * 7, 
                this.width - this.standardPadding() * 2, this.paramchangeTextColor(diffvalue));
            } else {
                this.drawActorMp(this._actor, 0, this.lineHeight() * 7, 
                this.width - this.standardPadding() * 2);    
            }
        } else {
            this.drawActorHp(this._actor, 0, this.lineHeight() * 6, 
            this.width - this.standardPadding() * 2);
            this.drawActorMp(this._actor, 0, this.lineHeight() * 7, 
            this.width - this.standardPadding() * 2);
        }
    }
};

Window_EquipStatus.prototype.setTempActor = function(tempActor) {
    if (this._tempActor !== tempActor) {
        this._tempActor = tempActor;
        this.refresh();
    }
};

Window_EquipStatus.prototype.drawItem = function(x, y, paramId, maxWidth) {
    this.contents.fontSize = 24;
    this.drawParamName(x + this.textPadding(), y, paramId, maxWidth);
    if (this._actor && this._tempActor) {
        let newValue = this._tempActor.param(paramId);
        let diffvalue = newValue - this._actor.param(paramId);
        if (diffvalue) {
          this.drawNewParam(x + maxWidth / 2, y, paramId);
        } else {
          this.drawCurrentParam(x + maxWidth / 2, y, paramId);  
        }  
    } else if (this._actor) {
        this.drawCurrentParam(x + maxWidth / 2, y, paramId); 
    }
};

Window_EquipStatus.prototype.drawParamName = function(x, y, paramId, maxWidth) {
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.param(paramId), x, y, maxWidth / 2);
};

Window_EquipStatus.prototype.drawCurrentParam = function(x, y, paramId) {
    this.resetTextColor();
    let textWidth = this.textWidth('0000');
    this.drawText(this._actor.param(paramId), x, y, textWidth, 'right');
};

Window_EquipStatus.prototype.drawNewParam = function(x, y, paramId) {
    let newValue = this._tempActor.param(paramId);
    let diffvalue = newValue - this._actor.param(paramId);
    this.changeTextColor(this.paramchangeTextColor(diffvalue));
    let textWidth = this.textWidth('0000');
    this.drawText(newValue, x, y, textWidth, 'right');
};

Window_EquipStatus.prototype._updateArrows = function() {
    this._leftArrowSprite.visible = false;
    this._rightArrowSprite.visible = false;
    if ($gameParty.battleMembers().length > 1 && this._isActive) {
        this._downArrowSprite.visible = true;
        this._upArrowSprite.visible = true;
    } else {
        this._downArrowSprite.visible = false;
        this._upArrowSprite.visible = false;
    }
};


//=== Window_EquipHelp ==============================================

function Window_EquipHelp() {
    this.initialize.apply(this, arguments);
}

Window_EquipHelp.prototype = Object.create(Window_Base.prototype);
Window_EquipHelp.prototype.constructor = Window_EquipHelp;

Window_EquipHelp.prototype.initialize = function(x, y, w, h) {
    Window_Base.prototype.initialize.call(this, x, y, w, h);
    this._text = '';   
    this._xPos = {};
    this._goRight = {};
    this._animCount = {};
    this._done = {};
    let obj = TSR.equipSlots._itemEval;
    for (let i = 0; i < Object.keys(obj).length; i++) {
        this._xPos[i] = 0;
        this._goRight[i] = 0;
        this._animCount[i] = 0
    };
};

Window_EquipHelp.prototype.setText = function(name, description, iconIndex, item) {
    this._name = name;
    this._description = description;
    this._iconIndex = iconIndex;
    this._item = item;
    this.refresh();
};

Window_EquipHelp.prototype.clear = function() {
    this.setText('');
};

Window_EquipHelp.prototype.setItem = function(item) {
    if (item) {
      let name = item.name;
      let description = item.description;
      let iconIndex = item.iconIndex;
      this.setText(name, description, iconIndex, item);
      this._animationCount = 0
    } else {
      this.clear();
    }
};

Window_EquipHelp.prototype.lineHeight = function(size) {
    if (size) this.contents.fontSize = size; 
    return this.contents.fontSize + this.pad() * 2;
};

Window_EquipHelp.prototype.pad = function() {
    return this.contents.fontSize / 4.66;
};

Window_EquipHelp.prototype.refresh = function() {
    this.contents.clear();
    for (let a in this._animCount) this._animCount[a]++;
    if (this._lastItem !== this._item) {
        this._lastItem = this._item;
        for (let i in this._xPos) {
            this._xPos[i] = 0;
            this._goRight[i] = 0;
            this._animCount[i] = 0
        }
        this._done = {};
    }
    let x = this.textPadding();
    let y = 0;
    let w = this.width;
    let h = this.lineHeight(28) + x / 2;
    this.drawNameBox(x, y, w, h);
    y += h + x;
    let dh = this.lineHeight(18) + x / 2;
    this.drawDescriptionBox(x, y, w, dh);  
    y += dh * 2 + x;
    if (TSR.equipSlots._BG_rect_help && this._item) this.drawRect(0, y, w, dh * 2);
    this.contents.fontSize = 16;
    this.drawItemParams(this._item, x, y, w);
    y += dh * 2 + x;
    this.drawItemInfos(this._item, 0, y, w);
};

Window_EquipHelp.prototype.drawNameBox = function(x, y, w, h) {
    if (TSR.equipSlots._BG_rect_help && this._item) this.drawRect(0, 0, w, h);
    this.changeTextColor(this.textColor(6));
    this.drawEquipIcon(this._iconIndex, x, 2, this.lineHeight());
    x += this.lineHeight() + this.textPadding();
    this.drawText(this._name, x, this.pad() / 2, w - x * 2);
};

Window_EquipHelp.prototype.drawDescriptionBox = function(x, y, w, h) {
    if (TSR.equipSlots._BG_rect_help && this._item) this.drawRect(0, y, w, h * 2);
    this.resetTextColor();
    this.drawTextEx(this._description, x, y);
};

Window_EquipHelp.prototype.drawItemParams = function(item, x, y, maxWidth) {
    if (item) {
        let params = item.params;
        let paramNameList = [];
        let paramList = [];
        x += this.standardPadding() * 2;
        for (let i = 0; i < 8; i++) {
            paramList.push(params[i]);
            paramNameList.push(TSR.equipSlots._paramsName[i] || '???')
        }
        for (let j in paramList) {
            let py = (j < 4)? y : y + this.lineHeight();
            let p = (j < 4)? j : j - 4;
            let textWidth = this.textWidth('---') + this.textPadding();
            let paramWidth = maxWidth / 4 - this.standardPadding() * 2;
            let paramSpacing = paramWidth + this.textPadding() * 2;
            let param = '-';
            this.changeTextColor(this.systemColor());
            this.drawText(paramNameList[j], x + (paramSpacing * p), py, paramWidth);
            if (paramList[j] > 0) {
                this.resetTextColor();
                param = '+' + paramList[j];
            } else {
                this.changeTextColor(this.textColor(8));
            }
            this.drawText(param, x + (paramSpacing * p) + textWidth, py, paramWidth);
        }
    }
};

Window_EquipHelp.prototype.drawItemInfos = function(item, x, y, w) {
    if (item) {
        let obj = TSR.equipSlots._itemEval;
        let prop = Object.keys(obj);
        let val  = Object.values(obj);
        let numLines = (prop.length > 2)? prop.length : 3;
        let secHeight = ((this.height - y) / numLines) - this.textPadding();
        for (let i = 0; i < prop.length; i++) {
            let arr = val[i].split(',');
            if (arr[0].includes('elements')) {
                this.drawElements(item, arr, prop[i], x, y + (secHeight * i), w, secHeight, i);
            } else if (arr[0].includes('states')) {
                this.drawStates(item, prop[i], x, y + (secHeight * i), w, secHeight, i);
            } else if (arr[0].includes('durability') && Imported.YEP_ItemCore && 
                      (DataManager.isIndependent(item) || this.independentEquip(item))) {
                this.drawDurability(item, x, y + (numLines * i), w, secHeight);
            } else if (arr[0].includes('augment') && Imported.YEP_ItemCore && 
                      (DataManager.isIndependent(item) || this.independentEquip(item))) {
                this.drawAugments(item, prop[i], x, y + (secHeight * i), w, secHeight, i);
            }
        }
    }
};

Window_EquipHelp.prototype.drawElements = function(item, arr, prop, x, y, w, h, i) {   
    if (TSR.equipSlots._BG_rect_help && this._item) this.drawRect(x, y, w, h);
    let title = prop; 
    let tw = this.textWidth('000') + this.lineHeight() + this.textPadding() * 2;
    let tx =  x + w / 5 + this.textPadding() + this._xPos[i];
    let rateList = {atk: {}, def: {}};
    for (let a = 1; a < arr.length; a++) {
        let element = arr[a];
        let iconIndex = '';
        if (arr[i].includes('(')) {
            element = arr[a].slice(0, arr[a].indexOf('(')).trim();
            iconIndex = arr[a].slice(arr[a].indexOf('(') + 1, arr[a].indexOf(')'));      
            for (let j in item.traits) {
                if (item.traits[j].code === 31 && item.traits[j].dataId == element) {
                    if (!rateList.atk[element]) rateList.atk[element] = 'attack'
                } else if (item.traits[j].code === 11 && item.traits[j].dataId == element) {
                    if (rateList.def[element] === undefined) {
                        rateList.def[element] = item.traits[j].value;         
                    } else {
                        rateList.def[element] *= item.traits[j].value;
                    }           
                 } 
            }
            if (rateList.atk[element]) {
                let value = rateList.atk[element];
                this.changeTextColor(this.textColor(0));
                this.drawEquipIcon(iconIndex, tx, y, this.lineHeight());
                this.drawText(value, tx + this.lineHeight() + 2, y, tw / 2);
                tx += tw + this.textPadding();
            }
            if (rateList.def[element] !== undefined) {
                let value = -(100 - rateList.def[element] * 100);
                let regen = (value < -100);
                this.changeTextColor(this.textColor(this.rateColor(value)));
                value = this.checkValue(value, regen); 
                this.drawEquipIcon(iconIndex, tx, y, this.lineHeight());
                this.drawText(value, tx + this.lineHeight() + 2, y, 
                             (value === 'Immune' || value === 'Regen')? tw / 2 : tw);
                tx += tw + this.textPadding();
            }
        } 
    }
    this.changeTextColor(this.systemColor());
    this.drawRect(x, y, w / 5 + this.textPadding(), h, 1);
    this.drawText(title, x + this.textPadding(), y, w / 5 - this.textPadding() * 2, 'right');
    this.updateInfoLine('elements', [rateList.atk, rateList.def], w, i);
};

Window_EquipHelp.prototype.drawStates = function(item, prop, x, y, w, h, i) {    
    if (TSR.equipSlots._BG_rect_help && this._item) this.drawRect(x, y, w, h);
    let title = prop;
    let tw = this.textWidth('000') + this.lineHeight() + this.textPadding() * 2;
    let tx = x + w / 5 + this.textPadding() + this._xPos[i];
    let rateList = {atk: {}, def: {}};
    for (let j in item.traits) {
        if (item.traits[j].code === 32) {
            let state = item.traits[j].dataId;
            let iconIndex = $dataStates[state].iconIndex;
            if (!rateList.atk[state]) {
                rateList.atk[state] = [item.traits[j].value, iconIndex];
            } else {
                rateList.atk[state][0] *= item.traits[j].value;
            }
        } else if (item.traits[j].code === 13) {
            let state = item.traits[j].dataId;
            let iconIndex = $dataStates[state].iconIndex;
            if (!rateList.def[state]) {
                rateList.def[state] = [item.traits[j].value, iconIndex];         
            } else {
                rateList.def[state][0] *= item.traits[j].value;
            }           
         } else if (item.traits[j].code === 14) {
            let state = item.traits[j].dataId;
            let iconIndex = $dataStates[state].iconIndex;
            if (!rateList.def[state]) rateList.def[state] = [0, iconIndex];   
         } 
    }
    for (let a in rateList.atk) {
        let value = -(100 - rateList.atk[a][0] * 100);
        let iconIndex = rateList.atk[a][1];
        this.drawEquipIcon(iconIndex, tx, y, this.lineHeight());
        this.resetTextColor();
        this.drawText('attack', tx + this.lineHeight() + 2, y, tw / 2);
        this.changeTextColor(this.textColor(this.rateColor(value)));
        value = this.checkValue(-value, false, true); 
        this.drawText(value, tx + this.lineHeight() + 2, y, tw, 'right');
        tx += tw * ((value)? 1.5 : 1) + this.textPadding();
    }
    for (let d in rateList.def) {
        let value = -(100 - rateList.def[d][0] * 100);
        let iconIndex = rateList.def[d][1]
        this.drawEquipIcon(iconIndex, tx, y, this.lineHeight());
        this.changeTextColor(this.textColor(this.rateColor(value)));
        value = this.checkValue(value, false); 
        this.drawText(value, tx + this.lineHeight() + 2, y, tw);
        tx += tw + this.textPadding();
    }
    this.changeTextColor(this.systemColor());
    this.drawRect(x, y, w / 5 + this.textPadding(), h, 1);
    this.drawText(title, x + this.textPadding(), y, w / 5 - this.textPadding() * 2, 'right');
    this.updateInfoLine('states', [rateList.atk, rateList.def], w, i);
};

Window_EquipHelp.prototype.totalWidth = function(atkObj, defObj) {
    let totalWidth = 0;
    for (let a in atkObj) {
       totalWidth += this.textWidth(atkObj[a]) + this.lineHeight() + this.textPadding() * 2; 
    }
    for (let d in defObj) {
        totalWidth += this.textWidth(defObj[d]) + this.lineHeight() + this.textPadding() * 2; 
    }
    return totalWidth;
};
            
Window_EquipHelp.prototype.drawAugments = function(item, prop, x, y, w, h, i) {   
    if (TSR.equipSlots._BG_rect_help && this._item) this.drawRect(x, y, w, h);
    let title = prop;
    let tw = this.textWidth('00000') + this.lineHeight() + this.textPadding() * 2;
    let length = item.augmentSlots.length;
    this.resetTextColor();
    let tx = x + w / 5 + this.textPadding() + this._xPos[i];
    for (let i = 0; i < length; ++i) {
        this.drawAugmentSlots(item, i, tx, y, tw);
        tx += tw;
    }
    let totalWidth = tw * length
    this.changeTextColor(this.systemColor());
    this.drawRect(x, y, w / 5 + this.textPadding(), h, 1);
    this.drawText(title, x + this.textPadding(), y, w / 5 - this.textPadding() * 2, 'right');
    this.updateInfoLine('augments', totalWidth, w, i);
};

Window_EquipHelp.prototype.drawAugmentSlots = function(item, slot, x, y, tw) {
    let data = (item.augmentSlotItems)? item.augmentSlotItems[slot] : ' ';
    let iconIndex = 16;
    let slotName = item.augmentSlots[slot];
    if (data.match(/WEAPON[ ](\d+)/i)) {
      let id = parseInt(RegExp.$1);
      let augment = $dataWeapons[id];
      if (augment) iconIndex = augment.iconIndex
    } else if (data.match(/ARMOR[ ](\d+)/i)) {
      let id = parseInt(RegExp.$1);
      let augment = $dataArmors[id];
      if (augment) iconIndex = augment.iconIndex
    }
    this.drawEquipIcon(iconIndex, x, y, this.lineHeight());
    this.drawText(slotName, x + this.lineHeight() + 2, y, tw / 2);
};

Window_EquipHelp.prototype.drawDurability = function(item, x, y, w, h) {
    let dur = item.durability;
    let durMax = item.durMax;
    let text = Yanfly.Param.IDurText;
    if (TSR.equipSlots._BG_rect_help && this._item) this.drawRect(x, y, w, h);
    this.contents.fontSize = h - this.textPadding() * 2;
    this.changeTextColor(this.textColor(11));
    x += this.textPadding();
    if (TSR.TLC_script) {
        let iconSize = h - this.textPadding() / 2;
        this.drawDurabilityIcon(item, x, y, iconSize);
        if (this.materialIcon(item.name)) {
            x += iconSize + this.textPadding();
            w -= iconSize + this.textPadding();
        }
    }
    this.drawText(text, x, y, w / 5, 'right');
    let durColor = this.durabilityColor(dur, durMax);
    this.changeTextColor(this.textColor(durColor));  
    w -= this.textPadding() * 6;
    if (dur < 0) {
        dur = Yanfly.Param.IDurUnbreakable;
        this.changeTextColor(this.textColor(Yanfly.Param.IDurColor['unbreak']));  
    } else if (dur > 0.5 * durMax && TSR.TLC_script) {
        dur = dur + '/' + durMax;
        this.changeTextColor(this.textColor(this.materialIcon(item.name))); 
    } else {
        dur = dur + '/' + durMax;
    }
    this.drawText(dur, x, y, w, 'right');
};

Window_EquipHelp.prototype.updateInfoLine = function(type, info, w, i) {
    let totalWidth;
    if (type === 'elements' || type === 'states'){
        totalWidth = this.totalWidth(info[0], info[1]);
    } else if (type === 'augments') {
        totalWidth = info;
    }
    if (totalWidth > w - w / 5) {
        if (!this._done[i]) this._done[i] = 0;
        if (!this._goRight[i]) {
            if (this._xPos[i] > -totalWidth + w - w / 5 - this.lineHeight()) {
                 if (this._animCount[i] % 1 === 0 && this._animCount[i] > 60) this._xPos[i]--;
            } else {
                this._done[i] = 1;
                let done = 0
                for (let i in this._done) {
                    if (this._done[i]) done++;
                }
                if (done === Object.keys(this._done).length) {
                    this._goRight[i] = true;
                    this._animCount[i] = 0;
                }
            }
        } else {
            if (this._xPos[i] < 0) {
                if (this._animCount[i] % 1 === 0 && this._animCount[i] > 60) this._xPos[i]++;
            } else {
                this._done[i] = 0;
                let done = 0
                for (let i in this._done) {
                    if (!this._done[i]) done++;
                }
                if (done === Object.keys(this._done).length) {
                    this._goRight[i] = 0;
                    this._animCount[i] = 0;
                }
            }
        }
    }
}

Window_EquipHelp.prototype.rateColor = function(rate) {
    if (rate === -100) {
        return 27
    } else if (rate <= -75) {
        return 27;
    } else if (rate <= -50) {
        return 31;
    } else if (rate <= -25) {
        return 13;
    } else if (rate < 0) {
        return 5;
    } else if (rate >= 100) {
        return 10;
    } else if (rate >= 50) {
        return 2;
    } else if (rate >= 25) {
        return 14;
    } else if (rate > 0) {
        return 6;
    } 
};

Window_EquipHelp.prototype.checkValue = function(value, regen, state) {   
    if (value > 0) {
        if (state) {
            return ' ' + Math.round(value) + '%'; 
        } else {
            return '+' + Math.round(value) + '%'; 
        }
    } else if (value === -100) {
        return 'Immune'
    } else if (regen) {
        return 'Regen'
    } else if (value < 0) {
        return Math.round(value) + '%';
    } else {
        return '';
    }
};

Window_EquipHelp.prototype.durabilityColor = function(cur, max) {
    if (cur === max) {
      return Yanfly.Param.IDurColor['max'];
    } else if (cur >= 1.90 * max) {
      return Yanfly.Param.IDurColor['rate190'];
    } else if (cur >= 1.75 * max) {
      return Yanfly.Param.IDurColor['rate175'];
    } else if (cur >= 1.50 * max) {
      return Yanfly.Param.IDurColor['rate150'];
    } else if (cur >= 1.20 * max) {
      return Yanfly.Param.IDurColor['rate120'];
    } else if (cur >= 1.00 * max) {
      return Yanfly.Param.IDurColor['rate110'];
    } else if (cur >= 0.80 * max) {
      return Yanfly.Param.IDurColor['rate100'];
    } else if (cur >= 0.50 * max) {
      return Yanfly.Param.IDurColor['rate80'];
    } else if (cur >= 0.30 * max) {
      return Yanfly.Param.IDurColor['rate50'];
    } else if (cur >= 0.20 * max) {
      return Yanfly.Param.IDurColor['rate25'];
    } else if (cur >= 0.10 * max) {
      return Yanfly.Param.IDurColor['rate10'];
    } else {
      return Yanfly.Param.IDurColor['rate1'];
    }
};

Window_EquipHelp.prototype.drawTextEx = function(text, x, y) {
    if (text) {
        var textState = { index: 0, x: x, y: y, left: x };
        textState.text = this.convertEscapeCharacters(text);
        textState.height = this.calcTextHeight(textState, false);
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
        return textState.x - x;
    } else {
        return 0;
    }
};

Window_EquipHelp.prototype._updateArrows = function() {
    this._upArrowSprite.visible = false;
    this._downArrowSprite.visible = false;
    this._leftArrowSprite.visible = false;
    this._rightArrowSprite.visible = false;
};


//=== Window_EquipCategory ==============================================

function Window_EquipCategory() {
    this.initialize.apply(this, arguments);
}

Window_EquipCategory.prototype = Object.create(Window_HorzCommand.prototype);
Window_EquipCategory.prototype.constructor = Window_EquipCategory;

Window_EquipCategory.prototype.initialize = function(x, y, width) {
    this._windowWidth = width;
    Window_HorzCommand.prototype.initialize.call(this, x, y);
    this._actor = null;
    this.refresh();
};

Window_EquipCategory.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_EquipCategory.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if (this._itemWindow) {
        let slotId = this.index();
        this._itemWindow.setSlotId(slotId);
        this._displayWindow.setSlotId(slotId);
    }
};

Window_EquipCategory.prototype.maxCols = function() {
    return TSR.equipSlots._category_maxCols;
};

Window_EquipCategory.prototype.windowWidth = function() {
    return this._windowWidth;
};

Window_EquipCategory.prototype.maxItems = function() {
    return this._actor ? this._actor.equipSlots().length : 0;
};

Window_EquipCategory.prototype.item = function() {
    return this._actor ? this._actor.equips()[this.index()] : null;
};

Window_EquipCategory.prototype.drawItem = function(index) {
    if (this._actor) {
        var rect = this.itemRectForText(index);
        this.changePaintOpacity(this.isEnabled(index));
        this.contents.fontSize = 28;
        this.drawText(this.slotName(index), rect.x, rect.y, this.cmdWidth(), 'center');
        this.changePaintOpacity(true);
    }
};

Window_EquipCategory.prototype.cmdWidth = function() {
    return this._windowWidth / this.maxCols() - (this.maxCols() - 1) * this.spacing();
};

Window_EquipCategory.prototype.slotName = function(index) {
    let slots = this._actor.equipSlots();
    return this._actor ? $dataSystem.equipTypes[slots[index]] : '';
};

Window_EquipCategory.prototype.isEnabled = function(index) {
    return this._actor ? this._actor.isEquipChangeOk(index) : false;
};

Window_EquipCategory.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.index());
};

Window_EquipCategory.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};

Window_EquipCategory.prototype.setItemWindow = function(itemWindow) {
    this._itemWindow = itemWindow;
};

Window_EquipCategory.prototype.setDisplayWindow = function(displayWindow) {
    this._displayWindow = displayWindow;
};

Window_EquipCategory.prototype.updateHelp = function() {
    Window_Selectable.prototype.updateHelp.call(this);
    this.setHelpWindowItem(this.item());
    if (this._statusWindow) {
        this._statusWindow.setTempActor(null);
    }
};

Window_EquipCategory.prototype.cursorUp = function(wrap) {  
    if ($gameParty.battleMembers().length > 1) {
        $gameParty.makeMenuActorPrevious();
        SoundManager.playCursor();
    }
};

Window_EquipCategory.prototype.cursorDown = function(wrap) { 
    if ($gameParty.battleMembers().length > 1) {
        $gameParty.makeMenuActorNext();
        SoundManager.playCursor();
    }
};

Window_EquipCategory.prototype._updateArrows = function() {
    this._upArrowSprite.visible = false;
    this._downArrowSprite.visible = false;
    let needsLeftArrows = this.index() + 1 > this.maxCols();
    let needsRightArrows = this.maxCols() < this._actor.equipSlots().length && this.index() + 1 <= this.maxCols();
    this._leftArrowSprite.visible = needsLeftArrows && this.isOpenAndActive();
    this._rightArrowSprite.visible = needsRightArrows && this.isOpenAndActive();
};


//=== Window_EquipItem ====================================================

function Window_EquipItem() {
    this.initialize.apply(this, arguments);
}

Window_EquipItem.prototype = Object.create(Window_ItemList.prototype);
Window_EquipItem.prototype.constructor = Window_EquipItem;

Window_EquipItem.prototype.initialize = function(x, y, width, height) {
    Window_ItemList.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this._slotId = 0;
    this._baseIconWidth = Window_Base._iconWidth;
    this._maxIconWidth = this._baseIconWidth * 1.5;
    this.setPulseIconWidth(this._baseIconWidth);
};

Window_EquipItem.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.resetScroll();
    }
};

Window_EquipItem.prototype.maxCols = function() {
    return 4;
};

Window_EquipItem.prototype.setSlotId = function(slotId) {
    if (this._slotId !== slotId) {
        this._slotId = slotId;
        this.refresh();
        this.resetScroll();
    }
};

Window_EquipItem.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};

Window_EquipItem.prototype.setPulseIconWidth = function(width) {
    this._pulseIconWidth = width;
};

Window_EquipItem.prototype.selectLast = function() {
};

Window_EquipItem.prototype.lineHeight = function() {
    return this.contents.fontSize + this.pad() * 2;
};

Window_EquipItem.prototype.pad = function() {
    return this.contents.fontSize / 4.66;
};

Window_EquipItem.prototype.itemWidth = function() {
    return Window_Base._iconWidth + this.textPadding() * 2;
};

Window_EquipItem.prototype.itemHeight = function() {
    return Window_Base._iconHeight + this.textPadding() * 2;
};

Window_EquipItem.prototype.spacing = function() {
    return Math.ceil(this.width / 6 - this.textPadding() * 2);
};

Window_EquipItem.prototype.makeItemList = function() {
    let weapons = $gameParty.weapons();
    let armors = $gameParty.armors(); 
    this._data = weapons.concat(armors).filter(function(item) {
        return this.includes(item);
    }, this);
    if (!TSR.equipSlots.sort_actor) this.sortItemList(this._data);
    let actorsEquipment = this.make_equipments().filter(function(item) {
        return this.includes(item);
    }, this);
    let data = actorsEquipment.concat(this._data);
    this._data = data;
    if (TSR.equipSlots.sort_actor) this.sortItemList(this._data);
    if (this.includes(null)) {
        this._data.push(null);
    }
};

Window_EquipItem.prototype.includes = function(item) {
    if (item === null) return false;
    if (this._slotId < 0 || item.etypeId !== this._actor.equipSlots()[this._slotId]) {
        return false;
    }
    return this.canEquip(item);
};

Window_EquipItem.prototype.canEquip = function(item) {
    if (!item) {
        return false;
    } else if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
        return this._actor.canEquip(item);
    } else if (item.etypeId === 1) {
        return this._actor.canEquipWeapon(item);
    } else if (item.etypeId > 1) {
        return this._actor.canEquipArmor(item);
    } else {
        return false;
    }
};

Window_EquipItem.prototype.sortItemList = function(itemList) {
    let param = TSR.equipSlots.sort_item[this._slotId + 1] || -1;
    if (param < 0) return;
    if (param === 'name') {
        this.sortByName(itemList); 
    } else if (param === 'best') {
        this.sortByBest(itemList);
    } else {
        this.sortByParam(itemList, param); 
    }
};

Window_EquipItem.prototype.sortByName = function(itemList) {
    this._data = itemList.sort(function(a, b) {
        let x = a.name.toLowerCase();
        let y = b.name.toLowerCase();
        if (x < y) return - 1;
        if (x > y) return 1;
        return 0;
    });
};

Window_EquipItem.prototype.sortByBest = function(itemList) {
    let length = itemList.length;
    let list = [];
    for (let i = 0; i < length; i++) {
        let best = this._actor.bestItem(itemList);
         list.push(best);
         itemList.splice(itemList.indexOf(best), 1);
    }
    list = list.reverse();
    this._data = list;
};

Window_EquipItem.prototype.sortByParam = function(itemList, param) {
    this._data = itemList.sort(function(a, b) {
        return a.params[param] - b.params[param];
    });
};

Window_EquipItem.prototype.make_equipments = function() {
    let group = $gameParty.battleMembers();
    this.clear_equipments(group);
    let equipment = [];
    let typeId = this._actor.equipSlots()[this._slotId];
    for (let i in group) {  
        if (group[i].equips()[group[i].equipSlots().indexOf(typeId)]) {
            let item = group[i].equips()[group[i].equipSlots().indexOf(typeId)];
            if (item) {
                item = JsonEx.makeDeepCopy(item);
                group[i]._equipments = group[i]._equipments || {};
                group[i]._equipments[this._slotId] = item; 
                equipment.push(item);
            }
        }
    }
    return equipment;
};

Window_EquipItem.prototype.clear_equipments = function(partyMembers) {
    for (let i in partyMembers) {
        partyMembers[i]._equipments = null;
    }
};

Window_EquipItem.prototype.isNotAvailable = function(item) {
    let group = $gameParty.battleMembers();
    group.splice(group.indexOf(this._actor), 1);
    for (let i in group) {
       if (group[i]._equipments && group[i]._equipments[this._slotId] === item) return group[i];
    }
    return false;
};

Window_EquipItem.prototype.isEnabled = function(item) {
    return !this.isNotAvailable(item);
};

Window_EquipItem.prototype.drawItem = function(index) {
    let item = this._data[index];
    if (item) {
        if (TSR.equipSlots._BG_rect_item && !this._itemBackRect) {
            let height = Math.ceil(this._data.length / 4) * (this.lineHeight() + this.textPadding());
            this.drawRect(0, 0, this.width, height);
            this._itemBackRect = true;
        }
        let rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(item));
        if (this._cursorRect.x === rect.x && this._cursorRect.y === rect.y) {
            this._pulseIconWidth = this.pulseIcon(this._pulseIconWidth);
            rect.x += this.halfValueDiff(this._baseIconWidth, this._pulseIconWidth);
            rect.y += this.halfValueDiff(this._baseIconWidth, this._pulseIconWidth);
            this.drawItemIcon(item, rect.x, rect.y, this._pulseIconWidth);
        } else {
            this.drawItemIcon(item, rect.x, rect.y, this._iconWidth);
        }
        
        let equipRect = this.itemRect(index);
        equipRect.x += rect.width + this.textPadding() / 2;
        equipRect.width = this.spacing() - this.textPadding();
        this.drawItemNumber(item, equipRect.x, equipRect.y, equipRect.width);
        this.drawItemIsEquip(item, equipRect.x, equipRect.y, equipRect.width);
        this.changePaintOpacity(1);
    }
};

Window_EquipItem.prototype.drawItemIcon = function(item, x, y, width) {
    if (item) {
        this.resetTextColor();
        x += this.textPadding();
        y += this.textPadding();
        this.drawEquipIcon(item.iconIndex, x, y, width);
    }
};

Window_EquipItem.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber(item)) {
        this.contents.fontSize = 16;
        let text = 'x' + $gameParty.numItems(item);
        y += this.itemHeight() - this.contents.fontSize - this.textPadding() * 2;
        this.drawText(text, x, y, width, 'left');
    }
};

Window_EquipItem.prototype.needsNumber = function(item) {
    return $gameParty.numItems(item) > 1;
};

Window_EquipItem.prototype.drawItemIsEquip = function(item, x, y, width) {
        let text = '';
        this.contents.fontSize = 16;
        if (this._actor._equipments && this._actor._equipments[this._slotId] === item) {   
           text = 'E';  
           this.contents.fontSize = 24;
        } else if (this.isNotAvailable(item)) {
           text = this.isNotAvailable(item).name();
        }
        this.changeTextColor(this.textColor(6));
        y += this.itemHeight() - this.contents.fontSize - this.textPadding() * 2;
        this.drawText(text, x, y, width, 'left');
};

Window_EquipItem.prototype.refresh = function() {
    this._itemBackRect = false;
    if (!this.isCursorVisible()) this._pulseIconWidth = this._baseIconWidth;
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
    this._helpWindow.refresh()
};

Window_EquipItem.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if (this.isOpenAndActive()) this.refresh();
};

Window_EquipItem.prototype.updateHelp = function() {
    Window_ItemList.prototype.updateHelp.call(this);
    if (this._actor && this._statusWindow) {
        let actor = JsonEx.makeDeepCopy(this._actor);
        let item = this.item();
        if (this.isNotAvailable(item)) {
            item = this.isNotAvailable(item).equips()[this._slotId];
        } else if (this._actor._equipments &&
                    this._actor._equipments[this._slotId] === item) {
            actor = null;
        }
        if (actor) {
            actor.forceChangeEquip(this._slotId, item);
        }
        this._statusWindow.setTempActor(actor);
    }      
};

Window_EquipItem.prototype.updateStatus = function() {
    if (this._actor && this._statusWindow) {
        let actor = JsonEx.makeDeepCopy(this._actor);
        let item = this.item();
        actor.forceChangeEquip(this._slotId, item);
        this._statusWindow.setTempActor(actor);
        this._statusWindow.refresh();
    }      
};

   TSR.equipSlots._Window_EquipItem_updateCursor = Window_EquipItem.prototype._updateCursor;
Window_EquipItem.prototype._updateCursor = function() {
    TSR.equipSlots._Window_EquipItem_updateCursor.call(this)
    this._windowCursorSprite.visible = false;
};

Window_EquipItem.prototype.playOkSound = function() {
};

Window_EquipItem.prototype._updateArrows = function() {
    this._upArrowSprite.visible     = this.upArrowVisible;
    this._downArrowSprite.visible   = this.downArrowVisible;
    this._leftArrowSprite.visible   = false;
    this._rightArrowSprite.visible  = false;
};


//=== Window_EquipDisplay =======================================

function Window_EquipDisplay() {
    this.initialize.apply(this, arguments);
}

Window_EquipDisplay.prototype = Object.create(Window_Base.prototype);
Window_EquipDisplay.prototype.constructor = Window_EquipDisplay;

Window_EquipDisplay.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._width = width;
    this._height = height;
    this._actor = null;
    this._baseIconWidth = TSR.equipSlots._displayIconWidth;
    this._maxIconWidth = this._baseIconWidth * 1.5;
    this._pulseIconWidth = this._baseIconWidth;
};

Window_EquipDisplay.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_EquipDisplay.prototype.setSlotId = function(slotId) {
    if (this._slotId !== slotId) {
        this._slotId = slotId;
        this.refresh();
    }
};

Window_EquipDisplay.prototype.drawBackground = function() {
    let actor = this._actor;
    let img = this.getActorDisplayImage(actor);
    let bitmap = ImageManager.loadSvActor(img[0]),
            pw = img[1]? bitmap.width : bitmap.width / 9,
            ph = img[1]? bitmap.height : bitmap.height / 6,
            sx = 0,
            sy = 0,
            dw = img[1]? this._height - this.standardPadding() : 
                         this._height / 2 - this.standardPadding(), 
            dh = img[1]? this._height - this.standardPadding() : dw,
            dx = this._width / 2 - dw / 2 - this.standardPadding(),
            dy = img[1]? 0 : dh - dh / 2;
    if (actor.isDead() && img[1]) {
        sx = 6 * pw;
        sy = 5 * ph;
    } else if (actor.isDying() && img[1]) {
        sx = 6 * pw;
        sy = 2 * ph;
    }       
    this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, dw, dh);
};

Window_EquipDisplay.prototype.getActorDisplayImage = function(actor) {
    let custom = false;
    if (!actor) return;
    img = $dataActors[actor._actorId]._displayImage;
    if (!img) {  
        img = actor._battlerName;
    } else {
        custom = true;
    }
    return [img, custom];
};

Window_EquipDisplay.prototype.reserveBattlerImages = function() {
    $gameParty.members().forEach(function(actor) {
        ImageManager.reserveSvActor(actor.battlerName());
    }, this);
};

Window_EquipDisplay.prototype.drawItem = function() {
    this.contents.clear();
    this.drawBackground();
    this.drawSlots();
};

Window_EquipDisplay.prototype.drawSlots = function() {
    if (this._actor) {
        let slots = this._actor.equipSlots();
        for (let i = 0; i < slots.length; i++) {
          let iconIndex = (this._actor.equips()[i])? this._actor.equips()[i].iconIndex : 16;
          let x = this.setValue(slots, i, 'x');
          let y = this.setValue(slots, i, 'y');
          let w = this._baseIconWidth;
          if (i === this._slotId) {
              if (TSR.equipSlots._windowCommands) {
                  this._pulseIconWidth = this.pulseIcon(this._pulseIconWidth);
                  w = this._pulseIconWidth;
                  x += this.halfValueDiff(this._baseIconWidth, this._pulseIconWidth);
                  y += this.halfValueDiff(this._baseIconWidth, this._pulseIconWidth);
              } else {
                  w = this._maxIconWidth;
                  x += this.halfValueDiff(this._baseIconWidth, this._maxIconWidth);
                  y += this.halfValueDiff(this._baseIconWidth, this._maxIconWidth);
              }      
              let rx = this.setValue(slots, i, 'x') + this.halfValueDiff(this._baseIconWidth, this._maxIconWidth);
              let ry = this.setValue(slots, i, 'y') + this.halfValueDiff(this._baseIconWidth, this._maxIconWidth);
              let rw = this._maxIconWidth; 
              this.drawRect(rx - 6, ry - 6, rw + 12, rw + 12);
          }
          this.drawEquipIcon(iconIndex, x, y, w); 
        }
    }
};

Window_EquipDisplay.prototype.setValue = function(slots, index, value) {
    let posList = this.makeSlotsPositionList(slots);
    let pos = (value === 'x')? 0 : 1;
    return (posList[index])? posList[index][pos] : (value === 0)? 0 + (48 * i) : 0;
};

Window_EquipDisplay.prototype.makeSlotsPositionList = function(slots) {
    let posList = [];
    const slotPos = TSR.equipSlots.slot_position;
    if (slotPos) {
        for (let j in slots) {
            let pos = (slotPos[slots[j]])? slotPos[slots[j]].split(',') : [0, 0];
            posList.push([parseInt(pos[0]), parseInt(pos[1])]);
        }
    } else {
        let middle = Math.round(slots.length / 2);
        let x;
        let y;
        for (let i = 0; i < slots.length; i++) {
           if (i < middle) {
              x = this.standardPadding() * 2;
              y = this._height * 0.20 + (i * this.lineHeight() * 2)
           } else {
              x = this.width - this.standardPadding() * 2 - this._maxIconWidth;
              y = this._height * 0.20 + ((i - middle) * this.lineHeight() * 2)
           }
           posList.push([x, y]);
        }
    }
    return posList;
};

Window_EquipDisplay.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (TSR.equipSlots._windowCommands) this.refresh();
};

Window_EquipDisplay.prototype.refresh = function() {
    this.drawItem();
};

Window_EquipDisplay.prototype._updateArrows = function() {
    this._upArrowSprite.visible = false;
    this._downArrowSprite.visible = false;
    this._leftArrowSprite.visible = false;
    this._rightArrowSprite.visible = false;
};


//=== Window_Equips ===============================================

function Window_Equips() {
    this.initialize.apply(this, arguments);
}

Window_Equips.prototype = Object.create(Window_HorzCommand.prototype);
Window_Equips.prototype.constructor = Window_Equips;

Window_Equips.prototype.initialize = function(x, y, w) {
    this._windowWidth = w;
    Window_HorzCommand.prototype.initialize.call(this, x, y);
    this.openness = 0;
    this.opacity = 0;
};

Window_Equips.prototype.windowWidth = function() {
    return this._windowWidth;
};

Window_Equips.prototype.maxCols = function() {
    return 3;
};

Window_Equips.prototype.maxItems = function() {
    return this._list.length;;
};

Window_Equips.prototype.itemWidth = function() {
    return Math.floor((this.width - this.padding * 2 +
        this.spacing()) / this.maxCols() - this.spacing()) - this.textPadding();
};

Window_Equips.prototype.makeCommandList = function() {
    for (let i in TSR.equipSlots._windowCommands) {
        let cmd = TSR.equipSlots._windowCommands[i];
        this.addCommand(cmd[0], cmd[1]);
    }
};

Window_Equips.prototype.cmdWidth = function() {
    return this._windowWidth / this.maxCols() - (this.maxCols() - 1) * this.spacing();
};

Window_Equips.prototype.drawItem = function(index) {
    let rect = this.itemRect(index);
    let align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x + this.textPadding(), rect.y, this.cmdWidth(), align);
};

Window_Equips.prototype.updateCursor = function() {
    if (this._cursorAll) {
        let allRowsHeight = this.maxRows() * this.itemHeight();
        this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
        this.setTopRow(0);
    } else if (this.isCursorVisible()) {
        let rect = this.itemRect(this.index());
        let pad = this.textPadding();
        this.setCursorRect(rect.x + pad * 2, rect.y, rect.width - pad, rect.height);
    } else {
        this.setCursorRect(0, 0, 0, 0);
    }
};

Window_Equips.prototype._updateArrows = function() {
    this._upArrowSprite.visible = false;
    this._downArrowSprite.visible = false;
    this._leftArrowSprite.visible = false;
    this._rightArrowSprite.visible = false;
};


//=== GAME ===================================================================


//=== Game_Actor ==================================

Game_Actor.prototype.optimizeEquipments = function(slot) {
    this.clearEquipSlot(slot);  
    if (this.isEquipChangeOk(slot)) {
        this.changeEquip(slot, this.bestEquipItem(slot));
    }  
};

Game_Actor.prototype.clearEquipSlot = function(slot) {
    this.changeEquip(slot, null);  
};

Game_Actor.prototype.bestItem = function(list) {
    let bestItem = null;
    let bestPerformance = -1000;
    for (let i = 0; i < list.length; i++) {
        let performance = this.calcEquipItemPerformance(list[i]);
        if (performance > bestPerformance) {
            bestPerformance = performance;
            bestItem = list[i];
        }
    }
    return bestItem;
};


//== END =================================================================================
//========================================================================================