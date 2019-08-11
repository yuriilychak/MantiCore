import ComUI from "./ComUI";

/**
 * @desc Component for manipulate with items in Item box.
 * @class
 * @extends mCore.component.ui.ComUI
 * @memberOf mCore.component.ui
 */

class ComItem extends ComUI {
    /**
     * @constructor
     */
    constructor(name = "ComItem") {
        super(name);
        /**
         * @desc Index of item
         * @type {int}
         * @private
         */
        this._index = -1;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clone component
     * @method
     * @public
     * @return {mCore.component.ui.ComItem}
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

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Index of item
     * @public
     * @return {int}
     */

    get index() {
        return this._index;
    }

    set index(value) {
        if (this._index === value) {
            return;
        }
        this._index = value;
    }
}

export default ComItem;
