import EaseBase from "./EaseBase";
import Math from "util/Math";


/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
 */

class EaseQuinticOut extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        time -= 1;
        return Math.intPow(time, 5) + 1;
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseQuinticOut}
     */
    reverse() {
        return new EaseQuinticOut();
    }
}

export default EaseQuinticOut;