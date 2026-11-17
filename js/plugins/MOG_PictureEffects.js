//=============================================================================
// MOG_PictureEffects.js
//=============================================================================

/*:
 * @plugindesc (v1.0) O plugin permite animar as imagens.
 * @author Moghunter
 *
 * @help  
 * =============================================================================
 * ♦♦♦ MOG - Picture Effects ♦♦♦
 * Author   -   Moghunter
 * Version  -   1.0
 * Updated  -   2021/05/04
 * https://mogplugins.com
 * =============================================================================
 * O plugin permite animar as imagens.
 *
 * =============================================================================
 * SKIT MODE (PICTURES)
 * =============================================================================
 * Será necessário ter uma apenas uma imagem contendo as três posições
 * do personagem, nesta ordem.
 *
 * Parado/ Falando / Piscando
 *
 *
 *
 * =============================================================================
 * ♦ PLUGIN COMMANDS ♦
 * =============================================================================
 *
 * ============================================================================= 
 * pic_breath : PIC_ID : MODE : POWER
 * ============================================================================= 
 * 
 * PIC_ID  - ID  da imagem.
 * MODE    - Modo de respiração (0...2)
 *             0   Vertical Mode
 *             1   Horizontal Mode
 *             2   Vertical + Horizontal
 *            -1   Remove Effect 
 * POWER   - Poder da respiração (50...500)
 *
 * ============================================================================= 
 * pic_float : PIC_ID : MODE : POWER
 * ============================================================================= 
 * 
 * PIC_ID  - ID  da imagem.
 * MODE    - Modo da animação (0...2)
 *             0   Vertical
 *             1   Vertical Left
 *             2   Vertical Right
 *            -1   Remove Effect
 * POWER   - Altura maxima de flutuar (50...500)
 *
 * ============================================================================= 
 * pic_swing : PIC_ID : MODE : POWER
 * ============================================================================= 
 * 
 * PIC_ID  - ID  da imagem.
 * MODE    - Modo do balanço (0...1)
 *             0   Left
 *             1   Right
 *            -1   Remove Effect
 * POWER   - Poder do balanço (10...800)
 * 
 * ============================================================================= 
 * pic_shake : PIC_ID : MODE : POWER : SPEED : DURATION
 * ============================================================================= 
 * 
 * PIC_ID   - ID  da imagem.
 * MODE     - Definição da direção de tremer (0...2)
 *              0   Horizontal
 *              1   Vertical
 *              2   Vertical & Horizontal
 *             -1   Remove Effect
 * POWER    - Poder do balanço (4...300)
 * SPEED    - Velocidade de tremer (1...7)
 * DURATION - Duração do efeito (20...9999999)
 *
 * ============================================================================= 
 * pic_flip : PIC_ID : MODE : LOOP : SPEED : TWO_FACES
 * ============================================================================= 
 * 
 * PIC_ID   - ID  da imagem.
 * MODE     - Definição da direção do flip (0...2)
 *              0   Vertical
 *              1   Horizontal
 *              2   Vertical & Horizontal
 *             -1   Remove Effect
 * LOOP      - Fazer a animação dar loop.
 * SPEED     - Velocidade do flip (50...1000)
 * TWO_FACES - Ativar a imagem de duas faces (true...false) 
 *
 * ============================================================================= 
 * pic_fade : PIC_ID : MODE : SPEED : INTERVAL
 * ============================================================================= 
 * 
 * PIC_ID   - ID  da imagem.
 * MODE     - Definição da animação (0...1)
 *              0   Smooth
 *              1   Blink
 *             -1   Remove Effect
 * SPEED    - Definição da velocidade do fade (1...40)
 * INTERVAL - Definição do intervalo do fade (10...1000)
 *
 * ============================================================================= 
 * pic_collapse : PIC_ID : MODE : BLEND_MODE : SPEED
 * ============================================================================= 
 * 
 * PIC_ID     - ID  da imagem.
 * MODE       - Definição da animação (0...1)
 *               0   Boss Collapse
 *               1   Vertical Zoom
 *               2   Horizontal Zoom
 *               3   Hotizontal & Vertical Zoom
 *              -1   Remove Effect
 * BLEND_MODE - Definição do modo de Blend (0..2);
 *               0    Normal
 *               1    Additive
 *               2    Multiply
 * SPEED      - Definição da velocidade do fade (30...300)
 *
 * ============================================================================= 
 * pic_bind : PIC_ID : ENABLE
 * ============================================================================= 
 * 
 * PIC_ID     - ID  da imagem.
 * ENABLED    - Ativar ou desativar o modo bind
 * 
 * ============================================================================= 
 * pic_qmove : PIC_ID : DIRECTION : DISTANCE : SPEED : TIMES
 * ============================================================================= 
 * 
 * PIC_ID      - ID  da imagem.
 * DIRECTION   - Direção de movimento. 
 *               0   UP
 *               1   LEFT
 *               2   RIGHT
 *               4   DOWN
 *               -1  CANCEL
 * DISTANCE    - Distância de movimento (10...1000)
 * SPEED       - Velocidade de movimento (1...100)
 * TIMES       - Número de movimentos (1...9999999)
 *
 * ============================================================================= 
 * pic_qzoom : PIC_ID : MODE : SPEED : TIMES
 * ============================================================================= 
 * 
 * PIC_ID      - ID  da imagem.
 * MODE        - Modo de Zoom. 
 *               0   Zoom Out & In
 *               1   Zoom In
 *               2   Zoom Out
 *               -1  CANCEL
 * SPEED       - Velocidade de zoom (50...500)
 * TIMES       - Número de vezes (1...9999999)
 * 
 * ============================================================================= 
 * pic_animated : PIC_ID : FRAMES : SPEED
 * ============================================================================= 
 * 
 * PIC_ID      - ID  da imagem.
 * FRAMES      - Numero de frames (1..100)
 * SPEED       - Velocidade de animação (1..7)
 *  
 * ============================================================================= 
 * pic_skit : PIC_ID : BLINK_INTERVAL : SPEAK_ANIMATION
 * ============================================================================= 
 * 
 * PIC_ID             - ID  da imagem.
 * BLINK_INTERVAL     - Numero de frames (1..999)
 * SPEAK_ANIMATION    - Ativar animação de fala. (true / false)
 *   
 * ============================================================================= 
 * pic_camera : PIC_ID : ENABLE : RANGE
 * ============================================================================= 
 * 
 * PIC_ID             - ID  da imagem.
 * ENABLE             - Ativar ou Desativar (true / false)
 * RANGE              - Taxa de movimento. (5...100)
 *   
 * ============================================================================= 
 * pic_ocean : PIC_ID : X_WAVE : Y_WAVE : X_SPEED : Y_SPEED : IGNORE_PICTURES
 * ============================================================================= 
 * 
 * X_WAVE             - Ativar movimento na horizontal.
 * Y_WAVE             - Ativar movimento na vertical.
 * X_SPEED            - Velocidade de movimento na horizontal.
 * Y_SPEED            - Velocidade de movimento na vertical.
 * IGNORE_PICTURES    - Ignorar imagens.  
 *
 * EX       
 *
 * pic_ocean : true : true : 50 : 50 : 4,5,6,13
 *
 */


//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================

