import { UI_ElementType } from './UI_ElementType';
import { UI_SvgGroup } from './svg/UI_SvgGroup';
import { UI_Toolbar } from './toolbar/UI_Toolbar';
import { UI_Factory } from '../UI_Factory';

export class UI_SvgCanvas extends UI_SvgGroup {
    private _toolbar: UI_Toolbar;

    elementType = UI_ElementType.SvgCanvas;


    toolbar(): UI_Toolbar {
        return UI_Factory.toolbar(this);
    }

    getToolbar(): UI_Toolbar {
        return this._toolbar;
    }
}
