/*=============================================================================
 * CTB Timers MZ
 * By CT_Bolt
 * CTB_TimersMZ.js
 * Version: 1.30
 * Updated: 05/14/2022
 * Author: http://ctbolt.itch.io
 * Terms of Use:
 *   Must purchase a licence to use.
 *   No filesharing permited unless prior agreement made with author.
 *   Any game/app may use this and modify as needed for his or her project.
 *   Redistribution of source code or code directly derived from this source is strickly NOT permitted.
 *   Usable in commercial and non commercial use in projects.
 *   Projects distributed to the public are strongly preferred to have some form of encyption, this is to prevent accidentally leaking the source to the public.
 *
 *  Copyright [2020] [N. Giem] (Aka. CT_Bolt)
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
/*=============================================================================*/

//=============================================================================

/*~struct~CTBTimer:
 *
 * @param ---Preset Timer---
 * @text Timer Settings
 *
 * @param Seconds
 * @text Seconds
 * @parent ---Preset Timer---
 * @desc The default amount of seconds for the timer.
 * Default: 60
 * @default 60
 *
 * @param Expires
 * @text Expires
 * @parent ---Preset Timer---
 * @desc Whether or not the timer will expire
 * Default: true
 * @default true
 *
 * @param Visible
 * @text Visible
 * @parent ---Preset Timer---
 * @desc Whether or not the timer is visible
 * Default: true
 * @default true
 *
 * @param Pre-Script
 * @text Pre-Script
 * @parent ---Preset Timer---
 * @desc Script that is executed when the timer starts
 * Default: null
 * @default null
 *
 * @param Visible In Battle
 * @text Visible In Battle
 * @parent ---Preset Timer---
 * @desc Whether or not the timer is visible during battle
 * Default: true
 * @default true
 *
 * @param Working In Battle
 * @text Working In Battle
 * @parent ---Preset Timer---
 * @desc Whether or not the timer is working during battle
 * Default: true
 * @default true
 *
 * @param Follow In Battle
 * @text Follow In Battle
 * @parent ---Preset Timer---
 * @desc Whether or not the timer is follows battlers during battle
 * Default: true
 * @default true
 *
 * @param Speed
 * @text Speed
 * @parent ---Preset Timer---
 * @desc The speed of the timer (FPS)
 * Default: 60
 * @default 60
 *
 * @param Direction
 * @text Direction
 * @parent ---Preset Timer---
 * @desc The direction the timer will count. (Up/Down)
 * Default: -1
 * @default -1
 *
 * @param Max Seconds
 * @text Max Seconds
 * @parent ---Preset Timer---
 * @desc Number of seconds displayed before restarting the display. Note: Only effects the number displayed.
 * Default: 60
 * @default 60
 *
 * @param characterMode
 * @text Timer Mode
 * @parent ---Preset Timer---
 * @desc Type of Timer
 * (1 is event based, 2 uses extra timers)
 * @type select
 * @option Event Based
 * @value 1
 * @option Extra Timer System
 * @value 2
 * @default 2
 *
 * @param tagFromTimerOnlyOnce
 * @text Only Once via Notetag
 * @parent ---Preset Timer---
 * @desc Only use a Notetag Once
 * @type boolean
 * @on One time Use
 * @off Always Use
 * @default true
 *
 * @param ---Text Settings---
 * @text Text
 *
 * @param Text Prefix
 * @text Text Prefix
 * @parent ---Text Settings---
 * @desc Text Prefix
 * Default:
 * @default
 *
 * @param Text Suffix
 * @text Text Suffix
 * @parent ---Text Settings---
 * @desc Text Suffix
 * Default:
 * @default
 *
 * @param ---Font---
 * @text Font
 *
 * @param Font Face
 * @text Font Face
 * @parent ---Font---
 * @desc Font Face
 * Default: GameFont
 * @default GameFont
 *
 * @param Font Size
 * @text Font Size
 * @parent ---Font---
 * @desc Font Size
 * Default: 32
 * @default 32
 *
 * @param Font Italic
 * @text Font Italic
 * @parent ---Font---
 * @desc Font Italic
 * @type string
 * @default
 *
 * @param Text Color
 * @text Text Color
 * @parent ---Font---
 * @desc Text Color
 * Default: #ff0000
 * @default #ff0000
 *
 * @param Text Outline Color
 * @text Text Outline Color
 * @parent ---Font---
 * @desc Text Outline Color
 * Default: rgba(0, 0, 0, .8)
 * @default rgba(0, 0, 0, .8)
 *
 * @param Text Outline Width
 * @text Text Outline Width
 * @parent ---Font---
 * @desc Text Outline Width
 * Default: 4
 * @default 4
 *
 * @param Text Visible
 * @text Text Visible
 * @parent ---Font---
 * @desc Text Visible
 * Default: true
 * @default true
 *
 * @param ---Gauge---
 * @text Gauge
 *
 * @param Gauge
 * @text Use Gauge?
 * @parent ---Gauge---
 * @desc Use Gauge? (Note: Leave blank to disable)
 * Default:
 * @default
 *
 * @param Gauge Color A
 * @text Gauge Color 1
 * @parent ---Gauge---
 * @desc Gauge Color 1
 * Default: rgba(0,0,0,1)
 * @default rgba(0,0,0,1)
 *
 * @param Gauge Color B
 * @text Gauge Color 2
 * @parent ---Gauge---
 * @desc Gauge Color 2
 * Default: rgba(255,255,255,1)
 * @default rgba(255,255,255,1)
 *
 * @param Gauge Outline Color
 * @text Gauge Outline Color
 * @parent ---Gauge---
 * @desc Gauge Outline Color
 * Default: rgba(0,0,0,1)
 * @default rgba(0,0,0,1)
 *
 * @param Gauge X
 * @text Gauge X
 * @parent ---Gauge---
 * @desc Gauge X
 * Default: 0
 * @default 0
 *
 * @param Gauge Y
 * @text Gauge Y
 * @parent ---Gauge---
 * @desc Gauge Y
 * Default: 0
 * @default 0
 *
 * @param Gauge Width
 * @text Gauge Width
 * @parent ---Gauge---
 * @desc Gauge Width
 * Default: 48
 * @default 48
 *
 * @param Gauge Height
 * @text Gauge Height
 * @parent ---Gauge---
 * @desc Gauge Height
 * Default: 8
 * @default 8
 *
 * @param Gauge Text On Top
 * @text Text On Top
 * @parent ---Gauge---
 * @desc Text On Top
 * Default: true
 * @default true
 *
 * @param ---Gauge Images---
 * @text Gauge Images
 * @parent ---Gauge---
 *
 * @param Gauge Top Image
 * @type file
 * @text Gauge Top Image
 * @parent ---Gauge Images---
 * @desc Gauge Top Image
 * Default:
 * @default
 *
 * @param Gauge Bottom Image
 * @type file
 * @text Gauge Bottom Image
 * @parent ---Gauge Images---
 * @desc Gauge Bottom Image
 * Default:
 * @default
 *
 * @param ---Location & Size---
 * @text Location & Size
 *
 * @param X
 * @text X
 * @parent ---Location & Size---
 * @desc X
 * Default: Graphics.width - this.bitmap.width
 * @default Graphics.width - this.bitmap.width
 *
 * @param Y
 * @text Y
 * @parent ---Location & Size---
 * @desc Y
 * Default: 0
 * @default 0
 *
 * @param Width
 * @text Width
 * @parent ---Location & Size---
 * @desc Width
 * Default: 96
 * @default 96
 *
 * @param Height
 * @text Height
 * @parent ---Location & Size---
 * @desc Height
 * Default: 48
 * @default 48
 *
 * @param Screen Locked
 * @text Screen Locked
 * @parent ---Location & Size---
 * @desc Timer locked to screen? (fixed position)
 * Note: Leave blank to disable screen lock.
 * Default: true
 * @default true
 *
 * @param ---Expire Settings---
 * @text Expire Settings
 *
 * @param Common Event ID
 * @text Common Event ID
 * @parent ---Expire Settings---
 * @desc Common Event ID that is executed when the timer expires
 * Default: null
 * @default null
 *
 * @param Switch ID
 * @text Switch ID
 * @parent ---Expire Settings---
 * @desc Switch ID that is toggled or switched on/off when the timer expires
 * Default: null
 * @default null
 *
 * @param Switch Mode
 * @text Switch Mode
 * @parent ---Expire Settings---
 * @desc Switch Modes: 0 = OFF, 1 = ON, 2 = TOGGLE
 * Default: 2
 * @default 2
 *
 * @param Self Switch ID
 * @text Self Switch ID
 * @parent ---Expire Settings---
 * @desc Self Switch ID that is toggled when the timer expires
 * Default: null
 * @default null
 *
 * @param Self Switch Map ID
 * @text Self Switch Map ID
 * @parent ---Expire Settings---
 * @desc Self Switch Map ID
 * Default: null
 * @default null
 *
 * @param Self Switch Event ID
 * @text Self Switch Event ID
 * @parent ---Expire Settings---
 * @desc Self Switch Event ID
 * Default: null
 * @default null
 *
 * @param Self Switch Mode
 * @text Self Switch Mode
 * @parent ---Expire Settings---
 * @desc Self Switch Modes: 0 = OFF, 1 = ON, 2 = TOGGLE
 * Default: 2
 * @default 2
 *
 * @param Abort Battle
 * @text Abort Battle
 * @parent ---Expire Settings---
 * @desc Whether or not to abort battle. (Leave blank to not abort)
 * Default:
 * @default
 *
 * @param Script
 * @text Script
 * @parent ---Expire Settings---
 * @desc Script that is executed when the timer expires
 * Default: null
 * @default null
 *
 * @param ---Interval Settings---
 * @text Interval Settings
 *
 * @param Interval Amount
 * @text Interval Amount
 * @parent ---Interval Settings---
 * @desc Interval Amount for executing a common event or script every 'n' amount of seconds
 * Default: null
 * @default null
 *
 * @param Interval Common Event ID
 * @text Common Event ID
 * @parent ---Interval Settings---
 * @desc Common Event ID that is executed at the set interval
 * Default: null
 * @default null
 *
 * @param Interval Script
 * @text Script
 * @parent ---Interval Settings---
 * @desc Script that is executed at the set interval
 * Default: null
 * @default null
 *
 * @param ---Text Mode---
 * @text Text Mode
 *
 * @param Mode
 * @text Mode
 * @parent ---Text Mode---
 * @desc 1 = 00:00, 2 = Text Code Offset, 3 = Random Text Array,
 4 = Seconds Only, 5 = Text Array, 6 = Real Time, 7 = 00/60, 8 = Script
 * Default: 1
 * @default 1                      
 *
 * @param Text Code Offset
 * @text Text Code Offset
 * @parent ---Text Mode---
 * @desc Text Code Offset
 * Default: 122
 * @default null
 *
 * @param Text Array
 * @text Text Array
 * @parent ---Text Mode---
 * @desc Text Array
 * @type string[]
 * @default ["1","2","3","4"]
 *
 * @param Text Script
 * @text Text Script
 * @parent ---Text Mode---
 * @desc Script Call to be Displayed
 * @type string
 * @default
 *
 * @param Script When Text Change
 * @text Script When Text Change
 * @parent ---Text Mode---
 * @desc Script Call to be Excecuted When Text Changes
 * @type string
 * @default
 *
 * @param ---Images---
 * @text Images
 *
 * @param Top Image
 * @type file
 * @text Top Image
 * @parent ---Images---
 * @desc Top Image
 * Default:
 * @default
 *
 * @param Bottom Image
 * @type file
 * @text Bottom Image
 * @parent ---Images---
 * @desc Bottom Image
 * Default:
 * @default
 *
 */

