import SkewTo from "./SkewTo";
import Geometry from "util/Geometry";
import Point from "geometry/Point";

/**
 * @desc Skews a Node object by skewX and skewY degrees.Relative to its property modification.
 * @class
 * @extends mCore.animation.action.SkewTo
 * @memberOf mCore.animation.action
 */

class SkewBy extends SkewTo{

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @constructor
     * @param {number} t time in seconds
     * @param {number} sx  skew in degrees for X axis
     * @param {number} sy  skew in degrees for Y axis
     */
    constructor(t, sx, sy) {
        super(t, sx, sy);
        /**
         * @type {mCore.geometry.Point}
         * @private
         */

        this._skew = Point.create(sx, sy);
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.SkewBy}
     */

    clone() {
        return this.doClone(SkewBy.create(this.duration, this._skew.x, this._skew.y));
    }

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        this.delta.copyFrom(this._skew);
        this.endPoint.copyFrom(Geometry.pAdd(this.startPoint, this.delta));
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {mCore.animation.action.SkewBy}
     */

    reverse() {
        return this.doReverse(SkewBy.create(this.duration, -this._skew.x, -this._skew.y));
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} sx  skew in degrees for X axis
     * @param {number} sy  skew in degrees for Y axis
     */

    reuse(t, sx, sy) {
        super.reuse(t, sx, sy);
        this._skew.set(sx, sy);

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
        this._skew.set(0, 0);
        super.clearData();
    }
}

export default SkewBy;
