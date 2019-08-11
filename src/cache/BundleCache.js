import Repository from "repository/Repository";
import AssetBundle from "bundle/bundle/AssetBundle";

/**
 * @desc Cache to store bundles.
 * @namespace bundleCache
 * @memberOf mCore.cache
 */

export default {
    /**
     * @desc Repository with asset bundles
     * @type {mCore.repository.Repository}
     * @private
     */
    _assetBundles: new Repository(),
    /**
     * @desc Repository with locale bundles
     * @type {mCore.repository.Repository}
     * @private
     */
    _localeBundles: new Repository(),

    /**
     * @desc Add asset bundle to cache
     * @function
     * @public
     * @param {mCore.type.AssetBundle} data
     * @return {mCore.bundle.bundle.AssetBundle | null}
     */

    addAssetBundle: function(data) {
        if (this._assetBundles.hasElement(data.name)) {
            return null;
        }
        const result = new AssetBundle(data);
        this._assetBundles.addElement(result, data.name);
        return result;
    },

    /**
     * @desc returns asset bundle by name.
     * @function
     * @public
     * @param {string} name
     * @return {mCore.bundle.bundle.AssetBundle | null}
     */

    getAssetBundle: function(name) {
        return this._assetBundles.getElement(name);
    },

    /**
     * @desc Remove asset bundle from cache.
     * @function
     * @public
     * @param {string} name
     * @returns {boolean}
     */

    removeAssetBundle: function(name) {
        return this._assetBundles.removeElement(name);
    }
};
