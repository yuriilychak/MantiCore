import Math from "util/Math";
import Type from "util/Type";
import Color from "util/Color";

import Macro from "macro";
import Constant from "constant";
import Pool from "pool";
import EventDispatcher from "eventDispatcher";

import Repository from "repository/Repository";

import ActionAnimation from "./ActionAnimation";
import ReusableObject from "memory/ReusableObject";

import TIME_LINE_EVENT from "enumerator/animation/TimeLineEvent";

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
     * @param {string} name
     */
    constructor(target, name) {
        super();

        /**
         * @desc Name of time line.
         * @type {string}
         * @private
         */

        this._name = name;

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

        /**
         * @type {PIXI.Point | Point}
         * @private
         */

        this._startPosition = new PIXI.Point(0, 0);

        /**
         * @type {PIXI.Point | Point}
         * @private
         */

        this._startScale = new PIXI.Point(0, 0);

        /**
         * @type {PIXI.Point | Point}
         * @private
         */

        this._startSkew = new PIXI.Point(0, 0);

        /**
         * @type {number}
         * @private
         */

        this._startRotation = 0;

        /**
         * @type {int}
         * @private
         */

        this._startTint = 0;

        /**
         * @type {int}
         * @private
         */

        this._startAlpha = 0;

        /**
         * @type {boolean}
         * @private
         */

        this._startVisible = true;

        /**
         * @desc Events that dispatch time line.
         * @type {MANTICORE.repository.Repository}
         * @private
         */

        this._events = new Repository();

        /**
         * @desc Children that need to run inherited animation.
         * @type {?MANTICORE.view.ComponentContainer[]}
         * @private
         */

        this._nestedChildren = null;

        this.refreshStartParameters();
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Refresh start parameters of target. Need for correct parameters (scale, position, etc) before start animation.
     * @method
     * @public
     */

    refreshStartParameters() {
        if (Type.isNull(this._target)) {
            return;
        }
        this._startPosition.copy(this._target.position);
        this._startScale.copy(this._target.scale);
        this._startSkew.copy(this._target.skew);
        this._startTint = Type.setValue(this._target.tint, Color.COLORS.WHITE);
        this._startAlpha = this._target.alpha;
        this._startRotation = this._target.rotation;
        this._startVisible = this._target.visible;
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
        this._dispatchEvent(TIME_LINE_EVENT.STOP);
        this._iterateNestedChildren(child => child.animationManager.stop(this._runningName, this._name));
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
        this._iterateNestedChildren(child => child.animationManager.pause(this._runningName, this._name));
        this._dispatchEvent(TIME_LINE_EVENT.PAUSE);
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
        this._iterateNestedChildren(child => child.animationManager.resume(this._runningName, this._name));
        this._dispatchEvent(TIME_LINE_EVENT.RESUME);
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
                this._dispatchEvent(TIME_LINE_EVENT.END);
                this._playAnimation();
            }
            else {
                this._dispatchEvent(TIME_LINE_EVENT.COMPLETE);
                this._clearRunningAnimation();
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

        this.refreshStartParameters();
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
     * @desc Set event in repository.
     * @method
     * @public
     * @param {MANTICORE.enumerator.animation.TIME_LINE_EVENT | int} eventId
     * @param {?string} event
     */

    setEvent(eventId, event) {
        const hasEvent = this._events.hasElement(eventId);
        if (Type.isNull(event)) {
            if (!hasEvent) {
                return;
            }
            this._events.removeElement(eventId);
            return;
        }
        if (hasEvent) {
            this._events.updateElement(event, eventId);
            return;
        }
        this._events.addElement(event, eventId);
    }

    /**
     * @desc Enable child for use in inherited animation.
     * @method
     * @public
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} child
     */

    addNestedChild(child) {
        if (!this._isInherit) {
            return;
        }
        const index = this._nestedChildren.indexOf(child);

        if (index !== -1) {
            return;
        }

        this._nestedChildren.push(child);
    }

    /**
     * @desc Disable child for use in inherited animation.
     * @method
     * @public
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} child
     */

    removeNestedChild(child) {
        if (!this._isInherit) {
            return;
        }

        const index = this._nestedChildren.indexOf(child);

        if (index === -1) {
            return;
        }

        this._nestedChildren.splice(index, 1);
    }

    /**
     * @method
     * @public
     * @return {MANTICORE.animation.ActionTimeLine}
     */

    clone() {
        /**
         * @type {MANTICORE.animation.ActionTimeLine}
         */
        const result = ActionTimeLine.create(this._target);
        result.fps = this._fps;
        result.inherit = this._isInherit;
        result.loop = this._isLoop;
        return result;
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data for move object to pool or destroy.
     * @method
     * @private
     */

    clearData() {
        this._name = Constant.DEFAULT_NAME;
        this._events.clear();
        this._clearRunningAnimation();
        this._animations.clear(true);
        this._target = null;
        this._fps = Macro.FPS;
        this._fpsCoef = 1;
        this._isInherit = false;
        this._nestedChildren.length = 0;
        this._nestedChildren = null;
        super.clearData();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Set start parameters to target when animation begin.
     * @method
     * @private
     */

    _setStartParameters() {
        if (Type.isNull(this._target)) {
            return;
        }

        this._target.position.copy(this._startPosition);
        this._target.scale.copy(this._startScale);
        this._target.skew.copy(this._startSkew);
        this._target.tint = this._startTint;
        this._target.alpha = this._startAlpha;
        this._target.rotation = this._startRotation;
        this._target.visible = this._startVisible;
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
        this._setStartParameters();
        this._runningAnimation.play(this._target);
        if (this._isRunAction || !this._isInherit) {
            return;
        }

        this._iterateNestedChildren(child => child.animationManager.play(this._runningName, this._name));

        this._dispatchEvent(TIME_LINE_EVENT.START);
    }

    /**
     * @desc Dispatch animation event if it exist.
     * @method
     * @private
     * @param {MANTICORE.enumerator.animation.TIME_LINE_EVENT | int} eventId
     */

    _dispatchEvent(eventId) {
        if (!this._events.hasElement(eventId) || Type.isNull(this._runningAnimation)) {
            return;
        }
        EventDispatcher.dispatch(this._events.getElement(eventId), this, this._runningName);
    }

    /**
     * @method
     * @private
     * @param {MANTICORE.animation.ActionTimeLine.IterateNestedChildren} callback
     */

    _iterateNestedChildren(callback) {
        if (Type.isNull(this._nestedChildren)) {
            return;
        }

        let childCount = this._nestedChildren.length;

        if (childCount === 0) {
            return;
        }

        let i = 0;
        let child;

        while (i < childCount) {
            child = this._nestedChildren[i];
            if (child.inPool || child.isDestroyed) {
                this._nestedChildren.splice(i, 1);
                --childCount;
                continue;
            }

            callback(child);
            ++i;
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

        this._fpsCoef = Math.framesToSeconds(this._fps);
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

        if (this._isInherit) {
            this._nestedChildren = [];
        }
        else {
            this._nestedChildren.length = 0;
            this._nestedChildren = null;
        }
    }

    /**
     * @desc Name of time line
     * @public
     * @return {string}
     */

    get name() {
        return this._name;
    }

    set name(value) {
        if (this._name === value) {
            return;
        }
        this._name = value;
    }
}

/**
 * @callback
 * @name IterateNestedChildren
 * @typedef {Function}
 * @param {MANTICORE.view.ComponentContainer} child
 * @memberOf MANTICORE.animation.ActionTimeLine
 */

export default ActionTimeLine;