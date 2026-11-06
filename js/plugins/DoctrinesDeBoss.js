//=============================================================================
// DoctrinesDeBoss.js
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le VOCABULAIRE des doctrines de boss. N'ajoute aucune
 * règle : donne à <AI Priority> les mots qui lui manquaient pour en écrire.
 * @author pour JOKO
 *
 * @help
 * ───────────────────────────────────────────────────────────────────────────
 * POURQUOI CE GREFFON EXISTE
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Mesuré le 2026-09-25 : 26 boss sur 45 ont le MÊME bloc d'IA, ligne pour
 * ligne. Seuls les numéros de compétence changent. 12 formes pour 45 boss, et
 * 42 d'entre eux ont exactement 7 compétences.
 *
 * Ce n'est pas un défaut d'écriture — les noms que JOKO a donnés sont
 * excellents : « Les Éclats se Lèvent », « Il Prend Une Grande Inspiration »,
 * « Le Compte Commence », « L'Eau se Retire ». Chacun annonce un combat
 * différent. C'est le MÉCANISME qui est le même partout.
 *
 * Or on ne pouvait pas écrire autre chose : le langage des doctrines de
 * Yanfly sait dire TURN, HP%, STATE, RANDOM — et `BossTelegraphe` y avait
 * ajouté `user.enCharge()` et `user.enSurcharge()`. Il ne savait pas dire
 * « quelqu'un d'en face porte ma marque », ni « je suis dans ma deuxième
 * forme », ni « il ne reste qu'un tour avant que ça tombe ».
 *
 * Ce greffon n'ajoute AUCUNE règle de combat. Il ajoute des MOTS. Les règles
 * restent écrites dans les blocs <AI Priority>, en clair, modifiables dans
 * l'éditeur sans toucher à une ligne de code.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * LES MOTS
 * ───────────────────────────────────────────────────────────────────────────
 *
 *   user.aMarque(n)        Quelqu'un d'en face porte-t-il l'état n ?
 *                          → « EVAL user.aMarque(213): Skill 1050, Random »
 *                            « quelqu'un est désigné, donc je charge »
 *
 *   user.compte(n)         Combien de tours reste-t-il à l'état n, chez celui
 *                          qui le porte ? 0 si personne ne le porte.
 *                          → « EVAL user.compte(213) === 1: Skill 1051 »
 *                            « c'est le dernier tour : je tire maintenant »
 *
 *   user.phase()           1, 2 ou 3 selon ses PV. Les seuils se posent avec
 *                          <Phases: 60, 25> sur l'ennemi ; sans notetag, il
 *                          n'a qu'une phase et phase() vaut toujours 1.
 *                          → « EVAL user.phase() === 3: Skill 1051, Random »
 *
 *   user.combien(id)       Combien d'ennemis de ce type sont encore debout à
 *                          ses côtés ? Pour les boss qui puisent dans leur
 *                          nombre — ou qui s'affolent quand il n'y a plus
 *                          personne.
 *                          → « EVAL user.combien(825) === 0: Skill 983 »
 *
 *   user.tourDeLaPhase()   Combien de tours depuis sa dernière bascule de
 *                          phase. Permet une cadence PROPRE à chaque phase,
 *                          au lieu d'un TURN % 3 global identique pour tous.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * DEUX PRÉCAUTIONS
 * ───────────────────────────────────────────────────────────────────────────
 *
 * 1. `EVAL` de Yanfly évalue la ligne jusqu'au « : ». On évite donc les deux-
 *    points dans les expressions — d'où ces méthodes courtes plutôt que du
 *    JavaScript écrit à la main dans le bloc.
 *
 * 2. Tout est en try/catch et rend une valeur neutre en cas d'ennui : une
 *    doctrine mal écrite ne doit jamais figer un combat. Elle rate sa ligne,
 *    la suivante prend le relais.
 */

