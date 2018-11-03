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

        /**
         * @type {string}
         * @private
         */
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
        return FrameChange.create(this._frame);
    }

    /**
     * @method
     * @public
     * @return {MANTICORE.animation.action.FrameChange}
     */

    reverse(){
        return FrameChange.create(this._frame);
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {string} frame
     */

    reuse(frame) {
        super.reuse();

        this._frame = frame;
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