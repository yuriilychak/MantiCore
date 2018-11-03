import BezierBy from "./BezierBy";
import Geometry from "util/Geometry";

/**
 * An action that moves the target with a cubic Bezier curve to a destination point.
 * @class
 * @extends MANTICORE.animation.action.BezierBy
 * @memberOf MANTICORE.animation.action
 * @example
 * const bezier = [new PIXI.Point(0, windowSize.height / 2), new PIXI.Point(300, -windowSize.height / 2), new PIXI.Point(300, 100)];
 * const bezierTo = new BezierTo(2, bezier);
 */

class BezierTo extends BezierBy{
    /**
     * @constructor
     * @param {number} t
     * @param {PIXI.Point[]} c - Array of points
     */
    constructor(t, c) {
        super(t, []);
        /**
         * @type {PIXI.Point[]}
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
        return this.doClone(new BezierTo(this.duration, this._toConfig));
    }

    startWithTarget(target) {
        super.startWithTarget(target);

        const configSize = this.config.length;

        for (let i = 0; i < configSize; ++i) {
            this.config[i].copy(Geometry.pSub(this._toConfig[i], this.startPoint));
        }
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