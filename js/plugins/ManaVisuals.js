//=============================================================================
// ManaVisuals.js — v1.0  ·  Visuel des compétences / affinités / éléments / stats
// RPG Maker MV   ·   by JOKO
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Gros lifting visuel : noms de compétences colorés par leur
 * affinité de Mana, affinité affichée dans l'aide, et stats avec barres de profil.
 * @author JOKO
 *
 * @help
 *  • Chaque compétence est colorée selon son ÉLÉMENT (Sombre = violet, Feu =
 *    orange, etc.) — dans le menu ET en combat.
 *  • L'aide affiche l'affinité : 【MANA SOMBRE】 ...
 *  • L'écran de Statut affiche les paramètres avec une barre de profil.
 *  Aucune configuration. Lit les éléments de la Base de données.
 */
(function () {
    'use strict';

    // couleur par id d'élément (cf. tes 16 éléments)
    var COLORS = {
        1: '#bdbdbd', 2: '#cdb8ff', 3: '#ffd95a', 4: '#6fa8ff', 5: '#b061e0',
        6: '#f2f2f2', 7: '#5fd6c0', 8: '#ff6b4a', 9: '#4ec3ff', 10: '#7be07b',
        11: '#c79a5b', 12: '#ffe14a', 13: '#aef0ff', 14: '#fff3a0', 15: '#8a7fb0', 16: '#e0a0ff',
        // éléments dérivés (somme de deux éléments)
        17: '#c9d6df', 19: '#ff8a3c', 20: '#6fcf6f', 22: '#bfeaff', 23: '#9fb6c4', 29: '#b07cff'
    };
    function elemOf(skill) {
        if (!skill || !skill.damage) return 0;
        var e = skill.damage.elementId;
        if (e === -1) return 1;       // attaque normale -> physique
        return (e > 0) ? e : 0;
    }
    function elemName(id) { return ($dataSystem && $dataSystem.elements[id] ? $dataSystem.elements[id].trim() : '').toUpperCase(); }

    //--- A) Nom de compétence coloré par affinité (menu + combat) ---
    var _drawItemName = Window_Base.prototype.drawItemName;
    Window_Base.prototype.drawItemName = function (item, x, y, width) {
        if (item && item.stypeId !== undefined && item.damage) {       // c'est une compétence
            var el = elemOf(item);
            if (el && COLORS[el]) {
                width = width || 312;
                var iw = Window_Base._iconWidth, ih = Window_Base._iconHeight;
                var iconY = y + (this.lineHeight() - ih) / 2;
                this.resetTextColor();
                this.drawIcon(item.iconIndex, x + 2, iconY);
                this.changeTextColor(COLORS[el]);
                this.drawText(item.name, x + iw + 4, y, width - iw - 4);
                this.resetTextColor();
                return;
            }
        }
        _drawItemName.call(this, item, x, y, width);
    };

    //--- B) Affinité dans l'aide ---
    var _updateHelp = Window_SkillList.prototype.updateHelp;
    Window_SkillList.prototype.updateHelp = function () {
        var s = this.item();
        if (s && this._helpWindow) {
            var el = elemOf(s);
            var tag = (el && elemName(el)) ? '【' + elemName(el) + '】  ' : '';
            this._helpWindow.setText(tag + (s.description || ''));
        } else {
            _updateHelp.call(this);
        }
    };

    //--- C) Statut : paramètres avec barre de profil ---
    if (typeof Window_Status !== 'undefined') {
        Window_Status.prototype.drawParameters = function (x, y) {
            var lh = this.lineHeight(), a = this._actor;
            var vals = []; for (var k = 0; k < 6; k++) vals.push(a.param(k + 2));
            var mx = Math.max.apply(null, vals) || 1;
            for (var i = 0; i < 6; i++) {
                var pid = i + 2, y2 = y + lh * i, val = vals[i];
                this.changeTextColor(this.systemColor());
                this.drawText(TextManager.param(pid), x, y2, 140);
                this.resetTextColor();
                this.drawText(val, x + 140, y2, 70, 'right');
                // barre de profil (relatif au plus haut param de l'acteur)
                var bw = 210, by = y2 + Math.floor(lh * 0.74);
                var ratio = val / mx;
                var col = ratio >= 0.85 ? '#5fd6a0' : ratio >= 0.5 ? '#ffd95a' : '#e08a5a';
                if (window.LoreCanon) { LoreCanon.bar(this.contents, x, by, bw, 6, ratio, col); }
                else {
                    this.contents.fillRect(x, by, bw, 6, 'rgba(0,0,0,0.4)');
                    this.contents.fillRect(x + 1, by + 1, Math.floor((bw - 2) * ratio), 4, col);
                }
            }
        };
    }

    // ══════════════════════════════════════════════════════════════════════
    //  LE PROFIL QUI NE TENAIT PAS
    // ══════════════════════════════════════════════════════════════════════
    //  MV dessine le profil avec drawTextEx, qui ne revient PAS à la ligne
    //  tout seul : il écrit jusqu'au bord et le reste disparaît. Les fiches
    //  des héros font 426 à 467 caractères sur deux lignes — environ 350
    //  caractères invisibles chacun, sans le moindre avertissement.
    //
    //  On découpe donc le texte aux espaces, à la largeur réelle de la
    //  fenêtre, en corps plus petit et en lignes plus serrées : la bande du
    //  bas fait 120 px, ce qui donne cinq lignes de ~85 signes. Tout rentre.
    //
    //  Le texte de JOKO n'est pas touché : on change la façon de le dessiner,
    //  pas ce qu'il dit.
    var CORPS_PROFIL = 20;
    var INTERLIGNE_PROFIL = 24;

    Window_Status.prototype.drawProfile = function (x, y) {
        var texte = this._actor ? String(this._actor.profile() || '') : '';
        if (!texte) { return; }
        var corpsAvant = this.contents.fontSize;
        this.contents.fontSize = CORPS_PROFIL;
        var largeur = this.contentsWidth() - x * 2;
        var dispo = Math.max(1, Math.floor((this.contentsHeight() - y) / INTERLIGNE_PROFIL));

        var lignes = [];
        texte.split('\n').forEach(function (para) {
            var courante = '';
            para.split(' ').forEach(function (mot) {
                var essai = courante ? courante + ' ' + mot : mot;
                if (this.textWidth(essai) > largeur && courante) { lignes.push(courante); courante = mot; }
                else { courante = essai; }
            }, this);
            if (courante) { lignes.push(courante); }
        }, this);

        // S'il en reste malgré tout, on le dit plutôt que de le faire disparaître.
        var coupe = lignes.length > dispo;
        if (coupe) { lignes = lignes.slice(0, dispo); lignes[dispo - 1] += ' …'; }
        lignes.forEach(function (l, i) { this.drawText(l, x, y + i * INTERLIGNE_PROFIL, largeur); }, this);
        this.contents.fontSize = corpsAvant;
    };
})();
