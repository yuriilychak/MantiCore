import ActionInterval from "./ActionInterval";

/**
 * @desc Delays the action a certain amount of seconds
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 */

class DelayTime extends ActionInterval{
    update(dt) {}

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.DelayTime}
     */

    reverse() {
        return this.doReverse(new DelayTime(this.duration));
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.DelayTime}
     */

    clone() {
        return this.doClone(new DelayTime(this.duration));
    }
}

export default DelayTime;