import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamControllers, PropController } from "../../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { MeshController } from "../mesh_node/MeshNodeControllers";
import { AnimationNodeParams } from "./AnimationNode";

export class AnimationNodeControllers extends ParamControllers {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MeshController(registry, nodeObj);
        this.move = new StartFrameController(registry, nodeObj);
        this.speed = new EndFrameController(registry, nodeObj);
    }

    readonly mesh: MeshController;
    readonly startFrame: StartFrameController;
    readonly endFrame: EndFrameController;
}

export class StartFrameController extends PropController<string> {
    private nodeObj: NodeObj<AnimationNodeParams>;
    private tempVal: string;

    constructor(registry: Registry, nodeObj: NodeObj<AnimationNodeParams>) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    val() {
        return this.tempVal ? this.tempVal : this.nodeObj.param.startFrame.val;
    }

    change(val) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Canvas1);        
    }

    blur() {
        try {
            const val = parseFloat(this.tempVal);
            this.nodeObj.param.startFrame.val = val;
            this.tempVal = undefined;
        } finally {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.reRenderAll();
        }
    }
}

export class EndFrameController extends PropController<string> {
    private nodeObj: NodeObj<AnimationNodeParams>;
    private tempVal: string;

    constructor(registry: Registry, nodeObj: NodeObj<AnimationNodeParams>) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    val() {
        return this.tempVal ? this.tempVal : this.nodeObj.param.endFrame.val;
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Canvas1);        
    }

    blur() {
        try {
            const val = parseFloat(this.tempVal);
            this.nodeObj.param.endFrame.val = val;
            this.tempVal = undefined;
        } finally {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.reRenderAll();
        }
    }
}