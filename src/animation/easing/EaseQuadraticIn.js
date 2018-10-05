import EaseBase from "./EaseBase";
import Math from "util/Math";


/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
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
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseQuadraticIn}
     */
    reverse() {
        return new EaseQuadraticIn();
    }
}

export default EaseQuadraticIn;