import EaseBase from "./EaseBase";

/**
 * @class
 * @extends mCore.animation.easing.EaseBase
 * @memberOf mCore.animation.easing
 */

class EaseBackOut extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        const overshoot = 1.70158;
        time = time - 1;
        return time * time * ((overshoot + 1) * time + overshoot) + 1;
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseBackOut}
     */
    clone() {
        return EaseBackOut.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseBackOut}
     */
    reverse() {
        return EaseBackOut.create();
    }
}

export default EaseBackOut;
