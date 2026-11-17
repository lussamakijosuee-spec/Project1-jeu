//=============================================================================
// PorteurDAmes.js — v1.1 · Les âmes se récoltent sur les morts.
//   RPG Maker MV · by JOKO · charger APRÈS InvocationAmes et Errance.
//
//   v1.1 — remonté depuis _ancien_projet/ le 2026-09-19. Deux changements,
//   tous deux documentés ici parce qu'ils ne sont pas de la cosmétique :
//
//   ① LA RÉCOLTE, qui manquait. JOKO : « à chaque fois qu'il tue quelqu'un,
//      il récupère son âme, et plus il récupère des âmes, plus il peut
//      utiliser ses capacités ». En v1.0 rien ne remplissait la variable 15 :
//      les âmes ne pouvaient QUE se dépenser, et uniquement la commande
//      « AME absorber n » de JadeEntitePlunging pouvait en ajouter. Une mise
//      à mort donne maintenant amesParMort âme(s).
//
//   ② « SEUL LE PORTEUR DÉPENSE » EST DÉSORMAIS UN RÉGLAGE, ÉTEINT PAR DÉFAUT.
//      La v1.0 grisait toute compétence <Invocation: n> pour quiconque n'est
//      pas ludwing. Or « Carnage des Neuf Voies » (#816) porte <Invocation: 3>
//      et appartient à KORRAH : allumer cette règle lui retirerait en silence
//      une compétence que JOKO lui a donnée. Le réglage existe, il est à OFF,
//      et JOKO l'allume quand il aura tranché.
//=============================================================================
/*:
 * @plugindesc v1.1 ■ Tuer récolte l'âme du mort (var 15) et pèse sur le tueur
 * (Errance). Option : réserver la dépense des âmes à leur porteur.
 * @author JOKO
 *
 * @param porteurId
 * @text Acteur porteur (celui dont les âmes sont le carburant)
 * @type actor
 * @default 3
 *
 * @param soulVar
 * @text Variable — stock d'âmes
 * @type variable
 * @default 15
 *
 * @param amesParMort
 * @text Âmes récoltées par mise à mort
 * @type number
 * @min 0
 * @default 1
 * @desc « À chaque fois qu'il tue quelqu'un, il récupère son âme. » 0 = pas de récolte.
 *
 * @param recolteToutLeMonde
 * @text Tout le groupe récolte ?
 * @type boolean
 * @on Oui — n'importe quel tueur
 * @off Non — seules les mises à mort du porteur
 * @default true
 *
 * @param errParMort
 * @text Errance pour le tueur, par mise à mort
 * @type number
 * @min 0
 * @default 1
 * @desc S'AJOUTE au coût par âme déjà prélevé par Errance.js sur la variable 15.
 *
 * @param porteurExclusif
 * @text Réserver la dépense des âmes au porteur ?
 * @type boolean
 * @on Oui — les autres ne peuvent pas
 * @off Non — chacun dépense (défaut)
 * @default false
 * @desc ⚠ À « Oui », Korrah perd « Carnage des Neuf Voies » (#816, <Invocation: 3>).
 *
 * @help
 *  ▶ RÉCOLTER : chaque mise à mort ajoute amesParMort âme(s) au stock (var 15).
 *    Le gain passe par setValue, donc Errance.js prélève son dû par âme, et
 *    RoyaumeImperial.js compte l'âme dans le total de la partie (l'Aspiration
 *    des Âmes Damnées se nourrit de ce total).
 *  ▶ TUER PÈSE : +errParMort Errance au tueur, quel qu'il soit.
 *  ▶ DÉPENSER : les compétences <Invocation: n> coûtent n âmes — c'est
 *    InvocationAmes.js qui s'en charge. Ici, seulement l'option de réserver
 *    cette dépense au porteur.
 *  ▶ Menu : une ligne « ✦ âmes » au-dessus de l'or.
 *
 *  Script : Porteur.present() · Porteur.id() · Porteur.ames()
 */
