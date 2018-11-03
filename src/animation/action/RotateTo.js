import ActionInterval from "./ActionInterval";
import Math from "util/Math";

/**
 * @desc Rotates display object to a certain angle by modifying its rotation property. The direction will be decided by the shortest angle.
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 * @example
 * const rotateTo = new RotateTo(2, 61.0);
 */


class RotateTo extends ActionInterval{

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @constructor
     * @param {number} duration
     * @param {number} deltaAngle
     */
    constructor(duration, deltaAngle) {
        super(duration);
        /**
         * @type {number}
         * @private
         */
        this._dstAngle = deltaAngle;
        /**
         * @type {number}
         * @private
         */
        this._startAngle = 0;
        /**
         * @type {number}
         * @private
         */
        this._diffAngle = 0;
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.RotateTo}
     */

    clone() {
        return this.doClone(RotateTo.create(this.duration, this._dstAngle));
    }

    /**
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);

        const fullCircle = Math.multPowTwo(Math.HALF_CIRCLE);
        this._startAngle = Math.toDegrees(target.rotation) % fullCircle;

        let diffAngle = this._dstAngle - this._startAngle;

        if (diffAngle > Math.HALF_CIRCLE) {
            diffAngle -= fullCircle;
        }
        else if (diffAngle < -Math.HALF_CIRCLE) {
            diffAngle += fullCircle;
        }

        this._diffAngle = diffAngle;
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {null}
     */

    reverse() {
        return null;
    }

    update(dt) {
        if (!this.hasTarget()) {
            return;
        }
        dt = this.computeEaseTime(dt);
        this.target.rotation = Math.toRadians(this._startAngle + this._diffAngle * dt);
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} duration
     * @param {number} deltaAngle
     */

    reuse(duration, deltaAngle) {
        this._dstAngle = deltaAngle;
        this._startAngle = 0;
        this._diffAngle = 0;
        super.reuse(duration);
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
        this._dstAngle = 0;
        this._startAngle = 0;
        this._diffAngle = 0;
        super.clearData();
    }
}

export default RotateTo;