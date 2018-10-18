import ComUI from "./ComUI";
import Parser from "ui/parser/index";
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
     * @param {/MANTICORE.view.ComponentContainer} [owner = null] - Owner of component. (Need for clone function.)
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
        owner.addComponent(this);
    }

    /**
     * @desc Clone component
     * @method
     * @public
     * @return {MANTICORE.component.ui.ComUIElement}
     */

    clone() {
        return ComUIElement.cloneFromPool(this._elementName, this._bundleName);
    }
}

export default  ComUIElement;