import EaseBase from "./EaseBase";

/**
 * @class
 * @extends MANTICORE.animation.easing.EaseBase
 * @memberOf MANTICORE.animation.easing
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
            result += Math.pow(revTime, this._rank - i) * Math.pow(time, i) * this._coefs[i] * this._multCoefs[i];
        }
        return result;
    }

    /**
     * @desc Returns reversed easing.
     * @method
     * @public
     * @returns {MANTICORE.animation.easing.EaseBezier}
     */
    reverse() {
        return new EaseBezier(this._coefs[3], this._coefs[2], this._coefs[1], this._coefs[0]);
    }
}

export default EaseBezier;