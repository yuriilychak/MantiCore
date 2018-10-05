import EaseBase from "./EaseBase";
import Math from "util/Math";


/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
 */

class EaseQuarticInOut extends EaseBase {
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
            return 0.5 * Math.intPow(time, 4);
        }

        time -= 2;
        return 1 - 0.5 * Math.intPow(time, 4);
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseQuarticInOut}
     */
    reverse() {
        return new EaseQuarticInOut();
    }
}

export default EaseQuarticInOut;