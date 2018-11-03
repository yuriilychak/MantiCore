import ENGINE_MODE from "enumerator/EngineMode";

/**
 * @desc Namespace for store some macros.
 * @namespace macro
 * @memberOf MANTICORE
 */

export default {
    /**
     * @desc FPS of application.
     * @type {int}
     * @memberOf MANTICORE.macro
     */
    FPS: 60,

    /**
     * @desc Is use wbp images as fallback.
     * @type {boolean}
     * @memberOf MANTICORE.macro
     * @private
     */
    USE_WEB_P_FALLBACK: false,

    /**
     * @desc Mode that currently use engine.
     * @type {MANTICORE.enumerator.ENGINE_MODE}
     * @memberOf MANTICORE.macro
     */

    MODE: ENGINE_MODE.DEBUG,

    /**
     * @desc Default size of pool, for some object.
     * @type {int}
     * @memberOf MANTICORE.macro
     */

    DEFAULT_POOL_SIZE: 15
}