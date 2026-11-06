//=============================================================================
// LoreCanon.js — v1.0 · La source de vérité (noms, couleurs, jauge)
// RPG Maker MV   ·   à charger TÔT (avant les HUD Errance/Corruption/SAN)
//=============================================================================
/*:
 * @plugindesc [v1.0] Source de vérité partagée : noms de paliers + couleurs du
 * lore (Errance, Corruption, Santé mentale) et une jauge arrondie commune, pour
 * que TOUS les écrans parlent le même langage et aient le même style.
 * @author Claude
 *
 * @help
 * ════════════════════════════════════════════════════════════════════════
 *  LORE CANON — un seul endroit pour les noms, les couleurs et les jauges
 * ════════════════════════════════════════════════════════════════════════
 *  Ce plugin n'ajoute AUCUN effet de jeu. Il expose window.LoreCanon, que les
 *  autres plugins (HUD Errance, Corruption, Santé mentale, Guide…) utilisent
 *  pour afficher exactement les mêmes libellés, les mêmes couleurs et des
 *  jauges au même style arrondi. Fini les divergences.
 *
 *  Les seuils/couleurs reprennent fidèlement ceux déjà définis par
 *  Errance.js, CorruptionAme.js et JadeEntitePlunging (phase 1–5).
 *
 *  À CHARGER TÔT (avant les plugins d'affichage). Tout consommateur reste
 *  défensif : si LoreCanon est absent, il garde son rendu d'origine.
 *
 *  API :
 *    LoreCanon.errance(lv)     → { nom, couleur }   (lv 0–100)
 *    LoreCanon.corruption(lv)  → { nom, couleur }   (lv 0–100)
 *    LoreCanon.mental(phase)   → { nom, couleur }   (phase 1–5)
 *    LoreCanon.bar(contents, x, y, w, h, rate, couleur)   jauge arrondie
 * ════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    // Paliers (du plus haut au plus bas) : [seuil, nom, couleur]
    var ERRANCE = [
        [100, 'l\'Errant',      '#7f8cff'],
        [70,  'Gonflé d\'âmes', '#9b6fd8'],
        [40,  'Décharné',       '#5dcaa5'],
        [0,   'Ancré',          '#7fbf7f']
    ];
    var CORRUPTION = [
        [100, 'la Mue',       '#8e44ad'],
        [70,  'Fièvre',       '#c0392b'],
        [40,  'Frémissement', '#e67e22'],
        [0,   'Calme',        '#2ecc71']
    ];
    // Santé mentale, phase 1→5 (index 0 = phase 1). Noms = ceux de window.Ame.
    var MENTAL_NOMS = ['Effondrement', 'Instable', 'Tension', 'Stable', 'Maîtrise'];
    var MENTAL_COUL = ['#7a1a1a', '#b0562a', '#c7a24a', '#5fa8d6', '#5fd6c0'];

    function paliersInfo(table, lv) {
        lv = Number(lv) || 0;
        for (var i = 0; i < table.length; i++) {
            if (lv >= table[i][0]) return { nom: table[i][1], couleur: table[i][2] };
        }
        var last = table[table.length - 1];
        return { nom: last[1], couleur: last[2] };
    }

    var LoreCanon = {
        VERSION: '1.0',

        errance:    function (lv) { return paliersInfo(ERRANCE, lv); },
        corruption: function (lv) { return paliersInfo(CORRUPTION, lv); },
        mental:     function (phase) {
            var p = Math.max(1, Math.min(5, Number(phase) || 3));
            return { nom: MENTAL_NOMS[p - 1], couleur: MENTAL_COUL[p - 1] };
        },

        // couleurs thématiques des trois Chutes (pour un vocabulaire visuel commun)
        COULEURS: {
            errance:    '#7f8cff',  // l'Errant  — bleu froid
            corruption: '#8e44ad',  // la Bête   — violet
            mental:     '#5fd6c0',  // le Fond   — cyan malade
            santeBonne: '#5fd6c0',
            santeMauvaise: '#ff5a5a'
        },

        // Jauge arrondie commune (même style que VisualOverhaul), autonome.
        bar: function (contents, x, y, w, h, rate, couleur) {
            if (!contents) return;
            rate = Math.max(0, Math.min(1, Number(rate) || 0));
            couleur = couleur || '#ffffff';
            var ctx = contents.context;
            if (!ctx) { // repli plat si pas de contexte 2D
                contents.fillRect(x, y, w, h, 'rgba(0,0,0,0.5)');
                contents.fillRect(x + 1, y + 1, Math.floor((w - 2) * rate), h - 2, couleur);
                return;
            }
            var r = h / 2;
            function rr(px, py, pw, ph, pr) {
                pr = Math.min(pr, ph / 2, pw / 2);
                ctx.beginPath();
                ctx.moveTo(px + pr, py);
                ctx.arcTo(px + pw, py, px + pw, py + ph, pr);
                ctx.arcTo(px + pw, py + ph, px, py + ph, pr);
                ctx.arcTo(px, py + ph, px, py, pr);
                ctx.arcTo(px, py, px + pw, py, pr);
                ctx.closePath();
            }
            ctx.save();
            rr(x, y, w, h, r); ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fill();
            var fw = Math.floor(w * rate);
            if (rate > 0 && fw < h) fw = h; // garde un bout visible même très bas
            if (fw > 0) {
                ctx.save();
                rr(x, y, w, h, r); ctx.clip();
                ctx.fillStyle = couleur; ctx.fillRect(x, y, fw, h);
                ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.fillRect(x, y + 1, fw, Math.max(1, Math.floor(h / 3)));
                ctx.restore();
            }
            rr(x + 0.5, y + 0.5, w - 1, h - 1, r);
            ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1; ctx.stroke();
            ctx.restore();
            if (contents._setDirty) contents._setDirty();
        }
    };

    window.LoreCanon = LoreCanon;
})();
