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
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseOut}
     */
    clone() {
        return EaseOut.create(this.rate);
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseOut}
     */
    reverse() {
        return EaseOut.create(1 / this.rate);
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} rate
     */

    reuse(rate) {
        super.reuse(1 / rate);
    }
}

export default EaseOut;