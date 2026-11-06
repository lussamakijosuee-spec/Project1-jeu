//=============================================================================
// ★ Screen Shake Effects ★                                             1.0.0
//=============================================================================
/*:
 * @plugindesc Adjustable shake effects in RPG Maker MV.
 * @author Aries
 *
 * @help
 * ★ Performing Screen Shake with Battle Animations.
 * ----------------------------------------------------------------------------
 * Required:
 * Prepare sound effect files with the filenams determined in the configuration.
 * Within the Animation Editor, you can then assign the sound effect into
 * the animation's frame timings to invoke screen shakes.
 *
 * Adjust the properties of the screen shake via the screen flash section
 * of the frame timing.
 *
 * When a sound effect is associated with this plugin, the sound and flash
 * will not play in-game. Please set the volume and intensity to 0 to ease in previewing.
 *
 * Flash:
 * [Red] controls the Power of the screen shake. 255 is equivalent to Power 9.
 * [Green] controls the Speed of the screen shake. 255 is equivalent to Speed 9.
 * [Duration] controls how long the Shake lasts.
 * Note:  Duration is counted in 60 FPS as opposed to the project's defined Animation Rate.

 * ★ Credits
 * ----------------------------------------------------------------------------
 * With help from Olivia. Thank you!
 *  ● https://fallenangelolivia.itch.io/
 *
 * @param Shake Type
 * @desc Changes the shake method when screen shakes are executed.
 * Valid: Standard Random Horizontal Vertical
 * @default Vertical
 *
 * @param Shake SE
 * @desc Filename for the SE to trigger screen shakes in Animations.
 * Valid: Any file name.
 * @default SSFX_Shake
 *
 */
 /*:ja
 * @plugindesc RPGツクールMV画面揺れ機能延長
 * @author Aries
 *
 * @help

 * ★ バトルアニメーションで画面揺れを呼び出す
 * ----------------------------------------------------------------------------
 * 先に必要:
 * SEファイルをプラグイン設定どおりのファイル名をAudio/SEフォルダーに入れてください。
 *
 * データベースのアニメーションエディターで画面揺れを呼び出すため、フレームタイミング
 * にSEをつけします。
 *
 * つけたSEのフレームタイミング内、フラッシュ効果の色パラメーターで
 * 画面効果の設定は可能です。
 *
 * プラグインで登録されたSEはバトルアニメーションで再生しないようになっています。
 * エディター内に、ボリュームを0にするをお勧めします。
 *
 * - 画面揺れ
 * フラッシュの色設定:
 * [赤] 強さの制御です。255はイベントコマンドの9と同じ強さ。
 * [緑] 速さの制御です。255はイベントコマンドの9と同じ強さ。
 * [デュレーション] 画面揺れの長さをちょうせいできます。
 * ※  [デュレーション]は60FPSと考えてフレーム数の数え方です。
 *     プロジェクト設定や他プラグインよりアニメーションレートが違うことがあります。
 *
 * ★ クレジット
 * ----------------------------------------------------------------------------
 *
 * オリビアさんのお手伝いより完成しました。ありがとうございました！
 *  ● https://fallenangelolivia.itch.io/
 *
 * @param Shake Type
 * @desc 画面揺れの仕様です。 StandardはMVと変わらない画面揺れです。
 * 有効な設定: Standard Random Horizontal Vertical
 * @default Vertical
 *
 * @param Shake SE
 * @desc バトルアニメーションで画面揺れを呼び出すためのSEファイル名
 * 有効な設定: ファイル名
 * @default SSFX_Shake
 *
 */

// ★ Evaluate Parameters
var Aries = Aries || {};
Aries.P001L_SSE = {};
Aries.P001L_SSE.Param = PluginManager.parameters('Aries001L_ShakeEffects');

switch (String(Aries.P001L_SSE.Param["Shake Type"]).toUpperCase()) {
    case 'STANDARD': Aries.P001L_SSE.ShakeType = 0; break;
    case 'RANDOM': Aries.P001L_SSE.ShakeType = 1; break;
    case 'HORIZONTAL': Aries.P001L_SSE.ShakeType = 2; break;
    case 'VERTICAL': Aries.P001L_SSE.ShakeType = 3; break;
    default: Aries.P001L_SSE.ShakeType = 1; break;
}
Aries.P001L_SSE.ShakeSE = String(Aries.P001L_SSE.Param["Shake SE"]);

var _aries_p001l_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _aries_p001l_pluginCommand.call(this, command, args);
    if (command === 'AriesScreenShakeType') {
        switch (args[0].toUpperCase()) {
        case 'STANDARD':
            Aries.P001L_SSE.ShakeType = 0;
            break;
        case 'RANDOM':
            Aries.P001L_SSE.ShakeType = 1;
            break;
        case 'HORIZONTAL':
            Aries.P001L_SSE.ShakeType = 2;
            break;
        case 'VERTICAL':
            Aries.P001L_SSE.ShakeType = 3;
            break;
        default:
            ;
        }
    }
};

