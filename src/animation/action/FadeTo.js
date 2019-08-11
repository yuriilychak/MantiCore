import ActionInterval from "./ActionInterval";

/**
 * @desc Fades an object that implements the RGBAProtocol protocol. It modifies the opacity from the current value to a custom one.
 * @warning This action doesn't support "reverse"
 * @class
 * @extends mCore.animation.action.ActionInterval
 * @memberOf mCore.animation.action
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
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.FadeTo}
     */

    clone() {
        return this.doClone(FadeTo.create(this.duration, this._toAlpha));
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

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} duration
     * @param {number} alpha
     */

    reuse(duration,  alpha = 0) {
        super.reuse(duration);
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
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data befor disuse and destroy.
     * @method
     * @protected
     */

    clearData() {
        this._toAlpha = 0;
        this._fromAlpha = 0;
        super.clearData();
    }
}

export default FadeTo;
