import ComponentContainer from "view/ComponentContainer";
import Type from "util/Type";
import Math from "util/Math";
import INTERACTIVE_EVENT from "enumerator/ui/InteractiveEvent";
import Repository from "repository/Repository";
import Slice9Sprite from "view/Slice9Sprite";
import Asset from "util/Asset";
import UI_ELEMENT from "enumerator/ui/UIElement";
import Constant from "constant/index";
import Geometry from "util/Geometry";
import ComUI from "component/ui/ComUI"

/**
 * @desc Base component for all UI elements.
 * @class
 * @memberOf MANTICORE.ui
 * @extends MANTICORE.view.ComponentContainer
 */

class Widget extends ComponentContainer {

    /**
     * @constructor
     * @param {PIXI.Sprite | MANTICORE.view.Slice9Sprite} [collider]
     */

    constructor(collider = Asset.createWhiteSprite()) {
        super();

        /**
         * @desc Collider of widget.
         * @type {PIXI.Sprite | MANTICORE.view.Slice9Sprite}
         * @private
         */
        this._collider = collider;

        /**
         * @desc anchor point of widget.
         * @type {PIXI.ObservablePoint}
         * @private
         */
        this._anchor = new PIXI.ObservablePoint(this._onAnchorPointUpdate, this);

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
         * @desc Array with ui components. Need to dispatch interactions for components without events.
         * @type {MANTICORE.component.ui.ComUI[]}
         * @private
         */

        this._uiComponents = [];

        /**
         * @type {MANTICORE.repository.Repository}
         * @private
         */

        this._events = new Repository();

        /**
         * @desc Clipping mask.
         * @type {?PIXI.Sprite}
         * @private
         */

        this._clippingMask = null;

        /**
         * @desc Flag is need to propagate evens for children to dispatch for target.
         * @type {boolean}
         * @private
         */

        this._propagateChildrenEvent = false;

        if (this._collider instanceof PIXI.Sprite) {
            this._collider.width = 100;
            this._collider.height = 100;
            this._collider.renderable = false;
        }

        super.addChild(this._collider);

        const events = ["pointerdown", "pointerup", "pointerupoutside", "pointerover", "pointerout", "pointermove"];
        const handlers = [
            this.onActionDownHandler,
            this.onActionUpHandler,
            this.onActionUpOutsideHandler,
            this.onActionOverHandler,
            this.onActionOutHandler,
            this.onActionMoveHandler,
        ];
        const listenerCount = events.length;

        for (let i = 0; i < listenerCount; ++i) {
            this.on(events[i], handlers[i].bind(this));
        }

        this.uiType = UI_ELEMENT.WIDGET;

        this._collider.name = Constant.COLLIDER_NAME;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Set slice of colider if it slice9 sprite.
     * @method
     * @public
     * @param {int} leftSlice
     * @param {int} rightSlice
     * @param {int} topSlice
     * @param {int} bottomSlice
     */

    setSlice(leftSlice = 0, rightSlice = 0, topSlice = 0, bottomSlice = 0) {
        if (!(this._collider instanceof  Slice9Sprite)) {
            return;
        }
        this._collider.slice = [leftSlice, rightSlice, topSlice, bottomSlice];
    }

    /**
     * @desc Returns interactive event.
     * @method
     * @public
     * @param {MANTICORE.enumerator.ui.INTERACTIVE_EVENT} id
     * @returns {string}
     */

    getInteractiveEvent(id) {
        return this._events.getElement(id);
    }

    /**
     * @desc Add or remove event from repository. DON'T USE IT MANUALLY!!!
     * @method
     * @public
     * @param {MANTICORE.enumerator.ui.INTERACTIVE_EVENT} id
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
     * @desc Add component to container, returns falls if component already add.
     * @method
     * @public
     * @param {MANTICORE.component.Component} component
     * @returns {boolean}
     */

    addComponent(component) {
        const result = super.addComponent(component);

        if (result && component instanceof ComUI) {
            this._uiComponents.push(component);
        }

        return result;
    }

    /**
     * @desc Add components to container.
     * @method
     * @public
     * @param {MANTICORE.component.Component[]} components
     */

    addComponents(components) {
        const componentCount = components.length;
        for (let i = 0; i < componentCount; ++i) {
            if (components[i] instanceof ComUI) {
                this._uiComponents.push(components[i]);
            }
        }
        return super.addComponents(components);
    }

    /**
     * @desc Remove component from container;
     * @method
     * @public
     * @param {string} name
     * @returns {boolean}
     */

    removeComponent(name) {
        const uiComponentCount = this._uiComponents.length;
        for (let i = 0; i < uiComponentCount; ++i) {
            if (this._uiComponents[i].name === name) {
                this._uiComponents.splice(i, 1);
                break;
            }
        }
        return super.removeComponent(name);
    }

    /**
     * @desc Remove all components from target;
     * @method
     * @public
     */

    removeAllComponents() {
        this._uiComponents.length = 0;
        return super.removeAllComponents();
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @protected
     * @param {Object} event
     * @returns {boolean}
     */

    onActionUpHandler(event) {
        if (!this._isInteractiveDown) {
            return false;
        }
        this._iterateUIComponents(component => component.onOwnerUp(event));
        this._dispatchInteractiveEvent(INTERACTIVE_EVENT.UP, event);
        if (this._isInteractiveDrag) {
            this.onActionDragFinishHandler(event);
        }
        else {
            this.onActionClickHandler(event);
        }
        this._isInteractiveDown = false;
        this._isInteractiveDrag = false;
        return true;
    }

    /**
     * @method
     * @protected
     * @param {Object} event
     * @returns {boolean}
     */

    onActionDownHandler(event) {
        if (this._haveInteractiveChildrenAt(this, event.data.global)) {
            return false;
        }
        this._isInteractiveDown = true;
        this._iterateUIComponents(component => component.onOwnerDown(event));
        this._dispatchInteractiveEvent(INTERACTIVE_EVENT.DOWN, event);
        return true;
    }

    /**
     * @method
     * @protected
     * @param {Object} event
     */

    onActionOverHandler(event) {
        this._isInteractiveOver = true;
        this._iterateUIComponents(component => component.onOwnerOver(event));
        this._dispatchInteractiveEvent(INTERACTIVE_EVENT.OVER, event);
    }

    /**
     * @method
     * @protected
     * @param {Object} event
     */

    onActionOutHandler(event) {
        this._isInteractiveOver = false;
        this._iterateUIComponents(component => component.onOwnerOut(event));
        this._dispatchInteractiveEvent(INTERACTIVE_EVENT.OUT, event);
    }

    /**
     * @method
     * @protected
     * @param {Object} event
     * @returns {boolean}
     */

    onActionUpOutsideHandler(event) {
        if (!this._isInteractiveDown) {
            return false;
        }
        this._iterateUIComponents(component => component.onOwnerUp(event));
        this._dispatchInteractiveEvent(INTERACTIVE_EVENT.UP, event);
        if (this._isInteractiveDrag) {
            this.onActionDragFinishHandler(event);
        }
        else {
            this.onActionClickHandler(event);
        }
        this._isInteractiveDown = false;
        this._isInteractiveDrag = false;
        return true;
    }

    /**
     * @method
     * @protected
     * @param {Object} event
     * @returns {boolean}
     */

    onActionMoveHandler(event) {
        if (!this._isInteractiveDown && !this._isInteractiveOver || this._haveInteractiveChildrenAt(this, event.data.global)) {
            return false;
        }
        if (this._isInteractiveDown && !this._isInteractiveDrag) {
                this._isInteractiveDrag = true;
                this.onActionDragStartHandler(event);
        }

        if (this._isInteractiveDown) {
            this._iterateUIComponents(component => component.onOwnerDrag(event));
            this._dispatchInteractiveEvent(INTERACTIVE_EVENT.DRAG, event);
        }
        else {
            this._iterateUIComponents(component => component.onOwnerMove(event));
            this._dispatchInteractiveEvent(INTERACTIVE_EVENT.MOVE, event);
        }

        return true;
    }

    /**
     * @method
     * @protected
     * @param {Object} event
     */

    onActionClickHandler(event) {
        this._iterateUIComponents(component => component.onOwnerClick(event));
        this._dispatchInteractiveEvent(INTERACTIVE_EVENT.CLICK, event);

    }

    /**
     * @method
     * @protected
     * @param {Object} event
     */

    onActionDragStartHandler(event) {
        this._iterateUIComponents(component => component.onOwnerDragStart(event));
        this._dispatchInteractiveEvent(INTERACTIVE_EVENT.DRAG_START, event);
    }

    /**
     * @method
     * @protected
     * @param {Object} event
     */

    onActionDragFinishHandler(event) {
        this._iterateUIComponents(component => component.onOwnerDragFinish(event));
        this._dispatchInteractiveEvent(INTERACTIVE_EVENT.DRAG_FINIS, event);
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Function for iterate ui components.
     * @method
     * @param {MANTICORE.view.callback.IterateComponent} callback
     * @private
     */

    _iterateUIComponents(callback) {
        const componentCount = this._uiComponents.length;
        let i, component;

        for (i = 0; i < componentCount; ++i) {
            component = this._uiComponents[i];
            if (!component.listenInteractions) {
                continue;
            }
            callback(component);
        }
    }

    /**
     * @desc Is currently widget clipped.
     * @returns {boolean}
     * @private
     */

    _isClipped() {
        return !Type.isNull(this._clippingMask);
    }

    /**
     * @param {Object} target
     * @param {PIXI.Point} point
     * @private
     */

    _haveInteractiveChildrenAt(target, point) {

        if (this._propagateChildrenEvent) {
            return false;
        }

        const childrenCount = target.children.length;
        let i, child, pos;

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
     * @desc Calls when anchor point change.
     * @method
     * @private
     */

    _onAnchorPointUpdate() {
        this.pivot.copy(Geometry.pCompMult(
            Geometry.pFromSize(this._collider),
            this._anchor,
            true
        ));
    }

    /**
     * @method
     * @private
     * @param {MANTICORE.enumerator.ui.INTERACTIVE_EVENT} id
     * @param {Object} interactiveEvent
     */

    _dispatchInteractiveEvent(id, interactiveEvent) {
        if (!this.interactive || !this._events.hasElement(id)) {
            return;
        }

        const event = this._events.getElement(id);
        
        this.dispatchEvent(event, interactiveEvent);
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Flag is use clipping mask for element.
     * @public
     * @type {boolean}
     */

    get clipping() {
        return this._isClipped();
    }

    set clipping(value) {
        if (this._isClipped() === value) {
            return;
        }

        if (value) {
            this._clippingMask = Asset.createWhiteSprite();
            this._clippingMask.width = this._collider.width;
            this._clippingMask.height = this._collider.height;
        }
        else {
            super.removeChild(this._clippingMask);
            this._clippingMask = null;
        }

        const childrenCount = this.children.length;
        for (let i = 0; i < childrenCount; ++i) {
            if (this.children[i] === this._collider) {
                continue;
            }
            this.children[i].mask = this._clippingMask;
        }

        if (!this._isClipped()) {
            return;
        }

        super.addChild(this._clippingMask);
    }

    /**
     * @public
     * @type {int}
     */

    get width() {
        return this._collider.width;
    }

    set width(value) {
        value = Math.round(value);
        if (this._collider.width === value) {
            return;
        }
        this.pivot.x = Math.round(value * this._anchor.x);
        this._collider.width = value;
        if (this._isClipped()) {
            this._clippingMask.width = value;
        }
    }

    /**
     * @public
     * @type {int}
     */

    get height() {
        return this._collider.height;
    }

    set height(value) {
        value = Math.round(value);
        if (this._collider.height === value) {
            return;
        }

        this._collider.height = value;
        this.pivot.y = Math.round(value * this._anchor.y);
        if (this._isClipped()) {
            this._clippingMask.height = value;
        }
    }

    /**
     * @public
     * @type {int}
     */

    get tint() {
        return this._collider.tint;
    }

    set tint(value) {
        if (this._collider.tint === value) {
            return;
        }

        const children = this.children;
        const childrenCount = children.length;
        let child, i;

        for (i = 0; i < childrenCount; ++i) {
            child = children[i];

            if (Type.isUndefined(child.tint)) {
                continue;
            }

            child.tint = value;
        }
    }

    /**
     * @public
     * @type {PIXI.ObservablePoint}
     */

    get anchor() {
        return this._anchor;
    }

    set anchor(value) {
        this._anchor.copy(value);
    }

    /**
     * @desc Flag is element flip horizontal
     * @public
     * @type {boolean}
     */

    get flipX() {
        return this.scale.x < 0;
    }

    set flipX(value) {
        if (this.flipX === value) {
            return;
        }

        this.scale.x = this.scale.x * -1;
    }

    /**
     * @desc Flag is element flip vertical
     * @public
     * @type {boolean}
     */

    get flipY() {
        return this.scale.y < 0;
    }

    set flipY(value) {
        if (this.flipY === value) {
            return;
        }

        this.scale.y = this.scale.y * -1;
    }

    /**
     * @desc Flag is currently ui element in drag mode.
     * @public
     * @readonly
     * @type {boolean}
     */

    get isDrag() {
        return this._isInteractiveDrag;
    }

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
     * @desc Returns collider.
     * @protected
     * @type {PIXI.Sprite|MANTICORE.view.Slice9Sprite|MANTICORE.ui.ancillary.StateSlice9Sprite}
     */

    get collider() {
        return this._collider;
    }

    set collider(value) {
        if (this._collider === value) {
            return;
        }

        if (!Type.isNull(this._collider)) {
            value.tint = this._collider.tint;
            super.removeChild(this._collider);
        }

        this._collider = value;
        this._collider.name = Constant.COLLIDER_NAME;

        super.addChild(this._collider);
    }
}

export default Widget;