import Repository from "repository/Repository";
import Math from "util/Math";
import Type from "util/Type";
import Rectangle from "geometry/Rectangle";
import Constant from "constant";

/**
 * @desc Namespace for manipulate with fonts.
 * @namespace fontCache
 * @memberOf MANTICORE.cache
 */

export default {
    /**
     * @desc Repository that contain font sizes, for set correct size.
     * @type {MANTICORE.repository.Repository}
     * @private
     */
    _fontSizes: new Repository(),

    /**
     * @desc Array with font names.
     * @type {string[]}
     * @private
     */
    _fonts: [],

    /**
     * @desc Add empty font to cache.
     * @function
     * @public
     * @param {Function} callback
     */

    createEmptyFont(callback) {
        const baseImage = new Image();
        const fontData = {
            "size": 28,
            "spacing": 0,
            "lineHeight": 31,
            "base": 0,
            "chars": [
            {
                "id": 33,
                "page": 0,
                "dimensions": [
                    36,
                    217,
                    5,
                    22
                ],
                "offset": 0,
                "ax": 8
            },
            {
                "id": 34,
                "page": 0,
                "dimensions": [
                    22,
                    244,
                    10,
                    9
                ],
                "offset": 1,
                "ax": 10
            },
            {
                "id": 35,
                "page": 0,
                "dimensions": [
                    161,
                    209,
                    17,
                    23
                ],
                "offset": 2,
                "ax": 16
            },
            {
                "id": 36,
                "page": 0,
                "dimensions": [
                    103,
                    51,
                    16,
                    27
                ],
                "offset": 3,
                "ax": 16
            },
            {
                "id": 37,
                "page": 0,
                "dimensions": [
                    57,
                    80,
                    24,
                    23
                ],
                "offset": 0,
                "ax": 25
            },
            {
                "id": 38,
                "page": 0,
                "dimensions": [
                    144,
                    186,
                    19,
                    23
                ],
                "offset": 1,
                "ax": 19
            },
            {
                "id": 39,
                "page": 0,
                "dimensions": [
                    119,
                    116,
                    5,
                    9
                ],
                "offset": 1,
                "ax": 5
            },
            {
                "id": 40,
                "page": 0,
                "dimensions": [
                    21,
                    53,
                    9,
                    29
                ],
                "offset": 0,
                "ax": 9
            },
            {
                "id": 41,
                "page": 0,
                "dimensions": [
                    30,
                    75,
                    9,
                    29
                ],
                "offset": 0,
                "ax": 9
            },
            {
                "id": 42,
                "page": 0,
                "dimensions": [
                    86,
                    41,
                    11,
                    11
                ],
                "offset": 1,
                "ax": 11
            },
            {
                "id": 43,
                "page": 0,
                "dimensions": [
                    36,
                    239,
                    16,
                    16
                ],
                "offset": 4,
                "ax": 16
            },
            {
                "id": 44,
                "page": 0,
                "dimensions": [
                    17,
                    243,
                    5,
                    9
                ],
                "offset": 5,
                "ax": 8
            },
            {
                "id": 45,
                "page": 0,
                "dimensions": [
                    38,
                    104,
                    10,
                    5
                ],
                "offset": 6,
                "ax": 9
            },
            {
                "id": 46,
                "page": 0,
                "dimensions": [
                    62,
                    103,
                    5,
                    5
                ],
                "offset": 7,
                "ax": 8
            },
            {
                "id": 47,
                "page": 0,
                "dimensions": [
                    227,
                    63,
                    10,
                    23
                ],
                "offset": 2,
                "ax": 8
            },
            {
                "id": 48,
                "page": 0,
                "dimensions": [
                    212,
                    109,
                    15,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 49,
                "page": 0,
                "dimensions": [
                    242,
                    40,
                    10,
                    22
                ],
                "offset": 8,
                "ax": 16
            },
            {
                "id": 50,
                "page": 0,
                "dimensions": [
                    215,
                    1,
                    16,
                    22
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 51,
                "page": 0,
                "dimensions": [
                    210,
                    157,
                    15,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 52,
                "page": 0,
                "dimensions": [
                    211,
                    65,
                    16,
                    22
                ],
                "offset": 2,
                "ax": 16
            },
            {
                "id": 53,
                "page": 0,
                "dimensions": [
                    226,
                    41,
                    16,
                    22
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 54,
                "page": 0,
                "dimensions": [
                    194,
                    157,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 55,
                "page": 0,
                "dimensions": [
                    224,
                    180,
                    15,
                    22
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 56,
                "page": 0,
                "dimensions": [
                    196,
                    111,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 57,
                "page": 0,
                "dimensions": [
                    195,
                    134,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 58,
                "page": 0,
                "dimensions": [
                    114,
                    229,
                    5,
                    17
                ],
                "offset": 9,
                "ax": 8
            },
            {
                "id": 59,
                "page": 0,
                "dimensions": [
                    115,
                    203,
                    5,
                    21
                ],
                "offset": 10,
                "ax": 8
            },
            {
                "id": 60,
                "page": 0,
                "dimensions": [
                    231,
                    24,
                    16,
                    16
                ],
                "offset": 11,
                "ax": 16
            },
            {
                "id": 61,
                "page": 0,
                "dimensions": [
                    70,
                    41,
                    16,
                    11
                ],
                "offset": 10,
                "ax": 16
            },
            {
                "id": 62,
                "page": 0,
                "dimensions": [
                    194,
                    203,
                    16,
                    16
                ],
                "offset": 11,
                "ax": 16
            },
            {
                "id": 63,
                "page": 0,
                "dimensions": [
                    210,
                    203,
                    15,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 64,
                "page": 0,
                "dimensions": [
                    1,
                    1,
                    28,
                    29
                ],
                "offset": 0,
                "ax": 28
            },
            {
                "id": 65,
                "page": 0,
                "dimensions": [
                    140,
                    89,
                    21,
                    22
                ],
                "offset": 2,
                "ax": 19
            },
            {
                "id": 66,
                "page": 0,
                "dimensions": [
                    119,
                    231,
                    17,
                    22
                ],
                "offset": 0,
                "ax": 19
            },
            {
                "id": 67,
                "page": 0,
                "dimensions": [
                    95,
                    206,
                    20,
                    23
                ],
                "offset": 1,
                "ax": 20
            },
            {
                "id": 68,
                "page": 0,
                "dimensions": [
                    95,
                    229,
                    19,
                    22
                ],
                "offset": 0,
                "ax": 20
            },
            {
                "id": 69,
                "page": 0,
                "dimensions": [
                    136,
                    231,
                    17,
                    22
                ],
                "offset": 0,
                "ax": 19
            },
            {
                "id": 70,
                "page": 0,
                "dimensions": [
                    211,
                    87,
                    16,
                    22
                ],
                "offset": 0,
                "ax": 17
            },
            {
                "id": 71,
                "page": 0,
                "dimensions": [
                    140,
                    44,
                    21,
                    23
                ],
                "offset": 1,
                "ax": 22
            },
            {
                "id": 72,
                "page": 0,
                "dimensions": [
                    161,
                    67,
                    18,
                    22
                ],
                "offset": 0,
                "ax": 20
            },
            {
                "id": 73,
                "page": 0,
                "dimensions": [
                    71,
                    197,
                    5,
                    22
                ],
                "offset": 8,
                "ax": 8
            },
            {
                "id": 74,
                "page": 0,
                "dimensions": [
                    240,
                    150,
                    13,
                    23
                ],
                "offset": 1,
                "ax": 14
            },
            {
                "id": 75,
                "page": 0,
                "dimensions": [
                    145,
                    111,
                    19,
                    22
                ],
                "offset": 0,
                "ax": 19
            },
            {
                "id": 76,
                "page": 0,
                "dimensions": [
                    225,
                    157,
                    15,
                    22
                ],
                "offset": 0,
                "ax": 16
            },
            {
                "id": 77,
                "page": 0,
                "dimensions": [
                    124,
                    142,
                    21,
                    22
                ],
                "offset": 0,
                "ax": 23
            },
            {
                "id": 78,
                "page": 0,
                "dimensions": [
                    161,
                    89,
                    18,
                    22
                ],
                "offset": 0,
                "ax": 20
            },
            {
                "id": 79,
                "page": 0,
                "dimensions": [
                    102,
                    129,
                    22,
                    23
                ],
                "offset": 1,
                "ax": 22
            },
            {
                "id": 80,
                "page": 0,
                "dimensions": [
                    145,
                    133,
                    18,
                    22
                ],
                "offset": 0,
                "ax": 19
            },
            {
                "id": 81,
                "page": 0,
                "dimensions": [
                    80,
                    129,
                    22,
                    24
                ],
                "offset": 1,
                "ax": 22
            },
            {
                "id": 82,
                "page": 0,
                "dimensions": [
                    61,
                    219,
                    20,
                    22
                ],
                "offset": 0,
                "ax": 20
            },
            {
                "id": 83,
                "page": 0,
                "dimensions": [
                    120,
                    208,
                    18,
                    23
                ],
                "offset": 1,
                "ax": 19
            },
            {
                "id": 84,
                "page": 0,
                "dimensions": [
                    145,
                    155,
                    18,
                    22
                ],
                "offset": 1,
                "ax": 17
            },
            {
                "id": 85,
                "page": 0,
                "dimensions": [
                    161,
                    44,
                    18,
                    23
                ],
                "offset": 0,
                "ax": 20
            },
            {
                "id": 86,
                "page": 0,
                "dimensions": [
                    1,
                    221,
                    21,
                    22
                ],
                "offset": 2,
                "ax": 19
            },
            {
                "id": 87,
                "page": 0,
                "dimensions": [
                    58,
                    1,
                    28,
                    22
                ],
                "offset": 2,
                "ax": 26
            },
            {
                "id": 88,
                "page": 0,
                "dimensions": [
                    124,
                    164,
                    21,
                    22
                ],
                "offset": 2,
                "ax": 19
            },
            {
                "id": 89,
                "page": 0,
                "dimensions": [
                    123,
                    186,
                    21,
                    22
                ],
                "offset": 2,
                "ax": 19
            },
            {
                "id": 90,
                "page": 0,
                "dimensions": [
                    143,
                    209,
                    18,
                    22
                ],
                "offset": 1,
                "ax": 17
            },
            {
                "id": 91,
                "page": 0,
                "dimensions": [
                    56,
                    137,
                    8,
                    28
                ],
                "offset": 0,
                "ax": 8
            },
            {
                "id": 93,
                "page": 0,
                "dimensions": [
                    64,
                    137,
                    8,
                    28
                ],
                "offset": 1,
                "ax": 8
            },
            {
                "id": 94,
                "page": 0,
                "dimensions": [
                    194,
                    242,
                    14,
                    13
                ],
                "offset": 1,
                "ax": 13
            },
            {
                "id": 95,
                "page": 0,
                "dimensions": [
                    86,
                    19,
                    19,
                    4
                ],
                "offset": 12,
                "ax": 16
            },
            {
                "id": 96,
                "page": 0,
                "dimensions": [
                    55,
                    103,
                    7,
                    6
                ],
                "offset": 1,
                "ax": 9
            },
            {
                "id": 97,
                "page": 0,
                "dimensions": [
                    215,
                    23,
                    16,
                    18
                ],
                "offset": 13,
                "ax": 16
            },
            {
                "id": 98,
                "page": 0,
                "dimensions": [
                    194,
                    219,
                    15,
                    23
                ],
                "offset": 0,
                "ax": 16
            },
            {
                "id": 99,
                "page": 0,
                "dimensions": [
                    226,
                    132,
                    15,
                    18
                ],
                "offset": 13,
                "ax": 14
            },
            {
                "id": 100,
                "page": 0,
                "dimensions": [
                    163,
                    157,
                    15,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 101,
                "page": 0,
                "dimensions": [
                    180,
                    24,
                    16,
                    18
                ],
                "offset": 13,
                "ax": 16
            },
            {
                "id": 102,
                "page": 0,
                "dimensions": [
                    112,
                    180,
                    11,
                    23
                ],
                "offset": 2,
                "ax": 8
            },
            {
                "id": 103,
                "page": 0,
                "dimensions": [
                    163,
                    180,
                    15,
                    23
                ],
                "offset": 13,
                "ax": 16
            },
            {
                "id": 104,
                "page": 0,
                "dimensions": [
                    239,
                    202,
                    14,
                    22
                ],
                "offset": 0,
                "ax": 16
            },
            {
                "id": 105,
                "page": 0,
                "dimensions": [
                    75,
                    103,
                    5,
                    22
                ],
                "offset": 0,
                "ax": 6
            },
            {
                "id": 106,
                "page": 0,
                "dimensions": [
                    48,
                    137,
                    8,
                    28
                ],
                "offset": 14,
                "ax": 6
            },
            {
                "id": 107,
                "page": 0,
                "dimensions": [
                    227,
                    86,
                    14,
                    22
                ],
                "offset": 0,
                "ax": 14
            },
            {
                "id": 108,
                "page": 0,
                "dimensions": [
                    75,
                    125,
                    5,
                    22
                ],
                "offset": 0,
                "ax": 6
            },
            {
                "id": 109,
                "page": 0,
                "dimensions": [
                    111,
                    1,
                    22,
                    17
                ],
                "offset": 15,
                "ax": 23
            },
            {
                "id": 110,
                "page": 0,
                "dimensions": [
                    241,
                    85,
                    14,
                    17
                ],
                "offset": 15,
                "ax": 16
            },
            {
                "id": 111,
                "page": 0,
                "dimensions": [
                    196,
                    24,
                    16,
                    18
                ],
                "offset": 13,
                "ax": 16
            },
            {
                "id": 112,
                "page": 0,
                "dimensions": [
                    211,
                    42,
                    15,
                    23
                ],
                "offset": 15,
                "ax": 16
            },
            {
                "id": 113,
                "page": 0,
                "dimensions": [
                    231,
                    1,
                    15,
                    23
                ],
                "offset": 13,
                "ax": 16
            },
            {
                "id": 114,
                "page": 0,
                "dimensions": [
                    241,
                    119,
                    10,
                    17
                ],
                "offset": 15,
                "ax": 9
            },
            {
                "id": 115,
                "page": 0,
                "dimensions": [
                    227,
                    108,
                    14,
                    18
                ],
                "offset": 13,
                "ax": 14
            },
            {
                "id": 116,
                "page": 0,
                "dimensions": [
                    169,
                    232,
                    9,
                    22
                ],
                "offset": 16,
                "ax": 8
            },
            {
                "id": 117,
                "page": 0,
                "dimensions": [
                    241,
                    102,
                    14,
                    17
                ],
                "offset": 10,
                "ax": 16
            },
            {
                "id": 118,
                "page": 0,
                "dimensions": [
                    133,
                    1,
                    16,
                    17
                ],
                "offset": 17,
                "ax": 14
            },
            {
                "id": 119,
                "page": 0,
                "dimensions": [
                    121,
                    18,
                    22,
                    17
                ],
                "offset": 17,
                "ax": 20
            },
            {
                "id": 120,
                "page": 0,
                "dimensions": [
                    149,
                    1,
                    16,
                    17
                ],
                "offset": 17,
                "ax": 14
            },
            {
                "id": 121,
                "page": 0,
                "dimensions": [
                    103,
                    105,
                    16,
                    23
                ],
                "offset": 17,
                "ax": 14
            },
            {
                "id": 122,
                "page": 0,
                "dimensions": [
                    225,
                    225,
                    15,
                    17
                ],
                "offset": 18,
                "ax": 14
            },
            {
                "id": 123,
                "page": 0,
                "dimensions": [
                    1,
                    53,
                    10,
                    29
                ],
                "offset": 1,
                "ax": 9
            },
            {
                "id": 124,
                "page": 0,
                "dimensions": [
                    1,
                    82,
                    4,
                    29
                ],
                "offset": 8,
                "ax": 7
            },
            {
                "id": 125,
                "page": 0,
                "dimensions": [
                    11,
                    53,
                    10,
                    29
                ],
                "offset": 1,
                "ax": 9
            },
            {
                "id": 126,
                "page": 0,
                "dimensions": [
                    1,
                    243,
                    16,
                    7
                ],
                "offset": 19,
                "ax": 16
            },
            {
                "id": 8218,
                "page": 0,
                "dimensions": [
                    138,
                    217,
                    5,
                    9
                ],
                "offset": 20,
                "ax": 6
            },
            {
                "id": 402,
                "page": 0,
                "dimensions": [
                    53,
                    23,
                    17,
                    29
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 8222,
                "page": 0,
                "dimensions": [
                    76,
                    207,
                    9,
                    9
                ],
                "offset": 20,
                "ax": 9
            },
            {
                "id": 8230,
                "page": 0,
                "dimensions": [
                    29,
                    23,
                    24,
                    5
                ],
                "offset": 7,
                "ax": 28
            },
            {
                "id": 710,
                "page": 0,
                "dimensions": [
                    27,
                    104,
                    11,
                    6
                ],
                "offset": 2,
                "ax": 9
            },
            {
                "id": 8240,
                "page": 0,
                "dimensions": [
                    1,
                    30,
                    29,
                    23
                ],
                "offset": 1,
                "ax": 28
            },
            {
                "id": 352,
                "page": 0,
                "dimensions": [
                    57,
                    109,
                    18,
                    28
                ],
                "offset": 21,
                "ax": 19
            },
            {
                "id": 8249,
                "page": 0,
                "dimensions": [
                    52,
                    239,
                    9,
                    15
                ],
                "offset": 22,
                "ax": 9
            },
            {
                "id": 338,
                "page": 0,
                "dimensions": [
                    30,
                    52,
                    28,
                    23
                ],
                "offset": 0,
                "ax": 28
            },
            {
                "id": 381,
                "page": 0,
                "dimensions": [
                    1,
                    194,
                    18,
                    27
                ],
                "offset": 21,
                "ax": 17
            },
            {
                "id": 8216,
                "page": 0,
                "dimensions": [
                    138,
                    208,
                    5,
                    9
                ],
                "offset": 0,
                "ax": 6
            },
            {
                "id": 8217,
                "page": 0,
                "dimensions": [
                    138,
                    217,
                    5,
                    9
                ],
                "offset": 1,
                "ax": 6
            },
            {
                "id": 353,
                "page": 0,
                "dimensions": [
                    239,
                    179,
                    14,
                    23
                ],
                "offset": 1,
                "ax": 14
            },
            {
                "id": 8250,
                "page": 0,
                "dimensions": [
                    246,
                    1,
                    9,
                    15
                ],
                "offset": 22,
                "ax": 9
            },
            {
                "id": 339,
                "page": 0,
                "dimensions": [
                    70,
                    23,
                    27,
                    18
                ],
                "offset": 13,
                "ax": 26
            },
            {
                "id": 382,
                "page": 0,
                "dimensions": [
                    211,
                    134,
                    15,
                    23
                ],
                "offset": 1,
                "ax": 14
            },
            {
                "id": 376,
                "page": 0,
                "dimensions": [
                    143,
                    18,
                    21,
                    26
                ],
                "offset": 23,
                "ax": 19
            },
            {
                "id": 32,
                "page": 0,
                "dimensions": [
                    5,
                    21,
                    0,
                    0
                ],
                "offset": 24,
                "ax": 8
            },
            {
                "id": 161,
                "page": 0,
                "dimensions": [
                    114,
                    78,
                    5,
                    22
                ],
                "offset": 9,
                "ax": 9
            },
            {
                "id": 168,
                "page": 0,
                "dimensions": [
                    111,
                    18,
                    10,
                    5
                ],
                "offset": 1,
                "ax": 9
            },
            {
                "id": 173,
                "page": 0,
                "dimensions": [
                    38,
                    104,
                    10,
                    5
                ],
                "offset": 6,
                "ax": 9
            },
            {
                "id": 174,
                "page": 0,
                "dimensions": [
                    80,
                    52,
                    23,
                    23
                ],
                "offset": 2,
                "ax": 21
            },
            {
                "id": 177,
                "page": 0,
                "dimensions": [
                    41,
                    220,
                    16,
                    19
                ],
                "offset": 25,
                "ax": 15
            },
            {
                "id": 180,
                "page": 0,
                "dimensions": [
                    48,
                    103,
                    7,
                    6
                ],
                "offset": 8,
                "ax": 9
            },
            {
                "id": 183,
                "page": 0,
                "dimensions": [
                    62,
                    103,
                    5,
                    5
                ],
                "offset": 26,
                "ax": 8
            },
            {
                "id": 184,
                "page": 0,
                "dimensions": [
                    85,
                    207,
                    8,
                    8
                ],
                "offset": 27,
                "ax": 9
            },
            {
                "id": 187,
                "page": 0,
                "dimensions": [
                    81,
                    239,
                    14,
                    15
                ],
                "offset": 28,
                "ax": 16
            },
            {
                "id": 191,
                "page": 0,
                "dimensions": [
                    194,
                    180,
                    15,
                    23
                ],
                "offset": 10,
                "ax": 17
            },
            {
                "id": 192,
                "page": 0,
                "dimensions": [
                    1,
                    167,
                    21,
                    27
                ],
                "offset": 29,
                "ax": 19
            },
            {
                "id": 193,
                "page": 0,
                "dimensions": [
                    22,
                    167,
                    21,
                    27
                ],
                "offset": 29,
                "ax": 19
            },
            {
                "id": 194,
                "page": 0,
                "dimensions": [
                    43,
                    166,
                    21,
                    27
                ],
                "offset": 29,
                "ax": 19
            },
            {
                "id": 195,
                "page": 0,
                "dimensions": [
                    119,
                    35,
                    21,
                    27
                ],
                "offset": 23,
                "ax": 19
            },
            {
                "id": 196,
                "page": 0,
                "dimensions": [
                    124,
                    116,
                    21,
                    26
                ],
                "offset": 23,
                "ax": 19
            },
            {
                "id": 197,
                "page": 0,
                "dimensions": [
                    119,
                    62,
                    21,
                    27
                ],
                "offset": 23,
                "ax": 19
            },
            {
                "id": 198,
                "page": 0,
                "dimensions": [
                    29,
                    1,
                    29,
                    22
                ],
                "offset": 2,
                "ax": 28
            },
            {
                "id": 199,
                "page": 0,
                "dimensions": [
                    1,
                    111,
                    20,
                    28
                ],
                "offset": 1,
                "ax": 20
            },
            {
                "id": 200,
                "page": 0,
                "dimensions": [
                    19,
                    194,
                    17,
                    27
                ],
                "offset": 30,
                "ax": 19
            },
            {
                "id": 201,
                "page": 0,
                "dimensions": [
                    97,
                    153,
                    17,
                    27
                ],
                "offset": 30,
                "ax": 19
            },
            {
                "id": 202,
                "page": 0,
                "dimensions": [
                    78,
                    180,
                    17,
                    27
                ],
                "offset": 30,
                "ax": 19
            },
            {
                "id": 203,
                "page": 0,
                "dimensions": [
                    95,
                    180,
                    17,
                    26
                ],
                "offset": 31,
                "ax": 19
            },
            {
                "id": 204,
                "page": 0,
                "dimensions": [
                    72,
                    147,
                    7,
                    27
                ],
                "offset": 21,
                "ax": 8
            },
            {
                "id": 205,
                "page": 0,
                "dimensions": [
                    64,
                    165,
                    7,
                    27
                ],
                "offset": 30,
                "ax": 8
            },
            {
                "id": 206,
                "page": 0,
                "dimensions": [
                    103,
                    78,
                    11,
                    27
                ],
                "offset": 29,
                "ax": 8
            },
            {
                "id": 207,
                "page": 0,
                "dimensions": [
                    61,
                    193,
                    10,
                    26
                ],
                "offset": 23,
                "ax": 8
            },
            {
                "id": 208,
                "page": 0,
                "dimensions": [
                    140,
                    67,
                    21,
                    22
                ],
                "offset": 2,
                "ax": 20
            },
            {
                "id": 209,
                "page": 0,
                "dimensions": [
                    79,
                    153,
                    18,
                    27
                ],
                "offset": 31,
                "ax": 20
            },
            {
                "id": 210,
                "page": 0,
                "dimensions": [
                    58,
                    52,
                    22,
                    28
                ],
                "offset": 21,
                "ax": 22
            },
            {
                "id": 211,
                "page": 0,
                "dimensions": [
                    5,
                    82,
                    22,
                    28
                ],
                "offset": 21,
                "ax": 22
            },
            {
                "id": 212,
                "page": 0,
                "dimensions": [
                    97,
                    23,
                    22,
                    28
                ],
                "offset": 21,
                "ax": 22
            },
            {
                "id": 213,
                "page": 0,
                "dimensions": [
                    81,
                    75,
                    22,
                    27
                ],
                "offset": 32,
                "ax": 22
            },
            {
                "id": 214,
                "page": 0,
                "dimensions": [
                    81,
                    102,
                    22,
                    27
                ],
                "offset": 32,
                "ax": 22
            },
            {
                "id": 215,
                "page": 0,
                "dimensions": [
                    241,
                    136,
                    14,
                    14
                ],
                "offset": 4,
                "ax": 16
            },
            {
                "id": 216,
                "page": 0,
                "dimensions": [
                    30,
                    28,
                    22,
                    24
                ],
                "offset": 33,
                "ax": 22
            },
            {
                "id": 217,
                "page": 0,
                "dimensions": [
                    39,
                    75,
                    18,
                    28
                ],
                "offset": 30,
                "ax": 20
            },
            {
                "id": 218,
                "page": 0,
                "dimensions": [
                    21,
                    110,
                    18,
                    28
                ],
                "offset": 30,
                "ax": 20
            },
            {
                "id": 219,
                "page": 0,
                "dimensions": [
                    39,
                    109,
                    18,
                    28
                ],
                "offset": 30,
                "ax": 20
            },
            {
                "id": 220,
                "page": 0,
                "dimensions": [
                    43,
                    193,
                    18,
                    27
                ],
                "offset": 31,
                "ax": 20
            },
            {
                "id": 221,
                "page": 0,
                "dimensions": [
                    119,
                    89,
                    21,
                    27
                ],
                "offset": 29,
                "ax": 19
            },
            {
                "id": 222,
                "page": 0,
                "dimensions": [
                    165,
                    1,
                    18,
                    22
                ],
                "offset": 0,
                "ax": 19
            },
            {
                "id": 223,
                "page": 0,
                "dimensions": [
                    164,
                    111,
                    16,
                    23
                ],
                "offset": 0,
                "ax": 17
            },
            {
                "id": 224,
                "page": 0,
                "dimensions": [
                    179,
                    42,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 225,
                "page": 0,
                "dimensions": [
                    183,
                    1,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 226,
                "page": 0,
                "dimensions": [
                    179,
                    65,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 227,
                "page": 0,
                "dimensions": [
                    179,
                    88,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 228,
                "page": 0,
                "dimensions": [
                    163,
                    134,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 229,
                "page": 0,
                "dimensions": [
                    178,
                    157,
                    16,
                    23
                ],
                "offset": 33,
                "ax": 16
            },
            {
                "id": 230,
                "page": 0,
                "dimensions": [
                    86,
                    1,
                    25,
                    18
                ],
                "offset": 13,
                "ax": 25
            },
            {
                "id": 231,
                "page": 0,
                "dimensions": [
                    209,
                    180,
                    15,
                    23
                ],
                "offset": 13,
                "ax": 14
            },
            {
                "id": 232,
                "page": 0,
                "dimensions": [
                    180,
                    111,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 233,
                "page": 0,
                "dimensions": [
                    195,
                    42,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 234,
                "page": 0,
                "dimensions": [
                    199,
                    1,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 235,
                "page": 0,
                "dimensions": [
                    195,
                    65,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 236,
                "page": 0,
                "dimensions": [
                    71,
                    174,
                    7,
                    23
                ],
                "offset": 2,
                "ax": 8
            },
            {
                "id": 237,
                "page": 0,
                "dimensions": [
                    36,
                    194,
                    7,
                    23
                ],
                "offset": 8,
                "ax": 8
            },
            {
                "id": 238,
                "page": 0,
                "dimensions": [
                    240,
                    224,
                    11,
                    23
                ],
                "offset": 2,
                "ax": 8
            },
            {
                "id": 239,
                "page": 0,
                "dimensions": [
                    114,
                    152,
                    10,
                    23
                ],
                "offset": 2,
                "ax": 8
            },
            {
                "id": 240,
                "page": 0,
                "dimensions": [
                    195,
                    88,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 241,
                "page": 0,
                "dimensions": [
                    237,
                    63,
                    14,
                    22
                ],
                "offset": 0,
                "ax": 16
            },
            {
                "id": 242,
                "page": 0,
                "dimensions": [
                    179,
                    134,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 243,
                "page": 0,
                "dimensions": [
                    178,
                    180,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 244,
                "page": 0,
                "dimensions": [
                    178,
                    203,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 245,
                "page": 0,
                "dimensions": [
                    178,
                    226,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 246,
                "page": 0,
                "dimensions": [
                    153,
                    232,
                    16,
                    23
                ],
                "offset": 1,
                "ax": 16
            },
            {
                "id": 247,
                "page": 0,
                "dimensions": [
                    61,
                    241,
                    16,
                    13
                ],
                "offset": 13,
                "ax": 15
            },
            {
                "id": 248,
                "page": 0,
                "dimensions": [
                    164,
                    23,
                    16,
                    19
                ],
                "offset": 15,
                "ax": 17
            },
            {
                "id": 249,
                "page": 0,
                "dimensions": [
                    22,
                    221,
                    14,
                    23
                ],
                "offset": 0,
                "ax": 16
            },
            {
                "id": 250,
                "page": 0,
                "dimensions": [
                    81,
                    216,
                    14,
                    23
                ],
                "offset": 0,
                "ax": 16
            },
            {
                "id": 251,
                "page": 0,
                "dimensions": [
                    225,
                    202,
                    14,
                    23
                ],
                "offset": 0,
                "ax": 16
            },
            {
                "id": 252,
                "page": 0,
                "dimensions": [
                    209,
                    226,
                    14,
                    23
                ],
                "offset": 0,
                "ax": 16
            },
            {
                "id": 253,
                "page": 0,
                "dimensions": [
                    1,
                    139,
                    16,
                    28
                ],
                "offset": 2,
                "ax": 14
            },
            {
                "id": 254,
                "page": 0,
                "dimensions": [
                    33,
                    138,
                    15,
                    28
                ],
                "offset": 0,
                "ax": 16
            },
            {
                "id": 255,
                "page": 0,
                "dimensions": [
                    17,
                    139,
                    16,
                    28
                ],
                "offset": 2,
                "ax": 14
            },
            {
                "id": 32,
                "page": 0,
                "dimensions": [
                    0,
                    0,
                    0,
                    0
                ],
                "offset": 2,
                "ax": 8
            }
        ],
            "kerning": [
            [
                32,
                65,
                -2
            ],
            [
                32,
                84,
                -1
            ],
            [
                32,
                89,
                -1
            ],
            [
                49,
                49,
                -2
            ],
            [
                65,
                32,
                -2
            ],
            [
                65,
                84,
                -2
            ],
            [
                65,
                86,
                -2
            ],
            [
                65,
                87,
                -1
            ],
            [
                65,
                89,
                -2
            ],
            [
                65,
                118,
                -1
            ],
            [
                65,
                119,
                -1
            ],
            [
                65,
                121,
                -1
            ],
            [
                65,
                8217,
                -2
            ],
            [
                70,
                44,
                -3
            ],
            [
                70,
                46,
                -3
            ],
            [
                70,
                65,
                -2
            ],
            [
                76,
                32,
                -1
            ],
            [
                76,
                84,
                -2
            ],
            [
                76,
                86,
                -2
            ],
            [
                76,
                87,
                -2
            ],
            [
                76,
                89,
                -2
            ],
            [
                76,
                121,
                -1
            ],
            [
                76,
                8217,
                -2
            ],
            [
                80,
                32,
                -1
            ],
            [
                80,
                44,
                -4
            ],
            [
                80,
                46,
                -4
            ],
            [
                80,
                65,
                -2
            ],
            [
                82,
                84,
                -1
            ],
            [
                82,
                86,
                -1
            ],
            [
                82,
                87,
                -1
            ],
            [
                82,
                89,
                -1
            ],
            [
                84,
                32,
                -1
            ],
            [
                84,
                44,
                -3
            ],
            [
                84,
                173,
                -2
            ],
            [
                84,
                46,
                -3
            ],
            [
                84,
                58,
                -3
            ],
            [
                84,
                59,
                -3
            ],
            [
                84,
                65,
                -2
            ],
            [
                84,
                79,
                -1
            ],
            [
                84,
                97,
                -3
            ],
            [
                84,
                99,
                -3
            ],
            [
                84,
                101,
                -3
            ],
            [
                84,
                105,
                -1
            ],
            [
                84,
                111,
                -3
            ],
            [
                84,
                114,
                -1
            ],
            [
                84,
                115,
                -3
            ],
            [
                84,
                117,
                -1
            ],
            [
                84,
                119,
                -2
            ],
            [
                84,
                121,
                -2
            ],
            [
                86,
                44,
                -3
            ],
            [
                86,
                173,
                -2
            ],
            [
                86,
                46,
                -3
            ],
            [
                86,
                58,
                -1
            ],
            [
                86,
                59,
                -1
            ],
            [
                86,
                65,
                -2
            ],
            [
                86,
                97,
                -2
            ],
            [
                86,
                101,
                -2
            ],
            [
                86,
                105,
                -1
            ],
            [
                86,
                111,
                -2
            ],
            [
                86,
                114,
                -1
            ],
            [
                86,
                117,
                -1
            ],
            [
                86,
                121,
                -1
            ],
            [
                87,
                44,
                -2
            ],
            [
                87,
                173,
                -1
            ],
            [
                87,
                46,
                -2
            ],
            [
                87,
                58,
                -1
            ],
            [
                87,
                59,
                -1
            ],
            [
                87,
                65,
                -1
            ],
            [
                87,
                97,
                -1
            ],
            [
                87,
                101,
                -1
            ],
            [
                87,
                105,
                0
            ],
            [
                87,
                111,
                -1
            ],
            [
                87,
                114,
                -1
            ],
            [
                87,
                117,
                -1
            ],
            [
                87,
                121,
                0
            ],
            [
                89,
                32,
                -1
            ],
            [
                89,
                44,
                -4
            ],
            [
                89,
                173,
                -3
            ],
            [
                89,
                46,
                -4
            ],
            [
                89,
                58,
                -2
            ],
            [
                89,
                59,
                -2
            ],
            [
                89,
                65,
                -2
            ],
            [
                89,
                97,
                -2
            ],
            [
                89,
                101,
                -3
            ],
            [
                89,
                105,
                -1
            ],
            [
                89,
                111,
                -3
            ],
            [
                89,
                112,
                -2
            ],
            [
                89,
                113,
                -3
            ],
            [
                89,
                117,
                -2
            ],
            [
                89,
                118,
                -2
            ],
            [
                102,
                102,
                -1
            ],
            [
                102,
                8217,
                1
            ],
            [
                114,
                44,
                -2
            ],
            [
                114,
                46,
                -2
            ],
            [
                114,
                8217,
                1
            ],
            [
                118,
                44,
                -2
            ],
            [
                118,
                46,
                -2
            ],
            [
                119,
                44,
                -2
            ],
            [
                119,
                46,
                -2
            ],
            [
                121,
                44,
                -2
            ],
            [
                121,
                46,
                -2
            ],
            [
                8216,
                8216,
                -1
            ],
            [
                8217,
                32,
                -1
            ],
            [
                8217,
                115,
                -1
            ],
            [
                8217,
                8217,
                -1
            ]
        ],
            "offsets": [
            [
                2,
                5
            ],
            [
                1,
                5
            ],
            [
                0,
                5
            ],
            [
                1,
                3
            ],
            [
                2,
                9
            ],
            [
                2,
                22
            ],
            [
                1,
                17
            ],
            [
                3,
                22
            ],
            [
                3,
                5
            ],
            [
                3,
                11
            ],
            [
                2,
                11
            ],
            [
                2,
                8
            ],
            [
                0,
                29
            ],
            [
                1,
                10
            ],
            [
                -1,
                5
            ],
            [
                2,
                10
            ],
            [
                0,
                6
            ],
            [
                0,
                11
            ],
            [
                1,
                11
            ],
            [
                1,
                13
            ],
            [
                1,
                22
            ],
            [
                1,
                0
            ],
            [
                1,
                12
            ],
            [
                0,
                1
            ],
            [
                0,
                25
            ],
            [
                1,
                8
            ],
            [
                3,
                14
            ],
            [
                1,
                25
            ],
            [
                2,
                12
            ],
            [
                0,
                0
            ],
            [
                2,
                0
            ],
            [
                2,
                1
            ],
            [
                1,
                1
            ],
            [
                1,
                4
            ]
        ]
        };
        baseImage.src = "data:image/png;base64,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";
        baseImage.onload = () => {
            const baseTexture = PIXI.BaseTexture.from(baseImage);
            PIXI.BaseTexture.addToCache(baseTexture, Constant.EMPTY_FONT_ID);
            this.add(fontData, Constant.EMPTY_FONT_ID, baseTexture, 1);
            callback();
        };

    },

    /**
     * @desc Add font to cache
     * @function
     * @public
     * @param {MANTICORE.type.FontData} font
     * @param {string} fontName
     * @param {PIXI.BaseTexture} baseTexture
     * @param {number} resolution
     */

    add(font, fontName, baseTexture, resolution) {
        const fontData = {};
        const res = PIXI.utils.getResolutionOfUrl(baseTexture.imageUrl, resolution);

        fontData.font = fontName;
        fontData.size = font.size;
        fontData.lineHeight = font.lineHeight;
        fontData.chars = {};

        // parse letters
        const letters = font.chars;
        const letterCount =  letters.length;

        let i, letter, offset, dimension, kernings, kerningCount, kerning, first, second, amount, nameSplit;

        for (i = 0; i < letterCount; ++i) {
            letter = letters[i];

            offset = font.offsets[letter.offset];

            dimension = letter.dimensions;

            fontData.chars[letter.id] = {
                xOffset: offset[0],
                yOffset: offset[1],
                xAdvance: letter.ax,
                kerning: {},
                texture: new PIXI.Texture(baseTexture, Rectangle.create(
                    dimension[0] / res,
                    dimension[1] / res,
                    dimension[2] / res,
                    dimension[3] / res
                )),
                page: letter.page
            };
        }

        kernings = font.kerning;
        kerningCount = kernings.length;

        for (i = 0; i < kerningCount; ++i) {
            kerning = kernings[i];
            first = kerning[0];
            second = kerning[1];
            amount = kerning[2];

            if (fontData.chars[second]) {
                fontData.chars[second].kerning[first] = amount;
            }
        }
        PIXI.BitmapText.fonts[fontData.font] = fontData;
        nameSplit = fontData.font.split("_");

        if (nameSplit.length === 2) {
            const localName = nameSplit[0];
            const localSize = parseInt(nameSplit[1], 10);
            let sizes;
            if (!this._fontSizes.hasElement(localName)) {
                sizes = [];
                this._fontSizes.addElement(sizes, localName);
            }
            else {
                sizes = this._fontSizes.getElement(localName);
            }
            sizes.push(localSize);
            sizes.sort();
        }
    },

    /**
     * @function
     * @public
     * @param {string} name
     * @returns {boolean}
     */

    remove(name) {
        const index = Math.binaryIndexOf(name, this._fonts);

        if (index === -1) {
            return false;
        }

        delete BitmapText.fonts[name];

        const sizes = this._fontSizes.getElement(name);

        if (Type.isNull(sizes)) {
            return true;
        }

        const sizeCount = sizes.length;
        let sizeName, i, sizeIndex;

        for (i = 0; i < sizeCount; ++i) {
            sizeName = name + "_" + sizes[i];
            sizeIndex = Math.binaryIndexOf(sizeName, this._fonts);
            if (sizeIndex !== -1) {
                this._fonts.splice(sizeIndex, 1);
            }

            delete BitmapText.fonts[sizeName];
        }

        this._fontSizes.removeElement(name);

        return true;
    },

    /**
     * @desc Return font name by size and default name.
     * @function
     * @param {string} fontName
     * @param {int} size
     * @return {string}
     */

    getName: function (fontName, size) {
        if (!this._fontSizes.hasElement(fontName)) {
            return fontName;
        }

        const sizes = this._fontSizes.getElement(fontName);
        const sizeCount = sizes.length;
        let resultSize, i;

        for (i = 0; i < sizeCount; ++i) {
            resultSize = sizes[i];
            if (size < resultSize) {
                break;
            }
        }
        return fontName + "_" + resultSize;
    }
};
