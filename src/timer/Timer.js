import Math from "util/Math";
import Model from "../model/Model";

/**
 * @desc Timer class. Don't us it manually!!! Managed by MANTICORE.timer
 * @class
 * @memberOf MANTICORE.timer
 * @extends MANTICORE.model.Model
 */

class Timer extends Model {
    /**
     * @constructor
     * @param {Function} tickCallback - Callback when timer tick.
     * @param {Object} tickTarget - Target of callback.
     * @param {number} interval - Interval of timer tick.
     * @param {*} userData - Data that pass to callback on tick.
     * @param {int} repeatCount - Count of repeat timer.
     * @param {number} delay - Delay in seconds before timer start.
     * @param {boolean} paused - Is timer paused or start on create.
     * @param {Function} completeCallback - Callback that calls when timer complete (Used by timer manager).
     * @param {Object} completeTarget - Target of complete callback.
     */

    constructor(tickCallback, tickTarget, interval, userData, repeatCount, delay, paused, completeCallback, completeTarget) {
        super();

        /**
         * @type {Function}
         * @private
         */

        this._tickCallback = tickCallback;

        /**
         * @type {Object}
         * @private
         */

        this._tickTarget = tickTarget;

        /**
         * @type {int}
         * @private
         */

        this._interval = Math.toMilliseconds(interval);

        /**
         * @type {*}
         * @private
         */

        this._userData = userData;

        /**
         * @type {int}
         * @private
         */

        this._repeatCount = repeatCount;

        /**
         * @type {number}
         * @private
         */

        this._delay = Math.toMilliseconds(delay);

        /**
         * @type {boolean}
         * @private
         */

        this._paused = paused;

        /**
         * @type {Function}
         * @private
         */

        this._completeCallback = completeCallback;

        /**
         * @type {Object}
         * @private
         */

        this._completeTarget = completeTarget;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Check is this timer parameters equal to parameters.
     * @method
     * @public
     * @param {Function} tickCallback - Callback when timer tick.
     * @param {Object} tickTarget - Target of callback.
     * @param {number} interval - Interval of timer tick.
     * @param {*} userData - Data that pass to callback on tick.
     * @param {int} repeatCount - Count of repeat timer.
     * @param {number} delay - Delay in seconds before timer start.
     * @param {boolean} paused - Is timer paused or start on create.
     * @return {boolean}
     */

    equalTo(tickCallback, tickTarget, interval, userData, repeatCount, delay, paused) {
        return this._tickCallback === tickCallback &&
            this._tickTarget === tickTarget &&
            this._interval === Math.toMilliseconds(interval) &&
            this._userData === userData &&
            this._repeatCount === repeatCount &&
            this._delay === Math.toMilliseconds(delay) &&
            this._paused === paused;
    }

    /**
     * @desc Start timer.
     * @method
     * @public
     */

    start() {

    }

    /**
     * @desc Pause timer.
     * @method
     * @public
     */

    pause() {
        if (this._paused) {
            return;
        }
    }

    /**
     * @desc Resume timer
     * @method
     * @public
     */

    resume() {
        if (!this._paused) {
            return;
        }
    }

    /**
     * @desc Stop timer
     * @method
     * @public
     */

    stop() {
        this.kill();
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {Function} tickCallback - Callback when timer tick.
     * @param {Object} tickTarget - Target of callback.
     * @param {number} interval - Interval of timer tick.
     * @param {*} userData - Data that pass to callback on tick.
     * @param {int} repeatCount - Count of repeat timer.
     * @param {number} delay - Delay in seconds before timer start.
     * @param {boolean} paused - Is timer paused or start on create.
     * @param {Function} completeCallback - Callback that calls when timer complete (Used by timer manager).
     * @param {Object} completeTarget - Target of complete callback.
     * @param {int} identifier - Identifier of timer.
     */

    reuse(tickCallback, tickTarget, interval, userData, repeatCount, delay, paused, completeCallback, completeTarget, identifier) {
        super.reuse();

        this._tickCallback = tickCallback;
        this._tickTarget = tickTarget;
        this._interval = Math.toMilliseconds(interval);
        this._userData = userData;
        this._repeatCount = repeatCount;
        this._delay = Math.toMilliseconds(delay);
        this._paused = paused;
        this._completeCallback = completeCallback;
        this._completeTarget = completeTarget;
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data before disuse and destroy.
     * @method
     * @protected
     */

    clearData() {
        this._completeCallback.call(this._completeTarget, this.id);

        this._completeCallback = null;
        this._completeTarget = null;
        this._tickCallback = null;
        this._tickTarget = null;
        this._userData = null;
        this._interval = 0;
        this._repeatCount = 0;
        this._delay = 0;
        this._paused = false;

        super.clearData();
    }

}

export default Timer;