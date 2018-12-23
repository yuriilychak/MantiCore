import ReusableObject from "memory/ReusableObject";
import Type from "util/Type";
import Boot from "boot";
import NUMBER_TYPE from "enumerator/NumberType";

/**
 * @class
 * @name Point
 * @memberOf MANTICORE.geometry
 * @extends MANTICORE.memory.ReusableObject
 */

class Point extends ReusableObject {

    /**
     * @constructor
     * @param {number} [x = 0]
     * @param {number} [y = 0]
     * @param {MANTICORE.enumerator.NUMBER_TYPE} [type = MANTICORE.enumerator.NUMBER_TYPE.DEFAULT]
     */

    constructor(x = 0, y = 0, type = NUMBER_TYPE.FLOAT_32) {
        super();

        /**
         * @type {?number[]}
         * @private
         */
        this._data = null;

        /**
         * @desc Type of point.
         * @type {MANTICORE.enumerator.NUMBER_TYPE}
         * @private
         */

        this._type = type;

        /**
         * @desc Callback that calls when point changed.
         * @type {?Function}
         * @private
         */

        this._changeCallback = null;

        /**
         * @desc Context of callback.
         * @type {?Object}
         * @private
         */
        this._changeContext = null;

        this._updateDataByType();

        this.set(x, y);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Copies x and y from the given point
     * @method
     * @public
     * @param {MANTICORE.geometry.Point} p
     */

    copyFrom(p) {
        if (this.equals(p)) {
            return;
        }
        this._data[0] = p.x;
        this._data[1] = p.y;
        this._onChange();
    }

    /**
     * @desc Copies x and y into the given point
     * @method
     * @public
     * @param {MANTICORE.geometry.Point} p
     */

    copyTo(p) {
        p.copyFrom(this);
    }

    /**
     * @desc Check is point equel to point
     * @param {MANTICORE.geometry.Point} p
     * @returns {boolean}
     */

    equals (p) {
        return this._isEquelCords(p.x, p.y);
    }

    /**
     * @desc Set x and y of point.
     * @method
     * @public
     * @param {number} x
     * @param {number} y
     */

    set(x, y) {
        if (arguments.length === 1) {
            y = x;
        }
        if (this._isEquelCords(x, y)) {
            return;
        }

        if (this._data[0] !== x) {
            this._data[0] = x;
        }

        if (this._data[1] !== y) {
            this._data[1] = y;
        }
        this._onChange();
    }

    /**
     * @desc Set init callback
     * @method
     * @public
     * @param {Function} callback
     * @param {?Object} [context = null]
     */

    initChangeCallback(callback, context = null) {
        this._changeCallback = callback;
        this._changeContext = context;
    }

    /**
     * @desc Clear change callback if it not empty.
     * @method
     * @public
     */

    clearChangeCallback() {
        this._changeContext = null;
        this._changeCallback = null;
    }

    /**
     * @desc Calls by pool when model get from pool. Don't call it only override.
     * @method
     * @public
     * @param {number} [x = 0]
     * @param {number} [y = 0]
     * @param {MANTICORE.enumerator.NUMBER_TYPE} [type = MANTICORE.enumerator.NUMBER_TYPE.DEFAULT]
     */

    reuse(x = 0, y = 0, type = NUMBER_TYPE.FLOAT_32) {
        super.reuse();
        if (this._type !== type) {
            this._updateDataByType();
        }
        this.set(x, y);
    }

    /**
     * @desc Clone object
     * @public
     * @returns {MANTICORE.geometry.Point}
     */

    clone() {
        return Point.create(this._data[0], this._data[1], this._type);
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
        this.clearChangeCallback();
        this.set(0, 0);
        super.clearData();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls when point change cords.
     * @method
     * @protected
     */

    _onChange() {
        if (Type.isNull(this._changeCallback)) {
            return;
        }
        this._changeCallback.call(Type.setValue(this._changeContext, this));
    }

    _updateDataByType() {
        if (!Boot.TYPED_ARRAY_SUPPORTED) {
            this._data = [0, 0];
            return;
        }

        switch (this._type) {
            case NUMBER_TYPE.INT_8: {
                this._data = new Int8Array(2);
                break;
            }
            case NUMBER_TYPE.INT_16: {
                this._data = new Int16Array(2);
                break;
            }
            case NUMBER_TYPE.INT_32: {
                this._data = new Int32Array(2);
                break;
            }
            case NUMBER_TYPE.UINT_8: {
                this._data = new Uint8Array(2);
                break;
            }
            case NUMBER_TYPE.UINT_16: {
                this._data = new Uint16Array(2);
                break;
            }
            case NUMBER_TYPE.UINT_32: {
                this._data = new Uint32Array(2);
                break;
            }
            case NUMBER_TYPE.FLOAT_32: {
                this._data = new Float32Array(2);
                break;
            }
            case NUMBER_TYPE.FLOAT_64: {
                this._data = new Float64Array(2);
                break;
            }
            default: {
                this._data = [0, 0];
                break;
            }
        }

        this.set(0, 0);
    }

    /**
     * @desc Returns is cords equel to cords of point.
     * @method
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     * @private
     */

    _isEquelCords(x, y) {
        return this._data[0] === x && this._data[1] === y;
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns type of point.
     * @public
     * @returns {MANTICORE.enumerator.NUMBER_TYPE}
     */

    get type() {
        return this._type;
    }

    /**
     * @desc X cord of point
     * @public
     * @returns {number}
     */

    get x() {
        return this._data[0];
    }

    /**
     * @desc Y cord of point
     * @public
     * @returns {number}
     */

    get y() {
        return this._data[1];
    }

    set x(value) {
        if (this._data[0] === value) {
            return;
        }
        this._data[0] = value;
        this._onChange();
    }

    set y(value) {
        if (this._data[1] === value) {
            return;
        }
        this._data[1] = value;
        this._onChange();
    }
}

export default Point;

