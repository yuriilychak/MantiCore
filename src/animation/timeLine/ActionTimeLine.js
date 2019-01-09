import Type from "util/Type";
import Color from "util/Color";
import Format from "util/Format";
import Constant from "constant";

import Repository from "repository/Repository";

import ActionAnimation from "../ActionAnimation";

import TIME_LINE_EVENT from "enumerator/animation/TimeLineEvent";
import BaseTimeLine from "./BaseTimeLine";
import Point from "geometry/Point";

/**
 * @desc Class for manipulate with animated actions and listen their event.
 * @class
 * @memberOf MANTICORE.animation.timeLine
 * @extends MANTICORE.animation.timeLine.BaseTimeLine
 */

class ActionTimeLine extends BaseTimeLine{
    /**
     * @constructor
     * @param {PIXI.DisplayObject} target
     * @param {string} name
     */
    constructor(target, name) {
        super(target, name);

        /**
         * @desc action that currently run
         * @type {?MANTICORE.animation.ActionAnimation}
         * @private
         */
        this._runningAnimation = null;

        /**
         * @type {MANTICORE.repository.Repository}
         * @private
         */

        this._animations = new Repository();

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
         * @type {MANTICORE.geometry.Point}
         * @private
         */

        this._startPosition = Point.create(0, 0);

        /**
         * @type {MANTICORE.geometry.Point}
         * @private
         */

        this._startScale = Point.create(0, 0);

        /**
         * @type {MANTICORE.geometry.Point}
         * @private
         */

        this._startSkew = Point.create(0, 0);

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
         * @desc Children that need to run inherited animation.
         * @type {?MANTICORE.view.ComponentContainer[]}
         * @private
         */

        this._nestedChildren = null;

        /**
         * @desc Flag is need to reset dimension to start parameters when run new animation.
         * @type {boolean}
         * @private
         */

        this._isResetParameters = false;

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
        if (Type.isNull(this.target)) {
            return;
        }
        this._startPosition.copyFrom(this.target.position);
        this._startScale.copyFrom(this.target.scale);
        this._startSkew.copyFrom(this.target.skew);
        this._startTint = Type.setValue(this.target.tint, Color.COLORS.WHITE);
        this._startAlpha = this.target.alpha;
        this._startRotation = this.target.rotation;
        this._startVisible = this.target.visible;
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
        this.stop();
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
     * @desc Stop time-line
     * @method
     * @public
     * @returns {boolean}
     */

    stop() {
        this._iterateNestedChildren(child => child.animationManager.stop(this.runningName, this.name));
        return super.stop();
    }

    /**
     * @method
     * @public
     * @param {MANTICORE.animation.action.Action} action
     * @param {boolean} [loop = false]
     */

    runAction(action, loop = false) {
        this.clearRunningAnimation();

        this.loop = loop;
        this.runAnimation(
            Constant.TEMPORARY_ANIMATION_NAME + Format.getUniqueId(),
            ActionAnimation.create(action)
        );
    }

    /**
     * @desc Pause animation.
     * @method
     * @public
     */

    pause() {
        if (!this.isRunning) {
            return;
        }
        this._iterateNestedChildren(child => child.animationManager.pause(this.runningName, this.name));
        super.pause();
    }

    /**
     * @desc Resume paused animation.
     * @method
     * @public
     */

    resume() {
        if (!this.isRunning) {
            return;
        }
        this._iterateNestedChildren(child => child.animationManager.resume(this.runningName, this.name));
        super.resume();
    }

    /**
     * @desc Update animation
     * @method
     * @public
     * @param {number} dt
     */

    update(dt) {
        if (!this.isPlaying) {
            return;
        }
        this._runningAnimation.update(dt * this.fpsCoef);
        if (this._runningAnimation.isDone) {
            if (this.loop) {
                this.dispatchEvent(TIME_LINE_EVENT.END);
                this.playAnimation();
            }
            else {
                this.dispatchEvent(TIME_LINE_EVENT.COMPLETE);
                this.clearRunningAnimation();
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
        this.refreshStartParameters();
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
     * @return {MANTICORE.animation.timeLine.ActionTimeLine}
     */

    clone() {
        /**
         * @type {MANTICORE.animation.timeLine.ActionTimeLine}
         */
        const result = ActionTimeLine.create(this.target);
        result.fps = this.fps;
        result.inherit = this._isInherit;
        result.loop = this.loop;
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
        this.clearRunningAnimation();
        this._animations.clear(true);
        this._isInherit = false;
        this._isResetParameters = false;
        this._nestedChildren.length = 0;
        this._nestedChildren = null;
        super.clearData();
    }

    /**
     * @desc run animation after init.
     * @method
     * @protected
     * @param {string} name
     * @param {MANTICORE.animation.ActionAnimation} [animation]
     */

    runAnimation(name, animation = null) {
        this._isRunAction = !Type.isNull(animation);
        this.runningName = name;
        this._runningAnimation = this._isRunAction  ? animation : this._animations.getElement(name);

        super.runAnimation(name);
        this.playAnimation();
        this._isRunAction = false;
    }

    /**
     * @desc Clear currently running animation if it exist.
     * @method
     * @protected
     * @returns {boolean}
     */

    clearRunningAnimation() {
        if (this.isEmpty) {
            return false;
        }

        if (!this._animations.hasElement(this.runningName) && !Type.isNull(this._runningAnimation)) {
            this._runningAnimation.kill();
        }

        this._isRunAction = false;
        super.clearRunningAnimation();
        this._runningAnimation = null;
        return true;
    }

    /**
     * @desc Play animation after init.
     * @method
     * @protected
     */

    playAnimation() {
        this._setStartParameters();
        this._runningAnimation.play(this.target);
        if (this._isRunAction || !this._isInherit) {
            return;
        }

        this._iterateNestedChildren(child => child.animationManager.play(this.runningName, this.name));

        super.playAnimation();
    }

    /**
     * @method
     * @public
     */

    resetParameters() {
        this.target.position.copy(this._startPosition);
        this.target.scale.copy(this._startScale);
        this.target.skew.copy(this._startSkew);
        this.target.tint = this._startTint;
        this.target.alpha = this._startAlpha;
        this.target.rotation = this._startRotation;
        this.target.visible = this._startVisible;
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
        if (Type.isNull(this.target) || !this._isResetParameters) {
            return;
        }

        this.resetPosition();
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
     * @desc Flag is need to reset parameters of owner when start new animation.
     * @public
     * @return {boolean}
     */

    get isResetParameters() {
        return this._isResetParameters;
    }

    set isResetParameters(value) {
        if (this._isResetParameters === value) {
            return;
        }
        this._isResetParameters = value;
    }

    /**
     * @desc List of animation names of time line.
     * @public
     * @returns {string[]}
     */

    get animations() {
        return this._animations.keys;
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