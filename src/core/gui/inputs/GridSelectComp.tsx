import * as React from 'react';
import { UI_GridSelect } from '../../gui_builder/elements/UI_GridSelect';
import { GridComponent } from '../misc/GridComponent';
import { UI_ComponentProps } from '../UI_ComponentProps';
import { LabeledInputComp } from './LabeledInputComp';
import './DropdownComponent.scss';

export const GridSelectComp = (props: UI_ComponentProps<UI_GridSelect>) => {

    let component = (
        <GridComponent
            isReversed={false}
            markedValues={props.element.filledIndexes()}
            value={props.element.val()}
            onChange={(val) => props.element.change(val)}
        />
    );

    if (props.element.label) {
        component = (
            <LabeledInputComp label={props.element.label} direction="horizontal">
                {component}
            </LabeledInputComp>
        );
    }


    return component;
}