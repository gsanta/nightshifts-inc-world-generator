import { NodeObj, NodeParam, BuiltinNodeType, NodeCategory } from "../../core/models/game_objects/NodeObj";
import { PropControl, AbstractController } from "../../core/plugins/controllers/AbstractController";
import { UI_InputElement } from "../../core/ui_components/elements/UI_InputElement";
import { NodeView } from "../../core/models/views/NodeView";
import { UI_Plugin, UI_Region } from "../../core/plugins/UI_Plugin";
import { Registry } from "../../core/Registry";
import { NodeGraph } from "../../core/services/node/NodeGraph";
import { ViewType } from "../../core/models/views/View";
import { NodeFactory } from "../../core/services/NodeService";

export const PathNodeFacotry: NodeFactory = {
    newNodeInstance(graph: NodeGraph): NodeObj {
        return new PathNodeObj(graph);
    },

    newControllerInstance(plugin: UI_Plugin, registry: Registry): AbstractController<any> {
        const controller = new AbstractController(plugin, registry);
        controller.registerPropControl('path', PathControl);
        return controller;
    }
}

export class PathNodeObj extends NodeObj {
    type = BuiltinNodeType.Path;
    category = NodeCategory.Default;

    params: NodeParam[] = [
        {
            name: 'path',
            val: '',
            inputType: 'list',
            valueType: 'string'
        }
    ];

    outputs = [
        {
            name: 'action'
        }
    ];
}

const PathControl: PropControl<string> = {
    values(context) {
        return context.registry.stores.canvasStore.getViewsByType(ViewType.PathView).map(pathView => pathView.id);
    },

    defaultVal(context, element: UI_InputElement) {
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
        return nodeView.obj.getParam('path').val;
    },

    change(val, context, element: UI_InputElement) {
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
        nodeView.obj.setParam('path', val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}