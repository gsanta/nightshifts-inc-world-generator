import { Color3, StandardMaterial, Texture } from 'babylonjs';
import { Scene } from "babylonjs/scene";
import { MeshObject } from '../../models/objects/MeshObject';

export class MaterialBuilder {
    static CreateMaterial(name: string, scene: Scene): StandardMaterial {
        return new StandardMaterial(name, scene);
    }

    static CreateTexture(path: string, scene: Scene): Texture {
        return new Texture(path, scene);
    }
}

export class MaterialFactory {
    private scene: Scene;
    private materialBuilder: typeof MaterialBuilder;
    private materialIndex = 1;

    constructor(scene: Scene, materialBuilder: typeof MaterialBuilder = MaterialBuilder) {
        this.scene = scene;
        this.materialBuilder = materialBuilder;
    }

    createMaterial(meshObject: MeshObject): StandardMaterial {
        return this.createSimpleMaterial(meshObject.color);
    }

    private createSimpleMaterial(material: string): StandardMaterial {
        const mat =  this.materialBuilder.CreateMaterial(`${this.materialIndex++}`, this.scene);
        mat.diffuseColor = Color3.FromHexString(material);
        return mat;
    }
}