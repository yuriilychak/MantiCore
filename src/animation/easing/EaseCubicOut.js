import EaseBase from "./EaseBase";
import Math from "util/Math";


/**
 * @class
 * @extends mCore.animation.easing.EaseBase
 * @memberOf mCore.animation.easing
 */

class EaseCubicOut extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        time -= 1;
        return (Math.intPow(time, 3) + 1);
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseCubicOut}
     */
    clone() {
        return EaseCubicOut.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseCubicOut}
     */
    reverse() {
        return EaseCubicOut.create();
    }
}

export default EaseCubicOut;
