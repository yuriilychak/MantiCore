import TOGGLE_INTERACTIVE_STATE from "enumerator/ui/ToggleInteractiveState";
import BaseButton from "./ancillary/BaseButton";
import UI_ELEMENT from "enumerator/ui/UIElement";

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
        this.collider.addState(dOverFrame, TOGGLE_INTERACTIVE_STATE.DESELECTED_OVER);
        this.collider.addState(dDisabledFrame, TOGGLE_INTERACTIVE_STATE.DESELECTED_DISABLED);
        this.collider.addState(sUpFrame, TOGGLE_INTERACTIVE_STATE.SELECTED_UP);
        this.collider.addState(sDownFrame, TOGGLE_INTERACTIVE_STATE.SELECTED_DOWN);
        this.collider.addState(sOverFrame, TOGGLE_INTERACTIVE_STATE.SELECTED_OVER);
        this.collider.addState(sDisabledFrame, TOGGLE_INTERACTIVE_STATE.SELECTED_DISABLED);

        this.uiType = UI_ELEMENT.TOGGLE_BUTTON;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * this.dispatch(
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
        if (!super.onActionUpHandler(event)) {
            return false;
        }

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

        this._changeEnabledState(TOGGLE_INTERACTIVE_STATE.SELECTED_DOWN, TOGGLE_INTERACTIVE_STATE.DESELECTED_DOWN);

        if (!this.enabled) {
            return true;
        }

        this.selected = !this.selected;
        return true;
    }

    /**
     * @method
     * @protected
     * @param {Object} event
     */

    onActionOverHandler(event) {
        super.onActionOverHandler(event);
        this._changeEnabledState(TOGGLE_INTERACTIVE_STATE.SELECTED_OVER, TOGGLE_INTERACTIVE_STATE.DESELECTED_OVER);
    }

    /**
     * @method
     * @protected
     * @param {Object} event
     */

    onActionOutHandler(event) {
        super.onActionOutHandler(event);
        this._changeEnabledState(TOGGLE_INTERACTIVE_STATE.SELECTED_UP, TOGGLE_INTERACTIVE_STATE.DESELECTED_UP);
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
        this._changeEnabledState(TOGGLE_INTERACTIVE_STATE.SELECTED_UP, TOGGLE_INTERACTIVE_STATE.DESELECTED_UP);
        return true;
    }

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
}

export default ToggleButton;