import Timer from "timer";
import Boot from "boot";
import Type from "util/Type";
import Math from "util/Math";
import EventDispatcher from "eventDispatcher";
import SYSTEM_EVENT from "enumerator/event/SystemEvent";
import ORIENTATION from "enumerator/system/Orientation";
import Point from "geometry/Point";
import ParticleSystem from "particleSystem";

/**
 * @desc Contains all basic functional for manipulate with application
 * @namespace MANTICORE.launcher
 * @memberOf MANTICORE
 */

export default {

    /**
     * @desc Application that use game.
     * @memberOf MANTICORE.launcher
     * @type {?PIXI.Application | Application}
     * @private
     */
    _app: null,

    /**
     * @desc Design resolution of app.
     * @type {MANTICORE.geometry.Point}
     * @private
     */

    _designResolution: Point.create(0, 0),

    /**
     * @desc Resolution of app.
     * @type {MANTICORE.geometry.Point}
     * @private
     */

    _appResolution: Point.create(0, 0),

    /**
     * @desc Real resolution of app.
     * @type {MANTICORE.geometry.Point}
     * @private
     */

    _canvasResolution: Point.create(0, 0),

    /**
     * @desc Orientation of screen.
     * @type {MANTICORE.enumerator.system.ORIENTATION}
     * @private
     */

    _orientation: ORIENTATION.AUTO,

    /**
     * @desc Current game scene.
     * @type {MANTICORE.view.Scene}
     * @private
     */

    _crtScene: null,

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc create application with parameters.
     * @function
     * @memberOf MANTICORE.launcher
     * @param {int} [designWidth = 800]
     * @param {int} [designHeight = 600]
     * @param {MANTICORE.launcher.AppConfig} [config = {}]
     * @param {Function} [onComplete = null]
     * @param {HTMLElement} [parentContainer = null]
     */

    initApp(config = {}, designWidth = 800, designHeight = 600, onComplete = null, parentContainer = null) {
        Boot.init(() => {
            this._designResolution.set(designWidth, designHeight);

            this._appResolution.copyFrom(this._designResolution);
            this._canvasResolution.copyFrom(this._designResolution);

            config.width = Type.setValue(config.width, this._designResolution.x);
            config.height = Type.setValue(config.height, this._designResolution.y);

            this._app = new PIXI.Application(config);

            if (!Type.isNull(parentContainer)) {
                parentContainer.appendChild(this._app.view);
            }

            Timer.enterFrameTimer = this._app.ticker;

            ParticleSystem.init();

            if (!Type.isNull(onComplete)) {
                onComplete();
            }
        }, Type.setValue(parentContainer, config.view.parentNode));
    },

    /**
     * @desc return linkage to application object.
     * @public
     * @memberOf MANTICORE.launcher
     * @returns {PIXI.Application}
     */
    get app() {
        return this._app;
    },

    /**
     * @desc Run new scene with replacing old.
     * @function
     * @memberOf MANTICORE.launcher
     * @param {MANTICORE.view.Scene} scene
     */

    runScene(scene) {
        if (!Type.isNull(this._crtScene)) {
            this._crtScene.kill();
        }
        this._crtScene = scene;
        this._app.stage.addChild(scene);
        scene.show();
    },

    /**
     * @desc Resize app according width and height.
     * @function
     * @public
     * @param {number} width
     * @param {number} height
     * @param {boolean} [resizeRenderer = false]
     */

    resize(width, height, resizeRenderer = false) {
        this._canvasResolution.set(Math.ceil(width), Math.ceil(height));

        if (!resizeRenderer) {
            const proportion = Math.min(
                this._canvasResolution.x / this._designResolution.x,
                this._canvasResolution.y / this._designResolution.y
            );
            this._doResize(proportion);
        }
        else {
            this._designResolution.copyFrom(this._canvasResolution);
            this._doResize();
        }
    },

    /**
     * PRIVATE METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Resize rendere and canvas
     * @function
     * @param {number} [proportion = 1]
     * @private
     */

    _doResize(proportion = 1) {
        this._appResolution.x =  Math.ceil(this._canvasResolution.x / proportion);
        this._appResolution.y = Math.ceil(this._canvasResolution.y / proportion);
        this._app.renderer.resize(this._designResolution.x, this._designResolution.y);
        this._app.view.width = Math.ceil(this._designResolution.x * proportion);
        this._app.view.height = Math.ceil(this._designResolution.y * proportion);
        if (proportion === 1) {
            this._app.renderer.resolution = 1;
        }
        EventDispatcher.dispatch(SYSTEM_EVENT.RESIZE);
    },

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Returns design resolution of app.
     * @function
     * @public
     * @returns {MANTICORE.geometry.Point}
     */

    get designResolution() {
        return this._designResolution;
    },

    /**
     * @desc Returns real resolution of app.
     * @function
     * @public
     * @returns {MANTICORE.geometry.Point|Point}
     */

    get appResolution() {
        return this._appResolution;
    },

    /**
     * @desc Returns real resolution of app.
     * @function
     * @public
     * @returns {MANTICORE.geometry.Point|Point}
     */

    get canvasResolution() {
        return this._appResolution;
    },

    /**
     * @desc Orientation of app.
     * @public
     * @returns {MANTICORE.enumerator.system.ORIENTATION}
     */

    get orientation() {
        return this._orientation
    },

    set orientation(value) {
        if (this._orientation === value) {
            return;
        }
        this._orientation = value;
        this.resize(this._canvasResolution.x, this._canvasResolution.y);
    },

    /**
     * @public
     * @return {MANTICORE.view.Scene}
     */

    get currentScene() {
        return this._crtScene;
    }
};

/**
 * @typedef {Object}
 * @name AppConfig
 * @memberOf MANTICORE.launcher
 * @property {boolean} [autoStart = true] - Automatically starts the rendering after the construction. Note: Setting this parameter to false does NOT stop the shared ticker even if you set options.sharedTicker to true in case that it is already started. Stop it by your own.
 * @property {int} [width = 800] - The width of the renderer view.
 * @property {int} [height = 600] - The height of the renderer view.
 * @property {HTMLCanvasElement} [view] - The canvas to use as a view, optional.
 * @property {boolean} [transparent = false] - If the render view is transparent.
 * @property {boolean} [autoDensity = false] - Resizes renderer view in CSS pixels to allow for resolutions other than 1.
 * @property {boolean} [antialias = false] - Sets antialias (only applicable in Chrome at the moment).
 * @property {boolean} [preserveDrawingBuffer = false] - Enables drawing buffer preservation, enable this if you need to call toDataUrl on the WebGL context.
 * @property {number} [resolution = 1] - The resolution / device pixel ratio of the renderer, retina would be 2.
 * @property {boolean} [forceCanvas = false] - Prevents selection of WebGL renderer, even if such is present.
 * @property {int} [backgroundColor = 0x000000] - The background color of the rendered area (shown if not transparent).
 * @property {boolean} [clearBeforeRender = true] - This sets if the renderer will clear the canvas or not before the new render pass.
 * @property {boolean} [forceFXAA = false] - Forces FXAA antialiasing to be used over native. FXAA is faster, but may not always look as great. (WebGL only).
 * @property {string} [powerPreference] - Parameter passed to webgl context, set to "high-performance" for devices with dual graphics card. (WebGL only).
 * @property {boolean} [sharedTicker = false] - true to use PIXI.Ticker.shared, false to create new ticker.
 * @property {boolean} [sharedLoader = false] - true to use PIXI.Loaders.shared, false to create new Loader.
 * @property {Window | HTMLElement} resizeTo - Element to automatically resize stage to.
 */