(function () {
    'use strict';

    /** Les adversaires de ce combattant : pour un ennemi, le groupe. */
    function enFace(b) {
        try { return b.opponentsUnit().aliveMembers(); } catch (e) { return []; }
    }
    /** Les siens. */
    function lesSiens(b) {
        try { return b.friendsUnit().aliveMembers(); } catch (e) { return []; }
    }

    //=========================================================================
    // « quelqu'un d'en face porte ma marque »
    //=========================================================================
    Game_Battler.prototype.aMarque = function (idEtat) {
        var n = Number(idEtat);
        if (!n) { return false; }
        return enFace(this).some(function (a) { return a.isStateAffected(n); });
    };

    //=========================================================================
    // « combien de tours avant que ça tombe »
    //=========================================================================
    // On rend le PLUS PETIT compte parmi ceux qui portent l'état : c'est celui
    // qui va expirer en premier, donc celui sur lequel le boss doit se décider.
    Game_Battler.prototype.compte = function (idEtat) {
        var n = Number(idEtat);
        if (!n) { return 0; }
        var restes = enFace(this).filter(function (a) { return a.isStateAffected(n); })
            .map(function (a) {
                try { return a._stateTurns[n] || 0; } catch (e) { return 0; }
            });
        if (!restes.length) { return 0; }
        return Math.min.apply(null, restes);
    };

    //=========================================================================
    // « dans quelle forme je suis »
    //=========================================================================
    // <Phases: 60, 25>  →  phase 1 au-dessus de 60 %, phase 2 entre 60 et 25,
    // phase 3 en dessous. Autant de seuils qu'on veut, dans l'ordre décroissant.
    function seuils(b) {
        try {
            var src = b.enemy ? b.enemy() : (b.actor ? b.actor() : null);
            if (!src || !src.note) { return []; }
            // ⚠ MV garde l'espace après les deux-points (§7) : d'où le trim().
            var m = /<\s*Phases\s*:\s*([^>]*)>/i.exec(src.note);
            if (!m) { return []; }
            return m[1].split(',').map(function (x) { return parseFloat(String(x).trim()); })
                .filter(function (x) { return !isNaN(x); })
                .sort(function (a, b) { return b - a; });
        } catch (e) { return []; }
    }

    Game_Battler.prototype.phase = function () {
        var s = seuils(this);
        if (!s.length) { return 1; }
        var pct = 0;
        try { pct = this.hpRate() * 100; } catch (e) { return 1; }
        var p = 1;
        for (var i = 0; i < s.length; i++) { if (pct <= s[i]) { p = i + 2; } }
        return p;
    };

    /** Depuis combien de tours il est dans cette forme. */
    Game_Battler.prototype.tourDeLaPhase = function () {
        var p = this.phase();
        if (this._phaseVue !== p) {
            this._phaseVue = p;
            this._phaseDepuis = $gameTroop ? $gameTroop.turnCount() : 0;
        }
        var t = $gameTroop ? $gameTroop.turnCount() : 0;
        return Math.max(0, t - (this._phaseDepuis || 0));
    };

    //=========================================================================
    // « combien des miens tiennent encore »
    //=========================================================================
    Game_Battler.prototype.combien = function (idEnnemi) {
        var n = Number(idEnnemi);
        return lesSiens(this).filter(function (e) {
            try { return e.isEnemy() && e.enemyId() === n; } catch (x) { return false; }
        }).length;
    };

    /** Tous les siens, sauf lui : « suis-je seul ? » */
    Game_Battler.prototype.seul = function () {
        var moi = this;
        return lesSiens(this).filter(function (e) { return e !== moi; }).length === 0;
    };

    //=========================================================================
    // DE QUOI LE MESURER SANS DEVINER
    //=========================================================================
    window.DoctrinesDeBoss = {
        lire: function (battler) {
            if (!battler) { return null; }
            return {
                phase: battler.phase(),
                tourDeLaPhase: battler.tourDeLaPhase(),
                seuils: seuils(battler),
                seul: battler.seul()
            };
        }
    };
})();
