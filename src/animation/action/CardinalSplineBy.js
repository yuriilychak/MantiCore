import CardinalSplineTo from "./CardinalSplineTo";
import Constant from "constant";
import Geometry from "util/Geometry";

/**
 * @desc BCreate cardinal spline action for move display object.
 * @class
 * @memberOf MANTICORE.animation.action
 * @extends MANTICORE.animation.action.CardinalSplineTo
 */

class CardinalSplineBy extends CardinalSplineTo {
    /**
     * @constructor
     * @param {number} duration
     * @param {PIXI.Point[]} points
     * @param {number} [tension = 0]
     */
    constructor(duration, points, tension = 0) {
        super(duration, points, tension);
        /**
         * @type {PIXI.Point | Point}
         * @private
         */
        this._startPosition = new PIXI.Point(0, 0);

    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.CardinalSplineBy}
     */

    clone() {
        return new CardinalSplineBy(this.duration, CardinalSplineBy.cloneControlPoints(this.points), this.tension);
    }

    startWithTarget(target) {
        super.startWithTarget(target);
        this._startPosition.x = target.x;
        this._startPosition.y = target.y;
    }

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

        return new CardinalSplineBy(this.duration, reverseArray, this.tension);
    }

    /**
     * @desc update position of target
     * @method
     * @public
     * @param {PIXI.Point | PIXI.ObservablePoint} newPos
     */
    updatePosition(newPos) {
        const nextPos = Geometry.pAdd(newPos, this._startPosition);
        this.previousPosition.copy(nextPos);
        this.target.position.copy(nextPos);
    }
}

export default CardinalSplineBy;