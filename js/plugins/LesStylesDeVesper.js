//=============================================================================
// LesStylesDeVesper.js — v1.0
// Vesper : trois Styles, trois kits, trois ultimes — et sa Colère.
//=============================================================================
/*:
 * @plugindesc v1.2 ■ Vesper : Lame (arts d'armes, État de Flow), Sang
 * (Berserker), Garde (adaptation, Arme de Sang). Et sa Colère, que ludwing
 * sait réveiller. À placer juste après LePacteDeSang.
 * @author pour JOKO
 *
 * @param acteur
 * @text Vesper (acteur)
 * @type actor
 * @default 1
 *
 * @param ludwing
 * @text ludwing (acteur)
 * @desc Celui qui lui lance des vannes — et qu'elle frappe en Rage.
 * @type actor
 * @default 3
 *
 * @param === LA COLÈRE ET LA RAGE ===
 * @default
 *
 * @param colereParCoup
 * @text Colère par coup reçu
 * @type number
 * @default 10
 *
 * @param multLame
 * @text Colère gagnée en Lame (×)
 * @desc « Plus contrôlée, moins apte à la colère. »
 * @default 0.5
 *
 * @param multSang
 * @text Colère gagnée en Sang (×)
 * @default 1.5
 *
 * @param multGarde
 * @text Colère gagnée en Garde (×)
 * @default 1
 *
 * @param etatRage
 * @text État — Rage
 * @type state
 * @default 1001
 *
 * @param rageDegats
 * @text Dégâts en Rage (%)
 * @type number
 * @default 150
 *
 * @param rageLudwing
 * @text En Rage, ses coups visent ludwing (%)
 * @desc Sur un coup à cible unique contre l'ennemi : cette chance que ce soit
 * ludwing qui le prenne.
 * @type number
 * @default 60
 *
 * @param === LAME ===
 * @default
 *
 * @param familles
 * @text Familles d'arts → types d'armes
 * @desc famille: types d'armes | … — un art <ArtArme: famille> n'apparaît que
 * si elle tient une de ces armes (poings : aussi les mains nues).
 * @default epee: 2, 15 | dague: 1 | hache: 4 | lance: 12, 6 | distance: 3, 7, 8, 9, 13 | poings: 11, 10
 *
 * @param voiesDesArmes
 * @text En Lame, la Voie de l'arme tenue
 * @desc famille: Voie | … — en Lame, un mouvement sans Voie à lui prend celle de l'arme qu'elle tient (plus la Voie du Sang). Une famille absente : sa Voie par défaut. Vide : comme avant.
 * @default epee: miroir | dague: eclair | hache: forge | lance: vide | distance: flash | poings: onde
 *
 * @param typeArts
 * @text Type de compétence des arts d'armes
 * @type number
 * @default 24
 *
 * @param seuilFlow
 * @text L'État de Flow apparaît sous (% PV)
 * @type number
 * @default 20
 *
 * @param etatFlow
 * @text État — État de Flow
 * @type state
 * @default 87
 *
 * @param etatEpuisement
 * @text État — Épuisement du Flow
 * @type state
 * @default 1002
 *
 * @param contreFlow
 * @text Compétence de la contre-attaque du Flow
 * @type skill
 * @default 131
 *
 * @param === SANG ===
 * @default
 *
 * @param etatBerserker
 * @text État — Berserker
 * @type state
 * @default 12
 *
 * @param volBerserker
 * @text Berserker : chaque coup la soigne de (% des dégâts)
 * @type number
 * @default 25
 *
 * @param contrecoup
 * @text Berserker : contrecoup à la fin (% PV max)
 * @type number
 * @default 20
 *
 * @param typeBersek
 * @text Type de compétence du BERSEK (frappe deux fois en Berserker)
 * @type number
 * @default 5
 *
 * @param etatEtourdi
 * @text État — étourdie (contrecoup)
 * @type state
 * @default 134
 *
 * @param etatConvergence
 * @text État — Convergence
 * @type state
 * @default 1004
 *
 * @param === GARDE ===
 * @default
 *
 * @param adaptationPas
 * @text Adaptation par coup du même type (%)
 * @type number
 * @default 15
 *
 * @param adaptationMax
 * @text Adaptation maximale (%)
 * @type number
 * @default 75
 *
 * @param drainParTour
 * @text Ce que la Garde boit, tour après tour (% PM et PT)
 * @desc Un nombre par tour passé en Garde ; le dernier se répète.
 * @default 5, 10, 20, 40, 80
 *
 * @param etatArmureBrisee
 * @text État — Armure Brisée
 * @type state
 * @default 1003
 *
 * @param seuilArmeDeSang
 * @text Arme de Sang : sang encaissé minimum (% PV max)
 * @type number
 * @default 20
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  VESPER — TROIS STYLES, TROIS KITS                                    JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  JOKO, le 2026-10-14 : « chaque style a ses compétences à lui que d'autres
 *  non » — et pour chacun : Lame « parfait », ulti 2A + 2C ; Sang 3A + 3B
 *  pour l'ulti, 3C pour les techniques ; Garde « parfait », ulti 4B.
 *
 *  LE KIT — <Style: lame|sang|garde> sur une compétence : Vesper ne la voit
 *  (et ne peut la lancer) que dans ce Style. Sans balise : dans les trois.
 *  Les branches vides disparaissent du menu de combat.
 *
 *  ⚔ LAME — ses armes et ses poings, rien d'autre (ni Masque, ni sang, ni
 *  Paroles). <ArtArme: epee|dague|hache|lance|distance|poings> : l'art
 *  n'apparaît que si elle tient une arme de cette famille (paramètre
 *  « familles » : ses Lames Écarlates (type SANG) comptent comme des épées,
 *  la canne comme une lance, la griffe comme les poings ; poings aussi à
 *  mains nues). Le fouet n'a pas d'art à lui. Colère ×0,5. On la soigne
 *  normalement (LePacteDeSang, soinsEnLame).
 *  Une liste marche aussi : <ArtArme: epee, sinon> — « sinon », c'est une
 *  arme d'aucune famille (le fouet, l'éclat).
 *    ⚔ TRANCHE-NÉANT (ulti) — v1.1, JOKO, le 2026-10-26 : « art d'arme de
 *      Vesper (style Lame, selon l'arme tenue), oui donc plusieurs
 *      variantes ». Une par famille, tirée de ses arts : à l'épée (et au
 *      fouet, 445) toute la troupe, elle part avant tout le monde ; à la
 *      dague (1310) un ennemi, la moitié de l'armure ignorée ; à la hache
 *      (1311) toute la troupe, peut étourdir ; à la lance (1312) toute la
 *      troupe, 30 % de l'armure ignorés, ils ralentissent ; à distance
 *      (1313) quatre traits au hasard ; aux poings (1314) un ennemi, peut
 *      donner le vertige. Même prix, même recharge, même contre-coup. Elle
 *      ne voit que celle de l'arme qu'elle tient ; la forme s'annonce.
 *    ☯ ÉTAT DE FLOW (ulti) — n'apparaît que sous 20 % de PV. 3 tours :
 *      deux actions par tour (2C) ; le corps dévie les petits coups et
 *      esquive les gros une fois sur deux — et chaque esquive déclenche une
 *      contre-attaque (2A). Puis l'Épuisement du Flow.
 *      v1.2 (JOKO, le 2026-10-26 : « L4 ») : chaque contre-attaque du Flow est
 *      une riposte du contre-temps — son flux monte, la 3ᵉ est un geste juste.
 *    ⚔ LA VOIE DE L'ARME — v1.2 (« L1 ») : en Lame, un mouvement sans Voie à
 *      lui prend celle de l'arme tenue (voiesDesArmes) : épée Miroir, dague
 *      Éclair, hache Forge, lance Vide, distance Flash, poings Onde. Plus la
 *      Voie du Sang en Lame ; et changer de Style change de Voie.
 *    ⚔ SES ARTS ONT UN VERBE — v1.2 (« L2 ») : chacun le sien, tiré de sa
 *      description (Iaï : il part avant tout le monde ; Couperet : tout le
 *      poids du corps…), écrit sur sa fiche.
 *
 *  🩸 SANG — la plus agressive : Masque ×1,5, vol de vie, aucune Parole.
 *  Colère ×1,5.
 *    🩸 BERSERKER (ulti) — en Rage seulement, et il prend sa place : plus de
 *      coups qui partent vers ludwing. 3 tours : la Colère boit les coups à
 *      la place des PV (3B), puis 1 PV minimum (3A) ; chaque coup la soigne ;
 *      ses techniques BERSEK frappent deux fois. À la fin, le contrecoup :
 *      20 % de sa vie (sans la tuer) et un tour étourdie.
 *    ✶ CONVERGENCE (3C) — le prochain Sang Perçant ×2, à travers toute
 *      défense ; la prochaine Supernova lâche deux éclats de plus.
 *
 *  🛡 GARDE — l'équilibrée. Chaque coup d'un même type (physique, feu…) la
 *  rend plus résistante à ce type : −15 % par coup, jusqu'à −75 % (comme la
 *  roue de Mahoraga). Mais la Garde boit ses PM et ses PT, de plus en plus :
 *  5 %, 10 %, 20 %, 40 %… À zéro, l'armure cède : adaptations perdues,
 *  DÉF et MDF ×0,5 deux tours.
 *    L'ARME DE SANG (ulti, 4B) — tout ce qu'elle a encaissé en Garde (avant
 *      l'adaptation) se fige en arme : un seul coup qui rend tout.
 *
 *  💢 LA COLÈRE — une jauge de 0 à 100 (elle remplace la « maîtrise de soi »
 *  de l'ancienne santé mentale). +10 par coup reçu ; les interactions la
 *  font monter aussi (LesInteractions.js : la Vanne de ludwing, +50 — et il
 *  se prend un coup). À 100 : la Rage, 2 tours. Elle
 *  frappe 50 % plus fort, +25 % de critiques — et ses coups à cible unique
 *  visent ludwing 60 % du temps. Tu la pilotes toujours.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('LesStylesDeVesper');
    function num(k, d) { var v = P[k]; return (v === undefined || v === '') ? d : Number(v); }
    var VESPER = num('acteur', 1), LUDWING = num('ludwing', 3);
    var C_COUP = num('colereParCoup', 10);
    var MULT = { lame: num('multLame', 0.5), sang: num('multSang', 1.5), garde: num('multGarde', 1) };
    var ETAT_RAGE = num('etatRage', 1001), RAGE_DEG = num('rageDegats', 150) / 100, RAGE_LUD = num('rageLudwing', 60) / 100;
    var TYPE_ARTS = num('typeArts', 24);
    var SEUIL_FLOW = num('seuilFlow', 20) / 100, ETAT_FLOW = num('etatFlow', 87), ETAT_EPUISE = num('etatEpuisement', 1002);
    var CONTRE = num('contreFlow', 131);
    var ETAT_BERSERK = num('etatBerserker', 12), VOL_BERSERK = num('volBerserker', 25) / 100;
    var CONTRECOUP = num('contrecoup', 20) / 100, ETOURDI = num('etatEtourdi', 134), ETAT_CONV = num('etatConvergence', 1004);
    var TYPE_BERSEK = num('typeBersek', 5);
    var PAS_ADAPT = num('adaptationPas', 15) / 100, MAX_ADAPT = num('adaptationMax', 75) / 100;
    var DRAIN = String(P['drainParTour'] === undefined || P['drainParTour'] === '' ? '5, 10, 20, 40, 80' : P['drainParTour'])
        .split(',').map(function (x) { return Number(x) / 100; }).filter(function (x) { return x >= 0; });
    var ETAT_BRISEE = num('etatArmureBrisee', 1003), SEUIL_ARME = num('seuilArmeDeSang', 20) / 100;
    // famille d'arts → types d'armes (Base de données → Types → Armes)
    var FAMILLES = {};
    String(P['familles'] === undefined || P['familles'] === '' ? 'epee: 2, 15 | dague: 1 | hache: 4 | lance: 12, 6 | distance: 3, 7, 8, 9, 13 | poings: 11, 10' : P['familles'])
        .split('|').forEach(function (bloc) {
            var m = bloc.split(':'); if (m.length < 2) { return; }
            FAMILLES[m[0].trim().toLowerCase()] = m[1].split(',').map(function (x) { return Number(x); }).filter(function (x) { return x > 0; });
        });
    var STYLE_DE_CLE = { lame: 'lame', garde: 'garde', saignee: 'sang' };
    // famille d'arts → la Voie qu'elle donne en Lame (JOKO, 2026-10-26 : « L1 »)
    var VOIE_ARME = {};
    String(P['voiesDesArmes'] === undefined ? 'epee: miroir | dague: eclair | hache: forge | lance: vide | distance: flash | poings: onde' : P['voiesDesArmes'])
        .split('|').forEach(function (bloc) {
            var m = bloc.split(':'); if (m.length < 2) { return; }
            VOIE_ARME[m[0].trim().toLowerCase()] = m[1].trim().toLowerCase();
        });

    // ── outils ──────────────────────────────────────────────────────────────
    function estVesper(b) { return !!(b && b.isActor && b.isActor() && b.actorId() === VESPER); }
    function enCombat() { return !!($gameParty && $gameParty.inBattle()); }
    function vesper() { return $gameActors ? $gameActors.actor(VESPER) : null; }
    function dansLeCombat(id) {
        if (!enCombat()) { return null; }
        var a = $gameActors.actor(id);
        return a && $gameParty.battleMembers().indexOf(a) >= 0 && a.isAlive() ? a : null;
    }
    function style(a) { return STYLE_DE_CLE[(a && a._styleVesper) || 'lame'] || 'lame'; }
    function tag(it, nom) { return !!(it && it.meta && it.meta[nom] !== undefined); }
    function stylesDe(it) {
        if (!it || !it.meta || it.meta.Style === undefined) { return null; }
        return String(it.meta.Style).toLowerCase().split(/[,\s]+/).filter(Boolean);
    }
    function journal(t) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', t); }
    }
    // Le journal est muet en vue de côté (SimpleMsgSideView) : ce qui doit se voir flotte aussi au-dessus de qui
    // le fait (2026-10-23 ; le journal reste, pour les bancs).
    function annonce(b, texte, couleur) {
        if (b && window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, texte, couleur || '#ffffff'); }
    }
    /** Poser un état hors du chemin d'une action : MV refuse un état retiré
     *  dans la même action tant que le résultat n'est pas vidé (CLAUDE.md §7). */
    function poser(a, id) { if (!a || !$dataStates[id]) { return; } a.clearResult(); a.addState(id); }
    /** Un soin qu'elle s'accorde elle-même : LePacteDeSang le laisse passer. */
    function soigner(a, v) {
        if (v <= 0 || !a || a.isDead()) { return; }
        a._soinAutorise = true;
        try { a.gainHp(v); } finally { a._soinAutorise = false; }
    }
    function effetFort(couleur, se) {
        if (!$gameScreen) { return; }
        $gameScreen.startShake(6, 6, 20);
        $gameScreen.startFlash(couleur, 30);
        if (se) { AudioManager.playSe({ name: se, volume: 90, pitch: 100, pan: 0 }); }
    }

    // ── le kit de chaque Style ──────────────────────────────────────────────
    function tientFamille(a, fam) {
        var t = FAMILLES[fam];
        if (!t) { return true; }
        var armes = a.weapons();
        if (fam === 'poings' && armes.length === 0) { return true; }
        return armes.some(function (w) { return t.indexOf(w.wtypeId) >= 0; });
    }
    /** « sinon » : elle tient une arme, mais d'aucune famille (le fouet, l'éclat). */
    function sansFamille(a) {
        var armes = a.weapons();
        return armes.length > 0 && !armes.some(function (w) {
            return Object.keys(FAMILLES).some(function (f) { return FAMILLES[f].indexOf(w.wtypeId) >= 0; });
        });
    }
    /** <ArtArme: dague> ou <ArtArme: epee, sinon> : l'une des familles suffit. */
    function familles(it) { return String(it.meta.ArtArme).toLowerCase().split(/[,\s]+/).filter(Boolean); }
    function tientArt(a, it) {
        return familles(it).some(function (f) { return f === 'sinon' ? sansFamille(a) : tientFamille(a, f); });
    }
    var A_LA = { epee: 'à l\'épée', dague: 'à la dague', hache: 'à la hache', lance: 'à la lance', distance: 'à distance', poings: 'aux poings' };
    /** Sous quelle forme part un art d'arme : la famille qu'elle tient (le nom de l'arme, sans famille). */
    function forme(a, it) {
        var f = familles(it).filter(function (x) { return x === 'sinon' ? sansFamille(a) : tientFamille(a, x); })[0];
        if (f !== 'sinon') { return A_LA[f] || f || ''; }
        var w = a.weapons()[0];
        return w ? String($dataSystem.weaponTypes[w.wtypeId] || '').trim().toLowerCase() : '';
    }
    function sousFlow(a) { return a.hp <= a.mhp * SEUIL_FLOW; }
    /** Ce que Vesper VOIT dans ses menus. */
    function dansLeKit(a, it) {
        if (!estVesper(a) || !it || !DataManager.isSkill(it)) { return true; }
        var st = stylesDe(it);
        if (st && st.indexOf(style(a)) < 0) { return false; }
        if (tag(it, 'ArtArme') && !tientArt(a, it)) { return false; }
        // « Art Serein : État de Flow — apparaît que à 20 % de PV »
        if (tag(it, 'FlowVesper') && (!sousFlow(a) || a.isStateAffected(ETAT_FLOW))) { return false; }
        // « pendant qu'elle est énervée elle peut se transformer en Berserker »
        if (tag(it, 'BerserkerVesper') && (!a.isStateAffected(ETAT_RAGE) || a.isStateAffected(ETAT_BERSERK))) { return false; }
        return true;
    }
    function sansSortie(a) { return a.isStateAffected(ETAT_FLOW) || a.isStateAffected(ETAT_BERSERK); }

    // ⚔ L1 — en Lame, un mouvement sans Voie à lui prend celle de l'arme tenue : l'épée le Miroir, la dague
    // l'Éclair, la hache la Forge, la lance le Vide, la distance le Flash, les poings l'Onde (réglage). Le Style
    // « ni sang » ne draine plus comme le Sang, et changer de Style change de Voie : le flux monte.
    /** La famille de l'arme qu'elle tient en main (les poings à mains nues ; '' : aucune famille). */
    function familleTenue(a) {
        var w = a.weapons()[0];
        if (!w) { return 'poings'; }
        return Object.keys(FAMILLES).filter(function (f) { return FAMILLES[f].indexOf(w.wtypeId) >= 0; })[0] || '';
    }
    function voieDeLaLame(a) { return estVesper(a) && style(a) === 'lame' ? (VOIE_ARME[familleTenue(a)] || '') : ''; }
    if (window.Voies) {
        var _voieDuGeste = Voies.voieDuGeste;
        Voies.voieDuGeste = function (b, item) { return voieDeLaLame(b) || (_voieDuGeste ? _voieDuGeste(b, item) : ''); };
    }

    var _conditions = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
        if (!_conditions.call(this, skill)) { return false; }
        if (estVesper(this)) {
            if (!dansLeKit(this, skill)) { return false; }
            // on ne change pas de Style au milieu du Flow ou du Berserker
            if (skill.meta && skill.meta.StyleVesper && sansSortie(this)) { return false; }
            if (tag(skill, 'FlowVesper') && this.isStateAffected(ETAT_EPUISE)) { return false; }
            if (tag(skill, 'ArmeDeSang') && (this._sangEncaisse || 0) < this.mhp * SEUIL_ARME) { return false; }
        }
        return true;
    };

    var _inclut = Window_SkillList.prototype.includes;
    Window_SkillList.prototype.includes = function (item) {
        if (this._actor && estVesper(this._actor) && item && !dansLeKit(this._actor, item)) { return false; }
        return _inclut.call(this, item);
    };

    /** Une branche sans rien dedans pour ce Style ne s'affiche pas. */
    function brancheVide(a, stypeId) {
        return !a.skills().some(function (s) { return s.stypeId === stypeId && dansLeKit(a, s); });
    }
    function filtrerBranches(win) {
        var a = win._actor;
        if (!a || !estVesper(a) || !win._list) { return; }
        win._list = win._list.filter(function (c) { return c.symbol !== 'skill' || !brancheVide(a, c.ext); });
    }
    var _cmdCombat = Window_ActorCommand.prototype.addSkillCommands;
    Window_ActorCommand.prototype.addSkillCommands = function () {
        _cmdCombat.call(this);
        filtrerBranches(this);
    };
    var _cmdMenu = Window_SkillType.prototype.makeCommandList;
    Window_SkillType.prototype.makeCommandList = function () {
        _cmdMenu.call(this);
        filtrerBranches(this);
    };

    // ── la Colère et la Rage ────────────────────────────────────────────────
    function colere(a) { return Math.max(0, Math.min(100, a._colere || 0)); }
    function enRageOuBerserk(a) { return a.isStateAffected(ETAT_RAGE) || a.isStateAffected(ETAT_BERSERK); }
    function gagnerColere(a, n) {
        if (!enCombat() || !estVesper(a) || a.isDead() || enRageOuBerserk(a)) { return; }
        var avant = colere(a);
        a._colere = Math.min(100, avant + Math.round(n * (MULT[style(a)] === undefined ? 1 : MULT[style(a)])));
        if (a._colere >= 100) { entrerEnRage(a); }
    }
    function entrerEnRage(a) {
        if (a.isStateAffected(ETAT_BERSERK)) { return; }   // le Berserker a pris la place de la Rage
        a._colere = 100;
        poser(a, ETAT_RAGE);
        if (!a.isStateAffected(ETAT_RAGE)) { return; }
        effetFort([255, 40, 40, 160], 'Monster4');
        journal('\\C[2]💢 ' + a.name().toUpperCase() + ' EXPLOSE DE RAGE ! 💢\\C[0]');
        annonce(a, '💢 RAGE !', '#ff4040');
    }

    // ── les coups : Rage (dégâts), Garde (adaptation), Berserker (Colère, 1 PV)
    var _valeur = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _valeur.call(this, target, critical);
        var u = this.subject();
        if (enCombat() && estVesper(u) && v > 0 && u.isStateAffected(ETAT_RAGE)) { v = Math.floor(v * RAGE_DEG); }
        return v;
    };

    function elementDu(action) {
        var it = action.item(), el = it && it.damage ? it.damage.elementId : 0;
        if (el < 0) {
            var e = action.subject() && action.subject().attackElements ? action.subject().attackElements() : [];
            el = e.length ? e[0] : 1;
        }
        return el > 0 ? el : 1;
    }
    function nomElement(el) { return ($dataSystem.elements[el] || 'Physique').trim() || 'Physique'; }

    var _pv = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function (target, value) {
        var u = this.subject();
        if (enCombat() && estVesper(target) && value > 0) {
            // 🛡 Garde : elle encaisse (le compte de l'Arme de Sang), puis s'adapte
            if (style(target) === 'garde' && !target.isStateAffected(ETAT_BRISEE) && u && !estVesper(u)) {
                target._sangEncaisse = (target._sangEncaisse || 0) + value;
                var el = elementDu(this), ad = target._adapt || (target._adapt = {});
                var r = ad[el] || 0;
                value = Math.round(value * (1 - r));
                var r2 = Math.round(Math.min(MAX_ADAPT, r + PAS_ADAPT) * 100) / 100;   // 0,15 · 0,30 · 0,45… sans poussière de virgule
                if (r2 > r) {
                    ad[el] = r2;
                    journal('\\C[6]⚙ ' + target.name() + ' s\'adapte : ' + nomElement(el) + ' −' + Math.round(r2 * 100) + ' %\\C[0]');
                    annonce(target, '⚙ S\'adapte : ' + nomElement(el) + ' −' + Math.round(r2 * 100) + ' %', '#a0d0ff');
                }
            }
            // 🩸 Berserker : la Colère boit le coup (3B), puis 1 PV minimum (3A)
            if (target.isStateAffected(ETAT_BERSERK)) {
                var c = colere(target), reserve = Math.floor(c / 100 * target.mhp);
                var bu = Math.min(value, reserve);
                if (bu > 0) {
                    target._colere = Math.max(0, c - bu / target.mhp * 100);
                    value -= bu;
                }
                if (value >= target.hp) { value = Math.max(0, target.hp - 1); }
            }
        }
        _pv.call(this, target, value);
        if (!enCombat()) { return; }
        // 💢 un coup ennemi reçu
        if (estVesper(target) && value > 0 && u && u.isEnemy && u.isEnemy()) { gagnerColere(target, C_COUP); }
        // 🩸 Berserker : chaque coup la soigne
        if (estVesper(u) && value > 0 && u.isStateAffected(ETAT_BERSERK) && target.isEnemy && target.isEnemy()) {
            soigner(u, Math.floor(value * VOL_BERSERK));
        }
    };

    // 🩸 Berserker (3A) : ses techniques BERSEK frappent deux fois
    var _repet = Game_Action.prototype.numRepeats;
    Game_Action.prototype.numRepeats = function () {
        var n = _repet.call(this), u = this.subject(), it = this.item();
        if (enCombat() && estVesper(u) && this.isSkill() && it && it.stypeId === TYPE_BERSEK && u.isStateAffected(ETAT_BERSERK)) { n *= 2; }
        return n;
    };

    // Berserker : rien ne la fait tomber pendant trois tours — ni recul, ni poison.
    var _gainHp = Game_Battler.prototype.gainHp;
    Game_Battler.prototype.gainHp = function (value) {
        if (value < 0 && estVesper(this) && enCombat() && this.isStateAffected(ETAT_BERSERK) && this.hp + value < 1) {
            value = Math.min(0, 1 - this.hp);
        }
        _gainHp.call(this, value);
    };
    var _ajoute = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (id) {
        if (estVesper(this) && enCombat() && id === this.deathStateId() && this.isStateAffected(ETAT_BERSERK)) {
            this._hp = Math.max(1, this._hp);
            return;
        }
        _ajoute.call(this, id);
    };

    // ── les cibles : la Rage (ludwing), la Supernova ────────────────────────
    var _cibles = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function () {
        var u = this.subject(), it = this.item();
        var t = _cibles.call(this);
        if (!enCombat() || !estVesper(u) || !it) { return t; }
        // ✶ Supernova après la Convergence : deux éclats de plus
        if (tag(it, 'Supernova') && u.isStateAffected(ETAT_CONV)) {
            for (var i = 0; i < 2; i++) { var e = $gameTroop.randomTarget(); if (e) { t.push(e); } }
        }
        // 💢 en Rage, ses coups à cible unique partent vers ludwing, 60 % du temps
        if (u.isStateAffected(ETAT_RAGE) && this.isForOpponent() && this.isForOne() && t.length) {
            var lud = dansLeCombat(LUDWING);
            if (lud && lud !== u && Math.random() < RAGE_LUD) {
                journal('\\C[2]💢 ' + u.name() + ' perd le fil — c\'est ' + lud.name() + ' qui prend !\\C[0]');
                annonce(lud, '💢 C\'est lui qui prend !', '#ff4040');
                return t.map(function () { return lud; });
            }
        }
        return t;
    };

    // ── ce que font les compétences de son kit ──────────────────────────────
    var _applique = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        var u = this.subject(), it = this.item();
        _applique.call(this, target);
        if (!enCombat() || !it) { return; }
        if (!estVesper(u)) {
            // ☯ 2A : chaque esquive déclenche une contre-attaque — le coup qu'elle a
            // esquivé (EVA du Flow), ou que la Zone a dévié (note de l'état 87).
            // Une par action ennemie : une rafale esquivée ne lance pas six contres.
            // Elle part quand l'ennemi a fini (onAllActionsEnd) : queueForceAction
            // vide les résultats, l'« esquive » n'aurait pas le temps de s'afficher.
            if (estVesper(target)) {
                var r = target.result(), devie = target._flowEsquive;
                target._flowEsquive = null;
                var esquive = !!devie || !!(r && (r.evaded || r.missed));
                if (esquive && !this._contreFlow && target.isStateAffected(ETAT_FLOW) && u && u.isEnemy && u.isEnemy()) {
                    this._contreFlow = true;
                    target._contreEnAttente = u;
                }
            }
            return;
        }
        // ⚔ un ultime d'arme (Tranche-Néant) dit sous quelle forme il part, une fois par action
        if (tag(it, 'ArtArme') && tag(it, 'Ulti') && !this._formeDite) {
            this._formeDite = true;
            annonce(u, '⚔ ' + it.name + ' · ' + forme(u, it), '#ffd080');
        }
        // 🩸 Berserker : la Rage devient le Berserker (elle ne vise plus ludwing)
        if (tag(it, 'BerserkerVesper')) {
            u.removeState(ETAT_RAGE);
            effetFort([180, 0, 0, 200], 'Earth4');
        }
        // ✶ Sang Perçant / Supernova consomment la Convergence
        if ((tag(it, 'SangPercant') || tag(it, 'Supernova')) && u.isStateAffected(ETAT_CONV)) { u._convergenceUsee = true; }
        // l'Arme de Sang rend tout : le compte repart à zéro
        if (tag(it, 'ArmeDeSang')) { u._armeDeSangUsee = true; }
    };
    var _finAction = Game_Battler.prototype.onAllActionsEnd;
    Game_Battler.prototype.onAllActionsEnd = function () {
        _finAction.call(this);
        // ☯ l'ennemi a fini : la contre-attaque du Flow part
        var v = enCombat() && this.isEnemy && this.isEnemy() ? dansLeCombat(VESPER) : null;
        if (v && v._contreEnAttente === this) {
            v._contreEnAttente = null;
            if (v.isStateAffected(ETAT_FLOW) && v.canMove() && this.isAlive()) {
                // sans lui coûter les actions qu'elle avait prévues (LesInteractions)
                // ☯ L4 — c'est une riposte du contre-temps (LeMouvement) : son flux monte, la 3ᵉ est un geste juste
                if (window.LeMouvement && LeMouvement.riposteForcee) { LeMouvement.riposteForcee(v, CONTRE); }
                if (window.Interactions) { Interactions.forcer(v, CONTRE, this.index()); }
                else if (BattleManager.queueForceAction) { BattleManager.queueForceAction(v, CONTRE, this); }
            }
        }
        if (!estVesper(this)) { return; }
        if (this._convergenceUsee) { this._convergenceUsee = false; this.removeState(ETAT_CONV); }
        if (this._armeDeSangUsee) {
            this._armeDeSangUsee = false;
            this._sangEncaisse = 0;
            journal('\\C[2]🩸 L\'Arme de Sang retombe en poussière rouge.\\C[0]');
            annonce(this, '🩸 L\'Arme de Sang retombe', '#b0b0b0');
        }
    };

    // ── la fin des états : Épuisement du Flow, contrecoup du Berserker ──────
    var _retire = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function (id) {
        var avait = this.isStateAffected(id);
        _retire.call(this, id);
        if (!avait || !estVesper(this) || !enCombat() || this.isStateAffected(id)) { return; }
        if (id === ETAT_FLOW && this.isAlive()) { poser(this, ETAT_EPUISE); }
        if (id === ETAT_BERSERK && this.isAlive()) {
            var perte = Math.min(Math.floor(this.mhp * CONTRECOUP), this.hp - 1);
            if (perte > 0) { _gainHp.call(this, -perte); }
            this._colere = 0;
            poser(this, ETOURDI);
            journal('\\C[8]🩸 Le Berserker la lâche : −' + Math.max(0, perte) + ' PV, elle vacille.\\C[0]');
            annonce(this, '🩸 Le Berserker la lâche', '#b0b0b0');
        }
        if (id === ETAT_RAGE && !this.isStateAffected(ETAT_BERSERK)) { this._colere = 0; }
    };

    // ── la Garde boit, tour après tour ; quitter la Garde, c'est tout oublier
    function finDeTour(a) {
        if (!a || !a.isAlive() || !enCombat()) { return; }
        var t = $gameTroop.turnCount();
        if (a._tourVu === t) { return; }          // YEP rappelle endTurn : une fois par tour
        a._tourVu = t;
        if (style(a) !== 'garde') { a._adapt = {}; a._gardeTours = 0; return; }
        if (a.isStateAffected(ETAT_BRISEE)) { return; }
        var n = a._gardeTours || 0, pct = DRAIN.length ? DRAIN[Math.min(n, DRAIN.length - 1)] : 0;
        a._gardeTours = n + 1;
        var pm = Math.ceil(a.mmp * pct), pt = Math.ceil(a.maxTp() * pct);
        a.gainMp(-pm); a.gainTp(-pt);
        journal('\\C[6]🛡 La Garde boit : −' + pm + ' PM, −' + pt + ' PT.\\C[0]');
        annonce(a, '🛡 La Garde boit · −' + pm + ' PM', '#a0d0ff');
        if (a.mp <= 0 && a.tp <= 0) {
            a._adapt = {}; a._gardeTours = 0;
            poser(a, ETAT_BRISEE);
            effetFort([120, 120, 160, 160], 'Crash');
            journal('\\C[8]💔 Plus rien à boire : l\'armure de ' + a.name() + ' cède.\\C[0]');
            annonce(a, '💔 L\'armure cède', '#ff8080');
        }
    }
    // Après le décompte des états de MV : l'Armure Brisée posée ici dure ses deux tours pleins.
    var _finTour = BattleManager.endTurn;
    BattleManager.endTurn = function () {
        var deja = this._enteredEndPhase;          // YEP rappelle endTurn ; seul le premier appel ferme le tour
        _finTour.call(this);
        if (deja || this._enteredEndPhase === false) { return; }
        try { finDeTour(dansLeCombat(VESPER)); } catch (e) { console.error('LesStylesDeVesper', e); }
    };

    // ── chaque combat repart de zéro ────────────────────────────────────────
    function remettre(a) {
        if (!a) { return; }
        a._colere = 0; a._adapt = {}; a._gardeTours = 0; a._sangEncaisse = 0; a._tourVu = null;
        a._flowEsquive = null; a._contreEnAttente = null; a._convergenceUsee = false; a._armeDeSangUsee = false;
    }
    var _debut = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function () {
        _debut.apply(this, arguments);
        if (estVesper(this)) { remettre(this); }
    };

    // ── à l'écran : la Colère, l'adaptation, le sang encaissé ───────────────
    function Window_Colere() { this.initialize.apply(this, arguments); }
    Window_Colere.prototype = Object.create(Window_Base.prototype);
    Window_Colere.prototype.constructor = Window_Colere;
    Window_Colere.prototype.initialize = function (y) {
        Window_Base.prototype.initialize.call(this, 0, y, 420, this.fittingHeight(1));
        this.opacity = 0; this._cle = ''; this.refresh();
    };
    Window_Colere.prototype.texte = function (a) {
        var t = '💢 ' + Math.round(colere(a));
        if (a.isStateAffected(ETAT_RAGE)) { t += ' · RAGE'; }
        if (a.isStateAffected(ETAT_BERSERK)) { t += ' · BERSERKER'; }
        if (a.isStateAffected(ETAT_FLOW)) { t += ' · ☯ FLOW'; }
        if (style(a) === 'garde') {
            var ad = a._adapt || {}, ks = Object.keys(ad).filter(function (k) { return ad[k] > 0; });
            if (ks.length) { t += ' · ⚙ ' + ks.map(function (k) { return nomElement(Number(k)) + ' −' + Math.round(ad[k] * 100) + '%'; }).join(', '); }
            if ((a._sangEncaisse || 0) > 0) { t += ' · 🩸 ' + Math.floor(a._sangEncaisse); }
        }
        return t;
    };
    Window_Colere.prototype.refresh = function () {
        this.contents.clear();
        var a = vesper();
        if (!a || $gameParty.battleMembers().indexOf(a) < 0) { return; }
        var la = this.contentsWidth();
        this.contents.fillRect(0, 10, Math.floor(la * 0.35), 14, 'rgba(0,0,0,0.55)');
        this.contents.gradientFillRect(0, 10, Math.floor(la * 0.35 * colere(a) / 100), 14, '#7a1a00', '#ff7a1a', false);
        this.contents.fontSize = 16;
        this.contents.outlineColor = 'rgba(0,0,0,0.9)';
        this.changeTextColor('#ffffff');
        this.drawText(this.texte(a), 4, 0, la - 8, 'left');
        this.resetTextColor();
    };
    Window_Colere.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        var a = vesper();
        var cle = a ? this.texte(a) + '/' + a.mhp : '';
        if (cle !== this._cle) { this._cle = cle; this.refresh(); }
    };
    var _fenetres = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function () {
        _fenetres.call(this);
        var y = this._fenetrePacte ? this._fenetrePacte.y - 34 : (this._statusWindow ? this._statusWindow.y - 90 : 300);
        this._fenetreColere = new Window_Colere(y);
        this.addChild(this._fenetreColere);
    };

    // ── de quoi le mesurer sans deviner ─────────────────────────────────────
    window.StylesVesper = {
        style: function () { return style(vesper()); },
        colere: function () { var a = vesper(); return a ? colere(a) : 0; },
        /** Pour les interactions : n de Colère (× son Style), la Rage à 100. */
        gagnerColere: function (b, n) { if (estVesper(b)) { gagnerColere(b, n); } },
        poserColere: function (n) { var a = vesper(); if (a) { a._colere = Math.max(0, Math.min(100, n)); if (n >= 100) { entrerEnRage(a); } } },
        adaptation: function () { var a = vesper(); return a ? JSON.parse(JSON.stringify(a._adapt || {})) : {}; },
        sangEncaisse: function () { var a = vesper(); return a ? (a._sangEncaisse || 0) : 0; },
        dansLeKit: function (skillId) { var a = vesper(); return a ? dansLeKit(a, $dataSkills[skillId]) : false; },
        kit: function () {
            var a = vesper(); if (!a) { return []; }
            return a.skills().filter(function (s) { return dansLeKit(a, s); }).map(function (s) { return s.id; });
        },
        etats: { rage: ETAT_RAGE, flow: ETAT_FLOW, epuisement: ETAT_EPUISE, berserker: ETAT_BERSERK, brisee: ETAT_BRISEE, convergence: ETAT_CONV },
        typeArts: TYPE_ARTS
    };
})();
