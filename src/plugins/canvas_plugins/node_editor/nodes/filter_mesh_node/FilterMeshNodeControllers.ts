import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamControllers } from "../../../../../core/plugin/controller/FormController";
import { Registry } from "../../../../../core/Registry";
import { MultiMeshController } from "../mesh_node/MeshNodeControllers";

export class FilterMeshNodeControllers extends ParamControllers {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MultiMeshController(registry, nodeObj);
    }

    readonly mesh: MultiMeshController;
}