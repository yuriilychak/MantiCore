import RESOLUTION from "enumerator/Resolution";
import Color from "util/Color";
import Timer from "timer";
import Boot from "boot";

let application = null;

/**
 * @desc Contains all basic functional for manipulate with application
 * @namespace MANTICORE.launcher
 * @memberOf MANTICORE
 */

export default {
    /**
     * @desc create application with parameters.
     * @function
     * @memberOf MANTICORE.launcher
     * @param {MANTICORE.view.Scene} startScene
     * @param {MANTICORE.enumerator.RESOLUTION} resolution
     * @param {int} [bgColor = 0x000000]
     */
    initApp: function (startScene, resolution, bgColor = Color.COLORS.BLACK) {
        Boot.init(() => {
            let width, height;

            switch (resolution) {
                case RESOLUTION.R_800_600: {
                    width = 800;
                    height = 600;
                    break;
                }
                case RESOLUTION.R_1280_720: {
                    width = 1280;
                    height = 720;
                    break;
                }
                case RESOLUTION.R_1920_1080: {
                    width = 1920;
                    height = 1080;
                    break;
                }
                default: {
                    width = 640;
                    height = 480;
                }
            }
            application = new PIXI.Application(width, height, {backgroundColor: bgColor});
            document.body.appendChild(application.view);
            Timer.enterFrameTimer = application.ticker;

            MANTICORE.launcher.runScene(new startScene());
        });
    },

    /**
     * @desc return linkage to application object.
     * @function
     * @memberOf MANTICORE.launcher
     * @returns {PIXI.Application}
     */
    getApp() {
        return application;
    },

    /**
     * @desc Run new scene with replacing old.
     * @function
     * @memberOf MANTICORE.launcher
     * @param {MANTICORE.view.Scene} scene
     */

    runScene(scene) {
        application.stage.addChild(scene);
        scene.show();
    }
};