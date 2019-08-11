import FadeTo from "./FadeTo";

/**
 * @desc Fades Out an object that implements the RGBAProtocol protocol. It modifies the opacity from 1 to 0.
 * The "reverse" of this action is FadeIn
 * @class
 * @extends mCore.animation.action.FadeTo
 * @memberOf mCore.animation.action
 */


class FadeOut extends FadeTo {
    constructor(duration = 0) {
        super(duration, 0);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {mCore.animation.action.FadeTo}
     */

    reverse() {
        return this.doReverse(FadeTo.create(this.duration, 1));
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.FadeOut}
     */

    clone() {
        return this.doClone(FadeOut.create(this.duration));
    }
}

export default FadeOut;
