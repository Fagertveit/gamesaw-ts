import { GeometricEnum, GeometricObject } from './geometry';

interface Pos {
    x: number;
    y: number;
}

export class Point implements GeometricObject, Pos {
    public type = GeometricEnum.POINT;
    public x = 0;
    public y = 0;

    constructor(x: number, y: number) {
        if (x) {
            this.x = x;
        }

        if (y) {
            this.y = y;
        }
    }

    public getType(): GeometricEnum {
        return this.type;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public setX(x: number) {
        this.x = x;
    }

    public setY(y: number) {
        this.y = y;
    }

    public set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public get(): Pos {
        return this;
    }

    public transform(x: number, y: number) {
        this.x += x;
        this.y += y;
    }
}
