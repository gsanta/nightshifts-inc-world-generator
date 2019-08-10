import { Skeleton } from "babylonjs";
import { Mesh } from "babylonjs/Meshes/mesh";
import { MeshTemplate } from "../integrations/api/MeshTemplate";
import { FileDescriptor, MeshDescriptor, MeshFactory, ShapeDescriptor } from '../integrations/babylonjs/MeshFactory';
import { MeshLoader } from "../integrations/babylonjs/MeshLoader";
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";
import { WorldItemInfo } from "../WorldItemInfo";
import { WorldItemTransformator } from './WorldItemTransformator';

export class MeshCreationTransformator implements WorldItemTransformator {
    private meshFactory: MeshFactory;
    private meshLoader: MeshLoader;
    private isReady = true;
    private modelMap: Map<string, MeshTemplate<Mesh, Skeleton>> = new Map();
    private descriptorMap: Map<string, MeshDescriptor> = new Map();

    constructor(meshLoader: MeshLoader, meshFactory: MeshFactory) {
        this.meshLoader = meshLoader;
        this.meshFactory = meshFactory;
    }

    public prepareMeshTemplates(modelTypeDescriptions: MeshDescriptor[]): Promise<void> {
        this.isReady = false;

        this.createShapeTemplates(modelTypeDescriptions);
        return this.createModelTemplates(modelTypeDescriptions)
            .then(() => { this.isReady = true });
    }

    public transform(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        if (!this.isReady) {
            throw new Error('`MeshFactory` is not ready loading the models, please wait for the Promise returned from `loadModels` to resolve.');
        }

        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                console.log(item.name);
                item.meshTemplate = {
                    meshes: this.createMesh(item),
                    skeletons: [],
                    type: item.name
                }
            }
        });

        return worldItems;
    }

    private createShapeTemplates(modelTypeDescriptions: MeshDescriptor[]) {
        modelTypeDescriptions
            .forEach(desc => this.descriptorMap.set(desc.type, desc));
    }

    private createModelTemplates(modelTypeDescriptions: MeshDescriptor[]) {
        const fileDescriptions = modelTypeDescriptions
            .filter(desc => desc.details.name === 'file-descriptor');


        return Promise
            .all(fileDescriptions.map(desc => this.meshLoader.load(desc.type, <FileDescriptor>desc.details)))
            .then((meshTemplates: MeshTemplate<Mesh, Skeleton>[]) => {
                meshTemplates.forEach(template => this.modelMap.set(template.type, template));
            });
    }

    private createMesh(worldItemInfo: WorldItemInfo): Mesh[] {

        if (this.modelMap.has(worldItemInfo.name) || worldItemInfo.name === 'root' || worldItemInfo.name === 'empty' || worldItemInfo.name === 'wall') {
            return this.meshFactory.createFromTemplate(worldItemInfo, this.modelMap.get(worldItemInfo.name));
        } else {
            return this.meshFactory.createFromMeshDescriptor(worldItemInfo, this.descriptorMap.get(worldItemInfo.name));
        }
    }
}