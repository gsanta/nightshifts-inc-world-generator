import { AbstractCanvasPlugin } from "../../../core/plugin/AbstractCanvasPlugin";
import { ToolController } from "../../../core/plugin/controller/ToolController";
import { UI_Controller } from "../../../core/plugin/controller/UI_Controller";
import { PluginFactory } from "../../../core/plugin/PluginFactory";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { SceneEditorPlugin, SceneEditorPluginId } from "./SceneEditorPlugin";
import { MeshTool } from "./tools/MeshTool";
import { PathTool } from "./tools/PathTool";
import { SpriteTool } from "./tools/SpriteTool";

export const SceneEditorToolControllerId = 'scene-editor-tool-controller'; 

export class SceneEditorPluginFactory implements PluginFactory {
    pluginId = SceneEditorPluginId;
    
    createPlugin(registry: Registry): UI_Plugin {
        return new SceneEditorPlugin(registry);
    }

    createControllers(plugin: UI_Plugin, registry: Registry): UI_Controller[] {
        const controller = new ToolController(SceneEditorToolControllerId, plugin as AbstractCanvasPlugin, registry);

        controller.registerTool(new MeshTool(plugin as AbstractCanvasPlugin, registry));
        controller.registerTool(new SpriteTool(plugin as AbstractCanvasPlugin, controller, registry));
        controller.registerTool(new PathTool(plugin as AbstractCanvasPlugin, controller, registry));
        controller.registerTool(new SelectTool(plugin as AbstractCanvasPlugin, controller, registry));
        controller.registerTool(new DeleteTool(plugin as AbstractCanvasPlugin, controller, registry));
        controller.registerTool(new CameraTool(plugin as AbstractCanvasPlugin, controller, registry));
        
        return [controller];
    }
}