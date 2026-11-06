//=============================================================================
// InterfacePlus.js — v1.0  ·  Touches, images cliquables, menus maison
// RPG Maker MV   ·   pour JOKO
//   Inspiré, sans rien en copier, de Button Common Events, Picture Common
//   Events et Common Event Menu (Yanfly). Rien n'est branché par défaut.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Touches, images cliquables, menu d'événements communs,
 * événements communs automatiques, CHOISIR, boutique conditionnelle, sauvegarde auto.
 * @author JOKO
 *
 * @param touches
 * @text Touches → événements communs
 * @type note
 * @default ""
 * @desc Une par ligne : « M = 1050 » (la touche M lance l'événement commun 1050). Vide = aucune.
 *
 * @param evenementsAuto
 * @text Événements communs automatiques
 * @type note
 * @default ""
 * @desc Une par ligne : « victoire = 1202 ». Moments : nouvelle partie, chargement, victoire, fuite, défaite, niveau.
 *
 * @param sauvegardeAuto
 * @text Sauvegarde automatique (défaut)
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Valeur de départ de l'option « Sauvegarde auto ». Le joueur peut la changer dans les Options.
 *
 * @param variableHeros
 * @text Variable : héros qui monte de niveau
 * @type variable
 * @default 0
 * @desc Avant l'événement « niveau », cette variable reçoit le numéro du héros. 0 = aucune.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  TOUCHES, IMAGES CLIQUABLES, MENUS MAISON
 * ═══════════════════════════════════════════════════════════════════════════
 *  ── UNE TOUCHE, UN ÉVÉNEMENT COMMUN ───────────────────────────────────
 *  Dans les paramètres :   M = 1050      (une par ligne)
 *  Ou en jeu :
 *      TOUCHE M 1050      la touche M lance l'événement commun 1050
 *      TOUCHE M off       la touche M ne fait plus rien
 *  Sur la carte, quand rien d'autre ne se passe. Touches libres : les
 *  lettres sauf Q W X Z, et les chiffres 1 à 9 (les autres servent déjà).
 *  Pour une carte du monde, un journal, un pouvoir de terrain…
 *
 *  ── UNE IMAGE CLIQUABLE ───────────────────────────────────────────────
 *      IMAGE clic 3 1020     un clic sur l'image n°3 lance l'événement commun 1020
 *      IMAGE clic 3 off
 *  Avec « Afficher une image », de quoi faire tes propres écrans : une carte
 *  où l'on clique sur une ville, un inventaire en images, un code à taper.
 *  L'image grossit un peu quand la souris passe dessus.
 *
 *  ── UN MENU D'ÉVÉNEMENTS COMMUNS ──────────────────────────────────────
 *      MENU_EC 1001 1002 1005        ou     MENU_EC 1001-1010
 *  Une liste s'ouvre avec le NOM de ces événements communs ; le joueur en
 *  choisit un, il est joué, puis l'événement reprend. Échap : rien.
 *  Un commentaire <si: s[12]> dans l'événement commun : il n'apparaît dans
 *  le menu que si l'interrupteur 12 est ON (s[n], v[n], ou du JavaScript)
 *  — de quoi débloquer des destinations au fil du jeu. Le premier
 *  commentaire de l'événement commun sert d'aide.
 *
 *  ── DES ÉVÉNEMENTS COMMUNS QUI SE LANCENT TOUT SEULS ──────────────────
 *  Dans le paramètre « Événements communs automatiques », une ligne par
 *  moment :
 *      nouvelle partie = 1200        chargement = 1201
 *      victoire = 1202     fuite = 1203     défaite = 1204
 *      niveau = 1205       (un héros monte de niveau ; son numéro va dans
 *                           la variable du paramètre « Variable : héros »)
 *  Ils se jouent sur la carte, l'un après l'autre, quand rien d'autre ne
 *  tourne. Pour un récapitulatif après un combat, un mot d'un compagnon au
 *  premier niveau gagné, un rappel en reprenant une sauvegarde…
 *
 *  ── LE JOUEUR CHOISIT UNE COMPÉTENCE OU UN ÉQUIPEMENT ─────────────────
 *      CHOISIR competence 20         une compétence du chef d'équipe → v20
 *      CHOISIR competence 20 3       … du héros n°3
 *      CHOISIR arme 20               une arme du sac → v20
 *      CHOISIR armure 20             une armure du sac → v20
 *  La variable reçoit le numéro de ce qui a été choisi (0 si Échap). Pour
 *  une énigme (« montre-moi la Lame de Givre »), un forgeron, un maître
 *  d'armes qui juge une technique.
 *
 *  ── LA SAUVEGARDE AUTOMATIQUE ─────────────────────────────────────────
 *  Après un changement de carte et après un combat, la partie se sauve
 *  toute seule — dans l'emplacement où le joueur a LUI-MÊME sauvegardé ou
 *  chargé cette partie. Une nouvelle partie jamais sauvegardée n'écrit
 *  rien : on n'écrase jamais la sauvegarde de quelqu'un d'autre. Jamais
 *  pendant un événement ; au plus une fois toutes les 20 secondes. Un petit
 *  « Sauvegarde auto » s'affiche en haut à droite.
 *  Option « Sauvegarde auto » (Oui / Non) dans le menu Options.
 *      SAUVEGARDE_AUTO off      couper pour une zone (un donjon piégé…)
 *      SAUVEGARDE_AUTO on       la remettre
 *      SAUVEGARDE_AUTO maintenant    sauver tout de suite (si permis)
 *
 *  ── L'HABILLAGE DES FENÊTRES ──────────────────────────────────────────
 *      FENETRE Blue        les fenêtres prennent img/windows/Blue.png
 *      FENETRE défaut      retour à img/system/Window.png
 *  Les dix habillages du pack de Yanfly : Blue, Cyan, Default, Green, Grey,
 *  Magenta, Orange, Red, Violet, Yellow. Gardé dans la sauvegarde. Pour un
 *  chapitre, un rêve, un souvenir.
 *
 *  ── UN OBJET DE BOUTIQUE QUI N'APPARAÎT QUE SI… ───────────────────────
 *  Note de l'objet, de l'arme ou de l'armure :   <Boutique si: s[12]>
 *  Il n'est en vente (dans toutes les boutiques) que si c'est vrai.
 *  s[n], v[n], ou du JavaScript.
 */
var InterfacePlus = window.InterfacePlus || {};
window.InterfacePlus = InterfacePlus;
(function () {
    'use strict';
    var P = PluginManager.parameters('InterfacePlus');

    //=========================================================================
    // Les touches
    //=========================================================================
    var DEFAUT = {};
    (function () {
        var brut = P.touches || '';
        try { brut = JSON.parse(brut); } catch (e) { }
        String(brut).split(/\r?\n/).forEach(function (l) {
            var m = /^\s*([A-Za-z0-9])\s*=\s*(\d+)/.exec(l);
            if (m) DEFAUT[m[1].toUpperCase()] = Number(m[2]);
        });
    })();
    var RESERVEES = { Q: 1, W: 1, X: 1, Z: 1 };
    function touches() {
        if (!$gameSystem._ipTouches) $gameSystem._ipTouches = JSON.parse(JSON.stringify(DEFAUT));
        return $gameSystem._ipTouches;
    }
    InterfacePlus.touches = function () { return touches(); };
    var enAttente = [];
    document.addEventListener('keydown', function (e) {
        if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;
        var k = (e.key || '').toUpperCase();
        if (/^[A-Z0-9]$/.test(k) && !RESERVEES[k]) enAttente.push(k);
    });
    function peutLancer() {
        return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging() && !$gameMap.isEventRunning() &&
            !$gameMessage.isBusy() && !$gamePlayer.isTransferring() && !(window.ConfortDeLecture && ConfortDeLecture.ouvert());
    }
    InterfacePlus.appuyer = function (k) { enAttente.push(String(k).toUpperCase()); };

    //=========================================================================
    // Les images cliquables
    //=========================================================================
    function clics() { return ($gameSystem._ipClics = $gameSystem._ipClics || {}); }
    function spriteImage(scene, n) {
        var c = scene._spriteset && scene._spriteset._pictureContainer;
        if (!c) return null;
        for (var i = 0; i < c.children.length; i++) if (c.children[i]._pictureId === n) return c.children[i];
        return null;
    }
    function sousLaSouris(sp, x, y) {
        if (!sp || !sp.visible || sp.opacity <= 0 || !sp.bitmap || !sp.bitmap.isReady()) return false;
        var b = sp.getBounds();
        return x >= b.x && x < b.x + b.width && y >= b.y && y < b.y + b.height;
    }
    function imageCliquee(scene) {
        var C = clics(), x = TouchInput.x, y = TouchInput.y, trouve = null;
        Object.keys(C).sort(function (a, b) { return b - a; }).some(function (n) {   // la plus haute d'abord
            if (sousLaSouris(spriteImage(scene, Number(n)), x, y)) { trouve = Number(n); return true; }
            return false;
        });
        return trouve;
    }
    InterfacePlus.imageSous = function (x, y) {
        var s = SceneManager._scene, C = clics();
        for (var n in C) if (sousLaSouris(spriteImage(s, Number(n)), x, y)) return Number(n);
        return 0;
    };
    var _pmt = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function () {
        if (TouchInput.isTriggered() && Object.keys(clics()).length) {
            var n = imageCliquee(this);
            if (n) { $gameTemp.reserveCommonEvent(clics()[n]); SoundManager.playOk(); TouchInput.clear(); this._touchCount = 0; return; }
        }
        _pmt.call(this);
    };
    // le survol : l'image grossit un peu (et se rétablit)
    var _spu = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function () {
        _spu.call(this);
        if (!$gameSystem || !$gameSystem._ipClics || !$gameSystem._ipClics[this._pictureId]) return;
        var dessus = sousLaSouris(this, TouchInput.x, TouchInput.y);
        var k = dessus ? 1.06 : 1;
        this.scale.x *= k; this.scale.y *= k;
    };
    // un clic sur une image pendant un événement (un menu en images dans une
    // scène) : l'événement commun est joué tout de suite, par-dessus
    var _smu = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        if (TouchInput.isTriggered() && $gameMap.isEventRunning() && Object.keys(clics()).length && !$gameMessage.isBusy()) {
            var n = imageCliquee(this);
            if (n) { $gameMap._interpreter.setupChild($dataCommonEvents[clics()[n]].list, 0); SoundManager.playOk(); TouchInput.clear(); }
        }
        if (enAttente.length) {
            var k = enAttente.shift(), id = touches()[k];
            if (id && peutLancer() && $dataCommonEvents[id]) $gameTemp.reserveCommonEvent(id);
            if (!peutLancer()) enAttente.length = 0;
        }
        _smu.call(this);
    };

    //=========================================================================
    // Le menu d'événements communs
    //=========================================================================
    function nomPropre(c) {
        return String(c.name || '').replace(/^[✎\s]+/, '').replace(/^[^·]{1,30}·\s*/, '').trim() || ('Événement commun ' + c.id);
    }
    function aideDe(c) {
        var l = c.list || [];
        for (var i = 0; i < l.length; i++) {
            if (l[i].code === 108) {
                var t = [l[i].parameters[0]];
                for (var j = i + 1; l[j] && l[j].code === 408; j++) t.push(l[j].parameters[0]);
                return t.join(' ').replace(/^[═\s]+|[═\s]+$/g, '');
            }
            if (l[i].code !== 0) break;
        }
        return '';
    }
    // <si: s[12]> dans un commentaire de l'événement commun : il n'apparaît
    // dans le menu que si la condition est vraie (s[n], v[n], ou du JavaScript)
    // Les balises <nom: expression> d'un texte. L'expression peut contenir « > »
    // (v[3] >= 2) : elle va jusqu'au DERNIER « > » avant la balise suivante,
    // ou avant la fin du texte. ([^>]+ s'arrêtait au « > » de « >= » : la
    // condition devenait « v[3] », vraie dès que la variable n'était pas nulle.)
    function balises(texte, noms) {
        var re = new RegExp('<\\s*(' + noms + ')\\s*:', 'gi'), m, debuts = [], out = [];
        while ((m = re.exec(texte))) debuts.push({ i: m.index, apres: re.lastIndex, nom: m[1].toLowerCase() });
        debuts.forEach(function (d, k) {
            var bout = k + 1 < debuts.length ? debuts[k + 1].i : texte.length;
            var f = texte.lastIndexOf('>', bout - 1);
            if (f >= d.apres) out.push({ nom: d.nom, expr: texte.slice(d.apres, f).trim(), debut: d.i, fin: f + 1 });
        });
        return out;
    }
    function visibleDansLeMenu(c) {
        var ok = true;
        (c.list || []).forEach(function (x) {
            if (x.code !== 108 && x.code !== 408) return;
            balises(String(x.parameters[0] || ''), 'si').forEach(function (b) {
                var js = b.expr.replace(/\bs\[\s*(\d+)\s*\]/g, '$gameSwitches.value($1)').replace(/\bv\[\s*(\d+)\s*\]/g, '$gameVariables.value($1)');
                try { if (!(new Function('return (' + js + ');'))()) ok = false; } catch (e) { console.warn('[InterfacePlus] condition illisible : ' + b.expr); }
            });
        });
        return ok;
    }
    function Window_MenuEC() { this.initialize.apply(this, arguments); }
    Window_MenuEC.prototype = Object.create(Window_Command.prototype);
    Window_MenuEC.prototype.constructor = Window_MenuEC;
    Window_MenuEC.prototype.initialize = function (ids) {
        this._ids = ids;
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = Math.max(0, (Graphics.boxHeight - this.height) / 2 - 40);
    };
    Window_MenuEC.prototype.windowWidth = function () { return 420; };
    Window_MenuEC.prototype.numVisibleRows = function () { return Math.min(8, Math.max(1, this.maxItems())); };
    Window_MenuEC.prototype.makeCommandList = function () {
        (this._ids || []).forEach(function (id) {
            var c = $dataCommonEvents[id];
            if (!c) return;
            if (!visibleDansLeMenu(c)) return;
            this.addCommand(nomPropre(c), 'ec', true, id);
        }, this);
    };
    Window_MenuEC.prototype.updateHelp = function () {
        if (this._helpWindow) this._helpWindow.setText(this.currentExt() ? aideDe($dataCommonEvents[this.currentExt()]) : '');
    };

    InterfacePlus.ouvrirMenu = function (interp, ids) {
        var s = SceneManager._scene;
        if (!(s instanceof Scene_Map)) return;
        var w = new Window_MenuEC(ids);
        var h = new Window_Help(2);
        h.y = Graphics.boxHeight - h.height;
        w.setHelpWindow(h);
        s.addWindow(h); s.addWindow(w);
        interp._ipMenu = { w: w, h: h, choisi: null, fini: false };
        var fermer = function (id) {
            interp._ipMenu.choisi = id; interp._ipMenu.fini = true;
            w.close(); h.close(); w.deactivate();
        };
        w.setHandler('ec', function () { fermer(w.currentExt()); });
        w.setHandler('cancel', function () { fermer(null); });
        if (!w.maxItems()) fermer(null);
        else { w.select(0); w.activate(); }
        interp.setWaitMode('ipMenu');
    };
    var _uwm = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode === 'ipMenu') {
            var m = this._ipMenu;
            if (m && !m.fini) return true;
            this._waitMode = '';
            if (m) {
                this._ipMenu = null;
                // le choix d'abord, la ligne suivante ensuite : on rend la main
                // une image, le temps que l'enfant démarre
                if (m.choisi && $dataCommonEvents[m.choisi]) { this.setupChild($dataCommonEvents[m.choisi].list, this._eventId); return true; }
            }
            return false;
        }
        return _uwm.call(this);
    };
    // le joueur ne marche pas, et le menu principal ne s'ouvre pas, pendant le menu
    var _canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function () {
        var it = $gameMap && $gameMap._interpreter;
        if (it && it._ipMenu && !it._ipMenu.fini) return false;
        return _canMove.call(this);
    };

    //=========================================================================
    // Les événements communs automatiques
    //=========================================================================
    var AUTO = {};
    (function () {
        var brut = P.evenementsAuto || '';
        try { brut = JSON.parse(brut); } catch (e) { }
        String(brut).split(/\r?\n/).forEach(function (l) {
            var m = /^\s*([^=]+?)\s*=\s*(\d+)/.exec(l);
            if (m) AUTO[m[1].toLowerCase().replace(/[éè]/g, 'e')] = Number(m[2]);
        });
    })();
    InterfacePlus.variableHeros = Number(P.variableHeros || 0);
    InterfacePlus.auto = AUTO;
    function fileAuto() { return ($gameTemp._ipAuto = $gameTemp._ipAuto || []); }
    InterfacePlus.lancerAuto = function (moment, heros) {
        var id = AUTO[moment];
        if (id && $dataCommonEvents[id] && $gameTemp) fileAuto().push({ id: id, heros: heros || 0 });
    };
    var _sng = DataManager.setupNewGame;
    DataManager.setupNewGame = function () { _sng.call(this); InterfacePlus.lancerAuto('nouvelle partie'); };
    var _ols = Scene_Load.prototype.onLoadSuccess;
    Scene_Load.prototype.onLoadSuccess = function () { _ols.call(this); InterfacePlus.lancerAuto('chargement'); };
    var _ebat = BattleManager.endBattle;
    BattleManager.endBattle = function (resultat) {
        _ebat.call(this, resultat);
        if (!this.isBattleTest()) InterfacePlus.lancerAuto(resultat === 0 ? 'victoire' : resultat === 2 ? 'defaite' : 'fuite');
    };
    var _lvl = Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp = function () {
        _lvl.call(this);
        if ($gameParty && $gameParty.members().indexOf(this) >= 0) InterfacePlus.lancerAuto('niveau', this.actorId());
    };
    var _smuAuto = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _smuAuto.call(this);
        var f = $gameTemp._ipAuto;
        if (f && f.length && !$gameMap.isEventRunning() && !$gameTemp.isCommonEventReserved() && !SceneManager.isSceneChanging()) {
            var a = f.shift();
            if (a.heros && InterfacePlus.variableHeros > 0) $gameVariables.setValue(InterfacePlus.variableHeros, a.heros);
            $gameTemp.reserveCommonEvent(a.id);
        }
    };

    //=========================================================================
    // Le joueur choisit une compétence, une arme, une armure
    //=========================================================================
    function Window_ChoixObjet() { this.initialize.apply(this, arguments); }
    Window_ChoixObjet.prototype = Object.create(Window_Command.prototype);
    Window_ChoixObjet.prototype.constructor = Window_ChoixObjet;
    Window_ChoixObjet.prototype.initialize = function (objets) {
        this._objets = objets;
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = Math.max(0, (Graphics.boxHeight - this.height) / 2 - 40);
    };
    Window_ChoixObjet.prototype.windowWidth = function () { return 420; };
    Window_ChoixObjet.prototype.numVisibleRows = function () { return Math.min(8, Math.max(1, this.maxItems())); };
    Window_ChoixObjet.prototype.makeCommandList = function () {
        (this._objets || []).forEach(function (o) { this.addCommand(o.name, 'objet', true, o); }, this);
    };
    Window_ChoixObjet.prototype.drawItem = function (index) {
        var r = this.itemRectForText(index);
        this.drawItemName(this._list[index].ext, r.x, r.y, r.width);
    };
    Window_ChoixObjet.prototype.updateHelp = function () {
        var o = this.currentExt();
        if (this._helpWindow) this._helpWindow.setText(o ? o.description : '');
    };
    InterfacePlus.choisir = function (interp, genre, variable, acteurId) {
        var s = SceneManager._scene, objets = [];
        if (!(s instanceof Scene_Map)) return;
        if (genre === 'competence') {
            var a = acteurId ? $gameActors.actor(acteurId) : $gameParty.leader();
            objets = a ? a.skills() : [];
        } else if (genre === 'arme') objets = $gameParty.weapons();
        else if (genre === 'armure') objets = $gameParty.armors();
        var w = new Window_ChoixObjet(objets), h = new Window_Help(2);
        h.y = Graphics.boxHeight - h.height;
        w.setHelpWindow(h);
        s.addWindow(h); s.addWindow(w);
        interp._ipMenu = { w: w, h: h, choisi: null, fini: false, variable: variable };
        var fermer = function (o) {
            $gameVariables.setValue(variable, o ? o.id : 0);
            interp._ipMenu.fini = true;
            w.close(); h.close(); w.deactivate();
        };
        w.setHandler('objet', function () { fermer(w.currentExt()); });
        w.setHandler('cancel', function () { fermer(null); });
        if (!w.maxItems()) fermer(null);
        else { w.select(0); w.activate(); }
        interp.setWaitMode('ipMenu');
    };

    //=========================================================================
    // La sauvegarde automatique
    //=========================================================================
    var DEFAUT_AUTO = String(P.sauvegardeAuto === undefined ? 'true' : P.sauvegardeAuto) !== 'false';
    ConfigManager.autoSauve = DEFAUT_AUTO;
    var _mkS = ConfigManager.makeData;
    ConfigManager.makeData = function () { var c = _mkS.call(this); c.autoSauve = this.autoSauve; return c; };
    var _apS = ConfigManager.applyData;
    ConfigManager.applyData = function (c) { _apS.call(this, c); this.autoSauve = c.autoSauve === undefined ? DEFAUT_AUTO : !!c.autoSauve; };
    var _goS = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function () { _goS.call(this); this.addCommand('Sauvegarde auto', 'autoSauve'); };
    var _stS = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function (index) {
        if (this.commandSymbol(index) === 'autoSauve') return this.getConfigValue('autoSauve') ? 'Oui' : 'Non';
        return _stS.call(this, index);
    };
    // l'emplacement du joueur : celui où il a sauvé ou chargé CETTE partie
    var _sg = DataManager.saveGame;
    DataManager.saveGame = function (id) {
        if ($gameSystem && !InterfacePlus._enAuto) $gameSystem._ipEmplacement = id;
        return _sg.call(this, id);
    };
    var _lg = DataManager.loadGame;
    DataManager.loadGame = function (id) {
        var ok = _lg.call(this, id);
        if (ok && $gameSystem) $gameSystem._ipEmplacement = id;
        return ok;
    };
    InterfacePlus.demanderSauvegarde = function () { if ($gameTemp) $gameTemp._ipAutoSauve = true; };
    InterfacePlus.sauvegardePermise = function () {
        var sys = $gameSystem;
        return !!(sys && ConfigManager.autoSauve && sys._ipEmplacement > 0 && !sys._ipAutoOff && sys.isSaveEnabled() && !DataManager.isBattleTest() && !DataManager.isEventTest());
    };
    InterfacePlus.sauvegarderMaintenant = function () {
        if (!InterfacePlus.sauvegardePermise()) return false;
        var id = $gameSystem._ipEmplacement, ok;
        InterfacePlus._enAuto = true;
        try { $gameSystem.onBeforeSave(); ok = DataManager.saveGame(id); } finally { InterfacePlus._enAuto = false; }
        if (ok) { StorageManager.cleanBackup && StorageManager.cleanBackup(id); InterfacePlus._derniereAuto = Date.now(); InterfacePlus._avis = 120; }
        return ok;
    };
    var _pt = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function () {
        var transfert = this.isTransferring();
        _pt.call(this);
        if (transfert) InterfacePlus.demanderSauvegarde();
    };
    var _ebS = BattleManager.endBattle;
    BattleManager.endBattle = function (resultat) {
        _ebS.call(this, resultat);
        if (resultat !== 2) InterfacePlus.demanderSauvegarde();
    };
    var _smuS = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _smuS.call(this);
        if ($gameTemp._ipAutoSauve && !$gameMap.isEventRunning() && !$gamePlayer.isTransferring() && !SceneManager.isSceneChanging() &&
            !$gameMessage.isBusy() && (!InterfacePlus._derniereAuto || Date.now() - InterfacePlus._derniereAuto > 20000)) {
            $gameTemp._ipAutoSauve = false;
            InterfacePlus.sauvegarderMaintenant();
        }
        if (InterfacePlus._avis > 0 && this._ipAvis) this._ipAvis.montrer(InterfacePlus._avis--);
        else if (this._ipAvis) this._ipAvis.opacity = 0;
    };
    function Sprite_AvisSauvegarde() { this.initialize.apply(this, arguments); }
    Sprite_AvisSauvegarde.prototype = Object.create(Sprite.prototype);
    Sprite_AvisSauvegarde.prototype.constructor = Sprite_AvisSauvegarde;
    Sprite_AvisSauvegarde.prototype.initialize = function () {
        Sprite.prototype.initialize.call(this, new Bitmap(200, 30));
        this.x = Graphics.boxWidth - 210; this.y = 8; this.opacity = 0;
        var b = this.bitmap;
        b.fillRect(0, 0, 200, 30, 'rgba(0,0,0,0.5)'); b.fontSize = 17; b.drawText('✦ Sauvegarde auto', 0, 1, 200, 28, 'center');
    };
    Sprite_AvisSauvegarde.prototype.montrer = function (t) { this.opacity = t > 100 ? (120 - t) * 12 : Math.min(255, t * 6); };
    var _cdoS = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function () {
        _cdoS.call(this);
        this._ipAvis = new Sprite_AvisSauvegarde();
        this.addChild(this._ipAvis);
    };

    //=========================================================================
    // L'habillage des fenêtres
    //=========================================================================
    var _lws = Window_Base.prototype.loadWindowskin;
    Window_Base.prototype.loadWindowskin = function () {
        var n = $gameSystem && $gameSystem._ipFenetre;
        if (n) this.windowskin = ImageManager.loadBitmap('img/windows/', n);
        else _lws.call(this);
    };
    InterfacePlus.changerFenetre = function (nom) {
        $gameSystem._ipFenetre = nom || null;
        var s = SceneManager._scene;
        (function revetir(o) {
            if (o instanceof Window_Base) { o.loadWindowskin(); }
            (o.children || []).forEach(revetir);
        })(s || {});
    };

    //=========================================================================
    // Les objets de boutique conditionnels
    //=========================================================================
    function enVente(item) {
        if (!item || !item.note || item.note.indexOf('outique') < 0) return true;
        return balises(item.note, 'boutique\\s+si').every(function (b) {
            var js = b.expr.replace(/\bs\[\s*(\d+)\s*\]/g, '$gameSwitches.value($1)').replace(/\bv\[\s*(\d+)\s*\]/g, '$gameVariables.value($1)');
            try { return !!(new Function('return (' + js + ');'))(); }
            catch (e) { console.warn('[InterfacePlus] <Boutique si:> illisible sur « ' + item.name + ' » : ' + b.expr); return true; }
        });
    }
    InterfacePlus.enVente = enVente;
    var _mil = Window_ShopBuy.prototype.makeItemList;
    Window_ShopBuy.prototype.makeItemList = function () {
        _mil.call(this);
        var data = [], prix = [];
        (this._data || []).forEach(function (it, i) { if (enVente(it)) { data.push(it); prix.push(this._price[i]); } }, this);
        this._data = data; this._price = prix;
    };

    //=========================================================================
    // Les commandes
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pc.call(this, command, args);
        var c = String(command || '').toUpperCase();
        if (c === 'TOUCHE') {
            var k = String(args[0] || '').toUpperCase();
            if (!/^[A-Z0-9]$/.test(k) || RESERVEES[k]) return;
            if (/^off$/i.test(args[1])) delete touches()[k]; else touches()[k] = Number(args[1]) || 0;
        } else if (c === 'IMAGE' && String(args[0] || '').toLowerCase() === 'clic') {
            var n = Number(args[1]);
            if (/^off$/i.test(args[2])) delete clics()[n]; else clics()[n] = Number(args[2]) || 0;
        } else if (c === 'MENU_EC') {
            var ids = [];
            args.forEach(function (a) {
                var m = /^(\d+)-(\d+)$/.exec(a);
                if (m) { for (var i = Number(m[1]); i <= Number(m[2]); i++) ids.push(i); }
                else if (Number(a)) ids.push(Number(a));
            });
            InterfacePlus.ouvrirMenu(this, ids);
        } else if (c === 'FENETRE' || c === 'FENÊTRE') {
            var nomF = String(args[0] || '');
            InterfacePlus.changerFenetre(!nomF || /^d[ée]faut$/i.test(nomF) ? null : nomF);
        } else if (c === 'SAUVEGARDE_AUTO') {
            var a0 = String(args[0] || '').toLowerCase();
            if (a0 === 'off' || a0 === 'non') $gameSystem._ipAutoOff = true;
            else if (a0 === 'on' || a0 === 'oui') $gameSystem._ipAutoOff = false;
            else if (a0 === 'maintenant') { InterfacePlus._derniereAuto = 0; InterfacePlus.demanderSauvegarde(); }
        } else if (c === 'CHOISIR') {
            var genre = String(args[0] || '').toLowerCase().replace(/[éè]/g, 'e');
            if (genre === 'competences') genre = 'competence';
            if (['competence', 'arme', 'armure'].indexOf(genre) < 0 || !(Number(args[1]) > 0)) { console.warn('[InterfacePlus] CHOISIR : ' + args.join(' ')); return; }
            InterfacePlus.choisir(this, genre, Number(args[1]), Number(args[2]) || 0);
        }
    };
})();
