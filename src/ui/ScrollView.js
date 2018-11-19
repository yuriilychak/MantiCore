import Panel from "./Panel";
import Widget from "./Widget";
import PANEL_GRAPHIC_TYPE from "enumerator/ui/PanelGrphicType";
import Format from "util/Format";
import UI_ELEMENT from "enumerator/ui/UIElement";
import Type from "util/Type";
import SCROLL_DIRECTION from "enumerator/ui/ScrollDirection";
import ComScroller from "component/ui/ComScroller";

/**
 * @enum {string}
 * @private
 * @readonly
 * @memberOf MANTICORE.ui.ScrollView.
 */

const LOCAL_EVENT = {
    DRAG: "DRAG_INNER_CONTAINER",
    DRAG_START: "DRAG_START_INNER_CONTAINER",
    DRAG_FINISH: "DRAG_FINISH_INNER_CONTAINER",
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

        this._innerContainer = Widget.create();

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
         * @desc Custom event for drag start.
         * @type {?string}
         * @private
         */

        this._eventDragStart = null;

        /**
         * @desc Custom event for drag.
         * @type {?string}
         * @private
         */

        this._eventDrag = null;

        /**
         * @desc Custom event for drag finish.
         * @type {?string}
         * @private
         */

        this._eventDragFinish = null;

        /**
         * @desc Inner event for drag start.
         * @type {string}
         * @private
         */

        this._innerEventDragStart = Format.generateEventName(this, LOCAL_EVENT.DRAG_START);

        /**
         * @desc Inner event for drag.
         * @type {string}
         * @private
         */

        this._innerEventDrag = Format.generateEventName(this, LOCAL_EVENT.DRAG);

        /**
         * @desc Inner event for drag finish.
         * @type {string}
         * @private
         */

        this._innerEventDragFinish = Format.generateEventName(this, LOCAL_EVENT.DRAG_FINISH);

        /**
         * @desc Component for update scroll in scroll view.
         * @type {MANTICORE.component.ui.ComScroller}
         * @private
         */

        this._scroller = ComScroller.create();

        this.componentManager.addComponent(this._scroller);

        this._initInnerListeners();

        this.uiType = UI_ELEMENT.SCROLL_VIEW;

        super.addChild(this._innerContainer);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE} [graphicType = MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE.NONE] - Type of graphic that use panel.
     * @param {?string | ?int} [data = null] - Data that need to init panel. If type Color this is color, if Sprite it link to texture.
     */
    reuse(graphicType, data) {
        super.reuse(graphicType, data);

        this._innerContainer = Widget.create();
        this._verticalSlider = null;
        this._horizontalSlider = null;
        this._eventDragStart = null;
        this._eventDrag = null;
        this._scrollDirection = SCROLL_DIRECTION.BOTH;
        this._scroller = ComScroller.create();

        this.componentManager.addComponent(this._scroller);

        this._initInnerListeners();
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
        this._scroller.jumpToBottom();
    }

    /**
     * @desc Move inner container to bottom and left boundary of ScrollView.
     * @method
     * @public
     */

    jumpToBottomLeft() {
        this._scroller.jumpToBottomLeft();
    }

    /**
     * @desc Move inner container to bottom and right boundary of ScrollView.
     * @method
     * @public
     */

    jumpToBottomRight() {
        this._scroller.jumpToBottomRight();
    }

    /**
     * @desc Move inner container to left boundary of ScrollView.
     * @method
     * @public
     */

    jumpToLeft() {
        this._scroller.jumpToLeft();
    }

    /**
     * @desc Move inner container to right boundary of ScrollView.
     * @method
     * @public
     */

    jumpToRight() {
        this._scroller.jumpToRight();
    }

    /**
     * @desc Move inner container to top boundary of ScrollView.
     * @method
     * @public
     */

    jumpToTop() {
        this._scroller.jumpToTop();
    }

    /**
     * @desc Move inner container to top and left boundary of ScrollView.
     * @method
     * @public
     */

    jumpToTopLeft() {
        this._scroller.jumpToTopLeft();
    }

    /**
     * @desc Move inner container to top and right boundary of ScrollView.
     * @method
     * @public
     */

    jumpToTopRight() {
        this._scroller.jumpToTopRight();
    }

    /**
     * @desc Move inner container to both direction percent position of ScrollView.
     * @method
     * @public
     * @param {number} percent
     */

    jumpToPercentBothDirection(percent) {
        this._scroller.jumpToPercentBothDirection(percent);
    }

    /**
     * @desc Move inner container to horizontal percent position of ScrollView.
     * @method
     * @public
     * @param {number} percent
     */

    jumpToPercentHorizontal(percent) {
        this._scroller.jumpToPercentHorizontal(percent);
    }

    /**
     * @desc Move inner container to vertical percent position of ScrollView.
     * @method
     * @public
     * @param {number} percent
     */

    jumpToPercentVertical(percent) {
        this._scroller.jumpToPercentVertical(percent);
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
        this._innerContainer = null;
        this._verticalSlider = null;
        this._horizontalSlider = null;
        this._eventDragStart = null;
        this._eventDrag = null;
        this._eventDragFinish = null;
        this._scrollDirection = SCROLL_DIRECTION.BOTH;
        this._scroller = null;

        super.clearData();
    }

    /**
     * @method
     * @protected
     * @returns {boolean}
     */

    isVertical() {
        return this._scroller.isVertical();
    }

    /**
     * @method
     * @protected
     * @returns {boolean}
     */

    isHorizontal() {
        return this._scroller.isHorizontal();
    }

    /**
     * @method
     * @protected
     * @param {MANTICORE.eventDispatcher.EventModel} event
     */

    onDragStartInnerContainerHandler(event) {
        this.listenerManager.dispatchEvent(this._eventDragStart, event.data);
        this._scroller.updateDragStart(event.data.data.global);
    }

    /**
     * @method
     * @protected
     * @param {MANTICORE.eventDispatcher.EventModel} event
     */

    onDragInnerContainerHandler(event) {
        this.listenerManager.dispatchEvent(this._eventDrag, event.data);
        this._scroller.updateDragMove(event.data.data.global);
    }

    /**
     * @method
     * @protected
     * @param {MANTICORE.eventDispatcher.EventModel} event
     */

    onDragFinishInnerContainerHandler(event) {
        this.listenerManager.dispatchEvent(this._eventDragFinish, event.data);
    }

    /**
     * @method
     * @protected
     * @param {MANTICORE.eventDispatcher.EventModel} event
     */

    onScrollHorizontalHandler(event) {
        this._scroller.updateScrollDimension(event.data, SCROLL_DIRECTION.HORIZONTAL);
    }

    /**
     * @method
     * @protected
     * @param {MANTICORE.eventDispatcher.EventModel} event
     */

    onScrollVerticalHandler(event) {
        this._scroller.updateScrollDimension(event.data, SCROLL_DIRECTION.VERTICAL);
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
            this.listenerManager.removeEventListener(event);
            prvSlider.eventScroll = null;
            return nxtSlider;
        }

        event = Format.generateEventName(this, eventName);
        nxtSlider.eventScroll = event;
        this.listenerManager.addEventListener(event, handler);
        this._scroller.updateScrollDimension(nxtSlider.progress, direction);

        return nxtSlider;
    }

    /**
     * @desc Init inner listeners for drag.
     * @method
     * @private
     */

    _initInnerListeners() {
        this.listenerManager.addEventListener(this._innerEventDrag, this.onDragInnerContainerHandler);
        this.listenerManager.addEventListener(this._innerEventDragStart, this.onDragStartInnerContainerHandler);
        this.listenerManager.addEventListener(this._innerEventDragFinish, this.onDragFinishInnerContainerHandler);

        this._innerContainer.eventDrag = this._innerEventDrag;
        this._innerContainer.eventDragStart = this._innerEventDragStart;
        this._innerContainer.eventDragFinish = this._innerEventDragFinish;
        this._innerContainer.propagateChildrenEvents = true;
        this._innerContainer.interactive = true;
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {int}
     */

    get width() {
        return super.width;
    }

    set width(value) {
        super.width = value;
        this._scroller.innerBoundary.x = this.width - this._innerContainer.width;
    }

    /**
     * @public
     * @type {int}
     */

    get height() {
        return super.height;
    }

    set height(value) {
        super.height = value;
        this._scroller.innerBoundary.y = this.height - this._innerContainer.height;
    }

    /**
     * @public
     * @type {boolean}
     */

    get interactive() {
        return this._innerContainer.interactive;
    }

    set interactive(value) {
        if (this._innerContainer.interactive === value) {
            return;
        }
        this._innerContainer.interactive = value;
    }

    /**
     * @public
     * @type {MANTICORE.enumerator.ui.SCROLL_DIRECTION}
     */

    get scrollDirection() {
        return this._scroller.scrollDirection;
    }

    set scrollDirection(value) {
        this._scroller.scrollDirection = value;
    }

    /**
     * @public
     * @type {?MANTICORE.ui.Slider}
     */

    get horizontalSlider() {
        return this._horizontalSlider;
    }

    set horizontalSlider(value) {
        if (this._horizontalSlider === value || this.isVertical()) {
            return;
        }

        this._horizontalSlider = this._initSlider(this._horizontalSlider, value, SCROLL_DIRECTION.HORIZONTAL, this.onScrollHorizontalHandler);
    }

    /**
     * @public
     * @type {?MANTICORE.ui.Slider}
     */

    get verticalSlider() {
        return this._verticalSlider;
    }

    set verticalSlider(value) {
        if (this._verticalSlider === value || this.isHorizontal()) {
            return;
        }

        this._verticalSlider = this._initSlider(this._verticalSlider, value, SCROLL_DIRECTION.VERTICAL, this.onScrollVerticalHandler);
    }

    /**
     * @public
     * @type {MANTICORE.ui.Widget}
     */

    get innerContainer() {
        return this._innerContainer;
    }

    /**
     * @public
     * @type {int}
     */

    get innerWidth() {
        return this._innerContainer.width;
    }

    set innerWidth(value) {
        this._innerContainer.width = value;
        this._scroller.innerBoundary.x = this.width - this._innerContainer.width;
    }

    /**
     * @public
     * @type {int}
     */

    get innerHeight() {
        return this._innerContainer.height;
    }

    set innerHeight(value) {
        this._innerContainer.height = value;
        this._scroller.innerBoundary.y = this.height - this._innerContainer.height;
    }

    /**
     * @public
     * @type {?string}
     */

    get eventUp() {
        return this._innerContainer.eventUp;
    }

    set eventUp(value) {
        this._innerContainer.eventUp = value;
    }

    /**
     * @public
     * @type {?string}
     */

    get eventDown() {
        return this._innerContainer.eventOver;
    }

    set eventDown(value) {
        this._innerContainer.eventDown = value;
    }

    /**
     * @public
     * @type {?string}
     */

    get eventOver() {
        return this._innerContainer.eventOver;
    }

    set eventOver(value) {
        this._innerContainer.eventOver = value;
    }

    /**
     * @public
     * @type {?string}
     */

    get eventOut() {
        return this._innerContainer.eventOut;
    }

    set eventOut(value) {
        this._innerContainer.eventOut = value;
    }

    /**
     * @public
     * @type {?string}
     */

    get eventMove() {
        return this._innerContainer.eventMove;
    }

    set eventMove(value) {
        this._innerContainer.eventMove = value;
    }

    /**
     * @public
     * @type {?string}
     */

    get eventDrag() {
        return this._eventDrag;
    }

    set eventDrag(value) {
        if (this._eventDrag === value) {
            return;
        }
        this._eventDrag = value;
    }

    /**
     * @public
     * @type {?string}
     */

    get eventClick() {
        return this._innerContainer.eventClick;
    }

    set eventClick(value) {
        this._innerContainer.eventClick = value;
    }

    /**
     * @public
     * @type {?string}
     */

    get eventDragFinish() {
        return this._eventDragFinish;
    }

    set eventDragFinish(value) {
        if (this._eventDragFinish === value) {
            return;
        }
        this._eventDragFinish = value;
    }

    /**
     * @public
     * @type {?string}
     */

    get eventDragStart() {
        return this._eventDragStart;
    }

    set eventDragStart(value) {
        if (this._eventDragStart === value) {
            return;
        }
        this._eventDragStart = value;
    }
}

export default ScrollView;