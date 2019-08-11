import BaseLabel from "./ancillary/BaseLabel";
import Math from "util/Math";
import Type from "util/Type";
import OutlineBitmapText from "./ancillary/OutlineBitmapText";
import UI_ELEMENT from "enumerator/ui/UIElement";
import Color from "util/Color";
import Point from "geometry/Point";
import NUMBER_TYPE from "enumerator/NumberType";

/**
 * @desc Class for manipulate with bitmap fonts.
 * @class
 * @extends mCore.ui.ancillary.BaseLabel
 * @memberOf mCore.ui
 */

class Label extends BaseLabel {
    /**
     * @constructor
     * @param {string} fontName
     * @param {int} size
     */
    constructor(fontName, size) {
        super();

        /**
         * @desc Label that contain text.
         * @type {mCore.ui.ancillary.OutlineBitmapText}
         * @private
         */

        this._label = new OutlineBitmapText(fontName, size);

        /**
         * @desc Is drop shadow enabled.
         * @type {boolean}
         * @private
         */

        this._isShadowEnabled = false;

        /**
         * @desc offset of shadow;
         * @type {?mCore.geometry.Point}
         * @private
         */

        this._shadowOffset = null;

        /**
         * @desc Label that contain text.
         * @type {mCore.ui.ancillary.OutlineBitmapText}
         * @private
         */

        this._shadow = null;

        /**
         * @type {int}
         * @private
         */

        this._lineHeight = this._label.lineHeight;

        /**
         * @desc Size of font.
         * @type {int}
         * @private
         */

        this._fontSize = size;

        this._label.maxWidth = this.width;

        /**
         * @desc Locale of label
         * @type {?string}
         * @private
         */

        this._locale = null;

        this.uiType = UI_ELEMENT.LABEL;

        this.addChild(this._label);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {string} fontName
     * @param {int} size
     */
    reuse(fontName, size) {
        super.reuse();

        this._label = new OutlineBitmapText(fontName, size);
        this._isShadowEnabled = false;
        this._shadowOffset = null;
        this._shadow = null;
        this._lineHeight = this._label.lineHeight;
        this._label.maxWidth = this.width;
    }

    /**
     * @method
     * @public
     * @return {mCore.geometry.Point}
     */

    getShadowOffset() {
        return this._isShadowEnabled ? this._shadowOffset.clone() : super.getShadowOffset();
    }

    /**
     * @method
     * @public
     * @param {int | mCore.geometry.Point} xOrPoint
     * @param {int} [y]
     */

    setShadowOffset(xOrPoint, y) {
        const offsetX = Math.round(Type.isNumber(xOrPoint) ? xOrPoint : xOrPoint.x);
        const offsetY = Math.round(!Type.isUndefined(y) ? y : Type.isNumber(xOrPoint) ? xOrPoint : xOrPoint.y);
        if (offsetX === 0 &&  offsetY === 0) {
            this.shadowEnabled = false;
            return;
        }
        this.shadowEnabled = true;
        this._shadowOffset.set(offsetX, offsetY);
        this._updateHorizontalPos(this._shadow, this._shadowOffset.x);
        this._updateVerticalPos(this._shadow, this._shadowOffset.y);
    }

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
        this._label.maxWidth = 0;
        this._label = null;
        this._isShadowEnabled = false;
        this._shadowOffset = null;
        this._shadow = null;
        this._lineHeight = 0;
        super.clearData();
    }

    /**
     * @desc Calls when horizontal align change.
     * @method
     * @protected
     * @param {mCore.enumerator.ui.HORIZONTAL_ALIGN} value
     */

    horizontalAlignChange(value) {
        this._label.horizontalAlign = value;
        this._updateHorizontalPos(this._label);
        if (!this._isShadowEnabled) {
            return;
        }
        this._shadow.horizontalAlign = value;
        this._updateHorizontalPos(this._shadow, this._shadowOffset.x);
    }

