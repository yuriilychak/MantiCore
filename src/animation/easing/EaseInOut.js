import EaseRate from "./EaseRate";

/**
 * @class
 * @extends MANTICORE.animation.easing.EaseRate
 * @memberOf MANTICORE.animation.easing
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
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseInOut}
     */
    reverse() {
        return new EaseInOut(this.rate);
    }
}

export default EaseInOut;