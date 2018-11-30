import Macro from "macro";
import ENGINE_MODE from "enumerator/EngineMode";
import WARNING from "message/Warning";
import Format from "util/Format";

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
    },

    /**
     * @desc Local warning for engine problems.
     * @function
     * @public
     * @param {...*} var_args
     */
    engineWarn(var_args) {
        let message;
        switch (arguments.length) {
            case 0: {
                message = WARNING.W_00;
                break;
            }
            case 1: {
                message = WARNING["W_" + Format.formatNumber(arguments[0], 2)];
                break;
            }
            default: {
                const arrayArgs = Array.from(arguments);
                const [warnIndex, ...args] = arrayArgs;
                const warnTemplate = WARNING["W_" + Format.formatNumber(warnIndex, 2)];
                message = Format.replace(warnTemplate, ...args);
                break;
            }
        }
        this.warn(message);
    }
}