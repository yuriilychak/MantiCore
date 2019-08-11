import EaseBase from "./EaseBase";

/**
 * @class
 * @memberOf mCore.animation.easing
 * @extends mCore.animation.easing.EaseBase
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
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EasePeriod}
     */
    clone() {
        return EasePeriod.create(this.period);
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EasePeriod}
     */
    reverse() {
        return EasePeriod.create(this.period);
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} [period = -1]
     */

    reuse(period = -1) {
        super.reuse();
        this._period = period;
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
        this._period = -1;
        super.clearData();
    }

    /**
     * @method
     * @param {number} time
     * @param {number} period
     * @return {number}
     * @protected
     */

    calculateTime(time, period) {
        return time;
    }

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
