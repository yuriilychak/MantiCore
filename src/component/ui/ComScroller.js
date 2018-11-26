import SCROLL_DIRECTION from "enumerator/ui/ScrollDirection";
import Component from "component/Component";
import Geometry from "util/Geometry";
import Type from "util/Type";
import Math from "util/Math";

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
        this._bounceEnabled = true;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

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
        if (!this._bounceEnabled) {
            const crtDragPos = innerContainer.toLocal(position);
            const nextPosition = Geometry.pRange(
                Geometry.pRound(
                    Geometry.pAdd(
                        innerContainer.position,
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

            innerContainer.position.copy(nextPosition);

            this._upateSliderProgress(this.owner.horizontalSlider, nextPosition.x, this._innerBoundary.x);
            this._upateSliderProgress(this.owner.verticalSlider, nextPosition.y, this._innerBoundary.y);
        }
        else {
            const crtDragPos = innerContainer.toLocal(position);
            const difference = Geometry.pSub(crtDragPos, this._prvDragPos);
            const tempPos = Geometry.pRound(
                Geometry.pAdd(
                    innerContainer.position,
                    difference
                ),
                true
            );
            const nextPosition = Geometry.pRange(tempPos, this._innerBoundary, this._zeroPoint);

            if (!tempPos.equals(nextPosition)) {
            }

            if (this.isVertical()) {
                tempPos.x = 0;
            }
            else if (this.isHorizontal()) {
                tempPos.y = 0;
            }

            innerContainer.position.copy(tempPos);

            this._upateSliderProgress(this.owner.horizontalSlider, tempPos.x, this._innerBoundary.x);
            this._upateSliderProgress(this.owner.verticalSlider, tempPos.y, this._innerBoundary.y);
        }

    }

    /**
     * @desc Update drag finish event of owner.
     * @method
     * @public
     * @param {PIXI.Point | Point} position
     */

    updateDragFinish(position) {

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
        if (direction === SCROLL_DIRECTION.HORIZONTAL) {
            this.owner.innerContainer.x = Math.round(this._innerBoundary.x * progress);
        }
        else {
            this.owner.innerContainer.y = Math.round(this._innerBoundary.y * progress);
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
        this._scrollDirection = SCROLL_DIRECTION.BOTH;
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
     * @param {number} position
     * @param {number} bound
     */

    _upateSliderProgress(slider, position, bound) {
        if (Type.isNull(slider)) {
            return;
        }
        slider.progress = Math.toFixed(position / bound);
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
}

export default ComScroller;