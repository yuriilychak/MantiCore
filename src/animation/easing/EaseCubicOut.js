import EaseBase from "./EaseBase";
import Math from "util/Math";


/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
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
     * @returns {MANTICORE.animation.easing.EaseCubicOut}
     */
    clone() {
        return EaseCubicOut.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseCubicOut}
     */
    reverse() {
        return EaseCubicOut.create();
    }
}

export default EaseCubicOut;