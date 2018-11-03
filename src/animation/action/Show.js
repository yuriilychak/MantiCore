import ActionInstant from "./ActionInstant";

/**
 * @desc Show display object.
 * @class
 * @extends MANTICORE.animation.action.ActionInstant
 * @memberOf MANTICORE.animation.action
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
     * @return {MANTICORE.animation.action.Show}
     */

    clone(){
        return Show.cloneFromPool(Show);
    }
}

export default Show;