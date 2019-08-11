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
 * @memberOf mCore.ui.ScrollView.
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
 * @extends mCore.ui.Panel
 * @memberOf mCore.ui
 */

class ScrollView extends Panel {
    /**
     * @constructor
     * @param {mCore.enumerator.ui.PANEL_GRAPHIC_TYPE} [graphicType = mCore.enumerator.ui.PANEL_GRAPHIC_TYPE.NONE] - Type of graphic that use panel.
     * @param {?string | ?int} [data = null] - Data that need to init panel. If type Color this is color, if Sprite it link to texture.
     */
    constructor(graphicType = PANEL_GRAPHIC_TYPE.NONE, data = null) {
        super(graphicType, data);

        /**
         * @desc Container with elements.
         * @type {mCore.ui.Widget}
         * @private
         */

        this._innerContainer = Widget.create();

        /**
         * @type {?mCore.ui.Slider}
         * @private
         */

        this._verticalSlider = null;

        /**
         * @type {?mCore.ui.Slider}
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
         * @type {mCore.component.ui.ComScroller}
         * @private
         */

        this._scroller = ComScroller.create();

        this.componentManager.addComponent(this._scroller);

        this._initInnerListeners();

        this.uiType = UI_ELEMENT.SCROLL_VIEW;

        super.addChild(this._innerContainer);

        this._innerContainer.interactive = true;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {mCore.enumerator.ui.PANEL_GRAPHIC_TYPE} [graphicType = mCore.enumerator.ui.PANEL_GRAPHIC_TYPE.NONE] - Type of graphic that use panel.
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
     * @desc Scroll inner container to top.
     * @method
     * @public
     * @param {number} time
     */

    scrollToLeft(time) {
        this._scroller.scrollToLeft(time);
    }

    /**
     * @desc Scroll inner container to top.
     * @method
     * @public
     * @param {number} time
     */

    scrollToRight(time) {
        this._scroller.scrollToRight(time);
    }

    /**
     * @desc Scroll inner container to top.
     * @method
     * @public
     * @param {number} time
     */

    scrollToTop(time) {
        this._scroller.scrollToTop(time);
    }

    /**
     * @desc Scroll inner container to bottom.
     * @method
     * @public
     * @param {number} time
     */

    scrollToBottom(time) {
        this._scroller.scrollToBottom(time);
    }

    /**
     * @desc Scroll inner container to top left.
     * @method
     * @public
     * @param {number} time
     */

    scrollToTopLeft(time) {
        this._scroller.scrollToTopLeft(time);
    }

    /**
     * @desc Scroll inner container to top left.
     * @method
     * @public
     * @param {number} time
     */

    scrollToTopRight(time) {
        this._scroller.scrollToTopRight(time);
    }

    /**
     * @desc Scroll inner container to bottom left.
     * @method
     * @public
     * @param {number} time
     */

    scrollToBottomLeft(time) {
        this._scroller.scrollToBottomLeft(time);
    }

    /**
     * @desc Scroll inner container to bottom right.
     * @method
     * @public
     * @param {number} time
     */

    scrollToBottomRight(time) {
        this._scroller.scrollToBottomRight(time);
    }

    /**
     * @desc Scroll to percent inner container in horizontal direction.
     * @method
     * @public
     * @param {number} time
     * @param {number} percent
     */

    scrollToPercentHorizontal(time, percent) {
        this._scroller.scrollToPercentHorizontal(time, percent);
    }

    /**
     * @desc Scroll to percent inner container in vertical direction.
     * @method
     * @public
     * @param {number} time
     * @param {number} percent
     */

    scrollToPercentVertical(time, percent) {
        this._scroller.scrollToPercentVertical(time, percent);
    }

    /**
     * @desc Scroll to percent inner container in vertical direction.
     * @method
     * @public
     * @param {number} time
     * @param {number} percentH
     * @param {number} [percentV]
     */

    scrollToPercentBoth(time, percentH, percentV) {
        this._scroller.scrollToPercentBoth(...arguments);
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
     * @param {mCore.eventDispatcher.EventModel} event
     */

    onDragStartInnerContainerHandler(event) {
        this.listenerManager.dispatchEvent(this._eventDragStart, event.data);
        this._scroller.updateDragStart(event.data.data.global);
    }

    /**
     * @method
     * @protected
     * @param {mCore.eventDispatcher.EventModel} event
     */

    onDragInnerContainerHandler(event) {
        this.listenerManager.dispatchEvent(this._eventDrag, event.data);
        this._scroller.updateDragMove(event.data.data.global);
    }

    /**
     * @method
     * @protected
     * @param {mCore.eventDispatcher.EventModel} event
     */

    onDragFinishInnerContainerHandler(event) {
        this.listenerManager.dispatchEvent(this._eventDragFinish, event.data);
        this._scroller.updateDragFinish(event.data.data.global);
    }

    /**
     * @method
     * @protected
     * @param {mCore.eventDispatcher.EventModel} event
     */

    onScrollHorizontalHandler(event) {
        this._scroller.updateScrollDimension(event.data, SCROLL_DIRECTION.HORIZONTAL);
    }

    /**
     * @method
     * @protected
     * @param {mCore.eventDispatcher.EventModel} event
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
     * @param {?mCore.ui.Slider} prvSlider
     * @param {?mCore.ui.Slider} nxtSlider
     * @param {mCore.enumerator.ui.SCROLL_DIRECTION} direction
     * @param {Function} handler
     * @returns {?mCore.ui.Slider}
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

        this._innerContainer.interactionManager.eventDrag = this._innerEventDrag;
        this._innerContainer.interactionManager.eventDragStart = this._innerEventDragStart;
        this._innerContainer.interactionManager.eventDragFinish = this._innerEventDragFinish;
        this._innerContainer.interactionManager.propagateChildrenEvents = true;
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
     * @type {mCore.enumerator.ui.SCROLL_DIRECTION}
     */

    get scrollDirection() {
        return this._scroller.scrollDirection;
    }

    set scrollDirection(value) {
        this._scroller.scrollDirection = value;
    }

    /**
     * @public
     * @type {?mCore.ui.Slider}
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
     * @type {?mCore.ui.Slider}
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
     * @type {mCore.ui.Widget}
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
     * @return {mCore.manager.InteractionManager}
     */

    get interactionManager() {
        return this._innerContainer.interactionManager;
    }

    /**
     * @desc Flag is bounce enabled for scroll view.
     * @public
     * @return {boolean}
     */

    get bounceEnabled() {
        return this._scroller.bounceEnabled;
    }

    set bounceEnabled(value) {
        this._scroller.bounceEnabled = value;
    }
}

export default ScrollView;
