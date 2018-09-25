declare namespace MANTICORE {
    export namespace builder {
        export namespace layoutBuilder {
            export function infiniteLayout(component: MANTICORE.component.ui.ComLayout): void;
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
            }

            export class ComUI {
                constructor(name?: string);
            }

            export class ComUIElement extends MANTICORE.component.ui.ComUI {
                constructor(elementName: string, bundleName?: string);

                logHierarchy(widget?: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite): void;
                getChildView(path: string, widget?: MANTICORE.view.ComponentContainer | MANTICORE.view.ComponentSprite): PIXI.Container | any;
            }
        }

        export class ComChildIterator extends MANTICORE.component.Component {
            constructor(name?: string);

            childCount: number;

            hasChildren(): void;
            iterateChildren(callback: MANTICORE.component.callback.IterateChildren): void;
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

            hasOwner(): boolean;
            onAdd(owner: MANTICORE.view.ComponentContainer): void;
            onRemove(): void;
            onUpdate(dt: number): void;
            onAddChild(child: PIXI.DisplayObject): void;
            onRemoveChild(child: PIXI.DisplayObject): void;
            reuse(...var_args: any[]): void;
            disuse(): void;
            destroy(): void;
            kill(): void;

            protected addEventListener(event: string, handler: Function): void;
            protected removeEventListener(event: string): void;
            protected dispatchEvent(event: string, data?: any): void;
        }
    }

    export namespace constant {
        export const COLLIDER_NAME: string;
    }

    export namespace enumerator {
        export enum DIRECTION {
            NONE = 0,
            LEFT = 1,
            RIGHT = 2,
            UP = 3,
            DOWN = 4
        }

        export enum FILE_TYPE {
            PNG = "png"
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
        export function addListener(type: string, listener: Function, target: Object): void;
        export function hasListener(type: string, target: Object): boolean;
        export function removeListener(type: string, target: Object): boolean;
        export function dispatch(type: string, targetOrEvent?: Object, data?: Object): void;

        export class EventModel extends MANTICORE.model.PoolModel {
            constructor(target: Object, data: any);

            data: any;
            target: Object;
        }

        export class ListenerModel extends MANTICORE.model.PoolModel {
            constructor(event: string, listener: Function, target: Object);

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

            addEventListener(event: string, handler: Function): void;
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
            clear(): void;
            keys: number[] | string[];
            values: any[];
            isEmpty(): boolean;
        }
    }

    export namespace type {
        export interface AssetBundle {
            ui: MANTICORE.type.ElementData[];
            textures: number[];
            textureParts: string[];
            componentNames: string[];
            elementNames: string[];
            texts: string[];
            fonts: string[];
            fontStyles: MANTICORE.type.FontStyle[];
            atlasFonts: MANTICORE.type.AtlasFont[];
            colors: number[];
            anchors: number[];
            textFieldStyles: MANTICORE.type.TextFieldStyle[];
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

        export interface AtlasFont {
            texture: number;
            dotWidth: number;
            size: number[];
        }

        export interface ElementData {
            name: number;
            scale: number[];
            anchor: number;
            rotation: number[];
            flip: boolean[];
            type: MANTICORE.enumerator.ui.UI_ELEMENT;
            dimensions: number[];
            slice9: number[];
            tint: number;
            children: MANTICORE.type.ElementData[];
            content: MANTICORE.type.ElementData;
            fileData: number[];
            clipped: boolean;
            interactive: boolean;
            visible: boolean;
            alpha: number;
        }

        export interface TextFieldStyle {
            placeHolderText: number;
            maxLength: number;
            passwordMode: boolean;
            passwordChar: number;
        }
    }

    export namespace callback {
        /**
         * 
         * @param component
         * @param index
         */
        type IterateComponent = (component: MANTICORE.component.Component, index?: number)=>void;

        /**
         * 
         * @param component
         * @param child
         */
        type ChildAction = (component: MANTICORE.component.Component, child: PIXI.DisplayObject)=>void;

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

        }
        export namespace geometry {
            export function pFromSize(size: PIXI.Container | PIXI.Rectangle, inPoint?: PIXI.Point | PIXI.ObservablePoint): PIXI.Point | PIXI.ObservablePoint;
            export function sSub(size1: PIXI.Container | PIXI.Rectangle, size2: PIXI.Container | PIXI.Rectangle, inPoint?: PIXI.Point | PIXI.ObservablePoint): PIXI.Point | PIXI.ObservablePoint;
            export function pSub(p1: PIXI.Point | PIXI.ObservablePoint, p2: PIXI.Point | PIXI.ObservablePoint, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pAdd(p1: PIXI.Point | PIXI.ObservablePoint, p2: PIXI.Point | PIXI.ObservablePoint, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pMult(p: PIXI.Point | PIXI.ObservablePoint, multiplier: number, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pCompMult(p1: PIXI.Point | PIXI.ObservablePoint, p2: PIXI.Point | PIXI.ObservablePoint, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pMax(p1: PIXI.Point | PIXI.ObservablePoint, p2: PIXI.Point | PIXI.ObservablePoint, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pMin(p1: PIXI.Point | PIXI.ObservablePoint, p2: PIXI.Point | PIXI.ObservablePoint, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pNeg(p: PIXI.Point | PIXI.ObservablePoint, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
            export function pRound(p: PIXI.Point | PIXI.ObservablePoint, isIn?: boolean): PIXI.Point | PIXI.ObservablePoint;
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
            export function toDegreees(radians: number): number;
            export function floatToPercent(value: number, isRound?: boolean): number;
            export function percentToFloat(value: number): number;

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
            export function getChildView(path: string, firstElement: PIXI.Container): PIXI.DisplayObject | null;
        }
    }

    export namespace view {
        namespace callback {
            /**
             *
             * @param component
             * @param index
             */
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
            public getComponent(name: string): MANTICORE.component.Component | null;
            public removeComponent(name: string): boolean;
            public removeAllComponents(): void;
            public disuse(): void;
            public kill(): void;
            public destroy(): void;

            protected addEventListener(event: string, handler: Function): void;
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
            public disuse(): void;
            public kill(): void;
            public destroy(): void;

            protected addEventListener(event: string, handler: Function): void;
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
