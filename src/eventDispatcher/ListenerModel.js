import Model from "model/Model";
import Type from "util/Type";
import Logger from "logger";

/**
 * @desc Model for store event listener data.
 * @class
 * @memberOf mCore.eventDispatcher
 * @extends mCore.model.Model
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
        super();

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
        if (this._target.inPool || this._target.blockEvents) {
            return;
        }
        if (Type.isEmpty(this._listener)) {
            Logger.engineWarn(1, this._event);
            return;
        }
        this._listener.call(this._target, data);
    }

    /**
     * @desc Calls by pool when model get from pool. Don't call it only override.
     * @method
     * @public
     * @param {string} event
     * @param {Function} listener
     * @param {Object} target
     */
    reuse(event, listener, target) {
        super.reuse();

        this._event = event;
        this._listener = listener;
        this._target = target;
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
        this._event = null;
        this._listener = null;
        this._target = null;
        super.clearData();
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
