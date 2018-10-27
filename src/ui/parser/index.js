import Type from "util/Type";
import Math from "util/Math";
import Color from "util/Color";

import Pool from "pool";
import Logger from "logger";

import BundleCache from "bundle/BundleCache";

import AtlasLabel from "ui/AtlasLabel";
import Button from "ui/Button";
import CheckBox from "ui/CheckBox";
import ComponentContainer from "view/ComponentContainer";
import ComponentSprite from "view/ComponentSprite";
import ImageView from "ui/ImageView";
import Label from "ui/Label";
import ListView from "ui/ListView";
import Panel from "ui/Panel";
import ProgressBar from "ui/ProgressBar";
import Slider from "ui/Slider";
import TextField from "ui/TextField";
import ToggleButton from "ui/ToggleButton";
import Widget from "ui/Widget";

import UI_ELEMENT from "enumerator/ui/UIElement";
import PANEL_GRAPHIC_TYPE from "enumerator/ui/PanelGrphicType";
import PROGRESS_TYPE from "enumerator/ui/ProgressType";
import ScrollView from "../ScrollView";

import ActionAnimation from "animation/ActionAnimation";
import ActionTimeLine from "animation/ActionTimeLine";
import TIME_LINE from "enumerator/TimeLine";
import ACTION_TYPE from "enumerator/ActionType";
import ACTION_EASING from "enumerator/ActionEasing";

import DelayTime from "animation/action/DelayTime";
import FadeTo from "animation/action/FadeTo";
import MoveBy from "animation/action/MoveBy";
import ScaleBy from "animation/action/ScaleBy";
import TintTo from "animation/action/TintTo";
import RotateBy from "animation/action/RotateBy";
import SkewBy from "animation/action/SkewBy";
import Show from "animation/action/Show";
import Hide from "animation/action/Hide";
import Sequence from "animation/action/Sequence";
import Spawn from "animation/action/Spawn";
import Easing from "animation/easing";
import FrameChange from "animation/action/FrameChange";
import bundle from "../../bundle/bundle";

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.ui.Widget} parent
 * @param {Object} data
 * @param {MANTICORE.type.AssetBundle} bundle
 */

function parseChild (parent, data, bundle) {
    let result = null;
    switch (data.type) {
        case UI_ELEMENT.BUTTON: {
            result = _createButton(data, bundle);
            break;
        }
        case UI_ELEMENT.WIDGET: {
            result = new Widget();
            break;
        }
        case UI_ELEMENT.IMAGE_VIEW: {
            result = _createImageView(data, bundle);
            break;
        }
        case UI_ELEMENT.LABEL: {
            result = _createLabel(data, bundle);
            break;
        }
        case UI_ELEMENT.PANEL: {
            result = _createPanel(data, bundle);
            break;
        }
        case UI_ELEMENT.UI_ELEMENT: {
            result = _createUIElement(data, bundle);
            break;
        }
        case UI_ELEMENT.TOGGLE_BUTTON: {
            result = _createToggleButton(data, bundle);
            break;
        }
        case UI_ELEMENT.SLIDER: {
            result = _createSlider(data, bundle);
            break;
        }
        case UI_ELEMENT.SPRITE: {
            result = _createSprite(data, bundle);
            break;
        }
        case UI_ELEMENT.CONTAINER: {
            result = new ComponentContainer();
            break;
        }
        case UI_ELEMENT.PROGRESS_BAR: {
            result = _createProgressBar(data, bundle);
            break;
        }
        case UI_ELEMENT.CHECK_BOX: {
            result = _createCheckBox(data, bundle);
            break;
        }
        case UI_ELEMENT.ATLAS_LABEL: {
            result = _createAtlasLabel(data, bundle);
            break;
        }
        case UI_ELEMENT.TEXT_FIELD: {
            result = _createTextField(data, bundle);
            break;
        }
        case UI_ELEMENT.SCROLL_VIEW: {
            result = _createScrollView(data, bundle);
            break;
        }
        case UI_ELEMENT.LIST_VIEW: {
            result = _createListView(data, bundle);
            break;
        }
        default: {
            Logger.log("Cant parse element");
            break;
        }
    }

    if (Type.isNull(result)) {
        return;
    }

    _parseWidgetData(result, data, bundle);
    _parseAnimation(result, data, bundle);

    if (parent !== null) {
        parent.addChild(result);
    }

    const children = Type.setValue(data.children, []);
    const childCount = children.length;

    for (let i = 0; i < childCount; ++i) {
        parseChild(result, children[i], bundle);
    }

    return result;
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.ui.Widget} element
 * @param {MANTICORE.type.ElementData} data
 * @param {MANTICORE.type.AssetBundle} bundle
 */

