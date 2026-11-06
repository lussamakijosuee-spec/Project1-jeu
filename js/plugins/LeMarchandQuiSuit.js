//=============================================================================
// LeMarchandQuiSuit.js — v1.0
// Un marchand dont le stock se calcule tout seul, et qui suit la progression.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ « MARCHAND <palier> » : une boutique dont le stock se
 * calcule à l'exécution, par le prix. De quoi rendre atteignable l'échelle
 * d'équipement que le jeu possède déjà et ne vend nulle part.
 * @author pour JOKO
 *
 * @param vendrePrixZero
 * @text Vendre aussi ce qui coûte 0 ?
 * @type boolean
 * @default false
 * @desc Un prix à 0 veut dire « ne se vend pas » : butin de boss, arme
 * d'histoire, objet de quête. Par défaut on ne les met pas en rayon.
 *
 * @param reventeAutorisee
 * @text Le joueur peut-il revendre ?
 * @type boolean
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  POURQUOI CE GREFFON EXISTE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Mesuré le 2026-09-25, sur les 67 cartes, les 71 événements communs, les
 *  492 troupes et les 549 ennemis :
 *
 *      226 armes existent.       54 sont atteignables.   172 ne le sont pas.
 *      101 armures existent.     28 sont atteignables.    73 ne le sont pas.
 *      111 objets existent.      61 sont atteignables.    50 ne le sont pas.
 *
 *  « Atteignable » veut dire : vendue dans l'une des 13 boutiques du jeu,
 *  donnée par un événement, ou lâchée par un ennemi. Le reste est dans les
 *  données et n'entrera jamais dans le sac du joueur.
 *
 *  Et ce n'est pas du rebut. C'est L'ÉCHELLE ENTIÈRE :
 *
 *      Fer → Acier → Argent → Mithril → Cristal → Runique → Légendaire
 *
 *  sur les quinze types d'armes et les huit types d'armures. Quatre-vingt-
 *  seize pièces de progression, réglées, chiffrées, décrites — que les
 *  treize boutiques du jeu ne vendent pas : à elles toutes, elles proposent
 *  4 armes et 4 armures.
 *
 *  Il ne manquait donc pas d'équipement. Il manquait un marchand.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  LA COMMANDE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *      MARCHAND 1      la forge de village      jusqu'à     700 or
 *      MARCHAND 2      le bourg                            1 600 or
 *      MARCHAND 3      la ville                            3 200 or
 *      MARCHAND 4      la capitale                         5 200 or
 *      MARCHAND 5      le quartier haut                    8 000 or
 *      MARCHAND 6      l'arsenal                          11 500 or
 *      MARCHAND 7      le dernier comptoir                 tout
 *
 *      MARCHAND armes 3     seulement les armes,   jusqu'au palier 3
 *      MARCHAND armures 5   seulement les armures, jusqu'au palier 5
 *      MARCHAND objets      les consommables, tous paliers confondus
 *      MARCHAND auto        le palier du plus haut niveau du groupe
 *      MARCHAND tout        absolument tout ce qui a un prix
 *
 *  Le stock n'est écrit nulle part : il se recalcule à chaque ouverture, à
 *  partir du PRIX. Une arme ajoutée demain se rangera d'elle-même dans le
 *  bon rayon, sans qu'on touche à un seul événement.
 *
 *  ── Pourquoi le prix, et pas le nom ? ───────────────────────────────────
 *  Parce qu'un nom se lit de travers. « Lame Écarlate d'Argent » et « Épée
 *  en or » appartiennent au même palier et ne se ressemblent pas ; trois
 *  contrôles de ce projet se sont déjà trompés en cherchant des motifs dans
 *  du texte. Le prix, lui, est un nombre que JOKO a posé lui-même.
 *
 *  ── Une remarque sur « auto » ───────────────────────────────────────────
 *  Les quatre héros commencent au niveau 89 sur 99. `MARCHAND auto` ouvrira
 *  donc le dernier palier dès la première boutique. Pour une progression,
 *  c'est le numéro explicite qu'il faut poser — d'où les sept événements
 *  communs qui vont avec.
 */

