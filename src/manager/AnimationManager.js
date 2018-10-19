import BaseManager from "./BaseManager";
import Repository from "repository/Repository";
import ActionTimeLine from "animation/ActionTimeLine";
import TIME_LINE from "enumerator/TimeLine";
import Type from "util/Type";

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
         * @desc Flag is manager have active time-lines and need to update.
         * @type {boolean}
         * @private
         */

        this._isActive = false;

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
     * @param {MANTICORE.animation.ActionTimeLine} timeLine
     * @param {string} name
     * @return {boolean}
     */

    addTimeLine(timeLine, name) {
        if (this._timeLines.hasElement(name)) {
            return false;
        }
        this._timeLines.addElement(timeLine, name);
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

        const index = this._activeTimeLines.indexOf(element);
        if (index === -1) {
            return this._timeLines.removeElement(name, true);
        }

        this._activeTimeLines.splice(index, 1);
        --this._activeTimeLineCount;

        if (this._activeTimeLineCount === 0) {
            this._isActive = false;
        }

        return this._timeLines.removeElement(name, true);
    }

    /**
     * @desc Remove all time lines.
     * @method
     * @public
     */

    removeAllTimeLines() {
        this._isActive = false;
        this._activeTimeLineCount = 0;
        this._activeTimeLines.length = 0;

        this._timeLines.clear(true);
    }

    /**
     * @method
     * @param {string} name - Name of animation to play.
     * @param {boolean} [loop = false] - Is need to loop animation.
     * @param {int} frame [frame = 0] - Start frame of animation.
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine = null] - Time line to play.
     * @returns {boolean}
     */

    play(name, loop = false, frame = 0, timeLine = null) {
        /**
         * @type {MANTICORE.animation.ActionTimeLine}
         */
        let actionTimeLine = null;

        if (Type.isNull(timeLine)) {
            const timeLines = this._timeLines.values;
            const timeLineCount = timeLines.length;
            let i, element;

            for (i = 0; i < timeLineCount; ++i) {
                element = timeLines[i];
                if (element.hasAnimation(name)) {
                    actionTimeLine = element;
                    break;
                }
            }
        }
        else if (this._timeLines.hasElement(timeLine)) {
            actionTimeLine = this._timeLines.getElement(timeLine);
        }

        if (Type.isNull(actionTimeLine)) {
            return false;
        }

        actionTimeLine.play(name);

        this._updateActivity(actionTimeLine);

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

        this._updateActivity(actionTimeLine);
    }

    /**
     * @method
     * @public
     * @param {number} dt
     */

    update(dt) {
        if (!this._isActive) {
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
            this._isActive = false;
        }
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Update activity of time-line
     * @method
     * @private
     * @param {MANTICORE.animation.ActionTimeLine} timeLine
     * @private
     */

    _updateActivity(timeLine) {
        if (this._activeTimeLines.indexOf(timeLine) !== -1) {
            return;
        }

        this._activeTimeLines.push(timeLine);
        ++this._activeTimeLineCount;

        if (this._isActive) {
            return;
        }

        this._isActive = true;
    }
}

export default AnimationManager;