(() => {

　　var Imported = Imported || {};
　　Imported.MOG_PictureEffects = true;
　　var Moghunter = Moghunter || {}; 

    Moghunter.parameters = PluginManager.parameters('MOG_PictureEffects');

//=============================================================================
// ** Game_Interpreter
//=============================================================================	

//==============================
// * PluginCommand
//==============================
var _alias_mog_picefc_pluginCommand = Game_Interpreter.prototype.pluginCommand
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_alias_mog_picefc_pluginCommand.call(this,command, args);
	if ($gameScreen.picture(Number(args[1]))) {$gameScreen.setPictureEffects(command, args)
	} else if (command == "pic_ocean")  {$gameScreen.setPictureOceanEffect(args)};
	return true;
};
	
//==============================
// * setPicture Effects
//==============================
Game_Screen.prototype.setPictureEffects = function(command,args) {
	var data = {};
    var picture = this.picture(Number(args[1]));
    if (command == "pic_breath")  {	    
		data.mode = Math.min(Math.max(Number(args[3]),-1),2);
    	data.power = Math.min(Math.max(Number(args[5]),50),500);
		picture.setPicBreathEffect(data);
	};
    if (command == "pic_float")  {	    
		data.mode = Math.min(Math.max(Number(args[3]),-1),2);
		data.power = Math.min(Math.max(Number(args[5]),50),500);
		picture.setPicFloatEffect(data);
	};	
    if (command == "pic_swing")  {	    
		data.mode = Math.min(Math.max(Number(args[3]),-1),1);
		data.power = Math.min(Math.max(Number(args[5]),10),800);
		picture.setPicSwingEffect(data);
	};	
    if (command == "pic_shake")  {	    
		data.mode = Math.min(Math.max(Number(args[3]),-1),2);
		data.power = Math.min(Math.max(Number(args[5]),4),300);
		data.speed = Math.min(Math.max(Number(args[7]),1),7);
		data.duration = Math.min(Math.max(Number(args[9]),20),9999999);
		picture.setPicShakeEffect(data);
	};		
    if (command == "pic_flip")  {	    
		data.mode = Math.min(Math.max(Number(args[3]),-1),2);
		data.loop = String(args[5]) == "true" ? true : false;
		data.speed = Math.min(Math.max(Number(args[7]),50),1000);
		data.twoFaces = String(args[9]) == "true" ? true : false;
		picture.setPicFlipEffect(data);
	};		
    if (command == "pic_fade")  {	    
		data.mode = Math.min(Math.max(Number(args[3]),-1),2);
		data.speed = Math.min(Math.max(Number(args[5]),1),40);
		data.interval = Math.min(Math.max(Number(args[7]),10),1000);
		picture.setPicFadeEffect(data);
	};	
    if (command == "pic_collapse")  {	    
		data.mode = Math.min(Math.max(Number(args[3]),-1),3);
		data.blendMode = Math.min(Math.max(Number(args[5]),0),2);
		data.speed = Math.min(Math.max(Number(args[7]),30),300);
		picture.setPicCollapseEffect(data);
	};		
    if (command == "pic_bind")  {	    
		data.enabled = String(args[3]) == "true" ? true : false;
		picture.setPicBindEffect(data);
	};
    if (command == "pic_qmove")  {	   
		data.mode = Math.min(Math.max(Number(args[3]),-1),3);
		data.range = Math.min(Math.max(Number(args[5]),10),1000);
	    data.speed = Math.min(Math.max(Number(args[7]),1),100);
		data.times = Math.min(Math.max(Number(args[9]),1),9999999);
		picture.setPicQuickMove(data);
	} else if (command == "pic_qzoom")  {	   
		data.mode = Math.min(Math.max(Number(args[3]),-1),3);
	    data.speed = Math.min(Math.max(Number(args[5]),50),500);
		data.times = Math.min(Math.max(Number(args[7]),1),9999999);
		picture.setPicQuickZoom(data);		
	};
    if (command == "pic_animated")  {	    
		data.frames = Math.min(Math.max(Number(args[3]),1),100);
		data.speed = Math.min(Math.max(Number(args[5]),1),7);
		picture.setPicAnimatedEffect(data);
	};
    if (command == "pic_skit")  {	    
		data.blinkInterval = Math.min(Math.max(Number(args[3]),1),999);
		data.speaking = String(args[5]) == "true" ? true : false;
		picture.setPicCharMode(data);
	};	
    if (command == "pic_camera")  {	    
		data.enabled = String(args[3]) == "true" ? true : false;
		data.range = Math.min(Math.max(Number(args[5]),5),100);
	    this._picEffect.camera = true;
		picture.setPicCameraMode(data);
	};
}; 
	
//==============================
// * setPictureOceanEffect
//==============================
Game_Screen.prototype.setPictureOceanEffect = function(args) {
	    var data = {};
		data.waveX = String(args[1]) == "true" ? true : false;
		data.waveY = String(args[3]) == "true" ? true : false;
		data.waveSpeedX = Math.min(Math.max(Number(args[5]),30),100);
		data.waveSpeedY = Math.min(Math.max(Number(args[7]),30),100);
	    data.ignore = args[9];
		this.setPicWave(data);
};	

//==============================
// ♦ ALIAS ♦  Clear
//==============================
const _mog_pictureEffects_game_screen_clear = Game_Screen.prototype.clear;
Game_Screen.prototype.clear = function() {
     _mog_pictureEffects_game_screen_clear.call(this);
	this.clearPictureEffects();
};	

//==============================
// * clearPictureEffects
//==============================
Game_Screen.prototype.clearPictureEffects = function() {
    this._picEffect = {};
	this._picEffect.camera = false;
	this.clearWaveEffect();
};

//==============================
// * clearWaveEffect
//==============================
Game_Screen.prototype.clearWaveEffect = function() {	
	this._picEffect.wave = {};
	this._picEffect.wave.ignore = [];
	this._picEffect.wave.enable = [false,false];
	this._picEffect.wave.w = [0,0,0,0];
	this._picEffect.wave.x = 0;
	this._picEffect.wave.y = 0;
	this._picEffect.wave.speed = [0.01,0.005];
	this._picEffect.wave.range = [0,0];
	this._picEffect.wave.phase = [0,0];
	this._picEffect.wave.rangeMax = [1,0.5];
};
	
//==============================
// * setPicWave Effect
//==============================
Game_Screen.prototype.setPicWave = function(data) {
	this.clearWaveEffect();
	const enableX = String(data.waveX) == "true" ? true : false;
	const enableY = String(data.waveY) == "true" ? true : false;
	this._picEffect.wave.enable[0] = enableX;
	this._picEffect.wave.speed[0] = 0.01 * Number(data.waveSpeedX) / 100;
	this._picEffect.wave.rangeMax[0] = 0.5 * Number(data.waveSpeedX) / 100;
	this._picEffect.wave.enable[1] = enableY;
	this._picEffect.wave.speed[1] = 0.01 * Number(data.waveSpeedY) / 100;
	this._picEffect.wave.rangeMax[1] = 0.5 * Number(data.waveSpeedY) / 100;	
	if (data.ignore && data.ignore.length > 0) {
		this._picEffect.wave.ignore = data.ignore.split(',');
	};
	if (!enableX && !enableY) {this.clearWaveEffect();return};
	if (this._picEffect.wave.ignore && this._picEffect.wave.ignore.length > 0) {this.reloadPicIgnore()};
};	

//==============================
// * reloadPicIgnore
//==============================
Game_Screen.prototype.reloadPicIgnore = function() {
   for (var i = 0; i < this._picEffect.wave.ignore.length; i++) {
			 this.setPicIgnoreWave(Number(this._picEffect.wave.ignore[i]));
   };
};

//==============================
// * setPicIgnoreWave
//==============================
Game_Screen.prototype.setPicIgnoreWave = function(picid) {
    const realPictureId = this.realPictureId(picid);
    if (this._pictures[realPictureId]) {this._pictures[realPictureId]._picEffect.ignoreWave = true};
};

//==============================
// ♦ ALIAS ♦ Show Picture
//==============================
const _mog_pictureEffects_game_screen_showPicture = Game_Screen.prototype.showPicture;
Game_Screen.prototype.showPicture = function(pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode) {
     _mog_pictureEffects_game_screen_showPicture.call(this,pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode);
	if (this._picEffect.wave.ignore && this._picEffect.wave.ignore.length > 0) {this.reloadPicIgnore()};
};
	
//==============================
// ♦ ALIAS ♦ Update
//==============================
const _mog_pictureEffects_game_screen_update = Game_Screen.prototype.update;
Game_Screen.prototype.update = function() {
    _mog_pictureEffects_game_screen_update.call(this);
	this.updatePictureEffects();
};
	
//==============================
// * updatePictureEffects
//==============================
Game_Screen.prototype.updatePictureEffects = function() {
	for (var i = 0; i < 2; i++) {
        if (i == 0 && this._picEffect.wave.enable[i]) {this._picEffect.wave.x = this.updatePicWave(i)};
    	if (i == 1 && this._picEffect.wave.enable[i]) {this._picEffect.wave.y = this.updatePicWave(i)};
	};
};		

//==============================
// * updatePicBreath
//==============================
Game_Screen.prototype.updatePicWave= function(i) {
	  if (this._picEffect.wave.phase[i] == 0) {
		  this._picEffect.wave.range[i] -= this._picEffect.wave.speed[i];
	      if (this._picEffect.wave.range[i] <= -this._picEffect.wave.rangeMax[i]) {
			  this._picEffect.wave.range[i] = -this._picEffect.wave.rangeMax[i];
			  this._picEffect.wave.phase[i] = 1;
		  };
	  } else {
		  this._picEffect.wave.range[i] += this._picEffect.wave.speed[i];
		  if (this._picEffect.wave.range[i] >= this._picEffect.wave.rangeMax[i]) {
			  this._picEffect.wave.range[i] = this._picEffect.wave.rangeMax[i];
			  this._picEffect.wave.phase[i] = 0;
		   };
	  };
	  this._picEffect.wave.w[i] -= this._picEffect.wave.range[i];
      return this._picEffect.wave.w[i];
};

//==============================
// ♦ ALIAS ♦  erase Picture
//==============================
const _mog_picEffects_game_screen_erasePicture = Game_Screen.prototype.erasePicture;
Game_Screen.prototype.erasePicture = function(pictureId) {
	_mog_picEffects_game_screen_erasePicture.call(this,pictureId);
    var enabled = false;
	this._pictures.forEach(function(picture) {
        if (picture && picture._picEffect.camera.enabled) {enabled = true}
    });
	if (!enabled) {$gameScreen._picEffect.camera = false};
};
	
	
//=============================================================================
// ■■■ Touch Input ■■■
//=============================================================================

//==============================
// ♦ ALIAS ♦  Initialize
//==============================
const _mog_picEffects_touchInput_onMouseMove = TouchInput._onMouseMove;
TouchInput._onMouseMove = function(event) {
	_mog_picEffects_touchInput_onMouseMove.call(this,event);
    if ($gameScreen && $gameScreen._picEffect.camera) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    };
};		
	
//=============================================================================
// ■■■ Game_Message ■■■
//=============================================================================

//==============================
// ♦ ALIAS ♦  Initialize
//==============================	
const _mog_picEffect_game_message_clear = Game_Message.prototype.clear;
Game_Message.prototype.clear = function() {
	 _mog_picEffect_game_message_clear.call(this);
	this._picMessageWait = 0;
};
	
//=============================================================================
// ■■■ Scene_Map ■■■
//=============================================================================	
	
