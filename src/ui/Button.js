import BaseButton from "./ancillary/BaseButton";
import INTERACTIVE_STATE from "enumerator/ui/InteractiveState";
import UI_ELEMENT from "enumerator/ui/UIElement";

/**
 * @desc realization of button class.
 * @class
 * @extends MANTICORE.ui.ancillary.BaseButton
 * @memberOf MANTICORE.ui
 */

class Button extends BaseButton {

    /**
     * @constructor
     * @param {string} upFrame - Frame when button do nothing.
     * @param {?string} [downFrame = null] - Frame when button activated.
     * @param {?string} [overFrame = null] - Frame when button hover.
     * @param {?string} [disabledFrame = null] - Frame when button disabled.
     */

    constructor(upFrame, downFrame = null, overFrame = null, disabledFrame = null) {
        super(upFrame, INTERACTIVE_STATE.UP);

        this.collider.addState(downFrame, INTERACTIVE_STATE.DOWN);
        this.collider.addState(overFrame, INTERACTIVE_STATE.OVER);
        this.collider.addState(disabledFrame, INTERACTIVE_STATE.DISABLED);

        this.uiType = UI_ELEMENT.BUTTON;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @return {string | null}
     */

    get upFrame() {
        return this.collider.getFrameByState(INTERACTIVE_STATE.UP);
    }

    /**
     * @public
     * @param {string} value
     */

    set upFrame(value) {
        this.collider.setFrameByState(value, INTERACTIVE_STATE.UP);
    }

    /**
     * @public
     * @return {string | null}
     */

    get downFrame() {
        return this.collider.getFrameByState(INTERACTIVE_STATE.DOWN);
    }

    /**
     * @public
     * @param {string} value
     */

    set downFrame(value) {
        this.collider.setFrameByState(value, INTERACTIVE_STATE.DOWN);
    }

    /**
     * @public
     * @return {string | null}
     */

    get overFrame() {
        return this.collider.getFrameByState(INTERACTIVE_STATE.OVER);
    }

    /**
     * @public
     * @param {string} value
     */

    set overFrame(value) {
        this.collider.setFrameByState(value, INTERACTIVE_STATE.OVER);
    }

    /**
     * @public
     * @return {string | null}
     */

    get disabledFrame() {
        return this.collider.getFrameByState(INTERACTIVE_STATE.DISABLED);
    }

    /**
     * @public
     * @param {string} value
     */

    set disabledFrame(value) {
        this.collider.setFrameByState(value, INTERACTIVE_STATE.DISABLED);
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @protected
     * @param {Object} event
     * @returns {boolean}
     */

    onActionUpHandler(event) {
        if (!super.onActionUpHandler(event)) {
            return false;
        }
        this.changeStateWithFallback(INTERACTIVE_STATE.OVER, INTERACTIVE_STATE.UP);
        return true;
    }

    /**
     * @method
     * @protected
     * @param {Object} event
     * @returns {boolean}
     */

    onActionDownHandler(event) {
        if (!super.onActionDownHandler(event)) {
            return false;
        }
        this.changeEnabledState(INTERACTIVE_STATE.DOWN);
        return true;
    }

    /**
     * @method
     * @protected
     * @param {Object} event
     */

    onActionOverHandler(event) {
        super.onActionOverHandler(event);
        this.changeEnabledState(INTERACTIVE_STATE.OVER);
    }

    /**
     * @method
     * @protected
     * @param {Object} event
     */

    onActionOutHandler(event) {
        super.onActionOutHandler(event);
        this.changeEnabledState(INTERACTIVE_STATE.UP);
    }

    /**
     * @method
     * @protected
     * @param {Object} event
     * @returns {boolean}
     */

    onActionUpOutsideHandler(event) {
        if (!super.onActionUpOutsideHandler(event)) {
            return false;
        }
        this.changeEnabledState(INTERACTIVE_STATE.UP);
        return true;
    }

    /**
     * @desc Calls when button change enable.
     * @method
     * @protected
     * @param {boolean} enabled
     */

    onEnabledChange(enabled) {
        this.changeState(enabled ? INTERACTIVE_STATE.UP : INTERACTIVE_STATE.DISABLED);
    }
}

export default Button;