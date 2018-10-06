import ActionInstant from "./ActionInstant";
import Type from "util/Type";

/**
 * @desc Flip display object vertical.
 * @class
 * @extends MANTICORE.animation.action.ActionInstant
 * @memberOf MANTICORE.animation.action
 */

class FlipY extends ActionInstant {

    update(dt) {
        if (!Type.isEmpty(this.target.flipY)) {
            this.target.flipY = !this.target.flipY;
            return;
        }
        this.target.scale.y = -this.target.scale.y;
    }

    clone(){
        return new FlipY();
    }
    reverse () {
        return new FlipY();
    }

}

export default FlipY;