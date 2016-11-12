import { GeometricEnum, GeometricObject } from './geometry';
import { Point } from './point';

export class Line implements GeometricObject {
    public type = GeometricEnum.LINE;
    public start = new Point(-1, 0);
    public end = new Point(1, 0);

    constructor(x0: number, y0: number, x1: number, y1: number) {
        if (x0 && y0) {
            this.start.set(x0, y0);
        }

        if (x1 && y1) {
            this.end.set(x1, y1);
        }
    }

    public transform(x: number, y: number) {
        this.start.transform(x, y);
        this.end.transform(x, y);
    }

    public transformStart(x: number, y: number) {
        this.start.transform(x, y);
    }

    public transformEnd(x: number, y: number) {
        this.end.transform(x, y);
    }

    public set(x0: number, y0: number, x1: number, y1: number) {
        this.start.set(x0, y0);
        this.end.set(x1, y1);
    }
}
