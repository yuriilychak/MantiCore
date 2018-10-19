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

        this._reusable = false;

        /**
         * @desc Flag is currently owner in pool or his owner in pool.
         * @type {boolean}
         * @private
         */

        this._inPool = false;
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

    destroy() {
        this._inPool = true;
        this._reusable = false;
    }

    /**
     * @desc Destroy or put owner to pool.
     * @method
     * @public
     */

    kill() {
        if (this._reusable) {
            Pool.putObject(this.owner);
            return;
        }
        this.owner.destroy();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {boolean}
     */

    get reusable() {
        return this._reusable;
    }

    set reusable(value) {
        if (this._reusable === value) {
            return;
        }
        this._reusable = value;
    }

    /**
     * @public
     * @type {boolean}
     */

    get inPool() {
        return this._inPool;
    }

    set inPool(value) {
        if (this._inPool === value) {
            return;
        }
        this._inPool = value;
    }
}

export default MemoryManager;