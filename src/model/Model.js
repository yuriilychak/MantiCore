/**
 * @desc Base realisation of model.
 * @class
 * @memberOf MANTICORE.model
 */

class Model {

    /**
     * @constructor
     * @param {int} id
     */

    constructor(id) {
        /**
         * @type {int}
         * @private
         */
        this._id = id;
    }

    /**
     * @desc Returns id of model.
     * @returns {int}
     */

    get id() {
        return this._id;
    }

    /**
     * @desc Set Id of model. Use only in pool.
     * @protected
     * @param {int} value
     */

    set id(value) {
        if (this._id === value) {
            return;
        }
        this._id = value;
    }
}

export default Model;