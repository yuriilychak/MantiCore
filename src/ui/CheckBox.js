import Button from "./Button";
import StateSlice9Sprite from "ui/ancillary/StateSlice9Sprite";
import INTERACTIVE_STATE from "enumerator/ui/InteractiveState";
import Math from "../util/Math";
import UI_ELEMENT from "enumerator/ui/UIElement";

/**
 * @class
 * @extends MANTICORE.ui.Button
 * @memberOf MANTICORE.ui
 */

class CheckBox extends Button {
    constructor (
        upBackFrame,
        upIconFrame,
        downBackFrame = null,
        overBackFrame = null,
        disabledBackFrame = null,
        downIconFrame = null,
        overIconFrame = null,
        disableIconFrame = null,
    ) {
        super(upBackFrame, downBackFrame, overBackFrame, disabledBackFrame);

        /**
         * @type {MANTICORE.ui.ancillary.StateSlice9Sprite}
         * @private
         */
        this._icon = new StateSlice9Sprite(upIconFrame, INTERACTIVE_STATE.UP);

        this._icon.addState(downIconFrame, INTERACTIVE_STATE.DOWN);
        this._icon.addState(overIconFrame, INTERACTIVE_STATE.OVER);
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
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @protected
     * @param {Object} event
     */

    onActionClickHandler(event) {
        this.selected = !this.selected;
        super.onActionClickHandler(event);
    }

    /**
     * @desc Change frame of button if it exist.
     * @method
     * @protected
     * @override
     * @param {MANTICORE.enumerator.ui.INTERACTIVE_STATE} state
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
     * @type {MANTICORE.ui.ancillary.StateSlice9Sprite}
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