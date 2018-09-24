import Panel from "./Panel";
import Widget from "./Widget";
import PANEL_GRAPHIC_TYPE from "enumerator/ui/PanelGrphicType";
import Math from "util/Math";
import Format from "util/Format";
import Geometry from "util/Geometry";
import UI_ELEMENT from "enumerator/ui/UIElement";
import Type from "util/Type";
import SCROLL_DIRECTION from "enumerator/ui/ScrollDirection";

/**
 * @enum {string}
 * @private
 * @readonly
 * @memberOf MANTICORE.ui.ScrollView.
 */

const LOCAL_EVENT = {
    DRAG: "DRAG_INNER_CONTAINER",
    DOWN: "DOWN_INNER_CONTAINER",
    HORIZONTAL_SCROLL: "H_SCROLL",
    VERTICAL_SCROLL: "V_SCROLL"
};

/**
 * @desc Scroll view element.
 * @class
 * @extends MANTICORE.ui.Panel
 * @memberOf MANTICORE.ui
 */

class ScrollView extends Panel {
    /**
     * @constructor
     * @param {MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE} [graphicType = MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE.NONE] - Type of graphic that use panel.
     * @param {?string | ?int} [data = null] - Data that need to init panel. If type Color this is color, if Sprite it link to texture.
     */
    constructor(graphicType = PANEL_GRAPHIC_TYPE.NONE, data = null) {
        super(graphicType, data);

        /**
         * @desc Container with elements.
         * @type {MANTICORE.ui.Widget}
         * @private
         */

        this._innerContainer = new Widget();

        /**
         * @desc Previous drag pos for update drag.
         * @type {PIXI.Point}
         * @private
         */

        this._prvDragPos = new PIXI.Point(0, 0);

        /**
         * @desc Zero point. Need for calculate drag position, for don't create every frame.
         * @type {PIXI.Point}
         * @private
         */

        this._zeroPoint = new PIXI.Point(0, 0);

        /**
         * @desc Inner boundary for scroll. Need to don't calculate every frame.
         * @type {PIXI.Point}
         * @private
         */

        this._innerBoundary = new PIXI.Point(0, 0);

        /**
         * @type {?MANTICORE.ui.Slider}
         * @private
         */

        this._verticalSlider = null;

        /**
         * @type {?MANTICORE.ui.Slider}
         * @private
         */

        this._horizontalSlider = null;

        /**
         * @desc Custom event for down.
         * @type {?string}
         * @private
         */

        this._eventDown = null;

        /**
         * @desc Custom event for drag.
         * @type {?string}
         * @private
         */

        this._eventDrag = null;

        /**
         * @desc Direction of scroll.
         * @type {MANTICORE.enumerator.ui.SCROLL_DIRECTION}
         * @private
         */

        this._scrollDirection = SCROLL_DIRECTION.BOTH;

        const eventDown = Format.generateEventName(this, LOCAL_EVENT.DOWN);
        const eventDrag = Format.generateEventName(this, LOCAL_EVENT.DRAG);

        this.addEventListener(eventDrag, this.onDragInnerContainerHandler);
        this.addEventListener(eventDown, this.onDownInnerContainerHandler);

        this._innerContainer.eventDrag = eventDrag;
        this._innerContainer.eventDown = eventDown;
        this._innerContainer.propagateChildrenEvents = true;
        this._innerContainer.interactive = true;

        this.uiType = UI_ELEMENT.SCROLL_VIEW;

        super.addChild(this._innerContainer);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

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
        this._innerBoundary.x = this.width - this._innerContainer.width;
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
        this._innerBoundary.y = this.height - this._innerContainer.height;
    }

    /**
     * @public
     * @returns {boolean}
     */

    get interactive() {
        return this._innerContainer.interactive;
    }

    /**
     * @public
     * @param {boolean} value
     */

    set interactive(value) {
        if (this._innerContainer.interactive === value) {
            return;
        }
        this._innerContainer.interactive = value;
    }

    /**
     * @public
     * @returns {MANTICORE.enumerator.ui.SCROLL_DIRECTION}
     */

    get scrollDirection() {
        return this._scrollDirection;
    }

    /**
     * @public
     * @param {MANTICORE.enumerator.ui.SCROLL_DIRECTION} value
     */

    set scrollDirection(value) {
        if (this._scrollDirection === value) {
            return;
        }

        switch (value) {
            case SCROLL_DIRECTION.VERTICAL: {
                this.horizontalSlider = null;
                this._innerContainer.x = 0;
                break;
            }
            case SCROLL_DIRECTION.HORIZONTAL: {
                this.verticalSlider = null;
                this._innerContainer.y = 0;
                break;
            }
            default: {
            }
        }

        this._scrollDirection = value;
    }

    /**
     * @public
     * @returns {?MANTICORE.ui.Slider}
     */

