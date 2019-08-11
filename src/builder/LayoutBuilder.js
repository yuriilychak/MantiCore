import Type from "util/Type";
import Math from "util/Math";
import HORIZONTAL_ALIGN from "enumerator/ui/HorizontalAlign";
import VERTICAL_ALIGN from "enumerator/ui/VerticalAlign";
import Geometry from "../util/Geometry";
import Point from "geometry/Point";

/**
 * @desc Namespace that contain builders for layout.
 * @namespace mCore.builder.layoutBuilder
 * @memberOf mCore.builder
 */

export default {
    /**
     * @desc Align elements in layout if it not grid and some dimensions can be set by items size.
     * @function
     * @memberOf mCore.builder.layoutBuilder
     * @param {mCore.component.ui.ComLayout} component
     */

    infiniteLayout: function(component) {
        const minWidth = component.minWidth;
        const minHeight = component.minHeight;
        const contentWidth = component.contentWidth;
        const contentHeight = component.contentHeight;
        const owner = component.owner;
        const resizeItems = component.resizeItems;
        const innerPadding = component.innerPadding;
        const outerPadding = component.outerPadding;
        const verticalAlign = component.verticalAlign;
        const horizontalAlign = component.horizontalAlign;
        const childSize = Point.create(0, 0);
        const maxDimensions = Point.create(0, 0);
        const offset = Point.create(0, 0);
        let containerDimension, itemDimension, dimCoef, hMult,vMult;

        component.iterateChildren(child => child.scale.set(1));

        if (contentWidth === -1) {// Horizontal list
            if (contentHeight === -1) {//Height don't set. Set to max child height.
                this._getMaxChildrenDimensions(component, maxDimensions);
                containerDimension = maxDimensions.y + Math.multPowTwo(outerPadding.y);
                component.owner.height = containerDimension;
            }
            else {
                containerDimension = contentHeight;
            }

            dimCoef = this._getDimensionCoef(//Coefficient for align child vertical.
                verticalAlign,
                VERTICAL_ALIGN.TOP,
                VERTICAL_ALIGN.MIDDLE,
                VERTICAL_ALIGN.BOTTOM
            );

            itemDimension = containerDimension - Math.multPowTwo(outerPadding.y);//Height for align item

            if (resizeItems) {//Scale item by dimension
                component.iterateChildren(child => {
                    Geometry.pFromSize(child, childSize);
                    child.scale.set(itemDimension / childSize.y);
                });
            }

            //Calculate width and offset of items for layout.

            offset.x = outerPadding.x;

            component.iterateChildren(child => {
                Geometry.pMult(Geometry.pFromSize(child, childSize), child.scale.x, true);
                offset.x += childSize.x + innerPadding.x;
            });

            offset.x += outerPadding.x - innerPadding.x;

            // If result size bigger than min width or it don't set change to default.
            offset.x = this._updateStaticDimension(
                owner, "width", minWidth, offset.x, outerPadding.x,
                horizontalAlign, HORIZONTAL_ALIGN.LEFT, HORIZONTAL_ALIGN.CENTER, HORIZONTAL_ALIGN.RIGHT
            );

            //Align items.
            offset.y = outerPadding.y + itemDimension * dimCoef;

            hMult = 0;
            vMult = 1;
        }
        else {//Vertical list
            containerDimension = contentWidth;

            dimCoef = this._getDimensionCoef(//Coefficient for align child horizontal.
                horizontalAlign,
                HORIZONTAL_ALIGN.LEFT,
                HORIZONTAL_ALIGN.CENTER,
                HORIZONTAL_ALIGN.RIGHT
            );

            itemDimension = containerDimension - Math.multPowTwo(outerPadding.x);//Width for align item

            if (resizeItems) {//Scale item by dimension
                component.iterateChildren(child => {
                    Geometry.pFromSize(child, childSize);
                    child.scale.set(itemDimension / childSize.x);
                });
            }

            //Calculate width and offset of items for layout.

            offset.y = outerPadding.y;

            component.iterateChildren(child => {
                Geometry.pMult(Geometry.pFromSize(child, childSize), child.scale.x, true);
                offset.y += childSize.y + innerPadding.y;
            });

            offset.y += outerPadding.y - innerPadding.y;

            // If result size bigger than min height or it don't set change to default.
            offset.y = this._updateStaticDimension(
                owner, "height", minHeight, offset.y, outerPadding.y,
                verticalAlign, VERTICAL_ALIGN.TOP, VERTICAL_ALIGN.MIDDLE, VERTICAL_ALIGN.BOTTOM
            );

            //Align items.
            offset.x = outerPadding.x + itemDimension * dimCoef;

            hMult = 1;
            vMult = 0;
        }

        this._alignChildren(component, offset, innerPadding, dimCoef, hMult, vMult);
    },

    /**
     * @desc Align children in infinite layout,
     * @function
     * @private
     * @memberOf mCore.builder.layoutBuilder
     * @param {mCore.component.ui.ComLayout} component
     * @param {mCore.geometry.Point} offset
     * @param {mCore.geometry.Point} padding
     * @param {int} dimCoef
     * @param {int} hMult
     * @param {int} vMult
     */

    _alignChildren: function(component, offset, padding, dimCoef, hMult, vMult) {
        const zeroPoint = Point.create(0, 0);
        const childSize = Point.create(0, 0);
        const childOffset = Point.create(0, 0);
        const anchor = Point.create(0, 0);
        const position = Point.create(0, 0);
        const dimMult = Point.create(hMult, vMult);
        const sizeDif = Point.create(0, 0);
        const offsetMult = Point.create(vMult, hMult);

        component.iterateChildren(child => {
            Geometry.pMult(Geometry.pFromSize(child, childSize), child.scale.x, true);

            childOffset.copyFrom(childSize);
            this._getChildAnchor(child, zeroPoint, anchor);
            Geometry.pCompMult(childOffset, anchor, true);

            position.copyFrom(offset);
            sizeDif.copyFrom(childSize);

            child.position.copyFrom(
                Geometry.pSub(
                    Geometry.pAdd(position, childOffset, true),
                    Geometry.pMult(
                        Geometry.pCompMult(sizeDif, dimMult, true),
                        dimCoef,
                        true
                    ),
                    true
                )
            );

            Geometry.pAdd(
                offset,
                Geometry.pCompMult(
                    Geometry.pAdd(childSize, padding, true),
                    offsetMult,
                    true
                ),
                true
            );
        });
    },

    /**
     * @desc Update static dimension in infinite layout,
     * @function
     * @private
     * @memberOf mCore.builder.layoutBuilder
     * @param {mCore.ui.Widget} owner
     * @param {string} link
     * @param {int} minDim
     * @param {int} offset
     * @param {int} padding
     * @param {mCore.enumerator.ui.HORIZONTAL_ALIGN | mCore.enumerator.ui.VERTICAL_ALIGN} align
     * @param {mCore.enumerator.ui.HORIZONTAL_ALIGN | mCore.enumerator.ui.VERTICAL_ALIGN} minAlign
     * @param {mCore.enumerator.ui.HORIZONTAL_ALIGN | mCore.enumerator.ui.VERTICAL_ALIGN} middleAlign
     * @param {mCore.enumerator.ui.HORIZONTAL_ALIGN | mCore.enumerator.ui.VERTICAL_ALIGN} maxAlign
     * @return {int}
     */

    _updateStaticDimension: function(owner, link, minDim, offset, padding, align, minAlign, middleAlign, maxAlign) {
        if (minDim === -1 || offset >= minDim) {
            owner[link] = offset;
            return padding;
        }
        else {
            owner[link] = minDim;
            offset = minDim - offset + Math.multPowTwo(padding);
            switch (align) {
                case minAlign: return padding;
                case middleAlign: return Math.divPowTwo(offset);
                case maxAlign: return offset - padding;
                default: return padding;
            }
        }
    },

    /**
     * @desc Calculate align coef for dimension.
     * @function
     * @private
     * @memberOf mCore.builder.layoutBuilder
     * @param {mCore.enumerator.ui.HORIZONTAL_ALIGN | mCore.enumerator.ui.VERTICAL_ALIGN} align
     * @param {mCore.enumerator.ui.HORIZONTAL_ALIGN | mCore.enumerator.ui.VERTICAL_ALIGN} minAlign
     * @param {mCore.enumerator.ui.HORIZONTAL_ALIGN | mCore.enumerator.ui.VERTICAL_ALIGN} middleAlign
     * @param {mCore.enumerator.ui.HORIZONTAL_ALIGN | mCore.enumerator.ui.VERTICAL_ALIGN} maxAlign
     * @returns {number}
     */

    _getDimensionCoef: function(align, minAlign, middleAlign, maxAlign) {
        switch (align) {
            case minAlign: return 0;
            case middleAlign: return 0.5;
            case maxAlign: return 1;
            default: return 0;
        }
    },

    /**
     * @desc Returns anchor point of child
     * @function
     * @private
     * @memberOf mCore.builder.layoutBuilder
     * @param {mCore.view.ComponentSprite | mCore.view.ComponentContainer} child
     * @param {mCore.geometry.Point} zeroPoint
     * @param {mCore.geometry.Point} outPoint
     */

    _getChildAnchor(child, zeroPoint, outPoint) {
        outPoint.copyFrom(Type.setValue(child.anchor, Type.setValue(child.pivot, zeroPoint)));
    },

    /**
     * @desc Returns max children dimensions.
     * @function
     * @private
     * @memberOf mCore.builder.layoutBuilder
     * @param {mCore.component.ui.ComLayout} component
     * @param {mCore.geometry.Point} outPoint
     */

    _getMaxChildrenDimensions: function (component, outPoint) {
        outPoint.set(0, 0);
        const tempPoint = Point.create(0, 0);
        component.iterateChildren(child => Geometry.pMax(outPoint, Geometry.pFromSize(child, tempPoint)));
    }
};
