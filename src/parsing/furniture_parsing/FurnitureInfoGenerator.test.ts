import { LinesToGraphConverter } from '../../matrix_graph/conversion/LinesToGraphConverter';
import { FurnitureInfoGenerator } from './FurnitureInfoGenerator';
import { expect } from 'chai';
import { GwmWorldItem } from '../../model/GwmWorldItem';
import { Rectangle } from '../../model/Rectangle';

describe('FurnitureInfoGenerator', () => {
    describe('generate', () => {
        it ('creates world items from the graph (test case with one connected component)', () => {
            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse(
                [
                    '######',
                    '#WWWWW',
                    '#W#W##',
                    '######'
                ],
                {
                    W: 'wall',
                    '#': 'empty'
                },
                {}
            );


            const graphToWorldItemListConverter = new FurnitureInfoGenerator();
            const worldItems = graphToWorldItemListConverter.generate(graph);

            expect(worldItems.length).to.eql(4);
            const firstItem = worldItems[0];
            expect(firstItem).to.eql(new GwmWorldItem('W', new Rectangle(1, 1, 1, 2), 'wall'));
            const secondItem = worldItems[1];
            expect(secondItem).to.eql(new GwmWorldItem('W', new Rectangle(3, 1, 1, 2), 'wall'));
        });

        it ('creates world items from the graph (test case with multiple connected components)', () => {
            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse(
                [
                    '######',
                    '#WWWW#',
                    '#W####',
                    '##WW##'
                ],
                {
                    W: 'wall',
                    '#': 'empty'
                },
                {}
            );


            const graphToWorldItemListConverter = new FurnitureInfoGenerator();
            const worldItems = graphToWorldItemListConverter.generate(graph);

            expect(worldItems.length).to.eql(3);
            const firstItem = worldItems[0];
            expect(firstItem).to.eql(new GwmWorldItem('W', new Rectangle(1, 1, 1, 2), 'wall'));
            const thirdItem = worldItems[2];
            expect(thirdItem).to.eql(new GwmWorldItem('W', new Rectangle(2, 3, 2, 1), 'wall'));
        });

        it ('creates one world item for a rectangular connected component', () => {
            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse(
                [
                    '#DD###',
                    '#DD###',
                    '#DD###',
                    '######'
                ],
                {
                    D: 'door',
                    '#': 'empty'
                },
                {}
            );


            const graphToWorldItemListConverter = new FurnitureInfoGenerator();
            const worldItems = graphToWorldItemListConverter.generate(graph);
            expect(worldItems.length).to.equal(1);
            expect(worldItems[0]).to.eql(new GwmWorldItem('D', new Rectangle(1, 0, 2, 3), 'door'));
        });
    });
});