    get horizontalSlider() {
        return this._horizontalSlider;
    }

    /**
     * @public
     * @param {?MANTICORE.ui.Slider} value
     */

    set horizontalSlider(value) {
        if (this._horizontalSlider === value || this.isVertical()) {
            return;
        }

        this._horizontalSlider = this._initSlider(this._horizontalSlider, value, SCROLL_DIRECTION.HORIZONTAL, this.onScrollHorizontalHandler);
    }

    /**
     * @public
     * @returns {?MANTICORE.ui.Slider}
     */

    get verticalSlider() {
        return this._verticalSlider;
    }

    /**
     * @public
     * @param {?MANTICORE.ui.Slider} value
     */

    set verticalSlider(value) {
        if (this._verticalSlider === value || this.isHorizontal()) {
            return;
        }

        this._verticalSlider = this._initSlider(this._verticalSlider, value, SCROLL_DIRECTION.VERTICAL, this.onScrollVerticalHandler);
    }

    /**
     * @public
     * @returns {MANTICORE.ui.Widget}
     */

    get innerContainer() {
        return this._innerContainer;
    }

    /**
     * @public
     * @returns {int}
     */

    get innerWidth() {
        return this._innerContainer.width;
    }

    /**
     * @public
     * @param {int} value
     */

    set innerWidth(value) {
        this._innerContainer.width = value;
        this._innerBoundary.x = this.width - this._innerContainer.width;
    }

    /**
     * @public
     * @returns {int}
     */

    get innerHeight() {
        return this._innerContainer.height;
    }

    /**
     * @public
     * @param {int} value
     */

    set innerHeight(value) {
        this._innerContainer.height = value;
        this._innerBoundary.y = this.height - this._innerContainer.height;
    }

    /**
     * @method
     * @public
     * @override
     * @param {...PIXI.DisplayObject} var_args
     * @returns {PIXI.DisplayObject | PIXI.DisplayObject[]}
     */

    addChild(var_args) {
        const argumentCount = arguments.length;
        const result = [];
        for (let i = 0; i < argumentCount; ++i) {
            result.push(this._innerContainer.addChild(arguments[i]));
        }
        return result.length === 1 ? result[0] : result;
    }

    /**
     * @method
     * @public
     * @override
     * @param  {PIXI.DisplayObject} child
     * @param {int} index
     * @returns {PIXI.DisplayObject}
     */

    addChildAt(child, index) {
        return this._innerContainer.addChildAt(child, index);
    }

    /**
     * @method
     * @public
     * @override
     * @param {...PIXI.DisplayObject} var_args
     * @returns {?PIXI.DisplayObject | ?PIXI.DisplayObject[]}
     */

    removeChild(var_args) {
        const argumentCount = arguments.length;
        const result = [];
        for (let i = 0; i < argumentCount; ++i) {
            result.push(this._innerContainer.removeChild(arguments[i]));
        }
        return result.length === 1 ? result[0] : result;
    }

    /**
     * @method
     * @public
     * @override
     * @param {int} index
     * @returns {?PIXI.DisplayObject}
     */

    removeChildAt(index) {
        return this._innerContainer.removeChildAt(index);
    }

    /**
     * @method
     * @public
     * @override
     * @param {int} [beginIndex = 0]
     * @param {int} [endIndex]
     * @returns {PIXI.DisplayObject[]}
     */

    removeChildren(beginIndex = 0, endIndex = this._innerContainer.children.length) {
        return this._innerContainer.removeChildren(beginIndex, endIndex);
    }

    /**
     * @method
     * @public
     * @override
     * @param  {PIXI.DisplayObject} child
     * @param {int} index
     */

    setChildIndex(child, index) {
        this._innerContainer.setChildIndex(child, index);
    }

    /**
     * @method
     * @public
     * @override
     * @param {int} index
     * @returns {?PIXI.DisplayObject}
     */

    getChildAt(index) {
        this._innerContainer.getChildAt(index);
    }

    /**
     * @method
     * @public
     * @override
     * @param {string} name - Instance name.
     * @returns {?PIXI.DisplayObject}
     */

    getChildByName(name) {
        this._innerContainer.getChildByName(name);
    }

    /**
     * @method
     * @public
     * @override
     * @param  {PIXI.DisplayObject} child
     * @returns {int}
     */

    getChildIndex(child) {
        return this._innerContainer.getChildIndex(child);
    }

    /**
     * @method
     * @public
     * @override
     * @param {PIXI.DisplayObject} child1
     * @param {PIXI.DisplayObject} child2
     */

    swapChildren(child1, child2) {
        this._innerContainer.swapChildren(child1, child2);
    }

    /**
     * @desc Move inner container to bottom boundary of ScrollView.
     * @method
     * @public
     */

