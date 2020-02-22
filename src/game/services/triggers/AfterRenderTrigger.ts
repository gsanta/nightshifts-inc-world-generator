

import { GameFacade } from '../../GameFacade';
import { ILifeCycleTrigger, LifeCycleEvent } from './ILifeCycleTrigger';

export class AfterRenderTrigger implements ILifeCycleTrigger {
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    activate(trigger: (event: LifeCycleEvent) => void) {
        this.gameFacade.gameEngine.scene.registerAfterRender(() => {
            trigger(LifeCycleEvent.AfterRender);
        });
    }
}