/**
 * @desc Base class for easing.
 * @class
 * @memberOf MANTICORE.animation.easing
 */

class EaseBase {
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
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseBase}
     */
    reverse() {
        return new EaseBase();
    }
}

export default EaseBase;