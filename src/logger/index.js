import Macro from "macro";
import ENGINE_MODE from "enumerator/EngineMode";

/**
 * @desc Namespace for log information to console.
 * @namespace logger
 * @memberOf MANTICORE
 */

export default {
    /**
     * @desc Log information to console.
     * @function
     * @public
     * @param {...*} var_args
     */
    log: function (var_args) {
        if (Macro.MODE === ENGINE_MODE.RELEASE) {
            return;
        }
        console.log(...arguments);
    },

    /**
     * @desc Log warning information to console.
     * @function
     * @public
     * @param {...*} var_args
     */
    warn: function (var_args) {
        if (Macro.MODE === ENGINE_MODE.RELEASE) {
            return;
        }
        console.warn(...arguments);
    },

    /**
     * @desc Log warning information to console.
     * @function
     * @public
     * @param {...*} var_args
     */
    error: function (var_args) {
        if (Macro.MODE === ENGINE_MODE.RELEASE) {
            return;
        }
        console.error(...arguments);
    }
}