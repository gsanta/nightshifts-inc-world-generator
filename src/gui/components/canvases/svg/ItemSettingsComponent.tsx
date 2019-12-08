import * as React from 'react';
import { SvgCanvasController } from '../../../controllers/canvases/svg/SvgCanvasController';
import { CanvasItemSettings } from '../../../controllers/forms/CanvasItemSettingsForm';
import { ConnectedColorPicker } from '../../forms/ColorPicker';
import { LabeledComponent } from '../../forms/LabeledComponent';
import { PixelTag, FileData } from '../../../controllers/canvases/svg/models/PixelModel';
import styled from 'styled-components';
import { ConnectedDropdownComponent } from '../../forms/DropdownComponent';
import { WorldItemTypeProperty } from '../../../controllers/forms/WorldItemDefinitionForm';
import { ConnectedFileUploadComponent } from '../../forms/FileUploadComponent';

export interface ItemSettingsProps {
    canvasController: SvgCanvasController;
}

const ItemSettingsStyled = styled.div`
    padding: 10px;
`;

export class ItemSettingsComponent extends React.Component<ItemSettingsProps> {

    constructor(props: ItemSettingsProps) {
        super(props);

        this.props.canvasController.setSettingsRenderer(() => this.forceUpdate());
        this.props.canvasController.canvasItemSettingsForm.setRenderer(() => this.forceUpdate());
    }

    render(): JSX.Element {
        const selectedCanvasItems = PixelTag.getTaggedItems(PixelTag.SELECTED, this.props.canvasController.pixelModel.items);

        if (selectedCanvasItems.length === 0) { return null; }

        this.props.canvasController.canvasItemSettingsForm.canvasItem = selectedCanvasItems[0];

        const form = this.props.canvasController.canvasItemSettingsForm;

        return (
            <ItemSettingsStyled>
                <LabeledComponent label="Choose color" direction="horizontal">
                    <ConnectedColorPicker
                        formController={this.props.canvasController.canvasItemSettingsForm}
                        propertyName={CanvasItemSettings.COLOR}
                        propertyType='string'
                    />
                </LabeledComponent>
                {this.renderShapeDropdown()}
                {form.getVal(CanvasItemSettings.SHAPE) === 'model' ? this.renderModelFileChooser() : null}
            </ItemSettingsStyled>
        );
    }

    private renderShapeDropdown(): JSX.Element {
        const form = this.props.canvasController.canvasItemSettingsForm;

        return (
            <LabeledComponent label="Shape" direction="vertical">
                <ConnectedDropdownComponent
                    values={form.shapes}
                    currentValue={form.getVal(CanvasItemSettings.SHAPE) as string}
                    formController={form}
                    propertyName={WorldItemTypeProperty.SHAPE}
                    propertyType='string'
                />
            </LabeledComponent>
        );
    }

    private renderModelFileChooser(): JSX.Element {
        const form = this.props.canvasController.canvasItemSettingsForm;

        return (
            <React.Fragment>
                <LabeledComponent label="Model file" direction="vertical">
                    <ConnectedFileUploadComponent
                        formController={form}
                        propertyName={WorldItemTypeProperty.MODEL}
                        propertyType="file-data"
                    />
                </LabeledComponent>
                {form.getVal(CanvasItemSettings.MODEL) ? form.getVal<FileData>(CanvasItemSettings.MODEL).fileName : ''}
            </React.Fragment>
        );
    }
}