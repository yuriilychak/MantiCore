import BaseLabel from "./ancillary/BaseLabel";
import Math from "util/Math";
import Type from "util/Type";
import OutlineBitmapText from "./ancillary/OutlineBitmapText";
import UI_ELEMENT from "enumerator/ui/UIElement";

/**
 * @desc Class for manipulate with bitmap fonts.
 * @class
 * @extends MANTICORE.ui.ancillary.BaseLabel
 * @memberOf MANTICORE.ui
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
         * @type {MANTICORE.ui.ancillary.OutlineBitmapText}
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
         * @type {?PIXI.Point}
         * @private
         */

        this._shadowOffset = null;

        /**
         * @desc Label that contain text.
         * @type {MANTICORE.ui.ancillary.OutlineBitmapText}
         * @private
         */

        this._shadow = null;

        /**
         * @type {int}
         * @private
         */

        this._lineHeight = this._label.lineHeight;

        this._label.maxWidth = this.width;

        this.uiType = UI_ELEMENT.LABEL;

        this.addChild(this._label);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @public
     * @return {PIXI.Point}
     */

    getShadowOffset() {
        return this._isShadowEnabled ? this._shadowOffset.clone() : super.getShadowOffset();
    }

    /**
     * @method
     * @public
     * @param {int | PIXI.Point} xOrPoint
     * @param {int} [y]
     */

    setShadowOffset(xOrPoint, y) {
        if (!this._isShadowEnabled) {
            return;
        }
        this._shadowOffset.set(
            Math.round(Type.isNumber(xOrPoint) ? xOrPoint : xOrPoint.x),
            Math.round(!Type.isUndefined(y) ? y : Type.isNumber(xOrPoint) ? xOrPoint : xOrPoint.y)
        );
        this._updateHorizontalPos(this._shadow, this._shadowOffset.x);
        this._updateVerticalPos(this._shadow, this._shadowOffset.y);
    }

    /**
     * @public
     * @return {int}
     */

    get color() {
        return this._label.color;
    }

    /**
     * @public
     * @param {int} value
     */

    set color(value) {
        this._label.color = value;
    }

    /**
     * @public
     * @return {int}
     */

    get shadowColor() {
        return this._isShadowEnabled ? this._shadow.color : super.shadowColor;
    }

    /**
     * @public
     * @param {int} value
     */

    set shadowColor(value) {
        if (!this._isShadowEnabled) {
            return;
        }
        this._shadow.color = value;
        this._shadow.outlineColor = value;
    }

    /**
     * @public
     * @return {boolean}
     */

    get outlineEnabled() {
        return this._label.outlineEnabled;
    }

    /**
     * @public
     * @param {boolean} value
     */

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
     * @return {number}
     */

    get outlineSize() {
        return this._label.outlineSize;
    }

    /**
     * @public
     * @param {number} value
     */

    set outlineSize(value) {
        this._label.outlineSize = value;
        if (!this._isShadowEnabled) {
            return;
        }
        this._shadow.outlineSize = value;
    }

    /**
     * @public
     * @return {int}
     */

    get outlineColor() {
        return this._label.outlineColor;
    }

    /**
     * @public
     * @param {int} value
     */

    set outlineColor(value) {
        this._label.outlineColor = value;
    }

    /**
     * @desc Returns text of label
     * @public
     * @return {string}
     */

    get text() {
        return this._label.text;
    }

    /**
     * @desc Set text of label
     * @public
     * @param {string} value
     */

    set text(value) {
        this._label.text = value;
    }

    /**
     * @public
     * @return {int}
     */

    get width() {
        return super.width;
    }

    /**
     * @public
     * @param {int} value
     */

    set width(value) {
        super.width = value;
        this._label.maxWidth = this.width;
        this._updateHorizontalPos(this._label);
        if (!this._isShadowEnabled) {
            return;
        }
        this._shadow.maxWidth = this.width;
        this._updateHorizontalPos(this._shadow, this._shadowOffset.x);
    }

    /**
     * @public
     * @return {int}
     */

    get height() {
        return super.height;
    }

    /**
     * @public
     * @param {int} value
     */

    set height(value) {
        super.height = value;
        this._updateVerticalPos(this._label);
        if (!this._isShadowEnabled) {
            return;
        }
        this._updateVerticalPos(this._shadow, this._shadowOffset.y);
    }

    /**
     * @public
     * @return {boolean}
     */

    get shadowEnabled() {
        return this._isShadowEnabled;
    }

    /**
     * @public
     * @param {boolean} value
     */

    set shadowEnabled(value) {
        if (this._isShadowEnabled === value) {
            return;
        }

        this._isShadowEnabled = value;

        if (this._isShadowEnabled) {
            this._shadowOffset = new PIXI.Point(0, 0);
            this._shadow = this._label.clone();
            this.addChildAt(this._shadow, 1);
            this._shadow.color = this._shadow.outlineColor = 0xFFFFFF;
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
     * @returns {int}
     */

    get fontSize() {
        return this._label.fontSize;
    }

    /**
     * @public
     * @param {int} value
     */

    set fontSize(value) {
        if (this._label.fontSize === value) {
            return;
        }
        this._label.fontSize = value;
        this._lineHeight = this._label.lineHeight;

        if (!this._isShadowEnabled) {
            return;
        }
        this._shadow.fontSize = value;
    }

    /**
     * @public
     * @returns {string}
     */

    get fontName() {
        return this._label.fontName;
    }

    /**
     * @public
     * @returns {int}
     */

    get lineHeight() {
        return this._lineHeight;
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
     * @param {MANTICORE.enumerator.ui.VERTICAL_ALIGN} value
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
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @private
     * @param {MANTICORE.ui.OutlineBitmapText} target
     * @param {int} [offset = 0]
     */

    _updateHorizontalPos(target, offset = 0) {
        target.x = Math.round((this.width + offset) * target.anchor.x);
    }

    /**
     * @method
     * @private
     * @param {MANTICORE.ui.OutlineBitmapText} target
     * @param {int} [offset = 0]
     */

    _updateVerticalPos(target, offset = 0) {
        target.y = Math.round((this.height + offset) * target.anchor.y);
    }
}

export default Label;