import { SplitNode } from '../../../../core/models/views/nodes/SplitNode';
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { UpdateTask } from "../../../../core/services/UpdateServices";
import { ViewSettings } from "../../../scene_editor/settings/AbstractSettings";

export enum SplitNodeProps {
}
export class SplitNodeSettings extends ViewSettings<SplitNodeProps, NodeView> {
    static settingsName = 'turn-node-settings';
    getName() { return SplitNodeSettings.settingsName; }
    view: NodeView<SplitNode>;
    private registry: Registry;

    constructor(actionNodeConcept: NodeView<SplitNode>, registry: Registry) {
        super();
        this.view = actionNodeConcept;
        this.registry = registry;
    }

    protected getProp(prop: SplitNodeProps) {

    }

    protected setProp(val: any, prop: SplitNodeProps) {
        switch (prop) {
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
        this.registry.services.update.runImmediately(UpdateTask.RepaintActiveView);
    }
}