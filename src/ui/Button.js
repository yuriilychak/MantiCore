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
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {string} upFrame - Frame when button do nothing.
     * @param {?string} [downFrame = null] - Frame when button activated.
     * @param {?string} [overFrame = null] - Frame when button hover.
     * @param {?string} [disabledFrame = null] - Frame when button disabled.
     */
    reuse(upFrame, downFrame = null, overFrame = null, disabledFrame = null) {
        super.reuse(upFrame, INTERACTIVE_STATE.UP);

        this.collider.addState(downFrame, INTERACTIVE_STATE.DOWN);
        this.collider.addState(overFrame, INTERACTIVE_STATE.OVER);
        this.collider.addState(disabledFrame, INTERACTIVE_STATE.DISABLED);
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @protected
     * @param {Object} event
     */

    onActionUpHandler(event) {
        super.onActionUpHandler(event);
        this.changeStateWithFallback(INTERACTIVE_STATE.OVER, INTERACTIVE_STATE.UP);
    }

    /**
     * @method
     * @protected
     * @param {Object} event
     * @returns {boolean}
     */

    onActionDownHandler(event) {
        super.onActionDownHandler(event);
        this.changeEnabledState(INTERACTIVE_STATE.DOWN);
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
     * @desc Calls when button change enable.
     * @method
     * @protected
     * @param {boolean} enabled
     */

    onEnabledChange(enabled) {
        this.changeState(enabled ? INTERACTIVE_STATE.UP : INTERACTIVE_STATE.DISABLED);
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {string | null}
     */

    get upFrame() {
        return this.collider.getFrameByState(INTERACTIVE_STATE.UP);
    }

    set upFrame(value) {
        this.collider.setFrameByState(value, INTERACTIVE_STATE.UP);
    }

    /**
     * @public
     * @type {string | null}
     */

    get downFrame() {
        return this.collider.getFrameByState(INTERACTIVE_STATE.DOWN);
    }

    set downFrame(value) {
        this.collider.setFrameByState(value, INTERACTIVE_STATE.DOWN);
    }

    /**
     * @public
     * @type {string | null}
     */

    get overFrame() {
        return this.collider.getFrameByState(INTERACTIVE_STATE.OVER);
    }

    set overFrame(value) {
        this.collider.setFrameByState(value, INTERACTIVE_STATE.OVER);
    }

    /**
     * @public
     * @type {string | null}
     */

    get disabledFrame() {
        return this.collider.getFrameByState(INTERACTIVE_STATE.DISABLED);
    }

    set disabledFrame(value) {
        this.collider.setFrameByState(value, INTERACTIVE_STATE.DISABLED);
    }
}

export default Button;