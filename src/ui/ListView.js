import ScrollView from "./ScrollView";
import PANEL_GRAPHIC_TYPE from "enumerator/ui/PanelGrphicType";
import ComLayout from "component/ui/ComLayout";
import ComChildListener from "component/ui/ComChildListener";
import SCROLL_DIRECTION from "enumerator/ui/ScrollDirection";
import UI_ELEMENT from "enumerator/ui/UIElement";
import HORIZONTAL_ALIGN from "enumerator/ui/HorizontalAlign";
import VERTICAL_ALIGN from "enumerator/ui/VerticalAlign";

/**
 * @class
 * @memberOf MANTICORE.ui
 * @extends MANTICORE.ui.ScrollView
 */

class ListView extends ScrollView {
    /**
     * @constructor
     * @param {MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE} [graphicType = MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE.NONE] - Type of graphic that use panel.
     * @param {?string | ?int} [data = null] - Data that need to init panel. If type Color this is color, if Sprite it link to texture.
     */
    constructor(graphicType = PANEL_GRAPHIC_TYPE.NONE, data = null) {
        super(graphicType, data);

        /**
         * @type {MANTICORE.component.ui.ComLayout}
         * @private
         */

        this._layout = new ComLayout();

        /**
         * @desc Component for add event for child interactions.
         * @type {MANTICORE.component.ui.ComChildListener}
         * @private
         */

        this._childListener = new ComChildListener();

        this.innerContainer.addComponent(this._layout);
        this.innerContainer.addComponent(this._childListener);

        this.scrollDirection = SCROLL_DIRECTION.HORIZONTAL;
        this._layout.staticHeight = true;
        this._layout.minWidth = this.width;

        this._layout.horizontalAlign = HORIZONTAL_ALIGN.CENTER;
        this._layout.verticalAlign = VERTICAL_ALIGN.MIDDLE;

        this.uiType = UI_ELEMENT.LIST_VIEW;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @returns {MANTICORE.component.ui.ComLayout}
     */

    get layout() {
        return this._layout;
    }

    /**
     * @public
     * @returns {MANTICORE.enumerator.ui.VERTICAL_ALIGN}
     */

    get verticalAlign() {
        return this._layout.verticalAlign;
    }

    /**
     * @public
     * @param {MANTICORE.enumerator.ui.VERTICAL_ALIGN} value
     */

    set verticalAlign(value) {
        this._layout.verticalAlign = value;
    }

    /**
     * @public
     * @returns {MANTICORE.enumerator.ui.HORIZONTAL_ALIGN}
     */

    get horizontalAlign() {
        return this._layout.horizontalAlign;
    }

    /**
     * @public
     * @param {MANTICORE.enumerator.ui.HORIZONTAL_ALIGN} value
     */

    set horizontalAlign(value) {
        this._layout.horizontalAlign = value;
    }

    /**
     * @public
     * @returns {string | null}
     */

    get eventItemUp() {
        return this._childListener.eventUp;
    }

    /**
     * @public
     * @param {string | null} value
     */

    set eventItemUp(value) {
        this._childListener.eventUp = value;
    }

    /**
     * @public
     * @returns {string | null}
     */

    get eventItemDown() {
        return this._childListener.eventDown;
    }

    /**
     * @public
     * @param {string | null} value
     */

    set eventItemDown(value) {
        this._childListener.eventDown = value;
    }

    /**
     * @public
     * @returns {string | null}
     */

    get eventItemOver() {
        return this._childListener.eventOver;
    }

    /**
     * @public
     * @param {string | null} value
     */

    set eventItemOver(value) {
        this._childListener.eventOver = value;
    }

    /**
     * @public
     * @returns {string | null}
     */

    get eventItemOut() {
        return this._childListener.eventOut;
    }

    /**
     * @public
     * @param {string | null} value
     */

    set eventItemOut(value) {
        this._childListener.eventOut = value;
    }

    /**
     * @public
     * @returns {string | null}
     */

    get eventItemMove() {
        return this._childListener.eventMove;
    }

    /**
     * @public
     * @param {string | null} value
     */

    set eventItemMove(value) {
        this._childListener.eventMove = value;
    }

    /**
     * @public
     * @returns {string | null}
     */

    get eventItemDrag() {
        return this._childListener.eventDrag;
    }

    /**
     * @public
     * @param {string | null} value
     */

    set eventItemDrag(value) {
        this._childListener.eventDrag = value;
    }

    /**
     * @public
     * @returns {string | null}
     */

    get eventItemClick() {
        return this._childListener.eventClick;
    }

    /**
     * @public
     * @param {string | null} value
     */

    set eventItemClick(value) {
        this._childListener.eventClick = value;
    }

    /**
     * @public
     * @returns {string | null}
     */

    get eventItemDragFinish() {
        return this._childListener.eventDragFinish;
    }

    /**
     * @public
     * @param {string | null} value
     */

    set eventItemDragFinish(value) {
        this._childListener.eventDragFinish = value;
    }

    /**
     * @public
     * @returns {string | null}
     */

    get eventItemDragStart() {
        return this._childListener.eventDragStart;
    }

    /**
     * @public
     * @param {string | null} value
     */

    set eventItemDragStart(value) {
        this._childListener.eventDragStart = value;
    }

    /**
     * @public
     * @return {int}
     */

    get width() {
        return super.width;
    }

    /**
     * @public
     * @param {int} value
     */

    set width(value) {
        super.width = value;
        if (this.isHorizontal()) {
            this._layout.minWidth = super.width;
            return;
        }
        super.innerWidth = super.width;
    }

    /**
     * @public
     * @return {int}
     */

    get height() {
        return super.height;
    }

    /**
     * @public
     * @param {int} value
     */

    set height(value) {
        super.height = value;
        if (this.isVertical()) {
            this._layout.minHeight = super.height;
            return;
        }
        super.innerHeight = super.height;
    }

    /**
     * @desc Return slider depend of direction.
     * @public
     * @returns {?MANTICORE.ui.Slider}
     */

    get slider() {
        return this.isHorizontal() ? super.horizontalSlider : super.verticalSlider;
    }

    /**
     * @public
     * @param {?MANTICORE.ui.Slider} value
     */

    set slider(value) {
        if (this.isHorizontal()) {
            this.horizontalSlider = value;
            return;
        }
        this.verticalSlider = value;
    }

    /**
     * @public
     * @returns {MANTICORE.enumerator.ui.SCROLL_DIRECTION}
     */

    get scrollDirection() {
        return super.scrollDirection;
    }

    /**
     * @public
     * @param {MANTICORE.enumerator.ui.SCROLL_DIRECTION} value
     */

    set scrollDirection(value) {
        if (
            (value !== SCROLL_DIRECTION.HORIZONTAL && value !== SCROLL_DIRECTION.VERTICAL) ||
            super.scrollDirection === value
        ) {
            return;
        }
        super.scrollDirection = value;

        if (this.isHorizontal()) {
            this._layout.staticHeight = true;
            this._layout.staticWidth = false;
            this.innerHeight = this.height;
            this._layout.minWidth = this.width;
            this._layout.maxWidth = -1;

        }
        else {
            this._layout.staticHeight = false;
            this._layout.staticWidth = true;
            this.innerWidth = this.width;
            this._layout.minHeight = this.height;
            this._layout.maxHeight = -1;
        }
    }

    /**
     * @public
     * @returns {int}
     */

    get innerWidth() {
        return super.width;
    }

    /**
     * @public
     * @param {int} value
     */

    set innerWidth(value) {}

    /**
     * @public
     * @returns {int}
     */

    get innerHeight() {
        return super.height;
    }

    /**
     * @public
     * @param {int} value
     */

    set innerHeight(value) {}

    /**
     * @public
     * @returns {PIXI.ObservablePoint}
     */

    get innerPadding() {
        return this._layout.innerPadding;
    }

    /**
     * @public
     * @param {PIXI.Point | PIXI.ObservablePoint} value
     */

    set innerPadding(value) {
        this._layout.outerPadding = value;
    }

    /**
     * @public
     * @returns {PIXI.ObservablePoint}
     */

    get outerPadding() {
        return this._layout.outerPadding;
    }

    /**
     * @public
     * @param {PIXI.Point | PIXI.ObservablePoint} value
     */

    set outerPadding(value) {
        this._layout.outerPadding = value;
    }
}

export default ListView;