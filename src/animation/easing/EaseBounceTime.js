import EaseBase from "./EaseBase";

/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
 */

class EaseBounceTime extends EaseBase {
    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseBounceTime}
     */
    reverse() {
        return new EaseBounceTime();
    }

    /**
     * @method
     * @protected
     * @param {number} time
     * @returns {number}
     */

    bounceTime (time) {
        const coef1 = 1/11;
        switch(true) {
            case time < 4 * coef1: return this._resultTime(time, 0);
            case time < 8 * coef1: {
                time -= 6 * coef1;
                return this._resultTime(time, 0.75);
            }
            case time < 10 * coef1: {
                time -= 9 * coef1;
                return this._resultTime(time, 0.9375);
            }
            default: {
                time -= 10.5 * coef1;
                return this._resultTime(time, 0.984375);
            }
        }
    }

    /**
     * @method
     * @param {number} time
     * @param {number} offset
     * @returns {number}
     * @private
     */

    _resultTime(time, offset) {
        return 7.5625 * time * time + offset;
    }
}

export default EaseBounceTime;