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

    }
}
