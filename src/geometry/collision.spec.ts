/// <reference path="../../node_modules/@types/mocha/index.d.ts" />

import { expect } from 'chai';

import { Collider, intersects, Rectangle, Point, Circle } from './index';

describe('Collider', () => {
    it('Two circles should collide', () => {
        let circle1 = new Circle(100, 100, 50);
        let circle2 = new Circle(150, 100, 50);

        expect(intersects(circle1, circle2)).to.be.equal(true);
    });

    it('Two circles should\'nt collide', () => {
        let circle1 = new Circle(100, 100, 45);
        let circle2 = new Circle(200, 100, 50);

        expect(intersects(circle1, circle2)).to.be.equal(false);
    });

    it('Two rectangles should collide', () => {
        let rectangle1 = new Rectangle(100, 100, 100, 50);
        let rectangle2 = new Rectangle(150, 125, 100, 50);

        expect(intersects(rectangle1, rectangle2)).to.be.equal(true);
    });

    it('Two rectangles should\'nt collide', () => {
        let rectangle1 = new Rectangle(100, 100, 100, 50);
        let rectangle2 = new Rectangle(150, 160, 100, 50);

        expect(intersects(rectangle1, rectangle2)).to.be.equal(false);
    });

    it('Point should be inside circle', () => {
        let point = new Point(100, 100);
        let circle = new Circle(125, 125, 50);

        expect(intersects(point, circle)).to.be.equal(true);
    });

    it('Point should\'nt be inside circle', () => {
        let point = new Point(100, 100);
        let circle = new Circle(125, 125, 20);

        expect(intersects(point, circle)).to.be.equal(false);
    });

    it('Point should be inside rectangle', () => {
        let point = new Point(100, 100);
        let rectangle = new Rectangle(90, 90, 50, 50);

        expect(intersects(point, rectangle)).to.be.equal(true);
    });

    it('Point should\'nt be inside rectangle', () => {
        let point = new Point(100, 100);
        let rectangle = new Rectangle(110, 100, 50, 50);

        expect(intersects(point, rectangle)).to.be.equal(false);
    });
});
