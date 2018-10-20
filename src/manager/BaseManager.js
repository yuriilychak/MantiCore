import Type from "util/Type";

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

        /**
         * @desc Flag is element need to update.
         * @type {boolean}
         * @private
         */
        this._isActive = false;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Method for update inner elements in enter frame.
     * @method
     * @public
     * @param {number} dt
     */

    update(dt) {}

    /**
     * @desc Calls when destroy owner. DON'T USE IT MANUALLY!!!
     * @method
     * @public
     */

    destroy() {
        this._owner = null;
    }

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

    /**
     * @desc Flag is element need to update.
     * @public
     * @return {boolean}
     */

    get active() {
        return this._isActive;
    }

    set active(value) {
        if (this._isActive === value) {
            return;
        }

        this._isActive = value;

        if (this._isActive && !Type.isUndefined(this._owner.isUpdate)) {
            this._owner.isUpdate = this._isActive;
        }
    }
}

export default BaseManager;