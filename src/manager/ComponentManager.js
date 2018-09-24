import Repository from "repository/Repository";
import BaseManager from "./BaseManager";

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
        this.iterateComponents(component => component.inPool = value);
    }

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
        for (let i = 0; i < componentCount; ++i) {
            this._addComponent(components[i]);
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
        this.iterateComponents(component => component.onRemove());
        this._componentRepo.clear();
        this._initComponents();
    }

    /**
     * @desc Iterate components
     * @method
     * @public
     * @param {MANTICORE.view.callback.IterateComponent} callback
     */

    iterateComponents(callback) {
        for (let i = 0; i < this._componentCount; ++i) {
            callback(this._components[i], i);
        }
    }

    /**
     * @desc Calls when destroy owner. DON'T USE IT MANUALLY!!!
     * @method
     * @public
     */

    destroy() {
        this.removeAllComponents();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

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
}

export default ComponentManager;