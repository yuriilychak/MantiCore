import ActionInterval from "./ActionInterval";

/**
 * @desc Delays the action a certain amount of seconds
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 */

class DelayTime extends ActionInterval{
    update(dt) {},

    reverse() {
        const action = new DelayTime(this.duration);
        this.cloneDecoration(action);
        this.reverseEases(action);
        return action;
    }

    clone() {
        var action = new DelayTime();
        this.cloneDecoration(action);
        action.initWithDuration(this.duration);
        return action;
    }
}

export default DelayTime;