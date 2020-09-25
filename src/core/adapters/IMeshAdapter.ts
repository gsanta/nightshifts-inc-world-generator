import { MeshObj } from "../models/objs/MeshObj";
import { Point } from "../../utils/geometry/shapes/Point";

export interface IMeshAdapter {
    translate(meshObj: MeshObj, axis: 'x' | 'y' | 'z', amount: number, space?: 'local' | 'global'): void;
    rotate(meshObj: MeshObj, angle: number): void;
    getRotation(meshObj: MeshObj): number;
    setPosition(meshObj: MeshObj, pos: Point): void;
    getPosition(meshObj: MeshObj): Point;
    setScale(meshObj: MeshObj, point: Point); 
    getScale(meshObj: MeshObj): Point; 

    getDimensions(meshObj: MeshObj): Point;
    createInstance(meshObj: MeshObj): Promise<void>;
    deleteInstance(meshObj: MeshObj): void;

    createMaterial(meshObj: MeshObj);

    playAnimation(meshObj: MeshObj, startFrame: number, endFrame: number, repeat: boolean);
}