import Widget from "ui/Widget";
import VERTICAL_ALIGN from "enumerator/ui/VerticalAlign";
import HORIZONTAL_ALIGN from "enumerator/ui/HorizontalAlign";

/**
 * @desc Base class for labels.
 * @class
 * @extends MANTICORE.ui.Widget
 * @memberOf MANTICORE.ui.ancillary
 */

class BaseLabel extends Widget {

    /**
     * @constructor
     */

    constructor() {
        super();

        /**
         * @type {MANTICORE.enumerator.ui.VERTICAL_ALIGN}
         * @private
         */

        this._verticalAlign = VERTICAL_ALIGN.TOP;

        /**
         * @type {MANTICORE.enumerator.ui.HORIZONTAL_ALIGN}
         * @private
         */

        this._horizontalAlign = HORIZONTAL_ALIGN.LEFT;
    }

    /**
     * PUBLiC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @returns {int}
     */

    get fontSize() {
        return 0;
    }

    /**
     * @public
     * @param {int} value
     */

    set fontSize(value) {}

    /**
     * @public
     * @returns {string}
     */

    get fontName() {
        return "Empty";
    }

    /**
     * @method
     * @public
     * @return {PIXI.Point}
     */

    getShadowOffset() {
        return new PIXI.Point();
    }

    /**
     * @method
     * @public
     * @param {int | PIXI.Point} xOrPoint
     * @param {int} [y]
     */

    setShadowOffset(xOrPoint, y) {}

    /**
     * @public
     * @return {int}
     */

    get shadowColor() {
        return 0xFFFFFF;
    }

    /**
     * @public
     * @param {int} value
     */

    set shadowColor(value) {}

    /**
     * @public
     * @return {boolean}
     */

    get outlineEnabled() {
        return false;
    }

    /**
     * @public
     * @param {boolean} value
     */

    set outlineEnabled(value) {}

    /**
     * @public
     * @return {number}
     */

    get outlineSize() {
        return 0;
    }

    /**
     * @public
     * @param {number} value
     */

    set outlineSize(value) {}

    /**
     * @public
     * @return {int}
     */

    get outlineColor() {
        return 0xFFFFFF;
    }

    /**
     * @public
     * @param {int} value
     */

    set outlineColor(value) {}

    /**
     * @public
     * @return {boolean}
     */

    get shadowEnabled() {
        return false;
    }

    /**
     * @public
     * @param {boolean} value
     */

    set shadowEnabled(value) {}

    /**
     * @public
     * @returns {string}
     */

    get text() {
        return "Empty";
    }

    /**
     * @public
     * @param {string} value
     */

    set text(value) {}

    /**
     * @public
     * @return {int}
     */

    get color() {
        return this.tint;
    }

    /**
     * @public
     * @param {int} value
     */

    set color(value) {
        this.tint = value;
    }

    /**
     * @public
     * @return {MANTICORE.enumerator.ui.HORIZONTAL_ALIGN}
     */

    get horizontalAlign() {
        return this._horizontalAlign;
    }

    /**
     * @desc set horizontal align of label.
     * @public
     * @param {MANTICORE.enumerator.ui.HORIZONTAL_ALIGN} value
     */

    set horizontalAlign(value) {
        if (this._horizontalAlign === value) {
            return;
        }
        this._horizontalAlign = value;
        this.horizontalAlignChange(value);
    }

    /**
     * @public
     * @return {MANTICORE.enumerator.ui.VERTICAL_ALIGN}
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
        this.verticalAlignChange(value);
    }

    /**
     * @public
     * @returns {int}
     */

    get lineHeight() {
        return 0;
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls when horizontal align change.
     * @method
     * @protected
     * @param {MANTICORE.enumerator.ui.HORIZONTAL_ALIGN} value
     */

    horizontalAlignChange(value) {}

    /**
     * @desc Calls when vertical align change.
     * @method
     * @protected
     * @param {MANTICORE.enumerator.ui.VERTICAL_ALIGN} value
     */

    verticalAlignChange(value) {}
}

export default BaseLabel;