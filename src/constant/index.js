import OS from "enumerator/system/OS";
import BROWSER  from "enumerator/system/Browser";
import CLIENT from "enumerator/system/Client";
import PLATFORM from "enumerator/system/Platform";

/**
 * @desc Namespace that contain core constants.
 * @namespace MANTICORE.constant
 * @memberOf MANTICORE
 */

const constant = {
    /**
     * @desc Name of collider sprite
     * @type {string}
     * @public
     * @readonly
     * @memberOf MANTICORE.constant
     */
    COLLIDER_NAME: "imgCollider",

    /**
     * @desc Min duration of animation.
     * @public
     * @readonly
     * @type {number}
     * @memberOf MANTICORE.constant
     */
    FLT_EPSILON: 0.0000001192092896,

    /**
     * @desc Name of temporary animation that run when call runAction.
     * @public
     * @type {string}
     * @memberOf MANTICORE.constant
     */

    TEMPORARY_ANIMATION_NAME: "TemporaryAnimation",

    /**
     * @desc Main atlas name, need for font parsing.
     * @public
     * @type {string}
     * @memberOf MANTICORE.constant
     */

    MAIN_ATLAS_NAME: "main",

    /**
     * @desc Version of os that run application.
     * @type {string}
     * @constant
     * @memberOf MANTICORE.constant
     */

    OS_VERSION: "unknown",

    /**
     * @desc Os that run application
     * @type {MANTICORE.enumerator.system.OS}
     * @constant
     * @memberOf MANTICORE.constant
     */

    OS: OS.UNKNOWN,

    /**
     * @desc Browser that run application.
     * @type {MANTICORE.enumerator.system.BROWSER}
     * @constant
     * @memberOf MANTICORE.constant
     */

    BROWSER: BROWSER.UNKNOWN,

    /**
     * @desc Version of browser that run application.
     * @type {int}
     * @constant
     * @memberOf MANTICORE.constant
     */

    BROWSER_VERSION: -1,

    /**
     * @desc Client of application (Browser, electron, cordova etc)
     * @type {MANTICORE.enumerator.system.CLIENT}
     * @constant
     * @readonly
     * @memberOf MANTICORE.constant
     */

    CLIENT: CLIENT.UNKNOWN,

    /**
     * @desc Is coockes enabled.
     * @type {boolean}
     * @constant
     * @readonly
     * @memberOf MANTICORE.constant
     */

    COOKIES_ENABLED: false,

    /**
     * @desc Platform where run device (Desktop, mobile).
     * @type {MANTICORE.enumerator.system.PLATFORM}
     * @constant
     * @readonly
     * @memberOf MANTICORE.constant
     */

    PLATFORM: PLATFORM.UNKNOWN
};

export default constant;