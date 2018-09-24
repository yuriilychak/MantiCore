import Model from "./Model";
import Pool from "pool/index";

/**
 * @desc Model that can be used in pool.
 * @class
 * @extends MANTICORE.model.Model
 * @memberOf MANTICORE.model
 */

class PoolModel extends Model {

    /**
     * @constructor
     * @param {int} id
     */

    constructor(id) {
        super(id);

        /**
         * @desc Flag is currently model in pool.
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
     * @public
     * @returns {boolean}
     */

    get inPool() {
        return this._inPool;
    }


    /**
     * @public
     * @param {boolean} value
     */

    set inPool(value) {
        if (this._inPool === value) {
            return;
        }
        this._inPool = value;
    }

    /**
     * @desc Calls by pool when model get from pool. Don't call it only override.
     * @method
     * @public
     * @param {*...} var_args
     */
    reuse(var_args) {}

    /**
     * @desc Calls by pool when model put in to pool. Don't call it only override.
     * @method
     * @public
     */
    disuse() {}

    /**
     * @desc Put model in pool.
     * @method
     * @public
     */

    kill() {
        Pool.putObject(this);
    }
}

export default PoolModel;