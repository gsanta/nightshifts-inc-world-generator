import { Camera2D } from "../models/misc/camera/Camera2D";
import { AbstractCanvasPanel } from "./AbstractCanvasPanel";
import { ShapeStore } from '../stores/ShapeStore';

export abstract class Canvas2dPanel<D> extends AbstractCanvasPanel<D> {
    private viewStore: ShapeStore;

    setCamera(camera: Camera2D) {
        super.setCamera(camera);
    }

    setViewStore(viewStore: ShapeStore) {
        this.viewStore = viewStore;
    }

    getViewStore() {
        return this.viewStore;
    }
}