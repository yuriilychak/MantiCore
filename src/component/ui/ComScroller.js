import SCROLL_DIRECTION from "enumerator/ui/ScrollDirection";
import Component from "component/Component";


class ComScroller extends Component {
    constructor() {
        super("ComScroller");

        /**
         * @desc Direction of scroller.
         * @type {MANTICORE.enumerator.ui.SCROLL_DIRECTION}
         * @private
         */

        this._direction = SCROLL_DIRECTION.BOTH;

        this._outOfBoundaryAmount = new PIXI.Point(0, 0);
        this._autoScrollTargetDelta = new PIXI.Point(0, 0);
        this._autoScrollStartPosition = new PIXI.Point(0, 0);
        this._autoScrollBrakingStartPosition = new PIXI.Point(0, 0);
        this._touchMoveDisplacements = [];
        this._touchMoveTimeDeltas = [];
        this._touchMovePreviousTimestamp = 0;
    }

    onAdd(owner) {
        super.onAdd(owner);
    }
}