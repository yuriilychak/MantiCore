declare namespace mCore {
    class TransformBase {
        static IDENTITY: TransformBase;

        worldTransform: Matrix;
        localTransform: Matrix;

        protected _worldID: number;
        protected _parentID: number;

        updateLocalTransform(): void;
        updateTransform(parentTransform: TransformBase): void;
        updateWorldTransform(parentTransform: TransformBase): void;
    }

    class Matrix {
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);

        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        fromArray(array: number[]): void;
        set(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
        toArray(transpose?: boolean, out?: number[]): number[];
        apply(pos: mCore.geometry.Point, newPos?: mCore.geometry.Point): mCore.geometry.Point;
        applyInverse(pos: mCore.geometry.Point, newPos?: mCore.geometry.Point): mCore.geometry.Point;
        translate(x: number, y: number): Matrix;
        scale(x: number, y: number): Matrix;
        rotate(angle: number): Matrix;
        append(matrix: Matrix): Matrix;
        setTransform(
            x: number,
            y: number,
            pivotX: number,
            pivotY: number,
            scaleX: number,
            scaleY: number,
            rotation: number,
            skewX: number,
            skewY: number
        ): Matrix;
        prepend(matrix: Matrix): Matrix;
        invert(): Matrix;
        identity(): Matrix;
        decompose(transform: TransformBase): TransformBase;
        clone(): Matrix;
        copy(matrix: Matrix): Matrix;

        static IDENTITY: Matrix;
        static TEMP_MATRIX: Matrix;
    }

    class BaseTexture {
        static from(
            source: string | HTMLImageElement | HTMLCanvasElement,
            scaleMode?: number,
            sourceScale?: number
        ): BaseTexture;

        constructor(
            source?: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
            scaleMode?: number,
            resolution?: number
        );

        protected uuid?: number;
        protected touched: number;
        resolution: number;
        width: number;
        height: number;
        realWidth: number;
        realHeight: number;
        scaleMode: number;
        hasLoaded: boolean;
        isLoading: boolean;
        wrapMode: number;
        source: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | null;
        origSource: HTMLImageElement | null;
        imageType: string | null;
        sourceScale: number;
        premultipliedAlpha: boolean;
        imageUrl: string | null;
        protected isPowerOfTwo: boolean;
        mipmap: boolean;
        wrap?: boolean;
        protected _glTextures: any;
        protected _enabled: number;
        protected _id?: number;
        protected _virtualBoundId: number;
        protected readonly _destroyed: boolean;
        textureCacheIds: string[];

        update(): void;
        protected _updateDimensions(): void;
        protected _updateImageType(): void;
        protected _loadSvgSource(): void;
        protected _loadSvgSourceUsingDataUri(dataUri: string): void;
        protected _loadSvgSourceUsingXhr(): void;
        protected _loadSvgSourceUsingString(svgString: string): void;
        protected loadSource(source: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): void;
        protected _sourceLoaded(): void;
        destroy(): void;
        dispose(): void;
        updateSourceImage(newSrc: string): void;

        static fromImage(
            imageUrl: string,
            crossorigin?: boolean,
            scaleMode?: number,
            sourceScale?: number
        ): BaseTexture;
        static fromCanvas(canvas: HTMLCanvasElement, scaleMode?: number, origin?: string): BaseTexture;
        static addToCache(baseTexture: BaseTexture, id: string): void;
        static removeFromCache(baseTexture: string | BaseTexture): BaseTexture;

        on(
            event: "update" | "loaded" | "error" | "dispose",
            fn: (baseTexture: BaseTexture) => void,
            context?: any
        ): this;
        once(
            event: "update" | "loaded" | "error" | "dispose",
            fn: (baseTexture: BaseTexture) => void,
            context?: any
        ): this;
        removeListener(
            event: "update" | "loaded" | "error" | "dispose",
            fn?: (baseTexture: BaseTexture) => void,
            context?: any
        ): this;
        removeAllListeners(event?: "update" | "loaded" | "error" | "dispose"): this;
        off(
            event: "update" | "loaded" | "error" | "dispose",
            fn?: (baseTexture: BaseTexture) => void,
            context?: any
        ): this;
        addListener(
            event: "update" | "loaded" | "error" | "dispose",
            fn: (baseTexture: BaseTexture) => void,
            context?: any
        ): this;
    }

    class Texture {
        constructor(
            baseTexture: BaseTexture,
            frame?: mCore.geometry.Rectangle,
            orig?: mCore.geometry.Rectangle,
            trim?: mCore.geometry.Rectangle,
            rotate?: number,
            anchor?: mCore.geometry.Point
        );

        noFrame: boolean;
        baseTexture: BaseTexture;
        protected _frame: mCore.geometry.Rectangle;
        trim?: mCore.geometry.Rectangle;
        valid: boolean;
        requiresUpdate: boolean;
        protected _uvs: TextureUvs;
        orig: mCore.geometry.Rectangle;
        defaultAnchor: mCore.geometry.Point;
        protected _updateID: number;
        transform: TextureMatrix;
        textureCacheIds: string[];

        update(): void;
        protected onBaseTextureLoaded(baseTexture: BaseTexture): void;
        protected onBaseTextureUpdated(baseTexture: BaseTexture): void;
        destroy(destroyBase?: boolean): void;
        clone(): Texture;
        _updateUvs(): void;

        static fromImage(imageUrl: string, crossOrigin?: boolean, scaleMode?: number, sourceScale?: number): Texture;
        static fromFrame(frameId: string): Texture;
        static fromCanvas(canvas: HTMLCanvasElement, scaleMode?: number, origin?: string): Texture;
        static fromVideo(
            video: HTMLVideoElement | string,
            scaleMode?: number,
            crossorigin?: boolean,
            autoPlay?: boolean
        ): Texture;
        static fromVideoUrl(videoUrl: string, scaleMode?: number, crossorigin?: boolean, autoPlay?: boolean): Texture;
        static from(
            source: number | string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | BaseTexture
        ): Texture;
        static fromLoader(source: HTMLImageElement | HTMLCanvasElement, imageUrl: string, name?: string): Texture;
        static addToCache(texture: Texture, id: string): void;
        static removeFromCache(texture: string | Texture): Texture;

        // depreciation
        static addTextureToCache(texture: Texture, id: string): void;
        static removeTextureFromCache(id: string): Texture;

        frame: mCore.geometry.Rectangle;
        protected _rotate: boolean | 0;
        rotate: number;
        width: number;
        height: number;

        static EMPTY: Texture;
        static WHITE: Texture;

        on(event: "update", fn: (texture: Texture) => void, context?: any): this;
        once(event: "update", fn: (texture: Texture) => void, context?: any): this;
        removeListener(event: "update", fn?: (texture: Texture) => void, context?: any): this;
        removeAllListeners(event?: "update"): this;
        off(event: "update", fn?: (texture: Texture) => void, context?: any): this;
        addListener(event: "update", fn: (texture: Texture) => void, context?: any): this;
    }
    class TextureMatrix {
        constructor(texture: Texture, clampMargin?: number);

        protected _texture: Texture;
        mapCoord: Matrix;
        uClampFrame: Float32Array;
        uClampOffset: Float32Array;
        protected _lastTextureID: number;

        clampOffset: number;
        clampMargin: number;

        texture: Texture;

        update(forceUpdate?: boolean): boolean;
        multiplyUvs(uvs: Float32Array, out?: Float32Array): Float32Array;
    }
    class TextureUvs {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        x3: number;
        y3: number;

        uvsUint32: Uint32Array;

        protected set(frame: mCore.geometry.Rectangle, baseFrame: mCore.geometry.Rectangle, rotate: number): void;
    }

    export namespace animation {
        export namespace action {
            // @ts-ignore
            export class Action extends mCore.memory.ReusableObject{
                constructor ();

                readonly isDone: boolean;
                target: mCore.view.ComponentContainer;
                originalTarget: mCore.view.ComponentContainer;

                clone(): mCore.animation.action.Action;
                hasTarget(): boolean;
                startWithTarget(target: mCore.view.ComponentContainer): void;
                stop(): void;
                step(dt: number): void;
                update (dt: number):void;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.Action>(): T;
            }

            export class ActionInstant extends mCore.animation.action.FiniteTimeAction{
                reverse(): any;
                clone(): mCore.animation.action.ActionInstant;
                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.ActionInstant>(): T;
            }

            // @ts-ignore
            export class ActionInterval extends mCore.animation.action.FiniteTimeAction {
                constructor(duration?: number);

                readonly elapsed: number;
                ease: mCore.animation.easing.EaseBase;
                repeatForever: boolean;
                speedMethod: boolean;
                repeatMethod: boolean;
                amplitudeRate: number;
                speed: number;

                clone(): mCore.animation.action.ActionInterval;
                changeSpeed(speed: number): number;
                repeat(times: number): void;

                protected doClone<T extends mCore.animation.action.ActionInterval>(action: T): T;
                protected doReverse<T extends mCore.animation.action.ActionInterval>(action: T): T;
                protected computeEaseTime(dt: number): number;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.ActionInterval>(duration?: number): T;
            }

            // @ts-ignore
            export class BezierBy extends mCore.animation.action.ActionInterval{
                constructor(duration: number, controlPoints: mCore.geometry.Point[]);

                protected readonly startPoint: mCore.geometry.Point;
                protected readonly config: mCore.geometry.Point[];

                clone(): mCore.animation.action.BezierBy;
                reverse(): mCore.animation.action.BezierBy;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.BezierBy>(duration: number, controlPoints: mCore.geometry.Point[]): T;
            }

            export class BezierTo extends mCore.animation.action.BezierBy {
                clone(): mCore.animation.action.BezierTo;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.BezierTo>(duration: number, controlPoints: mCore.geometry.Point[]): T;
            }

            // @ts-ignore
            export class Blink extends ActionInterval {
                constructor(duration: number, blinks: number);

                clone(): mCore.animation.action.Blink;
                reverse(): mCore.animation.action.Blink;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.Blink>(duration: number, blinks: number): T;
            }

            // @ts-ignore
            export class CallFunc extends mCore.animation.action.ActionInstant {
                constructor(callback: mCore.animation.callback.CallFuncExecute, context?: Object, data?: any);

                context: Object | null;

                execute(): void;
                clone(): mCore.animation.action.CallFunc;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.CallFunc>(callback: mCore.animation.callback.CallFuncExecute, context?: Object, data?: any): T;
            }

            export class CardinalSpline extends mCore.animation.action.ActionInterval {
                protected static cardinalSplineAt(p0: mCore.geometry.Point, p1: mCore.geometry.Point, p2: mCore.geometry.Point, p3: mCore.geometry.Point, tension: number, t: number): mCore.geometry.Point;
                protected static getControlPointAt(controlPoints: mCore.geometry.Point[], pos: number): mCore.geometry.Point;
                protected static reverseControlPoints(controlPoints: mCore.geometry.Point[]): mCore.geometry.Point[];
                protected static cloneControlPoints(controlPoints: mCore.geometry.Point[]): mCore.geometry.Point[];

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.CardinalSpline>(duration: number): T;
            }

            export class CardinalSplineBy extends mCore.animation.action.CardinalSplineTo {
                constructor(duration: number, points: mCore.geometry.Point[], tension?: number);

                clone(): mCore.animation.action.CardinalSplineBy;
                reverse(): mCore.animation.action.CardinalSplineBy;
                updatePosition(newPos: mCore.geometry.Point): void;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.CardinalSplineBy>(duration: number): T;
            }

            // @ts-ignore
            export class CardinalSplineTo extends mCore.animation.action.CardinalSpline {
                constructor(duration: number, points: mCore.geometry.Point[], tension?: number);

                points: mCore.geometry.Point[];
                protected readonly tension: number;
                protected previousPosition: mCore.geometry.Point;

                clone(): mCore.animation.action.CardinalSplineTo;
                reverse(): mCore.animation.action.CardinalSplineTo;
                updatePosition(newPos: mCore.geometry.Point): void;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.CardinalSplineTo>(duration: number): T;
            }

            // @ts-ignore
            export class CatmullRomBy extends mCore.animation.action.CardinalSplineBy {
                constructor(duration: number, points: mCore.geometry.Point[]);

                clone(): mCore.animation.action.CatmullRomBy;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.CatmullRomBy>(duration: number, points: mCore.geometry.Point[]): T;
            }

            // @ts-ignore
            export class CatmullRomTo extends mCore.animation.action.CardinalSplineTo {
                constructor(duration: number, points: mCore.geometry.Point[]);

                clone(): mCore.animation.action.CatmullRomTo;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.CatmullRomTo>(duration: number, points: mCore.geometry.Point[]): T;
            }

            // @ts-ignore
            export class DelayTime extends mCore.animation.action.ActionInterval{
                reverse(): mCore.animation.action.DelayTime;
                clone(): mCore.animation.action.DelayTime;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.DelayTime>(duration: number): T;
            }

            // @ts-ignore
            export class FadeIn extends mCore.animation.action.FadeTo {
                constructor(duration: number);
                reverse(): mCore.animation.action.FadeTo;
                clone(): mCore.animation.action.FadeIn;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.FadeIn>(duration: number): T;
            }

            // @ts-ignore
            export class FadeOut extends mCore.animation.action.FadeTo {
                constructor(duration: number);

                reverse(): mCore.animation.action.FadeTo;
                clone(): mCore.animation.action.FadeOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.FadeOut>(duration: number): T;
            }

            // @ts-ignore
            export class FadeTo extends mCore.animation.action.ActionInterval{
                constructor(duration: number, alpha: number);

                clone(): mCore.animation.action.FadeTo;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.FadeTo>(duration: number, alpha: number): T;
            }

            // @ts-ignore
            export class FiniteTimeAction extends mCore.animation.action.Action {
                duration: number;
                repeatCount: number;
                repeatMethod: boolean;

                reverse(): mCore.animation.action.FiniteTimeAction;
                clone(): mCore.animation.action.FiniteTimeAction;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.FiniteTimeAction>(): T;
            }

            export class FlipX extends mCore.animation.action.ActionInstant {
                clone(): mCore.animation.action.FlipX;
                reverse(): mCore.animation.action.FlipX;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.FlipX>(): T;
            }

            export class FlipY extends mCore.animation.action.ActionInstant {
                reverse(): mCore.animation.action.FlipY;
                clone(): mCore.animation.action.FlipY;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.FlipY>(): T;
            }

            // @ts-ignore
            export class Follow extends mCore.animation.action.Action {
                constructor(followedDisplayObject: mCore.view.ComponentContainer, rect: mCore.geometry.Rectangle);

                boundarySet: boolean;

                clone(): mCore.animation.action.Follow;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.Follow>(followedDisplayObject: mCore.view.ComponentContainer, rect: mCore.geometry.Rectangle): T;
            }

            // @ts-ignore
            export class FrameChange extends mCore.animation.action.ActionInstant {
                constructor(frame: string);
                clone(): mCore.animation.action.FrameChange;
                reverse(): mCore.animation.action.FrameChange;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.FrameChange>(frame: string): T;
            }

            export class Hide extends mCore.animation.action.ActionInstant {
                clone(): mCore.animation.action.Hide;
                reverse(): mCore.animation.action.Show;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.Hide>(): T;
            }

            // @ts-ignore
            export class JumpBy extends mCore.animation.action.ActionInterval {
                constructor(duration: number, position: mCore.geometry.Point | number, y: number, height: number, jumps?: number);

                clone(): mCore.animation.action.JumpBy;
                reverse(): mCore.animation.action.JumpBy;

                protected readonly height: number;
                protected readonly jumps: number;
                protected readonly delta: mCore.geometry.Point;
                protected readonly startPoint: mCore.geometry.Point;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.JumpBy>(duration: number, position: mCore.geometry.Point | number, y: number, height: number, jumps?: number): T;
            }

            export class JumpTo extends mCore.animation.action.JumpBy {
                constructor(duration: number, position: mCore.geometry.Point | number, y: number, height: number, jumps?: number);

                clone(): mCore.animation.action.JumpTo;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.JumpTo>(duration: number, position: mCore.geometry.Point | number, y: number, height: number, jumps?: number): T;
            }

            // @ts-ignore
            export class MoveBy extends mCore.animation.action.ActionInterval {
                constructor(duration: number, deltaPos: mCore.geometry.Point | number, deltaY?: number);

                protected readonly delta: mCore.geometry.Point;

                clone(): mCore.animation.action.MoveBy;
                reverse(): mCore.animation.action.MoveBy;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.MoveBy>(duration: number, deltaPos: mCore.geometry.Point | number, deltaY?: number): T;
            }

            export class MoveTo extends mCore.animation.action.MoveBy {
                constructor(duration: number, position: mCore.geometry.Point | number, y: number);

                clone(): mCore.animation.action.MoveTo;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.MoveTo>(duration: number, position: mCore.geometry.Point | number, y: number): T;
            }

            // @ts-ignore
            export class Place extends mCore.animation.action.ActionInstant {
                constructor(x: mCore.geometry.Point | number, y?: number);

                clone(): mCore.animation.action.Place;
                reverse(): mCore.animation.action.Place;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.Place>(x: mCore.geometry.Point | number, y?: number): T;
            }

            // @ts-ignore
            export class PointAction extends mCore.animation.action.ActionInterval{
                constructor(duration: number, x: number, y?:number);

                protected readonly startPoint: mCore.geometry.Point;
                protected readonly endPoint: mCore.geometry.Point;
                protected readonly delta: mCore.geometry.Point;
                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.PointAction>(duration: number, x: number, y?:number): T;
            }

            export class RemoveSelf extends mCore.animation.action.ActionInstant {
                constructor(isKill?: boolean);
                clone(): mCore.animation.action.RemoveSelf;
                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.RemoveSelf>(isKill?: boolean): T;
            }

            // @ts-ignore
            export class Repeat extends ActionInterval {
                constructor(action: mCore.animation.action.FiniteTimeAction, times?: number);

                clone(): mCore.animation.action.Repeat;
                reverse(): mCore.animation.action.Repeat;

                innerAction: mCore.animation.action.FiniteTimeAction;
                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.Repeat>(action: mCore.animation.action.FiniteTimeAction, times?: number): T;
            }

            // @ts-ignore
            export class RepeatForever extends mCore.animation.action.ActionInterval{
                constructor(action: mCore.animation.action.ActionInterval);

                innerAction: mCore.animation.action.ActionInterval;

                clone(): mCore.animation.action.RepeatForever;
                reverse(): mCore.animation.action.RepeatForever;
                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.RepeatForever>(action: mCore.animation.action.ActionInterval): T;
            }

            // @ts-ignore
            export class ReverseTime extends mCore.animation.action.ActionInterval {
                constructor(action: mCore.animation.action.FiniteTimeAction);

                clone(): mCore.animation.action.ReverseTime;
                reverse(): mCore.animation.action.ReverseTime;
                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.ReverseTime>(action: mCore.animation.action.FiniteTimeAction): T;
            }

            // @ts-ignore
            export class RotateBy extends mCore.animation.action.ActionInterval {
                constructor(duration: number, deltaAngle: number);

                clone(): mCore.animation.action.RotateBy;
                reverse(): mCore.animation.action.RotateBy;
                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.RotateBy>(duration: number, deltaAngle: number): T;
            }

            // @ts-ignore
            export class RotateTo extends mCore.animation.action.ActionInterval{
                constructor(duration: number, deltaAngle: number);

                clone(): mCore.animation.action.RotateTo;
                reverse(): null;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.RotateTo>(duration: number, deltaAngle: number): T;
            }

            // @ts-ignore
            export class ScaleBy extends mCore.animation.action.ScaleTo {
                reverse(): mCore.animation.action.ScaleBy;
                clone(): mCore.animation.action.ScaleBy;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.ScaleBy>(duration: number, sx: number, sy?:number): T;
            }

            // @ts-ignore
            export class ScaleTo extends mCore.animation.action.PointAction{
                constructor(duration: number, sx: number, sy?:number);

                clone(): mCore.animation.action.ScaleTo;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.ScaleTo>(duration: number, sx: number, sy?:number): T;
            }

            // @ts-ignore
            export class Sequence extends mCore.animation.action.ActionInterval {
                constructor(...var_args: mCore.animation.action.FiniteTimeAction[]);

                reversed: boolean;

                clone(): mCore.animation.action.Sequence;
                reverse(): mCore.animation.action.Sequence;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.Sequence>(...var_args: mCore.animation.action.FiniteTimeAction[]): T;
            }

            export class Show extends mCore.animation.action.ActionInstant {
                clone(): mCore.animation.action.Show;
                reverse(): mCore.animation.action.Hide;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.Show>(): T;
            }

            // @ts-ignore
            export class SkewBy extends mCore.animation.action.SkewTo{
                constructor(t: number, sx: number, sy: number);

                clone(): mCore.animation.action.SkewBy;
                reverse(): mCore.animation.action.SkewBy;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.SkewBy>(t: number, sx: number, sy: number): T;
            }

            // @ts-ignore
            export class SkewTo extends mCore.animation.action.PointAction{
                constructor(t: number, sx: number, sy: number);

                clone(): mCore.animation.action.SkewTo;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.SkewTo>(t: number, sx: number, sy: number): T;
            }

            // @ts-ignore
            export class Spawn extends ActionInterval {
                constructor(...var_args: mCore.animation.action.FiniteTimeAction[]);

                clone(): mCore.animation.action.Spawn;
                reverse(): mCore.animation.action.Spawn;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.Spawn>(...var_args: mCore.animation.action.FiniteTimeAction[]): T;
            }

            // @ts-ignore
            export class Speed extends Action{
                constructor (action: mCore.animation.action.ActionInterval, speed: number);

                speed: number;
                innerAction: mCore.animation.action.ActionInterval;

                clone(): mCore.animation.action.Speed;
                reverse(): mCore.animation.action.Speed;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.Speed>(action: mCore.animation.action.ActionInterval, speed: number): T;
            }

            // @ts-ignore
            export class TargetedAction extends mCore.animation.action.ActionInterval {
                constructor(target: mCore.view.ComponentContainer, action: mCore.animation.action.FiniteTimeAction);

                forcedTarget: mCore.view.ComponentContainer;

                clone(): mCore.animation.action.TargetedAction;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.TargetedAction>(target: mCore.view.ComponentContainer, action: mCore.animation.action.FiniteTimeAction): T;
            }

            // @ts-ignore
            export class TintBy extends mCore.animation.action.ActionInterval{
                constructor(duration: number, deltaRed: number, deltaGreen: number, deltaBlue: number);

                clone(): mCore.animation.action.TintBy;
                reverse(): mCore.animation.action.TintBy;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.TintBy>(duration: number, deltaRed: number, deltaGreen: number, deltaBlue: number): T;
            }

            // @ts-ignore
            export class TintTo extends mCore.animation.action.ActionInterval {
                constructor(duration: number, red: number, green: number, blue: number);

                clone(): mCore.animation.action.TintTo;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.TintTo>(duration: number, deltaRed: number, deltaGreen: number, deltaBlue: number): T;
            }

            export class ToggleVisibility extends mCore.animation.action.ActionInstant {
                clone(): mCore.animation.action.ToggleVisibility;
                reverse(): mCore.animation.action.ToggleVisibility;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.ToggleVisibility>(): T;
            }

            // @ts-ignore
            export class Tween extends mCore.animation.action.ActionInterval {
                constructor(duration: number, key: string, from:  number, to: number);
                reverse(): mCore.animation.action.Tween;
                clone(): mCore.animation.action.Tween;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.action.Tween>(duration: number, key: string, from:  number, to: number): T;
            }
        }
        export namespace callback {
            export type CallFuncExecute = (target: mCore.view.ComponentContainer, data?: any)=>void;
        }
        export namespace easing {
            export class EaseBackIn extends mCore.animation.easing.EaseBase {
                reverse(): EaseBackIn;
                clone(): EaseBackIn;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseBackIn>(): T;
            }
            export class EaseBackInOut extends mCore.animation.easing.EaseBase {
                reverse(): EaseBackInOut;
                clone(): EaseBackInOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseBackInOut>(): T;
            }
            export class EaseBackOut extends mCore.animation.easing.EaseBase {
                reverse(): EaseBackOut;
                clone(): EaseBackOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseBackOut>(): T;
            }
            // @ts-ignore
            export class EaseBase extends mCore.memory.ReusableObject {
                constructor();
                easing(time: number): void;
                reverse(): EaseBase;
                clone(): EaseBase;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseBase>(): T;
            }
            export class EaseBezier extends mCore.animation.easing.EaseBase {
                constructor(first: number, second: number, third: number, fourth: number);
                reverse(): EaseBezier;
                clone(): EaseBezier;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseBezier>(): T;
            }
            export class EaseBounceIn extends mCore.animation.easing.EaseBounceTime {
                reverse(): EaseBounceIn;
                clone(): EaseBounceIn;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseBounceIn>(): T;
            }
            export class EaseBounceInOut extends mCore.animation.easing.EaseBounceTime {
                reverse(): EaseBounceInOut;
                clone(): EaseBounceInOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseBounceInOut>(): T;
            }
            export class EaseBounceOut extends mCore.animation.easing.EaseBounceTime {
                reverse(): EaseBounceOut;
                clone(): EaseBounceOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseBounceOut>(): T;
            }
            // @ts-ignore
            export class EaseBounceTime  extends EaseBase {
                protected bounceTime (time: number): number;
                reverse(): EaseBounceTime;
                clone(): EaseBounceTime;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseBounceTime>(): T;
            }
            export class EaseCircleIn extends mCore.animation.easing.EaseBase {
                reverse(): EaseCircleIn;
                clone(): EaseCircleIn;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseCircleIn>(): T;
            }
            export class EaseCircleInOut extends mCore.animation.easing.EaseBase {
                reverse(): EaseCircleInOut;
                clone(): EaseCircleInOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseCircleInOut>(): T;
            }
            export class EaseCircleOut extends mCore.animation.easing.EaseBase {
                reverse(): EaseCircleOut;
                clone(): EaseCircleOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseCircleOut>(): T;
            }
            export class EaseCubicIn extends mCore.animation.easing.EaseBase {
                reverse(): EaseCubicIn;
                clone(): EaseCubicIn;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseCubicIn>(): T;
            }
            export class EaseCubicInOut extends mCore.animation.easing.EaseBase {
                reverse(): EaseCubicInOut;
                clone(): EaseCubicInOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseCubicInOut>(): T;
            }
            export class EaseCubicOut extends mCore.animation.easing.EaseBase {
                reverse(): EaseCubicOut;
                clone(): EaseCubicOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseCubicOut>(): T;
            }
            export class EaseElasticIn  extends mCore.animation.easing.EasePeriod {
                reverse(): EaseElasticIn;
                clone(): EaseElasticIn;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseElasticIn>(): T;
            }
            export class EaseElasticInOut  extends mCore.animation.easing.EasePeriod {
                reverse(): EaseElasticInOut;
                clone(): EaseElasticInOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseElasticInOut>(): T;
            }
            export class EaseElasticOut  extends mCore.animation.easing.EasePeriod {
                reverse(): EaseElasticOut;
                clone(): EaseElasticOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseElasticOut>(): T;
            }
            export class EaseExponentialIn extends mCore.animation.easing.EaseBase {
                reverse(): EaseExponentialIn;
                clone(): EaseExponentialIn;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseExponentialIn>(): T;
            }
            export class EaseExponentialInOut extends mCore.animation.easing.EaseBase {
                reverse(): EaseExponentialInOut;
                clone(): EaseExponentialInOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseExponentialInOut>(): T;
            }
            export class EaseExponentialOut extends mCore.animation.easing.EaseBase {
                reverse(): EaseExponentialOut;
                clone(): EaseExponentialOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseExponentialOut>(): T;
            }
            // @ts-ignore
            export class EaseIn extends mCore.animation.easing.EaseRate {
                reverse(): EaseIn;
                clone(): EaseIn;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseIn>(rate?: number): T;
            }
            // @ts-ignore
            export class EaseInOut extends mCore.animation.easing.EaseRate {
                reverse(): EaseInOut;
                clone(): EaseInOut

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseInOut>(rate?: number): T;
            }
            // @ts-ignore
            export class EaseOut extends mCore.animation.easing.EaseRate {
                reverse(): EaseOut;
                clone(): EaseOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseOut>(rate?: number): T;
            }
            // @ts-ignore
            export class EasePeriod extends mCore.animation.easing.EaseBase {
                constructor(period?: number);

                public period: number;

                reverse(): EasePeriod;
                clone(): EasePeriod;

                protected calculateTime(time: number, period: number): number;
                protected easingPeriod(time: number);
                protected easingDefault(time: number): number;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EasePeriod>(period?: number): T;
            }

            // @ts-ignore
            export class EaseQuadraticIn extends mCore.animation.easing.EaseRate {
                reverse(): EaseQuadraticIn;
                clone(): EaseQuadraticIn;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseQuadraticIn>(): T;
            }
            // @ts-ignore
            export class EaseQuadraticInOut extends mCore.animation.easing.EaseRate {
                reverse(): EaseQuadraticInOut;
                clone(): EaseQuadraticInOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseQuadraticInOut>(): T;
            }
            // @ts-ignore
            export class EaseQuadraticOut extends mCore.animation.easing.EaseRate {
                reverse(): EaseQuadraticOut;
                clone(): EaseQuadraticOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseQuadraticOut>(): T;
            }
            // @ts-ignore
            export class EaseQuarticIn extends mCore.animation.easing.EaseRate {
                reverse(): EaseQuarticIn;
                clone(): EaseQuarticIn;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseQuarticIn>(): T;
            }
            // @ts-ignore
            export class EaseQuarticInOut extends mCore.animation.easing.EaseRate {
                reverse(): EaseQuarticInOut;
                clone(): EaseQuarticInOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseQuarticInOut>(): T;
            }
            // @ts-ignore
            export class EaseQuarticOut extends mCore.animation.easing.EaseRate {
                reverse(): EaseQuarticOut;
                clone(): EaseQuarticOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseQuarticOut>(): T;
            }
            // @ts-ignore
            export class EaseQuinticIn extends mCore.animation.easing.EaseRate {
                reverse(): EaseQuinticIn;
                clone(): EaseQuinticIn;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseQuinticIn>(): T;
            }
            // @ts-ignore
            export class EaseQuinticInOut extends mCore.animation.easing.EaseRate {
                reverse(): EaseQuinticInOut;
                clone(): EaseQuinticInOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseQuinticInOut>(): T;
            }
            // @ts-ignore
            export class EaseQuinticOut extends mCore.animation.easing.EaseRate {
                reverse(): EaseQuinticOut;
                clone(): EaseQuinticOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseQuinticOut>(): T;
            }
            // @ts-ignore
            export class EaseRate extends mCore.animation.easing.EaseBase {
                constructor(rate?: number);
                public rate;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseRate>(rate?: number): T;
            }
            // @ts-ignore
            export class EaseSineIn extends mCore.animation.easing.EaseRate {
                reverse(): EaseSineIn;
                clone(): EaseSineIn;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseSineIn>(): T;
            }
            // @ts-ignore
            export class EaseSineInOut extends mCore.animation.easing.EaseRate {
                reverse(): EaseSineInOut;
                clone(): EaseSineInOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseSineInOut>(): T;
            }
            // @ts-ignore
            export class EaseSineOut extends mCore.animation.easing.EaseRate {
                reverse(): EaseSineOut;
                clone(): EaseSineOut;

                // noinspection JSAnnotator
                static create<T extends mCore.animation.easing.EaseSineOut>(): T;
            }
        }

        export namespace timeLine {
            export class ActionTimeLine extends mCore.animation.timeLine.BaseTimeLine{
                constructor(target: mCore.view.ComponentContainer, name);

                public inherit: boolean;
                public isResetParameters: boolean;
                public readonly isDone: boolean;

                public clone(): mCore.animation.timeLine.ActionTimeLine;
                public addNestedChild(child: mCore.view.ComponentContainer | mCore.view.ComponentSprite): void;
                public removeNestedChild(child: mCore.view.ComponentContainer | mCore.view.ComponentSprite): void;

                public refreshStartParameters(): void;
                public addAnimation(name: string, animation: mCore.animation.ActionAnimation): boolean;
                public removeAnimation(name: string): boolean;
                public removeAllAnimations(): void;

                public runAction(action: mCore.animation.action.Action, loop?: boolean): void;
                public resetParameters(): void;
            }

            export class BaseTimeLine extends mCore.memory.ReusableObject{
                constructor(target: mCore.view.ComponentContainer, name);

                name: string;
                fps: number;
                loop: boolean;
                type: mCore.enumerator.animation.TIME_LINE_TYPE;
                protected readonly fpsCoef;
                protected runningName;
                protected target: mCore.view.ComponentContainer;
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
                setEvent(eventId: mCore.enumerator.animation.TIME_LINE_EVENT, event: string | null);

                protected runAnimation(name: string): void;
                protected playAnimation(): void;
                protected clearRunningAnimation(): boolean;
                protected dispatchEvent(eventId: mCore.enumerator.animation.TIME_LINE_EVENT): void;
            }

            export class SpineTimeLine extends mCore.animation.timeLine.BaseTimeLine{
                constructor(target: mCore.view.ComponentContainer, name);
            }
        }

        export class ActionAnimation extends mCore.memory.ReusableObject {
            constructor(action: mCore.animation.action.ActionInterval);

            positionOffset: mCore.geometry.Point;
            scaleOffset: mCore.geometry.Point;
            skewOffset: mCore.geometry.Point;
            rotationOffset: number;
            tint: number;
            alpha: number;
            visible: boolean | null;
            readonly isDone: boolean;
            readonly duration: number;

            play(target: mCore.view.ComponentContainer): void;
            stop(): void;
            update(dt: number): void;
            clone(): mCore.animation.ActionAnimation;
        }
    }

    export namespace boot {
        export const OS_VERSION: string;
        export const OS: mCore.enumerator.system.OS;
        export const BROWSER: mCore.enumerator.system.BROWSER;
        export const BROWSER_VERSION: number;
        export const CLIENT: mCore.enumerator.system.CLIENT;
        export const COOKIES_ENABLED: boolean;
        export const PLATFORM: mCore.enumerator.system.PLATFORM;
        export const MOUSE_ENABLED: boolean;
        export const MOUSE_WHEEL_ENABLED: boolean;
        export const KEYBOARD_ENABLED: boolean;
        export const TOUCHES_ENABLED: boolean;
        export const ACCELEROMETER_ENABLED: boolean;
        export const TYPED_ARRAY_SUPPORTED: boolean;
        export const SUPPORTED_FORMATS: mCore.enumerator.TEXTURE_FORMAT[];
        export const RESOLUTION: mCore.enumerator.RESOLUTION;

        export function init(callback: Function, parentContainer: HTMLDivElement);
        export function isMobile(): boolean;
        export function isDesktop(): boolean;
        export function dump(): void;
    }

    export namespace builder {
        export namespace layoutBuilder {
            export function infiniteLayout(component: mCore.component.ui.ComLayout): void;
        }
    }

    export namespace bundle {
        export namespace ancillary {
            export class TextureAtlas {
                constructor(baseTexture: mCore.BaseTexture, atlas: mCore.type.AtlasInfo, bundle: mCore.type.AssetBundle);
            }
        }
        export namespace bundle {
            export class AssetBundle extends mCore.bundle.bundle.BaseBundle {
                constructor (data: mCore.type.AssetBundle);


                readonly linkedTextures: mCore.bundle.bundle.LinkedTexture[];

                generateTextureAtlas(baseTexture: mCore.BaseTexture, atlas: mCore.type.AtlasInfo): void;
                atlasLoadComplete(): void;

            }
            export class BaseBundle extends mCore.memory.ReusableObject{
                constructor();
            }

            export interface LinkedTexture {
                link: string;
                name: string;
                isLoaded: boolean;
                atlas: mCore.type.AtlasInfo;
            }
        }
        export namespace middleware {
            export function bundleParser(resource: mCore.loader.LoaderResource, next: Function): void;
        }
    }

    export namespace cache {
        export namespace atlasCache{
            export function add(name: string, baseTexture: mCore.BaseTexture, atlas: mCore.type.AtlasInfo, bundle: mCore.type.AssetBundle): void;
            export function remove(fontName: string): boolean;
        }
        export namespace bundleCache {
            export function addAssetBundle(data: mCore.type.AssetBundle): mCore.bundle.bundle.AssetBundle | null;
            export function getAssetBundle(name: string): mCore.bundle.bundle.AssetBundle | null;
            export function removeAssetBundle(name: string): boolean;
        }
        export namespace fontCache{
            export function add(font: mCore.type.FontData, fontName: string, baseTexture: mCore.BaseTexture, resolution: number): void;
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
            export function getParticle(name: string): mCore.cache.particleCache.ParticleInfo | null;
            export interface ParticleInfo {
                name: string;
                type: mCore.enumerator.PARTICLE_TYPE;
                source: string;
            }
        }

        export namespace spineCache {
            export const names: string[];
            export function add(name: string, data: Object): void;
            export function remove(name: string): boolean;
            export function getSkeleton(name: string): any;
        }
    }

    export namespace component {
        namespace callback {
            export type IterateChildren = (child: mCore.view.ComponentContainer | mCore.view.ComponentSprite, index?: number, realIndex?: number)=>void;

        }

        export namespace sceneTransition {
            export class ComSceneTransition extends mCore.component.Component {
            }
        }

        export namespace ui {
            export class ComChildListener extends mCore.component.ComChildIterator {
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
                static create(): mCore.component.ui.ComChildListener;
                clone(): mCore.component.ui.ComChildListener;
            }

            export class ComLayout extends mCore.component.ComChildIterator {
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
                innerPadding: mCore.geometry.Point;
                outerPadding: mCore.geometry.Point;
                verticalAlign: mCore.enumerator.ui.VERTICAL_ALIGN;
                horizontalAlign: mCore.enumerator.ui.HORIZONTAL_ALIGN;

                // noinspection JSAnnotator
                static create(): mCore.component.ui.ComLayout;
                refresh(): void;
                clone(): mCore.component.ui.ComLayout;
            }

            // @ts-ignore
            export class ComItem extends mCore.component.ui.ComUI {
                constructor(name?: string);

                index: number;
                // noinspection JSAnnotator
                static create<T extends mCore.component.ui.ComItem>(): T;
                updateData(data: any): void;
                clone(): mCore.component.ui.ComItem;
            }

            // @ts-ignore
            class ComItemBox extends mCore.component.Component {
                constructor(templateComponent: mCore.component.ui.ComItem, templateName: string, numCount?:number , startIndex?: number);
                readonly startIndex: number;
                readonly templateName: string;
                readonly templateNumCount: number;
                readonly componentTemplate: mCore.component.ui.ComItem;
                readonly length: number;

                // noinspection JSAnnotator
                static create(templateComponent: mCore.component.ui.ComItem, templateName: string, numCount?:number , startIndex?: number): mCore.component.ui.ComItemBox;
                iterateItems(callback: Function, beginIndex?: number, endIndex?: number): void;
                updateData(data: any[]): void;
                getElement<T extends mCore.component.ui.ComItem>(index: number): T | null;
                updateElementData(index: number, data: any): boolean;
                addItem<T extends mCore.view.ComponentContainer>(child: T): void;
                clone(): mCore.component.ui.ComItemBox;
            }

            // @ts-ignore
            export class ComScroller extends mCore.component.Component {
                constructor();

                scrollDirection: mCore.enumerator.ui.SCROLL_DIRECTION;
                innerBoundary: mCore.geometry.Point;
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
                updateDragStart(position: mCore.geometry.Point): void;
                updateDragMove(position: mCore.geometry.Point): void;
                updateDragFinish(position: mCore.geometry.Point): void;
                isVertical(): boolean;
                isHorizontal(): boolean;
                updateScrollDimension(progress: number, direction: mCore.enumerator.ui.SCROLL_DIRECTION): void;
                // noinspection JSAnnotator
                static create(): mCore.component.ui.ComScroller;
            }

            // @ts-ignore
            export class ComUI extends mCore.component.Component {
                constructor(name?: string);

                listenInteractions: boolean;

                // noinspection JSAnnotator
                static create <T extends mCore.component.ui.ComUI>(name?: string): T;
                emitInteractiveEvent(eventType: mCore.enumerator.ui.INTERACTIVE_EVENT, event: mCore.eventDispatcher.EventModel): void;
                logHierarchy(widget?: mCore.view.ComponentContainer | mCore.view.ComponentSprite, maxLevel?: number): void;
                logUnlocalizedFields(widget?: mCore.view.ComponentContainer | mCore.view.ComponentSprite): void;
                setChildText<T extends mCore.view.ComponentContainer>(text: any, path: string, widget?: T): boolean;
                localize<T extends mCore.view.ComponentContainer>(key: string, path: string, widget?: T): boolean;
                getChildView<T extends mCore.view.ComponentContainer>(path: string, widget?: T): T | null;
                addComponentToChild<P extends mCore.view.ComponentContainer, T extends mCore.component.Component>(component: T, path?: string, widget?: P): T;
                addChildListener<T extends mCore.view.ComponentContainer>(listener: mCore.eventDispatcher.InteractiveCallback, eventType: mCore.enumerator.ui.INTERACTIVE_EVENT, path: string, widget?: T): boolean;
                removeChildListener<T extends mCore.view.ComponentContainer>(eventType: mCore.enumerator.ui.INTERACTIVE_EVENT, path: string,  widget?: T): boolean;
                removeAllChildListeners() : void;
                clone(): mCore.component.ui.ComUI;
            }


            // @ts-ignore
            export class ComUIElement extends mCore.component.ui.ComUI {
                constructor(elementName: string, bundleName?: string, owner?: mCore.view.ComponentContainer);
                // noinspection JSAnnotator
                static create(elementName: string, bundleName?: string, owner?: mCore.view.ComponentContainer): mCore.component.ui.ComUIElement;
                clone(): mCore.component.ui.ComUIElement;
            }

            export class ComUILayout extends mCore.component.Component {
                constructor();

                percentSize: mCore.geometry.Point;
                isPercentSize: boolean;
                isPercentPosX: boolean;
                percentPosX: number;
                isPercentPosY: boolean;
                percentPosY: number;
                horizontalEdge: mCore.enumerator.ui.HORIZONTAL_ALIGN;
                verticalEdge: mCore.enumerator.ui.VERTICAL_ALIGN;
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

        // @ts-ignore
        export class ComChildIterator extends mCore.component.Component {
            constructor(name?: string);

            childCount: number;

            // noinspection JSAnnotator
            static create(name?: string): mCore.component.ComChildIterator;
            hasChildren(): void;
            iterateChildren(callback: mCore.component.callback.IterateChildren): void;
            clone(): mCore.component.ComChildIterator;
        }

        // @ts-ignore
        export class Component extends mCore.memory.ReusableObject {
            constructor(name?: string);

            reusable: boolean;
            blockEvents: boolean;
            inPool: boolean;
            name: string;
            owner: mCore.view.ComponentContainer | null;
            active: boolean;
            listenChildren: boolean;
            listenVisible: boolean;
            readonly hasListenerManager: boolean;
            readonly listenerManager: mCore.manager.ListenerManager;

            // noinspection JSAnnotator
            static create<T extends mCore.component.Component>(name?: string): T;
            hasOwner(): boolean;
            onAdd(owner: mCore.view.ComponentContainer): void;
            onRemove(): void;
            onUpdate(dt: number): void;
            onAddChild(child: mCore.view.ComponentContainer): void;
            onRemoveChild(child: mCore.view.ComponentContainer): void;
            onVisibleChange(visible: boolean): void;
            clone(): mCore.component.Component;
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

        export enum MOUSE_BUTTON {
            NONE = -1,
            LEFT = 0,
            RIGHT = 2,
            WHEEL = 4
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
                RESIZE = "SYSTEM.RESIZE",
                WHEEL = "SYSTEM.WHEEL"
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
        export function addListener(type: string, listener: mCore.eventDispatcher.InteractiveCallback, target: Object): void;
        export function hasListener(type: string, target: Object): boolean;
        export function removeListener(type: string, target: Object): boolean;
        export function dispatch(type: string, targetOrEvent?: Object, data?: Object): void;

        type InteractiveCallback = (event: mCore.eventDispatcher.EventModel) => void;

        export class EventModel extends mCore.model.Model {
            constructor(target: Object, data: any);

            data: any;
            target: Object;
        }

        export class ListenerModel extends mCore.model.Model {
            constructor(event: string, listener: mCore.eventDispatcher.InteractiveCallback, target: Object);

            event: string;
            target: Object;

            dispatch(data?: Object): void;
        }
    }

    export namespace geometry {

        // @ts-ignore
        export class Point implements mCore.memory.ReusableObject {
            constructor(x?: number, y?: number, type?: mCore.enumerator.NUMBER_TYPE);

            public x: number;
            public y: number;
            public type: mCore.enumerator.NUMBER_TYPE;

            public copyFrom(p: mCore.geometry.Point): void;
            public copyTo(p: mCore.geometry.Point): void;
            public equals (p: mCore.geometry.Point): boolean;
            public set(x: number, y?: number): void;
            public initChangeCallback(callback: Function, context: Object): void;
            public clearChangeCallback(): void;
            public clone(): mCore.geometry.Point;
            // noinspection JSAnnotator
            public static create<T extends mCore.geometry.Point>(x?: number, y?: number, type?: mCore.enumerator.NUMBER_TYPE): T;
        }

        // @ts-ignore
        export class Rectangle extends mCore.geometry.Point implements mCore.memory.ReusableObject {
            constructor(x?: number, y?: number, width?: number, height?: number, type?: mCore.enumerator.NUMBER_TYPE);

            public static EMPTY: mCore.geometry.Rectangle;
            public x: number;
            public y: number;
            public width: number;
            public height: number;
            public readonly left: number;
            public readonly right: number;
            public readonly top: number;
            public readonly bottom: number;

            public clone(): mCore.geometry.Rectangle;
            public copyFrom(rectangle: mCore.geometry.Rectangle): mCore.geometry.Rectangle;
            public copyTo(rectangle: mCore.geometry.Rectangle): mCore.geometry.Rectangle;
            public contains(x: number, y: number): boolean;
            public pad(paddingX: number, paddingY: number): void;
            public fit(rectangle: mCore.geometry.Rectangle): void;
            public ceil(resolution?: number, eps?: number): void;
            public enlarge(rectangle: mCore.geometry.Rectangle): void;

            // noinspection JSAnnotator
            public static create<T extends mCore.geometry.Rectangle>(x?: number, y?: number, width?: number, height?: number, type?: mCore.enumerator.NUMBER_TYPE): T;
        }
    }

    export namespace launcher {
        export const app: any;
        export let orientation: mCore.enumerator.system.ORIENTATION;
        export const designResolution: mCore.geometry.Point;
        export const appResolution: mCore.geometry.Point;
        export const canvasResolution: mCore.geometry.Point;
        export const currentScene: mCore.view.Scene;

        export function initApp(config?: mCore.launcher.AppConfig, designWidth?: number, designHeight?: number, onComplete?: Function, parentContainer?: HTMLElement): void;
        export function runScene(scene: mCore.view.Scene): void;
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
            type: mCore.enumerator.ASSET_TYPE | null;
            resolution: mCore.enumerator.FILE_TYPE | string | null;
            useAssetDir: boolean;
        }

        export const assetForLoad: mCore.loader.AssetInfo[];
        export const assetLoaded: mCore.loader.AssetInfo[];
        export const isLoading: boolean;

        export function addAsset(name: string, type: mCore.enumerator.ASSET_TYPE, path?: string, resolution?: mCore.enumerator.FILE_TYPE | string, useAssetDir?: boolean): void;
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
        export let MOUSE_WHEEL_ENABLED: boolean;
        export let BLOCK_BROWSER_HOT_KEYS: boolean;
        export let MODE: mCore.enumerator.ENGINE_MODE;
        export let DEFAULT_POOL_SIZE: number;
        export let OUTLINE_SAMPLES: number;
        export let ASSET_DIR: string;
        export let SPINE_SCALE: number;
    }

    export namespace manager {

        export class AnimationManager extends mCore.manager.BaseManager {
            constructor(owner: mCore.view.ComponentContainer | mCore.view.ComponentSprite);

            eventStart: string;
            eventEnd: string;
            eventPause: string;
            eventResume: string;
            eventStop: string;
            eventComplete: string;
            readonly animations: { [key:string]:string; };

            public addAnimation(name: string, animation: mCore.animation.action.ActionInterval, timeLine?: string | mCore.enumerator.animation.TIME_LINE): boolean;
            public removeAnimation(name: string, timeLine?: string | mCore.enumerator.animation.TIME_LINE): boolean;
            public removeAllAnimations(timeLine?: string | mCore.enumerator.animation.TIME_LINE): void;
            public runAction(action: mCore.animation.action.ActionInterval, loop?: boolean, frame?: number, timeLine?: string | mCore.enumerator.animation.TIME_LINE): void;
            public play(name: string, loop?: boolean, frame?: number, timeLine?: string | mCore.enumerator.animation.TIME_LINE): boolean;
            public stop(name: string, timeLine?: string | mCore.enumerator.animation.TIME_LINE): boolean;
            public stopAll(): void;
            public pause(name: string, timeLine?: string | mCore.enumerator.animation.TIME_LINE): boolean;
            public resume(name: string, timeLine?: string | mCore.enumerator.animation.TIME_LINE): boolean;

            public refreshTimeLines(): void;
            public addTimeLine(name: string | mCore.enumerator.animation.TIME_LINE, timeLine?: mCore.animation.timeLine.BaseTimeLine): boolean;
            public getTimeLine(name: string | mCore.enumerator.animation.TIME_LINE): mCore.animation.timeLine.BaseTimeLine | null;
            public pauseTimeLine(name: string | mCore.enumerator.animation.TIME_LINE): boolean;
            public resumeTimeLine(name: string | mCore.enumerator.animation.TIME_LINE): boolean;
            public removeTimeLine(name: string | mCore.enumerator.animation.TIME_LINE): boolean;
            public stopTimeLine(name: string | mCore.enumerator.animation.TIME_LINE): boolean;
            public removeAllTimeLines(): void;

            public setEvent(eventId: mCore.enumerator.animation.TIME_LINE_EVENT | number, event: string, timeLineName?: string | mCore.enumerator.animation.TIME_LINE): boolean;
            public clearEvent(eventId: mCore.enumerator.animation.TIME_LINE_EVENT | number, timeLineName?: string | mCore.enumerator.animation.TIME_LINE): boolean;
            public resetParameters(): void;
        }

        export class BaseManager extends mCore.memory.ReusableObject {
            constructor(owner: mCore.view.ComponentContainer | mCore.view.ComponentSprite | mCore.memory.ReusableObject);

            active: boolean;
            protected owner: mCore.view.ComponentContainer | mCore.view.ComponentSprite | mCore.memory.ReusableObject;

            update(dt: number): void;
        }
        export class ComponentManager extends mCore.manager.BaseManager {
            constructor(owner: mCore.view.ComponentContainer | mCore.view.ComponentSprite);

            iterateUIComponents(callback: mCore.view.callback.IterateComponent);
            addChildrenAction(children: mCore.view.ComponentContainer[]): void;
            removeChildrenAction(children: mCore.view.ComponentContainer[]): void;
            visibleAction(visible: boolean): void;
            addComponent(component: mCore.component.Component): boolean;
            addComponents(components: any[]): void;
            hasComponent(name: string): boolean;
            getComponent(name: string): mCore.component.Component | null;
            removeComponent(name: string): boolean;
            removeAllComponents(): void;
        }

        export class InteractionManager extends mCore.manager.BaseManager {
            constructor(owner: mCore.component.Component);

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

            public emitInteractiveEvent(eventType: mCore.enumerator.ui.INTERACTIVE_EVENT, event?: any): void;
            public getInteractiveEvent(id: mCore.enumerator.ui.INTERACTIVE_EVENT): string;
            public updateInteractiveEvent(id: mCore.enumerator.ui.INTERACTIVE_EVENT, name?: string): void;
        }

        export class LayoutSizeManager extends mCore.manager.BaseManager {
            constructor(owner: mCore.component.Component);

            staticWidth: boolean;
            staticHeight: boolean;
            minWidth: number;
            maxWidth: number;
            minHeight: number;
            maxHeight: number;
            contentWidth: number;
            contentHeight: number;
        }

        export class ListenerManager extends mCore.manager.BaseManager {
            constructor(owner: mCore.view.ComponentContainer | mCore.view.ComponentSprite | mCore.memory.ReusableObject);

            blockEvents: boolean;

            isListenEvent(event: string): boolean;

            addEventListener(event: string, handler: mCore.eventDispatcher.InteractiveCallback): boolean;
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
            static create<T extends mCore.memory.ReusableObject>(...var_args: any[]): T;

            protected clearData(): void;

        }
    }

    export namespace model {
        export class Model extends mCore.memory.ReusableObject {
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
            frames: mCore.type.AnimationFrame[];
        }

        export interface AnimationFrame {
            type: mCore.enumerator.animation.ACTION_TYPE;
            index: number;
            data: number[] | null;
            ease: number[] | null;
        }

        export interface AssetBundle {
            anchors: number[];
            animationNames: string[];
            bundleType: mCore.enumerator.BUNDLE_TYPE;
            atlases: mCore.type.AtlasInfo[];
            atlasFonts: mCore.type.AtlasFont[];
            colors: number[];
            componentNames: string[];
            elementNames: string[];
            fontData: mCore.type.FontData[];
            fonts: string[];
            fontStyles: mCore.type.FontStyle[];
            name: string;
            particleDat: Object[],
            particleNames: string[],
            skeletonNames: string[];
            skeletons: Object[];
            texts: string[];
            textures: number[];
            textureParts: string[];
            textFieldStyles: mCore.type.TextFieldStyle[];
            ui: mCore.type.ElementData[];
        }

        export interface AtlasInfo {
            frames: mCore.type.AtlasFrame[];
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
            chars: mCore.type.CharData[];
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
            animations: mCore.type.AnimationData[] | null;
            children: mCore.type.ElementData[];
            clipped: boolean;
            content: mCore.type.ElementData;
            dimensions: number[];
            edge: mCore.enumerator.ui.VERTICAL_ALIGN[] | mCore.enumerator.ui.HORIZONTAL_ALIGN[] | null;
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
            type: mCore.enumerator.ui.UI_ELEMENT;
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
            export class BaseButton extends mCore.ui.Widget {
                constructor(frame: string, state: number);

                enabled: boolean;
                title: mCore.ui.ancillary.BaseLabel;
                titleText: string;

                hasTitle(): boolean;
                changeState(state: number): void;
                changeStateWithFallback(state: number, fallback: number, isEnabled?: boolean): void;
                protected changeEnabledState(state: number): void;
                protected onEnabledChange(enabled: boolean): void;


            }

            export class BaseLabel extends mCore.ui.Widget {
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
                horizontalAlign: mCore.enumerator.ui.HORIZONTAL_ALIGN;
                verticalAlign: mCore.enumerator.ui.VERTICAL_ALIGN;
                lineHeight: number;
                localized: boolean;
                autoSize: boolean;
                letterSpacing: number;

                getShadowOffset(): mCore.geometry.Point;
                setShadowOffset(xOrPoint: number | mCore.geometry.Point, y?: number): void;
                protected horizontalAlignChange(value: mCore.enumerator.ui.HORIZONTAL_ALIGN): void;
                protected verticalAlignChange(value: mCore.enumerator.ui.VERTICAL_ALIGN): void;

            }

            export class OutlineBitmapText extends mCore.view.ComponentContainer {
                constructor(fontName: string, size: number);
                anchor: mCore.geometry.Point;
                maxWidth: number;
                fontName: string;
                fontSize: number;
                outlineEnabled: boolean;
                outlineSize: number;
                color: number;
                outlineColor: number;
                horizontalAlign: mCore.enumerator.ui.HORIZONTAL_ALIGN;
                verticalAlign: mCore.enumerator.ui.VERTICAL_ALIGN;
                lineHeight: number;
                text: string;
                parentTint: number;
                letterSpacing: number;

                updateText(): void;
                updateColorByLetter(beginIndex: number, count: number, color: number): void;
                clearLetterColors(): void;
                clone(): mCore.ui.ancillary.OutlineBitmapText;

            }

            class StateSlice9Sprite extends mCore.view.Slice9Sprite {
                constructor(frameName: string, state: number | string, leftSlice?: number, rightSlice?: number, topSlice?: number, bottomSlice?: number);
                state: number | string;

                addState(frameName: string, state: string | number): void;
                hasState(state: number | string): boolean;
                getFrameByState(state: number | string): string | null;
                setFrameByState(frame: string | null, state: string | number): void;
            }
        }

        export namespace parser {
            export function parseElement(name: string, link: string): mCore.ui.Widget;
        }

        // @ts-ignore
        export class AtlasLabel extends mCore.ui.ancillary.BaseLabel {
            constructor(frame: string, letterWidth: number, letterHeight: number, dotWidth: number);
            // noinspection JSAnnotator
            static create(frame: string, letterWidth: number, letterHeight: number, dotWidth: number): mCore.ui.AtlasLabel;
        }

        // @ts-ignore
        export class Button extends mCore.ui.ancillary.BaseButton {
            constructor(upFrame: string, downFrame?: string, overFrame?: string, disabledFrame?: string);

            upFrame: string | null;
            downFrame: string | null;
            overFrame: string | null;
            disabledFrame: string | null;

            // noinspection JSAnnotator
            static create(upFrame: string, downFrame?: string, overFrame?: string, disabledFrame?: string): mCore.ui.Button;
            protected onActionUpHandler(event: Object): boolean;
            protected onActionDownHandler(event: Object): boolean;
            protected onActionOverHandler(event: Object): void;
            protected onActionOutHandler(event: Object): void;
            protected onActionUpOutsideHandler(event: Object): boolean;
            protected onEnabledChange(enabled: boolean): void;

        }

        // @ts-ignore
        export class CheckBox extends mCore.ui.ancillary.BaseButton {
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
            ): mCore.ui.CheckBox;
            icon: mCore.ui.ancillary.StateSlice9Sprite;
            selected: boolean;

            protected onActionClickHandler(event: Object): void;
        }

        // @ts-ignore
        export class ParticleEmitter extends mCore.view.ComponentContainer {
            constructor(particleName:string, containerType?: mCore.enumerator.ui.CONTAINER_TYPE);

            public readonly canEmit: boolean;
            public readonly particleType: mCore.enumerator.PARTICLE_TYPE;
            public readonly particleName: string;
            public readonly containerType: mCore.enumerator.ui.CONTAINER_TYPE;

            public eventStart: string;
            public eventComplete: string;
            public eventExhausted: string;

            public emitParticle(scale?: number, paused?: boolean, delay?: number);
            public resume();
            public pause();
            public stop(killImmediately?: boolean);

            // noinspection JSAnnotator
            static create(particleName:string, containerType?: mCore.enumerator.ui.CONTAINER_TYPE): mCore.ui.ParticleEmitter;
        }

        export class ImageView extends mCore.view.Slice9Sprite{
            constructor(frameName: string);

            reusable: boolean;
            blockEvents: boolean;
            inPool: boolean;
            uiType: mCore.enumerator.ui.UI_ELEMENT;
            isUpdate: boolean;
            tint: number;
            parentTint: number;
            protected  readonly realTint: number;
            readonly isDestroyed: boolean;
            readonly animationManager: mCore.manager.AnimationManager;
            readonly componentManager: mCore.manager.ComponentManager;
            readonly listenerManager: mCore.manager.ListenerManager;
            readonly interactionManager: mCore.manager.InteractionManager;
            readonly hasAnimationManager: boolean;
            readonly hasComponentManager: boolean;
            readonly hasListenerManager: boolean;
            readonly hasInteractionManager: boolean;

            static create<T extends mCore.view.ComponentContainer>(...var_args: any[]): T;
            public reuse(...var_args: any[]): void;
            public disuse(): void;
            public kill(): void;
            public destroy(): void;
            public emitInteractiveEvent(eventType: mCore.enumerator.ui.INTERACTIVE_EVENT, event: mCore.eventDispatcher.EventModel): void;
            public doLayout(): void;

            protected updateChildTint<T extends mCore.view.ComponentContainer>(child: T): void;
            protected onUpdate(dt: number): void;
            // noinspection JSAnnotator
            static create(frameName: string): mCore.ui.ImageView;
        }

        // @ts-ignore
        export class Label extends mCore.ui.ancillary.BaseLabel {
            constructor(fontName: string, size: number);
            public realFontSize: number;
            public locale: string | null;
            // noinspection JSAnnotator
            static create(fontName: string, size: number): mCore.ui.Label;
            updateColorByLetter(beginIndex: number, count: number, color: number): void;
            clearLetterColors(): void;
        }

        export class ListView extends mCore.ui.ScrollView{
            constructor(graphicType?: mCore.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number);

            layout: mCore.component.ui.ComLayout;

            verticalAlign: mCore.enumerator.ui.VERTICAL_ALIGN;
            horizontalAlign: mCore.enumerator.ui.HORIZONTAL_ALIGN;

            eventItemUp: string | null;
            eventItemDown: string | null;
            eventItemOver: string | null;
            eventItemOut: string | null;
            eventItemMove: string | null;
            eventItemDrag: string | null;
            eventItemClick: string | null;
            eventItemDragFinish: string | null;
            eventItemDragStart: string | null;

            slider: mCore.ui.Slider;

            innerPadding: mCore.geometry.Point;
            outerPadding: mCore.geometry.Point;

            // noinspection JSAnnotator
            static create(graphicType?: mCore.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number): mCore.ui.ListView;
            scrollToItem(time: number, index: number): void;
        }

        // @ts-ignore
        export class ProgressBar extends Widget {
            constructor(frameLink: string, direction?: mCore.enumerator.DIRECTION, type?: mCore.enumerator.ui.PROGRESS_TYPE);
            direction: mCore.enumerator.DIRECTION;
            progress: number;
            type: mCore.enumerator.ui.PROGRESS_TYPE;
            frameName: string;

            // noinspection JSAnnotator
            static create(frameLink: string, direction?: mCore.enumerator.DIRECTION, type?: mCore.enumerator.ui.PROGRESS_TYPE): mCore.ui.ProgressBar;
        }

        // @ts-ignore
        export class Panel extends mCore.ui.Widget{
            constructor(graphicType?: mCore.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number);

            backgroundColor: number;
            backgroundAlpha: number;
            readonly panelType: mCore.enumerator.ui.PANEL_GRAPHIC_TYPE;
            setType(graphicType?: mCore.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number): void;

            // noinspection JSAnnotator
            static create(graphicType?: mCore.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number): mCore.ui.Panel;
        }

        // @ts-ignore
        export class ScrollView extends mCore.ui.Widget {
            constructor(graphicType?: mCore.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number);

            scrollDirection: mCore.enumerator.ui.SCROLL_DIRECTION;
            horizontalSlider: mCore.ui.Slider;
            verticalSlider: mCore.ui.Slider;
            innerContainer: mCore.ui.Widget;
            innerWidth: number;
            innerHeight: number;
            bounceEnabled: boolean;

            // noinspection JSAnnotator
            static create(graphicType?: mCore.enumerator.ui.PANEL_GRAPHIC_TYPE, data?: string | number): mCore.ui.ScrollView;

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
            protected onDragStartInnerContainerHandler(event: mCore.eventDispatcher.EventModel): void;
            protected onDragInnerContainerHandler(event: mCore.eventDispatcher.EventModel): void;
            protected onScrollHorizontalHandler(event: mCore.eventDispatcher.EventModel): void;
            protected onScrollVerticalHandler(event: mCore.eventDispatcher.EventModel): void;
        }

        // @ts-ignore
        export class Slider extends mCore.ui.Widget {
            constructor(ball: mCore.ui.Widget, direction?: mCore.enumerator.DIRECTION, progressFrame?: string);

            eventScroll: string;
            progressFrameName: string | null;
            progressBar: mCore.ui.ProgressBar | null;
            direction: mCore.enumerator.DIRECTION;
            progress: number;
            enabled: boolean;

            // noinspection JSAnnotator
            static create(ball: mCore.ui.Widget, direction?: mCore.enumerator.DIRECTION, progressFrame?: string): mCore.ui.Slider;
            hasProgressBar(): boolean;
        }

        export class TextField extends mCore.ui.Label {
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
            static create(fontName: string, size: number): mCore.ui.TextField;
            protected onActionUpHandler(event: Object): boolean;
        }

        // @ts-ignore
        export class ToggleButton extends mCore.ui.ancillary.BaseButton{
            constructor(dUpFrame: string, sUpFrame: string, sDownFrame?: string, dDownFrame?: string, dOverFrame?: string, sOverFrame?: string, dDisabledFrame?: string, sDisabledFrame?: string);
            selected: boolean;

            // noinspection JSAnnotator
            static create(dUpFrame: string, sUpFrame: string, sDownFrame?: string, dDownFrame?: string, dOverFrame?: string, sOverFrame?: string, dDisabledFrame?: string, sDisabledFrame?: string): mCore.ui.ToggleButton;
            protected onEnabledChange(enabled: boolean): void;

        }

        // @ts-ignore
        export class Widget extends mCore.view.ComponentContainer {
            constructor(collider?: mCore.view.ComponentSprite | mCore.view.Slice9Sprite);

            clipping: boolean;
            clippingType: mCore.enumerator.ui.CLIPPING_TYPE;
            tint: number;
            anchor: mCore.geometry.Point;
            flipX: boolean;
            flipY: boolean;

            // noinspection JSAnnotator
            static create(collider?: mCore.view.ComponentSprite | mCore.view.Slice9Sprite): mCore.ui.Widget;
            public setSlice(leftSlice?: number, rightSlice?: number, topSlice?: number, bottomSlice?: number): void;

            protected collider: mCore.view.ComponentSprite | mCore.view.Slice9Sprite | mCore.ui.ancillary.StateSlice9Sprite;
        }
    }


    export namespace util {
        export namespace asset {
            export function getSpriteFrame(link: string): Texture | null;
            export function createWhiteSprite(): mCore.view.ComponentSprite;
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
            export function addFileType(value: string, type: mCore.enumerator.FILE_TYPE): string;
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
            export function pFromSize(size: mCore.view.ComponentContainer | mCore.geometry.Rectangle, inPoint?: mCore.geometry.Point): mCore.geometry.Point;
            export function pHalfSize(size: mCore.view.ComponentContainer | mCore.geometry.Rectangle, inPoint?: mCore.geometry.Point): mCore.geometry.Point;
            export function sSub(size1: mCore.view.ComponentContainer | mCore.geometry.Rectangle, size2: mCore.view.ComponentContainer | mCore.geometry.Rectangle, inPoint?: mCore.geometry.Point): mCore.geometry.Point;
            export function pSub(p1: mCore.geometry.Point, p2: mCore.geometry.Point, isIn?: boolean, isClear?: boolean): mCore.geometry.Point;
            export function pAdd(p1: mCore.geometry.Point, p2: mCore.geometry.Point, isIn?: boolean, isClear?: boolean): mCore.geometry.Point;
            export function pFixed(p: mCore.geometry.Point, numCount?: number, isin?: boolean);
            export function pMult(p: mCore.geometry.Point, multiplier: number, isIn?: boolean): mCore.geometry.Point;
            export function pCompMult(p1: mCore.geometry.Point, p2: mCore.geometry.Point, isIn?: boolean, isClear?: boolean): mCore.geometry.Point;
            export function pCompDiv(p1: mCore.geometry.Point, p2: mCore.geometry.Point, isIn?: boolean, isClear?: boolean): mCore.geometry.Point;
            export function pMax(p1: mCore.geometry.Point, p2: mCore.geometry.Point, isIn?: boolean, isClear?: boolean): mCore.geometry.Point;
            export function pMin(p1: mCore.geometry.Point, p2: mCore.geometry.Point, isIn?: boolean, isClear?: boolean): mCore.geometry.Point;
            export function pNeg(p: mCore.geometry.Point, isIn?: boolean): mCore.geometry.Point;
            export function pAbs(p: mCore.geometry.Point, isIn?: boolean): mCore.geometry.Point;
            export function pRound(p: mCore.geometry.Point, isIn?: boolean): mCore.geometry.Point;
            export function pInvert(p: mCore.geometry.Point, isIn?: boolean): mCore.geometry.Point;
            export function pRange(p: mCore.geometry.Point, pLeft: mCore.geometry.Point, pRight: mCore.geometry.Point, isIn?: boolean, isClear?: boolean): mCore.geometry.Point;
            export function pEqual(p1: mCore.geometry.Point, p2: mCore.geometry.Point): boolean;
            export function pDot(p1: mCore.geometry.Point, p2: mCore.geometry.Point): number;
            export function pCross(p1: mCore.geometry.Point, p2: mCore.geometry.Point): number;
            export function pLengthSQ(p: mCore.geometry.Point): number;
            export function pLength(p: mCore.geometry.Point): number;
            export function pDistance(p1: mCore.geometry.Point, p2: mCore.geometry.Point): number;

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
            export function fullPath<T extends mCore.view.ComponentContainer>(node: T): string;
            export function logHierarchy(widget: mCore.view.ComponentContainer | mCore.view.ComponentSprite, maxLevel?: number): void;
            export function logUnlocalizedFields(widget: mCore.view.ComponentContainer | mCore.view.ComponentSprite): void;
            export function getChildView<T extends mCore.view.ComponentContainer>(path: string, firstElement: T): T| null;
            export function localize<T extends mCore.view.ComponentContainer>(root: T): void;
        }
    }

    export namespace view {
        namespace callback {
            type ChildAction = (component: mCore.component.Component, child: mCore.view.ComponentContainer) => void;
            type IterateComponent = (component: mCore.component.Component, index?: number) => void;
        }

        export class ComponentContainer {
            constructor();

            uid: number;
            rotation: number;
            worldTransform: Matrix;
            localTransform: Matrix;
            parent: mCore.view.ComponentContainer | mCore.view.ComponentSprite | mCore.view.ComponentSpine;
            height: number;
            width: number;
            visible: boolean;
            readonly position: mCore.geometry.Point;
            readonly anchor: mCore.geometry.Point;
            readonly scale: mCore.geometry.Point;
            readonly skew: mCore.geometry.Point;
            reusable: boolean;
            blockEvents: boolean;
            inPool: boolean;
            uiType: mCore.enumerator.ui.UI_ELEMENT;
            isUpdate: boolean;
            tint: number;
            parentTint: number;
            userData: number | string | Object | Array<any> | boolean | null;
            protected readonly realTint: number;
            readonly isDestroyed: boolean;
            readonly rate: mCore.geometry.Point;
            readonly animationManager: mCore.manager.AnimationManager;
            readonly componentManager: mCore.manager.ComponentManager;
            readonly listenerManager: mCore.manager.ListenerManager;
            readonly interactionManager: mCore.manager.InteractionManager;
            readonly hasAnimationManager: boolean;
            readonly hasComponentManager: boolean;
            readonly hasListenerManager: boolean;
            readonly hasInteractionManager: boolean;

            // noinspection JSAnnotator
            static create<T extends mCore.view.ComponentContainer>(...var_args: any[]): T;

            public reuse(...var_args: any[]): void;

            public disuse(): void;

            public kill(): void;

            public destroy(): void;

            public toLocal(point: mCore.geometry.Point): mCore.geometry.Point;

            public toGlobal(point: mCore.geometry.Point): mCore.geometry.Point;

            public emitInteractiveEvent(eventType: mCore.enumerator.ui.INTERACTIVE_EVENT, event: mCore.eventDispatcher.EventModel): void;

            public doLayout(): void;

            public updateTransform(): void;

            protected updateChildTint<T extends mCore.view.ComponentContainer>(child: T): void;

            protected onUpdate(dt: number): void;
        }


        // @ts-ignore
        export class ComponentSpine extends mCore.view.ComponentContainer {
            constructor(skeletonName: string);

            reusable: boolean;
            blockEvents: boolean;
            inPool: boolean;
            uiType: mCore.enumerator.ui.UI_ELEMENT;
            isUpdate: boolean;
            parentTint: number;
            userData: number | string | Object | Array<any> | boolean | null;
            protected readonly realTint: number;
            readonly isDestroyed: boolean;
            readonly rate: mCore.geometry.Point;
            readonly animationManager: mCore.manager.AnimationManager;
            readonly componentManager: mCore.manager.ComponentManager;
            readonly listenerManager: mCore.manager.ListenerManager;
            readonly interactionManager: mCore.manager.InteractionManager;
            readonly hasAnimationManager: boolean;
            readonly hasComponentManager: boolean;
            readonly hasListenerManager: boolean;
            readonly hasInteractionManager: boolean;

            static create<T extends mCore.view.ComponentSpine>(skeletonName: string): T;

            public reuse(...var_args: any[]): void;

            public disuse(): void;

            public kill(): void;

            public destroy(): void;

            public emitInteractiveEvent(eventType: mCore.enumerator.ui.INTERACTIVE_EVENT, event: mCore.eventDispatcher.EventModel): void;

            public doLayout(): void;

            protected updateChildTint<T extends mCore.view.ComponentContainer>(child: T): void;

            protected onUpdate(dt: number): void;

        }

        // @ts-ignore
        export class ComponentSprite extends mCore.view.ComponentContainer {
            constructor(frameName: string);

            reusable: boolean;
            blockEvents: boolean;
            inPool: boolean;
            uiType: mCore.enumerator.ui.UI_ELEMENT;
            isUpdate: boolean;
            parentTint: number;
            userData: number | string | Object | Array<any> | boolean | null;
            protected readonly realTint: number;
            readonly isDestroyed: boolean;
            readonly animationManager: mCore.manager.AnimationManager;
            readonly componentManager: mCore.manager.ComponentManager;
            readonly listenerManager: mCore.manager.ListenerManager;
            readonly interactionManager: mCore.manager.InteractionManager;
            readonly rate: mCore.geometry.Point;
            readonly hasAnimationManager: boolean;
            readonly hasComponentManager: boolean;
            readonly hasListenerManager: boolean;
            readonly hasInteractionManager: boolean;

            // noinspection JSAnnotator
            static create<T extends mCore.view.ComponentSprite>(frameName: string): T;

            public reuse(...var_args: any[]): void;

            public disuse(): void;

            public kill(): void;

            public destroy(): void;

            public emitInteractiveEvent(eventType: mCore.enumerator.ui.INTERACTIVE_EVENT, event: mCore.eventDispatcher.EventModel): void;

            public doLayout(): void;

            protected updateChildTint<T extends mCore.view.ComponentContainer>(child: T): void;

            protected onUpdate(dt: number): void;

        }

        // @ts-ignore
        export class Scene extends mCore.view.ComponentContainer {
            constructor(comTransitionShow?: mCore.component.Component, comTransitionHide?: mCore.component.Component);

            // noinspection JSAnnotator
            static create<T extends mCore.view.Scene>(comTransitionShow?: mCore.component.Component, comTransitionHide?: mCore.component.Component): T;

            public show(): void;

            public hide(): void;

            protected onShowStart(): void;

            protected onShowComplete(): void;

            protected onHideStart(): void;

            protected onHideComplete(): void;

        }

        // @ts-ignore
        export class Slice9Sprite extends mCore.view.ComponentContainer {
            constructor(frameName: string, leftSlice?: number, rightSlice?: number, topSlice?: number, bottomSlice?: number);

            tint: number;
            parentTint: number;
            anchor: mCore.geometry.Point;
            leftSlice: number;
            rightSlice: number;
            topSlice: number;
            bottomSlice: number;
            frameName: string;
            slice: number[];
            protected readonly realTint: number;

            // noinspection JSAnnotator
            static create<T extends mCore.view.Slice9Sprite>(frameName: string, leftSlice?: number, rightSlice?: number, topSlice?: number, bottomSlice?: number): T;
        }
    }
}
