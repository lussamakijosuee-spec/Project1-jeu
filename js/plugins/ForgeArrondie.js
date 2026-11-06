//=============================================================================
// ForgeArrondie.js
//=============================================================================
/*:
 * @plugindesc Garde des nombres entiers sur l'équipement amélioré à la forge.
 * @author Claude, pour JOKO
 *
 * @help
 * ============================================================================
 * Pourquoi ce correctif
 * ============================================================================
 *
 * YEP_X_ItemUpgradeSlots applique les améliorations en pourcentage comme ceci :
 *
 *     item.params[i] += valeur * 0.01 * baseItem.params[i];
 *
 * Aucun arrondi. Une armure à 23 de DÉF améliorée de +12 % passe donc à 25.76,
 * et c'est « 25.76 » que MV écrit dans la fenêtre d'équipement. Le joueur voit
 * une décimale au milieu de ses statistiques.
 *
 * Les matériaux rares du jeu (Cœur de Boss, Larme de Titan, Reliquat…) sont
 * volontairement en pourcentage : ils amplifient ce que la pièce est déjà, au
 * lieu de rendre une arme de début de partie meilleure qu'une arme de fin. On
 * garde donc le pourcentage, et on arrondit après coup.
 *
 * Un seul point d'entrée à couvrir : ItemManager.applyIUSEffects, appelé par
 * Scene_Item quand le joueur valide une amélioration.
 *
 * Note : chaque effet se calcule sur baseItem, pas sur la valeur courante —
 * trois fois +10 % donnent trois fois le même ajout absolu. Arrondir à chaque
 * passage n'accumule donc aucune dérive.
 *
 * Rien à régler. Retirer ce plugin rend simplement les décimales.
 */
//=============================================================================

(function () {
    'use strict';

    if (typeof ItemManager === 'undefined' || !ItemManager.applyIUSEffects) { return; }

    var _applyIUSEffects = ItemManager.applyIUSEffects;
    ItemManager.applyIUSEffects = function (mainItem, effectItem) {
        _applyIUSEffects.call(this, mainItem, effectItem);
        if (!mainItem || !mainItem.params) { return; }
        for (var i = 0; i < mainItem.params.length; i++) {
            var v = mainItem.params[i];
            if (typeof v === 'number' && isFinite(v)) { mainItem.params[i] = Math.round(v); }
        }
        // Le coût en emplacements peut lui aussi être touché par « Slots: +x% ».
        if (typeof mainItem.upgradeSlots === 'number' && isFinite(mainItem.upgradeSlots)) {
            mainItem.upgradeSlots = Math.round(mainItem.upgradeSlots);
        }
    };
})();
