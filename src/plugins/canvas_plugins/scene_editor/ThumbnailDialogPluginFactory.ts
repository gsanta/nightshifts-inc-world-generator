import { AbstractCanvasPlugin } from "../../../core/plugin/AbstractCanvasPlugin";
import { PropController } from "../../../core/plugin/controller/FormController";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { UI_Panel } from "../../../core/plugin/UI_Panel";
import { UI_PluginFactory } from "../../../core/plugin/UI_PluginFactory";
import { Registry } from "../../../core/Registry";
import { ThumbnailDialogPlugin, ThumbnailDialogPluginId } from "./ThumbnailDialogPlugin";
import { ClearThumbnailControl, ThumbnailCreateControl, ThumbnailUploadControl } from "./ThumbnailDialogProps";

export const ThumbnailToolControllerId = 'thumbnail-tool-controller';
export const ThumbnailFormControllerId = 'thumbnail-form-controller';

export class ThumbnailDialogPluginFactory implements UI_PluginFactory {
    pluginId = ThumbnailDialogPluginId;
    
    createPlugin(registry: Registry): UI_Panel {
        return new ThumbnailDialogPlugin(registry);
    }

    createPropControllers(): PropController[] {
        return [
            new ThumbnailCreateControl(),
            new ThumbnailUploadControl(),
            new ClearThumbnailControl()
        ];
    }

    createTools(plugin: UI_Panel, registry: Registry) {
        return [
            new CameraTool(plugin as AbstractCanvasPlugin, registry)
        ];
    }
}