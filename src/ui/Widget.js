import ComponentContainer from "view/ComponentContainer";
import Type from "util/Type";
import Math from "util/Math";
import Slice9Sprite from "view/Slice9Sprite";
import Asset from "util/Asset";
import UI_ELEMENT from "enumerator/ui/UIElement";
import CLIPPING_TYPE from "enumerator/ui/ClippingType";
import Constant from "constant/index";
import Geometry from "util/Geometry";
import Point from "geometry/Point";
import Color from "util/Color";
import NUMBER_TYPE from "enumerator/NumberType";

/**
 * @desc Base component for all UI elements.
 * @class
 * @memberOf mCore.ui
 * @extends mCore.view.ComponentContainer
 */

class Widget extends ComponentContainer {

    /**
     * @constructor
     * @param {PIXI.Sprite | mCore.view.Slice9Sprite} [collider]
     */

    constructor(collider = Asset.createWhiteSprite()) {
        super();

        /**
         * @desc Collider of widget.
         * @type {PIXI.Sprite | mCore.view.Slice9Sprite}
         * @private
         */
        this._collider = collider;

        /**
         * @desc anchor point of widget.
         * @type {mCore.geometry.Point}
         * @private
         */
        this._anchor = Point.create();

        /**
         * @type {Point}
         * @private
         */

        this._size = Point.create(super.width, super.height, NUMBER_TYPE.INT_32);

        /**
         * @desc Clipping mask.
         * @type {?PIXI.Sprite | ?PIXI.Graphics}
         * @private
         */

        this._clippingMask = null;

        this._anchor.initChangeCallback(this._onAnchorPointUpdate, this);


        this._size.initChangeCallback(this.onSizeChange, this);

        if (this._collider instanceof PIXI.Sprite) {
            this._collider.width = 100;
            this._collider.height = 100;
            this._collider.renderable = false;
        }

        super.addChild(this._collider);

        this.uiType = UI_ELEMENT.WIDGET;

        this._collider.name = Constant.COLLIDER_NAME;

        /**
         * @type {CLIPPING_TYPE}
         * @private
         */

        this._clippingType = CLIPPING_TYPE.SPRITE;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Set slice of collider if it slice9 sprite.
     * @method
     * @public
     * @param {int} leftSlice
     * @param {int} rightSlice
     * @param {int} topSlice
     * @param {int} bottomSlice
     */

    setSlice(leftSlice = 0, rightSlice = 0, topSlice = 0, bottomSlice = 0) {
        if (!(this._collider instanceof  Slice9Sprite)) {
            return;
        }
        this._collider.slice = [leftSlice, rightSlice, topSlice, bottomSlice];
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {PIXI.Sprite | mCore.view.Slice9Sprite} [collider]
     */
    reuse(collider = Asset.createWhiteSprite()) {
        super.reuse();

        this._collider = collider;

        this._anchor.set(0, 0);
        this._clippingMask = null;

        if (this._collider instanceof PIXI.Sprite) {
            this._collider.width = 100;
            this._collider.height = 100;
            this._collider.renderable = false;
        }

        super.addChild(this._collider);
        this._collider.name = Constant.COLLIDER_NAME;
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
        this._collider = null;
        this._anchor.set(0, 0);
        this._clippingMask = null;
        super.clearData();
    }

    /**
     * @desc Calls when size of object change.
     * @method
     * @protected
     */

    onSizeChange() {
        if (this._collider.width !== this._size.x) {
            this.pivot.x = Math.round(this._size.x * this._anchor.x);
            this._collider.width = this._size.x;
            if (this._isClipped()) {
                this._clippingMask.width = this._size.x;
            }
        }

        if (this._collider.height !== this._size.y) {
            this._collider.height = this._size.y;
            this.pivot.y = Math.round(this._size.y * this._anchor.y);
            if (this._isClipped()) {
                this._clippingMask.height = this._size.y;
            }
        }
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Is currently widget clipped.
     * @returns {boolean}
     * @private
     */

    _isClipped() {
        return !Type.isNull(this._clippingMask);
    }

    /**
     * @desc Calls when anchor point change.
     * @method
     * @private
     */

    _onAnchorPointUpdate() {
        if (Type.isNull(this._collider)) {
            return;
        }
        this.pivot.copyFrom(Geometry.pCompMult(
            Geometry.pFromSize(this._collider),
            this._anchor,
            true
        ));
    }


    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Flag is use clipping mask for element.
     * @public
     * @type {boolean}
     */

    get clipping() {
        return this._isClipped();
    }

    set clipping(value) {
        if (this._isClipped() === value) {
            return;
        }

        if (value) {
            if (this._clippingType === CLIPPING_TYPE.SPRITE) {
                this._clippingMask = Asset.createWhiteSprite();
                this._clippingMask.width = this._collider.width;
                this._clippingMask.height = this._collider.height;
            }
            else {
                this._clippingMask = new PIXI.Graphics();
                this._clippingMask.beginFill(Color.COLORS.WHITE);
                this._clippingMask.drawRect(0, 0, this._collider.width, this._collider.height);
                this._clippingMask.endFill();
            }
        }
        else {
            super.removeChild(this._clippingMask);
            this._clippingMask = null;
        }

        const childrenCount = this.children.length;
        for (let i = 0; i < childrenCount; ++i) {
            if (this.children[i] === this._collider) {
                continue;
            }
            this.children[i].mask = this._clippingMask;
        }

        if (!this._isClipped()) {
            return;
        }

        super.addChild(this._clippingMask);
    }

    /**
     * @public
     * @type {int}
     */

    get width() {
        return this._size.x;
    }

    set width(value) {
        if (this._size.x === value) {
            return;
        }
        this._size.x = value;
    }

    /**
     * @public
     * @type {int}
     */

    get height() {
        return this._size.y;
    }

    set height(value) {
        if (this._size.y === value) {
            return;
        }
        this._size.y = value;
    }

    /**
     * @desc Size of element
     * @public
     * @return {Point}
     */

    get rate() {
        return this._size;
    }

    /**
     * @public
     * @type {mCore.geometry.Point}
     */

    get anchor() {
        return this._anchor;
    }

    set anchor(value) {
        this._anchor.copyFrom(value);
    }

    /**
     * @desc Flag is element flip horizontal
     * @public
     * @type {boolean}
     */

    get flipX() {
        return this.scale.x < 0;
    }

    set flipX(value) {
        if (this.flipX === value) {
            return;
        }

        this.scale.x = this.scale.x * -1;
    }

    /**
     * @desc Flag is element flip vertical
     * @public
     * @type {boolean}
     */

    get flipY() {
        return this.scale.y < 0;
    }

    set flipY(value) {
        if (this.flipY === value) {
            return;
        }

        this.scale.y = this.scale.y * -1;
    }

    /**
     * @desc Returns collider.
     * @protected
     * @type {PIXI.Sprite|mCore.view.Slice9Sprite|mCore.ui.ancillary.StateSlice9Sprite}
     */

    get collider() {
        return this._collider;
    }

    set collider(value) {
        if (this._collider === value) {
            return;
        }

        if (!Type.isNull(this._collider)) {
            this.updateChildTint(value);
            value.tint = this._collider.tint;
            super.removeChild(this._collider);
        }

        this._collider = value;
        this._collider.name = Constant.COLLIDER_NAME;

        super.addChild(this._collider);
    }

    /**
     * @public
     * @return {CLIPPING_TYPE}
     */

    get clippingType() {
        return this._clippingType;
    }

    set clippingType(value) {
        if (this._clippingType === value) {
            return;
        }
        this._clippingType = value;

        if (!this._isClipped()) {
            return;
        }

        this.clipping = false;
        this.clipping = true;
    }
}

export default Widget;
