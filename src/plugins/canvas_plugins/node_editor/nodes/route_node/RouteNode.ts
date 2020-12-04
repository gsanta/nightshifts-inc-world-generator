import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { CustomNodeParamSerializer, NodePort, NodeObj, NodeParam, NodeParamJson } from "../../../../../core/models/objs/NodeObj";
import { PathObj } from "../../../../../core/models/objs/PathObj";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { PropContext, PropController } from '../../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { INodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { UI_Element } from "../../../../../core/ui_components/elements/UI_Element";
import { AbstractNodeFactory } from "../AbstractNode";
import { RouteWalker } from "./RouteWalker";

export const RouteNodeObjType = 'route-node-obj';

export class RouteNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RouteNodeObjType;
    displayName = 'Route';
    category = 'Default';

    createView(): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.addParamController(new SpeedControl(nodeView))
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        
        obj.addAllParams(this.getParams());
        obj.inputs = this.getInputLinks();
        obj.outputs = this.getOutputLinks();
        obj.executor = new RouteNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }

    private getParams(): NodeParam[] {
        return [
            {
                name: 'speed',
                val: 1,
                uiOptions: {
                    inputType: 'textField',
                    valueType: 'number'
                }
            },
            {
                name: 'routeWalker',
                val: undefined
            }
        ];
    }

    private getOutputLinks(): NodePort[] {
        return [
            {
                name: 'onStart'
            },
            {
                name: 'onTurnStart'
            },
            {
                name: 'onTurnEnd'
            },
            {
                name: 'onFinish'
            }
        ]
    }

    private getInputLinks(): NodePort[] {
        return [
            {
                name: 'mesh'
            },
            {
                name: 'path'
            }
        ];
    }
}

class RouteNodeSerializer implements CustomNodeParamSerializer {
    serialize(param: NodeParam): NodeParamJson {
        if (param.name === 'routeWalker') {
            return {
                name: 'routeWalker',
                val: undefined,
                isLink: 'none'
            }
        }
    }
    
    deserialize(json: NodeParamJson): NodeParam {
        return undefined;
    }
}

export class SpeedControl extends PropController<string> {
    private nodeView: NodeView;

    constructor(nodeView: NodeView) {
        super();
        this.nodeView = nodeView;
    }

    acceptedProps() { return ['speed']; }

    defaultVal(context: PropContext, element: UI_Element) {
        return this.nodeView.getObj().getParam('speed').val;
    }
    
    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur(context: PropContext, element) {
        const speed = context.getTempVal();
        context.clearTempVal();

        try {
            if (speed) {
                const speedNum = parseFloat(speed);
                this.nodeView.getObj().setParam('speed', speedNum);
            }
        } catch (e) {
            console.log(e);
        }

        const routeWalker = this.nodeView.getObj().getParam('routeWalker').val as RouteWalker;
        if (routeWalker) {
            routeWalker.setSpeed(this.nodeView.getObj().getParam('speed').val);
        }

        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}


export class RouteNodeExecutor implements INodeExecutor {
    private registry: Registry;
    private nodeObj: NodeObj;

    constructor(registry: Registry, nodeObj: NodeObj) {
        this.registry = registry;
        this.nodeObj = nodeObj;
    }

    execute() {
        const meshObj = this.getMeshObj(this.nodeObj, this.registry);
        const pathObj = this.getPathObj(this.nodeObj, this.registry);

        if (!meshObj || !pathObj) { return; }

        if (!this.nodeObj.getParam('routeWalker').val) {
            this.nodeObj.setParam('routeWalker', new RouteWalker(meshObj, pathObj));
        }

        const routeWalker = <RouteWalker> this.nodeObj.getParam('routeWalker').val;
        routeWalker.step();
    }

    executeStart() {
        const routeWalker = <RouteWalker> this.nodeObj.getParam('routeWalker').val;
        routeWalker && routeWalker.start();
    }

    private getMeshObj(nodeObj: NodeObj, registry: Registry): MeshObj {
        let meshParam = nodeObj.getConnection('mesh') && nodeObj.getConnection('mesh')[0].getParam('mesh');

        if (meshParam) {
            return <MeshObj> registry.data.view.node.getById(meshParam.val)?.getObj();
        }
    }

    private getPathObj(nodeObj: NodeObj, registry: Registry): PathObj {
        let pathParam = nodeObj.getConnection('path') && nodeObj.getConnection('path')[0].getParam('path');

        if (pathParam) {
            return <PathObj> registry.data.view.node.getById(pathParam.val)?.getObj();
        }
    }
}