Aries.P001L_SSE.setScreenShakeType = function(type) {
    switch (type.toUpperCase()) {
    case 'STANDARD':
        Aries.P001L_SSE.ShakeType = 0;
        break;
    case 'RANDOM':
        Aries.P001L_SSE.ShakeType = 1;
        break;
    case 'HORIZONTAL':
        Aries.P001L_SSE.ShakeType = 2;
        break;
    case 'VERTICAL':
        Aries.P001L_SSE.ShakeType = 3;
        break;
    default:
        ;
    }
};

// ★ Sprite_Animation
// -----------------------------------------------------------------------------
var _aries_p001l_processTimingData = Sprite_Animation.prototype.processTimingData;
Sprite_Animation.prototype.processTimingData = function(timing) {
    if (timing.se != null && timing.se.name.toUpperCase() == Aries.P001L_SSE.ShakeSE.toUpperCase()) {
        var shakepwr = timing.flashColor[0] * 0.03529411764705882352941176470588;
        var shakespd = timing.flashColor[1] * 0.03529411764705882352941176470588;
        var shakedur = timing.flashDuration;
        $gameScreen.startShake(shakepwr, shakespd, shakedur);
    } else {
        _aries_p001l_processTimingData.call(this, timing);
    }
};

// ★ Game_Screen
// -----------------------------------------------------------------------------
var _aries_p001l_gameScreen_clearShake = Game_Screen.prototype.clearShake;
Game_Screen.prototype.clearShake = function() {
    _aries_p001l_gameScreen_clearShake.call(this);
    this._shakeVector = new Point(0, 0);
};

var _aries_p001l_gameScreen_startShake = Game_Screen.prototype.startShake;
Game_Screen.prototype.startShake = function(power, speed, duration) {
    _aries_p001l_gameScreen_startShake.call(this, power, speed, duration);
    this._shakeVector = new Point(0, 0);
};

Game_Screen.prototype.shakeVector = function() {
    return this._shakeVector;
};

var _aries_p001l_gameScreen_updateShake = Game_Screen.prototype.updateShake;
Game_Screen.prototype.updateShake = function() {
    switch (Aries.P001L_SSE.ShakeType) {
        case 0:
            _aries_p001l_gameScreen_updateShake.call(this);
            break;
        case 1:
            this.updateShakeRandom();
            break;
        case 2:
            this.updateShakeOscillate(1, 0);
            break;
        case 3:
            this.updateShakeOscillate(0, 1);
            break;
        default:
            _aries_p001l_gameScreen_updateShake.call(this);
    }
};

Game_Screen.prototype.updateShakeRandom = function() {
    if (this._shakeDuration > 0 || this._shake !== 0) {
        var shakeX = (Math.randomInt(this._shakePower) - Math.randomInt(this._shakePower)) * (Math.min(this._shakeDuration, 30) * 0.5);
        var shakeY = (Math.randomInt(this._shakePower) - Math.randomInt(this._shakePower)) * (Math.min(this._shakeDuration, 30) * 0.5);
        var delta = (this._shakePower * this._shakeSpeed * this._shakeDirection) / (11 - this._shakeSpeed);
        if (this._shakeDuration <= 1) {
            this._shake = 0;
            this._shakeVector.x = 0;
            this._shakeVector.y = 0;
        } else {
            this._shake = 0;
            this._shakeVector.x = shakeX;
            this._shakeVector.y = shakeY;
        }
        this._shakeDuration--;
    }
};

Game_Screen.prototype.updateShakeOscillate = function(h, v) {
    if (this._shakeDuration > 0 || this._shake !== 0) {
        var delta = (this._shakePower * (2 * this._shakeSpeed) * this._shakeDirection) / 5;
        if (this._shakeDuration <= 1 && this._shake * (this._shake + delta) < 0) {
            this._shake = 0;
        } else {
            this._shake += delta;
        }
        if (this._shake > this._shakePower * 2) {
            this._shakeDirection = -1;
        }
        if (this._shake < - this._shakePower * 2) {
            this._shakeDirection = 1;
        }
        this._shakePower *= 0.9;
        this._shakeDuration--;
    }
};

Spriteset_Base.prototype.updatePosition = function() {
    var screen = $gameScreen;
    var scale = screen.zoomScale();
    this.scale.x = scale;
    this.scale.y = scale;
    this.x = Math.round(-screen.zoomX() * (scale - 1));
    this.y = Math.round(-screen.zoomY() * (scale - 1));
    switch (Aries.P001L_SSE.ShakeType) {
        case 0: // default
            this.x += Math.round(screen.shake());
            break;
        case 1: // alldir
            this.x += Math.round(screen._shakeVector.x);
            this.y += Math.round(screen._shakeVector.y);
            break;
        case 2: // horiz
            this.x += Math.round(screen.shake());
            break;
        case 3: // vert
            this.y += Math.round(screen.shake());
            break;
        default: // default!
            this.x += Math.round(screen.shake());
    }
};
