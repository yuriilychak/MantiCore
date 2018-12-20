import Type from "util/Type";
import Widget from "ui/Widget";
import StateSlice9Sprite from "./StateSlice9Sprite";
import INTERACTIVE_EVENT from "enumerator/ui/InteractiveEvent";

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

        this.interactive = true;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {string} frame - Default frame of button.
     * @param {int} state - Default state of button.
     */
    reuse(frame, state) {
        super.reuse(new StateSlice9Sprite(frame, state));
        this._isEnabled = true;
        this._title = null;
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
     * @desc Change frame of button if it exist.
     * @method
     * @public
     * @param {int} state
     */

    changeState(state) {
        this.collider.state = state;
    }

    /**
     * @method
     * @public
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

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data before disuse and destroy.
     * @method
     * @protected
     */

    clearData() {
        this._isEnabled = true;

        if (this.hasTitle()) {
            this._title.kill();
            this._title = null;
        }

        super.clearData();
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
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {boolean}
     */

    get enabled() {
        return this._isEnabled;
    }

    set enabled(value) {
        if (this._isEnabled === value) {
            return;
        }
        this._isEnabled = value;
        this.onEnabledChange(this._isEnabled);
        if (this.hasInteractionManager) {
            this.interactionManager.emitInteractiveEvent(INTERACTIVE_EVENT.ENABLED_CHANGE, this._isEnabled);
        }
        this.blockEvents = !value;
    }

    /**
     * @public
     * @type {?MANTICORE.ui.ancillary.BaseLabel}
     */

    get title() {
        return this._title;
    }

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
     * @type {string}
     */

    get titleText() {
        return this.hasTitle() ? this._title.text : "";
    }

    set titleText(value) {
        if (!this.hasTitle()) {
            return;
        }

        this._title.text = value;
    }
}

export default BaseButton;