import ReusableObject from "memory/ReusableObject";
import Math from "util/Math";

class Timer extends ReusableObject {
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
     * @param {string} identifier - Identifier of timer.
     */

    constructor(tickCallback, tickTarget, interval, userData, repeatCount, delay, paused, completeCallback, completeTarget, identifier) {
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

        /**
         * @type {string}
         * @private
         */

        this._identifier = identifier;
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

}

export default Timer;