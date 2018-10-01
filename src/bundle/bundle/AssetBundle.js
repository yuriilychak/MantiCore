import BaseBundle from "./BaseBundle";
import BUNDLE_TYPE from "enumerator/BundleType";
import TextureAtas from "bundle/ancillary/TextureAtlas";
import FontCache from "ui/fontCache";

/**
 * @desc Class for store asset bundles
 * @class
 * @memberOf MANTICORE.bundle.bundle
 * @extends MANTICORE.bundle.bundle.BaseBundle
 */

class AssetBundle extends BaseBundle {
    /**
     * @constructor
     * @param {MANTICORE.type.AssetBundle} data
     */
    constructor (data) {
        super(data);

        this.type = BUNDLE_TYPE.ASSET;

        const atlases = data.atlases;
        const atlasCount = atlases.length;

        /**
         * @desc Array with information about textures that use bundle.
         * @type {MANTICORE.bundle.bundle.LinkedTexture[]}
         * @private
         */

        this._linkedTextures = [];

        /**
         * @desc Array with texture atlases that use bundle.
         * @type {MANTICORE.bundle.ancillary.TextureAtlas[]}
         * @private
         */

        this._textureAtlases = [];

        let i, j , images, atlas, imageCount;

        for (i = 0; i < atlasCount; ++i) {
            atlas = atlases[i];
            images = atlases[i].images;
            imageCount = images.length;
            for (j = 0; j < imageCount; ++j) {
                this._linkedTextures.push({
                    link: data.name + "_" + images[i],
                    name: images[i],
                    isLoaded: false,
                    atlas: atlas
                });
            }
        }
    }

    /**
     * @public
     * @return {MANTICORE.bundle.bundle.LinkedTexture[]}
     */

    get linkedTextures() {
        return this._linkedTextures;
    }

    /**
     * @method
     * @public
     * @param {PIXI.BaseTexture} baseTexture
     * @param {MANTICORE.type.AtlasInfo} atlas
     */

    generateTextureAtlas(baseTexture, atlas) {
        this._textureAtlases.push(new TextureAtas(baseTexture, atlas, this.data));
        if (atlas.name !== "main") {
            return;
        }
        const fonts = this.data.fontData;
        const fontCount = fonts.length;
        const resolution = 1;

        let font, i, j, letterCount, fontData, res, kernings, kerningCount, nameSplit,
            kerning, letters, letter, offset, first, second, amount;


        for (i = 0; i < fontCount; ++i) {
            font = fonts[i];
            fontData = {};
            res = PIXI.utils.getResolutionOfUrl(baseTexture.imageUrl, resolution);

            fontData.font = this.data.fonts[i];
            fontData.size = font.size;
            fontData.lineHeight = font.lineHeight / res;
            fontData.chars = {};


            // parse letters
            letters = font.chars;
            letterCount =  letters.length;

            for (j = 0; j < letterCount; ++j) {
                letter = letters[j];

                offset = font.offsets[letter.offset];

                fontData.chars[letter.id] = {
                    xOffset: offset[0] / res,
                    yOffset: (offset[1] + (font.base / 3)) / res,//TODO Workaround fix later
                    xAdvance: letter.ax / res,
                    kerning: {},
                    texture: new PIXI.Texture(baseTexture, new PIXI.Rectangle(
                        letter.dimensions[0] / res,
                        letter.dimensions[1] / res,
                        letter.dimensions[2] / res,
                        letter.dimensions[3] / res
                    )),
                    page: letter.page
                };
            }

            kernings = font.kerning;
            kerningCount = kernings.length;

            for (j = 0; j < kerningCount; ++j) {
                kerning = kernings[j];
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
                FontCache.addFontSize(nameSplit[0], parseInt(nameSplit[1], 10));
            }
        }
    }
}

export default AssetBundle;