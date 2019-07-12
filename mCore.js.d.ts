declare namespace mCore {
    export namespace animation {
        export namespace action {
            export class Action extends MANTICORE.memory.ReusableObject{
                constructor ();

                readonly isDone: boolean;
                target: PIXI.DisplayObject;
                originalTarget: PIXI.DisplayObject;

                clone(): MANTICORE.animation.action.Action;
                hasTarget(): boolean;
                startWithTarget(target: PIXI.DisplayObject): void;
                stop(): void;
                step(dt: number): void;
                update (dt: number):void;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.Action>(): T;
            }

            export class ActionInstant extends MANTICORE.animation.action.FiniteTimeAction{
                reverse(): any;
                clone(): MANTICORE.animation.action.ActionInstant;
                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.ActionInstant>(): T;
            }

            export class ActionInterval extends MANTICORE.animation.action.FiniteTimeAction {
                constructor(duration?: number);

                readonly elapsed: number;
                ease: MANTICORE.animation.easing.EaseBase;
                repeatForever: boolean;
                speedMethod: boolean;
                repeatMethod: boolean;
                amplitudeRate: number;
                speed: number;

                clone(): MANTICORE.animation.action.ActionInterval;
                changeSpeed(speed: number): number;
                repeat(times: number): void;

                protected doClone<T extends MANTICORE.animation.action.ActionInterval>(action: T): T;
                protected doReverse<T extends MANTICORE.animation.action.ActionInterval>(action: T): T;
                protected computeEaseTime(dt: number): number;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.ActionInterval>(duration?: number): T;
            }

            export class BezierBy extends MANTICORE.animation.action.ActionInterval{
                constructor(duration: number, controlPoints: MANTICORE.geometry.Point[]);

                protected readonly startPoint: MANTICORE.geometry.Point;
                protected readonly config: MANTICORE.geometry.Point[];

                clone(): MANTICORE.animation.action.BezierBy;
                reverse(): MANTICORE.animation.action.BezierBy;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.BezierBy>(duration: number, controlPoints: MANTICORE.geometry.Point[]): T;
            }

            export class BezierTo extends MANTICORE.animation.action.BezierBy {
                clone(): MANTICORE.animation.action.BezierTo;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.BezierTo>(duration: number, controlPoints: MANTICORE.geometry.Point[]): T;
            }

            export class Blink extends ActionInterval {
                constructor(duration: number, blinks: number);

                clone(): MANTICORE.animation.action.Blink;
                reverse(): MANTICORE.animation.action.Blink;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.Blink>(duration: number, blinks: number): T;
            }

            export class CallFunc extends MANTICORE.animation.action.ActionInstant {
                constructor(callback: MANTICORE.animation.callback.CallFuncExecute, context?: Object, data?: any);

                context: Object | null;

                execute(): void;
                clone(): MANTICORE.animation.action.CallFunc;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.CallFunc>(callback: MANTICORE.animation.callback.CallFuncExecute, context?: Object, data?: any): T;
            }

            export class CardinalSpline extends MANTICORE.animation.action.ActionInterval {
                protected static cardinalSplineAt(p0: MANTICORE.geometry.Point, p1: MANTICORE.geometry.Point, p2: MANTICORE.geometry.Point, p3: MANTICORE.geometry.Point, tension: number, t: number): MANTICORE.geometry.Point;
                protected static getControlPointAt(controlPoints: MANTICORE.geometry.Point[], pos: number): MANTICORE.geometry.Point;
                protected static reverseControlPoints(controlPoints: MANTICORE.geometry.Point[]): MANTICORE.geometry.Point[];
                protected static cloneControlPoints(controlPoints: MANTICORE.geometry.Point[]): MANTICORE.geometry.Point[];

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.CardinalSpline>(duration: number): T;
            }

            export class CardinalSplineBy extends MANTICORE.animation.action.CardinalSplineTo {
                constructor(duration: number, points: MANTICORE.geometry.Point[], tension?: number);

                clone(): MANTICORE.animation.action.CardinalSplineBy;
                reverse(): MANTICORE.animation.action.CardinalSplineBy;
                updatePosition(newPos: MANTICORE.geometry.Point): void;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.CardinalSplineBy>(duration: number): T;
            }

            export class CardinalSplineTo extends MANTICORE.animation.action.CardinalSpline {
                constructor(duration: number, points: MANTICORE.geometry.Point[], tension?: number);

                points: MANTICORE.geometry.Point[];
                protected readonly tension: number;
                protected previousPosition: MANTICORE.geometry.Point;

                clone(): MANTICORE.animation.action.CardinalSplineTo;
                reverse(): MANTICORE.animation.action.CardinalSplineTo;
                updatePosition(newPos: MANTICORE.geometry.Point): void;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.CardinalSplineTo>(duration: number): T;
            }

            export class CatmullRomBy extends MANTICORE.animation.action.CardinalSplineBy {
                constructor(duration: number, points: MANTICORE.geometry.Point[]);

                clone(): MANTICORE.animation.action.CatmullRomBy;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.CatmullRomBy>(duration: number, points: MANTICORE.geometry.Point[]): T;
            }

            export class CatmullRomTo extends MANTICORE.animation.action.CardinalSplineTo {
                constructor(duration: number, points: MANTICORE.geometry.Point[]);

                clone(): MANTICORE.animation.action.CatmullRomTo;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.CatmullRomTo>(duration: number, points: MANTICORE.geometry.Point[]): T;
            }

            export class DelayTime extends MANTICORE.animation.action.ActionInterval{
                reverse(): MANTICORE.animation.action.DelayTime;
                clone(): MANTICORE.animation.action.DelayTime;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.DelayTime>(duration: number): T;
            }

            export class FadeIn extends MANTICORE.animation.action.FadeTo {
                constructor(duration: number);
                reverse(): MANTICORE.animation.action.FadeTo;
                clone(): MANTICORE.animation.action.FadeIn;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.FadeIn>(duration: number): T;
            }

            export class FadeOut extends MANTICORE.animation.action.FadeTo {
                constructor(duration: number);

                reverse(): MANTICORE.animation.action.FadeTo;
                clone(): MANTICORE.animation.action.FadeOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.FadeOut>(duration: number): T;
            }

            export class FadeTo extends MANTICORE.animation.action.ActionInterval{
                constructor(duration: number, alpha: number);

                clone(): MANTICORE.animation.action.FadeTo;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.FadeTo>(duration: number, alpha: number): T;
            }

            export class FiniteTimeAction extends MANTICORE.animation.action.Action {
                duration: number;
                repeatCount: number;
                repeatMethod: boolean;

                reverse(): MANTICORE.animation.action.FiniteTimeAction;
                clone(): MANTICORE.animation.action.FiniteTimeAction;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.FiniteTimeAction>(): T;
            }

            export class FlipX extends MANTICORE.animation.action.ActionInstant {
                clone(): MANTICORE.animation.action.FlipX;
                reverse(): MANTICORE.animation.action.FlipX;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.FlipX>(): T;
            }

            export class FlipY extends MANTICORE.animation.action.ActionInstant {
                reverse(): MANTICORE.animation.action.FlipY;
                clone(): MANTICORE.animation.action.FlipY;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.FlipY>(): T;
            }

            export class Follow extends MANTICORE.animation.action.Action {
                constructor(followedDisplayObject: PIXI.DisplayObject, rect: PIXI.Rectangle);

                boundarySet: boolean;

                clone(): MANTICORE.animation.action.Follow;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.Follow>(followedDisplayObject: PIXI.DisplayObject, rect: PIXI.Rectangle): T;
            }

            export class FrameChange extends MANTICORE.animation.action.ActionInstant {
                constructor(frame: string);
                clone(): MANTICORE.animation.action.FrameChange;
                reverse(): MANTICORE.animation.action.FrameChange;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.FrameChange>(frame: string): T;
            }

            export class Hide extends MANTICORE.animation.action.ActionInstant {
                clone(): MANTICORE.animation.action.Hide;
                reverse(): MANTICORE.animation.action.Show;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.Hide>(): T;
            }

            export class JumpBy extends MANTICORE.animation.action.ActionInterval {
                constructor(duration: number, position: MANTICORE.geometry.Point | number, y: number, height: number, jumps?: number);

                clone(): MANTICORE.animation.action.JumpBy;
                reverse(): MANTICORE.animation.action.JumpBy;

                protected readonly height: number;
                protected readonly jumps: number;
                protected readonly delta: MANTICORE.geometry.Point;
                protected readonly startPoint: MANTICORE.geometry.Point;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.JumpBy>(duration: number, position: MANTICORE.geometry.Point | number, y: number, height: number, jumps?: number): T;
            }

            export class JumpTo extends MANTICORE.animation.action.JumpBy {
                constructor(duration: number, position: MANTICORE.geometry.Point | number, y: number, height: number, jumps?: number);

                clone(): MANTICORE.animation.action.JumpTo;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.JumpTo>(duration: number, position: MANTICORE.geometry.Point | number, y: number, height: number, jumps?: number): T;
            }

            export class MoveBy extends MANTICORE.animation.action.ActionInterval {
                constructor(duration: number, deltaPos: MANTICORE.geometry.Point | number, deltaY?: number);

                protected readonly delta: MANTICORE.geometry.Point;

                clone(): MANTICORE.animation.action.MoveBy;
                reverse(): MANTICORE.animation.action.MoveBy;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.MoveBy>(duration: number, deltaPos: MANTICORE.geometry.Point | number, deltaY?: number): T;
            }

            export class MoveTo extends MANTICORE.animation.action.MoveBy {
                constructor(duration: number, position: MANTICORE.geometry.Point | number, y: number);

                clone(): MANTICORE.animation.action.MoveTo;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.MoveTo>(duration: number, position: MANTICORE.geometry.Point | number, y: number): T;
            }

            export class Place extends MANTICORE.animation.action.ActionInstant {
                constructor(x: MANTICORE.geometry.Point | number, y?: number);

                clone(): MANTICORE.animation.action.Place;
                reverse(): MANTICORE.animation.action.Place;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.Place>(x: MANTICORE.geometry.Point | number, y?: number): T;
            }

            export class PointAction extends MANTICORE.animation.action.ActionInterval{
                constructor(duration: number, x: number, y?:number);

                protected readonly startPoint: MANTICORE.geometry.Point;
                protected readonly endPoint: MANTICORE.geometry.Point;
                protected readonly delta: MANTICORE.geometry.Point;
                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.PointAction>(duration: number, x: number, y?:number): T;
            }

            export class RemoveSelf extends MANTICORE.animation.action.ActionInstant {
                constructor(isKill?: boolean);
                clone(): MANTICORE.animation.action.RemoveSelf;
                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.RemoveSelf>(isKill?: boolean): T;
            }

            export class Repeat extends ActionInterval {
                constructor(action: MANTICORE.animation.action.FiniteTimeAction, times?: number);

                clone(): MANTICORE.animation.action.Repeat;
                reverse(): MANTICORE.animation.action.Repeat;

                innerAction: MANTICORE.animation.action.FiniteTimeAction;
                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.Repeat>(action: MANTICORE.animation.action.FiniteTimeAction, times?: number): T;
            }

            export class RepeatForever extends MANTICORE.animation.action.ActionInterval{
                constructor(action: MANTICORE.animation.action.ActionInterval);

                innerAction: MANTICORE.animation.action.ActionInterval;

                clone(): MANTICORE.animation.action.RepeatForever;
                reverse(): MANTICORE.animation.action.RepeatForever;
                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.RepeatForever>(action: MANTICORE.animation.action.ActionInterval): T;
            }

            export class ReverseTime extends MANTICORE.animation.action.ActionInterval {
                constructor(action: MANTICORE.animation.action.FiniteTimeAction);

                clone(): MANTICORE.animation.action.ReverseTime;
                reverse(): MANTICORE.animation.action.ReverseTime;
                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.ReverseTime>(action: MANTICORE.animation.action.FiniteTimeAction): T;
            }

            export class RotateBy extends MANTICORE.animation.action.ActionInterval {
                constructor(duration: number, deltaAngle: number);

                clone(): MANTICORE.animation.action.RotateBy;
                reverse(): MANTICORE.animation.action.RotateBy;
                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.RotateBy>(duration: number, deltaAngle: number): T;
            }

            export class RotateTo extends MANTICORE.animation.action.ActionInterval{
                constructor(duration: number, deltaAngle: number);

                clone(): MANTICORE.animation.action.RotateTo;
                reverse(): null;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.RotateTo>(duration: number, deltaAngle: number): T;
            }

            export class ScaleBy extends MANTICORE.animation.action.ScaleTo {
                reverse(): MANTICORE.animation.action.ScaleBy;
                clone(): MANTICORE.animation.action.ScaleBy;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.ScaleBy>(duration: number, sx: number, sy?:number): T;
            }

            export class ScaleTo extends MANTICORE.animation.action.PointAction{
                constructor(duration: number, sx: number, sy?:number);

                clone(): MANTICORE.animation.action.ScaleTo;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.ScaleTo>(duration: number, sx: number, sy?:number): T;
            }

            export class Sequence extends MANTICORE.animation.action.ActionInterval {
                constructor(...var_args: MANTICORE.animation.action.FiniteTimeAction[]);

                reversed: boolean;

                clone(): MANTICORE.animation.action.Sequence;
                reverse(): MANTICORE.animation.action.Sequence;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.Sequence>(...var_args: MANTICORE.animation.action.FiniteTimeAction[]): T;
            }

            export class Show extends MANTICORE.animation.action.ActionInstant {
                clone(): MANTICORE.animation.action.Show;
                reverse(): MANTICORE.animation.action.Hide;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.Show>(): T;
            }

            export class SkewBy extends MANTICORE.animation.action.SkewTo{
                constructor(t: number, sx: number, sy: number);

                clone(): MANTICORE.animation.action.SkewBy;
                reverse(): MANTICORE.animation.action.SkewBy;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.SkewBy>(t: number, sx: number, sy: number): T;
            }

            export class SkewTo extends MANTICORE.animation.action.PointAction{
                constructor(t: number, sx: number, sy: number);

                clone(): MANTICORE.animation.action.SkewTo;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.SkewTo>(t: number, sx: number, sy: number): T;
            }

            export class Spawn extends ActionInterval {
                constructor(...var_args: MANTICORE.animation.action.FiniteTimeAction[]);

                clone(): MANTICORE.animation.action.Spawn;
                reverse(): MANTICORE.animation.action.Spawn;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.Spawn>(...var_args: MANTICORE.animation.action.FiniteTimeAction[]): T;
            }

            export class Speed extends Action{
                constructor (action: MANTICORE.animation.action.ActionInterval, speed: number);

                speed: number;
                innerAction: MANTICORE.animation.action.ActionInterval;

                clone(): MANTICORE.animation.action.Speed;
                reverse(): MANTICORE.animation.action.Speed;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.Speed>(action: MANTICORE.animation.action.ActionInterval, speed: number): T;
            }

            export class TargetedAction extends MANTICORE.animation.action.ActionInterval {
                constructor(target: PIXI.DisplayObject, action: MANTICORE.animation.action.FiniteTimeAction);

                forcedTarget: PIXI.DisplayObject;

                clone(): MANTICORE.animation.action.TargetedAction;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.TargetedAction>(target: PIXI.DisplayObject, action: MANTICORE.animation.action.FiniteTimeAction): T;
            }

            export class TintBy extends MANTICORE.animation.action.ActionInterval{
                constructor(duration: number, deltaRed: number, deltaGreen: number, deltaBlue: number);

                clone(): MANTICORE.animation.action.TintBy;
                reverse(): MANTICORE.animation.action.TintBy;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.TintBy>(duration: number, deltaRed: number, deltaGreen: number, deltaBlue: number): T;
            }

            export class TintTo extends MANTICORE.animation.action.ActionInterval {
                constructor(duration: number, red: number, green: number, blue: number);

                clone(): MANTICORE.animation.action.TintTo;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.TintTo>(duration: number, deltaRed: number, deltaGreen: number, deltaBlue: number): T;
            }

            export class ToggleVisibility extends MANTICORE.animation.action.ActionInstant {
                clone(): MANTICORE.animation.action.ToggleVisibility;
                reverse(): MANTICORE.animation.action.ToggleVisibility;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.ToggleVisibility>(): T;
            }

            export class Tween extends MANTICORE.animation.action.ActionInterval {
                constructor(duration: number, key: string, from:  number, to: number);
                reverse(): MANTICORE.animation.action.Tween;
                clone(): MANTICORE.animation.action.Tween;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.action.Tween>(duration: number, key: string, from:  number, to: number): T;
            }
        }
        export namespace callback {
            export type CallFuncExecute = (target: PIXI.DisplayObject, data?: any)=>void;
        }
        export namespace easing {
            export class EaseBackIn extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseBackIn;
                clone(): EaseBackIn;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseBackIn>(): T;
            }
            export class EaseBackInOut extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseBackInOut;
                clone(): EaseBackInOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseBackInOut>(): T;
            }
            export class EaseBackOut extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseBackOut;
                clone(): EaseBackOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseBackOut>(): T;
            }
            export class EaseBase extends MANTICORE.memory.ReusableObject {
                constructor();
                easing(time: number): void;
                reverse(): EaseBase;
                clone(): EaseBase;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseBase>(): T;
            }
            export class EaseBezier extends MANTICORE.animation.easing.EaseBase {
                constructor(first: number, second: number, third: number, fourth: number);
                reverse(): EaseBezier;
                clone(): EaseBezier;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseBezier>(): T;
            }
            export class EaseBounceIn extends MANTICORE.animation.easing.EaseBounceTime {
                reverse(): EaseBounceIn;
                clone(): EaseBounceIn;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseBounceIn>(): T;
            }
            export class EaseBounceInOut extends MANTICORE.animation.easing.EaseBounceTime {
                reverse(): EaseBounceInOut;
                clone(): EaseBounceInOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseBounceInOut>(): T;
            }
            export class EaseBounceOut extends MANTICORE.animation.easing.EaseBounceTime {
                reverse(): EaseBounceOut;
                clone(): EaseBounceOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseBounceOut>(): T;
            }
            export class EaseBounceTime  extends EaseBase {
                protected bounceTime (time: number): number;
                reverse(): EaseBounceTime;
                clone(): EaseBounceTime;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseBounceTime>(): T;
            }
            export class EaseCircleIn extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseCircleIn;
                clone(): EaseCircleIn;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseCircleIn>(): T;
            }
            export class EaseCircleInOut extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseCircleInOut;
                clone(): EaseCircleInOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseCircleInOut>(): T;
            }
            export class EaseCircleOut extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseCircleOut;
                clone(): EaseCircleOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseCircleOut>(): T;
            }
            export class EaseCubicIn extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseCubicIn;
                clone(): EaseCubicIn;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseCubicIn>(): T;
            }
            export class EaseCubicInOut extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseCubicInOut;
                clone(): EaseCubicInOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseCubicInOut>(): T;
            }
            export class EaseCubicOut extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseCubicOut;
                clone(): EaseCubicOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseCubicOut>(): T;
            }
            export class EaseElasticIn  extends MANTICORE.animation.easing.EasePeriod {
                reverse(): EaseElasticIn;
                clone(): EaseElasticIn;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseElasticIn>(): T;
            }
            export class EaseElasticInOut  extends MANTICORE.animation.easing.EasePeriod {
                reverse(): EaseElasticInOut;
                clone(): EaseElasticInOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseElasticInOut>(): T;
            }
            export class EaseElasticOut  extends MANTICORE.animation.easing.EasePeriod {
                reverse(): EaseElasticOut;
                clone(): EaseElasticOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseElasticOut>(): T;
            }
            export class EaseExponentialIn extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseExponentialIn;
                clone(): EaseExponentialIn;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseExponentialIn>(): T;
            }
            export class EaseExponentialInOut extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseExponentialInOut;
                clone(): EaseExponentialInOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseExponentialInOut>(): T;
            }
            export class EaseExponentialOut extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseExponentialOut;
                clone(): EaseExponentialOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseExponentialOut>(): T;
            }
            export class EaseIn extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseIn;
                clone(): EaseIn;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseIn>(rate?: number): T;
            }
            export class EaseInOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseInOut;
                clone(): EaseInOut

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseInOut>(rate?: number): T;
            }
            export class EaseOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseOut;
                clone(): EaseOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseOut>(rate?: number): T;
            }
            export class EasePeriod extends MANTICORE.animation.easing.EaseBase {
                constructor(period?: number);

                public period: number;

                reverse(): EasePeriod;
                clone(): EasePeriod;

                protected calculateTime(time: number, period: number): number;
                protected easingPeriod(time: number);
                protected easingDefault(time: number): number;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EasePeriod>(period?: number): T;
            }

            export class EaseQuadraticIn extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuadraticIn;
                clone(): EaseQuadraticIn;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseQuadraticIn>(): T;
            }
            export class EaseQuadraticInOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuadraticInOut;
                clone(): EaseQuadraticInOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseQuadraticInOut>(): T;
            }
            export class EaseQuadraticOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuadraticOut;
                clone(): EaseQuadraticOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseQuadraticOut>(): T;
            }
            export class EaseQuarticIn extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuarticIn;
                clone(): EaseQuarticIn;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseQuarticIn>(): T;
            }
            export class EaseQuarticInOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuarticInOut;
                clone(): EaseQuarticInOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseQuarticInOut>(): T;
            }
            export class EaseQuarticOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuarticOut;
                clone(): EaseQuarticOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseQuarticOut>(): T;
            }
            export class EaseQuinticIn extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuinticIn;
                clone(): EaseQuinticIn;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseQuinticIn>(): T;
            }
            export class EaseQuinticInOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuinticInOut;
                clone(): EaseQuinticInOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseQuinticInOut>(): T;
            }
            export class EaseQuinticOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuinticOut;
                clone(): EaseQuinticOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseQuinticOut>(): T;
            }
            export class EaseRate extends MANTICORE.animation.easing.EaseBase {
                constructor(rate?: number);
                public rate;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseRate>(rate?: number): T;
            }
            export class EaseSineIn extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseSineIn;
                clone(): EaseSineIn;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseSineIn>(): T;
            }
            export class EaseSineInOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseSineInOut;
                clone(): EaseSineInOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseSineInOut>(): T;
            }
            export class EaseSineOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseSineOut;
                clone(): EaseSineOut;

                // noinspection JSAnnotator
                static create<T extends MANTICORE.animation.easing.EaseSineOut>(): T;
            }
        }

        export namespace timeLine {
            export class ActionTimeLine extends MANTICORE.animation.timeLine.BaseTimeLine{
                constructor(target: PIXI.DisplayObject, name);

                public inherit: boolean;
                public isResetParameters: boolean;
                public readonly isDone: boolean;

                public clone(): MANTICORE.animation.timeLine.ActionTimeLine;
                public addNestedChild(child: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite): void;
                public removeNestedChild(child: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite): void;

                public refreshStartParameters(): void;
                public addAnimation(name: string, animation: MANTICORE.animation.ActionAnimation): boolean;
                public removeAnimation(name: string): boolean;
                public removeAllAnimations(): void;

                public runAction(action: MANTICORE.animation.action.Action, loop?: boolean): void;
                public resetParameters(): void;
            }

            export class BaseTimeLine extends MANTICORE.memory.ReusableObject{
                constructor(target: PIXI.DisplayObject, name);

                name: string;
                fps: number;
                loop: boolean;
                type: MANTICORE.enumerator.animation.TIME_LINE_TYPE;
                protected readonly fpsCoef;
                protected runningName;
                protected target: PIXI.DisplayObject;
                readonly animations: string;
                readonly isEmpty: boolean;
                readonly isPlaying: boolean;
                readonly isRunning: boolean;
                readonly duration: number;

                hasAnimation(name: string): boolean;
                isPlay(animationName: string): boolean;
                play(name: string, loop?: boolean): boolean;
                pause(): void;
                resume(): void;
                update(dt: number): void;
                stop(): boolean;
                setEvent(eventId: MANTICORE.enumerator.animation.TIME_LINE_EVENT, event: string | null);

                protected runAnimation(name: string): void;
                protected playAnimation(): void;
                protected clearRunningAnimation(): boolean;
                protected dispatchEvent(eventId: MANTICORE.enumerator.animation.TIME_LINE_EVENT): void;
            }

            export class SpineTimeLine extends MANTICORE.animation.timeLine.BaseTimeLine{
                constructor(target: PIXI.DisplayObject, name);
            }
        }

        export class ActionAnimation extends MANTICORE.memory.ReusableObject {
            constructor(action: MANTICORE.animation.action.ActionInterval);

            positionOffset: MANTICORE.geometry.Point;
            scaleOffset: MANTICORE.geometry.Point;
            skewOffset: MANTICORE.geometry.Point;
            rotationOffset: number;
            tint: number;
            alpha: number;
            visible: boolean | null;
            readonly isDone: boolean;
            readonly duration: number;

            play(target: PIXI.DisplayObject): void;
            stop(): void;
            update(dt: number): void;
            clone(): MANTICORE.animation.ActionAnimation;
        }
    }

    export namespace boot {
        export const OS_VERSION: string;
        export const OS: MANTICORE.enumerator.system.OS;
        export const BROWSER: MANTICORE.enumerator.system.BROWSER;
        export const BROWSER_VERSION: number;
        export const CLIENT: MANTICORE.enumerator.system.CLIENT;
        export const COOKIES_ENABLED: boolean;
        export const PLATFORM: MANTICORE.enumerator.system.PLATFORM;
        export const MOUSE_ENABLED: boolean;
        export const KEYBOARD_ENABLED: boolean;
        export const TOUCHES_ENABLED: boolean;
        export const ACCELEROMETER_ENABLED: boolean;
        export const TYPED_ARRAY_SUPPORTED: boolean;
        export const SUPPORTED_FORMATS: MANTICORE.enumerator.TEXTURE_FORMAT[];
        export const RESOLUTION: MANTICORE.enumerator.RESOLUTION;

        export function init(callback: Function);
        export function isMobile(): boolean;
        export function isDesktop(): boolean;
        export function dump(): void;
    }

    export namespace builder {
        export namespace layoutBuilder {
            export function infiniteLayout(component: MANTICORE.component.ui.ComLayout): void;
        }
    }

    export namespace bundle {
        export namespace ancillary {
            export class TextureAtlas {
                constructor(baseTexture: PIXI.BaseTexture, atlas: MANTICORE.type.AtlasInfo, bundle: MANTICORE.type.AssetBundle);
            }
        }
        export namespace bundle {
            export class AssetBundle extends MANTICORE.bundle.bundle.BaseBundle {
                constructor (data: MANTICORE.type.AssetBundle);


                readonly linkedTextures: MANTICORE.bundle.bundle.LinkedTexture[];

                generateTextureAtlas(baseTexture: PIXI.BaseTexture, atlas: MANTICORE.type.AtlasInfo): void;
                atlasLoadComplete(): void;

            }
            export class BaseBundle extends MANTICORE.memory.ReusableObject{
                constructor();
            }

            export interface LinkedTexture {
                link: string;
                name: string;
                isLoaded: boolean;
                atlas: MANTICORE.type.AtlasInfo;
            }
        }
        export namespace middleware {
            export function bundleParser(resource: MANTICORE.loader.LoaderResource, next: MANTICORE.loader.LoaderCallback): void;
        }
    }

    export namespace cache {
        export namespace atlasCache{
            export function add(name: string, baseTexture: PIXI.BaseTexture, atlas: MANTICORE.type.AtlasInfo, bundle: MANTICORE.type.AssetBundle): void;
            export function remove(fontName: string): boolean;
        }
        export namespace bundleCache {
            export function addAssetBundle(data: MANTICORE.type.AssetBundle): MANTICORE.bundle.bundle.AssetBundle | null;
            export function getAssetBundle(name: string): MANTICORE.bundle.bundle.AssetBundle | null;
            export function removeAssetBundle(name: string): boolean;
        }
        export namespace fontCache{
            export function add(font: MANTICORE.type.FontData, fontName: string, baseTexture: PIXI.BaseTexture, resolution: number): void;
            export function remove(fontName: string): boolean;
            export function getName(fontName: string, size: number): string;
        }

        export namespace localizationCache {
            export function add(lang: string, data: Object): boolean;
            export function remove(lang: string): boolean;
            export function getCurrentLang(): string;
            export function setCurrentLang(value: string): boolean;
            export function getLocale(key: string): string;
        }

        export namespace particleCache {
            export const names: string[];
            export function add(name: string, data: Object): boolean;
            export function remove(name: string): boolean;
            export function get(name: string): Object | null;
            export function clear(): void;
            export function getParticle(name: string): MANTICORE.cache.particleCache.ParticleInfo | null;
            export interface ParticleInfo {
                name: string;
                type: MANTICORE.enumerator.PARTICLE_TYPE;
                source: string;
            }
        }

        export namespace spineCache {
            export const names: string[];
            export function add(name: string, data: Object): void;
            export function remove(name: string): boolean;
            export function getSkeleton(name: string): PIXI.spine.core.SkeletonData;
        }
    }

    export namespace component {
        namespace callback {
            export type IterateChildren = (child: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite, index?: number, realIndex?: number)=>void;

        }

        export namespace sceneTransition {
            export class ComSceneTransition extends MANTICORE.component.Component {
            }
        }

        export namespace ui {
            export class ComChildListener extends MANTICORE.component.ComChildIterator {
                constructor();

                eventUp: string | null;
                eventDown: string | null;
                eventOver: string | null;
                eventOut: string | null;
                eventMove: string | null;
                eventDrag: string | null;
                eventClick: string | null;
                eventDragStart: string | null;
                eventDragFinish: string | null;

                // noinspection JSAnnotator
                static create(): MANTICORE.component.ui.ComChildListener;
                clone(): MANTICORE.component.ui.ComChildListener;
            }

            export class ComLayout extends MANTICORE.component.ComChildIterator {
                constructor();

                resizeItems: boolean;
                staticWidth: boolean;
                staticHeight: boolean;
                minWidth: number;
                maxWidth: number;
                minHeight: number;
                maxHeight: number;
                contentWidth: number;
                contentHeight: number;
                innerPadding: MANTICORE.geometry.Point;
                outerPadding: MANTICORE.geometry.Point;
                verticalAlign: MANTICORE.enumerator.ui.VERTICAL_ALIGN;
                horizontalAlign: MANTICORE.enumerator.ui.HORIZONTAL_ALIGN;

                // noinspection JSAnnotator
                static create(): MANTICORE.component.ui.ComLayout;
                refresh(): void;
                clone(): MANTICORE.component.ui.ComLayout;
            }

            export class ComItem extends MANTICORE.component.ui.ComUI {
                constructor(name?: string);

                index: number;
                // noinspection JSAnnotator
                static create<T extends MANTICORE.component.ui.ComItem>(): T;
                updateData(data: any): void;
                clone(): MANTICORE.component.ui.ComItem;
            }

            // @ts-ignore
            class ComItemBox extends MANTICORE.component.Component {
                constructor(templateComponent: MANTICORE.component.ui.ComItem, templateName: string, numCount?:number , startIndex?: number);
                readonly startIndex: number;
                readonly templateName: string;
                readonly templateNumCount: number;
                readonly componentTemplate: MANTICORE.component.ui.ComItem;
                readonly length: number;

                // noinspection JSAnnotator
                static create(templateComponent: MANTICORE.component.ui.ComItem, templateName: string, numCount?:number , startIndex?: number): MANTICORE.component.ui.ComItemBox;
                iterateItems(callback: Function, beginIndex?: number, endIndex?: number): void;
                updateData(data: any[]): void;
                getElement<T extends MANTICORE.component.ui.ComItem>(index: number): T | null;
                updateElementData(index: number, data: any): boolean;
                addItem<T extends MANTICORE.view.ComponentContainer>(child: T): void;
                clone(): MANTICORE.component.ui.ComItemBox;
            }

            export class ComScroller extends MANTICORE.component.Component {
                constructor();

                scrollDirection: MANTICORE.enumerator.ui.SCROLL_DIRECTION;
                innerBoundary: MANTICORE.geometry.Point;
                bounceEnabled: boolean;

                jumpToBottom(): void;
                jumpToBottomLeft(): void;
                jumpToBottomRight(): void;
                jumpToLeft(): void;
                jumpToRight(): void;
                jumpToTop(): void;
                jumpToTopLeft(): void;
                jumpToTopRight(): void;
                jumpToPercentBothDirection(percent: number): void;
                jumpToPercentHorizontal(percent: number): void;
                jumpToPercentVertical(percent: number): void;
                scrollToLeft(time: number): void;
                scrollToRight(time: number): void;
                scrollToTop(time: number): void;
                scrollToBottom(time: number): void;
                scrollToTopLeft(time: number): void;
                scrollToTopRight(time: number): void;
                scrollToBottomLeft(time: number): void;
                scrollToBottomRight(time: number): void;
                scrollToPercentHorizontal(time: number, percent: number): void;
                scrollToPercentVertical(time: number, percent: number): void;
                scrollToPercentBoth(time: number, percentH: number, percentV?: number): void;
                updateDragStart(position: MANTICORE.geometry.Point): void;
                updateDragMove(position: MANTICORE.geometry.Point): void;
                updateDragFinish(position: MANTICORE.geometry.Point): void;
                isVertical(): boolean;
                isHorizontal(): boolean;
                updateScrollDimension(progress: number, direction: MANTICORE.enumerator.ui.SCROLL_DIRECTION): void;
                // noinspection JSAnnotator
                static create(): MANTICORE.component.ui.ComScroller;
            }

            export class ComUI extends MANTICORE.component.Component {
                constructor(name?: string);

                listenInteractions: boolean;

                // noinspection JSAnnotator
                static create <T extends MANTICORE.component.ui.ComUI>(name?: string): T;
                emitInteractiveEvent(eventType: MANTICORE.enumerator.ui.INTERACTIVE_EVENT, event: MANTICORE.eventDispatcher.EventModel): void;
                logHierarchy(widget?: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite, maxLevel?: number): void;
                logUnlocalizedFields(widget?: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite): void;
                setChildText<T extends PIXI.Container>(text: any, path: string, widget?: T): boolean;
                localize<T extends PIXI.Container>(key: string, path: string, widget?: T): boolean;
                getChildView<T extends PIXI.Container>(path: string, widget?: T): T | null;
                addComponentToChild<P extends PIXI.Container, T extends MANTICORE.component.Component>(component: T, path?: string, widget?: P): T;
                addChildListener<T extends PIXI.Container>(listener: MANTICORE.eventDispatcher.InteractiveCallback, eventType: MANTICORE.enumerator.ui.INTERACTIVE_EVENT, path: string, widget?: T): boolean;
                removeChildListener<T extends PIXI.Container>(eventType: MANTICORE.enumerator.ui.INTERACTIVE_EVENT, path: string,  widget?: T): boolean;
                removeAllChildListeners() : void;
                clone(): MANTICORE.component.ui.ComUI;
            }


            export class ComUIElement extends MANTICORE.component.ui.ComUI {
                constructor(elementName: string, bundleName?: string, owner?: MANTICORE.view.ComponentContainer);
                // noinspection JSAnnotator
                static create(elementName: string, bundleName?: string, owner?: MANTICORE.view.ComponentContainer): MANTICORE.component.ui.ComUIElement;
                clone(): MANTICORE.component.ui.ComUIElement;
            }

            export class ComUILayout extends MANTICORE.component.Component {
                constructor();

                percentSize: MANTICORE.geometry.Point;
                isPercentSize: boolean;
                isPercentPosX: boolean;
                percentPosX: number;
                isPercentPosY: boolean;
                percentPosY: number;
                horizontalEdge: MANTICORE.enumerator.ui.HORIZONTAL_ALIGN;
                verticalEdge: MANTICORE.enumerator.ui.VERTICAL_ALIGN;
                leftMargin: number;
                rightMargin: number;
                topMargin: number;
                bottomMargin: number;
                isPercentWidth: boolean;
                percentWidth: number;
                isPercentHeight: boolean;
                percentHeight: number;
                isStretchWidth: boolean;
                isStretchHeight: boolean;
                percentOnly: boolean;

                refresh(): void;
            }
        }

        export class ComChildIterator extends MANTICORE.component.Component {
            constructor(name?: string);

            childCount: number;

            // noinspection JSAnnotator
            static create(name?: string): MANTICORE.component.ComChildIterator;
            hasChildren(): void;
            iterateChildren(callback: MANTICORE.component.callback.IterateChildren): void;
            clone(): MANTICORE.component.ComChildIterator;
        }

        // @ts-ignore
        export class Component extends MANTICORE.memory.ReusableObject {
            constructor(name?: string);

            reusable: boolean;
            blockEvents: boolean;
            inPool: boolean;
            name: string;
            owner: MANTICORE.view.ComponentContainer | null;
            active: boolean;
            listenChildren: boolean;
            listenVisible: boolean;
            readonly hasListenerManager: boolean;
            readonly listenerManager: MANTICORE.manager.ListenerManager;

            // noinspection JSAnnotator
            static create<T extends MANTICORE.component.Component>(name?: string): T;
            hasOwner(): boolean;
            onAdd(owner: MANTICORE.view.ComponentContainer): void;
            onRemove(): void;
            onUpdate(dt: number): void;
            onAddChild(child: PIXI.DisplayObject): void;
            onRemoveChild(child: PIXI.DisplayObject): void;
            onVisibleChange(visible: boolean): void;
            clone(): MANTICORE.component.Component;
        }
    }

    export namespace constant {
        export const COLLIDER_NAME: string;
        export const COM_UI_LAYOUT_NAME: string;
        export const COM_LAYOUT: string;
        export const MAIN_ATLAS_NAME: string;
        export const FLT_EPSILON: number;
        export const TEMPORARY_ANIMATION_NAME: string;
        export const DEFAULT_NAME: string;
        export const EMPTY_ID: number;
        export const EMPTY_FONT_ID: string;
        export const OFFSET_EPSILON: number;
    }

    export namespace enumerator {

        export enum ASSET_TYPE {
            UNKNOWN = 0,
            DATA = 1,
            IMAGE = 2,
            SOUND = 3,
            BUNDLE = 4
        }

        export enum BUNDLE_TYPE {
            NONE = 0,
            ASSET = 1,
            LOCALE = 2
        }
        export enum DIRECTION {
            NONE = 0,
            LEFT = 1,
            RIGHT = 2,
            UP = 3,
            DOWN = 4
        }

        export enum ENGINE_MODE {
            DEBUG = 0,
            RELEASE = 1
        }

        export enum FILE_TYPE {
            JSON = "json",
            PNG = "png",
            WEB_P = "webp",
            MP3 = "mp3"
        }

        export enum NUMBER_TYPE {
            INT_8 = 0,
            INT_16 = 1,
            INT_32 = 2,
            UINT_8 = 3,
            UINT_16 = 4,
            UINT_32 = 5,
            FLOAT_32 = 6,
            FLOAT_64 = 7
        }

        export enum PARTICLE_TYPE {
            PARTICLE = 0,
            SEQUENCE = 1
        }

        export enum RESOLUTION {
            R_NONE = 0,
            R_1280_720 = 1,
            R_800_600 = 2,
            R_1920_1080 = 3
        }

        export enum SCENE_TRANSITION {
            SHOW = "TransitionShow",
            HIDE = "TransitionHide"
        }

        export enum TEXTURE_FORMAT {
            PNG = 0,
            WEB_P = 1,
            DDS = 2,
            ATC = 3,
            ASTC = 4,
            PVR = 5,
            ETC1 = 6
        }

        export namespace animation {
            export enum ACTION_EASING {
                LINEAR = 0,

                SINE_IN = 1,
                SINE_OUT = 2,
                SINE_IN_OUT = 3,

                QUAD_IN = 4,
                QUAD_OUT = 5,
                QUAD_IN_OUT = 6,

                CUBIC_IN = 7,
                CUBIC_OUT = 8,
                CUBIC_IN_OUT = 9,

                QUART_IN = 10,
                QUART_OUT = 11,
                QUART_IN_OUT = 12,

                QUINT_IN = 13,
                QUINT_OUT = 14,
                QUINT_IN_OUT = 15,

                EXPO_IN = 16,
                EXPO_OUT = 17,
                EXPO_IN_OUT = 18,

                CIRC_IN = 19,
                CIRC_OUT = 20,
                CIRC_IN_OUT = 21,

                ELASTIC_IN = 22,
                ELASTIC_OUT = 23,
                ELASTIC_IN_OUT = 24,

                BACK_IN = 25,
                BACK_OUT = 26,
                BACK_IN_OUT = 27,

                BOUNCE_IN = 28,
                BOUNCE_OUT = 29,
                BOUNCE_IN_OUT = 30
            }

            export enum ACTION_TYPE {
                NONE = 0,
                POSITION = 1,
                SCALE = 2,
                ROTATION = 3,
                SKEW = 4,
                TINT = 5,
                ALPHA = 6,
                VISIBLE = 7,
                FRAME = 8,
                DELAY = 9
            }

            export enum TIME_LINE_EVENT {
                START = 0,
                END = 1,
                PAUSE = 2,
                RESUME = 3,
                STOP = 4,
                COMPLETE = 5
            }
            export enum TIME_LINE {
                BUTTON = "button",
                CHECK_BOX = "checkBox",
                MAIN = "main",
                SCROLL_VIEW = "scrollView",
                SPINE = "spine",
                UI = "ui"
            }

            export enum TIME_LINE_TYPE {
                NONE = 0,
                ACTION = 1,
                SPINE = 2
            }
        }

        export namespace event {
            export enum KEYBOARD_EVENT {
                DOWN = "KEYBOARD_EVENT.DOWN",
                PRESS = "KEYBOARD_EVENT.PRESS",
                RELEASE = "KEYBOARD_EVENT.RELEASE"
            }

            export enum LOADER_EVENT {
                START = "LOADER_EVENT.START",
                PROGRESS = "LOADER_EVENT.PROGRESS",
                COMPLETE = "LOADER_EVENT.COMPLETE"
            }

            export enum SYSTEM_EVENT {
                FOCUS = "SYSTEM.FOCUS",
                BLUR = "SYSTEM.BLUR",
                VISIBLE = "SYSTEM.VISIBLE",
                HIDDEN = "SYSTEM.HIDDEN",
                LOCALE_CHANGE = "SYSTEM.LOCALE_CHANGE",
                RESIZE = "SYSTEM.RESIZE"
            }
        }

        export namespace system {
            export enum BROWSER {
                UNKNOWN = 0,
                CHROME = 1,
                FIREFOX = 2,
                EDGE = 3,
                OPERA = 4,
                SAFARI = 5,
                IE = 6
            }

            export enum CLIENT {
                UNKNOWN = 0,
                BROWSER = 1,
                NODE = 2,
                CORDOVA = 3,
                ELECTRON = 4,
                COCOON_JS = 5,
                WEB_APP = 6
            }

            export enum OS {
                UNKNOWN = 0,
                IOS = 1,
                ANDROID = 2,
                WINDOWS = 3,
                LINUX = 4,
                WINDOWS_MOBILE = 5,
                BLACKBERRY = 6,
                MAC_OS = 7,
                UNIX = 8,
                BSD = 9,
                SUN = 10,
                TIZEN = 11,
                CHROME_OS = 13,
                KINDLE = 14,
                DEPRECATED_OS = 15,
                SEARCH_BOT = 16
            }

            export enum ORIENTATION {
                AUTO = 0,
                PORTRAIT = 1,
                LANDSCAPE = 2
            }

            export enum PLATFORM {
                UNKNOWN = 0,
                DESKTOP = 1,
                MOBILE = 2
            }

            export enum RESOLUTION {
                SD = 0,
                HD = 1,
                UD = 2
            }
        }

        export namespace ui {
            export enum CLIPPING_TYPE {
                GRAPHIC = 0,
                SPRITE =  1
            }

            export enum CONTAINER_TYPE {
                DEFAULT = 0,
                PARTICLE = 1
            }

            export enum HORIZONTAL_ALIGN {
                NONE = 0,
                LEFT = 1,
                CENTER = 2,
                RIGHT = 3
            }

            export enum INTERACTIVE_EVENT {
                UP = 0,
                DOWN = 1,
                OVER = 2,
                OUT = 3,
                MOVE = 4,
                DRAG = 5,
                CLICK = 6,
                DRAG_FINIS = 7,
                DRAG_START = 8,
                ENABLED_CHANGE = 9
            }

            export enum INTERACTIVE_STATE {
                NONE = 0,
                UP = 1,
                DOWN = 2,
                OVER = 3,
                DISABLED = 4
            }

            export enum PANEL_GRAPHIC_TYPE {
                NONE = 0,
                COLOR = 1,
                SPRITE = 2
            }

            export enum PROGRESS_TYPE {
                NONE = 0,
                SIZE = 1,
                CLIPPING = 2
            }

            export enum PARTICLE_EVENT {
                START = 0,
                EXHAUSTED = 1,
                COMPLETE = 2
            }

            export enum SCROLL_DIRECTION {
                NONE = 0,
                VERTICAL = 1,
                HORIZONTAL = 2,
                BOTH = 3
            }

            export enum TOGGLE_INTERACTIVE_STATE {
                NONE = 0,
                SELECTED_UP = 1,
                SELECTED_DOWN = 2,
                SELECTED_OVER = 3,
                SELECTED_DISABLED = 4,
                DESELECTED_UP = 5,
                DESELECTED_DOWN = 6,
                DESELECTED_OVER = 7,
                DESELECTED_DISABLED = 8
            }

            export enum UI_ELEMENT {
                NONE = 0,
                UI_ELEMENT = 1,
                WIDGET = 2,
                PANEL = 3,
                IMAGE_VIEW = 4,
                BUTTON = 5,
                LABEL = 6,
                SLIDER = 7,
                TOGGLE_BUTTON = 8,
                SPRITE = 9,
                CONTAINER = 10,
                PROGRESS_BAR = 11,
                CHECK_BOX = 12,
                ATLAS_LABEL = 13,
                TEXT_FIELD = 14,
                SCROLL_VIEW = 15,
                LIST_VIEW = 16,
                PAGE_VIEW = 17,
                SPINE = 18,
                PARTICLE = 19
            }

            export enum VERTICAL_ALIGN {
                NONE = 0,
                TOP = 1,
                MIDDLE = 2,
                BOTTOM = 3
            }
        }
    }

    export namespace eventDispatcher {
        export function addListener(type: string, listener: MANTICORE.eventDispatcher.InteractiveCallback, target: Object): void;
        export function hasListener(type: string, target: Object): boolean;
        export function removeListener(type: string, target: Object): boolean;
        export function dispatch(type: string, targetOrEvent?: Object, data?: Object): void;

        type InteractiveCallback = (event: MANTICORE.eventDispatcher.EventModel) => void;

        export class EventModel extends MANTICORE.model.Model {
            constructor(target: Object, data: any);

            data: any;
            target: Object;
        }

        export class ListenerModel extends MANTICORE.model.Model {
            constructor(event: string, listener: MANTICORE.eventDispatcher.InteractiveCallback, target: Object);

            event: string;
            target: Object;

            dispatch(data?: Object): void;
        }
    }

    export namespace geometry {
        export class Point extends PIXI.Point implements MANTICORE.memory.ReusableObject {
            constructor(x?: number, y?: number, type?: MANTICORE.enumerator.NUMBER_TYPE);

            public x: number;
            public y: number;
            public type: MANTICORE.enumerator.NUMBER_TYPE;

            public copyFrom(p: MANTICORE.geometry.Point): void;
            public copyTo(p: MANTICORE.geometry.Point): void;
            public equals (p: MANTICORE.geometry.Point): boolean;
            public set(x: number, y?: number): void;
            public initChangeCallback(callback: Function, context: Object): void;
            public clearChangeCallback(): void;
            public clone(): MANTICORE.geometry.Point;
            // noinspection JSAnnotator
            public static create<T extends MANTICORE.geometry.Point>(x?: number, y?: number, type?: MANTICORE.enumerator.NUMBER_TYPE): T;
        }

        export class Rectangle extends PIXI.Point implements MANTICORE.memory.ReusableObject {
            constructor(x?: number, y?: number, width?: number, height?: number, type?: MANTICORE.enumerator.NUMBER_TYPE);

            public static EMPTY: MANTICORE.geometry.Rectangle;
            public x: number;
            public y: number;
            public width: number;
            public height: number;
            public readonly left: number;
            public readonly right: number;
            public readonly top: number;
            public readonly bottom: number;

            public clone(): MANTICORE.geometry.Rectangle;
            public copyFrom(rectangle: MANTICORE.geometry.Rectangle): MANTICORE.geometry.Rectangle;
            public copyTo(rectangle: MANTICORE.geometry.Rectangle): MANTICORE.geometry.Rectangle;
            public contains(x: number, y: number): boolean;
            public pad(paddingX: number, paddingY: number): void;
            public fit(rectangle: MANTICORE.geometry.Rectangle): void;
            public ceil(resolution?: number, eps?: number): void;
            public enlarge(rectangle: MANTICORE.geometry.Rectangle): void;

            // noinspection JSAnnotator
            public static create<T extends MANTICORE.geometry.Rectangle>(x?: number, y?: number, width?: number, height?: number, type?: MANTICORE.enumerator.NUMBER_TYPE): T;
        }
    }

    export namespace launcher {
        export const app: PIXI.Application;
        export let orientation: MANTICORE.enumerator.system.ORIENTATION;
        export const designResolution: MANTICORE.geometry.Point;
        export const appResolution: MANTICORE.geometry.Point;
        export const canvasResolution: MANTICORE.geometry.Point;
        export const currentScene: MANTICORE.view.Scene;

        export function initApp(config?: MANTICORE.launcher.AppConfig, designWidth?: number, designHeight?: number, onComplete?: Function, parentContainer?: HTMLElement): void;
        export function runScene(scene: MANTICORE.view.Scene): void;
        export function resize(width: number, height: number, resizeRendere?: boolean);

        export interface AppConfig {
            autoStart?: boolean;
            width?: number;
            height?: number;
            view?: HTMLCanvasElement;
            transparent?: boolean;
            autoDensity?: boolean;
            antialias?: boolean;
            preserveDrawingBuffer?: boolean;
            resolution?: number;
            forceCanvas?: boolean;
            backgroundColor?: number;
            clearBeforeRender?: boolean;
            forceFXAA?: boolean;
            powerPreference?: string;
            sharedTicker?: boolean;
            sharedLoader?: boolean;
            resizeTo?: Window | HTMLElement;
        }
    }

    export namespace loader {
        export interface LoaderResource {
            extension: string;
            error: string;
            name: string;
            url: string;
            data: any;
        }

        export interface AssetInfo {
            name: string;
            path: string;
            type: MANTICORE.enumerator.ASSET_TYPE | null;
            resolution: MANTICORE.enumerator.FILE_TYPE | string | null;
            useAssetDir: boolean;
        }

        export const assetForLoad: MANTICORE.loader.AssetInfo[];
        export const assetLoaded: MANTICORE.loader.AssetInfo[];
        export const isLoading: boolean;

        export function addAsset(name: string, type: MANTICORE.enumerator.ASSET_TYPE, path?: string, resolution?: MANTICORE.enumerator.FILE_TYPE | string, useAssetDir?: boolean): void;
        export function load(): void;
    }

    export namespace logger {
        export function log(...var_args: any[]): void;
        export function warn(...var_args: any[]): void;
        export function error(...var_args: any[]): void;
    }

    export namespace macro {
        export let FPS: number;
        export let USE_WEB_P_FALLBACK: boolean;
        export let PARTICLES_ENABLED: boolean;
        export let KEYBOARD_ENABLED: boolean;
        export let BLOCK_BROWSER_HOT_KEYS: boolean;
        export let MODE: MANTICORE.enumerator.ENGINE_MODE;
        export let DEFAULT_POOL_SIZE: number;
        export let OUTLINE_SAMPLES: number;
        export let ASSET_DIR: string;
        export let SPINE_SCALE: number;
    }

    export namespace manager {

        export class AnimationManager extends MANTICORE.manager.BaseManager {
            constructor(owner: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite);

            eventStart: string;
            eventEnd: string;
            eventPause: string;
            eventResume: string;
            eventStop: string;
            eventComplete: string;
            readonly animations: { [key:string]:string; };

            public addAnimation(name: string, animation: MANTICORE.animation.action.ActionInterval, timeLine?: string | MANTICORE.enumerator.animation.TIME_LINE): boolean;
            public removeAnimation(name: string, timeLine?: string | MANTICORE.enumerator.animation.TIME_LINE): boolean;
            public removeAllAnimations(timeLine?: string | MANTICORE.enumerator.animation.TIME_LINE): void;
            public runAction(action: MANTICORE.animation.action.ActionInterval, loop?: boolean, frame?: number, timeLine?: string | MANTICORE.enumerator.animation.TIME_LINE): void;
            public play(name: string, loop?: boolean, frame?: number, timeLine?: string | MANTICORE.enumerator.animation.TIME_LINE): boolean;
            public stop(name: string, timeLine?: string | MANTICORE.enumerator.animation.TIME_LINE): boolean;
            public stopAll(): void;
            public pause(name: string, timeLine?: string | MANTICORE.enumerator.animation.TIME_LINE): boolean;
            public resume(name: string, timeLine?: string | MANTICORE.enumerator.animation.TIME_LINE): boolean;

            public refreshTimeLines(): void;
            public addTimeLine(name: string | MANTICORE.enumerator.animation.TIME_LINE, timeLine?: MANTICORE.animation.timeLine.BaseTimeLine): boolean;
            public getTimeLine(name: string | MANTICORE.enumerator.animation.TIME_LINE): MANTICORE.animation.timeLine.BaseTimeLine | null;
            public pauseTimeLine(name: string | MANTICORE.enumerator.animation.TIME_LINE): boolean;
            public resumeTimeLine(name: string | MANTICORE.enumerator.animation.TIME_LINE): boolean;
            public removeTimeLine(name: string | MANTICORE.enumerator.animation.TIME_LINE): boolean;
            public stopTimeLine(name: string | MANTICORE.enumerator.animation.TIME_LINE): boolean;
            public removeAllTimeLines(): void;

            public setEvent(eventId: MANTICORE.enumerator.animation.TIME_LINE_EVENT | number, event: string, timeLineName?: string | MANTICORE.enumerator.animation.TIME_LINE): boolean;
            public clearEvent(eventId: MANTICORE.enumerator.animation.TIME_LINE_EVENT | number, timeLineName?: string | MANTICORE.enumerator.animation.TIME_LINE): boolean;
            public resetParameters(): void;
        }

        export class BaseManager extends MANTICORE.memory.ReusableObject {
            constructor(owner: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite | MANTICORE.memory.ReusableObject);

            active: boolean;
            protected owner: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite | MANTICORE.memory.ReusableObject;

            update(dt: number): void;
        }
        export class ComponentManager extends MANTICORE.manager.BaseManager {
            constructor(owner: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite);

            iterateUIComponents(callback: MANTICORE.view.callback.IterateComponent);
            addChildrenAction(children: PIXI.DisplayObject[]): void;
            removeChildrenAction(children: PIXI.DisplayObject[]): void;
            visibleAction(visible: boolean): void;
            addComponent(component: MANTICORE.component.Component): boolean;
            addComponents(components: any[]): void;
            hasComponent(name: string): boolean;
            getComponent(name: string): MANTICORE.component.Component | null;
            removeComponent(name: string): boolean;
            removeAllComponents(): void;
        }

        export class InteractionManager extends MANTICORE.manager.BaseManager {
            constructor(owner: MANTICORE.component.Component);

            interactive: boolean;
            eventUp: string | null;
            eventDown: string | null;
            eventOver: string | null;
            eventOut: string | null;
            eventMove: string | null;
            eventDrag: string | null;
            eventClick: string | null;
            eventDragFinish: string | null;
            eventDragStart: string | null;
            propagateChildrenEvents: boolean;

            public emitInteractiveEvent(eventType: MANTICORE.enumerator.ui.INTERACTIVE_EVENT, event?: any): void;
            public getInteractiveEvent(id: MANTICORE.enumerator.ui.INTERACTIVE_EVENT): string;
            public updateInteractiveEvent(id: MANTICORE.enumerator.ui.INTERACTIVE_EVENT, name?: string): void;
        }

        export class LayoutSizeManager extends MANTICORE.manager.BaseManager {
            constructor(owner: MANTICORE.component.Component);

            staticWidth: boolean;
            staticHeight: boolean;
            minWidth: number;
            maxWidth: number;
            minHeight: number;
            maxHeight: number;
            contentWidth: number;
            contentHeight: number;
        }

        export class ListenerManager extends MANTICORE.manager.BaseManager {
            constructor(owner: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite | MANTICORE.memory.ReusableObject);

            blockEvents: boolean;

            isListenEvent(event: string): boolean;

            addEventListener(event: string, handler: MANTICORE.eventDispatcher.InteractiveCallback): boolean;
            removeEventListener(event: string): void;
            removeAllEventListeners(): void;
            dispatchEvent(event: string, data?: any): void;
        }
    }

    export namespace memory {

        export class ReusableObject {
            constructor();

            reusable: boolean;
            inPool: boolean;
            readonly isDestroyed;

            reuse(...var_args: any[]): void;
            disuse(): void
            destroy(): void;
            kill(): void;
            static create<T extends MANTICORE.memory.ReusableObject>(...var_args: any[]): T;

            protected clearData(): void;

        }
    }

    export namespace model {
        export class Model extends MANTICORE.memory.ReusableObject {
            constructor(id: number);
            id: number;
            protected reuseId(): void;
        }
    }

    export namespace particleSystem {
        export let paused: boolean;
        export function init(): void;
        export function generateParticle(name: string): Object | null;
        export function update(iterationCount?: number, step?: number): void;
    }

    export namespace pool {
        export function putObject(object: Object): void;
        export function hasObject(objectClass: Object): boolean;
        export function removeObject(object: Object): void;
        export function setPoolSize(object: Object, count: number): void;
        export function getObject(...var_args: any[]): void;
        export function drain(): void;
    }

    export namespace repository {
        export class Repository {
            constructor();

            keys: number[] | string[];
            values: any[];
            length: number;

            addElement(value: any, key?: number | string): boolean;
            updateElement(value: any, key?: number | string): boolean;
            removeElement(key: number | string): boolean;
            hasElement(key: number | string): boolean;
            getElement(key: number | string): any;
            clear(isKillValues?: boolean): void;
            isEmpty(): boolean;
        }
    }

    export namespace timer {
        export const REPEAT_FOREVER: number;

        export function add(tickCallback: Function, tickTarget: Object, interval: number, userData?: any, repeatCount?: number, delay?: number, paused?: boolean): number;
        export function pause(id: number): boolean;
        export function start(id: number): boolean;
        export function resume(id: number): boolean;
        export function stop(id: number): boolean;
        export function getTime(): number;
    }

    export namespace type {

        export interface AnimationData {
            name: number;
            fps: number;
            length: number;
            frames: MANTICORE.type.AnimationFrame[];
        }

        export interface AnimationFrame {
            type: MANTICORE.enumerator.animation.ACTION_TYPE;
            index: number;
            data: number[] | null;
            ease: number[] | null;
        }

        export interface AssetBundle {
            anchors: number[];
            animationNames: string[];
            bundleType: MANTICORE.enumerator.BUNDLE_TYPE;
            atlases: MANTICORE.type.AtlasInfo[];
            atlasFonts: MANTICORE.type.AtlasFont[];
            colors: number[];
            componentNames: string[];
            elementNames: string[];
            fontData: MANTICORE.type.FontData[];
            fonts: string[];
            fontStyles: MANTICORE.type.FontStyle[];
            name: string;
            particleDat: Object[],
            particleNames: string[],
            skeletonNames: string[];
            skeletons: Object[];
            texts: string[];
            textures: number[];
            textureParts: string[];
            textFieldStyles: MANTICORE.type.TextFieldStyle[];
            ui: MANTICORE.type.ElementData[];
        }

        export interface AtlasInfo {
            frames: MANTICORE.type.AtlasFrame[];
            name: string;
            images: string[];
            scale: number;
        }

        export interface AtlasFont {
            texture: number;
            dotWidth: number;
            size: number[];
        }

        export interface AtlasFrame {
            dimensions: number[];
            spriteDimensions: number[];
            sourceSize: number[];
            id: number;
            rotated: boolean;
            trimmed: boolean;
        }

        export interface CharData {
            id: number;
            page: number;
            dimensions: number[];
            offset: number;
            ax: number;
        }

        export interface FontData {
            chars: MANTICORE.type.CharData[];
            size: number;
            spacing: number;
            kerning: number[][];
            offsets: number[][];
            lineHeight: number
        }

        export interface FontStyle {
            name: number;
            size: number;
            color: number;
            align: number[];
            outlineSize: number;
            outlineColor: number;
            shadowColor: number;
            shadowOffset: number[];
        }

        export interface ElementData {
            alpha: number;
            anchor: number;
            animations: MANTICORE.type.AnimationData[] | null;
            children: MANTICORE.type.ElementData[];
            clipped: boolean;
            content: MANTICORE.type.ElementData;
            dimensions: number[];
            edge: MANTICORE.enumerator.ui.VERTICAL_ALIGN[] | MANTICORE.enumerator.ui.HORIZONTAL_ALIGN[] | null;
            fileData: number[];
            flip: boolean[];
            interactive: boolean;
            margin: number[] | null;
            name: number;
            percent: boolean[] | null;
            preDimensions: number[] | null;
            rotation: number[];
            scale: number[];
            slice9: number[];
            stretch: boolean[] | null;
            type: MANTICORE.enumerator.ui.UI_ELEMENT;
            tint: number;
            visible: boolean;
        }

        export interface TextFieldStyle {
            placeHolderText: number;
            maxLength: number;
            passwordMode: boolean;
            passwordChar: number;
        }
    }

    export namespace ui {
        export namespace ancillary {
            export class BaseButton extends MANTICORE.ui.Widget {
                constructor(frame: string, state: number);

                enabled: boolean;
                title: MANTICORE.ui.ancillary.BaseLabel;
                titleText: string;

                hasTitle(): boolean;
                changeState(state: number): void;
                changeStateWithFallback(state: number, fallback: number, isEnabled?: boolean): void;
                protected changeEnabledState(state: number): void;
                protected onEnabledChange(enabled: boolean): void;


            }

            export class BaseLabel extends MANTICORE.ui.Widget {
                constructor();

                fontSize: number;
                fontName: string;
                shadowColor: number;
                outlineEnabled: boolean;
                outlineSize: number;
                outlineColor: number;
                shadowEnabled: boolean;
                text: string;
                color: number;
                horizontalAlign: MANTICORE.enumerator.ui.HORIZONTAL_ALIGN;
                verticalAlign: MANTICORE.enumerator.ui.VERTICAL_ALIGN;
                lineHeight: number;
                localized: boolean;
                autoSize: boolean;
                letterSpacing: number;

                getShadowOffset(): MANTICORE.geometry.Point;
                setShadowOffset(xOrPoint: number | MANTICORE.geometry.Point, y?: number): void;
                protected horizontalAlignChange(value: MANTICORE.enumerator.ui.HORIZONTAL_ALIGN): void;
                protected verticalAlignChange(value: MANTICORE.enumerator.ui.VERTICAL_ALIGN): void;

            }

            export class OutlineBitmapText extends PIXI.Container {
                constructor(fontName: string, size: number);
                anchor: MANTICORE.geometry.Point;
                maxWidth: number;
                fontName: string;
                fontSize: number;
                outlineEnabled: boolean;
                outlineSize: number;
                color: number;
                outlineColor: number;
                horizontalAlign: MANTICORE.enumerator.ui.HORIZONTAL_ALIGN;
                verticalAlign: MANTICORE.enumerator.ui.VERTICAL_ALIGN;
                lineHeight: number;
                text: string;
                parentTint: number;
                letterSpacing: number;

                updateText(): void;
                updateColorByLetter(beginIndex: number, count: number, color: number): void;
                clearLetterColors(): void;
                clone(): MANTICORE.ui.ancillary.OutlineBitmapText;

            }

            class StateSlice9Sprite extends MANTICORE.view.Slice9Sprite {
                constructor(frameName: string, state: number | string, leftSlice?: number, rightSlice?: number, topSlice?: number, bottomSlice?: number);
                state: number | string;

                addState(frameName: string, state: string | number): void;
                hasState(state: number | string): boolean;
                getFrameByState(state: number | string): string | null;
                setFrameByState(frame: string | null, state: string | number): void;
            }
        }

        export namespace parser {
            export function parseElement(name: string, link: string): MANTICORE.ui.Widget;
        }

        // @ts-ignore
        export class AtlasLabel extends MANTICORE.ui.ancillary.BaseLabel {
            constructor(frame: string, letterWidth: number, letterHeight: number, dotWidth: number);
            // noinspection JSAnnotator
            static create(frame: string, letterWidth: number, letterHeight: number, dotWidth: number): MANTICORE.ui.AtlasLabel;
        }

        // @ts-ignore
        export class Button extends MANTICORE.ui.ancillary.BaseButton {
            constructor(upFrame: string, downFrame?: string, overFrame?: string, disabledFrame?: string);

            upFrame: string | null;
            downFrame: string | null;
            overFrame: string | null;
            disabledFrame: string | null;

            // noinspection JSAnnotator
            static create(upFrame: string, downFrame?: string, overFrame?: string, disabledFrame?: string): MANTICORE.ui.Button;
            protected onActionUpHandler(event: Object): boolean;
            protected onActionDownHandler(event: Object): boolean;
            protected onActionOverHandler(event: Object): void;
            protected onActionOutHandler(event: Object): void;
            protected onActionUpOutsideHandler(event: Object): boolean;
            protected onEnabledChange(enabled: boolean): void;

        }

        // @ts-ignore
        export class CheckBox extends MANTICORE.ui.ancillary.BaseButton {
            constructor(
                upBackFrame: string,
                upIconFrame: string,
                downBackFrame?: string,
                overBackFrame?: string,
                disabledBackFrame?: string,
                downIconFrame?: string,
                overIconFrame?: string,
                disableIconFrame?: string
            );

            // noinspection JSAnnotator
            static create(
                upBackFrame: string,
                upIconFrame: string,
                downBackFrame?: string,
                overBackFrame?: string,
                disabledBackFrame?: string,
                downIconFrame?: string,
                overIconFrame?: string,
                disableIconFrame?: string
            ): MANTICORE.ui.CheckBox;
            icon: MANTICORE.ui.ancillary.StateSlice9Sprite;
            selected: boolean;

            protected onActionClickHandler(event: Object): void;
        }

        export class ParticleEmitter extends MANTICORE.view.ComponentContainer {
            constructor(particleName:string, containerType?: MANTICORE.enumerator.ui.CONTAINER_TYPE);

            public readonly canEmit: boolean;
            public readonly particleType: MANTICORE.enumerator.PARTICLE_TYPE;
            public readonly particleName: string;
            public readonly containerType: MANTICORE.enumerator.ui.CONTAINER_TYPE;

            public eventStart: string;
            public eventComplete: string;
            public eventExhausted: string;

            public emitParticle(scale?: number, paused?: boolean, delay?: number);
            public resume();
            public pause();
            public stop(killImmediately?: boolean);

            // noinspection JSAnnotator
            static create(particleName:string, containerType?: MANTICORE.enumerator.ui.CONTAINER_TYPE): MANTICORE.ui.ParticleEmitter;
        }

        export class ImageView extends MANTICORE.view.Slice9Sprite{
            constructor(frameName: string);

            reusable: boolean;
            blockEvents: boolean;
            inPool: boolean;
            uiType: MANTICORE.enumerator.ui.UI_ELEMENT;
            isUpdate: boolean;
            tint: number;
            parentTint: number;
            protected  readonly realTint: number;
            readonly isDestroyed: boolean;
            readonly animationManager: MANTICORE.manager.AnimationManager;
            readonly componentManager: MANTICORE.manager.ComponentManager;
            readonly listenerManager: MANTICORE.manager.ListenerManager;
            readonly interactionManager: MANTICORE.manager.InteractionManager;
            readonly hasAnimationManager: boolean;
            readonly hasComponentManager: boolean;
            readonly hasListenerManager: boolean;
            readonly hasInteractionManager: boolean;

            static create<T extends MANTICORE.view.ComponentContainer>(...var_args: any[]): T;
            public reuse(...var_args: any[]): void;
            public disuse(): void;
            public kill(): void;
            public destroy(): void;
            public emitInteractiveEvent(eventType: MANTICORE.enumerator.ui.INTERACTIVE_EVENT, event: MANTICORE.eventDispatcher.EventModel): void;
            public doLayout(): void;

            protected updateChildTint<T extends PIXI.DisplayObject>(child: T): void;
            protected onUpdate(dt: number): void;
            // noinspection JSAnnotator
            static create(frameName: string): MANTICORE.ui.ImageView;
        }

        // @ts-ignore
        export class Label extends MANTICORE.ui.ancillary.BaseLabel {
            constructor(fontName: string, size: number);
            public realFontSize: number;
            public locale: string | null;
            // noinspection JSAnnotator
            static create(fontName: string, size: number): MANTICORE.ui.Label;
            updateColorByLetter(beginIndex: number, count: number, color: number): void;
            clearLetterColors(): void;
        }

        export class ListView extends MANTICORE.ui.ScrollView{
            constructor(graphicType?: MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number);

            layout: MANTICORE.component.ui.ComLayout;

            verticalAlign: MANTICORE.enumerator.ui.VERTICAL_ALIGN;
            horizontalAlign: MANTICORE.enumerator.ui.HORIZONTAL_ALIGN;

            eventItemUp: string | null;
            eventItemDown: string | null;
            eventItemOver: string | null;
            eventItemOut: string | null;
            eventItemMove: string | null;
            eventItemDrag: string | null;
            eventItemClick: string | null;
            eventItemDragFinish: string | null;
            eventItemDragStart: string | null;

            slider: MANTICORE.ui.Slider;

            innerPadding: MANTICORE.geometry.Point;
            outerPadding: MANTICORE.geometry.Point;

            // noinspection JSAnnotator
            static create(graphicType?: MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number): MANTICORE.ui.ListView;
            scrollToItem(time: number, index: number): void;
        }

        // @ts-ignore
        export class ProgressBar extends Widget {
            constructor(frameLink: string, direction?: MANTICORE.enumerator.DIRECTION, type?: MANTICORE.enumerator.ui.PROGRESS_TYPE);
            direction: MANTICORE.enumerator.DIRECTION;
            progress: number;
            type: MANTICORE.enumerator.ui.PROGRESS_TYPE;
            frameName: string;

            // noinspection JSAnnotator
            static create(frameLink: string, direction?: MANTICORE.enumerator.DIRECTION, type?: MANTICORE.enumerator.ui.PROGRESS_TYPE): MANTICORE.ui.ProgressBar;
        }

        // @ts-ignore
        export class Panel extends MANTICORE.ui.Widget{
            constructor(graphicType?: MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number);

            backgroundColor: number;
            backgroundAlpha: number;
            readonly panelType: MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE;
            setType(graphicType?: MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number): void;

            // noinspection JSAnnotator
            static create(graphicType?: MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number): MANTICORE.ui.Panel;
        }

        // @ts-ignore
        export class ScrollView extends MANTICORE.ui.Widget {
            constructor(graphicType?: MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number);

            scrollDirection: MANTICORE.enumerator.ui.SCROLL_DIRECTION;
            horizontalSlider: MANTICORE.ui.Slider;
            verticalSlider: MANTICORE.ui.Slider;
            innerContainer: MANTICORE.ui.Widget;
            innerWidth: number;
            innerHeight: number;
            bounceEnabled: boolean;

            // noinspection JSAnnotator
            static create(graphicType?: MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number): MANTICORE.ui.ScrollView;

            jumpToBottom(): void;
            jumpToBottomLeft(): void;
            jumpToBottomRight(): void;
            jumpToLeft(): void;
            jumpToRight(): void;
            jumpToTop(): void;
            jumpToTopLeft(): void;
            jumpToTopRight(): void;
            jumpToPercentBothDirection(percent: number): void;
            jumpToPercentHorizontal(percent: number): void;
            jumpToPercentVertical(percent: number): void;
            scrollToLeft(time: number): void;
            scrollToRight(time: number): void;
            scrollToTop(time: number): void;
            scrollToBottom(time: number): void;
            scrollToTopLeft(time: number): void;
            scrollToTopRight(time: number): void;
            scrollToBottomLeft(time: number): void;
            scrollToBottomRight(time: number): void;
            scrollToPercentHorizontal(time: number, percent: number): void;
            scrollToPercentVertical(time: number, percent: number): void;
            scrollToPercentBoth(time: number, percentH: number, percentV?: number): void;

            protected isVertical(): boolean;
            protected isHorizontal(): boolean;
            protected onDragStartInnerContainerHandler(event: MANTICORE.eventDispatcher.EventModel): void;
            protected onDragInnerContainerHandler(event: MANTICORE.eventDispatcher.EventModel): void;
            protected onScrollHorizontalHandler(event: MANTICORE.eventDispatcher.EventModel): void;
            protected onScrollVerticalHandler(event: MANTICORE.eventDispatcher.EventModel): void;
        }

        // @ts-ignore
        export class Slider extends MANTICORE.ui.Widget {
            constructor(ball: MANTICORE.ui.Widget, direction?: MANTICORE.enumerator.DIRECTION, progressFrame?: string);

            eventScroll: string;
            progressFrameName: string | null;
            progressBar: MANTICORE.ui.ProgressBar | null;
            direction: MANTICORE.enumerator.DIRECTION;
            progress: number;
            enabled: boolean;

            // noinspection JSAnnotator
            static create(ball: MANTICORE.ui.Widget, direction?: MANTICORE.enumerator.DIRECTION, progressFrame?: string): MANTICORE.ui.Slider;
            hasProgressBar(): boolean;
        }

        export class TextField extends MANTICORE.ui.Label {
            constructor(fontName: string, size: number);

            text: string;
            maxLength: number;
            passwordMode: boolean;
            passwordChar: string;
            cursorEnabled: boolean;
            cursorChar: string;
            placeholderColor: number;
            placeholderText: string;
            color: number;
            pattern: string;

            // noinspection JSAnnotator
            static create(fontName: string, size: number): MANTICORE.ui.TextField;
            protected onActionUpHandler(event: Object): boolean;
        }

        // @ts-ignore
        export class ToggleButton extends MANTICORE.ui.ancillary.BaseButton{
            constructor(dUpFrame: string, sUpFrame: string, sDownFrame?: string, dDownFrame?: string, dOverFrame?: string, sOverFrame?: string, dDisabledFrame?: string, sDisabledFrame?: string);
            selected: boolean;

            // noinspection JSAnnotator
            static create(dUpFrame: string, sUpFrame: string, sDownFrame?: string, dDownFrame?: string, dOverFrame?: string, sOverFrame?: string, dDisabledFrame?: string, sDisabledFrame?: string): MANTICORE.ui.ToggleButton;
            protected onEnabledChange(enabled: boolean): void;

        }

        // @ts-ignore
        export class Widget extends MANTICORE.view.ComponentContainer {
            constructor(collider?: PIXI.Sprite | MANTICORE.view.Slice9Sprite);

            clipping: boolean;
            clippingType: MANTICORE.enumerator.ui.CLIPPING_TYPE;
            tint: number;
            anchor: MANTICORE.geometry.Point;
            flipX: boolean;
            flipY: boolean;

            // noinspection JSAnnotator
            static create(collider?: PIXI.Sprite | MANTICORE.view.Slice9Sprite): MANTICORE.ui.Widget;
            public setSlice(leftSlice?: number, rightSlice?: number, topSlice?: number, bottomSlice?: number): void;

            protected collider: PIXI.Sprite | MANTICORE.view.Slice9Sprite | MANTICORE.ui.ancillary.StateSlice9Sprite;
        }
    }


    export namespace util {
        export namespace asset {
            export function getSpriteFrame(link: string): PIXI.Texture | null;
            export function createWhiteSprite(): PIXI.Sprite;
        }
        export namespace color {
            export enum COLORS {
                BLACK = 0,
                WHITE = 16777215,
                RED = 16711680,
                GREEN = 65535,
                BLUE = 255,
            }
            export function multiply(color1: number, color2: number): number;
            export function getLightness(color: number): number;
            export function setLightness(color: number, lightness: number): number;
            export function getHue(color: number): number;
            export function setHue(color: number, hue: number): number;
            export function getSaturation(color: number): number;
            export function setSaturation(color: number, saturation: number): number;
            export function intToRgb(value: number): number[];
            export function intToHsl(value: number): number[];
            export function intToHex(value: number): string;
            export function hexToInt(value: string): number;
            export function hslToInt(hue: number, saturation: number, lightness: number): number;
            export function rgbToInt(red: number, green: number, blue: number): number;
            export function rgbToHsl(red: number, green: number, blue: number): number[];
            export function hslToRgb(hue: number, saturation: number, lightness: number): number[];

        }
        export namespace format {
            export function getUniqueId(): string;
            export function addFileType(value: string, type: MANTICORE.enumerator.FILE_TYPE): string;
            export function formatNumber(value: number | string, numCount: number): string;
            export function replaceAt(targetString: string, index: number, char: string): string;
            export function generateEventName(target: Object, event: string): string;
            export function getFileName(path: string): string;
            export function replace(...var_args: string[]): string;
            export function join(...var_args:string[]): string;
            export function extName(pathStr: string): string;
            export function mainFileName(fileName: string): string;
            export function baseName(pathStr: string, extName?: string): string;
            export function dirName(pathStr: string): string;
            export function changeExtName(pathStr: string, extName?: string): string;
            export function changeBaseName(pathStr: string, baseName: string, isSameExt?: boolean): string;

        }
        export namespace geometry {
            export function pFromSize(size: PIXI.Container | PIXI.Rectangle, inPoint?: MANTICORE.geometry.Point): MANTICORE.geometry.Point;
            export function pHalfSize(size: PIXI.Container | PIXI.Rectangle, inPoint?: MANTICORE.geometry.Point): MANTICORE.geometry.Point;
            export function sSub(size1: PIXI.Container | PIXI.Rectangle, size2: PIXI.Container | PIXI.Rectangle, inPoint?: MANTICORE.geometry.Point): MANTICORE.geometry.Point;
            export function pSub(p1: MANTICORE.geometry.Point, p2: MANTICORE.geometry.Point, isIn?: boolean): MANTICORE.geometry.Point;
            export function pAdd(p1: MANTICORE.geometry.Point, p2: MANTICORE.geometry.Point, isIn?: boolean): MANTICORE.geometry.Point;
            export function pMult(p: MANTICORE.geometry.Point, multiplier: number, isIn?: boolean): MANTICORE.geometry.Point;
            export function pCompMult(p1: MANTICORE.geometry.Point, p2: MANTICORE.geometry.Point, isIn?: boolean): MANTICORE.geometry.Point;
            export function pCompDiv(p1: MANTICORE.geometry.Point, p2: MANTICORE.geometry.Point, isIn?: boolean): MANTICORE.geometry.Point;
            export function pMax(p1: MANTICORE.geometry.Point, p2: MANTICORE.geometry.Point, isIn?: boolean): MANTICORE.geometry.Point;
            export function pMin(p1: MANTICORE.geometry.Point, p2: MANTICORE.geometry.Point, isIn?: boolean): MANTICORE.geometry.Point;
            export function pNeg(p: MANTICORE.geometry.Point, isIn?: boolean): MANTICORE.geometry.Point;
            export function pAbs(p: MANTICORE.geometry.Point, isIn?: boolean): MANTICORE.geometry.Point;
            export function pRound(p: MANTICORE.geometry.Point, isIn?: boolean): MANTICORE.geometry.Point;
            export function pInvert(p: MANTICORE.geometry.Point, isIn?: boolean): MANTICORE.geometry.Point;
            export function pRange(p: MANTICORE.geometry.Point, pLeft: MANTICORE.geometry.Point, pRight: MANTICORE.geometry.Point, isIn?: boolean): MANTICORE.geometry.Point;
            export function pEqual(p1: MANTICORE.geometry.Point, p2: MANTICORE.geometry.Point): boolean;
            export function pDot(p1: MANTICORE.geometry.Point, p2: MANTICORE.geometry.Point): number;
            export function pCross(p1: MANTICORE.geometry.Point, p2: MANTICORE.geometry.Point): number;
            export function pLengthSQ(p: MANTICORE.geometry.Point): number;
            export function pLength(p: MANTICORE.geometry.Point): number;
            export function pDistance(p1: MANTICORE.geometry.Point, p2: MANTICORE.geometry.Point): number;

        }
        export namespace math {
            export const PI: number;
            export const HALF_CIRCLE: number;
            export const MAX_BYTE: number;
            export function abs(value: number): number;
            export function sign(value: number): number;
            export function binaryIndexOf(element: any, array: any[]): number;
            export function floor(value: number): number;
            export function round(value: number): number;
            export function ceil(value: number): number;
            export function divPowTwo(value: number, rank?: number): number;
            export function multPowTwo(value: number, rank?: number): number;
            export function toFixed(value: number, numCount?: number): number;
            export function sin(angle: number): number;
            export function cos(angle: number): number;
            export function max(...var_args: number[]): number;
            export function min(...var_args: number[]): number;
            export function toRadians(degrees: number): number;
            export function range(value: number, leftBound: number, rightBound: number): number;
            export function toDegrees(radians: number): number;
            export function floatToPercent(value: number, isRound?: boolean): number;
            export function percentToFloat(value: number): number;
            export function getUniqueId(): number;
            export function putUniqueId(id: number): void;
            export function sqrt(value: number): number;
            export function intPow(value: number, power: number): number;
            export function framesToSeconds(value: number): number;
            export function secondsToFrames(value: number): number;
            export function toMilliseconds(seconds: number): number;
            export function toSeconds(milliseconds: number): number;
            export function random(): number;
            export function randInt(max: number, min?: number): number;
        }

        export namespace type {
            export function isUndefined(obj: any): boolean;
            export function isNull(obj: any): boolean;
            export function isEmpty(obj: any): boolean;
            export function isFunction(obj: any): boolean;
            export function isNumber(obj: any): boolean;
            export function isString(obj: any): boolean;
            export function isArray(obj: any): boolean;
            export function isObject(obj: any): boolean;
            export function isValidJson(jsonString: string): boolean;
            export function setValue(value: any, defaultValue?: any): any;
            export function toBoolean(value: any):  boolean;
        }

        export namespace ui {
            export function fullPath<T extends PIXI.DisplayObject>(node: T): string;
            export function logHierarchy(widget: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite, maxLevel?: number): void;
            export function logUnlocalizedFields(widget: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite): void;
            export function getChildView<T extends PIXI.Container>(path: string, firstElement: T): T| null;
            export function localize<T extends PIXI.DisplayObject>(root: T): void;
        }
    }

    export namespace view {
        namespace callback {
            type ChildAction = (component: MANTICORE.component.Component, child: PIXI.DisplayObject) => void;
            type IterateComponent = (component: MANTICORE.component.Component, index?: number) => void;
        }

        export class ComponentContainer extends PIXI.Container {
            constructor();


            reusable: boolean;
            blockEvents: boolean;
            inPool: boolean;
            uiType: MANTICORE.enumerator.ui.UI_ELEMENT;
            isUpdate: boolean;
            tint: number;
            parentTint: number;
            userData: number | string | Object | Array<any> | boolean | null;
            protected readonly realTint: number;
            readonly isDestroyed: boolean;
            readonly animationManager: MANTICORE.manager.AnimationManager;
            readonly componentManager: MANTICORE.manager.ComponentManager;
            readonly listenerManager: MANTICORE.manager.ListenerManager;
            readonly interactionManager: MANTICORE.manager.InteractionManager;
            readonly hasAnimationManager: boolean;
            readonly hasComponentManager: boolean;
            readonly hasListenerManager: boolean;
            readonly hasInteractionManager: boolean;

            static create<T extends MANTICORE.view.ComponentContainer>(...var_args: any[]): T;

            public reuse(...var_args: any[]): void;

            public disuse(): void;

            public kill(): void;

            public destroy(): void;

            public emitInteractiveEvent(eventType: MANTICORE.enumerator.ui.INTERACTIVE_EVENT, event: MANTICORE.eventDispatcher.EventModel): void;

            public doLayout(): void;

            protected updateChildTint<T extends PIXI.DisplayObject>(child: T): void;

            protected onUpdate(dt: number): void;
        }

        export class ComponentSpine extends PIXI.spine.Spine {
            constructor(skeletonName: string);

            reusable: boolean;
            blockEvents: boolean;
            inPool: boolean;
            uiType: MANTICORE.enumerator.ui.UI_ELEMENT;
            isUpdate: boolean;
            parentTint: number;
            userData: number | string | Object | Array<any> | boolean | null;
            protected readonly realTint: number;
            readonly isDestroyed: boolean;
            readonly animationManager: MANTICORE.manager.AnimationManager;
            readonly componentManager: MANTICORE.manager.ComponentManager;
            readonly listenerManager: MANTICORE.manager.ListenerManager;
            readonly interactionManager: MANTICORE.manager.InteractionManager;
            readonly hasAnimationManager: boolean;
            readonly hasComponentManager: boolean;
            readonly hasListenerManager: boolean;
            readonly hasInteractionManager: boolean;

            static create<T extends MANTICORE.view.ComponentSpine>(skeletonName: string): T;

            public reuse(...var_args: any[]): void;

            public disuse(): void;

            public kill(): void;

            public destroy(): void;

            public emitInteractiveEvent(eventType: MANTICORE.enumerator.ui.INTERACTIVE_EVENT, event: MANTICORE.eventDispatcher.EventModel): void;

            public doLayout(): void;

            protected updateChildTint<T extends PIXI.DisplayObject>(child: T): void;

            protected onUpdate(dt: number): void;

        }

        export class ComponentSprite extends PIXI.Sprite {
            constructor(frameName: string);

            reusable: boolean;
            blockEvents: boolean;
            inPool: boolean;
            uiType: MANTICORE.enumerator.ui.UI_ELEMENT;
            isUpdate: boolean;
            parentTint: number;
            userData: number | string | Object | Array<any> | boolean | null;
            protected readonly realTint: number;
            readonly isDestroyed: boolean;
            readonly animationManager: MANTICORE.manager.AnimationManager;
            readonly componentManager: MANTICORE.manager.ComponentManager;
            readonly listenerManager: MANTICORE.manager.ListenerManager;
            readonly interactionManager: MANTICORE.manager.InteractionManager;
            readonly hasAnimationManager: boolean;
            readonly hasComponentManager: boolean;
            readonly hasListenerManager: boolean;
            readonly hasInteractionManager: boolean;

            static create<T extends MANTICORE.view.ComponentSprite>(frameName: string): T;

            public reuse(...var_args: any[]): void;

            public disuse(): void;

            public kill(): void;

            public destroy(): void;

            public emitInteractiveEvent(eventType: MANTICORE.enumerator.ui.INTERACTIVE_EVENT, event: MANTICORE.eventDispatcher.EventModel): void;

            public doLayout(): void;

            protected updateChildTint<T extends PIXI.DisplayObject>(child: T): void;

            protected onUpdate(dt: number): void;

        }

        export class Scene extends PIXI.Container {
            constructor(comTransitionShow?: MANTICORE.component.Component, comTransitionHide?: MANTICORE.component.Component);

            static create<T extends MANTICORE.view.Scene>(comTransitionShow?: MANTICORE.component.Component, comTransitionHide?: MANTICORE.component.Component): T;

            public show(): void;

            public hide(): void;

            protected onShowStart(): void;

            protected onShowComplete(): void;

            protected onHideStart(): void;

            protected onHideComplete(): void;

        }

        export class Slice9Sprite extends PIXI.Container {
            constructor(frameName: string, leftSlice?: number, rightSlice?: number, topSlice?: number, bottomSlice?: number);

            tint: number;
            parentTint: number;
            anchor: MANTICORE.geometry.Point;
            leftSlice: number;
            rightSlice: number;
            topSlice: number;
            bottomSlice: number;
            frameName: string;
            slice: number[];
            protected readonly realTint: number;

            static create<T extends MANTICORE.view.Slice9Sprite>(frameName: string, leftSlice?: number, rightSlice?: number, topSlice?: number, bottomSlice?: number): T;
        }
    }
}
