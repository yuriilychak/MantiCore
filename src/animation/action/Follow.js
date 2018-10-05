import Action from "./Action";
import Type from "util/Type";
import Launcher from "launcher";
import Geometry from "util/Geometry";
import Math from "util/Math";

/**
 * @desc  Follow action which makes its target follows another DisplayObject.
 * @class
 * @extends MANTICORE.animation.action.Action
 * @memberOf MANTICORE.animation.action
 */

class Follow extends Action {
    /**
     * @constructor
     * @param {PIXI.DisplayObject} followedDisplayObject
     * @param {PIXI.Rectangle | Rectangle} rect
     */
    constructor(followedDisplayObject, rect) {
        super();
        /**
         * @desc Display object to follow
         * @type {?PIXI.DisplayObject}
         * @private
         */
        this._followedDisplayObject = null;
        /**
         * @desc Whether camera should be limited to certain area
         * @type {boolean}
         * @private
         */
        this._boundarySet = false;
        /**
         * @desc If screen size is bigger than the boundary - update not needed
         * @type {boolean}
         * @private
         */
        this._boundaryFullyCovered = false;
        /**
         * @desc Fast access to the screen dimensions.
         * @type {?PIXI.Point}
         * @private
         */
        this._halfScreenSize = null;
        /**
         * @desc Fast access to the screen dimensions.
         * @type {?PIXI.Point}
         * @private
         */
        this._fullScreenSize = null;

        /**
         * @type {int}
         * @private
         */
        this._leftBoundary = 0;
        /**
         * @type {int}
         * @private
         */
        this._rightBoundary = 0;
        /**
         * @type {int}
         * @private
         */
        this._topBoundary = 0;
        /**
         * @type {int}
         * @private
         */
        this._bottomBoundary = 0;
        /**
         * @type {PIXI.Rectangle | Rectangle}
         * @private
         */
        this._worldRect = new PIXI.Rectangle(0, 0, 0, 0);

        /**
         * @desc Need to don't create point every step.
         * @type {PIXI.Point | Point}
         * @private
         */

        this._zeroPoint = new PIXI.Point();

        this.initWithTarget(followedDisplayObject, rect)
    }

    clone() {
        const rect = new PIXI.Rectangle(this._worldRect.x, this._worldRect.y, this._worldRect.width, this._worldRect.height);
        return new Follow(this._followedDisplayObject, rect);
    }

    /**
     * @desc Get whether camera should be limited to certain area.
     * @public
     * @return {boolean}
     */
    get boundarySet() {
        return this._boundarySet;
    }

    set boudarySet(value) {
        this._boundarySet = value;
    }
    
    /**
     * @desc Initializes the action with a set boundary.
     * @param {PIXI.DisplayObject} followedDisplayObject
     * @param {PIXI.Rectangle | Rectangle} [rect = null]
     * @return {boolean}
     */

    initWithTarget(followedDisplayObject, rect = null) {
        if (Type.isEmpty(followedDisplayObject)) {
            return false;
        }

        const app = Launcher.getApp();
        rect = Type.setValue(rect, new PIXI.Rectangle(0, 0, 0, 0));

        this._followedDisplayObject = followedDisplayObject;
        this._worldRect = rect;
        this._boundarySet = !(rect.width === 0 && rect.height === 0);
        this._boundaryFullyCovered = false;
        this._fullScreenSize = Geometry.pFromSize(app.screen);
        this._halfScreenSize = Geometry.pHalfSize(app.screen);

        if (!this._boundarySet) {
            return true;
        }

        this._leftBoundary = this._fullScreenSize.x - rect.x - rect.width;
        this._rightBoundary = -rect.x;
        this._topBoundary = -rect.y;
        this._bottomBoundary = this._fullScreenSize.y - rect.y - rect.height;

        if (this._rightBoundary < this._leftBoundary) {
            this._rightBoundary = this._leftBoundary = Math.divPowTwo(this._leftBoundary + this._rightBoundary);
        }
        if (this._topBoundary < this._bottomBoundary) {
            this._topBoundary = this._bottomBoundary = Math.divPowTwo(this._topBoundary + this._bottomBoundary);
        }

        if ((this._topBoundary === this._bottomBoundary) && (this._leftBoundary === this._rightBoundary)) {
            this._boundaryFullyCovered = true;
        }
        return true;
    }

    step(dt) {
        const targetWorldPos = this.target.toGlobal(this._zeroPoint);
        const followedWorldPos = this._followedDisplayObject.toGlobal(this._zeroPoint);
        Geometry.pSub(targetWorldPos, followedWorldPos, true);
        const nextPos = this.target.parent.toLocal(Geometry.pAdd(targetWorldPos, this._halfScreenSize, true));

        if (this._boundarySet) {
            if (this._boundaryFullyCovered) {
                return;
            }

            this.target.setPosition(Math.range(nextPos.x, this._leftBoundary, this._rightBoundary), Math.range(nextPos.y, this._bottomBoundary, this._topBoundary));
            return;
        }
        this.target.setPosition(nextPos.x, nextPos.y);
    }

    get isDone() {
        return !this._followedDisplayObject.visible;
    }

    stop() {
        this.target = null;
        super.stop();
    }
}

export default Follow;