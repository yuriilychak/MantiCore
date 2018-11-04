import EaseBounceTime from "./EaseBounceTime";

/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBounceTime
 * @memberOf MANTICORE.animation.easing
 */

class EaseBounceIn extends EaseBounceTime {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        return 1 - this.bounceTime(1 - time);
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseBounceIn}
     */
    clone() {
        return EaseBounceIn.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseBounceIn}
     */
    reverse() {
        return EaseBounceIn.create();
    }
}

export default EaseBounceIn;