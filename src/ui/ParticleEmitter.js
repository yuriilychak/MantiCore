import ComponentContainer from "view/ComponentContainer";
import ParticleCache from "cache/ParticleCache";
import ParticleSystem from "particleSystem";
import Type from "util/Type";
import Repository from "repository/Repository";

import CONTAINER_TYPE from "enumerator/ui/ContainerType";
import PARTICLE_TYPE from "enumerator/ParticleType";
import PARTICLE_EVENT from "enumerator/ui/ParticleEvent";
import UI_ELEMENT from "enumerator/ui/UIElement";

/**
 * @desc Particle emitter view.
 * @class
 * @extends mCore.view.ComponentContainer
 * @memberOf mCore.ui
 */

export default class ParticleEmitter extends ComponentContainer {
    /**
     * @constructor
     * @param {string} particleName
     * @param {mCore.enumerator.ui.CONTAINER_TYPE} containerType
     */

    constructor(particleName, containerType = CONTAINER_TYPE.DEFAULT) {
        super();

        /**
         * @type {mCore.enumerator.ui.CONTAINER_TYPE}
         * @private
         */

        this._containerType = CONTAINER_TYPE.DEFAULT;

        /**
         * @type {?string}
         * @private
         */

        this._particleName = null;

        /**
         * @type {mCore.enumerator.PARTICLE_TYPE}
         * @private
         */

        this._particleType = PARTICLE_TYPE.PARTICLE;

        /**
         * @desc Container for particles.
         * @type {PIXI.particles.ParticleContainer | PIXI.Container}
         * @private
         */

        this._innerContainer = null;

        /**
         * @type {?Object}
         * @private
         */

        this._particle = null;

        /**
         * @type {mCore.repository.Repository}
         * @private
         */

        this._particleEvents = new Repository();

        this.uiType = UI_ELEMENT.PARTICLE;

        this._initData(particleName, containerType);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @public
     * @param {string} particleName
     * @param {mCore.enumerator.ui.CONTAINER_TYPE} containerType
     */

    reuse(particleName, containerType = CONTAINER_TYPE.DEFAULT) {
        super.reuse();
        this._initData(particleName, containerType);
    }

    /**
     * @desc Emit particle.
     * @method
     * @public
     * @param {number} [scale = 1]
     * @param {boolean} [paused = false]
     * @param {number} [delay = 0]
     */

    emitParticle(scale = 1, paused = false, delay = 0) {
        if (!this.canEmit) {
            return;
        }

        this._particle = ParticleSystem.generateParticle(this._particleName);

        if (this._particleType === PARTICLE_TYPE.PARTICLE) {
            this._particle.init(this._innerContainer, paused, scale);
        }
        else {
            this._particle.init(this._innerContainer, delay, !paused, scale);
        }

        this._particle.on.started.add(this._onEmitterStart.bind(this));
        this._particle.on.exhausted.add(this._onEmitterExhausted.bind(this));
        this._particle.on.completed.add(this._onEmitterComplete.bind(this));
    }

    /**
     * @desc Resume particle.
     * @method
     * @public
     */

    resume() {
        this._switchParticleActivity(true);
    }

    /**
     * @desc Pause particle.
     * @method
     * @public
     */

    pause() {
        this._switchParticleActivity(false);
    }

    stop(killImmediately = false) {
        if (Type.isNull(this._particle)) {
            return;
        }

        this._particle.stop(!killImmediately);
    }


    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data before disuse and destroy.
     * @method
     * @protected
     */

    clearData() {
        this.removeChild(this._innerContainer);

        this.stop(true);

        this._particleEvents.clear();
        this._containerType = CONTAINER_TYPE.DEFAULT;
        this._particleName = null;
        this._particleType = PARTICLE_TYPE.PARTICLE;
        this._innerContainer = null;
        this._particle = null;

        super.clearData();
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @private
     */

    _onEmitterStart() {
        this._dispatchParticleEvent(PARTICLE_EVENT.START);
    }

    /**
     * @method
     * @private
     */

    _onEmitterExhausted() {
        this._dispatchParticleEvent(PARTICLE_EVENT.EXHAUSTED);
    }

    /**
     * @method
     * @private
     */

    _onEmitterComplete() {
        this._particle = null;
        this._dispatchParticleEvent(PARTICLE_EVENT.COMPLETE);
    }

    /**
     * @method
     * @param {mCore.enumerator.ui.PARTICLE_EVENT} eventId
     * @private
     */

    _dispatchParticleEvent(eventId) {
        const event = this._particleEvents.getElement(eventId);

        if (Type.isNull(event)) {
            return;
        }

        this.listenerManager.dispatchEvent(event);
    }

    /**
     * @desc Switch particle activity if it exist.
     * @method
     * @param {boolean} activity
     * @private
     */

    _switchParticleActivity(activity) {
        if (Type.isNull(this._particle)) {
            return;
        }
        this._particle.paused = activity;
    }

    /**
     * @method
     * @param {string} particleName
     * @param {mCore.enumerator.ui.CONTAINER_TYPE} containerType
     * @private
     */

    _initData(particleName, containerType = CONTAINER_TYPE.DEFAULT) {

        this._particleEvents.clear();
        this._containerType = containerType;
        this._particleName = particleName;

        this._innerContainer = this._containerType  === CONTAINER_TYPE.DEFAULT ? new PIXI.Container() : new PIXI.particles.ParticleContainer();
        this.addChild(this._innerContainer);

        const particleData = ParticleCache.getParticle(particleName);

        if (Type.isNull(particleData)) {
            return;
        }

        this._particleType = particleData.type;
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns is particle can be emitted.
     * @public
     * @return {boolean}
     */

    get canEmit() {
        const particleData = ParticleCache.getParticle(this._particleName);
        return !Type.isNull(particleData);
    }

    /**
     * @desc Returns type of emitter.
     * @public
     * @return {mCore.enumerator.PARTICLE_TYPE}
     */

    get particleType() {
        return this._particleType;
    }

    /**
     * @desc Returns particle name.
     * @public
     * @return {?string}
     */

    get particleName()  {
        return this._particleName;
    }

    /**
     * @desc Returns container type where particles emitted.
     * @public
     * @return {mCore.enumerator.ui.CONTAINER_TYPE}
     */

    get containerType() {
        return this._containerType;
    }

    /**
     * @public
     * @return {?string}
     */

    get eventStart() {
        return this._particleEvents.getElement(PARTICLE_EVENT.START);
    }

    set eventStart(value) {
        this._particleEvents.addElement(value, PARTICLE_EVENT.START);
    }

    /**
     * @public
     * @return {?string}
     */

    get eventComplete() {
        return this._particleEvents.getElement(PARTICLE_EVENT.COMPLETE);
    }

    set eventComplete(value) {
        this._particleEvents.addElement(value, PARTICLE_EVENT.COMPLETE);
    }

    /**
     * @public
     * @return {?string}
     */

    get eventExhausted() {
        return this._particleEvents.getElement(PARTICLE_EVENT.EXHAUSTED);
    }

    set eventExhausted(value) {
        this._particleEvents.addElement(value, PARTICLE_EVENT.EXHAUSTED);
    }
}
