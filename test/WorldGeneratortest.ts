import { Point, Polygon } from '@nightshifts.inc/geometry';
import { AssignBordersToRoomsModifier } from '../src/modifiers/AssignBordersToRoomsModifier';
import { BuildHierarchyModifier } from '../src/modifiers/BuildHierarchyModifier';
import { ScaleModifier } from '../src/modifiers/ScaleModifier';
import { SegmentBordersModifier } from '../src/modifiers/SegmentBordersModifier';
import { ServiceFacade } from '../src/services/ServiceFacade';
import { WorldItem } from '../src/WorldItemInfo';
import { setup } from './test_utils/mocks';
import _ = require('lodash');

function createMap(worldMap: string) {
    return `
        map \`

        ${worldMap}

        \`

        definitions \`

        - = empty
        W = wall
        I = window
        T = table
        D = door
        C = cupboard
        B = bed

        \`
    `;
}

describe('`WorldParser`', () => {
    describe('parse', () => {
        it ('creates a WorldItem for every distinguishable item in the input map', () => {
            const map = createMap(
                `
                WWWIIWWW
                W--TT--W
                WWWWWWWW
                `
            );

            let services: ServiceFacade<any, any, any> = setup({xScale: 1, yScale: 1});

            const [root] = services.importerService.import(map,[]);

            const children = root.children;
            expect(children.length).toEqual(7);
            expect(children[0])
                .toMatchObject(expect.objectContaining(<Partial<WorldItem>> {name: 'wall', dimensions: Polygon.createRectangle(0, 0, 1, 3), isBorder: true, rotation: Math.PI / 2}));
            expect(children[1])
                .toMatchObject(expect.objectContaining(<Partial<WorldItem>> {name: 'wall', dimensions: Polygon.createRectangle(7, 0, 1, 3), isBorder: true, rotation: Math.PI / 2}));

            expect(children[2])
                .toMatchObject(expect.objectContaining(<Partial<WorldItem>> {name: 'wall', dimensions: Polygon.createRectangle(0, 0, 3, 1), isBorder: true, rotation: 0}));
            expect(children[3])
                .toMatchObject(expect.objectContaining(<Partial<WorldItem>> {name: 'wall', dimensions: Polygon.createRectangle(0, 2, 8, 1), isBorder: true, rotation: 0}));
            expect(children[4])
                .toMatchObject(expect.objectContaining(<Partial<WorldItem>> {name: 'wall', dimensions: Polygon.createRectangle(5, 0, 3, 1), isBorder: true, rotation: 0}));
            expect(children[5])
                .toMatchObject(expect.objectContaining(<Partial<WorldItem>> {name: 'window', dimensions: Polygon.createRectangle(3, 0, 2, 1), isBorder: true, rotation: 0}));

            expect(children[6].name).toEqual('room');
        });

        it ('scales the polygons if scale option is changed.', () => {
            const map = createMap(
                `
                WIIWW
                W---W
                W---W
                WWDDW
                `
            );

            
            let services: ServiceFacade<any, any, any> = setup({xScale: 2, yScale: 3});

            const [root] = services.importerService.import(
                map,
                [
                    ScaleModifier.modName,
                    BuildHierarchyModifier.modName,
                    AssignBordersToRoomsModifier.modName
                ]
            );

            const rooms = root.children.filter(item => item.name === 'room');

            expect(rooms.length).toEqual(1);
            expect(rooms[0].dimensions.equalTo(new Polygon([
                new Point(2, 3),
                new Point(2, 9),
                new Point(8, 9),
                new Point(8, 3)
            ]))).toBeTruthy();
        });

        it ('adds the bordering `WorldItem`s to the corresponding rooms', () => {
            const map = createMap(
                `
                WWWDDWWWWWDDWWW
                WCCC---WBB----W
                WCCC---W------W
                W------WBB----W
                WWWWWWWWWWWWWWW
                `
            );

            let services: ServiceFacade<any, any, any> = setup({xScale: 1, yScale: 1});

            const [root] = services.importerService.import(
                map,
                [
                    ScaleModifier.modName,
                    SegmentBordersModifier.modName,
                    BuildHierarchyModifier.modName,
                    AssignBordersToRoomsModifier.modName
                ]
            );

            const [room1, room2] = root.children.filter(item => item.name === 'room');
            expect(room1.borderItems.length).toEqual(6);
            expect(room2.borderItems.length).toEqual(6);
        });
    });

    it ('integrates correctly the BorderItemSegmentingWorldItemGeneratorDecorator if used', () => {
        const map = createMap(
            `
            WWDDWWWDDWWW
            WCCC--WBB--W
            WCCC--W----W
            W-----WBB##W
            WWWWWWWWWWWW
            `
        );

        
        let services: ServiceFacade<any, any, any> = setup({xScale: 1, yScale: 1});

        const [root] = services.importerService.import(
            map,
            [
                ScaleModifier.modName,
                SegmentBordersModifier.modName,
                BuildHierarchyModifier.modName,
                AssignBordersToRoomsModifier.modName
            ]
        );

        const walls = root.children.filter(item => item.name === 'wall');

        expect(walls.length).toEqual(8);
    });

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

        let services: ServiceFacade<any, any, any> = setup({xScale: 1, yScale: 1});

        const [root] = services.importerService.import(
            map,
            [
                BuildHierarchyModifier.modName
            ]
        );

        expect(root.children.length).toEqual(2);
        expect(root.children[0].name).toEqual('room');
        const room = root.children[0];
        expect(room.children.length).toEqual(1);
        expect(room.children[0].name).toEqual('empty');
    });
});
