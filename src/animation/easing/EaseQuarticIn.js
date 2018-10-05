import EaseBase from "./EaseBase";
import Math from "util/Math";


/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
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
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseQuarticIn}
     */
    reverse() {
        return new EaseQuarticIn();
    }
}

export default EaseQuarticIn;