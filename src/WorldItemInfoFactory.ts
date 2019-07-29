import { Polygon } from "@nightshifts.inc/geometry";
import { WorldItemInfo } from './WorldItemInfo';


/**
 * new `WorldItemInfo` instances should be created via this class, so that a unique id can be set
 * for each new instance.
 */
export class WorldItemInfoFactory {
    private idCounter = 1;

    public create(type: string, dimensions: Polygon, name: string, isBorder: boolean): WorldItemInfo {
        return new WorldItemInfo(this.idCounter++, type, dimensions, name, isBorder);
    }

    public clone(worldItemInfo: WorldItemInfo): WorldItemInfo {
        const clone = new WorldItemInfo(
            this.idCounter++,
            worldItemInfo.type,
            worldItemInfo.dimensions,
            worldItemInfo.name
        );

        clone.children = worldItemInfo.children;
        clone.borderItems = worldItemInfo.borderItems;

        return clone;
    }

}