function _parseWidgetData(element, data, bundle) {
    const {dimensions, scale, anchor, flip, rotation, visible} = data;

    if (element.anchor) {
        if (dimensions[2] !== -1) {
            element.width = dimensions[2];
        }
        if (dimensions[3] !== -1) {
            element.height = dimensions[3];
        }
        const anchorData = _getAnchor(anchor, bundle);
        element.anchor.set(
            Math.percentToFloat(anchorData[0]),
            Math.percentToFloat(anchorData[1])
        );
    }

    element.position.set(dimensions[0], dimensions[1]);
    if (!element.interactive) {
        element.interactive = data.interactive;
    }
    element.name = _getElementName(data.name, bundle);

    if (!Type.isNull(scale)) {
        element.scale.set(
            Math.percentToFloat(scale[0]),
            Math.percentToFloat(scale[1])
        );
    }

    const color = _getColor(data.tint, bundle);

    if (color !== Color.COLORS.WHITE) {
        element.tint = color;//TODO Fix tint for display objects.
    }

    element.alpha = Math.percentToFloat(data.alpha);

    if (!Type.isNull(flip)) {
        element.flipX = flip[0];
        element.flipY = flip[1];
    }

    if (!Type.isNull(rotation)) {
        if (rotation[0] === rotation[1]) {
            element.rotation = Math.toRadians(rotation[0]);
        }
        else {
            element.skew.set(
                Math.toRadians(rotation[0]),
                Math.toRadians(rotation[1])
            );
        }
    }

    element.visible = visible;
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.ui.Widget} element
 * @param {MANTICORE.type.ElementData} data
 * @param {MANTICORE.type.AssetBundle} bundle
 * @private
 */

function _parseAnimation(element, data, bundle) {
    if (Type.isEmpty(data.animations)) {
        return;
    }

    const animations = data.animations;
    const animationCount = animations.length;

    /**
     * @type {MANTICORE.animation.ActionTimeLine}
     */
    const timeLine = Pool.getObject(ActionTimeLine, element);

    let i, animation;

    for (i = 0; i < animationCount; ++i) {
        animation = animations[i];
        if (i === 0) {
            timeLine.fps = animation.fps;
        }

        timeLine.addAnimation(_getAnimatioName(animation.name, bundle), _createAnimation(animation, bundle));
    }

    timeLine.inherit = true;

    element.animationManager.addTimeLine(TIME_LINE.UI, timeLine);
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.AnimationData} animation
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.animation.ActionAnimation}
 */

