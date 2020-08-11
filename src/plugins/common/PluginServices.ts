import { AbstractPluginService } from "./AbstractPluginService";
import { AbstractCanvasPlugin } from "../../core/plugins/AbstractCanvasPlugin";
import { EngineService } from "../../core/services/EngineService";
import { UI_Region, UI_Plugin } from '../../core/UI_Plugin';

export class PluginServices<T extends AbstractCanvasPlugin> {
    private registeredPlugins: Map<UI_Region, UI_Plugin[]> = new Map();

    services: AbstractPluginService<T>[] = [];
    private serviceMap: Map<string, AbstractPluginService<T>> = new Map();

    constructor(services: AbstractPluginService<T>[]) {
        this.services = services;
        this.services.forEach(service => this.serviceMap.set(service.serviceName, service));
    }

    byName<U extends AbstractPluginService<T>>(serviceName: string): U {
        const service = this.services.find(service => service.serviceName === serviceName); 
        if (!service) { this.throwServiceNotFoundError(serviceName); }

        return <U> service;
    }

    engineService(): EngineService {
        return this.byName<EngineService>(EngineService.serviceName);
    }

    private throwServiceNotFoundError(serviceName: string) {
        throw new Error(`Service '${serviceName}' not found.`);
    }
}