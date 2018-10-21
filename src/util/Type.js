/**
 * @desc Contains function for manipulate with types.
 * @namespace MANTICORE.util.type
 * @memberOf MANTICORE.util
 */

const type = {

    /**
     * @desc Check the obj whether is undefined or not.
     * @function
     * @memberOf MANTICORE.util.type
     * @param {*} obj
     * @returns {boolean}
     */

    isUndefined: function (obj) {
        return typeof obj === "undefined";
    },

    /**
     * @desc Check is obj null.
     * @function
     * @memberOf MANTICORE.util.type
     * @param {*} obj
     * @returns {boolean}
     */

    isNull: function (obj) {
        return obj === null;
    },

    /**
     * @desc Check is obj null or undefined.
     * @function
     * @memberOf MANTICORE.util.type
     * @param {*} obj
     * @returns {boolean}
     */

    isEmpty: function (obj) {
        return this.isNull(obj) || this.isUndefined(obj);
    },

    /**
     * @desc Check prototype.
     * @function
     * @memberOf MANTICORE.util.type
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
     * @memberOf MANTICORE.util.type
     * @param {*} obj
     * @returns {boolean}
     */
    isFunction: function (obj) {
        return typeof obj === 'function';
    },

    /**
     * @desc Check the obj whether is number or not
     * @function
     * @memberOf MANTICORE.util.type
     * @param {*} obj
     * @returns {boolean}
     */
    isNumber: function (obj) {
        return typeof obj === 'number' || this._isProtoEqual(obj, "Number");
    },

    /**
     * @desc Check the obj whether is string or not
     * @function
     * @memberOf MANTICORE.util.type
     * @param {*} obj
     * @returns {boolean}
     */

    isString: function (obj) {
        return typeof obj === "string" || this._isProtoEqual(obj, "String");
    },

    /**
     * @desc Check the obj whether is array or not
     * @function
     * @memberOf MANTICORE.util.type
     * @param {*} obj
     * @returns {boolean}
     */

    isArray: function (obj) {
        return Array.isArray(obj) || (typeof obj === "object" && this._isProtoEqual(obj, "Array"));
    },

    /**
     * @desc Check the obj whether is object or not
     * @function
     * @memberOf MANTICORE.util.type
     * @param {*} obj
     * @returns {boolean}
     */

    isObject: function (obj) {
        return typeof obj === "object" && this._isProtoEqual(obj, "Object");
    },

    /**
     * @desc Init value if ite empty returns default value;
     * @function
     * @memberOf MANTICORE.util.type
     * @param {*} value
     * @param [defaultValue = null]
     * @returns {*}
     */

    setValue: function (value, defaultValue = null) {
        return !this.isEmpty(value) ? value : defaultValue;
    },

    /**
     * @desc Convert value to boolean
     * @function
     * @public
     * @param {*} value
     * @return {boolean}
     */

    toBoolean: function(value) {
        return !!value;
    }
};

export default type;