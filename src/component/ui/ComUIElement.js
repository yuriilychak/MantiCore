import ComUI from "./ComUI";
import Parser from "ui/parser/index";
import UI from "util/UI";
import Type from "util/Type";

/**
 * @desc Base Class for create components from bundle.
 * @class
 * @extends MANTICORE.component.ui.ComUI
 * @memberOf MANTICORE.component.ui
 */

class ComUIElement extends ComUI {
    /**
     * @constructor
     * @param {string} elementName - Link to ui element in bundle
     * @param {?string} [bundleName = null] - Name of bundle. If not set search in all bundles.
     */
    constructor(elementName, bundleName = null) {
        super("ComUIElement");
        const owner = Parser.parseElement(elementName, bundleName);
        owner.addComponent(this);
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
}

export default  ComUIElement;