import { Point } from './Point';
import { Rectangle } from './Rectangle';
import { GeometryPrimitive } from './Shape';

export class LineSegment implements GeometryPrimitive {
    point1: Point;
    point2: Point;
    
    constructor(point1: Point, point2: Point) {
        this.point1 = point1;
        this.point2 = point2;
    }

    public translate(point: Point): GeometryPrimitive {
        const point0 = this.point1.addX(point.x).addY(point.y);
        const point1 = this.point2.addX(point.x).addY(point.y);
        return new LineSegment(point0, point1);
    }

    public clone(): GeometryPrimitive {
        return new LineSegment(this.point1, this.point2);
    }

    public getBoundingRectangle(): Rectangle {
        let [x1, x2] = [this.point1.x, this.point2.x];
        let [y1, y2] = [this.point1.y, this.point2.y];

        [x1, x2] = x1 < x2 ? [x1, x2] : [x2, x1];
        [y1, y2] = y1 < y2 ? [y1, y2] : [y2, y1];

        return new Rectangle(new Point(x1, y1), new Point(x2, y2));
    }

    public getBoundingCenter(): Point {
        return new Point((this.point1.x + this.point2.x) / 2, (this.point1.y + this.point2.y) / 2);
    }

    public getEdges(): LineSegment[] {
        return [this];
    }

    toVector(): Point {
        return new Point(this.point2.x - this.point1.x, this.point2.y - this.point1.y);
    }

    getPointAtRatio(ratio: number) {
        const vector = this.toVector();
        const x = vector.x * ratio + this.point1.x;
        const y = vector.y * ratio + this.point1.y;
        return new Point(x, y);
    }

    public scale(scalePoint: Point): LineSegment {
        const point0 = this.point1.scaleX(scalePoint.x).scaleY(scalePoint.y);
        const point1 = this.point2.scaleX(scalePoint.x).scaleY(scalePoint.y);
        return new LineSegment(point0, point1);
    }

    public equalTo(otherLine: LineSegment): boolean {
        return this.point1.equalTo(otherLine.point1) && this.point2.equalTo(otherLine.point2);
    }

    getInnerPointAtT(ratio: number): Point {
        const x = this.point1.x + (this.point2.x - this.point1.x) / ratio;
        const y = this.point1.y + (this.point2.y - this.point1.y) / ratio;
        return new Point(x, y);
    }

    public getLength(): number {
        const xDistance = Math.abs(this.point1.x - this.point2.x);
        const yDistance = Math.abs(this.point1.y - this.point2.y);

        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }

    public toString(): string {
        return `[${this.point1.toString()},${this.point2.toString()}]`;
    }
}