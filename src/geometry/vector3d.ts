import { GeometricEnum, GeometricObject } from './geometry';

export interface Vec3 {
    x: number;
    y: number;
    z: number;
}

export class Vector3 implements GeometricObject, Vec3 {
    public type = GeometricEnum.VECTOR3;
    public x: number = 0.0;
    public y: number = 0.0;
    public z: number = 0.0;

    constructor(x: number, y: number, z: number) {
        if (x) {
            this.x = x;
        }

        if (y) {
            this.y = y;
        }

        if (z) {
            this.z = z;
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

    public getZ(): number {
        return this.z;
    }

    public setX(x: number) {
        this.x = x;
    }

    public setY(y: number) {
        this.y = y;
    }

    public setZ(z: number) {
        this.z = z;
    }

    public set(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public get(): Vec3 {
        return this;
    }

    public add(v2: Vec3): Vector3 {
        return new Vector3(this.x + v2.x, this.y + v2.y, this.z + v2.z);
    }

    public sub(v2: Vec3): Vector3 {
        return new Vector3(this.x - v2.x, this.y - v2.y, this.z - v2.z);
    }

    public invert(): Vector3 {
        return new Vector3(-this.x, -this.y, -this.z);
    }

    public scale(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    public normalize(): Vector3 {
        let length = this.length();

        if (length === 0) {
            return new Vector3(0.0, 0.0, 0.0);
        }

        return new Vector3(this.x / length, this.y / length, this.z / length);
    }

    public project(v2: Vec3): Vector3 {
        let dot = this.dot(v2);
        let length = this.lengthSquared();

        return new Vector3((dot / length) * this.x, (dot / length) * this.y, (dot / length) * this.z);
    }

    public length(): number {
        return Math.sqrt(this.lengthSquared());
    }

    public lengthSquared(): number {
        return (this.x * this.x) + (this.y * this.y) + (this.z * this.z);
    }

    public dot(v2: Vec3): number {
        return ((this.x * v2.x) + (this.y * v2.y) + (this.z * v2.z));
    }
}
