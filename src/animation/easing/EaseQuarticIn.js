import EaseBase from "./EaseBase";
import Math from "util/Math";


/**
 * @class
 * @extends mCore.animation.easing.EaseBase
 * @memberOf mCore.animation.easing
 */

class EaseQuarticIn extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        return Math.intPow(time, 4);
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseQuarticIn}
     */
    clone() {
        return EaseQuarticIn.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseQuarticIn}
     */
    reverse() {
        return EaseQuarticIn.create();
    }
}

export default EaseQuarticIn;
