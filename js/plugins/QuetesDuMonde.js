//=============================================================================
// QuetesDuMonde.js — v1.0
// Les quêtes de JOKO : le langage QUEST, le journal YEP, et ce qui compte tout seul.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les commandes QUEST (add, obj, step, done, fail, track, ecran),
 * $gameSystem.questStatus / questDone, le suivi sur la carte, les compteurs de
 * chasse, de visite et de technique — le tout affiché par YEP_QuestJournal.
 * @author pour JOKO
 *
 * @param suiviSurLaCarte
 * @text Afficher la quête suivie sur la carte
 * @type boolean
 * @default true
 *
 * @param varChasse
 * @text Première variable des compteurs
 * @type variable
 * @default 300
 * @desc Les compteurs de chasse, de visite et de technique vivent à partir de cette
 * variable (une par compteur, dans l'ordre de leur déclaration).
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  POURQUOI CE GREFFON EXISTE
 * ═══════════════════════════════════════════════════════════════════════════
 *  Les cartes de JOKO portent déjà des quêtes — le couteau de Tobin, les trois
 *  rumeurs de Sarielle — écrites avec les commandes « QUEST … » du greffon
 *  QuestJournal.js, parti à la restauration du 15/09. Depuis, ces commandes
 *  dormaient en commentaire et « $gameSystem.questStatus('rumeurs') »
 *  plantait le PNJ qui l'appelait. JOKO, 2026-09-26 : « ce qui me manque
 *  particulièrement, c'est les événements de quête ».
 *
 *  Ce greffon parle le MÊME langage (docs/RECETTES.md §8) pour que tout ce qui
 *  était écrit revive tel quel, et il affiche tout dans le journal de
 *  YEP_QuestJournal (menu « Quêtes ») — JOKO : « utilise les plugins YEP ».
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES COMMANDES (les guillemets gardent les espaces)
 * ═══════════════════════════════════════════════════════════════════════════
 *    QUEST add main  <id> "Titre" "Description"
 *    QUEST add side  <id> "Titre" "Description"
 *    QUEST add perso <id> "Titre" "Description"       (quête de personnage)
 *    QUEST add tuto  <id> "Titre" "Description"       (apprentissage)
 *    QUEST de   <id> "Nom du PNJ" "Lieu"              (facultatif, pour le journal)
 *    QUEST obj  <id> "Texte de l'objectif"            (en ajoute un, visible)
 *    QUEST prix <id> "Texte de la récompense"         (l'annonce dans le journal)
 *    QUEST step <id> <n>          l'objectif n est accompli (1-based)
 *    QUEST step <id> next         le prochain objectif non accompli
 *    QUEST done <id>   ·   QUEST fail <id>
 *    QUEST track <id>  ·   QUEST untrack
 *    QUEST ecran                  ouvre le journal
 *
 *  LES COMPTEURS — un objectif qui s'accomplit tout seul :
 *    QUEST chasse <id> <n objectif> <cible> "Nom d'ennemi" ["autre nom"…]
 *         → chaque ennemi de ce nom tué en combat compte ; à <cible>, l'objectif
 *           tombe. Le texte de l'objectif peut porter %1 (compte) et %2 (cible).
 *    QUEST visite <id> <n objectif> <idCarte>
 *         → l'objectif tombe en arrivant sur cette carte.
 *    QUEST usage  <id> <n objectif> <cible> <idCompétence> [<id>…]
 *         → l'objectif tombe quand ces compétences ont été employées <cible> fois.
 *    QUEST style  <id> <n objectif> <cible>
 *         → Vesper a changé de Style <cible> fois en combat.
 *    QUEST commande <id> <n objectif> <cible> <MOT>
 *         → une commande de greffon de ce nom (FEU, FORGE, MARCHAND…) a été
 *           exécutée <cible> fois — « se reposer à un Feu d'Âme ».
 *    QUEST achat <id> <n objectif> <cible>
 *         → <cible> achats faits dans une boutique.
 *    QUEST auto <id>
 *         → la quête s'accomplit d'elle-même quand tous ses objectifs tombent
 *           (pas de PNJ à revoir).
 *
 *  SCRIPTS
 *    $gameSystem.questStatus('id')   → 'active' | 'done' | 'failed' | 'none'
 *    $gameSystem.questDone('id')     → true / false
 *    $gameSystem.questObjDone('id', n) → l'objectif n est-il accompli ?
 *    $gameSystem.questCompte('id', n)  → le compte d'un compteur
 *
 *  Le journal YEP ne connaît que des numéros : chaque identifiant reçoit le
 *  premier numéro libre au-delà des quêtes écrites dans ses paramètres, et
 *  tout est reconstruit au chargement d'une partie.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('QuetesDuMonde');
    var SUIVI = String(P['suiviSurLaCarte'] || 'true') === 'true';
    var VAR0 = parseInt(P['varChasse'] || 300, 10);
    var TYPES = { main: 'Quêtes principales', side: 'Quêtes secondaires', perso: 'Quêtes de personnage', tuto: 'Apprentissage' };
    var ICONES = { main: 87, side: 84, perso: 82, tuto: 79 };

    function decouper(str) {
        // Les guillemets gardent les espaces ; hors guillemets, « _ » vaut un espace (RECETTES §8 :
        // « Le_Réveil L'aventure_commence. ») — les quêtes des cartes de démo l'emploient.
        var re = /"([^"]*)"|(\S+)/g, m, out = [];
        while ((m = re.exec(str)) !== null) { out.push(m[1] !== undefined ? m[1] : m[2].replace(/_/g, ' ')); }
        return out;
    }

    // ── le magasin, sauvegardé avec la partie ───────────────────────────────
    function magasin() {
        if (!$gameSystem._quetes) { $gameSystem._quetes = {}; $gameSystem._quetesOrdre = []; $gameSystem._quetesCompteurs = []; }
        return $gameSystem._quetes;
    }
    Game_System.prototype.quete = function (id) { return magasin()[id] || null; };
    Game_System.prototype.questStatus = function (id) { var q = this.quete(id); return q ? q.status : 'none'; };
    Game_System.prototype.questDone = function (id) { return this.questStatus(id) === 'done'; };
    Game_System.prototype.questObjDone = function (id, n) { var q = this.quete(id); return !!(q && q.objs[n - 1] && q.objs[n - 1].done); };
    Game_System.prototype.questCompte = function (id, n) {
        var c = compteur(id, n); return c ? $gameVariables.value(c.variable) : 0;
    };
    Game_System.prototype.questList = function () {
        var s = magasin(); return ($gameSystem._quetesOrdre || []).map(function (id) { return s[id]; }).filter(Boolean);
    };

    // ── le pont vers YEP_QuestJournal ───────────────────────────────────────
    function numeroLibre() {
        var pris = {}; var s = magasin();
        Object.keys(s).forEach(function (k) { pris[s[k].numero] = true; });
        var n = 1;
        while ((window.$dataQuests && $dataQuests[n] && !s[numeroVers(n)]) || pris[n]) { n++; }
        return n;
    }
    function numeroVers(n) { var s = magasin(); for (var k in s) { if (s[k].numero === n) { return k; } } return null; }
    function texteObjectif(q, o) {
        var t = o.text;
        if (o.compteur) { var c = compteurDe(q.id, o.compteur); if (c) { t = t.replace('%1', String($gameVariables.value(c.variable))).replace('%2', String(c.cible)); } }
        return t;
    }
    function publier(q) {
        if (!window.$dataQuests || !DataManager.questDatabaseAdd) { return; }
        var objs = q.objs.map(function (o) { return JSON.stringify(texteObjectif(q, o)); });
        var prix = q.prix.length ? q.prix.map(function (p) { return JSON.stringify(p); }) : [JSON.stringify('')];
        var data = {
            'Title': '\\i[' + (ICONES[q.type] || 84) + ']' + q.title,
            'Type': TYPES[q.type] || TYPES.side,
            'Difficulty': q.difficulte || '—',
            'From': q.de || '—',
            'Location': q.lieu || '—',
            'Description': JSON.stringify([JSON.stringify(q.desc || '')]),
            'Objectives List': JSON.stringify(objs.length ? objs : [JSON.stringify('')]),
            'Visible Objectives': JSON.stringify(objs.map(function (_, i) { return String(i + 1); })),
            'Rewards List': JSON.stringify(prix),
            'Visible Rewards': JSON.stringify(prix.map(function (_, i) { return String(i + 1); })),
            'Subtext': JSON.stringify([JSON.stringify('')])
        };
        DataManager.questDatabaseAdd(q.numero, data);
        // l'état des objectifs, tel que YEP le garde
        q.objs.forEach(function (o, i) {
            if (o.done) { $gameSystem.questObjectivesComplete(q.numero, i + 1); }
            else { $gameSystem.questObjectivesNormal(q.numero, i + 1); }
        });
    }
    function republierTout() {
        if (!window.$dataQuests) { return; }
        $gameSystem.questList().forEach(function (q) {
            publier(q);
            var dispo = $gameSystem.getQuestsAvailable(), finies = $gameSystem.getQuestsCompleted(), ratees = $gameSystem.getQuestsFailed();
            if (q.status === 'active' && dispo.indexOf(q.numero) < 0) { $gameSystem.questAdd(q.numero); }
            if (q.status === 'done' && finies.indexOf(q.numero) < 0) { $gameSystem.questAdd(q.numero); $gameSystem.questSetCompleted(q.numero); }
            if (q.status === 'failed' && ratees.indexOf(q.numero) < 0) { $gameSystem.questAdd(q.numero); $gameSystem.questSetFailed(q.numero); }
        });
    }
    var _chargee = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _chargee.call(this, contents);
        republierTout();
    };
    var _neuve = DataManager.setupNewGame;
    DataManager.setupNewGame = function () {
        _neuve.call(this);
        if (DataManager.questDatabaseCreate) { DataManager.questDatabaseCreate(); }
    };

    // ── le modèle ───────────────────────────────────────────────────────────
    function ajouter(type, id, titre, desc) {
        var s = magasin();
        if (s[id]) { return; }                                      // déjà là : on ne recommence pas
        $gameSystem._quetesOrdre.push(id);
        s[id] = { id: id, type: TYPES[type] ? type : 'side', title: titre || id, desc: desc || '', objs: [], prix: [], status: 'active', numero: numeroLibre(), de: '', lieu: '' };
        publier(s[id]);
        $gameSystem.questAdd(s[id].numero);
        if (!$gameSystem._queteSuivie) { $gameSystem._queteSuivie = id; }
        annoncer('\\C[14]Nouvelle quête : ' + s[id].title + '\\C[0]');
    }
    function objectif(id, texte) {
        var q = magasin()[id]; if (!q) { return; }
        q.objs.push({ text: texte, done: false });
        publier(q);
    }
    function recompense(id, texte) { var q = magasin()[id]; if (!q) { return; } q.prix.push(texte); publier(q); }
    function origine(id, de, lieu) { var q = magasin()[id]; if (!q) { return; } q.de = de || ''; q.lieu = lieu || ''; publier(q); }
    function accomplir(id, n) {
        var q = magasin()[id]; if (!q) { return; }
        var i;
        if (n === 'next') { for (i = 0; i < q.objs.length; i++) { if (!q.objs[i].done) { break; } } }
        else { i = parseInt(n, 10) - 1; }
        if (!q.objs[i] || q.objs[i].done) { return; }
        q.objs[i].done = true;
        $gameSystem.questObjectivesComplete(q.numero, i + 1);
        annoncer('\\C[3]Objectif accompli : ' + texteObjectif(q, q.objs[i]) + '\\C[0]');
        if (q.auto && q.objs.every(function (o) { return o.done; })) { terminer(id, true); }
    }
    function terminer(id, ok) {
        var q = magasin()[id]; if (!q || q.status !== 'active') { return; }
        q.status = ok ? 'done' : 'failed';
        if (ok) { q.objs.forEach(function (o, i) { o.done = true; $gameSystem.questObjectivesComplete(q.numero, i + 1); }); }
        if (ok) { $gameSystem.questSetCompleted(q.numero); } else { $gameSystem.questSetFailed(q.numero); }
        if ($gameSystem._queteSuivie === id) { $gameSystem._queteSuivie = prochaineActive(); }
        annoncer(ok ? '\\C[3]Quête accomplie : ' + q.title + '\\C[0]' : '\\C[18]Quête échouée : ' + q.title + '\\C[0]');
    }
    function prochaineActive() { var l = $gameSystem.questList().filter(function (q) { return q.status === 'active'; }); return l.length ? l[0].id : null; }

    // ── les annonces : dans la boîte de message si elle est libre, sinon un bandeau ─
    var file = [];
    function annoncer(t) { file.push(t); }
    function Window_Annonce() { this.initialize.apply(this, arguments); }
    Window_Annonce.prototype = Object.create(Window_Base.prototype);
    Window_Annonce.prototype.constructor = Window_Annonce;
    Window_Annonce.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, this.fittingHeight(1));
        this.openness = 0; this._reste = 0; this.opacity = 200;
    };
    Window_Annonce.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        if (this._reste > 0) { this._reste--; if (this._reste === 0) { this.close(); } return; }
        if (this.isClosed() && file.length && !$gameMessage.isBusy()) {
            var t = file.shift();
            this.contents.clear();
            var l = this.textWidth(t.replace(/\\C\[\d+\]/g, ''));
            this.drawTextEx(t, Math.max(0, Math.floor((this.contentsWidth() - l) / 2)), 0);
            this.open(); this._reste = 150;
            if (typeof SoundManager !== 'undefined') { SoundManager.playOk(); }
        }
    };

    // ── le suivi sur la carte ───────────────────────────────────────────────
    function Window_Suivi() { this.initialize.apply(this, arguments); }
    Window_Suivi.prototype = Object.create(Window_Base.prototype);
    Window_Suivi.prototype.constructor = Window_Suivi;
    Window_Suivi.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, Graphics.boxHeight - this.fittingHeight(2), 360, this.fittingHeight(2));
        this.opacity = 0; this._sig = ''; this.refresh();
    };
    Window_Suivi.prototype.refresh = function () {
        this.contents.clear();
        var q = $gameSystem._queteSuivie ? $gameSystem.quete($gameSystem._queteSuivie) : null;
        if (!q || q.status !== 'active') { this.visible = false; return; }
        this.visible = true;
        this.contents.fontSize = 18; this.contents.outlineColor = 'rgba(0,0,0,0.9)';
        this.changeTextColor(this.textColor(q.type === 'main' ? 14 : 6));
        this.drawText((q.type === 'main' ? '◆ ' : '◇ ') + q.title, 0, 0, this.contentsWidth());
        this.resetTextColor();
        var cur = null; for (var i = 0; i < q.objs.length; i++) { if (!q.objs[i].done) { cur = q.objs[i]; break; } }
        if (cur) { this.changeTextColor(this.textColor(8)); this.drawText('• ' + texteObjectif(q, cur), 8, 24, this.contentsWidth() - 8); this.resetTextColor(); }
    };
    Window_Suivi.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        var q = $gameSystem._queteSuivie ? $gameSystem.quete($gameSystem._queteSuivie) : null;
        var sig = q ? q.id + q.status + q.objs.map(function (o) { return o.done ? '1' : '0'; }).join('') + q.objs.map(function (o) { return texteObjectif(q, o); }).join('|') : '';
        if (sig !== this._sig) { this._sig = sig; this.refresh(); }
        if (this.visible && $gameMessage.isBusy()) { this.visible = false; this._sig = ''; }
        // pendant une scène (mode cinématique d'OutilsDeScene), le suivi se retire
        if (this.visible && window.OutilsDeScene && OutilsDeScene.actif()) { this.visible = false; this._sig = ''; }
    };
    var _fenetres = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function () {
        _fenetres.call(this);
        if (SUIVI) { this._fenetreSuivi = new Window_Suivi(); this.addWindow(this._fenetreSuivi); }
        this._fenetreAnnonce = new Window_Annonce(); this.addWindow(this._fenetreAnnonce);
    };

    // ── les compteurs : chasse, visite, usage, style ────────────────────────
    function compteurs() { magasin(); return $gameSystem._quetesCompteurs; }
    function compteur(id, n) { return compteurs().filter(function (c) { return c.quete === id && c.objectif === n; })[0] || null; }
    function compteurDe(id, n) { return compteur(id, n); }
    function poserCompteur(genre, id, n, cible, cles) {
        var q = magasin()[id]; if (!q || !q.objs[n - 1]) { return; }
        if (compteur(id, n)) { return; }
        var c = { genre: genre, quete: id, objectif: n, cible: cible, cles: cles, variable: VAR0 + compteurs().length };
        compteurs().push(c);
        q.objs[n - 1].compteur = n;
        $gameVariables.setValue(c.variable, 0);
        publier(q);
    }
    function avancer(c, pas) {
        var q = magasin()[c.quete];
        if (!q || q.status !== 'active' || q.objs[c.objectif - 1].done) { return; }
        var v = Math.min(c.cible, $gameVariables.value(c.variable) + (pas || 1));
        $gameVariables.setValue(c.variable, v);
        publier(q);
        if (v >= c.cible) { accomplir(c.quete, c.objectif); }
    }
    function surLesCompteurs(genre, fn) {
        if (!$gameSystem || !$gameSystem._quetesCompteurs) { return; }
        compteurs().filter(function (c) { return c.genre === genre; }).forEach(fn);
    }
    var _mort = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function () {
        _mort.call(this);
        var nom = this.enemy() ? this.enemy().name : '';
        surLesCompteurs('chasse', function (c) { if (c.cles.indexOf(nom) >= 0) { avancer(c); } });
    };
    var _arrive = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function () {
        _arrive.call(this);
        var carte = $gameMap.mapId();
        surLesCompteurs('visite', function (c) { if (c.cles.indexOf(carte) >= 0) { avancer(c, 999); } });
    };
    var _usage = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function (item) {
        _usage.call(this, item);
        if (item && DataManager.isSkill(item)) {
            surLesCompteurs('usage', function (c) { if (c.cles.indexOf(item.id) >= 0) { avancer(c); } });
        }
    };
    var _okSkill = Scene_Battle.prototype.onSkillOk;
    Scene_Battle.prototype.onSkillOk = function () {
        var sk = this._skillWindow.item();
        if (sk && sk.meta && sk.meta.StyleVesper) { surLesCompteurs('style', function (c) { avancer(c); }); }
        _okSkill.call(this);
    };
    var _achat = Scene_Shop.prototype.doBuy;
    Scene_Shop.prototype.doBuy = function (number) {
        _achat.call(this, number);
        surLesCompteurs('achat', function (c) { avancer(c); });
    };

    // ── les commandes ───────────────────────────────────────────────────────
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        var MOT = String(cmd).toUpperCase();
        if (MOT !== 'QUEST') { surLesCompteurs('commande', function (c) { if (c.cles.indexOf(MOT) >= 0) { avancer(c); } }); return; }
        var t = decouper(args.join(' ')), sub = (t[0] || '').toLowerCase();
        switch (sub) {
            case 'add': ajouter((t[1] || 'side').toLowerCase(), t[2], t[3], t[4]); break;
            case 'de': origine(t[1], t[2], t[3]); break;
            case 'obj': objectif(t[1], t[2]); break;
            case 'prix': recompense(t[1], t[2]); break;
            case 'step': accomplir(t[1], t[2] || 'next'); break;
            case 'done': terminer(t[1], true); break;
            case 'fail': terminer(t[1], false); break;
            case 'track': $gameSystem._queteSuivie = t[1]; break;
            case 'untrack': $gameSystem._queteSuivie = null; break;
            case 'ecran': if (window.Scene_Quest) { SceneManager.push(Scene_Quest); } break;
            case 'chasse': poserCompteur('chasse', t[1], parseInt(t[2], 10), parseInt(t[3], 10), t.slice(4)); break;
            case 'visite': poserCompteur('visite', t[1], parseInt(t[2], 10), 1, [parseInt(t[3], 10)]); break;
            case 'usage': poserCompteur('usage', t[1], parseInt(t[2], 10), parseInt(t[3], 10), t.slice(4).map(function (x) { return parseInt(x, 10); })); break;
            case 'style': poserCompteur('style', t[1], parseInt(t[2], 10), parseInt(t[3], 10), []); break;
            case 'commande': poserCompteur('commande', t[1], parseInt(t[2], 10), parseInt(t[3], 10), t.slice(4).map(function (x) { return String(x).toUpperCase(); })); break;
            case 'achat': poserCompteur('achat', t[1], parseInt(t[2], 10), parseInt(t[3], 10), []); break;
            case 'auto': if (magasin()[t[1]]) { magasin()[t[1]].auto = true; } break;
        }
    };

    // ── de quoi le mesurer ──────────────────────────────────────────────────
    window.Quetes = {
        statut: function (id) { return $gameSystem.questStatus(id); },
        liste: function () { return $gameSystem.questList(); },
        compteurs: function () { return compteurs(); },
        annonces: function () { return file.slice(); }
    };
})();
