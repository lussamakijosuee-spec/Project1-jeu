//=============================================================================
// LesInteractions.js — v1.0
// Une compétence lancée sur un allié, et l'allié réagit.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les interactions : une compétence lancée sur un allié le
 * fait réagir — réplique, effet, riposte, esquive, action en retour, copie.
 * Le tableau se remplit ici même. À placer après LesStylesDeVesper.
 * @author pour JOKO
 *
 * @param interactions
 * @text Les interactions
 * @desc Une ligne par interaction. La première ligne qui correspond est
 * jouée : mets les plus précises en haut.
 * @type struct<Interaction>[]
 * @default ["{\"nom\":\"La Vanne de ludwing à Vesper\",\"lanceur\":\"3\",\"competence\":\"1302\",\"cible\":\"1\",\"repliqueLanceur\":\"\\\"%2, t'as vu ta tête ?\\\"\",\"repliqueCible\":\"\\\"\\\"\",\"colere\":\"50\",\"pt\":\"0\",\"etat\":\"0\",\"esquive\":\"0\",\"riposte\":\"100\",\"retour\":\"0\",\"retourSur\":\"lanceur\",\"copie\":\"false\"}"]
 *
 * @param couleurNom
 * @text Couleur du nom qui parle
 * @desc Le numéro de couleur de la fenêtre (\C[n]) pour le nom.
 * @type number
 * @default 6
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES INTERACTIONS                                                     JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  JOKO, le 2026-10-14 : « il y a des attaques qui peuvent interagir entre
 *  eux […] utilisées d'habitude sur les ennemis ou sur les personnes
 *  elles-mêmes, [elles] peuvent être utilisées sur quelqu'un d'autre, et en
 *  fonction de ce qu'il utilise, ça peut faire une interaction. Genre la
 *  personne répond à un tel message, ou réagit d'une telle manière. »
 *  Choix : A2 (des compétences prévues pour ça), B1 + B2 + B3 + B4, C1.
 *
 *  AJOUTER UNE INTERACTION
 *   1. Dans la Base de données, une compétence qui vise un allié (Portée :
 *      « 1 allié », « tous les alliés »…) — la Vanne à Vesper (1302) en est
 *      une. Elle doit être dans le menu de celui qui la lance.
 *   2. Ici, dans « Les interactions », une ligne :
 *        Lanceur      qui la lance          (aucun = n'importe qui)
 *        Compétence   laquelle
 *        Cible        sur qui               (aucun = n'importe quel allié)
 *      La première ligne qui correspond est jouée : mets « ludwing → Vanne →
 *      Vesper » AVANT « n'importe qui → Vanne → n'importe qui ».
 *   3. Ce qui se passe — remplis ce que tu veux, laisse le reste vide ou à 0 :
 *
 *   B1 · LES RÉPLIQUES
 *      Ce que dit le lanceur, puis ce que répond la cible, dans le journal de
 *      combat. Une réplique par ligne : s'il y en a plusieurs, une au hasard.
 *      %1 = le nom du lanceur, %2 = le nom de la cible.
 *   B2 · LES EFFETS SUR LA CIBLE
 *      Colère (Vesper seulement : +50 en Garde, ×0,5 en Lame, ×1,5 en Sang),
 *      PT gagnés ou perdus, un état posé.
 *   B3 · RIPOSTE ET ESQUIVE
 *      Esquive (%) : elle l'évite — la compétence ne fait rien (les répliques
 *      se disent quand même : c'est là qu'elle se moque).
 *      Riposte (%) : quand le lanceur a fini, la cible lui rend le coup
 *      (son attaque normale, sur LUI).
 *   B4 · L'ACTION EN RETOUR, LA COPIE
 *      Compétence en retour : quand le lanceur a fini, la cible lance cette
 *      compétence — sur le lanceur, ou sur sa cible normale.
 *      Copie : le lanceur copie une technique de la cible dans son
 *      presse-papier (LouCopySystem : seul ludwing colle ses copies).
 *
 *  Riposte et action en retour ne lui coûtent PAS son tour : si elle n'a
 *  pas encore agi, elle agit ensuite comme prévu. (MV efface d'habitude les
 *  actions de qui est « forcé » — la contre-attaque du Flow de Vesper en
 *  profitait aussi, elle passe maintenant par ici.)
 * ═══════════════════════════════════════════════════════════════════════════
 */
/*~struct~Interaction:
 * @param nom
 * @text Nom (pour t'y retrouver)
 * @default
 *
 * @param lanceur
 * @text Lanceur
 * @desc Qui lance la compétence. Aucun = n'importe qui.
 * @type actor
 * @default 0
 *
 * @param competence
 * @text Compétence
 * @type skill
 * @default 0
 *
 * @param cible
 * @text Cible
 * @desc Sur qui. Aucun = n'importe quel allié.
 * @type actor
 * @default 0
 *
 * @param repliqueLanceur
 * @text B1 · Le lanceur dit
 * @desc Une réplique par ligne (une au hasard). %1 = lanceur, %2 = cible.
 * @type note
 * @default ""
 *
 * @param repliqueCible
 * @text B1 · La cible répond
 * @desc Une réplique par ligne (une au hasard). %1 = lanceur, %2 = cible.
 * @type note
 * @default ""
 *
 * @param colere
 * @text B2 · Colère (Vesper)
 * @desc Colère gagnée par Vesper si c'est elle la cible (avant le
 * multiplicateur de son Style).
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param pt
 * @text B2 · PT de la cible
 * @desc PT gagnés (ou perdus, en négatif) par la cible.
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param etat
 * @text B2 · État posé sur la cible
 * @type state
 * @default 0
 *
 * @param esquive
 * @text B3 · Esquive (%)
 * @desc Chance que la cible l'évite : la compétence ne fait rien.
 * @type number
 * @min 0
 * @max 100
 * @default 0
 *
 * @param riposte
 * @text B3 · Riposte (%)
 * @desc Chance que la cible rende le coup au lanceur (son attaque normale).
 * @type number
 * @min 0
 * @max 100
 * @default 0
 *
 * @param retour
 * @text B4 · Compétence en retour
 * @desc La cible la lance quand le lanceur a fini. Aucune = rien.
 * @type skill
 * @default 0
 *
 * @param retourSur
 * @text B4 · …sur qui
 * @type select
 * @option sur le lanceur
 * @value lanceur
 * @option sur sa cible normale
 * @value normale
 * @default lanceur
 *
 * @param copie
 * @text B4 · Copie
 * @desc Le lanceur copie une technique de la cible dans son presse-papier
 * (seul ludwing colle ses copies, avec Copy_Paste).
 * @type boolean
 * @on Oui
 * @off Non
 * @default false
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('LesInteractions');
    var COULEUR = Number(P['couleurNom'] || 6);

    function lireJSON(t, d) { try { return JSON.parse(t); } catch (e) { return d; } }
    function texte(v) {
        // un paramètre « note » arrive en chaîne JSON ; ailleurs, en texte brut
        var s = lireJSON(v, v);
        return typeof s === 'string' ? s : '';
    }
    function lignes(v) { return texte(v).split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean); }
    function lire(o) {
        o = typeof o === 'string' ? lireJSON(o, {}) : (o || {});
        return {
            nom: String(o.nom || ''), lanceur: Number(o.lanceur || 0), competence: Number(o.competence || 0), cible: Number(o.cible || 0),
            dit: lignes(o.repliqueLanceur), repond: lignes(o.repliqueCible),
            colere: Number(o.colere || 0), pt: Number(o.pt || 0), etat: Number(o.etat || 0),
            esquive: Number(o.esquive || 0) / 100, riposte: Number(o.riposte || 0) / 100,
            retour: Number(o.retour || 0), retourSur: String(o.retourSur || 'lanceur'),
            copie: String(o.copie) === 'true'
        };
    }
    var TABLE = (lireJSON(P['interactions'] || '[]', []) || []).map(lire).filter(function (l) { return l.competence > 0; });

    function enCombat() { return !!($gameParty && $gameParty.inBattle()); }
    function auHasard(l) { return l.length ? l[Math.floor(Math.random() * l.length)] : ''; }
    function journal(t) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', t); w.push('wait'); }
    }
    function parle(qui, l, lanceur, cible) {
        var t = auHasard(l);
        if (!t || !qui) { return; }
        t = t.replace(/%1/g, lanceur.name()).replace(/%2/g, cible.name());
        journal('\\C[' + COULEUR + ']' + qui.name() + '\\C[0] : « ' + t + ' »');
        bulle(qui, '« ' + t + ' »');
    }
    // Le journal est muet en vue de côté (SimpleMsgSideView) : la réplique flotte aussi au-dessus de qui la dit,
    // découpée en lignes courtes (2026-10-23 ; le journal reste, pour les bancs). Le texte est celui du tableau, tel quel.
    function bulle(qui, texte, couleur) {
        if (!qui || !window.CombatTactique || !CombatTactique.annoncer) { return; }
        var lignes = [], l = '';
        String(texte).split(' ').forEach(function (mot) {
            if (l && (l + ' ' + mot).length > 26) { lignes.push(l); l = mot; } else { l = l ? l + ' ' + mot : mot; }
        });
        if (l) { lignes.push(l); }
        // les annonces s'empilent vers le haut : la dernière ligne d'abord, pour se lire de haut en bas
        lignes.reverse().forEach(function (x) { CombatTactique.annoncer(qui, x, couleur || '#ffffff'); });
    }
    function trouver(lanceur, item, cible) {
        if (!enCombat() || !item || !DataManager.isSkill(item) || !lanceur || !cible) { return null; }
        if (!lanceur.isActor() || !cible.isActor()) { return null; }
        for (var i = 0; i < TABLE.length; i++) {
            var l = TABLE[i];
            if (l.competence !== item.id) { continue; }
            if (l.lanceur && l.lanceur !== lanceur.actorId()) { continue; }
            if (l.cible && l.cible !== cible.actorId()) { continue; }
            return l;
        }
        return null;
    }

    // ── forcer une action sans lui coûter son tour ──────────────────────────
    // MV : Game_Battler.forceAction commence par clearActions() — qui n'a pas
    // encore agi perd ce qu'il avait prévu. Ici on garde, et on rend après.
    var _forcer = Game_Battler.prototype.forceAction;
    Game_Battler.prototype.forceAction = function (skillId, targetIndex) {
        var garder = (this._garderSesActions || 0) > 0;
        var gardees = garder ? this._actions.slice() : null;
        if (garder) { this._garderSesActions--; }
        _forcer.call(this, skillId, targetIndex);
        if (garder) { this._actionsGardees = gardees; }
    };
    var _finAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        var s = this._subject, force = !!this._processingForcedAction;
        _finAction.call(this);
        if (force && s && s._actionsGardees) {
            s._actions = s._actionsGardees;
            s._actionsGardees = null;
        }
    };
    /** b lance skillId quand la file des actions forcées passe. allie : un
     *  allié à frapper (une attaque viserait sinon un ennemi). */
    function forcer(b, skillId, cible, allie) {
        if (!b || !b.isAlive() || !BattleManager.queueForceAction || !$dataSkills[skillId]) { return false; }
        b._garderSesActions = (b._garderSesActions || 0) + 1;
        if (allie) { (b._viseAllies = b._viseAllies || []).push(allie); }
        BattleManager.queueForceAction(b, skillId, cible === undefined || cible === null ? -1 : cible);
        return true;
    }
    var _cibles = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function () {
        var s = this.subject();
        if (this._forcing && s && s._viseAllies && s._viseAllies.length) {
            var a = s._viseAllies.shift();
            if (a && a.isAlive()) { return this.repeatTargets([a]); }
        }
        return _cibles.call(this);
    };

    // ── l'interaction elle-même ─────────────────────────────────────────────
    var _applique = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        var u = this.subject(), l = trouver(u, this.item(), target);
        // une ligne « n'importe quel allié » ne joue pas sur soi-même
        if (!l || (u === target && !l.cible)) { return _applique.call(this, target); }
        // B3 · l'esquive : la compétence ne fait rien
        if (l.esquive > 0 && Math.random() < l.esquive) {
            target.clearResult();
            target.result().used = true;
            target.result().evaded = true;
        } else {
            _applique.call(this, target);
            // B2 · les effets
            if (l.colere && window.StylesVesper && StylesVesper.gagnerColere) { StylesVesper.gagnerColere(target, l.colere); }
            if (l.pt) { target.gainTp(l.pt); }
            if (l.etat && $dataStates[l.etat]) { target.addState(l.etat); }
        }
        // B1 · les répliques
        parle(u, l.dit, u, target);
        parle(target, l.repond, u, target);
        // B4 · la copie
        if (l.copie) { copier(u, target); }
        // B3 · la riposte, B4 · l'action en retour : quand le lanceur a fini
        var file = u._interactionsEnAttente || (u._interactionsEnAttente = []);
        if (l.riposte > 0 && Math.random() < l.riposte) { file.push({ b: target, skill: target.attackSkillId(), allie: u }); }
        if (l.retour > 0) { file.push({ b: target, skill: l.retour, allie: l.retourSur === 'lanceur' ? u : null }); }
    };
    var _tousFinis = Game_Battler.prototype.onAllActionsEnd;
    Game_Battler.prototype.onAllActionsEnd = function () {
        _tousFinis.call(this);
        var file = this._interactionsEnAttente;
        if (!file || !file.length) { return; }
        this._interactionsEnAttente = [];
        if (!enCombat()) { return; }
        var lanceur = this;
        file.forEach(function (x) {
            if (!x.b.isAlive() || !x.b.canMove()) { return; }
            if (x.allie && !x.allie.isAlive()) { return; }
            forcer(x.b, x.skill, x.allie ? $gameParty.members().indexOf(x.allie) : -1, x.allie || null);
        });
    };

    // B4 · la copie : une technique offensive de la cible, dans le presse-papier du lanceur
    function copier(u, cible) {
        var max = Number((PluginManager.parameters('LouCopySystem') || {})['maxSlots'] || 4) || 4;
        var slots = u._louCopiedSkills || (u._louCopiedSkills = []);
        var choix = cible.skills().filter(function (s) {
            return s && s.damage && (s.damage.type === 1 || s.damage.type === 5) && s.scope >= 1 && s.scope <= 6
                && s.occasion !== 3 && slots.indexOf(s.id) < 0;
        });
        var s = auHasard(choix);
        if (!s) { return; }
        slots.push(s.id);
        while (slots.length > max) { slots.shift(); }
        journal('\\C[' + COULEUR + ']' + u.name() + '\\C[0] copie « ' + s.name + ' » de ' + cible.name() + ' (' + slots.length + '/' + max + ')');
        bulle(u, '✦ Copié : ' + s.name, '#c8a0ff');
    }

    // chaque combat repart de zéro
    var _debut = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function () {
        _debut.apply(this, arguments);
        this._interactionsEnAttente = []; this._viseAllies = []; this._garderSesActions = 0; this._actionsGardees = null;
    };

    window.Interactions = {
        table: TABLE,
        lire: lire,
        trouver: trouver,
        /** Forcer une action sans lui coûter son tour (et, si allie, sur cet allié). */
        forcer: forcer,
        /** Le forceAction d'avant (MV : il efface les actions prévues) — pour la contre-épreuve des bancs. */
        forceActionMV: _forcer
    };
})();
