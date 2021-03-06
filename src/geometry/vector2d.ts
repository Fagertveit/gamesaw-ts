import { GeometricEnum, GeometricObject } from './geometry';
import { EPSILON, PI } from '../utility/utility';

export interface Vec2 {
    x: number;
    y: number;
}

export class Vector2 implements GeometricObject, Vec2 {
    public type = GeometricEnum.VECTOR2;
    public x: number = 0.0;
    public y: number = 0.0;

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

    public get(): Vec2 {
        return this;
    }

    public add(v2: Vec2): Vector2 {
        return new Vector2(this.x + v2.x, this.y + v2.y);
    }

    public sub(v2: Vec2): Vector2 {
        return new Vector2(this.x - v2.x, this.y - v2.y);
    }

    public mul(v2: Vec2): Vector2 {
        return new Vector2(this.x * v2.x, this.y * v2.y);
    }

    public invert(): Vector2 {
        return new Vector2(-this.x, -this.y);
    }

    public invertX(): Vector2 {
        return new Vector2(-this.x, this.y);
    }

    public invertY(): Vector2 {
        return new Vector2(this.x, -this.y);
    }

    public scale(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    public normalize(): Vector2 {
        let length = this.length();

        if (length === 0) {
            return new Vector2(0.0, 0.0);
        }

        return new Vector2(this.x / length, this.y / length);
    }

    public project(v2: Vec2): Vector2 {
        let dot = this.dot(v2);
        let length = this.lengthSquared();

        return new Vector2((dot / length) * this.x, (dot / length) * this.y);
    }

    public length(): number {
        return Math.sqrt(this.lengthSquared());
    }

    public lengthSquared(): number {
        return (this.x * this.x) + (this.y * this.y);
    }

    public dot(v2: Vec2): number {
        return ((this.x * v2.x) + (this.y * v2.y));
    }

    public cross(v2: Vec2): number {
        return ((this.x * v2.y) - (v2.x * this.y));
    }

    public angle(): number {
        return Math.atan2(this.x, -this.y);
    }

    public copy(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    public rotate(radian: number): Vector2 {
        if (this.x === 0) {
            this.x += EPSILON;
        }

        if (this.y === 0) {
            this.y += EPSILON;
        }

        return new Vector2(Math.cos(radian) * this.x - Math.sin(radian) * this.y,
            Math.sin(radian) * this.x + Math.cos(radian) * this.y);
    }

    public rotatePivot(x: number, y: number, radian: number): Vector2 {
        if (this.x === 0) {
            this.x += EPSILON;
        }

        if (this.y === 0) {
            this.y += EPSILON;
        }

        let srcX = this.x;
        let srcY = this.y;

        srcX -= x;
        srcY -= y;

        return new Vector2((Math.cos(radian) * srcX - Math.sin(radian) * srcY) + x,
            (Math.sin(radian) * srcX + Math.cos(radian) * srcY) + y);
    }
}
