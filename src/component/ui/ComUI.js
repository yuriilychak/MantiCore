import Component from "component/Component";

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
    }
}

export default ComUI;