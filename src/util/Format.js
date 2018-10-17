/**
 * @desc Namespace that contains function to manipulate with strings.
 * @namespace MANTICORE.util.format
 * @memberOf MANTICORE.util
 */

const format = {
    /**
     * @type {int}
     * @private
     */
    _eventId: 0,

    /**
     * @desc Add file type to string.
     * @public
     * @function
     * @memberOf MANTICORE.util.format
     * @param {string} value
     * @param {MANTICORE.enumerator.FILE_TYPE} type
     * @returns {string}
     */
    addFileType: function (value, type) {
        const suffix = "." + type;
        const index = value.lastIndexOf(suffix);
        return index === -1 || index + suffix.length !== value.length ? value + suffix : value;
    },

    /**
     * @desc Format number value with numCount of zeros
     * @function
     * @memberOf MANTICORE.util.format
     * @param {number | string}  value
     * @param {int}  numCount
     * @returns {string}
     */

    formatNumber: function (value, numCount) {
        let stringValue = value.toString();
        return stringValue.length < numCount ? this.formatNumber("0" + stringValue, numCount) : stringValue;
    },

    /**
     * @desc Replace char at string and return it
     * @function
     * @memberOf MANTICORE.util.format
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
     * @function
     * @memberOf MANTICORE.util.format
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
     * @function
     * @memberOf MANTICORE.util.format
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
     * @function
     * @memberOf MANTICORE.util.format
     * @param {...string} var_args
     * @returns {string}
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
    },

    /**
     * @desc Join strings to be a path.
     * @function
     * @public
     * @example
     * // returns "a/b.png"
     * MANTICORE.util.format.join("a", "b.png");
     * // returns "a/b/c.png"
     * MANTICORE.util.format.join("a", "b", "c.png");
     * // returns "a/b"
     * MANTICORE.util.format.join("a", "b");
     * // returns "a/b/"
     * MANTICORE.util.format.join("a", "b", "/");
     * // returns "a/b/"
     * MANTICORE.util.format.join("a", "b/", "/");
     * @param {...string} var_args
     * @returns {string}
     */

    join: function (var_args) {
        const count = arguments.length;
        const emptyStr = "";
        const regExp = /(\/|\\\\)$/;

        let result = emptyStr;
        let prefix, i;

        for (i = 0; i < count; ++i) {
            prefix = result === emptyStr ? emptyStr : "/";
            result = (result + prefix + arguments[i]).replace(regExp, emptyStr);
        }
        return result;
    },

    /**
     * @desc Get the ext name of a path.
     * @function
     * @public
     * @example
     * // returns ".png"
     * MANTICORE.util.format.extName("a/b.png");
     * // returns ".png"
     * MANTICORE.util.format.extName("a/b.png?a=1&b=2");
     * // returns ""
     * MANTICORE.util.format.extName("a/b");
     * // returns ""
     * MANTICORE.util.format.extName("a/b?a=1&b=2");
     * @param {string} pathStr
     * @returns {string}
     */

    extName: function (pathStr) {
        let temp = /(\.[^\.\/\?\\]*)(\?.*)?$/.exec(pathStr);
        return temp ? temp[1] : "";
    },

    /**
     * @desc Get the main name of a file name.
     * @function
     * @public
     * @param {string} fileName
     * @returns {string}
     */

    mainFileName: function (fileName) {
        if (fileName) {
            const index = fileName.lastIndexOf(".");
            if (index !== -1) {
                return fileName.substring(0, index);
            }
        }
        return fileName;
    },

    /**
     * @desc Get the file name of a file path.
     * @function
     * @public
     * @example
     * // returns "b.png"
     * MANTICORE.util.format.baseName("a/b.png");
     * // returns "b.png"
     * MANTICORE.util.format.baseName("a/b.png?a=1&b=2");
     * // returns "b"
     * MANTICORE.util.format.baseName("a/b.png", ".png");
     * // returns "b"
     * MANTICORE.util.format.baseName("a/b.png?a=1&b=2", ".png");
     * // returns "b.png"
     * MANTICORE.util.format.baseName("a/b.png", ".txt");
     * @param {string} pathStr
     * @param {string} [extName]
     * @returns {string}
     */

    baseName: function (pathStr, extName) {
        const index = pathStr.indexOf("?");

        if (index > 0) {
            pathStr = pathStr.substring(0, index);
        }

        const reg = /(\/|\\\\)([^(\/|\\\\)]+)$/g;
        const result = reg.exec(pathStr.replace(/(\/|\\\\)$/, ""));

        if (!result) {
            return "";
        }

        const baseName = result[2];

        if (extName && pathStr.substring(pathStr.length - extName.length).toLowerCase() === extName.toLowerCase()) {
            return baseName.substring(0, baseName.length - extName.length);
        }

        return baseName;
    },

    /**
     * @desc Get dir-name of a file path.
     * @function
     * @public
     * @example
     * unix
     * // returns "a/b"
     * MANTICORE.util.format.dirName("a/b/c.png");
     * // returns "a/b"
     * MANTICORE.util.format.dirName("a/b/c.png?a=1&b=2");
     * // returns "a/b"
     * MANTICORE.util.format.dirName("a/b/");
     * // returns ""
     * MANTICORE.util.format.dirName("c.png");
     * windows
     * // returns "a\b"
     * MANTICORE.util.format.dirName("a\\b\\c.png");
     * // returns "a\b"
     * MANTICORE.util.format.dirName("a\\b\\c.png?a=1&b=2");
     * @param {string} pathStr
     * @returns {string}
     */

    dirName: function (pathStr) {
        return pathStr.replace(/((.*)(\/|\\|\\\\))?(.*?\..*$)?/, '$2');
    },

    /**
     * @desc Change ext-name of a file path.
     * @function
     * @public
     * @example
     * // returns "a\b"
     * MANTICORE.util.format.changeExtName("a/b.png", ".plist");//-->"a/b.plist"
     * // returns "a\b"
     * MANTICORE.util.format.changeExtName("a/b.png?a=1&b=2", ".plist");//-->"a/b.plist?a=1&b=2"
     * @param {string} pathStr
     * @param {string} [extName = ""]
     * @returns {string}
     */

    changeExtName: function (pathStr, extName) {
        extName = cc.setValue(extName, "");
        let index = pathStr.indexOf("?");
        let tempStr = "";

        if (index > 0) {
            tempStr = pathStr.substring(index);
            pathStr = pathStr.substring(0, index);
        }

        index = pathStr.lastIndexOf(".");

        if (index < 0) {
            return pathStr + extName + tempStr;
        }
        return pathStr.substring(0, index) + extName + tempStr;
    },

    /**
     * @desc Change file name of a file path.
     * @function
     * @public
     * @example
     * // returns "a/b/b.plist"
     * MANTICORE.util.format.changeBaseName("a/b/c.plist", "b.plist");
     * // returns "a/b/b.plist?a=1&b=2"
     * MANTICORE.util.format.changeBaseName("a/b/c.plist?a=1&b=2", "b.plist");
     * // returns "a/b/c.png"
     * MANTICORE.util.format.changeBaseName("a/b/c.plist", ".png");
     * // returns "a/b/b"
     * MANTICORE.util.format.changeBaseName("a/b/c.plist", "b");
     * // returns "a/b/b.plist"
     * MANTICORE.util.format.changeBaseName("a/b/c.plist", "b", true);
     * @param {string} pathStr
     * @param {string} baseName
     * @param {boolean} [isSameExt = false]
     * @returns {string}
     */

    changeBaseName: function (pathStr, baseName, isSameExt = false) {
        if (baseName.indexOf(".") === 0) {
            return this.changeExtname(pathStr, baseName);
        }

        let index = pathStr.indexOf("?");
        let tempStr = "";
        const ext = isSameExt ? this.extname(pathStr) : "";

        if (index > 0) {
            tempStr = pathStr.substring(index);
            pathStr = pathStr.substring(0, index);
        }

        index = pathStr.lastIndexOf("/");
        index = index <= 0 ? 0 : index + 1;
        return pathStr.substring(0, index) + baseName + ext + tempStr;
    }
};

export default format;