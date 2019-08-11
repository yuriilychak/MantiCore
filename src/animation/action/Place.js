import ActionInstant from "./ActionInstant";
import Type from "util/Type";
import Point from "geometry/Point";

/**
 * @desc Places display object in a certain position
 * @class
 * @extends mCore.animation.action.ActionInstant
 * @memberOf mCore.animation.action
 */

class Place extends ActionInstant {

    /**
     * @constructor
     * @param {mCore.geometry.Point | number} x
     * @param {number} [y]
     */

    constructor(x, y) {
        super();

        /**
         * @type {?mCore.geometry.Point}
         * @private
         */
        this._position = null;

        if (Type.isNumber(x)) {
            y = Type.setValue(y, x);
            this._position = Point.create(x, y);
        }
        else {
            this._position = Point.create(x.x, x.y);
        }
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {mCore.geometry.Point | number} x
     * @param {number} [y]
     */

    reuse(x, y) {
        super.reuse();

        if (Type.isNumber(x)) {
            y = Type.setValue(y, x);
            this._position.set(x, y);
        }
        else {
            this._position.set(x.x, x.y);
        }
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    update(dt) {
        this.target.position.copyFrom(this._position);
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.Place}
     */

    clone(){
        return Place.create(this._position);
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {mCore.animation.action.Place}
     */

    reverse () {
        return Place.create(this._position);
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data befor disuse and destroy.
     * @method
     * @protected
     */

    clearData() {
        this._position.set(0, 0);
        super.clearData();
    }
}

export default Place;
