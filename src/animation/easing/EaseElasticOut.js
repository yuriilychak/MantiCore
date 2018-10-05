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
        return -Math.pow(2, 10 * time) * Math.sin((time - (this.period / 4)) * Math.PI * 2 / this.period);
    }

    /**
     * @desc Calculate easing if period don't set.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */

    easingDefault(time) {
        const period = 0.3;
        return (time === 0 || time === 1) ? time : Math.pow(2, -10 * time) * Math.sin((time - (period / 4)) * Math.PI * 2 / period) + 1;
    }
}

export default EaseElasticOut;