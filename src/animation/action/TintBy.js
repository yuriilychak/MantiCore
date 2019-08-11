import ActionInterval from "./ActionInterval";
import Color from "util/Color";

/**
 * @desc Tints a Node that implements the NodeRGB protocol from current tint to a custom one.
 * Relative to their own color change.
 * @class
 * @extends mCore.animation.action.ActionInterval
 * @memberOf mCore.animation.action
 * @example
 * const action = new TintBy(2, -127, -255, -127);
 */

class TintBy extends ActionInterval{
    /**
     * @constructor
     * @param {number} duration  duration in seconds
     * @param {number} deltaRed
     * @param {number} deltaGreen
     * @param {number} deltaBlue
     */
    constructor(duration, deltaRed, deltaGreen, deltaBlue) {
        super(duration);
        /**
         * @type {int[]}
         * @private
         */
        this._delta = [deltaRed, deltaGreen, deltaBlue];
        /**
         * @type {int[]}
         * @private
         */
        this._from = [0, 0, 0];
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.TintBy}
     */

    clone() {
        return this.doClone(TintBy.create(this.duration, this._delta[0], this._delta[1], this._delta[2]));
    }

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        this._from = Color.intToRgb(this.target.tint);
    }

    update(dt) {
        dt = this.computeEaseTime(dt);

        const r = this._from[0] + this._delta[0] * dt;
        const g = this._from[1] + this._delta[1] * dt;
        const b = this._from[2] + this._delta[2] * dt;

        this.target.tint = Color.rgbToInt(
            r >= 0 ? r : 0,
            g >= 0 ? g : 0,
            b >= 0 ? b : 0
        );
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {mCore.animation.action.TintBy}
     */

    reverse() {
        return this.doReverse(TintBy.create(this.duration, -this._delta[0], -this._delta[1], -this._delta[2]));
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} duration  duration in seconds
     * @param {number} deltaRed
     * @param {number} deltaGreen
     * @param {number} deltaBlue
     */

    reuse(duration, deltaRed, deltaGreen, deltaBlue) {
        super.reuse(duration);
        this._delta = [deltaRed, deltaGreen, deltaBlue];
        this._from = [0, 0, 0];
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
        this._delta.length = 0;
        this._from.length = 0;
        super.clearData();
    }
}

export default TintBy;
