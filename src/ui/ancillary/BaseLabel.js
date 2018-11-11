import Widget from "ui/Widget";
import VERTICAL_ALIGN from "enumerator/ui/VerticalAlign";
import HORIZONTAL_ALIGN from "enumerator/ui/HorizontalAlign";
import Color from "util/Color";

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

        /**
         * @desc Flag is label localized.
         * @type {boolean}
         * @private
         */

        this._localized = false;

        /**
         * @desc Flag is need to change size of font to size of container.
         * @type {boolean}
         * @private
         */

        this._autoSize = false;

        /**
         * @desc Letter spacing between chars.
         * @type {number}
         * @private
         */

        this._letterSpacing = 0;
    }

    /**
     * PUBLiC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     */
    reuse() {
        super.reuse();

        this._verticalAlign = VERTICAL_ALIGN.TOP;
        this._horizontalAlign = HORIZONTAL_ALIGN.LEFT;
        this._localized = false;
        this._letterSpacing = 0;
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
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data before disuse and destroy.
     * @method
     * @protected
     */

    clearData() {
        this._verticalAlign = VERTICAL_ALIGN.TOP;
        this._horizontalAlign = HORIZONTAL_ALIGN.LEFT;
        this._localized = false;

        super.clearData();
    }

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

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Flag is need to change size of font to size of container.
     * @public
     * @return {boolean}
     */

    get autoSize() {
        return this._autoSize;
    }


    set autoSize(value) {
        if (this._autoSize === value) {
            return;
        }

        this._autoSize = value;
    }

    /**
     * @public
     * @type {int}
     */

    get shadowColor() {
        return Color.COLORS.WHITE;
    }

    set shadowColor(value) {}

    /**
     * @public
     * @type {boolean}
     */

    get outlineEnabled() {
        return false;
    }

    set outlineEnabled(value) {}

    /**
     * @public
     * @type {number}
     */

    get outlineSize() {
        return 0;
    }

    set outlineSize(value) {}

    /**
     * @public
     * @type {int}
     */

    get outlineColor() {
        return Color.COLORS.WHITE;
    }

    set outlineColor(value) {}

    /**
     * @public
     * @type {boolean}
     */

    get shadowEnabled() {
        return false;
    }

    set shadowEnabled(value) {}

    /**
     * @public
     * @type {string}
     */

    get text() {
        return "Empty";
    }

    set text(value) {}

    /**
     * @public
     * @type {int}
     */

    get color() {
        return this.tint;
    }

    set color(value) {
        this.tint = value;
    }

    /**
     * @public
     * @type {MANTICORE.enumerator.ui.HORIZONTAL_ALIGN}
     */

    get horizontalAlign() {
        return this._horizontalAlign;
    }

    set horizontalAlign(value) {
        if (this._horizontalAlign === value) {
            return;
        }
        this._horizontalAlign = value;
        this.horizontalAlignChange(value);
    }

    /**
     * @public
     * @type {MANTICORE.enumerator.ui.VERTICAL_ALIGN}
     */

    get verticalAlign() {
        return this._verticalAlign;
    }

    set verticalAlign(value) {
        if (this._verticalAlign === value) {
            return;
        }
        this._verticalAlign = value;
        this.verticalAlignChange(value);
    }

    /**
     * @desc Letter spacing of label.
     * @public
     * @type {number}
     */

    get letterSpacing() {
        return this._letterSpacing;
    }

    set letterSpacing(value) {
        if (this._letterSpacing === value) {
            return;
        }
        this._letterSpacing = value;
    }

    /**
     * @public
     * @type {int}
     */

    get lineHeight() {
        return 0;
    }

    /**
     * @public
     * @type {int}
     */

    get fontSize() {
        return 0;
    }

    set fontSize(value) {}

    /**
     * @public
     * @type {string}
     */

    get fontName() {
        return "Empty";
    }

    /**
     * @desc Flag is label localized.
     * @public
     * @returns {boolean}
     */

    get localize() {
        return this._localized;
    }

    set localized(value) {
        if (this._localized === value) {
            return;
        }
        this._localized = value;
    }
}

export default BaseLabel;