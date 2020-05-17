import { VisualConcept } from '../../../core/models/concepts/VisualConcept';
import { Registry } from '../../../core/Registry';
import { UpdateTask } from '../../../core/services/UpdateServices';
import { isConcept, isControl } from '../../../core/stores/SceneStore';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './RectangleSelector';
import { ToolType, Cursor } from './Tool';
import { ChildView } from '../../../core/models/views/child_views/ChildView';
import { View } from '../../../core/models/views/View';

export class DeleteTool extends AbstractTool {
    private rectSelector: RectangleSelector;

    constructor(registry: Registry) {
        super(ToolType.Delete, registry);
        this.rectSelector = new RectangleSelector(registry);
    }

    drag() {
        this.rectSelector.updateRect(this.registry.services.pointer.pointer);
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    click() {
        this.registry.tools.pointer.click();
        const hoveredItem = this.registry.services.pointer.hoveredItem;

        if (!hoveredItem) { return; }

        if (isControl(hoveredItem.type)) {
            (<ChildView<any>> hoveredItem).delete();
        } else if (isConcept(hoveredItem.type)) {
            const deleteItems = hoveredItem.delete();
            deleteItems.forEach(item => this.getStore().removeItemById(item.id));
        }
        
        this.registry.services.level.updateCurrentLevel();
        this.registry.services.pointer.hoveredItem && this.registry.services.update.scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
    }

    
    draggedUp() {
        const views = this.getStore().getIntersectingItemsInRect(this.registry.stores.feedback.rectSelectFeedback.rect);
        const deleteItems: View[] = [];
        views.forEach(view => deleteItems.push(...view.delete()))
        deleteItems.forEach((item: VisualConcept) => this.getStore().removeItemById(item.id));

        this.rectSelector.finish();

        this.registry.services.level.updateCurrentLevel();
        this.registry.services.game.deleteConcepts(views);
        this.registry.services.update.scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
    }

    leave() {
        this.rectSelector.finish();
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    over(item: VisualConcept) {
        this.registry.tools.pointer.over(item);
    }

    out(item: VisualConcept) {
        this.registry.tools.pointer.out(item);
    }

    eraseAll() {
        const concepts = this.registry.stores.canvasStore.getAllConcepts();
        this.registry.services.game.deleteConcepts(concepts);
        this.registry.services.storage.clearAll();
        this.registry.stores.canvasStore.clear();
        this.registry.services.update.runImmediately(UpdateTask.All);
    }

    getCursor() {
        return this.registry.services.pointer.hoveredItem ? Cursor.Pointer : Cursor.Default;
    }
}