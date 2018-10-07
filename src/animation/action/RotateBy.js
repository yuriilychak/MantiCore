import ActionInterval from "./ActionInterval";
import Math from "util/Math";

/**
 * @desc Rotates a display object clockwise a number of degrees by modifying its rotation property. Relative to its properties to modify.
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 * @example
 * const actionBy = new RotateBy(2, 360);
 */

class RotateBy extends ActionInterval {
    /**
     * @constructor
     * @param {number} [duration = 0]
     * @param {number} [deltaAngle = 0]
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
     * @return {MANTICORE.animation.action.RotateBy}
     */

    clone() {
        return this.doClone(new RotateBy(this.duration, this._angle));
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
     * @return {MANTICORE.animation.action.RotateBy}
     */

    reverse() {
        return this.doReverse(new RotateBy(this.duration, -this._angle));
    }
}

export default RotateBy;