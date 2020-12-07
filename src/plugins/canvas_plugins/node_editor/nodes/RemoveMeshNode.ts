import { NodeObj, NodeParam, NodeParamFieldType, NodeParams, NodeParamType } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { MeshViewType } from "../../scene_editor/views/MeshView";
import { AbstractNodeFactory } from "./AbstractNode";

export const RemoveMeshNodeType = 'remove-mesh-node-obj';

export class RemoveMeshNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RemoveMeshNodeType;
    displayName = 'Remove Mesh';
    category = 'Default';

    createView(): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.addParamController(new MeshController(nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        obj.executor = new RemoveMeshNodeExecutor(this.registry, obj);
        obj.param = new RemoveMeshNodeParams();

        return obj;
    }


    getParams(): NodeParam[] {
        return [
            {
                name: 'mesh',
                type: NodeParamType.InputFieldWithPort,
                fieldType: NodeParamFieldType.List,
                val: '',
                port: 'output'
            },
            {
                type: NodeParamType.Port,
                name: 'action',
                port: 'output'
            },
            {
                type: NodeParamType.Port,
                name: 'signal',
                port: 'input'
            }
        ];
    }
}

export class RemoveMeshNodeParams implements NodeParams {
    mesh = {
        name: 'mesh',
        type: NodeParamType.InputFieldWithPort,
        fieldType: NodeParamFieldType.List,
        val: '',
        port: 'output'
    }
    
    action = {
        name: 'action',
        type: NodeParamType.Port,
        port: 'output'
    }
    
    signal = {
        name: 'signal',
        type: NodeParamType.Port,
        port: 'input'
    }
}

export class MeshController extends PropController<string> {
    private nodeObj: NodeObj<RemoveMeshNodeParams>;

    constructor(nodeObj: NodeObj) {
        super();
        this.nodeObj = nodeObj;
    }

    acceptedProps() { return ['mesh']; }

    values(context: PropContext) {
        return context.registry.data.view.scene.getViewsByType(MeshViewType).map(meshView => meshView.id)
    }

    defaultVal() {
        return this.nodeObj.param.mesh.val;
    }

    change(val, context: PropContext) {
        this.nodeObj.param.mesh = val;
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class RemoveMeshNodeExecutor extends AbstractNodeExecutor<RemoveMeshNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const meshId = this.nodeObj.param.mesh.val;
        const meshView = this.registry.data.view.scene.getById(meshId);

        if (meshView) {
            this.registry.stores.objStore.removeObj(meshView.getObj());
        }
    }

    executeStop() {}
}