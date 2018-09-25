import Asset from "util/Asset";
import Type from "util/Type";
import Math from "util/Math";
import Constant from "constant/index";

/** @namespace MANTICORE.view */

/**
 * @desc Slice 9 sprite to avoid breaking batch.
 * @class
 * @memberOf MANTICORE.view
 * @toc MANTICORE.view.Slice9Sprite
 */

class Slice9Sprite extends PIXI.Container {

    /**
     * @constructor
     * @param {string} frameName
     * @param {int} [leftSlice = 0]
     * @param {int} [rightSlice = 0]
     * @param {int} [topSlice = 0]
     * @param {int} [bottomSlice = 0]
     */

    constructor(frameName, leftSlice = 0, rightSlice = 0, topSlice = 0, bottomSlice = 0) {
        super();

        /**
         * @type {PIXI.Sprite}
         * @private
         */

        this._collider = Asset.createWhiteSprite();

        /**
         * @desc anchor point of sprite.
         * @type {PIXI.ObservablePoint}
         * @private
         */

        this._anchor = new PIXI.ObservablePoint(this._onAnchorPointUpdate, this);

        /**
         * @desc Tint of sprite
         * @type {int}
         * @private
         */

        this._tint = 0xFFFFFF;

        /**
         * @desc Frame name of element;
         * @type {?string}
         * @private
         */

        this._frameName = null;

        /**
         * @type {PIXI.Sprite[]}
         * @private
         */

        this._frames = [];

        /**
         * @desc Flag is currently slice 9 sprite have dimensions. Need to calculate bounds.
         * @type {boolean}
         * @private
         */

        this._isInit = false;

        /**
         *
         * @type {int}
         * @private
         */

        this._leftSlice = leftSlice;

        /**
         *
         * @type {int}
         * @private
         */

        this._rightSlice = rightSlice;

        /**
         *
         * @type {int}
         * @private
         */

        this._topSlice = topSlice;

        /**
         *
         * @type {int}
         * @private
         */

        this._bottomSlice = bottomSlice;

        this._collider.name = Constant.COLLIDER_NAME;
        this._collider.renderable = false;

        this.addChild(this._collider);

        const elementCount = Slice9Sprite.ELEMMENT_COUNT * Slice9Sprite.ELEMMENT_COUNT;

        for (let i = 0; i < elementCount; ++i) {
            this._frames.push(null);
        }


        this.frameName = frameName;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @type {int}
     */

    get tint() {
        return this._tint;
    }


    set tint(value) {
        if (this._tint === value) {
            return;
        }
        this._tint = value;

        this._iterateFrames((frame, index, row, col) => {
            if (Type.isNull(frame)) {
                return;
            }
            frame.tint = this._tint;
        });
    }

    /**
     * @public
     * @type {PIXI.ObservablePoint}
     */

    get anchor() {
        return this._anchor;
    }

    set anchor (value) {
        this._anchor.copy(value);
    }

    /**
     * @desc Returns left slice of sprite;
     * @public
     * @type {int}
     */

    get leftSlice() {
        return this._leftSlice;
    }

    set leftSlice(value) {
        value = Math.round(value);
        if (this._leftSlice === value) {
            return;
        }
        this._leftSlice = value;
        this._updateTransform();
    }

    /**
     * @desc Returns left slice of sprite;
     * @public
     * @type {int}
     */

    get rightSlice() {
        return this._rightSlice;
    }

    set rightSlice(value) {
        value = Math.round(value);
        if (this._rightSlice === value) {
            return;
        }
        this._rightSlice = value;
        this._updateTransform();
    }

    /**
     * @desc Returns left slice of sprite;
     * @public
     * @type {int}
     */

    get topSlice() {
        return this._topSlice;
    }

    set topSlice(value) {
        value = Math.round(value);
        if (this._topSlice === value) {
            return;
        }
        this._topSlice = value;
        this._updateTransform();
    }

    /**
     * @desc Returns left slice of sprite;
     * @public
     * @type {int}
     */

    get bottomSlice() {
        return this._bottomSlice;
    }

    set bottomSlice(value) {
        value = Math.round(value);
        if (this._bottomSlice === value) {
            return;
        }
        this._bottomSlice = value;
        this._updateTransform();
    }

    /**
     * @desc return Array of slice
     * @public
     * @returns {int[]}
     */

    getSlice() {
        return [this._leftSlice, this._rightSlice, this._topSlice, this._bottomSlice];
    }

    /**
     * @desc Set slice of sprite
     * @method
     * @public
     * @param {int} leftSlice
     * @param {int} rightSlice
     * @param {int} topSlice
     * @param {int} bottomSlice
     */

    setSlice(leftSlice = 0, rightSlice = 0, topSlice = 0, bottomSlice = 0) {
        this._leftSlice = Math.round(leftSlice);
        this._rightSlice = Math.round(rightSlice);
        this._topSlice = Math.round(topSlice);
        this._bottomSlice = Math.round(bottomSlice);
        this._updateTransform();
    }

    /**
     * @desc Returns frame name of texture
     * @public
     * @type {?string}
     */

    get frameName() {
        return this._frameName;
    }

    set frameName(value) {
        if (this._frameName === value) {
            return;
        }

        this._frameName = value;
        this._updateTransform(true);
    }

    /**
     * @desc Returns width of slice 9 sprite
     * @public
     * @type {int}
     */

    get width() {
        return super.width;
    }

    /**
     * @desc Returns height of slice 9 sprite
     * @public
     * @type {int}
     */

    get height() {
        return super.height;
    }

    set width(value) {
        const sliceSum = this._leftSlice + this._rightSlice;
        this._setDimension(value < sliceSum ? sliceSum : value, "width");
    }

    set height(value) {
        const sliceSum = this._topSlice + this._bottomSlice;
        this._setDimension(value < sliceSum ? sliceSum : value, "height");
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Generate dimensions parameters from boundary.
     * @method
     * @private
     * @param {int} origin - x or y of frame.
     * @param {int} dimension - width or height frame.
     * @param {number} anchor -anchor x or y of sprite.
     * @param {int} minBoundary - left or top slice.
     * @param {int} maxBoundary - right or bottom slice.
     * @return {MANTICORE.view.Slice9Sprite.DimensionParam}
     */

    _generateDimensionParam(origin, dimension, anchor, minBoundary, maxBoundary) {
        let middleDimension = dimension - minBoundary - maxBoundary;
        let offset = 0;
        if (middleDimension === 0) {
            offset = Slice9Sprite.PADDING;
            middleDimension = Math.multPowTwo(offset);
        }
        return {
            origins: [origin, origin + minBoundary - offset, origin + dimension - maxBoundary + offset],
            dimensions: [minBoundary - offset, middleDimension, maxBoundary - offset],
            positions: this._generatePositions(dimension, anchor, minBoundary, maxBoundary)
        }
    }

    /**
     * @desc Generate positions from boundary.
     * @method
     * @private
     * @param {int} dimension - width or height frame.
     * @param {number} anchor -anchor x or y of sprite.
     * @param {int} minBoundary - left or top slice.
     * @param {int} maxBoundary - right or bottom slice.
     * @param {int} [padding = 0] - offset. Need to manipulate with empty sprites.
     * @return {int[]}
     */

    _generatePositions(dimension, anchor, minBoundary, maxBoundary, padding = 0) {
        const offset = -Math.round(anchor * dimension);
        return [
            offset,
            offset + minBoundary - padding,
            offset + dimension - maxBoundary - padding
        ];
    }

    /**
     * @desc Need for update width and height of sprites whein it's set.
     * @method
     * @private
     * @param {int} value - value of dimension.
     * @param {string} dimensionLink - link to dimension "width" or "height"
     */

    _setDimension(value, dimensionLink) {
        value = Math.round(value);

        if (this[dimensionLink] === value) {
            return;
        }

        if (!this._isInit) {
            this._isInit = true;
        }

        this._updateDimension(value, dimensionLink);
    }

    /**
     * @desc Need for update width and height of sprites.
     * @method
     * @private
     * @param {int} value - value of dimension.
     * @param {string} dimensionLink - link to dimension "width" or "height"
     */

    _updateDimension(value, dimensionLink) {
        let minBoundary, maxBoundary, indices, positionLink, useRowIndex;

        if (dimensionLink === "width") {
            minBoundary = this._leftSlice;
            maxBoundary = this._rightSlice;
            indices = [3, 4, 5];
            positionLink = "x";
            useRowIndex = true;
            this._collider.width = value;
        }
        else {
            minBoundary = this._topSlice;
            maxBoundary = this._bottomSlice;
            indices = [1, 4, 7];
            positionLink = "y";
            useRowIndex = false;
            this._collider.height = value;
        }

        const middleDimension = value - minBoundary - maxBoundary;
        const positions = this._generatePositions(value, this._anchor[positionLink], minBoundary, maxBoundary);

        this._iterateFrames((frame, index, row, col) => {
            if (Type.isNull(frame)) {
                return;
            }
            if (Math.binaryIndexOf(index, indices) !== -1) {
                frame[dimensionLink] = middleDimension;
            }
            frame[positionLink] = positions[useRowIndex ? row : col];
        });
    }

    /**
     * @desc Update transformation when sprite frame parameters change.
     * @param {boolean} [textureChange = false] - Is need to update textures of sprites.
     * @method
     * @private
     */

    _updateTransform(textureChange = false) {
        const texture = Asset.getSpriteFrame(this._frameName);

        if (Type.isNull(texture)) {
            return;
        }

        const baseTexture = texture.baseTexture;
        const frame = texture.frame;
        const width = this._isInit ? this.width : frame.width;
        const height = this._isInit ? this.height : frame.height;
        const {
            origins: hOrigins,
            dimensions: hDimensions,
            positions: hPositions
        } = this._generateDimensionParam(frame.x, frame.width, this._anchor.x, this._leftSlice, this._rightSlice);

        const {
            origins: vOrigins,
            dimensions: vDimensions,
            positions: vPositions
        } = this._generateDimensionParam(frame.y, frame.height, this._anchor.y, this._topSlice, this._bottomSlice);

        const elementCount = Slice9Sprite.ELEMMENT_COUNT;
        let i, j, rect, sprite,
            frameTexture, index,
            hDimension, hOrigin, hPosition,
            vDimension, vOrigin;

        for (i = 0; i < elementCount; ++i) {
            hDimension = hDimensions[i];
            hOrigin = hOrigins[i];
            hPosition = hPositions[i];

            for (j = 0; j < elementCount; ++j) {
                index = i * elementCount + j;
                sprite = this._frames[index];
                vDimension = vDimensions[j];


                if (hDimension === 0 || vDimension === 0) {
                    if (!Type.isNull(sprite)) {
                        this.removeChild(sprite);
                        this._frames[index] = null;
                    }
                    continue;
                }

                vOrigin = vOrigins[j];

                rect = new PIXI.Rectangle(hOrigin, vOrigin, hDimension, vDimension);

                if (Type.isNull(sprite)) {
                    frameTexture = new PIXI.Texture(baseTexture, rect);
                    sprite = PIXI.Sprite.from(frameTexture);
                    sprite.tint = this._tint;
                    sprite.interactive = false;
                    sprite.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
                    this.addChildAt(sprite, 0);
                    this._frames[index] = sprite;
                }
                else {
                    if (textureChange && sprite.texture.baseTexture !== baseTexture) {
                        sprite.texture.baseTexture = baseTexture;
                    }

                    sprite.texture.frame = rect;
                    sprite.interactive = false;
                    sprite.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
                }

                if (!this._isInit) {
                    sprite.position.set(hPosition, vPositions[j]);
                }
            }
        }

        if (this._isInit) {
            this._updateDimension(width, "width");
            this._updateDimension(height, "height");
            return;
        }
        this._collider.width = width;
        this._collider.height = height;
    }

    /**
     * @desc method for iterate sprite frames.
     * @method
     * @private
     * @param {MANTICORE.view.Slice9Sprite.IterateFrames | Function} callback
     */

    _iterateFrames(callback)  {
        const elementCount = Slice9Sprite.ELEMMENT_COUNT;
        let i, j, index;

        for (i = 0; i < elementCount; ++i) {
            for (j = 0; j < elementCount; ++j) {
                index = i * elementCount + j;
                callback(this._frames[index], index, i, j);
            }
        }
    }

    /**
     * @desc Calls when anchor point change.
     * @method
     * @private
     */

    _onAnchorPointUpdate() {
        this._collider.anchor.set(this._anchor.x, this._anchor.y);
        const hPosition = this._generatePositions(this.width, this._anchor.x, this._leftSlice,  this._rightSlice);
        const vPosition = this._generatePositions(this.height, this._anchor.y, this._topSlice,  this._bottomSlice);
        this._iterateFrames((frame, index, row, col) => {
            if (Type.isNull(frame)) {
                return;
            }
            frame.position.set(
                hPosition[row],
                vPosition[col]
            );
        });
    }
}

/**
 * @desc Padding of texture. Need to avoid artifacts
 * @static
 * @private
 * @type {int}
 * @memberOf MANTICORE.view.Slice9Sprite
 */

Slice9Sprite.PADDING = 1;

/**
 * @desc Count of element in row
 * @static
 * @private
 * @type {int}
 * @memberOf MANTICORE.view.Slice9Sprite
 */

Slice9Sprite.ELEMMENT_COUNT = 3;

/**
 * @desc Data that contain dimension parameters.
 * @typedef {Object}
 * @name DimensionParam
 * @memberOf MANTICORE.view.Slice9Sprite
 * @property {int[]} origins - Origins of frames.
 * @property {int[]} dimensions - Dimensions of frames.
 * @property {int[]} positions - Positions of frames.
 */

/**
 * @desc Callback for iterate frames.
 * @callback IterateFrames
 * @param {PIXI.Sprite} frame - Frame that use.
 * @param {int} index - Index of frame.
 * @param {int} row - Row of frame.
 * @param {int} col - Column of frame.
 * @memberOf MANTICORE.view.Slice9Sprite
 */

export default Slice9Sprite;