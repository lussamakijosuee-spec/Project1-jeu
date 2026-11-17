//=============================================================================
// ManaAffinity.js — v2.0
// Le CORPS — l'Art de la Maîtrise (mana sombre / mana négatif)
// RPG Maker MV   ·   by JOKO
//=============================================================================

/*:
 * @plugindesc v2.0 ■ CORPS (Maîtrise) : recul PV du Mana Sombre(source)/Négatif
 * (projeté), Mana Positif lié à la santé mentale, Mana Pur perce-résistances.
 * Refonte « Trois Sources » : plus aucun cycle pierre-feuille-ciseaux.
 * @author JOKO
 *
 * @param recoilNegatif
 * @text Recul PV — Mana Négatif (%)
 * @type number
 * @min 0
 * @default 15
 * @desc % des dégâts infligés que l'utilisateur du Mana Négatif (élém 4, la forme PROJETÉE) se prend en retour.
 *
 * @param recoilSombre
 * @text Recul PV — Mana Sombre (%)
 * @type number
 * @min 0
 * @default 25
 * @desc % des dégâts infligés que l'utilisateur du Mana Sombre (élém 5, la SOURCE brute) se prend en retour. Plus cher : on puise plus profond.
 *
 * @param positifSanFactor
 * @text Mana Positif affaibli par la santé mentale ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Si Oui, le Mana Positif (élém 3) faiblit quand la santé mentale du lanceur baisse (via JadeEntitePlunging / window.Ame).
 *
 * @param showLog
 * @text Messages de combat ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @param --- IDs ÉLÉMENTS ---
 * @default
 *
 * @param elPositif
 * @text Élément — Positif (Esprit)
 * @type number
 * @default 3
 *
 * @param elNegatif
 * @text Élément — Négatif (Corps, projeté)
 * @type number
 * @default 4
 *
 * @param elSombre
 * @text Élément — Sombre (Corps, source)
 * @type number
 * @default 5
 *
 * @param elPur
 * @text Élément — Pur / Parfait
 * @type number
 * @default 7
 *
 * @param elSemiParfait
 * @text Élément — Semi-Parfait
 * @type number
 * @default 16
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE CORPS — l'Art de la Maîtrise                                    by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Traduit le lore du Corps (Codex des Trois Sources) en règles de combat.
 *  Le Corps n'invoque pas le pouvoir : il le DÉPLACE, comme on contracte un
 *  muscle. Il ne se paie pas en mana, mais en CHAIR.
 *
 *  ▶ LA SOURCE & CE QU'ON PROJETTE
 *      • Mana SOMBRE (élém 5) = la SOURCE brute : le sang d'Ombrefauve qui
 *        dort dans les veines. Le puiser réveille la Bête → recul PV plus lourd.
 *      • Mana NÉGATIF (élém 4) = la forme RAFFINÉE qu'on projette au-dehors
 *        (renforcer, projeter) → recul PV moindre.
 *    Dans les deux cas, frapper coûte des PV au lanceur (le prix du Corps).
 *    Réglable par skill : notetag  <ReculVital: 20>  force le % (sinon défaut
 *    selon l'élément). Un acteur <Atone> (sans affinité) ne subit que la moitié.
 *
 *  ▶ MANA POSITIF & SANTÉ MENTALE  (élém 3)
 *    L'Esprit faiblit quand l'esprit va mal : le Mana Positif perd en puissance
 *    à mesure que la santé mentale du lanceur baisse (lecture via window.Ame).
 *
 *  ▶ MANA PUR / SEMI-PARFAIT  (élém 7 et 16)
 *    Transcende tout : ils IGNORENT les résistances/faiblesses élémentaires de
 *    la cible (taux d'élément forcé à 100 %). « Le Mana Pur perce toute
 *    résistance. »
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  CE QUI A ÉTÉ RETIRÉ (refonte v2, « Trois Sources »)
 *  ─────────────────────────────────────────────────────────────────────────
 *  • Le CYCLE pierre-feuille-ciseaux des branches (Négatif>Âme>Positif, ×1.5 /
 *    ×0.5) : SUPPRIMÉ. L'avantage de combat vient désormais des ARTS et des
 *    CHUTES, pas d'un cycle entre branches.
 *  • La ROUE d'avantages élémentaires : SUPPRIMÉE. Seule l'opposition
 *    Lumière ⇄ Ombre subsiste (gérée en base, pas ici).
 *
 *  ▶ LA CHUTE : la Bête
 *    Abuser du Sombre/Négatif remplit la jauge de Corruption (plugin
 *    CorruptionAme : Calme → Frémissement 40 → Fièvre 70 → la Mue 100).
 *    Ce plugin-ci ne gère QUE le prix immédiat (le recul PV) ; la Chute est
 *    gérée par CorruptionAme.
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('ManaAffinity');
    var REC_NEG  = parseInt(P['recoilNegatif']  || 15) / 100;
    var REC_SOM  = parseInt(P['recoilSombre']   || 25) / 100;
    var POS_SAN  = String(P['positifSanFactor'] || 'true') === 'true';
    var SHOW_LOG = String(P['showLog']          || 'true') === 'true';

    var EL_POS = parseInt(P['elPositif']     || 3);
    var EL_NEG = parseInt(P['elNegatif']     || 4);
    var EL_SOM = parseInt(P['elSombre']      || 5);
    var EL_PUR = parseInt(P['elPur']         || 7);
    var EL_SEMI = parseInt(P['elSemiParfait'] || 16);

    //=========================================================================
    // OUTILS
    //=========================================================================

    function battleLog(text) {
        if (!SHOW_LOG) return;
        var s = SceneManager._scene;
        if (s && s._logWindow) s._logWindow.addText(text);
    }

    /** Élément d'une action (de son skill/objet). */
    function actionElement(action) {
        var item = action.item();
        if (!item || !item.damage) return 0;
        var eid = item.damage.elementId;
        return (eid > 0) ? eid : 0;
    }

    /** Un battler « Atone » (sans affinité) paie moitié moins le Corps. */
    function isAtone(battler) {
        try {
            var note = '';
            if (battler.isActor && battler.isActor() && battler.actor()) note = battler.actor().note || '';
            else if (battler.isEnemy && battler.isEnemy() && battler.enemy()) note = battler.enemy().note || '';
            return /<Atone>/i.test(note);
        } catch (e) { return false; }
    }

    /** Facteur de Mana Positif selon la santé mentale du lanceur (via Ame). */
    function positifSanFactor(subject) {
        if (!POS_SAN) return 1;
        if (typeof window.Ame === 'undefined' || !window.Ame) return 1;
        if (!(subject && subject.isActor && subject.isActor())) return 1;
        var phase = window.Ame.phase(subject.actorId());
        if (!phase) return 1;
        // phase 5/4 = 1.0 ; 3 = 0.85 ; 2 = 0.70 ; 1 = 0.55
        return ({ 5: 1.0, 4: 1.0, 3: 0.85, 2: 0.70, 1: 0.55 })[phase] || 1;
    }

    //=========================================================================
    // MANA PUR / SEMI-PARFAIT — ignore les résistances élémentaires de la cible
    //=========================================================================

    var _GA_calcElementRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function (target) {
        var el = actionElement(this);
        if (el === EL_PUR || el === EL_SEMI) return 1; // perce toute résistance
        return _GA_calcElementRate.call(this, target);
    };

    //=========================================================================
    // MANA POSITIF affaibli par la santé mentale — multiplicateur de dégâts
    //=========================================================================

    var _GA_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var value = _GA_makeDamageValue.call(this, target, critical);
        if (value === 0) return value;

        if (actionElement(this) === EL_POS) {
            var pf = positifSanFactor(this.subject());
            if (pf < 1) value = Math.floor(value * pf);
        }
        return value;
    };

    //=========================================================================
    // LE PRIX DU CORPS — recul PV du Mana Négatif (projeté) / Sombre (source)
    //   Owner unique du recul : lit <ReculVital: N> (override) sinon le défaut
    //   selon l'élément. (Consolide l'ancien Lore_ManaReculVital.)
    //=========================================================================

    var _GA_executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        _GA_executeDamage.call(this, target, value);
        if (value <= 0) return;

        var item = this.item();
        var el = actionElement(this);

        // Taux de recul : notetag prioritaire, sinon défaut selon l'élément.
        var rate = 0;
        if (item && item.meta && item.meta.ReculVital !== undefined) {
            rate = (Number(item.meta.ReculVital) || 0) / 100;
        } else if (el === EL_SOM) {
            rate = REC_SOM;
        } else if (el === EL_NEG) {
            rate = REC_NEG;
        }
        if (rate <= 0) return;

        var subject = this.subject();
        if (!subject || !subject.isAlive()) return;

        if (isAtone(subject)) rate /= 2;
        var recoil = Math.max(1, Math.floor(value * rate));
        subject.gainHp(-recoil);
        subject.startDamagePopup();
        subject.clearResult();
        if ($gameScreen) $gameScreen.startFlash([120, 0, 0, 60], 12);
        battleLog((subject.name ? subject.name() : 'Le lanceur') +
                  ' brûle sa chair pour le Mana ' +
                  (el === EL_SOM ? 'Sombre' : 'Négatif') +
                  ' (-' + recoil + ' PV).');
        if (subject.isDead()) subject.performCollapse();
    };

})();
