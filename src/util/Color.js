import Math from "./Math";

/**
 * @desc Namespace that contain function to manipulate with colors.
 * @namespace color
 * @memberOf MANTICORE.util
 */

export default {

    /**
     * @desc Enum with colors.
     * @public
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
     * @param {int} color
     * @returns {int}
     */

    getLightness(color) {
        return this.intToHsl(color)[2];
    },

    /**
     * @desc Set lightness of color and return new color.
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
     * @param {int} color
     * @returns {int}
     */

    getHue(color) {
        return this.intToHsl(color)[0];
    },

    /**
     * @desc Set hue of color and return new color.
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
     * @param {int} color
     * @returns {int}
     */

    getSaturation(color) {
        return this.intToHsl(color)[1];
    },

    /**
     * @desc Set saturation of color and return new color.
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
     * @desc Method for manipulate with hue
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
     * @returns {int[]}
     */

    intToRgb: function (value) {
        const redCoef = 16;
        const greenCoef = 8;
        const red = Math.divPowTwo(value, redCoef);
        const redOffset = Math.multPowTwo(red, redCoef);
        const green = Math.divPowTwo(value - redOffset, greenCoef);
        const greenOffset = Math.multPowTwo(green, greenCoef);
        const blue = value - redOffset - greenOffset;

        return [red, green, blue];
    },

    /**s
     * @desc Convert int to Hls values.
     * @param {int} value
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
}