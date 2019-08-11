import ActionInstant from "./ActionInstant";

/**
 * @desc Hide display object.
 * @class
 * @extends mCore.animation.action.ActionInstant
 * @memberOf mCore.animation.action
 */

class Hide extends ActionInstant {

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    update(dt) {
        this.target.visible = false;
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.Hide}
     */

    clone(){
        return Hide.create();
    }
}

export default Hide;
