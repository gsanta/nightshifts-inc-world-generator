import { ControllerFacade } from "./ControllerFacade";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Color3 } from "babylonjs";
import { BabylonWorldGenerator } from "../../integrations/babylonjs/BabylonWorldGenerator";
import { WorldItem } from "../../WorldItem";
(<any> window).earcut = require('earcut');

export class CanvasController {
    private controllers: ControllerFacade;
    engine: Engine;
    private canvas: HTMLCanvasElement;
    private position: Vector3;
    private camera: ArcRotateCamera;

    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;

        this.position = new Vector3(0, 40, 20);
    }

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    }

    updateCanvas(worldMap: string) {
        const scene = new Scene(this.engine);

        const alpha = this.camera ? this.camera.alpha : 0;
        const beta = this.camera ? this.camera.beta : 0;
        const radius = this.camera ? this.camera.radius : 40;
        const target = this.camera ? this.camera.target : new Vector3(0, 0, 0);
        const position = this.camera ? this.camera.position : new Vector3(0, 40, 20);
        this.camera = new ArcRotateCamera("Camera", alpha, beta, radius, target, scene);

        this.camera.setPosition(position);
        this.camera.attachControl(this.canvas, true);

        const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
        light.diffuse = new Color3(1, 1, 1);
        light.intensity = 1

        const engine = this.engine;

        new BabylonWorldGenerator(scene).generate(worldMap, {
            convert(worldItem: WorldItem): any {
                if (worldItem.name === 'wall' && worldItem.children.length > 0) {
                    worldItem.meshTemplate.meshes[0].isVisible = false;
                }
            },
            addChildren(parent: any, children: any[]): void {},
            addBorders(item: any, borders: any[]): void {},
            done() {
                engine.runRenderLoop(() => scene.render());
            }
        });
    }
}