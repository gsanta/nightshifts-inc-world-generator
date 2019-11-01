import { BitmapEditor } from '../BitmapEditor';
import { Tool, ToolType } from './Tool';

export class DeleteTool implements Tool {
    type = ToolType.DELETE;
    private bitmapEditor: BitmapEditor;

    constructor(bitmapEditor: BitmapEditor) {
        this.bitmapEditor = bitmapEditor;
    }

    up() {
        this.bitmapEditor.pixelController.removePixel(this.bitmapEditor.mouseController.pointer);
        this.bitmapEditor.render();
    }
}