//==============================
// ♦ ALIAS ♦  Update
//==============================
const _mog_picEffects_scene_map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_mog_picEffects_scene_map_update.call(this);
	if (this._messageWindow) {
		$gameMessage._picMessageWait = this._messageWindow._textState;
    };
};
	
//=============================================================================
// ■■■ Scene_Battle ■■■
//=============================================================================	
	
//==============================
// ♦ ALIAS ♦  Update
//==============================
const _mog_picEffects_scene_battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
	 _mog_picEffects_scene_battle_update.call(this);
	if (this._messageWindow) {
		$gameMessage._picMessageWait = this._messageWindow._textState;
    };
};		
	
//=============================================================================
// ■■■ Game_Picture ■■■
//=============================================================================

//==============================
// ♦ ALIAS ♦  Initialize
//==============================
const _mog_picEffect_game_picture_initialize = Game_Picture.prototype.initialize;
Game_Picture.prototype.initialize = function() {
	_mog_picEffect_game_picture_initialize.call(this);
	this.initPictureEffects();
};

//==============================
// * initPictureEffects
//==============================
Game_Picture.prototype.initPictureEffects = function() {
   this._picEffect = {};
   this._picEffect.needRefresh = true;
   this._picEffect.ignoreWave = false;
   this.clearCameraMode(); 
   this.clearBreathEffect();
   this.clearFloatEffect();
   this.clearShakeEffect();
   this.clearFlipEffect();
   this.clearSwingEffect();
   this.clearFadeEffect();
   this.clearBindEffect();
   this.clearCollapseEffect();	
   this.clearQuickMove();
   this.clearQuickZoom();
   this.clearCharacterMode();
   this.clearAnimatedEffect();	
};

//==============================
// * clearCameraMode
//==============================
Game_Picture.prototype.clearCameraMode = function() {
   this._picEffect.camera = {};	
   this._picEffect.camera.enabled = false;
   this._picEffect.camera.range = 30;
   this._picEffect.camera.x = 0;
   this._picEffect.camera.y = 0;	
};
	
//==============================
// * setPicCameraMode
//==============================
Game_Picture.prototype.setPicCameraMode = function(data) {
   this._picEffect.camera.enabled = String(data.enabled) == "true" ? true : false;
   this._picEffect.camera.range = Math.min(Math.max(Number(data.range),5),100);
   this._picEffect.camera.x = 0;
   this._picEffect.camera.y = 0;		
};
	
//==============================
// * updatePicCamera
//==============================
Game_Picture.prototype.updatePicCamera = function() {
	const nx = (TouchInput.x * (this._x + 20) / Graphics.width) * this._picEffect.camera.range / 100;
	const ny = (TouchInput.y * (this._y + 20) / Graphics.height) * this._picEffect.camera.range / 100;;
    this._picEffect.camera.x = -nx;
	this._picEffect.camera.y = -ny;
};		
	
//==============================
// * Pic Is Camera Mode
//==============================
Game_Picture.prototype.picIsCameraMode = function() {
    return this._picEffect.camera.enabled; 
};		
	
//==============================
// * clearCollapseEffect
//==============================
Game_Picture.prototype.clearCollapseEffect = function() {
   this._picEffect.collapse = {};
   this._picEffect.collapse.x = -1;
   this._picEffect.collapse.phase = 0;	
   this._picEffect.collapse.blendMode = 0;	
   this._picEffect.collapse.range = 0;   
   this._picEffect.collapse.rangeMax = 0;
   this._picEffect.collapse.speed1 = 4;
   this._picEffect.collapse.speed2 = 240;
   this._picEffect.collapse.frameY  = 0;
   this._picEffect.collapse.scale = 0	
   this._picEffect.collapse.scaleX = 0;
   this._picEffect.collapse.scaleY = 0;
   this._picEffect.collapse.scaleSpeed = 0.01;
   this._picEffect.collapse.opacity = 0;
   this._picEffect.collapse.opacitySpeed = 5;
   this._picEffect.collapse.shakeEnabled = false;
   this._picEffect.collapse.shakeX = 0;
   this._picEffect.collapse.shakeSpeed = 0;
};
	
//==============================
// * clearQuickMove
//==============================
Game_Picture.prototype.clearQuickMove = function() {
   this._picEffect.quickMove = {};
   this._picEffect.quickMove.mode = -1;
   this._picEffect.quickMove.x = 0;
   this._picEffect.quickMove.y = 0;
   this._picEffect.quickMove.range = 0;
   this._picEffect.quickMove.rangeMax = 0;	
   this._picEffect.quickMove.phase = 0;
   this._picEffect.quickMove.speed = 0;
   this._picEffect.quickMove.times = 1;
};
	
//==============================
// * clearQuickZoom
//==============================
Game_Picture.prototype.clearQuickZoom = function() {
   this._picEffect.quickZoom = {};
   this._picEffect.quickZoom.mode = -1;
   this._picEffect.quickZoom.scaleX = 0;
   this._picEffect.quickZoom.scaleY = 0;
   this._picEffect.quickZoom.range = 0;
   this._picEffect.quickZoom.rangeMax = 0;	
   this._picEffect.quickZoom.phase = 0;
   this._picEffect.quickZoom.speed = 0;
   this._picEffect.quickZoom.times = 1;
};	

//==============================
// * clearCharacterMode
//==============================
Game_Picture.prototype.clearCharacterMode = function() {
   this._picEffect.charMode = {};
   this._picEffect.charMode.enabled = false;   	
};
	
//==============================
// * clearFloatEffect
//==============================
Game_Picture.prototype.clearFloatEffect = function() {
   this._picEffect.floatEffect = {};
   this._picEffect.floatEffect.mode = -1;
   this._picEffect.floatEffect.phase = 0;
   this._picEffect.floatEffect.rangeMax = 0.00100;
   this._picEffect.floatEffect.range = 0;
   this._picEffect.floatEffect.speed = 0;		
   this._picEffect.floatEffect.y_Real = 0;
   this._picEffect.floatEffect.x = 0;	
   this._picEffect.floatEffect.y = 0;	
};	
 
//==============================
// * clearShakeEffect
//==============================
Game_Picture.prototype.clearShakeEffect = function() {
   this._picEffect.shakeEffect = {};
   this._picEffect.shakeEffect.mode = -1;
   this._picEffect.shakeEffect.duration = 0;
   this._picEffect.shakeEffect.range = 0;
   this._picEffect.shakeEffect.rangeMax = 0;
   this._picEffect.shakeEffect.speed1 = 0;
   this._picEffect.shakeEffect.speed2 = 0;	
   this._picEffect.shakeEffect.interval = 0;
   this._picEffect.shakeEffect.x = 0;
   this._picEffect.shakeEffect.y = 0;	
};
	
//==============================
// * clearFlipEffect
//==============================
Game_Picture.prototype.clearFlipEffect = function() {
   this._picEffect.flipEffect = {};
   this._picEffect.flipEffect.phase = 0;
   this._picEffect.flipEffect.mode = -1;
   this._picEffect.flipEffect.skip = false;
   this._picEffect.flipEffect.loop = true;
   this._picEffect.flipEffect.twoFaces = {};
   this._picEffect.flipEffect.twoFaces.enabled = false;
   this._picEffect.flipEffect.twoFaces.needRefresh = false;
   this._picEffect.flipEffect.twoFaces.index = 0
   this._picEffect.flipEffect.twoFaces.phase1 = 0
   this._picEffect.flipEffect.twoFaces.phase2 = 0	
   this._picEffect.flipEffect.speed = 0;
   this._picEffect.flipEffect.scale = 0;	
   this._picEffect.flipEffect.scaleX = 0;
   this._picEffect.flipEffect.scaleY = 0;	
};
	
//==============================
// * clearFadeEffect
//==============================
Game_Picture.prototype.clearFadeEffect = function() {
   this._picEffect.fadeEffect = {};
   this._picEffect.fadeEffect.phase = 0;
   this._picEffect.fadeEffect.mode = -1;
   this._picEffect.fadeEffect.inteval = 0;
   this._picEffect.fadeEffect.intevalMax = 0;
   this._picEffect.fadeEffect.rangeMax = 255;
   this._picEffect.fadeEffect.repeatTimes = 0;
   this._picEffect.fadeEffect.range = 0;	
   this._picEffect.fadeEffect.speed = 0;
   this._picEffect.fadeEffect.opacity = 0;
};
	
//==============================
// * clearAnimatedEffect
//==============================
Game_Picture.prototype.clearAnimatedEffect = function() {
   this._picEffect.animatedEffect = {};
   this._picEffect.animatedEffect.enabled = false;
   this._picEffect.animatedEffect.frameIndex = 0;
   this._picEffect.animatedEffect.frameMax = 4;
   this._picEffect.animatedEffect.speed = 0;
   this._picEffect.animatedEffect.speedReal = 5;	
   this._picEffect.animatedEffect.interval = 60;
};
	
//==============================
// * clearBindEffect
//==============================
Game_Picture.prototype.clearBindEffect = function() {
   this._picEffect.bindEffect = {};
   this._picEffect.bindEffect.enabled = false;
   this._picEffect.bindEffect.x_offset = 0;
   this._picEffect.bindEffect.y_offset = 0;
};
	
//==============================
// * setPicBindEffect
//==============================
Game_Picture.prototype.setPicBindEffect = function(data) {
   this._picEffect.needRefresh = true;
   this._picEffect.bindEffect.enabled = String(data.enabled) == "true" ? true : false;
   this._picEffect.bindEffect.x_offset = 0;
   this._picEffect.bindEffect.y_offset = 0;	
};
	
