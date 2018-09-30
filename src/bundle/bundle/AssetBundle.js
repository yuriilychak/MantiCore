import BaseBundle from "./BaseBundle";
import BUNDLE_TYPE from "../../enumerator/BundleType";
import TextureAtas from "bundle/ancillary/TextureAtlas";

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
    }
}

export default AssetBundle;