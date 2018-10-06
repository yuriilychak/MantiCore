import ActionInstant from "./ActionInstant";
import Type from "util/Type";

/**
 * @desc Flip display object horizontal.
 * @class
 * @extends MANTICORE.animation.action.ActionInstant
 * @memberOf MANTICORE.animation.action
 */

class FlipX extends ActionInstant {

    update(dt) {
        if (!Type.isEmpty(this.target.flipX)) {
            this.target.flipX = !this.target.flipX;
            return;
        }
        this.target.scale.x = -this.target.scale.x;
    }

    clone(){
        return new FlipX();
    }
    reverse () {
        return new FlipX();
    }

}

export default FlipX;