//==============================
// * clearBreathEffect
//==============================
Game_Picture.prototype.clearBreathEffect = function() {
   this._picEffect.breathEffect = {};
   this._picEffect.breathEffect.mode = -1;
   this._picEffect.breathEffect.phase = 0;
   this._picEffect.breathEffect.rangeMax = 0.00100;
   this._picEffect.breathEffect.range = 0;
   this._picEffect.breathEffect.speed = 0;
   this._picEffect.breathEffect.scale = 0;	
   this._picEffect.breathEffect.scaleX = 0;
   this._picEffect.breathEffect.scaleY = 0;	
};	

//==============================
// * clearSwingEffect
//==============================
Game_Picture.prototype.clearSwingEffect = function() {
   this._picEffect.swingEffect = {};
   this._picEffect.swingEffect.mode = -1;
   this._picEffect.swingEffect.phase = 0;
   this._picEffect.swingEffect.speedReal = 100;	
   this._picEffect.swingEffect.rangeMax = 0.02;
   this._picEffect.swingEffect.range = 0.00;
   this._picEffect.swingEffect.speed = 0.0005;
   this._picEffect.swingEffect.rot = 0;
   this._picEffect.swingEffect.rotation = 0; 
};
	
//==============================
// * isPicSwing
//==============================
Game_Picture.prototype.isPicSwing = function() {
     return this._picEffect.swingEffect.mode >= 0;
};	

//==============================
// * pic Is Collapsing
//==============================
Game_Picture.prototype.picIsCollapsing = function() {
   return this._picEffect.collapse.mode >= 0; 
};	
	
//==============================
// * pic Is Animated
//==============================
Game_Picture.prototype.picIsAnimated = function() {
   return this._picEffect.animatedEffect.enabled && !this._picEffect.flipEffect.twoFaces.enabled; 
};

//==============================
// * setPicCharMode
//==============================
Game_Picture.prototype.isPicSpeaking = function() {
	if (!this._picEffect.charMode.speakingNow) {return false};
	if ($gameMessage._picMessageWait) {return true};
	return false;
};
	
//==============================
// * picIsQuickMove
//==============================
Game_Picture.prototype.picIsQuickMove = function() {
   return this._picEffect.quickMove.mode >= 0 && !this.picIsCollapsing();
};		

//==============================
// * is Pic Char Mode
//==============================
Game_Picture.prototype.isPicCharMode = function() {
    return this._picEffect.charMode.enabled;
};	
	
//==============================
// * pic Is Floating
//==============================
Game_Picture.prototype.picIsFloating = function() {
   return this._picEffect.floatEffect.mode >= 0 && !this.picIsCollapsing(); 
};	
	
//==============================
// * pic Is Breathing
//==============================
Game_Picture.prototype.picIsBreathing = function() {
   return this._picEffect.breathEffect.mode >= 0 && !this.picIsCollapsing(); 
};

//==============================
// * picIsQuickZoom
//==============================
Game_Picture.prototype.picIsQuickZoom = function() {
   return this._picEffect.quickZoom.mode >= 0 && !this.picIsCollapsing();
};	

//==============================
// * pic Is Flip
//==============================
Game_Picture.prototype.picIsFlip = function() {
   return this._picEffect.flipEffect.mode >= 0 && !this.picIsCollapsing();
};	
	
//==============================
// * isPicTwoFaces
//==============================
Game_Picture.prototype.isPicTwoFaces = function() {	
   return this._picEffect.flipEffect.twoFaces.enabled;
};
	
//==============================
// * pic Is Shaking
//==============================
Game_Picture.prototype.picIsShaking = function() {
   return this._picEffect.shakeEffect.duration > 0; 
};
	
//==============================
// * pic Is Fading
//==============================
Game_Picture.prototype.picIsFading = function() {
   return this._picEffect.fadeEffect.mode >= 0 && !this.picIsCollapsing(); 
};
	
//==============================
// * pic Is Bind
//==============================
Game_Picture.prototype.picIsBind = function() {
   return this._picEffect.bindEffect.enabled; 
};	
	
//==============================
// * pic Effect X
//==============================
Game_Picture.prototype.picEffectX = function() {
   return this._picEffect.shakeEffect.x + this._picEffect.floatEffect.x + this._picEffect.bindEffect.x_offset + this._picEffect.quickMove.x + this._picEffect.collapse.shakeX + $gameScreen._picEffect.wave.x + this._picEffect.camera.x; 
};

//==============================
// * pic Effect Y
//==============================
Game_Picture.prototype.picEffectY = function() {
   return this._picEffect.shakeEffect.y + this._picEffect.floatEffect.y + this._picEffect.bindEffect.y_offset + this._picEffect.quickMove.y + $gameScreen._picEffect.wave.y + this._picEffect.camera.y;   
};

//==============================
// * pic Effect scale X
//==============================
Game_Picture.prototype.picEffectScaleX = function() {
   return this._picEffect.breathEffect.scaleX + this._picEffect.flipEffect.scaleX + this._picEffect.quickZoom.scaleX + this._picEffect.collapse.scaleX;  
};	
	
//==============================
// * pic Effect scale Y
//==============================
Game_Picture.prototype.picEffectScaleY = function() {
   return this._picEffect.breathEffect.scaleY + this._picEffect.flipEffect.scaleY + this._picEffect.quickZoom.scaleY + this._picEffect.collapse.scaleY;
};
	
//==============================
// * pic Effectopacity
//==============================
Game_Picture.prototype.picEffectOpacity = function() {
   return this._picEffect.fadeEffect.opacity + this._picEffect.collapse.opacity;  
};	
	
//==============================
// * pic Effect Rotation
//==============================
Game_Picture.prototype.picEffectRotation = function() {
   return this._picEffect.swingEffect.rotation;  
};

//==============================
// * setPicSwingEffect
//==============================
Game_Picture.prototype.setPicSwingEffect = function(data) {
   this._picEffect.needRefresh = true;	
   const mode = Number(data.mode);
   if (mode == -1) {this.clearSwingEffect();return};
   this._picEffect.swingEffect.mode = mode;
   this._picEffect.swingEffect.phase = 0;
   this._picEffect.swingEffect.speedReal = 100;	
   this._picEffect.swingEffect.rangeMax = 0.02 * Number(data.power) / 100;
   this._picEffect.swingEffect.range = 0.00;
   this._picEffect.swingEffect.speed = 0.0005 * Number(data.power) / 100;
   this._picEffect.swingEffect.rot = 0;
   this._picEffect.swingEffect.rotation = 0; 
};
	
//==============================
// * updatePicSwing
//==============================
Game_Picture.prototype.updatePicSwing = function() {
	  if (this._picEffect.swingEffect.phase == 0) {
		  this._picEffect.swingEffect.range -= this._picEffect.swingEffect.speed;
	      if (this._picEffect.swingEffect.range <= -this._picEffect.swingEffect.rangeMax) {
			  this._picEffect.swingEffect.range = -this._picEffect.swingEffect.rangeMax;
			  this._picEffect.swingEffect.phase = 1;
		  };
	  } else {
		  this._picEffect.swingEffect.range += this._picEffect.swingEffect.speed;
		  if (this._picEffect.swingEffect.range >= this._picEffect.swingEffect.rangeMax) {
			  this._picEffect.swingEffect.range = this._picEffect.swingEffect.rangeMax;
			  this._picEffect.swingEffect.phase = 0;
		   };
	  };
	  this._picEffect.swingEffect.rot -= this._picEffect.swingEffect.range;
      this._picEffect.swingEffect.rotation = this._picEffect.swingEffect.mode == 0 ? this._picEffect.swingEffect.rot : -this._picEffect.swingEffect.rot;
};	
	
//==============================
// *setPicCollapseEffect
//==============================
Game_Picture.prototype.setPicCollapseEffect = function(data) {
   this._picEffect.needRefresh = true;
   const mode = Number(data.mode);
   if (mode == -1) {this.clearCollapseEffect();return}	
   this._picEffect.collapse.mode = mode;
   this._picEffect.collapse.x = 0;
   this._picEffect.collapse.phase = 0;	
   this._picEffect.collapse.blendMode = this.picEffectgetBlend(String(data.blendMode));	
   this._picEffect.collapse.range = 1;   
   this._picEffect.collapse.rangeMax = 0;
   this._picEffect.collapse.speed1 = Math.min(Math.max(Number(data.speed), 30),300);
   this._picEffect.collapse.speed2 = 240;
   this._picEffect.collapse.frameY  = 0;
   this._picEffect.collapse.scale = 0	
   this._picEffect.collapse.scaleX = 0;
   this._picEffect.collapse.scaleY = 0;
   this._picEffect.collapse.scaleSpeed = ((100 / 40) * 0.01) * this._picEffect.collapse.speed1 / 100;
   if (this._picEffect.collapse.mode == 3) {this._picEffect.collapse.scaleSpeed *= 2};
   this._picEffect.collapse.opacity = 0;
   this._picEffect.collapse.opacitySpeed = (255 / 60) * this._picEffect.collapse.speed1 / 100;
   if (this._picEffect.collapse.mode == 0) {this._picEffect.collapse.opacitySpeed = 0};
   this._picEffect.collapse.shakeEnabled = this._picEffect.collapse.mode == 0 ? true : false;
   this._picEffect.collapse.shakeX = 0;
   this._picEffect.collapse.shakeSpeed = 0;
};

