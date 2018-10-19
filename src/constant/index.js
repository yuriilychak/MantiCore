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
     */
    FLT_EPSILON: 0.0000001192092896,

    /**
     * @public
     * @type {boolean}
     */

    ENABLE_STACK_ACTIONS: false,

    /**
     * @desc Name of temporary animation that run when call runAction.
     * @public
     * @type {string}
     */

    TEMPORARY_ANIMATION_NAME: "TemporaryAnimation"
};

export default constant;