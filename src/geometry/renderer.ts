import { GeometricEnum, GeometricObject } from './geometry';
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
import { PI } from '../utility/utility';

export function render(ctx: CanvasRenderingContext2D, object: GeometricObject): void {
    let renderer = new Renderer(ctx);
    renderer.render(object);
};

export class Renderer {
    private context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    public render(object: GeometricObject): void {
        if (!this.context) {
            throw new Error('Renderer must have a context for rendering.');
        }

        switch (object.type) {
            case GeometricEnum.POINT:
                this.renderPoint(object as Point);
                break;
            case GeometricEnum.VECTOR2:
                this.renderPoint(object as Vector2);
                break;
            case GeometricEnum.LINE:
                this.renderLine(object as Line);
                break;
            case GeometricEnum.AABB:
                this.renderAABB(object as AABB);
            break;
            case GeometricEnum.RECTANGLE:
                this.renderRectangle(object as Rectangle);
            break;
            case GeometricEnum.CIRCLE:
                this.renderCircle(object as Circle);
            break;
            default:
                throw new Error('Not recogniced as a renderable shape.');
        }
    }

    private renderPoint(obj: Point | Vector2): void {
        this.context.beginPath();
        this.context.arc(obj.x, obj.y, 1.0, 0, PI * 2);
        this.context.fill();
    }

    private renderLine(obj: Line): void {
        this.context.beginPath();
        this.context.moveTo(obj.start.x, obj.start.y);
        this.context.lineTo(obj.end.x, obj.end.x);
        this.context.stroke();
    }

    private renderAABB(obj: AABB): void {
        this.context.strokeRect(obj.pos.x - obj.halfWidth, obj.pos.y - obj.halfHeight, obj.halfWidth * 2, obj.halfHeight * 2);
    }

    private renderRectangle(obj: Rectangle): void {
        this.context.strokeRect(obj.pos.x, obj.pos.y, obj.width, obj.height);
    }

    private renderCircle(obj: Circle): void {
        this.context.beginPath();
        this.context.arc(obj.pos.x, obj.pos.y, obj.radius, 0, PI * 2);
        this.context.stroke();
    }
}
