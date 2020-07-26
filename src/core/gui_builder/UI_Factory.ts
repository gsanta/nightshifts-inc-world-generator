import { UI_Table, UI_TableRow } from './elements/UI_Table';
import { UI_Container } from './elements/UI_Container';
import { UI_Text } from "./elements/UI_Text";
import { UI_Button } from "./elements/UI_Button";
import { UI_Select } from "./elements/UI_Select";
import { UI_FileUpload } from "./elements/UI_FileUpload";
import { UI_TextField } from './elements/UI_TextField';
import { UI_GridSelect } from './elements/UI_GridSelect';
import { UI_SvgRect } from './elements/svg/UI_SvgRect';
import { UI_SvgCircle } from './elements/svg/UI_SvgCircle';
import { UI_SvgPath } from './elements/svg/UI_SvgPath';
import { UI_SvgImage } from './elements/svg/UI_SvgImage';
import { UI_SvgGroup } from './elements/svg/UI_SvgGroup';
import { UI_Tool } from './elements/toolbar/UI_Tool';
import { UI_Tooltip } from './elements/UI_Tooltip';
import { UI_Element } from './elements/UI_Element';
import { UI_Toolbar } from './elements/toolbar/UI_Toolbar';
import { UI_SvgCanvas } from './elements/UI_SvgCanvas';
import { UI_TableColumn } from "./elements/UI_TableColumn";
import { UI_Row } from './elements/UI_Row';

export class UI_Factory {
    static row(parent: UI_Container, config: { controllerId?: string}): UI_Row {
        const row = new UI_Row(parent.plugin);

        row.generateId(parent);
        parent.children.push(row);

        this.setController(parent, row, config);

        return row;
    }

    static svgCanvas(parent: UI_Container, config: { controllerId?: string}): UI_SvgCanvas {
        const svgCanvas = new UI_SvgCanvas(parent.plugin);
        parent.children.push(svgCanvas);

        svgCanvas.generateId(parent);
        this.setController(parent, svgCanvas, config);

        return svgCanvas;
    }

    static text(parent: UI_Container): UI_Text {
        const text = new UI_Text(parent.plugin);

        text.generateId(parent);
        parent.children.push(text);

        return text;
    }

    static button(parent: UI_Container, config: { controllerId?: string, prop: string}): UI_Button {
        const button = new UI_Button(parent.plugin);
        button.prop = config.prop;

        button.generateId(parent);
        this.setController(parent, button, config);

        parent.children.push(button);

        return button;
    }

    static select(parent: UI_Container, config: { controllerId?: string, valProp: string, listProp: string}) {
        const select = new UI_Select(parent.plugin);
        select.prop = config.valProp;
        select.listProp = config.listProp;

        select.generateId(parent);
        this.setController(parent, select, config);

        parent.children.push(select);

        return select;
    }

    static fileUpload(parent: UI_Container, config: { controllerId?: string, prop: string}): UI_FileUpload {
        const fileUpload = new UI_FileUpload(parent.plugin);
        fileUpload.prop = config.prop;

        fileUpload.generateId(parent);
        this.setController(parent, fileUpload, config);

        parent.children.push(fileUpload);

        return fileUpload;
    }


    static textField(parent: UI_Container, config: { controllerId?: string, prop: string}): UI_TextField {
        const textField = new UI_TextField(parent.plugin);
        textField.prop = config.prop;
        textField.type = 'text';

        textField.generateId(parent);
        this.setController(parent, textField, config);

        parent.children.push(textField);

        return textField;
    }

    static grid(parent: UI_Container, config: { controllerId?: string, prop: string, filledIndexProp?: string}): UI_GridSelect {
        const gridSelect = new UI_GridSelect(parent.plugin);
        gridSelect.prop = config.prop;
        gridSelect.filledIndexProp = config.filledIndexProp;

        gridSelect.generateId(parent);
        this.setController(parent, gridSelect, config);

        parent.children.push(gridSelect);

        return gridSelect;
    }


    ///////////////////////////////////////////// Svg /////////////////////////////////////////////


    static svgRect(parent: UI_Container, config: { controllerId?: string, prop?: string}): UI_SvgRect {
        const rect = new UI_SvgRect(parent.plugin);
        rect.prop = config.prop;

        rect.generateId(parent);
        this.setController(parent, rect, config);

        config.controllerId && (rect.controllerId = config.controllerId);
    
        parent.children.push(rect);
    
        return rect;
    }

    static svgCircle(parent: UI_Container, config: { controllerId?: string, prop?: string}): UI_SvgCircle {
        const circle = new UI_SvgCircle(parent.plugin);
        circle.prop = config.prop;

        circle.generateId(parent);
        this.setController(parent, circle, config);
    
        parent.children.push(circle);
    
        return circle;
    }

    static svgPath(parent: UI_Container, config: { controllerId?: string, prop?: string}): UI_SvgPath {
        const path = new UI_SvgPath(parent.plugin);
        path.prop = config.prop;

        path.generateId(parent);
        this.setController(parent, path, config);
    
        parent.children.push(path);
    
        return path;
    }

    static svgImage(parent: UI_Container, config: { controllerId?: string, prop?: string}): UI_SvgImage {
        const image = new UI_SvgImage(parent.plugin);
        image.prop = config.prop;
    
        image.generateId(parent);
        this.setController(parent, image, config);

        parent.children.push(image);
    
        return image;
    }

    static svgGroup(parent: UI_Container, config: { controllerId?: string, key: string}): UI_SvgGroup {
        const group = new UI_SvgGroup(parent.plugin);
        group.key = config.key;
        
        group.generateId(parent);
        this.setController(parent, group, config);

        parent.children.push(group);
        
        return group;
    }

    ///////////////////////////////////////////// Toolbar /////////////////////////////////////////////

    static toolbar(parent: UI_SvgCanvas): UI_Toolbar {
        const toolbar = new UI_Toolbar(parent.plugin);

        toolbar.generateId(parent);

        parent._toolbar = toolbar;

        return toolbar;
    }

    static tool(parent: UI_Toolbar, config: { controllerId: string }): UI_Tool {
        const tool = new UI_Tool(parent.plugin);

        this.setController(parent, tool, config);
        tool.generateId(parent);

        parent.tools.push(tool);

        return tool;
    }

    ///////////////////////////////////////////// Table /////////////////////////////////////////////

    static table(parent: UI_Container, config: { controllerId?: string}): UI_Table {
        const table = new UI_Table(parent.plugin);

        table.generateId(parent);
        this.setController(parent, table, config);

        parent.children.push(table);

        return table;
    }

    static tooltip(parent: UI_Tool, config: { anchorId?: string }): UI_Tooltip {
        const tooltip = new UI_Tooltip(parent.plugin);
        
        (config && config.anchorId) && (tooltip.anchorId = config.anchorId);

        parent._tooltip = tooltip;

        return tooltip;
    }

    static tableColumn(parent: UI_Container, config: { controllerId?: string}) {
        const column = new UI_TableColumn(parent.plugin);

        column.generateId(parent);
        this.setController(parent, column, config);

        parent.children.push(column);

        return column;
    }

    static tableRow(parent: UI_Table, config: {isHeader?: boolean, controllerId?: string}) {
        const row = new UI_TableRow(parent.plugin);
        row.isHeader = config.isHeader;

        this.setController(parent, row, config);
        row.generateId(parent);

        parent.children.push(row);

        return row;
    }

    private static setController(parent: UI_Element, current: UI_Element, config: {controllerId?: string}) {
        if (config && config.controllerId) {
            current.controllerId = config.controllerId;
        } else {
            current.controllerId = parent.controllerId;
        }
    }
}