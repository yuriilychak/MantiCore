import MoveBy from "./MoveBy";
import Type from "../../util/Type";

/**
 * @desc Moves a Node object to the position x,y. x and y are absolute coordinates by modifying its position property. <br/>
 * Several MoveTo actions can be concurrently called, and the resulting                                            <br/>
 * movement will be the sum of individual movements.
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 * @example
 * const actionBy = new MoveTo(2, new PIXI.Point(80, 80));
 */

class MoveTo extends MoveBy {

    /**
     * @constructor
     * @param {number} duration duration in seconds
     * @param {PIXI.Point | number} position
     * @param {number} [y]
     */

    constructor(duration, position, y) {
        super(duration, position, y);
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
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.MoveTo}
     */

    clone() {
        return this.doClone(MoveTo.create(this.duration, this._endPosition));
    }

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        this.delta.x = this._endPosition.x - target.x;
        this.delta.y = this._endPosition.y - target.y;
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} duration duration in seconds
     * @param {PIXI.Point | number} position
     * @param {number} [y]
     */

    reuse(duration, position, y) {
        super.reuse(duration, position, y);

        if(Type.isNumber(position)) {
            this._endPosition.set(position, y);
        }
        else {
            this._endPosition.copy(position);
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

export default MoveTo;