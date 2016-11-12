import { GeometricEnum, GeometricObject } from './geometry';
import { Point } from './point';

export class Rectangle implements GeometricObject {
    public type = GeometricEnum.RECTANGLE;
    public pos: Point = new Point(0, 0);
    public width = 1;
    public height = 1;

    constructor(x: number, y: number, width: number, height: number) {

    }
}
