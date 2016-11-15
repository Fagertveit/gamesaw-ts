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
