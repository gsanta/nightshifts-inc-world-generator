import { ObjEventType } from "../../../core/models/ObjObservable";
import { MeshObj } from "../../../core/models/objs/MeshObj";
import { Registry } from "../../../core/Registry";
import { sceneAndGameViewRatio } from "../../../core/stores/ViewStore";
import { Point } from "../../../utils/geometry/shapes/Point";
import { MeshView } from "./models/views/MeshView";

export class SceneEditorSynchronizer {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    
        registry.data.scene.observable.add((eventData) => {

            switch(eventData.eventType) {
                case ObjEventType.PositionChanged:
                    this.syncPosition(<MeshObj> eventData.obj)
                break;
                case ObjEventType.ScaleChanged:
                    this.syncScale(<MeshObj> eventData.obj)
                break;
                case ObjEventType.RotationChanged:
                    this.syncRotation(<MeshObj> eventData.obj)
                break;
            }
        });
    }

    private syncPosition(obj: MeshObj) {
        const view = <MeshView> this.registry.data.view.scene.getByObjId(obj.id);

        const position = this.registry.engine.meshes.getPosition(obj);

        if (position) {
            const viewPos = new Point(position.x, -position.z).scale(sceneAndGameViewRatio);
            view.moveTo(viewPos);
            this.registry.services.render.reRenderAll();
        }
    }

    private syncScale(obj: MeshObj) {
        const view = <MeshView> this.registry.data.view.scene.getByObjId(obj.id);

        const dimensions = this.registry.engine.meshes.getDimensions(obj);

        if (dimensions) {
            view.getBounds().setWidth(dimensions.x);
            view.getBounds().setHeight(dimensions.y);
            this.registry.services.render.reRenderAll();
        }
    }

    private syncRotation(obj: MeshObj) {
        const view = <MeshView> this.registry.data.view.scene.getByObjId(obj.id);

        const rotation = this.registry.engine.meshes.getRotation(obj);
        
        if (rotation) {
            view.setRotation(rotation.y);
            this.registry.services.render.reRenderAll();
        }
    }
}