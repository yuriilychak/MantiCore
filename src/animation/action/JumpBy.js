import ActionInterval from "./ActionInterval";
import Type from "util/Type";
import Constant from "constant";
import Geometry from "util/Geometry";

/**
 * @desc Moves a Node object simulating a parabolic jump movement by modifying its position property.
 * Relative to its movement.
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 * @example
 * const actionBy = new JumpBy(2, new PIXI.Point(300, 0), 50, 4);
 * const actionBy = new JumpBy(2, 300, 0, 50, 4);
 */

class JumpBy extends ActionInterval {

    /**
     * @constructor
     * @param {number} [duration = 0]
     * @param {PIXI.Point | Point | number} [position]
     * @param {number} [y]
     * @param {number} [height]
     * @param {number} [jumps]
     */

    constructor(duration, position, y, height, jumps) {
        super(duration);

        if (Type.isEmpty(jumps)) {
            jumps = height;
            height = y;
            y = position.y;
            position = position.x;
        }

        /**
         * @type {PIXI.Point | Point}
         * @private
         */
        this._startPoint = new PIXI.Point(0, 0);
        /**
         * @type {PIXI.Point | Point}
         * @private
         */
        this._previousPosition = new PIXI.Point(0, 0);
        /**
         * @type {PIXI.Point | Point}
         * @private
         */
        this._delta = new PIXI.Point(0, 0);
        /**
         * @type {number}
         * @private
         */
        this._height = height;
        /**
         * @type {number}
         * @private
         */
        this._jumps = jumps;

        this._delta.x = position;
        this._delta.y = y;
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.JumpBy}
     */

    clone() {
        return this.doClone(new JumpBy(this.duration, this._delta, this._height, this._jumps));
    }

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        const locPosX = target.x;
        const locPosY = target.y;
        this._previousPosition.x = locPosX;
        this._previousPosition.y = locPosY;
        this._startPoint.x = locPosX;
        this._startPoint.y = locPosY;
    }

    update(dt) {
        dt = this.computeEaseTime(dt);
        if (this.target) {
            const frac = dt * this._jumps % 1.0;
            let y = this._height * 4 * frac * (1 - frac);
            y += this._delta.y * dt;

            let x = this._delta.x * dt;
            const locStartPosition = this._startPoint;
            if (Constant.ENABLE_STACK_ACTIONS) {
                const targetX = this.target.x;
                const targetY = this.target.y;
                const locPreviousPosition = this._previousPosition;

                locStartPosition.x = locStartPosition.x + targetX - locPreviousPosition.x;
                locStartPosition.y = locStartPosition.y + targetY - locPreviousPosition.y;
                x = x + locStartPosition.x;
                y = y + locStartPosition.y;
                locPreviousPosition.x = x;
                locPreviousPosition.y = y;
                this.target.position.set(x, y);
            } else {
                this.target.position.set(locStartPosition.x + x, locStartPosition.y + y);
            }
        }
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.JumpBy}
     */

    reverse() {
        return this.doReverse(new JumpBy(this.duration, Geometry.pNeg(this._delta), this._height, this._jumps));
    }

    /**
     * @protected
     * @returns {number}
     */

    get height() {
        return this._height;
    }

    /**
     * @protected
     * @returns {number}
     */

    get jumps() {
        return this._jumps;
    }

    /**
     * @protected
     * @returns {PIXI.Point|Point}
     */

    get delta() {
        return this._delta;
    }

    /**
     * @protected
     * @returns {PIXI.Point|Point}
     */

    get startPoint() {
        return this._startPoint;
    }
}

export default JumpBy;