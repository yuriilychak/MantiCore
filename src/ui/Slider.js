import ProgressBar from "./ProgressBar";
import DIRECTION from "enumerator/Direction";
import Widget from "./Widget";
import Type from "util/Type";
import Math from "util/Math";
import Format from "util/Format";
import BaseButton from "./ancillary/BaseButton";
import UI_ELEMENT from "enumerator/ui/UIElement";

/**
 * @desc Realization of slider class.
 * @class
 * @extends mCore.ui.Widget
 * @memberOf mCore.ui
 */

class Slider extends Widget {
    /**
     * @constructor
     * @param {mCore.ui.Widget} ball - Slider ball texture
     * @param {mCore.enumerator.DIRECTION} [direction = mCore.enumerator.DIRECTION.LEFT] - Type of progress direction.
     * @param {?string} [progressFrame = null] - Progress texture
     */
    constructor(ball, direction = DIRECTION.LEFT, progressFrame = null) {
        super();

        /**
         * @type {mCore.ui.Widget}
         * @private
         */

        this._ball = ball;

        /**
         * @type {mCore.enumerator.DIRECTION}
         * @private
         */

        this._direction = direction;

        /**
         * @desc Is button enabled.
         * @type {boolean}
         * @private
         */

        this._isEnabled = true;

        /**
         * @type {string}
         * @private
         */

        this._eventDrag = Format.generateEventName(this, "BALL_DRAG");

        /**
         * @type {?mCore.ui.ProgressBar}
         * @private
         */

        this._progressBar = !Type.isNull(progressFrame) ? ProgressBar.create(progressFrame) : null;

        /**
         *
         * @type {number}
         * @private
         */

        this._progress = 1;

        /**
         * @desc Event when change scroll.
         * @type {?string}
         * @private
         */

        this._eventScroll = null;

        this._ball.name = "btnBall";
        this._ball.anchor.set(0.5);
        this._ball.interactive = true;
        this._ball.interactionManager.eventDrag = this._eventDrag;

        if (this.hasProgressBar()) {
            this.addChild(this._progressBar);
        }

        this.addChild(this._ball);

        this.uiType = UI_ELEMENT.SLIDER;

        this.listenerManager.addEventListener(this._eventDrag, this._onBallDragHandler);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {mCore.ui.Widget} ball - Slider ball texture
     * @param {mCore.enumerator.DIRECTION} [direction = mCore.enumerator.DIRECTION.LEFT] - Type of progress direction.
     * @param {?string} [progressFrame = null] - Progress texture
     */
    reuse(ball, direction = DIRECTION.LEFT, progressFrame = null) {
        super.reuse();

        this._ball = ball;
        this._direction = direction;
        this._isEnabled = true;
        this._eventDrag = Format.generateEventName(this, "BALL_DRAG");
        this._progressBar = !Type.isNull(progressFrame) ? ProgressBar.create(progressFrame) : null;
        this._progress = 1;
        this._eventScroll = null;

        this._ball.name = "btnBall";
        this._ball.anchor.set(0.5);
        this._ball.interactive = true;
        this._ball.interactionManager.eventDrag = this._eventDrag;

        if (this.hasProgressBar()) {
            this.addChild(this._progressBar);
        }

        this.addChild(this._ball);

        this.listenerManager.addEventListener(this._eventDrag, this._onBallDragHandler);
    }

    /**
     * @desc Returns is progress bar available.
     * @method
     * @public
     * @return {boolean}
     */

    hasProgressBar() {
        return !Type.isNull(this._progressBar);
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
        this._ball = null;
        this._direction = DIRECTION.NONE;
        this._isEnabled = true;
        this._eventDrag = null;
        this._progressBar = null;
        this._progress = 1;
        this._eventScroll = null;

        super.clearData();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @private
     */

    _updateSliderTransform() {

        if (this.hasProgressBar()) {
            this._progressBar.direction = this._direction;
            this._progressBar.progress = this._progress;
        }

        let dimLink1, dimLink2, posLink1, posLink2, progress;

        switch(this._direction) {
            case DIRECTION.LEFT: {
                dimLink1 = "width";
                dimLink2 = "height";
                posLink1 = "x";
                posLink2 = "y";
                progress = this._progress;
                break;
            }
            case DIRECTION.RIGHT: {
                dimLink1 = "width";
                dimLink2 = "height";
                posLink1 = "x";
                posLink2 = "y";
                progress = 1 - this._progress;
                break;
            }
            case DIRECTION.UP: {
                dimLink1 = "height";
                dimLink2 = "width";
                posLink1 = "y";
                posLink2 = "x";
                progress = this._progress;
                break;
            }
            case DIRECTION.DOWN: {
                dimLink1 = "height";
                dimLink2 = "width";
                posLink1 = "y";
                posLink2 = "x";
                progress = 1 - this._progress;
                break;
            }
        }

        const dim1 = this[dimLink1];
        const progressDim = Math.round(dim1 * progress);
        const halfBallDim = Math.divPowTwo(this._ball[dimLink1]);

        this._ball[posLink1] = progressDim + halfBallDim > dim1 ? (dim1 - halfBallDim) :
            progressDim < halfBallDim ? halfBallDim : progressDim;

        this._ball[posLink2] = Math.divPowTwo(this[dimLink2]);
    }

    /**
     * @method
     * @private
     * @param {mCore.eventDispatcher.EventModel} event
     */

    _onBallDragHandler(event) {
        const localPos = this.toLocal(event.data.data.global);

        if (this._direction === DIRECTION.LEFT || this._direction === DIRECTION.RIGHT) {
            this._updateProgress(localPos.x, this.width, DIRECTION.LEFT);
        }
        else {
            this._updateProgress(localPos.y, this.height, DIRECTION.UP);
        }

        this.listenerManager.dispatchEvent(this._eventScroll, this._progress);
    }

    /**
     * @method
     * @private
     * @param {number} position - x or y
     * @param {number} dimension - width or height
     * @param {mCore.enumerator.DIRECTION} mainDirection - Direction for check revers progress;
     */

    _updateProgress(position, dimension, mainDirection) {
        const progress = position > dimension ? 1: position < 0 ? 0 : position / dimension;
        this.progress = this._direction === mainDirection ? progress : 1 - progress;
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {?string}
     */

    get eventScroll() {
        return this._eventScroll;
    }

    set eventScroll(value) {
        if (this._eventScroll === value) {
            return;
        }
        this._eventScroll = value;
    }

    /**
     * @public
     * @type {int}
     */

    get width() {
        return super.width;
    }

    set width(value) {
        super.width = value;
        if (this.hasProgressBar()) {
            this._progressBar.width = this.width;
        }
        this._updateSliderTransform();
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
        if (this.hasProgressBar()) {
            this._progressBar.height = this.height;
        }
        this._updateSliderTransform();
    }

    /**
     * @public
     * @type {string | null}
     */

    get progressFrameName() {
        return this.hasProgressBar() ? this._progressBar.frameName : null;
    }

    set progressFrameName(value) {
        const isEmpty = Type.isNull(value);
        if (this.hasProgressBar()) {
            if (isEmpty) {
                this.removeChild(this._progressBar);
                this._progressBar = null;
                return;
            }
            this._progressBar.frameName = value;
            return;
        }

        if (isEmpty) {
            return;
        }

        this._progressBar = ProgressBar.create(value, this._direction);

        this.addChildAt(this._progressBar, 0);

        this._progressBar.width = this.width;
        this._progressBar.height = this.height;
        this._progressBar.progress = this._progress;
    }

    /**
     * @desc Direction of slider.
     * @public
     * @type {mCore.enumerator.DIRECTION}
     */

    get direction() {
        return this._direction;
    }

    set direction(value) {
        if (this._direction === value) {
            return;
        }

        this._direction = value;

        this._updateSliderTransform();
    }

    /**
     * @desc Current progress of slider.
     * @public
     * @type {number}
     */

    get progress() {
        return this._progress;
    }

    set progress(value) {
        if (this._progress === value) {
            return;
        }

        this._progress = value;

        this._updateSliderTransform();
    }

    /**
     * @desc Is slider enabled for interactions.
     * @public
     * @type {boolean}
     */

    get enabled() {
        return this._isEnabled;
    }

    set enabled(value) {
        if (this._isEnabled === value) {
            return;
        }

        this._isEnabled = value;
        this._ball.interactive = value;

        if (this._ball instanceof BaseButton) {
            this._ball.enabled = value;
        }
    }

    /**
     * @public
     * @type {mCore.ui.ProgressBar | null}
     */

    get progressBar() {
        return this._progressBar;
    }
}

export default Slider;
