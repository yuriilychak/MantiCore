import BaseManager from "./BaseManager";
import Repository from "repository/Repository";
import ActionTimeLine from "animation/timeLine/ActionTimeLine";
import ActionAnimation from "animation/ActionAnimation";
import TIME_LINE from "enumerator/animation/TimeLine";
import Type from "util/Type";
import Pool from "pool";
import TIME_LINE_EVENT from "enumerator/animation/TimeLineEvent";
import TIME_LINE_TYPE from "enumerator/animation/TimeLineType";

/**
 * @desc Class for manipulate with animations
 * @class
 * @extends MANTICORE.manager.BaseManager
 * @memberOf MANTICORE.manager
 */

class AnimationManager extends BaseManager {
    /**
     * @constructor
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite | MANTICORE.component.Component} owner
     */
    constructor(owner) {
        super(owner);

        /**
         * @desc Repository with time-lines
         * @type {MANTICORE.repository.Repository}
         * @private
         */
        this._timeLines = new Repository();

        /**
         * @desc Array with active time-lines to update.
         * @type {MANTICORE.animation.timeLine.BaseTimeLine[]}
         * @private
         */

        this._activeTimeLines = [];

        /**
         * @desc Count of active time-lines. Need to don't calculate every frame.
         * @type {number}
         * @private
         */

        this._activeTimeLineCount = 0;

        /**
         * @desc Events that dispatch time line.
         * @type {MANTICORE.repository.Repository}
         * @private
         */

        this._events = new Repository();

        /**
         * @type {MANTICORE.animation.timeLine.BaseTimeLine[]}
         * @private
         */

        this._timeLinesForStop = [];

        this._timeLines.addElement(Pool.getObject(ActionTimeLine, owner, TIME_LINE.MAIN), TIME_LINE.MAIN);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Add time line to manager.
     * @method
     * @public
     * @param {string} name
     * @param {MANTICORE.animation.ActionAnimation | MANTICORE.animation.action.ActionInterval} animation
     * @param {string | MANTICORE.enumerator.animation.TIME_LINE} [timeLine]
     * @returns {boolean}
     */

    addAnimation(name, animation, timeLine = TIME_LINE.MAIN) {
        /**
         * @type {MANTICORE.animation.ActionTimeLine}
         */
        const actionTimeLine = this._timeLines.getElement(timeLine);
        if (actionTimeLine.hasAnimation(name)) {
            return false;
        }

        animation = animation instanceof ActionAnimation ? animation : Pool.getObject(ActionAnimation, animation);

        actionTimeLine.addAnimation(name, animation);

        return true;
    }

    /**
     * @desc Remove animation if it exist.
     * @method
     * @public
     * @param {string} name
     * @param {string | MANTICORE.enumerator.animation.TIME_LINE} [timeLine = null]
     * @returns {boolean}
     */

    removeAnimation(name, timeLine = null) {
        /**
         * @type {MANTICORE.animation.ActionTimeLine}
         */
        const actionTimeLine = this._findTimeLine(name, timeLine);
        if (Type.isNull(actionTimeLine) || !actionTimeLine.hasAnimation(name)) {
            return false;
        }

        this._removeActiveTimeLine(actionTimeLine);

        actionTimeLine.removeAnimation(name);
        return true;
    }

    /**
     * @desc Remove all animations from time line.
     * @method
     * @public
     * @param {string | MANTICORE.enumerator.animation.TIME_LINE} [timeLine]
     */

    removeAllAnimations(timeLine = TIME_LINE.MAIN) {
        /**
         * @type {MANTICORE.animation.ActionTimeLine}
         */
        const actionTimeLine = this._timeLines.getElement(timeLine);

        this._removeActiveTimeLine(actionTimeLine);

        actionTimeLine.removeAllAnimations();
    }

    /**
     * @desc Add time line to manager.
     * @method
     * @public
     * @param {string} name
     * @param {MANTICORE.animation.timeLine.BaseTimeLine} [timeLine = null]
     * @return {boolean}
     */

    addTimeLine(name, timeLine = null) {
        if (this._timeLines.hasElement(name)) {
            return false;
        }
        /**
         * @type {MANTICORE.animation.timeLine.BaseTimeLine}
         */
        const actionTimeLine = !Type.isNull(timeLine) ? timeLine : ActionTimeLine.create(this.owner, name);
        const eventIds = this._events.keys;
        const eventCount = eventIds.length;
        let eventId, i;

        for (i = 0; i < eventCount; ++i) {
            eventId = eventIds[i];
            actionTimeLine.setEvent(eventId, this._events.getElement(eventId));
        }

        this._timeLines.addElement(actionTimeLine, name);
        return true;
    }

    /**
     * @method
     * @public
     * @param {string | MANTICORE.enumerator.animation.TIME_LINE} name
     * @return {boolean}
     */

    removeTimeLine(name) {
        if (!this._timeLines.hasElement(name)) {
            return false;
        }
        const element = this._timeLines.getElement(name);

        this._removeActiveTimeLine(element);

        return this._timeLines.removeElement(name, true);
    }

    /**
     * @method
     * @public
     * @param {string | MANTICORE.enumerator.animation.TIME_LINE} name
     * @return {MANTICORE.animation.timeLine.BaseTimeLine | null}
     */

    getTimeLine(name) {
        return this._timeLines.getElement(name);
    }

    /**
     * @desc Remove all time lines.
     * @method
     * @public
     */

    removeAllTimeLines() {
        this.active = false;
        this._activeTimeLineCount = 0;
        this._activeTimeLines.length = 0;

        this._timeLines.clear(true);
    }

    /**
     * @desc Refresh time line target parameters
     * @method
     * @public
     */

    refreshTimeLines() {
        /**
         * @type {MANTICORE.animation.ActionTimeLine[]}
         */
        const timeLines = this._timeLines.values;
        const timeLineCount = timeLines.length;

        for (let i = 0; i < timeLineCount; ++i) {
            timeLines[i].refreshStartParameters();
        }
    }

    /**
     * @desc Play animation if it exist
     * @method
     * @public
     * @param {string} name - Name of animation to play.
     * @param {boolean} [loop = false] - Is need to loop animation.
     * @param {int} frame [frame = 0] - Start frame of animation.
     * @param {string | MANTICORE.enumerator.animation.TIME_LINE} [timeLine = null] - Time line to play.
     * @returns {boolean}
     */

    play(name, loop = false, frame = 0, timeLine = null) {
        const actionTimeLine = this._findTimeLine(name, timeLine);

        if (Type.isNull(actionTimeLine)) {
            return false;
        }

        actionTimeLine.play(name, loop);

        this._addActiveTimeLine(actionTimeLine);

        return true;
    }

    /**
     * @desc Stop animation by frame.
     * @method
     * @public
     * @param {string} name
     * @param {string | MANTICORE.enumerator.animation.TIME_LINE} [timeLine = null]
     * @returns {boolean}
     */

    stop(name, timeLine = null) {
        const actionTimeLine = this._findTimeLine(name, timeLine);

        if (!AnimationManager._canStop(actionTimeLine) || !actionTimeLine.isPlay(name)) {
            return false;
        }

        this._timeLinesForStop.push(actionTimeLine);

        return true;
    }

    /**
     * @desc Stop all time lines
     * @method
     * @public
     */

    stopAll() {
        this._timeLinesForStop = this._activeTimeLines.slice(0);
    }

    /**
     * @desc Stop time line if it run some animation.
     * @method
     * @public
     * @param {string | MANTICORE.enumerator.animation.TIME_LINE} timeLine
     * @returns {boolean}
     */

    stopTimeLine(timeLine) {
        const actionTimeLine = this._timeLines.getElement(timeLine);
        if (!AnimationManager._canStop(actionTimeLine)) {
            return false;
        }
        this._timeLinesForStop.push(actionTimeLine);
        return true;
    }

    /**
     * @desc Pause animation in time line if it playing.
     * @method
     * @public
     * @param {string} name
     * @param {string | MANTICORE.enumerator.animation.TIME_LINE} [timeLine = null]
     * @returns {boolean}
     */

    pause(name, timeLine = null) {
        const actionTimeLine = this._findTimeLine(name, timeLine);

        if (!AnimationManager._canPause(actionTimeLine) || !actionTimeLine.isPlay(name)) {
            return false;
        }

        actionTimeLine.pause();
        return true;
    }

    /**
     * @desc Pause time line if it playing.
     * @method
     * @public
     * @param {string | MANTICORE.enumerator.animation.TIME_LINE | null} timeLine
     * @returns {boolean}
     */

    pauseTimeLine(timeLine) {
        /**
         * @type {MANTICORE.animation.ActionTimeLine}
         */
        const actionTimeLine = this._timeLines.getElement(timeLine);
        if (!AnimationManager._canPause(actionTimeLine)) {
            return false;
        }
        actionTimeLine.pause();
        return true;
    }

    /**
     * @desc Resume animation in time line if it paused.
     * @method
     * @public
     * @param {string} name
     * @param {string | MANTICORE.enumerator.animation.TIME_LINE} [timeLine = null]
     * @returns {boolean}
     */

    resume(name, timeLine = null) {
        const actionTimeLine = this._findTimeLine(name, timeLine);

        if (!AnimationManager._canResume(actionTimeLine) || !actionTimeLine.isPlay(name)) {
            return false;
        }

        actionTimeLine.resume();
        return true;
    }

    /**
     * @desc Pause time line if it playing.
     * @method
     * @public
     * @param {string | MANTICORE.enumerator.animation.TIME_LINE | null} timeLine
     * @returns {boolean}
     */

    resumeTimeLine(timeLine) {
        /**
         * @type {MANTICORE.animation.ActionTimeLine}
         */
        const actionTimeLine = this._timeLines.getElement(timeLine);
        if (!AnimationManager._canResume(actionTimeLine)) {
            return false;
        }
        actionTimeLine.resume();
        return true;
    }

    /**
     * @method
     * @public
     * @param {MANTICORE.animation.action.Action} action
     * @param {boolean} [loop = false] - Is need to loop animation.
     * @param {int} frame [frame = 0] - Start frame of animation.
     * @param {string | MANTICORE.enumerator.animation.TIME_LINE} [timeLine = null] - Time line to play.
     */

    runAction(action, loop = false, frame = 0, timeLine = null) {
        timeLine = !Type.isNull(timeLine) && this._timeLines.hasElement(timeLine) ? timeLine : TIME_LINE.MAIN;

        /**
         * @type {MANTICORE.animation.ActionTimeLine}
         */
        const actionTimeLine = this._timeLines.getElement(timeLine);

        actionTimeLine.runAction(action, loop);

        this._addActiveTimeLine(actionTimeLine);
    }

    /**
     * @method
     * @public
     * @param {number} dt
     */

    update(dt) {
        if (!this.active) {
            return;
        }
        let i = 0;
        let timeLine;
        let index;
        while (i < this._activeTimeLineCount) {
            timeLine = this._activeTimeLines[i];
            timeLine.update(dt);

            if (!timeLine.isDone) {
                ++i;
                continue;
            }

            this._activeTimeLines.splice(i, 1);
            --this._activeTimeLineCount;
        }

        for (i = 0; i < this._timeLinesForStop.length; ++i) {
            index = this._activeTimeLines.indexOf(this._timeLinesForStop);
            this._timeLinesForStop[i].stop();
            if (index === -1) {
                continue;
            }
            this._activeTimeLines.splice(index, 1);
        }

        if (this._activeTimeLineCount === 0) {
            this.active = false;
        }

        super.update(dt);
    }

    /**
     * @method
     * @public
     * @param {MANTICORE.enumerator.animation.TIME_LINE_EVENT | int} eventId
     * @param {?string} event
     * @param {string | MANTICORE.enumerator.animation.TIME_LINE} [timeLineName = null]
     * @returns {boolean}
     */

    setEvent(eventId, event, timeLineName = null) {
        if (Type.isNull(timeLineName)) {
            /**
             * @type {MANTICORE.animation.timeLine.BaseTimeLine[]}
             */
            const timeLines = this._timeLines.values;
            const timeLineCount = timeLines.length;
            let i;

            for (i = 0; i < timeLineCount; ++i) {
                timeLines[i].setEvent(eventId, event);
            }
            return true;
        }

        const timeLine = this.getTimeLine(timeLineName);
        if (Type.isNull(timeLine)) {
            return false;
        }
        timeLine.setEvent(eventId, event);
        return true;
    }

    /**
     * @method
     * @public
     * @param {MANTICORE.enumerator.animation.TIME_LINE_EVENT | int} eventId
     * @param {string | MANTICORE.enumerator.animation.TIME_LINE} [timeLineName = null]
     * @returns {boolean}
     */

    clearEvent(eventId, timeLineName = null) {
        return this.setEvent(eventId, null, timeLineName);
    }

    /**
     * @desc Reset owner to startup parameters (Tint, position, scale and etc).
     * @method
     * @public
     */

    resetParameters() {
        this.getTimeLine(TIME_LINE.MAIN).resetParameters();
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls for clear data on disuse and destroy.
     * @method
     * @private
     */

    clearData() {
        this.removeAllTimeLines();
        this._events.clear();
        super.clearData();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @private
     * @param {MANTICORE.animation.timeLine.BaseTimeLine} timeLine
     */

    static _canStop(timeLine) {
        return !Type.isNull(timeLine) && timeLine.isRunning;
    }

    /**
     * @method
     * @private
     * @param {MANTICORE.animation.timeLine.BaseTimeLine} timeLine
     */

    static _canPause(timeLine) {
        return AnimationManager._canStop(timeLine) && timeLine.isPlaying;
    }

    /**
     * @method
     * @private
     * @param {MANTICORE.animation.timeLine.BaseTimeLine} timeLine
     */

    static _canResume(timeLine) {
        return AnimationManager._canStop(timeLine) && !timeLine.isPlaying;
    }

    /**
     * @desc Find time line by animation name and time line name if it exist.
     * @method
     * @private
     * @param {string} animationName
     * @param {string | MANTICORE.enumerator.animation.TIME_LINE} timeLineName
     * @returns {MANTICORE.animation.timeLine.BaseTimeLine}
     */

    _findTimeLine(animationName, timeLineName) {
        if (!Type.isNull(timeLineName)) {
            return this._timeLines.getElement(timeLineName);
        }

        const timeLines = this._timeLines.values;
        const timeLineCount = timeLines.length;
        let i, element;

        for (i = 0; i < timeLineCount; ++i) {
            element = timeLines[i];
            if (!element.hasAnimation(animationName)) {
                continue;
            }
            return element;
        }

        return null;
    }

    /**
     * @desc Remove time line from active.
     * @method
     * @private
     * @param {MANTICORE.animation.timeLine.BaseTimeLine} timeLine
     * @private
     */

    _removeActiveTimeLine(timeLine) {
        const index = this._activeTimeLines.indexOf(timeLine);
        if (index === -1) {
            return;
        }

        timeLine.stop();

        this._activeTimeLines.splice(index, 1);
        --this._activeTimeLineCount;

        if (this._activeTimeLineCount === 0) {
            this.active = false;
        }
    }

    /**
     * @desc Add time line for update
     * @method
     * @private
     * @param {MANTICORE.animation.timeLine.BaseTimeLine} timeLine
     * @private
     */

    _addActiveTimeLine(timeLine) {
        const index = this._timeLinesForStop.indexOf(timeLine);
        if (index !== -1) {
            this._timeLinesForStop.splice(index, 1);
        }
        if (this._activeTimeLines.indexOf(timeLine) !== -1) {
            return;
        }

        this._activeTimeLines.push(timeLine);
        ++this._activeTimeLineCount;

        this.active = this.active || timeLine.type === TIME_LINE_TYPE.ACTION;
    }

    /**
     * @desc Set event in repository.
     * @method
     * @private
     * @param {MANTICORE.enumerator.animation.animation.TIME_LINE_EVENT | int} eventId
     * @param {string | null} event
     */

    _setEvent(eventId, event) {
        const hasEvent = this._events.hasElement(eventId);
        if (Type.isNull(event)) {
            if (!hasEvent) {
                return;
            }
            this._events.removeElement(eventId);
            this._setTimeLineEvent(eventId, null);
            return;
        }
        if (hasEvent) {
            this._events.updateElement(event, eventId);
        }
        else {
            this._events.addElement(event, eventId);
        }
        this._setTimeLineEvent(eventId, event);
    }

    /**
     * @desc Update time line events
     * @method
     * @private
     * @param {MANTICORE.enumerator.animation.animation.TIME_LINE_EVENT | int} eventId
     * @param {?string} event
     */

    _setTimeLineEvent(eventId, event) {
        /**
         * @type {MANTICORE.animation.ActionTimeLine[]}
         */
        const timeLines = this._timeLines.values;
        const timeLineCount = timeLines.length;

        for (let i = 0; i < timeLineCount; ++i) {
            timeLines[i].setEvent(eventId, event);
        }
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Event dispatch when animation start.
     * @public
     * @return {string | null}
     */

    get eventStart() {
        return this._events.getElement(TIME_LINE_EVENT.START);
    }

    set eventStart(value) {
        this._setEvent(TIME_LINE_EVENT.START, value);
    }

    /**
     * @desc Event dispatch when animation end.
     * @public
     * @return {string | null}
     */

    get eventEnd() {
        return this._events.getElement(TIME_LINE_EVENT.END);
    }

    set eventEnd(value) {
        this._setEvent(TIME_LINE_EVENT.END, value);
    }

    /**
     * @desc Event dispatch when animation pause.
     * @public
     * @return {string | null}
     */

    get eventPause() {
        return this._events.getElement(TIME_LINE_EVENT.PAUSE);
    }

    set eventPause(value) {
        this._setEvent(TIME_LINE_EVENT.PAUSE, value);
    }

    /**
     * @desc Event dispatch when animation resume.
     * @public
     * @return {string | null}
     */

    get eventResume() {
        return this._events.getElement(TIME_LINE_EVENT.RESUME);
    }

    set eventResume(value) {
        this._setEvent(TIME_LINE_EVENT.RESUME, value);
    }

    /**
     * @desc Event dispatch when animation stop.
     * @public
     * @return {string | null}
     */

    get eventStop() {
        return this._events.getElement(TIME_LINE_EVENT.STOP);
    }

    set eventStop(value) {
        this._setEvent(TIME_LINE_EVENT.STOP, value);
    }

    /**
     * @desc Event dispatch when animation complete.
     * @public
     * @return {string | null}
     */

    get eventComplete() {
        return this._events.getElement(TIME_LINE_EVENT.COMPLETE);
    }

    set eventComplete(value) {
        this._setEvent(TIME_LINE_EVENT.COMPLETE, value);
    }

    /**
     * @desc Animation names sorted by time lines.
     * @public
     * @returns {Object.<string, string>}
     */

    get animations() {
        const result = {};
        /**
         * @type {MANTICORE.animation.timeLine.BaseTimeLine[]}
         */
        const timeLines = this._timeLines.values;
        const timeLineCount = timeLines.length;
        let i, timeLine;

        for (i = 0; i < timeLineCount; ++i) {
            timeLine = timeLines[i];
            result[timeLine.name] = timeLine.animations;
        }
        return result;
    }
}

export default AnimationManager;