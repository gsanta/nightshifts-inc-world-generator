import { AbstractSettings } from "../../plugins/scene_editor/settings/AbstractSettings";
import { AbstractController } from '../../plugins/scene_editor/settings/AbstractController';


export enum UI_ElementType {
    Layout = 'Layout',
    Row = 'Row',
    Button = 'Button',
    TextField = 'TextField',

    Table = 'Table',
    TableRow = 'TableRow',
    TableColumn = 'TableColumn'
}

export class UI_Element {
    type: UI_ElementType;
    protected controller: AbstractController;
    prop: string;
    isBold: boolean;

    constructor(controller: AbstractController) {
        this.controller = controller;
    }

    setController(controller: AbstractController) {
        this.controller = controller;
    }
}

export abstract class UI_Container extends UI_Element {
    children: UI_Element[] = [];
}

export class UI_Layout extends UI_Container {
    type = UI_ElementType.Layout;
    
    row(): UI_Row {
        const row = new UI_Row(this.controller);
        this.children.push(row);

        return row;
    }
}

export class UI_Row extends UI_Layout {
    type = UI_ElementType.Row;

    table() {
        return new UI_Table(this.controller);
    }

    button(prop: string) {
        const button = new UI_Button(this.controller);
        button.prop = prop;

        this.children.push(button);

        return button;
    }

    textField(prop?: string) {
        const textField = new UI_TextField(this.controller);
        textField.prop = prop;

        this.children.push(textField);

        return textField;
    }
}

export class UI_Button extends UI_Element {
    type = UI_ElementType.Button;
    icon?: string;
    label: string;
}

export class UI_TextField extends UI_Element {
    type = UI_ElementType.TextField;

    setVal(newVal: string): void {
        this.controller.change(this.prop, newVal);
    }

    getVal(): any {
        return this.controller.getVal(this.prop);
    }
}



export class UI_Table extends UI_Container {
    type = UI_ElementType.Table;

    tableRow(isHeader = false) {
        const row = new UI_TableRow(this.controller);
        row.isHeader = isHeader;

        return row;
    }
}

export class UI_TableRow extends UI_Container {
    type = UI_ElementType.TableRow;
    isHeader: boolean = false;
    tableColumn() {
        return new UI_TableColumn(this.controller);
    }
}

export class UI_TableColumn extends UI_Container {
    type = UI_ElementType.TableColumn;
    isHeader: boolean = false;
}