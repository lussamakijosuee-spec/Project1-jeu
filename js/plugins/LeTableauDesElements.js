//=============================================================================
// LeTableauDesElements.js
//=============================================================================
/*:
 * @plugindesc v1.1 ■ Le tableau des éléments, refait : les trois arts et leur
 * triangle, les réactions élémentaires, et qui frappe avec quoi dans l'équipe.
 * @author Projet Trois Sources
 *
 * @param titre
 * @text Titre
 * @default LES ARTS ET LES ÉLÉMENTS
 *
 * @help
 * ============================================================================
 *  JOKO, 2026-11-11 : « j'aimerais que tu retravailles le menu de compétence
 *  hors combats et le tableau des éléments »
 * ============================================================================
 *  L'ancien tableau (VisualMaxEX, « LES SOURCES ET LES ÉLÉMENTS ») listait les
 *  noms des éléments avec un tiret en face, et disait encore « recul PV — la
 *  forme projetée » (une règle éteinte depuis les trois arts). Celui-ci prend
 *  sa place (la commande « Éléments » du menu et Scene_MvxElements y mènent ;
 *  VisualMaxEX n'est pas touché), en trois pages — ← → pour en changer :
 *
 *  ① LES TROIS ARTS. Le triangle (le Corps bat l'Âme, l'Âme bat l'Esprit,
 *     l'Esprit bat le Corps), l'art, le mana et la monnaie de chaque source ;
 *     ce que le triangle vaut VRAIMENT dans le jeu (la médiane des fiches
 *     d'ennemis, par courant) ; et les affinités de l'équipe.
 *
 *  ② LES RÉACTIONS. La grille des huit éléments : la case dit la réaction ;
 *     le curseur s'y promène, et le bas dit ce qu'elle fait (les chiffres sont
 *     ceux des réglages de FusionElements) et qui, dans l'équipe, peut la faire.
 *
 *  ③ L'ÉQUIPE. Pour chaque héros, combien de techniques apprises frappent
 *     avec chaque élément — de quoi savoir qui pose quoi.
 *
 *  EN COMBAT (v1.1) : pendant qu'on choisit (les ordres ou la liste des
 *  techniques), Ctrl ouvre la page des réactions par-dessus le combat ; le
 *  curseur se pose sur l'élément qu'un ennemi porte déjà, et la légende dit
 *  qui porte quoi. Ctrl ou Échap la referme, et on reprend où l'on était.
 *
 *  Tout est LU dans le jeu (System.json, les fiches, les réglages des
 *  plugins) : rien n'est recopié à la main, rien ne peut mentir après un
 *  réglage. Aucune donnée n'est écrite.
 */
