import Component from "component/Component";
import Format from "util/Format";
import Type from "util/Type";

/**
 * @desc Class for manipulate with items.
 * @class
 * @extends MANTICORE.component.Component
 * @memberOf MANTICORE.component.ui
 */

class ComItemBox extends Component {
    /**
     * @constructor
     * @param {string} templateName - Name template for child names. For example for "item_0001" it's "item_";
     * @param {int} [numCount = 2] - Num count in template name. For example for "item_0001" it's 4;
     * @param {MANTICORE.component.ui.ComItem} templateComponent - Component that add to new elements of ItemBox;
     * @param {boolean} [isNumFromZero = false] - Is numeration of items start from 1 or 0;
     */
    constructor(templateComponent, templateName, numCount = 2, isNumFromZero = false) {
        super("ComItemBox");

        this.listenChildren = true;

        /**
         * @type {string}
         * @private
         */
        this._templateName = templateName;
        /**
         * @type {int}
         * @private
         */
        this._templateNumCount = numCount;

        /**
         * @type {MANTICORE.component.ui.ComItem}
         * @private
         */
        this._componentTemplate = templateComponent;

        /**
         * @type {MANTICORE.component.ui.ComItem[]}
         * @private
         */
        this._items = [];

        /**
         * @desc Flag is numeration of items start from 1 or 0;
         * @type {boolean}
         * @private
         */

        this._isNumFromZero = isNumFromZero;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Flag is numeration of items start from 1 or 0;
     * @public
     * @returns {boolean}
     */

    get numFromZero() {
        return this._isNumFromZero;
    }

    /**
     * @desc Name template for child names. For example for "item_0001" it's "item_"
     * @public
     * @returns {string}
     */

    get templateName() {
        return this._templateName;
    }

    /**
     * @desc Num count in template name. For example for "item_0001" it's 4;
     * @public
     * @returns {int}
     */

    get templateNumCount() {
        return this._templateNumCount;
    }

    /**
     * @desc Component that add to new elements of ItemBox;
     * @public
     * @returns {MANTICORE.component.ui.ComItem}
     */

    get componentTemplate() {
        return this._componentTemplate;
    }

    /**
     * @desc Update item data
     * @method
     * @public
     * @param {*[]} data - Array with data to update.
     */

    updateData(data) {
        const itemCount = this._items.length;
        const dataSize = data.length;
        for (let i = 0; i < itemCount; ++i) {
            this._items[i].updateData(i < dataSize ? data[i] : null)
        }
    }

    /**
     * @desc Return element by index if it exist.
     * @method
     * @public
     * @param {int} index
     * @returns {MANTICORE.component.ui.ComItem | null}
     */

    getElement(index) {
        return index < this._items.length ? this._items[index] : null;
    }

    /**
     * @desc Update element data. And return true if update successfully.
     * @method
     * @public
     * @param {int} index
     * @param {*} data
     * @returns {boolean}
     */

    updateElementData(index, data) {
        const element = this.getElement(index);

        if (Type.isNull(element)) {
            return false;
        }

        element.updateData(data);
        return true;
    }

    /**
     * @desc Add component to item and add it to queue.
     * @method
     * @public
     * @param {MANTICORE.view.ComponentContainer} child
     */

    addItem(child) {
        const component = new this._componentTemplate();
        if (!child.addComponent(component)) {
            return;
        }
        this._items.push(component);
        child.name = this._getItemName(this._items.length - (this._isNumFromZero ? 0 : 1));
        this.owner.addChild(child);
    }

    onAdd(owner) {
        super.onAdd(owner);

        let index = this._isNumFromZero ? 0 : 1;
        /**
         * @type {MANTICORE.view.ComponentContainer}
         */
        let child = owner;
        let name, component;

        while(child !== null) {
            name = this._getItemName(index);
            child = owner.getChildByName(name);
            if (child === null) {
                break;
            }
            component = new this._componentTemplate();
            if (child.addComponent(component)) {
                this._items.push(component);
            }
            ++index;
        }
    }

    onRemove() {
        super.onRemove();
        this._items.length = 0;
    }

    /**
     * @desc Calls when owner remove children.
     * @method
     * @public
     * @param {PIXI.DisplayObject} child
     */

    onRemoveChild(child) {
        super.onRemoveChild(child);
        const name = child.name;

        if (!name || name.indexOf(this._templateName) !== 0) {
            return;
        }

        const itemCount = this._items.length;
        let index = -1;
        let i, item, owner;

        for (i = 0; i < itemCount; ++i) {
            item = this._items[i];
            owner = item.owner;

            if (!item.owner) {
                continue;
            }

            if (index !== -1) {
                owner.name = this._getItemName(i - 1);
                continue;
            }
            if (owner.name === name) {
                index = i;
            }
        }

        if (index === -1) {
            return;
        }

        this._items.splice(index, 1);
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns item name by index.
     * @method
     * @param {int} index
     * @returns {string}
     */

    _getItemName(index) {
        return this._templateName + Format.formatNumber(index, this._templateNumCount);
    }
}

export default ComItemBox;