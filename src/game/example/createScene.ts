import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, PointLight } from 'babylonjs';
import { SpriteLoader } from './SpriteLoader';
import { SpriteObj } from '../../core/models/game_objects/SpriteObj';


export function createScene(canvas: HTMLCanvasElement) {
    var engine = new Engine(canvas, true); // Generate the BABYLON 3D engine

    // Create the scene space
    var scene = new Scene(engine);
  
    // Add a camera to the scene and attach it to the canvas
    var camera = new ArcRotateCamera(
      "Camera",
      Math.PI / 2,
      Math.PI / 2,
      2,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
  
    // Add lights to the scene
    var light1 = new HemisphericLight(
      "light1",
      new Vector3(1, 1, 0),
      scene
    );
    var light2 = new PointLight(
      "light2",
      new Vector3(0, 1, -1),
      scene
    );
  
    // This is where you create and manipulate meshes
    // var sphere = MeshBuilder.CreateSphere(
    //   "sphere",
    //   { diameter: 2 },
    //   scene
    // );
  
    engine.runRenderLoop(function () {
        scene.render();
    });

    const spriteObj = new SpriteObj('1234');
    spriteObj.cellRef = 'platform_03';
    const spriteLoader = new SpriteLoader(scene);
    spriteLoader.load(spriteObj);
    spriteObj.sprite.size = 0.2;

    return scene;
}