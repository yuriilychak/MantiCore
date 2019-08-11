import PointAction from "./PointAction";
import Type from "util/Type";
import Geometry from "util/Geometry";

/**
 * @desc Scales a Node object to a zoom factor by modifying it's scale property.
 * @warning This action doesn't support "reverse"
 * @class
 * @extends mCore.animation.action.ActionInterval
 * @memberOf mCore.animation.action
 * @example
 * // It scales to 0.5 in both X and Y.
 * const actionTo = new ScaleTo(2, 0.5);
 *
 * // It scales to 0.5 in x and 2 in Y
 * const actionTo = new ScaleTo(2, 0.5, 2);
 */

class ScaleTo extends PointAction {
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
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.ScaleTo}
     */

    clone() {
        return this.doClone(ScaleTo.create(this.duration, this.endPoint.x, this.endPoint.y));
    }

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        this.startPoint.copyFrom(target.scale);
        this.delta.copyFrom(this.endPoint);
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

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} duration
     * @param {number} sx  scale parameter in X
     * @param {?number} [sy] scale parameter in Y, if Null equal to sx
     */

    reuse(duration, sx, sy = null) {
        super.reuse(duration, sx, !Type.isNull(sy) ? sy : sx);
    }
}

export default ScaleTo;
