import CardinalSplineBy from "./CardinalSplineBy";

/**
 * @desc An action that moves the target with a CatmullRom curve to a destination point.<br/>
 * A Catmull Rom is a Cardinal Spline with a tension of 0.5.  <br/>
 * http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Catmull.E2.80.93Rom_spline
 * Absolute coordinates.
 * @class
 * @memberOf MANTICORE.animation.action
 * @extends MANTICORE.animation.action.CardinalSplineTo
 */

class CatmullRomBy extends CardinalSplineBy {
    /**
     * @constructor
     * @param {number} duration
     * @param {PIXI.Point[]} points
     */
    constructor(duration, points) {
        super(duration, points, 0.5);
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.CatmullRomBy}
     */

    clone() {
        return new CatmullRomBy(this.duration, CatmullRomBy.cloneControlPoints(this.points));
    }
}

export default CatmullRomBy;