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
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} [rate = 1]
     */

    reuse(rate = 1) {
        super.reuse();
        this._rate = rate;
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data befor disuse and destroy.
     * @method
     * @protected
     */

    clearData() {
        this._rate = 0;
        super.clearData();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

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