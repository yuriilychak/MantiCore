import ActionInstant from "./ActionInstant";
import Asset from "util/Asset";

/**
 * @desc Class for change frames of sprite in animation.
 * @class
 * @memberOf MANTICORE.animation.action
 * @extends MANTICORE.animation.action.ActionInstant
 */
class FrameChange extends ActionInstant {
    /**
     * @constructor
     * @param {string} frame
     */
    constructor(frame) {
        super();

        this._frame = frame;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    update(dt) {
        this.target.texture = Asset.getSpriteFrame(this._frame);
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.FrameChange}
     */

    clone(){
        return FrameChange.cloneFromPool(FrameChange, this._frame);
    }

    /**
     * @method
     * @public
     * @return {MANTICORE.animation.action.FrameChange}
     */

    reverse(){
        return FrameChange.cloneFromPool(FrameChange, this._frame);
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
        this._frame = null;
        super.clearData();
    }
}

export default FrameChange;