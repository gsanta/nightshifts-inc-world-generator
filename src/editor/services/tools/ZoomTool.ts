import { Stores } from '../../stores/Stores';
import { Hotkey } from "../input/HotkeyService";
import { ServiceLocator } from '../ServiceLocator';
import { UpdateTask } from '../UpdateServices';
import { AbstractTool } from './AbstractTool';
import { ToolType } from "./Tool";
import { HotkeyWheelZoomStart } from "./HotkeyWheelZoomStart";

export class ZoomTool extends AbstractTool {
    private hotkeys: Hotkey[] = [];

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.Zoom, getServices, getStores);
        this.getServices = getServices;
        this.getStores = getStores;

        this.hotkeys = [new HotkeyWheelZoomStart(getStores, getServices)];
        this.hotkeys.forEach(hk => this.getServices().hotkey.registerHotkey(hk));
    }

    wheel() {
        this.getStores().viewStore.getActiveView().getCamera().zoomWheel();
    }

    wheelEnd() {
        this.getStores().viewStore.getActiveView().removePriorityTool(this.getServices().tools.zoom);
    }

    drag() {
        super.drag();
        const camera = this.getStores().viewStore.getActiveView().getCamera();
        
        camera.pan(this.getServices().pointer.pointer);

        this.getServices().update.scheduleTasks(UpdateTask.RepaintCanvas);
    }
}