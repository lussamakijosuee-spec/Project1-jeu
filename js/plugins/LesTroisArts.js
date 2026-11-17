//=============================================================================
// LesTroisArts.js — v1.4
// Les trois arts du Premier : chaque compétence de héros en est un, et c'est
// son art qui donne son mana. Le triangle joue à chaque coup.
//=============================================================================
/*:
 * @plugindesc v1.4 ■ Les trois arts : chaque compétence de héros est une PAROLE
 * (positif), un MOUVEMENT (négatif) ou un ÉCRIT (spirituel) — et c'est l'art qui
 * donne son mana : le triangle joue à chaque coup. Un art hors de ses affinités
 * coûte plus et rend moins.
 * @author pour JOKO
 *
 * @param === LES ARTS ===
 * @default
 *
 * @param manaParole
 * @text Mana de la Parole
 * @type number
 * @default 3
 *
 * @param manaMouvement
 * @text Mana du Mouvement
 * @type number
 * @default 4
 *
 * @param manaEcrit
 * @text Mana de l'Écrit
 * @type number
 * @default 2
 *
 * @param elementsMana
 * @text Les éléments de mana
 * @default 2, 3, 4, 5, 6, 7
 * @desc Sur une compétence de héros, ils sont remplacés par celui de son art. 5 = 4, 6 = 3, 7 = 2 (JOKO).
 *
 * @param === CE QUI N'EST AUCUN ART ===
 * @default
 *
 * @param typesSansArt
 * @text Types sans art
 * @default 21, 22, 23
 * @desc 21 les ordres à seiryu (c'est lui qui agit), 22 les Styles de Vesper, 23 les Contrats et Portes d'Aël.
 *
 * @param sansArt
 * @text Compétences sans art
 * @default 2, 6, 461, 480
 * @desc La Garde, Fuir, revelation, VUE.
 *
 * @param acteursExclus
 * @text Ceux qui n'ont pas d'art
 * @default 6
 * @desc seiryu (6).
 *
 * @param === LES RÈGLES ===
 * @default
 *
 * @param elementsJamaisEcrit
 * @text Jamais un écrit (éléments)
 * @default -1, 1
 * @desc JOKO, 2026-10-25 : l'écrit, c'est le mana spirituel. Une technique de l'attaque (-1) ou Physique (1) est un mouvement, même avec <Art: ecrit>.
 *
 * @param typesEcrit
 * @text Types de l'écrit
 * @default 8, 9
 * @desc 8 invocation, 9 âme.
 *
 * @param typesCorps
 * @text Types du mouvement
 * @default 5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 24
 * @desc BERSEK, sang, les ombres d'armes, Arts Sereins, arts.
 *
 * @param === LES AFFINITÉS ===
 * @default
 *
 * @param affinites
 * @text Les affinités des héros
 * @default 1: spirituel négatif, 2: négatif positif, 3: négatif spirituel, 4: positif
 * @desc « acteur: courants » — l'affinité naturelle d'abord, puis celle de son don (positif = Parole, négatif = mouvement, spirituel = écrit). Un héros absent n'a pas de règle.
 *
 * @param coutHorsAffinite
 * @text Coût hors affinité
 * @default 1.5
 * @desc Multiplie le coût (PM, PT ou PV) d'un art hors de ses affinités. Jamais plus que la jauge pleine.
 *
 * @param forceHorsAffinite
 * @text Force hors affinité
 * @default 0.75
 * @desc Multiplie ses dégâts et ses soins.
 *
 * @param horsRegle
 * @text Compétences hors de la règle
 * @default 1, 71, 810, 438
 * @desc L'Attaque, et les pièces des dons : Royaume Impérial, Ténèbres Impériales, Change.
 *
 * @param typesHorsRegle
 * @text Types hors de la règle
 * @default 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26
 * @desc Les types des dons (le don est la seconde affinité) et 25, les attaques à plusieurs (chacun paie le sien).
 *
 * @param annonceHorsAffinite
 * @text Annoncer hors affinité
 * @type boolean
 * @default true
 * @desc Au-dessus du héros, quand il lance un art hors de ses affinités.
 *
 * @param === À L'ÉCRAN ===
 * @default
 *
 * @param annonceTriangle
 * @text Annoncer le triangle
 * @type boolean
 * @default true
 * @desc Au-dessus de l'ennemi : ▲ quand l'art le bat, ▼ quand il lui résiste.
 *
 * @param === UN MENU PAR ART ===
 * @default
 *
 * @param typesGeneraux
 * @text Branches rangées par art
 * @default 1, 2
 * @desc En combat, ces branches (capacité, Spéciale) se rangent en Voies, Paroles, Runes. Vide = comme avant.
 *
 * @param nomVoies
 * @text Le menu des mouvements
 * @default Voies
 *
 * @param nomParoles
 * @text Le menu des Paroles
 * @default Paroles
 *
 * @param nomRunes
 * @text Le menu des runes
 * @default Runes
 *
 * @param nomUltimes
 * @text Le nom de la branche des ultimes
 * @default Ultimes
 * @desc La branche 3 (« ult » dans la base) s'affiche sous ce nom en combat.
 *
 * @param avecLesRunes
 * @text Avec les runes (sans art)
 * @default 1309
 * @desc « ᛟ Activer » ferme le cercle : il va dans le menu des Runes.
 *
 * @help
 * ============================================================================
 *  LES TROIS ARTS                                                pour JOKO
 * ============================================================================
 *  La Genèse : le Premier donne aux hommes les mathématiques du mana (la
 *  PAROLE, l'Esprit), les voies d'art des mouvements (le MOUVEMENT, le Corps)
 *  et l'écriture des âmes (l'ÉCRIT, l'Âme). « Le corps attaqua l'âme, l'âme
 *  attaqua l'esprit et l'esprit attaqua le corps. »
 *
 *  JOKO, le 2026-10-20 : « Pour les paroles, tu peux utiliser que le mana
 *  positif. Et pour les mouvements, tu peux utiliser que le mana sombre. Et
 *  pour le spirituel […] que le mana spirituel. » ; le 2026-10-22 : le
 *  spirituel, « le fait d'écrire ou préparer des écrits », comme Fullmetal
 *  Alchemist ; « Oui pour les runes ».
 *
 *  L'ART D'UNE COMPÉTENCE DE HÉROS, dans cet ordre :
 *   1. <Art: parole>, <Art: mouvement>, <Art: ecrit> ou <Art: aucun> écrit
 *      sur la fiche ;
 *   2. aucun art : les types et compétences des paramètres ;
 *   3. une rune (son nom le dit) : l'écrit ;
 *   4. les 40 Paroles des échelles (1186-1225) : la Parole ;
 *   5. « Parole n°X » : n°2 et 7 l'écrit, n°4 et 5 le mouvement, les autres
 *      la Parole (le mot de passe dit le mana) ;
 *   6. types 8 et 9, éléments 2 et 7 : l'écrit ;
 *   7. <Voie:>, éléments 4 et 5, coup physique, types du corps, frappe
 *      physique : le mouvement ;
 *   8. <Parole> sur la fiche, un sort magique, un soin : la Parole ;
 *  sinon, aucun art (le soutien sans mana).
 *  ET : l'écrit, c'est le mana spirituel (JOKO, 2026-10-25 : « ça s'applique
 *  que aux techniques du mana spirituel. Pas ceux qui coûtent les PV ») — une
 *  technique d'élément Physique (ou de l'attaque) n'est jamais un écrit : c'est
 *  un mouvement, même si sa fiche dit <Art: ecrit>.
 *
 *  LE TRIANGLE — sur une compétence de héros, les éléments de mana sont
 *  remplacés par celui de son art : un mouvement de Feu frappe en Feu ET en
 *  négatif. Le Feu reste sa couleur, la roue des éléments joue toujours. Les
 *  dégâts comme la brisure des boucliers (AstfglSCB) le lisent.
 *
 *  LES AFFINITÉS (la Bible ; JOKO, le 2026-10-24 : « L'affinité unique oui
 *  c'est tout ») — chaque personne naît avec une seule affinité, et son don en
 *  ajoute une seconde. Un art hors de ses affinités « coûte plus et rend
 *  moins » : coût ×1,5 dans sa monnaie (jamais plus que la jauge pleine),
 *  dégâts et soins ×0,75. Vesper : spirituel + négatif (son sang) ; Korrah :
 *  négatif + positif (l'Hiver de seiryu) ; ludwing : négatif + spirituel (ses
 *  âmes) ; Aël : positif seul. Hors de la règle : l'Attaque, les techniques
 *  des dons (le don EST la seconde affinité), les attaques à plusieurs ;
 *  seiryu et les ennemis ne l'ont pas. La Bible : « Chaque personne n'a qu'une
 *  seule affinité naturelle, parmi les trois courants ; le don ou le trait en
 *  ajoute une seconde ». v1.3 (2026-10-26) : la règle telle que JOKO l'a
 *  écrite, avec ses exceptions (« Ta règle + mes exceptions »).
 *
 *  À L'ÉCRAN — l'aide d'une compétence dit son art : 【PAROLE · FEU】, 【RUNE · SCEAU】, et
 *  【PAROLE · FEU · hors affinité】 quand il l'est ; le coût affiché est le
 *  vrai ; au-dessus du héros : « ◇ Hors affinité ».
 *  Au-dessus de l'ennemi : ▲ Corps ×2 quand l'art le bat, ▼ quand il résiste.
 *
 *  UN MENU PAR ART (JOKO, le 2026-10-26, le chantier des compétences : « Un
 *  menu par art ») — en combat, les branches générales (capacité, Spéciale)
 *  se rangent par art : Voies (les mouvements), Paroles, Runes ; puis les
 *  branches à lui du héros (le Sang, l'Hiver, l'Âme, le Miracle…), Ultimes,
 *  Combo. AUCUNE FICHE NE CHANGE DE TYPE : le menu se calcule d'après l'art,
 *  et ce qui lit les types (l'État de Flow scelle 1, 2, 3 ; le kit du Style de
 *  Vesper ; les Copies de ludwing) continue de les lire. Ce qui n'a pas d'art
 *  reste dans sa branche d'origine ; « ᛟ Activer » va avec les Runes. Hors
 *  combat, rien ne change. LesTroisArts._sansMenusParArt = true coupe (bancs).
 *
 *  LES ATTAQUES À PLUSIEURS (v1.4, 2026-11-02) — une compétence <Combo: 1,3>
 *  est grisée tant que tous ses héros ne sont pas au combat et debout ; son
 *  aide le dit (« ⚔ Il manque : ludwing »). Une <Combo:> sans numéros (les
 *  six duos de DoubleX) suit la règle de DoubleX. LesTroisArts.manquants(s).
 *
 *  LaParole, LeMouvement, MaitriseVoies et L'Écrit demandent tous l'art ici :
 *  une seule règle. Les ennemis ne changent pas. Aucune fiche n'est modifiée.
 *
 *  Script : LesTroisArts.art(compétence)  → 'parole' | 'mouvement' | 'ecrit' | ''
 *           LesTroisArts.mana(action)     → l'élément de mana de l'action (0 si aucun)
 *           LesTroisArts.affinites(héros) → ses arts, ex. ['ecrit', 'mouvement']
 *           LesTroisArts.horsAffinite(héros, compétence) → true / false
 *           LesTroisArts._sansAffinites = true coupe la règle (pour un banc).
 * ============================================================================
 */