    jumpToBottom() {
        this._jumpVertical(1);
    }

    /**
     * @desc Move inner container to bottom and left boundary of ScrollView.
     * @method
     * @public
     */

    jumpToBottomLeft() {
        this.jumpToBottom();
        this.jumpToLeft();
    }

    /**
     * @desc Move inner container to bottom and right boundary of ScrollView.
     * @method
     * @public
     */

    jumpToBottomRight() {
        this.jumpToBottom();
        this.jumpToRight();
    }

    /**
     * @desc Move inner container to left boundary of ScrollView.
     * @method
     * @public
     */

    jumpToLeft() {
        this._jumpHorizontal(0);
    }

    /**
     * @desc Move inner container to right boundary of ScrollView.
     * @method
     * @public
     */

    jumpToRight() {
        this._jumpHorizontal(1);
    }

    /**
     * @desc Move inner container to top boundary of ScrollView.
     * @method
     * @public
     */

    jumpToTop() {
        this._jumpVertical(0);
    }

    /**
     * @desc Move inner container to top and left boundary of ScrollView.
     * @method
     * @public
     */

    jumpToTopLeft() {
        this.jumpToTop();
        this.jumpToLeft();
    }

    /**
     * @desc Move inner container to top and right boundary of ScrollView.
     * @method
     * @public
     */

    jumpToTopRight() {
        this.jumpToTop();
        this.jumpToRight();
    }

    /**
     * @desc Move inner container to both direction percent position of ScrollView.
     * @method
     * @public
     * @param {number} percent
     */

    jumpToPercentBothDirection(percent) {
        this.jumpToPercentHorizontal(percent);
        this.jumpToPercentVertical(percent);
    }

    /**
     * @desc Move inner container to horizontal percent position of ScrollView.
     * @method
     * @public
     * @param {number} percent
     */

    jumpToPercentHorizontal(percent) {
        this._jumpHorizontal(percent);
    }

    /**
     * @desc Move inner container to vertical percent position of ScrollView.
     * @method
     * @public
     * @param {number} percent
     */

    jumpToPercentVertical(percent) {
        this._jumpVertical(percent);
    }

    /**
     * @public
     * @returns {?string}
     */

    get eventUp() {
        return this._innerContainer.eventUp;
    }

    /**
     * @public
     * @param {?string} value
     */

    set eventUp(value) {
        this._innerContainer.eventUp = value;
    }

    /**
     * @public
     * @returns {?string}
     */

    get eventDown() {
        return this._eventDown;
    }

    /**
     * @public
     * @param {?string} value
     */

    set eventDown(value) {
        if (this._eventDown === value) {
            return;
        }
        this._eventDown = value;
    }

    /**
     * @public
     * @returns {?string}
     */

    get eventOver() {
        return this._innerContainer.eventOver;
    }

    /**
     * @public
     * @param {?string} value
     */

    set eventOver(value) {
        this._innerContainer.eventOver = value;
    }

    /**
     * @public
     * @returns {?string}
     */

    get eventOut() {
        return this._innerContainer.eventOut;
    }

    /**
     * @public
     * @param {?string} value
     */

    set eventOut(value) {
        this._innerContainer.eventOut = value;
    }

    /**
     * @public
     * @returns {?string}
     */

    get eventMove() {
        return this._innerContainer.eventMove;
    }

    /**
     * @public
     * @param {?string} value
     */

    set eventMove(value) {
        this._innerContainer.eventMove = value;
    }

    /**
     * @public
     * @returns {?string}
     */

    get eventDrag() {
        return this._eventDrag;
    }

    /**
     * @public
     * @param {?string} value
     */

    set eventDrag(value) {
        if (this._eventDrag === value) {
            return;
        }
        this._eventDrag = value;
    }

    /**
     * @public
     * @returns {?string}
     */

    get eventClick() {
        return this._innerContainer.eventClick;
    }

    /**
     * @public
     * @param {?string} value
     */

    set eventClick(value) {
        this._innerContainer.eventClick = value;
    }

    /**
     * @public
     * @returns {?string}
     */

    get eventDragFinish() {
        return this._innerContainer.eventDragFinish;
    }

    /**
     * @public
     * @param {?string} value
     */

    set eventDragFinish(value) {
        this._innerContainer.eventDragFinish = value;
    }

    /**
     * @public
     * @returns {?string}
     */

    get eventDragStart() {
        return this._innerContainer.eventDragStart;
    }

    /**
     * @public
     * @param {?string} value
     */

