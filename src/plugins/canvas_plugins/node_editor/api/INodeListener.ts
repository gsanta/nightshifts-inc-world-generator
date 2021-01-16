import { NodeObj } from "../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam } from "../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../core/Registry";
import { IKeyboardEvent } from "../../../../core/services/input/KeyboardService";

export interface INodeListener {
    onBeforeRender?(nodeObj: NodeObj, registry: Registry): void;
    onKeyDown?(e: IKeyboardEvent, nodeObj: NodeObj, registry: Registry): void;
    onKeyUp?(e: IKeyboardEvent, nodeObj: NodeObj, registry: Registry): void;
    onNodeParamChange?(param: NodeParam): void;
    onInit?(): void;
}