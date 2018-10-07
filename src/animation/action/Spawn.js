import ActionInterval from "./ActionInterval";
import Type from "util/Type";
import Math from "util/Math";
import Sequence from "./Sequence";
import DelayTime from "./DelayTime";

/**
 * @desc Spawn a new action immediately
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 */

class Spawn extends ActionInterval {

    /**
     * @constructor
     * @param {MANTICORE.animation.action.FiniteTimeAction[] | ...MANTICORE.animation.action.FiniteTimeAction} [var_args]
     */
    constructor(var_args) {
        super();
        /**
         * @type {?MANTICORE.animation.action.FiniteTimeAction}
         * @private
         */
        this._firstAction = null;
        /**
         * @type {?MANTICORE.animation.action.FiniteTimeAction}
         * @private
         */
        this._secondAction = null;

        const paramArray = Type.isArray(arguments[0]) ? arguments[0] : arguments;

        if (paramArray.length <= 1) {
            return;
        }
        const last = paramArray.length - 1;


        let prev = paramArray[0];
        let action, i;

        for (i = 1; i < last; ++i) {
            if (paramArray[i]) {
                action = prev;
                prev = Spawn.actionOneTwo(action, paramArray[i]);
            }
        }
        this.initWithTwoActions(prev, paramArray[last]);
    }

    /**
     * @desc Initializes the Spawn action with the 2 actions to spawn
     * @param {MANTICORE.animation.action.FiniteTimeAction} action1
     * @param {MANTICORE.animation.action.FiniteTimeAction} action2
     * @return {boolean}
     */
    initWithTwoActions(action1 = null, action2 = null) {
        if (Type.isNull(action1) || Type.isNull(action2)) {
            return false;
        }

        const duration1 = action1.duration;
        const duration2 = action2.duration;
        const dif = duration1 - duration2;

        if (this.initWithDuration(Math.max(duration1, duration2))) {
            this._firstAction = action1;
            this._secondAction = action2;

            if (dif > 0) {
                this._secondAction = Sequence.actionOneTwo(action2, new DelayTime(dif));
            } else if (dif < 0) {
                this._firstAction = Sequence.actionOneTwo(action1, new DelayTime(-dif));
            }

            return true;
        }
        return false;
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.Spawn}
     */

    clone() {
        return this.doClone(new Spawn(this._firstAction.clone(), this._secondAction.clone()));
    }

    startWithTarget(target) {
        super.startWithTarget(target);
        this._firstAction.startWithTarget(target);
        this._secondAction.startWithTarget(target);
    }

    stop(){
        this._firstAction.stop();
        this._secondAction.stop();
        super.stop();
    }

    update(dt) {
        dt = this.computeEaseTime(dt);
        if (!Type.isNull(this._firstAction)) {
            this._firstAction.update(dt);
        }

        if (!Type.isNull(this._secondAction)) {
            this._secondAction.update(dt);
        }
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.Spawn}
     */

    reverse() {
        return this.doReverse( Spawn.actionOneTwo(this._firstAction.reverse(), this._secondAction.reverse()));
    }

    static actionOneTwo(action1, action2) {
        const result = new Spawn();
        result.initWithTwoActions(action1, action2);
        return result;
    }
}

export default Spawn;