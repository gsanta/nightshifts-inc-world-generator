import { ChildView } from '../../../core/models/views/child_views/ChildView';
import { View } from '../../../core/models/views/View';
import { Registry } from '../../../core/Registry';
import { RenderTask } from "../../../core/services/RenderServices";
import { isView, isFeedback } from '../../../core/stores/SceneStore';
import { NodeEditorPlugin, NodeEditorPluginId } from '../../node_editor/NodeEditorPlugin';
import { SceneEditorPlugin, SceneEditorPluginId } from '../../scene_editor/SceneEditorPlugin';
import { AbstractTool } from "./AbstractTool";
import { ToolType } from "./Tool";
import { IPointerEvent } from '../../../core/services/input/PointerService';
import { AbstractPlugin } from '../../../core/AbstractPlugin';
import { UI_Region } from '../../../core/UI_Plugin';

export class PointerTool extends AbstractTool {
    protected movingItem: View = undefined;
    private isDragStart = true;

    constructor(toolType: ToolType, plugin: AbstractPlugin, registry: Registry) {
        super(toolType, plugin, registry);
    }

    click(): void {
        const hoveredItem = this.registry.services.pointer.hoveredItem;
        if (!hoveredItem) { return; }

        if (isFeedback(hoveredItem.viewType)) {
            const view = (<ChildView<any>> hoveredItem).parent;
            this.registry.stores.selectionStore.clear();
            this.registry.stores.selectionStore.addItem(view);
            this.registry.stores.selectionStore.addItem(hoveredItem);
            this.registry.services.render.scheduleRendering(this.plugin.region, UI_Region.Sidepanel);
        } else if (isView(hoveredItem.viewType)) {
            this.registry.stores.selectionStore.clear();
            this.registry.stores.selectionStore.addItem(hoveredItem);
            this.registry.services.render.scheduleRendering(this.plugin.region, UI_Region.Sidepanel);
        }
    }

    down() {

        this.initMove() &&  this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    drag(e: IPointerEvent) {
        super.drag(e);

        if (this.movingItem) {
            this.moveItems();
            this.registry.services.render.scheduleRendering(this.plugin.region);
        }
        
        this.isDragStart = false;
    }

    draggedUp() {
        super.draggedUp();

        if (!this.isDragStart) {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }

        this.isDragStart = true;
        
        this.updateDraggedView();
        this.movingItem = undefined;
        this.registry.services.level.updateCurrentLevel();
    }

    leave() {
        this.isDragStart = true;
        this.movingItem = undefined;
    }

    over(item: View) {
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    out(item: View) {
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    private initMove(): boolean {
        const hovered = this.registry.services.pointer.hoveredItem;
        this.movingItem = hovered;
        this.moveItems();
        return true;
    }

    private moveItems() {
        const views = this.registry.stores.selectionStore.getAllViews();

        if (isFeedback(this.movingItem.viewType)) {
            (<ChildView<any>> this.movingItem).move(this.registry.services.pointer.pointer.getDiff())
        } else if (isView(this.movingItem.viewType)) {
            views.forEach((item, index) => item.move(this.registry.services.pointer.pointer.getDiff()));
        }
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    private updateDraggedView() {
        const view = this.registry.plugins.getHoveredView();

        switch(view.id) {
            case SceneEditorPluginId:
                this.updateSceneViews();
                break;
            case NodeEditorPluginId:
                this.updateNodeEditorViews();
                break;
        }
    }

    private updateSceneViews() {
        let views: View[];

        if (isFeedback(this.movingItem.viewType)) {
            views = [(<ChildView<any>> this.movingItem).parent];
        } else {
            views = this.registry.stores.selectionStore.getAllViews();
        }
    }

    private updateNodeEditorViews() {

    }
}