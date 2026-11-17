//=============================================================================
// ToucheDuSaut.js — v1.0
// La touche du saut survit à la configuration du clavier
// RPG Maker MV
//=============================================================================

/*:
 * @plugindesc v1.0 ■ Rend sa touche au saut de GALV_JumpAbility, que
 * YEP_KeyboardConfig efface sans le vouloir.
 *
 * @help
 * ============================================================================
 *  Le problème
 * ============================================================================
 *
 * GALV_JumpAbility ajoute sa touche en écrivant directement dans
 * Input.keyMapper au moment où il se charge.
 *
 * YEP_KeyboardConfig, lui, PHOTOGRAPHIE Input.keyMapper au moment où IL se
 * charge — c'est-à-dire bien avant, puisqu'il est plus haut dans la liste —
 * et il réinstalle cette photo à chaque chargement de la configuration :
 *
 *     ConfigManager.applyKeyConfig = function() { Input.keyMapper = this.keyMapper; ... }
 *
 * La touche du saut disparaît donc au démarrage, sans une erreur. Mesuré :
 * aucune touche ne pointait sur « jump », et le héros ne sautait dans aucune
 * des quatre directions.
 *
 * ============================================================================
 *  Ce que fait ce plugin
 * ============================================================================
 *
 * Il repose la touche APRÈS que la configuration du clavier a été appliquée,
 * en la relisant dans les réglages de GALV_JumpAbility — donc si tu changes
 * la touche là-bas, elle suit toute seule.
 *
 * Il ne se bat jamais avec le joueur : si la touche est déjà prise par une
 * autre commande, il n'y touche pas. Le saut perd sa touche, et c'est tout —
 * aucune commande ne se retrouve volée.
 *
 * À placer APRÈS YEP_KeyboardConfig et APRÈS GALV_JumpAbility.
 */

(function () {
    'use strict';

    // La même table que GALV_JumpAbility emploie pour lire son réglage.
    var TOUCHES = {
        'tab': 9, 'enter': 13, 'shift': 16, 'ctrl': 17, 'alt': 18, 'space': 32,
        '0': 48, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55, '8': 56, '9': 57,
        'a': 65, 'b': 66, 'c': 67, 'd': 68, 'e': 69, 'f': 70, 'g': 71, 'h': 72, 'i': 73, 'j': 74,
        'k': 75, 'l': 76, 'm': 77, 'n': 78, 'o': 79, 'p': 80, 'q': 81, 'r': 82, 's': 83, 't': 84,
        'u': 85, 'v': 86, 'w': 87, 'x': 88, 'y': 89, 'z': 90,
        'semi-colon': 186, 'comma': 188, 'period': 190, 'single quote': 222
    };

    function codeDeLaTouche() {
        var reglee = PluginManager.parameters('Galv_JumpAbility')['Key'];
        var nom = String(reglee === undefined ? 'c' : reglee).toLowerCase().trim();
        return TOUCHES[nom];
    }

    function poserLaTouche() {
        var c = codeDeLaTouche();
        if (!c) { return; }
        // Si la touche sert déjà à autre chose, on la laisse : on ne vole
        // jamais une commande au joueur.
        if (Input.keyMapper[c] !== undefined && Input.keyMapper[c] !== 'jump') { return; }
        Input.keyMapper[c] = 'jump';
        if (ConfigManager.keyMapper) { ConfigManager.keyMapper[c] = 'jump'; }
    }

    poserLaTouche();

    var _applyData = ConfigManager.applyData;
    ConfigManager.applyData = function (config) {
        _applyData.call(this, config);
        poserLaTouche();
    };

    // Et quand le joueur ressort de l'écran de configuration des touches.
    if (typeof ConfigManager.applyKeyConfig === 'function') {
        var _applyKeyConfig = ConfigManager.applyKeyConfig;
        ConfigManager.applyKeyConfig = function () {
            _applyKeyConfig.call(this);
            poserLaTouche();
        };
    }
})();
