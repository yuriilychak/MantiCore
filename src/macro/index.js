import ENGINE_MODE from "enumerator/EngineMode";

/**
 * @desc Namespace for store some macros.
 * @namespace macro
 * @memberOf mCore
 */

export default {
    /**
     * @desc FPS of application.
     * @type {int}
     * @memberOf mCore.macro
     */
    FPS: 60,

    /**
     * @desc Is use wbp images as fallback.
     * @type {boolean}
     * @memberOf mCore.macro
     */
    USE_WEB_P_FALLBACK: false,

    /**
     * @desc Is use revolt particles.
     * @type {boolean}
     * @memberOf mCore.macro
     */

    PARTICLES_ENABLED: false,

    /**
     * @desc Mode that currently use engine.
     * @type {mCore.enumerator.ENGINE_MODE}
     * @memberOf mCore.macro
     */

    MODE: ENGINE_MODE.DEBUG,

    /**
     * @desc Is use keyboard in game.
     * @type {boolean}
     * @memberOf mCore.macro
     */

    KEYBOARD_ENABLED: false,

    /**
     * @desc Is use mouse wheel in game.
     * @type {boolean}
     * @memberOf mCore.macro
     */

    MOUSE_WHEEL_ENABLED: false,

    /**
     * @desc Is block browser hot keys (space, arrows and etc.).
     * @type {boolean}
     * @memberOf mCore.macro
     */

    BLOCK_BROWSER_HOT_KEYS: false,

    /**
     * @desc Default size of pool, for some object.
     * @type {int}
     * @memberOf mCore.macro
     */

    DEFAULT_POOL_SIZE: 15,

    /**
     * @desc Count of samples for generate outline for text fields.
     * @type {int}
     * @memberOf mCore.macro
     */

    OUTLINE_SAMPLES: 8,

    /**
     * @desc Dir for load assets.
     * @type {string}
     * @memberOf mCore.macro
     */

    ASSET_DIR: "",

    /**
     * @desc Scale of spine skeletons.
     * @type {number}
     * @memberOf mCore.macro
     */

    SPINE_SCALE: 1,
}
