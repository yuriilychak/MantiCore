import EaseBase from "./EaseBase";
import Math from "util/Math";


/**
 * @class
 * @extends mCore.animation.easing.EaseBase
 * @memberOf mCore.animation.easing
 */

class EaseQuadraticIn extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        return Math.intPow(time, 2);
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseQuadraticIn}
     */
    clone() {
        return EaseQuadraticIn.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseQuadraticIn}
     */
    reverse() {
        return EaseQuadraticIn.create();
    }
}

export default EaseQuadraticIn;
