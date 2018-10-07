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
        this._other = action;
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.ReverseTime}
     */

    clone() {
        return this.doClone(new ReverseTime(this._other.clone()));
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
}

export default ReverseTime;