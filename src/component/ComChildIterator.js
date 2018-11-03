import Component from "./Component";
import Constant from "constant/index";

/**
 * @desc Component that can iterate children.
 * @class
 * @memberOf MANTICORE.component
 * @extends MANTICORE.component.Component
 */

class ComChildIterator extends Component {
    /**
     * @constructor
     * @param {string} [name = "Component"] - name of component;
     */
    constructor(name = "Component") {
        super(name);
        this.listenChildren = true;
        /**
         * @desc Count of children except collider.
         * @type {int}
         * @private
         */
        this._childCount = 0;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    hasChildren() {
        const children = this.owner.children;
        const childCount = children.length;
        return !(!this.hasOwner() || childCount === 0 || (childCount === 1 && this._isCollider(children[0])));
    }

    /**
     * @method
     * @public
     * @param {MANTICORE.component.callback.IterateChildren} callback
     */

    iterateChildren(callback) {
        if (!this.hasChildren()) {
            return;
        }

        const children = this.owner.children;
        const childCount = children.length;
        let index = 0;
        let child, i;

        for (i = 0; i < childCount; ++i) {
            child = children[i];
            if (this._isCollider(child)) {
                continue;
            }
            callback(child, index, i);
            ++index;
        }
    }

    /**
     * @public
     * @type {int}
     */

    get childCount() {
        return this._childCount;
    }

    /**
     * @desc Callback that calls when component attach to owner. Don't use it manually. Only override.
     * @method
     * @public
     * @param {MANTICORE.view.ComponentContainer} owner
     */

    onAdd (owner) {
        super.onAdd(owner);
        this.iterateChildren(() => ++this._childCount);
    }

    /**
     * @desc Calls when owner add children.
     * @method
     * @public
     * @param {PIXI.DisplayObject} child
     */

    onAddChild(child) {
        if (!this._isCollider(child)) {
            ++this._childCount;
        }
        super.onAddChild(child);
    }

    /**
     * @desc Calls when owner remove children.
     * @method
     * @public
     * @param {PIXI.DisplayObject} child
     */

    onRemoveChild(child) {
        if (!this._isCollider(child)) {
            --this._childCount;
        }
        super.onRemoveChild(child);
    }

    /**
     * @desc Calls by pool when component get from pool (Can be only override). DON'T USE IT MANUALLY!!!
     * @method
     * @public
     * @param {...*} var_args
     */

    reuse(var_args) {
        this.listenChildren = true;
        this._childCount = 0;
        super.reuse();
    }

    /**
     * @desc Calls by pool when component put in to pool (Can be only override). DON'T USE IT MANUALLY!!!
     * @method
     * @public
     */

    disuse() {
        this.listenChildren = false;
        this._childCount = 0;
        super.disuse();
    }

    /**
     * @desc Clone component
     * @method
     * @public
     * @return {MANTICORE.component.ComChildIterator}
     */

    clone() {
        return ComChildIterator.create(this.name);
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns is childe collider.
     * @method
     * @private
     * @param {PIXI.DisplayObject} child
     * @returns {boolean}
     */

    _isCollider(child) {
        return child.name === Constant.COLLIDER_NAME;
    }
}

export default ComChildIterator;