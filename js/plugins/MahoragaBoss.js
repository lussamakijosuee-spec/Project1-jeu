//=============================================================================
// MahoragaBoss.js — v3.0
// Kevératus Vultric : la Roue des trois arts, et la Bête.
//=============================================================================
/*:
 * @target MV
 * @plugindesc v3.0 ■ Kevératus Vultric (<Mahoraga>) : la Roue s'adapte aux
 * trois arts — chaque art qui le touche tourne d'un cran ; adapté, il répond.
 * Sous 50 %, la Bête : deux actions par tour, la Roue tourne plus vite.
 * @author pour JOKO
 *
 * @param crans
 * @text La Roue : dégâts reçus à chaque cran
 * @default 1, 0.7, 0.4, 0.1
 * @desc Le premier coup d'un art, puis le 2e, le 3e… Le dernier cran = « ADAPTÉ » : il répond.
 *
 * @param cransBete
 * @text La Roue de la Bête : dégâts reçus à chaque cran
 * @default 1, 0.5, 0.1
 * @desc Sous le seuil de la Bête, elle s'adapte plus vite.
 *
 * @param seuilBete
 * @text La Bête sous (% de ses PV)
 * @type number
 * @min 1
 * @max 99
 * @default 50
 *
 * @param actionsBete
 * @text La Bête : actions par tour
 * @type number
 * @min 1
 * @default 2
 *
 * @param reponse
 * @text Sa Réponse (compétence)
 * @type skill
 * @default 1325
 * @desc Ce qu'il lance sur celui qui le frappe avec un art auquel il est adapté.
 *
 * @param rupture
 * @text Briser son élan : × le seuil de rupture des boss
 * @default 3
 * @desc ScenesDeBoss : pendant sa Charge, il faut lui faire (seuil × ceci) % de ses PV max pour que Déchaîné n'ait pas lieu. 0 = insécable.
 *
 * @param traque
 * @text État de la Traque
 * @type state
 * @default 278
 * @desc Ses coups « Chasse » vont d'abord sur qui le porte.
 *
 * @param sonRoue
 * @text Son — la Roue tourne
 * @type file
 * @dir audio/se
 * @require 1
 * @default devine-wheel-adapting
 *
 * @param sonAdapte
 * @text Son — adapté
 * @type file
 * @dir audio/se
 * @require 1
 * @default mahoraga-devine-wheel-adapting-sound
 *
 * @param sonBete
 * @text Son — la Bête
 * @type file
 * @dir audio/se
 * @require 1
 * @default Monster5
 *
 * @help
 * ============================================================================
 *  KEVÉRATUS VULTRIC — l'ancien chef des chasseurs
 * ============================================================================
 * JOKO (docs/EMPIRE_DU_CORPS.md) : « il s'adapte à n'importe quoi pour en
 * réduire les effets, afin de survivre » — « Dans le jeu, cela se traduit par
 * une baisse de dégâts à chaque fois qu'il est touché. » Puis (2026-11-03) :
 * Kevératus Vultric ; la Roue s'adapte aux trois arts ; à 50 %, la Bête ; un
 * jeu d'attaques neuf.
 *
 * UNE RÈGLE : LA ROUE
 *  Chaque art qui le touche tourne d'un cran (une fois par action) :
 *    Voies (le Mouvement), Paroles, Runes (l'Écrit) — les menus du combat.
 *  ×1, puis ×0,7, ×0,4, puis ADAPTÉ (×0,1) : il RÉPOND à qui l'a frappé avec
 *  cet art (sa Réponse), à chaque fois. Un art qu'il n'a pas vu de tout un
 *  tour perd un cran. Varier les arts, c'est la clé. Un objet, un coup sans
 *  art passent sans tourner la Roue.
 *
 * UNE BASCULE : LA BÊTE (sous 50 %)
 *  La Bible : « La Bête : l'instinct dévore la personne. » Il agit deux fois
 *  par tour, et sa Roue s'adapte en deux coups (×1, ×0,5, ADAPTÉ).
 *
 * SES COUPS (la base de données) : <Chasse> sur une compétence : elle va
 * sur le héros Traqué (l'état réglé), sinon sur le plus blessé.
 *
 * À L'ÉCRAN : la Roue au-dessus du combat (trois secteurs, un par art, qui se
 * remplissent), sa ligne dans la barre du boss, et ce qui se passe au-dessus
 * de lui (« ☸ Paroles ×0,7 », « ☸ ADAPTÉ : Voies »).
 *
 * Pour un banc : window.LaRoue (cran, mult, adapte, ligne, tourner…).
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('MahoragaBoss');
    function nombres(s, d) {
        return String(s || d).split(',').map(function (x) { return Number(x.trim()); }).filter(function (n) { return isFinite(n) && n >= 0; });
    }
    var CRANS = nombres(P.crans, '1, 0.7, 0.4, 0.1');
    var CRANS_BETE = nombres(P.cransBete, '1, 0.5, 0.1');
    var SEUIL_BETE = Number(P.seuilBete || 50) / 100;
    var ACTIONS_BETE = Number(P.actionsBete || 2);
    var REPONSE = Number(P.reponse || 1325);
    var TRAQUE = Number(P.traque || 278);
    var RUPTURE = P.rupture === undefined || P.rupture === '' ? 3 : Number(P.rupture);
    var SE_ROUE = String(P.sonRoue || 'devine-wheel-adapting');
    var SE_ADAPTE = String(P.sonAdapte || 'mahoraga-devine-wheel-adapting-sound');
    var SE_BETE = String(P.sonBete || 'Monster5');

    var ARTS = ['mouvement', 'parole', 'ecrit'];
    var NOMS = { mouvement: 'Voies', parole: 'Paroles', ecrit: 'Runes' };
    var COULEURS = { mouvement: '#b07cff', parole: '#5aa8ff', ecrit: '#ff7ad9' };

    var Roue = window.LaRoue = {};
    Roue.arts = ARTS;
    Roue.noms = NOMS;

    function son(nom, pitch) { if (nom) AudioManager.playSe({ name: nom, volume: 90, pitch: pitch || 100, pan: 0 }); }
    function annoncer(b, texte, couleur) { if (window.CombatTactique && CombatTactique.annoncer) CombatTactique.annoncer(b, texte, couleur); }
    function banniere(titre, sous, couleur) { if (window.MecaBoss && MecaBoss.banniere) MecaBoss.banniere(titre, sous, couleur); }
    function virgule(x) { return String(Math.round(x * 100) / 100).replace('.', ','); }

    // ── qui il est ──────────────────────────────────────────────────────────
    Game_BattlerBase.prototype.isMahoraga = function () { return false; };
    Game_Enemy.prototype.isMahoraga = function () { return !!(this.enemy() && this.enemy().meta.Mahoraga); };

    var _setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function (enemyId, x, y) {
        _setup.call(this, enemyId, x, y);
        if (this.isMahoraga()) {
            this._roue = { mouvement: 0, parole: 0, ecrit: 0 };
            this._roueVu = {};
            this._bete = false;
        }
    };

    // ── la Roue ─────────────────────────────────────────────────────────────
    Roue.crans = function (b) { return b && b._bete ? CRANS_BETE : CRANS; };
    Roue.max = function (b) { return Roue.crans(b).length - 1; };
    Roue.cran = function (b, a) { return b && b._roue ? Math.min(b._roue[a] || 0, Roue.max(b)) : 0; };
    Roue.mult = function (b, a) { return Roue.crans(b)[Roue.cran(b, a)]; };
    Roue.adapte = function (b, a) { return Roue.cran(b, a) >= Roue.max(b); };
    Roue.artDe = function (item) { return window.LesTroisArts && LesTroisArts.art ? LesTroisArts.art(item) : ''; };
    Roue.ligne = function (b) {
        return '☸ ' + ARTS.map(function (a) {
            return NOMS[a] + ' ' + (Roue.adapte(b, a) ? 'ADAPTÉ' : '×' + virgule(Roue.mult(b, a)));
        }).join(' · ') + (b._bete ? ' · LA BÊTE' : '');
    };
    Roue.boss = function () {
        return $gameTroop ? $gameTroop.members().filter(function (m) { return m.isMahoraga() && m.isAlive() && m._roue; })[0] || null : null;
    };

    // les dégâts qu'il reçoit d'un héros : × le cran de l'art
    var _degats = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _degats.call(this, target, critical);
        var s = this.subject();
        if (v <= 0 || !target || !target.isEnemy() || !target.isMahoraga() || !target._roue || !s || !s.isActor()) return v;
        var a = Roue.artDe(this.item());
        if (ARTS.indexOf(a) < 0) return v;
        // une estimation (l'IA, l'aide) ne tourne pas la Roue : seule l'action qui part
        if (BattleManager._action === this) BattleManager._roueCoup = { boss: target, art: a, qui: s, action: this };
        return Math.max(1, Math.floor(v * Roue.mult(target, a)));
    };

    // une fois par action : la Roue tourne quand l'action est finie (endAction),
    // ou, si elle n'y est pas passée, au début de la suivante ou en fin de tour
    function compter() {
        var c = BattleManager._roueCoup;
        BattleManager._roueCoup = null;
        if (c && c.boss && c.boss.isAlive() && $gameTroop.members().indexOf(c.boss) >= 0) Roue.tourner(c.boss, c.art, c.qui);
    }
    var _initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function () { _initMembers.call(this); this._roueCoup = null; };
    var _finAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        _finAction.call(this);
        compter();
        $gameTroop.members().forEach(function (b) { if (b.isMahoraga() && b._roue) Roue.bete(b); });
    };
    var _preparer = Game_Action.prototype.prepare;
    Game_Action.prototype.prepare = function () {
        var c = BattleManager._roueCoup;
        if (c && c.action !== this) compter();
        _preparer.call(this);
    };

    Roue.tourner = function (b, a, qui) {
        b._roueVu[a] = true;
        var avant = Roue.adapte(b, a);
        b._roue[a] = Math.min(Roue.max(b), (b._roue[a] || 0) + 1);
        b._roueTour = (b._roueTour || 0) + 1;
        if (!Roue.adapte(b, a)) {
            annoncer(b, '☸ ' + NOMS[a] + ' ×' + virgule(Roue.mult(b, a)), COULEURS[a]);
            son(SE_ROUE);
            return;
        }
        if (!avant) {
            annoncer(b, '☸ ADAPTÉ : ' + NOMS[a], '#ffffff');
            banniere('☸ ADAPTÉ · ' + NOMS[a].toUpperCase(), 'Ses ' + NOMS[a].toLowerCase() + ' ne lui font presque plus rien, et il répond. Change d\'art : ce qu\'il ne voit plus, il l\'oublie.', COULEURS[a]);
            son(SE_ADAPTE);
        } else {
            annoncer(b, '☸ ' + NOMS[a] + ' : il connaît', '#ffffff');
        }
        Roue.repondre(b, qui);
    };

    // sa Réponse, sur qui l'a frappé avec un art adapté (sans lui coûter son tour)
    Roue.repondre = function (b, qui) {
        if (!b.canMove() || !qui || !qui.isAlive() || !$dataSkills[REPONSE]) return;
        var i = qui.index();
        if (window.Interactions && Interactions.forcer) Interactions.forcer(b, REPONSE, i);
        else if (BattleManager.queueForceAction) BattleManager.queueForceAction(b, REPONSE, i);
    };

    // ce qu'il n'a pas vu de tout un tour, il l'oublie (un cran)
    var _finTour = BattleManager.endTurn;
    BattleManager.endTurn = function () {
        compter();
        _finTour.call(this);
        $gameTroop.members().forEach(function (b) {
            if (!b.isMahoraga() || !b._roue) return;
            ARTS.forEach(function (a) { if (!b._roueVu[a] && b._roue[a] > 0) b._roue[a]--; });
            b._roueVu = {};
        });
    };

    // ── « à n'importe quoi » : une gêne qu'on lui pose, il ne la subit qu'une fois
    // Une gêne : un état qui l'immobilise, le scelle ou l'affaiblit (restriction,
    // sceaux, paramètres ou précision en baisse). Pas la Brisure du bouclier
    // (règle de tout le jeu), ni sa Charge / Surcharge, ni ce qui n'est qu'une
    // marque (les auras des réactions, les cercles des runes, le Marqué).
    var EPARGNES = [207, 218, 1005, 213];
    Roue.gene = function (st) {
        if (!st || EPARGNES.indexOf(st.id) >= 0) return false;
        if (st.restriction > 0) return true;
        return (st.traits || []).some(function (t) {
            return (t.code === 21 && t.value < 1) || (t.code === 22 && t.value < 0) || (t.code >= 41 && t.code <= 44);
        });
    };
    var _etat = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        var st = $dataStates[stateId], qui = BattleManager._subject;
        if (this.isEnemy() && this.isMahoraga() && this._roue && Roue.gene(st) &&
            qui && qui.isActor && qui.isActor() && !this.isStateAffected(stateId)) {
            this._roueEtats = this._roueEtats || [];
            if (this._roueEtats.indexOf(stateId) >= 0) {
                annoncer(this, '☸ ' + st.name + ' : il connaît', '#ffffff');
                return;
            }
            this._roueEtats.push(stateId);
            annoncer(this, '☸ ' + st.name + ' : une fois', '#ffffff');
            son(SE_ROUE);
        }
        _etat.call(this, stateId);
    };

    // ── la Bête ─────────────────────────────────────────────────────────────
    Roue.bete = function (b) {
        if (b._bete || !b.isAlive() || b.hpRate() > SEUIL_BETE) return;
        b._bete = true;
        ARTS.forEach(function (a) { b._roue[a] = Math.min(b._roue[a] || 0, Roue.max(b)); });
        b.requestEffect('whiten');
        $gameScreen.startShake(8, 8, 40);
        son(SE_BETE, 70);
        annoncer(b, '☸ LA BÊTE', '#ff5a3d');
        banniere('☸ LA BÊTE', '« L\'instinct dévore la personne. » Il agit deux fois par tour, et sa Roue s\'adapte en deux coups.', '#ff5a3d');
    };
    var _fois = Game_Battler.prototype.makeActionTimes;
    Game_Enemy.prototype.makeActionTimes = function () {
        var n = _fois.call(this);
        return this.isMahoraga() && this._bete ? Math.max(ACTIONS_BETE, n) : n;
    };
    var _actions = Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions = function () {
        if (this.isMahoraga() && this._roue) Roue.bete(this);
        _actions.call(this);
        if (!this.isMahoraga() || !this._roue || this._actions.length < 2) return;
        // ses deux actions de la Bête sont choisies ensemble : une seule mise en
        // garde, une seule frappe annoncée par tour (sinon deux Déchaîné de suite)
        var vu = false, croc = this.enemy().actions.filter(function (a) { return $dataSkills[a.skillId] && $dataSkills[a.skillId].meta.Chasse; })[0];
        this._actions.forEach(function (act) {
            var it = act.item(), n = it && it.note || '';
            if (!/<\s*(Telegraphe|Apres\s*:)/i.test(n)) return;
            if (vu && croc) act.setSkill(croc.skillId);
            vu = true;
        });
    };

    // ── la Chasse : le Traqué d'abord, sinon le plus blessé ─────────────────
    Roue.proie = function () {
        var vivants = $gameParty.aliveMembers();
        if (!vivants.length) return null;
        var traque = vivants.filter(function (h) { return h.isStateAffected(TRAQUE); });
        if (traque.length) return traque[0];
        return vivants.slice().sort(function (x, y) { return x.hpRate() - y.hpRate(); })[0];
    };
    var _cibles = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function () {
        var s = this.subject(), item = this.item();
        if (s && s.isEnemy() && item && item.meta && item.meta.Chasse && this.isForOpponent() && this.isForOne() && !this._forcing) {
            var p = Roue.proie();
            if (p) return this.repeatTargets([p]);
        }
        return _cibles.call(this);
    };

    // ── la barre du boss (ScenesDeBoss) lit sa ligne ────────────────────────
    var MB = window.MecaBoss = window.MecaBoss || {};
    MB.defs = MB.defs || {};
    MB.table = MB.table || {};
    MB.defs.roue = {
        ligne: function (b) { return b._roue ? Roue.ligne(b) : ''; },
        // ses chaînes ont tenu trente ans : son élan est plus dur à briser
        rupture: function () { return RUPTURE > 0 ? RUPTURE : false; }
    };
    var _charge = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!_charge.call(this)) return false;
        if (!this._roueTable && window.$dataEnemies) {
            this._roueTable = true;
            $dataEnemies.forEach(function (e) {
                if (e && e.meta && e.meta.Mahoraga && !/<\s*MecaBoss\s*:/i.test(e.note || '') && !MB.table[e.id]) MB.table[e.id] = 'roue';
            });
        }
        return true;
    };

    // ── la Roue à l'écran ───────────────────────────────────────────────────
    function Sprite_Roue() { this.initialize.apply(this, arguments); }
    Sprite_Roue.prototype = Object.create(Sprite.prototype);
    Sprite_Roue.prototype.constructor = Sprite_Roue;
    window.Sprite_Roue = Sprite_Roue;
    var R = 38;

    // en haut à gauche : la barre du boss tient le haut du milieu, et dit la Roue
    // en toutes lettres ; ici, chaque secteur porte l'initiale de son art
    Sprite_Roue.prototype.initialize = function () {
        Sprite.prototype.initialize.call(this);
        this.x = R + 18; this.y = R + 26;
        this._disque = new Sprite(new Bitmap(R * 2 + 8, R * 2 + 8));
        this._disque.anchor.x = 0.5; this._disque.anchor.y = 0.5;
        this.addChild(this._disque);
        this._sig = ''; this._tourVu = 0; this._angle = 0;
        this.opacity = 0;
    };
    Sprite_Roue.prototype.update = function () {
        Sprite.prototype.update.call(this);
        var b = Roue.boss();
        this.visible = !!b;
        if (!b) return;
        if (this.opacity < 255) this.opacity += 17;
        // elle tourne d'un huitième à chaque cran, comme la roue de Mahoraga
        if ((b._roueTour || 0) !== this._tourVu) { this._tourVu = b._roueTour || 0; this._angle += Math.PI / 4; }
        this._disque.rotation += (this._angle - this._disque.rotation) * 0.15;
        var sig = ARTS.map(function (a) { return Roue.cran(b, a); }).join() + (b._bete ? 'B' : '');
        if (sig !== this._sig) { this._sig = sig; this.dessiner(b); }
    };
    Sprite_Roue.prototype.dessiner = function (b) {
        var d = this._disque.bitmap, c = d._context, o = R + 4, max = Roue.max(b);
        d.clear();
        c.save();
        c.beginPath(); c.arc(o, o, R, 0, Math.PI * 2); c.fillStyle = 'rgba(10,8,16,0.75)'; c.fill();
        ARTS.forEach(function (a, i) {
            var de = -Math.PI / 2 + i * Math.PI * 2 / 3, a2 = de + Math.PI * 2 / 3, n = Roue.cran(b, a);
            for (var k = 1; k <= max; k++) {
                if (k > n) continue;
                var r1 = 8 + (R - 10) * (k - 1) / max, r2 = 8 + (R - 10) * k / max;
                c.beginPath(); c.arc(o, o, r2, de + 0.05, a2 - 0.05); c.arc(o, o, r1, a2 - 0.05, de + 0.05, true); c.closePath();
                c.fillStyle = n >= max ? '#ffffff' : COULEURS[a]; c.globalAlpha = 0.5 + 0.5 * k / max; c.fill();
            }
            c.globalAlpha = 1;
            c.strokeStyle = COULEURS[a]; c.lineWidth = 2;
            c.beginPath(); c.arc(o, o, R - 1, de + 0.05, a2 - 0.05); c.stroke();
        });
        // les huit rayons de la roue
        c.strokeStyle = 'rgba(232,192,112,0.9)'; c.lineWidth = 2;
        for (var k = 0; k < 8; k++) {
            var t = k * Math.PI / 4;
            c.beginPath(); c.moveTo(o + Math.cos(t) * 6, o + Math.sin(t) * 6); c.lineTo(o + Math.cos(t) * (R + 3), o + Math.sin(t) * (R + 3)); c.stroke();
        }
        c.beginPath(); c.arc(o, o, 6, 0, Math.PI * 2); c.fillStyle = b._bete ? '#ff5a3d' : '#e8c070'; c.fill();
        // l'initiale de l'art au milieu de son secteur
        c.font = 'bold 13px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.lineWidth = 3; c.strokeStyle = 'rgba(0,0,0,0.9)';
        ARTS.forEach(function (a, i) {
            var m = -Math.PI / 2 + (i + 0.5) * Math.PI * 2 / 3, x = o + Math.cos(m) * (R * 0.6), y = o + Math.sin(m) * (R * 0.6);
            c.strokeText(NOMS[a][0], x, y);
            c.fillStyle = Roue.adapte(b, a) ? '#000000' : '#ffffff'; c.fillText(NOMS[a][0], x, y);
        });
        c.restore();
        d._setDirty();
    };

    var _haut = Spriteset_Battle.prototype.createUpperLayer;
    Spriteset_Battle.prototype.createUpperLayer = function () {
        _haut.call(this);
        if ($gameTroop.members().some(function (m) { return m.isMahoraga(); })) {
            this._roue = new Sprite_Roue();
            this.addChild(this._roue);
        }
    };
})();

//=============================================================================
// ▼ AMÉLIORATION ADDITIVE : KEV = RADAHN (armure gravitationnelle + météores)
//   Bloc autonome — ne modifie PAS la logique au-dessus. Cible <Radahn>.
//=============================================================================
(function () {
    'use strict';
    function isRadahn(b) {
        return b && b.isEnemy && b.isEnemy() && b.enemy() && b.enemy().meta && b.enemy().meta.Radahn;
    }
    // Armure gravitationnelle : il encaisse mieux tant qu'il est au-dessus de 50% PV.
    var _mdv = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, crit) {
        var v = _mdv.call(this, target, crit);
        if (v > 0 && isRadahn(target) && target.hpRate() > 0.5) v = Math.floor(v * 0.75);
        return v;
    };
    // Phase météores : annonce quand il passe sous 30% PV.
    // Avant, l'annonce était tout : la pluie ne tombait jamais, sauf si le
    // hasard de son IA tirait la compétence. Désormais ce qui s'annonce
    // tombe — au tour suivant, puis tous les METEORES_TOUS tours.
    var METEORES = 436;           // « Parole n°8 Pluie de Météores », déjà dans ses actions
    var METEORES_TOUS = 3;
    function connait(e, id) {
        return e.enemy().actions.some(function (a) { return a.skillId === id; }) && $dataSkills[id];
    }
    var _ma = Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions = function () {
        var t = $gameTroop ? $gameTroop.turnCount() : 0;
        // l'annonce ne promet que ce qu'il sait faire : sans la Pluie de Météores dans ses actions
        // (JOKO lui a donné un autre jeu le 2026-10-29), le ciel ne s'annonce pas
        if (isRadahn(this) && !this._radahnMeteor && this.hpRate() <= 0.30 && connait(this, METEORES)) {
            this._radahnMeteor = true;
            this._radahnProchain = t + 1;
            var sc = SceneManager._scene;
            if (sc && sc._logWindow) sc._logWindow.push('addText', "\\C[2]Kev s'élève dans le ciel… une PLUIE DE MÉTÉORES s'annonce !\\C[0]");
            if (window.MecaBoss) MecaBoss.banniere('☄ PLUIE DE MÉTÉORES', "Kev s'élève dans le ciel. Au prochain tour, le ciel tombe.", '#ff7040');
        }
        _ma.call(this);
        if (isRadahn(this) && this._radahnMeteor && t >= (this._radahnProchain || 0) &&
            connait(this, METEORES) && this._actions.length && this.canMove()) {
            this._actions[0].setSkill(METEORES);
            this._radahnProchain = t + METEORES_TOUS;
        }
    };
})();
