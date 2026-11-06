//=============================================================================
// ConfortDeLecture.js — v1.0  ·  Lire l'histoire à son rythme
// RPG Maker MV   ·   pour JOKO
//   Inspiré, sans rien en copier, de Message Speed Option et Message
//   Backlog (Yanfly). À placer APRÈS YEP_MessageCore et TexteQuiTient.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Option « Vitesse du texte » (lente → instantanée) et
 * journal des dialogues : Q / Page précédente pour relire ce qui a été dit.
 * @author JOKO
 *
 * @param vitesse
 * @text Vitesse du texte par défaut
 * @type select
 * @option Lente
 * @value 0
 * @option Normale
 * @value 1
 * @option Rapide
 * @value 2
 * @option Instantanée
 * @value 3
 * @default 1
 *
 * @param journal
 * @text Journal des dialogues
 * @type boolean
 * @on Oui
 * @off Non
 * @default true
 *
 * @param taille
 * @text Répliques gardées
 * @type number
 * @min 10
 * @max 200
 * @default 60
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  LIRE L'HISTOIRE À SON RYTHME
 * ═══════════════════════════════════════════════════════════════════════════
 *  ── LA VITESSE DU TEXTE ───────────────────────────────────────────────
 *  Une ligne de plus dans les Options : « Vitesse du texte ».
 *      Lente        une lettre toutes les deux images
 *      Normale      celle de MV (une lettre par image)
 *      Rapide       trois lettres par image
 *      Instantanée  toute la page d'un coup
 *  Tes pauses écrites (\. et \|) sont gardées à toutes les vitesses : ce
 *  sont des silences voulus.
 *
 *  ── LE JOURNAL DES DIALOGUES ──────────────────────────────────────────
 *  Q (ou Page précédente) — sur la carte, ou pendant qu'un message attend —
 *  ouvre le journal : les 60 dernières répliques, avec le visage et le nom
 *  de celui qui parle. Haut / bas pour remonter, Q ou Échap pour refermer.
 *  Pratique quand un ami a passé une réplique trop vite.
 *  Le journal est gardé dans la sauvegarde.
 */
