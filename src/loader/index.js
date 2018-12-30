import Type from "util/Type";
import Format from "util/Format";
import EventDispatcher from "eventDispatcher";
import ASSET_TYPE from "enumerator/AssetType";
import FILE_TYPE from  "enumerator/FileType";
import Boot from "boot";
import Macro from "macro";
import LOADER_EVENT from "enumerator/event/LoaderEvent";
import TEXTURE_FORMAT from "enumerator/TextureFormat";
import RESOLUTION from "enumerator/system/Resolution";
import Middleware from "bundle/middleware";

/**
 * @desc Contains loader for load bundles and other resources.
 * @namespace loader
 * @memberOf MANTICORE
 */

export default {
    /**
     * @type {MANTICORE.loader.AssetInfo[]}
     * @private
     */
    _assetsForLoad: [],
    /**
     * @type {MANTICORE.loader.AssetInfo[]}
     * @private
     */
    _assetsLoaded: [],

    /**
     * @desc Flag is loader init.
     * @type {boolean}
     * @private
     */

    _isInit: false,

    /**
     * @desc Flag is loader currently load.
     * @type {boolean}
     * @private
     */

    _isLoading: false,

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @function
     * @public
     * @memberOf MANTICORE.loader
     * @param {string} name
     * @param {MANTICORE.enumerator.ASSET_TYPE} type
     * @param {string} [path = null]
     * @param {MANTICORE.enumerator.FILE_TYPE | string} [resolution = null]
     * @param {boolean} [useAssetDir = true]
     */

    addAsset: function(name, type, path = null, resolution = null, useAssetDir = true) {
        if (this._isLoading) {
            return;
        }
        this._assetsForLoad.push({
            name: name,
            type: type,
            path: path,
            resolution: resolution,
            useAssetDir: true
        });
    },

    load() {
        if (this._isLoading) {
            return;
        }
        this._isLoading = true;
        let resolutionSuffix;
        switch(Boot.RESOLUTION) {
            case RESOLUTION.UD: {
                resolutionSuffix = "ud";
                break;
            }
            case RESOLUTION.HD: {
                resolutionSuffix = "hd";
                break;
            }
            default: {
                resolutionSuffix = "sd";
                break;
            }
        }
        const assetCount = this._assetsForLoad.length;
        let asset, i;
        const imageFormat = Macro.USE_WEB_P_FALLBACK && (Boot.SUPPORTED_FORMATS.indexOf(TEXTURE_FORMAT.WEB_P) !== -1) ? FILE_TYPE.WEB_P : FILE_TYPE.PNG;
        const bundleName = "bundle_" + (Boot.isDesktop() ? "d" : "m") + "_" + resolutionSuffix;
        let useBundle = false;
        for (i = 0; i < assetCount; ++i) {
            asset = this._assetsForLoad[i];
            switch (asset.type) {
                case ASSET_TYPE.DATA: {
                    this._addAssetToLoader(asset, "data", FILE_TYPE.JSON);
                    break;
                }
                case ASSET_TYPE.IMAGE: {
                    this._addAssetToLoader(asset, "image", imageFormat);
                    break;
                }
                case ASSET_TYPE.BUNDLE: {
                    useBundle = true;
                    this._addAssetToLoader(asset, "bundle", FILE_TYPE.JSON, bundleName);
                    break;
                }
                case ASSET_TYPE.SOUND: {
                    this._addAssetToLoader(asset, "sound", FILE_TYPE.MP3);
                    break;
                }
                default: {
                    this._addAssetToLoader(asset, "unknown");
                    break;
                }
            }
        }

        if (useBundle) {
            PIXI.loader.use(Middleware.bundleParser);
        }

        if (!this._isInit) {
            PIXI.loader.onProgress.add(this._onLoadProgress.bind(this));
            PIXI.loader.onComplete.add(this._onLoadComplete.bind(this));
            this._isInit = true;
        }
        EventDispatcher.dispatch(LOADER_EVENT.START);
        PIXI.loader.load();
    },

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @function
     * @private
     * @memberOf MANTICORE.loader
     */

    _onLoadProgress: function () {
        console.log("PROGRESS", arguments);
        EventDispatcher.dispatch(LOADER_EVENT.PROGRESS);
    },

    /**
     * @param {MANTICORE.loader.AssetInfo} asset
     * @param {string} nameSuffix
     * @param {MANTICORE.enumerator.FILE_TYPE | string | null} [fileType = null]
     * @param {?string} [pathSuffix = null]
     * @private
     * @memberOf MANTICORE.loader
     */

    _addAssetToLoader(asset, nameSuffix, fileType = null, pathSuffix = null) {
        const name = asset.name + "_" + nameSuffix;
        const basePath = asset.useAssetDir ? Macro.ASSET_DIR : "";
        const resolution = Type.setValue(asset.resolution, fileType);
        let filePath = (basePath !== "" ? basePath + "/" : "") + Type.setValue(asset.path, asset.name);
        if (!Type.isNull(pathSuffix)) {
            filePath += "/" + pathSuffix;
        }
        if (!Type.isNull(resolution)) {
            filePath = Format.addFileType(filePath, resolution);
        }
        PIXI.loader.add(name, filePath);
    },

    /**
     * @function
     * @memberOf MANTICORE.loader
     * @private
     */

    _onLoadComplete: function () {
        const assetCount = this._assetsForLoad.length;
        for (let i = 0; i < assetCount; ++i) {
            this._assetsLoaded.push(this._assetsForLoad[i]);
        }
        this._assetsForLoad.length = 0;
        this._isLoading = false;
        EventDispatcher.dispatch(LOADER_EVENT.COMPLETE);
    },

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @memberOf MANTICORE.loader
     * @return {MANTICORE.loader.AssetInfo[]}
     */

    get assetForLoad() {
        return this._assetsForLoad;
    },

    /**
     * @public
     * @memberOf MANTICORE.loader
     * @return {MANTICORE.loader.AssetInfo[]}
     */

    get assetLoaded()  {
        return this._assetsLoaded;
    },

    /**
     * @public
     * @memberOf MANTICORE.loader
     * @return {boolean}
     */

    get isLoading() {
        return this._isLoading;
    }
};

/**
 * @typedef {Object}
 * @name AssetInfo
 * @memberOf MANTICORE.loader
 * @property {string} name
 * @property {string} path
 * @property {MANTICORE.enumerator.ASSET_TYPE} type
 * @property {MANTICORE.enumerator.FILE_TYPE | string} resolution
 * @property {boolean} useAssetDir
 */