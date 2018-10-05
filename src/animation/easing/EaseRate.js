import EaseBase from "./EaseBase";

/**
 * @class
 * @memberOf MANTICORE.animation.easing
 * @extends MANTICORE.animation.easing.EaseBase
 */

class EaseRate extends EaseBase {
    /**
     * @constructor
     * @param {number} [rate = 1]
     */
    constructor(rate = 1) {
        super();
        /**
         * @type {number}
         * @private
         */
        this._rate = rate;
    }


    /**
     * @desc Rate of easing. Need to manipulate with curves.
     * @public
     * @returns {number}
     */

    get rate() {
        return this._rate;
    }

    set rate(value) {
        if (this._rate === value) {
            return;
        }
        this._rate = value;
    }
}

export default EaseRate;