import * as React from 'react';
import { Registry } from "../../../editor/Registry";
import { CanvasCamera } from "../../../editor/views/canvas/CanvasCamera";
import { CanvasView } from "../../../editor/views/canvas/CanvasView";
import { IViewExporter } from "./IViewExporter";

export class CanvasViewExporter implements IViewExporter {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }


    export(): JSX.Element {
        const canvasView = this.registry.services.view.getViewById(CanvasView.id);

        return (
            <g
                data-view-type={CanvasView.id}
                data-zoom={(canvasView.getCamera() as CanvasCamera).getScale()}
                data-translate={(canvasView.getCamera() as CanvasCamera).getTranslate().toString()}
            />
        )
    }
}