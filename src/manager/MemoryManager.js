import Pool from "pool/index";
import BaseManager from "./BaseManager";

/**
 * @desc Class for manipulate with object cloning, destroying, and pooling.
 * @class
 * @memberOf MANTICORE.manager
 * @extends MANTICORE.manager.BaseManager
 */

class MemoryManager extends BaseManager {
    /**
     * @constructor
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite | MANTICORE.memory.ReusableObject} owner
     */
    constructor(owner) {
        super(owner);

        /**
         * @desc Flag is owner put in pool after call kill() or destroy.
         * @type {boolean}
         * @private
         */

        this._ownerReusable = false;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Destroy or put owner to pool.
     * @method
     * @public
     */

    killOwner() {
        if (this._ownerReusable) {
            Pool.putObject(this.owner);
            return;
        }
        this.owner.destroy();
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls for clear data on disuse and destroy.
     * @method
     * @public
     */

    clearData() {
        this._ownerReusable = false;
        super.clearData();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {boolean}
     */

    get isOwnerReusable() {
        return this._ownerReusable;
    }

    set isOwnerReusable(value) {
        if (this._ownerReusable === value) {
            return;
        }
        this._ownerReusable = value;
    }
}

export default MemoryManager;