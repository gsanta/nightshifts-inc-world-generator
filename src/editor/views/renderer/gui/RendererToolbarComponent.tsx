import * as React from 'react';
import { PanIconComponent } from '../../../gui/icons/tools/PanIconComponent';
import { ZoomInIconComponent } from '../../../gui/icons/tools/ZoomInIconComponent';
import { ZoomOutIconComponent } from '../../../gui/icons/tools/ZoomOutIconComponent';
import { RendererView } from '../RendererView';
import { ToolType } from '../../../services/tools/Tool';
import { ZoomTool } from '../../../services/tools/ZoomTool';
import { AbstractToolbarComponent } from '../../AbstractToolbarComponent';

export class RendererToolbarComponent extends AbstractToolbarComponent {

    constructor(props: {}) {
        super(RendererView.id, props);
    }

    protected renderLeftToolGroup(): JSX.Element {
        return (
            <React.Fragment>
                <ZoomInIconComponent isActive={false} onClick={() => this.zoomIn()} format="short"/>
                <ZoomOutIconComponent isActive={false} onClick={() => this.zoomOut()} format="short"/>
                <PanIconComponent isActive={this.isToolActive(ToolType.Zoom)} onClick={() => null} format="short"/>
            </React.Fragment>
        )
    }

    protected renderRightToolGroup(): JSX.Element {
        return this.renderFullScreenIcon();
    }

    private zoomIn() {
        this.context.getServices().camera.zoomToNextStep();
    }

    private zoomOut() {
        this.context.getServices().camera.zoomToPrevStep();
    }

    private isToolActive(toolType: ToolType) {
        const view = this.context.getStores().viewStore.getViewById<RendererView>(RendererView.id);
        return view.getSelectedTool() && view.getSelectedTool().type === toolType;
    }
}