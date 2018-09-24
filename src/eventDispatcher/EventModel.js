import PoolModel from "model/PoolModel";

/**
 * @desc Generator of id
 * @static
 * @type {int}
 * @memberOf MANTICORE.eventDispatcher.EventModel
 * @private
 */
let _idIterator = 0;

/**
 * @desc Model for store event data.
 * @class
 * @memberOf MANTICORE.eventDispatcher
 * @extends MANTICORE.model.PoolModel
 */

class EventModel extends PoolModel {
    /**
     * @constructor
     * @override
     * @param {Object} target
     * @param {*} data
     */

    constructor (target, data) {
        super(++_idIterator);

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
     * @desc Returns data of event.
     * @returns {*}
     */

    get data() {
        return this._data;
    }

    /**
     * @desc Returns target of event.
     * @returns {?Object}
     */

    get target() {
        return this._target;
    }

    /**
     * @desc Calls by pool when model get from pool. Don't call it only override.
     * @method
     * @public
     * @param {...*} var_args
     */
    reuse(var_args) {
        this._target = arguments[0];
        this._data = arguments[1];
    }

    /**
     * @desc Calls by pool when model put in to pool. Don't call it only override.
     * @method
     * @public
     */
    disuse() {
        this._target = null;
        this._data = null;
    }
}

export default EventModel;