import EaseBase from "./EaseBase";
import Math from "util/Math";


/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
 */

class EaseQuadraticInOut extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        time *= 2;
        if (time < 1){
            return Math.intPow(time, 2) * 0.5;
        }
        else {
            --time;
            return 0.5 * (time * (2 - time) + 1);
        }
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseQuadraticInOut}
     */
    clone() {
        return EaseQuadraticInOut.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseQuadraticInOut}
     */
    reverse() {
        return EaseQuadraticInOut.create();
    }
}

export default EaseQuadraticInOut;