/*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 1] [Version 1.30] [CT_Bolt - Timer System]
 * @author CT_Bolt
 * @url https://ct-bolt.itch.io/
 *
 * @param ---Main Settings---
 * @text Main Settings
 *
 * @param Timers
 * @text Timers
 * @parent ---Main Settings---
 * @type struct<CTBTimer>[]
 * @desc A list of timers
 * Default:
 * @default
 *
 * @param Extra Timers
 * @text Extra Timers
 * @parent ---Main Settings---
 * @desc The number of extra timers to be allowed.
 This is in addition to the event & player timers.
 * Default: 10
 * @default 10
 *
 * @help
 *
 * CT_Bolt's Timers
 * Version 1.30
 * CT_Bolt
 *
 * ***************** Description **********************
 * An extremely customizable timer system.
 *
 * ****************** How to Use **********************
 * For the following script calls...
 *     if eventId < 1 the player's timer will be used if mode is not 2.
 *     if eventId > 0 the event's timer will be used if mode is not 2.
 *     if mode is 2 then "extra" timers will be used.
 *
 * Script Calls:
 *        startTimer(settings) // settings is an object that can contain many various options. see below.
 *        changeTimer(eventId, settings, mode) // if mode is used and set to 2 this will change an "extra" timer.
 *        pauseTimer(eventId, toggle, mode) // set toggle to true to toggle paused
 *        unpauseTimer(eventId, mode) // unpause the timer, if mode set to 2 this will change an "extra" timer.
 *        stopTimer(eventId, mode) // if mode set to 2 this will change an "extra" timer.
 *
 *        Example:
 *        startTimer({timerId: 1, eventId: 0, seconds: 60, commonEventId: 1, switchId: 1, switchMode: 2, selfSwitchId: 'A', selfSwitchMode: 2, selfSwitchMapId: 1, selfSwitchEventId: 1, script: $gameVariables.setValue($gameVariables.value(1)+1), intervalScript: script: $gameVariables.setValue($gameVariables.value(1)+1), intervalCommonEventId: 2, interval: 10, font: 'verdana', fontSize: 12, fontItalic: false, textColor: 'rgba(0, 255, 0, 255)', textOutlineColor: 'rgba(0, 255, 0, 255)', textOutlineWidth: 4, textVisible: false, useGauge: true, gaugeColorA: 'rgba(0, 0, 255, 255)', gaugeColorB: 'rgba(255, 0, 0, 255)', gaugeX: 0, gaugeY: 0, gaugeWidth: 28, gaugeHeight: 14, gaugeOutlineColor: 'rgba(0, 0, 0, 0)', gaugeTextOnTop: true, gaugeTopImage: 'gauge_top', gaugeBottomImage: 'gauge_top', x: 0, y: 0, width: 96, height: 48, screenLocked: false, expires: true, textPrefix: "Time: [", textSuffix: "]", visible: true, speed: 60, maxSeconds: 60, direction: -1, textMode: 1, textCodeOffset: 64, textArray: ['A', 'B', 'C', 'D'], topImage: 'timer_top', bottomImage: 'timer_bottom'});
 *        This starts a timer using "player" timer and uses timerId #1 setting as a base, then adds a bunch of other manual(override) settings.
 *
 *        startTimer({timerId: 2, eventId: 1, mode: 2});
 *        This starts a timer using the first "extra" timer and uses timerId #2 setting from the plugin parameters set in the plugin manager.
 *        Note the use of mode 2 which tells this to use an "extra" timer.
 *
 *        changeTimer(18, {timerId: 5, seconds: 60})
 *        This will change the timer of EventID #18 to the preset timerId #5 setting from the plugin parameters set in the plugin manager.
 *        This also overrides the amount of seconds to 60
 *
 *        changeTimer(2, {timerId: 3}, 2)
 *        This will change the second "extra" timer to the preset timerId #3 setting from the plugin parameters set in the plugin manager.
 *        Note the use of mode 2 which tells this to use an "extra" timer.
 *
 *        Property Definitions:
 *                timerId: Number
 *                Preset Timer ID, these are set using Plugin Parameters
 *
 *                eventId: Number
 *                Event ID, the Event ID of an event on the current map
 *
 *                seconds: Number
 *                Number of Seconds
 *
 *                commonEventId: Number
 *                Common Event ID that is executed when the timer expires
 *
 *                switchId: Number
 *                Switch ID that is toggled when the timer expires
 *
 *                switchMode: Number
 *                Switch Mode, 0 = Off, 1 = On, 2 = Toggle
 *
 *                selfSwitchId: String
 *                Self Switch ID that is toggled when the timer expires
 *
 *                selfSwitchMode: Number
 *                Self Switch Mode, 0 = Off, 1 = On, 2 = Toggle
 *
 *                selfSwitchMapId: Number
 *                Self Switch Map ID
 *
 *                selfSwitchEventId: Number
 *                Self Switch Event ID
 *
 *                script: String
 *                Script that is executed when the timer expires
 *
 *                intervalScript: String
 *                Script that is executed at the set interval
 *
 *                intervalCommonEventId: String
 *                Common Event ID that is executed at the set interval
 *
 *                interval: Number
 *                Interval amount
 *
 *                font: String
 *                fontSize: Number
 *                fontItalic: Boolean
 *                textColor: String
 *                textOutlineColor: String
 *                textOutlineWidth: Number
 *                textVisible: Boolean
 *                useGauge: Boolean
 *                gaugeColorA: String
 *                gaugeColorB: String
 *                gaugeX: Number
 *                gaugeY: Number
 *                gaugeWidth: Number
 *                gaugeHeight: Number
 *                gaugeOutlineColor: String
 *                gaugeTextOnTop: Boolean
 *                gaugeTopImage: String
 *                gaugeBottomImage: String
 *                x: Number
 *                y: Number
 *                width: Number
 *                height: Number
 *                screenLocked: Boolean
 *                expires: Boolean
 *                textPrefix: String
 *                textSuffix: String
 *                visible: Boolean
 *                visibleInBattle: Boolean
 *                workingInBattle: Boolean
 *                allowFollowInBattle: Boolean
 *                speed: Number
 *                maxSeconds: Number
 *                direction: Number
 *
 *                textMode: Number
 *                1 = 00:00, 2 = Text Code Offset, 3 = Random Text Array, 4 = Seconds Only, 5 = Text Array, 6 = Real Time, 7 = 00/60, 8 = Script
 *
 *                textCodeOffset: Number
 *                textArray: Array
 *                textScript: String
 *                topImage: String
 *                bottomImage: String
 *
 * Note/Comments Tags:
 *  Place the following Note-Tags/Comments in Events to Setup Timers that automatically run everytime the map is loaded.
 *   Use ,, to seperate the timer Properties (or seperate with new line)
 *   Page Comments Take Priority Over Notebox
 *
 * The format is similar to the script calls above, and is not case sensitive. Also javascript can be used.
 *   Examples:
 *     Timer ID: 5,, TextColor: 'rgba(255,255,0,255)',, Seconds: 25,, FontSize: 22,, CommonEventId: 23
 *     This will start a timer when the page is activated using TimerId #5 and then manually(override) a few other settings.
 *
 *     Stop Timer
 *     This will stop the timer
 *
 * History Log:
 *   v1.00 Initial Release (05/14/2022)
 *   v1.30 Updates/Bugfixes (03/12/2023)
 *
 * Terms of Use:
 *   No filesharing permited unless prior agreement made with author.
 *   Any game/app may use this and modify as needed for his or her project.
 *   Redistribution of source code or code directly derived from this source is strickly NOT permitted.
 *   Usable in commercial and non commercial use in projects.
 *   Projects distributed to the public are strongly preferred to have some form of encyption, this is to prevent accidentally leaking the source to the public.
 *
 *  Copyright [2020] [N. Giem] (Aka. CT_Bolt)
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

//=============================================================================
// String (paddingLeft)
//=============================================================================
String.prototype.paddingLeft = function (paddingValue) {
   return String(paddingValue + this).slice(-paddingValue.length);
};
//=============================================================================
//=============================================================================

var CTB = CTB || {}; CTB.TimersMZ  = CTB.TimersMZ || {};
var Imported = Imported || {}; Imported["CT_Bolt Timers MZ"] = 1.30;

var $_$ = CTB.TimersMZ;

//"use strict";
//(($_$) => {
    const NAMESPACE   = 'TimersMZ';
    const PLUGIN_NAME = 'CTB_' + NAMESPACE;
	
	//=============================================================================
	// Parameter Variables
	//=============================================================================
	function getPluginParameters() {var a = document.currentScript || (function() { var b = document.getElementsByTagName('script'); return b[b.length - 1]; })(); return PluginManager.parameters(a.src.substring((a.src.lastIndexOf('/') + 1), a.src.indexOf('.js')));} $_$.params = getPluginParameters();

CTB.Param = CTB.Param || {};
CTB.Param.presetTimer = [];

CTB.Param.mainSettings = CTB.Param.mainSettings || {};
CTB.Param.mainSettings.extraTimers = eval(String($_$.params['Extra Timers'])) || 10;

CTB.TimerMZsettings = CTB.TimerMZsettings || {};
CTB.TimerMZsettings.timers = JSON.parse($_$.params["Timers"]);

// loop to fill up the presetTimer Array
for (var i = 0; i < CTB.TimerMZsettings.timers.length; i++){
  var timer = JSON.parse(CTB.TimerMZsettings.timers[i]);

  // create a presetTimerObject using the parameters
  if (timer){
  var presetTimerObj = {
	characterMode:Number(timer['characterMode'] || 2),
    seconds:String(timer['Seconds'] ||60),
    commonEventId:Number(timer['Common Event ID'] ||null),
    switchId:Number(timer['Switch ID'] ||null),
    switchMode:Number(timer['Switch Mode'] ||null),
    selfSwitchId:String(timer['Self Switch ID'] ||null),
    selfSwitchEventId:String(timer['Self Switch Event ID'] ||null),
    selfSwitchMapId:String(timer['Self Switch Map ID'] ||null),
    selfSwitchMode:Number(timer['Self Switch Mode'] ||null),
    expires:Boolean(timer['Expires'] ||true),
    script:String(timer['Script'] ||""),
    preScript:String(timer['Pre-Script'] ||""),
    abortBattle:String(timer['Abort Battle'] ||""),
    intervalScript:String(timer['Interval Script'] ||""),
    intervalCommonEventId:Number(timer['Interval Common Event ID'] ||""),
    interval:Number(timer['Interval Amount'] ||null),
    font:String(timer['Font Face'] ||'GameFont'),
    fontSize:Number(timer['Font Size'] ||20),
    fontItalic:Boolean(timer['Font Italic'] ||""),
    textColor:String(timer['Text Color'] ||'#ffffff'),
    textOutlineColor:String(timer['Text Outline Color'] ||'rgba(0, 0, 0, .8)'),
    textOutlineWidth:Number(timer['Text Outline Width'] ||4),
    textVisible:String(timer['Text Visible'] ||""),
    useGauge:String(timer['Gauge'] ||''),
    gaugeColorA:String(timer['Gauge Color A'] ||''),
    gaugeColorB:String(timer['Gauge Color B'] ||''),
    gaugeX:String(timer['Gauge X'] ||''),
    gaugeY:String(timer['Gauge Y'] ||''),
    gaugeWidth:String(timer['Gauge Width'] ||''),
    gaugeHeight:String(timer['Gauge Height'] ||''),
    gaugeOutlineColor:String(timer['Gauge Outline Color'] ||''),
    gaugeTextOnTop:String(timer['Gauge Text On Top'] ||''),
    gaugeTopImage:String(timer['Gauge Top Image'] ||''),
    gaugeBottomImage:String(timer['Gauge Bottom Image'] ||''),
    x:String(timer['X'] ||"Graphics.width - this.bitmap.width"),
    y:String(timer['Y'] ||0),
    width:String(timer['Width'] ||96),
    height:String(timer['Height'] ||48),
    screenLocked:String(timer['Screen Locked'] ||""),
    expires:String(timer['Expires'] ||""),
    textPrefix:String(timer['Text Prefix'] ||""),
    textSuffix:String(timer['Text Suffix'] ||""),
    visible:String(timer['Visible'] ||""),
    visibleInBattle:String(timer['Visible In Battle'] ||""),
    workingInBattle:String(timer['Working In Battle'] ||""),
    allowFollowInBattle:String(timer['Follow In Battle'] ||""),
    speed:String(timer['Speed'] ||""),
    maxSeconds:String(timer['Max Seconds'] ||""),
    direction:String(timer['Direction'] ||""),
    textMode:Number(timer['Mode'] ||1),
    textCodeOffset:Number(timer['Text Code Offset'] ||122),
    textArray:String(timer['Text Array'] ||""),
    textScript:String(timer['Text Script'] ||""),
    scriptWhenTextChanged:String(timer['Script When Text Change'] ||""),
    topImage:String(timer['Top Image'] ||''),
    bottomImage:String(timer['Bottom Image'] ||'')

  };
  }

  // add the presetTimerObject to the presetTimer Array
  CTB.Param.presetTimer.push(presetTimerObj);
}
//=============================================================================
//=============================================================================

//=============================================================================
// Text Array NEW
//=============================================================================
function textArray(){
  return ["CT_Bolt's", "Timer System", "for", "RPGMakerMV"];
}
//=============================================================================
//=============================================================================

//=============================================================================
// startTimer (settings) NEW
//=============================================================================
$_$.startTimer = function(settings){
  settings = settings || {};
  if (typeof settings === 'number'){settings={timerId:settings};}
  var timerId = settings.timerId || null;
  var eventId = settings.eventId || 0;
  if (settings.seconds || (timerId && (timerId > 0))){
       timerId = timerId || 1; // Default to 1 if only given seconds

        var seconds = settings.seconds || CTB.Param.presetTimer[timerId-1].seconds;

		//console.log(CTB.Param.presetTimer[timerId-1]);
		//settings.mode = settings.mode || 2;
		//console.log(settings.mode)

        startEventTimerAt(
                          eval(eventId),  // Event ID
                          eval(seconds),  // Seconds
                // ********** Switch Args ********** //
                {
                      commonEventId:settings.commonEventId     || CTB.Param.presetTimer[timerId-1].commonEventId,     // Common Event ID that is executed when the timer expires
                                 id:settings.switchId          || CTB.Param.presetTimer[timerId-1].switchId,          // Switch ID that is toggled when the timer expires
                               mode:settings.switchMode        || CTB.Param.presetTimer[timerId-1].switchMode,        // Switch Mode
                       selfSwitchId:settings.selfSwitchId      || CTB.Param.presetTimer[timerId-1].selfSwitchId,      // Self Switch ID that is toggled when the timer expires
                     selfSwitchMode:settings.selfSwitchMode    || CTB.Param.presetTimer[timerId-1].selfSwitchMode,    // Self Switch Mode
                    selfSwitchMapId:settings.selfSwitchMapId   || CTB.Param.presetTimer[timerId-1].selfSwitchMapId,   // Self Switch Map ID
                  selfSwitchEventId:settings.selfSwitchEventId || CTB.Param.presetTimer[timerId-1].selfSwitchEventId, // Self Switch Event ID
                           abortBattle:settings.abortBattle       || CTB.Param.presetTimer[timerId-1].abortBattle,       // Whether or not to abort battle when timer expires
                             script:settings.script            || CTB.Param.presetTimer[timerId-1].script,            // Script that is executed when the timer expires
                      runAtInterval:{         // Execute the following at a set interval
                                             script:settings.intervalScript        || CTB.Param.presetTimer[timerId-1].intervalScript,        // Script that is executed at the set interval
                                      commonEventId:settings.intervalCommonEventId || CTB.Param.presetTimer[timerId-1].intervalCommonEventId, // Common Event ID that is executed at the set interval
                                           interval:settings.interval              || CTB.Param.presetTimer[timerId-1].interval,             // Interval amount
                                    }
                },
                // ********************************* //

                // *********** Font Args *********** //
                {
                  fontFace:settings.font                     || CTB.Param.presetTimer[timerId-1].font,
                  fontSize:settings.fontSize                 || CTB.Param.presetTimer[timerId-1].fontSize,
                  fontItalic:settings.fontItalic             || CTB.Param.presetTimer[timerId-1].fontItalic,
                  textColor:settings.textColor               || CTB.Param.presetTimer[timerId-1].textColor,
                  textOutlineColor:settings.textOutlineColor || CTB.Param.presetTimer[timerId-1].textOutlineColor,
                  textOutlineWidth:settings.textOutlineWidth || CTB.Param.presetTimer[timerId-1].textOutlineWidth,
                  textVisible:settings.textVisible           || CTB.Param.presetTimer[timerId-1].textVisible
                 },
                // ********************************* //

                // *********** Gauge Args *********** //
                {
                  useGauge:settings.useGauge                 || CTB.Param.presetTimer[timerId-1].useGauge,
                  gaugeColorA:settings.gaugeColorA           || CTB.Param.presetTimer[timerId-1].gaugeColorA,
                  gaugeColorB:settings.gaugeColorB           || CTB.Param.presetTimer[timerId-1].gaugeColorB,
                  gaugeX:settings.gaugeX                     || CTB.Param.presetTimer[timerId-1].gaugeX,
                  gaugeY:settings.gaugeY                     || CTB.Param.presetTimer[timerId-1].gaugeY,
                  gaugeWidth:settings.gaugeWidth             || CTB.Param.presetTimer[timerId-1].gaugeWidth,
                  gaugeHeight:settings.gaugeHeight           || CTB.Param.presetTimer[timerId-1].gaugeHeight,
                  outlineColor:settings.gaugeOutlineColor    || CTB.Param.presetTimer[timerId-1].gaugeOutlineColor,
                  textOnTop:settings.gaugeTextOnTop          || CTB.Param.presetTimer[timerId-1].gaugeTextOnTop,
                  topImage:settings.gaugeTopImage            || CTB.Param.presetTimer[timerId-1].gaugeTopImage,
                  bottomImage:settings.gaugeBottomImage      || CTB.Param.presetTimer[timerId-1].gaugeBottomImage
                 },
                // ********************************* //

                // ********* Location Args ********* //
                {
                  x:settings.x                       || CTB.Param.presetTimer[timerId-1].x,
                  y:settings.y                       || CTB.Param.presetTimer[timerId-1].y,
                  width:settings.width               || CTB.Param.presetTimer[timerId-1].width,
                  height:settings.height             || CTB.Param.presetTimer[timerId-1].height,
                  screenLocked:settings.screenLocked || CTB.Param.presetTimer[timerId-1].screenLocked
                 },
                // ********************************* //

				
				
                // ********** Misc. Args *********** //
                {
                  mode:settings.mode                 || CTB.Param.presetTimer[timerId-1].characterMode,
                  expires:settings.expires                 || CTB.Param.presetTimer[timerId-1].expires,
                  textPrefix:settings.textPrefix           || CTB.Param.presetTimer[timerId-1].textPrefix,
                  textSuffix:settings.textSuffix           || CTB.Param.presetTimer[timerId-1].textSuffix,
                  visible:settings.visible                 || CTB.Param.presetTimer[timerId-1].visible,
                  visibleInBattle:settings.visibleInBattle || CTB.Param.presetTimer[timerId-1].visibleInBattle,
                  workingInBattle:settings.workingInBattle || CTB.Param.presetTimer[timerId-1].workingInBattle,
                  allowFollowInBattle:settings.allowFollowInBattle || CTB.Param.presetTimer[timerId-1].allowFollowInBattle,
                  speed:settings.speed                     || CTB.Param.presetTimer[timerId-1].speed,
                  maxSeconds:settings.maxSeconds           || CTB.Param.presetTimer[timerId-1].maxSeconds,
                  direction:settings.direction             || CTB.Param.presetTimer[timerId-1].direction,
                  textMode:settings.textMode               || CTB.Param.presetTimer[timerId-1].textMode,
                  textCodeOffset:settings.textCodeOffset   || CTB.Param.presetTimer[timerId-1].textCodeOffset,
                  textArray:settings.textArray             || CTB.Param.presetTimer[timerId-1].textArray,
                  textScript:settings.textScript           || CTB.Param.presetTimer[timerId-1].textScript,
                  scriptWhenTextChanged:settings.scriptWhenTextChanged || CTB.Param.presetTimer[timerId-1].scriptWhenTextChanged,
                  preScript:settings.preScript             || CTB.Param.presetTimer[timerId-1].preScript,
                  topImage:settings.topImage               || CTB.Param.presetTimer[timerId-1].topImage,
                  bottomImage:settings.bottomImage         || CTB.Param.presetTimer[timerId-1].bottomImage
                  }
                  // ********************************* //
        );
        if (!SceneManager._scene._mapLoaded){BattleManager.checkFollowInBattle();}
  }
}
//=============================================================================
//=============================================================================

//=============================================================================
// changeTimer (Event ID, Settings) NEW
//=============================================================================
function changeTimer(eventId, settings, mode){
    settings = settings || {};
    var character = null;

    if (mode === 2){
		eval(eventId) > 0 ? character = $gameMultiPlayer[eval(eventId)-1] : character = $gameMultiPlayer[0];
	}else{
		eval(eventId) > 0 ? character = $gameMap.event(eval(eventId)) : character = $gamePlayer;
	}
    if (character){

      // preset timer settings
      timerId = settings.timerId;
      if  (timerId){
        if (timerId > 0){

          // ********** Switch Args ********** //
          character._switchArgs = character._switchArgs || {};
          character._timerSwitchId = CTB.Param.presetTimer[timerId-1].switchId;
          character._switchArgs.id = CTB.Param.presetTimer[timerId-1].switchId;

          character._timerSwitchMode = CTB.Param.presetTimer[timerId-1].switchMode;
          character._switchArgs.mode = CTB.Param.presetTimer[timerId-1].switchMode;

          character._timerSelfSwitchId = CTB.Param.presetTimer[timerId-1].selfSwitchId;
          character._switchArgs.selfSwitchId = CTB.Param.presetTimer[timerId-1].selfSwitchId;

          character._timerSwitchMode = CTB.Param.presetTimer[timerId-1].selfSwitchMode;
          character._switchArgs.selfSwitchMode = CTB.Param.presetTimer[timerId-1].selfSwitchMode;

          character._timerSelfSwitchMapId = CTB.Param.presetTimer[timerId-1].selfSwitchMapId;
          character._switchArgs.selfSwitchMapId = CTB.Param.presetTimer[timerId-1].selfSwitchMapId;

          character._timerSelfSwitchEventId = CTB.Param.presetTimer[timerId-1].selfSwitchEventId;
          character._switchArgs.selfSwitchEventId = CTB.Param.presetTimer[timerId-1].selfSwitchEventId;

          character._timerScriptOnExpire = CTB.Param.presetTimer[timerId-1].script;
          character._switchArgs.script = CTB.Param.presetTimer[timerId-1].script;

          character._timerAbortBattleOnExpire = CTB.Param.presetTimer[timerId-1].abortBattle;
          character._switchArgs.abortBattle = CTB.Param.presetTimer[timerId-1].abortBattle;

          character._timerCommonEventId = CTB.Param.presetTimer[timerId-1].commonEventId;
          character._switchArgs.commonEventId = CTB.Param.presetTimer[timerId-1].commonEventId;

          character._switchArgs.runAtInterval = character._switchArgs.runAtInterval || {};
          character._switchArgs.runAtInterval.commonEventId = CTB.Param.presetTimer[timerId-1].intervalCommonEventId;
          character._switchArgs.runAtInterval.interval = CTB.Param.presetTimer[timerId-1].interval;
          character._switchArgs.runAtInterval.script = CTB.Param.presetTimer[timerId-1].intervalScript;
          // ********************************* //

          // *********** Font Args *********** //
          character._timerFont.fontFace = CTB.Param.presetTimer[timerId-1].font;
          character._timerFont.fontItalic = CTB.Param.presetTimer[timerId-1].fontItalic;
          character._timerFont.fontSize = CTB.Param.presetTimer[timerId-1].fontSize;
          character._timerFont.textOutlineColor = CTB.Param.presetTimer[timerId-1].textOutlineColor;
          character._timerFont.textOutlineWidth = CTB.Param.presetTimer[timerId-1].textOutlineWidth;
          character._timerFont.textColor = CTB.Param.presetTimer[timerId-1].textColor;
          character._timerFont.textVisible = CTB.Param.presetTimer[timerId-1].textVisible;
          // ********************************* //

          // *********** Gauge Args *********** //
          character._timerGauge.gaugeColorA = CTB.Param.presetTimer[timerId-1].gaugeColorA;
          character._timerGauge.gaugeColorB = CTB.Param.presetTimer[timerId-1].gaugeColorB;
          character._timerGauge.gaugeOutlineColor = CTB.Param.presetTimer[timerId-1].gaugeOutlineColor;
          character._timerGauge.gaugeWidth = CTB.Param.presetTimer[timerId-1].gaugeWidth;
          character._timerGauge.gaugeHeight = CTB.Param.presetTimer[timerId-1].gaugeHeight;
          character._timerGauge.gaugeX = CTB.Param.presetTimer[timerId-1].gaugeX;
          character._timerGauge.gaugeY = CTB.Param.presetTimer[timerId-1].gaugeY;
          character._timerGauge.useGauge = CTB.Param.presetTimer[timerId-1].useGauge;
          character._timerGauge.textOnTop = CTB.Param.presetTimer[timerId-1].gaugeTextOnTop;
          character._timerGauge.topImage = CTB.Param.presetTimer[timerId-1].gaugeTopImage;
          character._timerGauge.bottomImage = CTB.Param.presetTimer[timerId-1].gaugeBottomImage;
          // ********************************* //

          // ********** Misc. Args *********** //
          character._timerMisc.direction = CTB.Param.presetTimer[timerId-1].direction;
          character._gameTimer._direction = CTB.Param.presetTimer[timerId-1].direction;
          character._timerMisc.expires = CTB.Param.presetTimer[timerId-1].expires;
          character._timerMisc.speed = CTB.Param.presetTimer[timerId-1].speed;
          character._timerMisc.textMode = CTB.Param.presetTimer[timerId-1].textMode;
          character._timerMisc.textPrefix = CTB.Param.presetTimer[timerId-1].textPrefix;
          character._timerMisc.textSuffix = CTB.Param.presetTimer[timerId-1].textSuffix;
          character._timerMisc.maxSeconds = CTB.Param.presetTimer[timerId-1].maxSeconds;
          character._timerMisc.visible = CTB.Param.presetTimer[timerId-1].visible;
          character._timerMisc.visibleInBattle = CTB.Param.presetTimer[timerId-1].visibleInBattle;
          character._timerMisc.workingInBattle = CTB.Param.presetTimer[timerId-1].workingInBattle;
          character._timerMisc.allowFollowInBattle = CTB.Param.presetTimer[timerId-1].allowFollowInBattle;
          character._timerMisc.textCodeOffset = CTB.Param.presetTimer[timerId-1].textCodeOffset;
          character._timerMisc.textArray = CTB.Param.presetTimer[timerId-1].textArray;
          character._timerMisc.textScript = CTB.Param.presetTimer[timerId-1].textScript;
          character._timerMisc.scriptWhenTextChanged = CTB.Param.presetTimer[timerId-1].scriptWhenTextChanged;
          character._timerMisc.preScript = CTB.Param.presetTimer[timerId-1].preScript;
          character._timerMisc.topImage = CTB.Param.presetTimer[timerId-1].topImage;
          character._timerMisc.bottomImage = CTB.Param.presetTimer[timerId-1].bottomImage;
          // ********************************* //
          
          // ********* Location Args ********* //
          character._timerPos.height = CTB.Param.presetTimer[timerId-1].height;
          character._timerPos.screenLocked = CTB.Param.presetTimer[timerId-1].screenLocked;
          character._timerPos.width = CTB.Param.presetTimer[timerId-1].width;
          character._timerPos.x = CTB.Param.presetTimer[timerId-1].x;
          character._timerPos.y = CTB.Param.presetTimer[timerId-1].y;
          // ********************************* //
        }
      }

      if (settings.addSeconds){
        if (character._gameTimer._frames < character._gameTimer._maxFrames || settings.force){
          character._gameTimer._frames = character._gameTimer._frames + (settings.addSeconds * character._timerMisc.speed);
        }else{
          character._gameTimer._frames = character._gameTimer._maxFrames - 1;
        }
      }

      if (settings.subtractSeconds){
        if (character._gameTimer._frames - (settings.subtractSeconds * character._timerMisc.speed) > 0) {
         character._gameTimer._frames = character._gameTimer._frames - (settings.subtractSeconds * character._timerMisc.speed);
        }else{
         character._gameTimer._frames = 1;
        }
      }

      // manual settings

      // ********** Switch Args ********** //
      if (settings.switchId){character._timerSwitchId = settings.switchId;}
      if (settings.switchMode){character._timerSwitchMode = settings.switchMode;}
      if (settings.selfSwitchId){character._timerSelfSwitchId = settings.selfSwitchId;}
      if (settings.selfSwitchMode){character._timerSelfSwitchMode = settings.selfSwitchMode;}
      if (settings.selfSwitchEventId){character._timerSelfSwitchEventId = settings.selfSwitchEventId;}
      if (settings.selfSwitchMapId){character._timerSelfSwitchMapId = settings.selfSwitchMapId;}
      if (settings.commonEventId){character._timerCommonEventId = settings.commonEventId;}
      if (settings.abortBattle){character._timerAbortBattleOnExpire = settings.abortBattle;}
      if (settings.script){character._switchArgs.script = settings.script;}
      if (settings.intervalCommonEventId){character._switchArgs.runAtInterval.commonEventId = settings.intervalCommonEventId;}
      if (settings.interval){character._switchArgs.runAtInterval.interval = settings.interval;}
      if (settings.intervalScript){character._switchArgs.runAtInterval.script = settings.intervalScript;}
      // ********************************* //

      // *********** Font Args *********** //
      if (settings.font){character._timerFont.fontFace = settings.font;}
      if (settings.fontItalic){character._timerFont.fontItalic = settings.fontItalic;}
      if (settings.fontSize){character._timerFont.fontSize = settings.fontSize;}
      if (settings.textOutlineColor){character._timerFont.textOutlineColor = settings.textOutlineColor;}
      if (settings.textOutlineWidth){character._timerFont.textOutlineWidth = settings.textOutlineWidth;}
      if (settings.textColor){character._timerFont.textColor = settings.textColor;}
      if (settings.textVisible){character._timerFont.textVisible = settings.textVisible;}
      // ********************************* //

      // *********** Gauge Args *********** //
      if (settings.gaugeColorA){character._timerGauge.gaugeColorA = settings.gaugeColorA;}
      if (settings.gaugeColorB){character._timerGauge.gaugeColorB = settings.gaugeColorB;}
      if (settings.gaugeOutlineColor){character._timerGauge.gaugeOutlineColor = settings.gaugeOutlineColor;}
      if (settings.gaugeWidth){character._timerGauge.gaugeWidth = settings.gaugeWidth;}
      if (settings.gaugeHeight){character._timerGauge.gaugeHeight = settings.gaugeHeight;}
      if (settings.gaugeX){character._timerGauge.gaugeX = settings.gaugeX;}
      if (settings.gaugeY){character._timerGauge.gaugeY = settings.gaugeY;}
      if (settings.useGauge){character._timerGauge.useGauge = settings.useGauge;}
      if (settings.gaugeTextOnTop){character._timerGauge.textOnTop = settings.gaugeTextOnTop;}
      if (settings.gaugeTopImage){character._timerGauge.topImage = settings.gaugeTopImage;}
      if (settings.gaugeBottomImage){character._timerGauge.bottomImage = settings.gaugeBottomImage;}
      // ********************************* //

      // ********** Misc. Args *********** //
      if (settings.direction){character._timerMisc.direction = settings.direction;}
      if (settings.direction){character._gameTimer._direction = settings.direction;}
      if (settings.expires){character._timerMisc.expires = settings.expires;}
      if (settings.speed){character._timerMisc.speed = settings.speed;}
      if (settings.textMode){character._timerMisc.textMode = settings.textMode;}
      if (settings.textPrefix){character._timerMisc.textPrefix = settings.textPrefix;}
      if (settings.textSuffix){character._timerMisc.textSuffix = settings.textSuffix;}
      if (settings.maxSeconds){character._timerMisc.maxSeconds = settings.maxSeconds;}
      if (settings.visible){character._timerMisc.visible = settings.visible;}
      if (settings.visibleInBattle){character._timerMisc.visibleInBattle = settings.visibleInBattle;}
      if (settings.workingInBattle){character._timerMisc.workingInBattle = settings.workingInBattle;}
      if (settings.allowFollowInBattle){character._timerMisc.allowFollowInBattle = settings.allowFollowInBattle;}
      if (settings.textCodeOffset){character._timerMisc.textCodeOffset = settings.textCodeOffset;}
      if (settings.textArray){character._timerMisc.textArray = settings.textArray;}
      if (settings.textScript){character._timerMisc.textScript = settings.textScript;}
      if (settings.scriptWhenTextChanged){character._timerMisc.scriptWhenTextChanged = settings.scriptWhenTextChanged;}      
      if (settings.preScript){character._timerMisc.preScript = settings.preScript;}
      if (settings.topImage){character._timerMisc.topImage = settings.topImage;}
      if (settings.bottomImage){character._timerMisc.bottomImage = settings.bottomImage;}
      // ********************************* //

      // ********* Location Args ********* //
      if (settings.height){character._timerPos.height = settings.height;}
      if (settings.screenLocked){
        character._timerPos.screenLocked = eval(settings.screenLocked);
        if (typeof(settings.screenLocked)==="string"){
          if (settings.screenLocked.toLowerCase() === "false"){character._timerPos.screenLocked = false;}
        }
      }
      if (settings.width){character._timerPos.width = settings.width;}
      if (settings.x){character._timerPos.x = settings.x;}
      if (settings.y){character._timerPos.y = settings.y;}
      // ********************************* //
    }
}
//=============================================================================
//=============================================================================

//=============================================================================
// startEventTimer (Seconds, Switch Args, Timer Font, Timer Pos, Misc) NEW
//=============================================================================
function startEventTimer(seconds, switchArgs, timerFont, timerGauge, timerPos, misc){
  $gameMap.event($gameMap._interpreter._eventId).toggleTimer(true, seconds, switchArgs, timerFont, timerPos, misc);
}
//=============================================================================
//=============================================================================

//=============================================================================
// startEventTimerAt (Event ID, Seconds, Switch Args, Timer Font, Timer Pos, Misc) NEW
//=============================================================================
function startEventTimerAt(eventId, seconds, switchArgs, timerFont, timerGauge, timerPos, misc){
	if (switchArgs){
		if (switchArgs.selfSwitchEventId){
			switchArgs.selfSwitchEventId = switchArgs.selfSwitchEventId.toString().replace('this.', '$gameMap.event(eventId).');
			switchArgs.selfSwitchEventId = eval(switchArgs.selfSwitchEventId);
		};
	};
  if (misc.mode !== 2){
    if (eventId > 0){
      $gameMap.event(eventId).toggleTimer(true, seconds, switchArgs, timerFont, timerGauge, timerPos, misc);
    }else{
      $gamePlayer._eventId = -1;
      $gamePlayer.toggleTimer(true, seconds, switchArgs, timerFont, timerGauge, timerPos, misc);
    }
  }else{
    if (eventId > 0){
     $gameMultiPlayer[eventId-1]._eventId = eventId;
     $gameMultiPlayer[eventId-1].toggleTimer(true, seconds, switchArgs, timerFont, timerGauge, timerPos, misc);
    }
  }
}
//=============================================================================
//=============================================================================

//=============================================================================
// pauseTimer (event ID) NEW
//=============================================================================
function pauseTimer(eventId, toggle, mode){
  var character = null;
  eventId = eventId || -1;

  if (mode === 2){
    eval(eventId) > 0 ? character = $gameMultiPlayer[eval(eventId)] : character = $gameMultiPlayer[0];
  }else{
    eval(eventId) > 0 ? character = $gameMap.event(eval(eventId)) : character = $gamePlayer;
  }

  if (character){
    if (toggle){
      if (!character._gameTimer._paused){
         character._gameTimer._paused=true;
      }else{
         character._gameTimer._paused=false;
      }
    }else{
      character._gameTimer._paused=true;
    }
  }
}
//=============================================================================
//=============================================================================

//=============================================================================
// unpauseTimer (event ID) NEW
//=============================================================================
function unpauseTimer(eventId, mode){
  var character = null;
  eventId = eventId || -1;
  if (mode === 2){
    eval(eventId) > 0 ? character = $gameMultiPlayer[eval(eventId)] : character = $gameMultiPlayer[0];
  }else{
    eval(eventId) > 0 ? character = $gameMap.event(eval(eventId)) : character = $gamePlayer;
  }
  if (character){character._gameTimer._paused=false;}
}
//=============================================================================
//=============================================================================

//=============================================================================
// stopTimer (Event ID) NEW
//=============================================================================
function stopTimer(eventId,mode){
    var character = null;
    var eventId = eventId || -1;
    if (mode === 2){
      if (eventId > 0){character = $gameMultiPlayer[eventId];}else{character = $gameMultiPlayer[0];}
    }else{
      if (eventId > 0){character = $gameMap.event(eventId);}else{character = $gamePlayer;}
    }
    if (character)  {character._gameTimer.stop();}
}
//=============================================================================
//=============================================================================
                                                  
//=============================================================================
// setCommonEvent (Common Event ID) NEW
//=============================================================================
function setCommonEvent(eventId, thisId){
    if (eventId) {
      $gameMap._interpreter._eventId = thisId;
      $gameTemp.reserveCommonEvent(eventId);
    }
}
//=============================================================================
//=============================================================================

//=============================================================================
// setTimedSelfSwitch (Map ID, Event ID, Self Switch ID, Mode) NEW
//=============================================================================
function setTimedSelfSwitch(mapId, eventId, timerSelfSwitchId, timerSelfSwitchMode){
   if (mapId > 0){
     if (eventId > 0){
       if (timerSelfSwitchId){
          var key = [mapId, eventId, timerSelfSwitchId];
          switch(timerSelfSwitchMode) {
          case 0:
               $gameSelfSwitches.setValue(key, false);
               break;
          case 1:
               $gameSelfSwitches.setValue(key, true);
               break;
          case 2:
               if ($gameSelfSwitches.value(key)){
                    $gameSelfSwitches.setValue(key, false);
               }else{
                    $gameSelfSwitches.setValue(key, true);
               }
               break;
          default:
          }
       }
     }
   }
}
//=============================================================================
//=============================================================================

//=============================================================================
// setTimedSwitch (Switch ID, Mode) NEW
//=============================================================================
function setTimedSwitch(timerSwitchId, timerSwitchMode){
   if (timerSwitchId > 0){
      switch(timerSwitchMode) {
      case 0:
           $gameSwitches.setValue(timerSwitchId, false);
           break;
      case 1:
           $gameSwitches.setValue(timerSwitchId, true);
           break;
      case 2:
           if ($gameSwitches.value(timerSwitchId)){
              $gameSwitches.setValue(timerSwitchId, false);
           }else{
                 $gameSwitches.setValue(timerSwitchId, true);
           }
           break;
      default:

      }
   }
}
//=============================================================================
//=============================================================================

//=============================================================================
// Spriteset_Base
//=============================================================================
// Create Player Timer Sprites NEW
Spriteset_Base.prototype.createPlayerTimers = function() {
        this._playerTimerSprite = new Player_Sprite_Timer();
        this.addChild(this._playerTimerSprite);
};

// Create Event Timer Sprites NEW
Spriteset_Base.prototype.createEventTimers = function() {
	/*
    this._eventTimerSprite = [];
    for (var i = 1; i < $gameMap._events.length; i++){
        this._eventTimerSprite.push(new Event_Sprite_Timer(i));
        this.addChild(this._eventTimerSprite[i-1]);
    }
	*/
};

