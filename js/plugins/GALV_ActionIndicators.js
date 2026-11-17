//-----------------------------------------------------------------------------
//  Galv's Action Indicators
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_ActionIndicators.js
//-----------------------------------------------------------------------------
//  2025-08-20 - Version 1.5 - compatibility with pseudo-pixel movement and
//                             re-write of fetching event icon from comment
//  2017-05-26 - Version 1.4 - fixed a bug when looking at same icon indicator
//                           - wouldn't do popup effect
//  2015-03-06 - Version 1.3 - now works with events 'under' the player as well
//                           - as counters
//  2015-12-08 - Version 1.2 - added opacity, z and hiding options.
//  2015-12-07 - Version 1.1 - fixed a crash when you deleted events.
//  2015-12-04 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_ActionIndicators = true;

var Galv = Galv || {};        // Galv's main object
Galv.pCmd = Galv.pCmd || {};  // Plugin Command manager
Galv.AI = Galv.AI || {};      // Galv's plugin stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc v1.5 - Display an icon when the player is able to interact with an event. View help for comment tag.
 *
 * @author Galv - galvs-scripts.com
 *
 * @param Y Offset
 * @desc Pixel offset for icon's Y position
 * @type number
 * @default 0
 *
 * @param Z Position
 * @desc The Z position (controls if it appears over/under map objects)
 * @type number
 * @default 5
 *
 * @param Auto Hide
 * @desc true or false. If true, icons will disappear when an event is running
 * @type boolean
 * @on YES
 * @off NO
 * @default true
 *
 * @param Icon Opacity
 * @desc 0-255. The opacity of the icon
 * @type number
 * @default 200
 *
 * @help
 *   Galv's Action Indicators
 * ----------------------------------------------------------------------------
 * This plugin will enable you to display an icon when the player is facing an
 * event that has the below code in a 'comment' command anywhere in the active
 * event page.
 *
 *   <actionIcon: id>       // The code to use in a COMMENT within an event.
 *                          // id = the icon ID to use for the indicator.
 * 
 *
 * ----------------------------------------------------------------------------
 *  PLUGIN COMMANDS
 * ----------------------------------------------------------------------------
 *
 *   AIVISIBLE FALSE        // Disable action indicator
 *   AIVISIBLE TRUE         // Enable action indicator
 *   
 * 
 * 
 * Events with ._priorityType 1 (same as player) do not trigger action icon
 * if they are on same tile as player. They will still trigger event start.
 * 
 * 
 * 
 */

//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

/*
Unofficial secret stuff as not fully tested:
- use text to refer to an id in comment, refers to below object.
- ability to specify direction it appears.
*/


// list of words to icon id to use in the comment
Galv.AI.txtToId = {
    talk: 90,
    use: 91,
}








Galv.AI.y = Number(PluginManager.parameters('Galv_ActionIndicators')["Y Offset"]);
Galv.AI.z = Number(PluginManager.parameters('Galv_ActionIndicators')["Z Position"]);
Galv.AI.opacity = Number(PluginManager.parameters('Galv_ActionIndicators')["Icon Opacity"]);

Galv.AI.autoHide = eval(PluginManager.parameters('Galv_ActionIndicators')["Auto Hide"]);
Galv.AI.needRefresh = false;

// GALV'S PLUGIN MANAGEMENT. INCLUDED IN ALL GALV PLUGINS THAT HAVE PLUGIN COMMAND CALLS, BUT ONLY RUN ONCE.
if (!Galv.aliased) {
	Galv.AI.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		if (Galv.pCmd[command]) {
			Galv.pCmd[command](args);
			return;
		};
		Galv.AI.Game_Interpreter_pluginCommand.call(this, command, args);
	};
	Galv.aliased = true; // Don't keep aliasing for other Galv scripts.
};

// Direct to Plugin Object
Galv.pCmd.AIVISIBLE = function(arguments) {
	var status = eval(arguments[0].toLowerCase())
	$gameSystem.actionIndicatorVisible = status;
};
// END GALV'S PLUGIN MANAGEMENT




//-----------------------------------------------------------------------------
// Game_System

Galv.AI.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	Galv.AI.Game_System_initialize.call(this);
	this.actionIndicatorVisible = true;
};

//-----------------------------------------------------------------------------
// Game_Map

