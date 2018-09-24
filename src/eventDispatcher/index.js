import Repository from "repository/Repository";
import EventModel from "./EventModel";
import pool from "pool/index";
import ListenerModel from "./ListenerModel";

/**
 * @desc Repository with listeners.
 * @type {MANTICORE.repository.Repository}
 * @private
 * @memberOf MANTICORE.eventDispatcher
 */

const _listenerRepo = new Repository();

/**
 * @desc Array with listeners that need to delete.
 * @type {MANTICORE.eventDispatcher.ListenerModel[]}
 * @private
 * @memberOf MANTICORE.eventDispatcher
 */

const _markForDelete = [];

/**
 * @desc Flag is currently event processing.
 * @type {boolean}
 * @private
 * @memberOf MANTICORE.eventDispatcher
 */

let _isEventProcessing = false;

/**
 * @desc Array with events for process.
 * @type {{type: string, data: Object | null}[]}
 * @private
 * @memberOf MANTICORE.eventDispatcher
 */

const _eventQueue = [];

/**
 * @desc Return is target listen event.
 * @function
 * @param {string} type
 * @param {Object} target
 * @returns {boolean}
 * @memberOf MANTICORE.eventDispatcher
 */

function hasListener (type, target) {

    if (!_listenerRepo.hasElement(type)) {
        return false;
    }

    /**
     * @type {MANTICORE.repository.Repository}
     */
    let listenerRepo = _listenerRepo.getElement(type);

    /**
     * @type {MANTICORE.eventDispatcher.ListenerModel[]}
     */
    const listeners = listenerRepo.values;
    const listenerCount = listeners.length;

    for (let i = 0; i < listenerCount; ++i) {
        if (listeners[i].target === target) {
            return true;
        }
    }
}

/**
 * @desc Dispatch event;
 * @function
 * @param {string} type
 * @param {Object} [targetOrEvent = null]
 * @param {Object} [data = null]
 * @memberOf MANTICORE.eventDispatcher
 */

function  dispatch(type, targetOrEvent = null, data = null) {
    let eventModel;

    if (targetOrEvent instanceof EventModel) {
        eventModel = targetOrEvent;
    }
    else {
        eventModel = pool.getObject(EventModel, targetOrEvent, data);
    }

    if (_isEventProcessing) {
        _eventQueue.push({
            type: type,
            data: eventModel
        });
        return;
    }

    _isEventProcessing = true;

    let i;


    if (_markForDelete.length !== 0) {
        i = 0;
        let model, listenerRepo, event;
        while(i < _markForDelete.length) {// Need cause listeners delete asynchronous
            model = _markForDelete[i];
            event = model.event;
            listenerRepo = _listenerRepo.getElement(event);
            listenerRepo.removeElement(model.id);
            if (listenerRepo.isEmpty()) {
                _listenerRepo.removeElement(event);
            }
            model.kill();
            ++i;
        }
        _markForDelete.length = 0;
    }

    if (!_listenerRepo.hasElement(type)) {
        return;
    }

    /**
     * @type {MANTICORE.repository.Repository}
     */
    const listenerRepo = _listenerRepo.getElement(type);
    /**
     * @type {MANTICORE.eventDispatcher.ListenerModel[]}
     */
    const listeners = listenerRepo.values;
    const listenerCount  = listeners.length;

    for (i = 0; i < listenerCount; ++i) {
        listeners[i].dispatch(eventModel);
    }

    eventModel.kill();

    _isEventProcessing = false;

    if (_eventQueue.length === 0) {
        return;
    }

    const event = _eventQueue.shift();

    dispatch(event.type, event.data);
}

/**
 * @desc Simply event dispatcher.
 * @namespace eventDispatcher
 * @memberOf MANTICORE
 */

export default {
    /**
     * @desc Add event listener for target
     * @method
     * @param {string} type
     * @param {Function} listener
     * @param {Object} target
     */

    addListener: function ( type, listener, target) {
        if (hasListener(type, target)) {
            return false;
        }

        /**
         * @type {MANTICORE.repository.Repository}
         */

        let listenerRepo;

        if (!_listenerRepo.hasElement(type)) {
            listenerRepo = new Repository();
            _listenerRepo.addElement(listenerRepo, type);
        }
        else {
            listenerRepo = _listenerRepo.getElement(type);
        }

        const model = pool.getObject(ListenerModel, type, listener, target);

        listenerRepo.addElement(model);

        return true;
    },

    hasListener,

    removeListener: function (type, target) {
        if (!hasListener(type, target)) {
            return false;
        }

        /**
         * @type {MANTICORE.repository.Repository}
         */
        let listenerRepo = _listenerRepo.getElement(type);
        /**
         * @type {MANTICORE.eventDispatcher.ListenerModel[]}
         */
        const listeners = listenerRepo.values;
        const listenerCount = listeners.length;
        let model, i;

        for (i = 0; i < listenerCount; ++i) {
            model = listeners[i];
            if (model.target === target) {
                _markForDelete.push(model);
                return true;
            }
        }
        return false;
    },

    dispatch
}