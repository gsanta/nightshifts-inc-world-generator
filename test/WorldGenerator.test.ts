import { BuildHierarchyModifier } from '../src/model/modifiers/BuildHierarchyModifier';
import { ScaleModifier } from '../src/model/modifiers/ScaleModifier';
import { SegmentBordersModifier } from '../src/model/modifiers/SegmentBordersModifier';
import { ServiceFacade } from '../src/model/services/ServiceFacade';
import { setup } from './model/testUtils';
import { FileFormat } from '../src/WorldGenerator';

function createMap(worldMap: string) {
    return `
        map \`

        ${worldMap}

        \`

        definitions \`

        - = room
        W = wall BORDER
        I = window BORDER
        T = table
        D = door BORDER
        C = cupboard
        B = bed

        \`
    `;
}

describe('`WorldParser`', () => {
    it ('can integrate with `PolygonAreaInfoGenerator`', () => {
        const map = createMap(
            `
            WWWWWWWW
            W---W--W
            W---WWWW
            W------W
            W------W
            WWWWWWWW
            `
        );
        let services: ServiceFacade<any, any, any> = setup(map, FileFormat.TEXT);

        const [root] = services.importerService.import(
            map,
            [
                SegmentBordersModifier.modName,
                ScaleModifier.modName,
                BuildHierarchyModifier.modName
            ]
        );

        expect(root.children.length).toEqual(10);
        expect(root.children[0].name).toEqual('room');
        const room = root.children[0];
        expect(room.children.length).toEqual(1);
        expect(room.children[0].name).toEqual('empty');
    });
});
