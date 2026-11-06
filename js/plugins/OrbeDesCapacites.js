//=============================================================================
// OrbeDesCapacites.js — v1.0
// L'Orbe des Capacités — l'écran des compétences, en arbre
// RPG Maker MV
//=============================================================================

/*:
 * @plugindesc v1.0 ■ Remplace l'écran des compétences par un ORBE : le héros
 * au centre, ses voies en branches, ses compétences en nœuds.
 *
 * @param Rayon de l'orbe
 * @type number
 * @min 40
 * @max 120
 * @desc Rayon du disque central, en pixels.
 * @default 74
 *
 * @param Rayon des branches
 * @type number
 * @min 90
 * @max 200
 * @desc Distance du centre à laquelle les branches se posent.
 * @default 148
 *
 * @param Titre
 * @desc Ce qui s'écrit en haut de l'écran.
 * @default L'ORBE DES CAPACITÉS
 *
 * @param Branches visibles
 * @desc Les types de compétence que l'Orbe montre, séparés par des virgules.
 * Laisser VIDE pour tous les montrer. Ne retire aucune compétence du jeu.
 * @default 1,2,3
 *
 * @param Ses propres branches
 * @type boolean
 * @desc En plus des « Branches visibles », montrer chaque type de compétence
 * que CE héros a d'ouvert en combat : Hiver et Avatar pour Korrah, Sang pour
 * Vesper, Âme pour ludwing, Miracle pour Aël.
 * @default true
 *
 * @param Branche propre
 * @type note
 * @desc La branche à lui de chaque héros. Une ligne par héros :
 * idActeur | Nom de la branche | règle | règle…   (voir l'aide)
 * @default "1 | le Sang | types:10 | noms:sang,saign,hémorr,écarlate | hors:sang-froid\n2 | l'Hiver | elements:13,22\n3 | l'Âme et l'Ombre | types:9,11,12,13,14,15,16,17,18\n4 | le Miracle | noms:parole n°3 | pm:45"
 *
 * @help
 * ============================================================================
 *  Ce que c'est
 * ============================================================================
 *
 * L'écran des compétences de Yanfly listait des lignes. Celui-ci montre la
 * FORME d'un héros : son orbe au centre, une branche par type de compétence
 * autour, et les compétences de la branche choisie en nœuds, du plus tôt
 * appris au plus tard.
 *
 * Il REMPLACE Scene_Skill : tout ce qui envoyait vers l'ancien écran arrive
 * ici, le menu comme les appels de script. Rien n'est retiré du projet —
 * YEP_SkillCore continue de faire son travail sur les coûts, les cooldowns et
 * les évaluations ; c'est seulement l'affichage qui change.
 *
 * ============================================================================
 *  Comment on s'en sert
 * ============================================================================
 *
 *   ← →            changer de branche
 *   ↑ ↓            monter et descendre dans les nœuds
 *   Entrée         employer la compétence (hors combat, si elle le permet)
 *   Q / W          passer d'un héros à l'autre
 *   Échap          sortir
 *
 * ============================================================================
 *  Quelles branches l'Orbe montre
 * ============================================================================
 *
 * Le réglage « Branches visibles » décide des types affichés. Il vaut
 * « 1,2,3 » : capacité, Spéciale, ult — et rien d'autre. Le vider fait
 * revenir toutes les branches.
 *
 * ⚠ CE RÉGLAGE NE RETIRE RIEN DU JEU. Les compétences écartées de l'écran
 * restent apprises, leurs apprentissages restent dans les classes, leurs
 * traits restent posés. Une branche masquée ici continue de s'employer EN
 * COMBAT si son type y est ouvert : c'est la fenêtre de commandes du combat
 * qui décide de ça, pas l'Orbe. Au 2026-09-20, le combat montre encore
 * « sang » à Vesper et « ame » à ludwing.
 *
 * ============================================================================
 *  Ce que montre un nœud
 * ============================================================================
 *
 * Un nœud plein = compétence apprise. Un nœud creux = elle viendra, et le
 * niveau où elle s'apprend est écrit à côté. Un nœud grisé = apprise, mais
 * impossible à employer maintenant (PM ou PT insuffisants, ou elle ne sert
 * qu'au combat).
 *
 * Les nœuds sont rangés par niveau d'apprentissage : le plus proche du centre
 * est le plus ancien. C'est la lecture des données de JOKO, pas une nouvelle
 * progression — rien n'est modifié dans les classes.
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('OrbeDesCapacites');
    var R_ORBE = Number(P['Rayon de l\'orbe'] || 74);
    var R_BRANCHE = Number(P['Rayon des branches'] || 148);

    // Les types que l'Orbe accepte de montrer. Réglage de JOKO : « je veux
    // juste ulti, spécial, capacité. C'est tout. »
    //
    // ⚠ CECI NE RETIRE RIEN. Les compétences restent apprises, les
    // apprentissages restent dans les classes, les traits restent posés : une
    // branche écartée ici continue de s'employer en combat si son type est
    // ouvert. C'est un filtre d'AFFICHAGE, et il se défait en vidant le
    // réglage « Branches visibles ».
    var BRANCHES_VUES = (function () {
        var brut = P['Branches visibles'];
        if (brut === undefined) { brut = '1,2,3'; }           // défaut du plugin
        var l = String(brut).split(',').map(function (x) { return parseInt(x, 10); })
                 .filter(function (x) { return x > 0; });
        return l.length ? l : null;                            // null = toutes
    })();

    // JOKO, 2026-09-25 : « les orbes des compétences ne sont pas en raccord
    // avec les personnages comme compétences ils ont. […] Korrah a hiver et
    // avatar. » L'Orbe montrait capacité / Spéciale / ult, plus une branche
    // « propre » devinée sur les NOMS — qui donnait 39 compétences « Miracle »
    // à Aël, qui n'en a qu'une, et zéro Avatar à Korrah, qui en a quinze.
    // Désormais l'Orbe montre aussi chaque type qu'ouvre CE héros en combat :
    // la même chose que son menu de combat, ni plus ni moins.
    var SES_BRANCHES = String(P['Ses propres branches'] === undefined ? 'true' : P['Ses propres branches']) === 'true';

    //=========================================================================
    // La branche propre — « ils ont tous leur truc à eux »
    //=========================================================================
    // Une quatrième branche par héros, qui rassemble ce qui n'appartient qu'à
    // lui : le Sang de Vesper, l'Hiver de Korrah, l'Âme et l'Ombre de ludwing.
    //
    // ⚠ ELLE NE DÉPLACE AUCUNE DONNÉE. Les compétences gardent leur stypeId,
    // leur élément et leur place dans la classe. C'est un REGROUPEMENT
    // D'AFFICHAGE : l'Orbe va les chercher là où elles sont et les montre
    // ensemble. Vider le réglage rend chacune à sa branche d'origine.
    //
    // Une ligne par héros :
    //     idActeur | Nom de la branche | règle | règle…
    // Règles, cumulables (un OU entre elles) :
    //     types:9,11,12      les compétences de ces types de compétence
    //     elements:13,22     les compétences de ces éléments de dégâts
    //     noms:sang,givre    celles dont le nom ou la description contient ça
    //     ids:414,449        celles-là nommément
    //     pm:45              celles qui coûtent au moins tant de PM
    //     hors:sang-froid    ce qui annule TOUTES les règles — le filet à
    //                        faux positifs, examiné en premier
    //
    // ⚠ « hors: » n'est pas un ornement. « noms:sang » attrapait « Garde
    // Sereine », dont la description dit « force et SANG-FROID dans le même
    // geste ». Le motif était là, le symptôme non. Un contrôle doit innocenter
    // les faux autant qu'attraper les vrais.
    var BRANCHE_PROPRE = (function () {
        var brut = P['Branche propre'];
        if (brut === undefined) { return {}; }
        try { brut = JSON.parse(brut); } catch (e) { /* déjà du texte nu */ }
        var out = {};
        String(brut).split(/\r?\n/).forEach(function (ligne) {
            var m = ligne.split('|').map(function (x) { return x.trim(); }).filter(function (x) { return x !== ''; });
            if (m.length < 3) { return; }
            var id = parseInt(m[0], 10);
            if (!(id > 0)) { return; }
            var regle = { nom: m[1], types: [], elements: [], noms: [], ids: [], hors: [], pm: 0 };
            m.slice(2).forEach(function (r) {
                var c = /^(types|elements|noms|ids|hors|pm)\s*:\s*(.*)$/i.exec(r);
                if (!c) { return; }
                var quoi = c[1].toLowerCase();
                var vals = c[2].split(',').map(function (x) { return x.trim(); }).filter(Boolean);
                if (quoi === 'pm') { regle.pm = Number(vals[0]) || 0; }
                else if (quoi === 'noms' || quoi === 'hors') {
                    regle[quoi] = regle[quoi].concat(vals.map(function (x) { return x.toLowerCase(); }));
                } else {
                    regle[quoi] = regle[quoi].concat(vals.map(Number).filter(function (x) { return x > 0; }));
                }
            });
            out[id] = regle;
        });
        return out;
    })();

    /** Cette compétence appartient-elle à la branche propre de ce héros ? */
    function estPropre(regle, s) {
        if (!regle || !s) { return false; }
        // Le filet d'abord : ce que « hors: » nomme ne rentre jamais.
        if (regle.hors.length) {
            var t0 = ((s.name || '') + ' ' + (s.description || '')).toLowerCase();
            for (var k = 0; k < regle.hors.length; k++) {
                if (t0.indexOf(regle.hors[k]) >= 0) { return false; }
            }
        }
        if (regle.ids.indexOf(s.id) >= 0) { return true; }
        if (regle.pm > 0 && (s.mpCost || 0) >= regle.pm) { return true; }
        if (regle.types.indexOf(s.stypeId) >= 0) { return true; }
        var el = s.damage && s.damage.elementId;
        if (el > 0 && regle.elements.indexOf(el) >= 0) { return true; }
        if (regle.noms.length) {
            var texte = ((s.name || '') + ' ' + (s.description || '')).toLowerCase();
            for (var i = 0; i < regle.noms.length; i++) {
                if (texte.indexOf(regle.noms[i]) >= 0) { return true; }
            }
        }
        return false;
    }
    var TITRE = String(P['Titre'] || 'L\'ORBE DES CAPACITÉS');

    // Le cadre : l'orbe occupe la moitié gauche, la liste des nœuds la droite.
    var H_TITRE = 72;
    var H_INFO = 168;
    var L_LISTE = 384;

    //=========================================================================
    // Une couleur stable par branche — même type, même teinte, toujours.
    //=========================================================================
    function teinte(stypeId) {
        var h = (stypeId * 47) % 360;
        return hsl(h, 70, 60);
    }
    function hsl(h, s, l) {
        s /= 100; l /= 100;
        var c = (1 - Math.abs(2 * l - 1)) * s;
        var x = c * (1 - Math.abs((h / 60) % 2 - 1));
        var m = l - c / 2, r = 0, g = 0, b = 0;
        if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; }
        else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; }
        else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
        return 'rgb(' + Math.round((r + m) * 255) + ',' + Math.round((g + m) * 255) + ',' + Math.round((b + m) * 255) + ')';
    }

    //=========================================================================
    // Ce que le héros sait, rangé en branches
    //=========================================================================
    // On réunit DEUX sources : les apprentissages de la classe (ils portent le
    // niveau, donc la place du nœud sur la branche) et les compétences que le
    // héros connaît vraiment (un trait, un équipement ou un événement peut lui
    // en avoir donné d'autres). Aucune donnée n'est réécrite : on lit.
    function branchesDe(acteur) {
        if (!acteur) { return []; }
        var vus = {}, parType = {};
        var classe = acteur.currentClass();
        (classe.learnings || []).forEach(function (l) {
            var s = $dataSkills[l.skillId];
            if (!s || !s.name) { return; }
            if (vus[s.id]) { return; }
            vus[s.id] = true;
            (parType[s.stypeId] = parType[s.stypeId] || []).push({ skill: s, niveau: l.level });
        });
        acteur.skills().forEach(function (s) {
            if (!s || !s.name || vus[s.id]) { return; }
            vus[s.id] = true;
            (parType[s.stypeId] = parType[s.stypeId] || []).push({ skill: s, niveau: 0 });
        });
        var types = acteur.addedSkillTypes().slice();
        var out = [];

        // ── Un menu par art (LesTroisArts, JOKO 2026-10-26) : capacité et Spéciale se rangent en
        //    Voies, Paroles, Runes, comme en combat. Aucune compétence ne change de type.
        var parArt = {};
        if (window.LesTroisArts && LesTroisArts.menuDe) {
            Object.keys(parType).map(Number).forEach(function (t) {
                parType[t] = parType[t].filter(function (n) {
                    var m = LesTroisArts.menuDe(n.skill);
                    if (!m) { return true; }
                    (parType[m.type] = parType[m.type] || []).push(n);
                    parArt[m.type] = m.nom;
                    return false;
                });
                if (!parType[t].length) { delete parType[t]; }
            });
        }
        var generalOuvert = !!(window.LesTroisArts && LesTroisArts.typesGeneraux &&
            LesTroisArts.typesGeneraux.some(function (g) { return types.indexOf(g) >= 0; }));
        var nomUlt = window.LesTroisArts && LesTroisArts.nomUltimes ? LesTroisArts.nomUltimes() : null;

        // ── La branche propre : on retire ses compétences de leur branche de
        //    type, pour qu'aucune n'apparaisse deux fois, et on les réunit.
        var regle = BRANCHE_PROPRE[acteur.actorId()];
        var propres = [], typesPropres = {};
        if (regle) {
            Object.keys(parType).map(Number).forEach(function (t) {
                parType[t] = parType[t].filter(function (n) {
                    if (!estPropre(regle, n.skill)) { return true; }
                    propres.push(n);
                    typesPropres[t] = true;
                    return false;
                });
                if (!parType[t].length) { delete parType[t]; }
            });
        }

        Object.keys(parType).map(Number).forEach(function (t) {
            if (!parArt[t] && BRANCHES_VUES && BRANCHES_VUES.indexOf(t) < 0
                && !(SES_BRANCHES && types.indexOf(t) >= 0)) { return; }
            var noeuds = parType[t].sort(function (a, b) {
                return (a.niveau - b.niveau) || (a.skill.id - b.skill.id);
            });
            out.push({
                stypeId: t,
                nom: parArt[t] || (t === 3 && nomUlt) || $dataSystem.skillTypes[t] || ('Type ' + t),
                ouverte: parArt[t] ? generalOuvert : types.indexOf(t) >= 0,   // un type qu'aucun trait n'ouvre reste invisible en combat
                couleur: teinte(t),
                noeuds: noeuds
            });
        });
        // les branches ouvertes d'abord, puis les plus fournies
        out.sort(function (a, b) {
            if (a.ouverte !== b.ouverte) { return a.ouverte ? -1 : 1; }
            return b.noeuds.length - a.noeuds.length;
        });

        // La branche propre vient en dernier : c'est la sienne, on la trouve
        // toujours au même endroit. Elle est jouable dès qu'UN des types
        // qu'elle rassemble est ouvert en combat pour ce héros.
        if (propres.length) {
            out.push({
                stypeId: -acteur.actorId(),                 // jamais un vrai type
                propre: true,
                nom: regle.nom,
                ouverte: Object.keys(typesPropres).map(Number).some(function (t) { return types.indexOf(t) >= 0; }),
                couleur: teinte(acteur.actorId() * 7 + 3),
                noeuds: propres.sort(function (a, b) {
                    return (a.niveau - b.niveau) || (a.skill.id - b.skill.id);
                })
            });
        }
        return out;
    }

    /** Un niveau retenu par GALV_ManualLevel attend-il ce héros ? */
    function niveauEnAttente(acteur) {
        return !!(acteur && typeof acteur.readyForNextLevel === 'function' && acteur.readyForNextLevel());
    }

    //=========================================================================
    // Le dessin de l'orbe
    //=========================================================================
    function Sprite_Orbe() { this.initialize.apply(this, arguments); }
    Sprite_Orbe.prototype = Object.create(Sprite.prototype);
    Sprite_Orbe.prototype.constructor = Sprite_Orbe;

    Sprite_Orbe.prototype.initialize = function (x, y, largeur, hauteur) {
        Sprite.prototype.initialize.call(this, new Bitmap(largeur, hauteur));
        this.x = x; this.y = y;
        this._cx = Math.floor(largeur / 2);
        this._cy = Math.floor(hauteur / 2);
        this._acteur = null;
        this._branches = [];
        this._iBranche = 0;
        this._iNoeud = 0;
        this._pouls = 0;
    };

    Sprite_Orbe.prototype.poser = function (acteur, branches, iBranche, iNoeud) {
        var change = this._acteur !== acteur || this._iBranche !== iBranche || this._iNoeud !== iNoeud
            || this._branches.length !== branches.length;
        this._acteur = acteur;
        this._branches = branches;
        this._iBranche = iBranche;
        this._iNoeud = iNoeud;
        if (change) { this.redessiner(); }
    };

    Sprite_Orbe.prototype.update = function () {
        Sprite.prototype.update.call(this);
        this._pouls = (this._pouls + 1) % 120;
        if (this._pouls % 12 === 0) { this.redessiner(); }   // le halo respire
    };

    /** Une ligne, en pointillés de lumière : MV ne sait pas tracer de trait. */
    Sprite_Orbe.prototype.trait = function (x1, y1, x2, y2, couleur, pas, taille) {
        var d = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        var n = Math.max(1, Math.floor(d / (pas || 7)));
        for (var i = 1; i < n; i++) {
            var t = i / n;
            this.bitmap.drawCircle(Math.round(x1 + (x2 - x1) * t), Math.round(y1 + (y2 - y1) * t),
                taille || 2, couleur);
        }
    };

    Sprite_Orbe.prototype.redessiner = function () {
        var b = this.bitmap;
        b.clear();
        if (!this._acteur) { return; }
        var cx = this._cx, cy = this._cy;
        var souffle = 1 + Math.sin(this._pouls / 120 * Math.PI * 2) * 0.04;

        // ── le halo, puis le disque central
        b.paintOpacity = 40;
        b.drawCircle(cx, cy, Math.round(R_ORBE * 1.45 * souffle), '#7fd8ff');
        b.paintOpacity = 90;
        b.drawCircle(cx, cy, Math.round(R_ORBE * 1.15), '#2b3d55');
        b.paintOpacity = 255;
        b.drawCircle(cx, cy, R_ORBE, '#10161f');

        // ── le visage du héros dans l'orbe
        var face = ImageManager.loadFace(this._acteur.faceName());
        if (face.width > 0) {
            var t = Window_Base._faceWidth;
            var sx = this._acteur.faceIndex() % 4 * t;
            var sy = Math.floor(this._acteur.faceIndex() / 4) * Window_Base._faceHeight;
            var d = R_ORBE * 2 - 12;
            b.blt(face, sx, sy, t, Window_Base._faceHeight, cx - d / 2, cy - d / 2, d, d);
        }
        b.paintOpacity = 120;
        b.drawCircle(cx, cy, R_ORBE, '#000000');
        b.paintOpacity = 255;

        // ── les branches autour ────────────────────────────────────────────
        // Trois défauts corrigés le 2026-09-20, vus sur les captures de JOKO :
        //
        //  ① les étiquettes étaient posées à « bx − 70 » sur 140 de large. Une
        //     branche à gauche du cercle sortait donc du bitmap et se faisait
        //     couper : « mbre de griffe », « ANA semi-parfait ». On les place
        //     maintenant RADIALEMENT, alignées vers l'extérieur, et on les
        //     ramène de force dans le cadre.
        //  ② à treize branches, le tour du cercle ne fait pas 1 500 pixels : les
        //     noms du bas se marchaient dessus. On ne NOMME plus que ce qui
        //     sert — les branches ouvertes, plus celle qu'on a sous le curseur.
        //     Les autres gardent leur point sur le cercle.
        //  ③ une branche verrouillée pesait autant qu'une branche jouable. Elle
        //     est maintenant plus petite, plus sombre, et son nom est rappelé en
        //     bas de l'orbe : l'arbre garde tout, sans encombrer ce qu'on joue.
        var n = this._branches.length;
        if (n === 0) { return; }
        var L = b.width, H = b.height;
        var verrouillees = [];

        // Les branches OUVERTES se répartissent sur tout le tour, pour que leurs
        // noms soient loin les uns des autres. Les verrouillées se glissent
        // entre elles, décalées d'un demi-pas : elles n'ont pas de nom à porter,
        // elles peuvent se serrer. Répartir les quatorze d'un coup tassait les
        // trois branches jouables de ludwing dans le coin haut.
        var nOuv = 0, nFer = 0;
        this._branches.forEach(function (x) { if (x.ouverte) { nOuv++; } else { nFer++; } });
        var kOuv = 0, kFer = 0;
        // On garde la trace de chaque étiquette POSÉE : c'est ce qu'un banc peut
        // mesurer. Vérifier le code ne dirait pas si deux noms se chevauchent ;
        // vérifier les rectangles dessinés, si.
        this._etiquettes = [];

        // PREMIER PASSAGE : les traits et les points. On note au passage ce
        // qu'il faudra nommer — on ne pose aucun nom tout de suite, parce qu'une
        // étiquette ne peut choisir sa place qu'en sachant où sont les autres.
        var aNommer = [];
        for (var i = 0; i < n; i++) {
            var br = this._branches[i];
            var a;
            if (br.ouverte) {
                a = (kOuv++ / Math.max(1, nOuv)) * Math.PI * 2 - Math.PI / 2;
            } else {
                a = (kFer++ / Math.max(1, nFer)) * Math.PI * 2 - Math.PI / 2
                    + Math.PI / Math.max(1, nFer);
            }
            var dx = Math.cos(a), dy = Math.sin(a);
            var bx = cx + dx * R_BRANCHE;
            var by = cy + dy * R_BRANCHE;
            var choisie = (i === this._iBranche);
            if (!br.ouverte) { verrouillees.push({ nom: br.nom, choisie: choisie }); }

            b.paintOpacity = choisie ? 255 : (br.ouverte ? 110 : 60);
            this.trait(cx + dx * (R_ORBE + 6), cy + dy * (R_ORBE + 6), bx, by,
                br.couleur, choisie ? 6 : (br.ouverte ? 9 : 13), choisie ? 3 : 2);
            b.drawCircle(Math.round(bx), Math.round(by),
                choisie ? 13 : (br.ouverte ? 8 : 5),
                br.ouverte ? br.couleur : '#4a5364');
            if (choisie) {
                b.paintOpacity = 255;
                b.drawCircle(Math.round(bx), Math.round(by), 6, '#ffffff');
            }
            b.paintOpacity = 255;

            // on ne nomme que ce qui sert : les branches jouables, plus celle
            // qu'on a sous le curseur. Nommer les quatorze, c'est la bouillie
            // qu'on voyait en bas des captures.
            if (br.ouverte || choisie) {
                aNommer.push({ br: br, bx: bx, by: by, dx: dx, dy: dy, choisie: choisie });
            }
        }

        // SECOND PASSAGE : les noms, en évitant de se marcher dessus.
        // Les branches jouables d'abord — elles forment le squelette et leur
        // place ne doit pas sauter d'une image à l'autre. La verrouillée qu'on
        // a sous le curseur passe en dernier : c'est elle qui se pousse.
        aNommer.sort(function (x, y) { return (x.br.ouverte ? 0 : 1) - (y.br.ouverte ? 0 : 1); });
        var HAUT = 24, LARG = 150;
        var pied = nFer ? 26 : 2;
        var posees = [];

        function croise(r, s) {
            return r.x < s.x + s.l && s.x < r.x + r.l && r.y < s.y + s.h && s.y < r.y + r.h;
        }

        aNommer.forEach(function (e) {
            b.fontSize = e.choisie ? 20 : 16;
            var mot = Math.min(LARG, b.measureTextWidth(e.br.nom) + 8);

            // les places possibles, de la plus naturelle à la plus repliée :
            // à côté du point vers l'extérieur, puis plus loin, puis dessus,
            // puis dessous.
            var essais = [];
            [22, 46, 70].forEach(function (d) {
                var px = e.bx + e.dx * d, py = e.by + e.dy * d;
                var al = e.dx > 0.35 ? 'left' : (e.dx < -0.35 ? 'right' : 'center');
                var x = al === 'left' ? px : (al === 'right' ? px - mot : px - mot / 2);
                essais.push({ x: x, y: py - HAUT / 2, align: al });
            });
            essais.push({ x: e.bx - mot / 2, y: e.by - 20 - HAUT, align: 'center' });
            essais.push({ x: e.bx - mot / 2, y: e.by + 20, align: 'center' });
            essais.push({ x: e.bx - mot / 2, y: e.by - 44 - HAUT, align: 'center' });

            var choix = null;
            for (var k = 0; k < essais.length; k++) {
                var r = { x: Math.round(essais[k].x), y: Math.round(essais[k].y), l: Math.round(mot), h: HAUT };
                if (r.x < 2 || r.x + r.l > L - 2 || r.y < 2 || r.y + r.h > H - pied) { continue; }
                // ni sur le visage du héros…
                var qx = Math.max(r.x, Math.min(cx, r.x + r.l));
                var qy = Math.max(r.y, Math.min(cy, r.y + r.h));
                if (Math.sqrt((qx - cx) * (qx - cx) + (qy - cy) * (qy - cy)) < R_ORBE) { continue; }
                // …ni sur son propre point…
                if (e.bx >= r.x && e.bx <= r.x + r.l && e.by >= r.y && e.by <= r.y + r.h) { continue; }
                // …ni sur un nom déjà posé.
                if (posees.some(function (p) { return croise(r, p); })) { continue; }
                choix = { r: r, align: essais[k].align };
                break;
            }
            // aucune place libre : on prend la dernière, au-dessus du point, et
            // on la ramène dans le cadre. Mieux vaut serré que hors de l'écran.
            if (!choix) {
                var secours = { x: Math.round(Math.max(2, Math.min(L - mot - 2, e.bx - mot / 2))),
                                y: Math.round(Math.max(2, Math.min(H - HAUT - pied, e.by - 20 - HAUT))),
                                l: Math.round(mot), h: HAUT };
                choix = { r: secours, align: 'center' };
            }

            b.paintOpacity = e.choisie ? 255 : 170;
            b.textColor = e.choisie ? '#ffffff' : (e.br.ouverte ? '#b9c4d2' : '#8a93a3');
            b.drawText(e.br.nom, choix.r.x, choix.r.y, choix.r.l, HAUT, choix.align);
            b.paintOpacity = 255;

            posees.push(choix.r);
            this._etiquettes.push({
                nom: e.br.nom, ouverte: e.br.ouverte, choisie: e.choisie,
                x: choix.r.x, y: choix.r.y, l: choix.r.l, h: HAUT,
                px: Math.round(e.bx), py: Math.round(e.by)
            });
        }, this);

        // ── le rappel des branches verrouillées, au pied de l'orbe
        // ⚠ Surtout pas la liste entière : drawText RESSERRE le texte pour le
        // faire tenir dans la largeur donnée, et onze noms dans quatre cents
        // pixels donnent une bouillie illisible. On dit le nombre, et on nomme
        // celle qu'on a sous le curseur — les autres se lisent en y allant.
        if (verrouillees.length) {
            var sous = verrouillees.filter(function (v) { return v.choisie; })[0];
            var texte = sous
                ? '🔒 ' + sous.nom + ' — verrouillée  (' + verrouillees.length + ' en tout)'
                : '🔒 ' + verrouillees.length + ' branche' + (verrouillees.length > 1 ? 's' : '') +
                  ' verrouillée' + (verrouillees.length > 1 ? 's' : '') + ' — apprises, pas encore ouvertes';
            b.fontSize = 15;
            b.paintOpacity = 220;
            b.textColor = sous ? '#c9a84c' : '#7f8899';
            b.drawText(texte, 6, H - 22, L - 12, 20, 'center');
            b.paintOpacity = 255;
        }

        // ── les nœuds de la branche choisie, en éventail vers l'extérieur
        var br2 = this._branches[this._iBranche];
        if (!br2) { return; }
        var a2 = (this._iBranche / n) * Math.PI * 2 - Math.PI / 2;
        var total = br2.noeuds.length;
        var montres = Math.min(total, 14);
        var debut = Math.max(0, Math.min(this._iNoeud - Math.floor(montres / 2), total - montres));
        for (var k = 0; k < montres; k++) {
            var idx = debut + k;
            var noeud = br2.noeuds[idx];
            var appris = this._acteur.isLearnedSkill(noeud.skill.id);
            var etale = (k - (montres - 1) / 2) * 0.10;
            var rr = R_BRANCHE + 34 + k * 9;
            var nx = cx + Math.cos(a2 + etale) * rr;
            var ny = cy + Math.sin(a2 + etale) * rr;
            var actif = (idx === this._iNoeud);
            b.paintOpacity = actif ? 255 : (appris ? 170 : 80);
            b.drawCircle(Math.round(nx), Math.round(ny), actif ? 8 : 5,
                appris ? br2.couleur : '#46505e');
            if (actif) { b.drawCircle(Math.round(nx), Math.round(ny), 3, '#ffffff'); }
            b.paintOpacity = 255;
        }
    };

    //=========================================================================
    // La liste des nœuds de la branche choisie
    //=========================================================================
    function Window_Noeuds() { this.initialize.apply(this, arguments); }
    Window_Noeuds.prototype = Object.create(Window_Selectable.prototype);
    Window_Noeuds.prototype.constructor = Window_Noeuds;

    Window_Noeuds.prototype.initialize = function (x, y, largeur, hauteur) {
        // Les champs AVANT l'initialisation du parent : Window_Selectable
        // appelle maxItems() pendant qu'il s'initialise (et MOG_Scrollbar et
        // MOG_CursorBorder appellent select() par-dessus). Une liste posée
        // après, c'est la fenêtre qui tombe à l'ouverture.
        this._acteur = null;
        this._branche = null;
        this._donnees = [];
        Window_Selectable.prototype.initialize.call(this, x, y, largeur, hauteur);
    };

    Window_Noeuds.prototype.poser = function (acteur, branche) {
        if (this._acteur === acteur && this._branche === branche) { return; }
        this._acteur = acteur;
        this._branche = branche;
        this.refresh();
        this.resetScroll();
    };

    // Même raison : on répond 0 tant que la liste n'existe pas.
    Window_Noeuds.prototype.maxItems = function () { return this._donnees ? this._donnees.length : 0; };
    Window_Noeuds.prototype.item = function () {
        var d = (this._donnees || [])[this.index()];
        return d ? d.skill : null;
    };
    Window_Noeuds.prototype.noeud = function () { return (this._donnees || [])[this.index()] || null; };

    Window_Noeuds.prototype.isCurrentItemEnabled = function () { return this.estEmployable(this.noeud()); };

    Window_Noeuds.prototype.estEmployable = function (noeud) {
        if (!noeud || !this._acteur) { return false; }
        return this._acteur.isLearnedSkill(noeud.skill.id) && this._acteur.canUse(noeud.skill);
    };

    Window_Noeuds.prototype.makeItemList = function () {
        this._donnees = this._branche ? this._branche.noeuds.slice() : [];
    };

    Window_Noeuds.prototype.refresh = function () {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    };

    Window_Noeuds.prototype.drawItem = function (index) {
        var noeud = this._donnees[index];
        if (!noeud) { return; }
        var s = noeud.skill;
        var r = this.itemRect(index);
        var appris = this._acteur.isLearnedSkill(s.id);
        var employable = this.estEmployable(noeud);

        // la tige qui relie les nœuds : on lit la branche de haut en bas
        var couleur = this._branche ? this._branche.couleur : '#ffffff';
        this.contents.paintOpacity = appris ? 200 : 90;
        if (index > 0) { this.contents.fillRect(r.x + 11, r.y, 2, 8, couleur); }
        if (index < this._donnees.length - 1) {
            this.contents.fillRect(r.x + 11, r.y + r.height - 10, 2, 12, couleur);
        }
        this.contents.drawCircle(r.x + 12, r.y + Math.floor(r.height / 2), appris ? 7 : 5,
            appris ? couleur : '#4b5666');
        this.contents.paintOpacity = 255;

        this.changePaintOpacity(employable);
        this.drawItem_icone(s, r.x + 26, r.y);
        this.contents.fontSize = 20;
        this.drawText(s.name, r.x + 62, r.y, r.width - 62 - 96);
        // à droite : le coût, ou le niveau où le nœud s'ouvre
        this.contents.fontSize = 18;
        if (!appris && noeud.niveau > 0) {
            this.changeTextColor(this.textColor(7));
            this.drawText('Nv ' + noeud.niveau, r.x + r.width - 92, r.y, 92, 'right');
        } else {
            this.changeTextColor(this.textColor(0));
            this.drawText(this.coutTexte(s), r.x + r.width - 92, r.y, 92, 'right');
        }
        this.resetTextColor();
        this.contents.fontSize = this.standardFontSize();
        this.changePaintOpacity(true);
    };

    Window_Noeuds.prototype.drawItem_icone = function (s, x, y) {
        if (s.iconIndex > 0) { this.drawIcon(s.iconIndex, x, y + 2); }
    };

    Window_Noeuds.prototype.coutTexte = function (s) {
        var pm = this._acteur ? this._acteur.skillMpCost(s) : s.mpCost;
        var pt = this._acteur ? this._acteur.skillTpCost(s) : s.tpCost;
        var bouts = [];
        if (pm) { bouts.push(pm + ' PM'); }
        if (pt) { bouts.push(pt + ' PT'); }
        return bouts.join(' ') || '—';
    };

    Window_Noeuds.prototype.itemHeight = function () { return this.lineHeight() + 6; };

    Window_Noeuds.prototype.updateHelp = function () {
        if (this._helpWindow) { this._helpWindow.poser(this._acteur, this._branche, this.noeud()); }
    };

    //=========================================================================
    // Le bandeau du bas : ce que fait la compétence
    //=========================================================================
    function Window_Noeud_Info() { this.initialize.apply(this, arguments); }
    Window_Noeud_Info.prototype = Object.create(Window_Base.prototype);
    Window_Noeud_Info.prototype.constructor = Window_Noeud_Info;

    Window_Noeud_Info.prototype.initialize = function (x, y, largeur, hauteur) {
        Window_Base.prototype.initialize.call(this, x, y, largeur, hauteur);
        this._acteur = null; this._branche = null; this._noeud = null;
    };

    Window_Noeud_Info.prototype.poser = function (acteur, branche, noeud) {
        if (this._acteur === acteur && this._branche === branche && this._noeud === noeud) { return; }
        this._acteur = acteur; this._branche = branche; this._noeud = noeud;
        this.refresh();
    };

    /** Coupe un texte aux espaces pour qu'il tienne, et rend au plus n lignes. */
    Window_Noeud_Info.prototype.replier = function (texte, largeur, n) {
        var mots = String(texte).split(' ');
        var lignes = [], courante = '';
        for (var i = 0; i < mots.length; i++) {
            var essai = courante ? courante + ' ' + mots[i] : mots[i];
            if (this.textWidth(essai) > largeur && courante) {
                lignes.push(courante);
                courante = mots[i];
                if (lignes.length === n) { break; }
            } else {
                courante = essai;
            }
        }
        if (lignes.length < n && courante) { lignes.push(courante); }
        // si ça ne tient toujours pas, la dernière ligne finit par un signe clair
        if (lignes.length === n) {
            var reste = mots.slice(lignes.join(' ').split(' ').length).join(' ');
            if (reste) { lignes[n - 1] = lignes[n - 1] + ' …'; }
        }
        return lignes;
    };

    Window_Noeud_Info.prototype.refresh = function () {
        this.contents.clear();
        if (!this._noeud) { return; }
        var s = this._noeud.skill;
        var l = this.lineHeight();
        var appris = this._acteur && this._acteur.isLearnedSkill(s.id);

        this.changeTextColor(this.textColor(this._branche && this._branche.ouverte ? 0 : 7));
        this.contents.fontSize = 24;
        this.drawText(s.name, 0, 0, this.contentsWidth() - 240);
        this.resetTextColor();
        this.contents.fontSize = 18;

        var etat;
        if (appris) {
            etat = this._acteur.canUse(s) ? 'employable maintenant' : 'apprise — pas maintenant';
        } else if (this._noeud.niveau > 0) {
            var reste = this._noeud.niveau - this._acteur.level;
            if (reste <= 1 && niveauEnAttente(this._acteur)) { etat = 'le niveau qui t\'attend l\'ouvre'; }
            else if (reste <= 0) { etat = 'apprise au niveau ' + this._noeud.niveau + ' — oubliée depuis'; }
            else { etat = reste + ' niveau' + (reste > 1 ? 'x' : '') + ' avant qu\'elle s\'ouvre'; }
        } else {
            etat = 'pas encore apprise';
        }
        this.changeTextColor(this.textColor(appris ? 24 : 7));
        this.drawText(etat, this.contentsWidth() - 240, 0, 240, 'right');
        this.resetTextColor();

        this.contents.fontSize = this.standardFontSize();
        // drawTextEx ne borne rien : une description longue sortait de la
        // fenêtre et se coupait au milieu d'un mot. On la replie sur deux
        // lignes, aux espaces, sans en perdre un morceau en silence.
        var lignes = this.replier(String(s.description || '').replace(/\n/g, ' '), this.contentsWidth() - 8, 2);
        lignes.forEach(function (texte, i) { this.drawTextEx(texte, 0, l * (i + 1)); }, this);

        // la branche à laquelle il appartient, et son avertissement s'il est fermé
        this.contents.fontSize = 18;
        this.changeTextColor(this.textColor(7));
        var pied = this._branche ? ('branche « ' + this._branche.nom + ' »') : '';
        if (this._branche && !this._branche.ouverte) {
            pied += '  —  aucun trait n\'ouvre ce type : invisible en combat';
        }
        if (niveauEnAttente(this._acteur)) { pied += '        [Maj] monter de niveau'; }
        // ⚠ 2026-10-02 (tous_les_menus.js) : à l * 3, la ligne débordait sous
        //   le bas du cadre et les jambages se coupaient (« capacité »)
        this.drawText(pied, 0, Math.min(l * 3, this.contentsHeight() - l), this.contentsWidth());
        this.resetTextColor();
        this.contents.fontSize = this.standardFontSize();
    };

    //=========================================================================
    // Le bandeau du haut
    //=========================================================================
    function Window_Orbe_Titre() { this.initialize.apply(this, arguments); }
    Window_Orbe_Titre.prototype = Object.create(Window_Base.prototype);
    Window_Orbe_Titre.prototype.constructor = Window_Orbe_Titre;

    Window_Orbe_Titre.prototype.initialize = function (x, y, largeur, hauteur) {
        Window_Base.prototype.initialize.call(this, x, y, largeur, hauteur);
        this._acteur = null; this._branche = null;
    };

    Window_Orbe_Titre.prototype.poser = function (acteur, branche, iBranche, nBranches) {
        this._acteur = acteur; this._branche = branche;
        this._i = iBranche; this._n = nBranches;
        this.refresh();
    };

    Window_Orbe_Titre.prototype.refresh = function () {
        this.contents.clear();
        if (!this._acteur) { return; }
        this.contents.fontSize = 22;
        this.changeTextColor(this.textColor(14));
        this.drawText(TITRE, 0, 0, 300);
        this.resetTextColor();
        this.contents.fontSize = this.standardFontSize();
        var t = this._acteur.name() + '   ' + this._acteur.currentClass().name + '   Nv' + this._acteur.level;
        this.drawText(t, 300, 0, 320, 'left');
        // GALV_ManualLevel retient la montée de niveau jusqu'à ce que le joueur
        // la prenne en main : quand elle attend, l'orbe le dit et la propose.
        this.contents.fontSize = 18;
        if (niveauEnAttente(this._acteur)) {
            this.changeTextColor(this.textColor(17));
            this.drawText('⬆ MAJ (un niveau t\'attend)', this.contentsWidth() - 300, 0, 240, 'right');
        }
        this.changeTextColor(this.textColor(7));
        this.drawText((this._i + 1) + '/' + this._n, this.contentsWidth() - 56, 0, 56, 'right');
        this.resetTextColor();
        this.contents.fontSize = this.standardFontSize();
    };

    //=========================================================================
    // La scène
    //=========================================================================
    function Scene_OrbeCapacites() { this.initialize.apply(this, arguments); }
    Scene_OrbeCapacites.prototype = Object.create(Scene_ItemBase.prototype);
    Scene_OrbeCapacites.prototype.constructor = Scene_OrbeCapacites;

    Scene_OrbeCapacites.prototype.initialize = function () {
        Scene_ItemBase.prototype.initialize.call(this);
        this._iBranche = 0;
    };

    // La carte floutée derrière l'écran écrase les points de lumière de
    // l'orbe. On pose un voile sombre par-dessus : le fond reste reconnaissable,
    // les branches redeviennent lisibles.
    Scene_OrbeCapacites.prototype.createBackground = function () {
        Scene_ItemBase.prototype.createBackground.call(this);
        this._voile = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        this._voile.bitmap.fillAll('rgba(6, 10, 18, 1)');
        this._voile.opacity = 205;
        this.addChild(this._voile);
    };

    Scene_OrbeCapacites.prototype.create = function () {
        Scene_ItemBase.prototype.create.call(this);
        this._titreWindow = new Window_Orbe_Titre(0, 0, Graphics.boxWidth, H_TITRE);
        this.addWindow(this._titreWindow);

        var hMilieu = Graphics.boxHeight - H_TITRE - H_INFO;
        this._orbe = new Sprite_Orbe(0, H_TITRE, Graphics.boxWidth - L_LISTE, hMilieu);
        this.addChild(this._orbe);

        this._infoWindow = new Window_Noeud_Info(0, H_TITRE + hMilieu, Graphics.boxWidth, H_INFO);
        this.addWindow(this._infoWindow);

        this._itemWindow = new Window_Noeuds(Graphics.boxWidth - L_LISTE, H_TITRE, L_LISTE, hMilieu);
        this._itemWindow.setHelpWindow(this._infoWindow);
        this._itemWindow.setHandler('ok', this.surOk.bind(this));
        this._itemWindow.setHandler('cancel', this.popScene.bind(this));
        this._itemWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._itemWindow.setHandler('pageup', this.previousActor.bind(this));
        this.addWindow(this._itemWindow);

        this.createActorWindow();
    };

    Scene_OrbeCapacites.prototype.start = function () {
        Scene_ItemBase.prototype.start.call(this);
        // au retour d'un autre écran (la montée de niveau), les branches sont
        // relues : un nœud appris entre-temps s'allume tout seul.
        this.refreshActor();
        this._itemWindow.refresh();
        this._itemWindow.activate();
        this._itemWindow.select(0);
    };

    Scene_OrbeCapacites.prototype.refreshActor = function () {
        var acteur = this.actor();
        this._branches = branchesDe(acteur);
        if (this._iBranche >= this._branches.length) { this._iBranche = 0; }
        this.rafraichir();
    };

    Scene_OrbeCapacites.prototype.onActorChange = function () {
        this._iBranche = 0;
        this.refreshActor();
        this._itemWindow.select(0);
        this._itemWindow.activate();
    };

    Scene_OrbeCapacites.prototype.brancheCourante = function () {
        return this._branches ? this._branches[this._iBranche] : null;
    };

    Scene_OrbeCapacites.prototype.rafraichir = function () {
        var br = this.brancheCourante();
        this._itemWindow.poser(this.actor(), br);
        this._titreWindow.poser(this.actor(), br, this._iBranche, Math.max(1, (this._branches || []).length));
        this._infoWindow.poser(this.actor(), br, this._itemWindow.noeud());
        this._orbe.poser(this.actor(), this._branches || [], this._iBranche, this._itemWindow.index());
    };

    Scene_OrbeCapacites.prototype.update = function () {
        Scene_ItemBase.prototype.update.call(this);
        if (this._itemWindow.active) {
            if (Input.isRepeated('right')) { this.changerBranche(1); }
            else if (Input.isRepeated('left')) { this.changerBranche(-1); }
            else if (Input.isTriggered('shift')) { this.monterDeNiveau(); }
        }
        this.rafraichir();
    };

    // Maj ouvre la montée de niveau du héros affiché, sans quitter l'orbe :
    // on revient dessus, et les nœuds que le niveau vient d'ouvrir sont allumés.
    Scene_OrbeCapacites.prototype.monterDeNiveau = function () {
        var a = this.actor();
        if (!a || !niveauEnAttente(a)) { SoundManager.playBuzzer(); return; }
        if (!window.Galv || !Galv.MLEVEL || typeof Galv.MLEVEL.levelUp !== 'function') { SoundManager.playBuzzer(); return; }
        SoundManager.playOk();
        Galv.MLEVEL.levelUp(a.actorId());
    };

    Scene_OrbeCapacites.prototype.changerBranche = function (sens) {
        var n = (this._branches || []).length;
        if (n <= 1) { return; }
        this._iBranche = (this._iBranche + sens + n) % n;
        SoundManager.playCursor();
        this._itemWindow.poser(this.actor(), this.brancheCourante());
        this._itemWindow.select(0);
        this.rafraichir();
    };

    // ── employer une compétence, exactement comme l'ancien écran le faisait ──
    Scene_OrbeCapacites.prototype.surOk = function () {
        this.actor().setLastMenuSkill(this.item());
        this.determineItem();
    };
    Scene_OrbeCapacites.prototype.item = function () { return this._itemWindow.item(); };
    Scene_OrbeCapacites.prototype.user = function () { return this.actor(); };
    Scene_OrbeCapacites.prototype.isCursorLeft = function () { return false; };
    Scene_OrbeCapacites.prototype.playSeForItem = function () { SoundManager.playUseSkill(); };
    Scene_OrbeCapacites.prototype.useItem = function () {
        Scene_ItemBase.prototype.useItem.call(this);
        this._itemWindow.refresh();
        this.rafraichir();
    };
    Scene_OrbeCapacites.prototype.onActorOk = function () {
        Scene_ItemBase.prototype.onActorOk ? Scene_ItemBase.prototype.onActorOk.call(this) : null;
    };
    Scene_OrbeCapacites.prototype.onItemOk = function () { };
    Scene_OrbeCapacites.prototype.activateItemWindow = function () {
        this._itemWindow.refresh();
        this._itemWindow.activate();
    };

    //=========================================================================
    // On prend la place de l'ancien écran
    //=========================================================================
    // Tout ce qui pousse Scene_Skill — le menu de Yanfly, un appel de script,
    // une commande d'événement — arrive désormais ici. L'ancienne classe reste
    // en mémoire sous son nom d'origine : rien n'est supprimé.
    window.Scene_OrbeCapacites = Scene_OrbeCapacites;
    window.Scene_Skill_Yanfly = window.Scene_Skill;
    window.Scene_Skill = Scene_OrbeCapacites;

    // De quoi mesurer sans deviner : ce que l'Orbe montre, héros par héros.
    window.OrbeDesCapacites = { branchesDe: branchesDe, sesBranches: SES_BRANCHES };
})();
