/**
 * @desc Base class for manager classes.
 * @class
 * @memberOf MANTICORE.manager
 */

class BaseManager {
    /**
     * @constructor
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite | MANTICORE.component.Component} owner
     */
    constructor(owner) {
        /**
         * @desc Owner of manager.
         * @type {MANTICORE.view.ComponentContainer|MANTICORE.view.ComponentSprite|MANTICORE.component.Component}
         * @private
         */
        this._owner = owner;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls when destroy owner. DON'T USE IT MANUALLY!!!
     * @method
     * @public
     */

    destroy() {}

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @protected
     * @type {MANTICORE.view.ComponentContainer|MANTICORE.view.ComponentSprite|MANTICORE.component.Component}
     */

    get owner() {
        return this._owner;
    }
}

export default BaseManager;