//==============================
// * picEffectgetMode
//==============================
Game_Picture.prototype.picEffectgetMode = function(mode) {
    if (mode == "Boss Collapse") {return 0;
	} else if (mode == "Vertical") {return 1;
	} else if (mode == "Horizontal") {return 2;
	} else if (mode == "Vertical & Horizontal") {return 3;
	};
	return -1;
}; 	
	
//==============================
// * picEffectgetBlend
//==============================
Game_Picture.prototype.picEffectgetBlend = function(blend) {
	if (blend == "Additive") {return 1;
	} else if (blend == "Multiply") {return 2};
	return 0;
}; 
	
//==============================
// * updatePicCollapse
//==============================
Game_Picture.prototype.updatePicCollapse = function() {
	if (this._picEffect.collapse.mode == 1 || this._picEffect.collapse.mode == 2) {
		this.updatePicCollapse1_2();
	} else if (this._picEffect.collapse.mode == 3) {
		this.updatePicCollapse3();
	};	
   if (this._picEffect.collapse.shakeEnabled) {this.updatePicCollapseShake()};
};
	
//==============================
// * updatePicCollapse1_2
//==============================
Game_Picture.prototype.updatePicCollapse1_2 = function() {
	 if (this._picEffect.collapse.scale < 1.00) {
	     this._picEffect.collapse.scale += this._picEffect.collapse.scaleSpeed;
		 if (this._picEffect.collapse.scale >= 1.00) {this._picEffect.collapse.scale = 1.00};
	 };
	 if (this._picEffect.collapse.mode == 1) {
         this._picEffect.collapse.scaleX = -this._picEffect.collapse.scale;
	     this._picEffect.collapse.scaleY = +this._picEffect.collapse.scale;
	 } else {
         this._picEffect.collapse.scaleX = +this._picEffect.collapse.scale;
	     this._picEffect.collapse.scaleY = -this._picEffect.collapse.scale;		 
	 };
     this._picEffect.collapse.opacity -= this._picEffect.collapse.opacitySpeed;
};

//==============================
// * updatePicCollapse1_3
//==============================
Game_Picture.prototype.updatePicCollapse3 = function() {
   if (this._picEffect.collapse.phase == 0) {
	 if (this._picEffect.collapse.scale < 1.00) {
	     this._picEffect.collapse.scale += this._picEffect.collapse.scaleSpeed;
		 if (this._picEffect.collapse.scale >= 1.00) {
			 this._picEffect.collapse.scale = 1.00;
			 this._picEffect.collapse.phase = 1;
		 };
	 };   
   } else {
	 if (this._picEffect.collapse.scale > -1.00) {
	     this._picEffect.collapse.scale -= this._picEffect.collapse.scaleSpeed;
		 if (this._picEffect.collapse.scale <= -1.00) {
			 this._picEffect.collapse.scale = -1.00;
		 };
	 };   	   
   };	
   this._picEffect.collapse.scaleX = +this._picEffect.collapse.scale;
   this._picEffect.collapse.scaleY = -this._picEffect.collapse.scale;
   this._picEffect.collapse.opacity -= this._picEffect.collapse.opacitySpeed;
};		
		
//==============================
// * updatePicCollapseShake
//==============================
Game_Picture.prototype.updatePicCollapseShake = function() {	
	this._picEffect.collapse.shakeSpeed++ 
	if (this._picEffect.collapse.shakeSpeed > 1) {
	 	this._picEffect.collapse.shakeSpeed = 0;
	    this._picEffect.collapse.shakeX = - 4 + Math.randomInt(8); 
	};
};	

//==============================
// * setPicQuickMove
//==============================
Game_Picture.prototype.setPicQuickMove = function(data) {
   this._picEffect.needRefresh = true;
   const mode = Number(data.mode);
   if (mode == -1  || this._picEffect.quickMove.times <= 0) {this.clearQuickMove();return};	
   this._picEffect.quickMove.mode = mode;
   this._picEffect.quickMove.x = 0;
   this._picEffect.quickMove.y = 0;
   this._picEffect.quickMove.range = 0;
   this._picEffect.quickMove.rangeMax = Math.min(Math.max(Number(data.range),10),600);
   this._picEffect.quickMove.phase = 0;
   this._picEffect.quickMove.speed = Math.min(Math.max(Number(data.speed),1),100);
   this._picEffect.quickMove.times = Math.min(Math.max(Number(data.times),1),9999999);
};	

//==============================
// * updatePicQuickMove
//==============================
Game_Picture.prototype.updatePicQuickMove = function() {
   if (this._picEffect.quickMove.phase == 0) {
	   this._picEffect.quickMove.range += this._picEffect.quickMove.speed;
	   if (this._picEffect.quickMove.range >= this._picEffect.quickMove.rangeMax) {
		   this._picEffect.quickMove.range = this._picEffect.quickMove.rangeMax;
		   this._picEffect.quickMove.phase = 1;
	   };
   } else {
	   this._picEffect.quickMove.range -= this._picEffect.quickMove.speed;
	   if (this._picEffect.quickMove.range <= 0) {
		   this._picEffect.quickMove.range = 0;
		   this._picEffect.quickMove.phase = 0;
		   this._picEffect.quickMove.times--;
		   if ( this._picEffect.quickMove.times <= 0) {this.clearQuickMove()};		   
	   };	   
   };
   if (this._picEffect.quickMove.mode == 0) {	
       this._picEffect.quickMove.y = -this._picEffect.quickMove.range;
   } else if (this._picEffect.quickMove.mode == 1) {
	   this._picEffect.quickMove.x = -this._picEffect.quickMove.range;
   } else if (this._picEffect.quickMove.mode == 2) {
	   this._picEffect.quickMove.x = this._picEffect.quickMove.range;
   } else if (this._picEffect.quickMove.mode == 3) {
	   this._picEffect.quickMove.y = this._picEffect.quickMove.range;
   };
};

//==============================
// * setPicQuickZoom
//==============================
Game_Picture.prototype.setPicQuickZoom = function(data) {
   this._picEffect.needRefresh = true;
   const mode = Number(data.mode);	
   if (mode == -1 || this._picEffect.quickZoom.times <= 0) {this.clearQuickZoom();return};
   this._picEffect.quickZoom.mode = mode;
   this._picEffect.quickZoom.scaleX = 0;
   this._picEffect.quickZoom.scaleY = 0;
   this._picEffect.quickZoom.range = 0;
   this._picEffect.quickZoom.rangeMax = 0.10;	
   this._picEffect.quickZoom.phase = 0;
   const speed = Math.min(Math.max(Number(data.speed),10),500);
   this._picEffect.quickZoom.speed = 0.005 * speed / 100;
   this._picEffect.quickZoom.times = Math.min(Math.max(Number(data.times),1),9999999);
};		

//==============================
// * get Zoom Move
//==============================
Game_Picture.prototype.getQuickZoom = function(mode) {
	if (mode == "Zoom Out & In") {return 0;
	} else if (mode == "Zoom In") {return 1;
	} else if (mode == "Zoom Out") {return 2;
    }
	return -1;
}; 		

//==============================
// * updatePicQuickZoom
//==============================
Game_Picture.prototype.updatePicQuickZoom = function() {
   if (this._picEffect.quickZoom.phase == 0) {
	   this._picEffect.quickZoom.range += this._picEffect.quickZoom.speed;
	   if (this._picEffect.quickZoom.range >= this._picEffect.quickZoom.rangeMax) {
		   this._picEffect.quickZoom.range = this._picEffect.quickZoom.rangeMax;
		   this._picEffect.quickZoom.phase = 1;
	   };
   } else {
	   this._picEffect.quickZoom.range -= this._picEffect.quickZoom.speed;
	   if (this._picEffect.quickZoom.range <= 0) {
		   this._picEffect.quickZoom.range = 0;
		   this._picEffect.quickZoom.phase = 0;
		   this._picEffect.quickZoom.times--;
		   if ( this._picEffect.quickZoom.times <= 0) {this.clearQuickZoom()};		   
	   };	   
   };
   if (this._picEffect.quickZoom.mode == 0) {	
       this._picEffect.quickZoom.scaleX = this._scaleX < 0 ? this._picEffect.quickZoom.range : -this._picEffect.quickZoom.range;
	   this._picEffect.quickZoom.scaleY = this._picEffect.quickZoom.range;
   } else if (this._picEffect.quickZoom.mode == 1) {
	   this._picEffect.quickZoom.scaleX = this._scaleX < 0 ? this._picEffect.quickZoom.range : -this._picEffect.quickZoom.range;
	   this._picEffect.quickZoom.scaleY = -this._picEffect.quickZoom.range;
   } else if (this._picEffect.quickZoom.mode == 2) {
	   this._picEffect.quickZoom.scaleX = this._scaleX < 0 ? -this._picEffect.quickZoom.range : this._picEffect.quickZoom.range;
	   this._picEffect.quickZoom.scaleY = this._picEffect.quickZoom.range;
   };
};	
	
//==============================
// * setPicCharMode
//==============================
Game_Picture.prototype.setPicCharMode = function(data) {
   this._picEffect.needRefresh = true;
   this.clearFlipEffect();
   this.clearAnimatedEffect();
   this._picEffect.charMode.enabled = true;
   this._picEffect.charMode.blinkinterval = Math.min(Math.max(Number(data.blinkInterval),60),999);
   this._picEffect.charMode.interval = Math.randomInt(this._picEffect.charMode.blinkinterval);
   this._picEffect.charMode.index = 0;
   this._picEffect.charMode.nextIndex = 2;	
   this._picEffect.charMode.speed = 0;
   this._picEffect.charMode.speaking = false;
   this._picEffect.charMode.speakingNow = String(data.speaking) == "true" ? true : false;
};

