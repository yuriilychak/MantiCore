import EaseBase from "./EaseBase";
import Math from "util/Math";

/**
 * @class
 * @extends mCore.animation.easing.EaseBase
 * @memberOf mCore.animation.easing
 */

class EaseBezier extends EaseBase {
    /**
     * @constructor
     * @param {number} first
     * @param {number} second
     * @param {number} third
     * @param {number} fourth
     */
    constructor(first, second, third, fourth) {
        super();
        /**
         * @type {number[]}
         * @private
         */
        this._coefs = [first, second, third, fourth];
        this._elementCount = this._coefs.length;
        this._rank = this._elementCount - 1;
        this._multCoefs = [1, 3, 3, 1];
    }
    /**
     * @desc calculate easing.
     * @method
     * @public
     * @param {number} time
     * @returns {number}
     */
    easing(time) {
        const revTime = 1 - time;
        let result = 0;

        for (let i = 0; i < this._elementCount; ++i) {
            result += Math.intPow(revTime, this._rank - i) * Math.intPow(time, i) * this._coefs[i] * this._multCoefs[i];
        }
        return result;
    }

    /**
     * @desc Returns clone of easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseBezier}
     */

    clone() {
        return EaseBezier.create(this._coefs[0], this._coefs[1], this._coefs[2], this._coefs[3]);
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {mCore.animation.easing.EaseBezier}
     */
    reverse() {
        return EaseBezier.create(this._coefs[3], this._coefs[2], this._coefs[1], this._coefs[0]);
    }

    /**
     * @desc Calls by pool when model get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} first
     * @param {number} second
     * @param {number} third
     * @param {number} fourth
     */
    reuse(first, second, third, fourth) {
        super.reuse();
        this._coefs = [first, second, third, fourth];
        this._elementCount = this._coefs.length;
        this._rank = this._elementCount - 1;
        this._multCoefs = [1, 3, 3, 1];
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data for move object to pool or destroy.
     * @method
     * @private
     */

    clearData() {
        this._coefs.length = 0;
        this._elementCount = 0;
        this._rank = -1;
        this._multCoefs.length = 0;
        super.clearData();
    }
}

export default EaseBezier;
