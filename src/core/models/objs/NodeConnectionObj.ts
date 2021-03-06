import { IObj, ObjJson } from "./IObj";
import { NodeObj } from "./node_obj/NodeObj";
import { Registry } from "../../Registry";
import { Canvas3dPanel } from "../modules/Canvas3dPanel";

export const NodeConnectionObjType = 'node-connection-obj';

export interface NodeConnectionObjJson extends ObjJson {
    id: string;
    joinPoint1: string;
    node1Id: string;
    joinPoint2: string;
    node2Id: string
}

export class NodeConnectionObj implements IObj {
    objType = NodeConnectionObjType;
    id: string;
    name: string;
    joinPoint1: string;
    node1: NodeObj;
    joinPoint2: string;
    node2: NodeObj
    canvas: Canvas3dPanel;

    constructor(canvas: Canvas3dPanel) {
        this.canvas = canvas;
    }

    getOtherNode(node: NodeObj) {
        return node === this.node1 ? this.node2 : this.node1;
    }

    dispose() {}

    clone(): NodeConnectionObj {
        throw new Error('not implemented');
    }

    serialize(): NodeConnectionObjJson {
        return {
            id: this.id,
            name: this.name,
            objType: this.objType,
            joinPoint1: this.joinPoint1,
            node1Id: this.node1.id,
            joinPoint2: this.joinPoint2,
            node2Id: this.node2.id
        }
    }

    deserialize(json: NodeConnectionObjJson, registry: Registry) {
        this.id = json.id;
        this.name = json.name;
        this.joinPoint1 = json.joinPoint1;
        this.node1 = registry.data.scene.items.getById(json.node1Id) as NodeObj;
        this.joinPoint2 = json.joinPoint2;
        this.node2 = registry.data.scene.items.getById(json.node2Id) as NodeObj;
        return undefined;
    }
}