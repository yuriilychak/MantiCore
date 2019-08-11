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

    pFromSize: function(size, inPoint = Point.create(0, 0)) {
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

    pHalfSize: function(size, inPoint = Point.create(0, 0)) {
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

    sSub: function(size1, size2, inPoint = Point.create(0, 0)) {
        inPoint.set(size1.width - size2.width, size1.height - size2.height);
        return inPoint;
    },

    /**
     * @desc Subtract points.
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p1
     * @param {mCore.geometry.Point | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @returns {mCore.geometry.Point | Point}
     */

    pSub: function(p1, p2, isIn = false) {
        const x = p1.x - p2.x;
        const y = p1.y - p2.y;
        return this._pGenResult(p1, x, y, isIn);
    },

    /**
     * @desc Add points.
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p1
     * @param {mCore.geometry.Point | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @returns {mCore.geometry.Point | Point}
     */

    pAdd: function(p1, p2, isIn = false) {
        const x = p1.x + p2.x;
        const y = p1.y + p2.y;
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

    pMult: function(p, multiplier, isIn = false) {
        const x = p.x * multiplier;
        const y = p.y * multiplier;
        return this._pGenResult(p, x, y, isIn);
    },

    /**
     * @desc Multiply two points.
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p1
     * @param {mCore.geometry.Point | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @returns {mCore.geometry.Point | Point}
     */

    pCompMult: function (p1, p2, isIn = false) {
        const x = p1.x * p2.x;
        const y = p1.y * p2.y;
        return this._pGenResult(p1, x, y, isIn);
    },

    /**
     * @desc Divide two points.
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p1
     * @param {mCore.geometry.Point | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @returns {mCore.geometry.Point | Point}
     */

    pCompDiv: function (p1, p2, isIn = false) {
        const x = p1.x / p2.x;
        const y = p1.y / p2.y;
        return this._pGenResult(p1, x, y, isIn);
    },

    /**
     * @desc Return two maximum values from points.
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p1
     * @param {mCore.geometry.Point | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @returns {mCore.geometry.Point | Point}
     */

    pMax: function (p1, p2, isIn = false) {
        const x = Math.max(p1.x, p2.x);
        const y = Math.max(p1.y, p2.y);
        return this._pGenResult(p1, x, y, isIn);
    },

    /**
     * @desc Return two minimum values from points.
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p1
     * @param {mCore.geometry.Point | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @returns {mCore.geometry.Point | Point}
     */

    pMin: function (p1, p2, isIn = false) {
        const x = Math.min(p1.x, p2.x);
        const y = Math.min(p1.y, p2.y);
        return this._pGenResult(p1, x, y, isIn);
    },

    /**
     * @function
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p
     * @param {boolean} [isIn = false] - Is save result to point. (Need to avoid creation of new points).
     * @returns {mCore.geometry.Point | Point}
     */

    pNeg: function (p, isIn = false) {
        const x = -p.x;
        const y = -p.y;
        return this._pGenResult(p, x, y, isIn);
    },

    /**
     * @function
     * @public
     * @memberOf mCore.util.geometry
     * @param {mCore.geometry.Point | Point} p
     * @param {boolean} [isIn = false] - Is save result to point. (Need to avoid creation of new points).
     * @returns {mCore.geometry.Point | Point}
     */

    pRound: function(p, isIn = false) {
        const x = Math.round(p.x);
        const y = Math.round(p.y);
        return this._pGenResult(p, x, y, isIn);
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
     * @returns {mCore.geometry.Point | Point}
     */

    pRange: function(p, pLeft, pRight, isIn = false) {
        const x = Math.range(p.x, pLeft.x, pRight.x);
        const y = Math.range(p.y, pLeft.y, pRight.y);
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

    pEqual: function(p1, p2) {
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

    pAbs: function(p, isIn = false) {
        const x = Math.abs(p.x);
        const y = Math.abs(p.y);
        return this._pGenResult(p, x, y, isIn);
    },

    /**
     * @desc Invert point.
     * @function
     * @public
     * @param {mCore.geometry.Point | Point} p
     * @param {boolean} [isIn = false] - Is save result to point. (Need to avoid creation of new points).
     * @returns {mCore.geometry.Point | Point}
     */

    pInvert: function(p, isIn = false) {
        const x = 1 / p.x;
        const y = 1 / p.y;
        return this._pGenResult(p, x, y, isIn);
    },

    /**
     * @desc Calculates dot product of two points.
     * @function
     * @public
     * @param {mCore.geometry.Point} p1
     * @param {mCore.geometry.Point} p2
     * @return {number}
     */
    pDot: function (p1, p2) {
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
    pCross: function (p1, p2) {
        return p1.x * p2.y - p1.y * p2.x;
    },

    /**
     * @desc Calculates the square length of a cc.Point (not calling sqrt() )
     * @function
     * @public
     * @param {mCore.geometry.Point} p
     * @return {number}
     */
    pLengthSQ: function (p) {
        return this.pDot(p, p);
    },

    /**
     * @desc Calculates distance between point an origin
     * @function
     * @public
     * @param {mCore.geometry.Point} p
     * @return {number}
     */
    pLength: function (p) {
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
    pDistance: function (p1, p2) {
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
    }
};

export default geometry;
