//=============================================================================
// DonsSpirituels.js — v3.0  ·  UN SEUL Don : Arme, Objet OU Avatar Spirituel
// RPG Maker MV   ·   d'après le Codex des Trois Sources, chapitre 6
//   À charger APRÈS ObjetSpirituel, Errance et JadeEntitePlunging.
//   v3.0 — règle d'or : UN SEUL Don par personne, verrouillé sur son porteur.
//          « Familier » devient AVATAR SPIRITUEL.
//=============================================================================
/*:
 * @plugindesc v3.0 ■ UN SEUL Don par personne : 80% une ARME (slot Arme), 18% un
 * OBJET (slot Accessoire), 2% un AVATAR SPIRITUEL (slot Âme). Jamais deux.
 * Endurance + une jauge par Objet. Brisé, il sert encore — mais tout est ÷2.
 * @author JOKO
 *
 * @param usureParUsage
 * @text Usure — points perdus par action
 * @type number
 * @min 0
 * @default 1
 * @desc Endurance perdue à chaque action offensive employant le Don.
 *
 * @param endurBase
 * @text Endurance — base
 * @type number
 * @min 1
 * @default 40
 *
 * @param endurParNiveau
 * @text Endurance — gain par niveau
 * @type number
 * @min 0
 * @default 2
 * @desc « Plus tu es puissant, plus ton Don résiste » (Codex §6.2).
 *
 * @param endurParPalier
 * @text Endurance — gain par palier
 * @type number
 * @min 0
 * @default 20
 * @desc Éclat → Forme → Résonance → Vérité : un Éclat casse vite, une Vérité presque jamais.
 *
 * @param maluxCasse
 * @text Don brisé — multiplicateur
 * @type number
 * @decimals 2
 * @default 0.50
 * @desc Ce que devient TOUT ce qu'apporte le Don une fois brisé : dégâts, stats, effets, Trait.
 *
 * @param ombreMax
 * @text OBJET · Amulette de ludwing — capacité de la jauge d'Ombre
 * @type number
 * @min 10
 * @default 100
 *
 * @param ombreParUsage
 * @text OBJET · Amulette — Ombre gagnée par technique d'ombre
 * @type number
 * @min 1
 * @default 12
 *
 * @param ombreBlocage
 * @text OBJET · Amulette — tours de blocage après l'explosion
 * @type number
 * @min 1
 * @default 4
 *
 * @param sangMax
 * @text OBJET · Masque de Vesper — capacité de la jauge de Sang
 * @type number
 * @min 10
 * @default 100
 *
 * @param sangParUsage
 * @text OBJET · Masque — Sang gagné par technique de sang
 * @type number
 * @min 1
 * @default 10
 *
 * @param sangCoutPct
 * @text OBJET · Masque BRISÉ — % des PV max payés par attaque de sang
 * @type number
 * @min 0
 * @default 8
 *
 * @param avatarBonus
 * @text AVATAR SPIRITUEL — bonus passif (%)
 * @type number
 * @min 0
 * @default 10
 * @desc ATQ, DÉF et AGI de la porteuse tant que son Avatar est entier (moitié s'il est brisé).
 *
 * @param exigerEquipe
 * @text Exiger que le Don soit équipé ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Si Oui, un Don rangé au sac n'apporte plus rien (et l'Avatar ne débloque plus son Trait).
 *
 * @param verrouSlot
 * @text Verrouiller le Don dans son slot ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Le Don est né de cette âme-là : on ne le retire pas, et on ne le prête à personne. Recommandé.
 *
 * @param alerteJauge
 * @text Prévenir quand la seconde jauge approche du débordement (%)
 * @type number
 * @min 0
 * @max 100
 * @default 70
 * @desc 0 = jamais. Une jauge qu'on ne voit pas est une jauge qu'on ne gère pas.
 *
 * @param alerteEndurance
 * @text Prévenir quand l'Endurance descend sous (%)
 * @type number
 * @min 0
 * @max 100
 * @default 25
 * @desc 0 = jamais.
 *
 * @param dansLeMenu
 * @text Ajouter « LES DONS » au menu principal ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @param commandeMenu
 * @text Nom de la commande de menu
 * @type string
 * @default LES DONS SPIRITUELS
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE DON SPIRITUEL                                    Codex, chapitre 6
 * ═══════════════════════════════════════════════════════════════════════════
 *  Le Don n'est pas remis : il APPARAÎT de lui-même, à la première fois que
 *  le marqué se sert vraiment de son âme.
 *
 *  ╔═══════════════════════════════════════════════════════════════════════╗
 *  ║  LA RÈGLE D'OR — ON N'EN A QU'UN.                                     ║
 *  ║  Une ARME, OU un OBJET, OU un AVATAR. Jamais deux, jamais de cumul.   ║
 *  ║  Ce que le porteur tient dans l'autre main est de l'acier ordinaire.  ║
 *  ╚═══════════════════════════════════════════════════════════════════════╝
 *
 *  Trois formes — et CHAQUE FORME A SA PLACE SUR LE CORPS :
 *
 *    ⚔️  L'ARME (80 %)      → slot ARME
 *          Aucun effet, aucun talent. Seulement sa résistance.
 *          Son avantage caché : elle ne coûte AUCUN autre emplacement.
 *
 *    🔮  L'OBJET (18 %)     → slot ACCESSOIRE
 *          N'importe quelle forme, mais un effet ou un talent — et une
 *          SECONDE JAUGE qui se paie toujours plus cher que la casse.
 *          Prix : il occupe l'accessoire. Tu ne portes rien d'autre.
 *
 *    👤  L'AVATAR SPIRITUEL (2 %)  → slot ÂME
 *          Une créature née directement de l'âme — pas une invocation, pas
 *          un pacte : une part de soi qui marche à côté de soi, et qui joue
 *          son propre tour. Il peut porter un TRAIT : son porteur en a alors
 *          DEUX, même si c'est bien LE PORTEUR qui les tient tous les deux.
 *          Prix : il occupe l'Âme. (Voir AvatarSpirituel.js.)
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  LE DON NE SE RETIRE PAS, ET NE SE PRÊTE PAS      (option verrouSlot)
 *  ─────────────────────────────────────────────────────────────────────────
 *  Il est né de CETTE âme-là. Le joueur ne peut ni le déséquiper par erreur,
 *  ni le passer à quelqu'un d'autre. C'est du confort autant que du canon :
 *  personne ne perd son Trait en rangeant un accessoire sans regarder.
 *  Notetag de propriété, sur la pièce :   <DonDe: actorId>
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  L'ENDURANCE — commune aux trois formes
 *  ─────────────────────────────────────────────────────────────────────────
 *      Endurance max = endurBase + niveau×endurParNiveau + (palier−1)×endurParPalier
 *
 *  Elle s'use à l'usage et se restaure au repos (auberge, soin complet,
 *  commande DON reparer). À zéro le Don CASSE — mais reste utilisable :
 *  TOUT ce qu'il apporte est divisé par deux — dégâts, statistiques de la
 *  pièce, bonus de forme, et jusqu'au Trait qu'il sécurise.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  LA SECONDE JAUGE — le propre des OBJETS
 *  ─────────────────────────────────────────────────────────────────────────
 *  Un Objet ne se contente pas de s'user : il se GORGE. Chaque Objet a sa
 *  jauge, son carburant et sa punition. En abuser coûte toujours plus cher
 *  que de laisser l'Endurance tomber.
 *
 *  ▶ VESPER — LE MASQUE  (objet · accessoire) · jauge de SANG
 *      Son UNIQUE Don. Tant qu'il tient, elle use de son sang SANS SE
 *      BLESSER. C'est là tout son talent d'Objet, et il suffit : sans le
 *      Masque, chacun de ses gestes la couperait.
 *      Chaque technique de sang remplit la jauge. PLEINE → LE MASQUE SE FEND
 *      d'un coup (Endurance à zéro), sans attendre l'usure. Dès lors chaque
 *      attaque de sang lui coûte sangCoutPct % de ses PV max, et sa
 *      régénération faiblit de moitié.
 *      Dans sa main : une lame d'acier ORDINAIRE. Pas un second Don.
 *
 *  ▶ LUDWING — L'AMULETTE  (objet · accessoire) · jauge d'OMBRE
 *      Son UNIQUE Don. Elle absorbe les ombres et les lui rend maniables :
 *      c'est ELLE qui ouvre les types de compétence d'ombre, deux par palier,
 *      les huit à la Vérité. Voilà pourquoi il a l'air d'avoir deux Traits
 *      alors qu'il n'en a qu'un — le second, c'est le bijou.
 *      Chaque technique d'ombre remplit la jauge. PLEINE → elle EXPLOSE :
 *      capacités d'ombre bloquées ombreBlocage tours, et absorption d'âmes
 *      deux fois moins efficace pendant ce temps.
 *      Dans sa main : une hache ORDINAIRE. Pas un second Don.
 *
 *  ▶ KORRAH — L'ARMURE VOLANTE  (AVATAR SPIRITUEL · âme)
 *      Son UNIQUE Don. Des poings et un torse qui flottent sans corps, qui
 *      agissent d'eux-mêmes. Il débloque le Trait HIVER : elle manipule la
 *      glace sans formule — et le froid l'atteint elle aussi. Bonus passif
 *      permanent tant que l'Avatar est entier.
 *      ⚠ Avatar NON ÉQUIPÉ → le Trait HIVER ne répond plus.
 *      Dans sa main : des gantelets ORDINAIRES. Pas un second Don.
 *
 *  ▶ AËL — L'ARC ET SES FLÈCHES  (arme · slot Arme)
 *      Son UNIQUE Don, et le seul des quatre qui soit une ARME.
 *      Aucun effet. Juste une arme qui ne cède pas — et c'est exactement
 *      la sécurité qu'il faut à MIRACLE, un Trait qui se matérialise en
 *      flèches. En échange : accessoire et Âme LIBRES. C'est ça, l'avantage
 *      des 80 % — le Don ne leur coûte aucun autre emplacement.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  RECONNAISSANCE — notetags
 *  ─────────────────────────────────────────────────────────────────────────
 *  Sur la pièce du Don (arme OU armure) :
 *      <Don: cle>            vesper | korrah | ludwing | ael
 *      <Forme: xxx>          arme | objet | avatar     (« familier » lu aussi)
 *      <Palier: 1-4>         Éclat · Forme · Résonance · Vérité
 *      <TraitDebloque: cle>  (avatar seulement) le Trait qu'il ouvre
 *      <DonDe: actorId>      verrou : nul autre ne peut porter cette pièce
 *  Les anciens tags <Objet Spirituel: thylane|neyssa|lou|tianna> restent lus.
 *
 *  ⚠ Le mot ÉCLAT est réservé au palier 1 d'un Don. Une arme ordinaire ne
 *    s'appelle jamais « Éclat de… » : ce serait promettre un Don à un objet
 *    qui n'en est pas un. Les armes 501-512, qui portaient ce nom à tort,
 *    ont été renommées (aucune n'a été supprimée).
 *
 *  Les techniques d'ombre : types de compétence 11 à 18, ou note <Ombre>
 *  Les techniques de sang : type de compétence 10,      ou note <Sang>
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  COMMANDES DE PLUGIN
 *  ─────────────────────────────────────────────────────────────────────────
 *    DON reparer            → répare les Dons de tout le groupe
 *    DON reparer 3          → répare celui de l'acteur 3
 *    DON casser 3           → brise celui de l'acteur 3 (scénario)
 *    DON vider 3            → vide la seconde jauge de l'acteur 3
 *    DON afficher           → écran de lecture des Dons du groupe
 *                             (aussi accessible depuis le MENU PRINCIPAL)
 *
 *  SCRIPT :  window.Dons.de(actorId)        → fiche complète
 *            window.Dons.estCasse(actorId)  → true/false
 *            window.Dons.estPorte(actorId)  → le Don est-il équipé ?
 *            window.Dons.jauge(actorId)     → {nom, val, max, bloc}
 *            window.Dons.facteur(actorId)   → 1 ou 0.50
 *            window.Dons.traitDebloque(2)   → 'hiver' si l'Avatar est là
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('DonsSpirituels');
    var USURE      = parseInt(P['usureParUsage']  || 1);
    var END_BASE   = parseInt(P['endurBase']      || 40);
    var END_NIV    = parseInt(P['endurParNiveau'] || 2);
    var END_PAL    = parseInt(P['endurParPalier'] || 20);
    var MALUS      = parseFloat(P['maluxCasse']   || 0.5);
    var OMBRE_MAX  = parseInt(P['ombreMax']       || 100);
    var OMBRE_USE  = parseInt(P['ombreParUsage']  || 12);
    var OMBRE_BLOC = parseInt(P['ombreBlocage']   || 4);
    var SANG_MAX   = parseInt(P['sangMax']        || 100);
    var SANG_USE   = parseInt(P['sangParUsage']   || 10);
    var SANG_PCT   = parseInt(P['sangCoutPct']    || 8);
    // avatarBonus — l'ancienne clé « familierBonus » reste lue (sauvegardes v2).
    var AV_BONUS   = parseInt(P['avatarBonus'] || P['familierBonus'] || 10);
    var EXIGE_EQ   = String(P['exigerEquipe'] || 'true') === 'true';
    var VERROU     = String(P['verrouSlot']   || 'true') === 'true';
    var ALERTE_J   = parseInt(P['alerteJauge']     === undefined ? 70 : P['alerteJauge']);
    var ALERTE_E   = parseInt(P['alerteEndurance'] === undefined ? 25 : P['alerteEndurance']);
    var AU_MENU    = String(P['dansLeMenu'] || 'true') === 'true';
    var CMD_MENU   = String(P['commandeMenu'] || 'LES DONS SPIRITUELS');

    // ── Le registre : qui est né avec QUOI — UN SEUL Don chacun (Codex §6.3-6.5)
    //    slot = etypeId :  1 Arme · 5 Accessoire · 7 Âme
    var DONS = {
        1: { cle: 'vesper',  type: 'objet',  slot: 5, nom: 'le Masque',
             jauge: { nom: 'Sang',  max: SANG_MAX,  parUsage: SANG_USE,  sur: 'sang',  fin: 'fendre' } },
        2: { cle: 'korrah',  type: 'avatar', slot: 7, nom: "l'Armure Volante",
             trait: 'hiver' },
        3: { cle: 'ludwing', type: 'objet',  slot: 5, nom: "l'Amulette",
             jauge: { nom: 'Ombre', max: OMBRE_MAX, parUsage: OMBRE_USE, sur: 'ombre', fin: 'exploser' } },
        4: { cle: 'ael',     type: 'arme',   slot: 1, nom: "l'Arc et ses Flèches" }
    };
    var TYPE_NOM  = { arme: 'Arme spirituelle', objet: 'Objet spirituel',
                      avatar: 'Avatar spirituel', familier: 'Avatar spirituel' };
    var SLOT_NOM  = { 1: 'Arme', 5: 'Accessoire', 7: 'Âme' };
    var PALIER_NOM = ['', 'Éclat', 'Forme', 'Résonance', 'Vérité'];
    // Anciens noms des personnages, encore présents sur de vieilles pièces.
    var ALIAS_CLE = { thylane: 'vesper', neyssa: 'korrah', lou: 'ludwing', tianna: 'ael' };

    //=========================================================================
    // ÉTAT PERSISTANT
    //=========================================================================
    function store() {
        if (!$gameSystem) return null;
        if (!$gameSystem._donsSpi) $gameSystem._donsSpi = {};
        return $gameSystem._donsSpi;
    }
    function fiche(id) {
        var s = store();
        if (!s || !DONS[id]) return null;
        if (!s[id]) s[id] = { end: null, charge: 0, bloc: 0, apparu: false, prevenuJ: false, prevenuE: false };
        // compatibilité v1 : l'ancienne clé « ombre » devient la jauge générique
        if (s[id].ombre !== undefined) { s[id].charge = s[id].ombre; delete s[id].ombre; }
        return s[id];
    }
    // ⚠ NE JAMAIS appeler $gameActors.actor(id) ici.
    //   actor() CONSTRUIT l'acteur s'il n'existe pas encore. Or on est appelé
    //   depuis paramPlus(), que Game_Actor.refresh() déclenche pendant cette
    //   construction même : actor() → new Game_Actor → refresh → paramPlus →
    //   acteur() → actor() → … Récursion sans fin, sans aucune erreur à
    //   l'écran : le jeu se fige au démarrage sur un écran noir.
    //   On lit donc la table directement, sans jamais rien créer.
    function acteur(id) {
        try {
            return ($gameActors && $gameActors._data) ? ($gameActors._data[id] || null) : null;
        } catch (e) { return null; }
    }

    // ── La PIÈCE du Don, où qu'elle soit équipée (arme, accessoire ou âme) ──
    function cleDe(item) {
        if (!item || !item.meta) return '';
        var k = item.meta['Don'] || item.meta['DonSpirituel'] || item.meta['Objet Spirituel'];
        if (!k || k === true) return '';
        k = String(k).toLowerCase().trim();
        return ALIAS_CLE[k] || k;
    }
    function pieceDuDon(id) {
        var d = DONS[id], a = acteur(id);
        if (!d || !a || !a.equips) return null;
        try {
            var eq = a.equips();
            for (var i = 0; i < eq.length; i++) {
                if (eq[i] && cleDe(eq[i]) === d.cle) return eq[i];
            }
        } catch (e) { }
        return null;
    }
    function estPorte(id) { return !EXIGE_EQ || !!pieceDuDon(id); }

    // Palier atteint : Éclat 1 → Forme 2 → Résonance 3 → Vérité 4.
    function palierDe(id) {
        var p = pieceDuDon(id);
        var n = p && p.meta ? parseInt(p.meta['Palier']) : 0;
        return n > 0 ? n : 1;
    }
    function nomDuDon(id)  { return DONS[id] ? DONS[id].nom : ''; }
    function nomPiece(id)  { var p = pieceDuDon(id); return (p && p.name) ? p.name : ''; }

    function enduranceMax(id) {
        var a = acteur(id);
        return END_BASE + (a ? a.level : 1) * END_NIV + (palierDe(id) - 1) * END_PAL;
    }
    function endurance(id) {
        var f = fiche(id);
        if (!f) return 0;
        if (f.end === null) f.end = enduranceMax(id);
        return Math.max(0, Math.min(f.end, enduranceMax(id)));
    }
    function estCasse(id) { return !!DONS[id] && !!fiche(id) && endurance(id) <= 0; }
    // Ce que le DON apporte : rien s'il n'est pas porté, la moitié s'il est brisé.
    function facteur(id) {
        if (!DONS[id]) return 1;
        if (!estPorte(id)) return 0;
        return estCasse(id) ? MALUS : 1;
    }
    // Ce que le Don fait au TRAIT qu'il sécurise : le Trait reste celui du porteur,
    // même sans le Don — mais un Don BRISÉ divise par deux ce qu'il en tire.
    function facteurTrait(id) {
        if (!DONS[id]) return 1;
        return (estPorte(id) && estCasse(id)) ? MALUS : 1;
    }

    function log(t) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', t); w.push('wait'); }
        else if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(t);
    }

    //=========================================================================
    // RECONNAISSANCE DES TECHNIQUES
    //=========================================================================
    function estOmbre(item) {
        if (!item) return false;
        if (item.meta && item.meta.Ombre) return true;
        return item.stypeId >= 11 && item.stypeId <= 18;
    }
    function estSang(item) {
        if (!item) return false;
        if (item.meta && item.meta.Sang) return true;
        return item.stypeId === 10;
    }
    function nourrit(jauge, item) {
        if (!jauge) return false;
        return jauge.sur === 'ombre' ? estOmbre(item) : jauge.sur === 'sang' ? estSang(item) : false;
    }
    function porteurDe(battler) {
        if (!battler || !battler.isActor || !battler.isActor()) return 0;
        var id = battler.actorId();
        return DONS[id] ? id : 0;
    }

    //=========================================================================
    // API
    //=========================================================================
    window.Dons = {
        de: function (id) {
            var d = DONS[id];
            if (!d) return null;
            var j = d.jauge, f = fiche(id);
            return {
                cle: d.cle, type: d.type, typeNom: TYPE_NOM[d.type],
                slot: d.slot, slotNom: SLOT_NOM[d.slot],
                nom: d.nom, piece: nomPiece(id), porte: estPorte(id),
                palier: palierDe(id), palierNom: PALIER_NOM[palierDe(id)],
                endurance: endurance(id), max: enduranceMax(id),
                casse: estCasse(id), facteur: facteur(id),
                jauge: j ? { nom: j.nom, val: f ? f.charge : 0, max: j.max, bloc: f ? f.bloc : 0 } : null,
                trait: d.trait || ''
            };
        },
        estCasse: estCasse,
        estPorte: estPorte,
        palier: palierDe,
        facteur: facteur,
        facteurTrait: facteurTrait,
        // « familier » et « avatar » désignent la même forme : le mot a changé,
        // pas la mécanique. Les deux sont acceptés pour ne rien casser.
        aLaForme: function (id, forme) {
            if (!DONS[id]) return false;
            var a = DONS[id].type, b = String(forme || '');
            if (a === 'familier') a = 'avatar';
            if (b === 'familier') b = 'avatar';
            return a === b;
        },
        estAvatar: function (id) {
            return !!DONS[id] && (DONS[id].type === 'avatar' || DONS[id].type === 'familier');
        },
        // l'Avatar ne débloque son Trait que s'il est là, et entier ou brisé (÷2 ailleurs)
        traitDebloque: function (id) {
            var d = DONS[id];
            return (d && d.trait && estPorte(id)) ? d.trait : '';
        },
        jauge: function (id) {
            var d = DONS[id], f = fiche(id);
            if (!d || !d.jauge || !f) return null;
            return { nom: d.jauge.nom, val: f.charge, max: d.jauge.max, bloc: f.bloc };
        },
        // compat v1 — l'ancienne API « ombre » pointe sur la jauge générique
        ombre: function (id) { var f = fiche(id); return f ? f.charge : 0; },
        ombreBloquee: function (id) { var f = fiche(id); return !!(f && f.bloc > 0); },
        reparer: function (id) {
            var f = fiche(id);
            if (!f) return;
            var etait = estCasse(id);
            f.end = enduranceMax(id); f.charge = 0; f.bloc = 0;
            f.prevenuJ = false; f.prevenuE = false;
            if (etait) {
                var a = acteur(id);
                log('\\C[24]' + (a ? a.name() : '') + ' — ' + nomDuDon(id) + ' a retrouvé sa forme.\\C[0]');
            }
        },
        casser: function (id) { var f = fiche(id); if (f) { f.end = 0; annoncerCasse(id); } },
        vider:  function (id) { var f = fiche(id); if (f) { f.charge = 0; f.bloc = 0; } }
    };

    function annoncerCasse(id) {
        var a = acteur(id), d = DONS[id];
        if (!a || !d) return;
        if (d.jauge && d.jauge.sur === 'sang') {
            log('\\C[18]✖ ' + nomDuDon(id) + ' se fend. Désormais, son sang la blesse aussi.\\C[0]');
        } else if (window.Dons.estAvatar(id)) {
            log('\\C[18]✖ ' + nomDuDon(id) + ' se disloque. ' + a.name() + ' se retrouve seule.\\C[0]');
        } else {
            log('\\C[18]✖ ' + nomDuDon(id) + ' est brisé. Il sert encore — mais de moitié.\\C[0]');
        }
    }

    //=========================================================================
    // APPARITION — le Don sort à la première fois qu'on se sert de son âme
    //=========================================================================
    function faireApparaitre(id) {
        var f = fiche(id), d = DONS[id], a = acteur(id);
        if (!f || f.apparu || !d || !a) return;
        f.apparu = true;
        log('\\C[6]✦ ' + a.name() + ' — ' + nomDuDon(id) + ' apparaît. ('
            + TYPE_NOM[d.type] + ' · ' + SLOT_NOM[d.slot] + ')\\C[0]');
    }

    //=========================================================================
    // USURE — le Don s'use à l'usage · les jauges se gorgent
    //=========================================================================
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        try {
            if (this._donUse) return;
            var id = porteurDe(this.subject());
            if (!id || !this.isDamage || !this.isDamage()) return;
            if (!estPorte(id)) return;                 // Don rangé : il ne sert ni ne s'use
            this._donUse = true;
            faireApparaitre(id);

            var d = DONS[id], f = fiche(id);
            var avant = endurance(id);
            if (avant > 0 && USURE > 0) {
                f.end = avant - USURE;
                if (f.end <= 0) { f.end = 0; annoncerCasse(id); }
                else prevenirEndurance(id);
            }
            // la seconde jauge de l'Objet se gorge de ce dont il se nourrit
            if (d.jauge && nourrit(d.jauge, this.item())) gorger(id);
            // le masque brisé : le prix du sang, à chaque frappe de sang
            if (d.jauge && d.jauge.sur === 'sang' && estSang(this.item())) prixDuSang(id);
        } catch (e) { /* ne jamais casser un combat */ }
    };

    //=========================================================================
    // DON BRISÉ — TOUT ce qu'il apporte est divisé par deux
    //=========================================================================
    // 1) les dégâts
    var _dmg = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _dmg.call(this, target, critical);
        try {
            var id = porteurDe(this.subject());
            if (id && estPorte(id) && estCasse(id) && v > 0) v = Math.floor(v * MALUS);
        } catch (e) { }
        return v;
    };
    // 2) les statistiques que la pièce du Don accorde
    var _paramPlus = Game_Actor.prototype.paramPlus;
    var _dansParamPlus = false;                 // garde-fou anti-réentrance
    Game_Actor.prototype.paramPlus = function (paramId) {
        var v = _paramPlus.call(this, paramId);
        if (_dansParamPlus) return v;           // on ne se rappelle jamais soi-même
        _dansParamPlus = true;
        try {
            var id = porteurDe(this);
            if (id && estCasse(id)) {
                var p = pieceDuDon(id);
                if (p && p.params) v -= Math.floor(p.params[paramId] * (1 - MALUS));
            }
        } catch (e) { }
        finally { _dansParamPlus = false; }
        return v;
    };

    //=========================================================================
    // 🔮 LES OBJETS — la seconde jauge, et ce qu'elle coûte quand elle déborde
    //=========================================================================
    function gorger(id) {
        var d = DONS[id], f = fiche(id);
        if (f.bloc > 0) return;                        // déjà en pleine punition
        f.charge = Math.min(d.jauge.max, f.charge + d.jauge.parUsage);
        if (f.charge >= d.jauge.max) {
            if (d.jauge.fin === 'exploser') exploser(id);
            else fendre(id);
        } else {
            prevenirJauge(id);
        }
    }

    //=========================================================================
    // ON PRÉVIENT AVANT — une jauge qu'on ne voit pas est une jauge subie
    //=========================================================================
    // Les deux jauges du Don ne sont lisibles qu'au menu. En combat, le joueur
    // découvrait la casse au moment où elle tombait. Maintenant il est averti
    // une fois, au franchissement du seuil, et il lui reste des tours pour
    // changer d'avis. Une seule alerte par seuil : pas de spam.
    function prevenirJauge(id) {
        if (ALERTE_J <= 0) return;
        var d = DONS[id], f = fiche(id);
        if (!d.jauge) return;
        var pct = Math.floor(f.charge * 100 / d.jauge.max);
        if (pct < ALERTE_J) { f.prevenuJ = false; return; }
        if (f.prevenuJ) return;
        f.prevenuJ = true;
        var reste = Math.ceil((d.jauge.max - f.charge) / d.jauge.parUsage);
        log('\\C[2]⚠ ' + nomDuDon(id) + ' — ' + d.jauge.nom + ' à ' + pct + ' %. Encore '
            + reste + ' technique' + (reste > 1 ? 's' : '') + ' avant qu\'' + (d.jauge.fin === 'exploser'
            ? 'elle n\'explose.' : 'il ne se fende.') + '\\C[0]');
    }
    function prevenirEndurance(id) {
        if (ALERTE_E <= 0) return;
        var f = fiche(id), max = enduranceMax(id);
        if (max <= 0) return;
        var pct = Math.floor(endurance(id) * 100 / max);
        if (pct > ALERTE_E) { f.prevenuE = false; return; }
        if (f.prevenuE) return;
        f.prevenuE = true;
        log('\\C[17]⚠ ' + nomDuDon(id) + ' fatigue — Endurance ' + endurance(id) + ' / ' + max
            + '. Un repos le remettrait d\'aplomb.\\C[0]');
    }
    // ⬛ l'AMULETTE de ludwing : elle explose, l'ombre reflue, les âmes échappent
    function exploser(id) {
        var f = fiche(id), a = acteur(id);
        f.charge = 0;
        f.bloc = OMBRE_BLOC;
        log('\\C[2]✸ ' + nomDuDon(id) + " explose — l'ombre reflue.\\C[0]");
        if (a) log('\\C[8]' + a.name() + ' ne peut plus manier les ombres, et les âmes lui échappent.\\C[0]');
    }
    // 🩸 le MASQUE de Vesper : trop de sang, et il se fend d'un coup
    function fendre(id) {
        var f = fiche(id);
        f.charge = 0;
        if (!estCasse(id)) { f.end = 0; annoncerCasse(id); }
    }
    // capacités d'ombre bloquées le temps qu'il récupère
    var _sealed = Game_BattlerBase.prototype.isSkillTypeSealed;
    Game_BattlerBase.prototype.isSkillTypeSealed = function (stypeId) {
        try {
            var id = porteurDe(this), d = DONS[id];
            if (id && d && d.jauge && d.jauge.sur === 'ombre' && fiche(id).bloc > 0
                && stypeId >= 11 && stypeId <= 18) return true;
        } catch (e) { }
        return _sealed.call(this, stypeId);
    };
    // le blocage s'estompe tour après tour
    var _turnEnd = Game_Battler.prototype.onTurnEnd;
    Game_Battler.prototype.onTurnEnd = function () {
        _turnEnd.call(this);
        try {
            var id = porteurDe(this);
            if (!id) return;
            var f = fiche(id);
            if (f.bloc > 0 && --f.bloc === 0) {
                log('\\C[24]' + nomDuDon(id) + ' se recompose.\\C[0]');
            }
        } catch (e) { }
    };

    //=========================================================================
    // 🩸 LE MASQUE — le sang sans blessure, tant qu'il tient
    //=========================================================================
    function prixDuSang(id) {
        if (!estCasse(id)) return;              // masque intact : aucun prix
        var a = acteur(id);
        if (!a || SANG_PCT <= 0) return;
        var perte = Math.max(1, Math.floor(a.mhp * SANG_PCT / 100));
        a.gainHp(-Math.min(perte, a.hp - 1));
        log('\\C[18]Le sang de ' + a.name() + ' ne lui obéit plus sans douleur. (−' + perte + ')\\C[0]');
    }
    // masque brisé : la régénération faiblit de moitié
    var _regen = Game_Battler.prototype.regenerateHp;
    Game_Battler.prototype.regenerateHp = function () {
        try {
            var id = porteurDe(this), d = DONS[id];
            if (id && d && d.jauge && d.jauge.sur === 'sang' && estPorte(id) && estCasse(id)) {
                var avant = this.hp;
                _regen.call(this);
                var gagne = this.hp - avant;
                if (gagne > 0) this.gainHp(-Math.floor(gagne * (1 - MALUS)));
                return;
            }
        } catch (e) { }
        _regen.call(this);
    };

    //=========================================================================
    // 👤 L'AVATAR SPIRITUEL — bonus passif tant qu'il est là (÷2 s'il est brisé)
    //=========================================================================
    var _paramRate = Game_Battler.prototype.paramRate;
    Game_Battler.prototype.paramRate = function (paramId) {
        var r = _paramRate.call(this, paramId);
        try {
            var id = porteurDe(this);
            if (id && window.Dons.estAvatar(id)
                && (paramId === 2 || paramId === 3 || paramId === 6)) {   // ATK, DEF, AGI
                r *= 1 + AV_BONUS / 100 * facteur(id);
            }
        } catch (e) { }
        return r;
    };

    //=========================================================================
    // LE VERROU — le Don ne se retire pas, et ne se prête à personne
    //=========================================================================
    // Le Don est né de CETTE âme-là : il n'est ni amovible, ni transmissible.
    // Sans ce verrou, un joueur pouvait ranger le Masque de Vesper au sac par
    // inadvertance et perdre en silence tout ce que son Don lui apportait —
    // y compris le Trait que l'Avatar de Korrah débloque. C'est du canon, mais
    // c'est surtout du confort : on ne peut plus se saborder sans le savoir.

    /** L'acteur auquel cette pièce appartient : <DonDe: n>, sinon le registre. */
    function proprietaire(item) {
        if (!item || !item.meta) return 0;
        var n = parseInt(item.meta['DonDe']);
        if (n > 0) return n;
        var k = cleDe(item);
        if (!k) return 0;
        for (var id in DONS) if (DONS[id].cle === k) return parseInt(id);
        return 0;
    }
    function estUnDon(item) { return proprietaire(item) > 0; }

    // 1) On ne retire pas son Don, et on ne met rien d'autre à sa place.
    //    « Tout retirer » et « Optimiser » passent par ici : ils sont couverts.
    //    Un événement garde forceChangeEquip() comme porte de service.
    var _changeEquip = Game_Actor.prototype.changeEquip;
    Game_Actor.prototype.changeEquip = function (slotId, item) {
        if (VERROU && !window._DonInterne) {
            try {
                var actuel = this.equips()[slotId];
                // le slot tient déjà MON Don : personne n'y touche
                if (actuel && proprietaire(actuel) === this.actorId()) { refus(); return; }
                // ce n'est pas mon Don : je ne peux pas le porter
                if (item && estUnDon(item) && proprietaire(item) !== this.actorId()) { refus(); return; }
            } catch (e) { }
        }
        _changeEquip.call(this, slotId, item);
    };
    // Un refus discret : le menu n'a pas de fenêtre de message, un son suffit.
    function refus() {
        try { SoundManager.playBuzzer(); } catch (e) { }
    }

    // 2) Le Don n'apparaît pas dans la liste d'équipement des autres héros.
    var _canEquip = Game_BattlerBase.prototype.canEquip;
    Game_BattlerBase.prototype.canEquip = function (item) {
        if (VERROU && this.isActor && this.isActor()) {
            var p = proprietaire(item);
            if (p > 0 && p !== this.actorId()) return false;
        }
        return _canEquip.call(this, item);
    };

    // 3) Le meilleur équipement automatique ne jette pas le Don non plus.
    var _bestEquipItem = Game_Actor.prototype.bestEquipItem;
    Game_Actor.prototype.bestEquipItem = function (slotId) {
        if (VERROU) {
            var actuel = this.equips()[slotId];
            if (actuel && proprietaire(actuel) === this.actorId()) return actuel;
        }
        return _bestEquipItem.call(this, slotId);
    };

    //=========================================================================
    // LE REPOS RÉPARE
    //=========================================================================
    var _recover = Game_Actor.prototype.recoverAll;
    Game_Actor.prototype.recoverAll = function () {
        _recover.call(this);
        try { if (DONS[this.actorId()]) window.Dons.reparer(this.actorId()); } catch (e) { }
    };

    //=========================================================================
    // COMMANDES DE PLUGIN
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        if (String(cmd).toUpperCase() !== 'DON') return;
        var sous = (args[0] || '').toLowerCase();
        var cible = parseInt(args[1] || 0);
        if (sous === 'reparer') {
            if (cible) window.Dons.reparer(cible);
            else Object.keys(DONS).forEach(function (k) { window.Dons.reparer(parseInt(k)); });
        } else if (sous === 'casser' && cible) {
            window.Dons.casser(cible);
        } else if (sous === 'vider' && cible) {
            window.Dons.vider(cible);
        } else if (sous === 'afficher') {
            SceneManager.push(Scene_Dons);
        }
    };

    //=========================================================================
    // ÉCRAN DE LECTURE — « DON afficher »
    //=========================================================================
    function Scene_Dons() { this.initialize.apply(this, arguments); }
    Scene_Dons.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Dons.prototype.constructor = Scene_Dons;
    Scene_Dons.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._w = new Window_Base(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.addWindow(this._w);
        this.dessiner();
    };
    // ── Le dessin se fait en DEUX passes ────────────────────────────────────
    // À quatre héros, dont une porteuse d'Avatar qui prend sept lignes à elle
    // seule, la page dépasse la hauteur de l'écran : le bas de page, cloué à
    // « Graphics.boxHeight - lh*4 », se dessinait PAR-DESSUS les derniers.
    // On mesure donc d'abord la place qu'il faut, puis on rétrécit la ligne et
    // la police juste ce qu'il faut pour que tout tienne — le même geste que le
    // journal de combat et le bandeau des Éléments.
    Scene_Dons.prototype.dessiner = function () {
        var w = this._w;
        var lhNormal = Window_Base.prototype.lineHeight.call(w);
        var policeNormale = w.standardFontSize();

        delete w.lineHeight;                       // on repart de la taille normale
        w.contents.fontSize = policeNormale;
        var besoin = this.poser(lhNormal, false);  // combien de pixels il faudrait
        var place = w.contentsHeight();

        var facteur = besoin > place ? Math.max(0.55, place / besoin) : 1;
        var lh = Math.max(16, Math.floor(lhNormal * facteur));
        w.contents.clear();
        w.contents.fontSize = Math.max(14, Math.floor(policeNormale * facteur));
        w.lineHeight = function () { return lh; };  // drawGauge s'aligne dessus
        this.poser(lh, true);

        // de quoi permettre à un banc de mesurer le résultat DESSINÉ
        this._mesure = { besoin: besoin, place: place, facteur: facteur,
                         ligne: lh, police: w.contents.fontSize };
    };

    /** Pose la page à la hauteur de ligne donnée. Sans dessiner, sert à mesurer. */
    Scene_Dons.prototype.poser = function (lh, dessine) {
        var w = this._w, y = 0, larg = w.contentsWidth();
        // en passe de mesure, on ne touche pas au bitmap
        var ecrire = dessine ? function (t, x, yy, la, al) { w.drawText(t, x, yy, Math.max(0, la), al); } : function () { };
        var jauge = dessine ? function (x, yy, la, r, c1, c2) { w.drawGauge(x, yy, la, r, c1, c2); } : function () { };
        var coulEcrit = dessine ? function (c) { w.changeTextColor(w.textColor(c)); } : function () { };
        var coulRaz = dessine ? function () { w.resetTextColor(); } : function () { };

        coulEcrit(6);
        ecrire('LES DONS SPIRITUELS', 0, y, larg, 'center');
        coulRaz(); y += lh * 1.4;

        $gameParty.members().forEach(function (a) {
            var d = window.Dons.de(a.actorId());
            if (!d) return;
            var coul = !d.porte ? 7 : d.casse ? 18 : 24;

            // ligne 1 — qui, quoi, où
            coulEcrit(coul);
            ecrire(a.name() + ' — ' + d.nom, 8, y, 300);
            coulRaz();
            coulEcrit(6);
            ecrire(d.typeNom + '  ·  slot ' + d.slotNom, 316, y, 230);
            coulRaz();
            ecrire('palier ' + d.palier + '/4 · ' + d.palierNom, 556, y, larg - 556);
            y += lh;

            // ligne 2 — la pièce réellement portée
            coulEcrit(8);
            ecrire(d.porte ? '    « ' + d.piece + ' »' : "    ✖ le Don n'est pas porté — il n'apporte rien.",
                   8, y, larg - 8);
            coulRaz();
            y += lh;

            // ligne 3 — l'Endurance
            var pct = d.max > 0 ? d.endurance / d.max : 0;
            jauge(24, y, 340, pct, w.textColor(coul), w.textColor(0));
            ecrire('Endurance ' + d.endurance + ' / ' + d.max + (d.casse ? '   ✖ BRISÉ (÷2)' : ''),
                   380, y, larg - 380);
            y += lh;

            // ligne 4 — la seconde jauge, propre aux Objets
            if (d.jauge) {
                var p2 = d.jauge.max > 0 ? d.jauge.val / d.jauge.max : 0;
                jauge(24, y, 340, p2, w.textColor(2), w.textColor(0));
                coulEcrit(2);
                ecrire(d.jauge.nom + ' ' + d.jauge.val + ' / ' + d.jauge.max
                       + (d.jauge.bloc > 0 ? '   ✸ débordée (' + d.jauge.bloc + ' tours)' : ''),
                       380, y, larg - 380);
                coulRaz();
                y += lh;
            }
            // ligne 5 — le Trait que l'Avatar débloque
            if (d.trait) {
                coulEcrit(23);
                ecrire('    ✦ débloque le Trait ' + d.trait.toUpperCase()
                       + (d.porte ? '' : " — indisponible sans l'Avatar"), 24, y, larg - 24);
                coulRaz();
                y += lh;
            }
            // ligne 5-bis — le niveau de l'Avatar et la prise qu'elle a dessus
            if (window.Avatars && window.Avatars.de) {
                var av = window.Avatars.de(a.actorId());
                if (av) {
                    coulEcrit(av.eteinte ? 8 : 14);
                    ecrire('    Avatar niveau ' + av.niveau + '/3 · ' + av.niveauNom
                           + '  —  ' + av.controle
                           + (av.prochainSeuil ? '   (niveau suivant : ' + av.prochainSeuil + ')' : '')
                           + (av.eteinte ? '   ✖ éteint — elle est hors jeu' : ''),
                           24, y, larg - 24);
                    coulRaz();
                    y += lh;
                    coulEcrit(23);
                    ecrire('    posture : ' + av.posture + '  ·  ' + av.techniques.length
                           + ' technique(s)  ·  puissance ×' + av.puissance.toFixed(2), 24, y, larg - 24);
                    coulRaz();
                    y += lh;
                }
            }
            // ligne 6 — ce que la MAIN tient : de l'acier, pas un second Don
            var main = a.equips()[0];
            if (d.slot !== 1) {
                coulEcrit(7);
                ecrire('    en main : ' + (main ? main.name : '—')
                       + '  (arme ordinaire — on n\'a qu\'un seul Don)', 24, y, larg - 24);
                coulRaz();
                y += lh;
            }
            y += lh * 0.35;
        });

        // Le bas de page SUIT la liste au lieu d'être cloué en bas de l'écran :
        // c'est ce clouage qui l'écrivait par-dessus les derniers héros.
        y += lh * 0.3;
        coulEcrit(8);
        ecrire("UN SEUL DON PAR PERSONNE.   ⚔️ Arme → slot Arme (rien de plus, mais rien à payer)  ·  🔮 Objet → Accessoire  ·  👤 Avatar → Âme",
               8, y, larg - 8);
        y += lh;
        ecrire('Un Don brisé sert encore — mais de moitié. Le repos le répare. On ne le retire pas, on ne le prête pas.',
               8, y, larg - 8);
        y += lh;
        coulRaz();
        return y;      // la hauteur qu'il a fallu : c'est elle qu'on mesure
    };
    // On en SORT. Sans ça, « DON afficher » n'avait aucune touche de retour :
    // l'écran restait affiché jusqu'à la fermeture du jeu.
    Scene_Dons.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isCancelled()) {
            SoundManager.playCancel();
            this.popScene();
        }
    };
    window.Scene_Dons = Scene_Dons;

    //=========================================================================
    // MANIABLE — l'écran des Dons se lit depuis le MENU, pas depuis un événement
    //=========================================================================
    // Trois jauges gouvernent le combat des quatre héros et elles n'étaient
    // consultables que par une commande d'événement. Elles ont maintenant leur
    // entrée dans le menu principal.
    // Garde-fou : si un autre plugin remplace la scène de menu, on n'ajoute
    // rien plutôt que de casser le chargement. Le reste du Don continue.
    if (AU_MENU && typeof Window_MenuCommand !== 'undefined' && typeof Scene_Menu !== 'undefined') {
        var _addOriginal = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () {
            _addOriginal.call(this);
            this.addCommand(CMD_MENU, 'donsSpirituels', true);
        };
        var _createCmd = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            _createCmd.call(this);
            this._commandWindow.setHandler('donsSpirituels', function () {
                SceneManager.push(Scene_Dons);
            });
        };
    }
})();
