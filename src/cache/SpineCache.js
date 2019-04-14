import Repository from "repository/Repository";
import Asset from "util/Asset";
import Macro from "macro";
import Type from "util/Type";
import Logger from "logger";

/**
 * @desc Namespace for manipulate with spine skeletons.
 * @namespace spineCache
 * @memberOf MANTICORE.cache
 */

export default {
    /**
     * @desc Repository with skeleton data.
     * @type {MANTICORE.repository.Repository}
     * @private
     */
    _skeletons: new Repository(),

    /**
     * @desc Ad skeleton to cache.
     * @function
     * @public
     * @param {string} name
     * @param {Object} data
     */

    add: function (name, data) {
        if (this._skeletons.hasElement(name)) {
            return;
        }
        const atlas = new PIXI.spine.core.TextureAtlas();
        const skins = data.skins;
        let skinKey, skin, slotKey, slot, slotData, frame, frameName, spriteFrame;
        const frames = {};
        const pathKey = "path";

        for (skinKey in skins) {
            skin = skins[skinKey];
            for (slotKey in skin) {
                slot = skin[slotKey];
                for (frame in slot) {
                    slotData = slot[frame];
                    frameName = slotData.hasOwnProperty(pathKey) ? slotData[pathKey] : frame;
                    spriteFrame = Asset.getSpriteFrame(frameName);

                    if (Type.isEmpty(spriteFrame)) {
                        Logger.engineWarn(4, spriteFrame, name);
                    }

                    frames[frameName] = spriteFrame;
                }
            }
        }


        atlas.addTextureHash(frames, false);

        const spineAtlasLoader = new PIXI.spine.core.AtlasAttachmentLoader(atlas);
        const spineJsonParser = new PIXI.spine.core.SkeletonJson(spineAtlasLoader);

        spineJsonParser.scale = Macro.SPINE_SCALE;

        const spineData = spineJsonParser.readSkeletonData(data);
        this._skeletons.addElement(spineData, name);
    },

    /**
     * @desc Remove skeleton by name
     * @param {string} name
     * @returns {boolean}
     */

    remove: function (name) {
        return this._skeletons.removeElement(name);
    },

    /**
     * @desc Return skeleton data for create skeletons.
     * @function
     * @public
     * @param {string} name
     * @returns {PIXI.spine.core.SkeletonData}
     */

    getSkeleton: function (name) {
        return this._skeletons.getElement(name);
    },

    /**
     * @method
     * @public
     * @returns {string[]}
     */

    get names() {
        return this._skeletons.keys;
    }
}