var ConfortDeLecture = window.ConfortDeLecture || {};
window.ConfortDeLecture = ConfortDeLecture;
(function () {
    'use strict';
    var P = PluginManager.parameters('ConfortDeLecture');
    var DEFAUT = Number(P.vitesse === undefined ? 1 : P.vitesse);
    var JOURNAL = String(P.journal || 'true') === 'true';
    var TAILLE = Math.max(10, Number(P.taille || 60));
    var NOMS = ['Lente', 'Normale', 'Rapide', 'Instantanée'];

    //=========================================================================
    // L'option « Vitesse du texte »
    //=========================================================================
    ConfigManager.vitesseTexte = DEFAUT;
    var _mk = ConfigManager.makeData;
    ConfigManager.makeData = function () { var c = _mk.call(this); c.vitesseTexte = this.vitesseTexte; return c; };
    var _ap = ConfigManager.applyData;
    ConfigManager.applyData = function (c) {
        _ap.call(this, c);
        var v = Number(c.vitesseTexte);
        this.vitesseTexte = (c.vitesseTexte === undefined || isNaN(v)) ? DEFAUT : Math.max(0, Math.min(3, v));
    };
    var _go = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function () { _go.call(this); this.addCommand('Vitesse du texte', 'vitesseTexte'); };
    var _st = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function (index) {
        if (this.commandSymbol(index) === 'vitesseTexte') return NOMS[this.getConfigValue('vitesseTexte')] || NOMS[1];
        return _st.call(this, index);
    };
    function bouger(fen, sens, boucle) {
        var v = Number(fen.getConfigValue('vitesseTexte')) + sens;
        if (boucle) v = (v + 4) % 4; else v = Math.max(0, Math.min(3, v));
        fen.changeValue('vitesseTexte', v);
    }
    var _ok = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function () {
        if (this.commandSymbol(this.index()) === 'vitesseTexte') return bouger(this, 1, true);
        _ok.call(this);
    };
    var _droite = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function (wrap) {
        if (this.commandSymbol(this.index()) === 'vitesseTexte') return bouger(this, 1, false);
        _droite.call(this, wrap);
    };
    var _gauche = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function (wrap) {
        if (this.commandSymbol(this.index()) === 'vitesseTexte') return bouger(this, -1, false);
        _gauche.call(this, wrap);
    };

    // La vitesse elle-même : MV écrit une lettre par image.
    var _um = Window_Message.prototype.updateMessage;
    Window_Message.prototype.updateMessage = function () {
        var v = ConfigManager.vitesseTexte;
        if (v === 3 && this._textState) this._showFast = true;
        var enCours = _um.call(this);
        if (!enCours || this._showFast || this._lineShowFast) return enCours;
        if (v === 2) {
            for (var i = 0; i < 2 && this._textState && !this.pause && this._waitCount <= 0; i++) _um.call(this);
        } else if (v === 0 && this._textState && this._waitCount <= 0) {
            this._waitCount = 1;
        }
        return enCours;
    };

    if (!JOURNAL) return;

    //=========================================================================
    // Le journal des dialogues
    //=========================================================================
    function journal() {
        if (!$gameSystem._journalDialogues) $gameSystem._journalDialogues = [];
        return $gameSystem._journalDialogues;
    }
    ConfortDeLecture.journal = function () { return journal().slice(); };
    // on ne garde que les codes qu'une fenêtre ordinaire sait dessiner
    function nettoyer(t) {
        return String(t)
            .replace(/\x1b(?![CI]\[|\{|\})[A-Z]+\d*(\[[^\]]*\]|<[^>]*>)?/gi, '')
            .replace(/\x1b[.|!><^$]/g, '');
    }
    function nomDuMessage() {
        var m = /\\N[1-5C]?<([^>]*)>/i.exec($gameMessage.allText());
        if (!m) return '';
        return m[1].replace(/\\N\[(\d+)\]/gi, function (a, n) { var x = $gameActors.actor(Number(n)); return x ? x.name() : ''; })
            .replace(/\\V\[(\d+)\]/gi, function (a, n) { return $gameVariables.value(Number(n)); })
            .replace(/\\[A-Z]+(\[[^\]]*\])?/gi, '').trim();
    }
    var _start = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function () {
        _start.call(this);
        if (!this._textState || !$gameSystem) return;
        var j = journal();
        j.push({ nom: nomDuMessage(), visage: $gameMessage.faceName(), n: $gameMessage.faceIndex(), texte: nettoyer(this._textState.text) });
        while (j.length > TAILLE) j.shift();
    };

    // La fenêtre : par-dessus la carte, sans changer de scène (le message en
    // cours reste exactement où il en était).
    function Window_JournalDialogues() { this.initialize.apply(this, arguments); }
    Window_JournalDialogues.prototype = Object.create(Window_Base.prototype);
    Window_JournalDialogues.prototype.constructor = Window_JournalDialogues;
    Window_JournalDialogues.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.openness = 0;
        this._ouvert = false;
        this._debut = 0;
        this._hauteurs = [];
    };
    Window_JournalDialogues.prototype.lignesDe = function (texte, largeur) {
        var self = this, out = [];
        texte.split('\n').forEach(function (para) {
            var ligne = '';
            para.split(' ').forEach(function (mot) {
                var essai = ligne ? ligne + ' ' + mot : mot;
                if (!ligne || self.textWidthEx(essai) <= largeur) ligne = essai;
                else { out.push(ligne); ligne = mot; }
            });
            out.push(ligne);
        });
        return out.filter(function (l, i) { return l.trim() || i < out.length - 1; });
    };
    Window_JournalDialogues.prototype.preparer = function () {
        var self = this, l = this.lineHeight(), j = journal();
        this._entrees = j.map(function (e) {
            var lignes = self.lignesDe(e.texte, self.contentsWidth() - 96);
            if (e.visage) ImageManager.loadFace(e.visage);
            return { e: e, lignes: lignes, h: Math.max(80, ((e.nom ? 1 : 0) + lignes.length) * l) + 14 };
        });
        // on commence en bas : la dernière réplique est visible
        var h = 0, i = this._entrees.length;
        while (i > 0 && h + this._entrees[i - 1].h <= this.contentsHeight() - l) { h += this._entrees[i - 1].h; i--; }
        this._debut = i;
        this._dernierDebut = i;
    };
    Window_JournalDialogues.prototype.ouvrir = function () {
        this.preparer();
        this._ouvert = true;
        this.open();
        this.dessiner();
        SoundManager.playOk();
    };
    Window_JournalDialogues.prototype.fermer = function () {
        this._ouvert = false;
        this.close();
        SoundManager.playCancel();
    };
    Window_JournalDialogues.prototype.dessiner = function () {
        var c = this.contents; c.clear();
        var l = this.lineHeight();
        this.changeTextColor(this.systemColor());
        this.drawText('Journal des dialogues', 0, 0, this.contentsWidth(), 'center');
        this.resetTextColor();
        if (!this._entrees.length) {
            this.drawText('Personne n\'a encore parlé.', 0, l * 2, this.contentsWidth(), 'center');
            return;
        }
        var y = l, self = this;
        for (var i = this._debut; i < this._entrees.length; i++) {
            var x = this._entrees[i];
            if (y + x.h > this.contentsHeight()) break;
            var face = x.e.visage ? ImageManager.loadFace(x.e.visage) : null;
            if (face && face.isReady()) {
                var pw = Window_Base._faceWidth, ph = Window_Base._faceHeight;
                c.blt(face, (x.e.n % 4) * pw, Math.floor(x.e.n / 4) * ph, pw, ph, 4, y + 4, 72, 72);
            } else if (face) {
                face.addLoadListener(function () { if (self._ouvert) self.dessiner(); });
            }
            var ty = y;
            if (x.e.nom) { this.changeTextColor(this.textColor(6)); this.drawText(x.e.nom, 92, ty, this.contentsWidth() - 92); this.resetTextColor(); ty += l; }
            x.lignes.forEach(function (t) { self.resetFontSettings(); self.drawTextEx(t, 92, ty); ty += l; });
            c.fillRect(0, y + x.h - 6, this.contentsWidth(), 1, 'rgba(255,255,255,0.18)');
            y += x.h;
        }
        // repères : il y en a plus haut / plus bas
        this.changeTextColor(this.textColor(8));
        if (this._debut > 0) this.drawText('▲', this.contentsWidth() - 30, 0, 30, 'right');
        if (this._debut < this._dernierDebut) this.drawText('▼', this.contentsWidth() - 30, this.contentsHeight() - l, 30, 'right');
        this.resetTextColor();
    };
    Window_JournalDialogues.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        if (!this._ouvert || !this.isOpen()) return;
        var d = this._debut;
        if (Input.isRepeated('up')) d--;
        if (Input.isRepeated('down')) d++;
        if (Input.isTriggered('pagedown')) d += 3;
        d = Math.max(0, Math.min(this._dernierDebut, d));
        if (d !== this._debut) { this._debut = d; SoundManager.playCursor(); this.dessiner(); }
        if (Input.isTriggered('cancel') || Input.isTriggered('pageup') || TouchInput.isCancelled()) this.fermer();
    };
    ConfortDeLecture.ouvert = function () {
        var s = SceneManager._scene;
        return !!(s && s._journalDialogues && (s._journalDialogues._ouvert || !s._journalDialogues.isClosed()));
    };

    var _caw = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function () {
        _caw.call(this);
        this._journalDialogues = new Window_JournalDialogues();
        this.addWindow(this._journalDialogues);
    };
    function peutOuvrir() {
        if (SceneManager.isSceneChanging() || $gamePlayer.isTransferring()) return false;
        if ($gameMessage.isChoice() || $gameMessage.isNumberInput() || $gameMessage.isItemChoice()) return false;
        if ($gameMessage.isBusy()) {   // pendant un message : seulement quand il attend le joueur
            var w = SceneManager._scene._messageWindow;
            return !!(w && w.pause);
        }
        return !$gameMap.isEventRunning();
    }
    var _smu = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        var j = this._journalDialogues;
        if (j && !j._ouvert && j.isClosed() && Input.isTriggered('pageup') && peutOuvrir()) j.ouvrir();
        _smu.call(this);
    };
    // tant que le journal est ouvert : le message ne défile pas, le joueur
    // ne bouge pas, le menu ne s'ouvre pas
    var _wmTrig = Window_Message.prototype.isTriggered;
    Window_Message.prototype.isTriggered = function () { return ConfortDeLecture.ouvert() ? false : _wmTrig.call(this); };
    var _canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function () { return ConfortDeLecture.ouvert() ? false : _canMove.call(this); };
    var _menu = Scene_Map.prototype.isMenuCalled;
    Scene_Map.prototype.isMenuCalled = function () { return ConfortDeLecture.ouvert() ? false : _menu.call(this); };
})();
