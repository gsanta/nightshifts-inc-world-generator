import { Point } from '../../../../../misc/geometry/shapes/Point';
import { CanvasItemTag } from '../models/CanvasItem';
import { View } from '../../../../../common/views/View';
import { EditorFacade } from '../../../EditorFacade';
import { CanvasController } from '../CanvasController';

function calcOffsetFromDom(bitmapEditorId: string): Point {
    if (typeof document !== 'undefined') {
        const editorElement: HTMLElement = document.getElementById(bitmapEditorId);
        if (editorElement) {
            const rect: ClientRect = editorElement.getBoundingClientRect();
            return new Point(rect.left - editorElement.scrollLeft, rect.top - editorElement.scrollTop);
        }
    }

    return new Point(0, 0);
}

export class MousePointer {
    down: Point;
    curr: Point;
    prev: Point;

    currScreen: Point;
    prevScreen: Point;

    getDownDiff() {
        return this.curr.subtract(this.down);
    }

    getScreenDiff() {
        return this.prevScreen ? this.currScreen.subtract(this.prevScreen) : new Point(0, 0);
    }
}

export class MouseHandler {
    private controller: CanvasController;
    isDown = false;
    isDrag = false;

    pointer: MousePointer = new MousePointer();

    private calcOffset: (id: string) => Point;

    constructor(controller: CanvasController, calcOffset: (id: string) => Point = calcOffsetFromDom) {
        this.controller = controller;
        this.calcOffset = calcOffset;
    }

    onMouseDown(e: MouseEvent): void {
        this.isDown = true;
        this.pointer.down = this.getPointFromEvent(e); 
        this.controller.getActiveTool().down();
    }
    
    onMouseMove(e: MouseEvent): void {
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getPointFromEvent(e);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen = this.getScreenPointFromEvent(e);
        if (this.isDown) {
            this.isDrag = true;
            this.controller.getActiveTool().drag();
        }
    }    

    onMouseUp(e: MouseEvent): void {
        if (this.isDrag) {
            this.controller.getActiveTool().draggedUp();
        } else {
            this.controller.getActiveTool().click();
        }
        
        this.controller.getActiveTool().up();
        this.isDown = false;
        this.isDrag = false;
        this.pointer.down = undefined;
    }

    onMouseOut(e: MouseEvent): void {
        this.isDown = false;
        this.isDrag = false;
    }

    hover(item: View) {
        this.controller.viewStore.addTag([item], CanvasItemTag.HOVERED);
        this.controller.renderCanvas();
    }

    unhover() {
        this.controller.viewStore.removeTag(this.controller.viewStore.getViews(), CanvasItemTag.HOVERED);
        this.controller.renderCanvas();
    }

    private getPointFromEvent(e: MouseEvent): Point {
        const offset = this.calcOffset(this.controller.getId());
        const x: number = (e ? e.x - offset.x : 0);
        const y: number = (e ? e.y - offset.y : 0);
        return this.controller.cameraTool.getCamera().screenToCanvasPoint(new Point(x, y));
    }

    private getScreenPointFromEvent(e: MouseEvent): Point {
        const offset = this.calcOffset(this.controller.getId());
        const x: number = (e ? e.x - offset.x : 0);
        const y: number = (e ? e.y - offset.y : 0);
        return new Point(x, y);
    }
}