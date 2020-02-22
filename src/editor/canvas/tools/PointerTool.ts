import { AbstractTool } from "./AbstractTool";
import { View, ViewType } from "../models/views/View";
import { CanvasController } from "../CanvasController";
import { ToolType } from "./Tool";
import { CanvasItemTag } from "../models/CanvasItem";
import { PathView } from "../models/views/PathView";

export class PointerTool extends AbstractTool {
    private controller: CanvasController;

    constructor(controller: CanvasController) {
        super(ToolType.POINTER);
        this.controller = controller;
    }

    click() {
        if (!super.click()) {
            let update = false;
            if (this.controller.viewStore.getSelectedViews().length > 0) {
                this.controller.viewStore.removeTag(this.controller.viewStore.getViews(), CanvasItemTag.SELECTED);
                update = true;
            }

            const hoveredView = this.controller.viewStore.getHoveredView()

            if (hoveredView) {
                this.controller.viewStore.addTag([hoveredView], CanvasItemTag.SELECTED);
                hoveredView.selectHoveredSubview();

                this.controller.renderToolbar();

                update = true;
            }
            return update;
        }

        return true;
    }

    move() {
        // if (!super.move()) {
        //     if (this.controller.viewStore.getHoveredView()) {
        //         this.updateSubviewHover(this.controller.viewStore.getHoveredView());
        //         return true;
        //     }
        //     return false;
        // }

        // return true;
        return false;
    }

    down() {
        if (!super.down()) {
            const hoveredView = this.controller.viewStore.getHoveredView();
            if (hoveredView) {
                hoveredView.selectHoveredSubview();
            }
        }

        return true;
    }

    over(item: View) {
        if (!super.over(item)) {
            this.controller.viewStore.addTag([item], CanvasItemTag.HOVERED);
            this.updateSubviewHover(item);
        }
        return true;
    }

    out(item: View) {
        if (!super.out(item)) {
            this.controller.viewStore.getHoveredView() && this.controller.viewStore.getHoveredView().removeSubviewHover();
            this.controller.viewStore.removeTagFromAll(CanvasItemTag.HOVERED);
        }

        return true;
    }

    private updateSubviewHover(item: View) {
        switch(item.viewType) {
            case ViewType.Path:
                (<PathView> item).updateSubviewHover(this.controller.pointer.pointer.curr);
                break;
        }
    }
}