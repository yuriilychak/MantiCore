import Widget from "./Widget";
import Slice9Sprite from "view/Slice9Sprite";
import UI_ELEMENT from "enumerator/ui/UIElement";

/**
 * @desc Realization of image view class.
 * @class
 * @extends MANTICORE.ui.Widget
 * @memberOf MANTICORE.ui
 */

class ImageView extends Widget {
    /**
     * @constructor
     * @param {string} frameName - Frame name of sprite.
     */
    constructor(frameName) {
        super(new Slice9Sprite(frameName));

        this.uiType = UI_ELEMENT.IMAGE_VIEW;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {string} frameName - Frame name of sprite.
     */
    reuse(frameName) {
        super.reuse(new Slice9Sprite(frameName));
    }
}

export default ImageView;