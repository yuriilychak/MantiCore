import ActionInstant from "./ActionInstant";

/**
 * @desc Show display object.
 * @class
 * @extends MANTICORE.animation.action.ActionInstant
 * @memberOf MANTICORE.animation.action
 */

class Show extends ActionInstant {

    update(dt) {
        this.target.visible = true;
    }

    clone(){
        return new Show();
    }
}

export default Show;