import { SegmentBordersModifier } from "../../../src/model/modifiers/SegmentBordersModifier";
import { ServiceFacade } from "../../../src/model/services/ServiceFacade";
import { setup } from "../../test_utils/mocks";


function createMap(worldMap: string) {
    return `
        map \`

        ${worldMap}

        \`

        definitions \`

        W = wall
        D = door
        - = empty

        \`
    `;
}

describe('ThickenBordersModifier', () => {

    it ('gives thickness to the walls which were represented as a line segment', () => {

        const map = createMap(
            `
            WDDWWWWW
            W------W
            W------W
            WWWWWWWW
            `
        )

        let services: ServiceFacade<any, any, any> = setup({xScale: 1, yScale: 1});

        const items = services.importerService.import(
            map,
            [
                SegmentBordersModifier.modName
            ]
        );
    });
});