function _createAnimation(animation, bundle) {
    const {frames, fps} = animation;
    const frameCount = frames.length;
    const offsetPosition = new PIXI.Point(0, 0);
    const offsetScale = new PIXI.Point(1, 1);
    const offsetSkew = new PIXI.Point(0, 0);
    let offsetRotation = 0;
    let tint = -1;
    let alpha = -1;
    let visible = null;

    let iterator, frame, track, type;
    const tracks = [];
    const sortedFrames = {};

    for (iterator = 0; iterator < frameCount; ++iterator) {
        frame = frames[iterator];
        type = frame.type;

        if (!sortedFrames.hasOwnProperty(type)) {
            sortedFrames[type] = [];
        }

        sortedFrames[type].push(frame);
    }

    let result, prevValue, nextValue, action;

    for (iterator in sortedFrames) {
        result = [];
        track = sortedFrames[iterator];
        switch (track[0].type) {
            case ACTION_TYPE.ALPHA: {
                _iterateFrames(
                    track,
                    fps,
                    data => alpha = Math.percentToFloat(data[0]),
                    (nextData, prevData, time, ease) => {
                        nextValue = Math.percentToFloat(nextData[0]);
                        prevValue = !Type.isNull(prevData) ? Math.percentToFloat(prevData[0]) : -1;
                        if (nextValue === prevValue) {
                            action = new DelayTime(time);
                        }
                        else {
                            action = new FadeTo(time, nextValue);
                            if (!Type.isNull(ease)) {
                                action.easing(ease);
                            }
                        }
                        result.push(action);
                    });
                break;
            }
            case ACTION_TYPE.DELAY: {
                _iterateFrames(
                    track,
                    fps,
                    () => {},
                    (nextData, prevData, time) => {
                        result.push(new DelayTime(time));
                    });
                if (result.length === 0) {
                    result.push(new DelayTime(0));
                }
                break;
            }
            case ACTION_TYPE.POSITION: {
                nextValue = new PIXI.Point(0, 0);
                prevValue = new PIXI.Point(0, 0);
                _iterateFrames(
                    track,
                    fps,
                    data => offsetPosition.set(data[0], data[1]),
                    (nextData, prevData, time, ease) => {
                        nextValue.set(nextData[0], nextData[1]);

                        if (nextValue.equals(prevValue)) {
                            action = new DelayTime(time);
                        }
                        else {
                            action = new MoveBy(time, nextValue);
                            if (!Type.isNull(ease)) {
                                action.easing(ease);
                            }
                        }
                        result.push(action);
                    });
                break;
            }
            case ACTION_TYPE.SCALE: {
                nextValue = new PIXI.Point(0, 0);
                prevValue = new PIXI.Point(1, 1);
                _iterateFrames(
                    track,
                    fps,
                    data => offsetScale.set(data[0], data[1]),
                    (nextData, prevData, time, ease) => {
                        nextValue.set(nextData[0], nextData[1]);

                        if (nextValue.equals(prevValue)) {
                            action = new DelayTime(time);
                        }
                        else {
                            action = new ScaleBy(time, nextValue.x, nextValue.y);
                            if (!Type.isNull(ease)) {
                                action.easing(ease);
                            }
                        }
                        result.push(action);
                    });
                break;
            }
            case ACTION_TYPE.SKEW: {
                nextValue = new PIXI.Point(0, 0);
                prevValue = new PIXI.Point(0, 0);
                _iterateFrames(
                    track,
                    fps,
                    data => offsetSkew.set(data[0], data[1]),
                    (nextData, prevData, time, ease) => {
                        nextValue.set(nextData[0], nextData[1]);

                        if (nextValue.equals(prevValue)) {
                            action = new DelayTime(time);
                        }
                        else {
                            action = nextValue.x !== nextValue.y ? new SkewBy(time, nextValue.x, nextValue.y) : new RotateBy(time, nextValue.x);
                            if (!Type.isNull(ease)) {
                                action.easing(ease);
                            }
                        }
                        result.push(action);
                    });
                break;
            }
            case ACTION_TYPE.TINT: {
                _iterateFrames(
                    track,
                    fps,
                    data => tint = data[0],
                    (nextData, prevData, time, ease) => {
                        nextValue = nextData[0];
                        prevValue = !Type.isNull(prevData) ? prevData[0] : -1;
                        result.push(nextValue === prevValue ? new DelayTime(time) : new TintTo(time, nextValue));

                        if (nextValue === prevValue) {
                            action = new DelayTime(time);
                        }
                        else {
                            action = new TintTo(time, nextValue);
                            if (!Type.isNull(ease)) {
                                action.easing(ease);
                            }
                        }
                        result.push(action);
                    });
                break;
            }
            case ACTION_TYPE.VISIBLE: {
                _iterateFrames(
                    track,
                    fps,
                    data => visible = Type.toBoolean(data[0]),
                    (nextData, prevData, time) => {
                        prevValue = !Type.isNull(prevData) ? Type.toBoolean(prevData[0]) : null;
                        nextValue = Type.toBoolean(nextData[0]);
                        result.push(new DelayTime(time));
                        if (prevValue === nextValue) {
                            return;
                        }
                        result.push(nextValue ? new Show() : new Hide());
                    });
                break;
            }
            case ACTION_TYPE.FRAME: {
                _iterateFrames(
                    track,
                    fps,
                    data => result.push(new FrameChange(_getTextureFromData(data[0], bundle))),
                    (nextData, prevData, time) => {
                        result.push(new DelayTime(time));
                        result.push(new FrameChange(_getTextureFromData(nextData[0], bundle)));
                    });
                break;
            }
        }

        if (result.length > 0) {
            tracks.push(result.length > 1 ? new Sequence(result) : result[0]);
        }

    }

    return Pool.getObject(ActionAnimation, tracks.length === 1 ? tracks[0] : new Spawn(tracks));
}

