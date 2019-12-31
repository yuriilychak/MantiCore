import Math from "./Math";
import Type from "./Type";
import Point from "geometry/Point";

/**
 * @desc Namespace for manipulate with geometry objects.
 * @namespace mCore.util.geometry
 * @memberOf mCore.util!
 */

const geometry = {

    /**
     * @desc Convert size to point
     * @function
     * @memberOf mCore.util.geometry
     * @param {PIXI.Container | Object} size - Size to convert
     * @param {number} size.width - Size to convert
     * @param {number} size.height - Size to convert
     * @param {mCore.geometry.Point | Point} [inPoint] - Point for store result.
     * @returns {mCore.geometry.Point | Point}
     */

    pFromSize(size, inPoint = Point.create(0, 0)) {
        inPoint.set(Type.setValue(size.width, 0), Type.setValue(size.height, 0));
        return inPoint;
    },

    /**
     * @desc Convert half size to point
     * @function
     * @memberOf mCore.util.geometry
     * @param {PIXI.Container | Object} size - Size to convert
     * @param {number} size.width - Size to convert
     * @param {number} size.height - Size to convert
     * @param {mCore.geometry.Point | Point} [inPoint] - Point for store result.
     * @returns {mCore.geometry.Point | Point}
     */

    pHalfSize(size, inPoint = Point.create(0, 0)) {
        inPoint.set(
            Math.divPowTwo(Type.setValue(size.width, 0)),
            Math.divPowTwo(Type.setValue(size.height, 0))
        );
        return inPoint;
    },

    /**
     * @desc Subtract two sizes and return result as point.
     * @function
     * @memberOf mCore.util.geometry
     * @param {PIXI.Container | Object} size1
     * @param {PIXI.Container | Object} size2
     * @param {number} size1.width - Size to convert
     * @param {number} size1.height - Size to convert
     * @param {number} size2.width - Size to convert
     * @param {number} size2.height - Size to convert
     * @param {mCore.geometry.Point | Point} [inPoint] - Point for store result.
     * @returns {mCore.geometry.Point | Point}
     */

    sSub(size1, size2, inPoint = Point.create(0, 0)) {
        inPoint.set(size1.width - size2.width, size1.height - size2.height);
        return inPoint;
    },

    /**
     * @desc Subtract points.
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p1
     * @param {mCore.geometry.Point | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @param {boolean} [isClear = false] - Is need  to destroy second point after calculation.
     * @returns {mCore.geometry.Point | Point}
     */

    pSub(p1, p2, isIn = false, isClear = false) {
        const x = p1.x - p2.x;
        const y = p1.y - p2.y;
        this._destroyTmp(p2, isClear);
        return this._pGenResult(p1, x, y, isIn);
    },

    /**
     * @desc Add points.
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p1
     * @param {mCore.geometry.Point | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @param {boolean} [isClear = false] - Is need  to destroy second point after calculation.
     * @returns {mCore.geometry.Point | Point}
     */

    pAdd(p1, p2, isIn = false, isClear = false) {
        const x = p1.x + p2.x;
        const y = p1.y + p2.y;
        this._destroyTmp(p2, isClear);
        return this._pGenResult(p1, x, y, isIn);
    },

    /**
     * @desc Multiply point to number.
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p
     * @param {number} multiplier
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @returns {mCore.geometry.Point | Point}
     */

    pMult(p, multiplier, isIn = false) {
        return this._pGenResult(
            p,
            p.x * multiplier,
            p.y * multiplier,
            isIn);
    },

    /**
     * @desc Multiply two points.
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p1
     * @param {mCore.geometry.Point | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @param {boolean} [isClear = false] - Is need  to destroy second point after calculation.
     * @returns {mCore.geometry.Point | Point}
     */

    pCompMult(p1, p2, isIn = false, isClear = false) {
        const x = p1.x * p2.x;
        const y = p1.y * p2.y;
        this._destroyTmp(p2, isClear);
        return this._pGenResult(p1, x, y, isIn);
    },

    /**
     * @desc Divide two points.
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p1
     * @param {mCore.geometry.Point | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @param {boolean} [isClear = false] - Is need  to destroy second point after calculation.
     * @returns {mCore.geometry.Point | Point}
     */

    pCompDiv(p1, p2, isIn = false, isClear = false) {
        const x = p1.x / p2.x;
        const y = p1.y / p2.y;
        this._destroyTmp(p2, isClear);
        return this._pGenResult(p1, x, y, isIn);
    },

    /**
     * @desc Return two maximum values from points.
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p1
     * @param {mCore.geometry.Point | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @param {boolean} [isClear = false] - Is need  to destroy second point after calculation.
     * @returns {mCore.geometry.Point | Point}
     */

    pMax(p1, p2, isIn = false, isClear = false) {
        const x = Math.max(p1.x, p2.x);
        const y = Math.max(p1.y, p2.y);
        this._destroyTmp(p2, isClear);
        return this._pGenResult(p1, x, y, isIn);
    },

    /**
     * @desc Return two minimum values from points.
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p1
     * @param {mCore.geometry.Point | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @param {boolean} [isClear = false] - Is need  to destroy second point after calculation.
     * @returns {mCore.geometry.Point | Point}
     */

    pMin(p1, p2, isIn = false, isClear = false) {
        const x = Math.min(p1.x, p2.x);
        const y = Math.min(p1.y, p2.y);
        this._destroyTmp(p2, isClear);
        return this._pGenResult(p1, x, y, isIn);
    },

    /**
     * @function
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p
     * @param {boolean} [isIn = false] - Is save result to point. (Need to avoid creation of new points).
     * @returns {mCore.geometry.Point | Point}
     */

    pNeg(p, isIn = false) {
        return this._pGenResult(p, -p.x, -p.y, isIn);
    },

    /**
     * @function
     * @public
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p
     * @param {boolean} [isIn = false] - Is save result to point. (Need to avoid creation of new points).
     * @param {boolean} [isClear = false] - Is need  to destroy second point after calculation.
     * @returns {mCore.geometry.Point | Point}
     */

    pRound(p, isIn = false, isClear = false) {
        return this._pGenResult(p,  Math.round(p.x), Math.round(p.y), isIn);
    },

    /**
     * @function
     * @public
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p
     * @param {int} [numCount = 2] - Num count after dot to round.
     * @param {boolean} [isIn = false] - Is save result to point. (Need to avoid creation of new points).
     * @param {boolean} [isClear = false] - Is need  to destroy second point after calculation.
     * @returns {mCore.geometry.Point | Point}
     */

    pFixed(p, numCount = 2, isIn = false, isClear = false) {
        return this._pGenResult(p, Math.toFixed(p.x, numCount), Math.toFixed(p.y, numCount), isIn);
    },

    /**
     * @desc Change point arguments
     * @function
     * @public
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p
     * @param {mCore.geometry.Point | Point} pLeft
     * @param {mCore.geometry.Point | Point} pRight
     * @param {boolean} [isIn = false] - Is save result to point. (Need to avoid creation of new points).
     * @param {boolean} [isClear = false] - Is need  to destroy second point after calculation.
     * @returns {mCore.geometry.Point | Point}
     */

    pRange(p, pLeft, pRight, isIn = false, isClear = false) {
        const x = Math.range(p.x, pLeft.x, pRight.x);
        const y = Math.range(p.y, pLeft.y, pRight.y);
        this._destroyTmp(pLeft, isClear);
        this._destroyTmp(pRight, isClear);
        return this._pGenResult(p, x, y, isIn);
    },

    /**
     * @desc Returns is points equal.
     * @function
     * @public
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p1
     * @param {mCore.geometry.Point | Point} p2
     * @returns {boolean}
     */

    pEqual(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
    },

    /**
     * @desc Return abs of point.
     * @function
     * @public
     * @param {mCore.geometry.Point | Point} p
     * @param {boolean} [isIn = false] - Is save result to point. (Need to avoid creation of new points).
     * @returns {mCore.geometry.Point | Point}
     */

    pAbs(p, isIn = false) {
        return this._pGenResult(p, Math.abs(p.x), Math.abs(p.y), isIn);
    },

    /**
     * @desc Invert point.
     * @function
     * @public
     * @param {mCore.geometry.Point | Point} p
     * @param {boolean} [isIn = false] - Is save result to point. (Need to avoid creation of new points).
     * @returns {mCore.geometry.Point | Point}
     */

    pInvert(p, isIn = false) {
        return this._pGenResult(p, 1 / p.x, 1 / p.y, isIn);
    },

    /**
     * @desc Calculates dot product of two points.
     * @function
     * @public
     * @param {mCore.geometry.Point} p1
     * @param {mCore.geometry.Point} p2
     * @return {number}
     */
    pDot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
    },

    /**
     * @desc Calculates cross product of two points.
     * @function
     * @public
     * @param {mCore.geometry.Point} p1
     * @param {mCore.geometry.Point} p2
     * @return {number}
     */
    pCross(p1, p2) {
        return p1.x * p2.y - p1.y * p2.x;
    },

    /**
     * @desc Calculates the square length of a cc.Point (not calling sqrt() )
     * @function
     * @public
     * @param {mCore.geometry.Point} p
     * @return {number}
     */
    pLengthSQ(p) {
        return this.pDot(p, p);
    },

    /**
     * @desc Calculates distance between point an origin
     * @function
     * @public
     * @param {mCore.geometry.Point} p
     * @return {number}
     */
    pLength(p) {
        return Math.sqrt(this.pLengthSQ(p));
    },

    /**
     * @desc Calculates the distance between two points
     * @function
     * @public
     * @param {mCore.geometry.Point} p1
     * @param {mCore.geometry.Point} p2
     * @return {number}
     */
    pDistance(p1, p2) {
        return this.pLength(this.pSub(p1, p2));
    },

    /**
     * @desc Generate result for point transformation.
     * @private
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p
     * @param {number} x
     * @param {number} y
     * @param {boolean} isIn
     * @returns {mCore.geometry.Point | Point}
     */

    _pGenResult(p, x, y, isIn) {
        if (isIn) {
            p.set(x, y);
            return p;
        }
        return Point.create(x, y);
    },

    /**
     * @desc Destroy point if it acceptable
     * @private
     * @param {mCore.geometry.Point | Point} p
     * @param {boolean} isDestroy
     * @private
     */

    _destroyTmp(p, isDestroy) {
        if (!isDestroy || !p.destroy) {
            return;
        }
        p.destroy();
    }
};

export default geometry;
