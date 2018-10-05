import Action from "./Action";

/**
 * Base class actions that do have a finite time duration. <br/>
 * Possible actions: <br/>
 * - An action with a duration of 0 seconds. <br/>
 * - An action with a duration of 35.5 seconds.
 *
 * Infinite time actions are valid
 * @class
 * @memberOf MANTICORE.animation.action
 * @extends MANTICORE.animation.action.Action
 */

class FiniteTimeAction extends Action{
    /**
     * @constructor
     */
    constructor() {
        super();
        /**
         * @desc Duration in seconds
         * @type {number}
         * @private
         */
        this._duration = 0;

        /**
         * @type {int}
         * @private
         */
        this._repeatCount = 1;
    }
    /**
     * @desc Get duration of the action. (seconds).
     * @public
     * @return {Number}
     */
    get duration () {
        return this._duration * this._repeatCount;
    }

    set duration (value) {
        if (this._duration === value) {
            return;
        }
        this._duration = value;
    }

    /**
     * @desc Returns time for repeat action.
     * @public
     * @return {int}
     */

    get repeatCount() {
        return this._repeatCount;
    }

    set repeatCount(value) {
        if (this._repeatCount === value) {
            return
        }
        this._repeatCount = value;
    }

    /**
     * Returns a reversed action. <br />
     * For example: <br />
     * - The action will be x coordinates of 0 move to 100. <br />
     * - The reversed action will be x of 100 move to 0.
     * - Will be rewritten
     * @method
     * @public
     * @return {null}
     */
    reverse() {
        return null;
    }

    /**
     * Need to copy object with deep copy.
     * returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.FiniteTimeAction}
     */
    clone() {
        return new FiniteTimeAction();
    }
}

export default FiniteTimeAction;