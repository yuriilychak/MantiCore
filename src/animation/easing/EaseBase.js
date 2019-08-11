import ReusableObject from "memory/ReusableObject";

/**
 * @desc Base class for easing.
 * @class
 * @memberOf mCore.animation.easing
 * @extends mCore.memory.ReusableObject
 */

class EaseBase extends ReusableObject{
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        return 0;
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseBase}
     */
    clone() {
        return EaseBase.create();
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseBase}
     */
    reverse() {
        return EaseBase.create();
    }
}

export default EaseBase;
