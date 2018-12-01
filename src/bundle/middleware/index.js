import Type from "util/Type";
import Format from "util/Format";
import Macro from "macro";
import BUNDLE_TYPE from "enumerator/BundleType";
import FILE_TYPE from "enumerator/FileType";
import BundleCache from "cache/BundleCache";

/**
 * @desc Middlewares for load end generate bundles.
 * @namespace middleware
 * @memberOf MANTICORE.bundle
 */

const middleware = {
    /**
     * @function
     * @public
     * @param {MANTICORE.loader.LoaderResource} resource
     * @param {Function} next
     * @memberOf MANTICORE.bundle.middleware
     */
    bundleParser: function (resource, next) {
        if (resource.extension !== FILE_TYPE.JSON || Type.isEmpty(resource.data) || Type.isEmpty(resource.data["bundleType"])) {
            next();
            return;
        }

        /**
         * @type {MANTICORE.type.AssetBundle}
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

        const textureFormat = Macro.USE_WEB_P_FALLBACK ? FILE_TYPE.WEB_P : FILE_TYPE.PNG;
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