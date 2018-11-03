import ActionInterval from "./ActionInterval";

/**
 * @desc Tween some display object property.
 * @class
 * @extends MANTICORE.animation.action.ActionInstant
 * @memberOf MANTICORE.animation.action
 */

class Tween extends ActionInterval {

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
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * Start this tween with target.
     * @param {PIXI.DisplayObject} target
     */
    startWithTarget(target) {
        super.startWithTarget(target);

    }

    /**
     * @desc Called once per frame. Time is the number of seconds of a frame interval.
     * @method
     * @public
     * @param {Number}  dt
     */
    update(dt) {
        this.target[this._key] = this._to - this._delta * (1 - dt);
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.Tween}
     */
    reverse() {
        return Tween.create(this.duration, this._key, this._to, this._from);
    }

    /**
     * @desc To copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.Tween}
     */
    clone() {
        return Tween.create(this.duration, this._key, this._from, this._to);
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} duration
     * @param {string} key
     * @param {number} from
     * @param {number} to
     */

    reuse(duration, key, from, to) {
        super.reuse(duration);
        this._key = key;
        this._to = to;
        this._from = from;
        this._delta = this._to - this._from;
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
        this._key = null;
        this._from = -1;
        this._to = -1;
        this._delta = 0;
        super.clearData();
    }
}

export default Tween;