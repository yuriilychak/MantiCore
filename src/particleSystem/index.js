import Macro from "macro";
import Repository from "repository/Repository";
import ParticleCache from "cache/ParticleCache";
import Timer from "timer";
import Type from "util/Type";
import PARTICLE_TYPE from "enumerator/ParticleType";

/**
 * @desc Contains loader for load bundles and other resources.
 * @namespace particleSystem
 * @memberOf MANTICORE
 */
export default {
    /**
     * @type {?revolt.FX}
     * @private
     */
    _system: null,

    /**
     * @type {?MANTICORE.repository.Repository}
     */

    _bundles: null,

    /**
     * @function
     * @public
     * @memberOf MANTICORE.particleSystem
     */

    init() {
        if (!Macro.PARTICLES_ENABLED) {
            return;
        }

        this._bundles = new Repository();
        this._system = new revolt.FX();
        Timer.enterFrameTimer.add(() => this._system.update());
    },

    /**
     * @function
     * @public
     * @memberOf MANTICORE.particleSystem
     * @param {string} name
     * @return {revolt.ParticleEmitter | revolt.EffectSequence | null}
     */

    generateParticle(name) {
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

    }
};