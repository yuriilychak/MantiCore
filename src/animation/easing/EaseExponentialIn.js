import EaseBase from "./EaseBase";

/**
 * @class
 * @extends mCore.animation.easing.EaseBase
 * @memberOf mCore.animation.easing
 */

class EaseExponentialIn extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        return time === 0 ? 0 : Math.pow(2, 10 * (time - 1));
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseExponentialIn}
     */
    clone() {
        return EaseExponentialIn.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseExponentialIn}
     */
    reverse() {
        return EaseExponentialIn.create();
    }
}

export default EaseExponentialIn;