    /**
     * @desc Calls when vertical align change.
     * @method
     * @protected
     * @param {mCore.enumerator.ui.VERTICAL_ALIGN} value
     */

    verticalAlignChange(value) {
        this._label.verticalAlign = value;
        this._updateVerticalPos(this._label);
        if (!this._isShadowEnabled) {
            return;
        }
        this._shadow.verticalAlign = value;
        this._updateVerticalPos(this._shadow, this._shadowOffset.y);
    }

    /**
     * @desc Set color of specific letters.
     * @method
     * @public
     * @param {int} beginIndex
     * @param {int} count
     * @param {int} color
     */

    updateColorByLetter(beginIndex, count, color) {
        this._label.updateColorByLetter(beginIndex, count, color);
    }

    /**
     * @desc Clear colors of all letters.
     * @method
     * @public
     */

    clearLetterColors() {
        this._label.clearLetterColors();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @private
     * @param {mCore.ui.ancillary.OutlineBitmapText} target
     * @param {int} [offset = 0]
     */

    _updateHorizontalPos(target, offset = 0) {
        target.x = Math.round(this.width * target.anchor.x  + offset);
    }

    /**
     * @method
     * @private
     * @param {mCore.ui.ancillary.OutlineBitmapText} target
     * @param {int} [offset = 0]
     */

    _updateVerticalPos(target, offset = 0) {
        target.y = Math.round(this.height * target.anchor.y + offset);
    }

    /**
     * @desc Update auto size of font.
     * @method
     * @private
     */

    _updateAutoSize() {
        if (!this.autoSize) {
            return;
        }

        this._refreshFontSize(this._fontSize);

        if (this.width >= this._label.width && this.height >= this._label.height) {
            this._lineHeight = this._label.lineHeight;
            return;
        }

        while (this.width < this._label.width || this.height < this._label.height) {
            this._refreshFontSize(this._label.fontSize - 1);
        }
        this._lineHeight = this._label.lineHeight;
    }

    /**
     * @desc Refresh font size on auto update.
     * @method
     * @private
     * @param {int} size
     */

    _refreshFontSize(size) {
        this._label.fontSize = size;
        this._label.updateText();
        if (this._isShadowEnabled) {
            this._shadow.fontSize = size;
            this._shadow.updateText();
        }
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {int}
     */

    get color() {
        return this._label.color;
    }

    set color(value) {
        this._label.color = value;
    }

    /**
     * @public
     * @type {int}
     */

    get shadowColor() {
        return this._isShadowEnabled ? this._shadow.color : super.shadowColor;
    }

    set shadowColor(value) {
        if (!this._isShadowEnabled) {
            return;
        }
        this._shadow.color = value;
        this._shadow.outlineColor = value;
    }

    /**
     * @public
     * @type {boolean}
     */

    get outlineEnabled() {
        return this._label.outlineEnabled;
    }

    set outlineEnabled(value) {
        this._label.outlineEnabled = value;
        if (!this._isShadowEnabled) {
            return;
        }
        this._shadow.outlineEnabled = value;
        if (value) {
            this._shadow.outlineColor = this._shadow.color;
        }
    }

    /**
     * @public
     * @type {number}
     */

    get outlineSize() {
        return this._label.outlineSize;
    }

    set outlineSize(value) {
        this.outlineEnabled = value !== 0;
        this._label.outlineSize = value;
        if (!this._isShadowEnabled) {
            return;
        }
        this._shadow.outlineSize = value;
    }

    /**
     * @public
     * @type {int}
     */

    get outlineColor() {
        return this._label.outlineColor;
    }

    set outlineColor(value) {
        this._label.outlineColor = value;
    }

    /**
     * @desc Returns text of label
     * @public
     * @type {string}
     */

    get text() {
        return this._label.text;
    }

    set text(value) {
        if (this._label.text === value) {
            return;
        }
        this.localized = true;
        this._label.text = value;
        if (this._isShadowEnabled) {
            this._shadow.text = value;
        }

        this._updateAutoSize();
    }

    /**
     * @public
     * @type {int}
     */

    get width() {
        return super.width;
    }

    set width(value) {
        super.width = value;
        this._label.maxWidth = this.width;
        this._updateHorizontalPos(this._label);
        if (this._isShadowEnabled) {
            this._shadow.maxWidth = this.width;
            this._updateHorizontalPos(this._shadow, this._shadowOffset.x);
        }
        this._updateAutoSize();
    }

    /**
     * @public
     * @type {int}
     */

    get height() {
        return super.height;
    }

    set height(value) {
        super.height = value;
        this._updateVerticalPos(this._label);
        if (this._isShadowEnabled) {
            this._updateVerticalPos(this._shadow, this._shadowOffset.y);
        }
        this._updateAutoSize();
    }

    /**
     * @public
     * @type {boolean}
     */

    get shadowEnabled() {
        return this._isShadowEnabled;
    }

    set shadowEnabled(value) {
        if (this._isShadowEnabled === value) {
            return;
        }

        this._isShadowEnabled = value;

        if (this._isShadowEnabled) {
            this._shadowOffset = Point.create(0, 0, NUMBER_TYPE.UINT_16);
            this._shadow = this._label.clone();
            this.addChildAt(this._shadow, 1);
            this._shadow.color = this._shadow.outlineColor = Color.COLORS.WHITE;
            this._updateHorizontalPos(this._shadow);
            this._updateVerticalPos(this._shadow);
            return;
        }

        this.removeChild(this._shadow);
        this._shadow = null;
        this._shadowOffset = null;
    }

    /**
     * @public
     * @type {int}
     */

    get fontSize() {
        return this._fontSize;
    }

    set fontSize(value) {
        if (this._fontSize === value) {
            return;
        }
        this._fontSize = value;

        this._label.fontSize = this._fontSize;
        this._lineHeight = this._label.lineHeight;

        if (this._isShadowEnabled) {
            this._shadow.fontSize = this._fontSize;
        }

        this._updateAutoSize();
    }

    /**
     * @desc Real font size if auto size enabled.
     * @public
     * @returns {int}
     */

    get realFontSize() {
        return this._label.fontSize;
    }

    set realFontSize(value) {
        if (this._label.fontSize === value) {
            return;
        }
        this._label.fontSize = value;
        this._label.updateText();
        if (this._isShadowEnabled) {
            this._shadow.fontSize = value;
            this._shadow.updateText();
        }
    }

    /**
     * @public
     * @type {string}
     */

    get fontName() {
        return this._label.fontName;
    }

    set fontName(value) {
        if (this._label.fontName === value) {
            return;
        }
        this._label.fontName = value;

        if (this._isShadowEnabled) {
            this._shadow.fontName = value;
        }

        this._updateAutoSize();
    }

    /**
     * @public
     * @type {int}
     */

    get lineHeight() {
        return this._lineHeight;
    }

    /**
     * @desc Flag is need to change size of font to size of container.
     * @public
     * @return {boolean}
     */

    get autoSize() {
        return super.autoSize;
    }


    set autoSize(value) {
        if (super.autoSize === value) {
            return;
        }

        super.autoSize = value;

        this._updateAutoSize();
    }

    /**
     * @desc Letter spacing of label.
     * @public
     * @type {number}
     */

    get letterSpacing() {
        return super.letterSpacing;
    }

    set letterSpacing(value) {
        if (super.letterSpacing === value) {
            return;
        }
        super.letterSpacing = value;
        this._label.letterSpacing = value;
        if (this._isShadowEnabled) {
            this._shadow.letterSpacing = value;
        }
        this._updateAutoSize();
    }

    /**
     * @desc Locale of label.
     * @public
     * @return {?string}
     */

    get locale() {
        return this._locale;
    }

    set locale(value) {
        if (this._locale === value) {
            return;
        }
        this._locale = value;
    }
}

export default Label;
