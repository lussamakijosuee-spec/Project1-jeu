//=============================================================================
// Interieurs.js — v1.0  ·  Dedans, il ne pleut pas
// RPG Maker MV   ·   pour JOKO
//   À charger APRÈS MOG_TimeSystem et MOG_Weather_EX.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ À l'intérieur (maison, boutique, grotte), la météo des
 * saisons et la teinte de nuit s'arrêtent ; dehors, elles reviennent.
 * @author JOKO
 *
 * @param verrou
 * @text Interrupteur de la météo des saisons
 * @type switch
 * @default 231
 *
 * @param tilesets
 * @text Tilesets « intérieur » (mots du nom)
 * @type string
 * @default Intérieur,Donjon,intérieur
 * @desc Une carte dont le tileset porte un de ces mots est un intérieur.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  DEDANS, IL NE PLEUT PAS
 * ═══════════════════════════════════════════════════════════════════════════
 *  JOKO : « il y a de la météo alors que je suis à l'intérieur ».
 *
 *  Une carte est un INTÉRIEUR si son tileset s'appelle « Intérieur … » ou
 *  « Donjon », ou si sa Note porte <Intérieur>. <Extérieur> dans la Note
 *  force l'inverse.
 *
 *  En entrant dans un intérieur :
 *    · la météo des saisons s'arrête (interrupteur 231 baissé — on se
 *      souvient qu'il était levé) et les particules s'effacent, sauf si la
 *      Note de la carte demande sa propre météo (« weather : … ») ;
 *    · la teinte du jour et de la nuit s'efface (comme <Disable Tint
 *      Screen>), sauf si la Note porte <Teinte> ; l'heure continue de passer.
 *  En ressortant : l'interrupteur 231 est relevé s'il l'était, la saison
 *  reprend, la teinte revient.
 *
 *  Les portes n'ont donc plus rien à faire pour la météo : n'importe quel
 *  « Transférer le joueur » suffit.
 *
 *  SCRIPT :  Interieurs.est()   → vrai si la carte actuelle est un intérieur
 */
var Interieurs = window.Interieurs || {};
window.Interieurs = Interieurs;
(function () {
    'use strict';
    var P = PluginManager.parameters('Interieurs');
    var VERROU = Number(P.verrou || 231);
    var MOTS = String(P.tilesets || 'Intérieur,Donjon,intérieur').split(',').map(function (x) { return x.trim(); }).filter(Boolean);

    Interieurs.est = function () {
        if (!$dataMap) return false;
        var n = $dataMap.note || '';
        if (/<Ext[ée]rieur>/i.test(n)) return false;
        if (/<Int[ée]rieur>/i.test(n)) return true;
        var t = $dataTilesets[$dataMap.tilesetId];
        var nom = t ? String(t.name || '') : '';
        return MOTS.some(function (m) { return nom.indexOf(m) >= 0; });
    };

    function appliquer() {
        if (!$gameSystem || !$gameSwitches) return;
        var n = ($dataMap && $dataMap.note) || '';
        if (Interieurs.est()) {
            if ($gameSwitches.value(VERROU)) { $gameSystem._saisonsDehors = true; $gameSwitches.setValue(VERROU, false); }
            if (!/weather\s*:/i.test(n) && $gameSystem.weatherEX_initialize) $gameSystem.weatherEX_initialize(true);
            if ($gameScreen) $gameScreen.changeWeather('none', 0, 0);
            if (!/<Teinte>/i.test(n) && $gameSystem._time_data) {
                $gameSystem._time_data[4] = false;
                if ($gameScreen) $gameScreen.startTint([0, 0, 0, 0], 0);
            }
        } else if ($gameSystem._saisonsDehors) {
            $gameSystem._saisonsDehors = false;
            $gameSwitches.setValue(VERROU, true);
        }
    }
    var _setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function (mapId) {
        _setup.call(this, mapId);
        appliquer();
    };
    Interieurs.appliquer = appliquer;
})();
