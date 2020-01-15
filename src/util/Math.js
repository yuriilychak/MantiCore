import Macro from "macro";
import Constant from "constant";

/**
 * @desc Namespace that contain some math function for fast calculations.
 * @namespace mCore.util.math
 * @memberOf mCore.util
 */

const math = {

    /**
     * @desc Variable for generate unique id's for objects.
     * @type {int}
     * @private
     */

    _id: 0,

    /**
     * @desc Array with id's for reuse.
     * @type {int[]}
     * @private
     */

    _idPool: [],

    /**
     * @desc PI number.
     * @type {number}
     * @public
     * @readonly
     * @const
     * @memberOf mCore.util.math
     */

    PI: 3.14159265,

    /**
     * @desc Half of degree circle need for manipulate with angles.
     * @type {int}
     * @public
     * @readonly
     * @const
     * @memberOf mCore.util.math
     */

    HALF_CIRCLE: 180,

    /**
     * @desc Full degree circle need for manipulate with angles.
     * @type {int}
     * @public
     * @readonly
     * @const
     * @memberOf mCore.util.math
     */

    FULL_CIRCLE: 360,

    /**
     * @desc Max percent value need to manipulate with percents.
     * @type {int}
     * @public
     * @readonly
     * @const
     * @memberOf mCore.util.math
     */

    MAX_PERCENT: 100,

    /**
     * @desc Max value of byte number. Need for manipulate with colors.
     * @type {int}
     * @public
     * @readonly
     * @const
     * @memberOf mCore.util.math
     */

    MAX_BYTE: 255,

    /**
     * @desc Milli value. Need to convert seconds to milliseconds and etc.
     * @type {number}
     * @public
     * @readonly
     * @const
     * @memberOf mCore.util.math
     */

    MILLI: 0.001,

    /**
     * @desc Return sign of value
     * @param {number} value
     * @return {int}
     * @memberOf mCore.util.math
     */

    sign: function(value) {
    return value < 0 ? -1 : 1;
    },

    /**
     * @desc Returns sinus of angle.
     * @function
     * @private
     * @param {number} angle
     * @memberOf mCore.util.math
     * @return {number}
     */

    _sin: function (angle) {
        return 1.27323954 * angle - this.sign(angle) * 0.405284735 * angle * angle;
    },

    /**
     * @desc Performs a binary search on the host array. (Array must be sorted).
     * @function
     * @param {*} element - The item to search for within the array.
     * @param {Array} array - Array for search.
     * @memberOf mCore.util.math
     * @return {int} The index of the element which defaults to -1 when not found.
     */
    binaryIndexOf: function (element, array) {
        let start = 0;
        let end = array.length -1;
        let middleIndex, crtElement;

        while(start <= end){
            middleIndex = start === end ? start : ((end - start) / 2 >> 0) + start;
            crtElement = array[middleIndex];

            if (crtElement === element) {
                return middleIndex;
            }

            if (element < crtElement) {
                end = middleIndex - 1;
                continue;
            }
            start = middleIndex + 1;
        }
        return -1;
    },

    /**
     * @desc Return absolute value of number
     * @function
     * @param {number} value
     * @return {number}
     */

    abs: function (value) {
        return value * this.sign(value)
    },

    /**
     * @desc Floor number.
     * @function
     * @param {number} value
     * @memberOf mCore.util.math
     * @return {int}
     */

    floor: function (value) {
        return (value - (value >= 0 ? 0 : 0.5)) << 0;
    },

    /**
     * @desc Round number.
     * @function
     * @param {number} value
     * @memberOf mCore.util.math
     * @return {int}
     */

    round: function(value) {
        return (value + (value >= 0 ? 0.5 : -0.499999)) << 0;
    },

    /**
     * @desc Ceil number.
     * @function
     * @param {number} value
     * @memberOf mCore.util.math
     * @return {int}
     */

    ceil: function(value) {
        const floored = this.floor(value);
        return floored === value ? value : floored + 1;
    },

    /**
     * @desc Divide number by power of two rank and floor it.
     * @function
     * @param {number} value
     * @param {int} [rank = 1]
     * @memberOf mCore.util.math
     * @returns {int}
     */

    divPowTwo: function (value, rank = 1) {
        return value >> rank;
    },

    /**
     * @desc Multiply number by power of two rank and floor it.
     * @function
     * @param {number} value
     * @param {int} [rank = 1]
     * @memberOf mCore.util.math
     * @returns {int}
     */

    multPowTwo: function (value, rank = 1) {
        return value << rank;
    },

    /**
     * @desc Round float to fixed num after dot
     * @function
     * @param {number} value - Value to round.
     * @param {int} [numCount = 2] - Num count after dot to round.
     * @memberOf mCore.util.math
     * @returns {number}
     */

    toFixed(value, numCount = 2) {
        if (value % 1 === 0) {
            return value;
        }
        if (numCount === 0) {
            return this.round(value);
        }
        let multiplier = 1;

        for (let i = 0; i < numCount; ++i) {
            multiplier *= 10;
        }

        return (value * multiplier << 0) / multiplier;
    },

    /**
     * @desc Returns random int in range
     * @function
     * @public
     * @param {int} max
     * @param {int} [min = 0]
     * @memberOf mCore.util.math
     * @return {int}
     */

    randInt: function(max, min = 0) {
        return this.floor(Math.random() * (max + 1 - min) + min);
    },

    /**
     * @desc Return random number.
     * @function
     * @public
     * @return {number}
     */

    random() {
        return Math.random();
    },

    /**
     * @desc Calculate fast sin with low precision.
     * @function
     * @param {number} angle
     * @memberOf mCore.util.math
     * @returns {number}
     */

    sin: function (angle) {
        const multCoef = angle < -this.PI ? 1 : angle > this.PI ? -1 : 0;

        angle += multCoef * 2 * this.PI;

        return this._sin(angle);
    },

    /**
     * @desc Calculate fast sin with low precision.
     * @function
     * @param {number} angle
     * @memberOf mCore.util.math
     * @returns {number}
     */

    cos: function (angle) {
        angle += this.PI * 0.5;

        if (angle > this.PI) {
            angle -= 2 * this.PI;
        }

        return this._sin(angle);
    },

    /**
     * @desc Returns max value of arguments.
     * @param {...number} var_args
     * @returns {number}
     * @memberOf mCore.util.math
     */

    max: function(var_args) {
        const elementCount = arguments.length;
        let result = arguments[0];
        let element, i;
        for (i = 0; i < elementCount; ++i) {
            element = arguments[i];
            if (element <= result) {
                continue;
            }
            result = element;
        }
        return result;
    },

    /**
     * @desc Returns min value of arguments.
     * @param {...number} var_args
     * @memberOf mCore.util.math
     * @returns {number}
     */

    min: function(var_args) {
        const elementCount = arguments.length;
        let result = arguments[0];
        let element, i;
        for (i = 0; i < elementCount; ++i) {
            element = arguments[i];
            if (element >= result) {
                continue;
            }
            result = element;
        }
        return result;
    },

    /**
     * @desc Returns square root of value.
     * @function
     * @public
     * @param {number} value
     * @return {number}
     */

    sqrt: function(value) {
        return Math.sqrt(value);
    },

    /**
     * @desc Convert degrees to radians
     * @function
     * @param {number} degrees
     * @memberOf mCore.util.math
     * @return {number}
     */

    toRadians: function(degrees) {
        return degrees * this.PI / this.HALF_CIRCLE;
    },

    /**
     * @desc Returns number in range between two bounds.
     * @function
     * @param {number} value
     * @param {number} leftBound
     * @param {number} rightBound
     * @memberOf mCore.util.math
     * @returns {number}
     */

    range: function(value, leftBound, rightBound) {
        return value < leftBound ? leftBound : value > rightBound ? rightBound : value;
    },

    /**
     * @desc Convert radians to degrees
     * @function
     * @param {number} radians
     * @param {boolean} [isRound = false] - Is need to round value.
     * @memberOf mCore.util.math
     * @return {number}
     */

    toDegrees: function (radians, isRound = false) {
        const result = radians * this.HALF_CIRCLE / this.PI;
        return isRound ? this.round(result) : result;
    },

    /**
     * @desc Convert float to percent
     * @function
     * @param {number} value - Value to convert.
     * @param {boolean} [isRound = false] - Is need to round value.
     * @memberOf mCore.util.math
     * @returns {number}
     */

    floatToPercent: function (value, isRound = false) {
        const result = value * this.MAX_PERCENT;
        return isRound ? this.round(result) : result;
    },

    /**
     * @desc Convert percent to float
     * @function
     * @param {number} value
     * @memberOf mCore.util.math
     * @returns {number}
     */

    percentToFloat: function (value) {
        return value * 0.01;
    },

    /**
     * @desc Convert frames to seconds.
     * @function
     * @param {number} value
     * @memberOf mCore.util.math
     * @return {number}
     */

    framesToSeconds: function (value) {
        return value / Macro.FPS;
    },

    /**
     * @desc Convert seconds to frames.
     * @function
     * @param {number} value
     * @memberOf mCore.util.math
     * @return {int}
     */

    secondsToFrames: function (value) {
        return this.ceil(value * Macro.FPS);
    },

    /**
     * @desc Generate unique id.
     * @function
     * @return {int}
     * @memberOf mCore.util.math
     */

    getUniqueId: function () {
        return this._idPool.length !== 0 ? this._idPool.shift() : ++this._id;
    },

    /**
     * @desc Save unique id for reuse. Call it only when object put in pool or destroy.
     * @function
     * @param {int} id
     */

    putUniqueId(id) {
        if (id === Constant.EMPTY_ID || this._idPool.indexOf(id) !== -1) {
            return;
        }
        this._idPool.push(id);
    },

    /**
     * @desc Fast calculate integer power
     * @function
     * @param {number} value
     * @param {int} power
     * @memberOf mCore.util.math
     */

    intPow: function(value, power) {
        let result = 1;
        const sign = this.sign(power);
        const count = power * sign;
        for (let i = 0; i < count; ++i) {
            result *= value;
        }
        return sign === 1 ? result : 1 / result;
    },

    /**
     * @desc Convert seconds to milliseconds.
     * @function
     * @param {number} seconds
     * @return {int}
     * @memberOf mCore.util.math
     */

    toMilliseconds(seconds) {
        return this.round(seconds / this.MILLI);
    },

    /**
     * @desc Convert milliseconds to seconds.
     * @function
     * @param {int} milliseconds
     * @return {number}
     * @memberOf mCore.util.math
     */

    toSeconds(milliseconds) {
        return milliseconds * this.MILLI;
    }
};

export default math;
