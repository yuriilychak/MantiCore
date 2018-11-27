import Math from "./Math";
import Type from "./Type";

/**
 * @desc Namespace for manipulate with geometry objects.
 * @namespace MANTICORE.util.geometry
 * @memberOf MANTICORE.util!
 */

const geometry = {

    /**
     * @desc Convert size to point
     * @function
     * @memberOf MANTICORE.util.geometry
     * @param {PIXI.Container | Object} size - Size to convert
     * @param {number} size.width - Size to convert
     * @param {number} size.height - Size to convert
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} [inPoint] - Point for store result.
     * @returns {PIXI.Point | PIXI.ObservablePoint | Point}
     */

    pFromSize: function(size, inPoint = new PIXI.Point(0, 0)) {
        inPoint.set(Type.setValue(size.width, 0), Type.setValue(size.height, 0));
        return inPoint;
    },

    /**
     * @desc Convert half size to point
     * @function
     * @memberOf MANTICORE.util.geometry
     * @param {PIXI.Container | Object} size - Size to convert
     * @param {number} size.width - Size to convert
     * @param {number} size.height - Size to convert
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} [inPoint] - Point for store result.
     * @returns {PIXI.Point | PIXI.ObservablePoint | Point}
     */

    pHalfSize: function(size, inPoint = new PIXI.Point(0, 0)) {
        inPoint.set(
            Math.divPowTwo(Type.setValue(size.width, 0)),
            Math.divPowTwo(Type.setValue(size.height, 0))
        );
        return inPoint;
    },

    /**
     * @desc Subtract two sizes and return result as point.
     * @function
     * @memberOf MANTICORE.util.geometry
     * @param {PIXI.Container | Object} size1
     * @param {PIXI.Container | Object} size2
     * @param {number} size1.width - Size to convert
     * @param {number} size1.height - Size to convert
     * @param {number} size2.width - Size to convert
     * @param {number} size2.height - Size to convert
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} [inPoint] - Point for store result.
     * @returns {PIXI.Point | PIXI.ObservablePoint | Point}
     */

    sSub: function(size1, size2, inPoint = new PIXI.Point(0, 0)) {
        inPoint.set(size1.width - size2.width, size1.height - size2.height);
        return inPoint;
    },

    /**
     * @desc Subtract points.
     * @memberOf MANTICORE.util.geometry
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p1
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @returns {PIXI.Point | PIXI.ObservablePoint | Point}
     */

    pSub: function(p1, p2, isIn = false) {
        const x = p1.x - p2.x;
        const y = p1.y - p2.y;
        return this._pGenResult(p1, x, y, isIn);
    },

    /**
     * @desc Add points.
     * @memberOf MANTICORE.util.geometry
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p1
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @returns {PIXI.Point | PIXI.ObservablePoint | Point}
     */

    pAdd: function(p1, p2, isIn = false) {
        const x = p1.x + p2.x;
        const y = p1.y + p2.y;
        return this._pGenResult(p1, x, y, isIn);
    },

    /**
     * @desc Multiply point to number.
     * @memberOf MANTICORE.util.geometry
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p
     * @param {number} multiplier
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @returns {PIXI.Point | PIXI.ObservablePoint | Point}
     */

    pMult: function(p, multiplier, isIn = false) {
        const x = p.x * multiplier;
        const y = p.y * multiplier;
        return this._pGenResult(p, x, y, isIn);
    },

    /**
     * @desc Multiply two points.
     * @memberOf MANTICORE.util.geometry
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p1
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @returns {PIXI.Point | PIXI.ObservablePoint | Point}
     */

    pCompMult: function (p1, p2, isIn = false) {
        const x = p1.x * p2.x;
        const y = p1.y * p2.y;
        return this._pGenResult(p1, x, y, isIn);
    },

    /**
     * @desc Return two maximum values from points.
     * @memberOf MANTICORE.util.geometry
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p1
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @returns {PIXI.Point | PIXI.ObservablePoint | Point}
     */

    pMax: function (p1, p2, isIn = false) {
        const x = Math.max(p1.x, p2.x);
        const y = Math.max(p1.y, p2.y);
        return this._pGenResult(p1, x, y, isIn);
    },

    /**
     * @desc Return two minimum values from points.
     * @memberOf MANTICORE.util.geometry
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p1
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p2
     * @param {boolean} [isIn = false] - Is save result to first point. (Need to avoid creation of new points).
     * @returns {PIXI.Point | PIXI.ObservablePoint | Point}
     */

    pMin: function (p1, p2, isIn = false) {
        const x = Math.min(p1.x, p2.x);
        const y = Math.min(p1.y, p2.y);
        return this._pGenResult(p1, x, y, isIn);
    },

    /**
     * @function
     * @memberOf MANTICORE.util.geometry
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p
     * @param {boolean} [isIn = false] - Is save result to point. (Need to avoid creation of new points).
     * @returns {PIXI.Point | PIXI.ObservablePoint | Point}
     */
    
    pNeg: function (p, isIn = false) {
        const x = -p.x;
        const y = -p.y;
        return this._pGenResult(p, x, y, isIn);
    },

    /**
     * @function
     * @public
     * @memberOf MANTICORE.util.geometry
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p
     * @param {boolean} [isIn = false] - Is save result to point. (Need to avoid creation of new points).
     * @returns {PIXI.Point | PIXI.ObservablePoint | Point}
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
     * @memberOf MANTICORE.util.geometry
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} pLeft
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} pRight
     * @param {boolean} [isIn = false] - Is save result to point. (Need to avoid creation of new points).
     * @returns {PIXI.Point | PIXI.ObservablePoint | Point}
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
     * @memberOf MANTICORE.util.geometry
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p1
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p2
     * @returns {boolean}
     */

    pEqual: function(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
    },

    /**
     * @desc Return abs of point.
     * @function
     * @public
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p
     * @param {boolean} [isIn = false] - Is save result to point. (Need to avoid creation of new points).
     * @returns {PIXI.Point | PIXI.ObservablePoint | Point}
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
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p
     * @param {boolean} [isIn = false] - Is save result to point. (Need to avoid creation of new points).
     * @returns {PIXI.Point | PIXI.ObservablePoint | Point}
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
     * @param {PIXI.Point | PIXI.ObservablePoint} p1
     * @param {PIXI.Point | PIXI.ObservablePoint} p2
     * @return {number}
     */
    pDot: function (p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
    },

    /**
     * @desc Calculates cross product of two points.
     * @function
     * @public
     * @param {PIXI.Point | PIXI.ObservablePoint} p1
     * @param {PIXI.Point | PIXI.ObservablePoint} p2
     * @return {number}
     */
    pCross: function (p1, p2) {
        return p1.x * p2.y - p1.y * p2.x;
    },

    /**
     * @desc Calculates the square length of a cc.Point (not calling sqrt() )
     * @function
     * @public
     * @param {PIXI.Point | PIXI.ObservablePoint} p
     * @return {number}
     */
    pLengthSQ: function (p) {
        return this.pDot(p, p);
    },

    /**
     * @desc Calculates distance between point an origin
     * @function
     * @public
     * @param {PIXI.Point | PIXI.ObservablePoint} p
     * @return {number}
     */
    pLength: function (p) {
        return Math.sqrt(this.pLengthSQ(p));
    },

    /**
     * @desc Calculates the distance between two points
     * @function
     * @public
     * @param {PIXI.Point | PIXI.ObservablePoint} p1
     * @param {PIXI.Point | PIXI.ObservablePoint} p2
     * @return {number}
     */
    pDistance: function (p1, p2) {
        return this.pLength(this.pSub(p1, p2));
    },

    /**
     * @desc Generate result for point transformation.
     * @private
     * @memberOf MANTICORE.util.geometry
     * @param {PIXI.Point | PIXI.ObservablePoint | Point} p
     * @param {number} x
     * @param {number} y
     * @param {boolean} isIn
     * @returns {PIXI.Point | PIXI.ObservablePoint | Point}
     */

    _pGenResult(p, x, y, isIn) {
        if (isIn) {
            p.set(x, y);
            return p;
        }
        return new PIXI.Point(x, y);
    }
};

export default geometry;