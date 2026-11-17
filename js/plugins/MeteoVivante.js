//=============================================================================
// MeteoVivante.js — v1.0  ·  Il pleut, il neige, il fait nuit : et ça se voit
// RPG Maker MV   ·   pour JOKO
//   À charger APRÈS MOG_TimeSystem, MOG_Weather_EX, Interieurs, VieDuVillage
//   et Embellie ; AVANT Allegement.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Météo vivante : un temps qui change avec les jours et les
 * saisons (pluie, orage, brouillard, neige), sons d'ambiance, éclairs.
 * @author JOKO
 *
 * @param actif
 * @text Météo vivante
 * @type boolean
 * @on oui
 * @off non
 * @default true
 *
 * @param sons
 * @text Sons d'ambiance
 * @type boolean
 * @on oui
 * @off non
 * @default true
 * @desc Pluie, orage, vent, grillons la nuit. Étouffés à l'intérieur. Jamais par-dessus le son d'ambiance d'une carte.
 *
 * @param volume
 * @text Volume des ambiances (%)
 * @type number
 * @min 0
 * @max 100
 * @default 60
 *
 * @param eclairs
 * @text Éclairs pendant l'orage
 * @type boolean
 * @on oui
 * @off non
 * @default true
 * @desc Un éclair blanc bref, puis le tonnerre une seconde plus tard.
 *
 * @param pluie
 * @text Fréquence du mauvais temps (%)
 * @type number
 * @min 0
 * @max 300
 * @default 100
 * @desc 100 = normal. 0 = toujours beau. 200 = deux fois plus de pluie, de neige, de brouillard.
 *
 * @help
 * ═══════════════════════════════════════════════════════════════════════════
 *  MÉTÉO VIVANTE
 * ═══════════════════════════════════════════════════════════════════════════
 *  JOKO, 2026-10-02 : « améliore encore la beauté, l'immersion et la logique
 *  de l'environnement météo ». Constaté avant :
 *   · chaque saison affichait un décor fixe (feuilles, nuages, scintillements
 *     en hiver) : il ne pleuvait, ne neigeait, ne brumait jamais ;
 *   · les rayons de soleil des villes (note de carte « SunLight ») restaient
 *     là en pleine nuit ;
 *   · les habitants « rentrent sous la pluie » (VieDuVillage), mais lisaient
 *     la météo de MV, que personne ne met : ils ne rentraient jamais ;
 *   · aucun son : ni pluie, ni vent, ni orage.
 *
 *  LE TEMPS QU'IL FAIT
 *   Deux fois par jour (minuit, midi), le temps se tire selon la saison, et
 *   le temps d'avant a des chances de continuer (une journée de pluie ne
 *   s'arrête pas d'un coup). Il est le même partout dans le monde.
 *     printemps : beau, nuageux, pluie, parfois orage, brume au matin
 *     été       : surtout beau, orages
 *     automne   : nuageux, pluie, brouillard
 *     hiver     : neige, beau froid, tempête de neige, brouillard
 *   Les décors de saison (tes événements communs 60 à 63) restent sur leur
 *   couche ; la météo vivante utilise les couches 1 et 2 de MOG_Weather_EX
 *   (pour une météo à toi, prends la couche 3 ou plus). Ses images :
 *   Rain_02 (la vraie goutte — Rain_01A/B sont des étincelles), Snow_01,
 *   Fog_01a.
 *
 *  LA LOGIQUE
 *   · Les rayons de soleil (SunLight) s'effacent la nuit et par mauvais
 *     temps, et reviennent au beau jour. Sous terre (intérieur), jamais de
 *     rayons ni d'ombres de nuages.
 *   · Les papillons ne volent pas la nuit ni sous la pluie.
 *   · Sous la pluie et l'orage, l'écran est plus gris ; dans le brouillard,
 *     plus pâle ; sous la neige, plus froid.
 *   · Les habitants rentrent chez eux sous la pluie et l'orage (sauf les
 *     gardes) : VieDuVillage voit enfin la pluie.
 *   · Les lucioles (Embellie) ne sortent que par nuit claire.
 *
 *  L'IMMERSION
 *   · Dehors : pluie, orage, vent de tempête ; grillons les nuits claires
 *     d'été et de printemps. Dedans : la pluie et l'orage s'entendent,
 *     étouffés. Une carte qui a son propre son d'ambiance le garde.
 *   · Orage : éclair bref, puis le tonnerre, avec le délai de la distance.
 *
 *  OPTIONS (menu Options du jeu) : « Sons d'ambiance » coupe pluie, vent,
 *  grillons et tonnerre ; « Effets visuels » (Embellie) coupe la pluie et la
 *  neige à l'écran. Le temps continue (habitants, teinte) dans les deux cas.
 *
 *  COMMANDES DE PLUGIN (pour tes scènes)
 *     METEO pluie | orage | brouillard | neige | tempete | nuageux | clair
 *     METEO auto          le temps redevient libre
 *  SCRIPT
 *     Meteo.type()        'clair', 'pluie'…
 *     Meteo.est('pluie')  vrai s'il pleut (pour une condition)
 */
