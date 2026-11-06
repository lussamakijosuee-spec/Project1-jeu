//=============================================================================
// ParolesSysteme.js — v2.0  ·  Système de magie « Paroles » (Compendium)
// RPG Maker MV   ·   by JOKO   ·   additif — la lucidité gouverne la magie
//   À charger APRÈS JadeEntitePlunging (window.Ame) et ManaVisualEX (aide).
//=============================================================================
/*:
 * @target MV
 * @plugindesc v2.0 ■ Magie par PAROLES : longueur de parole + santé mentale =
 * réussite / ratage / backlash. Aide en direct, soins inclus, compatible CTB/ATB.
 * @author JOKO
 *
 * @param EnableSwitchId
 * @text Switch d'activation (0 = toujours)
 * @type switch
 * @default 0
 *
 * @param ApplyToMagical
 * @text Toute la magie est une Parole
 * @type boolean
 * @desc Applique aux compétences "magiques" (hitType magique). Sinon, seulement <Parole>.
 * @default true
 *
 * @param IncludeHealing
 * @text Inclure les soins / support
 * @type boolean
 * @desc Les sorts qui rendent des PV/PM (forme « soustraction ») sont aussi des Paroles.
 * @default true
 *
 * @param TreatUltAsOrigine
 * @text Ultimes = Mana Origine (fiables)
 * @type boolean
 * @default true
 *
 * @param UltStypeId
 * @text ID du type "ult"
 * @type number
 * @default 3
 *
 * @param DefaultL
 * @text Longueur de parole par défaut (L)
 * @type number
 * @min 1
 * @default 3
 *
 * @param TalentFormula
 * @text Formule du Talent (concentration de base)
 * @type string
 * @default a.mat
 *
 * @param CombatWindow
 * @text Fenêtre de combat (s) — temps tenable
 * @type number
 * @decimals 1
 * @desc tf du compendium. Facteur min(1, tf / (0.8·L)). Paroles très longues = pénalisées.
 * @default 5.0
 *
 * @param BacklashPct
 * @text Backlash (% PV max × L × manque)
 * @type number
 * @decimals 2
 * @default 6
 *
 * @param SanityCostOnFail
 * @text Coût de lucidité sur échec
 * @type boolean
 * @desc Une parole brisée entame la santé mentale du lanceur (−1 jauge).
 * @default true
 *
 * @param ShowHelpInfo
 * @text Afficher L + fiabilité dans l'aide
 * @type boolean
 * @default true
 *
 * @param ShowLog
 * @text Messages de combat
 * @type boolean
 * @default true
 *
 * @param HerosSansRatage
 * @text Les héros ne ratent pas en silence
 * @type boolean
 * @default true
 * @desc [JOKO 2026-10-20] LaParole : le seul risque d'un héros est celui qu'on voit (une longue qui se brise). Les ennemis gardent ce système.
 *
 * @help
 * ============================================================================
 *  SYSTÈME DE PAROLES v2 — la lucidité gouverne la magie            by JOKO
 * ============================================================================
 *  Traduit le « Compendium des Paroles » en mécanique de combat fidèle :
 *
 *    Concentration dispo   Kd = Talent × (santé mentale / 100)
 *    Concentration requise Kr = 8 · L^1.8                 (L = longueur de parole)
 *    Temps d'incantation   Tinc = 0.8 · L                 (tf = fenêtre de combat)
 *    TENUE de la parole        = min(1, Kd/Kr) × min(1, tf/Tinc)
 *
 *  • La parole TIENT (réussite) : le sort part normalement. La puissance reste
 *    celle de ta compétence — cette couche gère la FIABILITÉ, pas les dégâts.
 *  • Elle SE BRISE (ratage) : aucun effet + BACKLASH (dégâts au lanceur, selon
 *    L et le manque de concentration) + (option) perte de lucidité.
 *
 *  Les sorts COURTS ne ratent pas « pour rien » : tant que la concentration
 *  suffit (Kd ≥ Kr) et que la parole tient dans la fenêtre, elle réussit.
 *  C'est la lucidité basse ET/OU les paroles longues qui font vaciller.
 *
 *  Santé mentale lue sur tes jauges (window.Ame, 1–10 → 10–100 %). Ennemis à
 *  pleine lucidité par défaut.
 *
 *  ──────────────────────────────────────────────────────────────────────────
 *  NOTETAGS (Note d'une compétence)
 *  ──────────────────────────────────────────────────────────────────────────
 *    <Parole>           force la compétence à suivre le système.
 *    <ParoleL: n>       longueur L (simple=3, double=4, ampli=4, fusion=5,
 *                       soin=3, enregistrée=1).
 *    <Parole: origine>  MANA ORIGINE : enregistrée, INFAILLIBLE (pas de ratage).
 *    <NoParole>         exclut la compétence.
 *
 *  Par défaut : toute magie (+ soins) est une Parole ; les ultimes sont des
 *  paroles « origine ». Tout est réglable. API : window.Paroles.tenue(actor, skill).
 * ============================================================================
 */
