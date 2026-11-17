//=============================================================================
// MOG_CharGhostTrail.js
//=============================================================================
/*:
 * @plugindesc (v1.0) Adiciona o efeito "fantasma", criando sombras após o 
 * movimento do personagem. 
 * @author Moghunter
 *
 * @help  
 * =============================================================================
 * ♦♦♦ MOG Character Ghost Trail ♦♦♦
 * Author   -   Moghunter
 * Version  -   1.0
 * Updated  -   2025/10/24
 * https://mogplugins.com
 * =============================================================================
 * Adiciona o efeito "fantasma", criando sombras após o movimento do 
 * personagem.
 *
 * -----------------------------------------------------------------------------
 * PLUGIN COMMAND
 * -----------------------------------------------------------------------------
 * Para ativar o efeito de trail use o comando abaixo.
 *
 * gtrail_player_id : EVENT_ID : VISIBLE : BLEND : N_SHADOWS
 * gtrail_event_id : PLAYER_ID : VISIBLE : BLEND : N_SHADOWS 
 *
 * EVENT_ID/PLAYER_ID - ID do evento ou jogador
 * VISIBLE   - Visível ou não (true/false)
 * BLEND     - Tipo de Blend (0..2)
 * N_SHADOWS - Quantidade de sombras (3..20)
 *
 * Exemplo
 *
 * gtrail_player_id : 0 : false : 0 : 10
 * gtrail_event_id : 1 : false : 0 : 10 
 *
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_CharGhostTrail = true;
　　var Moghunter = Moghunter || {}; 

 　Moghunter.parameters = PluginManager.parameters('MOG_CharGhostTrail');  

//=============================================================================
// ** Game_Interpreter
//=============================================================================	

//==============================
// * PluginCommand
//==============================
var _mog_chaghostTrail_pluginCommand = Game_Interpreter.prototype.pluginCommand
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_mog_chaghostTrail_pluginCommand.call(this,command, args)
    this.checkCharGhostTrailCommand(command, args);
	return true;
};

//==============================
// * check Char GhostTrailCommand
//==============================
Game_Interpreter.prototype.checkCharGhostTrailCommand = function(command, args) {
	if (command === "gtrail_event_id")  {
     	var id = Number(args[1]);
		var visible = String(args[3]) == "true" ? true : false;
		var blend = Math.min(Math.max(Number(args[5]),0),2);
		var ntrails = Math.min(Math.max(Number(args[7]),2),20);
		$gameMap.setGhostTrailEvent(id,visible,blend,ntrails);	
	} else if (command === "gtrail_player_id")  {
     	var id = Number(args[1]);
		var visible = String(args[3]) == "true" ? true : false;
		var blend = Math.min(Math.max(Number(args[5]),0),2);
		var ntrails = Math.min(Math.max(Number(args[7]),2),20);
		$gameMap.setGhostTrailPlayer(id,visible,blend,ntrails);	
	};
};

//=============================================================================
// ** Game Map
//=============================================================================	

//==============================
// * player_trail
//==============================
Game_Map.prototype.setGhostTrailPlayer = function(id,visible,blendMode,trails) {	 
      var char = this.getPlayerChar(id);
	  if (char) {
		  char._charGTrail.visibleNext = visible;
		  char._charGTrail.blendMode = blendMode;
		  char._charGTrail.trails = trails;
		  char._charGTrail.needRefresh = true;
	  };
};		

//==============================
// * event_trail
//==============================
Game_Map.prototype.setGhostTrailEvent = function(id,visible,blendMode,trails) {	 
      var char = this.getEventChar(id);
	  if (char) {
		  char._charGTrail.visibleNext = visible;
		  char._charGTrail.blendMode = blendMode;
		  char._charGTrail.trails = trails;
		  char._charGTrail.needRefresh = true;
	  };
};			
	
//==============================
// * get Player Char
//==============================
Game_Map.prototype.getPlayerChar = function(id) {	 
     var char = null;
	 var actor = $gameParty.members()[id];
	 if (actor) {
		 if (id == 0) {char = $gamePlayer
		 } else {char = $gamePlayer.followers().follower(id - 1);
		 };
	 };
	 return char;
};			
	
//==============================
// * get Event Char
//==============================
Game_Map.prototype.getEventChar = function(event_id) {	 
     var ev = null;
	 $gameMap.events().forEach(function(event) { 
	 if (event.eventId() == event_id) {ev = event};
	 }, this);
	 return ev;
};	
	
//=============================================================================
// ** Game Character Base
//=============================================================================

//==============================
// * InitMembers
//==============================
var _mog_charGhostTrail_gcharbase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    _mog_charGhostTrail_gcharbase_initMembers.call(this);
    this.initGhostTrail();
};

//==============================
// * init Ghost Trail
//==============================
Game_CharacterBase.prototype.initGhostTrail = function() {
    this._charGTrail = {};
	this._charGTrail.visible = false;
	this._charGTrail.visibleNext = false
	this._charGTrail.mode = 0;
	this._charGTrail.blendMode = 0;
	this._charGTrail.trails = 5;
	this._charGTrail.needRefresh = false;
};

//=============================================================================
// ** Spriteset Map
//=============================================================================

//==============================
// * create Characters
//==============================
var _mog_charGhostTrail_sprmap_createCharacters = Spriteset_Map.prototype.createCharacters;
Spriteset_Map.prototype.createCharacters = function() {
	_mog_charGhostTrail_sprmap_createCharacters.call(this);
	this.createCharGhostTrailSprites();
};

//==============================
// * create Char Ghost Trail Sprites
//==============================
Spriteset_Map.prototype.createCharGhostTrailSprites = function() {
	this._charGhostTrailSprites = [];
	for (var i = 0; i < this._characterSprites.length; i++) {
	     this._charGhostTrailSprites[i] = new CharGhostTrailSprites(this._characterSprites[i],i);
	     this._tilemap.addChild(this._charGhostTrailSprites[i]);
	};
};

//=============================================================================
// ** CharGhostTrailSprites
//=============================================================================
function CharGhostTrailSprites() {
    this.initialize.apply(this, arguments);
};
CharGhostTrailSprites.prototype = Object.create(Sprite.prototype);
CharGhostTrailSprites.prototype.constructor = CharGhostTrailSprites;

//==============================
// * Initialize
//==============================
CharGhostTrailSprites.prototype.initialize = function(sprite,id) {
    Sprite.prototype.initialize.call(this);
    this.initialSetup(sprite,id)
	this._trailSprites = null;
	if (this.data().visible) {this.createGhostTrail()};
};

//==============================
// * initial Setup
//==============================
CharGhostTrailSprites.prototype.initialSetup = function(sprite,id) {
	this._id = id;
	this._spriteCharacter = sprite;	
    this._spriteCharacterLoaded = false;
	this.z = this._spriteCharacter.z ;
	this._space = 10;
	this._time = 5;
	this._fade = 10;
	this._run = 0;
	this._needReset = false;   
}

//==============================
// * spr
//==============================
CharGhostTrailSprites.prototype.spr = function() {
   return this._spriteCharacter;
}

//==============================
// * Char
//==============================
CharGhostTrailSprites.prototype.char = function() {
    return this.spr()._character;
};

//==============================
// * Data
//==============================
CharGhostTrailSprites.prototype.data = function() {
   return this.char()._charGTrail;
};

//==============================
// * Mode
//==============================
CharGhostTrailSprites.prototype.mode = function() {
   return this.char()._charGTrail.mode;
};

//==============================
// * createSpriteShadow
//==============================
CharGhostTrailSprites.prototype.createGhostTrail = function() {
	 this._spriteField = new Sprite()
	 this.addChild(this._spriteField);	
	 this._trailSprites = [];
	 var cdata = false;	 
	 if (!this.char()._charGTrailData) {this.char()._charGTrailData = [];cdata = true}
	 for (var i = 0; i < this.data().trails; i++) {	
		  this._trailSprites[i] = new Sprite();	
		  this._trailSprites[i].opacity = 0;	
		  this._trailSprites[i].anchor.x = 0.5;
		  this._trailSprites[i].anchor.y = 1.0;
		  this._trailSprites[i].blendMode = this.data().blendMode;
		  this._spriteField.addChild(this._trailSprites[i]);		  
		  if (cdata) {
			  this._trailSprites[i].opacity = 0;
		      this.createInitialData(i);
		  } else {
	          this.char()._charGTrailData[i].loaded = false;		  
		  };
	 };	
};

//==============================
// * createInitialData
//==============================
CharGhostTrailSprites.prototype.createInitialData = function(i) {
    var time = this._time
	this.char()._charGTrailData[i] = {};
    this.char()._charGTrailData[i].time = time
	this.char()._charGTrailData[i].opacity = 0;
	this.char()._charGTrailData[i].x = 0;
	this.char()._charGTrailData[i].y = 0;
	this.char()._charGTrailData[i].orgX = 0;
	this.char()._charGTrailData[i].orgY = 0;
	this.char()._charGTrailData[i].direction = 0;
	this.char()._charGTrailData[i].enabled;
	this.char()._charGTrailData[i].duration = time + (time * i);
	this.char()._charGTrailData[i].loaded = true;
};

//==============================
// * loadInitialData
//==============================
CharGhostTrailSprites.prototype.LoadInitialData = function(sprite,data,i) {
	data.loaded = true;
    sprite.x = data.x;
	sprite.y = data.y;
	sprite.opacity = data.opacity;  
	if (data.enabled) {this.recoverSprite(sprite,data)};
};

//==============================
// * recoverSprite
//==============================
CharGhostTrailSprites.prototype.recoverSprite = function(sprite,data,i) {	
	  this._tilesetId = data.tileId;
	  this.char()._direction = data.direction;
	  sprite.bitmap = this.spr().bitmap;	  
	  sprite.z = i;	  
	  if (this._tileId > 0) { 
           this.setFrameTile(sprite);
	  } else {
	       this.setFrameCharacter(sprite);
	  };
};

//==============================
// * set Frame Tile
//==============================
CharGhostTrailSprites.prototype.setFrameTile = function(sprite) {
   	  var tileId = this._tilesetId	
	  var pw = this.spr().patternWidth();
	  var ph = this.spr().patternHeight();
	  var sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
	  var sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
	  sprite.setFrame(sx, sy, pw, ph);	
};

//==============================
// * set Frame Character
//==============================
CharGhostTrailSprites.prototype.setFrameCharacter = function(sprite) {
	  var pw = this.spr().patternWidth();
	  var ph = this.spr().patternHeight();
	  var sx = (this.spr().characterBlockX() + this.spr().characterPatternX()) * pw;
	  var sy = (this.spr().characterBlockY() + this.spr().characterPatternY()) * ph;
	  sprite.setFrame(sx, sy, pw, ph);  
};

//==============================
// * refreshInitial
//==============================
CharGhostTrailSprites.prototype.refreshInitial = function(sprite,i,data) {	
      data.enabled = true;	  	  
      this.refreshPosition(sprite,i,data);
      this.clearSprites(sprite,i,data);
	  this.prepareAnimation(sprite,i,data);
	  this.refreshData(sprite,i,data);
      this.refreshFrames(sprite,i,data);
};

//==============================
// * prepare Animation
//==============================
CharGhostTrailSprites.prototype.prepareAnimation = function(sprite,i,data) {	
    if (this.mode() == 1) {
		
	} else {
		if (this._run == 0) {
			sprite.scale.x = 0;
			sprite.scale.y = 0;			
		};
	};
};

//==============================
// * refresh Frames
//==============================
CharGhostTrailSprites.prototype.refreshFrames = function(sprite,i,data) {	
	  if (this._tileId > 0) { 
	      this.setFrameTile(sprite)  
	  } else {
		  this.setFrameCharacter(sprite); 
	  };
};

//==============================
// * refresh Data
//==============================
CharGhostTrailSprites.prototype.refreshData = function(sprite,i,data) {	
	  this._tilesetId = $gameMap.tilesetId();
	  data.tileId = this._tilesetId
	  data.direction = this.char().direction()	
};

//==============================
// * clear Sprites
//==============================
CharGhostTrailSprites.prototype.clearSprites = function(sprite,i,data) {	
	  sprite.z = i;
	  sprite.bitmap = this.spr().bitmap;
	  sprite.opacity = 255;
	  sprite.scale.x = 1;
	  sprite.scale.y = 1;
};

//==============================
// * refreshPosition
//==============================
CharGhostTrailSprites.prototype.refreshPosition = function(sprite,i,data) {	
	  this.char()._charGTrailData[i].orgX = this.char().screenX() - this.screenX();
	  this.char()._charGTrailData[i].orgY = this.char().screenY() - this.screenY();      
      sprite.x = this.char()._charGTrailData[i].orgX + (this._space * i)
	  sprite.y = this.char()._charGTrailData[i].orgY;
};

//==============================
// * screen Y
//==============================
CharGhostTrailSprites.prototype.screenX = function() {
	return -($gameMap.displayX() * $gameMap.tileWidth());
};

//==============================
// * screen Y
//==============================
CharGhostTrailSprites.prototype.screenY = function() {
	return -($gameMap.displayY() * $gameMap.tileHeight());
};
//==============================
// * pos X
//==============================
CharGhostTrailSprites.prototype.posX = function(i) {
	return this.char()._charGTrailData[i].orgX + this.screenX();
};

//==============================
// * pos Y
//==============================
CharGhostTrailSprites.prototype.posY = function(i) {
	return  this.char()._charGTrailData[i].orgY + this.screenY();
};

//==============================
// * update Ghost Trail
//==============================
CharGhostTrailSprites.prototype.updateGhostTrail = function(sprite,data,i) {
	if (!data.loaded) {
	    if (this.spr().width != 0) {this.LoadInitialData(sprite,data,i)}
		return;
	};	
    if (data.enabled) {this.updateFade(sprite,data,i)};
    this.updateStart(sprite,data,i);
	this.updateVisible(sprite,data,i);
	this.updateScale(sprite,data,i);
	this.updatePosition(sprite,data,i);
    this.updateRecordData(sprite,data,i);
};

//==============================
// * update Scale
//==============================
CharGhostTrailSprites.prototype.updateScale = function(sprite,data,i) {
	if (this.mode() == 1) {
		sprite.scale.x += 0.1;
		sprite.scale.y += 0.1;
		if (sprite.opacity < 100) {
			sprite.scale.x -= 0.2;
		};
	};
};

//==============================
// * update Position
//==============================
CharGhostTrailSprites.prototype.updatePosition = function(sprite,data,i) {
	if (this.mode() == 1) {
        sprite.x = this.char().screenX();
	    sprite.y = this.char().screenY();
	} else {
        sprite.x = this.posX(i);
	    sprite.y = this.posY(i)
	};
};

//==============================
// * update Fade
//==============================
CharGhostTrailSprites.prototype.updateFade = function(sprite,data,i) {
	sprite.opacity -= this._fade;
    if (sprite.opacity == 0) {this.refreshInitial(sprite,i,data)};	
};


//==============================
// * is Sprite Visible
//==============================
CharGhostTrailSprites.prototype.isSpriteVisible = function(sprite,data,i) {
  if (this.mode() == 1) {return true};
  if (sprite.x == this.char().screenX() && sprite.y == this.char().screenY()) {return false}
  return true;
};

//==============================
// * update Visible
//==============================
CharGhostTrailSprites.prototype.updateVisible = function(sprite,data,i) {
	sprite.visible = this.isSpriteVisible(sprite,data,i);
};

//==============================
// * update Start
//==============================
CharGhostTrailSprites.prototype.updateStart = function(sprite,data,i) {
	if (data.duration > 0) {
		data.duration -= 1;
		if (data.duration == 0) {
			this.refreshInitial(sprite,i,data)
		};
	}
};

//==============================
// * update Ghost Trail
//==============================
CharGhostTrailSprites.prototype.updateRecordData = function(sprite,data,i) {
    data.x = sprite.x;
	data.y = sprite.y;
	data.opacity = sprite.opacity;
};

//==============================
// * isVisible
//==============================
CharGhostTrailSprites.prototype.isVisible = function() {
    if (!this.char()) {return false};
	if (this.data().needRefresh) {return false};
	if (!this._trailSprites) {return false};
	if (!this.spr().visible) {return false};
	if (!this.data().visible) {return false};
	if (this.char()._opacity === 0) {return false};
	if (this.char()._transparent) {return false};
	if (this.char()._visible === false) {return false};
	if (this.char()._characterName === '') {return false};	
	if (this.char()._type != null) {return false};	
	return true;
};

//==============================
// * needRefresh
//==============================
CharGhostTrailSprites.prototype.needRefresh = function() {
    if (!this.char()) {return false};
	if (this.spr().width == 0) {return false};	
	if (!this._spriteCharacterLoaded && this.spr().width != 0) {
	    return true
	};	
    if (this._spriteCharacterLoaded) {return false};
	return true;
};

//==============================
// * reset Sprites
//==============================
CharGhostTrailSprites.prototype.resetSprites = function() {
     this._needReset = false;
	 for (var i = 0; i < this._trailSprites.length; i++) {	
	      var sprite = this._trailSprites[i];
		  sprite.opacity = 0;
		  this.createInitialData(i)
	 };
};

//==============================
// * update Basic
//==============================
CharGhostTrailSprites.prototype.updateBasic = function() {
    if (this.char().isMoving()) {this._run = 5};
	if (this._run > 0) {this._run -= 1};	
	if (this.isVisible()) {
		this.visible = true;
		if (this._needReset) {
			this.resetSprites();
		    return;
		};
		for (var i = 0; i < this._trailSprites.length; i++) {			 
			 var sprite = this._trailSprites[i];
			 var data = this.char()._charGTrailData[i];
		     this.updateGhostTrail(sprite,data,i);
		};
	} else {
		this.visible = false;
		this._needReset = true;
	};	
};


//==============================
// * refresh From Zero
//==============================
CharGhostTrailSprites.prototype.refreshFromZero = function() {
    this.data().needRefresh = false;
	this.data().visible = this.data().visibleNext;
    this.initialSetup(this._spriteCharacter,this._id);
	if (this._trailSprites) {this.removeTrailSprites()};
	if (this.data().visible) {
		this._trailSprites = null;
		this.createGhostTrail();
	};	
};

//==============================
// * remove Trail Sprites
//==============================
CharGhostTrailSprites.prototype.removeTrailSprites = function() {
	for (var i = 0; i < this._trailSprites.length; i++) {
	     this._spriteField.removeChild(this._trailSprites[i]);	
		 this._trailSprites[i].destroy();	 
	};
	this._trailSprites = null;
	this.removeChild(this._spriteField);
	this._spriteField = null;
	this.char()._charGTrailData = null;
};

//==============================
// * Update Wait
//==============================
CharGhostTrailSprites.prototype.updateWait = function() {
    this.visible = false;	
    this._needReset = true;	
};

//==============================
// * Update
//==============================
CharGhostTrailSprites.prototype.update = function() {
    Sprite.prototype.update.call(this);
	if (this.data().needRefresh) {
		this.refreshFromZero()
	    return	
	};
	if (!this.data().visible) {		
	    this.updateWait();
    } else { 
        this.updateBasic();
	};
	this.z = this._spriteCharacter.z;
};