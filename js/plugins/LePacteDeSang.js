//=============================================================================
// LePacteDeSang.js — v2.0
// Vesper : la Dette, le Pacte, le Masque Rouge — et ses trois Styles.
//=============================================================================
/*:
 * @plugindesc v2.0 ■ Vesper, comme Arlecchino : elle inscrit une Dette de
 * Sang, l'absorbe en Pacte, frappe sous le Masque Rouge, et ne se soigne
 * qu'en rendant le sang. Plus trois Styles qu'on change sans perdre le tour
 * (leurs kits et leurs ultimes : LesStylesDeVesper.js).
 * @author pour JOKO
 *
 * @param acteur
 * @text Vesper (acteur)
 * @type actor
 * @default 1
 *
 * @param etatDette
 * @text État — Dette de Sang (sur l'ennemi)
 * @type state
 * @default 233
 *
 * @param absorption
 * @text Pacte gagné par Dette absorbée (% PV max)
 * @type number
 * @default 65
 *
 * @param plafond
 * @text Plafond du Pacte (% PV max)
 * @type number
 * @default 200
 *
 * @param seuilMasque
 * @text Seuil du Masque Rouge (% PV max)
 * @type number
 * @default 30
 *
 * @param bonusMasque
 * @text Bonus du Masque (dégâts +X × Pacte%)
 * @default 0.6
 * @desc 0,6 : à 65 % de Pacte, +39 % de dégâts ; à 200 %, +120 %.
 *
 * @param consommation
 * @text Pacte consommé par coup sous le Masque (%)
 * @default 7.5
 *
 * @param soinsBloques
 * @text En combat, on ne peut pas la soigner ?
 * @type boolean
 * @default true
 * @desc Comme Arlecchino : seuls « Rendre le Sang » et le Style Saignée la
 * soignent. Les soins des autres remboursent d'abord le Pacte.
 *
 * @param soinsEnLame
 * @text En Lame, on la soigne normalement ?
 * @type boolean
 * @default true
 * @desc v2.0 : en Lame elle a posé son Pacte (« pas son don, même son masque
 * s'enlève ») — la Dette ne boit plus les soins, ils passent tels quels.
 *
 * @param etatStyleLame
 * @text État — Style Lame
 * @type state
 * @default 234
 *
 * @param etatStyleGarde
 * @text État — Style Garde
 * @type state
 * @default 235
 *
 * @param etatStyleSaignee
 * @text État — Style Saignée
 * @type state
 * @default 236
 *
 * @param volDeVieSaignee
 * @text Saignée — vol de vie de base (%)
 * @default 20
 * @desc En Style Saignée, cette part des dégâts qu'elle inflige lui revient en PV, Masque ou pas.
 *
 * @param animStyleLame
 * @text Effet visuel — Style Lame
 * @type animation
 * @default 371
 * @desc Joué sur Vesper quand elle passe en Lame (0 : rien). 371 = Lames triples · Rose.
 *
 * @param animStyleGarde
 * @text Effet visuel — Style Garde
 * @type animation
 * @default 439
 * @desc Joué sur Vesper quand elle passe en Garde (0 : rien). 439 = Dôme gardien · Rose.
 *
 * @param animStyleSaignee
 * @text Effet visuel — Style Saignée
 * @type animation
 * @default 435
 * @desc Joué sur Vesper quand elle passe en Saignée (0 : rien). 435 = Drain de vie · Rose.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  VESPER — « juste comme Arlecchino »                                 JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  Le canon de JOKO (SYSTEME_DE_MANA) : « Le porteur est affecté par son
 *  propre Trait. Le sang de Vesper est SON sang. » La Dette qui la mine et la
 *  soigne tour à tour, c'est ça.
 *
 *  ① LA DETTE DE SANG — <InscritDette>
 *     « Première Entaille » (une cible) et « Deux Cercles » (tous) inscrivent
 *     la Dette sur ce qu'elles touchent.
 *
 *  ② LE PACTE — le « Bond of Life »
 *     Tout AUTRE coup de Vesper sur un ennemi marqué absorbe la Dette :
 *     Pacte + 65 % de ses PV max, plafonné à 200 %. Le Pacte n'est pas de la
 *     vie : c'est une dette. Il s'affiche au-dessus de la fenêtre des héros.
 *
 *  ③ LE MASQUE ROUGE — dès 30 % de Pacte
 *     Son Attaque et ses techniques de sang (types 10 et 5) frappent plus fort
 *     selon le Pacte (+0,6 × Pacte%), et chaque coup en consomme 7,5 %.
 *
 *  ④ ON NE LA SOIGNE PAS
 *     Un soin sur Vesper rembourse d'abord le Pacte. Et en combat, comme
 *     Arlecchino, il ne rend rien d'autre (réglable : soinsBloques).
 *
 *  ⑤ RENDRE LE SANG — <RendreLeSang>  (compétence 1143, déjà dans le jeu)
 *     Frappe, puis efface le Pacte et la soigne : 50 % du Pacte + 150 % ATQ.
 *
 *  LES TROIS STYLES — gratuits, sans perdre le tour (<StyleVesper: …>)
 *  v2.0 (JOKO, 2026-10-14) : chaque Style a son kit et ses ultimes — c'est
 *  LesStylesDeVesper.js qui les tient. Ici, ce que le Style fait au Pacte :
 *     ⚔ LAME     ses armes et ses poings, rien d'autre : NI PACTE NI MASQUE.
 *                La Dette ne s'absorbe pas, le Masque Rouge ne joue pas, et
 *                les soins passent normalement (soinsEnLame).
 *                ATQ ×1,3, critiques +20 %, DÉF ×0,85 (état 234).
 *     🛡 GARDE    le Masque normal (×1, 7,5 % consommés par coup). DÉF et MDF
 *                ×1,4, elle attire les coups (état 235). L'adaptation et
 *                l'Arme de Sang remplacent l'ancienne Réserve.
 *     🩸 SANG     (l'ancienne Saignée, clé interne « saignee ») la plus
 *                agressive : Masque ×1,5, 10 % consommés par coup qui lui
 *                reviennent en PV, 20 % des dégâts qu'elle inflige aussi,
 *                +5 % PV par tour, AGI ×1,15 (état 236).
 *     (JOKO, 2026-09-26 : « je ne ressens pas la différence en jeu » — avant, hors
 *      Masque, seule la Garde changeait quelque chose.)
 *
 *  Le Pacte et la Réserve s'effacent à la fin du combat ; le Style se garde.
 *  Chaque changement de Style se VOIT : un effet court joué sur Vesper (JOKO :
 *  « un truc très simple, juste que tu le voies ») — trois animations réglables,
 *  rouges comme elle : Lames triples, Dôme gardien, Drain de vie.
 *
 *  ── AVEC LES SYSTÈMES QUI EXISTAIENT DÉJÀ ───────────────────────────────
 *  · LA VOIE DU SANG (MaitriseVoies) lui rendait 45 % des dégâts en PV. Sous
 *    la règle d'Arlecchino, ce vol de vie aurait remboursé le Pacte à chaque
 *    coup : mesuré, un seul coup effaçait 2 375 points de Pacte. Il vit donc
 *    dans le Style SAIGNÉE ; en Lame et en Garde, elle ne boit pas.
 *  · LE RECUL DU MANA NÉGATIF (ManaAffinity, 15 %) reste — c'est son sang.
 *    Mais la part que le Masque ajoute vient de la Dette : elle ne recule
 *    pas. Sans ça, à Pacte plein, un coup lui coûtait 43 % de sa vie.
 *  · « Rendre le Sang » soigne AVANT de frapper : dans l'autre sens, le recul
 *    pouvait la tuer avant que le soin arrive.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('LePacteDeSang');
    var VESPER = parseInt(P['acteur'] || 1, 10);
    var DETTE = parseInt(P['etatDette'] || 233, 10);
    var ABSORB = parseFloat(P['absorption'] || 65) / 100;
    var CAP = parseFloat(P['plafond'] || 200) / 100;
    var SEUIL = parseFloat(P['seuilMasque'] || 30) / 100;
    var K = parseFloat(P['bonusMasque'] || 0.6);
    var CONSO = parseFloat(P['consommation'] || 7.5) / 100;
    var BLOQUE = String(P['soinsBloques'] || 'true') === 'true';
    var SOINS_LAME = String(P['soinsEnLame'] || 'true') === 'true';
    /** En Lame (v2.0), le Pacte est posé : les soins passent tels quels. */
    function pacteEnSuspens(a) { return SOINS_LAME && style(a) === 'lame'; }
    var ETAT_STYLE = {
        lame: parseInt(P['etatStyleLame'] || 234, 10),
        garde: parseInt(P['etatStyleGarde'] || 235, 10),
        saignee: parseInt(P['etatStyleSaignee'] || 236, 10)
    };
    var VOL_SAIGNEE = parseFloat(P['volDeVieSaignee'] || 20) / 100;
    var ANIM_STYLE = {
        lame: parseInt(P['animStyleLame'] || 371, 10),
        garde: parseInt(P['animStyleGarde'] || 439, 10),
        saignee: parseInt(P['animStyleSaignee'] || 435, 10)
    };
    var STYLES = ['lame', 'garde', 'saignee'];
    var NOM_STYLE = { lame: '⚔ Lame', garde: '🛡 Garde', saignee: '🩸 Sang' };
    var TYPES_MASQUE = [10, 5];                   // sang, BERSEK
    var RESERVE_MAX = 0.30;                       // de ses PV max

    // ── outils ──────────────────────────────────────────────────────────────
    function estVesper(b) { return !!(b && b.isActor && b.isActor() && b.actorId() === VESPER); }
    function enCombat() { return !!($gameParty && $gameParty.inBattle()); }
    function journal(t) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', t); }
    }
    // Le journal est muet en vue de côté (SimpleMsgSideView) : ce qui doit se voir flotte aussi au-dessus de qui
    // le fait (2026-10-23 ; le journal reste, pour les bancs).
    function annonce(b, texte, couleur) {
        if (b && window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, texte, couleur || '#ffffff'); }
    }
    function pacte(a) { return Math.max(0, a._pacte || 0); }
    function pactePct(a) { return a.mhp > 0 ? pacte(a) / a.mhp : 0; }
    function poserPacte(a, v) { a._pacte = Math.max(0, Math.min(Math.floor(v), Math.floor(CAP * a.mhp))); }
    // v2.0 : en Lame, le Masque est retiré — elle ne frappe qu'avec ses armes.
    function masque(a) { return style(a) !== 'lame' && pactePct(a) >= SEUIL; }
    function style(a) { return (a && a._styleVesper) || 'lame'; }
    function tag(it, nom) { return !!(it && it.meta && it.meta[nom] !== undefined); }
    function sousMasque(action) {
        var it = action.item();
        if (!it) { return false; }
        if (action.isAttack && action.isAttack()) { return true; }
        return action.isSkill() && TYPES_MASQUE.indexOf(it.stypeId) >= 0;
    }

    /** Un soin qu'ELLE s'accorde (Rendre le Sang, Saignée) : il passe. */
    function soigner(a, v) {
        if (v <= 0) { return; }
        a._soinAutorise = true;
        try { a.gainHp(v); } finally { a._soinAutorise = false; }
        if (enCombat() && a.startDamagePopup) {
            a.result().hpDamage = -v; a.result().hpAffected = true; a.startDamagePopup();
        }
    }

    /** `visuel === false` : sans l'effet (la reprise du Style au début du combat). */
    function changerStyle(a, s, visuel) {
        if (STYLES.indexOf(s) < 0) { return; }
        a._styleVesper = s;
        STYLES.forEach(function (x) { if (a.isStateAffected(ETAT_STYLE[x])) { a.eraseState(ETAT_STYLE[x]); } });
        if (ETAT_STYLE[s] > 0 && $dataStates[ETAT_STYLE[s]]) { a.addNewState(ETAT_STYLE[s]); }
        a.refresh();
        // Le changement se voit : une animation courte sur son sprite (vue de côté).
        if (visuel !== false && enCombat() && ANIM_STYLE[s] > 0 && $dataAnimations[ANIM_STYLE[s]] && a.startAnimation) {
            a.startAnimation(ANIM_STYLE[s], false, 0);
        }
    }

    // ── ② et ⑤ : absorber, inscrire, rendre ─────────────────────────────────
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        var u = this.subject(), it = this.item();
        var vesper = estVesper(u) && enCombat();
        var avaitDette = vesper && target && target.isEnemy && target.isEnemy() && target.isStateAffected(DETTE);

        // ⑤ Rendre le Sang : on soigne AVANT de frapper. Dans l'autre sens, le
        //   recul du mana négatif (ManaAffinity, 15 % des dégâts) pouvait la
        //   tuer avant que le soin n'arrive — mesuré : −2 683 PV, puis +582.
        if (vesper && tag(it, 'RendreLeSang') && !this._sangRendu) {
            this._sangRendu = true;
            var p = pacte(u);
            var soin = Math.floor(p * 0.5 + u.atk * 1.5);
            poserPacte(u, 0);
            soigner(u, soin);
            journal('\\C[2]🩸 ' + u.name() + ' rend le sang : +' + soin + ' PV. Le Pacte est effacé.\\C[0]');
            annonce(u, '🩸 Le sang rendu · +' + soin + ' PV', '#ff6070');
        }

        _apply.call(this, target);
        if (!vesper || !target) { return; }
        var touche = target.result() && target.result().isHit();

        if (target.isEnemy() && touche) {
            // Absorber : tout coup de Vesper qui n'est PAS celui qui inscrit — sauf en
            // Lame, où il n'y a ni Pacte ni Masque.
            if (avaitDette && !tag(it, 'InscritDette') && style(u) !== 'lame') {
                target.removeState(DETTE);
                var av = pactePct(u);
                poserPacte(u, pacte(u) + ABSORB * u.mhp);
                journal('\\C[18]🩸 ' + u.name() + ' absorbe la Dette — Pacte ' + Math.round(pactePct(u) * 100) + ' %'
                    + (av < SEUIL && masque(u) ? ' · MASQUE ROUGE' : '') + '\\C[0]');
                annonce(u, '🩸 Dette absorbée · ' + Math.round(pactePct(u) * 100) + ' %' + (av < SEUIL && masque(u) ? ' · MASQUE' : ''), '#ff6070');
            }
            // Inscrire : les techniques qui marquent.
            if (tag(it, 'InscritDette')) {
                target.addState(DETTE);
            }
        }

        // Style changé par une action (IA, combat automatique)
        if (it && it.meta && it.meta.StyleVesper) { changerStyle(u, String(it.meta.StyleVesper).trim().toLowerCase()); }
    };

    // ── ③ le Masque Rouge ───────────────────────────────────────────────────
    // v2.0 : la Réserve et la Libération de la Garde sont remplacées par
    // l'adaptation et l'Arme de Sang (LesStylesDeVesper.js).
    var _valeur = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _valeur.call(this, target, critical);
        var u = this.subject();
        if (!enCombat()) { return v; }
        // Elle frappe
        if (estVesper(u) && v > 0 && target && target.isEnemy && target.isEnemy()) {
            var s = style(u);
            if (masque(u) && sousMasque(this)) {
                var k = K * (s === 'saignee' ? 1.5 : 1);
                var base = v;
                v = Math.floor(v * (1 + k * pactePct(u)));
                this._partMasque = v - base;       // cette part-là ne recule pas (voir executeDamage)
            }
        }
        return v;
    };

    // Chaque coup sous le Masque consomme le Pacte — une fois par coup porté.
    var _degats = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function (target, value) {
        var u = this.subject();
        var soinSurVesper = estVesper(target) && enCombat() && value < 0 && !target._soinAutorise && !pacteEnSuspens(target);
        _degats.call(this, target, value);
        if (soinSurVesper) {
            // Le soin a été bu par la Dette (voir gainHp) : on n'affiche pas un
            // chiffre vert qui n'a rien rendu.
            target.result().hpDamage = 0;
        }
        if (estVesper(u) && enCombat() && value > 0 && target && target.isEnemy && target.isEnemy()) {
            // JOKO, 2026-09-26 : « je ne ressens pas la différence en jeu ». Sans le Masque, seule la
            // Garde se voyait. La Saignée boit maintenant à chaque coup, Masque ou pas (réglable).
            if (style(u) === 'saignee' && VOL_SAIGNEE > 0) { soigner(u, Math.floor(value * VOL_SAIGNEE)); }
            if (masque(u) && sousMasque(this)) {
                var part = style(u) === 'saignee' ? 0.10 : CONSO;
                var brule = Math.floor(pacte(u) * part);
                poserPacte(u, pacte(u) - brule);
                if (style(u) === 'saignee' && brule > 0) { soigner(u, brule); }
            }
        }
    };

    // ── le recul du mana négatif ne porte pas sur la part du Masque ─────────
    // ManaAffinity fait payer 15 % des dégâts en PV à qui frappe en mana
    // négatif — c'est le canon : « le sang de Vesper est SON sang ». Mais la
    // part que le Masque ajoute vient de la Dette, pas de sa chair. Sans cette
    // règle, un coup en Lame à Pacte plein lui coûtait 43 % de sa vie.
    var _execDegats = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        var u = this.subject(), part = this._partMasque || 0;
        this._partMasque = 0;
        if (estVesper(u) && value > 0 && part > 0) { u._ratioRecul = Math.max(0, (value - part) / value); }
        try { _execDegats.call(this, target, value); } finally { if (u) { u._ratioRecul = null; } }
    };

    // ── ④ on ne la soigne pas ───────────────────────────────────────────────
    // Tous les soins de MV passent par gainHp : sorts, objets, régénération,
    // drain. C'est là qu'on se met en travers.
    //
    // ⚠ Vesper avait déjà un vol de vie : la Voie du Sang (MaitriseVoies,
    //   45 % des dégâts). Laissé tel quel sous la règle d'Arlecchino, il
    //   remboursait le Pacte à chaque coup — mesuré : un seul coup effaçait
    //   2 375 points de Pacte, le Masque ne tenait pas deux tours. On le range
    //   donc là où il a du sens : dans le Style Saignée.
    //     Lame, Garde  — le sang qu'elle boit ne lui revient pas (Arlecchino).
    //     Saignée      — la Voie du Sang boit pour elle, comme avant.
    //   Les soins des AUTRES remboursent le Pacte, puis ne rendent rien.
    var _gainHp = Game_Battler.prototype.gainHp;
    Game_Battler.prototype.gainHp = function (value) {
        if (estVesper(this) && enCombat()) {
            if (value < 0 && this._ratioRecul !== null && this._ratioRecul !== undefined) {
                value = -Math.floor(-value * this._ratioRecul);
                if (value === 0) { return; }
            }
            if (value > 0 && !this._soinAutorise && !pacteEnSuspens(this)) {
                var sonAction = BattleManager._subject === this && BattleManager._action
                    && BattleManager._action.isSkill && BattleManager._action.isSkill();
                if (sonAction) {
                    if (style(this) === 'saignee') { return _gainHp.call(this, value); }
                    return;
                }
                var p = pacte(this);
                if (p > 0) {
                    var rembourse = Math.min(p, value);
                    poserPacte(this, p - rembourse);
                    journal('\\C[8]🩸 La Dette boit le soin : −' + rembourse + ' au Pacte.\\C[0]');
                    annonce(this, '🩸 La Dette boit le soin', '#b0b0b0');
                    return;
                }
                if (BLOQUE) { return; }
            }
        }
        _gainHp.call(this, value);
    };

    // ── les Styles : gratuits, sans perdre le tour ──────────────────────────
    var _okSkill = Scene_Battle.prototype.onSkillOk;
    Scene_Battle.prototype.onSkillOk = function () {
        var sk = this._skillWindow.item(), a = BattleManager.actor();
        if (sk && sk.meta && sk.meta.StyleVesper && estVesper(a)) {
            changerStyle(a, String(sk.meta.StyleVesper).trim().toLowerCase());
            SoundManager.playEquip();
            this._skillWindow.refresh();
            this._statusWindow.refresh();
            // retour au menu de Vesper : le tour n'est pas perdu
            this._skillWindow.hide();
            this._actorCommandWindow.activate();
            return;
        }
        _okSkill.call(this);
    };

    // ── début et fin de combat ──────────────────────────────────────────────
    function remettre(a) {
        if (!a) { return; }
        a._pacte = 0; a._reserve = 0;
        STYLES.forEach(function (x) { if (a.isStateAffected(ETAT_STYLE[x])) { a.eraseState(ETAT_STYLE[x]); } });
    }
    var _debut = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        _debut.call(this);
        var a = $gameActors.actor(VESPER);
        if (a && $gameParty.battleMembers().indexOf(a) >= 0) {
            remettre(a);
            changerStyle(a, a._styleVesper || 'lame', false);   // on garde le dernier style choisi, sans l'effet
        }
    };
    var _fin = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        remettre($gameActors.actor(VESPER));
        return _fin.call(this, result);
    };

    // ── à l'écran : le Pacte, le Masque, le Style, la Réserve ───────────────
    function Window_Pacte() { this.initialize.apply(this, arguments); }
    Window_Pacte.prototype = Object.create(Window_Base.prototype);
    Window_Pacte.prototype.constructor = Window_Pacte;
    Window_Pacte.prototype.initialize = function (y) {
        Window_Base.prototype.initialize.call(this, 0, y, 300, this.fittingHeight(1));
        this.opacity = 0; this._cle = ''; this.refresh();
    };
    Window_Pacte.prototype.refresh = function () {
        this.contents.clear();
        var a = $gameActors.actor(VESPER);
        if (!a || $gameParty.battleMembers().indexOf(a) < 0) { return; }
        var la = this.contentsWidth(), p = pactePct(a), part = Math.min(1, p / CAP);
        this.contents.fillRect(0, 8, la, 20, 'rgba(0,0,0,0.55)');
        this.contents.gradientFillRect(0, 8, Math.floor(la * part), 20, '#5a0010', '#e0283c', false);
        // le seuil du Masque, en trait fin
        this.contents.fillRect(Math.floor(la * SEUIL / CAP), 6, 2, 24, '#ffd0d0');
        this.contents.fontSize = 17;
        this.contents.outlineColor = 'rgba(0,0,0,0.9)';
        this.changeTextColor('#ffffff');
        var t = (style(a) === 'lame' ? '⚔ sans Masque' : '🩸 ' + Math.round(p * 100) + ' %' + (masque(a) ? ' · MASQUE' : ''))
            + ' · ' + NOM_STYLE[style(a)];
        this.drawText(t, 4, 2, la - 8, 'left');
        this.resetTextColor();
    };
    Window_Pacte.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        var a = $gameActors.actor(VESPER);
        var cle = a ? (pacte(a) + '/' + style(a) + '/' + (a._reserve || 0) + '/' + a.mhp) : '';
        if (cle !== this._cle) { this._cle = cle; this.refresh(); }
    };
    var _fenetres = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function () {
        _fenetres.call(this);
        var sw = this._statusWindow;
        var y = sw ? sw.y - 56 : Graphics.boxHeight - 240;
        this._fenetrePacte = new Window_Pacte(y);
        this.addChild(this._fenetrePacte);
    };

    // ── de quoi le mesurer sans deviner ─────────────────────────────────────
    window.PacteDeSang = {
        pacte: function () { var a = $gameActors.actor(VESPER); return a ? pacte(a) : 0; },
        pct: function () { var a = $gameActors.actor(VESPER); return a ? pactePct(a) : 0; },
        masque: function () { var a = $gameActors.actor(VESPER); return a ? masque(a) : false; },
        style: function () { return style($gameActors.actor(VESPER)); },
        reserve: function () { var a = $gameActors.actor(VESPER); return a ? (a._reserve || 0) : 0; },
        poser: function (pct) { var a = $gameActors.actor(VESPER); if (a) { poserPacte(a, pct * a.mhp); } },
        changerStyle: function (s) { changerStyle($gameActors.actor(VESPER), s); },
        /** Un soin extérieur lui rend-il quelque chose ? Pour les IA alliées. */
        soignable: function (b) { return !(estVesper(b) && enCombat() && !pacteEnSuspens(b) && (BLOQUE || pacte(b) > 0)); },
        dette: DETTE
    };
})();
