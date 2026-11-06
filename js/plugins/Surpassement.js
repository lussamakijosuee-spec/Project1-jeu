//=============================================================================
// Surpassement.js — v2.0  ·  L'Équilibre — le Mana Semi-Parfait
// RPG Maker MV   ·   by JOKO
//   Lit les TROIS jauges de Chute (Corruption, Errance, santé mentale) —
//   les mêmes que TriangleAffinites — au lieu de la seule santé mentale.
//=============================================================================
/*:
 * @plugindesc v2.0 ■ ÉQUILIBRE : tenir les trois sources en tension (ni Bête,
 * ni Errant, ni Dément) accorde l'état « Surpassé » (Mana Semi-Parfait). Additif.
 * @author JOKO
 *
 * @param rewardState
 * @text État « Surpassé » (récompense)
 * @type state
 * @default 188
 *
 * @param seuilEngage
 * @text Seuil d'engagement (%)
 * @type number
 * @min 0
 * @max 100
 * @default 15
 * @desc En dessous, les jauges sont trop basses pour parler d'équilibre « tenu » (calme, pas de bonus).
 *
 * @param seuilEcart
 * @text Écart maximal entre jauges (%)
 * @type number
 * @min 0
 * @max 100
 * @default 22
 * @desc Semi-Parfait tant que l'écart entre la plus haute et la plus basse jauge reste sous ce seuil.
 *
 * @param messagesExces
 * @text Répliques quand une voie l'emporte ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'ÉQUILIBRE — le Mana Semi-Parfait                                  by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  « Le maître n'est pas celui qui pousse le plus loin une source, mais celui
 *   qui sait toujours revenir. »  Le centre des trois Chutes — ni la Bête, ni
 *   l'Errant, ni le Dément — est le Mana Semi-Parfait : on peut tout faire sans
 *   basculer.
 *
 *  Ce plugin lit les TROIS jauges de Chute (les mêmes que le Triangle) :
 *      Corps  → window.Corruption   ·   Âme → window.Errance
 *      Esprit → window.Ame (santé mentale : phase 5 Maîtrise → 1 Effondrement)
 *
 *  • Les trois ENGAGÉES (≥ seuilEngage) et ÉQUILIBRÉES (écart ≤ seuilEcart)
 *    → état « Surpassé » (+stats/+crit) : la tension tenue. 1re fois : note de
 *    croissance permanente.
 *  • Une seule voie qui l'emporte (écart trop grand) → pas de bonus ; option :
 *    réplique thématique de la Chute qui domine.
 *  • Jauges toutes basses → calme, ni bonus ni malus.
 *
 *  API :  window.Equilibre.etat(actorId)  → 'semiparfait' | 'calme' | 'corps'
 *         | 'ame' | 'esprit'   ·   window.Equilibre.intensites(actorId) → {e,c,a}
 *
 *  Aucune dépendance dure : une jauge absente compte pour 0.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('Surpassement');
    var REWARD  = parseInt(P['rewardState'] || 188);
    var ENGAGE  = (parseInt(P['seuilEngage'] || 15) || 15) / 100;
    var ECART   = (parseInt(P['seuilEcart']  || 22) || 22) / 100;
    var MSG     = String(P['messagesExces'] || 'true') === 'true';

    // Répliques d'excès quand une voie domine (par héros).
    var EXCES = {
        1: 'L\'équilibre de %1 vacille — tout déborde à la fois.',          // Aël, l'Équilibre
        2: 'Le sang de %1 gronde. La Maîtrise cherche à le maîtriser.',      // Korrah, la Maîtrise
        3: 'Quelque chose tire %1 hors du monde. Sa marque enfle.',          // ludwing, le Symbole
        4: 'Les mots de %1 se brouillent. Le Lac murmure trop fort.'         // Vesper, la Parole
    };

    function log(t) { var w = BattleManager._logWindow; if (w) { w.push('addText', t); w.push('wait'); } }

    //--- Lecture des trois jauges (0..1), défensive — identique au Triangle. ---
    function fCorps(id)  { try { return window.Corruption ? Math.max(0, Math.min(1, window.Corruption.niveau(id) / 100)) : 0; } catch (e) { return 0; } }
    function fAme(id)    { try { return window.Errance ? Math.max(0, Math.min(1, window.Errance.niveau(id) / 100)) : 0; } catch (e) { return 0; } }
    function fEsprit(id) {
        try { if (!window.Ame) return 0; var ph = window.Ame.phase(id); return ph ? Math.max(0, Math.min(1, (5 - ph) / 4)) : 0; }
        catch (e) { return 0; }
    }

    //--- API publique partagée -------------------------------------------------
    var Equilibre = {
        intensites: function (id) { return { e: fEsprit(id), c: fCorps(id), a: fAme(id) }; },
        etat: function (id) {
            var x = this.intensites(id), max = Math.max(x.e, x.c, x.a), min = Math.min(x.e, x.c, x.a);
            if (max < ENGAGE) return 'calme';
            if (max - min <= ECART) return 'semiparfait';
            if (max === x.c) return 'corps';
            if (max === x.a) return 'ame';
            return 'esprit';
        }
    };
    window.Equilibre = Equilibre;

    //--- Application en combat --------------------------------------------------
    var _startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        $gameParty.battleMembers().forEach(function (a) {
            var id = a.actorId();
            var etat = Equilibre.etat(id);

            if (etat === 'semiparfait') {
                if (!a.isStateAffected(REWARD)) {
                    a.addState(REWARD);
                    log('\\C[14]★ ' + a.name() + ' tient les trois sources en équilibre — Mana Semi-Parfait.\\C[0]');
                    $gameSystem._surpasse = $gameSystem._surpasse || {};
                    if (!$gameSystem._surpasse[id]) {
                        $gameSystem._surpasse[id] = true;
                        log('\\C[6]Ni Bête, ni Errant, ni Dément. ' + a.name() + ' est, un instant, tout à la fois.\\C[0]');
                    }
                }
            } else {
                if (a.isStateAffected(REWARD)) a.removeState(REWARD);
                if (MSG && (etat === 'corps' || etat === 'ame' || etat === 'esprit') &&
                    EXCES[id] && Math.randomInt(100) < 35) {
                    log('\\C[8]' + EXCES[id].replace('%1', a.name()) + '\\C[0]');
                }
            }
        });
        _startTurn.call(this);
    };
})();
