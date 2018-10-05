import EaseBase from "./EaseBase";

/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
 */

class EaseBackInOut extends EaseBase {
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        const overshoot = 1.70158 * 1.525;
        time = time * 2;
        if (time < 1) {
            return (time * time * ((overshoot + 1) * time - overshoot)) / 2;
        } else {
            time = time - 2;
            return (time * time * ((overshoot + 1) * time + overshoot)) / 2 + 1;
        }
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseBackInOut}
     */
    reverse() {
        return new EaseBackInOut();
    }
}

export default EaseBackInOut;