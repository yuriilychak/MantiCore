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
     */
    USE_WEB_P_FALLBACK: false,

    /**
     * @desc Is use revolt particles.
     * @type {boolean}
     * @memberOf MANTICORE.macro
     */

    PARTICLES_ENABLED: false,

    /**
     * @desc Mode that currently use engine.
     * @type {MANTICORE.enumerator.ENGINE_MODE}
     * @memberOf MANTICORE.macro
     */

    MODE: ENGINE_MODE.DEBUG,

    /**
     * @desc Is use keyboard in game.
     * @type {boolean}
     * @memberOf MANTICORE.macro
     */

    KEYBOARD_ENABLED: false,

    /**
     * @desc Is block browser hot keys (space, arrows and etc.).
     * @type {boolean}
     * @memberOf MANTICORE.macro
     */

    BLOCK_BROWSER_HOT_KEYS: false,

    /**
     * @desc Default size of pool, for some object.
     * @type {int}
     * @memberOf MANTICORE.macro
     */

    DEFAULT_POOL_SIZE: 15,

    /**
     * @desc Count of samples for generate outline for text fields.
     * @type {int}
     * @memberOf MANTICORE.macro
     */

    OUTLINE_SAMPLES: 8
}