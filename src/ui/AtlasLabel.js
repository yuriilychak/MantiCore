import BaseLabel from "./ancillary/BaseLabel";
import AssetUtil from "util/Asset";
import Math from "util/Math";
import VERTICAL_ALIGN from "enumerator/ui/VerticalAlign";
import HORIZONTAL_ALIGN from "enumerator/ui/HorizontalAlign";
import UI_ELEMENT from "enumerator/ui/UIElement";

/**
 * @desc Chars of dots.
 * @const
 * @readonly
 * @private
 * @type {string}
 * @memberOf MANTICORE.ui.AtlasLabel
 */

const DOT_LIST = ".,";

/**
 * @desc Chars of atlas label.
 * @const
 * @readonly
 * @private
 * @type {string}
 * @memberOf MANTICORE.ui.AtlasLabel
 */

const SYMBOL_LIST = "./0123456789,%+-×=";

/**
 * @desc Realization of atlas label class.
 * @class
 * @extends MANTICORE.ui.ancillary.BaseLabel
 * @memberOf MANTICORE.ui
 */

class AtlasLabel extends BaseLabel {
    /**
     * @constructor
     * @param {string} frame - Frame name of font.
     * @param {int} letterWidth - Width of letter;
     * @param {int} letterHeight - Height of letter;
     * @param {int} dotWidth - Width of dot symbol.
     */
    constructor(frame, letterWidth, letterHeight, dotWidth) {
        super();
        /**
         * @type {PIXI.Texture | null}
         * @private
         */
        this._fontFrame = AssetUtil.getSpriteFrame(frame);

        /**
         * @type {PIXI.Point}
         * @private
         */
        this._letterDimensions = new PIXI.Point(letterWidth, letterHeight);

        /**
         * @type {int}
         * @private
         */

        this._dotWidth = dotWidth;

        /**
         * @type {PIXI.Sprite[]}
         * @private
         */

        this._chars = [];

        /**
         * @type {string}
         * @private
         */

        this._text = "";

        /**
         * @type {string}
         * @private
         */

        this._fontName = frame;

        /**
         * @type {int}
         * @private
         */

        this._fontSize = letterHeight;

        /**
         * @desc Width of text line. Need to align texts.
         * @type {int}
         * @private
         */

        this._lineWidth = 0;

        this.uiType = UI_ELEMENT.ATLAS_LABEL;

        this.verticalAlign = VERTICAL_ALIGN.MIDDLE;
        this.horizontalAlign = HORIZONTAL_ALIGN.CENTER;
        this.localized = true;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {string} frame - Frame name of font.
     * @param {int} letterWidth - Width of letter;
     * @param {int} letterHeight - Height of letter;
     * @param {int} dotWidth - Width of dot symbol.
     */
    reuse(frame, letterWidth, letterHeight, dotWidth) {
        super.reuse();

        this._fontFrame = AssetUtil.getSpriteFrame(frame);
        this._letterDimensions.set(letterWidth, letterHeight);
        this._dotWidth = dotWidth;
        this._text = "";
        this._fontName = frame;
        this._fontSize = letterHeight;
        this._lineWidth = 0;
        this.verticalAlign = VERTICAL_ALIGN.MIDDLE;
        this.horizontalAlign = HORIZONTAL_ALIGN.CENTER;
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
        this._fontFrame = null;
        this._letterDimensions.set(0, 0);
        this._dotWidth = 0;
        this._chars.length = 0;
        this._text = null;
        this._fontName = null;
        this._fontSize = 0;
        this._lineWidth = 0;

        super.clearData();
    }

    /**
     * @desc Calls when horizontal align change.
     * @method
     * @protected
     * @param {MANTICORE.enumerator.ui.HORIZONTAL_ALIGN} value
     */

    horizontalAlignChange(value) {
        this._updateAlign();
    }

    /**
     * @desc Calls when vertical align change.
     * @method
     * @protected
     * @param {MANTICORE.enumerator.ui.VERTICAL_ALIGN} value
     */

    verticalAlignChange(value) {
        this._updateAlign();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Update align of chars.
     * @method
     * @private
     */

    _updateAlign() {
        const textLength = this._text.length;
        const fontProportion = this._fontSize / this._letterDimensions.y;
        const letterWidth = Math.round(this._letterDimensions.x * fontProportion);
        let crtChar = 0;
        let posX, posY, i, char, charIndex, charSprite;

        switch (this.verticalAlign) {
            case VERTICAL_ALIGN.TOP: {
                posY = 0;
                break;
            }
            case VERTICAL_ALIGN.MIDDLE: {
                posY = Math.divPowTwo(this.height - this._fontSize);
                break;
            }
            case VERTICAL_ALIGN.BOTTOM: {
                posY = this.height - this._fontSize;
                break;
            }
        }

        switch (this.horizontalAlign) {
            case HORIZONTAL_ALIGN.LEFT: {
                posX = 0;
                break;
            }
            case HORIZONTAL_ALIGN.CENTER: {
                posX = Math.divPowTwo(this.width - this._lineWidth);
                break;
            }
            case HORIZONTAL_ALIGN.RIGHT: {
                posX = this.width - this._lineWidth;
                break;
            }
        }

        for (i = 0; i < textLength; ++i) {
            char = this._text[i];
            charIndex = SYMBOL_LIST.indexOf(char);

            if (charIndex === -1) {
                posX += letterWidth;
                continue;
            }
            charSprite = this._chars[crtChar];
            charSprite.position.set(posX, posY);
            posX += charSprite.width;
            ++crtChar;
        }
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {string}
     */

    get text() {
        return this._text;
    }

    set text(value) {
        if (this._text === value) {
            return;
        }
        this._text = value;

        const textLength = this._text.length;
        const baseFrame = this._fontFrame.frame;
        const frameHeight = this._letterDimensions.y;
        const frameOffset = this._letterDimensions.x;
        const baseTexture = this._fontFrame.baseTexture;
        const fontProportion = this._fontSize / this._letterDimensions.y;
        const dotWidth = Math.round(this._dotWidth * fontProportion);
        const letterWidth = Math.round(this._letterDimensions.x * fontProportion);

        let charCount = this._chars.length;
        let crtChar = 0;
        let char, charIndex, i, isDot, frame, frameWidth, rect, charSprite;

        this._lineWidth = 0;

        for (i = 0; i < textLength; ++i) {
            char = this._text[i];
            charIndex = SYMBOL_LIST.indexOf(char);

            if (charIndex === -1) {
                this._lineWidth += letterWidth;
                continue;
            }

            isDot = DOT_LIST.indexOf(char) !== -1;
            frameWidth = isDot ? this._dotWidth : frameOffset;
            rect = new PIXI.Rectangle(
                baseFrame.x + charIndex * frameOffset, baseFrame.y,
                frameWidth, frameHeight
            );

            this._lineWidth += isDot ? dotWidth : letterWidth;

            if (crtChar >= charCount) {
                frame = new PIXI.Texture(baseTexture, rect);
                charSprite = PIXI.Sprite.from(frame);
                charSprite.height = this._fontSize;
                charSprite.width = isDot ? dotWidth : letterWidth;
                this.addChild(charSprite);
                this._chars.push(charSprite);
            }
            else {
                charSprite = this._chars[crtChar];
                charSprite.texture.frame = rect;
            }
            ++crtChar;
        }

        charCount = this._chars.length;

        if (charCount > crtChar) {
            for (i = crtChar; i < charCount; ++i) {
                this.removeChild(this._chars[i]);
            }
            this._chars.length = charCount;
        }

        this._updateAlign();
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
        this._updateAlign();
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
        this._updateAlign();
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

        const fontProportion = this._fontSize / this._letterDimensions.y;
        const dotWidth = Math.round(this._dotWidth * fontProportion);
        const letterWidth = Math.round(this._letterDimensions.x * fontProportion);
        const charCount = this._chars.length;
        let i, isDot, char;

        for (i = 0; i < charCount; ++i) {
            char = this._chars[i];
            isDot = char.texture.frame.width === this._dotWidth;
            char.height = this._fontSize;
            char.width = isDot ? dotWidth : letterWidth;
        }

        this._updateAlign();
    }

    /**
     * @public
     * @type {string}
     */

    get fontName() {
        return this._fontName;
    }

    /**
     * @public
     * @type {int}
     */

    get lineHeight() {
        return this._fontSize;
    }
}

export default AtlasLabel;