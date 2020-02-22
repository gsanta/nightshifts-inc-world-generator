import { Rectangle } from "../../../misc/geometry/shapes/Rectangle";
import { EventDispatcher } from "../../common/EventDispatcher";
import { Events } from '../../common/Events';
import { CanvasController } from "../CanvasController";
import { AbstractTool } from './AbstractTool';
import { ToolType } from './Tool';

export class MoveTool extends AbstractTool {
    private eventDispatcher: EventDispatcher;
    private controller: CanvasController;

    private origDimensions: Rectangle[] = [];

    constructor(controller: CanvasController, eventDispatcher: EventDispatcher) {
        super(ToolType.MOVE);
        this.eventDispatcher = eventDispatcher;
        this.controller = controller;
    }

    down() {
        super.down();

        const canvasStore = this.controller.viewStore;

        const selectedItems = canvasStore.getSelectedViews();
        this.origDimensions = [];

        if (selectedItems.length) {
            this.origDimensions = selectedItems.map(item => item.dimensions);
            return true;
        }

        return false;
    }

    drag() {
        super.drag();
        const canvasStore = this.controller.viewStore;
        
        const selectedItems = canvasStore.getSelectedViews();
        const mouseDelta = this.controller.pointer.pointer.getDownDiff();

        selectedItems.forEach((item, index) => item.dimensions = this.origDimensions[index].translate(mouseDelta));

        this.controller.renderWindow();
    }

    up() {
        super.up();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}