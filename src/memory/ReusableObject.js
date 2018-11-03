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
         * @desc Flag is currently object destroyed
         * @type {boolean}
         * @private
         */
        this._isDestroyed = false;

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
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {...*} var_args
     */
    reuse(var_args) {
        this._inPool = false;
    }

    /**
     * @desc Calls by pool when object put in to pool. Don't call it only override.
     * @method
     * @public
     */
    disuse() {
        this.clearData();
        this._inPool = true;
    }

    /**
     * @desc Removes all internal references and listeners.
     * @method
     * @public
     */
    destroy() {
        this.clearData();
        this._isDestroyed = true;
        this._inPool = false;
        this._reusable = false;
    }

    /**
     * @desc Call for destroy object. If it reusable put in pool.
     * @method
     * @public
     */

    kill() {
        if (this._inPool || this._isDestroyed) {
            return;
        }
        if (this._reusable) {
            Pool.putObject(this);
            return;
        }
        this.destroy();
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

    clearData() {}

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
        return this._reusable;
    }

    set reusable(value) {
        if (this._reusable === value) {
            return;
        }
        this._reusable = value;
    }

    /**
     * @desc Flag is currently object in pool.
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

    /**
     * @desc Flag is currently object destroyed
     * @public
     * @readonly
     * @return {boolean}
     */

    get isDestroyd() {
        return this._isDestroyed;
    }
}

export default ReusableObject;