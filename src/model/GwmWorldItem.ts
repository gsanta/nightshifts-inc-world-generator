import { Polygon } from './Polygon';

/**
 * `GwmWorldItem` represents any distinguishable item in the parsed world (think of it as a mesh, e.g walls, rooms, creatures).
 */
export class GwmWorldItem<T = any> {
    public type: string;
    public name: string;
    public dimensions: Polygon;
    public additionalData: T;
    public children: GwmWorldItem[] = [];

    constructor(type: string, dimensions: Polygon, name: string, additionalData: T = null) {
        this.type = type;
        this.dimensions = dimensions;
        this.name = name;
        this.additionalData = additionalData;
    }

    public addChild(worldItem: GwmWorldItem) {
        this.children.push(worldItem);
    }
}