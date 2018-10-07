import ActionInstant from "./ActionInstant";
import Type from "util/Type";

/**
 * @desc Places display object in a certain position
 * @class
 * @extends MANTICORE.animation.action.ActionInstant
 * @memberOf MANTICORE.animation.action
 */

class Place extends ActionInstant {

    /**
     * @constructor
     * @param {PIXI.Point | PIXI.ObservablePoint | number} x
     * @param {number} [y]
     */

    constructor(x, y) {
        super();

        /**
         * @type {?PIXI.Point}
         * @private
         */
        this._position = null;

        if (Type.isnumber(x)) {
            y = Type.setValue(y, x);
            this._position = new PIXI.Point(x, y);
        }
        else {
            this._position = new PIXI.Point(x.x, x.y);
        }

    }

    update(dt) {
        this.target.position.copy(this._position);
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.Place}
     */

    clone(){
        return new Place(this._position);
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.Place}
     */

    reverse () {
        return new Place(this._position);
    }

}

export default Place;