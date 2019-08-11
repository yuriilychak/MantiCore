import EaseRate from "./EaseRate";

/**
 * @class
 * @extends mCore.animation.easing.EaseRate
 * @memberOf mCore.animation.easing
 */

class EaseInOut extends EaseRate {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        time *= 2;
        return 0.5 * (time < 1 ? Math.pow(time, this.rate) : 2 - Math.pow(2 - time, this.rate));
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseInOut}
     */
    clone() {
        return EaseInOut.create(this.rate);
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseInOut}
     */
    reverse() {
        return EaseInOut.create(this.rate);
    }
}

export default EaseInOut;
