import { AbstractPluginImporter, PluginJson, ViewContainerJson } from "../../../common/io/AbstractPluginImporter";
import { Registry } from "../../../../core/Registry";
import { IViewImporter } from "../../../../core/services/import/IViewImporter";
import { ModelViewImporter } from "./ModelViewImporter";
import { PathViewImporter } from "./PathViewImporter";
import { MeshViewImporter } from "./MeshViewImporter";
import { ConceptType, View } from "../../../../core/models/views/View";

export class SceneEditorImporter extends AbstractPluginImporter {
    viewImporters: IViewImporter<any>[];

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;

        this.viewImporters = [
            new MeshViewImporter(registry),
            new ModelViewImporter(registry),
            new PathViewImporter(registry)
        ];
    }

    import(pluginJson: PluginJson, viewMap: Map<string, View>): void {
        let viewContainers: ViewContainerJson<any>[] = pluginJson.g.length ? pluginJson.g : [<any> pluginJson.g];

        viewContainers.forEach((viewContainerJson: ViewContainerJson<any>) => {
            const conceptType = <ConceptType> viewContainerJson._attributes["data-view-type"];
            this.findViewImporter(conceptType).import(viewContainerJson, viewMap);
        });
    }
}