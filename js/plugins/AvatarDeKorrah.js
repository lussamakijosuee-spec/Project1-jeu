//=============================================================================
// AvatarDeKorrah.js
//=============================================================================
/*:
 * @plugindesc v2.1 ■ La PLACE de seiryu au combat : derrière Korrah, un peu
 * plus haut, et il flotte. Il est un vrai combattant — ici on ne fait que
 * le poser au bon endroit. Tombé, il s'efface ; reformé, il réapparaît.
 * @author pour JOKO
 *
 * @param acteurPorteuse
 * @text La porteuse
 * @desc Korrah = 2.
 * @type actor
 * @default 2
 *
 * @param acteurFamilier
 * @text Le familier
 * @desc seiryu = 6.
 * @type actor
 * @default 6
 *
 * @param decalageX
 * @text Décalage horizontal
 * @desc Vers l'arrière de la porteuse. En vue de côté les héros regardent à
 * gauche : un nombre POSITIF le place derrière elle.
 * @default 78
 *
 * @param decalageY
 * @text Décalage vertical
 * @desc Négatif = plus haut. Il flotte, il ne marche pas.
 * @default -46
 *
 * @param echelle
 * @text Taille
 * @desc 1.0 = la taille de l'image. seiryu est dessiné en 192×192 par case.
 * @default 0.85
 *
 * @param flottement
 * @text Amplitude du flottement
 * @desc En pixels. 0 pour l'immobiliser.
 * @default 5
 *
 * @param vitesseFondu
 * @text Vitesse à laquelle il s'efface
 * @desc Opacité perdue (ou regagnée) par image, sur 255. 8 ≈ une demi-seconde.
 * @default 8
 *
 * @help
 * ───────────────────────────────────────────────────────────────────────────
 * CE QUE FAIT CE GREFFON, ET CE QU'IL NE FAIT PAS
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Depuis la v2.0, seiryu n'est plus une image : c'est un CINQUIÈME COMBATTANT,
 * monté par `SeiryuLeFamilier.js`. MV lui donne donc son propre `Sprite_Actor`
 * tout seul, à la file avec les autres.
 *
 * Or un Stand ne se met pas dans la file. Ce greffon ne fait plus qu'une
 * chose : le sortir du rang et le poser DERRIÈRE sa porteuse, un peu plus
 * haut, avec un flottement lent. Aucune règle de combat ne passe par ici.
 *
 * v2.1 — un Stand ne reste pas couché par terre : tombé, il s'EFFACE ; quand
 * SeiryuLeFamilier le reforme, il réapparaît en fondu.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * DEUX PIÈGES DE MV RENCONTRÉS ICI
 * ───────────────────────────────────────────────────────────────────────────
 *
 * 1. `Sprite_Actor.setActorHome(index)` range chaque combattant sur une
 *    diagonale calculée à partir de sa place dans le groupe. Le forcer une
 *    fois ne suffit pas : `updateMove()` ramène le sprite vers son « home »
 *    à chaque image. On recalcule donc le home à chaque image, sur la
 *    position réelle de Korrah — comme ça il la suit même quand elle
 *    s'avance pour frapper.
 *
 * 2. En vue de côté, l'équipe est DÉJÀ collée au bord droit. Un décalage
 *    « derrière elle » pousse le corps hors de l'écran — mesuré : seiryu
 *    sortait de 48 px. On borne sur la largeur réelle de son image plutôt
 *    que de régler un nombre à la main.
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('AvatarDeKorrah');
    var PORTEUSE = parseInt(P['acteurPorteuse'] || 2, 10);
    var FAMILIER = parseInt(P['acteurFamilier'] || 6, 10);
    var DX = parseFloat(P['decalageX'] || 78);
    var DY = parseFloat(P['decalageY'] || -46);
    var ECHELLE = parseFloat(P['echelle'] || 0.85);
    var FLOTTE = parseFloat(P['flottement'] || 5);
    var FONDU = Math.max(1, parseFloat(P['vitesseFondu'] || 8));

    function estLui(sp) {
        return !!(sp && sp._actor && sp._actor.actorId && sp._actor.actorId() === FAMILIER);
    }

    /** On borne sur la largeur réelle de l'image : elle décide, pas un réglage. */
    function borner(sp, x) {
        var demi = 32;
        var bm = sp._mainSprite ? sp._mainSprite.bitmap : null;
        if (bm && bm.width) { demi = (bm.width / 9) * Math.abs(sp.scale.x || 1) / 2; }
        var marge = 6;
        return Math.max(demi + marge, Math.min(Graphics.width - demi - marge, x));
    }

    //=========================================================================
    // ON LE SORT DU RANG
    //=========================================================================
    var _majActeurs = Spriteset_Battle.prototype.updateActors;
    Spriteset_Battle.prototype.updateActors = function () {
        _majActeurs.call(this);
        if (!$gameSystem.isSideView()) { return; }

        var porteuse = null, familier = null;
        this._actorSprites.forEach(function (sp) {
            if (estLui(sp)) { familier = sp; }
            else if (sp._actor && sp._actor.actorId && sp._actor.actorId() === PORTEUSE) { porteuse = sp; }
        });
        if (!familier) { return; }

        if (familier.scale.x !== ECHELLE) { familier.scale.x = ECHELLE; familier.scale.y = ECHELLE; }

        // Tombé, il s'efface ; reformé, il revient. (Une séquence d'action de
        // Yanfly qui règle elle-même l'opacité garde la main.)
        if (!familier._opacityChanging) {
            var voulue = (familier._actor && familier._actor.isDead()) ? 0 : 255;
            if (familier.opacity !== voulue) {
                familier.opacity = voulue > familier.opacity
                    ? Math.min(voulue, familier.opacity + FONDU) : Math.max(voulue, familier.opacity - FONDU);
            }
        }
        if (!porteuse) { return; }

        // ⚠ Piège 1 : `updateMove()` ramène le sprite vers son home à chaque
        // image. On déplace donc le HOME, pas la position — sinon il repart.
        if (familier._phaseVol === undefined) { familier._phaseVol = Math.random() * Math.PI * 2; }
        familier._phaseVol += 0.045;
        var x = borner(familier, porteuse.x + DX);
        var y = porteuse.y + DY + Math.sin(familier._phaseVol) * FLOTTE;
        familier.setHome(x, y);
    };

    //=========================================================================
    // DE QUOI LE MESURER SANS DEVINER
    //=========================================================================
    window.AvatarCorps = {
        sprite: function () {
            var sc = SceneManager._scene;
            if (!sc || !sc._spriteset || !sc._spriteset._actorSprites) { return null; }
            var t = sc._spriteset._actorSprites.filter(estLui);
            return t[0] || null;
        },
        spritePorteuse: function () {
            var sc = SceneManager._scene;
            if (!sc || !sc._spriteset || !sc._spriteset._actorSprites) { return null; }
            var t = sc._spriteset._actorSprites.filter(function (sp) {
                return sp._actor && sp._actor.actorId && sp._actor.actorId() === PORTEUSE;
            });
            return t[0] || null;
        },
        reglages: function () {
            return { porteuse: PORTEUSE, familier: FAMILIER, dx: DX, dy: DY,
                     echelle: ECHELLE, flottement: FLOTTE, fondu: FONDU };
        }
    };
})();
