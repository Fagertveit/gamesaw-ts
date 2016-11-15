import { GeometricEnum, GeometricName, GeometricObject } from './geometry';
import { capitalize } from '../utility/utility';
import {
    Vector2,
    Point,
    Vector3,
    Line,
    Circle,
    Rectangle,
    AABB,
    Polygon,
    Bezier,
    BSpline
} from './index';

export function intersects(obj0: GeometricObject, obj1: GeometricObject): boolean {
    let collider = new Collider();

    return collider.intersects(obj0, obj1);
};

export class Collider {

    constructor() {}

    public intersects(obj0: GeometricObject, obj1: GeometricObject): boolean {
        let intersects = false;
        /*
        if (typeof(this[GeometricName[obj0.type] + capitalize(GeometricName[obj1.type])]) === 'function') {
            intersects = this[GeometricName[obj0.type] + capitalize(GeometricName[obj1.type])](obj0, obj1);
        } else if (typeof(this[GeometricName[obj0.type] + capitalize(GeometricName[obj1.type])]) === 'function') {
            intersects = this[GeometricName[obj0.type] + capitalize(GeometricName[obj1.type])](obj1, obj0);
        } else {
            new Error('No collider found for geometric objects.');
        }
        */
        return intersects;
    }

    public pointLine(): boolean {
        return true;
    }

    public pointCircle(obj0: Point, obj1: Circle): boolean {
        let v0: Vector2 = new Vector2(obj0.x, obj0.y);
        let v1: Vector2 = new Vector2(obj1.pos.x, obj1.pos.y);
        let len: number = v1.sub(v0).length();

        return len < obj1.radius;
    }

    public pointRectangle(obj0: Point, obj1: Rectangle): boolean {
        return (obj0.x > obj1.pos.x && obj0.x < obj1.pos.x + obj1.width &&
                obj0.y > obj1.pos.y && obj0.y < obj1.pos.y + obj1.height);
    }

    public pointPolygon(): boolean {
        return true;
    }

    public lineLine(): boolean {
        return true;
    }

    public lineCircle(): boolean {
        return true;
    }

    public lineRectangle(): boolean {
        return true;
    }

    public linePolygon(): boolean {
        return true;
    }

    public circleCircle(obj0: Circle, obj1: Circle): boolean {
        let v0: Vector2 = new Vector2(obj0.pos.x, obj0.pos.y);
        let v1: Vector2 = new Vector2(obj1.pos.x, obj1.pos.y);
        let len: number = v1.sub(v0).length();
        let cRadi: number = obj0.radius + obj1.radius;

        return len < cRadi;
    }

    public circleRectangle(): boolean {
        return true;
    }

    public circlePolygon(): boolean {
        return true;
    }

    public rectangleRectangle(obj0: Rectangle, obj1: Rectangle): boolean {
        return (obj0.pos.x + obj0.width >= obj1.pos.x &&
                obj0.pos.y + obj0.height >= obj1.pos.y &&
                obj0.pos.x <= obj1.pos.x + obj1.width &&
                obj0.pos.y <= obj1.pos.y + obj1.height);
    }

    public rectanglePolygon(): boolean {
        return true;
    }

    public polygonPolygon(): boolean {
        return true;
    }
}
