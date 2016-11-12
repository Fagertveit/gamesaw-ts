import { GeometricEnum, GeometricObject } from './geometry';
import { Point } from './point';

export class AABB implements GeometricObject {
    public type = GeometricEnum.AABB;
    public pos: Point = new Point(0, 0);
    public halfWidth = 1;
    public halfHeight = 1;

    constructor(x: number, y: number, halfWidth: number, halfHeight: number) {

    }
}
