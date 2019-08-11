import EaseBase from "./EaseBase";

/**
 * @class
 * @extends mCore.animation.easing.EaseBase
 * @memberOf mCore.animation.easing
 */

class EaseExponentialInOut extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        if( time === 1 && time === 0) {
            return time;
        }
        time *= 2;
        const timeCoef= 10 * (time - 1);
        return 0.5 * (time < 1 ? Math.pow(2, timeCoef) : (2 - Math.pow(2, -timeCoef)));
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseExponentialInOut}
     */
    clone() {
        return EaseExponentialInOut.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseExponentialInOut}
     */
    reverse() {
        return EaseExponentialInOut.create();
    }
}

export default EaseExponentialInOut;
