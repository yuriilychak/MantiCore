import Model from "model/Model";

/**
 * @desc Model for store event data.
 * @class
 * @memberOf MANTICORE.eventDispatcher
 * @extends MANTICORE.model.Model
 */

class EventModel extends Model {
    /**
     * @constructor
     * @override
     * @param {Object} target
     * @param {*} data
     */

    constructor (target, data) {
        super();

        /**
         * @desc Data of event.
         * @type {*}
         * @private
         */

        this._data = data;

        /**
         * @desc Context of listener.
         * @type {?Object}
         * @private
         */

        this._target = target;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when model get from pool. Don't call it only override.
     * @method
     * @public
     * @param {...*} var_args
     */
    reuse(var_args) {
        super.reuse();
        this._target = arguments[0];
        this._data = arguments[1];
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
        this._target = null;
        this._data = null;

        super.clearData();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns data of event.
     * @type {*}
     */

    get data() {
        return this._data;
    }

    /**
     * @desc Returns target of event.
     * @type {?Object}
     */

    get target() {
        return this._target;
    }
}

export default EventModel;