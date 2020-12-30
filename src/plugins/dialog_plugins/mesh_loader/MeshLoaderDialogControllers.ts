import { AssetObj, AssetType } from "../../../core/models/objs/AssetObj";
import { MeshObj, MeshTreeNode } from "../../../core/models/objs/MeshObj";
import { ParamControllers, PropController } from "../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { TreeController, TreeData } from "../../../core/ui_components/elements/complex/tree/TreeController";
import { MeshView } from "../../canvas_plugins/scene_editor/views/MeshView";
import { MeshLoaderPreviewCanvas } from "./MeshLoaderPreviewCanvas";

export class MeshLoaderDialogControllers extends ParamControllers {
    constructor(registry: Registry, canvas: MeshLoaderPreviewCanvas) {
        super();
        this.tree = new MeshHierarchyTreeController(registry, canvas);
        this.texture = new TextureController(registry);
        this.save = new SaveController(registry, this);
    }

    tree: MeshHierarchyTreeController;
    texture: TextureController;
    save: SaveController;
}

export class MeshHierarchyTreeController extends TreeController {
    selectedNodeName: string;
    private treeData: TreeData;
    private canvas: MeshLoaderPreviewCanvas;
    private meshObj: MeshObj;
    private assetObj: AssetObj;

    constructor(registry: Registry, canvas: MeshLoaderPreviewCanvas) {
        super(registry);

        this.canvas = canvas;
    }

    getData(): TreeData {
        const selectedViews = this.registry.data.view.scene.getSelectedViews();
        const meshView = <MeshView> selectedViews[0];
        this.meshObj = meshView.getObj();
        
        this.assetObj = this.registry.stores.assetStore.getAssetById(meshView.getObj().modelId);
        const nodes = this.registry.engine.meshLoader.getMeshTree(this.assetObj);
        return this.convertToTreeData(nodes);
    }

    check(data: TreeData): void {
        const isChecked = data.checked;
        if (isChecked) {
            this.iterateTreeData(this.treeData, (treeData) => treeData.checked = false);
            this.selectedNodeName = data.name;
            data.checked = true;
            this.canvas.getEngine().meshLoader.setPrimaryMeshNode(this.assetObj, this.selectedNodeName);
            this.canvas.setMesh();

        } else {
            this.selectedNodeName = undefined;
        }
    }

    private convertToTreeData(nodes: MeshTreeNode[]): TreeData {
        if (nodes.length > 1) {
            this.treeData = {
                name: '_virtual_root__',
                toggled: true,
                checked: false,
                children: nodes.map(node => this.getTreeData(node))
            }
        } else {
            this.treeData = this.getTreeData(nodes[0]);
        }

        return this.treeData;
    }

    private getTreeData(node: MeshTreeNode): TreeData {
        return {
            name: node.name,
            toggled: true,
            checked: node.isPrimaryMesh,
            children: node.children.length > 0 ? node.children.map(child => this.getTreeData(child)) : undefined
        }
    }

    private iterateTreeData(treeData: TreeData, callback: (treeData: TreeData) => void) {
        callback(treeData);
        treeData.children && treeData.children.forEach(child => this.iterateTreeData(child, callback));
    }
}

export class TextureController extends PropController {
    private tempVal: string;
    tempAsset: AssetObj;

    val() {
        if (this.tempVal) {
            return this.tempVal;
        } else {
            const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
    
            if (meshView.getObj().textureId) {
                const assetObj = this.registry.stores.assetStore.getAssetById(meshView.getObj().textureId);
                return assetObj.path;
            }

        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Dialog);
    }

    async blur() {
        const val = this.tempVal;
        this.tempVal = undefined;
        this.tempAsset = new AssetObj({path: val, assetType: AssetType.Texture});
    }
}

export class SaveController extends PropController {
    private controllers: MeshLoaderDialogControllers;
    constructor(registry: Registry, controllers: MeshLoaderDialogControllers) {
        super(registry);

        this.controllers = controllers;
    }

    async click() {
        const meshView = <MeshView> this.registry.data.view.scene.getOneSelectedView();
        const assetObj = this.registry.stores.assetStore.getAssetById(meshView.getObj().modelId);
        this.registry.engine.meshLoader.setPrimaryMeshNode(assetObj, this.controllers.tree.selectedNodeName);
        await this.registry.engine.meshes.createInstance(meshView.getObj());

        const realDimensions = this.registry.engine.meshes.getDimensions(meshView.getObj());
        meshView.getBounds().setWidth(realDimensions.x);
        meshView.getBounds().setHeight(realDimensions.y);

        const textureAssetObj = this.controllers.texture.tempAsset;
        if (textureAssetObj) {
            meshView.getObj().textureId = this.registry.stores.assetStore.addObj(textureAssetObj);
            this.registry.engine.meshes.createMaterial(meshView.getObj());
        }

        this.registry.services.history.createSnapshot();
        this.registry.ui.helper.setDialogPanel(undefined);
        this.registry.services.render.reRenderAll();
    }
}