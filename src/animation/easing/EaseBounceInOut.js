import EaseBounceTime from "./EaseBounceTime";

/**
 * @class
 * @extends mCore.animation.easing.EaseBounceTime
 * @memberOf mCore.animation.easing
 */

class EaseBounceInOut extends EaseBounceTime {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        time = time * 2;
        const coef01 = time < 1 ? -1 : 1;
        return 0.5 * (1 + coef01 * this.bounceTime(coef01 * (time - 1)));
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseBounceInOut}
     */
    clone() {
        return EaseBounceInOut.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseBounceInOut}
     */
    reverse() {
        return EaseBounceInOut.create();
    }
}

export default EaseBounceInOut;
