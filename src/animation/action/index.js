import Action from "./Action";
import ActionInstant from "./ActionInstant";
import ActionInterval from "./ActionInterval";
import CallFunc from "./CallFunc";
import FiniteTimeAction from "./FiniteTimeAction";
import FlipX from "./FlipX";
import FlipY from "./FlipY";
import Follow from "./Follow";
import Hide from "./Hide";
import Place from "./Place";
import RemoveSelf from "./RemoveSelf";
import Show from "./Show";
import Speed from "./Speed";
import ToggleVisibility from "./ToggleVisibility";

Show.prototype.reverse = function () {
    return new Hide();
};

Hide.prototype.reverse = function () {
    return new Show();
};

/**
 * @desc Namespace that contain actions for use in animation.
 * @namespace action
 * @memberOf MANTICORE.animation
 */

export default {
    Action,
    ActionInstant,
    ActionInterval,
    CallFunc,
    FiniteTimeAction,
    FlipX,
    FlipY,
    Follow,
    Hide,
    Place,
    RemoveSelf,
    Show,
    Speed,
    ToggleVisibility
}