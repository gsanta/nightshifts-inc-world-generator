import { AxisViewFactory } from "../models/views/child_views/AxisView";
import { ScaleViewFactory } from "../models/views/child_views/ScaleView";
import { MeshViewFactory } from "../models/views/MeshView";
import { NodeConnectionViewFactory } from "../models/views/NodeConnectionView";
import { NodeViewFactory } from "../models/views/NodeView";
import { PathViewFactory } from "../models/views/PathView";
import { SpriteViewFactory } from "../models/views/SpriteView";
import { View, ViewFactory, ViewRenderer } from "../models/views/View";
import { AbstractCanvasPlugin } from "../plugin/AbstractCanvasPlugin";
import { Registry } from "../Registry";
import { UI_SvgCanvas } from "../ui_components/elements/UI_SvgCanvas";
import { UI_Plugin } from '../plugin/UI_Plugin';

export class ViewService {
    private factoriesByType: Map<string, ViewFactory> = new Map();
    private renderers: Map<string, ViewRenderer> = new Map();
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.registerView(new MeshViewFactory());
        this.registerView(new SpriteViewFactory(this.registry));
        this.registerView(new PathViewFactory());
        this.registerView(new NodeViewFactory(this.registry));
        this.registerView(new NodeConnectionViewFactory());
        this.registerView(new AxisViewFactory(this.registry));
        this.registerView(new ScaleViewFactory(this.registry));
    }

    getRegisteredTypes(): string[] {
        return Array.from(this.factoriesByType.keys());
    }

    isRegistered(objType: string): boolean {
        return this.factoriesByType.has(objType);
    }

    registerView(viewFactory: ViewFactory) {
        this.factoriesByType.set(viewFactory.viewType, viewFactory);

        if (viewFactory.createRenderer) {
            this.renderers.set(viewFactory.viewType, viewFactory.createRenderer(this.registry)); 
        }
    }

    createView(viewType: string): View {
        if (!this.factoriesByType.has(viewType)) {
            throw new Error(`No factory for ViewType ${viewType} exists`);
        }

        const view = this.factoriesByType.get(viewType).newInstance();
        view.id = this.registry.stores.views.generateId(view);
        return view;
    }

    renderInto(canvas: UI_SvgCanvas, view: View, plugin: UI_Plugin) {
        if (this.renderers.get(view.viewType)) {
            this.renderers.get(view.viewType).renderInto(canvas, view, plugin);
        } else if (this.factoriesByType.get(view.viewType)) {
            this.factoriesByType.get(view.viewType).renderInto(canvas, view, plugin);
        }
    }
}