import Timer from "timer";

import Asset from "util/Asset";
import Geometry from "util/Geometry";
import Math from "util/Math";

import UI_ELEMENT from "enumerator/ui/UIElement";

import Pool from "pool";

import AnimationManager from "manager/AnimationManager";
import ComponentManager from "manager/ComponentManager";
import ListenerManager from "manager/ListenerManager";
import MemoryManager from "manager/MemoryManager";
import Type from "../util/Type";


/**
 * @desc Class that implements composite pattern for sprite;
 * @class
 * @extends PIXI.Sprite
 * @memberOf MANTICORE.view
 */

class ComponentSprite extends PIXI.Sprite {
    /**
     * @constructor
     * @param {string} frameName - Link to sprite frame.
     */
    constructor(frameName) {
        super(Asset.getSpriteFrame(frameName));

        /**
         * @desc Manager of components.
         * @type {?MANTICORE.manager.ComponentManager}
         * @private
         */

        this._componentManager = null;

        /**
         * @desc Manager of listeners.
         * @type {MANTICORE.manager.ListenerManager}
         * @private
         */

        this._listenerManager = null;

        /**
         * @desc Class for manipulate with memory.
         * @type {MANTICORE.manager.MemoryManager}
         * @private
         */

        this._memoryManager = Pool.getObject(MemoryManager, this);

        /**
         * @desc Class for manipulate with animations.
         * @type {?MANTICORE.manager.AnimationManager}
         * @private
         */

        this._animationManager = null;

        /**
         * @desc Flag is animation manager init.
         * @type {boolean}
         * @private
         */

        this._hasAnimationManager = false;

        /**
         * @desc Flag is component manager init.
         * @type {boolean}
         * @private
         */

        this._hasComponentManager = false;

        /**
         * @desc Flag is listener manager init.
         * @type {boolean}
         * @private
         */

        this._hasListenerManager = false;

        /**
         * @desc Flag is container marked for update;
         * @type {boolean}
         * @private
         */

        this._isUpdate = false;

        /**
         * @desc Flag is element destroyed.
         * @type {boolean}
         * @private
         */

        this._isDestroyed = false;

        /**
         * @type {MANTICORE.enumerator.ui.UI_ELEMENT}
         * @private
         */

        this._uiType = UI_ELEMENT.SPRITE;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @method
     * @public
     * @override
     * @param {...PIXI.DisplayObject} var_args
     * @returns {PIXI.DisplayObject | PIXI.DisplayObject[]}
     */

    addChild(var_args) {
        const argumentCount = arguments.length;
        const result = [];
        const offset = Geometry.pCompMult(Geometry.pFromSize(this), this.anchor);
        const scale = Geometry.pInvert(this.scale);
        for (let i = 0; i < argumentCount; ++i) {
            Geometry.pSub(arguments[i].position, offset, true);
            arguments[i].scale.copy(scale);
            result.push(super.addChild(arguments[i]));
        }
        if (this._hasComponentManager) {
            this._componentManager.addChildrenAction(result);
        }
        return result.length === 1 ? result[0] : result;
    }

    /**
     * @method
     * @public
     * @override
     * @param  {PIXI.DisplayObject} child
     * @param {int} index
     * @returns {PIXI.DisplayObject}
     */

    addChildAt(child, index) {
        const result = super.addChildAt(child, index);
        Geometry.pSub(child.position, Geometry.pCompMult(Geometry.pFromSize(this), this.anchor), true);
        child.scale.copy(Geometry.pInvert(this.scale));
        if (this._hasComponentManager) {
            this._componentManager.addChildrenAction([result]);
        }
        return result;
    }

    /**
     * @method
     * @public
     * @override
     * @param {...PIXI.DisplayObject} var_args
     * @returns {?PIXI.DisplayObject | ?PIXI.DisplayObject[]}
     */

    removeChild(var_args) {
        const argumentCount = arguments.length;
        const result = [];
        for (let i = 0; i < argumentCount; ++i) {
            result.push(super.removeChild(arguments[i]));
        }
        if (this._hasComponentManager) {
            this._componentManager.removeChildrenAction(result);
        }
        return result.length === 1 ? result[0] : result;
    }

    /**
     * @method
     * @public
     * @override
     * @param {int} index
     * @returns {?PIXI.DisplayObject}
     */

    removeChildAt(index) {
        const result = super.removeChildAt(index);
        if (this._hasComponentManager) {
            this._componentManager.removeChildrenAction([result]);
        }
        return result;
    }

    /**
     * @method
     * @public
     * @override
     * @param {int} [beginIndex = 0]
     * @param {int} [endIndex]
     * @returns {PIXI.DisplayObject[]}
     */

    removeChildren(beginIndex = 0, endIndex = super.children.length) {
        const result = super.removeChildren(beginIndex, endIndex);
        if (this._hasComponentManager) {
            this._componentManager.removeChildrenAction(result);
        }
        return result;
    }

    /**
     * @desc Calls by pool when view put in to pool. Don't call it only override.
     * @method
     * @public
     */

    disuse() {
        this.isUpdate = false;
        this.parent.removeChild(this);
    }

    /**
     * @desc Removes all internal references and listeners as well as removes children from the display list. DON'T USE IT MANUALLY!!!
     * @method
     * @public
     */

    destroy() {
        this.isUpdate = false;
        this._componentManager = this._killManager(this._componentManager);
        this._listenerManager = this._killManager(this._listenerManager);
        this._animationManager = this._killManager(this._animationManager);
        this._memoryManager = this._killManager(this._memoryManager);

        this._hasListenerManager = false;
        this._hasComponentManager = false;
        this._hasAnimationManager = false;

        this._isDestroyed = true;

        super.destroy();
    }

    /**
     * @desc Call for destroy object. If it reusable put in pool.
     * @method
     * @public
     */

    kill() {
        this._memoryManager.killOwner();
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Handler that calls if container mark for update.
     * @method
     * @protected
     * @param {number} dt - Time step of update.
     *
     */

    onUpdate(dt) {
        const step = Math.framesToSeconds(dt);
        if (this._hasAnimationManager) {
            this._animationManager.update(step);
        }
        if (this._hasComponentManager) {
            this._componentManager.update(step);
        }

        this.isUpdate = (this._hasAnimationManager && this._animationManager.active) ||
            (this._hasComponentManager && this._componentManager.active);
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Safe kill of manager.
     * @method
     * @private
     * @param {MANTICORE.manager.BaseManager} manager
     * @returns {null}
     */

    _killManager(manager) {
        if (Type.isNull(manager)) {
            return null;
        }
        manager.kill();
        return null;
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @public
     * @returns {boolean}
     */

    get visible() {
        return super.visible;
    }

    set visible(value) {
        if (super.visible === value) {
            return;
        }
        super.visible = value;

        if (!this._hasComponentManager) {
            return;
        }
        this._componentManager.visibleAction(this.visible);
    }

    /**
     * @desc Flag is element destroy or put in pool after kill.
     * @public
     * @type {boolean}
     */

    get reusable() {
        return this._memoryManager.isOwnerReusable;
    }

    set reusable(value) {
        this._memoryManager.isOwnerReusable = value;
    }

    /**
     * @desc Flag is need to block events dispatching for view.
     * @public
     * @type {boolean}
     */

    get blockEvents() {
        return this._listenerManager.blockEvents;
    }

    set blockEvents(value) {
        this._listenerManager.blockEvents = value;
    }

    /**
     * @desc Flag is view currently in pool.
     * @public
     * @type {boolean}
     */

    get inPool() {
        return this._memoryManager.inPool;
    }

    set inPool(value) {
        if (this._memoryManager.inPool === value) {
            return;
        }
        this._memoryManager.inPool = value;
        this._componentManager.inPool = value;
        const childCount = this.children;
        for (let i = 0; i < childCount; ++i) {
            this.children[i].inPool = value;
        }
    }

    /**
     * @public
     * @readonly
     * @type {MANTICORE.enumerator.ui.UI_ELEMENT}
     */

    get uiType() {
        return this._uiType;
    }


    set uiType(value) {
        if (this._uiType === value) {
            return;
        }
        this._uiType = value;
    }

    /**
     * @desc Returns is container marked for update.
     * @type {boolean}
     */

    get isUpdate() {
        return this._isUpdate;
    }

    set isUpdate(value) {
        if (this._isUpdate === value) {
            return;
        }

        this._isUpdate = value;

        if (this._isUpdate) {
            Timer.enterFrameTimer.add(this.onUpdate, this);
            return;
        }

        Timer.enterFrameTimer.remove(this.onUpdate, this);
    }

    /**
     * @desc Flag is element destroyed.
     * @readonly
     * @public
     * @return {boolean}
     */

    get isDestroyed() {
        return this._isDestroyed;
    }

    /**
     * @desc Link to animation manager.
     * @public
     * @readonly
     * @return {MANTICORE.manager.AnimationManager}
     */

    get animationManager() {
        if (!this._hasAnimationManager) {
            this._hasAnimationManager = true;
            this._animationManager = Pool.getObject(AnimationManager, this);
        }
        return this._animationManager;
    }

    /**
     * @desc Link to component manager
     * @readonly
     * @public
     * @return {MANTICORE.manager.ComponentManager}
     */

    get componentManager() {
        if (!this._hasComponentManager) {
            this._hasComponentManager = true;
            this._componentManager = Pool.getObject(ComponentManager, this);
        }
        return this._componentManager;
    }

    /**
     * @desc Link to listener manager.
     * @public
     * @return {MANTICORE.manager.ListenerManager}
     */

    get listenerManager() {
        if (!this._hasListenerManager) {
            this._hasListenerManager = true;
            this._listenerManager = Pool.getObject(ListenerManager, this);
        }
        return this._listenerManager;
    }

    /**
     * @desc Flag is view has animation manager.
     * @public
     * @return {boolean}
     */

    get hasAnimationManager() {
        return this._hasAnimationManager;
    }

    /**
     * @desc Flag is view has component manager.
     * @public
     * @return {boolean}
     */

    get hasComponentManager() {
        return this._hasComponentManager;
    }

    /**
     * @desc Flag is view has listener manager.
     * @public
     * @return {boolean}
     */

    get hasListenerManager() {
        return this._hasListenerManager;
    }
}

export default ComponentSprite;