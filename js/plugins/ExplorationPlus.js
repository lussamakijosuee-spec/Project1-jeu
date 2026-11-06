//=============================================================================
// ExplorationPlus.js — v1.0  ·  Attaque surprise, furtivité, sols dangereux
// RPG Maker MV   ·   pour JOKO
//   Inspiré, sans rien en copier, de Event Encounter Aid, Event Chase
//   Stealth et Floor Damage (Yanfly).
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Prendre un ennemi visible de dos (ou se faire prendre),
 * se faufiler sans être vu, des sols qui blessent selon la région.
 * @author JOKO
 *
 * @param surprise
 * @text Attaque surprise : active ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @param surpriseEnnemi
 * @text Attaque surprise : l'ennemi peut aussi nous surprendre ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @param furtifRayon
 * @text Furtivité : distance où l'on est quand même repéré
 * @type number
 * @min 0
 * @default 1
 * @desc En cases. 1 = seulement collé à l'ennemi ; 0 = jamais.
 *
 * @param furtifOpacite
 * @text Furtivité : opacité du héros
 * @type number
 * @min 0
 * @max 255
 * @default 130
 *
 * @param sols
 * @text Sols dangereux (toutes les cartes)
 * @type note
 * @default ""
 * @desc Une région par ligne :  5: 10%   ·   6: 20 état 4   (dégâts par pas : % des PV max, ou un nombre)
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'ATTAQUE SURPRISE
 * ═══════════════════════════════════════════════════════════════════════════
 *  Quand un ennemi visible de la carte lance un combat (« Combat » dans son
 *  événement) :
 *   · le joueur le touche DANS LE DOS → avantage (« attaque préventive ») ;
 *   · l'ennemi touche le joueur dans le dos → c'est l'ennemi qui l'a.
 *  Un « ennemi visible », c'est un événement qui poursuit le joueur
 *  (this._chaseRange) ou qui se déclenche au contact. Les combats de boss
 *  ne sont jamais concernés.
 *  Commentaire dans la page :  <Pas de surprise>   jamais pour celui-ci
 *                              <Surprise>          aussi pour celui-ci
 *                                                  (déclenché par la touche OK)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA FURTIVITÉ
 * ═══════════════════════════════════════════════════════════════════════════
 *  En furtivité, le héros est à demi transparent et les ennemis qui
 *  poursuivent (YEP_EventChasePlayer) ne le repèrent plus, sauf collés à
 *  lui ; ceux qui le poursuivaient perdent sa trace.
 *  Commandes :
 *      FURTIVITE on
 *      FURTIVITE off
 *      FURTIVITE 30      pendant 30 secondes
 *  Objet utilisé depuis le menu :  <Furtivité: 30>     30 secondes
 *  Équipement ou état du héros de tête :  <Furtif>     tant qu'il le porte
 *  Dans une condition :  $gamePlayer.estFurtif()
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES SOLS DANGEREUX
 * ═══════════════════════════════════════════════════════════════════════════
 *  Chaque pas sur la région blesse toute l'équipe (l'écran rougit).
 *  Paramètre « Sols dangereux », une ligne par région, pour tout le jeu :
 *      5: 10%          10 % des PV max par pas
 *      6: 20 état 4    20 PV par pas, et l'état 4 (poison…)
 *  Ou dans la NOTE d'une carte, pour elle seule :
 *      <Sol dangereux 5: 10%>
 *      <Sol dangereux 7: 30 état 4>
 *  Protection (héros, classe, équipement, état) :
 *      <Immunité sol>          tous les sols
 *      <Immunité sol: 5, 6>    seulement ces régions
 *  Mourir sur un sol suit la case « Mort par dégâts de sol » de la Base de
 *  données (Système), comme les sols de RPG Maker.
 */
