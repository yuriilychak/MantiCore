import EaseBase from "./EaseBase";

/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
 */

class EaseCircleOut extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        time = time - 1;
        return Math.sqrt(1 - time * time);
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseCircleOut}
     */
    reverse() {
        return EaseCircleOut.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseCircleOut}
     */
    reverse() {
        return EaseCircleOut.create();
    }
}

export default EaseCircleOut;