(function () {
    'use strict';
    var P = PluginManager.parameters('PorteurDAmes');
    var PORTEUR = parseInt(P['porteurId'] || 3);
    var SOUL = parseInt(P['soulVar'] || 15);
    var AMES_MORT = parseInt(P['amesParMort'] !== undefined ? P['amesParMort'] : 1);
    var ERR_MORT = parseInt(P['errParMort'] !== undefined ? P['errParMort'] : 1);
    // ⚠ Les booléens de PluginManager arrivent en TEXTE : String(false) est
    // « false », qui est truthy. On compare la chaîne, jamais la valeur.
    var TOUS_RECOLTENT = String(P['recolteToutLeMonde'] || 'true') === 'true';
    var EXCLUSIF = String(P['porteurExclusif'] || 'false') === 'true';

    var Porteur = {
        id: function () { return PORTEUR; },
        present: function () {
            return !!$gameParty && $gameParty.members().some(function (m) { return m.actorId() === PORTEUR; });
        },
        ames: function () { return $gameVariables ? $gameVariables.value(SOUL) : 0; }
    };
    window.Porteur = Porteur;

    // ── option : seul le porteur dépense les âmes ──────────────────────────
    var _can = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
        if (EXCLUSIF && skill && skill.meta && skill.meta.Invocation !== undefined &&
            this.isActor && this.isActor() && this.actorId() !== PORTEUR) {
            return false;
        }
        return _can.call(this, skill);
    };

    // ── la mise à mort : on récolte l'âme, et elle pèse ────────────────────
    // ⚠ [2026-10-22] YEP_BattleEngineCore rend les cibles IMMORTELLES pendant toute l'action
    // (« immortal: targets, true » dans sa séquence par défaut) : l'ennemi reste à 0 PV sans
    // mourir jusqu'à la fin du coup. On ne lisait que isDead() : l'âme d'une mise à mort n'était
    // jamais comptée. À 0 PV sous l'immortalité, il est tombé ; et « vivait » exige des PV, pour
    // qu'un deuxième coup sur le même corps ne compte pas deux âmes.
    function tombe(t) { return t.isDead() || (t.hp <= 0 && !!t.isImmortal && t.isImmortal()); }
    window.Porteur.tombe = tombe;
    var _exec = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        var vivait = target && target.isEnemy && target.isEnemy() && target.isAlive() && target.hp > 0;
        _exec.call(this, target, value);
        if (!vivait || !tombe(target)) { return; }
        var s = this.subject();
        if (!s || !s.isActor || !s.isActor()) { return; }

        if (AMES_MORT > 0 && $gameVariables &&
            (TOUS_RECOLTENT || s.actorId() === PORTEUR)) {
            // setValue et pas d'écriture directe : c'est ce qui fait réagir
            // Errance.js (le prix par âme) et RoyaumeImperial.js (le total).
            $gameVariables.setValue(SOUL, $gameVariables.value(SOUL) + AMES_MORT);
        }
        if (ERR_MORT > 0) {
            try { if (window.Errance) { window.Errance.add(s.actorId(), ERR_MORT); } } catch (e) { }
        }
    };

    // ── menu : les âmes au-dessus de l'or ──────────────────────────────────
    var _cgw = Scene_Menu.prototype.createGoldWindow;
    Scene_Menu.prototype.createGoldWindow = function () {
        _cgw.call(this);
        try {
            var w = this._goldWindow;
            var sw = new Window_Base(w.x, w.y - w.height, w.width, w.height);
            sw.contents.fontSize = 18;
            sw.changeTextColor('#B79CF5');
            var p = Porteur.present() ? '' : ' (porteur absent)';
            sw.drawText('✦ ' + Porteur.ames() + p, 0, 0, sw.contentsWidth(), 'right');
            this.addWindow(sw);
        } catch (e) { }
    };
})();
