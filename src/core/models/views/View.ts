import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { Point } from "../../../utils/geometry/shapes/Point";
import { IObj } from "../objs/IObj";
import { Registry } from "../../Registry";
import { ContainedView } from "./child_views/ChildView";
import { UI_Container } from "../../ui_components/elements/UI_Container";
import { AbstractCanvasPanel } from "../../plugin/AbstractCanvasPanel";
import { UI_SvgCanvas } from "../../ui_components/elements/UI_SvgCanvas";
import { IControlledModel } from "../../plugin/IControlledModel";
import { FormController } from "../../plugin/controller/FormController";
import { Canvas2dPanel } from "../../plugin/Canvas2dPanel";
import { ViewStore } from "../../stores/ViewStore";
import { IGameObj } from "../objs/IGameObj";

export interface ViewJson {
    id: string;
    type: string;
    dimensions: string;
    objId: string;
}

export enum ViewTag {
    Selected = 'Selected',
    Hovered = 'Hovered'
}

export interface AfterAllViewsDeserialized {
(): void;
}

export interface ViewFactory {
    instantiate(): View;
    instantiateOnCanvas(panel: Canvas2dPanel, dimensions: Rectangle, config?: any): View;
    instantiateOnSelection(parentView: View): void;
    instantiateFromJson(json: ViewJson): [View, AfterAllViewsDeserialized];
}

export abstract class ViewFactoryAdapter implements ViewFactory {
    instantiate() { return undefined; }
    instantiateOnCanvas(panel: Canvas2dPanel, dimensions: Rectangle, config?: any): View { return undefined; }
    instantiateOnSelection(parentView: View): void {  }
    instantiateFromJson(json: ViewJson) { return undefined; };
}

export interface ViewRenderer {
    renderInto(container: UI_SvgCanvas, view: View, panel: AbstractCanvasPanel);
}

export abstract class View implements IControlledModel {
    id: string;
    viewType: string;
    tags: Set<ViewTag> = new Set();
    layer: number = 10;

    containerView: View;
    containedViews: View[] = [];

    parentView: View;
    childViews: View[] = [];

    controller: FormController = undefined;
    renderer: ViewRenderer;
    store: ViewStore;

    protected obj: IObj;

    protected bounds: Rectangle;
    move(delta: Point): void {}

    private activeContainedView: View;

    abstract getObj(): IObj;
    abstract setObj(obj: IObj);

    isHovered() {
        return this.tags.has(ViewTag.Hovered);
    }

    isSelected() {
        return this.tags.has(ViewTag.Selected);
    }

    
    setActiveContainedView(containedview: ContainedView) {
        this.activeContainedView = containedview;
    }
    
    getActiveContainedView() {
        return this.activeContainedView;
    }

    isContainedView(): boolean {
        return !!this.containerView;
    }

    addContainedView(child: ContainedView) {
        this.containedViews.push(child);
        child.calcBounds();
    }

    deleteContainedView(child: View) {
        this.containedViews.splice(this.containedViews.indexOf(child), 1);    
    }

    setContainerView(parent: View) {
        this.containerView = parent;
    }

    getChildViews(): View[] {
        return this.childViews;
    }

    addChildView(view: View) {
        this.childViews.push(view);
    }

    removeChildView(view: View) {
        this.childViews.splice(this.childViews.indexOf(view), 1);
    }

    getParent(): View {
        return this.parentView;
    }

    setParent(view: View) {
        this.parentView = view;
    }

    removeParent() {
        this.parentView = undefined;
    }

    getScale() { return 1; }

    abstract getBounds(): Rectangle;
    abstract setBounds(rectangle: Rectangle): void;
    calcBounds(): void {}

    getYPos() { return undefined; }

    abstract dispose(): void;

    toJson(): ViewJson {
        return {
            id: this.id,
            type: this.viewType,
            dimensions: this.bounds ? this.bounds.toString() : undefined,
            objId: this.obj ? this.obj.id : (this.containerView && this.containerView.obj) ? this.containerView.obj.id : undefined
        };
    }

    fromJson(json: ViewJson, registry: Registry) {
        this.id = json.id;
        this.viewType = json.type;
        this.bounds = json.dimensions && Rectangle.fromString(json.dimensions);
        this.setObj(registry.stores.objStore.getById(json.objId));
    }
}

export function sortViewsByLayer(views: View[]): void {
    const layerSorter = (a: View, b: View) => b.layer - a.layer;

    views.sort(layerSorter);
}
