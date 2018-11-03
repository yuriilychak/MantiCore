import ActionInterval from "./ActionInterval";
import ActionInstant from "./ActionInstant";

/**
 * @desc Repeats an action a number of times. To repeat an action forever use the CCRepeatForever action.
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 * @example
 * const rep = new Repeat(new Sequence(jump2, jump1), 5);
 */


class Repeat extends ActionInterval {

    /**
     * @constructor
     * @param {MANTICORE.animation.action.FiniteTimeAction} [action]
     * @param {int} [times]
     */
    constructor(action = null, times = 1) {
        const duration = action.duration * times;
        super(duration);
        /**
         * @type {int}
         * @private
         */
        this._times = times;
        /**
         * @type {int}
         * @private
         */
        this._total = 0;
        /**
         * @type {number}
         * @private
         */
        this._nextDt = 0;
        /**
         * @type {boolean}
         * @private
         */
        this._actionInstant = false;
        /**
         *
         * @type {?MANTICORE.animation.action.FiniteTimeAction}
         * @private
         */
        this._innerAction = action;

        if (this._innerAction instanceof ActionInstant){
            this._actionInstant = true;
            this._times -= 1;
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
     * @return {MANTICORE.animation.action.Repeat}
     */

    clone() {
        return this.doClone(Repeat.create(this._innerAction.clone(), this._times));
    }

    startWithTarget(target) {
        this._total = 0;
        this._nextDt = this._innerAction.duration / this.duration;
        super.startWithTarget(target);
        this._innerAction.startWithTarget(target);
    }

    stop() {
        this._innerAction.stop();
        super.stop();
    }

    update(dt) {
        dt = this.computeEaseTime(dt);
        let locNextDt = this._nextDt;

        if (dt >= locNextDt) {
            while (dt > locNextDt && this._total < this._times) {
                this._innerAction.update(1);
                ++this._total;
                this._innerAction.stop();
                this._innerAction.startWithTarget(this.target);
                locNextDt += this._innerAction._duration / this.duration;
                this._nextDt = locNextDt > 1 ? 1 : locNextDt;
            }

            if (dt >= 1.0 && this._total < this._times) {
                this._innerAction.update(1);
                this._total++;
            }

            if (this._actionInstant) {
                return;
            }

            if (this._total === this._times) {
                this._innerAction.stop();
            } else {
                this._innerAction.update(dt - (locNextDt - this._innerAction.duration / this.duration));
            }

            return;
        }
        this._innerAction.update((dt * this._times) % 1);
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.Repeat}
     */

    reverse() {
        return this.doReverse(Repeat.create(this._innerAction.reverse(), this._times));
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {MANTICORE.animation.action.FiniteTimeAction} [action]
     * @param {int} [times]
     */

    reuse(action = null, times = 1) {
        const duration = action.duration * times;
        super.reuse(duration);
        this._times = times;
        this._total = 0;
        this._nextDt = 0;
        this._actionInstant = false;
        this._innerAction = action;

        if (this._innerAction instanceof ActionInstant){
            this._actionInstant = true;
            this._times -= 1;
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
        this._times = -1;
        this._total = 0;
        this._nextDt = 0;
        this._actionInstant = false;
        this._innerAction.kill();
        this._innerAction = null;
        super.clearData();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    get isDone() {
        return this._total === this._times;
    }

    /**
     * @desc Action to repeat.
     * @public
     * @returns {?MANTICORE.animation.action.FiniteTimeAction}
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

export default Repeat;