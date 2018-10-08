import ActionInterval from "./ActionInterval";
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

class ScaleTo extends ActionInterval{
    /**
     * @constructor
     * @param {number} duration
     * @param {number} sx  scale parameter in X
     * @param {?number} [sy] scale parameter in Y, if Null equal to sx
     */
    constructor(duration, sx, sy = null) {
        super(duration);

        /**
         * @type {PIXI.Point | Point}
         * @private
         */
        this._startPoint = new PIXI.Point(1, 1);

        /**
         * @type {PIXI.Point | Point}
         * @private
         */
        this._delta = new PIXI.Point(0, 0);

        /**
         * @type {PIXI.Point | Point}
         * @private
         */
        this._endPoint = new PIXI.Point(sx, !Type.isNull(sy) ? sy : sx);
    }


    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.ScaleTo}
     */

    clone() {
        return this.doClone(new ScaleTo(this.duration, this._endPoint.x, this._endPoint.y));
    }

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        this._startPoint.copy(target.scale);
        this._delta.copy(this._endPoint);
        Geometry.pSub(this._delta, this._startPoint, true);
    }

    update(dt) {
        if (!this.hasTarget()) {
            return;
        }
        dt = this.computeEaseTime(dt);
        this.target.scale.set(
            this._startPoint.x + this._delta.x * dt,
            this._startPoint.y + this._delta.y * dt
        );
    }

    /**
     * @protected
     * @returns {PIXI.Point|Point}
     */

    get startScale() {
        return this._startPoint;
    }

    /**
     * @protected
     * @returns {PIXI.Point|Point}
     */

    get endScale() {
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

export default ScaleTo;