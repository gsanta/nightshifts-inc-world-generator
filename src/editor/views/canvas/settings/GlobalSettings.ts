import { CanvasView } from '../CanvasView';
import { AbstractSettings } from './AbstractSettings';
import { UpdateTask } from '../../../services/UpdateServices';
import { MeshConcept } from '../models/concepts/MeshConcept';
import { Stores } from '../../../stores/Stores';
import { ServiceLocator } from '../../../services/ServiceLocator';

export enum GlobalSettingsPropType {
    IMPORT_FILE = 'import file'
}

export class GlobalSettings extends AbstractSettings<GlobalSettingsPropType> {
    static type = 'global-settings';
    getName() { return GlobalSettings.type; }

    meshConcept: MeshConcept;

    private controller: CanvasView;
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;

    constructor(controller: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores) {
        super();
        this.controller = controller;
        this.getStores = getStores;
        this.getServices = getServices;
    }

    protected getProp(prop: GlobalSettingsPropType) {}

    protected setProp(val: any, prop: GlobalSettingsPropType) {
        switch (prop) {
            case GlobalSettingsPropType.IMPORT_FILE:
                this.getStores().canvasStore.clear();
                this.getStores().hoverStore.clear();
                this.getStores().selectionStore.clear();
                this.getServices().import.import(val.data)
        }
        this.getServices().update.runImmediately(UpdateTask.RepaintCanvas, UpdateTask.UpdateRenderer);
    }
}