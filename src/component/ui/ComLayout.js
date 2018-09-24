import VERTICAL_ALIGN from "enumerator/ui/VerticalAlign";
import HORIZONTAL_ALIGN from "enumerator/ui/HorizontalAlign";
import Geometry from "util/Geometry";
import LayoutSizeManager from "manager/LayoutSizeManager";
import ComChildIterator from "component/ComChildIterator";
import LayoutBuilder from "builder/LayoutBuilder";

/**
 * @desc Component for align children in container.
 * @class
 * @extends MANTICORE.component.ComChildIterator
 * @memberOf MANTICORE.component.ui
 */

class ComLayout extends ComChildIterator {
    /**
     * @constructor
     */
    constructor() {
        super("ComLayout");

        /**
         * @desc Manager for manipulate with owner size.
         * @type {MANTICORE.manager.LayoutSizeManager}
         * @private
         */

        this._layoutSizeManager = new LayoutSizeManager(this);

        /**
         * @desc Vertical align of elements.
         * @type {MANTICORE.enumerator.ui.VERTICAL_ALIGN}
         * @private
         */

        this._verticalAlign = VERTICAL_ALIGN.TOP;

        /**
         * @desc Horizontal align of elements.
         * @type {MANTICORE.enumerator.ui.HORIZONTAL_ALIGN}
         * @private
         */

        this._horizontalAlign = HORIZONTAL_ALIGN.LEFT;

        /**
         * @desc Flag is need to scale items if width or height fixed.
         * @type {boolean}
         * @private
         */

        this._resizeItems = true;

        /**
         * @desc Inner padding between items.
         * @type {PIXI.ObservablePoint | ObservablePoint}
         * @private
         */

        this._innerPadding = new PIXI.ObservablePoint(this._onInnerPaddingChangeHandler, this);

        /**
         * @desc Outer padding in owner.
         * @type {PIXI.ObservablePoint | ObservablePoint}
         * @private
         */

        this._outerPadding = new PIXI.ObservablePoint(this._onOuterPaddingChangeHandler, this);

        this.listenChildren = true;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @returns {boolean}
     */

    get resizeItems() {
        return this._resizeItems;
    }

    /**
     * @public
     * @param {boolean} value
     */

    set resizeItems(value) {
        if (this._resizeItems === value) {
            return;
        }
        this._resizeItems = value;

        this._refreshLayout();
    }

    /**
     * @public
     * @returns {boolean}
     */

    get staticWidth() {
        return this._layoutSizeManager.staticWidth;
    }

    /**
     * @public
     * @param {boolean} value
     */

    set staticWidth(value) {
        this._layoutSizeManager.staticWidth = value;
    }

    /**
     * @public
     * @returns {boolean}
     */

    get staticHeight() {
        return this._layoutSizeManager.staticHeight;
    }

    /**
     * @public
     * @param {boolean} value
     */

    set staticHeight(value) {
        this._layoutSizeManager.staticHeight = value;
    }

    /**
     * @public
     * @returns {int}
     */

    get minWidth() {
       return this._layoutSizeManager.minWidth;
    }

    /**
     * @public
     * @param {int} value
     */

    set minWidth(value) {
        this._changeSizeValue(value, "minWidth");
    }

    /**
     * @public
     * @returns {int}
     */

    get maxWidth() {
        return this._layoutSizeManager.maxWidth;
    }

    /**
     * @public
     * @param {int} value
     */

    set maxWidth(value) {
        this._changeSizeValue(value, "maxWidth");
    }

    /**
     * @public
     * @returns {int}
     */

    get minHeight() {
        return this._layoutSizeManager.minHeight;
    }

    /**
     * @public
     * @param {int} value
     */

    set minHeight(value) {
        this._changeSizeValue(value, "minHeight");
    }

    /**
     * @public
     * @returns {int}
     */

    get maxHeight() {
        return this._layoutSizeManager.maxHeight;
    }

    /**
     * @public
     * @param {int} value
     */

    set maxHeight(value) {
        this._changeSizeValue(value, "maxHeight");
    }

    /**
     * @public
     * @returns {int}
     */

    get contentWidth() {
        return this._layoutSizeManager.contentWidth;
    }

    /**
     * @public
     * @returns {int}
     */

    get contentHeight() {
        return this._layoutSizeManager.contentHeight;
    }

    /**
     * @public
     * @returns {PIXI.ObservablePoint}
     */

    get innerPadding() {
        return this._innerPadding;
    }

    /**
     * @public
     * @param {PIXI.Point | PIXI.ObservablePoint} value
     */

    set innerPadding(value) {
        if (Geometry.pEqual(this._innerPadding, value)) {
            return;
        }
        this._innerPadding.copy(value);
    }

    /**
     * @public
     * @returns {PIXI.ObservablePoint}
     */

    get outerPadding() {
        return this._outerPadding;
    }

    /**
     * @public
     * @param {PIXI.Point | PIXI.ObservablePoint} value
     */

    set outerPadding(value) {
        if (Geometry.pEqual(this._outerPadding, value)) {
            return;
        }
        this._outerPadding.copy(value);
    }

    /**
     * @public
     * @returns {MANTICORE.enumerator.ui.VERTICAL_ALIGN}
     */

    get verticalAlign() {
        return this._verticalAlign;
    }

    /**
     * @public
     * @param {MANTICORE.enumerator.ui.VERTICAL_ALIGN} value
     */

    set verticalAlign(value) {
        if (this._verticalAlign === value) {
            return;
        }
        this._verticalAlign = value;
        this._refreshLayout();
    }

    /**
     * @public
     * @returns {MANTICORE.enumerator.ui.HORIZONTAL_ALIGN}
     */

    get horizontalAlign() {
        return this._horizontalAlign;
    }

    /**
     * @public
     * @param {MANTICORE.enumerator.ui.HORIZONTAL_ALIGN} value
     */

    set horizontalAlign(value) {
        if (this._horizontalAlign === value) {
            return;
        }
        this._horizontalAlign = value;
        this._refreshLayout();
    }

    /**
     * @desc Callback that calls when component attach to owner. Don't use it manually. Only override.
     * @method
     * @public
     * @param {MANTICORE.view.ComponentContainer} owner
     */

    onAdd (owner) {
        super.onAdd(owner);
    }

    /**
     * @desc Calls when owner add children.
     * @method
     * @public
     * @param {PIXI.DisplayObject} child
     */

    onAddChild(child) {
        super.onAddChild(child);
        this._refreshLayout();
    }

    /**
     * @desc Calls when owner remove children.
     * @method
     * @public
     * @param {PIXI.DisplayObject} child
     */

    onRemoveChild(child) {
        super.onRemoveChild(child);
        this._refreshLayout();
    }

    /**
     * @desc Force refresh layout.
     * @method
     * @public
     */

    refreshLayot() {
        this._refreshLayout();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Refresh layout for children.
     * @method
     * @private
     */

    _refreshLayout() {
        if (!this.hasChildren()) {
            return;
        }

        const maxWidth = this._layoutSizeManager.contentWidth;
        const maxHeight = this._layoutSizeManager.contentHeight;

        if (maxWidth === -1 || maxHeight === -1) {
            LayoutBuilder.infiniteLayout(this);
        }
    }

    /**
     * @desc Change size value, and refresh layout.
     * @method
     * @private
     * @param {int} value
     * @param {string} key
     */

    _changeSizeValue(value, key) {
        if (this._layoutSizeManager[key] === value) {
            return;
        }
        this._layoutSizeManager[key] = value;
        this._refreshLayout();
    }

    /**
     * @desc Callback when inner padding change.
     * @method
     * @private
     */

    _onInnerPaddingChangeHandler() {
        this._refreshLayout();
    }

    /**
     * @desc Callback when outer padding change.
     * @method
     * @private
     */

    _onOuterPaddingChangeHandler() {
        this._refreshLayout();
    }
}

export default ComLayout;