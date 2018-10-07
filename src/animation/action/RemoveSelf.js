import ActionInstant from "./ActionInstant";

/**
 * @desc Remove display object.
 * @class
 * @extends MANTICORE.animation.action.ActionInstant
 * @memberOf MANTICORE.animation.action
 */

class RemoveSelf extends ActionInstant {

    /**
     * @constructor
     * @param {boolean} [isKill = false] - Is need kill target.
     */

    constructor(isKill = false) {
        super();
        this._isKill = isKill;
    }

    update(dt) {
        if (this.target.parent) {
            this.target.parent.removeChild(this.target);
        }
        if (!this._isKill) {
            return;
        }
        if (this.target.kill) {
            this.target.kill();
            return;
        }
        this.target.destroy();
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.RemoveSelf}
     */

    clone(){
        return new RemoveSelf(this._isKill);
    }
}

export default RemoveSelf;