import ComponentContainer from "view/ComponentContainer";
import Type from "util/Type";
import Math from "util/Math";
import Slice9Sprite from "view/Slice9Sprite";
import Asset from "util/Asset";
import UI_ELEMENT from "enumerator/ui/UIElement";
import Constant from "constant/index";
import Geometry from "util/Geometry";
import Point from "geometry/Point";

/**
 * @desc Base component for all UI elements.
 * @class
 * @memberOf MANTICORE.ui
 * @extends MANTICORE.view.ComponentContainer
 */

class Widget extends ComponentContainer {

    /**
     * @constructor
     * @param {PIXI.Sprite | MANTICORE.view.Slice9Sprite} [collider]
     */

    constructor(collider = Asset.createWhiteSprite()) {
        super();

        /**
         * @desc Collider of widget.
         * @type {PIXI.Sprite | MANTICORE.view.Slice9Sprite}
         * @private
         */
        this._collider = collider;

        /**
         * @desc anchor point of widget.
         * @type {MANTICORE.geometry.Point}
         * @private
         */
        this._anchor = Point.create();

        /**
         * @desc Clipping mask.
         * @type {?PIXI.Sprite}
         * @private
         */

        this._clippingMask = null;

        this._anchor.initChangeCallback(this._onAnchorPointUpdate, this);

        if (this._collider instanceof PIXI.Sprite) {
            this._collider.width = 100;
            this._collider.height = 100;
            this._collider.renderable = false;
        }

        super.addChild(this._collider);

        this.uiType = UI_ELEMENT.WIDGET;

        this._collider.name = Constant.COLLIDER_NAME;
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
     * @param {PIXI.Sprite | MANTICORE.view.Slice9Sprite} [collider]
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
        this.pivot.copy(Geometry.pCompMult(
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
            this._clippingMask = Asset.createWhiteSprite();
            this._clippingMask.width = this._collider.width;
            this._clippingMask.height = this._collider.height;
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
        return this._collider.width;
    }

    set width(value) {
        value = Math.round(value);
        if (this._collider.width === value) {
            return;
        }
        this.pivot.x = Math.round(value * this._anchor.x);
        this._collider.width = value;
        if (this._isClipped()) {
            this._clippingMask.width = value;
        }
    }

    /**
     * @public
     * @type {int}
     */

    get height() {
        return this._collider.height;
    }

    set height(value) {
        value = Math.round(value);
        if (this._collider.height === value) {
            return;
        }

        this._collider.height = value;
        this.pivot.y = Math.round(value * this._anchor.y);
        if (this._isClipped()) {
            this._clippingMask.height = value;
        }
    }

    /**
     * @public
     * @type {MANTICORE.geometry.Point}
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
     * @type {PIXI.Sprite|MANTICORE.view.Slice9Sprite|MANTICORE.ui.ancillary.StateSlice9Sprite}
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
}

export default Widget;