import ActionInterval from "./ActionInterval";

/**
 * @desc Base action for manipulate with point transformations (scale, position, skew).
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
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
         * @type {PIXI.Point | Point}
         * @private
         */

        this._startPoint = new PIXI.Point(0, 0);

        /**
         * @type {PIXI.Point | Point}
         * @private
         */

        this._endPoint = new PIXI.Point(x, y);

        /**
         * @type {PIXI.Point | Point}
         * @private
         */

        this._delta = new PIXI.Point(0, 0);
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
     * @returns {PIXI.Point|Point}
     */

    get startPoint() {
        return this._startPoint;
    }

    /**
     * @protected
     * @returns {PIXI.Point|Point}
     */

    get endPoint() {
        return this._endPoint;
    }

    /**
     * @protected
     * @returns {PIXI.Point|Point}
     */

    get delta() {
        return this._delta;
    }
}

export default PointAction;