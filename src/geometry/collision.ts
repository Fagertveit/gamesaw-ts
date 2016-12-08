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
        // Need to check the first object if we can use it as main collider body
        switch (obj0.type) {
            case GeometricEnum.POINT:
            switch (obj1.type) {
                case GeometricEnum.LINE:
                return this.pointLine();
                case GeometricEnum.CIRCLE:
                return this.pointCircle(obj0 as Point, obj1 as Circle);
                case GeometricEnum.RECTANGLE:
                return this.pointRectangle(obj0 as Point, obj1 as Rectangle);
                case GeometricEnum.AABB:
                return this.pointAABB(obj0 as Point, obj1 as AABB);
                case GeometricEnum.POLYGON:
                return this.pointPolygon();
                default:
                throw new Error('Second object not a collidable body');
            }
            case GeometricEnum.LINE:
            switch (obj1.type) {
                case GeometricEnum.POINT:
                return this.linePoint();
                case GeometricEnum.CIRCLE:
                return this.lineCircle();
                case GeometricEnum.RECTANGLE:
                return this.lineRectangle();
                case GeometricEnum.POLYGON:
                return this.linePolygon();
                default:
                throw new Error('Second object not a collidable body');
            }
            case GeometricEnum.CIRCLE:
            switch (obj1.type) {
                case GeometricEnum.CIRCLE:
                return this.circleCircle(obj0 as Circle, obj1 as Circle);
                case GeometricEnum.LINE:
                return this.circleLine();
                case GeometricEnum.POINT:
                return this.circlePoint(obj0 as Circle, obj1 as Point);
                case GeometricEnum.RECTANGLE:
                return this.circleRectangle();
                case GeometricEnum.AABB:
                return this.circleAABB(obj0 as Circle, obj1 as AABB);
                case GeometricEnum.POLYGON:
                return this.circlePolygon(obj0 as Circle, obj1 as Polygon);
                default:
                throw new Error('Second object not a collidable body');
            }
            case GeometricEnum.RECTANGLE:
            switch (obj1.type) {
                case GeometricEnum.RECTANGLE:
                return this.rectangleRectangle(obj0 as Rectangle, obj1 as Rectangle);
                case GeometricEnum.AABB:
                return this.rectangleAABB(obj0 as Rectangle, obj1 as AABB);
                case GeometricEnum.LINE:
                return this.rectangleLine();
                case GeometricEnum.CIRCLE:
                return this.rectangleCircle();
                case GeometricEnum.POINT:
                return this.rectanglePoint(obj0 as Rectangle, obj1 as Point);
                case GeometricEnum.POLYGON:
                return this.rectanglePolygon();
                default:
                throw new Error('Second object not a collidable body');
            }
            case GeometricEnum.POLYGON:
            switch (obj1.type) {
                case GeometricEnum.POLYGON:
                return this.polygonPolygon();
                case GeometricEnum.LINE:
                return this.polygonLine();
                case GeometricEnum.CIRCLE:
                return this.polygonCircle(obj0 as Polygon, obj1 as Circle);
                case GeometricEnum.RECTANGLE:
                return this.polygonRectangle();
                case GeometricEnum.POINT:
                return this.polygonPoint();
                default:
                throw new Error('Second object not a collidable body');
            }
            case GeometricEnum.AABB:
            switch (obj1.type) {
                case GeometricEnum.AABB:
                return this.aabbAABB(obj0 as AABB, obj1 as AABB);
                case GeometricEnum.POINT:
                return this.aabbPoint(obj0 as AABB, obj1 as Point);
                case GeometricEnum.CIRCLE:
                return this.aabbCircle(obj0 as AABB, obj1 as Circle);
                case GeometricEnum.RECTANGLE:
                return this.aabbRectangle(obj0 as AABB, obj1 as Rectangle);
            }
            default:
                throw new Error('Couldn\'t find any collider for type');
        }
    }

    public pointLine(): boolean {
        return true;
    }
    public linePoint(): boolean {
        return true;
    }

    public pointCircle(obj0: Point, obj1: Circle): boolean {
        let v0: Vector2 = new Vector2(obj0.x, obj0.y);
        let v1: Vector2 = new Vector2(obj1.pos.x, obj1.pos.y);
        let len: number = v1.sub(v0).length();

        return len < obj1.radius;
    }
    public circlePoint(obj0: Circle, obj1: Point): boolean {
        return this.pointCircle(obj1, obj0);
    }

    public pointRectangle(obj0: Point, obj1: Rectangle): boolean {
        return (obj0.x > obj1.pos.x && obj0.x < obj1.pos.x + obj1.width &&
                obj0.y > obj1.pos.y && obj0.y < obj1.pos.y + obj1.height);
    }
    public rectanglePoint(obj0: Rectangle, obj1: Point): boolean {
        return this.pointRectangle(obj1, obj0);
    }

    public pointPolygon(): boolean {
        return true;
    }
    public polygonPoint(): boolean {
        return this.pointPolygon();
    }

    public lineLine(): boolean {
        return true;
    }

    public lineCircle(): boolean {
        return true;
    }
    public circleLine(): boolean {
        return this.lineCircle();
    }

    public lineRectangle(): boolean {
        return true;
    }
    public rectangleLine(): boolean {
        return this.lineRectangle();
    }

    public linePolygon(): boolean {
        return true;
    }
    public polygonLine(): boolean {
        return this.linePolygon();
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
    public rectangleCircle(): boolean {
        return this.circleRectangle();
    }

    public circlePolygon(obj0: Circle, obj1: Polygon): boolean {
        return true;
    }
    public polygonCircle(obj0: Polygon, obj1: Circle): boolean {
        return this.circlePolygon(obj1, obj0);
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
    public polygonRectangle(): boolean {
        return this.rectanglePolygon();
    }

    public polygonPolygon(): boolean {
        return true;
    }

    public pointAABB(obj0: Point, obj1: AABB): boolean {
        if (Math.abs(obj1.pos.x - obj0.x) > obj1.halfWidth) {
            return false;
        } else if (Math.abs(obj1.pos.y - obj0.y) > obj1.halfHeight) {
            return false;
        } else {
            return true;
        }
    }
    public aabbPoint(obj0: AABB, obj1: Point): boolean {
        return this.pointAABB(obj1, obj0);
    }

    public circleAABB(obj0: Circle, obj1: AABB): boolean {
        if (Math.abs(obj1.pos.x - obj0.pos.x) > (obj1.halfWidth + obj0.radius)) {
            return false;
        } else if (Math.abs(obj1.pos.y - obj0.pos.y) > (obj1.halfHeight + obj0.radius)) {
            return false;
        } else {
            return true;
        }
    }
    public aabbCircle(obj0: AABB, obj1: Circle): boolean {
        return this.circleAABB(obj1, obj0);
    }

    public rectangleAABB(obj0: Rectangle, obj1: AABB): boolean {
        let halfWidth: number = obj0.width / 2;
        let halfHeight: number = obj0.height / 2;

        if (Math.abs(obj0.pos.x + halfWidth - obj1.pos.x) > (halfWidth + obj1.halfWidth)) {
            return false;
        } else if (Math.abs(obj0.pos.y + halfHeight - obj1.pos.y) > (halfHeight + obj1.halfHeight)) {
            return false;
        } else {
            return true;
        }
    }
    public aabbRectangle(obj0: AABB, obj1: Rectangle): boolean {
        return this.rectangleAABB(obj1, obj0);
    }

    public aabbAABB(obj0: AABB, obj1: AABB): boolean {
        if (Math.abs(obj0.pos.x - obj1.pos.x) > (obj0.halfWidth + obj1.halfWidth)) {
            return false;
        } else if (Math.abs(obj0.pos.y - obj1.pos.y) > (obj0.halfHeight + obj1.halfHeight)) {
            return false;
        } else {
            return true;
        }
    }
}
