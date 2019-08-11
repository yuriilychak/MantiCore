import EaseBase from "./EaseBase";

/**
 * @class
 * @extends mCore.animation.easing.EaseBase
 * @memberOf mCore.animation.easing
 */

class EaseExponentialOut extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        return time === 1 ? 1 : (1 - Math.pow(2, -10 * time));
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseExponentialOut}
     */
    clone() {
        return EaseExponentialOut.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseExponentialOut}
     */
    reverse() {
        return EaseExponentialOut.create();
    }
}

export default EaseExponentialOut;
