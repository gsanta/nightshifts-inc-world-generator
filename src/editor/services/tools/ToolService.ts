import { ZoomTool } from "./ZoomTool";
import { ServiceLocator } from "../ServiceLocator";
import { Stores } from "../../stores/Stores";
import { DeleteTool } from "./DeleteTool";
import { PointerTool } from "./PointerTool";
import { ToolType } from "./Tool";
import { PathTool } from "./PathTool";
import { RectangleTool } from "./RectangleTool";
import { SelectTool } from "./SelectTool";
import { CameraRotationTool } from "./CameraRotationTool";
import { Registry } from "../../Registry";

export class ToolService {
    zoom: ZoomTool;
    delete: DeleteTool;
    pointer: PointerTool;
    path: PathTool;
    rectangle: RectangleTool;
    select: SelectTool;
    cameraRotate: CameraRotationTool;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.zoom = new ZoomTool(this.registry);
        this.delete = new DeleteTool(this.registry);
        this.pointer = new PointerTool(ToolType.Pointer, registry);
        this.path = new PathTool(this.registry);
        this.rectangle = new RectangleTool(this.registry);
        this.select = new SelectTool(this.registry);
        this.cameraRotate = new CameraRotationTool(this.registry);
    }
}