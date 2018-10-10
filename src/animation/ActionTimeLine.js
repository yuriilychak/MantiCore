import Type from "util/Type";
import Macro from "macro";

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
         * @type {?MANTICORE.animation.action.FiniteTimeAction}
         * @private
         */
        this._action = null;

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
     * @desc Action that play on time line
     * @public
     * @returns {MANTICORE.animation.action.FiniteTimeAction}
     */

    get action() {
        return this._action;
    }

    set action(value) {
        if (this._action === value) {
            return;
        }
        this._action = value;
    }

    /**
     * @desc Returns is time-line currently empty.
     * @public
     * @returns {boolean}
     */

    get isEmpty() {
        return Type.isNull(this._action);
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
        return !Type.isNull(this._action) && this._action.isDone;
    }

    /**
     * @desc Returns duration of playing animation.
     * @public
     * @returns {number}
     */

    get duration() {
        return !this.isEmpty ? this._action.duration : 0;
    }

    /**
     * @desc start time line.
     * @method
     * @public
     * @returns {boolean}
     */

    play() {
        if (this.isEmpty) {
            return false;
        }

        this._action.startWithTarget(this._target);
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
        this._action.stop();

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
        this._action.step(dt * this._fpsCoef);
        if (this._action.isDone) {
            this._isPlaying = false;
            this._isRunning = false;
        }
    }
}

export default ActionTimeLine;