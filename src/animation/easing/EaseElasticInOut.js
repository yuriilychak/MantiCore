import EasePeriod from "./EasePeriod";

/**
 * @class
 * @memberOf mCore.animation.easing
 * @extends mCore.animation.easing.EasePeriod
 */

class EaseElasticInOut extends EasePeriod {

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseElasticInOut}
     */
    clone() {
        return EaseElasticInOut.create(this.period);
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseElasticInOut}
     */
    reverse() {
        return EaseElasticInOut.create(this.period);
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
        return this.calculateTime(time, this.period);
    }

    /**
     * @desc Calculate easing if period don't set.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */

    easingDefault(time) {
        return this.calculateTime(time, 0.3 * 1.5);
    }

    /**
     * @method
     * @param {number} time
     * @param {number} period
     * @return {number}
     * @protected
     */

    calculateTime(time, period) {
        if (time === 0 || time === 1) {
            return time;
        }
        time = time * 2;
        const s = period / 4;
        time = time - 1;
        if (time < 0)
            return -0.5 * Math.pow(2, 10 * time) * Math.sin((time - s) * Math.PI * 2 / period);
        else
            return Math.pow(2, -10 * time) * Math.sin((time - s) * Math.PI * 2 / period) * 0.5 + 1;
    }
}

export default EaseElasticInOut;
