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
     * @desc Log to console hierarchy of widget
     * @function
     * @public
     * @memberOf MANTICORE.util.ui
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite} widget
     */

    logHierarchy: function(widget) {
        this._logHierarchy(widget);
    },

    /**
     * @function
     * @private
     * @memberOf MANTICORE.util.ui
     * @param {MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite | PIXI.DisplayObject} widget
     * @param {?string} [parentPath = null]
     * @param {int} [tabCount = 0]
     *
     */

    _logHierarchy: function(widget, parentPath = null, tabCount = 0) {
        if (Type.isUndefined(widget.uiType)) {
            return;
        }

        let tab = "";

        for (let i = 0; i < tabCount; ++i) {
            tab += "\t";
        }

        const prefix = !Type.isNull(parentPath) ? parentPath + "=>" : "";
        const name = !Type.isNull(widget.name) ? widget.name : "empty_name";
        const path = prefix + name;
        let type;

        switch (widget.uiType) {
            case UI_ELEMENT.ATLAS_LABEL: {
                type = "AtlasLabel";
                break;
            }
            case UI_ELEMENT.BUTTON: {
                type = "Button";
                break;
            }
            case UI_ELEMENT.CHECK_BOX: {
                type = "CheckBox";
                break;
            }
            case UI_ELEMENT.CONTAINER: {
                type = "ComponentContainer";
                break;
            }
            case UI_ELEMENT.IMAGE_VIEW: {
                type = "ImageView";
                break;
            }
            case UI_ELEMENT.LABEL: {
                type = "Label";
                break;
            }
            case UI_ELEMENT.PANEL: {
                type = "Panel";
                break;
            }
            case UI_ELEMENT.PROGRESS_BAR: {
                type = "ProgressBar";
                break;
            }
            case UI_ELEMENT.SCROLL_VIEW: {
                type = "ScrollView";
                break;
            }
            case UI_ELEMENT.SLIDER: {
                type = "Slider";
                break;
            }
            case UI_ELEMENT.SPRITE: {
                type = "ComponentSprite";
                break;
            }
            case UI_ELEMENT.TEXT_FIELD: {
                type = "TextField";
                break;
            }
            case UI_ELEMENT.TOGGLE_BUTTON: {
                type = "ToggleButton";
                break;
            }
            case UI_ELEMENT.WIDGET: {
                type = "Widget";
                break;
            }

            default: {
                type = "unknown";
            }
        }

        const pathSplit = path.split("=>");
        if (pathSplit.length !== 1) {
            pathSplit.splice(0, 1);
        }
        Logger.log(Format.replace(this.LOG_TEMPLATE, tab, type, pathSplit.join("=>")));

        const isButton = widget.uiType && widget.uiType === UI_ELEMENT.BUTTON;
        const children = widget.uiType && (widget.uiType === UI_ELEMENT.SCROLL_VIEW  || widget.uiType === UI_ELEMENT.LIST_VIEW) ?
            widget.innerContainer.children : widget.children;
        const childCount = children.length;

        for (let i = 0; i < childCount; ++i) {
            if (isButton && children[i].name === "txtTitle") {
                continue;
            }
            this._logHierarchy(children[i], path, tabCount + 1);
        }
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
        const pathSplit = path.split("=>");

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
    }
};

export default ui;