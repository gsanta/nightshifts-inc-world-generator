import { Polygon } from '@nightshifts.inc/geometry';
import { FurnitureBuilder } from '../../../src/model/builders/FurnitureBuilder';
import { setup } from '../testUtils';
import { Format } from '../../../src/model/builders/WorldItemBuilder';
import { TextWorldMapReader } from '../../../src/model/readers/text/TextWorldMapReader';

describe('FurnitureBuilder', () => {
    describe('generate', () => {
        it ('creates world items from the graph (test case with one connected component)', () => {
            const worldMap = `
                map \`

                ------
                -TTTTT
                -T-T--
                ------

                \`

                definitions \`

                W = wall BORDER
                T = table
                - = room

                \`
            `;

            const services = setup(worldMap);

            const furnitureInfoParser = new FurnitureBuilder(services, new TextWorldMapReader(services.configService));
            const worldItems = furnitureInfoParser.parse(worldMap, Format.TEXT);

            expect(worldItems.length).toEqual(4);
            expect(worldItems).toContainWorldItem({id: 'table-1', name: 'table', dimensions: Polygon.createRectangle(1, 1, 1, 2)});
            expect(worldItems).toContainWorldItem({id: 'table-2', name: 'table', dimensions: Polygon.createRectangle(3, 1, 1, 2)});
            expect(worldItems).toContainWorldItem({id: 'table-3', name: 'table', dimensions: Polygon.createRectangle(2, 1, 1, 1)});
            expect(worldItems).toContainWorldItem({id: 'table-4', name: 'table', dimensions: Polygon.createRectangle(4, 1, 2, 1)});
        });

        it ('creates world items from the graph (test case with multiple connected components)', () => {
            const worldMap = `
                map \`

                ------
                -TTTT-
                -T----
                --TT--

                \`

                definitions \`

                W = wall BORDER
                T = table
                - = room

                \`
            `;

            const services = setup(worldMap);

            const furnitureInfoParser = new FurnitureBuilder(services, new TextWorldMapReader(services.configService));
            const worldItems = furnitureInfoParser.parse(worldMap, Format.TEXT);

            expect(worldItems.length).toEqual(3);
            expect(worldItems).toContainWorldItem({id: 'table-1', name: 'table', dimensions: Polygon.createRectangle(1, 1, 1, 2)});
            expect(worldItems).toContainWorldItem({id: 'table-2', name: 'table', dimensions: Polygon.createRectangle(2, 1, 3, 1)});
            expect(worldItems).toContainWorldItem({id: 'table-3', name: 'table', dimensions: Polygon.createRectangle(2, 3, 2, 1)});
        });

        it ('creates one world item for a rectangular connected component', () => {
            const worldMap = `
                map \`

                -TT---
                -TT---
                -TT---
                ------

                \`

                definitions \`

                W = wall BORDER
                T = table
                - = room

                \`
            `;

            const services = setup(worldMap);

            const furnitureInfoParser = new FurnitureBuilder(services, new TextWorldMapReader(services.configService));
            const worldItems = furnitureInfoParser.parse(worldMap, Format.TEXT);
            expect(worldItems.length).toEqual(1);
            expect(worldItems).toContainWorldItem({id: 'table-1', name: 'table', dimensions: Polygon.createRectangle(1, 0, 2, 3)});
        });
    });
});

it ('Parse furnitures that are outdoors', () => {
    const worldMap = `
        map \`

        ****************
        *WWWWWWWW*******
        *W------W*TTTT**
        *W------W*TTTT**
        *W------W*******
        *WWWWWWWW*******

        \`

        definitions \`

        W = wall BORDER
        T = table
        - = room
        * = outdoors

        \`
    `;

    const services = setup(worldMap);

    const furnitureInfoParser = new FurnitureBuilder(services, new TextWorldMapReader(services.configService));
    const furnitures = furnitureInfoParser.parse(worldMap, Format.TEXT);
    expect(furnitures.length).toEqual(1);
    expect(furnitures).toContainWorldItem({id: 'table-1', name: 'table', dimensions: Polygon.createRectangle(10, 2, 4, 2)});
});
