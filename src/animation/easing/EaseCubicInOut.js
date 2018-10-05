import EaseBase from "./EaseBase";
import Math from "util/Math";


/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
 */

class EaseCubicInOut extends EaseBase {
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
            return 0.5 * Math.intPow(time, 3);
        }

        time -= 2;
        return 0.5 * (Math.intPow(time, 3) + 2);
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseCubicInOut}
     */
    reverse() {
        return new EaseCubicInOut();
    }
}

export default EaseCubicInOut;