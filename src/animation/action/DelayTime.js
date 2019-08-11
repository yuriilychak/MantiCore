import ActionInterval from "./ActionInterval";

/**
 * @desc Delays the action a certain amount of seconds
 * @class
 * @extends mCore.animation.action.ActionInterval
 * @memberOf mCore.animation.action
 */

class DelayTime extends ActionInterval{

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    update(dt) {}

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {mCore.animation.action.DelayTime}
     */

    reverse() {
        return this.doReverse(DelayTime.create(this.duration));
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.DelayTime}
     */

    clone() {
        return this.doClone(DelayTime.create(this.duration));
    }
}

export default DelayTime;
