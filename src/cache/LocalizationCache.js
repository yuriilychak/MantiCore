import Repository from "../repository/Repository";
import Type from  "util/Type";
import EventDispatcher from "eventDispatcher";
import SYSTEM_EVENT from "enumerator/event/SystemEvent";

/**
 * @desc Namespace for manipulate with localization.
 * @namespace localizationCache
 * @memberOf MANTICORE.cache
 */

export default  {
    /**
     * @desc Current language of locale.
     * @type {?string}
     * @private
     */
    _lang: null,

    /**
     * @desc Repository with locales.
     * @type {MANTICORE.repository.Repository}
     * @private
     */

    _locales: new Repository(),

    /**
     * @desc Add locale to cache.
     * @function
     * @public
     * @param {string} lang
     * @param {Object.<string, string>} data
     * @returns {boolean}
     */

    add: function(lang, data) {
        if (this._locales.hasElement(lang)) {
            return false;
        }
        if (Type.isNull(this._lang)) {
            this._lang = lang;
        }

        const langData = new  Repository();

        for (let key in data) {
            langData.addElement(data[key], key);
        }

        this._locales.addElement(langData, lang);

        return true;
    },

    /**
     * @desc Remove locale from cache
     * @function
     * @public
     * @param {string} lang
     * @returns {boolean}
     */

    remove: function(lang) {
        return this._locales.removeElement(lang, true);
    },

    /**
     * @desc Return current locale
     * @function
     * @public
     * @returns {?string}
     */

    getCurrentLang: function() {
        return this._lang;
    },

    /**
     * @desc Set current locale.
     * @function
     * @public
     * @param {string} value
     * @returns {boolean}
     */

    setCurrentLang: function(value) {
        if (!this._locales.hasElement(value)) {
            return false;
        }

        this._lang = value;

        EventDispatcher.dispatch(SYSTEM_EVENT.LOCALE_CHANGE, this._lang);

        return true;
    },

    /**
     * @desc Return locale by key.
     * @function
     * @public
     * @param {string} key
     * @return {string}
     */

    getLocale: function(key) {
        if (Type.isNull(this._lang)) {
            return key;
        }
        const locale = this._locales.getElement(this._lang);
        return locale.hasElement(key) ? locale.getElement(key) : key;
    }
}