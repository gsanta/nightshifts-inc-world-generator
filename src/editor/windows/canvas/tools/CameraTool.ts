import { Point } from "../../../../misc/geometry/shapes/Point";
import { UpdateTask } from '../../../common/services/UpdateServices';
import { ServiceLocator } from '../../../ServiceLocator';
import { Stores } from '../../../Stores';
import { CanvasWindow } from '../CanvasWindow';
import { Camera } from '../models/Camera';
import { AbstractTool } from './AbstractTool';
import { ToolType } from "./Tool";
import { cameraInitializer } from "../models/CameraStore";

function ratioOfViewBox(camera: Camera, ratio: Point): Point {
    return camera.getViewBox().getSize().mul(ratio.x, ratio.y);
}

export class CameraTool extends AbstractTool {
    static readonly ZOOM_MIN = 0.1;
    static readonly ZOOM_MAX = 5;

    readonly LOG_ZOOM_MIN = Math.log(CameraTool.ZOOM_MIN);
    readonly LOG_ZOOM_MAX = Math.log(CameraTool.ZOOM_MAX);
    readonly NUM_OF_STEPS: number;

    private controller: CanvasWindow;
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(controller: CanvasWindow, getServices: () => ServiceLocator, getStores: () => Stores, numberOfSteps: number = 20) {
        super(ToolType.CAMERA);
        this.NUM_OF_STEPS = numberOfSteps;
        this.controller = controller;
        this.getServices = getServices;
        this.getStores = getStores;
    }

    resize() {
        const prevScale = this.getStores().cameraStore.getCamera().getScale(); 
        const prevTranslate = this.getStores().cameraStore.getCamera().getViewBox().topLeft; 
    
        this.getStores().cameraStore.setCamera(cameraInitializer(this.controller.getId()));
        this.getStores().cameraStore.getCamera().moveTo(prevTranslate);
        this.getStores().cameraStore.getCamera().zoom(prevScale);

        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    zoomToNextStep(canvasPos?: Point) {
        const camera = this.getStores().cameraStore.getCamera();
        canvasPos = canvasPos ? canvasPos : camera.screenToCanvasPoint(camera.screenSize.getVectorCenter());
        
        const screenPoint = camera.canvasToScreenPoint(canvasPos);
        const pointerRatio = new Point(screenPoint.x / camera.screenSize.x, screenPoint.y / camera.screenSize.y);
        const nextZoomLevel = this.getNextManualZoomStep();

        if (nextZoomLevel) {
            camera.setTopLeftCorner(canvasPos, nextZoomLevel);
            camera.moveBy(ratioOfViewBox(camera, pointerRatio).negate());

            this.getServices().updateService().runImmediately(UpdateTask.RepaintCanvas);
        }
    }

    zoomToPrevStep(canvasPos?: Point) {
        const camera = this.getStores().cameraStore.getCamera();
        canvasPos = canvasPos ? canvasPos : camera.screenToCanvasPoint(camera.screenSize.getVectorCenter());

        const screenPoint = camera.canvasToScreenPoint(canvasPos);
        const pointerRatio = new Point(screenPoint.x / camera.screenSize.x, screenPoint.y / camera.screenSize.y);
        const prevZoomLevel = this.getPrevManualZoomLevel();
        
        if (prevZoomLevel) {
            camera.setTopLeftCorner(canvasPos, prevZoomLevel);
            camera.moveBy(ratioOfViewBox(camera, pointerRatio).negate());

            this.getServices().updateService().runImmediately(UpdateTask.RepaintCanvas);
        }
    }

    down() {
        const update = super.down();

        return update;
    }

    drag() {
        super.drag();
        const camera = this.getStores().cameraStore.getCamera();

        const delta = this.controller.pointer.pointer.getScreenDiff().div(camera.getScale());
        
        camera.moveBy(delta.negate());

        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    private getNextManualZoomStep(): number {
        const camera = this.getStores().cameraStore.getCamera();

        let currentStep = this.calcLogarithmicStep(camera.getScale());
        currentStep = currentStep >= this.NUM_OF_STEPS - 1 ? this.NUM_OF_STEPS - 1 : currentStep

        return this.calcLogarithmicZoom(currentStep + 1);
    }

    private getPrevManualZoomLevel(): number {
        const camera = this.getStores().cameraStore.getCamera();

        let currentStep = this.calcLogarithmicStep(camera.getScale());
        currentStep = currentStep <= 1 ? 1 : currentStep

        return this.calcLogarithmicZoom(currentStep - 1);
    }

    private calcLogarithmicStep(currentZoom: number) {
        const logCurrZoom = Math.log(currentZoom);
        const logCurrSize = logCurrZoom - this.LOG_ZOOM_MIN;
        const logRange = this.LOG_ZOOM_MAX - this.LOG_ZOOM_MIN;

        const currentStep = logCurrSize * (this.NUM_OF_STEPS) / logRange;

        return currentStep;
    }

    private calcLogarithmicZoom(currentStep: number) {
        const logZoom = this.LOG_ZOOM_MIN + (this.LOG_ZOOM_MAX - this.LOG_ZOOM_MIN) * currentStep / (this.NUM_OF_STEPS);
        const zoom = Math.exp(logZoom);
        return zoom;
    }
}