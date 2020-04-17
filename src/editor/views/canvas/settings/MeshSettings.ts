import { ServiceLocator } from '../../../services/ServiceLocator';
import { AbstractSettings, PropertyType } from "./AbstractSettings";
import { UpdateTask } from '../../../services/UpdateServices';
import { MeshConcept } from '../models/concepts/MeshConcept';
import { Stores } from '../../../stores/Stores';
import { AnimationCondition, AnimationConcept } from '../models/meta/AnimationConcept';
import { ConceptType } from '../models/concepts/Concept';
import { ModelConcept } from '../models/concepts/ModelConcept';

export enum MeshViewPropType {
    Color = 'color',
    Model = 'model',
    Texture = 'texture',
    Thumbnail = 'thumbnail',
    Layer = 'layer',
    Rotation = 'rotation',
    Scale = 'scale',
    Name = 'name',
    Path = 'path',
    IsManualControl = 'is-manual-control',
    DefaultAnimation = 'default-animation',
    AnimationState = 'animation-state'
}

const propertyTypes = {
    [MeshViewPropType.Scale]: PropertyType.Number,
    [MeshViewPropType.Rotation]: PropertyType.Number
};

export class MeshSettings extends AbstractSettings<MeshViewPropType> {
    static type = 'mesh-settings';
    getName() { return MeshSettings.type; }
    meshConcept: MeshConcept;

    isAnimationSectionOpen = false;
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        super(propertyTypes);
        this.getServices = getServices;
        this.getStores = getStores;
        this.getServices = getServices;
    }

    blurProp() {
        super.blurProp();

        this.getServices().update.runImmediately(UpdateTask.RepaintCanvas);
    }

    updateProp(value: any, propType: MeshViewPropType) {
        super.updateProp(value, propType);

        this.getServices().update.runImmediately(UpdateTask.RepaintCanvas);
    }

    protected getProp(prop: MeshViewPropType) {
        let modelConcept = this.getStores().canvasStore.getModelConceptById(this.meshConcept.modelId);
        switch (prop) {
            case MeshViewPropType.Color:
                return this.meshConcept.color;
            case MeshViewPropType.Model:
                return modelConcept && modelConcept.modelPath;
            case MeshViewPropType.Texture:
                return modelConcept && modelConcept.texturePath;
            case MeshViewPropType.Thumbnail:
                return this.meshConcept.thumbnailPath;
            case MeshViewPropType.Layer:
                return this.meshConcept.layer;
            case MeshViewPropType.Rotation:
                return this.meshConcept.rotation;
            case MeshViewPropType.Scale:
                return this.meshConcept.scale;
            case MeshViewPropType.Name:
                return this.meshConcept.id;
            case MeshViewPropType.Path:
                return this.meshConcept.path;
            case MeshViewPropType.IsManualControl:
                return this.meshConcept.isManualControl;
            case MeshViewPropType.DefaultAnimation:
                if (this.meshConcept.animationId) {
                    return this.getStores().canvasStore.getAnimationConceptById(this.meshConcept.animationId).getAnimationByCond(AnimationCondition.Default);
                }
                break;
            case MeshViewPropType.AnimationState:
                return this.meshConcept.animationState;
    
        }
    }

    protected setProp(val: any, prop: MeshViewPropType) {
        switch (prop) {
            case MeshViewPropType.Color:
                this.meshConcept.color = val;
                this.update();
                break;
            case MeshViewPropType.Model:
                this.updateModelPath(val.path);
                const modelPath = this.getStores().canvasStore.getModelConceptById(this.meshConcept.modelId).modelPath;

                this.getServices().storage.saveAsset(val.path, val.data)
                    .then(() => {
                        return this.getServices().meshLoader.getDimensions(modelPath, this.meshConcept.id);
                    })
                    .then(dim => {
                        this.meshConcept.dimensions.setWidth(dim.x);
                        this.meshConcept.dimensions.setHeight(dim.y);
                    })
                    .finally(() => {
                        const data = this.getServices().export.export();
                        this.getServices().game.updateConcepts([this.meshConcept]);
                        this.getServices().update.runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData, UpdateTask.RepaintCanvas);
                        this.getServices().storage.storeLevel(this.getStores().levelStore.currentLevel.index, data);
                    });
                break;
            case MeshViewPropType.Texture:
                this.updateTexturePath(val.path);
                this.update();
                break;
            case MeshViewPropType.Thumbnail:
                this.meshConcept.thumbnailPath = val.path;
                this.update();
                break;
            case MeshViewPropType.Layer:
                this.meshConcept.layer = val;
                this.update();
                break;
            case MeshViewPropType.Rotation:
                this.meshConcept.rotation = this.convertValue(val, prop, this.meshConcept.rotation);
                this.update();
                break;
            case MeshViewPropType.Scale:
                this.meshConcept.scale = this.convertValue(val, prop, this.meshConcept.scale);
                this.update();
                break;
            case MeshViewPropType.Name:
                this.meshConcept.id = val;
                this.update();
                break;
            case MeshViewPropType.Path:
                this.meshConcept.path = val;
                this.update();
                break;
            case MeshViewPropType.IsManualControl:
                this.meshConcept.isManualControl = val;
                this.update();
                break;
            case MeshViewPropType.DefaultAnimation:
                if (val === undefined) {
                    if (this.meshConcept.animationId) {
                        const animationConcept = this.getStores().canvasStore.getAnimationConceptById(this.meshConcept.animationId);
                        this.getStores().canvasStore.removeMeta(animationConcept);
                        this.meshConcept.animationId = undefined;
                    }
                } else {
                    if (!this.meshConcept.animationId) {
                        const animationConcept = new AnimationConcept();
                        animationConcept.id = this.getStores().canvasStore.generateUniqueName(ConceptType.AnimationConcept);
                        this.getStores().canvasStore.addMeta(animationConcept);
                        this.meshConcept.animationId = animationConcept.id;
                
                    }
    
                    this.getStores().canvasStore.getAnimationConceptById(this.meshConcept.animationId).addAnimation({
                        name: val,
                        condition: AnimationCondition.Default
                    })
                }
                this.update();
                break;
            case MeshViewPropType.AnimationState:
                this.meshConcept.animationState = val;
                this.update();
                break;
        }
    }

    private updateModelPath(path: string) {
        let modelConcept = ModelConcept.getByModelPath(this.getStores().canvasStore.getModelConcepts(), path);
        if (!modelConcept) {
            modelConcept = new ModelConcept();
            modelConcept.id = this.getStores().canvasStore.generateUniqueName(ConceptType.ModelConcept);
            this.getStores().canvasStore.addMeta(modelConcept);
        }
        modelConcept.modelPath = path;
        this.meshConcept.modelId = modelConcept.id;
    }

    private updateTexturePath(path: string) {
        let modelConcept: ModelConcept;
        if (this.meshConcept.modelId) {
            modelConcept = this.getStores().canvasStore.getModelConceptById(this.meshConcept.modelId);
        } else {
            modelConcept = new ModelConcept();
            modelConcept.id = this.getStores().canvasStore.generateUniqueName(ConceptType.ModelConcept);
            this.getStores().canvasStore.addMeta(modelConcept);
        }
        modelConcept.texturePath = path;
        this.meshConcept.modelId = modelConcept.id;   
    }

    private update() {
        const data = this.getServices().export.export();
        this.getServices().game.updateConcepts([this.meshConcept]);
        this.getServices().update.runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
        this.getServices().storage.storeLevel(this.getStores().levelStore.currentLevel.index, data);

    }
}