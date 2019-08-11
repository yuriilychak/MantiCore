import Type from "util/Type";
import ReusableObject from "memory/ReusableObject";

/**
 * @desc Base class for manager classes.
 * @class
 * @memberOf mCore.manager
 * @extends mCore.memory.ReusableObject
 */

class BaseManager extends ReusableObject {
    /**
     * @constructor
     * @param {mCore.view.ComponentContainer | mCore.view.ComponentSprite | mCore.memory.ReusableObject} owner
     */
    constructor(owner) {
        super();

        /**
         * @desc Owner of manager.
         * @type {mCore.view.ComponentContainer|mCore.view.ComponentSprite|mCore.memory.ReusableObject}
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
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {mCore.view.ComponentContainer | mCore.view.ComponentSprite | mCore.memory.ReusableObject} owner
     */
    reuse(owner) {
        this._owner = owner;
        super.reuse(...arguments);
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data befor disuse and destroy.
     * @method
     * @protected
     */

    clearData() {
        this._owner = null;
        this._isActive = false;
        super.clearData();
    }

    /**
     * @protected
     * @type {mCore.view.ComponentContainer|mCore.view.ComponentSprite|mCore.component.Component}
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
