import FILE_TYPE from "enumerator/FileType";
import Format from "./Format";

/**
 * @desc Namespace that contain functions for manipulate with assets
 * @namespace asset
 * @memberOf MANTICORE.util
 */

const asset = {

    /**
     * @desc Get sprite frame if it exist or return null.
     * @function
     * @memberOf MANTICORE.util.asset
     * @param {string} link
     * @return {PIXI.Texture | null}
     */

    getSpriteFrame: function(link) {
        const textureCache = PIXI.utils.TextureCache;

        if (textureCache[link]) {
            return PIXI.Texture.fromFrame(link);
        }
        const typedLink = Format.addFileType(link, FILE_TYPE.PNG);

        if (textureCache[typedLink]) {
            return PIXI.Texture.fromFrame(typedLink);
        }

        return null;
    },

    /**
     * @desc Create white sprite from default PIXI texture.
     * @function
     * @public
     * @memberOf MANTICORE.util.asset
     * @returns {PIXI.Sprite}
     */

    createWhiteSprite() {
        return PIXI.Sprite.from(PIXI.Texture.WHITE);
    }
};

export default asset;