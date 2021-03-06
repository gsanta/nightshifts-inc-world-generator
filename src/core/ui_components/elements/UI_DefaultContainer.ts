import { UI_Container } from './UI_Container';
import { UI_Factory } from '../UI_Factory';
import { UI_Text } from './UI_Text';
import { UI_Button } from './UI_Button';
import { UI_Row } from './UI_Row';
import { UI_ListItem } from './UI_ListItem';
import { UI_Box } from './UI_Box';
import { UI_Column } from './UI_Column';
import { UI_HtmlCanvas } from './UI_HtmlCanvas';
import { UI_Image } from './UI_Image';
import { UI_Icon } from './UI_Icon';
import { AbstractCanvasPanel } from '../../models/modules/AbstractCanvasPanel';
import { UI_ControlledElementConfig, UI_ElementConfig } from './UI_Element';
import { ParamController } from '../../controller/FormController';
import { TreeController } from './complex/tree/TreeController';
import { AbstractShape } from '../../../modules/graph_editor/main/models/shapes/AbstractShape';
import { AbstractScene } from 'babylonjs';

export class UI_DefaultContainer extends UI_Container {
    listItem(config: {key: string, dropTargetPlugin: AbstractCanvasPanel<AbstractShape>}): UI_ListItem {
        return UI_Factory.listItem(this, config);
    }

    row(config: UI_ElementConfig): UI_Row {
        return UI_Factory.row(this, config);
    }

    column(config: UI_ElementConfig): UI_Column {
        return UI_Factory.column(this, config);
    }

    box(config: UI_ElementConfig): UI_Box {
        return UI_Factory.box(this, config);
    }

    table() {
        return UI_Factory.table(this, {});
    }

    text(): UI_Text {
        return UI_Factory.text(this, {});
    }

    button(key: string): UI_Button {
        return UI_Factory.button(this, {key});
    }

    select(config: {key: string, target?: string}) {
        return UI_Factory.select(this, config);
    }

    popupMultiSelect(config: UI_ElementConfig & { anchorElementKey: string }) {
        return UI_Factory.popupMultiSelect(this, config);
    }

    fileUpload(key: string) {
        return UI_Factory.fileUpload(this, {key});
    }

    textField(config: {key: string, target?: string}) {
        return UI_Factory.textField(this, config);
    }

    checkbox(config: {key: string, target?: string}) {
        return UI_Factory.checkbox(this, config);
    }

    grid(config: {key: string, filledIndexProp?: string}) {
        return UI_Factory.grid(this, config);
    }

    accordion() {
        return UI_Factory.accordion(this, {});
    }

    htmlCanvas(config: UI_ElementConfig & { canvasPanel: AbstractCanvasPanel<AbstractShape> }): UI_HtmlCanvas {
        return UI_Factory.htmlCanvas(this, config);
    }

    image(config: UI_ElementConfig): UI_Image {
        return UI_Factory.image(this, config);
    }

    icon(config: UI_ElementConfig): UI_Icon {
        return UI_Factory.icon(this, config);
    }

    tree(config: UI_ControlledElementConfig<TreeController>) {
        return UI_Factory.tree(this, config);
    }
}