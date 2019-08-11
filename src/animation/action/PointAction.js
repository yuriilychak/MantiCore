import ActionInterval from "./ActionInterval";
import Point from "geometry/Point";

/**
 * @desc Base action for manipulate with point transformations (scale, position, skew).
 * @class
 * @extends mCore.animation.action.ActionInterval
 * @memberOf mCore.animation.action
 */

class PointAction extends ActionInterval{
    /**
     * @constructor
     * @param {number} t time in seconds
     * @param {number} x
     * @param {number} y
     */
    constructor(t, x, y) {
        super(t);

        /**
         * @type {mCore.geometry.Point}
         * @private
         */

        this._startPoint = Point.create(0, 0);

        /**
         * @type {mCore.geometry.Point}
         * @private
         */

        this._endPoint = Point.create(x, y);

        /**
         * @type {mCore.geometry.Point}
         * @private
         */

        this._delta = Point.create(0, 0);
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} t time in seconds
     * @param {number} x
     * @param {number} y
     */

    reuse(t, x, y) {
        super.reuse(t);
        this._startPoint.set(0, 0);
        this._endPoint.set(x, y);
        this._delta.set(0, 0);
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
        this._startPoint.set(0, 0);
        this._endPoint.set(0, 0);
        this._delta.set(0, 0);
        super.clearData();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @protected
     * @returns {mCore.geometry.Point|Point}
     */

    get startPoint() {
        return this._startPoint;
    }

    /**
     * @protected
     * @returns {mCore.geometry.Point|Point}
     */

    get endPoint() {
        return this._endPoint;
    }

    /**
     * @protected
     * @returns {mCore.geometry.Point|Point}
     */

    get delta() {
        return this._delta;
    }
}

export default PointAction;
