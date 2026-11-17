//=============================================================================
// CombatTactique.js — v1.0  ·  Limite, barrière, provocation, overkill…
// RPG Maker MV   ·   pour JOKO
//   Inspiré, sans rien en copier, de Party Limit Gauge, Absorption Barrier,
//   Taunt, Enemy Overkill, Instant Cast, Limited Skill Uses, Steal & Snatch
//   et Difficulty Slider (Yanfly). Tout se pose par balises : rien n'est
//   écrit dans data/.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Jauge de limite d'équipe, barrières, provocation,
 * overkill, compétences instantanées, usages limités, vol, difficulté.
 * @author JOKO
 *
 * @param limiteMax
 * @text Limite : maximum
 * @type number
 * @min 1
 * @default 100
 *
 * @param limiteFrappe
 * @text Limite : gain quand un héros frappe
 * @type number
 * @default 3
 *
 * @param limiteEncaisse
 * @text Limite : gain quand un héros encaisse
 * @type number
 * @default 4
 *
 * @param limiteChute
 * @text Limite : gain quand un héros tombe
 * @type number
 * @default 15
 *
 * @param limiteGarder
 * @text Limite : gardée d'un combat à l'autre ?
 * @type boolean
 * @on Oui
 * @off Non (repart à 0)
 * @default true
 *
 * @param limiteJauge
 * @text Limite : jauge à l'écran
 * @type select
 * @option si un héros a une compétence qui la coûte
 * @value auto
 * @option toujours
 * @value toujours
 * @option jamais
 * @value jamais
 * @default auto
 *
 * @param barriereMax
 * @text Barrière : plafond (% des PV max)
 * @type number
 * @min 1
 * @default 100
 *
 * @param overkillSeuil
 * @text Overkill : excès de dégâts (% des PV max)
 * @type number
 * @min 1
 * @default 50
 * @desc Le coup final doit dépasser les PV restants d'au moins ce pourcentage des PV max de l'ennemi.
 *
 * @param overkillBonus
 * @text Overkill : bonus d'EXP et d'or (%)
 * @type number
 * @default 50
 *
 * @param instantMax
 * @text Instantané : actions en plus par tour (max)
 * @type number
 * @min 1
 * @default 1
 *
 * @param volChance
 * @text Vol : chance de base (%)
 * @type number
 * @min 1
 * @max 100
 * @default 50
 *
 * @param volOr
 * @text Vol : or volé (% de l'or de l'ennemi)
 * @type number
 * @default 50
 * @desc Quand l'ennemi n'a aucun objet à voler.
 *
 * @param pvFacile
 * @text Difficulté Facile : PV ennemis (%)
 * @type number
 * @min 1
 * @default 75
 *
 * @param forceFacile
 * @text Difficulté Facile : attaque ennemie (%)
 * @type number
 * @min 1
 * @default 80
 *
 * @param pvDur
 * @text Difficulté Difficile : PV ennemis (%)
 * @type number
 * @min 1
 * @default 130
 *
 * @param forceDur
 * @text Difficulté Difficile : attaque ennemie (%)
 * @type number
 * @min 1
 * @default 120
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  COMBAT TACTIQUE
 * ═══════════════════════════════════════════════════════════════════════════
 *  Rien ne change tant qu'aucune balise n'est posée, sauf la jauge de limite
 *  qui se remplit, l'overkill et l'option « Difficulté » (Normal = rien ne
 *  change). Les balises vont dans la NOTE de l'objet indiqué.
 *
 *  ── LA JAUGE DE LIMITE D'ÉQUIPE ───────────────────────────────────────
 *  Une jauge commune à toute l'équipe. Elle monte quand un héros frappe
 *  (+3), encaisse (+4) ou tombe (+15) ; maximum 100. Tout est réglable.
 *  Compétence :  <Coût limite: 50>    il faut 50 de jauge, elle les paie
 *                <Gain limite: 10>    l'utiliser remplit la jauge de 10
 *  Dans une formule :  $gameParty.limite()
 *  Commandes :
 *      LIMITE +20        ajoute 20
 *      LIMITE -20        retire 20
 *      LIMITE plein
 *      LIMITE vide
 *      LIMITE =50        la met à 50
 *  La jauge s'affiche au-dessus des héros dès que l'un d'eux connaît une
 *  compétence qui la coûte (réglable : toujours / jamais).
 *
 *  ── LA BARRIÈRE ───────────────────────────────────────────────────────
 *  Un bouclier qui prend les dégâts avant les PV (en bleu clair sur la
 *  jauge de PV). Elle dure tout le combat, sauf durée donnée.
 *  Compétence / objet :  <Barrière: a.mat * 2>   formule (a, b, v)
 *                        <Barrière: 30%>          30 % des PV max de la cible
 *                        <Barrière tours: 3>      elle s'efface après 3 tours
 *                        <Perce-barrière>         ce coup ignore la barrière
 *  Héros, classe, équipement, état, ENNEMI :
 *                        <Barrière de départ: 200>   au début du combat
 *  Commande :
 *      BARRIERE 1 300    le héros 1 reçoit 300 de barrière (0 = l'enlever)
 *
 *  ── LA PROVOCATION ────────────────────────────────────────────────────
 *  Héros, classe, équipement, état, ennemi :
 *      <Provocation>              attire toutes les attaques à cible unique
 *      <Provocation: physique>    seulement les attaques physiques
 *      <Provocation: magique>     seulement les attaques magiques
 *  Le plus simple : un ÉTAT « Provocation » avec la balise, donné par une
 *  compétence. Les attaques sur tout le groupe ne sont pas détournées.
 *  Si un ENNEMI provoque, le joueur ne peut viser que lui.
 *
 *  ── L'OVERKILL ────────────────────────────────────────────────────────
 *  Achever un ennemi avec un coup qui dépasse ses PV restants d'au moins
 *  50 % de ses PV max : « OVERKILL ! », et +50 % d'EXP et d'or pour lui.
 *  Ennemi :  <Sans overkill>
 *
 *  ── LES COMPÉTENCES INSTANTANÉES ──────────────────────────────────────
 *  Compétence / objet :  <Instantané>
 *  Elle ne compte pas comme l'action du tour : le héros choisit encore une
 *  action (au plus 1 en plus par tour, réglable). Elle passe en premier.
 *
 *  ── LES USAGES LIMITÉS ────────────────────────────────────────────────
 *  Compétence :  <Usages: 1>    une fois par combat (le reste s'affiche ×n)
 *
 *  ── LE VOL ────────────────────────────────────────────────────────────
 *  Compétence :  <Voler>        tente de voler l'ennemi touché
 *                <Voler: +20%>  avec 20 points de chance en plus
 *  Ennemi (facultatif) :  <Vol: o5 30%, a2 10%, w4 5%, or 100>
 *      o = objet, w = arme, a = armure, or = pièces d'or.
 *  Sans cette balise, on vole dans le butin de l'ennemi, et à défaut une
 *  part de son or. Chance : 50 % × (AGI du voleur / AGI de l'ennemi).
 *  Un ennemi ne se fait voler qu'une fois.
 *
 *  ── LA DIFFICULTÉ ─────────────────────────────────────────────────────
 *  Une ligne « Difficulté » dans les Options : Facile, Normal, Difficile.
 *  Facile : PV ennemis 75 %, attaque 80 %. Difficile : 130 % et 120 %.
 *  Normal ne change rien. Commandes :
 *      DIFFICULTE facile
 *      DIFFICULTE normal
 *      DIFFICULTE difficile
 */
var CombatTactique = window.CombatTactique || {};
window.CombatTactique = CombatTactique;
(function () {
    'use strict';
    var P = PluginManager.parameters('CombatTactique');
    function nb(v, d) { var n = Number(v); return v === undefined || v === '' || isNaN(n) ? d : n; }
    var LIM_MAX = Math.max(1, nb(P.limiteMax, 100));
    var LIM_FRAPPE = nb(P.limiteFrappe, 3), LIM_ENCAISSE = nb(P.limiteEncaisse, 4), LIM_CHUTE = nb(P.limiteChute, 15);
    var LIM_GARDER = String(P.limiteGarder || 'true') !== 'false';
    var LIM_JAUGE = String(P.limiteJauge || 'auto');
    var BAR_MAX = Math.max(1, nb(P.barriereMax, 100)) / 100;
    var OK_SEUIL = Math.max(1, nb(P.overkillSeuil, 50)) / 100, OK_BONUS = nb(P.overkillBonus, 50) / 100;
    var INSTANT_MAX = Math.max(1, nb(P.instantMax, 1));
    var VOL_CHANCE = nb(P.volChance, 50) / 100, VOL_OR = nb(P.volOr, 50) / 100;
    var DIFF = [
        { nom: 'Facile', pv: nb(P.pvFacile, 75) / 100, force: nb(P.forceFacile, 80) / 100 },
        { nom: 'Normal', pv: 1, force: 1 },
        { nom: 'Difficile', pv: nb(P.pvDur, 130) / 100, force: nb(P.forceDur, 120) / 100 }
    ];

    //=========================================================================
    // Lire les balises (une arme possédée a sa note vidée par YEP_ItemCore :
    // on lit aussi celle de l'arme d'origine)
    //=========================================================================
    function note(o) {
        if (!o) return '';
        var n = o.note || '';
        if (o.baseItemId) {
            var t = DataManager.isWeapon(o) ? $dataWeapons : DataManager.isArmor(o) ? $dataArmors : DataManager.isItem(o) ? $dataItems : null;
            var b = t && t[o.baseItemId];
            if (b && b !== o) n += '\n' + (b.note || '');
        }
        return n;
    }
    function balise(o, re) { var m = re.exec(note(o)); return m; }
    function objets(b) { return b && b.traitObjects ? b.traitObjects().filter(function (o) { return o; }) : []; }
    var RE = {
        cout: /<\s*(?:Co[uû]t limite|Limit Cost)\s*:\s*(\d+)\s*>/i,
        gain: /<\s*Gain limite\s*:\s*(-?\d+)\s*>/i,
        barriere: /<\s*Barri[eè]re\s*:\s*([^>]+?)\s*>/i,
        barriereTours: /<\s*Barri[eè]re tours\s*:\s*(\d+)\s*>/i,
        barriereDepart: /<\s*Barri[eè]re de d[ée]part\s*:\s*([^>]+?)\s*>/i,
        perce: /<\s*Perce-barri[eè]re\s*>/i,
        provoc: /<\s*(?:Provocation|Taunt)\s*(?::\s*([^>]*?))?\s*>/i,
        sansOverkill: /<\s*Sans overkill\s*>/i,
        instant: /<\s*(?:Instantan[ée]|Instant Cast)\s*>/i,
        usages: /<\s*Usages\s*:\s*(\d+)\s*>/i,
        voler: /<\s*Voler\s*(?::\s*([+-]?\d+)\s*%?)?\s*>/i,
        vol: /<\s*Vol\s*:\s*([^>]+?)\s*>/i
    };
    CombatTactique.note = note;
    function coutLimite(skill) { var m = skill && balise(skill, RE.cout); return m ? Number(m[1]) : 0; }
    function estInstantane(item) { return !!(item && RE.instant.test(note(item))); }
    function usagesMax(skill) { var m = skill && DataManager.isSkill(skill) && balise(skill, RE.usages); return m ? Number(m[1]) : 0; }
    CombatTactique.coutLimite = coutLimite;
    CombatTactique.estInstantane = estInstantane;

    function evaluer(formule, a, b, cible) {
        formule = String(formule).trim();
        var pc = /^(\d+(?:\.\d+)?)\s*%$/.exec(formule);
        if (pc) return Math.floor((cible || b).mhp * Number(pc[1]) / 100);
        try {
            var v = $gameVariables._data, s = $gameSwitches._data; // eslint-disable-line no-unused-vars
            var r = Number(eval(formule));
            return isNaN(r) ? 0 : Math.floor(r);
        } catch (e) { console.warn('CombatTactique : formule illisible « ' + formule + ' »', e); return 0; }
    }

    //=========================================================================
    // Les annonces qui flottent (« OVERKILL ! », « Volé : Potion »…)
    //=========================================================================
    CombatTactique.annoncer = function (battler, texte, couleur) {
        if (!battler || !$gameParty.inBattle()) return;
        (battler._ctAnnonces = battler._ctAnnonces || []).push({ texte: texte, couleur: couleur || '#ffffff' });
    };
    function Sprite_Annonce() { this.initialize.apply(this, arguments); }
    Sprite_Annonce.prototype = Object.create(Sprite.prototype);
    Sprite_Annonce.prototype.constructor = Sprite_Annonce;
    Sprite_Annonce.prototype.initialize = function (texte, couleur, x, y) {
        Sprite.prototype.initialize.call(this, new Bitmap(320, 40));
        this.bitmap.fontSize = 24;
        this.bitmap.outlineWidth = 5;
        this.bitmap.outlineColor = 'rgba(0,0,0,0.85)';
        this.bitmap.textColor = couleur;
        this.bitmap.drawText(texte, 0, 0, 320, 40, 'center');
        this.anchor.x = 0.5; this.anchor.y = 1;
        // les héros sont au bord droit : une annonce longue y était coupée — elle reste dans l'écran
        var demi = Math.min(320, this.bitmap.measureTextWidth(texte)) / 2 + 6;
        this.x = Math.max(demi, Math.min(Graphics.boxWidth - demi, x)); this.y = y;
        this._vie = 0;
        this.texte = texte;
    };
    Sprite_Annonce.prototype.update = function () {
        Sprite.prototype.update.call(this);
        this._vie++;
        if (this._vie < 8) this.scale.x = this.scale.y = 0.6 + this._vie * 0.06;
        this.y -= this._vie < 40 ? 0.6 : 0.2;
        if (this._vie > 70) this.opacity -= 12;
    };
    CombatTactique.Sprite_Annonce = Sprite_Annonce;
    var _sbUpdate = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function () {
        _sbUpdate.call(this);
        if (!this._ctAnnonces) { this._ctAnnonces = []; }
        var self = this, champ = this._battleField;
        this.battlerSprites().forEach(function (sp) {
            var b = sp._battler;
            if (!b || !b._ctAnnonces || !b._ctAnnonces.length) return;
            var file = b._ctAnnonces; b._ctAnnonces = [];
            var h = sp.bitmap && sp.bitmap.height ? Math.min(sp.bitmap.height, 220) : 64;
            if (b.isActor()) h = 72;
            file.forEach(function (a, i) {
                var s = new Sprite_Annonce(a.texte, a.couleur, sp.x + (champ ? champ.x : 0), sp.y + (champ ? champ.y : 0) - h - 4 - i * 26 - self._ctAnnonces.filter(function (x) { return x._qui === b && x._vie < 20; }).length * 26);
                s._qui = b;
                self._ctAnnonces.push(s);
                self.addChild(s);
            });
        });
        for (var i = this._ctAnnonces.length - 1; i >= 0; i--) {
            var s = this._ctAnnonces[i];
            if (s.opacity <= 0) { this.removeChild(s); this._ctAnnonces.splice(i, 1); }
        }
    };

    //=========================================================================
    // La jauge de limite d'équipe
    //=========================================================================
    Game_Party.prototype.limite = function () { return this._limite || 0; };
    Game_Party.prototype.limiteMax = function () { return LIM_MAX; };
    Game_Party.prototype.changerLimite = function (n) { this._limite = Math.max(0, Math.min(LIM_MAX, (this._limite || 0) + n)); };
    Game_Party.prototype.fixerLimite = function (n) { this._limite = Math.max(0, Math.min(LIM_MAX, n)); };
    var _pBS = Game_Party.prototype.onBattleStart;
    Game_Party.prototype.onBattleStart = function () {
        if (_pBS) _pBS.apply(this, arguments);
        if (!LIM_GARDER) this._limite = 0;
    };
    function gagnerLimite(n) { if (n && $gameParty.inBattle()) $gameParty.changerLimite(n); }
    CombatTactique.jaugeVisible = function () {
        if (LIM_JAUGE === 'jamais') return false;
        if (LIM_JAUGE === 'toujours') return true;
        return $gameParty.members().some(function (a) { return a.skills().some(function (s) { return coutLimite(s) > 0; }); });
    };

    var _canPay = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
        var c = coutLimite(skill);
        if (c > 0 && this.isActor() && $gameParty.limite() < c) return false;
        return _canPay.call(this, skill);
    };
    var _pay = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function (skill) {
        _pay.call(this, skill);
        var c = coutLimite(skill);
        if (c > 0 && this.isActor()) $gameParty.changerLimite(-c);
    };

    function Sprite_JaugeLimite() { this.initialize.apply(this, arguments); }
    Sprite_JaugeLimite.prototype = Object.create(Sprite.prototype);
    Sprite_JaugeLimite.prototype.constructor = Sprite_JaugeLimite;
    Sprite_JaugeLimite.prototype.initialize = function () {
        Sprite.prototype.initialize.call(this, new Bitmap(200, 26));
        this._cle = '';
        this._affiche = $gameParty.limite();
        this.visible = CombatTactique.jaugeVisible();
    };
    Sprite_JaugeLimite.prototype.update = function () {
        Sprite.prototype.update.call(this);
        if (!this.visible) return;
        var vrai = $gameParty.limite();
        this._affiche += (vrai - this._affiche) * 0.2;
        if (Math.abs(vrai - this._affiche) < 0.3) this._affiche = vrai;
        var plein = vrai >= LIM_MAX;
        var cle = Math.round(this._affiche * 10) + '|' + (plein ? Math.floor(Graphics.frameCount / 8) % 4 : 0);
        var sc = SceneManager._scene, st = sc && sc._statusWindow;
        // à droite, au-dessus des héros : la gauche et le centre ont déjà leurs bandeaux
        this.x = Graphics.boxWidth - this.bitmap.width - 4;
        this.y = st ? Math.max(0, st.y - this.bitmap.height - 2) : Graphics.boxHeight - 200;
        if (cle === this._cle) return;
        this._cle = cle;
        var bm = this.bitmap, w = 136, x = 60, r = this._affiche / LIM_MAX;
        bm.clear();
        bm.fillRect(x - 2, 8, w + 4, 12, 'rgba(0,0,0,0.75)');
        bm.gradientFillRect(x, 10, Math.floor(w * r), 8, '#b85a10', plein ? '#ffe680' : '#ffb030');
        if (plein) bm.fillRect(x, 10, Math.floor(w * r), 2, 'rgba(255,255,255,' + (0.3 + (Math.floor(Graphics.frameCount / 8) % 4) * 0.15) + ')');
        bm.fontSize = 15; bm.outlineWidth = 4; bm.textColor = plein ? '#ffe680' : '#ffffff';
        bm.drawText('LIMITE', 0, 2, x - 6, 22, 'right');
    };
    CombatTactique.Sprite_JaugeLimite = Sprite_JaugeLimite;
    var _cdo = Scene_Battle.prototype.createDisplayObjects;
    Scene_Battle.prototype.createDisplayObjects = function () {
        _cdo.call(this);
        this._jaugeLimite = new Sprite_JaugeLimite();
        this.addChild(this._jaugeLimite);
    };

    //=========================================================================
    // La barrière
    //=========================================================================
    Game_Battler.prototype.barriere = function () { return this._barriere || 0; };
    Game_Battler.prototype.ajouterBarriere = function (n, tours) {
        var plafond = Math.floor(this.mhp * BAR_MAX);
        this._barriere = Math.max(0, Math.min(plafond, (this._barriere || 0) + Math.floor(n)));
        if (tours > 0) this._barriereTours = Math.max(this._barriereTours || 0, tours);
        if (!this._barriere) this._barriereTours = 0;
        if ($gameParty.inBattle() && BattleManager.refreshStatus) BattleManager.refreshStatus();
    };
    Game_Battler.prototype.fixerBarriere = function (n) { this._barriere = 0; this._barriereTours = 0; this.ajouterBarriere(n); };
    var _bBS = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function () {
        if (_bBS) _bBS.apply(this, arguments);
        this._barriere = 0; this._barriereTours = 0;
        this._ctUsages = {};
        this._ctVole = false;
        var self = this, total = 0;
        objets(this).forEach(function (o) {
            var m = balise(o, RE.barriereDepart);
            if (m) total += evaluer(m[1], self, self, self);
        });
        if (total > 0) this.ajouterBarriere(total);
    };
    var _bBE = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function () {
        if (_bBE) _bBE.apply(this, arguments);
        this._barriere = 0; this._barriereTours = 0; this._ctUsages = {};
    };
    var _bTE = Game_Battler.prototype.onTurnEnd;
    Game_Battler.prototype.onTurnEnd = function () {
        _bTE.apply(this, arguments);
        if (this._barriereTours > 0 && --this._barriereTours === 0) {
            this._barriere = 0;
            if (BattleManager.refreshStatus) BattleManager.refreshStatus();
        }
    };

    // le bleu clair par-dessus la jauge de PV
    var _dah = Window_Base.prototype.drawActorHp;
    Window_Base.prototype.drawActorHp = function (actor, x, y, width) {
        this._ctBarriere = actor && actor.barriere && (!actor.gauge1 || actor.gauge1() === 'HP') ? actor : null;
        _dah.apply(this, arguments);
        this._ctBarriere = null;
    };
    var _dg = Window_Base.prototype.drawGauge;
    Window_Base.prototype.drawGauge = function (dx, dy, dw, rate) {
        var a = this._ctBarriere;
        this._ctBarriere = null;                      // la première jauge seulement (les PV)
        // la jauge peut être dessinée par un autre plugin (VisualOverhaul : 8 px
        // arrondis) : on repère les lignes qu'elle a vraiment peintes
        var lh = this.lineHeight(), avant = null, ctx = this.contents && this.contents._context;
        if (a && a.barriere() > 0 && ctx) { try { avant = ctx.getImageData(dx + 3, dy, 1, lh).data; } catch (e) { avant = null; } }
        _dg.apply(this, arguments);
        if (a && a.barriere() > 0) {
            var h = this.gaugeHeight ? this.gaugeHeight() : 6, gy = dy + lh - h - 2;
            if (avant) {
                var apres = ctx.getImageData(dx + 3, dy, 1, lh).data, haut = -1, bas = -1;
                for (var k = 0; k < lh; k++) {
                    var i = k * 4;
                    if (apres[i] !== avant[i] || apres[i + 1] !== avant[i + 1] || apres[i + 2] !== avant[i + 2] || apres[i + 3] !== avant[i + 3]) { if (haut < 0) haut = k; bas = k; }
                }
                if (haut >= 0 && bas - haut >= 2) { gy = dy + haut + 1; h = bas - haut - 1; }
            }
            var w = Math.max(2, Math.floor(dw * Math.min(1, a.barriere() / a.mhp)));
            this.contents.paintOpacity = 200;
            this.contents.gradientFillRect(dx, gy, w, h, '#40c8ff', '#b8f0ff');
            this.contents.paintOpacity = 255;
            this.contents.fillRect(dx, gy, w, 1, '#ffffff');
        }
    };
    // … et sur la jauge ennemie de CombatPlus
    if (window.CombatPlus && CombatPlus.Sprite_JaugeEnnemie) {
        var J = CombatPlus.Sprite_JaugeEnnemie.prototype;
        var _jUp = J.update;
        J.update = function () {
            var b = this.ennemi(), v = b ? b.barriere() : 0;
            if (v !== this._ctBar) { if (this._ctBar !== undefined) this._minuterie = Math.max(this._minuterie, 90); this._ctBar = v; this._cle = ''; }
            _jUp.call(this);
        };
        var _jDes = J.dessiner;
        J.dessiner = function (b) {
            _jDes.apply(this, arguments);
            if (b && b.barriere() > 0) {
                var L = this.bitmap.width - 4 - (this._texte || 0), w = Math.max(2, Math.floor(L * Math.min(1, b.barriere() / b.mhp)));
                this.bitmap.paintOpacity = 210;
                this.bitmap.gradientFillRect(2, 2, w, this.bitmap.height - 4, '#40c8ff', '#b8f0ff');
                this.bitmap.paintOpacity = 255;
            }
        };
    }

    //=========================================================================
    // Les dégâts : barrière, overkill, limite
    //=========================================================================
    var _ehd = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function (target, value) {
        var item = this.item(), absorbe = 0;
        if (value > 0 && target.barriere() > 0 && !(item && RE.perce.test(note(item)))) {
            absorbe = Math.min(target.barriere(), value);
            target._barriere -= absorbe;
            if (!target._barriere) target._barriereTours = 0;
            value -= absorbe;
            CombatTactique.annoncer(target, 'Barrière −' + absorbe, '#9ee8ff');
        }
        var avant = target.hp, vivant = target.isAlive();
        _ehd.call(this, target, value);
        target.result()._ctAbsorbe = absorbe;
        if (absorbe && BattleManager.refreshStatus) BattleManager.refreshStatus();
        var perdu = avant - target.hp, sujet = this.subject();
        if (perdu > 0 && $gameParty.inBattle()) {
            if (sujet && sujet.isActor() && target.isEnemy()) gagnerLimite(LIM_FRAPPE);
            if (target.isActor()) gagnerLimite(LIM_ENCAISSE);
            if (target.isActor() && vivant && target.hp <= 0) gagnerLimite(LIM_CHUTE);
            // l'overkill : le coup dépasse les PV qui restaient
            if (target.isEnemy() && vivant && target.hp <= 0 && !RE.sansOverkill.test(note(target.enemy())) &&
                value - avant >= target.mhp * OK_SEUIL) {
                target._ctOverkill = true;
                CombatTactique.annoncer(target, 'OVERKILL !', '#ff7a3a');
                AudioManager.playSe({ name: 'Crash', volume: 70, pitch: 130, pan: 0 });
            }
        }
    };
    CombatTactique.estOverkill = function (e) { return !!(e && e._ctOverkill); };
    var _eExp = Game_Enemy.prototype.exp;
    Game_Enemy.prototype.exp = function () { var x = _eExp.call(this); return this._ctOverkill ? Math.floor(x * (1 + OK_BONUS)) : x; };
    var _eGold = Game_Enemy.prototype.gold;
    Game_Enemy.prototype.gold = function () { var x = _eGold.call(this); return this._ctOverkill ? Math.floor(x * (1 + OK_BONUS)) : x; };

    //=========================================================================
    // Après un coup réussi : barrière donnée, vol, gain de limite
    //=========================================================================
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        var item = this.item(), r = target.result();
        if (!item || !r.isHit()) return;
        var m = balise(item, RE.barriere);
        if (m) {
            var t = balise(item, RE.barriereTours);
            var v = evaluer(m[1], this.subject(), target, target), av = target.barriere();
            if (v > 0) {
                target.ajouterBarriere(v, t ? Number(t[1]) : 0);
                if (target.barriere() > av) CombatTactique.annoncer(target, 'Barrière +' + (target.barriere() - av), '#9ee8ff');
            }
        }
        var vl = balise(item, RE.voler);
        if (vl && target.isEnemy()) voler(this.subject(), target, vl[1] ? Number(vl[1]) / 100 : 0);
    };
    var _useItem = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function (item) {
        _useItem.call(this, item);
        if (!$gameParty.inBattle() || !item) return;
        var g = balise(item, RE.gain);
        if (g && this.isActor()) $gameParty.changerLimite(Number(g[1]));
        if (usagesMax(item)) { this._ctUsages = this._ctUsages || {}; this._ctUsages[item.id] = (this._ctUsages[item.id] || 0) + 1; }
    };

    //=========================================================================
    // La provocation
    //=========================================================================
    function provoque(b, item) {
        if (!b || !b.isAlive()) return false;
        return objets(b).some(function (o) {
            var m = balise(o, RE.provoc);
            if (!m) return false;
            var genre = String(m[1] || '').toLowerCase();
            if (!genre || /tout|all/.test(genre)) return true;
            var ht = item ? item.hitType : 1;
            if (/phys/.test(genre)) return ht === Game_Action.HITTYPE_PHYSICAL;
            if (/mag/.test(genre)) return ht === Game_Action.HITTYPE_MAGICAL;
            return true;
        });
    }
    CombatTactique.provoque = provoque;
    var _tfo = Game_Action.prototype.targetsForOpponents;
    Game_Action.prototype.targetsForOpponents = function () {
        var cibles = _tfo.call(this), item = this.item();
        if (!item || !(this.isForOne() || this.isForRandom())) return cibles;
        var unite = this.opponentsUnit();
        var provs = unite.aliveMembers().filter(function (m) { return provoque(m, item); });
        if (!provs.length) return cibles;
        return cibles.map(function (c) { return provs.indexOf(c) >= 0 ? c : provs[Math.randomInt(provs.length)]; });
    };
    var _wbeAllowed = Window_BattleEnemy.prototype.allowedTargets;
    if (_wbeAllowed) {
        Window_BattleEnemy.prototype.allowedTargets = function () {
            var liste = _wbeAllowed.call(this);
            var a = BattleManager.inputtingAction && BattleManager.inputtingAction();
            var item = a && a.item();
            if (!item || !a.isForOne()) return liste;
            var provs = liste.filter(function (e) { return provoque(e, item); });
            return provs.length ? provs : liste;
        };
    }

    //=========================================================================
    // Les compétences instantanées
    //=========================================================================
    var _mkA = Game_Battler.prototype.makeActions;
    Game_Battler.prototype.makeActions = function () {
        _mkA.apply(this, arguments);
        this._ctBase = this._actions.length;
    };
    function tourParTicks() { return !!(BattleManager.isTickBased && BattleManager.isTickBased()); }
    function ajusterInstantanes(acteur) {
        if (!acteur || acteur._ctBase === undefined || tourParTicks()) return;
        var extra = 0, i;
        for (i = 0; i <= acteur._actionInputIndex && i < acteur._actions.length; i++) {
            var act = acteur._actions[i];
            if (act && estInstantane(act.item())) extra++;
        }
        var voulu = acteur._ctBase + Math.min(INSTANT_MAX, extra);
        while (acteur._actions.length < voulu) acteur._actions.push(new Game_Action(acteur));
        while (acteur._actions.length > voulu && acteur._actions.length - 1 > acteur._actionInputIndex) acteur._actions.pop();
    }
    CombatTactique.ajusterInstantanes = ajusterInstantanes;
    var _aSNC = Game_Actor.prototype.selectNextCommand;
    Game_Actor.prototype.selectNextCommand = function () {
        ajusterInstantanes(this);
        return _aSNC.apply(this, arguments);
    };
    var _speed = Game_Action.prototype.speed;
    Game_Action.prototype.speed = function () {
        var s = _speed.call(this);
        return estInstantane(this.item()) ? s + 2000 : s;
    };
    // en combat CTB : le héros rejoue tout de suite
    if (Game_Battler.prototype.checkCTBEndInstantCast) {
        var _ctbIC = Game_Battler.prototype.checkCTBEndInstantCast;
        Game_Battler.prototype.checkCTBEndInstantCast = function () {
            if (_ctbIC.call(this)) return true;
            var a = this.currentAction(), item = a && a.item();
            if (!estInstantane(item)) return false;
            var self = this;
            BattleManager.allBattleMembers().forEach(function (m) { if (m) self._ctbSpeed = Math.max(self._ctbSpeed, m.ctbSpeed() + m.ctbCharge()); });
            this._ctbSpeed = Math.max(this._ctbSpeed, BattleManager.ctbTarget()) + 0.00000000001;
            return true;
        };
    }

    //=========================================================================
    // Les usages limités
    //=========================================================================
    Game_BattlerBase.prototype.usagesRestants = function (skill) {
        var max = usagesMax(skill);
        if (!max) return -1;
        var u = this._ctUsages && this._ctUsages[skill.id] || 0;
        return Math.max(0, max - u);
    };
    var _msc = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
        if ($gameParty.inBattle() && this.usagesRestants(skill) === 0) return false;
        return _msc.call(this, skill);
    };

    // le coût affiché : limite et usages restants
    var _dsc = Window_SkillList.prototype.drawSkillCost;
    Window_SkillList.prototype.drawSkillCost = function (skill, wx, wy, width) {
        var dw = width, a = this._actor;
        var u = a && $gameParty.inBattle() ? a.usagesRestants(skill) : -1;
        if (u >= 0) {
            this.changeTextColor(u ? this.normalColor() : this.textColor(18));
            this.contents.fontSize -= 4;
            var t = '×' + u, tw = this.textWidth(t);
            this.drawText(t, wx, wy, dw, 'right');
            this.contents.fontSize += 4;
            dw -= tw + 6;
        }
        var c = coutLimite(skill);
        if (c > 0) {
            this.changeTextColor('#ffb030');
            this.contents.fontSize -= 4;
            var tl = c + 'L', twl = this.textWidth(tl);
            this.drawText(tl, wx, wy, dw, 'right');
            this.contents.fontSize += 4;
            dw -= twl + 6;
        }
        this.resetTextColor();
        var r = _dsc.call(this, skill, wx, wy, dw);
        return r === undefined ? dw : r;
    };

    //=========================================================================
    // Le vol
    //=========================================================================
    function butinDe(e) {
        var m = balise(e.enemy(), RE.vol), liste = [];
        if (m) {
            m[1].split(',').forEach(function (p) {
                var x = /^\s*(or|o|w|a)\s*(\d+)\s*(?:(\d+(?:\.\d+)?)\s*%)?\s*$/i.exec(p);
                if (!x) return;
                var k = x[1].toLowerCase(), n = Number(x[2]), ch = x[3] !== undefined ? Number(x[3]) / 100 : null;
                if (k === 'or') liste.push({ or: n, chance: ch });
                else {
                    var t = k === 'o' ? $dataItems : k === 'w' ? $dataWeapons : $dataArmors;
                    if (t[n]) liste.push({ objet: t[n], chance: ch });
                }
            });
            return liste;
        }
        e.enemy().dropItems.forEach(function (d) {
            var t = d.kind === 1 ? $dataItems : d.kind === 2 ? $dataWeapons : d.kind === 3 ? $dataArmors : null;
            if (t && t[d.dataId]) liste.push({ objet: t[d.dataId], chance: null });
        });
        if (!liste.length && e.gold() > 0) liste.push({ or: Math.max(1, Math.floor(e.gold() * VOL_OR)), chance: null });
        return liste;
    }
    CombatTactique.butinDe = butinDe;
    function voler(voleur, e, bonus) {
        if (e._ctVole) { CombatTactique.annoncer(e, 'Plus rien à voler', '#c0c0c0'); return; }
        var liste = butinDe(e);
        if (!liste.length) { CombatTactique.annoncer(e, 'Rien à voler', '#c0c0c0'); return; }
        var ratio = voleur && e.agi > 0 ? Math.max(0.5, Math.min(2, voleur.agi / e.agi)) : 1;
        var reussi = null;
        for (var i = 0; i < liste.length && !reussi; i++) {
            var base = liste[i].chance !== null ? liste[i].chance : VOL_CHANCE;
            var ch = Math.max(0.05, Math.min(0.95, base * ratio + (bonus || 0)));
            if (Math.random() < ch) reussi = liste[i];
        }
        if (!reussi) { CombatTactique.annoncer(e, 'Vol raté', '#c0c0c0'); return; }
        e._ctVole = true;
        if (reussi.or) { $gameParty.gainGold(reussi.or); CombatTactique.annoncer(e, 'Volé : ' + reussi.or + ' ' + TextManager.currencyUnit, '#ffe680'); }
        else { $gameParty.gainItem(reussi.objet, 1); CombatTactique.annoncer(e, 'Volé : ' + reussi.objet.name, '#ffe680'); }
        AudioManager.playSe({ name: 'Item3', volume: 80, pitch: 110, pan: 0 });
    }
    CombatTactique.voler = voler;

    //=========================================================================
    // La difficulté (option)
    //=========================================================================
    ConfigManager.difficulte = 1;
    var _mk = ConfigManager.makeData;
    ConfigManager.makeData = function () { var c = _mk.call(this); c.difficulte = this.difficulte; return c; };
    var _ap = ConfigManager.applyData;
    ConfigManager.applyData = function (c) {
        _ap.call(this, c);
        var v = Number(c.difficulte);
        this.difficulte = c.difficulte === undefined || isNaN(v) ? 1 : Math.max(0, Math.min(2, v));
    };
    CombatTactique.difficulte = function () { return DIFF[ConfigManager.difficulte] || DIFF[1]; };
    var _ePR = Game_Enemy.prototype.paramRate;
    Game_Enemy.prototype.paramRate = function (id) {
        var r = _ePR.call(this, id), d = DIFF[ConfigManager.difficulte] || DIFF[1];
        if (id === 0) return r * d.pv;
        if (id === 2 || id === 4) return r * d.force;
        return r;
    };
    var _go = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function () { _go.call(this); this.addCommand('Difficulté', 'difficulte'); };
    var _st = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function (index) {
        if (this.commandSymbol(index) === 'difficulte') return (DIFF[this.getConfigValue('difficulte')] || DIFF[1]).nom;
        return _st.call(this, index);
    };
    function bouger(fen, sens, boucle) {
        var v = Number(fen.getConfigValue('difficulte'));
        if (isNaN(v)) v = 1;
        v += sens;
        v = boucle ? (v + 3) % 3 : Math.max(0, Math.min(2, v));
        fen.changeValue('difficulte', v);
    }
    var _ok = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function () {
        if (this.commandSymbol(this.index()) === 'difficulte') return bouger(this, 1, true);
        _ok.call(this);
    };
    var _dr = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function (wrap) {
        if (this.commandSymbol(this.index()) === 'difficulte') return bouger(this, 1, false);
        _dr.call(this, wrap);
    };
    var _ga = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function (wrap) {
        if (this.commandSymbol(this.index()) === 'difficulte') return bouger(this, -1, false);
        _ga.call(this, wrap);
    };

    //=========================================================================
    // Les commandes
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pc.call(this, command, args);
        var c = String(command || '').toUpperCase(), a = String(args[0] || '');
        if (c === 'LIMITE') {
            if (/^plein/i.test(a)) $gameParty.fixerLimite(LIM_MAX);
            else if (/^vide/i.test(a)) $gameParty.fixerLimite(0);
            else if (/^=/.test(a)) $gameParty.fixerLimite(Number(a.slice(1)) || 0);
            else if (!isNaN(Number(a))) $gameParty.changerLimite(Number(a));
        } else if (c === 'BARRIERE' || c === 'BARRIÈRE') {
            var h = $gameActors.actor(Number(a));
            if (h) h.fixerBarriere(Number(args[1]) || 0);
        } else if (c === 'DIFFICULTE' || c === 'DIFFICULTÉ') {
            var n = a.toLowerCase().replace(/é/g, 'e');
            var i = n === 'facile' ? 0 : n === 'normal' ? 1 : /^(difficile|dur)$/.test(n) ? 2 : -1;
            if (i >= 0) { ConfigManager.difficulte = i; ConfigManager.save(); }
        }
    };
})();
