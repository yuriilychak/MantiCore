import ActionInterval from "./ActionInterval";

/**
 * @desc Repeats an action for ever.To repeat the an action for a limited number of times use the Repeat action. <br/>
 * @warning This action can't be Sequenceable because it is not an IntervalAction
 * @class
 * @extends mCore.animation.action.ActionInterval
 * @memberOf mCore.animation.action
 * @example
 * const rep = new RepeatForever(new Sequence(jump2, jump1), 5);
 */

class RepeatForever extends ActionInterval{
    /**
     * @constructor
     * @param {mCore.animation.action.ActionInterval} action
     */
    constructor(action) {
        super();
        /**
         * @type {?mCore.animation.action.ActionInterval}
         * @private
         */
        this._innerAction = action;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.RepeatForever}
     */

    clone() {
        return this.doClone(RepeatForever.create(this._innerAction.clone()));
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

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {mCore.animation.action.RepeatForever}
     */

    reverse() {
        return this.doReverse(RepeatForever.create(this._innerAction.reverse()));
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {mCore.animation.action.ActionInterval} action
     */

    reuse(action) {
        this._innerAction = action;
        super.reuse();
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
        this._innerAction.kill();
        this._innerAction = null;
        super.clearData();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    get isDone() {
        return false;
    }

    /**
     * @desc Action to repeat.
     * @method
     * @public
     * @returns {?mCore.animation.action.ActionInterval}
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