var Meteo = window.Meteo || {};
window.Meteo = Meteo;
(function () {
    'use strict';
    var P = PluginManager.parameters('MeteoVivante');
    var ACTIF = String(P.actif || 'true') === 'true';
    var SONS = String(P.sons || 'true') === 'true';
    var VOLUME = Math.max(0, Math.min(100, Number(P.volume === undefined ? 60 : P.volume)));
    var ECLAIRS = String(P.eclairs || 'true') === 'true';
    var FREQ = Math.max(0, Number(P.pluie === undefined ? 100 : P.pluie)) / 100;

    /* ── les temps possibles : rendu MOG (couches 1 et 2), son, teinte ── */
    // ⚠ Réglé sur les images du projet (2026-10-02) : Rain_01A/B sont des
    //   étincelles colorées, la vraie goutte est Rain_02 ; Snow_02/03 sont des
    //   blocs de glace, le flocon est Snow_01. Modes MOG : 12 pluie, 13 pluie
    //   qui éclabousse, 9 neige, 10 tempête de neige, 15 nuages, 32 brouillard
    //   qui défile (une texture répétée : pas de carrés). Le mode 0 des
    //   anciennes recettes est « vent qui tombe », fait pour les feuilles.
    var TEMPS = {
        clair:      { couches: [], son: null },
        nuageux:    { couches: [], son: null, teinte: [-10, -10, -4, 22] },     // ciel couvert : la teinte seule (Cloud_02A est une tache verte)
        pluie:      { couches: ['weather : 1 : 12 : 140 : 110 : 0 : Rain_02 : 1 : 100'], son: 'rain-1min', vol: 70, teinte: [-22, -20, -10, 34], mv: 'rain', mauvais: true },
        orage:      { couches: ['weather : 1 : 13 : 260 : 150 : 0 : Rain_02 : 1 : 100', 'weather : 2 : 32 : 1 : 60 : 0 : Fog_01a : 1 : 200'], opacite: { 2: 60 }, son: 'Storm1', vol: 80, teinte: [-38, -38, -20, 54], mv: 'storm', mauvais: true, eclairs: true },
        brouillard: { couches: ['weather : 2 : 32 : 2 : 25 : 0 : Fog_01a : 1 : 200'], opacite: { 2: 95 }, son: null, teinte: [-4, -2, 4, 46], mauvais: true },
        neige:      { couches: ['weather : 1 : 9 : 130 : 60 : 0 : Snow_01 : 1 : 45'], son: null, teinte: [-8, 0, 14, 18], mv: 'snow', mauvais: true },
        tempete:    { couches: ['weather : 1 : 10 : 260 : 150 : 0 : Snow_01 : 1 : 40', 'weather : 2 : 32 : 1 : 80 : 0 : Fog_01a : 1 : 200'], opacite: { 2: 130 }, son: 'Wind4', vol: 75, teinte: [-18, -10, 10, 40], mv: 'storm', mauvais: true }
    };
    // poids par saison (MOG : 1 printemps · 2 été · 3 automne · 4 hiver) ;
    // le mauvais temps est multiplié par « Fréquence du mauvais temps »
    var SAISONS = {
        1: { clair: 40, nuageux: 25, pluie: 22, orage: 5, brouillard: 8 },
        2: { clair: 62, nuageux: 18, pluie: 6, orage: 12, brouillard: 2 },
        3: { clair: 24, nuageux: 30, pluie: 28, orage: 4, brouillard: 14 },
        4: { clair: 30, nuageux: 15, neige: 35, tempete: 8, brouillard: 12 }
    };

    function saison() { return $gameSystem && $gameSystem.season ? $gameSystem.season() : 1; }
    function heure() { return $gameSystem && $gameSystem.hour ? $gameSystem.hour() : 12; }
    function dehors() { return !(window.Interieurs && Interieurs.est && Interieurs.est()); }
    function nuit() { var h = heure(); return h >= 20 || h < 6; }
    function etat() { return $gameSystem._meteo || ($gameSystem._meteo = { cle: '', type: 'clair', force: null }); }

    function tirer(precedent) {
        var t = SAISONS[saison()] || SAISONS[1], poids = {}, total = 0;
        Object.keys(t).forEach(function (k) { poids[k] = t[k] * (TEMPS[k].mauvais ? FREQ : 1); });
        // le temps d'avant a une chance sur deux de continuer (s'il existe en cette saison)
        if (precedent && poids[precedent] !== undefined && Math.random() < 0.5) return precedent;
        Object.keys(poids).forEach(function (k) { total += poids[k]; });
        if (total <= 0) return 'clair';
        var r = Math.random() * total;
        var ks = Object.keys(poids);
        for (var i = 0; i < ks.length; i++) { r -= poids[ks[i]]; if (r <= 0) return ks[i]; }
        return 'clair';
    }
    // demi-journée courante : année, mois, jour, matin/après-midi
    function cleDuMoment() {
        var s = $gameSystem;
        var j = (s.year ? s.year() : 0) + '-' + (s.month ? s.month() : 0) + '-' + (s.day ? s.day() : 0);
        return j + '-' + (heure() < 12 ? 0 : 1);
    }
    function typeActuel() {
        var e = etat();
        if (e.force) return e.force;
        var cle = cleDuMoment();
        if (e.cle !== cle) {
            e.cle = cle;
            var ancien = e.type;
            e.type = tirer(e.type);
            // la brume, c'est le matin
            if (e.type === 'brouillard' && heure() >= 12 && Math.random() < 0.6) e.type = ancien === 'brouillard' ? 'nuageux' : ancien;
            if (!TEMPS[e.type] || !(SAISONS[saison()] || {})[e.type] && e.type !== 'clair') e.type = 'clair';
        }
        return e.type;
    }
    Meteo.type = function () { return ACTIF ? typeActuel() : 'clair'; };
    Meteo.est = function (t) { return Meteo.type() === t; };
    Meteo.lucioles = function () { var t = Meteo.type(); return t === 'clair' || t === 'nuageux'; };
    Meteo.TEMPS = TEMPS; Meteo.SAISONS = SAISONS;

    /* ── appliquer une commande MOG (comme le fait un événement) ── */
    function commande(texte) {
        // directement chez MOG : la chaîne des commandes de plugin n'aime pas
        // être appelée hors d'un événement (YEP_PictureSpritesheets)
        var mots = texte.split(' ');
        try { $gameSystem.commandSetupWeather(mots.slice(1)); } catch (e) { }
    }
    function couche(i) { return $gameSystem._weatherEX_Data && $gameSystem._weatherEX_Data[i]; }

    /* ── la logique de la couche 0 : rayons et papillons ──
     * On ne touche qu'aux rayons de soleil (SunLight) et aux papillons
     * (ButterFly) : la nuit et par mauvais temps, ils s'effacent ; on garde
     * leur réglage pour les remettre au retour du beau. */
    function coucheZero(type) {
        var c = couche(0); if (!c) return;
        var e = etat();
        var soleil = /^SunLight|^ButterFly/i.test(c.fileName || '') && c.mode >= 0;
        var cachee = !dehors() || nuit() || (TEMPS[type] && TEMPS[type].mauvais);
        // sous terre : jamais de rayons ni d'ombres de nuages
        var nuages = /^Cloud_01/i.test(c.fileName || '') && c.mode >= 0;
        if ((soleil || (nuages && !dehors())) && cachee) {
            e.zero = { mode: c.mode, power: c.power, z: c.z, blendMode: c.blendMode, fileName: c.fileName, speed: c.speed, scale: c.scale, frames: c.frames, frameSpeed: c.frameSpeed, carte: $gameMap.mapId() };
            $gameSystem.clearWeatherEX(0, true);
        } else if (!cachee && e.zero && e.zero.carte === $gameMap.mapId() && (c.mode < 0 || !c.fileName)) {
            var z = e.zero;
            commande('weather : 0 : ' + z.mode + ' : ' + z.power + ' : ' + z.speed + ' : ' + z.blendMode + ' : ' + z.fileName + ' : ' + z.z + ' : ' + z.scale + ' : ' + z.frames + ' : ' + z.frameSpeed);
            e.zero = null;
        }
    }

    /* ── l'option « Sons d'ambiance » (menu Options) ── */
    ConfigManager.ambiance = true;
    var _mk = ConfigManager.makeData;
    ConfigManager.makeData = function () { var c = _mk.call(this); c.ambiance = this.ambiance; return c; };
    var _ap = ConfigManager.applyData;
    ConfigManager.applyData = function (c) { _ap.call(this, c); this.ambiance = c.ambiance === undefined ? true : !!c.ambiance; };
    var _go = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function () { _go.call(this); if (SONS) this.addCommand('Sons d\'ambiance', 'ambiance'); };
    function sonsOk() { return SONS && ConfigManager.ambiance !== false; }
    function visuelOk() { return !window.Embellie || !Embellie.actif || Embellie.actif(); }

    /* ── le son d'ambiance ── */
    function sonVoulu(type) {
        if (!sonsOk()) return null;
        var T = TEMPS[type], s = saison();
        if (T && T.son) return { name: T.son, volume: Math.round(T.vol * VOLUME / 100 * (dehors() ? 1 : 0.35)), pitch: dehors() ? 100 : 85, pan: 0 };
        // les nuits claires d'été et de printemps : les grillons
        if (dehors() && nuit() && (type === 'clair' || type === 'nuageux') && (s === 1 || s === 2)) return { name: 'Night', volume: Math.round(45 * VOLUME / 100), pitch: 100, pan: 0 };
        return null;
    }
    function ambiance(type) {
        var e = etat();
        var actuel = AudioManager._currentBgs;
        // une carte qui a son propre son d'ambiance le garde ; un son posé par
        // un événement aussi (ce n'est pas le nôtre)
        if ($dataMap && $dataMap.autoplayBgs && $dataMap.bgs && $dataMap.bgs.name) return;
        if (actuel && actuel.name && actuel.name !== e.son) return;
        var v = sonVoulu(type);
        if (!v) { if (e.son && actuel && actuel.name === e.son) AudioManager.fadeOutBgs(2); e.son = null; return; }
        if (actuel && actuel.name === v.name && actuel.volume === v.volume) return;
        AudioManager.playBgs(v);
        if (!actuel || actuel.name !== v.name) AudioManager.fadeInBgs(2);
        e.son = v.name;
    }

    /* ── appliquer le temps : seulement quand quelque chose change ── */
    var _dernier = '';
    function appliquer(forcer) {
        if (!ACTIF || !$gameMap || !$gameMap.mapId() || !$gameSystem._weatherEX_Data) return;
        if ($dataMap && /<Disable Time System>|<Atelier>/i.test($dataMap.note || '')) return;
        var type = typeActuel();
        var cle = [type, dehors(), nuit(), $gameMap.mapId(), saison(), sonsOk(), visuelOk()].join('|');
        if (cle === _dernier && !forcer) return;
        var change = cle.split('|')[0] !== _dernier.split('|')[0];
        _dernier = cle;
        var T = TEMPS[type] || TEMPS.clair;
        // couches 1 et 2 : la météo vivante, dehors seulement
        $gameSystem.clearWeatherEX(1, true); $gameSystem.clearWeatherEX(2, true);
        if (dehors() && visuelOk()) T.couches.forEach(commande);
        coucheZero(type);
        ambiance(type);
        // la teinte suit le temps (Embellie ou MOG la recalcule)
        if ($gameSystem.allow_tint_screen && $gameSystem.allow_tint_screen() && $gameSystem.set_tint_phase) {
            $gameScreen.startTint($gameSystem.set_tint_phase(), change ? 120 : 1);
        }
    }
    Meteo.appliquer = function () { appliquer(true); };

    // la teinte : celle de l'heure (MOG / Embellie), assombrie par le temps
    if (ACTIF && Game_System.prototype.set_tint_phase) {
        var _tint = Game_System.prototype.set_tint_phase;
        Game_System.prototype.set_tint_phase = function () {
            var t = _tint.call(this);
            var T = TEMPS[Meteo.type()];
            if (!T || !T.teinte || !dehors()) return t;
            var r = [t[0] + T.teinte[0], t[1] + T.teinte[1], t[2] + T.teinte[2], Math.min(255, t[3] + T.teinte[3])];
            if (!Graphics.isWebGL()) r[3] = t[3];      // le gris coûte cher en mode Canvas (voir Embellie)
            return r;
        };
    }

    // pour les habitants : la pluie de la météo vivante est une vraie pluie
    if (ACTIF) {
        var _wt = Game_Screen.prototype.weatherType;
        Game_Screen.prototype.weatherType = function () {
            var t = _wt.call(this);
            if (t && t !== 'none') return t;
            var T = TEMPS[Meteo.type()];
            return T && T.mv && dehors() ? T.mv : t;
        };
    }

    /* ── l'orage : éclair, puis tonnerre ── */
    var _prochainEclair = 0, _tonnerre = 0;
    function orage() {
        if (!ECLAIRS || !Meteo.est('orage')) return;
        var f = Graphics.frameCount;
        if (!_prochainEclair) _prochainEclair = f + 300 + Math.randomInt(600);
        if (f >= _prochainEclair) {
            _prochainEclair = f + 360 + Math.randomInt(780);    // 6 à 19 s
            if (dehors()) $gameScreen.startFlash([255, 255, 255, 110 + Math.randomInt(70)], 6 + Math.randomInt(6));
            _tonnerre = f + 20 + Math.randomInt(70);            // la distance : 0,3 à 1,5 s
        }
        if (_tonnerre && f >= _tonnerre) {
            _tonnerre = 0;
            if (sonsOk()) AudioManager.playSe({ name: 'Thunder' + (1 + Math.randomInt(5)), volume: Math.round((dehors() ? 75 : 35) * VOLUME / 60), pitch: 85 + Math.randomInt(25), pan: Math.randomInt(60) - 30 });
        }
    }

    /* ── la transparence des couches (le brouillard de MOG est opaque) ── */
    function opacites(ss) {
        if (!ss || !ss._weatherEXSprites) return;
        var T = TEMPS[Meteo.type()] || TEMPS.clair, o = T.opacite || {};
        [1, 2].forEach(function (i) { var sp = ss._weatherEXSprites[i]; if (sp) sp.opacity = o[i] !== undefined ? o[i] : 255; });
    }

    /* ── branchement ── */
    var _start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _start.call(this);
        _dernier = '';
        // laisser une image aux notes de carte et aux événements de saison
        this._meteoAttente = 2;
    };
    var _upd = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _upd.call(this);
        if (!ACTIF) return;
        if (this._meteoAttente > 0) { if (--this._meteoAttente === 0) appliquer(true); return; }
        if (Graphics.frameCount % 30 === 0) appliquer(false);
        orage();
        opacites(this._spriteset);
    };

    var _cmd = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _cmd.call(this, command, args);
        if (String(command).toUpperCase() !== 'METEO') return;
        var t = String(args[0] || '').toLowerCase().replace('ê', 'e');
        var e = etat();
        if (t === 'auto') e.force = null;
        else if (TEMPS[t]) e.force = t;
        appliquer(true);
    };
})();
