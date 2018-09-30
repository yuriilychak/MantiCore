import Repository from "repository/Repository";
import AssetBundle from "./bundle/AssetBundle";

/**
 * @desc Cache to store bundles.
 * @namespace bundleCache
 * @memberOf MANTICORE.bundle
 */

export default {
    /**
     * @desc Repository with asset bundles
     * @type {MANTICORE.repository.Repository}
     * @private
     */
    _assetBundles: new Repository(),
    /**
     * @desc Repository with locale bundles
     * @type {MANTICORE.repository.Repository}
     * @private
     */
    _localeBundles: new Repository(),

    /**
     * @function
     * @public
     * @param {Object} data
     * @return {*}
     */

    addAssetBundle: function(data) {
        if (this._assetBundles.hasElement(data.name)) {
            return null;
        }
        const result = new AssetBundle(data);
        this._assetBundles.addElement(result, data.name);
        return result;
    }
};