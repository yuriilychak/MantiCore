import JumpBy from "./JumpBy";
import Type from "../../util/Type";

/**
 * @desc Moves a Node object to a parabolic position simulating a jump movement by modifying it's position property. <br />
 * Jump to the specified location.
 * @class
 * @extends MANTICORE.animation.action.JumpBy
 * @memberOf MANTICORE.animation.action
 * @example
 * const actionTo = new JumpTo(2, new PIXI.Point(300, 0), 50, 4);
 * const actionTo = new JumpTo(2, 300, 0, 50, 4);
 */

class JumpTo extends JumpBy {

    /**
     * @constructor
     * @param {number} duration
     * @param {PIXI.Point|number} position
     * @param {number} [y]
     * @param {number} [height]
     * @param {number} [jumps]
     */

    constructor(duration, position, y, height, jumps) {
        super(duration, position, y, height, jumps);

        /**
         * @type {PIXI.Point | Point}
         * @private
         */
        this._endPosition = new PIXI.Point(0, 0);

        if(Type.isNumber(position)) {
            this._endPosition.set(position, y);
        }
        else {
            this._endPosition.copy(position);
        }
    }

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
     * @return {MANTICORE.animation.action.JumpTo}
     */

    clone() {
        return this.doClone(new JumpTo(this.duration, this._endPosition, this.height, this.jumps));
    }
}

export default JumpTo;