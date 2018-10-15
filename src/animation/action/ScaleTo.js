import PointAction from "./PointAction";
import Type from "util/Type";
import Geometry from "util/Geometry";

/**
 * @desc Scales a Node object to a zoom factor by modifying it's scale property.
 * @warning This action doesn't support "reverse"
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 * @example
 * // It scales to 0.5 in both X and Y.
 * const actionTo = new ScaleTo(2, 0.5);
 *
 * // It scales to 0.5 in x and 2 in Y
 * const actionTo = new ScaleTo(2, 0.5, 2);
 */

class ScaleTo extends PointAction{
    /**
     * @constructor
     * @param {number} duration
     * @param {number} sx  scale parameter in X
     * @param {?number} [sy] scale parameter in Y, if Null equal to sx
     */
    constructor(duration, sx, sy = null) {
        super(duration, sx, !Type.isNull(sy) ? sy : sx);
    }


    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.ScaleTo}
     */

    clone() {
        return this.doClone(new ScaleTo(this.duration, this.endPoint.x, this.endPoint.y));
    }

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        this.startPoint.copy(target.scale);
        this.delta.copy(this.endPoint);
        Geometry.pSub(this.delta, this.startPoint, true);
    }

    update(dt) {
        if (!this.hasTarget()) {
            return;
        }
        dt = this.computeEaseTime(dt);
        this.target.scale.set(
            this.startPoint.x + this.delta.x * dt,
            this.startPoint.y + this.delta.y * dt
        );
    }
}

export default ScaleTo;