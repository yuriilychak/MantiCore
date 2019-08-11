import Slice9Sprite from "view/Slice9Sprite";
import Timer from "timer";
import UI_ELEMENT from "enumerator/ui/UIElement";

import Type from "util/Type";
import Math from "util/Math";
import Color from "util/Color";

import ComponentManager from "manager/ComponentManager";
import ListenerManager from "manager/ListenerManager";
import AnimationManager from "manager/AnimationManager";
import InteractionManager from "manager/InteractionManager";

import Pool from "pool";
import Constant from "constant";

/**
 * @desc Realization of image view class.
 * @class
 * @extends mCore.view.Slice9Sprite
 * @memberOf mCore.ui
 */

class ImageView extends Slice9Sprite {
    /**
     * @constructor
     * @param {string} frameName - Frame name of sprite.
     */
    constructor(frameName) {
        super(frameName);

        /**
         * @desc Storage of components.
         * @type {?mCore.manager.ComponentManager}
         * @private
         */

        this._componentManager = null;

        /**
         * @desc Storage of listeners.
         * @type {?mCore.manager.ListenerManager}
         * @private
         */

        this._listenerManager = null;

        /**
         * @desc Class for manipulate with animations.
         * @type {?mCore.manager.AnimationManager}
         * @private
         */

        this._animationManager = null;

        /**
         * @desc Class for manipulate with interactions.
         * @type {mCore.manager.InteractionManager}
         * @private
         */
        this._interactionManager = null;

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
         * @desc Flag is interaction manager init.
         * @type {boolean}
         * @private
         */

        this._hasInteractionManager = false;

        /**
         * @desc Flag is container marked for update;
         * @type {boolean}
         * @private
         */

        this._isUpdate = false;

        /**
         * @desc Flag is currently object destroyed
         * @type {boolean}
         * @private
         */
        this._isDestroyed = false;

        /**
         * @desc Flag is owner put in pool after call kill() or destroy.
         * @type {boolean}
         * @private
         */

        this._reusable = true;

        /**
         * @desc Flag is currently owner in pool or his owner in pool.
         * @type {boolean}
         * @private
         */

        this._inPool = false;

        /**
         * @desc Tint of sprite
         * @type {int}
         * @private
         */

        this._customTint = Color.COLORS.WHITE;

        /**
         * @desc Real tint of parent.
         * @type {int}
         * @private
         */

        this._parentTint = Color.COLORS.WHITE;

        /**
         * @desc Real tint of element.
         * @type {int}
         * @private
         */

        this._realTint = Color.COLORS.WHITE;

        /**
         * @type {mCore.enumerator.ui.UI_ELEMENT}
         * @private
         */

        this._uiType = UI_ELEMENT.IMAGE_VIEW;

        /**
         * @desc Flag is need to block event dispatch.
         * @type {boolean}
         * @private
         */

        this._blockEvents = false;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Static constructor of reusable object
     * @method
     * @static
     * @param var_args
     * @return {*}
     */

    static create(var_args) {
        return Pool.getObject(this, ...arguments);
    }

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
        let i, child;
        for (i = 0; i < argumentCount; ++i) {
            child = arguments[i];
            this.updateChildTint(child);
            result.push(super.addChild(child));
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
        this.updateChildTint(child);
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
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {...*} var_args
     */
    reuse(var_args) {
        this._isUpdate = false;
        this.inPool = false;
    }

    /**
     * @desc Calls by pool when object put in to pool. Don't call it only override.
     * @method
     * @public
     */
    disuse() {
        this.inPool = true;
        this.clearData();
        this.parent.removeChild(this);
    }

    /**
     * @desc Removes all internal references and listeners.
     * @method
     * @public
     */
    destroy() {
        this._isDestroyed = true;
        this._inPool = false;
        this._reusable = false;
        this.clearData();
        super.destroy();
    }

    /**
     * @desc Call for destroy object. If it reusable put in pool.
     * @method
     * @public
     */

    kill() {
        if (this._inPool || this._isDestroyed) {
            return;
        }
        if (this._reusable) {
            Pool.putObject(this);
            return;
        }
        this.destroy();
    }

    /**
     * @desc Calls when interactive manager emit event.
     * @method
     * @public
     * @param {mCore.enumerator.ui.INTERACTIVE_EVENT} eventType
     * @param {Object} event
     */

    emitInteractiveEvent(eventType, event) {
        if (!this._hasComponentManager || this.blockEvents) {
            return;
        }
        this._componentManager.iterateUIComponents(component => component.emitInteractiveEvent(eventType, event));
    }

    /**
     * @desc Do layout for element.
     * @method
     * @public
     */

    doLayout() {
        if (this._hasComponentManager && this._componentManager.hasComponent(Constant.COM_UI_LAYOUT_NAME)) {
            /**
             * @type {mCore.component.ui.ComUILayout}
             */
            const layout = this._componentManager.getComponent(Constant.COM_UI_LAYOUT_NAME);
            layout.refresh();
        }
        const children = this.children;
        const childCount = children.length;
        let i, child;
        for (i = 0; i < childCount; ++i) {
            child = children[i];
            if (!child.doLayout) {
                continue;
            }
            child.doLayout();
        }
    }

    /**
     * @desc Set slice of collider if it slice9 sprite.
     * @method
     * @public
     * @param {int} leftSlice
     * @param {int} rightSlice
     * @param {int} topSlice
     * @param {int} bottomSlice
     */

    setSlice(leftSlice = 0, rightSlice = 0, topSlice = 0, bottomSlice = 0) {
        this.slice = [leftSlice, rightSlice, topSlice, bottomSlice];
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
        this.isUpdate = false;

        this.parentTint = Color.COLORS.WHITE;
        this.tint = Color.COLORS.WHITE;
        this.scale.set(1);
        this.anchor.set(0, 0);
        this.visible = true;
        this.position.set(0, 0);
        this.rotation = 0;
        this.interactive = false;
        this._parentTint = Color.COLORS.WHITE;
        this._customTint = Color.COLORS.WHITE;

        this._componentManager = this._killManager(this._componentManager);
        this._listenerManager = this._killManager(this._listenerManager);
        this._animationManager = this._killManager(this._animationManager);
        this._interactionManager = this._killManager(this._interactionManager);

        this._hasListenerManager = false;
        this._hasComponentManager = false;
        this._hasAnimationManager = false;

        const children = this.children.slice(0);
        const childCount = children.length;
        let i, child;

        for (i = 0; i < childCount; ++i) {
            child = children[i];

            if (child.kill) {
                child.kill();
            }
            else {
                super.removeChild(child);
            }
        }
    }

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
     * @method
     * @protected
     * @param {PIXI.DisplayObject | mCore.view.ComponentContainer} child
     *
     */

    updateChildTint(child) {
        if (child.parentTint || child.parentTint === 0) {
            if (child.parentTint === this._realTint) {
                return;
            }
            child.parentTint = this._realTint;
            return;
        }
        if ((!child.tint && child.tint !== 0) || child.tint === this._realTint) {
            return;
        }
        child.tint = this._realTint;
    }

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Safe kill of manager.
     * @method
     * @private
     * @param {mCore.manager.BaseManager} manager
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
     * @desc Update tint of children.
     * @method
     * @private
     */

    _updateTint() {
        this._realTint = Color.multiply(this._parentTint, this._customTint);

        const children = this.children;
        const childCount = children.length;
        for (let i = 0; i < childCount; ++i) {
            this.updateChildTint(children[i]);
        }
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns is object interactive
     * @public
     * @return {boolean}
     */

    get interactive() {
        return super.interactive;
    }

    set interactive(value) {
        if (super.interactive === value) {
            return;
        }
        super.interactive = value;

        if (value || this._hasInteractionManager) {
            this.interactionManager.interactive = value;
        }
    }

    /**
     * @desc Real tint of parent element.
     * @public
     * @type {int}
     */

    get parentTint() {
        return this._parentTint;
    }


    set parentTint(value) {
        if (this._parentTint === value) {
            return;
        }
        this._parentTint = value;
        this._updateTint();
    }

    /**
     * @desc Returns real tint of container.
     * @protected
     * @returns {int}
     */

    get realTint() {
        return this._realTint;
    }

    /**
     * @desc Real tint of parent element.
     * @public
     * @type {int}
     */

    get tint() {
        return this._customTint;
    }


    set tint(value) {
        if (this._customTint === value) {
            return;
        }
        this._customTint = value;
        this._updateTint();
    }

    /**
     * @desc Returns is container marked for update.
     * @public
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

        if (Type.isEmpty(this._componentManager)) {
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
        return this._reusable;
    }

    set reusable(value) {
        if (this._reusable === value) {
            return;
        }
        this._reusable = value;
    }

    /**
     * @desc Flag is need to block events dispatching for view.
     * @public
     * @type {boolean}
     */

    get blockEvents() {
        return this._blockEvents || (this._hasListenerManager && this._listenerManager.blockEvents);
    }

    set blockEvents(value) {
        if (this._blockEvents === value) {
            return;
        }
        this._blockEvents = value;
        if (!this._hasListenerManager) {
            return;
        }
        this._listenerManager.blockEvents = value;
    }

    /**
     * @public
     * @type {boolean}
     */

    get inPool() {
        return this._inPool;
    }

    set inPool(value) {
        if (this._inPool === value) {
            return;
        }
        this._inPool = value;
    }

    /**
     * @desc Type of ui element (Widget, ComponentContainer, Button etc.).
     * @public
     * @readonly
     * @type {mCore.enumerator.ui.UI_ELEMENT}
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
     * @desc Link to animation manager.
     * @public
     * @readonly
     * @return {mCore.manager.AnimationManager}
     */

    get animationManager() {
        if (!this._hasAnimationManager) {
            this._hasAnimationManager = true;
            this._animationManager = AnimationManager.create(this);
        }
        return this._animationManager;
    }

    /**
     * @desc Link to component manager
     * @readonly
     * @public
     * @return {mCore.manager.ComponentManager}
     */

    get componentManager() {
        if (!this._hasComponentManager) {
            this._hasComponentManager = true;
            this._componentManager = ComponentManager.create(this);
        }
        return this._componentManager;
    }

    /**
     * @desc Link to listener manager.
     * @public
     * @return {mCore.manager.ListenerManager}
     */

    get listenerManager() {
        if (!this._hasListenerManager) {
            this._hasListenerManager = true;
            this._listenerManager = ListenerManager.create(this);
            this._listenerManager.blockEvents = this._blockEvents;
        }
        return this._listenerManager;
    }

    /**
     * @desc Link to listener manager.
     * @public
     * @return {mCore.manager.InteractionManager}
     */

    get interactionManager() {
        if (!this._hasInteractionManager) {
            this._hasInteractionManager = true;
            this._interactionManager = InteractionManager.create(this);
        }
        return this._interactionManager;
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

    /**
     * @desc Flag is view has interaction manager.
     * @public
     * @return {mCore.manager.InteractionManager}
     */

    get hasInteractionManager() {
        return this._interactionManager;
    }
}

export default ImageView;