Galv.AI.Game_Map_requestRefresh = Game_Map.prototype.requestRefresh;
Game_Map.prototype.requestRefresh = function(mapId) {
	Galv.AI.Game_Map_requestRefresh.call(this,mapId);
	Galv.AI.needRefresh = true;
};




//-----------------------------------------------------------------------------
// Game_Event

// Check if event moves away from the indicator and remove it.
Galv.AI.Game_Event_moveStraight = Game_Event.prototype.moveStraight;
Game_Event.prototype.moveStraight = function(d) {
	Galv.AI.Game_Event_moveStraight.call(this,d);
	if (!this._noActionIcon) Galv.AI.needRefresh = true;
};


Galv.AI.Game_Event_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
	Galv.AI.Game_Event_initialize.call(this,mapId,eventId);
	// if <noActionIcon> note tag, set noActionIcon so it won't check for icon on the event. Should only be needed for moving events
	if (this.event().meta.noActionIcon) this._noActionIcon = true;
}


Galv.AI.Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
Game_Event.prototype.setupPageSettings = function() {
  Galv.AI.Game_Event_setupPageSettings.call(this);
  this.setupActionIndicatorIcon();
};







Game_Event.prototype.setupActionIndicatorIcon = function() {
    let page = this.page();

    this._actionIndicator = null;

    if (page) {
        for (let i = 0; i < page.list.length; i++) {
            if (page.list[i].code === 108) {
                let iconCheck = page.list[i].parameters[0].match(/<actionIcon: (.*)>/i);
                
                if (iconCheck) {
                    iconCheck = iconCheck[1].split('|');
                    let icon = Galv.AI.txtToId[iconCheck[0]] ? Galv.AI.txtToId[iconCheck[0]] : Number(iconCheck[0]);
                    let dirs = iconCheck[1] || null;
                    if (dirs) {
                        dirs = dirs.split(',');
                        for (let i = 0; i < dirs.length; i++) {
                            dirs[i] = Number(dirs[i]);
                        }
                    }
                    this._actionIndicator = {'eventId': this.eventId(),'iconId': icon, 'dirs': dirs};
                    break;
                };
            };
        };
    };
};


//-----------------------------------------------------------------------------
// Game_Player

Galv.AI.Game_Player_moveStraight = Game_Player.prototype.moveStraight;
Game_Player.prototype.moveStraight = function(d) {
	Galv.AI.Game_Player_moveStraight.call(this,d);
	Galv.AI.needRefresh = true;
};

Galv.AI.Game_Player_moveDiagonally = Game_Player.prototype.moveDiagonally;
Game_Player.prototype.moveDiagonally = function(horz, vert) {
	Galv.AI.Game_Player_moveDiagonally.call(this,horz, vert);
	Galv.AI.needRefresh = true;
};

Galv.AI.checkActionIcon = function() {
	let x2 = $gameMap.roundXWithDirection($gamePlayer._x, $gamePlayer._direction);
    let y2 = $gameMap.roundYWithDirection($gamePlayer._y, $gamePlayer._direction);
    x2 = Math.round(x2);
    y2 = Math.round(y2);
	let action = null;

	// CHECK EVENT STANDING ON
	$gameMap.eventsXy($gamePlayer._x, $gamePlayer._y).forEach(function(event) {
		if (!action && event._priorityType != 1) {
			action = Galv.AI.checkEventForIcon(event);   // && event._priorityType != 1 prevents events under the player showing action icon if they are priorty type 1.
		}
	});
	
	// CHECK EVENT IN FRONT
	if (!action) {
		$gameMap.eventsXy(x2, y2).forEach(function(event) {
			if (event.isNormalPriority($gamePlayer._priorityType)) {
				action = Galv.AI.checkEventForIcon(event);
			};
		});
	};
	
	// CHECK COUNTER
	if (!action && $gameMap.isCounter(x2, y2)) {
		let direction = $gamePlayer.direction();
		let x3 = $gameMap.roundXWithDirection(x2, direction);
        let y3 = $gameMap.roundYWithDirection(y2, direction);
		$gameMap.eventsXy(x3, y3).forEach(function(event) {
			if (event.isNormalPriority($gamePlayer._priorityType)) {
				action = Galv.AI.checkEventForIcon(event);
			};
		});
	};
	action = action || {'eventId': 0, 'iconId': 0};
	
	$gamePlayer.actionIconTarget = action;
	Galv.AI.needRefresh = false;
};


