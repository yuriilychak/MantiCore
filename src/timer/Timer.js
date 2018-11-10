import Math from "util/Math";
import Model from "model/Model";
import Constant from "constant";

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
     * @param {Function} completeCallback - Callback that calls when timer complete (Used by timer manager).
     * @param {Object} completeTarget - Target of complete callback.
     */

    constructor(tickCallback, tickTarget, interval, userData, repeatCount, delay, completeCallback, completeTarget) {
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

        this._paused = true;

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
         * @desc Id of delay timer that run.
         * @type {int}
         * @private
         */
        this._delayTimerId = Constant.EMPTY_ID;

        /**
         * @desc Id of tick timer that run.
         * @type {int}
         * @private
         */
        this._tickTimerId = Constant.EMPTY_ID;

        /**
         * @desc Repeat of timer that  tick timer.
         * @type {int}
         * @private
         */

        this._crtRepeatCount = 0;

        /**
         * @desc Pause time of timer in milliseconds.
         * @type {int}
         * @private
         */

        this._pauseTime = 0;

        /**
         * @desc Resume time of timer in milliseconds.
         * @type {int}
         * @private
         */

        this._resumeTime = 0;

        /**
         * @desc Duration of delay and tick that work timer.
         * @type {int}
         * @private
         */

        this._tickDuration = 0;

        /**
         * @desc Flag is need force tick after delay.
         * @type {boolean}
         * @private
         */

        this._isForceTick = false;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Start timer.
     * @method
     * @public
     * @param {int} time - Time in milliseconds when timer start.
     * @returns {boolean}
     */

    start(time) {
        if (!this._paused) {
            return false;
        }
        this._resumeTime = time;
        this._paused = false;

        if (this._delay !== 0) {
            this._initDelayTimer(this._delay);
            return true;
        }
        this._onDelayCompleteHandler();
        return true;
    }

    /**
     * @desc Pause timer.
     * @method
     * @public
     * @param {int} time - Time in milliseconds when timer pause.
     * @returns {boolean}
     */

    pause(time) {
        if (this._paused) {
            return false;
        }

        this._paused = true;
        this._pauseTime = time;
        this._tickDuration += this._pauseTime - this._resumeTime;

        this._clearDelayTimer();
        this._clearTickTimer();

        return true;
    }

    /**
     * @desc Resume timer
     * @method
     * @public
     * @param {int} time - Time in milliseconds when timer resume.
     * @returns {boolean}
     */

    resume(time) {
        if (!this._paused) {
            return false;
        }
        this._paused = false;
        this._resumeTime = time;

        if (this._tickDuration < this._delay) {
            this._isForceTick = false;
            this._initDelayTimer(this._delay - this._tickDuration);
            return true;
        }

        const delayBeforeTick = (this._tickDuration - this._delay) % this._interval;

        if (delayBeforeTick === 0) {
            const count = Math.floor((this._tickDuration - this._delay) / this._interval);
            this._isForceTick = count < this._crtRepeatCount;
            this._initTickTimer();
            return true;
        }

        this._isForceTick = true;
        this._initDelayTimer(delayBeforeTick);
        return true;
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
     * @param {Function} completeCallback - Callback that calls when timer complete (Used by timer manager).
     * @param {Object} completeTarget - Target of complete callback.
     * @param {int} identifier - Identifier of timer.
     */

    reuse(tickCallback, tickTarget, interval, userData, repeatCount, delay, completeCallback, completeTarget, identifier) {
        super.reuse();

        this._tickCallback = tickCallback;
        this._tickTarget = tickTarget;
        this._interval = Math.toMilliseconds(interval);
        this._userData = userData;
        this._repeatCount = repeatCount;
        this._delay = Math.toMilliseconds(delay);
        this._paused = true;
        this._completeCallback = completeCallback;
        this._completeTarget = completeTarget;
        this._crtRepeatCount = 0;
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
        this._clearDelayTimer();
        this._clearTickTimer();

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
        this._crtRepeatCount = 0;
        this._pauseTime = 0;
        this._resumeTime = 0;
        this._tickDuration = 0;
        this._isForceTick = false;

        super.clearData();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @private
     */

    _onDelayCompleteHandler() {
        this._clearDelayTimer();
        this._initTickTimer();
    }

    /**
     * @method
     * @private
     */

    _onTickHandler() {
        this._tickCallback.call(this._tickTarget, this._userData);
        ++this._crtRepeatCount;
        if (this._crtRepeatCount > this._repeatCount) {
            this.kill();
        }
    }

    /**
     * @desc Clear delay timer if it exist
     * @method
     * @private
     */

    _clearDelayTimer() {
        if (this._delayTimerId === Constant.EMPTY_ID) {
            return;
        }
        clearTimeout(this._delayTimerId);
        this._delayTimerId = Constant.EMPTY_ID;
    }

    /**
     * @desc Clear delay timer if it exist
     * @method
     * @private
     */

    _clearTickTimer() {
        if (this._tickTimerId === Constant.EMPTY_ID) {
            return;
        }
        if (this._repeatCount === 0) {
            clearTimeout(this._tickTimerId);
        }
        else {
            clearInterval(this._tickTimerId);
        }
        this._tickTimerId = Constant.EMPTY_ID;
    }

    /**
     * @desc Init timer for delay.
     * @method
     * @private
     */

    _initDelayTimer(delay) {
        this._delayTimerId = setTimeout(this._onDelayCompleteHandler.bind(this), delay);
    }

    /**
     * @desc Init timer for tick.
     * @method
     * @private
     */

    _initTickTimer() {
        if (this._isForceTick) {
            this._onTickHandler();
            this._isForceTick = false;
        }
        if (this._repeatCount === 0) {
            this._tickTimerId = setTimeout(this._onTickHandler.bind(this), this._interval);
            return;
        }

        this._tickTimerId = setInterval(this._onTickHandler.bind(this), this._interval);
    }

}

export default Timer;