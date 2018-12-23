import ActionInterval from "./ActionInterval";
import Type from "util/Type";
import Point from "geometry/Point";
import Geometry from "util/Geometry";

/**
 * @desc Moves a Node object simulating a parabolic jump movement by modifying its position property.
 * Relative to its movement.
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 * @example
 * const actionBy = new JumpBy(2, new MANTICORE.geometry.Point(300, 0), 50, 4);
 * const actionBy = new JumpBy(2, 300, 0, 50, 4);
 */

class JumpBy extends ActionInterval {

    /**
     * @constructor
     * @param {number} [duration = 0]
     * @param {MANTICORE.geometry.Point | number} [position]
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
         * @type {MANTICORE.geometry.Point}
         * @private
         */
        this._startPoint = Point.create(0, 0);
        /**
         * @type {MANTICORE.geometry.Point}
         * @private
         */
        this._previousPosition = Point.create(0, 0);
        /**
         * @type {MANTICORE.geometry.Point}
         * @private
         */
        this._delta = Point.create(0, 0);
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
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.JumpBy}
     */

    clone() {
        return this.doClone(JumpBy.create(this.duration, this._delta, this._height, this._jumps));
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
        if (this.hasTarget()) {
            const frac = dt * this._jumps % 1.0;
            let y = this._height * 4 * frac * (1 - frac);
            y += this._delta.y * dt;

            let x = this._delta.x * dt;
            this.target.position.set(this._startPoint.x + x, this._startPoint.y + y);
        }
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.JumpBy}
     */

    reverse() {
        return this.doReverse(JumpBy.create(this.duration, Geometry.pNeg(this._delta), this._height, this._jumps));
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} [duration = 0]
     * @param {MANTICORE.geometry.Point | number} [position]
     * @param {number} [y]
     * @param {number} [height]
     * @param {number} [jumps]
     */

    reuse(duration, position, y, height, jumps) {
        super.reuse(duration);

        if (Type.isEmpty(jumps)) {
            jumps = height;
            height = y;
            y = position.y;
            position = position.x;
        }

        this._startPoint.set(0, 0);
        this._previousPosition.set(0, 0);
        this._delta.set(0, 0);
        this._height = height;
        this._jumps = jumps;
        this._delta.x = position;
        this._delta.y = y;
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
        this._previousPosition.set(0, 0);
        this._delta.set(0, 0);
        this._height = -1;
        this._jumps = -1;
        super.clearData();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

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
     * @returns {MANTICORE.geometry.Point|Point}
     */

    get delta() {
        return this._delta;
    }

    /**
     * @protected
     * @returns {MANTICORE.geometry.Point|Point}
     */

    get startPoint() {
        return this._startPoint;
    }
}

export default JumpBy;