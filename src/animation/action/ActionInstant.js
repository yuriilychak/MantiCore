import FiniteTimeAction from "./FiniteTimeAction";

/**
 * @desc Instant actions are immediate actions. They don't have a duration like the ActionInterval actions.
 * @class
 * @extends MANTICORE.animation.action.FiniteTimeAction
 * @memberOf MANTICORE.animation.action
 */

class ActionInstant extends FiniteTimeAction {
    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @public
     * @param {number} dt
     */

    step(dt) {
        this.update(1);
    }

    /**
     * @method
     * @public
     * @param {number} dt
     */

    update(dt) {}

    /**
     * returns a reversed action. <br />
     * For example: <br />
     * - The action is x coordinates of 0 move to 100. <br />
     * - The reversed action will be x of 100 move to 0.
     */

    reverse(){
        return null;
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.ActionInstant}
     */

    clone(){
        return ActionInstant.create();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @return {boolean}
     */

    get isDone () {
        return true;
    }
}

export default ActionInstant;