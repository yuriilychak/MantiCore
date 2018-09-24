import BaseManager from "./BaseManager";
import Math from "util/Math";

/**
 * @desc Class for manipulate with size in layout. Need to decompose layout component, for simplify it.
 * @class
 * @extends MANTICORE.manager.BaseManager
 * @memberOf MANTICORE.manager
 */

class LayoutSizeManager extends BaseManager {
    /**
     * @constructor
     * @param {MANTICORE.component.Component} owner
     */
    constructor(owner) {
        super(owner);

        /**
         * @desc Flag is width of owner static.
         * @type {boolean}
         * @private
         */

        this._isStaticWidth = false;

        /**
         * @desc Flag is height of owner static.
         * @type {boolean}
         * @private
         */

        this._isStaticHeight = false;

        /**
         * @desc Max width of owner. If -1 can change without limitation.
         * @type {int}
         * @private
         */

        this._maxWidth = -1;

        /**
         * @desc Min width of owner. If -1 can change without limitation.
         * @type {int}
         * @private
         */

        this._minWidth = -1;

        /**
         * @desc Max height of owner. If -1 can change without limitation.
         * @type {int}
         * @private
         */

        this._maxHeight = -1;

        /**
         * @desc Min height of owner. If -1 can change without limitation.
         * @type {int}
         * @private
         */

        this._minHeight = -1;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {boolean}
     */

    get staticWidth() {
        return this._isStaticWidth || !this.owner.hasOwner();
    }

    set staticWidth(value) {
        if (this._isStaticWidth === value) {
            return;
        }
        this._isStaticWidth = value;
        if (!this._isStaticWidth) {
            return;
        }
        this._minWidth = -1;
        this._maxWidth = -1;
    }

    /**
     * @public
     * @type {boolean}
     */

    get staticHeight() {
        return this._isStaticHeight || !this.owner.hasOwner();
    }

    set staticHeight(value) {
        if (this._isStaticHeight === value) {
            return;
        }
        this._isStaticHeight = value;
        if (!this._isStaticHeight) {
            return;
        }
        this._minHeight = -1;
        this._maxHeight = -1;
    }

    /**
     * @public
     * @type {int}
     */

    get minWidth() {
        return this._getSizeValue(this._isStaticWidth, this._minWidth, "width");
    }

    set minWidth(value) {
        if (this.staticWidth) {
            return;
        }
        value = Math.round(value);

        if (this._minWidth  === value) {
            return;
        }

        this._minWidth = value;
        this._updateWidth(this._minWidth, -1);
    }

    /**
     * @public
     * @type {int}
     */

    get maxWidth() {
        return this._getSizeValue(this._isStaticWidth, this._maxWidth, "width");
    }

    set maxWidth(value) {
        if (this.staticWidth) {
            return;
        }
        value = Math.round(value);

        if (this._maxWidth  === value) {
            return;
        }

        this._maxWidth = value;
        this._updateWidth(this._maxWidth, 1);
    }

    /**
     * @public
     * @type {int}
     */

    get minHeight() {
        return this._getSizeValue(this._isStaticHeight, this._minHeight, "height");
    }

    set minHeight(value) {
        if (this.staticHeight) {
            return;
        }
        value = Math.round(value);

        if (this._minHeight === value) {
            return;
        }

        this._minHeight = value;
        this._updateHeight(this._minHeight, -1);
    }

    /**
     * @public
     * @type {int}
     */

    get maxHeight() {
        return this._getSizeValue(this._isStaticHeight, this._maxHeight, "height");
    }

    set maxHeight(value) {
        if (this.staticHeight) {
            return;
        }
        value = Math.round(value);

        if (this._maxHeight  === value) {
            return;
        }

        this._maxHeight = value;
        this._updateHeight(this._maxHeight, 1);
    }

    /**
     * @desc Returns content width for align values.
     * @public
     * @type {int}
     */

    get contentWidth() {
        return this._getContentValue(this._isStaticWidth, this._maxWidth, "width");
    }

    /**
     * @desc Returns content height for align values.
     * @public
     * @type {int}
     */

    get contentHeight() {
        return this._getContentValue(this._isStaticHeight, this._maxHeight, "height");
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @private
     * @param {int} value - Height value min or max width.
     * @param {int} multiplier - Number 1 or -1. Need to don't move condition to arguments.
     * @returns {boolean}
     */

    _updateWidth(value, multiplier) {
        const owner = this.owner.owner;
        if (value === -1 || (owner.width - value) * multiplier <= 0) {
            return false;
        }
        owner.width = value;
        return true;
    }

    /**
     * @method
     * @private
     * @param {int} value - Height value min or max height.
     * @param {int} multiplier - Number 1 or -1. Need to don't move condition to arguments.
     * @returns {boolean}
     */

    _updateHeight(value, multiplier) {
        const owner = this.owner.owner;
        if (value === -1 || (owner.height - value) * multiplier <= 0) {
            return false;
        }
        owner.height = value;
        return true;
    }

    /**
     * @desc Returns size value.
     * @function
     * @private
     * @param {boolean} isStatic
     * @param {int} value
     * @param {string} key
     * @returns {int}
     */

    _getSizeValue(isStatic, value, key) {
        const owner = this.owner;
        return !owner.hasOwner() || value === -1 ? -1 : isStatic ? owner.owner[key] : value;
    }

    /**
     * @desc Returns size for align value.
     * @function
     * @private
     * @param {boolean} isStatic
     * @param {int} value
     * @param {string} key
     * @returns {int}
     */

    _getContentValue(isStatic, value, key) {
        const owner = this.owner;
        return !owner.hasOwner() ? -1 : isStatic ? owner.owner[key] : value;
    }
}

export default LayoutSizeManager;