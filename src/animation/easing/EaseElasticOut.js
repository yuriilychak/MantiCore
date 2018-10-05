import EasePeriod from "./EasePeriod";

/**
 * @class
 * @memberOf MANTICORE.animation.easing
 * @extends MANTICORE.animation.easing.EasePeriod
 */

class EaseElasticOut extends EasePeriod {

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseElasticOut}
     */
    reverse() {
        return new EaseElasticOut(this.period);
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
        if (time === 0 || time === 1) {
            return time;
        }
        time = time - 1;
        return -this.calculateTime(time, this.period);
    }

    /**
     * @desc Calculate easing if period don't set.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */

    easingDefault(time) {
        return (time === 0 || time === 1) ? time : this.calculateTime(time, 0.3) + 1;
    }

    /**
     * @method
     * @param {number} time
     * @param {number} period
     * @return {number}
     * @protected
     */

    calculateTime(time, period) {
        return Math.pow(2, -10 * time) * Math.sin((time - (period / 4)) * Math.PI * 2 / period);
    }
}

export default EaseElasticOut;