import EasePeriod from "./EasePeriod";

/**
 * @class
 * @memberOf MANTICORE.animation.easing
 * @extends MANTICORE.animation.easing.EasePeriod
 */

class EaseElasticInOut extends EasePeriod {

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseElasticInOut}
     */
    reverse() {
        return new EaseElasticInOut(this.period);
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
        time = time * 2;
        const s = this.period / 4;
        time = time - 1;
        if (time < 0)
            return -0.5 * Math.pow(2, 10 * time) * Math.sin((time - s) * Math.PI * 2 / this.period);
        else
            return Math.pow(2, -10 * time) * Math.sin((time - s) * Math.PI * 2 / this.period) * 0.5 + 1;
    }

    /**
     * @desc Calculate easing if period don't set.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */

    easingDefault(time) {
        if (time === 0 || time === 1) {
            return time;
        }
        time = time * 2;
        const period = 0.3 * 1.5;
        const s = period / 4;
        time = time - 1;
        if (time < 0)
            return -0.5 * Math.pow(2, 10 * time) * Math.sin((time - s) * Math.PI * 2 / period);
        else
            return Math.pow(2, -10 * time) * Math.sin((time - s) * Math.PI * 2 / period) * 0.5 + 1;
    }
}

export default EaseElasticInOut;