//==============================
// * update Pic Char Mode
//==============================
Sprite_Picture.prototype.updatePicCharMode = function(picture) {
   if (picture._picEffect.charMode.speaking != picture.isPicSpeaking()) {
	   if (picture._picEffect.charMode.speaking && !picture.isPicSpeaking()) {
		   picture._picEffect.charMode.interval = Math.randomInt(picture._picEffect.charMode.blinkinterval) + 60;
		   picture._picEffect.charMode.nextIndex = 0;
		   this.refreshPicFrame(picture,picture._picEffect.charMode.nextIndex);
	   };
 	   picture._picEffect.charMode.speaking = picture.isPicSpeaking();
   };
   if (!picture.isPicSpeaking()) {	
       if (picture._picEffect.charMode.interval > 0) {picture._picEffect.charMode.interval--;return};
   };
   picture._picEffect.charMode.speed++;
   if (picture._picEffect.charMode.speed > 10) {
	   picture._picEffect.charMode.speed = 0;
	   this.refreshPicFrame(picture,picture._picEffect.charMode.nextIndex);
	   if (picture.isPicSpeaking()) {	
	       picture._picEffect.charMode.nextIndex = picture._picEffect.charMode.nextIndex == 0 ? 1 : 0;
	   } else {
		   picture._picEffect.charMode.nextIndex = picture._picEffect.charMode.nextIndex == 0 ? 2 : 0;
		   if (picture._picEffect.charMode.nextIndex == 2) {
		       picture._picEffect.charMode.interval = Math.randomInt(picture._picEffect.charMode.blinkinterval) + picture._picEffect.charMode.blinkinterval;
		   };
	   };
   };
   picture._picEffect.charMode.speaking = picture.isPicSpeaking();
};		

//==============================
// * setPicShakeEffect
//==============================
Game_Picture.prototype.setPicShakeEffect = function(data) {
   var mode = Number(data.mode);
   this._picEffect.needRefresh = true;
   if (mode == -1 || Number(data.duration) <= 0) {this.clearShakeEffect();return}
   this._picEffect.shakeEffect.mode = mode;
   this._picEffect.shakeEffect.duration = Math.min(Math.max(Number(data.duration),20),9999999);
   this._picEffect.shakeEffect.range = 0;
   this._picEffect.shakeEffect.rangeMax = Math.min(Math.max(Number(data.power),4),300);
   this._picEffect.shakeEffect.speed1 = 60;
   this._picEffect.shakeEffect.speed2 = Math.min(Math.max(Number(data.speed),1),7) * 5;
   if (this._picEffect.shakeEffect.speed2 > 30) {this._picEffect.shakeEffect.speed2 = 60}
   this._picEffect.shakeEffect.interval = 60;
   this._picEffect.shakeEffect.x = 0;
   this._picEffect.shakeEffect.y = 0;		
};
	
//==============================
// * updatePicShaking
//==============================
Game_Picture.prototype.updatePicShaking = function() {
   this._picEffect.shakeEffect.speed1 += this._picEffect.shakeEffect.speed2;
   const sRange = (this._picEffect.shakeEffect.rangeMax / 2);	
   if (this._picEffect.shakeEffect.speed1 >= this._picEffect.shakeEffect.interval) {
	   this._picEffect.shakeEffect.speed1 = 0;
	   this._picEffect.shakeEffect.range = Math.randomInt(this._picEffect.shakeEffect.rangeMax);
	   if (this._picEffect.shakeEffect.mode == 0) {
		  this._picEffect.shakeEffect.y = -sRange + this._picEffect.shakeEffect.range;
	   } else if (this._picEffect.shakeEffect.mode == 1) {
		  this._picEffect.shakeEffect.x = -sRange + this._picEffect.shakeEffect.range;
	   } else {
		  this._picEffect.shakeEffect.x = -sRange + this._picEffect.shakeEffect.range;
		  this._picEffect.shakeEffect.range = Math.randomInt(this._picEffect.shakeEffect.rangeMax); 
		  this._picEffect.shakeEffect.y = -sRange + this._picEffect.shakeEffect.range;
	   };	   
   };
   this._picEffect.shakeEffect.duration--;
   if (this._picEffect.shakeEffect.duration == 0) {this.clearShakeEffect()};
};
	
//==============================
// * setPicBreathEffect
//==============================
Game_Picture.prototype.setPicBreathEffect = function(data) {
   this._picEffect.needRefresh = true;
   var power = Number(data.power);
   var mode = Math.min(Math.max(data.mode,-1),2);
   if (mode == -1) {this.clearBreathEffect();return};
   this.clearFlipEffect();	
   this._picEffect.breathEffect.mode = mode;
   this._picEffect.breathEffect.phase = 0;
   this._picEffect.breathEffect.duration = 0;
   this._picEffect.breathEffect.rangeMax = 0.00050 * power / 100;;
   var sp = Number(Math.randomInt(20) * (0.00001).toFixed(5));
   this._picEffect.breathEffect.range = Number(sp);
   var sp = Number(Math.randomInt(20) * 0.0000001).toFixed(7);
   this._picEffect.breathEffect.speed = (0.0000150 + Number(sp)) * power / 100;
   this._picEffect.breathEffect.scale = 0.000000;
};

//==============================
// * get Breath Mode
//==============================
Game_Picture.prototype.getBreathMode = function(mode) {
	if (mode == "Vertical") {return 0;
	} else if (mode == "Horizontal") {return 1
	} else if (mode == "Vertical & Horizontal") {return 2;
    }
	return -1;
}; 	
	
//==============================
// * updatePicBreath
//==============================
Game_Picture.prototype.updatePicBreath = function() {
	  if (this._picEffect.breathEffect.phase == 0) {
		  this._picEffect.breathEffect.range -= this._picEffect.breathEffect.speed;
	      if (this._picEffect.breathEffect.range <= -this._picEffect.breathEffect.rangeMax) {
			  this._picEffect.breathEffect.range = -this._picEffect.breathEffect.rangeMax;
			  this._picEffect.breathEffect.phase = 1;
		  };
	  } else {
		  this._picEffect.breathEffect.range += this._picEffect.breathEffect.speed;
		  if (this._picEffect.breathEffect.range >= this._picEffect.breathEffect.rangeMax) {
			  this._picEffect.breathEffect.range = this._picEffect.breathEffect.rangeMax;
			  this._picEffect.breathEffect.phase = 0;
		   };
	  };
	  this._picEffect.breathEffect.scale -= this._picEffect.breathEffect.range;
	  if (this._picEffect.breathEffect.mode == 0) {
	      this._picEffect.breathEffect.scaleY = this._picEffect.breathEffect.scale;	
	  } else if (this._picEffect.breathEffect.mode == 1) {
		  this._picEffect.breathEffect.scaleX = this._scaleX > 0 ? -this._picEffect.breathEffect.scale : this._picEffect.breathEffect.scale;
	  } else {
		  this._picEffect.breathEffect.scaleY = this._picEffect.breathEffect.scale;
		  this._picEffect.breathEffect.scaleX = this._scaleX > 0 ? -this._picEffect.breathEffect.scale : this._picEffect.breathEffect.scale;
	  };
};
	
//==============================
// * setPicFloatEffect
//==============================
Game_Picture.prototype.setPicFloatEffect = function(data) {
   this._picEffect.needRefresh = true;	
   var power = Number(data.power);
   var mode = Number(data.mode);
   if (mode == -1) {this.clearFloatEffect();return};
   this._picEffect.floatEffect.mode = mode;
   this._picEffect.floatEffect.phase = 0;
   this._picEffect.floatEffect.duration = 0;
   this._picEffect.floatEffect.rangeMax = 1.5 * power / 100;;
   var sp = Number(Math.randomInt(10) * 0.01) ;
   this._picEffect.floatEffect.range = Number(sp);
   var sp = Number(Math.randomInt(20) * 0.001).toFixed(3);
   this._picEffect.floatEffect.speed = (0.05 + Number(sp)) * power / 100;
   this._picEffect.floatEffect.y_Real = 0.0;
   this._picEffect.floatEffect.x = 0;
   this._picEffect.floatEffect.y = 0;
};	

//==============================
// * updatePicFloat
//==============================
Game_Picture.prototype.updatePicFloat = function() {
	  if (this._picEffect.floatEffect.phase == 0) {
		  this._picEffect.floatEffect.range -= this._picEffect.floatEffect.speed;
	      if (this._picEffect.floatEffect.range <= -this._picEffect.floatEffect.rangeMax) {
			  this._picEffect.floatEffect.range = -this._picEffect.floatEffect.rangeMax;
			  this._picEffect.floatEffect.phase = 1;
		  };
	  } else {
		  this._picEffect.floatEffect.range += this._picEffect.floatEffect.speed;
		  if (this._picEffect.floatEffect.range >= this._picEffect.floatEffect.rangeMax) {
			  this._picEffect.floatEffect.range = this._picEffect.floatEffect.rangeMax;
			  this._picEffect.floatEffect.phase = 0;
		   };
	  };
	  this._picEffect.floatEffect.y_Real -= this._picEffect.floatEffect.range;
	  this._picEffect.floatEffect.y = -this._picEffect.floatEffect.y_Real;	
	  if (this._picEffect.floatEffect.mode == 1) {
		  this._picEffect.floatEffect.x = -this._picEffect.floatEffect.y_Real;	
	  } else if (this._picEffect.floatEffect.mode == 2) {
		  this._picEffect.floatEffect.x = this._picEffect.floatEffect.y_Real;	  
	  };		  
};

