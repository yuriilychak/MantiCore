import EaseBounceTime from "./EaseBounceTime";

/**
 * @class
 * @extends mCore.animation.easing.EaseBounceTime
 * @memberOf mCore.animation.easing
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
     * @returns {mCore.animation.easing.EaseBounceIn}
     */
    clone() {
        return EaseBounceIn.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseBounceIn}
     */
    reverse() {
        return EaseBounceIn.create();
    }
}

export default EaseBounceIn;
