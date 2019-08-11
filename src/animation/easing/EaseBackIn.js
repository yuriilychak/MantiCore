import EaseBase from "./EaseBase";

/**
 * @class
 * @extends mCore.animation.easing.EaseBase
 * @memberOf mCore.animation.easing
 */

class EaseBackIn extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        const overshoot = 1.70158;
        return (time === 0 || time === 1) ? time : time * time * ((overshoot + 1) * time - overshoot);
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseBackIn}
     */
    clone() {
        return EaseBackIn.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseBackIn}
     */
    reverse() {
        return EaseBackIn.create();
    }
}

export default EaseBackIn;
