import { Mesh, PointerEventTypes, PointerInfo } from "babylonjs";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { IPointerEvent, IPointerEventType } from "../../../controller/PointerHandler";
import { IEngineEventAdapter, IEnginePointerObservable } from "../../IEngineEventAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";


class Bab_PointerObservable implements IEnginePointerObservable {
    private observers: ((pointerEvent: IPointerEvent) => void)[] = []; 


    add(callback: (pointerEvent: IPointerEvent) => void) {
        this.observers.push(callback);
    }

    remove(callback: (pointerEvent: IPointerEvent) => void) {
        this.observers = this.observers.filter(observer => observer !== callback);
    }

    emit(pointerEvent: IPointerEvent) {
        this.observers.forEach(observer => observer(pointerEvent));
    }
}

export class Bab_EventAdapter implements IEngineEventAdapter {
    private engineFacade: Bab_EngineFacade;
    pointer: Bab_PointerObservable = new Bab_PointerObservable();

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;

        this.engineFacade.onReady(() => {
            this.adaptPointerEvents();
        });
    }
    
    private adaptPointerEvents() {
        this.engineFacade.scene.onPointerObservable.add((pointerInfo) => {
            switch(pointerInfo.type) {
                case PointerEventTypes.POINTERDOWN:
                    this.pointer.emit(this.convertToPointerEvent(pointerInfo, IPointerEventType.PointerDown));
                break;
                case PointerEventTypes.POINTERWHEEL:
                    this.pointer.emit(this.convertToPointerEvent(pointerInfo, IPointerEventType.PointerWheel));
                break;
                case PointerEventTypes.POINTERUP:
                    this.pointer.emit(this.convertToPointerEvent(pointerInfo, IPointerEventType.PointerUp));
                break;
                case PointerEventTypes.POINTERMOVE:
                    this.pointer.emit(this.convertToPointerEvent(pointerInfo, IPointerEventType.PointerMove));
                break;
            }
        });
    }

    emitPointerOverEvent(pickedItemId: string) {
        if (pickedItemId) {
            this.pointer.emit({eventType: IPointerEventType.PointerOver, pointers: [], pickedItemId: pickedItemId});
        }
    }

    emitPointerOutEvent(pickedItemId: string) {
        if (pickedItemId) {
            this.pointer.emit({eventType: IPointerEventType.PointerOut, pointers: [], pickedItemId: pickedItemId});
        }
    }

    private convertToPointerEvent(pointerInfo: PointerInfo, eventType: IPointerEventType): IPointerEvent {
        let pickedItemId: string = undefined;

        if (pointerInfo.pickInfo.pickedMesh) {
            const meshObj = this.engineFacade.meshes.meshToObj.get(<Mesh> pointerInfo.pickInfo.pickedMesh);

            if (meshObj) {
                pickedItemId = meshObj.id;
            }
        }
        
        return {
            eventType: eventType,
            pointers: [{id: 1, pos: new Point(pointerInfo.event.offsetX, pointerInfo.event.offsetY), isDown: false}],
            preventDefault: () => pointerInfo.event.preventDefault(),
            button: 'left',
            isAltDown: !!pointerInfo.event.altKey,
            isShiftDown: !!pointerInfo.event.shiftKey,
            isCtrlDown: !!pointerInfo.event.ctrlKey,
            isMetaDown: !!pointerInfo.event.metaKey,
            pickedItemId: pickedItemId
        };
    }
}