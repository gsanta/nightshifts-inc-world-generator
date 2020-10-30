import { Registry } from '../Registry';
import { UI_Container } from '../ui_components/elements/UI_Container';
import { AbstractPluginImporter } from '../services/import/AbstractPluginImporter';
import { UI_Factory } from '../ui_components/UI_Factory';
import { IDataExporter } from '../services/export/IDataExporter';
import { FormController } from './controller/FormController';
import { ToolController } from './controller/ToolController';

export enum UI_Region {
    Sidepanel = 'Sidepanel',
    Dialog = 'Dialog',
    Canvas1 = 'Canvas1',
    Canvas2 = 'Canvas2'
}

export namespace UI_Region {
    let regions: UI_Region[];

    export function all() {
        if (regions) { return regions; }

        regions = [];
        for (let item in UI_Region) {
            if (isNaN(Number(item))) {
                regions.push(item as UI_Region);
            }
        }

        return regions;
    }

    export function isSinglePluginRegion(region: UI_Region) {
        switch(region) {
            case UI_Region.Canvas1:
            case UI_Region.Canvas2:
            case UI_Region.Dialog:
                return true;
            default:
                return false;
        }
    }
}

export abstract class UI_Panel {
    id: string;
    displayName: string;
    region: UI_Region;

    htmlElement: HTMLElement;

    importer: AbstractPluginImporter;
    exporter: IDataExporter;

    renderInto(layout: UI_Container): void {}

    getFormController(controllerId: string): FormController { return undefined; }
    addFormController(controllerId: string, controller: FormController): void {}
    getToolController(): ToolController { return undefined; }

    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    activated() {}
    mounted(htmlElement: HTMLElement) {
        this.htmlElement = htmlElement;
    }
    unmounted() {}

    // TODO should be temporary, port it to PointerService somehow
    over() {

    }
}