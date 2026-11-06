//=============================================================================
// LeChant.js — v1.0
// Un ennemi qui chante : sous 70 % de ses PV, il brise l'écran, et le combat
// devient le Theatrhythm de MOG — vos PV à vous, ses PV à lui. Puis il alterne.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Un ennemi qui chante (<Chant: partition>) : sous 70 % de
 * ses PV il brise l'écran, le combat passe au Theatrhythm (vos PV, les siens),
 * puis il alterne avec le combat normal tous les 3 tours.
 * @author pour JOKO
 *
 * @param seuil
 * @text Il chante la première fois sous (% de ses PV)
 * @type number
 * @min 1
 * @max 100
 * @default 70
 *
 * @param tours
 * @text Tours de combat normal entre deux chants
 * @type number
 * @min 1
 * @default 3
 *
 * @param vitesse
 * @text Vitesse des notes (si la partition n'en donne pas)
 * @type number
 * @min 1
 * @max 20
 * @default 6
 *
 * @param dureeSansPartition
 * @text Sans partition (introuvable) : le chant dure (secondes)
 * @type number
 * @min 5
 * @default 60
 * @desc Avec une partition, le chant dure ce qu'elle dure.
 *
 * @param son
 * @text Le son de l'écran qui se brise
 * @type file
 * @dir audio/se
 * @require 1
 * @default Break
 *
 * @param annonce
 * @text Ce qui s'écrit au-dessus de lui
 * @default ♪ Il brise l'écran !
 *
 * @help
 * ============================================================================
 *  LE CHANT — un combat qui alterne avec le Theatrhythm
 * ============================================================================
 * Mets sur ton ennemi (sa Note, dans la base de données) :
 *
 *     <Chant: chant_du_troll>
 *
 * La partition, tu l'écris dans le Studio (🎵 Rythmes). Plusieurs, pour qu'il
 * ne chante pas toujours la même : elles passent dans l'ordre, puis reprennent.
 *
 *     <Chant: couplet_1, refrain, couplet_2>
 *
 * Et si tu veux, pour lui seul (sinon, les réglages du plugin) :
 *
 *     <Chant seuil: 70>      il chante la 1re fois sous 70 % de ses PV
 *     <Chant tours: 3>       3 tours de combat normal entre deux chants
 *     <Chant vitesse: 8>     la vitesse des notes, si la partition n'en donne pas
 *
 * CE QUI SE PASSE
 *  1. Au début d'un tour, s'il est sous le seuil : « ♪ Il brise l'écran ! »,
 *     il s'illumine, l'écran tremble, se fissure et part en éclats.
 *  2. Le Theatrhythm de MOG s'ouvre, contre LUI, sur sa partition, avec le
 *     décor du combat. Vos PV sont ceux que vous avez (MOG ne soigne pas),
 *     les siens aussi. Les 4 premiers de l'équipe chantent (les 4 couloirs).
 *  3. La partition finie, on revient au combat, au même endroit : buffs,
 *     états, PT, tout est là ; chacun garde ce que le chant lui a laissé.
 *     Tombé pendant le chant, il est vaincu ; l'équipe tombée, c'est perdu.
 *  4. Après 3 tours de combat normal, il rechante. Et ainsi de suite.
 *
 * Le combat ne recommence pas au retour : ni « X apparaît ! », ni les débuts
 * de combat des autres plugins (seiryu, le Pacte, le Registre, les instincts,
 * le titre du boss), ni les fins de combat au départ (buffs, états, PT).
 */

var LeChant = LeChant || {};

(function () {
    'use strict';

    var P = PluginManager.parameters('LeChant');
    var SEUIL = Number(P.seuil || 70);
    var TOURS = Number(P.tours || 3);
    var VITESSE = Number(P.vitesse || 6);
    var DUREE = Number(P.dureeSansPartition || 60);
    var SON = String(P.son || 'Break');
    var ANNONCE = String(P.annonce || '♪ Il brise l\'écran !');
    var COULOIRS = 4;                                   // ceux de MOG

    LeChant._enCours = null;

    // ── la balise ────────────────────────────────────────────────────────────
    function note(e, cle) {
        var d = e && e.isEnemy && e.isEnemy() ? e.enemy() : null;
        var v = d && d.meta ? d.meta[cle] : null;
        return typeof v === 'string' ? v.trim() : null;
    }
    LeChant.partitionsDe = function (e) {
        var v = note(e, 'Chant');
        return v ? v.split(',').map(function (x) { return x.trim(); }).filter(Boolean) : [];
    };
    LeChant.reglage = function (e, cle, defaut) {
        var v = Number(note(e, 'Chant ' + cle));
        return v > 0 ? v : defaut;
    };

    // le chanteur de la troupe : le premier vivant qui a <Chant:>
    LeChant.chanteur = function () {
        return $gameTroop.aliveMembers().filter(function (e) {
            return e.isAppeared() && LeChant.partitionsDe(e).length;
        })[0] || null;
    };

    // la 1re fois sous le seuil ; ensuite, après n tours de combat normal
    LeChant.doitChanter = function (e) {
        if (!e) return false;
        if (!e._chant) return e.hpRate() * 100 <= LeChant.reglage(e, 'seuil', SEUIL);
        return $gameTroop.turnCount() - e._chant.finTour >= LeChant.reglage(e, 'tours', TOURS);
    };

    // ── au début du tour : chante-t-il ? ─────────────────────────────────────
    var _saisie = BattleManager.startInput;
    BattleManager.startInput = function () {
        var e = LeChant._enCours ? null : LeChant.chanteur();
        if (e && LeChant.doitChanter(e) && !$gameParty.isAllDead() && SceneManager._scene instanceof Scene_Battle) {
            LeChant.commencer(e);
            return;
        }
        _saisie.call(this);
    };

    LeChant.commencer = function (e) {
        var c = e._chant = e._chant || { fois: 0, finTour: 0 };
        var liste = LeChant.partitionsDe(e), nom = liste[c.fois % liste.length];
        c.fois++;
        BattleManager._phase = 'chant';
        var etat = LeChant._enCours = { chanteur: e, nom: nom, partition: null, charge: false, brise: false };
        if (window.LesPartitions && LesPartitions.charger) {
            LesPartitions.charger(nom, function (p) { etat.partition = p; etat.charge = true; });
        } else {
            etat.charge = true;
        }
        if (window.CombatTactique && CombatTactique.annoncer) CombatTactique.annoncer(e, ANNONCE, '#ff7ad9');
        e.requestEffect('whiten');
        $gameScreen.startShake(6, 9, 36);
        var scene = SceneManager._scene, o = LeChant.pointDImpact(scene, e);
        var sp = scene._spriteset;
        etat.fond = sp && sp._back1Sprite && sp._back2Sprite ? [sp._back1Sprite.bitmap, sp._back2Sprite.bitmap] : null;
        etat.eclats = new Sprite_EcranBrise(o.x, o.y, function () { etat.brise = true; });
        scene.addChild(etat.eclats);
    };

    // là où il est à l'écran : c'est de lui que partent les fissures
    LeChant.pointDImpact = function (scene, e) {
        var sp = scene._spriteset && scene._spriteset._enemySprites ? scene._spriteset._enemySprites.filter(function (s) { return s._battler === e; })[0] : null;
        if (sp) return { x: sp.x, y: sp.y - (sp.bitmap && sp.bitmap.height ? sp.bitmap.height / 2 : 40) };
        return { x: Graphics.boxWidth / 2, y: Graphics.boxHeight / 2 };
    };

    // l'écran brisé et la partition prête : on part chanter
    var _majCombat = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        if (this._chantSansTitre) {
            this._chantSansTitre = false;
            var MB = window.MecaBoss;
            if (MB && MB._bannieres && MB._bannieres[0] && MB._bannieres[0].type === 'titre') MB._bannieres.shift();
        }
        _majCombat.call(this);
        var etat = LeChant._enCours;
        if (etat && etat.brise && etat.charge && !etat.sortie && !SceneManager.isSceneChanging()) LeChant.partir(etat);
    };

    LeChant.partir = function (etat) {
        var e = etat.chanteur;
        var vitesse = LeChant.reglage(e, 'vitesse', (etat.partition && etat.partition.vitesse) || VITESSE);
        $gameSystem._theatrhythm_data = [e.enemyId(), Math.min(20, Math.max(1, vitesse))];
        if (window.LesPartitions) LesPartitions._attente = etat.partition;
        etat.musiqueCarte = { bgm: BattleManager._mapBgm, bgs: BattleManager._mapBgs };
        etat.sortie = true;
        etat.dansLeChant = true;
        SceneManager.push(Scene_Theatrhythm);
    };

    // ── quitter le combat sans le finir ──────────────────────────────────────
    // (YEP_X_CoreUpdatesOpt : Scene_Battle.terminate appelle onBattleEnd, qui
    // efface buffs, états de combat et PT)
    var _terminer = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function () {
        var etat = LeChant._enCours;
        if (!etat || !etat.sortie || etat.retour) return _terminer.call(this);
        $gameParty.onBattleEnd = function () {};
        $gameTroop.onBattleEnd = function () {};
        try { _terminer.call(this); } finally { delete $gameParty.onBattleEnd; delete $gameTroop.onBattleEnd; }
    };

    // seuls les 4 premiers chantent (les 4 couloirs de MOG)
    var _membres = Game_Party.prototype.battleMembers;
    Game_Party.prototype.battleMembers = function () {
        var l = _membres.call(this);
        return LeChant._enCours && LeChant._enCours.dansLeChant ? l.slice(0, COULOIRS) : l;
    };

    // ── le chant : le Theatrhythm de MOG, vos PV et les siens ────────────────
    var _init = Scene_Theatrhythm.prototype.initialize;
    Scene_Theatrhythm.prototype.initialize = function () {
        var etat = LeChant._enCours && LeChant._enCours.dansLeChant ? LeChant._enCours : null;
        this._chant = etat;
        if (!etat) return _init.call(this);
        // MOG soigne toute l'équipe en entrant : pas ici
        var base = Game_BattlerBase.prototype.recoverAll;
        var acteur = Object.prototype.hasOwnProperty.call(Game_Actor.prototype, 'recoverAll') ? Game_Actor.prototype.recoverAll : null;
        Game_BattlerBase.prototype.recoverAll = function () {};
        if (acteur) Game_Actor.prototype.recoverAll = function () {};
        try { _init.call(this); } finally {
            Game_BattlerBase.prototype.recoverAll = base;
            if (acteur) Game_Actor.prototype.recoverAll = acteur;
        }
    };

    var _params = Scene_Theatrhythm.prototype.set_battler_parameters;
    Scene_Theatrhythm.prototype.set_battler_parameters = function () {
        _params.call(this);
        if (!this._chant) return;
        var e = this._chant.chanteur;
        this._enemy_hp = [e.hp, e.mhp];
        this._enemy._hp = e.hp;
        this._chant.pvEquipe = this._party_hp[0];
    };

    // le décor du combat (les images mêmes du combat en cours), pas celui de la carte
    var _fond = Scene_Theatrhythm.prototype.refresh_background;
    Scene_Theatrhythm.prototype.refresh_background = function () {
        _fond.call(this);
        var f = this._chant && this._chant.fond;
        if (!f) return;
        if (f[0]) this._back1Sprite.bitmap = f[0];
        if (f[1]) this._back2Sprite.bitmap = f[1];
    };

    // un chant ne boucle pas et ne se gagne pas au bout : il s'arrête
    var _boucle = Scene_Theatrhythm.prototype.partitionEnBoucle;
    Scene_Theatrhythm.prototype.partitionEnBoucle = function () {
        return this._chant ? false : (_boucle ? _boucle.call(this) : false);
    };
    var _finP = Scene_Theatrhythm.prototype.finDePartition;
    Scene_Theatrhythm.prototype.finDePartition = function () {
        if (!this._chant) return _finP.call(this);
        $gameSystem._theatrhythm_phase = 12;
        this.fadeOutAll();
        SceneManager.pop();
    };

    // sans partition (introuvable), MOG tire ses notes au hasard : le chant dure DUREE s
    var _majChant = Scene_Theatrhythm.prototype.update;
    Scene_Theatrhythm.prototype.update = function () {
        _majChant.call(this);
        if (!this._chant || this._partition || $gameSystem._theatrhythm_phase !== 1) return;
        this._chantImages = (this._chantImages || 0) + 1;
        if (this._chantImages >= DUREE * 60) this.finDePartition();
    };

    // la fin du chant : chacun garde ce qui lui reste
    var _finT = Scene_Theatrhythm.prototype.terminate;
    Scene_Theatrhythm.prototype.terminate = function () {
        var etat = this._chant;
        _finT.call(this);                // MOG : la musique du combat reprend
        if (!etat) return;
        LeChant.rendre(this, etat);
        BattleManager._mapBgm = etat.musiqueCarte.bgm;    // MOG avait pris la musique du combat pour celle de la carte
        BattleManager._mapBgs = etat.musiqueCarte.bgs;
        etat.dansLeChant = false;
        etat.retour = true;
    };

    LeChant.rendre = function (s, etat) {
        var e = etat.chanteur;
        e.setHp(Math.max(0, Math.round(s._enemy_hp[0])));
        var avant = etat.pvEquipe, apres = Math.max(0, s._party_hp[0]);
        var r = avant > 0 ? Math.min(1, apres / avant) : 0;
        (s._battlers || []).forEach(function (a) {
            if (!a) return;
            a.clearAnimations();
            a.clearMotion();
            if (a.isDead()) return;
            a.setHp(r > 0 ? Math.max(1, Math.round(a.hp * r)) : 0);
        });
        e._chant.finTour = $gameTroop.turnCount();
        etat.resultat = { chanteur: e.hp, equipe: r };
    };

    // ── le retour : le combat continue, il ne recommence pas ─────────────────
    var _demarrer = Scene_Battle.prototype.start;
    Scene_Battle.prototype.start = function () {
        var etat = LeChant._enCours;
        if (!etat || !etat.retour) return _demarrer.call(this);
        var debut = BattleManager.startBattle, musique = BattleManager.playBattleBgm;
        BattleManager.startBattle = function () {};
        BattleManager.playBattleBgm = function () {};
        try { _demarrer.call(this); } finally {
            BattleManager.startBattle = debut;
            BattleManager.playBattleBgm = musique;
        }
        // ScenesDeBoss remet le titre du boss à chaque Scene_Battle.start — chargé après
        // LeChant, il l'ajoute après nous : on le retire à la première image (Scene_Battle.update)
        this._chantSansTitre = true;
        LeChant._enCours = null;
        $gameParty.requestMotionRefresh();
        if (!BattleManager.checkBattleEnd()) BattleManager.startInput();
    };

    // ── l'écran qui se brise ─────────────────────────────────────────────────
    var ATTENTE = 30, FISSURE = 22, CHUTE = 80;

    function Sprite_EcranBrise() { this.initialize.apply(this, arguments); }
    Sprite_EcranBrise.prototype = Object.create(Sprite.prototype);
    Sprite_EcranBrise.prototype.constructor = Sprite_EcranBrise;
    window.Sprite_EcranBrise = Sprite_EcranBrise;

    Sprite_EcranBrise.prototype.initialize = function (x, y, fini) {
        Sprite.prototype.initialize.call(this);
        this._ix = x; this._iy = y; this._fini = fini; this._t = 0; this._eclats = [];
    };

    Sprite_EcranBrise.prototype.update = function () {
        Sprite.prototype.update.call(this);
        this._t++;
        if (this._t === ATTENTE) this.fissurer();
        if (this._t === ATTENTE + FISSURE) this.briser();
        if (this._t > ATTENTE + FISSURE) this.tomber();
        if (this._t === ATTENTE + FISSURE + CHUTE && this._fini) { var f = this._fini; this._fini = null; f(); }
    };

    // une photo de l'écran, et des fissures qui partent de lui
    Sprite_EcranBrise.prototype.fissurer = function () {
        var W = Graphics.boxWidth, H = Graphics.boxHeight;
        this._photo = SceneManager.snap();
        var b = new Bitmap(W, H);
        b.blt(this._photo, 0, 0, W, H, 0, 0);
        var ctx = b._context, n = 12;
        this._rayons = [];
        for (var k = 0; k < n; k++) this._rayons.push((k + Math.random() * 0.7) / n * Math.PI * 2);
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 2; ctx.shadowColor = 'rgba(160,220,255,0.9)'; ctx.shadowBlur = 6;
        var ix = this._ix, iy = this._iy;
        this._rayons.forEach(function (a) {
            var r = 0, x = ix, y = iy;
            ctx.beginPath(); ctx.moveTo(x, y);
            while (r < 1000) {
                r += 40 + Math.random() * 70;
                var d = a + (Math.random() - 0.5) * 0.35;
                x = ix + Math.cos(d) * r; y = iy + Math.sin(d) * r;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        });
        [70, 170, 300].forEach(function (rr) {
            ctx.beginPath();
            for (var k = 0; k <= 24; k++) {
                var a = k / 24 * Math.PI * 2, r2 = rr * (0.85 + Math.random() * 0.3);
                if (k === 0) ctx.moveTo(ix + Math.cos(a) * r2, iy + Math.sin(a) * r2); else ctx.lineTo(ix + Math.cos(a) * r2, iy + Math.sin(a) * r2);
            }
            ctx.globalAlpha = 0.55; ctx.stroke(); ctx.globalAlpha = 1;
        });
        ctx.restore();
        b._setDirty();
        this._fissures = new Sprite(b);
        this.addChild(this._fissures);
        AudioManager.playSe({ name: SON, volume: 75, pitch: 130, pan: 0 });
    };

    // les éclats : des morceaux de la photo, découpés autour de lui
    Sprite_EcranBrise.prototype.briser = function () {
        var W = Graphics.boxWidth, H = Graphics.boxHeight, ix = this._ix, iy = this._iy;
        var noir = new Sprite(new Bitmap(W, H)); noir.bitmap.fillAll('#000000');
        this.addChild(noir);
        var rayons = this._rayons.slice().sort(function (a, b) { return a - b; }), anneaux = [80, 190, 330, 520, 1100];
        var V = anneaux.map(function (r) {
            return rayons.map(function (a) { var rr = r * (0.85 + Math.random() * 0.3); return [ix + Math.cos(a) * rr, iy + Math.sin(a) * rr]; });
        });
        var tris = [], n = rayons.length;
        for (var k = 0; k < n; k++) {
            var k2 = (k + 1) % n;
            tris.push([[ix, iy], V[0][k], V[0][k2]]);
            for (var i = 1; i < V.length; i++) {
                tris.push([V[i - 1][k], V[i][k], V[i][k2]]);
                tris.push([V[i - 1][k], V[i][k2], V[i - 1][k2]]);
            }
        }
        var photo = this._photo, self = this;
        tris.forEach(function (t) {
            var xs = t.map(function (p) { return p[0]; }), ys = t.map(function (p) { return p[1]; });
            var bx = Math.floor(Math.max(0, Math.min.apply(null, xs))), by = Math.floor(Math.max(0, Math.min.apply(null, ys)));
            var bx2 = Math.ceil(Math.min(W, Math.max.apply(null, xs))), by2 = Math.ceil(Math.min(H, Math.max.apply(null, ys)));
            if (bx2 - bx < 2 || by2 - by < 2) return;
            var bm = new Bitmap(bx2 - bx, by2 - by), c = bm._context;
            c.save(); c.beginPath(); c.moveTo(t[0][0] - bx, t[0][1] - by); c.lineTo(t[1][0] - bx, t[1][1] - by); c.lineTo(t[2][0] - bx, t[2][1] - by); c.closePath();
            c.clip(); c.drawImage(photo._canvas, -bx, -by);
            c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2; c.stroke(); c.restore();
            bm._setDirty();
            var cx = (t[0][0] + t[1][0] + t[2][0]) / 3, cy = (t[0][1] + t[1][1] + t[2][1]) / 3;
            var s = new Sprite(bm);
            s.anchor.x = (cx - bx) / (bx2 - bx); s.anchor.y = (cy - by) / (by2 - by);
            s.x = cx; s.y = cy;
            var dx = cx - ix, dy = cy - iy, d = Math.max(1, Math.sqrt(dx * dx + dy * dy)), force = 4 + Math.random() * 6;
            s._vx = dx / d * force; s._vy = dy / d * force - 3 - Math.random() * 3;
            s._vr = (Math.random() - 0.5) * 0.12; s._retard = Math.floor(d / 60);
            self._eclats.push(s);
            self.addChild(s);
        });
        if (this._fissures) { this.removeChild(this._fissures); this._fissures = null; }
        this._eclair = new Sprite(new Bitmap(W, H)); this._eclair.bitmap.fillAll('#ffffff'); this._eclair.opacity = 220;
        this.addChild(this._eclair);
        AudioManager.playSe({ name: SON, volume: 100, pitch: 85, pan: 0 });
    };

    Sprite_EcranBrise.prototype.tomber = function () {
        if (this._eclair) this._eclair.opacity -= 22;
        var fin = ATTENTE + FISSURE + CHUTE;
        this._eclats.forEach(function (s) {
            if (s._retard > 0) { s._retard--; return; }
            s.x += s._vx; s.y += s._vy; s._vy += 0.55; s.rotation += s._vr;
            s.scale.x = s.scale.y = Math.max(0.6, s.scale.x - 0.004);
        });
        if (this._t > fin - 20) this._eclats.forEach(function (s) { s.opacity -= 13; });
    };
})();
