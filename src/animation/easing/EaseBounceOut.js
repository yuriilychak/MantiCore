import EaseBounceTime from "./EaseBounceTime";

/**
 * @class
 * @extends mCore.animation.easing.EaseBounceTime
 * @memberOf mCore.animation.easing
 */

class EaseBounceOut extends EaseBounceTime {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        return this.bounceTime(time);
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseBounceOut}
     */
    clone() {
        return EaseBounceOut.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseBounceOut}
     */
    reverse() {
        return EaseBounceOut.create();
    }
}

export default EaseBounceOut;
