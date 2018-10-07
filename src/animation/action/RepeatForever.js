import ActionInterval from "./ActionInterval";

/**
 * @desc Repeats an action for ever.To repeat the an action for a limited number of times use the Repeat action. <br/>
 * @warning This action can't be Sequenceable because it is not an IntervalAction
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 * @example
 * const rep = new RepeatForever(new Sequence(jump2, jump1), 5);
 */

class RepeatForever extends ActionInterval{
    /**
     * @constructor
     * @param {MANTICORE.animation.action.ActionInterval} [action = null]
     */
    constructor(action = null) {
        super();
        /**
         * @type {?MANTICORE.animation.action.ActionInterval}
         * @private
         */
        this._innerAction = action;
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.RepeatForever}
     */

    clone() {
        return this.doClone(new RepeatForever(this._innerAction.clone()));
    }

    startWithTarget(target) {
        super.startWithTarget(target);
        this._innerAction.startWithTarget(target);
    }

    step(dt) {
        this._innerAction.step(dt);
        if (this._innerAction.isDone) {
            this._innerAction.startWithTarget(this.target);
            this._innerAction.step(this._innerAction.elapsed - this._innerAction.duration);
        }
    }

    get isDone() {
        return false;
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.RepeatForever}
     */

    reverse() {
        return this.doReverse(new RepeatForever(this._innerAction.reverse()));
    }

    /**
     * @desc Action to repeat.
     * @method
     * @public
     * @returns {?MANTICORE.animation.action.ActionInterval}
     */
    get innerAction() {
        return this._innerAction;
    }

    set innerAction(action) {
        if (this._innerAction !== action) {
            this._innerAction = action;
        }
    }
}

export default RepeatForever;