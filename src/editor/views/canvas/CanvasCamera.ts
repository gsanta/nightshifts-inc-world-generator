import { Point } from "../../../misc/geometry/shapes/Point";
import { Rectangle } from "../../../misc/geometry/shapes/Rectangle";
import { MousePointer } from "../../../core/services/input/MouseService";
import { ServiceLocator } from "../../../core/services/ServiceLocator";
import { UpdateTask } from "../../../core/services/UpdateServices";
import { ICamera } from '../renderer/ICamera';
import { Registry } from "../../Registry";

export class CanvasCamera implements ICamera {
    private screenSize: Point;
    private viewBox: Rectangle;
    serviceName = 'camera-service';
    static readonly ZOOM_MIN = 0.1;
    static readonly ZOOM_MAX = 5;

    readonly LOG_ZOOM_MIN = Math.log(CanvasCamera.ZOOM_MIN);
    readonly LOG_ZOOM_MAX = Math.log(CanvasCamera.ZOOM_MAX);
    readonly NUM_OF_STEPS: number = 100;
    private registry: Registry;

    constructor(registry: Registry, screenSize: Point) {
        this.registry = registry;
        this.screenSize = screenSize;
        this.viewBox = new Rectangle(new Point(0, 0), new Point(screenSize.x, screenSize.y));
    }

    resize(screenSize: Point) {
        const scale = this.getScale();
        this.screenSize = screenSize;
        const topLeft = this.viewBox.topLeft;
        this.setTopLeftCorner(topLeft, scale);
    }

    pan(pointer: MousePointer) {
        const delta = pointer.getScreenDiff().div(this.getScale());
        this.setViewBox(this.viewBox.clone().translate(new Point(-delta.x, -delta.y)));
    }

    private zoomToPosition(canvasPoint: Point, scale: number) {
        const screenPoint = this.canvasToScreenPoint(canvasPoint);
        const pointerRatio = new Point(screenPoint.x / this.screenSize.x, screenPoint.y / this.screenSize.y);


        this.setTopLeftCorner(canvasPoint, scale);
        const moveAmount = this.getRatioOfViewBox(this, pointerRatio).negate();
        this.setViewBox(this.viewBox.clone().translate(new Point(moveAmount.x, moveAmount.y)));

    }

    setTopLeftCorner(canvasPoint: Point, scale: number) {
        let width = this.screenSize.x / scale;
        let height = this.screenSize.y / scale;

        const topLeft = new Point(canvasPoint.x, canvasPoint.y);
        this.viewBox = new Rectangle(topLeft, new Point(topLeft.x + width, topLeft.y + height));
    }

    screenToCanvasPoint(screenPoint: Point): Point {
        const scale = this.getScale();

        return screenPoint.clone().div(scale).add(this.viewBox.topLeft);
    }

    canvasToScreenPoint(canvasPoint: Point): Point {
        const scale = this.getScale();

        return canvasPoint.clone().subtract(this.viewBox.topLeft).mul(scale);
    }

    getScale(): number {
        return this.screenSize.x / this.viewBox.getWidth();
    }

    getTranslate(): Point {
        return this.viewBox.topLeft;
    }

    getViewBoxAsString(): string {
        return `${this.viewBox.topLeft.x} ${this.viewBox.topLeft.y} ${this.viewBox.getWidth()} ${this.viewBox.getHeight()}`;
    }

    setViewBox(newViewBox: Rectangle): void {
        this.viewBox = newViewBox;
    }

    getCenterPoint(): Point {
        return this.screenSize.getVectorCenter()
    }

    private getRatioOfViewBox(camera: CanvasCamera, ratio: Point): Point {
        return camera.viewBox.getSize().mul(ratio.x, ratio.y);
    }

    zoomWheel() {
        const canvasPos = this.registry.services.pointer.pointer.curr;        
        let nextZoomLevel: number

        if (this.registry.services.pointer.prevWheelState - this.registry.services.pointer.wheelState > 0) {
            nextZoomLevel = this.getNextManualZoomStep();
        } else {
            nextZoomLevel = this.getPrevManualZoomLevel();
        }

        if (nextZoomLevel) {
            this.zoomToPosition(canvasPos, nextZoomLevel);

            this.registry.services.update.runImmediately(UpdateTask.RepaintCanvas);
        }
    }

    zoomIn() {
        const canvasPos = this.screenToCanvasPoint(this.getCenterPoint());

        const prevZoomLevel = this.getNextManualZoomStep();
        
        if (prevZoomLevel) {
            this.zoomToPosition(canvasPos, prevZoomLevel);

            this.registry.services.update.runImmediately(UpdateTask.RepaintCanvas);
        }
    }

    zoomOut() {
        const canvasPos = this.screenToCanvasPoint(this.getCenterPoint());

        const prevZoomLevel = this.getPrevManualZoomLevel();
        
        if (prevZoomLevel) {
            this.zoomToPosition(canvasPos, prevZoomLevel);

            this.registry.services.update.runImmediately(UpdateTask.RepaintCanvas);
        }
    }

    rotate(pointer: MousePointer): void { throw new Error("Rotation is for 3d cameras, this camera does not support it."); }

    private getNextManualZoomStep(): number {
        let currentStep = this.calcLogarithmicStep(this.getScale());
        currentStep = currentStep >= this.NUM_OF_STEPS - 1 ? this.NUM_OF_STEPS - 1 : currentStep

        return this.calcLogarithmicZoom(currentStep + 1);
    }

    private getPrevManualZoomLevel(): number {
        let currentStep = this.calcLogarithmicStep(this.getScale());
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