/**
 * @method
 * @private
 * @param {int[] | null} easeData
 * @return {MANTICORE.animation.easing.EaseBase | null}
 */

function _createEasing(easeData) {
    if (Type.isNull(easeData)) {
        return null;
    }
    if (easeData.length > 1) {
        return new Easing.EaseBezier(
            Math.percentToFloat(easeData[0]),
            Math.percentToFloat(easeData[1]),
            Math.percentToFloat(easeData[2]),
            Math.percentToFloat(easeData[3])
        );
    }

    switch (easeData[0]) {
        case ACTION_EASING.LINEAR: return null;
        case ACTION_EASING.SINE_IN: return new Easing.EaseSineIn();
        case ACTION_EASING.SINE_OUT: return new Easing.EaseSineOut();
        case ACTION_EASING.SINE_IN_OUT: return new Easing.EaseSineInOut();
        case ACTION_EASING.QUAD_IN: return new Easing.EaseQuadraticIn();
        case ACTION_EASING.QUAD_OUT: return new Easing.EaseQuadraticOut();
        case ACTION_EASING.QUAD_IN_OUT: return new Easing.EaseQuadraticInOut();
        case ACTION_EASING.CUBIC_IN: return new Easing.EaseCubicIn();
        case ACTION_EASING.CUBIC_OUT: return new Easing.EaseCubicOut();
        case ACTION_EASING.CUBIC_IN_OUT: return new Easing.EaseCubicInOut();
        case ACTION_EASING.QUART_IN: return new Easing.EaseQuarticIn();
        case ACTION_EASING.QUART_OUT: return new Easing.EaseQuarticOut();
        case ACTION_EASING.QUART_IN_OUT: return new Easing.EaseQuarticInOut();
        case ACTION_EASING.QUINT_IN: return new Easing.EaseQuinticIn();
        case ACTION_EASING.QUINT_OUT: return new Easing.EaseQuinticOut();
        case ACTION_EASING.QUINT_IN_OUT: return new Easing.EaseQuinticInOut();
        case ACTION_EASING.EXPO_IN: return new Easing.EaseExponentialIn();
        case ACTION_EASING.EXPO_OUT: return new Easing.EaseExponentialOut();
        case ACTION_EASING.EXPO_IN_OUT: return new Easing.EaseExponentialInOut();
        case ACTION_EASING.CIRC_IN: return new Easing.EaseCircleIn();
        case ACTION_EASING.CIRC_OUT: return new Easing.EaseCircleOut();
        case ACTION_EASING.CIRC_IN_OUT: return new Easing.EaseCircleInOut();
        case ACTION_EASING.ELASTIC_IN: return new Easing.EaseElasticIn();
        case ACTION_EASING.ELASTIC_OUT: return new Easing.EaseElasticOut();
        case ACTION_EASING.ELASTIC_IN_OUT: return new Easing.EaseElasticInOut();
        case ACTION_EASING.BACK_IN: return new Easing.EaseBackIn();
        case ACTION_EASING.BACK_OUT: return new Easing.EaseBackOut();
        case ACTION_EASING.BACK_IN_OUT: return new Easing.EaseBackInOut();
        case ACTION_EASING.BOUNCE_IN: return new Easing.EaseBounceIn();
        case ACTION_EASING.BOUNCE_OUT: return new Easing.EaseBounceOut();
        case ACTION_EASING.BOUNCE_IN_OUT: return new Easing.EaseBounceInOut();
    }

    return null;
}

