import ScaleTo from "./ScaleTo";

/**
 * @desc Scales a Node object a zoom factor by modifying it's scale property. Relative to its changes.
 * @class
 * @extends MANTICORE.animation.action.ScaleTo
 * @memberOf MANTICORE.animation.action
 */

class ScaleBy extends ScaleTo {

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        this.delta.set(
            this.startScale.x * this.endScale.x - this.startScale.x,
            this.startScale.y * this.endScale.y - this.startScale.y
        );
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.ScaleBy}
     */

    reverse() {
        return this.doReverse(new ScaleBy(this.duration, 1 / this.endScale.x, 1 / this.endScale.y));
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.ScaleBy}
     */

    clone() {
        return this.doClone(new ScaleBy(this.duration, this.endScale.x, this.endScale.y));
    }
}

export default ScaleBy;