/**
 * @desc Namespace that contain core constants.
 * @namespace mCore.constant
 * @memberOf mCore
 */

const constant = {
    /**
     * @desc Name of collider sprite
     * @type {string}
     * @public
     * @readonly
     * @memberOf mCore.constant
     */
    COLLIDER_NAME: "imgCollider",

    /**
     * @desc Name of component for update ui layout.
     * @type {string}
     * @public
     * @readonly
     * @memberOf mCore.constant
     */
    COM_UI_LAYOUT_NAME: "ComUILayout",

    /**
     * @desc Name of component for update layout.
     * @type {string}
     * @public
     * @readonly
     * @memberOf mCore.constant
     */

    COM_LAYOUT: "ComLayout",

    /**
     * @desc Min duration of animation.
     * @public
     * @readonly
     * @type {number}
     * @memberOf mCore.constant
     */
    FLT_EPSILON: 0.0000001192092896,


    /**
     * @desc Epsilon forr detect click and drag actions.
     * @public
     * @readonly
     * @type {number}
     * @memberOf mCore.constant
     */
    OFFSET_EPSILON: 5,

    /**
     * @desc Name of temporary animation that run when call runAction.
     * @public
     * @type {string}
     * @memberOf mCore.constant
     */

    TEMPORARY_ANIMATION_NAME: "TemporaryAnimation",

    /**
     * @desc Main atlas name, need for font parsing.
     * @public
     * @type {string}
     * @memberOf mCore.constant
     */

    MAIN_ATLAS_NAME: "main",

    /**
     * @desc Default name for objects, if name not init.
     * @public
     * @type {string}
     * @memberOf mCore.constant
     */

    DEFAULT_NAME: "Untitled",

    /**
     * @desc Id of empty font.
     * @public
     * @type {string}
     * @memberOf mCore.constant
     */

    EMPTY_FONT_ID: "EmptyFont",

    /**
     * @desc Number for empty int id.
     * @type {int}
     * @public
     * @readonly
     * @const
     * @memberOf mCore.constant
     */

    EMPTY_ID: -1
};

export default constant;
