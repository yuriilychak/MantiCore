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
        const actions = Spawn._initActionArray(...arguments);

        if (actions.length === 0) {
            return;
        }

        super(Math.max(actions[0].duration, actions[1].duration));

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

        this._updateActions(actions[0], actions[1]);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.Spawn}
     */

    clone() {
        return this.doClone(Spawn.create(this._firstAction.clone(), this._secondAction.clone()));
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
        return this.doReverse(Spawn.create(this._firstAction.reverse(), this._secondAction.reverse()));
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {...*} var_args
     */

    reuse(var_args) {
        const actions = Spawn._initActionArray(...arguments);

        if (actions.length === 0) {
            return;
        }

        super.reuse(Math.max(actions[0].duration, actions[1].duration));

        this._updateActions(actions[0], actions[1]);
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
        this._firstAction.kill();
        this._firstAction = null;
        this._secondAction.kill();
        this._secondAction = null;
        super.clearData();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Update actions.
     * @method
     * @private
     * @param {MANTICORE.animation.action.ActionInterval} action1
     * @param {MANTICORE.animation.action.ActionInterval} action2
     */

    _updateActions(action1, action2) {
        const duration1 = action1.duration;
        const duration2 = action2.duration;
        const dif = duration1 - duration2;

        this._firstAction = action1;
        this._secondAction = action2;

        if (dif > 0) {
            this._secondAction = Sequence.create(this._secondAction, DelayTime.create(dif));
        } else if (dif < 0) {
            this._firstAction = Sequence.create(this._firstAction, DelayTime.create(-dif));
        }
    }

    /**
     * @desc Returns two actions for spawn.
     * @static
     * @method
     * @private
     * @param {...*} var_args
     * @return {MANTICORE.animation.action.ActionInterval[]}
     */

    static _initActionArray(var_args) {
        const paramArray = Type.isArray(arguments[0]) ? arguments[0] : arguments;

        if (paramArray.length <= 1) {
            return [];
        }
        const last = paramArray.length - 1;


        let prev = paramArray[0];
        let action, i;

        for (i = 1; i < last; ++i) {
            if (paramArray[i]) {
                action = prev;
                prev = Spawn.create(action, paramArray[i]);
            }
        }

        return [prev, paramArray[last]];
    }
}

export default Spawn;