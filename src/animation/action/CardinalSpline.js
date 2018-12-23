import ActionInterval from "./ActionInterval";
import Math from "util/Math";
import Point from "geometry/Point";

/**
 * @desc Base class for cardinal spline actions.
 * @class
 * @memberOf MANTICORE.animation.action
 * @extends MANTICORE.animation.action.ActionInterval
 */

class CardinalSpline extends ActionInterval {

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * Returns the Cardinal Spline position for a given set of control points, tension and time. <br />
     * CatmullRom Spline formula. <br />
     * s(-ttt + 2tt - t)P1 + s(-ttt + tt)P2 + (2ttt - 3tt + 1)P2 + s(ttt - 2tt + t)P3 + (-2ttt + 3tt)P3 + s(ttt - tt)P4
     * @method
     * @static
     * @protected
     * @param {MANTICORE.geometry.Point} p0
     * @param {MANTICORE.geometry.Point} p1
     * @param {MANTICORE.geometry.Point} p2
     * @param {MANTICORE.geometry.Point} p3
     * @param {number} tension
     * @param {number} t
     * @return {MANTICORE.geometry.Point}
     */
    static cardinalSplineAt(p0, p1, p2, p3, tension, t) {
        const t2 = t * t;
        const t3 = t2 * t;
        const coef1 = t3 - t2;
        const coef2 = 2 * coef1 - t2;
        const s = (1 - tension) / 2;
        const b4 = s * coef1;
        const b1 = s * (t2 - coef1 - t);
        const b2 = coef2 - b4 + 1;
        const b3 = -(b1 + coef2);

        return Point.create(
            (p0.x * b1 + p1.x * b2 + p2.x * b3 + p3.x * b4),
            (p0.y * b1 + p1.y * b2 + p2.y * b3 + p3.y * b4)
        );
    }

    /**
     * @method
     * @static
     * @protected
     * @param {MANTICORE.geometry.Point[]} controlPoints
     * @param {int} pos
     * @returns {MANTICORE.geometry.Point}
     */
    static getControlPointAt(controlPoints, pos) {
        const index = Math.min(controlPoints.length - 1, Math.max(pos, 0));
        return controlPoints[index];
    }

    /**
     * @desc Reverse control points.
     * @method
     * @static
     * @protected
     * @param {MANTICORE.geometry.Point[]} controlPoints
     * @returns {MANTICORE.geometry.Point[]}
     */
    static reverseControlPoints(controlPoints) {
        const result = [];
        const lastIndex = controlPoints.length - 1;
        for (let i = lastIndex; i >= 0; --i) {
            result.push(controlPoints[i].clone());
        }
        return result;
    }

    /**
     * @desc Clone control points.
     * @method
     * @static
     * @protected
     * @param {MANTICORE.geometry.Point[]} controlPoints
     * @returns {MANTICORE.geometry.Point[]}
     */

    static cloneControlPoints(controlPoints) {
        const result = [];
        const pointCount = controlPoints.length;
        for (let i = 0; i < pointCount; ++i)
            result.push(controlPoints[i].clone());
        return result;
    }
}

export default CardinalSpline;