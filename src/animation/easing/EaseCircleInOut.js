import EaseBase from "./EaseBase";

/**
 * @class
 * @extends mCore.animation.easing.EaseBase
 * @memberOf mCore.animation.easing
 */

class EaseCircleInOut extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        time *= 2;

        if (time < 1) {
            return 0.5 * (1 - Math.sqrt(1 - time * time));
        }
        time -= 2;
        return 0.5 * (Math.sqrt(1 - time * time) + 1);
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseCircleInOut}
     */
    clone() {
        return EaseCircleInOut.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseCircleInOut}
     */
    reverse() {
        return EaseCircleInOut.create();
    }
}

export default EaseCircleInOut;
