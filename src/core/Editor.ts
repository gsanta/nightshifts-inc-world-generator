import { AnimationGroupNode } from '../modules/graph_editor/main/models/nodes/AnimationGroupNode';
import { FilterMeshNode } from '../modules/graph_editor/main/models/nodes/FilterMeshNode';
import { KeyboardNode } from '../modules/graph_editor/main/models/nodes/KeyboardNode';
import { MeshNode } from '../modules/graph_editor/main/models/nodes/MeshNode';
import { MeshVisibilityNode } from '../modules/graph_editor/main/models/nodes/MeshVisibilityNode';
import { MoveNode } from '../modules/graph_editor/main/models/nodes/MoveNode';
import { RayCasterNode } from '../modules/graph_editor/main/models/nodes/RayCasterNode';
import { RayHelperNode } from '../modules/graph_editor/main/models/nodes/RayHelperNode';
import { RemoveMeshNode } from '../modules/graph_editor/main/models/nodes/RemoveMeshNode';
import { RotateNode } from '../modules/graph_editor/main/models/nodes/RotateNode';
import { TriggerZoneNode } from '../modules/graph_editor/main/models/nodes/TriggerZoneNode';
import { Registry } from './Registry';
import { ObjStore } from './data/stores/ObjStore';
import { CollisionNode } from '../modules/graph_editor/main/models/nodes/CollisionNode';
import { DirectionNode } from '../modules/graph_editor/main/models/nodes/DirectionNode';
import { ArrayNode } from '../modules/graph_editor/main/models/nodes/ArrayNode';
import { LayoutSettingsModule } from '../modules/contribs/side_panel/layout_settings/LayoutSettingsModule';
import { FileSettingsModule } from '../modules/contribs/side_panel/file_settings/FileSettingsModule';
import { NodeLibraryModule } from '../modules/graph_editor/contribs/side_panel/node_library/NodeLibraryModule';
import { AssetManagerModule } from '../modules/contribs/side_panel/asset_manager/AssetManagerModule';
import { ObjPropertiesModule } from '../modules/scene_editor/contribs/side_panel/obj_properties/ObjPropertiesModule';
import { LevelSettingsModule } from '../modules/contribs/side_panel/level_settings/LevelSettingsModule';
import { SpriteSheetManagerDialogModule } from '../modules/contribs/dialogs/spritesheet_manager/SpriteSheetManagerDialogModule';
import { MeshLoaderDialogModule } from '../modules/contribs/dialogs/mesh_loader/MeshLoaderDialogModule';
import { PhysicsImpostorDialogModule } from '../modules/contribs/dialogs/physics_impostor/PhysicsImpostorDialogModule';
import { NodeEditorCanvas } from '../modules/graph_editor/NodeEditorCanvas';
import { SceneEditorCanvas } from '../modules/scene_editor/main/SceneEditorCanvas';

export class Editor {
    registry: Registry;
    
    svgCanvasId: string;
    renderFunc: () => void;
    isLoading = true;

    constructor() {
        this.svgCanvasId = 'svg-editor';
        this.registry = new Registry();

        // canvases
        this.registry.services.module.ui.registerCanvas(new SceneEditorCanvas(this.registry));
        this.registry.services.module.ui.registerCanvas(new NodeEditorCanvas(this.registry));

        // side panels
        this.registry.services.module.ui.registerPanel(new NodeLibraryModule(this.registry))
        this.registry.services.module.ui.registerPanel(new AssetManagerModule(this.registry))
        this.registry.services.module.ui.registerPanel(new FileSettingsModule(this.registry))
        this.registry.services.module.ui.registerPanel(new LayoutSettingsModule(this.registry));

        this.registry.services.module.ui.registerPanel(new ObjPropertiesModule(this.registry));
        this.registry.services.module.ui.registerPanel(new LevelSettingsModule(this.registry));

        // dialogs
        this.registry.services.module.ui.registerPanel(new SpriteSheetManagerDialogModule(this.registry));
        this.registry.services.module.ui.registerPanel(new MeshLoaderDialogModule(this.registry));
        this.registry.services.module.ui.registerPanel(new PhysicsImpostorDialogModule(this.registry));
    
        // nodes
        this.registry.data.helper.node.registerNode(new KeyboardNode(this.registry));
        this.registry.data.helper.node.registerNode(new MeshNode(this.registry));
        this.registry.data.helper.node.registerNode(new MoveNode(this.registry));
        this.registry.data.helper.node.registerNode(new RotateNode(this.registry));
        this.registry.data.helper.node.registerNode(new RayCasterNode(this.registry));
        this.registry.data.helper.node.registerNode(new RayHelperNode(this.registry));
        this.registry.data.helper.node.registerNode(new RemoveMeshNode(this.registry));
        this.registry.data.helper.node.registerNode(new TriggerZoneNode(this.registry));
        this.registry.data.helper.node.registerNode(new MeshVisibilityNode(this.registry));
        this.registry.data.helper.node.registerNode(new FilterMeshNode(this.registry));
        this.registry.data.helper.node.registerNode(new AnimationGroupNode(this.registry));
        this.registry.data.helper.node.registerNode(new CollisionNode(this.registry));
        this.registry.data.helper.node.registerNode(new DirectionNode(this.registry));
        this.registry.data.helper.node.registerNode(new ArrayNode(this.registry));
    }

    setup() {
        this.registry.services.localStore.setup();
        this.registry.services.render.reRenderAll();
            
        setTimeout(() => {
            this.registry.engine.registerRenderLoop(() => this.registry.services.game.renderLoop())
        }, 0);
        
        setTimeout(() => {
            this.registry.services.localStore.loadLevelIndexes()
                .then((indexes: number[]) => {
                    if (indexes.length) {
                        this.registry.stores.levelStore.setLevels(indexes);
                        return this.registry.services.level.changeLevel(indexes[0]);
                    }
                })
                .then(() => {
                    this.isLoading = false;
                    this.registry.services.history.createSnapshot();
                    this.render();
                })
    
                .catch(() => {
                    this.isLoading = false;
                    this.render();
                });
        }, 100);       
    }

    render() {
        this.renderFunc && this.renderFunc();
    }

    setRenderer(renderFunc: () => void) {
        this.renderFunc = renderFunc;
    }
}