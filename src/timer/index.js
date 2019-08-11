import Repository from "repository/Repository";
import Timer from "./Timer";
import EventDispatcher from "eventDispatcher";
import SYSTEM_EVENT from "enumerator/event/SystemEvent";
import Type from "util/Type";

/**
 * @desc Namespace that manipulate with timers.
 * @namespace timer
 * @memberOf mCore
 */

export default {

    /**
     * @desc Number for define loop timer
     * @type {number}
     * @const
     * @readonly
     */

    REPEAT_FOREVER: Number.MAX_SAFE_INTEGER,

    /**
     * @desc Timer for enter frame actions.
     * @type {PIXI.ticker.Ticker}
     * @readonly
     * @public
     */
    enterFrameTimer: null,

    /**
     * @type {mCore.repository.Repository}
     * @private
     */

    _timers: new Repository(),

    /**
     * @desc Date for update timers.
     * @type {Date}
     * @private
     */

    _date: new Date(),

    /**
     * PUBLIC FUNCTIONS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Init timer events. Don't use it manually!!!
     * @function
     * @public
     */

    init() {
        EventDispatcher.addListener(SYSTEM_EVENT.VISIBLE, this._onAppVisibleHandler, this);
        EventDispatcher.addListener(SYSTEM_EVENT.HIDDEN, this._onAppHiddenHandler, this);
    },

    /**
     * @function
     * @public
     * @param {Function} tickCallback - Callback when timer tick.
     * @param {Object} tickTarget - Target of callback.
     * @param {number} interval - Interval of timer tick.
     * @param {*} [userData = null] - Data that pass to callback on tick.
     * @param {int} [repeatCount = 0] - Count of repeat timer.
     * @param {number} [delay = 0] - Delay in seconds before timer start.
     * @param {boolean} [paused = 0] - is timer start after create or need to start manually.
     * @returns {int}
     */

    add(tickCallback, tickTarget, interval, userData = null, repeatCount = 0, delay = 0, paused = false) {
        /**
         * @type {mCore.timer.Timer}
         */
        const timer = Timer.create(
            tickCallback,
            tickTarget,
            interval,
            userData,
            repeatCount,
            delay,
            this._onTimerComplete,
            this
        );

        this._timers.addElement(timer);

        if (paused) {
            return timer.id;
        }

        timer.start(this.getTime());

        return timer.id;
    },

    /**
     * @desc Pause timer.
     * @function
     * @public
     * @param {int} id
     * @return {boolean}
     */

    pause(id) {
        if (!this._timers.hasElement(id)) {
            return false;
        }
        /**
         * @type {mCore.timer.Timer}
         */
        const timer = this._timers.getElement(id);
        return timer.pause(this.getTime());
    },

    /**
     * @desc Start timer.
     * @function
     * @public
     * @param {int} id
     * @return {boolean}
     */

    start(id) {
        if (!this._timers.hasElement(id)) {
            return false;
        }
        /**
         * @type {mCore.timer.Timer}
         */
        const timer = this._timers.getElement(id);
        return timer.start(this.getTime());
    },

    /**
     * @desc Resume timer.
     * @function
     * @public
     * @param {int} id
     * @return {boolean}
     */

    resume(id) {
        if (!this._timers.hasElement(id)) {
            return false;
        }
        /**
         * @type {mCore.timer.Timer}
         */
        const timer = this._timers.getElement(id);
        return timer.resume(this.getTime());
    },

    /**
     * @desc stop timer.
     * @function
     * @public
     * @param {int} id
     * @return {boolean}
     */

    stop(id) {
        if (!this._timers.hasElement(id)) {
            return false;
        }
        /**
         * @type {mCore.timer.Timer}
         */
        const timer = this._timers.getElement(id);
        timer.stop();
        return true;
    },

    /**
     * @desc Returns current time
     * @function
     * @public
     * @return {int}
     */

    getTime() {
        return this._date.getTime();
    },

    /**
     * PRIVATE FUNCTIONS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls when timer destroy or put in pool.
     * @function
     * @private
     * @param {int} id
     */

    _onTimerComplete(id) {
        this._timers.removeElement(id);
    },

    /**
     * @desc Calls when user change tab to current
     * @function
     * @private
     */

    _onAppVisibleHandler() {
        if (!Type.isNull(this.enterFrameTimer)) {
            this.enterFrameTimer.start();
        }
        /**
         * @type {mCore.timer.Timer[]}
         */
        const timers = this._timers.values;
        const timerCount = timers.length;
        const crtTime = this.getTime();
        for (let i = 0; i < timerCount; ++i) {
            timers[i].resume(crtTime);
        }
    },

    /**
     * @desc Calls when user change tab to another
     * @function
     * @private
     */

    _onAppHiddenHandler() {
        if (!Type.isNull(this.enterFrameTimer)) {
            this.enterFrameTimer.stop();
        }

        /**
         * @type {mCore.timer.Timer[]}
         */
        const timers = this._timers.values;
        const timerCount = timers.length;
        const crtTime = this._date.getTime();
        for (let i = 0; i < timerCount; ++i) {
            timers[i].pause(crtTime);
        }
    }
};
