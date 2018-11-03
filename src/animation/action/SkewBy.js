import SkewTo from "./SkewTo";
import Geometry from "util/Geometry";
import Spawn from "./Spawn";
import Math from "../../util/Math";

/**
 * @desc Skews a Node object by skewX and skewY degrees.Relative to its property modification.
 * @class
 * @extends MANTICORE.animation.action.SkewTo
 * @memberOf MANTICORE.animation.action
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
        return this.doClone(SkewBy.cloneFromPool(SkewBy, this.duration, this._skew.x, this._skew.y));
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
        this.endPoint.copy(Geometry.pAdd(this.startPoint, this.delta));
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.SkewBy}
     */

    reverse() {
        return this.doReverse(SkewBy.cloneFromPool(SkewBy, this.duration, -this._skew.x, -this._skew.y));
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {...*} var_args
     */

    reuse(var_args) {
        this._skew.set(arguments[1], arguments[2]);
        super.reuse(...arguments);
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
