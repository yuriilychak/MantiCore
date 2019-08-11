import ActionInterval from "./ActionInterval";
import Math from "util/Math";

/**
 * @desc Rotates a display object clockwise a number of degrees by modifying its rotation property. Relative to its properties to modify.
 * @class
 * @extends mCore.animation.action.ActionInterval
 * @memberOf mCore.animation.action
 * @example
 * const actionBy = new RotateBy(2, 360);
 */

class RotateBy extends ActionInterval {

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
        this._angle = deltaAngle;
        this._startAngle = 0;
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.RotateBy}
     */

    clone() {
        return this.doClone(RotateBy.create(this.duration, this._angle));
    }

    /**
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        this._startAngle = Math.toDegrees(target.rotation);
    }

    update(dt){
        dt = this.computeEaseTime(dt);
        if (!this.hasTarget()) {
            return;
        }

        this.target.rotation = Math.toRadians(this._startAngle + this._angle * dt);
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {mCore.animation.action.RotateBy}
     */

    reverse() {
        return this.doReverse(RotateBy.create(this.duration, -this._angle));
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} duration
     * @param {number} deltaAngle
     */

    reuse(duration, deltaAngle) {
        this._angle = deltaAngle;
        this._startAngle = 0;
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
        this._angle = 0;
        this._startAngle = 0;
        super.clearData();
    }
}

export default RotateBy;
