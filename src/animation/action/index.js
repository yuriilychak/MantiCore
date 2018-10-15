import Action from "./Action";
import ActionInstant from "./ActionInstant";
import ActionInterval from "./ActionInterval";
import BezierBy from "./BezierBy";
import BezierTo from "./BezierTo";
import Blink from "./Blink";
import CallFunc from "./CallFunc";
import CardinalSpline from "./CardinalSpline";
import CardinalSplineBy from "./CardinalSplineBy";
import CardinalSplineTo from "./CardinalSplineTo";
import CatmullRomBy from "./CatmullRomBy";
import CatmullRomTo from "./CatmullRomTo";
import DelayTime from "./DelayTime";
import FadeIn from "./FadeIn";
import FadeOut from "./FadeOut";
import FadeTo from "./FadeTo";
import FiniteTimeAction from "./FiniteTimeAction";
import FlipX from "./FlipX";
import FlipY from "./FlipY";
import Follow from "./Follow";
import Hide from "./Hide";
import JumpBy from "./JumpBy";
import JumpTo from "./JumpTo";
import MoveBy from "./MoveBy";
import MoveTo from "./MoveTo";
import Place from "./Place";
import PointAction from "./PointAction";
import RemoveSelf from "./RemoveSelf";
import Repeat from "./Repeat";
import RepeatForever from "./RepeatForever";
import ReversTime from "./ReverseTime";
import RotateBy from "./RotateBy";
import RotateTo from "./RotateTo";
import ScaleBy from "./ScaleBy";
import ScaleTo from "./ScaleTo";
import Sequence from "./Sequence";
import Show from "./Show";
import SkewBy from "./SkewBy";
import SkewTo from "./SkewTo";
import Spawn from "./Spawn";
import Speed from "./Speed";
import TargetedAction from "./TargetedAction";
import TintBy from "./TintBy";
import TintTo from "./TintTo";
import ToggleVisibility from "./ToggleVisibility";
import Tween from "./Tween";

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
    BezierBy,
    BezierTo,
    Blink,
    CallFunc,
    CardinalSpline,
    CardinalSplineBy,
    CardinalSplineTo,
    CatmullRomBy,
    CatmullRomTo,
    DelayTime,
    FadeIn,
    FadeOut,
    FadeTo,
    FiniteTimeAction,
    FlipX,
    FlipY,
    Follow,
    Hide,
    JumpBy,
    JumpTo,
    MoveBy,
    MoveTo,
    Place,
    PointAction,
    RemoveSelf,
    Repeat,
    RepeatForever,
    ReversTime,
    RotateBy,
    RotateTo,
    ScaleBy,
    ScaleTo,
    Sequence,
    Show,
    SkewBy,
    SkewTo,
    Spawn,
    Speed,
    TargetedAction,
    TintBy,
    TintTo,
    ToggleVisibility,
    Tween
}