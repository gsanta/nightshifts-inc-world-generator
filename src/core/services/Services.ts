import { Registry } from "../Registry";
import { DragAndDropService } from "./DragAndDropService";
import { ErrorService } from "./ErrorService";
import { EventService } from "./EventService";
import { ExportService } from "./export/ExportService";
import { GameService } from "./GameService";
import { HistoryService } from "./HistoryService";
import { ImportService } from './import/ImportService';
import { LevelService } from "./LevelService";
import { LocalStoreService } from "./LocalStroreService";
import { ModuleService } from "./ModuleService";
import { RenderService } from "./RenderServices";
import { UI_PerspectiveService } from './UI_PerspectiveService';

export class Services {
    localStore: LocalStoreService;
    render: RenderService;
    import: ImportService;
    export: ExportService;
    history: HistoryService;
    uiPerspective: UI_PerspectiveService;
    error: ErrorService;
    event: EventService;
    module: ModuleService;
    
    level: LevelService;
    game: GameService;
    dragAndDropService: DragAndDropService;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    setup() {
        this.localStore = new LocalStoreService(this.registry);
        this.level = new LevelService(this.registry);
        this.render = new RenderService(this.registry);
        this.import = new ImportService(this.registry);
        this.export = new ExportService(this.registry);
        this.history = new HistoryService(this.registry);
        this.game = new GameService(this.registry);
        this.uiPerspective = new UI_PerspectiveService(this.registry);
        this.error = new ErrorService();
        this.dragAndDropService = new DragAndDropService();
        this.event = new EventService();
        this.module = new ModuleService();
        // TODO: find a better place to register general hotkeys
    }
}