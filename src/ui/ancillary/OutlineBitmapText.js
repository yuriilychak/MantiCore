import HORIZONTAL_ALIGN from "enumerator/ui/HorizontalAlign";
import VERTICAL_ALIGN from "enumerator/ui/VerticalAlign";
import math from "util/Math";

/**
 * @desc Bitmap text with outline.
 * @class
 * @extends PIXI.Container
 * @memberOf MANTICORE.ui.ancillary
 */

class OutlineBitmapText extends PIXI.Container {
    /**
     * @constructor
     * @param {string} fontName
     * @param {int} size
     */
    constructor (fontName, size) {
        super();

        /**
         * @desc Label that contain text.
         * @type {PIXI.extras.BitmapText}
         * @private
         */

        this._label = new PIXI.extras.BitmapText("", {
            font: {
                name: fontName,
                size: size
            },
            align: "left"
        });

        /**
         * @type {MANTICORE.enumerator.ui.HORIZONTAL_ALIGN}
         * @private
         */

        this._horizontalAlign = HORIZONTAL_ALIGN.LEFT;

        /**
         * @desc Vertical align of text field.
         * @type {MANTICORE.enumerator.ui.VERTICAL_ALIGN}
         * @private
         */

        this._verticalAlign = VERTICAL_ALIGN.TOP;

        /**
         * @desc Flag is outline enabled for font;
         * @type {boolean}
         * @private
         */

        this._isOutlineEnabled = false;

        /**
         * @type {?PIXI.extras.BitmapText[]}
         * @private
         */

        this._outlines = null;

        /**
         * @type {number}
         * @private
         */

        this._outlineSize = 0;

        /**
         * @desc color of outline.
         * @type {int}
         * @private
         */

        this._outlineColor = 0xFFFFFF;

        /**
         * @desc Color of label.
         * @type {int}
         * @private
         */

        this._color = 0xFFFFFF;

        this.addChild(this._label);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @public
     * @return {MANTICORE.ui.OutlineBitmapText}
     */

    clone() {
        const result = new OutlineBitmapText(this.fontName, this.fontSize);
        result.horizontalAlign = this.horizontalAlign;
        result.verticalAlign = this.verticalAlign;
        result.maxWidth = this.maxWidth;
        result.text = this.text;
        result.color = this.color;
        result.outlineEnabled = this.outlineEnabled;
        result.outlineSize = this.outlineSize;
        result.outlineColor = this.outlineColor;
        return result;
    }

    /**
     * @return {Point}
     */

    get anchor() {
        return new PIXI.Point(this._label.anchor.x, this._label.anchor.y);
    }

    /**
     * @public
     * @return {number}
     */

    get maxWidth() {
        return this._label.maxWidth;
    }

    /**
     * @public
     * @param {number} value
     */

    set maxWidth(value) {
        if (this._label.maxWidth === value) {
            return;
        }
        this._label.maxWidth = value;
        this._iterateOutlines(element => element.maxWidth = value);
    }

    /**
     * @public
     * @return {string}
     */

    get fontName() {
        return this._label.font.name;
    }

    /**
     * @public
     * @param {string} value
     */

    set fontName(value) {
        if (this._label.font.name === value) {
            return;
        }
        this._label.font.name = value;
        this._iterateOutlines(element => element.font.name = value);
    }

    /**
     * @public
     * @return {int}
     */

    get fontSize() {
        return this._label.font.size;
    }

    /**
     * @public
     * @param {int} value
     */

    set fontSize(value) {
        if (this._label.font.size === value) {
            return;
        }
        this._label.font.size = value;
        this._iterateOutlines(element => element.font.size = value);
    }

    /**
     * @public
     * @return {boolean}
     */

    get outlineEnabled() {
        return this._isOutlineEnabled;
    }

    /**
     * @public
     * @param {boolean} value
     */

    set outlineEnabled(value) {
        if (this._isOutlineEnabled === value) {
            return;
        }
        this._isOutlineEnabled = value;

        if (this._isOutlineEnabled) {
            this._outlines = [];
            return;
        }

        this._outlineSize = 0;
        this._outlineColor = 0xFFFFFF;

        const outlineCount = this._outlines.length;

        for (let i = 0; i < outlineCount; ++i) {
            this.removeChild(this._outlines[i]);
        }

        this._outlines = null;
    }


    /**
     * @public
     * @return {number}
     */

    get outlineSize() {
        return this._outlineSize;
    }

    /**
     * @public
     * @param {number} value
     */

    set outlineSize(value) {
        if (!this._isOutlineEnabled || this._outlineSize === value) {
            return;
        }

        this._outlineSize = value;
        let outline, i;

        let outlineCount = this._outlines.length;

        if (outlineCount === 0) {
            outlineCount = 8;
            for (i = 0; i < outlineCount; ++i) {
                outline = this._cloneLabel();
                outline.tint = this._outlineColor;
                this._outlines.push(outline);
                this.addChild(outline);
            }
        }

        this.setChildIndex(this._label, outlineCount);

        const step = math.PI * 2 / outlineCount;
        const offset = this._outlineSize + 1;

        this._iterateOutlines((element, index) => {
            const angle = step * index;
            element.position.set(
                this._label.x + math.round(offset * math.cos(angle)),
                this._label.y + math.round(offset * math.sin(angle))
            );
        });
    }

    /**
     * @public
     * @return {int}
     */

    get color() {
        return this._color;
    }

    /**
     * @public
     * @param {int} value
     */

    set color(value) {
        if (this._color === value) {
            return;
        }
        this._color = value;
        this._label.tint = value;
    }

    /**
     * @public
     * @return {int}
     */

    get outlineColor() {
        return this._outlineColor;
    }

    /**
     * @public
     * @param {int} value
     */

    set outlineColor(value) {
        if (this._outlineColor === value) {
            return;
        }
        this._outlineColor = value;

        this._iterateOutlines(element => element.tint = this._outlineColor);
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
        if (this._label.align === value) {
            return;
        }

        this._horizontalAlign = value;

        let align;
        let anchor;
        switch (this._horizontalAlign) {
            case HORIZONTAL_ALIGN.LEFT: {
                anchor = 0;
                align = "left";
                break;
            }
            case HORIZONTAL_ALIGN.RIGHT: {
                anchor = 1;
                align = "right";
                break;
            }
            case HORIZONTAL_ALIGN.CENTER: {
                anchor = 0.5;
                align = "center";
                break;
            }
        }
        this._label.align = align;
        this._label.anchor.x = anchor;

        this._iterateOutlines(element => element.anchor.x = anchor);
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
        let anchor;
        switch(this._verticalAlign) {
            case VERTICAL_ALIGN.TOP: {
                anchor = 0;
                break;
            }
            case VERTICAL_ALIGN.MIDDLE: {
                anchor = 0.5;
                break;
            }
            case VERTICAL_ALIGN.BOTTOM: {
                anchor = 1;
                break;
            }
        }
        this._label.anchor.y = anchor;

        this._iterateOutlines(element => element.anchor.y = anchor);
    }

    /**
     * @public
     * @returns {int}
     */

    get lineHeight() {
        return this._label.textHeight;
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
        if (this._label.text === value) {
            return;
        }
        this._label.text = value;

        this._iterateOutlines(element => element.text = value);
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Create clone of label. Need to create outlines and shadows.
     * @method
     * @private
     * @return {PIXI.extras.BitmapText}
     */

    _cloneLabel() {
        const result = new PIXI.extras.BitmapText("", {
            font: {
                name: this._label.font.name,
                size: this._label.font.size
            },
            align: this._label.align
        });

        result.text = this._label.text;
        result.maxWidth = this._label.maxWidth;
        result.anchor.set(this._label.anchor.x, this._label.anchor.y);
        return result;
    }

    _iterateOutlines(callback) {
        if (!this._isOutlineEnabled) {
            return;
        }

        const outlineCount = this._outlines.length;

        for (let i = 0; i < outlineCount; ++i) {
            callback(this._outlines[i], i);
        }
    }
}

export default OutlineBitmapText;