import BezierBy from "./BezierBy";
import Geometry from "util/Geometry";

/**
 * An action that moves the target with a cubic Bezier curve to a destination point.
 * @class
 * @extends MANTICORE.animation.action.BezierBy
 * @memberOf MANTICORE.animation.action
 * @example
 * const bezier = [new MANTICORE.geometry.Point(0, windowSize.height / 2), new MANTICORE.geometry.Point(300, -windowSize.height / 2), new MANTICORE.geometry.Point(300, 100)];
 * const bezierTo = new BezierTo(2, bezier);
 */

class BezierTo extends BezierBy{
    /**
     * @constructor
     * @param {number} t
     * @param {MANTICORE.geometry.Point[]} c - Array of points
     */
    constructor(t, c) {
        super(t, []);
        /**
         * @type {MANTICORE.geometry.Point[]}
         * @private
         */
        this._toConfig = c;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.BezierTo}
     */

    clone() {
        return this.doClone(BezierTo.create(this.duration, this._toConfig));
    }

    startWithTarget(target) {
        super.startWithTarget(target);

        const configSize = this.config.length;

        for (let i = 0; i < configSize; ++i) {
            this.config[i].copyFrom(Geometry.pSub(this._toConfig[i], this.startPoint));
        }
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} t
     * @param {MANTICORE.geometry.Point[]} c - Array of points
     */

    reuse(t, c) {
        super.reuse(t, []);
        this._toConfig = c;
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
        this._toConfig.length = 0;
        super.clearData();
    }
}

export default BezierTo;