var LesTroisArts = LesTroisArts || {};

(function () {
    'use strict';

    var P = PluginManager.parameters('LesTroisArts');
    var nombre = function (k, d) { var v = parseInt(P[k], 10); return isNaN(v) ? d : v; };
    var decimal = function (k, d) { var v = parseFloat(String(P[k]).replace(',', '.')); return isNaN(v) ? d : v; };
    var liste = function (k, d) {
        return String(P[k] === undefined ? d : P[k]).split(',')
            .map(function (x) { return parseInt(x, 10); }).filter(function (x) { return !isNaN(x); });
    };

    var MANA = { parole: nombre('manaParole', 3), mouvement: nombre('manaMouvement', 4), ecrit: nombre('manaEcrit', 2) };
    var MANAS       = liste('elementsMana', '2, 3, 4, 5, 6, 7');
    var TYPES_SANS  = liste('typesSansArt', '21, 22, 23');
    var SANS        = liste('sansArt', '2, 6, 461, 480');
    var EXCLUS      = liste('acteursExclus', '6');
    var TYPES_ECRIT = liste('typesEcrit', '8, 9');
    var TYPES_CORPS = liste('typesCorps', '5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 24');
    var JAMAIS_ECRIT = liste('elementsJamaisEcrit', '-1, 1');
    var ANNONCE     = String(P['annonceTriangle'] || 'true') !== 'false';
    var COUT_HORS   = decimal('coutHorsAffinite', 1.5);
    var FORCE_HORS  = decimal('forceHorsAffinite', 0.75);
    var HORS_REGLE  = liste('horsRegle', '1, 71, 810, 438');
    var TYPES_HORS  = liste('typesHorsRegle', '4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26');
    var ANNONCE_HORS = String(P['annonceHorsAffinite'] || 'true') !== 'false';

    var MOT_ECRIT = [2, 7], MOT_CORPS = [4, 5];
    var NOMS    = { parole: 'PAROLE', mouvement: 'MOUVEMENT', ecrit: 'RUNE' };
    var SOURCES = { parole: 'Esprit', mouvement: 'Corps', ecrit: 'Âme' };

    function heros(b) { return !!(b && b.isActor && b.isActor() && EXCLUS.indexOf(b.actorId()) < 0); }
    function annonce(b, texte, couleur) {
        if (window.CombatTactique && CombatTactique.annoncer) { CombatTactique.annoncer(b, texte, couleur); }
    }
    function chiffre(x) { return String(Math.round(x * 100) / 100).replace('.', ','); }

    function elements(item) {
        var e = [];
        if (item.damage && item.damage.elementId) { e.push(item.damage.elementId); }
        (item.multipleElements || []).forEach(function (x) { if (e.indexOf(x) < 0) { e.push(x); } });
        return e;
    }
    function soin(item) {
        if (item.damage && (item.damage.type === 3 || item.damage.type === 4)) { return true; }
        return (item.effects || []).some(function (e) { return e.code === 11 || e.code === 12; });
    }

    /** L'art d'une compétence : 'parole', 'mouvement', 'ecrit', ou '' (aucun). */
    function art(item) {
        var a = artDeLaFiche(item);
        // l'écrit, c'est le mana spirituel : un coup physique n'en est jamais un
        if (a === 'ecrit' && item.damage && JAMAIS_ECRIT.indexOf(item.damage.elementId) >= 0) { return 'mouvement'; }
        return a;
    }
    function artDeLaFiche(item) {
        if (!item || !DataManager.isSkill(item)) { return ''; }
        var m = item.meta || {};
        if (m.Art !== undefined) {
            var t = String(m.Art).trim().toLowerCase().replace('é', 'e');
            return MANA[t] ? t : '';
        }
        if (TYPES_SANS.indexOf(item.stypeId) >= 0 || SANS.indexOf(item.id) >= 0) { return ''; }
        if (/rune/i.test(item.name || '')) { return 'ecrit'; }
        if (item.id >= 1186 && item.id <= 1225) { return 'parole'; }
        var mot = /^Parole n°\s*(\d+)/.exec(item.name || '');
        if (mot) {
            var n = +mot[1];
            return MOT_ECRIT.indexOf(n) >= 0 ? 'ecrit' : (MOT_CORPS.indexOf(n) >= 0 ? 'mouvement' : 'parole');
        }
        var els = elements(item);
        if (TYPES_ECRIT.indexOf(item.stypeId) >= 0 || els.some(function (e) { return MOT_ECRIT.indexOf(e) >= 0; })) { return 'ecrit'; }
        var frappe = !!item.damage && item.damage.type > 0;
        if (m.Voie !== undefined || els.some(function (e) { return MOT_CORPS.indexOf(e) >= 0; }) || item.hitType === 1 ||
            TYPES_CORPS.indexOf(item.stypeId) >= 0 || (frappe && (item.damage.elementId === -1 || els.indexOf(1) >= 0))) {
            return 'mouvement';
        }
        if ((m.Parole !== undefined && !m.NoParole) || item.hitType === 2 || soin(item)) { return 'parole'; }
        return '';
    }

    /** L'élément de mana d'une action de héros (0 s'il n'en a pas). */
    function mana(action) {
        if (!action || !action.isSkill || !action.isSkill() || !heros(action.subject())) { return 0; }
        var a = art(action.item());
        return a ? MANA[a] : 0;
    }

    // Le triangle : sur une compétence de héros, le mana est celui de son art.
    var _elements = Game_Action.prototype.getItemElements;
    if (_elements) {
        Game_Action.prototype.getItemElements = function () {
            var els = _elements.call(this);
            var e = mana(this);
            if (!e) { return els; }
            els = els.filter(function (x) { return MANAS.indexOf(x) < 0; });
            els.push(e);
            return els;
        };
    }

    // ▲ / ▼ au-dessus de l'ennemi, une fois par cible et par action.
    var _apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _apply.call(this, target);
        if (ANNONCE_HORS && !this._horsVu && horsDe(this)) {
            this._horsVu = true;
            annonce(this.subject(), '◇ Hors affinité', '#b8b8c8');
        }
        if (!ANNONCE || !target || !target.isEnemy || !target.isEnemy()) { return; }
        var e = mana(this), r = target.result();
        if (!e || !r || !r.isHit() || r.hpDamage <= 0) { return; }
        this._artVu = this._artVu || [];
        if (this._artVu.indexOf(target) >= 0) { return; }
        this._artVu.push(target);
        var taux = target.elementRate(e), source = SOURCES[art(this.item())];
        if (taux > 1) { annonce(target, '▲ ' + source + ' ×' + chiffre(taux), '#8dffa8'); }
        else if (taux < 1) { annonce(target, '▼ ' + source + ' ×' + chiffre(taux), '#ffa08d'); }
    };

    //=========================================================================
    // Les affinités — une naturelle, et celle du don ; hors d'elles, un art coûte plus et rend moins
    // (la règle de JOKO, 2026-10-26, avec ses exceptions : « Ta règle + mes exceptions »)
    //=========================================================================
    var COURANTS = { negatif: 'mouvement', positif: 'parole', spirituel: 'ecrit' };
    function sansAccents(s) { return s.normalize ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : s; }
    var AFFINITES = {};
    // « 1: spirituel négatif, 2: … » ; l'ancienne écriture « 1: spirituel + négatif; 2: … » se lit aussi
    String(P['affinites'] === undefined ? '1: spirituel négatif, 2: négatif positif, 3: négatif spirituel, 4: positif' : P['affinites'])
        .split(/[,;]/).forEach(function (x) {
            var m = /^\s*(\d+)\s*:\s*(.+)$/.exec(x);
            if (!m) { return; }
            AFFINITES[+m[1]] = sansAccents(m[2].trim().toLowerCase()).split(/[\s+]+/)
                .map(function (c) { return COURANTS[c]; }).filter(Boolean);
        });

    /** Ses arts (affinité naturelle, puis celle de son don) ; [] : pas de règle pour lui. */
    function affinites(b) { return (heros(b) && AFFINITES[b.actorId()]) || []; }
    /** Une attaque à plusieurs (Combo, unisson) : chacun paie le sien. */
    function plusieurs(item) { return !!(item.meta && (item.meta.Combo !== undefined || item.meta['unison item actors'] !== undefined)); }
    function horsAffinite(b, item) {
        if (LesTroisArts._sansAffinites || !item || !DataManager.isSkill(item) || HORS_REGLE.indexOf(item.id) >= 0) { return false; }
        // hors de la règle : les techniques des dons (le don EST la seconde affinité) et les attaques à plusieurs
        if (TYPES_HORS.indexOf(item.stypeId) >= 0 || plusieurs(item)) { return false; }
        var aff = affinites(b), a = art(item);
        return aff.length > 0 && !!a && aff.indexOf(a) < 0;
    }
    function horsDe(action) { return action.isSkill() && horsAffinite(action.subject(), action.item()); }

    // le coût : dans sa propre monnaie (PT, PM ou PV), ce que les autres plugins en ont fait d'abord —
    // jamais plus que la jauge pleine, sinon l'art ne partirait plus jamais (Le Domaine Entier d'Aël : 70 PT → 105)
    var JAUGE = { skillMpCost: function (b) { return b.mmp; }, skillTpCost: function (b) { return b.maxTp(); }, skillHpCost: function (b) { return b.mhp - 1; } };
    ['skillMpCost', 'skillTpCost', 'skillHpCost'].forEach(function (f) {
        var avant = Game_BattlerBase.prototype[f];
        if (!avant) { return; }
        Game_BattlerBase.prototype[f] = function (skill) {
            var c = avant.call(this, skill);
            if (!(c > 0) || !horsAffinite(this, skill)) { return c; }
            var plus = Math.ceil(c * COUT_HORS), max = JAUGE[f](this);
            return c <= max ? Math.min(plus, max) : plus;
        };
    });
    // l'effet : les dégâts et les soins de la formule…
    var _valeurAff = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _valeurAff.call(this, target, critical);
        if (v !== 0 && horsDe(this)) { v = Math.round(v * FORCE_HORS); }
        return v;
    };
    // … et les PV et les PM que rend un effet
    ['itemEffectRecoverHp', 'itemEffectRecoverMp'].forEach(function (f) {
        var _rend = Game_Action.prototype[f];
        Game_Action.prototype[f] = function (target, effect) {
            if (!horsDe(this)) { return _rend.call(this, target, effect); }
            return _rend.call(this, target, { code: effect.code, dataId: effect.dataId, value1: effect.value1 * FORCE_HORS, value2: effect.value2 * FORCE_HORS });
        };
    });

    // L'aide d'une compétence dit son art (et sa couleur d'élément, s'il en a une), et si elle est hors affinité.
    var _aide = Window_SkillList.prototype.updateHelp;
    Window_SkillList.prototype.updateHelp = function () {
        var s = this.item(), a = s && this._actor && heros(this._actor) ? art(s) : '';
        if (!a || !this._helpWindow) { _aide.call(this); return; }
        var el = s.damage ? s.damage.elementId : 0;
        var nom = el > 0 && MANAS.indexOf(el) < 0 && $dataSystem.elements[el] ? ' · ' + $dataSystem.elements[el].trim().toUpperCase() : '';
        // une rune dit son signe (LEcrit, <Rune: …>) : 【RUNE · SCEAU】
        if (a === 'ecrit' && s.meta && typeof s.meta.Rune === 'string' && s.meta.Rune.trim()) { nom = ' · ' + String(s.meta.Rune).trim().toUpperCase(); }
        var hors = horsAffinite(this._actor, s) ? ' · hors affinité' : '';
        var texte = '【' + NOMS[a] + nom + hors + '】  ' + (s.description || '');
        // une attaque à plusieurs grisée dit qui manque (à la place de la 2e ligne de sa description)
        var qui = manquants(s);
        if (qui.length) {
            texte = texte.split('\n')[0] + '\n⚔ Il manque : ' + qui.map(function (id) { var x = $gameActors.actor(id); return x ? x.name() : '?'; }).join(', ');
        }
        this._helpWindow.setText(texte);
    };

    // Une capacité qui se charge le dit (JOKO, 2026-11-02 : « Oui, affiche-le ») : <Charge: 14, 10, 5, Confiance>
    // — la variable, son maximum, le diviseur de la formule, le mot. Yin et Yang du Mana frappe ×(Confiance ÷ 5) :
    // l'aide dit « ✦ Confiance : 3/10 → ×0,6 » à la place de la 2e ligne de la description.
    function chargeDe(s) {
        var v = s && s.meta && typeof s.meta.Charge === 'string' ? s.meta.Charge.split(',') : null;
        if (!v || v.length < 3 || !$gameVariables) { return ''; }
        var id = Number(v[0]), max = Number(v[1]), div = Number(v[2]) || 1, mot = (v[3] || 'Charge').trim();
        var n = $gameVariables.value(id) || 0, fois = String(Math.round(n / div * 10) / 10).replace('.', ',');
        return '✦ ' + mot + ' : ' + n + '/' + max + ' → ×' + fois + (n <= 0 ? ' (pas encore chargée)' : '');
    }
    LesTroisArts.charge = chargeDe;
    var _aideCharge = Window_SkillList.prototype.updateHelp;
    Window_SkillList.prototype.updateHelp = function () {
        _aideCharge.call(this);
        var ligne = this._helpWindow ? chargeDe(this.item()) : '';
        if (ligne) { this._helpWindow.setText(String(this._helpWindow._text || '').split('\n')[0] + '\n' + ligne); }
    };

    //=========================================================================
    // LES ATTAQUES À PLUSIEURS ATTENDENT LEURS HÉROS (JOKO, 2026-11-02, « Les trois »)
    //=========================================================================
    // <Combo: 1,3> dit quels héros font l'attaque. Le plugin qui la grisait sans eux (ComboLiens) n'est pas
    // dans le jeu — il lui fallait les Liens (LiensSocial), absents aussi : Vesper lançait « Fureur
    // Spectrale (Duo) » seule, avec l'attaque de ludwing même hors de l'équipe. Ici : tous les héros listés
    // au combat (hors combat : dans l'équipe) et vivants, sinon grisée. Une <Combo:> sans numéros (les six
    // duos de DoubleX : « JOKO 2026-10-18 — … ») suit la règle de DoubleX et n'est pas touchée.
    function herosDuCombo(item) {
        var v = item && item.meta ? item.meta.Combo : null;
        if (typeof v !== 'string' || !/^\s*\d+(\s*,\s*\d+)*\s*$/.test(v)) { return null; }
        return v.split(',').map(function (x) { return Number(x); });
    }
    /** Les héros d'une attaque à plusieurs qui ne sont pas là (ou plus debout). */
    function manquants(item) {
        var ids = item && DataManager.isSkill(item) ? herosDuCombo(item) : null;
        if (!ids || !$gameParty) { return []; }
        var membres = enCombat() ? $gameParty.battleMembers() : $gameParty.members();
        return ids.filter(function (id) { var x = $gameActors.actor(id); return !x || membres.indexOf(x) < 0 || !x.isAlive(); });
    }
    LesTroisArts.manquants = manquants;
    var _utilisable = Game_BattlerBase.prototype.meetsUsableItemConditions;
    Game_BattlerBase.prototype.meetsUsableItemConditions = function (item) {
        if (this.isActor() && manquants(item).length) { return false; }
        return _utilisable.call(this, item);
    };

    //=========================================================================
    // UN MENU PAR ART (JOKO, 2026-10-26, le chantier des compétences : « Un menu par art »)
    //=========================================================================
    // En combat, les branches générales (capacité, Spéciale) se rangent par art : Voies (les mouvements),
    // Paroles, Runes ; puis les branches à lui du héros, Ultimes, Combo. AUCUNE FICHE NE CHANGE DE TYPE :
    // le menu se calcule d'après l'art (l'État de Flow, qui scelle les types 1, 2, 3, scelle toujours).
    // Ce qui n'a pas d'art reste dans sa branche d'origine ; « ᛟ Activer », qui ferme le cercle, va avec les Runes.
    var GENERAUX = liste('typesGeneraux', '1, 2');
    var MENUS = [
        { art: 'mouvement', type: 901, nom: String(P['nomVoies'] || 'Voies') },
        { art: 'parole', type: 902, nom: String(P['nomParoles'] || 'Paroles') },
        { art: 'ecrit', type: 903, nom: String(P['nomRunes'] || 'Runes') }
    ];
    var TYPE_ULT = 3, NOM_ULT = String(P['nomUltimes'] || 'Ultimes'), TYPE_COMBO = 25;     // (901-903 : des branches qui n'existent que dans le menu)
    var AVEC_RUNES = liste('avecLesRunes', '1309');
    function menuDe(type) { return MENUS.filter(function (m) { return m.type === type; })[0] || null; }
    /** L'art qui range une compétence dans un menu. */
    function artDuMenu(s) { return AVEC_RUNES.indexOf(s.id) >= 0 ? 'ecrit' : art(s); }
    function enCombat() { return !!($gameParty && $gameParty.inBattle()); }

    var _inclut = Window_SkillList.prototype.includes;
    Window_SkillList.prototype.includes = function (item) {
        if (LesTroisArts._sansMenusParArt) { return _inclut.call(this, item); }
        var m = menuDe(this._stypeId);
        if (m) {
            if (!item || GENERAUX.indexOf(item.stypeId) < 0 || artDuMenu(item) !== m.art) { return false; }
            // les autres filtres (le kit du Style de Vesper, YEP…) jugent la compétence dans sa vraie branche
            var v = this._stypeId;
            this._stypeId = item.stypeId;
            var ok = _inclut.call(this, item);
            this._stypeId = v;
            return ok;
        }
        // en combat, une branche générale ne garde que ce qui n'a pas d'art (le reste est dans les menus par art)
        if (enCombat() && this._actor && heros(this._actor) && GENERAUX.indexOf(this._stypeId) >= 0 && item && artDuMenu(item)) { return false; }
        return _inclut.call(this, item);
    };

    // (les bancs Node chargent ce fichier sans les fenêtres du combat)
    var _commandes = typeof Window_ActorCommand !== 'undefined' ? Window_ActorCommand.prototype.addSkillCommands : null;
    if (_commandes) Window_ActorCommand.prototype.addSkillCommands = function () {
        var avant = this._list.length;
        _commandes.call(this);
        var a = this._actor;
        if (LesTroisArts._sansMenusParArt || !a || !heros(a)) { return; }
        var ajoutes = this._list.slice(avant);
        var vide = function (type) {
            var f = Object.create(Window_SkillList.prototype); f._actor = a; f._stypeId = type;
            return !a.skills().some(function (s) { return Window_SkillList.prototype.includes.call(f, s); });
        };
        var parArt = MENUS.filter(function (m) { return !vide(m.type); })
            .map(function (m) { return { name: m.nom, symbol: 'skill', enabled: true, ext: m.type }; });
        var generaux = [], propres = [], ultimes = [], combos = [], autres = [];
        ajoutes.forEach(function (c) {
            if (c.symbol !== 'skill') { autres.push(c); }
            else if (GENERAUX.indexOf(c.ext) >= 0) { if (!vide(c.ext)) { generaux.push(c); } }
            else if (c.ext === TYPE_ULT) { ultimes.push({ name: NOM_ULT, symbol: c.symbol, enabled: c.enabled, ext: c.ext }); }
            else if (c.ext === TYPE_COMBO) { combos.push(c); }
            else { propres.push(c); }
        });
        this._list = this._list.slice(0, avant).concat(parArt, generaux, propres, ultimes, combos, autres);
    };

    /** Le menu par art d'une compétence : { type, nom } (901-903), ou null si elle reste dans sa branche. */
    LesTroisArts.menuDe = function (s) {
        if (LesTroisArts._sansMenusParArt || !s || GENERAUX.indexOf(s.stypeId) < 0) { return null; }
        var a = artDuMenu(s), m = MENUS.filter(function (x) { return x.art === a; })[0];
        return m ? { type: m.type, nom: m.nom } : null;
    };
    LesTroisArts.typesGeneraux = GENERAUX;
    LesTroisArts.nomUltimes = function () { return LesTroisArts._sansMenusParArt ? null : NOM_ULT; };
    LesTroisArts.affinites = affinites;
    LesTroisArts.horsAffinite = horsAffinite;
    LesTroisArts.art = art;
    LesTroisArts.mana = mana;
    LesTroisArts.manaDe = function (a) { return MANA[a] || 0; };
    LesTroisArts.heros = heros;
})();
