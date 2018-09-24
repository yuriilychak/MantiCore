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