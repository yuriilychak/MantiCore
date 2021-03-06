import BaseButton from "./ancillary/BaseButton";
import INTERACTIVE_STATE from "enumerator/ui/InteractiveState";
import INTERACTIVE_EVENT from "enumerator/ui/InteractiveEvent";
import UI_ELEMENT from "enumerator/ui/UIElement";
import Boot from "boot";

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
        if (Boot.isDesktop()) {
            this.collider.addState(overFrame, INTERACTIVE_STATE.OVER);
        }
        this.collider.addState(disabledFrame, INTERACTIVE_STATE.DISABLED);

        this.uiType = UI_ELEMENT.BUTTON;

        /**
         * @desc Flag is button currently over.
         * @type {boolean}
         * @private
         */

        this._isOver = false;
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
        if (Boot.isDesktop()) {
            this.collider.addState(overFrame, INTERACTIVE_STATE.OVER);
        }
        this.collider.addState(disabledFrame, INTERACTIVE_STATE.DISABLED);
    }

    /**
     * @desc Calls when interactive manager emit event.
     * @method
     * @public
     * @param {MANTICORE.enumerator.ui.INTERACTIVE_EVENT} eventType
     * @param {Object} event
     */

    emitInteractiveEvent(eventType, event) {
        super.emitInteractiveEvent(eventType, event);
        switch (eventType) {
            case INTERACTIVE_EVENT.UP: {
                if (this._isOver) {
                    this.changeStateWithFallback(INTERACTIVE_STATE.OVER, INTERACTIVE_STATE.UP);
                }
                else {
                    this.changeEnabledState(INTERACTIVE_STATE.UP);
                }
                break;
            }
            case INTERACTIVE_EVENT.DOWN: {
                this.changeEnabledState(INTERACTIVE_STATE.DOWN);
                break;
            }
            case INTERACTIVE_EVENT.OVER: {
                this._isOver = true;
                this.changeEnabledState(INTERACTIVE_STATE.OVER);
                break;
            }
            case INTERACTIVE_EVENT.OUT: {
                this._isOver = false;
                this.changeEnabledState(INTERACTIVE_STATE.UP);
                break;
            }
        }
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

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
