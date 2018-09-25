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
 * @extends MANTICORE.ui.Widget
 * @memberOf MANTICORE.ui
 */

class Slider extends Widget {
    /**
     * @constructor
     * @param {MANTICORE.ui.Widget} ball - Slider ball texture
     * @param {MANTICORE.enumerator.DIRECTION} [direction = MANTICORE.enumerator.DIRECTION.LEFT] - Type of progress direction.
     * @param {?string} [progressFrame = null] - Progress texture
     */
    constructor(ball, direction = DIRECTION.LEFT, progressFrame = null) {
        super();

        /**
         * @type {MANTICORE.ui.Widget}
         * @private
         */

        this._ball = ball;

        /**
         * @type {MANTICORE.enumerator.DIRECTION}
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
         * @type {?MANTICORE.ui.ProgressBar}
         * @private
         */

        this._progressBar = !Type.isNull(progressFrame) ? new ProgressBar(progressFrame) : null;

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
        this._ball.eventDrag = this._eventDrag;

        if (this.hasProgressBar()) {
            this.addChild(this._progressBar);
        }

        this.addChild(this._ball);

        this.uiType = UI_ELEMENT.SLIDER;

        this.addEventListener(this._eventDrag, this._onBallDragHandler);
    }

    /**
     * PUBLIC METHODS
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

        this._progressBar = new ProgressBar(value, this._direction);

        this.addChildAt(this._progressBar, 0);

        this._progressBar.width = this.width;
        this._progressBar.height = this.height;
        this._progressBar.progress = this._progress;
    }

    /**
     * @public
     * @type {MANTICORE.ui.ProgressBar | null}
     */

    get progressBar() {
        return this._progressBar;
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
     * @public
     * @type {MANTICORE.enumerator.DIRECTION}
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
     * @param {MANTICORE.eventDispatcher.EventModel} event
     */

    _onBallDragHandler(event) {
        const localPos = this.toLocal(event.data.data.global);

        if (this._direction === DIRECTION.LEFT || this._direction === DIRECTION.RIGHT) {
            this._updateProgress(localPos.x, this.width, DIRECTION.LEFT);
        }
        else {
            this._updateProgress(localPos.y, this.height, DIRECTION.UP);
        }

        this.dispatchEvent(this._eventScroll, this._progress);
    }

    /**
     * @method
     * @private
     * @param {number} position - x or y
     * @param {number} dimension - width or height
     * @param {MANTICORE.enumerator.DIRECTION} mainDirection - Direction for check revers progress;
     */

    _updateProgress(position, dimension, mainDirection) {
        const progress = position > dimension ? 1: position < 0 ? 0 : position / dimension;
        this.progress = this._direction === mainDirection ? progress : 1 - progress;
    }
}

export default Slider;