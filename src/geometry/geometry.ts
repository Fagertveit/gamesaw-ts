import { Vector2 } from './vector2d';
import { Point } from './point';

export enum GeometricEnum {
    POINT,
    CIRCLE,
    VECTOR2,
    VECTOR3,
    LINE,
    TRIANGLE,
    RECTANGLE,
    AABB,
    POLYGON,
    BEZIER,
    BSPLINE
};

export const GeometricName: string[] = [
    'point',
    'circle',
    'vector2',
    'vector3',
    'line',
    'triangle',
    'rectangle',
    'aabb',
    'polygon',
    'bezier',
    'bspline'
];

export interface GeometricObject {
    type: GeometricEnum;
}

export function getNormal(p0: Point, p1: Point): Vector2 {
    let vec = new Vector2(p1.x, p1.y);
    vec = vec.sub(new Vector2(p0.x, p0.y));

    vec = new Vector2(vec.y, -vec.x);
    vec = vec.normalize();

    return vec;
}

export function getDistance(v0: Vector2, v1: Vector2): number {
    return v1.sub(v0).length();
}
