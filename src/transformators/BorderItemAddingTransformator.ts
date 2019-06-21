import { WorldItemInfo } from '../WorldItemInfo';
import { WorldItemTransformator } from './WorldItemTransformator';
import _ = require('lodash');
import { Line } from '@nightshifts.inc/geometry';
import { WorldItemInfoUtils } from '../WorldItemInfoUtils';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';


export class BorderItemAddingTransformator implements WorldItemTransformator {
    private roomSeparatorItemNames: string[];
    private doNotIncludeBorderItemsThatIntersectsOnlyAtCorner: boolean;

    constructor(roomSeparatorItemNames: string[], doNotIncludeBorderItemsThatIntersectsOnlyAtCorner = true) {
        this.roomSeparatorItemNames = roomSeparatorItemNames;
        this.doNotIncludeBorderItemsThatIntersectsOnlyAtCorner = doNotIncludeBorderItemsThatIntersectsOnlyAtCorner
    }

    public transform(gwmWorldItems: WorldItemInfo[]): WorldItemInfo[] {
        return this.addBoderItems(gwmWorldItems);
    }

    private addBoderItems(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        const rooms = WorldItemInfoUtils.filterRooms(worldItems);
        const roomSeparatorItems = WorldItemInfoUtils.filterBorderItems(worldItems, this.roomSeparatorItemNames);

        rooms.forEach(room => {
            roomSeparatorItems
                .filter(roomSeparator => {
                    const intersectionLineInfo = room.dimensions.getCoincidentLineSegment(roomSeparator.dimensions);

                    if (!intersectionLineInfo) {
                        return false;
                    }

                    if (this.doNotIncludeBorderItemsThatIntersectsOnlyAtCorner) {
                        return !this.doesBorderItemIntersectOnlyAtCorner(roomSeparator, intersectionLineInfo);
                    }

                    return true;
                })
                .forEach(roomSeparator => room.borderItems.push(roomSeparator));
        });

        return worldItems;
    }

    private doesBorderItemIntersectOnlyAtCorner(roomSeparator: WorldItemInfo, intersectionLineInfo: [Segment, number, number]) {
        const edges = roomSeparator.dimensions.getEdges();

        const intersectingEdge = edges[intersectionLineInfo[2]];

        const smallerEdgeLen = _.minBy(edges, edge => edge.getLength()).getLength();

        return smallerEdgeLen === intersectingEdge.getLength();
    }
}