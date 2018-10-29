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

    MAIN_ATLAS_NAME: "main"
};

export default constant;