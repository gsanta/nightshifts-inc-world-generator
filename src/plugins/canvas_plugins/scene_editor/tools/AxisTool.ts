import { AxisViewType } from "../../../../core/models/views/child_views/AxisView";
import { MeshView } from "../../../../core/models/views/MeshView";
import { View } from "../../../../core/models/views/View";
import { AbstractCanvasPlugin } from "../../../../core/plugin/AbstractCanvasPlugin";
import { NullTool } from "../../../../core/plugin/tools/NullTool";
import { Cursor } from "../../../../core/plugin/tools/Tool";
import { Registry } from "../../../../core/Registry";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";

export const AxisToolType = 'axis-tool-type';

export class AxisTool extends NullTool {
    private downView: View;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(AxisToolType, plugin, registry);
    }

    over() {
        this.registry.plugins.getToolController(this.plugin.id).setPriorityTool(this.id);
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    out() {
        if (!this.downView) {
            this.registry.plugins.getToolController(this.plugin.id).removePriorityTool(this.id);
            this.registry.services.render.scheduleRendering(this.plugin.region);
        }
    }

    down() {
        if (this.registry.services.pointer.hoveredItem && this.registry.services.pointer.hoveredItem.viewType === AxisViewType) {
            this.downView = this.registry.services.pointer.hoveredItem;
        }
    }

    drag() {
        if (!this.downView) { return; }

        if (this.downView) {
            const parent = <MeshView> this.downView.parent;
            const objPos = parent.getObj().getPosition();
            const delta = this.registry.services.pointer.pointer.getDiff().y / 10;
            parent.getObj().setPosition(new Point_3(objPos.x, objPos.y + delta, objPos.z));
        }

        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    up() {
        this.downView = undefined;
        this.registry.plugins.getToolController(this.plugin.id).removePriorityTool(this.id);
    }

    getCursor() {
        return Cursor.N_Resize;
    }
}