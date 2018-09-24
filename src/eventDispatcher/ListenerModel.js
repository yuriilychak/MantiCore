import PoolModel from "model/PoolModel";

/**
 * @desc Generator of id
 * @static
 * @type {int}
 * @memberOf MANTICORE.eventDispatcher.ListenerModel
 * @private
 */
let _idIterator = 0;

/**
 * @desc Model for store event listener data.
 * @class
 * @memberOf MANTICORE.eventDispatcher
 * @extends MANTICORE.model.PoolModel
 */

class ListenerModel extends PoolModel {
    /**
     * @constructor
     * @override
     * @param {string} event
     * @param {Function} listener
     * @param {Object} target
     */

    constructor (event, listener, target) {
        super(++_idIterator);

        /**
         * @desc Name of event that dispatch. Need to remove without errors.
         * @type {?string}
         * @private
         */

        this._event = event;

        /**
         * @desc listener of event;
         * @type {?Function}
         * @private
         */

        this._listener = listener;

        /**
         * @desc Context of listener.
         * @type {?Object}
         * @private
         */

        this._target = target;
    }

    /**
     * @desc Dispatch event;
     * @method
     * @public
     * @param {Object} [data = null]
     */

    dispatch(data = null) {
        if (this._target.inPool) {
            return;
        }
        this._listener.call(this._target, data);
    }

    /**
     * @desc Returns name of event.
     * @returns {?string}
     */

    get event() {
        return this._event;
    }

    /**
     * @desc Returns target of listener.
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
        this._event = arguments[0];
        this._listener = arguments[1];
        this._target = arguments[2];
    }

    /**
     * @desc Calls by pool when model put in to pool. Don't call it only override.
     * @method
     * @public
     */
    disuse() {
        this._event = null;
        this._listener = null;
        this._target = null;
    }
}

export default ListenerModel;