//=============================================================================
// LesMenus.js
//=============================================================================
/*:
 * @plugindesc v1.1 ■ Les menus : le menu principal refait (les cinq héros, le
 * lieu, l'heure), les « Carnets », les Options rangées, le Bestiaire lisible,
 * le Statut en entier, et les derniers mots anglais en français.
 * @author Projet Trois Sources
 *
 * @param menuRefait
 * @text Le menu principal refait
 * @type boolean
 * @default true
 *
 * @param carnets
 * @text Regrouper sous « Carnets »
 * @desc Les symboles des commandes du menu rangées sous une seule ligne, séparés par des virgules. Vide = aucune.
 * @default bestiaire, encyclopedie, music_book, mvxElements, statistiques
 *
 * @param nomCarnets
 * @text Nom de la ligne
 * @default Carnets
 *
 * @param apresQuoi
 * @text « Carnets » se met après
 * @desc Le symbole de la commande après laquelle la ligne se place (quest, formation, status…).
 * @default quest
 *
 * @param optionsRangees
 * @text Ranger les Options par groupes
 * @type boolean
 * @default true
 *
 * @param bestiaireRange
 * @text Bestiaire : les rencontrés d'abord
 * @type boolean
 * @default true
 *
 * @help
 * ============================================================================
 *  JOKO, 2026-11-12 : « Continue dans les menus pour les améliorer ou
 *  refaire » — puis, sur les six idées proposées : « Oui tout ».
 * ============================================================================
 *  ① EN FRANÇAIS. Les mots des réglages (YEP_ItemCore, YEP_EquipCore,
 *     YEP_SaveCore, TSR_EquipSlots, ItemBook) et de la base (PV, PM, PT)
 *     sont changés là où ils sont ; ici, seulement ce qui est écrit en dur
 *     dans un plugin : « remove / optimize / cancel / change / equip » de
 *     l'écran d'équipement.
 *
 *  ② LES CARNETS. Bestiaire, Encyclopédie, Musiques, Éléments et
 *     Statistiques se rangent sous une ligne « Carnets » : le menu tient sans
 *     défiler. Chaque commande garde son écran — on l'ouvre d'un cran plus
 *     loin. Le réglage « carnets » dit lesquelles ; vide, rien ne bouge.
 *
 *  ③ LE STATUT. La description du héros en entier : le corps du texte se
 *     resserre jusqu'à ce qu'elle tienne (elle finissait par « … »).
 *
 *  ④ LE BESTIAIRE. Les créatures rencontrées d'abord, puis une seule ligne
 *     « ?????? × n » pour celles qu'on n'a pas vues ; le bas dit le compte.
 *
 *  ⑤ LES OPTIONS. Quatre groupes à titre : Jeu, Combat, Affichage, Son. Le
 *     curseur saute les titres. Une option inconnue va dans « Jeu ».
 *
 *  ⑥ LE MENU PRINCIPAL. Les cinq combattants à l'écran (seiryu était sous la
 *     flèche) : le visage, le nom, la classe et le niveau, ses états, PV, PM
 *     et PT en barres avec leurs chiffres. À gauche, sous les commandes : le
 *     lieu, le jour et l'heure, les âmes de ludwing (dit en toutes lettres :
 *     c'était « ✦ 0 » sans un mot) et l'or.
 *
 *  Rien n'est retiré : menuRefait, optionsRangees, bestiaireRange à false et
 *  « carnets » vide rendent chaque écran comme avant.
 */