/**
 * @function
 * @param {MANTICORE.type.AnimationFrame[]} frames
 * @param {int} fps
 * @param {Function} onZeroFrame
 * @param {Function} onFrame
 * @private
 */

function _iterateFrames(frames, fps, onZeroFrame, onFrame) {
    const frameCount = frames.length;
    let prevFrame = null;
    let i, nextFrame, time;

    for (i  = 0; i < frameCount; ++i) {
        nextFrame = frames[i];

        if (nextFrame.index === 0) {
            onZeroFrame(nextFrame.data);
        }
        else {
            time = (nextFrame.index - (!Type.isNull(prevFrame) ? prevFrame.index : 0)) / fps;
            onFrame(nextFrame.data, !Type.isNull(prevFrame) ? prevFrame.data : null, time, _createEasing(nextFrame.ease));
        }
        prevFrame = nextFrame;
    }
}



/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.ui.Widget} element
 * @param {MANTICORE.type.ElementData} data
 */

function _parseSlice9(element, data) {
    const slice9 = data.slice9;

    if (Type.isNull(slice9)) {
        return;
    }

    const left = slice9[0];
    const top = slice9[1];
    const right = element.width - slice9[0] - slice9[2];
    const bottom = element.height - slice9[1] - slice9[3];

    element.setSlice(left, right, top, bottom);
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.ui.AtlasLabel}
 */

function _createAtlasLabel(data, bundle) {
    const atlasFont = _getAtlasLabelData(data, 0, bundle);
    const texture = _getTextureFromData(atlasFont.texture, bundle);
    const result = new AtlasLabel(texture, atlasFont.size[0], atlasFont.size[1], atlasFont.dotWidth);

    result.text = _getText(data, 1, bundle);

    return result;
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.ui.ScrollView}
 */

function _createScrollView(data, bundle) {
    const {content} = data;
    const graphicType = data.fileData[1];
    const contentData = graphicType === PANEL_GRAPHIC_TYPE.SPRITE ? _getTextureLinkFromData(data, 0, bundle) : Color.COLORS.WHITE;
    const result = new ScrollView(graphicType, contentData);

    result.backgroundColor = _getColor(data.fileData[2], bundle);
    result.backgroundAlpha = Math.percentToFloat(data.fileData[3]);
    result.innerWidth = content.dimensions[2];
    result.innerHeight = content.dimensions[3];
    result.scrollDirection = data.fileData[4];
    result.clipping = data.clipped;

    _parseSlice9(result, data);

    return result;
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.ui.ScrollView}
 */

function _createListView(data, bundle) {
    const {content} = data;
    const graphicType = data.fileData[1];
    const contentData = graphicType === PANEL_GRAPHIC_TYPE.SPRITE ? _getTextureLinkFromData(data, 0, bundle) : Color.COLORS.WHITE;
    const result = new ListView(graphicType, contentData);

    result.backgroundColor = _getColor(data.fileData[2], bundle);
    result.backgroundAlpha = Math.percentToFloat(data.fileData[3]);
    result.innerWidth = content.dimensions[2];
    result.innerHeight = content.dimensions[3];
    result.scrollDirection = data.fileData[4];
    result.outerPadding.set(data.fileData[5]);
    result.innerPadding.set(data.fileData[5]);
    result.clipping = data.clipped;

    _parseSlice9(result, data);

    return result;
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.ui.CheckBox}
 */

function _createCheckBox(data, bundle) {
    const {content} = data;

    const result = new CheckBox(
        _getTextureLinkFromData(data, 0, bundle),
        _getTextureLinkFromData(content, 0, bundle),
        _getTextureLinkFromData(data, 1, bundle),
        _getTextureLinkFromData(data, 2, bundle),
        _getTextureLinkFromData(data, 3, bundle),
        _getTextureLinkFromData(content, 1, bundle),
        _getTextureLinkFromData(content, 2, bundle),
        _getTextureLinkFromData(content, 3, bundle)
    );

    const icon = result.icon;
    const anchorData = _getAnchor(content.anchor, bundle);
    icon.anchor.set(
        Math.percentToFloat(anchorData[0]),
        Math.percentToFloat(anchorData[1])
    );
    icon.width = content.dimensions[2];
    icon.height =  content.dimensions[3];

    _parseSlice9(result, data);

    return result;
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.ui.Button}
 */

