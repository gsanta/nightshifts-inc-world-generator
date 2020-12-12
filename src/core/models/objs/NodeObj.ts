import { INodeListener } from '../../../plugins/canvas_plugins/node_editor/node/INodeListener';
import { Registry } from '../../Registry';
import { AbstractNodeExecutor } from '../../services/node/INodeExecutor';
import { NodeGraph } from '../../services/node/NodeGraph';
import { IObj, ObjJson } from './IObj';
import { NodePortObj, NodePortObjJson } from './NodePortObj';

export const NodeObjType = 'node-obj';

export interface NodeObjJson extends ObjJson {
    type: string;
    params: NodeParamJson[];
    ports: NodePortObjJson[];
}

export enum NodeCategory {
    Input = 'Input',
    Boolean = 'Boolean',
    Default = 'Default'
}

export enum NodeParamRole {
    Port = 'Port',
    InputField = 'InputField',
    InputFieldWithPort = 'InputFieldWithPort',
    Hidden = 'Hidden'
}

export enum NodeParamField {
    TextField = 'TextField',
    NumberField = 'NumberField',
    List = 'List',
    Checkbox = 'Checkbox'
}

export enum NodePortType {
    Mesh = 'Mesh',
    Signal = 'Signal'
}

export enum PortDirection {
    Input = 'Input',
    Output = 'Output'
}
export enum PortDataFlow {
    Pull = 'Pull',
    Push = 'Push'
}

export interface PortConfig {
    direction: PortDirection;
    dataFlow: PortDataFlow;
    execute?: (nodeObj: NodeObj, registry: Registry) => void;
    listener?: INodeListener;
}

export interface NodeParamJson {
    name: string;
    val: any;
    field?: NodeParamField;
    port?: PortConfig;
}

export interface NodeParam {
    name: string;
    field?: NodeParamField;
    fieldDisabled?: boolean;
    port?: PortConfig;

    val?: any;
    getVal?();
    setVal?(val: string);

    toJson?(): NodeParamJson;
    fromJson?(json: NodeObjJson);
}

export namespace NodeParam {
    export function getStandaloneInputPorts(nodeObj: NodeObj): NodeParam[] {
        return NodeParam.getInputPorts(nodeObj).filter(param => !param.field);
    }
    
    export function getInputPorts(nodeObj: NodeObj): NodeParam[] {
        return nodeObj.getParams().filter(param => param.port && param.port.direction === PortDirection.Input);
    }

    export function getStandaloneOutputPorts(nodeObj: NodeObj): NodeParam[] {
        return NodeParam.getOutputPorts(nodeObj).filter(param => !param.field);
    }
    
    export function getOutputPorts(nodeObj: NodeObj): NodeParam[] {
        return nodeObj.getParams().filter(param => param.port && param.port.direction === PortDirection.Output);
    }

    export function getFieldParams(nodeObj: NodeObj): NodeParam[] {
        return nodeObj.getParams().filter(param => param.field);
    }

    export function isStandalonePort(param: NodeParam) {
        return param.port && !param.field;
    }

    export function isPort(param: NodeParam) {
        return param.port;
    }

    export function isFieldParam(param: NodeParam) {
        return param.field;
    }
}

export abstract class NodeParams {
    [id: string] : NodeParam;
}


/**
 * It should be implemented and passed to a {@link NodeObj} when some of the params of the {@link NodeObj} contains
 * a non-primitive value (e.g some custom object), so that it's serialization/deserialization can be done through this interface.
 */
export interface CustomNodeParamSerializer {
    /**
     * It will be called for every {@link NodeParam} in the {@link NodeObj}.
     * 
     *  @returns the serialized {@link NodeParam}, or for primitive values undefined can be returned and then the defult serializer will run.
     */
    serialize(param: NodeParam): NodeParamJson;
    /**
     * It will be called for every {@link NodeParamJson} when deserializing a {@link NodeObj}.
     * 
     *  @returns the deserialized {@link NodeParam}, or for primitive values undefined can be returned and then the defult deserializer will run.
     */
    deserialize(json: NodeParamJson): NodeParam;
}

export interface NodeObjConfig {
    displayName?: string;
    category?: string;
    customParamSerializer?: CustomNodeParamSerializer;
}

export class NodeObj<P extends NodeParams = any> implements IObj {
    id: string;
    objType = NodeObjType;
    type: string;
    displayName: string;
    category: string;
    color: string;

    readonly param: P;
    paramList: NodeParam[];

