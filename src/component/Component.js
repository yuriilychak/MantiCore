import ListenerManager from "manager/ListenerManager";
import MemoryManager from "manager/MemoryManager";
import Pool from "pool";

/**
 * @desc Base class of all components;
 * @class
 * @memberOf MANTICORE.component
 */

class Component {

    /**
     * @constructor
     * @param {string} [name = "Component"] - name of component;
     */

    constructor(name = "Component") {
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
         * @type {MANTICORE.manager.ListenerManager}
         * @private
         */

        this._listenerManager = new ListenerManager(this);

        /**
         * @desc Class for manipulate with memory.
         * @type {MANTICORE.manager.MemoryManager}
         * @private
         */

        this._memoryManager = new MemoryManager(this);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {boolean}
     */

    get reusable() {
        return this._memoryManager.reusable;
    }

    set reusable(value) {
        this._memoryManager.reusable = value;
    }

    /**
     * @public
     * @type {boolean}
     */

    get blockEvents() {
        return this._listenerManager.blockEvents;
    }

    set blockEvents(value) {
        this._listenerManager.blockEvents = value;
    }

    /**
     * @public
     * @type {boolean}
     */

    get inPool() {
        return this._memoryManager.inPool;
    }

    set inPool(value) {
        this._memoryManager.inPool = value;
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
     * @desc Calls by pool when component get from pool (Can be only override). DON'T USE IT MANUALLY!!!
     * @method
     * @public
     * @param {...*} var_args
     */

    reuse(var_args) {}

    /**
     * @desc Calls by pool when component put in to pool (Can be only override). DON'T USE IT MANUALLY!!!
     * @method
     * @public
     */

    disuse() {
        this._listenerManager.removeAllEventListeners();
    }

    /**
     * @desc Calls by memory manager when object kill (Can be only override). DON'T USE IT MANUALLY!!!
     * @method
     * @public
     */

    destroy() {
        this._listenerManager.destroy();
        this._memoryManager.destroy();
    }

    /**
     * @desc Call for destroy object. If it reusable put in pool.
     * @method
     * @public
     */

    kill() {
        this._memoryManager.kill();
    }

    /**
     * @desc Clone component
     * @method
     * @public
     * @return {MANTICORE.component.Component}
     */

    clone() {
        return Component.cloneFromPool(Component);
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls for create clone of element. Need to don't import pool in children.
     * @method
     * @protected
     * @static
     * @param {...*} var_args
     * @return {*}
     */

    static cloneFromPool(var_args) {
        return Pool.getObject.apply(Pool, arguments);
    }

    /**
     * @desc Add event listener for element.
     * @method
     * @protected
     * @param {string} event
     * @param {Function} handler
     */

    addEventListener(event, handler) {
        this._listenerManager.addEventListener(event, handler);
    }

    /**
     * @desc Remove event listener.
     * @method
     * @protected
     * @param {string} event
     */

    removeEventListener(event) {
        this._listenerManager.removeEventListener(event);
    }

    /**
     * @desc Dispatch event.
     * @method
     * @protected
     * @param {string} event
     * @param {*} [data = null]
     */

    dispatchEvent(event, data = null) {
        this._listenerManager.dispatchEvent(event, data);
    }
}

export default Component;