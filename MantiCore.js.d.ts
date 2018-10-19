declare namespace MANTICORE {
    export namespace animation {
        export namespace action {
            class Action {
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
            }

            class ActionInstant extends MANTICORE.animation.action.FiniteTimeAction{
                reverse(): any;
                clone(): MANTICORE.animation.action.ActionInstant;
            }

            class ActionInterval extends MANTICORE.animation.action.FiniteTimeAction {
                constructor(duration?: number);

                readonly elapsed: number;
                eases: MANTICORE.animation.easing.EaseBase[];
                repeatForever: boolean;
                speedMethod: boolean;
                repeatMethod: boolean;
                amplitudeRate: number;
                speed: number;

                clone(): MANTICORE.animation.action.ActionInterval;
                easing(...var_args: MANTICORE.animation.easing.EaseBase[]): void;
                changeSpeed(speed: number): number;
                repeat(times: number): void;

                protected doClone<T extends MANTICORE.animation.action.ActionInterval>(action: T): T;
                protected doReverse<T extends MANTICORE.animation.action.ActionInterval>(action: T): T;
                protected computeEaseTime(dt: number): number;
            }

            class BezierBy extends MANTICORE.animation.action.ActionInterval{
                constructor(duration: number, controlPoints: PIXI.Point[]);

                protected readonly startPoint: PIXI.Point;
                protected readonly config: PIXI.Point[];

                clone(): MANTICORE.animation.action.BezierBy;
                reverse(): MANTICORE.animation.action.BezierBy;
            }

            class BezierTo extends MANTICORE.animation.action.BezierBy {
                clone(): MANTICORE.animation.action.BezierTo;
            }

            class Blink extends ActionInterval {
                constructor(duration: number, blinks: number);

                clone(): MANTICORE.animation.action.Blink;
                reverse(): MANTICORE.animation.action.Blink;
            }

            class CallFunc extends MANTICORE.animation.action.ActionInstant {
                constructor(callback: MANTICORE.animation.callback.CallFuncExecute, context?: Object, data?: any);

                context: Object | null;

                execute(): void;
                clone(): MANTICORE.animation.action.CallFunc;
            }

            class CardinalSpline extends MANTICORE.animation.action.ActionInterval {
                protected static cardinalSplineAt(p0: PIXI.Point, p1: PIXI.Point, p2: PIXI.Point, p3: PIXI.Point, tension: number, t: number): PIXI.Point;
                protected static getControlPointAt(controlPoints: PIXI.Point[], pos: number): PIXI.Point;
                protected static reverseControlPoints(controlPoints: PIXI.Point[]): PIXI.Point[];
                protected static cloneControlPoints(controlPoints: PIXI.Point[]): PIXI.Point[];
            }

            class CardinalSplineBy extends MANTICORE.animation.action.CardinalSplineTo {
                constructor(duration: number, points: PIXI.Point[], tension?: number);

                clone(): MANTICORE.animation.action.CardinalSplineBy;
                reverse(): MANTICORE.animation.action.CardinalSplineBy;
                updatePosition(newPos: PIXI.Point): void;
            }

            class CardinalSplineTo extends MANTICORE.animation.action.CardinalSpline {
                constructor(duration: number, points: PIXI.Point[], tension?: number);

                points: PIXI.Point[];
                protected readonly tension: number;
                protected previousPosition: PIXI.Point;

                clone(): MANTICORE.animation.action.CardinalSplineTo;
                reverse(): MANTICORE.animation.action.CardinalSplineTo;
                updatePosition(newPos: PIXI.Point | PIXI.ObservablePoint): void;
            }

            class CatmullRomBy extends MANTICORE.animation.action.CardinalSplineBy {
                constructor(duration: number, points: PIXI.Point[]);

                clone(): MANTICORE.animation.action.CatmullRomBy;
            }

            class CatmullRomTo extends MANTICORE.animation.action.CardinalSplineTo {
                constructor(duration: number, points: PIXI.Point[]);

                clone(): MANTICORE.animation.action.CatmullRomTo;
            }

            class DelayTime extends MANTICORE.animation.action.ActionInterval{
                reverse(): MANTICORE.animation.action.DelayTime;
                clone(): MANTICORE.animation.action.DelayTime;
            }

            class FadeIn extends MANTICORE.animation.action.FadeTo {
                constructor(duration: number);
                reverse(): MANTICORE.animation.action.FadeTo;
                clone(): MANTICORE.animation.action.FadeIn;
            }

            class FadeOut extends MANTICORE.animation.action.FadeTo {
                constructor(duration: number);

                reverse(): MANTICORE.animation.action.FadeTo;
                clone(): MANTICORE.animation.action.FadeOut;
            }

            class FadeTo extends MANTICORE.animation.action.ActionInterval{
                constructor(duration: number, alpha: number);

                clone(): MANTICORE.animation.action.FadeTo;
            }

            class FiniteTimeAction extends MANTICORE.animation.action.Action {
                duration: number;
                repeatCount: number;
                repeatMethod: boolean;

                reverse(): MANTICORE.animation.action.FiniteTimeAction;
                clone(): MANTICORE.animation.action.FiniteTimeAction;
            }

            class FlipX extends MANTICORE.animation.action.ActionInstant {
                clone(): MANTICORE.animation.action.FlipX;
                reverse(): MANTICORE.animation.action.FlipX;
            }

            class FlipY extends MANTICORE.animation.action.ActionInstant {
                reverse(): MANTICORE.animation.action.FlipY;
                clone(): MANTICORE.animation.action.FlipY;
            }

            class Follow extends MANTICORE.animation.action.Action {
                constructor(followedDisplayObject: PIXI.DisplayObject, rect: PIXI.Rectangle);

                boundarySet: boolean;

                clone(): MANTICORE.animation.action.Follow;
            }

            class Hide extends MANTICORE.animation.action.ActionInstant {
                clone(): MANTICORE.animation.action.Hide;
                reverse(): MANTICORE.animation.action.Show;
            }

            class JumpBy extends MANTICORE.animation.action.ActionInterval {
                constructor(duration: number, position: PIXI.Point | number, y: number, height: number, jumps?: number);

                clone(): MANTICORE.animation.action.JumpBy;
                reverse(): MANTICORE.animation.action.JumpBy;

                protected readonly height: number;
                protected readonly jumps: number;
                protected readonly delta: PIXI.Point;
                protected readonly startPoint: PIXI.Point;
            }

            class JumpTo extends MANTICORE.animation.action.JumpBy {
                constructor(duration: number, position: PIXI.Point | number, y: number, height: number, jumps?: number);

                clone(): MANTICORE.animation.action.JumpTo;
            }

            class MoveBy extends MANTICORE.animation.action.ActionInterval {
                constructor(duration: number, deltaPos: PIXI.Point | number, deltaY?: number);

                protected readonly delta: PIXI.Point;

                clone(): MANTICORE.animation.action.MoveBy;
                reverse(): MANTICORE.animation.action.MoveBy;
            }

            class MoveTo extends MANTICORE.animation.action.MoveBy {
                constructor(duration: number, position: PIXI.Point | number, y: number);

                clone(): MANTICORE.animation.action.MoveTo;
            }

            class Place extends MANTICORE.animation.action.ActionInstant {
                constructor(x: PIXI.Point | number, y?: number);

                clone(): MANTICORE.animation.action.Place;
                reverse(): MANTICORE.animation.action.Place;
            }

            class PointAction extends MANTICORE.animation.action.ActionInterval{
                constructor(duration: number, x: number, y?:number);

                protected readonly startPoint: PIXI.Point;
                protected readonly endPoint: PIXI.Point;
                protected readonly delta: PIXI.Point;
            }

            class RemoveSelf extends MANTICORE.animation.action.ActionInstant {
                constructor(isKill?: boolean);
                clone(): MANTICORE.animation.action.RemoveSelf;
            }

            class Repeat extends ActionInterval {
                constructor(action: MANTICORE.animation.action.FiniteTimeAction, times?: number);

                clone(): MANTICORE.animation.action.Repeat;
                reverse(): MANTICORE.animation.action.Repeat;

                innerAction: MANTICORE.animation.action.FiniteTimeAction;
            }

            class RepeatForever extends MANTICORE.animation.action.ActionInterval{
                constructor(action: MANTICORE.animation.action.ActionInterval);

                innerAction: MANTICORE.animation.action.ActionInterval;

                clone(): MANTICORE.animation.action.RepeatForever;
                reverse(): MANTICORE.animation.action.RepeatForever;
            }

            class ReverseTime extends MANTICORE.animation.action.ActionInterval {
                constructor(action: MANTICORE.animation.action.FiniteTimeAction);

                clone(): MANTICORE.animation.action.ReverseTime;
                reverse(): MANTICORE.animation.action.ReverseTime;
            }

            class RotateBy extends MANTICORE.animation.action.ActionInterval {
                constructor(duration: number, deltaAngle: number);

                clone(): MANTICORE.animation.action.RotateBy;
                reverse(): MANTICORE.animation.action.RotateBy;
            }

            class RotateTo extends MANTICORE.animation.action.ActionInterval{
                constructor(duration: number, deltaAngle: number);

                clone(): MANTICORE.animation.action.RotateTo;
                reverse(): null;
            }

            class ScaleBy extends MANTICORE.animation.action.ScaleTo {
                reverse(): MANTICORE.animation.action.ScaleBy;
                clone(): MANTICORE.animation.action.ScaleBy;
            }

            class ScaleTo extends MANTICORE.animation.action.PointAction{
                constructor(duration: number, sx: number, sy?:number);

                clone(): MANTICORE.animation.action.ScaleTo;
            }

            class Sequence extends MANTICORE.animation.action.ActionInterval {
                constructor(...var_args: MANTICORE.animation.action.FiniteTimeAction[]);

                reversed: boolean;

                clone(): MANTICORE.animation.action.Sequence;
                reverse(): MANTICORE.animation.action.Sequence;
            }

            class Show extends MANTICORE.animation.action.ActionInstant {
                clone(): MANTICORE.animation.action.Show;
                reverse(): MANTICORE.animation.action.Hide;
            }

            class SkewBy extends MANTICORE.animation.action.SkewTo{
                constructor(t: number, sx: number, sy: number);

                clone(): MANTICORE.animation.action.SkewBy;
                reverse(): MANTICORE.animation.action.SkewBy;
            }

            class SkewTo extends MANTICORE.animation.action.PointAction{
                constructor(t: number, sx: number, sy: number);

                clone(): MANTICORE.animation.action.SkewTo;
            }

            class Spawn extends ActionInterval {
                constructor(...var_args: MANTICORE.animation.action.FiniteTimeAction[]);

                clone(): MANTICORE.animation.action.Spawn;
                reverse(): MANTICORE.animation.action.Spawn;
            }

            class Speed extends Action{
                constructor (action: MANTICORE.animation.action.ActionInterval, speed: number);

                speed: number;
                innerAction: MANTICORE.animation.action.ActionInterval;

                clone(): MANTICORE.animation.action.Speed;
                reverse(): MANTICORE.animation.action.Speed;
            }

            class TargetedAction extends MANTICORE.animation.action.ActionInterval {
                constructor(target: PIXI.DisplayObject, action: MANTICORE.animation.action.FiniteTimeAction);

                forcedTarget: PIXI.DisplayObject;

                clone(): MANTICORE.animation.action.TargetedAction;
            }

            class TintBy extends MANTICORE.animation.action.ActionInterval{
                constructor(duration: number, deltaRed: number, deltaGreen: number, deltaBlue: number);

                clone(): MANTICORE.animation.action.TintBy;
                reverse(): MANTICORE.animation.action.TintBy;
            }

            class TintTo extends MANTICORE.animation.action.ActionInterval {
                constructor(duration: number, red: number, green: number, blue: number);

                clone(): MANTICORE.animation.action.TintTo;
            }

            class ToggleVisibility extends MANTICORE.animation.action.ActionInstant {
                clone(): MANTICORE.animation.action.ToggleVisibility;
                reverse(): MANTICORE.animation.action.ToggleVisibility;
            }

            class Tween extends MANTICORE.animation.action.ActionInterval {
                constructor(duration: number, key: string, from:  number, to: number);
                reverse(): MANTICORE.animation.action.Tween;
                clone(): MANTICORE.animation.action.Tween;
            }
        }
        export namespace callback {
            type CallFuncExecute = (target: PIXI.DisplayObject, data?: any)=>void;
        }
        export namespace easing {
            class EaseBackIn extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseBackIn;
            }
            class EaseBackInOut extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseBackInOut;
            }
            class EaseBackOut extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseBackOut;
            }
            class EaseBase {
                constructor();
                easing(time: number): void;
                reverse(): EaseBase;
            }
            class EaseBezier extends MANTICORE.animation.easing.EaseBase {
                constructor(first: number, second: number, third: number, fourth: number);
                reverse(): EaseBezier;
            }
            class EaseBounceIn extends MANTICORE.animation.easing.EaseBounceTime {
                reverse(): EaseBounceIn;
            }
            class EaseBounceInOut extends MANTICORE.animation.easing.EaseBounceTime {
                reverse(): EaseBounceInOut;
            }
            class EaseBounceOut extends MANTICORE.animation.easing.EaseBounceTime {
                reverse(): EaseBounceOut;
            }
            class EaseBounceTime  extends EaseBase {
                protected bounceTime (time: number): number;
                reverse(): EaseBounceTime;
            }
            class EaseCircleIn extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseCircleIn;
            }
            class EaseCircleInOut extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseCircleInOut;
            }
            class EaseCircleOut extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseCircleOut;
            }
            class EaseCubicIn extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseCubicIn;
            }
            class EaseCubicInOut extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseCubicInOut;
            }
            class EaseCubicOut extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseCubicOut;
            }
            class EaseElasticIn  extends MANTICORE.animation.easing.EasePeriod {
                reverse(): EaseElasticIn;
            }
            class EaseElasticInOut  extends MANTICORE.animation.easing.EasePeriod {
                reverse(): EaseElasticInOut;
            }
            class EaseElasticOut  extends MANTICORE.animation.easing.EasePeriod {
                reverse(): EaseElasticOut;
            }
            class EaseExponentialIn extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseExponentialIn;
            }
            class EaseExponentialInOut extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseExponentialInOut;
            }
            class EaseExponentialOut extends MANTICORE.animation.easing.EaseBase {
                reverse(): EaseExponentialOut;
            }
            class EaseIn extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseIn;
            }
            class EaseInOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseInOut;
            }
            class EaseOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseOut;
            }
            class EasePeriod extends MANTICORE.animation.easing.EaseBase {
                constructor(period?: number);

                public period: number;

                reverse(): EasePeriod;

                protected calculateTime(time: number, period: number): number;
                protected easingPeriod(time: number);
                protected easingDefault(time: number): number;
            }

            class EaseQuadraticIn extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuadraticIn;
            }
            class EaseQuadraticInOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuadraticInOut;
            }
            class EaseQuadraticOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuadraticOut;
            }
            class EaseQuarticIn extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuarticIn;
            }
            class EaseQuarticInOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuarticInOut;
            }
            class EaseQuarticOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuarticOut;
            }
            class EaseQuinticIn extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuinticIn;
            }
            class EaseQuinticInOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuinticInOut;
            }
            class EaseQuinticOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseQuinticOut;
            }
            class EaseRate extends MANTICORE.animation.easing.EaseBase {
                constructor(rate?: number);
                public rate;
            }
            class EaseSineIn extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseSineIn;
            }
            class EaseSineInOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseSineInOut;
            }
            class EaseSineOut extends MANTICORE.animation.easing.EaseRate {
                reverse(): EaseSineOut;
            }
        }
    }
    export namespace builder {
        export namespace layoutBuilder {
            export function infiniteLayout(component: MANTICORE.component.ui.ComLayout): void;
        }
    }

    export namespace bundle {
        export namespace ancillary {
            class TextureAtlas {
                constructor(baseTexture: PIXI.BaseTexture, atlas: MANTICORE.type.AtlasInfo, bundle: MANTICORE.type.AssetBundle);
            }
        }
        export namespace bundle {
            class AssetBundle extends MANTICORE.bundle.bundle.BaseBundle {
                constructor (data: MANTICORE.type.AssetBundle);


                readonly linkedTextures: MANTICORE.bundle.bundle.LinkedTexture[];

                generateTextureAtlas(baseTexture: PIXI.BaseTexture, atlas: MANTICORE.type.AtlasInfo): void;

            }
            export class BaseBundle {
                constructor();
            }

            export interface LinkedTexture {
                link: string;
                name: string;
                isLoaded: boolean;
                atlas: MANTICORE.type.AtlasInfo;
            }
        }

        export namespace bundleCache {
            export function addAssetBundle(data: MANTICORE.type.AssetBundle): MANTICORE.bundle.bundle.AssetBundle | null;
            export function getAssetBundle(name: string): MANTICORE.bundle.bundle.AssetBundle | null;
        }
        export namespace middleware {
            export function bundleParser(resource: MANTICORE.loader.LoaderResource, next: MANTICORE.loader.LoaderCallback): void;
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
                innerPadding: PIXI.ObservablePoint;
                outerPadding: PIXI.ObservablePoint;
                verticalAlign: MANTICORE.enumerator.ui.VERTICAL_ALIGN;
                horizontalAlign: MANTICORE.enumerator.ui.HORIZONTAL_ALIGN;

                refreshLayot(): void;
                clone(): MANTICORE.component.ui.ComLayout;
            }

            export class ComItem extends MANTICORE.component.ui.ComUI {
                constructor();

                updateData(data: any): void;
                clone(): MANTICORE.component.ui.ComItem;
            }

            class ComItemBox extends MANTICORE.component.Component {
                constructor(templateComponent: MANTICORE.component.ui.ComItem, templateName: string, numCount?:number , startIndex?: number);
                readonly startIndex: number;
                readonly templateName: string;
                readonly templateNumCount: number;
                readonly componentTemplate: MANTICORE.component.ui.ComItem;

                updateData(data: any[]): void;
                getElement(index: number): MANTICORE.component.ui.ComItem | null;
                updateElementData(index: number, data: any): boolean;
                addItem<T extends MANTICORE.view.ComponentContainer>(child: T): void;
                clone(): MANTICORE.component.ui.ComItemBox;
            }


            export class ComUI extends MANTICORE.component.Component {
                constructor(name?: string);

                listenInteractions: boolean;

                onOwnerUp(event: MANTICORE.eventDispatcher.EventModel): void;
                onOwnerDown(event: MANTICORE.eventDispatcher.EventModel): void;
                onOwnerOver(event: MANTICORE.eventDispatcher.EventModel): void;
                onOwnerOut(event: MANTICORE.eventDispatcher.EventModel): void;
                onOwnerMove(event: MANTICORE.eventDispatcher.EventModel): void;
                onOwnerDragStart(event: MANTICORE.eventDispatcher.EventModel): void;
                onOwnerDragFinish(event: MANTICORE.eventDispatcher.EventModel): void;
                onOwnerDrag(event: MANTICORE.eventDispatcher.EventModel): void;
                onOwnerClick(event: MANTICORE.eventDispatcher.EventModel): void;
                logHierarchy(widget?: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite): void;
                setChildText<T extends PIXI.Container>(text: any, path: string, widget?: T): boolean;
                getChildView<T extends PIXI.Container>(path: string, widget?: T): T | null;
                addComponentToChild<P extends PIXI.Container, T extends MANTICORE.component.Component>(component: T, path: string, widget?: P): T;
                addChildListener<T extends PIXI.Container>(listener: MANTICORE.eventDispatcher.InteractiveCallback, eventType: MANTICORE.enumerator.ui.INTERACTIVE_EVENT, path: string, widget?: T): boolean;
                removeChildListener<T extends PIXI.Container>(eventType: MANTICORE.enumerator.ui.INTERACTIVE_EVENT, path: string,  widget?: T): boolean;
                removeAllChildListeners() : void;
                clone(): MANTICORE.component.ui.ComUI;
            }


            export class ComUIElement extends MANTICORE.component.ui.ComUI {
                constructor(elementName: string, bundleName?: string, owner?: MANTICORE.view.ComponentContainer);
                clone(): MANTICORE.component.ui.ComUIElement;
            }
        }

        export class ComChildIterator extends MANTICORE.component.Component {
            constructor(name?: string);

            childCount: number;

            hasChildren(): void;
            iterateChildren(callback: MANTICORE.component.callback.IterateChildren): void;
            clone(): MANTICORE.component.ComChildIterator;
        }

        export class Component {
            constructor(name?: string);

            reusable: boolean;
            blockEvents: boolean;
            inPool: boolean;
            name: string;
            owner: MANTICORE.view.ComponentContainer | null;
            active: boolean;
            listenChildren: boolean;
            listenVisible: boolean;

            hasOwner(): boolean;
            onAdd(owner: MANTICORE.view.ComponentContainer): void;
            onRemove(): void;
            onUpdate(dt: number): void;
            onAddChild(child: PIXI.DisplayObject): void;
            onRemoveChild(child: PIXI.DisplayObject): void;
            onVisibleChange(visible: boolean): void;
            reuse(...var_args: any[]): void;
            disuse(): void;
            destroy(): void;
            kill(): void;
            clone(): MANTICORE.component.Component;

            protected static cloneFromPool<T extends MANTICORE.component.Component>(var_args: any[]): T;
            protected addEventListener(event: string, handler: MANTICORE.eventDispatcher.EventModel): void;
            protected removeEventListener(event: string): void;
            protected dispatchEvent(event: string, data?: any): void;
        }
    }

    export namespace constant {
        export const COLLIDER_NAME: string;
    }

    export namespace enumerator {

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

        export enum FILE_TYPE {
            JSON = "json",
            PNG = "png",
            WEB_P = "webp"
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

        export namespace ui {
            export enum HORIZONTAL_ALIGN {
                LEFT = 0,
                CENTER = 1,
                RIGHT = 2
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
                DRAG_START = 8
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
                DESELECTED_DISABLED = 8,
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
                LIST_VIEW = 16
            }

            export enum VERTICAL_ALIGN {
                TOP = 0,
                MIDDLE = 1,
                BOTTOM = 2
            }
        }

    }

    export namespace eventDispatcher {
        export function addListener(type: string, listener: MANTICORE.eventDispatcher.InteractiveCallback, target: Object): void;
        export function hasListener(type: string, target: Object): boolean;
        export function removeListener(type: string, target: Object): boolean;
        export function dispatch(type: string, targetOrEvent?: Object, data?: Object): void;

        type InteractiveCallback = (event: MANTICORE.eventDispatcher.EventModel) => void;

        export class EventModel extends MANTICORE.model.PoolModel {
            constructor(target: Object, data: any);

            data: any;
            target: Object;
        }

        export class ListenerModel extends MANTICORE.model.PoolModel {
            constructor(event: string, listener: MANTICORE.eventDispatcher.InteractiveCallback, target: Object);

            event: string;
            target: Object;

            dispatch(data?: Object): void;
        }
    }

    export namespace launcher {
        export function initApp(resolution: MANTICORE.enumerator.RESOLUTION, bgColor?: number): void;
        export function getApp(): PIXI.Application;
        export function runScene(scene: MANTICORE.view.Scene): void;

    }

    export namespace loader {
        export interface LoaderResource {
            extension: string;
            error: string;
            name: string;
            url: string;
            data: any;
        }

        type LoaderCallback = () => void;
    }

    export namespace macro {
        export let FPS: number;
        export let USE_WEB_P_FALLBACK: boolean;
    }

    export namespace manager {
        export class BaseManager {
            constructor(owner: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite | MANTICORE.component.Component);

            destroy(): void;

            protected owner: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite | MANTICORE.component.Component;

        }
        export class ComponentManager extends MANTICORE.manager.BaseManager {
            constructor(owner: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite);

            inPool: boolean;

            addComponent(component: MANTICORE.component.Component): boolean;
            addComponents(components: any[]): void;
            getComponent(name: string): MANTICORE.component.Component | null;
            removeComponent(name: string): boolean;
            removeAllComponents(): void;
            iterateComponents(callback: MANTICORE.view.callback.IterateComponent): void;
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
            constructor(owner: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite | MANTICORE.component.Component);

            blockEvents: boolean;

            isListenEvent(event: string): boolean;

            addEventListener(event: string, handler: MANTICORE.eventDispatcher.InteractiveCallback): void;
            removeEventListener(event: string): void;
            removeAllEventListeners(): void;
            dispatchEvent(event: string, data?: any): void;

        }

        export class MemoryManager extends MANTICORE.manager.BaseManager {
            constructor(owner: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite | MANTICORE.component.Component);

            reusable: boolean;
            inPool: boolean;

            kill(): void;
        }
    }



    export namespace model {
        export class Model {
            constructor(id: number);
            id: number;
        }

        export class PoolModel extends MANTICORE.model.Model{
            constructor(id: number);

            inPool: boolean;

            reuse(...var_args: any[]): void;
            disuse(): void;
            kill(): void;
        }
    }

    export namespace pool {
        export function putObject(object: Object): void;
        export function hasObject(objectClass: Object): boolean;
        export function removeObject(object: Object): void;
        export function getObject(...var_args: any[]): void;
        export function drain(): void;

    }

    export namespace repository {
        export class Repository {
            constructor();

            addElement(value: any, key?: number | string): boolean;
            updateElement(value: any, key?: number | string): boolean;
            removeElement(key: number | string): boolean;
            hasElement(key: number | string): boolean;
            getElement(key: number | string): any;
            clear(isKillValues?: boolean): void;
            keys: number[] | string[];
            values: any[];
            isEmpty(): boolean;
        }
    }

    export namespace type {

        export interface AnimationData {
            name: number;
            fps: number;
            length: number;
            frames: MANTICORE.type.AnimationFrame[];
        }

        export interface AnimationFrame {
            type: MANTICORE.enumerator.ACTION_TYPE;
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
            fileData: number[];
            flip: boolean[];
            interactive: boolean;
            name: number;
            rotation: number[];
            scale: number[];
            slice9: number[];
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
            export class BaseButton {
                constructor(frame: string, state: number);

                enabled: boolean;
                title: MANTICORE.ui.ancillary.BaseLabel;
                titleText: string;

                hasTitle(): boolean;
                protected changeState(state: number): void;
                protected changeEnabledState(state: number): void;
                protected onEnabledChange(enabled: boolean): void;
                protected changeStateWithFallback(state: number, fallback: number, isEnabled?: boolean): void;

            }

            export class BaseLabel {
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

                getShadowOffset(): PIXI.Point;
                setShadowOffset(xOrPoint: number | PIXI.Point, y?: number): void;
                protected horizontalAlignChange(value: MANTICORE.enumerator.ui.HORIZONTAL_ALIGN): void;
                protected verticalAlignChange(value: MANTICORE.enumerator.ui.VERTICAL_ALIGN): void;

            }

            export class OutlineBitmapText extends PIXI.Container {
                constructor(fontName: string, size: number);
                anchor: PIXI.Point;
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

        export namespace fontCache{
            export function addFontSize(fontName: string, size: number): void;
            export function getFontName(fontName: string, size: number): string;
        }

        export namespace parser {
            export function parseElement(name: string, link: string): MANTICORE.ui.Widget;
        }

        export class AtlasLabel extends MANTICORE.ui.ancillary.BaseLabel {
            constructor(frame: string, letterWidth: number, letterHeight: number, dotWidth: number);
        }

        export class Button extends MANTICORE.ui.ancillary.BaseButton {
            constructor(upFrame: string, downFrame?: string, overFrame?: string, disabledFrame?: string);

            upFrame: string | null;
            downFrame: string | null;
            overFrame: string | null;
            disabledFrame: string | null;

            protected onActionUpHandler(event: Object): boolean;
            protected onActionDownHandler(event: Object): boolean;
            protected onActionOverHandler(event: Object): void;
            protected onActionOutHandler(event: Object): void;
            protected onActionUpOutsideHandler(event: Object): boolean;
            protected onEnabledChange(enabled: boolean): void;

        }

        export class CheckBox extends MANTICORE.ui.ancillary.BaseButton {
            constructor();

            icon: MANTICORE.ui.ancillary.StateSlice9Sprite;
            selected: boolean;

            protected onActionClickHandler(event: Object): void;
        }

        export class ImageView {
            constructor(frameName: string);
        }

        export class Label extends MANTICORE.ui.ancillary.BaseLabel {
            constructor(fontName: string, size: number);
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

            innerPadding: PIXI.ObservablePoint;
            outerPadding: PIXI.ObservablePoint;

        }

        export class ProgressBar extends Widget {
            constructor(frameLink: string, direction?: MANTICORE.enumerator.DIRECTION, type?: MANTICORE.enumerator.ui.PROGRESS_TYPE);
            direction: MANTICORE.enumerator.DIRECTION;
            progress: number;
            type: MANTICORE.enumerator.ui.PROGRESS_TYPE;
            frameName: string;
        }

        export class Panel extends MANTICORE.ui.Widget{
            constructor(graphicType?: MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number);

            backgroundColor: number;
            backgroundAlpha: number;

            getType(): MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE;
            setType(graphicType?: MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number): void;
        }

        export class ScrollView extends MANTICORE.ui.Widget {
            constructor(graphicType?: MANTICORE.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number);

            scrollDirection: MANTICORE.enumerator.ui.SCROLL_DIRECTION;
            horizontalSlider: MANTICORE.ui.Slider;
            verticalSlider: MANTICORE.ui.Slider;
            innerContainer: MANTICORE.ui.Widget;
            innerWidth: number;
            innerHeight: number;

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

            protected isVertical(): boolean;
            protected isHorizontal(): boolean;
            protected onDownInnerContainerHandler(event: MANTICORE.eventDispatcher.EventModel): void;
            protected onDragInnerContainerHandler(event: MANTICORE.eventDispatcher.EventModel): void;
            protected onScrollHorizontalHandler(event: MANTICORE.eventDispatcher.EventModel): void;
            protected onScrollVerticalHandler(event: MANTICORE.eventDispatcher.EventModel): void;
        }

        export class Slider extends MANTICORE.ui.Widget {
            constructor(ball: MANTICORE.ui.Widget, direction?: MANTICORE.enumerator.DIRECTION, progressFrame?: string);

            eventScroll: string;
            progressFrameName: string | null;
            progressBar: MANTICORE.ui.ProgressBar | null;
            direction: MANTICORE.enumerator.DIRECTION;
            progress: number;
            enabled: boolean;

            hasProgressBar(): boolean;
        }

        export class TextField extends MANTICORE.ui.Label{
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

            protected onActionUpHandler(event: Object): boolean;
        }

        export class ToggleButton extends MANTICORE.ui.ancillary.BaseButton{
            constructor(dUpFrame: string, sUpFrame: string, sDownFrame?: string, dDownFrame?: string, dOverFrame?: string, sOverFrame?: string, dDisabledFrame?: string, sDisabledFrame?: string);
            selected: boolean;

            protected onEnabledChange(enabled: boolean): void;

        }

        export class Widget extends MANTICORE.view.ComponentContainer {
            constructor(collider?: PIXI.Sprite | MANTICORE.view.Slice9Sprite);

            clipping: boolean;
            tint: number;
            anchor: PIXI.ObservablePoint;
            flipX: boolean;
            flipY: boolean;
            isDrag: boolean;
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

            public setSlice(leftSlice: number, rightSlice: number, topSlice: number, bottomSlice: number): void;
            public getInteractiveEvent(id: MANTICORE.enumerator.ui.INTERACTIVE_EVENT): string;
            public updateInteractiveEvent(id: MANTICORE.enumerator.ui.INTERACTIVE_EVENT, name?: string): void;

            protected collider: PIXI.Sprite | MANTICORE.view.Slice9Sprite | MANTICORE.ui.ancillary.StateSlice9Sprite;
            protected onActionUpHandler(event: Object): boolean;
            protected onActionDownHandler(event: Object): boolean;
            protected onActionOverHandler(event: Object): void;
            protected onActionOutHandler(event: Object): void;
            protected onActionUpOutsideHandler(event: Object): boolean;
            protected onActionMoveHandler(event: Object): boolean;
            protected onActionClickHandler(event: Object): void;
            protected onActionDragStartHandler(event: Object): void;
            protected onActionDragFinishHandler(event: Object): void;
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
            export function getLightness(color: number): number;
            export function setLightness(color: number, lightness: number): number;
            export function getHue(color: number): number;
            export function setHue(color: number, hue: number): number;
            export function getSaturation(color: number): number;
            export function setSaturation(color: number, saturation: number): number;
            export function intToRgb(value: number): number[];
            export function intToHsl(value: number): number[];
            export function hslToInt(hue: number, saturation: number, lightness: number): number;
            export function rgbToInt(red: number, green: number, blue: number): number;
            export function rgbToHsl(red: number, green: number, blue: number): number[];
            export function hslToRgb(hue: number, saturation: number, lightness: number): number[];

        }
        export namespace format {
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
            export function pFromSize(size: PIXI.Container | PIXI.Rectangle, inPoint?: PIXI.Point | PIXI.ObservablePoint): PIXI.Point | PIXI.ObservablePoint;
            export function pHalfSize(size: PIXI.Container | PIXI.Rectangle, inPoint?: PIXI.Point | PIXI.ObservablePoint): PIXI.Point | PIXI.ObservablePoint;
            export function sSub(size1: PIXI.Container | PIXI.Rectangle, size2: PIXI.Container | PIXI.Rectangle, inPoint?: PIXI.Point | PIXI.ObservablePoint): PIXI.Point | PIXI.ObservablePoint;
            export function pSub(p1: PIXI.Point | PIXI.ObservablePoint, p2: PIXI.Point | PIXI.ObservablePoint, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pAdd(p1: PIXI.Point | PIXI.ObservablePoint, p2: PIXI.Point | PIXI.ObservablePoint, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pMult(p: PIXI.Point | PIXI.ObservablePoint, multiplier: number, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pCompMult(p1: PIXI.Point | PIXI.ObservablePoint, p2: PIXI.Point | PIXI.ObservablePoint, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pMax(p1: PIXI.Point | PIXI.ObservablePoint, p2: PIXI.Point | PIXI.ObservablePoint, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pMin(p1: PIXI.Point | PIXI.ObservablePoint, p2: PIXI.Point | PIXI.ObservablePoint, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pNeg(p: PIXI.Point | PIXI.ObservablePoint, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pRound(p: PIXI.Point | PIXI.ObservablePoint, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pInvert(p: PIXI.Point | PIXI.ObservablePoint, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pRange(p: PIXI.Point | PIXI.ObservablePoint, pLeft: PIXI.Point | PIXI.ObservablePoint, pRight: PIXI.Point | PIXI.ObservablePoint, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pEqual(p1: PIXI.Point | PIXI.ObservablePoint, p2: PIXI.Point | PIXI.ObservablePoint): boolean;

        }
        export namespace math {
            export const PI: number;
            export const HALF_CIRCLE: number;
            export const MAX_BYTE: number;
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
            export function intPow(value: number, power: number): number;
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
            export function setValue(value: any, defaultValue?: any): any;
        }

        export namespace ui {
            export function logHierarchy(widget: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite): void;
            export function getChildView<T extends PIXI.Container>(path: string, firstElement: T): T| null;
        }
    }

    export namespace view {
        namespace callback {
            type IterateComponent = (component: MANTICORE.component.Component, index?: number)=>void;
        }

        export class ComponentContainer extends PIXI.Container{
            constructor();

            reusable: boolean;
            blockEvents: boolean;
            inPool: boolean;
            uiType: MANTICORE.enumerator.ui.UI_ELEMENT;
            isUpdate: boolean;

            public addComponent(component: MANTICORE.component.Component): boolean;
            public addComponents(components: any[]): void;
            public getComponent<T extends MANTICORE.component.Component>(name: string): T | null;
            public removeComponent(name: string): boolean;
            public removeAllComponents(): void;
            public runAction(action: MANTICORE.animation.action.Action): void;
            public disuse(): void;
            public kill(): void;
            public destroy(): void;

            protected addEventListener(event: string, handler: MANTICORE.eventDispatcher.InteractiveCallback): void;
            protected removeEventListener(event: string): void;
            protected dispatchEvent(event: string, data?: any): void;
            protected onUpdate(dt: number): void;

        }
        export class ComponentSprite extends PIXI.Sprite {
            constructor(frameName: string);

            reusable: boolean;
            blockEvents: boolean;
            inPool: boolean;
            uiType: MANTICORE.enumerator.ui.UI_ELEMENT;
            isUpdate: boolean;

            public addComponent(component: MANTICORE.component.Component): boolean;
            public addComponents(components: any[]): void;
            public getComponent(name: string): MANTICORE.component.Component | null;
            public removeComponent(name: string): boolean;
            public removeAllComponents(): void;
            public runAction(action: MANTICORE.animation.action.Action): void;
            public disuse(): void;
            public kill(): void;
            public destroy(): void;

            protected addEventListener(event: string, handler: MANTICORE.eventDispatcher.InteractiveCallback): void;
            protected removeEventListener(event: string): void;
            protected dispatchEvent(event: string, data?: any): void;
            protected onUpdate(dt: number): void;

        }
        export class Scene extends PIXI.Container{
            constructor(comTransitionShow?: MANTICORE.component.Component, comTransitionHide?: MANTICORE.component.Component);

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
            anchor: PIXI.ObservablePoint;
            leftSlice: number;
            rightSlice: number;
            topSlice: number;
            bottomSlice: number;
            frameName: string;

            public getSlice(): number[];
            public setSlice(leftSlice?: number, rightSlice?: number, topSlice?: number, bottomSlice?: number): void;
        }
    }
}
