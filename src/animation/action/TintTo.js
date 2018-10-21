import ActionInterval from "./ActionInterval";
import Color from "util/Color";

/**
 * @desc Tints a Node that implements the NodeRGB protocol from current tint to a custom one.
 * @warning This action doesn't support "reverse"
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 * @example
 * const action = new TintTo(2, 255, 0, 255);
 */

class TintTo extends ActionInterval {
    /**
     * @constructor
     * @param {number} duration
     * @param {number} red [0-255]
     * @param {number} [green]  [0-255]
     * @param {number} [blue] [0-255]
     */
    constructor(duration, red, green = -1, blue = -1) {
        super(duration);

        if (green === -1) {
            const color = Color.intToRgb(red);
            red = color[0];
            green = color[1];
            blue = color[2];
        }

        /**
         * @type {number[]}
         * @private
         */
        this._to = [red, green, blue];
        /**
         * @type {number[]}
         * @private
         */
        this._from = [0, 0, 0];
    }


    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.TintTo}
     */

    clone() {
        return this.doClone(new TintTo(this.duration, this._to[0], this._to[1], this._to[2]));
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
        this.target.tint = Color.rgbToInt(
            this._from[0] + (this._to[0] - this._from[0]) * dt,
            this._from[1] + (this._to[1] - this._from[1]) * dt,
            this._from[2] + (this._to[2] - this._from[2]) * dt
        );
    }
}

export default TintTo;