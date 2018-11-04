import EaseBase from "./EaseBase";
import Math from "util/Math";

/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
 */

class EaseSineIn extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        return (time === 0 || time === 1) ? time : -1 * Math.cos(time * Math.PI / 2) + 1;
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseSineIn}
     */
    clone() {
        return EaseSineIn.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseSineIn}
     */
    reverse() {
        return EaseSineIn.create();
    }
}

export default EaseSineIn;