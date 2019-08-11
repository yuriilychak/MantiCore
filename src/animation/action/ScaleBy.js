import ScaleTo from "./ScaleTo";

/**
 * @desc Scales a Node object a zoom factor by modifying it's scale property. Relative to its changes.
 * @class
 * @extends mCore.animation.action.ScaleTo
 * @memberOf mCore.animation.action
 */

class ScaleBy extends ScaleTo {

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Called before the action start. It will also set the target.
     * @method
     * @public
     * @param {PIXI.DisplayObject} target
     */

    startWithTarget(target) {
        super.startWithTarget(target);
        this.delta.set(
            this.startPoint.x * this.endPoint.x - this.startPoint.x,
            this.startPoint.y * this.endPoint.y - this.startPoint.y
        );
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {mCore.animation.action.ScaleBy}
     */

    reverse() {
        return this.doReverse(ScaleBy.create(this.duration, 1 / this.endPoint.x, 1 / this.endPoint.y));
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.ScaleBy}
     */

    clone() {
        return this.doClone(ScaleBy.create(this.duration, this.endPoint.x, this.endPoint.y));
    }
}

export default ScaleBy;
