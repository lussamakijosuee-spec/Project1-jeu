//=============================================================================
// UltiCinematics.js — v1.0  ·  Cinematiques : Jackpot anime, Cut-ins d'ultime,
//                                              Auras d'etat « ameliore au max »
// RPG Maker MV   ·   by JOKO   (additif, pilotable par le developpeur)
//=============================================================================
/*:
 * @target MV
 * @plugindesc v1.0 ■ Rework visuel ANIME : bobines de Jackpot, cut-in cinematique
 * pour les ULTIMES, auras d'etat. 100% pilotable (notetags + commandes de plugin).
 * @author JOKO
 *
 * @param UltiSkillIds
 * @text IDs de compétences ULTIME
 * @type string
 * @desc Liste d'IDs (ex: 80,84,88). Optionnel : le notetag <Ulti> suffit aussi.
 * @default
 *
 * @param DefaultUltiColor
 * @text Couleur d'ultime par défaut
 * @type string
 * @desc Couleur CSS du cut-in si aucune n'est précisée. Ex: #9b5cff
 * @default #b07cff
 *
 * @param UltiSe
 * @text SE du cut-in d'ultime
 * @type string
 * @default Saint5
 *
 * @param ShakeOnUlti
 * @text Secousse écran sur ultime
 * @type boolean
 * @default true
 *
 * @param JackpotEnhance
 * @text Reprendre le Jackpot de Lou
 * @type boolean
 * @desc Si true, habille automatiquement HakariJackpot (win/fail) de bobines animées.
 * @default true
 *
 * @help
 * ============================================================================
 *  ULTI CINEMATICS — du JUICE animé, et c'est TOI qui décides            JOKO
 * ============================================================================
 *  Trois modules, tous asset-free (overlays HTML/CSS fluides) et entièrement
 *  contrôlables par le développeur. Aucun fichier écrit, rien de destructif.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  1) CUT-IN D'ULTIME  (compétences)
 *  ─────────────────────────────────────────────────────────────────────────
 *  Marque une compétence « ultime » de la façon que TU préfères :
 *     • Notetag dans la compétence :   <Ulti>
 *     • Texte affiché au choix :        <Ulti: Domaine Infini>
 *     • Couleur au choix :              <UltiColor: #ff3366>
 *     • OU son ID dans « IDs de compétences ULTIME ».
 *  → Dès qu'elle est lancée en combat, un cut-in cinématique animé se déclenche
 *    (bandeau qui balaie l'écran, nom qui claque, rayons, secousse + SE).
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  2) JACKPOT ANIMÉ  (Lou / Hakari)
 *  ─────────────────────────────────────────────────────────────────────────
 *  Si « Reprendre le Jackpot » = true, les résultats de LOU_HakariJackpot
 *  affichent de vraies bobines de machine à sous qui tournent puis s'arrêtent
 *  en quinconce (777 doré sur victoire). Sinon, déclenche-le toi-même.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  3) AURA / EXPLOSION D'ÉTAT  (« amélioré au max »)
 *  ─────────────────────────────────────────────────────────────────────────
 *  Sur un état (States) :   <StateFX>            → aura à l'application
 *                           <StateFX: burst>     → explosion de particules
 *                           <StateFXColor: #0ff> → couleur de l'aura
 *  Idéal pour un buff poussé au max, une transformation, un éveil.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  COMMANDES DE PLUGIN (marchent depuis un ÉVÉNEMENT COMMUN)
 *  ─────────────────────────────────────────────────────────────────────────
 *    ULTI cutin Nom de l'attaque | #couleur | Sous-titre
 *        ex:  ULTI cutin DOMAINE INFINI | #9b5cff | Lou
 *    JACKPOT win            bobines qui tombent sur 777 doré
 *    JACKPOT fail           bobines qui ratent
 *    AURA #00ffcc           aura colorée
 *    BURST #ffd700          explosion de particules colorée
 *
 *  SCRIPT (Conditional Branch ▸ Script, etc.) :
 *    UltiFX.cutin(texte, couleur, sousTitre)
 *    JackpotFX.spin('win' | 'fail')
 *    StateFX.aura(couleur)   /   StateFX.burst(couleur)
 * ============================================================================
 */
