import ReusableObject from "memory/ReusableObject";

/**
 * @desc Model that can be used in pool.
 * @class
 * @extends MANTICORE.memory.ReusableObject
 * @memberOf MANTICORE.model
 */

class Model extends ReusableObject {

    /**
     * @constructor
     * @param {int} id
     */

    constructor(id) {
        super();
        /**
         * @type {int}
         * @private
         */
        this._id = id;
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns id of model.
     * @type {int}
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