import Point from "./Point";
import NUMBER_TYPE from "enumerator/NumberType";
import Math from "util/Math";
import ReusableObject from "memory/ReusableObject";

/**
 * @class
 * @name Rectangle
 * @memberOf MANTICORE.geometry
 * @extends MANTICORE.memory.ReusableObject
 */

export default class Rectangle extends ReusableObject {
    /**
     * @constructor
     * @param {number} [x=0] - The X coordinate of the upper-left corner of the rectangle
     * @param {number} [y=0] - The Y coordinate of the upper-left corner of the rectangle
     * @param {number} [width=0] - The overall width of this rectangle
     * @param {number} [height=0] - The overall height of this rectangle
     * @param {MANTICORE.enumerator.NUMBER_TYPE} [type = MANTICORE.enumerator.NUMBER_TYPE.DEFAULT]
     */
    constructor(x = 0, y = 0, width = 0, height = 0, type = NUMBER_TYPE.FLOAT_32) {
        super();

        /**
         * @type {MANTICORE.geometry.Point}
         * @private
         */
        this._origin = Point.create(x, y, type);

        /**
         * @type {MANTICORE.geometry.Point}
         * @private
         */

        this._dimension = Point.create(width, height, type);

        /**
         * @desc Type of rectangle numbers.
         * @type {MANTICORE.enumerator.NUMBER_TYPE}
         * @private
         */

        this._numType = type;

        /**
         * The type of the object, mainly used to avoid `instanceof` checks
         *
         * @member {number}
         * @readOnly
         * @default PIXI.SHAPES.RECT
         * @see PIXI.SHAPES
         */
        this.type = PIXI.SHAPES.RECT;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc A constant empty rectangle.
     * @method
     * @public
     * @static
     * @constant
     */
    static get EMPTY() {
        return Rectangle.create();
    }

    /**
     * @desc Creates a clone of this Rectangle
     * @method
     * @public
     * @return {MANTICORE.geometry.Rectangle} a copy of the rectangle
     */
    clone() {
        return Rectangle.create(this._origin.x, this._origin.y, this._dimension.x, this._dimension.y);
    }

    /**
     * @desc Copies another rectangle to this one.
     * @method
     * @public
     * @param {MANTICORE.geometry.Rectangle} rectangle - The rectangle to copy from.
     * @return {MANTICORE.geometry.Rectangle} Returns itself.
     */
    copyFrom(rectangle) {
        this._origin.x = rectangle.x;
        this._origin.y = rectangle.y;
        this._dimension.x = rectangle.width;
        this._dimension.y = rectangle.height;
        return this;
    }

    /**
     * @desc Copies this rectangle to another one.
     * @method
     * @public
     * @param {MANTICORE.geometry.Rectangle} rectangle - The rectangle to copy to.
     * @return {MANTICORE.geometry.Rectangle} Returns given parameter.
     */
    copyTo(rectangle) {
        rectangle.x = this._origin.x;
        rectangle.y = this._origin.y;
        rectangle.width = this._dimension.x;
        rectangle.height = this._dimension.y;
        return rectangle;
    }

    /**
     * @desc Checks whether the x and y coordinates given are contained within this Rectangle
     * @method
     * @public
     * @param {number} x - The X coordinate of the point to test
     * @param {number} y - The Y coordinate of the point to test
     * @return {boolean} Whether the x/y coordinates are within this Rectangle
     */
    contains(x, y) {
        if (this._dimension.x <= 0 || this._dimension.y <= 0) {
            return false;
        }
        if (x >= this._origin.x && x < this._origin.x + this._dimension.x) {
            if (y >= this._origin.y && y < this._origin.y + this._dimension.y) {
                return true;
            }
        }
        return false;
    }

    /**
     * @desc Pads the rectangle making it grow in all directions.
     * @method
     * @public
     * @param {number} paddingX - The horizontal padding amount.
     * @param {number} paddingY - The vertical padding amount.
     */
    pad(paddingX, paddingY) {
        paddingX = paddingX || 0;
        paddingY = paddingY || ((paddingY !== 0) ? paddingX : 0);
        this._origin.x -= paddingX;
        this._origin.y -= paddingY;
        this._dimension.x += paddingX * 2;
        this._dimension.y += paddingY * 2;
    }

    /**
     * @desc Fits this rectangle around the passed one.
     * @method
     * @public
     * @param {MANTICORE.geometry.Rectangle} rectangle - The rectangle to fit.
     */
    fit(rectangle) {
        if (this._origin.x < rectangle.x) {
            this._dimension.x += this._origin.x;
            if (this._dimension.x < 0) {
                this._dimension.x = 0;
            }
            this._origin.x = rectangle.x;
        }
        if (this._origin.y < rectangle.y) {
            this._dimension.y += this._origin.y;
            if (this._dimension.y < 0) {
                this._dimension.y = 0;
            }
            this._origin.y = rectangle.y;
        }
        if (this._origin.x + this._dimension.x > rectangle.x + rectangle.width) {
            this._dimension.x = rectangle.width - this._origin.x;
            if (this._dimension.x < 0) {
                this._dimension.x = 0;
            }
        }
        if (this._origin.y + this._dimension.y > rectangle.y + rectangle.height) {
            this._dimension.y = rectangle.height - this._origin.y;
            if (this._dimension.y < 0) {
                this._dimension.y = 0;
            }
        }
    }

    /**
     * @desc Enlarges rectangle that way its corners lie on grid
     * @method
     * @public
     * @param {number} [resolution=1] resolution
     * @param {number} [eps=0.001] precision
     */
    ceil(resolution = 1, eps = 0.001) {
        const x2 = Math.ceil((this._origin.x + this._dimension.x - eps) * resolution) / resolution;
        const y2 = Math.ceil((this._origin.y + this._dimension.y - eps) * resolution) / resolution;
        this._origin.x = Math.floor((this._origin.x + eps) * resolution) / resolution;
        this._origin.y = Math.floor((this._origin.y + eps) * resolution) / resolution;
        this._dimension.x = x2 - this._origin.x;
        this._dimension.y = y2 - this._origin.y;
    }

    /**
     * @desc Enlarges this rectangle to include the passed rectangle.
     * @method
     * @public
     * @param {MANTICORE.geometry.Rectangle} rectangle - The rectangle to include.
     */
    enlarge(rectangle) {
        const x1 = Math.min(this._origin.x, rectangle.x);
        const x2 = Math.max(this._origin.x + this._dimension.x, rectangle.x + rectangle.width);
        const y1 = Math.min(this._origin.y, rectangle.y);
        const y2 = Math.max(this._origin.y + this._dimension.y, rectangle.y + rectangle.height);
        this._origin.x = x1;
        this._dimension.x = x2 - x1;
        this._origin.y = y1;
        this._dimension.y = y2 - y1;
    }

    /**
     * @desc Calls by pool when model get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} [x=0] - The X coordinate of the upper-left corner of the rectangle
     * @param {number} [y=0] - The Y coordinate of the upper-left corner of the rectangle
     * @param {number} [width=0] - The overall width of this rectangle
     * @param {number} [height=0] - The overall height of this rectangle
     * @param {MANTICORE.enumerator.NUMBER_TYPE} [type = MANTICORE.enumerator.NUMBER_TYPE.DEFAULT]
     */

    reuse(x = 0, y = 0, width = 0, height = 0, type = NUMBER_TYPE.FLOAT_32) {
        super.reuse();
        if (this._numType !== type) {
            this._origin.type = type;
            this._dimension.type = type;
            this._numType = type;
        }
        this._origin.set(x, y);
        this._dimension.set(width, height);
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
        this._origin.set(0, 0);
        this._dimension.set(0, 0);
        super.clearData();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @returns {number}
     */

    get x() {
        return this._origin.x;
    }

    set x(value) {
        this._origin.x = value;
    }

    /**
     * @public
     * @returns {number}
     */

    get y() {
        return this._origin.y;
    }

    set y(value) {
        this._origin.y = value;
    }

    /**
     * @public
     * @returns {number}
     */

    get width() {
        return this._dimension.x;
    }

    set width(value) {
        this._dimension.x = value;
    }

    /**
     * @public
     * @returns {number}
     */

    get height() {
        return this._dimension.y;
    }

    set height(value) {
        this._dimension.y = value;
    }

    /**
     * @desc Returns the left edge of the rectangle
     * @public
     * @member {number}
     */
    get left() {
        return this._origin.x;
    }

    /**
     * @desc Returns the right edge of the rectangle
     * @public
     * @member {number}
     */
    get right() {
        return this._origin.x + this._dimension.x;
    }

    /**
     * @desc Returns the top edge of the rectangle
     * @public
     * @member {number}
     */
    get top() {
        return this._origin.y;
    }

    /**
     * @desc Returns the bottom edge of the rectangle
     * @public
     * @member {number}
     */
    get bottom() {
        return this._origin.y + this._dimension.y;
    }
}