import Repository from "repository/Repository";
import BaseManager from "./BaseManager";
import Type from "util/Type";
import ComUI from "component/ui/ComUI";

/**
 * @desc Class for manage components.
 * @class
 * @extends MANTICORE.manager.BaseManager
 * @memberOf MANTICORE.manager
 */

class ComponentManager extends BaseManager{
    /**
     * @constructor
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} owner
     */
    constructor(owner) {

        super(owner);

        /**
         * @desc Repository with components;
         * @type {MANTICORE.repository.Repository}
         * @private
         */
        this._componentRepo = new Repository();

        /**
         * @desc Array with ui components. Need to dispatch interactions for components without events.
         * @type {MANTICORE.component.ui.ComUI[]}
         * @private
         */

        this._uiComponents = [];

        /**
         * @desc Link to components. Need to dont create array every frame.
         * @type {MANTICORE.component.Component[]}
         * @private
         */
        this._components = this._componentRepo.values;

        /**
         * @desc Component count for don't calculate every frame;
         * @type {int}
         * @private
         */

        this._componentCount = this._components.length;

        /**
         * @desc Flag is currently view in pool or his parent in pool.
         * @type {boolean}
         * @private
         */

        this._inPool = false;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Add component to container, returns falls if component already add.
     * @method
     * @public
     * @param {MANTICORE.component.Component} component
     * @returns {boolean}
     */
    addComponent(component) {
        const result = this._addComponent(component);
        if (result) {
            this._initComponents();
            if (component instanceof ComUI) {
                this._uiComponents.push(component);
            }
        }
        return result;
    }

    /**
     * @desc Add components to container.
     * @method
     * @public
     * @param {MANTICORE.component.Component[]} components
     */

    addComponents(components) {
        const componentCount = components.length;
        let i, component;
        for (i = 0; i < componentCount; ++i) {
            component = components[i];
            if (this._addComponent(component)) {
                this._uiComponents.push(component);
            }
        }
        this._initComponents();
    }

    /**
     * @desc Returns component by name, if it don't attach returns null.
     * @method
     * @public
     * @param {string} name
     * @returns {MANTICORE.component.Component | null}
     */

    getComponent(name) {
        return this._componentRepo.getElement(name);
    }

    /**
     * @desc Remove component from container;
     * @method
     * @public
     * @param {string} name
     * @returns {boolean}
     */

    removeComponent(name) {
        if (!this._componentRepo.hasElement(name)) {
            return false;
        }
        /**
         * @type {MANTICORE.component.Component}
         */
        const component = this._componentRepo.getElement(name);
        component.onRemove();

        const result = this._componentRepo.removeElement(name);

        if (result) {
            const uiComponentCount = this._uiComponents.length;
            for (let i = 0; i < uiComponentCount; ++i) {
                if (this._uiComponents[i].name === name) {
                    this._uiComponents.splice(i, 1);
                    break;
                }
            }
            this._initComponents();
        }

        return result;
    }

    /**
     * @desc Remove all components from target;
     * @method
     * @public
     */

    removeAllComponents() {
        this._uiComponents.length = 0;
        this._iterateComponents(component => component.onRemove());
        this._componentRepo.clear(true);
        this._initComponents();
    }

    /**
     * @desc Calls when destroy owner. DON'T USE IT MANUALLY!!!
     * @method
     * @public
     */

    destroy() {
        this.removeAllComponents();
    }

    update(dt) {
        let isActive = false;
        this._iterateComponents(component => {
            if (!component.active) {
                return;
            }
            isActive = true;
            component.onUpdate(dt);
        });
        this.active = isActive;
    }

    /**
     * @desc Class when update visible of owner.
     * @method
     * @public
     * @param {boolean} visible
     */

    visibleAction(visible) {
        this._iterateComponents(component => {
            if (!component.listenVisible) {
                return;
            }
            component.onVisibleChange(visible);
        });
    }

    /**
     * @desc Method for process children adding.
     * @method
     * @public
     * @param {PIXI.DisplayObject[]} children
     */

    addChildrenAction(children) {
        this._childAction(children, (component, child) => component.onAddChild(child));
    }

    /**
     * @desc Method for process children removing.
     * @method
     * @public
     * @param {PIXI.DisplayObject[]} children
     */

    removeChildrenAction(children) {
        this._childAction(children, (component, child) => component.onRemoveChild(child));
    }

    /**
     * @desc Function for iterate ui components.
     * @method
     * @param {MANTICORE.view.callback.IterateComponent} callback
     * @public
     */

    iterateUIComponents(callback) {
        const componentCount = this._uiComponents.length;

        if (componentCount === 0) {
            return;
        }

        let i, component;

        for (i = 0; i < componentCount; ++i) {
            component = this._uiComponents[i];
            if (!component.listenInteractions) {
                continue;
            }
            callback(component);
        }
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Update components when some children change.
     * @method
     * @private
     * @param {PIXI.DisplayObject[]} children
     * @param {MANTICORE.view.callback.ChildAction} callback
     */

    _childAction(children, callback) {
        if (Type.isNull(children)) {
            return;
        }
        const childCount = children.length;
        let i;
        this._iterateComponents(component => {
            if (!component.listenChildren) {
                return;
            }
            for (i = 0; i < childCount; ++i) {
                callback(component, children[i]);
            }
        });
    }

    /**
     * @desc Iterate components
     * @method
     * @private
     * @param {MANTICORE.view.callback.IterateComponent} callback
     */

    _iterateComponents(callback) {
        for (let i = 0; i < this._componentCount; ++i) {
            callback(this._components[i], i);
        }
    }

    /**
     * @desc add and int component, if component already add return false.
     * @method
     * @private
     * @param {MANTICORE.component.Component} component
     */

    _addComponent(component) {
        const result = this._componentRepo.addElement(component, component.name);
        if (result) {
            component.onAdd(this.owner);
        }
        return result;
    }

    /**
     * @desc Update component array when remove or add components;
     * @method
     * @private
     */

    _initComponents() {
        this._components = this._componentRepo.values;
        this._componentCount = this._components.length;
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {boolean}
     */

    get inPool() {
        return this._inPool;
    }

    set inPool(value) {
        if (this._inPool === value) {
            return;
        }
        this._inPool = value;
        this._iterateComponents(component => component.inPool = value);
    }
}

export default ComponentManager;