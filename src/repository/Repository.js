import Type from "util/Type";

/**
 * @desc Repository for store data with fast search;
 * @class
 * @memberOf MANTICORE.repository
 */

class Repository {
    /**
     * @constructor
     */
    constructor () {
        /**
         * @desc Array with keys;
         * @type {int[] | string[]}
         * @private
         */
        this._keys = [];
        /**
         * @desc Array with values;
         * @type {Array}
         * @private
         */
        this._values = [];
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Add value to repository, if element already exist don't add and return false.
     * @param {*} value - Value to store;
     * @param {int | ?string} [key = null] - Key of element
     * @returns {boolean}
     */

    addElement(value, key = null) {
        if (!Type.isEmpty(value.id) && Type.isEmpty(key)) {
            key = value.id;
        }

        if (this.hasElement(key)) {
            return false;
        }
        this._keys.push(key);
        this._values.push(value);
        return true;
    }

    /**
     * @desc Update element of repository, return false if it isn't exist.
     * @method
     * @public
     * @param {*} value - Value to store;
     * @param {int | string} [key] - Key of element
     * @returns {boolean}
     */

    updateElement(value, key) {
        if (!Type.isEmpty(value.id)) {
            key = value.id;
        }
        const index = this._getKeyIndex(key);

        if (index === -1) {
            return false;
        }

        if (this._values[index] === value) {
            return true;
        }

        this._values[index] = value;
        return true;
    }

    /**
     * @desc Remove element from repository, if it isn't exist return false;
     * @method
     * @public
     * @param {int | string} key
     * @param {boolean} [isKill = false] - Is need to kill element if it has function.
     * @returns {boolean}
     */

    removeElement(key, isKill = false) {
        const index = this._getKeyIndex(key);

        if (index === -1) {
            return false;
        }

        this._keys.splice(index, 1);
        const element = this._values.splice(index, 1);

        if (isKill) {
            this._killElement(element);
        }

        return true;
    }

    /**
     * @desc Returns is repository has element with key;
     * @method
     * @param {int | string} key
     * @returns {boolean}
     */

    hasElement(key) {
        return this._getKeyIndex(key) !== -1;
    }

    /**
     * @desc Returns element of repository, if it isn't exist returns null;
     * @method
     * @public
     * @param {int | string} key
     * @returns {*}
     */

    getElement(key) {
        const index = this._getKeyIndex(key);
        return index !== -1 ? this._values[index] : null;
    }

    /**
     * @desc Clear repository;
     * @method
     * @public
     * @param {boolean} [isKillValues = false] - Is need to kill values.
     */

    clear(isKillValues = false) {
        this._keys.length = 0;
        if (isKillValues) {
            const valueCount = this._values.length;
            for (let i = 0; i < valueCount; ++i) {
                this._killElement(this._values[i]);
            }
        }
        this._values.length = 0;
    }

    /**
     * @desc Returns is repository empty;
     * @method
     * @public
     * @returns {boolean}
     */

    isEmpty() {
        return this._keys.length === 0;
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Try kill element.
     * @method
     * @private
     * @param {*} element
     */

    _killElement(element) {
        if (element instanceof Repository) {
            element.clear(true);
            return;
        }
        if (!Type.isObject(element) || Type.isUndefined(element.kill)) {
            return;
        }
        element.kill();
    }

    /**
     * @desc Returns index of key;
     * @method
     * @private
     * @param {int | string} key
     * @returns {int}
     */

    _getKeyIndex(key) {
        return this._keys.indexOf(key);
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns copy of array with keys;
     * @type {int[] | string[]}
     */

    get keys() {
        return this._keys.slice(0);
    }

    /**
     * @desc Returns copy of array with values;
     * @type {Array}
     */

    get values() {
        return this._values.slice(0);
    }

    /**
     * @desc Returns size of repository.
     * @public
     * @return {int}
     */

    get length() {
        return this._keys.length;
    }
}

export default Repository;