import ActionInstant from "./ActionInstant";
import Type from "util/Type";

/**
 * @desc Flip display object vertical.
 * @class
 * @extends mCore.animation.action.ActionInstant
 * @memberOf mCore.animation.action
 */

class FlipY extends ActionInstant {

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    update(dt) {
        if (!Type.isEmpty(this.target.flipY)) {
            this.target.flipY = !this.target.flipY;
            return;
        }
        this.target.scale.y = -this.target.scale.y;
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.FlipY}
     */

    clone(){
        return FlipY.create();
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {mCore.animation.action.FlipY}
     */

    reverse () {
        return FlipY.create();
    }

}

export default FlipY;
