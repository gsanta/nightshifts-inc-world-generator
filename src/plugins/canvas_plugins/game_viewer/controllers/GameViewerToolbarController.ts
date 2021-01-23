import { AbstractCanvasPanel, InteractionMode, ZoomInController, ZoomOutController } from "../../../../core/plugin/AbstractCanvasPanel";
import { PropContext, ParamController } from "../../../../core/controller/FormController";
import { CommonToolController } from "../../../../core/controller/ToolController";
import { Registry } from "../../../../core/Registry";
import { UI_Element } from "../../../../core/ui_components/elements/UI_Element";
import { GameToolId } from "./tools/GameTool";
import { UIController } from "../../../../core/controller/UIController";
import { GameViewerModel } from "../GameViewerModel";
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { MeshObj, MeshObjType } from "../../../../core/models/objs/MeshObj";
import { _3DScaleTool } from "../../../../core/engine/adapters/babylonjs/tools/Bab_ScaleTool";
import { _3DRotationTool } from "../../../../core/engine/adapters/babylonjs/tools/Bab_RotationTool";
import { _3DMoveTool } from "../../../../core/engine/adapters/babylonjs/tools/Bab_MoveTool";

export enum GameViewerProps {
    Play = 'Play',
    Stop = 'Stop',
    EditMode = 'EditMode',
    ExecutionMode = 'ExecutionMode',
    ShowBoundingBoxes = 'ShowBoundingBoxes' 
}

export class GameViewerToolbarController extends UIController {

    constructor(registry: Registry, canvas: AbstractCanvasPanel<GameViewerModel>) {
        super();

        this.editMode = new EditModeController(registry);
        this.interactionMode = new InteractionModeController(registry);
        this.gameViewerTool = new GameViewerToolController(registry);
        this.commonTool = new CommonToolController(registry);
        this.zoomIn = new ZoomInController(registry);
        this.zoomOut = new ZoomOutController(registry);
        this.showBoundingBox = new ShowBoundingBoxController(registry, canvas);
        this.moveTool = new MoveToolController(registry, canvas);
        this.scaleTool = new ScaleToolController(registry, canvas);
        this.rotationTool = new RotationToolController(registry, canvas);
    }
    
    editMode: ParamController;
    interactionMode: ParamController;
    gameViewerTool: ParamController;
    commonTool: ParamController;
    zoomIn: ParamController;
    zoomOut: ParamController;
    showBoundingBox: ParamController;
    moveTool: ParamController;
    scaleTool: ParamController;
    rotationTool: ParamController;
}

export class PlayController extends ParamController {
    acceptedProps() { return [GameViewerProps.Play]; }

    click(context) {
        context.registry.stores.game.gameState = 'running';
        context.registry.services.render.reRender(context.plugin.region);
    }
}

class EditModeController extends ParamController {
    acceptedProps() { return [GameViewerProps.EditMode]; }

    click(context: PropContext, element: UI_Element) {
        (element.canvasPanel as AbstractCanvasPanel).interactionMode = InteractionMode.Edit;
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}

class InteractionModeController extends ParamController {
    acceptedProps() { return [GameViewerProps.ExecutionMode]; }

    click(context: PropContext, element: UI_Element) {
        (element.canvasPanel as AbstractCanvasPanel).interactionMode = InteractionMode.Execution;
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}

class GameViewerToolController extends ParamController<any> {
    acceptedProps() { return [GameToolId]; }

    click(context: PropContext, element: UI_Element) {
        element.canvasPanel.toolController.setSelectedTool(element.key);
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}

class ShowBoundingBoxController extends ParamController<boolean> {
    // acceptedProps() { return [GameToolId]; }
    canvas: AbstractCanvasPanel<GameViewerModel>;

    constructor(registry: Registry, canvas: AbstractCanvasPanel<GameViewerModel>) {
        super(registry);
        this.canvas = canvas;
    }

    click() {
        const show = !this.canvas.model.showBoundingBoxes;
        this.canvas.model.showBoundingBoxes = show;
        
        const meshObjs = <MeshObj[]> this.registry.stores.objStore.getObjsByType(MeshObjType);
        meshObjs.forEach(meshObj => this.registry.engine.meshes.showBoundingBoxes(meshObj, show));

        this.registry.services.render.reRender(UI_Region.Canvas2);
    }
}

class ScaleToolController extends ParamController<boolean> {
    canvas: AbstractCanvasPanel<GameViewerModel>;

    constructor(registry: Registry, canvas: AbstractCanvasPanel<GameViewerModel>) {
        super(registry);
        this.canvas = canvas;
    }

    click() {
        this.registry.engine.tools.selectTool(_3DScaleTool);
        this.canvas.model.selectedTool = _3DScaleTool;
        
        this.registry.services.render.reRender(UI_Region.Canvas2);
    }
}

class RotationToolController extends ParamController<boolean> {
    canvas: AbstractCanvasPanel<GameViewerModel>;

    constructor(registry: Registry, canvas: AbstractCanvasPanel<GameViewerModel>) {
        super(registry);
        this.canvas = canvas;
    }

    click() {
        this.registry.engine.tools.selectTool(_3DRotationTool);
        this.canvas.model.selectedTool = _3DRotationTool;
        
        this.registry.services.render.reRender(UI_Region.Canvas2);
    }
}

class MoveToolController extends ParamController<boolean> {
    canvas: AbstractCanvasPanel<GameViewerModel>;

    constructor(registry: Registry, canvas: AbstractCanvasPanel<GameViewerModel>) {
        super(registry);
        this.canvas = canvas;
    }

    click() {
        this.registry.engine.tools.selectTool(_3DMoveTool);
        this.canvas.model.selectedTool = _3DMoveTool;
        
        this.registry.services.render.reRender(UI_Region.Canvas2);
    }
}