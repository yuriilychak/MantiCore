import EaseBase from "./EaseBase";
import Math from "util/Math";


/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
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
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseQuadraticOut}
     */
    reverse() {
        return new EaseQuadraticOut();
    }
}

export default EaseQuadraticOut;