(function () {
    'use strict';

    var P = PluginManager.parameters('LeMarchandQuiSuit');
    var PRIX_ZERO = String(P['vendrePrixZero'] || 'false') === 'true';
    var REVENTE = String(P['reventeAutorisee'] || 'true') === 'true';

    // Les plafonds, relevés sur l'échelle réelle du projet.
    var PLAFONDS = [700, 1600, 3200, 5200, 8000, 11500, Infinity];

    function plafond(n) {
        var i = Math.floor(Number(n));
        if (isNaN(i) || i < 1) { i = 1; }
        if (i > PLAFONDS.length) { i = PLAFONDS.length; }
        return PLAFONDS[i - 1];
    }

    /** Le plus haut niveau du groupe → un palier de 1 à 7. */
    function palierDuGroupe() {
        var membres = $gameParty ? $gameParty.members() : [];
        var niv = 1;
        membres.forEach(function (m) { if (m && m.level > niv) { niv = m.level; } });
        var n = Math.ceil(niv / 14);
        return Math.max(1, Math.min(PLAFONDS.length, n));
    }

    /** Vendable : elle a un nom, et un prix (sauf si on a demandé le contraire). */
    function vendable(o) {
        if (!o || !String(o.name || '').trim()) { return false; }
        if (!PRIX_ZERO && !o.price) { return false; }
        return true;
    }

    /**
     * Le stock.
     * @param quoi  'armes' | 'armures' | 'objets' | 'tout'
     * @param max   prix plafond
     * @returns le tableau `goods` que Scene_Shop attend :
     *          [type, id, typeDePrix, prix, revente]
     *          type 0 objet · 1 arme · 2 armure   ·   typeDePrix 0 = son prix
     */
    function stock(quoi, max) {
        var g = [];
        function verser(liste, type) {
            liste.forEach(function (o) {
                if (!vendable(o) || o.price > max) { return; }
                // Un objet clé (itypeId 2) ne se vend pas.
                if (type === 0 && o.itypeId !== 1) { return; }
                g.push([type, o.id, 0, 0, REVENTE]);
            });
        }
        if (quoi === 'objets' || quoi === 'tout') { verser($dataItems, 0); }
        if (quoi === 'armes' || quoi === 'tout') { verser($dataWeapons, 1); }
        if (quoi === 'armures' || quoi === 'tout') { verser($dataArmors, 2); }
        // Du moins cher au plus cher : le joueur lit une progression, pas un
        // numéro d'identifiant.
        g.sort(function (a, b) {
            var oa = a[0] === 0 ? $dataItems[a[1]] : (a[0] === 1 ? $dataWeapons[a[1]] : $dataArmors[a[1]]);
            var ob = b[0] === 0 ? $dataItems[b[1]] : (b[0] === 1 ? $dataWeapons[b[1]] : $dataArmors[b[1]]);
            return (oa.price || 0) - (ob.price || 0);
        });
        return g;
    }

    function ouvrir(quoi, palierDemande) {
        var max = plafond(palierDemande);
        var g = stock(quoi, max);
        if (!g.length) { return false; }
        SceneManager.push(Scene_Shop);
        SceneManager.prepareNextScene(g, false);
        return true;
    }

    //=========================================================================
    // LA COMMANDE
    //=========================================================================
    var _cmd = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _cmd.call(this, command, args);
        if (String(command || '').trim().toUpperCase() !== 'MARCHAND') { return; }

        var a0 = String(args[0] || '').trim().toLowerCase();
        var a1 = args[1];

        if (a0 === 'armes' || a0 === 'arme') { ouvrir('armes', a1 === undefined ? 7 : a1); return; }
        if (a0 === 'armures' || a0 === 'armure') { ouvrir('armures', a1 === undefined ? 7 : a1); return; }
        if (a0 === 'objets' || a0 === 'objet') { ouvrir('objets', 7); return; }
        if (a0 === 'tout') { ouvrir('tout', 7); return; }
        if (a0 === 'auto' || a0 === '') { ouvrir('tout', palierDuGroupe()); return; }
        ouvrir('tout', a0);
    };

    //=========================================================================
    // DE QUOI LE MESURER SANS DEVINER
    //=========================================================================
    window.LeMarchandQuiSuit = {
        plafonds: PLAFONDS,
        plafond: plafond,
        palierDuGroupe: palierDuGroupe,
        stock: stock,

        /** Combien de pièces chaque palier met en rayon. */
        recensement: function () {
            var r = [];
            for (var i = 1; i <= PLAFONDS.length; i++) {
                r.push({
                    palier: i,
                    plafond: PLAFONDS[i - 1],
                    armes: stock('armes', PLAFONDS[i - 1]).length,
                    armures: stock('armures', PLAFONDS[i - 1]).length,
                    objets: stock('objets', PLAFONDS[i - 1]).length
                });
            }
            return r;
        }
    };

})();
