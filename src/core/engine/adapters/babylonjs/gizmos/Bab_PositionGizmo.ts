import { Mesh, PositionGizmo, UtilityLayerRenderer } from "babylonjs";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Bab_EngineFacade } from "../Bab_EngineFacade";
import { IBabylonGizmo } from "./IBabylonGizmo";

export const PositionGizmoType = 'position-gizmo';
export class Bab_PositionGizmo implements IBabylonGizmo {
    private engineFacade: Bab_EngineFacade;
    gizmoType = PositionGizmoType;

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
    }

    show(): void {
        throw new Error("Method not implemented.");
    }
    setPosition(point: Point) {
        throw new Error("Method not implemented.");
    }

    attachTo(mesh: Mesh) {
        var utilLayer = new UtilityLayerRenderer(this.engineFacade.scene);

        var gizmo = new PositionGizmo(utilLayer);
        gizmo.attachedMesh = mesh;
    
        gizmo.updateGizmoRotationToMatchAttachedMesh = false;
        gizmo.updateGizmoPositionToMatchAttachedMesh = true;
    }
}