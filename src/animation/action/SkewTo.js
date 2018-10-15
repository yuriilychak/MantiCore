import PointAction from "./PointAction";
import Math from "util/Math";

/**
 * @desc Skews a Node object to given angles by modifying its skewX and skewY properties
 * @class
 * @extends MANTICORE.animation.action.PointAction
 * @memberOf MANTICORE.animation.action
 * @example
 * const actionTo = new SkewTo(2, 37.2, -37.2);
 */

class SkewTo extends PointAction {

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.SkewTo}
     */

    clone() {
        return this.doClone(new SkewTo(this.duration, this.endPoint.x, this.endPoint.y));
    }

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);

        const fullCircle = Math.multPowTwo(Math.HALF_CIRCLE);

        this.startPoint.x = Math.toDegrees(target.skew.x) % fullCircle;
        this.delta.x = this.endPoint.x - this.startPoint.x;
        if (this.delta.x > Math.HALF_CIRCLE) {
            this.delta.x -= fullCircle;
        }
        else if (this.delta.x < -Math.HALF_CIRCLE) {
            this.delta.x += fullCircle;
        }

        this.startPoint.y = Math.toDegrees(target.skew.y) % fullCircle;
        this.delta.y = this.endPoint.y - this.startPoint.y;
        if (this.delta.y > Math.HALF_CIRCLE) {
            this.delta.y -= fullCircle;
        }
        else if (this.delta.y < -Math.HALF_CIRCLE) {
            this.delta.y += fullCircle;
        }

    }

    update(dt) {
        dt = this.computeEaseTime(dt);
        this.target.skew.set(
            Math.toRadians(this.startPoint.x + this.delta.x * dt),
            Math.toRadians(this.startPoint.y + this.delta.y * dt)
        );
    }
}

export default SkewTo;