var UltiFX    = UltiFX    || {};
var JackpotFX = JackpotFX || {};
var StateFX   = StateFX   || {};

(function () {
    'use strict';

    var P = PluginManager.parameters('UltiCinematics');
    var ULTI_IDS = String(P['UltiSkillIds'] || '').split(',')
                      .map(function (s) { return parseInt(s, 10); })
                      .filter(function (n) { return !isNaN(n); });
    var DEF_COLOR    = String(P['DefaultUltiColor'] || '#b07cff');
    var ULTI_SE      = String(P['UltiSe'] || 'Saint5');
    var SHAKE_ULTI   = String(P['ShakeOnUlti'] || 'true') === 'true';
    var JACKPOT_HOOK = String(P['JackpotEnhance'] || 'true') === 'true';

    //========================================================================
    // CSS PARTAGÉ (positions + animations ; les couleurs sont posées en JS)
    //========================================================================
    var _styleDone = false;
    function ensureStyle() {
        if (_styleDone || typeof document === 'undefined') return;
        _styleDone = true;
        var st = document.createElement('style');
        st.id = 'ulti-cinematics-style';
        st.textContent = [
            // --- CUT-IN ---
            // ⚠ 2026-10-02 : mesuré, une image sur cinq était ratée pendant le cut-in.
            //   Le flou animé, l'espacement des lettres animé et la fusion « screen »
            //   par-dessus le jeu se recalculaient à chaque image. Chaque couche est
            //   maintenant dessinée une fois (will-change) puis seulement déplacée,
            //   tournée ou fondue par la carte graphique.
            '.uc-cutin{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99996;pointer-events:none;overflow:hidden;contain:strict;}',
            '.uc-dim{position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;',
            'background:radial-gradient(circle at 50% 48%,rgba(0,0,0,0) 28%,rgba(0,0,0,.74) 100%);',
            'will-change:opacity;animation:ucDim 1300ms ease-out forwards;}',
            '.uc-rays{position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;will-change:transform,opacity;',
            'background:repeating-conic-gradient(from 0deg at 50% 46%,rgba(255,255,255,.12) 0deg 6deg,rgba(255,255,255,0) 6deg 12deg);',
            'animation:ucRays 1300ms ease-out forwards;}',
            '.uc-band{position:absolute;top:39%;left:-20%;width:140%;height:22%;opacity:.92;',
            'transform-origin:left center;transform:skewY(-6deg) scaleX(0);will-change:transform,opacity;',
            'animation:ucBand 1300ms cubic-bezier(.2,.9,.2,1) forwards;}',
            '.uc-sub{position:absolute;top:28%;left:0;width:100%;text-align:center;opacity:0;',
            'font-family:Arial,sans-serif;font-weight:700;font-size:2.4vw;letter-spacing:.5em;will-change:transform,opacity;',
            'animation:ucSub 1300ms ease-out forwards;}',
            '.uc-name{position:absolute;top:35%;left:0;width:100%;text-align:center;opacity:0;color:#fff;',
            'font-family:"Arial Black",Arial,sans-serif;font-weight:900;font-size:7.6vw;letter-spacing:.03em;',
            'transform:scale(2.4);will-change:transform,opacity;animation:ucName 1300ms cubic-bezier(.15,1.2,.3,1) forwards;}',
            '@keyframes ucDim{0%{opacity:0}12%{opacity:1}80%{opacity:1}100%{opacity:0}}',
            '@keyframes ucRays{0%{opacity:0;transform:rotate(0)}20%{opacity:1}100%{opacity:0;transform:rotate(12deg)}}',
            '@keyframes ucBand{0%{transform:skewY(-6deg) scaleX(0)}18%{transform:skewY(-6deg) scaleX(1)}',
            '82%{transform:skewY(-6deg) scaleX(1)}100%{transform:skewY(-6deg) scaleX(0);opacity:0}}',
            '@keyframes ucSub{0%{opacity:0;transform:scaleX(1.6)}25%{opacity:1;transform:scaleX(1)}80%{opacity:1;transform:scaleX(1)}100%{opacity:0;transform:scaleX(1)}}',
            '@keyframes ucName{0%{transform:scale(2.4);opacity:0}22%{transform:scale(1);opacity:1}',
            '80%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.96)}}',
            // --- SLOT / JACKPOT ---
            '.uc-slot{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99995;pointer-events:none;',
            'display:flex;align-items:center;justify-content:center;}',
            '.uc-panel{display:flex;gap:14px;padding:22px 28px;border-radius:14px;opacity:0;transform:scale(.6);',
            'background:rgba(10,6,20,.85);box-shadow:0 0 40px rgba(0,0,0,.7),inset 0 0 0 3px #3a2d5a;',
            'animation:ucPanel 240ms ease-out forwards;}',
            '.uc-slot.win .uc-panel{box-shadow:0 0 60px rgba(255,200,40,.7),inset 0 0 0 3px #ffcf52;}',
            '.uc-cell{width:14vh;height:18vh;min-width:78px;min-height:96px;display:flex;align-items:center;justify-content:center;',
            'font-family:"Arial Black",Arial,sans-serif;font-weight:900;font-size:11vh;color:#ffe9a8;border-radius:10px;',
            'background:linear-gradient(#1a1330,#0c0820);box-shadow:inset 0 0 18px rgba(0,0,0,.85);text-shadow:0 0 10px #000;}',
            '.uc-cell.spin{filter:blur(3px);opacity:.85;}',
            '.uc-cell.land{animation:ucLand 260ms cubic-bezier(.2,1.5,.4,1);}',
            '.uc-slot.win .uc-cell{color:#ffd54a;text-shadow:0 0 18px #ffb300,0 0 4px #fff;}',
            '@keyframes ucPanel{to{opacity:1;transform:scale(1)}}',
            '@keyframes ucLand{0%{transform:translateY(-20px) scale(1.18)}100%{transform:translateY(0) scale(1)}}',
            // --- AURA / BURST ---
            '.uc-aura{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99994;pointer-events:none;',
            'display:flex;align-items:center;justify-content:center;}',
            '.uc-ring{position:absolute;width:18vh;height:18vh;border-radius:50%;border:6px solid #fff;opacity:0;',
            'animation:ucRing 1000ms ease-out forwards;}',
            '.uc-glow{position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;will-change:opacity;',
            'animation:ucGlow 800ms ease-out forwards;}',
            '.uc-part{position:absolute;width:10px;height:10px;border-radius:50%;opacity:0;',
            'animation:ucPart 900ms ease-out forwards;}',
            '@keyframes ucRing{0%{transform:scale(.2);opacity:.9}100%{transform:scale(3.2);opacity:0}}',
            '@keyframes ucGlow{0%{opacity:0}16%{opacity:.55}100%{opacity:0}}',
            '@keyframes ucPart{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:var(--uc-end) scale(.3)}}'
        ].join('');
        document.head.appendChild(st);
    }

    function spawn(cls, life, build) {
        if (typeof document === 'undefined' || !document.body) return null;
        ensureStyle();
        var el = document.createElement('div');
        el.className = cls;
        if (typeof build === 'function') build(el);
        document.body.appendChild(el);
        if (life > 0) setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, life);
        return el;
    }
    function se(name, vol, pitch) {
        if (name) AudioManager.playSe({ name: name, volume: vol || 100, pitch: pitch || 100, pan: 0 });
    }

    //========================================================================
    // 1) CUT-IN D'ULTIME
    //========================================================================
    UltiFX.cutin = function (text, color, sub) {
        color = color || DEF_COLOR;
        text  = (text || 'ULTIME').toString().toUpperCase();
        spawn('uc-cutin', 1350, function (root) {
            var dim  = document.createElement('div'); dim.className = 'uc-dim';
            var rays = document.createElement('div'); rays.className = 'uc-rays';
            var band = document.createElement('div'); band.className = 'uc-band';
            band.style.background = 'linear-gradient(90deg,' + color + ' 0%,rgba(255,255,255,.96) 50%,' + color + ' 100%)';
            band.style.boxShadow = '0 0 40px ' + color;
            var name = document.createElement('div'); name.className = 'uc-name';
            name.textContent = text;
            name.style.textShadow = '0 4px 0 rgba(0,0,0,.5),0 0 24px ' + color;
            root.appendChild(dim); root.appendChild(rays); root.appendChild(band);
            if (sub) {
                var s = document.createElement('div'); s.className = 'uc-sub';
                s.textContent = String(sub).toUpperCase(); s.style.color = color;
                root.appendChild(s);
            }
            root.appendChild(name);
        });
        se(ULTI_SE, 110, 100);
        if (SHAKE_ULTI && $gameScreen) { $gameScreen.startShake(5, 8, 26); $gameScreen.startFlash([255, 255, 255, 120], 16); }
    };

    function ultiInfo(item) {
        if (!item || !item.meta) return null;
        var tagged = item.meta.Ulti !== undefined || ULTI_IDS.indexOf(item.id) >= 0;
        if (!tagged) return null;
        var text = (item.meta.Ulti && item.meta.Ulti !== true) ? String(item.meta.Ulti).trim() : item.name;
        var color = item.meta.UltiColor ? String(item.meta.UltiColor).trim() : DEF_COLOR;
        return { text: text, color: color };
    }

    // Déclenchement auto en combat (plugin chargé en dernier → wrappe la version finale, YEP inclus)
    var _startAction = BattleManager.startAction;
    BattleManager.startAction = function () {
        try {
            var subject = this._subject;
            var action  = this._action;
            if (subject && action && action.item && action.item() && action.isSkill && action.isSkill()) {
                var info = ultiInfo(action.item());
                if (info) UltiFX.cutin(info.text, info.color, subject.name ? subject.name() : '');
            }
        } catch (e) {}
        _startAction.call(this);
    };

    //========================================================================
    // 2) JACKPOT ANIMÉ
    //========================================================================
    var SYMBOLS = ['7', '★', '◆', '●', '▲', '♦'];

    JackpotFX.spin = function (result) {
        var win = (result === 'win' || result === true);
        var finals = win ? ['7', '7', '7'] : (function () {
            var a = SYMBOLS[1 + Math.floor(Math.random() * (SYMBOLS.length - 1))];
            var b = SYMBOLS[1 + Math.floor(Math.random() * (SYMBOLS.length - 1))];
            var c = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            if (a === b && b === c) c = '7'; // évite un faux jackpot visuel
            return [a, b, c];
        })();

        var cells = [];
        var slot = spawn(win ? 'uc-slot win' : 'uc-slot', 0, function (root) {
            var panel = document.createElement('div'); panel.className = 'uc-panel';
            for (var i = 0; i < 3; i++) {
                var c = document.createElement('div');
                c.className = 'uc-cell spin';
                c.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                panel.appendChild(c); cells.push(c);
            }
            root.appendChild(panel);
        });
        if (!slot) return;

        se('Machine', 80, 110);

        var spinIv = setInterval(function () {
            cells.forEach(function (c) {
                if (c.classList.contains('spin')) c.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            });
        }, 60);

        // Arrêt en quinconce, façon vraie machine à sous
        [620, 980, 1380].forEach(function (t, i) {
            setTimeout(function () {
                var c = cells[i];
                c.classList.remove('spin');
                c.classList.add('land');
                c.textContent = finals[i];
                se('Cursor1', 70, 90 + i * 6);
            }, t);
        });

        // Conclusion
        setTimeout(function () {
            if (win) {
                StateFX.burst('#ffd700');
                if ($gameScreen) { $gameScreen.startFlash([255, 215, 0, 160], 50); $gameScreen.startShake(8, 9, 50); }
                se('Saint5', 110, 110);
            }
            // Fondu de sortie propre
            if (slot.firstChild) {
                slot.firstChild.style.transition = 'opacity 280ms, transform 280ms';
                slot.firstChild.style.opacity = '0';
                slot.firstChild.style.transform = 'scale(.7)';
            }
            setTimeout(function () { if (slot.parentNode) slot.parentNode.removeChild(slot); }, 320);
        }, 1700);
    };

    // Habillage automatique du Jackpot de Lou (les fonctions vivent sur le prototype)
    if (JACKPOT_HOOK) {
        if (typeof Game_Interpreter.prototype.triggerJackpotWin === 'function') {
            var _jpWin = Game_Interpreter.prototype.triggerJackpotWin;
            Game_Interpreter.prototype.triggerJackpotWin = function (actor) {
                JackpotFX.spin('win');
                _jpWin.call(this, actor);
            };
        }
        if (typeof Game_Interpreter.prototype.triggerJackpotFail === 'function') {
            var _jpFail = Game_Interpreter.prototype.triggerJackpotFail;
            Game_Interpreter.prototype.triggerJackpotFail = function (actor) {
                JackpotFX.spin('fail');
                _jpFail.call(this, actor);
            };
        }
    }

    //========================================================================
    // 3) AURA / EXPLOSION D'ÉTAT
    //========================================================================
    StateFX.aura = function (color) {
        color = color || '#7fdfff';
        spawn('uc-aura', 1050, function (root) {
            var glow = document.createElement('div'); glow.className = 'uc-glow';
            glow.style.background = 'radial-gradient(circle at 50% 55%,' + color + ' 0%,rgba(0,0,0,0) 60%)';
            var ring = document.createElement('div'); ring.className = 'uc-ring';
            ring.style.borderColor = color;
            ring.style.boxShadow = '0 0 28px ' + color + ',inset 0 0 18px ' + color;
            root.appendChild(glow); root.appendChild(ring);
        });
    };

    StateFX.burst = function (color) {
        color = color || '#ffd700';
        spawn('uc-aura', 1000, function (root) {
            var glow = document.createElement('div'); glow.className = 'uc-glow';
            glow.style.background = 'radial-gradient(circle at 50% 52%,' + color + ' 0%,rgba(0,0,0,0) 55%)';
            root.appendChild(glow);
            var n = 14;
            for (var i = 0; i < n; i++) {
                var ang = (Math.PI * 2 * i) / n + Math.random() * 0.4;
                var dist = 22 + Math.random() * 22;
                var p = document.createElement('div'); p.className = 'uc-part';
                p.style.left = '50%'; p.style.top = '52%';
                p.style.background = color;
                p.style.boxShadow = '0 0 10px ' + color;
                p.style.setProperty('--uc-end', 'translate(' + (Math.cos(ang) * dist).toFixed(1) + 'vw,' +
                                                              (Math.sin(ang) * dist).toFixed(1) + 'vh)');
                root.appendChild(p);
            }
        });
    };

    // Auto-aura à l'application d'un état tagué (plugin chargé en dernier → wrappe YEP_BuffsStatesCore)
    var _addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        var had = this.isStateAffected(stateId);
        _addState.call(this, stateId);
        try {
            if (!had && this.isStateAffected(stateId) && $dataStates && $dataStates[stateId]) {
                var meta = $dataStates[stateId].meta || {};
                if (meta.StateFX !== undefined) {
                    var color = meta.StateFXColor ? String(meta.StateFXColor).trim() : '#7fdfff';
                    if (meta.StateFX && String(meta.StateFX).trim().toLowerCase() === 'burst') StateFX.burst(color);
                    else StateFX.aura(color);
                }
            }
        } catch (e) {}
    };

    //========================================================================
    // NETTOYAGE défensif des overlays en quittant un combat
    //========================================================================
    var _terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function () {
        if (typeof document !== 'undefined') {
            ['.uc-cutin', '.uc-slot', '.uc-aura'].forEach(function (sel) {
                var n = document.querySelectorAll(sel);
                for (var i = 0; i < n.length; i++) if (n[i].parentNode) n[i].parentNode.removeChild(n[i]);
            });
        }
        _terminate.call(this);
    };

    //========================================================================
    // COMMANDES DE PLUGIN (utilisables depuis un Événement Commun)
    //========================================================================
    var _pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pluginCommand.call(this, command, args);
        var cmd = String(command).toUpperCase();
        if (cmd === 'ULTI' && (args[0] || '').toLowerCase() === 'cutin') {
            var rest = args.slice(1).join(' ').split('|').map(function (s) { return s.trim(); });
            UltiFX.cutin(rest[0] || 'ULTIME', rest[1] || DEF_COLOR, rest[2] || '');
        } else if (cmd === 'JACKPOT') {
            JackpotFX.spin((args[0] || 'win').toLowerCase() === 'fail' ? 'fail' : 'win');
        } else if (cmd === 'AURA') {
            StateFX.aura(args[0] || '#7fdfff');
        } else if (cmd === 'BURST') {
            StateFX.burst(args[0] || '#ffd700');
        }
    };

})();
