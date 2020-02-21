import { IEventListener } from "../listeners/IEventListener";
import { GameEvent } from "../GameEventManager";
import { GameFacade } from "../../GameFacade";
import { LifeCycleEvent } from "../triggers/ILifeCycleTrigger";
import { RouteObject } from "../../models/objects/RouteObject";

const defaultSpeed = 1000 / 4;

export class RouteWalker implements IEventListener {
    events: GameEvent[];
    private gameFacade: GameFacade;
    private prevTime: number;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
        this.updateRoutes = this.updateRoutes.bind(this);

        this.events = [
            new GameEvent({lifeCycleEvent: LifeCycleEvent.AfterRender}, this.updateRoutes),
        ]
    }

    private updateRoutes() {
        const delta = this.computeDelta();
        const speed = delta / defaultSpeed;

        this.gameFacade.gameStore.getRouteObjects()
            .filter(route => route.isFinished === false && route.isPaused === false)
            .forEach(route => {
                const meshObj = route.getMeshObject();
                const pathObj = route.getPathObject();

                const direction =  pathObj.points[route.currentStop].subtract(meshObj.getPosition()).normalize();

                if (this.isNextStopReached(route)) {
                    route.currentStop = pathObj.tree.get(route.currentStop)[0];
                }

                if (pathObj.tree.get(route.currentStop).length === 0) {
                    route.reset();
                }

                meshObj.moveBy(direction.mul(speed));
                meshObj.setRotation(direction);
            });
    }

    private computeDelta(): number {
        const currentTime = Date.now();
        this.prevTime = this.prevTime === undefined ? currentTime : this.prevTime;

        const delta = currentTime - this.prevTime;

        this.prevTime = currentTime;

        return delta;
    }

    private isNextStopReached(route: RouteObject): boolean {
        const meshObj = route.getMeshObject();
        const pathObj = route.getPathObject();

        const meshPos = meshObj.getPosition();
        const currentStopPos = route.currentStop;

        return meshPos.distanceTo(pathObj.points[currentStopPos]) < 1;
    }

    initRoutes() {
        this.gameFacade.gameStore.getRouteObjects().forEach(route => {
            const meshObj = route.getMeshObject();
            const pathObj = route.getPathObject();
            meshObj.setPosition(pathObj.root);
        });
    }
}