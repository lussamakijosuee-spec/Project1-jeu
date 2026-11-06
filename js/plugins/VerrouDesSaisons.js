//=============================================================================
// VerrouDesSaisons.js — v1.0
// Le verrou maître de la météo des saisons, levé une fois pour toutes
// RPG Maker MV
//=============================================================================

/*:
 * @plugindesc v1.0 ■ Lève le verrou maître de la météo des saisons — sans lui,
 * les quatre événements communs de saison ne partent jamais.
 *
 * @param interrupteur
 * @text Interrupteur du verrou
 * @type switch
 * @desc L'interrupteur que les quatre événements communs de saison testent avant de lancer leur météo.
 * @default 231
 *
 * @help
 * ============================================================================
 *  Pourquoi ce plugin existe
 * ============================================================================
 *
 * Les quatre événements communs de saison (Spring, Summer, Fall, Winter) sont
 * parallèles : MOG_TimeSystem lève l'interrupteur de la saison en cours
 * (215 à 218) et l'événement correspondant se met à tourner. Sa première
 * ligne est un verrou maître commun :
 *
 *     SI interrupteur 231 « TS · Météo des saisons » est ACTIVÉ
 *        weather : ... (la pluie, les feuilles, la neige)
 *
 * Ce verrou vient de la démo MOG, où il tombait sur l'interrupteur 4 — qui
 * dans ce projet s'appelle « combat boss1 ». Il a été repointé sur le 231,
 * une case libre : la météo ne risque plus de partir en plein combat de boss.
 *
 * Mais RIEN, dans tout le projet, ne lève le 231 : aucune carte, aucun
 * événement commun, aucun plugin. Mesuré : zéro « Contrôle d'interrupteur »
 * qui le touche. La météo des saisons était donc branchée, réglée, correcte —
 * et ne pouvait pas démarrer une seule fois.
 *
 * ============================================================================
 *  Ce qu'il fait, et ce qu'il ne fait pas
 * ============================================================================
 *
 * Il lève le verrou UNE FOIS : à la création d'une nouvelle partie, et au
 * chargement d'une sauvegarde qui ne l'avait jamais reçu. Ensuite il se tait,
 * définitivement — la marque est posée dans $gameSystem et voyage avec la
 * sauvegarde.
 *
 * Donc : un événement qui BAISSE l'interrupteur 231 le garde baissé. Le
 * plugin ne le relèvera pas au prochain chargement. Le verrou reste à toi.
 *
 * Pour couper la météo des saisons dans toute la partie, il suffit d'un
 * « Contrôle d'interrupteur : 231 = OFF » n'importe où.
 */

(function () {
    'use strict';

    var params = PluginManager.parameters('VerrouDesSaisons');
    var VERROU = Number(params['interrupteur'] || 231);

    // On ne lève le verrou que s'il n'a jamais été posé sur cette partie.
    // La marque vit dans $gameSystem : elle suit la sauvegarde, et une
    // décision prise en jeu (couper la météo) n'est jamais écrasée.
    function poserLeVerrou() {
        if (!$gameSystem || !$gameSwitches) { return; }
        if ($gameSystem._verrouDesSaisonsPose) { return; }
        $gameSystem._verrouDesSaisonsPose = true;
        $gameSwitches.setValue(VERROU, true);
    }

    var _setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function () {
        _setupNewGame.call(this);
        poserLeVerrou();
    };

    // Les sauvegardes faites avant cette correction n'ont pas la marque :
    // elles reçoivent le verrou au chargement, une fois.
    var _extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _extractSaveContents.call(this, contents);
        try { poserLeVerrou(); } catch (e) { }
    };
})();
