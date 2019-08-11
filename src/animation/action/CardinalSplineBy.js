import CardinalSplineTo from "./CardinalSplineTo";
import Geometry from "util/Geometry";
import Point from "geometry/Point";

/**
 * @desc BCreate cardinal spline action for move display object.
 * @class
 * @memberOf mCore.animation.action
 * @extends mCore.animation.action.CardinalSplineTo
 */

class CardinalSplineBy extends CardinalSplineTo {
    /**
     * @constructor
     * @param {number} duration
     * @param {mCore.geometry.Point[]} points
     * @param {number} [tension = 0]
     */
    constructor(duration, points, tension = 0) {
        super(duration, points, tension);
        /**
         * @type {mCore.geometry.Point}
         * @private
         */
        this._startPosition = Point.create(0, 0);

    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.CardinalSplineBy}
     */

    clone() {
        return CardinalSplineBy.create(this.duration, CardinalSplineBy.cloneControlPoints(this.points), this.tension);
    }

    startWithTarget(target) {
        super.startWithTarget(target);
        this._startPosition.x = target.x;
        this._startPosition.y = target.y;
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {mCore.animation.action.CardinalSplineBy}
     */

    reverse() {
        const copyConfig = this.points.slice();
        let current, i;

        let p = copyConfig[0];
        const pointCount = copyConfig.length;

        for (i = 1; i < pointCount; ++i) {
            current = copyConfig[i];
            copyConfig[i] = Geometry.pSub(current, p);
            p = current;
        }

        const reverseArray = CardinalSplineBy.reverseControlPoints(copyConfig);

        p = reverseArray[ reverseArray.length - 1];
        reverseArray.pop();

        p.x = -p.x;
        p.y = -p.y;

        reverseArray.unshift(p);

        const reverseSize = reverseArray.length;

        for (i = 1; i < reverseSize; ++i) {
            p = reverseArray[i] = Geometry.pAdd(Geometry.pNeg(reverseArray[i], true), p, true);
        }

        return CardinalSplineBy.create(this.duration, reverseArray, this.tension);
    }

    /**
     * @desc update position of target
     * @method
     * @public
     * @param {mCore.geometry.Point} newPos
     */
    updatePosition(newPos) {
        const nextPos = Geometry.pAdd(newPos, this._startPosition);
        this.previousPosition.copyFrom(nextPos);
        this.target.position.copyFrom(nextPos);
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} duration
     * @param {mCore.geometry.Point[]} points
     * @param {number} [tension = 0]
     */

    reuse(duration, points, tension = 0) {
        super.reuse(duration, points, tension);
        this._startPosition.set(0, 0);
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
        this._startPosition.set(0, 0);
        super.clearData();
    }
}

export default CardinalSplineBy;
