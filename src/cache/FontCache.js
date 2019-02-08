import Repository from "repository/Repository";
import Math from "util/Math";
import Type from "util/Type";
import Rectangle from "geometry/Rectangle";

/**
 * @desc Namespace for manipulate with fonts.
 * @namespace fontCache
 * @memberOf MANTICORE.cache
 */

export default {
    /**
     * @desc Repository that contain font sizes, for set correct size.
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

    add: function(font, fontName, baseTexture, resolution) {
        const fontData = {};
        const res = PIXI.utils.getResolutionOfUrl(baseTexture.imageUrl, resolution);

        fontData.font = fontName;
        fontData.size = font.size;
        fontData.lineHeight = font.lineHeight;
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
                xOffset: offset[0],
                yOffset: offset[1],
                xAdvance: letter.ax,
                kerning: {},
                texture: new PIXI.Texture(baseTexture, Rectangle.create(
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
            first = kerning[0];
            second = kerning[1];
            amount = kerning[2];

            if (fontData.chars[second]) {
                fontData.chars[second].kerning[first] = amount;
            }
        }
        PIXI.extras.BitmapText.fonts[fontData.font] = fontData;
        nameSplit = fontData.font.split("_");

        if (nameSplit.length === 2) {
            const localName = nameSplit[0];
            const localSize = parseInt(nameSplit[1], 10);
            let sizes;
            if (!this._fontSizes.hasElement(localName)) {
                sizes = [];
                this._fontSizes.addElement(sizes, localName);
            }
            else {
                sizes = this._fontSizes.getElement(localName);
            }
            sizes.push(localSize);
            sizes.sort();
        }
    },

    /**
     * @function
     * @public
     * @param {string} name
     * @returns {boolean}
     */

    remove(name) {
        const index = Math.binaryIndexOf(name, this._fonts);

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
            sizeIndex = Math.binaryIndexOf(sizeName, this._fonts);
            if (sizeIndex !== -1) {
                this._fonts.splice(sizeIndex, 1);
            }

            delete BitmapText.fonts[sizeName];
        }

        this._fontSizes.removeElement(name);

        return true;
    },

    /**
     * @desc Return font name by size and default name.
     * @function
     * @param {string} fontName
     * @param {int} size
     * @return {string}
     */

    getName: function (fontName, size) {
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