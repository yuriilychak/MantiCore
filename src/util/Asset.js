import FILE_TYPE from "enumerator/FileType";
import Macro from "macro";
import Format from "./Format";
import ParticleCache from "cache/ParticleCache";

/**
 * @desc Namespace that contain functions for manipulate with assets
 * @namespace mCore.util.asset
 * @memberOf mCore.util
 */

const asset = {

    /**
     * @desc Get sprite frame if it exist or return null.
     * @function
     * @memberOf mCore.util.asset
     * @param {string} link
     * @return {PIXI.Texture | null}
     */

    getSpriteFrame: function(link) {
        const textureCache = PIXI.utils.TextureCache;

        if (textureCache[link]) {
            return PIXI.Texture.from(link);
        }
        const typedLink = Format.addFileType(link, FILE_TYPE.PNG);

        if (textureCache[typedLink]) {
            return PIXI.Texture.from(typedLink);
        }

        return null;
    },

    /**
     * @desc Create white sprite from default PIXI texture.
     * @function
     * @public
     * @memberOf mCore.util.asset
     * @returns {PIXI.Sprite}
     */

    createWhiteSprite() {
        return PIXI.Sprite.from(PIXI.Texture.WHITE);
    }
};

export default asset;
