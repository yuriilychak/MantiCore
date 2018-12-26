import RESOLUTION from "enumerator/Resolution";
import Timer from "timer";
import Boot from "boot";
import Macro from "macro";
import Type from "util/Type";
import Math from "util/Math";
import EventDispatcher from "eventDispatcher";
import SYSTEM_EVENT from "enumerator/SystemEvent";
import ORIENTATION from "enumerator/system/Orientation";
import Point from "geometry/Point";

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
     * @desc create application with parameters.
     * @function
     * @memberOf MANTICORE.launcher
     * @param {MANTICORE.enumerator.RESOLUTION | int[]} resolution
     * @param {MANTICORE.launcher.AppConfig} [config = {}]
     * @param {Function} [onComplete]
     */
    initApp: function (parentContainer, resolution, config = {}, onComplete = null) {
        Boot.init(() => {
            if (Type.isArray(resolution)) {
                this._designResolution.set(resolution[0], resolution[1]);
            }
            else {
                switch (resolution) {
                    case RESOLUTION.R_800_600: {
                        this._designResolution.set(800, 600);
                        break;
                    }
                    case RESOLUTION.R_1280_720: {
                        this._designResolution.set(1280, 720);
                        break;
                    }
                    case RESOLUTION.R_1920_1080: {
                        this._designResolution.set(1920, 1080);
                        break;
                    }
                    default: {
                        this._designResolution.set(640, 480);
                    }
                }
            }

            this._appResolution.copyFrom(this._designResolution);
            this._canvasResolution.copyFrom(this._designResolution);

            config.width = Type.setValue(config.width, this._designResolution.x);
            config.height = Type.setValue(config.height, this._designResolution.y);

            this._app = new PIXI.Application(this._designResolution.x, this._designResolution.y, config);
            parentContainer.appendChild(this._app.view);
            Timer.enterFrameTimer = this._app.ticker;

            if (Macro.PARTICLES_ENABLED) {
                this._particleSystem = new revolt.FX();
                this._app.ticker.add(function () {
                    this._particleSystem.update();
                });

            }

            if (!Type.isNull(onComplete)) {
                onComplete();
            }
        });
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

    runScene: function(scene) {
        this._app.stage.addChild(scene);
        scene.show();
    },

    /**
     * @desc Resize app according width and height.
     * @function
     * @public
     * @param {number} width
     * @param {number} height
     */

    resize: function(width, height) {
        this._canvasResolution.set(width, height);
        const hProportion = this._canvasResolution.x / this._designResolution.x;
        const vProportion = this._canvasResolution.y / this._designResolution.y;
        this._appResolution.x = this._designResolution.x;
        this._appResolution.y = this._designResolution.y;

        if (hProportion < vProportion) {
            this._appResolution.y = Math.ceil(this._canvasResolution.y / hProportion);
        }
        else {
            this._appResolution.x = Math.ceil(this._canvasResolution.x / vProportion);
        }

        const scale = Math.min(this._canvasResolution.x / this._designResolution.x, this._canvasResolution.y / this._designResolution.y);
        const renderWidth = this._canvasResolution.x > this._canvasResolution.y ? this._designResolution.x : this._designResolution.y;
        const renderHeight = this._canvasResolution.x > this._canvasResolution.y ? this._designResolution.x : this._designResolution.y;
        this._app.renderer.resize(renderWidth, renderHeight);

        this._app.view.style.width = `${Math.ceil(renderWidth * scale)}px`;
        this._app.view.style.height = `${Math.ceil(renderHeight * scale)}px`;

        EventDispatcher.dispatch(SYSTEM_EVENT.RESIZE);
    },

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