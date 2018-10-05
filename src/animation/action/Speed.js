import Action from "./Action";
import Type from "util/Type";

/**
 * Changes the speed of an action, making it take longer (speed > 1)
 * or less (speed < 1) time. <br/>
 * Useful to simulate 'slow motion' or 'fast forward' effect.
 *
 * @warning This action can't be Sequenceable because it is not an cc.IntervalAction
 * @class
 * @extends MANTICORE.animation.action.Action
 * @memberOf MANTICORE.animation.action
 */

class Speed extends Action{
    /**
     * @constructor
     * @param {MANTICORE.animation.action.ActionInterval} action
     * @param {number} speed
     */
    constructor (action, speed) {
        super();
        /**
         * @type {number}
         * @private
         */
        this._speed = 0;
        /**
         * @type {MANTICORE.animation.action.ActionInterval}
         * @private
         */
        this._innerAction = null;

        this.initWithAction(action, speed);
    }

    /**
     * Gets the current running speed. <br>
     * Will get a percentage number, compared to the original speed.
     * @public
     * @return {number}
     */
    get speed() {
        return this._speed;
    }

    set speed(speed) {
        this._speed = speed;
    }

    /**
     * @desc Initializes the action.
     * @method
     * @public
     * @param {MANTICORE.animation.action.ActionInterval} action
     * @param {number} speed
     * @return {boolean}
     */
    initWithAction(action, speed) {
        if (Type.isEmpty(action)) {
            return false;
        }

        this._innerAction = action;
        this._speed = speed;
        return true;
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.Speed}
     */

    clone() {
        const action = new Speed();
        action.initWithAction(this._innerAction.clone(), this._speed);
        return action;
    }

    startWithTarget(target) {
        super.startWithTarget(target);
        this._innerAction.startWithTarget(target);
    }

    stop() {
        this._innerAction.stop();
        super.stop();
    }

    step(dt) {
        this._innerAction.step(dt * this._speed);
        super.step(dt);
    }

    get isDone () {
        return this._innerAction.isDone();
    }

    reverse () {
        return new Speed(this._innerAction.reverse(), this._speed);
    }

    /**
     * @desc Get inner Action.
     * @public
     * @return {MANTICORE.animation.action.ActionInterval}
     */

    get innerAction() {
        return this._innerAction;
    }

    set innerAction(action) {
        if (this._innerAction === action) {
            return;
        }
        this._innerAction = action;
    }
}

export default Speed;