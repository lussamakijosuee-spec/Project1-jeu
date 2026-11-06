//=============================================================================
// FusionElements.js — v2.1  ·  Les réactions élémentaires
// RPG Maker MV   ·   pour JOKO   ·   « comme sur Genshin, des combos élémentaires »
//=============================================================================
/*:
 * @plugindesc v2.1 ■ Les RÉACTIONS élémentaires, comme dans Genshin : un coup laisse son élément sur l'ennemi (3 tours) ; un autre élément le fait RÉAGIR — Vapeur, Fonte, Surcharge, Lave, Givre, Électrocharge, Plante, Supraconduction, Métal, Cristallisation, Crépuscule, Dispersion.
 * @author pour JOKO
 *
 * @param === L'AURA ===
 * @default
 *
 * @param etatsAura
 * @text Les états des auras (élément: état)
 * @desc Un coup de cet élément laisse cet état sur la cible.
 * @default 8:266, 9:267, 10:268, 11:269, 12:270, 13:271, 14:272, 15:273
 *
 * @param toursAura
 * @text Combien de fins de tour l'aura tient
 * @desc 3 : le temps que le deuxième héros joue (2 avant la v2.1).
 * @type number
 * @min 1
 * @default 3
 *
 * @param ennemisPosent
 * @text Les ennemis posent-ils des auras ?
 * @desc Comme dans Genshin : leurs coups d'élément sur les héros posent une aura, et les font réagir.
 * @type boolean
 * @default false
 *
 * @param switchId
 * @text Interrupteur requis (0 = toujours)
 * @desc Si > 0, les réactions ne jouent que quand cet interrupteur est ON (la « Porte de Fusion » de PortesProgression, par exemple).
 * @type switch
 * @default 0
 *
 * @param === LES RÉACTIONS ===
 * @default
 *
 * @param reactions
 * @text Les paires (élément+élément: réaction)
 * @desc Feu 8 · Eau 9 · Vent 10 · Terre 11 · Foudre 12 · Glace 13 · Lumière 14 · Ombre 15. Dans les deux sens.
 * @default 8+9: vapeur, 8+13: fonte, 8+12: surcharge, 8+11: lave, 9+13: givre, 9+12: electrocharge, 9+11: plante, 12+13: supraconduction, 11+12: metal, 11+13: cristallisation, 14+15: crepuscule, 10+8: dispersion, 10+9: dispersion, 10+13: dispersion, 10+12: dispersion
 *
 * @param vapeur
 * @text Vapeur : le coup ×
 * @default 1.5
 *
 * @param fonte
 * @text Fonte : le coup ×
 * @default 1.5
 *
 * @param surcharge
 * @text Surcharge : l'explosion (% du coup, sur les autres)
 * @type number
 * @default 50
 *
 * @param electrocharge
 * @text Électrocharge : à chaque fin de tour (% du coup)
 * @type number
 * @default 25
 *
 * @param toursElectro
 * @text Électrocharge : combien de tours
 * @type number
 * @default 2
 *
 * @param plante
 * @text Plante : le lanceur reprend (% du coup)
 * @type number
 * @default 15
 *
 * @param crepuscule
 * @text Crépuscule : le lanceur reprend (% du coup)
 * @type number
 * @default 10
 *
 * @param cristal
 * @text Cristallisation : le prochain coup reçu ×
 * @default 0.5
 *
 * @param souffle
 * @text Dispersion : le souffle sur les autres (% du coup)
 * @desc Un ennemi qui portait déjà une aura réagit avec l'élément dispersé, sur ce souffle. 0 : l'élément se pose seulement.
 * @type number
 * @default 25
 *
 * @param etatBrulure
 * @text État — Brûlure
 * @type state
 * @default 91
 *
 * @param etatAveugle
 * @text État — Aveuglé
 * @type state
 * @default 5
 *
 * @param etatParalysie
 * @text État — Paralysie
 * @type state
 * @default 136
 *
 * @param etatGele
 * @text État — Gelé (Givre)
 * @type state
 * @default 274
 *
 * @param etatSupra
 * @text État — Supraconduction (DÉF ×0,5)
 * @type state
 * @default 275
 *
 * @param etatElectro
 * @text État — Électrocharge
 * @type state
 * @default 276
 *
 * @param etatCristal
 * @text État — Cristal
 * @type state
 * @default 277
 *
 * @param === CE QUI SE VOIT ===
 * @default
 *
 * @param animations
 * @text Les animations (réaction: animation)
 * @default vapeur: 393, fonte: 67, surcharge: 166, lave: 397, givre: 72, electrocharge: 77, plante: 389, supraconduction: 429, metal: 64, cristallisation: 385, crepuscule: 125, dispersion: 92
 *
 * @param sons
 * @text Les sons (réaction: son)
 * @default vapeur: Fire2, fonte: Ice3, surcharge: Explosion1, lave: Fire3, givre: Ice4, electrocharge: Thunder3, plante: Heal2, supraconduction: Thunder6, metal: Paralyze2, cristallisation: Earth3, crepuscule: Darkness3, dispersion: Wind4
 *
 * @param flash
 * @text Un éclair d'écran à chaque réaction
 * @type boolean
 * @default true
 *
 * @param prevision
 * @text Au choix de la cible, dire la réaction
 * @desc L'aide (le nom de l'ennemi) dit son aura, et ce que ton coup va faire : « ◈ Feu → 💨 Vapeur ».
 * @type boolean
 * @default true
 *
 * @param marqueListe
 * @text Dans la liste des capacités, le signe de la réaction
 * @desc Une capacité qui ferait réagir une aura déjà posée porte son signe (💨, 🔥…) sur son icône.
 * @type boolean
 * @default true
 *
 * @param quiReagit
 * @text Quand une aura se pose, dire qui peut la faire réagir
 * @desc Au-dessus de l'ennemi : « ◈ Feu · Vesper, Korrah » — les héros qui ont de quoi la faire réagir.
 * @type boolean
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES RÉACTIONS ÉLÉMENTAIRES                                         JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  JOKO, le 2026-10-29 : « je voulais comme sur genshin des combo élémentaires
 *  qui donnait un effet », puis, sur la table : « Oui et modifier le plugin en
 *  vrai rework monstrueux ». Elle remplace la v1.0 (« les codes
 *  s'additionnent » : 16 paires fusionnaient, dont Feu + Feu, Eau + Vent =
 *  Lave, Feu + Foudre = Plante…). Ses 6 fusions gardent leur nom, et l'effet
 *  de sa table des esprits (ElementsVivants : la Vapeur ébouillante et
 *  aveugle, la Lave dévore, la Plante nourrit, le Givre saisit, le Métal
 *  paralyse, le Crépuscule voile et veille).
 *
 *  ◈ L'AURA — un coup qui blesse avec un élément (Feu, Eau, Vent, Terre,
 *    Foudre, Glace, Lumière, Ombre) laisse cet élément SUR la cible, avec son
 *    icône, 3 fins de tour (réglage toursAura). N'importe quel héros, n'importe quel art (une Parole, un
 *    mouvement, une rune qui part). Le même élément la rafraîchit ; un
 *    élément qui ne réagit pas la remplace.
 *  ✦ LA RÉACTION — un AUTRE élément qui la touche la fait réagir, et
 *    l'efface :
 *    💨 Vapeur (Feu + Eau)          le coup ×1,5, Brûlure et Aveuglé
 *    🔥 Fonte (Feu + Glace)         le coup ×1,5
 *    💥 Surcharge (Feu + Foudre)    l'explosion : 50 % du coup sur les autres
 *    🌋 Lave (Feu + Terre)          Brûlure, à coup sûr
 *    🧊 Givre (Eau + Glace)         gelé : il perd sa prochaine action
 *                                   (pas un boss — rang S ou à mécanique)
 *    ⚡ Électrocharge (Eau + Foudre) 25 % du coup à chaque fin de tour, 2 tours
 *    🌿 Plante (Eau + Terre)        le lanceur reprend 15 % du coup
 *    ❄ Supraconduction (Glace + Foudre)  DÉF −50 %, 2 tours
 *    ⚙ Métal (Terre + Foudre)       Paralysie
 *    💎 Cristallisation (Terre + Glace)  le prochain coup que reçoit le
 *                                   lanceur ÷2
 *    🌗 Crépuscule (Lumière + Ombre) Aveuglé, et le lanceur reprend 10 %
 *    🌪 Dispersion (Vent + Feu, Eau, Glace ou Foudre)  l'élément se répand
 *       sur tous les autres ennemis ; celui qui portait déjà une aura réagit
 *       avec lui, sur un souffle de 25 % du coup (réglage souffle, 0 : il se
 *       pose seulement).
 *  Une Fusion de LaParole (Vapeur, Lave…) est déjà une réaction : elle ne
 *  pose rien et ne réagit pas. Les ennemis ne posent pas d'aura (réglage).
 *  ✦ À DEUX (v2.1) — une attaque combinée (type Combo, ou <unison item
 *    actors>) porte ses deux éléments : s'ils réagissent ensemble, elle
 *    réagit à elle seule (Crépuscule : Ombre + Lumière ; Feu Attisé : Feu +
 *    Vent, qui répand le Feu). Sur une aura déjà posée, c'est celui de ses
 *    deux éléments qui réagit avec elle qui joue.
 *
 *  CE QUI SE VOIT — l'aura est une icône sur l'ennemi ; la réaction flotte
 *  au-dessus de lui (« 💨 VAPEUR ×1,5 »), avec son animation, son son, un
 *  éclair d'écran ; au choix de la cible, l'aide dit son aura et ce que ton
 *  coup va faire (« ◈ Feu → 💨 Vapeur »). Depuis la v2.1, une aura qui se
 *  pose dit qui peut la faire réagir (« ◈ Feu · Vesper, Korrah »), et dans la
 *  liste des capacités, celle qui ferait réagir une aura déjà posée porte
 *  le signe de la réaction sur son icône.
 *
 *  Script : Fusion.aura(combattant)        → l'élément de son aura (0 : aucune)
 *           Fusion.reaction(el1, el2)      → 'vapeur', 'fonte'… ('' : rien)
 *           Fusion.elementDe(action)       → l'élément qu'elle pose (0 : aucun)
 *           Fusion.compte()                → { vapeur: n, … } dans ce combat
 *           Fusion._eteint = true          coupe tout (pour un banc).
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('FusionElements');
    function nombre(k, d) { var v = parseFloat(String(P[k] === undefined ? '' : P[k]).replace(',', '.')); return isNaN(v) ? d : v; }
    function oui(k, d) { return P[k] === undefined || P[k] === '' ? d : String(P[k]) === 'true'; }
    function paires(k, d) {
        var o = {};
        String(P[k] === undefined || P[k] === '' ? d : P[k]).split(',').forEach(function (x) {
            var m = x.split(':'); if (m.length < 2) { return; }
            o[m[0].trim()] = m[1].trim();
        });
        return o;
    }

    var AURA = {}, AURA_ETATS = [];
    var brut = paires('etatsAura', '8:266, 9:267, 10:268, 11:269, 12:270, 13:271, 14:272, 15:273');
    Object.keys(brut).forEach(function (e) { AURA[+e] = +brut[e]; AURA_ETATS.push(+brut[e]); });
    var REACTIONS = {};
    var table = paires('reactions', '8+9: vapeur, 8+13: fonte, 8+12: surcharge, 8+11: lave, 9+13: givre, 9+12: electrocharge, 9+11: plante, 12+13: supraconduction, 11+12: metal, 11+13: cristallisation, 14+15: crepuscule, 10+8: dispersion, 10+9: dispersion, 10+13: dispersion, 10+12: dispersion');
    Object.keys(table).forEach(function (k) {
        var m = k.split('+'); if (m.length !== 2) { return; }
        REACTIONS[+m[0] + '+' + +m[1]] = table[k].toLowerCase(); REACTIONS[+m[1] + '+' + +m[0]] = table[k].toLowerCase();
    });
    var ENNEMIS = oui('ennemisPosent', false), SWITCH = nombre('switchId', 0);
    var MULT = { vapeur: nombre('vapeur', 1.5), fonte: nombre('fonte', 1.5) };
    var SURCHARGE = nombre('surcharge', 50) / 100, ELECTRO = nombre('electrocharge', 25) / 100, TOURS_EL = nombre('toursElectro', 2);
    var PLANTE = nombre('plante', 15) / 100, CREPUSCULE = nombre('crepuscule', 10) / 100, CRISTAL = nombre('cristal', 0.5);
    var SOUFFLE = nombre('souffle', 25) / 100;
    var BRULURE = nombre('etatBrulure', 91), AVEUGLE = nombre('etatAveugle', 5), PARALYSIE = nombre('etatParalysie', 136);
    var GELE = nombre('etatGele', 274), SUPRA = nombre('etatSupra', 275), ETAT_ELECTRO = nombre('etatElectro', 276), ETAT_CRISTAL = nombre('etatCristal', 277);
    var ANIMS = paires('animations', 'vapeur: 393, fonte: 67, surcharge: 166, lave: 397, givre: 72, electrocharge: 77, plante: 389, supraconduction: 429, metal: 64, cristallisation: 385, crepuscule: 125, dispersion: 92');
    var SONS = paires('sons', 'vapeur: Fire2, fonte: Ice3, surcharge: Explosion1, lave: Fire3, givre: Ice4, electrocharge: Thunder3, plante: Heal2, supraconduction: Thunder6, metal: Paralyze2, cristallisation: Earth3, crepuscule: Darkness3, dispersion: Wind4');
    var FLASH = oui('flash', true), PREVISION = oui('prevision', true);
    var TOURS_AURA = nombre('toursAura', 3), MARQUE_LISTE = oui('marqueListe', true), QUI_REAGIT = oui('quiReagit', true);

    // ce que chaque réaction montre
    var R = {
        vapeur:          { nom: 'Vapeur',          signe: '💨', couleur: '#eef4ff', flash: [230, 240, 255, 150] },
        fonte:           { nom: 'Fonte',           signe: '🔥', couleur: '#ffb070', flash: [255, 170, 110, 150] },
        surcharge:       { nom: 'Surcharge',       signe: '💥', couleur: '#ff7aa8', flash: [255, 110, 160, 170] },
        lave:            { nom: 'Lave',            signe: '🌋', couleur: '#ff8040', flash: [255, 120, 40, 150] },
        givre:           { nom: 'Givre',           signe: '🧊', couleur: '#a8e8ff', flash: [170, 230, 255, 160] },
        electrocharge:   { nom: 'Électrocharge',   signe: '⚡', couleur: '#c8a0ff', flash: [200, 160, 255, 150] },
        plante:          { nom: 'Plante',          signe: '🌿', couleur: '#90e070', flash: [140, 230, 110, 130] },
        supraconduction: { nom: 'Supraconduction', signe: '❄', couleur: '#b0c8ff', flash: [180, 200, 255, 150] },
        metal:           { nom: 'Métal',           signe: '⚙', couleur: '#d8d8e0', flash: [215, 215, 225, 140] },
        cristallisation: { nom: 'Cristallisation', signe: '💎', couleur: '#ffe090', flash: [255, 225, 140, 140] },
        crepuscule:      { nom: 'Crépuscule',      signe: '🌗', couleur: '#d8a0ff', flash: [200, 150, 255, 150] },
        dispersion:      { nom: 'Dispersion',      signe: '🌪', couleur: '#a0ffd0', flash: [160, 255, 210, 130] }
    };
    var compte = {};

    // ── outils ──────────────────────────────────────────────────────────────
    function actif() { return !window.Fusion._eteint && (SWITCH <= 0 || ($gameSwitches && $gameSwitches.value(SWITCH))); }
    function enCombat() { return !!($gameParty && $gameParty.inBattle()); }
    function fond(e) { return AURA[e] !== undefined; }
    function nomElement(e) { return ($dataSystem.elements[e] || '').trim().replace(/^(.)(.*)$/, function (t, a, b) { return a + b.toLowerCase(); }); }
    function chiffre(x) { return String(Math.round(x * 100) / 100).replace('.', ','); }
    function annonce(b, texte, couleur) {
        if (b && window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, texte, couleur || '#ffffff'); }
    }
    function tour() { return $gameTroop ? $gameTroop.turnCount() : 0; }
    function estBoss(b) {
        if (!b || !b.isEnemy || !b.isEnemy()) { return false; }
        var n = (b.enemy() && b.enemy().note) || '';
        return /<\s*Rang\s*:\s*S\s*>/i.test(n) || /<\s*(Meca\w*|Phases)\s*:/i.test(n);
    }

    /** L'élément que pose une action (0 : aucun). Une Fusion de LaParole est déjà une réaction. */
    function elementDe(action) {
        var it = action && action.item && action.item();
        if (!it || !it.damage) { return 0; }
        if (action._paroleElements && action._paroleElements.some(function (e) { return e >= 16; })) { return 0; }
        var e = it.damage.elementId;
        if (e === -1 && action.subject() && action.subject().attackElements) {
            e = action.subject().attackElements().filter(fond)[0] || 0;
        }
        if (fond(e)) { return e; }
        return (it.multipleElements || []).filter(fond)[0] || 0;
    }
    /** Une attaque à deux (le type Combo, ou DoubleX Unison) : elle porte ses deux éléments. */
    function estCombo(it) { return !!it && (it.stypeId === 25 || /<\s*unison item actors\s*:/i.test(it.note || '')); }
    /** Les éléments fondamentaux d'une attaque combinée, dans l'ordre de la fiche (le sien, puis les autres). */
    function elementsDuCombo(action) {
        var it = action && action.item && action.item();
        if (!estCombo(it) || !it.damage) { return []; }
        var l = [it.damage.elementId].concat(it.multipleElements || []).filter(fond);
        return l.filter(function (e, i) { return l.indexOf(e) === i; });
    }
    function aura(b) {
        if (!b) { return 0; }
        var e = Object.keys(AURA).filter(function (k) { return b.isStateAffected(AURA[k]); })[0];
        return e ? +e : 0;
    }
    function reaction(a, b) { return (a && b && a !== b && REACTIONS[a + '+' + b]) || ''; }
    /** Qui pose sur qui : un héros sur un ennemi ; un ennemi sur un héros si le réglage le veut. */
    function peutPoser(u, t) {
        if (!u || !t || !u.isActor || !t.isActor) { return false; }
        if (u.isActor() && t.isEnemy()) { return true; }
        return ENNEMIS && u.isEnemy() && t.isActor();
    }
    /** Ce que ce coup ferait sur cette cible : { el, aura, r }. */
    function prevoir(action, t) {
        if (!actif()) { return null; }
        var u = action && action.subject();
        if (!peutPoser(u, t)) { return null; }
        var el = elementDe(action);
        if (!el) { return null; }
        var a = aura(t), deux = elementsDuCombo(action);
        if (deux.length >= 2) {
            // à deux : sur une aura, celui des deux éléments qui réagit avec elle ; sans aura, l'un sur l'autre
            if (a) {
                var qui = deux.filter(function (e) { return reaction(a, e); })[0];
                return qui ? { el: qui, aura: a, r: reaction(a, qui) } : { el: deux[deux.length - 1], aura: a, r: '' };
            }
            var r2 = reaction(deux[0], deux[1]);
            return r2 ? { el: deux[1], aura: deux[0], r: r2, aDeux: true } : { el: deux[deux.length - 1], aura: 0, r: '' };
        }
        return { el: el, aura: a, r: reaction(a, el) };
    }
    /** Les héros qui ont de quoi faire réagir cette aura : une capacité de dégâts, contre l'ennemi, d'un élément qui réagit. */
    function quiPeutReagir(a) {
        if (!a) { return []; }
        return $gameParty.battleMembers().filter(function (h) {
            if (!h.isAlive() || !h.canMove()) { return false; }
            var ids = h.usableSkills().map(function (s) { return s.id; });
            if (h.canAttack && h.canAttack()) { ids.push(h.attackSkillId()); }
            return ids.some(function (id) {
                var s = $dataSkills[id];
                if (!s || !s.damage || [1, 5].indexOf(s.damage.type) < 0 || estCombo(s)) { return false; }
                var act = new Game_Action(h); act.setSkill(id);
                if (!act.isForOpponent()) { return false; }
                var e = elementDe(act);
                return e && reaction(a, e);
            });
        }).map(function (h) { return h.name(); });
    }

    // un état posé hors du chemin d'un coup (CLAUDE.md, §7) : sans le refus d'un état retiré dans la même action
    function poserEtat(b, id, tours) {
        if (!b || !$dataStates[id] || !b.isAlive()) { return; }
        if (!b.isStateAffected(id)) { b.addNewState(id); }
        b.resetStateCounts(id);
        if (tours) { b._stateTurns[id] = tours; }
        b.refresh();
    }
    function oterEtat(b, id) { if (b && b.isStateAffected(id)) { b.eraseState(id); b.refresh(); } }
    function poserAura(b, el) {
        AURA_ETATS.forEach(function (id) { if (id !== AURA[el]) { oterEtat(b, id); } });
        poserEtat(b, AURA[el], TOURS_AURA);
    }
    function oterAura(b) { AURA_ETATS.forEach(function (id) { oterEtat(b, id); }); }
    /** Un état ordinaire (Brûlure, Aveuglé, Paralysie) : il respecte les résistances de la cible. */
    function infliger(b, id) { if (b && b.isAlive() && $dataStates[id]) { b.addState(id); } }
    function blesser(b, v) {
        v = Math.max(1, Math.round(v));
        if (!b || !b.isAlive()) { return 0; }
        b.clearResult(); b.gainHp(-v); b.startDamagePopup();
        if (b.isDead()) { b.performCollapse(); }
        return v;
    }
    function soigner(b, v) {
        v = Math.round(v);
        if (!b || !b.isAlive() || v <= 0) { return; }
        b.clearResult(); b.gainHp(v); b.startDamagePopup();
    }
    function montrer(t, r, detail) {
        var d = R[r];
        annonce(t, d.signe + ' ' + d.nom.toUpperCase() + (detail ? ' · ' + detail : ''), d.couleur);
        if (ANIMS[r] && t.startAnimation) { t.startAnimation(+ANIMS[r], false, 0); }
        if (SONS[r]) { AudioManager.playSe({ name: SONS[r], volume: 90, pitch: 100, pan: 0 }); }
        if (FLASH && $gameScreen) { $gameScreen.startFlash(d.flash, 18); }
        compte[r] = (compte[r] || 0) + 1;
    }
    /** Il perd sa prochaine action : celle de ce tour s'il n'a pas encore agi, sinon celle du suivant. */
    function geler(t) {
        var l = BattleManager._actionBattlers || [], i = l.indexOf(t);
        if (i >= 0) { l.splice(i, 1); t.clearActions(); poserEtat(t, GELE, 1); }
        else { t._gele = tour() + 1; poserEtat(t, GELE, 2); }
    }
    var _ordres = BattleManager.makeActionOrders;
    BattleManager.makeActionOrders = function () {
        _ordres.call(this);
        var n = tour();
        this._actionBattlers = (this._actionBattlers || []).filter(function (b) {
            if (b && b._gele && b._gele === n) { b._gele = 0; b.clearActions(); return false; }
            return true;
        });
    };

    // ── la réaction ─────────────────────────────────────────────────────────
    /** u : qui la déclenche ; t : sur qui ; v : le coup (ou le souffle) qui la porte ; el : l'élément qui arrive. */
    function reagir(u, t, r, v, el, avant) {
        oterAura(t);
        switch (r) {
            case 'vapeur':
                montrer(t, r, '×' + chiffre(MULT.vapeur));
                infliger(t, BRULURE); infliger(t, AVEUGLE);
                break;
            case 'fonte':
                montrer(t, r, '×' + chiffre(MULT.fonte));
                break;
            case 'surcharge':
                montrer(t, r, 'l\'explosion');
                t.friendsUnit().aliveMembers().forEach(function (o) { if (o !== t) { blesser(o, v * SURCHARGE); } });
                break;
            case 'lave':
                montrer(t, r, 'Brûlure');
                infliger(t, BRULURE);                    // déjà brûlé : addState la rafraîchit (la retirer d'abord la perdrait)
                break;
            case 'givre':
                if (estBoss(t)) { montrer(t, r, 'il résiste'); break; }
                montrer(t, r, 'gelé');
                geler(t);
                break;
            case 'electrocharge':
                montrer(t, r, TOURS_EL + ' tours');
                t._electro = { v: Math.max(1, Math.round(v * ELECTRO)), tours: TOURS_EL };
                poserEtat(t, ETAT_ELECTRO, TOURS_EL);
                break;
            case 'plante':
                montrer(t, r, '+' + Math.round(v * PLANTE) + ' PV');
                soigner(u, v * PLANTE);
                break;
            case 'supraconduction':
                montrer(t, r, 'DÉF −50 %');
                poserEtat(t, SUPRA);
                break;
            case 'metal':
                montrer(t, r, 'Paralysie');
                infliger(t, PARALYSIE);
                break;
            case 'cristallisation':
                montrer(t, r, 'bouclier');
                if (u) { u._cristal = true; poserEtat(u, ETAT_CRISTAL); annonce(u, '💎 Cristal', R.cristallisation.couleur); }
                break;
            case 'crepuscule':
                montrer(t, r, 'Aveuglé');
                infliger(t, AVEUGLE); soigner(u, v * CREPUSCULE);
                break;
            case 'dispersion':
                montrer(t, r, nomElement(el === 10 ? avant : el));
                disperser(u, t, el === 10 ? avant : el, v);
                break;
        }
    }
    /** Le Vent répand l'élément sur les autres : qui portait déjà une aura réagit, sur le souffle. */
    function disperser(u, t, el, v) {
        if (!fond(el) || el === 10) { return; }
        t.friendsUnit().aliveMembers().forEach(function (o) {
            if (o === t) { return; }
            var a = aura(o), r2 = reaction(a, el);
            if (r2 && r2 !== 'dispersion') {
                var s = v * SOUFFLE * (MULT[r2] || 1);
                if (s > 0) { s = blesser(o, s); }
                reagir(u, o, r2, s, el, a);
            } else {
                poserAura(o, el);
            }
        });
    }

    // ── le coup : poser l'aura, ou réagir ───────────────────────────────────
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        var plan = enCombat() ? prevoir(this, target) : null;
        this._reactionSur = plan && plan.r ? { cible: target, r: plan.r } : null;
        _apply.call(this, target);
        this._reactionSur = null;
        var res = target && target.result();
        if (!plan || !res || !res.isHit() || !(res.hpDamage > 0)) { return; }
        try {
            if (plan.r) {
                if (plan.aDeux) { annonce(this.subject(), '✦ À deux : ' + nomElement(plan.aura) + ' + ' + nomElement(plan.el), R[plan.r].couleur); }
                reagir(this.subject(), target, plan.r, res.hpDamage, plan.el, plan.aura);
            } else {
                var neuve = aura(target) !== plan.el;
                poserAura(target, plan.el);
                if (neuve && QUI_REAGIT && target.isAlive()) {
                    var noms = quiPeutReagir(plan.el);
                    annonce(target, '◈ ' + nomElement(plan.el) + (noms.length ? ' · ' + noms.join(', ') : ''), '#c8c8d0');
                }
            }
        } catch (e) { console.error('FusionElements', e); }
    };

    var _valeur = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _valeur.call(this, target, critical);
        // Vapeur, Fonte : le coup qui réagit frappe plus fort
        var s = this._reactionSur;
        if (v > 0 && s && s.cible === target && MULT[s.r]) { v = Math.round(v * MULT[s.r]); }
        // le cristal tient le prochain coup
        if (v > 0 && target && target._cristal && enCombat() && !this.isRecover()) {
            target._cristal = false; oterEtat(target, ETAT_CRISTAL);
            v = Math.round(v * CRISTAL);
            annonce(target, '💎 Le cristal tient', R.cristallisation.couleur);
        }
        return v;
    };

    // ── la fin du tour : l'Électrocharge ────────────────────────────────────
    var _vu = -1;
    function finDeTour() {
        var n = tour();
        if (_vu === n) { return; }
        _vu = n;
        $gameTroop.members().concat($gameParty.battleMembers()).forEach(function (b) {
            var e = b._electro;
            if (!e) { return; }
            if (!b.isAlive()) { b._electro = null; return; }
            var v = blesser(b, e.v);
            annonce(b, '⚡ Électrocharge · −' + v, R.electrocharge.couleur);
            if (--e.tours <= 0) { b._electro = null; oterEtat(b, ETAT_ELECTRO); }
        });
    }
    var _finTour = BattleManager.endTurn;
    BattleManager.endTurn = function () {
        _finTour.call(this);
        try { if (enCombat()) { finDeTour(); } } catch (e) { console.error('FusionElements', e); }
    };

    // ── chaque combat repart de zéro ────────────────────────────────────────
    var _debut = BattleManager.setup;
    BattleManager.setup = function () {
        _debut.apply(this, arguments);
        compte = {}; _vu = -1;
    };
    var _debutCombattant = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function () {
        _debutCombattant.apply(this, arguments);
        this._electro = null; this._cristal = false; this._gele = 0;
    };

    // ── au choix de la cible : son aura, et ce que ton coup va faire ────────
    var _dessine = Window_Help.prototype.drawBattler;
    Window_Help.prototype.drawBattler = function (battler) {
        _dessine.call(this, battler);
        if (!PREVISION || !battler || !enCombat()) { return; }
        var action = BattleManager.inputtingAction && BattleManager.inputtingAction();
        var p = action ? prevoir(action, battler) : null;
        var a = aura(battler);
        if (!p && !a) { return; }
        var texte = (a ? '◈ ' + nomElement(a) : '') + (p ? (p.r ? ' → ' + R[p.r].signe + ' ' + R[p.r].nom : ' → ◈ ' + nomElement(p.el)) : '');
        this.contents.fontSize = 18;
        this.changeTextColor(p && p.r ? R[p.r].couleur : '#c8c8d0');
        this.drawText(texte.trim(), 0, 0, this.contents.width - 8, 'right');
        this.resetFontSettings();
    };

    // ── dans la liste des capacités : le signe de la réaction sur l'icône ───
    /** La réaction que cette capacité ferait sur l'un des ennemis vivants ('' : aucune). */
    function reactionDansLaListe(h, s) {
        if (!s || !s.damage || [1, 5].indexOf(s.damage.type) < 0) { return ''; }
        var act = new Game_Action(h); act.setSkill(s.id);
        if (!act.isForOpponent()) { return ''; }
        var l = $gameTroop.aliveMembers();
        for (var i = 0; i < l.length; i++) { var p = prevoir(act, l[i]); if (p && p.r) { return p.r; } }
        return '';
    }
    var _ligneCapacite = Window_SkillList.prototype.drawItem;
    Window_SkillList.prototype.drawItem = function (index) {
        _ligneCapacite.call(this, index);
        if (!MARQUE_LISTE || !enCombat() || !actif()) { return; }
        var s = this._data && this._data[index], h = this._actor;
        if (!s || !h || !h.isActor || !h.isActor()) { return; }
        var r = '';
        try { r = reactionDansLaListe(h, s); } catch (e) { r = ''; }
        if (!r) { return; }
        // en haut à droite de l'icône (le ★ de MaitriseDesCompetences est en bas à gauche, le « ×2 » des familles près du coût)
        var rect = this.itemRect(index), fs = this.contents.fontSize;
        this.contents.fontSize = 15;
        this.changeTextColor(R[r].couleur);
        this.contents.drawText(R[r].signe, rect.x + 20, rect.y, 22, 18, 'left');
        this.contents.fontSize = fs;
        this.resetTextColor();
    };

    // ── de quoi le mesurer sans deviner ─────────────────────────────────────
    window.Fusion = {
        aura: aura,
        reaction: reaction,
        elementDe: elementDe,
        prevoir: prevoir,
        quiPeutReagir: quiPeutReagir,
        reactionDansLaListe: reactionDansLaListe,
        compte: function () { return JSON.parse(JSON.stringify(compte)); },
        etats: { aura: AURA, gele: GELE, supra: SUPRA, electro: ETAT_ELECTRO, cristal: ETAT_CRISTAL },
        // l'ancienne API (v1.0) : il n'y a plus d'élément « en suspens dans l'air » ici — c'est LaParole qui le tient
        enSuspens: function () { return 0; },
        _eteint: false
    };
})();
