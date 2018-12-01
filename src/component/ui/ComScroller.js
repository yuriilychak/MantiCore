import SCROLL_DIRECTION from "enumerator/ui/ScrollDirection";
import Component from "component/Component";
import Geometry from "util/Geometry";
import Type from "util/Type";
import Math from "util/Math";
import TIME_LINE from "enumerator/animation/TimeLine";
import MoveTo from "animation/action/MoveTo";
import EaseQuadraticInOut from "animation/easing/EaseQuadraticInOut";
import EaseQuadraticOut from "animation/easing/EaseQuadraticOut";

/**
 * @desc Class for manipulate with scrolling in list and scroll views.
 * @class
 * @extends MANTICORE.component.Component
 * @memberOf MANTICORE.component.ui
 */

class ComScroller extends Component {
    constructor() {
        super("ComScroller");

        /**
         * @desc Direction of scroll.
         * @type {MANTICORE.enumerator.ui.SCROLL_DIRECTION}
         * @private
         */

        this._scrollDirection = SCROLL_DIRECTION.BOTH;

        /**
         * @desc Previous drag pos for update drag.
         * @type {PIXI.Point | Point}
         * @private
         */

        this._prvDragPos = new PIXI.Point(0, 0);

        /**
         * @desc Zero point. Need for calculate drag position, for don't create every frame.
         * @type {PIXI.Point | Point}
         * @private
         */

        this._zeroPoint = new PIXI.Point(0, 0);

        /**
         * @desc Inner boundary for scroll. Need to don't calculate every frame.
         * @type {PIXI.Point | Point}
         * @private
         */

        this._innerBoundary = new PIXI.Point(0, 0);

        /**
         * @desc Flag is bounce effects enabled.
         * @type {boolean}
         * @private
         */
        this._bounceEnabled = false;

        /**
         * @desc Offset for calculate dumping.
         * @type {PIXI.Point | Point}
         * @private
         */

        this._offset = new PIXI.Point();
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @public
     * @param {MANTICORE.ui.ScrollView} owner
     */

    onAdd(owner) {
        super.onAdd(owner);

        owner.innerContainer.animationManager.addTimeLine(TIME_LINE.SCROLL_VIEW);
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     */
    reuse() {
        super.reuse();
        this._prvDragPos.set(0, 0);
        this._zeroPoint.set(0, 0);
        this._innerBoundary.set(0, 0);
        this._scrollDirection = SCROLL_DIRECTION.BOTH;
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
     * @desc Scroll inner container to top.
     * @method
     * @public
     * @param {number} time
     */

    scrollToLeft(time) {
        this.scrollToPercentHorizontal(time, 0);
    }

    /**
     * @desc Scroll inner container to top.
     * @method
     * @public
     * @param {number} time
     */

    scrollToRight(time) {
        this.scrollToPercentHorizontal(time, 1);
    }

    /**
     * @desc Scroll inner container to top.
     * @method
     * @public
     * @param {number} time
     */

    scrollToTop(time) {
        this.scrollToPercentVertical(time, 0);
    }

    /**
     * @desc Scroll inner container to bottom.
     * @method
     * @public
     * @param {number} time
     */

    scrollToBottom(time) {
        this.scrollToPercentVertical(time, 1);
    }

    /**
     * @desc Scroll inner container to top left.
     * @method
     * @public
     * @param {number} time
     */

    scrollToTopLeft(time) {
        this.scrollToPercentBoth(time, 0, 0);
    }

    /**
     * @desc Scroll inner container to top left.
     * @method
     * @public
     * @param {number} time
     */

    scrollToTopRight(time) {
        this.scrollToPercentBoth(time, 1, 0);
    }

    /**
     * @desc Scroll inner container to bottom left.
     * @method
     * @public
     * @param {number} time
     */

    scrollToBottomLeft(time) {
        this.scrollToPercentBoth(time, 0, 1);
    }

    /**
     * @desc Scroll inner container to bottom right.
     * @method
     * @public
     * @param {number} time
     */

    scrollToBottomRight(time) {
        this.scrollToPercentBoth(time, 0, 1);
    }

    /**
     * @desc Scroll to percent inner container in horizontal direction.
     * @method
     * @public
     * @param {number} time
     * @param {number} percent
     */

    scrollToPercentHorizontal(time, percent){
        if (this.isVertical()) {
            return;
        }
        if (percent > 1) {
            percent = Math.percentToFloat(percent);
        }
        const endPos = Math.round(this._innerBoundary.x * percent);
        this._runScrollAction(time, endPos, this._innerBoundary.y);
        //TODO Add scroll animation to slider.
        this._updateSliderProgress(this.owner.horizontalSlider, percent);
    }

    /**
     * @desc Scroll to percent inner container in vertical direction.
     * @method
     * @public
     * @param {number} time
     * @param {number} percent
     */

    scrollToPercentVertical(time, percent){
        if (this.isHorizontal()) {
            return;
        }
        if (percent > 1) {
            percent = Math.percentToFloat(percent);
        }
        const endPos = Math.round(this._innerBoundary.y * percent);
        this._runScrollAction(time, this._innerBoundary.x, endPos);
        //TODO Add scroll animation to slider.
        this._updateSliderProgress(this.owner.verticalSlider, percent);
    }

    /**
     * @desc Scroll to percent inner container in vertical direction.
     * @method
     * @public
     * @param {number} time
     * @param {number} percentH
     * @param {number} [percentV]
     */

    scrollToPercentBoth(time, percentH, percentV){
        if (arguments.length === 2 ) {
            percentV = percentH;
        }
        if (this.isHorizontal()) {
            this.scrollToPercentHorizontal(time, percentH);
            return;
        }
        if (this.isVertical()) {
            this.scrollToPercentVertical(time, percentV);
        }

        if (percentH > 1) {
            percentH = Math.percentToFloat(percentH);
        }

        if (percentV > 1) {
            percentV = Math.percentToFloat(percentV);
        }
        const endPosX = Math.round(this._innerBoundary.x * percentH);
        const endPosY = Math.round(this._innerBoundary.y * percentV);

        this._runScrollAction(time, endPosX, endPosY);
        //TODO Add scroll animation to slider.
        this._updateSliderProgress(this.owner.horizontalSlider, percentH);
        this._updateSliderProgress(this.owner.verticalSlider, percentV);
    }

    /**
     * @desc Update drag start event of owner.
     * @method
     * @public
     * @param {PIXI.Point | Point} position
     */

    updateDragStart(position) {
        const innerContainer = this.owner.innerContainer;
        Geometry.sSub(this.owner, innerContainer, this._innerBoundary);
        this._prvDragPos.copy(innerContainer.toLocal(position));
    }

    /**
     * @desc Update drag move event of owner.
     * @method
     * @public
     * @param {PIXI.Point | Point} position
     */

    updateDragMove(position) {
        const innerContainer = this.owner.innerContainer;
        const innerPos = innerContainer.position;
        this._offset.copy(Geometry.pSub(innerContainer.toLocal(position), this._prvDragPos, true));
        const interpolatedPos = Geometry.pRound(Geometry.pAdd(innerPos, this._offset), true);
        const boundPos = Geometry.pRange(interpolatedPos, this._innerBoundary, this._zeroPoint);
        let resultPos;

        if (this.isVertical()) {
            boundPos.x = 0;
            interpolatedPos.x = 0;
            this._offset.x = 0;
        }
        else if (this.isHorizontal()) {
            boundPos.y = 0;
            interpolatedPos.y = 0;
            this._offset.y = 0;
        }

        if (this._bounceEnabled && !interpolatedPos.equals(boundPos)) {
            const dif = Geometry.pAbs(Geometry.pSub(innerPos, boundPos), true);
            const bound = Geometry.pMult(Geometry.pFromSize(this.owner), 0.3);
            const coef = new PIXI.Point(
                dif.x > bound.x || this.isVertical() ? 0 : Math.intPow(1 - dif.x / bound.x, 5),
                dif.y > bound.y || this.isHorizontal() ? 0 : Math.intPow(1 - dif.y / bound.y, 5)
            );
            resultPos = Geometry.pAdd(Geometry.pCompMult(coef, this._offset, true), innerPos, true);
        }
        else {
            resultPos = boundPos;
        }

        innerContainer.position.copy(Geometry.pRound(resultPos));
        this._updateSliderProgress(this.owner.horizontalSlider, boundPos.x / this._innerBoundary.x);
        this._updateSliderProgress(this.owner.verticalSlider, boundPos.y / this._innerBoundary.y);
    }

    /**
     * @desc Update drag finish event of owner.
     * @method
     * @public
     * @param {PIXI.Point | Point} position
     */

    updateDragFinish(position) {
        if (this._bounceEnabled) {
            const innerContainer = this.owner.innerContainer;
            const crtPos = innerContainer.position;
            const boundPos = Geometry.pRange(crtPos, this._innerBoundary, this._zeroPoint);
            const scrollTime = 0.5;

            if (!boundPos.equals(crtPos)) {
                this._runScrollAction(scrollTime, boundPos.x, boundPos.y);
            }
            else {
                Geometry.pMult(this._offset, 8, true);
                const endPos = Geometry.pRange(Geometry.pAdd(crtPos, this._offset), this._innerBoundary, this._zeroPoint);
                this._runScrollAction(scrollTime, endPos.x, endPos.y, EaseQuadraticOut.create());
            }
        }
    }

    /**
     * @method
     * @public
     * @returns {boolean}
     */

    isVertical() {
        return this._scrollDirection === SCROLL_DIRECTION.VERTICAL;
    }

    /**
     * @method
     * @public
     * @returns {boolean}
     */

    isHorizontal() {
        return this._scrollDirection === SCROLL_DIRECTION.HORIZONTAL;
    }

    /**
     * @method
     * @public
     * @param {number} progress
     * @param {MANTICORE.enumerator.ui.SCROLL_DIRECTION} direction
     *
     */

    updateScrollDimension(progress, direction) {
        const innerContainer = this.owner.innerContainer;
        if (direction === SCROLL_DIRECTION.HORIZONTAL) {
            innerContainer.x = Math.round(this._innerBoundary.x * progress);
            this._updateSliderProgress(this.owner.horizontalSlider, innerContainer.x / this._innerBoundary.x);
        }
        else {
            innerContainer.y = Math.round(this._innerBoundary.y * progress);
            this._updateSliderProgress(this.owner.verticalSlider, innerContainer.y / this._innerBoundary.y);
        }
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
        this._prvDragPos.set(0, 0);
        this._zeroPoint.set(0, 0);
        this._innerBoundary.set(0, 0);
        this._offset.set(0, 0);
        this._scrollDirection = SCROLL_DIRECTION.BOTH;
        this.bounceEnabled = false;
        super.clearData();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

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
        this.updateScrollDimension(percent, mainDirection);
    }

    /**
     * @desc Update progress of slider if it exist.
     * @method
     * @private
     * @param {MANTICORE.ui.Slider} slider
     * @param {number} percent
     */

    _updateSliderProgress(slider, percent) {
        if (Type.isNull(slider)) {
            return;
        }
        slider.progress = Math.toFixed(percent);
    }

    /**
     * @desc Apply animated scroll to inner container
     * @method
     * @private
     * @param {number} time
     * @param {int} x
     * @param {int} y
     * @param {MANTICORE.animation.easing.EaseBase} [ease]
     */

    _runScrollAction(time, x, y, ease = EaseQuadraticOut.create()) {
        const innerContainer = this.owner.innerContainer;
        const action = MoveTo.create(time, new PIXI.Point(x, y));
        action.ease = ease;
        innerContainer.animationManager.runAction(action, false, 0, TIME_LINE.SCROLL_VIEW);
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {MANTICORE.enumerator.ui.SCROLL_DIRECTION}
     */

    get scrollDirection() {
        return this._scrollDirection;
    }

    set scrollDirection(value) {
        if (this._scrollDirection === value) {
            return;
        }

        switch (value) {
            case SCROLL_DIRECTION.VERTICAL: {
                this.horizontalSlider = null;
                this.owner.innerContainer.x = 0;
                break;
            }
            case SCROLL_DIRECTION.HORIZONTAL: {
                this.verticalSlider = null;
                this.owner.innerContainer.y = 0;
                break;
            }
            default: {
                break;
            }
        }

        this._scrollDirection = value;
    }

    /**
     * @desc Inner boundary of scroller.
     * @public
     * @type {PIXI.Point | Point}
     */

    get innerBoundary() {
        return this._innerBoundary;
    }

    set innerBoundary(value) {
        if (this.innerBoundary.equals(value)) {
            return;
        }

        this._innerBoundary.copy(value);
    }

    /**
     * @desc Flag is bounce enabled.
     * @public
     * @return {boolean}
     */

    get bounceEnabled() {
        return this._bounceEnabled;
    }

    set bounceEnabled(value) {
        if (this._bounceEnabled === value) {
            return;
        }
        this._bounceEnabled = value;

        if (!this._bounceEnabled && this.hasOwner()) {
            const innerContainerPos = this.owner.innerContainer.position;
            this.owner.innerContainer.animationManager.stopTimeLine(TIME_LINE.SCROLL_VIEW);
            Geometry.pRange(innerContainerPos, this._innerBoundary, this._zeroPoint, true);
            this._updateSliderProgress(this.owner.horizontalSlider, innerContainerPos.x/this._innerBoundary.x);
            this._updateSliderProgress(this.owner.verticalSlider, innerContainerPos.y/this._innerBoundary.y);
        }
    }
}

export default ComScroller;