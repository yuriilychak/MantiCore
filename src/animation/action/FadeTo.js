import ActionInterval from "./ActionInterval";

/**
 * @desc Fades an object that implements the RGBAProtocol protocol. It modifies the opacity from the current value to a custom one.
 * @warning This action doesn't support "reverse"
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 * @example
 * const action = new FadeTo(1.0, 0);
 */


class FadeTo extends ActionInterval{
    /**
     * @constructor
     * @param {number} duration
     * @param {number} alpha
     */
    constructor(duration,  alpha = 0) {
        super(duration);
        /**
         * @type {number}
         * @private
         */
        this._toAlpha = alpha;
        /**
         * @type {number}
         * @private
         */
        this._fromAlpha = 0;
    }


    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.FadeTo}
     */

    clone() {
        return this.doClone(new FadeTo(this.duration, this._toAlpha));
    }

    update(dt) {
        dt = this.computeEaseTime(dt);
        this.target.alpha = this._fromAlpha + (this._toAlpha - this._fromAlpha) * dt;
    }

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        this._fromAlpha = target.alpha;
    }
}

export default FadeTo;