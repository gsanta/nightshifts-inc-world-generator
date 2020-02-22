import { ViewType } from "../../../common/views/View";
import { GameFacade } from "../../GameFacade";
import { MeshView } from "../../../common/views/MeshView";
import { MeshObject } from "./MeshObject";
import { PathObject } from "./PathObject";
import { PathView } from "../../../common/views/PathView";


export class PathViewConverter {
    viewType: ViewType = ViewType.Path;
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    convert(pathView: PathView): void {
        const pathObject = new PathObject();

        pathObject.name = pathView.name;
        pathObject.points = pathView.points;
        pathObject.tree = new Map();
        pathObject.points.forEach((p, index) => {
            const childIndexes = pathView.edgeList.get(p).map(c => pathObject.points.indexOf(c));
            pathObject.tree.set(index, childIndexes);
        });
        pathObject.points = pathObject.points.map(p => p.negateY()).map(p => p.div(10));
        pathObject.root = pathObject.points[0];
        this.gameFacade.gameStore.add(pathObject);
    }
}