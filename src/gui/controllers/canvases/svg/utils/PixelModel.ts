import { Point } from '@nightshifts.inc/geometry';
import { Rectangle } from '../models/Rectangle';
import { SvgCanvasController } from '../SvgCanvasController';
import { SvgConfig } from '../models/SvgConfig';

export interface Pixel {
    type: string;
    index: number;
    isPreview: boolean;
}

export class PixelModel {
    bitMap: Map<number, Pixel> = new Map();
    pixels: Pixel[] = [];
    private bitmapConfig: SvgConfig;

    constructor(bitmapConfig: SvgConfig) {
        this.bitmapConfig = bitmapConfig;
    }

    addPixel(coordinate: Point, type: string, isPreview: boolean) {
        const index = this.getIndexAtCoordinate(coordinate);

        if (this.bitMap.has(index)) {
            this.removePixelAtIndex(index);
        }
        
        const pixel: Pixel = {
            type,
            index,
            isPreview
        }
        this.bitMap.set(index, pixel);
        this.pixels.push(pixel);
    }

    commitPreviews() {
        this.pixels.forEach(pixel => pixel.isPreview = false);
    }
    
    removePreviews() {
        const previews = this.pixels.filter(pixel => pixel.isPreview);
    
        previews.forEach(preview => this.bitMap.delete(preview.index));
        this.pixels = this.pixels.filter(pixel => !pixel.isPreview);
    }

    removePixelAtIndex(pixelIndex: number) {
        const pixel = this.bitMap.get(pixelIndex);
        if (pixel) {
            this.bitMap.delete(pixelIndex);
            this.pixels.splice(this.pixels.indexOf(pixel), 1);
        }
    }
    
    removePixelAtPoint(position: Point): void {
        const x = Math.floor(position.x / this.bitmapConfig.pixelSize);
        const y = Math.floor(position.y / this.bitmapConfig.pixelSize);
        const xDim = this.bitmapConfig.canvasDimensions.x / this.bitmapConfig.pixelSize;
        const pixelIndex = y * xDim + x;

        const pixel = this.bitMap.get(pixelIndex);
        if (pixel) {
            this.bitMap.delete(pixelIndex);
            this.pixels.splice(this.pixels.indexOf(pixel), 1);
        }
    }

    clear(): void {
        this.bitMap = new Map();
        this.pixels = [];
    }

    getPixelPosition(pixelIndex: number): Point {
        const canvasDimensions = this.bitmapConfig.canvasDimensions;
        const pixelSize = this.bitmapConfig.pixelSize;
        const xDim = canvasDimensions.x / pixelSize;

        const x = pixelIndex % xDim;
        const y = Math.floor(pixelIndex / xDim);
        
        return new Point(x, y);
    }

    getPixelsInside(rectangle: Rectangle): Pixel[] {
        const pixelSize = this.bitmapConfig.pixelSize;

        return this.pixels.filter(pixel => {
            const pixelPosition = this.getPixelPosition(pixel.index).mul(pixelSize);

            return pixelPosition.x > rectangle.topLeft.x &&
                pixelPosition.y > rectangle.topLeft.y &&
                pixelPosition.x + pixelSize < rectangle.bottomRight.x &&
                pixelPosition.y + pixelSize < rectangle.bottomRight.y
        });
    }

    getPixelAtCoordinate(coordinate: Point): Pixel {
        const index = this.getIndexAtCoordinate(coordinate);

        return this.bitMap.get(index);
    }

    private getIndexAtCoordinate(coordinate: Point): number {
        const canvasDimensions = this.bitmapConfig.canvasDimensions;
        const pixelSize = this.bitmapConfig.pixelSize;
        const xPixels = canvasDimensions.x / pixelSize;

        const xIndex = Math.floor(coordinate.x / pixelSize);
        const yIndex = Math.floor(coordinate.y / pixelSize);

        return yIndex * xPixels + xIndex;
    }
}