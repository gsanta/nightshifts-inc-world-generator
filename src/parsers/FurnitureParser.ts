import { Matrix } from './matrix/Matrix';
import { WorldItem } from '../WorldItem';
import { Parser } from './Parser';
import { WorldMapToMatrixGraphConverter } from './reader/WorldMapToMatrixGraphConverter';
import { Polygon } from '@nightshifts.inc/geometry';
import { WorldItemFactoryService } from '../services/WorldItemFactoryService';
import * as _ from 'lodash';
import { flat } from '../utils/ArrayUtils';

export class FurnitureParser implements Parser {
    private worldItemInfoFactory: WorldItemFactoryService
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private furnitureCharacters: string[];

    constructor(
        worldItemInfoFactory: WorldItemFactoryService,
        furnitureCharacters: string[],
        worldMapConverter = new WorldMapToMatrixGraphConverter(),
    ) {
        this.worldItemInfoFactory = worldItemInfoFactory;
        this.worldMapConverter = worldMapConverter;
        this.furnitureCharacters = furnitureCharacters;
    }

    public parse(worldMap: string): WorldItem[] {
        const graph = this.parseWorldMap(worldMap);
        const characters = this.furnitureCharacters.filter(name => graph.getCharacterForName(name)).map(name => graph.getCharacterForName(name));

        return flat<WorldItem>(
                characters
                .map((character) => {
                    return graph.findConnectedComponentsForCharacter(character)
                        .map(connectedComp => this.createGameObjectsForConnectedComponent(graph.getGraphForVertices(connectedComp)));
                }),
                2
        );
    }

    private parseWorldMap(strMap: string): Matrix {
        return this.worldMapConverter.convert(strMap);
    }

