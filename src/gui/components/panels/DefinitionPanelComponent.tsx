import * as React from 'react';
import './DefinitionPanelComponent.scss';
import { ControllerFacade } from '../../controllers/ControllerFacade';
import { InputComponent } from '../forms/InputComponent';
import { CheckboxComponent } from '../forms/CheckboxComponent';
import { ButtonedInputComponent } from '../forms/ButtonedInputComponent';
import { LabeledComponent } from '../forms/LabeledComponent';
import { DropdownComponent } from '../forms/DropdownComponent';


export interface DefinitionPanelProps {
    services: ControllerFacade;
}

const chars = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

export class DefinitionPanelComponent extends React.Component<DefinitionPanelProps> {

    constructor(props: DefinitionPanelProps) {
        super(props);
        this.props.services.renderController.setRender(() => this.forceUpdate());
    }

    render() {
        const definitionService = this.props.services.definitionController;
        const meshDescriptors = this.props.services.definitionController.meshDescriptors;
        const selectedMeshDescriptor = this.props.services.definitionController.selectedMeshDescriptor;

        const names = meshDescriptors.map(def => (
            <div>
                <InputComponent 
                    type="text"
                    value={def.type} 
                    onFocus={(type: string) => definitionService.setSelectedDescriptorByType(type)}
                    onChange={() => null} placeholder="name"
                />
            </div>
        ));

        const char = selectedMeshDescriptor ? selectedMeshDescriptor.char : null;
        const isBorder = selectedMeshDescriptor ? selectedMeshDescriptor.isBorder : false;
        const model = selectedMeshDescriptor ? selectedMeshDescriptor.model : null;
        const shape = selectedMeshDescriptor ? selectedMeshDescriptor.shape : null;
        const scale = selectedMeshDescriptor ? selectedMeshDescriptor.scale : 1;
        const materials = selectedMeshDescriptor ? selectedMeshDescriptor.materials : [];

        return (
            <div className="definition-panel">
                <div className="names-column">
                    <div className="names-column-inner">
                        {names}
                    </div>
                </div>
                <div className="properties-column">
                    <div className="property-row">
                        <LabeledComponent label="Character" direction="horizontal">
                            <DropdownComponent
                                values={chars}
                                currentValue={char}
                                onChange={(char: string) => definitionService.setChar(char)}
                            />

                        </LabeledComponent>
                        <CheckboxComponent isSelected={isBorder} onChange={isSelected => definitionService.setIsBorder(isSelected)}/>
                    </div>
                    <div className="property-row">
                        <LabeledComponent label="Model file path" direction="vertical">
                            <InputComponent
                                type="text"
                                value={model} 
                                onFocus={(type: string) => definitionService.setSelectedDescriptorByType(type)}
                                onChange={() => null} placeholder="name"
                            />
                        </LabeledComponent>
                        <LabeledComponent label="Shape" direction="vertical">
                            <DropdownComponent
                                values={definitionService.shapes}
                                currentValue={shape}
                                onChange={(char: string) => definitionService.setShape(char)}
                            />
                        </LabeledComponent>
                    </div>
                    <div className="property-row">
                        <LabeledComponent label="Scale" direction="vertical">
                            <InputComponent
                                type="number"
                                value={scale} 
                                onFocus={(type: string) => definitionService.setSelectedDescriptorByType(type)}
                                onChange={() => null} placeholder="name"
                            />
                        </LabeledComponent>
                        <LabeledComponent label="Y translate" direction="vertical">
                            <InputComponent
                                type="number"
                                value={scale} 
                                onFocus={(type: string) => definitionService.setSelectedDescriptorByType(type)}
                                onChange={() => null} placeholder="name"
                            />
                        </LabeledComponent>
                    </div>
                    <div className="property-row">
                        {this.renderMaterials()}
                    </div>
                </div>
            </div>
        );
    }

    private renderMaterials() {
        const definitionController = this.props.services.definitionController;
        const selectedMeshDescriptor = definitionController.selectedMeshDescriptor;
        const materials = selectedMeshDescriptor ? selectedMeshDescriptor.materials : [];

        const materialElements = materials.map(material => {
            return (
                <div className="added-material">{material}</div>
            )
        });

        return (
            <div>
                <LabeledComponent label="Materials" direction="vertical">
                    <ButtonedInputComponent
                        type="text"
                        value={definitionController.tmpMaterial} 
                        onFocus={(type: string) => null}
                        onChange={val => definitionController.setTmpMaterial(val)} placeholder="name"
                        onButtonClick={() => definitionController.saveTmpMaterial()}
                    />
                </LabeledComponent>
                {materialElements}
            </div>
        )
    }
};