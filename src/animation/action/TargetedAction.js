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
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.TargetedAction}
     */

    clone() {
        return this.doClone(new TargetedAction(this._forcedTarget, this._action.clone()));
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