    private createGameObjectsForConnectedComponent(componentGraph: Matrix): WorldItem[] {
        if (this.areConnectedComponentsRectangular(componentGraph)) {
            return [this.createRectangularGameObject(componentGraph)];
        } else {
            return this.createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph);
        }
    }

    private createRectangularGameObject(componentGraph: Matrix): WorldItem {
        const minX = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).x).min().value();
        const maxX = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).x).max().value();
        const minY = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).y).min().value();
        const maxY = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).y).max().value();

        const oneVertex = componentGraph.getAllVertices()[0];

        const x = minX;
        const y = minY;
        const width = (maxX - minX + 1);
        const height = (maxY - minY + 1);
        return this.worldItemInfoFactory.create(
            componentGraph.getCharacters()[0],
            Polygon.createRectangle(x, y, width, height),
            componentGraph.getVertexName(oneVertex),
            false
        );
    }

    private createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph: Matrix): WorldItem[] {
        const verticalSubComponents = this.findVerticalSlices(componentGraph);
        const verticesMinusVerticalSubComponents = _.without(componentGraph.getAllVertices(), ..._.flatten(verticalSubComponents));
        const componentGraphMinusVerticalSubComponents = componentGraph.getGraphForVertices(verticesMinusVerticalSubComponents);

        const verticalGameObjects = verticalSubComponents
            .map(slice => {
                const gameObjectGraph = componentGraph.getGraphForVertices(slice);
                const rect = this.createRectangleFromVerticalVertices(gameObjectGraph)
                const oneVertex = componentGraph.getAllVertices()[0];
                return this.worldItemInfoFactory.create(
                    componentGraph.getCharacters()[0],
                    rect,
                    componentGraph.getVertexName(oneVertex),
                    false
                );
            });

        const horizontalGameObjects = componentGraphMinusVerticalSubComponents
            .findConnectedComponentsForCharacter(componentGraphMinusVerticalSubComponents.getCharacters()[0])
            .filter(comp => comp.length > 0)
            .map(comp => {
                const gameObjectGraph = componentGraph.getGraphForVertices(comp);
                const rect = this.createRectangleFromHorizontalVertices(gameObjectGraph);
                const oneVertex = componentGraph.getAllVertices()[0];

                return this.worldItemInfoFactory.create(
                    gameObjectGraph.getCharacters()[0],
                    rect,
                    componentGraph.getVertexName(oneVertex),
                    false
                );
            });

        return [...verticalGameObjects, ...horizontalGameObjects];
    }

    private areConnectedComponentsRectangular(componentGraph: Matrix) {
        const minX = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).x).min().value();
        const maxX = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).x).max().value();
        const minY = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).y).min().value();
        const maxY = _.chain(componentGraph.getAllVertices()).map(vertex => componentGraph.getVertexPositionInMatrix(vertex).y).max().value();

        const checkedVertices = [];

        if (maxX > minX && maxY > minY) {
            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    const vertex = componentGraph.getVertexAtPosition({x, y});

                    if (vertex === null) {
                        return false;
                    }

                    checkedVertices.push(vertex);
                }
            }
        }

        return _.without(componentGraph.getAllVertices(), ...checkedVertices).length === 0;
    }

    private findVerticalSlices(reducedGraph: Matrix): number[][] {
        const visitedVertices = [];

        let componentVertices = reducedGraph.getAllVertices();
        const verticalSubCompnents = [];

        while (componentVertices.length > 0) {
            let actVertex = componentVertices[0];
            if (reducedGraph.getBottomNeighbour(actVertex) !== null || reducedGraph.getTopNeighbour(actVertex) !== null) {
                const subComponentVertices = this.findVerticalSubComponentForVertex(actVertex, reducedGraph);
                verticalSubCompnents.push(subComponentVertices);
                visitedVertices.push(...subComponentVertices);
                componentVertices = _.without(componentVertices, ...subComponentVertices);
            } else {
                componentVertices = _.without(componentVertices, actVertex);
            }
        }

        return verticalSubCompnents;
    }

    private findVerticalSubComponentForVertex(vertex: number, componentGraph: Matrix): number[] {
        let subComponentVertices = [vertex];

        let actVertex = vertex;
        while (componentGraph.getTopNeighbour(actVertex) !== null) {
            subComponentVertices.push(componentGraph.getTopNeighbour(actVertex));
            actVertex = componentGraph.getTopNeighbour(actVertex);
        }

        actVertex = vertex;

        while (componentGraph.getBottomNeighbour(actVertex) !== null) {
            subComponentVertices.push(componentGraph.getBottomNeighbour(actVertex));
            actVertex = componentGraph.getBottomNeighbour(actVertex);
        }

        return subComponentVertices;
    }

    private createRectangleFromVerticalVertices(graph: Matrix) {
        const vertices = [...graph.getAllVertices()];
        vertices.sort((a, b) => graph.getVertexPositionInMatrix(a).y - graph.getVertexPositionInMatrix(b).y);

        const startCoord = graph.getVertexPositionInMatrix(vertices[0]);
        const endCoord = graph.getVertexPositionInMatrix(_.last(vertices));

        const x = startCoord.x;
        const y = startCoord.y;
        const width = 1;
        const height = endCoord.y - y + 1;

        return Polygon.createRectangle(x, y, width, height);
    }

    private createRectangleFromHorizontalVertices(graph: Matrix) {
        const vertices = [...graph.getAllVertices()];
        vertices.sort((a, b) => graph.getVertexPositionInMatrix(a).x - graph.getVertexPositionInMatrix(b).x);

        const startCoord = graph.getVertexPositionInMatrix(vertices[0]);
        const endCoord = graph.getVertexPositionInMatrix(_.last(vertices));

        const x = startCoord.x;
        const y = startCoord.y;
        const width = endCoord.x - x + 1;
        const height = 1;

        return Polygon.createRectangle(x, y, width, height);
    }

    private getAdditionalDataFromGameObjectGraph(graph: Matrix): any {
        return graph.getAllVertices().reduce((additionalData, vertex) => {
            return graph.getVertexValue(vertex).additionalData ? graph.getVertexValue(vertex).additionalData : additionalData
        }, null);
    }
}