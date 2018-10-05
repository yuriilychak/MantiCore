import EaseBase from "./EaseBase";
import Math from "util/Math";

/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
 */

class EaseCubicIn extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        return Math.intPow(time, 3);
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseCubicIn}
     */
    reverse() {
        return new EaseCubicIn();
    }
}

export default EaseCubicIn;