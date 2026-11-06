//=============================================================================
// TraitsAme.js — v2.0  ·  Les Traits d'Âme (le don de naissance)
// RPG Maker MV   ·   by JOKO   ·   d'après le Codex des Trois Sources
//   À charger APRÈS Errance, JadeEntitePlunging, MarqueVivante et DonsSpirituels.
//=============================================================================
/*:
 * @plugindesc v2.0 ■ Le TRAIT : le don unique que l'âme offre à la naissance.
 * Rare — il faut une âme puissante et une volonté forte. Le porteur en subit
 * les effets lui aussi : c'est pour ça que le Don Spirituel est sa sécurité.
 * @author JOKO
 *
 * @param drainPM
 * @text Prix — % des PM max drainés par usage
 * @type number
 * @default 20
 *
 * @param drainTP
 * @text Prix — TP drainés par usage
 * @type number
 * @default 20
 *
 * @param errancePar
 * @text Prix — Errance par usage (forcer la marque)
 * @type number
 * @default 2
 *
 * @param erranceForce
 * @text Prix — Errance si la marque n'est pas la tienne
 * @type number
 * @default 6
 *
 * @param etatEnvers
 * @text État « l'Envers » (bonus de l'Absorption des Âmes)
 * @type state
 * @default 204
 *
 * @param sangDrain
 * @text SANG — % des dégâts rendus à Vesper
 * @type number
 * @min 0
 * @default 25
 *
 * @param hiverRecul
 * @text HIVER — % des dégâts que Korrah subit en retour
 * @type number
 * @min 0
 * @default 15
 *
 * @param hiverElement
 * @text HIVER — élément forcé (13 = GLACE)
 * @type number
 * @default 13
 *
 * @param amesGain
 * @text ABSORPTION — âmes gagnées par usage
 * @type number
 * @min 0
 * @default 2
 *
 * @param amesVar
 * @text ABSORPTION — variable « Âmes Damnées »
 * @type variable
 * @default 15
 *
 * @param miracleSeuil
 * @text MIRACLE — PM dépensés par tour à ne pas dépasser
 * @type number
 * @default 20
 *
 * @param miracleGain
 * @text MIRACLE — progression par tour économe
 * @type number
 * @default 20
 *
 * @param miraclePerte
 * @text MIRACLE — progression perdue par tour dépensier
 * @type number
 * @default 25
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LES TRAITS D'ÂME                                     Codex, chapitre 6-bis
 * ═══════════════════════════════════════════════════════════════════════════
 *  À la naissance, l'âme offre TOUJOURS deux choses :
 *    • un DON SPIRITUEL — une arme, un objet OU un avatar (un seul, jamais deux) (DonsSpirituels.js) ;
 *    • un TRAIT — une capacité unique qui n'appartient qu'à toi.
 *  Le Trait est RARE : il faut une certaine puissance, une volonté forte, une
 *  âme puissante. Tout le reste s'apprend ; le Trait, lui, est là depuis le
 *  début. C'est la MARQUE qui l'active.
 *
 *  ⚖️ RÈGLE D'OR — le porteur est affecté par son PROPRE Trait. C'est pour
 *     cela que le Don Spirituel arrive comme une sécurité adaptée : un Trait
 *     de feu appelle une arme de distance. Il faut bien jouer.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  LES CINQ TRAITS
 *  ─────────────────────────────────────────────────────────────────────────
 *  ▶ VESPER — LE SANG  ·  <Trait: sang>
 *      Elle contrôle son sang DIRECTEMENT, sans formule, et le fusionne avec
 *      le mana. Ses frappes ne ratent jamais (le sang obéit) et lui rendent
 *      sangDrain % des dégâts : son sang lui revient.
 *      Sécurité : LE MASQUE. Tant qu'il tient, elle ne se blesse pas. Brisé,
 *      chaque attaque de sang la coûte (voir DonsSpirituels).
 *
 *  ▶ KORRAH — CHANGE  ·  <Trait: change>          (Trait de base)
 *      Elle échange les places. Visée sur un allié : elle prend sa position
 *      dans l'ordre du groupe ET lui reprend ses états négatifs. Elle prend
 *      sa place, fardeau compris.
 *
 *  ▶ KORRAH — HIVER  ·  <Trait: hiver>            (via son AVATAR SPIRITUEL)
 *      La glace sans passer par une formule. L'attaque devient de l'élément
 *      GLACE — et Korrah en subit hiverRecul % en retour : le froid ne fait
 *      pas de distinction. C'est son Avatar Spirituel qui débloque ce Trait, mais
 *      c'est bien ELLE qui le possède.
 *      ⚠ AVATAR ABSENT DU SLOT ÂME → HIVER ne répond plus du tout (les
 *        compétences <Trait: hiver> deviennent impayables). Avatar BRISÉ →
 *        il répond encore, mais ce qu'il rapporte est divisé par deux.
 *        CHANGE, lui, est son Trait de base : il ne dépend de rien.
 *
 *  ▶ LUDWING — L'ABSORPTION DES ÂMES  ·  <Trait: ames>
 *      Il absorbe les âmes directement et les emploie : +amesGain âmes et des
 *      PM rendus à chaque frappe, plus un pied dans l'Envers (état bonus).
 *      ⚠ L'OMBRE N'EST PAS SON TRAIT : elle vient de son AMULETTE. Quand
 *      celle-ci explose, l'absorption tombe de moitié (voir DonsSpirituels).
 *
 *  ▶ AËL — MIRACLE  ·  <Trait: miracle>
 *      Elle développe ses techniques EN TEMPS RÉEL. Chaque tour où elle
 *      dépense peu de mana (≤ miracleSeuil PM) fait monter le Miracle ; un
 *      tour dépensier le fait retomber. À 100, sa prochaine frappe de Trait
 *      touche l'ennemi PAR SA FAIBLESSE, même si elle ne connaît pas le sort
 *      — ça se matérialise en flèche. Puis le compteur repart de zéro.
 *      C'est lent, et ça demande de l'économie : c'est tout le personnage.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  ANCIENNES CLÉS — reprises, pas abandonnées
 *  ─────────────────────────────────────────────────────────────────────────
 *  Les compétences déjà notées <Trait: rupture|gel|porte|verbe> continuent de
 *  fonctionner : chaque ancienne clé pointe vers le Trait NOUVEAU DU MÊME
 *  PERSONNAGE. Rien à retaguer, mais tu peux le faire quand tu veux.
 *      rupture → sang      (Vesper)      gel   → hiver   (Korrah)
 *      porte   → ames      (Ludwing)     verbe → miracle (Aël)
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  LE PRIX (inchangé — il marchait, on le garde)
 *  ─────────────────────────────────────────────────────────────────────────
 *   • drainPM % des PM max ET drainTP TP à chaque usage, en plus du coût ;
 *   • +errancePar Errance par usage : forcer la marque use l'âme ;
 *   • marque étrangère : prix doublé et +erranceForce Errance ;
 *   • Marque CREUSE : le Trait NE RÉPOND PLUS.
 *
 *  SCRIPT :  window.Traits.de(actorId)            → {cle, nom, don}
 *            window.Traits.tous(actorId)          → tous ses Traits
 *            window.Traits.possede(actorId, 'hiver')
 *            window.Traits.miracle(4)             → progression 0-100
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('TraitsAme');
    var D_PM   = parseInt(P['drainPM']      || 20);
    var D_TP   = parseInt(P['drainTP']      || 20);
    var ERR    = parseInt(P['errancePar']   || 2);
    var ERR_F  = parseInt(P['erranceForce'] || 6);
    var ENVERS = parseInt(P['etatEnvers']   || 204);
    var SANG_DRAIN = parseInt(P['sangDrain']    || 25);
    var HIVER_REC  = parseInt(P['hiverRecul']   || 15);
    var HIVER_ELEM = parseInt(P['hiverElement'] || 13);
    var AMES_GAIN  = parseInt(P['amesGain']     || 2);
    var AMES_VAR   = parseInt(P['amesVar']      || 15);
    var MIR_SEUIL  = parseInt(P['miracleSeuil'] || 20);
    var MIR_GAIN   = parseInt(P['miracleGain']  || 20);
    var MIR_PERTE  = parseInt(P['miraclePerte'] || 25);

    // ── Le registre : qui est né avec quoi (Codex §6-bis) ───────────────────
    var TRAITS = {
        sang:    { actor: 1, nom: 'le Sang',                don: 'le Masque — pour saigner sans se blesser' },
        change:  { actor: 2, nom: 'Change',                 don: "l'Armure Volante" },
        // Trait DÉBLOQUÉ PAR L'AVATAR SPIRITUEL : sans lui à l'Âme, il ne répond pas.
        hiver:   { actor: 2, nom: 'Hiver',                  don: "l'Armure Volante — son Avatar Spirituel",
                   parAvatar: true },
        ames:    { actor: 3, nom: "l'Absorption des Âmes",  don: "l'Amulette — qui, elle, boit les ombres" },
        miracle: { actor: 4, nom: 'Miracle',                don: "l'Arc et ses flèches" }
    };
    // Anciennes clés → nouveau Trait du MÊME personnage. Rien ne casse.
    var ALIAS = { rupture: 'sang', gel: 'hiver', porte: 'ames', verbe: 'miracle' };

    function log(t) {
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (w) { w.push('addText', t); w.push('wait'); }
        else if ($gameMessage && !$gameMessage.isBusy()) $gameMessage.add(t);
    }
    function traitDuSkill(item) {
        if (!item || !item.meta || !item.meta.Trait) return '';
        var k = String(item.meta.Trait).toLowerCase().trim();
        if (ALIAS[k]) k = ALIAS[k];
        return TRAITS[k] ? k : '';
    }
    function marqueCreuse(id) {
        try { return window.Marque && window.Marque.etat(id) === 'creuse'; } catch (e) { return false; }
    }
    // Le Don brisé divise par deux tout ce qu'il apporte — Trait compris.
    // (Un Don simplement rangé ne supprime pas le Trait : il retire sa sécurité.)
    function facteurDon(id) {
        try {
            if (!window.Dons) return 1;
            return window.Dons.facteurTrait ? window.Dons.facteurTrait(id) : window.Dons.facteur(id);
        } catch (e) { return 1; }
    }
    // Un Trait ouvert par l'AVATAR n'existe que tant que l'Avatar est là :
    // c'est bien ELLE qui le possède, mais c'est LUI qui le débloque (Codex §6.5).
    function traitDisponible(actorId, k) {
        if (!TRAITS[k] || !(TRAITS[k].parAvatar || TRAITS[k].parFamilier)) return true;
        try { return !window.Dons || window.Dons.traitDebloque(actorId) === k; } catch (e) { return true; }
    }

    var Traits = {
        de: function (actorId) {
            for (var k in TRAITS) if (TRAITS[k].actor === actorId) {
                return { cle: k, nom: TRAITS[k].nom, don: TRAITS[k].don };
            }
            return null;
        },
        tous: function (actorId) {
            var r = [];
            for (var k in TRAITS) if (TRAITS[k].actor === actorId) {
                r.push({ cle: k, nom: TRAITS[k].nom, don: TRAITS[k].don });
            }
            return r;
        },
        possede: function (actorId, cle) {
            var k = ALIAS[cle] || cle;
            return !!(TRAITS[k] && TRAITS[k].actor === actorId);
        },
        infos: function (cle) {
            var k = ALIAS[cle] || cle;
            return TRAITS[k] ? { actor: TRAITS[k].actor, nom: TRAITS[k].nom } : null;
        },
        miracle: function (actorId) {
            var a = $gameActors && $gameActors.actor(actorId);
            return a ? (a._miracle || 0) : 0;
        }
    };
    window.Traits = Traits;

    //=========================================================================
    // MARQUE CREUSE : une âme éteinte n'a plus de Trait à offrir
    //=========================================================================
    var _can = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
        var k = traitDuSkill(skill);
        if (k && this.isActor && this.isActor()) {
            // âme éteinte, ou Avatar absent pour un Trait qu'il débloque
            if (marqueCreuse(this.actorId())) return false;
            if (TRAITS[k].actor === this.actorId() && !traitDisponible(this.actorId(), k)) return false;
        }
        return _can.call(this, skill);
    };

    //=========================================================================
    // Le porteur légitime (seul lui obtient les bonus du Trait)
    //=========================================================================
    function proprio(action) {
        var k = traitDuSkill(action.item());
        if (!k) return '';
        var s = action.subject();
        if (!s || !s.isActor || !s.isActor() || s.actorId() !== TRAITS[k].actor) return '';
        return traitDisponible(s.actorId(), k) ? k : '';
    }

    // SANG : le sang obéit, il ne rate pas. MIRACLE prêt : la flèche trouve.
    var _hit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function (target) {
        var k = proprio(this);
        if (k === 'sang' || (k === 'miracle' && miraclePret(this.subject()))) return 1;
        return _hit.call(this, target);
    };

    //=========================================================================
    // ❄️ HIVER — la glace sans formule (et le froid n'épargne pas Korrah)
    //=========================================================================
    var _elemRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function (target) {
        var k = proprio(this);
        // HIVER : l'attaque EST de la glace, quelle que soit la formule
        if (k === 'hiver' && HIVER_ELEM > 0) return target.elementRate(HIVER_ELEM);
        // MIRACLE prêt : elle développe de quoi le toucher — par sa faiblesse
        if (k === 'miracle' && miraclePret(this.subject())) return meilleureFaiblesse(target);
        return _elemRate.call(this, target);
    };
    function meilleureFaiblesse(target) {
        var best = 1;
        try {
            var n = $dataSystem.elements.length;
            for (var i = 1; i < n; i++) best = Math.max(best, target.elementRate(i));
        } catch (e) { }
        return best;
    }

    //=========================================================================
    // ✦ MIRACLE — se développe en temps réel, à condition d'économiser le mana
    //=========================================================================
    function miraclePret(b) {
        return !!(b && b.isActor && b.isActor() && b.actorId() === TRAITS.miracle.actor
                  && (b._miracle || 0) >= 100);
    }
    var _pay = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function (skill) {
        _pay.call(this, skill);
        try {
            if (this.isActor && this.isActor() && this.actorId() === TRAITS.miracle.actor) {
                this._mirDepense = (this._mirDepense || 0) + (this.skillMpCost ? this.skillMpCost(skill) : 0);
            }
        } catch (e) { }
    };
    var _turnEnd = Game_Battler.prototype.onTurnEnd;
    Game_Battler.prototype.onTurnEnd = function () {
        _turnEnd.call(this);
        try {
            if (!this.isActor || !this.isActor() || this.actorId() !== TRAITS.miracle.actor) return;
            var av = this._miracle || 0;
            if ((this._mirDepense || 0) <= MIR_SEUIL) this._miracle = Math.min(100, av + MIR_GAIN);
            else this._miracle = Math.max(0, av - MIR_PERTE);
            this._mirDepense = 0;
            if (av < 100 && this._miracle >= 100) {
                log('\\C[6]✦ MIRACLE — ' + this.name() + ' a trouvé. La flèche existe.\\C[0]');
            }
        } catch (e) { }
    };

    //=========================================================================
    // LE PRIX + LES EFFETS DE CHAQUE TRAIT
    //=========================================================================
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        var k = traitDuSkill(this.item());
        if (!k || this._traitPaye) return;
        this._traitPaye = true;
        var s = this.subject();
        if (!s || !s.isActor || !s.isActor()) return;
        var id = s.actorId();
        var estSien = (TRAITS[k].actor === id);
        var mult = estSien ? 1 : 2;

        // ── le prix : toutes les énergies, en même temps ──
        var pm = Math.floor(s.mmp * D_PM / 100) * mult;
        if (pm > 0) s.gainMp(-Math.min(pm, s.mp));
        if (D_TP > 0) s.gainTp(-(D_TP * mult));
        try { if (window.Errance) window.Errance.add(id, estSien ? ERR : ERR_F); } catch (e) { }

        if (!estSien) {
            log('\\C[2]Marque étrangère — le Trait déchire ' + s.name() + '.\\C[0]');
            return;
        }

        var f = facteurDon(id);                    // Don brisé → tout de moitié
        var subi = (target && target.result && target.result().hpDamage) || 0;

        // 🩸 SANG — son sang lui revient
        if (k === 'sang' && subi > 0) {
            var rendu = Math.floor(subi * SANG_DRAIN / 100 * f);
            if (rendu > 0) { s.gainHp(rendu); log('\\C[18]Le sang revient à ' + s.name() + '. (+' + rendu + ')\\C[0]'); }
        }

        // ❄️ HIVER — le froid ne fait pas de distinction
        if (k === 'hiver' && subi > 0 && HIVER_REC > 0) {
            var recul = Math.max(1, Math.floor(subi * HIVER_REC / 100));
            s.gainHp(-Math.min(recul, s.hp - 1));
            log('\\C[23]Le gel prend ' + s.name() + ' aussi. (−' + recul + ')\\C[0]');
        }

        // 🔄 CHANGE — elle prend sa place, fardeau compris
        if (k === 'change' && target && target !== s && target.isActor && target.isActor()) {
            echangerLesPlaces(s, target);
        }

        // ⬛ ABSORPTION DES ÂMES — l'ombre, elle, vient de l'amulette
        if (k === 'ames') {
            var bloquee = false;
            try { bloquee = !!(window.Dons && window.Dons.ombreBloquee(id)); } catch (e) { }
            var coef = f * (bloquee ? 0.5 : 1);
            var gain = Math.floor(AMES_GAIN * coef);
            if (gain > 0 && AMES_VAR > 0 && $gameVariables) {
                $gameVariables.setValue(AMES_VAR, $gameVariables.value(AMES_VAR) + gain);
            }
            var pmRendu = Math.floor(s.mmp * 0.1 * coef);
            if (pmRendu > 0) s.gainMp(pmRendu);
            if (ENVERS > 0) s.addState(ENVERS);
            log(bloquee
                ? "\\C[8]L'amulette est encore muette — les âmes lui échappent à moitié.\\C[0]"
                : '\\C[6]' + s.name() + ' absorbe ce qui restait. (+' + gain + ' âme' + (gain > 1 ? 's' : '') + ')\\C[0]');
        }

        // ✦ MIRACLE — la flèche développée se consume en la tirant
        if (k === 'miracle' && miraclePret(s)) {
            s._miracle = 0;
            log('\\C[6]La Flèche Miracle se dissipe — il faudra la retrouver.\\C[0]');
        }

        if (!s._traitVu) {
            s._traitVu = true;
            log('\\C[18]★ TRAIT — ' + TRAITS[k].nom + '\\C[0]');
        }
    };

    // CHANGE : échanger la place dans l'ordre du groupe, et reprendre le fardeau
    function echangerLesPlaces(korrah, allie) {
        try {
            var acs = $gameParty._actors;
            var i = acs.indexOf(korrah.actorId()), j = acs.indexOf(allie.actorId());
            if (i >= 0 && j >= 0) { acs[i] = allie.actorId(); acs[j] = korrah.actorId(); }
            var repris = 0;
            allie.states().forEach(function (st) {
                if (!st || st.id === 0) return;
                if (st.restriction > 0 || st.removeByDamage || st.autoRemovalTiming > 0) {
                    allie.removeState(st.id); korrah.addState(st.id); repris++;
                }
            });
            log('\\C[23]Change — ' + korrah.name() + ' prend la place de ' + allie.name()
                + (repris ? ', et ce qui allait avec.' : '.') + '\\C[0]');
            if ($gamePlayer) $gamePlayer.refresh();
        } catch (e) { }
    }

    // le « déjà vu » du Trait retombe entre les combats
    var _obs = Game_Actor.prototype.onBattleStart;
    if (_obs) {
        Game_Actor.prototype.onBattleStart = function () {
            _obs.call(this);
            this._traitVu = false;
            this._mirDepense = 0;
        };
    }
})();
