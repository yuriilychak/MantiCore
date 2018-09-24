import Widget from "./Widget";
import Slice9Sprite from "view/Slice9Sprite";
import PANEL_GRAPHIC_TYPE from "enumerator/ui/PanelGrphicType";
import Type from "util/Type";
import Asset from "util/Asset";
import UI_ELEMENT from "enumerator/ui/UIElement";

/**
 * @desc Panel component.
 * @class
 * @extends MANTICORE.ui.Widget
 * @memberOf MANTICORE.ui
 */

class Panel extends Widget {
    /**
     * @constructor
     * @param {MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE} [graphicType = MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE.NONE] - Type of graphic that use panel.
     * @param {?string | ?int} [data = null] - Data that need to init panel. If type Color this is color, if Sprite it link to texture.
     */
    constructor(graphicType = PANEL_GRAPHIC_TYPE.NONE, data = null) {
        super();

        /**
         * @type {MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE}
         * @private
         */

        this._type = PANEL_GRAPHIC_TYPE.NONE;

        this.uiType = UI_ELEMENT.PANEL;

        this.setType(graphicType, data);
    }

    /**
     * @public
     * @type {int}
     */

    get backgroundColor() {
        return this.collider.tint;
    }

    set backgroundColor(value) {
        if (this.collider.tint === value) {
            return;
        }
        this.collider.tint = value;
    }

    /**
     * @public
     * @type {number}
     */

    get backgroundAlpha() {
        return this.collider.alpha;
    }

    set backgroundAlpha(value) {
        if (this.collider.alpha === value) {
            return;
        }
        this.collider.alpha = value;
    }

    /**
     * @method
     * @public
     * @return {MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE}
     */

    getType() {
        return this._type;
    }

    /**
     * @method
     * @public
     * @param {MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE} [graphicType = MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE.NONE] - Type of graphic that use panel.
     * @param {?string | ?int} [data = null] - Data that need to init panel. If type Color this is color, if Sprite it link to texture.
     */

    setType(graphicType, data = null) {
        if (this._type === graphicType) {
            if (this._type === PANEL_GRAPHIC_TYPE.SPRITE && Type.isString(data)) {
                this.collider.frameName = data;
            }
            return;
        }

        if (this._type === PANEL_GRAPHIC_TYPE.SPRITE) {
            this.collider = Asset.createWhiteSprite();
        }

        this._type = graphicType;

        switch (this._type) {
            case PANEL_GRAPHIC_TYPE.COLOR: {
                if (Type.isNumber(data)) {
                    this.tint = data;
                }
                this.collider.renderable = true;
                break;
            }
            case PANEL_GRAPHIC_TYPE.SPRITE: {
                if (!Type.isString(data)) {
                    return;
                }
                this.collider = new Slice9Sprite(data);
                break;
            }
            default: {
                this.collider.renderable = false;
                break;
            }
        }
    }
}

export default Panel;