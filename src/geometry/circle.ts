import { GeometricEnum, GeometricObject } from './geometry';
import { Point } from './point';

export class Circle implements GeometricObject {
    public type = GeometricEnum.CIRCLE;
    public pos: Point = new Point(0, 0);
    public radius: number = 1;

    constructor(x: number, y: number) {
        if (x) {
            this.pos.x = x;
        }

        if (y) {
            this.pos.y = y;
        }
    }

    public getType(): GeometricEnum {
        return this.type;
    }

    public getX(): number {
        return this.pos.x;
    }

    public getY(): number {
        return this.pos.y;
    }

    public setX(x: number) {
        this.pos.x = x;
    }

    public setY(y: number) {
        this.pos.y = y;
    }

    public set(x: number, y: number, radius: number) {
        this.pos.x = x;
        this.pos.y = y;
        this.radius = radius;
    }

    public get(): Circle {
        return this;
    }

    public transform(x: number, y: number) {
        this.pos.x += x;
        this.pos.y += y;
    }
}
