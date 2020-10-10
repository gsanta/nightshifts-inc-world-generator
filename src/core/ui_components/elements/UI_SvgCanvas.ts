import { UI_ElementType } from './UI_ElementType';
import { UI_SvgGroup } from './svg/UI_SvgGroup';
import { UI_Toolbar } from './toolbar/UI_Toolbar';
import { UI_Factory } from '../UI_Factory';
import { AbstractCanvasPlugin } from '../../plugin/AbstractCanvasPlugin';
import { UI_DropLayer } from './surfaces/canvases/UI_DropLayer';
import { Registry } from '../../Registry';
import { UI_GizmoLayer } from './gizmo/UI_GizmoLayer';

export class UI_SvgCanvas extends UI_SvgGroup {
    _toolbar: UI_Toolbar;
    _gizmoLayer: UI_GizmoLayer;
    _dropLayer: UI_DropLayer;

    elementType = UI_ElementType.SvgCanvas;
    width: string;
    height: string;

    mouseOver(registry: Registry, e: MouseEvent) {
        // super.mouseOver(e);
        (registry.plugins.getById(this.pluginId) as AbstractCanvasPlugin).over()
    }

    mouseOut(registry: Registry, e: MouseEvent) {
        // super.mouseOut(e);
        // (this.plugin as AbstractCanvasPlugin).out()
    }

    mouseEnter(registry: Registry, e: MouseEvent) {
        (registry.plugins.getById(this.pluginId) as AbstractCanvasPlugin).over()
    }

    mouseLeave(registry: Registry, e: MouseEvent) {
        (registry.plugins.getById(this.pluginId) as AbstractCanvasPlugin).out()
    }

    toolbar(): UI_Toolbar {
        return UI_Factory.toolbar(this, {});
    }

    dropLayer(config?: { prop: string}): UI_DropLayer {
        return UI_Factory.dropLayer(this, config);
    }

    gizmoLayer(config?: { prop: string}): UI_GizmoLayer {
        return UI_Factory.gizmoLayer(this, config);
    }
}
