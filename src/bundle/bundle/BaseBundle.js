import BUNDLE_TYPE from "enumerator/BundleType";
import ReusableObject from "memory/ReusableObject";

/**
 * @desc Base class for all bundles.
 * @class
 * @memberOf mCore.bundle.bundle
 */

class BaseBundle extends ReusableObject {
    /**
     * @constructor
     * @param {Object} data
     */
    constructor (data) {
        super();
        /**
         * @type {Object}
         * @private
         */
        this._data = data;

        /**
         *
         * @type {mCore.enumerator.BUNDLE_TYPE}
         * @private
         */

        this._type = BUNDLE_TYPE.NONE;

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
     * @param {Object} data
     */
    reuse(data) {
        this._data = data;
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
        this._data = null;
        super.clearData();
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
     * @return {mCore.enumerator.BUNDLE_TYPE}
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
