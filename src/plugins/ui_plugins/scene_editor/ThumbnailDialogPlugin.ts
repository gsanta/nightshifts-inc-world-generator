import { activeToolId } from '../../../core/ui_components/elements/UI_Element';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { Canvas_3d_Plugin } from '../../../core/plugins/Canvas_3d_Plugin';
import { Registry } from '../../../core/Registry';
import { UI_Region } from '../../../core/plugins/UI_Plugin';
import { toolFactory } from '../../../core/plugins/tools/toolFactory';
import { ToolType } from '../../../core/plugins/tools/Tool';
import { PluginServices } from '../../../core/plugins/PluginServices';
import { MeshView } from '../../../core/models/views/MeshView';
import { ThumbnailMakerController, ThumbnailMakerControllerId, ThumbnailMakerControllerProps } from './ThumbnailMakerController';
import { UI_Dialog } from '../../../core/ui_components/elements/surfaces/UI_Dialog';
import { BabylonEngineFacade } from '../../../core/adapters/babylonjs/BabylonEngineFacade';

export const ThumbnailDialogPluginId = 'thumbnail-dialog-plugin'; 
export class ThumbnailDialogPlugin extends Canvas_3d_Plugin {
    region = UI_Region.Dialog;
    displayName = 'Thumbnail';

    constructor(registry: Registry) {
        super(ThumbnailDialogPluginId, registry);

        this.engine = new BabylonEngineFacade(this.registry);
        
        [ToolType.Camera]
        .map(toolType => {
            this.toolHandler.registerTool(toolFactory(toolType, this, registry));
        });

        this.controllers.set(ThumbnailMakerControllerId, new ThumbnailMakerController(this, registry));


        this.pluginServices = new PluginServices(
            [
            ]
        );
    }

    renderInto(layout: UI_Layout): UI_Layout {
        const meshView = this.registry.stores.selectionStore.getView() as MeshView;
        const dialog: UI_Dialog = <UI_Dialog> layout;
        dialog.width = '560px';
        layout.controllerId = ThumbnailMakerControllerId;

        let row = dialog.row({key: '1'});
        let text = row.text();
        text.text = 'Thumbnail from model';
        
        row = dialog.row({key: '2'});
        row.vAlign = 'center';

        const canvas = row.htmlCanvas({controllerId: activeToolId});
        canvas.width = '300px';
        canvas.height = '300px';

        const column = row.column({ key: 'column1' });
        const button = column.button(ThumbnailMakerControllerProps.ClearThumbnail);
        button.label = 'Clear thumbnail';

        const image = column.image({key: '1'});
        image.width = '200px';
        image.height = '200px';

        image.src = meshView.thumbnailData;
    
        // const column2 = tableRow.tableColumn();

        const toolbar = canvas.toolbar();
        
        let actionIcon = toolbar.actionIcon({controllerId: ThumbnailMakerControllerId, prop: ThumbnailMakerControllerProps.ThumbnailFromModel});
        actionIcon.icon = 'insert-photo';
        let tooltip = actionIcon.tooltip();
        tooltip.label = 'Create thumbnail';

        row = dialog.row({key: '3'});
        text = row.text();
        text.text = 'Thumbnail from file';

        row = dialog.row({key: '4'});

        const importModelButton = row.fileUpload(ThumbnailMakerControllerProps.ThumbnailFromFile);
        importModelButton.label = 'Import Thumbnail';
        importModelButton.icon = 'import-icon';
        importModelButton.width = 'full-width';

        return layout;
    }

    activated() {
        if (!this.toolHandler.getSelectedTool()) {
            this.toolHandler.setSelectedTool(ToolType.Camera);
        }
    }

    mounted(htmlElement: HTMLElement) {
        super.mounted(htmlElement);
        const meshView = this.registry.stores.selectionStore.getView() as MeshView;

        this.engine.setup(htmlElement.getElementsByTagName('canvas')[0]);

        setTimeout(() => {
            this.engine.meshLoader.createInstance(meshView.obj);
        }, 500);
    }

    unmounted() {
        (this.engine as BabylonEngineFacade).engine.dispose();
    }

    getStore() {
        return null;
    }
}