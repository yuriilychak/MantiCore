import Component from "component/Component";
import UI from "util/UI";
import Type from "util/Type";
import Model from "model/Model";
import Format from "util/Format";
import UI_ELEMENT from "enumerator/ui/UIElement";
import LocalizationCache from "cache/LocalizationCache";

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
     * @param {number} [maxLevel = -1] - Max level of log hierarchy
     */

    logHierarchy(widget = null, maxLevel = -1) {
        UI.logHierarchy(Type.isNull(widget) ? this.owner : widget, maxLevel);
    }

    /**
     * @desc Log labels and buttons that don't localized for owner or custom widget.
     * @function
     * @public
     * @memberOf MANTICORE.util.ui
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} widget
     */

    logUnlocalizedFields(widget = null) {
        UI.logUnlocalizedFields(Type.isNull(widget) ? this.owner : widget);
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
     * @desc Set text of label or button.
     * @public
     * @param {*} text - Text to set.
     * @param {string} path - Path to widget. For example "wgtLayer=>pnlMain=>pnlMenu=>uie03=>btnNext"
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} [widget = null]
     * @returns {boolean}
     */

    setChildText(text, path, widget = null) {
        if (Type.isEmpty(text)) {
            return false;
        }

        if (!Type.isString(text)) {
            text = text.toString();
        }

        const child = this.getChildView(path, widget);
        if (Type.isNull(child) || !child.uiType) {
            return false
        }

        switch (child.uiType) {
            case UI_ELEMENT.LABEL:
            case UI_ELEMENT.ATLAS_LABEL:
            case UI_ELEMENT.TEXT_FIELD: {
                child.text = text;
                return true;
            }
            case UI_ELEMENT.BUTTON:
            case UI_ELEMENT.TOGGLE_BUTTON:
            case UI_ELEMENT.CHECK_BOX: {
                if (!child.hasTitle()) {
                    return false;
                }
                child.titleText = text;
                return true;
            }
            default: {
                return false;
            }
        }
    }

    /**
     * @desc Set locale of label or button.
     * @public
     * @param {string} key - Key in localization.
     * @param {string} path - Path to widget. For example "wgtLayer=>pnlMain=>pnlMenu=>uie03=>btnNext"
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} [widget = null]
     * @returns {boolean}
     */

    localize(key, path, widget = null) {
        let locale = LocalizationCache.getLocale(key);
        const argumentCount = arguments.length;
        if (arguments.length > 3) {
            const values = [];
            for (let i = 3; i < argumentCount; ++i) {
                values.push(arguments[i]);
            }
            locale = Format.replace(locale, ...values);
        }
        return this.setChildText(locale, path, widget);
    }

    /**
     * @desc Add Component to child.
     * @method
     * @public
     * @param {MANTICORE.component.Component} component - Component for add to children.
     * @param {?string} [path = null] - Path to widget. For example "wgtLayer=>pnlMain=>pnlMenu=>uie03=>btnNext"
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} [widget = null]
     * @returns {MANTICORE.component.Component}
     */

    addComponentToChild(component, path = null, widget = null) {
        const child = Type.isNull(path) ? this.owner : this.getChildView(path, widget);

        if (!Type.isNull(child) && child.uiType) {
            child.componentManager.addComponent(component);
        }

        return component;
    }

    /**
     * @desc Add Listener to child. If it doesn't exist return false.
     * @method
     * @public
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

        child.interactionManager.updateInteractiveEvent(eventType, event);
        this.listenerManager.addEventListener(event, listener);
        this._childEvents.push(ChildEventModel.create(child, eventType));

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
            this.listenerManager.removeEventListener(model.interactiveEvent);
            model.kill();
        });
        this._childEvents.length = 0;
    }

    /**
     * @desc Calls when interactive manager of owner emit event.
     * @method
     * @public
     * @param {MANTICORE.enumerator.ui.INTERACTIVE_EVENT} eventType
     * @param {Object} event
     */

    emitInteractiveEvent(eventType, event) {}

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
     * @desc Clone component
     * @method
     * @public
     * @return {MANTICORE.component.ui.ComChildListener}
     */

    clone() {
        return ComUI.create(this.name);
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

    /**
     * PROTECTED
     * -----------------------------------------------------------------------------------------------------------------
     */

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
        this._listenInteractions = value;
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
 * @extends MANTICORE.model.Model
 * @private
 * @memberOf MANTICORE.component.ui.ComUI
 */

class ChildEventModel extends Model {
    /**
     * @constructor
     * @param {MANTICORE.view.ComponentSprite | MANTICORE.ui.Widget} target
     * @param {MANTICORE.enumerator.ui.INTERACTIVE_EVENT} event
     */

    constructor(target, event) {
        super();
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
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {MANTICORE.view.ComponentSprite | MANTICORE.ui.Widget} target
     * @param {MANTICORE.enumerator.ui.INTERACTIVE_EVENT} event
     */

    reuse(target, event) {
        super.reuse();
        this._target = target;
        this._event = event;
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
        this._target.interactionManager.updateInteractiveEvent(null);
        this._target = null;
        this._event = null;
        super.clearData();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @returns {string}
     */

    get interactiveEvent() {
        return this.target.interactionManager.getInteractiveEvent(this._event);
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
}

export default ComUI;