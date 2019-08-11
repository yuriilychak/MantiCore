import BaseManager from "./BaseManager";
import Repository from "repository/Repository";
import Type from "util/Type";
import INTERACTIVE_EVENT from "../enumerator/ui/InteractiveEvent";
import Geometry from "util/Geometry";
import Math from "util/Math";
import Constant from "constant";
import Boot from "boot";
import Point from "geometry/Point";

/**
 * @desc Class for manipulate with view interactions.
 * @class
 * @memberOf mCore.manager
 * @extends mCore.manager.BaseManager
 */

class InteractionManager extends BaseManager {
    /**
     * @constructor
     * @param {mCore.view.ComponentContainer | mCore.view.ComponentSprite | mCore.memory.ReusableObject} owner
     */
    constructor(owner) {
        super(owner);

        /**
         * @desc Flag is currently widget drag.
         * @type {boolean}
         * @private
         */

        this._isInteractiveDrag = false;

        /**
         * @desc Flag is currently widget down.
         * @type {boolean}
         * @private
         */

        this._isInteractiveDown = false;

        /**
         * @desc Flag is Interactive in view.
         * @type {boolean}
         * @private
         */

        this._isInteractiveOver = false;

        /**
         * @type {mCore.repository.Repository}
         * @private
         */

        this._events = new Repository();

        /**
         * @desc Previous position of action (need to update click).
         * @type {mCore.geometry.Point}
         * @private
         */

        this._prevPos = Point.create(0, 0);

        /**
         * @desc Current position of action (need to update click).
         * @type {mCore.geometry.Point}
         * @private
         */

        this._crtPos = Point.create(0, 0);

        /**
         * @desc Accumulated offset when touch move. (need to update click).
         * @type {mCore.geometry.Point}
         * @private
         */

        this._acumOffset = Point.create(0, 0);

        /**
         * @desc Flag is need to propagate evens for children to dispatch for target.
         * @type {boolean}
         * @private
         */

        this._propagateChildrenEvent = false;

        /**
         * @desc Flag is manager interactive.
         * @type {boolean}
         * @private
         */

        this._interactive = false;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns interactive event.
     * @method
     * @public
     * @param {mCore.enumerator.ui.INTERACTIVE_EVENT} id
     * @returns {string}
     */

    getInteractiveEvent(id) {
        return this._events.getElement(id);
    }

    /**
     * @desc Add or remove event from repository. DON'T USE IT MANUALLY!!!
     * @method
     * @public
     * @param {mCore.enumerator.ui.INTERACTIVE_EVENT} id
     * @param {?string} [name = null] - name of event for dispatch.
     */

    updateInteractiveEvent(id, name = null) {
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

    /**
     * @desc Calls when interactive manager emit event.
     * @method
     * @public
     * @param {mCore.enumerator.ui.INTERACTIVE_EVENT} eventType
     * @param {*} [event]
     */

    emitInteractiveEvent(eventType, event = null) {
        this.owner.emitInteractiveEvent(eventType, event);
        this._dispatchInteractiveEvent(eventType, event);
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
        this.active = false;
        this._events.clear();
        this._isInteractiveDrag = false;
        this._isInteractiveDown = false;
        this._isInteractiveOver = false;
        this._propagateChildrenEvent = false;
        this._acumOffset.set(0, 0);
        this._prevPos.set(0, 0);
        this._crtPos.set(0, 0);
        super.clearData();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @param {Object} target
     * @param {mCore.geometry.Point} point
     * @private
     */

    _haveInteractiveChildrenAt(target, point) {

        if (this._propagateChildrenEvent) {
            return false;
        }

        const childrenCount = target.children.length;
        let i, child, pos;

        if (!this.owner.interactiveChildren) {
            return false;
        }

        for (i = 0; i < childrenCount; ++i) {
            child = target.children[i];
            if (child.interactive) {
                pos = child.toLocal(point);
                if (pos.x > 0 && pos.y > 0 && pos.x < child.width && pos.y < child.height) {
                    return true;
                }
            }
            if (this._haveInteractiveChildrenAt(child, point)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @method
     * @private
     * @param {mCore.enumerator.ui.INTERACTIVE_EVENT} id
     * @param {Object} interactiveEvent
     */

    _dispatchInteractiveEvent(id, interactiveEvent) {
        if (!this.owner || !this.owner.interactive || !this._events.hasElement(id) || this.owner.blockEvents) {
            return;
        }

        const event = this._events.getElement(id);

        this.owner.listenerManager.dispatchEvent(event, interactiveEvent);
    }

    /**
     * @method
     * @private
     * @param {Object} event
     */

    _onActionUpHandler(event) {
        this._onUpAction(event);
    }

    /**
     * @method
     * @private
     * @param {Object} event
     * @returns {boolean}
     */

    _onActionDownHandler(event) {
        const globalPos = event.data.global;
        if (this._haveInteractiveChildrenAt(this.owner, event.data.global)) {
            return false;
        }
        this._isInteractiveDown = true;
        this.emitInteractiveEvent(INTERACTIVE_EVENT.DOWN, event);
        this._prevPos.copyFrom(globalPos);
        this._crtPos.copyFrom(globalPos);
        this._acumOffset.set(0, 0);
        return true;
    }

    /**
     * @method
     * @private
     * @param {Object} event
     */

    _onActionOverHandler(event) {
        this._isInteractiveOver = true;
        this.emitInteractiveEvent(INTERACTIVE_EVENT.OVER, event);
    }

    /**
     * @method
     * @private
     * @param {Object} event
     */

    _onActionOutHandler(event) {
        this._isInteractiveOver = false;
        this.emitInteractiveEvent(INTERACTIVE_EVENT.OUT, event);
    }

    /**
     * @method
     * @private
     * @param {Object} event
     */

    _onActionUpOutsideHandler(event) {
        this._onUpAction(event);
    }

    /**
     * @method
     * @private
     * @param {Object} event
     */

    _onActionMoveHandler(event) {
        const globalPos = event.data.global;
        if (!this._isInteractiveDown && !this._isInteractiveOver || this._haveInteractiveChildrenAt(this.owner, globalPos)) {
            return;
        }
        if (this._isInteractiveDown && !this._isInteractiveDrag) {
            this._isInteractiveDrag = true;
            this.emitInteractiveEvent(INTERACTIVE_EVENT.DRAG_START, event);
        }

        if (this._isInteractiveDown) {
            this.emitInteractiveEvent(INTERACTIVE_EVENT.DRAG, event);
            this._crtPos.copyFrom(globalPos);
            Geometry.pAdd(this._acumOffset, Geometry.pSub(this._crtPos, this._prevPos), true);
            this._prevPos.copyFrom(this._crtPos);
            return
        }
        this.emitInteractiveEvent(INTERACTIVE_EVENT.MOVE, event);
    }

    /**
     * @desc Calls when up handler in or out calls.
     * @method
     * @private
     * @param {Object} event
     */

    _onUpAction(event) {
        if (!this._isInteractiveDown) {
            return;
        }
        this.emitInteractiveEvent(INTERACTIVE_EVENT.UP, event);
        if (this._isInteractiveDrag) {
            this.emitInteractiveEvent(INTERACTIVE_EVENT.DRAG_FINIS, event);
            if (Math.abs(this._acumOffset.x) <= Constant.OFFSET_EPSILON && Math.abs(this._acumOffset.x) <= Constant.OFFSET_EPSILON) {
                this.emitInteractiveEvent(INTERACTIVE_EVENT.CLICK, event);
            }
        }
        else {
            this.emitInteractiveEvent(INTERACTIVE_EVENT.CLICK, event);
        }
        this._isInteractiveDown = false;
        this._isInteractiveDrag = false;
        this._acumOffset.set(0, 0);
        this._prevPos.set(0, 0);
        this._crtPos.set(0, 0);
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {string | null}
     */

    get eventUp() {
        return this._events.getElement(INTERACTIVE_EVENT.UP);
    }

    set eventUp(value) {
        this.updateInteractiveEvent(INTERACTIVE_EVENT.UP, value);
    }

    /**
     * @public
     * @type {string | null}
     */

    get eventDown() {
        return this._events.getElement(INTERACTIVE_EVENT.DOWN);
    }

    set eventDown(value) {
        this.updateInteractiveEvent(INTERACTIVE_EVENT.DOWN, value);
    }

    /**
     * @public
     * @type {string | null}
     */

    get eventOver() {
        return this._events.getElement(INTERACTIVE_EVENT.OVER);
    }

    set eventOver(value) {
        this.updateInteractiveEvent(INTERACTIVE_EVENT.OVER, value);
    }

    /**
     * @public
     * @type {string | null}
     */

    get eventOut() {
        return this._events.getElement(INTERACTIVE_EVENT.OUT);
    }

    set eventOut(value) {
        this.updateInteractiveEvent(INTERACTIVE_EVENT.OUT, value);
    }

    /**
     * @public
     * @type {string | null}
     */

    get eventMove() {
        return this._events.getElement(INTERACTIVE_EVENT.MOVE);
    }

    set eventMove(value) {
        this.updateInteractiveEvent(INTERACTIVE_EVENT.MOVE, value);
    }

    /**
     * @public
     * @type {string | null}
     */

    get eventDrag() {
        return this._events.getElement(INTERACTIVE_EVENT.DRAG);
    }

    set eventDrag(value) {
        this.updateInteractiveEvent(INTERACTIVE_EVENT.DRAG, value);
    }

    /**
     * @public
     * @type {string | null}
     */

    get eventClick() {
        return this._events.getElement(INTERACTIVE_EVENT.CLICK);
    }

    set eventClick(value) {
        this.updateInteractiveEvent(INTERACTIVE_EVENT.CLICK, value);
    }

    /**
     * @public
     * @type {string | null}
     */

    get eventDragFinish() {
        return this._events.getElement(INTERACTIVE_EVENT.DRAG_FINIS);
    }

    set eventDragFinish(value) {
        this.updateInteractiveEvent(INTERACTIVE_EVENT.DRAG_FINIS, value);
    }

    /**
     * @public
     * @type {string | null}
     */

    get eventDragStart() {
        return this._events.getElement(INTERACTIVE_EVENT.DRAG_START);
    }

    set eventDragStart(value) {
        this.updateInteractiveEvent(INTERACTIVE_EVENT.DRAG_START, value);
    }

    /**
     * @desc Is need to propagate child events. If true interactive events dispatch only for up child.
     * @public
     * @type {boolean}
     */

    get propagateChildrenEvents() {
        return this._propagateChildrenEvent;
    }

    set propagateChildrenEvents(value) {
        if (this._propagateChildrenEvent === value) {
            return;
        }
        this._propagateChildrenEvent = value;
    }

    /**
     * @desc Flag is manager interactive.
     * @public
     * @return {boolean}
     */

    get interactive() {
        return this._interactive;
    }

    set interactive(value) {
        if (this._interactive === value) {
            return;
        }
        this._interactive = value;


        let events, handlers;
        if (Boot.isDesktop()) {
            events = ["pointerdown", "pointerup", "pointerupoutside", "pointerover", "pointerout", "pointermove"];
            handlers = [
                this._onActionDownHandler,
                this._onActionUpHandler,
                this._onActionUpOutsideHandler,
                this._onActionOverHandler,
                this._onActionOutHandler,
                this._onActionMoveHandler,
            ];
        }
        else {
            events = ["pointerdown", "pointerup", "pointerupoutside", "pointermove"];
            handlers = [
                this._onActionDownHandler,
                this._onActionUpHandler,
                this._onActionUpOutsideHandler,
                this._onActionMoveHandler,
            ];
        }
        const listenerCount = events.length;

        let i;
        if (this._interactive) {
            for (i = 0; i < listenerCount; ++i) {
                this.owner.on(events[i], handlers[i], this);
            }
        }
        else {
            for (i = 0; i < listenerCount; ++i) {
                this.owner.off(events[i], handlers[i], this);
            }
        }
    }
}

export default InteractionManager;
