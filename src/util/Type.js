/**
 * @desc Contains function for manipulate with types.
 * @namespace type
 * @memberOf MANTICORE.util
 */

export default {

    /**
     * @desc Check the obj whether is undefined or not.
     * @function
     * @param {*} obj
     * @returns {boolean}
     */

    isUndefined: function (obj) {
        return typeof obj === "undefined";
    },

    /**
     * @desc Check is obj null.
     * @function
     * @param {*} obj
     * @returns {boolean}
     */

    isNull: function (obj) {
        return obj === null;
    },

    /**
     * @desc Check is obj null or undefined.
     * @function
     * @param {*} obj
     * @returns {boolean}
     */

    isEmpty: function (obj) {
        return this.isNull(obj) || this.isUndefined(obj);
    },

    /**
     * @desc Check prototype.
     * @function
     * @param {Object} obj
     * @param {string} link
     * @returns {boolean}
     * @private
     */

    _isProtoEqual: function (obj, link) {
        return Object.prototype.toString.call(obj) === "[object " + link + "]";
    },

    /**
     * @desc Check the obj whether is function or not
     * @function
     * @param {*} obj
     * @returns {boolean}
     */
    isFunction: function (obj) {
        return typeof obj === 'function';
    },

    /**
     * @desc Check the obj whether is number or not
     * @function
     * @param {*} obj
     * @returns {boolean}
     */
    isNumber: function (obj) {
        return typeof obj === 'number' || this._isProtoEqual(obj, "Number");
    },

    /**
     * @desc Check the obj whether is string or not
     * @function
     * @param {*} obj
     * @returns {boolean}
     */

    isString: function (obj) {
        return typeof obj === "string" || this._isProtoEqual(obj, "String");
    },

    /**
     * @desc Init value if ite empty returns default value;
     * @function
     * @param {*} value
     * @param [defaultValue = null]
     * @returns {*}
     */

    setValue: function (value, defaultValue = null) {
        return !this.isEmpty(value) ? value : defaultValue;
    },

    /**
     * @desc Check the obj whether is array or not
     * @function
     * @param {*} obj
     * @returns {boolean}
     */

    isArray: function (obj) {
        return Array.isArray(obj) || (typeof obj === "object" && this._isProtoEqual(obj, "Array"));
    },

    /**
     * @desc Check the obj whether is object or not
     * @function
     * @param {*} obj
     * @returns {boolean}
     */

    isObject: function (obj) {
        return typeof obj === "object" && this._isProtoEqual(obj, "Object");
    }
};