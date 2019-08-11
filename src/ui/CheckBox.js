import Button from "./Button";
import StateSlice9Sprite from "ui/ancillary/StateSlice9Sprite";
import INTERACTIVE_STATE from "enumerator/ui/InteractiveState";
import INTERACTIVE_EVENT from "enumerator/ui/InteractiveEvent";
import Math from "../util/Math";
import UI_ELEMENT from "enumerator/ui/UIElement";
import Boot from "boot";

/**
 * @class
 * @extends mCore.ui.Button
 * @memberOf mCore.ui
 */

class CheckBox extends Button {
    /**
     * @constructor
     * @param {string} upBackFrame
     * @param {string} upIconFrame
     * @param {?string} [downBackFrame = null]
     * @param {?string} [overBackFrame = null]
     * @param {?string} [disabledBackFrame = null]
     * @param {?string} [downIconFrame = null]
     * @param {?string} [overIconFrame = null]
     * @param {?string} [disableIconFrame = null]
     */
    constructor (
        upBackFrame,
        upIconFrame,
        downBackFrame = null,
        overBackFrame = null,
        disabledBackFrame = null,
        downIconFrame = null,
        overIconFrame = null,
        disableIconFrame = null
    ) {
        super(upBackFrame, downBackFrame, overBackFrame, disabledBackFrame);

        /**
         * @type {mCore.ui.ancillary.StateSlice9Sprite}
         * @private
         */
        this._icon = new StateSlice9Sprite(upIconFrame, INTERACTIVE_STATE.UP);

        this._icon.addState(downIconFrame, INTERACTIVE_STATE.DOWN);
        if (Boot.isDesktop()) {
            this._icon.addState(overIconFrame, INTERACTIVE_STATE.OVER);
        }
        this._icon.addState(disableIconFrame, INTERACTIVE_STATE.DISABLED);
        this._icon.name = "imgCheck";

        this._icon.visible = false;

        /**
         * @type {boolean}
         * @private
         */

        this._isSelected = false;

        this.uiType = UI_ELEMENT.CHECK_BOX;

        this.addChild(this._icon);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {string} upBackFrame
     * @param {string} upIconFrame
     * @param {?string} [downBackFrame = null]
     * @param {?string} [overBackFrame = null]
     * @param {?string} [disabledBackFrame = null]
     * @param {?string} [downIconFrame = null]
     * @param {?string} [overIconFrame = null]
     * @param {?string} [disableIconFrame = null]
     */
    reuse(
        upBackFrame,
        upIconFrame,
        downBackFrame = null,
        overBackFrame = null,
        disabledBackFrame = null,
        downIconFrame = null,
        overIconFrame = null,
        disableIconFrame = null
    ) {
        super.reuse(upBackFrame, downBackFrame, overBackFrame, disabledBackFrame);

        this._icon = new StateSlice9Sprite(upIconFrame, INTERACTIVE_STATE.UP);
        this._icon.addState(downIconFrame, INTERACTIVE_STATE.DOWN);
        if (Boot.isDesktop()) {
            this._icon.addState(overIconFrame, INTERACTIVE_STATE.OVER);
        }
        this._icon.addState(disableIconFrame, INTERACTIVE_STATE.DISABLED);
        this._icon.name = "imgCheck";

        this._icon.visible = false;
        this._isSelected = false;
    }

    /**
     * @desc Calls when interactive manager emit event.
     * @method
     * @public
     * @param {mCore.enumerator.ui.INTERACTIVE_EVENT} eventType
     * @param {Object} event
     */

    emitInteractiveEvent(eventType, event) {
        super.emitInteractiveEvent(eventType, event);
        if (eventType !== INTERACTIVE_EVENT.CLICK) {
            return;
        }
        this.selected = !this.selected;
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Change frame of button if it exist.
     * @method
     * @protected
     * @override
     * @param {mCore.enumerator.ui.INTERACTIVE_STATE} state
     */

    changeState(state) {
        super.changeState(state);
        this._icon.state = state;
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns width of slice 9 sprite
     * @public
     * @type {int}
     */

    get width() {
        return super.width;
    }

    /**
     * @desc Returns height of slice 9 sprite
     * @public
     * @type {int}
     */

    get height() {
        return super.height;
    }

    set width(value) {
        super.width = value;
        this._icon.x = Math.divPowTwo(this.width);
    }

    set height(value) {
        super.height = value;
        this._icon.y = Math.divPowTwo(this.height);
    }


    /**
     * @public
     * @type {mCore.ui.ancillary.StateSlice9Sprite}
     */

    get icon() {
        return this._icon;
    }

    /**
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
        this._icon.visible = value;
    }
}

export default CheckBox;
