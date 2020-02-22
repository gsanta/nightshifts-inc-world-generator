import { Mesh } from 'babylonjs';
import { AbstractModelLoader } from '../../../../common/AbstractModelLoader';
import { GameFacade } from '../../../../game/GameFacade';
import { Controllers } from '../../Controllers';
import { Events } from "../../events/Events";
import { AbstractCanvasController, CanvasViewSettings } from '../AbstractCanvasController';
import { Tool } from '../canvas/tools/Tool';
import { ITagService } from '../ITagService';
import { IPointerService } from '../services/IPointerService';
import { MouseHandler } from '../services/MouseHandler';
import { EditorCamera } from './EditorCamera';
import { HelperMeshes } from './HelperMeshes';
import { RendererCameraTool } from './RendererCameraTool';
import { RendererPointerService } from './RendererPointerService';
import { WebglCanvasWriter } from './WebglCanvasImporter';
import { GameApi } from '../../../../game/GameApi';
(<any> window).earcut = require('earcut');

export class RendererController extends AbstractCanvasController {
    name = '3D View';
    static id = 'webgl-editor';
    visible = true;

    mouseHander: MouseHandler;

    writer: WebglCanvasWriter;
    modelLoader: AbstractModelLoader;
    tagService: ITagService;
    pointer: IPointerService;
    private helperMeshes: HelperMeshes;

    private canvas: HTMLCanvasElement;
    camera: EditorCamera;
    cameraTool: RendererCameraTool;
    activeTool: Tool;

    private renderCanvasFunc: () => void;
    meshes: Mesh[] = [];

    constructor(controllers: Controllers) {
        super(controllers);
        this.controllers = controllers;
        this.mouseHander = new MouseHandler(this);
        this.pointer = new RendererPointerService(this);
        this.updateCanvas = this.updateCanvas.bind(this);
        this.registerEvents();
    }

    getCamera(): EditorCamera {
        return this.cameraTool.getCamera();
    }

    registerEvents() {
        this.controllers.eventDispatcher.addEventListener(Events.CONTENT_CHANGED, this.updateCanvas);
        this.controllers.eventDispatcher.addEventListener(Events.CANVAS_ITEM_CHANGED, this.updateCanvas);
    }

    unregisterEvents() {
        this.controllers.eventDispatcher.removeEventListener(this.updateCanvas);
    }

    resize() {
        this.getGameFacade().gameEngine.engine.resize();
    }

    setup() {
        this.cameraTool = new RendererCameraTool(this, this.camera);
        this.writer = new WebglCanvasWriter(this, this.getGameFacade());

        this.updateCanvas();
    }

    updateCanvas() {
        this.clearCanvas();
        if (this.writer) {
            const file = this.controllers.svgCanvasController.reader.export();
            this.writer.import(file);
        }

        this.renderWindow();
    }


    getId(): string {
        return RendererController.id;
    }

    getActiveTool(): Tool {
        return this.activeTool;
    }

    setCanvasRenderer(renderFunc: () => void) {
        this.renderCanvasFunc = renderFunc;
    }

    renderWindow() {
        this.renderCanvasFunc();
    }

    setVisible(visible: boolean) {
        this.visible = visible;
        if (!this.visible) { this.controllers.svgCanvasController.setVisible(true);}
        this.controllers.render();
    }

    isVisible(): boolean {
        return this.visible;
    }

    activate(): void {}

    private clearCanvas() {
        this.getGameFacade().clear();
    }

    
    viewSettings: CanvasViewSettings = {
        initialSizePercent: 44,
        minSizePixel: 300
    }
}