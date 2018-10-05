import EaseRate from "./EaseRate";

/**
 * @class
 * @extends MANTICORE.animation.easing.EaseRate
 * @memberOf MANTICORE.animation.easing
 */

class EaseOut extends EaseRate {

    /**
     * @constructor
     * @param {number} rate
     */
    constructor(rate) {
        super(1 / rate);
    }

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
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseOut}
     */
    reverse() {
        return new EaseOut(1 / this.rate);
    }
}

export default EaseOut;