//===================================================================================
// Astfgl's Shield counter and Break
// Date 19/08/2018
// Free to use non commercially, commercially, repost and
// edit, as long as the final product is kept under the same terms of use.
// Credits required, any of Astfgl, Astgfl (Pierre MATEO), Pierre MATEO
// Credits goes to yanfly for modified parts of battle engine core
// v1.0 19/08: release
// v1.1 21/08 modified shield display modes
// v1.2 25/08 created weakness display, added parameters for shield mode, made weakness display save
// v1.3 25/08 added notetags to actor enemies and states to allow not displaying shield value
// v1.4 04/09 added revealRandomWeakness functions, added option for actors or enemies to not use shields,
// added option to reset known weaknesses after combat.
// v1.5 24/02/20 added shImpact notetag, fixed misses or evades from modifying shield count
// v1.5.1 29/02/20 Fixed default state bug
// Time spent : 8h35
//====================================================================================
// [JOKO 2026-10-18] Copie corrigée pour le jeu de JOKO (l'original est gardé tel quel
// dans Documents\RPG Maker\3 Systèmes et plugins\Plugins du forum). Chaque correction
// est marquée [JOKO] dans le code :
//  1. Un combattant n'a de bouclier QUE si on lui en donne un (<mSh: …> dans sa note,
//     ou la règle Astfgl.regleBouclier). Sans ça, il n'est pas touché : ni bouclier,
//     ni brisure, et son nom s'affiche exactement comme avec Yanfly.
//  2. Une sauvegarde faite sans ce plugin se charge sans planter (avant : Astfgl
//     devenait undefined et le premier combat plantait).
//  3. Le bouclier se recharge tout seul quand l'état de brisure s'en va.
//  4. « Save weaknesses » marchait à l'envers.
//  5. Le bouclier d'une classe lisait la note de l'acteur ; modMaxSh ne bornait rien.
//  6. Les faiblesses ne sont plus recalculées à chaque image (fluidité) ; une icône de
//     faiblesse absente du tableau prend l'icône « non découverte ».
//  7. Une nouvelle partie repart sans faiblesses découvertes.
//====================================================================================

