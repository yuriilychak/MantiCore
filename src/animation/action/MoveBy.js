import ActionInterval from "./ActionInterval";
import Geometry from "util/Geometry";
import Type from "util/Type";
import Point from "geometry/Point";

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
 * const actionTo = moveBy(2, new MANTICORE.geometry.Point(windowSize.width - 40, windowSize.height - 40));
 */

class MoveBy extends ActionInterval {

    /**
     * @constructor
     * @param {number} duration duration in seconds
     * @param {MANTICORE.geometry.Point|number} deltaPos
     * @param {number} [deltaY]
     */

    constructor(duration, deltaPos, deltaY) {
        super(duration);
        /**
         * @type {MANTICORE.geometry.Point}
         * @private
         */
        this._delta = Point.create(0, 0);
        /**
         * @type {MANTICORE.geometry.Point}
         * @private
         */
        this._startPoint = Point.create(0, 0);
        /**
         * @type {MANTICORE.geometry.Point}
         * @private
         */
        this._prevPoint = Point.create(0, 0);


        if(Type.isNumber(deltaPos)) {
            this._delta.set(deltaPos, deltaY);
        }
        else {
            this._delta.copyFrom(deltaPos);
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
     * @return {MANTICORE.animation.action.MoveBy}
     */

    clone() {
        return this.doClone(MoveBy.create(this.duration, this._delta));
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
        if (Type.isNull(this.target)) {
            return;
        }
        dt = this.computeEaseTime(dt);
        const x = this._delta.x * dt;
        const y = this._delta.y * dt;

        if (x !== 0) {
            this.target.x = this._startPoint.x + x;
        }

        if (y !== 0) {
            this.target.y = this._startPoint.y + y;
        }
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.MoveBy}
     */

    reverse() {
        return this.doReverse(MoveBy.create(this.duration, Geometry.pNeg(this._delta)));
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} duration duration in seconds
     * @param {MANTICORE.geometry.Point|number} deltaPos
     * @param {number} [deltaY]
     */

    reuse(duration, deltaPos, deltaY) {
        super.reuse(duration);
        this._startPoint.set(0, 0);
        this._prevPoint.set(0, 0);

        if(Type.isNumber(deltaPos)) {
            this._delta.set(deltaPos, deltaY);
        }
        else {
            this._delta.copyFrom(deltaPos);
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
        this._delta.set(0, 0);
        this._startPoint.set(0, 0);
        this._prevPoint.set(0, 0);
        super.clearData();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @protected
     * @returns {MANTICORE.geometry.Point|Point}
     */

    get delta() {
        return this._delta;
    }
}

export default MoveBy;