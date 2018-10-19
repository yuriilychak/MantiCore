import Type from "util/Type";
import MemoryManager from "manager/MemoryManager";
import Geometry from "util/Geometry";

/**
 * @desc Class for manipulate with action animation.
 * @class
 * @memberOf MANTICORE.animation
 */

class ActionAnimation {
    /**
     * @constructor
     * @param {MANTICORE.animation.action.Action} action
     */
    constructor(action) {
        /**
         * @desc Action of animation.
         * @type {MANTICORE.animation.action.Action}
         * @private
         */
        this._action = action;

        /**
         * @type {PIXI.Point | Point}
         * @private
         */

        this._position = new PIXI.Point(0, 0);

        /**
         * @type {PIXI.Point | Point}
         * @private
         */

        this._scale = new PIXI.Point(1, 1);

        /**
         * @type {PIXI.Point | Point}
         * @private
         */

        this._skew = new PIXI.Point(0, 0);

        /**
         * @type {int}
         * @private
         */

        this._rotation = 0;

        /**
         * @type {int}
         * @private
         */

        this._tint = -1;

        /**
         * @type {int}
         * @private
         */

        this._alpha = -1;

        /**
         * @type {?boolean}
         * @private
         */

        this._visible = null;

        /**
         * @desc Manager for manipulate with pool and destruction.
         * @type {MANTICORE.manager.MemoryManager}
         * @private
         */

        this._memoryManager = new MemoryManager(this);

        this._memoryManager.reusable = true;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Offset in start of animation from target position.
     * @public
     * @returns {PIXI.Point}
     */

    get positionOffset() {
        return this._position;
    }

    set positionOffset(value) {
        if (this._position.equals(value)) {
            return;
        }
        this._position.copy(value);
    }

    /**
     * @desc Offset in start of animation from target scale.
     * @public
     * @returns {PIXI.Point}
     */

    get scaleOffset() {
        return this._scale;
    }

    set scaleOffset(value) {
        if (this._scale.equals(value)) {
            return;
        }
        this._scale.copy(value);
    }

    /**
     * @desc Offset in start of animation from target skew.
     * @public
     * @returns {PIXI.Point}
     */

    get skewOffset() {
        return this._skew;
    }

    set skewOffset(value) {
        if (this._skew.equals(value)) {
            return;
        }
        this._skew.copy(value);
    }

    /**
     * @desc Offset in start of animation from target rotation.
     * @public
     * @returns {int}
     */

    get rotationOffset() {
        return this._rotation;
    }

    set rotationOffset(value) {
        if (this._rotation === value) {
            return;
        }
        this._rotation = value;
    }

    /**
     * @desc Offset in start of animation from target rotation.
     * @public
     * @returns {int}
     */

    get rotationOffset() {
        return this._rotation;
    }

    set rotationOffset(value) {
        if (this._rotation === value) {
            return;
        }
        this._rotation = value;
    }

    /**
     * @desc Offset in start of animation from target rotation.
     * @public
     * @returns {int}
     */

    get tint() {
        return this._tint;
    }

    set tint(value) {
        if (this._tint === value) {
            return;
        }
        this._tint = value;
    }

    /**
     * @desc Offset in start of animation from target rotation.
     * @public
     * @returns {int}
     */

    get alpha() {
        return this._alpha;
    }

    set alpha(value) {
        if (this._alpha === value) {
            return;
        }
        this._alpha = value;
    }

    /**
     * @desc Offset in start of animation from target rotation.
     * @public
     * @returns {?boolean}
     */

    get visible() {
        return this._visible;
    }

    set visible(value) {
        if (this._visible === value) {
            return;
        }
        this._visible = value;
    }

    /**
     * @desc Returns is current action done
     * @public
     * @returns {boolean}
     */

    get isDone() {
        return !Type.isNull(this._action) ? this._action.isDone : true;
    }

    /**
     * @public
     * @type {boolean}
     */

    get inPool() {
        return this._memoryManager.inPool;
    }

    set inPool(value) {
        if (this._memoryManager.inPool === value) {
            return;
        }
        this._memoryManager.inPool = value;
    }

    /**
     * @desc Play animation for target
     * @method
     * @public
     * @param {PIXI.DisplayObject | PIXI.Sprite} target
     */

    play(target) {
        if (Type.isNull(this._action)) {
            return;
        }
        Geometry.pAdd(target.position, this._position, true);
        Geometry.pCompMult(target.scale, this._scale, true);
        Geometry.pAdd(target.skew, this._skew, true);
        target.rotation += this._rotation;
        if (this._tint !== -1 && !Type.isUndefined(target.tint)) {
            target.tint = this._tint;
        }
        if (this._alpha !== -1) {
            target.alpha = this._alpha;
        }
        if (!Type.isNull(this._visible)) {
            target.visible = this._visible;
        }
        this._action.startWithTarget(target);
    }

    /**
     * @desc Update animation cycle.
     * @method
     * @public
     * @param {number} dt
     */

    update(dt) {
        if (Type.isNull(this._action)) {
            return;
        }
        this._action.step(dt);
    }

    /**
     * @desc Calls by pool when model get from pool. Don't call it only override.
     * @method
     * @public
     * @param {MANTICORE.animation.action.Action} action
     */
    reuse(action) {
        this._action = action;
    }

    /**
     * @desc Calls by pool when model put in to pool. Don't call it only override.
     * @method
     * @public
     */
    disuse() {
        this._clearData();
    }

    destroy() {
        this._clearData();
        this._memoryManager.destroy();
        this._memoryManager = null;
    }

    /**
     * @desc Call for destroy object. If it reusable put in pool.
     * @method
     * @public
     */

    kill() {
        this._memoryManager.kill();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear inner data of animation.
     * @method
     * @private
     */

    _clearData() {
        this._action = null;
        this._position.set(0, 0);
        this._scale.set(1, 1);
        this._skew.set(0, 0);
        this._rotation = 0;
        this._tint = -1;
        this._alpha = -1;
        this._visible = null;
    }
}

export default ActionAnimation;