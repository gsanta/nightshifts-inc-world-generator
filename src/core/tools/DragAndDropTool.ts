import { Registry } from '../Registry';
import { AbstractTool } from './AbstractTool';
import { Cursor, ToolType } from "./Tool";
import { UpdateTask } from '../services/UpdateServices';
import { ActionConcept } from '../models/concepts/ActionConcept';
import { Rectangle } from '../../misc/geometry/shapes/Rectangle';
import { Point } from '../../misc/geometry/shapes/Point';

export class DragAndDropTool extends AbstractTool {
    cursor = Cursor.Grab;

    isDragging = false;

    constructor(registry: Registry) {
        super(ToolType.DragAndDrop, registry);

    }

    select() {
        this.isDragging = true;
        this.registry.services.update.runImmediately(UpdateTask.RepaintActiveView);
    }

    deselect() {
        this.isDragging = false;
    }


    up() {
        this.isDragging = false;
        const action = new ActionConcept();
        action.id = 'action-0';
        const topLeft = this.registry.services.pointer.pointer.curr.clone();
        const bottomRight = topLeft.clone().add(new Point(200, 100));
        action.dimensions = new Rectangle(topLeft, bottomRight);
        this.registry.stores.actionStore.addAction(action);
        // this.registry.services.view.getHoveredView().removePriorityTool(this);
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintActiveView);
    }
}