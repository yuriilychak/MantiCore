import Math from "util/Math";
import Type from "util/Type";
import Macro from "macro";
import Repository from "repository/Repository";
import Constant from "constant";
import Pool from "pool";
import ActionAnimation from "./ActionAnimation";
import ReusableObject from "memory/ReusableObject";

/**
 * @desc Class for manipulate with animated actions and listen their event.
 * @class
 * @memberOf MANTICORE.animation
 * @extends MANTICORE.memory.ReusableObject
 */

class ActionTimeLine extends ReusableObject{
    /**
     * @constructor
     * @param {PIXI.DisplayObject} target
     */
    constructor(target) {
        super();

        /**
         * @desc action that currently run
         * @type {?MANTICORE.animation.ActionAnimation}
         * @private
         */
        this._runningAnimation = null;

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

        /**
         * @desc Is need to loop animation.
         * @type {boolean}
         * @private
         */

        this._isLoop = false;

        /**
         * @desc Is calls animation in children.
         * @type {boolean}
         * @private
         */

        this._isInherit = false;

        /**
         * @desc Flag is currently run action, not saved animation.
         * @type {boolean}
         * @private
         */

        this._isRunAction = false;

        this.reusable = true;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

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
        return this._animations.removeElement(name, true);
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
     * @desc Returns is time line has animation.
     * @method
     * @public
     * @param {string} name
     * @return {boolean}
     */

    hasAnimation(name) {
        return this._animations.hasElement(name);
    }

    /**
     * @desc start time line.
     * @method
     * @public
     * @param {string} name - Play animation with name.
     * @param {boolean} [loop = false] -
     * @returns {boolean}
     */

    play(name, loop = false) {
        this._clearRunningAnimation();
        if (!this._animations.hasElement(name)) {
            return false;
        }

        this.loop = loop;
        this._isRunAction = false;
        this._runAnimation(name, this._animations.getElement(name));

        return true;
    }

    /**
     * @desc Stop time-line
     * @method
     * @public
     * @returns {boolean}
     */

    stop() {
        return this._clearRunningAnimation();
    }

    /**
     * @method
     * @public
     * @param {MANTICORE.animation.action.Action} action
     * @param {boolean} [loop = false]
     */

    runAction(action, loop = false) {
        this._clearRunningAnimation();

        this.loop = loop;
        this._isRunAction = true;
        this._runAnimation(
            Constant.TEMPORARY_ANIMATION_NAME + Math.getUniqueId(),
            Pool.getObject(ActionAnimation, action)
        );
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
        this._runningAnimation.update(dt * this._fpsCoef);
        if (this._runningAnimation.isDone) {
            if (this._isLoop) {
                this._playAnimation();
            }
            else {
                this._isRunAction = false;
                this._isPlaying = false;
                this._isRunning = false;
            }
        }
    }

    /**
     * @desc Calls by pool when model get from pool. Don't call it only override.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */
    reuse(target) {
        super.reuse(target);
        this._target = target;
    }

    /**
     * @desc Calls by pool when model put in to pool. Don't call it only override.
     * @method
     * @public
     */
    disuse() {
        this._clearData();
        super.disuse();
    }

    destroy() {
        this._clearData();
        super.destroy();
    }

    /**
     * @desc Returns is time line currently play animation.
     * @method
     * @public
     * @param {string} animationName
     * @returns {boolean}
     */

    isPlay(animationName) {
        return this._runningName === animationName;
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data for move object to pool or destroy.
     * @method
     * @private
     */

    _clearData() {
        this._clearRunningAnimation();
        this._animations.clear(true);
        this._target = null;
        this._fps = Macro.FPS;
        this._fpsCoef = 1;
        this._isInherit = false;
    }

    /**
     * @desc run animation after init.
     * @method
     * @private
     * @param {string} name
     * @param {MANTICORE.animation.ActionAnimation} animation
     */

    _runAnimation(name, animation) {
        this._runningName = name;
        this._runningAnimation = animation;

        this._playAnimation();
        this._isPlaying = true;
        this._isRunning = true;
        this._isRunAction = false;
    }

    /**
     * @desc Clear currently running animation if it exist.
     * @method
     * @private
     * @returns {boolean}
     */

    _clearRunningAnimation() {
        if (this.isEmpty) {
            return false;
        }

        if (!this._animations.hasElement(this._runningName)) {
            this._runningAnimation.kill();
        }

        this._isRunAction = false;
        this._isLoop = false;
        this._runningName = null;
        this._runningAnimation = null;
        this._isPlaying = false;
        this._isRunning = false;

        return true;
    }

    /**
     * @desc Play animation after init.
     * @method
     * @private
     */

    _playAnimation() {
        this._runningAnimation.play(this._target);
        if (this._isRunAction || !this._isInherit) {
            return;
        }

        const children = this._target.children;
        const childrenCount = children.length;
        let i, child;

        for (i = 0; i < childrenCount; ++i) {
            child = children[i];
            if (!child.hasAnimationManager) {
                continue;
            }
            child.animationManager.play(this._runningName);
        }
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

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
        return Type.isNull(this._runningAnimation);
    }

    /**
     * @desc Flag is animation play on time-line (in pause return false).
     * @public
     * @returns {boolean}
     */

    get isPlaying() {
        return this._isPlaying;
    }

    /**
     * @desc Flag is currently some animation running (paused or not).
     * @public
     * @returns {boolean}
     */

    get isRunning() {
        return this._isRunning;
    }

    /**
     * @desc Returns is action that use time-line complete.
     * @public
     * @returns {boolean}
     */

    get isDone() {
        return !Type.isNull(this._runningAnimation) && this._runningAnimation.isDone;
    }

    /**
     * @desc Returns duration of playing animation.
     * @public
     * @returns {number}
     */

    get duration() {
        return !this.isEmpty ? this._runningAnimation.duration : 0;
    }

    /**
     * @desc Returns is animation need to loop
     * @public
     * @return {boolean}
     */

    get loop() {
        return this._isLoop;
    }

    set loop(value) {
        if (this._isLoop === value) {
            return;
        }
        this._isLoop = value;
    }

    /**
     * @desc Returns is time line inherit run animation for children of owner.
     * @public
     * @return {boolean}
     */

    get inherit() {
        return this._isInherit;
    }

    set inherit(value) {
        if (this._isInherit === value) {
            return;
        }
        this._isInherit = value;
    }
}

export default ActionTimeLine;