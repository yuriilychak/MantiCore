import MemoryManger from "manager/MemoryManager";
import Pool from "pool";

/**
 * @desc Base class for manipulate with pool and destruction.
 * @class
 * @memberOf MANTICORE.memory
 */

class ReusableObject {
    /**
     * @constructor
     */
    constructor() {
        /**
         * @desc Memory manager. Need to manipulate with pool and destruction.
         * @type {MANTICORE.manager.MemoryManager}
         * @private
         */
        this._memoryManager = new MemoryManger(this);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {...*} var_args
     */
    reuse(var_args) {}

    /**
     * @desc Calls by pool when object put in to pool. Don't call it only override.
     * @method
     * @public
     */
    disuse() {}

    /**
     * @desc Removes all internal references and listeners.
     * @method
     * @public
     */
    destroy() {
        this._memoryManager.destroy();
        this._memoryManager = null;
    }

    /**
     * @desc Call for destroy object. If it reusable put in pool.
     * @method
     * @public
     */

    kill() {
        this._memoryManager.kill();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls for create clone of element. Need to don't import pool in children.
     * @method
     * @protected
     * @static
     * @param {...*} var_args
     * @return {*}
     */

    static cloneFromPool(var_args) {
        return Pool.getObject.apply(Pool, arguments);
    }

    /**
     * @desc Flag is object destroy or put in pool after kill.
     * @public
     * @type {boolean}
     */

    get reusable() {
        return this._memoryManager.reusable;
    }

    set reusable(value) {
        this._memoryManager.reusable = value;
    }

    /**
     * @desc Flag is currently object in pool.
     * @public
     * @type {boolean}
     */

    get inPool() {
        return this._memoryManager.inPool;
    }

    set inPool(value) {
        if (this._memoryManager.inPool === value) {
            return;
        }
        this._memoryManager.inPool = value;
    }
}

export default ReusableObject;