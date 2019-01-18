import Type from "util/Type";
import EventDispatcher from "eventDispatcher/index";
import BaseManager from "./BaseManager";

/**
 * @desc Class for manipulate with event listeners of complex objects.
 * @class
 * @memberOf MANTICORE.manager
 * @extends MANTICORE.manager.BaseManager
 */

class ListenerManager extends BaseManager {
    /**
     * @constructor
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite | MANTICORE.memory.ReusableObject} owner
     */
    constructor(owner) {
        super(owner);

        /**
         * @desc Flag is block event dispatching for owner.
         * @type {boolean}
         * @private
         */

        this._blockEvents = false;

        /**
         * @desc Array with events that listen owner.
         * @type {string[]}
         * @private
         */

        this._events = [];
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns is owner currently listen event.
     * @public
     * @param {string} event
     * @returns {boolean}
     */

    isListenEvent(event) {
        return this._events.indexOf(event) !== -1;
    }

    /**
     * @desc Add event listener for element.
     * @method
     * @public
     * @param {string} event
     * @param {Function} handler
     * @returns {boolean}
     */

    addEventListener(event, handler) {
        if (this.isListenEvent(event)) {
            return false;
        }
        const result = EventDispatcher.addListener(event, handler, this.owner);
        if (result) {
            this._events.push(event);
        }
        return result;
    }

    /**
     * @desc Remove event listener.
     * @method
     * @public
     * @param {string} event
     */

    removeEventListener(event) {
        if (!this.isListenEvent(event)) {
            return;
        }
        const index = this._events.indexOf(event);
        this._events.splice(index, 1);
        EventDispatcher.removeListener(event, this.owner);
    }

    /**
     * @desc Remove all event listeners.
     * @method
     * @public
     */

    removeAllEventListeners() {
        const eventCount = this._events.length;
        for (let i = 0; i < eventCount; ++i) {
            EventDispatcher.removeListener(this._events[i], this.owner);
        }
    }

    /**
     * @desc Dispatch event.
     * @method
     * @public
     * @param {string} event
     * @param {*} [data = null]
     */

    dispatchEvent(event, data = null) {
        if (Type.isNull(event) || this._blockEvents) {
            return;
        }
        EventDispatcher.dispatch(event, this.owner, data);
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls for clear data on disuse and destroy.
     * @method
     * @public
     */

    clearData() {
        this.removeAllEventListeners();
        this._blockEvents = false;
        super.clearData();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {boolean}
     */

    get blockEvents() {
        return this._blockEvents;
    }

    set blockEvents(value) {
        if (this._blockEvents === value) {
            return;
        }
        this._blockEvents = value;
    }
}

export default ListenerManager;