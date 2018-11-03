import ActionInterval from "./ActionInterval";

/**
 * @desc Overrides the target of an action so that it always runs on the target specified at action creation rather than the one specified by runAction.
 * @class
 * @extends MANTICORE.animation.action.ActionInterval
 * @memberOf MANTICORE.animation.action
 */

class TargetedAction extends ActionInterval {

    /**
     * @constructor
     * @param {PIXI.DisplayObject} target
     * @param {MANTICORE.animation.action.FiniteTimeAction} action
     */
    constructor(target, action) {
        super(action.duration);
        /**
         * @type {?MANTICORE.animation.action.FiniteTimeAction}
         * @private
         */
        this._action = action;

        /**
         * @type {?PIXI.DisplayObject}
         * @private
         */
        this._forcedTarget = target;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.TargetedAction}
     */

    clone() {
        return this.doClone(TargetedAction.create(this._forcedTarget, this._action.clone()));
    }

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        this._action.startWithTarget(this._forcedTarget);
    }

    stop() {
        this._action.stop();
    }

    update(dt) {
        dt = this.computeEaseTime(dt);
        this._action.update(dt);
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     * @param {MANTICORE.animation.action.FiniteTimeAction} action
     */

    reuse(target, action) {
        super.reuse(action.duration);
        this._action = action;
        this._forcedTarget = target;
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data befor disuse and destroy.
     * @method
     * @protected
     */

    clearData() {
        this._action.kill();
        this._action = null;
        this._forcedTarget = null;
        super.clearData();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc The target that the action will be forced to run with.
     * @public
     * @returns {?PIXI.DisplayObject}
     */

    get forcedTarget() {
        return this._forcedTarget;
    }

    set forcedTarget(forcedTarget) {
        if (this._forcedTarget === forcedTarget) {
            return;
        }
        this._forcedTarget = forcedTarget;
    }
}

export default TargetedAction;