//==============================
// * setFlipEffect
//==============================
Game_Picture.prototype.setPicFlipEffect = function(data) {
   this._picEffect.needRefresh = true;
   var mode = Number(data.mode);	
   if (mode == -1 || this.isPicCharMode()) {this.clearFlipEffect();return};
   this._picEffect.flipEffect.mode = mode;	
   this.clearBreathEffect();
   this._picEffect.flipEffect.skip = false;
   this._picEffect.flipEffect.loop = String(data.loop) == "true" ? true : false;
   this._picEffect.flipEffect.twoFaces.enabled = String(data.twoFaces) == "true" ? true : false;
   this._picEffect.flipEffect.twoFaces.index = 0;
   this._picEffect.flipEffect.twoFaces.needRefresh = false;	
   this._picEffect.flipEffect.twoFaces.phase1 = 0;
   this._picEffect.flipEffect.twoFaces.phase2 = 0;   
   if (this.isPicTwoFaces()) {this.clearAnimatedEffect()};
   this._picEffect.flipEffect.speed = 0.01 * Number(data.speed) / 100;
   this._picEffect.flipEffect.scale = 0;	
   this._picEffect.flipEffect.scaleX = 0;
   this._picEffect.flipEffect.scaleY = 0;
};

//==============================
// * pic Flip Sides
//==============================
Game_Picture.prototype.picflipSides = function() {
   this._picEffect.flipEffect.twoFaces.needRefresh = true;
   this._picEffect.flipEffect.twoFaces.index++;	
   if (this._picEffect.flipEffect.twoFaces.index > 1) {this._picEffect.flipEffect.twoFaces.index = 0};
};

//==============================
// * need Pic Flip Sides
//==============================
Game_Picture.prototype.needPicflipSides = function() {
	if (this._picEffect.flipEffect.twoFaces.phase1 == this._picEffect.flipEffect.twoFaces.phase2) {return false};
	return true;
};
	
//==============================
// * need Pic Flip Sides
//==============================
Game_Picture.prototype.updateFlipeSides = function() {
   this._picEffect.flipEffect.twoFaces.phase1 = this._picEffect.flipEffect.scale > -1.00 ? 0 : 1;
   if (this.needPicflipSides()) {this.picflipSides()};	
   this._picEffect.flipEffect.twoFaces.phase2 = this._picEffect.flipEffect.twoFaces.phase1;
};
	
//==============================
// * updatePicflip
//==============================
Game_Picture.prototype.updatePicflip = function() {
   if (this._picEffect.flipEffect.skip) {return};
   if (this._picEffect.flipEffect.phase == 0) {
	   this._picEffect.flipEffect.scale -= this._picEffect.flipEffect.speed;
	   if (this._picEffect.flipEffect.scale <= -2.00) { 
	       this._picEffect.flipEffect.scale = -2.00;
		   this._picEffect.flipEffect.phase = 1;
		   if (!this._picEffect.flipEffect.loop) {this._picEffect.flipEffect.skip = true};
	   };
   } else {
	  this._picEffect.flipEffect.scale += this._picEffect.flipEffect.speed; 
	   if (this._picEffect.flipEffect.scale >= 0.00) { 
	       this._picEffect.flipEffect.scale = 0.00;
		   this._picEffect.flipEffect.phase = 0;		  
	   };	  
   };
   if (this._picEffect.flipEffect.mode == 0) {
       this._picEffect.flipEffect.scaleY = this._picEffect.flipEffect.scale;
   } else if (this._picEffect.flipEffect.mode == 1) {
	   this._picEffect.flipEffect.scaleX = this._picEffect.flipEffect.scale;
   } else {
	   this._picEffect.flipEffect.scaleY = this._picEffect.flipEffect.scale;
	   this._picEffect.flipEffect.scaleX = this._picEffect.flipEffect.scale;
   };
   if (this.isPicTwoFaces()) {this.updateFlipeSides()};
};
	
//==============================
// * setPicFadeEffect
//==============================
Game_Picture.prototype.setPicFadeEffect = function(data) {
   this._picEffect.needRefresh = true;
   const mode = Number(data.mode);
   if (mode == -1) {this.clearFadeEffect();return};
   this._picEffect.fadeEffect.mode = mode;
   this._picEffect.fadeEffect.phase = 1;	
   this._picEffect.fadeEffect.inteval = 0;
   this._picEffect.fadeEffect.intevalMax = Math.min(Math.max(Number(data.interval),10),1000);
   this._picEffect.fadeEffect.rangeMax = 255;
   this._picEffect.fadeEffect.repeatTimes = 0;
   this._picEffect.fadeEffect.range = 0;	
   this._picEffect.fadeEffect.speed = Math.min(Math.max(Number(data.speed),1),50);
   this._picEffect.fadeEffect.opacity = 0;
   if (this._picEffect.fadeEffect.mode == 1) {
       this._picEffect.fadeEffect.repeatTimes = 1;
       this._picEffect.fadeEffect.speed = 50;
	   if (this._picEffect.fadeEffect.intevalMax < 30) {
           this._picEffect.fadeEffect.intevalMax = 30;
	   };
	   this._picEffect.fadeEffect.opacity = -255;
	   this._picEffect.fadeEffect.inteval = this._picEffect.fadeEffect.intevalMax;
   };
};	
	
//==============================
// * updatePicFade
//==============================
Game_Picture.prototype.updatePicFade = function() {
	if (this._picEffect.fadeEffect.inteval > 0) {this._picEffect.fadeEffect.inteval--;return};
	if (this._picEffect.fadeEffect.phase == 0) {
	    this._picEffect.fadeEffect.range -= this._picEffect.fadeEffect.speed;
	    if (this._picEffect.fadeEffect.range <= 0) {
		    this._picEffect.fadeEffect.range = 0;
			this._picEffect.fadeEffect.phase = 1;
			if (this._picEffect.fadeEffect.mode == 0) {
			    this._picEffect.fadeEffect.inteval = this._picEffect.fadeEffect.intevalMax;
			};
		};
	} else {
		this._picEffect.fadeEffect.range += this._picEffect.fadeEffect.speed;
		if (this._picEffect.fadeEffect.range >= this._picEffect.fadeEffect.rangeMax) {
		    this._picEffect.fadeEffect.range = this._picEffect.fadeEffect.rangeMax;
			this._picEffect.fadeEffect.phase = 0;
			if (this._picEffect.fadeEffect.mode == 0) {
			    this._picEffect.fadeEffect.inteval = this._picEffect.fadeEffect.intevalMax;
			} else if (this._picEffect.fadeEffect.repeatTimes > 0) {
				this._picEffect.fadeEffect.repeatTimes--;
				if (this._picEffect.fadeEffect.repeatTimes == 0) {
					this._picEffect.fadeEffect.repeatTimes = Math.randomInt(3) + 1;
					const interv = this._picEffect.fadeEffect.intevalMax + Math.randomInt(this._picEffect.fadeEffect.intevalMax / 2);
					this._picEffect.fadeEffect.inteval = interv;
				}												
			}			
	     };
	};
	this._picEffect.fadeEffect.opacity = -this._picEffect.fadeEffect.range;
};	

//==============================
// * setPicAnimatedEffect
//==============================
Game_Picture.prototype.setPicAnimatedEffect = function(data) {
   if (this.isPicCharMode()) {return};
   this._picEffect.needRefresh = true;
   this._picEffect.animatedEffect.enabled = true;
   this._picEffect.animatedEffect.frameIndex = 0;
   this._picEffect.animatedEffect.frameMax = Math.min(Math.max(Number(data.frames),1),100);
   this._picEffect.animatedEffect.speedReal = 5 * Math.min(Math.max(Number(data.speed),1),7);   
   if (this._picEffect.animatedEffect.speedReal > 30) {this._picEffect.animatedEffect.speedReal = 61};
   this._picEffect.animatedEffect.speed = this._picEffect.animatedEffect.speedReal + 1; 	
   this._picEffect.animatedEffect.interval = 60;		
};
	
//==============================
// * updatePicBind
//==============================
Game_Picture.prototype.updatePicBind = function(data) {
	if (!$gameParty.inBattle()) {
     	this._picEffect.bindEffect.x_offset = -$gameMap.displayX() * $gameMap.tileWidth();
        this._picEffect.bindEffect.y_offset = -$gameMap.displayY() * $gameMap.tileHeight();
	} else {
     	this._picEffect.bindEffect.x_offset = 0;
        this._picEffect.bindEffect.y_offset = 0;	
	};
};
	
