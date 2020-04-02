import { AbstractSettings } from './AbstractSettings';
import { UpdateTask } from '../../../services/UpdateServices';
import { MeshConcept } from '../models/concepts/MeshConcept';
import { ServiceLocator } from '../../../services/ServiceLocator';
import { Stores } from '../../../stores/Stores';
import { ConceptType } from '../models/concepts/Concept';
import { AnimationConcept, AnimationCondition } from '../models/meta/AnimationConcept';

export enum AnimationSettingsProps {
    Name = 'Name',
    DefaultAnimation = 'DefaultAnimation',
    RotateLeftAnimation = 'RotateLeftAnimation',
    RotateRightAnimation = 'RotateRightAnimation',
}

export class AnimationSettings extends AbstractSettings<AnimationSettingsProps> {
    static settingsName = 'animation-settings';
    getName() { return AnimationSettings.settingsName; }
    animationConcept: AnimationConcept;
    meshConcept: MeshConcept;

    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        super();
        this.getServices = getServices;
        this.getStores = getStores;

        this.animationConcept = new AnimationConcept();
        this.animationConcept.id = getStores().canvasStore.generateUniqueName(ConceptType.AnimationConcept);
    }

    protected getProp(prop: AnimationSettingsProps) {
        switch (prop) {
            case AnimationSettingsProps.Name:
                return this.animationConcept.id;
            case AnimationSettingsProps.RotateLeftAnimation:
                return this.animationConcept.getAnimationByCond(AnimationCondition.RotateLeft);
            case AnimationSettingsProps.RotateRightAnimation:
                return this.animationConcept.getAnimationByCond(AnimationCondition.RotateRight);
            case AnimationSettingsProps.DefaultAnimation:
                return this.animationConcept.getAnimationByCond(AnimationCondition.Default);
        }
    }

    protected setProp(val: any, prop: AnimationSettingsProps) {
        switch (prop) {
            case AnimationSettingsProps.Name:
                this.animationConcept.id = val;
                this.getServices().updateService().runImmediately(UpdateTask.RepaintSettings);
                break;
            case AnimationSettingsProps.RotateLeftAnimation:
                this.animationConcept.addAnimation({name: val, condition: AnimationCondition.RotateLeft});
                this.getServices().updateService().runImmediately(UpdateTask.RepaintSettings);
                break;
            case AnimationSettingsProps.RotateRightAnimation:
                this.animationConcept.addAnimation({name: val, condition: AnimationCondition.RotateRight});
                this.getServices().updateService().runImmediately(UpdateTask.RepaintSettings);
                break;
            case AnimationSettingsProps.DefaultAnimation:
                this.animationConcept.addAnimation({name: val, condition: AnimationCondition.Default});
                this.getServices().updateService().runImmediately(UpdateTask.RepaintSettings);
                break;
        }
    }
}