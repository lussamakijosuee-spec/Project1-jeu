//=============================================================================
// AvatarSpirituel.js — v3.0  ·  L'Avatar Spirituel agit de lui-même
//   v3.0 — inséparable de sa porteuse · 3 niveaux (25/50/85) · contrôle croissant
// RPG Maker MV   ·   d'après le Codex des Trois Sources, chapitre 6.5
//   À charger APRÈS DonsSpirituels et TraitsAme.
//=============================================================================
/*:
 * @plugindesc v3.0 ■ L'AVATAR SPIRITUEL (2 %) n'est pas un bonus : c'est une créature,
 * et elle est INSÉPARABLE de sa porteuse. Il monte en 3 niveaux (25/50/85) :
 * automatique → semi-automatique → contrôle total, en apprenant des techniques.
 * @author JOKO
 *
 * @param postureDefaut
 * @text Posture par défaut
 * @type select
 * @option libre
 * @option agressif
 * @option garde
 * @default libre
 * @desc libre = il décide seul · agressif = il frappe toujours · garde = il ne fait que protéger.
 *
 * @param seuilDetresse
 * @text Posture LIBRE — % de PV sous lequel il cesse de frapper pour protéger
 * @type number
 * @min 0
 * @max 100
 * @default 40
 *
 * @param interceptLibre
 * @text Interception — % des dégâts encaissés (posture libre / agressif)
 * @type number
 * @min 0
 * @max 100
 * @default 20
 *
 * @param interceptGarde
 * @text Interception — % des dégâts encaissés (posture garde)
 * @type number
 * @min 0
 * @max 100
 * @default 45
 *
 * @param usureInterception
 * @text Interception — Endurance dépensée par coup encaissé
 * @type number
 * @min 0
 * @default 2
 *
 * @param palierDeferlante
 * @text Palier à partir duquel il peut déferler sur tout le groupe
 * @type number
 * @min 1
 * @max 4
 * @default 3
 *
 * @param brisePause
 * @text Avatar BRISÉ — il ne peut plus agir qu'un tour sur deux ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @param montrerLog
 * @text Annoncer ses actions dans le journal de combat
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @param niveau1
 * @text AVATAR niveau 1 — niveau du porteur requis
 * @type number
 * @min 2
 * @default 25
 * @desc Semi-automatique : il suit la cible qu'elle désigne, et elle peut lui donner un geste.
 *
 * @param niveau2
 * @text AVATAR niveau 2 — niveau du porteur requis
 * @type number
 * @min 3
 * @default 50
 * @desc Semi-automatique affermi : elle choisit la cible ET le geste.
 *
 * @param niveau3
 * @text AVATAR niveau 3 — niveau du porteur requis
 * @type number
 * @min 4
 * @default 85
 * @desc Contrôle total : plus de décalage, ils agissent d'un seul mouvement.
 *
 * @param puissanceParNiveau
 * @text Puissance gagnée par niveau d'Avatar (%)
 * @type number
 * @min 0
 * @default 15
 * @desc Ce que ses frappes gagnent à chaque niveau. « Plus la puissance augmente… »
 *
 * @param interceptParNiveau
 * @text Interception gagnée par niveau d'Avatar (points de %)
 * @type number
 * @min 0
 * @default 5
 *
 * @param inseparable
 * @text L'Avatar est INSÉPARABLE de sa porteuse ?
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 * @desc Il ne peut pas disparaître tant qu'elle est vivante ET consciente. Rien ne peut le lui retirer.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  L'AVATAR SPIRITUEL QUI AGIT                                Codex, chapitre 6.5
 * ═══════════════════════════════════════════════════════════════════════════
 *  « L'Avatar est une créature issue directement de l'âme — pas une
 *    invocation, pas un pacte : une part de soi qui marche à côté de soi. »
 *
 *  Les 2 % ne reçoivent pas un objet : ils reçoivent QUELQU'UN. Ce plugin lui
 *  donne ce qui lui manquait — un tour à lui.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  IL EST INSÉPARABLE                                     (option inseparable)
 *  ─────────────────────────────────────────────────────────────────────────
 *  « Il ne peut pas disparaître tant que l'utilisateur est vivant ou
 *    conscient. »
 *
 *  L'Avatar n'est pas un équipement qu'on perd : c'est une PART D'ELLE. Rien
 *  ne peut le lui retirer — ni un désarmement, ni un dissipateur, ni le
 *  joueur lui-même. **Il ne meurt pas non plus.** Brisé, il ne disparaît
 *  pas : il FATIGUE (un tour sur deux, tout ÷2).
 *
 *  Deux choses, et deux seulement, le font s'éteindre :
 *      • KORRAH TOMBE  → il s'éteint avec elle ;
 *      • KORRAH PERD CONSCIENCE (sommeil, étourdissement, paralysie — tout
 *        état qui l'empêche d'agir) → il s'éteint le temps qu'elle revienne.
 *  Elle rouvre les yeux, il est là. C'est le même lien que Dono et son
 *  second œil.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  IL MONTE EN NIVEAU — et elle le tient de mieux en mieux
 *  ─────────────────────────────────────────────────────────────────────────
 *  « Un avatar peut agir tout ou sous, mais c'est souvent indépendant de
 *    l'utilisateur. Plus la puissance augmente, plus l'utilisateur peut
 *    contrôler l'avatar. »
 *
 *  L'Avatar a TROIS NIVEAUX, qui montent avec sa porteuse :
 *
 *   ┌─────────────┬──────────┬────────────────────┬──────────────────────────┐
 *   │ Avatar      │ Korrah   │ Contrôle           │ Ce qu'elle peut faire    │
 *   ├─────────────┼──────────┼────────────────────┼──────────────────────────┤
 *   │ (naissance) │ 1 → 24   │ AUTOMATIQUE        │ une posture, rien de plus│
 *   │ niveau 1    │ **25**   │ SEMI-AUTOMATIQUE   │ + désigner la CIBLE      │
 *   │ niveau 2    │ **50**   │ SEMI-AUTO affermi  │ + choisir le GESTE       │
 *   │ niveau 3    │ **85**   │ CONTRÔLE TOTAL     │ + tout son arsenal       │
 *   └─────────────┴──────────┴────────────────────┴──────────────────────────┘
 *
 *  À chaque niveau il gagne aussi +15 % de puissance, +5 points d'interception,
 *  et il APPREND DE NOUVELLES TECHNIQUES — deux par niveau :
 *
 *    niveau 1 · Poings Enchaînés (1249)      · Saisie de l'Armure (1250)
 *    niveau 2 · Étau de l'Armure (1251)      · Le Torse Se Referme (1252)
 *    niveau 3 · Déferlante d'Unisson (1253)  · Ce Que Le Froid Garde (1254)
 *
 *  En AUTOMATIQUE il choisit dans le lot débloqué. Elle, elle apprend en
 *  parallèle les ORDRES qui lui donnent la main dessus (voir plus bas).
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  IL JOUE SON PROPRE TOUR
 *  ─────────────────────────────────────────────────────────────────────────
 *  Quand sa porteuse a fini d'agir, l'Avatar agit à son tour. Ce n'est pas
 *  une seconde action pour elle : c'est LUI qui frappe, avec ses compétences,
 *  son animation, sa cible. Elle n'a rien à dépenser.
 *
 *  Il choisit seul :
 *    • palier 1-2  → il frappe une cible ;
 *    • palier 3-4  → il alterne, et déferle sur tout le groupe un tour sur deux ;
 *    • s'il n'y a qu'un ennemi, il ne déferle jamais — il cogne.
 *  Sa cible : celle que sa porteuse vient de frapper (il finit le travail),
 *  sinon l'ennemi le plus bas en PV.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  IL SE MET DEVANT
 *  ─────────────────────────────────────────────────────────────────────────
 *  Un torse qui flotte sans corps, ça sert à ça. Quand sa porteuse encaisse un
 *  coup, l'Avatar en prend une part — et c'est SON Endurance qui la paie.
 *  Protéger l'use : un Avatar qui a beaucoup gardé finit par se disloquer.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  LES TROIS POSTURES — ET ON LES DONNE EN PLEIN COMBAT
 *  ─────────────────────────────────────────────────────────────────────────
 *    ▶ LIBRE     (défaut) il frappe, intercepte un peu — et bascule tout seul
 *                en protection quand sa porteuse tombe sous seuilDetresse %.
 *    ▶ AGRESSIF  il frappe toujours, quoi qu'il arrive. Intercepte peu.
 *    ▶ GARDE     il ne frappe plus du tout. Il ne fait que se mettre devant,
 *                et encaisse presque la moitié de ce qui vise sa porteuse.
 *
 *  La posture ne se réglait que par commande d'événement : le joueur n'avait
 *  AUCUNE prise sur la seule créature autonome du jeu. Korrah connaît
 *  maintenant trois ORDRES, dès le niveau 1, sous « Spéciale » :
 *
 *      ✦ Avatar — Laisse-le faire   → posture LIBRE
 *      ✦ Avatar — Assaut            → posture AGRESSIF
 *      ✦ Avatar — Devant moi        → posture GARDE
 *
 *  Ils coûtent 0 mana, et le tour n'est pas perdu : donner l'ordre le fait
 *  agir DANS LA FOULÉE. On paie une action, on obtient une action.
 *  Toute compétence notée <AvatarPosture: libre|agressif|garde> fait ça.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  LES ORDRES DIRIGÉS — la prise qui grandit  <AvatarOrdre: skillId>
 *  ─────────────────────────────────────────────────────────────────────────
 *  Une posture dit COMMENT il se comporte. Un ordre dirigé dit QUOI FAIRE,
 *  ET SUR QUI. C'est là que se joue « plus la puissance augmente, plus elle
 *  le contrôle » : elle n'en débloque un que quand l'Avatar monte de niveau.
 *
 *    ✦ Avatar — Vise ça   (1255) · niveau 1 · dès 25 · elle désigne la cible
 *    ✦ Avatar — Étau      (1256) · niveau 2 · dès 50 · + elle choisit le geste
 *    ✦ Avatar — Unisson   (1257) · niveau 3 · dès 85 · tout le champ, d'un coup
 *    ✦ Avatar — Rends-le  (1258) · niveau 3 · dès 85 · le froid qu'elle a confié
 *
 *  Un ordre au-dessus du niveau de l'Avatar est REFUSÉ proprement : il ne
 *  sait pas encore faire, on le lui dit, et le tour n'est pas gaspillé.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  CE QU'IL COÛTE — la contrepartie des 2 %
 *  ─────────────────────────────────────────────────────────────────────────
 *   • Il occupe le slot ÂME (voir DonsSpirituels).
 *   • Chacune de ses frappes USE l'Endurance du Don, comme celles de sa
 *     porteuse : un Avatar actif brûle sa jauge DEUX FOIS PLUS VITE.
 *   • Chaque interception coûte usureInterception de plus.
 *   • BRISÉ, il agit un tour sur deux et tout ce qu'il fait est divisé par
 *     deux (dégâts comme interception). Il ne meurt pas : il fatigue.
 *   • ABSENT du slot Âme, il n'existe pas — et le Trait qu'il débloquait
 *     non plus.
 *
 *  ⚠️ IL NE PORTE PAS LE TRAIT À LA PLACE DE SA PORTEUSE. Les frappes de
 *     l'Avatar sont des frappes d'Avatar : elles n'ont pas l'élément
 *     GLACE et ne déclenchent pas le recul d'HIVER. Le froid reste le prix
 *     que Korrah paie elle-même — sinon l'Avatar deviendrait la faille
 *     qui annule la règle d'or.
 *
 *  ⚠️ ET C'EST SON SEUL DON. Korrah n'a pas d'arme spirituelle en plus :
 *     ses gantelets sont de l'acier ordinaire. On n'a qu'un Don, jamais deux.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  COMMANDES DE PLUGIN
 *  ─────────────────────────────────────────────────────────────────────────
 *    AVATAR posture 2 garde   → change la posture de l'Avatar de l'acteur 2
 *    AVATAR agir 2            → le fait agir immédiatement (scénario)
 *    AVATAR etat              → résumé dans le journal
 *    (FAMILIER … reste accepté : les anciens événements continuent de marcher)
 *
 *  SCRIPT :  window.Avatars.de(actorId)      → {nom, posture, actif, palier}
 *            window.Avatars.posture(2,'garde')
 *            window.Avatars.present(2)       → true si l'Avatar est là
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('AvatarSpirituel');
    var POSTURE_DEF = String(P['postureDefaut'] || 'libre');
    var DETRESSE    = parseInt(P['seuilDetresse']     || 40);
    var INT_LIBRE   = parseInt(P['interceptLibre']    || 20);
    var INT_GARDE   = parseInt(P['interceptGarde']    || 45);
    var USURE_INT   = parseInt(P['usureInterception'] || 2);
    var PAL_DEFER   = parseInt(P['palierDeferlante']  || 3);
    var BRISE_PAUSE = String(P['brisePause'] || 'true') === 'true';
    var LOG_ON      = String(P['montrerLog'] || 'true') === 'true';
    var NIV         = [parseInt(P['niveau1'] || 25),
                       parseInt(P['niveau2'] || 50),
                       parseInt(P['niveau3'] || 85)];
    var PUISS_NIV   = parseInt(P['puissanceParNiveau'] || 15);
    var INT_NIV     = parseInt(P['interceptParNiveau'] || 5);
    var INSEPARABLE = String(P['inseparable'] || 'true') === 'true';

    // ── Qui a un avatar, et de quoi il est capable ────────────────────────
    //    lot : les techniques qu'il sait jouer, par niveau d'Avatar.
    //    Au niveau 0 il n'a que ses trois gestes de naissance ; à chaque
    //    niveau il en APPREND deux de plus et pioche dedans tout seul.
    var AVATARS = {
        2: {
            nom: "l'Armure Volante",
            frappe: 469, deferlante: 470, garde: 471,
            lot: {
                1: { frappes: [1249, 1250] },                  // dès le niveau 25
                2: { frappes: [1251], gardes: [1252] },        // dès le niveau 50
                3: { frappes: [1253, 1254] }                   // dès le niveau 85
            }
        }
    };
    var POSTURES = ['libre', 'agressif', 'garde'];
    var NIV_NOM  = ['Instinct', 'Accord', 'Conduite', 'Unisson'];
    var CONTROLE = ['AUTOMATIQUE', 'SEMI-AUTOMATIQUE', 'SEMI-AUTOMATIQUE affermi', 'CONTRÔLE TOTAL'];

    //=========================================================================
    // OUTILS
    //=========================================================================
    function conf(id) { return AVATARS[id] || null; }
    function acteur(id) {
        try { return $gameActors ? $gameActors.actor(id) : null; } catch (e) { return null; }
    }
    function store() {
        if (!$gameSystem) return null;
        if (!$gameSystem._avatars) $gameSystem._avatars = {};
        return $gameSystem._avatars;
    }
    function etat(id) {
        var s = store();
        if (!s || !conf(id)) return null;
        if (!s[id]) s[id] = { posture: POSTURE_DEF, tours: 0, aAgi: false };
        return s[id];
    }
    //=========================================================================
    // IL EST INSÉPARABLE — il ne s'éteint qu'avec elle
    //=========================================================================
    // « Elle peut pas disparaître tant que l'utilisateur est vivant ou
    //   conscient. » L'Avatar n'est pas un objet qu'on porte : c'est une part
    //   d'elle. Deux choses seulement l'éteignent — elle tombe, ou elle perd
    //   conscience. Ni la casse, ni un dissipateur, ni le joueur.
    /** Consciente = vivante ET capable d'agir (restriction 4 = ne peut pas bouger). */
    function consciente(a) {
        if (!a || !a.isAlive || !a.isAlive()) return false;
        try { if (a.restriction && a.restriction() === 4) return false; } catch (e) { }
        return true;
    }

    /** L'Avatar est-il là ? On demande à DonsSpirituels, seule source de vérité. */
    function present(id) {
        if (!conf(id)) return false;
        try {
            if (INSEPARABLE && !consciente(acteur(id))) return false;  // tombée ou inconsciente
            if (!window.Dons) return true;
            return window.Dons.aLaForme(id, 'avatar') && window.Dons.estPorte(id);
        } catch (e) { return false; }
    }

    //=========================================================================
    // SON NIVEAU — il monte avec elle
    //=========================================================================
    /** 0 (naissance) · 1 (25) · 2 (50) · 3 (85) — seuils réglables. */
    function niveau(id) {
        var a = acteur(id);
        if (!a) return 0;
        var lv = a.level || 1, n = 0;
        for (var i = 0; i < NIV.length; i++) if (lv >= NIV[i]) n = i + 1;
        return n;
    }
    /** Toutes les techniques qu'il sait jouer à son niveau actuel. */
    function repertoire(id, sorte) {
        var c = conf(id), n = niveau(id), out = [];
        if (!c) return out;
        out.push(sorte === 'gardes' ? c.garde : c.frappe);
        for (var i = 1; i <= n; i++) {
            var l = c.lot && c.lot[i];
            if (l && l[sorte]) out = out.concat(l[sorte]);
        }
        return out.filter(function (s) { return s && $dataSkills[s]; });
    }
    /** Le niveau d'Avatar exigé par une compétence : <AvatarNiveau: n>. */
    function niveauExige(item) {
        if (!item || !item.meta) return 0;
        var n = parseInt(item.meta['AvatarNiveau']);
        return n > 0 ? n : 0;
    }
    /** Ce que vaut l'Avatar en ce moment : 0 absent · 0.5 brisé · 1 entier. */
    function facteur(id) {
        try { return window.Dons ? window.Dons.facteur(id) : 1; } catch (e) { return 1; }
    }
    function brise(id) {
        try { return !!(window.Dons && window.Dons.estCasse(id)); } catch (e) { return false; }
    }
    function palier(id) {
        try { return window.Dons ? window.Dons.palier(id) : 1; } catch (e) { return 1; }
    }
    function log(txt) {
        if (!LOG_ON) return;
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', txt); w.push('wait'); return; }
        // ⚠ LE JOURNAL DE L'AVATAR EST UN JOURNAL DE COMBAT. Hors combat, il
        // se tait.
        //
        // Ce repli écrivait dans `$gameMessage` dès qu'il n'y avait pas de
        // journal — c'est-à-dire sur la CARTE. Or sur la carte, une boîte de
        // dialogue ouverte par du code n'est pilotée par aucun interpréteur :
        // personne ne la referme, et `$gameMessage.isBusy()` reste vrai pour
        // toujours.
        //
        // Mesuré : `surveillerLien()` part de `Game_Battler.refresh`, donc dès
        // la création de la partie. Le message « Korrah rouvre les yeux »
        // s'installait dans la file, et tout ce qui attend un message libre se
        // figeait derrière. `VieDuVillage` teste `$gameMessage.isBusy()` avant
        // de recenser : il ne prenait plus en charge AUCUN des 12 PNJ du
        // Village de Pêche. Le village était mort, sans une seule erreur
        // JavaScript pour le dire.
        if ($gameParty && $gameParty.inBattle() && $gameMessage && !$gameMessage.isBusy()) {
            $gameMessage.add(txt);
        }
    }
    function porteurDe(battler) {
        if (!battler || !battler.isActor || !battler.isActor()) return 0;
        var id = battler.actorId();
        return conf(id) ? id : 0;
    }

    //=========================================================================
    // API
    //=========================================================================
    window.Avatars = {
        de: function (id) {
            var c = conf(id), e = etat(id);
            if (!c || !e) return null;
            var n = niveau(id), a = acteur(id);
            return {
                nom: c.nom, posture: e.posture, present: present(id),
                actif: present(id) && !(BRISE_PAUSE && brise(id) && e.tours % 2 === 1),
                brise: brise(id), palier: palier(id), facteur: facteur(id),
                niveau: n, niveauNom: NIV_NOM[n], controle: CONTROLE[n],
                prochainSeuil: n < NIV.length ? NIV[n] : 0,
                puissance: 1 + n * PUISS_NIV / 100,
                techniques: repertoire(id, 'frappes').concat(repertoire(id, 'gardes')),
                consciente: consciente(a),
                eteinte: !!(a && !consciente(a))
            };
        },
        present: present,
        niveau: niveau,
        consciente: function (id) { return consciente(acteur(id)); },
        posture: function (id, mot) {
            var e = etat(id);
            if (!e) return '';
            mot = String(mot || '').toLowerCase().trim();
            if (POSTURES.indexOf(mot) >= 0) {
                e.posture = mot;
                var c = conf(id);
                log('\\C[23]' + c.nom + ' change de posture : ' + mot + '.\\C[0]');
            }
            return e.posture;
        },
        agir: function (id) { faireAgir(acteur(id), null); }
    };
    // Ancien nom de l'API, conservé pour ne rien casser.
    window.Familiers = window.Avatars;

    //=========================================================================
    // MANIABLE — TROIS ORDRES, DONNÉS EN COMBAT
    //=========================================================================
    // Une créature autonome que le joueur ne peut pas piloter, ce n'est pas de
    // la profondeur, c'est du hasard. Toute compétence portant
    // <AvatarPosture: libre|agressif|garde> change la posture ET fait agir
    // l'Avatar dans la foulée : le tour dépensé rapporte quand même un coup.
    function ordreDe(item) {
        if (!item || !item.meta) return '';
        var p = item.meta['AvatarPosture'];
        if (!p || p === true) return '';
        p = String(p).toLowerCase().trim();
        if (p === 'assaut') p = 'agressif';          // synonyme toléré
        return POSTURES.indexOf(p) >= 0 ? p : '';
    }

    //=========================================================================
    // LES ORDRES DIRIGÉS — <AvatarOrdre: skillId>
    //=========================================================================
    // Une posture dit COMMENT il se comporte. Un ordre dirigé dit QUOI faire,
    // ET SUR QUI : c'est la prise qu'elle gagne en montant de niveau. Elle
    // désigne la cible dans le menu de combat, l'Avatar exécute — le geste
    // reste le SIEN, elle ne fait que le diriger.
    function ordreDirige(item) {
        if (!item || !item.meta) return 0;
        var s = parseInt(item.meta['AvatarOrdre']);
        return (s > 0 && $dataSkills[s]) ? s : 0;
    }

    var _applyGlobal = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function () {
        _applyGlobal.call(this);
        try {
            if (this._parAvatar) return;
            var s = this.subject(), id = porteurDe(s);
            if (!id) return;
            var item = this.item();
            var posture = ordreDe(item), dirige = ordreDirige(item);
            if (!posture && !dirige) return;

            if (!present(id)) {
                var a = acteur(id);
                log(a && !consciente(a)
                    ? "\\C[7]" + conf(id).nom + " s'est éteint avec elle. Il reviendra quand elle reviendra.\\C[0]"
                    : "\\C[7]Aucun Avatar ne répond — il n'est pas au slot Âme.\\C[0]");
                return;
            }
            // Un ordre au-dessus de son niveau : il ne sait pas encore faire.
            var exige = niveauExige(item);
            if (exige > niveau(id)) {
                log('\\C[7]' + conf(id).nom + ' ne sait pas encore faire ça. '
                    + '(Avatar niveau ' + niveau(id) + '/' + NIV.length
                    + ' — il faut le niveau ' + exige + ')\\C[0]');
                return;
            }

            if (posture) window.Avatars.posture(id, posture);
            // L'ordre ne coûte pas le tour : il agit tout de suite.
            s._avatarAgiCeTour = true;
            // Cible dirigée : celle qu'ELLE vient de désigner dans le menu.
            var vise = (this._targets && this._targets.length) ? this._targets[0] : null;
            if (!vise) {
                try {
                    var t = this.makeTargets().filter(function (x) { return x && x.isEnemy && x.isEnemy(); });
                    vise = t.length ? t[0] : null;
                } catch (e2) { }
            }
            faireAgir(s, vise, dirige || 0);
        } catch (e) { /* ne jamais casser un combat */ }
    };

    //=========================================================================
    // IL CHOISIT SA CIBLE ET SON GESTE
    //=========================================================================
    function ennemisVivants() {
        try { return $gameTroop.aliveMembers(); } catch (e) { return []; }
    }
    /** Sa cible : celle que sa porteuse vient de frapper, sinon la plus basse en PV. */
    function choisirCible(derniereCible) {
        var vivants = ennemisVivants();
        if (!vivants.length) return null;
        if (derniereCible && derniereCible.isEnemy && derniereCible.isEnemy() && derniereCible.isAlive()) {
            return derniereCible;
        }
        return vivants.reduce(function (a, b) { return b.hp < a.hp ? b : a; });
    }
    /**
     * Son geste. En AUTOMATIQUE il pioche seul dans le répertoire de son
     * niveau ; plus il monte, plus il a de gestes à choisir. La déferlante
     * reste réservée aux groupes et au palier du Don.
     */
    function choisirGeste(id) {
        var c = conf(id), e = etat(id), plusieurs = ennemisVivants().length > 1;

        if (palier(id) >= PAL_DEFER && plusieurs && e.tours % 2 === 1) {
            // à haut niveau il connaît plusieurs façons de balayer le champ
            var larges = repertoire(id, 'frappes').filter(function (s) {
                return $dataSkills[s] && $dataSkills[s].scope === 2;
            });
            larges.unshift(c.deferlante);
            return larges[e.tours % larges.length];
        }
        // frappes simples : il alterne dans ce qu'il sait faire
        var simples = repertoire(id, 'frappes').filter(function (s) {
            return $dataSkills[s] && $dataSkills[s].scope !== 2;
        });
        if (!simples.length) return c.frappe;
        return simples[e.tours % simples.length];
    }
    /** Sa garde. Elle s'étoffe aussi : au niveau 2 il sait tout refermer. */
    function choisirGarde(id) {
        var g = repertoire(id, 'gardes');
        return g.length ? g[g.length - 1] : conf(id).garde;
    }
    /** En posture LIBRE, il cesse de frapper quand sa porteuse est en danger. */
    function veutProteger(id) {
        var e = etat(id), a = acteur(id);
        if (!e || !a) return false;
        if (e.posture === 'garde')    return true;
        if (e.posture === 'agressif') return false;
        return a.mhp > 0 && (a.hp / a.mhp) * 100 <= DETRESSE;
    }

    //=========================================================================
    // IL JOUE SON TOUR
    //=========================================================================
    /**
     * @param porteur       sa porteuse
     * @param derniereCible ce qu'elle vient de frapper (ou ce qu'elle DÉSIGNE)
     * @param impose        technique imposée par un ordre dirigé, 0 sinon
     */
    function faireAgir(porteur, derniereCible, impose) {
        if (!porteur || !porteur.isActor || !porteur.isActor()) return;
        var id = porteur.actorId(), c = conf(id), e = etat(id);
        if (!c || !e || !present(id) || !porteur.isAlive()) return;

        e.tours++;
        // brisé, il ne s'en relève qu'un tour sur deux
        if (BRISE_PAUSE && brise(id) && e.tours % 2 === 1) {
            log('\\C[8]' + c.nom + ' se recompose péniblement — il ne suit pas.\\C[0]');
            return;
        }
        // il préfère se tenir devant elle — sauf ordre dirigé : là, elle décide
        if (!impose && veutProteger(id)) {
            var garde = choisirGarde(id);
            log('\\C[23]✦ ' + c.nom + ' se place devant ' + porteur.name() + '.\\C[0]');
            montrer(porteur, [porteur], $dataSkills[garde].animationId);
            return;
        }
        var cible = choisirCible(derniereCible);
        if (!cible) return;

        var action = new Game_Action(porteur);
        action.setSkill(impose || choisirGeste(id));
        action._parAvatar = true;
        // c'est LUI qui désigne : sans ça, MV taperait au hasard
        try {
            var i = $gameTroop.members().indexOf(cible);
            if (i >= 0) action.setTarget(i);
        } catch (e) { }
        var cibles = action.makeTargets().filter(function (t) { return t; });
        if (!cibles.length) return;

        // Sa puissance monte avec son niveau — c'est le corps du Don qui
        // s'affermit, pas une statistique de sa porteuse. On l'applique sur
        // la valeur des dégâts, pour ne rien changer à ses propres chiffres.
        var mult = 1 + niveau(id) * PUISS_NIV / 100;
        action._avatarMult = mult;

        log(impose
            ? '\\C[23]✦ ' + porteur.name() + ' dirige ' + c.nom + ' : « '
              + $dataSkills[impose].name + ' ».\\C[0]'
            : '\\C[23]✦ ' + c.nom + ' agit de lui-même.\\C[0]');
        montrer(porteur, cibles, action.item().animationId);
        // Les répétitions : l'Avatar joue son action à la main, donc MV
        // n'applique pas numRepeats() pour lui. Sans cette boucle, une
        // technique à 3 coups n'en porterait qu'un seul.
        var fois = 1;
        try { fois = Math.max(1, action.numRepeats ? action.numRepeats() : (action.item().repeats || 1)); }
        catch (e) { fois = Math.max(1, action.item().repeats || 1); }
        for (var r = 0; r < fois; r++) {
            cibles.forEach(function (t) {
                if (!t.isAlive || t.isAlive()) {
                    action.apply(t);
                    var w = SceneManager._scene && SceneManager._scene._logWindow;
                    if (w) w.displayActionResults(porteur, t);
                }
            });
        }
        action.applyGlobal();
    }

    // La puissance du niveau s'applique aux seules frappes de l'Avatar.
    var _makeDamage = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _makeDamage.call(this, target, critical);
        try {
            if (this._parAvatar && this._avatarMult && v > 0) {
                v = Math.floor(v * this._avatarMult);
            }
        } catch (e) { }
        return v;
    };

    function montrer(sujet, cibles, animId) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w && animId > 0) w.push('showAnimation', sujet, cibles.slice(), animId);
    }

    // Après chaque action de sa porteuse, l'Avatar prend la parole.
    var _endAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        try {
            var s = this._subject;
            if (porteurDe(s) && !s._avatarAgiCeTour) {
                s._avatarAgiCeTour = true;
                var derniere = this._targets && this._targets.length ? this._targets[0] : null;
                faireAgir(s, derniere);
            }
        } catch (e) { /* ne jamais casser un combat */ }
        _endAction.call(this);
    };

    // Le drapeau retombe à chaque tour.
    var _turnStart = Game_Battler.prototype.onTurnStart;
    Game_Battler.prototype.onTurnStart = function () {
        if (_turnStart) _turnStart.call(this);
        this._avatarAgiCeTour = false;
    };
    var _battleStart = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function () {
        if (_battleStart) _battleStart.call(this);
        this._avatarAgiCeTour = false;
        var id = porteurDe(this), e = id ? etat(id) : null;
        if (e) e.tours = 0;
    };

    //=========================================================================
    // IL SE MET DEVANT — et c'est son Endurance qui paie
    //=========================================================================
    function interception(cible, degats) {
        var id = porteurDe(cible);
        if (!id || degats <= 0 || !present(id)) return degats;
        var e = etat(id);
        var pct = (e.posture === 'garde') ? INT_GARDE : INT_LIBRE;
        pct += niveau(id) * INT_NIV;                    // il encaisse mieux en montant
        pct = Math.floor(pct * facteur(id));            // brisé : il n'encaisse plus que la moitié
        if (pct <= 0) return degats;

        var pris = Math.floor(degats * pct / 100);
        if (pris <= 0) return degats;

        // protéger l'use : l'Avatar prend le coup dans son propre corps
        try {
            if (window.Dons && USURE_INT > 0) {
                var f = window.Dons.de(id);
                if (f && !f.casse) {
                    var reste = f.endurance - USURE_INT;
                    if (reste <= 0) window.Dons.casser(id);
                    else $gameSystem._donsSpi[id].end = reste;
                }
            }
        } catch (err) { }

        log('\\C[23]' + conf(id).nom + ' encaisse à sa place. (−' + pris + ')\\C[0]');
        return degats - pris;
    }

    var _exeHp = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function (target, value) {
        try { if (value > 0) value = interception(target, value); } catch (e) { }
        _exeHp.call(this, target, value);
    };

    //=========================================================================
    // IL S'ÉTEINT AVEC ELLE — et il revient avec elle
    //=========================================================================
    // On ne le dit qu'au changement d'état : sinon c'est un message par tour.
    function surveillerLien(battler) {
        var id = porteurDe(battler);
        if (!id || !INSEPARABLE) return;
        var e = etat(id);
        if (!e) return;
        var la = consciente(battler);
        if (e.eveille === undefined) { e.eveille = la; return; }
        if (la === e.eveille) return;
        e.eveille = la;
        var c = conf(id);
        log(la
            ? '\\C[23]✦ ' + battler.name() + ' rouvre les yeux — ' + c.nom + ' est là.\\C[0]'
            : '\\C[8]' + c.nom + " s'éteint avec elle. Rien d'autre ne peut le lui prendre.\\C[0]");
    }
    var _refresh = Game_Battler.prototype.refresh;
    Game_Battler.prototype.refresh = function () {
        _refresh.call(this);
        try { surveillerLien(this); } catch (e) { }
    };

    //=========================================================================
    // IL MONTE EN NIVEAU AVEC ELLE — et on le lui dit
    //=========================================================================
    var _levelUp = Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp = function () {
        var avant = porteurDe(this) ? niveau(this.actorId()) : -1;
        _levelUp.call(this);
        try {
            var id = porteurDe(this);
            if (!id || avant < 0) return;
            var apres = niveau(id);
            if (apres <= avant) return;
            var c = conf(id), nouvelles = [];
            for (var i = avant + 1; i <= apres; i++) {
                var l = c.lot && c.lot[i];
                if (!l) continue;
                (l.frappes || []).concat(l.gardes || []).forEach(function (s) {
                    if ($dataSkills[s]) nouvelles.push($dataSkills[s].name);
                });
            }
            var txt = '\\C[14]✦ ' + c.nom + ' passe au niveau ' + apres + '/' + NIV.length
                    + ' — ' + NIV_NOM[apres] + '. ' + CONTROLE[apres] + '.\\C[0]';
            if (nouvelles.length) txt += '\n\\C[23]Il apprend : ' + nouvelles.join(' · ') + '.\\C[0]';
            if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(txt); else log(txt);
        } catch (e) { }
    };

    //=========================================================================
    // COMMANDES DE PLUGIN
    //=========================================================================
    var _pc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
        _pc.call(this, cmd, args);
        // FAMILIER reste accepté : les événements écrits avant le renommage
        // continuent de fonctionner tels quels.
        var mot = String(cmd).toUpperCase();
        if (mot !== 'AVATAR' && mot !== 'FAMILIER') return;
        var sous = (args[0] || '').toLowerCase();
        if (sous === 'posture') {
            window.Avatars.posture(parseInt(args[1] || 0), args[2]);
        } else if (sous === 'agir') {
            window.Avatars.agir(parseInt(args[1] || 0));
        } else if (sous === 'etat') {
            Object.keys(AVATARS).forEach(function (k) {
                var f = window.Avatars.de(parseInt(k));
                if (!f) return;
                log(f.nom + ' — ' + (f.present ? 'présent' : (f.eteinte ? 'ÉTEINT (elle est hors jeu)' : 'absent'))
                    + ', posture ' + f.posture + ', palier du Don ' + f.palier
                    + ', Avatar niveau ' + f.niveau + '/3 (' + f.niveauNom + ')'
                    + ', ' + f.controle
                    + (f.brise ? ', BRISÉ (÷2)' : ''));
                log('    ' + f.techniques.length + ' technique(s) : '
                    + f.techniques.map(function (s) { return $dataSkills[s].name; }).join(' · '));
            });
        }
    };
})();
