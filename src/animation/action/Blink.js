import ActionInterval from "./ActionInterval";

/**
 * @desc Blinks a Node object by modifying it's visible property
 * @class
 * @extends mCore.animation.action.ActionInterval
 * @memberOf mCore.animation.action
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
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.Blink}
     */

    clone() {
        return this.doClone(Blink.create(this.duration, this._times));
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
     * @return {mCore.animation.action.Blink}
     */

    reverse() {
        return this.doReverse(Blink.create(this.duration, this._times));
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} duration - Duration in seconds
     * @param {number} blinks - Blinks in times
     */

    reuse(duration, blinks) {
        super.reuse(duration);
        this._times = blinks;
        this._originalState = false;
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
        this._times = 0;
        this._originalState = false;
        super.clearData();
    }
}

export default Blink;
