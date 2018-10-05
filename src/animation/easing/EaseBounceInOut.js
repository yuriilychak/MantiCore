import EaseBounceTime from "./EaseBounceTime";

/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBounceTime
 * @memberOf MANTICORE.animation.easing
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
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseBounceInOut}
     */
    reverse() {
        return new EaseBounceInOut();
    }
}

export default EaseBounceInOut;