import ComponentContainer from "./ComponentContainer";
import type from "util/Type";

/**
 * @desc Class for manipulate with game scenes.
 * @class
 * @extends MANTICORE.view.ComponentContainer
 * @memberOf MANTICORE.view
 */

class Scene extends ComponentContainer {

    /**
     * @constructor
     * @param {MANTICORE.component.Component} [comTransitionShow = null] - Component for transition start animation.
     * @param {MANTICORE.component.Component} [comTransitionHide = null] - Component for transition end animation.
     */

    constructor(comTransitionShow = null, comTransitionHide = null) {
        super();

        /**
         * @desc Component for show transition.
         * @type {?MANTICORE.component.Component}
         * @private
         */

        this._comTransitionShow = comTransitionShow;
        if (!type.isNull(this._comTransitionShow)) {
            this.componentManager.addComponent(this._comTransitionShow);
        }

        /**
         * @desc Component for hide transition.
         * @type {?MANTICORE.component.Component}
         * @private
         */

        this._comTransitionHide = comTransitionHide;
        if (!type.isNull(this._comTransitionHide)) {
            this.componentManager.addComponent(this._comTransitionHide);
        }
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Show scene.
     * @method
     * @public
     */

    show() {
        this.onShowStart();

        if (type.isNull(this._comTransitionShow)) {
            this.onShowComplete();
        }
    }

    /**
     * @desc Hide scene.
     * @method
     * @public
     */

    hide() {
        this.onHideStart();

        if (type.isNull(this._comTransitionHide)) {
            this.onHideComplete();
        }
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Calls when show start with or without transition.
     * @method
     * @protected
     */

    onShowStart () {}

    /**
     * @desc Calls when show complete with or without transition.
     * @method
     * @protected
     */

    onShowComplete () {}

    /**
     * @desc Calls when hide start with or without transition.
     * @method
     * @protected
     */

    onHideStart () {}

    /**
     * @desc Calls when hide complete with or without transition.
     * @method
     * @protected
     */

    onHideComplete () {}
}

export default Scene;