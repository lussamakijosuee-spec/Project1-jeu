//=============================================================================
// LaBibliothequeDAel.js — v2.0
// Aël : le livre (court et juste), la Parole lue, et le Miracle par l'histoire.
//=============================================================================
/*:
 * @plugindesc v2.0 ■ Aël : chaque petite Parole écrit une page de son livre ;
 * livre plein, son ultime est LUE — elle part tout de suite, sans son prix.
 * Le Miracle n'arrive que par l'histoire (un interrupteur).
 * @author pour JOKO
 *
 * @param acteur
 * @text Aël (acteur)
 * @type actor
 * @default 4
 *
 * @param === LE LIVRE ===
 * @default
 *
 * @param pages
 * @text Pages du livre
 * @type number
 * @min 1
 * @default 3
 * @desc Livre plein à tant de pages : sa prochaine ultime est lue.
 *
 * @param seuilPM
 * @text Une petite Parole coûte au plus (PM)
 * @type number
 * @default 20
 * @desc Une compétence de 1 à tant de PM écrit une page (et lit l'ennemi, après le Miracle). Plus chère : elle n'écrit rien, et efface la lecture.
 *
 * @param typeUltime
 * @text Branche des ultimes
 * @type number
 * @default 3
 * @desc Le type de compétence dont la prochaine est lue quand le livre est plein (3 = « ult »).
 *
 * @param sansIncantation
 * @text Lue, elle part tout de suite
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc La Parole lue n'incante pas (CielDAel lui donne une charge de 0, comme sous le bon ciel).
 *
 * @param sansPrix
 * @text Lue, elle part sans son prix
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Ni PV, ni les états qu'elle se pose elle-même après (voir « États du prix »).
 *
 * @param etatsPrix
 * @text États du prix
 * @default 193,218
 * @desc Ceux que la Parole lue ne lui pose pas : 193 Doute Paralysant (Éclat de Conviction), 218 Surcharge (CielDAel).
 *
 * @param === LE MIRACLE ===
 * @default
 *
 * @param interrupteurMiracle
 * @text Interrupteur du Miracle
 * @type switch
 * @default 27
 * @desc Allumé par l'événement de l'histoire. Éteint : ni Lecture, ni Miracle, branche « miracle » cachée. 0 = toujours là.
 *
 * @param typeMiracle
 * @text Branche « miracle »
 * @type number
 * @default 20
 * @desc Cachée tant que l'interrupteur est éteint (rien n'est désappris).
 *
 * @param gainLecture
 * @text Lecture gagnée par petite Parole (%)
 * @type number
 * @default 25
 * @desc « C'est lent » : 25 % = quatre petites Paroles pour un Miracle.
 *
 * @param flechesIds
 * @text Pages du Miracle (élément:compétence)
 * @default 29:1268,14:1269,3:1270,9:1271,12:1272
 * @desc Le Crépuscule d'abord : en cas d'égalité, c'est lui qu'elle trouve.
 *
 * @param === LE CONTRAT ET LES PORTES ===
 * @default
 *
 * @param etatContrat
 * @text État — Sous Contrat (l'allié)
 * @type state
 * @default 237
 *
 * @param etatContratForce
 * @text État — Lié de force (l'ennemi)
 * @type state
 * @default 238
 *
 * @param rangsImmunises
 * @text Rangs que la Porte ne ferme pas
 * @default S
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  AËL — LE LIVRE                                                       JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  JOKO, le 2026-10-19 : « le livre qui se remplit quand elle dit court et
 *  juste, l'ultime le plus rapide, le Miracle seulement par l'histoire,
 *  Contrats et Portes sortis de sa boucle ».
 *
 *  Son profil : « en ultime, elle est la meilleure — et la plus rapide à le
 *  sortir. » Le canon de la Parole : « dire court et juste bat presque
 *  toujours dire long et tremblant », et les Paroles écrites « agissent sans
 *  être récitées ».
 *
 *  A · LE LIVRE
 *     Chaque compétence qu'elle lance pour 1 à 20 PM écrit une page — sur un
 *     ennemi, un allié ou elle-même. L'Attaque, la Garde, ce qui est gratuit
 *     n'écrivent rien ; une Parole plus chère n'écrit rien non plus, sans
 *     rien effacer. C'est le PRIX de la Parole qui compte, pas qui le paie :
 *     le Contrat ne remplit pas le livre. Vide au début et à la fin du combat.
 *
 *  B · LA PAROLE LUE
 *     Livre plein (3 pages) : sa prochaine compétence de la branche « ult »
 *     est lue. Elle part tout de suite (pas d'incantation), sans PV et sans
 *     les états du prix (Doute Paralysant, Surcharge). Même puissance, même
 *     coût en PM, même recharge. Le livre se vide. Sans livre plein, ses
 *     ultimes marchent comme avant.
 *
 *  C · LE MIRACLE — SEULEMENT PAR L'HISTOIRE
 *     Tant que l'interrupteur 27 est éteint : ni Lecture, ni Miracle, et la
 *     branche « miracle » est cachée. Allumé par l'événement de JOKO : chaque
 *     petite Parole lit l'ennemi visé (+25 %) ; une Parole de plus de 20 PM
 *     efface la lecture (« elle perd le fil ») ; à 100 %, une page s'écrit
 *     d'elle-même — la technique de l'élément qui le blesse le plus,
 *     apprise pour toujours et lancée aussitôt, gratuitement.
 *
 *  D · LE CONTRAT ET LES PORTES — gardés, hors de la boucle
 *     Ils font ce qu'ils faisaient. Une Porte à 20 PM ou moins écrit une page
 *     comme n'importe quelle petite Parole. Le Contrat paie toujours ses PM.
 *     le Voile (précision −40 % à tous) · l'Oubli (ATQ/MAG −40 %) · le Gouffre
 *     (perce la moitié de la DÉF.M) · les Pieux de Cristal (ignorent toute
 *     défense, 30 % de cristalliser) · la Fermeture (retire un ennemi trois
 *     tours — pas un rang S, pas un boss à mécaniques, pas le dernier debout)
 *     · l'Allègement (un allié : AGI ×1,5, esquive +20 %).
 *
 *  À charger APRÈS CielDAel (la Parole lue passe avant son incantation).
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('LaBibliothequeDAel');
    var AEL = parseInt(P['acteur'] || 4, 10);
    var PAGES = Math.max(1, parseInt(P['pages'] || 3, 10));
    var SEUIL_PM = parseInt(P['seuilPM'] || 20, 10);
    var TYPE_ULT = parseInt(P['typeUltime'] || 3, 10);
    var SANS_INCANTATION = String(P['sansIncantation'] || 'true') !== 'false';
    var SANS_PRIX = String(P['sansPrix'] || 'true') !== 'false';
    var ETATS_PRIX = String(P['etatsPrix'] || '193,218').split(',')
        .map(function (x) { return parseInt(x, 10); }).filter(function (x) { return x > 0; });
    var INTER_MIRACLE = parseInt(P['interrupteurMiracle'] || 0, 10);
    var TYPE_MIRACLE = parseInt(P['typeMiracle'] || 20, 10);
    var GAIN = parseFloat(P['gainLecture'] || 25) / 100;
    var FLECHES = String(P['flechesIds'] || '29:1268,14:1269,3:1270,9:1271,12:1272').split(',')
        .map(function (x) { var t = x.split(':'); return { el: parseInt(t[0], 10), id: parseInt(t[1], 10) }; })
        .filter(function (x) { return x.el > 0 && x.id > 0; });
    var ETAT_CONTRAT = parseInt(P['etatContrat'] || 237, 10);
    var ETAT_FORCE = parseInt(P['etatContratForce'] || 238, 10);
    var IMMUNES = String(P['rangsImmunises'] || 'S').split(',').map(function (x) { return x.trim().toUpperCase(); });

    function estAel(b) { return !!(b && b.isActor && b.isActor() && b.actorId() === AEL); }
    function ael() { return $gameActors ? $gameActors.actor(AEL) : null; }
    function enCombat() { return !!($gameParty && $gameParty.inBattle()); }
    function journal(t) { var w = SceneManager._scene && SceneManager._scene._logWindow; if (w) { w.push('addText', t); } }
    // Le journal est muet en vue de côté (SimpleMsgSideView) : ce qui doit se voir flotte aussi au-dessus de qui
    // le fait (2026-10-23 ; le journal reste, pour les bancs).
    function annonce(b, texte, couleur) {
        if (b && window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, texte, couleur || '#ffffff'); }
    }
    function tag(it, nom) { return !!(it && it.meta && it.meta[nom] !== undefined); }
    function miracleOuvert() { return INTER_MIRACLE <= 0 || !!($gameSwitches && $gameSwitches.value(INTER_MIRACLE)); }

    /** 'petite' (1 à 20 PM), 'longue' (plus), ou '' (gratuit, objet). Le prix, pas qui paie. */
    function taille(b, item) {
        if (!DataManager.isSkill(item)) { return ''; }
        var c = b.skillMpCost(item);
        if (c <= 0) { return ''; }
        return c <= SEUIL_PM ? 'petite' : 'longue';
    }

    // ═════════════════════════════════════════════════════════════════════
    // D · LE CONTRAT — qui paie ses PM (inchangé)
    // ═════════════════════════════════════════════════════════════════════
    function partenaire(a) {
        var c = a && a._contrat;
        if (!c || !enCombat()) { return null; }
        var b = c.acteur ? $gameActors.actor(c.acteur) : $gameTroop.members()[c.ennemi];
        if (!b || !b.isAlive()) { return null; }
        if (b.isActor() && $gameParty.battleMembers().indexOf(b) < 0) { return null; }
        return b;
    }
    function rompre(a) {
        var b = a && a._contrat ? (a._contrat.acteur ? $gameActors.actor(a._contrat.acteur) : $gameTroop.members()[a._contrat.ennemi]) : null;
        if (b) { b.removeState(ETAT_CONTRAT); b.removeState(ETAT_FORCE); }
        if (a) { a._contrat = null; }
    }

    var _peutPayer = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
        if (estAel(this)) {
            var b = partenaire(this);
            if (b && b.mp >= this.skillMpCost(skill) && this._tp >= this.skillTpCost(skill)) { return true; }
        }
        return _peutPayer.call(this, skill);
    };
    var _payer = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function (skill) {
        if (!estAel(this)) { return _payer.call(this, skill); }
        if (this._miracleGratuit) { this._miracleGratuit = false; return; }
        var cout = this.skillMpCost(skill), b = partenaire(this);
        if (b && cout > 0 && b.mp >= cout) {
            b.gainMp(-cout);
            this._tp -= this.skillTpCost(skill);
            return;
        }
        _payer.call(this, skill);
    };

    // ═════════════════════════════════════════════════════════════════════
    // A · LE LIVRE
    // ═════════════════════════════════════════════════════════════════════
    function pages(a) { return (a && a._livreAel) || 0; }
    function ecrire(a) {
        if (pages(a) >= PAGES) { return; }
        a._livreAel = pages(a) + 1;
        if (a._livreAel >= PAGES) { journal('\\C[14]📖 Le livre de ' + a.name() + ' est plein.\\C[0]'); }
        if (a._livreAel >= PAGES) { annonce(a, '📖 Livre plein', '#ffd54a'); }
    }

    // ═════════════════════════════════════════════════════════════════════
    // B · LA PAROLE LUE
    // ═════════════════════════════════════════════════════════════════════
    // Décidée au moment où elle agit, AVANT CielDAel (chargé plus haut) :
    // c'est lui qui lit _paroleLue pour ne pas l'incanter.
    var _startAction = BattleManager.startAction;
    BattleManager.startAction = function () {
        var a = this._subject;
        if (estAel(a) && !a._incantation && !a._incantationRompue && pages(a) >= PAGES) {
            var act = a.currentAction(), it = act && act.item();
            if (act && act.isSkill() && it && it.stypeId === TYPE_ULT && a.canUse(it)) {
                a._paroleLue = it.id;
                a._livreAel = 0;
                journal('\\C[14]📖 ' + a.name() + ' lit « ' + it.name + ' » dans son livre.\\C[0]');
                annonce(a, '📖 Lue : ' + it.name, '#ffd54a');
            }
        }
        _startAction.call(this);
    };
    Game_Battler.prototype.paroleLue = function (item) {
        return SANS_INCANTATION && !!item && this._paroleLue === item.id;
    };

    // Sans son prix : ni PV…
    var _coutPV = Game_BattlerBase.prototype.skillHpCost;
    if (_coutPV) {
        Game_BattlerBase.prototype.skillHpCost = function (skill) {
            if (SANS_PRIX && estAel(this) && skill && this._paroleLue === skill.id) { return 0; }
            return _coutPV.call(this, skill);
        };
    }
    // … ni les états qu'elle se pose elle-même après.
    var _poser = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        if (SANS_PRIX && estAel(this) && this._paroleLue && ETATS_PRIX.indexOf(stateId) >= 0) { return; }
        _poser.call(this, stateId);
    };

    var _finAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        var a = this._subject;
        if (estAel(a)) { a._paroleLue = 0; }
        _finAction.call(this);
    };

    // ═════════════════════════════════════════════════════════════════════
    // C · LE MIRACLE — seulement par l'histoire
    // ═════════════════════════════════════════════════════════════════════
    function lecture(e) { return (e && e._lectureAel) || 0; }
    function toutEffacer() { $gameTroop.members().forEach(function (e) { e._lectureAel = 0; }); }

    /** La meilleure technique contre cet ennemi — ou null s'il résiste à tout. */
    function flecheContre(e) {
        var best = null, taux = -1;
        FLECHES.forEach(function (f) {
            var r = e.elementRate(f.el);
            if (r > taux + 1e-9) { taux = r; best = f; }       // l'ordre du réglage départage : Crépuscule d'abord
        });
        return taux >= 1 ? { fleche: best, taux: taux } : null;
    }

    function miracle(a, e) {
        e._lectureAel = 0;
        var t = flecheContre(e);
        if (!t) { annonce(e, '📖 Pas de faille', '#b0b0b0'); }
        if (!t) { journal('\\C[8]📖 ' + a.name() + ' lit ' + e.name() + '… et ne trouve pas la faille.\\C[0]'); return; }
        var sk = $dataSkills[t.fleche.id];
        if (!sk) { return; }
        var neuve = !a.isLearnedSkill(sk.id);
        if (neuve) { a.learnSkill(sk.id); }
        journal('\\C[14]✦ MIRACLE — ' + a.name() + (neuve ? ' développe « ' : ' retrouve « ') + sk.name + ' »\\C[0]');
        annonce(a, '✦ MIRACLE — ' + sk.name, '#ffd54a');
        a._miracleGratuit = true;
        BattleManager.queueForceAction(a, sk.id, e.index());
    }

    function lire(a, item) {
        var act = a.currentAction(), cible = null;
        if (act && act.item() === item && act.isForOpponent() && act.isForOne()) {
            cible = $gameTroop.members()[act._targetIndex];
            if (cible && !cible.isAlive()) { cible = null; }
        }
        if (!cible) { cible = $gameTroop.members()[a._focusAel]; }
        if (!cible || !cible.isAlive()) { cible = $gameTroop.aliveMembers()[0]; }
        if (!cible) { return; }
        a._focusAel = $gameTroop.members().indexOf(cible);
        cible._lectureAel = Math.min(1, lecture(cible) + GAIN);
        if (cible._lectureAel >= 1 - 1e-9) { miracle(a, cible); }
    }

    // Le livre et la Lecture se jouent quand elle agit (le coût vient d'être payé).
    var _useItem = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function (item) {
        var ici = estAel(this) && enCombat();
        var gratuit = ici && this._miracleGratuit;
        var dejaPaye = ici && item && this._payeeDejaPour === item.id;   // CielDAel : la Parole qui part après l'incantation
        _useItem.call(this, item);
        if (!ici || gratuit || dejaPaye) { return; }
        var t = taille(this, item);
        if (t === 'petite' && !this._paroleLue) { ecrire(this); }
        if (!miracleOuvert()) { return; }
        if (t === 'longue') {
            var enCours = $gameTroop.members().some(function (e) { return lecture(e) > 0; });
            toutEffacer();
            if (enCours) { journal('\\C[8]📖 ' + this.name() + ' dit trop long — elle perd le fil.\\C[0]'); }
            if (enCours) { annonce(this, '📖 Trop long : le fil est perdu', '#b0b0b0'); }
        } else if (t === 'petite') {
            lire(this, item);
        }
    };

    // La branche « miracle » n'existe pas avant l'histoire.
    var _types = Game_Actor.prototype.addedSkillTypes;
    Game_Actor.prototype.addedSkillTypes = function () {
        var t = _types.call(this);
        if (estAel(this) && !miracleOuvert()) { t = t.filter(function (x) { return x !== TYPE_MIRACLE; }); }
        return t;
    };

    // ═════════════════════════════════════════════════════════════════════
    // D · Les effets des Portes et des Contrats (inchangés)
    // ═════════════════════════════════════════════════════════════════════
    function estBoss(e) {
        var n = (e.enemy() && e.enemy().note) || '';
        var m = /<\s*Rang\s*:\s*([^>]*)>/i.exec(n);
        if (m && IMMUNES.indexOf(String(m[1]).trim().toUpperCase()) >= 0) { return true; }
        return /<\s*(Meca\w*|Phases)\s*:/i.test(n);
    }

    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        var u = this.subject(), it = this.item();
        if (!estAel(u) || !it || !enCombat() || !target) { return; }

        if (tag(it, 'Contrat') && target.isActor()) {
            if (target === u) { annonce(u, 'Un Contrat, c\'est avec un autre', '#b0b0b0'); }
            if (target === u) { journal('\\C[8]Un Contrat se passe avec quelqu\'un d\'autre.\\C[0]'); return; }
            rompre(u);
            u._contrat = { acteur: target.actorId() };
            target.addState(ETAT_CONTRAT);
            journal('\\C[14]✦ ' + u.name() + ' passe un Contrat avec ' + target.name() + ' : c\'est lui qui paie.\\C[0]');
            annonce(target, '✦ Contrat : c\'est lui qui paie', '#ffd54a');
        }
        if (tag(it, 'ContratForce') && target.isEnemy()) {
            rompre(u);
            u._contrat = { ennemi: target.index() };
            target.addState(ETAT_FORCE);
            journal('\\C[14]✦ ' + u.name() + ' force un Contrat sur ' + target.name() + ' : elle puisera dans ses PM.\\C[0]');
            annonce(target, '✦ Contrat forcé : ses PM paient', '#ffd54a');
        }
        if (tag(it, 'PorteFermee') && target.isEnemy() && target.isAlive()) {
            if (estBoss(target)) { annonce(target, 'La Porte ne se ferme pas', '#b0b0b0'); }
            if (estBoss(target)) { journal('\\C[8]La Porte ne se ferme pas sur ' + target.name() + '.\\C[0]'); return; }
            if ($gameTroop.aliveMembers().length <= 1) { annonce(target, 'Pas sur le dernier debout', '#b0b0b0'); }
            if ($gameTroop.aliveMembers().length <= 1) { journal('\\C[8]La Porte ne se ferme pas sur le dernier debout.\\C[0]'); return; }
            var tours = parseInt(it.meta.PorteFermee, 10) || 3;
            target._porteRetour = $gameTroop.turnCount() + tours;
            target.hide();
            journal('\\C[14]✦ La Porte se referme sur ' + target.name() + ' — ' + tours + ' tours.\\C[0]');
            annonce(target, '✦ La Porte · ' + tours + ' tours', '#ffd54a');
        }
    };

    // Les exilés reviennent à la fin du tour où leur temps est écoulé.
    var _finTour = BattleManager.endTurn;
    BattleManager.endTurn = function () {
        _finTour.call(this);
        var t = $gameTroop.turnCount();
        $gameTroop.members().forEach(function (e) {
            if (e._porteRetour && t >= e._porteRetour) {
                e._porteRetour = 0;
                e.appear();
                journal(e.name() + ' revient de l\'autre côté de la Porte.');
                annonce(e, '✦ Revient de la Porte', '#ffd54a');
            }
        });
    };

    // Début et fin de combat : le livre est vide, on rompt, on efface.
    var _debut = BattleManager.setup;
    BattleManager.setup = function (troopId, canEscape, canLose) {
        var a = ael();
        if (a) { a._livreAel = 0; a._paroleLue = 0; }
        return _debut.apply(this, arguments);
    };
    var _fin = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        var a = ael();
        if (a) { rompre(a); a._focusAel = 0; a._miracleGratuit = false; a._livreAel = 0; a._paroleLue = 0; }
        return _fin.call(this, result);
    };

    // ═════════════════════════════════════════════════════════════════════
    // À l'écran : le livre (et la Lecture, après le Miracle ; le Contrat)
    // ═════════════════════════════════════════════════════════════════════
    function Window_Livre() { this.initialize.apply(this, arguments); }
    Window_Livre.prototype = Object.create(Window_Base.prototype);
    Window_Livre.prototype.constructor = Window_Livre;
    Window_Livre.prototype.initialize = function (x, y) {
        Window_Base.prototype.initialize.call(this, x, y, 330, this.fittingHeight(1));
        this.opacity = 0; this._cle = ''; this.refresh();
    };
    Window_Livre.prototype.texte = function () {
        var a = ael();
        if (!a || $gameParty.battleMembers().indexOf(a) < 0) { return ''; }
        var n = pages(a), t = '📖 ';
        for (var i = 0; i < PAGES; i++) { t += i < n ? '■' : '□'; }   // dans la police du jeu (mplus), ▮▯ n'y sont pas sûrs
        if (miracleOuvert()) {
            var e = $gameTroop.members()[a._focusAel || 0];
            if (e && e.isAlive() && lecture(e) > 0) { t += ' · ' + e.name() + ' ' + Math.round(lecture(e) * 100) + ' %'; }
        }
        var b = partenaire(a);
        if (b) { t += ' · Contrat : ' + b.name(); }
        return t;
    };
    Window_Livre.prototype.refresh = function () {
        this.contents.clear();
        var t = this.texte();
        if (!t) { return; }
        this.contents.fontSize = 17;
        this.contents.outlineColor = 'rgba(0,0,0,0.9)';
        this.changeTextColor(pages(ael()) >= PAGES ? '#ffd54a' : '#ffffff');
        this.drawText(t, 4, 2, this.contentsWidth() - 8, 'left');
        this.resetTextColor();
    };
    Window_Livre.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        var t = this.texte();
        if (t !== this._cle) { this._cle = t; this.refresh(); }
    };
    var _fenetres = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function () {
        _fenetres.call(this);
        var sw = this._statusWindow;
        var y = sw ? sw.y - 56 : Graphics.boxHeight - 240;
        this._fenetreLecture = new Window_Livre(300, y);
        this.addChild(this._fenetreLecture);
    };

    // ═════════════════════════════════════════════════════════════════════
    // De quoi le mesurer sans deviner
    // ═════════════════════════════════════════════════════════════════════
    window.BibliothequeAel = {
        lecture: lecture,
        pages: function () { return pages(ael()); },
        pagesMax: PAGES,
        miracleOuvert: miracleOuvert,
        flecheContre: function (e) { var t = flecheContre(e); return t ? { id: t.fleche.id, el: t.fleche.el, taux: t.taux } : null; },
        partenaire: function () { return partenaire(ael()); },
        estBoss: estBoss,
        fleches: FLECHES,
        seuilPM: SEUIL_PM
    };
})();
