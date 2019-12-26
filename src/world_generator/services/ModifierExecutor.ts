import { Modifier } from '../modifiers/Modifier';
import { GameObject } from './GameObject';
import { BuildHierarchyModifier } from '../modifiers/BuildHierarchyModifier';
import { ScaleModifier } from '../modifiers/ScaleModifier';
import { WorldGeneratorServices } from './WorldGeneratorServices';
import { CreateMeshModifier } from '../modifiers/CreateMeshModifier';

export const defaultModifiers = [
    BuildHierarchyModifier.modName,
    ScaleModifier.modName,
    CreateMeshModifier.modName
];

export class ModifierExecutor {
    private modifierMap: Map<string, Modifier> = new Map();

    constructor(services: WorldGeneratorServices) {
        this.registerModifier(new BuildHierarchyModifier(services));
        this.registerModifier(new ScaleModifier(services));
    }

    applyModifiers(worldItems: GameObject[], modNames: string[]): GameObject[] {
        return modNames
            .map(name => this.modifierMap.get(name))
            .reduce((gameObjects, transformator) => transformator.apply(gameObjects), worldItems);
    }

    registerModifier(modifier: Modifier): void {
        this.modifierMap.set(modifier.getName(), modifier);
    }
}