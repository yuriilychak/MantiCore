import Type from "util/Type";
import Geometry from "util/Geometry";
import ReusableObject from "memory/ReusableObject";

/**
 * @desc Class for manipulate with action animation.
 * @class
 * @memberOf MANTICORE.animation
 * @extends MANTICORE.memory.ReusableObject
 */

class ActionAnimation extends ReusableObject{
    /**
     * @constructor
     * @param {MANTICORE.animation.action.ActionInterval} action
     */
    constructor(action) {
        super();
        /**
         * @desc Action of animation.
         * @type {MANTICORE.animation.action.ActionInterval}
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

        this.reusable = true;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Play animation for target
     * @method
     * @public
     * @param {PIXI.DisplayObject | PIXI.Sprite} target
     */

    play(target) {
        if (this._isEmpty()) {
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
     * @desc Stop animation.
     * @method
     * @public
     */

    stop() {
        if (this._isEmpty()) {
            return;
        }
        this._action.stop();
    }

    /**
     * @desc Update animation cycle.
     * @method
     * @public
     * @param {number} dt
     */

    update(dt) {
        if (this._isEmpty()) {
            return;
        }
        this._action.step(dt);
    }

    /**
     * @desc Calls by pool when model get from pool. Don't call it only override.
     * @method
     * @public
     * @param {MANTICORE.animation.action.ActionInterval} action
     */
    reuse(action) {
        super.reuse(action);
        this._action = action;
    }

    /**
     * @desc Clone object
     * @method
     * @public
     * @return {MANTICORE.animation.ActionAnimation}
     */

    clone() {
        return ActionAnimation.create(this._action.clone());
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear inner data of animation on destroy and kill.
     * @method
     * @protected
     */

    clearData() {
        this.stop();
        this._action.kill();
        this._action = null;
        this._position.set(0, 0);
        this._scale.set(1, 1);
        this._skew.set(0, 0);
        this._rotation = 0;
        this._tint = -1;
        this._alpha = -1;
        this._visible = null;
        super.clearData();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Check is action of animation not null.
     * @method
     * @private
     * @returns {boolean}
     */

    _isEmpty() {
        return Type.isNull(this._action);
    }

    /**
     * PROPERTIES
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
        return !this._isEmpty() ? this._action.isDone : true;
    }

    /**
     * @desc Returns duration in seconds.
     * @public
     * @returns {number}
     */

    get duration() {
        return !this._isEmpty() ? this._action.duration : 0;
    }
}

export default ActionAnimation;