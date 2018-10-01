import Repository from "repository/Repository";

/**
 * @desc Namespace for manipulate with font sizes and change them.
 * @namespace fontCache
 * @memberOf MANTICORE.ui
 */

export default {
    /**
     * @type {MANTICORE.repository.Repository}
     * @private
     */
    _fontSizes: new Repository(),

    /**
     * @desc Add font sizes to cache
     * @function
     * @public
     * @param {string} fontName
     * @param {int} size
     */

    addFontSize: function(fontName, size) {
        let sizes;
        if (!this._fontSizes.hasElement(fontName)) {
            sizes = [];
            this._fontSizes.addElement(sizes, fontName);
        }
        else {
            sizes = this._fontSizes.getElement(fontName);
        }
        sizes.push(size);
        sizes.sort();
    },

    /**
     * @desc Return font name by size and default name.
     * @function
     * @param {string} fontName
     * @param {int} size
     * @return {string}
     */

    getFontName: function (fontName, size) {
        if (!this._fontSizes.hasElement(fontName)) {
            return fontName;
        }

        const sizes = this._fontSizes.getElement(fontName);
        const sizeCount = sizes.length;
        let resultSize, i;

        for (i = 0; i < sizeCount; ++i) {
            resultSize = sizes[i];
            if (size < resultSize) {
                break;
            }
        }
        return fontName + "_" + resultSize;
    }
};