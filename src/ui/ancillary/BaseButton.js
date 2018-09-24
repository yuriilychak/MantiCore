import Type from "util/Type";
import Widget from "ui/Widget";
import StateSlice9Sprite from "./StateSlice9Sprite";

/**
 * @desc basee class for buttons and toggle buttons.
 * @class
 * @extends MANTICORE.ui.Widget
 * @memberOf MANTICORE.ui.ancillary
 */

class BaseButton extends Widget {

    /**
     * @constructor
     * @param {string} frame - Default frame of button.
     * @param {int} state - Default state of button.
     */

    constructor(frame, state) {
        super(new StateSlice9Sprite(frame, state));

        /**
         * @desc Is button enabled.
         * @type {boolean}
         * @private
         */

        this._isEnabled = true;

        /**
         * @type {?MANTICORE.ui.Label}
         * @private
         */

        this._title = null;
    }

    /**
     * @public
     * @return {boolean}
     */

    get enabled() {
        return this._isEnabled;
    }

    /**
     * @public
     * @param {boolean} value
     */

    set enabled(value) {
        if (this._isEnabled === value) {
            return;
        }

        this._isEnabled = value;
        this.blockEvents = value;
        this.onEnabledChange(this._isEnabled);
    }

    /**
     * @public
     * @return {?MANTICORE.ui.ancillary.BaseLabel}
     */

    get title() {
        return this._title;
    }

    /**
     * @public
     * @param {MANTICORE.ui.ancillary.BaseLabel | null} value
     */

    set title(value) {
        if (this._title === value) {
            return;
        }

        if (this.hasTitle()) {
            this.removeChild(this._title);
        }

        this._title = value;

        if (!this.hasTitle()) {
            return;
        }
        this.addChild(this._title);
    }

    /**
     * @public
     * @return {string}
     */

    get titleText() {
        return this.hasTitle() ? this._title.text : "";
    }

    /**
     * @public
     * @param {string} value
     */

    set titleText(value) {
        if (!this.hasTitle()) {
            return;
        }

        this._title.text = value;
    }

    /**
     * @method
     * @public
     * @return {boolean}
     */

    hasTitle() {
        return !Type.isNull(this._title);
    }


    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Change frame of button if it exist.
     * @method
     * @protected
     * @param {int} state
     */

    changeState(state) {
        this.collider.state = state;
    }

    /**
     * @desc Change frame is button enabled.
     * @method
     * @param {int} state
     * @protected
     */

    changeEnabledState(state) {
        if (!this._isEnabled) {
            return;
        }
        this.changeState(state);
    }

    /**
     * @desc Calls when button change enable.
     * @method
     * @protected
     * @param {boolean} enabled
     */

    onEnabledChange(enabled) {}

    /**
     * @method
     * @protected
     * @param {int} state
     * @param {int} fallback
     * @param {boolean} [isEnabled] - Is change enabled state.
     */

    changeStateWithFallback(state, fallback, isEnabled = true) {
        const nextState = this.collider.hasState(state) ? state : fallback;
        if (isEnabled) {
            this.changeEnabledState(nextState);
            return;
        }
        this.changeState(nextState);
    }
}

export default BaseButton;