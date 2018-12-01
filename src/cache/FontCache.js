import Repository from "repository/Repository";
import Math from "util/Math";
import Type from "util/Type";

/**
 * @desc Namespace for manipulate with font sizes and change them.
 * @namespace fontCache
 * @memberOf MANTICORE.ui
 */

export default {
    /**
     * @type {MANTICORE.repository.Repository}
     * @private
     */
    _fontSizes: new Repository(),

    /**
     * @desc Array with font names.
     * @type {string[]}
     * @private
     */
    _fonts: [],

    /**
     * @desc Add font to cache
     * @function
     * @public
     * @param {MANTICORE.type.FontData} font
     * @param {string} fontName
     * @param {PIXI.BaseTexture} baseTexture
     * @param {number} resolution
     */

    addFont: function(font, fontName, baseTexture, resolution) {
        const fontData = {};
        const res = PIXI.utils.getResolutionOfUrl(baseTexture.imageUrl, resolution);

        fontData.font = fontName;
        fontData.size = font.size;
        fontData.lineHeight = font.lineHeight / res;
        fontData.chars = {};

        // parse letters
        const letters = font.chars;
        const letterCount =  letters.length;

        let i, letter, offset, dimension, kernings, kerningCount, kerning, first, second, amount, nameSplit;

        for (i = 0; i < letterCount; ++i) {
            letter = letters[i];

            offset = font.offsets[letter.offset];

            dimension = letter.dimensions;

            fontData.chars[letter.id] = {
                xOffset: offset[0] / res,
                yOffset: offset[1] / res,
                xAdvance: letter.ax / res,
                kerning: {},
                texture: new PIXI.Texture(baseTexture, new PIXI.Rectangle(
                    dimension[0] / res,
                    dimension[1] / res,
                    dimension[2] / res,
                    dimension[3] / res
                )),
                page: letter.page
            };
        }

        kernings = font.kerning;
        kerningCount = kernings.length;

        for (i = 0; i < kerningCount; ++i) {
            kerning = kernings[i];
            first = kerning[0] / res;
            second = kerning[1] / res;
            amount = kerning[2] / res;

            if (fontData.chars[second]) {
                fontData.chars[second].kerning[first] = amount;
            }
        }
        PIXI.extras.BitmapText.fonts[fontData.font] = fontData;
        nameSplit = fontData.font.split("_");

        if (nameSplit.length === 2) {
            this._addFontSize(nameSplit[0], parseInt(nameSplit[1], 10));
        }
    },

    /**
     * @function
     * @public
     * @param {string} name
     * @returns {boolean}
     */

    removeFont(name) {
        const index = Math.binaryIndexOf(name, this._font);

        if (index === -1) {
            return false;
        }

        delete BitmapText.fonts[name];

        const sizes = this._fontSizes.getElement(name);

        if (Type.isNull(sizes)) {
            return true;
        }

        const sizeCount = sizes.length;
        let sizeName, i, sizeIndex;

        for (i = 0; i < sizeCount; ++i) {
            sizeName = name + "_" + sizes[i];
            sizeIndex = Math.binaryIndexOf(sizeName, this._font);
            if (sizeIndex !== -1) {
                this._fonts.splice(sizeIndex, 1);
            }

            delete BitmapText.fonts[sizeName];
        }

        this._fontSizes.removeElement(name);

        return true;
    },

    /**
     * @desc Add font sizes to cache
     * @function
     * @private
     * @param {string} fontName
     * @param {int} size
     */

    _addFontSize: function(fontName, size) {
        let sizes;
        if (!this._fontSizes.hasElement(fontName)) {
            sizes = [];
            this._fontSizes.addElement(sizes, fontName);
        }
        else {
            sizes = this._fontSizes.getElement(fontName);
        }
        sizes.push(size);
        sizes.sort();
    },

    /**
     * @desc Return font name by size and default name.
     * @function
     * @param {string} fontName
     * @param {int} size
     * @return {string}
     */

    getFontName: function (fontName, size) {
        if (!this._fontSizes.hasElement(fontName)) {
            return fontName;
        }

        const sizes = this._fontSizes.getElement(fontName);
        const sizeCount = sizes.length;
        let resultSize, i;

        for (i = 0; i < sizeCount; ++i) {
            resultSize = sizes[i];
            if (size < resultSize) {
                break;
            }
        }
        return fontName + "_" + resultSize;
    }
};