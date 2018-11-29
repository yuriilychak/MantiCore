import Component from "component/Component";
import Type from "util/Type";
import VERTICAL_ALIGN from "enumerator/ui/VerticalAlign";
import HORIZONTAL_ALIGN from "enumerator/ui/HorizontalAlign";
import Math from "util/Math";
import Constant from "constant";

/**
 * @desc Class for manipulate with layouts.
 * @class
 * @memberOf MANTICORE.component.ui
 * @extends MANTICORE.component.Component
 */

class ComUILayout extends Component {
    /**
     * @constructor
     */
    constructor() {
        super(Constant.COM_UI_LAYOUT_NAME);
        /**
         * @type {MANTICORE.enumerator.ui.HORIZONTAL_ALIGN}
         * @private
         */
        this._horizontalEdge = HORIZONTAL_ALIGN.NONE;
        /**
         * @type {MANTICORE.enumerator.ui.VERTICAL_ALIGN}
         * @private
         */
        this._verticalEdge = VERTICAL_ALIGN.NONE;
        /**
         * @type {int[]}
         * @private
         */
        this._margin = [0, 0, 0, 0];

        /**
         * @type {boolean}
         * @private
         */
        this._isPercentPosX = false;
        /**
         * @type {boolean}
         * @private
         */
        this._isPercentPosY = false;
        /**
         * @type {boolean}
         * @private
         */
        this._isStretchWidth = false;
        /**
         * @type {boolean}
         * @private
         */
        this._isStretchHeight = false;
        /**
         * @type {PIXI.Point | Point}
         * @private
         */
        this._percentPos = new PIXI.Point(0, 0);
        /**
         * @type {PIXI.Point | Point}
         * @private
         */
        this._percentSize = new PIXI.Point(0, 0);
        /**
         * @type {boolean}
         * @private
         */
        this._isPercentWidth = false;
        /**
         * @type {boolean}
         * @private
         */
        this._isPercentHeight = false;
        /**
         * @type {boolean}
         * @private
         */
        this._isPercentOnly = false;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc refresh layout of element.
     * @method
     * @public
     */

    refresh() {
        if (!this._hasParent()) {
            return;
        }

        switch (this._horizontalEdge) {
            case HORIZONTAL_ALIGN.NONE: {
                if (this._isStretchWidth && !this._isPercentOnly) {
                    this._updatePercentWidth();
                    this._updateLeftPos();
                } else {
                    if (this._isPercentPosX) {
                        this._updatePercentX();
                    }
                    if (this._isPercentWidth) {
                        this._updatePercentWidth();
                    }
                }
                break;
            }
            case HORIZONTAL_ALIGN.LEFT: {
                if(this._isPercentOnly) {
                    break;
                }
                if (this._isPercentWidth || this._isStretchWidth) {
                    this._updatePercentWidth();
                }
                this._updateLeftPos();
                break;
            }
            case HORIZONTAL_ALIGN.RIGHT: {
                if(this._isPercentOnly) {
                    break;
                }
                if (this._isPercentWidth || this._isStretchWidth) {
                    this._updatePercentWidth();
                }
                this._updateRightPos();
                break;
            }
            case HORIZONTAL_ALIGN.CENTER: {
                if(this._isPercentOnly) {
                    break;
                }
                if (this._isStretchWidth) {
                    this._updateStretchWidth();
                    this._updateLeftPos();
                } else {
                    if (this._isPercentWidth) {
                        this._updatePercentWidth();
                    }
                    this._updatePercentX();
                }
                break;
            }
            default: {
                break;
            }
        }

        switch (this._verticalEdge) {
            case VERTICAL_ALIGN.NONE: {
                if (this._isStretchHeight && !this._isPercentOnly) {
                    this._updatePercentHeight();
                    this._updateTopPos();
                } else {
                    if (this._isPercentPosY) {
                        this._updatePercentY();
                    }
                    if (this._isPercentHeight) {
                        this._updatePercentHeight();
                    }
                }
                break;
            }
            case VERTICAL_ALIGN.BOTTOM: {
                if(this._isPercentOnly) {
                    break;
                }
                if (this._isPercentHeight || this._isStretchHeight) {
                    this._updatePercentHeight();
                }
                this._updateBottomPos();
                break;
            }

            case VERTICAL_ALIGN.TOP: {
                if(this._isPercentOnly) {
                    break;
                }
                if (this._isPercentHeight || this._isStretchHeight) {
                    this._updatePercentHeight();
                }
                this._updateTopPos();
                break;
            }
            case VERTICAL_ALIGN.MIDDLE: {
                if(this._isPercentOnly) {
                    break;
                }
                if (this._isStretchHeight) {
                    this._updateStretchHeight();
                    this._updateTopPos();
                } else {
                    if(this._isPercentHeight) {
                        this._updatePercentHeight();
                    }
                    this._updatePercentY();
                }
                break;
            }
            default:
                break;
        }

        /*if(this.owner instanceof ccui.PageView){
            locOwner.forceDoLayout();

            var layoutVector = locOwner.getPages();
            for(var i=0; i<layoutVector.length; i++){
                ccui.helper.doLayout(layoutVector[i]);
            }
        }else{
            ccui.helper.doLayout(locOwner);
        }*/
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls for clear data on disuse and destroy.
     * @method
     * @public
     */

    clearData() {
        this._horizontalEdge = HORIZONTAL_ALIGN.NONE;
        this._verticalEdge = VERTICAL_ALIGN.NONE;
        this._margin = [0, 0, 0, 0];
        this._isPercentPosX = false;
        this._isPercentPosY = false;
        this._isStretchWidth = false;
        this._isStretchHeight = false;
        this._percentPos.set(0, 0);
        this._percentSize.set(0, 0);
        this._isPercentWidth = false;
        this._isPercentHeight = false;
        this._isPercentOnly = false;
        super.clearData();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Update stretch width of element.
     * @method
     * @private
     */

    _updateStretchWidth() {
        this.owner.width = ComUILayout._calcStretchDim(this.owner.parent.width, this._margin[0], this._margin[1]);
    }

    /**
     * @desc Update stretch height of element.
     * @method
     * @private
     */

    _updateStretchHeight() {
        this.owner.height = ComUILayout._calcStretchDim(this.owner.parent.height, this._margin[2], this._margin[3]);
    }

    /**
     * @desc Calculate stretch dimension for target.
     * @method
     * @private
     * @static
     * @param {number} dim
     * @param {number} margin1
     * @param {number} margin2
     * @return {int}
     */

    static _calcStretchDim(dim, margin1, margin2) {
        const temp = Math.round(dim - margin1 - margin2);
        return temp >= 0 ? temp : 0;
    }

    /**
     * @desc Update left position of element.
     * @method
     * @private
     */

    _updateLeftPos() {
        this.owner.x = Math.round(this._margin[0] + this.owner.anchor.x * this.owner.width);
    }

    /**
     * @desc Update top position of element.
     * @method
     * @private
     */

    _updateTopPos() {
        this.owner.y = this._margin[2] + this.owner.anchor.y * this.owner.height;
    }

    /**
     * @desc Update right position of element.
     * @method
     * @private
     */

    _updateRightPos() {
        this.owner.x = Math.round(this.owner.parent.width - (this._margin[1] + (1 - this.owner.anchor.x) * this.owner.width));
    }

    /**
     * @desc Update bottom position of element.
     * @method
     * @private
     */

    _updateBottomPos() {
        this.owner.y = Math.round(this.owner.parent.height - (this._margin[3] + (1 - this.owner.anchor.y) * this.owner.height));
    }

    /**
     * @desc Update percent width of element.
     * @method
     * @private
     */

    _updatePercentWidth() {
        this.owner.width = Math.round(this.owner.parent.width * this._percentSize.x);
    }

    /**
     * @desc Update percent height of element.
     * @method
     * @private
     */

    _updatePercentHeight() {
        this.owner.height = Math.round(this.owner.parent.height * this._percentSize.y);
    }

    /**
     * @desc Update percent horizontal position of element.
     * @method
     * @private
     */

    _updatePercentX() {
        this.owner.x = Math.round(this.owner.parent.width * this._percentPos.x);
    }

    /**
     * @desc Update percent vertical position of element.
     * @method
     * @private
     */

    _updatePercentY() {
        this.owner.y = Math.round(this.owner.parent.height * this._percentPos.y);
    }

    /**
     * @desc Flag is owner has parent.
     * @method
     * @private
     * @return {boolean}
     */

    _hasParent() {
        return this.hasOwner() && !Type.isNull(this.owner.parent);
    }

    /**
     * @desc Refresh horizontal margin of element.
     * @method
     * @private
     */

    _refreshHorizontalMargin() {
        const margin = Math.round(this.owner.x - this.owner.anchor.x * this.owner.width);
        this._margin[0] = margin;
        this._margin[1] = Math.round(this.owner.parent.width - margin - this.owner.width);
    }

    /**
     * @desc Refresh vertical margin of element.
     * @method
     * @private
     */

    _refreshVerticalMargin() {
        const margin = Math.round(this.owner.y - this.owner.anchor.y * this.owner.height);
        this._margin[2] = margin;
        this._margin[3] = Math.round(this.owner.parent.height - margin - this.owner.height);
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Percent size of element.
     * @public
     * @return {PIXI.Point}
     */

    get percentSize() {
        return this._percentSize.clone();
    }

    set percentSize(value) {
        this._percentSize.copy(value);
    }

    /**
     * @desc Flag is percent size of element enabled.
     * @public
     * @return {boolean}
     */

    get isPercentSize() {
        return this._isPercentWidth && this._isPercentHeight;
    }

    set isPercentSize(value) {
        if (this._isPercentHeight === value && this._isPercentWidth === value) {
            return;
        }
        this._isPercentWidth = this._isPercentHeight = value;
    }

    /**
     * @desc Flag is percent pos enabled for element.
     * @public
     * @return {boolean}
     */

    get isPercentPosX() {
        return this._isPercentPosX;
    }

    set isPercentPosX(value) {
        if (this._isPercentPosX === value) {
            return;
        }
        this._isPercentPosX = value;
        if (this._isPercentPosX) {
            this._horizontalEdge = HORIZONTAL_ALIGN.NONE;
        }
    }

    /**
     * @desc Percent pos of element.
     * @public
     * @return {number}
     */

    get percentPosX() {
        return this._percentPos.x;
    }

    set percentPosX(value) {
        if (this._percentPos.x === value) {
            return;
        }
        this._percentPos.x = value;

        if (!this._hasParent()) {
            return;
        }
        this._updatePercentX();
        this._refreshHorizontalMargin();
    }

    /**
     * @desc Flag is vertical percent position enabled.
     * @public
     * @return {boolean}
     */

    get isPercentPosY() {
        return this._isPercentPosY;
    }

    set isPercentPosY(value) {
        if (this._isPercentPosY === value) {
            return;
        }

        this._isPercentPosY = value;

        if (this._isPercentPosY) {
            this._verticalEdge = VERTICAL_ALIGN.NONE;
        }
    }

    /**
     * @desc Percent pos of element.
     * @public
     * @return {number}
     */

    get percentPosY() {
        return this._percentPos.y;
    }

    set percentPosY(value) {
        if (this._percentPos.y === value) {
            return;
        }

        this._percentPos.y = value;

        if (!this._hasParent()) {
            return;
        }
        this._updatePercentY();
        this._refreshVerticalMargin();
    }

    /**
     * @desc Horizontal edge of element.
     * @public
     * @return {MANTICORE.enumerator.ui.HORIZONTAL_ALIGN}
     */

    get horizontalEdge() {
        return this._horizontalEdge;
    }
    set horizontalEdge(value) {
        this._horizontalEdge = value;
        if (this._horizontalEdge !== HORIZONTAL_ALIGN.NONE)
            this._isPercentPosX = false;

        if (!this._hasParent()) {
            return;
        }

        if (this.owner.parent.width !== 0) {
            this._percentPos.x = this.owner.x / this.owner.parent.width;
        }
        else {
            this._percentPos.x = 0;
            if (this._isPercentPosX) {
                this.owner.x = 0;
            }
        }
        this._refreshHorizontalMargin();
    }

    /**
     * @desc Vertical edge of element.
     * @public
     * @return {MANTICORE.enumerator.ui.VERTICAL_ALIGN}
     */

    get verticalEdge() {
        return this._verticalEdge;
    }

    set verticalEdge(value) {
        this._verticalEdge = value;
        if (this._verticalEdge !== VERTICAL_ALIGN.NONE)
            this._isPercentPosY = false;

        if (!this._hasParent()) {
            return;
        }

        if (this.owner.parent.height !== 0) {
            this._positionPercentY = this.owner.y / this.owner.parent.height;
        }
        else {
            this._positionPercentY = 0;
            if (this._isPercentPosY) {
                this.owner.y = 0;
            }
        }
        this._refreshVerticalMargin();
    }

    /**
     * @desc Left margin of element
     * @public
     * @return {number}
     */

    get leftMargin() {
        return this._margin[0];
    }
    set leftMargin(margin) {
        this._margin[0] = margin;
    }

    /**
     * @desc Right margin of element
     * @public
     * @return {number}
     */

    get rightMargin() {
        return this._margin[1];
    }
    set rightMargin(margin) {
        this._margin[1] = margin;
    }

    /**
     * @desc Top margin of element
     * @public
     * @return {number}
     */

    get topMargin() {
        return this._margin[2];
    }
    set topMargin(margin) {
        this._margin[2] = margin;
    }

    /**
     * @desc Bottom margin of element
     * @public
     * @return {number}
     */

    get bottomMargin() {
        return this._margin[3];
    }
    set bottomMargin(margin) {
        this._margin[3] = margin;
    }

    /**
     * @desc Flag is element has percent width.
     * @public
     * @return {boolean}
     */

    get isPercentWidth() {
        return this._isPercentWidth;
    }
    set isPercentWidth(value) {
        if (this._isPercentWidth === value) {
            return;
        }
        this._isPercentWidth = value;
        if (this._isPercentWidth) {
            this._isStretchWidth = false;
        }
    }

    /**
     * @desc Percent width of element.
     * @public
     * @return {number}
     */

    get percentWidth() {
        return this._percentSize.x;
    }
    set percentWidth(value) {
        if (this._percentSize.x === value) {
            return;
        }
        this._percentSize.x = value;

        if (!this._hasParent()) {
            return;
        }
        this._updatePercentWidth();
        this._refreshHorizontalMargin();
    }

    /**
     * @desc Flag is element has percent height.
     * @public
     * @return {boolean}
     */

    get isPercentHeight() {
        return this._isPercentHeight;
    }
    set isPercentHeight(value) {
        if (this._isPercentHeight === value) {
            return;
        }
        this._isPercentHeight = value;
        if (this._isPercentHeight) {
            this._isStretchHeight = false;
        }
    }

    /**
     * @desc Percent height of element.
     * @public
     * @return {number}
     */

    get percentHeight() {
        return this._percentSize.y;
    }
    set percentHeight(value) {
        if (this._percentSize.y === value) {
            return;
        }

        this._percentSize.y = value;

        if (!this._hasParent()) {
            return;
        }
        this._updatePercentHeight();
        this._refreshVerticalMargin();
    }

    /**
     * @desc Flag is element has stretch width.
     * @public
     * @return {boolean}
     */

    get isStretchWidth() {
        return this._isStretchWidth;
    }
    set isStretchWidth(value) {
        if (this._isStretchWidth === value) {
            return;
        }
        this._isStretchWidth = value;
        if (this._isStretchWidth) {
            this._isPercentWidth = false;
        }
    }

    /**
     * @desc Flag is stretch height enabled in element.
     * @public
     * @return {boolean}
     */

    get isStretchHeight() {
        return this._isStretchHeight;
    }
    set isStretchHeight(value) {
        if (this._isStretchHeight === value) {
            return;
        }
        this._isStretchHeight = value;
        if (this._isStretchHeight) {
            this._isPercentHeight = false;
        }
    }

    /**
     * @desc Flag is percent only enabled.
     * @public
     * @return {boolean}
     */

    get percentOnly() {
        return this._isPercentOnly;
    }

    set percentOnly(value){
        this._isPercentOnly = value;
    }
}

export default ComUILayout;