import Component from "component/Component";
import UI from "util/UI";
import Type from "util/Type";

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
    }

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
}

export default ComUI;