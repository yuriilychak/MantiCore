import launcher from "launcher/index";

import Asset from "util/Asset";
import Type from "util/Type";
import Geometry from "util/Geometry";

import UI_ELEMENT from "enumerator/ui/UIElement";

import AnimationManager from "manager/AnimationManager";
import ComponentManager from "manager/ComponentManager";
import ListenerManager from "manager/ListenerManager";
import MemoryManager from "manager/MemoryManager";
import TIME_LINE from "../enumerator/TimeLine";
import Macro from "../macro";

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
         * @type {MANTICORE.manager.ComponentManager}
         * @private
         */

        this._componentManager = new ComponentManager(this);

        /**
         * @desc Manager of listeners.
         * @type {MANTICORE.manager.ListenerManager}
         * @private
         */

        this._listenerManager = new ListenerManager(this);

        /**
         * @desc Class for manipulate with memory.
         * @type {MANTICORE.manager.MemoryManager}
         * @private
         */

        this._memoryManager = new MemoryManager(this);

        /**
         * @desc Class for manipulate with animations.
         * @type {MANTICORE.manager.AnimationManager}
         * @private
         */

        this._animationManager = new AnimationManager(this);

        /**
         * @desc Flag is container marked for update;
         * @type {boolean}
         * @private
         */

        this._isUpdate = false;

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
     * @desc Add component to container, returns falls if component already add.
     * @method
     * @public
     * @param {MANTICORE.component.Component} component
     * @returns {boolean}
     */

    addComponent(component) {
        return this._componentManager.addComponent(component);
    }

    /**
     * @desc Add components to container.
     * @method
     * @public
     * @param {MANTICORE.component.Component[]} components
     */

    addComponents(components) {
        this._componentManager.addComponents(components);
    }

    /**
     * @desc Returns component by name, if it don't attach returns null.
     * @method
     * @public
     * @param {string} name
     * @returns {MANTICORE.component.Component | null}
     */

    getComponent(name) {
        return this._componentManager.getComponent(name);
    }

    /**
     * @desc Remove component from container;
     * @method
     * @public
     * @param {string} name
     * @returns {boolean}
     */

    removeComponent(name) {
        return this._componentManager.removeComponent(name);
    }

    /**
     * @desc Remove all components from target;
     * @method
     * @public
     */

    removeAllComponents() {
        return this._componentManager.removeAllComponents();
    }

    /**
     * @desc Add time line to manager.
     * @method
     * @public
     * @param {string} name
     * @param {MANTICORE.animation.ActionAnimation | MANTICORE.animation.action.ActionInterval} animation
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine]
     * @returns {boolean}
     */

    addAnimation(name, animation, timeLine = TIME_LINE.MAIN) {
        return this._animationManager.addAnimation(name, animation, timeLine);
    }

    /**
     * @desc Remove animation if it exist.
     * @method
     * @public
     * @param {string} name
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine = null]
     * @returns {boolean}
     */

    removeAnimation(name, timeLine = null) {
        return this._animationManager.removeAnimation(name, timeLine);
    }

    /**
     * @desc Remove all animations from time line.
     * @method
     * @public
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine]
     */

    removeAllAnimations(timeLine = TIME_LINE.MAIN) {
        return this._animationManager.removeAllAnimations(timeLine);
    }

    /**
     * @desc Run tween action for container.
     * @method
     * @public
     * @param {MANTICORE.animation.action.Action} action
     * @param {boolean} [loop = false] - Is need to loop animation.
     * @param {int} frame [frame = 0] - Start frame of animation.
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine = null] - Time line to play.
     */

    runAction(action, loop = false, frame = 0, timeLine = null) {
        this._animationManager.runAction(action, loop, frame, timeLine);
        this.isUpdate = true;
    }

    /**
     * @desc Play animation if it exist
     * @method
     * @public
     * @param {string} name - Name of animation to play.
     * @param {boolean} [loop = false] - Is need to loop animation.
     * @param {int} frame [frame = 0] - Start frame of animation.
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine = null] - Time line to play.
     * @returns {boolean}
     */

    play(name, loop = false, frame = 0, timeLine = null) {
        const result = this._animationManager.play(name, loop, frame, timeLine);
        this.isUpdate = true;
        return result;
    }

    /**
     * @desc Stop animation by frame.
     * @method
     * @public
     * @param {string} name
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine = null]
     * @returns {boolean}
     */

    stop(name, timeLine = null) {
        return this._animationManager.stop(name, timeLine);
    }

    /**
     * @desc Stop time line if it run some animation.
     * @method
     * @public
     * @param {string | MANTICORE.enumerator.TIME_LINE} timeLine
     * @returns {boolean}
     */

    stopTimeLine(timeLine) {
        return this._animationManager.stopTimeLine(timeLine);
    }

    /**
     * @desc Pause animation in time line if it playing.
     * @method
     * @public
     * @param {string} name
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine = null]
     * @returns {boolean}
     */

    pause(name, timeLine = null) {
        return this._animationManager.pause(name, timeLine);
    }

    /**
     * @desc Pause time line if it playing.
     * @method
     * @public
     * @param {string | MANTICORE.enumerator.TIME_LINE | null} timeLine
     * @returns {boolean}
     */

    pauseTimeLine(timeLine) {
        return this._animationManager.pauseTimeLine(timeLine);
    }

    /**
     * @desc Resume animation in time line if it paused.
     * @method
     * @public
     * @param {string} name
     * @param {string | MANTICORE.enumerator.TIME_LINE} [timeLine = null]
     * @returns {boolean}
     */

    resume(name, timeLine = null) {
        return this._animationManager.resume(name, timeLine);
    }

    /**
     * @desc Pause time line if it playing.
     * @method
     * @public
     * @param {string | MANTICORE.enumerator.TIME_LINE | null} timeLine
     * @returns {boolean}
     */

    resumeTimeLine(timeLine) {
        return this._animationManager.resumeTimeLine(timeLine);
    }

    /**
     * @desc Add time line to manager.
     * @method
     * @public
     * @param {string} name
     * @param {MANTICORE.animation.ActionTimeLine} [timeLine = null]
     * @return {boolean}
     */

    addTimeLine(name, timeLine = null) {
        return this._animationManager.addTimeLine(name, timeLine);
    }

    /**
     * @method
     * @public
     * @param {string | MANTICORE.enumerator.TIME_LINE} name
     * @return {boolean}
     */

    removeTimeLine(name) {
        return this._animationManager.removeTimeLine(name);
    }

    /**
     * @desc Remove all time lines.
     * @method
     * @public
     */

    removeAllTimeLines() {
        this._animationManager.removeAllTimeLines();
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
        for (let i = 0; i < argumentCount; ++i) {
            Geometry.pSub(arguments[i].position, offset, true);
            arguments[i].scale.copy(scale);
            result.push(super.addChild(arguments[i]));
        }
        this._componentManager.childAction(result, (component, child) => component.onAddChild(child));
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
        this._componentManager.childAction([result], (component, child) => component.onAddChild(child));
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
        this._componentManager.childAction(result, (component, child) => component.onRemoveChild(child));
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
        this._componentManager.childAction([result], (component, child) => component.onRemoveChild(child));
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
        this._componentManager.childAction(result, (component, child) => component.onRemoveChild(child));
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
        this._componentManager.destroy();
        this._listenerManager.destroy();
        this._memoryManager.destroy();
        this._animationManager.destroy();
        super.destroy();
    }

    /**
     * @desc Call for destroy object. If it reusable put in pool.
     * @method
     * @public
     */

    kill() {
        this._memoryManager.kill();
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Add event listener for element.
     * @method
     * @protected
     * @param {string} event
     * @param {Function} handler
     */

    addEventListener(event, handler) {
        this._listenerManager.addEventListener(event, handler);
    }

    /**
     * @desc Remove event listener.
     * @method
     * @protected
     * @param {string} event
     */

    removeEventListener(event) {
        this._listenerManager.removeEventListener(event);
    }

    /**
     * @desc Dispatch event.
     * @method
     * @protected
     * @param {string} event
     * @param {*} [data = null]
     */

    dispatchEvent(event, data = null) {
        this._listenerManager.dispatchEvent(event, data);
    }

    /**
     * @desc Handler that calls if container mark for update.
     * @method
     * @protected
     * @param {number} dt - Time step of update.
     *
     */

    onUpdate(dt) {
        const step = dt / Macro.FPS;
        this._animationManager.update(step);
        this._componentManager.update(step);
        this.isUpdate = this._animationManager.active || this._componentManager.active;
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
        return this._memoryManager.reusable;
    }

    set reusable(value) {
        this._memoryManager.reusable = value;
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

        const app = launcher.getApp();
        const ticker = app.ticker;

        if (this._isUpdate) {
            ticker.add(this.onUpdate, this);
            return;
        }

        ticker.remove(this.onUpdate, this);
    }

}

export default ComponentSprite;