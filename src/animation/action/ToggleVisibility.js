import ActionInstant from "./ActionInstant";

/**
 * @desc Toggle visibility of display object.
 * @class
 * @extends MANTICORE.animation.action.ActionInstant
 * @memberOf MANTICORE.animation.action
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
     * @return {MANTICORE.animation.action.ToggleVisibility}
     */

    clone(){
        return ToggleVisibility.cloneFromPool(ToggleVisibility);
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.ToggleVisibility}
     */

    reverse () {
        return ToggleVisibility.cloneFromPool(ToggleVisibility);
    }

}

export default ToggleVisibility;