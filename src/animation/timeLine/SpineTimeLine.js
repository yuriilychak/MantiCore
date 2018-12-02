import Type from "util/Type";
import BaseTimeLine from "./BaseTimeLine";

/**
 * @desc Class for manipulate with spine animation.
 * @class
 * @memberOf MANTICORE.animation.timeLine
 * @extends MANTICORE.animation.timeLine.BaseTimeLine
 */

class SpineTimeLine extends BaseTimeLine {
    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns is time line has animation.
     * @method
     * @public
     * @param {string} name
     * @return {boolean}
     */

    hasAnimation(name) {
        const animations = this.target.spineData.animations;
        const animationCount = animations.length;
        for (let i = 0; i < animationCount; ++i) {
            if (animations[i].name !== name) {
                continue;
            }
            return true
        }
        return false;
    }

    /**
     * @desc Pause animation.
     * @method
     * @public
     */

    pause() {
        if (!this.isRunning) {
            return;
        }
        this.target.state.timeScale = 0;
        super.pause();
    }

    /**
     * @desc Resume paused animation.
     * @method
     * @public
     */

    resume() {
        if (!this.isRunning) {
            return;
        }
        this.target.state.timeScale = 1 / this.fps;
        super.resume();
    }

    /**
     * @method
     * @public
     * @return {MANTICORE.animation.SpineTimeLine}
     */

    clone() {
        /**
         * @type {MANTICORE.animation.SpineTimeLine}
         */
        const result = SpineTimeLine.create(this.target);
        result.fps = this.fps;
        result.loop = this.loop;
        return result;
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Play animation after init.
     * @method
     * @protected
     */

    playAnimation() {
        this.target.state.setAnimation(0, this.runningName, this.loop);
        super.playAnimation();
    }

    /**
     * @desc Clear currently running animation if it exist.
     * @method
     * @protected
     * @returns {boolean}
     */

    clearRunningAnimation() {
        if (!super.clearRunningAnimation()) {
            return false;
        }

        this.target.state.clearTracks();
        this.target.skeleton.setToSetupPose();
        return true;
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Fps of time-line
     * @public
     * @returns {number}
     */

    get fps() {
        return super.fps;
    }

    set fps(value) {
        if (super.fps === value) {
            return;
        }
        super.fps = value;
        this.target.state.timeScale = 1 / super.fps;
    }

    /**
     * @desc Returns duration of playing animation.
     * @public
     * @returns {number}
     */

    get duration() {
        if (this.isEmpty) {
            return 0;
        }
        const animations = this.target.spineData.animations;
        const animationCount = animations.length;
        let i, animation;
        for (i = 0; i < animationCount; ++i) {
            animation = animations[i];
            if (animation.name !== name) {
                continue;
            }
            return animation.duration;
        }

        return 0;
    }

    /**
     * @desc Returns is animation need to loop
     * @public
     * @return {boolean}
     */

    get loop() {
        return super.loop;
    }

    set loop(value) {
        if (super.loop === value) {
            return;
        }
        super.loop = value;
        if (Type.isNull(this.target)) {
            return;
        }
        const state = this.target.state;
        const current = state.getCurrent(0);
        if (Type.isNull(current)) {
            return;
        }
        current.loop = super.loop;
    }
}

export default SpineTimeLine;