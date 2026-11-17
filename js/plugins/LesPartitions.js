//=============================================================================
// LesPartitions.js — v1.0
// Tes partitions dans le Theatrhythm de MOG : la musique, le tempo, et chaque
// note à l'endroit où TU l'as posée. Sans partition, MOG comme avant.
//=============================================================================
/*:
 * @plugindesc v1.0 ■ Le Theatrhythm de MOG joue TES partitions (écrites dans le
 * Studio → Rythmes). Sans partition : MOG, au hasard, comme avant.
 * @author pour JOKO
 *
 * @param dossier
 * @text Dossier des partitions
 * @default data/rythmes/
 * @desc Là où le Studio les range (une partition = un fichier .json).
 *
 * @param finDeLaPartition
 * @text Quand la partition est finie
 * @type select
 * @option victoire
 * @option boucle
 * @default victoire
 * @desc victoire : comme FNF, tenir jusqu'au bout = gagner. boucle : elle reprend du début jusqu'à ce que quelqu'un tombe (comme MOG).
 *
 * @param silenceSansNote
 * @text Appuyer quand aucune note n'est là
 * @type select
 * @option rien
 * @option rate
 * @default rien
 * @desc rien : pas de pénalité entre deux notes. rate : comme MOG, la touche compte comme un raté (s'il y a une note à l'écran).
 *
 * @help
 * ============================================================================
 *  LES PARTITIONS — ce qui change, et ce qui ne change pas
 * ============================================================================
 * MOG_Theatrhythm.js n'est pas touché : sa scène, ses images, ses 4 couloirs,
 * ses boutons, ses dégâts, son score, sa victoire et sa défaite restent les
 * siens. Ce plugin ne fait qu'une chose : quand tu lui donnes une partition,
 * les notes ne sont plus tirées au hasard. Chacune arrive au moment, dans le
 * couloir et avec le bouton que tu as choisis, calée sur la musique.
 *
 * LA COMMANDE (celle de MOG, plus le nom de ta partition) :
 *
 *     theatrhythm : 817 : 6 : chant_du_troll
 *
 *   817             l'ennemi (comme avant)
 *   6               la vitesse, si la partition n'en donne pas
 *   chant_du_troll  la partition (data/rythmes/chant_du_troll.json)
 *
 * Sans le 4e mot, rien ne change : MOG tire ses notes au hasard.
 * Le nom : lettres, chiffres, _ et - (pas d'espace).
 *
 * LA PARTITION (le Studio l'écrit pour toi) :
 *   musique    la musique qui joue (audio/bgm), au lieu de la musique de combat
 *   notes      chaque note : son moment (en secondes depuis le début de la
 *              musique), son couloir (1er, 2e, 3e, 4e héros) et son bouton
 *              (A, S, Z, X, ↑, →, ←, ↓ — les 8 de MOG)
 *   vitesses   « à partir d'ici, ça accélère » : la vitesse des notes suivantes
 *
 * Moins de héros que de couloirs : le couloir 3 d'une équipe de 2 revient sur
 * le 1er héros (3 → 1, 4 → 2). Partition introuvable : MOG joue au hasard, et
 * la console (F8) dit pourquoi.
 */

var LesPartitions = LesPartitions || {};

