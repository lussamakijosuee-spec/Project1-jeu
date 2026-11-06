//=============================================================================
// RoyaumeImperial.js — v1.0  ·  Le Royaume Impérial des Ténèbres (Domaine)
// RPG Maker MV   ·   by JOKO   ·   d'après le Codex des Trois Sources
//   À charger APRÈS InvocationAmes, Errance et JadeEntitePlunging.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le Domaine de ludwing : toutes les âmes reviennent, toutes
 * les invocations sont libres, stats décuplées — et l'arsenal des Ténèbres.
 * @author JOKO
 *
 * @param etatDomaine
 * @text État — le Domaine
 * @type state
 * @default 198
 *
 * @param etatContre
 * @text État — Contre Totale
 * @type state
 * @default 199
 *
 * @param etatTrauma
 * @text État — Traumatisé (déstabilisé)
 * @type state
 * @default 200
 *
 * @param soulVar
 * @text Variable du stock d'âmes
 * @type variable
 * @default 15
 *
 * @param surgeDomaine
 * @text Âmes qui reviennent (entrée du Domaine)
 * @type number
 * @default 30
 * @desc En déployant le Domaine, toutes les âmes reviennent : le stock (var 15) grimpe d'un coup.
 *
 * @param aspirationParAme
 * @text Aspiration — régen par âme (toute l'aventure)
 * @type number
 * @default 6
 * @desc PV/PM rendus par âme aspirée (mise à l'échelle sur le TOTAL d'âmes récoltées dans la partie).
 *
 * @param === ROYAUME IMPÉRIAL (v2) ===
 * @default
 *
 * @param royaumeEtat
 * @text État — le Royaume (marqueur)
 * @type state
 * @default 231
 * @desc Un état SANS effet : il sert à voir qui tient le Royaume. Tout le
 * pouvoir du domaine est ici, dans le greffon.
 *
 * @param royaumeSecondes
 * @text Durée du Royaume (secondes)
 * @type number
 * @min 5
 * @default 120
 * @desc Du TEMPS, pas des tours — comme le JACKPOT. 120 = deux minutes.
 *
 * @param royaumeAmes
 * @text Âmes déplacées par résurrection
 * @type number
 * @min 0
 * @default 1
 * @desc Chaque mort ramené coûte ce nombre d'âmes (variable du stock d'âmes).
 * S'il n'y en a plus assez, la mort est une vraie mort.
 *
 * @param royaumePV
 * @text PV au retour (%)
 * @type number
 * @min 1
 * @max 100
 * @default 30
 * @desc 30 = une seconde chance, pas un soin complet. À 100, mourir devenait
 * PLUS rentable que se soigner : chaque âme valait une résurrection pleine.
 *
 * @param royaumePMRequis
 * @text PM nécessaires pour lancer (% du max)
 * @type number
 * @min 1
 * @max 100
 * @default 100
 * @desc Le Royaume prend TOUS les PM. Pour pouvoir le relancer, il faut les
 * avoir récupérés jusqu'à ce seuil. 100 = PM pleins.
 *
 * @param royaumeFatigue
 * @text État — fatigue à la fermeture
 * @type state
 * @default 190
 * @desc Posé sur celui qui tenait le Royaume quand les deux minutes tombent.
 *
 * @param royaumeCompteur
 * @text Afficher le compte à rebours ?
 * @type boolean
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE ROYAUME IMPÉRIAL DES TÉNÈBRES                                    by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'expansion de domaine de ludwing (le Symbole). Le skill 810 le déploie :
 *
 *  ▶ TOUTES LES ÂMES REVIENNENT : le stock d'âmes (var 15) déborde
 *    (surgeDomaine) — ce qui, fidèle au lore, fait aussi monter l'Errance.
 *  ▶ TOUTES LES INVOCATIONS SONT LIBRES : tant que le Domaine tient, les
 *    compétences <Invocation: n> ne coûtent plus d'âmes et ne sont jamais grisées.
 *  ▶ STATS DÉCUPLÉES : l'état « Domaine » (198) — MAT ×1.6, MDF ×1.4, ATK ×1.3.
 *
 *  L'ARSENAL (skills, tous utilisables dans le Domaine) :
 *   • Lotus des Ténèbres (66) — attaque unique dévastatrice. (déjà en base)
 *   • Pluie de Lance du Styx (811) — pluie d'ombre sur TOUS les ennemis.
 *   • Annihilation des Ténèbres (68) — zone : détruit le corps ET la magie
 *       (<SceauMagie> : PM de la cible réduits à 0 + MAT brisé).
 *   • Contre Totale (812) — <ContreTotale> : tout ce qui te frappe ce tour est
 *       renvoyé à l'envoyeur.
 *   • Aspiration des Âmes Damnées (70) — <AspirationDamnees> : tu aspires les
 *       âmes de tous ceux que tu as tués dans l'aventure ; régénère PV + PM +
 *       SANTÉ MENTALE proportionnellement au TOTAL d'âmes récoltées — mais
 *       revivre les traumas te DÉSTABILISE (état « Traumatisé », 200).
 *
 *  Compteur d'âmes de toute la partie : window.RoyaumeTenebres.total().
 *  Commandes : DOMAINE ouvrir <id>  ·  DOMAINE fermer <id>.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  v2 — LE ROYAUME IMPÉRIAL (compétence 71)                            JOKO :
 * ═══════════════════════════════════════════════════════════════════════════
 *  « Royaume Impérial est un domaine qui s'active pendant un certain temps,
 *    deux minutes, où à chaque fois que quelqu'un meurt, il revient à la vie.
 *    […] Il n'y a pas d'autre effet. […] Une âme est déplacée pour ramener
 *    la personne à la vie. […] C'est une compétence qui utilise littéralement
 *    tous ses MP. Et un effet fatigue. »
 *
 *  ▶ DU TEMPS, PAS DES TOURS. Deux minutes de jeu, comptées à l'image près
 *    comme le JACKPOT. Un compteur s'affiche sous celui du Jackpot.
 *  ▶ TOUTE MORT EST RENDUE. Un héros qui tombe se relève aussitôt — et le
 *    stock d'âmes (var 15) paie : `royaumeAmes` âme(s) par retour. Plus
 *    d'âmes, plus de retour : la mort reprend ses droits.
 *  ▶ RIEN D'AUTRE. L'état 231 est un marqueur nu : aucun trait, aucun code.
 *  ▶ TOUS LES PM. La compétence coûte ce qu'il reste de PM, et ne se lance
 *    qu'une fois les PM revenus au seuil (100 % par défaut).
 *  ▶ LA FATIGUE. Quand les deux minutes tombent, l'état `royaumeFatigue`
 *    (190 « Épuisement de l'Âme ») se pose sur celui qui tenait le domaine.
 *
 *  La compétence porte le tag <DomaineRoyal>. Le ☠ Royaume Impérial des
 *  Ténèbres (810, <RoyaumeImperial>) n'est pas touché : il garde tout ce qui
 *  est écrit plus haut.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('RoyaumeImperial');
    var DOMAINE = parseInt(P['etatDomaine'] || 198);
    var CONTRE = parseInt(P['etatContre'] || 199);
    var TRAUMA = parseInt(P['etatTrauma'] || 200);
    var SOUL_VAR = parseInt(P['soulVar'] || 15);
    var SURGE = parseInt(P['surgeDomaine'] || 30);
    var ASP = parseInt(P['aspirationParAme'] || 6);

    function log(t) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', t); w.push('wait'); }
        else if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(t);
        if (typeof MecaBoss !== 'undefined' && MecaBoss.bandeauDuJournal) { MecaBoss.bandeauDuJournal(t); }   // muet en vue de côté : aussi en bandeau (JOKO, 2026-10-23)
    }

    //=========================================================================
    // Compteur d'âmes de TOUTE l'aventure (pour l'Aspiration)
    //=========================================================================
    var RoyaumeTenebres = {
        total: function () { return ($gameSystem && $gameSystem._amesTotal) || 0; },
        domaineActif: function (id) {
            var a = $gameActors && $gameActors.actor(id);
            return !!(a && a.isStateAffected(DOMAINE));
        }
    };
    window.RoyaumeTenebres = RoyaumeTenebres;

    var _setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function (variableId, value) {
        var before = (variableId === SOUL_VAR) ? this.value(variableId) : 0;
        _setValue.call(this, variableId, value);
        if (variableId === SOUL_VAR) {
            var delta = this.value(variableId) - before;
            if (delta > 0 && $gameSystem) $gameSystem._amesTotal = (($gameSystem._amesTotal) || 0) + delta;
        }
    };

    //=========================================================================
    // INVOCATIONS LIBRES dans le Domaine (bypass du coût en âmes)
    //=========================================================================
    function estInvocation(skill) { return !!(skill && skill.meta && skill.meta.Invocation); }
    function enDomaine(b) { return b && b.isActor && b.isActor() && b.isStateAffected(DOMAINE); }

    var _can = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
        if (enDomaine(this) && estInvocation(skill)) {
            return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill) &&
                (!this.skillHpCost || this._hp > this.skillHpCost(skill));   // 2026-10-25 : ses techniques de l'âme se paient en PV
        }
        return _can.call(this, skill);
    };
    var _pay = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function (skill) {
        if (enDomaine(this) && estInvocation(skill) && $gameVariables) {
            var keep = $gameVariables.value(SOUL_VAR);
            _pay.call(this, skill);
            // les âmes reviennent : on annule la dépense (écriture directe, sans
            // relancer les hooks d'Errance/total)
            if ($gameVariables._data) $gameVariables._data[SOUL_VAR] = keep;
            return;
        }
        _pay.call(this, skill);
    };

    //=========================================================================
    // DÉPLOIEMENT DU DOMAINE  <RoyaumeImperial>
    //=========================================================================
    var RT = {
        ouvrir: function (actor) {
            if (!actor || !actor.isActor()) return;
            var id = actor.actorId();
            if ($gameScreen) { $gameScreen.startTint([-90, -90, -50, 130], 40); $gameScreen.startFlash([90, 0, 130, 220], 40); }
            if (SURGE > 0 && $gameVariables) {
                // écriture directe : le retour des âmes ne compte PAS +2 Errance/âme
                var cur = $gameVariables.value(SOUL_VAR);
                if ($gameVariables._data) $gameVariables._data[SOUL_VAR] = cur + SURGE;
                else $gameVariables.setValue(SOUL_VAR, cur + SURGE);
                if ($gameSystem) $gameSystem._amesTotal = (($gameSystem._amesTotal) || 0) + SURGE;
                // le prix du Domaine : +15 Errance, fixe et annoncé (pas +2/âme)
                try { if (window.Errance) window.Errance.add(id, 15); } catch (e) {}
            }
            actor.addState(DOMAINE);
            log('\\C[18]★ ROYAUME IMPÉRIAL — ' + actor.name() + '\\C[0]');
        },
        fermer: function (actor) {
            if (actor && actor.isStateAffected(DOMAINE)) {
                actor.removeState(DOMAINE);
                log('\\C[6]Le Domaine se referme.\\C[0]');
            }
        }
    };

    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        var it = this.item();
        if (!it || !it.meta) return;
        var s = this.subject();

        // Déployer le Domaine
        if (it.meta.RoyaumeImperial !== undefined && s && s.isActor && s.isActor() && !this._domFait) {
            this._domFait = true;
            RT.ouvrir(s);
        }

        // Annihilation : sceller la magie de la cible
        if (it.meta.SceauMagie !== undefined && target && target.isAlive()) {
            var r = target.result();
            if (r && (r.hpDamage > 0 || r.used)) {
                if (target.setMp) target.setMp(0);
                if (target.addDebuff) target.addDebuff(4, 3);   // MAT brisé (3 tours)
            }
        }

        // Aspiration des Âmes Damnées : régen sur le total d'âmes de la partie
        if (it.meta.AspirationDamnees !== undefined && s && s.isAlive()) {
            var total = RoyaumeTenebres.total();
            var soin = Math.min(s.mhp, ASP * total);
            var mana = Math.min(s.mmp, Math.floor(ASP * total * 0.6));
            if (soin > 0) { s.gainHp(soin); }
            if (mana > 0) { s.gainMp(mana); }
            s.startDamagePopup();
            // santé mentale restaurée…
            if (s.isActor && s.isActor() && window.Ame) {
                try { window.Ame.bon(s.actorId(), Math.max(1, Math.floor(total / 15))); } catch (e) {}
            }
            // …mais revivre les traumas déstabilise
            if (s.addState) s.addState(TRAUMA);
            log('\\C[2]' + (s.name ? s.name() : '') + ' aspire ' + total + ' âmes — et revit leurs morts.\\C[0]');
        }

        // Contre Totale : armer la garde absolue
        if (it.meta.ContreTotale !== undefined && s && s.isActor && s.isActor()) {
            s.addState(CONTRE);
            s._contreTotale = true;
        }
    };

    //=========================================================================
    // CONTRE TOTALE — renvoie toute frappe subie ce tour
    //=========================================================================
    var _execDmg = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        _execDmg.call(this, target, value);
        if (value > 0 && target && target.isStateAffected(CONTRE)) {
            var attacker = this.subject();
            if (attacker && attacker !== target && attacker.isAlive()) {
                attacker.gainHp(-value);
                attacker.startDamagePopup(); attacker.clearResult();
                log('\\C[16]CONTRE TOTALE (-' + value + ' PV renvoyés).\\C[0]');
                if (attacker.isDead()) attacker.performCollapse();
            }
        }
    };

    //=========================================================================
    // v2 — LE ROYAUME IMPÉRIAL : deux minutes où la mort ne tient pas
    //=========================================================================
    var R_ETAT = parseInt(P['royaumeEtat'] || 231);
    var R_SEC = parseInt(P['royaumeSecondes'] || 120);
    var R_AMES = parseInt(P['royaumeAmes'] === undefined || P['royaumeAmes'] === '' ? 1 : P['royaumeAmes']);
    var R_PV = parseInt(P['royaumePV'] || 30);
    var R_PM = parseInt(P['royaumePMRequis'] || 100);
    var R_FATIGUE = parseInt(P['royaumeFatigue'] || 190);
    // ⚠ Les booléens de PluginManager arrivent en TEXTE : on compare la chaîne.
    var R_COMPTEUR = String(P['royaumeCompteur'] || 'true') === 'true';

    function estRoyal(skill) { return !!(skill && skill.meta && skill.meta.DomaineRoyal !== undefined); }
    function royal() { return ($gameSystem && $gameSystem._royaume) || null; }
    function ames() { return $gameVariables ? $gameVariables.value(SOUL_VAR) : 0; }

    var Royaume = {
        actif: function () { var r = royal(); return !!(r && r.images > 0); },
        restant: function () { var r = royal(); return r ? Math.ceil(r.images / 60) : 0; },
        porteur: function () { var r = royal(); return r ? $gameActors.actor(r.acteur) : null; },
        ames: ames,
        cout: function () { return R_AMES; },

        ouvrir: function (acteur) {
            if (!acteur || !acteur.isActor || !acteur.isActor()) { return; }
            // Le compteur AVANT l'état : le crochet de addState voit le domaine
            // ouvert et ne recommence pas.
            $gameSystem._royaume = { acteur: acteur.actorId(), images: R_SEC * 60, total: R_SEC * 60 };
            acteur.addState(R_ETAT);
            log('\\C[18]👑 ROYAUME IMPÉRIAL — ' + acteur.name() + ' tient le domaine ' + R_SEC + ' secondes.\\C[0]');
            // Ceux qui sont DÉJÀ tombés se relèvent aussi : « toute mort ».
            $gameParty.deadMembers().forEach(function (m) { Royaume.relever(m); });
        },

        fermer: function (fatigue) {
            var r = royal();
            $gameSystem._royaume = null;
            if (!r) { return; }
            var a = $gameActors.actor(r.acteur);
            if (a && a.isStateAffected(R_ETAT)) { a.removeState(R_ETAT); }
            if (fatigue && a && a.isAlive() && R_FATIGUE > 0) {
                a.addState(R_FATIGUE);
                log('\\C[6]Le Royaume se referme. ' + a.name() + ' est vidé(e).\\C[0]');
            } else {
                log('\\C[6]Le Royaume se referme.\\C[0]');
            }
        },

        /** Ramène un héros tombé. Rend true si une âme a payé. */
        relever: function (b) {
            if (!Royaume.actif() || !b || !b.isActor || !b.isActor()) { return false; }
            if (R_AMES > 0 && ames() < R_AMES) { return false; }
            if (R_AMES > 0) { $gameVariables.setValue(SOUL_VAR, ames() - R_AMES); }
            // On écrit les PV EN DIRECT : passer par setHp relancerait refresh(),
            // et refresh() est justement l'endroit d'où l'on vient.
            b._hp = Math.max(1, Math.floor(b.mhp * R_PV / 100));
            if (b.isStateAffected(b.deathStateId())) { b.eraseState(b.deathStateId()); }
            b.startAnimation(49);
            log('\\C[2]Une âme est déplacée — ' + b.name() + ' revient.\\C[0]'
                + (R_AMES > 0 ? ' (' + ames() + ' âme' + (ames() > 1 ? 's' : '') + ' en réserve)' : ''));
            return true;
        },

        // Une image = 1/60 de seconde. On ne compte qu'en combat : le domaine
        // appartient au combat, et le menu ne doit pas grignoter les secondes.
        battre: function () {
            var r = royal();
            if (!r || r.images <= 0) { return; }
            r.images--;
            if (r.images <= 0) { Royaume.fermer(true); }
        }
    };
    window.Royaume = Royaume;

    // ── la mort ne tient pas ────────────────────────────────────────────────
    // Toutes les morts de MV passent par addState(état de mort) : les dégâts
    // (refresh à 0 PV), la fin de l'Immortel de YEP, la commande « Modifier
    // l'état ». On intercepte là, avant que l'état se pose.
    var _addStateR = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        if (stateId === this.deathStateId() && Royaume.actif() && this.isActor && this.isActor()
            && $gameParty.inBattle() && Royaume.relever(this)) {
            return;
        }
        _addStateR.call(this, stateId);
    };

    // Si l'état part autrement (fin de combat, purge), le domaine part avec.
    var _removeStateR = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function (stateId) {
        var avait = this.isStateAffected(stateId);
        _removeStateR.call(this, stateId);
        var r = royal();
        if (stateId === R_ETAT && avait && r && this.isActor && this.isActor() && this.actorId() === r.acteur) {
            $gameSystem._royaume = null;
        }
    };

    // ── tous les PM, et seulement quand ils sont revenus ────────────────────
    var _mpCost = Game_BattlerBase.prototype.skillMpCost;
    Game_BattlerBase.prototype.skillMpCost = function (skill) {
        if (estRoyal(skill)) { return this._mp; }
        return _mpCost.call(this, skill);
    };
    var _cond = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
        if (estRoyal(skill)) {
            if (Royaume.actif()) { return false; }                     // déjà ouvert
            if (this._mp <= 0) { return false; }
            if (this._mp < Math.ceil(this.mmp * R_PM / 100)) { return false; }
        }
        return _cond.call(this, skill);
    };

    // ── le déploiement ──────────────────────────────────────────────────────
    var _applyR = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _applyR.call(this, target);
        var it = this.item();
        var s = this.subject();
        if (estRoyal(it) && s && s.isActor && s.isActor() && !this._royaumeFait && !Royaume.actif()) {
            this._royaumeFait = true;
            Royaume.ouvrir(s);
        }
    };

    // ── le temps ────────────────────────────────────────────────────────────
    var _majCombatR = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        _majCombatR.call(this);
        Royaume.battre();
    };
    // Fin du combat : le domaine se referme sans fatigue (l'état de fatigue
    // tomberait de toute façon avec les états de combat).
    var _finCombatR = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        if (Royaume.actif()) { Royaume.fermer(false); }
        return _finCombatR.call(this, result);
    };

    // ── le compte à rebours ─────────────────────────────────────────────────
    function Window_Royaume() { this.initialize.apply(this, arguments); }
    Window_Royaume.prototype = Object.create(Window_Base.prototype);
    Window_Royaume.prototype.constructor = Window_Royaume;
    Window_Royaume.prototype.initialize = function () {
        var l = 320, h = this.fittingHeight(1);
        // Sous le compteur du Jackpot : les deux sont à ludwing, ils peuvent
        // tourner en même temps.
        Window_Base.prototype.initialize.call(this, (Graphics.boxWidth - l) / 2, 2 + h - 12, l, h);
        this.opacity = 0;
        this._cle = '';
        this.refresh();
    };
    Window_Royaume.prototype.refresh = function () {
        this.contents.clear();
        var r = royal();
        if (!r || r.images <= 0) { return; }
        var reste = Royaume.restant();
        var part = r.total > 0 ? r.images / r.total : 0;
        var la = this.contentsWidth();
        this.contents.fillRect(0, 6, la, 26, 'rgba(0,0,0,0.55)');
        this.contents.gradientFillRect(0, 6, Math.floor(la * part), 26, '#9b5cff', '#3a0a6a', false);
        if (reste <= 10 && (Graphics.frameCount % 30) < 15) {
            this.contents.fillRect(0, 6, Math.floor(la * part), 26, 'rgba(255,60,60,0.45)');
        }
        var mm = Math.floor(reste / 60), ss = reste % 60;
        this.contents.fontSize = 20;
        this.changeTextColor('#ffffff');
        this.contents.outlineColor = 'rgba(0,0,0,0.9)';
        this.drawText('👑 ROYAUME  ' + mm + ':' + (ss < 10 ? '0' : '') + ss + '   ·   ' + ames() + ' âmes', 0, 2, la, 'center');
        this.resetTextColor();
    };
    Window_Royaume.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        this.visible = R_COMPTEUR && Royaume.actif();
        var cle = Royaume.restant() + '/' + ames();
        if (this.visible && (cle !== this._cle || Royaume.restant() <= 10)) { this._cle = cle; this.refresh(); }
    };
    var _creerCombatR = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function () {
        _creerCombatR.call(this);
        if (R_COMPTEUR) { this._fenetreRoyaume = new Window_Royaume(); this.addChild(this._fenetreRoyaume); }
    };

    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'DOMAINE') return;
        var sub = (args[0] || '').toLowerCase();
        var a = $gameActors && $gameActors.actor(parseInt(args[1]) || 0);
        if (sub === 'ouvrir') RT.ouvrir(a);
        else if (sub === 'fermer') RT.fermer(a);
    };
})();
