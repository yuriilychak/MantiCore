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
                prev = new Spawn(action, paramArray[i]);
            }
        }

        const action1 = prev;
        const action2 = paramArray[last];
        const duration1 = action1.duration;
        const duration2 = action2.duration;
        const dif = duration1 - duration2;

        super(Math.max(duration1, duration2));
        /**
         * @type {?MANTICORE.animation.action.FiniteTimeAction}
         * @private
         */
        this._firstAction = action1;
        /**
         * @type {?MANTICORE.animation.action.FiniteTimeAction}
         * @private
         */
        this._secondAction = action2;

        if (dif > 0) {
            this._secondAction = new Sequence(action2, new DelayTime(dif));
        } else if (dif < 0) {
            this._firstAction = new Sequence(action1, new DelayTime(-dif));
        }
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
        return this.doReverse(new Spawn(this._firstAction.reverse(), this._secondAction.reverse()));
    }
}

export default Spawn;