$_$['Spriteset_Base.prototype.initialize'] = Spriteset_Base.prototype.initialize;
Spriteset_Base.prototype.initialize = function() {
	$_$['Spriteset_Base.prototype.initialize'].apply(this, arguments);

    this.createSpawnedEventTimers();

};

// Create Event Timer Sprites NEW
Spriteset_Base.prototype.createSpawnedEventTimers = function() {
    this._eventTimerSprite = this._eventTimerSprite || [];

	//if ($gameMap._spawnedEvents){
		$gameMap.events().forEach(v => {
		//for (var i = 0; i < 2; i++){
			//console.log($gameMap._spawnedEvents[i]._eventId);
			//console.log(v._eventId)
			let s = new Event_Sprite_Timer(v._eventId);
			this._eventTimerSprite.push();
			this.addChild(s);
		},this);
	//};
};

// Create Other Timer Sprites NEW
Spriteset_Base.prototype.createOtherTimers = function() {
    this._otherTimerSprite = [];
    for (var i = 0; i < CTB.Param.mainSettings.extraTimers; i++){
		this.addNewOtherTimer(i+1);
    }
};

Spriteset_Base.prototype.addNewOtherTimer = function(id){
	let sprite = new CTB_Sprite_Timer(id, 2)
	this._otherTimerSprite.push(sprite);
	this.addChild(sprite);
};

