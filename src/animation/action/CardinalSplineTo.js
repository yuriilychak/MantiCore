import CardinalSpline from "./CardinalSpline";
import Constant from "constant";
import Geometry from "util/Geometry";

/**
 * @desc BCreate cardinal spline action for move display object.
 * @class
 * @memberOf MANTICORE.animation.action
 * @extends MANTICORE.animation.action.CardinalSpline
 */

class CardinalSplineTo extends CardinalSpline {
    /**
     * @constructor
     * @param {number} duration
     * @param {PIXI.Point[]} points
     * @param {number} [tension = 0]
     */
    constructor(duration, points, tension = 0) {
        super(duration);
        /**
         * @desc Array of control points.
         * @type {PIXI.Point[]}
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
         * @type {PIXI.Point | Point}
         * @private
         */
        this._previousPosition = new PIXI.Point();
        /**
         * @type {PIXI.Point | Point}
         * @private
         */
        this._accumulatedDiff = new PIXI.Point();

        /**
         * @desc Point for calculate accumulation. Need to don't create every frame.
         * @type {PIXI.Point[] | Point}
         * @private
         */

        this._stackPoint = new PIXI.Point();

    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.CardinalSplineTo}
     */

    clone() {
        return new CardinalSplineTo(this.duration, CardinalSplineTo.cloneControlPoints(this._points), this._tension);
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
     * @return {MANTICORE.animation.action.CardinalSplineTo}
     */

    reverse() {
        const reversePoints = CardinalSplineTo.reverseControlPoints(this._points);
        return new CardinalSplineTo(this.duration, reversePoints, this._tension);
    }

    /**
     * @desc update position of target
     * @method
     * @public
     * @param {PIXI.Point | PIXI.ObservablePoint} newPos
     */
    updatePosition(newPos) {
        this.target.position.set(newPos);
        this._previousPosition.copy(newPos);
    }

    /**
     * @desc Points getter
     * @returns {PIXI.Point[]}
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
     * @returns {PIXI.Point | Point}
     */

    get previousPosition() {
        return this._previousPosition;
    }

    set previousPosition(value) {
        this._previousPosition.copy(value);
    }
}

export default CardinalSplineTo;