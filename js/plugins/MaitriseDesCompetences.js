//=============================================================================
// MaitriseDesCompetences.js — v1.0  ·  Maîtrise des compétences, statistiques
// RPG Maker MV   ·   pour JOKO
//   Inspiré, sans rien en copier, de Skill Mastery Levels et Battle
//   Statistics (Yanfly).
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Plus un héros utilise une compétence, plus elle se
 * renforce. Et une page « Statistiques » des combats dans le menu.
 * @author JOKO
 *
 * @param paliers
 * @text Maîtrise : usages pour chaque niveau
 * @type string
 * @default 5, 15, 30, 50, 80
 * @desc Nombre total d'utilisations pour atteindre les niveaux 1, 2, 3… Autant de nombres que de niveaux.
 *
 * @param bonus
 * @text Maîtrise : bonus par niveau (% dégâts et soins)
 * @type number
 * @default 4
 *
 * @param reduction
 * @text Maîtrise : coût en PM réduit par niveau (%)
 * @type number
 * @default 0
 *
 * @param attaque
 * @text Maîtrise : l'Attaque et la Défense comptent aussi ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default false
 *
 * @param menuStats
 * @text Statistiques : entrée du menu (vide = aucune)
 * @type string
 * @default Statistiques
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA MAÎTRISE DES COMPÉTENCES
 * ═══════════════════════════════════════════════════════════════════════════
 *  Chaque fois qu'un héros utilise une compétence en combat, elle compte.
 *  À 5, 15, 30, 50 et 80 utilisations, elle monte d'un niveau de maîtrise
 *  (★1 à ★5) : +4 % de dégâts (ou de soins) par niveau. Tout est réglable.
 *  Le niveau s'affiche en petit sur l'icône dans la liste des compétences,
 *  et « Maîtrise ★2 » flotte au-dessus du héros quand il monte.
 *
 *  Compétence :  <Sans maîtrise>        ne compte jamais
 *  Dans une formule :  a.niveauMaitrise(12)   le niveau de la compétence 12
 *  Commandes :
 *      MAITRISE 1 12 +10    héros 1, compétence 12 : 10 utilisations de plus
 *      MAITRISE 1 12 =0     remise à zéro
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES STATISTIQUES DE COMBAT
 * ═══════════════════════════════════════════════════════════════════════════
 *  Une entrée « Statistiques » dans le menu : combats gagnés, fuites,
 *  défaites, et pour chaque héros les dégâts infligés et reçus, les soins,
 *  les ennemis vaincus, ses chutes et son plus gros coup (« Record »).
 *  Commande :
 *      STATS ouvrir
 *  Dans une formule :  $gameActors.actor(1).statsCombat().vaincus
 */
