//=============================================================================
// ObjetSpirituel.js — v3.0
// Le DON SPIRITUEL évolutif — RPG Maker MV
// by JOKO
//   v3.0 — UN SEUL DON PAR PERSONNE. La « Manifestation » est supprimée :
//          personne ne porte deux Dons. « Familier » devient AVATAR SPIRITUEL.
//=============================================================================

/*:
 * @plugindesc v3.0 ■ UN SEUL Don par personne, qui évolue en 4 paliers (Éclat→
 * Forme→Résonance→Vérité) dans SON slot : l'Arme au slot Arme, l'Objet à
 * l'Accessoire, l'Avatar Spirituel à l'Âme. L'autre main tient de l'acier.
 * @author JOKO
 *
 * @param lvForme
 * @text Niveau — Palier 2 (Forme)
 * @type number
 * @min 2
 * @default 15
 *
 * @param lvResonance
 * @text Niveau — Palier 3 (Résonance)
 * @type number
 * @min 3
 * @default 35
 *
 * @param lvVerite
 * @text Niveau — Palier 4 (Vérité)
 * @type number
 * @min 4
 * @default 60
 *
 * @param soulBonus
 * @text Bonus d'âme (SAN) ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Si Oui, le Don équipé gagne/perd de l'ATK & MAT selon la santé mentale du porteur (via JadeEntitePlunging).
 *
 * @param evoAnim
 * @text Animation d'évolution
 * @type animation
 * @default 51
 *
 * @param evoSE
 * @text Son d'évolution
 * @type string
 * @default Saint5
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE DON SPIRITUEL ÉVOLUTIF                                          by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Le Don est la manifestation physique de l'âme. Il ne se choisit pas, il
 *  SORT — et il grandit tout seul avec son porteur :
 *
 *     Palier 1 · ÉCLAT      (dès le niveau 1)
 *     Palier 2 · FORME      (niveau lvForme)
 *     Palier 3 · RÉSONANCE  (niveau lvResonance)
 *     Palier 4 · VÉRITÉ     (niveau lvVerite)
 *
 *  ▶ LA RÈGLE D'OR : UN SEUL DON PAR PERSONNE
 *    Une arme, OU un objet, OU un avatar. Jamais deux. Ce que le porteur
 *    tient dans l'autre main est de l'acier ordinaire — acheté, trouvé,
 *    remplaçable — et ça ne grandit PAS tout seul. Seul le Don fait ça.
 *
 *  ▶ CHAQUE FORME A SA PLACE (Codex §6.1)
 *      ⚔️  ARME    (80 %) → slot ARME        Aël : l'Arc 513-516
 *      🔮  OBJET   (18 %) → slot ACCESSOIRE  Vesper : le Masque 68-71
 *                                            ludwing : l'Amulette 72-75
 *      👤  AVATAR   (2 %) → slot ÂME         Korrah : l'Armure Volante 76-79
 *
 *    Les armes 501-512 étaient présentées comme des « Manifestations » qui
 *    doublaient le Don de Vesper, Korrah et ludwing. C'était une erreur :
 *    elles sont redevenues des ARMES ORDINAIRES, gardées, renommées et
 *    mises en vente. Aucune n'a été supprimée.
 *
 *  ▶ LE DON NE SE RETIRE PAS, ET NE SE PRÊTE PAS
 *    Il est né de cette âme-là. Le joueur ne peut ni le déséquiper ni le
 *    passer à quelqu'un d'autre : le slot est verrouillé sur son porteur.
 *    (Voir DonsSpirituels.js, qui tient le verrou.)
 *
 *  ▶ BONUS D'ÂME (option)
 *    Tant que le Don est équipé, il gagne de l'ATK & MAT si la santé mentale
 *    du porteur est haute, en perd si elle s'effondre (lecture via window.Ame
 *    de JadeEntitePlunging). L'âme nourrit littéralement le Don.
 *
 *  ▶ COMMANDES PLUGIN
 *    OBJET check     Réévalue tous les héros (après un événement scénarisé)
 *    OBJET rendre    Redonne à chaque héros la pièce de son Don, si elle a
 *                    été perdue, et la rééquipe.
 *
 *  Pré-requis : armes 513-516 et armures 68-79 présentes (déjà créées).
 *  Compatible saves : un héros déjà au-dessus du palier est mis à niveau au
 *  prochain chargement de carte. Une sauvegarde d'avant la v3.0 où Vesper ou
 *  Korrah portait une « Manifestation » n'est pas cassée : l'arme est devenue
 *  une arme ordinaire, elle reste équipée et parfaitement utilisable — elle
 *  ne montera simplement plus de palier toute seule.
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('ObjetSpirituel');
    var LV_FORME = parseInt(P['lvForme']     || 15);
    var LV_RESO  = parseInt(P['lvResonance'] || 35);
    var LV_VERI  = parseInt(P['lvVerite']    || 60);
    var SOUL_ON  = String(P['soulBonus'] || 'true') === 'true';
    var EVO_ANIM = parseInt(P['evoAnim'] || 51);
    var EVO_SE   = String(P['evoSE'] || 'Saint5');

    var PALIER = ['Éclat', 'Forme', 'Résonance', 'Vérité'];

    // ── Les chaînes : UN SEUL DON PAR PERSONNE, dans son slot à lui ─────────
    //    slot = etypeId (1 Arme · 5 Accessoire · 7 Âme) · type = 'arme' | 'armure'
    //    Il n'y a plus de « manif » : personne ne porte deux Dons.
    var CHAINS = {
        1: { // Vesper — OBJET : le Masque (accessoire). Sa main tient de l'acier.
            don: { forme: 'objet', slot: 5, type: 'armure', ids: [68, 69, 70, 71],
                   names: ['Éclat de Masque', 'Masque Naissant', 'Masque Résonant', 'Vérité du Masque'] }
        },
        2: { // Korrah — AVATAR SPIRITUEL : l'Armure Volante (âme). Idem.
            don: { forme: 'avatar', slot: 7, type: 'armure', ids: [76, 77, 78, 79],
                   names: ['Éclat Volant', 'Armure Naissante', 'Armure Résonante', "Vérité de l'Armure Volante"] }
        },
        3: { // ludwing — OBJET : l'Amulette (accessoire). Sa hache est ordinaire.
            don: { forme: 'objet', slot: 5, type: 'armure', ids: [72, 73, 74, 75],
                   names: ["Éclat d'Amulette", 'Amulette Naissante', 'Amulette Résonante', "Vérité de l'Amulette"] }
        },
        4: { // Aël — ARME : l'arc EST le Don. Accessoire et Âme restent libres.
            don: { forme: 'arme', slot: 1, type: 'arme', ids: [513, 514, 515, 516],
                   names: ['Éclat Stellaire', 'Arc Naissant', 'Arc Résonant', "Vérité de l'Arc"] }
        }
    };

    // File d'annonces à afficher de retour sur la carte
    var _pendingEvo = [];

    //=========================================================================
    // OUTILS
    //=========================================================================

    function stageForLevel(level) {
        if (level >= LV_VERI) return 3;
        if (level >= LV_RESO) return 2;
        if (level >= LV_FORME) return 1;
        return 0;
    }

    function chainsOf(actorId) {
        var c = CHAINS[actorId];
        return c ? [c.don] : [];
    }

    function dataOf(chain, id) {
        return chain.type === 'arme' ? $dataWeapons[id] : $dataArmors[id];
    }

    /** Indice de slot réel pour un etypeId donné (respecte equipSlots personnalisés). */
    function slotIndex(actor, etypeId) {
        var slots = actor.equipSlots();
        for (var i = 0; i < slots.length; i++) if (slots[i] === etypeId) return i;
        return etypeId - 1;
    }

    /** La pièce de cette chaîne actuellement équipée, ou null. */
    function equippedPiece(actor, chain) {
        var it = actor.equips()[slotIndex(actor, chain.slot)];
        return (it && chain.ids.indexOf(it.id) >= 0) ? it : null;
    }

    /** Palier détenu (équipé OU en inventaire), -1 si le héros n'a plus rien de la chaîne. */
    function ownedStage(actor, chain) {
        var best = -1;
        var eq = equippedPiece(actor, chain);
        if (eq) best = chain.ids.indexOf(eq.id);
        for (var s = 0; s < chain.ids.length; s++) {
            var data = dataOf(chain, chain.ids[s]);
            if (data && $gameParty.numItems(data) > 0 && s > best) best = s;
        }
        return best;
    }

    /** Fait évoluer UNE chaîne vers le palier autorisé par le niveau. */
    function evolveChain(actor, chain, annonce) {
        var target = stageForLevel(actor.level);
        var owned  = ownedStage(actor, chain);
        if (owned < 0) return false;      // le héros n'a plus cette pièce (volontairement)
        if (owned >= target) return false;

        var neuf = dataOf(chain, chain.ids[target]);
        if (!neuf) return false;

        var etaitEquipe = !!equippedPiece(actor, chain);

        // 1) on donne la nouvelle pièce, on l'équipe si l'ancienne l'était
        //    Le Don est verrouillé dans son slot (DonsSpirituels) : ce drapeau
        //    dit au verrou que c'est l'évolution qui parle, pas le joueur.
        $gameParty.gainItem(neuf, 1);
        if (etaitEquipe) {
            window._DonInterne = true;
            try { actor.changeEquip(slotIndex(actor, chain.slot), neuf); }
            finally { window._DonInterne = false; }
        }

        // 2) on purge toutes les versions inférieures (dont celle rendue par changeEquip)
        for (var s = 0; s < target; s++) {
            var vieux = dataOf(chain, chain.ids[s]);
            var n = vieux ? $gameParty.numItems(vieux) : 0;
            if (n > 0) $gameParty.loseItem(vieux, n, true);
        }

        if (annonce) {
            _pendingEvo.push(actor.name() + ' — le Don Spirituel s\'éveille : « '
                + chain.names[target] + ' » (Palier ' + (target + 1) + '/4 · ' + PALIER[target] + ') !');
        }
        return true;
    }

    /** Fait évoluer LE Don — il n'y en a qu'un. */
    function evolveActor(actor) {
        var c = CHAINS[actor.actorId()];
        if (!c) return;
        evolveChain(actor, c.don, true);
    }

    function checkAllParty() {
        $gameParty.members().forEach(evolveActor);
    }

    /** Redonne au héros la pièce de son Don si elle a disparu, et la rééquipe. */
    function rendreDon(actor) {
        chainsOf(actor.actorId()).forEach(function (chain) {
            if (ownedStage(actor, chain) >= 0) return;             // il l'a encore
            var data = dataOf(chain, chain.ids[stageForLevel(actor.level)]);
            if (!data) return;
            $gameParty.gainItem(data, 1);
            window._DonInterne = true;
            try { actor.changeEquip(slotIndex(actor, chain.slot), data); }
            finally { window._DonInterne = false; }
        });
    }

    //=========================================================================
    // ÉVOLUTION À LA MONTÉE DE NIVEAU
    //=========================================================================

    var _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp = function () {
        _Game_Actor_levelUp.call(this);
        evolveActor(this);
    };

    //=========================================================================
    // BONUS D'ÂME — l'ATK & MAT du Don suivent la santé mentale
    //=========================================================================

    var SOUL_PHASE_BONUS = { 5: 8, 4: 4, 3: 0, 2: -4, 1: -8 };

    var _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function (paramId) {
        var value = _Game_Actor_paramPlus.call(this, paramId);
        if (SOUL_ON && (paramId === 2 || paramId === 4)) { // ATK ou MAT
            var c = CHAINS[this.actorId()];
            if (c && equippedPiece(this, c.don)) {
                if (typeof window.Ame !== 'undefined' && window.Ame) {
                    var phase = window.Ame.phase(this.actorId());
                    value += (SOUL_PHASE_BONUS[phase] || 0);
                }
            }
        }
        return value;
    };

    //=========================================================================
    // AFFICHAGE DES ANNONCES SUR LA CARTE + RATTRAPAGE DES SAUVEGARDES
    //=========================================================================

    var _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        checkAllParty(); // rattrape les héros sous-évolués (saves existantes)
        _Scene_Map_onMapLoaded.call(this);
    };

    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        if (_pendingEvo.length > 0 &&
            !$gameMap.isEventRunning() && !$gameMessage.isBusy()) {
            AudioManager.playSe({ name: EVO_SE, volume: 90, pitch: 100, pan: 0 });
            $gameMessage.add('\\C[14]✦ ' + _pendingEvo.shift() + '\\C[0]');
        }
    };

    //=========================================================================
    // COMMANDE PLUGIN
    //=========================================================================

    var _GI_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _GI_pluginCommand.call(this, command, args);
        if (String(command).toUpperCase() !== 'OBJET') return;
        var sous = (args[0] || '').toLowerCase();
        if (sous === 'check')  checkAllParty();
        if (sous === 'rendre') $gameParty.members().forEach(rendreDon);
    };

    // exposé pour les autres plugins (DonsSpirituels lit la pièce équipée)
    window.DonChaines = CHAINS;
    window.EVO_ANIM_DON = EVO_ANIM;

})();
