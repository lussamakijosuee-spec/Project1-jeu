//=============================================================================
// EquilibreDesCombats.js — v1.1
// Les combats, réglés sur ce que l'équipe fait VRAIMENT — par rang.
//=============================================================================
/*:
 * @plugindesc v1.1 ■ Multiplie les PV et la force des ennemis selon leur rang
 * (D, C, B, A, S, boss). Réglé sur des combats joués dans le moteur. Ne touche
 * à aucune fiche : éteindre ce greffon rend les ennemis d'origine.
 * @author pour JOKO
 *
 * @param pvD
 * @text Rang D — PV ×
 * @default 3.5
 * @param forceD
 * @text Rang D — ATQ/MAG ×
 * @default 1.4
 * @param pvC
 * @text Rang C — PV ×
 * @default 3.6
 * @param forceC
 * @text Rang C — ATQ/MAG ×
 * @default 1.5
 * @param pvB
 * @text Rang B — PV ×
 * @default 5.8
 * @param forceB
 * @text Rang B — ATQ/MAG ×
 * @default 1.6
 * @param pvA
 * @text Rang A — PV ×
 * @default 1.8
 * @param forceA
 * @text Rang A — ATQ/MAG ×
 * @default 1
 * @param pvS
 * @text Rang S — PV ×
 * @default 1
 * @param forceS
 * @text Rang S — ATQ/MAG ×
 * @default 1
 * @param pvBoss
 * @text Boss à mécaniques — PV ×
 * @default 1
 * @param forceBoss
 * @text Boss à mécaniques — ATQ/MAG ×
 * @default 1
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  « ADAPTE LES COMBATS EN FONCTION »                                   JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Les chiffres par défaut sont posés d'après
 *  bancs/navigateur/lequipe_a_chaque_niveau.js : des centaines de combats
 *  JOUÉS dans le moteur — vraies troupes, vraie IA des ennemis, vraies
 *  mécaniques de boss — avec l'équipe complète à chaque niveau.
 *
 *  Le rang vient de <Rang: X> sur l'ennemi. Un ennemi qui porte une mécanique
 *  de boss (<Meca…: …> ou <Phases: …>) prend la ligne « Boss » au lieu de S.
 *
 *  Rien n'est réécrit dans Enemies.json : le multiplicateur s'applique au
 *  chargement du combat. Éteindre ce greffon rend les ennemis de JOKO tels
 *  qu'il les a écrits.
 *
 * ───────────────────────────────────────────────────────────────────────────
 *  CE QUE LE BANC A MESURÉ (septembre 2026, 16 troupes × 2 combats par niveau)
 * ───────────────────────────────────────────────────────────────────────────
 *  Sans ce greffon, l'équipe tue les rangs D, C et B en 1,1 à 1,6 tour : les
 *  ennemis meurent avant d'avoir joué, et aucune mécanique des héros (le
 *  Pacte de Vesper, la Lecture d'Aël, les ordres à seiryu) n'a le temps de
 *  servir. Le rang A dure 2 tours ; le S, 3 à 6 ; les boss, 9 à 16.
 *
 *  D, C, B, A : les PV montent pour que le combat dure 2 à 3 tours et
 *  demi ; la force un peu, pour que l'équipe sente qu'on lui répond.
 *  S et boss : laissés à 1. Ils durent déjà assez, et au niveau 60 le rang S
 *  gagne 81 % de ses combats — les rendre plus durs ne servirait personne.
 *
 *  ⚠ Pourquoi pas plus de PV en D : au niveau 1, un héros frappe ~4 fois ses
 *    propres PV max. Le recul du Mana Sombre, le Renvoi de la Voie du Miroir
 *    et le Reflet sont proportionnels au coup : un combat long au niveau 1,
 *    c'est des héros qui se tuent eux-mêmes. À PV ×5, le banc a perdu 2
 *    combats D sur 24 au niveau 1 — sans que l'ennemi y soit pour grand-chose.
 *
 *  ⚠ La force des boss est plafonnée : YEP_CoreEngine borne les paramètres
 *    ennemis à 999 (« Enemy Parameter »), et presque tous les boss y sont
 *    déjà. Le multiplicateur de force n'y change donc rien — les PV, si.
 *
 * ───────────────────────────────────────────────────────────────────────────
 *  v1.1 — LE REWORK DES ENNEMIS (2026-10-27, avec leurs instincts)
 * ───────────────────────────────────────────────────────────────────────────
 *  Rang B : PV ×3,6 → ×5,8, force ×1,45 → ×1,6. L'équipe complète le tuait
 *  en 1,6 à 2 tours ; il en dure 3,2 à 3,8 (16 combats par niveau, 94 %
 *  de victoires), et 2,1 sur les seules troupes posées dans le jeu.
 *  D et C ne bougent pas : le jeu commence avec UN héros (DebutMarques). Seul
 *  au niveau 1, il gagne 80 à 100 % des rangs D en 1 à 3,5 tours ; seul au
 *  niveau 12, 44 à 94 % des rangs C — plus de PV casserait le début.
 *  A, S et boss ne bougent pas : 3,3 tours en A, 4 à 10 en S, 7 à 11 pour
 *  les boss, et les instincts y coûtent déjà des victoires (les Bêtes).
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('EquilibreDesCombats');
    function n(k) { var v = parseFloat(P[k]); return isNaN(v) || v <= 0 ? 1 : v; }
    var MULT = {
        D: { pv: n('pvD'), force: n('forceD') },
        C: { pv: n('pvC'), force: n('forceC') },
        B: { pv: n('pvB'), force: n('forceB') },
        A: { pv: n('pvA'), force: n('forceA') },
        S: { pv: n('pvS'), force: n('forceS') },
        BOSS: { pv: n('pvBoss'), force: n('forceBoss') }
    };

    function rangDe(e) {
        var d = e && e.enemy ? e.enemy() : e;
        var note = (d && d.note) || '';
        if (/<\s*(Meca\w*|Phases)\s*:/i.test(note)) { return 'BOSS'; }
        var m = /<\s*Rang\s*:\s*([^>]*)>/i.exec(note);
        var r = m ? String(m[1]).trim().toUpperCase() : null;
        return MULT[r] ? r : null;
    }

    var _base = Game_Enemy.prototype.paramBase;
    Game_Enemy.prototype.paramBase = function (id) {
        var v = _base.call(this, id);
        var r = this._rangEquilibre === undefined ? (this._rangEquilibre = rangDe(this)) : this._rangEquilibre;
        if (!r) { return v; }
        if (id === 0) { return Math.round(v * MULT[r].pv); }
        if (id === 2 || id === 4) { return Math.round(v * MULT[r].force); }
        return v;
    };

    window.EquilibreDesCombats = {
        mult: MULT,
        rangDe: rangDe,
        /** Pour le banc : changer un réglage sans recharger le jeu. */
        regler: function (r, pv, force) { if (MULT[r]) { if (pv > 0) { MULT[r].pv = pv; } if (force > 0) { MULT[r].force = force; } } }
    };
})();
