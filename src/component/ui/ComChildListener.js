import ComChildIterator from "component/ComChildIterator";
import Repository from "repository/Repository";
import INTERACTIVE_EVENT from "enumerator/ui/InteractiveEvent";
import Widget from "ui/Widget";
import Type from "util/Type";

const events = [
    INTERACTIVE_EVENT.DOWN,
    INTERACTIVE_EVENT.UP,
    INTERACTIVE_EVENT.OVER,
    INTERACTIVE_EVENT.OUT,
    INTERACTIVE_EVENT.MOVE,
    INTERACTIVE_EVENT.CLICK,
    INTERACTIVE_EVENT.DRAG_START,
    INTERACTIVE_EVENT.DRAG,
    INTERACTIVE_EVENT.DRAG_FINIS
];

const eventCount = events.length;

/**
 * @desc Component for add events to all children. Work with widget and it's children.
 * @class
 * @memberOf MANTICORE.component.ui
 * @extends MANTICORE.component.ComChildIterator
 */

class ComChildListener extends ComChildIterator {
    /**
     * @constructor
     */
    constructor() {
        super("ComChildListener");

        /**
         * @desc Repository with event that listen children.
         * @type {MANTICORE.repository.Repository}
         * @private
         */

        this._events = new Repository();
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {boolean}
     */

    get blockEvents() {
        return super.blockEvents;
    }

    set blockEvents(value) {
        super.blockEvents = value;
        this.iterateChildren(child => {
            child.blockEvents = value;
        })
    }

    /**
     * @desc Callback that calls when component attach to owner. Don't use it manually. Only override.
     * @method
     * @public
     * @param {MANTICORE.view.ComponentContainer} owner
     */

    onAdd (owner) {
        super.onAdd(owner);

        this.iterateChildren(child => this._addEvents(child));
    }


    /**
     * @public
     * @type {string | null}
     */

    get eventUp() {
        return this._events.getElement(INTERACTIVE_EVENT.UP);
    }

    set eventUp(value) {
        this._updateEvent(INTERACTIVE_EVENT.UP, value);
    }

    /**
     * @public
     * @type {string | null}
     */

    get eventDown() {
        return this._events.getElement(INTERACTIVE_EVENT.DOWN);
    }

    set eventDown(value) {
        this._updateEvent(INTERACTIVE_EVENT.DOWN, value);
    }

    /**
     * @public
     * @type {string | null}
     */

    get eventOver() {
        return this._events.getElement(INTERACTIVE_EVENT.OVER);
    }

    set eventOver(value) {
        this._updateEvent(INTERACTIVE_EVENT.OVER, value);
    }

    /**
     * @public
     * @type {string | null}
     */

    get eventOut() {
        return this._events.getElement(INTERACTIVE_EVENT.OUT);
    }

    set eventOut(value) {
        this._updateEvent(INTERACTIVE_EVENT.OUT, value);
    }

    /**
     * @public
     * @type {string | null}
     */

    get eventMove() {
        return this._events.getElement(INTERACTIVE_EVENT.MOVE);
    }

    set eventMove(value) {
        this._updateEvent(INTERACTIVE_EVENT.MOVE, value);
    }

    /**
     * @public
     * @type {string | null}
     */

    get eventDrag() {
        return this._events.getElement(INTERACTIVE_EVENT.DRAG);
    }

    set eventDrag(value) {
        this._updateEvent(INTERACTIVE_EVENT.DRAG, value);
    }

    /**
     * @public
     * @type {string | null}
     */

    get eventClick() {
        return this._events.getElement(INTERACTIVE_EVENT.CLICK);
    }

    set eventClick(value) {
        this._updateEvent(INTERACTIVE_EVENT.CLICK, value);
    }

    /**
     * @public
     * @type {string | null}
     */

    get eventDragFinish() {
        return this._events.getElement(INTERACTIVE_EVENT.DRAG_FINIS);
    }

    set eventDragFinish(value) {
        this._updateEvent(INTERACTIVE_EVENT.DRAG_FINIS, value);
    }

    /**
     * @public
     * @type {string | null}
     */

    get eventDragStart() {
        return this._events.getElement(INTERACTIVE_EVENT.DRAG_START);
    }

    set eventDragStart(value) {
        this._updateEvent(INTERACTIVE_EVENT.DRAG_START, value);
    }

    /**
     * @desc Calls when owner add children.
     * @method
     * @public
     * @param {PIXI.DisplayObject} child
     */

    onAddChild(child) {
        this._addEvents(child);
    }

    /**
     * @desc Calls when owner remove children.
     * @method
     * @public
     * @param {PIXI.DisplayObject} child
     */

    onRemoveChild(child) {
        this._removeEvents(child);
    }

    /**
     * @desc Calls by pool when component put in to pool (Can be only override). DON'T USE IT MANUALLY!!!
     * @method
     * @public
     */

    disuse() {
        this.iterateChildren(child => this._removeEvents(child));
        this._events.clear();
        super.disuse();
    }

    /**
     * @desc Calls by memory manager when object kill. DON'T USE IT MANUALLY!!!
     * @method
     * @public
     */

    destroy() {
        this.iterateChildren(child => this._removeEvents(child));
        this._events.clear();
        super.destroy();
    }

    /**
     * @desc Clone component
     * @method
     * @public
     * @return {MANTICORE.component.ui.ComChildListener}
     */

    clone() {
        return ComChildListener.cloneFromPool(ComChildListener);
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Add events to new child.
     * @method
     * @private
     * @param {PIXI.DisplayObject | MANTICORE.ui.Widget | MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} child
     *
     */

    _addEvents(child) {
        if (!(child instanceof Widget)) {
            return;
        }
        child.interactive = true;
        child.blockEvents = this.blockEvents;

        let i, event;
        for (i = 0; i < eventCount; ++i) {
            event = events[i];
            child.updateInteractiveEvent(event, this._events.getElement(event));
        }
    }

    /**
     * @desc Remove events for child when component destroy.
     * @method
     * @private
     * @param {PIXI.DisplayObject | MANTICORE.ui.Widget | MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} child
     *
     */

    _removeEvents(child) {
        if (!(child instanceof Widget)) {
            return;
        }
        let i, event;
        for (i = 0; i < eventCount; ++i) {
            event = events[i];
            child.updateInteractiveEvent(event, null);
        }
        child.blockEvents = false;
    }

    /**
     * @desc Add or remove event from repository for children.
     * @method
     * @private
     * @param {MANTICORE.enumerator.ui.INTERACTIVE_EVENT} id
     * @param {?string} [name = null] - name of event for dispatch.
     */

    _updateEvent(id, name = null) {
        this.iterateChildren(child => {
            if (!(child instanceof Widget)) {
                return;
            }
            child.updateInteractiveEvent(id, name);
        });
        const isEventEmpty = Type.isNull(name);
        if (this._events.hasElement(id)) {
            if (isEventEmpty) {
                this._events.removeElement(id);
                return;
            }
            this._events.updateElement(name, id);
            return;
        }

        if (isEventEmpty) {
            return;
        }

        this._events.addElement(name, id);
    }
}

export default ComChildListener;