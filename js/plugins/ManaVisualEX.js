//=============================================================================
// ManaVisualEX.js — v1.0  ·  Grosse MAJ visuelle : stats animées, affinités,
//                            éléments, lisibilité (complément de ManaVisuals)
// RPG Maker MV   ·   by JOKO   ·   À CHARGER APRÈS ManaVisuals & ReadableText
//=============================================================================
/*:
 * @target MV
 * @plugindesc v1.0 ■ MAJ visuelle : barres de stats ANIMÉES + comptage, badge
 * d'affinité & résistances élémentaires dans le Statut, soulignement élément des
 * compétences, aide enrichie (élément + cycle). Style classique, animé, lisible.
 * @author JOKO
 *
 * @param AnimSpeed
 * @text Vitesse d'animation des barres
 * @type number
 * @decimals 2
 * @desc Fraction ajoutée par frame (0.07 ≈ 0,25 s). 1 = instantané.
 * @default 0.07
 *
 * @param ShowResist
 * @text Afficher les résistances dans le Statut
 * @type boolean
 * @default true
 *
 * @help
 * ============================================================================
 *  ManaVisualEX — la couche « finition » visuelle                       JOKO
 * ============================================================================
 *  Complète ManaVisuals (à charger APRÈS) sans le remplacer :
 *
 *  • STATUT : les 6 paramètres s'affichent avec des barres colorées qui se
 *    REMPLISSENT en douceur et un compteur qui monte (animé à l'ouverture et
 *    au changement de personnage). À droite : badge d'AFFINITÉ de Mana + les
 *    FAIBLESSES/RÉSISTANCES élémentaires notables (×rate, vert = résiste,
 *    rouge = vulnérable).
 *
 *  • COMPÉTENCES : chaque entrée reçoit un soulignement de la couleur de son
 *    ÉLÉMENT (en plus du nom déjà coloré par ManaVisuals).
 *
 *  • AIDE : 【ÉLÉMENT】 + relation du cycle de Mana (« fort vs … · faible
 *    vs … », Mana Pur transperce, Mana Sombre ronge le corps), lisible.
 *
 *  Lit l'affinité via <Mana: ...> (Acteur/Classe), comme ManaAffinity.
 *  Aucune dépendance dure. Style fenêtre classique RPG Maker.
 * ============================================================================
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('ManaVisualEX');
    var ANIM_SPEED  = parseFloat(P['AnimSpeed'] || 0.07) || 0.07;
    var SHOW_RESIST = String(P['ShowResist'] || 'true') === 'true';

    //========================================================================
    // REGISTRE DES ÉLÉMENTS (couleur CSS + couleur de palette \C[n] pour l'aide)
    //========================================================================
    var ELEM = {
        1:  { color: '#bdbdbd', mc: 0  }, // Physique
        2:  { color: '#cdb8ff', mc: 27 }, // mana spirituelle
        3:  { color: '#ffd95a', mc: 14 }, // mana positive
        4:  { color: '#6fa8ff', mc: 1  }, // mana négative
        5:  { color: '#b061e0', mc: 30 }, // Mana Sombre
        6:  { color: '#f2f2f2', mc: 0  }, // Mana Originel
        7:  { color: '#5fd6c0', mc: 24 }, // AME
        8:  { color: '#ff6b4a', mc: 2  }, // FEU
        9:  { color: '#4ec3ff', mc: 1  }, // EAU
        10: { color: '#7be07b', mc: 3  }, // VENT
        11: { color: '#c79a5b', mc: 17 }, // TERRE
        12: { color: '#ffe14a', mc: 14 }, // FOUDRE
        13: { color: '#aef0ff', mc: 4  }, // GLACE
        14: { color: '#fff3a0', mc: 6  }, // LUMIÈRE
        15: { color: '#8a7fb0', mc: 8  }, // OMBRE
        16: { color: '#e0a0ff', mc: 27 }  // mana semi parfait
    };

    function elemName(id) {
        return ($dataSystem && $dataSystem.elements[id] ? $dataSystem.elements[id].trim() : '');
    }
    function elemOf(skill) {
        if (!skill || !skill.damage) return 0;
        var e = skill.damage.elementId;
        if (e === -1) return 1;
        return (e > 0) ? e : 0;
    }

    // Cycle de Mana (cf. ManaAffinity) : 4>2 , 2>3 , 3>4
    function cycleHint(el) {
        switch (el) {
            case 4: return 'fort vs ' + elemName(2) + ' · faible vs ' + elemName(3);
            case 2: return 'fort vs ' + elemName(3) + ' · faible vs ' + elemName(4);
            case 3: return 'fort vs ' + elemName(4) + ' · faible vs ' + elemName(2);
            case 5: return 'ronge le corps du lanceur (recul PV)';
            case 7: return 'Mana Pur : transperce les résistances';
            default: return '';
        }
    }

    // Affinité d'un acteur via <Mana: ...> (Acteur puis Classe)
    function branchFromString(str) {
        switch (String(str).toLowerCase().trim()) {
            case 'spirituelle': case 'ame': case 'âme': return 2;
            case 'positif': case 'positive': return 3;
            case 'negatif': case 'négatif': case 'negative': return 4;
            case 'sombre': return 5;
            case 'pur': case 'parfait': return 7;
            default: var n = parseInt(str, 10); return isNaN(n) ? 0 : n;
        }
    }
    function affinityOf(actor) {
        if (!actor || !actor.actor) return 0;
        var src = [];
        if (actor.actor()) src.push(actor.actor().meta);
        if (actor.currentClass && actor.currentClass()) src.push(actor.currentClass().meta);
        for (var i = 0; i < src.length; i++) {
            if (src[i] && src[i].Mana) return branchFromString(src[i].Mana);
        }
        return 0;
    }

    //========================================================================
    // A) LISTE DE COMPÉTENCES — soulignement coloré par élément
    //========================================================================
    var _SL_drawItem = Window_SkillList.prototype.drawItem;
    Window_SkillList.prototype.drawItem = function (index) {
        _SL_drawItem.call(this, index);
        var skill = this._data && this._data[index];
        var el = elemOf(skill);
        if (!el || !ELEM[el]) return;
        var rect = this.itemRect(index);
        var w = Math.max(60, Math.min(190, rect.width - 130));
        this.contents.fillRect(rect.x + 36, rect.y + rect.height - 4, w, 2, ELEM[el].color);
    };

    //========================================================================
    // B) AIDE ENRICHIE — élément + relation du cycle (lisible)
    //========================================================================
    var _SL_updateHelp = Window_SkillList.prototype.updateHelp; // (ManaVisuals)
    Window_SkillList.prototype.updateHelp = function () {
        var s = this.item();
        if (s && s.damage !== undefined && this._helpWindow) {
            var el = elemOf(s);
            var mc = (el && ELEM[el]) ? ELEM[el].mc : 0;
            var head = (el && elemName(el))
                ? '\\C[' + mc + ']【' + elemName(el).toUpperCase() + '】\\C[0]  '
                : '';
            var hint = cycleHint(el);
            var body = s.description || '';
            var tail = hint ? '\n\\C[6]» ' + hint + '\\C[0]' : '';
            this._helpWindow.setText(head + body + tail);
        } else if (_SL_updateHelp) {
            _SL_updateHelp.call(this);
        }
    };

    //========================================================================
    // C) STATUT — barres de paramètres ANIMÉES + affinité + résistances
    //========================================================================
    if (typeof Window_Status !== 'undefined') {

        // Pilote l'animation (remplissage + comptage) à l'ouverture / changement d'acteur
        var _Status_update = Window_Status.prototype.update;
        Window_Status.prototype.update = function () {
            _Status_update.call(this);
            if (this._mvxAnim == null) this._mvxAnim = 0;
            if (this._mvxAnim < 1) {
                this._mvxAnim = Math.min(1, this._mvxAnim + ANIM_SPEED);
                this.refresh();
            }
        };

        Window_Status.prototype.drawParameters = function (x, y) {
            var a = this._actor;
            if (!a) return;
            // Réinitialise l'animation quand on change de personnage
            if (this._mvxLastActor !== a) { this._mvxLastActor = a; this._mvxAnim = 0; }
            var r = (this._mvxAnim == null) ? 1 : this._mvxAnim;

            var lh = this.lineHeight();
            var vals = []; for (var k = 0; k < 6; k++) vals.push(a.param(k + 2));
            var mx = Math.max.apply(null, vals) || 1;
            var barW = 188;

            for (var i = 0; i < 6; i++) {
                var pid = i + 2, yy = y + lh * i, val = vals[i];
                this.changeTextColor(this.systemColor());
                this.drawText(TextManager.param(pid), x, yy, 120);
                this.resetTextColor();
                // compteur qui monte pendant l'animation
                this.drawText(Math.floor(val * r), x + 116, yy, 72, 'right');
                // barre relative au plus haut param, remplie progressivement
                var by = yy + Math.floor(lh * 0.74);
                var ratio = (val / mx) * r;
                var col = (val / mx) >= 0.85 ? '#5fd6a0' : (val / mx) >= 0.5 ? '#ffd95a' : '#e08a5a';
                if (window.LoreCanon) { LoreCanon.bar(this.contents, x, by, barW, 6, ratio, col); }
                else {
                    this.contents.fillRect(x, by, barW, 6, 'rgba(0,0,0,0.4)');
                    this.contents.fillRect(x + 1, by + 1, Math.floor((barW - 2) * ratio), 4, col);
                }
            }

            drawAffinityPanel.call(this, a, x, y, lh, r);
        };

        /*
         * Panneau d'affinité — DANS LA BANDE DU MILIEU, pas à droite.
         *
         * Il était posé à la moitié de la largeur (x ≈ 438). Or MV dessine la
         * liste d'équipement à x = 432 dans la même bande verticale : les deux
         * s'écrivaient l'un sur l'autre, et on lisait « Af<Lame Écarlate>de Fer ».
         * Aucune erreur, aucun avertissement — juste un écran illisible.
         *
         * Les paramètres occupent la gauche jusqu'à x+190 environ, l'équipement
         * prend tout à partir de 432. Il reste une colonne au milieu : c'est là
         * que le panneau va, en corps plus petit pour y tenir.
         */
        var EQUIP_X = 432;       // là où Window_Status.drawEquipments commence
        var CORPS_PANNEAU = 20;  // le corps 28 ne tient pas dans la bande du milieu

        function drawAffinityPanel(a, x, y, lh, r) {
            var x2 = x + 200;
            var w2 = EQUIP_X - x2 - 12;
            if (w2 < 120) { return; }                  // pas la place : on s'abstient
            var corpsAvant = this.contents.fontSize;
            this.contents.fontSize = CORPS_PANNEAU;

            this.changeTextColor(this.systemColor());
            this.drawText('Affinité de Mana', x2, y, w2);
            this.resetTextColor();

            var aff = affinityOf(a);
            if (aff && ELEM[aff]) {
                this.changeTextColor(ELEM[aff].color);
                this.drawText('【 ' + elemName(aff).toUpperCase() + ' 】', x2, y + lh, w2);
            } else {
                this.changeTextColor('#888888');
                this.drawText('— neutre —', x2, y + lh, w2);
            }
            this.resetTextColor();

            if (!SHOW_RESIST) { this.contents.fontSize = corpsAvant; return; }
            this.changeTextColor(this.systemColor());
            this.drawText('Éléments', x2, y + Math.floor(lh * 2.4), w2);
            this.resetTextColor();

            var shown = 0;
            for (var eid = 1; eid <= 16 && shown < 4; eid++) {
                var rate = a.elementRate(eid);
                if (Math.abs(rate - 1) < 0.001) continue;       // neutre : on saute
                if (!ELEM[eid] || !elemName(eid)) continue;
                var yy = y + Math.floor(lh * (3.4 + shown));
                this.changeTextColor(ELEM[eid].color);
                this.drawText(elemName(eid), x2, yy, Math.floor(w2 * 0.62));
                this.changeTextColor(rate < 1 ? '#5fd6a0' : '#ff7a6a'); // résiste / vulnérable
                this.drawText('×' + (Math.round(rate * 100) / 100), x2 + Math.floor(w2 * 0.62), yy, Math.floor(w2 * 0.38), 'right');
                this.resetTextColor();
                shown++;
            }
            if (shown === 0) {
                this.changeTextColor('#888888');
                this.drawText('(aucune notable)', x2, y + Math.floor(lh * 3.4), w2);
                this.resetTextColor();
            }
            this.contents.fontSize = corpsAvant;
        }
    }

})();
