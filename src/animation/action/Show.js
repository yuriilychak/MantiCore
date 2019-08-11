import ActionInstant from "./ActionInstant";

/**
 * @desc Show display object.
 * @class
 * @extends mCore.animation.action.ActionInstant
 * @memberOf mCore.animation.action
 */

class Show extends ActionInstant {

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    update(dt) {
        this.target.visible = true;
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.Show}
     */

    clone(){
        return Show.create();
    }
}

export default Show;
