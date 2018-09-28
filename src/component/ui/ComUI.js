import Component from "component/Component";
import UI from "util/UI";
import Type from "util/Type";
import PoolModel from "model/PoolModel";
import Math from "util/Math";
import Format from "util/Format";
import Pool from "pool";

/**
 * @desc Base Class for ui components.
 * @class
 * @extends MANTICORE.component.Component
 * @memberOf MANTICORE.component.ui
 */

class ComUI extends Component {
    /**
     * @constructor
     * @param {string} [name = "Component"] - name of component;
     */
    constructor(name = "Component") {
        super(name);

        /**
         * @desc Flag is component listen interactions.
         * @type {boolean}
         * @private
         */

        this._listenInteractions = false;

        /**
         * @desc Repository that store child events.
         * @type {MANTICORE.component.ui.ComUI.ChildEventModel[]}
         * @private
         */

        this._childEvents = [];
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Log hierarchy for owner or custom widget.
     * @method
     * @public
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} [widget = null]
     */

    logHierarchy(widget = null) {
        UI.logHierarchy(Type.isNull(widget) ? this.owner : widget);
    }

    /**
     * @desc Get child widget from parent or some custom widget.
     * @public
     * @method
     * @param {string} path - Path to widget. For example "wgtLayer=>pnlMain=>pnlMenu=>uie03=>btnNext"
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} [widget = null]
     * @returns {?PIXI.Container | * }
     */

    getChildView(path, widget = null) {
        return UI.getChildView(path, Type.isNull(widget) ? this.owner : widget);
    }

    /**
     * @desc Add Component to child.
     * @method
     * @public
     * @param {MANTICORE.component.Component} component - Component for add to children.
     * @param {string} path - Path to widget. For example "wgtLayer=>pnlMain=>pnlMenu=>uie03=>btnNext"
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} [widget = null]
     * @returns {MANTICORE.component.Component}
     */

    addComponentToChild(component, path, widget = null) {
        const child = this.getChildView(path, widget);

        if (!Type.isNull(child) && child.uiType) {
            child.addComponent(component);
        }

        return component;
    }

    /**
     * @desc Flag is component listen interactions.
     * @public
     * @returns {boolean}
     */

    get listenInteractions() {
        return this._listenInteractions;
    }

    set listenInteractions(value) {
        if (this._listenInteractions === value) {
            return;
        }
        this._listenInteractions = true;
    }

    /**
     * @desc Add Listener to child. If it doesn't exist return false.
     * @method
     * @param {Function} listener - Function to listen child.
     * @param {MANTICORE.enumerator.ui.INTERACTIVE_EVENT} eventType - Event type that need to listen children.
     * @param {string} path - Path to widget. For example "wgtLayer=>pnlMain=>pnlMenu=>uie03=>btnNext"
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} [widget = null]
     * @returns {boolean}
     */

    addChildListener(listener, eventType, path, widget = null) {
        const child = this.getChildView(path, widget);

        if (child === null) {
            return false;
        }

        let isExist = false;

        this._iterateChildEvents(model => {
            if (isExist) {
                return;
            }
            if (model.target === child && model.event === eventType) {
                isExist = true;
            }
        });

        if (isExist) {
            return false;
        }

        const event = Format.generateEventName(this, "CHILD_EVENT");

        child.updateInteractiveEvent(eventType, event);
        this.addEventListener(event, listener);
        this._childEvents.push(Pool.getObject(ChildEventModel, child, eventType));

        return true;
    }

    /**
     * @desc Remove child listener.
     * @method
     * @public
     * @param {MANTICORE.enumerator.ui.INTERACTIVE_EVENT} eventType - Event type that listen children.
     * @param {string} path - Path to widget. For example "wgtLayer=>pnlMain=>pnlMenu=>uie03=>btnNext"
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} [widget = null]
     * @return {boolean}
     */

