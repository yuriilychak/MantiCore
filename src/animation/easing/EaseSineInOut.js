import EaseBase from "./EaseBase";
import Math from "util/Math";

/**
 * @class
 * @extends mCore.animation.easing.EaseBase
 * @memberOf mCore.animation.easing
 */

class EaseSineInOut extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        return (time === 0 || time === 1) ? time : -0.5 * (Math.cos(Math.PI * time) - 1);
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseSineInOut}
     */
    clone() {
        return EaseSineInOut.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseSineInOut}
     */
    reverse() {
        return EaseSineInOut.create();
    }
}

export default EaseSineInOut;
