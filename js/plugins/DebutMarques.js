//=============================================================================
// DebutMarques.js — v1.1 · Le début façon Fear & Hunger : choisis TON marqué
// RPG Maker MV · by JOKO · commande : DEBUT choisir (dans l'événement d'intro)
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Choisis un des 4 marqués avant de commencer. Les trois
 * autres vivent leur vie (DestinsParalleles). Discours d'entrée inclus.
 * @author JOKO
 *
 * @param auDebut
 * @text Choix dès la nouvelle partie
 * @desc Oui : la sélection s'ouvre toute seule au début d'une nouvelle
 * partie, avant tout autre événement. Non : seulement par DEBUT choisir.
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @help  DEBUT choisir  — ouvre la sélection (à mettre au tout début du jeu).
 *  ANTI-BOUCLE : une fois le choix fait, la commande ne refait RIEN
 *  (même en Démarrage automatique). DEBUT reset — pour re-choisir (test).
 *  Le choix : retire les 3 autres du groupe, santé mentale de tous à 8
 *  (normale — elle bougera selon les choix), et joue le discours du marqué.
 *
 *  v1.1 (2026-10-17) — JOKO : le choix se fait « dès la nouvelle partie ».
 *  Plus besoin de poser DEBUT choisir : à la première carte d'une nouvelle
 *  partie, la sélection s'ouvre avant tout événement automatique. Une
 *  ancienne sauvegarde ne redemande rien et garde son groupe.
 *  Les trois autres reviennent par les rencontres sur la route : un
 *  événement qui appelle l'événement commun « Rencontre — héros N »
 *  (201 Vesper, 202 Korrah, 203 ludwing, 204 Aël).
 */
(function () {
    'use strict';
    var FICHES = {
        1: { titre: 'la Contre-Attaque', force: 'DPS agressive · contres · la plus forte physiquement',
             faille: 'sa COLÈRE (le rage-bait de ludwing…)',
             mots: ['On m\'a dit de rester calme.', 'Très bien. Je resterai calme.', '\\C[2]Jusqu\'à ce que quelqu\'un me chauffe.\\C[0]'] },
        2: { titre: 'le Roc', force: 'la plus résistante (corps ET esprit) · génie stratège',
             faille: 'la TÊTE EN L\'AIR (attaques visées ratées)',
             mots: ['Réfléchis, frappe, réfléchis encore.', 'Un bras de fer a déjà cassé une table. C\'était moi.', '\\C[23]…attends, j\'ai posé mes clés où ?\\C[0]'] },
        3: { titre: 'la Chance', force: 'le plus chanceux · sang-froid · rage-bait légendaire',
             faille: 'ses VANNES (et l\'absorption : le pouvoir contre les traumas)',
             mots: ['Restons calmes. Moi je le suis toujours.', 'Chaque âme absorbée me rend plus fort.', '\\C[8]Chacune emporte un peu de moi.\\C[0]'] },
        4: { titre: 'la Source', force: 'la plus grande réserve de mana · l\'ultime la plus rapide',
             faille: 'la CONFIANCE EN SOI (oser pour ELLE, pas que pour les autres)',
             mots: ['Je… je pense que je peux le faire.', 'Non. Pas « je pense ».', '\\C[14]Je PEUX le faire.\\C[0]'] }
    };
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'DEBUT') return;
        if ((args[0] || '').toLowerCase() === 'reset') { $gameSystem._debutFait = false; return; }
        if ($gameSystem && $gameSystem._debutFait) {
            // déjà choisi : on efface l'événement d'intro NOUS-MÊMES,
            // même s'il est en Démarrage automatique → le joueur peut bouger.
            if (this._eventId > 0) this.command214();
            return;
        }
        var itp = this;
        var noms = [1, 2, 3, 4].map(function (i) {
            var a = $gameActors.actor(i);
            return a.name() + ' — ' + FICHES[i].titre;
        });
        $gameMessage.setChoices(noms, 0, 0);
        $gameMessage.add('\\C[6]Quatre marques. Quatre chemins. Un seul se joue.\\C[0]');
        $gameMessage.setChoiceCallback(function (n) {
            $gameSystem._debutFait = true;
            var id = n + 1;
            [1, 2, 3, 4].forEach(function (i) {
                $gameVariables.setValue(10 + i, 8);              // santé mentale normale
                if (i !== id) $gameParty.removeActor(i);
                else if (!$gameParty.members().some(function (m) { return m.actorId() === i; })) $gameParty.addActor(i);
            });
            var a = $gameActors.actor(id), F = FICHES[id];
            var lignes = ['\\C[18]★ ' + a.name() + '\\C[0] — ' + F.titre,
                          '\\C[23]Force :\\C[0] ' + F.force,
                          '\\C[2]Gouffre :\\C[0] ' + F.faille]
                .concat(F.mots)
                .concat(['\\C[8]Les trois autres vivront leur vie. Vous les recroiserez.\\C[0]']);
            // v1.1 : MV vide le message juste APRÈS ce rappel (terminateMessage) —
            // un $gameMessage.add ici n'apparaissait jamais. Le discours passe
            // donc par l'interpréteur, qui l'affiche une fois le choix refermé,
            // par messages de 4 lignes (YEP_MessageCore jette les lignes en trop).
            var rangs = ($gameSystem.messageRows && $gameSystem.messageRows()) || 4;
            var liste = [];
            for (var i = 0; i < lignes.length; i += rangs) {
                liste.push({ code: 101, indent: 0, parameters: ['', 0, 0, 2] });
                lignes.slice(i, i + rangs).forEach(function (l) { liste.push({ code: 401, indent: 0, parameters: [l] }); });
            }
            liste.push({ code: 0, indent: 0, parameters: [] });
            itp.setupChild(liste, itp._eventId);
        });
        this.setWaitMode('message');
    };

    // v1.1 — le choix dès la nouvelle partie.
    // Seule une NOUVELLE partie porte la marque : une ancienne sauvegarde ne
    // l'a pas, elle ne redemande rien et garde son groupe.
    var AU_DEBUT = String(PluginManager.parameters('DebutMarques').auDebut || 'true') !== 'false';

    // Les bancs d'essai (Chromium piloté par Playwright : navigator.webdriver)
    // partent de l'équipe complète : la sélection ne s'y ouvre pas d'elle-même.
    // Un banc qui veut la tester pose $gameSystem._debutAFaire = true.
    var PILOTE = typeof navigator !== 'undefined' && navigator.webdriver === true;

    var _setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function () {
        _setupNewGame.call(this);
        if (AU_DEBUT && !PILOTE) $gameSystem._debutAFaire = true;
    };

    // Avant les événements automatiques de la carte et les événements communs
    // automatiques : la sélection passe en premier.
    var _setupStartingEvent = Game_Map.prototype.setupStartingEvent;
    Game_Map.prototype.setupStartingEvent = function () {
        if ($gameSystem._debutAFaire && !$gameSystem._debutFait) {
            $gameSystem._debutAFaire = false;
            this._interpreter.setup([
                { code: 356, indent: 0, parameters: ['DEBUT choisir'] },
                { code: 0, indent: 0, parameters: [] }
            ], 0);
            return true;
        }
        return _setupStartingEvent.call(this);
    };
})();
