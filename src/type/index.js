/**
 * @desc Contains type definitions for some data objects.
 * @namespace type
 * @memberOf MANTICORE
 */

/**
 * @desc Data that contain ui sources.
 * @typedef {Object}
 * @name AssetBundle
 * @memberOf MANTICORE.type
 * @property {MANTICORE.type.ElementData[]} ui - Data that contain information about UI elements.
 * @property {int[][]} textures - Array with decomposed textures that use elements.
 * @property {string[]} textureParts - Parts of decomposed textures.
 * @property {string[]} componentNames - Array with UI component name (windows, scenes etc.) that contain source.
 * @property {string[]} elementNames - Array with UI elements (buttons, panels etc.) name that contain source.
 * @property {string[]} texts - Array with texts from labels.
 * @property {string[]} fonts - Array with font names.
 * @property {MANTICORE.type.FontStyle[]} fontStyles - Array with font styles.
 * @property {MANTICORE.type.AtlasFont[]} atlasFonts - Array with atlas font information.
 * @property {int[]} colors - Array of colors that use bundle.
 * @property {int[]} anchors - Array with anchor points.
 * @property {MANTICORE.type.TextFieldStyle[]} textFieldStyles - Array with textField styles.s
 */

/**
 * @desc Data that contain information about font styles.
 * @typedef {Object}
 * @name FontStyle
 * @memberOf MANTICORE.type
 * @property {int} name - Index of font name.
 * @property {int} size - Size of text.
 * @property {int} color - Color of text.
 * @property {MANTICORE.enumerator.ui.HORIZONTAL_ALIGN[] | MANTICORE.enumerator.ui.VERTICAL_ALIGN[]} align - Align of font (2 elements vertical and horizontal).
 * @property {int} outlineSize - Size of outline (If disabled 0);
 * @property {int} outlineColor - Color of outline.
 * @property {int} shadowColor - Color of shadow.
 * @property {int[]} shadowOffset - Offset of shadow (two parameters dx, dy).
 */

/**
 * @desc Data that contain information about atlas fonts.
 * @typedef {Object}
 * @name AtlasFont
 * @memberOf MANTICORE.type
 * @property {int} texture - Index of texture that use atlas font.
 * @property {int} dotWidth - Width of dot symbol (Apply to dot and point symbols).
 * @property {int[]} size - Size of letter in atlas font.
 */

/**
 * @desc Data that contain information about ui element.
 * @typedef {Object}
 * @name ElementData
 * @memberOf MANTICORE.type
 * @property {int} name - Index of name in list of names.
 * @property {int[]} scale - Scale of element in percents [0, 100] (two parameters sx, sy).
 * @property {int} anchor - Index of anchor point in list.
 * @property {int[]} rotation - rotation of element in degrees, if two rotations same use rotate else skew.
 * @property {boolean[]} flip - is need flip element horizontal or vertical (two parameters flipX, flipY).
 * @property {MANTICORE.enumerator.ui.UI_ELEMENT} type - Type of element to parse.
 * @property {int[]} dimensions - dimensions of element (four parameters x, y, width, height).
 * @property {int[]} slice9 - slice9 rect of element (four parameters x, y, width, height).
 * @property {int} tint - tint of element.
 * @property {MANTICORE.type.ElementData[]} children - Child elements of element.
 * @property {MANTICORE.type.ElementData} content - Content elements of element (FRor button title, For slider ball etc.).
 * @property {int[] | MANTICORE.enumerator.DIRECTION[] | MANTICORE.enumerator.ui.SCROLL_DIRECTION[] | MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE[]} fileData - Index of custom data to parse (For button textures, for label font style etc.).
 * @property {boolean} clipped - Is element use clipping.
 * @property {boolean} interactive - Is element interactive.
 * @property {boolean} visible - Is element visible.
 * @property {int} alpha - Alpha channel of element.
 */

/**
 * @desc Data that contain information about atlas fonts.
 * @typedef {Object}
 * @name TextFieldStyle
 * @memberOf MANTICORE.type
 * @property {int} placeHolderText - Index of placeholder text.
 * @property {int} maxLength - Max length of input text.
 * @property {boolean} passwordMode - Is password mode enabled.
 * @property {int} passwordChar - Index of char for passwords in text array.
 */

/**
 * @desc Namespace with callbacks for view
 * @namespace callback
 * @memberOf MANTICORE.view
 */

/**
 * @desc Namespace with callbacks for components
 * @namespace callback
 * @memberOf MANTICORE.component
 */

/**
 * @desc Callback for iterate children.
 * @callback IterateChildren
 * @typedef {Function}
 * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} child
 * @param {int} [index] - Index of child without collider.
 * @param {int} [realIndex] - Real index of child in display list.
 * @memberOf MANTICORE.component.callback
 */

/**
 * @desc Callback for iterate components.
 * @callback IterateComponent
 * @typedef {Function}
 * @param {MANTICORE.component.Component} component
 * @param {int} [index]
 * @memberOf MANTICORE.view.callback
 */

/**
 * @desc Callback for update component callbacks.
 * @callback ChildAction
 * @typedef {Function}
 * @param {MANTICORE.component.Component} component
 * @param {PIXI.DisplayObject} child
 * @memberOf MANTICORE.view.callback
 */

/**
 * @desc Object for store event data
 * @name EventData
 * @memberOf MANTICORE.eventDispatcher.
 * @typedef {Object}
 * @param {string} type - Name of event.
 * @param {?Object} data - Data for dispatch
 */