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

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.Hide}
     */

    clone(){
        return new Hide();
    }
}

export default Hide;