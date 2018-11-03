import ActionInterval from "./ActionInterval";
import Constant from "constant";

/**
 * @desc An action that moves the target with a cubic Bezier curve by a certain distance. Relative to its movement.
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 * @example
 * const bezier = [new PIXI.Point(0, windowSize.height / 2), new PIXI.Point(300, -windowSize.height / 2), new PIXI.Point(300, 100)];
 * const bezierForward = new BezierBy(3, bezier);
 */

class BezierBy extends ActionInterval{

    /**
     * @constructor
     * @param {number} t - time in seconds
     * @param {PIXI.Point[]} c - Array of points
     */
    constructor(t, c) {
        super(t);
        /**
         * @type {PIXI.Point[]}
         * @private
         */
        this._config = c;
        /**
         * @type {PIXI.Point | Point}
         * @private
         */
        this._startPoint = new PIXI.Point(0, 0);
        /**
         * @type {PIXI.Point | Point}
         * @private
         */
        this._prevPoint = new PIXI.Point(0, 0);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.BezierBy}
     */

    clone() {
        const newConfigs = [];
        const configSize = this._config.length;
        for (let i = 0; i < configSize; ++i) {
            newConfigs.push(this._config[i].clone());
        }
        return this.doClone(BezierBy.create(this.duration, newConfigs));
    }

    startWithTarget(target) {
        ActionInterval.prototype.startWithTarget.call(this, target);
        const locPosX = target.x;
        const locPosY = target.y;
        this._prevPoint.x = locPosX;
        this._prevPoint.y = locPosY;
        this._startPoint.x = locPosX;
        this._startPoint.y = locPosY;
    }

    update(dt) {
        if (!this.hasTarget()) {
            return;
        }

        dt = this.computeEaseTime(dt);

        const locConfig = this._config;
        const xa = 0;
        const xb = locConfig[0].x;
        const xc = locConfig[1].x;
        const xd = locConfig[2].x;

        const ya = 0;
        const yb = locConfig[0].y;
        const yc = locConfig[1].y;
        const yd = locConfig[2].y;

        const x = BezierBy._bezierAt(xa, xb, xc, xd, dt);
        const y = BezierBy._bezierAt(ya, yb, yc, yd, dt);

        const locStartPosition = this._startPoint;

        this.target.position.set(locStartPosition.x + x, locStartPosition.y + y);
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.BezierBy}
     */

    reverse() {
        const locConfig = this._config;
        const x0 = locConfig[0].x, y0 = locConfig[0].y;
        const x1 = locConfig[1].x, y1 = locConfig[1].y;
        const x2 = locConfig[2].x, y2 = locConfig[2].y;
        const r = [
            new PIXI.Point(x1 - x2, y1 - y2),
            new PIXI.Point(x0 - x2, y0 - y2),
            new PIXI.Point(-x2, -y2) ];
        return this.doReverse(BezierBy.create(this.duration, r));
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} t
     * @param {PIXI.Point[]} c - Array of points
     */

    reuse(t, c) {
        super.reuse(t);
        this._config = c;
        this._startPoint.set(0, 0);
        this._prevPoint.set(0, 0);
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
        this._config.length;
        this._startPoint.set(0, 0);
        this._prevPoint.set(0, 0);
        super.clearData();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @private
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @param {number} d
     * @param {number} t
     * @returns {number}
     */

    static _bezierAt(a, b, c, d, t) {
        return (Math.pow(1 - t, 3) * a +
            3 * t * (Math.pow(1 - t, 2)) * b +
            3 * Math.pow(t, 2) * (1 - t) * c +
            Math.pow(t, 3) * d );
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
     * @returns {PIXI.Point[]}
     */

    get config() {
        return this._config;
    }
}

export default BezierBy