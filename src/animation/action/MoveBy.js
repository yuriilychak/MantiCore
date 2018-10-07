import ActionInterval from "./ActionInterval";
import Geometry from "util/Geometry";
import Constant from "constant";
import Type from "util/Type";

/**
 * @desc Moves a Node object x,y pixels by modifying its position property.                                  <br/>
 * x and y are relative to the position of the object.                                                     <br/>
 * Several MoveBy actions can be concurrently called, and the resulting                                  <br/>
 * movement will be the sum of individual movements.
 * </p>
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 * @example
 * const actionTo = moveBy(2, new PIXI.Point(windowSize.width - 40, windowSize.height - 40));
 */

class MoveBy extends ActionInterval {

    /**
     * @constructor
     * @param {number} duration duration in seconds
     * @param {PIXI.Point|number} deltaPos
     * @param {number} [deltaY]
     */

    constructor(duration, deltaPos, deltaY) {
        super(duration);
        /**
         * @type {PIXI.Point | Point}
         * @private
         */
        this._delta = new PIXI.Point(0, 0);
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


        if(Type.isNumber(deltaPos)) {
            this._delta.set(deltaPos, deltaY);
        }
        else {
            this._delta.copy(deltaPos);
        }
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.MoveBy}
     */

    clone() {
        return this.doClone(new MoveBy(this.duration, this._delta));
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
        this._prevPoint.x = locPosX;
        this._prevPoint.y = locPosY;
        this._startPoint.x = locPosX;
        this._startPoint.y = locPosY;
    }

    update(dt) {
        if (!Type.isNull(this.target)) {
            return;
        }
        dt = this.computeEaseTime(dt);
        let x = this._delta.x * dt;
        let y = this._delta.y * dt;

        if (Constant.ENABLE_STACK_ACTIONS) {
            const targetX = this.target.x;
            const targetY = this.target.y;

            this._prevPoint.x = this._startPoint.x + targetX - this._prevPoint.x;
            this._prevPoint.y = this._startPoint.y + targetY - this._prevPoint.y;
            x = x + this._prevPoint.x;
            y = y + this._prevPoint.y;
            this._prevPoint.x = x;
            this._prevPoint.y = y;
            this.target.position.set(x, y);
        } else {
            this.target.position.set(this._startPoint.x + x, this._startPoint.y + y);
        }
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.MoveBy}
     */

    reverse() {
        return this.doReverse(new MoveBy(this.duration, Geometry.pNeg(this._delta)));
    }

    /**
     * @protected
     * @returns {PIXI.Point|Point}
     */

    get delta() {
        return this._delta;
    }
}

export default MoveBy;