function _createButton(data, bundle) {
    const result = new Button(
        _getTextureLinkFromData(data, 0, bundle),
        _getTextureLinkFromData(data, 1, bundle),
        _getTextureLinkFromData(data, 2, bundle),
        _getTextureLinkFromData(data, 3, bundle)
    );

    _parseSlice9(result, data);

    const titleData = Type.setValue(data.content);

    if (!Type.isNull(titleData)) {
        const title = _createLabel(titleData, bundle);

        _parseWidgetData(title, titleData, bundle);

        result.title = title;
    }

    return result;
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.ui.ProgressBar}
 */

function _createProgressBar(data, bundle) {
    const textureLink = _getTextureLinkFromData(data, 0, bundle);
    const type = data.clipped ? PROGRESS_TYPE.CLIPPING : PROGRESS_TYPE.SIZE;
    const result = new ProgressBar(textureLink, data.fileData[1], type);
    _parseSlice9(result, data);
    return result;
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.view.ComponentSprite}
 */

function _createSprite(data, bundle) {
    const textureLink = _getTextureLinkFromData(data, 0, bundle);
    return new ComponentSprite(textureLink);
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.ui.Slider}
 */

function _createSlider(data, bundle) {
    const ball = _createButton(data.content, bundle);
    const progressFrame = _getTextureLinkFromData(data, 0, bundle);
    const result = new Slider(ball, data.fileData[1], progressFrame);

    if (!Type.isNull(result.progressBar)) {
        _parseSlice9(result.progressBar, data);
    }

    return result;
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.ui.Label}
 */

function _createLabel(data, bundle) {
    const font = _getFontStyle(data.fileData[0], bundle);
    const name = bundle.fonts[font.name];
    const result = new Label(name, font.size);
    result.horizontalAlign = font.align[0];
    result.verticalAlign = font.align[1];
    result.text = _getText(data, 1, bundle);
    result.color = _getColor(font.color, bundle);
    result.localized = false;

    return result;
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.ui.TextField}
 */

function _createTextField(data, bundle) {
    const font = _getFontStyle(data.fileData[0], bundle);
    const style = _getTextFieldStyle(data.fileData[2], bundle);
    const name = bundle.fonts[font.name];
    const result = new TextField(name, font.size);

    result.horizontalAlign = font.align[0];
    result.verticalAlign = font.align[1];
    result.text = _getText(data, 1, bundle);
    result.color = _getColor(font.color, bundle);
    result.maxLength = style.maxLength;
    result.passwordMode = style.passwordMode;
    result.passwordChar = bundle.texts[style.passwordChar];

    if (style.placeHolderText !== -1) {
        result.placeholderText = bundle.texts[style.placeHolderText];
    }

    result.localized = false;

    return result;
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.ui.Panel}
 */

function _createPanel(data, bundle) {
    const graphicType = data.fileData[1];
    const contentData = graphicType === PANEL_GRAPHIC_TYPE.SPRITE ? _getTextureLinkFromData(data, 0, bundle) : Color.COLORS.WHITE;
    const result = new Panel(graphicType, contentData);

    result.backgroundColor = _getColor(data.fileData[2], bundle);
    result.backgroundAlpha = Math.percentToFloat(data.fileData[3]);
    result.clipping = data.clipped;

    _parseSlice9(result, data);

    return result;
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.ui.Widget}
 */

function _createUIElement(data, bundle) {
    const element = bundle.ui[data.fileData[0]];
    const result = parseChild(null, element, bundle);

    _parseWidgetData(result, element, bundle);

    return result;
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.ui.ImageView}
 */

