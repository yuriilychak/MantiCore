import SkewTo from "./SkewTo";
import Geometry from "util/Geometry";

/**
 * @desc Skews a Node object by skewX and skewY degrees.Relative to its property modification.
 * @class
 * @extends MANTICORE.animation.action.SkewTo
 * @memberOf MANTICORE.animation.action
 */

class SkewBy extends SkewTo{
    /**
     * @constructor
     * @param {number} t time in seconds
     * @param {number} sx  skew in degrees for X axis
     * @param {number} sy  skew in degrees for Y axis
     */
    constructor(t, sx, sy) {
        super(t, sx, sy);
        /**
         * @type {PIXI.Point | Point}
         * @private
         */

        this._skew = new PIXI.Point(sx, sy);
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.SkewBy}
     */

    clone() {
        return this.doClone(new SkewBy(this.duration, this._skew.x, this._skew.y));
    }

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        this.delta.copy(this._skew);
        this.endSkew.copy(Geometry.pAdd(this.startSkew, this.delta));
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.SkewBy}
     */

    reverse() {
        return this.doReverse(new SkewBy(this.duration, -this._skew.x, -this._skew.y));
    }
}

export default SkewBy;
