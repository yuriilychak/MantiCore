import Repository from "repository/Repository";
import EventModel from "./EventModel";
import pool from "pool/index";
import ListenerModel from "./ListenerModel";

/**
 * @desc Simply event dispatcher.
 * @namespace MANTICORE.eventDispatcher
 * @memberOf MANTICORE
 */

const eventDispatcher = {

    /**
     * @desc Flag is currently event processing.
     * @type {boolean}
     * @private
     * @memberOf MANTICORE.eventDispatcher
     */

    _isEventProcessing: false,

    /**
     * @desc Array with events for process.
     * @type {MANTICORE.eventDispatcher.EventData[]}
     * @private
     * @memberOf MANTICORE.eventDispatcher
     */

    _eventQueue: [],

    /**
     * @desc Array with listeners that need to delete.
     * @type {MANTICORE.eventDispatcher.ListenerModel[]}
     * @private
     * @memberOf MANTICORE.eventDispatcher
     */

    _markForDelete: [],

    /**
     * @desc Repository with listeners.
     * @type {MANTICORE.repository.Repository}
     * @private
     * @memberOf MANTICORE.eventDispatcher
     */

    _listenerRepo: new Repository(),

    /**
     * @desc Add event listener for target
     * @param {string} type
     * @param {Function} listener
     * @param {Object} target
     * @memberOf MANTICORE.eventDispatcher
     */

    addListener: function (type, listener, target) {
        if (this.hasListener(type, target)) {
            return false;
        }

        let listenerRepo;

        if (!this._listenerRepo.hasElement(type)) {
            listenerRepo = new Repository();
            this._listenerRepo.addElement(listenerRepo, type);
        }
        else {
            listenerRepo = this._listenerRepo.getElement(type);
        }

        const model = pool.getObject(ListenerModel, type, listener, target);

        listenerRepo.addElement(model);

        return true;
    },

    /**
     * @desc Return is target listen event.
     * @param {string} type
     * @param {Object} target
     * @returns {boolean}
     * @memberOf MANTICORE.eventDispatcher
     */

    hasListener: function (type, target) {

        if (!this._listenerRepo.hasElement(type)) {
            return false;
        }

        let listenerRepo = this._listenerRepo.getElement(type);
        const listeners = listenerRepo.values;
        const listenerCount = listeners.length;

        for (let i = 0; i < listenerCount; ++i) {
            if (listeners[i].target === target) {
                return true;
            }
        }
    },

    /**
     * @memberOf MANTICORE.eventDispatcher
     * @param {string} type
     * @param {Object} target
     * @returns {boolean}
     */

    removeListener: function (type, target) {
        if (!this.hasListener(type, target)) {
            return false;
        }

        let listenerRepo = this._listenerRepo.getElement(type);
        const listeners = listenerRepo.values;
        const listenerCount = listeners.length;
        let model, i;

        for (i = 0; i < listenerCount; ++i) {
            model = listeners[i];
            if (model.target === target) {
                this._markForDelete.push(model);
                return true;
            }
        }
        return false;
    },

    /**
     * @desc Dispatch event;
     * @param {string} type
     * @param {Object} [targetOrEvent = null]
     * @param {Object} [data = null]
     * @memberOf MANTICORE.eventDispatcher
     */

    dispatch: function(type, targetOrEvent = null, data = null) {
        let eventModel;

        if (targetOrEvent instanceof EventModel) {
            eventModel = targetOrEvent;
        }
        else {
            eventModel = pool.getObject(EventModel, targetOrEvent, data);
        }

        if (this._isEventProcessing) {
            this._eventQueue.push({
                type: type,
                data: eventModel
            });
            return;
        }

        this._isEventProcessing = true;

        let i;


        if (this._markForDelete.length !== 0) {
            i = 0;
            let model, listenerRepo, event;
            while (i < this._markForDelete.length) {// Need cause listeners delete asynchronous
                model = this._markForDelete[i];
                event = model.event;
                listenerRepo = this._listenerRepo.getElement(event);
                listenerRepo.removeElement(model.id);
                if (listenerRepo.isEmpty()) {
                    this._listenerRepo.removeElement(event);
                }
                model.kill();
                ++i;
            }
            this._markForDelete.length = 0;
        }

        if (!this._listenerRepo.hasElement(type)) {
            return;
        }

        const listenerRepo = this._listenerRepo.getElement(type);
        const listeners = listenerRepo.values;
        const listenerCount = listeners.length;

        for (i = 0; i < listenerCount; ++i) {
            listeners[i].dispatch(eventModel);
        }

        eventModel.kill();

        this._isEventProcessing = false;

        if (this._eventQueue.length === 0) {
            return;
        }

        const event = this._eventQueue.shift();

        this.dispatch(event.type, event.data);
    }
};

export default eventDispatcher;