import EaseBase from "./EaseBase";

/**
 * @class
 * @extends mCore.animation.easing.EaseBase
 * @memberOf mCore.animation.easing
 */

class EaseCircleIn extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        return 1 - Math.sqrt(1 - time * time);
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseCircleIn}
     */
    clone() {
        return EaseCircleIn.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseCircleIn}
     */
    reverse() {
        return EaseCircleIn.create();
    }
}

export default EaseCircleIn;
