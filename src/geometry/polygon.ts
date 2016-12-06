import { GeometricEnum, GeometricObject } from './geometry';
import { Point } from './point';

export class Polygon implements GeometricObject {
    public type = GeometricEnum.POLYGON;
    public points: Point[] = [
        new Point(0, 0),
        new Point(1, -1),
        new Point(-1, -1)
    ];

    constructor(points: Point[]) {
        this.points = points;
    }

    public addPoint(point: Point): void {
        this.points.push(point);
    }

    public removePoint(index: number): void {
        this.points.splice(index, 1);
    }

    public removeFirst(): void {
        this.points.shift();
    }

    public removeLast(): void {
        this.points.pop();
    }
}
