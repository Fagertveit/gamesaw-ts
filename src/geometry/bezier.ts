import { GeometricEnum, GeometricObject } from './geometry';
import { Vector2 } from './vector2d';
import { Point } from './point';

export class Bezier implements GeometricObject {
    public type = GeometricEnum.BEZIER;
    public start: Vector2 = new Vector2(0.0, 0.0);
    public end: Vector2 = new Vector2(1.0, 0.0);
    public controlStart: Vector2 = new Vector2(0.0, 0.0);
    public controlEnd: Vector2 = new Vector2(1.0, 0.0);

    constructor(startX: number, startY: number, endX: number, endY: number) {
        this.start.set(startX, startY);
        this.controlStart.set(startX, startY);
        this.end.set(endX, endY);
        this.controlEnd.set(endX, endY);
    }

    public getPoint(t: number): Vector2 {
        let point: Vector2 = new Vector2(this.start.x, this.start.y);

        if (t !== 0) {
            let u: number = 1 - t;
            let tt: number = t * t;
            let uu: number = u * u;
            let uuu: number = uu * u;
            let ttt: number = tt * t;

            point = this.start.scale(uuu);
            point = point.add(this.controlStart.scale(3 * uu * t));
            point = point.add(this.controlEnd.scale(3 * u * tt));
            point = point.add(this.end.scale(ttt));
        }

        return point;
    }
}
