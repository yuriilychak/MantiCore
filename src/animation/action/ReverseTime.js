import ActionInterval from "./ActionInterval";

/**
 * @desc Executes an action in reverse order, from time=duration to time=0                                     <br/>
 * @warning Use this action carefully. This action is not sequenceable.                                 <br/>
 * Use it as the default "reversed" method of your own actions, but using it outside the "reversed"      <br/>
 * scope is not recommended.
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 * @example
 *  const reverse = new ReverseTime(this);
 */

class ReverseTime extends ActionInterval {

    /**
     * @constructor
     * @param {MANTICORE.animation.action.FiniteTimeAction} action
     */

    constructor(action) {
        super(action.duration);
        /**
         * @type {MANTICORE.animation.action.FiniteTimeAction}
         * @private
         */
        this._other = action;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.ReverseTime}
     */

    clone() {
        return this.doClone(ReverseTime.create(this._other.clone()));
    }

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        this._other.startWithTarget(target);
    }

    update(dt) {
        dt = this.computeEaseTime(dt);
        if (this._other)
            this._other.update(1 - dt);
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.ReverseTime}
     */

    reverse() {
        return this._other.clone();
    }

    stop() {
        this._other.stop();
        super.stop();
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {MANTICORE.animation.action.FiniteTimeAction} action
     */

    reuse(action) {
        this._other = action;
        super.reuse(this._other.duration);
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data befor disuse and destroy.
     * @method
     * @protected
     */

    clearData() {
        this._other.kill();
        this._other = null;
        super.clearData();
    }
}

export default ReverseTime;