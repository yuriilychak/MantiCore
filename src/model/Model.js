import ReusableObject from "memory/ReusableObject";
import Math from "util/Math";
import Constant from "constant";

/**
 * @desc Model that can be used in pool.
 * @class
 * @extends mCore.memory.ReusableObject
 * @memberOf mCore.model
 */

class Model extends ReusableObject {

    /**
     * @constructor
     * @param {int} [id]
     */

    constructor(id) {
        super();

        /**
         * @desc Is id unique or set
         * @type {boolean}
         * @private
         */

        this._isUnique = arguments.length === 0;

        /**
         * @type {int}
         * @private
         */
        this._id = !this._isUnique ? id : Math.getUniqueId();
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when model get from pool. Don't call it only override.
     * @method
     * @public
     * @param {int} [id]
     */
    reuse(id) {
        super.reuse();
        this._isUnique = arguments.length === 0;
        this._id = !this._isUnique ? id : Math.getUniqueId();
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data before disuse and destroy.
     * @method
     * @protected
     */

    clearData() {
        if (this._isUnique) {
            this.reuseId();
        }
        else {
            this._id = Constant.EMPTY_ID;
        }
        this._isUnique = false;
        super.clearData();
    }

    /**
     * @desc Put id for reuse.
     * @method
     * @protected
     */

    reuseId() {
        Math.putUniqueId(this._id);
        this._id = Constant.EMPTY_ID;
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns id of model.
     * @public
     * @returns {int}
     */

    get id() {
        return this._id;
    }

    set id(value) {
        if (this._id === value) {
            return;
        }
        this._id = value;
    }
}

export default Model;
