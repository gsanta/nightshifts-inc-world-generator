import { Point } from "../../../misc/geometry/shapes/Point";
import { ServiceLocator } from '../ServiceLocator';
import { Stores } from "../../stores/Stores";
import { MousePointer } from "./MouseService";
import { Concept } from "../../views/canvas/models/concepts/Concept";
import { Feedback } from "../../views/canvas/models/feedbacks/Feedback";
import { Registry } from "../../Registry";

export enum Wheel {
    IDLE = 'idle', UP = 'up', DOWN = 'down'
}

export interface IPointerEvent {
    pointers: {id: number, pos: Point, isDown: boolean}[];
    deltaY?: number;
    button: 'left' | 'right';
    isAltDown: boolean;
    isShiftDown: boolean;
    isCtrlDown: boolean;
    isMetaDown: boolean;
    preventDefault: () => void;
}

export class PointerService {
    serviceName = 'pointer-service';
    isDown = false;
    isDrag = false;
    wheel: Wheel = Wheel.IDLE;
    wheelState: number = 0;
    prevWheelState: number = 0;
    wheelDiff: number = undefined;

    pointer: MousePointer = new MousePointer();

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    pointerDown(e: IPointerEvent): void {
        if (e.button !== 'left') { return }
        console.log('pointer down')
        this.isDown = true;
        this.pointer.down = this.getCanvasPoint(e.pointers[0].pos); 
        this.pointer.downScreen = this.getScreenPoint(e.pointers[0].pos); 
        this.registry.stores.viewStore.getActiveView().getActiveTool().down();
        this.registry.services.update.runScheduledTasks();
    }

    pointerMove(e: IPointerEvent): void {
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getCanvasPoint(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPoint(e.pointers[0].pos);
        if (this.isDown && this.pointer.getDownDiff().len() > 2) {
            this.isDrag = true;
            this.registry.stores.viewStore.getActiveView().getActiveTool().drag();
        } else {
            this.registry.stores.viewStore.getActiveView().getActiveTool().move();
        }
        this.registry.services.hotkey.executePointerEvent(e);
        this.registry.services.update.runScheduledTasks();
    }

    pointerUp(e: IPointerEvent): void {
        if (this.isDrag) {
            this.registry.stores.viewStore.getActiveView().getActiveTool().draggedUp();
        } else {
            this.registry.stores.viewStore.getActiveView().getActiveTool().click();
        }
        
        this.registry.stores.viewStore.getActiveView().getActiveTool().up();
        this.isDown = false;
        this.isDrag = false;
        this.pointer.down = undefined;
        this.registry.services.update.runScheduledTasks();
    }

    pointerOut(e: IPointerEvent): void {
        this.isDown = false;
        this.isDrag = false;
    }

    pointerWheel(e: IPointerEvent): void {
        this.prevWheelState = this.wheelState;
        this.wheelState += e.deltaY;
        this.wheelDiff = this.wheelState - this.prevWheelState;

        if (e.deltaY < 0) {
            this.wheel = Wheel.UP;
        } else if (e.deltaY > 0) {
            this.wheel = Wheel.DOWN;
        } else {
            this.wheel = Wheel.IDLE;
        }

        this.registry.services.hotkey.executePointerEvent(e);
        this.registry.stores.viewStore.getActiveView().getActiveTool().wheel();
    }

    pointerWheelEnd() {
        this.wheel = Wheel.IDLE;

        this.registry.stores.viewStore.getActiveView().getActiveTool().wheelEnd();
    }

    hover(item: Concept | Feedback): void {
        this.registry.stores.viewStore.getActiveView().getActiveTool().over(item);
        this.registry.services.update.runScheduledTasks();
    }

    unhover(item: Concept | Feedback): void {
        this.registry.stores.viewStore.getActiveView().getActiveTool().out(item);
        this.registry.services.update.runScheduledTasks();
    }
    
    private getScreenPoint(point: Point): Point {
        const offset = this.registry.stores.viewStore.getActiveView().getOffset();
        return new Point(point.x - offset.x, point.y - offset.y);
    }
    
    private getCanvasPoint(point: Point): Point {
        const offset = this.registry.stores.viewStore.getActiveView().getOffset();
        return this.registry.stores.viewStore.getActiveView().getCamera().screenToCanvasPoint(new Point(point.x - offset.x, point.y - offset.y));
    }
}