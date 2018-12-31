import Repository from "repository/Repository";
import PARTICLE_TYPE from "enumerator/ParticleType";

/**
 * @desc Namespace for manipulate with spine skeletons.
 * @namespace particleCache
 * @memberOf MANTICORE.cache
 */

export default {

    /**
     * @type {MANTICORE.repository.Repository}
     * @private
     */

    _particleData: new Repository(),

    /**
     * @type {MANTICORE.repository.Repository}
     * @private
     */

    _particles: new Repository(),

    /**
     * @desc Add particle to cache.
     * @function
     * @public
     * @memberOf MANTICORE.cache.particleCache
     * @param {string} name
     * @param {Object} data
     * @returns {boolean}
     */

    add: function(name, data) {
        const emitters = data.emitters;
        const sequences = data.sequences;
        const emitterCount = emitters.length;
        const sequenceCount = sequences.length;
        let i, particleName;

        for (i = 0; i < emitterCount; ++i) {
            particleName = emitters[i].name;
            this._particles.addElement({
                name: particleName,
                source: name,
                type: PARTICLE_TYPE.PARTICLE
            }, particleName);
        }

        for (i = 0; i < sequenceCount; ++i) {
            particleName = sequences[i].name;
            this._particles.addElement({
                name: particleName,
                source: name,
                type: PARTICLE_TYPE.SEQUENCE
            }, particleName);
        }
        const result = this._particleData.addElement(data, name);
        return result;
    },

    /**
     * @desc Remove particle from cache.
     * @function
     * @public
     * @memberOf MANTICORE.cache.particleCache
     * @param {string} name
     * @returns {boolean}
     */

    remove: function(name) {
        return this._particleData.removeElement(name);
    },

    /**
     * @desc Returns particle data.
     * @function
     * @public
     * @memberOf MANTICORE.cache.particleCache
     * @param {string} name
     * @returns {?Object}
     */

    get: function(name) {
        return this._particleData.getElement(name);
    },

    /**
     * @desc Clear particle cache.
     * @function
     * @public
     * @memberOf MANTICORE.cache.particleCache
     */

    clear: function() {
        this._particleData.clear();
        this._particles.clear();
    },

    /**
     * @desc Returns particle information.
     * @function
     * @public
     * @memberOf MANTICORE.cache.particleCache
     * @param {string} name
     * @returns {?ParticleInfo}
     */

    getParticle: function(name) {
        return this._particles.getElement(name);
    }
}


/**
 * @typedef {Object}
 * @name ParticleInfo
 * @param {string} name
 * @param {string} source
 * @param {MANTICORE.enumerator.PARTICLE_TYPE} type
 */