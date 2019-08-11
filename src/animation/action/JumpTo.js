import JumpBy from "./JumpBy";
import Type from "../../util/Type";
import Point from "geometry/Point";

/**
 * @desc Moves a Node object to a parabolic position simulating a jump movement by modifying it's position property. <br />
 * Jump to the specified location.
 * @class
 * @extends mCore.animation.action.JumpBy
 * @memberOf mCore.animation.action
 * @example
 * const actionTo = new JumpTo(2, new mCore.geometry.Point(300, 0), 50, 4);
 * const actionTo = new JumpTo(2, 300, 0, 50, 4);
 */

class JumpTo extends JumpBy {

    /**
     * @constructor
     * @param {number} duration
     * @param {mCore.geometry.Point|number} position
     * @param {number} [y]
     * @param {number} [height]
     * @param {number} [jumps]
     */

    constructor(duration, position, y, height, jumps) {
        super(duration, position, y, height, jumps);

        /**
         * @type {mCore.geometry.Point}
         * @private
         */
        this._endPosition = Point.create(0, 0);

        if(Type.isNumber(position)) {
            this._endPosition.set(position, y);
        }
        else {
            this._endPosition.copyFrom(position);
        }
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        this.delta.set(
            this._endPosition.x - this.startPoint.x,
            this._endPosition.y - this.startPoint.y
        );
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.JumpTo}
     */

    clone() {
        return this.doClone(JumpTo.create(this.duration, this._endPosition, this.height, this.jumps));
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} duration
     * @param {mCore.geometry.Point|number} position
     * @param {number} [y]
     * @param {number} [height]
     * @param {number} [jumps]
     */

    reuse(duration, position, y, height, jumps) {
        super.reuse(duration, position, y, height, jumps);

        if(Type.isNumber(position)) {
            this._endPosition.set(position, y);
        }
        else {
            this._endPosition.copyFrom(position);
        }
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
        this._endPosition.set(0, 0);
        super.clearData();
    }
}

export default JumpTo;
