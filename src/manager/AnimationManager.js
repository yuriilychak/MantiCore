import BaseManager from "./BaseManager";
import Repository from "repository/Repository";

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
         * @desc Array with free time-lines.
         * @type {string[]}
         * @private
         */
        this._freeTimeLines = ["main"];
        /**
         * @desc Repository with time-lines
         * @type {MANTICORE.repository.Repository}
         * @private
         */
        this._timeLines = new Repository();

        this._timeLines.addElement(null, "main");
    }
}

export default AnimationManager;