var ExplorationPlus = window.ExplorationPlus || {};
window.ExplorationPlus = ExplorationPlus;
(function () {
    'use strict';
    var P = PluginManager.parameters('ExplorationPlus');
    var SURPRISE = String(P.surprise || 'true') !== 'false';
    var SURPRISE_ENNEMI = String(P.surpriseEnnemi || 'true') !== 'false';
    var RAYON = P.furtifRayon === undefined || P.furtifRayon === '' ? 1 : Number(P.furtifRayon);
    var OPACITE = P.furtifOpacite === undefined || P.furtifOpacite === '' ? 130 : Number(P.furtifOpacite);
    var SOLS_TEXTE = (function () { var t = String(P.sols || ''); try { if (/^"/.test(t)) t = JSON.parse(t); } catch (e) { /* tel quel */ } return t; })();

    function noteDe(o) { return window.CombatTactique ? CombatTactique.note(o) : (o && o.note) || ''; }
    function commentaires(page) {
        if (!page || !page.list) return '';
        return page.list.filter(function (c) { return c.code === 108 || c.code === 408; }).map(function (c) { return c.parameters[0]; }).join('\n');
    }
    function estBoss(b) {
        if (window.MecaBoss && MecaBoss.estBoss) return MecaBoss.estBoss(b);
        var e = b && b.enemy && b.enemy();
        return !!(e && e.meta && (e.meta.Boss || e.meta.Mahoraga || e.meta.DonoBoss || e.meta.Radahn));
    }

    //=========================================================================
    // L'attaque surprise
    //=========================================================================
    function directionVers(de, vers) {
        var dx = vers.x - de.x, dy = vers.y - de.y;
        if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 6 : 4;
        return dy > 0 ? 2 : 8;
    }
    // ce qu'il faut : l'événement, sa direction AVANT qu'il se tourne vers
    // le joueur (MV le tourne en démarrant), la direction du joueur
    function jugerSurprise(ev) {
        if (!SURPRISE || !ev || !ev.page()) return 0;
        var c = commentaires(ev.page());
        if (/<\s*Pas de surprise\s*>/i.test(c)) return 0;
        var visible = /<\s*Surprise\s*>/i.test(c) || ev._chaseRange > 0 || ev._trigger === 1 || ev._trigger === 2;
        if (!visible) return 0;
        if ($gameTroop.members().some(estBoss)) return 0;
        var dEv = ev._locked && ev._prelockDirection ? ev._prelockDirection : ev.direction();
        var d = directionVers($gamePlayer, ev), dos = 10 - d;
        var dJ = $gamePlayer.direction();
        if (dJ === d && dEv === d) return 1;                          // il nous tournait le dos
        if (SURPRISE_ENNEMI && dEv === dos && dJ === dos) return -1;  // on lui tournait le dos
        return 0;
    }
    ExplorationPlus.jugerSurprise = jugerSurprise;
    var _c301 = Game_Interpreter.prototype.command301;
    Game_Interpreter.prototype.command301 = function () {
        var avant = $gameParty.inBattle();
        var r = _c301.apply(this, arguments);
        if (!avant && SceneManager.isNextScene(Scene_Battle) && this._eventId > 0 && $gameMap.mapId() === this._mapId) {
            var j = jugerSurprise($gameMap.event(this._eventId));
            if (j > 0) { BattleManager._preemptive = true; BattleManager._surprise = false; }
            else if (j < 0) { BattleManager._preemptive = false; BattleManager._surprise = true; }
            $gameTemp._epSurprise = j;
        }
        return r;
    };

    //=========================================================================
    // La furtivité
    //=========================================================================
    Game_Player.prototype.estFurtif = function () {
        var s = $gameSystem;
        if (s._epFurtif === true) return true;
        if (s._epFurtifFin && Graphics.frameCount < s._epFurtifFin) return true;
        var tete = $gameParty.leader();
        return !!(tete && tete.traitObjects().some(function (o) { return o && /<\s*(?:Furtif|Stealth)\s*>/i.test(noteDe(o)); }));
    };
    Game_System.prototype.furtivite = function (secondes) {
        if (secondes === true || secondes === false) { this._epFurtif = secondes; this._epFurtifFin = 0; return; }
        this._epFurtif = false;
        this._epFurtifFin = Graphics.frameCount + Math.round(Number(secondes) * 60);
    };
    // les minuteurs survivent à la sauvegarde : le compteur d'images repart à 0
    var _sOnBS = Game_System.prototype.onBeforeSave;
    Game_System.prototype.onBeforeSave = function () {
        _sOnBS.call(this);
        this._epFurtifReste = this._epFurtifFin ? Math.max(0, this._epFurtifFin - Graphics.frameCount) : 0;
    };
    var _sOnAL = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function () {
        _sOnAL.call(this);
        this._epFurtifFin = this._epFurtifReste ? Graphics.frameCount + this._epFurtifReste : 0;
    };
    if (Game_Event.prototype.chaseConditions) {
        var _chase = Game_Event.prototype.chaseConditions;
        Game_Event.prototype.chaseConditions = function (dis) {
            if ($gamePlayer.estFurtif()) {
                this._alertLock = 0;
                return RAYON > 0 && dis <= RAYON;
            }
            return _chase.call(this, dis);
        };
    }
    var _pUpdate = Game_Player.prototype.update;
    Game_Player.prototype.update = function (sceneActive) {
        _pUpdate.call(this, sceneActive);
        var f = this.estFurtif();
        if (f !== this._epEtaitFurtif) {
            this._epEtaitFurtif = f;
            var op = f ? OPACITE : 255;
            this.setOpacity(op);
            this._followers.forEach(function (s) { s.setOpacity(op); });
        }
    };
    var _useItem = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function (item) {
        _useItem.call(this, item);
        var m = !$gameParty.inBattle() && item && /<\s*Furtivit[ée]\s*:\s*(\d+)\s*>/i.exec(noteDe(item));
        if (m) $gameSystem.furtivite(Number(m[1]));
    };

    //=========================================================================
    // Les sols dangereux
    //=========================================================================
    function lireSols(texte, re) {
        var sols = {};
        var m;
        re.lastIndex = 0;
        while ((m = re.exec(texte))) {
            var regions = m[1].split(/[, ]+/).map(Number).filter(function (n) { return n > 0; });
            var corps = m[2];
            var deg = /^\s*(\d+(?:\.\d+)?)\s*(%?)/.exec(corps);
            var etat = /[ée]tat\s*(\d+)/i.exec(corps);
            regions.forEach(function (r) {
                sols[r] = { valeur: deg ? Number(deg[1]) : 0, pourcent: !!(deg && deg[2]), etat: etat ? Number(etat[1]) : 0 };
            });
        }
        return sols;
    }
    var SOLS_JEU = lireSols(SOLS_TEXTE, /^\s*([\d, ]+?)\s*:\s*([^\n;]+)/gm);
    ExplorationPlus.solsDuJeu = SOLS_JEU;
    ExplorationPlus.solIci = function () {
        var r = $gameMap.regionId($gamePlayer.x, $gamePlayer.y);
        if (!r) return null;
        var carte = $dataMap ? lireSols($dataMap.note || '', /<\s*Sol dangereux\s+([\d, ]+?)\s*:\s*([^>]+)>/gi) : {};
        return carte[r] || SOLS_JEU[r] || null;
    };
    function immunise(a, region) {
        return a.traitObjects().some(function (o) {
            var m = o && /<\s*Immunit[ée] sol\s*(?::\s*([^>]*))?>/i.exec(noteDe(o));
            if (!m) return false;
            if (!m[1] || !m[1].trim()) return true;
            return m[1].split(/[, ]+/).map(Number).indexOf(region) >= 0;
        });
    }
    var _walk = Game_Party.prototype.onPlayerWalk;
    Game_Party.prototype.onPlayerWalk = function () {
        _walk.call(this);
        if (!$gamePlayer.isNormal()) return;
        var sol = ExplorationPlus.solIci();
        if (!sol) return;
        var region = $gameMap.regionId($gamePlayer.x, $gamePlayer.y), touche = false;
        this.members().forEach(function (a) {
            if (!a.isAlive() || immunise(a, region)) return;
            var d = sol.pourcent ? Math.max(1, Math.floor(a.mhp * sol.valeur / 100)) : Math.floor(sol.valeur);
            d = Math.min(d, a.maxFloorDamage ? a.maxFloorDamage() : Math.max(a.hp - 1, 0));
            if (d > 0) { a.gainHp(-d); touche = true; }
            if (sol.etat && $dataStates[sol.etat]) { a.addState(sol.etat); touche = true; }
        });
        if (touche) $gameScreen.startFlashForDamage();
    };

    //=========================================================================
    // Les commandes
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pc.call(this, command, args);
        var c = String(command || '').toUpperCase();
        if (c !== 'FURTIVITE' && c !== 'FURTIVITÉ') return;
        var a = String(args[0] || '').toLowerCase();
        if (a === 'on') $gameSystem.furtivite(true);
        else if (a === 'off') $gameSystem.furtivite(false);
        else if (Number(a) > 0) $gameSystem.furtivite(Number(a));
    };
})();
