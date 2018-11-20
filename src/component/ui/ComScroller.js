import SCROLL_DIRECTION from "enumerator/ui/ScrollDirection";
import DIRECTION from "enumerator/Direction";
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

        this._touchMoveDisplacements = null;
        this._touchMoveTimeDeltas =  null;
        this._touchMovePreviousTimestamp = 0;
        this._touchTotalTimeThreshold = 0.5;

        this._autoScrolling = false;
        this._autoScrollTargetDelta = null;
        this._autoScrollAttenuate = true;
        this._autoScrollStartPosition = null;
        this._autoScrollTotalTime = 0;
        this._autoScrollAccumulatedTime = 0;
        this._autoScrollCurrentlyOutOfBoundary = false;
        this._autoScrollBraking = false;
        this._autoScrollBrakingStartPosition = null;

        this._bePressed = false;

        this._childFocusCancelOffset = 0;

        this.bounceEnabled = false;

        this._outOfBoundaryAmount = null;
        this._outOfBoundaryAmountDirty = true;
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

        if (!Type.isNull(this.owner.horizontalSlider)) {
            this.owner.horizontalSlider.progress = Math.toFixed(nextPosition.x / this._innerBoundary.x);
        }

        if (!Type.isNull(this.owner.verticalSlider)) {
            this.owner.verticalSlider.progress = Math.toFixed(nextPosition.y / this._innerBoundary.y);
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

    _processAutoScrolling(deltaTime) {
        const OUT_OF_BOUNDARY_BREAKING_FACTOR = 0.05;
        // Make auto scroll shorter if it needs to deaccelerate.
        const brakingFactor = (this._isNecessaryAutoScrollBrake() ? OUT_OF_BOUNDARY_BREAKING_FACTOR : 1);

        // Elapsed time
        this._autoScrollAccumulatedTime += deltaTime * (1 / brakingFactor);

        // Calculate the progress percentage
        let percentage = Math.min(1, this._autoScrollAccumulatedTime / this._autoScrollTotalTime);
        if (this._autoScrollAttenuate) {
            percentage -= 1;
            percentage = Math.intPow(percentage, 5) + 1;
        }

        // Calculate the new position
        let newPosition = Geometry.pAdd(this._autoScrollStartPosition, Geometry.pMult(this._autoScrollTargetDelta, percentage));
        let reachedEnd = Math.abs(percentage - 1) <= this._getAutoScrollStopEpsilon();

        if (this.bounceEnabled) {
            // The new position is adjusted if out of boundary
            newPosition = Geometry.pAdd(this._autoScrollBrakingStartPosition, Geometry.pMult(Geometry.pSub(newPosition, this._autoScrollBrakingStartPosition), brakingFactor));
        }
        else {
            // Don't let go out of boundary
            const moveDelta = Geometry.pSub(newPosition, this.owner.innerContainer.position.clone());
            const outOfBoundary = this._getHowMuchOutOfBoundary(moveDelta);
            if (!this._fltEqualZero(outOfBoundary)) {
                newPosition.x += outOfBoundary.x;
                newPosition.y += outOfBoundary.y;

                reachedEnd = true;
            }
        }

        // Finish auto scroll if it ended
        if (reachedEnd) {
            this._autoScrolling = false;
            //this._dispatchEvent(ccui.ScrollView.EVENT_AUTOSCROLL_ENDED);
        }

        this._moveInnerContainer(Geometry.pSub(newPosition, this.owner.innerContainer.position.clone()), reachedEnd);
    }

    _isNecessaryAutoScrollBrake() {
        if (this._autoScrollBraking) {
            return true;
        }

        if (this._isOutOfBoundary()) {
            // It just went out of boundary.
            if (!this._autoScrollCurrentlyOutOfBoundary) {
                this._autoScrollCurrentlyOutOfBoundary = true;
                this._autoScrollBraking = true;
                this._autoScrollBrakingStartPosition = this.owner.innerContainer.position.clone();
                return true;
            }
        }
        else {
            this._autoScrollCurrentlyOutOfBoundary = false;
        }
        return false;
    }

    _isOutOfBoundary (dir) {
        const outOfBoundary = this._getHowMuchOutOfBoundary();
        if (dir !== undefined) {
            switch (dir) {
                case DIRECTION.UP:
                    return outOfBoundary.y > 0;
                case DIRECTION.BOTTOM:
                    return outOfBoundary.y < 0;
                case DIRECTION.LEFT:
                    return outOfBoundary.x < 0;
                case DIRECTION.RIGHT:
                    return outOfBoundary.x > 0;
            }
        }
        else {
            return !this._fltEqualZero(outOfBoundary);
        }

        return false;
    }

    _getHowMuchOutOfBoundary(addition = new PIXI.Point(0, 0)) {

        if (addition.x === 0 && addition.y === 0 && !this._outOfBoundaryAmountDirty) {
            return this._outOfBoundaryAmount;
        }

        const outOfBoundaryAmount = new PIXI.Point(0, 0);
        /**
         * @type {MANTICORE.ui.Widget}
         */
        const innerContainer = this.owner.innerContainer;
        const leftBoundary = innerContainer.x + addition.x;
        const rightBoundary = leftBoundary + innerContainer.width;
        const topBoundary = innerContainer.y + addition.y;
        const bottomBoundary = topBoundary + innerContainer.height;

        if (leftBoundary > 0) {
            outOfBoundaryAmount.x = -leftBoundary;
        }
        else if (rightBoundary < this.owner.width) {
            outOfBoundaryAmount.x = this.owner.width - rightBoundary;
        }

        if (topBoundary > 0) {
            outOfBoundaryAmount.y = -topBoundary;
        }
        else if (bottomBoundary < this.owner.height) {
            outOfBoundaryAmount.y = this.owner.height - bottomBoundary;
        }

        if (addition.x === 0 && addition.y === 0) {
            this._outOfBoundaryAmount = outOfBoundaryAmount;
            this._outOfBoundaryAmountDirty = false;
        }
        return outOfBoundaryAmount;
    }

    _fltEqualZero(point) {
        const eps = 0.0001;
        return (Math.abs(point.x) <= eps && Math.abs(point.y) <= eps);
    }

    _getAutoScrollStopEpsilon() {
        return 0.0001;
    }

    _moveInnerContainer(deltaMove, canStartBounceBack) {
        const adjustedMove = this._flattenVectorByDirection(deltaMove);

        this.owner.innerContainer.position.copy(Geometry.pAdd(this.owner.innerContainer.position.clone(), adjustedMove));

        const outOfBoundary = this._getHowMuchOutOfBoundary();

        if (this.bounceEnabled && canStartBounceBack) {
            this._startBounceBackIfNeeded();
        }
    }

    _flattenVectorByDirection(vector) {
        const result = new PIXI.Point(0, 0);
        result.x = (this._scrollDirection === SCROLL_DIRECTION.VERTICAL ? 0 : vector.x);
        result.y = (this._scrollDirection === SCROLL_DIRECTION.HORIZONTAL ? 0 : vector.y);
        return result;
    }

    _startBounceBackIfNeeded() {
        if (!this.bounceEnabled) {
            return false;
        }
        const bounceBackAmount = this._getHowMuchOutOfBoundary();
        if (this._fltEqualZero(bounceBackAmount)) {
            return false;
        }

        const BOUNCE_BACK_DURATION = 1.0;
        this._startAutoScroll(bounceBackAmount, BOUNCE_BACK_DURATION, true);
        return true;
    }

    _startAutoScroll(deltaMove, timeInSec, attenuated) {
        const adjustedDeltaMove = this._flattenVectorByDirection(deltaMove);

        this._autoScrolling = true;
        this._autoScrollTargetDelta = adjustedDeltaMove;
        this._autoScrollAttenuate = attenuated;
        this._autoScrollStartPosition = this._innerContainer.getPosition();
        this._autoScrollTotalTime = timeInSec;
        this._autoScrollAccumulatedTime = 0;
        this._autoScrollBraking = false;
        this._autoScrollBrakingStartPosition = cc.p(0, 0);

        // If the destination is also out of boundary of same side, start brake from beggining.
        const currentOutOfBoundary = this._getHowMuchOutOfBoundary();
        if (!this._fltEqualZero(currentOutOfBoundary)) {
            this._autoScrollCurrentlyOutOfBoundary = true;
            const afterOutOfBoundary = this._getHowMuchOutOfBoundary(adjustedDeltaMove);
            if (currentOutOfBoundary.x * afterOutOfBoundary.x > 0 || currentOutOfBoundary.y * afterOutOfBoundary.y > 0) {
                this._autoScrollBraking = true;
            }
        }
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