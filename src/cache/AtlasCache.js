import Repository from "repository/Repository";
import Rectangle from "geometry/Rectangle";
import Type from "util/Type";
import ReusableObject from "../memory/ReusableObject";

/**
 * @desc Namespace for manipulate with atlases.
 * @namespace fontCache
 * @memberOf mCore.cache
 */

export default {
    /**
     * @desc Repository that contain atlases.
     * @type {mCore.repository.Repository}
     * @private
     */

    _atlases: new Repository(),

    /**
     * @desc Add atlas to cache.
     * @function
     * @public
     * @param {string} name
     * @param {PIXI.BaseTexture} baseTexture
     * @param {mCore.type.AtlasInfo} atlas
     * @param {mCore.type.AssetBundle} bundle
     */

    add(name, baseTexture, atlas, bundle) {
        this._atlases.addElement(new TextureAtlas(baseTexture, atlas, bundle), name);
    },

    /**
     * @desc Remove atlas from cache.
     * @function
     * @public
     * @param {string} name
     * @returns {boolean}
     */

    remove(name) {
        return this._atlases.removeElement(name, true);
    }
}


/**
 * @desc Class for manipulate with atlases. Don't create it manually.
 * @class
 * @memberOf mCore.cache.fontCache
 * @extends mCore.memory.ReusableObject
 */

class TextureAtlas extends ReusableObject{
    /**
     * @constructor
     * @param {PIXI.BaseTexture} baseTexture
     * @param {mCore.type.AtlasInfo} atlas
     * @param {mCore.type.AssetBundle} bundle
     */

    constructor(baseTexture, atlas, bundle) {
        super();

        /**
         * @desc Reference to the source texture.
         * @type {?PIXI.BaseTexture}
         * @private
         */
        this._baseTexture = null;

        /**
         * @desc Array with frames that use atlas.
         * @type {PIXI.Texture[]}
         * @private
         */
        this._frames = [];

        /**
         *
         * @type {number}
         * @private
         */
        this._resolution = 1;

        this._init(baseTexture, atlas, bundle);

        this.reusable = true;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {PIXI.BaseTexture} baseTexture
     * @param {mCore.type.AtlasInfo} atlas
     * @param {mCore.type.AssetBundle} bundle
     */
    reuse(baseTexture, atlas, bundle) {
        this._init(baseTexture, atlas, bundle);
        super.reuse();
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
        const frameCount = this._frames.length;

        for (let i = 0; i < frameCount; ++i) {
            PIXI.Texture.removeFromCache(this._frames[i]);
        }

        this._frames = [];

        PIXI.Texture.removeFromCache(this._baseTexture);

        this._baseTexture = null;

        this._resolution = 1;

        super.clearData();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Initialize texture
     * @method
     * @private
     * @param {PIXI.BaseTexture} baseTexture
     * @param {mCore.type.AtlasInfo} atlas
     * @param {mCore.type.AssetBundle} bundle
     */

    _init(baseTexture, atlas, bundle) {


        this._baseTexture = baseTexture;

        const scale = atlas.scale;

        this._resolution = PIXI.utils.getResolutionOfUrl(this._baseTexture.url, null);

        if (Type.isNull(this._resolution)) {
            this._resolution = scale;
        }

        // For non-1 resolutions, update baseTexture
        if (this._resolution !== 1)
        {
            this._baseTexture.resolution = this._resolution;
            this._baseTexture.update();
        }

        const frames = atlas.frames;
        const frameCount = frames.length;
        let i, frame, sourceSize, textureFrame, dimensions;

        for (i = 0; i < frameCount; ++i) {
            frame = frames[i];
            dimensions = frame.dimensions;
            sourceSize = frame.trimmed ? frame.sourceSize : [frame.dimensions[2], frame.dimensions[3]];

            textureFrame = new PIXI.Texture(
                this._baseTexture,
                this._createUVRect(
                    dimensions[0],
                    dimensions[1],
                    dimensions[frame.rotated ? 3 : 2],
                    dimensions[frame.rotated ? 2 : 3]
                ),
                this._createUVRect(0, 0, sourceSize[0], sourceSize[1]),
                frame.trimmed ? this._createUVRect(
                    frame.spriteDimensions[0],
                    frame.spriteDimensions[1],
                    dimensions[2],
                    dimensions[3]
                ) : null,
                frame.rotated ? 2 : 0
            );

            this._frames.push(textureFrame);
            PIXI.Texture.addToCache(textureFrame, this._getTextureFromData(frame.id, bundle));
        }
    }

    /**
     * @desc Create UV rect from dimensions.
     * @param {int} x
     * @param {int} y
     * @param {int} width
     * @param {int} height
     * @param {number} scale
     * @return {mCore.geometry.Rectangle}
     * @private
     */

    _createUVRect(x, y, width, height) {
        return Rectangle.create(
            this._calculateUV(x),
            this._calculateUV(y),
            this._calculateUV(width),
            this._calculateUV(height)
        );
    }

    /**
     * @desc Calculate UV cord for dimension
     * @method
     * @param {int} value
     * @return {number}
     * @private
     */

    _calculateUV(value) {
        return value / this._resolution;
    }

    /**
     * @method
     * @private
     * @param {int} index
     * @param {mCore.type.AssetBundle} bundle
     * @param {string} link
     * @param {*} defaultValue
     * @returns {*}
     */

    _extractValue(index, bundle, link, defaultValue) {
        return index !== -1 ? bundle[link][index] : defaultValue;
    }

    /**
     * @method
     * @private
     * @memberOf mCore.ui.parser
     * @param {int} index
     * @param {mCore.type.AssetBundle} bundle
     * @returns {string | null}
     */

    _getTextureFromData(index, bundle) {
        const parts = [];
        const decomposedTexture = this._extractValue(index, bundle, "textures", []);
        const partCount = decomposedTexture.length;

        for (let i = 0; i < partCount; ++i) {
            parts.push(this._extractValue(decomposedTexture[i], bundle, "textureParts", ""));
        }
        const result = parts.join("/");
        return result.length !== 0 ? result : null;
    }
}