    set eventDragStart(value) {
        this._innerContainer.eventDragStart = value;
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @protected
     * @returns {boolean}
     */

    isVertical() {
        return this._scrollDirection === SCROLL_DIRECTION.VERTICAL;
    }

    /**
     * @method
     * @protected
     * @returns {boolean}
     */

    isHorizontal() {
        return this._scrollDirection === SCROLL_DIRECTION.HORIZONTAL;
    }

    /**
     * @method
     * @protected
     * @param {MANTICORE.eventDispatcher.EventModel} event
     */

    onDownInnerContainerHandler(event) {
        this.dispatchEvent(this._eventDown, event.data);
        Geometry.sSub(this, this._innerContainer, this._innerBoundary);
        this._prvDragPos.copy(this._innerContainer.toLocal(event.data.data.global));
    }

    /**
     * @method
     * @protected
     * @param {MANTICORE.eventDispatcher.EventModel} event
     */

    onDragInnerContainerHandler(event) {
        this.dispatchEvent(this._eventDrag, event.data);
        const crtDragPos = this._innerContainer.toLocal(event.data.data.global);
        const nextPosition = Geometry.pRange(
            Geometry.pRound(
                Geometry.pAdd(
                    this._innerContainer.position,
                    Geometry.pSub(crtDragPos, this._prvDragPos)
                ),
                true
            ),
            this._innerBoundary,
            this._zeroPoint,
            true
        );


        if (this.isVertical()) {
            nextPosition.x = 0;
        }
        else if (this.isHorizontal()) {
            nextPosition.y = 0;
        }

        this._innerContainer.position.copy(nextPosition);

        if (!Type.isNull(this._horizontalSlider)) {
            this._horizontalSlider.progress = Math.toFixed(nextPosition.x / this._innerBoundary.x);
        }

        if (!Type.isNull(this._verticalSlider)) {
            this._verticalSlider.progress = Math.toFixed(nextPosition.y / this._innerBoundary.y);
        }

    }

    /**
     * @method
     * @protected
     * @param {MANTICORE.eventDispatcher.EventModel} event
     */

    onScrollHorizontalHandler(event) {
        this._updateScrollDimension(event.data, SCROLL_DIRECTION.HORIZONTAL);
    }

    /**
     * @method
     * @protected
     * @param {MANTICORE.eventDispatcher.EventModel} event
     */

    onScrollVerticalHandler(event) {
        this._updateScrollDimension(event.data, SCROLL_DIRECTION.VERTICAL);
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Update slider.
     * @method
     * @private
     * @param {?MANTICORE.ui.Slider} prvSlider
     * @param {?MANTICORE.ui.Slider} nxtSlider
     * @param {MANTICORE.enumerator.ui.SCROLL_DIRECTION} direction
     * @param {Function} handler
     * @returns {?MANTICORE.ui.Slider}
     */

    _initSlider(prvSlider, nxtSlider, direction, handler) {
        let event;
        const eventName = direction === SCROLL_DIRECTION.HORIZONTAL ? LOCAL_EVENT.HORIZONTAL_SCROLL : LOCAL_EVENT.VERTICAL_SCROLL;

        if (Type.isNull(nxtSlider)) {
            event = prvSlider.eventScroll;
            this.removeEventListener(event);
            prvSlider.eventScroll = null;
            return nxtSlider;
        }

        event = Format.generateEventName(this, eventName);
        nxtSlider.eventScroll = event;
        this.addEventListener(event, handler);
        this._updateScrollDimension(nxtSlider.progress, direction);

        return nxtSlider;
    }

    /**
     * @method
     * @private
     * @param {number} progress
     * @param {MANTICORE.enumerator.ui.SCROLL_DIRECTION} direction
     *
     */

    _updateScrollDimension(progress, direction) {
        if (direction === SCROLL_DIRECTION.HORIZONTAL) {
            this._innerContainer.x = Math.round(this._innerBoundary.x * progress);
        }
        else {
            this._innerContainer.y = Math.round(this._innerBoundary.y * progress);
        }
    }

    /**
     * @method
     * @private
     * @param {number} percent
     */

    _jumpVertical(percent) {
        this._jump(percent, SCROLL_DIRECTION.VERTICAL, SCROLL_DIRECTION.HORIZONTAL);
    }

    /**
     * @method
     * @private
     * @param {number} percent
     */

    _jumpHorizontal(percent) {
        this._jump(percent, SCROLL_DIRECTION.HORIZONTAL, SCROLL_DIRECTION.VERTICAL);
    }

    /**
     * @desc Update directions.
     * @method
     * @private
     * @param {number} percent
     * @param {MANTICORE.enumerator.ui.SCROLL_DIRECTION} mainDirection
     * @param {MANTICORE.enumerator.ui.SCROLL_DIRECTION} checkDirection
     */

    _jump(percent, mainDirection, checkDirection) {
        if (this._scrollDirection === checkDirection) {
            return;
        }
        if (percent > 1) {
            percent = Math.percentToFloat(percent);
        }
        this._updateScrollDimension(percent, mainDirection);
    }
}

export default ScrollView;