// Alias: Create Upper Layer
var ctb_Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
Spriteset_Base.prototype.createUpperLayer = function() {
   ctb_Spriteset_Base_createUpperLayer.call(this);
   this.createEventTimers(); // Create Event Timer Sprites
   this.createPlayerTimers(); // Create Player Timer Sprites
   this.createOtherTimers(); // Create Other Timer Sprites
};
//=============================================================================
//=============================================================================

$_$['Game_CharacterBase.prototype.isSpawnedEvent'] = Game_CharacterBase.prototype.isSpawnedEvent;
Game_CharacterBase.prototype.isSpawnedEvent = function() {
	let v = false;
	if ($_$['Game_CharacterBase.prototype.isSpawnedEvent']){
		v = $_$['Game_CharacterBase.prototype.isSpawnedEvent'].apply(this, arguments);
	};
	return v;
};

//=============================================================================
// CTB_Sprite_Timer (The sprite for displaying the CTB timer) NEW
//=============================================================================
function CTB_Sprite_Timer() {
   this.initialize.apply(this, arguments);
}

CTB_Sprite_Timer.prototype = Object.create(Sprite.prototype);
CTB_Sprite_Timer.prototype.constructor = CTB_Sprite_Timer;

CTB_Sprite_Timer.prototype.initialize = function(eventId, mode) {
    Sprite.prototype.initialize.call(this);
    this._seconds = 0;
    this._eventId = eventId;
    this._mode = mode || 0;
    this._oldX = 0;
    this._oldY = 0;
    this._gaugeMax = 0;
    this._gaugeActual = 0;
    this.createBitmap();
    this.update();
};