var LesMenus = window.LesMenus || {};
window.LesMenus = LesMenus;
(function () {
    'use strict';
    var P = PluginManager.parameters('LesMenus');
    function oui(k, d) { return String(P[k] === undefined || P[k] === '' ? d : P[k]) === 'true'; }
    var REFAIT = oui('menuRefait', 'true');
    var CARNETS = String(P.carnets === undefined ? 'bestiaire, encyclopedie, music_book, mvxElements, statistiques' : P.carnets).split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    var NOM_CARNETS = String(P.nomCarnets || 'Carnets');
    var APRES = String(P.apresQuoi || 'quest').trim();
    var OPTIONS = oui('optionsRangees', 'true');
    var BESTIAIRE = oui('bestiaireRange', 'true');

    function milliers(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

    //=========================================================================
    // ① Les mots écrits en dur : l'écran d'équipement (TSR_EquipSlots)
    //=========================================================================
    var MOTS = { remove: 'Retirer', optimize: 'Optimiser', cancel: 'Annuler', change: 'Changer', equip: 'Équiper' };
    LesMenus.mots = MOTS;
    if (typeof Scene_Equip !== 'undefined' && Scene_Equip.prototype.equipCommandList === undefined) {
        // TSR range sa liste [nom, symbole] dans une méthode de la scène : on la retrouve par ce qu'elle rend
        Object.getOwnPropertyNames(Scene_Equip.prototype).forEach(function (k) {
            var f = Scene_Equip.prototype[k];
            if (typeof f !== 'function' || !/cmdList\.push\(\['optimize'/.test(String(f))) { return; }
            Scene_Equip.prototype[k] = function () {
                var l = f.apply(this, arguments);
                if (Array.isArray(l)) { l.forEach(function (c) { if (Array.isArray(c) && MOTS[c[0]]) { c[0] = MOTS[c[0]]; } }); }
                return l;
            };
            LesMenus._equipTraduit = k;
        });
    }

    //=========================================================================
    // ③ Le Statut : la description en entier
    //=========================================================================
    if (typeof Window_Status !== 'undefined') {
        Window_Status.prototype.drawProfile = function (x, y) {
            var texte = this._actor ? String(this._actor.profile() || '') : '';
            if (!texte) { return; }
            var avant = this.contents.fontSize, moi = this;
            var largeur = this.contentsWidth() - x * 2, haut = this.contentsHeight() - y;
            var corps = [20, 18, 17, 16, 15, 14, 13], lignes = [], inter = 24;
            function replier() {
                var out = [];
                texte.split('\n').forEach(function (para) {
                    var c = '';
                    para.split(' ').forEach(function (mot) {
                        var essai = c ? c + ' ' + mot : mot;
                        if (moi.textWidth(essai) > largeur && c) { out.push(c); c = mot; } else { c = essai; }
                    });
                    if (c) { out.push(c); }
                });
                return out;
            }
            for (var i = 0; i < corps.length; i++) {
                this.contents.fontSize = corps[i]; inter = corps[i] + 4;
                lignes = replier();
                if (lignes.length * inter <= haut + 4) { break; }
            }
            var dispo = Math.max(1, Math.floor((haut + 4) / inter));
            if (lignes.length > dispo) { lignes = lignes.slice(0, dispo); lignes[dispo - 1] += ' …'; }
            this._profilLignes = lignes.length; this._profilCoupe = / …$/.test(lignes[lignes.length - 1] || '');
            // drawText centre son texte dans une ligne de 36 px : on la pose pour que l'interligne soit le nôtre
            lignes.forEach(function (l, k) { moi.drawText(l, x, y + k * inter - Math.floor((moi.lineHeight() - inter) / 2), largeur); });
            this.contents.fontSize = avant;
        };
    }

    //=========================================================================
    // ③ bis L'écran d'équipement : la description replie sur ses deux lignes
    //=========================================================================
    // TSR_EquipSlots écrit la description d'une seule traite (drawTextEx) dans une case de deux lignes : une longue
    // phrase sortait du cadre (« Relique du Fond : un objet qui n'existe pas… », les pièces de la forge, les armes
    // d'ombre). Elle se replie aux espaces sur les deux lignes, et le corps se resserre (18 → 13) jusqu'à ce qu'elle
    // tienne. Une description qui porte des codes (\C[n]…) reste dessinée comme avant.
    if (typeof Window_EquipHelp !== 'undefined' && Window_EquipHelp.prototype.drawDescriptionBox) {
        var _descEquip = Window_EquipHelp.prototype.drawDescriptionBox;
        Window_EquipHelp.prototype.drawDescriptionBox = function (x, y, w, h) {
            var texte = String(this._description || '');
            if (!texte || /\\/.test(texte)) { _descEquip.call(this, x, y, w, h); return; }
            if (TSR && TSR.equipSlots && TSR.equipSlots._BG_rect_help && this._item) { this.drawRect(0, y, w, h * 2); }
            this.resetTextColor();
            var moi = this, largeur = this.contentsWidth() - x * 2, haut = h * 2, avant = this.contents.fontSize;
            var corps = [18, 17, 16, 15, 14, 13], lignes = [], inter = 22;
            function replier() {
                var out = [];
                texte.split('\n').forEach(function (para) {
                    var c = '';
                    para.split(' ').forEach(function (mot) {
                        var essai = c ? c + ' ' + mot : mot;
                        if (moi.textWidth(essai) > largeur && c) { out.push(c); c = mot; } else { c = essai; }
                    });
                    if (c) { out.push(c); }
                });
                return out;
            }
            for (var i = 0; i < corps.length; i++) {
                this.contents.fontSize = corps[i]; inter = corps[i] + 4;
                lignes = replier();
                if (lignes.length * inter <= haut) { break; }
            }
            var dispo = Math.max(1, Math.floor(haut / inter));
            if (lignes.length > dispo) { lignes = lignes.slice(0, dispo); lignes[dispo - 1] += ' …'; }
            this._descLignes = lignes.length;
            lignes.forEach(function (l, k) { moi.contents.drawText(l, x, y + k * inter, largeur, inter, 'left'); });
            this.contents.fontSize = avant;
        };
    }

    //=========================================================================
    // ② Les Carnets
    //=========================================================================
    var _liste = Window_MenuCommand.prototype.makeCommandList;
    Window_MenuCommand.prototype.makeCommandList = function () {
        _liste.call(this);
        this._carnets = [];
        if (!CARNETS.length) { return; }
        var garde = [], moi = this;
        this._list.forEach(function (c) { if (CARNETS.indexOf(c.symbol) >= 0) { moi._carnets.push(c); } else { garde.push(c); } });
        if (this._carnets.length < 2) { this._carnets = []; return; }           // une seule : elle reste où elle est
        var i = -1; garde.forEach(function (c, k) { if (c.symbol === APRES) { i = k; } });
        var ligne = { name: NOM_CARNETS, symbol: 'carnets', enabled: true, ext: null };
        if (i >= 0) { garde.splice(i + 1, 0, ligne); } else { garde.push(ligne); }
        this._list = garde;
    };

    function Window_Carnets() { this.initialize.apply(this, arguments); }
    Window_Carnets.prototype = Object.create(Window_Command.prototype);
    Window_Carnets.prototype.constructor = Window_Carnets;
    Window_Carnets.prototype.initialize = function (x, y, liste) {
        this._carnets = liste || [];
        Window_Command.prototype.initialize.call(this, x, y);
    };
    Window_Carnets.prototype.windowWidth = function () { return 240; };
    Window_Carnets.prototype.numVisibleRows = function () { return Math.max(1, (this._carnets || []).length); };
    Window_Carnets.prototype.makeCommandList = function () {
        var moi = this;
        (this._carnets || []).forEach(function (c) { moi.addCommand(c.name, c.symbol, c.enabled, c.ext); });
    };
    LesMenus.Window_Carnets = Window_Carnets;

    var _commandes = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        _commandes.call(this);
        this._commandWindow.setHandler('carnets', this.commandeCarnets.bind(this));
    };
    Scene_Menu.prototype.commandeCarnets = function () {
        var cw = this._commandWindow, moi = this;
        if (!this._carnetsWindow) {
            var r = cw.itemRect(cw.index());
            var y = Math.min(cw.y + r.y, Graphics.boxHeight - (cw._carnets.length * 36 + 36));
            this._carnetsWindow = new Window_Carnets(cw.x + cw.width - 24, Math.max(0, y), cw._carnets);
            cw._carnets.forEach(function (c) {
                // la commande garde son écran : c'est le gestionnaire que le menu lui avait donné
                moi._carnetsWindow.setHandler(c.symbol, function () {
                    moi._carnetsWindow.hide(); moi._carnetsWindow.deactivate();
                    LesMenus._dernierCarnet = c.symbol;
                    if (cw._handlers[c.symbol]) { cw._handlers[c.symbol](); } else { cw.activate(); }
                });
            });
            this._carnetsWindow.setHandler('cancel', function () { moi._carnetsWindow.hide(); moi._carnetsWindow.deactivate(); cw.activate(); });
            this.addWindow(this._carnetsWindow);
        }
        this._carnetsWindow.show(); this._carnetsWindow.activate();
        var i = this._carnetsWindow.findSymbol(LesMenus._dernierCarnet);
        this._carnetsWindow.select(i >= 0 ? i : 0);
    };

    //=========================================================================
    // ⑥ Le menu principal
    //=========================================================================
    if (REFAIT) {
        Window_MenuCommand.prototype.windowWidth = function () { return 240; };
        Window_MenuCommand.prototype.numVisibleRows = function () { return Math.min(10, this.maxItems()); };
        Window_MenuStatus.prototype.windowWidth = function () { return Graphics.boxWidth - 240; };
        Window_MenuStatus.prototype.windowHeight = function () { return Graphics.boxHeight; };
        Window_MenuStatus.prototype.numVisibleRows = function () { return Math.max(4, Math.min(5, $gameParty.size())); };
        Window_MenuStatus.prototype.itemHeight = function () {
            return Math.floor((this.height - this.padding * 2) / this.numVisibleRows());
        };
        Window_MenuStatus.prototype.drawItemImage = function (index) {
            var a = $gameParty.members()[index], r = this.itemRect(index);
            var h = Math.min(r.height - 8, 144), l = Math.min(h, 144);
            this.changePaintOpacity(a.isBattleMember());
            this.drawFace(a.faceName(), a.faceIndex(), r.x + 2, r.y + 4, l, h);
            this.changePaintOpacity(true);
        };
        Window_MenuStatus.prototype.jauge = function (x, y, w, nom, valeur, max, c1, c2) {
            var taux = max > 0 ? Math.max(0, Math.min(1, valeur / max)) : 0;
            this.contents.fillRect(x, y + 13, w, 6, this.gaugeBackColor());
            if (taux > 0) { this.contents.gradientFillRect(x, y + 13, Math.max(2, Math.round(w * taux)), 6, c1, c2); }
            this.contents.fontSize = 15;
            this.changeTextColor(this.systemColor());
            this.drawText(nom, x, y - 14, 34, 'left');
            this.contents.fontSize = 16;
            var vie = nom === TextManager.hpA;
            this.changeTextColor(vie && valeur <= 0 ? this.deathColor() : vie && taux < 0.25 ? this.crisisColor() : this.normalColor());
            this.drawText(milliers(valeur) + ' / ' + milliers(max), x + 34, y - 14, w - 34, 'right');
        };
        LesMenus.nomPT = function () { return TextManager.tpA; };
        Window_MenuStatus.prototype.drawItemStatus = function (index) {
            var a = $gameParty.members()[index], r = this.itemRect(index);
            var x = r.x + Math.min(r.height - 8, 144) + 14, w = r.x + r.width - x - 6, y = r.y;
            var pas = Math.max(22, Math.floor((r.height - 34) / 3));
            // le nom, la classe et le niveau
            this.contents.fontSize = 22;
            this.changeTextColor(this.hpColor(a));
            var ln = Math.min(this.textWidth(a.name()), 150);
            this.drawText(a.name(), x, y - 4, 150, 'left');
            this.contents.fontSize = 15;
            this.changeTextColor(this.textColor(7));
            this.drawText(a.currentClass().name + ' · ' + TextManager.levelA + ' ' + a.level, x + ln + 10, y - 3, w - ln - 10 - 70, 'left');
            // ses états, à droite
            var icones = a.allIcons().slice(0, 2);
            for (var i = 0; i < icones.length; i++) { this.drawIcon(icones[i], x + w - (icones.length - i) * 34, y); }
            // les trois barres
            var y0 = y + 42;
            this.jauge(x, y0, w, TextManager.hpA, a.hp, a.mhp, this.hpGaugeColor1(), this.hpGaugeColor2());
            this.jauge(x, y0 + pas, w, TextManager.mpA, a.mp, a.mmp, this.mpGaugeColor1(), this.mpGaugeColor2());
            this.jauge(x, y0 + pas * 2, w, TextManager.tpA, a.tp, a.maxTp ? a.maxTp() : 100, this.tpGaugeColor1(), this.tpGaugeColor2());
            this.resetFontSettings();
        };

        // ── le lieu, l'heure, les âmes, l'or
        function Window_Lieu() { this.initialize.apply(this, arguments); }
        Window_Lieu.prototype = Object.create(Window_Base.prototype);
        Window_Lieu.prototype.constructor = Window_Lieu;
        Window_Lieu.prototype.initialize = function (x, y, w, h) {
            Window_Base.prototype.initialize.call(this, x, y, w, h);
            this._minute = -1;
            this.refresh();
        };
        LesMenus.lieu = function () {
            var n = $gameMap && $gameMap.displayName ? String($gameMap.displayName() || '') : '';
            if (!n && $dataMapInfos && $dataMapInfos[$gameMap.mapId()]) { n = String($dataMapInfos[$gameMap.mapId()].name || ''); }
            return n;
        };
        LesMenus.heure = function () {
            var s = $gameSystem;
            if (!s || typeof s.hour !== 'function') { return null; }
            var h = Number(s.hour()) || 0, m = typeof s.minute === 'function' ? Number(s.minute()) || 0 : 0;
            var jour = typeof s.day_week_name === 'function' ? String(s.day_week_name() || '') : '';
            return { jour: jour, texte: h + ' h ' + (m < 10 ? '0' : '') + m };
        };
        LesMenus.ames = function () { return (window.Porteur && typeof Porteur.ames === 'function') ? Porteur.ames() : null; };
        Window_Lieu.prototype.ligne = function (nom, valeur, y, couleur) {
            var w = this.contentsWidth();
            this.contents.fontSize = 15;
            this.changeTextColor(this.systemColor());
            this.drawText(nom, 0, y, 84, 'left');
            this.contents.fontSize = 18;
            this.changeTextColor(couleur || this.normalColor());
            this.drawText(valeur, 84, y, w - 84, 'right');
        };
        Window_Lieu.prototype.refresh = function () {
            this.contents.clear();
            var w = this.contentsWidth(), y = -4, h = LesMenus.heure(), a = LesMenus.ames(), lieu = LesMenus.lieu();
            if (lieu) {
                this.contents.fontSize = 18;
                this.changeTextColor(this.textColor(14));
                this.drawText(lieu, 0, y, w, 'center');
                y += 28;
                this.contents.fillRect(0, y + 4, w, 1, this.textColor(7));
                y += 6;
            }
            if (h) {
                if (h.jour) { this.ligne('Jour', h.jour, y); y += 28; }
                this.ligne('Heure', h.texte, y); y += 28;
            }
            if (a !== null) { this.ligne('✦ Âmes', String(a), y, '#B79CF5'); y += 28; }
            this.ligne(TextManager.currencyUnit || 'Or', milliers($gameParty.gold()), y, this.textColor(17));
            this.resetFontSettings();
        };
        Window_Lieu.prototype.update = function () {
            Window_Base.prototype.update.call(this);
            var m = $gameSystem && typeof $gameSystem.minute === 'function' ? $gameSystem.minute() : 0;
            if (m !== this._minute || $gameParty.gold() !== this._or) { this._minute = m; this._or = $gameParty.gold(); this.refresh(); }
        };
        LesMenus.Window_Lieu = Window_Lieu;

        var _creer = Scene_Menu.prototype.create;
        Scene_Menu.prototype.create = function () {
            _creer.call(this);
            var cw = this._commandWindow, sw = this._statusWindow, moi = this;
            // toutes les commandes à l'écran, sans défiler (dix au plus)
            var hc = cw.fittingHeight(Math.min(10, cw.maxItems()));
            if (cw.height !== hc) { var ic = cw.index(); cw.move(0, 0, cw.width, hc); cw.createContents(); cw.refresh(); cw.select(ic); }
            cw.x = 0; cw.y = 0;
            sw.x = cw.width; sw.y = 0;
            // le lieu, l'heure, les âmes et l'or tiennent dans une seule fenêtre : celles d'avant (l'or, et la
            // ligne « ✦ 0 » posée au-dessus) sont cachées, pas retirées
            var bas = cw.y + cw.height;
            this._windowLayer.children.forEach(function (w) {
                if (w === cw || w === sw || w === moi._carnetsWindow) { return; }
                if (w.x < cw.width && w.y + w.height > bas && w.width <= cw.width + 8) { w.hide(); }
            });
            this._lieuWindow = new Window_Lieu(0, bas, cw.width, Graphics.boxHeight - bas);
            this.addWindow(this._lieuWindow);
        };
    }

    //=========================================================================
    // ④ Le Bestiaire : les rencontrés d'abord
    //=========================================================================
    if (BESTIAIRE && typeof Scene_EnemyBook !== 'undefined') {
        var _bestiaire = Scene_EnemyBook.prototype.create;
        LesMenus.bestiaire = function () {
            var vus = 0, total = 0;
            for (var i = 1; i < $dataEnemies.length; i++) {
                var e = $dataEnemies[i];
                if (!e || !e.name || e.meta.book === 'no') { continue; }
                total++; if ($gameSystem.isInEnemyBook(e)) { vus++; }
            }
            return { vus: vus, total: total };
        };
        Scene_EnemyBook.prototype.create = function () {
            // les deux fenêtres sont privées au plugin : on les rejoint par la scène, une fois
            if (!LesMenus._bestiairePose) {
                var W = null, S = null, _c = Scene_EnemyBook.prototype.create;
                _bestiaire.call(this);
                W = this._indexWindow.constructor.prototype; S = this._statusWindow.constructor.prototype;
                var _refresh = W.refresh, _dessin = W.drawItem, _statut = S.refresh;
                W.refresh = function () {
                    var tous = [], vus = [], inconnus = 0;
                    for (var i = 1; i < $dataEnemies.length; i++) { var e = $dataEnemies[i]; if (e && e.name && e.meta.book !== 'no') { tous.push(e); } }
                    tous.forEach(function (e) { if ($gameSystem.isInEnemyBook(e)) { vus.push(e); } else { inconnus++; } });
                    this._inconnus = inconnus;
                    this._list = vus;
                    if (inconnus > 0) { this._list.push({ _inconnus: inconnus }); }
                    this.createContents();
                    this.drawAllItems();
                };
                W.drawItem = function (index) {
                    var e = this._list[index];
                    if (e && e._inconnus) {
                        var r = this.itemRectForText(index);
                        this.changeTextColor(this.textColor(7));
                        this.drawText('?????? × ' + e._inconnus, r.x, r.y, r.width);
                        this.resetTextColor();
                        return;
                    }
                    _dessin.call(this, index);
                };
                S.refresh = function () {
                    var e = this._enemy;
                    if (e && !e._inconnus && $gameSystem.isInEnemyBook(e)) { _statut.call(this); return; }
                    this.contents.clear();
                    if (this._enemySprite) { this._enemySprite.bitmap = null; }
                    var c = LesMenus.bestiaire(), w = this.contentsWidth(), y = Math.floor(this.contentsHeight() / 2) - 60;
                    this.contents.fontSize = 34;
                    this.changeTextColor(this.textColor(14));
                    this.drawText(c.vus + ' / ' + c.total, 0, y, w, 'center');
                    this.contents.fontSize = 20;
                    this.changeTextColor(this.normalColor());
                    this.drawText(c.vus > 1 ? 'créatures rencontrées' : c.vus === 1 ? 'créature rencontrée' : 'aucune créature rencontrée', 0, y + 42, w, 'center');
                    this.contents.fontSize = 16;
                    this.changeTextColor(this.textColor(7));
                    this.drawText(c.vus < c.total ? 'Une créature entre dans le bestiaire la première fois qu\'on la combat.' : 'Le bestiaire est complet.', 0, y + 84, w, 'center');
                    this.resetFontSettings();
                };
                LesMenus._bestiairePose = true;
                // cette première scène a déjà dessiné l'ancienne liste : on la refait
                this._indexWindow.refresh(); this._indexWindow.select(0); this._indexWindow.setTopRow(0);
                this._statusWindow._enemy = undefined; this._indexWindow.updateStatus();
                return;
            }
            _bestiaire.call(this);
            if (this._indexWindow.index() >= this._indexWindow.maxItems()) { this._indexWindow.select(0); this._indexWindow.setTopRow(0); }
        };
    }

    //=========================================================================
    // ⑤ Les Options, par groupes
    //=========================================================================
    var GROUPES = [
        { cle: 'jeu', nom: 'Jeu' },
        { cle: 'combat', nom: 'Combat' },
        { cle: 'affichage', nom: 'Affichage' },
        { cle: 'son', nom: 'Son' }
    ];
    // à quel groupe va une option : par son symbole, puis par son nom
    LesMenus.groupeDe = function (c) {
        var s = String(c.symbol || ''), n = String(c.name || '').toLowerCase();
        if (/volume|bgm|bgs|^me|^se|ambiance|son\b|audio/i.test(s) || /volume|sons? |musique/.test(n)) { return 'son'; }
        if (/combat|battle|difficult|commandRemember|atb|ctb|animation/i.test(s) || /combat|difficulté|se rappeler|animations/.test(n)) { return 'combat'; }
        if (/synch|fps|tile|anim|effet|visuel|affich|texte|text|lumi|filtre|ecran|screen|decor/i.test(s) || /décors|fps|effets|texte|écran|affichage|police/.test(n)) { return 'affichage'; }
        return 'jeu';
    };
    if (OPTIONS) {
        var _options = Window_Options.prototype.makeCommandList;
        Window_Options.prototype.makeCommandList = function () {
            _options.call(this);
            var par = {}, moi = this;
            this._list.forEach(function (c) { var g = LesMenus.groupeDe(c); (par[g] = par[g] || []).push(c); });
            var out = [];
            GROUPES.forEach(function (g) {
                if (!par[g.cle] || !par[g.cle].length) { return; }
                out.push({ name: g.nom, symbol: 'titre_' + g.cle, enabled: false, ext: null });
                out = out.concat(par[g.cle]);
            });
            this._list = out;
        };
        function titre(w, i) { var s = w.commandSymbol(i); return typeof s === 'string' && s.indexOf('titre_') === 0; }
        var _dessinOption = Window_Options.prototype.drawItem;
        Window_Options.prototype.drawItem = function (index) {
            if (!titre(this, index)) { _dessinOption.call(this, index); return; }
            var r = this.itemRectForText(index);
            this.changePaintOpacity(true);
            this.contents.fontSize = 17;
            this.changeTextColor(this.textColor(14));
            this.drawText('— ' + this.commandName(index) + ' —', r.x, r.y + 3, r.width, 'center');
            this.resetFontSettings();
        };
        var _choisir = Window_Options.prototype.select;
        Window_Options.prototype.select = function (index) {
            var n = this.maxItems();
            if (n > 0 && index >= 0 && index < n && titre(this, index)) {
                var sens = (this._index !== undefined && index < this._index) ? -1 : 1;
                if (this._index === n - 1 && index === 0) { sens = 1; }
                if (this._index === 1 && index === 0) { sens = -1; }
                var i = index, tours = 0;
                while (titre(this, i) && tours < n) { i = (i + sens + n) % n; tours++; }
                index = i;
            }
            _choisir.call(this, index);
        };
        var _okOption = Window_Options.prototype.processOk;
        Window_Options.prototype.processOk = function () { if (titre(this, this.index())) { return; } _okOption.call(this); };
    }
})();
