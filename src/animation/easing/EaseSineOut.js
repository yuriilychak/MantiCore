import EaseBase from "./EaseBase";
import Math from "util/Math";

/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
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
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseSineOut}
     */
    reverse() {
        return new EaseSineOut();
    }
}

export default EaseSineOut;