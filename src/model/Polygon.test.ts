import { Polygon } from './Polygon';
import { Point } from './Point';
import { expect } from 'chai';
import { Rectangle } from './Rectangle';


describe('Polygon', () => {
    describe('overlaps', () => {
        it ('returns true if the polygon contains the other', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 4),
                new Point(1, 4)
            ]);

            const poly2 = new Polygon([
                new Point(2, 1),
                new Point(3, 1),
                new Point(3, 4),
                new Point(2, 4)
            ]);

            expect(poly1.overlaps(poly2)).to.eql(true);
        });

        it ('returns false if the two polygons intersect', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 4),
                new Point(1, 4)
            ]);

            const poly2 = new Polygon([
                new Point(2, 1),
                new Point(4, 1),
                new Point(4, 4),
                new Point(2, 4)
            ]);

            expect(poly1.overlaps(poly2)).to.eql(false);
        });

        it ('returns false if the two polygons do have any common parts', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 4),
                new Point(1, 4)
            ]);

            const poly2 = new Polygon([
                new Point(4, 1),
                new Point(5, 1),
                new Point(5, 4),
                new Point(4, 4)
            ]);

            expect(poly1.overlaps(poly2)).to.eql(false);
        });
    });

    describe('scaleX', () => {
        it ('scales the polygon on the x axis', () => {
            const polygon = new Rectangle(1, 2, 3, 2);
            expect(polygon.scaleX(3)).to.eql(new Rectangle(3, 2, 9, 2));
        });
    });

    describe('scaleY', () => {
        it ('scales the polygon on the y axis', () => {
            const polygon = new Rectangle(1, 2, 1, 3);
            expect(polygon.scaleY(3)).to.eql(new Rectangle(1, 6, 1, 9));
        });
    });
});