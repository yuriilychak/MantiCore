import EaseBase from "./EaseBase";
import Math from "util/Math";

/**
 * @class
 * @extends mCore.animation.easing.EaseBase
 * @memberOf mCore.animation.easing
 */

class EaseSineOut extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        return (time === 0 || time === 1) ? time : Math.sin(time * Math.PI / 2);
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseSineOut}
     */
    clone() {
        return EaseSineOut.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseSineOut}
     */
    reverse() {
        return EaseSineOut.create();
    }
}

export default EaseSineOut;
