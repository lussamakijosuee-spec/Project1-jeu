//=============================================================================
// MecaniquesDeBossSuite.js — v1.0
// RPG Maker MV
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Les 27 boss qui n'avaient que le rythme commun reçoivent
 * chacun SA mécanique — celle que dit déjà le texte de sa mise en garde.
 * @author pour JOKO
 *
 * @param table
 * @text Boss → mécanique
 * @type note
 * @default "788:flair, 789:portee, 790:greffes, 791:gonfle, 792:meche, 793:sol, 794:ligne, 795:liste, 798:registre, 799:aspiration, 800:geste, 801:role, 802:souffle, 803:entre, 804:plume, 805:rature, 806:tension, 809:annonce, 810:bras, 811:gel, 812:bouge, 813:vent, 814:tresor, 815:interstice, 816:accepte"
 * @desc id d'ennemi : mécanique. On peut aussi poser <MecaBoss: nom> dans la note d'un ennemi.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  VINGT-SEPT BOSS, VINGT-SEPT PHRASES DÉJÀ ÉCRITES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Mesuré le 2026-09-26 : sur les 41 boss, 14 avaient une mécanique
 *  (MecaniquesDeBoss, Sept Ans, le dieu sans visage). Les 27 autres jouaient
 *  exactement le même combat : mise en garde, frappe, fenêtre.
 *
 *  Or chacun a une mise en garde et une frappe que JOKO a NOMMÉES et
 *  DÉCRITES, et chaque description est déjà une règle. On ne l'invente pas :
 *  on la rend vraie. La phrase citée est dans chaque bloc, plus bas.
 *
 *  Aucune donnée n'est touchée — ni les ennemis, ni les compétences. La table
 *  ci-dessus relie un ennemi à sa mécanique ; <MecaBoss: nom> dans la note
 *  d'un ennemi fait la même chose. Tout passe par ScenesDeBoss (le registre
 *  window.MecaBoss), qui doit être chargé AVANT.
 *
 *  ┌───────────┬──────────────────────────────────────────────────────────┐
 *  │ flair     │ Gargal — « Il a trouvé ton odeur. Il ne la perdra plus. »│
 *  │ portee    │ Vieille Suif — la portée grossit à chaque appel           │
 *  │ greffes   │ Le Rapiécé — chaque greffe frappe en même temps           │
 *  │ gonfle    │ Panse-Monde — une panse à crever avant qu'elle déborde    │
 *  │ meche     │ Fournaise — mèche insécable, fenêtre de 3 tours           │
 *  │ sol       │ Coulée — pendant la charge, chaque geste brûle            │
 *  │ ligne     │ Maréchal Vhaal — deux fois plus dur à rompre              │
 *  │ liste     │ Bourreau — la Sentence tombe sur le nom écrit             │
 *  │ silence   │ Celui Qui Attend — chaque tour sans frapper pèse          │
 *  │ main      │ La Veuve — qui la frappe pendant la charge « prend la main »│
 *  │ registre  │ Le Percepteur — la Dîme prend vos PM                      │
 *  │ aspiration│ Gouffre Poli — il aspire vos bonus, punit ceux debout     │
 *  │ geste     │ Ton Visage — chaque technique montrée le renforce         │
 *  │ role      │ La Doublure — elle devient un héros, ses coups la ratent  │
 *  │ souffle   │ La Cantatrice — la salle se tait, la magie aussi          │
 *  │ entre     │ Le Contre-Chant — ceux du milieu trinquent                │
 *  │ plume     │ Le Point Final — il écrit sur un héros                    │
 *  │ rature    │ L'Errata — la Correction barre vos bonus                  │
 *  │ tension   │ Grande Glace — ce qu'on lui envoie revient                │
 *  │ annonce   │ L'Augure — la prophétie désigne, et ne rate pas           │
 *  │ bras      │ Le Grand Immobile — un tour, un seul                      │
 *  │ gel       │ Demeres — le gel monte, la vitesse tombe                  │
 *  │ bouge     │ Dynamo — « Bouge. » Qui reste immobile prend tout         │
 *  │ vent      │ Ventoss — ni garde ni esquive                             │
 *  │ tresor    │ Midas Tardif — votre or pèse sur l'éboulis                │
 *  │ interstice│ Le Sans-Prix — un seul élément passe ; trouve-le          │
 *  │ accepte   │ Le Consenti — ce qu'on lui a infligé ressort              │
 *  └───────────┴──────────────────────────────────────────────────────────┘
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var MB = window.MecaBoss;
    if (!MB) { console.error('MecaniquesDeBossSuite : ScenesDeBoss doit être chargé avant.'); return; }

    var P = PluginManager.parameters('MecaniquesDeBossSuite');
    var table = String(P['table'] || '').replace(/^"|"$/g, '');
    table.split(',').forEach(function (p) {
        var m = /^\s*(\d+)\s*:\s*(\w+)\s*$/.exec(p);
        if (m) MB.table[Number(m[1])] = m[2].toLowerCase();
    });

    var CHARGE = MB.charge, SURCHARGE = MB.surcharge;
    var dire = MB.dire, heros = MB.heros, auHasard = MB.auHasard;
    function enCharge(b) { return b.isStateAffected(CHARGE); }
    function frappe(a) { return a && MB.estFrappe(a.item()); }
    function court(b) { return b.name().split(',')[0].trim(); }
    function pct(x) { return Math.round(x * 100) + ' %'; }
    function noms(liste) { return liste.map(function (h) { return h.name(); }).join(', '); }
    function vivant(h) { return h && h.isAlive() && $gameParty.battleMembers().indexOf(h) >= 0 ? h : null; }
    function estGarde(a) { return a && a.isSkill() && a.item() && a.item().id === a.subject().guardSkillId(); }
    var D = MB.defs;

    //-------------------------------------------------------------------------
    // GARGAL — « Il Renifle l'Air : Il a trouvé ton odeur. Il ne la perdra
    // plus. » · « Curée du Premier Croc : Toute la meute au même endroit, au
    // même instant. »
    //-------------------------------------------------------------------------
    D.flair = {
        charge: function (b) {
            if (vivant(b._flair)) { dire(court(b) + ' reprend la piste de ' + b._flair.name() + '.'); return; }
            b._flair = auHasard(heros());
            if (b._flair) dire('\\C[2]' + court(b) + ' a trouvé l\'odeur de ' + b._flair.name() + '. Il ne la perdra plus.\\C[0]');
        },
        degatsSortants: function (b, t, v, a) {
            var f = vivant(b._flair);
            if (!f) return v;
            if (t === f) return v * 1.5;
            return frappe(a) ? v * 0.7 : v;
        },
        inesquivable: function (b, a, t) { return !!t && t === vivant(b._flair); },
        ligne: function (b) {
            var f = vivant(b._flair);
            return f ? 'Il suit l\'odeur de ' + f.name() + ' — ×1,5, sans esquive' : 'Il cherche une odeur';
        }
    };

    //-------------------------------------------------------------------------
    // VIEILLE SUIF — « Elle Appelle la Portée : Quelque chose répond dans le
    // noir. » · « Marée de Petits : Ils arrivent de partout. »
    //-------------------------------------------------------------------------
    D.portee = {
        charge: function (b) {
            b._portee = Math.min(4, (b._portee || 0) + 1);
            dire('\\C[2]Quelque chose répond dans le noir. La portée compte ' + b._portee + ' petit(s).\\C[0]');
        },
        rompu: function (b) {
            b._portee = Math.max(0, (b._portee || 0) - 2);
            dire('\\C[23]La portée se disperse dans le noir.\\C[0]');
        },
        degatsSortants: function (b, t, v, a) { return frappe(a) ? v * (1 + 0.2 * (b._portee || 0)) : v; },
        ligne: function (b) { return 'Portée : ' + (b._portee || 0) + ' / 4 — Marée +' + ((b._portee || 0) * 20) + ' %'; }
    };

    //-------------------------------------------------------------------------
    // LE RAPIÉCÉ MAJEUR — « Il Se Découd : Il défait ses coutures pour faire
    // de la place. » · « Tout Ce Qu'il A Pris : Chaque greffe frappe en même
    // temps. »
    //-------------------------------------------------------------------------
    D.greffes = {
        charge: function (b) {
            b.gainHp(-Math.floor(b.mhp * 0.04));
            b._greffes = Math.min(3, (b._greffes || 0) + 1);
            dire('\\C[2]' + court(b) + ' se découd et fait de la place : ' + b._greffes + ' greffe(s).\\C[0]');
        },
        rompu: function (b) { b._greffes = 0; dire('\\C[23]Les coutures lâchent : toutes les greffes tombent.\\C[0]'); },
        repetitions: function (b, a) { return frappe(a) ? 1 + (b._greffes || 0) : 1; },
        degatsSortants: function (b, t, v, a) { return frappe(a) && b._greffes ? v * 0.5 : v; },
        ligne: function (b) { return 'Greffes : ' + (b._greffes || 0) + ' — la frappe part ' + (1 + (b._greffes || 0)) + ' fois'; }
    };

    //-------------------------------------------------------------------------
    // PANSE-MONDE — « Il Se Gonfle : Il prend de la place. Beaucoup de
    // place. » · « Débordement Total : Ce qui déborde recouvre tout le champ. »
    //-------------------------------------------------------------------------
    D.gonfle = {
        rupture: function () { return false; },          // sa rupture, c'est la panse
        charge: function (b) {
            b._panse = Math.floor(b.mhp * 0.05);
            dire('\\C[2]' + court(b) + ' se gonfle : ' + b._panse + ' à crever avant qu\'il déborde.\\C[0]');
        },
        absorbe: function (b, v) {
            if (!(b._panse > 0) || !enCharge(b)) return v;
            var pris = Math.min(v, b._panse);
            b._panse -= pris;
            if (b._panse <= 0) {
                b._panse = 0;
                MB.rompre(b, 'la panse a crevé');
            }
            return v - pris;
        },
        degatsSortants: function (b, t, v, a) { return frappe(a) && b._panse > 0 ? v * 1.3 : v; },
        apresFrappe: function (b) { b._panse = 0; },
        ligne: function (b) { return b._panse > 0 ? 'Panse : ' + b._panse + ' à crever — sinon ×1,3' : 'Il digère'; }
    };

    //-------------------------------------------------------------------------
    // FOURNAISE — « La Mèche Est Allumée : Compte les tours. C'est tout ce que
    // tu peux faire. » · « Détonation Majeure : Ce qu'il retenait sort. Puis
    // il reste ouvert un instant. »
    //-------------------------------------------------------------------------
    D.meche = {
        rupture: function () { return false; },
        apresFrappe: function (b) {
            if (b.isAlive() && b.isStateAffected(SURCHARGE)) {
                b._stateTurns[SURCHARGE] = 3;
                dire('\\C[23]' + court(b) + ' reste ouvert : trois tours.\\C[0]');
            }
        },
        ligne: function (b) { return enCharge(b) ? 'La mèche brûle — tiens bon' : 'Après la détonation, il reste ouvert 3 tours'; }
    };

    //-------------------------------------------------------------------------
    // COULÉE — « Le Sol Rougeoie : Le terrain lui-même devient une arme. »
    //-------------------------------------------------------------------------
    D.sol = {
        actionHeros: function (b, h, a) {
            if (!enCharge(b) || estGarde(a)) return;
            var x = Math.floor(h.mhp * 0.06);
            h.gainHp(-x);
            dire('\\C[2]Le sol rougeoie sous ' + h.name() + ' : ' + x + ' PV.\\C[0]');
        },
        ligne: function (b) { return enCharge(b) ? 'Le sol rougeoie — agir brûle 6 %, se défendre non' : ''; }
    };

    //-------------------------------------------------------------------------
    // MARÉCHAL VHAAL, « la ligne qui n'a jamais cédé » — « Il Lève le Bâton :
    // Toute la ligne se prépare en même temps. »
    //-------------------------------------------------------------------------
    D.ligne = {
        rupture: function () { return 2; },
        rompu: function (b) {
            b._stateTurns[SURCHARGE] = 3;
            dire('\\C[17]La ligne cède — pour la première fois. Trois tours à découvert.\\C[0]');
        },
        ligne: function (b) { return 'La ligne qui n\'a jamais cédé — deux fois plus dure à rompre'; }
    };

    //-------------------------------------------------------------------------
    // BOURREAU DE CAMP, « celui qui compte les manquants » — « Il Consulte la
    // Liste : Il a écrit un nom. C'est le tien. » · « Exécution de Sentence :
    // Ce qui est écrit s'applique. »
    //-------------------------------------------------------------------------
    D.liste = {
        charge: function (b) {
            b._liste = auHasard(heros());
            if (b._liste) dire('\\C[2]' + court(b) + ' a écrit un nom : ' + b._liste.name() + '.\\C[0]');
        },
        cible: function (b, a) { return frappe(a) ? vivant(b._liste) : null; },
        degatsSortants: function (b, t, v, a) {
            var morts = $gameParty.battleMembers().filter(function (h) { return h.isDead(); }).length;
            v = v * (1 + 0.2 * morts);
            return frappe(a) && t === vivant(b._liste) ? v * 1.5 : v;
        },
        rompu: function (b) { b._liste = null; dire('\\C[23]La liste lui échappe des mains.\\C[0]'); },
        apresFrappe: function (b) { b._liste = null; },
        ligne: function (b) {
            var l = vivant(b._liste);
            var morts = $gameParty.battleMembers().filter(function (h) { return h.isDead(); }).length;
            return (l ? 'Sur la liste : ' + l.name() : 'La liste est vierge') + (morts ? ' · ' + morts + ' manquant(s) : +' + (morts * 20) + ' %' : '');
        }
    };

    //-------------------------------------------------------------------------
    // CELUI QUI ATTEND ENCORE — « Il Se Souvient : Quelque chose remonte, et
    // ça pèse sur toute la salle. » · « Tout Ce Qu'il N'a Pas Dit : Des années
    // de silence, d'un coup. »
    //-------------------------------------------------------------------------
    D.silence = {
        debutTour: function (b) { b._silence = Math.min(5, (b._silence || 0) + 1); },
        degatsSortants: function (b, t, v, a) { return frappe(a) ? v * (1 + 0.2 * (b._silence || 0)) : v; },
        apresFrappe: function (b) { b._silence = 0; },
        rompu: function (b) { b._silence = 0; dire('\\C[23]' + court(b) + ' ravale ce qu\'il allait dire.\\C[0]'); },
        ligne: function (b) { return 'Silence : ' + (b._silence || 0) + ' tour(s) — ce qu\'il n\'a pas dit +' + ((b._silence || 0) * 20) + ' %'; }
    };

    //-------------------------------------------------------------------------
    // LA VEUVE DE HALVANE — « Elle Tend la Main : Elle attend que tu la
    // prennes. Ne la prends pas. »
    //-------------------------------------------------------------------------
    D.main = {
        rupture: function () { return false; },
        charge: function (b) { b._mains = []; },
        touche: function (b, s, v) {
            if (!s || !s.isActor() || !enCharge(b)) return;
            b._mains = b._mains || [];
            if (b._mains.indexOf(s) < 0) {
                b._mains.push(s);
                dire('\\C[2]' + s.name() + ' a pris sa main.\\C[0]');
            }
        },
        degatsSortants: function (b, t, v, a) {
            if (!frappe(a)) return v;
            return (b._mains || []).indexOf(t) >= 0 ? v * 2 : v * 0.6;
        },
        apresFrappe: function (b) { b._mains = []; },
        ligne: function (b) {
            if (!enCharge(b)) return 'Elle attend';
            var m = b._mains || [];
            return 'Elle tend la main — ne la frappe pas' + (m.length ? ' · l\'ont prise : ' + noms(m) : '');
        }
    };

    //-------------------------------------------------------------------------
    // LE PERCEPTEUR, « celui qui prend sa part » — « Il Ouvre le Registre :
    // Il calcule ce que tu lui dois. » · « Dîme Totale : Il prend tout d'un
    // coup. C'est plus simple. »
    //-------------------------------------------------------------------------
    function dette() {
        return heros().reduce(function (s, h) { return s + Math.floor(h.mp * 0.3); }, 0);
    }
    D.registre = {
        frappe: function (b) {
            var total = 0;
            heros().forEach(function (h) { var x = Math.floor(h.mp * 0.3); h.gainMp(-x); total += x; });
            if (total > 0) {
                b.gainHp(total * 4);
                dire('\\C[2]' + court(b) + ' prend sa part : ' + total + ' PM, et s\'en nourrit.\\C[0]');
            }
        },
        ligne: function (b) { return enCharge(b) ? 'Registre ouvert — il prendra ' + dette() + ' PM (dépense-les)' : 'Il prend 30 % de vos PM'; }
    };

    //-------------------------------------------------------------------------
    // GOUFFRE POLI — « Il S'Ouvre : Le trou s'élargit. Tout est aspiré vers
    // lui. » · « Aspiration Totale : Ce qui tient debout ne tient plus. »
    //-------------------------------------------------------------------------
    D.aspiration = {
        charge: function (b) {
            var n = 0;
            heros().forEach(function (h) {
                for (var i = 0; i < 8; i++) {
                    if (h.isBuffAffected(i)) { h.removeBuff(i); b.addBuff(i, 3); n++; }
                }
            });
            if (n) dire('\\C[2]Tout est aspiré vers lui : ' + n + ' bonus arraché(s).\\C[0]');
        },
        degatsSortants: function (b, t, v, a) { return frappe(a) ? (t.hpRate() > 0.5 ? v * 1.5 : v * 0.7) : v; },
        ligne: function (b) { return enCharge(b) ? 'Ce qui tient debout ne tiendra plus — au-dessus de 50 % PV : ×1,5' : 'Il aspire vos bonus quand il s\'ouvre'; }
    };

    //-------------------------------------------------------------------------
    // TON VISAGE — « Il Répète Ton Geste : Il apprend en te regardant.
    // Vite. » · « Tout Ce Que Tu Sais Faire : Tes coups, dans l'ordre. »
    //-------------------------------------------------------------------------
    D.geste = {
        charge: function (b) { b._gestes = []; },
        actionHeros: function (b, h, a) {
            if (!enCharge(b) || !a.isSkill()) return;
            var id = a.item().id;
            if (id === h.attackSkillId() || id === h.guardSkillId()) return;
            b._gestes = b._gestes || [];
            if (b._gestes.indexOf(id) < 0 && b._gestes.length < 5) {
                b._gestes.push(id);
                dire('\\C[2]' + court(b) + ' regarde ' + h.name() + ' faire « ' + a.item().name + ' ». Il retient.\\C[0]');
            }
        },
        degatsSortants: function (b, t, v, a) { return frappe(a) ? v * (1 + 0.25 * (b._gestes || []).length) : v; },
        apresFrappe: function (b) { b._gestes = []; },
        ligne: function (b) {
            var n = (b._gestes || []).length;
            return enCharge(b) ? 'Il apprend en te regardant : ' + n + ' geste(s), +' + (n * 25) + ' % — attaque simple ou défense' : 'Il copie ce que tu montres';
        }
    };

    //-------------------------------------------------------------------------
    // LA DOUBLURE, « celle qui a pris la place » — « Elle Choisit un Rôle :
    // Elle décide qui elle sera pour ce tour. »
    //-------------------------------------------------------------------------
    D.role = {
        charge: function (b) {
            b._role = auHasard(heros());
            if (b._role) dire('\\C[2]' + court(b) + ' choisit un rôle : elle est ' + b._role.name() + '. Ses coups à lui ne la touchent plus.\\C[0]');
        },
        degatsRecus: function (b, s, v) {
            if (enCharge(b) && s && s === vivant(b._role)) { dire(s.name() + ' se frappe lui-même — le coup passe à travers.'); return 0; }
            return v;
        },
        rompu: function (b) { b._role = null; },
        apresFrappe: function (b) { b._role = null; },
        ligne: function (b) { var r = vivant(b._role); return r && enCharge(b) ? 'Elle joue ' + r.name() + ' — ses coups la traversent' : 'Elle choisit un rôle'; }
    };

    //-------------------------------------------------------------------------
    // LA CANTATRICE BLANCHE — « Elle Prend Son Souffle : La salle devient
    // silencieuse. Trop silencieuse. »
    //-------------------------------------------------------------------------
    D.souffle = {
        scelle: function (b, h, skill) {
            return enCharge(b) && skill.hitType === 2 && skill.id !== h.attackSkillId() && skill.id !== h.guardSkillId();
        },
        charge: function (b) { dire('\\C[2]La salle devient silencieuse. Plus aucune magie ne sort.\\C[0]'); },
        ligne: function (b) { return enCharge(b) ? 'Silence — la magie se tait ; brise-la au corps' : 'Elle prend son souffle tous les trois tours'; }
    };

    //-------------------------------------------------------------------------
    // LE CONTRE-CHANT — « Dissonance Majeure : Les deux voix se cognent, et
    // tout ce qui est entre trinque. »
    //-------------------------------------------------------------------------
    function milieu() {
        var l = heros();
        return l.length > 2 ? l.slice(1, l.length - 1) : [];
    }
    D.entre = {
        charge: function (b) {
            var m = milieu();
            if (m.length) dire('\\C[2]Entre les deux voix : ' + noms(m) + '.\\C[0]');
        },
        degatsSortants: function (b, t, v, a) {
            if (!frappe(a)) return v;
            return milieu().indexOf(t) >= 0 ? v * 1.6 : v * 0.7;
        },
        ligne: function (b) { var m = milieu(); return enCharge(b) && m.length ? 'Entre les voix : ' + noms(m) + ' — ×1,6' : 'Ce qui est entre trinque'; }
    };

    //-------------------------------------------------------------------------
    // LE POINT FINAL — « Il Trempe la Plume : Il écrit quelque chose. Sur
    // toi. » · « Le Chapitre se Ferme : Ce qui est écrit s'applique. »
    //-------------------------------------------------------------------------
    D.plume = {
        charge: function (b) {
            b._plume = auHasard(heros());
            if (b._plume) dire('\\C[2]' + court(b) + ' écrit quelque chose. Sur ' + b._plume.name() + '.\\C[0]');
        },
        degatsSortants: function (b, t, v, a) {
            if (!frappe(a) || !vivant(b._plume)) return v;
            return t === b._plume ? v * 2 : v * 0.8;
        },
        rompu: function (b) { b._plume = null; dire('\\C[23]La plume se brise. Rien n\'est écrit.\\C[0]'); },
        apresFrappe: function (b) { b._plume = null; },
        ligne: function (b) { var p = vivant(b._plume); return p ? 'Il écrit sur ' + p.name() + ' — ×2 pour lui' : 'Il trempe la plume'; }
    };

    //-------------------------------------------------------------------------
    // L'ERRATA — « Il Relit : Il repasse sur ce que tu es. » · « Correction
    // Générale : Tout ce que tu avais gagné est barré d'un trait. »
    //-------------------------------------------------------------------------
    function bonus() {
        var n = 0;
        heros().forEach(function (h) { for (var i = 0; i < 8; i++) if (h.isBuffAffected(i)) n++; });
        return n;
    }
    D.rature = {
        frappe: function (b) {
            var n = 0;
            heros().forEach(function (h) { for (var i = 0; i < 8; i++) if (h.isBuffAffected(i)) { h.removeBuff(i); n++; } });
            if (n) dire('\\C[2]Correction : ' + n + ' bonus barré(s) d\'un trait.\\C[0]');
        },
        ligne: function (b) { return enCharge(b) ? 'Il relit — ' + bonus() + ' bonus seront barrés' : 'Tout ce que tu gagnes, il le rature'; }
    };

    //-------------------------------------------------------------------------
    // GRANDE GLACE — « La Surface se Tend : Tout ce que tu enverras va
    // revenir. » · « Renvoi Intégral : Il te rend exactement ce que tu lui
    // as donné. »
    //-------------------------------------------------------------------------
    D.tension = {
        rupture: function () { return false; },
        charge: function (b) { b._tension = 0; },
        touche: function (b, s, v) { if (s && s.isActor()) b._tension = (b._tension || 0) + v; },
        degatsSortants: function (b, t, v, a) {
            if (!frappe(a) || !b._tension) return v;
            var part = Math.floor(b._tension / Math.max(1, heros().length));
            return v + Math.min(part, Math.floor(t.mhp * 0.35));
        },
        apresFrappe: function (b) { b._tension = 0; },
        ligne: function (b) { return enCharge(b) ? 'La surface est tendue — elle rendra ' + (b._tension || 0) : 'Surface lisse'; }
    };

    //-------------------------------------------------------------------------
    // L'AUGURE — « Elle Annonce : Elle dit ce qui va arriver. Ça arrive. » ·
    // « Prophétie Accomplie : Ce qu'elle a annoncé se produit, à la lettre. »
    //-------------------------------------------------------------------------
    D.annonce = {
        charge: function (b) {
            b._annonce = auHasard(heros());
            if (b._annonce) dire('\\C[2]' + court(b) + ' annonce : « ' + b._annonce.name() + ' tombera. »\\C[0]');
        },
        inesquivable: function (b, a) { return frappe(a); },
        degatsSortants: function (b, t, v, a) {
            if (!frappe(a) || !vivant(b._annonce)) return v;
            return t === b._annonce ? v * 1.5 : v * 0.8;
        },
        rompu: function (b) { b._annonce = null; dire('\\C[23]La prophétie ment, pour une fois.\\C[0]'); },
        apresFrappe: function (b) { b._annonce = null; },
        ligne: function (b) { var x = vivant(b._annonce); return x ? 'Annoncé : ' + x.name() + ' — ça ne rate pas' : 'Elle voit la suite'; }
    };

    //-------------------------------------------------------------------------
    // LE GRAND IMMOBILE — « Il Lève le Bras : Il prend son temps. Tu as un
    // tour. Un seul. » · « Il Abat le Bras : exactement comme annoncé. »
    //-------------------------------------------------------------------------
    D.bras = {
        rupture: function () { return 0.5; },
        inesquivable: function (b, a) { return frappe(a); },
        degatsSortants: function (b, t, v, a) { return frappe(a) ? v * 1.25 : v; },
        ligne: function (b) { return enCharge(b) ? 'Le bras est levé — un tour, un seul, pour le rompre' : 'Il prend son temps'; }
    };

    //-------------------------------------------------------------------------
    // DEMERES — « Le Gel Monte : L'air se solidifie autour de tes pieds. »
    //-------------------------------------------------------------------------
    D.gel = {
        charge: function () { MB._paramActif = true; dire('\\C[2]Le gel monte. Vos pieds s\'alourdissent.\\C[0]'); },
        paramHeros: function (b, h, id) { return id === 6 && enCharge(b) ? 0.5 : 1; },
        ligne: function (b) { return enCharge(b) ? 'Le gel monte — votre vitesse est divisée par deux' : ''; }
    };

    //-------------------------------------------------------------------------
    // DYNAMO — « La Charge Monte : Tes cheveux se dressent. Bouge. »
    //-------------------------------------------------------------------------
    D.bouge = {
        charge: function (b) { b._bouge = []; },
        actionHeros: function (b, h, a) {
            if (!enCharge(b) || estGarde(a)) return;
            b._bouge = b._bouge || [];
            if (b._bouge.indexOf(h) < 0) b._bouge.push(h);
        },
        degatsSortants: function (b, t, v, a) {
            if (!frappe(a)) return v;
            return (b._bouge || []).indexOf(t) >= 0 ? v * 0.5 : v * 1.5;
        },
        apresFrappe: function (b) { b._bouge = []; },
        ligne: function (b) {
            if (!enCharge(b)) return '';
            var m = b._bouge || [];
            return 'BOUGE — qui agit prend moitié, qui reste prend ×1,5' + (m.length ? ' · ont bougé : ' + noms(m) : '');
        }
    };

    //-------------------------------------------------------------------------
    // VENTOSS — « L'Air se Creuse : Le vent tourne autour de lui, et vous
    // attire. »
    //-------------------------------------------------------------------------
    D.vent = {
        sansGarde: function (b, a) { return frappe(a); },
        inesquivable: function (b, a) { return frappe(a); },
        ligne: function (b) { return enCharge(b) ? 'Le vent vous attire — ni garde ni esquive contre la Bourrasque' : ''; }
    };

    //-------------------------------------------------------------------------
    // MIDAS TARDIF, « le roi qui a tout gardé » — « Éboulis de Fortune : Tout
    // son trésor lui tombe dessus. Et sur toi. »
    //-------------------------------------------------------------------------
    function poidsDeLOr() { return Math.min(0.4, $gameParty.gold() / 200000); }
    D.tresor = {
        frappe: function (b) {
            var x = Math.floor(b.mhp * 0.05);
            b.gainHp(-x);
            dire('\\C[23]Son trésor lui tombe dessus : ' + x + ' PV.\\C[0]');
        },
        degatsSortants: function (b, t, v, a) { return frappe(a) ? v * (1 + poidsDeLOr()) : v; },
        ligne: function (b) { return 'Il compte — votre or pèse +' + pct(poidsDeLOr()) + ' sur l\'éboulis'; }
    };

    //-------------------------------------------------------------------------
    // LE SANS-PRIX — « Les Plaques se Serrent : Il se ferme complètement.
    // Cherche l'interstice. »
    //-------------------------------------------------------------------------
    function elementsDuGroupe() {
        var el = [];
        heros().forEach(function (h) {
            h.attackElements().forEach(function (e) { if (e > 0 && el.indexOf(e) < 0) el.push(e); });
            h.skills().forEach(function (s) {
                var e = s.damage && s.damage.type > 0 ? s.damage.elementId : 0;
                if (e > 0 && el.indexOf(e) < 0) el.push(e);
            });
        });
        return el.length ? el : [1];
    }
    function nomElement(e) { return ($dataSystem.elements[e] || '?').replace(/\\C\[\d+\]/g, ''); }
    function elementsDe(a) {
        var e = a.item().damage.elementId;
        return e < 0 ? a.subject().attackElements() : [e];
    }
    D.interstice = {
        rupture: function () { return false; },
        charge: function (b) {
            b._interstice = auHasard(elementsDuGroupe());
            dire('\\C[2]Les plaques se serrent. Un seul élément passe — cherche-le.\\C[0]');
        },
        degatsRecus: function (b, s, v, a) {
            if (!enCharge(b) || !a) return v;
            if (elementsDe(a).indexOf(b._interstice) >= 0) {
                MB.rompre(b, 'l\'interstice était ' + nomElement(b._interstice));
                return v * 2;
            }
            return v * 0.15;
        },
        apresFrappe: function (b) { if (b._interstice) dire('L\'interstice était : ' + nomElement(b._interstice) + '.'); },
        ligne: function (b) { return enCharge(b) ? 'Plaques serrées — ×0,15 · un seul élément passe (×2 et rupture)' : 'Le coffre qu\'on n\'a jamais pu ouvrir'; }
    };

    //-------------------------------------------------------------------------
    // LE CONSENTI — « Il Se Souvient de Toi : Une seconde, il redevient
    // quelqu'un. » · « Ce Qu'il A Accepté : Tout ce qu'il a laissé entrer sort
    // d'un coup. »
    //-------------------------------------------------------------------------
    D.accepte = {
        etatRecu: function (b, id) {
            if (id === CHARGE || id === SURCHARGE || id === b.deathStateId()) return;
            b._entres = b._entres || [];
            if (b._entres.indexOf(id) < 0) b._entres.push(id);
        },
        degatsRecus: function (b, s, v) { return enCharge(b) ? v * 1.3 : v; },
        frappe: function (b) {
            var sortis = (b._entres || []).filter(function (id) { return b.isStateAffected(id); });
            b._entres = [];
            if (!sortis.length) return;
            sortis.forEach(function (id) {
                b.removeState(id);
                heros().forEach(function (h) { h.addState(id); });
            });
            dire('\\C[2]Tout ce qu\'il a laissé entrer ressort : ' + sortis.map(function (id) { return $dataStates[id].name; }).join(', ') + '.\\C[0]');
        },
        ligne: function (b) {
            var n = (b._entres || []).filter(function (id) { return b.isStateAffected(id); }).length;
            return (enCharge(b) ? 'Il redevient quelqu\'un — dégâts ×1,3' : 'Il accepte tout') + (n ? ' · ' + n + ' état(s) ressortiront' : '');
        }
    };
})();
