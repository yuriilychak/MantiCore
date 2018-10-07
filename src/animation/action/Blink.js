import ActionInterval from "./ActionInterval";

/**
 * @desc Blinks a Node object by modifying it's visible property
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 * @example
 * const action = new Blink(2, 10);
 */

class Blink extends ActionInterval {

    /**
     * @constructor
     * @param {number} duration - Duration in seconds
     * @param {number} blinks - Blinks in times
     */

    constructor(duration, blinks) {
        super(duration);
        this._times = blinks;
        this._originalState = false;
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.Blink}
     */

    clone() {
        return this.doClone(new Blink(this.duration, this._times));
    }

    update(dt) {
        dt = this.computeEaseTime(dt);
        if (this.target && !this.isDone) {
            const slice = 1.0 / this._times;
            const m = dt % slice;
            this.target.alpha = (m > (slice / 2)) ? 1 : 0;
        }
    }

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        this._originalState = target.alpha;
    }

    stop() {
        this.target.opacity = this._originalState;
        super.stop();
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.Blink}
     */

    reverse() {
        return this.doReverse(new Blink(this.duration, this._times));
    }
}

export default Blink;