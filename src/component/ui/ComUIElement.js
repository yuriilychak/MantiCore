import ComUI from "./ComUI";
import Parser from "ui/parser/index";
import Type from "util/Type";

/**
 * @desc Base Class for create components from bundle.
 * @class
 * @extends mCore.component.ui.ComUI
 * @memberOf mCore.component.ui
 */

class ComUIElement extends ComUI {
    /**
     * @constructor
     * @param {string} elementName - Link to ui element in bundle
     * @param {?string} [bundleName = null] - Name of bundle. If not set search in all bundles.
     * @param {?mCore.view.ComponentContainer} [owner = null] - Owner of component. (Need for clone function.)
     */
    constructor(elementName, bundleName = null, owner = null) {
        super("ComUIElement");
        /**
         * @type {string}
         * @private
         */
        this._elementName = elementName;
        /**
         * @type {?string}
         * @private
         */
        this._bundleName = bundleName;

        if (Type.isNull(owner)) {
            owner = Parser.parseElement(elementName, bundleName);
        }
        owner.componentManager.addComponent(this);
    }

    /**
     * @desc Clone component
     * @method
     * @public
     * @return {mCore.component.ui.ComUIElement}
     */

    clone() {
        return ComUIElement.create(this._elementName, this._bundleName);
    }
}

export default  ComUIElement;
