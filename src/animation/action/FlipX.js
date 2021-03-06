import ActionInstant from "./ActionInstant";
import Type from "util/Type";

/**
 * @desc Flip display object horizontal.
 * @class
 * @extends MANTICORE.animation.action.ActionInstant
 * @memberOf MANTICORE.animation.action
 */

class FlipX extends ActionInstant {

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    update(dt) {
        if (!Type.isEmpty(this.target.flipX)) {
            this.target.flipX = !this.target.flipX;
            return;
        }
        this.target.scale.x = -this.target.scale.x;
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.FlipX}
     */

    clone(){
        return FlipX.create();
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.FlipX}
     */

    reverse () {
        return FlipX.create();
    }

}

export default FlipX;