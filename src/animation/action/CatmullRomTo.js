import CardinalSplineTo from "./CardinalSplineTo";

/**
 * @desc An action that moves the target with a CatmullRom curve to a destination point.<br/>
 * A Catmull Rom is a Cardinal Spline with a tension of 0.5.  <br/>
 * http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Catmull.E2.80.93Rom_spline
 * Absolute coordinates.
 * @class
 * @memberOf mCore.animation.action
 * @extends mCore.animation.action.CardinalSplineTo
 */

class CatmullRomTo extends CardinalSplineTo {
    /**
     * @constructor
     * @param {number} duration
     * @param {mCore.geometry.Point[]} points
     */
    constructor(duration, points) {
        super(duration, points, 0.5);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.CatmullRomTo}
     */

    clone() {
        return CatmullRomTo.create(this.duration, CatmullRomTo.cloneControlPoints(this.points));
    }
}

export default CatmullRomTo;
