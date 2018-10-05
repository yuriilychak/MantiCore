import ActionInstant from "./ActionInstant";

/**
 * @desc Hide display object.
 * @class
 * @extends MANTICORE.animation.action.ActionInstant
 * @memberOf MANTICORE.animation.action
 */

class Hide extends ActionInstant {

    update(dt) {
        this.target.visible = false;
    }

    clone(){
        return new Hide();
    }
}

export default Hide;