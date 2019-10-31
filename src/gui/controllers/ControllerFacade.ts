import { DefinitionController } from './DefinitionController';
import { RenderController } from './RenderController';
import { TextEditorController } from './TextEditorController';
import { WorldMapController } from './WorldMapController';
import { CanvasController } from './CanvasController';
import { defaultMeshDescriptors } from '../configs/DefaultMeshDescriptors';
import { WindowController } from './WindowController';

export class ControllerFacade {
    textEditorController: TextEditorController;
    worldMapController: WorldMapController;
    definitionController: DefinitionController;
    renderController: RenderController;
    canvasController: CanvasController;
    windowController: WindowController;

    constructor() {
        this.textEditorController = new TextEditorController(this);
        this.definitionController = new DefinitionController(this, defaultMeshDescriptors);
        this.renderController = new RenderController();
        this.worldMapController = new WorldMapController(this);
        this.canvasController = new CanvasController(this);
        this.windowController = new WindowController(this);
    }
}