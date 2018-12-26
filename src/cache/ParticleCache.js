import Repository from "../repository/Repository";

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

    addParticleData: function(name, data) {
        return this._particleData.addElement(data, name);
    },

    /**
     * @desc Remove particle from cache.
     * @function
     * @public
     * @memberOf MANTICORE.cache.particleCache
     * @param {string} name
     * @returns {boolean}
     */

    removeParticleData: function(name) {
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

    getParticleData: function(name) {
        return this._particleData.getElement(name);
    },

    /**
     * @desc Clear particle cache.
     * @function
     * @public
     */

    clear() {
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