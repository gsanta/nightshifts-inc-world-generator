import { Point } from "../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { MeshObj } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { IMeshAdapter } from "../../IMeshAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";

export  class Wrap_Meshes implements IMeshAdapter {
    private registry: Registry;
    private engineFacade: Wrap_EngineFacade;

    constructor(registry: Registry, engineFacade: Wrap_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    setPosition(meshObj: MeshObj, pos: Point_3): void {
        this.registry.plugins.engineHooks.getMeshHooks().forEach(meshHook => meshHook.setPositionHook(meshObj, pos));
        this.engineFacade.engines.forEach(engine => engine.meshes.setPosition(meshObj, pos));
    }

    getPosition(meshObj: MeshObj): Point_3 {
        return this.getVal((index: number) => this.engineFacade.engines[index].meshes.getPosition(meshObj));
    }

    setScale(meshObj: MeshObj, point: Point_3) {
        this.engineFacade.engines.forEach(engine => engine.meshes.setScale(meshObj, point));
    } 

    getScale(meshObj: MeshObj): Point_3 {
        return this.getVal((index: number) => this.engineFacade.engines[index].meshes.getScale(meshObj));
    } 

    setColor(meshObj: MeshObj, color: string): void {
        this.engineFacade.engines.forEach(engine => engine.meshes.setColor(meshObj, color));
    }

    getColor(meshObj: MeshObj): string {
        return this.getVal((index: number) => this.engineFacade.engines[index].meshes.getColor(meshObj));
    }

    translate(meshObj: MeshObj, axis: 'x' | 'y' | 'z', amount: number, space: 'local' | 'global' = 'local'): void {
        this.engineFacade.engines.forEach(engine => engine.meshes.translate(meshObj, axis, amount, space));
    }

    setRotation(meshObj: MeshObj, rot: Point_3): void {
        this.engineFacade.engines.forEach(engine => engine.meshes.setRotation(meshObj, rot));
    }

    getRotation(meshObj: MeshObj): Point_3 {
        return this.getVal((index: number) => this.engineFacade.engines[index].meshes.getRotation(meshObj));
    }

    getDimensions(meshObj: MeshObj): Point {
        return this.getVal((index: number) => this.engineFacade.engines[index].meshes.getDimensions(meshObj));
    }

    async createInstance(meshObj: MeshObj): Promise<boolean> {
        for (let i = 0; i < this.engineFacade.engines.length; i++) {
            const ret = await this.engineFacade.engines[i].meshes.createInstance(meshObj);
            if (ret) { break; }
        }
        // this.engineFacade.engines.forEach(engine => engine.meshes.createInstance(meshObj));
        this.registry.plugins.engineHooks.getMeshHooks().forEach(meshHook => meshHook.hook_createInstance(meshObj));

        return true;
    }

    deleteInstance(meshObj: MeshObj) {
        this.engineFacade.engines.forEach(engine => engine.meshes.deleteInstance(meshObj));
    }

    createMaterial(meshObj: MeshObj) {
        this.engineFacade.engines.forEach(engine => engine.meshes.createMaterial(meshObj));
    }

    playAnimation(meshObj: MeshObj, startFrame: number, endFrame: number, repeat: boolean): boolean {
        return this.engineFacade.realEngine.meshes.playAnimation(meshObj, startFrame, endFrame, repeat);
    }

    private getVal<T>(callback: (index: number) => T): T {
        for (let i = 0; i < this.engineFacade.engines.length; i++) {
            const val = <T> callback(i);
            if (val !== undefined) {
                return val;
            }
        }
    }
}