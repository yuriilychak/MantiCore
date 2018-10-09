import ActionInterval from "./ActionInterval";

/**
 * @desc Tween some display object property.
 * @class
 * @extends MANTICORE.animation.action.ActionInstant
 * @memberOf MANTICORE.animation.action
 */

class Tween extends ActionInterval{

    /**
     * @constructor
     * @param {number} duration
     * @param {string} key
     * @param {number} from
     * @param {number} to
     */
    constructor(duration, key, from, to) {
        super(duration);
        /**
         * @type {string}
         * @private
         */
        this._key = key;
        /**
         * @type {number}
         * @private
         */
        this._to = to;
        /**
         * @type {number}
         * @private
         */
        this._from = from;
        /**
         * @type {number}
         * @private
         */
        this._delta = this._to - this._from;
    }

    /**
     * Start this tween with target.
     * @param {PIXI.DisplayObject} target
     */
    startWithTarget(target) {
        super.startWithTarget(target);

    }

    /**
     * Called once per frame. Time is the number of seconds of a frame interval.
     *
     * @param {Number}  dt
     */
    update(dt) {
        this.target[this._key] = this._to - this._delta * (1 - dt);
    }

    /**
     * returns a reversed action.
     * @return {MANTICORE.animation.action.Tween}
     */
    reverse() {
        return new Tween(this.duration, this._key, this._to, this._from);
    }

    /**
     * to copy object with deep copy.
     * returns a clone of action.
     *
     * @return {MANTICORE.animation.action.Tween}
     */
    clone() {
        return new Tween(this.duration, this._key, this._from, this._to);
    }
}

export default Tween;