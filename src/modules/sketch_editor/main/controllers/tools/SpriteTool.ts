import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
import { RectangleTool } from "../../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { ShapeStore } from "../../../../../core/stores/ShapeStore";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { SpriteShapeType } from "../../models/shapes/SpriteShape";

export const SpriteToolId = 'sprite-tool';
export class SpriteTool extends RectangleTool<AbstractShape> {

    constructor(panel: Canvas2dPanel<AbstractShape>, viewStore: ShapeStore, registry: Registry) {
        super(SpriteToolId, panel, viewStore, registry);
    }

    protected createView(rect: Rectangle): AbstractShape {
        return this.canvas.getViewStore().getViewFactory(SpriteShapeType).instantiateOnCanvas(this.canvas, rect);
    }
    
    protected removeTmpView() {
        this.viewStore.removeShape(this.tmpView);
    }
}