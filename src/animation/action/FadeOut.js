import FadeTo from "./FadeTo";

/**
 * @desc Fades Out an object that implements the RGBAProtocol protocol. It modifies the opacity from 1 to 0.
 * The "reverse" of this action is FadeIn
 * @class
 * @extends MANTICORE.animation.action.FadeTo
 * @memberOf MANTICORE.animation.action
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
     * @return {MANTICORE.animation.action.FadeTo}
     */

    reverse() {
        return this.doReverse(new FadeTo(this.duration, 1));
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.FadeOut}
     */

    clone() {
        return this.doClone(new FadeOut(this.duration));
    }
}

export default FadeOut;