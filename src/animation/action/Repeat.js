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
        super();
        /**
         * @type {int}
         * @private
         */
        this._times = 0;
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
        this._innerAction = null;
        this.initWithAction(action, times);
    }

    /**
     * @method
     * @public
     * @param {MANTICORE.animation.action.FiniteTimeAction} action
     * @param {int} times
     * @return {boolean}
     */
    initWithAction(action, times) {
        if (action === null) {
            return false;
        }
        const duration = action._duration * times;

        if (!this.initWithDuration(duration)) {
            return false;
        }
        this._times = times;
        this._innerAction = action;
        if (action instanceof ActionInstant){
            this._actionInstant = true;
            this._times -= 1;
        }
        this._total = 0;
        return true;
    }

    clone() {
        const action = new Repeat();
        this.cloneDecoration(action);
        action.initWithAction(this._innerAction.clone(), this._times);
        return action;
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

    get isDone() {
        return this._total === this._times;
    }

    reverse() {
        const action = new Repeat(this._innerAction.reverse(), this._times);
        this.cloneDecoration(action);
        this.reverseEases(action);
        return action;
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