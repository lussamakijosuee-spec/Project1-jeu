//=============================================================================
// ChampDeTir.js — v1.0
// Le Champ de Tir — le mini-jeu GALV_InvaderMiniGame, monté et jouable
// RPG Maker MV
//=============================================================================

/*:
 * @plugindesc v1.0 ■ Monte un niveau jouable pour GALV_InvaderMiniGame et
 * l'ouvre d'un seul appel : ChampDeTir.lancer();
 *
 * @help
 * ============================================================================
 *  Pourquoi ce plugin existe
 * ============================================================================
 *
 * GALV_InvaderMiniGame ne se joue pas tout seul : il faut lui construire ses
 * modules, ses objets, ses phases et son niveau, à coups d'appels de script.
 * Sans ce montage, la scène s'ouvre et se referme aussitôt.
 *
 * Le montage repris ici est celui de la démo officielle du plugin — il
 * marche — avec trois corrections rendues nécessaires par ce projet :
 *
 *   · les sons étaient écrits en minuscules ('shot1', 'wind7', 'paralyze2')
 *     alors que nos fichiers s'appellent Shot1, Wind7, Paralyze2. Sur un
 *     serveur qui distingue la casse, c'était trois 404 muets ;
 *   · la musique '03_Endless_Battle' n'existe pas ici : la première phase
 *     tourne sur Battle-Abysswalker ;
 *   · le montage ne se fait qu'UNE fois par partie, et il est refait au
 *     chargement d'une sauvegarde qui ne l'avait pas.
 *
 * ============================================================================
 *  Comment on s'en sert
 * ============================================================================
 *
 *   ChampDeTir.lancer();        // monte si besoin, puis lance le niveau 1
 *   ChampDeTir.monter();        // monte seulement (rarement utile)
 *
 * Après la partie, le résultat se lit comme le plugin le prévoit :
 *
 *   Galv.INVADER.record(1).result      // 'win' ou 'lose'
 *   Galv.INVADER.record(1).score       // le score de la dernière partie
 *   Galv.INVADER.record(1).highScore   // le meilleur
 *
 * Commandes en jeu : flèches pour voler, Maj pour la charge, Ctrl pour la
 * bombe (réglages du plugin GALV_InvaderMiniGame).
 */

var ChampDeTir = ChampDeTir || {};

