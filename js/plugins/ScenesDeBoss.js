//=============================================================================
// ScenesDeBoss.js — v1.0
// RPG Maker MV
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le combat de boss se VOIT : carte-titre, barre du boss,
 * bandeaux de mise en garde, et la RUPTURE — briser son élan annule sa frappe.
 * @author pour JOKO
 *
 * @param etatCharge
 * @text État « ⚡ Charge »
 * @type state
 * @default 207
 *
 * @param etatSurcharge
 * @text État « ✷ Surcharge »
 * @type state
 * @default 218
 *
 * @param rupture
 * @text Rupture de la charge
 * @type boolean
 * @on oui
 * @off non
 * @default true
 * @desc Pendant ⚡ Charge, assez de dégâts brisent l'élan : la frappe n'a pas lieu et le boss passe à découvert.
 *
 * @param seuilRupture
 * @text Seuil de rupture (% PV max)
 * @type number
 * @decimals 1
 * @default 6
 * @desc Dégâts à infliger pendant la Charge, en % des PV max du boss, pour briser l'élan.
 *
 * @param animRupture
 * @text Animation de la rupture
 * @type animation
 * @default 429
 *
 * @param animDecouvert
 * @text Animation « à découvert »
 * @type animation
 * @default 364
 *
 * @param carteTitre
 * @text Carte-titre au début du combat
 * @type boolean
 * @default true
 *
 * @param barre
 * @text Barre du boss
 * @type boolean
 * @default true
 *
 * @param bandeaux
 * @text Bandeaux de mise en garde
 * @type boolean
 * @default true
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  CE QUI MANQUAIT AUX COMBATS DE BOSS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Les 41 boss ont un rythme écrit par JOKO : une mise en garde (⚡ Charge),
 *  une grosse frappe, puis une fenêtre (✷ Surcharge). Trois choses le
 *  rendaient invisible ou subi :
 *
 *  1 · RIEN NE SE VOYAIT. La mise en garde tenait dans une ligne de journal
 *      et une icône de 32 pixels. Les compteurs des mécaniques (la Dîme, le
 *      Compte, la Chaleur…) n'existaient que dans le code.
 *      → Une barre du boss, en bas du champ, montre ses PV, son état et sa
 *        mécanique. Un bandeau annonce chaque mise en garde avec le nom de la
 *        compétence et SA description — les phrases de JOKO (« Il a trouvé
 *        ton odeur. Il ne la perdra plus. ») deviennent l'avertissement.
 *
 *  2 · LE JOUEUR NE POUVAIT RIEN CONTRE LA FRAPPE. « Il est à découvert »,
 *      dit la Charge — mais être à découvert ne servait qu'à prendre un peu
 *      plus de dégâts. La frappe partait toujours.
 *      → LA RUPTURE : pendant la Charge, si le groupe inflige assez de dégâts
 *        (seuilRupture % des PV max), l'élan se brise. La frappe n'a pas
 *        lieu, le boss tombe en ✷ Surcharge. La jauge est dans la barre.
 *        Certains boss y échappent parce que leur texte le dit — la Mèche de
 *        Fournaise (« C'est tout ce que tu peux faire »), la Main de la Veuve
 *        (« Ne la prends pas »), la Surface de Grande Glace (« Tout ce que tu
 *        enverras va revenir »).
 *
 *  3 · LE COMBAT COMMENÇAIT COMME UN AUTRE. → Une carte-titre : « GARGAL —
 *      le Premier Croc », le nom et l'épithète que JOKO a écrits.
 *
 *  LE REGISTRE DES MÉCANIQUES
 *
 *  window.MecaBoss sert de point de rencontre : MecaniquesDeBossSuite y
 *  déclare ses mécaniques, la barre y lit leur état. Rien ici ne décide d'un
 *  combat à part la rupture ; tout le reste est affichage.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    var P = PluginManager.parameters('ScenesDeBoss');
    var CHARGE = Number(P['etatCharge'] || 207);
    var SURCHARGE = Number(P['etatSurcharge'] || 218);
    var RUPTURE = String(P['rupture'] || 'true') !== 'false';
    var SEUIL = Number(P['seuilRupture'] || 6) / 100;
    var ANIM_RUPTURE = Number(P['animRupture'] || 429);
    var ANIM_DECOUVERT = Number(P['animDecouvert'] || 364);
    var TITRE = String(P['carteTitre'] || 'true') !== 'false';
    var BARRE = String(P['barre'] || 'true') !== 'false';
    var BANDEAUX = String(P['bandeaux'] || 'true') !== 'false';

    //=========================================================================
    // LE REGISTRE
    //=========================================================================
    var MB = window.MecaBoss = window.MecaBoss || {};
    MB.defs = MB.defs || {};
    MB.table = MB.table || {};
    MB.charge = CHARGE;
    MB.surcharge = SURCHARGE;
    MB._bannieres = [];

    function ennemi(b) { return b && b.isEnemy && b.isEnemy() && b.enemy ? b.enemy() : null; }

    MB.estBoss = function (b) {
        var e = ennemi(b);
        if (!e || !e.meta) return false;
        return !!(e.meta.Boss || e.meta.Mahoraga || e.meta.DonoBoss || e.meta.Radahn);
    };
    MB.cle = function (b) {
        var e = ennemi(b);
        if (!e) return null;
        if (e._cleMeca === undefined) {
            var m = /<\s*MecaBoss\s*:\s*([^>]+)>/i.exec(e.note || '');
            e._cleMeca = m ? m[1].trim().toLowerCase() : (MB.table[e.id] || null);
        }
        return e._cleMeca;
    };
    MB.def = function (b) {
        var c = MB.cle(b);
        return c ? MB.defs[c] || null : null;
    };
    /** Appelle une accroche de la mécanique du boss, sans jamais figer le combat. */
    MB.appel = function (b, nom) {
        var d = MB.def(b);
        if (!d || typeof d[nom] !== 'function') return undefined;
        try {
            return d[nom].apply(d, [b].concat(Array.prototype.slice.call(arguments, 2)));
        } catch (e) {
            console.error('MecaBoss ' + MB.cle(b) + '.' + nom + ' :', e);
            return undefined;
        }
    };
    MB.bossDuCombat = function () {
        if (!$gameTroop || !$gameParty.inBattle()) return [];
        return $gameTroop.members().filter(function (m) { return m.isAlive() && MB.estBoss(m); });
    };
    MB.avecMeca = function () {
        if (!$gameTroop || !$gameParty.inBattle()) return [];
        return $gameTroop.members().filter(function (m) { return m.isAlive() && MB.def(m); });
    };
    MB.heros = function () { return $gameParty ? $gameParty.aliveMembers() : []; };
    MB.auHasard = function (l) { return l.length ? l[Math.floor(Math.random() * l.length)] : null; };
    MB.dire = function (texte) {
        var w = BattleManager._logWindow;
        if (w && w.push) { w.push('addText', texte); w.push('wait'); }
        MB.bandeauDuJournal(texte);
    };
    MB.banniere = function (titre, sous, couleur) {
        if (!BANDEAUX) return;
        // le plugin pose son propre bandeau pour ce moment : la ligne de journal du même instant s'efface
        var f = Graphics.frameCount;
        MB._bannieres = MB._bannieres.filter(function (b) { return !(b.type === 'journal' && b.frame === f); });
        MB._bannieres.push({ titre: titre, sous: sous || '', couleur: couleur || '#ffffff', type: 'bandeau' });
    };
    /**
     * Le journal est muet en vue de côté (SimpleMsgSideView ne garde aucune ligne) : ce que les boss, les
     * ennemis et les dons y écrivent passe aussi en bandeau (JOKO, 2026-10-23 : « OUI A TOUT »). Le texte
     * est celui du plugin, sans ses codes ; sa couleur, celle de son premier \C[n]. Trop long, il se coupe
     * à sa première pause (« . », « — », « : », « … ») : le titre, puis la suite.
     */
    MB.bandeauDuJournal = function (texte) {
        if (!BANDEAUX || !texte || !$gameParty || !$gameParty.inBattle()) return;
        var t = String(texte), m = /\\C\[(\d+)\]/i.exec(t), couleur = '#ffffff';
        var w = SceneManager._scene && SceneManager._scene._logWindow;
        if (m && w && w.textColor && Number(m[1]) > 0) { try { couleur = w.textColor(Number(m[1])); } catch (e) {} }
        t = t.replace(/\\[A-Za-z]+\[[^\]]*\]/g, '').replace(/\\[{}|.!<>^$]/g, '').replace(/\s+/g, ' ').trim();
        if (!t) return;
        var titre = t, sous = '';
        if (t.length > 40) {
            var r = /^(.{8,52}?(?:\.|…|!|—|:))\s+(.+)$/.exec(t);
            if (r) { titre = r[1].replace(/\s*[—:]$/, ''); sous = r[2]; }
        }
        MB._bannieres.push({ titre: titre, sous: sous, couleur: couleur, type: 'journal', frame: Graphics.frameCount });
    };
    MB.anim = function (b, id) { if (b && id > 0 && $dataAnimations[id]) b.startAnimation(id, false, 0); };
    MB.enCharge = function (b) { return b.isStateAffected(CHARGE); };

    // L'étiquette de la compétence en cours, lue une fois
    function etiquette(item, nom) {
        if (!item || !item.note) return false;
        item._etiq = item._etiq || {};
        if (item._etiq[nom] === undefined) {
            item._etiq[nom] = nom === 'Apres'
                ? /<\s*Apres\s*:\s*surcharge\s*>/i.test(item.note)
                : new RegExp('<\\s*' + nom + '\\s*>', 'i').test(item.note);
        }
        return item._etiq[nom];
    }
    MB.estTelegraphe = function (item) { return etiquette(item, 'Telegraphe'); };
    MB.estFrappe = function (item) { return etiquette(item, 'Apres'); };

    function desc(item) {
        return item && item.description ? item.description.replace(/\s*\n\s*/g, ' ').trim() : '';
    }

    //=========================================================================
    // LA CHARGE : début, et la RUPTURE
    //=========================================================================
    MB.seuilRupture = function (b) {
        var mult = MB.appel(b, 'rupture');          // false = insécable, nombre = multiplicateur
        if (mult === false) return 0;
        if (typeof mult !== 'number') mult = 1;
        return Math.max(1, Math.floor(b.mhp * SEUIL * mult));
    };
    MB.secable = function (b) { return RUPTURE && MB.seuilRupture(b) > 0; };

    function debutCharge(b) {
        b._rupture = 0;
        b._ruptureSeuil = MB.seuilRupture(b);
        var act = BattleManager._action;
        var item = act && act.subject && act.subject() === b ? act.item() : null;
        b._chargeNom = item ? item.name : '⚡ Charge';
        if (MB.estBoss(b)) {
            var s = desc(item);
            var aide = b._ruptureSeuil && RUPTURE
                ? 'Brise son élan : ' + b._ruptureSeuil + ' dégâts avant qu\'il frappe.'
                : 'Son élan ne se brise pas.';
            MB.banniere('⚡ ' + b._chargeNom, (s ? s + '  ·  ' : '') + aide, '#ff8a3d');
        }
        MB.appel(b, 'charge', item);
    }

    MB.rompre = function (b, pourquoi) {
        if (!b || !b.isAlive() || !b.isStateAffected(CHARGE)) return false;
        b._rupturee = (b._rupturee || 0) + 1;
        b._ruptureEnCours = true;
        b.removeState(CHARGE);
        b.clearActions();
        b.addState(SURCHARGE);
        b._ruptureEnCours = false;
        MB.anim(b, ANIM_RUPTURE);
        AudioManager.playSe({ name: 'Break', volume: 90, pitch: 90, pan: 0 });
        $gameScreen.startShake(6, 8, 18);
        MB.dire('\\C[17]✦ RUPTURE ! ' + b.name() + ' perd son élan' + (pourquoi ? ' — ' + pourquoi : '') + '.\\C[0]');
        MB.banniere('✦ RUPTURE', b.name() + ' perd son élan : la frappe n\'aura pas lieu. Frappe maintenant.', '#ffe066');
        MB.appel(b, 'rompu');
        return true;
    };

    var _addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        var avant = this.isStateAffected(stateId);
        _addState.call(this, stateId);
        if (avant || !this.isEnemy() || !this.isStateAffected(stateId)) return;
        try {
            var qui = BattleManager._subject;
            if (qui && qui.isActor && qui.isActor() && MB.def(this)) MB.appel(this, 'etatRecu', stateId, qui);
            if (stateId === CHARGE) debutCharge(this);
            else if (stateId === SURCHARGE && MB.estBoss(this)) {
                // Pendant sa propre frappe, BossTelegraphe le met à découvert
                // AVANT les dégâts : le bandeau attend la fin du coup.
                if (BattleManager._subject === this && !this._ruptureEnCours) {
                    this._decouvertDiffere = true;
                } else if (!this._ruptureEnCours) {
                    annoncerDecouvert(this);
                }
            }
        } catch (e) { console.error('ScenesDeBoss :', e); }
    };

    function annoncerDecouvert(b) {
        MB.anim(b, ANIM_DECOUVERT);
        var st = $dataStates[SURCHARGE];
        var s = st && st.meta && st.meta.Desc ? String(st.meta.Desc).trim() : 'C\'est maintenant qu\'il faut frapper.';
        MB.banniere('✷ ' + b.name().split(',')[0] + ' est à découvert', s, '#ffd24d');
    }

    // Les dégâts reçus pendant la Charge remplissent la jauge de rupture
    var _executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function (target, value) {
        _executeHpDamage.call(this, target, value);
        try {
            if (value > 0 && target.isEnemy() && target.isAlive() && target.isStateAffected(CHARGE)) {
                var s = this.subject();
                MB.appel(target, 'touche', s, value, this);
                if (RUPTURE && s && s.isActor() && target._ruptureSeuil > 0 && target.isStateAffected(CHARGE)) {
                    target._rupture = (target._rupture || 0) + value;
                    if (target._rupture >= target._ruptureSeuil) MB.rompre(target);
                }
            }
        } catch (e) { console.error('ScenesDeBoss :', e); }
    };

    //=========================================================================
    // LES ACCROCHES DES MÉCANIQUES
    //=========================================================================
    // Une fois par action — avant les dégâts.
    var _applyGlobal = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function () {
        _applyGlobal.call(this);
        try {
            var s = this.subject(), item = this.item();
            if (!s || !item) return;
            if (s.isEnemy() && MB.def(s)) {
                if (MB.estFrappe(item)) { s._frappeEnCours = true; MB.appel(s, 'frappe', this); }
                else MB.appel(s, 'action', this);
            } else if (s.isActor()) {
                var me = this;
                MB.avecMeca().forEach(function (b) { MB.appel(b, 'actionHeros', s, me); });
            }
        } catch (e) { console.error('ScenesDeBoss :', e); }
    };

    var _endAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        var s = this._subject;
        _endAction.call(this);
        try {
            if (s && s.isEnemy && s.isEnemy()) {
                if (s._frappeEnCours) { s._frappeEnCours = false; MB.appel(s, 'apresFrappe'); }
                if (s._decouvertDiffere) {
                    s._decouvertDiffere = false;
                    if (s.isAlive() && s.isStateAffected(SURCHARGE)) annoncerDecouvert(s);
                }
            }
        } catch (e) { console.error('ScenesDeBoss :', e); }
    };

    var _startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        try { MB.avecMeca().forEach(function (b) { MB.appel(b, 'debutTour'); }); }
        catch (e) { console.error('ScenesDeBoss :', e); }
        _startTurn.call(this);
    };

    // Dégâts : sortants (le boss frappe) puis reçus (on frappe le boss)
    var _makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var v = _makeDamageValue.call(this, target, critical);
        try {
            var s = this.subject();
            if (v > 0 && s && s.isEnemy() && MB.def(s)) {
                var r = MB.appel(s, 'degatsSortants', target, v, this);
                if (typeof r === 'number') v = Math.max(0, Math.floor(r));
            }
            if (v > 0 && target.isEnemy() && MB.def(target)) {
                var r2 = MB.appel(target, 'degatsRecus', s, v, this);
                if (typeof r2 === 'number') v = Math.max(0, Math.floor(r2));
            }
        } catch (e) { console.error('ScenesDeBoss :', e); }
        return v;
    };

    // Un bouclier qui absorbe avant les PV
    var _executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        try {
            if (value > 0 && target.isEnemy() && MB.def(target)) {
                var r = MB.appel(target, 'absorbe', value, this);
                if (typeof r === 'number') value = Math.max(0, Math.floor(r));
            }
        } catch (e) { console.error('ScenesDeBoss :', e); }
        _executeDamage.call(this, target, value);
    };

    var _numRepeats = Game_Action.prototype.numRepeats;
    Game_Action.prototype.numRepeats = function () {
        var n = _numRepeats.call(this);
        var s = this.subject();
        if (s && s.isEnemy() && MB.def(s)) {
            var k = MB.appel(s, 'repetitions', this);
            if (typeof k === 'number' && k >= 1) n = n * Math.floor(k);
        }
        return n;
    };

    function inesquivable(action, target) {
        var s = action.subject();
        return !!(s && s.isEnemy() && MB.def(s) && MB.appel(s, 'inesquivable', action, target));
    }
    var _itemHit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function (target) {
        if (inesquivable(this, target)) return 1;
        return _itemHit.call(this, target);
    };
    var _itemEva = Game_Action.prototype.itemEva;
    Game_Action.prototype.itemEva = function (target) {
        if (inesquivable(this, target)) return 0;
        return _itemEva.call(this, target);
    };

    // Une frappe à cible unique peut être dirigée (« Il a écrit un nom »)
    var _makeTargets = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function () {
        var t = _makeTargets.call(this);
        try {
            var s = this.subject();
            if (s && s.isEnemy() && MB.def(s) && this.isForOpponent() && this.isForOne() && !this.isForRandom()) {
                var c = MB.appel(s, 'cible', this);
                if (c && c.isAlive && c.isAlive()) return [c];
            }
        } catch (e) { console.error('ScenesDeBoss :', e); }
        return t;
    };
    var _applyGuard = Game_Action.prototype.applyGuard;
    Game_Action.prototype.applyGuard = function (damage, target) {
        var s = this.subject();
        if (s && s.isEnemy() && MB.def(s) && MB.appel(s, 'sansGarde', this, target)) return damage;
        return _applyGuard.call(this, damage, target);
    };

    // Une compétence de héros scellée par un boss
    var _meetsSkill = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
        if (!_meetsSkill.call(this, skill)) return false;
        if (this.isActor() && $gameParty.inBattle() && skill) {
            var moi = this;
            return !MB.avecMeca().some(function (b) { return MB.appel(b, 'scelle', moi, skill) === true; });
        }
        return true;
    };

    // Un multiplicateur de stat sur les héros (le gel, par exemple)
    var _paramRate = Game_BattlerBase.prototype.paramRate;
    Game_BattlerBase.prototype.paramRate = function (paramId) {
        var r = _paramRate.call(this, paramId);
        if (this.isActor && this.isActor() && MB._paramActif && $gameParty.inBattle()) {
            var moi = this;
            MB.avecMeca().forEach(function (b) {
                var k = MB.appel(b, 'paramHeros', moi, paramId);
                if (typeof k === 'number') r *= k;
            });
        }
        return r;
    };
    MB._paramActif = false;   // une mécanique l'allume quand elle en a besoin

    //=========================================================================
    // CE QUE LA BARRE DIT DES AUTRES GREFFONS
    //=========================================================================
    function note(b, nom) {
        var e = ennemi(b);
        if (!e) return null;
        var m = new RegExp('<\\s*' + nom + '\\s*(?::([^>]*))?>', 'i').exec(e.note || '');
        if (!m) return null;
        return m[1] === undefined ? [] : m[1].split(',').map(function (x) { return parseFloat(x.trim()); });
    }

    MB.ligne = function (b) {
        var l = MB.appel(b, 'ligne');
        if (l) return l;
        var e = ennemi(b);
        if (!e) return '';
        var m = e.meta || {};
        var a;
        if (m.Mahoraga) {
            var n = b._mSkills ? Object.keys(b._mSkills).filter(function (k) { return b._mSkills[k] >= 1; }).length : 0;
            var st = b._mStates ? b._mStates.length : 0;
            return '☸ La Roue a tourné ' + (n + st) + ' fois · Rage ' + (b._mRage || 0) + ' %' + (b._mBerserk ? ' · INSTINCT' : '');
        }
        if (m.DonoBoss) {
            var ph = ['', 'Empathie', 'Sérieux', 'Synchronisation', 'MANA PARFAIT'][b._donoPhase || 1];
            var k = b._kamuiOverload > 0 ? 'Yeux surchargés : ' + b._kamuiOverload + ' tour(s)'
                : (b._kamuiMat === false ? 'Kamui — intangible' : 'Matérialisé — frappe !');
            var esp = $gameTroop.members().filter(function (x) { return ennemi(x) && ennemi(x).meta.DonoEsprit; })[0];
            var es = esp ? (esp.isAlive() ? ' · Esprit debout' : ' · Esprit abattu') : '';
            return ph + ' · ' + k + es;
        }
        if ((a = note(b, 'MecaDime'))) return b._dimeCible ? 'Dîme de ' + b._dimeCible.name() + ' : ' + b._dimeTours + ' tour(s)' : 'Le registre est fermé';
        if ((a = note(b, 'MecaCompteARebours'))) return 'Compte : ' + (b._compte === undefined ? (a[0] || 5) : b._compte);
        if ((a = note(b, 'MecaChaleur'))) return 'Chaleur ' + (b._chaleur || 0) + ' / ' + (a[0] || 6);
        if ((a = note(b, 'MecaMiroir'))) return b._miroirBrise ? 'Fendu : ' + b._miroirBrise + ' tour(s) — plus rien ne revient' : 'Surface lisse — renvoie ' + (a[0] || 35) + ' % · un grand coup la brise';
        if ((a = note(b, 'MecaSansVisage'))) return b._visageDe ? 'Porte le visage de ' + b._visageDe.name() : 'Sans visage';
        if ((a = note(b, 'MecaReprises'))) return 'Reprise ' + ((b._reprises || 0) + 1) + ' / ' + ((a[0] || 0) + 1);
        if ((a = note(b, 'MecaGueules'))) return 'Gueules ouvertes : ' + Math.max(1, Math.ceil(b.hpRate() * (a[0] || 5)));
        if ((a = note(b, 'MecaCarapace'))) return b.isStateAffected(CHARGE) ? 'Rétracté — seule la magie passe' : 'Carapace ouverte';
        if ((a = note(b, 'MecaRetournement'))) return b.isStateAffected(CHARGE) ? 'Tête rentrée — dégâts ÷3' : (b.isStateAffected(SURCHARGE) ? 'SUR LE DOS — dégâts ×2' : 'Carapace');
        if ((a = note(b, 'MecaNom'))) {
            var pris = MB.heros().filter(function (h) { return h._nomPris; })[0];
            return pris ? pris.name() + ' a perdu son nom — frappe à moitié' : 'Il cherche un nom';
        }
        if ((a = note(b, 'MecaNombre'))) return 'Petits en nombre : +' + Math.floor((a[0] || 120) * (1 - b.hpRate())) + ' %';
        if ((a = note(b, 'MecaMaree'))) return b.isStateAffected(CHARGE) ? 'L\'eau s\'est retirée — rien ne couvre' : 'Sous le lac';
        if ((a = note(b, 'MecaRecompile'))) return 'Recompilé — ses faiblesses ont changé';
        if ((a = note(b, 'MecaPonte'))) {
            var dort = $gameTroop.members().filter(function (x) { return x !== b && !x.isAppeared(); }).length;
            return 'Œufs : ' + dort;
        }
        if (m.Radahn) return b.hpRate() > 0.5 ? 'Armure gravitationnelle' : (b._radahnMeteor ? 'PLUIE DE MÉTÉORES' : 'Armure rompue');
        return '';
    };

    //=========================================================================
    // L'AFFICHAGE
    //=========================================================================
    function Sprite_BarreBoss() { this.initialize.apply(this, arguments); }
    Sprite_BarreBoss.prototype = Object.create(Sprite.prototype);
    Sprite_BarreBoss.prototype.constructor = Sprite_BarreBoss;
    Sprite_BarreBoss.prototype.initialize = function () {
        Sprite.prototype.initialize.call(this);
        this._w = Math.floor(Graphics.boxWidth * 0.66);
        this._h = 60;
        this.bitmap = new Bitmap(this._w, this._h);
        this.x = Math.floor((Graphics.boxWidth - this._w) / 2);
        this._cle = '';
        this._affiche = 1;
        this._boss = null;
        this.opacity = 0;
    };
    Sprite_BarreBoss.prototype.update = function () {
        Sprite.prototype.update.call(this);
        var liste = MB.bossDuCombat();
        var b = liste.filter(function (x) { return !(ennemi(x).meta.DonoEsprit && !ennemi(x).meta.DonoBoss); })[0] || liste[0];
        if (b !== this._boss) { this._boss = b; this._affiche = b ? b.hpRate() : 1; }
        var cible = b && b.isAppeared() ? 255 : 0;
        this.opacity += (cible - this.opacity) * 0.15;
        if (!b) return;
        // En haut : le bas du champ est déjà pris par les jauges de Vesper et
        // d'Aël. Le journal de combat descend d'autant (voir Scene_Battle).
        this.y = 2;
        var vrai = b.hpRate();
        if (this._affiche > vrai) this._affiche = Math.max(vrai, this._affiche - 0.006);
        else this._affiche = vrai;
        var clignote = Math.floor(Graphics.frameCount / 20) % 2;
        var cle = [b.name(), b.hp, Math.round(this._affiche * 400), b._rupture, b._ruptureSeuil,
            b.isStateAffected(CHARGE), b.isStateAffected(SURCHARGE), clignote, MB.ligne(b)].join('|');
        if (cle !== this._cle) { this._cle = cle; this.dessiner(b); }
    };
    Sprite_BarreBoss.prototype.dessiner = function (b) {
        var bm = this.bitmap, w = this._w;
        bm.clear();
        bm.fillRect(0, 0, w, this._h, 'rgba(0,0,0,0.62)');
        bm.fillRect(0, 0, w, 1, 'rgba(255,255,255,0.25)');
        var nom = b.name().split(',');
        bm.fontSize = 19; bm.fontBold = true; bm.textColor = '#ffffff';
        bm.outlineWidth = 3;
        bm.drawText(nom[0].trim(), 10, 2, w * 0.6, 22, 'left');
        bm.fontBold = false; bm.fontSize = 15; bm.textColor = '#c9c9c9';
        if (nom[1]) bm.drawText(nom[1].trim(), 10 + Math.min(w * 0.45, bm.measureTextWidth(nom[0]) * 1.3 + 12), 4, w * 0.5, 20, 'left');
        bm.fontSize = 15; bm.textColor = '#ffffff';
        bm.drawText(Math.ceil(b.hpRate() * 100) + ' %', w - 110, 3, 100, 20, 'right');
        // la barre de PV, avec la trace des dégâts qui s'efface
        var bx = 10, by = 25, bw = w - 20, bh = 9;
        bm.fillRect(bx - 1, by - 1, bw + 2, bh + 2, '#000000');
        bm.fillRect(bx, by, bw, bh, '#2a1414');
        bm.fillRect(bx, by, Math.floor(bw * this._affiche), bh, '#e8c070');
        bm.gradientFillRect(bx, by, Math.floor(bw * b.hpRate()), bh, '#8a1010', '#d23a2a');
        // la ligne d'état
        var y2 = 37, txt = '', col = '#dddddd';
        var charge = b.isStateAffected(CHARGE), sur = b.isStateAffected(SURCHARGE);
        bm.fontSize = 15;
        if (charge) {
            col = '#ff9a4d';
            txt = '⚡ ' + (b._chargeNom || 'Charge');
            if (RUPTURE && b._ruptureSeuil > 0) {
                var gw = 120, gx = w - gw - 12, r = Math.min(1, (b._rupture || 0) / b._ruptureSeuil);
                bm.fillRect(gx - 1, y2 + 5, gw + 2, 10, '#000000');
                bm.fillRect(gx, y2 + 6, gw, 8, '#3a2a10');
                bm.fillRect(gx, y2 + 6, Math.floor(gw * r), 8, '#ffcc33');
                bm.textColor = '#ffe9a8';
                bm.drawText('RUPTURE', gx - 80, y2, 74, 20, 'right');
            } else {
                bm.textColor = '#bbbbbb';
                bm.drawText('insécable', w - 130, y2, 118, 20, 'right');
            }
        } else if (sur) {
            col = (Graphics.frameCount / 20 | 0) % 2 ? '#ffe066' : '#ffffff';
            txt = '✷ À DÉCOUVERT — frappe !';
        }
        var meca = MB.ligne(b);
        if (meca) txt = txt ? txt + '   ·   ' + meca : meca;
        bm.textColor = col;
        bm.drawText(txt, 10, y2, charge ? (RUPTURE && b._ruptureSeuil > 0 ? w - 230 : w - 150) : w - 20, 20, 'left');
    };

    function Sprite_Bandeau() { this.initialize.apply(this, arguments); }
    Sprite_Bandeau.prototype = Object.create(Sprite.prototype);
    Sprite_Bandeau.prototype.constructor = Sprite_Bandeau;
    Sprite_Bandeau.prototype.initialize = function () {
        Sprite.prototype.initialize.call(this);
        this.bitmap = new Bitmap(Graphics.boxWidth, 110);
        this.y = Math.floor(Graphics.boxHeight * 0.16);
        this._t = 0; this._duree = 0; this.opacity = 0;
    };
    Sprite_Bandeau.prototype.montrer = function (b) {
        var bm = this.bitmap, w = bm.width, titre = b.type === 'titre';
        bm.clear();
        var h = titre ? 110 : 84, y0 = Math.floor((110 - h) / 2);
        for (var i = 0; i < h; i++) {
            var a = 0.72 * Math.sin(Math.PI * i / h);
            bm.fillRect(0, y0 + i, w, 1, 'rgba(0,0,0,' + a.toFixed(3) + ')');
        }
        bm.fillRect(w * 0.15, y0 + 6, w * 0.7, 1, b.couleur);
        bm.fillRect(w * 0.15, y0 + h - 7, w * 0.7, 1, b.couleur);
        bm.outlineWidth = 4;
        bm.fontBold = true;
        // une ligne de journal longue garde sa place en rapetissant un peu (drawText la serrerait)
        bm.fontSize = titre ? 40 : (b.titre.length > 46 ? 20 : (b.titre.length > 36 ? 24 : 28));
        bm.textColor = b.couleur;
        bm.drawText(b.titre, 0, y0 + (titre ? 14 : 10), w, titre ? 48 : 36, 'center');
        bm.fontBold = false;
        bm.fontItalic = true;
        bm.fontSize = titre ? 22 : 17;
        bm.textColor = '#f2f2f2';
        bm.drawText(b.sous, 20, y0 + (titre ? 62 : 46), w - 40, 26, 'center');
        bm.fontItalic = false;
        this._t = 0;
        this._duree = titre ? 150 : (b.type === 'journal' ? 90 : 110);
    };
    Sprite_Bandeau.prototype.update = function () {
        Sprite.prototype.update.call(this);
        if (this._t >= this._duree) {
            this.opacity = 0;
            if (MB._bannieres.length) this.montrer(MB._bannieres.shift());
            return;
        }
        this._t++;
        var t = this._t, d = this._duree;
        this.opacity = t < 12 ? 255 * t / 12 : (t > d - 20 ? 255 * (d - t) / 20 : 255);
        this.x = t < 12 ? (12 - t) * 6 : 0;
    };
    MB.occupe = function () { return MB._bannieres.length > 0; };

    var _createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
    Scene_Battle.prototype.createDisplayObjects = function () {
        _createDisplayObjects.call(this);
        MB._bannieres = [];
        if (BARRE) {
            this._barreBoss = new Sprite_BarreBoss();
            this.addChildAt(this._barreBoss, this.children.indexOf(this._windowLayer));
        }
        this._bandeauBoss = new Sprite_Bandeau();
        this.addChild(this._bandeauBoss);
    };

    // Le journal descend sous la barre tant qu'elle est là
    var _update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        _update.call(this);
        var w = this._logWindow, b = this._barreBoss;
        if (!w || !b) return;
        if (this._logY === undefined) this._logY = w.y;
        w.y = b.opacity > 10 ? b.y + b._h + 2 : this._logY;
    };

    var _start = Scene_Battle.prototype.start;
    Scene_Battle.prototype.start = function () {
        _start.call(this);
        if (!TITRE) return;
        var b = MB.bossDuCombat()[0];
        if (b) {
            var nom = b.name().split(',');
            MB._bannieres.unshift({
                titre: nom[0].trim().toUpperCase(), sous: (nom[1] || '').trim(),
                couleur: '#e8c070', type: 'titre'
            });
        }
    };

    // Pour les bancs
    MB.Sprite_BarreBoss = Sprite_BarreBoss;
    MB.Sprite_Bandeau = Sprite_Bandeau;
})();
