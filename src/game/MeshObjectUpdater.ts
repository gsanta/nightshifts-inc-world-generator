import { MeshObject } from "./models/objects/MeshObject";
import { GameFacade } from "./GameFacade";
import { AnimationState } from "../editor/windows/canvas/models/concepts/MeshConcept";

export class MeshObjectUpdater {
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    updateAnimationState(state: AnimationState, meshObjectName: string) {
        switch(state) {
            case AnimationState.Paused:
                this.gameFacade.gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = true;
                break;
            case AnimationState.Playing:
                this.gameFacade.gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = false;
                break;
            case AnimationState.Stopped:
                this.gameFacade.gameStore.getByName<MeshObject>(meshObjectName).getRoute().reset();
                this.gameFacade.gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = true;
                break;
        }
    }
}