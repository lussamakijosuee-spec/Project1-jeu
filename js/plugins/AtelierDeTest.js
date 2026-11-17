//=============================================================================
// AtelierDeTest.js — v1.0  ·  Des outils pour tester plus vite
// RPG Maker MV   ·   pour JOKO
//   Inspiré, sans rien en copier, de Test Play Assist et Debugger (Yanfly).
//   N'existe QUE dans le test lancé depuis l'éditeur : les joueurs ne le
//   voient jamais, même s'il reste allumé.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ En test seulement : F6 accélère, F7 montre le numéro et
 * le nom de chaque événement, F10 gagne le combat, Ctrl+clic téléporte.
 * @author JOKO
 *
 * @param bandeau
 * @text Rappel des touches au démarrage
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'ATELIER DE TEST
 * ═══════════════════════════════════════════════════════════════════════════
 *  Seulement quand tu lances le jeu depuis l'éditeur (« Test de jeu ») —
 *  dans le jeu que tu envoies à tes potes, ce plugin ne fait strictement
 *  rien, même allumé.
 *
 *    F6          vitesse ×1 → ×2 → ×4 → ×1 (la carte et les combats : utile
 *                pour revoir une scène de 2 minutes en 30 secondes)
 *    F7          étiquettes : au-dessus de chaque événement, son numéro, son
 *                nom et sa page active ; sous le joueur, sa case et sa région.
 *                Pour savoir tout de suite quel événement est lequel.
 *    F10         en combat : victoire immédiate
 *    Ctrl+clic   sur la carte : le joueur est posé sur la case cliquée
 *
 *  Et les touches de MV restent : F9 interrupteurs et variables, Ctrl
 *  maintenu pour traverser les murs, F8 la console (les erreurs, et les
 *  signalements d'OutilsDeScene quand une scène se bloque).
 */
var AtelierDeTest = window.AtelierDeTest || {};
window.AtelierDeTest = AtelierDeTest;
(function () {
    'use strict';
    AtelierDeTest.actif = !!Utils.isOptionValid('test');
    if (!AtelierDeTest.actif) return;   // jamais chez les joueurs
    var P = PluginManager.parameters('AtelierDeTest');
    var BANDEAU = String(P.bandeau || 'true') === 'true';

    AtelierDeTest.vitesse = 1;
    AtelierDeTest.etiquettes = false;
    var ctrl = false;

    // ── un petit bandeau HTML par-dessus le jeu ──
    var boite = null, minuteur = 0, temoin = null;
    function bandeau(texte, ms) {
        if (typeof document === 'undefined') return;
        if (!boite) {
            boite = document.createElement('div');
            boite.style.cssText = 'position:fixed;left:8px;top:8px;z-index:20;padding:6px 10px;border-radius:6px;' +
                'background:rgba(0,0,0,0.72);color:#fff;font:14px sans-serif;pointer-events:none;transition:opacity .4s;';
            document.body.appendChild(boite);
        }
        boite.textContent = texte; boite.style.opacity = '1';
        clearTimeout(minuteur);
        minuteur = setTimeout(function () { boite.style.opacity = '0'; }, ms || 2500);
    }
    function majTemoin() {
        if (typeof document === 'undefined') return;
        if (!temoin) {
            temoin = document.createElement('div');
            temoin.style.cssText = 'position:fixed;right:8px;top:8px;z-index:20;padding:3px 8px;border-radius:5px;' +
                'background:rgba(160,20,20,0.85);color:#fff;font:bold 15px sans-serif;pointer-events:none;';
            document.body.appendChild(temoin);
        }
        temoin.textContent = '▶▶ ×' + AtelierDeTest.vitesse;
        temoin.style.display = AtelierDeTest.vitesse > 1 ? 'block' : 'none';
    }

    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 17) ctrl = true;
        if (e.keyCode === 117) {                     // F6
            AtelierDeTest.vitesse = AtelierDeTest.vitesse === 1 ? 2 : AtelierDeTest.vitesse === 2 ? 4 : 1;
            majTemoin(); bandeau('Vitesse ×' + AtelierDeTest.vitesse); e.preventDefault();
        } else if (e.keyCode === 118) {              // F7
            AtelierDeTest.etiquettes = !AtelierDeTest.etiquettes;
            bandeau('Étiquettes ' + (AtelierDeTest.etiquettes ? 'affichées' : 'cachées')); e.preventDefault();
        } else if (e.keyCode === 121) {              // F10
            if (AtelierDeTest.victoire()) bandeau('Victoire');
            e.preventDefault();
        }
    });
    document.addEventListener('keyup', function (e) { if (e.keyCode === 17) ctrl = false; });
    window.addEventListener('blur', function () { ctrl = false; });

    // ── F6 : la carte et les combats tournent plus vite ──
    // On rejoue la mise à jour de la scène ; entre deux passes on avance les
    // touches d'un cran, pour qu'un appui ne compte qu'une fois.
    var _us = SceneManager.updateScene;
    SceneManager.updateScene = function () {
        _us.call(this);
        for (var i = 1; i < AtelierDeTest.vitesse; i++) {
            var s = this._scene;
            if (!(s instanceof Scene_Map || s instanceof Scene_Battle) || this.isSceneChanging()) break;
            Input.update(); TouchInput.update();
            _us.call(this);
        }
    };

    // ── F10 : victoire ──
    AtelierDeTest.victoire = function () {
        if (!(SceneManager._scene instanceof Scene_Battle) || !$gameParty.inBattle()) return false;
        $gameTroop.aliveMembers().forEach(function (e) {
            e.addNewState(e.deathStateId());
            e.performCollapse();
            e.refresh();
        });
        // pendant le choix des commandes, MV ne vérifie la fin du combat qu'au
        // tour suivant : on la vérifie tout de suite
        if (BattleManager.isInputting()) {
            var s = SceneManager._scene;
            if (s._actorCommandWindow) s._actorCommandWindow.close();
            if (s._partyCommandWindow) s._partyCommandWindow.close();
            BattleManager.checkBattleEnd();
        }
        return true;
    };

    // ── Ctrl+clic : téléporter ──
    var _smu = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        if (ctrl && TouchInput.isTriggered() && !$gameMap.isEventRunning() && !SceneManager.isSceneChanging()) {
            var x = $gameMap.canvasToMapX(TouchInput.x), y = $gameMap.canvasToMapY(TouchInput.y);
            if ($gameMap.isValid(x, y)) { $gamePlayer.locate(x, y); bandeau('Téléporté en ' + x + ',' + y); }
            TouchInput.clear();
            $gameTemp.clearDestination();
        }
        _smu.call(this);
    };

    // ── F7 : les étiquettes ──
    function texteDe(c) {
        if (c instanceof Game_Event) {
            var p = c._pageIndex >= 0 ? 'p' + (c._pageIndex + 1) : 'aucune page';
            return c.eventId() + ' · ' + c.event().name + ' · ' + p;
        }
        if (c === $gamePlayer) return c.x + ',' + c.y + '  R' + $gameMap.regionId(c.x, c.y) + '  T' + $gameMap.terrainTag(c.x, c.y);
        return '';
    }
    var _scu = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function () {
        _scu.call(this);
        var c = this._character;
        if (!AtelierDeTest.etiquettes || !(c instanceof Game_Event || c === $gamePlayer)) {
            if (this._adtEtiquette) this._adtEtiquette.visible = false;
            return;
        }
        if (!this._adtEtiquette) {
            this._adtEtiquette = new Sprite(new Bitmap(220, 22));
            this._adtEtiquette.anchor.x = 0.5;
            this._adtEtiquette.anchor.y = c === $gamePlayer ? 0 : 1;
            this._adtEtiquette.z = 9;
            this.addChild(this._adtEtiquette);
        }
        var e = this._adtEtiquette, t = texteDe(c);
        if (e._texte !== t) {
            e._texte = t;
            var b = e.bitmap; b.clear();
            b.fontSize = 14;
            var w = Math.min(220, b.measureTextWidth(t) + 10);
            b.fillRect((220 - w) / 2, 2, w, 18, 'rgba(0,0,0,0.65)');
            b.textColor = c === $gamePlayer ? '#9fe8ff' : '#ffffff';
            b.drawText(t, 0, 1, 220, 20, 'center');
        }
        e.visible = true;
        e.y = c === $gamePlayer ? 2 : -(this.patternHeight ? this.patternHeight() : 48) - 2;
        e.scale.x = this.scale.x ? 1 / this.scale.x : 1;
        e.scale.y = this.scale.y ? 1 / this.scale.y : 1;
    };

    // ── le rappel des touches, une fois, à l'écran-titre ──
    if (BANDEAU) {
        var _stStart = Scene_Title.prototype.start;
        Scene_Title.prototype.start = function () {
            _stStart.call(this);
            if (!AtelierDeTest._dit) {
                AtelierDeTest._dit = true;
                bandeau('Atelier de test — F6 vitesse · F7 étiquettes · F10 victoire · Ctrl+clic téléporter', 7000);
            }
        };
    }
})();
