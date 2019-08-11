import CardinalSpline from "./CardinalSpline";
import Point from "geometry/Point";

/**
 * @desc BCreate cardinal spline action for move display object.
 * @class
 * @memberOf mCore.animation.action
 * @extends mCore.animation.action.CardinalSpline
 */

class CardinalSplineTo extends CardinalSpline {
    /**
     * @constructor
     * @param {number} duration
     * @param {mCore.geometry.Point[]} points
     * @param {number} [tension = 0]
     */
    constructor(duration, points, tension = 0) {
        super(duration);
        /**
         * @desc Array of control points.
         * @type {mCore.geometry.Point[]}
         * @private
         */
        this._points = points.slice(0);
        /**
         * @type {number}
         * @private
         */
        this._deltaT = 0;
        /**
         * @type {number}
         * @private
         */
        this._tension = tension;
        /**
         * @type {mCore.geometry.Point}
         * @private
         */
        this._previousPosition = Point.create();
        /**
         * @type {mCore.geometry.Point}
         * @private
         */
        this._accumulatedDiff = Point.create();

        /**
         * @desc Point for calculate accumulation. Need to don't create every frame.
         * @type {mCore.geometry.Point[] | Point}
         * @private
         */

        this._stackPoint = Point.create();
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.CardinalSplineTo}
     */

    clone() {
        return CardinalSplineTo.create(this.duration, CardinalSplineTo.cloneControlPoints(this._points), this._tension);
    }

    startWithTarget(target) {
        super.startWithTarget(target);
        this._deltaT = 1 / (this._points.length - 1);
        this._previousPosition.set(this.target.x, this.target.y);
        this._accumulatedDiff.set(0, 0);
    }

    update(dt) {
        dt = this.computeEaseTime(dt);
        let p, lt;

        if (dt === 1) {
            p = this._points.length - 1;
            lt = 1;
        } else {
            p = 0 | (dt / this._deltaT);
            lt = (dt - this._deltaT * p) / this._deltaT;
        }

        const result = CardinalSplineTo.cardinalSplineAt(
            CardinalSplineTo.getControlPointAt(this._points, p - 1),
            CardinalSplineTo.getControlPointAt(this._points, p - 0),
            CardinalSplineTo.getControlPointAt(this._points, p + 1),
            CardinalSplineTo.getControlPointAt(this._points, p + 2),
            this._tension, lt);

        this.updatePosition(result);
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {mCore.animation.action.CardinalSplineTo}
     */

    reverse() {
        const reversePoints = CardinalSplineTo.reverseControlPoints(this._points);
        return CardinalSplineTo.create(this.duration, reversePoints, this._tension);
    }

    /**
     * @desc update position of target
     * @method
     * @public
     * @param {mCore.geometry.Point} newPos
     */
    updatePosition(newPos) {
        this.target.position.set(newPos);
        this._previousPosition.copyFrom(newPos);
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
        super.reuse(duration);
        this._points = points.slice(0);
        this._deltaT = 0;
        this._tension = tension;
        this._previousPosition.set(0, 0);
        this._accumulatedDiff.set(0, 0);
        this._stackPoint.set(0, 0);
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
        this._points.length = 0;
        this._deltaT = 0;
        this._tension = -1;
        this._previousPosition.set(0, 0);
        this._accumulatedDiff.set(0, 0);
        this._stackPoint.set(0, 0);
        super.clearData();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Points getter
     * @returns {mCore.geometry.Point[]}
     */
    get points() {
        return this._points;
    }

    set points(points) {
        this._points = points.slice(0);
    }

    /**
     * @protected
     * @returns {number}
     */

    get tension() {
        return this._tension;
    }

    /**
     * @protected
     * @returns {mCore.geometry.Point}
     */

    get previousPosition() {
        return this._previousPosition;
    }

    set previousPosition(value) {
        this._previousPosition.copyFrom(value);
    }
}

export default CardinalSplineTo;
