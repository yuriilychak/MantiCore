import Label from "./Label";
import Type from "util/Type";
import Math from "util/Math";
import Color from "util/Color";
import Geometry from "util/Geometry";
import Format from "util/Format";
import UI_ELEMENT from "enumerator/ui/UIElement";
import INTERACTIVE_EVENT from "enumerator/ui/InteractiveEvent";

/**
 * @type {?HTMLInputElement}
 * @ignore
 */
let input = null;
/**
 * @type {string}
 * @ignore
 */
const defaultAttributes = "position:fixed; left:-10px; top:-10px; width:0px; height: 0px;";
/**
 * @type {string}
 * @ignore
 */
const styleTemplate = "position:fixed; left:{0}px; top:{1}px; height:{2}px; width:{3}px; opacity: 0.4;";

/**
 * @type {int}
 * @ignore
 */
const MAX_CHAR_COUNT = 1024000;

/**
 * @desc Class for text input.
 * @class
 * @extends MANTICORE.ui.Label
 * @memberOf MANTICORE.ui
 */

class TextField extends Label {

    /**
     * @constructor
     * @param {string} fontName
     * @param {int} size
     */

    constructor(fontName, size) {
        super(fontName, size);

        if (Type.isNull(input)) {
            input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("id", "MANTICORE.Input");
            TextField._updateInputStyle();
            document.body.appendChild(input);
        }

        /**
         * @type {int}
         * @private
         */

        this._maxLength = -1;

        /**
         * @private
         * @type {string}
         * @private
         */
        this._realText = "";

        /**
         * @desc Is enable password mode.
         * @type {boolean}
         * @private
         */

        this._passwordMode = false;

        /**
         * @desc Char symbol for mask password.
         * @type {string}
         * @private
         */

        this._passwordChar = "*";

        /**
         * @desc Is enable cursor when edition enabled.
         * @type {boolean}
         * @private
         */

        this._cursorEnabled = true;

        /**
         * @desc Cursor char.
         * @type {string}
         * @private
         */

        this._cursorChar = "I";

        /**
         * @desc Placeholder when text empty.
         * @type {?string}
         * @private
         */

        this._placeholderText = null;

        /**
         * @desc Color of text
         * @type {int}
         * @private
         */

        this._color = Color.COLORS.WHITE;

        /**
         * @desc Color of placeholder.
         * @type {int}
         * @private
         */

        this._placeholderColor = 0xAAAAAA;

        /**
         * @type {boolean}
         * @private
         */

        this._isSelected = false;

        this.uiType = UI_ELEMENT.TEXT_FIELD;

        this._updateTextTransform();
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {string} fontName
     * @param {int} size
     */
    reuse(fontName, size) {
        super.reuse(fontName, size);

        this._maxLength = -1;
        this._realText = "";
        this._passwordMode = false;
        this._passwordChar = "*";
        this._cursorEnabled = true;
        this._cursorChar = "I";
        this._placeholderText = null;
        this._color = Color.COLORS.WHITE;
        this._placeholderColor = 0xAAAAAA;
        this._isSelected = false;

        this._updateTextTransform();
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
        if (eventType !== INTERACTIVE_EVENT.UP) {
            return;
        }

        this._isSelected = true;
        const x = this.worldTransform.tx;
        const y = this.worldTransform.ty;
        const globalSize = this.toGlobal(Geometry.pFromSize(this));

        TextField._updateInputStyle(Format.replace(styleTemplate, x, y, globalSize.y, globalSize.x));
        input.value = this.text;
        input.maxLength = this._maxLength === -1 ? MAX_CHAR_COUNT : this._maxLength;
        input.onblur = this._onInputBlurHandler.bind(this);
        input.oninput = this._onInputChangeHandler.bind(this);
        input.focus();
        TextField._updateInputStyle();
        this._updateTextTransform();
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
        this._maxLength = -1;
        this._realText = "";
        this._passwordMode = false;
        this._passwordChar = "*";
        this._cursorEnabled = true;
        this._cursorChar = "I";
        this._placeholderText = null;
        this._color = Color.COLORS.WHITE;
        this._placeholderColor = 0xAAAAAA;
        this._isSelected = false;

        super.clearData();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Update input string
     * @method
     * @private
     * @param {string} [styleString]
     */

    static _updateInputStyle(styleString = defaultAttributes) {
        input.setAttribute("style", styleString);
    }

    /**
     * @function
     * @private
     */

    _onInputBlurHandler() {
        input.onblur = null;
        input.oninput = null;
        this._isSelected = false;
        this._updateTextTransform();
    }

    /**
     * @function
     * @private
     */

    _onInputChangeHandler() {
        this._realText = input.value;
        this._updateTextTransform();
    }

    /**
     * @desc Update text transformations.
     * @method
     * @private
     */

    _updateTextTransform() {
        if (!this._isSelected && !Type.isNull(this._placeholderText) && this._realText.length === 0) {
            super.color = this._placeholderColor;
            super.text = this._placeholderText;
            return;
        }

        super.color = this._color;

        const cursor = this._isSelected && this._cursorEnabled ? this._cursorChar : "";

        if (!this._passwordMode) {
            super.text = this._realText + cursor;
            return;
        }

        const charCount = this._realText.length;
        let mask = "";

        for (let i = 0; i < charCount; ++i) {
            mask = mask + this._passwordChar;
        }

        super.text = mask + cursor;
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns text of text field
     * @public
     * @type {string}
     */

    get text() {
        return this._realText;
    }

    set text(value) {
        if (this._realText === value) {
            return;
        }
        this.localized = true;
        this._realText = value;
        this._updateTextTransform();
    }

    /**
     * @public
     * @type {int}
     */

    get maxLength() {
        return this._maxLength;
    }

    set maxLength(value) {
        if (this._maxLength === value || this._maxLength < -1) {
            return;
        }
        this._maxLength = Math.floor(value);
        const textLength = this._realText.length;
        if (this._maxLength === -1 || this._realText.length <= this._maxLength) {
            return;
        }

        this._realText = this._realText.substr(0, this._maxLength);
        this._updateTextTransform();
    }

    /**
     * @public
     * @type {boolean}
     */

    get passwordMode() {
        return this._passwordMode;
    }

    set passwordMode(value) {
        if (this._passwordMode === value) {
            return;
        }
        this._passwordMode = value;
        this._updateTextTransform();
    }

    /**
     * @public
     * @type {string}
     */

    get passwordChar() {
        return this._passwordChar;
    }

    set passwordChar(value) {
        if (this._passwordChar === value) {
            return;
        }
        this._passwordChar = value[0];

        if (!this._passwordMode) {
            return;
        }

        this._updateTextTransform();
    }

    /**
     * @public
     * @type {boolean}
     */

    get cursorEnabled() {
        return this._cursorEnabled;
    }

    set cursorEnabled(value) {
        if (this._cursorEnabled === value) {
            return;
        }
        this._cursorEnabled = value;
    }

    /**
     * @public
     * @type {string}
     */

    get cursorChar() {
        return this._cursorChar;
    }

    set cursorChar(value) {
        if (this._cursorChar === value) {
            return;
        }

        this._cursorChar = value[0];

        if (!this._cursorEnabled || !this._isSelected) {
            return;
        }

        this._updateTextTransform();
    }

    /**
     * @public
     * @type {int}
     */

    get placeholderColor() {
        return this._placeholderColor;
    }

    /**
     * @public
     * @type {string}
     */

    get placeholderText() {
        return !Type.isNull(this._placeholderText) ? this._placeholderText : "";
    }

    set placeholderText(value)  {
        if (this._placeholderText === value) {
            return;
        }

        this._placeholderText = value !== "" ? value : null;

        if (this._isSelected || Type.isNull(this._placeholderText) || this._realText.length !== 0) {
            return;
        }

        this._updateTextTransform();
    }

    /**
     * @public
     * @type {int}
     */

    get color() {
        return this._color;
    }

    set color(value) {
        if (this._color === value) {
            return;
        }
        this._color = value;
        this._placeholderColor = Color.setLightness(value, Color.getLightness(value) * 0.6);

        this._updateTextTransform();
    }
}

export default TextField;