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
     * @desc Default name for objects, if name not init.
     * @public
     * @type {string}
     * @memberOf MANTICORE.constant
     */

    DEFAULT_NAME: "Untitled",

    /**
     * @desc Number for empty int id.
     * @type {int}
     * @public
     * @readonly
     * @const
     * @memberOf MANTICORE.constant
     */

    EMPTY_ID: -1
};

export default constant;