var Paroles = Paroles || {};

(function () {
    'use strict';

    var P = PluginManager.parameters('ParolesSysteme');
    var ENABLE_SW   = parseInt(P['EnableSwitchId'] || 0, 10);
    var APPLY_MAG   = String(P['ApplyToMagical'] || 'true') === 'true';
    var INC_HEAL    = String(P['IncludeHealing'] || 'true') === 'true';
    var ULT_ORIGINE = String(P['TreatUltAsOrigine'] || 'true') === 'true';
    var ULT_STYPE   = parseInt(P['UltStypeId'] || 3, 10);
    var DEFAULT_L   = parseInt(P['DefaultL'] || 3, 10);
    var TALENT_F    = String(P['TalentFormula'] || 'a.mat');
    var TF          = parseFloat(P['CombatWindow'] || 5) || 5;
    var BACKLASH    = parseFloat(P['BacklashPct'] || 6) / 100;
    var SAN_COST    = String(P['SanityCostOnFail'] || 'true') === 'true';
    var SHOW_HELP   = String(P['ShowHelpInfo'] || 'true') === 'true';
    var SHOW_LOG    = String(P['ShowLog'] || 'true') === 'true';
    var HEROS_OK    = String(P['HerosSansRatage'] || 'true') !== 'false';   // [JOKO 2026-10-20]

    function enabled() {
        if (ENABLE_SW > 0 && (!$gameSwitches || !$gameSwitches.value(ENABLE_SW))) return false;
        return true;
    }
    function log(t) {
        if (!SHOW_LOG) return;
        var w = BattleManager._logWindow;
        if (w) w.push('addText', t);
        if (typeof MecaBoss !== 'undefined' && MecaBoss.bandeauDuJournal) { MecaBoss.bandeauDuJournal(t); }   // muet en vue de côté : aussi en bandeau (JOKO, 2026-10-23)
    }

    //========================================================================
    // LUCIDITÉ & TALENT
    //========================================================================
    function sanity(b) {
        if (!b || !b.isActor || !b.isActor()) return 1; // ennemis : pleine lucidité
        // ── LA SANTÉ MENTALE EST RETIRÉE DU JEU (décision de JOKO) ───────────
        // Sans elle, tout le monde récite à pleine lucidité : une Parole ne
        // rate plus « parce que le lanceur va mal », seulement parce qu'elle
        // est trop longue pour la fenêtre de combat — ça, c'est du mana.
        //
        // ⚠ L'ancien repli était traître : faute de window.Ame il lisait la
        // variable (acteurId + 10), la trouvait à 0, et retombait sur g = 7 —
        // soit 70 % de lucidité. Les Paroles auraient continué de rater pour
        // une raison mentale qui n'existe plus.
        if (!window.Ame || typeof window.Ame.jauge !== 'function') { return 1; }
        var g = 0;
        try { g = window.Ame.jauge(b.actorId()); } catch (e) {}
        if (!g) { return 1; }
        return Math.max(0.15, Math.min(1, g / 10));
    }
    function talentOf(b) {
        try { return Math.max(1, Function('a', 'return (' + TALENT_F + ');')(b)); }
        catch (e) { return Math.max(1, (b && b.mat) || 1); }
    }

    //========================================================================
    // CLASSIFICATION
    //========================================================================
    function isMagicalHeal(item) {
        // formes de soin / support (« soustraction ») : récup PV/PM ou effets de récup
        if (!INC_HEAL) return false;
        if (item.damage && (item.damage.type === 3 || item.damage.type === 4)) return true; // HP/MP recover
        if (item.effects) {
            for (var i = 0; i < item.effects.length; i++) {
                var c = item.effects[i].code;
                if (c === 11 || c === 12) return true; // recover HP / MP
            }
        }
        return false;
    }
    function paroleInfo(item) {
        if (!item || item.itypeId !== undefined) return null;     // objet, pas compétence
        if (item.meta && item.meta.NoParole) return null;
        var tagged = item.meta && item.meta.Parole !== undefined;
        var isParole = tagged || (APPLY_MAG && item.hitType === 2) || isMagicalHeal(item);
        if (!isParole) return null;

        var origine =
            (item.meta && String(item.meta.Parole).toLowerCase().trim() === 'origine') ||
            (ULT_ORIGINE && item.stypeId === ULT_STYPE);

        var L = DEFAULT_L;
        if (item.meta && item.meta.ParoleL) {
            var n = parseInt(item.meta.ParoleL, 10);
            if (!isNaN(n) && n > 0) L = n;
        }
        return { origine: origine, L: L };
    }

    //========================================================================
    // CALCUL DE LA « TENUE » (probabilité que la parole tienne, 0..1)
    //========================================================================
    function tenue(actor, item) {
        var info = paroleInfo(item);
        if (!info) return 1;
        if (info.origine) return 1;
        var L  = info.L;
        var Kd = talentOf(actor) * sanity(actor);
        var Kr = 8 * Math.pow(L, 1.8);
        var Tinc = 0.8 * L;
        var hold = Math.min(1, Kd / Kr) * Math.min(1, TF / Tinc);
        return Math.max(0, Math.min(1, hold));
    }
    // API publique
    Paroles.tenue = tenue;
    Paroles.info  = paroleInfo;

    //========================================================================
    // RÉSOLUTION EN COMBAT (une fois par action)
    //========================================================================
    Game_Action.prototype._resolveParole = function () {
        var info = paroleInfo(this.item());
        if (!info) { this._paroleState = 'na'; return; }
        if (info.origine) { this._paroleState = 'ok'; return; }
        // [JOKO 2026-10-20] LaParole : un héros ne rate pas en silence.
        if (HEROS_OK && this.subject() && this.subject().isActor && this.subject().isActor()) { this._paroleState = 'ok'; return; }

        var subj = this.subject();
        var L = info.L;
        var Kd = talentOf(subj) * sanity(subj);
        var Kr = 8 * Math.pow(L, 1.8);
        var ratio = Kd / Kr;
        var hold = Math.min(1, ratio) * Math.min(1, TF / (0.8 * L));

        if (Math.random() < hold) {
            this._paroleState = 'ok';
            if (L >= 5) log('\\C[6]Parole tenue (L' + L + ') — la concentration porte le sort.\\C[0]');
            return;
        }

        // ── ÉCHEC : la parole se brise ──
        this._paroleState = 'fail';
        var manque = Math.max(0.1, 1 - Math.min(1, ratio));
        var dmg = Math.max(1, Math.floor(subj.mhp * BACKLASH * L * manque));
        subj.gainHp(-dmg);
        subj.startDamagePopup();
        if ($gameScreen) { $gameScreen.startFlash([180, 60, 200, 160], 24); $gameScreen.startShake(4, 6, 16); }
        AudioManager.playSe({ name: 'Buzzer2', volume: 80, pitch: 55, pan: 0 });
        log('\\C[18]' + subj.name() + ' perd le fil de sa parole (L' + L + ') — BACKLASH ! (-' + dmg + ' PV)\\C[0]');

        if (SAN_COST && subj.isActor && subj.isActor() && window.Ame && typeof window.Ame.mauvais === 'function') {
            try { window.Ame.mauvais(subj.actorId(), 1); } catch (e) {}
        }
        if (!subj.isAlive() && subj.performCollapse) subj.performCollapse();
    };

    var _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        if (enabled() && this.isSkill && this.isSkill() && $gameParty && $gameParty.inBattle()) {
            if (this._paroleState === undefined) this._resolveParole();
            if (this._paroleState === 'fail') {
                var r = target ? target.result() : null;
                if (r) { r.clear(); r.used = true; r.missed = true; }
                return;
            }
        }
        _Game_Action_apply.call(this, target);
    };

    //========================================================================
    // AIDE ENRICHIE — L + fiabilité en direct (greffée APRÈS ManaVisualEX)
    //========================================================================
    if (SHOW_HELP && typeof Window_SkillList !== 'undefined') {
        var _updateHelp = Window_SkillList.prototype.updateHelp;
        Window_SkillList.prototype.updateHelp = function () {
            if (_updateHelp) _updateHelp.call(this);              // élément + description (ManaVisualEX)
            var s = this.item();
            if (!s || !this._helpWindow) return;
            if (HEROS_OK) return;                                  // [JOKO 2026-10-20] LaParole écrit sa propre ligne
            var info = paroleInfo(s);
            if (!info) return;

            var line;
            if (info.origine) {
                line = '\\C[6]⟡ Mana Origine — parole enregistrée, infaillible.\\C[0]';
            } else {
                var actor = this._actor || (SceneManager._scene && SceneManager._scene._actor);
                var h = actor ? tenue(actor, s) : 1;
                var pct = Math.round(h * 100);
                var label = h >= 0.9 ? '\\C[3]fiable' : h >= 0.65 ? '\\C[6]tenable' : '\\C[18]risquée';
                line = '\\C[6]⟡ Parole L' + info.L + ' — ' + label + ' (' + pct + '%)\\C[0]';
            }
            var cur = this._helpWindow._text || '';
            this._helpWindow.setText(cur + (cur ? '\n' : '') + line);
        };
    }

})();