CTB_Sprite_Timer.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
	this.updateVisibility();
    this.updatePosition();
    
};

CTB_Sprite_Timer.prototype.createBitmap = function() {
  var eventId = this._eventId;
  var character = null;

  if (this._mode === 2){eval(eventId) > 0 ? character = $gameMultiPlayer[eval(eventId)-1] : character = $gameMultiPlayer[0];}else{eval(eventId) > 0 ? character = $gameMap.event(eval(eventId)) : character = $gamePlayer;}

  if (character){
	  character._timerPos = character._timerPos || {};
      var bitmapWidth = character._timerPos.width ? eval(character._timerPos.width):96;
      var bitmapHeight = character._timerPos.height ? eval(character._timerPos.height):48;

      if (bitmapWidth != this._oldWidth || bitmapHeight != this._oldHeight){
        this.bitmap = new Bitmap(bitmapWidth, bitmapHeight);
        this._oldWidth = this.bitmap.width;
        this._oldHeight = this.bitmap.height;
      }

	  character._timerFont = character._timerFont || {};
      this.bitmap.fontFace = character._timerFont.fontFace ? character._timerFont.fontFace:'GameFont';
      this.bitmap.fontSize = character._timerFont.fontSize ? eval(character._timerFont.fontSize):12;
      this.bitmap.fontItalic = character._timerFont.fontItalic ? eval(character._timerFont.fontItalic):false;
      this.bitmap.textColor = character._timerFont.textColor ? character._timerFont.textColor:'#ffffff';
      this.bitmap.outlineColor = character._timerFont.textOutlineColor;
      this.bitmap.outlineWidth = character._timerFont.textOutlineWidth;

      this._gaugeMax = bitmapWidth;
      this._gaugeActual = bitmapWidth;
  }
};

CTB_Sprite_Timer.prototype.updateBitmap = function() {
  var eventId = this._eventId;
  var character = null;
  if (this._mode === 2){eval(eventId) > 0 ? character = $gameMultiPlayer[eval(eventId)-1] : character = $gameMultiPlayer[0];}else{eval(eventId) > 0 ? character = $gameMap.event(eval(eventId)) : character = $gamePlayer;}
  if (character){
      if (character._gameTimer){
        if (this._seconds !== character._gameTimer.seconds()) {
            this._seconds = character._gameTimer.seconds();
            this.redraw();
        }
      }
  }
};

CTB_Sprite_Timer.prototype.redraw = function() {
  var gauge = this.gauge();
  var eventId = this._eventId;
  var character = null;
  if (this._mode === 2){eval(eventId) > 0 ? character = $gameMultiPlayer[eval(eventId)-1] : character = $gameMultiPlayer[0];}else{eval(eventId) > 0 ? character = $gameMap.event(eval(eventId)) : character = $gamePlayer;}

  this.bitmap.clear();
  this.createBitmap();

  if (character){
    var path = character._timerMisc.topImage.substr(0,character._timerMisc.topImage.lastIndexOf("/")+1);
    var file = character._timerMisc.topImage.substr(character._timerMisc.topImage.lastIndexOf("/")+1);
    if (path && file){
     if (character._timerMisc.topImage != this._topImage_old){
       this._topImage_old = character._timerMisc.topImage;
       this._topImage = ImageManager.loadBitmap(path, file);
     }
    }else{
       this._topImage_old = null;
       this._topImage = null;
    }

    var path = character._timerMisc.bottomImage.substr(0,character._timerMisc.bottomImage.lastIndexOf("/")+1);
    var file = character._timerMisc.bottomImage.substr(character._timerMisc.bottomImage.lastIndexOf("/")+1);
    if (path && file){
     if (character._timerMisc.bottomImage != this._bottomImage_old){
       this._bottomImage_old = character._timerMisc.bottomImage;
       this._bottomImage = ImageManager.loadBitmap(path, file);
     }
    }else{
       this._bottomImage_old = null;
       this._bottomImage = null;
    }
  }

  if (this._bottomImage){this.bitmap.blt(this._bottomImage, 0, 0, this._bottomImage.width, this._bottomImage.height, 0, 0);}

  if (eval(gauge.gaugeInfo.textOnTop)){
    this.drawGauge(gauge); this.drawText();
  }else{
    this.drawText(); this.drawGauge(gauge);
  }

  if (this._topImage){this.bitmap.blt(this._topImage, 0, 0, this._topImage.width, this._topImage.height, 0, 0);}
};


CTB_Sprite_Timer.prototype.drawText = function() {
  var eventId = this._eventId;
  var character = null;
  if (this._mode === 2){eval(eventId) > 0 ? character = $gameMultiPlayer[eval(eventId)-1] : character = $gameMultiPlayer[0];}else{eval(eventId) > 0 ? character = $gameMap.event(eval(eventId)) : character = $gamePlayer;}

  if (character){ var showText = eval(character._timerFont.textVisible); }
  if (showText){
    var text = this.timerText() || "";
    if (text){
      if (text != "undefined"){
        this.bitmap.drawText(text, 0, 0, this.bitmap.width, this.bitmap.height, 'center');
      }
    }
  }
};

CTB_Sprite_Timer.prototype.drawGauge = function(gauge) {
  var eventId = this._eventId;
  var character = null;
  if (this._mode === 2){eval(eventId) > 0 ? character = $gameMultiPlayer[eval(eventId)-1] : character = $gameMultiPlayer[0];}else{eval(eventId) > 0 ? character = $gameMap.event(eval(eventId)) : character = $gamePlayer;}

  if (eval(gauge.gaugeInfo.useGauge)){
    var x = 0;

    if (character){
      x = character._timerGauge.gaugeX;
      this._gaugeMax = character._timerGauge.gaugeWidth;

        var path = character._timerGauge.topImage.substr(0,character._timerGauge.topImage.lastIndexOf("/")+1);
        var file = character._timerGauge.topImage.substr(character._timerGauge.topImage.lastIndexOf("/")+1);
        if (path && file){
         if (character._timerGauge.topImage != this._gaugeTopImage_old){
           this._gaugeTopImage_old = character._timerGauge.topImage;
           this._gaugeTopImage = ImageManager.loadBitmap(path, file);
         }
        }

        var path = character._timerGauge.bottomImage.substr(0,character._timerGauge.bottomImage.lastIndexOf("/")+1);
        var file = character._timerGauge.bottomImage.substr(character._timerGauge.bottomImage.lastIndexOf("/")+1);
        if (path && file){
         if (character._timerGauge.bottomImage != this._gaugeBottomImage_old){
           this._gaugeBottomImage_old = character._timerGauge.bottomImage;
           this._gaugeBottomImage = ImageManager.loadBitmap(path, file);
         }
        }
    }

    this._gaugeActual = (1-((gauge.maxSeconds - gauge.totalSeconds) / gauge.maxSeconds));

//  this._gaugeActual = 1 - this._gaugeActual; // Reverse Direction

    this._gaugeActual = this._gaugeActual * this._gaugeMax;


    // Draw Gauge Top Image
    if (this._gaugeBottomImage){this.bitmap.blt(this._gaugeBottomImage, 0, 0, this._gaugeBottomImage.width, this._gaugeBottomImage.height, 0, 0);}

    // Draw Gauge
    this.bitmap.gradientFillRect(eval(x), gauge.gaugeInfo.gaugeY, this._gaugeActual, gauge.gaugeInfo.gaugeHeight, String(gauge.gaugeInfo.gaugeColorA), String(gauge.gaugeInfo.gaugeColorB), false);

    // Draw Gauge Outline
    this.bitmap.gradientFillRect(eval(x)                               , eval(gauge.gaugeInfo.gaugeY)                                  , this._gaugeMax,               2                  , gauge.gaugeInfo.outlineColor, gauge.gaugeInfo.outlineColor, false); // Top
    this.bitmap.gradientFillRect(eval(x)                               , eval(gauge.gaugeInfo.gaugeY)+eval(gauge.gaugeInfo.gaugeHeight), this._gaugeMax,               2                  , gauge.gaugeInfo.outlineColor, gauge.gaugeInfo.outlineColor, false); // Bottom
    this.bitmap.gradientFillRect(eval(x)                               , eval(gauge.gaugeInfo.gaugeY)                                  ,       2       , eval(gauge.gaugeInfo.gaugeHeight), gauge.gaugeInfo.outlineColor, gauge.gaugeInfo.outlineColor, false); // Left
    this.bitmap.gradientFillRect(Number(eval(x)+eval(this._gaugeMax))-2, eval(gauge.gaugeInfo.gaugeY)                                  ,       2       , eval(gauge.gaugeInfo.gaugeHeight), gauge.gaugeInfo.outlineColor, gauge.gaugeInfo.outlineColor, false); // Right

    // Draw Gauge Top Image
    if (this._gaugeTopImage){this.bitmap.blt(this._gaugeTopImage, 0, 0, this._gaugeTopImage.width, this._gaugeTopImage.height, 0, 0);}
  }
};

CTB_Sprite_Timer.prototype.gauge = function() {
  var eventId = this._eventId;
  var character = null;
  if (this._mode === 2){eval(eventId) > 0 ? character = $gameMultiPlayer[eval(eventId)-1] : character = $gameMultiPlayer[0];}else{eval(eventId) > 0 ? character = $gameMap.event(eval(eventId)) : character = $gamePlayer;}

  if (character){
    var gameTimer = character._gameTimer;
    var gaugeInfo = character._timerGauge;
    maxSeconds = gameTimer._maxFrames / character._timerMisc.speed;
  }

  return {gameTimer:gameTimer,totalSeconds:this._seconds,maxSeconds:maxSeconds,gaugeInfo:gaugeInfo};
}

CTB_Sprite_Timer.prototype.getDate = function(settings){
  var settings = settings || {};
  var secondsInMinute = 60;
  var minutesInHour = 60;
  var secondsInHour = secondsInMinute * minutesInHour;
  var hoursInDay = 24;
  var numberOfDaysInMonth = 30;
  var numberOfMonths = 12;
  var numberOfDaysInYear = numberOfMonths + numberOfDaysInMonth;
  var secondsInDay = hoursInDay * minutesInHour * secondsInMinute;//86400;

  var x = this._seconds;
  var m = secondsInDay * numberOfDaysInMonth;//2592000;
  var y = m * numberOfMonths;//31536000;

  var years = Math.floor(x / y);
  x = x - (years * y);

  var months = Math.floor(x/m);
  x = x - (months * m);

  var days = Math.floor(x/secondsInDay);
  x = x - (days * secondsInDay);

  var hours = Math.floor(x/secondsInHour);
  x = x - (hours * secondsInHour);

  var minutes = Math.floor(x/secondsInMinute);
  x = x - (minutes * secondsInMinute);

  var seconds = x;
//  var dateString = "Years: " + years + " Months: " + months + " Days: " + days;

  var dateString = (months+1) + "/" + (days+1) + "/" + (years+2000) + " Hour: " + hours + " Minutes: " + minutes + " Second: " + seconds;
  
  if (settings.mode === 2){
    return dateString;
  }else if (settings.mode === 3){
	return {years: years, months: months, days: days};
  }else{
	const d = new Date();
	let day = d.getDate();
	let year = d.getFullYear()
	let month = d.getMonth()+1;
    var h2 = d.getHours();
    var h = h2 || 12;
    var m = d.getMinutes();
    var rh = (h>12?h-12:h);
    var am = (h>11?"PM":"AM");
    var am = (!h2?"AM":am);
    txt = rh.padZero(2)+":"+m.padZero(2)+" "+am;
    return month+'/'+day+'/'+year + ' - ' + txt;
  }
}

