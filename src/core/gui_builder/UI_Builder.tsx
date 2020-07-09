import { UI_Layout, UI_Container, UI_ElementType, UI_Element, UI_TextField, UI_Row, UI_Button } from './UI_Element';
import { RowGui, TextFieldGui } from './UI_ReactElements';
import * as React from 'react';
import { InputComponent } from "../gui/inputs/InputComponent";
import { TextFileAssetTask } from "babylonjs";
import { Registry } from '../Registry';
import { UI_Region } from '../UI_Plugin';
import { ButtonComp } from '../gui/inputs/ButtonComp';

export class UI_Builder {

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    build(region: UI_Region): JSX.Element | JSX.Element[] {
        const plugins = this.registry.services.plugin.findPluginsAtRegion(region);

        return plugins
            .map(plugin => plugin.render())
            .map(layout => this.buildContainer(layout));
    }

    // private buildRecuresively(container: UI_Container): JSX.Element {
    //     switch(container.type) {
    //         case UI_ElementType.Layout:
    //             const children = container.children.map(child => {
    //                 if ((child as UI_Container).children !== undefined) {

    //                 }
    //             }

    //             // return <div>${this.buildRecuresively()}</div>
    //     }

    // }

    private buildContainer(container: UI_Container): JSX.Element {
        const children = container.children.map(child => {
            if ((child as UI_Container).children !== undefined) {
                return this.buildContainer(child as UI_Container);
            } else {
                return this.buildLeaf(child);
            }
        });

        switch(container.type) {
            case UI_ElementType.Layout:
                return <div>{children}</div>;
            case UI_ElementType.Row:
                const row = container as UI_Row;
                return <RowGui element={row}>{children}</RowGui>;
        }
    }

    private buildLeaf(element: UI_Element): JSX.Element {
        switch(element.type) {
            case UI_ElementType.TextField:
                const textField = element as UI_TextField;
                return <TextFieldGui element={textField}/>;
            case UI_ElementType.Button:
                const button = element as UI_Button;
                return <ButtonComp element={button}/>;
        }
    }
}   