var TableauDesElements = window.TableauDesElements || {};
window.TableauDesElements = TableauDesElements;
(function () {
    'use strict';
    var P = PluginManager.parameters('LeTableauDesElements');
    var TITRE = String(P.titre || 'LES ARTS ET LES ÉLÉMENTS');
    var PAGES = ['Les trois arts', 'Les réactions', 'L\'équipe'];
    var FOND = [8, 9, 10, 11, 12, 13, 14, 15];
    var COULEURS = { 8: '#ff6a4a', 9: '#4ab8ff', 10: '#7ee08a', 11: '#c89a5a', 12: '#ffd84a', 13: '#b8ecff', 14: '#fff2a8', 15: '#b07aff' };
    var SOURCES = [
        { art: 'mouvement', source: 'CORPS', nom: 'la Voie', mana: 'mana négatif', monnaie: 'PT', temps: 'maintenant', couleur: '#6aa8ff' },
        { art: 'ecrit', source: 'ÂME', nom: 'la Rune', mana: 'mana spirituel', monnaie: 'PV', temps: 'plus tard', couleur: '#c8a0ff' },
        { art: 'parole', source: 'ESPRIT', nom: 'la Parole', mana: 'mana positif', monnaie: 'PM', temps: 'ce tour-ci', couleur: '#ffd27a' }
    ];
    var SIGNES = { vapeur: '💨', fonte: '🔥', surcharge: '💥', lave: '🌋', givre: '🧊', electrocharge: '⚡', plante: '🌿', supraconduction: '❄',
        metal: '⚙', cristallisation: '💎', crepuscule: '🌗', dispersion: '🌪' };
    var NOMS = { vapeur: 'Vapeur', fonte: 'Fonte', surcharge: 'Surcharge', lave: 'Lave', givre: 'Givre', electrocharge: 'Électrocharge', plante: 'Plante',
        supraconduction: 'Supraconduction', metal: 'Métal', cristallisation: 'Cristallisation', crepuscule: 'Crépuscule', dispersion: 'Dispersion' };

    function nomElement(e) { var n = String($dataSystem.elements[e] || '').trim(); return n ? n.charAt(0) + n.slice(1).toLowerCase() : '—'; }
    function fr(x) { return String(Math.round(x * 100) / 100).replace('.', ','); }

    //=========================================================================
    // Ce qui est lu dans le jeu
    //=========================================================================
    /** La table des réactions, telle que FusionElements la lit dans ses réglages. */
    TableauDesElements.reactions = function () {
        var F = PluginManager.parameters('FusionElements'), out = {};
        var brut = String(F.reactions || '8+9: vapeur, 8+13: fonte, 8+12: surcharge, 8+11: lave, 9+13: givre, 9+12: electrocharge, 9+11: plante, 12+13: supraconduction, 11+12: metal, 11+13: cristallisation, 14+15: crepuscule, 10+8: dispersion, 10+9: dispersion, 10+13: dispersion, 10+12: dispersion');
        brut.split(',').forEach(function (b) {
            var m = b.split(':'); if (m.length !== 2) { return; }
            var e = m[0].split('+').map(function (x) { return Number(x); });
            if (e.length !== 2 || !e[0] || !e[1]) { return; }
            var r = m[1].trim().toLowerCase();
            out[e[0] + '+' + e[1]] = r; out[e[1] + '+' + e[0]] = r;
        });
        return out;
    };
    /** Ce que fait une réaction, avec les chiffres des réglages. */
    TableauDesElements.effet = function (r) {
        var F = PluginManager.parameters('FusionElements');
        function n(k, d) { var v = Number(F[k]); return (F[k] === undefined || F[k] === '' || isNaN(v)) ? d : v; }
        function etat(k, d) { var s = $dataStates[n(k, d)]; return s ? s.name.replace(/^[^A-Za-zÀ-ÿ]+/, '') : '?'; }
        switch (r) {
        case 'vapeur': return 'Le coup frappe ×' + fr(n('vapeur', 1.5)) + '. ' + etat('etatBrulure', 91) + ' et ' + etat('etatAveugle', 5) + '.';
        case 'fonte': return 'Le coup frappe ×' + fr(n('fonte', 1.5)) + '.';
        case 'surcharge': return fr(n('surcharge', 50)) + ' % du coup sur tous les autres ennemis.';
        case 'lave': return etat('etatBrulure', 91) + ' sur la cible.';
        case 'givre': return 'Il perd sa prochaine action (pas un boss).';
        case 'electrocharge': return fr(n('electrocharge', 25)) + ' % du coup, de nouveau, aux ' + fr(n('toursElectro', 2)) + ' fins de tour suivantes.';
        case 'plante': return 'Qui frappe reprend ' + fr(n('plante', 15)) + ' % de ses PV.';
        case 'supraconduction': return 'Sa DÉF est divisée par deux, 2 tours.';
        case 'metal': return etat('etatParalysie', 136) + ' sur la cible.';
        case 'cristallisation': return 'Le prochain coup que reçoit qui frappe est ×' + fr(n('cristal', 0.5)) + '.';
        case 'crepuscule': return etat('etatAveugle', 5) + ' sur la cible ; qui frappe reprend ' + fr(n('crepuscule', 10)) + ' % de ses PV.';
        case 'dispersion': return 'L\'élément posé passe à tous les autres ennemis' + (n('souffle', 25) > 0 ? ' ; celui qui en portait déjà un réagit (' + fr(n('souffle', 25)) + ' % du coup).' : '.');
        }
        return '';
    };
    TableauDesElements.toursAura = function () { var v = Number(PluginManager.parameters('FusionElements').toursAura); return isNaN(v) || !v ? 3 : v; };

    /** Les éléments fondamentaux d'une technique. */
    function elementsDe(s) {
        var out = [];
        if (!s || !s.damage || s.damage.type === 0) { return out; }
        var e = s.damage.elementId;
        if (FOND.indexOf(e) >= 0) { out.push(e); }
        (s.multipleElements || []).forEach(function (x) { if (FOND.indexOf(x) >= 0 && out.indexOf(x) < 0) { out.push(x); } });
        return out;
    }
    /** Par héros : combien de techniques apprises qui blessent, par élément. */
    TableauDesElements.equipe = function () {
        return $gameParty.members().map(function (a) {
            var c = {}; FOND.forEach(function (e) { c[e] = 0; });
            a.skills().forEach(function (s) {
                if (!s || (s.damage.type !== 1 && s.damage.type !== 5)) { return; }
                elementsDe(s).forEach(function (e) { c[e]++; });
            });
            return { acteur: a, compte: c };
        });
    };
    /** Qui, dans l'équipe, a les deux éléments (seul), ou un des deux. */
    TableauDesElements.quiPeut = function (e1, e2) {
        var eq = TableauDesElements.equipe(), seuls = [], a1 = [], a2 = [];
        eq.forEach(function (h) {
            var x = h.compte[e1] > 0, y = h.compte[e2] > 0;
            if (x && y && e1 !== e2) { seuls.push(h.acteur.name()); }
            if (x) { a1.push(h.acteur.name()); }
            if (y) { a2.push(h.acteur.name()); }
        });
        return { seuls: seuls, premier: a1, second: a2 };
    };
    /** Le triangle tel qu'il est dans les fiches : la médiane du taux, par courant de l'ennemi et par art. */
    TableauDesElements.triangle = function () {
        var T = window.LesTroisArts, out = { courants: ['negatif', 'spirituelle', 'positif'], taux: {} };
        var mana = { mouvement: T && T.manaDe ? T.manaDe('mouvement') : 4, ecrit: T && T.manaDe ? T.manaDe('ecrit') : 2, parole: T && T.manaDe ? T.manaDe('parole') : 3 };
        var tas = {};
        $dataEnemies.forEach(function (e) {
            if (!e || !e.name) { return; }
            var c = String((e.meta && e.meta.Mana) || '').trim().toLowerCase();
            if (c === 'positive') { c = 'positif'; } if (c === 'négatif' || c === 'negative') { c = 'negatif'; } if (c === 'spirituel') { c = 'spirituelle'; }
            if (out.courants.indexOf(c) < 0) { return; }
            Object.keys(mana).forEach(function (art) {
                var taux = 1;
                e.traits.forEach(function (t) { if (t.code === 11 && t.dataId === mana[art]) { taux *= t.value; } });
                ((tas[c] = tas[c] || {})[art] = tas[c][art] || []).push(taux);
            });
        });
        out.courants.forEach(function (c) {
            out.taux[c] = {};
            ['mouvement', 'ecrit', 'parole'].forEach(function (art) {
                var l = ((tas[c] || {})[art] || []).slice().sort(function (a, b) { return a - b; });
                out.taux[c][art] = l.length ? l[Math.floor(l.length / 2)] : 1;
                out.taux[c].n = l.length;
            });
        });
        return out;
    };
    /** Les affinités de l'équipe (LesTroisArts). */
    TableauDesElements.affinites = function () {
        var T = window.LesTroisArts;
        return $gameParty.members().map(function (a) { return { acteur: a, arts: T && T.affinites ? T.affinites(a).slice() : [] }; });
    };

    //=========================================================================
    // La fenêtre
    //=========================================================================
    function Window_Tableau() { this.initialize.apply(this, arguments); }
    Window_Tableau.prototype = Object.create(Window_Base.prototype);
    Window_Tableau.prototype.constructor = Window_Tableau;
    Window_Tableau.prototype.initialize = function (enCombat) {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this._combat = !!enCombat;
        this._page = this._combat ? 1 : 0; this._cx = 0; this._cy = 1;
        if (this._combat) { this.backOpacity = 255; }
        this.refresh();
    };
    /** En combat : les ennemis debout qui portent une aura. */
    TableauDesElements.auras = function () {
        if (!window.Fusion || !Fusion.aura || !$gameParty.inBattle()) { return []; }
        return $gameTroop.aliveMembers().map(function (e) { return { nom: e.name(), element: Fusion.aura(e) }; }).filter(function (x) { return x.element; });
    };
    Window_Tableau.prototype.t = function (texte, x, y, w, align, taille, couleur) {
        this.contents.fontSize = taille || 18;
        this.changeTextColor(couleur || this.normalColor());
        this.drawText(texte, x, y, w, align || 'left');
    };
    Window_Tableau.prototype.replier = function (texte, largeur) {
        var mots = String(texte).split(' '), lignes = [], c = '';
        for (var i = 0; i < mots.length; i++) {
            var essai = c ? c + ' ' + mots[i] : mots[i];
            if (this.textWidth(essai) > largeur && c) { lignes.push(c); c = mots[i]; } else { c = essai; }
        }
        if (c) { lignes.push(c); }
        return lignes;
    };
    Window_Tableau.prototype.refresh = function () {
        this.contents.clear();
        var w = this.contentsWidth(), moi = this;
        // en combat, un fond plein : les fenêtres du combat se lisaient au travers
        if (this._combat) { this.contents.fillRect(0, 0, w, this.contentsHeight(), 'rgba(28, 10, 36, 0.96)'); }
        // l'en-tête : le titre, et les pages
        this.t(TITRE, 0, -6, 330, 'left', 17, this.textColor(14));
        var x = 330, lp = Math.floor((w - 330) / PAGES.length);
        if (this._combat) { this.t('Les réactions', 330, -6, w - 330, 'center', 19); }
        else PAGES.forEach(function (p, i) {
            var actif = i === moi._page;
            if (actif) { moi.contents.fillRect(x + i * lp + 6, 24, lp - 12, 2, moi.textColor(14)); }
            moi.t((actif ? '' : '') + p, x + i * lp, -6, lp, 'center', actif ? 19 : 16, actif ? moi.normalColor() : moi.textColor(7));
        });
        this.contents.fillRect(0, 30, w, 1, this.textColor(7));
        if (this._page === 0) { this.pageArts(40); }
        else if (this._page === 1) { this.pageReactions(40); }
        else { this.pageEquipe(40); }
        this.t(this._combat ? '↑ ↓ ← → case    Ctrl ou Échap : retour au combat' : this._page === 1 ? '← → page (aux bords de la grille)    ↑ ↓ ← → case    en combat : Ctrl ouvre cette page' : '← → page    Échap sortir', 0, this.contentsHeight() - 30, w, 'left', 14, this.textColor(7));
        this.resetFontSettings();
    };

    // ── ① les trois arts ────────────────────────────────────────────────────
    Window_Tableau.prototype.fleche = function (x1, y1, x2, y2, couleur) {
        var c = this.contents.context, a = Math.atan2(y2 - y1, x2 - x1);
        c.save(); c.strokeStyle = couleur; c.fillStyle = couleur; c.lineWidth = 3;
        c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
        c.beginPath(); c.moveTo(x2, y2); c.lineTo(x2 - 12 * Math.cos(a - 0.45), y2 - 12 * Math.sin(a - 0.45)); c.lineTo(x2 - 12 * Math.cos(a + 0.45), y2 - 12 * Math.sin(a + 0.45)); c.closePath(); c.fill();
        c.restore(); this.contents._setDirty();
    };
    Window_Tableau.prototype.pageArts = function (y0) {
        var w = this.contentsWidth(), moi = this;
        // le triangle, à gauche
        var cx = 190, cy = y0 + 118, R = 86;
        var pts = [-90, 30, 150].map(function (d) { var a = d * Math.PI / 180; return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }; });
        SOURCES.forEach(function (s, i) {
            var p = pts[i], q = pts[(i + 1) % 3];
            var dx = q.x - p.x, dy = q.y - p.y, d = Math.sqrt(dx * dx + dy * dy);
            moi.fleche(p.x + dx * 34 / d, p.y + dy * 34 / d, q.x - dx * 38 / d, q.y - dy * 38 / d, s.couleur);
        });
        SOURCES.forEach(function (s, i) {
            var p = pts[i];
            moi.contents.drawCircle(p.x, p.y, 30, 'rgba(0,0,0,0.45)');
            moi.contents.drawCircle(p.x, p.y, 27, s.couleur);
            moi.contents.drawCircle(p.x, p.y, 24, 'rgba(20,10,30,0.85)');
            moi.t(s.source, p.x - 40, p.y - 18, 80, 'center', 15, s.couleur);
        });
        this.t('bat', cx - 20, cy - 16, 40, 'center', 14, this.textColor(7));
        this.t('« le corps attaqua l\'âme, l\'âme attaqua', 0, y0 + 228, 380, 'center', 14, this.textColor(7));
        this.t('l\'esprit et l\'esprit attaqua le corps »', 0, y0 + 246, 380, 'center', 14, this.textColor(7));
        // les trois lignes, à droite
        var x = 392, y = y0;
        this.t('la source', x, y, 80, 'left', 14, this.textColor(7));
        this.t('son art', x + 84, y, 90, 'left', 14, this.textColor(7));
        this.t('son mana', x + 178, y, 120, 'left', 14, this.textColor(7));
        this.t('se paie', x + 298, y, 60, 'left', 14, this.textColor(7));
        y += 22;
        SOURCES.forEach(function (s) {
            moi.t(s.source, x, y, 80, 'left', 18, s.couleur);
            moi.t(s.nom, x + 84, y, 90, 'left', 18);
            moi.t(s.mana, x + 178, y, 120, 'left', 16);
            moi.t('en ' + s.monnaie, x + 298, y, 80, 'left', 16);
            moi.t(s.temps, x + 84, y + 20, 200, 'left', 13, moi.textColor(7));
            y += 44;
        });
        // ce que le triangle vaut dans le jeu
        var tr = TableauDesElements.triangle();
        var noms = { negatif: 'du Corps', spirituelle: 'de l\'Âme', positif: 'de l\'Esprit' };
        y += 2;
        this.t('Contre un ennemi…', x, y, 150, 'left', 14, this.textColor(7));
        SOURCES.forEach(function (s, i) { moi.t(s.nom, x + 150 + i * 78, y, 76, 'center', 14, s.couleur); });
        y += 22;
        tr.courants.forEach(function (c) {
            moi.t(noms[c], x, y, 150, 'left', 16);
            SOURCES.forEach(function (s, i) {
                var v = tr.taux[c][s.art];
                moi.t((v > 1 ? '▲ ' : v < 1 ? '▼ ' : '') + '×' + fr(v), x + 150 + i * 78, y, 76, 'center', 16, v > 1 ? '#8dffa8' : v < 1 ? '#ff9a8a' : moi.textColor(7));
            });
            y += 24;
        });
        this.t('(la médiane des fiches d\'ennemis de chaque courant)', x, y, w - x, 'left', 12, this.textColor(7));
        // les affinités de l'équipe
        var yA = y0 + 276;
        this.contents.fillRect(0, yA - 4, w, 1, this.textColor(7));
        var T = window.LesTroisArts, PT = PluginManager.parameters('LesTroisArts');
        var cout = Number(PT.coutHorsAffinite || 1.5), force = Number(PT.forceHorsAffinite || 0.75);
        this.t('Les affinités', 0, yA, 200, 'left', 17, this.textColor(14));
        this.t('hors de son affinité, un art coûte ×' + fr(cout) + ' et rend ×' + fr(force) + ' (pas l\'Attaque, ni les dons, ni les attaques à plusieurs)', 130, yA + 2, w - 130, 'left', 13, this.textColor(7));
        var aff = TableauDesElements.affinites().filter(function (h) { return h.arts.length; });
        var col = Math.floor(w / Math.max(1, Math.min(4, aff.length)));
        aff.slice(0, 4).forEach(function (h, i) {
            var xx = i * col, yy = yA + 28;
            moi.t(h.acteur.name(), xx, yy, col - 8, 'left', 18);
            SOURCES.forEach(function (s, k) {
                var a = h.arts.indexOf(s.art) >= 0;
                moi.t((a ? '● ' : '○ ') + s.nom, xx, yy + 22 + k * 20, col - 8, 'left', 15, a ? s.couleur : moi.textColor(7));
            });
        });
        this.t('●  dans son affinité        ○  hors affinité', 0, yA + 114, w, 'left', 13, this.textColor(7));
    };

    // ── ② les réactions ─────────────────────────────────────────────────────
    Window_Tableau.prototype.pageReactions = function (y0) {
        var w = this.contentsWidth(), moi = this, R = TableauDesElements.reactions();
        var x0 = 96, c = 60, h = 42, y = y0 + 4;
        this.t('la cible porte ↓      on la frappe avec →', 0, y - 8, 96 + 8 * c, 'left', 12, this.textColor(7));
        FOND.forEach(function (e, i) { moi.t(nomElement(e), x0 + i * c, y + 12, c, 'center', 14, COULEURS[e]); });
        y += 36;
        FOND.forEach(function (ligne, j) {
            moi.t(nomElement(ligne), 0, y + j * h + 3, x0 - 8, 'right', 15, COULEURS[ligne]);
            FOND.forEach(function (colonne, i) {
                var r = R[ligne + '+' + colonne], xx = x0 + i * c, yy = y + j * h;
                var ici = moi._cx === i && moi._cy === j;
                moi.contents.fillRect(xx + 2, yy + 2, c - 4, h - 4, ici ? 'rgba(255,255,255,0.28)' : r ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.18)');
                if (ici) { moi.contents.fillRect(xx + 2, yy + h - 4, c - 4, 2, moi.textColor(14)); }
                if (r) { moi.t(SIGNES[r] || '•', xx, yy + 3, c, 'center', 22); }
                else if (ligne === colonne) { moi.t('=', xx, yy + 3, c, 'center', 14, moi.textColor(7)); }
            });
        });
        // à droite : la légende
        var xl = x0 + 8 * c + 18, yl = y0;
        this.t('L\'aura', xl, yl, w - xl, 'left', 16, this.textColor(14));
        this.contents.fontSize = 13;
        var lignes = this.replier('Un coup qui blesse avec un élément le laisse sur la cible, ' + TableauDesElements.toursAura() + ' fins de tour. Un autre élément la fait réagir et l\'efface.', w - xl);
        lignes.forEach(function (l, i) { moi.t(l, xl, yl + 22 + i * 17, w - xl, 'left', 13); });
        var yy = yl + 30 + lignes.length * 17;
        this.t('=  le même élément :', xl, yy, w - xl, 'left', 13, this.textColor(7));
        this.t('l\'aura repart pour ' + TableauDesElements.toursAura() + ' tours', xl, yy + 17, w - xl, 'left', 13, this.textColor(7));
        this.t('case vide : le nouvel', xl, yy + 44, w - xl, 'left', 13, this.textColor(7));
        this.t('élément remplace l\'aura', xl, yy + 61, w - xl, 'left', 13, this.textColor(7));
        // en combat : ce que les ennemis portent en ce moment
        if (this._combat) {
            var au = TableauDesElements.auras(), ya = yy + 92;
            this.t('Sur le terrain', xl, ya, w - xl, 'left', 16, this.textColor(14));
            if (!au.length) { this.t('aucun ennemi ne porte d\'élément', xl, ya + 22, w - xl, 'left', 13, this.textColor(7)); }
            au.slice(0, 6).forEach(function (x, k) {
                moi.t('◈ ' + nomElement(x.element), xl, ya + 22 + k * 19, 80, 'left', 14, COULEURS[x.element]);
                moi.t(x.nom, xl + 78, ya + 22 + k * 19, w - xl - 78, 'left', 13);
            });
        }
        // en bas : la case sous le curseur
        var yb = y + 8 * h + 10;
        this.contents.fillRect(0, yb - 4, w, 1, this.textColor(7));
        var e1 = FOND[this._cy], e2 = FOND[this._cx], r = R[e1 + '+' + e2];
        var lx = 0;
        this.t(nomElement(e1), lx, yb, 100, 'left', 20, COULEURS[e1]); lx += this.textWidth(nomElement(e1)) + 10;
        this.t('+', lx, yb, 20, 'left', 20, this.textColor(7)); lx += 22;
        this.t(nomElement(e2), lx, yb, 100, 'left', 20, COULEURS[e2]); lx += this.textWidth(nomElement(e2)) + 14;
        if (r) {
            this.t('→  ' + (SIGNES[r] || '') + ' ' + (NOMS[r] || r), lx, yb, w - lx, 'left', 20);
            this.t(TableauDesElements.effet(r), 0, yb + 28, w, 'left', 16);
            var q = TableauDesElements.quiPeut(e1, e2), qui;
            if (q.seuls.length) { qui = 'Seul : ' + q.seuls.join(', ') + '.'; }
            else if (q.premier.length && q.second.length) { qui = 'À deux : ' + q.premier.join(', ') + ' (' + nomElement(e1).toLowerCase() + ') et ' + q.second.join(', ') + ' (' + nomElement(e2).toLowerCase() + ').'; }
            else { qui = 'Personne dans l\'équipe n\'a ' + (!q.premier.length && !q.second.length ? 'ces deux éléments' : 'l\'élément ' + nomElement(!q.premier.length ? e1 : e2).toLowerCase()) + ' pour l\'instant.'; }
            this.t(qui, 0, yb + 52, w, 'left', 15, this.textColor(q.premier.length && q.second.length ? 24 : 7));
        } else {
            this.t(e1 === e2 ? '→  le même élément : l\'aura est rafraîchie' : '→  pas de réaction : le nouvel élément remplace l\'aura', lx, yb, w - lx, 'left', 17, this.textColor(7));
        }
    };

    // ── ③ l'équipe ──────────────────────────────────────────────────────────
    Window_Tableau.prototype.pageEquipe = function (y0) {
        var w = this.contentsWidth(), moi = this, eq = TableauDesElements.equipe(), R = TableauDesElements.reactions();
        var x0 = 150, c = Math.floor((w - x0) / 8), y = y0;
        this.t('techniques apprises qui blessent, par élément', 0, y - 4, w, 'left', 13, this.textColor(7));
        y += 20;
        FOND.forEach(function (e, i) { moi.t(nomElement(e), x0 + i * c, y, c, 'center', 15, COULEURS[e]); });
        y += 28;
        eq.forEach(function (h) {
            moi.t(h.acteur.name(), 0, y, x0 - 8, 'left', 19);
            FOND.forEach(function (e, i) {
                var n = h.compte[e];
                if (n > 0) { moi.contents.fillRect(x0 + i * c + 6, y + 4, c - 12, 26, 'rgba(255,255,255,0.10)'); moi.contents.fillRect(x0 + i * c + 6, y + 28, c - 12, 2, COULEURS[e]); }
                moi.t(n > 0 ? String(n) : '·', x0 + i * c, y, c, 'center', 19, n > 0 ? COULEURS[e] : moi.textColor(7));
            });
            // les réactions qu'il fait seul
            var seul = [], vus = {};
            FOND.forEach(function (a) { FOND.forEach(function (b) { var r = R[a + '+' + b]; if (r && a < b && h.compte[a] > 0 && h.compte[b] > 0 && !vus[r]) { vus[r] = 1; seul.push((SIGNES[r] || '') + ' ' + NOMS[r]); } }); });
            var total = 0; FOND.forEach(function (e) { total += h.compte[e]; });
            moi.contents.fontSize = 13;
            var texte = seul.length ? 'seul : ' + seul.join(' · ') : total ? 'seul : aucune réaction — il pose, un autre fait réagir' : 'aucune technique élémentaire';
            moi.replier(texte, w - 20).slice(0, 2).forEach(function (l, k) { moi.t(l, 16, y + 30 + k * 17, w - 16, 'left', 13, seul.length ? moi.textColor(24) : moi.textColor(7)); });
            y += 78;
        });
    };

    Window_Tableau.prototype.deplacer = function (dx, dy) {
        if (this._page !== 1) { return false; }
        var nx = this._cx + dx, ny = this._cy + dy;
        if (ny < 0 || ny > 7) { return true; }
        if (nx < 0 || nx > 7) { return !!this._combat; }
        this._cx = nx; this._cy = ny; SoundManager.playCursor(); this.refresh();
        return true;
    };
    Window_Tableau.prototype.page = function (sens) {
        this._page = (this._page + sens + PAGES.length) % PAGES.length;
        if (this._page === 1) { this._cx = sens > 0 ? 0 : 7; }
        SoundManager.playCursor(); this.refresh();
    };
    TableauDesElements.Window_Tableau = Window_Tableau;

    //=========================================================================
    // La scène — elle prend la place de l'ancien tableau
    //=========================================================================
    function Scene_TableauDesElements() { this.initialize.apply(this, arguments); }
    Scene_TableauDesElements.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_TableauDesElements.prototype.constructor = Scene_TableauDesElements;
    Scene_TableauDesElements.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._tableau = new Window_Tableau();
        this.addWindow(this._tableau);
    };
    Scene_TableauDesElements.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        var t = this._tableau;
        if (Input.isTriggered('cancel') || TouchInput.isCancelled()) { SoundManager.playCancel(); this.popScene(); return; }
        if (Input.isRepeated('right')) { if (!t.deplacer(1, 0)) { t.page(1); } }
        else if (Input.isRepeated('left')) { if (!t.deplacer(-1, 0)) { t.page(-1); } }
        else if (Input.isRepeated('down')) { t.deplacer(0, 1); }
        else if (Input.isRepeated('up')) { t.deplacer(0, -1); }
        else if (Input.isTriggered('pagedown')) { t.page(1); }
        else if (Input.isTriggered('pageup')) { t.page(-1); }
        else if (TouchInput.isTriggered()) { t.page(1); }
    };
    TableauDesElements.Scene = Scene_TableauDesElements;

    //=========================================================================
    // En combat : Ctrl ouvre les réactions par-dessus, pendant qu'on choisit
    //=========================================================================
    // Pas une autre scène (revenir dans Scene_Battle relancerait le début du combat) : une fenêtre posée dessus.
    // Tant qu'elle est ouverte, la fenêtre de saisie d'en dessous est désactivée — jamais deux à la fois — et
    // c'est elle qu'on réactive en fermant.
    TableauDesElements.ouvert = function () { var S = SceneManager._scene; return !!(S && S._tableauCombat && S._tableauCombat.visible); };
    function fenetreDeSaisie(S) {
        var l = [S._skillWindow, S._actorCommandWindow];
        for (var i = 0; i < l.length; i++) { if (l[i] && l[i].active && l[i].isOpen() && l[i].visible) { return l[i]; } }
        return null;
    }
    Scene_Battle.prototype.ouvrirTableau = function () {
        var dessous = fenetreDeSaisie(this);
        if (!dessous || !BattleManager.isInputting()) { return false; }
        if (!this._tableauCombat) { this._tableauCombat = new Window_Tableau(true); this.addChild(this._tableauCombat); }
        var t = this._tableauCombat, au = TableauDesElements.auras();
        if (au.length) {
            t._cy = Math.max(0, FOND.indexOf(au[0].element));
            // sur la première case de sa ligne qui réagit
            var R = TableauDesElements.reactions(), col = -1;
            FOND.forEach(function (e, i) { if (col < 0 && R[au[0].element + '+' + e]) { col = i; } });
            t._cx = col >= 0 ? col : 0;
        }
        t.refresh(); t.show();
        dessous.deactivate(); this._tableauDessous = dessous;
        SoundManager.playOk();
        return true;
    };
    Scene_Battle.prototype.fermerTableau = function () {
        if (!this._tableauCombat || !this._tableauCombat.visible) { return; }
        this._tableauCombat.hide();
        SoundManager.playCancel();
        Input.clear(); TouchInput.clear();          // la touche qui ferme ne doit pas annuler la liste d'en dessous
        if (this._tableauDessous) { this._tableauDessous.activate(); }
        this._tableauDessous = null;
    };
    // MV rouvre la fenêtre des ordres dès qu'aucune fenêtre de saisie n'est active (changeInputWindow) : tant que
    // le tableau est ouvert, c'est lui la fenêtre de saisie.
    var _saisie = Scene_Battle.prototype.isAnyInputWindowActive;
    Scene_Battle.prototype.isAnyInputWindowActive = function () {
        return TableauDesElements.ouvert() || _saisie.call(this);
    };
    var _majCombat = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        if (this._tableauCombat && this._tableauCombat.visible) {
            var t = this._tableauCombat;
            if (Input.isTriggered('control') || Input.isTriggered('cancel') || TouchInput.isCancelled() || TouchInput.isTriggered() || !BattleManager.isInputting()) { this.fermerTableau(); }
            else if (Input.isRepeated('right')) { t.deplacer(1, 0); }
            else if (Input.isRepeated('left')) { t.deplacer(-1, 0); }
            else if (Input.isRepeated('down')) { t.deplacer(0, 1); }
            else if (Input.isRepeated('up')) { t.deplacer(0, -1); }
        } else if (Input.isTriggered('control') && $gameParty.inBattle()) {
            this.ouvrirTableau();
        }
        _majCombat.call(this);
    };
    TableauDesElements.ancienne = window.Scene_MvxElements || null;      // gardée, pour qui la voudrait
    window.Scene_MvxElements = Scene_TableauDesElements;
    if (typeof Scene_MvxElements !== 'undefined') { try { Scene_MvxElements = Scene_TableauDesElements; } catch (e) { /* rien */ } }
})();
