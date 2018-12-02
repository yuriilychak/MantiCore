import BaseBundle from "./BaseBundle";
import BUNDLE_TYPE from "enumerator/BundleType";
import FontCache from "cache/FontCache";
import AtlasCache from "cache/AtlasCache";
import SpineCache from "cache/SpineCache";
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

        /**
         * @desc Array with information about textures that use bundle.
         * @type {MANTICORE.bundle.bundle.LinkedTexture[]}
         * @private
         */

        this._linkedTextures = [];

        /**
         * @desc Array with texture atlases that use bundle.
         * @type {string[]}
         * @private
         */

        this._atlases = [];

        /**
         * @desc Array with fonts that use bundle.
         * @type {string[]}
         * @private
         */

        this._fonts = [];

        /**
         * @desc Array with skeletons that use bundle.
         * @type {string[]}
         * @private
         */

        this._skeletons = [];

        this.type = BUNDLE_TYPE.ASSET;

        this._init(data);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {Object} data
     */
    reuse(data) {
        this._init(data);
        super.reuse(data);
    }

    /**
     * @method
     * @public
     * @param {PIXI.BaseTexture} baseTexture
     * @param {MANTICORE.type.AtlasInfo} atlas
     */

    generateTextureAtlas(baseTexture, atlas) {
        const atlasName = this.data.name + "_" + atlas.name;

        this._atlases.push(atlasName);

        AtlasCache.add(atlasName, baseTexture, atlas, this.data);

        if (atlas.name !== Constant.MAIN_ATLAS_NAME) {
            return;
        }
        const fonts = this.data.fontData;
        const fontCount = fonts.length;
        const resolution = 1;

        let i, fontName;

        for (i = 0; i < fontCount; ++i) {
            fontName = this.data.fonts[i];
            this._fonts.push(fontName);
            FontCache.add(fonts[i], fontName, baseTexture, resolution);
        }
    }

    /**
     * @desc Calls when all atlases updated.
     * @method
     * @public
     */

    atlasLoadComplete() {
        const skeletonNames = this.data.skeletonNames;
        const skeletons = this.data.skeletons;
        const skeletonCount = skeletonNames.length;

        for (let i = 0; i < skeletonCount; ++i) {
            this._skeletons.push(skeletonNames[i]);
            SpineCache.add(skeletonNames[i], skeletons[i]);
        }
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
        const fontCount = this._fonts.length;
        const atlasCount = this._atlases.length;
        const skeletonCount = this._skeletons.length;
        let i;
        for (i = 0; i < fontCount; ++i) {
            FontCache.remove(this._fonts[i]);
        }
        for (i = 0; i < atlasCount; ++i) {
            AtlasCache.remove(this._atlases[i]);
        }
        for (i = 0; i < skeletonCount; ++i) {
            SpineCache.remove(this._skeletons[i]);
        }

        this._fonts.length = 0;
        this._atlases.length = 0;
        this._linkedTextures.length = 0;
        this._skeletons.length = 0;
        super.clearData();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @private
     * @param {MANTICORE.type.AssetBundle} data
     */

    _init(data) {
        const atlases = data.atlases;
        const atlasCount = atlases.length;

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