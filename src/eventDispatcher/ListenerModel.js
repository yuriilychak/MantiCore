import Model from "model/Model";
import Math from "util/Math";

/**
 * @desc Model for store event listener data.
 * @class
 * @memberOf MANTICORE.eventDispatcher
 * @extends MANTICORE.model.Model
 */

class ListenerModel extends Model {
    /**
     * @constructor
     * @override
     * @param {string} event
     * @param {Function} listener
     * @param {Object} target
     */

    constructor (event, listener, target) {
        super(Math.getUniqueId());

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
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

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

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns name of event.
     * @type {?string}
     */

    get event() {
        return this._event;
    }

    /**
     * @desc Returns target of listener.
     * @type {?Object}
     */

    get target() {
        return this._target;
    }
}

export default ListenerModel;