import BaseManager from "./BaseManager";
import Repository from "repository/Repository";
import ActionTimeLine from "animation/ActionTimeLine";

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
        this._timeLines.addElement(new ActionTimeLine(owner), "main");

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
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @public
     * @param {MANTICORE.animation.action.Action} action
     */

    runAction(action) {
        /**
         * @type {MANTICORE.animation.ActionTimeLine}
         */
        const timeLine = this._timeLines.getElement("main");


        timeLine.runAction(action);
        this._activeTimeLines.push(timeLine);
        this._activeTimeLineCount = 1;
        this._isActive = true;
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
}

export default AnimationManager;