import Math from "./Math";

/**
 * @desc Namespace that contain function to manipulate with colors.
 * @namespace MANTICORE.util.color
 * @memberOf MANTICORE.util
 */

const color = {

    /**
     * @desc Enum with colors.
     * @public
     * @memberOf MANTICORE.util.color
     * @enum {int}
     * @readonly
     */

    COLORS: {
        BLACK: 0x000000,
        WHITE: 0xFFFFFF,
        RED: 0xFF0000,
        GREEN: 0x00FFFF,
        BLUE: 0x0000FF
    },

    /**
     * @desc Returns lightness of color.
     * @memberOf MANTICORE.util.color
     * @param {int} color
     * @returns {int}
     */

    getLightness(color) {
        return this.intToHsl(color)[2];
    },

    /**
     * @desc Set lightness of color and return new color.
     * @memberOf MANTICORE.util.color
     * @param {int} color - Color for change
     * @param {int} lightness - New lightness
     * @returns {int}
     */

    setLightness(color, lightness) {
        const hsl = this.intToHsl(color);
        hsl[2] = lightness;
        return this.hslToInt(hsl[0], hsl[1], hsl[2]);
    },

    /**
     * @desc Returns hue of color.
     * @memberOf MANTICORE.util.color
     * @param {int} color
     * @returns {int}
     */

    getHue(color) {
        return this.intToHsl(color)[0];
    },

    /**
     * @desc Set hue of color and return new color.
     * @memberOf MANTICORE.util.color
     * @param {int} color - Color for change
     * @param {int} hue - New lightness
     * @returns {int}
     */

    setHue(color, hue) {
        const hsl = this.intToHsl(color);
        hsl[0] = hue;
        return this.hslToInt(hsl[0], hsl[1], hsl[2]);
    },

    /**
     * @desc Returns saturation of color.
     * @memberOf MANTICORE.util.color
     * @param {int} color
     * @returns {int}
     */

    getSaturation(color) {
        return this.intToHsl(color)[1];
    },

    /**
     * @desc Set saturation of color and return new color.
     * @memberOf MANTICORE.util.color
     * @param {int} color - Color for change
     * @param {int} saturation - New lightness
     * @returns {int}
     */

    setSaturation(color, saturation) {
        const hsl = this.intToHsl(color);
        hsl[1] = saturation;
        return this.hslToInt(hsl[0], hsl[1], hsl[2]);
    },

    /**
     * @desc Calculate multiply of two colors.
     * @function
     * @public
     * @param {int} color1
     * @param {int} color2
     * @memberOf MANTICORE.util.color
     */

    multiply(color1, color2) {
        if (color1 === this.COLORS.WHITE) {
            return color2;
        }
        else if (color2 === this.COLORS.WHITE) {
            return color1;
        }
        const rgb1 = this.intToRgb(color1);
        const rgb2 = this.intToRgb(color2);
        const result = [];
        const rgbSize = rgb1.length;
        for (let i = 0; i < rgbSize; ++i) {
            result.push(Math.round((rgb1[i] * rgb2[i]) / Math.MAX_BYTE));
        }
        return this.rgbToInt(result[0], result[1], result[2]);
    },

    /**
     * @desc Method for manipulate with hue
     * @memberOf MANTICORE.util.color
     * @param {number} p
     * @param {number} q
     * @param {number} t
     * @returns {number}
     * @private
     */
    _hueToRgb: function (p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    },

    /**
     * @desc Convert int to RGB values.
     * @param {int} value
     * @memberOf MANTICORE.util.color
     * @returns {int[]}
     */

    intToRgb: function (value = 0) {
        const redCoef = 16;
        const greenCoef = 8;
        const red = Math.divPowTwo(value, redCoef);
        const redOffset = Math.multPowTwo(red, redCoef);
        const green = Math.divPowTwo(value - redOffset, greenCoef);
        const greenOffset = Math.multPowTwo(green, greenCoef);
        const blue = value - redOffset - greenOffset;

        return [red, green, blue];
    },

    /**
     * @desc Convert hex color to int color
     * @memberOf MANTICORE.util.color
     * @param {string} value
     * @return {number}
     */

    hexToInt(value) {
        return parseInt(value.replace("#", ""), 16);
    },

    /**
     * @desc Convert int color to hex.
     * @memberOf MANTICORE.util.color
     * @param {number} value
     * @return {string}
     */

    intToHex(value) {
        return "#" + value.toString(16);
    },

    /**s
     * @desc Convert int to Hls values.
     * @param {int} value
     * @memberOf MANTICORE.util.color
     * @returns {number[]}
     */

    intToHsl: function (value) {
        const rgb = this.intToRgb(value);
        return this.rgbToHsl(rgb[0], rgb[1], rgb[2]);
    },

    /**
     * @desc Convert HSL to int color.
     * @function
     * @public
     * @memberOf MANTICORE.util.color
     * @param {number} hue
     * @param {number} saturation
     * @param {number} lightness
     * @returns {int}
     */

    hslToInt: function (hue, saturation, lightness) {
        const rgb = this.hslToRgb(hue, saturation, lightness);
        return this.rgbToInt(rgb[0], rgb[1], rgb[2]);
    },

    /**
     * @desc Convert rgb to int
     * @memberOf MANTICORE.util.color
     * @param {int} red
     * @param {int} green
     * @param {int} blue
     * @returns {int}
     */

    rgbToInt: function (red, green, blue) {
        return (red << 16) + (green << 8) + blue;
    },

    /**
     * @desc Convert RGB to HSL. Need for change brightness, saturation and lightness of color.
     * @memberOf MANTICORE.util.color
     * @param {int} red
     * @param {int} green
     * @param {int} blue
     * @returns {int[]}
     */

    rgbToHsl: function (red, green, blue) {

        red /= Math.MAX_BYTE;
        green /= Math.MAX_BYTE;
        blue /= Math.MAX_BYTE;

        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        const sum = max + min;
        let hue, saturation, lightness = (max + min) / 2;

        if (max === min) {
            hue = saturation = 0;
        }
        else {
            const dif = max - min;
            saturation = lightness > 0.5 ? dif / (2 - sum) : dif / sum;
            switch (max) {
                case red: {
                    hue = (green - blue) / dif + (green < blue ? 6 : 0);
                    break;
                }
                case green: {
                    hue = (blue - red) / dif + 2;
                    break;
                }
                case blue: {
                    hue = (red - green) / dif + 4;
                    break;
                }
            }
            hue /= 6;
        }

        return [
            Math.floatToPercent(hue, true),
            Math.floatToPercent(saturation, true),
            Math.floatToPercent(lightness, true)
        ];
    },

    /**
     * @desc Convert HSL to RGB.
     * @function
     * @public
     * @memberOf MANTICORE.util.color
     * @param {number} hue
     * @param {number} saturation
     * @param {number} lightness
     * @returns {int[]}
     */

    hslToRgb: function (hue, saturation, lightness) {
        let red, green, blue;

        hue = Math.percentToFloat(hue);
        saturation = Math.percentToFloat(saturation);
        lightness = Math.percentToFloat(lightness);

        if (saturation === 0) {
            red = green = blue = lightness;
        }
        else {
            const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
            const p = 2 * lightness - q;
            red = this._hueToRgb(p, q, hue + 1 / 3);
            green = this._hueToRgb(p, q, hue);
            blue = this._hueToRgb(p, q, hue - 1 / 3);
        }

        return [
            Math.floor(red * Math.MAX_BYTE),
            Math.floor(green * Math.MAX_BYTE),
            Math.floor(blue * Math.MAX_BYTE)
        ];
    }
};

export default color;
