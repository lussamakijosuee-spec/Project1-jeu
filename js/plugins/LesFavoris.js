//=============================================================================
// LesFavoris.js
//=============================================================================
/*:
 * @plugindesc v1.0 ■ En combat : « ★ Favoris » (les techniques qu'on épingle)
 * et « ↻ Refaire » (la dernière technique, sur la même cible), sous l'Attaque.
 * @author Projet Trois Sources
 *
 * @param favoris
 * @text Le menu « Favoris »
 * @type boolean
 * @default true
 *
 * @param nomFavoris
 * @text Son nom
 * @default ★ Favoris
 *
 * @param favorisMax
 * @text Combien de favoris par héros
 * @type number
 * @min 1
 * @default 8
 *
 * @param touches
 * @text Épingler : touches
 * @desc Les touches de MV qui épinglent la technique sous le curseur, séparées par des virgules.
 * @default shift
 *
 * @param appuiLong
 * @text Épingler : appui long (souris, doigt)
 * @type boolean
 * @default true
 *
 * @param refaire
 * @text La commande « Refaire »
 * @type boolean
 * @default true
 *
 * @param signeRefaire
 * @text Son signe
 * @default ↻
 *
 * @param pasRefaire
 * @text Techniques qu'on ne « refait » pas
 * @desc Numéros de compétences, séparés par des virgules (ᛟ Activer a déjà sa ligne).
 * @default 1309
 *
 * @help
 * ============================================================================
 *  JOKO, 2026-11-10 — à « si je devais améliorer un truc ? » : les menus de
 *  capacités (Korrah 92 lignes, Aël 93, ludwing 72, neuf à l'écran) ; à la
 *  proposition des Favoris et de « Refaire » : « Pourquoi pas ».
 * ============================================================================
 *  ★ FAVORIS. Dans une liste de techniques (en combat ou au menu), Maj — ou un
 *  appui long, à la souris ou au doigt — épingle la technique sous le curseur
 *  (une étoile sur son icône) ; la même touche l'enlève. Jusqu'à 8 par héros,
 *  gardés dans la sauvegarde. En combat, « ★ Favoris » sous l'Attaque les
 *  ouvre, dans l'ordre où on les a épinglés. Un favori qu'on ne peut pas lancer
 *  (pas assez de mana, recharge, scellé) est grisé, comme partout ; un favori
 *  que le héros ne voit plus dans aucun menu (un autre Style de Vesper, l'Hiver
 *  de Korrah sans seiryu) n'est pas montré, et revient avec lui.
 *
 *  ↻ REFAIRE. Sous l'Attaque, « ↻ Nom » : la dernière technique que ce héros a
 *  choisie. OK la relance par le même chemin qu'en la choisissant dans sa
 *  liste (une rune de zone redemande « Garder / Piège », une attaque à
 *  plusieurs vérifie ses héros), et le curseur est déjà sur la même cible si
 *  elle est encore là. Grisée si on ne peut pas la lancer.
 *
 *  Rien n'est retiré : toutes les listes restent où elles sont. Aucune fiche
 *  n'est touchée.
 *
 *  Pour un script ou un banc :
 *      Favoris.de(acteur)            → les numéros épinglés
 *      Favoris.basculer(acteur, id)  → épingle / enlève ; rend true si épinglé
 *      Favoris.derniere(acteur)      → la technique de « Refaire » (ou null)
 */
