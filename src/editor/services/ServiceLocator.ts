import { LocalStoreService } from "./LocalStroreService";
import { Editor } from "../Editor";
import { Stores } from "../stores/Stores";
import { LevelService } from "./LevelService";
import { UpdateService } from "./UpdateServices";
import { ImportService } from './import/ImportService';
import { HistoryService } from "./HistoryService";
import { ExportService } from "./export/ExportService";
import { PointerService } from './PointerService';
import { MouseService } from './MouseService';
import { KeyboardService } from './KeyboardService';
import { MeshDimensionService } from "./MeshDimensionService";
import { HotkeyService, Hotkey } from "./HotkeyService";
import { DialogService } from "./DialogService";
import { GameService } from "../../game/GameService";
import { SettingsService } from "./SettingsService";

export class ServiceLocator {
    services: {serviceName: string}[] = [];

    constructor(editor: Editor, getStores: () => Stores) {
        this.services = [
            new LocalStoreService(editor, () => this),
            new LevelService(() => this, getStores),
            new UpdateService(editor, () => this, getStores),
            new ImportService(() => this, getStores),
            new ExportService(getStores),
            new HistoryService(() => this, getStores),
            new PointerService(() => this, getStores),
            new MouseService(() => this),
            new KeyboardService(getStores),
            new HotkeyService(() => this),
            new MeshDimensionService(() => this),
            new DialogService(() => this),
            new SettingsService(() => this, getStores)
        ];
    }

    getService(serviceName: string) {
        return this.services.find(service => service.serviceName === serviceName);
    }

    storageService(): LocalStoreService {
        return <LocalStoreService> this.getService('local-store');
    }

    levelService(): LevelService {
        return <LevelService> this.getService('level-service');
    }

    updateService(): UpdateService {
        return <UpdateService> this.getService('update-service');
    }

    importService(): ImportService {
        return <ImportService> this.getService('import-service');
    }

    exportService(): ExportService {
        return <ExportService> this.getService('export-service');
    }

    historyService(): HistoryService {
        return <HistoryService> this.getService('history-service');
    }

    pointerService(): PointerService {
        return <PointerService> this.getService('pointer-service');
    }

    mouseService(): MouseService {
        return <MouseService> this.getService('mouse-service');
    }

    keyboardService(): KeyboardService {
        return <KeyboardService> this.getService('keyboard-service');
    }

    hotkeyService(): HotkeyService {
        return <HotkeyService> this.getService('hotkey-service');
    }

    meshDimensionService(): MeshDimensionService {
        return <MeshDimensionService> this.getService('mesh-dimension-service');
    }

    dialogService(): DialogService {
        return <DialogService> this.getService('dialog-service');
    }

    gameService(): GameService {
        return <GameService> this.getService('game-service');
    }

    settingsService(): SettingsService {
        return <SettingsService> this.getService('settings-service');
    }
}