(function () {
    'use strict';

    var NIVEAU = 1;

    // La musique de la première phase : celle de la démo n'existe pas ici.
    var MUSIQUE = { name: 'Battle-Abysswalker', pitch: 120, volume: 90 };

    // Les sons, à la casse de NOS fichiers.
    var SE_PARALYSIE = { name: 'Paralyze2', pan: 0, pitch: 120, volume: 60 };
    var SE_VENT = { name: 'Wind7', pan: 0, pitch: 130, volume: 60 };
    var SE_TIR = { name: 'Shot1', pan: 0, pitch: 50, volume: 100 };

    function pret() {
        return !!(window.Galv && Galv.INVADER && typeof Galv.INVADER.create === 'function');
    }

    //=========================================================================
    // Le montage — modules, vaisseau, ennemis, bonus, phases, niveau
    //=========================================================================
    ChampDeTir.monter = function () {
        if (!pret()) { return false; }

        // ── les modules (armes et armure)
        Galv.INVADER.create('module', 1, { type: 'weapon', graphic: 'module0', projectileGraphic: 'bullet0', fireRate: [1, 25] });
        Galv.INVADER.create('module', 2, { type: 'armor', graphic: 'module4' });
        Galv.INVADER.create('module', 3, { type: 'weapon', graphic: '', projectileGraphic: 'bullet4', fireRate: [5, 40], projectileSpeed: 4, projectileAngles: [15, -15], shootSE: SE_PARALYSIE, upgradeModule: 9 });
        Galv.INVADER.create('module', 4, { type: 'weapon', graphic: 'module3', projectileGraphic: 'bullet3', fireRate: [6, 18], projectileSpeed: 6, shootSE: SE_VENT });
        Galv.INVADER.create('module', 5, { type: 'weapon', graphic: '', projectileGraphic: 'bullet0', fireRate: [4, 4], projectileSpeed: 7, projectileAngles: [45] });
        Galv.INVADER.create('module', 6, { type: 'weapon', graphic: '', projectileGraphic: 'bullet0', fireRate: [4, 4], projectileSpeed: 7, projectileAngles: [-45] });
        Galv.INVADER.create('module', 7, { type: 'weapon', graphic: '', projectileGraphic: 'plasmaBlast', fireRate: [15, 25], projectileSpeed: 14, shootSE: SE_TIR, projectileHitBox: { w: 90, h: 90 }, projectilePenetrate: true, hitAnim: 0, contactAnim: 6, projectileZ: 0 });
        Galv.INVADER.create('module', 8, { type: 'weapon', graphic: '', projectileGraphic: 'bullet0', fireRate: [20, 20], projectileSpeed: 7, projectileAngles: [-60, -30, 0, 30, 60] });
        Galv.INVADER.create('module', 9, { type: 'weapon', graphic: '', projectileGraphic: 'bullet4', fireRate: [5, 40], projectileSpeed: 4, projectileAngles: [25, -25], shootSE: SE_PARALYSIE, upgradeModule: 10 });
        Galv.INVADER.create('module', 10, { type: 'weapon', graphic: '', projectileGraphic: 'bullet4', fireRate: [5, 40], projectileSpeed: 4, projectileAngles: [35, -35], shootSE: SE_PARALYSIE });
        Galv.INVADER.create('module', 11, {
            type: 'chargeweapon', graphic: '', fireRate: [4], chargeTime: 240, chargeAnims: [14, 15, 16],
            projectileHitBox: { w: 90, h: 90 }, projectileGraphic: 'plasmaBlast2', projectilePenetrate: true,
            hitAnim: 0, contactAnim: 6, damageSp: 5, damageHp: 5, projectileAngles: [0, 15, -15],
            shootSE: [{ name: 'Absorb1', pan: 0, pitch: 150, volume: 80 },
                      { name: 'Absorb1', pan: 0, pitch: 100, volume: 100 },
                      { name: 'Magic3', pan: 0, pitch: 130, volume: 100 }]
        });

        // ── le vaisseau du joueur
        Galv.INVADER.create('object', 1, {
            hp: 20, sp: 10, graphic: 'ship0', frames: 4, z: 6, xLimit: [2, 98],
            xStart: [50, 50], yStart: [90, 90], visibleModules: true,
            slots: {
                1: { xy: [-9, 0], size: 2, type: 'weapon', module: null },
                2: { xy: [9, 0], size: 2, type: 'weapon', module: null },
                3: { xy: [0, 0], size: 2, type: 'armor', module: null }
            }
        });
        Galv.INVADER.equipModule(1, 1, 1);
        Galv.INVADER.equipModule(1, 2, 1);
        Galv.INVADER.equipModule(1, 3, 2);
        Galv.INVADER.setPlayer(1);

        // ── les ennemis
        Galv.INVADER.create('object', 2, {
            hp: 5, graphic: 'enemy0', frames: 4, hitbox: { w: 90, h: 80 }, dieAnim: 10,
            slots: { 0: { xy: [0, 0], size: 2, type: 'weapon', module: 3 } },
            xStart: [10, 90], yStart: [0, 0], z: 4
        });
        Galv.INVADER.create('object', 3, {
            hp: 3, sp: 3, graphic: 'enemy2', frames: 4, hitbox: { w: 40, h: 40 },
            xStart: [10, 90], vertSpeed: 1, movementAi: 'erratic',
            slots: { 0: { xy: [0, 0], size: 2, type: 'weapon', module: 1 } }
        });
        Galv.INVADER.create('object', 4, {
            hp: 3, graphic: 'enemy1', frames: 4, hitbox: { w: 60, h: 40 },
            xStart: [90, 90], z: 3, vertSpeed: 3, yLimit: 50,
            yLimitSpeedY: [-0.1, -10], yLimitSpeedX: [-0.1, -5],
            slots: { 0: { xy: [0, 0], size: 2, type: 'weapon', module: 5 } }
        });
        Galv.INVADER.create('object', 5, {
            hp: 3, graphic: 'enemy1', frames: 4, hitbox: { w: 60, h: 40 },
            xStart: [10, 10], z: 3, vertSpeed: 3, yLimit: 50,
            yLimitSpeedY: [-0.1, -10], yLimitSpeedX: [0.1, 5],
            slots: { 0: { xy: [0, 0], size: 2, type: 'weapon', module: 6 } }
        });
        Galv.INVADER.create('object', 6, {
            hp: 2, graphic: 'enemy3', frames: 4, hitbox: { w: 10, h: 40 },
            xStart: [10, 90], z: 3, vertSpeed: 5, movementAi: 'follow'
        });
        Galv.INVADER.create('object', 7, {
            hp: 300, sp: 50, graphic: 'boss0', frames: 1, rows: 1, hitbox: { w: 260, h: 110 },
            xStart: [50, 50], z: 1, vertSpeed: 1, horzSpeed: 5, yLimit: 25, xLimit: [-10, 110],
            movementAi: 'follow', dieAnim: 12, dieTrigger: 'this.endPhase()',
            slots: {
                0: { xy: [-200, 0], size: 2, type: 'weapon', module: 4 },
                1: { xy: [200, 0], size: 2, type: 'weapon', module: 4 },
                2: { xy: [0, -80], size: 2, type: 'weapon', module: 7 },
                3: { xy: [-180, 10], size: 2, type: 'object', module: 8 },
                4: { xy: [180, 10], size: 2, type: 'object', module: 8 }
            }
        });
        Galv.INVADER.create('object', 8, {
            hp: 30, sp: 4, graphic: 'boss0_turret', frames: 1, rows: 1, hitbox: { w: 45, h: 36 }, z: 3, dieAnim: 4,
            slots: { 0: { xy: [0, 0], size: 2, type: 'weapon', module: 8 } }
        });

        // ── les bonus à ramasser
        Galv.INVADER.create('object', 9, {
            graphic: 'pup0', frames: 4, rows: 1, hitbox: { w: 40, h: 40 }, yStart: [0, 0], z: 0.5,
            dieAnim: 0, hittable: false, collideAnim: 7, collideDamageHp: 0, collideDamageSp: 0,
            collideHpMod: 100, collideSpMod: 100, vertSpeed: 2, countKill: false,
            collideItem: [['pupModule', -3], ['pupModule', -9], ['pupModule', -10]]
        });
        Galv.INVADER.create('object', 10, {
            graphic: 'pup1', frames: 4, rows: 1, hitbox: { w: 40, h: 40 }, yStart: [0, 0], z: 0.5,
            dieAnim: 0, hittable: false, collideAnim: 18, collideDamageHp: 0, collideDamageSp: 0,
            vertSpeed: 2, countKill: false, collideItem: [['pupModule', 3]]
        });
        Galv.INVADER.create('object', 11, {
            graphic: 'pup2', frames: 4, rows: 1, hitbox: { w: 40, h: 40 }, yStart: [0, 0], z: 0.5,
            dieAnim: 0, hittable: false, collideAnim: 19, collideDamageHp: 0, collideDamageSp: 0,
            vertSpeed: 2, countKill: false, collideItem: [['pupModule', 11]]
        });
        Galv.INVADER.create('object', 12, {
            graphic: 'bomb', frames: 1, rows: 1, hitbox: { w: 40, h: 40 }, yStart: [0, 0], z: 0.5,
            dieAnim: 0, hittable: false, collideAnim: 19, collideDamageHp: 0, collideDamageSp: 0,
            vertSpeed: 2, countKill: false, collideItem: [['bomb', 1]]
        });

        // ── les cinq phases, puis le niveau
        var p1 = { 1: { graphic: 'layer_ground2', opacity: 255, xs: 0, ys: 1.5, ox: 0, z: -30 } };
        Galv.INVADER.create('phase', 0, {
            splashImage: 'heading1', layers: p1, enemies: [2], bgm: MUSIQUE,
            pups: [9, 10, 12], pupFreq: [2, 4], gainItem: [['pupModule', 11]]
        });
        var p2 = {
            1: { graphic: 'layer_clouds1', opacity: 255, xs: 0, ys: 1.5, ox: 0.2, z: -20, fadeSpeed: 4 },
            2: { graphic: 'layer_clouds2', opacity: 155, xs: 0, ys: 2.5, ox: 0.3, z: -19, fadeSpeed: 0.5 }
        };
        Galv.INVADER.create('phase', 1, {
            splashImage: 'heading2', layers: p2, enemies: [2, 3], enemyFreq: [0.2, 2], pups: [9, 10], pupFreq: [2, 6]
        });
        var p3 = {
            1: { graphic: 'layer_space1', opacity: 255, xs: 0, ys: 2.5, ox: 0.2, z: -10, fadeSpeed: 0.5 },
            2: { graphic: 'layer_space2', opacity: 155, xs: 0, ys: 4.5, ox: 0.3, z: -9, fadeSpeed: 0.5 }
        };
        Galv.INVADER.create('phase', 2, {
            splashImage: 'heading3', layers: p3, enemies: [4, 5], eSpawnType: 0, enemyFreq: [2, 2],
            bgmFade: 4, delayEnd: 4, length: 16, pups: [11], pupFreq: [1, 1], pSpawnType: 2
        });
        Galv.INVADER.create('phase', 3, { enemies: [], enemyFreq: [10, 10], delayEnd: 6, beginAnim: 11, delayBegin: 4, length: 2 });
        Galv.INVADER.create('phase', 4, {
            enemyFreq: [0, 1], eSpawnType: 2, length: 99999, delayBegin: 3,
            enemies: [6, 6, 6, 6, 6, 7], bgm: { name: 'Dungeon3', pitch: 120, volume: 100 }
        });
        Galv.INVADER.buildLevel(NIVEAU, { splashImage: 'heading0', beginAnim: 1 }, [0, 1, 2, 3, 4]);

        if ($gameSystem) { $gameSystem._champDeTirMonte = true; }
        return true;
    };

    /** Monte si besoin, puis ouvre le mini-jeu. */
    ChampDeTir.lancer = function () {
        if (!pret()) { return false; }
        if (!$gameSystem._champDeTirMonte) { ChampDeTir.monter(); }
        Galv.INVADER.run(NIVEAU);
        return true;
    };

    // Le montage vit dans la partie : une partie neuve, ou une sauvegarde qui
    // ne l'a pas encore, le reçoit à l'ouverture.
    var _setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function () {
        _setupNewGame.call(this);
        try { ChampDeTir.monter(); } catch (e) { console.warn('ChampDeTir : ' + e.message); }
    };
    var _extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _extractSaveContents.call(this, contents);
        try { if (!$gameSystem._champDeTirMonte) { ChampDeTir.monter(); } } catch (e) { }
    };
})();
