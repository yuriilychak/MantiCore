import Type from "util/Type";

/**
 * @desc Base class for all animation actions.
 * @class
 * @memberOf MANTICORE.animation.action
 */

class Action {
    /**
     * @constructor
     */
    constructor () {
        /**
         * @type {?PIXI.DisplayObject}
         * @private
         */
        this._originalTarget = null;
        /**
         * @type {?PIXI.DisplayObject}
         * @private
         */
        this._target = null;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.Action}
     */
    clone() {
        return new Action();
    }

    /**
     * @desc Returns is action has target.
     * @method
     * @public
     * @returns {boolean}
     */

    hasTarget() {
        return !Type.isNull(this._target);
    }

    /**
     * @desc Returns true if the action has finished.
     * @return {boolean}
     */
    get isDone() {
        return true;
    }

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        this._originalTarget = target;
        this._target = target;
    }

    /**
     * @desc Called after the action has finished. It will set the 'target' to nil.
     * @method
     * @public
     */
    stop() {
        this._target = null;
    }

    /**
     * @desc Called every frame with it's delta time.
     * @method
     * @public
     * @property {number} dt
     */
    step(dt) {}

    /**
     * @desc Called once per frame. Time is the number of seconds of a frame interval.
     * @param {number} dt
     */

    update (dt) {}

    /**
     * @desc Returns the target.
     * @public
     * @return {PIXI.DisplayObject | null}
     */
    get target() {
        return this._target;
    }

    set target(value) {
        if (this._target === target) {
            return;
        }
        this._target = value;
    }

    /**
     * @desc Set the original target, since target can be nil.<br>
     *     Is the target that were used to run the action.
     *     Unless you are doing something complex, like ActionManager, you should NOT call this method.
     * @public
     * @return {?PIXI.DisplayObject}
     */

    get originalTarget () {
        return this._originalTarget;
    }

    set originalTarget(value) {
        this._originalTarget = value;
    }
}

export default Action;