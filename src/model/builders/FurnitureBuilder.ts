import { Polygon } from '@nightshifts.inc/geometry';
import { WorldItem } from '../../WorldItem';
import { WorldMapGraph } from '../../WorldMapGraph';
import { WorldMapReader } from '../readers/WorldMapReader';
import { ServiceFacade } from '../services/ServiceFacade';
import { flat, last, maxBy, minBy, without } from '../utils/Functions';
import { WorldItemBuilder } from './WorldItemBuilder';

export class FurnitureBuilder implements WorldItemBuilder {
    private worldMapReader: WorldMapReader
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>, worldMapReader: WorldMapReader) {
        this.services = services;
        this.worldMapReader = worldMapReader;
    }

    parse(worldMap: string): WorldItem[] {
        const graph = this.worldMapReader.read(worldMap);
        const types = this.services.configService.furnitures
            .filter(furniture => graph.hasType(furniture.typeName))
            .map(furniture => furniture.typeName);

        return flat<WorldItem>(
                types
                .map((type) => {
                    return graph
                        .getReducedGraphForTypes([type])
                        .getConnectedComponentGraphs()
                        .map(connectedCompGraph => this.createGameObjectsForConnectedComponent(connectedCompGraph));
                }),
                2
        );
    }

    private createGameObjectsForConnectedComponent(componentGraph: WorldMapGraph): WorldItem[] {
        if (this.areConnectedComponentsRectangular(componentGraph)) {
            return [this.createRectangularGameObject(componentGraph)];
        } else {
            return this.createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph);
        }
    }

    private createRectangularGameObject(componentGraph: WorldMapGraph): WorldItem {
        const vertexPositions = componentGraph.getAllVertices().map(vertex => componentGraph.getVertexPositionInMatrix(vertex));
        const minX = minBy<{x: number, y: number}>(vertexPositions, (a, b) => a.x - b.x).x;
        const maxX = maxBy<{x: number, y: number}>(vertexPositions, (a, b) => a.x - b.x).x;
        const minY = minBy<{x: number, y: number}>(vertexPositions, (a, b) => a.y - b.y).y;
        const maxY = maxBy<{x: number, y: number}>(vertexPositions, (a, b) => a.y - b.y).y;

        const x = minX;
        const y = minY;
        const width = (maxX - minX + 1);
        const height = (maxY - minY + 1);
        const type = componentGraph.getTypes()[0];
        return this.services.worldItemFactoryService.create({
            type: this.services.configService.getMeshDescriptorByType(type).char,
            dimensions: Polygon.createRectangle(x, y, width, height),
            name: type,
            isBorder: false
        });
    }

    private createGameObjectsBySplittingTheComponentToVerticalAndHorizontalSlices(componentGraph: WorldMapGraph): WorldItem[] {
        const verticalSubComponents = this.findVerticalSlices(componentGraph);
        const verticesMinusVerticalSubComponents = <number[]> without(componentGraph.getAllVertices(), ...flat(verticalSubComponents, 2));
        const componentGraphMinusVerticalSubComponents = componentGraph.getGraphForVertices(verticesMinusVerticalSubComponents);

        const verticalGameObjects = verticalSubComponents
            .map(slice => {
                const gameObjectGraph = componentGraph.getGraphForVertices(slice);
                const rect = this.createRectangleFromVerticalVertices(gameObjectGraph)
                const type = componentGraph.getTypes()[0];

                return this.services.worldItemFactoryService.create({
                    type: this.services.configService.getMeshDescriptorByType(type).char,
                    dimensions: rect,
                    name: type,
                    isBorder: false
                });
            });

        const horizontalGameObjects = componentGraphMinusVerticalSubComponents
            .getReducedGraphForTypes([componentGraphMinusVerticalSubComponents.getTypes()[0]])
            .getConnectedComponentGraphs()
            .filter(connectedCompGraph => connectedCompGraph.size() > 0)
            .map(connectedCompGraph => {
                const rect = this.createRectangleFromHorizontalVertices(connectedCompGraph);

                const type = componentGraph.getTypes()[0];
                return this.services.worldItemFactoryService.create({
                    type: this.services.configService.getMeshDescriptorByType(type).char,
                    dimensions: rect,
                    name: type,
                    isBorder: false
                });
            });

        return [...verticalGameObjects, ...horizontalGameObjects];
    }

    private areConnectedComponentsRectangular(componentGraph: WorldMapGraph) {
        const vertexPositions = componentGraph.getAllVertices().map(vertex => componentGraph.getVertexPositionInMatrix(vertex));

        const minX = minBy<{x: number, y: number}>(vertexPositions, (a, b) => a.x - b.x).x;
        const maxX = maxBy<{x: number, y: number}>(vertexPositions, (a, b) => a.x - b.x).x;
        const minY = minBy<{x: number, y: number}>(vertexPositions, (a, b) => a.y - b.y).y;
        const maxY = maxBy<{x: number, y: number}>(vertexPositions, (a, b) => a.y - b.y).y;

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

        return without(componentGraph.getAllVertices(), ...checkedVertices).length === 0;
    }

    private findVerticalSlices(reducedGraph: WorldMapGraph): number[][] {
        const visitedVertices = [];

        let componentVertices = reducedGraph.getAllVertices();
        const verticalSubCompnents = [];

        while (componentVertices.length > 0) {
            let actVertex = componentVertices[0];
            if (reducedGraph.getBottomNeighbour(actVertex) !== null || reducedGraph.getTopNeighbour(actVertex) !== null) {
                const subComponentVertices = this.findVerticalSubComponentForVertex(actVertex, reducedGraph);
                verticalSubCompnents.push(subComponentVertices);
                visitedVertices.push(...subComponentVertices);
                componentVertices = without(componentVertices, ...subComponentVertices);
            } else {
                componentVertices = without(componentVertices, actVertex);
            }
        }

        return verticalSubCompnents;
    }

    private findVerticalSubComponentForVertex(vertex: number, componentGraph: WorldMapGraph): number[] {
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

    private createRectangleFromVerticalVertices(graph: WorldMapGraph) {
        const vertices = [...graph.getAllVertices()];
        vertices.sort((a, b) => graph.getVertexPositionInMatrix(a).y - graph.getVertexPositionInMatrix(b).y);

        const startCoord = graph.getVertexPositionInMatrix(vertices[0]);
        const endCoord = graph.getVertexPositionInMatrix(last(vertices));

        const x = startCoord.x;
        const y = startCoord.y;
        const width = 1;
        const height = endCoord.y - y + 1;

        return Polygon.createRectangle(x, y, width, height);
    }

    private createRectangleFromHorizontalVertices(graph: WorldMapGraph) {
        const vertices = [...graph.getAllVertices()];
        vertices.sort((a, b) => graph.getVertexPositionInMatrix(a).x - graph.getVertexPositionInMatrix(b).x);

        const startCoord = graph.getVertexPositionInMatrix(vertices[0]);
        const endCoord = graph.getVertexPositionInMatrix(last(vertices));

        const x = startCoord.x;
        const y = startCoord.y;
        const width = endCoord.x - x + 1;
        const height = 1;

        return Polygon.createRectangle(x, y, width, height);
    }
}