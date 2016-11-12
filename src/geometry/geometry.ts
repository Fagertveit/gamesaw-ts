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

export interface GeometricObject {
    type: GeometricEnum;
}