/*:
 * @plugindesc OT Shield and Break System
 * @author Astfgl
 *
 * @param globalMode
 * @text Shield usage
 * @type number
 * @default 0
 * @desc 0-> all, 1-> actors only -> 2 -> enemies only
 
 * @param defaultState
 * @text State Id when shield = 0
 * @type number
 * @default 4
 * @desc Which state will be applied when a battler shield reaches 0.
 *
 * @param defaultElemCutoff
 * @text Elemental weakness cutoff
 * @type number
 * @default 1
 * @desc Attacks must have an elemental value strictly superior to this to remove from the shield counter.
 *
 * @param baseIcon
 * @text Base shield Icon
 * @type number
 * @default 16
 * @desc The icon id to display shields.
 *
 * @param mode
 * @text Shield display mode
 * @type number
 * @default 0
 * @desc 0->number in brackets, 1 -> number in icon
 *
 * @param showWeaknesses
 * @text Show weaknesses below enemy name
 * @type number
 * @default 1
 * @desc 0-> don't show weaknesses, 1 -> show weaknesses
 *
 * @param wIArray
 * @text Weakness Icon Array
 * @default [0,0,0,0,0,0,0,0,0,0]
 * @desc Icons for each elemental weakness, in order from your elements list in the system tab with a leading "0,".
 *
 * @param defautWeaknessIcon
 * @text Undiscovered Weakness icon
 * @type number
 * @default 16
 * @desc The icon id that will be used to display undiscovered weaknesses.
 *
 * @param saveWeakness
 * @text Save weaknesses
 * @type boolean
 * @default true
 * @desc If this parameter is set to false, discovered weaknesses will be reset at battle end.
 *
 * @param boucliersParRang
 * @text [JOKO] Boucliers par rang
 * @default D: 2, C: 3, B: 4, A: 5, S: 6, BOSS: 8
 * @desc Le rang vient de <Rang: X> sur l'ennemi ; BOSS = un ennemi à <Meca…:> ou <Phases:>
 * (la même règle qu'EquilibreDesCombats). Un rang absent = pas de bouclier.
 *
 * @param degatsBrise
 * @text [JOKO] Dégâts reçus brisé (×)
 * @default 1.5
 * @desc Les dégâts de PV qu'un ennemi brisé reçoit sont multipliés par ce nombre.
 * 1 = aucun bonus.
 *
 *
 * @help 
 *Allows you to set up a shield and break system similar to Octopath traveler's
 *Recommended plugins:
 * - Yanfly's Battle engine core
 * - Yanfly's Element core
 * - Yanfly's Buffs and state core
 *It has not been tested without these plugins and thus may not function.
 *
 *==========================================
 * What it does:
 *==========================================
 *In battle, if an attack hits an elemental weakness, 
 *it will decrease a shield counter, once that counter reaches 0
 *a state will be applied to the battler.
 *
 *It will reduce the shield counter by 1 for each element of the attack
 *the recipient is weak to.
 *So if your attack deals fire and ice damage and the enemy is weak to both
 *shields will be reduced by 2.
 *
 *Display of the shield amount is done via the battler name in brackets or with an icon.
 *
 *It also creates a weakness icon array below the monster.
 *If the show weakness parameter is set to 1, it will display any element
 *weakness reaching the default cutoff with the icon corresponding to the defined id
 *in the weakness icon array below the battler name.
 *
 *==========================================
 * How to use:
 *==========================================
 *Set max shield notetags:
 *
 *Order for max shield calculation: 
 *actor, class, equipment, passive states, states then floored
 *Notetags: <mSh: >, Ex: <mSh: num += 5>
 *
 *Each time calculations are made with the num variable. 
 *Ex: num += 5 in actor, num *= 2 in class will result in a max shield of 10
 *The same thing but with a state using num = 1 will result in a max shield of 1
 *
 *Enemies are the same except you remove class and equipment calculations
 *
 *If you don't set anything, battlers have a default shield value of 1.
 *
 *If you want it to function like octopath traveler, I recommend
 *using a state with the cannot move property, set to expire in 2 turns
 *and with the following notetag:
 *<Custom Remove Effect>
 *user._sh = user._mSh;
 *</Custom Remove Effect>
 *This will restore shields to maximum when the broken state expires.
 *
 *==========================================
 * Changing break state
 *==========================================
 *If you want to change what state enemies are inflected with upon break use:
 *<DBS: > in an enemy note box
 *Else it will use what's inside plugin parameters
 *
 *==========================================
 * Modifying enemy shields:
 *==========================================
 * Use the following script calls:
 * (battler).modMaxSh(number)
 * This will add number to max shields, after all other calculations.
 * This bonus will never be reset.
 * Use states for temporary modifications for actors.
 *
 * (battler).changeSh(number), this will withdraw number from current shields
 *
 *All parameters and notetags are evaled
 *
 *==========================================
 * How to setup weakness display array:
 *==========================================
 *
 * The parameter is an array of icon ids with a leading 0.
 * For default projects it would be:
 * [0,physicalIconId,fireIconId,...,darknessIconId]
 *
 *==========================================
 * How to hide shield amount
 *==========================================
 * Use the following notetag in an actor enemy or state notebox:
 * <shieldDisplay:false>
 *
 *==========================================
 * How to make a specific battler not use shields
 *==========================================
 * Use the following notetag in an actor enemy or state notebox:
 * <shieldDisplay:none>
 * This battler will not display his shields and will not suffer
 * from break.
 *==========================================
 * How to reveal weaknesses
 *==========================================
 * Use the following script calls:
 * battler.revealRandomWeakness()
 * to reveal one weakness for an enemy type.
 * Replace battler accordingly with a b user or target in
 * notetags or the damage formula.
 *
 * You can reveal one weakness at random for each enemy type
 * in the troop with the following script call:
 * $gameTroop.revealRandomWeakness();
 *
 *==========================================
 * How to modify shield depletion
 *==========================================
 * You can change the amount from which a skill or item
 * impacts the shield counter using the following notetag:
 * <shImpact: X>
 * This notetag is evaled and is executed in the Game_Action context.
 * 
 * ex: <shImpact: 3> will remove 3 points from the shield gauge if striking a weakness
 * ex: <shImpact: -1> will add 1 point to the shield gauge if striking a weakness
 * ex: <shImpact: if (target.result().critical) {3} else {1}>
 * this will substract 3 on a critical strike and 1 on a regular strike
 *
*/
var Astfgl = Astfgl || {};
Astfgl.enemies = Astfgl.enemies || {};
Astfgl.enemies.disWeak = [];

