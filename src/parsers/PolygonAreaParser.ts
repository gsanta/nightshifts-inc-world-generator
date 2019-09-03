import { Matrix } from "./matrix/Matrix";
import _ = require("lodash");
import { WorldItem } from '../WorldItem';
import { Parser } from "./Parser";
import { WorldMapToMatrixGraphConverter } from "./reader/WorldMapToMatrixGraphConverter";
import { PolygonRedundantPointReducer } from "./PolygonRedundantPointReducer";
import { Polygon, Line, Point } from "@nightshifts.inc/geometry";
import { WorldItemFactoryService } from '../services/WorldItemFactoryService';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';

/**
 * @hidden
 *
 * Generates `WorldItem`s based on connected area of the given character. It can detect `Polygon` shaped
 * areas.
 */
export class PolygonAreaParser implements Parser {
    private polygonRedundantPointReducer: PolygonRedundantPointReducer;
    private worldItemInfoFactory: WorldItemFactoryService;
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private itemName: string;

    constructor(itemName: string, worldItemInfoFactory: WorldItemFactoryService, worldMapConverter = new WorldMapToMatrixGraphConverter()) {
        this.itemName = itemName;
        this.worldItemInfoFactory = worldItemInfoFactory;
        this.worldMapConverter = worldMapConverter;
        this.polygonRedundantPointReducer = new PolygonRedundantPointReducer();
    }

    public parse(worldMap: string): WorldItem[] {
        const graph = this.parseWorldMap(worldMap);
        const character = graph.getCharacterForName('empty');

        return graph.createConnectedComponentGraphsForCharacter(character)
            .map(componentGraph => {
                const lines = this.segmentGraphToHorizontalLines(componentGraph);

                const points = this.polygonRedundantPointReducer.reduce(
                    this.createPolygonPointsFromHorizontalLines(lines)
                );

                return this.worldItemInfoFactory.create(null, new Polygon(points), this.itemName, false);
            });
    }

    private parseWorldMap(strMap: string): Matrix {
        return this.worldMapConverter.convert(strMap);
    }

    /*
     * Converts the polygon points of the component graph to horizontal lines which
     * include all of the points in the graph.
     */
    private segmentGraphToHorizontalLines(componentGraph: Matrix): Segment[] {
        const map = new Map<Number, number[]>();

        componentGraph.getAllVertices()
            .forEach(vertex => {
                const position = componentGraph.getVertexPositionInMatrix(vertex);

                if (map.get(position.y) === undefined) {
                    map.set(position.y, []);
                }

                map.get(position.y).push(position.x);
            });

        const segments: Segment[] = [];

        map.forEach((xList: number[], yPos: number) => {
            xList.sort(PolygonAreaParser.sortByNumber);

            const xStart = xList[0];
            const xEnd = _.last(xList);

            segments.push(new Segment(new Point(xStart, yPos), new Point(xEnd, yPos)));
        });

        return segments;
    }

    private createPolygonPointsFromHorizontalLines(segments: Segment[]): Point[] {
        segments.sort((a: Segment, b: Segment) => a.getPoints()[0].y - b.getPoints()[0].y);

        const topPoints = [segments[0].getPoints()[0], segments[0].getPoints()[1].addX(1)];
        const bottomPoints = [_.last(segments).getPoints()[1].addY(1).addX(1), _.last(segments).getPoints()[0].addY(1)];

        let prevPoint = segments[0].getPoints()[1].addX(1);

        const rightPoints: Point[] = [];

        _.chain(segments)
            .without(_.first(segments))
            .map(line => line.getPoints()[1].addX(1))
            .forEach(point => {
                const newPoints = this.processNextPoint(point, prevPoint);
                rightPoints.push(...newPoints);

                prevPoint = _.last(newPoints);
            })
            .value();

        prevPoint = bottomPoints[1];
        const leftPoints: Point[] = [];

        segments = _.without(segments, _.first(segments));
        segments.reverse();

        _.chain(segments)
            .map(line => line.getPoints()[0])
            .forEach(point => {
                const newPoints = this.processNextPoint2(point, prevPoint);
                leftPoints.push(...newPoints);

                prevPoint = _.last(newPoints);
            })
            .value();


        return [...topPoints, ...rightPoints, ...bottomPoints, ...leftPoints];
    }

    private processNextPoint(actPoint: Point, prevPoint: Point): Point[] {
        const newPoints: Point[] = [];

        if (prevPoint.x !== actPoint.x) {
            newPoints.push(new Point(prevPoint.x, actPoint.y))
        }

        prevPoint = actPoint

        newPoints.push(actPoint);

        return newPoints;
    }

    private processNextPoint2(actPoint: Point, prevPoint: Point): Point[] {
        const newPoints: Point[] = [];

        if (prevPoint.x !== actPoint.x) {
            newPoints.push(new Point(actPoint.x, prevPoint.y))
        }

        prevPoint = actPoint

        newPoints.push(actPoint);

        return newPoints;
    }

    private static sortByNumber(a: number, b: number) {
        return a - b;
    }
}