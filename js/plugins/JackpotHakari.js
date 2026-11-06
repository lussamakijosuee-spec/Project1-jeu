//=============================================================================
// JackpotHakari.js — v1.0  ·  LE PARI MORTEL
// RPG Maker MV   ·   by JOKO
//   À charger APRÈS UltiCinematics (il lui emprunte StateFX.burst).
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le Pari Mortel de ludwing : les rouleaux tournent, et le
 * JACKPOT dure UNE VRAIE MINUTE — du temps, pas des tours.
 * @author JOKO
 *
 * @param etatJackpot
 * @text État — JACKPOT
 * @type state
 * @default 11
 *
 * @param porteur
 * @text Le parieur
 * @type actor
 * @default 3
 *
 * @param secondes
 * @text Durée du JACKPOT, en SECONDES de jeu
 * @type number
 * @min 5
 * @default 60
 * @desc Du temps vécu, pas des tours. On ne compte que la carte et le combat : un menu ouvert ne grignote rien.
 *
 * @param survitAuCombat
 * @text Le JACKPOT survit-il à la fin du combat ?
 * @type boolean
 * @on Oui — la minute va jusqu'au bout
 * @off Non — il tombe avec le combat (réglage d'origine de l'état)
 * @default false
 *
 * @param compteur
 * @text Afficher le décompte à l'écran ?
 * @type boolean
 * @default true
 *
 * @param seJackpot
 * @text SE — le jackpot tombe
 * @type file
 * @dir audio/se
 * @default Coin
 *
 * @param seEchec
 * @text SE — le pari échoue
 * @type file
 * @dir audio/se
 * @default Buzzer1
 *
 * @param seRouleau
 * @text SE — un rouleau s'arrête
 * @type file
 * @dir audio/se
 * @default Machine
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE PARI MORTEL                                                     by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Ce plugin répare et prolonge l'événement commun « HAKARI » (CE21).
 *
 *  CE QUI N'ALLAIT PAS
 *  ───────────────────
 *   · PERSONNE n'appelait CE21. L'événement était injoignable : du contenu
 *     écrit, réglé, et hors d'atteinte. Une porte a été posée dans la Salle
 *     de Test (Map002, ev59 « Le Pari Mortel », en 18,9) ;
 *   · sa commande « ␣JACKPOT win » commençait par une ESPACE. MV coupe la
 *     ligne sur les espaces et prend le premier morceau comme nom de
 *     commande : le nom devenait la chaîne vide, et la commande que JOKO
 *     avait posée n'a jamais été entendue par personne. Un caractère ;
 *   · le JACKPOT durait 10 à 15 TOURS. JOKO le veut en TEMPS : une minute
 *     vécue. C'est maintenant un compte à rebours de secondes de jeu, et
 *     l'état ne se retire plus tout seul à la fin d'un tour ;
 *   · l'événement mettait la musique de côté (« Sauvegarder BGM ») sans
 *     jamais la reprendre : « jackpotsong » tournait ensuite pour toujours.
 *     La musique revient quand la minute s'épuise ;
 *   · le pari se jouait sans rien montrer. Il a maintenant ses rouleaux.
 *
 *  Les ME « jackpot-hakari » et « Shock2 » de l'événement sont intacts : ils
 *  existent dans audio/me. (Je les avais crus absents en lisant la commande
 *  249 comme un SE — c'est un ME. Rien à corriger de ce côté.)
 *
 *  LES ROULEAUX
 *  ────────────
 *  Trois rouleaux dessinés à la volée (aucune image ajoutée au projet) : ils
 *  s'emballent, ralentissent, et s'arrêtent un par un. Trois « 7 » alignés =
 *  jackpot. Le résultat est DÉCIDÉ PAR L'ÉVÉNEMENT, pas par les rouleaux : on
 *  leur dit quoi montrer. Ils racontent, ils ne tranchent pas.
 *
 *  CE QUE FAIT L'ÉTAT JACKPOT (11), qui était déjà réglé par JOKO
 *  ─────────────────────────────────────────────────────────────
 *   · régénération PV/PM/PT à 1000 % — il ne meurt plus ;
 *   · immunité à la mort, à Souffre-Douleur et à Folie Totale ;
 *   · vitesse d'action +1000 — il joue toujours en premier ;
 *   · il OUVRE le type « JACKPOT » (4) et SCELLE « capacité », « Spéciale »
 *     et « ult » : pendant la minute, il ne joue QUE ses cinq compétences de
 *     jackpot. C'est pour ça que ce type reste fermé sur la classe — c'est
 *     l'état qui l'ouvre, et lui seul.
 *
 *  COMMANDES DE PLUGIN
 *  ───────────────────
 *    JACKPOT rouleaux gagne      les rouleaux s'arrêtent sur 7-7-7
 *    JACKPOT rouleaux perd       ils s'arrêtent sur autre chose
 *    JACKPOT lancer              pose l'état et démarre la minute
 *    JACKPOT arreter             coupe court
 *
 *  SCRIPT :  Jackpot.actif()      → true/false
 *            Jackpot.restant()    → secondes restantes
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('JackpotHakari');
    var ETAT = parseInt(P['etatJackpot'] || 11);
    var PORTEUR = parseInt(P['porteur'] || 3);
    var SECONDES = parseInt(P['secondes'] || 60);
    // ⚠ Les booléens de PluginManager arrivent en TEXTE : String(false) vaut
    // « false », qui est truthy. On compare la chaîne.
    var SURVIT = String(P['survitAuCombat'] || 'false') === 'true';
    var COMPTEUR = String(P['compteur'] || 'true') === 'true';
    var SE_WIN = String(P['seJackpot'] || 'Coin');
    var SE_LOSE = String(P['seEchec'] || 'Buzzer1');
    var SE_ROUL = String(P['seRouleau'] || 'Machine');

    function se(nom, volume, pitch) {
        if (!nom) { return; }
        AudioManager.playSe({ name: nom, volume: volume || 90, pitch: pitch || 100, pan: 0 });
    }
    function journal(t) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', t); w.push('wait'); }
        if (typeof MecaBoss !== 'undefined' && MecaBoss.bandeauDuJournal) { MecaBoss.bandeauDuJournal(t); }   // muet en vue de côté : aussi en bandeau (JOKO, 2026-10-23)
    }

    //=========================================================================
    // ① LE TEMPS — une minute vécue, pas des tours
    //=========================================================================
    // L'état 11 était réglé sur « retrait en fin de tour, 10 à 15 tours ».
    // On coupe ce retrait automatique : à partir d'ici, c'est le décompte qui
    // décide. On le fait sur la donnée CHARGÉE, jamais dans States.json — le
    // réglage de JOKO reste intact dans son éditeur.
    var _extract = DataManager.extractMetadata;
    DataManager.extractMetadata = function (data) {
        _extract.call(this, data);
        if (data === $dataStates && $dataStates[ETAT]) {
            $dataStates[ETAT].autoRemovalTiming = 0;         // plus de retrait par tours
            if (SURVIT) { $dataStates[ETAT].removeAtBattleEnd = false; }
        }
    };
    // extractMetadata n'est pas appelé sur le tableau entier selon les versions :
    // on repasse derrière au chargement de la base, ceinture et bretelles.
    var _onLoad = DataManager.onLoad;
    DataManager.onLoad = function (object) {
        _onLoad.call(this, object);
        if (object === $dataStates && $dataStates[ETAT]) {
            $dataStates[ETAT].autoRemovalTiming = 0;
            if (SURVIT) { $dataStates[ETAT].removeAtBattleEnd = false; }
        }
    };

    function etat() {
        if (!$gameSystem) { return null; }
        return $gameSystem._jackpot || null;
    }

    var Jackpot = {
        actif: function () { var e = etat(); return !!(e && e.images > 0); },
        restant: function () { var e = etat(); return e ? Math.ceil(e.images / 60) : 0; },

        ouvrir: function (acteurId) {
            var a = $gameActors.actor(acteurId || PORTEUR);
            if (!a) { return; }
            $gameSystem._jackpot = {
                acteur: a.actorId(),
                images: SECONDES * 60,
                total: SECONDES * 60,
                bgm: AudioManager.saveBgm()          // pour la rendre à la fin
            };
            a.addState(ETAT);
            try { if (window.StateFX && StateFX.burst) { StateFX.burst('#ffd700'); } } catch (e) { }
            // la pluie de jetons : trois frappes décalées, ça sonne comme un bac qui se vide
            se(SE_WIN, 100, 100);
            [12, 24, 38].forEach(function (d) { setTimeout(function () { se(SE_WIN, 80, 120 + d); }, d * 16); });
            journal('\\C[14]★ JACKPOT — ' + a.name() + ' a ' + SECONDES + ' secondes.\\C[0]');
        },

        fermer: function (silencieux) {
            var e = etat();
            $gameSystem._jackpot = null;
            if (!e) { return; }
            var a = $gameActors.actor(e.acteur);
            if (a && a.isStateAffected(ETAT)) { a.removeState(ETAT); }
            if (e.bgm && e.bgm.name) { AudioManager.replayBgm(e.bgm); }
            else { AudioManager.stopBgm(); }
            if (!silencieux) {
                se(SE_LOSE, 70, 80);
                journal('\\C[7]La minute est passée. Le bac est vide.\\C[0]');
            }
        },

        // Une image de jeu = 1/60 de seconde. On ne compte que la carte et le
        // combat : ouvrir un menu ne doit pas grignoter la minute du joueur.
        battre: function () {
            var e = etat();
            if (!e || e.images <= 0) { return; }
            e.images--;
            if (e.images <= 0) { this.fermer(); }
        }
    };
    window.Jackpot = Jackpot;

    var _majCarte = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _majCarte.call(this);
        Jackpot.battre();
    };
    var _majCombat = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        _majCombat.call(this);
        Jackpot.battre();
    };

    // L'événement CE21 pose l'état directement (commande « Modifier état »).
    // On démarre la minute avec lui, pour ne pas avoir à toucher l'événement
    // sur ce point : qui reçoit l'état reçoit le temps qui va avec.
    // Jackpot.ouvrir() pose le compteur AVANT d'appeler addState, donc
    // actif() est déjà vrai et ce crochet ne se redéclenche pas sur lui-même.
    var _addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        var avait = this.isStateAffected(stateId);
        _addState.call(this, stateId);
        if (stateId === ETAT && !avait && this.isStateAffected(stateId) &&
            this.isActor && this.isActor() && !Jackpot.actif()) {
            $gameSystem._jackpot = {
                acteur: this.actorId(),
                images: SECONDES * 60,
                total: SECONDES * 60,
                bgm: AudioManager.saveBgm()
            };
            try { if (window.StateFX && StateFX.burst) { StateFX.burst('#ffd700'); } } catch (e) { }
            journal('\\C[14]★ JACKPOT — ' + this.name() + ' a ' + SECONDES + ' secondes.\\C[0]');
        }
    };

    // Si l'état part pour une autre raison (fin de combat quand survitAuCombat
    // est à Non, une purge…), le décompte s'arrête avec lui — sinon le joueur
    // garderait un compteur qui ne correspond plus à rien.
    var _removeState = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function (stateId) {
        var avait = this.isStateAffected(stateId);
        _removeState.call(this, stateId);
        if (stateId === ETAT && avait && Jackpot.actif()) {
            var e = etat();
            if (e && this.isActor && this.isActor() && this.actorId() === e.acteur) {
                Jackpot.fermer(true);
            }
        }
    };

    //=========================================================================
    // ② LE DÉCOMPTE À L'ÉCRAN
    //=========================================================================
    function Window_Jackpot() { this.initialize.apply(this, arguments); }
    Window_Jackpot.prototype = Object.create(Window_Base.prototype);
    Window_Jackpot.prototype.constructor = Window_Jackpot;
    Window_Jackpot.prototype.initialize = function () {
        var l = 260, h = this.fittingHeight(1);
        Window_Base.prototype.initialize.call(this, (Graphics.boxWidth - l) / 2, 2, l, h);
        this.opacity = 0;
        this._dernier = -1;
        this.refresh();
    };
    Window_Jackpot.prototype.refresh = function () {
        this.contents.clear();
        if (!Jackpot.actif()) { return; }
        var reste = Jackpot.restant();
        var e = etat();
        var part = e.total > 0 ? e.images / e.total : 0;
        var la = this.contentsWidth();

        // le fond : une barre d'or qui se vide
        this.contents.fillRect(0, 6, la, 26, 'rgba(0,0,0,0.55)');
        this.contents.gradientFillRect(0, 6, Math.floor(la * part), 26,
            '#ffd700', '#ff8c00', false);
        // les dix dernières secondes battent en rouge
        if (reste <= 10 && (Graphics.frameCount % 30) < 15) {
            this.contents.fillRect(0, 6, Math.floor(la * part), 26, 'rgba(255,60,60,0.45)');
        }
        this.contents.fontSize = 20;
        this.changeTextColor('#ffffff');
        this.contents.outlineColor = 'rgba(0,0,0,0.9)';
        this.drawText('★ JACKPOT   ' + reste + ' s', 0, 2, la, 'center');
        this.resetTextColor();
        this._dernier = reste;
    };
    Window_Jackpot.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        var reste = Jackpot.restant();
        this.visible = COMPTEUR && Jackpot.actif();
        // on redessine à chaque seconde, et en continu sur la fin (ça clignote)
        if (this.visible && (reste !== this._dernier || reste <= 10)) { this.refresh(); }
    };

    function poserCompteur(scene) {
        if (!COMPTEUR || scene._fenetreJackpot) { return; }
        scene._fenetreJackpot = new Window_Jackpot();
        scene.addChild(scene._fenetreJackpot);
    }
    var _creerCarte = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function () {
        _creerCarte.call(this);
        poserCompteur(this);
    };
    var _creerCombat = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function () {
        _creerCombat.call(this);
        poserCompteur(this);
    };

    //=========================================================================
    // ③ LES ROULEAUX
    //=========================================================================
    // Dessinés à la volée : aucune image n'est ajoutée au projet.
    var SYMBOLES = ['7', '★', '◆', '♣', '♠', '●'];
    var OR = '#ffd700';

    function Sprite_Rouleaux() { this.initialize.apply(this, arguments); }
    Sprite_Rouleaux.prototype = Object.create(Sprite.prototype);
    Sprite_Rouleaux.prototype.constructor = Sprite_Rouleaux;

    Sprite_Rouleaux.prototype.initialize = function (gagne) {
        Sprite.prototype.initialize.call(this);
        this._gagne = !!gagne;
        this._images = 0;
        this._fini = false;
        // quand chaque rouleau s'immobilise, et sur quoi
        this._arrets = [46, 70, 96];
        this._resultat = gagne ? [0, 0, 0] : this.tirageperdant();
        this._sonne = [false, false, false];
        this._roul = [0, 0, 0];

        this.bitmap = new Bitmap(360, 150);
        this.x = Math.floor((Graphics.boxWidth - 360) / 2);
        this.y = Math.floor((Graphics.boxHeight - 150) / 2) - 20;
        this.z = 900;
    };

    /** Un perdant crédible : jamais trois fois le même symbole. */
    Sprite_Rouleaux.prototype.tirageperdant = function () {
        var r;
        do {
            r = [0, 1, 2].map(function () { return Math.floor(Math.random() * SYMBOLES.length); });
        } while (r[0] === r[1] && r[1] === r[2]);
        return r;
    };

    Sprite_Rouleaux.prototype.update = function () {
        Sprite.prototype.update.call(this);
        if (this._fini) { return; }
        this._images++;
        var self = this;

        for (var i = 0; i < 3; i++) {
            if (this._images < this._arrets[i]) {
                // il tourne : plus on approche de l'arrêt, plus il ralentit
                var reste = this._arrets[i] - this._images;
                var pas = reste > 20 ? 1 : (reste > 10 ? 2 : 4);
                if (this._images % pas === 0) {
                    this._roul[i] = (this._roul[i] + 1) % SYMBOLES.length;
                }
            } else {
                this._roul[i] = this._resultat[i];
                if (!this._sonne[i]) { this._sonne[i] = true; se(SE_ROUL, 70, 110 + i * 15); }
            }
        }
        this.dessiner();

        if (this._images > this._arrets[2] + 30) {
            this._fini = true;
            if (this.parent) { this.parent.removeChild(this); }
        }
    };

    Sprite_Rouleaux.prototype.dessiner = function () {
        var b = this.bitmap;
        b.clear();
        // le cadre de la machine
        b.fillRect(0, 0, 360, 150, 'rgba(12,6,24,0.92)');
        b.fillRect(0, 0, 360, 4, OR);
        b.fillRect(0, 146, 360, 4, OR);
        b.fillRect(0, 0, 4, 150, OR);
        b.fillRect(356, 0, 4, 150, OR);

        for (var i = 0; i < 3; i++) {
            var x = 20 + i * 110;
            var immobile = this._images >= this._arrets[i];
            b.fillRect(x, 24, 100, 100, immobile ? 'rgba(255,215,0,0.16)' : 'rgba(255,255,255,0.07)');
            b.fontSize = 62;
            b.textColor = immobile && this._gagne ? OR : '#ffffff';
            b.outlineColor = 'rgba(0,0,0,0.9)';
            b.outlineWidth = 5;
            b.drawText(SYMBOLES[this._roul[i]], x, 34, 100, 80, 'center');
        }

        // la ligne de paiement
        b.fillRect(10, 73, 340, 2, this._gagne && this._images >= this._arrets[2]
            ? OR : 'rgba(255,255,255,0.20)');

        if (this._images >= this._arrets[2] + 6) {
            b.fontSize = 24;
            b.textColor = this._gagne ? OR : '#bbbbbb';
            b.drawText(this._gagne ? 'JACKPOT' : 'RIEN', 0, 112, 360, 30, 'center');
        }
    };

    /** Pose les rouleaux sur la scène courante. Rend le nombre d'images à attendre. */
    function jouerRouleaux(gagne) {
        var scene = SceneManager._scene;
        if (!scene) { return 0; }
        var s = new Sprite_Rouleaux(gagne);
        // en combat comme sur la carte, on veut être par-dessus le décor
        scene.addChild(s);
        // la scène ne met pas à jour un enfant nu : on l'accroche à sa boucle
        var _maj = scene.update;
        if (!scene._rouleauxAccroches) {
            scene._rouleauxAccroches = true;
            scene.update = function () {
                _maj.call(this);
                if (this._rouleaux && !this._rouleaux._fini) { this._rouleaux.update(); }
            };
        }
        scene._rouleaux = s;
        return s._arrets[2] + 36;
    }

    //=========================================================================
    // ④ LES COMMANDES
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'JACKPOT') { return; }
        var sub = String(args[0] || '').toLowerCase();

        // « JACKPOT win » et « JACKPOT fail » sont les commandes que JOKO avait
        // déjà posées dans CE21, en attente d'un plugin qui les écoute. On s'y
        // branche plutôt que d'en inventer d'autres : l'événement n'a pas à
        // changer pour que les rouleaux tournent.
        if (sub === 'win' || sub === 'fail') {
            this.wait(jouerRouleaux(sub === 'win'));
        } else if (sub === 'rouleaux') {
            var gagne = String(args[1] || '').toLowerCase() === 'gagne';
            this.wait(jouerRouleaux(gagne));        // l'événement attend la fin
        } else if (sub === 'lancer') {
            Jackpot.ouvrir(parseInt(args[1]) || PORTEUR);
        } else if (sub === 'arreter') {
            Jackpot.fermer(true);
        }
    };
})();
