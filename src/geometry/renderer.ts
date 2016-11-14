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
            case GeometricEnum.AABB:
                this.renderAABB(object as AABB);
            break;
            case GeometricEnum.RECTANGLE:
                this.renderRectangle(object as Rectangle);
            break;
        }
    }

    private renderAABB(obj: AABB): void {
        this.context.strokeRect(obj.pos.x + obj.halfWidth, obj.pos.y + obj.halfHeight, obj.halfWidth * 2, obj.halfHeight * 2);
    }

    private renderRectangle(obj: Rectangle): void {
        this.context.strokeRect(obj.pos.x, obj.pos.y, obj.width, obj.height);
    }
}
