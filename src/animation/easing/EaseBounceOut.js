import EaseBounceTime from "./EaseBounceTime";

/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBounceTime
 * @memberOf MANTICORE.animation.easing
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
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseBounceOut}
     */
    reverse() {
        return new EaseBounceOut();
    }
}

export default EaseBounceOut;