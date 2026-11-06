//=============================================================================
// DialoguesPlus.js — v1.0  ·  Écrire l'histoire plus vite
// RPG Maker MV   ·   pour JOKO
//   Inspiré, sans rien en copier, des Extended Message Packs et de Message
//   Macros (Yanfly). À placer APRÈS YEP_MessageCore et TexteQuiTient.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Choix cachés ou grisés selon une condition, plus de 6
 * choix, bulles de dialogue au-dessus d'un personnage, macros de texte.
 * @author JOKO
 *
 * @param macros
 * @text Macros de texte
 * @type note
 * @default "ves = \\c[2]\\N[1]\\c[0]\nkor = \\c[4]\\N[2]\\c[0]\nlud = \\c[3]\\N[3]\\c[0]\nael = \\c[6]\\N[4]\\c[0]"
 * @desc Une par ligne : clé = texte. Dans un message, \m[clé] devient le texte.
 *
 * @param largeurBulle
 * @text Largeur maximale d'une bulle
 * @type number
 * @min 200
 * @default 520
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  ÉCRIRE L'HISTOIRE PLUS VITE
 * ═══════════════════════════════════════════════════════════════════════════
 *  ── LES CHOIX QUI DÉPENDENT DE CE QUE LE JOUEUR A FAIT ─────────────────
 *  Écris la condition dans le texte du choix (elle ne s'affiche pas) :
 *
 *      Parler de la lettre <si: s[12]>        n'apparaît que si l'interrupteur 12 est ON
 *      Payer 500 or <grisé: $gameParty.gold() < 500>   visible, mais grisé (on ne peut pas le prendre)
 *      Demander pardon <si: v[3] >= 2>        si la variable 3 vaut 2 ou plus
 *      Ouvrir <si: ss[A]>                     si l'interrupteur local A de cet événement est ON
 *
 *  s[n] interrupteur · v[n] variable · ss[A] interrupteur local · et tout
 *  JavaScript ($gameParty.hasItem($dataItems[5]), $gameActors.actor(1).level >= 10…).
 *  Les branches restent celles de l'éditeur : rien d'autre à changer.
 *
 *  ── PLUS DE 6 CHOIX ───────────────────────────────────────────────────
 *  Mets deux (ou trois…) « Afficher des choix » l'un juste après l'autre :
 *  ils s'affichent dans UNE seule liste. Chacun garde ses propres branches.
 *  (Annulation et choix par défaut : ceux du premier.)
 *
 *  ── UNE BULLE AU-DESSUS DE CELUI QUI PARLE ────────────────────────────
 *      \bulle[5]   la fenêtre se pose au-dessus de l'événement 5, à sa taille
 *      \bulle[0]   au-dessus de l'événement qui parle
 *      \bulle[-1]  au-dessus du joueur
 *  Pour les scènes : on voit qui parle sans visage. S'il n'y a pas la place
 *  au-dessus, la bulle passe dessous.
 *
 *  ── LES MACROS ────────────────────────────────────────────────────────
 *  \m[ves] → le nom de Vesper en couleur (réglable dans les paramètres :
 *  ves, kor, lud, ael par défaut). Ajoute les tiennes : un lieu, un objet,
 *  une formule que tu répètes. Changer la macro change tous les messages.
 */
var DialoguesPlus = window.DialoguesPlus || {};
window.DialoguesPlus = DialoguesPlus;
(function () {
    'use strict';
    var P = PluginManager.parameters('DialoguesPlus');
    var LARGEUR_BULLE = Math.max(200, Number(P.largeurBulle || 520));

    //=========================================================================
    // Les macros
    //=========================================================================
    var MACROS = {};
    (function () {
        var brut = P.macros || '';
        try { brut = JSON.parse(brut); } catch (e) { }
        String(brut).split(/\r?\n/).forEach(function (l) {
            var m = /^\s*([\wÀ-ÿ-]+)\s*=\s*(.*)$/.exec(l);
            if (m) MACROS[m[1].toLowerCase()] = m[2];
        });
    })();
    DialoguesPlus.macros = MACROS;
    function macros(t) {
        for (var n = 0; n < 5 && /\\m\[/i.test(t); n++) {
            t = t.replace(/\\m\[([^\]]+)\]/gi, function (a, k) { var v = MACROS[k.trim().toLowerCase()]; return v === undefined ? a : v; });
        }
        return t;
    }
    var _conv = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function (text) {
        return _conv.call(this, macros(String(text)));
    };

    //=========================================================================
    // Les choix : conditions et fusion
    //=========================================================================
    function evaluer(expr, it) {
        var js = String(expr)
            .replace(/\bss\[\s*([A-D])\s*\]/gi, function (a, l) { return '$gameSelfSwitches.value([' + it._mapId + ',' + it._eventId + ',"' + l.toUpperCase() + '"])'; })
            .replace(/\bs\[\s*(\d+)\s*\]/g, '$gameSwitches.value($1)')
            .replace(/\bv\[\s*(\d+)\s*\]/g, '$gameVariables.value($1)');
        try { return !!(new Function('return (' + js + ');')).call(it); }
        catch (e) { console.warn('[DialoguesPlus] condition illisible : ' + expr); return true; }
    }
    // Les balises <nom: expression> d'un texte. L'expression peut contenir « > »
    // (v[3] >= 2) : elle va jusqu'au DERNIER « > » avant la balise suivante,
    // ou avant la fin du texte. ([^>]+ s'arrêtait au « > » de « >= » : la
    // condition devenait « v[3] », vraie dès que la variable n'était pas nulle.)
    function balises(texte, noms) {
        var re = new RegExp('<\\s*(' + noms + ')\\s*:', 'gi'), m, debuts = [], out = [];
        while ((m = re.exec(texte))) debuts.push({ i: m.index, apres: re.lastIndex, nom: m[1].toLowerCase() });
        debuts.forEach(function (d, k) {
            var bout = k + 1 < debuts.length ? debuts[k + 1].i : texte.length;
            var f = texte.lastIndexOf('>', bout - 1);
            if (f >= d.apres) out.push({ nom: d.nom, expr: texte.slice(d.apres, f).trim(), debut: d.i, fin: f + 1 });
        });
        return out;
    }
    function lireChoix(texte, it) {
        var o = { texte: String(texte), visible: true, actif: true };
        var b = balises(o.texte, 'si|gris[ée]');
        for (var k = b.length - 1; k >= 0; k--) {
            if (b[k].nom === 'si') { if (!evaluer(b[k].expr, it)) o.visible = false; }
            else if (evaluer(b[k].expr, it)) o.actif = false;
            o.texte = o.texte.slice(0, b[k].debut) + o.texte.slice(b[k].fin);
        }
        o.texte = o.texte.replace(/\s+$/, '');
        return o;
    }
    function finDuBloc(list, i, indent) {
        for (var j = i + 1; j < list.length; j++) if (list[j].code === 404 && list[j].indent === indent) return j;
        return -1;
    }
    DialoguesPlus.choix = function (it) { return it._dpBlocs; };

    var _setup = Game_Interpreter.prototype.setupChoices;
    Game_Interpreter.prototype.setupChoices = function (params) {
        var list = this._list, ind = this._indent;
        // les blocs « Afficher des choix » qui se suivent
        var blocs = [{ debut: this._index, choix: params[0] }];
        var fin = finDuBloc(list, this._index, ind);
        while (fin > 0 && list[fin + 1] && list[fin + 1].code === 102 && list[fin + 1].indent === ind) {
            blocs.push({ debut: fin + 1, choix: list[fin + 1].parameters[0] });
            fin = finDuBloc(list, fin + 1, ind);
        }
        var tous = [];
        blocs.forEach(function (b, k) { b.choix.forEach(function (t, i) { tous.push({ bloc: k, i: i, c: lireChoix(t, this) }); }, this); }, this);
        var simples = blocs.length === 1 && tous.every(function (x) { return x.c.visible && x.c.actif && x.c.texte === blocs[0].choix[x.i]; });
        if (simples) { this._dpBlocs = null; return _setup.call(this, params); }

        var vus = tous.filter(function (x) { return x.c.visible; });
        var cancelType = params[1], defaultType = params.length > 2 ? params[2] : 0;
        var position = params.length > 3 ? params[3] : 2, fond = params.length > 4 ? params[4] : 0;
        var versVu = function (iOrig) { for (var k = 0; k < vus.length; k++) if (vus[k].bloc === 0 && vus[k].i === iOrig) return k; return -1; };
        var annul = cancelType === -1 ? -1 : (cancelType >= params[0].length || cancelType === -2 ? -2 : versVu(cancelType));
        if (annul === -1 && cancelType >= 0) annul = -1;
        var defaut = defaultType >= 0 ? Math.max(0, versVu(defaultType)) : -1;
        var self = this;
        // chaque bloc absorbé saura sa branche quand l'interpréteur l'atteindra
        function poser(valeurs) {
            self._branch[ind] = valeurs[0];
            self._dpAbsorbes = {};
            for (var k = 1; k < blocs.length; k++) self._dpAbsorbes[blocs[k].debut] = valeurs[k];
        }
        this._dpBlocs = blocs;
        if (!vus.length) { poser(blocs.map(function () { return -1; })); return; }
        $gameMessage.setChoices(vus.map(function (x) { return x.c.texte; }), defaut, annul);
        $gameMessage._dpActifs = vus.map(function (x) { return x.c.actif; });
        $gameMessage.setChoiceBackground(fond);
        $gameMessage.setChoicePositionType(position);
        $gameMessage.setChoiceCallback(function (n) {
            var v = blocs.map(function () { return -1; });
            if (n >= 0 && vus[n]) v[vus[n].bloc] = vus[n].i;
            else if (n === -2) v[0] = -2;     // la branche « Annuler » du premier bloc
            poser(v);
        });
    };
    var _c102 = Game_Interpreter.prototype.command102;
    Game_Interpreter.prototype.command102 = function () {
        if (this._dpAbsorbes && this._dpAbsorbes[this._index] !== undefined) {
            this._branch[this._indent] = this._dpAbsorbes[this._index];
            delete this._dpAbsorbes[this._index];
            return true;
        }
        return _c102.call(this);
    };
    var _clear = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function () { _clear.call(this); this._dpActifs = null; };

    // les choix grisés
    var _mcl = Window_ChoiceList.prototype.makeCommandList;
    Window_ChoiceList.prototype.makeCommandList = function () {
        _mcl.call(this);
        var a = $gameMessage._dpActifs;
        if (a) this._list.forEach(function (c, i) { if (a[i] === false) c.enabled = false; });
    };
    var _di = Window_ChoiceList.prototype.drawItem;
    Window_ChoiceList.prototype.drawItem = function (index) {
        var actif = this.isCommandEnabled(index);
        if (!actif) this.changePaintOpacity(false);
        _di.call(this, index);
        this.changePaintOpacity(true);
    };

    //=========================================================================
    // Les bulles
    //=========================================================================
    var _cec = Window_Message.prototype.convertEscapeCharacters;
    Window_Message.prototype.convertEscapeCharacters = function (text) {
        var self = this;
        text = String(text).replace(/\\bulle\[\s*(-?\d+)\s*\]/gi, function (a, n) { self._dpBulle = Number(n); return ''; });
        return _cec.call(this, text);
    };
    function cibleBulle(n) {
        if (n < 0) return $gamePlayer;
        if (n === 0) { var it = $gameMap._interpreter; return it && it._eventId ? $gameMap.event(it._eventId) : null; }
        return $gameMap.event(n);
    }
    var _start = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function () {
        this._dpBulle = undefined; this._dpEnBulle = false; this._dpTaille = null;
        _start.call(this);
        if (this._dpBulle === undefined || !(SceneManager._scene instanceof Scene_Map)) return;
        var c = cibleBulle(this._dpBulle);
        if (!c) return;
        // la taille : le texte replié dans la largeur maximale
        var ts = this._textState, gauche = ts.left || 0;
        var dispo = LARGEUR_BULLE - this.standardPadding() * 2 - gauche;
        var lignes = 0, plusLarge = 0, self = this;
        ts.text.split('\n').forEach(function (l) {
            var w = self.textWidthExCheck ? self.textWidthExCheck(l) : self.textWidthEx(l);
            lignes += Math.max(1, Math.ceil(w / dispo));
            plusLarge = Math.max(plusLarge, Math.min(w, dispo));
        });
        var largeur = Math.min(LARGEUR_BULLE, Math.ceil(plusLarge) + gauche + this.standardPadding() * 2 + 8);
        var hauteur = this.fittingHeight(Math.min(lignes, 4));
        // la place : au-dessus de la tête, sinon dessous
        var sx = c.screenX(), sy = c.screenY(), tete = 52;
        var x = Math.max(0, Math.min(Graphics.boxWidth - largeur, sx - largeur / 2));
        var y = sy - tete - hauteur - 4;
        if (y < 0) y = Math.min(Graphics.boxHeight - hauteur, sy + 8);
        this._dpTaille = { w: largeur, h: hauteur, x: x, y: y };
        this._dpEnBulle = true;
        this.newPage(ts);              // YEP y refait la taille : c'est la nôtre qui s'applique
        this.updatePlacement();
        if (this._nameWindow && this._nameWindow.adjustPositionX) { this._nameWindow.adjustPositionX(); this._nameWindow.adjustPositionY(); }
    };
    var _ajuste = Window_Message.prototype.adjustWindowSettings;
    if (_ajuste) Window_Message.prototype.adjustWindowSettings = function () {
        var t = this._dpEnBulle && this._dpTaille;
        if (!t) return _ajuste.call(this);
        this.width = t.w; this.height = t.h; this.createContents(); this.x = t.x;
    };
    var _place = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function () {
        if (this._dpEnBulle && this._dpTaille) { this.y = this._dpTaille.y; if (this._goldWindow) this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height; return; }
        _place.call(this);
    };
})();
