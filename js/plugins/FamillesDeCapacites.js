//=============================================================================
// FamillesDeCapacites.js — v1.0  ·  Une famille, une ligne
// RPG Maker MV   ·   by JOKO
//   À charger APRÈS YEP_SkillCore et OrbeDesCapacites.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ En combat, les compétences qui font la même chose ne
 * tiennent qu'une ligne : la meilleure que le héros puisse lancer.
 * @author JOKO
 *
 * @param actif
 * @text Replier les familles ?
 * @type boolean
 * @on Oui — une ligne par famille
 * @off Non — tout s'affiche
 * @default true
 *
 * @param marque
 * @text Marque affichée sur une ligne repliée
 * @type string
 * @default  ×
 * @desc Collé après le nom : «  Le Point Final ×5 ». Vide = aucune marque.
 *
 * @param dansLeMenu
 * @text Replier aussi hors combat ?
 * @type boolean
 * @on Oui
 * @off Non — l'arbre montre tout
 * @default false
 * @desc L'Orbe des Capacités montre TOUJOURS tout : c'est l'arbre, il doit être complet.
 *
 * @param lignesEnCombat
 * @text Lignes visibles du menu de capacités en combat
 * @type number
 * @min 4
 * @max 13
 * @default 9
 * @desc YEP (« Lower Windows ») en montrait 4. JOKO, 2026-10-23 : « OUI A TOUT » — agrandir. 4 = comme avant.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  UNE FAMILLE, UNE LIGNE                                              by JOKO
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE PROBLÈME, MESURÉ
 *  ───────────────────
 *  Au niveau 89, un héros ouvre son menu de combat sur 73 à 95 compétences.
 *  Vesper a DOUZE attaques physiques mono-cible qui ne diffèrent que par leur
 *  multiplicateur, de ×2.9 à ×21. Douze lignes pour une seule décision.
 *  La branche « capacité » porte à elle seule 44 à 66 entrées selon le héros.
 *
 *  CE QU'ON FAIT
 *  ─────────────
 *  On ne supprime RIEN (règle 3 du projet). Les compétences restent apprises,
 *  restent dans la classe, restent dans l'arbre. On les RANGE :
 *
 *      Deux compétences sont de la même FAMILLE quand, du point de vue du
 *      joueur, choisir l'une ou l'autre revient au même —
 *      même branche · même portée · même nature (dégât/soin/drain) ·
 *      même élément · mêmes états posés · même art (le prix : PM, PT ou
 *      PV) · même verbe des trois arts. « ᛟ Activer » ne se replie jamais.
 *
 *  En combat, chaque famille ne montre qu'une ligne : LA MEILLEURE QUE LE
 *  HÉROS PEUT LANCER MAINTENANT. Pas seulement la plus forte — celle qu'il
 *  peut payer. Sans ça, un héros à court de PT verrait une ligne grisée et
 *  plus rien derrière, alors qu'il a trois versions moins chères sous la main.
 *
 *  L'ARBRE, LUI, MONTRE TOUT. L'Orbe des Capacités reste complet : c'est là
 *  qu'on regarde ce qu'on possède. Le menu de combat, c'est là qu'on joue.
 *
 *  POUR SORTIR UNE COMPÉTENCE DE SA FAMILLE
 *  ────────────────────────────────────────
 *  Sur la compétence (Note) :   <HorsFamille>
 *  Elle garde sa ligne à elle, quoi qu'il arrive. À poser sur ce qui est
 *  unique même si les chiffres se ressemblent.
 *
 *  SCRIPT :  Familles.de(acteur, skill)  → les compétences de sa famille
 *            Familles.compte(acteur)     → {avant, apres} pour un menu donné
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('FamillesDeCapacites');
    // ⚠ Les booléens de PluginManager arrivent en TEXTE : String(false) vaut
    // « false », qui est truthy. On compare la chaîne, jamais la valeur.
    var ACTIF = String(P['actif'] || 'true') === 'true';
    var MARQUE = (P['marque'] === undefined ? ' ×' : String(P['marque']));
    var HORS_COMBAT = String(P['dansLeMenu'] || 'false') === 'true';
    var LIGNES = Math.max(4, Math.min(13, Number(P['lignesEnCombat'] || 9) || 9));

    /** Les états qu'une compétence pose — deux sorts qui empoisonnent et qui
     *  brûlent ne sont pas la même chose, même à dégâts égaux. */
    function etatsPoses(s) {
        return (s.effects || [])
            .filter(function (e) { return e.code === 21 || e.code === 22; })
            .map(function (e) { return e.code + ':' + e.dataId; })
            .sort().join(',');
    }

    /** Depuis les trois arts (2026-10-22/23), deux capacités aux mêmes chiffres ne reviennent plus au même :
     *  leur ART (le prix : PM, PT ou PV), leur VERBE (ce qu'elles font de plus) et « instantanée » changent
     *  la décision. Sans ça, « ᛟ Activer » se repliait sous une autre capacité sur soi, et une capacité à
     *  verbe sous sa voisine sans verbe. */
    var VERBES = ['Ouvre', 'Finit', 'Reprise', 'Sur', 'Entre', 'Grace', 'Immobile', 'Accumule', 'EclatNoir', 'Riposte',
                  'ApresRiposte', 'Lecture', 'Lache', 'Premier', 'NeufVoies', 'ToutOuRien', 'Leurre', 'Rythme',
                  'Reste', 'Assez', 'MotJuste', 'Suspend', 'Viens', 'Pars', 'Nomme', 'Avec', 'Encourage', 'Devant',
                  'Cercle', 'Referme', 'Sceau', 'Pret', 'Symbole', 'Appat', 'Rempart', 'DejaEcrit',
                  'SeiryuSuit', 'SurEngourdi', 'ADeux', 'ConfieFroid', 'APlace', 'ReprendFroid', 'Instantané'];
    function difference(s) {
        var m = s.meta || {};
        var art = window.LesTroisArts && LesTroisArts.art ? LesTroisArts.art(s) : '';
        var v = VERBES.filter(function (k) { return m[k] !== undefined; })
            .map(function (k) { return m[k] === true ? k : k + '=' + String(m[k]).trim(); });
        return art + '/' + v.join('+');
    }

    /** La clé de famille. Tout ce qui change la DÉCISION du joueur en fait partie. */
    function cle(s) {
        if (!s) { return null; }
        if (s.meta && s.meta.HorsFamille !== undefined) { return 'seul:' + s.id; }
        if (window.LEcrit && s.id === LEcrit.ACTIVER) { return 'seul:' + s.id; }
        var d = s.damage || {};
        return [s.stypeId, s.scope, d.type || 0, d.elementId || 0, etatsPoses(s), difference(s)].join('|');
    }

    /** Ce qui sert à classer les membres d'une famille : d'abord le niveau
     *  d'apprentissage voulu par JOKO, ensuite le multiplicateur de la formule. */
    var _niveaux = null;
    function niveauAppris(classId, skillId) {
        if (!_niveaux) {
            _niveaux = {};
            $dataClasses.forEach(function (c) {
                if (!c) { return; }
                _niveaux[c.id] = {};
                (c.learnings || []).forEach(function (l) {
                    var n = _niveaux[c.id][l.skillId];
                    if (n === undefined || l.level > n) { _niveaux[c.id][l.skillId] = l.level; }
                });
            });
        }
        return (_niveaux[classId] && _niveaux[classId][skillId]) || 0;
    }

    function facteur(s) {
        var f = String((s.damage || {}).formula || '');
        var m = f.match(/\*\s*([\d.]+)/g);
        if (!m) { return 0; }
        return m.reduce(function (t, x) { return t + parseFloat(x.replace('*', '')); }, 0);
    }

    function force(acteur, s) {
        return niveauAppris(acteur.currentClass().id, s.id) * 1000 + facteur(s);
    }

    var Familles = {
        /** Toutes les compétences connues du héros qui partagent la famille de s. */
        de: function (acteur, s) {
            var k = cle(s);
            return acteur.skills().filter(function (x) { return cle(x) === k; });
        },

        /** Parmi une liste, on garde un représentant par famille. */
        replier: function (acteur, liste) {
            var parFamille = {};
            liste.forEach(function (s) {
                var k = cle(s);
                (parFamille[k] = parFamille[k] || []).push(s);
            });
            var out = [];
            Object.keys(parFamille).forEach(function (k) {
                var g = parFamille[k];
                if (g.length === 1) { out.push(g[0]); return; }
                g.sort(function (a, b) { return force(acteur, b) - force(acteur, a); });
                // la meilleure QU'IL PEUT PAYER, sinon la meilleure tout court :
                // une famille ne doit jamais se refermer sur une ligne grisée.
                var choisie = g.filter(function (s) { return acteur.canUse(s); })[0] || g[0];
                choisie._familleTaille = g.length;
                out.push(choisie);
            });
            // on rend la liste dans l'ordre d'origine : le joueur a ses repères
            return liste.filter(function (s) { return out.indexOf(s) >= 0; });
        },

        compte: function (acteur) {
            var tout = acteur.skills();
            return { avant: tout.length, apres: this.replier(acteur, tout).length };
        }
    };
    window.Familles = Familles;

    //=========================================================================
    // Le menu de compétences — celui du combat, et celui du menu si demandé
    //=========================================================================
    var _makeItemList = Window_SkillList.prototype.makeItemList;
    Window_SkillList.prototype.makeItemList = function () {
        _makeItemList.call(this);
        if (!ACTIF || !this._actor || !this._data) { return; }
        // Hors combat, on ne replie que si JOKO l'a demandé : l'arbre doit
        // rester complet, c'est là qu'on regarde ce qu'on possède.
        if (!$gameParty.inBattle() && !HORS_COMBAT) { return; }
        this._data.forEach(function (s) { if (s) { s._familleTaille = 0; } });
        this._data = Familles.replier(this._actor, this._data);
    };

    // Le menu de capacités en combat : YEP le posait sur la fenêtre de statut, 4 lignes ; avec les verbes, un
    // héros y a jusqu'à 90 lignes. Il monte maintenant à `lignesEnCombat` (9), sans passer sous l'aide en haut.
    var _fenetreCapacites = Scene_Battle.prototype.createSkillWindow;
    Scene_Battle.prototype.createSkillWindow = function () {
        _fenetreCapacites.call(this);
        var w = this._skillWindow, aide = this._helpWindow;
        if (!w) { return; }
        var haut = aide ? aide.y + aide.height : 0;
        var h = Math.min(w.fittingHeight(LIGNES), Graphics.boxHeight - haut);
        if (h <= w.height) { return; }
        w.height = h;
        w.y = Graphics.boxHeight - h;
        w.createContents();
    };
    // Plus haute, elle passe sous les lignes posées au-dessus du statut (le Pacte, la Colère, le livre, la phrase,
    // seiryu) : elles s'écriraient sur la liste. Elles s'effacent tant qu'elle les couvre.
    var LIGNES_DU_BAS = ['_fenetrePacte', '_fenetreColere', '_fenetreLecture', '_fenetrePhrase', '_fenetreSeiryu'];
    var _majCombat = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        _majCombat.call(this);
        var sk = this._skillWindow, it = this._itemWindow, self = this;
        var haut = Infinity;
        [sk, it].forEach(function (f) { if (f && f.visible && f.openness > 0) { haut = Math.min(haut, f.y); } });
        LIGNES_DU_BAS.forEach(function (k) {
            var l = self[k];
            if (l) { l.visible = l.y + l.padding + 36 <= haut; }   // le bas de sa ligne de texte
        });
    };

    // La marque « ×5 » : on dit au joueur qu'il y a une famille derrière.
    var _drawItem = Window_SkillList.prototype.drawItem;
    Window_SkillList.prototype.drawItem = function (index) {
        _drawItem.call(this, index);
        if (!ACTIF || !MARQUE) { return; }
        var s = this._data && this._data[index];
        if (!s || !s._familleTaille || s._familleTaille < 2) { return; }
        var r = this.itemRect(index);
        // à gauche du coût, pour ne pas lui passer dessus — YEP_SkillCore le dessine en « 46MP » + son icône,
        // plus large que costWidth() : « 46MP×2 » se chevauchait. On réserve la place d'un coût à 4 chiffres.
        var place = Math.max(this.costWidth(), this.textWidth('0000MP')) + Window_Base._iconWidth + 10;
        var ancienne = this.contents.fontSize;
        this.contents.fontSize = 16;
        this.changeTextColor(this.textColor(8));
        this.drawText(MARQUE + s._familleTaille, r.x, r.y, r.width - place, 'right');
        this.contents.fontSize = ancienne;
        this.resetTextColor();
    };

    //=========================================================================
    // L'ARBRE dit ce qu'il fait — l'Orbe montre tout, et nomme la famille
    //=========================================================================
    // On n'y touche pas la liste : on ajoute seulement une ligne d'explication
    // sous le nœud, pour que le joueur comprenne pourquoi le combat en montre
    // moins que l'arbre.
    if (window.Window_Noeud_Info) {
        var _maj = Window_Noeud_Info.prototype.montrer;
        if (_maj) {
            Window_Noeud_Info.prototype.montrer = function (noeud) {
                _maj.call(this, noeud);
                try {
                    if (!ACTIF || !noeud || !noeud.skill || !this._acteur) { return; }
                    var g = Familles.de(this._acteur, noeud.skill);
                    if (g.length < 2) { return; }
                    var meilleure = g.slice().sort(function (a, b) {
                        return force(this._acteur, b) - force(this._acteur, a);
                    }.bind(this))[0];
                    var y = this.contentsHeight() - this.lineHeight();
                    this.contents.fontSize = 16;
                    this.changeTextColor(this.textColor(8));
                    this.drawText('famille de ' + g.length + ' — en combat, « ' +
                        meilleure.name.trim() + ' » les représente', 0, y, this.contentsWidth());
                    this.resetTextColor();
                } catch (e) { }
            };
        }
    }
})();
