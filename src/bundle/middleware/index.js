import Type from "util/Type";
import Format from "util/Format";
import TEXTURE_FORMAT from "enumerator/TextureFormat";
import Macro from "macro";
import Boot from "boot";
import BUNDLE_TYPE from "enumerator/BundleType";
import FILE_TYPE from "enumerator/FileType";
import BundleCache from "cache/BundleCache";

/**
 * @desc Middlewares for load end generate bundles.
 * @namespace middleware
 * @memberOf mCore.bundle
 */

const middleware = {
    /**
     * @function
     * @public
     * @param {mCore.loader.LoaderResource} resource
     * @param {Function} next
     * @memberOf mCore.bundle.middleware
     */
    bundleParser: function (resource, next) {
        if (resource.extension !== FILE_TYPE.JSON || Type.isEmpty(resource.data) || Type.isEmpty(resource.data["bundleType"])) {
            next();
            return;
        }

        /**
         * @type {mCore.type.AssetBundle}
         */

        const data = resource.data;
        const bundleType = resource.data.bundleType;
        let bundle = null;

        switch (bundleType) {
            case BUNDLE_TYPE.ASSET: {
                bundle = BundleCache.addAssetBundle(data);
                break;
            }
            default: {
                bundle = null;
                return;
            }
        }

        if (Type.isNull(bundle)) {
            next();
            return;
        }

        //TODO If texture loaded mark as loaded, and generate atlas.

        const textures = bundle.linkedTextures;
        const textureCount = textures.length;
        const url = resource.url;
        const loadOptions = {
            crossOrigin: resource.crossOrigin,
            metadata: resource.metadata.imageMetadata,
            parentResource: resource,
        };

        const textureFormat = Macro.USE_WEB_P_FALLBACK && (Boot.SUPPORTED_FORMATS.indexOf(TEXTURE_FORMAT.WEB_P) !== -1) ? FILE_TYPE.WEB_P : FILE_TYPE.PNG;
        let index = 0;
        let loadPath = Format.changeBaseName(url, Format.addFileType(textures[index].name, textureFormat));

        const onTextureLoad = (imageRes) =>
        {
            if (imageRes.error)
            {
                next(imageRes.error);
                return;
            }

            bundle.generateTextureAtlas(imageRes.texture.baseTexture, textures[index].atlas);

            ++index;

            if (index === textureCount) {
                bundle.atlasLoadComplete();
                next();
                return;
            }

            loadPath = Format.changeBaseName(url, Format.addFileType(textures[index].name, textureFormat));
            this.add(textures[index].link, loadPath, loadOptions, onTextureLoad);
        };
        this.add(textures[index].link, loadPath, loadOptions, onTextureLoad);
    }
};


export default middleware;
