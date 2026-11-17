//=============================================================================
// MarqueVivante.js — v2.0  ·  La Marque vivante (l'ADN de l'âme), DESSINÉE
// RPG Maker MV   ·   by JOKO / Claude   ·   d'après le Codex des Trois Sources
//  v2.0 : chaque marque est un SIGIL animé qui fleurit / se fend / se boursoufle
//         / porte des épines, selon les trois jauges. API v1 préservée.
//=============================================================================
/*:
 * @plugindesc v2.0 ■ « Lire une marque, c'est lire où en est une âme » : un
 * SIGIL vivant par héros, qui fleurit (esprit), se fend (Dément), se boursoufle
 * (Errant) ou porte des épines (Bête). Lecture seule, additif.
 * @author JOKO / Claude
 *
 * @param menuCommand
 * @text Entrée Menu (vide = aucune)
 * @type string
 * @default
 * @desc Vide par défaut (le menu est déjà chargé) : ouvrir par la commande MARQUE.
 *
 * @param animer
 * @text Marque animée (vivante)
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA MARQUE VIVANTE                                            by JOKO / Claude
 * ═══════════════════════════════════════════════════════════════════════════
 *  « La marque évolue avec l'âme : elle s'étend chez ceux qui s'élargissent,
 *   se rétracte chez ceux dont l'âme s'éteint. »
 *
 *  ▶ LE SIGIL (v2.0) — dessiné en direct pour chaque héros, il RÉAGIT :
 *      • PÉTALES doux        esprit stable — l'âme fleurit.
 *      • FÊLURES / tremblé   le Dément monte (santé mentale basse).
 *      • ANNEAU BOURSOUFLÉ   l'Errant monte (Errance) — et il PÂLIT (il part).
 *      • ÉPINES sombres      la Bête monte (Corruption) — le sang affleure.
 *      • CŒUR creux          l'âme s'éteint (jauge mentale au plus bas).
 *
 *  ▶ ÉTAT DE LA MARQUE — dérivé des jauges partagées (inchangé depuis v1) :
 *      CREUSE · GONFLÉE · FÊLÉE · AFFAMÉE · PLEINE  (même priorité).
 *  ▶ ÉTENDUE — % lu sur les Rangs (window.Rangs) si présent, sinon le niveau.
 *
 *  Aucun effet de jeu : c'est un miroir. Sûr même si un système manque.
 *
 *  Écran :  commande de plugin  MARQUE     (ou l'entrée de menu si définie)
 *  Script :  Marque.etat(actorId) → 'pleine'|'felee'|'affamee'|'gonflee'|'creuse'
 *            Marque.etendue(actorId) · Marque.info(actorId)   (API v1 préservée)
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('MarqueVivante');
    var MENU = String(P['menuCommand'] || '');
    var ANIM = String(P['animer'] || 'true') === 'true';

    var ETATS = {
        creuse:  { nom: 'CREUSE',  col: '#7E7688', desc: 'éteinte — âme vidée ; un corps sans feu' },
        gonflee: { nom: 'GONFLÉE', col: '#B79CF5', desc: 'difforme — nourrie d\'autres âmes ; voie de l\'Errant' },
        felee:   { nom: 'FÊLÉE',   col: '#9CC0F5', desc: 'brisée, cicatrices — trauma ; matérialise mal' },
        affamee: { nom: 'AFFAMÉE', col: '#F0928E', desc: 'rétractée — âme qui s\'épuise ; danger' },
        pleine:  { nom: 'PLEINE',  col: '#5CC98A', desc: 'nette, ample — âme saine, en croissance' }
    };

    function jCorps(id)  { try { return window.Corruption ? window.Corruption.niveau(id) : 0; } catch (e) { return 0; } }
    function jAme(id)    { try { return window.Errance ? window.Errance.niveau(id) : 0; } catch (e) { return 0; } }
    function jauge(id)   { try { return window.Ame ? (window.Ame.jauge(id) || 7) : 7; } catch (e) { return 7; } }
    function phaseEsprit(id) { try { return window.Ame ? (window.Ame.phase(id) || 5) : 5; } catch (e) { return 5; } }

    // ── API v1 PRÉSERVÉE ──
    var Marque = {
        etat: function (id) {
            if (jCorps(id) >= 100 || jAme(id) >= 100) return 'creuse';
            if (jAme(id) >= 40) return 'gonflee';
            if (phaseEsprit(id) <= 2) return 'felee';
            if (jCorps(id) >= 70) return 'affamee';
            return 'pleine';
        },
        etendue: function (id) {
            try { if (window.Rangs) { var d = window.Rangs.details(id); if (d) return Math.min(100, d.score); } } catch (e) {}
            var a = $gameActors && $gameActors.actor(id);
            return a ? Math.min(100, Math.round((a.level / 99) * 100)) : 0;
        },
        info: function (id) { return ETATS[this.etat(id)]; }
    };
    window.Marque = Marque;

    //--- couleurs/noms des trois jauges (LoreCanon si présent) ------------------
    function colCorr(v) { try { if (window.LoreCanon) return LoreCanon.corruption(v).couleur; } catch (e) {} return v >= 70 ? '#c0392b' : v >= 40 ? '#e67e22' : '#2ecc71'; }
    function colErr(v)  { try { if (window.LoreCanon) return LoreCanon.errance(v).couleur; } catch (e) {} return v >= 70 ? '#9b6fd8' : v >= 40 ? '#5dcaa5' : '#7fbf7f'; }
    function colMent(p) { try { if (window.LoreCanon) return LoreCanon.mental(p).couleur; } catch (e) {} return ['#7a1a1a', '#b0562a', '#c7a24a', '#5fa8d6', '#5fd6c0'][Math.max(1, Math.min(5, p)) - 1]; }

    function hex2rgb(h) { h = String(h).replace('#', ''); if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
    function rgba(h, a) { var c = hex2rgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

    //=========================================================================
    // Le dessin d'une marque vivante
    //=========================================================================
    function dessinerMarque(ctx, cx, cy, R, id, t) {
        var c = jCorps(id) / 100, e = jAme(id) / 100;
        var ph = phaseEsprit(id), mHealth = (jauge(id) - 1) / 9, mBad = 1 - mHealth;
        var colC = colCorr(jCorps(id)), colM = colMent(ph), colE = colErr(jAme(id));
        var alpha = 1 - 0.5 * e;     // l'Errant pâlit tout le sigil (il quitte le monde)

        var dom = Math.max(c, e, mBad);
        var haloCol = dom <= 0.001 ? colM : (c === dom ? colC : (e === dom ? colE : colM));

        ctx.save();
        ctx.globalAlpha = alpha;

        // halo
        var g = ctx.createRadialGradient(cx, cy, 2, cx, cy, R * 1.7);
        g.addColorStop(0, rgba(haloCol, 0.5)); g.addColorStop(1, rgba(haloCol, 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, R * 1.7, 0, Math.PI * 2); ctx.fill();

        // pétales de sérénité (esprit stable → l'âme fleurit)
        if (mHealth > 0.55) {
            var np = 6, pl = (mHealth - 0.55) / 0.45;
            ctx.strokeStyle = rgba(colM, 0.35 + 0.4 * pl); ctx.lineWidth = 2;
            for (var p = 0; p < np; p++) {
                var pa = (p / np) * Math.PI * 2 + t * 0.01;
                var pr = R * (1.15 + 0.25 * pl + 0.05 * Math.sin(t * 0.05 + p));
                ctx.beginPath(); ctx.moveTo(cx, cy);
                ctx.quadraticCurveTo(cx + Math.cos(pa - 0.2) * pr * 0.7, cy + Math.sin(pa - 0.2) * pr * 0.7, cx + Math.cos(pa) * pr, cy + Math.sin(pa) * pr);
                ctx.quadraticCurveTo(cx + Math.cos(pa + 0.2) * pr * 0.7, cy + Math.sin(pa + 0.2) * pr * 0.7, cx, cy);
                ctx.stroke();
            }
        }

        // épines du sang de bête (Corruption)
        if (c > 0.15) {
            var ne = Math.round(4 + c * 12);
            ctx.strokeStyle = rgba(colC, 0.5 + 0.5 * c); ctx.lineWidth = 2 + c * 3;
            for (var s = 0; s < ne; s++) {
                var sa = (s / ne) * Math.PI * 2 + t * 0.008;
                var len = R * (1 + c * (0.5 + 0.3 * Math.abs(Math.sin(t * 0.06 + s))));
                ctx.beginPath();
                ctx.moveTo(cx + Math.cos(sa) * R * 0.9, cy + Math.sin(sa) * R * 0.9);
                ctx.lineTo(cx + Math.cos(sa) * len, cy + Math.sin(sa) * len);
                ctx.stroke();
            }
        }

        // l'anneau : ondule (Errant), se fend + tremble (Dément), se rétracte
        var rr = R * (jauge(id) <= 3 ? 0.9 : 1);
        ctx.strokeStyle = rgba(colM, 0.85); ctx.lineWidth = 3;
        var n = 64, jitter = mBad * 4, wob = e, pen = false;
        ctx.beginPath();
        for (var i = 0; i <= n; i++) {
            var a = (i / n) * Math.PI * 2;
            if (mBad > 0.25 && (Math.sin(i * 1.7 + 3) * 0.5 + 0.5) < mBad * 0.5) { pen = false; continue; }
            var bo = 1 + wob * 0.22 * Math.sin(a * 3 + t * 0.05) + (Math.random() - 0.5) * 0.02 * jitter;
            var px = cx + Math.cos(a) * rr * bo + (Math.random() - 0.5) * jitter;
            var py = cy + Math.sin(a) * rr * bo + (Math.random() - 0.5) * jitter;
            if (!pen) { ctx.moveTo(px, py); pen = true; } else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // le cœur : pulse ; creux si l'âme s'éteint
        var pulse = 0.85 + 0.15 * Math.sin(t * 0.08);
        var coeurR = R * 0.26 * pulse * (jauge(id) <= 2 ? 0.6 : 1);
        if (jauge(id) <= 2 && jCorps(id) < 40 && jAme(id) < 40) {
            ctx.strokeStyle = rgba('#6a6a78', 0.9); ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(cx, cy, coeurR, 0, Math.PI * 2); ctx.stroke();
        } else {
            var cg = ctx.createRadialGradient(cx, cy, 0.5, cx, cy, coeurR);
            cg.addColorStop(0, rgba(haloCol, 1)); cg.addColorStop(1, rgba(haloCol, 0.2));
            ctx.fillStyle = cg;
            ctx.beginPath(); ctx.arc(cx, cy, coeurR, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
    }

    //--- Écran de lecture (sigils animés) ---
    function Window_Marque() { this.initialize.apply(this, arguments); }
    Window_Marque.prototype = Object.create(Window_Base.prototype);
    Window_Marque.prototype.constructor = Window_Marque;
    Window_Marque.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this._t = 0; this.refresh();
    };
    Window_Marque.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        if (!ANIM) return;
        this._t++;
        if (this._t % 4 === 0) this.refresh();
    };
    Window_Marque.prototype.refresh = function () {
        this.contents.clear();
        var W = this.contentsWidth();
        this.contents.fontSize = 21; this.changeTextColor('#EBC974');
        this.drawText('LA MARQUE VIVANTE', 0, 2, W, 'center');
        this.contents.fontSize = 13; this.changeTextColor('#7E7688');
        this.drawText('« Lire une marque, c\'est lire où en est une âme. »', 0, 30, W, 'center');

        var membres = $gameParty.members();
        var cols = 2, top = 60;
        var cellW = W / cols, cellH = (this.contentsHeight() - top) / 2;
        for (var i = 0; i < Math.min(4, membres.length); i++) {
            var a = membres[i], id = a.actorId();
            var cx = (i % cols) * cellW + cellW / 2;
            var cy = top + Math.floor(i / cols) * cellH + cellH * 0.40;
            var R = Math.min(cellW, cellH) * 0.22;
            try { dessinerMarque(this.contents.context, cx, cy, R, id, this._t); } catch (e) {}
            if (this.contents._setDirty) this.contents._setDirty();

            var inf = Marque.info(id), ext = Marque.etendue(id);
            var tx = (i % cols) * cellW + 12, tw = cellW - 24;
            var ty = top + Math.floor(i / cols) * cellH + cellH * 0.70;
            this.contents.fontSize = 19; this.changeTextColor('#ECE6D8');
            this.drawText(a.name(), tx, ty, tw, 'center');
            this.contents.fontSize = 16; this.changeTextColor(inf.col);
            this.drawText('Marque ' + inf.nom, tx, ty + 26, tw, 'center');
            // trois jauges en une ligne compacte, chacune à sa couleur
            this.contents.fontSize = 13;
            var lw = tw / 3, ly = ty + 52;
            this.changeTextColor(colCorr(jCorps(id))); this.drawText('B ' + jCorps(id), tx, ly, lw, 'center');
            this.changeTextColor(colErr(jAme(id)));    this.drawText('E ' + jAme(id), tx + lw, ly, lw, 'center');
            this.changeTextColor(colMent(phaseEsprit(id))); this.drawText('Esp ' + phaseEsprit(id) + '/5', tx + lw * 2, ly, lw, 'center');
            // étendue
            var by = ty + 74, bw = tw;
            if (window.LoreCanon) { LoreCanon.bar(this.contents, tx, by, bw, 8, ext / 100, inf.col); }
            else { this.contents.fillRect(tx, by, bw, 8, 'rgba(0,0,0,0.5)'); this.contents.fillRect(tx + 1, by + 1, Math.floor((bw - 2) * ext / 100), 6, inf.col); }
        }
        this.resetFontSettings();
    };

    function Scene_Marque() { this.initialize.apply(this, arguments); }
    window.Scene_Marque = Scene_Marque;
    Scene_Marque.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Marque.prototype.constructor = Scene_Marque;
    Scene_Marque.prototype.create = function () { Scene_MenuBase.prototype.create.call(this); this._w = new Window_Marque(); this.addWindow(this._w); };
    Scene_Marque.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isCancelled()) { SoundManager.playCancel(); this.popScene(); }
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() === 'MARQUE') SceneManager.push(Scene_Marque);
    };
    if (MENU.length > 0) {
        var _add = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () { _add.call(this); this.addCommand(MENU, 'marqueVivante', true); };
        var _cw = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () { _cw.call(this); this._commandWindow.setHandler('marqueVivante', function () { SceneManager.push(Scene_Marque); }); };
    }
})();
