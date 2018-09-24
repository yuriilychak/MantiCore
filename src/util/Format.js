/**
 * @desc Namespace that contains function to manipulate with strings.
 * @namespace format
 * @memberOf MANTICORE.util
 */

export default {
    /**
     * @type {int}
     * @private
     */
    _eventId: 0,

    /**
     * @desc Add file type to string.
     * @public
     * @function
     * @param {string} value
     * @param {MANTICORE.enumerator.FILE_TYPE} type
     * @returns {string}
     */
    addFileType: function (value, type) {
        const suffix = "." + type;
        return value.indexOf(suffix) !== -1 ? value : value + suffix;
    },

    /**
     * @desc Format number value with numCount of zeros
     * @param {number | string}  value
     * @param {int}  numCount
     * @returns {string}
     * @function
     */

    formatNumber: function (value, numCount) {
        let stringValue = value.toString();
        return stringValue.length < numCount ? this.formatNumber("0" + stringValue, numCount) : stringValue;
    },

    /**
     * @desc Replace char at string and return it
     * @method
     * @public
     * @param {string} targetString - string to replace
     * @param {int}    index        - index of char
     * @param {string} char         - char to replace
     * @return {string}
     */

    replaceAt: function (targetString, index, char) {
        if (index > targetString.length - 1) {
            return targetString;
        }
        return targetString.substr(0, index) + char + targetString.substr(index + 1);
    },

    /**
     * @desc Generate unique event name.
     * @public
     * @function
     * @param {Object} target
     * @param {string} event
     * @return {string}
     */

    generateEventName(target, event) {
        return target.constructor.name + "_" + event + "_" + this.formatNumber(++this._eventId, 4);
    },

    /**
     * @desc Extract file name from path
     * @example "dir1/dir2/dir3/image.png" => "image";
     * @public
     * @function
     * @param {string} path
     * @returns {string}
     */

    getFileName: function (path) {
        const pathSplit = path.split("/");
        return pathSplit[pathSplit.length - 1].split(".")[0];
    },

    /**
     * @desc Replace values at string
     * @example "{0} is {1}", "1", "number" -> "1 is number"
     * @method
     * @public
     * @param {string...} var_args
     */

    replace: function (var_args) {
        let pattern = "{0}";
        let stringPattern = arguments[0];
        const replaceCount = arguments.length;

        for (let i = 1; i < replaceCount; ++i) {
            pattern = this.replaceAt(pattern, 1, (i - 1).toString());
            stringPattern = stringPattern.replace(pattern, arguments[i]);
        }
        return stringPattern;
    }
};