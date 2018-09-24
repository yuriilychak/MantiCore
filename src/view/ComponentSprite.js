import launcher from "launcher/index";
import Asset from "util/Asset";
import UI_ELEMENT from "enumerator/ui/UIElement";
import Type from "util/Type";
import ComponentManager from "manager/ComponentManager";
import ListenerManager from "manager/ListenerManager";
import MemoryManager from "manager/MemoryManager";

/**
 * @desc Class that implements composite pattern for sprite;
 * @class
 * @extends PIXI.Sprite
 * @memberOf MANTICORE.view
 */

class ComponentSprite extends PIXI.Sprite {
    /**
     * @constructor
     * @param {string} frameName - Link to sprite frame.
     */
    constructor(frameName) {
        super(Asset.getSpriteFrame(frameName));

        /**
         * @desc Manager of components.
         * @type {MANTICORE.manager.ComponentManager}
         * @private
         */

        this._componentManager = new ComponentManager(this);

        /**
         * @desc Manager of listeners.
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

        /**
         * @desc Flag is container marked for update;
         * @type {boolean}
         * @private
         */

        this._isUpdate = false;

        /**
         * @type {MANTICORE.enumerator.ui.UI_ELEMENT}
         * @private
         */

        this._uiType = UI_ELEMENT.SPRITE;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @returns {boolean}
     */

    get reusable() {
        return this._memoryManager.reusable;
    }

    /**
     * @public
     * @param {boolean} value
     */

    set reusable(value) {
        this._memoryManager.reusable = value;
    }

    /**
     * @public
     * @returns {boolean}
     */

    get blockEvents() {
        return this._listenerManager.blockEvents;
    }

    /**
     * @public
     * @param {boolean} value
     */

    set blockEvents(value) {
        this._listenerManager.blockEvents = value;
    }

    /**
     * @public
     * @returns {boolean}
     */

    get inPool() {
        return this._memoryManager.inPool;
    }


    /**
     * @public
     * @param {boolean} value
     */

    set inPool(value) {
        if (this._memoryManager.inPool === value) {
            return;
        }
        this._memoryManager.inPool = value;
        this._componentManager.inPool = value;
        const childCount = this.children;
        for (let i = 0; i < childCount; ++i) {
            this.children[i].inPool = value;
        }
    }

    /**
     * @public
     * @returns {MANTICORE.enumerator.ui.UI_ELEMENT}
     */

    get uiType() {
        return this._uiType;
    }

    /**
     * @desc Add component to container, returns falls if component already add.
     * @method
     * @public
     * @param {MANTICORE.component.Component} component
     * @returns {boolean}
     */

    addComponent(component) {
        return this._componentManager.addComponent(component);
    }

    /**
     * @desc Add components to container.
     * @method
     * @public
     * @param {MANTICORE.component.Component[]} components
     */

    addComponents(components) {
        this._componentManager.addComponents(components);
    }

    /**
     * @desc Returns component by name, if it don't attach returns null.
     * @method
     * @public
     * @param {string} name
     * @returns {MANTICORE.component.Component | null}
     */

    getComponent(name) {
        return this._componentManager.getComponent(name);
    }

    /**
     * @desc Remove component from container;
     * @method
     * @public
     * @param {string} name
     * @returns {boolean}
     */

    removeComponent(name) {
        return this._componentManager.removeComponent(name);
    }

    /**
     * @desc Remove all components from target;
     * @method
     * @public
     */

    removeAllComponents() {
        return this._componentManager.removeAllComponents();
    }

    /**
     * @desc Returns is container marked for update.
     * @returns {boolean}
     */

    get isUpdate() {
        return this._isUpdate;
    }

    /**
     * @public
     * @param {boolean} value
     */

    set isUpdate(value) {
        if (this._isUpdate === value) {
            return;
        }

        this._isUpdate = value;

        const app = launcher.getApp();
        const ticker = app.ticker;

        if (this._isUpdate) {
            ticker.add(this.onUpdate, this);
            return;
        }

        ticker.remove(this.onUpdate, this);
    }

    /**
     * @method
     * @public
     * @override
     * @param {...PIXI.DisplayObject} var_args
     * @returns {PIXI.DisplayObject | PIXI.DisplayObject[]}
     */

    addChild(var_args) {
        const argumentCount = arguments.length;
        const result = [];
        for (let i = 0; i < argumentCount; ++i) {
            result.push(super.addChild(arguments[i]));
        }
        this._onChildAction(result, (component, child) => component.onAddChild(child));
        return result.length === 1 ? result[0] : result;
    }

    /**
     * @method
     * @public
     * @override
     * @param  {PIXI.DisplayObject} child
     * @param {int} index
     * @returns {PIXI.DisplayObject}
     */

    addChildAt(child, index) {
        const result = super.addChildAt(child, index);
        this._onChildAction([result], (component, child) => component.onAddChild(child));
        return result;
    }

    /**
     * @method
     * @public
     * @override
     * @param {...PIXI.DisplayObject} var_args
     * @returns {?PIXI.DisplayObject | ?PIXI.DisplayObject[]}
     */

    removeChild(var_args) {
        const argumentCount = arguments.length;
        const result = [];
        for (let i = 0; i < argumentCount; ++i) {
            result.push(super.removeChild(arguments[i]));
        }
        this._onChildAction(result, (component, child) => component.onRemoveChild(child));
        return result.length === 1 ? result[0] : result;
    }

    /**
     * @method
     * @public
     * @override
     * @param {int} index
     * @returns {?PIXI.DisplayObject}
     */

    removeChildAt(index) {
        const result = super.removeChildAt(index);
        this._onChildAction([result], (component, child) => component.onRemoveChild(child));
        return result;
    }

    /**
     * @method
     * @public
     * @override
     * @param {int} [beginIndex = 0]
     * @param {int} [endIndex]
     * @returns {PIXI.DisplayObject[]}
     */

    removeChildren(beginIndex = 0, endIndex = super.children.length) {
        const result = super.removeChildren(beginIndex, endIndex);
        this._onChildAction(result, (component, child) => component.onRemoveChild(child));
        return result;
    }

    /**
     * @desc Calls by pool when view put in to pool. Don't call it only override.
     * @method
     * @public
     */

    disuse() {
        this.isUpdate = false;
        this.parent.removeChild(this);
    }

    /**
     * @desc Removes all internal references and listeners as well as removes children from the display list. DON'T USE IT MANUALLY!!!
     * @method
     * @public
     */

    destroy() {
        this.isUpdate = false;
        this._componentManager.destroy();
        this._listenerManager.destroy();
        this._memoryManager.destroy();
        super.destroy();
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
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

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

    /**
     * @protected
     * @param {MANTICORE.enumerator.ui.UI_ELEMENT} value
     */

    set uiType(value) {
        if (this._uiType === value) {
            return;
        }
        this._uiType = value;
    }

    /**
     * @desc Handler that calls if container mark for update.
     * @method
     * @protected
     * @param {number} dt - Time step of update.
     *
     */

    onUpdate(dt) {
        this._componentManager.iterateComponents(component => {
            if (!component.active) {
                return;
            }
            component.onUpdate(dt);
        });
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Update components when some children remove.
     * @method
     * @private
     * @param {PIXI.DisplayObject[]} children
     * @param {MANTICORE.view.callback.ChildAction} callback
     */

    _onChildAction(children, callback) {
        if (Type.isNull(children)) {
            return;
        }
        const childCount = children.length;
        let i;
        this._componentManager.iterateComponents(component => {
            if (!component.listenChildren) {
                return;
            }
            for (i = 0; i < childCount; ++i) {
                callback(component, children[i]);
            }
        });
    }
}

export default ComponentSprite;