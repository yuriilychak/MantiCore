import BaseManager from "./BaseManager";
import Repository from "repository/Repository";
import ActionTimeLine from "animation/ActionTimeLine";
import ActionAnimation from "animation/ActionAnimation";
import TIME_LINE from "enumerator/TimeLine";
import Type from "util/Type";
import Pool from "pool";

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
         * @type {MANTICORE.animation.ActionTimeLine[]}
         * @private
         */

        this._activeTimeLines = [];

        /**
         * @desc Count of active time-lines. Need to don't calculate every frame.
         * @type {number}
         * @private
         */

        this._activeTimeLineCount = 0;

        this._timeLines.addElement(new ActionTimeLine(owner), TIME_LINE.MAIN);
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
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine]
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
     * @param {MANTICORE.animation.ActionAnimation | MANTICORE.animation.action.ActionInterval} animation
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine = null]
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
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine]
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
     * @param {MANTICORE.animation.ActionTimeLine} [timeLine = null]
     * @return {boolean}
     */

    addTimeLine(name, timeLine = null) {
        if (this._timeLines.hasElement(name)) {
            return false;
        }
        this._timeLines.addElement(!Type.isNull(timeLine) ? timeLine : Pool.getObject(ActionTimeLine, this.owner), name);
        return true;
    }

    /**
     * @method
     * @public
     * @param {string | MANTICORE.enumerator.TIME_LINE} name
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
     * @desc Play animation if it exist
     * @method
     * @public
     * @param {string} name - Name of animation to play.
     * @param {boolean} [loop = false] - Is need to loop animation.
     * @param {int} frame [frame = 0] - Start frame of animation.
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine = null] - Time line to play.
     * @returns {boolean}
     */

    play(name, loop = false, frame = 0, timeLine = null) {
        const actionTimeLine = this._findTimeLine(name, timeLine);

        if (Type.isNull(actionTimeLine)) {
            return false;
        }

        actionTimeLine.play(name);

        this._addActiveTimeLine(actionTimeLine);

        return true;
    }

    /**
     * @desc Stop animation by frame.
     * @method
     * @public
     * @param {string} name
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine = null]
     * @returns {boolean}
     */

    stop(name, timeLine = null) {
        const actionTimeLine = this._findTimeLine(name, timeLine);

        if (!AnimationManager._canStop(actionTimeLine) || !actionTimeLine.isPlay(name)) {
            return false;
        }

        actionTimeLine.stop();

        return true;
    }

    /**
     * @desc Stop time line if it run some animation.
     * @method
     * @public
     * @param {string | MANTICORE.enumerator.TIME_LINE} timeLine
     * @returns {boolean}
     */

    stopTimeLine(timeLine) {
        const actionTimeLine = this._timeLines.getElement(timeLine);
        if (!AnimationManager._canStop(actionTimeLine)) {
            return false;
        }
        actionTimeLine.stop();
        return true;
    }

    /**
     * @desc Pause animation in time line if it playing.
     * @method
     * @public
     * @param {string} name
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine = null]
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
     * @param {string | MANTICORE.enumerator.TIME_LINE | null} timeLine
     * @returns {boolean}
     */

    pauseTimeLine(timeLine) {
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
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine = null]
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
     * @param {string | MANTICORE.enumerator.TIME_LINE | null} timeLine
     * @returns {boolean}
     */

    resumeTimeLine(timeLine) {
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
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine = null] - Time line to play.
     */

    runAction(action, loop = false, frame = 0, timeLine = null) {
        timeLine = !Type.isNull(timeLine) && this._timeLines.hasElement(timeLine) ? timeLine : TIME_LINE.MAIN;

        /**
         * @type {MANTICORE.animation.ActionTimeLine}
         */
        const actionTimeLine = this._timeLines.getElement(timeLine);

        actionTimeLine.runAction(action);

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

        if (this._activeTimeLineCount === 0) {
            this.active = false;
        }

        super.update(dt);
    }

    destroy() {
        this.removeAllTimeLines();
        super.destroy();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @private
     * @param {MANTICORE.animation.ActionTimeLine} timeLine
     */

    static _canStop(timeLine) {
        return !Type.isNull(timeLine) && timeLine.isRunning;
    }

    /**
     * @method
     * @private
     * @param {MANTICORE.animation.ActionTimeLine} timeLine
     */

    static _canPause(timeLine) {
        return AnimationManager._canStop(timeLine) && timeLine.isPlaying;
    }

    /**
     * @method
     * @private
     * @param {MANTICORE.animation.ActionTimeLine} timeLine
     */

    static _canResume(timeLine) {
        return AnimationManager._canStop(timeLine) && !timeLine.isPlaying;
    }

    /**
     * @desc Find time line by animation name and time line name if it exist.
     * @method
     * @private
     * @param {string} animationName
     * @param {string | MANTICORE.enumerator.TIME_LINE} timeLineName
     * @returns {MANTICORE.animation.ActionTimeLine}
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
     * @param {MANTICORE.animation.ActionTimeLine} timeLine
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
     * @param {MANTICORE.animation.ActionTimeLine} timeLine
     * @private
     */

    _addActiveTimeLine(timeLine) {
        if (this._activeTimeLines.indexOf(timeLine) !== -1) {
            return;
        }

        this._activeTimeLines.push(timeLine);
        ++this._activeTimeLineCount;

        this.active = true;
    }
}

export default AnimationManager;