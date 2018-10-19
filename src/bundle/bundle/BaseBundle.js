import BUNDLE_TYPE from "../../enumerator/BundleType";

/**
 * @desc Base class for all bundles.
 * @class
 * @memberOf MANTICORE.bundle.bundle
 */

class BaseBundle {
    /**
     * @constructor
     * @param {Object} data
     */
    constructor (data) {
        /**
         * @type {Object}
         * @private
         */
        this._data = data;

        /**
         *
         * @type {MANTICORE.enumerator.BUNDLE_TYPE}
         * @private
         */

        this._type = BUNDLE_TYPE.NONE;
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @return {Object}
     */

    get data() {
        return this._data;
    }

    /**
     * @public
     * @return {MANTICORE.enumerator.BUNDLE_TYPE}
     */

    get type() {
        return this._type;
    }


    set type(value) {
        if (this._type === value) {
            return;
        }

        this._type = value;
    }
}

export default BaseBundle;