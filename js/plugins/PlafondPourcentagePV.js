//=============================================================================
// PlafondPourcentagePV.js — v1.0
// RPG Maker MV
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les compétences en pourcentage de PV max gardent leur
 * caractère sur les ennemis ordinaires, mais sont plafonnées contre les boss.
 * @author JOKO
 *
 * @param plafondDefaut
 * @text Plafond par défaut (% des PV max du boss)
 * @type number
 * @min 1
 * @max 100
 * @default 10
 * @desc Contre un ennemi marqué <Boss>, une compétence en % de PV max ne peut
 * pas retirer plus que ce pourcentage de ses PV max en un coup.
 *
 * @param marqueurBoss
 * @text Notetag qui désigne un boss
 * @type string
 * @default Boss
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LE PLAFOND DES COMPÉTENCES EN POURCENTAGE DE PV MAX
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  LE PROBLÈME QU'IL RÈGLE
 *
 *  Une formule comme « b.mhp * 0.80 » ne regarde ni l'attaque du lanceur ni la
 *  défense de la cible : elle retire 80 % des PV de n'importe qui. Sur un
 *  monstre ordinaire c'est un coup de grâce spectaculaire — c'est son
 *  caractère, et il est gardé. Sur un boss à 98 800 PV, c'est 79 040 dégâts en
 *  un coup : deux héros suffisent à finir le combat au premier tour, et tout
 *  le travail d'équilibrage du boss ne sert plus à rien.
 *
 *  CE QU'IL FAIT
 *
 *  Contre un ennemi portant <Boss>, et SEULEMENT contre lui, une compétence
 *  dont la formule cite « b.mhp » voit ses dégâts plafonnés à un pourcentage
 *  des PV max de la cible. Partout ailleurs, rien ne change.
 *
 *  Le plafond par défaut est de 10 %, ce qui place ces compétences au niveau
 *  de la meilleure compétence ordinaire du jeu contre un boss — fortes, mais
 *  plus gagnantes à elles seules.
 *
 *  RÉGLAGE FIN, ENNEMI PAR ENNEMI
 *
 *    <PlafondPV: 5%>     sur un ennemi → ce boss-là ne peut pas perdre plus de
 *                        5 % de ses PV max par coup en pourcentage.
 *    <PlafondPV: aucun>  sur un ennemi → pas de plafond, même s'il est <Boss>.
 *
 *  CE QU'IL NE TOUCHE PAS
 *
 *  • les soins et les absorptions (seuls les dégâts sont plafonnés) ;
 *  • les compétences dont la formule ne cite pas « b.mhp » ;
 *  • tout ennemi qui ne porte pas <Boss>.
 *
 *  Le repérage se fait sur la formule écrite dans la base, une seule fois au
 *  démarrage : aucune liste à tenir à jour, une nouvelle compétence en % de PV
 *  est prise en compte toute seule.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('PlafondPourcentagePV');
    var PLAFOND = Number(P['plafondDefaut'] || 10) / 100;
    var MARQUEUR = String(P['marqueurBoss'] || 'Boss');

    // Une compétence est « en pourcentage de PV max » si sa formule lit b.mhp.
    // On le décide sur le texte de la formule, une fois, au chargement.
    function litPvMax(item) {
        if (!item || !item.damage || !item.damage.formula) return false;
        if (item._plafondPV === undefined) {
            item._plafondPV = /\bb\s*\.\s*mhp\b/.test(item.damage.formula);
        }
        return item._plafondPV;
    }

    // Le plafond propre à une cible : <PlafondPV: n%> ou <PlafondPV: aucun>.
    // Rend null quand la cible n'est pas plafonnée du tout.
    function plafondDe(cible) {
        if (!cible || !cible.isEnemy || !cible.isEnemy()) return null;
        var e = cible.enemy();
        if (!e) return null;
        var note = e.note || '';

        var m = /<\s*PlafondPV\s*:\s*([^>]+)>/i.exec(note);
        if (m) {
            var v = m[1].trim();                       // MV garde l'espace après « : »
            if (/^(aucun|non|off|0)$/i.test(v)) return null;
            var n = parseFloat(v.replace('%', ''));
            if (isFinite(n) && n > 0) return n / 100;
        }

        var boss = new RegExp('<\\s*' + MARQUEUR + '\\s*>', 'i');
        return boss.test(note) ? PLAFOND : null;
    }

    var _makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var valeur = _makeDamageValue.call(this, target, critical);

        // seuls les DÉGÂTS sont plafonnés — un soin reste un soin
        if (!(valeur > 0)) return valeur;
        if (!litPvMax(this.item())) return valeur;

        var part = plafondDe(target);
        if (part === null) return valeur;

        var max = Math.floor(target.mhp * part);
        return Math.min(valeur, Math.max(max, 1));
    };
})();
