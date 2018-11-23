import UI_ELEMENT from "enumerator/ui/UIElement";
import Logger from "logger";
import Type from "./Type";
import Format from "./Format";

/**
 * @desc Contains some methods to manipulate with ui.
 * @namespace MANTICORE.util.ui
 * @memberOf MANTICORE.util
 */

const ui = {
    /**
     * @desc Template for hierarchy log.
     * @readonly
     * @type {string}
     * @memberOf MANTICORE.util.ui
     * @private
     */

    LOG_TEMPLATE: "{0}type: {1}, path: {2}",

    /**
     * @desc Divider for parent/child hierarchy
     * @type {string}
     * @memberOf MANTICORE.util.ui
     * @private
     */

    DIVIDER: "=>",

    /**
     * PUBLIC FUNCTIONS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Log to console hierarchy of widget
     * @function
     * @public
     * @memberOf MANTICORE.util.ui
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} widget
     * @param {number} [maxLevel = -1]
     */

    logHierarchy: function(widget, maxLevel = -1) {
        this._logHierarchy(widget, null, 0, maxLevel);
    },

    /**
     * @desc Log labels and buttons that don't localized.
     * @function
     * @public
     * @memberOf MANTICORE.util.ui
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} widget
     */

    logUnlocalizedFields: function (widget) {
        this._logUnlocalizedFields(widget);
    },

    /**
     * @desc Returns element that get from path.
     * @function
     * @public
     * @memberOf MANTICORE.util.ui
     * @param {string} path
     * @param {PIXI.Container} parent
     * @returns {PIXI.DisplayObject | null}
     */

    getChildView: function(path, parent) {
        const pathSplit = path.split(this.DIVIDER);

        const elementCount = pathSplit.length;
        let element, i;

        element = parent;

        for (i = 0; i < elementCount; ++i) {
            element = element.getChildByName(pathSplit[i]);
            if (element === null) {
                return null;
            }
        }
        return element;
    },

    /**
     * PRIVATE FUNCTIONS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @function
     * @private
     * @memberOf MANTICORE.util.ui
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite | PIXI.DisplayObject} widget
     * @param {?string} [parentPath = null]
     * @param {int} [tabCount = 0]
     * @param {int} [maxLevel = -1]
     */

    _logHierarchy: function(widget, parentPath = null, tabCount = 0, maxLevel = -1) {
        if (Type.isUndefined(widget.uiType) || maxLevel === tabCount) {
            return;
        }

        const tab = this._generateTabs(tabCount);
        const uiType = widget.uiType;
        const path = this._updatePath(parentPath, widget.name);
        const type = this._getComponentName(uiType);
        const isButton = this._isButton(uiType);
        const pathJoined = this._refreshPath(path);

        this._logElement(tab, type, pathJoined);

        this._iterateChildren(widget, child => {
            if (isButton && child.name === "txtTitle") {
                return;
            }
            this._logHierarchy(child, path, tabCount + 1, maxLevel);
        });
    },

    /**
     * @function
     * @private
     * @memberOf MANTICORE.util.ui
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite | PIXI.DisplayObject} widget
     * @param {?string} [parentPath = null]
     * @param {int} [tabCount = 0]
     */

    _logUnlocalizedFields(widget, parentPath = null, tabCount = 0) {
        if (Type.isUndefined(widget.uiType)) {
            return;
        }

        const tab = this._generateTabs(tabCount);
        const uiType = widget.uiType;
        const path = this._updatePath(parentPath, widget.name);
        const type = this._getComponentName(uiType);
        const isButton = this._isButton(uiType);
        const isLabel = this._isLabel(uiType);
        const pathJoined = this._refreshPath(path);

        if (isLabel && !widget.localized) {
            this._logElement(tab, type, pathJoined);
        }

        this._iterateChildren(widget, child => {
            if (isButton && child.name === "txtTitle") {
                if (!child.localized) {
                    this._logElement(tab, type, pathJoined);
                }
                return;
            }
            this._logUnlocalizedFields(child, path, tabCount + 1);
        });
    },

    /**
     * @function
     * @private
     * @param {int} count
     * @return {string}
     */

    _generateTabs(count) {
        let result = "";

        for (let i = 0; i < count; ++i) {
            result += "\t";
        }
        return result;
    },

    /**
     * @desc Refresh path for log.
     * @function
     * @private
     * @param {string} path
     * @return {string}
     */

    _refreshPath: function(path) {
        const pathSplit = path.split(this.DIVIDER);
        if (pathSplit.length !== 1) {
            pathSplit.splice(0, 1);
        }

        return pathSplit.join(this.DIVIDER);
    },

    /**
     * @function
     * @private
     * @param {string} tab
     * @param {string} type
     * @param {string} path
     */

    _logElement: function(tab, type, path) {
        Logger.log(Format.replace(this.LOG_TEMPLATE, tab, type, path));
    },

    /**
     * @function
     * @private
     * @param {string | null} parentPath
     * @param {string | null} name
     * @return {string}
     */

    _updatePath(parentPath, name) {
        if (Type.isNull(name)) {
            name = "empty_name";
        }
        const prefix = !Type.isNull(parentPath) ? parentPath + this.DIVIDER : "";
        return prefix + name;
    },

    /**
     * @desc Returns is type inherit button.
     * @function
     * @private
     * @param {MANTICORE.enumerator.ui.UI_ELEMENT} type
     * @returns {boolean}
     */

    _isButton(type) {
        return type === UI_ELEMENT.BUTTON || type === UI_ELEMENT.CHECK_BOX || type === UI_ELEMENT.TOGGLE_BUTTON;
    },

    /**
     * @desc Returns is type inherit from scroll view.
     * @function
     * @private
     * @param {MANTICORE.enumerator.ui.UI_ELEMENT} type
     * @returns {boolean}
     */

    _isScrollView(type) {
        return type === UI_ELEMENT.SCROLL_VIEW || type === UI_ELEMENT.LIST_VIEW;
    },

    /**
     * @desc Returns is type inherit from label.
     * @function
     * @private
     * @param {MANTICORE.enumerator.ui.UI_ELEMENT} type
     * @returns {boolean}
     */

    _isLabel(type) {
        return type === UI_ELEMENT.LABEL || type === UI_ELEMENT.ATLAS_LABEL || type === UI_ELEMENT.TEXT_FIELD;
    },

    /**
     *
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite | MANTICORE.ui.ScrollView} widget
     * @param {MANTICORE.util.ui.IterateChildren} callback
     * @private
     */

    _iterateChildren(widget, callback) {
        const isScrollView = this._isScrollView(widget.uiType);
        const children = (isScrollView ? widget.innerContainer : widget).children;
        const childCount = children.length;

        for (let i = 0; i < childCount; ++i) {
            callback(children[i]);
        }
    },

    /**
     * @desc Returns ui element name by type.
     * @function
     * @private
     * @param {MANTICORE.enumerator.ui.UI_ELEMENT} type
     * @returns {string}
     */

    _getComponentName: function(type) {
        switch (type) {
            case UI_ELEMENT.ATLAS_LABEL: return "AtlasLabel";
            case UI_ELEMENT.BUTTON: return "Button";
            case UI_ELEMENT.CHECK_BOX: return "CheckBox";
            case UI_ELEMENT.CONTAINER: return "ComponentContainer";
            case UI_ELEMENT.IMAGE_VIEW: return "ImageView";
            case UI_ELEMENT.LABEL: return "Label";
            case UI_ELEMENT.PANEL: return "Panel";
            case UI_ELEMENT.PROGRESS_BAR: return "ProgressBar";
            case UI_ELEMENT.SCROLL_VIEW: return "ScrollView";
            case UI_ELEMENT.SLIDER: return "Slider";
            case UI_ELEMENT.SPRITE: return "ComponentSprite";
            case UI_ELEMENT.TEXT_FIELD: return "TextField";
            case UI_ELEMENT.TOGGLE_BUTTON: return "ToggleButton";
            case UI_ELEMENT.WIDGET: return "Widget";
            case UI_ELEMENT.LIST_VIEW: return "ListView";
            default: return "Unknown";
        }
    }
};

/**
 * @typedef {Function}
 * @name IterateChildren
 * @memberOf MANTICORE.util.ui
 * @param {MANTICORE.view.ComponentContainer | PIXI.DisplayObject} child
 */

export default ui;