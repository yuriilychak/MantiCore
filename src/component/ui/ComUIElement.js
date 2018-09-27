import ComUI from "./ComUI";
import Parser from "ui/parser/index";

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
}

export default  ComUIElement;