(function () {
    'use strict';

    var P = PluginManager.parameters('LesPartitions');
    var DOSSIER = String(P.dossier || 'data/rythmes/').replace(/\\/g, '/').replace(/\/?$/, '/');
    var FIN = String(P.finDeLaPartition || 'victoire');
    var SILENCE = String(P.silenceSansNote || 'rien');

    LesPartitions._attente = null;   // la partition demandée, prête pour la prochaine scène
    LesPartitions._chargement = false;

    // ── charger une partition (comme MV charge ses données) ─────────────────
    LesPartitions.charger = function (nom, rappel) {
        var xhr = new XMLHttpRequest();
        var url = DOSSIER + encodeURIComponent(nom) + '.json';
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = function () {
            if (xhr.status < 400) {
                try { rappel(LesPartitions.preparer(JSON.parse(xhr.responseText), nom)); return; }
                catch (e) { console.warn('LesPartitions : « ' + nom + ' » illisible — ' + e.message); }
            } else {
                console.warn('LesPartitions : « ' + url + ' » introuvable — MOG joue au hasard.');
            }
            rappel(null);
        };
        xhr.onerror = function () { console.warn('LesPartitions : « ' + url + ' » introuvable — MOG joue au hasard.'); rappel(null); };
        xhr.send();
    };

    // les notes triées, chacune avec sa vitesse (celle du dernier « ça accélère » avant elle)
    LesPartitions.preparer = function (p, nom) {
        var vitesses = (p.vitesses || []).filter(function (v) { return v && isFinite(v.t) && v.v > 0; })
            .sort(function (a, b) { return a.t - b.t; });
        var base = Number(p.vitesse) > 0 ? Number(p.vitesse) : 0;
        var notes = (p.notes || []).filter(function (n) { return n && isFinite(n.t) && n.t >= 0; }).map(function (n) {
            var v = base;
            vitesses.forEach(function (x) { if (x.t <= n.t + 1e-6) v = Number(x.v); });
            return { t: Number(n.t), c: Math.max(0, Math.floor(n.c) || 0), b: Math.min(7, Math.max(0, Math.floor(n.b) || 0)), v: v };
        }).sort(function (a, b) { return a.t - b.t; });
        var derniere = notes.length ? notes[notes.length - 1].t : 0;
        return {
            nom: nom,
            musique: p.musique && p.musique.name ? p.musique : null,
            vitesse: base,
            notes: notes,
            fin: Number(p.fin) > derniere ? Number(p.fin) : derniere + 1.5
        };
    };

    // ── la commande : « theatrhythm : ennemi : vitesse : partition » ─────────
    var _commande = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _commande.call(this, command, args);
        if (command !== 'theatrhythm') return;
        LesPartitions._attente = null;
        if (!args || args.length < 6 || !args[5]) return;
        var nom = String(args[5]).trim();
        $gameSystem._theatrhythm_start = false;          // la scène attend sa partition
        LesPartitions._chargement = true;
        LesPartitions._attente = null;
        this.setWaitMode('partition');
        LesPartitions.charger(nom, function (p) {
            LesPartitions._attente = p;
            LesPartitions._chargement = false;
            $gameSystem._theatrhythm_start = true;
        });
    };

    var _attendre = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode === 'partition') {
            if (LesPartitions._chargement) return true;
            this._waitMode = '';
            return false;
        }
        return _attendre.call(this);
    };

    // ── la scène : elle prend sa partition, la musique part avec les notes ───
    var _scene = Scene_Theatrhythm.prototype.initialize;
    Scene_Theatrhythm.prototype.initialize = function () {
        this._partition = LesPartitions._attente;
        LesPartitions._attente = null;
        LesPartitions._enCours = this._partition ? this : null;
        _scene.call(this);
    };

    var _depart = Scene_Theatrhythm.prototype.update_start_phase;
    Scene_Theatrhythm.prototype.update_start_phase = function () {
        if (!this._partition || !this._partition.musique) return _depart.call(this);
        // la musique de la partition partira avec la première note, pas sur « press any key »
        var jouer = BattleManager.playBattleBgm;
        BattleManager.playBattleBgm = function () {};
        try { _depart.call(this); } finally { BattleManager.playBattleBgm = jouer; }
    };

    // le temps de la partition, en secondes : la position de la musique quand
    // elle joue (rien ne se décale, même si le jeu rame), sinon les images
    Scene_Theatrhythm.prototype.tempsPartition = function () {
        var p = this._partition;
        if (!p) return 0;
        if ($gameSystem._theatrhythm_phase !== 1 && this._debutPartition == null) return 0;
        if (this._debutPartition == null) this.lancerPartition();
        var b = this._musiquePartition;
        var images = (Graphics.frameCount - this._debutPartition) / 60;
        var ctx = WebAudio._context;
        if (b && b === AudioManager._bgmBuffer && ctx) {
            if (b.isPlaying() && ctx.state !== 'suspended' && ctx.currentTime > 0) {
                this._partitionAudio = true;
                return Math.max(0, (ctx.currentTime - b._startTime) * (b._pitch || 1)) + (this._tourPartition || 0);
            }
            // la musique se charge encore : les notes l'attendent (3 s au plus,
            // puis elles partent sans elle, au temps des images)
            if (!this._partitionAudio) {
                if (this._attenteMusique == null) this._attenteMusique = Graphics.frameCount;
                if (Graphics.frameCount - this._attenteMusique < 180) { this._debutPartition = Graphics.frameCount; return this._tourPartition || 0; }
            }
        }
        return images + (this._tourPartition || 0);
    };

    // la musique repart du début (même si c'est déjà celle de la carte)
    Scene_Theatrhythm.prototype.lancerPartition = function () {
        var p = this._partition;
        this._debutPartition = Graphics.frameCount;
        this._partitionAudio = false;
        this._attenteMusique = null;
        this._musiquePartition = null;
        if (p.musique) {
            AudioManager.stopBgm();
            AudioManager.playBgm(p.musique, 0);
            this._musiquePartition = AudioManager._bgmBuffer || null;
        }
    };

    // la partition finie : victoire (FNF), ou elle reprend (MOG)
    var _maj = Scene_Theatrhythm.prototype.update;
    Scene_Theatrhythm.prototype.update = function () {
        _maj.call(this);
        var p = this._partition;
        if (!p || $gameSystem._theatrhythm_phase !== 1 || !this._sprite_buttons) return;
        if (this.tempsPartition() < p.fin + (this._tourPartition || 0)) return;
        if (this.partitionEnBoucle()) {
            this._tourPartition = (this._tourPartition || 0) + p.fin;
            this._sprite_buttons.reprendrePartition();
            this.lancerPartition();
            return;
        }
        this.finDePartition();
    };

    // (LeChant les reprend : un chant de combat s'arrête au bout de sa partition)
    Scene_Theatrhythm.prototype.partitionEnBoucle = function () { return FIN === 'boucle'; };
    Scene_Theatrhythm.prototype.finDePartition = function () {
        this._enemySprite._enemy.performCollapse();
        this.battle_end(10);
    };

    var _fin = Scene_Theatrhythm.prototype.terminate;
    Scene_Theatrhythm.prototype.terminate = function () {
        if (LesPartitions._enCours === this) LesPartitions._enCours = null;
        _fin.call(this);
    };

    // ── les notes : nées de la partition, jugées par MOG ─────────────────────
    var _touches = Sprite_TKeys.prototype.initialize;
    Sprite_TKeys.prototype.initialize = function (img, pos) {
        var scene = LesPartitions._enCours;
        this._partitionScene = scene && scene._partition ? scene : null;
        _touches.call(this, img, pos);
        if (!this._partitionScene) return;
        this._noteDe = [];
        for (var i = 0; i < this._keys.length; i++) this.libererNote(i);
        this.reprendrePartition();
    };

    Sprite_TKeys.prototype.reprendrePartition = function () {
        this._prochaine = 0;
    };

    // la case d'une note qui n'est plus là : hors de l'écran, elle ne compte pour rien
    Sprite_TKeys.prototype.libererNote = function (i) {
        this._noteDe[i] = null;
        this._keys_i[i] = 0;
        this._keys_f[i] = false;
        this._keys_r[i] = false;
        this._keys_s[i] = true;
        this._keys[i].x = this._limit[4] + this._cw;
        this._keys[i].opacity = 0;
    };

    Sprite_TKeys.prototype.caseLibre = function () {
        for (var i = 0; i < this._keys.length; i++) { if (!this._noteDe[i]) return i; }
        var s = new Sprite(this._image);
        s.anchor.x = 0.5; s.anchor.y = 0.5;
        this.addChild(s);
        this._keys.push(s);
        this._keys_c.push(0); this._keys_f.push(false); this._keys_h.push(0);
        this._keys_i.push(0); this._keys_r.push(false); this._keys_s.push(true);
        i = this._keys.length - 1;
        this.libererNote(i);
        return i;
    };

    // là où la note doit être pile au bon moment : le milieu de la zone « critique » de MOG
    Sprite_TKeys.prototype.xJuste = function () {
        return (this._limit[2] + this._limit[3]) / 2;
    };

    Sprite_TKeys.prototype.vitesseDe = function (note) {
        return note.v > 0 ? note.v : this._keys_speed;
    };

    var _majTouches = Sprite_TKeys.prototype.update;
    Sprite_TKeys.prototype.update = function () {
        if (!this._partitionScene) return _majTouches.apply(this, arguments);
        Sprite_Base.prototype.update.call(this);
        var scene = this._partitionScene, p = scene._partition;
        var t = scene.tempsPartition() - (scene._tourPartition || 0);
        var xJ = this.xJuste(), depart = -this._cw;
        if ($gameSystem._theatrhythm_phase === 1) {
            // les notes qui doivent entrer maintenant (le temps de traverser le couloir)
            while (this._prochaine < p.notes.length) {
                var n = p.notes[this._prochaine];
                var parSeconde = this.vitesseDe(n) * 60;
                if (n.t - t > (xJ - depart) / parSeconde) break;
                this._prochaine++;
                if (t - n.t > (this._limit[4] - xJ) / parSeconde) continue;   // déjà passée
                var i = this.caseLibre(), lignes = Math.max(1, this._batlers.length);
                this._noteDe[i] = n;
                this._keys_c[i] = n.b;
                this._keys_h[i] = n.c % lignes;
                this._keys_f[i] = false;
                this._keys_r[i] = true;
                this._keys_s[i] = false;
                this._keys[i].setFrame(this._cw * n.b, 0, this._cw, this._ch);
                this._keys[i].y = this._positions[this._keys_h[i]] ? this._positions[this._keys_h[i]][1] : this._positions[0][1];
                this._keys[i].scale.x = 1.00; this._keys[i].scale.y = 1.00;
                this._keys[i].opacity = 0;
                this._keys[i].x = xJ - (n.t - t) * parSeconde;
            }
        }
        for (var k = 0; k < this._keys.length; k++) {
            var note = this._noteDe[k];
            if (!note) continue;
            if ($gameSystem._theatrhythm_phase !== 1) { this._keys[k].opacity -= 10; continue; }
            if (this._keys_f[k]) {
                this.update_fade(k);
            } else {
                // comme MOG (update_position), mais la place vient du temps de la musique
                this._keys[k].x = xJ - (note.t - t) * this.vitesseDe(note) * 60;
                if (this._keys[k].x > this._limit[1] && this._keys[k].opacity > 0) {
                    this._keys[k].opacity -= 7;
                    if (!this._keys_s[k] && this._keys_r[k]) this.slow_pressed(k);
                } else {
                    this._keys[k].opacity += 25;
                }
            }
            if (this.need_reset_key(k)) this.libererNote(k);
        }
    };

    // MOG cherche « la note la plus proche » à chaque touche ratée : entre deux
    // notes de ta partition, il n'y en a peut-être aucune à l'écran
    var _rate = Sprite_TKeys.prototype.execute_miss;
    Sprite_TKeys.prototype.execute_miss = function (key, i) {
        if (!this._partitionScene) return _rate.call(this, key, i);
        if ($gameSystem._theatrhythm_key_data[0] != null) return;
        var vues = [];
        for (var e = 0; e < this._keys.length; e++) {
            if (this._noteDe[e] && this._keys[e].x <= this._limit[1] && this._keys[e].opacity > 0) vues.push([this._keys[e].x, this._keys_h[e]]);
        }
        if (!vues.length || SILENCE === 'rien' && !this.noteDansLaZone()) return;
        vues.sort(function (a, b) { return b[0] - a[0]; });
        $gameSystem._theatrhythm_key_data[0] = vues[0][1];
        $gameSystem._theatrhythm_key_data[1] = 0;
    };

    // une note assez proche du cercle pour qu'une mauvaise touche soit un raté
    Sprite_TKeys.prototype.noteDansLaZone = function () {
        for (var e = 0; e < this._keys.length; e++) {
            if (this._noteDe[e] && !this._keys_f[e] && this._keys[e].x >= this._limit[0] - this._cw && this._keys[e].x <= this._limit[1]) return true;
        }
        return false;
    };
})();
