import FadeTo from "./FadeTo";

/**
 * @desc Fades In an object that implements the RGBAProtocol protocol. It modifies the opacity from 0 to 255.<br/>
 * The "reverse" of this action is FadeOut
 * @class
 * @extends MANTICORE.animation.action.FadeTo
 * @memberOf MANTICORE.animation.action
 */

class FadeIn extends FadeTo{
    constructor(duration) {
        super(duration, 0);
    }

    /**
     * @desc Returns a reversed action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.FadeTo}
     */

    reverse() {
        return this.doReverse(new FadeTo(this.duration, 0));
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.FadeIn}
     */

    clone() {
        return this.doClone(new FadeIn(this.duration));
    }
}

export default FadeIn;