import HORIZONTAL_ALIGN from "enumerator/ui/HorizontalAlign";
import VERTICAL_ALIGN from "enumerator/ui/VerticalAlign";
import Math from "util/Math";
import FontCache from "ui/fontCache";

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
         * @type {string}
         * @private
         */

        this._fontName = fontName;

        fontName = FontCache.getFontName(this._fontName, size);

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
     * @type {PIXI.Point | Point}
     */

    get anchor() {
        return new PIXI.Point(this._label.anchor.x, this._label.anchor.y);
    }

    /**
     * @public
     * @type {number}
     */

    get maxWidth() {
        return this._label.maxWidth;
    }

    set maxWidth(value) {
        if (this._label.maxWidth === value) {
            return;
        }
        this._label.maxWidth = value;
        this._iterateOutlines(element => element.maxWidth = value);
    }

    /**
     * @public
     * @type {string}
     */

    get fontName() {
        return this._fontName;
    }

    set fontName(value) {
        if (this._label.font.name === value) {
            return;
        }
        const fontName = FontCache.getFontName(value, this._label.font.size);
        this._label.font.name = fontName;
        this._iterateOutlines(element => element.font.name = fontName);
    }

    /**
     * @public
     * @type {int}
     */

    get fontSize() {
        return this._label.font.size;
    }

    set fontSize(value) {
        if (this._label.font.size === value) {
            return;
        }
        const fontName = FontCache.getFontName(this._fontName, size);
        this._label.font.name = fontName;
        this._label.font.size = value;
        this._iterateOutlines(element => {
            element.font.name = fontName;
            element.font.size = value
        });
    }

    /**
     * @public
     * @type {boolean}
     */

    get outlineEnabled() {
        return this._isOutlineEnabled;
    }

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
     * @type {number}
     */

    get outlineSize() {
        return this._outlineSize;
    }

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

        const step = Math.PI * 2 / outlineCount;
        const offset = this._outlineSize + 1;

        this._iterateOutlines((element, index) => {
            const angle = step * index;
            element.position.set(
                this._label.x + Math.round(offset * Math.cos(angle)),
                this._label.y + Math.round(offset * Math.sin(angle))
            );
        });
    }

    /**
     * @public
     * @type {int}
     */

    get color() {
        return this._color;
    }

    set color(value) {
        if (this._color === value) {
            return;
        }
        this._color = value;
        this._label.tint = value;
    }

    /**
     * @public
     * @type {int}
     */

    get outlineColor() {
        return this._outlineColor;
    }

    set outlineColor(value) {
        if (this._outlineColor === value) {
            return;
        }
        this._outlineColor = value;

        this._iterateOutlines(element => element.tint = this._outlineColor);
    }

    /**
     * @public
     * @type {MANTICORE.enumerator.ui.HORIZONTAL_ALIGN}
     */

    get horizontalAlign() {
        return this._horizontalAlign;
    }

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
     * @type {int}
     */

    get lineHeight() {
        return this._label.textHeight;
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