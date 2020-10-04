import { AxisView, AxisViewType } from '../../../core/models/views/child_views/AxisView';
import { MeshView, MeshViewType } from '../../../core/models/views/MeshView';
import { PathView, PathViewType } from '../../../core/models/views/PathView';
import { SpriteViewType } from '../../../core/models/views/SpriteView';
import { ViewTag } from '../../../core/models/views/View';
import { RedoProp, UndoProp, ZoomInProp, ZoomOutProp } from '../../../core/plugin/AbstractCanvasPlugin';
import { Canvas_2d_Plugin } from '../../../core/plugin/Canvas_2d_Plugin';
import { ToolType } from '../../../core/plugin/tools/Tool';
import { Registry } from '../../../core/Registry';
import { activeToolId } from '../../../core/ui_components/elements/UI_Element';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { UI_SvgCanvas } from '../../../core/ui_components/elements/UI_SvgCanvas';
import { colors } from '../../../core/ui_components/react/styles';
import { sort } from '../../../utils/geometry/Functions';
import { toDegree } from '../../../utils/geometry/Measurements';
import { AxisToolType } from './tools/AxisTool';

export const SceneEditorPluginId = 'scene-editor-plugin'; 
export class SceneEditorPlugin extends Canvas_2d_Plugin {
    viewTypes: string[] = [MeshViewType, PathViewType, SpriteViewType];

    constructor(registry: Registry) {
        super(SceneEditorPluginId, registry);
    }

    getStore() {
        return this.registry.stores.viewStore;
    }

    destroy() { 
        this.registry.stores.viewStore.clearSelection();
    }

    protected renderInto(layout: UI_Layout): void {
        const canvas = layout.svgCanvas();

        const toolbar = canvas.toolbar();
        
        let tool = toolbar.tool(ToolType.Rectangle);
        tool.icon = 'mesh';
        let tooltip = tool.tooltip();
        tooltip.label = 'Add Mesh';

        tool = toolbar.tool(ToolType.Sprite);
        tool.icon = 'sprite';
        tooltip = tool.tooltip();
        tooltip.label = 'Add Sprite';

        let separator = toolbar.iconSeparator();
        separator.placement = 'left';

        tool = toolbar.tool(ToolType.Path);
        tool.icon = 'path';
        tooltip = tool.tooltip();
        tooltip.label = 'Path tool';

        tool = toolbar.tool(ToolType.Select);
        tool.icon = 'select';
        tooltip = tool.tooltip();
        tooltip.label = 'Select tool';

        tool = toolbar.tool(ToolType.Delete);
        tool.icon = 'delete';
        tooltip = tool.tooltip();
        tooltip.label = 'Delete tool';

        tool = toolbar.tool(ToolType.Camera);
        tool.icon = 'pan';
        tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        let actionIcon = toolbar.actionIcon({prop: ZoomInProp});
        actionIcon.icon = 'zoom-in';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom in';

        actionIcon = toolbar.actionIcon({prop: ZoomOutProp});
        actionIcon.icon = 'zoom-out';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom out';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        actionIcon = toolbar.actionIcon({prop: UndoProp});
        actionIcon.icon = 'undo';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Undo';

        actionIcon = toolbar.actionIcon({prop: RedoProp});
        actionIcon.icon = 'redo';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Redo';

        this.renderMeshViews(canvas);
        this.renderSpriteViews(canvas);
        this.renderPathViews(canvas);
    }

    private renderMeshViews(canvas: UI_SvgCanvas) {
        getSortedMeshViews(this.registry).map(meshView => {
            const group = canvas.group(meshView.id);
            group.data = meshView;

            const translation = `${meshView.getBounds().topLeft.x} ${meshView.getBounds().topLeft.y}`;
            const rotation = `${toDegree(meshView.getRotation())} ${meshView.getBounds().getWidth() / 2} ${meshView.getBounds().getHeight() / 2}`;
            group.transform = `translate(${translation}) rotate(${rotation})`;
            const rect = group.rect();
            rect.width = meshView.getBounds().getWidth();
            rect.height = meshView.getBounds().getHeight();

            rect.css = {
                strokeWidth: meshView.isSelected() ? '2' : '1'
            }    

            rect.strokeColor = meshView.tags.has(ViewTag.Selected) ? colors.views.highlight : 'black';

            let thumbnail: JSX.Element = null;
    
            if (meshView.thumbnailData) {
                const image = group.image();
                image.href = meshView.thumbnailData;
                image.width = meshView.getBounds().getWidth();
                image.height = meshView.getBounds().getHeight();
            }

            if (meshView.isSelected()) {
                this.renderAxisControl(canvas, meshView);
            }
    
            return thumbnail;
        });
    }

