import EaseBase from "./EaseBase";

/**
 * @class
 * @memberOf MANTICORE.animation.easing
 * @extends MANTICORE.animation.easing.EaseBase
 */

class EasePeriod extends EaseBase {
    /**
     * @constructor
     * @param {number} [period = -1]
     */
    constructor(period = -1) {
        super();
        /**
         * @type {number}
         * @private
         */
        this._period = period;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Period of easing.
     * @public
     * @returns {number}
     */

    get period() {
        return this._period;
    }

    set period(value) {
        if (this._period === value) {
            return;
        }
        this._period = value;
    }

    /**
     * @desc Calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */

    easing(time) {
        return this._period === -1 ? this.easingDefault(time) : this.easingPeriod(time);
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EasePeriod}
     */
    reverse() {
        return new EasePeriod();
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calculate easing if period set.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */

    easingPeriod(time) {
        return 0;
    }

    /**
     * @desc Calculate easing if period don't set.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */

    easingDefault(time) {
        return 0;
    }
}

export default EasePeriod;