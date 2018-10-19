import Slice9Sprite from "view/Slice9Sprite";
import Repository from "repository/Repository";
import Type from "util/Type";

/**
 * @desc Slice9 Sprite that have states.
 * @class
 * @extends MANTICORE.view.Slice9Sprite
 * @memberOf MANTICORE.ui.ancillary
 */

class StateSlice9Sprite extends Slice9Sprite {
    /**
     * @constructor
     * @param {string} frameName
     * @param {int | string} state
     * @param {int} [leftSlice = 0]
     * @param {int} [rightSlice = 0]
     * @param {int} [topSlice = 0]
     * @param {int} [bottomSlice = 0]
     */
    constructor(frameName, state, leftSlice = 0, rightSlice = 0, topSlice = 0, bottomSlice = 0) {
        super(frameName, leftSlice, rightSlice, topSlice, bottomSlice);

        /**
         * @type {int|string}
         * @private
         */

        this._defaultState = state;

        /**
         * @type {int|string}
         * @private
         */

        this._currentState = state;

        /**
         * @type {MANTICORE.repository.Repository}
         * @private
         */

        this._states = new Repository();

        this._states.addElement(frameName, state);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc add state to sprite.
     * @method
     * @public
     * @param {string} frameName
     * @param {string | int} state
     */

    addState(frameName, state) {
        if (Type.isNull(frameName)) {
            return;
        }
        this._states.addElement(frameName, state);
    }

    /**
     * @desc Check is sprite has state.
     * @method
     * @public
     * @param {int | string} state
     * @return {boolean}
     */

    hasState(state) {
        return this._states.hasElement(state);
    }

    /**
     * @desc Return frame name by state if it exist.
     * @method
     * @public
     * @param {int | string} state
     * @return {string | null}
     */

    getFrameByState(state) {
        return this._states.getElement(state);
    }

    /**
     * Add or remove state. If try to remove default state do nothing.
     * @method
     * @public
     * @param {string | null} frame
     * @param {string | int} state
     */

    setFrameByState(frame, state) {
        const hasState = this._states.hasElement(state);
        if (Type.isNull(frame)) {
            if (state === defaultStatus || !hasState) {
                return;
            }

            this._states.removeElement(state);
            this._currentState = this._defaultState;
            this._updateCurrentState();
        }

        if (hasState) {
            this._states.updateElement(frame, state);
        }
        else {
            this._states.addElement(frame, state);
        }

        if (this._currentState !== state) {
            return;
        }

        this._updateCurrentState();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Update current state.
     * @method
     * @private
     */

    _updateCurrentState() {
        this.frameName = this._states.getElement(this._currentState);
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {int|string}
     */

    get state() {
        return this._currentState;
    }

    set state(value) {
        if (!this._states.hasElement(value) || this._currentState === value) {
            return;
        }

        this._currentState = value;
        this._updateCurrentState();
    }
}

export default StateSlice9Sprite;