CTB_Sprite_Timer.prototype.timerText = function() {
  var eventId = this._eventId;
  var character = null;
  if (this._mode === 2){eval(eventId) > 0 ? character = $gameMultiPlayer[eval(eventId)-1] : character = $gameMultiPlayer[0];}else{eval(eventId) > 0 ? character = $gameMap.event(eval(eventId)) : character = $gamePlayer;}

  if (character){
     var textPrefix = '';
     var textSuffix = '';
     var txt = '';
     var txtMode = 1;
     var textCodeOffset = 0;
     var txtArray = [''];
     var maxSeconds = 60;
     var maxTime = 0;
     var textScript = '';

     textPrefix = character._timerMisc.textPrefix;
     textSuffix = character._timerMisc.textSuffix;
     txtMode = eval(character._timerMisc.textMode);
     textCodeOffset = eval(character._timerMisc.textCodeOffset);
     txtArray = eval(character._timerMisc.textArray);
     maxSeconds = character._timerMisc.speed?eval(character._timerMisc.maxSeconds):60;
     maxTime = character._gameTimer._maxFrames/character._timerMisc.speed;
     textScript = character._timerMisc.textScript;

     var min = Math.floor(this._seconds / eval(maxSeconds)) % eval(maxSeconds);
     var sec = this._seconds % eval(maxSeconds);

     if (character._switchArgs){
       if (character._switchArgs.runAtInterval){
         if (character._switchArgs.runAtInterval.interval !== null && character._switchArgs.runAtInterval.interval != 0){

         var timePassed = (character._gameTimer._direction > 0 ? this._seconds : (maxTime-this._seconds));
           // Run At Interval Script/Common Event
           if (this._seconds > 0){
           if (timePassed % eval(character._switchArgs.runAtInterval.interval) === 0){

              eval(character._switchArgs.runAtInterval.script.replace(/<this>/gi, "character"));

              $gameTemp.reserveCommonEvent(eval(character._switchArgs.runAtInterval.commonEventId));

           }
           }

         }
       }
     }

     switch (eval(txtMode)){
     case 1: // 00:00
        txt = min.padZero(2) + ':' + sec.padZero(2);
        break;
     case 2: // A -> B -> C -> D -> ...
        txt = String.fromCharCode(eval(textCodeOffset)-(this._seconds));
        break;
     case 3: //  Random Text Array
        txt = "";
        if (eval(txtArray)){
          if (!character._timerMisc.tempTextArray || character._timerMisc.tempTextArray.length < 1){character._timerMisc.tempTextArray = txtArray;}
          var txtIndex = Math.floor(Math.random() * character._timerMisc.tempTextArray.length) || 0;
          txt = eval(character._timerMisc.tempTextArray[txtIndex]);
          character._timerMisc.tempTextArray.splice(txtIndex,1);
        }else{
          txt = "Error";
        }
        break;
     case 4: // Seconds Only
        txt = (this._seconds).padZero(2);
        break;
     case 5: // Text Array
        if (eval(txtArray)){
          var txtIndex = (this._seconds - 1) % eval(txtArray).length;
          txtArray = eval(txtArray);
          txtIndex = txtIndex || 0;
          txt = eval(txtArray[txtIndex]) || eval(txtArray[0]);
        }else{
          txt = "Error";
        }
        break;
     case 6: // Real Time
        var d = new Date();
        var h2 = d.getHours();
        var h = h2 || 12;
        var m = d.getMinutes();
        var rh = (h>12?h-12:h);
        var am = (h>11?"PM":"AM");
        var am = (!h2?"AM":am);

        txt = rh.padZero(2)+":"+m.padZero(2)+" "+am;
        break;
     case 7: // 00/60
        txt = (this._seconds).padZero(2) + "/" + maxTime;
        break;
     case 8: // Script
        txt = eval(textScript)||"";
        break;
     case 9: // TATA
        if (eval(txtArray)){
          var txtIndex = (this._seconds - 1) % eval(txtArray).length;
          txtArray = eval(txtArray);
          txtIndex = txtIndex || 0;
          txt = (txtArray[txtIndex]) || (txtArray[0]);
        }else{
          txt = "Error";
        }
        break;
     default: // 00:00
        txt = min.padZero(2) + ':' + sec.padZero(2);
     }

     txt = textPrefix + txt;
     txt = txt + textSuffix;

     if (this._oldText !== txt){
        this._oldText = txt;
        eval(character._timerMisc.scriptWhenTextChanged);
     }
   }

   return txt || "";
};

CTB_Sprite_Timer.prototype.updatePosition = function() {
	if (this.visible){
  let eventId = eval(this._eventId);
  var character = null;
  if (this._mode === 2){eventId > 0 ? character = $gameMultiPlayer[eventId-1] : character = $gameMultiPlayer[0];}else{eventId > 0 ? character = $gameMap.event(eventId) : character = $gamePlayer;}

  if (character){
    var x = 0;
    var y = 0;
	
    var evalX = 0;
    var evalY = 0;
	
	let sprite = $gamePlayer._sprite;
	if (character !== $gamePlayer){
		if ($gameMap.event(eventId)) {
			sprite = $gameMap.event(eventId)._sprite;
		}else{
			sprite = character._sprite;
		};
	};
	
	let trueCharacter = $gamePlayer;
	if (character !== $gamePlayer){
		if ($gameMap.event(eventId)) {
			trueCharacter = $gameMap.event(eventId);
		}else{
			trueCharacter = character;
		};
	};
	
	let spriteHeight = 0;
	if (sprite){
		spriteWidth = sprite.width >= 1 ? sprite.width : $gameMap.tileWidth();
		spriteHeight = sprite.height >= 1 ? sprite.height : $gameMap.tileHeight();
	};

    if (character._gameTimer){
      x = ((trueCharacter._realX-($gameMap._displayX))*$gameMap.tileWidth())-(this.bitmap.width/4);
      y = ((trueCharacter._realY-($gameMap._displayY))*$gameMap.tileHeight())-Math.floor($gameMap.tileHeight() * 0.6666666667);
  
      if (character._timerPos){
		  if (character._timerPos.x){
			character._timerPos.x = character._timerPos.x.replace('{sprite}','(sprite.x-(this.bitmap.width/2) || null)');
			character._timerPos.x = character._timerPos.x.replace('{x}','(x || null)');
		  };
		  if (character._timerPos.y){
			  character._timerPos.y = character._timerPos.y.replace('{sprite}','(sprite.y-(this.bitmap.height) || null)');
			  character._timerPos.y = character._timerPos.y.replace('{y}','(y || null)');
			  //console.log(character._timerPos.y);			
		  };
		  //character._timerPos.y.replace('{event}','$gameMap.event(eventId) ? $gameMap.event(eventId)._sprite.x-(this.bitmap.width/2) : null');
		  
        if (character._timerPos.screenLocked){
          if (character._timerPos.x != null){
            if (typeof character._timerPos.x === "string"){
              evalX = eval(character._timerPos.x);
            }else{
              evalX = character._timerPos.x;
            }
          }

          if (character._timerPos.y != null){
            if (typeof character._timerPos.y === "string"){
              evalY = eval(character._timerPos.y);
            }else{
              evalY = character._timerPos.y;
            }
          }

          x = evalX;
          y = evalY;
        }else{
          if (character._timerPos.x != null){
            if (typeof character._timerPos.x === "string"){
              evalX = x+eval(character._timerPos.x);
            }else{
              evalX = x+character._timerPos.x;
            }
          }

          if (character._timerPos.y != null){
            if (typeof character._timerPos.y === "string"){
              evalY = y+eval(character._timerPos.y);
            }else{
              evalY = y+character._timerPos.y;
            }
          }
  
          x = evalX;
          y = evalY;
        }
      }
  
      this._oldX = this.x;
      this._oldY = this.y;

      this.x = x;
      this.y = y;
    }
  }
	};
};

CTB_Sprite_Timer.prototype.updateVisibility = function() {
  var eventId = this._eventId;
  var character = null;
  if (this._mode === 2){eval(eventId) > 0 ? character = $gameMultiPlayer[eval(eventId)-1] : character = $gameMultiPlayer[0];}else{eval(eventId) > 0 ? character = $gameMap.event(eval(eventId)) : character = $gamePlayer;}
  if (character){
	  character._timerMisc = character._timerMisc || {};
	  //character._gameTimer = character._gameTimer || {};
    var evalVisible = character._timerMisc.visible;
    if (typeof evalVisible === "string"){evalVisible = eval(evalVisible);}

  if (character._gameTimer){
	if (!character._gameTimer._startedAt0){
		this.visible = character._gameTimer.isWorking() && evalVisible;
		if ($gameParty.inBattle()){
			
		  this.visible = character._timerMisc.visibleInBattle && character._gameTimer.isWorking() && evalVisible;
		}
	}else{
		this.visible = true;	
	};
  };
  }
};
//=============================================================================
// END: CTB_Sprite_Timer
//=============================================================================

//=============================================================================
// Event_Sprite_Timer (The sprite for displaying the event timer) NEW
//=============================================================================
function Event_Sprite_Timer() {
    this.initialize.apply(this, arguments);
}

Event_Sprite_Timer.prototype = Object.create(CTB_Sprite_Timer.prototype);
Event_Sprite_Timer.prototype.constructor = Event_Sprite_Timer;

Event_Sprite_Timer.prototype.initialize = function(eventId, fontFace) {
    CTB_Sprite_Timer.prototype.initialize.call(this, eventId, fontFace);
};

//=============================================================================
// END: Event_Sprite_Timer
//=============================================================================

//=============================================================================
// Player_Sprite_Timer (The sprite for displaying the player timer) NEW
//=============================================================================
function Player_Sprite_Timer() {
    this.initialize.apply(this, arguments);
}

Player_Sprite_Timer.prototype = Object.create(CTB_Sprite_Timer.prototype);
Player_Sprite_Timer.prototype.constructor = Player_Sprite_Timer;

Player_Sprite_Timer.prototype.initialize = function(eventId, fontFace) {
    CTB_Sprite_Timer.prototype.initialize.call(this, eventId, fontFace);
};
//=============================================================================
// END: Player_Sprite_Timer
//=============================================================================

$_$['Sprite_Character.prototype.setCharacter'] = Sprite_Character.prototype.setCharacter;
Sprite_Character.prototype.setCharacter = function(character) {
	$_$['Sprite_Character.prototype.setCharacter'].apply(this, arguments);
	//character._sprite = this;
	//character._sprite._character = null;
};

//=============================================================================
// Game_Timer (The game object class for the timer) OVERWRITE
//=============================================================================
function Game_Timer() {
    this.initialize.apply(this, arguments);
}

Game_Timer.prototype.initialize = function(eventId) {
    if (!eventId){eventId = -999;}
    this._abortBattle = false;
    this._eventId = eventId;
    this._frames = 0;
    this._direction = null;
    this._maxFrames = -1;
    this._working = false;
    this._visibleAfterExpire = false;
    this._visible = true;
};

Game_Timer.prototype.update = function(sceneActive) {
  if (!this._paused){
    if (this._direction === null){ this._direction = 1;  }
    if (this._direction < 1){
        if (sceneActive && this._working && this._frames > 0) {

            this._frames--;
            if (this._frames <= 0) {
                this.onExpire();
            }
        }
    }else{
        if (sceneActive && this._working) {
            this._frames++;
            if (this._frames >= this._maxFrames && this._frames != 0) {
                this.onExpire();
            }
        }
    }
  }
};

Game_Timer.prototype.start = function(count,direction) {
     if (direction === null){
       direction = 1
     }
    if (direction < 1){
      this._frames = count;
    }else{
      this._frames = 0;
    }
    this._direction = direction?direction:0;
    this._maxFrames = count;
    this._working = true;
    this._paused = false;
	
	if (this._frames === -0){
		this._startedAt0 = true
		this._paused=true;
		this._visibleAfterExpire = true;
	}
};

Game_Timer.prototype.stop = function() {
    this._working = false;
};

Game_Timer.prototype.isWorking = function() {
    return this._working;
};

Game_Timer.prototype.seconds = function() {
   var framesPerSecond = 60;
   var character = null;
   var eventId = this._eventId;
   if (this.mode === 2){eval(eventId) > 0 ? character = $gameMultiPlayer[eval(eventId)-1] : character = $gameMultiPlayer[0];}else{eval(eventId) > 0 ? character = $gameMap.event(eval(eventId)) : character = $gamePlayer;}
   if (character){framesPerSecond = character._timerMisc.speed;}
   return Math.floor(this._frames / framesPerSecond);
};

Game_Timer.prototype.onExpire = function() {
  var eventId = this._eventId;
  var visibleAfterExpire = false;
  var timerSwitchId = 0;
  var timerSwitchMode = 0;
  var timerSelfSwitchId = null;
  var timerSelfSwitchMode = 0;
  var timerSelfSwitchMapId = 0;
  var timerSelfSwitchEventId = null;
  var timerCommonEventId = null;
  var script = null;
  var expires = true;
  var abortBattle = false;
  var character = null;
  
  if (this.mode === 2){eval(eventId) > 0 ? character = $gameMultiPlayer[eval(eventId)-1] : character = $gameMultiPlayer[0];}else{eval(eventId) > 0 ? character = $gameMap.event(eval(eventId)) : character = $gamePlayer;}

  if (character){
    tExpire = character._timerMisc.expires !== -1 ? character._timerMisc.expires : null;
    expires = eval(tExpire);

      if (expires){
         visibleAfterExpire = character._visibleAfterExpire;
         timerSwitchId = character._timerSwitchId;
         timerSwitchMode = character._timerSwitchMode;
         timerSelfSwitchId = character._timerSelfSwitchId;
         timerSelfSwitchMode = character._timerSelfSwitchMode;
         timerSelfSwitchMapId = character._timerSelfSwitchMapId;
         timerSelfSwitchEventId = character._timerSelfSwitchEventId;
         timerCommonEventId = character._timerCommonEventId;
         script = character._timerScriptOnExpire?character._timerScriptOnExpire:'';
         script = eval(eventId) > 0 ? script.replace(/<this>/gi, "$gameMap.event(eval(eventId))") : script.replace(/<this>/gi, "$gamePlayer");
         abortBattle = character._timerAbortBattleOnExpire?character._timerAbortBattleOnExpire:'';

         if (timerCommonEventId){
           $gameTemp.reserveCommonEvent(eval(timerCommonEventId));
//         eventId = eventId > -1 ? eventId : 1;
//         setCommonEvent(timerCommonEventId, eventId);
         }

         eval(script);

         setTimedSwitch(timerSwitchId, timerSwitchMode);
         setTimedSelfSwitch(timerSelfSwitchMapId, timerSelfSwitchEventId, timerSelfSwitchId, timerSelfSwitchMode);


         this._working = visibleAfterExpire;

         if (eval(abortBattle)){BattleManager.abort();}
//         if (this._abortBattle){BattleManager.abort();}
     }
   }
};



//=============================================================================
// END: Game_Timer
//=============================================================================

