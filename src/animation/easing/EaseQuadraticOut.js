import EaseBase from "./EaseBase";
import Math from "util/Math";


/**
 * @class
 * @extends mCore.animation.easing.EaseBase
 * @memberOf mCore.animation.easing
 */

class EaseQuadraticOut extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        return time * (2 - time);
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseQuadraticOut}
     */
    clone() {
        return EaseQuadraticOut.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseQuadraticOut}
     */
    reverse() {
        return EaseQuadraticOut.create();
    }
}

export default EaseQuadraticOut;
