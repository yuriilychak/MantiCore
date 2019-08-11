import Macro from "macro";
import Repository from "repository/Repository";
import ParticleCache from "cache/ParticleCache";
import EventDispatcher from "eventDispatcher";
import Timer from "timer";
import Type from "util/Type";
import PARTICLE_TYPE from "enumerator/ParticleType";
import SYSTEM_EVENT from "enumerator/event/SystemEvent";

/**
 * @desc Contains loader for load bundles and other resources.
 * @namespace particleSystem
 * @memberOf mCore
 */
export default {
    /**
     * @type {?revolt.FX}
     * @private
     */
    _system: null,

    /**
     * @type {?mCore.repository.Repository}
     */

    _bundles: null,

    /**
     * @type {boolean}
     */

    _paused: false,

    /**
     * @function
     * @public
     * @memberOf mCore.particleSystem
     */

    init() {
        if (!Macro.PARTICLES_ENABLED) {
            return;
        }

        this._bundles = new Repository();
        this._system = new revolt.FX();
        Timer.enterFrameTimer.add(() => {
            if (!this._paused) {
                this._system.update();
            }
        });

        EventDispatcher.addListener(SYSTEM_EVENT.VISIBLE, this._onPageVisibleHandler, this);
        EventDispatcher.addListener(SYSTEM_EVENT.HIDDEN, this._onPageHiddenHandler, this);
    },

    /**
     * @function
     * @public
     * @memberOf mCore.particleSystem
     * @param {string} name
     * @return {revolt.ParticleEmitter | revolt.EffectSequence | null}
     */

    generateParticle(name) {
        if (!Macro.PARTICLES_ENABLED) {
            return null;
        }
        const particleInfo = ParticleCache.getParticle(name);
        if (Type.isNull(particleInfo)) {
            return null;
        }

        const sourceName = particleInfo.source;

        if (!this._bundles.hasElement(sourceName)) {
            const particleData = ParticleCache.get(sourceName);

            if (Type.isNull(particleData)) {
                return null;
            }
            this._system.initBundle(particleData);
            this._bundles.addElement(1, sourceName);
        }
        else {
            this._bundles.updateElement(this._bundles.getElement(sourceName) + 1, sourceName);
        }

        return particleInfo.type === PARTICLE_TYPE.PARTICLE ? this._system.getParticleEmitter(name) : this._system.getEffectSequence(name);

    },

    /**
     * @desc Update system by step. Need to start system from some time interval.
     * @function
     * @public
     * @param {int} [iterationCount = 1]
     * @param {int} [step = 1]
     */

    update(iterationCount = 1, step = 1) {
        if (!Macro.PARTICLES_ENABLED) {
            return;
        }

        for (let i = 0; i < iterationCount; ++i) {
            this._system.update(step);
        }
    },

    /**
     * @function
     * @private
     */

    _onPageVisibleHandler: function () {
        this.paused = false;
    },

    /**
     * @function
     * @private
     */

    _onPageHiddenHandler: function () {
        this.paused = true;
    },

    /**
     * @public
     * @returns {boolean}
     */

    get paused() {
        return this._paused;
    },

    set paused(value) {
        if (this._paused !== value) {
            return;
        }
        this._paused = value;
        if (this._paused) {
            this._system.pause();
        }
        else {
            this._system.start();
        }
    }

};