var MaitriseDesCompetences = window.MaitriseDesCompetences || {};
window.MaitriseDesCompetences = MaitriseDesCompetences;
(function () {
    'use strict';
    var P = PluginManager.parameters('MaitriseDesCompetences');
    var PALIERS = String(P.paliers || '5, 15, 30, 50, 80').split(/[,; ]+/).map(Number).filter(function (n) { return n > 0; });
    var BONUS = (P.bonus === undefined || P.bonus === '' ? 4 : Number(P.bonus)) / 100;
    var REDUC = (Number(P.reduction) || 0) / 100;
    var ATTAQUE = String(P.attaque) === 'true';
    var MENU = P.menuStats === undefined ? 'Statistiques' : String(P.menuStats);
    var RE_SANS = /<\s*Sans ma[iî]trise\s*>/i;
    function annoncer(b, t, c) { if (window.CombatTactique && CombatTactique.annoncer) CombatTactique.annoncer(b, t, c); }

    //=========================================================================
    // La maîtrise
    //=========================================================================
    function compte(skill) {
        if (!skill || !DataManager.isSkill(skill) || RE_SANS.test(skill.note || '')) return false;
        if (!ATTAQUE && (skill.id === 1 || skill.id === 2)) return false;
        return true;
    }
    MaitriseDesCompetences.compte = compte;
    function niveauPour(n) { var l = 0; PALIERS.forEach(function (p) { if (n >= p) l++; }); return l; }
    MaitriseDesCompetences.niveauPour = niveauPour;
    MaitriseDesCompetences.niveauMax = function () { return PALIERS.length; };
    Game_Actor.prototype.usagesMaitrise = function (id) { return this._maitrise && this._maitrise[id] || 0; };
    Game_Actor.prototype.niveauMaitrise = function (id) { return compte($dataSkills[id]) ? niveauPour(this.usagesMaitrise(id)) : 0; };
    Game_Enemy.prototype.niveauMaitrise = function () { return 0; };
    Game_Actor.prototype.ajouterMaitrise = function (id, n, fixer) {
        this._maitrise = this._maitrise || {};
        var avant = this.niveauMaitrise(id);
        this._maitrise[id] = Math.max(0, fixer ? n : (this._maitrise[id] || 0) + n);
        var apres = this.niveauMaitrise(id);
        if (apres > avant && $gameParty.inBattle()) {
            annoncer(this, 'Maîtrise ★' + apres + ' — ' + $dataSkills[id].name, '#ffd860');
            AudioManager.playSe({ name: 'Skill3', volume: 70, pitch: 120, pan: 0 });
        }
        return apres;
    };
    var _use = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function (item) {
        _use.call(this, item);
        if (this.isActor() && $gameParty.inBattle() && compte(item)) this.ajouterMaitrise(item.id, 1);
    };
    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _mdv.call(this, target, critical), s = this.subject();
        if (s && s.isActor() && this.isSkill()) {
            var l = s.niveauMaitrise(this.item().id);
            if (l > 0 && BONUS) v = Math.round(v * (1 + l * BONUS));
        }
        return v;
    };
    if (REDUC > 0) {
        var _mp = Game_BattlerBase.prototype.skillMpCost;
        Game_BattlerBase.prototype.skillMpCost = function (skill) {
            var c = _mp.call(this, skill);
            if (this.isActor() && skill) { var l = this.niveauMaitrise(skill.id); if (l) c = Math.floor(c * Math.max(0, 1 - l * REDUC)); }
            return c;
        };
    }
    // ★n en petit sur l'icône
    var _di = Window_SkillList.prototype.drawItem;
    Window_SkillList.prototype.drawItem = function (index) {
        _di.call(this, index);
        var sk = this._data && this._data[index], a = this._actor;
        if (!sk || !a || !a.niveauMaitrise) return;
        var l = a.niveauMaitrise(sk.id);
        if (!l) return;
        var r = this.itemLineRect ? this.itemLineRect(index) : this.itemRectForText(index);
        var fs = this.contents.fontSize, oc = this.contents.outlineWidth;
        this.contents.fontSize = 13; this.contents.outlineWidth = 3;
        this.changeTextColor(l >= PALIERS.length ? '#ffe680' : '#ffd040');
        this.drawText('★' + l, r.x + 12, r.y + this.lineHeight() - 22, 30, 'left');
        this.contents.fontSize = fs; this.contents.outlineWidth = oc;
        this.resetTextColor();
    };

    //=========================================================================
    // Les statistiques
    //=========================================================================
    function vide() { return { degats: 0, recus: 0, soins: 0, vaincus: 0, chutes: 0, plusGros: 0, actions: 0 }; }
    Game_Actor.prototype.statsCombat = function () { return (this._statsCombat = this._statsCombat || vide()); };
    Game_System.prototype.statsCombat = function () {
        return (this._statsCombat = this._statsCombat || { combats: 0, victoires: 0, fuites: 0, defaites: 0, overkills: 0 });
    };
    var _ehd = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function (target, value) {
        var avant = target.hp, vivant = target.isAlive();
        _ehd.call(this, target, value);
        if (!$gameParty.inBattle()) return;
        var s = this.subject(), d = avant - target.hp;
        if (d > 0) {
            if (s && s.isActor() && target.isEnemy()) { var st = s.statsCombat(); st.degats += d; st.plusGros = Math.max(st.plusGros, d); }
            if (target.isActor()) target.statsCombat().recus += d;
            if (vivant && target.hp <= 0) {
                if (target.isActor()) target.statsCombat().chutes++;
                else if (s && s.isActor()) {
                    s.statsCombat().vaincus++;
                    if (target._ctOverkill) $gameSystem.statsCombat().overkills++;
                }
            }
        } else if (d < 0 && s && s.isActor() && target.isActor()) s.statsCombat().soins += -d;
    };
    var _use2 = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function (item) {
        _use2.call(this, item);
        if (this.isActor() && $gameParty.inBattle()) this.statsCombat().actions++;
    };
    // compté une seule fois par combat, à la fin (VictoryAftermath rappelle
    // processVictory à chaque image tant que l'écran de victoire est là)
    var _setup = BattleManager.setup;
    BattleManager.setup = function () { _setup.apply(this, arguments); this._msCompte = false; };
    var _end = BattleManager.endBattle;
    BattleManager.endBattle = function (resultat) {
        if (!this._msCompte) {
            this._msCompte = true;
            var g = $gameSystem.statsCombat();
            if (resultat === 0) { g.combats++; g.victoires++; }
            else if (resultat === 2) { g.combats++; g.defaites++; }
            else if (this._escaped) { g.combats++; g.fuites++; }
        }
        return _end.apply(this, arguments);
    };

    function Window_Statistiques() { this.initialize.apply(this, arguments); }
    Window_Statistiques.prototype = Object.create(Window_Selectable.prototype);
    Window_Statistiques.prototype.constructor = Window_Statistiques;
    Window_Statistiques.prototype.initialize = function () {
        Window_Selectable.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.refresh();
    };
    Window_Statistiques.prototype.maxItems = function () { return 0; };
    Window_Statistiques.prototype.refresh = function () {
        this.contents.clear();
        var g = $gameSystem.statsCombat(), lh = this.lineHeight(), w = this.contentsWidth(), y = 0, self = this;
        this.changeTextColor(this.systemColor());
        this.drawText('Statistiques de combat', 0, y, w, 'center'); y += lh;
        this.resetTextColor();
        var ligne = [['Combats', g.combats], ['Victoires', g.victoires], ['Fuites', g.fuites], ['Défaites', g.defaites], ['Overkills', g.overkills]];
        var cw = Math.floor(w / ligne.length);
        ligne.forEach(function (p, i) {
            self.changeTextColor(self.systemColor()); self.drawText(p[0], i * cw, y, cw, 'center');
            self.resetTextColor(); self.drawText(String(p[1]), i * cw, y + lh, cw, 'center');
        });
        y += lh * 2 + 12;
        var cols = [['Héros', 0], ['Dégâts', 1], ['Reçus', 1], ['Soins', 1], ['Vaincus', 1], ['Chutes', 1], ['Record', 1]];
        var c0 = Math.floor(w * 0.22), cx = Math.floor((w - c0) / (cols.length - 1));
        this.contents.fontSize -= 4;
        this.changeTextColor(this.systemColor());
        cols.forEach(function (c, i) { self.drawText(c[0], i ? c0 + (i - 1) * cx : 0, y, i ? cx : c0, i ? 'right' : 'left'); });
        this.resetTextColor();
        y += lh;
        var acteurs = $gameParty.allMembers ? $gameParty.allMembers() : $gameParty.members();
        acteurs.forEach(function (a) {
            if (y > self.contentsHeight() - lh) return;
            var s = a.statsCombat();
            var v = [a.name(), s.degats, s.recus, s.soins, s.vaincus, s.chutes, s.plusGros];
            v.forEach(function (x, i) { self.drawText(String(x), i ? c0 + (i - 1) * cx : 0, y, i ? cx : c0, i ? 'right' : 'left'); });
            y += lh;
        });
        this.contents.fontSize += 4;
    };
    MaitriseDesCompetences.Window_Statistiques = Window_Statistiques;

    function Scene_Statistiques() { this.initialize.apply(this, arguments); }
    Scene_Statistiques.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Statistiques.prototype.constructor = Scene_Statistiques;
    Scene_Statistiques.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._fenetre = new Window_Statistiques();
        this._fenetre.setHandler('cancel', this.popScene.bind(this));
        this._fenetre.activate();
        this.addWindow(this._fenetre);
    };
    Scene_Statistiques.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('ok') || TouchInput.isTriggered()) { SoundManager.playCancel(); this.popScene(); }
    };
    window.Scene_Statistiques = Scene_Statistiques;

    if (MENU) {
        var _aoc = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () { _aoc.call(this); this.addCommand(MENU, 'statistiques', true); };
        var _ccw = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            _ccw.call(this);
            this._commandWindow.setHandler('statistiques', function () { SceneManager.push(Scene_Statistiques); });
        };
    }

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pc.call(this, command, args);
        var c = String(command || '').toUpperCase();
        if (c === 'STATS' && /^ouvrir$/i.test(args[0] || '')) SceneManager.push(Scene_Statistiques);
        else if (c === 'MAITRISE' || c === 'MAÎTRISE') {
            var a = $gameActors.actor(Number(args[0])), id = Number(args[1]), n = String(args[2] || '+1');
            if (!a || !$dataSkills[id]) return;
            if (n[0] === '=') a.ajouterMaitrise(id, Number(n.slice(1)) || 0, true);
            else a.ajouterMaitrise(id, Number(n) || 0);
        }
    };
})();