    removeChildListener(eventType, path,  widget = null) {
        const child = this.getChildView(path, widget);

        if (child === null) {
            return false;
        }

        let modelIndex = -1;

        this._iterateChildEvents((model, index) => {
            if (model.target === child && model.event === eventType) {
                model.kill();
                modelIndex = index;
            }
        });
        if (modelIndex === -1) {
            return false;
        }
        this._childEvents.splice(modelIndex, 1);
        return true;
    }

    /**
     * @desc Remove all child listeners.
     * @method
     * @public
     */

    removeAllChildListeners() {
        this._iterateChildEvents(model => {
            this.removeEventListener(model.getInteractiveEvent(model.event));
            model.kill()
        });
        this._childEvents.length = 0;
    }

    /**
     * @desc Callback when owner up event emitted.
     * @method
     * @public
     * @param {Object} event
     */

    onOwnerUp(event) {}

    /**
     * @desc Callback when owner down event emitted.
     * @method
     * @public
     * @param {Object} event
     */

    onOwnerDown(event) {}

    /**
     * @desc Callback when owner over event emitted.
     * @method
     * @public
     * @param {Object} event
     */

    onOwnerOver(event) {}

    /**
     * @desc Callback when owner out event emitted.
     * @method
     * @public
     * @param {Object} event
     */

    onOwnerOut(event) {}

    /**
     * @desc Callback when owner move event emitted.
     * @method
     * @public
     * @param {Object} event
     */

    onOwnerMove(event) {}

    /**
     * @desc Callback when owner drag start event emitted.
     * @method
     * @public
     * @param {Object} event
     */

    onOwnerDragStart(event) {}

    /**
     * @desc Callback when owner drag finish event emitted.
     * @method
     * @public
     * @param {Object} event
     */

    onOwnerDragFinish(event) {}

    /**
     * @desc Callback when owner drag event emitted.
     * @method
     * @public
     * @param {Object} event
     */

    onOwnerDrag(event) {}

    /**
     * @desc Callback when owner click event emitted.
     * @method
     * @public
     * @param {Object} event
     */

    onOwnerClick(event) {}

    /**
     * @desc Callback that calls when component detach from owner. Don't use it manually. Only override.
     * @method
     * @public
     */

    onRemove() {
        this.removeAllChildListeners();
        super.onRemove();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Iterate child events.
     * @method
     * @param {MANTICORE.component.ui.ComUI.IterateChildEvents} callback
     * @private
     */

    _iterateChildEvents(callback) {
        const eventCount = this._childEvents.length;

        for (let i = 0; i < eventCount; ++i) {
            callback(this._childEvents[i], i);
        }
    }
}

/**
 * @desc Callback for iterate child event models.
 * @callback IterateChildEvents
 * @typedef {Function}
 * @param {MANTICORE.component.ui.ComUI.ChildEventModel} model
 * @param {int} index
 * @private
 * @memberOf MANTICORE.component.ui.ComUI
 */

/**
 * @desc Model for save child events.
 * @class
 * @extends MANTICORE.model.PoolModel
 * @private
 * @memberOf MANTICORE.component.ui.ComUI
 */

class ChildEventModel extends PoolModel {
    /**
     *
     * @param {MANTICORE.view.ComponentSprite | MANTICORE.ui.Widget} target
     * @param {MANTICORE.enumerator.ui.INTERACTIVE_EVENT} event
     */
    constructor(target, event) {
        super(Math.getUniqueId());
        /**
         * @type {MANTICORE.view.ComponentSprite|MANTICORE.ui.Widget}
         * @private
         */
        this._target = target;
        /**
         * @type {MANTICORE.enumerator.ui.INTERACTIVE_EVENT}
         * @private
         */
        this._event = event;

    }

    /**
     * @public
     * @return {MANTICORE.view.ComponentSprite|MANTICORE.ui.Widget}
     */

    get target() {
        return this._target;
    }

    /**
     * @public
     * @return {MANTICORE.enumerator.ui.INTERACTIVE_EVENT}
     */

    get event() {
        return this._event;
    }

    disuse() {
        super.disuse();
        this._target.updateInteractiveEvent(null);
        this._target = null;
        this._event = null;
    }
}

export default ComUI;