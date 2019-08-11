import Widget from "./Widget";
import Slice9Sprite from "view/Slice9Sprite";
import DIRECTION from "enumerator/Direction";
import PROGRESS_TYPE from "enumerator/ui/ProgressType";
import Asset from "util/Asset";
import Math from "util/Math";
import UI_ELEMENT from "enumerator/ui/UIElement";

/**
 * @desc Progress bar class
 * @class
 * @extends mCore.ui.Widget
 * @memberOf mCore.ui
 */

class ProgressBar extends Widget {

    /**
     * @constructor
     * @param {string} frameLink - link to progress frame in texture;
     * @param {mCore.enumerator.DIRECTION} [direction = mCore.enumerator.DIRECTION.LEFT] - Type of progress direction.
     * @param {mCore.enumerator.ui.PROGRESS_TYPE} [type = mCore.enumerator.ui.PROGRESS_TYPE.SIZE] - Type of progress change.
     */

    constructor(frameLink, direction = DIRECTION.LEFT, type = PROGRESS_TYPE.SIZE) {
        super();

        /**
         * @type {mCore.view.Slice9Sprite}
         * @private
         */

        this._progressSprite = new Slice9Sprite(frameLink);

        /**
         * @type {?PIXI.Sprite}
         * @private
         */

        this._mask = null;

        /**
         * @type {mCore.enumerator.DIRECTION}
         * @private
         */

        this._direction = DIRECTION.NONE;

        /**
         * @type {mCore.enumerator.ui.PROGRESS_TYPE}
         * @private
         */

        this._type = PROGRESS_TYPE.NONE;

        /**
         * @type {number}
         * @private
         */

        this._progress = 1;

        super.width = this._progressSprite.width;
        super.height = this._progressSprite.height;

        this.type = type;
        this.direction = direction;

        this.uiType = UI_ELEMENT.PROGRESS_BAR;

        this.addChild(this._progressSprite);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {string} frameLink - link to progress frame in texture;
     * @param {mCore.enumerator.DIRECTION} [direction = mCore.enumerator.DIRECTION.LEFT] - Type of progress direction.
     * @param {mCore.enumerator.ui.PROGRESS_TYPE} [type = mCore.enumerator.ui.PROGRESS_TYPE.SIZE] - Type of progress change.
     */
    reuse(frameLink, direction = DIRECTION.LEFT, type = PROGRESS_TYPE.SIZE) {
        super.reuse();

        this._progressSprite = new Slice9Sprite(frameLink);
        this._mask = null;
        this._direction = DIRECTION.NONE;
        this._type = PROGRESS_TYPE.NONE;
        this._progress = 1;

        super.width = this._progressSprite.width;
        super.height = this._progressSprite.height;

        this.type = type;
        this.direction = direction;

        this.uiType = UI_ELEMENT.PROGRESS_BAR;

        this.addChild(this._progressSprite);
    }

    /**
     * @desc Set slice of colider if it slice9 sprite.
     * @method
     * @public
     * @override
     * @param {int} leftSlice
     * @param {int} rightSlice
     * @param {int} topSlice
     * @param {int} bottomSlice
     */

    setSlice(leftSlice = 0, rightSlice = 0, topSlice = 0, bottomSlice = 0) {
        this._progressSprite.slice = [leftSlice, rightSlice, topSlice, bottomSlice];
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
        this._progressSprite = null;
        this._mask = null;
        this._direction = DIRECTION.NONE;
        this._type = PROGRESS_TYPE.NONE;
        this._progress = 1;

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

    _updateDirection() {
        let hOffset, vOffset;
        const target = this._type === PROGRESS_TYPE.SIZE ? this._progressSprite : this._mask;

        switch(this._direction) {
            case DIRECTION.LEFT: {
                hOffset = 0;
                vOffset = 0;
                break;
            }
            case DIRECTION.RIGHT: {
                hOffset = this.width - target.width;
                vOffset = 0;
                break;
            }
            case DIRECTION.UP: {
                hOffset = 0;
                vOffset = 0;
                break;
            }
            case DIRECTION.DOWN: {
                hOffset = 0;
                vOffset = this.height - target.height;
                break;
            }
            default: {
                hOffset = 0;
                vOffset = 0;
                break;
            }
        }

        target.position.set(hOffset, vOffset);
    }

    /**
     * @method
     * @private
     */

    _updateProgress() {
        if (this._type === PROGRESS_TYPE.NONE) {
            return;
        }

        const condition = this._direction === DIRECTION.LEFT || this._direction === DIRECTION.RIGHT;
        const hProgress = condition ? this._progress : 1;
        const vProgress = condition ? 1 : this._progress;
        const width = Math.round(this.width * hProgress);
        const height = Math.round(this.height * vProgress);

        if (this._type === PROGRESS_TYPE.SIZE) {
            this._progressSprite.width = width;
            this._progressSprite.height = height;
            return;
        }

        this._mask.width = width;
        this._mask.height = height;
        this._progressSprite.width = this.width;
        this._progressSprite.height = this.height;
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
        this._updateProgress();
        this._updateDirection();
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
        this._updateProgress();
        this._updateDirection();
    }

    /**
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
        this._updateProgress();
        this._updateDirection();
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

        this._updateProgress();
        this._updateDirection();
    }

    /**
     * @public
     * @type {mCore.enumerator.ui.PROGRESS_TYPE}
     */

    get type() {
        return this._type;
    }

    set type(value) {
        if (this._type === value) {
            return;
        }
        this._type = value;

        if (this._mask !== null) {
            this.removeChild(this._mask);
            this._mask = null;
            this._progressSprite.mask = null;
        }

        if (this._type === PROGRESS_TYPE.CLIPPING) {
            this._mask = Asset.createWhiteSprite();
            this.addChild(this._mask);
            this._progressSprite.mask = this._mask;
        }
        this._updateProgress();
        this._updateDirection();
    }

    /**
     * @public
     * @type {?string}
     */

    get frameName() {
        return this.collider.frameName;
    }

    set frameName(value) {
        this.collider.frameName = value;
    }
}

export default ProgressBar;
