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

        if (Type.isNumber(x)) {
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

    clone(){
        return new Place(this._position);
    }
    reverse () {
        return new Place(this._position);
    }

}

export default Place;