var Favoris = window.Favoris || {};
window.Favoris = Favoris;
(function () {
    'use strict';
    var P = PluginManager.parameters('LesFavoris');
    function oui(k, d) { return String(P[k] === undefined || P[k] === '' ? d : P[k]) === 'true'; }
    var FAVORIS = oui('favoris', 'true');
    var NOM = String(P.nomFavoris || '★ Favoris');
    var MAX = Math.max(1, Number(P.favorisMax || 8) || 8);
    var TOUCHES = String(P.touches || 'shift').split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    var LONG = oui('appuiLong', 'true');
    var REFAIRE = oui('refaire', 'true');
    var SIGNE = String(P.signeRefaire || '↻');
    var PAS = String(P.pasRefaire || '1309').split(',').map(function (x) { return Number(x); }).filter(Boolean);
    var TYPE_FAVORIS = 904, TYPE_REFAIRE = 905;          // des branches qui n'existent que dans le menu (901-903 : les arts)
    Favoris.TYPE_FAVORIS = TYPE_FAVORIS; Favoris.TYPE_REFAIRE = TYPE_REFAIRE;

    function enCombat() { return !!($gameParty && $gameParty.inBattle()); }
    function heros(a) { return !!(a && a.isActor && a.isActor() && !a.isAutoBattle()); }

    //=========================================================================
    // Ce qui est épinglé
    //=========================================================================
    Favoris.de = function (a) { return (a && a._favoris) ? a._favoris.slice() : []; };
    Favoris.est = function (a, id) { return !!(a && a._favoris && a._favoris.indexOf(id) >= 0); };
    Favoris.basculer = function (a, id) {
        if (!a || !$dataSkills[id]) return false;
        a._favoris = a._favoris || [];
        var i = a._favoris.indexOf(id);
        if (i >= 0) { a._favoris.splice(i, 1); return false; }
        if (a._favoris.length >= MAX) return null;           // plein
        a._favoris.push(id);
        return true;
    };

    // Une technique est-elle visible dans un des menus du héros, maintenant ?
    function typesDuHeros(a) {
        var t = a.addedSkillTypes().slice();
        [901, 902, 903].forEach(function (x) { t.push(x); });
        return t;
    }
    function visible(a, s) {
        if (!s || !a.isLearnedSkill(s.id) && a.skills().indexOf(s) < 0) return false;
        var f = Object.create(Window_SkillList.prototype); f._actor = a;
        return typesDuHeros(a).some(function (t) { f._stypeId = t; return Window_SkillList.prototype.includes.call(f, s); });
    }
    Favoris.visibles = function (a) {
        var connues = a.skills();
        return Favoris.de(a).map(function (id) { return $dataSkills[id]; })
            .filter(function (s) { return s && connues.indexOf(s) >= 0 && visible(a, s); });
    };
    Favoris.derniere = function (a) {
        if (!a || !a.lastBattleSkill) return null;
        var s = a.lastBattleSkill();
        if (!s || PAS.indexOf(s.id) >= 0 || s.id === a.attackSkillId() || s.id === a.guardSkillId()) return null;
        if (a.skills().indexOf(s) < 0 || !visible(a, s)) return null;
        return s;
    };
    function nomCourt(s) { var n = String(s.name), i = n.indexOf(' : '); return i >= 0 ? n.slice(i + 3) : n; }

    //=========================================================================
    // Les deux listes
    //=========================================================================
    var _liste = Window_SkillList.prototype.makeItemList;
    Window_SkillList.prototype.makeItemList = function () {
        if (this._actor && this._stypeId === TYPE_FAVORIS) { this._data = Favoris.visibles(this._actor); return; }
        if (this._actor && this._stypeId === TYPE_REFAIRE) { var s = Favoris.derniere(this._actor); this._data = s ? [s] : []; return; }
        _liste.call(this);
    };
    var _aide = Window_SkillList.prototype.updateHelp;
    Window_SkillList.prototype.updateHelp = function () {
        _aide.call(this);
        if (this._stypeId === TYPE_FAVORIS && this._helpWindow && !(this._data && this._data.length)) {
            this._helpWindow.setText('★ Aucun favori pour l\'instant.\nDans une liste de techniques : Maj (ou un appui long) épingle la technique.');
        }
    };
    // l'étoile sur l'icône d'une technique épinglée
    var _dessin = Window_SkillList.prototype.drawItem;
    Window_SkillList.prototype.drawItem = function (index) {
        _dessin.call(this, index);
        var s = this._data && this._data[index];
        if (!FAVORIS || !s || !this._actor || !Favoris.est(this._actor, s.id)) return;
        var r = this.itemRect(index), t = this.contents.fontSize;
        this.contents.fontSize = 14;
        this.changeTextColor(this.textColor(17));
        this.drawText('★', r.x + 18, r.y - 9, 20, 'left');
        this.contents.fontSize = t;
        this.resetTextColor();
    };

    // épingler : Maj, ou un appui long, sur la ligne sous le curseur
    Window_SkillList.prototype.epingler = function () {
        var s = this.item(), a = this._actor;
        if (!FAVORIS || !s || !a || !a.isActor() || !DataManager.isSkill(s)) return false;
        var r = Favoris.basculer(a, s.id);
        if (r === null) { SoundManager.playBuzzer(); if (this._helpWindow) this._helpWindow.setText('★ ' + MAX + ' favoris déjà : enlève-en un d\'abord (Maj sur une technique épinglée).'); return false; }
        SoundManager.playEquip();
        var i = this.index(), haut = this.topRow();
        this.refresh();
        this.setTopRow(haut);
        this.select(Math.max(0, Math.min(i, this.maxItems() - 1)));
        if (!this.maxItems()) this.updateHelp();
        return true;
    };
    var _saisie = Window_SkillList.prototype.processHandling;
    Window_SkillList.prototype.processHandling = function () {
        if (FAVORIS && this.isOpenAndActive() && this.visible) {
            for (var i = 0; i < TOUCHES.length; i++) { if (Input.isTriggered(TOUCHES[i])) { this.epingler(); return; } }
            if (LONG) {
                if (!TouchInput.isPressed()) this._favLong = false;
                else if (TouchInput.isLongPressed() && !this._favLong && this.isTouchedInsideFrame()) {
                    this._favLong = true;
                    var x = this.canvasToLocalX(TouchInput.x), y = this.canvasToLocalY(TouchInput.y);
                    if (this.hitTest(x, y) === this.index() && this.index() >= 0) { this.epingler(); return; }
                }
            }
        }
        _saisie.call(this);
    };

    //=========================================================================
    // Les deux commandes, sous l'Attaque
    //=========================================================================
    var _attaque = Window_ActorCommand.prototype.addAttackCommand;
    Window_ActorCommand.prototype.addAttackCommand = function () {
        _attaque.call(this);
        var a = this._actor;
        if (!enCombat() || !heros(a)) return;
        if (REFAIRE) {
            var s = Favoris.derniere(a);
            if (s) this.addCommand(SIGNE + ' ' + nomCourt(s), 'skill', a.canUse(s), TYPE_REFAIRE);
        }
        if (FAVORIS) this.addCommand(NOM, 'skill', true, TYPE_FAVORIS);
    };
    // Nos deux lignes ne sont pas des branches de la base : pendant que les branches s'ajoutent, elles sortent de la
    // liste, puis y reviennent à leur place. (LesStylesDeVesper retire toute branche « vide pour ce Style » — elles y
    // passaient chez Vesper —, et LesTroisArts range « ce qui vient d'être ajouté » en comptant les lignes : une
    // ligne retirée au milieu décalait son compte, et « capacité » passait devant les Voies.)
    var _branches = Window_ActorCommand.prototype.addSkillCommands;
    Window_ActorCommand.prototype.addSkillCommands = function () {
        var moi = this, gardees = [];
        this._list.forEach(function (c, i) { if (c.symbol === 'skill' && (c.ext === TYPE_FAVORIS || c.ext === TYPE_REFAIRE)) gardees.push({ c: c, i: i }); });
        this._list = this._list.filter(function (c) { return !(c.symbol === 'skill' && (c.ext === TYPE_FAVORIS || c.ext === TYPE_REFAIRE)); });
        _branches.call(this);
        gardees.forEach(function (g) { moi._list.splice(Math.min(g.i, moi._list.length), 0, g.c); });
    };

    // « Refaire » : la liste n'a qu'une ligne — OK dessus tout de suite, par le vrai chemin
    var _commande = Scene_Battle.prototype.commandSkill;
    Scene_Battle.prototype.commandSkill = function () {
        _commande.call(this);
        var w = this._skillWindow;
        if (this._actorCommandWindow.currentExt() !== TYPE_REFAIRE) return;
        w.select(0);
        if (w.item() && w.isCurrentItemEnabled()) { w.deactivate(); this._favRefaire = true; this.onSkillOk(); this._favRefaire = false; }
    };

    // la même cible : on la retient quand elle est choisie, on y remet le curseur
    var _ennemiOk = Scene_Battle.prototype.onEnemyOk;
    Scene_Battle.prototype.onEnemyOk = function () {
        var a = BattleManager.actor(), e = this._enemyWindow.enemy();
        if (a && e) a._favCible = { ennemi: e.index() };
        _ennemiOk.call(this);
    };
    var _allieOk = Scene_Battle.prototype.onActorOk;
    Scene_Battle.prototype.onActorOk = function () {
        var a = BattleManager.actor();
        if (a) a._favCible = { allie: this._actorWindow.index() };
        _allieOk.call(this);
    };
    var _choixEnnemi = Scene_Battle.prototype.selectEnemySelection;
    Scene_Battle.prototype.selectEnemySelection = function () {
        _choixEnnemi.call(this);
        var a = BattleManager.actor(), c = a && a._favCible, w = this._enemyWindow;
        if (!this._favRefaire || !c || c.ennemi === undefined || !w._enemies) return;
        for (var i = 0; i < w._enemies.length; i++) { if (w._enemies[i].index() === c.ennemi && w._enemies[i].isAlive()) { w.select(i); break; } }
    };
    var _choixAllie = Scene_Battle.prototype.selectActorSelection;
    Scene_Battle.prototype.selectActorSelection = function () {
        _choixAllie.call(this);
        var a = BattleManager.actor(), c = a && a._favCible;
        if (!this._favRefaire || !c || c.allie === undefined) return;
        if (c.allie >= 0 && c.allie < $gameParty.battleMembers().length) this._actorWindow.select(c.allie);
    };
})();
