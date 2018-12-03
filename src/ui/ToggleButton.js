import TOGGLE_INTERACTIVE_STATE from "enumerator/ui/ToggleInteractiveState";
import BaseButton from "./ancillary/BaseButton";
import UI_ELEMENT from "enumerator/ui/UIElement";
import INTERACTIVE_EVENT from "enumerator/ui/InteractiveEvent";
import Boot from "boot";

/**
 * @desc Realization of toggle button class.
 * @class
 * @extends MANTICORE.ui.BaseButton
 * @memberOf MANTICORE.ui
 */

class ToggleButton extends BaseButton {

    /**
     * @constructor
     * @param {string} dUpFrame - Deselected frame when button do nothing.
     * @param {string} sUpFrame - Selected frame when button do nothing.
     * @param {?string} [sDownFrame = null] - Deselected frame when button activated.
     * @param {?string} [dDownFrame = null] - Selected frame when button activated.
     * @param {?string} [dOverFrame = null] - Deselected frame when button hover.
     * @param {?string} [sOverFrame = null] - Selected frame when button hover.
     * @param {?string} [dDisabledFrame = null] - Deselected frame when button disabled.
     * @param {?string} [sDisabledFrame = null] - Selected frame when button disabled.
     */

    constructor(
        dUpFrame,
        sUpFrame,
        dDownFrame = null,
        sDownFrame = null,
        dOverFrame = null,
        sOverFrame = null,
        dDisabledFrame = null,
        sDisabledFrame = null
    ) {
        super(dUpFrame, TOGGLE_INTERACTIVE_STATE.DESELECTED_UP);

        /**
         * @desc Is toggle selected.
         * @type {boolean}
         * @private
         */

        this._isSelected = false;

        this.collider.addState(dDownFrame, TOGGLE_INTERACTIVE_STATE.DESELECTED_DOWN);
        if (Boot.isDesktop()) {
            this.collider.addState(dOverFrame, TOGGLE_INTERACTIVE_STATE.DESELECTED_OVER);
        }
        this.collider.addState(dDisabledFrame, TOGGLE_INTERACTIVE_STATE.DESELECTED_DISABLED);
        this.collider.addState(sUpFrame, TOGGLE_INTERACTIVE_STATE.SELECTED_UP);
        this.collider.addState(sDownFrame, TOGGLE_INTERACTIVE_STATE.SELECTED_DOWN);
        if (Boot.isDesktop()) {
            this.collider.addState(sOverFrame, TOGGLE_INTERACTIVE_STATE.SELECTED_OVER);
        }
        this.collider.addState(sDisabledFrame, TOGGLE_INTERACTIVE_STATE.SELECTED_DISABLED);

        this.uiType = UI_ELEMENT.TOGGLE_BUTTON;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {string} dUpFrame - Deselected frame when button do nothing.
     * @param {string} sUpFrame - Selected frame when button do nothing.
     * @param {?string} [sDownFrame = null] - Deselected frame when button activated.
     * @param {?string} [dDownFrame = null] - Selected frame when button activated.
     * @param {?string} [dOverFrame = null] - Deselected frame when button hover.
     * @param {?string} [sOverFrame = null] - Selected frame when button hover.
     * @param {?string} [dDisabledFrame = null] - Deselected frame when button disabled.
     * @param {?string} [sDisabledFrame = null] - Selected frame when button disabled.
     */
    reuse(
        dUpFrame,
        sUpFrame,
        dDownFrame = null,
        sDownFrame = null,
        dOverFrame = null,
        sOverFrame = null,
        dDisabledFrame = null,
        sDisabledFrame = null
    ) {
        super.reuse(dUpFrame, TOGGLE_INTERACTIVE_STATE.DESELECTED_UP);

        this._isSelected = false;

        this.collider.addState(dDownFrame, TOGGLE_INTERACTIVE_STATE.DESELECTED_DOWN);
        if (Boot.isDesktop()) {
            this.collider.addState(dOverFrame, TOGGLE_INTERACTIVE_STATE.DESELECTED_OVER);
        }
        this.collider.addState(dDisabledFrame, TOGGLE_INTERACTIVE_STATE.DESELECTED_DISABLED);
        this.collider.addState(sUpFrame, TOGGLE_INTERACTIVE_STATE.SELECTED_UP);
        this.collider.addState(sDownFrame, TOGGLE_INTERACTIVE_STATE.SELECTED_DOWN);
        if (Boot.isDesktop()) {
            this.collider.addState(sOverFrame, TOGGLE_INTERACTIVE_STATE.SELECTED_OVER);
        }
        this.collider.addState(sDisabledFrame, TOGGLE_INTERACTIVE_STATE.SELECTED_DISABLED);
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
                let state, fallback;
                if (this._isSelected) {
                    state = TOGGLE_INTERACTIVE_STATE.SELECTED_OVER;
                    fallback = TOGGLE_INTERACTIVE_STATE.SELECTED_UP;
                }
                else {
                    state = TOGGLE_INTERACTIVE_STATE.DESELECTED_OVER;
                    fallback = TOGGLE_INTERACTIVE_STATE.DESELECTED_UP;
                }
                this.changeStateWithFallback(state, fallback);
                break;
            }
            case INTERACTIVE_EVENT.DOWN: {
                this._changeEnabledState(TOGGLE_INTERACTIVE_STATE.SELECTED_DOWN, TOGGLE_INTERACTIVE_STATE.DESELECTED_DOWN);

                if (!this.enabled) {
                    return;
                }

                this.selected = !this.selected;
                break;
            }
            case INTERACTIVE_EVENT.OVER: {
                this._changeEnabledState(TOGGLE_INTERACTIVE_STATE.SELECTED_OVER, TOGGLE_INTERACTIVE_STATE.DESELECTED_OVER);
                break;
            }
            case INTERACTIVE_EVENT.OUT: {
                this._changeEnabledState(TOGGLE_INTERACTIVE_STATE.SELECTED_UP, TOGGLE_INTERACTIVE_STATE.DESELECTED_UP);
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
        let state;

        if (this._isSelected) {
            state = enabled ? TOGGLE_INTERACTIVE_STATE.SELECTED_UP : TOGGLE_INTERACTIVE_STATE.SELECTED_DISABLED;
        }
        else {
            state = enabled ? TOGGLE_INTERACTIVE_STATE.DESELECTED_UP : TOGGLE_INTERACTIVE_STATE.DESELECTED_DISABLED;
        }
        this.changeState(state);
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     *
     * @param {MANTICORE.enumerator.ui.TOGGLE_INTERACTIVE_STATE} selected
     * @param {MANTICORE.enumerator.ui.TOGGLE_INTERACTIVE_STATE} deselected
     * @private
     */

    _changeEnabledState(selected, deselected) {
        const state = this._isSelected ? selected : deselected;
        this.changeEnabledState(state);
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Flag is toggle button selected.
     * @public
     * @type {boolean}
     */

    get selected() {
        return this._isSelected;
    }

    set selected(value) {
        if (this._isSelected === value) {
            return;
        }
        this._isSelected = value;

        let nextState;

        switch (this.collider.state)  {
            case TOGGLE_INTERACTIVE_STATE.DESELECTED_UP: {
                nextState = TOGGLE_INTERACTIVE_STATE.SELECTED_UP;
                break;
            }
            case TOGGLE_INTERACTIVE_STATE.DESELECTED_DOWN: {
                nextState = TOGGLE_INTERACTIVE_STATE.SELECTED_DOWN;
                break;
            }
            case TOGGLE_INTERACTIVE_STATE.DESELECTED_OVER: {
                nextState = TOGGLE_INTERACTIVE_STATE.SELECTED_OVER;
                break;
            }
            case TOGGLE_INTERACTIVE_STATE.DESELECTED_DISABLED: {
                nextState = TOGGLE_INTERACTIVE_STATE.SELECTED_DISABLED;
                break;
            }
            case TOGGLE_INTERACTIVE_STATE.SELECTED_UP: {
                nextState = TOGGLE_INTERACTIVE_STATE.DESELECTED_UP;
                break;
            }
            case TOGGLE_INTERACTIVE_STATE.SELECTED_DOWN: {
                nextState = TOGGLE_INTERACTIVE_STATE.DESELECTED_DOWN;
                break;
            }
            case TOGGLE_INTERACTIVE_STATE.SELECTED_OVER: {
                nextState = TOGGLE_INTERACTIVE_STATE.DESELECTED_OVER;
                break;
            }
            case TOGGLE_INTERACTIVE_STATE.SELECTED_DISABLED: {
                nextState = TOGGLE_INTERACTIVE_STATE.DESELECTED_DISABLED;
                break;
            }
            default: {
                nextState = TOGGLE_INTERACTIVE_STATE.DESELECTED_UP;
            }
        }
        this.changeState(nextState);
    }
}

export default ToggleButton;