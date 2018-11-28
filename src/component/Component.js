import ListenerManager from "manager/ListenerManager";
import ReusableObject from "memory/ReusableObject";

/**
 * @desc Base class of all components;
 * @class
 * @memberOf MANTICORE.component
 * @extends MANTICORE.memory.ReusableObject
 */

class Component extends ReusableObject {

    /**
     * @constructor
     * @param {string} [name = "Component"] - name of component;
     */

    constructor(name = "Component") {
        super();
        /**
         * @desc Name of component;
         * @type {string}
         * @private
         */
        this._name = name;

        /**
         * @type {?MANTICORE.view.ComponentContainer}
         * @private
         */

        this._owner = null;

        /**
         * @desc Is component need to update every frame
         * @type {boolean}
         * @private
         */

        this._isActive = true;

        /**
         * @desc Flag is need to call callbacks for add child and remove child.
         * @type {boolean}
         * @private
         */

        this._listenChildren = false;

        /**
         * @desc Flag is need to call callback when owner change visible;
         * @type {boolean}
         * @private
         */

        this._listenVisible = false;

        /**
         * @desc Storage of listeners.
         * @type {?MANTICORE.manager.ListenerManager}
         * @private
         */

        this._listenerManager = null;

        /**
         * @desc Flag is listener manager init.
         * @type {boolean}
         * @private
         */

        this._hasListenerManager = false;

        /**
         * @desc Flag is need to block event dispatch.
         * @type {boolean}
         * @private
         */

        this._blockEvents = false;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns is component has owner;
     * @method
     * @public
     * @returns {boolean}
     */

    hasOwner() {
        return this._owner !== null;
    }

    /**
     * @desc Callback that calls when component attach to owner. Don't use it manually. Only override.
     * @method
     * @public
     * @param {MANTICORE.view.ComponentContainer} owner
     */

    onAdd (owner) {
        this._owner = owner;
    }

    /**
     * @desc Callback that calls when component detach from owner. Don't use it manually. Only override.
     * @method
     * @public
     */

    onRemove () {
        this._owner = null;
        this.kill();
    }

    /**
     * @desc Callback that calls when owner update;
     * @method
     * @public
     * @param {number} dt - Time step on update;
     */

    onUpdate (dt) {}

    /**
     * @desc Calls when owner add children.
     * @method
     * @public
     * @param {PIXI.DisplayObject} child
     */

    onAddChild(child) {}

    /**
     * @desc Calls when owner remove children.
     * @method
     * @public
     * @param {PIXI.DisplayObject} child
     */

    onRemoveChild(child) {}

    /**
     * @desc Calls when owner change visible.
     * @method
     * @public
     * @param {boolean} visible
     */

    onVisibleChange(visible) {}

    /**
     * @desc Clone component
     * @method
     * @public
     * @return {MANTICORE.component.Component}
     */

    clone() {
        return Component.create(this._name);
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
        if (this._hasListenerManager) {
            this._listenerManager.kill();
            this._listenerManager = null;
            this._hasListenerManager = false;
        }
        super.clearData();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Flag is need to block events dispatching for view.
     * @public
     * @type {boolean}
     */

    get blockEvents() {
        return this._blockEvents || (this._hasListenerManager && this._listenerManager.blockEvents);
    }

    set blockEvents(value) {
        if (this._blockEvents === value) {
            return;
        }
        this._blockEvents = value;
        if (!this._hasListenerManager) {
            return;
        }
        this._listenerManager.blockEvents = value;
    }

    /**
     * @desc Returns name of component
     * @type {string}
     */

    get name () {
        return this._name;
    }

    /**
     * @desc Return owner of component if it exist;
     * @type {MANTICORE.view.ComponentContainer | null}
     */

    get owner () {
        return this._owner;
    }

    /**
     * @public
     * @type {boolean}
     */

    get active () {
        return this._isActive;
    }

    set active (value) {
        if (this._isActive === value) {
            return;
        }
        this._isActive = value;
    }

    /**
     * @desc Flag is need to call callbacks for add child and remove child.
     * @public
     * @type {boolean}
     */

    get listenChildren() {
        return this._listenChildren;
    }

    set listenChildren(value) {
        if (this._listenChildren === value) {
            return;
        }
        this._listenChildren = value;
    }

    /**
     * @desc Flag is need to call callback when owner change visible.
     * @public
     * @type {boolean}
     */

    get listenVisible() {
        return this._listenVisible;
    }

    set listenVisible(value) {
        if (this._listenVisible === value) {
            return;
        }
        this._listenVisible = value;
    }

    /**
     * @desc Link to listener manager.
     * @public
     * @return {MANTICORE.manager.ListenerManager}
     */

    get listenerManager() {
        if (!this._hasListenerManager) {
            this._hasListenerManager = true;
            this._listenerManager = ListenerManager.create(this);
            this._listenerManager.blockEvents = this._blockEvents;
        }
        return this._listenerManager;
    }

    /**
     * @desc Flag is view has listener manager.
     * @public
     * @return {boolean}
     */

    get hasListenerManager() {
        return this._hasListenerManager;
    }
}

export default Component;