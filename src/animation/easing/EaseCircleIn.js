import EaseBase from "./EaseBase";

/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
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
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseCircleIn}
     */
    reverse() {
        return new EaseCircleIn();
    }
}

export default EaseCircleIn;