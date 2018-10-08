import ActionInterval from "./ActionInterval";
import Math from "util/Math";

/**
 * @desc Skews a Node object to given angles by modifying its skewX and skewY properties
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 * @example
 * const actionTo = new SkewTo(2, 37.2, -37.2);
 */

class SkewTo extends ActionInterval{
    /**
     * @constructor
     * @param {number} t time in seconds
     * @param {number} sx
     * @param {number} sy
     */
    constructor(t, sx, sy) {
        super(t);

        /**
         * @type {PIXI.Point | Point}
         * @private
         */

        this._startPoint = new PIXI.Point(0, 0);

        /**
         * @type {PIXI.Point | Point}
         * @private
         */

        this._endPoint = new PIXI.Point(sx, sy);

        /**
         * @type {PIXI.Point | Point}
         * @private
         */

        this._delta = new PIXI.Point(0, 0);
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.SkewTo}
     */

    clone() {
        return this.doClone(new SkewTo(this.duration, this._endSkewX, this._endSkewY));
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

        this._startPoint.x = Math.toDegrees(target.skew.x) % fullCircle;
        this._delta.x = this._endPoint.x - this._startPoint.x;
        if (this._delta.x > Math.HALF_CIRCLE) {
            this._delta.x -= fullCircle;
        }
        else if (this._delta.x < -Math.HALF_CIRCLE) {
            this._delta.x += fullCircle;
        }

        this._startPoint.y = Math.toDegrees(target.skew.y) % fullCircle;
        this._delta.y = this._endPoint.y - this._startPoint.y;
        if (this._delta.y > Math.HALF_CIRCLE) {
            this._delta.y -= fullCircle;
        }
        else if (this._delta.y < -Math.HALF_CIRCLE) {
            this._delta.y += fullCircle;
        }

    }

    update(dt) {
        dt = this.computeEaseTime(dt);
        this.target.skew.set(
            Math.toRadians(this._startPoint.x + this._delta.x * dt),
            Math.toRadians(this._startPoint.y + this._delta.y * dt)
        );
    }

    /**
     * @protected
     * @returns {PIXI.Point|Point}
     */

    get startSkew() {
        return this._startPoint;
    }

    /**
     * @protected
     * @returns {PIXI.Point|Point}
     */

    get endSkew() {
        return this._endPoint;
    }

    /**
     * @protected
     * @returns {PIXI.Point|Point}
     */

    get delta() {
        return this._delta;
    }
}

export default SkewTo;