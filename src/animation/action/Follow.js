import Action from "./Action";
import Type from "util/Type";
import Launcher from "launcher";
import Geometry from "util/Geometry";
import Math from "util/Math";
import Point from "geometry/Point";
import Rectangle from "geometry/Rectangle";

/**
 * @desc  Follow action which makes its target follows another DisplayObject.
 * @class
 * @extends mCore.animation.action.Action
 * @memberOf mCore.animation.action
 */

class Follow extends Action {
    /**
     * @constructor
     * @param {PIXI.DisplayObject} followedDisplayObject
     * @param {mCore.geometry.Rectangle} rect
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
         * @type {?mCore.geometry.Point}
         * @private
         */
        this._halfScreenSize = null;
        /**
         * @desc Fast access to the screen dimensions.
         * @type {?mCore.geometry.Point}
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
         * @type {mCore.geometry.Rectangle}
         * @private
         */
        this._worldRect = Rectangle.create(0, 0, 0, 0);

        /**
         * @desc Need to don't create point every step.
         * @type {mCore.geometry.Point}
         * @private
         */

        this._zeroPoint = Point.create();

        this.initWithTarget(followedDisplayObject, rect);
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {mCore.animation.action.Follow}
     */

    clone() {
        const rect = Rectangle.create(this._worldRect.x, this._worldRect.y, this._worldRect.width, this._worldRect.height);
        return Follow.create(this._followedDisplayObject, rect);
    }
    
    /**
     * @desc Initializes the action with a set boundary.
     * @param {PIXI.DisplayObject} followedDisplayObject
     * @param {mCore.geometry.Rectangle} [rect = null]
     * @return {boolean}
     */

    initWithTarget(followedDisplayObject, rect = null) {
        if (Type.isEmpty(followedDisplayObject)) {
            return false;
        }

        const app = Launcher.app;
        rect = Type.setValue(rect, Rectangle.create(0, 0, 0, 0));

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

            this.target.position.set(Math.range(nextPos.x, this._leftBoundary, this._rightBoundary), Math.range(nextPos.y, this._bottomBoundary, this._topBoundary));
            return;
        }
        this.target.position.set(nextPos.x, nextPos.y);
    }

    stop() {
        this.target = null;
        super.stop();
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {PIXI.DisplayObject} followedDisplayObject
     * @param {mCore.geometry.Rectangle} rect
     */

    reuse(followedDisplayObject, rect) {
        super.reuse();
        this._followedDisplayObject = null;
        this._boundarySet = false;
        this._boundaryFullyCovered = false;
        this._halfScreenSize = null;
        this._fullScreenSize = null;
        this._leftBoundary = 0;
        this._rightBoundary = 0;
        this._topBoundary = 0;
        this._bottomBoundary = 0;
        this._worldRect.x = 0;
        this._worldRect.y = 0;
        this._worldRect.width = 0;
        this._worldRect.height = 0;
        this._zeroPoint.set(0, 0);

        this.initWithTarget(followedDisplayObject, rect)
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data befor disuse and destroy.
     * @method
     * @protected
     */

    clearData() {
        this._followedDisplayObject = null;
        this._boundarySet = false;
        this._boundaryFullyCovered = false;
        this._halfScreenSize = null;
        this._fullScreenSize = null;
        this._leftBoundary = 0;
        this._rightBoundary = 0;
        this._topBoundary = 0;
        this._bottomBoundary = 0;
        this._worldRect.x = 0;
        this._worldRect.y = 0;
        this._worldRect.width = 0;
        this._worldRect.height = 0;
        this._zeroPoint.set(0, 0);
        super.clearData();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    get isDone() {
        return !this._followedDisplayObject.visible;
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
}

export default Follow;
