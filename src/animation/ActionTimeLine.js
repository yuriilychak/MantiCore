import Type from "util/Type";
import Macro from "macro";
import Repository from "repository/Repository";

/**
 * @desc Class for manipulate with animated actions and listen their event.
 * @class
 * @memberOf MANTICORE.animation
 */

class ActionTimeLine {
    /**
     * @constructor
     * @param {PIXI.DisplayObject} target
     */
    constructor(target) {
        /**
         * @desc action that currently run
         * @type {?MANTICORE.animation.ActionAnimation}
         * @private
         */
        this._runingAnimation = null;

        /**
         * @desc Name of running action.
         * @type {?string}
         * @private
         */

        this._runningName = null;

        /**
         * @type {MANTICORE.repository.Repository}
         * @private
         */

        this._animations = new Repository();

        /**
         * @desc Flag is currently action running
         * @type {boolean}
         * @private
         */

        this._isRunning = false;

        /**
         * @type {boolean}
         * @private
         */
        this._isPlaying = false;

        /**
         * @desc Target of animation.
         * @type {PIXI.DisplayObject}
         * @private
         */

        this._target = target;

        /**
         * @type {int}
         * @private
         */

        this._fps = Macro.FPS;

        /**
         * @desc Coef for calculate animation time. When fps not default.
         * @type {number}
         * @private
         */

        this._fpsCoef = 1;
    }

    /**
     * @desc Fps of time-line
     * @public
     * @returns {number}
     */

    get fps() {
        return this._fps;
    }

    set fps(value) {
        if (this._fps === value) {
            return;
        }

        this._fps = value;

        this._fpsCoef = this._fps / Macro.FPS;
    }

    /**
     * @desc Returns is time-line currently empty.
     * @public
     * @returns {boolean}
     */

    get isEmpty() {
        return Type.isNull(this._runingAnimation);
    }

    /**
     * @desc Returns is action play on time-line.
     * @public
     * @returns {boolean}
     */

    get isPlaying() {
        return this._isPlaying;
    }

    /**
     * @desc Returns is action that use time-line complete.
     * @public
     * @returns {boolean}
     */

    get isDone() {
        return !Type.isNull(this._runingAnimation) && this._runingAnimation.isDone;
    }

    /**
     * @desc Returns duration of playing animation.
     * @public
     * @returns {number}
     */

    get duration() {
        return !this.isEmpty ? this._runingAnimation.duration : 0;
    }

    /**
     * @desc Add animation to time-line.
     * @method
     * @public
     * @param {string} name
     * @param {MANTICORE.animation.ActionAnimation} animation
     * @returns {boolean}
     */

    addAnimation(name, animation) {
        return this._animations.addElement(animation, name);
    }

    /**
     * @desc Remove animation by name.
     * @method
     * @public
     * @param {string} name
     * @returns {boolean}
     */

    removeAnimation(name) {
        return this._animations.removeElement(name);
    }

    /**
     * @desc Stop current animation. Remove all animations from time-line.
     * @method
     * @public
     */

    removeAllAnimations() {
        this._isPlaying = false;
        this._isRunning = false;
        this._animations.clear(true);
    }

    /**
     * @desc start time line.
     * @method
     * @public
     * @param {string} name - Play animation with name.
     * @returns {boolean}
     */

    play(name) {
        if (!this.isEmpty) {
            this._runingAnimation = null;
        }

        this._runingAnimation.play(this._target);
        this._isPlaying = true;
        this._isRunning = true;

        return true;
    }

    /**
     * @desc Stop time-line
     * @method
     * @public
     * @returns {boolean}
     */

    stop() {
        if (this.isEmpty) {
            return false;
        }

        this._isPlaying = false;
        this._isRunning = false;
        this._runingAnimation.stop();

        return true;
    }

    /**
     * @desc Pause animation.
     * @method
     * @public
     */

    pause() {
        if (!this._isRunning) {
            return;
        }
        this._isPlaying = false;
    }

    /**
     * @desc Resume paused animation.
     * @method
     * @public
     */

    resume() {
        if (!this._isRunning) {
            return;
        }
        this._isPlaying = true;
    }

    /**
     * @desc Update animation
     * @method
     * @public
     * @param {number} dt
     */

    update(dt) {
        if (!this._isPlaying) {
            return;
        }
        this._runingAnimation.update(dt * this._fpsCoef);
        if (this._runingAnimation.isDone) {
            this._isPlaying = false;
            this._isRunning = false;
        }
    }
}

export default ActionTimeLine;