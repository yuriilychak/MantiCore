import EaseRate from "./EaseRate";

/**
 * @class
 * @extends MANTICORE.animation.easing.EaseRate
 * @memberOf MANTICORE.animation.easing
 */

class EaseIn extends EaseRate {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        return Math.pow(time, this.rate);
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseIn}
     */
    clone() {
        return EaseIn.create(this.rate);
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseIn}
     */
    reverse() {
        return EaseIn.create(1 / this.rate);
    }
}

export default EaseIn;