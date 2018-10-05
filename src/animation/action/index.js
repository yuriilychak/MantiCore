import Action from "./Action";
import ActionInstant from "./ActionInstant";
import ActionInterval from "./ActionInterval";
import FiniteTimeAction from "./FiniteTimeAction";
import Follow from "./Follow";
import Hide from "./Hide";
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
    FiniteTimeAction,
    Follow,
    Hide,
    RemoveSelf,
    Show,
    Speed,
    ToggleVisibility
}