//=============================================================================
// RapportDeCombat.js
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le rapport du combat, sur l'écran de victoire : les
 * tours, la durée, et pour chaque héros ses dégâts, ses soins, son meilleur coup.
 * @author Projet Trois Sources
 *
 * @param titre
 * @text Titre de l'écran
 * @default Rapport du combat
 *
 * @param toursMin
 * @text À partir de combien de tours
 * @desc Le rapport ne s'affiche que si le combat a duré au moins autant de tours. 1 = toujours. 0 = jamais (les chiffres sont quand même comptés).
 * @type number
 * @min 0
 * @default 1
 *
 * @param records
 * @text Garder les records
 * @desc Le plus gros coup de la partie est retenu (dans la sauvegarde) ; le rapport dit quand il est battu.
 * @type boolean
 * @default true
 *
 * @param etatBrise
 * @text État « Brisé » (boucliers)
 * @desc L'état que pose la brisure du bouclier (AstfglSCB). 0 = ne pas compter.
 * @type state
 * @default 1005
 *
 * @help
 * ============================================================================
 *  JOKO, 2026-11-10 : « un rapport des combats que le joueur va faire »
 *  — « Dans le jeu, après le combat ».
 * ============================================================================
 *  Une étape de plus sur l'écran de victoire (YEP_VictoryAftermath, entre
 *  l'expérience et le butin) :
 *
 *    Tours · Durée · Ennemis vaincus
 *    pour chaque héros au combat (seiryu compris) :
 *        ses dégâts infligés (une barre : sa part de ceux de l'équipe),
 *        les dégâts reçus, les soins donnés, combien de fois il est tombé,
 *        son meilleur coup (la technique et le chiffre) ;
 *    le plus gros coup du combat (★ si c'est le record de la partie),
 *    les réactions élémentaires, les boucliers brisés, qui est tombé.
 *
 *  Ce qui est compté : les chiffres qui s'affichent au-dessus des combattants
 *  (un coup, une rune qui part, une riposte, une attaque à plusieurs — comptée
 *  à qui la lance). Le poison, les brûlures et les régénérations de fin de
 *  tour ne sont à personne : ils ne sont pas comptés. Un soin ne compte que
 *  les PV vraiment rendus.
 *
 *  Commande de plugin :  RAPPORT off   (plus de rapport)   ·   RAPPORT on
 *
 *  Pour un script ou un banc :
 *      RapportDeCombat.chiffres()   → les chiffres du combat en cours
 *      RapportDeCombat.record()     → le record de la partie
 */
var RapportDeCombat = window.RapportDeCombat || {};
window.RapportDeCombat = RapportDeCombat;
(function () {
    'use strict';
    var P = PluginManager.parameters('RapportDeCombat');
    var TITRE = String(P.titre || 'Rapport du combat');
    var TOURS_MIN = P.toursMin === undefined || P.toursMin === '' ? 1 : Number(P.toursMin);
    var RECORDS = String(P.records || 'true') === 'true';
    var BRISE = Number(P.etatBrise === undefined ? 1005 : P.etatBrise) || 0;
    var REACTIONS = { vapeur: '💨 Vapeur', fonte: '🔥 Fonte', surcharge: '💥 Surcharge', lave: '🌋 Lave', givre: '🧊 Givre',
        electrocharge: '⚡ Électrocharge', plante: '🌿 Plante', supraconduction: '❄ Supraconduction', metal: '⚙ Métal',
        cristallisation: '💎 Cristallisation', crepuscule: '🌗 Crépuscule', dispersion: '🌪 Dispersion' };

    function milliers(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
    RapportDeCombat.milliers = milliers;

    //=========================================================================
    // Les chiffres
    //=========================================================================
    var C = null;
    function neuf() {
        return { debut: Date.now(), fin: 0, heros: {}, ordre: [], vaincus: 0, brises: 0,
                 coup: { v: 0, qui: 0, nom: '' }, recordBattu: false, ancienRecord: 0 };
    }
    function fiche(acteur) {
        var id = acteur.actorId();
        if (!C.heros[id]) {
            C.heros[id] = { id: id, inflige: 0, recu: 0, soins: 0, tombe: 0, vaincus: 0, coup: { v: 0, nom: '' } };
            C.ordre.push(id);
        }
        return C.heros[id];
    }
    RapportDeCombat.chiffres = function () { return C; };
    RapportDeCombat.record = function () { return ($gameSystem && $gameSystem._rapportRecord) || { v: 0, qui: 0, nom: '' }; };

    var _setup = BattleManager.setup;
    BattleManager.setup = function (troopId, canEscape, canLose) {
        _setup.call(this, troopId, canEscape, canLose);
        C = neuf();
        $gameParty.battleMembers().forEach(function (a) { fiche(a); });
    };

    function enCombat() { return C && $gameParty.inBattle(); }

    var _hp = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function (target, value) {
        var avant = target.hp;
        _hp.call(this, target, value);
        if (!enCombat() || !value) return;
        var s = this.subject(), it = this.item();
        // le chiffre qui s'affiche : d'autres plugins l'ont changé en route (rang, brisure, instinct…)
        var res = target.result(), v = res && res.hpDamage ? res.hpDamage : value;
        if (v > 0) {
            if (s && s.isActor() && target.isEnemy()) {
                var f = fiche(s);
                f.inflige += v;
                target._rapportDernier = s.actorId();
                if (v > f.coup.v) f.coup = { v: v, nom: it ? it.name : '' };
                if (v > C.coup.v) C.coup = { v: v, qui: s.actorId(), nom: it ? it.name : '' };
            }
            if (target.isActor() && !(s && s === target)) fiche(target).recu += v;
        } else if (v < 0 && s && s.isActor() && target.isActor()) {
            var rendu = Math.max(0, target.hp - avant);
            if (rendu > 0) fiche(s).soins += rendu;
        }
    };

    var _addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        var vivant = this.isAlive(), brise = BRISE && this.isStateAffected(BRISE);
        _addState.call(this, stateId);
        if (!enCombat()) return;
        if (stateId === this.deathStateId() && vivant && this.isDead()) {
            if (this.isActor()) { fiche(this).tombe++; }
            else {
                C.vaincus++;
                var h = C.heros[this._rapportDernier];
                if (h) h.vaincus++;
            }
        }
        if (BRISE && stateId === BRISE && this.isEnemy() && !brise && this.isStateAffected(BRISE)) C.brises++;
    };

    // la fin : la durée, et le record de la partie
    function clore() {
        if (!C || C.fin) return;
        C.fin = Date.now();
        C.tours = Math.max(1, $gameTroop.turnCount());
        C.reactions = (window.Fusion && Fusion.compte) ? Fusion.compte() : {};
        if (RECORDS && C.coup.v > 0) {
            var r = RapportDeCombat.record();
            C.ancienRecord = r.v;
            if (C.coup.v > r.v) {
                C.recordBattu = r.v > 0;
                $gameSystem._rapportRecord = { v: C.coup.v, qui: C.coup.qui, nom: C.coup.nom };
            }
        }
    }
    RapportDeCombat.clore = clore;

    //=========================================================================
    // La fenêtre
    //=========================================================================
    function Window_Rapport() { this.initialize.apply(this, arguments); }
    Window_Rapport.prototype = Object.create(Window_Base.prototype);
    Window_Rapport.prototype.constructor = Window_Rapport;
    Window_Rapport.prototype.initialize = function (y) {
        Window_Base.prototype.initialize.call(this, 0, y, Graphics.boxWidth, Graphics.boxHeight - y);
        this.openness = 0;
        // les visages : redessiner quand ils sont chargés
        var moi = this;
        (C ? C.ordre : []).forEach(function (id) {
            var a = $gameActors.actor(id);
            if (a && a.faceName()) ImageManager.loadFace(a.faceName()).addLoadListener(function () { if (moi.contents) moi.refresh(); });
        });
        this.refresh();
    };
    Window_Rapport.prototype.petit = function (taille, couleur) {
        this.contents.fontSize = taille;
        this.changeTextColor(couleur || this.normalColor());
    };
    Window_Rapport.prototype.refresh = function () {
        this.contents.clear();
        if (!C) return;
        var w = this.contentsWidth(), y = 0, moi = this;
        var s = Math.max(0, Math.round(((C.fin || Date.now()) - C.debut) / 1000));
        var duree = (s >= 60 ? Math.floor(s / 60) + ' min ' : '') + (s % 60) + ' s';

        // ── la ligne du haut
        this.petit(24);
        var tiers = Math.floor(w / 3);
        [['Tours', String(C.tours || 1)], ['Durée', duree], ['Ennemis vaincus', String(C.vaincus)]].forEach(function (p, i) {
            moi.changeTextColor(moi.systemColor());
            moi.drawText(p[0], i * tiers, y, tiers - 12, 'left');
            var lw = moi.textWidth(p[0] + '  ');
            moi.changeTextColor(moi.normalColor());
            moi.drawText(p[1], i * tiers + lw, y, tiers - lw - 12, 'left');
        });
        y += 36;

        // ── les colonnes
        var xNom = 62, xBarre = 196, lBarre = 250, xRecu = xBarre + lBarre + 12, lCol = Math.floor((w - xRecu) / 3);
        this.petit(16, this.systemColor());
        this.drawText('Dégâts infligés', xBarre, y, lBarre, 'left');
        this.drawText('Reçus', xRecu, y, lCol, 'right');
        this.drawText('Soins', xRecu + lCol, y, lCol, 'right');
        this.drawText('Tombé', xRecu + 2 * lCol, y, lCol, 'right');
        y += 24;

        var ids = C.ordre.filter(function (id) { return $gameActors.actor(id); });
        var total = 0, max = 0;
        ids.forEach(function (id) { total += C.heros[id].inflige; max = Math.max(max, C.heros[id].inflige); });
        var reste = this.contentsHeight() - y - 96;
        var hLigne = Math.max(44, Math.min(64, Math.floor(reste / Math.max(1, ids.length))));
        ids.forEach(function (id) {
            var a = $gameActors.actor(id), f = C.heros[id];
            // le visage, rogné à la hauteur de la ligne
            var fh = hLigne - 6;
            moi.drawFace(a.faceName(), a.faceIndex(), 0, y + 2, 56, fh);
            moi.petit(22, f.tombe && a.isDead() ? moi.deathColor() : moi.normalColor());
            moi.drawText(a.name(), xNom, y - 2, xBarre - xNom - 8, 'left');
            // la barre : sa part des dégâts de l'équipe
            var part = total > 0 ? f.inflige / total : 0;
            var c1 = max > 0 && f.inflige === max ? moi.textColor(17) : moi.textColor(20);
            var c2 = max > 0 && f.inflige === max ? moi.textColor(14) : moi.textColor(21);
            moi.contents.fillRect(xBarre, y + 8, lBarre, 16, moi.gaugeBackColor());
            if (max > 0) moi.contents.gradientFillRect(xBarre, y + 8, Math.round(lBarre * f.inflige / max), 16, c1, c2);
            moi.petit(18);
            moi.drawText(milliers(f.inflige), xBarre + 6, y - 2, lBarre - 60, 'left');
            moi.petit(16, moi.textColor(8));
            moi.drawText(Math.round(part * 100) + ' %', xBarre, y - 1, lBarre - 6, 'right');
            moi.petit(18);
            moi.drawText(milliers(f.recu), xRecu, y - 2, lCol, 'right');
            moi.changeTextColor(f.soins > 0 ? moi.textColor(24) : moi.textColor(8));
            moi.drawText(f.soins > 0 ? milliers(f.soins) : '—', xRecu + lCol, y - 2, lCol, 'right');
            moi.changeTextColor(f.tombe > 0 ? moi.deathColor() : moi.textColor(8));
            moi.drawText(f.tombe > 0 ? '×' + f.tombe : '—', xRecu + 2 * lCol, y - 2, lCol, 'right');
            // son meilleur coup
            if (hLigne >= 44) {
                moi.petit(15, moi.textColor(8));
                var t = f.coup.v > 0 ? 'Meilleur coup : ' + f.coup.nom + ' · ' + milliers(f.coup.v) : 'Aucun coup porté';
                if (f.vaincus > 0) t += '    ' + f.vaincus + (f.vaincus > 1 ? ' ennemis vaincus' : ' ennemi vaincu');
                moi.drawText(t, xNom, y + 22, w - xNom, 'left');
            }
            y += hLigne;
        });

        // ── le bas
        y = Math.max(y + 4, this.contentsHeight() - 90);
        this.contents.fillRect(0, y - 4, w, 1, this.textColor(8));
        this.petit(19);
        if (C.coup.v > 0) {
            var qui = $gameActors.actor(C.coup.qui);
            var txt = 'Plus gros coup : ' + (qui ? qui.name() + ' — ' : '') + C.coup.nom + ' — ' + milliers(C.coup.v);
            this.drawText(txt, 0, y, w - 150, 'left');
            if (C.recordBattu) { this.changeTextColor(this.textColor(17)); this.drawText('★ Record battu', w - 150, y, 150, 'right'); }
        } else {
            this.changeTextColor(this.textColor(8));
            this.drawText('Aucun coup porté', 0, y, w, 'left');
        }
        y += 28;
        this.petit(17);
        var morceaux = [];
        Object.keys(C.reactions || {}).forEach(function (k) { if (C.reactions[k] > 0) morceaux.push((REACTIONS[k] || k) + ' ×' + C.reactions[k]); });
        var ligne = morceaux.length ? 'Réactions : ' + morceaux.join(' · ') : 'Aucune réaction élémentaire';
        if (!morceaux.length) this.changeTextColor(this.textColor(8));
        this.drawText(ligne, 0, y, w, 'left');
        y += 26;
        this.petit(17);
        var tombes = ids.filter(function (id) { return C.heros[id].tombe > 0; }).map(function (id) { return $gameActors.actor(id).name(); });
        var fin = [];
        if (BRISE) fin.push(C.brises > 0 ? 'Boucliers brisés : ' + C.brises : 'Aucun bouclier brisé');
        fin.push(tombes.length ? 'Tombés : ' + tombes.join(', ') : 'Personne n\'est tombé');
        this.drawText(fin.join('      '), 0, y, w, 'left');
        this.resetFontSettings();
    };
    RapportDeCombat.Window_Rapport = Window_Rapport;

    //=========================================================================
    // L'étape de l'écran de victoire
    //=========================================================================
    function voulu() {
        if (!window.Imported || !Imported.YEP_VictoryAftermath) return false;
        if ($gameSystem._rapportCoupe) return false;
        if (TOURS_MIN <= 0) return false;
        return !!C && Math.max(1, $gameTroop.turnCount()) >= TOURS_MIN;
    }
    RapportDeCombat.voulu = voulu;

    var _victoire = BattleManager.processVictory;
    BattleManager.processVictory = function () {
        clore();
        _victoire.call(this);
    };

    if (Scene_Battle.prototype.addCustomVictorySteps) {
        var _custom = Scene_Battle.prototype.addCustomVictorySteps;
        Scene_Battle.prototype.addCustomVictorySteps = function (array) {
            array = _custom.call(this, array);
            if (voulu() && array.indexOf('RAPPORT') < 0) array.push('RAPPORT');
            return array;
        };
        var _steps = Scene_Battle.prototype.updateVictorySteps;
        Scene_Battle.prototype.updateVictorySteps = function () {
            _steps.call(this);
            if (this.isVictoryStep('RAPPORT')) this.updateVictoryRapport();
        };
        Scene_Battle.prototype.updateVictoryRapport = function () {
            if (!this._victoryRapportWindow) {
                clore();
                this._victoryTitleWindow.refresh(TITRE);
                this._victoryRapportWindow = new Window_Rapport(this._victoryTitleWindow.height);
                this.addWindow(this._victoryRapportWindow);
                this._victoryRapportWindow.open();
            } else if (this._victoryRapportWindow.isOpen()) {
                if (this.victoryTriggerContinue()) {
                    SoundManager.playOk();
                    this._victoryRapportWindow.close();
                    this.processNextVictoryStep();
                }
            }
        };
    }

    // Les lignes posées au-dessus du statut (le Pacte, la Colère, le livre, la phrase, seiryu) s'écrivaient sur
    // l'écran de victoire : elles s'effacent dès qu'il s'ouvre (FamillesDeCapacites les rallume à chaque image).
    var LIGNES_DU_BAS = ['_fenetrePacte', '_fenetreColere', '_fenetreLecture', '_fenetrePhrase', '_fenetreSeiryu'];
    var _maj = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        _maj.call(this);
        if (!this._victoryTitleWindow) return;
        for (var i = 0; i < LIGNES_DU_BAS.length; i++) { var l = this[LIGNES_DU_BAS[i]]; if (l) l.visible = false; }
    };

    var _cmd = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _cmd.call(this, command, args);
        if (String(command).toUpperCase() === 'RAPPORT') {
            var a = String(args[0] || '').toLowerCase();
            if (a === 'off' || a === 'non') $gameSystem._rapportCoupe = true;
            if (a === 'on' || a === 'oui') $gameSystem._rapportCoupe = false;
        }
    };
})();
