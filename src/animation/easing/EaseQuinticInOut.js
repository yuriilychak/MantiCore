import EaseBase from "./EaseBase"
import Math from "util/Math";


/**
 * @class
 * @extends mCore.animation.easing.EaseBase
 * @memberOf mCore.animation.easing
 */

class EaseQuinticInOut extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        time *= 2;
        if (time < 1) {
            return 0.5 * Math.intPow(time, 5);
        }

        time -= 2;
        return 0.5 * (Math.intPow(time, 5) + 2);
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseQuinticInOut}
     */
    clone() {
        return EaseQuinticInOut.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseQuinticInOut}
     */
    reverse() {
        return EaseQuinticInOut.create();
    }
}

export default EaseQuinticInOut;