Galv.AI.checkEventForIcon = function(event) {
	if (event._noActionIcon) return null;
    if (event._actionIndicator) {
        if (event._actionIndicator.dirs && !event._actionIndicator.dirs.includes($gamePlayer._direction)) {
            return null;
        } else {
            return event._actionIndicator;
        }

    }
	return null;
};




//-----------------------------------------------------------------------------
// Spriteset_Map

Galv.AI.Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
	Galv.AI.Spriteset_Map_createLowerLayer.call(this);
	this.createActionIconSprite();
};

Spriteset_Map.prototype.createActionIconSprite = function() {
	this._actionIconSprite = new Sprite_ActionIcon();
	this._tilemap.addChild(this._actionIconSprite);
};


//-----------------------------------------------------------------------------
// Sprite_ActionIcon

function Sprite_ActionIcon() {
    this.initialize.apply(this, arguments);
}

Sprite_ActionIcon.prototype = Object.create(Sprite.prototype);
Sprite_ActionIcon.prototype.constructor = Sprite_ActionIcon;

Sprite_ActionIcon.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
	$gamePlayer.actionIconTarget = $gamePlayer.actionIconTarget || {'eventId': 0, 'iconId': 0}; 
	this._iconIndex = 0;
	this.z = Galv.AI.z;
	this.changeBitmap();
	this._tileWidth = $gameMap.tileWidth();
	this._tileHeight = $gameMap.tileHeight();
	this._offsetY = -38 + Galv.AI.y;
	this.anchor.y = 1;
    this.anchor.x = 0.5;
	this._float = 0.1;
	this.mod = 0.2;
	Galv.AI.needRefresh = true;
};

Sprite_ActionIcon.prototype.changeBitmap = function() {
	if ($gamePlayer.actionIconTarget.eventId <= 0) {
		this._iconIndex = 0;
	} else {
		this._iconIndex = $gamePlayer.actionIconTarget.iconId;
	};

	var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
	var sx = this._iconIndex % 16 * pw;
    var sy = Math.floor(this._iconIndex / 16) * ph;
	
	this.bitmap = new Bitmap(pw,ph);
	if (this._iconIndex <= 0) return;
    var bitmap = ImageManager.loadSystem('IconSet');
    this.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);
	
	Galv.AI.needRefresh = false;
};

Sprite_ActionIcon.prototype.initPopVars = function() {
    this._indicatorSize = 1;

	this.scale.y = 0.1;
	this.scale.x = this._indicatorSize;
	this.opacity = 0;
	this.mod = 0.2;
	this._float = 0.1;
};

if (Galv.AI.autoHide) {
	Sprite_ActionIcon.prototype.updateOpacity = function() {
		if ($gameMap.isEventRunning()) {
			this.opacity -= 40;
		} else {
			this.opacity = $gameSystem.actionIndicatorVisible ? Galv.AI.opacity : 0;
		};
	};
} else {
	Sprite_ActionIcon.prototype.updateOpacity = function() {
		this.opacity = $gameSystem.actionIndicatorVisible ? Galv.AI.opacity : 0;
	};
};

Sprite_ActionIcon.prototype.update = function() {
    Sprite.prototype.update.call(this);
	
	if (Galv.AI.needRefresh) Galv.AI.checkActionIcon();
	
	if ($gamePlayer.actionIconTarget.eventId != this._eventId) {
		this.initPopVars();
		this._eventId = $gamePlayer.actionIconTarget.eventId;
	}
	
	if (this._iconIndex !== $gamePlayer.actionIconTarget.iconId) this.changeBitmap();
	if (this._iconIndex <= 0) return;

	this.x = $gameMap.event($gamePlayer.actionIconTarget.eventId).screenX();
	this.y = $gameMap.event($gamePlayer.actionIconTarget.eventId).screenY() + this._offsetY + this._float;

	this.scale.y = Math.min(this.scale.y + 0.4,this._indicatorSize);
	
	this.updateOpacity();

	this._float += this.mod;
	if (this._float < -0.1) {
		this.mod = Math.min(this.mod + 0.01,0.2);
	} else if (this._float >= 0.1) {
		this.mod = Math.max(this.mod + -0.01,-0.2);
	};

};