//==============================
// * update Picture Effects
//==============================
Game_Picture.prototype.updatePictureEffects = function() {
    if (this.picIsFlip()) {
	    this.updatePicflip();
    } else if (this.picIsBreathing()) {
	    this.updatePicBreath();
    };
	if (this.picIsFloating()) {this.updatePicFloat()};
	if (this.picIsShaking()) {this.updatePicShaking()};
	if (this.picIsFading()) {this.updatePicFade()};
	if (this.isPicSwing()) {this.updatePicSwing()};
	if (this.picIsQuickMove()) {this.updatePicQuickMove()};
	if (this.picIsQuickZoom()) {this.updatePicQuickZoom()};
	if (this.picIsBind()) {
		this.updatePicBind()
	} else {
     	this._picEffect.bindEffect.x_offset = 0;
        this._picEffect.bindEffect.y_offset = 0;		
	};
	if (this.picIsCollapsing()) {this.updatePicCollapse()};
	if (this.picIsCameraMode()){this.updatePicCamera()}
};

//==============================
// * Update
//==============================
const _mog_picEffects_game_picture = Game_Picture.prototype.update;
Game_Picture.prototype.update = function() {
      _mog_picEffects_game_picture.call(this);
	  this.updatePictureEffects();
};
	
//=============================================================================
// ■■■ Sprite Picture ■■■
//=============================================================================

//==============================
// ♦ ALIAS ♦  Initialize
//==============================	
const _mog_picEffects_sprite_picture_initialize = Sprite_Picture.prototype.initialize;
Sprite_Picture.prototype.initialize = function(pictureId) {
	  _mog_picEffects_sprite_picture_initialize.call(this,pictureId);
	  this._picAnimated = false;
};
	
//==============================
// * redataPicEffect
//==============================
Sprite_Picture.prototype.redataPicEffect = function(picture) {
	  if (picture.picIsFlip()) {
		  if (picture._picEffect.flipEffect.mode == 0) {
			  this.scale.y = 1.00;
		  } else if (picture._picEffect.flipEffect.mode == 1) {
			  this.scale.x = 1.00;
		  } else {
			  this.scale.x = 1.00;
			  this.scale.y = 1.00;
		  };	  
	  };
	  if (picture.picIsFading()) {this.opacity = 255};
};
		
//==============================
// * update Picture Effects
//==============================
Sprite_Picture.prototype.updatePictureEffects = function(picture) {
	this.redataPicEffect(picture);
	this.x += picture.picEffectX();
	this.y += picture.picEffectY();
	this.scale.x += picture.picEffectScaleX();
	this.scale.y += picture.picEffectScaleY();
    this.opacity += picture.picEffectOpacity();
    this.rotation += picture.picEffectRotation();	
    if (picture.picIsFlip()) {
	   this.updatepicFlip(picture);
    } else if (picture.picIsBreathing()) {
	   this.updatepicBreathing(picture);
	} else if (picture.picIsQuickZoom()) {
		this.updatePicQuickZoom(picture)
    };
	if (picture.isPicCharMode()) {this.updatePicCharMode(picture) 
    } else if (picture.picIsAnimated()) {this.updatePicAnimated(picture)};
	if (picture.picIsCollapsing()) {this.updatePicCollapse(picture)};
	if (picture._picEffect.ignoreWave) {this.updateIgnoreWave(picture)};
};
	
//==============================
// * updateIgnoreWave
//==============================
Sprite_Picture.prototype.updateIgnoreWave = function(picture) {	
	this.x -= $gameScreen._picEffect.wave.x;
	this.y -= $gameScreen._picEffect.wave.y;
};
	
//==============================
// * updatePicQuickZoom
//==============================
Sprite_Picture.prototype.updatePicQuickZoom = function(picture) {
    this.anchor.y = 1;
	this.anchor.x = 0.5;    
	if (this.scale.x > 0) {
   		this.x += this._picData.cw / 2;
	} else {
	    this.x -= this._picData.cw / 2;
	}
	this.y += this._picData.ch;
};
	
//==============================
// * updatepicFlip
//==============================
Sprite_Picture.prototype.updatepicFlip = function(picture) {
	const cw = this._picData.cw / 2;
	const ch = this._picData.ch / 2;
	if (picture._picEffect.flipEffect.mode == 0) {
		this.anchor.y = 0.5;
		this.y += ch;
	} else if (picture._picEffect.flipEffect.mode == 1) {
		this.anchor.x = 0.5;
		this.x += picture._scaleX > 0 ? cw : -cw;
	} else {
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;
		this.x += picture._scaleX > 0 ? cw : -cw;
		this.y += ch;
	};
	if (picture._picEffect.flipEffect.twoFaces.needRefresh) {
		picture._picEffect.flipEffect.twoFaces.needRefresh = false;
		this.refreshPicFrame(picture,picture._picEffect.flipEffect.twoFaces.index);
	};
};
	
//==============================
// * updatepicBreathing
//==============================
Sprite_Picture.prototype.updatepicBreathing = function(picture) {
    this.anchor.y = 1;
    this.y += this._picData.ch;
	if (picture._picEffect.breathEffect.mode > 0) {
		this.anchor.x = 0.5;
		if (this.scale.x > 0) {
    		this.x += this._picData.cw / 2;
		} else {
		    this.x -= this._picData.cw / 2;
		}
	};
};

//==============================
// * updatePicAnimated
//==============================
Sprite_Picture.prototype.updatePicAnimated = function(picture) {
   picture._picEffect.animatedEffect.speed += picture._picEffect.animatedEffect.speedReal;
   if (picture._picEffect.animatedEffect.speed >= picture._picEffect.animatedEffect.interval) {
	   picture._picEffect.animatedEffect.speed = 0;
	   picture._picEffect.animatedEffect.frameIndex++;
	   if (picture._picEffect.animatedEffect.frameIndex >= picture._picEffect.animatedEffect.frameMax) {
		   picture._picEffect.animatedEffect.frameIndex = 0;		   
	   };
	   this.refreshPicFrame(picture,picture._picEffect.animatedEffect.frameIndex);  
   };
};

//==============================
// * updatePicCollapse
//==============================
Sprite_Picture.prototype.updatePicCollapse = function(picture) {
	if (picture._picEffect.collapse.mode == 0) {
		if (picture._picEffect.collapse.frameY < this._picData.ch) {
			const speed = (this._picData.ch / picture._picEffect.collapse.speed2) * picture._picEffect.collapse.speed1 / 100;
			picture._picEffect.collapse.range = speed;
			picture._picEffect.collapse.frameY += picture._picEffect.collapse.range;  
			if (picture._picEffect.breathEffect.mode >= 0) {
	    		this.setFrame(0,-picture._picEffect.collapse.frameY,this._picData.cw,this._picData.ch);
		    	this.y -= picture._picEffect.collapse.frameY;
			} else {
	    		this.setFrame(0,picture._picEffect.collapse.frameY,this._picData.cw,this._picData.ch);
		    	if (this.anchor.y == 0.5) {
				    this.y += picture._picEffect.collapse.frameY / 2;
				} else { 
				    this.y += picture._picEffect.collapse.frameY;
				};				
			};
			picture._picEffect.collapse.opacity -= (255 / this._picData.ch) * picture._picEffect.collapse.speed1 / 100;
		} else {
		    picture._picEffect.collapse.opacity = -255; 	
		};
		if (picture._picEffect.breathEffect.mode >= 0) {this.updatepicBreathing(picture)};
	};
	if (picture._picEffect.collapse.mode > 0) {
		this.anchor.y = 1;
		this.y += this._picData.ch;
		this.anchor.x = 0.5;
		if (this.scale.x > 0) {
			this.x += this._picData.cw / 2;
		} else {
			this.x -= this._picData.cw / 2;
		};
	};
	this.blendMode = picture._picEffect.collapse.blendMode;
};	
	
//==============================
// * refreshPicFrame
//==============================
Sprite_Picture.prototype.refreshPicFrame = function(picture,index) {
	 const x = index * this._picData.cw;
     this.setFrame(x,0,this._picData.cw,this._picData.ch);
};	
	
//==============================
// * setPicEffectData
//==============================
Sprite_Picture.prototype.setPicEffectData = function(picture) {
     picture._picEffect.needRefresh = false;
     this._picData = {};
	 this._picData.ch = this.bitmap.height;
     this._picAnimated = picture.picIsAnimated();
	 if (picture.isPicCharMode()) {
		 this._picData.cw = this.bitmap.width / 3;
     } else if (picture.isPicTwoFaces()) {
	 	 this._picData.cw = this.bitmap.width / 2;
	 } else {
         this._picData.cw = picture.picIsAnimated() ? this.bitmap.width / picture._picEffect.animatedEffect.frameMax : this.bitmap.width;		 
     };
     this.refreshPicFrame(picture,0);
};

//==============================
// * needRefreshData
//==============================
Sprite_Picture.prototype.needRefreshData = function(picture) {
   if (!this.bitmap) {return false};
   if (!this.bitmap.isReady()) {return false};
   if (picture._picEffect.needRefresh) {return true};
   if (this._picAnimated != picture.picIsAnimated()) {return true};
   if (this._picData) {return false};
   return true;
};

//==============================
// * clear Pic Data
//==============================
Sprite_Picture.prototype.clearPicData = function() {
   this._picData = null;
};	
	
//==============================
// ♦ ALIAS ♦  Update
//==============================
const _mog_picEffects_sprite_picture_update = Sprite_Picture.prototype.update;
Sprite_Picture.prototype.update = function() {
   _mog_picEffects_sprite_picture_update.call(this);
   const pic = this.picture();
   if (pic) {
      if (this.needRefreshData(pic)) {this.setPicEffectData(pic)}; 
      if (this.visible && this._picData) {this.updatePictureEffects(pic)};
   } else {
	  if (this._picData) {this.clearPicData()};
   };
};
	
})();