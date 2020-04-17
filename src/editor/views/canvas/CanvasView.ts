import { Point } from '../../../misc/geometry/shapes/Point';
import { Editor } from '../../Editor';
import { CanvasViewExporter } from '../../services/export/CanvasViewExporter';
import { IViewExporter } from '../../services/export/IViewExporter';
import { CanvasViewImporter } from '../../services/import/CanvasViewImporter';
import { IViewImporter } from '../../services/import/IViewImporter';
import { ServiceLocator } from '../../services/ServiceLocator';
import { ToolType } from '../../services/tools/Tool';
import { Stores } from '../../stores/Stores';
import { View } from '../View';
import { Camera, nullCamera } from './models/Camera';
import { LevelSettings } from './settings/LevelSettings';
import { MeshSettings } from './settings/MeshSettings';
import { PathSettings } from './settings/PathSettings';

export function cameraInitializer(canvasId: string) {
    if (typeof document !== 'undefined') {
        const svg: HTMLElement = document.getElementById(canvasId);

        if (svg) {
            const rect: ClientRect = svg.getBoundingClientRect();
            return new Camera(new Point(rect.width, rect.height));
        } else {
            return nullCamera;
        }
    } else {
        return nullCamera;
    }
}

function calcOffsetFromDom(bitmapEditorId: string): Point {
    if (typeof document !== 'undefined') {
        const editorElement: HTMLElement = document.getElementById(bitmapEditorId);
        if (editorElement) {
            const rect: ClientRect = editorElement.getBoundingClientRect();
            return new Point(rect.left - editorElement.scrollLeft, rect.top - editorElement.scrollTop);
        }
    }

    return new Point(0, 0);
}

export enum CanvasTag {
    Selected = 'selected',
    Hovered = 'hovered'
}

export class CanvasView extends View {
    static id = 'svg-canvas-controller';
    
    visible = true;
    
    exporter: IViewExporter;
    importer: IViewImporter;
    private camera: Camera = nullCamera;

    constructor(editor: Editor, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(editor, getServices, getStores);

        this.getStores().viewStore.setActiveView(this);

        this.selectedTool = this.getServices().tools.rectangle;

        this.settings = [
            new MeshSettings(this.getServices, this.getStores),
            new PathSettings(),
            new LevelSettings(this.getServices, this.getStores)
        ];

        this.exporter = new CanvasViewExporter(getStores);
        this.importer = new CanvasViewImporter(getStores);
    }

    getId() {
        return CanvasView.id;
    }

    resize(): void {
        this.getServices().tools.zoom.resize();
    };

    isVisible(): boolean {
        return this.visible;
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }

    getOffset() {
        return calcOffsetFromDom(this.getId());
    }

    getCamera() {
        if (this.camera === nullCamera) {
            this.camera = cameraInitializer(CanvasView.id);
        }
        return this.camera;
    }

    setCamera(camera: Camera) {
        this.camera = camera;
    }
}