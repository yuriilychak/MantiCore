import Math from "util/Math";
import Type from "util/Type";

/**
 * @desc Class for manipulate with atlases.
 * @class
 * @memberOf MANTICORE.bundle.ancillary
 */

class TextureAtlas {
    /**
     * @constructor
     * @param {PIXI.BaseTexture} baseTexture
     * @param {MANTICORE.type.AtlasInfo} atlas
     * @param {MANTICORE.type.AssetBundle} bundle
     */

    constructor(baseTexture, atlas, bundle) {
        /**
         * @desc Reference to the source texture.
         * @type {PIXI.BaseTexture}
         * @private
         */
        this._baseTexture = baseTexture;

        /**
         * @desc Array with frames that use atlas.
         * @type {PIXI.Texture[]}
         * @private
         */
        this._frames = [];

        /**
         * @desc Source file for atlas
         * @type {MANTICORE.type.AtlasInfo}
         * @private
         */

        this._source = atlas;

        const scale = this._source.scale;

        /**
         *
         * @type {number}
         * @private
         */
        this._resolution = PIXI.utils.getResolutionOfUrl(this._baseTexture.imageUrl, null);

        if (Type.isNull(this._resolution)) {
            this._resolution = scale;
        }

        // For non-1 resolutions, update baseTexture
        if (this._resolution !== 1)
        {
            this._baseTexture.resolution = this._resolution;
            this._baseTexture.update();
        }

        const frames = this._source.frames;
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
                    dimensions[frame.rotated ? 2 : 3],
                    scale
                ),
                this._createUVRect(0, 0, sourceSize[0], sourceSize[1], scale),
                frame.trimmed ? this._createUVRect(
                    frame.spriteDimensions[0],
                    frame.spriteDimensions[1],
                    dimensions[2],
                    dimensions[3],
                    scale
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
     * @return {PIXI.Rectangle}
     * @private
     */

    _createUVRect(x, y, width, height, scale) {
        return new PIXI.Rectangle(
            this._calculateUV(x, scale),
            this._calculateUV(y, scale),
            this._calculateUV(width, scale),
            this._calculateUV(height, scale)
        );
    }

    /**
     * @desc Calculate UV cord for dimension
     * @method
     * @param {int} value
     * @param  {number} scale
     * @return {number}
     * @private
     */

    _calculateUV(value, scale) {
        return Math.floor(value * scale) / this._resolution;
    }

    /**
     * @method
     * @private
     * @param {int} index
     * @param {MANTICORE.type.AssetBundle} bundle
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
     * @memberOf MANTICORE.ui.parser
     * @param {int} index
     * @param {MANTICORE.type.AssetBundle} bundle
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

export default TextureAtlas;