function _createImageView(data, bundle) {
    const texture = _getTextureLinkFromData(data, 0, bundle);
    const result = Type.isNull(data.slice9) ? new ComponentSprite(texture) : new ImageView(texture);

    _parseSlice9(result, data);

    return result;
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.ui.ToggleButton}
 */

function _createToggleButton(data, bundle) {
    const result = new ToggleButton(
        _getTextureLinkFromData(data, 0, bundle),
        _getTextureLinkFromData(data, 4, bundle),
        _getTextureLinkFromData(data, 1, bundle),
        _getTextureLinkFromData(data, 5, bundle),
        _getTextureLinkFromData(data, 2, bundle),
        _getTextureLinkFromData(data, 6, bundle),
        _getTextureLinkFromData(data, 3, bundle),
        _getTextureLinkFromData(data, 7, bundle)
    );

    _parseSlice9(result, data);

    if (!Type.isNull(data.content)) {
        const title = _createLabel(data.content, bundle);

        _parseWidgetData(title, data.content, bundle);

        result.title = title;
    }

    return result;
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {int} index
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {string | null}
 */

function _getTextureLinkFromData(data, index, bundle) {
    return _getTextureFromData(data.fileData[index], bundle);
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {int} index
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {string | null}
 */

function _getTextureFromData(index, bundle) {
    const parts = [];
    const decomposedTexture = _extractValue(index, bundle, "textures", []);
    const partCount = decomposedTexture.length;

    for (let i = 0; i < partCount; ++i) {
        parts.push(_extractValue(decomposedTexture[i], bundle, "textureParts", ""));
    }
    const result = parts.join("/");
    return result.length !== 0 ? result : null;
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {int} index
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {string}
 */

function _getText(data, index, bundle) {
    const dataIndex = data.fileData[index];
    return _extractValue(dataIndex, bundle, "texts", "default");
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {int} index
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {string}
 */

function _getElementName(index, bundle) {
    return _extractValue(index, bundle, "elementNames", "default");
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {int} index
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {string}
 */

function _getAnimatioName(index, bundle) {
    return _extractValue(index, bundle, "animationNames", "default");
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {int} index
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {int[]}
 */

function _getAnchor(index, bundle) {
    return _extractValue(index, bundle, "anchors", [0, 0]);
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {MANTICORE.type.ElementData} data
 * @param {int} index
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.type.AtlasFont}
 */

function _getAtlasLabelData(data, index, bundle) {
    const dataIndex = data.fileData[index];
    return _extractValue(dataIndex, bundle, "atlasFonts", null);
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {int} styleIndex
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.type.FontStyle | null}
 */

function _getFontStyle(styleIndex, bundle) {
    return _extractValue(styleIndex, bundle, "fontStyles", null);
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {int} styleIndex
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {MANTICORE.type.TextFieldStyle | null}
 */

function _getTextFieldStyle(styleIndex, bundle) {
    return _extractValue(styleIndex, bundle, "textFieldStyles", null);
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {int} index
 * @param {MANTICORE.type.AssetBundle} bundle
 * @returns {int}
 */

function _getColor(index, bundle) {
    return _extractValue(index, bundle, "colors", Color.COLORS.WHITE);
}

/**
 * @function
 * @private
 * @memberOf MANTICORE.ui.parser
 * @param {int} index
 * @param {MANTICORE.type.AssetBundle} bundle
 * @param {string} link
 * @param {*} defaultValue
 * @returns {*}
 */

function _extractValue(index, bundle, link, defaultValue) {
    return index !== -1 ? bundle[link][index] : defaultValue;
}

/**
 * @desc Namespace that contain methods for parse UI from Json.
 * @namespace MANTICORE.ui.parser
 * @memberOf MANTICORE.ui
 */

export default {
    /**
     * @function
     * @param {string} name
     * @param {string} link
     * @memberOf MANTICORE.ui.parser
     * @returns {MANTICORE.ui.Widget}
     */
    parseElement: function (name, link) {
        const bundle = BundleCache.getAssetBundle(link).data;

        const index = bundle.componentNames.indexOf(name);
        const data = bundle.ui[index];

        return parseChild(null, data, bundle);
    }
}