(function(){
//get parameters value
var defaultState = eval(PluginManager.parameters("AstfglSCB").defaultState);
var defaultElemCutoff = eval(PluginManager.parameters("AstfglSCB").defaultElemCutoff);
var mode = eval(PluginManager.parameters("AstfglSCB").mode)
var shieldIcon = eval(PluginManager.parameters("AstfglSCB").baseIcon)
var showWeaknesses = eval(PluginManager.parameters("AstfglSCB").showWeaknesses)
var wIArray =  eval(PluginManager.parameters("AstfglSCB").wIArray)
var defautWeaknessIcon = eval(PluginManager.parameters("AstfglSCB").defautWeaknessIcon)
var globalMode = eval(PluginManager.parameters("AstfglSCB").globalMode)
var saveWeakness = eval(PluginManager.parameters("AstfglSCB").saveWeakness)

// [JOKO 2026-10-18] JOKO : « boucliers par rang (D 2, C 3, B 4, A 5, S 6, boss 8), l'état
// Brisé (perd son tour, +50 % de dégâts) ». Les fiches d'ennemis ne sont pas touchées :
// le nombre vient de cette règle. Un <mSh: …> écrit sur un ennemi passe avant la règle.
var boucliersParRang = {};
String(PluginManager.parameters("AstfglSCB").boucliersParRang || '').split(',').forEach(function(paire) {
	var m = /^\s*([A-Za-z]+)\s*:\s*(\d+)\s*$/.exec(paire);
	if (m) {boucliersParRang[m[1].toUpperCase()] = Number(m[2])}
});
var degatsBrise = Number(PluginManager.parameters("AstfglSCB").degatsBrise || 1) || 1;
function rangDe(donnees) {
	// la même règle qu'EquilibreDesCombats, pour qu'un « boss » soit le même partout
	if (window.EquilibreDesCombats && EquilibreDesCombats.rangDe) {return EquilibreDesCombats.rangDe(donnees)}
	var note = (donnees && donnees.note) || '';
	if (/<\s*(Meca\w*|Phases)\s*:/i.test(note)) {return 'BOSS'}
	var m = /<\s*Rang\s*:\s*([^>]*)>/i.exec(note);
	return m ? String(m[1]).trim().toUpperCase() : null;
}
if (Object.keys(boucliersParRang).length) {
	Astfgl.regleBouclier = function(battler) {
		if (!battler.isEnemy()) {return 0}
		return boucliersParRang[rangDe($dataEnemies[battler._enemyId])] || 0;
	};
}

//Weakness setup
var _aliasGAI = Game_Actor.prototype.initialize
Game_Actor.prototype.initialize = function(actorId) {
    _aliasGAI.call(this,actorId);
	if (this._actorId === 0) {return}
	if (globalMode !== 2) {
	this._mShB = 0;
	this._mSh = this.getMaxSh();
	this._sh = this._mSh
	}
};

//get max shield value from notetags
Game_Actor.prototype.getMaxSh = function() {
	var num = 0;
	var a = this;
	var user = this;
	var id = this.actorId();
	if ($dataActors[id].meta.mSh) {
		num = eval($dataActors[id].meta.mSh)
	}
	if ($dataClasses[this._classId].meta.mSh) {
		num = eval($dataClasses[this._classId].meta.mSh)   // [JOKO] lisait la note de l'acteur
	}
	for (let i = 0; i < this._equips.length; i++) {
		var it = this._equips[i];
		if (it._dataClass === "weapon" && it._itemId !== 0) {
			if ($dataWeapons[it._itemId].meta.mSh) {
				num = eval($dataWeapons[it._itemId].meta.mSh)
			}

		}
		if (it._dataClass === "armor" && it._itemId !== 0) {
			if ($dataArmors[it._itemId].meta.mSh) {
				num = eval($dataArmors[it._itemId].meta.mSh)
			}

		}
	}
	if (this._passiveStatesRaw) {
		for (let i = 0; i < this._passiveStatesRaw.length; i ++) {
			if ($dataStates[this._passiveStatesRaw[i]].meta.mSh) {
				num = eval($dataStates[this._passiveStatesRaw[i]].meta.mSh)
			}
		}
	}
	for (let i = 0; i < this._states.length; i ++) {
		if ($dataStates[this._states[i]].meta.mSh) {
			num = eval($dataStates[this._states[i]].meta.mSh)
		}
	}
	num += 	this._mShB
	num = Math.floor(num)
	if (num === 0 || isNaN(num)) {num = 1}
	return num
}

//setup enemies shield
var _aliasGEI = Game_Enemy.prototype.initialize
Game_Enemy.prototype.initialize = function(enemyId, x, y) {
    _aliasGEI.call(this,enemyId, x, y);
	if (this._enemyId === 0) {return};
	if (globalMode !== 1) {
		this._mShB = 0;
		this._mSh = this.getMaxSh()
		this._sh = this._mSh;
	}
	//create known weakness array the first time an enemy is initialized
	if (Astfgl.enemies.disWeak.length === 0) {
		for (let i = 0; i < $dataEnemies.length; i++) {
			var _WI = [];
			for (let i = 0; i < $dataSystem.elements.length; i ++) {
				_WI.push(0);
			}
		Astfgl.enemies.disWeak.push(_WI)
		}
	}

};

//get max enemy shield value from enemy and state notetags
Game_Enemy.prototype.getMaxSh = function() {
	var num = 0;
	var a = this;
	var user = this;
	var id = this._enemyId;
	if ($dataEnemies[id].meta.mSh) {
		num = eval($dataEnemies[id].meta.mSh)
	}
	if (this._passiveStatesRaw) {
		for (let i = 0; i < this._passiveStatesRaw.length; i ++) {
			if ($dataStates[this._passiveStatesRaw[i]].meta.mSh) {
				num = eval($dataStates[this._passiveStatesRaw[i]].meta.mSh)
			}
		}
	}
	for (let i = 0; i < this._states.length; i ++) {
		if ($dataStates[this._states[i]].meta.mSh) {
			num = eval($dataStates[this._states[i]].meta.mSh)
		}
	}
	if (!$dataEnemies[id].meta.mSh && typeof Astfgl.regleBouclier === 'function') {   // [JOKO] la règle
		num = Number(Astfgl.regleBouclier(this)) || 0;                               // donne la base
	}
	num += this._mShB;
	num = Math.floor(num)
	if (num === 0 || isNaN(num)) {num = 1}
	return num
}

// [JOKO] Un combattant n'a de bouclier que si on lui en donne un : une balise <mSh: …>
// dans sa note, ou la règle Astfgl.regleBouclier(combattant) (réglage par rang, à venir).
// Sans ça, le plugin ne le touche pas du tout.
Game_Battler.prototype.aUnBouclier = function() {
	var data = this.isEnemy() ? $dataEnemies[this._enemyId] : $dataActors[this.actorId()];
	if (data && data.meta.mSh) {return true}
	return typeof Astfgl.regleBouclier === 'function' ? !!Astfgl.regleBouclier(this) : false;
}

//check for shield display amount
Game_Battler.prototype.checkShieldDisplay = function() {
	if (!this.aUnBouclier()) {return "none"}   // [JOKO] voir aUnBouclier
	var value = true;
	var data;
	if (this.isEnemy()) {data = $dataEnemies[this._enemyId]}
	if (this.isActor()) {data = $dataActors[this.actorId()]}
	if (data.meta.shieldDisplay) {
		if (data.meta.shieldDisplay === "none") {return "none"}
		value = eval(data.meta.shieldDisplay);
	}
	if (!value) {return value}
	if (this._passiveStatesRaw) {
		for (let i = 0; i < this._passiveStatesRaw.length; i ++) {
			if ($dataStates[this._passiveStatesRaw[i]].meta.shieldDisplay) {
				value = eval($dataStates[this._passiveStatesRaw[i]].meta.shieldDisplay)
				if (!value) {return value}
			}
		}
	}
	for (let i = 0; i < this._states.length; i ++) {
		if ($dataStates[this._states[i]].meta.shieldDisplay) {
			value = eval($dataStates[this._states[i]].meta.shieldDisplay)
			if (!value) {return value}
		}
	}
	return value
}

//store known weaknesses in global array
Game_Enemy.prototype.checkWeaknessDisplay = function (num) {
	if (Astfgl.enemies.disWeak[this._enemyId][num] === 0) {
		Astfgl.enemies.disWeak[this._enemyId][num] = 1
	}
}

//Action modifying
var _aliasGAA = Game_Action.prototype.apply
Game_Action.prototype.apply = function(target) {
	_aliasGAA.call(this,target)
	if (target.checkShieldDisplay() === "none") {return}   // [JOKO] sans bouclier : rien à faire
	//don't substract if miss or evade
	if (target.result().missed || target.result().evaded) {return}
	//check the amount to modify shield by
	var a = 1;
	var id = this._item._itemId
	if (this._item._dataClass === "skill") {
		if ($dataSkills[id].meta.shImpact) {
			a = eval($dataSkills[id].meta.shImpact)
		}
	} else if (this._item._dataClass === "item") {
		if ($dataItems[id].meta.shImpact) {
			a = eval($dataItems[id].meta.shImpact)
		}
	}
	var mod = 0;
	var elements = this.getItemElements();
	for (let i = 0; i < elements.length; i++) {
		if (target.elementRate(elements[i]) > defaultElemCutoff) {
			mod += a;
			if (!target.isActor()) {
				target.checkWeaknessDisplay(elements[i])
			}
		}
	}
	target.changeSh(mod);
}

Game_Battler.prototype.changeSh = function(num) {
	if (this._sh === 0) {return}
	if (globalMode === 2 && this.isActor()) {return}
	if (globalMode === 1 && this.isEnemy()) {return}
	if (this.checkShieldDisplay() === "none") {return}
	this._sh -= num;
	this._sh = this._sh.clamp(0,this._mSh);
	var st = defaultState;
	if (this._sh === 0) {
		this.addState(this.etatDeBrise())
	};
}

// [JOKO] l'état posé à la brisure : <DBS: n> dans la note, sinon le réglage du plugin
Game_Battler.prototype.etatDeBrise = function() {
	var st = defaultState;
	if (this.isActor()) {if ($dataActors[this.actorId()].meta.DBS) {st = eval($dataActors[this.actorId()].meta.DBS)}}
	else {if ($dataEnemies[this._enemyId].meta.DBS) {st = eval($dataEnemies[this._enemyId].meta.DBS)}}
	return st
}

// [JOKO] brisé, il encaisse plus : les dégâts de PV (et le drain de PV) sont multipliés
// par « Dégâts reçus brisé » — pas les soins, pas les PM
var _aliasGAED = Game_Action.prototype.executeDamage
Game_Action.prototype.executeDamage = function(target, value) {
	if (degatsBrise !== 1 && value > 0 && target._sh === 0 && target._mSh
		&& (this.item().damage.type === 1 || this.item().damage.type === 5)
		&& target.isStateAffected(target.etatDeBrise())) {
		value = Math.round(value * degatsBrise);
	}
	return _aliasGAED.call(this, target, value);
}

// [JOKO] quand l'état de brisure s'en va, le bouclier se recharge (avant : il fallait une
// balise <Custom Remove Effect> dans l'état, sinon le bouclier restait à 0 tout le combat)
var _aliasGBRS = Game_Battler.prototype.removeState
Game_Battler.prototype.removeState = function(stateId) {
	var etait = this.isStateAffected(stateId);
	_aliasGBRS.call(this, stateId);
	if (etait && this._mSh && this._sh === 0 && stateId === this.etatDeBrise()) {this._sh = this._mSh}
}

/*
//Modify name function to display shield amount
var _aliasGEN = Game_Enemy.prototype.name
Game_Enemy.prototype.name = function() {
	if ( mode === 0 ) {return _aliasGEN.call(this); }
	return "[" + this._sh + "]" + this.originalName() + (this._plural ? this._letter : '');
}*/

//Modify battle window draw name function to display shield amount
var _aliasWBSDAN = Window_BattleStatus.prototype.drawActorName
Window_BattleStatus.prototype.drawActorName = function(actor, x, y, width) {
	if (globalMode === 2 || actor.checkShieldDisplay() === "none") {_aliasWBSDAN.call(this,actor,x,y,width); return}
	width = width || 168;
    this.changeTextColor(this.hpColor(actor));
	if (mode === 1) {
		var fs = this.contents.fontSize
		this.contents.fontSize = Yanfly.Param.BECEnemyFontSize;
		this.drawIcon(shieldIcon,x,y+3)
		if (actor.checkShieldDisplay()) {
			var wd = this.textWidth(String(actor._sh));
			this.drawText(actor._sh, x + 16 - wd/2, y, 40);
		} else {
			var wd = this.textWidth("?");
			this.drawText("?", x + 16 - wd/2, y, 40);
		}
		this.contents.fontSize = fs
		this.drawText(actor.name(), x + 40, y, width - 48);
	} else {
		if (actor.checkShieldDisplay()) {
			this.drawText("["+ actor._sh + "]" + actor.name(), x, y, width);
		} else {
			this.drawText("[?]" + actor.name(), x, y, width);
		}
	}
}

// [JOKO] les faiblesses d'un ennemi, relues au plus toutes les 15 images (la fenêtre
// demande sa taille à chaque image : avant, 29 éléments × chaque ennemi × 60 fois/s)
Window_EnemyVisualSelect.prototype.astfglFaiblesses = function() {
	var b = this._battler;
	if (!this._astfglCache || this._astfglCache.battler !== b || Graphics.frameCount - this._astfglCache.image >= 15) {
		var elemWeak = [];
		for (let i = 1; i < $dataSystem.elements.length; i++) {
			if (b.elementRate(i) > defaultElemCutoff) {elemWeak.push(i)}
		}
		this._astfglCache = {battler: b, image: Graphics.frameCount, liste: elemWeak};
	}
	return this._astfglCache.liste
}

//Modify enemy name display
var _aliasWEVSR = Window_EnemyVisualSelect.prototype.refresh
Window_EnemyVisualSelect.prototype.refresh = function() {
    // [JOKO] un ennemi sans bouclier s'affiche exactement comme avec Yanfly
    if (!this._battler || globalMode === 1 || this._battler.checkShieldDisplay() === "none") {return _aliasWEVSR.call(this)}
    this.contents.clear();
    if (!this._battler) return;
    if (!this._showEnemyName) return;
    if (this._battler.isHidden()) return;
    this._requestRefresh = false;
    this.contents.fontSize = Yanfly.Param.BECEnemyFontSize;
    var text = this._battler.name();
    var wy = this.contents.height - this.lineHeight() * 2;
	if (globalMode !== 1 && this._battler.checkShieldDisplay() !== "none") {
		if (mode === 1) {
				this.drawIcon(shieldIcon,0,wy+3)
				if (this._battler.checkShieldDisplay()) {
					var wd = this.textWidth(String(this._battler._sh));
					this.drawText(this._battler._sh, 16 - wd/2, wy, 40);
				} else {
					var wd = this.textWidth("?");
					this.drawText("?", 16 - wd/2, wy, 40);
				}
				this.drawText(text, 40, wy, this.contents.width, 'left');
		} else {
				if (this._battler.checkShieldDisplay()) {
					this.drawText("[" + this._battler._sh + "]" + text, 0, wy, this.contents.width, 'center');
				} else {
					this.drawText("[?]" + text, 0, wy, this.contents.width, 'center');
				}
		}
	} else {
		this.drawText(text, 0, wy, this.contents.width, 'center');
	}
	
	if (showWeaknesses === 1) {
		var elemWeak = this.astfglFaiblesses();   // [JOKO] voir astfglFaiblesses
		wy = wy + this.lineHeight();
		if (this.width < 32 * elemWeak.length) {
			this.width = 32 * elemWeak.length
			this.contents.width = 32 * elemWeak.length
		}
		var x = 0;
		for (let i = 0; i < elemWeak.length; i++) {
			var iconId = defautWeaknessIcon;
			if (Astfgl.enemies.disWeak[this._battler._enemyId][elemWeak[i]] === 1) {
				iconId = wIArray[elemWeak[i]] || defautWeaknessIcon;   // [JOKO] élément sans icône
			}
			this.drawIcon(iconId,x,wy)
			x += 32;
		}
	}

};

//change window size to display the right width for weaknesses icons
var _aliasWEVSUWS = Window_EnemyVisualSelect.prototype.updateWindowSize   // [JOKO]
Window_EnemyVisualSelect.prototype.updateWindowSize = function() {
	// [JOKO] un ennemi sans bouclier garde la taille de Yanfly
	if (globalMode === 1 || this._battler.checkShieldDisplay() === "none") {return _aliasWEVSUWS.call(this)}
	if (showWeaknesses === 1) {
		var elemWeak = this.astfglFaiblesses();   // [JOKO] voir astfglFaiblesses
		var num = elemWeak.length * 32;
	} else {
		num = 0;
	}
    var spriteWidth = this._battler.spriteWidth();
    this.contents.fontSize = Yanfly.Param.BECEnemyFontSize;
    if (this._nameTextWidth === undefined) {
      this._nameTextWidth = this.textWidth(this._battler.name());
    }
    var textWidth = this._nameTextWidth;
    // [JOKO] la place du bouclier devant le nom (l'icône, ou « [n] ») : sans ça, le nom était coupé
    textWidth += (mode === 1) ? 40 : this.textWidth('[' + this._battler._mSh + ']');
    textWidth += this.textPadding() * 2;
    var width = Math.max(spriteWidth, textWidth, num) + this.standardPadding() * 2;
    width = Math.ceil(width);
    var height = this._battler.spriteHeight() + this.standardPadding() * 2;
    height = Math.ceil(height);
    height = Math.max(height, this.lineHeight() + this.standardPadding() * 2);
    if (width === this.width && height === this.height) return;
    this.width = width;
    this.height = height;
    this.createContents();
    this._requestRefresh = true;
    this.makeWindowBoundaries();
};

// [JOKO] la fenêtre du nom ne se redessinait que si le NOM changeait : le chiffre du bouclier
// et les faiblesses découvertes restaient figés. On la redessine quand l'un d'eux bouge.
var _aliasWEVSUBN = Window_EnemyVisualSelect.prototype.updateBattlerName
Window_EnemyVisualSelect.prototype.updateBattlerName = function() {
	_aliasWEVSUBN.call(this);
	var b = this._battler;
	if (!b || globalMode === 1 || b.checkShieldDisplay() === "none") {return}
	var connues = Astfgl.enemies.disWeak[b._enemyId] || [];
	var signe = b._sh + '/' + connues.join('');
	if (this._astfglSigne !== signe) {this._astfglSigne = signe; this._requestRefresh = true}
}

// Accessory functions
Game_Battler.prototype.modMaxSh = function (num) {
	if (globalMode === 2 && this.isActor()) {return}
	if (globalMode === 1 && this.isEnemy()) {return}
	this._mShB += num;
	this._mSh = this.getMaxSh();
	this._sh = this._sh.clamp(0,this._mSh);   // [JOKO] le résultat n'était pas gardé
}

//save and load weakness array
// [JOKO] on ne sauve que les faiblesses découvertes (pas les fonctions), et une sauvegarde
// qui n'en a pas (faite avant ce plugin) ne remplace plus Astfgl par undefined
var _aliasDMMSC = DataManager.makeSaveContents
DataManager.makeSaveContents = function() {
	var contents = _aliasDMMSC.call(this)
	contents.astfgl = {enemies: Astfgl.enemies}
	return contents
}

var _aliasDMESC = DataManager.extractSaveContents
DataManager.extractSaveContents = function(contents) {
	_aliasDMESC.call(this,contents);
	Astfgl.enemies = (contents.astfgl && contents.astfgl.enemies) || {disWeak: []};
}

// [JOKO] une nouvelle partie repart sans faiblesses découvertes
var _aliasDMSNG = DataManager.setupNewGame
DataManager.setupNewGame = function() {
	_aliasDMSNG.call(this);
	Astfgl.enemies = {disWeak: []};
}

//Reset discovered weakness on battle end
if (!saveWeakness) {   // [JOKO] marchait à l'envers : « false » = on oublie à la fin du combat
	var _aliasBMEB = BattleManager.endBattle
	BattleManager.endBattle = function(result) {
		_aliasBMEB.call(this,result);
		$gameTroop.members().forEach(function(member){
			for (let i=0; i < Astfgl.enemies.disWeak[member._enemyId].length; i++) {
				Astfgl.enemies.disWeak[member._enemyId][i] = 0
			}
		})
	};
}

Game_Enemy.prototype.revealRandomWeakness = function() {
	var member = this;
	var eId = member._enemyId
	var dis = [];
	for (let i = 1; i < $dataSystem.elements.length; i ++){
		if (Astfgl.enemies.disWeak[eId][i] === 0 && member.elementRate(i) > defaultElemCutoff) {dis.push(i)}
	}
	if (dis.length!==0) {
		var num = Math.floor(Math.random() * Math.floor(dis.length));
		Astfgl.enemies.disWeak[eId][dis[num]] = 1;
	}
}

Game_Troop.prototype.revealRandomWeakness = function() {
	var ids = []
	this.members().forEach(function(member){
    var eId = member._enemyId
    if (!ids.contains(eId)) {
        var dis = [];
        for (let i = 1; i < $dataSystem.elements.length; i ++){
            if (Astfgl.enemies.disWeak[eId][i] === 0 && member.elementRate(i) > defaultElemCutoff) {dis.push(i)}
        }
        ids.push(eId)
        if (dis.length!==0) {
            var num = Math.floor(Math.random() * Math.floor(dis.length));
            Astfgl.enemies.disWeak[eId][dis[num]] = 1;
        }
    }
	})
}


})()