    isExecutionStopped = true;
    executor: AbstractNodeExecutor<any>;

    graph: NodeGraph;

    private ports: Map<string, NodePortObj> = new Map();

    private customParamSerializer: CustomNodeParamSerializer;

    constructor(nodeType: string, param: P, config?: NodeObjConfig) {
        this.type = nodeType;
        this.param = param;
        this.initParams();
        if (config) {
            this.customParamSerializer = config.customParamSerializer;
            this.category = config.category || NodeCategory.Default;
            this.displayName = config.displayName || nodeType;
        }
    }

    execute() {
        this.executor && this.executor.execute();
    }

    startExecution() {
        this.executor && this.executor.executeStart && this.executor.executeStart();
    }

    stopExecution() {
        this.executor && this.executor.executeStart && this.executor.executeStop();
    }

    getParams(): NodeParam[] {
        return this.paramList;
    }

    getParam(name: string): NodeParam {
        return this.param[name];
    }

    setParam(name: string, value: any) {
        this.param[name].val = value;
    }

    getPort(portName: string): NodePortObj {
        return this.ports.get(portName);
    }

    getPorts(): NodePortObj[] {
        return Array.from(this.ports.values());
    }

    pullData(portName: string): any {
        // TODO check that port is input port
        if (this.getPort(portName).hasConnectedPort()) {
            return this.getPort(portName).getConnectedPort().getNodeParam().val;
        }
    }

    dispose() {
        this.getPorts().forEach(portObj => portObj.dispose());
    }

    clone(): NodeObj {
        throw new Error('not implemented');
    }

    serialize(): NodeObjJson {
        const params = this.getParams().map(param => {
            return this.customParamSerializer && this.customParamSerializer.serialize(param) || defaultNodeParamSerializer(param);
        });

        const portJsons = this.getPorts().map(port => {
            let portJson: NodePortObjJson = { name: port.getNodeParam().name };

            if (port.hasConnectedPort()) {
                portJson.connectedObjId = port.getConnectedPort().getNodeObj().id;
                portJson.connectedPortName = port.getConnectedPort().getNodeParam().name
            }

            return portJson;
        });

        return {
            id: this.id,
            objType: this.objType,
            type: this.type,
            params: params,
            ports: portJsons
        }
    }

    deserialize(json: NodeObjJson, registry: Registry): void {

        this.id = json.id;
        this.type = json.type;
        json.params.forEach(jsonParam => this.customParamSerializer && this.customParamSerializer.deserialize(jsonParam) || defaultNodeParamDeserializer(this, jsonParam));
        this.initParams();

        const portJsonMap: Map<string, NodePortObjJson> = new Map();
        json.ports.forEach(port => portJsonMap.set(port.name, port));

        this.getPorts().forEach(port => {
            const portJson = portJsonMap.get(port.getNodeParam().name);
            if (portJson.connectedObjId) {
                const connectedObj = <NodeObj> registry.stores.objStore.getById(portJson.connectedObjId);
                if (connectedObj) {
                    port.setConnectedPort(connectedObj.getPort(portJson.connectedPortName));
                }
            }
        });
    }

    initParams() {
        this.paramList = [];
        Object.entries(this.param).forEach(entry => this.paramList.push(entry[1]));

        const currentPorts = this.ports;
        this.ports = new Map();

        this.paramList.filter(param => param.port).forEach(port => {
            if (currentPorts.has(port.name)) {
                this.ports.set(port.name, currentPorts.get(port.name));
                currentPorts.delete(port.name);
            } else {
                this.ports.set(port.name, new NodePortObj(this, port))
            }
        });
        Array.from(currentPorts.values()).forEach(port => port.dispose());
    }
}

function defaultNodeParamSerializer(param: NodeParam): NodeParamJson {
    const json: NodeParamJson = {
        name: param.name,
        val: param.val,
        field: param.field,
    }

    if (param.field) {
        json.field = param.field;
    }

    if (param.port) {
        json.port = {
            direction: param.port.direction,
            dataFlow: param.port.dataFlow
        }
    }

    return json;
}

function defaultNodeParamDeserializer(nodeObj: NodeObj, json: NodeParamJson): void {
    let param: NodeParam;

    if (nodeObj.param[json.name]) {
        param = nodeObj.param[json.name];
        param.val = json.val;
    } else {
        param = { 
            name: json.name,
            val: json.val,
            field: json.field,
            port: json.port
        }
        nodeObj.param[json.name] = param;
    }
}