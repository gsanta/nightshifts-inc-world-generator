import { Point } from "../../../core/geometry/shapes/Point";
import { isNodeConnectionControl, NodeConnectionControl } from "../../../core/models/controls/NodeConnectionControl";
import { Registry } from "../../../core/Registry";
import { IHotkeyEvent } from "../../../core/services/input/HotkeyService";
import { UpdateTask } from "../../../core/services/UpdateServices";
import { AbstractTool } from "./AbstractTool";
import { ToolType, Cursor } from './Tool';

export class JoinTool extends AbstractTool {
    start: Point;
    end: Point;
    startItem: NodeConnectionControl;
    endItem: NodeConnectionControl;
    cursor = Cursor.Crosshair;

    constructor(registry: Registry) {
        super(ToolType.Join, registry);
    }

    down() {
        this.start = this.registry.services.pointer.pointer.curr;
        this.startItem = <NodeConnectionControl> this.registry.services.pointer.hoveredItem;
        this.end = this.registry.services.pointer.pointer.curr;
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintActiveView);
    }

    click() {

    }

    drag() {
        this.end = this.registry.services.pointer.pointer.curr;
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintActiveView);
    }

    draggedUp() {
        this.registry.services.layout.getHoveredView().removePriorityTool(this);

        if (isNodeConnectionControl(this.registry.services.pointer.hoveredItem)) {
            const endItem = <NodeConnectionControl> this.registry.services.pointer.hoveredItem;
            this.registry.stores.actionStore.addConnection(this.startItem, endItem);
            this.start = undefined;
            this.end = undefined;
        }
    }

    out() {
        if (!this.registry.services.pointer.isDown) {
            this.registry.services.layout.getHoveredView().removePriorityTool(this);
        }
    }

    hotkey(event: IHotkeyEvent) {
        if (event.isHover && isNodeConnectionControl(this.registry.services.pointer.hoveredItem)) {
            this.registry.services.layout.getHoveredView().setPriorityTool(this);
            return true;
        }
        return false;
    }
}