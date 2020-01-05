import Timer from "timer";

import Asset from "util/Asset";
import Geometry from "util/Geometry";
import Math from "util/Math";
import Color from "util/Color";
import Type from "util/Type";

import UI_ELEMENT from "enumerator/ui/UIElement";

import AnimationManager from "manager/AnimationManager";
import ComponentManager from "manager/ComponentManager";
import ListenerManager from "manager/ListenerManager";
import InteractionManager from "manager/InteractionManager";

import Point from "geometry/Point";

import Pool from "pool";
import Constant from "constant";

/**
 * @desc Class that implements composite pattern for sprite;
 * @class
 * @extends PIXI.Sprite
 * @memberOf mCore.view
 */

class ComponentSprite extends PIXI.Sprite {
    /**
     * @constructor
     * @param {string} frameName - Link to sprite frame.
     */
    constructor(frameName) {
        super(Asset.getSpriteFrame(frameName));

        /**
         * @type {number}
         * @private
         */

        this._uid = PIXI.utils.uid();

        /**
         * @desc Manager of components.
         * @type {?mCore.manager.ComponentManager}
         * @private
         */

        this._componentManager = null;

        /**
         * @desc Manager of listeners.
         * @type {mCore.manager.ListenerManager}
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

        this._uiType = UI_ELEMENT.SPRITE;

        /**
         * @desc Flag is need to block event dispatch.
         * @type {boolean}
         * @private
         */

        this._blockEvents = false;

        /**
         * @type {number | string | Object | Array | boolean | null}
         * @private
         */

        this._userData = null;

        /**
         * @type {Point}
         * @private
         */

        this._size = Point.create(super.width, super.height);

        this._size.initChangeCallback(this.onSizeChange, this);

        this._updateTint();

        this.name = `stageElement_${this._uid.toString(10).padStart(6, "0")}`;
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
        const offset = Geometry.pCompMult(Geometry.pFromSize(this), this.anchor);
        const scale = Geometry.pInvert(this.scale);
        let i, child;
        for (i = 0; i < argumentCount; ++i) {
            child = arguments[i];
            Geometry.pSub(child.position, offset, true);
            this.updateChildTint(child);
            child.scale.copyFrom(scale);
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
        Geometry.pSub(child.position, Geometry.pCompMult(Geometry.pFromSize(this), this.anchor), true);
        child.scale.copyFrom(Geometry.pInvert(this.scale));
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
     * @param {string} frameName - Link to sprite frame.
     */
    reuse(frameName) {
        this.texture = Asset.getSpriteFrame(frameName);
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
        if (!this._hasComponentManager || !this._componentManager.hasComponent(Constant.COM_UI_LAYOUT_NAME)) {
            return;
        }
        /**
         * @type {mCore.component.ui.ComUILayout}
         */
        const layout = this._componentManager.getComponent(Constant.COM_UI_LAYOUT_NAME);
        layout.refresh();
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
        this.position.set(0, 0);
        this.visible = true;
        this.rotation = 0;
        this.interactive = false;
        this._parentTint = Color.COLORS.WHITE;
        super.tint = Color.COLORS.WHITE;

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
        if (!Type.isUndefined(child.parentTint)) {
            child.parentTint = this._realTint;
            return;
        }
        if (Type.isUndefined(child.tint)) {
            return;
        }
        child.tint = this._realTint;
    }

    /**
     * @desc Calls when size of object change.
     * @method
     * @protected
     */

    onSizeChange() {
        super.width = this._size.x;
        super.height = this._size.y;
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
        if (Type.isUndefined(this._parentTint)) {
            this._parentTint = Color.COLORS.WHITE;
        }
        this._realTint = Color.multiply(this._parentTint, this._customTint);
        super.tint = this._realTint;
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
     * @desc Returns width of object
     * @public
     * @return {number}
     */

    get width() {
        return this._size.x;
    }

    set width(value) {
        if (this._size.x === value) {
            return;
        }

        this._size.x = value;
    }

    /**
     * @desc Returns width of object
     * @public
     * @return {number}
     */

    get height() {
        return this._size.y;
    }

    set height(value) {
        if (this._size.y === value) {
            return;
        }

        this._size.y = value;
    }

    /**
     * @desc Size of element
     * @public
     * @return {Point}
     */

    get rate() {
        return this._size;
    }

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
        if (Type.isEmpty(value) || this._parentTint === value) {
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
        if (Type.isUndefined(this._customTint)) {
            this._tint = value;
            return;
        }
        if (this._customTint === value) {
            return;
        }
        this._customTint = value;
        this._updateTint();
    }

    /**
     * @public
     * @returns {boolean}
     */

    get visible() {
        return !!this._visible;
    }

    set visible(value) {
        if (this._visible === value) {
            return;
        }
        this._visible = value;
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
     * @desc Flag is view currently in pool.
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

    /**
     * @desc User data of element
     * @public
     * @return {number | string | Object | Array | boolean | null}
     */

    get userData() {
        return this._userData;
    }

    set userData(value) {
        if (this._userData === value) {
            return;
        }
        this._userData = value;
    }

    /**
     * @public
     * @return {number}
     */

    get uid() {
        return this._uid;
    }
}

export default ComponentSprite;
