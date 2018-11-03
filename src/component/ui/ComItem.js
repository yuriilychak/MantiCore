import ComUI from "./ComUI";

/**
 * @desc Component for manipulate with items in Item box.
 * @class
 * @extends MANTICORE.component.ui.ComUI
 * @memberOf MANTICORE.component.ui
 */

class ComItem extends ComUI {
    /**
     * @constructor
     */
    constructor() {
        super("ComItem");
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clone component
     * @method
     * @public
     * @return {MANTICORE.component.ui.ComItem}
     */

    clone() {
        return ComItem.create();
    }

    /**
     * @method
     * @public
     * @desc Update data for component
     * @param {*} data
     */

    updateData(data) {}
}

export default ComItem;