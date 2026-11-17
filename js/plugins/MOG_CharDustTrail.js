//=============================================================================
// MOG_CharDustTrail.js
//=============================================================================
/*:
 * @plugindesc (v1.0) Adiciona o efeito de partículas de sujeira quando o
 * personagem estiver movimentando em determinados terrenos.
 * @author Moghunter
 * @url https://mogplugins.com
 *
 * @param Terrain ID 1
 * @desc Define a ID 1 do terreno para ativar as partículas.
 * @default 1
 *
 * @param Terrain ID 2
 * @desc Define a ID 2 do terreno para ativar as partículas.
 * @default 999
 *
 * @help  
 * =============================================================================
 * ♦♦♦ MOG Character Dust Trail ♦♦♦
 * Author   -   Moghunter
 * Version  -   1.0
 * Updated  -   2025/10/24
 * https://mogplugins.com
 * =============================================================================
 * Adiciona o efeito de partículas de sujeira quando o personagem estiver 
 * movimentando em determinados terrenos.
 *
 * -----------------------------------------------------------------------------
 * Arquivo Necessário (img/System)
 * 
 * DustTrail.png
 *
 * -----------------------------------------------------------------------------
 * Para desativar o efeito no evento use comentário abaixo.
 *
 * disable_dust
 *
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_CharDustEffect = true;
　　var Moghunter = Moghunter || {}; 

 　Moghunter.parameters = PluginManager.parameters('MOG_CharDustTrail'); 
  Moghunter.cDustEffect_T1 = Number(Moghunter.parameters['Terrain ID 1'] || 1);
  Moghunter.cDustEffect_T2 = Number(Moghunter.parameters['Terrain ID 2'] || 999);
	
//=============================================================================
// ** Game Map
//=============================================================================	

//==============================
// * player_trail
//==============================
Game_Map.prototype.setDustTrailPlayer = function(id,visible,blendMode,trails) {	 
      var char = this.getPlayerChar(id);
	  char._charGTrail.visibleNext = visible;
	  char._charGTrail.blendMode = blendMode;
	  char._charGTrail.trails = trails;
	  char._charGTrail.needRefresh = true;
};		

//==============================
// * event_trail
//==============================
Game_Map.prototype.setDustTrailEvent = function(id,visible,blendMode,trails) {	 
      var char = this.getEventChar(id);
	  char._charGTrail.visibleNext = visible;
	  char._charGTrail.blendMode = blendMode;
	  char._charGTrail.trails = trails;
	  char._charGTrail.needRefresh = true;
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
var _mog_chardustTrail_gcharbase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    _mog_chardustTrail_gcharbase_initMembers.call(this);
    this.initDustTrail();
};

//==============================
// * initDustTrail
//==============================
Game_CharacterBase.prototype.initDustTrail= function() {
	this._pposX = 0;
	this._pposY = 0;
    this._charDustTrail = {};
	this._charDustTrail.visible = true;
	this._charDustTrail.nSprites = 5;
	this._charDustTrail.needRefresh = true;
	this._charDustTrail.wait = 0;
	this._charDustTrail.executeDust = false;
	this._charDustTrail.terrainID_1 = Number(Moghunter.cDustEffect_T1);
	this._charDustTrail.terrainID_2 = Number(Moghunter.cDustEffect_T2);
};

//==============================
// * Dust Trail
//==============================
Game_CharacterBase.prototype.dustTrail= function() {
    return this._charDustTrail;
};

//=============================================================================
// ** Game Character
//=============================================================================	

//==============================
// * Update
//==============================
Game_CharacterBase.prototype.canUpdateDustTrail = function() {   
    if (!this.dustTrail().visible) {return false};
	if (this._opacity === 0) {return false};
	if (this._transparent) {return false};
	if (this._visible === false) {return false};
	if (this._characterName === '') {return false};	
	if (this._type != null) {return false};		
    return true;
};

//==============================
// * pposTerrain
//==============================
Game_CharacterBase.prototype.pposTerrain = function() {   
    return $gameMap.terrainTag(this._pposX,this._pposY);
};

//==============================
// * cpos Terrain
//==============================
Game_CharacterBase.prototype.cposTerrain = function() {   
    return $gameMap.terrainTag(this._x,this._y);
};

//==============================
// * isPosMoved
//==============================
Game_CharacterBase.prototype.isPosMoved = function() {   
    if (this._x != this._pposX) {return true};
	if (this._y != this._pposY) {return true};
	return false;
};

//==============================
// * Update Dust Trail
//==============================
Game_CharacterBase.prototype.updateDusTrail = function() {
	 if (this.dustTrail().wait > 0) {this.dustTrail().wait -= 1};
     if (this.needExecuteDustTrail()) {this.executeDustTrail()};
};

//==============================
// * Execute Dust Trail
//==============================
Game_CharacterBase.prototype.executeDustTrail = function() {
	this.dustTrail().wait = 10;
    this.dustTrail().executeDust = true;
};

//==============================
// * need ExecuteDustTrail
//==============================
Game_CharacterBase.prototype.needExecuteDustTrail = function() {
	 if (this.dustTrail().wait > 0) {return false};
	 if (!this.isPosMoved()) {return false};
     if (!this.isDustTerrain()) {return false};
	 return true;    
};

//==============================
// * is Dust Terrain
//==============================
Game_CharacterBase.prototype.isDustTerrain = function() {
     if (this.pposTerrain() == this.dustTrail().terrainID_1) {return true};
	 if (this.pposTerrain() == this.dustTrail().terrainID_2) {return true};
	 return false;
};

//==============================
// * Update
//==============================
var _mog_cdusttrail_game_charbase_update = Game_CharacterBase.prototype.update
Game_CharacterBase.prototype.update = function() {
	this._pposX = Math.round(this._realX);
	this._pposY = Math.round(this._realY);		
	_mog_cdusttrail_game_charbase_update.call(this);
	if (this.canUpdateDustTrail()) {this.updateDusTrail()};
};

//=============================================================================
// ** Game Event
//=============================================================================

//==============================
// * Setup Page
//==============================
var _mog_dustTrail_gevent_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function() {
	_mog_dustTrail_gevent_setupPage .call(this);
    this.checkDustTrail();
};

//==============================
// * checkDustTrail
//==============================
Game_Event.prototype.checkDustTrail = function() {
	if (!this._erased && this.page()) {this.list().forEach(function(l) {
	       if (l.code === 108) {
			   var comment = l.parameters[0]
			   if (comment.toLowerCase() == "disable_dust"){
				    this.dustTrail().visible = false;
			   };
			};
	}, this);};
};

//=============================================================================
// ** Spriteset Map
//=============================================================================

//==============================
// * create Characters
//==============================
var _mog_charDustTrail_sprmap_createCharacters = Spriteset_Map.prototype.createCharacters;
Spriteset_Map.prototype.createCharacters = function() {
	_mog_charDustTrail_sprmap_createCharacters.call(this);
	this.createCharDustTrailSprites();
};

//==============================
// * create Char DustTrailSprites
//==============================
Spriteset_Map.prototype.createCharDustTrailSprites = function() {
	this._charDustTrailSprites = [];
	for (var i = 0; i < this._characterSprites.length; i++) {
	     this._charDustTrailSprites[i] = new CharDustTrailSprites(this._characterSprites[i],i);
	    this._tilemap.addChild(this._charDustTrailSprites[i]);
	};
};

//=============================================================================
// ** CharDustTrailSprites
//=============================================================================
function CharDustTrailSprites() {
    this.initialize.apply(this, arguments);
};
CharDustTrailSprites.prototype = Object.create(Sprite.prototype);
CharDustTrailSprites.prototype.constructor = CharDustTrailSprites;

//==============================
// * Initialize
//==============================
CharDustTrailSprites.prototype.initialize = function(sprite,id) {
    Sprite.prototype.initialize.call(this);	
    this.initialSetup(sprite,id);
	if (this.needCreateSprites()) {this.createSprites()};
};

//==============================
// * initial Setup
//==============================
CharDustTrailSprites.prototype.initialSetup = function(sprite,id) {
 	this._id = id;
	this._spriteCharacter = sprite;	
	this.z = 0;
    this._img = ImageManager.loadSystem("DustTrail"); 
};

//==============================
// * spr
//==============================
CharDustTrailSprites.prototype.spr = function() {
   return this._spriteCharacter;
}

//==============================
// * Char
//==============================
CharDustTrailSprites.prototype.char = function() {
    return this.spr()._character;
};

//==============================
// * Char
//==============================
CharDustTrailSprites.prototype.data = function() {
    return this.char()._charDustTrail;
};

//==============================
// * screen Y
//==============================
CharDustTrailSprites.prototype.screenX = function() {
	return -($gameMap.displayX() * $gameMap.tileWidth());
};

//==============================
// * screen Y
//==============================
CharDustTrailSprites.prototype.screenY = function() {
	return -($gameMap.displayY() * $gameMap.tileHeight());
};

//==============================
// * pos X
//==============================
CharDustTrailSprites.prototype.posX = function(i,data) {
	return data.orgX + this.screenX();
};

//==============================
// * pos Y
//==============================
CharDustTrailSprites.prototype.posY = function(i,data) {
	return  data.orgY + this.screenY();
};

//==============================
// * Create Sprites
//==============================
CharDustTrailSprites.prototype.createSprites = function() {
    this._spriteField = new Sprite();
	this.addChild(this._spriteField);
    var cdata = false;
    if (!this.char()._charDTrailData) {this.char()._charDTrailData = [];cdata = true}
	this._charDustSprites = [];
	for (var i = 0; i < this.data().nSprites; i++) {
    	 this._charDustSprites[i] = new Sprite(this._img);
		 this._charDustSprites[i].opacity = 0;
		 this._charDustSprites[i].visible = false;
		 this._charDustSprites[i].anchor.x = 0.5;
		 this._charDustSprites[i].anchor.y = 1;		 
		 this._spriteField.addChild(this._charDustSprites[i]);	
		 this.createInitialData(i,true);
	};
};

//==============================
// * Create Initial Data
//==============================
CharDustTrailSprites.prototype.createInitialData = function(i,needRefresh) {
    var time = 20	
	this.char()._charDTrailData[i] = {};
    this.char()._charDTrailData[i].time = time
	this.char()._charDTrailData[i].opacity = 0;
	this.char()._charDTrailData[i].x = 0;
	this.char()._charDTrailData[i].y = 0;
	this.char()._charDTrailData[i].scale = 0;	
	this.char()._charDTrailData[i].orgX = 0;
	this.char()._charDTrailData[i].orgY = 0;
	this.char()._charDTrailData[i].wait = 0;
	this.char()._charDTrailData[i].inAnimation = false;
	this.char()._charDTrailData[i].needRefresh = needRefresh;
};

//==============================
// * need CreateSprites
//==============================
CharDustTrailSprites.prototype.needCreateSprites = function() {
     if (this._charDustSprites) {return false}
	 return true;
};

//==============================
// * Update Position
//==============================
CharDustTrailSprites.prototype.updatePosition = function(sprite,data,i) {
    sprite.x = this.posX(i,data) ;
	sprite.y = this.posY(i,data); 
};

//==============================
// * executeDust
//==============================
CharDustTrailSprites.prototype.needCancelDust = function(sprite,data,i) {
   if (!this.char().isMoving()) {return true};
   if (!this.char().isDustTerrain()) {return true};
   return false;
};

//==============================
// * cancel Dust
//==============================
CharDustTrailSprites.prototype.cancelDust = function(sprite,data,i) {	
    this.resetSprite(sprite,data,i);
};

//==============================
// * updateAnimation
//==============================
CharDustTrailSprites.prototype.resetSprite = function(sprite,data,i) {
	sprite.opacity = 0;
	sprite.scale.x = 1;
	sprite.scale.y = 1;
	sprite.visible = false;
};

//==============================
// * executeDust
//==============================
CharDustTrailSprites.prototype.executeDust = function(sprite,data,i) {
	if (this.needCancelDust()) {this.cancelDust(sprite,data,i);return};
    sprite.visible = true;
	sprite.opacity = 255;
    this.setDustPosition(sprite,data,i)
    this.setDustScale(sprite,data,i)
	data.inAnimation = true;
};

//==============================
// * is Char Dashing
//==============================
CharDustTrailSprites.prototype.isCharDashing = function() {
   if (this.char().isDashing()) {return true};
   if (this.char()._moveSpeed >=  5) {return true};
   return false;
};

//==============================
// * setDustScale
//==============================
CharDustTrailSprites.prototype.setDustScale = function(sprite,data,i) {
	var rs = Math.randomInt(10) * 0.01;	
	var sca = this.isCharDashing() ? 0.1 : -0.02;
    sprite.scale.x = 0.10 + rs + sca;
    sprite.scale.y = sprite.scale.x;	
};

//==============================
// * setDustPosition
//==============================
CharDustTrailSprites.prototype.setDustPosition = function(sprite,data,i) {
  	if (this.char().direction() == 2 || this.char().direction() == 8) {
	 	 rx = -10 + Math.randomInt(20);
	     ry = Math.randomInt(5);
	 } else {
	 	 rx = Math.randomInt(5);
	     ry = -2 + Math.randomInt(10);		
	};	
	data.orgX = this.char().screenX() - this.screenX() + rx;
	data.orgY = this.char().screenY() - this.screenY() + ry;	 	
    sprite.x = data.orgX;
	sprite.y = data.orgY;
};

//==============================
// * needExecuteDust
//==============================
CharDustTrailSprites.prototype.needExecuteDust = function(sprite,data,i) {
   if (!this.data().executeDust) {return false};
   if (data.inAnimation) {return false};
   if (data.wait > 0) {return false};
   return true;
 };

//==============================
// * updateAnimation
//==============================
CharDustTrailSprites.prototype.updateAnimation = function(sprite,data,i) {
   sprite.opacity -= 10;
   if (sprite.opacity > 100) {
       sprite.scale.x += 0.02;
   } else {
	   sprite.scale.x -= 0.01;
	   sprite.opacity -= 2;
   };   
   if (sprite.opacity == 0) {
	   data.inAnimation = false;
	   this.resetSprite(sprite,data,i);
    };
	sprite.scale.y = sprite.scale.x;    
};

//==============================
// * updateAnimation
//==============================
CharDustTrailSprites.prototype.prepareExecuteDust = function(sprite,data,i) {
    this.resetSprite(sprite,data,i);
	var wt = this.isCharDashing() ? 3 : 15;
	data.wait = 5 + (i * wt);
};

//==============================
// * Update Sprites
//==============================
CharDustTrailSprites.prototype.updateSprites = function(sprite,data,i) {
	if (this.needExecuteDust(sprite,data,i)) {this.prepareExecuteDust(sprite,data,i)};
	if (data.wait > 0) {
		data.wait-= 1;
		if (data.wait == 0) {this.executeDust(sprite,data,i)};
	};
	if (data.inAnimation) {this.updateAnimation(sprite,data,i)};
	this.updatePosition(sprite,data,i);
	this.updateRecordData(sprite,data,i);
};

//==============================
// * update Ghost Trail
//==============================
CharDustTrailSprites.prototype.updateRecordData = function(sprite,data,i) {
    data.x = sprite.x;
	data.y = sprite.y;
	data.scale = sprite.scale.x;
	data.opacity = sprite.opacity;
};

//==============================
// * Need update
//==============================
CharDustTrailSprites.prototype.updateBase = function() {
	if (this.needCreateSprites()) {this.createSprites()};
	for (var i = 0; i < this._charDustSprites.length; i++) {
         var sprite = this._charDustSprites[i];
	     var data = this.char()._charDTrailData[i];
         this.updateSprites(sprite,data,i);
	};
	if (this.data().executeDust) {this.data().executeDust = false};
};

//==============================
// * Need update
//==============================
CharDustTrailSprites.prototype.needUpdate = function() {
	if (!this.data().visible) {return false};
	return true;
};

//==============================
// * Update
//==============================
CharDustTrailSprites.prototype.update = function() {
    Sprite.prototype.update.call(this);	
	if (this.needUpdate()) {
        this.updateBase();
	} else {
		this.visible = false;
	};
};