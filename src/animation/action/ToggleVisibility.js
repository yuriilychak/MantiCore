import ActionInstant from "./ActionInstant";

/**
 * @desc Toggle visibility of display object.
 * @class
 * @extends mCore.animation.action.ActionInstant
 * @memberOf mCore.animation.action
 */

class ToggleVisibility extends ActionInstant {

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    update(dt) {
        this.target.visible = !this.target.visible;
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.ToggleVisibility}
     */

    clone(){
        return ToggleVisibility.create();
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {mCore.animation.action.ToggleVisibility}
     */

    reverse () {
        return ToggleVisibility.create();
    }

}

export default ToggleVisibility;
