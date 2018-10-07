import ActionInterval from "./ActionInterval";
import Type from "util/Type";

/**
 * @desc Runs actions sequentially, one after another.
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 * @param {Array|FiniteTimeAction} tempArray
 * @example
 * // create sequence with actions
 * const seq = new Sequence(act1, act2);
 *
 * // create sequence with array
 * const seq = new Sequence(actArray);
 */

class Sequence extends ActionInterval {
    /**
     * @constructor
     * @param {MANTICORE.animation.action.FiniteTimeAction[] | ...MANTICORE.animation.action.FiniteTimeAction[]} [var_args]
     */
    constructor(var_args) {
        super();
        /**
         * @type {MANTICORE.animation.action.FiniteTimeAction[]}
         * @private
         */
        this._actions = [];

        /**
         * @type {number}
         * @private
         */
        this._split = 0;

        /**
         * @type {int}
         * @private
         */
        this._last = 0;

        /**
         * @type {boolean}
         * @private
         */
        this._reversed = false;


        const paramArray = Type.isArray(arguments[0]) ? arguments[0] : arguments;
        if (paramArray.length <= 1) {
            return;
        }
        const last = paramArray.length - 1;

        let prev = paramArray[0];
        let action, i;
        for (i = 1; i < last; ++i) {
            if (Type.isEmpty(paramArray[i])) {
                continue;
            }
            action = prev;
            prev = Sequence.actionOneTwo(action, paramArray[i]);
        }
        this.initWithTwoActions(prev, paramArray[last]);

    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Initializes the action <br/>
     * @param {MANTICORE.animation.action.FiniteTimeAction} actionOne
     * @param {MANTICORE.animation.action.FiniteTimeAction} actionTwo
     * @return {boolean}
     */
    initWithTwoActions(actionOne, actionTwo) {
        if (Type.isEmpty(actionOne) || Type.isEmpty(actionTwo)) {
            return false;
        }

        let durationOne = actionOne.duration, durationTwo = actionTwo.duration;
        durationOne *= actionOne.repeatMethod ? actionOne.repeatCount : 1;
        durationTwo *= actionTwo.repeatMethod ? actionTwo.repeatCount : 1;
        const duration = durationOne + durationTwo;
        this.initWithDuration(duration);

        this._actions[0] = actionOne;
        this._actions[1] = actionTwo;
        return true;
    }

    /**
     * @public
     * @returns {boolean}
     */

    get reversed() {
        return this._reversed;
    }

    set reversed(value) {
        if (this._reversed === value) {
            return;
        }
        this._reversed = value;
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.Sequence}
     */

    clone() {
        return this.doClone(new Sequence(this._actions[0].clone(), this._actions[1].clone()));
    }

    startWithTarget(target) {
        super.startWithTarget(target);
        this._split = this._actions[0].duration / this.duration;
        this._split *= this._actions[0].repeatMethod ? this._actions[0].repeatCount : 1;
        this._last = -1;
    }

    stop() {
        if (this._last !== -1) {
            this._actions[this._last].stop();
        }
        super.stop();
    }

    update(dt) {
        let found = 0;
        let resultTime, actionFound;

        dt = this.computeEaseTime(dt);

        if (dt < this._split) {
            resultTime = (this._split !== 0) ? dt / this._split : 1;

            if (found === 0 && this._last === 1 && this._reversed) {
                this._updateAction(1, 0);
            }
        } else {
            found = 1;
            resultTime = (this._split === 1) ? 1 : (dt - this._split) / (1 - this._split);

            const firstAction = this._actions[0];

            switch(this._last) {
                case -1: {
                    firstAction.startWithTarget(this.target);
                    this._updateAction(0, 1);
                    break;
                }
                case 0: {
                    this._updateAction(0, 1);
                    break;
                }
            }
        }

        actionFound = this._actions[found];
        if (this._last === found && actionFound.isDone)
            return;

        if (this._last !== found)
            actionFound.startWithTarget(this.target);

        resultTime = resultTime * actionFound.repeatCount;
        actionFound.update(resultTime > 1 ? resultTime % 1 : resultTime);
        this._last = found;
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.Sequence}
     */

    reverse() {
        const action = this.doReverse(Sequence.actionOneTwo(this._actions[1].reverse(), this._actions[0].reverse()));
        action.reversed = true;
        return action;
    }

    /**
     * @method
     * @static
     * @public
     * @param {MANTICORE.animation.action.FiniteTimeAction} actionOne
     * @param {MANTICORE.animation.action.FiniteTimeAction} actionTwo
     * @returns {MANTICORE.animation.action.Sequence}
     */

    static actionOneTwo(actionOne, actionTwo) {
        return new Sequence([actionOne, actionTwo]);
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @private
     * @param {int} index
     * @param {number} time
     */

     _updateAction(index, time) {
         const action = this._actions[index];
         action.update(time);
         action.stop();
     }
}

export default Sequence;