//=============================================================================
// Game_CharacterBase
//=============================================================================
//Alias: initMembers
var ctb_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
  ctb_CharacterBase_initMembers.call(this);
  this._timerSwitchId = 0;
  this._timerSwitchMode = 0;
  this._timerSelfSwitchId = null;
  this._timerSelfSwitchMode = 0;
  this._timerSelfSwitchMapId = 0;
  this._timerSelfSwitchEventId = null;
  this._timerCommonEventId = null;
  this._abortBattle = false;
  this._gameTimer = new Game_Timer(this._eventId);
  this._timerFont = {fontFace: 'GameFont', fontSize: 12, fontItalic: false, textColor: '#ffffff', outlineColor: 'rgba(0, 0, 0, .8)', outlineWidth: 4};
  this._timerGauge = {useGauge: '', gaugeColorA: 'rbga(0,0,0,1)', gaugeColorB: 'rbga(255,255,255,1)', gaugeY: 0, gaugeHeight: 8};
  this._timerPos = {};
  this._timerMisc = {expires:true,textPrefix:'',textSuffix:'',visible:true, textMode:1, speed:60, direction:0};
  this._switchArgs = null;
};
//=============================================================================
// END: Game_CharacterBase
//=============================================================================

//=============================================================================
// Game_Character
//=============================================================================
Game_CharacterBase.prototype.resetTimerNotetags = function() {
	$gameSystem._loadedNotesFrom = $gameSystem._loadedNotesFrom.map(v => JSON.parse(v)).filter(v => !(v.eventId === this._eventId && v.mapId === $gameMap._mapId)).map(v => JSON.stringify(v));
};

//New toggleTimer(isStarting, seconds, switchArgs, timerFont, timerGauge, timerPos, misc)
Game_Character.prototype.toggleTimer = function(isStarting, seconds, switchArgs, timerFont, timerGauge, timerPos, misc) {
    if (!switchArgs){switchArgs = {id:0,mode:0};}
    if (!switchArgs.id){switchArgs.id = 0;}
    if (!switchArgs.mode){switchArgs.mode = 0;}
    if (!switchArgs.selfId){switchArgs.selfId = null;}
    if (!switchArgs.selfMode){switchArgs.selfMode = 0;}
    if (!switchArgs.selfSwitchMapId){switchArgs.selfSwitchMapId = null;}
    if (!switchArgs.selfSwitchEventId){switchArgs.selfSwitchEventId = null;}
    if (!switchArgs.commonEventId){switchArgs.commonEventId = null;}

    if (misc){
      if (misc.expires === "false"){misc.expires = -1;}
      if (misc.visible === null){misc.visible = true;}
      if (misc.txtArray === null){misc.txtArray = [''];}
    }else{
      misc = {visible:true,textPrefix:'',textSuffix:'',direction:0};
    }

    //(00
    if (this._eventId){
      if (misc.mode === 2 || this instanceof Game_Event){
        this._gameTimer._eventId = this._eventId;
      }else{
        this._gameTimer._eventId = -1;
      }
    }else{
      this._gameTimer._eventId = -1;
    }


    this._timerSwitchId = switchArgs.id;
    this._timerSwitchMode = switchArgs.mode;
    this._timerSelfSwitchId = switchArgs.selfSwitchId;
    this._timerSelfSwitchMode = switchArgs.selfSwitchMode;
    this._timerSelfSwitchMapId = switchArgs.selfSwitchMapId;
    this._timerSelfSwitchEventId = switchArgs.selfSwitchEventId;
    this._timerCommonEventId = switchArgs.commonEventId;
    this._timerAbortBattleOnExpire = switchArgs.abortBattle;
    this._timerScriptOnExpire = switchArgs.script;
    this._switchArgs = switchArgs;

    if (timerFont){this._timerFont = timerFont};
    if (timerGauge){this._timerGauge = timerGauge};
    if (misc){this._timerMisc = misc};

    if (this._timerMisc.mode){this._gameTimer.mode = this._timerMisc.mode;}else{this._timerMisc.mode = 1; this._gameTimer.mode = 1;}

    if (timerPos){
       if (timerPos.x === null){timerPos.x = 0;}
       if (timerPos.y === null){timerPos.y = 0;}
       if (!timerPos.width){timerPos.width = 96;}
       if (!timerPos.height){timerPos.height = 48;}
    }else{
       timerPos = {x:0,y:0,width:96,height:48,screenLocked:false};
    };

    this._timerPos = timerPos;

    if (isStarting) {  // Start
        this._gameTimer.start(seconds * this._timerMisc.speed,this._timerMisc.direction);

        eval(misc.preScript);
    } else {  // Stop
        this._gameTimer.stop();
    }

    return true;
};
//=============================================================================
// END: Game_Character
//=============================================================================

function getSettingValue(txt, note, seperatorText, closingText, startIndex){
   var v = null;
   var tempNote = "";
   var lNote = note.toLowerCase();
   var txtIndex = lNote.indexOf(txt,startIndex);
   if (txtIndex > -1){
     var closingTextIndex = lNote.indexOf(seperatorText,txtIndex+txt.length) > -1 ? lNote.indexOf(seperatorText,txtIndex+txt.length) : lNote.indexOf(closingText,txtIndex+txt.length);
     if (closingTextIndex > -1){
        tempNote = note.substring(txtIndex+txt.length,closingTextIndex).replace(closingText,"");
        tempNote = tempNote.replace(seperatorText,"");
        if (tempNote.toLowerCase().indexOf("this") > -1){
          v = "this";
        }else{
          v = eval(tempNote);
        }
     }else{
        tempNote = note.substring(txtIndex+txt.length);
        if (tempNote.toLowerCase().indexOf("this") > -1){
          v = "this";
        }else{
          v = eval(tempNote);
        }
     }
   }

   return v;
}

