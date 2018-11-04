import EaseBase from "./EaseBase";

/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
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
     * @returns {MANTICORE.animation.easing.EaseBackOut}
     */
    clone() {
        return EaseBackOut.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseBackOut}
     */
    reverse() {
        return EaseBackOut.create();
    }
}

export default EaseBackOut;