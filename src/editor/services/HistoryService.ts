import { ServiceLocator } from './ServiceLocator';
import { Stores } from '../stores/Stores';


export class HistoryService {
    serviceName = 'history-service';
    private history: string[] = [];
    private index = 0;
    private memoryLimit = 20;

    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        this.getServices = getServices;
        this.getStores = getStores;
    }

    undo() {
        if (this.hasUndoHistory()) {
            this.index = this.index - 1;
            this.getStores().canvasStore.clear();
            this.getStores().hoverStore.clear();
            this.getStores().selectionStore.clear();
            this.getServices().import.import(this.history[this.index]);
            this.getServices().level.updateCurrentLevel();
        }
    }

    redo() {
        if (this.hasRedoHistory()) {
            this.index = this.index + 1;
            this.getStores().canvasStore.clear();
            this.getStores().hoverStore.clear();
            this.getStores().selectionStore.clear();
            this.getServices().import.import(this.history[this.index]);
            this.getServices().level.updateCurrentLevel();
        }
    }

    hasRedoHistory(): boolean {
        return this.history.length > 0 && this.index !== this.history.length - 1;
    }

    hasUndoHistory(): boolean {
        return this.history.length > 0 && this.index !== 0;
    }

    saveState(state: string) {
        this.history = this.history.slice(0, this.index + 1);
        this.history = this.history.length > this.memoryLimit ? this.history.slice(this.history.length - this.memoryLimit) : this.history;
        this.history.push(state);

        this.index = this.history.length - 1;
    }
}