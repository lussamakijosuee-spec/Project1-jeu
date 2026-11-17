//=============================================================================
// EvenementsUtiles.js — v1.0
// Les commandes que les événements de JOKO appelaient dans le vide.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Répond aux commandes de greffon que les cartes appellent
 * depuis toujours sans que personne ne décroche : NPC, FEU, FORGE, TEMPS,
 * CHUTE. Plus les trois reliques dont la description promettait pour rien.
 * @author pour JOKO
 *
 * @param journalDesSansReponse
 * @text Signaler les arguments inconnus ?
 * @type boolean
 * @default true
 * @desc Écrit une ligne dans la console du jeu (F8) quand une commande d'ici
 * est appelée avec un argument qu'elle ne sait pas traiter.
 *
 * @param varAmes
 * @text Variable — Âmes Damnées
 * @type variable
 * @default 15
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  POURQUOI CE GREFFON EXISTE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Mesuré le 2026-09-25, sur les 155 greffons inscrits et les 71 événements
 *  communs : le jeu pose 414 commandes de greffon dans ses cartes, ses
 *  troupes et ses événements communs. 98 d'entre elles — presque une sur
 *  quatre — appellent un nom auquel AUCUN greffon actif ne répond.
 *
 *     NPC           60 ×     « NPC talk forgeron »
 *     AME           21 ×     « AME set thylane 10 »   (voir plus bas)
 *     CHUTE          5 ×     « CHUTE bete 2 »
 *     FEU            4 ×     « FEU repos »
 *     FORGE          3 ×     « FORGE »
 *     TEMPS          3 ×     « TEMPS basculer »
 *     MARQUE         1 ×     « MARQUE »
 *     Theatrhythm    1 ×     majuscule de trop
 *
 *  Une commande de greffon sans répondant ne fait pas d'erreur : MV appelle
 *  une fonction vide et passe à la suivante. Le joueur voit le message, la
 *  question « Te reposer ? », choisit « oui » — et rien.
 *
 *  Ce greffon décroche. Il n'invente aucune règle : chaque commande fait ce
 *  que l'événement de JOKO qui l'appelle dit déjà qu'elle fait, dans son
 *  propre texte, à la ligne d'à côté.
 *
 *  ── AME (21 ×) n'est PAS ici ────────────────────────────────────────────
 *  Elle a déjà son greffon : `JadeEntitePlunging.js`, écrit par JOKO, posé
 *  dans js/plugins/ — mais absent de plugins.js, donc jamais chargé. Il est
 *  réinscrit, pas réécrit. C'est son code, entier.
 *
 *  ── MARQUE (1 ×) n'est pas ici non plus ─────────────────────────────────
 *  Carte 5, événement 12 : la commande est seule sur sa page, sans une ligne
 *  de texte autour. Rien ne dit ce qu'elle devait faire. Je ne devine pas :
 *  elle reste sans réponse, et `bancs/audit/11_commandes_de_plugin.js` la
 *  signale à chaque passage, jusqu'à ce que JOKO dise ce qu'elle voulait.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES COMMANDES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   FORGE
 *       Ouvre la forge (YEP_X_ItemUpgradeSlots). Posée derrière le choix
 *       « amélioré mon arme » du forgeron, carte 1.
 *
 *   FEU repos
 *       Le Feu d'Âme : le groupe est remis à neuf, et le lieu devient le
 *       point où l'on renaît. Carte 2 : « Un Feu d'Ame brule ici. Te
 *       reposer ? » — carte 29, carte 44, et le rituel (év. commun 27) :
 *       « La fatigue s'efface. Ce lieu est gravé. Tu y renaîtras, si tu
 *       tombes. » C'est écrit ; c'est fait.
 *
 *   FEU renaitre
 *       Ramène le groupe au dernier Feu d'Âme allumé. À poser dans un
 *       événement de défaite.
 *
 *   TEMPS jour | nuit | basculer
 *       Carte 4, « Cadran Jour/Nuit » : « Tu inverses le jour et la
 *       nuit... ». Règle l'heure de MOG_TimeSystem — 8 h ou 22 h.
 *
 *   CHUTE errant | bete | dement | dechire | fond | calme   [intensité]
 *       Lève l'interrupteur de chute correspondant ; les événements communs
 *       205 à 209 font le reste et le rabaissent eux-mêmes.
 *           errant  → 96      bete    → 97      dement  → 98
 *           dechire → 95      fond    → 99      calme   → tout retombe
 *       L'intensité, si elle est donnée, va dans la variable des Âmes.
 *
 *   NPC talk <nom>
 *       Le PNJ marqué `<NPC: nom>` s'arrête, se tourne vers le joueur, et
 *       ne reprend sa journée qu'une fois la conversation finie. Sans ça,
 *       `VieDuVillage` continue de le faire marcher pendant qu'il parle.
 *
 *   Theatrhythm ...
 *       MOG_Theatrhythm compare le nom sans changer la casse. La carte 36
 *       écrit « Theatrhythm », le greffon attend « theatrhythm ». On relaie.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES TROIS RELIQUES QUI PROMETTAIENT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Trois accessoires portent un `<Relic: …>` que seul `CorruptionAme.js`
 *  lisait — et ce greffon-là n'est pas chargé. Leurs statistiques sont
 *  toutes à zéro. Elles ne faisaient donc rien du tout, alors que leur
 *  description, écrite par JOKO, annonce précisément quoi :
 *
 *     #47 Talisman du Vampire    « Vole 20% des dégâts infligés en PV. »
 *     #48 Pendentif du Désespoir « +50% de dégâts quand tes PV sont
 *                                  sous 30%. »
 *     #50 Calice d'Âmes          « +1 âme à chaque ennemi vaincu. »
 *
 *  On applique la phrase, au chiffre près. Rien de plus.
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('EvenementsUtiles');
    var JOURNAL = String(P['journalDesSansReponse'] || 'true') === 'true';
    var VAR_AMES = Number(P['varAmes'] || 15);

    // Les noms auxquels NOUS répondons. Sert au journal : on ne signale pas
    // ce qu'on vient de traiter.
    var A_NOUS = ['FORGE', 'FEU', 'TEMPS', 'CHUTE', 'NPC', 'THEATRHYTHM'];

    // Les interrupteurs de chute, tels que System.json les nomme.
    var CHUTES = {
        dechire: 95,   // « ☠ CHUTE — le Déchiré d'Aël »
        errant: 96,   // « ☠ CHUTE — l'Errant effacé »
        bete: 97,   // « ☠ CHUTE — la Bête lâchée »
        dement: 98,   // « ☠ CHUTE — trahison du Dément »
        fond: 99    // « 👁 FOND — la porte des 20 Reprises »
    };

    function sansAccent(s) {
        return String(s || '').trim().toLowerCase()
            .replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e')
            .replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o').replace(/[ûüù]/g, 'u');
    }

    function dire(txt) {
        if ($gameMessage && !$gameMessage.isBusy()) { $gameMessage.add(txt); }
    }

    //=========================================================================
    // FORGE
    //=========================================================================
    function ouvrirLaForge() {
        // YEP_X_ItemUpgradeSlots n'a pas de scène à lui : il greffe la forge
        // sur la scène d'objets. On y entre par là.
        if (typeof Scene_Item === 'function') {
            SceneManager.push(Scene_Item);
            return true;
        }
        return false;
    }

    //=========================================================================
    // FEU D'ÂME
    //=========================================================================
    function feuRepos() {
        $gameParty.members().forEach(function (m) {
            m.recoverAll();
        });
        // « Ce lieu est gravé. Tu y renaîtras, si tu tombes. »
        if ($gamePlayer && $gameMap) {
            $gameSystem._feuDAme = {
                carte: $gameMap.mapId(),
                x: $gamePlayer.x,
                y: $gamePlayer.y,
                d: $gamePlayer.direction()
            };
        }
        // ⚠ 2026-10-02 : « Recovery » n'existe qu'en bruitage (audio/se) ; en
        //   jingle (audio/me), MV s'arrêtait sur « Failed to load » à chaque
        //   repos. Trouvé par bancs/navigateur/la_chasse_aux_bugs.js.
        AudioManager.playMe({ name: 'Inn', volume: 80, pitch: 100, pan: 0 });
    }

    function feuRenaitre() {
        var f = $gameSystem && $gameSystem._feuDAme;
        $gameParty.members().forEach(function (m) { m.recoverAll(); });
        if (!f) { return false; }
        $gamePlayer.reserveTransfer(f.carte, f.x, f.y, f.d, 0);
        return true;
    }

    //=========================================================================
    // TEMPS  —  MOG_TimeSystem
    //=========================================================================
    function estLaNuit() {
        if (!$gameSystem || typeof $gameSystem.hour !== 'function') { return false; }
        var h = $gameSystem.hour();
        return (h >= 19 || h < 6);
    }

    function reglerLHeure(h) {
        if ($gameSystem && typeof $gameSystem.set_hour === 'function') {
            $gameSystem.set_hour(h);
            return true;
        }
        return false;
    }

    function temps(sub) {
        switch (sansAccent(sub)) {
            case 'jour': return reglerLHeure(8);
            case 'nuit': return reglerLHeure(22);
            case 'basculer':
            case 'bascule':
            case 'inverser': return reglerLHeure(estLaNuit() ? 8 : 22);
        }
        return false;
    }

    //=========================================================================
    // CHUTE
    //=========================================================================
    function chute(sub, intensite) {
        var k = sansAccent(sub);
        if (k === 'calme' || k === 'rien' || k === 'stop') {
            Object.keys(CHUTES).forEach(function (n) { $gameSwitches.setValue(CHUTES[n], false); });
            return true;
        }
        var s = CHUTES[k];
        if (!s) { return false; }
        var n = parseInt(intensite, 10);
        if (!isNaN(n) && n > 0 && VAR_AMES > 0) {
            $gameVariables.setValue(VAR_AMES, $gameVariables.value(VAR_AMES) + n);
        }
        $gameSwitches.setValue(s, true);
        return true;
    }

    //=========================================================================
    // NPC talk <nom>
    //=========================================================================
    // ⚠ VieDuVillage fait marcher les PNJ à chaque image. Sans pause, le
    //   forgeron s'en va au milieu de sa phrase. On pose un drapeau que
    //   VieDuVillage sait lire (voir sa fonction `piloter`).
    function pnjNomme(nom) {
        if (!$gameMap) { return null; }
        var cible = sansAccent(nom);
        var trouve = null;
        $gameMap.events().forEach(function (ev) {
            if (trouve || !ev || !ev.page || !ev.page()) { return; }
            (ev.page().list || []).forEach(function (c) {
                if (trouve) { return; }
                if (c.code !== 108 && c.code !== 408) { return; }
                var m = /<\s*NPC\s*:\s*([^>]*)>/i.exec(String(c.parameters[0] || ''));
                // ⚠ §7 : MV garde l'espace après les deux-points. D'où le trim.
                if (m && sansAccent(m[1]) === cible) { trouve = ev; }
            });
        });
        return trouve;
    }

    function npcParle(nom) {
        var ev = pnjNomme(nom);
        if (!ev) { return false; }
        ev._pauseConversation = 600;            // dix secondes de sursis
        ev.turnTowardPlayer();
        return true;
    }

    // Le décompte : une image de moins à chaque tour de carte.
    var _majEv = Game_Event.prototype.update;
    Game_Event.prototype.update = function () {
        if (this._pauseConversation > 0) {
            // Tant qu'un événement parle, on gèle. Dès qu'il se tait, on
            // relâche : pas besoin d'attendre les dix secondes.
            if ($gameMap && !$gameMap.isEventRunning()) { this._pauseConversation = 0; }
            else { this._pauseConversation--; }
        }
        _majEv.call(this);
    };

    //=========================================================================
    // LES TROIS RELIQUES
    //=========================================================================
    function porteLaRelique(battler, clef) {
        if (!battler || !battler.armors) { return false; }
        return battler.armors().some(function (a) {
            return a && a.meta && a.meta.Relic && String(a.meta.Relic).trim() === clef;
        });
    }

    // #48 Pendentif du Désespoir — « +50% de dégâts quand tes PV sont sous 30% »
    var _valeurDegat = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _valeurDegat.call(this, target, critical);
        var u = this.subject();
        if (v > 0 && porteLaRelique(u, 'lowhp') && u.hpRate() < 0.30) {
            v = Math.floor(v * 1.5);
        }
        return v;
    };

    // #47 Talisman du Vampire — « Vole 20% des dégâts infligés en PV »
    var _degatPV = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function (target, value) {
        _degatPV.call(this, target, value);
        var u = this.subject();
        if (value > 0 && u && u !== target && porteLaRelique(u, 'lifesteal')) {
            var vol = Math.floor(value * 0.20);
            if (vol > 0) {
                u.gainHp(vol);
                // ⚠ YEP_BattleEngineCore remplace `_damagePopup` par une file
                //   qu'il ne prépare qu'au début d'un combat. Appeler le popup
                //   hors combat lève « this._damagePopup.push is not a
                //   function ». On ne le demande donc qu'en combat.
                if ($gameParty.inBattle() && u.startDamagePopup) { u.startDamagePopup(); }
            }
        }
    };

    // #50 Calice d'Âmes — « +1 âme à chaque ennemi vaincu »
    var _mortEnnemi = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function () {
        _mortEnnemi.call(this);
        if (VAR_AMES <= 0 || !$gameParty) { return; }
        var n = $gameParty.battleMembers().filter(function (m) {
            return porteLaRelique(m, 'soulgain');
        }).length;
        if (n > 0) {
            $gameVariables.setValue(VAR_AMES, $gameVariables.value(VAR_AMES) + n);
        }
    };

    //=========================================================================
    // LE STANDARD
    //=========================================================================
    var _cmd = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _cmd.call(this, command, args);

        var nom = String(command || '').trim();
        var haut = nom.toUpperCase();
        var sub = String(args[0] || '').trim();
        var repondu = true;

        switch (haut) {
            case 'FORGE':
                repondu = ouvrirLaForge();
                break;

            case 'FEU':
                if (sansAccent(sub) === 'repos' || sub === '') { feuRepos(); }
                else if (sansAccent(sub) === 'renaitre') { feuRenaitre(); }
                else { repondu = false; }
                break;

            case 'TEMPS':
                repondu = temps(sub);
                break;

            case 'CHUTE':
                repondu = chute(sub, args[1]);
                break;

            case 'NPC':
                // « NPC talk forgeron » — le verbe puis le nom.
                if (sansAccent(sub) === 'talk' || sansAccent(sub) === 'parle') {
                    repondu = npcParle(args.slice(1).join(' '));
                } else {
                    repondu = npcParle(args.join(' '));
                }
                break;

            case 'THEATRHYTHM':
                // MOG_Theatrhythm compare sans toucher à la casse : on relaie
                // en minuscules, mais seulement si c'est bien la majuscule qui
                // clochait (sinon on se rappellerait nous-mêmes sans fin).
                if (nom !== 'theatrhythm') {
                    this.pluginCommand('theatrhythm', args);
                }
                break;

            default:
                repondu = null;     // pas notre affaire
        }

        if (JOURNAL && repondu === false) {
            console.warn('[EvenementsUtiles] commande reconnue mais argument inconnu : '
                + nom + ' ' + args.join(' '));
        }
    };

    //=========================================================================
    // CE QU'ON NE FAIT PAS ICI
    //=========================================================================
    // ⚠ Pas de liste des commandes mortes dans ce fichier.
    //
    //   Une première version en tenait une — et elle s'est retournée contre
    //   nous : `bancs/audit/11_commandes_de_plugin.js` cherche le nom d'une
    //   commande entre guillemets dans les greffons actifs pour savoir si
    //   quelqu'un l'écoute. Citer le nom entre guillemets ici, même dans une
    //   liste de morts, suffisait à faire croire à l'audit qu'elle avait
    //   trouvé preneur. Le contrôle s'innocentait tout seul.
    //
    //   Le relevé appartient donc à l'audit, pas au greffon. Lui seul sait
    //   ce qui répond ; nous, on répond.

    //=========================================================================
    // DE QUOI LE MESURER SANS DEVINER
    //=========================================================================
    window.EvenementsUtiles = {
        chutes: CHUTES,
        aNous: A_NOUS,
        journal: JOURNAL,
        feuDAme: function () { return $gameSystem && $gameSystem._feuDAme; },
        pnjNomme: pnjNomme,
        porteLaRelique: porteLaRelique,
        estLaNuit: estLaNuit
    };

})();