    private renderAxisControl(canvas: UI_SvgCanvas, meshView: MeshView) {
        let axisView: AxisView;

        if (meshView.isSelected()) {
            axisView = <AxisView> meshView.children.find(child => child.viewType === AxisViewType);
        }

        if (!axisView) {
            return;
        }

        const group = canvas.group(`y-control`);
        group.data = axisView;
        group.scopedToolId = AxisToolType;
        group.isInteractive = true;

        const center = axisView.getBounds().getBoundingCenter();
        const topLeft = axisView.getBounds().topLeft; 
        const botRight = axisView.getBounds().bottomRight; 

        const rect = group.rect();
        rect.x = topLeft.x;
        rect.y = topLeft.y;
        rect.width = axisView.getBounds().getWidth();
        rect.height = axisView.getBounds().getHeight();
        rect.css = {
            opacity: 0,
            fill: 'white',
            strokeWidth: '0'
        }

        const line = group.line();
        line.css = {
            pointerEvents: 'none',
            stroke: this.registry.preferences.colors.green,
            strokeWidth: "3"
        }

        line.x1 = center.x;
        line.y1 = axisView.getBounds().topLeft.y + 10;
        line.x2 = center.x;
        line.y2 = axisView.getBounds().bottomRight.y;

        const polygon = group.polygon();
        polygon.points = `${topLeft.x},${topLeft.y + 15} ${botRight.x},${topLeft.y + 15} ${center.x},${topLeft.y}`;
        polygon.css = {
            fill: this.registry.preferences.colors.green
        }
    }

    private renderSpriteViews(canvas: UI_SvgCanvas) {
        this.registry.stores.viewStore
            .getViewsByType(SpriteViewType)
            .forEach(spriteView => {
                const group = canvas.group(spriteView.id);
                group.data = spriteView;
                group.transform = `translate(${spriteView.getBounds().topLeft.x} ${spriteView.getBounds().topLeft.y})`;
                const rect = group.rect();
                rect.width = spriteView.getBounds().getWidth();
                rect.height = spriteView.getBounds().getHeight();
                rect.fillColor = 'green';

                rect.strokeColor = spriteView.tags.has(ViewTag.Selected) ? colors.views.highlight : 'black';
    
            });
    }

    private renderPathViews(canvas: UI_SvgCanvas) {
        this.registry.stores.viewStore
            .getViewsByType(PathViewType)
            .forEach((pathView: PathView) => {
                const group = canvas.group(pathView.id);
                group.isInteractive = false;

                if (pathView.children.length > 1) {
                    const highlightPath = group.path();
                    highlightPath.d = pathView.serializePath();
                    highlightPath.data = pathView;

                    highlightPath.css = {
                        fill: 'none',
                        stroke: 'blue',
                        strokeOpacity: pathView.isHovered() || pathView.isSelected() ? 0.5 : 0,
                        strokeWidth: "4"
                    }

                    const path = group.path();
                    path.d = pathView.serializePath();

                    path.css = {
                        fill: 'none',
                        stroke: 'black',
                        strokeWidth: "2",
                        pointerEvents: 'none'
                    }
                }

                pathView.children.forEach(editPoint => {
                    const circle = group.circle();

                    circle.cx = editPoint.point.x;
                    circle.cy = editPoint.point.y;
                    circle.r = pathView.radius;
                    circle.data = editPoint;

                    circle.css = {
                        fill: pathView.getActiveChild() === editPoint ? 'orange' : (pathView.isHovered() || pathView.isSelected()) ? 'blue' : 'black'
                    }
                })
            });
    }
}

function getSortedMeshViews(registry: Registry) {
    let items = <MeshView[]> [...registry.stores.viewStore.getViewsByType(MeshViewType)];
    return sort(items, (a, b) => a.layer - b.layer);
}