import BaseBundle from "./BaseBundle";
import BUNDLE_TYPE from "enumerator/BundleType";
import TextureAtlas from "bundle/ancillary/TextureAtlas";
import FontCache from "cache/FontCache";
import Constant from "constant";

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

        let i, images, atlas;

        for (i = 0; i < atlasCount; ++i) {
            atlas = atlases[i];
            images = atlases[i].images;
            this._linkedTextures.push({
                link: data.name + "_" + images[0],
                name: images[0],
                isLoaded: false,
                atlas: atlas
            });
        }
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @public
     * @param {PIXI.BaseTexture} baseTexture
     * @param {MANTICORE.type.AtlasInfo} atlas
     */

    generateTextureAtlas(baseTexture, atlas) {
        this._textureAtlases.push(new TextureAtlas(baseTexture, atlas, this.data));
        if (atlas.name !== Constant.MAIN_ATLAS_NAME) {
            return;
        }
        const fonts = this.data.fontData;
        const fontCount = fonts.length;
        const resolution = 1;

        for (let i = 0; i < fontCount; ++i) {
            FontCache.addFont(fonts[i], this.data.fonts[i], baseTexture, resolution);
        }
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @return {MANTICORE.bundle.bundle.LinkedTexture[]}
     */

    get linkedTextures() {
        return this._linkedTextures;
    }
}

export default AssetBundle;