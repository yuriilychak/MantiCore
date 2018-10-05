import ActionInstant from "./ActionInstant";

/**
 * @desc Toggle visibility of display object.
 * @class
 * @extends MANTICORE.animation.action.ActionInstant
 * @memberOf MANTICORE.animation.action
 */

class ToggleVisibility extends ActionInstant {

    update(dt) {
        this.target.visible = !this.target.visible;
    }

    clone(){
        return new ToggleVisibility();
    }
    reverse () {
        return new ToggleVisibility();
    }

}

export default ToggleVisibility;