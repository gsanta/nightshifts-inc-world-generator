import { Scene, Engine, ArcRotateCamera, Vector3, HemisphericLight, Color3 } from 'babylonjs';
import { BabylonWorldGenerator } from '../BabylonWorldGenerator';
(<any> window).earcut = require('earcut');
// const strWorld = require('../../../../assets/test/babylonjs_demo.gwm').default;

// const strWorld = require('raw-loader!../../../../assets/test/demo_world.gwm');
// import strWorld from 'raw-loader!../../../../assets/test/demo_world.gwm';
import { MeshDescriptor } from '../../../Config';
import { WorldConfig } from '../../../services/ImporterService';
import { WorldItem } from '../../../WorldItem';
import { meshDescriptors } from '../../../../test/setup/meshDescriptors';

/*
WWWWWWWWWIIWWWWWWWWWWWWWWWWW
W--------------------------W
W--------------------------W
W--------------------------W
W--------------------------W
W--------------------------W
W--------------------------W
W--------------------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWW

*/

const strWorld = `map \`

WWWWWWWWWIIWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W-------------------------------W-------------------W
W-------------------------------W-------------------W
W-------------------------------W-------------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W---------------------------------------------------W
W---------------------------------------------------W
W---------------------------------------------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WEEEEE-----OOOOO-------------TTTTTWLLLLLL-----------W
WEEEEE-----OOOOO-------------TTTTTWLLLLLL-----------W
W--------XX----TTT----------------D-----------------I
W--------XX----TTT----------------D-----------------I
W---------------------------------W-----------------W
WWWWIIIIWWWWWWWWWWWWWDDDWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

\`


definitions \`

W = wall
- = empty
X = player
D = disc
C = cupboard
I = window
T = table
B = bathtub
S = washbasin
E = bed
H = chair
D = door
L = double_bed
O = shelves

\`

`

export class BabylonjsDemo {
    public setupDemo(canvas: HTMLCanvasElement): void {

        const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
        const scene = new Scene(engine);
        const camera = new ArcRotateCamera("Camera", 0, 0, 40, new Vector3(0, 0, 0), scene);
        camera.setPosition(new Vector3(0, 40, 20));
        camera.attachControl(canvas, true);

        const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
        light.diffuse = new Color3(1, 1, 1);
        light.intensity = 1;

        const worldConfig: WorldConfig = {
            meshDescriptors: meshDescriptors,
            borders: ['door', 'window', 'wall'],
            furnitures: ['empty', 'player', 'cupboard', 'table', 'bathtub', 'washbasin', 'bed', 'chair', 'double_bed', 'shelves'],
            xScale: 1,
            yScale: 2
        }

        new BabylonWorldGenerator(scene).generate(strWorld, worldConfig, {
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