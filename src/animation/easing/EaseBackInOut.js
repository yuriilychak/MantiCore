import EaseBase from "./EaseBase";

/**
 * @class
 * @extends mCore.animation.easing.EaseBase
 * @memberOf mCore.animation.easing
 */

class EaseBackInOut extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        const overshoot = 1.70158 * 1.525;
        time = time * 2;
        if (time < 1) {
            return (time * time * ((overshoot + 1) * time - overshoot)) / 2;
        } else {
            time = time - 2;
            return (time * time * ((overshoot + 1) * time + overshoot)) / 2 + 1;
        }
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseBackInOut}
     */

    clone() {
        return EaseBackInOut.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseBackInOut}
     */
    reverse() {
        return EaseBackInOut.create();
    }
}

export default EaseBackInOut;
