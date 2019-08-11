import Math from "util/Math";
import Type from "util/Type";
import Macro from "macro/index";
import Constant from "constant/index";
import EventDispatcher from "eventDispatcher/index";

import Repository from "repository/Repository";

import ReusableObject from "memory/ReusableObject";

import TIME_LINE_EVENT from "enumerator/animation/TimeLineEvent";
import TIME_LINE_TYPE from "enumerator/animation/TimeLineType";

/**
 * @desc Base class for action and spine time line.
 * @class
 * @memberOf mCore.animation.timeLine
 * @extends mCore.memory.ReusableObject
 */

class BaseTimeLine extends ReusableObject{
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
         * @desc Target of animation.
         * @type {PIXI.DisplayObject}
         * @private
         */

        this._target = target;

        /**
         * @desc Name of running action.
         * @type {?string}
         * @private
         */

        this._runningName = null;

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
         * @type {int}
         * @private
         */

        this._fps = Macro.FPS;

        /**
         * @type {number}
         * @private
         */

        this._fpsCoef = 1;

        /**
         * @desc Events that dispatch time line.
         * @type {mCore.repository.Repository}
         * @private
         */

        this._events = new Repository();

        /**
         * @desc Is need to loop animation.
         * @type {boolean}
         * @private
         */

        this._isLoop = false;

        /**
         * @type {mCore.enumerator.animation.TIME_LINE_TYPE}
         * @private
         */
        this._type = TIME_LINE_TYPE.NONE;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns is time line has animation.
     * @method
     * @public
     * @param {string} name
     * @return {boolean}
     */

    hasAnimation(name) {
        return false;
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
     * @desc start time line.
     * @method
     * @public
     * @param {string} name - Play animation with name.
     * @param {boolean} [loop = false] -
     * @returns {boolean}
     */

    play(name, loop = false) {
        this.clearRunningAnimation();
        if (!this.hasAnimation(name)) {
            return false;
        }

        this.loop = loop;
        this.runAnimation(name);

        return true;
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
        this._isPlaying = false;
        this.dispatchEvent(TIME_LINE_EVENT.PAUSE);
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
        this._isPlaying = true;
        this.dispatchEvent(TIME_LINE_EVENT.RESUME);
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
     * @desc Stop time-line
     * @method
     * @public
     * @returns {boolean}
     */

    stop() {
        this.dispatchEvent(TIME_LINE_EVENT.STOP);
        return this.clearRunningAnimation();
    }

    /**
     * @desc Update animation
     * @method
     * @public
     * @param {number} dt
     */

    update(dt) {}

    /**
     * @desc Set event in repository.
     * @method
     * @public
     * @param {mCore.enumerator.animation.TIME_LINE_EVENT | int} eventId
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
        this.clearRunningAnimation();
        this._target = null;
        this._fps = Macro.FPS;
        this._fpsCoef = 1;
        super.clearData();
    }

    /**
     * @desc run animation after init.
     * @method
     * @protected
     * @param {string} name
     */

    runAnimation(name) {
        this._runningName = name;
        this.playAnimation();
        this._isPlaying = true;
        this._isRunning = true;
    }

    /**
     * @desc Play animation after init.
     * @method
     * @protected
     */

    playAnimation() {
        this.dispatchEvent(TIME_LINE_EVENT.START);
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

        this._isLoop = false;
        this._runningName = null;
        this._isPlaying = false;
        this._isRunning = false;

        return true;
    }

    /**
     * @desc Dispatch animation event if it exist.
     * @method
     * @protected
     * @param {mCore.enumerator.animation.TIME_LINE_EVENT | int} eventId
     */

    dispatchEvent(eventId) {
        if (!this._events.hasElement(eventId) || Type.isNull(this._runningName)) {
            return;
        }
        EventDispatcher.dispatch(this._events.getElement(eventId), this, this.runningName);
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
     * @protected
     * @returns {number}
     */

    get fpsCoef() {
        return this._fpsCoef;
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
     * @desc Returns is time-line currently empty.
     * @public
     * @returns {boolean}
     */

    get isEmpty() {
        return Type.isNull(this._runningName);
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

    /**
     * @desc Name of running animation
     * @protected
     * @returns {?string}
     */

    get runningName() {
        return this._runningName;
    }

    set runningName(value) {
        if (this._runningName === value) {
            return;
        }
        this._runningName = value;
    }

    /**
     * @desc Target of timeline.
     * @protected
     * @returns {PIXI.DisplayObject | PIXI.spine.Spine}
     */

    get target() {
        return this._target;
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
     * @desc Returns duration of playing animation.
     * @public
     * @returns {number}
     */

    get duration() {
        return 0;
    }

    /**
     * @desc List of animation names of time line.
     * @public
     * @returns {string[]}
     */

    get animations() {
        return [];
    }

    /**
     * @public
     * @return {mCore.enumerator.animation.TIME_LINE_TYPE}
     */

    get type() {
        return this._type;
    }

    set type(value) {
        if (this._type === value) {
            return;
        }
        this._type = value;
    }
}


export default BaseTimeLine;