//=============================================================================
// readNote(note) NEW
//=============================================================================
function readNote(note, eventId){
  var timerText = "timer";
  var idText = "id:";
  var secondsText = "seconds:";
  var textColorText = "textcolor:";
  var fontSizeText = "fontsize:";
  var textModeText = "textmode:";
  var textScriptText = "textscript:";
  var commonEventIdText = "commoneventid:";
  var switchIdText = "switchid:";
  var switchModeText = "switchmode:";
  var selfSwitchIdText = "selfid:";
  var selfSwitchModeText = "selfmode:";
  var selfSwitchMapIdText = "selfswitchmapid:";
  var selfSwitchEventIdText = "selfswitcheventid:";
  var scriptText = "script:";
  var intervalScriptText = "intervalscript:";
  var intervalCommonEventIdText = "intervalcommoneventid:";
  var intervalText = "interval:";
  var fontText = "font:";
  var fontItalicText = "fontitalic:";
  var textOutlineColorText = "textoutlinecolor:";
  var textOutlineWidthText = "textoutlinewidth:";
  var textVisibleText = "textvisible:";
  var useGaugeText = "usegauge:";
  var gaugeColorAText = "gaugecolora:";
  var gaugeColorBText = "gaugecolorb:";
  var gaugeXText = "gaugex:";
  var gaugeYText = "gaugey:";
  var gaugeWidthText = "gaugewidth:";
  var gaugeHeightText = "gaugeheight:";
  var gaugeOutlineColorText = "gaugeoutlinecolor:";
  var gaugeTextOnTopText = "gaugetextontop:";
  var gaugeTopImageText = "gaugetopimage:";
  var gaugeBottomImageText = "gaugebottomimage:";
  var xText = "x:";
  var yText = "y:";
  var widthText = "width:";
  var heightText = "height:";
  var screenLockedText = "screenlocked:";
  var expiresText = "expires:";
  var textPrefixText = "textprefix:";
  var textSuffixText = "textsuffix:";
  var visibleText = "visible:";
  var speedText = "speed:";
  var maxSecondsText = "maxseconds:";
  var directionText = "direction:";
  var textCodeOffsetText = "textcodeoffset:";
  var textArrayText = "textarray:";
  var topImageText = "topimage:";
  var bottomImageText = "bottomimage:";

  var closingText = ">>";
  var seperatorText = ",,";
  var stopText = "stop";

  var tempNote = "";

  var lNote = note.toLowerCase();
  var timerCharIndex = lNote.indexOf(timerText);
  if (timerCharIndex > -1){
     var settings = settings || {};

     var lNote = note.toLowerCase();
     if (lNote.indexOf(stopText) > -1){settings.stopped = true;}

     if (!settings.stopped){
       settings.commonEventId = getSettingValue(commonEventIdText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.switchId = getSettingValue(switchIdText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.switchMode = getSettingValue(switchModeText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.selfSwitchId = getSettingValue(selfSwitchIdText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.selfSwitchMode = getSettingValue(selfSwitchModeText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.selfSwitchMapId = getSettingValue(selfSwitchMapIdText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.selfSwitchEventId = getSettingValue(selfSwitchEventIdText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.script = getSettingValue(scriptText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.intervalScript = getSettingValue(intervalScriptText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.intervalCommonEventId = getSettingValue(intervalCommonEventIdText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.interval = getSettingValue(intervalText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.font = getSettingValue(fontText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.fontItalic = getSettingValue(fontItalicText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.textOutlineColor = getSettingValue(textOutlineColorText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.textOutlineWidth = getSettingValue(textOutlineWidthText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.textVisible = getSettingValue(textVisibleText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.useGauge = getSettingValue(useGaugeText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.gaugeColorA = getSettingValue(gaugeColorAText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.gaugeColorB = getSettingValue(gaugeColorBText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.gaugeX = getSettingValue(gaugeXText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.gaugeY = getSettingValue(gaugeYText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.gaugeWidth = getSettingValue(gaugeWidthText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.gaugeHeight = getSettingValue(gaugeHeightText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.gaugeOutlineColor = getSettingValue(gaugeOutlineColorText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.gaugeTextOnTop = getSettingValue(gaugeTextOnTopText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.gaugeTopImage = getSettingValue(gaugeTopImageText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.gaugeBottomImage = getSettingValue(gaugeBottomImageText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.x = getSettingValue(xText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.y = getSettingValue(yText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.width = getSettingValue(widthText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.height = getSettingValue(heightText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.screenLocked = getSettingValue(screenLockedText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.expires = getSettingValue(expiresText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.textPrefix = getSettingValue(textPrefixText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.textSuffix = getSettingValue(textSuffixText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.visible = getSettingValue(visibleText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.speed = getSettingValue(speedText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.maxSeconds = getSettingValue(maxSecondsText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.direction = getSettingValue(directionText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.textCodeOffset = getSettingValue(textCodeOffsetText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.textArray = getSettingValue(textArrayText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.topImage = getSettingValue(topImageText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.bottomImage = getSettingValue(bottomImageText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.textScript = getSettingValue(textScriptText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.textMode = getSettingValue(textModeText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.fontSize = getSettingValue(fontSizeText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.textColor = getSettingValue(textColorText, note, seperatorText, closingText, timerCharIndex+timerText.length);
       settings.seconds = getSettingValue(secondsText, note, seperatorText, closingText, timerCharIndex+timerText.length);
  
       //timerId
       var idTextIndex = lNote.indexOf(idText,timerCharIndex+timerText.length);
       if (idTextIndex > -1){
         var closingTextIndex = lNote.indexOf(seperatorText,idTextIndex+idText.length) > -1 ? lNote.indexOf(seperatorText,idTextIndex+idText.length) : lNote.indexOf(closingText,idTextIndex+idText.length);
         if (closingTextIndex > -1){;
            tempNote = note.substring(idTextIndex+idText.length,closingTextIndex).replace(closingText,"");
            var tId = eval(tempNote.replace(seperatorText,"")) || tId;
         }else{
            var tId = eval(note.replace(seperatorText,"").substring(idTextIndex+idText.length)) || tId;
         }
       }
       var settings = settings || {};
       settings.id = tId;
     }
  }

  if (settings){
	  //console.log(settings);
	  settings.selfSwitchEventId = settings.selfSwitchEventId || settings.eventId;
	  settings.selfSwitchMapId = settings.selfSwitchMapId || $gameMap._mapId;
    if (settings.selfSwitchMapId === "this"){
      settings.selfSwitchMapId = $gameMap._mapId;
    }
  
    if (settings.selfSwitchEventId === "this"){
      settings.selfSwitchEventId = $gameMap.event(eventId)._eventId;
    }
  }else{
	  let eId = $gameMap.event(eventId)._eventId;
	  settings = {selfSwitchMapId: $gameMap._mapId, selfSwitchEventId: eId, eventId:eId};
  };

  return settings;
}
//=============================================================================
//=============================================================================

//=============================================================================
// Scene_Map (The scene class of the map screen)
//=============================================================================
// Alias: onMapLoaded
var ctb_Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
    ctb_Scene_Map_onMapLoaded.call(this);

    //reset the timer position if followed in battle
    for (var i = 0; i < $gameMultiPlayer.length; i++){
      if ($gameMultiPlayer[i]._timerPos.followInBattle){
        $gameMultiPlayer[i]._timerPos.followInBattle = false;
        $gameMultiPlayer[i]._timerPos.screenLocked=$gameMultiPlayer[i]._timerPos.mapScreenLocked;
        changeTimer(i+1, {x:$gameMultiPlayer[i]._timerPos.mapX,y:$gameMultiPlayer[i]._timerPos.mapY}, 2);
      }
    }

    //reset the timer position if followed in battle
    if ($gamePlayer._timerPos.followInBattle){
      $gamePlayer._timerPos.followInBattle = false;
      $gamePlayer._timerPos.screenLocked=$gamePlayer._timerPos.mapScreenLocked;
      changeTimer(-1, {x:$gamePlayer._timerPos.mapX,y:$gamePlayer._timerPos.mapY});
    }

    readEventTags();
};

var ctb_GameEvent_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function() {
  ctb_GameEvent_setupPage.call(this);
  this._gameTimer.hasLoadedFromTag = false;
  if (this._pageIndex > -1) {readEventTag(this._eventId);}
};

function readEventTags(){
    //loop all events on the map
    for (var i = 1; i <= $gameMap._events.length; i++){
      readEventTag(i);
    }
}

function readEventTag(i){
      var settings = {};

      if ($gameMap.event(i)){
		  let event = $gameMap.event($gameMap.event(i)._eventId);
        if (!$gameMap.event($gameMap.event(i)._eventId)._gameTimer.hasLoadedFromTag){
          $gameMap.event($gameMap.event(i)._eventId)._gameTimer.hasLoadedFromTag = true;
		  if (!event.isSpawnedEvent()){
			  var tId = $dataMap.events[$gameMap.event($gameMap.event(i)._eventId)._eventId].meta.timerId;

			  var settings = readNote($dataMap.events[$gameMap.event($gameMap.event(i)._eventId)._eventId].note, $gameMap.event(i)._eventId) || {};
		  
		  
          var tId = settings.id || tId;

          //set the page index
          var j = $gameMap.event($gameMap.event(i)._eventId)._pageIndex > -1 ? $gameMap.event($gameMap.event(i)._eventId)._pageIndex : j = -1;
          var note = "";

           //loop all the comments
           if (j > -1){
             for (var k = 0; k < $dataMap.events[$gameMap.event($gameMap.event(i)._eventId)._eventId].pages[j].list.length; k++){
                var code = $dataMap.events[$gameMap.event($gameMap.event(i)._eventId)._eventId].pages[j].list[k].code;
                if ( code === 108 || code === 408){
                   note = note + $dataMap.events[$gameMap.event($gameMap.event(i)._eventId)._eventId].pages[j].list[k].parameters[0]+">>";
                }
             }

             var noteSettings = readNote(note, $gameMap.event(i)._eventId);
             if (noteSettings) {
				 settings = noteSettings;
			 };
			 			 
             var tId = settings.id || tId;

             settings.eventId = $gameMap.event($gameMap.event(i)._eventId)._eventId;
             settings.timerId = tId;
			 
			 let timerCanGo = true;			 
			 let paramData = false;			 
			 if (CTB.Param.presetTimer[tId-1]){
				 paramData = eval(JSON.parse(CTB.TimerMZsettings.timers[tId-1]).tagFromTimerOnlyOnce);
			 };
			 
			 settings.tagFromTimerOnlyOnce = settings.tagFromTimerOnlyOnce || paramData || false;
			  
			  $gameSystem._loadedNotesFrom = $gameSystem._loadedNotesFrom || [];
			  
			  loadedFrom = JSON.stringify({mapId: $gameMap._mapId, eventId: settings.eventId, settings: JSON.stringify(settings)});
			  

			  
			  if (settings.tagFromTimerOnlyOnce){
				  
				  
				if ($gameSystem._loadedNotesFrom.includes(loadedFrom)){
					//console.log();
					timerCanGo = false;
				};
			  };
			  
			  if (!$gameSystem._loadedNotesFrom.includes(loadedFrom)){
				  $gameSystem._loadedNotesFrom.push(loadedFrom);
			  };
		   

			if (timerCanGo){
             if (settings.stopped){
               stopTimer(settings.eventId);
             }else{
               startTimer(settings);
             }
			};
			 
           }
        }
		};
      }
}

// Alias: updateMain
var ctb_Scene_Map_updateMain = Scene_Map.prototype.updateMain;
Scene_Map.prototype.updateMain = function() {
  ctb_Scene_Map_updateMain.call(this);
  var active = this.isActive();

  for (var i = 1; i < $gameMap._events.length; i++){
    if ($gameMap.event(i)){if ($gameMap.event(i)._gameTimer){$gameMap.event(i)._gameTimer.update(active);}}
  }
 
 //this._eventTimerSprite

  for (var i = 0; i < $gameMultiPlayer.length; i++){
    if ($gameMultiPlayer[i]){if ($gameMultiPlayer[i]._gameTimer){$gameMultiPlayer[i]._gameTimer.update(active);}}
  }

  if ($gamePlayer){if ($gamePlayer._gameTimer){$gamePlayer._gameTimer.update(active);}}
};
//=============================================================================
// END: Scene_Map
//=============================================================================

//=============================================================================
// BattleManager (The static class that manages battle progress)
//=============================================================================
// Alias: startBattle
var ctb_BattleManager_startBattle = BattleManager.startBattle;
BattleManager.startBattle = function() {
  ctb_BattleManager_startBattle.call(this);
  this.checkFollowInBattle();
};

BattleManager.checkFollowInBattle = function(){
  for (var i = 0; i < $gameMultiPlayer.length; i++){
    if ($gameMultiPlayer[i]._timerMisc.allowFollowInBattle){
      $gameMultiPlayer[i]._timerPos.followInBattle = true;
      $gameMultiPlayer[i]._timerPos.mapX = $gameMultiPlayer[i]._timerPos.x;
      $gameMultiPlayer[i]._timerPos.mapY = $gameMultiPlayer[i]._timerPos.y;
      $gameMultiPlayer[i]._timerPos.mapScreenLocked = $gameMultiPlayer[i]._timerPos.screenLocked;
    }
  }
  
  if ($gamePlayer._timerMisc.allowFollowInBattle){
    $gamePlayer._timerPos.followInBattle = true;
    $gamePlayer._timerPos.mapX = $gamePlayer._timerPos.x;
    $gamePlayer._timerPos.mapY = $gamePlayer._timerPos.y;
    $gamePlayer._timerPos.mapScreenLocked = $gamePlayer._timerPos.screenLocked;
  }
}
//=============================================================================
// END: BattleManager
//=============================================================================

//=============================================================================
// Sprite_Battler
//=============================================================================
// Alias: updatePosition
var ctb_SpriteBattler_updatePosition = Sprite_Battler.prototype.updatePosition;
Sprite_Battler.prototype.updatePosition = function() {
    ctb_SpriteBattler_updatePosition.call(this);
    if (this._enemy){
      //for (var i = 0; i < $gameMultiPlayer.length; i++){
        var letter = this._enemy._letter || " A";
        var enemyId = letter.trim().charCodeAt(0)-65;
        if ($gameMultiPlayer[enemyId]){
          if ($gameMultiPlayer[enemyId]._timerPos.followInBattle){
            if ($gameMultiPlayer[enemyId]._timerPos.x != this.x-((this.width*.75)) || $gameMultiPlayer[enemyId]._timerPos.y != this.y-(this.height+eval($gameMultiPlayer[enemyId]._timerPos.height))){
              changeTimer(enemyId+1, {x:this.x-((this.width*.5)),y:(this.y-(this.height+eval($gameMultiPlayer[enemyId]._timerPos.height)))-5,screenLocked:true}, 2);
            }
          }
        }
      //}
    }else{
      if (this._mainSprite && this._actor._actorId === $gameParty.leader()._actorId){
        if ($gamePlayer._timerPos.followInBattle){
          if ($gamePlayer._timerPos.x != this.x-((this._mainSprite._frame.width*.75)) || $gamePlayer._timerPos.y != this.y-(this._mainSprite._frame.height+eval($gamePlayer._timerPos.height))){
            changeTimer(-1, {x:this.x-((this._mainSprite._frame.width*.75)),y:this.y-(this._mainSprite._frame.height+eval($gamePlayer._timerPos.height)),screenLocked:true});
          }
        }
      }
    }
};
//=============================================================================
// END: Sprite_Battler
//=============================================================================

//=============================================================================
// Scene_Battle
//=============================================================================
// Alias: update
var ctb_Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
    var active = this.isActive();
    if ($gamePlayer){
      if ($gamePlayer._timerMisc.workingInBattle){
       if ($gamePlayer._gameTimer){$gamePlayer._gameTimer.update(active);}
      }
    }
    
    for (var i = 0; i < $gameMultiPlayer.length; i++){
      if ($gameMultiPlayer[i]){if ($gameMultiPlayer[i]._gameTimer){$gameMultiPlayer[i]._gameTimer.update(active);}}
    }

    ctb_Scene_Battle_update.call(this);
};
//=============================================================================
// END: Scene_Battle
//=============================================================================

var ctb_Input_initialize = Input.initialize;
Input.initialize = function() {
    ctb_Input_initialize.call(this);
    this._captured = [];
};


Input.clearCaptured = function() {
    this._captured = [];
}

Input.totalCaptured = function(onlyCharacters) {
  var totalCaptured = "";
  for (var i=0;i<this._captured.length;i++){
    if (onlyCharacters){
      if (this._captured[i].keyCode > 31 && this._captured[i].keyCode < 91){
        totalCaptured=totalCaptured+this._captured[i].buttonName;
      }
    }else{
      totalCaptured=totalCaptured+this._captured[i].buttonName;
    }
  }
  return totalCaptured;
}

Input.lastCaptured = function(onlyCharacters, keycode) {
  if (onlyCharacters){
     if (this._captured.length > 0){
      if (this._captured[this._captured.length-1].keyCode > 31 && this._captured[this._captured.length-1].keyCode < 91){
       return !keycode ? this._captured[this._captured.length-1].buttonName : this._captured[this._captured.length-1].keyCode;
      }else{
        return '';
      }
     }else{
       return '';
     }
  }else{
    if (this._captured.length > 0){
       return !keycode ? this._captured[this._captured.length-1].buttonName : this._captured[this._captured.length-1].keyCode;
    }else{
      return '';
    }
  }
}

var ctb_Input_clear = Input.clear;
Input.clear = function() {
    ctb_Input_clear.call(this);
};

var ctb_Input_onKeyDown = Input._onKeyDown;
Input._onKeyDown = function(event) {
    if (event.keyCode !== this._lastKey){
      this._lastKey = event.keyCode;
      if (String.fromCharCode(event.keyCode).toLowerCase() === 'z' || String.fromCharCode(event.keyCode).toLowerCase() === 'x' || String.fromCharCode(event.keyCode).toLowerCase() === 'q' || String.fromCharCode(event.keyCode).toLowerCase() === 'w'){
         var bName = this.keyMapper[event.keyCode]?String.fromCharCode(event.keyCode):this.keyMapper[event.keyCode];
      }else{
         var bName = this.keyMapper[event.keyCode]?this.keyMapper[event.keyCode]:String.fromCharCode(event.keyCode);
      }
      if (event.keyCode === 32){bName=" "};
      this._captured.push({keyCode:event.keyCode, buttonName:bName});
    }
    ctb_Input_onKeyDown.call(this, event);
};

var ctb_Input_onKeyUp = Input._onKeyUp;
Input._onKeyUp = function(event) {
    this._lastKey = null;
    ctb_Input_onKeyUp.call(this, event);
};

function converse(eId){
  var settings = {};
  if (Input.lastCaptured()==="ok"&&Input.lastCaptured(false,true)!==32){
    var txt = Input.totalCaptured(true).toLowerCase();
    // Name Input
    if ($gameActors.actor(1).name() === "<no name>"){
      var n = jsUcfirst(txt);
      $gameActors.actor(1).setName(n);
      settings.textScript = "'Hello '+$gameActors.actor(1).name()+', nice to meet you.'+String.fromCharCode(13)+'How are you today?'";
      settings.width = 320;
      settings.height = 128;
    }else{
    //
      if (txt.includes("good") || txt.includes("great")){
        settings.textScript = "'Cool Lets Play'";
      }else{
        settings.textScript = "'Lets play'";
      }
    }
    changeTimer(eId, settings);
    Input.clearCaptured();
  }
}

	function jsUcfirst(string){return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();}

	$_$['DataManager.createGameObjects'] = DataManager.createGameObjects;
	DataManager.createGameObjects = function() {
	  $_$['DataManager.createGameObjects'].apply(this, arguments);
	  $gameMultiPlayer = [];
	  for (let i = 0; i < CTB.Param.mainSettings.extraTimers; i++){
		  this.addNewMultiPlayer(i+1);
	  }
	};
	
	DataManager.addNewMultiPlayer = function(id){
		let multiplayer = new Game_Player();
		multiplayer._playerId = id;
		$gameMultiPlayer.push(multiplayer);		
	};

	$_$['DataManager.makeSaveContents'] = DataManager.makeSaveContents;
	DataManager.makeSaveContents = function() {
	  let contents = $_$['DataManager.makeSaveContents'].apply(this, arguments);
	  contents.multiPlayer = $gameMultiPlayer;
	  return contents;
	};

	$_$['DataManager.extractSaveContents'] = DataManager.extractSaveContents;
	DataManager.extractSaveContents = function(contents) {
	  $_$['DataManager.extractSaveContents'].apply(this, arguments);
	  $gameMultiPlayer = contents.multiPlayer;
	};

//})(CTB.TimersMZ, this);

function setCrop(itemId, eventId, mapId){
	mapId = mapId || $gameMap._mapId;
	$gamePlayer._crop = $gamePlayer._crop || []; $gamePlayer._crop[mapId] = $gamePlayer._crop[mapId] || [];
	$gamePlayer._crop[mapId][eventId] = {};
	let crop = $gamePlayer._crop[mapId][eventId];
	crop._plantedItem = $dataItems[itemId];
	crop._grownTileId = Number(crop._plantedItem.meta.growTileId);
	crop._grownItem = $dataItems[Number(crop._plantedItem.meta.grownId)];
	crop._grownItemName = crop._grownItem.meta.pluralName || crop._grownItem.name;
};

function getCrop(eventId, mapId){
	mapId = mapId || $gameMap._mapId;
	return $gamePlayer._crop[mapId][eventId];
};

function startTimer(settings){
	CTB.TimersMZ.startTimer(settings);
};