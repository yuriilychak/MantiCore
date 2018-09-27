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

        /**
         * @desc Flag is component listen interactions.
         * @type {boolean}
         * @private
         */

        this._listenInteractions = false;
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