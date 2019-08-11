import ActionInstant from "./ActionInstant";

/**
 * @desc Remove display object.
 * @class
 * @extends mCore.animation.action.ActionInstant
 * @memberOf mCore.animation.action
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

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

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
     * @return {mCore.animation.action.RemoveSelf}
     */

    clone(){
        return RemoveSelf.create(this._isKill);
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {boolean} [isKill = false] - Is need kill target.
     */

    reuse(isKill = false) {
        this._isKill = isKill;
        super.reuse();
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data befor disuse and destroy.
     * @method
     * @protected
     */

    clearData() {
        this._isKill = false;
        super.clearData();
    }
}

export default RemoveSelf;
