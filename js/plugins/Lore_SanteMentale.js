//=============================================================================
// Lore_SanteMentale.js — v1.0 · FUSION des effets de Santé Mentale (SAN)
//   Regroupe (comportement identique) : Lore_SANReposMarche, Lore_SANPanique,
//   Lore_SANMurmures, Lore_SANTeinte, Lore_SoinsSAN.
//=============================================================================
/*:
 * @plugindesc [Lore] Santé Mentale fondue : repos en SafeZone, panique (fenêtre qui tremble), murmures, vignette immersive, soins réduits si SAN basse.
 * @author JOKO
 *
 * @param Pas
 * @text Pas pour +1 SAN en SafeZone
 * @type number
 * @default 20
 *
 * @help
 *  Un seul plugin pour les effets liés à la Santé Mentale (window.Ame, phases 1-5) :
 *   • Repos    : carte notée <SafeZone> → +1 SAN au groupe tous les N pas.
 *   • Panique  : acteur actif en phase 1 → sa fenêtre de commandes tremble + murmure.
 *   • Murmures : SAN de groupe basse → murmures flottants sur la carte.
 *   • Vignette : le monde s'assombrit selon la pire SAN du groupe (DOM, pas startTint).
 *   • Soins    : les soins d'un héros faiblissent si sa SAN est basse (ph5=100% … ph1≈55%).
 *  Remplace les 5 plugins Lore_SAN… + Lore_SoinsSAN (fusion 2026-07-17).
 */
(function () {
    'use strict';
    var STEP = Number(PluginManager.parameters('Lore_SanteMentale')['Pas'] || 20);

    function worstPhase() {
        if (typeof window.Ame === 'undefined' || !$gameParty) return 5;
        var m = 5; $gameParty.members().forEach(function (a) { var p = window.Ame.phase(a.actorId()); if (p) m = Math.min(m, p); });
        return m;
    }

    // ── Repos : +1 SAN tous les N pas en <SafeZone> ──
    function safe() { try { return $dataMap && $dataMap.note && /<SafeZone>/i.test($dataMap.note); } catch (e) { return false; } }
    var _inc = Game_Party.prototype.increaseSteps;
    Game_Party.prototype.increaseSteps = function () {
        _inc.call(this);
        if (safe() && typeof window.Ame !== 'undefined') {
            this._loreSafe = (this._loreSafe || 0) + 1;
            if (this._loreSafe >= STEP) { this._loreSafe = 0; this.members().forEach(function (a) { window.Ame.bon(a.actorId(), 1); }); }
        }
    };

    // ── Panique : fenêtre de commandes qui tremble (phase 1) ──
    if (typeof Window_ActorCommand !== 'undefined') {
        var _setup = Window_ActorCommand.prototype.setup;
        Window_ActorCommand.prototype.setup = function (actor) {
            _setup.call(this, actor);
            this._lorePanic = (actor && typeof window.Ame !== 'undefined' && window.Ame.phase(actor.actorId()) === 1);
            if (this._lorePanic) { var w = BattleManager._logWindow; if (w) w.push('addText', '\\C[8]' + actor.name() + ' tremble… l’esprit au bord de la rupture.\\C[0]'); }
        };
        var _uAC = Window_ActorCommand.prototype.update;
        Window_ActorCommand.prototype.update = function () {
            _uAC.call(this);
            if (this._lorePanic && this.active) { this._loreJ = (this._loreJ || 0) + 1; this.x += Math.round(Math.sin(this._loreJ * 0.6) * 2); }
        };
    }

    // ── Murmures flottants + Vignette immersive (carte) ──
    var LINES = ['…tu ne sortiras pas…', '…reste avec nous…', '…ce monde est faux…', '…ton âme est si belle…', '…encore une partie…', '…personne ne revient…'];
    function whisper(txt) {
        try {
            var d = document.createElement('div');
            d.style.cssText = 'position:fixed;left:' + (10 + Math.random() * 60) + '%;top:' + (20 + Math.random() * 50) + '%;color:rgba(200,180,220,.0);font:italic 20px Georgia,serif;pointer-events:none;z-index:45;text-shadow:0 0 8px #000;transition:opacity 1.2s;';
            d.textContent = txt; document.body.appendChild(d); requestAnimationFrame(function () { d.style.color = 'rgba(200,180,220,.85)'; });
            setTimeout(function () { d.style.color = 'rgba(200,180,220,0)'; }, 1800); setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 3200);
        } catch (e) {}
    }
    var vig = null;
    function ensureVig() {
        if (vig) return vig; vig = document.createElement('div');
        vig.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:40;opacity:0;transition:opacity .8s, box-shadow .8s;box-shadow:inset 0 0 0 rgba(0,0,0,0);';
        document.body.appendChild(vig); return vig;
    }
    var _uMap = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _uMap.call(this);
        var p = worstPhase();
        // vignette (au changement de phase)
        try {
            if (p !== this._loreSanP) {
                this._loreSanP = p; var e = ensureVig(); var i = (5 - p) / 4;
                e.style.opacity = String(0.05 + i * 0.5);
                e.style.boxShadow = 'inset 0 0 ' + Math.floor(60 + i * 180) + 'px rgba(' + Math.floor(40 + i * 120) + ',0,' + Math.floor(30) + ',' + (0.4 + i * 0.4) + ')';
            }
        } catch (e) {}
        // murmures (si SAN basse)
        if (p < 4) {
            this._loreWT = (this._loreWT || 0) + 1;
            var period = Math.max(180, 900 - (4 - p) * 180);
            if (this._loreWT >= period) { this._loreWT = 0; if (Math.random() < 0.7) whisper(LINES[Math.randomInt(LINES.length)]); }
        }
    };
    var _term = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function () { _term.call(this); if (vig) vig.style.opacity = '0'; };

    // ── Soins réduits si SAN basse ──
    function sanFactor(b) {
        if (!b || !b.isActor || !b.isActor() || typeof window.Ame === 'undefined') return 1;
        var ph = window.Ame.phase(b.actorId()); if (!ph) return 1;
        return 0.55 + (ph - 1) * 0.1125; // ph1=0.55 … ph5=1.0
    }
    var _rec = Game_Action.prototype.itemEffectRecoverHp;
    Game_Action.prototype.itemEffectRecoverHp = function (target, effect) {
        var f = sanFactor(this.subject());
        if (f < 1) { var e2 = { code: effect.code, dataId: effect.dataId, value1: effect.value1 * f, value2: effect.value2 * f }; return _rec.call(this, target, e2); }
        _rec.call(this, target, effect);
    };
})();
