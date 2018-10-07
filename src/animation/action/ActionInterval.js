import FiniteTimeAction from "./FiniteTimeAction";
import Type from "util/Type";
import Math from "util/Math";
import Constant from "constant";

/**
 * <p> An interval action is an action that takes place within a certain period of time. <br/>
 * It has an start time, and a finish time. The finish time is the parameter<br/>
 * duration plus the start time.</p>
 *
 * <p>These CCActionInterval actions have some interesting properties, like:<br/>
 * - They can run normally (default)  <br/>
 * - They can run reversed with the reverse method   <br/>
 * - They can run with the time altered with the Accelerate, AccelDeccel and Speed actions. </p>
 *
 * <p>For example, you can simulate a Ping Pong effect running the action normally and<br/>
 * then running it again in Reverse mode. </p>
 * @class
 * @memberOf MANTICORE.animation.action
 * @extends MANTICORE.animation.action.FiniteTimeAction
 */

class ActionInterval extends FiniteTimeAction {
    /**
     * @constructor
     * @param {?number} [duration = null]
     */
    constructor (duration = null) {
        super();
        if (!Type.isNull(duration))  {
            this.duration = duration;
        }

        /**
         * @type {number}
         */

        this.MAX_VALUE = 2;

        /**
         * @type {number}
         * @private
         */
        this._elapsed = 0;

        /**
         * @type {boolean}
         * @private
         */
        this._firstTick = false;

        /**
         * @type {MANTICORE.animation.easing.EaseBase[]}
         * @private
         */
        this._eases = [];

        /**
         * @type {number}
         * @private
         */
        this._speed = 1;

        /**
         * @type {boolean}
         * @private
         */
        this._repeatForever = false;
        /**
         * @type {boolean}
         * @private
         */
        this._repeatMethod = false;//Compatible with repeat class, Discard after can be deleted

        /**
         * @type {boolean}
         * @private
         */
        this._speedMethod = false;//Compatible with repeat class, Discard after can be deleted

        this.repeatCount = 1;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * Repeats an action forever.
     * To repeat the an action for a limited number of times use the Repeat action. <br/>
     * @public
     * @returns {boolean}
     */

    get repeateForever() {
        return this._repeatForever;
    }

    set repeatForever(value){
        if (this._repeatForever === value) {
            return;
        }
        this._repeatForever = value;
        if (this._repeatForever) {
            this._repeatMethod = true;
            this.repeatCount = this.MAX_VALUE;
            return;
        }

        this._repeatMethod = false;
        this.repeatCount = 1;
    }

    /**
     * @desc Returns array with easing.
     * @public
     * @returns {MANTICORE.animation.easing.EaseBase[]}
     */

    get eases() {
        return this._eases;
    }

    set eases(value) {
        if (this._eases === value) {
            return;
        }
        this._eases = value.slice(0);
    }

    /**
     * @public
     * @returns {boolean}
     */

    get speedMethod() {
        return this._speedMethod;
    }

    set speedMethod(value) {
        if (this._speedMethod === value) {
            return;
        }
        this._speedMethod = value;
    }

    /**
     * @public
     * @returns {boolean}
     */

    get repeatMethod() {
        return this._repeatMethod;
    }

    set repeatMethod(value) {
        if (this._repeatMethod === value) {
            return;
        }
        this._repeatMethod = value;
    }

    /**
     * @desc How many seconds had elapsed since the actions started to run.
     * @public
     * @return {number}
     */

    get elapsed() {
        return this._elapsed;
    }

    /**
     * @desc Initializes the action.
     * @param {number} duration
     * @return {boolean}
     */
    initWithDuration(duration) {
        this._duration = (duration === 0) ? Constant.FLT_EPSILON : duration;
        this._elapsed = 0;
        this._firstTick = true;
        return true;
    }

    get isDone() {
        return this._elapsed >= this._duration;
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.ActionInterval}
     */

    clone() {
        return this.doClone(new ActionInterval(this._duration));
    }

    /**
     * @desc Implementation of ease motion.
     * @method easing
     * @param {...MANTICORE.animation.easing.EaseBase} var_args
     * @example
     * action.easing(easeIn(3.0));
     */
    easing(var_args) {
        this._eases.length = 0;
        const argumentCount = arguments.length;
        for (let i = 0; i < argumentCount; ++i) {
            this._eases.push(arguments[i]);
        }
    }

    step(dt) {
        if (this._firstTick) {
            this._firstTick = false;
            this._elapsed = 0;
        } else
            this._elapsed += dt;

        let time = this._elapsed / (this._duration > Constant.FLT_EPSILON ? this._duration : Constant.FLT_EPSILON);
        this.update(Math.range(time, 0, 1));

        if(this._repeatMethod && this.repeatCount > 1 && this.isDone){
            if(!this._repeatForever){
                --this.repeatCount;
            }
            this.startWithTarget(this.target);
            this.step(this._elapsed - this._duration);
        }
    }

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        this._elapsed = 0;
        this._firstTick = true;
    }

    /**
     * @desc Get amplitude rate.
     * @warning It should be overridden in subclass.
     * @public
     * @return {number}
     */
    get amplitudeRate() {
        return 0;
    }

    set AmplitudeRate(value) {
    }

    /**
     * Changes the speed of an action, making it take longer (speed>1)
     * or less (speed<1) time. <br/>
     * Useful to simulate 'slow motion' or 'fast forward' effect.
     * @param {number} speed
     */

    changeSpeed(speed){
        if(speed <= 0){
            return;
        }

        this._speedMethod = true;//Compatible with repeat class, Discard after can be deleted
        this._speed *= speed;
    }

    /**
     * @desc Get this action speed.
     * @public
     * @return {number}
     */
    get speed(){
        return this._speed;
    }

    set speed(value){
        this._speed = value;
    }

    /**
     * Repeats an action a number of times.
     * To repeat an action forever use the CCRepeatForever action.
     * @method
     * @public
     * @param {number} times
     */

    repeat(times){
        times = Math.round(times);
        if(isNaN(times) || times < 1){
            return this;
        }
        this._repeatMethod = true;
        this.repeatCount *= times;
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clone parameters to action, and return it.
     * @method
     * @protected
     * @param {MANTICORE.animation.action.ActionInterval} action
     * @returns {*}
     */

    doClone(action) {
        action.repeatForever = this._repeatForever;
        action.speed = this._speed;
        action.repeatCount = this.repeatCount;
        action.eases = this._eases;
        action.speedMethod = this._speedMethod;
        action.repeatMethod = this._repeatMethod;
        return action;
    }

    /**
     * @desc Clone parameters to action and revers eases.
     * @method
     * @protected
     * @param {MANTICORE.animation.action.ActionInterval} action
     * @returns {*}
     */

    doReverse(action) {
        this.doClone(action);

        if(this._eases.length !== 0){
            const easeCount = this._eases.length;
            for(let i = 0; i< easeCount; ++i){
                action.eases.push(this._eases[i].reverse());
            }
        }
        return action;
    }

    /**
     * @desc Calculate time with easing.
     * @method
     * @protected
     * @param {number} dt
     * @returns {number}
     */

    computeEaseTime(dt) {
        if (this._eases.length === 0) {
            return dt;
        }
        const easingCount = this._eases.length;
        for (let i = 0; i < easingCount; ++i) {
            dt = this._eases[i].easing(dt);
        }
        return dt;
    }
}

export default ActionInterval;